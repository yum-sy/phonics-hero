// TTS playback (English target content + Korean instructions) and an
// optional, best-effort speech-recognition assist for the read-aloud check.
// The manual "다 읽었어요!" button is always the primary, reliable path —
// SpeechRecognition is unreliable on iPadOS Safari, so it's only ever a bonus.

let audioUnlocked = false

export function unlockAudio() {
  if (audioUnlocked) return
  audioUnlocked = true
  try {
    const u = new SpeechSynthesisUtterance(' ')
    u.volume = 0
    window.speechSynthesis.speak(u)
  } catch (e) {
    // ignore
  }
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

// Playback rate for every English utterance the child is meant to hear as a
// model and copy -- which is all of them: letter sounds, words, teach
// sequences, tap feedback. Lowered from 0.85 after a real-iPad report that the
// repeated sounds were far too fast for a 5-year-old to imitate.
//
// Measured, because the obvious objection is that rate does nothing here:
// `say` quantizes rate into buckets, and the whole 20x span from -r 200 down
// to -r 10 moves "tuh" only 385ms -> 685ms. So rate is genuinely a weak
// lever -- but not a zero one, and 0.85 -> 0.5 lands one full bucket lower
// (Samantha "tuh" 488 -> 534ms, "sss" 854 -> 922, "kuh, kuh, kuh"
// 1892 -> 2067). It is also the only lever that lives in this file: making
// the *sound itself* longer needs different text, which is chapter data.
//
// Not lower than this: 0.5 is the last value whose bucket is measured here,
// and on engines that honour rate linearly (desktop Chrome, Android) it is
// already a 1.7x stretch of every word.
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
//   comma English  105 ms/char, or 370 per comma-separated token, whichever is
//                  larger -- the token term is what catches short bundles like
//                  "a, a" whose length badly understates them
//                  ("guh, guh, guh" 1256ms sets the slope, "oh, oh" 764ms the
//                   token cost)
//   Korean         115 ms/char            (per Hangul syllable block -- NOT
//                                          per UTF-8 byte)
//
// Commas are the primary discriminator, not length: a comma is a deliberate
// pause inside one utterance (the tutorials say a sound three times as
// "lll, lll, lll"), which roughly doubles the per-character cost versus a
// plain word of the same length.
//
// The stretch tiers exist because lowering EN_RATE invalidates a floor
// calibrated at a higher rate. They are the measured *minimum* duration ratio
// across the corpus, per class, so they never overshoot; and since duration is
// monotonic in rate, a rate that lands in a less generous tier than it
// deserves is safe by construction. Plain speech stretches at least 1.16x from
// rate 1.0 to 0.5, comma bundles at least 1.19x (they stretch more because the
// engine's comma pause scales too).
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
    ? Math.max(105 * len, 370 * text.split(',').length)
    : Math.max(290, 78 * len)
  return base * stretch(rate, commas)
}

let queueTail = Promise.resolve()

// Bumped whenever clearAudioQueue() is called. Anything already chained
// onto the *old* queueTail but not yet actually speaking checks this and
// silently no-ops instead of speaking late over a screen the child has
// already left. Whatever utterance is already mid-speech when a clear
// happens is left alone -- it finishes naturally (it's always short),
// which is simpler and safer than calling speechSynthesis.cancel() (that
// abrupt cancel-and-restart is exactly what caused the original overlap
// artifacts, so this module never calls it).
let generation = 0

function speakNow(text, lang, rate) {
  return new Promise((resolve) => {
    if (!('speechSynthesis' in window)) {
      resolve()
      return
    }
    // Never let a bad argument reject: this promise is a link in the shared
    // queue chain, and one rejected link would leave every later utterance
    // and every whenAudioIdle()-gated transition waiting on a promise that
    // can never settle -- silent app, dead buttons, reload required. A
    // missing/empty string is a content bug worth surviving, not crashing on.
    const raw = text == null ? '' : String(text)
    if (!raw.trim()) {
      resolve()
      return
    }
    let done = false
    const startedAt = Date.now()
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(safetyTimer)
      // iPadOS Safari fires `onend` before playback has actually finished
      // (measured: an instantly-resolving onend lets a following utterance
      // start 2.3s into a still-playing Korean recap line). The queue's whole
      // job is that no sound ever lands on another, and it decides that from
      // onend -- so a lying onend breaks the guarantee outright. Hold the
      // resolve until at least a conservative *lower bound* on the real audio
      // duration has passed.
      //
      // Deliberately a lower bound, not an estimate: it is below the measured
      // duration of every string this app speaks, so on a browser whose onend
      // is honest this branch never waits at all and no transition gets one
      // millisecond slower. It cannot outlive the safety timeout either --
      // that estimate is ~3x larger for every input.
      const remaining = minSpeechMs(raw, lang, rate) - (Date.now() - startedAt)
      if (remaining > 0) {
        setTimeout(resolve, remaining)
        return
      }
      resolve()
    }
    // English TTS engines read an all-caps single letter as "Capital S"
    // and an all-caps short non-word (like "SAT") as a spelled-out
    // initialism ("S. A. T.") rather than the blended word "sat" -- both
    // wrong for phonics teaching, where case is a visual-only distinction
    // and never a pronunciation cue. Lowercasing everything sent to the
    // English voice sidesteps both misreadings; it's a no-op for Korean.
    const spoken = lang.startsWith('en') ? raw.toLowerCase() : raw
    const utter = new SpeechSynthesisUtterance(spoken)
    utter.lang = lang
    utter.rate = rate
    utter.onend = finish
    utter.onerror = finish
    // Safety net: speechSynthesis is known to occasionally never fire
    // onend/onerror at all (a real, documented flakiness, worse when a
    // tab is backgrounded/throttled) -- without this, one stuck
    // utterance would permanently deadlock the whole queue behind it,
    // which would be far worse than the overlap bug this queue exists to
    // fix. A generous length-based estimate means this essentially never
    // fires under normal conditions -- real completion via onend is
    // still what resolves things almost every time.
    const estimatedMs = Math.min(12000, Math.max(2500, 1500 + raw.length * 120))
    const safetyTimer = setTimeout(finish, estimatedMs)
    try {
      window.speechSynthesis.speak(utter)
    } catch (e) {
      // speak() itself throwing would otherwise reject this link of the queue
      finish()
    }
  })
}

