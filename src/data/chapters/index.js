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
//   a/eh:    **두 음성 모두에서 바이트 단위로 완전히 동일하다.** 단일 토큰으로
//            합성하면 `a`(=AI 표기) · `eh`(=E 표기) · `eigh` 가 같은 파일이 되고
//            (Alex 는 `ay` 까지 포함) 길이가 소수점 6자리까지 같다. 즉 두 음성이
//            `eh` 를 /e/(bed 의 에)가 아니라 **글자 이름 A = /ei/** 로 정규화한다
//            -- CLAUDE.md 가 O 의 `aw`/`ah`/`awe` 에서 이미 기록한 그 실패 모드가
//            E 에서도 일어나고 있었고, 아무도 이 쌍을 측정하지 않았다.
//            **buh/duh 보다 강한 충돌이다**: buh/duh 는 길이만 같고 파형은 45%
//            다른데(Alex, 30x), a/eh 는 파형 차이가 0.0% 다.
//            재현: `say -v Alex -o x.aiff "a"; say -v Alex -o y.aiff "eh"; cmp x.aiff y.aiff`
//            (대조군: 같은 텍스트를 두 번 합성하면 0 differing bytes -- say 는
//             결정적이므로 바이트 비교가 길이 비교보다 강한 판정이다)
//
// 보기가 **그림**인 문항은 무해하다(발화되는 건 그림 단어다) -- letterTile 만 본다.
// 새 충돌쌍이 측정으로 발견되면 여기 한 줄 추가하면 된다.
const SPEECH_COLLISION_PAIRS = [
  ['buh', 'duh'],
  ['a', 'eh'],
]

// 위 표는 **표기가 다른데 같게 들리는** 쌍(엔진 결함)이다. 그것과 별개로,
// 커리큘럼 자체가 **한 소리에 글자꼴을 둘** 배정하는 경우가 있다 -- 챕터 3 의
// C/K 가 그렇고(둘 다 `kuh`), Jolly Group 5-7 에는 ai/ay, oa/ow, ee/ea, or/aw,
// c/k/ck 가 줄줄이 나온다. 이때 "이 소리를 내는 글자는?" 문항에 두 글자꼴을
// 함께 넣으면 **정답이 둘인 답할 수 없는 문항**이 되고, 아이는 맞는 타일을 탭하고
// 틀렸다는 피드백을 받는다 -- 오답 패널티가 없는 앱이라 크래시도 로그도 없고,
// 아이만 자기가 틀렸다고 학습한다.
//
// 챕터 3 은 이 규칙을 파일 헤더 산문으로만 갖고 있었고 강제하는 코드가 없었다.
// 같은 소리를 공유하는 글자꼴은 앞으로 계속 늘어나므로 여기서 강제한다:
// **한 문항(또는 choose-sequence 한 스텝)의 letterTile 보기 중 같은 `say` 를
// 가진 것이 둘 이상이면, 그 전부가 정답인 multiselect 여야 한다.** multiselect
// 예외가 있는 이유는 "모두 찾기" 가 다대일 대응을 답할 수 없는 문항이 아니라
// **수업**으로 바꾸기 때문이다(c3s2-r4, c3s3-r4 가 정확히 그 용도다).
// match-shape 는 opt.say 를 아예 읽지 않으므로(순수 시각 변별) 해당 없다.

// recapKo 는 화면에 표시되면서 speakKO() 로도 발화된다. 문장 안에 하이픈 절단형
// 소리 표기가 섞이면 한국어 음성이 그걸 읽는다. 같은 소문자가 하이픈으로 반복되는
// 패턴만 잡는다 -- 'C-A-T는 CAT' 같은 대문자 낱자 나열은 정상 표기다.
const HYPHENED_IN_TEXT = /\b([a-z])(-\1)+\b/

