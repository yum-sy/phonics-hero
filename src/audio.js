// TTS playback (English target content + Korean instructions) and an
// optional, best-effort speech-recognition assist for the read-aloud check.
// The manual "다 읽었어요!" button is always the primary, reliable path —
// SpeechRecognition is unreliable on iPadOS Safari, so it's only ever a bonus.

let audioUnlocked = false

// iOS refuses speechSynthesis.speak() until one speak() has happened inside a
// real user gesture, and refuses it *silently* -- no error, no onend, no
// sound. The app's own callers (world card / chapter card / stage node) all sit
// in a gesture, so this is belt-and-braces rather than a known break: it makes
// the very first touch anywhere in the document do the unlock, so no future
// screen can introduce an auto-speaking entry point that lands before any tap.
//
// `once` means this costs one listener for the lifetime of the page, and
// unlockAudio() is idempotent, so the app's explicit calls are unaffected.
if (typeof document !== 'undefined') {
  document.addEventListener('pointerdown', () => unlockAudio(), { once: true, capture: true })
  document.addEventListener('touchstart', () => unlockAudio(), { once: true, capture: true })
}

export function unlockAudio() {
  if (audioUnlocked) return
  audioUnlocked = true
  try {
    // This used to call window.speechSynthesis.speak() directly, completely
    // outside the queue/pump() machinery: fire-and-forget, nothing tracking
    // whether it ever completed. That made it a single point of failure --
    // the browser's native speech queue is FIFO, so if THIS ONE utterance
    // ever silently stalled (no onstart/onend/onerror, a real and documented
    // WebKit failure mode), every word utterance queued after it for the
    // rest of the session would be stuck behind it forever, and this module's
    // own "never call cancel()" rule meant nothing could recover it.
    //
    // Routing it through push()/makeItem() instead gives it the same
    // protections every other utterance gets: minSpeechMs's floor, the
    // safety timer that guarantees SOME resolution even if the engine never
    // reports, and now the jam watchdog below. It is still fire-and-forget
    // from the CALLER's point of view (not awaited) -- push() calls pump()
    // synchronously, and pump() calls speechSynthesis.speak() synchronously
    // too as long as nothing else is ahead of it in the queue, which is
    // always true here since this is the very first thing the app ever
    // speaks. So the speak() call still lands inside the same user-gesture
    // call stack that unlockAudio() was invoked from -- the constraint iOS
    // actually enforces -- even though it is now a managed queue item.
    //
    // Text is '.' rather than ' ': speakNow() treats an all-whitespace
    // string as "nothing to say" and resolves immediately WITHOUT ever
    // calling speak() at all (see the `!raw.trim()` guard below) -- which
    // would silently skip the actual unlock call this function exists to
    // make. volume 0 is what keeps it silent, not the text.
    push(makeItem('.', 'en-US', 1, false, 0))
  } catch (e) {
    // ignore
  }
  // iOS populates getVoices() lazily, and on some builds only after the first
  // speak(). This is the first user gesture in the app, so it's the earliest
  // moment a real voice list can exist -- grab it here rather than waiting for
  // a voiceschanged event that may never arrive.
  refreshVoices()
  // Same gesture, same reason: an AudioContext created outside one starts
  // suspended on iOS. Warming the buffers here means the first drill sound of
  // the session is already decoded when the child reaches it.
  warmSoundAssets()
  startSpeechWatchdog()
}

// ---- iOS/iPadOS Safari speech daemon watchdog ----
//
// This is a SEPARATE failure from every other one documented in this file
// (lying `onend`, `cancel()` killing the queue, wrong-voice fallback): those
// all still fire *some* event pump() can react to. This one does not.
// Documented, widely-hit WebKit behaviour: after the on-device speech
// daemon sits idle for roughly 15s, the *next* speak() call it receives is
// dropped entirely -- no onstart, no onend, no onerror, no sound. Nothing in
// pump()'s trust bit can distinguish that from a genuinely silent utterance,
// because both look identical from script: a queued item whose engine event
// never arrives (which is exactly why the safety timer exists) -- so this
// project's own architecture cannot self-heal a device with this bug, only
// route around it before it happens.
//
// This app is a poor fit for the failure window on top of that: think/tap
// time between beats is frequently well over 15s (a 5-year-old reading a
// word, deciding an answer), so "TTS stops working" reads as exactly the
// symptom reported -- general, on multiple stages, not tied to one beat
// type -- rather than a one-off.
//
// The standard mitigation (widely used by other TTS-driven web apps for the
// same bug) is a periodic no-op pause()/resume(): idle, it is a no-op for
// the engine's own state (nothing is speaking, so there is nothing to pause)
// but resets whatever internal timer causes the daemon to go stale.
// Deliberately NOT cancel() -- cancel() is the one call this module has
// never used because it drops the whole queue; pause()/resume() drop
// nothing.
//
// Gated on `!speechSynthesis.speaking` so this can never land mid-utterance:
// pausing a real utterance the child is currently hearing (even for the
// instant before resume() continues it) is an audible hiccup this project
// does not need to risk for a fix aimed at the idle case.
//
// Started once, from the first real gesture (same call site as the rest of
// unlockAudio's setup) rather than at module load: an interval ticking
// before the page has ever spoken anything guards nothing yet and just
// costs a timer for the lifetime of a screen that may never need audio.
let speechWatchdogStarted = false
function startSpeechWatchdog() {
  if (speechWatchdogStarted) return
  speechWatchdogStarted = true
  if (!('speechSynthesis' in window)) return
  setInterval(kickSpeechDaemon, 10000)
}

// The pause()/resume() no-op shared by the idle watchdog above AND the
// post-WebAudio kick below (see playSound's caller in pump()). Factored out
// because both call sites are defending the same failure -- a WebKit speech
// daemon that has gone quiet and drops its next speak() -- they just differ
// in WHEN they suspect it happened: the watchdog covers a long think-time
// idle gap, the pump() call covers a specific transition that could stale it
// immediately rather than after 10s.
//
// Guarded the same way in both places: never touches a real utterance
// in flight.
function kickSpeechDaemon() {
  if (!('speechSynthesis' in window)) return
  try {
    if (window.speechSynthesis.speaking) return
    window.speechSynthesis.pause()
    window.speechSynthesis.resume()
  } catch (e) {
    // ignore -- worst case the daemon bug this exists to dodge comes back
  }
}

// ---- baked phoneme assets ----
//
// Web Speech cannot say a bare phoneme, and the reason turned out to be worse
// than "it sounds wrong". Comparing md5 of the rendered audio against the
// letter name spelled out the same number of times (`say -v Samantha -r 88`):
//
//   sss  922ms == "ess ess ess"       BYTE-IDENTICAL
//   mmm  736ms == "em em em"          BYTE-IDENTICAL
//   lll  863ms == "el el el"          BYTE-IDENTICAL
//   rrr  875ms == "ar ar ar"          BYTE-IDENTICAL
//   zz   759ms == "zee zee"           BYTE-IDENTICAL
//   ihh 1049ms == "eye aitch aitch"   BYTE-IDENTICAL
//   (Alex adds fff == "eff eff eff" and aaa == "ay ay ay")
//
// So the first sound of the app was never /s/. It was the letter name, three
// times -- "에스 에스 에스". That is the actual identity of the complaint the
// user raised three times, and nothing in this file could have reached it:
// EN_RATE's own comment shows rate is a weak lever by construction, and the
// repeat structure that was tried instead was repeating the wrong thing.
// On top of that the *voice* was a lottery -- the target iPad resolved English
// to the system's Korean voice, which read "tuh" as "주아".
//
// So the sounds the child imitates are not synthesised on the device any more.
// scripts/gen-sounds.py speaks a real WORD on a machine where it can be
// measured and cuts the phoneme out of it -- /s/ from "sun", /m/ from "mat",
// /ae/ from "cat" -- verifies each cut against its acoustic class and against
// the same phoneme cut from a second word, and writes public/sounds/. A word
// is dictionary pronunciation, so a letter-name spell-out is impossible by
// construction.
//
// THE ASSET KEY IS THE NOTATION STRING, so this needs no chapter-data change
// and cannot drift from one: `sss` plays /sounds/sss.wav, and any string
// without an asset (words, letter names, Korean, sentences) goes to TTS
// untouched.
//
// The match is EXACT AND CASE-SENSITIVE, and that is load-bearing rather than
// incidental. Chapter 7 teaches AI with the notation `a`, and chapter 1 teaches
// the letter name with `'A'`. Lowercasing before the lookup -- which is what
// speakNow() does before speaking -- would make `'A'` hit a.wav and replace an
// intended letter name with a vowel sound. Case is the only thing separating
// those two, so the lookup happens on the raw string and the lowercasing stays
// where it was, inside the TTS path.
//
// Consequence worth knowing: an uppercase notation (`'SSS'`) would silently
// get TTS instead of its asset. No chapter has one today (checked: every
// uppercase spoken string in the corpus is a single letter), and the failure
// mode is the old behaviour rather than silence.
//
// public/sounds/ is also what public/_audio.html (the listening gallery the
// user grades sounds in) reads, so the app and the audition page are playing
// the same bytes -- a verdict recorded there is a verdict about what ships.
const SOUND_BASE = `${import.meta.env.BASE_URL || '/'}sounds/`
const SOUND_EXT = 'wav'

