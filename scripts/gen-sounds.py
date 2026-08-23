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
    # Only for pos == 'nucleus-steady' (see cut_nucleus_steady). The floor is
    # lower than plain 'vowel' -- 60 instead of 80 -- because the true steady
    # state of a short lax vowel inside a CVC word is legitimately shorter than
    # the whole nucleus these five sounds used to ship as (that whole-nucleus
    # cut is exactly what got rejected: it read as consonant + vowel, e.g.
    # "ca(t)" instead of pure /ae/). This entry never touches CLASSES['vowel'],
    # so the five already-approved long vowels (a/ee/oh/eye/or) are unaffected.
    'vowel-steady': dict(ms=(60, 340), bright=(0.02, 0.45), zcr=(0.00, 0.25)),
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
    #
    # pos == 'nucleus-steady', not 'nucleus': real-device QA on the plain
    # nucleus cut (the whole voiced vowel span) rejected all five --
    # "cat -> aaa read as ca(t)" -- because the span starts right where a
    # released consonant's formant transition is still moving, and that
    # transition can outlast the loudness/noise gate that finds the span's
    # edge. 'nucleus-steady' narrows to the flattest part of that span (see
    # cut_nucleus_steady). This does NOT touch cut_nucleus itself or the
    # 'nucleus' pos, so a/ee/oh/eye/or below are unaffected -- same bytes as
    # before, same OK verdicts.
    #
    # 'uh' lost its first two source words entirely rather than being left to
    # the gates: "mud" and "nut" both onset on a nasal (/m/, /n/), and a nasal
    # murmur is exactly the contamination 'nucleus-steady' is narrowing away
    # from. It is not reliably caught by the numeric gates alone -- "mud"
    # failed the new selfsim ceiling (0.454), but "nut" happened not to
    # (0.000) despite the same onset, so the fix is the word choice, not just
    # the check. "gum"/"hug"/"bug" all onset on a stop or fricative, which the
    # brightness-based span detector already handles correctly (see "cat").
    #
    # Third round: the gallery called these five "정확한 발음이긴한데 너무
    # 짧다" against `a`/`ee` (145-210ms) -- correct, but too brief to register
    # as a held sound next to its neighbours. See NUCLEUS_STEADY_WINDOW_FRAC's
    # own comment for the fix (0.55 -> 0.85, claiming more of the SAME real
    # steady state -- not repetition). `aaa` alone also carries rate=60 here:
    # at the shared 0.85 fraction and the default rate, "cat"'s edgeFluxRatio
    # measured right at the 2.0 ceiling (its core span is short enough that
    # 85% of it still touches onset residue); a slower source rate gives it a
    # longer core to draw the same 85% from, and 155ms/selfsim .093/efr .82
    # cleared both gates with margin. The other four needed no rate change --
    # 0.85 alone put them at 130-150ms inside both gates (see the constant's
    # comment for the per-sound numbers).
    ('aaa', 'vowel', 'nucleus-steady', ['cat', 'ant', 'apple'], 60),
    ('ihh', 'vowel', 'nucleus-steady', ['ink', 'pin', 'insect'], None),
    ('eh', 'vowel', 'nucleus-steady', ['bed', 'ten', 'net', 'egg'], None),
    ('uh', 'vowel', 'nucleus-steady', ['gum', 'hug', 'bug'], None),
    ('awh', 'vowel', 'nucleus-steady', ['got', 'dog', 'hot'], None),
    # Digraph long vowels. For these the letter name IS the target phoneme, so
    # the notation was not teaching the wrong sound -- but taking them from
    # words is what finally separates `a` from `eh`, which CLAUDE.md records as
    # a confirmed collision that broke a scored question.
    #
    # Second round: the gallery graded all five NO, and the reason is the same
    # defect as aaa/ihh/eh/uh/awh above -- rain/bee/boat/tie/corn all onset on a
    # consonant, and the plain 'nucleus' cut can carry a few tens of ms of that
    # consonant's formant transition at the front.
    #
    # These five did NOT get 'nucleus-steady', though, and that is a deliberate
    # different fix, not an oversight. Three of them (a/oh/eye) are true
    # diphthongs -- /eI/, /oU/, /aI/ -- whose formants are SUPPOSED to keep
    # moving through the whole vowel. cut_nucleus_steady searches for the
    # FLATTEST window, and measured on "rain": that search picks
    # window=[5,23], starting at frame 5 (0% into the span) with a bright range
    # of [0.05,0.25] -- i.e. it keeps the /r/-onset murmur AND most of the
    # glide, because a smooth ramp scores as "flat" under a sum-of-consecutive-
    # deltas metric just as readily as a true plateau does. Narrowing further
    # risks trimming the glide down to whichever end happens to look flattest,
    # which would swap "onset consonant blended in" for "diphthong flattened
    # into a monophthong" -- a different defect, not a fix.
    #
    # So instead of a new cut, these use THE SAME 'nucleus' cut as before, on a
    # VOWEL-INITIAL word: rain(/r/)->aim, bee(/b/)->eel, boat(/b/)->oat,
    # tie(/t/)->ice, corn(/k/)->orb. With no onset consonant at all there is
    # nothing for the cut to blend in, so the whole natural core span IS the
    # vowel -- diphthong glide included, untouched -- and it needed no new
    # segmentation code, which is the safer fix per se (a word swap cannot
    # introduce a new class of segmentation bug; new code can).
    #
    # `a` needed a slower source rate too: at the default -r 88, "aim"'s own
    # core span is only 55ms (measured) -- long enough to pass every gate here,
    # but likely too brief for a 5-year-old to register the glide at all. -r 60
    # is real articulation (see EN_RATE's comment in audio.js on why rate is a
    # legitimate lever for a continuant), not the repetition this whole
    # conversion exists to remove -- 145ms at -r 60, still one pulse, still
    # vowel-initial.
    #
    # `ee`/`or` are not true diphthongs by the same test -- English /i:/ and
    # /o:r/-with-rhotic-coloring are usually described as a single target with
    # at most a glide-like offset, not two vowel qualities -- but the safer fix
    # applied regardless: eel/east and or/ornate are vowel-initial too, so the
    # question of whether narrowing would clip a glide never has to be
    # answered for them either.
    #
    # Third round: `a`/`ee` were graded OK; `oh`/`eye`/`or` were graded NO
    # again even though their length is in the same 145-210ms band as `a`
    # (165/145/155ms) -- so length was not the (or at least not the whole)
    # cause for these three, and the fix below is a MEASURED cause, not a
    # guess standing in for one.
    #
    # Checked with a new tail-side edge_flux_ratio (same metric as the onset
    # check, computed over the LAST 20ms instead of the first): oat scored
    # 2.09 and orb scored 2.08, both above the 2.0 ceiling this project already
    # treats as "still transitioning" at the front -- i.e. the coda's own
    # formant transition was bleeding into the BACK of the cut, the mirror of
    # the defect the first round fixed at the front. "ice" (old eye source)
    # scored a more moderate 1.11.
    #
    # The words that replace them all remove the offending coda rather than
    # trying to cut around it (a word swap is still the safer fix -- see the
    # comment above this block):
    #   oh:  oat(/t/, tail 2.09) -> own(/n/, tail 0.44 at -r 60). A nasal coda
    #        is voiced and gradual like the vowel itself, the same reason a
    #        sonorant onset was gentler than a stop's burst in the first
    #        round's fix -- and it measures that way at the tail too.
    #   eye: ice(/s/, tail 1.11) -> isle (no coda at all -- the "isle" in
    #        "aisle" is a closed syllable ending in the vowel itself, /l/
    #        having gone silent). tail 0.15, the lowest of any candidate
    #        tried. `eye` (the word) is kept as the second source: it also has
    #        no coda (tail 0.33) and is literally the letter name.
    #   or:  orb(/rb/, tail 2.08) -> or (the word itself -- open syllable, the
    #        r-vowel IS the end of the word, nothing after it to transition
    #        into). tail 0.36 at -r 60; needed the slower rate because "or" at
    #        the default rate renders as a 10ms sliver (measured), too short
    #        for any gate. "ornate" stays as the second source -- its coda is
    #        much further from the vowel (an unstressed syllable away) and it
    #        already measured clean.
    #
    # One head-side number looks alarming and is NOT evidence of anything:
    # vowel-initial "eye"/"isle" measure edgeFluxRatio 5.99/2.20 at the FRONT.
    # That is the diphthong's own glide starting from silence, not a
    # consonant -- a diphthong's formants are supposed to be moving right from
    # its onset, and there is no onset consonant left to blame it on. The
    # gate that would fire on that (NUCLEUS_STEADY_EDGE_FLUX_MAX) is not even
    # applied to pos == 'nucleus', which is the other reason this is safe.
    ('a', 'vowel', 'nucleus', ['aim', 'ate'], 60),
    ('ee', 'vowel', 'nucleus', ['eel', 'east'], None),
    ('oh', 'vowel', 'nucleus', ['own', 'ohm'], 60),
    ('eye', 'vowel', 'nucleus', ['isle', 'eye'], None),
    ('or', 'vowel', 'nucleus', ['or', 'ornate'], 60),
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


