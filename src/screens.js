import {
  chapters,
  getChapterById,
  getChapterForStage,
  getStageById,
  getWorldById,
  getWorldForChapterOrder,
  stageHealthMax,
  worlds,
} from './data/stages.js'
// Not re-exported by data/stages.js's back-compat shim, so imported straight
// from the module it actually lives in. Read-only: this file consumes
// SOUND_TABLE (via this lookup) to build review rounds, never edits
// src/data/chapters/** itself -- that stays phonics-owned.
import { letterformSounds } from './data/chapters/index.js'
import {
  clearCheckpoint,
  getCheckpoint,
  isChapterCleared,
  isChapterUnlocked,
  isReviewMode,
  isStageCleared,
  isStageUnlocked,
  isWorldCleared,
  isWorldUnlocked,
  markStageCleared,
  saveCheckpoint,
} from './state.js'
import {
  attemptShoutAttack,
  clearAudioQueue,
  isAudioIdle,
  onAudioActivity,
  speakEN,
  speakKO,
  speakSequence,
  speakTap,
  unlockAudio,
  whenAudioIdle,
} from './audio.js'
import { heroArt, villainArt, heroEmblem } from './art.js'
import { fusionLineup } from './art/fusion-lineup.js'
import { wordIcon, shoutBurst } from './icons.js'

const app = document.getElementById('app')

// ---- screen lifetime token ----
//
// Beat transitions deliberately await audio before moving on, and a
// 5-year-old taps 나가기 in the middle of that wait. The continuation then
// resumes against a screen that no longer exists: at best it renders a beat
// into a #beat-area that has been replaced (TypeError), at worst it paints
// the reward screen -- and banks a stage clear -- on top of the map the
// child just navigated to. Every top-level screen render invalidates the
// previous one, and anything resuming after an await checks it still owns
// the screen.
let navGeneration = 0

function beginScreen() {
  navGeneration += 1
  return navGeneration
}

function ownsScreen(runtime) {
  return runtime.nav === navGeneration
}

// A top-level screen replaces all of #app, so a throw in one is worse than a
// failed beat: the card the child tapped just does nothing, which to them is
// the app being broken. Reuse the beat recovery panel, with the one escape
// that exists from anywhere -- the world list. If the world list itself is
// what failed, the escape lands back on this panel rather than a blank
// screen, so there is still always something that responds.
function runScreen(render, retry) {
  try {
    render()
  } catch (e) {
    console.error('[screen] 렌더 실패', e)
    app.innerHTML = `<div class="screen">${failurePanelHtml('◀ Worlds')}</div>`
    onTap(document.getElementById('retry-beat'), retry)
    onTap(document.getElementById('failure-escape'), () => renderWorldSelect())
  }
}

// The dedicated review page supplies its own catalog. Normal navigation is
// unchanged unless that page explicitly enables isolated review state.
let reviewNavigation = null

export function configureReviewNavigation(callback) {
  if (callback !== null && typeof callback !== 'function') {
    throw new TypeError('Review navigation must be a function or null')
  }
  reviewNavigation = callback
}

function returnToReviewCatalog(chapterId) {
  if (!isReviewMode() || !reviewNavigation) return false
  beginScreen()
  clearAudioQueue()
  reviewNavigation(chapterId)
  return true
}

export function startReviewStage(stageId) {
  if (!isReviewMode()) throw new Error('Review mode must be enabled first')
  if (!getStageById(stageId)) throw new Error(`Unknown review stage: ${stageId}`)
  clearCheckpoint()
  // Keep this synchronous in the caller's tap; do not await AudioContext resume.
  unlockAudio()
  renderStage(stageId)
}

export function renderWorldSelect() {
  if (returnToReviewCatalog()) return
  runScreen(worldSelectScreen, renderWorldSelect)
}

export function renderChapterSelect(worldId) {
  if (returnToReviewCatalog()) return
  runScreen(
    () => chapterSelectScreen(worldId),
    () => renderChapterSelect(worldId)
  )
}

export function renderMap(chapterId) {
  if (returnToReviewCatalog(chapterId)) return
  runScreen(
    () => mapScreen(chapterId),
    () => renderMap(chapterId)
  )
}

function renderStage(stageId) {
  runScreen(
    () => stageScreen(stageId),
    () => renderStage(stageId)
  )
}

// A single-letterform tile already embosses the grapheme inside the icon
// itself (see icons.js's letterTile), so a second plain-text copy of the
// same glyph underneath is visual noise, not reinforcement -- per the
// phonics team, two differently-styled renderings of one letterform at
// once risks undermining the single stable template a 5-year-old is
// trying to form. That reasoning is about the grapheme being ONE taught
// unit, not literally about character count: a digraph ("ai"/"oa", one
// sound spelled with two letters -- the project's first ones land in
// chapter 7) is exactly as much a single letterform as "S" is, so it gets
// the same treatment. Multi-letter tiles that spell a whole blended word
// (e.g. "SAT"/"TAS"/"ATS", 3+ letters) and picture-word options are a
// different thing -- testing whole-word reading, not one letterform -- and
// keep their visible label as before. The letter stays in the DOM as
// screen-reader-only text either way, for accessibility.
//
// `--label-len` is the length of the longest UNBREAKABLE run in the label,
// which is what CSS needs to fit the word to the card and cannot work out on
// its own (same reason .beat-equation is handed `--eq-len`). Measured on the
// longest run rather than the whole string because that is the run that
// actually cannot wrap: "octopus" and "umbrella" render 239px and 261px wide
// inside a 231px card today and print as "octopusumbrella" across the gap
// between two cards. Shrinking every label instead would cost the 258 short
// labels to save the 48 long ones, and letting the word break would print
// "umbrel/la" -- a false syllable boundary in front of a child who is being
// taught to read by sound.
// `veilUntilPicked` implements the "no reading your way to the answer"
// requirement: a picture option's spelled-out word label is the same text a
// literate 5-year-old can string-compare without ever listening to the
// sound, which defeats the whole point of a listen-and-discriminate round.
// Veiling only ever applies to picture icons (never letterTile -- see the
// block comment above this function for why those stay sr-only or fully
// visible on their own track).
//
// `choose` beats carrying `promptLetter` ("reversed" rounds: the target
// letter is shown on screen, find the matching picture) USED to be exempted
// here on the reasoning that the comparison is letter-shape-to-picture, not
// sound-to-picture, so the option label was "never the shortcut." That
// reasoning missed that the shortcut still exists in a different shape: a
// child can string-compare the visible `promptLetter` glyph against each
// option's visible spelling and pick by first-letter match alone, never
// once recalling "this letter sounds like X and X's word is spelled sun" --
// the exact sound<->letter<->word link the round exists to build. Veiling
// now applies uniformly to every `choose` beat regardless of promptLetter.
//
// wordspot-style beats (icon: 'letterTile', label.length > 2, e.g. "SAT")
// are unaffected regardless of the flag because they are gated on icon, not
// on length -- that round IS a reading task by design. `match-shape` beats
// (renderMatchShapeBeat) also call this unveiled on purpose -- those are a
// visual b/d-style shape discrimination, not a sound round, and speak only
// the letter's own name, so there is no phonics sound to leak either way.
// CSS (`.option-label-veiled`) hides it with opacity, not visibility/
// display/aria-hidden, so screen readers still announce it immediately --
// only sighted children get the "tap first" gate.
function optionLabelHtml(opt, veilUntilPicked = false) {
  const isLetterformTile = opt.icon === 'letterTile' && opt.label.length <= 2
  const isPictureIcon = !!opt.icon && opt.icon !== 'letterTile'
  let cls = isLetterformTile ? 'option-label sr-only' : 'option-label'
  if (veilUntilPicked && isPictureIcon) cls += ' option-label-veiled'
  const len = Math.max(...opt.label.split(/\s+/).map((w) => w.length))
  return `<span class="${cls}" style="--label-len:${len}">${opt.label}</span>`
}

// ---- unrevealed character art ("shadow" state) ----
//
// QA runs on the dev server, where DEV_UNLOCK_ALL opens every stage, so the
// card and map screens were showing all 70 characters at once -- including
// the ones still being drawn. A portrait outside of play is therefore a
// SHADOW until the stage that character belongs to has actually been
// cleared, which also turns the roster into something the child uncovers by
// playing rather than a catalogue handed over up front.
//
// Keyed on isStageCleared, never on isStageUnlocked: "unlocked" means *you
// may play it* and is unconditionally true in dev, while "cleared" means
// *you have met this character* -- the only one of the two that says the art
// should be visible. So the reveal behaves identically in dev and in a
// production build.
//
// The filter goes on the <svg> itself rather than on a wrapper element: the
// svg gets its size from descendant rules on the card/node
// (`.chapter-card-art .carbot-art`, `.stage-node.boss .carbot-art`), which a
// wrapper would have to re-create, and a filter on the CARD would blacken
// its background along with the art. brightness(0) is the same hard cutout
// the art review uses to judge silhouettes; the opacity term lands it as a
// dark grey shadow on the cream card instead of a pitch-black hole, which
// reads as "not yet" rather than as something scary. Class name included so
// this can be promoted to style.css (owned elsewhere) unchanged.
const SHADOW_ART_STYLE = 'filter:brightness(0) opacity(0.42)'

function shadowArt(svgHtml) {
  if (svgHtml.includes('class="carbot-art"')) {
    return svgHtml.replace(
      'class="carbot-art"',
      `class="carbot-art art-shadow" style="${SHADOW_ART_STYLE}"`
    )
  }
  // Art that doesn't carry the shared wrapper class still has to be hidden --
  // failing open here would leak exactly what this is for. Only the style is
  // injected, so whatever classes it does have (and the sizing they carry)
  // survive.
  return svgHtml.replace('<svg', `<svg style="${SHADOW_ART_STYLE}"`)
}

function portraitHtml(svgHtml, revealed) {
  return revealed ? svgHtml : shadowArt(svgHtml)
}

// A locked card still shows the silhouette (that peek is the whole point --
// "who's next" is part of the draw), just with a small padlock badge over
// it so it reads as "not yet" rather than "cleared". Smaller and
// bottom-right (vs. clearMarkHtml's top-right ✓) so the two never compete
// for the same corner or get mistaken for each other. Percentage inset
// (not a fixed px offset off the box edge) so it sits against the character
// art itself -- the art box has real margin around the figure, and a fixed
// corner offset landed the badge out in that empty margin instead of next
// to the silhouette.
// No filled circle behind the glyph any more (사용자 지시: "검은 배경 없이
// 자물쇠 아이콘만"). The badge used to be a solid dark disc so it read
// clearly against any character art color -- dropping the disc means
// contrast now has to come from the glyph itself, so a drop-shadow (not a
// stroke/outline, which the emoji glyph doesn't support) stands in for it:
// dark art gets a light-ish halo from the shadow spread, light art gets a
// dark shadow, so 🔒 stays legible either way without a background shape.
function lockBadgeHtml() {
  return (
    `<span class="lock-badge" aria-hidden="true" style="position:absolute;` +
    `bottom:14%;right:18%;width:clamp(20px,2.4svh,30px);height:clamp(20px,2.4svh,30px);` +
    `display:flex;align-items:center;justify-content:center;` +
    `font-size:clamp(16px,2.1svh,24px);` +
    `filter:drop-shadow(0 1px 2px rgba(0,0,0,.7)) drop-shadow(0 0 3px rgba(255,255,255,.5))">🔒</span>`
  )
}

// Overlaid on the node, not appended below it: the world/chapter/map screens
// run at 1.2-1.9% vertical slack and a real device has already been seen to
// scroll where headless does not, so a mark in the flow is the thing that
// would finally push one over. Absolutely positioned, it costs 0 height.
// A check mark rather than a star (stars were removed from the map for
// carrying no meaning) and deliberately not a letterform -- an
// alphabet-shaped badge in a phonics app gets read as a letter.
function clearMarkHtml() {
  return (
    `<span class="clear-mark" aria-hidden="true" style="position:absolute;` +
    `top:-2px;right:-2px;width:clamp(34px,4.2svh,50px);height:clamp(34px,4.2svh,50px);` +
    `border-radius:50%;background:var(--success-dark);color:#fff;` +
    `font-size:clamp(22px,2.7svh,32px);font-weight:800;line-height:1;` +
    `display:flex;align-items:center;justify-content:center;` +
    `border:3px solid var(--surface)">✓</span>`
  )
}

// What the child SEES and what the voice SAYS are separate concerns in
// phonics content, and forcing them to be one string means giving up one
// of them: displaying "I" makes TTS read the letter *name* ("eye", or
// "ess"/"tee" for S/T) instead of the phoneme the round is teaching,
// while writing the phoneme spelling ("iii", "p-p-p") puts a
// letter-string that doesn't exist in front of a 5-year-old who is still
// forming letterform templates. So every display/speech site accepts
// either a bare string (display doubles as speech -- the original
// behaviour) or { text, say }.
function spokenPair(item) {
  if (typeof item === 'string') return { text: item, say: item }
  return { text: item.text, say: item.say || item.text }
}

// Speech for an option button. An option's `label` is display-only -- it is
// embossed into the letterTile icon and rendered as the (often sr-only)
// caption -- so only the spoken half is overridable, via `say`. Every
// renderer's option-tap speech goes through here so the letter-name bug
// can't come back one renderer at a time.
function optionSpeech(opt) {
  return spokenPair({ text: opt.label, say: opt.say }).say
}