// Must match EXTERNAL_CORPUS in scripts/gen-sounds.py (all 41 real-recording
// keys, one per SOUND_TABLE row that has a `say` value). Hardcoded rather
// than fetched so the first sound costs no round trip and a network hiccup
// cannot turn the whole curriculum back into letter names; the generator
// also writes public/sounds/manifest.json, and a harness case fails if the
// two disagree.
//
// Real-recording pivot: every key below now plays a professionally recorded
// isolated phoneme (phonics_sounds/*.mp3, see gen-sounds.py's
// EXTERNAL_CORPUS) instead of a TTS-word with a phoneme spliced out of it.
// `zz` (old Z key, cut from "buzz"/"fizz") is retired -- SOUND_TABLE's
// accepted Z notation is `zze`, and nothing in chapter data ever spoke `zz`,
// so it was dead weight silently leaving Z on the TTS-fallback path. `zze`
// is the one actually wired to the letter.
const SOUND_ASSETS = new Set([
  'sss', 'fff', 'nnn', 'mmm', 'lll', 'rrr', 'zze', 'aaa', 'ihh', 'awh',
  'eh', 'uh', 'oh', 'a', 'ee', 'or', 'eye',
  'tuh', 'puh', 'kuh', 'buh', 'duh', 'guh', 'huh', 'juh',
  // Group 5 (chapter 9+): NG, both OO vowels, W, V.
  'ngh', 'uuu', 'uuh', 'weh', 'vve',
  // Group 6 (chapter 9+): Y, X, CH, SH, voiceless TH.
  'yyuh', 'ksuh', 'ch', 'shhu', 'thhu',
  // Group 7 (chapter 9+): QU, OU, OI, UE, ER, AR.
  'kw', 'ou', 'oi', 'u', 'erh', 'arh',
])

// `null` = not tried yet, `false` = no Web Audio on this engine (never retried,
// because the constructor's absence is not a transient condition).
let audioCtx = null

// key -> { buffer } once the load has settled. `buffer` is an AudioBuffer, or
// null for a 404 / decode failure -- a settled null is kept rather than
// retried, because neither of those fixes itself and re-fetching on every
// drill would put a request in front of every sound.
//
// A key that is still LOADING has no entry here, only an entry in
// `soundLoading`. That split is deliberate: the play path reads this map
// synchronously and never awaits a load (see soundBufferFor).
const soundBuffers = new Map()
const soundLoading = new Set()

function ensureAudioCtx() {
  if (audioCtx !== null) return audioCtx
  const Ctx = window.AudioContext || window.webkitAudioContext
  if (!Ctx) {
    audioCtx = false
    return false
  }
  try {
    audioCtx = new Ctx()
  } catch (e) {
    audioCtx = false
  }
  return audioCtx
}

// Starts a load if one is not already done or in flight. Returns nothing on
// purpose: NOTHING IN THE PLAY PATH EVER AWAITS THIS.
//
// The first version did await it, with a deadline to stop a stalled fetch from
// freezing the queue, and both halves of that were wrong. Awaiting a network
// operation at the front of the queue makes every sound depend on the network
// being up; and the deadline needed a timeout constant, i.e. exactly the kind
// of fitted guess this path was supposed to be free of. Not awaiting removes
// both: an unfinished load simply means this one occurrence is spoken instead,
// and the buffer is there for the next one.
function loadSound(key) {
  if (soundBuffers.has(key) || soundLoading.has(key)) return
  soundLoading.add(key)
  ;(async () => {
    let buffer = null
    const ctx = ensureAudioCtx()
    if (ctx) {
      try {
        const res = await fetch(`${SOUND_BASE}${key}.${SOUND_EXT}`)
        // On a WebKit old enough to only have the callback form of
        // decodeAudioData this awaits `undefined` and stores null, i.e. TTS.
        // That is the correct degradation: never silence.
        if (res.ok) buffer = (await ctx.decodeAudioData(await res.arrayBuffer())) || null
      } catch (e) {
        buffer = null
      }
    }
    soundBuffers.set(key, buffer)
    soundLoading.delete(key)
  })()
}

// Fired from the first user gesture. Nothing awaits it -- a sound that is not
// decoded yet is simply awaited by pump() when it is needed.
function warmSoundAssets() {
  resumeAudioCtx()
  for (const key of SOUND_ASSETS) loadSound(key)
}

// The whole asset decision, and it is SYNCHRONOUS -- pump() calls it at the
// front of the queue and gets an answer without awaiting anything. Every "no"
// here means the string is spoken by TTS instead, so there is no route from
// here to silence.
//
// An asset only ever plays into a RUNNING context. A suspended one accepts
// start() and produces nothing, and this project has just been through "소리가
// 전혀 안나와".
//
// resume() is fired and NOT awaited, and that shape exists to avoid a measured
// deadlock rather than as a style choice. In headless Chrome with no user
// gesture, `resume()` returns a promise that never settles at all (probed:
// still pending after 3000ms, state still 'suspended'). Awaiting it stalls
// pump(), and pump() is what every beat transition in the app is gated on -- so
// an autoplay policy the app cannot satisfy would present as a permanently
// frozen screen. Firing it costs nothing and lets the *next* sound find a
// running context; the real unlock is unlockAudio(), inside a real gesture.
function soundBufferFor(text, lang) {
  if (!lang.startsWith('en')) return null
  const key = text == null ? '' : String(text).trim()
  if (!SOUND_ASSETS.has(key)) return null
  const ctx = ensureAudioCtx()
  if (!ctx) return null
  if (ctx.state !== 'running') {
    resumeAudioCtx()
    return null
  }
  if (!soundBuffers.has(key)) {
    // Not warmed (or warming lost the race with the first drill). Start it and
    // speak this one occurrence -- the next one is the asset.
    loadSound(key)
    return null
  }
  return soundBuffers.get(key)
}

function resumeAudioCtx() {
  const ctx = ensureAudioCtx()
  if (!ctx || ctx.state === 'running') return
  try {
    const p = ctx.resume()
    // Never awaited anywhere, so an unsettled promise is inert -- but an
    // outright rejection would still surface as an unhandled rejection.
    if (p && p.catch) p.catch(() => {})
  } catch (e) {
    // ignore
  }
}