// "repeatAudio 원소 하나 = 발화 하나" 규칙의 **취지**는 서로 다른 단어를 한
// 문자열에 cramming 하지 말라는 것이다(그러면 TTS 가 이어 읽어 아이가 개별
// 단어를 못 잡는다). 반면 **같은 소리를 콤마로 반복**하는 건 측정 결과 정반대
// 효과다: 'a' 단일 발화는 두 음성 모두 0.33s 짜리 블립이고 1.1s 침묵 사이에
// 3번 떨어지면 붙잡을 수 없는데, 'a, a, a' 한 발화는 토큰당 ~510ms(콤마가
// 만드는 운율 휴지 포함)로 **또박또박 끊어** 읽힌다 -- N=2..5 에서 증분이
// 일정해 실제로 N개 토큰이 나오는 것을 확인했다. 공백 연결('a a a')은 반대로
// 압축돼(0.50s) 더 나빠지므로 반드시 콤마여야 한다.
// 그래서 규칙을 "여러 토큰이면 전부 같은 토큰이어야 한다" 로 정밀화한다.
const SPEECH_TOKEN_SPLIT = /[,\s]+/

// Kinds whose renderer deals its hit unconditionally; every other scored kind
// needs a readAloud to have any damage path at all.
const SELF_PAYING_KINDS = new Set(['choose-sequence', 'listen-repeat', 'finale'])
const NEEDS_READ_ALOUD = new Set(['choose', 'multiselect', 'drag-build', 'match-shape'])
const CHARACTER_KEYS = new Set(['name', 'art', 'style'])

// ---------- 읽는 사람이 없는 필드 (dead data) ----------
// 이 프로젝트에서 같은 함정이 세 번 나왔다: 데이터에 필드가 있고, 렌더러가
// 그걸 읽지 않고, 아무 에러도 없이 조용히 무시된다 (multiselect 의
// promptAudio, 보스 인트로의 emoji, reviewTargets). 실행 시점에 증상이
// **없기 때문에** 리뷰로는 절대 잡히지 않는다 -- 화면은 정상으로 보인다.
//
// 근본 원인은 "데이터 객체가 임의의 키를 받아준다" 는 것이므로, 캐릭터
// 객체에 이미 쓰고 있던 방식(CHARACTER_KEYS)을 전체로 확장한다: **렌더러가
// 실제로 읽는 키만 허용**하고, 그 외에는 오타든 새 아이디어든 즉시 이름을
// 대고 거부한다. beat 는 kind 마다 읽는 키가 다르므로 kind 별 표다 --
// 그래서 'multiselect 에 promptAudio' 같은 *배치* 오류까지 같이 잡힌다.
//
// 새 필드를 배선했으면 여기 한 줄을 추가해라. 그 한 줄이 "이 필드는 읽힌다"
// 는 유일한 증거다.
const CHAPTER_KEYS = new Set(['id', 'order', 'title', 'stages'])
const STAGE_KEYS = new Set([
  'id',
  'order',
  'title',
  'villain',
  'hero',
  'chapterBoss',
  'beats',
  'recapKo',
  'recapAudio',
  // screens.js 가 아직 읽지 않는다 -- 누적 복습 배선 대기 중(HANDOFF.md).
  // 아래 reviewTargets 계약이 "배선되는 순간 맞는 값" 을 보장한다.
  'reviewTargets',
])
const BEAT_COMMON_KEYS = ['id', 'kind', 'instructionKo', 'scored', 'hits']
const BEAT_KIND_KEYS = {
  teach: ['art', 'emoji', 'letter', 'repeatAudio'],
  break: ['art', 'emoji', 'letter', 'repeatAudio'],
  choose: ['promptLetter', 'promptEmoji', 'promptAudio', 'options', 'readAloud'],
  'match-shape': ['promptLetter', 'promptEmoji', 'options', 'readAloud'],
  multiselect: ['options', 'readAloud'],
  'choose-sequence': ['steps'],
  'drag-build': ['letters', 'target', 'readAloud'],
  'listen-repeat': ['words'],
  finale: ['words'],
}
const STEP_KEYS = new Set(['promptAudio', 'options'])
const OPTION_KEYS = new Set(['id', 'icon', 'label', 'correct', 'say'])
const READ_ALOUD_KEYS = new Set(['targetText', 'say'])
const RECAP_AUDIO_KEYS = new Set(['ko', 'en'])
const SPOKEN_PAIR_KEYS = new Set(['text', 'say'])