# How many leading ms count as "the edge" for the contamination check below.
# 20ms is about 4 frames at FRAME_MS=5 -- enough to average out single-frame
# noise, short enough to stay inside an onset transition rather than spanning
# past it into the steady vowel.
EDGE_MS = 20


def edge_flux_ratio(seg, sr):
    """Mean frame-to-frame brightness change in the first EDGE_MS versus the
    rest of the segment. Answers a narrower question than self-similarity: not
    "is there a repeated block" but "is the very front of this cut still
    changing faster than the body is" -- direct evidence of a leftover
    consonant-to-vowel transition at the edge, which is what the rejected
    whole-span cut actually contained.

    This is necessary but not sufficient on its own: a nasal/liquid murmur is
    ALSO flat (see cut_nucleus_steady's docstring), so a low ratio here does
    not by itself prove the edge is clean -- that is what the stricter
    self-similarity gate below is for. The two catch different shapes of the
    same underlying mistake (heterogeneous edge vs. homogeneous-but-wrong
    edge), which is why both are gated for pos == 'nucleus-steady'.
    """
    fr, step = frames(seg, sr)
    edge_n = max(2, EDGE_MS // FRAME_MS)
    deltas = [abs(fr[i][1] - fr[i - 1][1]) for i in range(1, len(fr))]
    if not deltas:
        return 0.0
    edge, body = deltas[:edge_n - 1], deltas[edge_n - 1:]
    edge_mean = sum(edge) / len(edge) if edge else 0.0
    body_mean = sum(body) / len(body) if body else edge_mean
    if body_mean <= 1e-6:
        return 0.0 if edge_mean <= 1e-6 else 99.0
    return edge_mean / body_mean


def tail_flux_ratio(seg, sr):
    """Mirror of edge_flux_ratio, measured at the LAST EDGE_MS instead of the
    first. This is what confirmed the round-3 "oh/eye/or" defect: a cut whose
    front is clean can still carry the following consonant's formant
    transition at the BACK, if the source word has a coda. Measured directly
    against the words this project shipped and rejected:
        oat (old 'oh' source, coda /t/)   tail 2.09
        orb (old 'or' source, coda /rb/)  tail 2.08
        ice (old 'eye' source, coda /s/)  tail 1.11
        own/isle/or (their replacements, no obstruent coda)  tail 0.15-0.44
    Diagnostic only for now, not gated in failures_for: it is not applied to
    pos == 'nucleus' generally because that pos also covers a/ee, which this
    round did not re-examine and must not regress just because a new check
    started looking at them. Called from probe()/generate()'s report so the
    numbers above stay reproducible from this file instead of living only in
    a comment.
    """
    fr, step = frames(seg, sr)
    edge_n = max(2, EDGE_MS // FRAME_MS)
    deltas = [abs(fr[i][1] - fr[i - 1][1]) for i in range(1, len(fr))]
    if not deltas:
        return 0.0
    tail = deltas[-(edge_n - 1):] if len(deltas) >= edge_n - 1 else deltas
    body = deltas[:-(edge_n - 1)] if len(deltas) > (edge_n - 1) else deltas
    tail_mean = sum(tail) / len(tail) if tail else 0.0
    body_mean = sum(body) / len(body) if body else tail_mean
    if body_mean <= 1e-6:
        return 0.0 if tail_mean <= 1e-6 else 99.0
    return tail_mean / body_mean


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


def vowel_core_span(fr, peak):
    """(start, end) frame indices of the whole voiced vowel-ish region,
    expanding outward from the loudest frame while brightness stays vowel-like
    and loudness stays high. Shared by cut_nucleus and cut_nucleus_steady so
    the two describe the same span -- the steady cut only narrows it further.
    """
    pk = max(range(len(fr)), key=lambda i: fr[i][0])
    a = pk
    while a > 0 and fr[a - 1][0] > peak * 0.55 and fr[a - 1][1] < 0.45:
        a -= 1
    b = pk
    while b + 1 < len(fr) and fr[b + 1][0] > peak * 0.55 and fr[b + 1][1] < 0.45:
        b += 1
    return a, b


def cut_nucleus(samples, sr):
    """The steady part of the vowel: expand around the loudest frame.

    UNCHANGED BEHAVIOUR, BYTE FOR BYTE -- this is what a/ee/oh/eye/or still use,
    and their audio must not move: the user has already graded them OK. Do not
    fold cut_nucleus_steady's narrowing into this function.
    """
    fr, step = frames(samples, sr)
    if not fr:
        return []
    peak = max(f[0] for f in fr)
    a, b = vowel_core_span(fr, peak)
    return samples[a * step:(b + 1) * step]


# Fraction of the core span kept by the flatness search below. Not a fixed
# skip-the-front-N% (option 1 in isolation): tried alone, a fixed fraction
# either stayed inside a nasal/liquid onset's murmur (that murmur is QUIET
# there is nothing IN it that changes) or landed back on it depending on the
# word, because "position in the span" and "is this the murmur" are not the
# same fact. What separates the murmur from the true vowel is that the murmur
# is flat at a DIFFERENT level, so the search below (option 2) hunts for the
# flattest window regardless of where it falls, and the length below decides
# how much of the span it is allowed to claim -- long enough to reach a real
# steady state, short enough not to just re-select the whole span.
#
# 0.85, not the 0.55 this shipped with first. The gallery graded the 0.55
# output "정확한 발음이긴한데... 조금만 더 천천히" -- correct, but too short to
# register as a held sound. The fix is NOT repetition (that is exactly last
# round's "메에에에에" defect returning) -- it is claiming more of the SAME
# real, already-recorded steady state. Measured across all five sounds at
# their default rate: every one of them has a wider flat region available than
# 0.55 was using, and 0.85 stays inside it for four of the five (ihh 150ms/
# selfsim .168/efr .18, eh 140ms/.188/.82, uh 150ms/.128/.76, awh 130ms/.152/
# .70 -- all comfortably inside both gates). `aaa` is the one exception: at
# the default rate 0.85 lands at efr ~2.0, right on the ceiling, because "cat"
# 's core span is short enough that 85% of it still catches some onset
# residue. That one sound's CORPUS row carries its own slower rate (see
# below) rather than raising this constant further for everyone, since 0.85
# already sits close to where the OTHER four stop being safe (0.55 step
# increments were tried up to core-span coverage; each sound's own ceiling is
# a different fraction, and pushing the shared constant past 0.85 to chase
# `aaa` would have started failing sounds that are fine as they are).
NUCLEUS_STEADY_WINDOW_FRAC = 0.85


def steady_window(fr, a, b, win):
    """The `win`-frame window inside [a, b] with the least brightness
    movement -- the flattest run of formants, i.e. the part of the vowel that
    is not still transitioning into or out of a neighbouring consonant.
    Ties broken toward higher average loudness, which biases away from a quiet
    nasal/liquid murmur without hardcoding where the murmur is.
    """
    best, best_score = None, None
    for start in range(a, b - win + 2):
        end = start + win - 1
        flux = sum(abs(fr[i][1] - fr[i - 1][1]) for i in range(start + 1, end + 1))
        avg_rms = sum(fr[i][0] for i in range(start, end + 1)) / win
        score = (round(flux, 6), -avg_rms)
        if best_score is None or score < best_score:
            best_score, best = score, (start, end)
    return best


def cut_nucleus_steady(samples, sr):
    """Narrower than cut_nucleus: the flattest NUCLEUS_STEADY_WINDOW_FRAC of
    the core span, not the whole span.

    This exists because the whole span was rejected on the real device: "cat"
    -> aaa read as "ca(t)", because the core span starts right where the RMS/
    brightness gate first admits the vowel, and a released consonant's formant
    transition can still be moving for tens of ms after that gate opens (the
    gate is loudness+noise, not formant tracking, which this project cannot do
    without an FFT). Searching for the flattest sub-window finds the part of
    the vowel that has actually settled.
    """
    fr, step = frames(samples, sr)
    if not fr:
        return []
    peak = max(f[0] for f in fr)
    a, b = vowel_core_span(fr, peak)
    span = b - a + 1
    win = max(8, int(round(span * NUCLEUS_STEADY_WINDOW_FRAC)))
    win = min(win, span)
    s, e = steady_window(fr, a, b, win)
    return samples[s * step:(e + 1) * step]


def extract(word, klass, pos, rate=None):
    raw, sr = say_pcm(word, rate)
    body = trim_word(raw, sr)
    edge_flux = None
    tail_flux = None
    if pos == 'nucleus':
        seg = cut_nucleus(body, sr)
        # Diagnostic only (see tail_flux_ratio's docstring) -- not gated, so
        # this cannot turn into a surprise regression on a/ee, which this
        # round did not re-examine.
        tail_flux = tail_flux_ratio(seg, sr)
    elif pos == 'nucleus-steady':
        seg = cut_nucleus_steady(body, sr)
        # Measured on the RAW cut, before fade(): the 15ms cosine taper zeros
        # out most of the very edge this metric exists to look at, which would
        # silently disable the check rather than fail it loudly.
        edge_flux = edge_flux_ratio(seg, sr)
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
                edgeFluxRatio=edge_flux,
                tailFluxRatio=tail_flux,
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

# STRICTER self-similarity ceiling, only for pos == 'nucleus-steady'.
# Self-similarity was built to catch a spliced repeat (see SELFSIM_MAX), but it
# turns out to also be the best available signal for a DIFFERENT contamination:
# a nasal or liquid murmur bled into the front of the cut. A murmur is
# periodic voicing too, just at the consonant's own formants rather than the
# vowel's, so it raises long-lag self-similarity the same way a splice does --
# just less. Measured on the actual candidate words for the five sounds this
# gate exists for: every clean word (stop or fricative onset, or vowel-initial)
# scored 0.000-0.221; the two nasal-onset words tried ("mud" for uh, "net" for
# eh) scored 0.454 and 0.570. 0.30 sits in the gap. This does not replace
# SELFSIM_MAX -- it is tighter, so passing this gate also passes that one --
# it is applied instead of it for this pos only.
NUCLEUS_STEADY_SELFSIM_MAX = 0.30

# Ceiling for edge_flux_ratio (see its docstring), pos == 'nucleus-steady' only.
# Measured on the words actually shipped: 0.18-1.56. Measured on words that were
# tried and rejected for other reasons (elevated selfsim, or too short): up to
# 2.69 ("wish"). 2.0 sits between the two populations with margin on both
# sides.
NUCLEUS_STEADY_EDGE_FLUX_MAX = 2.0


def failures_for(e, klass, pos, spec):
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
    if pos == 'nucleus-steady':
        if e['selfsim'] > NUCLEUS_STEADY_SELFSIM_MAX:
            bad.append('selfsim=%.3f > %.2f -- suspect a consonant murmur '
                       '(nasal/liquid) blended into the vowel, not just a '
                       'repeat splice' % (e['selfsim'], NUCLEUS_STEADY_SELFSIM_MAX))
        if e['edgeFluxRatio'] is not None and e['edgeFluxRatio'] > NUCLEUS_STEADY_EDGE_FLUX_MAX:
            bad.append('edgeFluxRatio=%.2f > %.2f -- the first %dms is still '
                       'changing faster than the rest, likely an unresolved '
                       'onset transition' % (e['edgeFluxRatio'],
                                             NUCLEUS_STEADY_EDGE_FLUX_MAX, EDGE_MS))
    elif e['selfsim'] > SELFSIM_MAX:
        bad.append('selfsim=%.3f > %.2f -- contains a repeated block'
                   % (e['selfsim'], SELFSIM_MAX))
    return bad


def build_one(key, klass, pos, words, rate):
    spec = CLASSES['vowel-steady'] if pos == 'nucleus-steady' else CLASSES[klass]
    tried = []
    for w in words:
        e = extract(w, klass, pos, rate)
        e['bad'] = failures_for(e, klass, pos, spec)
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
    print('%-5s %-9s %-8s %-7s %4s %7s %7s %7s %7s %7s %6s %6s %6s  %s'
          % ('key', 'class', 'pos', 'word', 'rate', 'word', 'seg', 'bright', 'pbrt',
             'zcr', 'selfs', 'efr', 'tfr', 'reject'))
    for key, klass, pos, words, rate in CORPUS:
        spec = CLASSES['vowel-steady'] if pos == 'nucleus-steady' else CLASSES[klass]
        for w in words:
            e = extract(w, klass, pos, rate)
            bad = failures_for(e, klass, pos, spec)
            efr = '%6.2f' % e['edgeFluxRatio'] if e['edgeFluxRatio'] is not None else '     -'
            tfr = '%6.2f' % e['tailFluxRatio'] if e['tailFluxRatio'] is not None else '     -'
            print('%-5s %-9s %-8s %-7s %4s %6.0fms %6.0fms %7.2f %7.2f %7.3f %6.3f %s %s  %s'
                  % (key, klass, pos, w, rate or '-', e['word_ms'], e['ms'], e['bright'],
                     e['pbright'], e['zcr'], e['selfsim'], efr, tfr, '; '.join(bad)))
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
    # rate actually used per key, keyed by CORPUS's own declaration -- read
    # back here rather than threaded through build_one/extract, which return
    # per-WORD dicts that don't carry the row's rate at all.
    rate_by_key = {row[0]: (row[4] or RATE) for row in CORPUS}
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
            rate=rate_by_key[r['key']],
            selfSim=round(c['selfsim'], 3), bright=round(c['bright'], 3),
            # None for every pos except 'nucleus-steady' -- it is only computed
            # (and only means anything) for that cut. Recorded so the gallery
            # and `--check` can both see it without recomputing from the raw
            # word, which check() no longer has access to.
            edgeFluxRatio=(round(c['edgeFluxRatio'], 3)
                          if c['edgeFluxRatio'] is not None else None),
            # Diagnostic only (see tail_flux_ratio's docstring) -- None for
            # every pos except 'nucleus'.
            tailFluxRatio=(round(c['tailFluxRatio'], 3)
                          if c['tailFluxRatio'] is not None else None),
            bytes=os.path.getsize(path)))
    bad = report(rows)
    manifest = {
        'ext': EXT,
        'voice': VOICE,
        'rate': RATE,
        'sounds': {w['key']: {'ms': w['ms'], 'naturalMs': w['naturalMs'],
                              'stretch': w['stretch'], 'source': w['source'],
                              'pos': w['pos'], 'class': w['klass'],
                              'rate': w['rate'],
                              'pulses': w['pulses'], 'selfSim': w['selfSim'],
                              'edgeFluxRatio': w['edgeFluxRatio'],
                              'tailFluxRatio': w['tailFluxRatio'],
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
    print('%-5s %-7s %-14s %7s %6s %6s %6s  %s'
          % ('key', 'source', 'pos', 'ms', 'puls', 'selfs', 'efr', 'verdict'))
    for key, meta in manifest['sounds'].items():
        path = os.path.join(OUT_DIR, '%s.%s' % (key, manifest['ext']))
        if not os.path.exists(path):
            print('%-5s %-7s %-14s %7s %6s %6s %6s  MISSING'
                  % (key, meta['source'], meta['pos'], '-', '-', '-', '-'))
            bad.append(key)
            continue
        s, sr = read_wav(path)
        p, _ = pulses(s, sr)
        ms = round(len(s) / sr * 1000)
        ss = self_similarity(s)
        steady = meta['pos'] == 'nucleus-steady'
        # NOT recomputed from the shipped bytes. Tried that first and it was
        # wrong: edge_flux_ratio looks at exactly the frames the 15ms fade
        # tapers, and the taper's own amplitude ramp dominates the measurement
        # there (measured: "cat" 0.34 pre-fade at generation time, 3.52
        # recomputed from the faded file -- a false FAIL on an asset nothing
        # had changed). This checks the value generate() actually gated on
        # instead, i.e. it verifies the manifest's claim is still within the
        # ceiling rather than re-deriving a number this mode structurally
        # cannot compute correctly (check() never has the pre-fade audio).
        efr = meta.get('edgeFluxRatio') if steady else None
        why = []
        if p != 1:
            why.append('%d pulses' % p)
        if abs(ms - meta['ms']) > 1:
            why.append('%dms != manifest %d' % (ms, meta['ms']))
        if meta['stretch'] != 1.0 or meta['naturalMs'] != meta['ms']:
            why.append('manifest claims a stretch')
        selfsim_ceiling = NUCLEUS_STEADY_SELFSIM_MAX if steady else SELFSIM_MAX
        if ss > selfsim_ceiling:
            why.append('selfsim %.3f > %.2f%s' % (
                ss, selfsim_ceiling,
                ' (murmur ceiling)' if steady else ''))
        if efr is not None and efr > NUCLEUS_STEADY_EDGE_FLUX_MAX:
            why.append('edgeFluxRatio %.2f > %.2f' % (efr, NUCLEUS_STEADY_EDGE_FLUX_MAX))
        if why:
            bad.append(key)
        print('%-5s %-7s %-14s %6dms %6d %6.3f %6s  %s'
              % (key, meta['source'], meta['pos'], ms, p, ss,
                 ('%.2f' % efr) if efr is not None else '-',
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