// Resolves `true` (pump()'s trust bit) when the asset has finished sounding,
// or `null` if it never started -- which makes pump() speak the string
// instead. Reporting "played" for a source node that threw would be the one
// unforgivable failure here: total silence, with the queue advancing as if the
// child had been taught something.
//
// This path carries none of the machinery the TTS path needs, deliberately.
// minSpeechMs exists because iPadOS lies in its `onend`, and the safety timer
// exists because speechSynthesis sometimes never reports at all; both are
// estimates fitted to strings whose real duration is unknowable in advance.
// Here `buffer.duration` IS the duration -- exact, per file, measured at
// generation time -- so the wait is the fact rather than a fit, and the trust
// bit is unconditionally true. Do not reintroduce a floor here: it could only
// ever be wrong.
//
// The buffer plays at its native rate. It was cut from a word rendered at
// `say -r 88`, the bucket Web Speech's rate 0.5 lands in (see EN_RATE), so
// item.rate is already baked in -- applying it again as playbackRate would
// transpose the phoneme down an octave, i.e. teach the wrong vowel.
function playSound(buffer) {
  return new Promise((resolve) => {
    const ctx = ensureAudioCtx()
    try {
      const src = ctx.createBufferSource()
      src.buffer = buffer
      src.connect(ctx.destination)
      src.start()
    } catch (e) {
      resolve(null) // hand it back to TTS rather than teaching silence
      return
    }
    // A timer rather than src.onended: the two fire at the same instant for a
    // non-looping buffer, and a timer cannot be withheld by a context that
    // gets suspended mid-play, which would deadlock the queue. Background-tab
    // throttling can only make it later, never earlier.
    setTimeout(() => resolve(true), Math.ceil(buffer.duration * 1000))
  })
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// ---- shared "never overlap" playback queue ----
//
// A 5-year-old needs every sound to land as its own distinct event, never
// jammed against the tail of the previous one. All speech in the app --
// English words/letters, Korean instructions, and multi-step sequences --
// funnels through this single module-level queue, so it doesn't matter
// which screen/call-site triggered it or how soon after another call it
// fires: the queue guarantees (a) a new utterance never starts while a
// previous one is still actually speaking (checked via the real
// SpeechSynthesisUtterance `onend`/`onerror` completion, not a guessed
// timeout), and (b) there's always at least MIN_GAP_MS of silence between
// the end of one utterance and the start of the next.
//
// This intentionally replaces the old approach of calling
// `speechSynthesis.cancel()` before every utterance (cancel-and-interrupt),
// which is what produced the overlap/cut-off artifacts -- utterances are
// now queued and awaited instead of interrupted.
const MIN_GAP_MS = 500

// Silence reserved before a TAP utterance, instead of MIN_GAP_MS.
//
// The gap exists so a *model* sound the child is meant to copy lands as its
// own event. A tap sound is not that: it is the app answering the child's own
// finger, and the child has already supplied the event boundary by pressing.
// QA measured what the full gap costs there -- a second option tap could not
// be heard until ~860ms after the first (the floor below plus MIN_GAP_MS),
// which is how "tapped dog, heard sock" happened and why the buttons felt
// unresponsive to a 5-year-old.
//
// 120ms rather than 0 because even a trusted onend can be a few frames
// optimistic, and 120ms is the residual this project already treats as an
// inaudible consonant tail (the regression harness calls it
// TOLERATED_TAIL_MS and budgets exactly that). It gives back 380ms of the
// 500 without spending the guarantee.
//
// It is NOT applied unconditionally: pump() uses it only when the previous
// utterance's own onend arrived at or after its floor, i.e. when the engine
// itself said the audio was over at a time that could actually be true (see
// lastEndTrusted). Against a lying onend the gap stays at MIN_GAP_MS, which
// costs nothing real: if the sound is still playing, starting the next one
// 380ms sooner does not make anything audible sooner, it only stacks two
// sounds.
//
// With a trusted onend this is as fast as tap feedback can be: what remains
// is the previous sound's own audio, and the only API that cuts that short is
// speechSynthesis.cancel(), which kills the whole queue on iOS and is never
// called from this module.
const TAP_GAP_MS = 120

// Playback rate for every English utterance the child is meant to hear as a
// model and copy -- which is all of them: letter sounds, words, teach
// sequences, tap feedback. Lowered from 0.85 after a real-iPad report that the
// repeated sounds were far too fast for a 5-year-old to imitate.
//
// Measured, because the obvious objection is that rate does nothing here.
// Apple's engine quantizes rate into coarse buckets; mapping Web Speech's
// multiplier onto `say -r` through the voices' own default of 175 wpm
// (measured: an unflagged `say` matches -r 160..180 exactly for both voices)
// gives this ladder, Samantha "tuh" / "elephant":
//
//   1.00  -r 175   432 /  587
//   0.85  -r 149   487 /  656   <- previous value
//   0.75  -r 131   487 /  656   } same bucket as 0.85
//   0.70  -r 123   487 /  656   }
//   0.60  -r 105   534 /  712   } same bucket as 0.50 -- 0.6 and 0.5 are
//   0.50  -r  88   534 /  712   } indistinguishable on an Apple voice
//   0.40  -r  70   580 /  768   <- the next bucket down, if 0.5 is still fast
//   0.10  -r  18   684 /  881
//
// So 0.85 -> 0.5 buys exactly one bucket: +10% on a sound, +9% on a word, and
// +0.9s of speech per stage across all 35 stages (measured over the real
// auto-played content, both voices). Cheap enough to keep, and the direction
// the user asked for -- but nowhere near a fix on its own, and the ladder
// shows why nothing in this file can be: even rate 0.10 leaves "tuh" at 684ms,
// under the 780-855ms this project measured as the threshold where a
// 5-year-old actually registers a sound. Rate is a weak lever by construction
// because a plosive's duration is articulation-bound, not rate-bound.
//
// It is also the only lever that lives in this file. Making a *sound* long
// enough to imitate needs repetition, and repetition lives in chapter data
// (the "tuh, tuh, tuh" comma-bundle form). Do not add a repeat-it-N-times
// helper here to work around that: an echo built out of queue slots is
// strictly worse than the comma bundle (3 x 534ms + 2 x 900ms gap = 3.4s
// versus 2.16s for "tuh, tuh, tuh", for the same three exposures), it is
// invisible to validateChapters(), and its inter-pass silence sits outside
// queueTail so whenAudioIdle() can resolve in the middle of it.
//
// On engines that honour rate linearly (desktop Chrome, Android) 0.5 is a
// 1.7x stretch of every word instead of 10%. That is a dev-machine artifact,
// not the target device.
const EN_RATE = 0.5

// Floor on how long an utterance's audio really lasts, used to defend against
// an `onend` that fires early (see speakNow).
//
// Re-measured from scratch for EN_RATE over this project's entire actual spoken
// content: 180 English strings x {Samantha, Alex} x {rate 1.0, 0.85, 0.5},
// plus the 31 recapAudio.ko lines (Yuna, rate 1) that are the only Korean this
// app ever speaks.
//
// The old coefficients described themselves as a *strict* lower bound, and
// weren't: they overshot 35 measured strings (worst "guh, guh, guh", floor
// 1560ms vs 1256ms real). More usefully, the re-measurement showed strictness
// is the wrong thing to maximise. A per-character floor has to fit under the
// *shortest* string of its class, and the classes are enormously wide -- at
// rate 1.0 "lll, lll, lll" is 2491ms while "guh, guh, guh", the same 13
// characters, is 1256ms, because /l/ is a continuant and /g/ is a plosive.
// Chasing strictness at the short end therefore throws away most of the guard
// at the long end, and the two errors are not remotely comparable in cost:
// overshooting adds silence nobody notices, undershooting lets the next sound
// land on the tail of the previous one, which is precisely the "slurred
// together" complaint this floor exists to prevent.
//
// So these are fitted two-sided instead: the tightest coefficients whose
// overshoot stays around 120ms on every one of those measured strings (worst
// case 124ms, reached only by "zzz", which Samantha renders as a 212ms snore
// abbreviation and which is broken content regardless). Binding cases, all at
// rate 1.0:
//   plain English  78 ms/char, floor 290   ("duck" 211ms/4ch is the slope,
//                                           "zzz" 181ms/3ch the floor)
//   comma English  115 ms/char, or 370 per comma-separated token, whichever is
//                  larger -- the token term is what catches short bundles like
//                  "a, a" whose length badly understates them
//                  ("lll, lll, lll" sets the slope, "oh, oh" 764ms the token
//                   cost)
//   Korean         115 ms/char            (per Hangul syllable block -- NOT
//                                          per UTF-8 byte)
//
// Commas are the primary discriminator, not length: a comma is a deliberate
// pause inside one utterance (the tutorials said a sound three times as
// "lll, lll, lll"), which roughly doubles the per-character cost versus a
// plain word of the same length.
//
// THE COMMA TIER IS NO LONGER REACHED FROM CHAPTER DATA, and it stays anyway.
// The user rejected repeated sounds on the real device, so every bundle was
// deleted; validateChapters() now REJECTS any English speech field holding
// more than one token, so no future chapter can reintroduce one either. What
// is left is not "defensive in case the data comes back" -- it cannot come
// back through that door:
//   1. it is a live regression test, not dead code. The onend-early harness
//      case drives audio.js with "lll, lll, lll" / "guh, guh, guh" fixtures
//      (public/_probe-fs.html, REAL_MS) and asserts the worst tail stays
//      within 120ms. Delete the tier and that case fails at ~1300ms -- and it
//      would be failing on a *fixture*, which is the most expensive kind of
//      false alarm to debug.
//   2. `say` is the only other caller shape that matters, and any string with
//      an internal pause behaves this way regardless of who wrote it. The
//      tier is a property of the engine, not of the current curriculum.
// It is genuinely dead for Korean, though, and the handoff note claiming
// otherwise ("the 2 recapAudio.ko lines with commas keep it alive") is wrong:
// minSpeechMs returns on the ko branch before commas are ever looked at, and
// stretch() is never called for Korean at all (speakKO's rate is 1). Those two
// lines are measured and safe under the flat 115/char either way.
//
// The comma slope is 115, not the 105 this was first committed with, because
// re-measuring at the *new* EN_RATE showed 105 no longer held. Two things have
// to line up to see it. First, a string's real budget is not floor + 500: the
// queue's MIN_GAP_MS and speakSequence's 1100ms sleep start at the same moment
// and therefore do not stack, so a sequence item gets max(1100, 500) and a
// standalone one gets 500. Second, lowering the rate stretched the real audio
// more than the tier factor allows for. "lll, lll, lll" -- the /l/ tutorial
// drill, and the longest comma bundle in the app -- became 2988ms against a
// 1624ms floor plus its 1100ms gap, i.e. 264ms of the next sound landing on its
// tail. 115 is the smallest slope that closes it (109ms residual), and it is
// the only coefficient that moved.
//
// Verified at EN_RATE = 0.5 against every string this app actually speaks,
// scored two ways: dead air = floor - real, and collision = real - floor -
// (that string's real gap). Fitted to Samantha, because Samantha is the iOS
// en-US default and iPadOS Safari is the only engine whose onend is suspected
// of lying -- a floor calibrated to a voice the target device does not use
// protects nothing.
//
// RE-MEASURED after the round that deleted every comma bundle from the
// chapter data (128 unique English strings, Samantha -r 88; 31 recapAudio.ko
// lines, Yuna unflagged; extraction + `say`/`afinfo` sweep, 2026-08-23):
//   dead air    worst +12ms ("elephant" 712ms vs 724ms floor), +10ms
//               ("umbrella"); negative on all 126 others. So the floor is
//               still a real lower bound -- it costs the honest engine
//               nothing, which is the property this whole mechanism rests on.
//   collision   worst +492ms ("awh" 1328ms real, 336ms floor, 500ms gap),
//               then "ihh" +212, "cta" +125, "sss" +85, "rrr" +38,
//               "lll"/"fff"/"mta" +27, "aaa" +5; every other string negative.
//   Korean      dead air <= +78ms, collision negative on all 31 lines,
//               tightest -26ms. 115/char per Hangul block still holds exactly.
//
// Chapter 8 landed while this was being measured, and its 16 new strings were
// measured too: every English one is safely under (worst collision +38ms,
// "iet"; worst dead air -27ms, "bee") and so is its Korean, but its longest
// recap line is now the tightest row in the whole corpus -- 4142ms real
// against a 4140ms floor. 115/char per Hangul block is exact at that length,
// so a longer Korean line than that one is the first place this floor would
// start costing dead air. Measure it if one appears.
//
// The collision end got WORSE without a line of this file changing, and the
// reason is worth writing down: deleting the comma bundles turned the app's
// longest sounds into its shortest strings. "awh, awh, awh" was 13 characters
// and drew a 1624ms floor; "awh" is 3 characters and draws 336ms -- while the
// audio is still 1328ms, because a drawn-out vowel's duration has nothing to
// do with how many letters spell it.
//
// It cannot be fixed by a smarter length model, and that is measured, not
// assumed. Same shape, same length, Samantha -r 88:
//   ihh 1048   awh 1328   owh 1324   ehh  841
//   ahh  480   ohh  418   uhh  387   eeh  342   aih 399
// A 3.4x spread with no structural feature to key on -- the engine is
// consulting a lexicon of interjections, not a phonology. "Contains a doubled
// letter" fails too ("egg" 354ms). The only model that could hold these is a
// per-string table of measured durations, i.e. exactly the thing that rotted
// silently in the harness (its REAL_MS was a whole rate change out of date and
// passed a real regression). So the floor stays as fitted, and the exposure is
// handled where it can be handled honestly instead: TAP_GAP_MS is only spent
// when the engine's own onend says the audio is over (see lastEndTrusted), so
// nothing above got closer to colliding than it already was.
//
// Alex is the loose end throughout -- it is a macOS voice, not an iOS default,
// and no length model can serve both when the two disagree 2x on the same
// string ("fff": Samantha 863ms, Alex 1306ms). That is the trade this file
// already declared: unnoticed silence on a voice the child will not hear,
// against an audible collision on the voice they will.
//
// UNVERIFIED ON THE REAL DEVICE, and honestly so. Everything above is fitted
// to macOS `say` Samantha on the assumption that the iPad also spoke as
// Samantha. It did not -- it was using the system's Korean voice (see "explicit
// voice selection" below), so these coefficients have never once described the
// engine the child actually hears. The voice fix is what makes the assumption
// true rather than false, which is why nothing here is being re-tuned in the
// same change: after the fix the device should resolve to Samantha, the voice
// this was already fitted to. Confirm before touching a number:
//   1. read window.__carbotVoices.en on the iPad (dev build) -- if it is
//      "Samantha [en-US local]", this fit applies as written;
//   2. if it resolves to any other voice, re-measure the corpus against THAT
//      voice before trusting the residuals quoted here.
// Direction of the risk, if it is a different voice: this is a floor, so it
// only ever acts when onend lies. Too low = the collisions it exists to stop
// come back; too high = unnoticed silence. Undershoot is the expensive side.
//
// Measure the LOWERCASED string when re-checking any of this: speakNow()
// lowercases before speaking, and `say "S"` is "Capital S" (1013ms) against
// 447ms for `say "s"`. Measuring the data as written doubles every uppercase
// letter and invents collisions that cannot happen.
//
// The stretch tiers exist because lowering EN_RATE invalidates a floor
// calibrated at a higher rate. They are the measured *minimum* duration ratio
// across the corpus, per class, so they never overshoot; and since duration is
// monotonic in rate, a rate that lands in a less generous tier than it
// deserves is safe by construction. Plain speech stretches at least 1.16x from
// rate 1.0 to 0.5, comma bundles at least 1.19x (they stretch more because the
// engine's comma pause scales too).
//
// 1.16 re-checked against the notations introduced after the fit (16 strings x
// {Samantha, Alex}, each at -r 88 and unflagged): the measured ratio runs
// 1.17-1.21, "uhh" 1.17 being the tightest. Still a lower bound.
function stretch(rate, commas) {
  if (rate <= 0.5) return commas ? 1.19 : 1.16
  if (rate <= 0.85) return commas ? 1.08 : 1.05
  return 1
}

function minSpeechMs(text, lang, rate) {
  const len = text.length
  if (lang.startsWith('ko')) return 115 * len
  const commas = text.includes(',')
  const base = commas
    ? Math.max(115 * len, 370 * text.split(',').length)
    : Math.max(290, 78 * len)
  return base * stretch(rate, commas)
}

// ---- explicit voice selection ----
//
// Until this existed, every utterance set `utter.lang` and nothing else. That
// is not enough on iOS Safari: `lang` is a *hint*, and when it doesn't force a
// match the engine falls back to the system default voice. On the target
// device -- an iPad whose system language is Korean -- that meant the English
// content was spoken by a Korean voice, which reads English text as Hangul
// syllables. The real-device QA reports are exactly that artifact:
//   "sssss"  -> "에스에스 에스에스"   (Korean voice reading the letter name ㅅ)
//   "tuh"    -> "주아" / "주와"        (Korean voice syllabifying t-u-h)
// No spelling of a phoneme can survive being read by the wrong language's
// voice, so this is upstream of every sound-notation decision in the chapter
// data, and it also means the macOS `say` measurements this file is fitted to
// were measuring an engine the device never used.
//
// The rule this module now follows: name the voice, and make `lang` agree with
// the voice we named so the two can't fight.
//
// Ordered best-first. Region is deliberately encoded in the order rather than
// scored separately, because voice *quality* outranks accent for a model a
// 5-year-old imitates: Karen (en-AU, modern) is a better model than Fred
// (en-US, 1984). Samantha leads because she is the iOS en-US default AND the
// voice every duration constant in this file was fitted to -- picking her
// keeps minSpeechMs meaningful.
const EN_VOICE_RANK = [
  'samantha',
  'alex',
  'aaron',
  'nicky',
  'allison',
  'ava',
  'susan',
  'tom',
  'victoria',
  'karen',
  'daniel',
  'moira',
  'tessa',
  'arthur',
  'martha',
  'catherine',
  'fred', // en-US, but a 1980s formant synth -- last resort among named voices
]

// iOS/macOS ko-KR. Yuna is the default and the voice the 31 recapAudio.ko
// lines were measured against.
const KO_VOICE_RANK = ['yuna', 'sora', 'suan', 'minsu', 'jian']

// iOS 16+ and macOS both expose Apple's novelty voices through getVoices(),
// they are `localService` and many are tagged en-US, so a naive "first local
// en-US" pick can legitimately land on Zarvox or Bubbles. They are sound
// effects, not speech models -- never let one become the voice that teaches
// phonics.
const NOVELTY_VOICES = new Set([
  'albert',
  'bad news',
  'bahh',
  'bells',
  'boing',
  'bubbles',
  'cellos',
  'deranged',
  'good news',
  'hysterical',
  'jester',
  'organ',
  'pipe organ',
  'superstar',
  'trinoids',
  'whisper',
  'wobble',
  'zarvox',
])

const EN_REGIONS = ['en-us', 'en-gb', 'en-au', 'en-ie', 'en-ca', 'en-nz', 'en-za', 'en-in']

// Chosen once and reused: getVoices() can return 50+ entries and re-ranking
// them on every utterance would be pure waste. `resolvedFrom` doubles as the
// "have we ever seen a real list" flag -- 0 means keep retrying.
const chosenVoice = { en: null, ko: null }
let resolvedFrom = 0

function betterThan(a, b) {
  for (let i = 0; i < a.length; i++) {
    if (a[i] < b[i]) return true
    if (a[i] > b[i]) return false
  }
  return false
}

function pickVoice(voices, prefix, rank) {
  let best = null
  let bestScore = null
  for (const v of voices) {
    const tag = String((v && v.lang) || '')
      .toLowerCase()
      .replace(/_/g, '-')
    if (!tag.startsWith(prefix)) continue
    const name = String((v && v.name) || '').toLowerCase()
    if (NOVELTY_VOICES.has(name)) continue
    const named = rank.indexOf(name)
    const region = EN_REGIONS.indexOf(tag)
    const score = [
      // A remote voice adds network latency to every single sound and fails
      // outright offline, so locality dominates everything else.
      v.localService === false ? 1 : 0,
      named < 0 ? rank.length : named,
      // Constant (and therefore neutral) for the ko pass, which is fine: the
      // Korean ladder plus `default` already decides that list.
      region < 0 ? EN_REGIONS.length : region,
      v.default ? 0 : 1,
      name, // deterministic tie-break: same device must pick the same voice
    ]
    if (bestScore === null || betterThan(score, bestScore)) {
      best = v
      bestScore = score
    }
  }
  return best
}

// Returns whether a real (non-empty) voice list was seen. An empty list is NOT
// cached as "no voice available" -- on iOS the first getVoices() routinely
// returns [], and caching that would permanently pin the app to the broken
// default-voice path.
function refreshVoices() {
  if (!('speechSynthesis' in window)) return false
  let list = []
  try {
    list = window.speechSynthesis.getVoices() || []
  } catch (e) {
    list = []
  }
  if (!list.length) return false
  // Same list as last time -> same ranking outcome, so don't re-rank 50 voices
  // (or re-log) just because unlockAudio and module-init both call in. A list
  // that has *grown* is re-ranked: iOS can report a partial list first and the
  // full one later, and the better voice may only be in the second one.
  if (list.length === resolvedFrom) return true
  chosenVoice.en = pickVoice(list, 'en', EN_VOICE_RANK)
  chosenVoice.ko = pickVoice(list, 'ko', KO_VOICE_RANK)
  resolvedFrom = list.length
  if (typeof import.meta.env !== 'undefined' && import.meta.env.DEV) {
    // The only way a later session learns which voice the *real iPad* chose;
    // there is no console on the device, so a probe page reads this global.
    const describe = (v) =>
      v ? `${v.name} [${v.lang}${v.localService === false ? ' remote' : ' local'}]` : 'none (engine default)'
    window.__carbotVoices = {
      en: describe(chosenVoice.en),
      ko: describe(chosenVoice.ko),
      all: list.map((v) => `${v.name} [${v.lang}]`),
    }
    console.info('[audio] voice en:', describe(chosenVoice.en), '| ko:', describe(chosenVoice.ko))
  }
  return true
}

// Fires on desktop and on some iOS builds; on the ones where it never fires,
// the retry inside voiceFor() is what eventually resolves the list. Both paths
// are needed -- neither alone is reliable.
if ('speechSynthesis' in window) {
  const onChange = () => {
    resolvedFrom = 0
    refreshVoices()
  }
  try {
    if (window.speechSynthesis.addEventListener) {
      window.speechSynthesis.addEventListener('voiceschanged', onChange)
    } else {
      window.speechSynthesis.onvoiceschanged = onChange
    }
  } catch (e) {
    // ignore
  }
  refreshVoices() // often empty this early; harmless, and sometimes it isn't
}

// Never blocks and never returns a placeholder: a null result means "speak with
// lang only", which is exactly what this module did before voice selection
// existed. So a device (or headless browser) that exposes no voice list at all
// degrades to the previous behaviour instead of going silent -- muting the app
// would be a far worse failure than the wrong-accent bug this fixes.
function voiceFor(lang) {
  if (!resolvedFrom) refreshVoices()
  return lang.startsWith('ko') ? chosenVoice.ko : chosenVoice.en
}

// The queue is an explicit list with one pump, not a promise chain.
//
// It was a chain (`queueTail = queueTail.then(...)`), and the chain could not
// express the one thing tap latency needs: how much silence a boundary needs
// depends on WHICH kind of utterance is about to speak, and that is not known
// when the utterance before it is scheduled -- the child may not have tapped
// yet. In a chain the gap is a `.then(() => sleep(MIN_GAP_MS))` appended by
// the *previous* item, so it is already committed by then. Here the gap is
// decided when an item reaches the front of the queue, where its kind is
// known (see pump()).
//
// A list also replaces the generation counter the chain needed: a dropped
// item is removed outright instead of being left in the chain to check a
// counter and no-op. Whatever is already mid-speech when a clear happens is
// still left alone -- it finishes naturally (it's always short), which is
// simpler and safer than calling speechSynthesis.cancel() (that abrupt
// cancel-and-restart is exactly what caused the original overlap artifacts,
// so this module never calls it).
//
// Invariant, unchanged: exactly one utterance is ever handed to the engine at
// a time, and the next one is not handed over until the previous one has
// finished (per its `onend`, floored by minSpeechMs).
const queue = []
let pumping = false

// Conservative estimate of the moment the last utterance stopped being
// audible: max(its real onend, its minSpeechMs floor). Every gap is measured
// from this rather than from "when we resolved", so a gap is never eaten by
// bookkeeping that happened to run late.
let audibleUntil = 0

// Did the engine's own onend for the last utterance arrive at or after that
// utterance's floor? If it did, `audibleUntil` is a real end-of-audio, not an
// estimate, and the fast tap gap can be spent against it. If it did not (the
// floor had to hold the queue, or only the safety timer ever fired), the
// engine has told us nothing we can trust and every gap stays MIN_GAP_MS --
// which is exactly today's behaviour, so a lying engine loses nothing.
//
// Starts true: nothing has been spoken, so nothing can be overlapped, and the
// very first tap of a screen should be as immediate as possible.
//
// What this bit proves is exactly "onend >= floor", not "onend >= real audio",
// and those differ by however much the floor undershoots -- up to 992ms on
// "awh" (see minSpeechMs). So an engine that lies by a *little* can still be
// trusted here, and on those few strings a tap can start inside the tail.
// That exposure is not new (the same undershoot is what MIN_GAP_MS was
// absorbing) and it shrinks, not grows, with a better floor -- but it is the
// honest limit of this signal, and the reason the fast gap is 120ms and not 0.
let lastEndTrusted = true

// Set by clearAudioQueue(): the next utterance to speak takes no gap at all,
// because the silence that was reserved belonged to the screen the child just
// left. Consumed by the first item that speaks after it (see pump()).
let gapWaived = false

// The most recently queued item, whatever its state. whenAudioIdle() takes a
// snapshot of this so it means "everything queued UP TO THIS POINT", exactly
// as the old `return queueTail` did. Waiting for the queue to be *empty*
// instead would let a child who keeps tapping starve a beat transition
// forever.
let lastEnqueued = null

// The one tap utterance allowed to sit in the queue unspoken (see speakTap).
// Declared here rather than next to speakTap because pump() releases it.
let pendingTap = null

// `volume` defaults to 1 (normal, audible speech) for every real call site in
// this file. The one exception is the unlock utterance in unlockAudio(),
// which passes 0 -- it exists only to satisfy iOS's "one speak() inside a
// gesture" requirement and must never be heard.
function makeItem(text, lang, rate, tap, volume = 1) {
  const item = { text, lang, rate, tap, volume, resolve: null, done: null }
  item.done = new Promise((r) => {
    item.resolve = r
  })
  return item
}

function push(item) {
  queue.push(item)
  lastEnqueued = item
  pump()
  return item.done
}

async function pump() {
  if (pumping) return
  pumping = true
  try {
    while (queue.length) {
      const item = queue[0]
      // The fast tap gap is spent only against evidence that the previous
      // sound really is over (see lastEndTrusted). With no such evidence the
      // previous utterance may still be audible well past `audibleUntil`, and
      // shortening the gap there would not even feel faster -- the engine is
      // still busy -- it would just stack two sounds.
      const need = gapWaived
        ? 0
        : item.tap && lastEndTrusted
        ? TAP_GAP_MS
        : MIN_GAP_MS
      const wait = need - (Date.now() - audibleUntil)
      if (wait > 0) await sleep(wait)
      // clearAudioQueue() can empty the list while we sit in that gap, and a
      // tap item's text can be replaced in place by a newer tap (both are
      // the point). Re-check identity rather than trusting the index.
      if (queue[0] !== item) continue
      queue.shift()
      // Free the coalescing slot at the moment this item starts speaking, so
      // the next tap gets a slot of its own instead of overwriting a word the
      // child is already hearing.
      if (item === pendingTap) pendingTap = null
      gapWaived = false
      // speakNow() never rejects, so one bad utterance cannot stall the pump
      // -- but await it defensively anyway: a throw here would leave
      // `pumping` true (the finally clears it) with items still queued and
      // nothing to restart them, i.e. silence until reload.
      let trusted = false
      try {
        // Asset first, TTS otherwise -- and the choice is made HERE, at the
        // front of the queue, not when the item was enqueued: a tap item's
        // text is replaced in place by a later tap (see speakTap), so the
        // string is only final at this point. Playing a file is an item of
        // this queue like any other, so the "one sound at a time, and the next
        // one is not started until this one is finished" invariant covers both
        // paths; routing assets around the queue would bring back the exact
        // overlap it exists to prevent.
        const buffer = soundBufferFor(item.text, item.lang)
        const played = buffer ? await playSound(buffer) : null
        // Real-device report: phoneme sounds (this WebAudio path) kept
        // working while EVERY word (the speechSynthesis path below, since no
        // word has a baked asset) went silent from the point the WAV assets
        // shipped. Every word utterance in real curriculum flow sits right
        // after a phoneme play (teach a sound, then speak the word it came
        // from) -- so if WebKit's speech daemon can be stalled by a WebAudio
        // buffer having just played through the same shared iOS audio
        // session, this exact call site is where it happens, every time,
        // right before the child would hear the word. Not confirmed against
        // a cited WebKit bug report (none found describing this precise
        // interaction) -- this is the documented pause()/resume() daemon-kick
        // (see kickSpeechDaemon) applied at the one transition the idle
        // watchdog cannot cover, because nothing here was ever idle. Cheap
        // and inert if the hypothesis is wrong: pause()/resume() on an engine
        // that isn't speaking is a no-op.
        if (played) kickSpeechDaemon()
        // `null` means no audio was produced -- no asset for this string, the
        // context is not running, the buffer has not finished loading, or the
        // source node threw. Every one of those routes to TTS, so the only way
        // this item makes no sound at all is a speechSynthesis that makes none.
        trusted = played === null
          ? await speakNow(item.text, item.lang, item.rate, item.volume)
          : played
      } catch (e) {
        // ignore -- treat as spoken, and as untrustworthy
      }
      // speakNow() already holds its resolve until max(onend, floor), so "now"
      // IS the conservative end-of-audio -- no separate arithmetic needed.
      audibleUntil = Date.now()
      lastEndTrusted = trusted
      item.resolve()
    }
  } finally {
    pumping = false
  }
}

// ---- jammed-daemon recovery ----
//
// speakNow()'s safety timer already guarantees this module's OWN promise
// chain never deadlocks -- pump() always advances, one way or another. But
// that is not the same thing as the engine recovering. If the real WebKit
// speech daemon has wedged (the "next speak() after idle" bug the watchdog
// above exists for, or some other stall with the same shape), the browser's
// `speechSynthesis.speaking` flag can stay stuck `true` forever even after
// this module has internally given up and moved on -- which means every
// utterance queued after the jammed one is handed to an engine that is still
// "busy" with a dead one, and none of them ever produce sound either. From
// the outside that reads exactly like the real-device report: phoneme
// sounds (WebAudio, a separate path) keep working while every word (TTS)
// goes silent from one point on, with the game otherwise proceeding
// normally because pump()'s safety timers keep resolving promises.
//
// The signal used here is deliberately narrow: only checked when an
// utterance's OWN safety timer had to fire, i.e. neither onend nor onerror
// ever arrived for it (see the `!reported` call below). That is already the
// rare/abnormal case. Checked a moment later whether the engine is STILL
// reporting `speaking === true` at that point -- if so, this is not "an
// utterance that took a while", it is evidence the daemon dropped an item
// and never told anyone.
//
// THIS WAS TOO TRIGGER-HAPPY (real-device report, 2026-08-27 session): a
// real-device play-through found this firing on nearly EVERY utterance, and
// escalating to cancel() -- which drops the ENTIRE queue, not just the
// suspect item -- inside one second of the safety timer giving up. The
// safety timer's own estimate already has slack built in (see
// `estimatedMs` in speakNow), but it is an estimate of AUDIO duration, not
// of how long the engine can take to even start: real onstart latency on
// iPadOS Safari has been observed to run close to 4s. A speak() call that
// simply hasn't started yet is spec-legal `speaking === true` with nothing
// wrong at all -- and the old 500ms+500ms escalation was well inside that
// window, so it was routinely killing utterances that were about to play
// fine, which is a strictly worse failure than the rare true jam this exists
// to catch (that one is at least silent-and-eventually-recoverable via the
// idle watchdog above; cancel() is audible and immediate, and it takes
// every OTHER queued utterance down with it).
//
// So this is now much more patient, and cancel() is reserved for a signal
// that cannot be "just a slow start": `speaking` staying true across THREE
// separate checks, several seconds apart, with a pause()/resume() kick
// attempted before each re-check. A slow-but-legitimate utterance clears on
// one of the early checks (kickSpeechDaemon-style pause/resume is a no-op on
// real audio, so it never interrupts one); only a daemon that is still
// reporting busy after ~9s of that survives to the cancel() branch.
let jamRecoveryInFlight = false

// Spacing between re-checks, in ms -- generous on purpose (see above). The
// first element is the delay before the FIRST check; each later element is
// the delay before the check that follows a failed kick.
const JAM_RECHECK_DELAYS_MS = [3000, 3000, 3000]

function scheduleJamCheck(rawText) {
  if (!('speechSynthesis' in window)) return
  if (jamRecoveryInFlight) return
  jamRecoveryInFlight = true
  setTimeout(() => attemptJamRecovery(rawText, 0), JAM_RECHECK_DELAYS_MS[0])
}

function attemptJamRecovery(rawText, attempt) {
  let stillStuck = false
  try {
    stillStuck = !!window.speechSynthesis.speaking
  } catch (e) {
    jamRecoveryInFlight = false
    return
  }
  if (!stillStuck) {
    // Cleared on its own -- the safety timer firing was the ordinary
    // "onend never arrived for this one utterance" case (or a slow start
    // that has since resolved), not a stuck daemon.
    jamRecoveryInFlight = false
    return
  }
  console.warn(
    '[audio] speechSynthesis still reports speaking=true well after this ' +
      'module\'s own safety timer gave up on "' + rawText + '" (check ' +
      attempt + '). Kicking and re-checking before assuming a real jam.'
  )
  // A more insistent version of kickSpeechDaemon(): that helper refuses to
  // touch the engine while `speaking` is true, because normally that means
  // a REAL utterance is in flight and pausing it would be an audible
  // hiccup. That guard does not apply here -- we already have some evidence
  // (this utterance's own safety timer fired) that something is off, and a
  // pause()/resume() kick is a no-op on genuinely in-progress audio, so it
  // costs nothing to try even if this turns out to be a slow start rather
  // than a jam.
  try {
    window.speechSynthesis.pause()
    window.speechSynthesis.resume()
  } catch (e) {
    // ignore -- fall through to the re-check below regardless
  }
  const nextAttempt = attempt + 1
  if (nextAttempt < JAM_RECHECK_DELAYS_MS.length) {
    setTimeout(() => attemptJamRecovery(rawText, nextAttempt), JAM_RECHECK_DELAYS_MS[nextAttempt])
    return
  }
  // Last resort, only reached after JAM_RECHECK_DELAYS_MS.length independent
  // "still speaking" observations several seconds apart, each preceded by a
  // kick that had every chance to clear a slow-but-real utterance. cancel()
  // is banned everywhere else in this file because it kills a queue that
  // might have real, audible speech in flight -- but by this point that
  // risk has been spent down about as far as it can be without proof, and
  // the alternative (never recovering the true permanent-wedge case) is the
  // one failure mode nothing else in this file can route around.
  console.warn(
    '[audio] speechSynthesis still jammed after ' + JAM_RECHECK_DELAYS_MS.length +
      ' kicks over several seconds -- calling cancel() to unstick the daemon'
  )
  try {
    window.speechSynthesis.cancel()
  } catch (e) {
    // ignore
  } finally {
    jamRecoveryInFlight = false
  }
}

// Resolves with `true` when the engine's own onend arrived at or after the
// floor below -- i.e. this engine reported completion no earlier than the
// audio can possibly have finished, so its report is trustworthy for this
// utterance. `false` means the floor had to hold the queue open (the engine
// claimed to be finished early), or nothing ever reported at all and the
// safety timer fired. pump() spends that one bit: it is the only evidence
// this module has about whether the sound is really over, and the fast tap
// gap is only safe when it says yes.
function speakNow(text, lang, rate, volume = 1) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve(true)
      return
    }
    // Never let a bad argument reject: this promise is a link in the shared
    // queue chain, and one rejected link would leave every later utterance
    // and every whenAudioIdle()-gated transition waiting on a promise that
    // can never settle -- silent app, dead buttons, reload required. A
    // missing/empty string is a content bug worth surviving, not crashing on.
    const raw = text == null ? '' : String(text)
    if (!raw.trim()) {
      resolve(true) // nothing is playing, so nothing can be landed on
      return
    }
    let done = false
    let reported = false // did onend/onerror fire, or only the safety timer?
    const startedAt = Date.now()
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(safetyTimer)
      // Neither onend nor onerror ever arrived for this utterance -- either
      // the safety timer above had to fire on its own, or speak() itself
      // threw synchronously (see the catch below). Both are the narrow
      // signal scheduleJamCheck() looks for; it only warns/acts if the
      // engine is STILL reporting `speaking` a moment later, so a one-off
      // flaky utterance that clears on its own costs nothing here.
      if (!reported) scheduleJamCheck(raw)
      // iPadOS Safari fires `onend` before playback has actually finished
      // (measured: an instantly-resolving onend lets a following utterance
      // start 2.3s into a still-playing Korean recap line). The queue's whole
      // job is that no sound ever lands on another, and it decides that from
      // onend -- so a lying onend breaks the guarantee outright. Hold the
      // resolve until at least a conservative *lower bound* on the real audio
      // duration has passed.
      //
      // Fitted, not a strict lower bound -- see minSpeechMs. On a browser
      // whose onend is honest this branch can still wait, but by at most
      // ~120ms on any string this app speaks, which buys a real guard against
      // the engine that lies. It cannot outlive the safety timeout either --
      // that estimate is ~3x larger for every input.
      const remaining = minSpeechMs(raw, lang, rate) - (Date.now() - startedAt)
      if (remaining > 0) {
        setTimeout(() => resolve(false), remaining)
        return
      }
      resolve(reported)
    }
    // English TTS engines read an all-caps single letter as "Capital S"
    // and an all-caps short non-word (like "SAT") as a spelled-out
    // initialism ("S. A. T.") rather than the blended word "sat" -- both
    // wrong for phonics teaching, where case is a visual-only distinction
    // and never a pronunciation cue. Lowercasing everything sent to the
    // English voice sidesteps both misreadings; it's a no-op for Korean.
    const spoken = lang.startsWith('en') ? raw.toLowerCase() : raw
    const utter = new SpeechSynthesisUtterance(spoken)
    // `lang` first, `voice` last: some engines drop a voice whose language
    // disagrees with utter.lang, so they are set to agree and the explicit
    // voice gets the final word. With no voice resolved this is byte-identical
    // to the pre-voice-selection path.
    const voice = voiceFor(lang)
    utter.lang = (voice && voice.lang) || lang
    if (voice) {
      // Guarded because this assignment is the one thing in this function that
      // can throw, and it throws *inside the Promise executor* -- which would
      // reject this queue link, and a rejected link propagates into
      // whenAudioIdle(), i.e. every beat transition in the app throws and the
      // screen freezes. Measured, not hypothetical: Chrome raises
      // "Failed to convert value to 'SpeechSynthesisVoice'" for anything that
      // isn't a live entry from that engine's own getVoices(). A real device
      // hands us real entries, but "wrong voice" must never be able to become
      // "dead app", so a rejected voice degrades to lang-only speech.
      try {
        utter.voice = voice
      } catch (e) {
        utter.lang = lang
      }
    }
    utter.rate = rate
    utter.volume = volume
    const reportedFinish = () => {
      reported = true
      finish()
    }
    utter.onend = reportedFinish
    utter.onerror = reportedFinish
    // Safety net: speechSynthesis is known to occasionally never fire
    // onend/onerror at all (a real, documented flakiness, worse when a
    // tab is backgrounded/throttled) -- without this, one stuck
    // utterance would permanently deadlock the whole queue behind it,
    // which would be far worse than the overlap bug this queue exists to
    // fix. A generous length-based estimate means this essentially never
    // fires under normal conditions -- real completion via onend is
    // still what resolves things almost every time.
    // Scaled by 1/rate. The old fixed form was fitted at one rate, and a
    // *slower* rate makes real speech longer while leaving the net where it
    // was -- so the net starts firing during normal speech, the pump advances,
    // and the next sound stacks on the one still playing. That is the exact
    // overlap this queue exists to prevent, arriving through its own safety
    // valve. Concretely: "sss" got 1860ms, but at rate 0.15 it really takes
    // ~4-5s. Clamped below at 1 so a fast rate can only ever widen the net,
    // never tighten it -- this must stay a net that never fires in practice.
    const slow = 1 / Math.min(1, Math.max(0.05, rate || 1))
    const estimatedMs = Math.min(30000, Math.max(2500, (1500 + raw.length * 120) * slow))
    const safetyTimer = setTimeout(finish, estimatedMs)
    try {
      window.speechSynthesis.speak(utter)
    } catch (e) {
      // speak() itself throwing would otherwise reject this link of the queue
      finish()
    }
  })
}