// kind 별 허용 키 표에 걸리는 배치 오류 중 **왜 틀렸는지가 안 자명한** 것들.
// 단순 오타는 키 이름만 보여주면 충분하지만, 이것들은 "렌더러에 그 필드를
// 읽는 코드가 아예 없다" 는 사실을 말해줘야 저자가 대안을 찾을 수 있다.
const MISPLACED_KEY_HINTS = {
  'multiselect.promptAudio':
    'renderMultiselectBeat 은 promptAudio 를 문제로 제시하지 않는다 ' +
    '(자동 재생도, 다시 듣기 버튼도 없다). multiselect 는 소리를 ' +
    'instructionKo 문장으로 지목하는 구조다. 소리를 들려주고 하나만 고르게 ' +
    '할 생각이면 kind 를 choose 로 바꿔라',
  'match-shape.promptAudio':
    'match-shape 는 b/d 반전을 *귀*가 아니라 *모양*으로 변별시키는 beat 라 ' +
    '의도적으로 아무 소리도 먼저 내지 않는다. 소리로 물으려면 choose 다',
  'drag-build.promptAudio':
    'renderBuildBeat 은 promptAudio 를 읽지 않는다. 슬롯별 소리는 ' +
    'letters[].say 에서 나온다',
  'listen-repeat.repeatAudio':
    'repeatAudio 는 teach/break 전용이다(wireTeachButtons). ' +
    'listen-repeat 가 발화하는 것은 words[] 다',
  'finale.repeatAudio':
    'repeatAudio 는 teach/break 전용이다(wireTeachButtons). ' +
    'finale 이 발화하는 것은 words[] 다',
}

// 비보스 teach/break 의 repeatAudio 는 "한 소리 드릴" 이다 -- 사용자가
// 실기기에서 듣고 반려한 지점이 여기다. 원문: "1-1 음성이 ss sun ss 라고
// 하네... 이 때 굳이 sun 을 언급하는 이유를 모르겠어. 빼버리자". 그래서
// 소리 블록의 반복과 (선택적으로) 화면에 떠 있는 글자꼴 이름만 허용하고,
// 단어와 캐릭터 이름은 금지한다.
//
// 글자꼴은 대문자 1~2자다(다이그래프 'AI'/'OA' 가 한 글자소다). 이건
// TTS 가 글자 **이름**("에스")으로 읽는 것이 의도인 유일한 자리다 --
// 글자꼴 스테이지의 teach/break 는 화면에 그 글자를 띄우고 있다.
const LETTERFORM = /^[A-Z]{1,2}$/
// 소리 토큰 하한. 1개면 모델이 한 번뿐이라 아이가 비교할 대상이 없다
// (실제로 ['tuh','Turbo','go!'] 에서 단어를 빼면 0.27초 블립 하나만 남았다).
// 2개가 "듣고 따라하고 다시 듣기" 가 성립하는 최소치다.
const MIN_DRILL_SOUND_TOKENS = 2

function checkKeys(problems, where, obj, allowed, label, hints = null) {
  for (const key of Object.keys(obj)) {
    if (allowed.has(key)) continue
    const hint = hints && hints[`${label}.${key}`]
    problems.push(
      `${where}: ${label} 에 알 수 없는 키 '${key}' -- ` +
        (hint || '렌더러가 읽지 않는 필드다. 조용히 무시되므로 화면은 정상으로 보인다') +
        `. 실제로 배선했다면 chapters/index.js 의 허용 키 표에 추가해라`
    )
  }
}

// recapAudio 는 표시(recapKo)와 발화를 분리한다. 영어 텍스트를 speakKO() 로
// 보내면 한국어 음성이 로마자를 읽어버리므로, 발화는 언어별로 나눠 담는다.
const HANGUL = /[\u3131-\u318E\uAC00-\uD7A3]/
const ROMAJI = /[a-z]/i