// A drag-build target is a list of SLOTS, not of characters. Two forms:
//   'SAT'            -- every slot is one letter (chapters 1-6)
//   ['R','AI','N']   -- explicit slots, so a digraph occupies one slot
// The array form exists because a digraph is one grapheme: building "rain"
// from r+a+i+n would teach the child that A and I are separate sounds --
// the exact opposite of the lesson the beat is there to deliver. Splitting
// happens here and nowhere else, so slot count, tile matching and the
// wrong-answer hint lookup all agree on what one slot is.
function targetSlots(target) {
  return typeof target === 'string' ? target.split('') : target
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

// ---- tap wiring ----
//
// Every control in the app is bound through here instead of straight
// addEventListener('click'). Two reasons, both about a 5-year-old's finger:
//
//  * `click` only fires if the press and the release land on the same
//    element within the browser's movement slop. A child who puts a finger
//    down and rolls it produces pointerdown/pointermove/pointerup with NO
//    click at all -- the button does nothing, which reads as a broken app
//    and gets hit harder. Acting on pointerdown makes the movement
//    afterwards irrelevant.
//  * `click` arrives on RELEASE. `touch-action: manipulation` (already set
//    in style.css) is what removes the historical 300ms double-tap wait, but
//    it cannot make the event fire before the finger lifts. pointerdown can.
//
// The app has no scrolling and no drag gestures (the one drag-ish beat,
// drag-build, is tap-to-place), so there is no gesture that acting on press
// could steal.
//
// `click` stays bound too, for the activations that never produce a pointer
// event: both harnesses drive the app with `el.click()`, and so do keyboard
// and assistive-tech activations. So the pointerdown+click PAIR from one
// touch has to be collapsed to one activation, and the suppression is keyed
// on POINTERUP, not on how long ago the pointerdown was. A window measured
// from pointerdown looked fine and was wrong: a child who holds a finger on
// a button for a second and then lifts produces its click *after* any
// plausible window, so the handler ran twice -- on a toggle (option select)
// that reads as the button not working at all. A click always follows its
// pointerup within a few ms, however long the press was, so pairing on the
// release is exact.
//
// It deliberately does NOT suppress a genuine second tap: that arrives as
// its own pointerdown and must reach the handler, because the double-tap
// defence lives in each beat's `settled` guard and swallowing taps here
// would leave those guards un-exercised (and untestable).
const PAIRED_CLICK_MS = 700

function onTap(el, handler) {
  if (!el) return
  let suppressClickUntil = 0
  const endOfTouch = () => {
    suppressClickUntil = Date.now() + PAIRED_CLICK_MS
  }
  el.addEventListener('pointerdown', (e) => {
    // A right/middle mouse button is not a tap.
    if (e.pointerType === 'mouse' && e.button !== 0) return
    // Native `disabled` stops `click`, but WebKit still dispatches
    // `pointerdown` on a disabled button -- without this check, a locked
    // world/chapter/stage card was tappable through the very attribute meant
    // to lock it.
    if (el.disabled) return
    handler(e)
  })
  // pointercancel too: the browser can end a touch without a pointerup, and
  // some of those still deliver a click.
  el.addEventListener('pointerup', endOfTouch)
  el.addEventListener('pointercancel', endOfTouch)
  el.addEventListener('click', (e) => {
    if (Date.now() < suppressClickUntil) return
    handler(e)
  })
}

// `makeHandler(el)` is called once per element and returns that element's
// handler, so a renderer can close over the button it belongs to.
function onTapAll(nodes, makeHandler) {
  nodes.forEach((el) => onTap(el, makeHandler(el)))
}

// ---- answer energy and hero attack (layout owns the animation) ----
// Both effects carry viewport endpoints and CSS timing on a body-level node,
// so replacing the question does not cut off its energy transfer. Answers
// feed the hero (.energy-transfer); attacks leave the hero (.fx-bolt).
// Returned flight time synchronizes impact with dealHit. Sequence rounds
// also finish their charge before launching their automatic final attack.
const FX_BOLT_FALLBACK_MS = 700
// A malformed/huge --fx-bolt-ms must not leave the element on the page
// forever; a sane ceiling is cheaper than trusting the value.
const FX_BOLT_MAX_MS = 4000
// An absent/malformed --fx-bolt-flight-ms falls back to 0, not to a guess:
// no readable variable means the animation this is synchronising to is not
// there either, and a hold with no bolt to explain it is pure dead time in
// front of a 5-year-old. 0 degrades to exactly the shipped pre-sync
// behaviour. The harness (`boltsync`) asserts the variable IS declared, so
// losing the contract fails loudly instead of silently reverting to it.
const FX_FLIGHT_FALLBACK_MS = 0
// Separate, much tighter ceiling than FX_BOLT_MAX_MS: that one only has to
// stop a node leaking, this one gates a *paint*. Every damage site is
// followed by waitForTransition(500), so a flight time past that would land
// the health bar after the screen had already moved on -- the bar would
// appear to drop on the next beat. 450 keeps the paint inside the round no
// matter what the stylesheet says (the real 392ms passes untouched).
const FX_FLIGHT_MAX_MS = 450

// Returns the bolt's flight time in ms (0 when no bolt was actually drawn),
// so callers can hand it to dealHit().
function setCombatState(state) {
  const scene = document.querySelector('.battle-scene')
  if (scene) scene.dataset.combatState = state
}

// Correct answers feed the hero; only an attack travels toward the villain.
function chargeHero(fromEl) {
  setCombatState('charging')
  return fireBolt(fromEl, document.getElementById('hero-sprite'), 'energy-transfer')
}

function fireHeroAttack() {
  setCombatState('attacking')
  return fireBolt(document.getElementById('hero-sprite'))
}

function fireBolt(fromEl, villain = document.getElementById('villain-sprite'), effectClass = 'fx-bolt') {
  if (!fromEl || !fromEl.isConnected || !villain) return 0
  const a = fromEl.getBoundingClientRect()
  const b = villain.getBoundingClientRect()
  // A zero box means the element is not laid out (display:none, detached
  // subtree) -- firing from 0,0 would draw a bolt from the screen corner.
  if (!a.width || !a.height || !b.width || !b.height) return 0
  const bolt = document.createElement('div')
  bolt.className = effectClass
  // pointer-events is part of the contract, not styling: until layout's rule
  // lands this is an unstyled div, and once it does land it is an overlay
  // that must never sit between the child's finger and a button.
  bolt.style.pointerEvents = 'none'
  bolt.style.setProperty('--fx-x1', Math.round(a.left + a.width / 2) + 'px')
  bolt.style.setProperty('--fx-y1', Math.round(a.top + a.height / 2) + 'px')
  bolt.style.setProperty('--fx-x2', Math.round(b.left + b.width / 2) + 'px')
  bolt.style.setProperty('--fx-y2', Math.round(b.top + b.height / 2) + 'px')
  document.body.appendChild(bolt)
  // Read AFTER insertion -- a detached element resolves no custom property.
  // Fallback matters: this is a parallel change, so the CSS may not exist
  // yet, and without a fallback every correct answer would leak one node.
  const declared = parseFloat(
    getComputedStyle(bolt).getPropertyValue('--fx-bolt-ms')
  )
  const ms =
    Number.isFinite(declared) && declared > 0
      ? Math.min(declared, FX_BOLT_MAX_MS)
      : FX_BOLT_FALLBACK_MS
  // Read off the element, not off :root, so a `.fx-bolt`-scoped override (or
  // a reduced-motion variant) is honoured rather than bypassed. Clamped by
  // `ms` too: the arrival can never be later than the bolt's own lifetime,
  // whatever the two values say relative to each other.
  const flightDeclared = parseFloat(
    getComputedStyle(bolt).getPropertyValue('--fx-bolt-flight-ms')
  )
  const flightMs =
    Number.isFinite(flightDeclared) && flightDeclared > 0
      ? Math.min(flightDeclared, ms, FX_FLIGHT_MAX_MS)
      : FX_FLIGHT_FALLBACK_MS
  setTimeout(() => bolt.remove(), ms)
  return flightMs
}

// ---- transition countdown (visual cue for waitForTransition's hold) ----
//
// waitForTransition() was a silent Promise.all(audio, timer) -- correct as
// a gate, but from the child's seat every correct/wrong answer produced up
// to 600ms where nothing on screen changed at all ("그냥 마냥 기다리는" 느낌,
// QA). This paints a small fixed-position bar that fills over minDelayMs.
// It is purely cosmetic: nothing awaits it, and the real gate below is
// untouched, so this can never make a transition slower or drift out of
// sync with it -- worst case the bar finishes filling before the audio
// queue drains and just sits full for the remainder, which reads as
// "wrapping up" rather than "stuck", the opposite of the complaint.
//
// The keyframe/transition CSS is injected once here rather than added to
// style.css -- that file is owned by the layout agent in this session, and
// this is this module managing its own scratch element the same way
// fireBolt() manages `.fx-bolt` via inline styles/custom properties instead
// of a stylesheet rule.
let transitionStyleInjected = false
function ensureTransitionStyle() {
  if (transitionStyleInjected) return
  transitionStyleInjected = true
  const style = document.createElement('style')
  style.textContent = `
    .transition-countdown {
      position: fixed; left: 50%; bottom: 14px; transform: translateX(-50%);
      width: min(120px, 30vw); height: 6px; border-radius: 3px;
      background: rgba(0,0,0,.15); overflow: hidden; pointer-events: none;
      z-index: 9999;
    }
    .transition-countdown > span {
      display: block; height: 100%; width: 0%; border-radius: 3px;
      background: var(--ink, #2c2c2c); opacity: .55;
    }
  `
  document.head.appendChild(style)
}

// Fills toward 85% over a slow ease-out -- NOT toward 100% over a guessed
// duration. QA caught the first version doing that: it filled in a fixed
// 500-600ms while the actual wait (whenAudioIdle(), dominated by however
// long the TTS utterance takes to speak) regularly ran 2+ seconds longer,
// so the bar sat full while the screen visibly kept not-transitioning --
// the exact "그냥 마냥 기다리는" feeling this bar exists to remove, just
// moved to after the bar instead of during it.
//
// There is no reliable way to know the wait's real length in advance (it
// depends on the text being spoken, the device's TTS rate, whether the
// queue was already primed) so this doesn't try to. Instead: ease toward
// 85% over a long, decelerating curve that reads as "still working" for
// as long as the promise takes, then the `.finally()` below snaps it the
// rest of the way to 100% and removes it shortly after -- the fill speed
// can never outrun the real wait because nothing past 85% happens until
// the wait is actually over.
function showTransitionCountdown(promise) {
  ensureTransitionStyle()
  const bar = document.createElement('div')
  bar.className = 'transition-countdown'
  bar.innerHTML = '<span></span>'
  document.body.appendChild(bar)
  const fill = bar.firstElementChild
  // Two rAFs, not one: the element has to actually paint at width:0 first,
  // or the browser coalesces the 0->85 change into the same frame and the
  // bar just appears 85% full instead of animating -- one rAF still lands
  // inside the same paint as the initial style in some engines, two does
  // not.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      fill.style.transition = 'width 4000ms cubic-bezier(0.1,0.6,0.4,1)'
      fill.style.width = '85%'
    })
  })
  let removed = false
  const remove = () => {
    if (removed) return
    removed = true
    bar.remove()
  }
  promise.finally(() => {
    fill.style.transition = 'width 150ms ease-out'
    fill.style.width = '100%'
    setTimeout(remove, 220)
  })
  return promise
}

// Waits for both a minimum visual-feedback delay AND the audio queue to
// fully drain, whichever takes longer -- so a transition never cuts off
// in-flight speech, but also never feels laggier than it needs to when
// audio finishes quickly (e.g. speechSynthesis unavailable).
function waitForTransition(minDelayMs) {
  return showTransitionCountdown(Promise.all([whenAudioIdle(), sleep(minDelayMs)]))
}

// ---------- WORLD SELECT SCREEN ----------
//
// Top-level screen: the 33-chapter curriculum is grouped into 5 "worlds"
// of up to 7 chapters each (matching the style-cycle rotation), so the
// player picks a world here, then a chapter within it (renderChapterSelect
// below), then a stage within that chapter (renderMap). This keeps every
// single grid the player sees down to ~5-7 cards, so none of them need to
// scroll even once all 33 chapters exist.

function worldSelectScreen() {
  beginScreen()
  // Entering a top-level screen -- drop any audio still queued from
  // wherever the player just came from (see clearAudioQueue() in
  // audio.js: it lets anything already mid-speech finish naturally, it
  // just stops queued-but-unstarted items from playing late here).
  clearAudioQueue()
  const cards = worlds
    .map((world) => {
      const unlocked = isWorldUnlocked(worlds, world.id)
      const cleared = unlocked && isWorldCleared(world)
      const firstChapter = world.slots[0].chapter
      let cls = 'chapter-card'
      if (cleared) cls += ' cleared'
      if (!unlocked) cls += ' locked'
      // The card's portrait is one specific character -- the world's first
      // chapter's boss stage -- so it is revealed by THAT stage being
      // cleared, not by the whole world being finished. It shows the HERO,
      // not the villain: `hero` on a chapterBoss stage IS the chapter's
      // combined form (e.g. robots.js's -deluxe styles, or a superhero's
      // thickest silhouette doing double duty as its own combine form --
      // see art.js/CLAUDE.md), so a world's entry card is "who you become",
      // not "who you're about to fight" (user request).
      const faceStage = firstChapter
        ? firstChapter.stages[firstChapter.stages.length - 1]
        : null
      const inner = faceStage
        ? portraitHtml(
            heroArt(faceStage.hero),
            unlocked && isStageCleared(faceStage.id)
          ) + (unlocked ? '' : lockBadgeHtml())
        : '<i class="lock">🔒</i>'
      const [start, end] = world.chapterRange
      return `
        <button class="${cls}" data-world="${world.id}" ${
        unlocked ? '' : 'disabled aria-label="Locked world"'
      }>
          <div class="chapter-card-art" style="position:relative">${inner}</div>
          <div class="chapter-card-order">${world.title}</div>
          <div class="chapter-card-title range">Chapters ${start}-${end}</div>
          ${cleared ? '<div class="chapter-card-badge">Clear! ⭐</div>' : ''}
        </button>`
    })
    .join('')

  // The app title is 5 characters longer than the old one and .map-header
  // does not nowrap, so at the header's own clamped size it wrapped mid-phrase
  // in portrait (measured: 874px of glyphs in a 760px box; the old title was
  // 709px and fit). The width bound belongs to the title string, not to the
  // header rule -- so the shrink rides on the string here rather than
  // re-stating layout's clamp: `1em` inside this span IS whatever .map-header
  // computed to, and the vw term only wins when the line would not fit.
  // Landscape has 1032px to work with and keeps the full 48px.
  app.innerHTML = `
    <div class="screen chapter-select-screen">
      <div class="map-header"><span style="font-size:min(1em,5.5vw)">Yum JiHoon's Phonics · Pick a World</span></div>
      <div class="chapter-grid">${cards}</div>
    </div>
  `

  onTapAll(app.querySelectorAll('.chapter-card[data-world]'), (btn) => () => {
    unlockAudio()
    renderChapterSelect(btn.dataset.world)
  })
}

// ---------- CHAPTER SELECT SCREEN (scoped to one world) ----------

function chapterSelectScreen(worldId) {
  beginScreen()
  clearAudioQueue()
  const world = getWorldById(worldId)
  const cards = world.slots
    .map(({ order, chapter }) => {
      if (!chapter) {
        // Planned chapter slot with no authored content yet -- a
        // permanently-locked placeholder, not a broken link.
        return `
          <button class="chapter-card locked" disabled aria-label="Chapter coming soon">
            <div class="chapter-card-art"><i class="lock">🔒</i></div>
            <div class="chapter-card-order">Chapter ${order}</div>
            <div class="chapter-card-title">???</div>
          </button>`
      }
      const unlocked = isChapterUnlocked(chapters, chapter.id)
      const cleared = unlocked && isChapterCleared(chapter)
      let cls = 'chapter-card'
      if (cleared) cls += ' cleared'
      if (!unlocked) cls += ' locked'
      const faceStage = chapter.stages[chapter.stages.length - 1]
      const inner =
        portraitHtml(
          villainArt(faceStage.villain),
          unlocked && isStageCleared(faceStage.id)
        ) + (unlocked ? '' : lockBadgeHtml())
      return `
        <button class="${cls}" data-chapter="${chapter.id}" ${
        unlocked ? '' : 'disabled aria-label="Locked chapter"'
      }>
          <div class="chapter-card-art" style="position:relative">${inner}</div>
          <div class="chapter-card-order">Chapter ${chapter.order}</div>
          <div class="chapter-card-title">${unlocked ? chapter.title : '???'}</div>
          ${cleared ? '<div class="chapter-card-badge">Clear! ⭐</div>' : ''}
        </button>`
    })
    .join('')

  app.innerHTML = `
    <div class="screen chapter-select-screen">
      <button class="back-btn" id="back-to-worlds" aria-label="Back to worlds">◀ Worlds</button>
      <div class="map-header">${world.title} · Pick a Chapter</div>
      <div class="chapter-grid">${cards}</div>
    </div>
  `

  onTap(document.getElementById('back-to-worlds'), renderWorldSelect)

  onTapAll(app.querySelectorAll('.chapter-card[data-chapter]'), (btn) => () => {
    unlockAudio()
    renderMap(btn.dataset.chapter)
  })
}