// Appends one utterance to the shared queue. Resolves once that utterance has
// actually finished playing (so callers can chain their own extra pacing on
// top if they want) -- or immediately, if it gets dropped by
// clearAudioQueue() before it ever speaks. It never rejects: every beat
// transition in the app is gated on one of these promises, so a rejection
// would freeze the screen.
function enqueueSpeak(text, lang, rate) {
  return push(makeItem(text, lang, rate, false))
}

// Resolves once every utterance queued *up to this point* has actually
// finished playing (including the trailing MIN_GAP_MS silence). Screen
// transitions that follow an audio cue -- advancing to the next beat,
// jumping into the read-aloud confirmation screen, etc. -- should await
// this instead of a fixed setTimeout, so the visual never moves on while
// speech is still in flight, and a newly-rendered beat's own auto-played
// audio never lands on top of the previous beat's tail end.
//
// The trailing silence is measured from `audibleUntil`, so if the child got a
// tap sound in after the snapshot, this waits out that sound too rather than
// transitioning across it -- bounded by one utterance, because the snapshot
// is what it waits *for*.
export function whenAudioIdle() {
  const target = lastEnqueued
  return (target ? target.done : Promise.resolve()).then(() => {
    const rest = MIN_GAP_MS - (Date.now() - audibleUntil)
    return rest > 0 ? sleep(rest) : undefined
  })
}

