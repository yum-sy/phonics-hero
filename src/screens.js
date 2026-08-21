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
  isChapterCleared,
  isChapterUnlocked,
  isStageCleared,
  isStageUnlocked,
  isWorldCleared,
  isWorldUnlocked,
  markStageCleared,
  progress,
} from './state.js'
import {
  clearAudioQueue,
  speakEN,
  speakKO,
  speakSequence,
  tryRecognize,
  unlockAudio,
  whenAudioIdle,
} from './audio.js'
import { heroArt, villainArt } from './art.js'
import { wordIcon, shoutBurst } from './icons.js'

const app = document.getElementById('app')

// A single-letter tile already embosses the letter inside the icon itself
// (see icons.js's letterTile), so a second plain-text copy of the same
// glyph underneath is visual noise, not reinforcement -- per the phonics
// team, two differently-styled renderings of one letterform at once risks
// undermining the single stable template a 5-year-old is trying to form.
// Multi-letter tiles (e.g. "SAT"/"TAS"/"ATS") and picture-word options
// keep their visible label as before. The letter stays in the DOM as
// screen-reader-only text either way, for accessibility.
function optionLabelHtml(opt) {
  const isSingleLetterTile = opt.icon === 'letterTile' && opt.label.length === 1
  const cls = isSingleLetterTile ? 'option-label sr-only' : 'option-label'
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

export function renderWorldSelect() {
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
        unlocked ? '' : 'disabled aria-label="잠긴 월드"'
      }>
          <div class="chapter-card-art">${inner}</div>
          <div class="chapter-card-order">${world.title}</div>
          <div class="chapter-card-title">챕터 ${start}-${end}</div>
          ${cleared ? '<div class="chapter-card-badge">클리어! ⭐</div>' : ''}
        </button>`
    })
    .join('')

  app.innerHTML = `
    <div class="screen chapter-select-screen">
      <div class="map-header">카봇 파닉스 대작전 · 월드를 골라보세요</div>
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

export function renderChapterSelect(worldId) {
  clearAudioQueue()
  const world = getWorldById(worldId)
  const cards = world.slots
    .map(({ order, chapter }) => {
      if (!chapter) {
        // Planned chapter slot with no authored content yet -- a
        // permanently-locked placeholder, not a broken link.
        return `
          <button class="chapter-card locked" disabled aria-label="아직 준비되지 않은 챕터">
            <div class="chapter-card-art"><i class="lock">🔒</i></div>
            <div class="chapter-card-order">챕터 ${order}</div>
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
        unlocked ? '' : 'disabled aria-label="잠긴 챕터"'
      }>
          <div class="chapter-card-art">${inner}</div>
          <div class="chapter-card-order">챕터 ${chapter.order}</div>
          <div class="chapter-card-title">${unlocked ? chapter.title : '???'}</div>
          ${cleared ? '<div class="chapter-card-badge">클리어! ⭐</div>' : ''}
        </button>`
    })
    .join('')

  app.innerHTML = `
    <div class="screen chapter-select-screen">
      <button class="back-btn" id="back-to-worlds" aria-label="월드 목록으로">◀ 월드 목록</button>
      <div class="map-header">${world.title} · 챕터를 골라보세요</div>
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

export function renderMap(chapterId) {
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
        unlocked ? '' : 'disabled aria-label="잠긴 스테이지"'
      }>${inner}</button>
          <div class="stage-label">${unlocked ? stage.title : ''}</div>
          ${starRow}
        </div>`
    })
    .join('')

  app.innerHTML = `
    <div class="screen map-screen">
      <button class="back-btn" id="back-to-chapters" aria-label="챕터 목록으로">◀ 챕터 목록</button>
      <div class="map-header">챕터 ${chapter.order} · ${chapter.title}</div>
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

function renderStage(stageId) {
  clearAudioQueue()
  const stage = getStageById(stageId)
  const runtime = {
    stage,
    beatIndex: 0,
    healthMax: stageHealthMax(stage),
    hitsDealt: 0,
  }
  renderHealthShell(runtime)
  runBeat(runtime)
}

function renderHealthShell(runtime) {
  const { stage } = runtime
  app.innerHTML = `
    <div class="screen stage-screen">
      <button class="back-btn" id="exit-stage" aria-label="스테이지 나가기">◀ 나가기</button>
      <div class="battle-scene">
        <div class="villain-slot">
          <div class="nameplate">
            <div class="nameplate-name">${stage.villain.name}</div>
            <div class="health-track" role="img" aria-label="악당 체력">
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
  const { stage, beatIndex } = runtime
  if (beatIndex >= stage.beats.length) {
    renderReward(runtime)
    return
  }
  const beat = stage.beats[beatIndex]
  updateHealthBar(runtime)

  if (beat.kind === 'teach' || beat.kind === 'break') {
    renderNonScoredBeat(runtime, beat)
  } else if (beat.kind === 'choose') {
    renderChooseBeat(runtime, beat)
  } else if (beat.kind === 'choose-sequence') {
    renderChooseSequenceBeat(runtime, beat)
  } else if (beat.kind === 'multiselect') {
    renderMultiselectBeat(runtime, beat)
  } else if (beat.kind === 'drag-build') {
    renderBuildBeat(runtime, beat)
  } else if (beat.kind === 'listen-repeat' || beat.kind === 'finale') {
    renderListenRepeatBeat(runtime, beat)
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
  el.textContent = '정답! ✨'
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
function redemonstrateOption(area, beatOrStep, correctOpt) {
  if (!correctOpt) return
  speakEN(beatOrStep.promptAudio || optionSpeech(correctOpt))
  pulseHint(area.querySelector(`[data-id="${correctOpt.id}"]`))
}

// Re-demonstrates the next needed letter in a drag-build round: speaks its
// sound and pulses a still-available tile showing it. `beat.target` only
// ever carries plain letterforms, so the sound has to be looked back up in
// the round's normalized tile list; duplicate tiles of one letterform all
// share that letterform's sound, so the first match is always the right
// one, and any still-enabled tile is an equally valid thing to point at.
function redemonstrateLetterTile(area, letters, letter) {
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
  const play = () => {
    playPromise = speakSequence(beat.repeatAudio || [], 'en-US')
    return playPromise
  }
  play()
  const replayBtn = document.getElementById('replay-btn')
  const continueBtn = document.getElementById('continue-btn')
  if (replayBtn) replayBtn.addEventListener('click', play)
  if (continueBtn)
    continueBtn.addEventListener('click', async () => {
      // Acknowledge the tap immediately (don't leave it feeling unresponsive)
      // even though we wait for any in-flight teach/break audio to finish
      // before actually moving to the next beat, so its own auto-played
      // audio never lands on top of this one's tail end.
      continueBtn.disabled = true
      await playPromise
      await whenAudioIdle()
      advanceBeat(runtime)
    })
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
    <button class="replay-btn" id="replay-btn">🔊 다시 듣기</button>
    <button class="primary-btn" id="continue-btn">다음 ▶</button>
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
        <div class="boss-intro" id="boss-intro" role="button" tabindex="0" aria-label="합체 연출 넘기기" style="cursor:pointer">
          <div class="boss-intro-label">합체!</div>
          <div class="boss-intro-robots">${robotsHtml}</div>
          <div class="boss-intro-flash"></div>
          <div class="boss-intro-hero">${heroArt(runtime.stage.hero)}</div>
          <div class="beat-instruction" style="font-size:20px;opacity:0.55">화면을 탭하면 넘어가요</div>
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
    ? `<button class="replay-btn" id="replay-btn">🔊 소리 듣기</button>`
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
    const playPrompt = () => speakEN(beat.promptAudio)
    playPrompt()
    document.getElementById('replay-btn').addEventListener('click', playPrompt)
  }

  const wrongStreak = makeWrongStreakTracker()

  area.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const opt = beat.options.find((o) => o.id === btn.dataset.id)
      speakEN(optionSpeech(opt))
      if (opt.correct) {
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
    })
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
        <button class="replay-btn" id="replay-btn">🔊 소리 듣기</button>
        <div class="options-grid">${optionsHtml}</div>
        <div class="beat-feedback" id="beat-feedback"></div>
      </div>
    `
    const playPrompt = () => speakEN(step.promptAudio)
    playPrompt()
    document.getElementById('replay-btn').addEventListener('click', playPrompt)

    // Fresh streak per step -- each step is effectively its own mini
    // question, so 2 wrong taps within *that* step trigger the hint.
    const wrongStreak = makeWrongStreakTracker()

    area.querySelectorAll('.option-btn').forEach((btn) => {
      btn.addEventListener('click', async () => {
        const opt = step.options.find((o) => o.id === btn.dataset.id)
        speakEN(optionSpeech(opt))
        if (opt.correct) {
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
      })
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

  area.querySelectorAll('.option-btn').forEach((btn) => {
    btn.addEventListener('click', async () => {
      const opt = beat.options.find((o) => o.id === btn.dataset.id)
      speakEN(optionSpeech(opt))
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
    })
  })
}

// ---- drag-build (tap-to-place, touch-friendly) ----

function renderBuildBeat(runtime, beat) {
  const area = beatArea()
  const target = beat.target.split('')
  const slotsHtml = target
    .map((_, i) => `<div class="build-slot" data-slot="${i}"></div>`)
    .join('')
  // data-letter stays the plain letterform: it is what gets matched against
  // `beat.target` and what redemonstrateLetterTile() searches by. The tile's
  // sound is read from this list by tile index instead, so blending a word
  // sounds out "sss-aaa-t" rather than spelling "ess-ay-tee".
  const letters = beat.letters.map(spokenPair)
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
      <button class="secondary-btn" id="clear-btn">지우기</button>
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

  tiles.forEach((tile) => {
    tile.addEventListener('click', async () => {
      if (tile.disabled) return
      const { text: letter, say } = letters[Number(tile.dataset.tile)]
      const nextIndex = placed.length
      if (nextIndex >= target.length) return
      speakEN(say)
      if (letter === target[nextIndex]) {
        placed.push({ letter, tileIndex: tile.dataset.tile })
        tile.disabled = true
        tile.classList.add('used')
        redraw()
        if (placed.length === target.length) {
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
    })
  })

  document.getElementById('clear-btn').addEventListener('click', () => {
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
        <button class="replay-btn" id="replay-btn">🔊 듣기</button>
        <button class="mic-btn" id="mic-btn">🎤 다 읽었어요!</button>
        <div class="beat-feedback" id="beat-feedback"></div>
      </div>
    `
    const play = () => speakEN(say)
    play()
    document.getElementById('replay-btn').addEventListener('click', play)
    document.getElementById('mic-btn').addEventListener('click', async () => {
      document.getElementById('mic-btn').disabled = true
      document.getElementById('beat-feedback').textContent = '잘했어요! 🎉'
      // Best-effort background listen; never blocks progress either way.
      // Matches against the on-screen word, not `say`: the recognizer
      // scores against real words, so a phoneme spelling like "iii" could
      // never match whatever the child actually says.
      tryRecognize(text)
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
    })
  }

  showWord()
}