// ---------- MAP SCREEN ----------

// Stage titles are authored content ("Power of I", "Power of AI", "A Strange
// Sound", "Boss: SAT Combine!"). Only the "Power of X" form names exactly one
// phonics target, so only that form gets its target tinted -- in every other
// shape guessing which word is the target would mis-highlight. A digraph
// ("AI", "OA") is one sound, so the whole trailing run is highlighted.
const POWER_OF_TITLE = /^(Power of )([A-Za-z]+)$/

function stageTitleHtml(title) {
  const m = POWER_OF_TITLE.exec(title)
  if (!m) return title
  return `${m[1]}<span class="stage-label-target">${m[2]}</span>`
}

function mapScreen(chapterId) {
  beginScreen()
  clearAudioQueue()
  const chapter = getChapterById(chapterId)
  const chapterStages = chapter.stages
  const nodes = chapterStages
    .map((stage) => {
      const cleared = isStageCleared(stage.id)
      const unlocked = isStageUnlocked(chapterStages, stage.id)
      let cls = 'stage-node'
      if (stage.chapterBoss) cls += ' boss'
      if (cleared) cls += ' cleared'
      if (!unlocked) cls += ' locked'
      // A locked boss node still shows the villain silhouette (that peek
      // is the point) with a small lock badge over it; a locked non-boss
      // node has no art either way (just its order number when unlocked),
      // so it keeps the plain lock glyph.
      const inner = stage.chapterBoss
        ? portraitHtml(villainArt(stage.villain), cleared) +
          (unlocked ? '' : lockBadgeHtml())
        : unlocked
          ? String(stage.order)
          : '<i class="lock">🔒</i>'
      // position:relative only where a mark actually goes, so a plain
      // number/lock-glyph node's markup is unchanged.
      const mark = cleared ? clearMarkHtml() : ''
      const needsRelative = cleared || (stage.chapterBoss && !unlocked)
      return `
        <div class="stage-node-wrap">
          <button class="${cls}" ${
        needsRelative ? 'style="position:relative"' : ''
      } data-stage="${stage.id}" ${
        unlocked ? '' : 'disabled aria-label="Locked stage"'
      }>${inner}${mark}</button>
          <div class="stage-label">${
            unlocked ? stageTitleHtml(stage.title) : ''
          }</div>
        </div>`
    })
    .join('')

  app.innerHTML = `
    <div class="screen map-screen">
      <button class="back-btn" id="back-to-chapters" aria-label="Back to chapters">◀ Chapters</button>
      <div class="map-header">Chapter ${chapter.order} · ${chapter.title}</div>
      <div class="map-path">${nodes}</div>
    </div>
  `

  onTap(document.getElementById('back-to-chapters'), () => {
    const world = getWorldForChapterOrder(chapter.order)
    renderChapterSelect(world.id)
  })

  onTapAll(app.querySelectorAll('.stage-node[data-stage]'), (btn) => () => {
    unlockAudio()
    renderStage(btn.dataset.stage)
  })
}

// ---------- GENERATED CUMULATIVE REVIEW (reviewTargets consumer) ----------
//
// stage.reviewTargets, when a stage declares it, is validated by
// validateChapters() to equal EXACTLY the full set of graphemes the
// curriculum has taught up to and including that stage (chapters/index.js's
// "reviewTargets 계약" -- see the comment there). It is the review POOL, not
// a list of quiz steps: nothing in this app has ever consumed it to build a
// round. Chapters 1-8 already hand-author their own choose-sequence
// quickfire for every stage that declares it, occasionally mixing in one
// cross-chapter step by hand (commit 997aa43), so this generator is wired
// to STAY OFF for them and only supply the round chapter 9+ doesn't have to
// hand-author -- a future phonics author gets this for free as long as
// reviewTargets itself is right, which validateChapters already
// double-checks independently of anything below.
//
// Two gates, both required, so it can never touch what already shipped:
//   1. chapter.order > HAND_AUTHORED_MAX_CHAPTER_ORDER -- chapters 1-8 keep
//      exactly the beats they ship today, whatever this code would build.
//   2. the stage has no hand-authored `choose-sequence` beat already -- a
//      future chapter can still opt out per-stage by writing its own, and
//      this can never double up one stage's review round.
//
// Deliberately NOT wired into src/data/chapters/**: it reads reviewTargets
// and SOUND_TABLE (via letterformSounds()) and splices the generated beat
// in at render time, so chapter data never has to know this exists and
// authoring a new chapter costs nothing extra beyond reviewTargets itself.
const HAND_AUTHORED_MAX_CHAPTER_ORDER = 8

// Mirrors chapters/index.js's (unexported, and not this file's to export)
// SPEECH_COLLISION_PAIRS. The fact it encodes -- these two SAY strings
// render identically on-device despite different notation -- is true
// regardless of who's asking, so a generated step needs the same guard a
// hand-authored one gets from validateChapters(). Keep in sync by hand if a
// new pair is ever measured there.
const GENERATED_REVIEW_COLLISION_PAIRS = [
  ['buh', 'duh'],
  ['a', 'eh'],
]

// Best-effort articulatory/orthographic confusion groups, used only to pick
// which OLDER grapheme a generated review step spends its one cross-chapter
// slot on, and which of THIS chapter's new graphemes make the most useful
// wrong answers for it. Grounded in the pairs 997aa43 hand-picked instead of
// guessed fresh: B/P (bilabial voicing contrast), G/C/K (velar place -- C
// and K already can't coexist as two options, see canCoexistInReview), L/R
// (liquids), D/T (alveolar voicing contrast, the same contrast chapter 4's
// c4s4-r1-warmup hand-picks T as D's one safe foil for), and the
// letter-NAME vowel family Jolly leans on for A/AI and O/OA (997aa43's
// chapter-7 steps drew on exactly that family). Not exhaustive -- add a
// line the same way chapters/index.js's own tables grow.
const CONFUSION_GROUPS = [
  ['B', 'P'],
  ['G', 'C', 'K'],
  ['L', 'R'],
  ['D', 'T'],
  ['A', 'AI', 'O', 'OA', 'IE'],
]

// Deterministic PRNG (mulberry32) seeded from a string, so a generated
// review beat's option order is stable across re-renders of the very same
// stage (retry after the recovery panel, a probe-harness re-run) instead of
// reshuffling every time runBeat() re-enters it.
function seededRandom(seedStr) {
  let h = 1779033703 ^ seedStr.length
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 3432918353)
    h = (h << 13) | (h >>> 19)
  }
  return function () {
    h = Math.imul(h ^ (h >>> 16), 2246822507)
    h = Math.imul(h ^ (h >>> 13), 3266489909)
    h ^= h >>> 16
    return (h >>> 0) / 4294967296
  }
}