// Drops everything still *waiting* in the queue (not yet actually
// speaking) without interrupting whatever utterance is currently
// playing. Call this on any "leave this context" navigation (exiting a
// stage mid-round, backing out to the map/chapter/world screens) so
// leftover queued speech doesn't keep talking over a screen the child
// has already moved away from.
export function clearAudioQueue() {
  // Resolve as we drop: a dropped item's promise is awaited by whatever queued
  // it (and possibly by whenAudioIdle), and leaving it pending forever is the
  // frozen-screen failure this module is built to avoid.
  for (const item of queue) item.resolve()
  queue.length = 0
  pendingTap = null
  // Waive the gap in front of whatever speaks next. The reserved silence
  // belonged to a screen the child has left, and making the new screen's
  // first sound sit behind it is the "nothing happens when I press it"
  // complaint in miniature. The old promise chain did this implicitly -- it
  // reset queueTail, discarding the pending sleep -- and a regression case
  // pins the behaviour (a tapped option has to speak within 300ms of
  // entering a freshly-navigated stage, and the utterance from the screen
  // before it is often still finishing at that moment).
  //
  // Waiving only the gap is strictly tighter than what the chain did: the
  // chain also discarded the *ordering*, so the new screen's first utterance
  // could be handed to the engine while the outgoing one was still speaking.
  // Here it still waits for the in-flight utterance to finish -- it just
  // doesn't wait an extra MIN_GAP_MS after it.
  gapWaived = true
}