// Appends one utterance to the shared queue. Resolves once that
// utterance has actually finished playing (so callers can chain their
// own extra pacing on top if they want), while the queue itself also
// reserves MIN_GAP_MS of silence afterward before the *next* queued
// utterance is allowed to start.
// `onStart` fires when this item actually reaches the front of the queue and
// begins speaking (never, if it gets dropped by clearAudioQueue first).
function enqueueSpeak(text, lang, rate, onStart) {
  const myGeneration = generation
  // The rejection handler on `queueTail` is load-bearing, not decoration:
  // every future utterance and every whenAudioIdle()-gated transition chains
  // onto this same promise, so a single rejected link anywhere would kill all
  // audio and freeze all beat transitions app-wide until reload.
  const spoken = queueTail.then(
    () => {
      if (myGeneration !== generation) return undefined // dropped by clearAudioQueue()
      if (onStart) onStart()
      return speakNow(text, lang, rate)
    },
    () => undefined
  )
  queueTail = spoken.then(() => sleep(MIN_GAP_MS))
  return spoken
}

// Resolves once every utterance queued *up to this point* has actually
// finished playing (including the trailing MIN_GAP_MS silence). Screen
// transitions that follow an audio cue -- advancing to the next beat,
// jumping into the read-aloud confirmation screen, etc. -- should await
// this instead of a fixed setTimeout, so the visual never moves on while
// speech is still in flight, and a newly-rendered beat's own auto-played
// audio never lands on top of the previous beat's tail end.
export function whenAudioIdle() {
  return queueTail
}

// Drops everything still *waiting* in the queue (not yet actually
// speaking) without interrupting whatever utterance is currently
// playing. Call this on any "leave this context" navigation (exiting a
// stage mid-round, backing out to the map/chapter/world screens) so
// leftover queued speech doesn't keep talking over a screen the child
// has already moved away from.
export function clearAudioQueue() {
  generation += 1
  queueTail = Promise.resolve()
  // A dropped item never reaches its onStart, so release the coalescing slot
  // by hand or all later tap feedback would be swallowed for good.
  pendingTap = null
}

export function speakEN(text, rate = EN_RATE) {
  return enqueueSpeak(text, 'en-US', rate)
}

// ---- paced repetition for sounds too short to imitate ----
//
// The other half of the same iPad report ("TTT 발음이 없어" -- the /t/ in the
// chapter 1 boss was simply not heard). Measured: the plosive approximations
// render at 297-488ms (Samantha 405-488, Alex 297-333), against the 780-855ms
// that this project already established as the threshold for a sound a child
// actually registers. Rate cannot close that -- see EN_RATE -- because the
// duration is articulation-bound, not rate-bound. Only repetition can: three
// exposures with real silence between them give the child a beat to copy into,
// which one 300ms burst never does.
//
// This is the same prescription as the comma-triple spelling used in chapter
// data ("kuh, kuh, kuh"), but the pause here is real queue silence we control
// rather than whatever the engine decides a comma is worth, and it works
// without rewriting content. A text that already carries a comma, or is a
// phrase rather than a single token, is left alone -- echoing those would
// stack a triple on a triple and turn one sound into nine seconds.
const ECHO_GAP_MS = 900

export async function speakEcho(text, times = 3, gapMs = ECHO_GAP_MS) {
  const raw = text == null ? '' : String(text)
  const bundled = raw.includes(',') || /\s/.test(raw.trim())
  const passes = bundled ? 1 : Math.max(1, times)
  for (let i = 0; i < passes; i++) {
    await enqueueSpeak(raw, 'en-US', EN_RATE)
    if (i < passes - 1) await sleep(gapMs)
  }
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
let pendingTap = null

export function speakTap(text, rate = EN_RATE) {
  if (pendingTap) return pendingTap
  const p = enqueueSpeak(text, 'en-US', rate, () => {
    if (pendingTap === p) pendingTap = null
  })
  pendingTap = p
  return p
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
