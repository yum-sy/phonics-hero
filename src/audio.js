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
  // iOS populates getVoices() lazily, and on some builds only after the first
  // speak(). This is the first user gesture in the app, so it's the earliest
  // moment a real voice list can exist -- grab it here rather than waiting for
  // a voiceschanged event that may never arrive.
  refreshVoices()
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
// pause inside one utterance (the tutorials say a sound three times as
// "lll, lll, lll"), which roughly doubles the per-character cost versus a
// plain word of the same length.
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
// Verified at EN_RATE = 0.5 against every string this app actually speaks
// (157 English + 31 Korean), scored two ways: dead air = floor - real, and
// collision = real - floor - (that string's real gap). Fitted to Samantha,
// because Samantha is the iOS en-US default and iPadOS Safari is the only
// engine whose onend lies -- a floor calibrated to a voice the target device
// does not use protects nothing:
//   dead air    worst +124ms, and only on "zzz" (see below); next worst +12ms
//   collision   worst +126ms, on "cta" -- a scramble tile that is only ever
//               spoken by tapping it; worst on any auto-played string is
//               +109ms ("lll, lll, lll")
//   Korean      dead air <= +77ms, collision negative on all 31 lines; the
//               tightest is -26ms, so the reward screen's Korean-then-English
//               handoff has no overlap left in it
// Alex is the loose end, by up to +719ms ("zzz") -- it is a macOS voice, not an
// iOS default, and no single length model can serve both when the two disagree
// 7x on the same string ("zzz": Samantha 212ms, Alex 1555ms). Raising the comma
// slope costs Alex 279ms of dead air on "kuh, kuh, kuh"/"guh, guh, guh", which
// is the trade this file already declared: unnoticed silence on a voice the
// child will not hear, against an audible collision on the voice they will.
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
      // Fitted, not a strict lower bound -- see minSpeechMs. On a browser
      // whose onend is honest this branch can still wait, but by at most
      // ~120ms on any string this app speaks, which buys a real guard against
      // the engine that lies. It cannot outlive the safety timeout either --
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
