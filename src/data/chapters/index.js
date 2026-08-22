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
import { chapter8 } from './chapter-08.js'

export const chapters = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
]

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

// ---------- 오독 표기 블랙리스트 (say + cmp, `-r 88` = EN_RATE 0.5) ----------
//
// 사용자가 실기기에서 신고했다: "심지어 iii 같은건 3 로 읽어 버리더라?"
// 재현됐고 원인이 확정됐다 -- 엔진이 `iii` 를 **로마 숫자 III** 로 파싱한다.
//   say -v Samantha -o a.aiff "iii"; say -v Samantha -o b.aiff "three"
//   cmp a.aiff b.aiff  ->  0 differing bytes (둘 다 0.511701s)
// `say` 는 결정적이므로 cmp 가 길이 비교보다 강한 판정이다. 같은 방식으로
// `ii` == "two" 다. 즉 소리 표기가 **어휘 항목으로 렌더되는** 실패 모드가 있고,
// 이건 길이 계급(가청 하한)과는 완전히 다른 축이다 -- 그동안 아무도 이 축을
// 검사하지 않았다.
//
// 표기 38종 x 2음성을, 낱자 이름 26종 · 숫자 12종 · 흔한 약어/어휘 30종과
// 전수 cmp 한 결과다. 값은 (Samantha / Alex) ms.
//
//   금지 -- 다른 어휘 항목으로 렌더된다
//     ii    == "two"                      (453/340, 두 음성 모두 바이트 동일)
//     iii   == "three"                    (512; Alex 는 1004 로 정상 지속음)
//     iiii  == "eye eye eye eye"          (Alex 1248 바이트 동일. Samantha 는
//                                          iiiii 와 동일 = 4에서 포화)
//     ih    == "i"/"eye"/"ay"/"igh"       (445/412 -- 글자 이름 I)
//     ihhh  == 위와 동일                   (h 홀수개는 무시된다)
//     ough  == "oof" (Samantha 474)  ==  "ow" (Alex 435)
//                                          -> /f/ 나 /au/ 가 섞여 들린다
//     ogh   == "o"/"oh"/"oah"             (419/355 -- 글자 이름 O)
//     zzz   == 212ms "잠자기" 어휘 항목      (Samantha) -> 이미 `zz` 로 대체됨
//     sssss == "ss" (Samantha 689)         s 는 2개에서 포화하므로 `sssss` 는
//                                          `sss`(922) 보다 오히려 **짧다**
//     ssss/aaaa/mmmm/llll == ss/aa/mm/ll   (같은 포화)
//     단일 문자는 전부 글자 이름이다:
//       s==ess n==en m==em l==el r==ar f==ef z==zee u=="you" o=="oh"/"owe" i=="eye"
//
//   통과 -- 지속음 3자 반복은 안전하다 (어떤 이름·숫자·어휘와도 다르다)
//     sss 922/1179 · aaa 841/1075 · nnn 747/610 · mmm 736/633
//     lll 863/587 · rrr 875/749 · fff 864/1307 · zz 759/1068
//     (mmm 은 MMM=2000 이, lll 은 LLL=150 이 걱정거리였지만 각각
//      "two thousand" 945 · "one hundred fifty" 1472 와 다르다 --
//      엔진의 로마 숫자 파서는 I 계열에만 걸린다. aaa 는 "triple A" 829 와도 다르다)
//
//   이 라운드에 확정한 대체 표기
//     I: iii -> `ihh`   1049/1504.  낱자 이름 I(i/eye/ay/aye/igh/ih/ihhh),
//        숫자 one~five, "i aitch"/"eye aitch"(700/1004), hi/high/inn/ihn/
//        ick/itt/ig/ie/iee/ee/eeh, "eye eye eye eye" 전부와 다르다(두 음성).
//        `iiii` 는 Alex 에서 글자 이름 4연발이라 탈락했다.
//     O: ough -> `awh`  1329/1620.  "aw aitch"(684/889) · "a double u aitch"
//        (1259/1632) · aw/awe/augh/awww · o/oh/oah/ogh(글자 이름 O) ·
//        ar/ah · all/awl · oof/ow 전부와 다르다(두 음성).
//        차점자는 `ahh`(481/1504)이고 이것도 두 음성에서 깨끗하다 -- 음성 간
//        3배 차이가 나서 구조적으로 덜 예측 가능해 탈락시켰다. **`awh` 와
//        `ahh` 둘 다 실기기 청취로 최종 확인이 필요하다** (표기 하나를 sed
//        한 번으로 바꿀 수 있게 여기 남겨둔다).
//
// 새 표기를 쓸 때는 반드시 이 방식으로 재측정해라 -- 후보를 글자 이름 · 숫자
// 읽기 · 흔한 약어와 각각 cmp 하고, 0 바이트 차이면 그 표기는 쓸 수 없다.
const MISREAD_NOTATIONS = new Map([
  ['ii', '로마 숫자 II 로 파싱되어 "two" 와 바이트 동일하게 렌더된다'],
  ['iii', '로마 숫자 III 로 파싱되어 "three" 와 바이트 동일하게 렌더된다 (사용자가 실기기에서 신고한 결함이다). /i/ 는 `ihh` 를 써라'],
  ['iiii', 'Alex 에서 글자 이름 4연발("eye eye eye eye")과 바이트 동일하다. /i/ 는 `ihh` 를 써라'],
  ['ih', '글자 이름 I("i"/"eye"/"ay"/"igh")와 바이트 동일하다. /i/ 는 `ihh` 를 써라'],
  ['ihhh', '글자 이름 I 와 바이트 동일하다(h 홀수개는 무시된다). /i/ 는 `ihh` 를 써라'],
  ['ough', 'Samantha 에서 "oof", Alex 에서 "ow" 와 바이트 동일하다 -- 없는 /f/ 와 /au/ 를 가르친다. /o/ 는 `awh` 를 써라'],
  ['ogh', '글자 이름 O("o"/"oh"/"oah")와 바이트 동일하다. /o/ 는 `awh` 를 써라'],
  ['zzz', 'Samantha 에서 212ms "잠자기" 어휘 항목으로 렌더된다. /z/ 는 `zz` 를 써라'],
  ['sssss', 's 는 2개에서 포화하므로 "ss"(689ms)와 바이트 동일 -- `sss`(922ms)보다 짧다. `sss` 를 써라'],
  ['ssss', '"ss" 와 바이트 동일(포화). `sss` 를 써라'],
  ['aaaa', '"aa" 와 바이트 동일(포화). `aaa` 를 써라'],
  ['mmmm', '"mm" 와 바이트 동일(포화). `mmm` 을 써라'],
  ['llll', '"ll" 와 바이트 동일(포화). `lll` 을 써라'],
  // 챕터 8(IE/EE/OR) 을 쓰면서 측정했다. 둘 다 **다이그래프의 원문 철자를 그대로
  // 발화 필드에 넣는** 가장 자연스러운 실수이고, 그래서 앞으로 반복될 실수다.
  //   say -v Samantha -r 88 -o a.aiff "ai"; say -v Samantha -r 88 -o b.aiff "eye"; cmp a.aiff b.aiff
  ['ai', 'Samantha 에서 글자 이름 I("i"/"eye"/"igh")와 바이트 동일하다 -- AI 의 목표음 /ei/ 가 아니라 /ai/(eye)를 가르친다. Alex 는 또 다르게(703ms) 읽어 두 음성이 서로 다른 소리를 낸다. AI 는 `a`(글자 이름 A)를 써라'],
  ['ay', '두 음성이 **서로 다른 글자 이름**으로 읽는다: Samantha 는 글자 이름 I(=`eye`/`i`/`igh` 와 바이트 동일), Alex 는 글자 이름 A(=`a`/`eh` 와 바이트 동일). 즉 같은 데이터가 기기 음성에 따라 다른 소리를 가르친다. /ei/ 는 `a`, /ai/ 는 `eye` 를 써라'],
])