export function speakEN(text, rate = EN_RATE) {
  return enqueueSpeak(text, 'en-US', rate)
}

// ---- tap feedback ----
//
// A 5-year-old taps the same tile, option or 🔊 button over and over. The
// queue deliberately never interrupts, so N taps meant N utterances plus N
// MIN_GAP_MS gaps: a multi-second backlog that every whenAudioIdle()-gated
// transition then had to sit through, so the screen looked frozen for
// seconds right when the child finally tapped the correct answer.
//
// Tap feedback is therefore coalesced into a single queue slot: while one
// tap sound is still waiting its turn, further taps reuse it instead of
// queueing more. The backlog from tapping is bounded at one utterance
// speaking plus one waiting, no matter how fast the child taps. Deliberate
// content playback (a beat's own auto-played prompt, teach sequences) keeps
// using speakEN/speakSequence and is never droppable.
//
// (`pendingTap` itself is declared with the queue -- pump() releases it.)
//
// Coalescing used to mean "the first tap wins and later ones are thrown
// away", and that was the wrong end to keep -- but LATEST-WINS-UNCONDITIONALLY
// (overwrite the pending slot no matter what it was waiting to say) turned out
// to be the wrong fix. It was keyed on "is a tap already pending", not on
// "is it pending for the SAME target" -- so two quick taps on two DIFFERENT
// options (`sock` then `dog`, or three different drag-build tiles) collapsed
// into one utterance and silently dropped the other, even though neither tap
// was a repeat. That is a distinct bug from the one this coalescing exists to
// fix (spamming the SAME target over and over), and it produced exactly the
// real-device symptom -- some words never heard -- because the pending slot
// sits in the queue for up to TAP_GAP_MS/MIN_GAP_MS before it starts
// speaking, and any tap landing in that window used to overwrite it
// regardless of identity.
//
// So coalescing is now keyed on identity: only a tap that matches the
// CURRENTLY WAITING tap's own text reuses the slot (this is what "repeated
// rapid taps on the same thing" actually means). A tap on anything else opens
// its own new queue item -- it is not a repeat, so it must not be dropped --
// and that new item becomes the pending slot going forward, so a burst of
// repeats *of it* still coalesces the same way. This still bounds a spam
// burst on one target to "one playing + one waiting", exactly as before; it
// just no longer conflates "repeat" with "any second tap".
export function speakTap(text, rate = EN_RATE) {
  if (pendingTap && pendingTap.text === text) {
    pendingTap.rate = rate
    return pendingTap.done
  }
  const item = makeItem(text, 'en-US', rate, true)
  pendingTap = item
  return push(item)
}