function shuffleDeterministic(seedStr, arr) {
  const rand = seededRandom(seedStr)
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// A letterform is only safe to auto-quiz if SOUND_TABLE gives it exactly one
// SAY. Two rows sharing a letterform (OO's long/short oo, group 5) mean the
// generator has no way to know which sound a bare reviewTargets entry means
// -- that context only a hand author has -- so those sit out rather than
// guess.
function primarySay(letterform) {
  const sounds = letterformSounds().get(letterform)
  return sounds && sounds.length === 1 ? sounds[0] : null
}

// Whether two letterforms can share one option grid: never the same
// letterform twice, never two letterforms whose SAY is identical (C/K's
// "one sound, two letterforms" -- would make a two-correct-answer
// question), never a known collision pair (a/eh's "two sounds, one
// rendered waveform" -- would make the wrong answer sound identical to the
// right one on a real device).
function canCoexistInReview(a, b) {
  if (a === b) return false
  const sayA = primarySay(a)
  const sayB = primarySay(b)
  if (!sayA || !sayB) return false
  if (sayA === sayB) return false
  return !GENERATED_REVIEW_COLLISION_PAIRS.some(
    ([x, y]) => (x === sayA && y === sayB) || (x === sayB && y === sayA)
  )
}

// The graphemes THIS chapter itself introduces, in teaching order, deduped.
// Derived from the chapter's own `teach` beats rather than diffing
// reviewTargets against the previous stage's declaration, so it still works
// on a chapter's very first reviewTargets-bearing stage.
function chapterOwnLetterforms(chapter) {
  const seen = []
  for (const stage of chapter.stages) {
    for (const beat of stage.beats) {
      if (
        beat.kind === 'teach' &&
        typeof beat.letter === 'string' &&
        !seen.includes(beat.letter)
      ) {
        seen.push(beat.letter)
      }
    }
  }
  return seen
}

// One choose-sequence step: `correct` plus its (already vetted) distractors,
// shuffled. Null distractors means null step -- a step needs at least 2
// options to be answerable, and a shorter generated quickfire beats a
// broken one.
function buildReviewStep(stageId, tag, correctLf, distractorLfs) {
  if (!distractorLfs.length) return null
  const pool = shuffleDeterministic(`${stageId}:${tag}`, [
    correctLf,
    ...distractorLfs,
  ])
  return {
    promptAudio: primarySay(correctLf),
    options: pool.map((lf, i) => ({
      id: `${stageId}-rq-${tag}-${i}-${lf}`,
      icon: 'letterTile',
      label: lf,
      say: primarySay(lf),
      correct: lf === correctLf,
    })),
  }
}

function pickDistractors(candidates, correctLf, max = 2) {
  const picked = []
  for (const lf of candidates) {
    if (picked.length >= max) break
    if (lf === correctLf) continue
    if (
      canCoexistInReview(lf, correctLf) &&
      picked.every((d) => canCoexistInReview(d, lf))
    ) {
      picked.push(lf)
    }
  }
  return picked
}

// Picks the one older grapheme the stage's cross-chapter step reviews, and
// the newly-taught graphemes that make the most useful wrong answers for it
// -- per 997aa43, the risk to old knowledge is a NEW similar sound crowding
// it out, not sheer time elapsed, so the wrong answers are this chapter's
// own new letters, preferring ones sharing a CONFUSION_GROUPS family with
// the grapheme under review.
function pickInterferenceStep(stageId, oldPool, newPool) {
  let oldHit = null
  let distractors = []
  for (const group of CONFUSION_GROUPS) {
    const hit = oldPool.find((lf) => group.includes(lf))
    if (!hit) continue
    const found = pickDistractors(
      newPool.filter((lf) => group.includes(lf)),
      hit
    )
    if (found.length) {
      oldHit = hit
      distractors = found
      break
    }
  }
  if (!oldHit) {
    // No modeled confusion pair matches anything taught so far -- fall back
    // to the oldest still-taught grapheme (reviewTargets preserves
    // curriculum order) against plain new-chapter distractors, so an
    // unmodeled pair still gets reviewed rather than silently never
    // reviewed at all.
    oldHit = oldPool[0]
    if (!oldHit) return null
    distractors = pickDistractors(newPool, oldHit)
  }
  if (!distractors.length) return null
  return buildReviewStep(stageId, 'x', oldHit, distractors)
}

// Builds the whole generated beat, or null if there isn't enough usable
// material (e.g. every candidate got filtered out by canCoexistInReview).
// Exported for the fullstack probe harness (_probe-fs.html) to exercise
// directly with synthetic chapter/stage objects, since chapter 9+ doesn't
// exist yet to exercise it through real play.
export function buildGeneratedReviewBeat(stage, chapter) {
  const taught = stage.reviewTargets
  if (!Array.isArray(taught) || !taught.length) return null
  const chapterNew = chapterOwnLetterforms(chapter)
  const older = taught.filter((lf) => !chapterNew.includes(lf))
  const newPool = chapterNew.filter((lf) => primarySay(lf))
  const oldPool = older.filter((lf) => primarySay(lf))
  if (!newPool.length) return null

  const steps = []
  newPool.forEach((correct, i) => {
    const distractors = pickDistractors([...newPool, ...oldPool], correct)
    const step = buildReviewStep(stage.id, `n${i}`, correct, distractors)
    if (step) steps.push(step)
  })

  const interference = oldPool.length
    ? pickInterferenceStep(stage.id, oldPool, newPool)
    : null
  if (interference) steps.push(interference)

  if (!steps.length) return null
  return {
    kind: 'choose-sequence',
    scored: true,
    hits: 1,
    // Shortened from '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지
    // 배운 글자도 나와요.' -- the dropped second sentence (old letters mixed
    // in) is only a heads-up, not needed to solve the beat, and the original
    // ran 3 lines at this app's instruction font clamp on real devices
    // (measured, and this template is reused by every chapter 9+ stage that
    // has reviewTargets, so it was the single highest-leverage instruction
    // to shorten). fitBeatInstruction() (runBeat) is a font-shrink safety
    // net for anything still long, hand-authored or generated.
    instructionKo: '소리에 맞는 글자를 고르고 ✓를 누르세요!',
    steps,
  }
}

// Clones the stage with the generated beat spliced in right before its last
// beat -- the same position chapters 1-8 hand-place their own choose-
// sequence in, immediately before the stage's finale/closing beat. Returns
// the ORIGINAL stage object, untouched, whenever either gate says no or
// generation produced nothing usable, so stageHealthMax() and the
// checkpoint's beatIndex bound always match whatever beats array actually
// plays. Never mutates the shared `stages` array: `{...stage}` clones, so
// the chapters module's own data stays exactly what validateChapters()
// checked. `chapter` defaults to a real lookup but accepts an override so
// the probe harness can exercise both gates with a synthetic chapter,
// without needing a real chapter 9 to exist.
export function withGeneratedReview(stage, chapter = getChapterForStage(stage.id)) {
  if (!stage || !stage.reviewTargets) return stage
  if (!chapter || chapter.order <= HAND_AUTHORED_MAX_CHAPTER_ORDER) return stage
  if (stage.beats.some((b) => b.kind === 'choose-sequence')) return stage
  const generated = buildGeneratedReviewBeat(stage, chapter)
  if (!generated) return stage
  const beats = stage.beats.slice()
  beats.splice(Math.max(0, beats.length - 1), 0, generated)
  return { ...stage, beats }
}

// ---------- STAGE SCREEN ----------

function stageScreen(stageId) {
  clearAudioQueue()
  const stage = withGeneratedReview(getStageById(stageId))
  const runtime = {
    stage,
    nav: beginScreen(),
    beatIndex: 0,
    healthMax: stageHealthMax(stage),
    hitsDealt: 0,
    // Which beat indices have already landed their hit -- see dealHit()'s
    // own comment. Not restored from a checkpoint (only the aggregate
    // hitsDealt is): a checkpoint only exists after an accident (sleep/
    // reload/crash), a rare precondition for the rarer case of then also
    // using ↺ Back to revisit a beat from before the crash, so that residual
    // gap is accepted rather than plumbing per-beat state through storage.
    dealtBeatIndices: new Set(),
  }
  // Silent resume, no dialog: a checkpoint only exists if the last visit
  // ended in an accident (sleep, reload, crash), never if the child left on
  // purpose -- so there is nothing for them to decide. A checkpoint pointing
  // past the end of the stage means the content changed underneath it; drop
  // it and start clean rather than resuming into a beat that isn't there.
  const cp = getCheckpoint(stageId)
  if (cp) {
    if (cp.beatIndex < stage.beats.length) {
      runtime.beatIndex = cp.beatIndex
      runtime.hitsDealt = Math.min(runtime.healthMax, cp.hitsDealt)
    } else {
      clearCheckpoint()
    }
  }
  renderHealthShell(runtime)
  runBeat(runtime)
}

function renderHealthShell(runtime) {
  const { stage } = runtime
  app.innerHTML = `
    <div class="screen stage-screen">
      <div class="stage-topbar" style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
        <button class="back-btn" id="exit-stage" aria-label="Exit stage">◀ Exit</button>
        <button class="back-btn review-back-btn" id="review-back" aria-label="Back to previous step" style="display:none">↺ Back</button>
      </div>
      <div class="battle-scene" data-combat-state="studying">
        <div class="villain-slot">
          <div class="nameplate" id="villain-nameplate" role="button" tabindex="0" aria-label="Hear ${stage.villain.name}'s name">
            <div class="nameplate-name">${stage.villain.name}</div>
            <div class="health-track" role="img" aria-label="Villain health">
              <div class="health-fill" id="health-fill" style="width:100%"></div>
            </div>
          </div>
          <div class="villain-sprite" id="villain-sprite">${villainArt(
            stage.villain
          )}</div>
        </div>
        <div class="vs-mark">⚡<span class="battle-energy" aria-hidden="true"><span class="battle-energy-fill"></span></span></div>
        <div class="hero-slot">
          <div class="hero-sprite" id="hero-sprite">${heroArt(
            stage.hero
          )}</div>
        </div>
      </div>
      <div id="beat-area" class="beat-area"></div>
    </div>
  `

  onTap(document.getElementById('exit-stage'), () => {
    // Leaving on purpose means "start this one over next time".
    clearCheckpoint()
    const chapter = getChapterForStage(stage.id)
    renderMap(chapter.id)
  })

  // The nameplate reads as a button (QA: a child tapped "Noisebot" expecting
  // to hear it) but never spoke anything -- it was purely decorative. Wired
  // to the same tap-speech path as every option/tile so tapping a villain's
  // name is never a dead end.
  onTap(document.getElementById('villain-nameplate'), () =>
    speakTap(stage.villain.name)
  )

  onTap(document.getElementById('review-back'), () => reverseBeat(runtime))
}

// Shows/hides the review-back button for the beat currently on screen. Kept
// separate from renderHealthShell because that only runs once per stage
// entry, while beatIndex changes on every advance/reverse -- this has to run
// every time runBeat() does, or the button would stay stuck on whatever
// visibility it had when the shell was first painted.
function updateReviewBackButton(runtime) {
  const btn = document.getElementById('review-back')
  if (!btn) return
  // beatIndex 0 has nothing before it in this stage, so there is nothing to
  // review -- hidden rather than disabled, per this project's rule against
  // controls a child can tap that do nothing.
  btn.style.display = runtime.beatIndex > 0 ? '' : 'none'
}

// The reverse of advanceBeat(): re-shows the previous beat for review. This
// is deliberately NOT "undo my last answer" -- hitsDealt and the health bar
// are untouched, so a child cannot farm review taps into free damage or lose
// progress by going back. It only moves which beat is drawn on screen.
function reverseBeat(runtime) {
  if (runtime.beatIndex <= 0) return
  // Whatever the current beat was saying should not keep talking over the
  // beat the child just asked to revisit (same pattern as every other
  // intentional navigation in this file -- see clearAudioQueue() calls
  // above). The in-flight utterance still finishes naturally; only the
  // queued-up rest is dropped.
  clearAudioQueue()
  runtime.beatIndex -= 1
  runBeat(runtime)
}

function updateHealthBar(runtime) {
  const fill = document.getElementById('health-fill')
  if (!fill) return
  const remaining = Math.max(0, runtime.healthMax - runtime.hitsDealt)
  const pct = Math.round((remaining / runtime.healthMax) * 100)
  fill.style.width = pct + '%'
}

// ---- the attack is two moments, not one ----
//
// These were a single pulseBattle() call, which was correct only while the
// hit was instantaneous. With a bolt that takes --fx-bolt-flight-ms to cross
// the screen, throwing and landing are 392ms apart and each half has to sit
// on its own side of that gap: the hero lunging BEFORE (it is what launches
// the bolt -- its 0.35s animation now runs alongside the flight), the
// villain's shake and 💥 AFTER (they are what being hit looks like). Fusing
// them meant one of the two was always inverted.

function heroLunge() {
  const hero = document.getElementById('hero-sprite')
  if (!hero) return
  hero.classList.remove('hero-lunge')
  void hero.offsetWidth
  hero.classList.add('hero-lunge')
}

function villainImpact() {
  const villain = document.getElementById('villain-sprite')
  if (!villain) return
  villain.classList.remove('hit-shake')
  void villain.offsetWidth
  villain.classList.add('hit-shake')
  const spark = document.createElement('div')
  spark.className = 'hit-spark'
  spark.textContent = '💥'
  villain.appendChild(spark)
  setTimeout(() => spark.remove(), 500)
}

function beatArea() {
  return document.getElementById('beat-area')
}

function runBeat(runtime) {
  if (!ownsScreen(runtime)) return
  const { stage, beatIndex } = runtime
  try {
    if (beatIndex >= stage.beats.length) {
      renderReward(runtime)
      return
    }
    saveCheckpoint(stage.id, beatIndex, runtime.hitsDealt)
    const beat = stage.beats[beatIndex]
    setCombatState('studying')
    updateHealthBar(runtime)
    updateReviewBackButton(runtime)

    if (beat.kind === 'teach' || beat.kind === 'break') {
      renderNonScoredBeat(runtime, beat)
    } else if (beat.kind === 'choose') {
      renderChooseBeat(runtime, beat)
    } else if (beat.kind === 'match-shape') {
      renderMatchShapeBeat(runtime, beat)
    } else if (beat.kind === 'choose-sequence') {
      renderChooseSequenceBeat(runtime, beat)
    } else if (beat.kind === 'multiselect') {
      renderMultiselectBeat(runtime, beat)
    } else if (beat.kind === 'drag-build') {
      renderBuildBeat(runtime, beat)
    } else if (beat.kind === 'listen-repeat' || beat.kind === 'finale') {
      renderListenRepeatBeat(runtime, beat)
    } else {
      // An unknown kind would otherwise leave the *previous* beat's spent
      // controls on screen, which reads to a child as "the app froze".
      throw new Error(`unknown beat kind: ${beat.kind}`)
    }
    fitBeatInstruction()
  } catch (e) {
    renderBeatFailure(runtime, e)
  }
}

// A long instructionKo (chapter 9+'s auto-generated review beat especially,
// but any hand-authored one that runs long too) balloons past 2 lines at
// the .beat-instruction clamp and squeezes the beat's actual content
// (options grid, confirm button) down toward the bottom of the screen --
// real-device report, confirmed by direct measurement (a 105-character
// instruction ran 3 lines and left visibly less room than a 23-character
// one at the same option count). Single call site (runBeat, every beat
// kind routes through it) instead of one per render*Beat function, so a
// future beat kind can't forget to wire this in.
//
// Same recipe as fitRecapLine(): shrink only as far as THIS string's own
// overflow demands -- a short instruction that already fits in 2 lines is
// untouched, never capped down to a blanket smaller size. `line-height:
// 1.14` in style.css is a unitless multiplier (proportional to font-size),
// so "2 lines at the current font-size" stays a self-consistent target as
// the loop shrinks it -- it isn't chasing a fixed pixel goal that would
// over-shrink once the font is already smaller.
function fitBeatInstruction() {
  const el = document.querySelector('.beat-instruction')
  if (!el) return
  // Slightly lower than fitRecapLine's 28px: this text is read aloud by an
  // adult or sounded out by the child, not glanced at like the reward
  // recap, so it has to stay legible at the size an actual overlong string
  // gets shrunk to -- 26px is still comfortably above this app's smallest
  // deliberately-sized text.
  const FLOOR_PX = 26
  const LINE_HEIGHT_RATIO = 1.14
  let fontSize = parseFloat(getComputedStyle(el).fontSize)
  for (let i = 0; i < 20 && fontSize > FLOOR_PX; i++) {
    const twoLineTarget = fontSize * LINE_HEIGHT_RATIO * 2
    if (el.scrollHeight <= twoLineTarget + 1) break
    fontSize -= 2
    el.style.fontSize = `${fontSize}px`
  }
}

// The child must never be left holding a screen with nothing that responds.
// validateChapters() catches contract violations in dev, but it is compiled
// out of the production bundle, so a live content bug has no other net: this
// keeps a working way forward (retry) and a working way out (map), and the
// stage's own 나가기 button stays on screen throughout.
function failurePanelHtml(escapeLabel) {
  return `
    <div class="beat teach-beat recovery-beat">
      <div class="beat-instruction">앗, 여기서 잠깐 문제가 생겼어요.</div>
      <div class="beat-emoji">🔧</div>
      <button class="primary-btn" id="retry-beat">Try Again ▶</button>
      <button class="secondary-btn" id="failure-escape">${escapeLabel}</button>
    </div>
  `
}

function renderBeatFailure(runtime, err) {
  console.error('[beat] 렌더 실패', err)
  const area = beatArea()
  if (!area) return
  area.innerHTML = failurePanelHtml('◀ Map')
  onTap(document.getElementById('retry-beat'), () => runBeat(runtime))
  onTap(document.getElementById('failure-escape'), () => {
    // Also an intentional leave -- and it must clear, or a beat that throws
    // every time would resume straight back into this panel forever.
    clearCheckpoint()
    const chapter = getChapterForStage(runtime.stage.id)
    renderMap(chapter.id)
  })
}

// Click handlers do their work *after* awaiting audio, so a throw in there
// escapes as an unhandled rejection and freezes the round with no visible
// cause. Route those to the same recovery panel.
function withRecovery(runtime, fn) {
  return async (...args) => {
    try {
      await fn(...args)
    } catch (e) {
      renderBeatFailure(runtime, e)
    }
  }
}

function advanceBeat(runtime) {
  runtime.beatIndex += 1
  runBeat(runtime)
}

// `boltFlightMs` is what fireBolt() returned for the bolt that carries THIS
// hit -- 0 when no bolt was drawn, which makes the whole thing collapse back
// to the old synchronous behaviour with no dead time.
//
// The split is deliberate and is not "delay dealHit":
//   * hitsDealt advances NOW. It is read by saveCheckpoint() on the next
//     runBeat() and by the reward gate; holding it back would let a slow
//     bolt lose a hit across a reload, and a boss health bar never recovers
//     from a missing hit. It is also why a mis-timed flight can only ever
//     make the bar drop EARLY (runBeat() repaints it from the real number),
//     never leave damage unapplied.
//   * The hero's lunge fires now -- it is the throw, not the landing.
//   * The two things the child reads as "it hit" -- the bar moving and the
//     villain flinching -- wait for the bolt to arrive.
// `onLand` is for anything else that is a claim about the villain rather
// than about the button, so a beat does not have to re-derive the schedule.
// Nothing awaits this: it schedules and returns, so waitForTransition() and
// every beat transition are byte-identical to before.
function dealHit(runtime, beat, boltFlightMs = 0, onLand) {
  // ↺ Back rewinds `beatIndex` only, never `hitsDealt` (see reverseBeat()'s
  // own comment: reviewing a beat again must not "farm review taps into
  // free damage"). Without this guard that promise was false: real-play
  // audit reproduced Back -> redo an already-scored beat -> a second hit
  // landing on the same beatIndex, double-counting toward the health bar.
  // Gate the score-affecting half only -- the hero lunge/impact/onLand
  // feedback below still plays every time, so a reviewed beat still feels
  // alive, it just cannot move the health bar twice.
  if (!runtime.dealtBeatIndices.has(runtime.beatIndex)) {
    runtime.dealtBeatIndices.add(runtime.beatIndex)
    runtime.hitsDealt = Math.min(runtime.healthMax, runtime.hitsDealt + (beat.hits || 1))
  }
  heroLunge()
  const scene = document.querySelector('.battle-scene')
  const attackBeatIndex = runtime.beatIndex
  const land = () => {
    // The child can leave the stage during the flight -- painting then would
    // write a stale health bar into whatever screen replaced this one.
    if (!ownsScreen(runtime)) return
    updateHealthBar(runtime)
    villainImpact()
    setTimeout(() => {
      if (ownsScreen(runtime) && runtime.beatIndex === attackBeatIndex && scene?.isConnected && scene.dataset.combatState === 'attacking') {
        scene.dataset.combatState = 'studying'
      }
    }, 400)
    if (onLand) onLand()
  }
  if (boltFlightMs > 0) setTimeout(land, boltFlightMs)
  else land()
}

function flashCorrect(container) {
  const el = document.createElement('div')
  el.className = 'flash-correct'
  el.textContent = 'Correct! ✨'
  container.appendChild(el)
  setTimeout(() => el.remove(), 550)
}

function shakeEl(el) {
  el.classList.remove('shake')
  // force reflow so the animation can restart
  void el.offsetWidth
  el.classList.add('shake')
}

// ---- "no fail state" supportive re-demonstration ----
//
// Wrong taps never block a round or select the answer for the child --
// but 2 wrong taps *in a row* on any selection-type round (choose,
// multiselect, drag-build, choose-sequence) trigger a brief, lightweight
// re-teach: replay the relevant sound and pulse-highlight the correct
// answer, then let them keep trying. This is scaffolding, not an
// answer-key -- it never advances the round or selects anything itself.

function makeWrongStreakTracker() {
  let streak = 0
  return {
    // Call on every wrong tap. Returns true the moment the streak hits 2,
    // and resets so the *next* 2 wrong taps trigger it again too.
    registerWrong() {
      streak += 1
      if (streak >= 2) {
        streak = 0
        return true
      }
      return false
    },
  }
}

function pulseHint(el) {
  if (!el) return
  el.classList.remove('hint-pulse')
  void el.offsetWidth
  el.classList.add('hint-pulse')
  setTimeout(() => el.classList.remove('hint-pulse'), 900)
}

// Re-demonstrates a single correct option button: replays its sound
// (the beat/step's own promptAudio when it has one -- that's the exact
// sound being tested -- otherwise just the correct word itself) and
// pulses the button so the eye is drawn to it.
// Runs on a 1.2 s timer, by which time the child may have left the stage --
// the pulse would no-op on a detached node, but the *speech* would talk over
// whatever screen they went to, so bail unless the round is still on screen.
// ---- "odd one out" choose confirmation ----
//
// A handful of `choose` (and one `choose-sequence`) rounds ask for the
// option that does NOT share a sound with the others (majority share one
// sound, the minority pick is correct). This shape has no dedicated data
// field -- per the beat contract in CLAUDE.md, chapters 1-7 just phrase
// `instructionKo` a particular way -- so it's identified by matching that
// Korean prompt text (the only variants actually in use, confirmed via
// `grep -rn "다른 소리" src/data/chapters/*.js`). Real-play QA found the
// original `choose`-only gate missed the one `choose-sequence` beat sharing
// this exact phrasing (chapter 1's "moon" step) -- `instructionKo` lives on
// the beat regardless of kind (choose-sequence just appends "(n/m)" to the
// rendered copy, not to the stored string), so widening the kind check was
// the whole fix.
//
// A correct tap here used to fall straight into flashCorrect() and then
// whatever the beat does next (readAloud, or the very next beat) exactly
// like any other choose round. But nothing on screen ever names *why* the
// pick was right, so the sudden cut to unrelated content reads to a
// 5-year-old as "was that even right?" (reported from real play). The fix
// reuses redemonstrateOption's own mechanism (pulseHint + a spoken line)
// rather than inventing a new one.
//
// The spoken/displayed line is built only from the beat's own option data,
// never a hardcoded per-word phoneme -- these options are whole-word icons
// (dog/bus/cat/...), not letterTiles with a `say` sound notation, so there
// is no per-word phoneme in the data to name correctly. Guessing one from
// a word's first letter would risk teaching a wrong sound for a silent
// letter or an unusual spelling (see chapter-03's cat/key -- different
// first letters, same taught sound). So the line states the relationship
// the quiz is actually testing (this one is the odd one out; the rest
// share a sound) instead of naming the sound itself.
const ODD_ONE_OUT_INSTRUCTION_RE =
  /^다른 소리(로 시작하는|가 들어있는) 걸 (찾아보세요|고르고)/
function isOddOneOutBeat(beat) {
  return (
    (beat.kind === 'choose' || beat.kind === 'choose-sequence') &&
    typeof beat.instructionKo === 'string' &&
    ODD_ONE_OUT_INSTRUCTION_RE.test(beat.instructionKo)
  )
}

// Fires the confirmation and returns immediately (mirrors
// redemonstrateOption's fire-and-forget style) -- the speech it queues
// still blocks the caller's next whenAudioIdle()-based transition, because
// it's on the same shared audio queue as everything else. No extra delay
// needs wiring in separately.
function confirmOddOneOut(area, beat, correctOpt) {
  if (!correctOpt || !area.isConnected) return
  pulseHint(area.querySelector(`[data-id="${correctOpt.id}"]`))
  const feedbackEl = document.getElementById('beat-feedback')
  // Trimmed (2026-08) to just the relationship the quiz tests, no reassuring
  // filler -- QA: "'헷갈릴 수도 있어요' 미사여구는 빼고 심플하게 'OO만
  // 다른 소리를 낸다'로." The extra sentence about the others sharing a
  // sound was true but unnecessary to say out loud every time.
  if (feedbackEl) {
    feedbackEl.textContent = `정답이에요! ${correctOpt.label}만 다른 소리를 내요.`
  }
  // Korean and English text never share one speakKO/speakEN call (see
  // CLAUDE.md's TTS rules -- an English word read by the Korean voice comes
  // out as a mispronounced loanword), so the affirmation and the word
  // itself are two separate queued utterances, same as every other beat in
  // this file (e.g. recapAudio's ko/en split).
  speakKO('정답이에요!')
  speakEN(optionSpeech(correctOpt))
  speakKO('만 다른 소리를 내요.')
}

function redemonstrateOption(area, beatOrStep, correctOpt) {
  if (!correctOpt || !area.isConnected) return
  speakEN(beatOrStep.promptAudio || optionSpeech(correctOpt))
  pulseHint(area.querySelector(`[data-id="${correctOpt.id}"]`))
}

// Re-demonstrates the next needed slot in a drag-build round: speaks its
// sound and pulses a still-available tile showing it. A target slot carries
// only the letterform ('S', or a digraph's 'AI'), never its sound, so the
// sound has to be looked back up in the round's normalized tile list;
// duplicate tiles of one letterform all share that letterform's sound, so
// the first match is always the right one, and any still-enabled tile is an
// equally valid thing to point at.
function redemonstrateLetterTile(area, letters, letter) {
  if (!area.isConnected) return
  const match = letters.find((l) => l.text === letter)
  speakEN(match ? match.say : letter)
  const tile = [...area.querySelectorAll('.letter-tile:not(:disabled)')].find(
    (t) => t.dataset.letter === letter
  )
  pulseHint(tile)
}

// ---- non-scored (teach / break) ----

// Shared button wiring for teach/break beats: starts the audio sequence
// and binds replay + continue. Called both by the normal path and by the
// boss-intro callback after the combination animation finishes.
// speakSequence() enqueues its items one at a time across several
// ticks (it awaits each item's own gap before enqueueing the next), so
// whenAudioIdle() alone -- which only reflects whatever has been
// enqueued *so far* -- could resolve after just the first item if
// read too early (e.g. from a tap that lands between two items of the
// sequence). Keep the actual in-flight promise so "다음" can await the
// *whole* sequence, not a snapshot of it.
function wireTeachButtons(beat, runtime) {
  let playPromise = null
  // One tap on 다시 듣기 queues the *whole* repeatAudio sequence. Letting
  // taps stack meant a few impatient taps could queue 20+ seconds of speech
  // that the 다음 button then had to wait out with nothing happening on
  // screen, so a replay is ignored while its sequence is still playing.
  let playing = false
  const play = () => {
    if (playing) return playPromise
    playing = true
    playPromise = speakSequence(beat.repeatAudio || [], 'en-US').then(
      () => {
        playing = false
      },
      () => {
        playing = false
      }
    )
    return playPromise
  }
  play()
  const replayBtn = document.getElementById('replay-btn')
  const continueBtn = document.getElementById('continue-btn')
  onTap(replayBtn, play)
  if (continueBtn)
    onTap(continueBtn, withRecovery(runtime, async () => {
      // Acknowledge the tap immediately (don't leave it feeling unresponsive)
      // even though we wait for any in-flight teach/break audio to finish
      // before actually moving to the next beat, so its own auto-played
      // audio never lands on top of this one's tail end.
      continueBtn.disabled = true
      await playPromise
      await whenAudioIdle()
      advanceBeat(runtime)
    }))
}

// The boss stage's whole point is that the sounds learned in the chapter
// combine into one word, so the intro shows that as an equation built from
// the stage's own drag-build targets -- the very words the child is about to
// assemble, so the two can never drift apart. Going through targetSlots()
// means a digraph stays one term ("R + AI + N", never "R + A + I + N", which
// would teach exactly the wrong thing). Repeated targets collapse: chapter 3
// builds CAT twice and HEN once, so it shows two equations, not three.
function buildEquationsHtml(stage) {
  const seen = new Set()
  const rows = []
  for (const b of stage.beats) {
    if (b.kind !== 'drag-build' || !b.target) continue
    const slots = targetSlots(b.target)
    const word = slots.join('')
    if (seen.has(word)) continue
    seen.add(word)
    // The equation is bounded by WIDTH, not height, and how wide it is
    // depends on the chapter: "S + A + T = SAT" is 15 glyphs, chapter 7's
    // "R + AI + N = RAIN" is 17, and a future 4-letter boss word would be 20.
    // A single font-size big enough for 15 makes 17 wrap. So the glyph count
    // travels to CSS and the rule divides the column width by it -- every
    // chapter then gets the largest size that still fits on one line, and a
    // new chapter cannot silently regress into a wrapped equation.
    const text = `${slots.join(' + ')} = ${word}`
    rows.push(
      `<div class="beat-equation" style="--eq-len:${text.length}">${slots.join(
        ' + '
      )} = <b>${word}</b></div>`
    )
  }
  return rows.join('')
}

// When the combined form starts asking to be tapped. The emerge animation
// runs 1.02s -> 1.54s (style.css `hero-emerge`), so this lands just after it
// settles: the form holds still long enough to be looked at, then wobbles.
const COMBINE_INVITE_MS = 1650

// ---- finger-trace canvas (teach/break beats that ask the child to trace a
// letter with their finger) ----
//
// Matched purely by `instructionKo` text, the same way isOddOneOutBeat()
// matches its own beats above -- there is no dedicated data field for this,
// per the task that added it, and CLAUDE.md's chapter contract owns
// `chapters/**` so a new field can't be added here anyway. Every beat that
// currently phrases the finger-trace prompt also carries `letter` (confirmed
// via `grep -n "그려볼까요" src/data/chapters/*.js` cross-referenced with the
// same beats' `letter` field), but the `letter` check is kept as a real
// guard, not a formality: without a letter there is nothing to trace and
// nothing to show as the faint guide glyph.
function isFingerTraceBeat(beat) {
  return (
    typeof beat.instructionKo === 'string' &&
    beat.instructionKo.includes('그려볼까요') &&
    !!beat.letter
  )
}

// The *second* finger-trace moment: a `listen-repeat` beat immediately
// following the teach/break beat above reuses the same "따라 그리면서" prompt
// phrasing to ask the child to trace again while saying the sound (confirmed
// via `grep -rhoE "instructionKo: '[^']*따라 그리[^']*'" src/data/chapters/*.js`
// -- 39 variants, all `kind: 'listen-repeat'`, none `finale`). Unlike the
// teach/break beat, this one carries no `letter` field at all -- only
// `words[]` -- so this helper only confirms the instruction text; the caller
// (renderListenRepeatBeat's showWord()) resolves the actual glyph to trace
// from `beat.words[wordIndex].text` per word shown. `finale` beats share the
// same renderer and phrase their instructions completely differently (the
// "shout the word" moment), so no explicit exclusion is needed here beyond
// the `kind` check itself.
function isFingerTraceListenRepeatBeat(beat) {
  return (
    beat.kind === 'listen-repeat' &&
    typeof beat.instructionKo === 'string' &&
    beat.instructionKo.includes('따라 그리')
  )
}

// Small eraser glyph for the clear button -- no single emoji reads
// unambiguously as "eraser" (🧹 is a broom, 🧽 a sponge), so this draws one:
// a two-tone rotated rectangle is the standard pictogram-eraser shape. Pure
// stroke/fill, no gradients/filters (matches this project's SVG art rule),
// and sized to sit inside a small round button.
const ERASER_ICON_SVG = `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
  <g transform="rotate(45 10 10)">
    <rect x="3" y="6.5" width="14" height="7" rx="2" fill="#fff" stroke="currentColor" stroke-width="1.6"/>
    <rect x="3" y="6.5" width="6.5" height="7" rx="2" fill="currentColor" opacity="0.4"/>
  </g>
</svg>`

// No accuracy/stroke-order grading -- this project's "no fail state" rule
// (CLAUDE.md) means the canvas is a scribble pad, not a quiz. It exists only
// so the faint guide letter has something to trace over.
function traceBoxHtml(letter) {
  const isDigraph = letter.length > 1
  // A digraph ('sh', 'ee', ...) needs a wider box than a single glyph, or the
  // guide letter has to shrink so much it stops being useful to trace over.
  // Sizes are svh-based (this file's existing convention -- see
  // .beat-emoji/.big-letter in style.css) so the box scales with the screen
  // instead of a fixed pixel box that could overflow a smaller viewport.
  //
  // The caps here are deliberately much smaller than .big-letter's own
  // (clamp(96px,21.4svh,256px)): this beat's instruction line
  // ("손가락으로 소문자 s를 그려볼까요? 함께 외쳐요!") wraps to 3 lines where a
  // plain teach beat's is 2, so there is measurably less vertical budget
  // left over before .beat (space-evenly, flex:1) overflows its screen.
  // Measured on the real teach2 beat (a same-shape ordinary teach beat) at
  // the iPad's 834x1194 portrait viewport: instruction 196px + focus 268px +
  // 2 buttons (117px, 111px) fits with room to spare, but this beat's own
  // (longer) instruction alone runs 294px -- ~98px more -- so the box has to
  // give that back or the beat overflows. A first pass at clamp(...,52svh,
  // 440px) plus a separate "지우기" button row measured 198px of overflow at
  // that exact viewport; this smaller cap plus moving the button off the
  // flex flow (see below) is what clears it (re-verified empty afterward).
  // The same box is reused (unchanged) by the listen-repeat trace beat
  // (isFingerTraceListenRepeatBeat) even though that screen has one more
  // button (🎤 I read it!) than this one -- see wireTraceCanvas's caller for
  // the measured verdict on that screen specifically.
  // Shrunk again (2026-08) after real-play QA found this box overflowing in
  // landscape specifically once it shares a screen with the shout-attack
  // flow (runAttackReadAloud's #beat-feedback can grow a full second line,
  // "다시 ATTACK을 눌러서 소리쳐봐요!", that the old plain "I read it!" flow
  // never needed -- see that function's caller). Measured: at 1194x921
  // landscape the ATTACK+trace screen was clearing by only 18px before that
  // line ever appears, so any wrapped feedback text tipped it into scroll
  // (confirmed by injecting that exact string and reading getBoundingClientRect
  // -- 27px over). Cutting the svh mid-points here buys back ~55px, re-verified
  // empty on that same screen afterward with the retry message forced in.
  const boxStyle = isDigraph
    ? 'width:clamp(220px, 46svh, 400px);height:clamp(120px, 24svh, 190px);'
    : 'width:clamp(150px, 26svh, 260px);height:clamp(150px, 26svh, 260px);'
  const guideFontStyle = isDigraph
    ? 'font-size:clamp(54px, 15svh, 110px);'
    : 'font-size:clamp(80px, 18svh, 155px);'
  // The clear button sits *inside* the box, absolutely positioned, instead
  // of below it: a below-it button is a 5th flex child that .beat has to
  // find room for on top of the box itself, and that extra row is what
  // pushed the beat over budget (see measurement above). Absolute
  // positioning takes it out of the flex flow entirely -- it costs the
  // layout nothing. It sits in the bottom-right corner, not top-right: QA
  // found the old top-right "지우기" text button covered the top of the
  // traced/guide letter (most letters and both digraph glyphs sit centered
  // or high in the box), where bottom-right only risks overlapping a
  // descender-less letter's empty lower corner. Small (40x40, icon-only) so
  // it reads as a corner control rather than competing with the letter, but
  // still at this app's minimum comfortable touch target for a 5-year-old.
  // Static/structural rules for .trace-box/.trace-letter-guide/.trace-canvas/
  // .trace-clear-btn live in style.css -- only the per-call clamp() sizing
  // (single letter vs digraph) stays inline here.
  return `
    <div class="trace-focus">
      <div class="trace-box" style="${boxStyle}">
        <div class="trace-letter-guide" style="${guideFontStyle}">${letter}</div>
        <canvas class="trace-canvas" id="trace-canvas"></canvas>
        <button class="trace-clear-btn" id="trace-clear-btn" aria-label="지우기" title="지우기">${ERASER_ICON_SVG}</button>
      </div>
    </div>
  `
}

// Wires the canvas drawn by traceBoxHtml(). Pixel-scribble only: pointer
// events (not onTap(), which is built for discrete taps -- see its comment
// above) draw a continuous stroke while the pointer is down, and the clear
// button wipes the bitmap. touch-action:none plus preventDefault() on the
// canvas keep a drag from scrolling/zooming the page, which this app's
// no-scroll rule forbids.
function wireTraceCanvas() {
  const canvas = document.getElementById('trace-canvas')
  if (!canvas) return
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // The canvas has no intrinsic pixel size -- CSS gives it a box, but the
  // backing bitmap defaults to 300x150 and would draw blurry/stretched
  // without this. devicePixelRatio keeps strokes crisp on the iPad's
  // high-density screen.
  const dpr = window.devicePixelRatio || 1
  const rect = canvas.getBoundingClientRect()
  canvas.width = Math.max(1, Math.round(rect.width * dpr))
  canvas.height = Math.max(1, Math.round(rect.height * dpr))
  ctx.scale(dpr, dpr)
  ctx.lineJoin = 'round'
  ctx.lineCap = 'round'
  ctx.lineWidth = 14
  // Canvas 2D can't take a CSS var() directly, so it's resolved once here
  // instead of hard-coding a duplicate of the theme color.
  ctx.strokeStyle =
    getComputedStyle(document.documentElement).getPropertyValue('--accent-dark').trim() ||
    '#2b3a67'

  let drawing = false
  let lastX = 0
  let lastY = 0
  const pointFromEvent = (e) => {
    const r = canvas.getBoundingClientRect()
    return { x: e.clientX - r.left, y: e.clientY - r.top }
  }
  const start = (e) => {
    e.preventDefault()
    drawing = true
    const p = pointFromEvent(e)
    lastX = p.x
    lastY = p.y
    // A bare pointerdown with no move yet should still leave a dot, not
    // nothing -- a tiny tap-and-lift is a valid (if small) trace stroke.
    ctx.beginPath()
    ctx.arc(p.x, p.y, ctx.lineWidth / 2, 0, Math.PI * 2)
    ctx.fillStyle = ctx.strokeStyle
    ctx.fill()
    canvas.setPointerCapture(e.pointerId)
  }
  const move = (e) => {
    if (!drawing) return
    e.preventDefault()
    const p = pointFromEvent(e)
    ctx.beginPath()
    ctx.moveTo(lastX, lastY)
    ctx.lineTo(p.x, p.y)
    ctx.stroke()
    lastX = p.x
    lastY = p.y
  }
  const end = (e) => {
    drawing = false
    if (canvas.hasPointerCapture(e.pointerId)) canvas.releasePointerCapture(e.pointerId)
  }
  canvas.addEventListener('pointerdown', start)
  canvas.addEventListener('pointermove', move)
  canvas.addEventListener('pointerup', end)
  canvas.addEventListener('pointercancel', end)

  const clearBtn = document.getElementById('trace-clear-btn')
  onTap(clearBtn, () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
  })
}

