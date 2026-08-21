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
import {
  clearCheckpoint,
  getCheckpoint,
  isChapterCleared,
  isChapterUnlocked,
  isStageCleared,
  isStageUnlocked,
  isWorldCleared,
  isWorldUnlocked,
  markStageCleared,
  progress,
  saveCheckpoint,
} from './state.js'
import {
  clearAudioQueue,
  speakEN,
  speakKO,
  speakSequence,
  speakTap,
  unlockAudio,
  whenAudioIdle,
} from './audio.js'
import { heroArt, villainArt } from './art.js'
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
    document.getElementById('retry-beat').addEventListener('click', retry)
    document
      .getElementById('failure-escape')
      .addEventListener('click', () => renderWorldSelect())
  }
}

export function renderWorldSelect() {
  runScreen(worldSelectScreen, renderWorldSelect)
}

export function renderChapterSelect(worldId) {
  runScreen(
    () => chapterSelectScreen(worldId),
    () => renderChapterSelect(worldId)
  )
}

export function renderMap(chapterId) {
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
function optionLabelHtml(opt) {
  const isLetterformTile = opt.icon === 'letterTile' && opt.label.length <= 2
  const cls = isLetterformTile ? 'option-label sr-only' : 'option-label'
  return `<span class="${cls}">${opt.label}</span>`
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

// Waits for both a minimum visual-feedback delay AND the audio queue to
// fully drain, whichever takes longer -- so a transition never cuts off
// in-flight speech, but also never feels laggier than it needs to when
// audio finishes quickly (e.g. speechSynthesis unavailable).
function waitForTransition(minDelayMs) {
  return Promise.all([whenAudioIdle(), sleep(minDelayMs)])
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
      const inner =
        unlocked && firstChapter
          ? villainArt(
              firstChapter.stages[firstChapter.stages.length - 1].villain
            )
          : '<i class="lock">🔒</i>'
      const [start, end] = world.chapterRange
      return `
        <button class="${cls}" data-world="${world.id}" ${
        unlocked ? '' : 'disabled aria-label="Locked world"'
      }>
          <div class="chapter-card-art">${inner}</div>
          <div class="chapter-card-order">${world.title}</div>
          <div class="chapter-card-title">Chapters ${start}-${end}</div>
          ${cleared ? '<div class="chapter-card-badge">Clear! ⭐</div>' : ''}
        </button>`
    })
    .join('')

  app.innerHTML = `
    <div class="screen chapter-select-screen">
      <div class="map-header">Carbot Phonics · Pick a World</div>
      <div class="chapter-grid">${cards}</div>
    </div>
  `

  app.querySelectorAll('.chapter-card[data-world]').forEach((btn) => {
    btn.addEventListener('click', () => {
      unlockAudio()
      renderChapterSelect(btn.dataset.world)
    })
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
      const inner = unlocked
        ? villainArt(chapter.stages[chapter.stages.length - 1].villain)
        : '<i class="lock">🔒</i>'
      return `
        <button class="${cls}" data-chapter="${chapter.id}" ${
        unlocked ? '' : 'disabled aria-label="Locked chapter"'
      }>
          <div class="chapter-card-art">${inner}</div>
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

  document
    .getElementById('back-to-worlds')
    .addEventListener('click', renderWorldSelect)

  app.querySelectorAll('.chapter-card[data-chapter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      unlockAudio()
      renderMap(btn.dataset.chapter)
    })
  })
}

// ---------- MAP SCREEN ----------

function mapScreen(chapterId) {
  beginScreen()
  clearAudioQueue()
  const chapter = getChapterById(chapterId)
  const chapterStages = chapter.stages
  const nodes = chapterStages
    .map((stage) => {
      const cleared = isStageCleared(stage.id)
      const unlocked = isStageUnlocked(chapterStages, stage.id)
      const stars = progress.stars[stage.id] || 0
      let cls = 'stage-node'
      if (stage.chapterBoss) cls += ' boss'
      if (cleared) cls += ' cleared'
      if (!unlocked) cls += ' locked'
      const inner = unlocked
        ? stage.chapterBoss
          ? villainArt(stage.villain)
          : String(stage.order)
        : '<i class="lock">🔒</i>'
      const starRow = unlocked
        ? `<div class="stars">${[1, 2, 3]
            .map((n) => `<span class="${n <= stars ? 'star on' : 'star'}">★</span>`)
            .join('')}</div>`
        : ''
      return `
        <div class="stage-node-wrap">
          <button class="${cls}" data-stage="${stage.id}" ${
        unlocked ? '' : 'disabled aria-label="Locked stage"'
      }>${inner}</button>
          <div class="stage-label">${unlocked ? stage.title : ''}</div>
          ${starRow}
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

  document
    .getElementById('back-to-chapters')
    .addEventListener('click', () => {
      const world = getWorldForChapterOrder(chapter.order)
      renderChapterSelect(world.id)
    })

  app.querySelectorAll('.stage-node[data-stage]').forEach((btn) => {
    btn.addEventListener('click', () => {
      unlockAudio()
      renderStage(btn.dataset.stage)
    })
  })
}

// ---------- STAGE SCREEN ----------

function stageScreen(stageId) {
  clearAudioQueue()
  const stage = getStageById(stageId)
  const runtime = {
    stage,
    nav: beginScreen(),
    beatIndex: 0,
    healthMax: stageHealthMax(stage),
    hitsDealt: 0,
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
      <button class="back-btn" id="exit-stage" aria-label="Exit stage">◀ Exit</button>
      <div class="battle-scene">
        <div class="villain-slot">
          <div class="nameplate">
            <div class="nameplate-name">${stage.villain.name}</div>
            <div class="health-track" role="img" aria-label="Villain health">
              <div class="health-fill" id="health-fill" style="width:100%"></div>
            </div>
          </div>
          <div class="villain-sprite" id="villain-sprite">${villainArt(
            stage.villain
          )}</div>
        </div>
        <div class="vs-mark">⚡</div>
        <div class="hero-slot">
          <div class="hero-sprite" id="hero-sprite">${heroArt(
            stage.hero
          )}</div>
        </div>
      </div>
      <div id="beat-area" class="beat-area"></div>
    </div>
  `

  document.getElementById('exit-stage').addEventListener('click', () => {
    // Leaving on purpose means "start this one over next time".
    clearCheckpoint()
    const chapter = getChapterForStage(stage.id)
    renderMap(chapter.id)
  })
}

function updateHealthBar(runtime) {
  const fill = document.getElementById('health-fill')
  if (!fill) return
  const remaining = Math.max(0, runtime.healthMax - runtime.hitsDealt)
  const pct = Math.round((remaining / runtime.healthMax) * 100)
  fill.style.width = pct + '%'
}

function pulseBattle() {
  const villain = document.getElementById('villain-sprite')
  const hero = document.getElementById('hero-sprite')
  if (!villain || !hero) return
  villain.classList.remove('hit-shake')
  hero.classList.remove('hero-lunge')
  void villain.offsetWidth
  villain.classList.add('hit-shake')
  hero.classList.add('hero-lunge')
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
    updateHealthBar(runtime)

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
  } catch (e) {
    renderBeatFailure(runtime, e)
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
  document
    .getElementById('retry-beat')
    .addEventListener('click', () => runBeat(runtime))
  document.getElementById('failure-escape').addEventListener('click', () => {
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

function dealHit(runtime, beat) {
  runtime.hitsDealt = Math.min(runtime.healthMax, runtime.hitsDealt + (beat.hits || 1))
  updateHealthBar(runtime)
  pulseBattle()
}

function flashCorrect(container) {
  const el = document.createElement('div')
  el.className = 'flash-correct'
  el.textContent = 'Correct! ✨'
  container.appendChild(el)
  setTimeout(() => el.remove(), 900)
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
  if (replayBtn) replayBtn.addEventListener('click', play)
  if (continueBtn)
    continueBtn.addEventListener('click', withRecovery(runtime, async () => {
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

function renderNonScoredBeat(runtime, beat) {
  const area = beatArea()
  const visual =
    beat.art === 'hero'
      ? `<div class="beat-avatar">${heroArt(runtime.stage.hero)}</div>`
      : `<div class="beat-emoji">${beat.emoji || ''}</div>`

  const teachInner = `
    <div class="beat-instruction">${beat.instructionKo}</div>
    ${visual}
    ${beat.letter ? `<div class="big-letter">${beat.letter}</div>` : ''}
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
    // Stage 1 is the chapter's tutorial and usually reuses the stage-2 hero,
    // which would show the same mini-bot twice -- so the combination lineup
    // is stages 2-4. Chapters with fewer authored stages keep whatever
    // non-boss heroes they do have rather than rendering an empty lineup.
    const nonBossStages = chapter.stages.filter((s) => !s.chapterBoss)
    const lineup = (
      nonBossStages.length > 3 ? nonBossStages.slice(1) : nonBossStages
    ).slice(0, 3)
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
        <div class="boss-intro" id="boss-intro" role="button" tabindex="0" aria-label="Skip intro" style="cursor:pointer">
          <div class="boss-intro-label">UNITE!</div>
          <div class="boss-intro-robots">${robotsHtml}</div>
          <div class="boss-intro-flash"></div>
          <div class="boss-intro-hero">${heroArt(runtime.stage.hero)}</div>
          <div class="boss-intro-skip">화면을 탭하면 넘어가요</div>
        </div>
        <div class="teach-content" id="teach-content" style="display:none">${teachInner}</div>
      </div>
    `

    // Reveal the teach content either when the animation finishes or as soon
    // as the child taps the intro, whichever comes first -- so the timeout
    // and the tap must not both run wireTeachButtons (that would double up
    // the auto-played teach audio). No audio is in flight yet at this point
    // (wireTeachButtons is what starts it), so skipping early can't cut
    // any speech off.
    const intro = document.getElementById('boss-intro')
    let revealed = false
    const revealTeach = () => {
      if (revealed) return
      const content = document.getElementById('teach-content')
      // The player may have navigated away mid-animation.
      if (!content) return
      revealed = true
      clearTimeout(introTimer)
      if (intro) intro.remove()
      content.style.display = ''
      wireTeachButtons(beat, runtime)
    }
    const introTimer = setTimeout(revealTeach, 1650)
    if (intro) intro.addEventListener('click', revealTeach)
    return
  }

  area.innerHTML = `
    <div class="beat teach-beat">
      ${teachInner}
    </div>
  `
  wireTeachButtons(beat, runtime)
}

// ---- choose ----

function renderChooseBeat(runtime, beat) {
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
  const replayHtml = beat.promptAudio
    ? `<button class="replay-btn" id="replay-btn">🔊 Listen</button>`
    : ''

  area.innerHTML = `
    <div class="beat choose-beat">
      <div class="beat-instruction">${beat.instructionKo}</div>
      ${promptHtml}
      ${replayHtml}
      <div class="options-grid">${optionsHtml}</div>
      <div class="beat-feedback" id="beat-feedback"></div>
    </div>
  `

  if (beat.promptAudio) {
    speakEN(beat.promptAudio)
    document
      .getElementById('replay-btn')
      .addEventListener('click', () => speakTap(beat.promptAudio))
  }

  const wrongStreak = makeWrongStreakTracker()
  // The correct answer is acted on after an await, so a 5-year-old's second
  // excited tap used to run the whole branch again and advance twice --
  // skipping a beat outright, and with it any damage that beat was supposed
  // to deal (a boss whose health can then never reach 0). Wrong taps stay
  // unlimited: the no-fail rule is about retries, not double-fires.
  let settled = false

  area.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', withRecovery(runtime, async () => {
      if (settled) return
      const opt = beat.options.find((o) => o.id === btn.dataset.id)
      speakTap(optionSpeech(opt))
      if (opt.correct) {
        settled = true
        flashCorrect(area)
        if (beat.scored && beat.readAloud) {
          await whenAudioIdle()
          runReadAloud(runtime, beat, beat.readAloud)
        } else {
          await waitForTransition(600)
          advanceBeat(runtime)
        }
      } else {
        shakeEl(btn)
        document.getElementById('beat-feedback').textContent =
          '다시 들어볼까요?'
        if (wrongStreak.registerWrong()) {
          const correct = beat.options.find((o) => o.correct)
          setTimeout(() => redemonstrateOption(area, beat, correct), 1200)
        }
      }
    }))
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
      <div class="beat-feedback" id="beat-feedback"></div>
    </div>
  `

  const wrongStreak = makeWrongStreakTracker()
  // Same double-fire guard as choose -- see the comment there.
  let settled = false

  area.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', withRecovery(runtime, async () => {
      if (settled) return
      const opt = beat.options.find((o) => o.id === btn.dataset.id)
      // opt.label, deliberately not optionSpeech(opt) -- see block comment above.
      speakTap(opt.label)
      if (opt.correct) {
        settled = true
        flashCorrect(area)
        if (beat.scored && beat.readAloud) {
          await whenAudioIdle()
          runReadAloud(runtime, beat, beat.readAloud)
        } else {
          await waitForTransition(600)
          advanceBeat(runtime)
        }
      } else {
        shakeEl(btn)
        // "Listen again?" would be nonsense here -- nothing was played --
        // so this round gets its own look-again phrasing rather than
        // choose's "들어볼까요?".
        document.getElementById('beat-feedback').textContent = '다시 봐볼까요?'
        if (wrongStreak.registerWrong()) {
          const correct = beat.options.find((o) => o.correct)
          setTimeout(() => redemonstrateShapeOption(area, correct), 1200)
        }
      }
    }))
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
          ${optionLabelHtml(opt)}
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
        <div class="beat-feedback" id="beat-feedback"></div>
      </div>
    `
    speakEN(step.promptAudio)
    document
      .getElementById('replay-btn')
      .addEventListener('click', () => speakTap(step.promptAudio))

    // Fresh streak per step -- each step is effectively its own mini
    // question, so 2 wrong taps within *that* step trigger the hint.
    const wrongStreak = makeWrongStreakTracker()
    // Per-step lock: a double tap on the right answer would otherwise skip a
    // step, or on the last step deal its damage twice and skip the next beat.
    let settled = false

    area.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', withRecovery(runtime, async () => {
        if (settled) return
        const opt = step.options.find((o) => o.id === btn.dataset.id)
        speakTap(optionSpeech(opt))
        if (opt.correct) {
          settled = true
          flashCorrect(area)
          stepIndex += 1
          if (stepIndex < beat.steps.length) {
            await waitForTransition(500)
            showStep()
          } else {
            dealHit(runtime, beat)
            await waitForTransition(500)
            advanceBeat(runtime)
          }
        } else {
          shakeEl(btn)
          document.getElementById('beat-feedback').textContent =
            '다시 들어볼까요?'
          if (wrongStreak.registerWrong()) {
            const correct = step.options.find((o) => o.correct)
            setTimeout(() => redemonstrateOption(area, step, correct), 1200)
          }
        }
      }))
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
        ${optionLabelHtml(opt)}
      </button>`
    )
    .join('')

  area.innerHTML = `
    <div class="beat multiselect-beat">
      <div class="beat-instruction">${beat.instructionKo}</div>
      <div class="options-grid">${optionsHtml}</div>
      <div class="beat-feedback" id="beat-feedback"></div>
    </div>
  `

  const correctIds = new Set(
    beat.options.filter((o) => o.correct).map((o) => o.id)
  )
  const picked = new Set()
  const wrongStreak = makeWrongStreakTracker()
  let settled = false

  area.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', withRecovery(runtime, async () => {
      if (settled) return
      const opt = beat.options.find((o) => o.id === btn.dataset.id)
      speakTap(optionSpeech(opt))
      if (opt.correct) {
        if (picked.has(opt.id)) {
          picked.delete(opt.id)
          btn.classList.remove('selected')
          document.getElementById('beat-feedback').textContent = ''
          return
        }
        picked.add(opt.id)
        btn.classList.add('selected')
        if (picked.size === correctIds.size) {
          settled = true
          flashCorrect(area)
          await whenAudioIdle()
          runReadAloud(runtime, beat, beat.readAloud)
        }
      } else {
        shakeEl(btn)
        document.getElementById('beat-feedback').textContent =
          '다시 골라볼까요?'
        if (wrongStreak.registerWrong()) {
          const remaining = beat.options.find(
            (o) => o.correct && !picked.has(o.id)
          )
          setTimeout(() => redemonstrateOption(area, beat, remaining), 1200)
        }
      }
    }))
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
  const tiles = area.querySelectorAll('.letter-tile')
  const wrongStreak = makeWrongStreakTracker()

  function redraw() {
    slots.forEach((slot, i) => {
      slot.textContent = placed[i] ? placed[i].letter : ''
    })
  }

  // Set once the word is complete: the tiles are all disabled by then, but
  // 지우기 stays tappable during the await and would otherwise re-arm the
  // round while the transition to the next beat was already under way.
  let settled = false

  tiles.forEach((tile) => {
    tile.addEventListener('click', withRecovery(runtime, async () => {
      if (settled || tile.disabled) return
      const { text: letter, say } = letters[Number(tile.dataset.tile)]
      const nextIndex = placed.length
      if (nextIndex >= target.length) return
      speakTap(say)
      if (letter === target[nextIndex]) {
        placed.push({ letter, tileIndex: tile.dataset.tile })
        tile.disabled = true
        tile.classList.add('used')
        redraw()
        if (placed.length === target.length) {
          settled = true
          flashCorrect(area)
          if (beat.scored && beat.readAloud) {
            await whenAudioIdle()
            runReadAloud(runtime, beat, beat.readAloud)
          } else {
            await waitForTransition(600)
            advanceBeat(runtime)
          }
        }
      } else {
        shakeEl(tile)
        document.getElementById('beat-feedback').textContent =
          '순서를 다시 생각해볼까요?'
        if (wrongStreak.registerWrong()) {
          const neededLetter = target[placed.length]
          setTimeout(
            () => redemonstrateLetterTile(area, letters, neededLetter),
            1200
          )
        }
      }
    }))
  })

  document.getElementById('clear-btn').addEventListener('click', () => {
    if (settled) return
    placed = []
    tiles.forEach((t) => {
      t.disabled = false
      t.classList.remove('used')
    })
    redraw()
    document.getElementById('beat-feedback').textContent = ''
  })
}

