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
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(safetyTimer)
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

export function speakEN(text, rate = 0.85) {
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
let pendingTap = null

export function speakTap(text, rate = 0.85) {
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
export async function speakSequence(texts, lang = 'en-US', gapMs = 1100) {
  for (const t of texts) {
    await enqueueSpeak(t, lang, 0.85)
    await sleep(gapMs)
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