function renderNonScoredBeat(runtime, beat) {
  const area = beatArea()
  const isBossIntro =
    runtime.stage.chapterBoss && beat.kind === 'teach' && runtime.beatIndex === 0
  const isFingerTrace = !isBossIntro && isFingerTraceBeat(beat)
  // The boss teach beat's `beat.emoji` was a rebus ("🐍🐜🚙➡️🤖") that reads as
  // nothing in particular and carries no phonics -- so on that one beat the
  // letter equation wins instead. Everywhere else `emoji` is untouched.
  const visual = isBossIntro
    ? buildEquationsHtml(runtime.stage)
    : beat.art === 'hero'
    ? `<div class="beat-avatar">${heroArt(runtime.stage.hero)}</div>`
    : `<div class="beat-emoji">${beat.emoji || ''}</div>`

  // The decorative visual and the letter sit in one row instead of stacked.
  // Stacked, they cost the sum of their heights; a portrait teach beat needed
  // 1165px of the 1194px available, which left the letter no room to grow at
  // all. Side by side the row costs only the taller of the two -- measured
  // 99px reclaimed -- and that is what pays for the bigger letter. Nothing is
  // removed from the screen. The boss equation is excluded: it is already a
  // full-width block and two chapters render two of them, which a row would
  // put side by side.
  const letterHtml = beat.letter
    ? `<div class="big-letter">${beat.letter}</div>`
    : ''
  const focus = isBossIntro
    ? visual + letterHtml
    : isFingerTrace
    ? traceBoxHtml(beat.letter)
    : `<div class="teach-focus">${visual}${letterHtml}</div>`

  const teachInner = `
    <div class="beat-instruction">${beat.instructionKo}</div>
    ${focus}
    <button class="replay-btn" id="replay-btn">🔊 Listen</button>
    <button class="primary-btn" id="continue-btn">Next ▶</button>
  `

  // Boss-stage teach beats (always the very first beat of the boss stage)
  // get a short "합체!" combination-sequence animation before the normal
  // teach content appears: the chapter's prior-stage heroes slide in as
  // mini-bots, a flash fires, then the final-form hero robot emerges.
  // The whole intro is CSS-driven and lasts ~1.6 s, or ends early on a tap.
  if (runtime.stage.chapterBoss && beat.kind === 'teach' && runtime.beatIndex === 0) {
    const chapter = getChapterForStage(runtime.stage.id)
    const lineup = fusionLineup(chapter.stages)
    // Labels remain learning content, independent of each character image.
    // They are the same deduplicated sound keys used to choose the lineup;
    // word-building equations below still come from targetSlots, never names.
    const soundsHtml = lineup.map((s) => heroEmblem(s.hero))
      .filter((sound) => sound && sound !== '★')
      .map((sound) => `<span class="fusion-sound">${sound}</span>`)
      .join('<span class="fusion-sound-plus" aria-hidden="true">+</span>')
    const dirs = ['from-left', 'from-right', 'from-left']
    const robotsHtml = lineup
      .map(
        (s, i) => `
        <div class="mini-bot mini-slide-${dirs[i % dirs.length]}" style="--slide-delay:${
          i * 130
        }ms">
          ${heroArt(s.hero)}
        </div>`
      )
      .join('')

    area.innerHTML = `
      <div class="beat teach-beat">
        <div class="boss-intro" id="boss-intro" role="button" tabindex="0" aria-label="Continue" style="cursor:pointer">
          <div class="boss-intro-label">UNITE!</div>
          <div class="boss-intro-robots">${robotsHtml}</div>
          <div class="fusion-sound-strip" aria-label="Sounds joining together">${soundsHtml}</div>
          <div class="boss-intro-flash"></div>
          <div class="boss-intro-hero" id="boss-intro-hero">${heroArt(
            runtime.stage.hero
          )}</div>
          <div class="boss-intro-skip" id="boss-intro-hint" style="visibility:hidden">탭하면 계속해요!</div>
        </div>
        <div class="teach-content" id="teach-content" style="display:none">${teachInner}</div>
      </div>
    `

    // A TAP is now the only way out of the intro. QA: "합체 결과물을 감상 할
    // 시간이 전혀 주어지지 않더라" -- the old 1650ms auto-reveal fired 110ms
    // after the final form finished materialising (hero-emerge runs
    // 1.02s->1.54s), so the thing the whole animation builds up to was on
    // screen for about one frame. Nothing about the combined form is
    // time-critical, and holding it costs the child nothing: they end it when
    // they have looked at it.
    //
    // The timer that used to advance the beat now only INVITES the tap:
    // `.combine-invite` on the final form is layout's infinite wobble
    // (contract), and it is removed here on the tap. It is added late, not at
    // render, so the wobble cannot fight the emerge animation -- and so that
    // "hold still, then wiggle" reads as the robot asking to be touched.
    //
    // The `revealed` guard is now the ONLY thing standing between a
    // 5-year-old's double tap and wireTeachButtons() running twice (which
    // would double up the auto-played teach audio). It used to also cover the
    // timer-vs-tap race; both callers are gone but the guard matters more
    // than before, not less, because pointerdown fires the handler earlier.
    const intro = document.getElementById('boss-intro')
    let revealed = false
    const inviteTimer = setTimeout(() => {
      const hero = document.getElementById('boss-intro-hero')
      if (hero) hero.classList.add('combine-invite')
      const hint = document.getElementById('boss-intro-hint')
      if (hint) hint.style.visibility = ''
    }, COMBINE_INVITE_MS)
    const revealTeach = () => {
      if (revealed) return
      const content = document.getElementById('teach-content')
      // The player may have navigated away mid-animation.
      if (!content) return
      revealed = true
      clearTimeout(inviteTimer)
      const hero = document.getElementById('boss-intro-hero')
      if (hero) hero.classList.remove('combine-invite')
      if (intro) intro.remove()
      content.style.display = ''
      wireTeachButtons(beat, runtime)
    }
    onTap(intro, revealTeach)
    return
  }

  area.innerHTML = `
    <div class="beat teach-beat">
      ${teachInner}
    </div>
  `
  if (isFingerTrace) wireTraceCanvas()
  wireTeachButtons(beat, runtime)
}