// 단일 소문자 한 글자는 예외 없이 글자 **이름**으로 읽힌다(s==ess, n==en,
// m==em, l==el, r==ar, f==ef, z==zee, u=="you", o=="oh", i=="eye"). 즉 소리를
// 가르치려는 자리에서 정확히 반대의 것을 들려준다. 유일한 예외는 `a` 인데,
// 그건 AI 계열의 /ei/ 를 **의도적으로** 글자 이름으로 내는 자리다
// (그래서 확정 충돌쌍 a==eh 가 존재한다 -- 위 SPEECH_COLLISION_PAIRS 참조).
const LETTER_NAME_ONLY = /^[b-z]$/

// ---------- 한 발화 = 한 소리 (반복 금지) ----------
// 사용자가 실기기 QA 2차에서 반복 형식 전체를 반려했다. 원문:
// "sss 이거 영 별로야. s 소리가 나고 나서 쉬었다가 s 소리가 나야 할 것 같아.
//  ... 파닉스에서 sss를 빠르고 연속적으로 가르치는건 없을 것 같은데? 확인하고
//  전체적으로 3번 2번 빠르게 반복하는건 다 지우자 한번만 똑바로 읽어 주는게
//  좋겠어, 어짜피 반복해서 들을 수 있는 버튼도 만들어 놨잖아."
// 그리고 보스 블렌드의 이질감: "sss aaa tuh tuh tuh 이러더라구... tuh 만
// 이질적이라서 반응이 '이거 대체 왜이래'였어. 그냥 똑같이 /s/ /a/ /t/ 이렇게
// 한번 똑바로 발음 해주는게 좋을 것 같아."
//
// 이건 이전 라운드(`f41e5e8` 콤마 삼중)의 **의도적 되돌림**이다. 그 라운드의
// 측정은 맞았다(파열음 단일 렌더가 445~534ms 로 지속음의 절반이다). 처방이
// 틀렸다 -- 반복은 "또박또박" 이 아니라 "빠르게 연속" 으로 들렸고, 슬롯마다
// 형태가 달라져 블렌드가 비균질해졌다. 반복이 필요한 아이에게는 **다시듣기
// 버튼**이 이미 있다(wireTeachButtons). 그게 사용자의 판단이다.
//
// 그래서 규칙을 뒤집는다: **모든 발화 필드는 토큰 하나여야 한다.**
// 콤마 묶음('tuh, tuh, tuh')도, 공백 연결('a a a' -- 엔진이 압축해 더 나쁘다)도,
// 서로 다른 단어의 cramming('ss sun ss')도 전부 같은 검사에 걸린다.
// 반복이 필요하면 배열 **원소**를 늘리는 것이지 한 발화 안에서 반복하지 않는다
// -- 원소 사이에는 speakSequence 의 1100ms 침묵이 들어간다.
const SPEECH_TOKEN_SPLIT = /[,\s]+/

