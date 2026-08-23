#!/usr/bin/env python3
"""Cut each phonics phoneme out of a real WORD and ship it as an asset.

WHY NOT TTS, AND WHY NOT A PHONEME SPELLING EITHER
--------------------------------------------------
Web Speech cannot say a bare phoneme, and the reason is worse than "it sounds
wrong". Comparing md5 of the rendered audio against the letter name spelled out
the same number of times (`say -v Samantha -r 88`, reproducible with --bait):

  sss  922ms == "ess ess ess"       BYTE-IDENTICAL
  mmm  736ms == "em em em"          BYTE-IDENTICAL
  lll  863ms == "el el el"          BYTE-IDENTICAL
  rrr  875ms == "ar ar ar"          BYTE-IDENTICAL
  zz   759ms == "zee zee"           BYTE-IDENTICAL
  ihh 1049ms == "eye aitch aitch"   BYTE-IDENTICAL
  (Alex adds fff == "eff eff eff" and aaa == "ay ay ay")

So the first sound of the app was never /s/. It was the letter name, three
times. A word is dictionary pronunciation, so the phoneme is guaranteed and a
letter-name spell-out is impossible by construction.

NOTHING IS EVER LENGTHENED. READ THIS BEFORE ADDING A TARGET DURATION.
----------------------------------------------------------------------
An earlier version of this script padded every non-plosive to a 260ms target --
sibilants by repeating the frication, voiced sounds by repeating whole pitch
periods. It passed every check here and was rejected on the real device:

    "ihh eh uh 이것도 세번 반복해서 불편해. 마치 양이 메에에에에 하는 것 같아"

The manifest confirmed it exactly: everything the user liked was at its natural
length (tuh 220, puh 190, buh 145) and everything they disliked was at exactly
260ms. Repeating a pitch period freezes the formants, and a vowel with frozen
formants is a bleat. The task was to remove repetition and the fix reintroduced
repetition one layer down.

So: no stretching, no target duration, natural length only. If a phoneme comes
out too short, the levers are, in order --
  1. A SLOWER SOURCE RATE. Real articulation, not repetition. Measured, it is a
     weak lever: +10-30% across the corpus (/s/ in "sun" 130 -> 150ms at
     -r 40), which matches what CLAUDE.md already records about rate.
  2. A WORD WHERE THE PHONEME IS LONGER. This is the strong lever, and the
     measurement is dramatic: a word-final consonant runs 2-5x its word-initial
     self. /m/ is 40ms in "mat" and 195ms in "gum"; /n/ 50ms in "net", 220ms in
     "moon"; /l/ 75 -> 190 ("bell"); /r/ 65 -> 160 ("car"); /s/ 130 -> 155
     ("bus"). The source word need not be in the curriculum -- the child only
     ever hears the extracted phoneme.
  3. SHIP IT SHORT. "buh" is 145ms and the user approved it. Short beats
     repeated.

ONE PULSE IS NECESSARY BUT NOT SUFFICIENT
-----------------------------------------
The pulse count passed the bleating vowels, exactly as it passed
`sss` == "ess ess ess" a round earlier. Both are the same failure: an RMS
envelope cannot see what a sound IS. So the accept gates are five independent
things (length, class, cross-word agreement, not-the-whole-word, and
self-similarity), and none of them is trusted alone.

`selfSim` is the direct guard against a return of the stretch: a spliced signal
contains a literally repeated block, so its long-lag autocorrelation is ~1.
Measured against the rejected build: the four period-repeated sounds scored
mmm 0.963, nnn 0.994, lll 0.960, rrr 0.972, against 0.094-0.147 for the eight
natural plosives. Its blind spot is named rather than papered over -- a
crossfaded NOISE loop does not correlate with itself (the rejected sss scored
0.170), so this catches the voiced splice, not every splice.

USAGE
  python3 scripts/gen-sounds.py            # generate + verify
  python3 scripts/gen-sounds.py --probe    # per-word descriptor dump (tuning)
  python3 scripts/gen-sounds.py --bait     # md5 spell-out test on notations
  python3 scripts/gen-sounds.py --check    # re-verify the committed assets
"""

import hashlib
import json
import math
import os
import struct
import subprocess
import sys
import wave

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIR = os.path.join(HERE, os.pardir, 'public', 'sounds')
TMP_DIR = os.path.join(OUT_DIR, '.tmp')