// ---- pick, then confirm ----
//
// Tapping an option used to BE the answer. Two QA defects came out of that
// single tap doing two jobs at once:
//
//  * a child auditioning the board ("what does this one say?") answered by
//    accident, so rounds were won by luck and the stage ran past them;
//  * the tapped option's sound and the round's outcome fired together, so
//    tapping `sock` and then the correct `dog` played "sock" at the exact
//    moment `dog` was accepted (speakTap coalesces while an utterance is
//    still in flight, so `dog`'s own sound was the one dropped). The child
//    heard the wrong word as their right answer was taken.
//
// So the jobs are split: a tap SELECTS and speaks, `✓ Check` grades.
//
// Applied to ALL FOUR option-grid beat kinds -- choose, match-shape, every
// step of choose-sequence, and multiselect -- not only to the odd-one-out
// rounds QA pointed at. All four render the identical `.options-grid`, so a
// rule that held for some of them would leave the child working out per
// screen whether a tap auditions or answers, which is a worse problem than
// the one being fixed. choose-sequence is included despite being the
// rapid-fire drill for the same reason: it looks exactly like choose.
//
// drag-build is deliberately NOT changed: it already judges on completion
// with Undo as the escape, which is the same pick-then-commit shape arrived
// at from the other direction.
//
// The button reuses `.mic-btn` (green = go, and its :disabled is a plain
// opacity drop) rather than `.primary-btn`, whose :disabled state is the
// "audio is playing, wait" breathing animation -- wrong meaning for "nothing
// picked yet". `.confirm-btn` is on it so layout can take it over later.
const CONFIRM_BTN_HTML =
  '<button class="mic-btn confirm-btn" id="confirm-btn" disabled>✓ Check</button>'

// `judge(pickedIds)` decides; `onCorrect` runs once and the grid locks;
// `onWrong` runs the beat's own feedback + rescue and the round stays open
// (no health cost, no penalty -- "no fail state" is untouched: what changed
// is only WHICH tap is the answer).
function wireConfirmGrid(runtime, area, cfg) {
  const {
    options,
    multi = false,
    speakFor,
    judge,
    onCorrect,
    onWrong,
    // Which of the confirmed picks a wrong verdict throws away (they are the
    // ones that get shaken). Default: all of them, which is right for a
    // single-select round. multiselect keeps the picks that WERE correct --
    // "you haven't found them all yet" must not cost the child the ones they
    // already had.
    dropOnWrong = (ids) => ids,
  } = cfg
  const confirmBtn = area.querySelector('#confirm-btn')
  const picked = new Set()
  // Same double-fire guard the beats had before: the correct branch acts
  // after an await, so an excited second tap could otherwise advance twice --
  // skipping a beat and the damage it owed, which a boss health bar can
  // never recover from.
  let settled = false

  const feedback = () => area.querySelector('#beat-feedback')
  const deselectAll = () => {
    picked.clear()
    area
      .querySelectorAll('.option-btn.selected')
      .forEach((b) => b.classList.remove('selected'))
  }
  const syncConfirm = () => {
    confirmBtn.disabled = picked.size === 0
  }

  onTapAll(area.querySelectorAll('.option-btn'), (btn) =>
    withRecovery(runtime, async () => {
      if (settled) return
      const opt = options.find((o) => o.id === btn.dataset.id)
      // Speaking on every tap is the point of the split -- the board is for
      // listening to, and it stays listenable after a wrong confirm too.
      speakTap(speakFor(opt))
      if (picked.has(opt.id)) {
        picked.delete(opt.id)
        btn.classList.remove('selected')
      } else {
        if (!multi) deselectAll()
        picked.add(opt.id)
        btn.classList.add('selected')
      }
      const fb = feedback()
      if (fb) fb.textContent = ''
      syncConfirm()
    })
  )

  onTap(
    confirmBtn,
    withRecovery(runtime, async () => {
      if (settled || confirmBtn.disabled) return
      const chosen = [...picked]
      if (!judge(chosen)) {
        // Dropping the wrong pick is what makes the next tap a fresh choice:
        // left selected, the child can re-press ✓ Check on the same answer
        // and the only thing that produces is a second "wrong".
        for (const id of dropOnWrong(chosen)) {
          picked.delete(id)
          const btn = area.querySelector(`[data-id="${id}"]`)
          if (btn) {
            btn.classList.remove('selected')
            shakeEl(btn)
          }
        }
        syncConfirm()
        onWrong(chosen)
        return
      }
      settled = true
      confirmBtn.disabled = true
      // Correctness charges the hero without damaging or alarming the villain.
      const boltFlightMs = chargeHero(confirmBtn)
      await onCorrect(chosen, boltFlightMs)
    })
  )
}

// ---- choose ----

function renderChooseBeat(runtime, beat) {
  const area = beatArea()
  const optionsHtml = beat.options
    .map(
      (opt) => `
      <button class="option-btn" data-id="${opt.id}">
        <span class="option-emoji">${wordIcon(opt.icon, opt.label)}</span>
        ${optionLabelHtml(opt, true)}
      </button>`
    )
    .join('')

  const promptHtml = beat.promptLetter
    ? `<div class="big-letter">${beat.promptLetter}</div>`
    : beat.promptEmoji
    ? `<div class="beat-emoji">${beat.promptEmoji}</div>`
    : ''
  const replayHtml = beat.promptAudio
    ? `<button class="replay-btn" id="replay-btn">🔊 Listen</button>`
    : ''

  area.innerHTML = `
    <div class="beat choose-beat">
      <div class="beat-instruction">${beat.instructionKo}</div>
      ${promptHtml}
      ${replayHtml}
      <div class="options-grid">${optionsHtml}</div>
      ${CONFIRM_BTN_HTML}
      <div class="beat-feedback" id="beat-feedback"></div>
    </div>
  `

  if (beat.promptAudio) {
    speakEN(beat.promptAudio)
    onTap(document.getElementById('replay-btn'), () =>
      speakTap(beat.promptAudio)
    )
  }

  const wrongStreak = makeWrongStreakTracker()

  wireConfirmGrid(runtime, area, {
    options: beat.options,
    speakFor: optionSpeech,
    judge: (ids) =>
      ids.length === 1 &&
      !!beat.options.find((o) => o.id === ids[0] && o.correct),
    onWrong: () => {
      document.getElementById('beat-feedback').textContent = '다시 들어볼까요?'
      if (wrongStreak.registerWrong()) {
        const correct = beat.options.find((o) => o.correct)
        setTimeout(() => redemonstrateOption(area, beat, correct), 1200)
      }
    },
    onCorrect: async () => {
      flashCorrect(area)
      if (isOddOneOutBeat(beat)) {
        confirmOddOneOut(area, beat, beat.options.find((o) => o.correct))
      }
      if (beat.scored && beat.readAloud) {
        await showTransitionCountdown(whenAudioIdle())
        // choose/multiselect/drag-build all attack here; only match-shape
        // still calls runReadAloud() -- see runAttackReadAloud()'s own header
        // comment for why.
        runAttackReadAloud(runtime, beat, beat.readAloud)
      } else {
        await waitForTransition(600)
        advanceBeat(runtime)
      }
    },
  })
}