// ---- listen-repeat / finale ----

function renderListenRepeatBeat(runtime, beat) {
  const area = beatArea()
  let wordIndex = 0

  function showWord() {
    const { text, say } = spokenPair(beat.words[wordIndex])
    const isFinale = beat.kind === 'finale'
    // Finale = the stage's "big attack" moment: sell it with the shout-fx
    // burst behind the word (see .shout-fx in style.css); regular
    // listen-repeat words stay plain.
    const wordHtml = isFinale
      ? `<div class="target-word-wrap"><span class="shout-fx">${shoutBurst()}</span><div class="target-word">${text}</div></div>`
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
    speakEN(say)
    document
      .getElementById('replay-btn')
      .addEventListener('click', () => speakTap(say))
    const micBtn = document.getElementById('mic-btn')
    micBtn.addEventListener('click', withRecovery(runtime, async () => {
      micBtn.disabled = true
      document.getElementById('beat-feedback').textContent = 'Great! 🎉'
      // No speech recognition here on purpose -- see tryRecognize() in
      // audio.js. The 🎤 button is purely the child's "I read it" signal.
      // Wait for any in-flight audio (e.g. the child tapped "듣기" again
      // right before tapping the mic) so the next word's auto-play never
      // lands on top of it.
      await waitForTransition(400)
      wordIndex += 1
      if (wordIndex < beat.words.length) {
        showWord()
      } else {
        flashCorrect(area)
        dealHit(runtime, beat)
        await waitForTransition(500)
        advanceBeat(runtime)
      }
    }))
  }

  showWord()
}