// 발화 필드를 **그 안의 소리 하나**로 정규화한다. 위 규칙이 토큰 하나를
// 강제하므로 지금은 사실상 항등함수지만, 아래 충돌 검사들이 원문 문자열을
// 비교하기 때문에 남겨둔다 -- 누군가 다시 콤마를 넣으면 반복 금지 검사가
// 잡아내기 **전에** 충돌 검사가 조용히 통과해버린다(콤마 도입 시점에 이 앱에서
// 그 형태가 55개 프롬프트 그룹이었고, 실패가 아니라 통과로 사라졌다).
// 충돌은 표기가 아니라 소리의 속성이므로 비교는 언제나 소리로 한다.
function soundOf(text) {
  if (typeof text !== 'string') return text
  const tokens = text.trim().split(SPEECH_TOKEN_SPLIT).filter(Boolean)
  return tokens.length ? tokens[0] : text
}

// 발화 필드 하나에 대한 표기 검사. **두 자리에서 같은 함수를 불러야 한다** --
// recapAudio.en 은 spoken[] 을 타지 않아서 규칙이 갈라지면 리워드 화면만 낡은
// 형식으로 남는다(실제로 콤마 계급이 그렇게 두 벌로 갈려 있었다).
function checkSpeechNotation(problems, field, text) {
  if (typeof text !== 'string' || !text.trim()) return
  const raw = text.trim()
  const tokens = raw.split(SPEECH_TOKEN_SPLIT).filter(Boolean)
  if (tokens.length > 1) {
    const distinct = new Set(tokens.map((t) => t.toLowerCase()))
    problems.push(
      `${field}: 한 발화에 토큰 ${tokens.length}개 ('${raw}') -- 발화 하나 = 소리 하나다. ` +
        (distinct.size === 1
          ? `같은 소리를 콤마나 공백으로 반복하지 마라. 사용자가 실기기에서 반려했다: ` +
            `"전체적으로 3번 2번 빠르게 반복하는건 다 지우자 한번만 똑바로 읽어 주는게 ` +
            `좋겠어, 어짜피 반복해서 들을 수 있는 버튼도 만들어 놨잖아." 반복은 ` +
            `다시듣기 버튼이 담당한다`
          : `서로 다른 것을 한 문자열에 cramming 하면 TTS 가 이어 읽어 아이가 개별 ` +
            `소리를 못 잡는다 (사용자가 'ss sun ss' 를 듣고 반려한 지점이다). ` +
            `나눠 담을 자리는 배열 원소이고, 원소 사이에 1100ms 침묵이 들어간다`) +
        `. '${tokens[0]}' 하나만 남겨라`
    )
    return
  }
  // 글자꼴(대문자 1~2자)은 TTS 가 글자 **이름**으로 읽는 것이 의도인 유일한 자리다.
  if (LETTERFORM.test(tokens[0])) return
  const sound = tokens[0].toLowerCase()
  const misread = MISREAD_NOTATIONS.get(sound)
  if (misread) {
    problems.push(
      `${field}: 소리 표기 '${sound}' 는 오독된다 -- ${misread}. ` +
        `(재현: say -v Samantha -o a.aiff "${sound}" 로 합성해 비교 대상과 cmp 해라 ` +
        `-- say 는 결정적이라 0 바이트 차이면 같은 발화다)`
    )
  } else if (LETTER_NAME_ONLY.test(sound)) {
    problems.push(
      `${field}: 소리 표기 '${sound}' 는 소문자 한 글자라 TTS 가 글자 **이름**으로 ` +
        `읽는다 (s=="ess" n=="en" m=="em" l=="el" r=="ar" f=="ef" z=="zee" ` +
        `u=="you" o=="oh" i=="eye", 두 음성 모두 바이트 동일) -- 소리를 가르치려는 ` +
        `자리에서 정반대다. 지속음은 3자 반복(sss/nnn/lll), 파열음은 ` +
        `'<자음>uh'(tuh/puh/kuh) 형을 써라`
    )
  }
}

