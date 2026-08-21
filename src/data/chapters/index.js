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
import { chapter3 } from './chapter-03.js'
import { chapter4 } from './chapter-04.js'
import { chapter5 } from './chapter-05.js'
import { chapter6 } from './chapter-06.js'
import { chapter7 } from './chapter-07.js'

export const chapters = [chapter1, chapter2, chapter3, chapter4, chapter5, chapter6, chapter7]

export const stages = chapters.flatMap((c) => c.stages)

// The curriculum is planned as 33 chapters total, cycling through 7
// character-style "flavors" per world, chapter 1 of each world always
// landing on the first flavor: Carbot -> Marvel-flavored heroes -> dinosaurs
// -> Pokemon-flavored creatures -> Mario-flavored platformer -> Toy-Story-
// flavored living toys -> DC-flavored heroes, then repeat. These are original
// designs evoking each property's genre, not likenesses of the trademarked
// characters themselves -- see the design-agent brief in CLAUDE.md. Chapter 4
// currently renders with the platformer style (`plat-*`) as a placeholder;
// it needs a creature-flavored redesign to match its intended slot (see
// CLAUDE.md's "진행 중 / 미완료" list). Only `chapters`
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
      title: `World ${w + 1}`,
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

// 하이픈 절단형('t-t-t')은 macOS 두 음성 모두에서 글자 **이름** 연속으로 읽힌다
// (say + afinfo 로 "tee tee tee" 와 길이가 소수점 6자리까지 동일). 즉 소리를
// 가르치려는 자리에서 글자 이름을 들려주는 정반대 결과가 된다. 자음은
// '<자음>uh' 형(tuh/puh/kuh/huh/duh/buh)을 쓴다 -- 두 음성에서 글자 이름과
// distinct 함을 측정으로 확인했다.
const HYPHENED_SPEECH = /^\w+(-\w+)+$/

// 특정 음성이 **서로 다른 두 소리 표기를 같은 음소열로 렌더**하는 쌍이다.
// 두 표기가 한 문항의 letterTile 보기로 함께 나오면 아이가 두 타일을 탭했을 때
// 똑같은 소리가 들려 변별이 불가능해진다 -- 정답이 하나여도 물어볼 수 없는 문항이다.
//
//   buh/duh: Alex 에서 둘 다 0.582630 (3회 반복형, say + afinfo 측정).
//            bbuh/dduh/bhuh/dhuh 까지 전부 같은 값 -- Alex 가 b/d + 슈와 조합을
//            파싱하지 못하고 단일 폴백을 낸다. Samantha 는 정상 구분(0.898/0.727).
//            B/D 반전은 원래 *글자 모양* 혼동이므로 귀로 변별시키는 게 애초에
//            약한 연습이다. 그래서 표기를 바꾸는 대신 같은 문항 배치를 금지한다.
//
// 보기가 **그림**인 문항은 무해하다(발화되는 건 그림 단어다) -- letterTile 만 본다.
// 새 충돌쌍이 측정으로 발견되면 여기 한 줄 추가하면 된다.
const SPEECH_COLLISION_PAIRS = [['buh', 'duh']]

// recapKo 는 화면에 표시되면서 speakKO() 로도 발화된다. 문장 안에 하이픈 절단형
// 소리 표기가 섞이면 한국어 음성이 그걸 읽는다. 같은 소문자가 하이픈으로 반복되는
// 패턴만 잡는다 -- 'C-A-T는 CAT' 같은 대문자 낱자 나열은 정상 표기다.
const HYPHENED_IN_TEXT = /\b([a-z])(-\1)+\b/

// Kinds whose renderer deals its hit unconditionally; every other scored kind
// needs a readAloud to have any damage path at all.
const SELF_PAYING_KINDS = new Set(['choose-sequence', 'listen-repeat', 'finale'])
const NEEDS_READ_ALOUD = new Set(['choose', 'multiselect', 'drag-build', 'match-shape'])
const CHARACTER_KEYS = new Set(['name', 'art', 'style'])