# Samantha is the iOS en-US default and the voice every duration constant in
# src/audio.js is fitted to.
VOICE = 'Samantha'

# Default source rate. -r 88 is where Web Speech's rate 0.5 (audio.js EN_RATE)
# lands on Apple's coarse rate buckets. Per-sound overrides live in CORPUS; it
# is a real lever but a weak one, so word choice does most of the work.
RATE = 88

# 22050 mono 16-bit PCM. WAV rather than AAC on purpose: an AAC encoder adds
# priming silence and does not round-trip a duration exactly, and these clips
# are 100-250ms where ~50ms of encoder padding is a defect the ear can hear.
SR = 22050
EXT = 'wav'

FRAME_MS = 5
PULSE_FRAME_MS = 10
PULSE_THRESH = 0.12
PULSE_GAP_MS = 40
FADE_MS = 15
# Gate for trimming leading/trailing silence off a word. Much lower than the
# pulse threshold because a word-initial fricative or plosive burst is quiet
# next to the vowel, and a 0.12 gate cuts the consonant off entirely.
SILENCE_GATE = 0.04

# How much of the following vowel a plosive keeps. A word-initial voiced plosive
# is almost pure burst -- measured 15ms for /b/ in "bag", 25ms for /d/ in "dog"
# -- and 15ms of anything is inaudible to a 5-year-old. So a plosive ships as
# the burst plus the start of the real vowel next to it: a genuine CV fragment
# ("ba" out of "bag") rather than the invented schwa the `buh` notation was
# asking the engine for. The user approved every one of these.
PLOSIVE_VOWEL_MS = 130

# ---------------------------------------------------------------------------
# CLASSES. The cut rule and the accept ranges both key off these.
#
# The `bright` bands are MEASURED (run --probe), not guessed. Samantha -r 88:
#   sibilant  1.29 - 1.89     nasal 0.06 - 0.12     liquid 0.08 - 0.20
#   vowel     0.12 - 0.25     plosive burst (pbright) 0.48 - 1.48
# The bands below are those ranges opened up enough to survive a different
# word. They are what turns "I cut 150ms out of a word" into "I cut the /s/".
#
# The `ms` bands are the NATURAL lengths this corpus actually produces, with a
# little air. They are deliberately loose at the bottom: a gate that demands a
# length nature does not supply is a gate that demands a stretch, and that is
# how the bleating vowels got shipped. If a sound fails one of these, the fix
# is a different word, never a longer file.
CLASSES = {
    'sibilant': dict(ms=(80, 320), bright=(0.70, 2.00), zcr=(0.20, 0.90)),
    'nasal':    dict(ms=(90, 320), bright=(0.03, 0.45), zcr=(0.00, 0.25)),
    'liquid':   dict(ms=(90, 320), bright=(0.03, 0.55), zcr=(0.00, 0.30)),
    'plosive':  dict(ms=(100, 340), bright=(0.05, 2.00), zcr=(0.02, 0.90),
                     pbright=(0.40, 3.00)),
    'vowel':    dict(ms=(80, 340), bright=(0.02, 0.45), zcr=(0.00, 0.25)),
}