// ---------- 정답 위치 편향 ----------
// 사용자가 실기기에서 신고했다: "해당 문제들의 정답이 모두 첫번째네.. 이건
// 난이도의 문제가 있어." 전수 측정으로 훨씬 심각한 것이 드러났다 -- 단일 정답
// 문항 158개 중 정답이 1번인 것이 127개(80%)였고, `choose-sequence` 는
// 48/48 = **100%** 였다. 즉 **아무 소리도 듣지 않고 항상 첫 칸만 눌러도 80%를
// 맞는다.** 오답 패널티가 없는 앱이므로 크래시도 로그도 없이 평가만 무의미해진다.
// 게다가 보기 3개 문항에서 2번이 정답인 사례가 `choose` 108개 중 0개였다 --
// 아이가 가운데 칸을 한 번도 정답으로 만난 적이 없었다.
//
// 이건 문항 하나하나를 보면 절대 안 보이는 결함이다(각 문항은 완벽히 정상이다).
// **집계로만 보이므로 집계로 검사한다.** 챕터 8~33 은 각각 다른 세션이 쓸
// 것이고, 저자는 자연스럽게 정답을 먼저 적는다(그게 이 편향의 원인이다).
//
// 판정은 두 축이다. 하나만으로는 새는 구멍이 있다:
//   1) 최다 슬롯 점유율 -- "항상 k번만 누르는 아이" 의 정답률이다. 우연
//      기대치는 문항별 1/n 의 평균이고(보기 개수가 섞여도 옳다), 여기에
//      +20%p 여유를 준다. 22문항 챕터에서 8/7/7 은 36%로 통과하고,
//      수정 전의 17/0/5 는 77%로 걸린다.
//   2) 한 번도 쓰이지 않은 슬롯 -- 위 점유율이 45/55/0 같은 분포를 통과시킨다.
//      그 슬롯이 존재하는 문항이 6개 이상인데 정답이 0번이면 걸린다.
// 표본이 작으면(6문항 미만) 우연으로도 쏠리므로 침묵한다.
//
// 집계 단위는 **둘** 이다. 챕터 하나만 보면 구멍이 있다: `choose` 15문항이
// 5/5/5 로 고르고 `choose-sequence` 6문항이 전부 1번이면 챕터 합계는 11/5/5
// (52%) 로 통과하는데, 아이 입장에서는 퀵파이어가 나올 때마다 첫 칸이 정답이다.
// 실제 신고도 정확히 그 모양이었다 -- `choose-sequence` 가 **48/48 = 100%** 였다.
// 그래서 커리큘럼 전체를 kind 별로도 본다. kind 별 챕터 단위는 표본이 6~8개라
// 우연으로 4/6 이 나오는 확률이 30% 나 되어 검사가 될 수 없지만(경보가 잦으면
// 무시된다), 커리큘럼 전체는 kind 하나가 수십 문항이라 판정이 안정적이다.
const SLOT_BIAS_HEADROOM = 0.2
const SLOT_BIAS_MIN_ITEMS = 6