// ---- read-aloud confirmation (shared by choose / multiselect / drag-build) ----

// Takes the beat's whole `readAloud` object: { targetText, say? } -- same
// display/speech split as words[] above, keyed by targetText.
function runReadAloud(runtime, beat, readAloud) {
  const area = beatArea()
  const { text, say } = spokenPair({
    text: readAloud.targetText,
    say: readAloud.say,
  })
  area.innerHTML = `
    <div class="beat readaloud-beat">
      <div class="beat-instruction">정답이에요! 이제 소리내어 읽어볼까요?</div>
      <div class="target-word-wrap"><span class="shout-fx">${shoutBurst()}</span><div class="target-word">${text}</div></div>
      <button class="replay-btn" id="replay-btn">🔊 듣기</button>
      <button class="mic-btn" id="mic-btn">🎤 다 읽었어요!</button>
      <div class="beat-feedback" id="beat-feedback"></div>
    </div>
  `
  const play = () => speakEN(say)
  play()
  document.getElementById('replay-btn').addEventListener('click', play)
  document.getElementById('mic-btn').addEventListener('click', async () => {
    document.getElementById('mic-btn').disabled = true
    tryRecognize(text)
    dealHit(runtime, beat)
    document.getElementById('beat-feedback').textContent = '명중! 💥'
    await waitForTransition(500)
    advanceBeat(runtime)
  })
}

// ---------- REWARD SCREEN ----------

function renderReward(runtime) {
  const { stage } = runtime
  markStageCleared(stage.id, 3)
  app.innerHTML = `
    <div class="screen reward-screen">
      <div class="reward-title">${stage.title} 클리어!</div>
      <div class="reward-scene">
        <span class="reward-hero">${heroArt(stage.hero)}</span>
        <span class="reward-bolt">⚡</span>
        <span class="reward-villain">${villainArt(stage.villain)}</span>
      </div>
      <div class="reward-line">${stage.villain.name}을(를) 물리쳤어요!</div>
      <div class="stars-row">
        <span class="star on">★</span>
        <span class="star on">★</span>
        <span class="star on">★</span>
      </div>
      <div class="recap-line">${stage.recapKo}</div>
      <button class="primary-btn" id="back-to-map">맵으로 돌아가기</button>
    </div>
  `
  speakKO(stage.recapKo)
  document
    .getElementById('back-to-map')
    .addEventListener('click', () => {
      const chapter = getChapterForStage(stage.id)
      renderMap(chapter.id)
    })
}