// ---- match-shape (letterform discrimination -- b/d etc, never by sound) ----
//
// choose beats speak the tapped option's *sound* (opt.say, falling back to
// opt.label), which is exactly why b/d can never share a choose beat: Alex
// renders "buh" and "duh" identically, so a sound-based round can't teach
// that distinction at all -- see the collision-pair check in
// validateChapters(). match-shape exists for the pairs that have to be
// taught by *shape* instead (stroke direction, mirror symmetry), so tapping
// speaks only the letter's own name -- via opt.label directly, never
// optionSpeech()/opt.say -- so a phonics sound can never leak into a shape
// round even if a future data author mistakenly copies a `say` field onto
// one of these options. Everything else -- options[], readAloud,
// promptLetter/promptEmoji, scored/hits -- matches renderChooseBeat's data
// contract exactly on purpose: this is choose, minus the one thing that
// made choose unsafe for a shape-only pair. validateChapters()'s spoken
// collision-pair check must skip 'match-shape' beats for the same reason.

function redemonstrateShapeOption(area, correctOpt) {
  if (!correctOpt || !area.isConnected) return
  speakEN(correctOpt.label)
  pulseHint(area.querySelector(`[data-id="${correctOpt.id}"]`))
}

function renderMatchShapeBeat(runtime, beat) {
  const area = beatArea()
  const optionsHtml = beat.options
    .map(
      (opt) => `
      <button class="option-btn" data-id="${opt.id}">
        <span class="option-emoji">${wordIcon(opt.icon, opt.label)}</span>
        ${optionLabelHtml(opt)}
      </button>`
    )
    .join('')

  const promptHtml = beat.promptLetter
    ? `<div class="big-letter">${beat.promptLetter}</div>`
    : beat.promptEmoji
    ? `<div class="beat-emoji">${beat.promptEmoji}</div>`
    : ''

  area.innerHTML = `
    <div class="beat choose-beat">
      <div class="beat-instruction">${beat.instructionKo}</div>
      ${promptHtml}
      <div class="options-grid">${optionsHtml}</div>
      ${CONFIRM_BTN_HTML}
      <div class="beat-feedback" id="beat-feedback"></div>
    </div>
  `

  const wrongStreak = makeWrongStreakTracker()

  wireConfirmGrid(runtime, area, {
    options: beat.options,
    // opt.label, deliberately not optionSpeech(opt) -- see block comment above.
    speakFor: (opt) => opt.label,
    judge: (ids) =>
      ids.length === 1 &&
      !!beat.options.find((o) => o.id === ids[0] && o.correct),
    onWrong: () => {
      // "Listen again?" would be nonsense here -- nothing was played -- so
      // this round gets its own look-again phrasing rather than choose's
      // "들어볼까요?".
      document.getElementById('beat-feedback').textContent = '다시 봐볼까요?'
      if (wrongStreak.registerWrong()) {
        const correct = beat.options.find((o) => o.correct)
        setTimeout(() => redemonstrateShapeOption(area, correct), 1200)
      }
    },
    onCorrect: async () => {
      flashCorrect(area)
      if (beat.scored && beat.readAloud) {
        await showTransitionCountdown(whenAudioIdle())
        runReadAloud(runtime, beat, beat.readAloud)
      } else {
        await waitForTransition(600)
        advanceBeat(runtime)
      }
    },
  })
}

// ---- choose-sequence (rapid-fire cycling review, e.g. S -> A -> T) ----

function renderChooseSequenceBeat(runtime, beat) {
  const area = beatArea()
  let stepIndex = 0

  function showStep() {
    const step = beat.steps[stepIndex]
    const optionsHtml = step.options
      .map(
        (opt) => `
        <button class="option-btn" data-id="${opt.id}">
          <span class="option-emoji">${wordIcon(opt.icon, opt.label)}</span>
          ${optionLabelHtml(opt, true)}
        </button>`
      )
      .join('')
    area.innerHTML = `
      <div class="beat choose-beat">
        <div class="beat-instruction">${beat.instructionKo} (${
      stepIndex + 1
    }/${beat.steps.length})</div>
        <button class="replay-btn" id="replay-btn">🔊 Listen</button>
        <div class="options-grid">${optionsHtml}</div>
        ${CONFIRM_BTN_HTML}
        <div class="beat-feedback" id="beat-feedback"></div>
      </div>
    `
    speakEN(step.promptAudio)
    onTap(document.getElementById('replay-btn'), () =>
      speakTap(step.promptAudio)
    )

    // Fresh streak per step -- each step is effectively its own mini
    // question, so 2 wrong answers within *that* step trigger the hint.
    const wrongStreak = makeWrongStreakTracker()

    wireConfirmGrid(runtime, area, {
      options: step.options,
      speakFor: optionSpeech,
      judge: (ids) =>
        ids.length === 1 &&
        !!step.options.find((o) => o.id === ids[0] && o.correct),
      onWrong: () => {
        document.getElementById('beat-feedback').textContent =
          '다시 들어볼까요?'
        if (wrongStreak.registerWrong()) {
          const correct = step.options.find((o) => o.correct)
          setTimeout(() => redemonstrateOption(area, step, correct), 1200)
        }
      },
      // Sequence rounds keep their automatic final attack, after charging.
      onCorrect: async (chosen, chargeFlightMs) => {
        flashCorrect(area)
        if (isOddOneOutBeat(beat)) {
          confirmOddOneOut(area, beat, step.options.find((o) => o.correct))
        }
        stepIndex += 1
        if (stepIndex < beat.steps.length) {
          await waitForTransition(500)
          if (!ownsScreen(runtime)) return
          setCombatState('studying')
          showStep()
        } else {
          await waitForTransition(chargeFlightMs)
          if (!ownsScreen(runtime)) return
          dealHit(runtime, beat, fireHeroAttack())
          await waitForTransition(500)
          advanceBeat(runtime)
        }
      },
    })
  }

  showStep()
}

// ---- multiselect ----

function renderMultiselectBeat(runtime, beat) {
  const area = beatArea()
  const optionsHtml = beat.options
    .map(
      (opt) => `
      <button class="option-btn" data-id="${opt.id}">
        <span class="option-emoji">${wordIcon(opt.icon, opt.label)}</span>
        ${optionLabelHtml(opt, true)}
      </button>`
    )
    .join('')

  area.innerHTML = `
    <div class="beat multiselect-beat">
      <div class="beat-instruction">${beat.instructionKo}</div>
      <div class="options-grid">${optionsHtml}</div>
      ${CONFIRM_BTN_HTML}
      <div class="beat-feedback" id="beat-feedback"></div>
    </div>
  `

  const correctIds = new Set(
    beat.options.filter((o) => o.correct).map((o) => o.id)
  )
  const wrongStreak = makeWrongStreakTracker()

  wireConfirmGrid(runtime, area, {
    options: beat.options,
    multi: true,
    speakFor: optionSpeech,
    // Exact set match. Before the confirm button a wrong option shook the
    // instant it was touched, which handed the answer over one tap at a
    // time; now every option selects silently and the SET is what is judged.
    judge: (ids) =>
      ids.length === correctIds.size && ids.every((id) => correctIds.has(id)),
    dropOnWrong: (ids) => ids.filter((id) => !correctIds.has(id)),
    onWrong: (ids) => {
      const hadWrongPick = ids.some((id) => !correctIds.has(id))
      document.getElementById('beat-feedback').textContent = hadWrongPick
        ? '다시 골라볼까요?'
        : '아직 더 있어요!'
      if (wrongStreak.registerWrong()) {
        const kept = new Set(ids.filter((id) => correctIds.has(id)))
        const remaining = beat.options.find(
          (o) => o.correct && !kept.has(o.id)
        )
        setTimeout(() => redemonstrateOption(area, beat, remaining), 1200)
      }
    },
    onCorrect: async () => {
      flashCorrect(area)
      // Guarded the same way choose/drag-build are (audit found this call
      // was unconditional -- harmless today only because every multiselect
      // in the data happens to be scored with a readAloud, per CLAUDE.md's
      // data contract; an unscored one would hit runAttackReadAloud with an
      // undefined readAloud and crash instead of just advancing).
      if (beat.scored && beat.readAloud) {
        await showTransitionCountdown(whenAudioIdle())
        runAttackReadAloud(runtime, beat, beat.readAloud)
      } else {
        await waitForTransition(600)
        advanceBeat(runtime)
      }
    },
  })
}

// ---- drag-build (tap-to-place, touch-friendly) ----

function renderBuildBeat(runtime, beat) {
  const area = beatArea()
  const target = targetSlots(beat.target)
  const slotsHtml = target
    .map((_, i) => `<div class="build-slot" data-slot="${i}"></div>`)
    .join('')
  // data-letter stays the plain letterform: it is what gets matched against
  // `beat.target` and what redemonstrateLetterTile() searches by. The tile's
  // sound is read from this list by tile index instead, so blending a word
  // sounds out "sss-aaa-t" rather than spelling "ess-ay-tee".
  const letters = beat.letters.map(spokenPair)

  // Slots and tiles are two independent lists, so they can disagree in a way
  // that just collecting their characters would hide: letters [r,a,i,n] and
  // target [R,AI,N] both "spell rain" but no tile can ever fill the AI slot.
  // The child would tap every tile forever with nothing to find and no way to
  // know why -- a silent trap, which this session has repeatedly found to be
  // worse than a visible failure. validateChapters() catches the mismatch in
  // dev, but it is compiled out of production, so fail into the recovery
  // panel (which offers a retry and a way back to the map) instead.
  const unfilled = letters.map((l) => l.text)
  for (const slot of target) {
    const at = unfilled.indexOf(slot)
    // Sub-multiset, not equality: extra distractor tiles are a legitimate
    // difficulty knob, a slot with no tile is never legitimate.
    if (at === -1) {
      throw new Error(
        `drag-build target slot "${slot}" has no matching tile in [${letters
          .map((l) => l.text)
          .join(', ')}]`
      )
    }
    unfilled.splice(at, 1)
  }

  const tilesHtml = letters
    .map(
      (l, i) =>
        `<button class="letter-tile" data-tile="${i}" data-letter="${l.text}">${l.text}</button>`
    )
    .join('')

  area.innerHTML = `
    <div class="beat build-beat">
      <div class="beat-instruction">${beat.instructionKo}</div>
      <div class="build-slots">${slotsHtml}</div>
      <div class="tile-row">${tilesHtml}</div>
      <button class="secondary-btn" id="clear-btn">↺ Undo</button>
      <div class="beat-feedback" id="beat-feedback"></div>
    </div>
  `

  let placed = []
  const slots = area.querySelectorAll('.build-slot')
  const slotSoundTokens = new WeakMap()
  const tiles = area.querySelectorAll('.letter-tile')
  const slotRow = area.querySelector('.build-slots')
  const undoBtn = document.getElementById('clear-btn')
  const wrongStreak = makeWrongStreakTracker()
  const feedback = () => document.getElementById('beat-feedback')

  function redraw() {
    slots.forEach((slot, i) => {
      slot.textContent = placed[i] ? placed[i].letter : ''
    })
  }

  // Set once the word is complete AND correct: the tiles are all disabled by
  // then, but Undo stays tappable during the await and would otherwise
  // re-arm the round while the transition to the next beat was already under
  // way. A complete-but-wrong word deliberately does NOT settle -- Undo is
  // the only way out of it.
  let settled = false

  // Undo is one step, not a clear-all: the child taps tiles left to right, so
  // popping the last one lets a single misplacement be fixed without throwing
  // away the letters that were already right. Clearing everything is still
  // reachable by repeating it, and the 2-wrong-rounds rescue below does it
  // automatically.
  function undoOne() {
    const last = placed.pop()
    if (!last) return false
    const undoneSlot = slots[placed.length]
    slotSoundTokens.delete(undoneSlot)
    undoneSlot.classList.remove('sound-active')
    const tile = area.querySelector(`.letter-tile[data-tile="${last.tileIndex}"]`)
    if (tile) {
      tile.disabled = false
      tile.classList.remove('used')
    }
    redraw()
    feedback().textContent = ''
    return true
  }

  // A wrong ORDER is not a wrong answer: it costs no health (dealHit only
  // ever runs off the correct completion, via runReadAloud) and the round
  // never ends, so this is the "no fail state" rule intact -- the child just
  // hasn't finished yet. Judging happens on completion rather than per tap,
  // because a per-tap rejection is exactly the guard-rail that made Undo
  // dead weight: the point is that the word can actually come out wrong and
  // the child sees it standing there, spelled, before fixing it.
  function rejectWord() {
    shakeEl(slotRow)
    shakeEl(undoBtn)
    feedback().textContent = '순서가 달라요! ↺ Undo 로 빼요'
    if (wrongStreak.registerWrong()) {
      // Two wrong words in a row: clear it for them rather than leaving a
      // 5-year-old to un-tap three tiles, then re-demonstrate the first
      // sound (same scaffolding the other beats use -- it points, it never
      // places the tile itself).
      while (undoOne()) {}
      feedback().textContent = '처음부터 같이 해볼까요?'
      setTimeout(() => redemonstrateLetterTile(area, letters, target[0]), 1200)
    }
  }

  onTapAll(tiles, (tile) =>
    withRecovery(runtime, async () => {
      if (settled || tile.disabled) return
      const { text: letter, say } = letters[Number(tile.dataset.tile)]
      if (placed.length >= target.length) {
        // Every slot is full and the word is wrong, so a spare tile has
        // nowhere to go. Silently swallowing the tap reads as a broken
        // screen; point at the one control that still does something.
        shakeEl(undoBtn)
        feedback().textContent = '↺ Undo 로 한 글자 빼요'
        return
      }
      // Every placement speaks its own sound, so a wrong word is also heard
      // as one ("tuh-aaa-sss"): the child gets the mismatch through the ear
      // as well as the eye, without the app inventing an utterance for it.
      const soundDone = speakTap(say)
      placed.push({ letter, tileIndex: tile.dataset.tile })
      tile.disabled = true
      tile.classList.add('used')
      redraw()
      const soundSlot = slots[placed.length - 1]
      const soundToken = {}
      slotSoundTokens.set(soundSlot, soundToken)
      soundSlot.classList.add('sound-active')
      const clearSoundHighlight = () => {
        if (slotSoundTokens.get(soundSlot) !== soundToken) return
        slotSoundTokens.delete(soundSlot)
        soundSlot.classList.remove('sound-active')
      }
      soundDone.then(clearSoundHighlight, clearSoundHighlight)
      feedback().textContent = ''
      if (placed.length < target.length) return
      // Slot-wise comparison, so a digraph slot ('AI') is matched whole --
      // never against a single character.
      if (!placed.every((p, i) => p.letter === target[i])) {
        rejectWord()
        return
      }
      settled = true
      slotRow.classList.add('word-complete')
      flashCorrect(area)
      // Completing the word transfers energy from its last tile to the hero.
      // Damage happens only on the subsequent hero attack.
      chargeHero(tile)
      if (beat.scored && beat.readAloud) {
        await showTransitionCountdown(whenAudioIdle())
        runAttackReadAloud(runtime, beat, beat.readAloud)
      } else {
        await waitForTransition(600)
        advanceBeat(runtime)
      }
    })
  )

  onTap(undoBtn, () => {
    if (settled) return
    undoOne()
  })
}

// ---- listen-repeat / finale ----