// items: [{ at, slot, n }] -- slot 은 0-based, n 은 그 문항의 보기 개수.
function slotBiasProblems(label, items, subject) {
  const problems = []
  if (items.length < SLOT_BIAS_MIN_ITEMS) return problems
  const total = items.length
  const widest = Math.max(...items.map((a) => a.n))
  // 우연 기대치는 문항별 1/n 의 평균 -- 보기 개수가 섞인 집합에서도 옳다.
  const chance = items.reduce((sum, a) => sum + 1 / a.n, 0) / total
  const limit = Math.max(0.5, chance + SLOT_BIAS_HEADROOM)
  const hits = []
  const avail = []
  for (let k = 0; k < widest; k++) {
    hits[k] = items.filter((a) => a.slot === k).length
    avail[k] = items.filter((a) => a.n > k).length
  }
  const spread = hits.map((h, k) => `${k + 1}번 ${h}`).join(' · ')
  const worst = hits.indexOf(Math.max(...hits))
  if (hits[worst] / total > limit) {
    problems.push(
      `${label}: ${subject} ${total}개 중 정답이 ${worst + 1}번 칸인 것이 ${hits[worst]}개 ` +
        `(${Math.round((hits[worst] / total) * 100)}%, 상한 ${Math.round(limit * 100)}%) ` +
        `[${spread}] -- 아이가 소리를 듣지 않고 항상 ${worst + 1}번만 눌러도 그만큼을 ` +
        `맞는다. 평가가 무의미해지므로 보기 순서를 흩어라 (정답만 옮기고 오답끼리의 ` +
        `순서는 유지하면 된다)`
    )
  }
  for (let k = 0; k < widest; k++) {
    if (hits[k] === 0 && avail[k] >= SLOT_BIAS_MIN_ITEMS) {
      problems.push(
        `${label}: ${k + 1}번 칸이 정답인 ${subject}이 0개다 (그 칸이 있는 문항 ` +
          `${avail[k]}개) [${spread}] -- 아이가 그 칸을 한 번도 정답으로 만나지 ` +
          `않는다. 저자가 정답을 먼저 적는 습관이 만드는 편향이다`
      )
    }
  }
  return problems
}

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
// 소리 토큰 **상한**. 직전 라운드는 이걸 하한 2개로 두고 있었는데, 사용자가
// 실기기 QA 2차에서 반복 형식 전체를 반려했다 -- "전체적으로 3번 2번 빠르게
// 반복하는건 다 지우자 한번만 똑바로 읽어 주는게 좋겠어, 어짜피 반복해서 들을
// 수 있는 버튼도 만들어 놨잖아." 하한을 그대로 두면 **검증기가 사용자가 반려한
// 형식을 강제한다.** 그래서 방향을 뒤집는다: 소리는 정확히 한 번, 글자꼴 이름도
// 최대 한 번. 반복은 배열 원소가 아니라 다시듣기 버튼(wireTeachButtons)이 담당한다.
const MAX_DRILL_SOUND_TOKENS = 1
const MAX_DRILL_LETTERFORM_TOKENS = 1

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
  // 정답 위치 편향은 문항 하나를 봐서는 안 보이고 집계로만 보인다 -- 챕터
  // 단위와 커리큘럼 전체 kind 단위, 두 곳에서 본다.
  const allAnswerSlots = []
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
    // 이 챕터의 단일 정답 문항들이 정답을 어느 칸에 두었는지. 챕터 단위로
    // 집계해야 의미가 있으므로 스테이지 루프 밖에서 모은다.
    const answerSlots = []

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
      // 보스 스테이지의 "조립할 단어" 와 "낱소리 -> 단어 블렌드 시연" 을 짝지어
      // 본다 (아래 블렌드 계약).
      const buildTargets = []
      const blends = []

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
          } else {
            answerSlots.push({
              at,
              kind: beat.kind,
              slot: options.findIndex((o) => o.correct),
              n: options.length,
            })
          }
          if (checkSpeechCollisions) {
            const tileSounds = options
              .filter((o) => o.icon === 'letterTile' && o.say)
              // soundOf: 충돌은 표기가 아니라 **소리**의 속성이다. 콤마 묶음이
              // 들어오면 원문 비교는 조용히 통과해버린다 -- soundOf 정의 위의
              // 주석 참조.
              .map((o) => ({ id: o.id, say: soundOf(o.say) }))
            const bySay = new Map()
            for (const o of options) {
              if (o.icon !== 'letterTile' || !o.say) continue
              const key = soundOf(o.say)
              if (!bySay.has(key)) bySay.set(key, [])
              bySay.get(key).push(o)
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
              const promptSound = soundOf(promptAudio)
              for (const t of tileSounds) {
                const o = options.find((x) => x.id === t.id)
                if (o.correct) continue
                const same =
                  t.say === promptSound ||
                  SPEECH_COLLISION_PAIRS.some(
                    ([x, y]) =>
                      (t.say === x && promptSound === y) || (t.say === y && promptSound === x)
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
            if (option.say !== undefined)
              spoken.push([`${at}/${option.id} say`, option.say])
          }
        }

        if (beat.kind === 'listen-repeat' || beat.kind === 'finale') {
          if (!Array.isArray(beat.words) || !beat.words.length) {
            problems.push(`${at}: ${beat.kind} 에 words 없음`)
          } else {
            // 블렌드 시연의 형태: 앞은 글자꼴 { text, say }, 마지막은 합친 단어.
            const last = beat.words[beat.words.length - 1]
            const head = beat.words.slice(0, -1)
            if (
              head.length &&
              typeof last === 'string' &&
              head.every((w) => w && typeof w.text === 'string' && w.text)
            ) {
              blends.push({ at, word: last, slots: head.map((w) => w.text) })
            }
            beat.words.forEach((word, i) => {
              if (typeof word === 'string') {
                displayed.push([`${at} words[${i}]`, word])
              } else if (word && typeof word.text === 'string' && word.text) {
                checkKeys(problems, `${at} words[${i}]`, word, SPOKEN_PAIR_KEYS, 'word')
                displayed.push([`${at} words[${i}].text`, word.text])
                if (word.say !== undefined)
                  spoken.push([`${at} words[${i}].say`, word.say])
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
          buildTargets.push({ at, word: slots.join(''), slots })
        }

        if (beat.readAloud) {
          checkKeys(problems, at, beat.readAloud, READ_ALOUD_KEYS, 'readAloud')
          displayed.push([`${at} readAloud.targetText`, beat.readAloud.targetText])
          if (beat.readAloud.say !== undefined)
            spoken.push([`${at} readAloud.say`, beat.readAloud.say])
        }
        if (beat.letter) displayed.push([`${at} letter`, beat.letter])
        if (beat.promptLetter) displayed.push([`${at} promptLetter`, beat.promptLetter])
        if (beat.promptAudio !== undefined)
          spoken.push([`${at} promptAudio`, beat.promptAudio])
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
          if (!sounds.length) {
            problems.push(
              `${at}: 소리 드릴 repeatAudio 에 소리 토큰이 없다 -- 글자꼴 이름만 ` +
                `남으면 아이는 글자 이름("에스")만 듣고 소리를 한 번도 못 듣는다`
            )
          }
          if (sounds.length > MAX_DRILL_SOUND_TOKENS) {
            problems.push(
              `${at}: 소리 드릴 repeatAudio 의 소리 토큰이 ${sounds.length}개 ` +
                `(최대 ${MAX_DRILL_SOUND_TOKENS}개) -- 소리는 한 번만 또박또박 ` +
                `들려준다. 사용자가 실기기에서 반복 형식 전체를 반려했고, 반복이 ` +
                `필요한 아이에게는 다시듣기 버튼이 이미 있다`
            )
          }
          const letterforms = tokens.filter((t) => LETTERFORM.test(t))
          if (letterforms.length > MAX_DRILL_LETTERFORM_TOKENS) {
            problems.push(
              `${at}: 소리 드릴 repeatAudio 에 글자꼴 이름이 ${letterforms.length}번 ` +
                `[${letterforms.join(' / ')}] -- 글자 이름도 한 번이면 충분하다. ` +
                `['${beat.letter || 'X'}', '<소리>'] 두 원소가 이 beat 의 표준 형태다`
            )
          }
        }

        for (const [i, line] of (beat.repeatAudio || []).entries()) {
          // 보스 teach/break 은 낱소리 -> 단어 **블렌딩 시연**이고 각 슬롯이
          // 화면의 글자 등식과 1:1 이다. 비보스는 한 소리 드릴이다. 두 경우 모두
          // 원소 하나 = 발화 하나 = 소리 하나이고, 원소 사이 1100ms 침묵이
          // 아이가 따라할 시간이다 -- 아래 단일 토큰 검사가 전부 강제한다.
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
            } else {
              // recapAudio.en 은 spoken[] 을 타지 않으므로 같은 검사를 여기서 부른다.
              checkSpeechNotation(problems, `${where}: recapAudio.en[${i}]`, line)
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

      // ---------- 표기 검사: 오독 · 한 발화 = 한 소리 ----------
      // 직전 라운드는 여기서 **콤마 삼중을 강제**하고 있었다(f41e5e8). 사용자가
      // 실기기 QA 2차에서 그 형식을 반려했으므로 규칙을 뒤집는다 -- 검증기가
      // 사용자가 반려한 형식을 강제하는 상태를 남겨둘 수 없다. 대신 그 라운드가
      // 검사하지 않던 축(표기가 다른 어휘 항목으로 렌더되는 오독)을 넣는다.
      // 그게 실제 결함이었다: 아이가 'iii' 자리에서 "three" 를 들었다.
      for (const [field, text] of spoken) {
        checkSpeechNotation(problems, field, text)
      }

      for (const [field, text] of displayed) {
        if (typeof text !== 'string') continue
        // LETTERFORM(대문자 1~2자)은 이 검사에서 면제한다. SOUND_NOTATION 이
        // `/^(.)\1+$/i` 라서 **같은 글자가 겹친 다이그래프를 소리 표기로 오인**한다
        // -- 챕터 8 의 `EE`, Jolly group 5 의 `OO` 두 개가 정확히 여기 걸린다.
        // 챕터 1~7 은 다이그래프가 `AI`/`OA` 라서 우연히 통과하고 있었고, 그래서
        // 이 결함은 group 4 후반에 처음 드러났다. 검사의 목적은 `sss` 같은 소문자
        // 소리 표기가 화면으로 새는 것이고, 대문자 1~2자는 정의상 글자꼴이다.
        if (LETTERFORM.test(text)) continue
        if (SOUND_NOTATION.test(text) || CHOPPED_NOTATION.test(text)) {
          problems.push(`${field}: 화면에 소리 표기 '${text}' 노출 -- 표시는 실제 글자·단어여야 함`)
        }
      }

      // ---------- 보스 블렌드 계약: 조립할 단어마다 낱소리 시연 ----------
      // 사용자 원문: "dog 는 좋은데 gum 발음이 명확하지 않네, `d o g dog`
      // `g u m gum` 이런 구조로 가는게 맞는 것 같아."
      //
      // 진단해보니 구조는 이미 그랬는데 **첫 단어만** 그랬다. 두 단어 보스
      // 5개(cat/hen · mat/red · dog/gum · fit/big · rain/boat) 전부에서 첫
      // 단어는 낱소리 -> 단어 블렌드를 listen-repeat 으로 받고(글자가 화면에
      // 뜬 채 아이가 따라 말한다), 두 번째 단어는 `words: ['gum']` 한 줄뿐이라
      // **구성 소리가 한 번도 모델링되지 않았다.** 아이는 gum 을 통째로 듣고
      // 통째로 조립하라는 요구를 받는다 -- 파닉스 앱에서 정확히 반대다.
      // (break 의 repeatAudio 에는 낱소리가 있지만 그건 자동재생/다시듣기
      // beat 이고, 따라 말하는 자리도 글자와 소리가 짝지어 뜨는 자리도 아니다.)
      //
      // 결함이 5개 챕터에 똑같이 있었다는 것 자체가 산문 규칙의 한계다.
      // 그래서 계약으로 만든다: **보스가 조립하라고 요구하는 단어는 모두, 그
      // 단어의 슬롯 순서대로 낱소리를 들려준 뒤 합쳐 말하는 블렌드 beat 을
      // 가져야 한다.** 슬롯에서 유도하므로 다이그래프도 그대로 통과한다
      // (rain 은 R + AI + N 세 슬롯이고 R+A+I+N 네 개가 아니다).
      if (stage.chapterBoss) {
        const seen = new Set()
        for (const t of buildTargets) {
          if (seen.has(t.word.toUpperCase())) continue
          seen.add(t.word.toUpperCase())
          const key = t.slots.join('|').toUpperCase()
          const ok = blends.some(
            (b) =>
              b.word.toUpperCase() === t.word.toUpperCase() &&
              b.slots.join('|').toUpperCase() === key
          )
          if (!ok) {
            const near = blends.find((b) => b.word.toUpperCase() === t.word.toUpperCase())
            problems.push(
              `${where}: 보스가 '${t.word}' 를 조립하게 하는데(${t.at}) ` +
                `'${t.slots.join(' ')} ${t.word.toLowerCase()}' 블렌드 시연이 없다` +
                (near
                  ? ` -- ${near.at} 의 슬롯이 [${near.slots.join(' ')}] 로 어긋난다`
                  : ` -- listen-repeat 의 words 를 ` +
                    `[${t.slots.map((s) => `{ text: '${s}', say: ... }`).join(', ')}, ` +
                    `'${t.word.toLowerCase()}'] 로 써라`) +
                `. 단어를 통째로만 들려주면 아이가 구성 소리를 한 번도 모델로 ` +
                `받지 못한 채 조립을 요구받는다 (사용자가 실기기에서 'gum 발음이 ` +
                `명확하지 않네' 로 신고한 결함이다)`
            )
          }
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

    problems.push(...slotBiasProblems(chapter.id, answerSlots, '단일 정답 문항'))
    allAnswerSlots.push(...answerSlots)
  }

  // 커리큘럼 전체를 kind 별로. 챕터 단위 집계가 통과시키는 "한 kind 만 쏠린"
  // 모양을 잡는다 -- 신고된 결함이 정확히 그것이었다(`choose-sequence` 48/48).
  const byKind = new Map()
  for (const a of allAnswerSlots) {
    if (!byKind.has(a.kind)) byKind.set(a.kind, [])
    byKind.get(a.kind).push(a)
  }
  for (const [kind, items] of byKind) {
    problems.push(...slotBiasProblems('전체 커리큘럼', items, `${kind} 문항`))
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
