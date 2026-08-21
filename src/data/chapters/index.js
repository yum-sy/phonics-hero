// Combines every chapter's data into the shapes the rest of the app needs:
//   - `chapters`: ordered list of { id, order, title, stages }
//   - `stages`: flat list of every stage across every chapter, in play order
//     (kept flat because state.js's isStageUnlocked() does a simple
//     "is the previous stage in this array cleared" check)
//   - `worlds`: chapters grouped into "worlds" of WORLD_SIZE (matching the
//     curriculum's 7-chapter style-cycle rotation), for the world-select
//     screen -- see below.
//
// To add chapter N: create ./chapter-NN.js exporting `chapterN` in the same
// shape as chapter-01.js (id, order, title, stages: [...]), then add it to
// the `chapters` array below, in order. Nothing else needs to change --
// stages.js, screens.js and state.js all consume `chapters`/`stages`/`worlds`
// from here and don't care how many chapters exist.

import { chapter1 } from './chapter-01.js'
import { chapter2 } from './chapter-02.js'

export const chapters = [chapter1, chapter2]

export const stages = chapters.flatMap((c) => c.stages)

// The curriculum is planned as 33 chapters total, cycling through 7
// character styles per world (robot -> superhero -> dinosaur -> platformer
// -> dark-vigilante -> jet-pilot -> mecha, then repeat). Only `chapters`
// above actually has authored content right now; `worlds` below still
// enumerates every planned chapter *slot* so the world/chapter-select
// screens can render a locked "???" placeholder card for chapters that
// don't exist yet, instead of the grid just silently having fewer chapters
// than the curriculum plan. When new chapters are authored and added to
// `chapters`, their slot here automatically stops being a placeholder --
// nothing in this file needs to change.
export const WORLD_SIZE = 7
export const TOTAL_PLANNED_CHAPTERS = 33

export const worlds = (() => {
  const totalWorlds = Math.ceil(TOTAL_PLANNED_CHAPTERS / WORLD_SIZE)
  const list = []
  for (let w = 0; w < totalWorlds; w++) {
    const startOrder = w * WORLD_SIZE + 1
    const endOrder = Math.min(startOrder + WORLD_SIZE - 1, TOTAL_PLANNED_CHAPTERS)
    const slots = []
    for (let order = startOrder; order <= endOrder; order++) {
      slots.push({
        order,
        // null until that chapter number has real authored data
        chapter: chapters.find((c) => c.order === order) || null,
      })
    }
    list.push({
      id: `world-${w + 1}`,
      order: w + 1,
      title: `월드 ${w + 1}`,
      chapterRange: [startOrder, endOrder],
      slots,
    })
  }
  return list
})()

export function getChapterById(chapterId) {
  return chapters.find((c) => c.id === chapterId)
}

export function getChapterForStage(stageId) {
  return chapters.find((c) => c.stages.some((s) => s.id === stageId))
}

export function getStageById(id) {
  return stages.find((s) => s.id === id)
}

export function stageHealthMax(stage) {
  return stage.beats
    .filter((b) => b.scored)
    .reduce((sum, b) => sum + (b.hits || 1), 0)
}

export function getWorldById(worldId) {
  return worlds.find((w) => w.id === worldId)
}

export function getWorldForChapterOrder(order) {
  return worlds.find(
    (w) => order >= w.chapterRange[0] && order <= w.chapterRange[1]
  )
}

// ---------- dev-only data contract validation ----------
// Every renderer in screens.js reaches dealHit() one of two ways: choose /
// multiselect / drag-build only pay out through runReadAloud(), which they
// enter when `beat.scored && beat.readAloud`, while choose-sequence /
// listen-repeat / finale always pay out. So a scored choose or drag-build
// with no readAloud never lands a hit -- the health bar can never empty and
// the stage just quietly has no climax -- and a scored multiselect reads
// beat.readAloud.targetText unguarded and throws. Neither is obvious while
// authoring, and there are 31 more chapters to write, so everything the
// renderers assume about this data is asserted here.

// Sound notation ('sss', 'aaa') vs chopped stops ('t-t-t'): fine to speak,
// never correct to *display* -- see the 표시/발화 rule in chapter-01.js.
const SOUND_NOTATION = /^(.)\1+$/i
const CHOPPED_NOTATION = /-/

// Kinds whose renderer deals its hit unconditionally; every other scored kind
// needs a readAloud to have any damage path at all.
const SELF_PAYING_KINDS = new Set(['choose-sequence', 'listen-repeat', 'finale'])
const NEEDS_READ_ALOUD = new Set(['choose', 'multiselect', 'drag-build'])
const CHARACTER_KEYS = new Set(['name', 'style'])

