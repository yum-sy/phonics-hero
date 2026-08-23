#!/usr/bin/env python3
"""Cut each phonics phoneme out of a real WORD and ship it as an asset.

WHY NOT TTS, AND WHY NOT A PHONEME SPELLING EITHER
--------------------------------------------------
Web Speech cannot say a bare phoneme, and the reason is worse than "it sounds
wrong". Measured with `say -v Samantha -r 88`, comparing md5 of the rendered
audio against the letter name spelled out the same number of times:

  sss  922ms == "ess ess ess"       BYTE-IDENTICAL
  mmm  736ms == "em em em"          BYTE-IDENTICAL
  lll  863ms == "el el el"          BYTE-IDENTICAL
  rrr  875ms == "ar ar ar"          BYTE-IDENTICAL
  zz   759ms == "zee zee"           BYTE-IDENTICAL
  ihh 1049ms == "eye aitch aitch"   BYTE-IDENTICAL
  (Alex adds fff == "eff eff eff" and aaa == "ay ay ay")

So the very first sound of the app was not /s/. It was "에스 에스 에스" -- the
letter name, three times. That is the actual identity of the user's complaint,
and no rate, gap or repeat-count change could ever have touched it.

A PULSE COUNT CANNOT SEE THIS, which is why the first version of this script
passed it. /s/ frication bridges the syllable boundaries, so the RMS envelope
of "ess ess ess" never drops below threshold and it reads as ONE pulse -- the
same reading a genuine drawn-out /s/ gives. Pulse counting is still worth
keeping (it catches stutter), but it is NOT a criterion on its own. It is used
here only alongside the md5 bait test and the spectral class check below.

THE FIX: TAKE THE PHONEME FROM A WORD
-------------------------------------
Once the sound is an asset there is no reason to ask TTS to read a notation as
a phoneme. `say sun` is dictionary pronunciation: the /s/ in it is guaranteed
to be /s/, a letter-name spell-out is impossible by construction, and the
invented notations that were teaching ghost phonemes (`ough`, `awh`, `eh` for
/e/ when the engine says /ei/) disappear as a category.

Segmenting without a forced aligner is the real work, and it is done with three
cheap per-frame descriptors instead of guesses:
  rms     loudness
  bright  RMS(first difference) / RMS(signal) -- a high-pass ratio, so it is
          ~1.4 for sibilant noise and ~0.15 for a vowel. This is what separates
          a fricative from the vowel after it, which loudness cannot do (a
          sibilant can be as loud as the vowel).
  zcr     zero crossings per sample -- a second, independent read on the same
          axis, used for verification rather than for cutting.

VERIFICATION, because a cutter nobody checks is worse than no cutter
--------------------------------------------------------------------
Every generated segment must satisfy all of:
  1. exactly one audible pulse;
  2. a length inside its class's measured range;
  3. materially shorter than the source word (it is a phoneme, not the word);
  4. spectral descriptors inside the range measured for its class -- this is
     what says "this is the fricative" rather than "this is some 260ms of
     something";
  5. AGREEMENT ACROSS TWO SOURCE WORDS. The same phoneme is cut from a second
     word and the two descriptor sets must match within tolerance. A cutting
     artifact does not reproduce across words; a phoneme does.
Anything that fails is reported by name and makes the script exit non-zero.
Nothing is shipped on a "close enough".

USAGE
  python3 scripts/gen-sounds.py            # generate + verify
  python3 scripts/gen-sounds.py --bait     # md5 spell-out test on notations
  python3 scripts/gen-sounds.py --probe    # per-word descriptor dump (tuning)
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
TMP_DIR = os.path.join(HERE, os.pardir, 'public', 'sounds', '.tmp')

# Samantha is the iOS en-US default and the voice every duration constant in
# src/audio.js is fitted to. -r 88 is where Web Speech's rate 0.5 (audio.js
# EN_RATE) lands on Apple's coarse rate buckets, and a slower word is also an
# easier word to segment.
VOICE = 'Samantha'
RATE = 88

# 22050 mono 16-bit PCM. WAV rather than AAC on purpose: an AAC encoder adds
# priming silence and does not round-trip a duration exactly, and these clips
# are 200-400ms where ~50ms of encoder padding is a defect the ear can hear.
# The whole corpus is ~350KB either way.
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

# ---------------------------------------------------------------------------
# CLASSES. The cut rule and the accept ranges both key off these.
#
# The `bright` bands are MEASURED (run --probe), not guessed. Every source word
# in the corpus, Samantha -r 88:
#   sibilant  1.69 - 1.89     nasal 0.06 - 0.09     liquid 0.06 - 0.09
#   vowel     0.12 - 0.25     plosive burst (pbright) 0.52 - 1.48
# The bands here are those ranges opened up enough to survive a different word,
# and they are what turns "I cut 260ms out of a word" into "I cut the /s/".
CLASSES = {
    #                    ms range      bright range   zcr range
    'sibilant': dict(ms=(150, 340), bright=(0.70, 2.00), zcr=(0.20, 0.90)),
    'nasal':    dict(ms=(150, 340), bright=(0.03, 0.45), zcr=(0.00, 0.25)),
    'liquid':   dict(ms=(150, 340), bright=(0.03, 0.55), zcr=(0.00, 0.30)),
    # A plosive ships as burst + vowel onset (see PLOSIVE_VOWEL_MS), so its
    # MEAN brightness is a vowel's. `pbright` is the burst itself.
    'plosive':  dict(ms=(100, 340), bright=(0.05, 2.00), zcr=(0.02, 0.90),
                     pbright=(0.40, 3.00)),
    # 120 rather than 260: a diphthong that legitimately refuses to stretch
    # (its identity is the glide, not a steady state) still ships at its
    # natural length instead of being dropped.
    'vowel':    dict(ms=(120, 400), bright=(0.02, 0.45), zcr=(0.00, 0.25)),
}

# ---------------------------------------------------------------------------
# THE CORPUS.
#
# key      the exact spoken string in the chapter data -- the asset key, which
#          is why none of this needs a chapter-data change
# klass    segmentation rule + accept ranges
# words    source words, best first. The FIRST one that passes every check is
#          shipped; the others are the cross-word agreement evidence, so there
#          must always be at least two.
# ms       target segment length
#
# Words are taken from the strings the chapters already speak wherever one
# exists (extracted from src/data/chapters/**, read-only), so the phoneme the
# child drills is the phoneme they then hear in the app's own words.
CORPUS = [
    ('sss', 'sibilant', ['sun', 'sat', 'sock'], 260),
    ('fff', 'sibilant', ['fit', 'fan'], 260),
    ('mmm', 'nasal', ['mat', 'man', 'moon'], 260),
    ('nnn', 'nasal', ['net', 'nut', 'nose'], 260),
    ('lll', 'liquid', ['lap', 'lid'], 260),
    ('rrr', 'liquid', ['rat', 'red', 'ring'], 260),
    # /z/ is not taught in chapters 1-8, so there is no corpus word for it and
    # these are ordinary English words instead.
    ('zz', 'sibilant', ['zip', 'zoo'], 260),
    ('tuh', 'plosive', ['top', 'tap'], 200),
    ('puh', 'plosive', ['pig', 'pen'], 200),
    ('kuh', 'plosive', ['cat', 'key', 'cake'], 200),
    ('buh', 'plosive', ['bag', 'bed', 'big'], 200),
    ('duh', 'plosive', ['dog', 'dad'], 200),
    ('guh', 'plosive', ['gap', 'gum', 'gift'], 200),
    ('huh', 'plosive', ['hat', 'hen', 'hand'], 200),
    ('juh', 'plosive', ['jam', 'jog'], 200),
    # Short vowels. Taking these from words is also the fix for a bug CLAUDE.md
    # records as open: A's target is /ae/ (apple) and the notation made the
    # engine say /ei/.
    ('aaa', 'vowel', ['cat', 'ant', 'apple'], 260),
    ('ihh', 'vowel', ['pin', 'ink', 'insect'], 260),
    ('eh', 'vowel', ['egg', 'ten', 'net'], 260),
    ('uh', 'vowel', ['nut', 'gum', 'sun'], 260),
    ('awh', 'vowel', ['dog', 'got'], 260),
    # Digraph long vowels. For these the letter name IS the target phoneme, so
    # the notation was not teaching the wrong sound -- but taking them from
    # words is what finally separates `a` from `eh`, which CLAUDE.md records as
    # a confirmed collision that broke a scored question.
    ('a', 'vowel', ['rain', 'cake', 'aim'], 260),
    ('ee', 'vowel', ['bee', 'tree'], 260),
    ('oh', 'vowel', ['boat', 'coat'], 260),
    ('eye', 'vowel', ['tie', 'pie'], 260),
    ('or', 'vowel', ['fork', 'corn'], 260),
]

# The notation each key USED to be spoken as, and the letter-name spell-out it
# turned out to be byte-identical to. Kept as a live test (--bait) rather than a
# comment: it is the evidence for why this script exists, and if a future voice
# stops folding them the decision can be revisited on measurement.
BAIT = {
    'sss': 'ess ess ess', 'fff': 'eff eff eff', 'nnn': 'en en en',
    'mmm': 'em em em', 'lll': 'el el el', 'rrr': 'ar ar ar',
    'zz': 'zee zee', 'aaa': 'ay ay ay', 'ihh': 'eye aitch aitch',
    'eh': 'ay', 'a': 'ay', 'oh': 'oh', 'ee': 'ee', 'eye': 'eye',
    'uh': 'you', 'awh': 'ay double-u aitch',
}


# ---------------------------------------------------------------------------
# audio plumbing

def say_pcm(text):
    os.makedirs(TMP_DIR, exist_ok=True)
    tag = hashlib.md5(text.encode()).hexdigest()[:10]
    aiff = os.path.join(TMP_DIR, tag + '.aiff')
    wav = os.path.join(TMP_DIR, tag + '.wav')
    subprocess.run(['say', '-v', VOICE, '-r', str(RATE), '-o', aiff, text],
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
    """Per-frame (rms, bright, zcr)."""
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
    """Whole-segment (rms, bright, zcr) -- what the class check reads."""
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

# How much of the following vowel a plosive keeps. A word-initial voiced
# plosive is almost pure burst -- measured 15ms for /b/ in "bag", 25ms for /d/
# in "dog", 20ms for /g/ in "gap" -- and 15ms of anything is inaudible to a
# 5-year-old. So a plosive ships as the burst plus the start of the real vowel
# next to it, which is a genuine CV fragment ("ba" out of "bag") rather than the
# invented schwa the old `buh` notation was asking the engine for. Plosives are
# the one class that cannot be lengthened any other way: their duration is
# articulation-bound, which is the same fact EN_RATE's comment in audio.js
# records from the other direction.
PLOSIVE_VOWEL_MS = 130


def onset_end(fr, peak, klass):
    """Frame index where the onset consonant gives way to the vowel.

    The discriminator has to differ by class, and getting this wrong is silent:
    the first version used the brightness rule for everything and cut /m/ at
    10ms, because a nasal is ALREADY dark, so "brightness has collapsed" was
    true at the nasal's own first frame.
      * sibilant / plosive -- noise or burst, much BRIGHTER than the vowel, so
        the boundary is where brightness collapses while the signal is loud.
      * nasal / liquid -- voiced and dark like the vowel, but much QUIETER, so
        the boundary is where loudness arrives.
    """
    pk = max(range(len(fr)), key=lambda i: fr[i][0])
    if klass in ('nasal', 'liquid'):
        # Loudness does NOT work here either, and that was the second wrong
        # guess: `say` renders a word-initial nasal loud enough to clear any
        # "the vowel has arrived" energy gate on its own first frame (measured:
        # /m/ in "mat" cut at 15ms). Brightness separates them after all --
        # just in the opposite direction from a sibilant. A nasal or liquid is
        # DARKER than the vowel that follows (0.06 against 0.21), so the
        # boundary is the first bright-enough frame, not the first loud one.
        for i in range(2, pk + 1):
            if fr[i][1] > 0.13 and fr[i][0] > peak * 0.35:
                return i
        return max(1, pk)
    for i in range(pk + 1):
        if fr[i][1] < 0.35 and fr[i][0] > peak * 0.30:
            return max(1, i)
    return max(1, pk)


def stretch_noise(seg, sr, target_ms):
    """Lengthen aperiodic frication by repeating its steady middle.

    Only ever called for sibilants, and that restriction is the whole
    justification: /s/ and /f/ are noise with no pitch, so a splice has no
    period to be out of step with and the join is inaudible -- sustaining /s/
    for longer is physically the same steady noise. A voiced sound cannot be
    treated this way (the splice would land mid-period and buzz), which is why
    nasals, liquids and vowels ship at whatever length the word gave them.
    """
    want = int(sr * target_ms / 1000)
    if len(seg) >= want:
        return seg
    a, b = len(seg) // 5, len(seg) - len(seg) // 5
    unit = seg[a:b]
    if len(unit) < sr // 100:
        return seg
    xf = min(len(unit) // 3, int(sr * 0.010))
    out = list(seg)
    while len(out) < want:
        nxt = list(unit)
        for i in range(xf):
            g = 0.5 - 0.5 * math.cos(math.pi * i / xf)
            out[-xf + i] = out[-xf + i] * (1 - g) + nxt[i] * g
        out.extend(nxt[xf:])
    return out[:want]


# Pitch is estimated over a short window in the MIDDLE of the segment, not over
# the whole of it. A vowel carved out of a word carries the word's intonation
# contour, so autocorrelation across the full nucleus is smeared by the pitch
# drift and reports "not periodic" for a perfectly ordinary vowel (measured:
# confidence 0.26-0.47 on the short vowels, against 0.98 on the nasals, whose
# segments are short enough that they cannot drift). A 60ms window is several
# periods at any speaking pitch and short enough to be locally steady.
PITCH_WINDOW_MS = 60


def period_of(seg, sr):
    """(period in samples, normalised autocorrelation confidence)."""
    full = [float(v) for v in seg]
    win = int(sr * PITCH_WINDOW_MS / 1000)
    if len(full) > win:
        a = (len(full) - win) // 2
        x = full[a:a + win]
    else:
        x = full
    n = len(x)
    lo, hi = int(sr / 400), min(int(sr / 60), n // 2)
    if hi <= lo:
        return 0, 0.0
    best, bestv = 0, 0.0
    for lag in range(lo, hi):
        m = n - lag
        num = ea = eb = 0.0
        for i in range(m):
            a, b = x[i], x[i + lag]
            num += a * b
            ea += a * a
            eb += b * b
        den = math.sqrt(ea * eb)
        v = (num / den) if den else 0.0
        if v > bestv:
            bestv, best = v, lag
    return best, bestv


# Below this the signal is not periodic enough for the splice to be inaudible,
# so the sound ships at its natural length and fails the length check instead
# of being quietly faked longer.
PERIODIC_MIN_CONF = 0.5


def stretch_periodic(seg, sr, target_ms):
    """Lengthen a VOICED sound by repeating whole pitch periods.

    Nasals, liquids and vowels come out of a word far shorter than a phonics
    drill wants (measured: /m/ in "mat" is 40ms, /r/ in "rat" 65ms), and the
    noise-repeat trick used for sibilants cannot be reused: a voiced sound has
    a period, and a splice that lands mid-period is a phase discontinuity, i.e.
    a buzz. So the loop unit here is an INTEGER NUMBER OF PITCH PERIODS and it
    is inserted at an exact multiple of the period from its own start -- the
    waveform continues in phase and there is nothing to cross-fade.

    Returns (segment, confidence). A low confidence means "not periodic", and
    the caller must not treat an unstretched segment as a success.
    """
    want = int(sr * target_ms / 1000)
    if len(seg) >= want:
        return seg, 1.0
    T, conf = period_of(seg, sr)
    if not T or conf < PERIODIC_MIN_CONF or len(seg) < 2 * T:
        return seg, conf
    # The loop unit comes from the steady middle for the same reason the pitch
    # estimate does, and it matters more for a diphthong: repeating a unit taken
    # from the glide would stutter the glide instead of holding the vowel.
    win = min(len(seg), max(2 * T, int(sr * PITCH_WINDOW_MS / 1000)))
    reps = max(1, win // T)
    unit_len = reps * T
    start = max(0, (len(seg) - unit_len) // 2)
    unit = list(seg[start:start + unit_len])
    out = list(seg)
    ins = start + unit_len
    while len(out) < want:
        out[ins:ins] = unit
        ins += unit_len
    return out[:want], conf


def cut_onset(samples, sr, target_ms, klass):
    """The word-initial consonant. Returns (segment, natural_ms)."""
    fr, step = frames(samples, sr)
    if not fr:
        return [], 0.0
    peak = max(f[0] for f in fr)
    end = onset_end(fr, peak, klass)
    hi = end * step
    if klass == 'plosive':
        hi = min(len(samples), hi + int(sr * PLOSIVE_VOWEL_MS / 1000))
        return fade(samples[0:hi]), hi / sr * 1000.0
    want = int(sr * target_ms / 1000)
    if hi <= want:
        seg = samples[0:hi]
    else:
        # Keep the part adjacent to the vowel: that is the fully-formed end of
        # the constriction, and where a natural /s/ or /m/ actually sits.
        seg = samples[hi - want:hi]
    return seg, len(seg) / sr * 1000.0


def cut_nucleus(samples, sr, target_ms):
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
    lo, hi = a * step, (b + 1) * step
    want = int(sr * target_ms / 1000)
    if hi - lo > want:
        mid = (lo + hi) // 2
        lo = max(lo, mid - want // 2)
        hi = lo + want
    return samples[lo:hi]


def extract(word, klass, target_ms):
    raw, sr = say_pcm(word)
    body = trim_word(raw, sr)
    if klass == 'vowel':
        seg = cut_nucleus(body, sr, target_ms)
        natural = len(seg) / sr * 1000.0
    else:
        seg, natural = cut_onset(body, sr, target_ms, klass)
    conf = 1.0
    if klass == 'sibilant':
        seg = stretch_noise(seg, sr, target_ms)
    elif klass in ('nasal', 'liquid', 'vowel'):
        seg, conf = stretch_periodic(seg, sr, target_ms)
    seg = fade(seg)
    rms, bright, zcr = descriptors(seg)
    pb = peak_bright(seg, sr)
    p, gaps = pulses([int(x) for x in seg], sr)
    return dict(word=word, sr=sr, seg=seg,
                word_ms=len(body) / sr * 1000.0,
                ms=len(seg) / sr * 1000.0, natural_ms=natural,
                rms=rms, bright=bright, zcr=zcr, pbright=pb, conf=conf,
                pulses=p, gaps=gaps)


# ---------------------------------------------------------------------------
# verification

# How far two words' extractions of the same phoneme may differ before the cut
# stops being evidence of a phoneme and starts being evidence of a cutter.
AGREE_BRIGHT = 0.45
AGREE_ZCR = 0.20


def failures_for(e, klass, spec):
    bad = []
    if e['pulses'] != 1:
        bad.append('pulses=%d (gaps %s)' % (e['pulses'], e['gaps']))
    if not spec['ms'][0] <= e['ms'] <= spec['ms'][1]:
        bad.append('ms=%.0f outside %s' % (e['ms'], spec['ms']))
    # Measured on the NATURAL cut, before any noise stretch: a stretched /s/ is
    # legitimately longer than the word it came from, and comparing the
    # stretched length here rejected a correct extraction ("fit" -> 85%).
    if e['natural_ms'] > e['word_ms'] * 0.8:
        bad.append('natural cut %.0fms is %.0f%% of the whole word'
                   % (e['natural_ms'], 100 * e['natural_ms'] / e['word_ms']))
    if not spec['bright'][0] <= e['bright'] <= spec['bright'][1]:
        bad.append('bright=%.2f outside %s (not a %s)'
                   % (e['bright'], spec['bright'], klass))
    if not spec['zcr'][0] <= e['zcr'] <= spec['zcr'][1]:
        bad.append('zcr=%.3f outside %s' % (e['zcr'], spec['zcr']))
    if 'pbright' in spec and not spec['pbright'][0] <= e['pbright'] <= spec['pbright'][1]:
        bad.append('pbright=%.2f outside %s (no burst -> not a plosive)'
                   % (e['pbright'], spec['pbright']))
    return bad


def build_one(key, klass, words, target_ms):
    spec = CLASSES[klass]
    tried = []
    for w in words:
        e = extract(w, klass, target_ms)
        e['bad'] = failures_for(e, klass, spec)
        tried.append(e)
    clean = [e for e in tried if not e['bad']]
    row = dict(key=key, klass=klass, tried=tried, chosen=None,
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
    print('%-5s %-9s %-7s %7s %7s %7s %7s %7s %7s %6s  %s'
          % ('key', 'class', 'word', 'word', 'seg', 'nat', 'bright', 'pbrt',
             'zcr/conf', 'puls', 'reject'))
    for key, klass, words, ms in CORPUS:
        for w in words:
            e = extract(w, klass, ms)
            bad = failures_for(e, klass, CLASSES[klass])
            print('%-5s %-9s %-7s %6.0fms %6.0fms %6.0fms %7.2f %7.2f %.3f/%.2f %5d  %s'
                  % (key, klass, w, e['word_ms'], e['ms'], e['natural_ms'],
                     e['bright'], e['pbright'], e['zcr'], e['conf'],
                     e['pulses'], '; '.join(bad)))
    return []


def report(rows):
    print('%-5s %-9s %-7s %7s %8s %7s %6s  %s'
          % ('key', 'class', 'source', 'ms', 'bright', 'zcr', 'pulses',
             'cross-word agreement'))
    bad = []
    for r in rows:
        c = r['chosen']
        if c is None:
            print('%-5s %-9s %-7s %7s %8s %7s %6s  --' % (
                r['key'], r['klass'], '-', '-', '-', '-', '-'))
            bad.append(r)
            continue
        a = r['agree']
        print('%-5s %-9s %-7s %6.0fms %8.2f %7.3f %6d  %s'
              % (r['key'], r['klass'], c['word'], c['ms'], c['bright'],
                 c['zcr'], c['pulses'],
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
    """Byte-identical assets are one sound to the ear. There should be none now
    -- two different words cannot render identically -- so any hit is a real
    failure rather than a known condition to be waived."""
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
        written.append(dict(key=r['key'], ms=ms, source=c['word'],
                            pulses=p, klass=r['klass'],
                            bright=round(c['bright'], 3),
                            bytes=os.path.getsize(path)))
    bad = report(rows)
    manifest = {
        'ext': EXT,
        'voice': VOICE,
        'rate': RATE,
        'sounds': {w['key']: {'ms': w['ms'], 'source': w['source'],
                              'pulses': w['pulses'], 'class': w['klass'],
                              'bright': w['bright']}
                   for w in written},
    }
    with open(os.path.join(OUT_DIR, 'manifest.json'), 'w') as fh:
        json.dump(manifest, fh, indent=1, sort_keys=False)
        fh.write('\n')
    total = sum(w['bytes'] for w in written)
    print('wrote %d assets, %.1f KB, ext=%s' % (len(written), total / 1024.0, EXT))
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
    print('%-5s %-7s %7s %6s  %s' % ('key', 'source', 'ms', 'pulses', 'verdict'))
    for key, meta in manifest['sounds'].items():
        path = os.path.join(OUT_DIR, '%s.%s' % (key, manifest['ext']))
        if not os.path.exists(path):
            print('%-5s %-7s %7s %6s  MISSING' % (key, meta['source'], '-', '-'))
            bad.append(key)
            continue
        s, sr = read_wav(path)
        p, _ = pulses(s, sr)
        ms = round(len(s) / sr * 1000)
        ok = p == 1 and abs(ms - meta['ms']) <= 1
        if not ok:
            bad.append(key)
        print('%-5s %-7s %6dms %6d  %s' % (key, meta['source'], ms, p,
                                           'ok' if ok else 'FAIL'))
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