// ---- read-aloud confirmation (shared by choose / multiselect / drag-build) ----

// Takes the beat's whole `readAloud` object: { targetText, say? } -- same
// display/speech split as words[] above, keyed by targetText.
function runReadAloud(runtime, beat, readAloud) {
  if (!ownsScreen(runtime)) return
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
  document
    .getElementById('replay-btn')
    .addEventListener('click', () => speakTap(say))
  const micBtn = document.getElementById('mic-btn')
  micBtn.addEventListener('click', withRecovery(runtime, async () => {
    micBtn.disabled = true
    dealHit(runtime, beat)
    document.getElementById('beat-feedback').textContent = 'Hit! 💥'
    await waitForTransition(500)
    advanceBeat(runtime)
  }))
}

// ---------- REWARD SCREEN ----------

function renderReward(runtime) {
  const { stage } = runtime
  markStageCleared(stage.id, 3)
  app.innerHTML = `
    <div class="screen reward-screen">
      <div class="reward-title">${stage.title} Clear!</div>
      <div class="reward-scene">
        <span class="reward-hero">${heroArt(stage.hero)}</span>
        <span class="reward-bolt">⚡</span>
        <span class="reward-villain">${villainArt(stage.villain)}</span>
      </div>
      <div class="reward-line">You beat ${stage.villain.name}!</div>
      <div class="stars-row">
        <span class="star on">★</span>
        <span class="star on">★</span>
        <span class="star on">★</span>
      </div>
      <div class="recap-line">${stage.recapKo}</div>
      <button class="primary-btn" id="back-to-map">◀ Back to Map</button>
    </div>
  `
  // recapKo now has plain English letters/words mixed into the Korean
  // explanation (deliberate -- environmental print on screen), so speaking
  // *that* string with speakKO would read the English through a Korean
  // voice. recapAudio keeps the two languages separate for speech: Korean
  // explanation first, then each English target read as its own utterance
  // (speakSequence, not one crammed string) -- both still go through the
  // shared queue, so this never overlaps whatever the last beat was saying.
  speakKO(stage.recapAudio.ko)
  speakSequence(stage.recapAudio.en, 'en-US')
  document
    .getElementById('back-to-map')
    .addEventListener('click', () => {
      const chapter = getChapterForStage(stage.id)
      renderMap(chapter.id)
    })
}