export function validateChapters(chapterList = chapters, iconKeys = null) {
  const problems = []
  const stageIds = new Map()
  const beatIds = new Map()

  // 커리큘럼이 이 시점까지 실제로 가르친 글자소. reviewTargets 계약의
  // 유일한 진실 공급원이다 -- 손으로 관리하는 두 번째 목록을 만들지 않는다.
  const taughtSoFar = []

  for (const chapter of chapterList) {
    checkKeys(problems, chapter.id, chapter, CHAPTER_KEYS, 'chapter')
    const bosses = chapter.stages.filter((s) => s.chapterBoss)
    if (bosses.length !== 1) {
      problems.push(`${chapter.id}: chapterBoss 스테이지가 ${bosses.length}개 (정확히 1개)`)
    }

    for (const stage of chapter.stages) {
      const where = `${chapter.id}/${stage.id}`
      checkKeys(problems, where, stage, STAGE_KEYS, 'stage')
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

        const kindKeys = BEAT_KIND_KEYS[beat.kind]
        if (!kindKeys) {
          problems.push(`${at}: 알 수 없는 beat.kind '${beat.kind}' -- 렌더러가 없다`)
        } else {
          checkKeys(
            problems,
            at,
            beat,
            new Set([...BEAT_COMMON_KEYS, ...kindKeys]),
            beat.kind,
            MISPLACED_KEY_HINTS
          )
        }
        // 한 스테이지의 teach 와 break 가 같은 letter 를 띄우므로 중복을 뺀다.
        if (beat.letter && !taughtSoFar.includes(beat.letter)) taughtSoFar.push(beat.letter)

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

        // 프롬프트 소리를 같이 들고 다닌다 -- 오답 타일이 **프롬프트와** 같은
        // 소리를 내는 경우가 타일끼리 겹치는 경우와 똑같이 답할 수 없는 문항이고,
        // 실제로 c7s2-r5-hard 가 그 형태였다(promptAudio 'a' + 오답 타일 'eh').
        // 거기서는 정답 타일도 'a' 여서 타일끼리 검사에 걸렸지만, 정답 타일의
        // say 가 프롬프트와 다르게 적힌 문항에서는 그 그물이 없다.
        const optionGroups = beat.options
          ? [{ options: beat.options, promptAudio: beat.promptAudio }]
          : beat.steps
          ? beat.steps.map((s) => ({ options: s.options, promptAudio: s.promptAudio }))
          : []
        for (const { options, promptAudio } of optionGroups) {
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
            const bySay = new Map()
            for (const o of options) {
              if (o.icon !== 'letterTile' || !o.say) continue
              if (!bySay.has(o.say)) bySay.set(o.say, [])
              bySay.get(o.say).push(o)
            }
            for (const [say, sharing] of bySay) {
              if (sharing.length < 2) continue
              const taughtAsSet = beat.kind === 'multiselect' && sharing.every((o) => o.correct)
              if (!taughtAsSet) {
                const nCorrect = sharing.filter((o) => o.correct).length
                problems.push(
                  `${at}: letterTile 보기 [${sharing.map((o) => o.label).join(', ')}] 가 같은 소리 ` +
                    `'${say}' 를 낸다 -- ` +
                    (nCorrect > 1
                      ? `정답이 ${nCorrect}개인 답할 수 없는 문항이다(아이가 맞는 타일을 탭하고 ` +
                        `오답 피드백을 받는다)`
                      : `탭했을 때 두 타일이 똑같은 소리를 내므로 아이가 소리로 고를 수 없다`) +
                    `. 한 소리에 글자꼴이 둘이면 정방향(소리 -> 글자) 문항에서는 하나만 쓰고, ` +
                    `둘을 함께 보여줄 자리는 **둘 다 correct 인 multiselect** 다`
                )
              }
            }
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
            // 프롬프트 소리와 **오답** 타일이 같게 들리면 아이는 방금 들은 소리를
            // 그대로 다시 듣고 오답 처리된다 -- 타일끼리 겹치는 것과 같은 결함이다.
            if (promptAudio) {
              for (const t of tileSounds) {
                const o = options.find((x) => x.id === t.id)
                if (o.correct) continue
                const same =
                  t.say === promptAudio ||
                  SPEECH_COLLISION_PAIRS.some(
                    ([x, y]) =>
                      (t.say === x && promptAudio === y) || (t.say === y && promptAudio === x)
                  )
                if (same) {
                  problems.push(
                    `${at}: promptAudio '${promptAudio}' 와 오답 타일 ${t.id}('${t.say}') 가 ` +
                      `같게 들린다 -- 아이가 프롬프트와 똑같은 소리를 듣고 오답 처리된다`
                  )
                }
              }
            }
          }
          for (const option of options) {
            checkKeys(problems, `${at}/${option.id}`, option, OPTION_KEYS, 'option')
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
                checkKeys(problems, `${at} words[${i}]`, word, SPOKEN_PAIR_KEYS, 'word')
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
            if (l && typeof l === 'object') {
              checkKeys(problems, `${at} letters[${i}]`, l, SPOKEN_PAIR_KEYS, 'letter')
            }
            if (l && l.say !== undefined) spoken.push([`${at} letters[${i}].say`, l.say])
          }
          slots.forEach((slot, i) => displayed.push([`${at} target[${i}]`, slot]))
        }

        if (beat.readAloud) {
          checkKeys(problems, at, beat.readAloud, READ_ALOUD_KEYS, 'readAloud')
          displayed.push([`${at} readAloud.targetText`, beat.readAloud.targetText])
          if (beat.readAloud.say !== undefined)
            spoken.push([`${at} readAloud.say`, beat.readAloud.say])
        }
        if (beat.letter) displayed.push([`${at} letter`, beat.letter])
        if (beat.promptLetter) displayed.push([`${at} promptLetter`, beat.promptLetter])
        if (beat.promptAudio !== undefined) spoken.push([`${at} promptAudio`, beat.promptAudio])
        for (const [i, step] of (beat.steps || []).entries()) {
          checkKeys(problems, `${at} steps[${i}]`, step, STEP_KEYS, 'step')
          if (step.promptAudio !== undefined)
            spoken.push([`${at} steps[${i}].promptAudio`, step.promptAudio])
        }

        // 보스 인트로(= 보스 스테이지의 첫 teach beat)는 renderNonScoredBeat 이
        // beat.emoji 대신 글자 등식을 그린다. 그 자리에 emoji 를 적으면 화면에
        // 절대 나오지 않는다 -- 실제로 7개 챕터 전부가 여기에 리버스 이모지를
        // 달아두고 있었고(🐍🐜🚙➡️🤖) 한 번도 렌더된 적이 없다.
        if (stage.chapterBoss && beat.kind === 'teach' && stage.beats[0] === beat) {
          if (beat.emoji !== undefined) {
            problems.push(
              `${at}: 보스 인트로 teach beat 의 emoji 는 렌더되지 않는다 -- ` +
                `이 자리에는 buildEquationsHtml() 의 글자 등식이 그려진다`
            )
          }
        }

        if (beat.kind === 'teach' || beat.kind === 'break') {
          if (!(beat.repeatAudio || []).length) {
            problems.push(`${at}: ${beat.kind} 에 repeatAudio 없음 -- 무음 beat 이 된다`)
          }
        }

        // 보스 teach/break 은 예외다: 거기서는 낱소리를 순서대로 들려준 뒤
        // 합친 단어를 말하는 **블렌딩 시연**이고(sss-aaa-tuh-sat), 그 단어는
        // 화면의 글자 등식에 그대로 떠 있다. 없애면 beat 의 목적이 사라진다.
        if ((beat.kind === 'teach' || beat.kind === 'break') && !stage.chapterBoss) {
          const tokens = (beat.repeatAudio || [])
            .flatMap((line) => String(line).trim().split(SPEECH_TOKEN_SPLIT))
            .filter(Boolean)
          const sounds = tokens.filter((t) => !LETTERFORM.test(t))
          const distinct = [...new Set(sounds.map((s) => s.toLowerCase()))]
          if (distinct.length > 1) {
            problems.push(
              `${at}: 소리 드릴 repeatAudio 에 서로 다른 토큰 [${distinct.join(' / ')}] -- ` +
                `비보스 teach/break 은 한 소리만 반복한다. 단어·캐릭터 이름을 섞지 마라 ` +
                `(사용자가 실기기에서 'ss sun ss' 를 듣고 반려한 지점이다). ` +
                `소리를 단어에 붙여 들려줄 자리는 listen-repeat/finale 의 words[] 다`
            )
          }
          if (sounds.length < MIN_DRILL_SOUND_TOKENS) {
            problems.push(
              `${at}: 소리 드릴 repeatAudio 의 소리 토큰이 ${sounds.length}개 ` +
                `(최소 ${MIN_DRILL_SOUND_TOKENS}개) -- 모델이 한 번뿐이면 아이가 ` +
                `따라할 대상을 비교할 수 없다`
            )
          }
        }

        for (const [i, line] of (beat.repeatAudio || []).entries()) {
          spoken.push([`${at} repeatAudio[${i}]`, line])
          if (typeof line === 'string') {
            const tokens = line.trim().split(SPEECH_TOKEN_SPLIT).filter(Boolean)
            const distinct = new Set(tokens.map((t) => t.toLowerCase()))
            if (tokens.length > 1 && distinct.size > 1) {
              problems.push(
                `${at} repeatAudio[${i}]: 한 발화에 서로 다른 토큰 ` +
                  `[${tokens.join(' / ')}] 를 cramming -- 원소 하나 = 발화 하나. ` +
                  `같은 소리 반복('a, a, a')만 한 원소에 넣을 수 있다`
              )
            }
            if (tokens.length > 1 && !line.includes(',')) {
              problems.push(
                `${at} repeatAudio[${i}]: '${line}' 를 공백으로 이어붙였다 -- ` +
                  `공백 연결은 TTS 가 압축해 더 빨라진다. 콤마로 구분해라`
              )
            }
          }
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
        checkKeys(problems, where, ra, RECAP_AUDIO_KEYS, 'recapAudio')
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

      // ---------- reviewTargets 계약 ----------
      // 이 필드는 지금 소비자가 0개다. 그런데 "아무도 읽지 않는다" 를 데이터
      // 검증기가 단정하는 것은 틀린 설계다: 검증기는 screens.js 를 볼 수도
      // 없고, 그 사실은 배선되는 순간 뒤집힌다 -- 옳아지는 순간 빨개지는
      // 검사가 된다. 소비자 유무는 위의 허용 키 표가 담당한다(배선하면 표에
      // 한 줄이 늘어난다).
      //
      // 대신 검증기가 소유할 수 있는 것은 **필드의 의미 계약**이고, 실제
      // 결함도 거기 있었다: 값이 챕터 로컬이었다(챕터 4 스테이지 4 가
      // ['R','M']). 누적 복습 의미로 배선되면 그 스테이지는 R·M 만 복습하는
      // -- 즉 누적 복습이 조용히 없는 -- 상태가 된다. 죽은 데이터보다 잡기
      // 어려운 실패다. 게다가 자기 스테이지의 글자를 빼고 있었는데, 같은
      // 스테이지의 퀵파이어 beat 은 그 글자를 실제로 물어본다(챕터 1
      // 스테이지 4 의 퀵파이어는 S·A·T 3문항인데 reviewTargets 는 ['S','A']).
      //
      // 그래서 계약은 "선언했다면, 이 스테이지까지 커리큘럼이 가르친 글자소
      // 전체와 정확히 같아야 한다" 다. 커리큘럼(beat.letter)에서 유도되므로
      // 드리프트가 불가능하고, screens.js 가 무엇을 하든 참이다. 선언하지
      // 않은 스테이지는 침묵한다 -- 복습 beat 이 없는 스테이지를 강제로
      // 선언하게 만들 이유는 없다.
      if (stage.reviewTargets !== undefined) {
        const rt = stage.reviewTargets
        if (!Array.isArray(rt) || !rt.length) {
          problems.push(`${where}: reviewTargets 가 비어있는 배열이 아님 (${JSON.stringify(rt)})`)
        } else if (rt.some((t) => typeof t !== 'string' || t.trim() === '')) {
          problems.push(`${where}: reviewTargets 항목이 비어있지 않은 문자열이어야 함`)
        } else if (rt.join('|') !== taughtSoFar.join('|')) {
          const missing = taughtSoFar.filter((t) => !rt.includes(t))
          const extra = rt.filter((t) => !taughtSoFar.includes(t))
          problems.push(
            `${where}: reviewTargets [${rt.join(', ')}] != 이 스테이지까지 가르친 글자소 ` +
              `[${taughtSoFar.join(', ')}]` +
              (missing.length ? ` -- 빠짐: [${missing.join(', ')}]` : '') +
              (extra.length ? ` -- 아직 안 가르친 글자소: [${extra.join(', ')}]` : '') +
              (!missing.length && !extra.length ? ' -- 커리큘럼 순서와 다름' : '')
          )
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