// recapAudio 는 표시(recapKo)와 발화를 분리한다. 영어 텍스트를 speakKO() 로
// 보내면 한국어 음성이 로마자를 읽어버리므로, 발화는 언어별로 나눠 담는다.
const HANGUL = /[\u3131-\u318E\uAC00-\uD7A3]/
const ROMAJI = /[a-z]/i

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
        if (!character.art) {
          problems.push(
            `${where}: ${role}.art 슬러그 없음 -- art.js 팔레트는 슬러그로만 조회한다. ` +
              `없으면 기본 팔레트로 렌더되어 캐릭터 고유색을 잃는다`
          )
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
      // 발화 전용 필드 -- 표시되지 않지만 소리 표기 규칙을 지켜야 한다.
      const spoken = []
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
          const checkSpeechCollisions = beat.kind !== 'match-shape'
          if (beat.kind === 'multiselect') {
            if (correct < 2) problems.push(`${at}: multiselect 정답이 ${correct}개 (2개 이상)`)
          } else if (correct !== 1) {
            problems.push(`${at}: ${beat.kind} 정답이 ${correct}개 (정확히 1개)`)
          }
          if (checkSpeechCollisions) {
            const tileSounds = options
              .filter((o) => o.icon === 'letterTile' && o.say)
              .map((o) => ({ id: o.id, say: o.say }))
            for (const [x, y] of SPEECH_COLLISION_PAIRS) {
              const hitX = tileSounds.filter((t) => t.say === x)
              const hitY = tileSounds.filter((t) => t.say === y)
              if (hitX.length && hitY.length) {
                problems.push(
                  `${at}: 한 문항에 음성 충돌쌍 '${x}'(${hitX[0].id}) + '${y}'(${hitY[0].id}) ` +
                    `-- 특정 음성에서 두 타일이 같은 소리를 내 변별 불가. 보기를 갈라라`
                )
              }
            }
          }
          for (const option of options) {
            if (iconKeys && !iconKeys.includes(option.icon)) {
              problems.push(`${at}/${option.id}: icons.js 에 없는 아이콘 '${option.icon}'`)
            }
            displayed.push([`${at}/${option.id} label`, option.label])
            if (option.say !== undefined) spoken.push([`${at}/${option.id} say`, option.say])
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
                if (word.say !== undefined) spoken.push([`${at} words[${i}].say`, word.say])
              } else {
                problems.push(`${at}: words[${i}] 가 문자열도 { text } 객체도 아님`)
              }
            })
          }
        }

        if (beat.kind === 'drag-build') {
          const tiles = (beat.letters || []).map((l) => (typeof l === 'string' ? l : l && l.text))
          // target 은 문자열(챕터1-6, 한 슬롯 = 한 글자) 이거나 슬롯 배열
          // (챕터7+, 'ai'/'oa' 같은 다이그래프가 한 슬롯을 차지) 이다 --
          // 슬롯 배열을 문자열로 강제하면 Array.toString() 이 쉼표로 이어붙여
          // 완전히 다른 문자열이 나오므로 여기서 분기해야 한다.
          const slots = Array.isArray(beat.target) ? beat.target : String(beat.target).split('')
          if (tiles.some((t) => typeof t !== 'string' || !t)) {
            problems.push(`${at}: letters 항목이 문자열도 { text } 객체도 아님`)
          } else {
            // '|' 로 이어붙여 멀티셋 비교한다 -- 구분자 없이 이어붙이면
            // ['a','i','n','r'] 와 ['ai','n','r'] 가 둘 다 정렬 후 "ainr" 로
            // 같아져서 타일 4개 vs 슬롯 3개(구조가 다른 라운드)를 놓친다.
            const tileKey = tiles.slice().sort().join('|')
            const slotKey = slots.slice().sort().join('|')
            if (tileKey !== slotKey) {
              problems.push(
                `${at}: letters [${tiles.join('+')}] 와 target 슬롯 [${slots.join('+')}] 불일치`
              )
            }
          }
          tiles.forEach((t, i) => displayed.push([`${at} letters[${i}]`, t]))
          for (const [i, l] of (beat.letters || []).entries()) {
            if (l && l.say !== undefined) spoken.push([`${at} letters[${i}].say`, l.say])
          }
          slots.forEach((slot, i) => displayed.push([`${at} target[${i}]`, slot]))
        }

        if (beat.readAloud) {
          displayed.push([`${at} readAloud.targetText`, beat.readAloud.targetText])
          if (beat.readAloud.say !== undefined)
            spoken.push([`${at} readAloud.say`, beat.readAloud.say])
        }
        if (beat.letter) displayed.push([`${at} letter`, beat.letter])
        if (beat.promptLetter) displayed.push([`${at} promptLetter`, beat.promptLetter])
        if (beat.promptAudio !== undefined) spoken.push([`${at} promptAudio`, beat.promptAudio])
        for (const [i, step] of (beat.steps || []).entries()) {
          if (step.promptAudio !== undefined)
            spoken.push([`${at} steps[${i}].promptAudio`, step.promptAudio])
        }
        for (const [i, line] of (beat.repeatAudio || []).entries()) {
          spoken.push([`${at} repeatAudio[${i}]`, line])
        }
      }

      // audio.js 는 null/빈 문자열/공백을 즉시 resolve 한다(무음). 실행 시점에는
      // 옳은 동작이지만 실수로 비어버린 발화 필드가 스스로를 드러내지 않으므로
      // 여기서 잡는다 -- 아이는 아무 소리도 못 듣고 그게 정상처럼 지나간다.
      for (const [field, text] of spoken) {
        if (typeof text !== 'string' || text.trim() === '') {
          problems.push(
            `${field}: 발화 필드가 비어있음 (${JSON.stringify(text)}) -- 무음으로 지나간다`
          )
        }
      }

      if (typeof stage.recapKo !== 'string' || stage.recapKo.trim() === '') {
        problems.push(`${where}: recapKo 가 비어있음 -- 보상 화면에서 무음으로 지나간다`)
      } else if (HYPHENED_IN_TEXT.test(stage.recapKo)) {
        problems.push(
          `${where}: recapKo 에 하이픈 절단형 소리 표기 ` +
            `('${stage.recapKo.match(HYPHENED_IN_TEXT)[0]}') -- speakKO 가 이걸 읽는다`
        )
      }
      const ra = stage.recapAudio
      if (!ra) {
        problems.push(`${where}: recapKo 는 있는데 recapAudio 가 없음 -- 보상 화면이 무음이다`)
      } else {
        if (typeof ra.ko !== 'string' || ra.ko.trim() === '') {
          problems.push(`${where}: recapAudio.ko 가 비어있음`)
        } else if (ROMAJI.test(ra.ko)) {
          problems.push(
            `${where}: recapAudio.ko 에 로마자 '${ra.ko.match(ROMAJI)[0]}' -- ` +
              `한국어 음성이 영어를 읽는다. 한글만 써라`
          )
        }
        if (!Array.isArray(ra.en) || ra.en.length === 0) {
          problems.push(`${where}: recapAudio.en 이 비어있음`)
        } else {
          ra.en.forEach((line, i) => {
            if (typeof line !== 'string' || line.trim() === '') {
              problems.push(`${where}: recapAudio.en[${i}] 가 비어있음`)
            } else if (HANGUL.test(line)) {
              problems.push(
                `${where}: recapAudio.en[${i}] 에 한글 '${line.match(HANGUL)[0]}' -- ` +
                  `영어 음성이 한글을 읽는다. 영어만 써라`
              )
            } else if (HYPHENED_SPEECH.test(line)) {
              problems.push(`${where}: recapAudio.en[${i}] 가 하이픈 절단형 '${line}'`)
            }
          })
        }
      }

      for (const [field, text] of spoken) {
        if (typeof text === 'string' && HYPHENED_SPEECH.test(text)) {
          problems.push(
            `${field}: 하이픈 절단형 소리 표기 '${text}' -- 두 음성 모두에서 글자 ` +
              `이름으로 읽힌다. '<자음>uh' 형(tuh/puh/kuh/huh/duh/buh)을 써라`
          )
        }
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