# ---------------------------------------------------------------------------
# THE CORPUS.
#
# key    the exact spoken string in the chapter data -- the asset key, which is
#        why none of this needs a chapter-data change
# klass  segmentation rule + accept ranges
# pos    where in the word the phoneme sits: 'onset' | 'coda' | 'nucleus'.
#        This is the main tuning knob, because a coda consonant is 2-5x its
#        onset self (see the header).
# words  source words, best first. The FIRST one that passes every check is
#        shipped; the others are the cross-word agreement evidence, so there
#        must always be at least two.
# rate   optional source-rate override.
#
# Words come from the strings the chapters already speak wherever one works, so
# the phoneme the child drills is the phoneme they hear in the app's own words.
# Where the corpus has no word long enough (every coda below), an ordinary
# English word is used instead -- only the extracted phoneme is ever heard.
CORPUS = [
    # Continuants ship from CODA position: word-initial /m/ is 40ms, which is
    # why the rejected build felt it had to pad them.
    ('sss', 'sibilant', 'coda', ['bus', 'miss', 'hiss'], None),
    # /f/ is the exception -- a word-final /f/ is so weak the coda cut finds
    # 5-15ms of it ("off", "puff"), so /f/ stays word-initial.
    ('fff', 'sibilant', 'onset', ['fit', 'fan'], None),
    ('mmm', 'nasal', 'coda', ['gum', 'ham'], None),
    ('nnn', 'nasal', 'coda', ['moon', 'man'], None),
    ('lll', 'liquid', 'coda', ['bell', 'ball'], None),
    ('rrr', 'liquid', 'coda', ['car', 'four'], None),
    ('zz', 'sibilant', 'coda', ['buzz', 'fizz'], None),
    # Plosives: burst + vowel onset, all approved on the device at 145-220ms.
    ('tuh', 'plosive', 'onset', ['top', 'tap'], None),
    ('puh', 'plosive', 'onset', ['pig', 'pen'], None),
    ('kuh', 'plosive', 'onset', ['cat', 'key', 'cake'], None),
    ('buh', 'plosive', 'onset', ['bag', 'bed', 'big'], None),
    ('duh', 'plosive', 'onset', ['dog', 'dad'], None),
    ('guh', 'plosive', 'onset', ['gap', 'gum', 'gift'], None),
    ('huh', 'plosive', 'onset', ['hat', 'hen', 'hand'], None),
    ('juh', 'plosive', 'onset', ['jam', 'jog'], None),
    # Short vowels. Taking these from words is also the fix for a bug CLAUDE.md
    # records as open: A's target is /ae/ (apple) and the notation made the
    # engine say /ei/.
    ('aaa', 'vowel', 'nucleus', ['cat', 'ant', 'apple'], None),
    ('ihh', 'vowel', 'nucleus', ['ink', 'pin', 'insect'], None),
    ('eh', 'vowel', 'nucleus', ['bed', 'ten', 'net', 'egg'], None),
    ('uh', 'vowel', 'nucleus', ['mud', 'gum', 'nut'], None),
    ('awh', 'vowel', 'nucleus', ['got', 'dog', 'hot'], None),
    # Digraph long vowels. For these the letter name IS the target phoneme, so
    # the notation was not teaching the wrong sound -- but taking them from
    # words is what finally separates `a` from `eh`, which CLAUDE.md records as
    # a confirmed collision that broke a scored question.
    ('a', 'vowel', 'nucleus', ['rain', 'cake', 'aim'], None),
    ('ee', 'vowel', 'nucleus', ['bee', 'tree'], None),
    ('oh', 'vowel', 'nucleus', ['boat', 'coat'], None),
    ('eye', 'vowel', 'nucleus', ['tie', 'pie'], None),
    ('or', 'vowel', 'nucleus', ['corn', 'fork'], None),
]

# The notation each key used to be spoken as, and the letter-name spell-out it
# turned out to be byte-identical to. Kept as a live test (--bait) rather than a
# comment: it is the evidence for why this script exists.
BAIT = {
    'sss': 'ess ess ess', 'fff': 'eff eff eff', 'nnn': 'en en en',
    'mmm': 'em em em', 'lll': 'el el el', 'rrr': 'ar ar ar',
    'zz': 'zee zee', 'aaa': 'ay ay ay', 'ihh': 'eye aitch aitch',
    'eh': 'ay', 'a': 'ay', 'oh': 'oh', 'ee': 'ee', 'eye': 'eye',
    'uh': 'you', 'awh': 'ay double-u aitch',
}


# ---------------------------------------------------------------------------
# audio plumbing

def say_pcm(text, rate=None):
    rate = RATE if rate is None else rate
    os.makedirs(TMP_DIR, exist_ok=True)
    tag = hashlib.md5(('%s@%d' % (text, rate)).encode()).hexdigest()[:10]
    aiff = os.path.join(TMP_DIR, tag + '.aiff')
    wav = os.path.join(TMP_DIR, tag + '.wav')
    subprocess.run(['say', '-v', VOICE, '-r', str(rate), '-o', aiff, text],
                   check=True)
    subprocess.run(['afconvert', '-f', 'WAVE', '-d', 'LEI16', '-c', '1',
                    '-r', str(SR), aiff, wav],
                   check=True, stdout=subprocess.DEVNULL,
                   stderr=subprocess.DEVNULL)
    s, sr = read_wav(wav)
    os.remove(aiff)
    os.remove(wav)
    return s, sr