function renderListenRepeatBeat(runtime, beat) {
  const area = beatArea()
  let wordIndex = 0

  function showWord() {
    const { text, say } = spokenPair(beat.words[wordIndex])
    const isFinale = beat.kind === 'finale'
    const isLastWord = wordIndex + 1 >= beat.words.length
    // Finale = the stage's "big attack" moment: sell it with the shout-fx
    // burst behind the word (see .shout-fx in style.css); regular
    // listen-repeat words stay plain -- except the second finger-trace
    // moment (isFingerTraceListenRepeatBeat, see its own comment): this beat
    // has no `letter` field, only `words[]`, so the glyph to trace is
    // whatever word is currently showing (`text`, resolved above from
    // `beat.words[wordIndex]`) -- this reuses the exact same traceBoxHtml()
    // the teach/break beat uses, in the same screen slot the plain word
    // display used to occupy.
    const isTrace = !isFinale && isFingerTraceListenRepeatBeat(beat)

    // The last word is where damage actually lands (dealHit), same as the
    // choose/multiselect/drag-build "you got it right" screen -- so it gets
    // the same shout-to-ATTACK confirmation instead of a plain "I read it!"
    // tap. Reuses runAttackReadAloud() wholesale rather than re-deriving the
    // mic-listen/fallback/Next-button plumbing here. The one thing it can't
    // supply on its own is the finger-trace box (its default word display is
    // the plain shout-burst target word) -- trace beats pass that markup in
    // as an override so tracing still works right up to the attack tap.
    if (isLastWord) {
      runAttackReadAloud(
        runtime,
        beat,
        { targetText: text, say },
        isTrace ? traceBoxHtml(text) : undefined
      )
      if (isTrace) wireTraceCanvas()
      return
    }

    // Non-last words of a `finale` beat (some repeat the same word twice --
    // see chapter data's `words: ['sat', 'sat']` style entries) still get
    // the shout-fx burst: it was dropped here when the last word moved to
    // runAttackReadAloud() above, which regressed the "big attack moment"
    // presentation for every finale beat with more than one word.
    //
    // A trace beat's non-last words need the same tracing box the last word
    // gets -- audit found a 2-word blend trace (e.g. chapter 29's "손가락으로
    // S와 T를 따라 그리면서...") only ever rendered a canvas for the SECOND
    // letter; the instruction promises both, so the first has to trace too.
    const wordHtml = isFinale
      ? `<div class="target-word-wrap"><span class="shout-fx">${shoutBurst()}</span><div class="target-word">${text}</div></div>`
      : isTrace
      ? traceBoxHtml(text)
      : `<div class="target-word">${text}</div>`
    area.innerHTML = `
      <div class="beat listen-beat ${isFinale ? 'finale' : ''}">
        <div class="beat-instruction">${beat.instructionKo}</div>
        ${wordHtml}
        <button class="replay-btn" id="replay-btn">🔊 Listen</button>
        <button class="mic-btn" id="mic-btn">🎤 I read it!</button>
        <div class="beat-feedback" id="beat-feedback"></div>
      </div>
    `
    if (isTrace) wireTraceCanvas()
    speakEN(say)
    onTap(document.getElementById('replay-btn'), () => speakTap(say))
    const micBtn = document.getElementById('mic-btn')
    onTap(micBtn, withRecovery(runtime, async () => {
      micBtn.disabled = true
      document.getElementById('beat-feedback').textContent = 'Great! 🎉'
      // No speech recognition here on purpose -- see tryRecognize() in
      // audio.js. The 🎤 button is purely the child's "I read it" signal.
      // Wait for any in-flight audio (e.g. the child tapped "듣기" again
      // right before tapping the mic) so the next word's auto-play never
      // lands on top of it.
      await waitForTransition(400)
      wordIndex += 1
      showWord()
    }))
  }

  showWord()
}

// ---- shout-attack confirmation (choose / multiselect / drag-build) ----
//
// Same slot in the flow as runReadAloud() below (the "you got it right, now
// land the hit" screen) but the hit is gated on the child actually shouting,
// not on tapping a button labeled "I read it!". Deliberately a separate
// function rather than a mode flag threaded through runReadAloud(): that one
// is now match-shape's alone (see its own header comment) -- forking the
// display code was cheaper and safer than teaching the shared function a
// branch its other callers never exercised or tested, and that stayed true
// once the attack flow expanded to all three scored beat types.
//
// `readAloud` is the beat's whole `{ targetText, say? }` object, same
// display/speech split as elsewhere in this file.
//
// `wordHtml` optionally overrides the target-word markup (default: the plain
// shout-burst word display below). renderListenRepeatBeat's finger-trace
// words are the one caller that needs this -- they still need the tracing
// box, not a plain word, right up until the ATTACK tap.
function runAttackReadAloud(runtime, beat, readAloud, wordHtml) {
  if (!ownsScreen(runtime)) return
  setCombatState('charging')
  const area = beatArea()
  const { text, say } = spokenPair({
    text: readAloud.targetText,
    say: readAloud.say,
  })
  const displayHtml =
    wordHtml ||
    `<div class="target-word-wrap"><span class="shout-fx">${shoutBurst()}</span><div class="target-word">${text}</div></div>`
  area.innerHTML = `
    <div class="beat readaloud-beat attack-beat">
      <div class="beat-instruction">따라 읽고, 목소리로 응원해요!</div>
      ${displayHtml}
      <button class="replay-btn" id="replay-btn">🔊 Listen</button>
      <div class="attack-energy-cue">⚡ Energy ready</div>
      <button class="mic-btn attack-btn" id="attack-btn">⚔️ ATTACK</button>
      <button class="primary-btn attack-next-btn" id="attack-next-btn" style="display:none">Next ▶</button>
      <div class="beat-feedback" id="beat-feedback"></div>
    </div>
  `
  speakEN(say)
  onTap(document.getElementById('replay-btn'), () => speakTap(say))

  const attackBtn = document.getElementById('attack-btn')
  const nextBtn = document.getElementById('attack-next-btn')
  const feedback = () => area.querySelector('#beat-feedback')

  let settled = false // true once the hit has landed and Next is showing
  let listening = false // true while a shout window is open
  let activeController = null

  // ---- audio-playing <-> ATTACK-enabled interlock ----
  //
  // The mic must never be treated as "listening for a shout" while the
  // game's own speaker output could be running, or a loud phoneme/word
  // plays right into the analyser and gets mistaken for the child shouting
  // (CLAUDE.md's audio-queue notes -- this reuses whenAudioIdle()'s own
  // signal rather than inventing a second one). onAudioActivity() fires the
  // instant anything is QUEUED, which is earlier and more useful here than
  // waiting for it to actually start speaking.
  const syncAttackEnabled = () => {
    if (settled) return
    attackBtn.disabled = listening || !isAudioIdle()
  }
  const unsubscribeActivity = onAudioActivity(() => {
    // The child has already left this beat (map/back navigation, or a later
    // beat rendered over this one) -- this subscription outlived its screen,
    // so drop it instead of touching a detached button forever.
    if (!ownsScreen(runtime)) {
      unsubscribeActivity()
      return
    }
    syncAttackEnabled()
    // New audio starting *mid-listen* (e.g. the child tapped 🔊 Listen or a
    // villain name tag while the shout window was open) must end that
    // window right now -- being disabled during playback is not enough on
    // its own, because the window was already open before this fired.
    if (listening && activeController) activeController.cancel()
    // This newly queued item will make isAudioIdle() go true again once it
    // finishes -- re-sync then too, not just at the moment it started.
    whenAudioIdle().then(syncAttackEnabled)
  })
  syncAttackEnabled()
  // The screen's own opening speakEN(say) above was queued before the
  // listener existed to see it; give it the same "re-enable once done" pass.
  whenAudioIdle().then(syncAttackEnabled)

  const landHit = () => {
    settled = true
    unsubscribeActivity()
    const boltFlightMs = fireHeroAttack()
    const energyCue = area.querySelector('.attack-energy-cue')
    if (energyCue) energyCue.textContent = '⚡ Energy sent'
    attackBtn.disabled = true
    attackBtn.style.display = 'none'
    const feedbackEl = feedback()
    dealHit(runtime, beat, boltFlightMs, () => {
      if (feedbackEl && feedbackEl.isConnected) feedbackEl.textContent = 'Hit! 💥'
    })
    nextBtn.style.display = ''
    // Manual "Next" rather than the usual auto-advance -- the whole point of
    // this round is the child reading "I attacked" off their own action, and
    // an automatic transition right after would blur that back into "stuff
    // just happens on this screen" (explicit product decision this round).
    onTap(
      nextBtn,
      withRecovery(runtime, async () => {
        await waitForTransition(300)
        advanceBeat(runtime)
      })
    )
  }

  const startListen = () => {
    if (settled || listening || attackBtn.disabled) return
    listening = true
    syncAttackEnabled()
    const fb = feedback()
    if (fb) fb.textContent = '소리쳐봐요! 🎤'
    const controller = attemptShoutAttack({ durationMs: 1800 })
    activeController = controller
    controller.promise.then((result) => {
      if (activeController !== controller) return // superseded already
      activeController = null
      if (!ownsScreen(runtime) || !area.isConnected) return
      listening = false
      if (result === 'cancelled') {
        // Audio started mid-listen -- quiet reset, no blame on the child.
        const fb2 = feedback()
        if (fb2) fb2.textContent = ''
        syncAttackEnabled()
        return
      }
      if (result === 'timeout') {
        const fb2 = feedback()
        if (fb2) fb2.textContent = '다시 ATTACK을 눌러서 소리쳐봐요!'
        syncAttackEnabled()
        return
      }
      // 'detected' (real shout) and 'unsupported' (no mic/permission denied/
      // API missing) both land the hit here -- 'unsupported' is the required
      // silent fallback: ATTACK becomes a plain tap-to-continue button, same
      // as this screen behaved before this feature existed. The child never
      // sees a permission error or a broken control.
      landHit()
    })
  }

  onTap(attackBtn, withRecovery(runtime, async () => startListen()))
}

// ---- read-aloud confirmation (match-shape only) ----

// Takes the beat's whole `readAloud` object: { targetText, say? } -- same
// display/speech split as words[] above, keyed by targetText.
function runReadAloud(runtime, beat, readAloud) {
  if (!ownsScreen(runtime)) return
  setCombatState('charging')
  const area = beatArea()
  const { text, say } = spokenPair({
    text: readAloud.targetText,
    say: readAloud.say,
  })
  area.innerHTML = `
    <div class="beat readaloud-beat">
      <div class="beat-instruction">정답이에요! 이제 소리내어 읽어볼까요?</div>
      <div class="target-word-wrap"><span class="shout-fx">${shoutBurst()}</span><div class="target-word">${text}</div></div>
      <button class="replay-btn" id="replay-btn">🔊 Listen</button>
      <button class="mic-btn" id="mic-btn">🎤 I read it!</button>
      <div class="beat-feedback" id="beat-feedback"></div>
    </div>
  `
  speakEN(say)
  onTap(document.getElementById('replay-btn'), () => speakTap(say))
  const micBtn = document.getElementById('mic-btn')
  onTap(micBtn, withRecovery(runtime, async () => {
    micBtn.disabled = true
    // The correct option charged the hero; this tap launches its attack.
    // The hit reaction rides this bolt's arrival, so the villain flinches
    // when it is struck rather than before.
    //
    // "Hit! 💥" goes with it. It is a claim about the villain, not an
    // acknowledgement of the press (the button's own disabled state is
    // that), and announcing a hit while the bolt is still crossing the
    // screen is the same inversion in words. The node is captured rather
    // than re-queried on arrival: #beat-feedback is reused by every beat, so
    // a re-query could write this beat's text into the next beat's screen --
    // isConnected is exact, the detached node means the screen moved on.
    const feedbackEl = document.getElementById('beat-feedback')
    dealHit(runtime, beat, fireHeroAttack(), () => {
      if (feedbackEl.isConnected) feedbackEl.textContent = 'Hit! 💥'
    })
    await waitForTransition(500)
    advanceBeat(runtime)
  }))
}

// ---------- REWARD SCREEN ----------

// The three-star row is gone (QA: "별 3개 행은 어떤 의미도 없는 것 같아").
// It was unconditional -- every clear painted three lit stars -- so it carried
// no information at all, and a row of glyphs that never changes teaches a
// 5-year-old to stop reading the screen. markStageCleared() still banks a
// star count: it is the only mutation site, nothing reads progress.stars back
// yet, and a scoring rule (retries, hints used) is a plausible future feature
// that would want the field already persisted rather than back-filled.
//
// `.reward-victor` / `.reward-defeated` are the layout contract for the
// won-the-fight staging (QA: "그냥 나란히 서있네?"). The existing
// .reward-hero/.reward-villain classes stay -- they carry the current sizing.
function renderReward(runtime) {
  const { stage } = runtime
  markStageCleared(stage.id, 3)
  app.innerHTML = `
    <div class="screen reward-screen">
      <div class="reward-title">${stage.title} Clear!</div>
      <div class="reward-scene">
        <span class="reward-hero reward-victor">${heroArt(stage.hero)}</span>
        <span class="reward-bolt">⚡</span>
        <span class="reward-villain reward-defeated">${villainArt(
          stage.villain
        )}</span>
      </div>
      <div class="reward-line">You beat ${stage.villain.name}!</div>
      <div class="recap-line">${stage.recapKo}</div>
      <button class="primary-btn" id="back-to-map">◀ Back to Map</button>
    </div>
  `
  fitRecapLine()
  // recapKo now has plain English letters/words mixed into the Korean
  // explanation (deliberate -- environmental print on screen), so speaking
  // *that* string with speakKO would read the English through a Korean
  // voice. recapAudio keeps the two languages separate for speech: Korean
  // explanation first, then each English target read as its own utterance
  // (speakSequence, not one crammed string) -- both still go through the
  // shared queue, so this never overlaps whatever the last beat was saying.
  speakKO(stage.recapAudio.ko)
  speakSequence(stage.recapAudio.en, 'en-US')
  onTap(document.getElementById('back-to-map'), () => {
      const chapter = getChapterForStage(stage.id)
      renderMap(chapter.id)
    })
}

// The reward screen is the one place the app's "no scroll, ever" rule was
// broken on a real device: chapter 33's final recapKo (108 chars) wrapped to
// 6 lines and overflowed the viewport by 225px, while chapter 4's 104-char
// recapKo -- only 4 characters shorter -- wraps to 3 lines and fits with
// room to spare (measured: 432px vs 216px). Wrapping of mixed Korean/English
// text is not linear in character count, so a static font-size formula
// keyed on length (the `.beat-equation` pattern) cannot be trusted to
// predict every future recapKo's line count -- it would either undersize
// short recaps to survive a worst case that hasn't been written yet, or
// stay wrong the next time someone writes a long one. Measuring the actual
// rendered overflow after layout and shrinking until it is gone is the only
// thing that is correct for every string, not just the ones on hand today.
// Runs once per reward screen (never in a hot loop), so a handful of
// synchronous reflows cost nothing noticeable.
function fitRecapLine() {
  const recap = document.querySelector('.recap-line')
  if (!recap) return
  const de = document.documentElement
  // 28px, not the CSS clamp's existing 30/40px floor: this is a last-resort
  // safety net for text nobody has measured yet, so it is allowed to go
  // slightly smaller than the floor tuned for known content.
  const FLOOR_PX = 28
  let fontSize = parseFloat(getComputedStyle(recap).fontSize)
  for (let i = 0; i < 20 && fontSize > FLOOR_PX; i++) {
    const overflowY =
      Math.max(de.scrollHeight, document.body.scrollHeight) - window.innerHeight
    if (overflowY <= 0) break
    fontSize -= 2
    recap.style.fontSize = `${fontSize}px`
  }
}