export function validateChapters(chapterList = chapters, iconKeys = null) {
  const problems = []
  const stageIds = new Map()
  const beatIds = new Map()

  for (const chapter of chapterList) {
    const bosses = chapter.stages.filter((s) => s.chapterBoss)
    if (bosses.length !== 1) {
      problems.push(`${chapter.id}: chapterBoss 스테이지가 ${bosses.length}개 (정확히 1개)`)
    }

    for (const stage of chapter.stages) {
      const where = `${chapter.id}/${stage.id}`
      if (stageIds.has(stage.id)) {
        problems.push(`stage id 중복: '${stage.id}' (${stageIds.get(stage.id)}, ${chapter.id})`)
      }
      stageIds.set(stage.id, chapter.id)

      for (const role of ['hero', 'villain']) {
        const character = stage[role]
        if (!character || !character.name) {
          problems.push(`${where}: ${role}.name 없음`)
          continue
        }
        const extra = Object.keys(character).filter((k) => !CHARACTER_KEYS.has(k))
        if (extra.length) {
          problems.push(
            `${where}: ${role} 에 name/style 외의 키 [${extra.join(', ')}] -- 색·외형은 art.js 소유`
          )
        }
      }

      // Text the child actually sees on screen.
      const displayed = []
      let reachableHits = 0

      for (const beat of stage.beats) {
        const at = `${where}/${beat.id}`
        if (beatIds.has(beat.id)) {
          problems.push(`beat id 중복: '${beat.id}' (${beatIds.get(beat.id)}, ${stage.id})`)
        }
        beatIds.set(beat.id, stage.id)

        if (beat.scored) {
          if (typeof beat.hits !== 'number' || beat.hits < 1) {
            problems.push(`${at}: scored beat 인데 hits 가 양수가 아님 (${beat.hits})`)
          }
          const hasReadAloud = Boolean(beat.readAloud && beat.readAloud.targetText)
          if (NEEDS_READ_ALOUD.has(beat.kind) && !hasReadAloud) {
            problems.push(
              `${at}: scored ${beat.kind} 에 readAloud.targetText 없음 -- ` +
                (beat.kind === 'multiselect'
                  ? '렌더 시 크래시'
                  : '데미지가 영원히 안 들어감 (체력바가 0에 도달 못함)')
            )
          } else if (SELF_PAYING_KINDS.has(beat.kind) || hasReadAloud) {
            reachableHits += beat.hits || 1
          }
        }

        const optionGroups = beat.options
          ? [beat.options]
          : beat.steps
          ? beat.steps.map((s) => s.options)
          : []
        for (const options of optionGroups) {
          const correct = options.filter((o) => o.correct).length
          if (beat.kind === 'multiselect') {
            if (correct < 2) problems.push(`${at}: multiselect 정답이 ${correct}개 (2개 이상)`)
          } else if (correct !== 1) {
            problems.push(`${at}: ${beat.kind} 정답이 ${correct}개 (정확히 1개)`)
          }
          for (const option of options) {
            if (iconKeys && !iconKeys.includes(option.icon)) {
              problems.push(`${at}/${option.id}: icons.js 에 없는 아이콘 '${option.icon}'`)
            }
            displayed.push([`${at}/${option.id} label`, option.label])
          }
        }

        if (beat.kind === 'listen-repeat' || beat.kind === 'finale') {
          if (!Array.isArray(beat.words) || !beat.words.length) {
            problems.push(`${at}: ${beat.kind} 에 words 없음`)
          } else {
            beat.words.forEach((word, i) => {
              if (typeof word === 'string') {
                displayed.push([`${at} words[${i}]`, word])
              } else if (word && typeof word.text === 'string' && word.text) {
                displayed.push([`${at} words[${i}].text`, word.text])
              } else {
                problems.push(`${at}: words[${i}] 가 문자열도 { text } 객체도 아님`)
              }
            })
          }
        }

        if (beat.kind === 'drag-build') {
          const tiles = (beat.letters || []).map((l) => (typeof l === 'string' ? l : l && l.text))
          if (tiles.some((t) => typeof t !== 'string' || !t)) {
            problems.push(`${at}: letters 항목이 문자열도 { text } 객체도 아님`)
          } else if (tiles.slice().sort().join('') !== String(beat.target).split('').sort().join('')) {
            problems.push(
              `${at}: letters [${tiles.join('')}] 와 target '${beat.target}' 의 글자 집합 불일치`
            )
          }
          tiles.forEach((t, i) => displayed.push([`${at} letters[${i}]`, t]))
          displayed.push([`${at} target`, beat.target])
        }

        if (beat.readAloud) displayed.push([`${at} readAloud.targetText`, beat.readAloud.targetText])
        if (beat.letter) displayed.push([`${at} letter`, beat.letter])
        if (beat.promptLetter) displayed.push([`${at} promptLetter`, beat.promptLetter])
      }

      for (const [field, text] of displayed) {
        if (typeof text !== 'string') continue
        if (SOUND_NOTATION.test(text) || CHOPPED_NOTATION.test(text)) {
          problems.push(`${field}: 화면에 소리 표기 '${text}' 노출 -- 표시는 실제 글자·단어여야 함`)
        }
      }

      const healthMax = stageHealthMax(stage)
      if (reachableHits !== healthMax) {
        problems.push(
          `${where}: 실제로 들어갈 수 있는 데미지 ${reachableHits} != healthMax ${healthMax} ` +
            `-- 체력바가 0에 도달하지 못함`
        )
      }
    }
  }

  return problems
}

function reportChapterProblems(problems) {
  if (!problems.length) return
  console.error(
    `[chapters] 데이터 계약 위반 ${problems.length}건:\n` +
      problems.map((p) => `  - ${p}`).join('\n')
  )
}

// Vite statically replaces import.meta.env.DEV, so this folds to `if (false)`
// and the validator drops out of the production bundle. The typeof guard keeps
// the module importable outside Vite (e.g. a plain `node` data check).
const IS_DEV = typeof import.meta.env !== 'undefined' && import.meta.env.DEV === true

if (IS_DEV) {
  // Dynamic import: icons.js is the art layer, and a static import would make
  // the data modules permanently depend on it, dropped from production only if
  // the bundler proves icons.js side-effect-free. There is no cycle today
  // (icons.js imports nothing) but deferring it also keeps room for icons.js
  // to ever need chapter data. Never throws -- a parent seeing a blank screen
  // is worse than a console warning.
  import('../../icons.js')
    .then(({ wordIconKeys }) => reportChapterProblems(validateChapters(chapters, wordIconKeys)))
    .catch(() => reportChapterProblems(validateChapters(chapters)))
}