def say_md5(text):
    os.makedirs(TMP_DIR, exist_ok=True)
    aiff = os.path.join(TMP_DIR, 'bait.aiff')
    subprocess.run(['say', '-v', VOICE, '-r', str(RATE), '-o', aiff, text],
                   check=True)
    with open(aiff, 'rb') as fh:
        h = hashlib.md5(fh.read()).hexdigest()
    os.remove(aiff)
    return h


def read_wav(path):
    w = wave.open(path)
    try:
        if w.getsampwidth() != 2 or w.getnchannels() != 1:
            raise SystemExit('%s is not mono 16-bit' % path)
        raw = w.readframes(w.getnframes())
        sr = w.getframerate()
    finally:
        w.close()
    return list(struct.unpack('<%dh' % (len(raw) // 2), raw)), sr


def write_wav(path, samples, sr):
    w = wave.open(path, 'w')
    w.setnchannels(1)
    w.setsampwidth(2)
    w.setframerate(sr)
    w.writeframes(struct.pack('<%dh' % len(samples),
                              *[max(-32768, min(32767, int(x))) for x in samples]))
    w.close()


def frames(samples, sr, ms=FRAME_MS):
    """Per-frame (rms, bright, zcr).

    `bright` is RMS(first difference) / RMS(signal) -- a high-pass ratio, so it
    is ~1.9 for sibilant noise and ~0.15 for a vowel. It is what separates a
    fricative from the vowel next to it, which loudness cannot do: a sibilant
    can be as loud as the vowel.
    """
    step = max(1, sr * ms // 1000)
    out = []
    for i in range(0, len(samples) - step + 1, step):
        blk = samples[i:i + step]
        rms = math.sqrt(sum(x * x for x in blk) / len(blk))
        d = [blk[j] - blk[j - 1] for j in range(1, len(blk))]
        drms = math.sqrt(sum(x * x for x in d) / len(d)) if d else 0.0
        z = sum(1 for j in range(1, len(blk))
                if (blk[j] >= 0) != (blk[j - 1] >= 0)) / float(len(blk))
        out.append((rms, (drms / rms) if rms > 1 else 0.0, z))
    return out, step


def descriptors(seg):
    if not seg:
        return 0.0, 0.0, 0.0
    rms = math.sqrt(sum(x * x for x in seg) / len(seg))
    d = [seg[j] - seg[j - 1] for j in range(1, len(seg))]
    drms = math.sqrt(sum(x * x for x in d) / len(d)) if d else 0.0
    z = sum(1 for j in range(1, len(seg))
            if (seg[j] >= 0) != (seg[j - 1] >= 0)) / float(len(seg))
    return rms, (drms / rms) if rms > 1 else 0.0, z


def peak_bright(seg, sr):
    """Brightest 5ms frame. This is what identifies a PLOSIVE: its burst is a
    single very bright frame, and whole-segment brightness cannot see it because
    the CV fragment's vowel outweighs the burst 10:1 by duration."""
    fr, _ = frames([int(x) for x in seg], sr)
    return max((f[1] for f in fr), default=0.0)


# Lags shorter than this are pitch periods, which every voiced sound has and
# which are not evidence of anything. A splice repeats a whole loop unit, and
# the units this script's rejected version used were 60ms and up.
SELFSIM_MIN_LAG_MS = 40
SELFSIM_DOWNSAMPLE = 5


def self_similarity(seg):
    """Peak long-lag normalised autocorrelation: ~1 means a literal repeat.

    The direct test for the defect that got the previous build rejected. See
    the module header for the measured separation and for the blind spot.
    """
    x = [float(v) for v in seg][::SELFSIM_DOWNSAMPLE]
    fs = float(SR) / SELFSIM_DOWNSAMPLE
    n = len(x)
    lo, hi = int(fs * SELFSIM_MIN_LAG_MS / 1000), n // 2
    best = 0.0
    for lag in range(lo, hi):
        m = n - lag
        num = ea = eb = 0.0
        for i in range(m):
            a, b = x[i], x[i + lag]
            num += a * b
            ea += a * a
            eb += b * b
        den = math.sqrt(ea * eb)
        if den:
            v = num / den
            if v > best:
                best = v
    return best


def pulses(samples, sr):
    step = max(1, sr * PULSE_FRAME_MS // 1000)
    env = []
    for i in range(0, len(samples) - step + 1, step):
        blk = samples[i:i + step]
        env.append(math.sqrt(sum(x * x for x in blk) / len(blk)))
    if not env:
        return 0, []
    peak = max(env)
    if peak <= 0:
        return 0, []
    on = [v > peak * PULSE_THRESH for v in env]
    runs, i = [], 0
    while i < len(on):
        if on[i]:
            j = i
            while j < len(on) and on[j]:
                j += 1
            runs.append([i, j])
            i = j
        else:
            i += 1
    if not runs:
        return 0, []
    merged, gaps = [runs[0]], []
    for start, end in runs[1:]:
        gap = (start - merged[-1][1]) * PULSE_FRAME_MS
        if gap < PULSE_GAP_MS:
            merged[-1][1] = end
        else:
            gaps.append(gap)
            merged.append([start, end])
    return len(merged), gaps


def fade(seg):
    n = min(int(SR * FADE_MS / 1000), len(seg) // 2)
    seg = [float(x) for x in seg]
    for i in range(n):
        g = 0.5 - 0.5 * math.cos(math.pi * i / n)
        seg[i] *= g
        seg[-1 - i] *= g
    return seg


def trim_word(samples, sr):
    """Strip silence around a word with a gate low enough to keep the onset."""
    fr, step = frames(samples, sr)
    if not fr:
        return samples
    peak = max(f[0] for f in fr)
    if peak <= 0:
        return samples
    on = [i for i, f in enumerate(fr) if f[0] > peak * SILENCE_GATE]
    if not on:
        return samples
    lo = max(0, on[0] * step - step)
    hi = min(len(samples), (on[-1] + 1) * step + step)
    return samples[lo:hi]


# ---------------------------------------------------------------------------
# segmentation
#
# The discriminator differs by class, and getting it wrong is SILENT -- an
# earlier version used the brightness rule for everything and cut /m/ at 10ms,
# because a nasal is already dark, so "brightness has collapsed" was true at the
# nasal's own first frame. Then loudness was tried and was wrong too: `say`
# renders a word-initial nasal loud enough to clear any "the vowel has arrived"
# energy gate on its own first frame.
#
#   sibilant / plosive  noise or burst, much BRIGHTER than the vowel
#   nasal / liquid      voiced and dark like the vowel, but much QUIETER

def onset_end(fr, peak, klass):
    """Frame index where a word-initial consonant gives way to the vowel."""
    pk = max(range(len(fr)), key=lambda i: fr[i][0])
    if klass in ('nasal', 'liquid'):
        for i in range(2, pk + 1):
            if fr[i][1] > 0.13 and fr[i][0] > peak * 0.35:
                return i
        return max(1, pk)
    for i in range(pk + 1):
        if fr[i][1] < 0.35 and fr[i][0] > peak * 0.30:
            return max(1, i)
    return max(1, pk)


def coda_start(fr, peak, klass):
    """Frame index where a word-final consonant begins, scanning after the
    vowel peak. The mirror of onset_end, and the reason the continuants are
    usable at all."""
    pk = max(range(len(fr)), key=lambda i: fr[i][0])
    for i in range(pk, len(fr)):
        if klass in ('nasal', 'liquid'):
            if fr[i][0] < peak * 0.45:
                return i
        elif fr[i][1] > 0.60:
            return i
    return None


def cut_onset(samples, sr, klass):
    fr, step = frames(samples, sr)
    if not fr:
        return []
    peak = max(f[0] for f in fr)
    hi = onset_end(fr, peak, klass) * step
    if klass == 'plosive':
        hi = min(len(samples), hi + int(sr * PLOSIVE_VOWEL_MS / 1000))
    return samples[0:hi]


def cut_coda(samples, sr, klass):
    fr, step = frames(samples, sr)
    if not fr:
        return []
    peak = max(f[0] for f in fr)
    start = coda_start(fr, peak, klass)
    if start is None:
        return []
    return samples[start * step:]


def cut_nucleus(samples, sr):
    """The steady part of the vowel: expand around the loudest frame."""
    fr, step = frames(samples, sr)
    if not fr:
        return []
    peak = max(f[0] for f in fr)
    pk = max(range(len(fr)), key=lambda i: fr[i][0])
    a = pk
    while a > 0 and fr[a - 1][0] > peak * 0.55 and fr[a - 1][1] < 0.45:
        a -= 1
    b = pk
    while b + 1 < len(fr) and fr[b + 1][0] > peak * 0.55 and fr[b + 1][1] < 0.45:
        b += 1
    return samples[a * step:(b + 1) * step]


def extract(word, klass, pos, rate=None):
    raw, sr = say_pcm(word, rate)
    body = trim_word(raw, sr)
    if pos == 'nucleus':
        seg = cut_nucleus(body, sr)
    elif pos == 'coda':
        seg = cut_coda(body, sr, klass)
    else:
        seg = cut_onset(body, sr, klass)
    seg = fade(seg)
    rms, bright, zcr = descriptors(seg)
    p, gaps = pulses([int(x) for x in seg], sr)
    return dict(word=word, sr=sr, seg=seg, pos=pos,
                word_ms=len(body) / sr * 1000.0,
                ms=len(seg) / sr * 1000.0,
                rms=rms, bright=bright, zcr=zcr,
                pbright=peak_bright(seg, sr),
                selfsim=self_similarity(seg),
                pulses=p, gaps=gaps)


# ---------------------------------------------------------------------------
# verification

# How far two words' extractions of the same phoneme may differ before the cut
# stops being evidence of a phoneme and starts being evidence of a cutter.
AGREE_BRIGHT = 0.45
AGREE_ZCR = 0.20

# Above this the segment contains a literally repeated block. Set well clear of
# both measured populations: 0.147 was the worst natural sound, 0.960 the best
# spliced one.
SELFSIM_MAX = 0.90


def failures_for(e, klass, spec):
    bad = []
    if e['pulses'] != 1:
        bad.append('pulses=%d (gaps %s)' % (e['pulses'], e['gaps']))
    if not spec['ms'][0] <= e['ms'] <= spec['ms'][1]:
        bad.append('ms=%.0f outside %s -- pick a different WORD, never a '
                   'longer file' % (e['ms'], spec['ms']))
    if e['ms'] > e['word_ms'] * 0.8:
        bad.append('%.0fms is %.0f%% of the whole word'
                   % (e['ms'], 100 * e['ms'] / e['word_ms']))
    if not spec['bright'][0] <= e['bright'] <= spec['bright'][1]:
        bad.append('bright=%.2f outside %s (not a %s)'
                   % (e['bright'], spec['bright'], klass))
    if not spec['zcr'][0] <= e['zcr'] <= spec['zcr'][1]:
        bad.append('zcr=%.3f outside %s' % (e['zcr'], spec['zcr']))
    if 'pbright' in spec and not spec['pbright'][0] <= e['pbright'] <= spec['pbright'][1]:
        bad.append('pbright=%.2f outside %s (no burst -> not a plosive)'
                   % (e['pbright'], spec['pbright']))
    if e['selfsim'] > SELFSIM_MAX:
        bad.append('selfsim=%.3f > %.2f -- contains a repeated block'
                   % (e['selfsim'], SELFSIM_MAX))
    return bad


def build_one(key, klass, pos, words, rate):
    spec = CLASSES[klass]
    tried = []
    for w in words:
        e = extract(w, klass, pos, rate)
        e['bad'] = failures_for(e, klass, spec)
        tried.append(e)
    clean = [e for e in tried if not e['bad']]
    row = dict(key=key, klass=klass, pos=pos, tried=tried, chosen=None,
               agree=None, bad=[])
    if not clean:
        row['bad'] = ['no source word produced an acceptable %s: %s' % (
            klass, '; '.join('%s(%s)' % (e['word'], ', '.join(e['bad']))
                             for e in tried))]
        return row
    row['chosen'] = clean[0]
    # Cross-word agreement: a cutting artifact does not reproduce in a second
    # word. Compared against the other CLEAN extractions only -- a word whose
    # own class check failed is not evidence either way.
    others = clean[1:]
    if not others:
        row['bad'] = ['only one source word (%s) passed, so there is no '
                      'cross-word evidence that the cut found the phoneme'
                      % clean[0]['word']]
        return row
    c = row['chosen']
    best = min(others, key=lambda o: abs(o['bright'] - c['bright']))
    db = abs(best['bright'] - c['bright'])
    dz = abs(best['zcr'] - c['zcr'])
    row['agree'] = dict(word=best['word'], dbright=db, dzcr=dz)
    if db > AGREE_BRIGHT or dz > AGREE_ZCR:
        row['bad'] = ['%s and %s disagree: dbright=%.2f (max %.2f) '
                      'dzcr=%.3f (max %.3f)'
                      % (c['word'], best['word'], db, AGREE_BRIGHT,
                         dz, AGREE_ZCR)]
    return row


# ---------------------------------------------------------------------------
# modes

def bait():
    print('%-5s %-22s %s' % ('key', 'letter-name bait', 'verdict'))
    hits = []
    for key, spell in BAIT.items():
        same = say_md5(key) == say_md5(spell)
        if same:
            hits.append(key)
        print('%-5s %-22s %s' % (key, '"%s"' % spell,
                                 'SPELLOUT (byte-identical)' if same else 'distinct'))
    print('\n%d of %d notations render as a letter name on %s -r %d'
          % (len(hits), len(BAIT), VOICE, RATE))
    print('  ' + ' '.join(hits))
    print('This is why the assets come from words. It is NOT a failure of this '
          'script -- exit 0.')
    return []


def probe():
    print('%-5s %-9s %-8s %-7s %7s %7s %7s %7s %7s %6s  %s'
          % ('key', 'class', 'pos', 'word', 'word', 'seg', 'bright', 'pbrt',
             'zcr', 'selfs', 'reject'))
    for key, klass, pos, words, rate in CORPUS:
        for w in words:
            e = extract(w, klass, pos, rate)
            bad = failures_for(e, klass, CLASSES[klass])
            print('%-5s %-9s %-8s %-7s %6.0fms %6.0fms %7.2f %7.2f %7.3f %6.3f  %s'
                  % (key, klass, pos, w, e['word_ms'], e['ms'], e['bright'],
                     e['pbright'], e['zcr'], e['selfsim'], '; '.join(bad)))
    return []


def report(rows):
    print('%-5s %-9s %-8s %-7s %7s %7s %6s %6s  %s'
          % ('key', 'class', 'pos', 'source', 'ms', 'bright', 'selfs', 'puls',
             'cross-word agreement'))
    bad = []
    for r in rows:
        c = r['chosen']
        if c is None:
            print('%-5s %-9s %-8s %-7s %7s %7s %6s %6s  --'
                  % (r['key'], r['klass'], r['pos'], '-', '-', '-', '-', '-'))
            bad.append(r)
            continue
        a = r['agree']
        print('%-5s %-9s %-8s %-7s %6.0fms %7.2f %6.3f %6d  %s'
              % (r['key'], r['klass'], r['pos'], c['word'], c['ms'],
                 c['bright'], c['selfsim'], c['pulses'],
                 ('%s dbright=%.2f dzcr=%.3f' % (a['word'], a['dbright'], a['dzcr']))
                 if a else 'NONE'))
        if r['bad']:
            bad.append(r)
    print('\n%d sounds, %d ok, %d FAIL' % (len(rows), len(rows) - len(bad), len(bad)))
    for r in bad:
        for msg in (r['bad'] or ['no acceptable extraction']):
            print('  FAIL %s: %s' % (r['key'], msg))
    return bad


def collisions(keys):
    """Byte-identical assets are one sound to the ear. Two different words
    cannot render identically, so any hit here is a real failure."""
    by_hash = {}
    for k in keys:
        path = os.path.join(OUT_DIR, '%s.%s' % (k, EXT))
        if not os.path.exists(path):
            continue
        with open(path, 'rb') as fh:
            by_hash.setdefault(hashlib.md5(fh.read()).hexdigest(), []).append(k)
    out = []
    for group in sorted(by_hash.values()):
        if len(group) > 1:
            out.append(sorted(group))
            print('FAIL collision: %s are byte-identical' % ' == '.join(sorted(group)))
    if not out:
        print('no byte-identical asset pairs')
    return out


def generate():
    rows = [build_one(*row) for row in CORPUS]
    written = []
    for r in rows:
        if r['chosen'] is None or r['bad']:
            continue
        c = r['chosen']
        path = os.path.join(OUT_DIR, '%s.%s' % (r['key'], EXT))
        write_wav(path, c['seg'], c['sr'])
        # Re-measure from DISK: these are the bytes the browser fetches, and a
        # bug in write_wav would otherwise be invisible to the check meant to
        # catch it.
        back, bsr = read_wav(path)
        p, _ = pulses(back, bsr)
        ms = round(len(back) / bsr * 1000)
        if p != 1:
            r['bad'] = ['written file re-reads as %d pulses' % p]
            continue
        written.append(dict(
            key=r['key'], ms=ms,
            # naturalMs and stretch exist so that "is this one padded?" is
            # answerable from outside the audio. The rejected build could only
            # be diagnosed by noticing that every bad sound was exactly 260ms,
            # which cost a round. stretch == 1.0 on every line is the standing
            # proof that nothing is lengthened.
            naturalMs=ms, stretch=1.0,
            source=c['word'], pos=r['pos'], klass=r['klass'], pulses=p,
            selfSim=round(c['selfsim'], 3), bright=round(c['bright'], 3),
            bytes=os.path.getsize(path)))
    bad = report(rows)
    manifest = {
        'ext': EXT,
        'voice': VOICE,
        'rate': RATE,
        'sounds': {w['key']: {'ms': w['ms'], 'naturalMs': w['naturalMs'],
                              'stretch': w['stretch'], 'source': w['source'],
                              'pos': w['pos'], 'class': w['klass'],
                              'pulses': w['pulses'], 'selfSim': w['selfSim'],
                              'bright': w['bright']}
                   for w in written},
    }
    with open(os.path.join(OUT_DIR, 'manifest.json'), 'w') as fh:
        json.dump(manifest, fh, indent=1, sort_keys=False)
        fh.write('\n')
    total = sum(w['bytes'] for w in written)
    lens = sorted(w['ms'] for w in written)
    print('wrote %d assets, %.1f KB, ext=%s, %d-%dms (all stretch 1.0)'
          % (len(written), total / 1024.0, EXT, lens[0], lens[-1]))
    stale = [f for f in os.listdir(OUT_DIR)
             if f.endswith('.' + EXT)
             and f[:-len(EXT) - 1] not in {w['key'] for w in written}]
    for f in sorted(stale):
        print('STALE %s -- an earlier run wrote it and this one did not' % f)
    return bad + collisions([w['key'] for w in written]) + stale


def check():
    with open(os.path.join(OUT_DIR, 'manifest.json')) as fh:
        manifest = json.load(fh)
    bad = []
    print('%-5s %-7s %-8s %7s %6s %6s  %s'
          % ('key', 'source', 'pos', 'ms', 'puls', 'selfs', 'verdict'))
    for key, meta in manifest['sounds'].items():
        path = os.path.join(OUT_DIR, '%s.%s' % (key, manifest['ext']))
        if not os.path.exists(path):
            print('%-5s %-7s %-8s %7s %6s %6s  MISSING'
                  % (key, meta['source'], meta['pos'], '-', '-', '-'))
            bad.append(key)
            continue
        s, sr = read_wav(path)
        p, _ = pulses(s, sr)
        ms = round(len(s) / sr * 1000)
        ss = self_similarity(s)
        why = []
        if p != 1:
            why.append('%d pulses' % p)
        if abs(ms - meta['ms']) > 1:
            why.append('%dms != manifest %d' % (ms, meta['ms']))
        if meta['stretch'] != 1.0 or meta['naturalMs'] != meta['ms']:
            why.append('manifest claims a stretch')
        if ss > SELFSIM_MAX:
            why.append('selfsim %.3f' % ss)
        if why:
            bad.append(key)
        print('%-5s %-7s %-8s %6dms %6d %6.3f  %s'
              % (key, meta['source'], meta['pos'], ms, p, ss,
                 'ok' if not why else 'FAIL ' + '; '.join(why)))
    print('\n%d assets, %d FAIL' % (len(manifest['sounds']), len(bad)))
    return bad + collisions(list(manifest['sounds']))


if __name__ == '__main__':
    os.makedirs(OUT_DIR, exist_ok=True)
    if '--bait' in sys.argv:
        failures = bait()
    elif '--probe' in sys.argv:
        failures = probe()
    elif '--check' in sys.argv:
        failures = check()
    else:
        failures = generate()
    if os.path.isdir(TMP_DIR) and not os.listdir(TMP_DIR):
        os.rmdir(TMP_DIR)
    sys.exit(1 if failures else 0)