export function speakKO(text, rate = 1) {
  return enqueueSpeak(text, 'ko-KR', rate)
}

// Default gap bumped way up from the old 250ms: repeated sounds/words in
// a teach/break sequence (e.g. "S ... sss ... S ... sss") need close to a
// full second of breathing room between repetitions to read as paced
// rather than rushed. Each item still goes through the shared queue
// above, so even if a given utterance runs long, this gap is timed from
// its *actual* completion, not a fixed guess.
// The gap belongs BETWEEN items, so the last item doesn't get one: a trailing
// gap is not pacing, it is dead air the child has to sit through before the
// "Next" button (which awaits this promise) will respond -- 1.1s of nothing
// on every teach and break beat in the app. Removing it changes no gap that
// is actually heard, and whenAudioIdle() still reserves MIN_GAP_MS after the
// final utterance, so nothing else can crowd it either.
export async function speakSequence(texts, lang = 'en-US', gapMs = 1100) {
  const rate = lang.startsWith('ko') ? 1 : EN_RATE
  for (let i = 0; i < texts.length; i++) {
    await enqueueSpeak(texts[i], lang, rate)
    if (i < texts.length - 1) await sleep(gapMs)
  }
}

const SpeechRecognitionImpl =
  window.SpeechRecognition || window.webkitSpeechRecognition || null

export function speechRecognitionAvailable() {
  return !!SpeechRecognitionImpl
}

// NOT CURRENTLY CALLED -- kept for when a design actually consumes the
// result. Three reasons it was unwired from the read-aloud beats:
//   1. nothing read the { attempted, matched } it resolves with, so it bought
//      no pedagogy at all;
//   2. the iPadOS permission prompt fires on the first start(), which landed
//      exactly on the child's reward moment ("명중! 💥");
//   3. an active recognition session can suppress speechSynthesis on iOS for
//      the length of its window, eating the *next* beat's auto-played audio --
//      breaking this app's core guarantee that every sound is heard as its own
//      distinct event.
// Zero benefit against a broken guarantee is a pure loss, so the calls went
// away and the capability stayed. Wire it back up only together with
// something that uses the result.
//
// Best-effort listen. Resolves { attempted, matched } - never rejects,
// and always resolves within ~4s so it can never block the UI.
export function tryRecognize(targetText, timeoutMs = 4000) {
  return new Promise((resolve) => {
    if (!SpeechRecognitionImpl) {
      resolve({ attempted: false, matched: false })
      return
    }
    let done = false
    const finish = (result) => {
      if (done) return
      done = true
      try {
        recognition.stop()
      } catch (e) {
        // ignore
      }
      resolve(result)
    }
    const recognition = new SpeechRecognitionImpl()
    recognition.lang = 'en-US'
    recognition.interimResults = false
    recognition.maxAlternatives = 3
    recognition.onresult = (event) => {
      const alts = Array.from(event.results[0] || []).map((r) =>
        r.transcript.trim().toLowerCase()
      )
      const target = targetText.trim().toLowerCase()
      const matched = alts.some(
        (a) => a === target || a.includes(target) || target.includes(a)
      )
      finish({ attempted: true, matched })
    }
    recognition.onerror = () => finish({ attempted: true, matched: false })
    recognition.onspeechend = () => {
      setTimeout(() => finish({ attempted: true, matched: false }), 300)
    }
    setTimeout(() => finish({ attempted: false, matched: false }), timeoutMs)
    try {
      recognition.start()
    } catch (e) {
      finish({ attempted: false, matched: false })
    }
  })
}
