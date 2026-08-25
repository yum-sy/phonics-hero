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
import { chapter9 } from './chapter-09.js'
import { chapter10 } from './chapter-10.js'
import { chapter11 } from './chapter-11.js'
import { chapter12 } from './chapter-12.js'
import { chapter13 } from './chapter-13.js'
import { chapter14 } from './chapter-14.js'

export const chapters = [
  chapter1,
  chapter2,
  chapter3,
  chapter4,
  chapter5,
  chapter6,
  chapter7,
  chapter8,
  chapter9,
  chapter10,
  chapter11,
  chapter12,
  chapter13,
  chapter14,
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

// ============================================================================
// 소리 표기 표 -- Jolly Group 1~7 전수. **챕터 9~33 은 조회만 하면 된다**
// ============================================================================
// 챕터 8 파일럿의 교훈 2번이 이 표를 만들라고 했다: "소리 표기를 계열 단위로
// 몰아서 확정해라. 이 챕터 작업의 절반이 표기 측정이었다."
//
// --- 방법론 개선: pairwise cmp 를 해시 그룹핑으로 바꿨다 -------------------
// `say` 는 결정적이므로 **md5 해시가 곧 파형 동일성**이다. 후보 n 개를 미끼
// m 개와 `cmp` 하면 n*m 번 합성해야 하지만, 전부 한 번씩 합성해 해시로
// 그룹핑하면 n+m 번에 전 쌍의 판정이 끝난다. 그래서 **음성별 고유 텍스트 763개**
// (= 9 라운드, say 호출 1526회)로 후보 190여종을 미끼 전부와 비교했다. pairwise
// cmp 로 같은 범위를 보려면 수만 번 합성해야 한다. 라운드를 늘리는 것이 곧
// 미끼를 늘리는 것이고, **이전 라운드가 놓친 충돌이 소급으로 잡힌다** --
// 실제로 그렇게 잡혔다(아래).
//
// --- 이 라운드가 발견한 새 오독 축: 낱자 이름 **나열** --------------------
// 지금까지의 미끼는 (a) 낱자 이름 하나 (b) 숫자 (c) 로마 숫자 (d) 어휘
// (e) 감탄사 였다. **"낱자 이름을 여러 개 이어 읽은 것"은 아무도 검사하지
// 않았다.** 그 미끼를 넣자 후보 절반이 죽고 **이미 출하된 표기 6개도 죽었다**:
//
//   sss  == "ess ess ess"        (S) 두 음성 모두. **앱의 첫 소리다**
//   ihh  == "eye aitch aitch"    (I) 두 음성 모두. `iii`=="three" 를 고친 표기다
//   aaa  == "ay ay ay"           (A) Alex
//   fff  == "eff eff eff"        (F) Alex
//   rrr  == "ar ar ar"           (R) Samantha
//   mmm  == "em em em"           (M) Samantha
//   lll  == "el el el"           (L) Samantha
//
// **사용자의 첫 불만이 이것이었을 가능성이 높다.** 원문: "sss 이거 영 별로야.
// s 소리가 나고 나서 쉬었다가 s 소리가 나야 할 것 같아. ... 파닉스에서 sss를
// 빠르고 연속적으로 가르치는건 없을 것 같은데?" -- `sss` 가 "ess ess ess" 로
// 렌더되면 그건 정확히 **낱자 이름이 빠르게 세 번** 나는 것이다. 직전
// 라운드(`4027bb3`)는 그 불만을 "반복 형식이 나쁘다" 로 읽고 배열 원소의
// 반복을 없앴는데, 반복은 **표기 안에** 그대로 남아 있었다(한 토큰이 세
// 음절로 렌더된다). 이 표는 그 표기들을 아직 **교체하지 않았다** -- 아이가
// 듣는 것을 챕터 1~6 의 100곳 이상에서 바꾸는 일이라 지시가 필요하다.
// `broken` 필드가 그 사실을 들고 있고, 교체 후보는 `alt` 에 있다.
//
// 반대로 `nnn`(748/610) · `awh`(1329/1620) · `ee`(482/575) · `or`(384/413) 은
// 깨끗하다. 즉 **"3자 반복은 안전하다" 는 이 파일의 옛 주석은 s/r/m/l/v/z 에서
// 틀렸고 a/n/f 에서만 맞았다.** 규칙으로 유도할 수 없다 -- 글자마다 다르다.
//
// --- 두 번째 발견: CV 관례(`Xuh`)가 **마찰음에서** 무너진다 ---------------
// 이 앱의 파열음 관례는 `tuh`/`kuh`/`buh`/`duh`/`guh`/`juh` 다. 같은 형태를
// 마찰음에 쓰면 **Alex 가 이미 가르친 글자로 접는다**:
//   zzuh == juh  (359.3ms, J = 챕터 7)     `zuh` 도 같다
//   vvuh == buh  (323.6ms, B = 챕터 6)     `vuh` 도 같다
//   ffuh == puh  (361.5ms, P = 챕터 2)
// 기존 `buh`/`duh` 주석("Alex 가 b/d + 슈와를 파싱하지 못한다")의 일반형이다.
// Alex 는 마찰음 + 슈와를 **같은 조음 위치의 파열음/파찰음**으로 접는다
// (z->j, v->b, f->p). 그래서 Z 는 `zze`, V 는 `vve`, F 의 대체 후보는 `ffe` 로
// **모음을 e 로 바꿔** 피했다. 새 마찰음 표기를 만들 때 `Xuh` 를 먼저 시도하면
// 이 함정에 그대로 걸린다.
//
// --- 판정 기준 ------------------------------------------------------------
// `proof` 필드:
//   'phoneme'  -- 목표음과 같은 소리를 내는 **어휘 항목과 바이트 동일**이라
//                 소리 자체가 증명된 것 (a=글자이름A, eye=글자이름I, u="you",
//                 or==ore==oar 수렴). 가장 강한 등급이다
//   'clean'    -- 위 763 텍스트 x 2음성 해시 공간에서 충돌 0. **음소 자체는 미증명**이고
//                 `ough` 가 유령 음소를 가르쳤던 실패 모드가 여기 남아있다.
//                 실기기 청취가 필요한 등급이다
//
// `ms` 는 [Samantha, Alex] 이고 `-r 88`(= audio.js EN_RATE 0.5) 실측이다.
// **안전대 500~1200ms 는 이 앱이 지키고 있는 기준이 아니다** -- 기 출하 표기
// 24개 중 14개가 Alex 에서 500ms 미만이다(tuh 328 · buh 324 · duh 326 ·
// guh 329 · puh 362 · kuh 363 · huh 363 · juh 359 · uh 354 · oh 355 · a 413 ·
// eye 412 · or 413 · eh 413). 파열음과 단모음은 조음 시간이 고정이라 표기로
// 늘릴 수 없다(`4027bb3` 의 결론). 그래서 이 표는 **길이보다 오독 없음을
// 우선**했고, 길이는 `ms` 로 그대로 노출한다.
export const NOTATION_REPRO =
  'say -v <Samantha|Alex> -r 88 -o a.aiff -- "<표기>" && md5 -q a.aiff && ' +
  'afinfo a.aiff | grep "estimated duration"   # 해시가 같으면 같은 발화다'

export const SOUND_TABLE = [
  // ---------- Group 1~4 (챕터 1~8, 이미 출하됨) ----------
  { g: 1, letterform: 'S', ipa: '/s/', say: 'sss', ms: [922, 1179], proof: 'clean',
    broken: '두 음성 모두 "ess ess ess"(낱자 이름 S 세 번)와 바이트 동일 -- 교체 필요',
    alt: ['sse'],
    rejected: [
      ['ssss', [689, 1551], 'Samantha 에서 `ss`("ess ess")와 바이트 동일 -- s 는 2개에서 포화한다. ' +
        'Alex 는 포화하지 않는다(ss 889 vs ssss 1551) -- 기존 블랙리스트 주석이 이 포화를 ' +
        '음성 구분 없이 적어두고 있었다'],
      ['ssuh', [578, 455], 'Alex 에서 단어 `sir` 와 바이트 동일'],
      ['ssih', [578, 365], 'Alex 에서 단어 `see` 와 바이트 동일'],
      ['ssu', [863, 1005], 'Samantha 에서 "ess ess you" 와 바이트 동일'],
      ['sso', [887, 970], 'Alex 에서 "ess ess oh" 와 바이트 동일'],
      ['sssh', [1258, 1655], '"ess ess ess aitch" 와 바이트 동일'],
      ['sssu', [543, 420], '두 음성 모두 단어 `sue`/`soo`/`sew` 와 바이트 동일'],
    ] },
  { g: 1, letterform: 'A', ipa: '/ei/', say: 'aaa', ms: [841, 1075], proof: 'clean',
    broken: 'Alex 에서 "ay ay ay"(낱자 이름 A 세 번)와 바이트 동일',
    alt: ['aae'],
    note: 'A 의 목표음은 /ae/(apple)인데 이 표기는 /ei/ 를 낸다 -- 선재 미해결(HANDOFF §3)',
    rejected: [
      ['aaaa', [644, 1400], 'Samantha 에서 `aa` 와 바이트 동일(포화). Alex 는 포화하지 않는다'],
      ['aah', [419, 1318], 'Alex 에서 "ay ay aitch" 와 바이트 동일'],
      ['aauh', [477, 413], 'Alex 에서 `or`(OR, 챕터 8 채택 표기)와 바이트 동일'],
      ['aaeh', [396, 413], '두 음성 모두 400ms 대로 짧다'],
    ] },
  { g: 1, letterform: 'T', ipa: '/t/', say: 'tuh', ms: [534, 328], proof: 'clean' },
  { g: 1, letterform: 'I', ipa: '/i/', say: 'ihh', ms: [1049, 1504], proof: 'clean',
    broken: '두 음성 모두 "eye aitch aitch"(낱자 이름 I·H·H)와 바이트 동일 -- ' +
      '`iii`=="three" 를 고치려고 도입한 표기가 다른 오독으로 옮겨간 것이다',
    alt: ['ieh', 'ihu'],
    rejected: [
      ['ihe', [445, 412], '두 음성 모두 글자 이름 I(`eye`/`i`)와 바이트 동일'],
      ['ihhe', [445, 412], '위와 같음'],
      ['iih', [480, 703], '`iihh` 와 동일. 깨끗하지만 Samantha 480ms'],
    ] },
  { g: 1, letterform: 'P', ipa: '/p/', say: 'puh', ms: [491, 362], proof: 'clean' },
  { g: 1, letterform: 'N', ipa: '/n/', say: 'nnn', ms: [748, 610], proof: 'clean' },
  { g: 2, letterform: 'C', ipa: '/k/', say: 'kuh', ms: [499, 363], proof: 'clean',
    note: 'Jolly 는 c 를 /k/ 로 가르치므로 C 와 K 가 **같은 표기**를 쓴다' },
  { g: 2, letterform: 'K', ipa: '/k/', say: 'kuh', ms: [499, 363], proof: 'clean' },
  { g: 2, letterform: 'E', ipa: '/e/', say: 'eh', ms: [399, 413], proof: 'clean',
    note: '확정 충돌쌍 a==eh (두 음성 바이트 동일). 엔진이 `eh` 를 글자 이름 A 로 정규화한다' },
  { g: 2, letterform: 'H', ipa: '/h/', say: 'huh', ms: [489, 363], proof: 'clean' },
  { g: 2, letterform: 'R', ipa: '/r/', say: 'rrr', ms: [875, 749], proof: 'clean',
    broken: 'Samantha 에서 "ar ar ar"(낱자 이름 R 세 번)와 바이트 동일',
    alt: ['rruh'],
    rejected: [['rrh', [1014, 1074], 'Samantha 에서 "ar ar aitch" 와 바이트 동일']] },
  { g: 2, letterform: 'M', ipa: '/m/', say: 'mmm', ms: [736, 633], proof: 'clean',
    broken: 'Samantha 에서 "em em em"(낱자 이름 M 세 번)와 바이트 동일',
    alt: ['mmh', 'mmo'],
    rejected: [
      ['mmmm', [562, 784], 'Samantha 에서 `mm` 와 바이트 동일(포화). Alex 는 포화하지 않는다'],
      ['mhh', [1084, 1376], 'Samantha 에서 "em aitch aitch" 와 바이트 동일'],
      ['mmmh', [1084, 366], 'Samantha 에서 "em em em aitch" 와 바이트 동일'],
      ['mmhh', [1258, 1527], 'Samantha 에서 "em em aitch aitch" 와 바이트 동일'],
      ['mmu', [759, 703], 'Samantha 에서 "em em you" 와 바이트 동일'],
    ] },
  { g: 2, letterform: 'D', ipa: '/d/', say: 'duh', ms: [446, 326], proof: 'clean',
    note: '확정 충돌쌍 buh/duh -- 같은 문항의 letterTile 로 함께 두지 마라' },
  { g: 3, letterform: 'G', ipa: '/g/', say: 'guh', ms: [446, 329], proof: 'clean' },
  { g: 3, letterform: 'O', ipa: '/o/', say: 'awh', ms: [1329, 1620], proof: 'clean',
    note: '낱자 이름 나열 검사도 통과했다. 다만 음소 미증명이라 실기기 청취 1순위(`4027bb3`)' },
  { g: 3, letterform: 'U', ipa: '/uh/', say: 'uh', ms: [419, 354], proof: 'clean' },
  { g: 3, letterform: 'L', ipa: '/l/', say: 'lll', ms: [863, 587], proof: 'clean',
    broken: 'Samantha 에서 "el el el"(낱자 이름 L 세 번)와 바이트 동일',
    alt: ['lleh', 'lluh'],
    note: 'L 은 깨끗한 후보가 전부 Alex 343ms 다 -- 안전대 안에 있는 대체 표기가 없다',
    rejected: [
      ['llll', [666, 738], 'Samantha 에서 `ll` 와 바이트 동일(포화). Alex 는 포화하지 않는다'],
      ['llh', [956, 1016], 'Samantha 에서 "el el aitch" 와 바이트 동일'],
      ['lllh', [1142, 1167], 'Samantha 에서 "el el el aitch" 와 바이트 동일'],
      ['lhh', [1119, 1365], 'Samantha 에서 "el aitch aitch" 와 바이트 동일'],
      ['llhh', [1305, 1527], 'Samantha 에서 "el el aitch aitch" 와 바이트 동일'],
      ['llu', [805, 715], 'Samantha 에서 "el el you" 와 바이트 동일'],
    ] },
  { g: 3, letterform: 'F', ipa: '/f/', say: 'fff', ms: [864, 1307], proof: 'clean',
    broken: 'Alex 에서 "eff eff eff"(낱자 이름 F 세 번)와 바이트 동일',
    alt: ['ffe', 'ffeh'],
    rejected: [
      ['ffuh', [553, 362], 'Alex 에서 `puh`(P, 챕터 2 채택 표기)와 바이트 동일 -- ' +
        'CV 관례가 무성 마찰음에서도 무너진다(`zzuh`==`juh` · `vvuh`==`buh` 와 같은 축)'],
      ['ffh', [1003, 1376], 'Samantha 에서 "eff eff aitch" 와 바이트 동일'],
      ['ffu', [852, 1028], '두 음성 모두 "eff eff you" 와 바이트 동일'],
    ] },
  { g: 3, letterform: 'B', ipa: '/b/', say: 'buh', ms: [480, 324], proof: 'clean' },
  { g: 4, letterform: 'AI', ipa: '/ei/', say: 'a', ms: [399, 413], proof: 'phoneme',
    note: '글자 이름 A. LETTER_NAME_ONLY 의 의도적 예외 두 개 중 하나' },
  { g: 4, letterform: 'J', ipa: '/j/', say: 'juh', ms: [505, 359], proof: 'clean' },
  { g: 4, letterform: 'OA', ipa: '/ou/', say: 'oh', ms: [419, 355], proof: 'phoneme',
    note: '글자 이름 O 와 바이트 동일 -- OA 의 목표음이 그것이다' },
  { g: 4, letterform: 'IE', ipa: '/ai/', say: 'eye', ms: [445, 412], proof: 'phoneme',
    note: '글자 이름 I 와 두 음성 바이트 동일' },
  { g: 4, letterform: 'EE', ipa: '/i:/', say: 'ee', ms: [482, 575], proof: 'clean',
    note: '낱자 이름 나열("ee ee"/"double e")도 통과. 음소 미증명은 그대로다(챕터 8 헤더)' },
  { g: 4, letterform: 'OR', ipa: '/o:/', say: 'or', ms: [384, 413], proof: 'phoneme',
    note: 'or==ore==oar 가 두 음성에서 수렴 -- 독립 철자 셋이 한 음소로 모이는 것이 증거다' },

  // ---------- Group 5 (Jolly: z w ng v oo oo) ----------
  { g: 5, letterform: 'Z', ipa: '/z/', say: 'zze', ms: [770, 1230], proof: 'clean',
    alt: ['zzeh'],
    rejected: [
      ['zz', [759, 1068], 'Samantha 에서 "zee zee"(낱자 이름 Z 두 번)와 바이트 동일'],
      ['zzz', [212, 1555], 'Samantha 212ms "잠자기" 어휘 항목 (`4027bb3` 이 이미 잡았다)'],
      ['zzzz', [759, 2031], 'Samantha 는 `zz` 에서 포화(= "zee zee"), Alex 는 2031ms'],
      ['zuh', [585, 359], 'Alex 에서 `juh`(J, 챕터 7 채택 표기)와 바이트 동일'],
      ['zzuh', [585, 359], 'Alex 에서 `juh` 와 바이트 동일 -- CV 관례가 유성 마찰음에서 무너진다'],
      ['zhh', [1130, 1532], 'Samantha 에서 "zee aitch aitch" 와 바이트 동일'],
      ['zzhh', [1386, 2066], 'Samantha 에서 "zee zee aitch aitch" 와 바이트 동일'],
      ['zzu', [875, 1219], 'Samantha 에서 "zee zee you" 와 바이트 동일'],
      ['zzo', [909, 1230], 'Samantha 에서 "zee zee oh" 와 바이트 동일'],
      ['zih', [585, 336], '`zzih` 와 동일이고 Alex 336ms -- 짧고 /i/ 가 섞인다'],
    ] },
  { g: 5, letterform: 'W', ipa: '/w/', say: 'weh', ms: [521, 331], proof: 'clean',
    alt: ['wah', 'waa'],
    note: '/w/ 는 활음이라 홀로 늘릴 수 없다. Alex 331ms 는 tuh(328)/buh(324) 와 같은 등급이다',
    rejected: [
      ['wuh', [358, 331], 'Samantha 에서 `woo`, Alex 에서 `whoa` 와 바이트 동일'],
      ['wu', [358, 354], 'Samantha `woo` · Alex `ew`/`ugh`/`woo` 와 바이트 동일'],
      ['wih', [521, 308], 'Alex 에서 단어 `we` 와 바이트 동일'],
      ['wuhh', [521, 331], 'Alex 에서 `whoa`/`were` 와 바이트 동일'],
      ['wwuh', [521, 331], 'Alex 에서 `whoa` 와 바이트 동일'],
      ['whuh', [521, 331], 'Alex 에서 `were`/`whoa` 와 바이트 동일'],
      ['whh', [1382, 1752], '안전대 상단을 두 음성 모두 크게 초과'],
    ] },
  { g: 5, letterform: 'NG', ipa: '/ng/', say: 'ngh', ms: [968, 1098], proof: 'clean',
    alt: ['ngg', 'nng'],
    note: '뒤에 h 를 붙이는 이 앱의 관례(ihh/awh/erh/arh)와 같은 형태이고, ' +
      '낱자 이름 나열("en gee aitch")과도 다르다',
    rejected: [
      ['ng', [412, 552], 'Samantha 412ms -- 파열음보다도 짧다'],
      ['ung', [474, 517], '앞에 /u/ 가 붙어 들린다'],
      ['nghh', [1316, 1608], '안전대 상단 초과'],
      ['unng', [376, 471], '두 음성 모두 짧다'],
    ] },
  { g: 5, letterform: 'V', ipa: '/v/', say: 'vve', ms: [697, 979], proof: 'clean',
    alt: ['vvu', 'vvhu'],
    rejected: [
      ['vvv', [848, 1072], 'Samantha 에서 "vee vee vee"(낱자 이름 V 세 번)와 바이트 동일'],
      ['vuh', [502, 324], 'Alex 에서 `buh`(B, 챕터 6 채택 표기)와 바이트 동일'],
      ['vvuh', [502, 324], 'Alex 에서 `buh` 와 바이트 동일 -- CV 관례가 유성 마찰음에서 무너진다'],
      ['vv', [569, 735], 'Samantha 에서 `vvvv` 와 동일(포화)'],
      ['vvh', [964, 1339], 'Samantha 에서 "vee vee aitch" 와 바이트 동일'],
      ['vhh', [1103, 1513], 'Samantha 에서 "vee aitch aitch" 와 바이트 동일'],
      ['vvu', [813, 944], '깨끗하다. `vve` 와 동급이라 차점자로 남긴다'],
      ['vvo', [848, 956], 'Samantha 에서 "vee vee oh" 와 바이트 동일'],
      ['vih', [502, 334], '`vvih` 와 동일이고 /i/ 가 섞인다'],
    ] },
  { g: 5, letterform: 'OO', ipa: '/u:/', say: 'uuu', ms: [685, 795], proof: 'clean',
    alt: ['uu', 'oouu'],
    note: 'OO 는 **한 글자꼴에 소리가 둘**이다 -- 아래 multiSoundLetterforms() 규칙 참조',
    rejected: [
      ['oo', [654, 575], 'Samantha 에서 "oh oh"(낱자 이름 O 두 번)와 바이트 동일'],
      ['oooo', [654, 982], 'Samantha 에서 `oo` 와 동일(포화) = "oh oh"'],
      ['ooo', [384, 761], 'Samantha 에서 `ooh`/`oohh`/`ew` 와 바이트 동일'],
      ['ooh', [384, 354], 'Samantha 에서 `ooo`/`oohh`/`ew` 와 바이트 동일'],
      ['ooou', [1046, 912], 'Samantha 에서 "oh oh oh you" 와 바이트 동일'],
      ['oooh', [477, 378], '두 음성 모두 짧고 `oh`(OA) 와 눈으로 헷갈린다'],
    ] },
  { g: 5, letterform: 'OO', ipa: '/u/', say: 'uuh', ms: [1033, 1132], proof: 'clean',
    alt: ['ooe', 'oohu'],
    note: 'Jolly 의 짧은 oo(book). 음소 미증명이고 **실기기 청취 1순위**다 -- ' +
      '긴 oo(`uuu`)와 짧은 oo(`uuh`)를 아이가 실제로 구별하는지가 이 챕터의 성패다. ' +
      '구별되지 않으면 낱소리 드릴을 긴 oo 하나로 줄이고 짧은 oo 는 단어(book/foot)로만 가르쳐라',
    rejected: [
      ['oou', [837, 691], 'Samantha 에서 "oh oh you" 와 바이트 동일'],
      ['oohh', [384, 354], 'Samantha `ooh`/`ooo`/`ew` · Alex `ugh`/`woo`/`wu` 와 바이트 동일'],
      ['uhh', [388, 1399], 'Samantha 에서 `ugh` 와 바이트 동일 + 음성 간 3.6배'],
      ['ouh', [419, 435], '두 음성 모두 감탄사 `ow` 와 바이트 동일'],
      ['uuhh', [477, 413], '두 음성 모두 짧다'],
    ] },

  // ---------- Group 6 (Jolly: y x ch sh th th) ----------
  { g: 6, letterform: 'Y', ipa: '/y/', say: 'yyuh', ms: [627, 621], proof: 'clean',
    rejected: [
      ['yuh', [546, 331], 'Alex 에서 글자 이름 U(`u`)와 바이트 동일 -- Y 자리에서 UE 소리가 난다'],
      ['yu', [384, 331], '두 음성 모두 `you`/`yoo`/`yew`/`ewe` 군집과 동일 = /ju:/ (UE 의 소리다)'],
      ['yih', [546, 308], 'Alex 308ms'],
      ['yuhh', [546, 296], 'Samantha 에서 `yuh` 와 동일'],
    ] },
  { g: 6, letterform: 'X', ipa: '/ks/', say: 'ksuh', ms: [667, 642], proof: 'clean',
    note: '/ks/ 계열 후보 9종 중 **유일한 생존자**다. 나머지는 전부 낱자 이름 나열로 접힌다',
    rejected: [
      ['ks', [689, 903], '두 음성 모두 "kay ess" 와 바이트 동일'],
      ['kss', [922, 1205], '두 음성 모두 "kay ess ess" 와 바이트 동일'],
      ['ksss', [1165, 1542], '"kay ess ess ess" 와 바이트 동일'],
      ['cks', [1020, 1212], 'Samantha 에서 "see kay ess" 와 바이트 동일'],
      ['kks', [956, 1275], '"kay kay ess" 와 바이트 동일'],
      ['ksh', [1015, 1298], '"kay ess aitch" 와 바이트 동일'],
      ['kx', [736, 857], 'Alex 에서 "kay ex" 와 바이트 동일'],
      ['xx', [817, 854], 'Alex 에서 "ex ex" 와 바이트 동일'],
      ['ekss', [528, 517], '두 음성 모두 글자 이름 X(`ex`/`eks`)와 바이트 동일'],
    ] },
  { g: 6, letterform: 'CH', ipa: '/ch/', say: 'ch', ms: [729, 887], proof: 'clean',
    note: '두 글자인데 낱자 이름 나열("see aitch")로 접히지 **않는** 드문 경우다. ' +
      '같은 형태의 `sh` 는 Alex 에서 접힌다 -- 그래서 CH 와 SH 의 표기 모양이 다르다',
    rejected: [
      ['chh', [1171, 1398], 'Samantha 에서 "see aitch aitch" 와 바이트 동일'],
      ['chuh', [532, 373], '`tchuh` 와 동일이고 Alex 373ms'],
      ['chhh', [1519, 1897], '두 음성 모두 안전대 크게 초과'],
      ['chch', [1414, 1595], '한 발화에서 소리가 두 번 난다'],
    ] },
  { g: 6, letterform: 'SH', ipa: '/sh/', say: 'shhu', ms: [647, 655], proof: 'clean',
    alt: ['shhe'],
    rejected: [
      ['sh', [701, 993], 'Alex 에서 "ess aitch" 와 바이트 동일'],
      ['shh', [235, 1527], 'Samantha 235ms 어휘 항목(쉿) vs Alex 1527ms = **음성 간 6.5배**. ' +
        '`shhh` 가 Samantha 에서 `shh` 와 바이트 동일(235ms 포화)인데 Alex 는 2038ms 로 ' +
        '단조 증가한다 -- 즉 Samantha 는 사전 항목을, Alex 는 철자 그대로를 읽는다. ' +
        '`ough` 가 음성마다 다른 유령 음소였던 것과 같은 실패 모드다'],
      ['shhh', [235, 2038], '위와 같은 이유 (Samantha 포화가 그 증거다)'],
      ['shuh', [543, 400], 'Samantha 에서 단어 `shoe` 와 바이트 동일'],
      ['shs', [1038, 1353], '두 음성 모두 "ess aitch ess" 와 바이트 동일'],
      ['ssh', [922, 1283], 'Alex 에서 "ess ess aitch" 와 바이트 동일'],
      ['sshh', [1363, 1841], '"ess ess aitch aitch" 와 바이트 동일'],
      ['shsh', [1363, 1794], '"ess aitch ess aitch" 와 바이트 동일'],
      ['shhs', [1398, 1887], '"ess aitch aitch ess" 와 바이트 동일'],
      ['shuhh', [566, 400], 'Alex 에서 `shuh`(= Samantha 의 `shoe`) 와 바이트 동일'],
    ] },
  { g: 6, letterform: 'TH', ipa: '/th/', say: 'thhu', ms: [593, 563], proof: 'clean',
    alt: ['thhe'],
    note: '무성 /th/(thin). **유성 /th/(this)는 아래 행이고 표기가 없다**',
    rejected: [
      ['thh', [1107, 1414], 'Samantha 에서 "tee aitch aitch" 와 바이트 동일'],
      ['thuh', [512, 455], 'Alex 에서 단어 `sir` 와 바이트 동일'],
      ['thih', [512, 365], 'Alex 에서 단어 `see` 와 바이트 동일'],
      ['th', [759, 352], 'Alex 352ms + 음성 간 2.2배'],
      ['thhh', [1467, 1913], '두 음성 모두 안전대 크게 초과'],
      ['ths', [922, 1263], '어말에 /s/ 가 붙어 없는 음소를 가르친다'],
    ] },
  { g: 6, letterform: 'TH', ipa: '/dh/', say: null, proof: 'none',
    note: '**안전한 표기를 찾지 못했다. 억지로 채우지 않았다.** 후보 7종이 전부 탈락이고 ' +
      '탈락 사유가 두 종류다: (1) 낱자 이름 나열로 접힌다 (2) 표기에 넣은 d 가 실제로 ' +
      '/d/ 로 들리는데 **D 는 이미 가르친 글자**다 -- 그건 "TH 는 duh 소리" 를 가르치는 ' +
      '것이고, /s/ 를 ㅅ 으로 가르치지 말라는 이 파일의 규칙과 같은 종류의 오류다. ' +
      '권고: TH 챕터는 무성 /th/(`thhu`) 하나만 낱소리로 드릴하고, 유성 /th/ 는 ' +
      '**단어로만** 가르쳐라(this/that/them 을 listen-repeat/finale 의 words[] 로). ' +
      '단어는 엔진 사전에 있으므로 증명된 발화다. Jolly 자체가 둘을 한 글자꼴의 ' +
      '유성/무성 쌍으로 가르치므로 커리큘럼상으로도 벗어나지 않는다',
    rejected: [
      ['thth', [1363, 1693], 'Samantha 에서 "tee aitch tee aitch" 와 바이트 동일'],
      ['dhuh', [446, 326], 'Samantha·Alex 모두 `duh`(D) 와 바이트 동일. Alex 는 `the` 까지 같다'],
      ['thd', [980, 1112], 'Samantha 에서 "tee aitch dee" 와 바이트 동일'],
      ['dth', [975, 1151], 'Samantha 에서 "dee tee aitch" 와 바이트 동일'],
      ['dhh', [1056, 1395], 'Samantha 에서 "dee aitch aitch" 와 바이트 동일 ' +
        '(`zhh`=="zee aitch aitch" · `vhh`=="vee aitch aitch" 와 같은 축이다)'],
      ['thv', [991, 1170], '어말에 /v/ 가 붙는다. V 는 group 5 에서 가르치는 글자다'],
      ['thu', [764, 420], 'Alex 420ms + 무성 `thhu` 와 눈으로 구별되지 않는다'],
    ] },

  // ---------- Group 7 (Jolly: qu ou oi ue er ar) ----------
  { g: 7, letterform: 'QU', ipa: '/kw/', say: 'kw', ms: [922, 1112], proof: 'clean',
    note: '낱자 이름 나열("kay double u")과 다르다',
    rejected: [
      ['kwuh', [581, 364], '`quuh` 와 동일이고 Alex 364ms'],
      ['quh', [528, 306], 'Alex 306ms'],
      ['kwu', [418, 363], 'Alex 에서 단어 `queue` 와 바이트 동일'],
    ] },
  { g: 7, letterform: 'OU', ipa: '/ou/', say: 'ou', ms: [617, 506], proof: 'clean',
    alt: ['owww'],
    rejected: [
      ['owh', [1324, 1539], '두 음성 모두 안전대 상단 초과'],
      ['ouh', [419, 435], '두 음성 모두 감탄사 `ow` 와 바이트 동일'],
    ] },
  { g: 7, letterform: 'OI', ipa: '/oi/', say: 'oi', ms: [442, 622], proof: 'phoneme',
    alt: ['oyy', 'oyuh'],
    note: '`oi`==`oih`==`oyh` 이고 `oyhh`==`oy`(감탄사, /oi/) 다 -- 즉 oi/oy 철자 군집 ' +
      '전체가 /oi/ 로 렌더된다는 것이 증명된다. **`oy` 와의 일치는 결함이 아니다**: ' +
      'Jolly 가 oi 와 oy 를 같은 소리의 두 철자로 가르치므로 일치하는 것이 맞다. ' +
      '**정정(이번 재검증)**: 이 등가는 **Samantha 에서만** 확인된다 -- ' +
      'Alex 는 `oi`(622ms)와 `oih`/`oyh`(390ms)가 md5 도 다르고(diff bytes 16958/~18000) ' +
      '바이트도 크게 다르다. 이 파일이 이전에 "두 음성" 검증을 표방한 다른 phoneme ' +
      '항목들과 달리 여기서는 실제로 한 음성만 확인된 채로 적혀 있었다. `oi` 자체의 ' +
      '채택은 안전하다(글자 이름·숫자·어휘 미끼 어디와도 안 겹친다는 별도 스윕 결과는 ' +
      '유효), 다만 "oi/oy 군집 전체가 /oi/ 로 수렴한다"는 추가 증명은 Alex 로 확장되지 ' +
      '않는다 -- proof 등급 자체는 유지하되 실기기 청취 시 Alex 보이스로도 들어볼 것',
    rejected: [
      ['oyh', [442, 390], '같은 음소이고 Alex 390ms 로 `oi`(622) 보다 짧다'],
      ['oyeh', [396, 575], 'Samantha 396ms'],
    ] },
  { g: 7, letterform: 'UE', ipa: '/yu:/', say: 'u', ms: [384, 331], proof: 'phoneme',
    alt: ['ueh', 'uue'],
    note: '**/ju:/ 는 정확히 글자 이름 U 다.** `u`==`you`==`ewe`==`yew`==`yoo`==`yooh`==`yu` ' +
      '가 두 음성에서 바이트 동일이고, 그 소리가 UE 의 목표음이다 -- AI 가 `a`(글자 이름 A), ' +
      'IE 가 `eye`(글자 이름 I)를 쓰는 것과 같은 Jolly 의 교육 장치다. 그래서 ' +
      'LETTER_NAME_ONLY 의 예외를 `a` 와 `u` 두 개로 늘렸다. ' +
      '리더의 발주는 "`yoo`/`yooh`/`yu` 가 전부 `you` 와 동일이므로 UE 후보 셋이 전부 ' +
      '탈락" 이라고 봤는데, **그 일치가 곧 증명이다** -- 탈락 사유가 아니다. ' +
      '길이(384/331)가 짧은 것이 유일한 약점이고 그건 `a`(399/413)·`oh`(419/355)· ' +
      '`or`(384/413) 와 같은 등급이다. ' +
      '**정정(이번 재검증, md5 재스윕으로 발견) -- "두 음성 바이트 동일" 은 틀렸다.** ' +
      'Samantha 는 맞다(`u`==`you`==`ewe`==`yew`==`yoo`==`yooh`==`yu`, md5 7개 전부 동일, ' +
      '재확인됨). **Alex 는 다르다**: `u` 는 `you`/`yew`/`yoo`/`yooh`/`yu` 군집과 md5 가 ' +
      '다르고(diff bytes 13180/18682, 약 70%), 대신 바로 아래 `rejected` 의 `yuh` 와 ' +
      '**정확히 같다**(md5 동일, diff 0) -- 그런데 `yuh` 는 Y 항목에서 "Y 자리에서 UE ' +
      '소리가 난다" 며 이미 탈락시킨 후보다. 즉 Alex 에서 이 앱이 내는 `u` 는 `you` 계열이 ' +
      '아니라 그 탈락 후보와 같은 소리이고, 그게 실제로 /ju:/ 인지는 확인되지 않았다 -- ' +
      '**proof 등급의 근거 절반(Alex)이 무너진다.** 표기 자체(`u`)는 그대로 두되(Samantha ' +
      '증거와 짧은 길이 등급은 여전히 유효), UE 를 실제로 가르치는 챕터에서는 Alex 기기로 ' +
      '반드시 귀로 재확인해라 -- 필요하면 Alex 전용 대체 표기를 새로 스윕해야 할 수 있다',
    rejected: [
      ['yuh', [546, 331], 'Alex 에서 `u` 와 동일인데 Y 의 표기 후보였다 -- Y 와 UE 가 겹친다'],
      ['uueh', [477, 413], '두 음성 모두 짧고 음소 미증명'],
      ['yuue', [499, 412], '`yoou` 와 동일이고 음소 미증명'],
    ] },
  { g: 7, letterform: 'ER', ipa: '/er/', say: 'erh', ms: [911, 1039], proof: 'clean',
    alt: ['urh'],
    note: '리더의 발주는 `er`==`air`(Alex) 로 탈락을 확정했고 그건 맞다. ' +
      '**Samantha 에서는 더 나쁘다** -- `err`/`ehr` 이 `air`·`arr`·`arrr` 과 한 군집이라 ' +
      'ER 과 AR 이 같은 소리가 된다. 뒤에 h 를 붙이면 그 군집에서 빠져나온다',
    rejected: [
      ['er', [341, 436], 'Alex 에서 `air`/`arrr` 와 바이트 동일 -- /er/ 이 /air/ 로 읽힌다'],
      ['err', [387, 436], '두 음성 모두 `air` 와 바이트 동일. Samantha 는 `arr`/`arrr` 까지 같다'],
      ['errr', [341, 436], 'Alex 에서 `air`/`er`/`err` 와 바이트 동일'],
      ['ur', [382, 354], 'Alex 에서 `uh`(U, 챕터 5 채택 표기)와 바이트 동일'],
      ['urr', [341, 354], 'Alex 에서 `uh` 와 바이트 동일'],
      ['urrr', [341, 354], 'Alex 에서 `uh` 와 바이트 동일'],
      ['ehr', [387, 1004], 'Samantha 에서 `air`/`arr`/`arrr` 와 바이트 동일'],
      ['uhr', [382, 1004], 'Samantha 382ms + 음성 간 2.6배'],
      ['erhh', [341, 354], 'Alex 에서 `uh` 와 바이트 동일'],
      ['urhh', [341, 354], 'Alex 에서 `uh` 와 바이트 동일'],
    ] },
  { g: 7, letterform: 'AR', ipa: '/ar/', say: 'arh', ms: [1015, 1121], proof: 'clean',
    note: 'AR 후보 14종 중 **유일한 생존자**다. 나머지는 두 군집으로 접힌다 -- ' +
      '`are`/`our`/**글자 이름 R** 군집과 `air`/`heir` 군집. 즉 AR 은 자칫하면 ' +
      '글자 R 의 이름이나 /air/ 를 가르친다',
    rejected: [
      ['ar', [387, 355], '두 음성 모두 단어 `are` 와, Samantha 는 **글자 이름 R** 과도 바이트 동일'],
      ['arr', [387, 1005], 'Samantha 에서 `air`/`ehr`/`err` 와 바이트 동일 -- ER 과 겹친다'],
      ['ahr', [387, 1109], 'Samantha 에서 `are`/`our`/글자 이름 R 과 바이트 동일'],
      ['arrr', [387, 436], '두 음성 모두 `air` 와 바이트 동일'],
      ['aar', [387, 889], 'Samantha 에서 `are`/`our`/글자 이름 R 과 바이트 동일'],
      ['arhh', [387, 355], 'Samantha `are`/`our`/R · Alex `are` 와 바이트 동일'],
      ['aarh', [387, 355], '위와 같음'],
      ['aahr', [387, 355], '위와 같음'],
      ['aarr', [387, 355], '위와 같음'],
      ['ahrh', [387, 355], '위와 같음'],
      ['ahrr', [387, 436], 'Samantha `air`/`heir` · Alex `air` 와 바이트 동일'],
      ['arrh', [387, 436], '위와 같음'],
      ['ahh', [481, 1504], '음성 간 3.1배 (`4027bb3` 이 O 의 차점자로 남긴 표기다)'],
    ] },
]

// 채택 표기 전체의 **상호 판별성**도 측정했다(62종 x 2음성 한 해시 공간).
// 결과: `a`==`eh`(기존 확정 충돌쌍)와 `oi`==`oy`(같은 음소의 두 철자, 정상)
// 말고는 전부 서로 다르다. 이 검사가 `zzuh`==`juh` 와 `vvuh`==`buh` 를 잡았다 --
// **미끼 스윕만으로는 안 잡힌다**(둘 다 이 앱의 다른 채택 표기이고, 미끼 목록에
// 자기 앱의 표기를 넣을 생각을 아무도 하지 않는다).

// 글자꼴 -> 그 글자꼴이 낼 수 있는 소리 표기. 표에서 유도하므로 드리프트가 없다.
//
// 게으르게 만든다: `export const X = (() => {...})()` 형태는 Rollup 이 순수하다고
// 증명할 수 없어서 SOUND_TABLE 을 프로덕션 번들에 끌고 들어간다(위 주석 참조).
// 두 번째 항목은 **한 글자꼴에 소리가 둘**인 것 (현재 OO 하나 -- TH 는 유성 표기를
// 채택하지 않았다). **기존 "한 소리에 글자꼴 둘"(C/K) 규칙의 정반대 방향**이고,
// 파일럿이 미리 지목한 항목이다. 실패 모양이 다르다:
//   한 소리 / 글자꼴 둘  -> 정답이 둘인 문항 (아이가 맞는 타일을 탭하고 오답 처리)
//   한 글자꼴 / 소리 둘  -> **보기가 시각적으로 구별 불가**한 문항. 타일 두 개가
//                          글자까지 똑같으므로 아이는 무엇을 보고 고를지가 없다.
//                          multiselect 예외도 성립하지 않는다 -- "모두 찾기" 가
//                          가르치는 것이 없다(두 타일이 같은 그림이다).
let letterformSoundsCache = null
export function letterformSounds() {
  if (letterformSoundsCache) return letterformSoundsCache
  const m = new Map()
  for (const row of SOUND_TABLE) {
    if (!row.say) continue
    if (!m.has(row.letterform)) m.set(row.letterform, [])
    if (!m.get(row.letterform).includes(row.say)) m.get(row.letterform).push(row.say)
  }
  letterformSoundsCache = m
  return m
}
function multiSoundLetterforms() {
  return new Set([...letterformSounds()].filter(([, s]) => s.length > 1).map(([lf]) => lf))
}

// 표의 탈락 후보를 블랙리스트에 합친다 -- **표가 문서가 아니라 검사가 되는 지점**이고,
// 이 표의 절반의 값어치가 여기 있다(다음 작성자가 같은 후보를 다시 측정하지 않는다).
// `broken` 인 표기는 넣지 않는다: 챕터 1~6 이 그 표기를 쓰고 있고, 교체 없이
// 블랙리스트에 넣으면 검증기가 100건 이상을 쏟아내 아무도 읽지 않게 된다.
//
// **top-level 루프로 쓰면 안 된다.** 모듈 최상위에서 Map 을 변형하는 것은
// Rollup 이 지울 수 없는 부수효과이고, 그 부수효과가 SOUND_TABLE 을 살려서
// 산문 주석까지 프로덕션 번들에 들어갔다(측정: 번들 +14.6KB). 그래서
// validateChapters 안에서 한 번만 부른다 -- dev 전용 경로다.
let tableMerged = false
function mergeTableIntoMisread() {
  if (tableMerged) return
  tableMerged = true
  for (const row of SOUND_TABLE) {
    for (const [cand, ms, why] of row.rejected || []) {
      if (MISREAD_NOTATIONS.has(cand)) continue
      if (SOUND_TABLE.some((r) => r.say === cand)) continue
      MISREAD_NOTATIONS.set(
        cand,
        `${why} (${row.letterform} ${row.ipa} 후보로 측정: Samantha ${ms[0]}ms / Alex ${ms[1]}ms). ` +
          (row.say
            ? `${row.letterform} 는 \`${row.say}\` 를 써라`
            : `${row.letterform} ${row.ipa} 는 안전한 표기가 없다 -- SOUND_TABLE 의 note 를 읽어라`)
      )
    }
  }
}

// 단일 소문자 한 글자는 예외 없이 글자 **이름**으로 읽힌다(s==ess, n==en,
// m==em, l==el, r==ar, f==ef, z==zee, o=="oh", i=="eye"). 즉 소리를
// 가르치려는 자리에서 정확히 반대의 것을 들려준다. 예외는 **두 개**이고 둘 다
// "그 글자의 이름이 곧 그 글자소의 목표음" 인 자리다:
//   `a`  = AI 의 /ei/   (챕터 7)
//   `u`  = UE 의 /ju:/  (Jolly group 7. u=="you"=="ewe"=="yew" 가 두 음성에서
//          바이트 동일이고 /ju:/ 는 정확히 그 소리다 -- IE 가 `eye` 를 쓰는
//          것과 같은 논리. 아래 SOUND_TABLE 의 UE 행 참조)
// 그래서 확정 충돌쌍 a==eh 가 존재한다 -- 위 SPEECH_COLLISION_PAIRS 참조.
const LETTER_NAME_ONLY = /^[b-tv-z]$/

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
// **대문자 전용이어야 한다** -- checkSpeechNotation 의 LETTER_NAME_ONLY 안전망은
// "말할 자리에 소문자 낱자 하나가 들어오면 글자 이름으로 오독된다" 는 실수를
// 잡는데, 이 exemption 이 소문자까지 허용하면 그 안전망이 통째로 무력화된다
// (예: option.say 에 실수로 's' 를 쓴 것도 "의도된 글자꼴"로 통과해버린다).
const LETTERFORM = /^[A-Z]{1,2}$/

// break beat 의 두 번째 노출이 **소문자** 글자꼴을 보여주기 시작하면서
// (아래 소문자 교육 도입) `beat.letter` 에 소문자가 들어온다. 이건 화면
// 표시일 뿐 발화가 아니므로 LETTER_NAME_ONLY 안전망과는 무관하고, 위 LETTERFORM
// 을 대문자 전용으로 유지해야 하는 이유(안전망 유지)도 여기엔 적용되지 않는다.
//
// **단일 소문자는 애초에 면제가 필요 없다** -- SOUND_NOTATION(`/^(.)\1+$/i`)이
// 최소 2글자 반복을 요구하므로 한 글자('s','p','g'...)는 절대 걸리지 않는다.
// 서로 다른 두 글자 다이그래프('ai','oa','ie','or'...)도 반복이 아니므로 마찬가지로
// 걸리지 않는다. **문제는 정확히 '같은 글자가 두 번' 인 소문자 다이그래프뿐이다**
// (대문자 'EE' 는 LETTERFORM 으로 이미 면제되는데 소문자 'ee' 만 SOUND_NOTATION 에
// 걸리는 비대칭). 그래서 정규식으로 뭉뚱그리지 않고 **이 커리큘럼이 실제로 가르치는
// 반복형 다이그래프만 이름을 나열한다** -- 'ss'/'mm'/'nn'/'ll'/'ff' 같은 진짜 오탈자
// (소리 표기가 화면으로 새는 사고)까지 통째로 면제해버리는 사고를 막기 위해서다.
// Jolly group 5 의 `OO` 가 작성되면 여기에 'oo' 를 추가해라.
// 챕터 10 이 Jolly group 5의 OO(긴/짧은 두 소리, 한 글자꼴)를 쓰면서 추가했다
// -- 위 주석이 예고한 바로 그 자리다.
const REPEATED_LETTER_DIGRAPHS_DISPLAY = new Set(['ee', 'oo'])
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
  // 표 유래 데이터는 여기서 준비한다 -- 모듈 최상위에 두면 프로덕션 번들이
  // SOUND_TABLE 을 끌고 들어간다(SOUND_TABLE 위 주석의 측정값 참조).
  mergeTableIntoMisread()
  const lfSounds = letterformSounds()
  const multiSound = multiSoundLetterforms()
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
      // 화면의 글자꼴과 그 글자꼴을 탭했을 때 나는 소리의 짝. SOUND_TABLE 과
      // 대조한다 -- 표를 문서가 아니라 **계약**으로 만드는 지점이다. 챕터 9~33 은
      // 각각 다른 세션이 쓰고, 표기를 손으로 옮겨 적는 순간 드리프트가 시작된다.
      const letterformSounds = []
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
        // 대소문자 정규화가 필요하다 -- break beat 가 소문자 글자꼴을 띄우기
        // 시작하면서(아래 소문자 교육 도입) 같은 글자가 'S'(teach)와 's'(break)로
        // 따로 들어와 taughtSoFar 에 두 항목이 생긴다. reviewTargets 는 전부
        // 대문자로 적혀 있으므로 대문자로 정규화해 저장한다 -- 대소문자는 표시
        // 형태일 뿐 커리큘럼상 같은 글자소다.
        if (beat.letter) {
          const canonicalLetter = beat.letter.toUpperCase()
          if (!taughtSoFar.includes(canonicalLetter)) taughtSoFar.push(canonicalLetter)
        }

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
            // ---------- 한 글자꼴 / 소리 둘 (기존 C·K 규칙의 정반대 방향) ----------
            // 같은 글자꼴 타일이 한 문항에 둘 있으면 아이는 **무엇을 보고 고를지가
            // 없다** -- 두 보기가 글자까지 똑같다. multiselect 예외도 성립하지
            // 않는다("모두 찾기" 가 가르치는 것이 없다). Jolly group 5 의 OO 두
            // 소리가 정확히 이 모양을 만든다.
            const byLabel = new Map()
            for (const o of options) {
              if (o.icon !== 'letterTile' || !o.label) continue
              if (!byLabel.has(o.label)) byLabel.set(o.label, [])
              byLabel.get(o.label).push(o)
            }
            for (const [label, sharing] of byLabel) {
              if (sharing.length < 2) continue
              problems.push(
                `${at}: letterTile 보기 [${sharing.map((o) => o.id).join(', ')}] 가 같은 글자꼴 ` +
                  `'${label}' 이다 (소리는 ${sharing.map((o) => `'${o.say}'`).join(' / ')}) -- ` +
                  `보기 두 개가 화면에서 똑같이 보이므로 아이가 무엇을 보고 고를지가 없다. ` +
                  `한 글자꼴에 소리가 둘이면(OO 의 긴/짧은 소리) 대비는 **단어**로 시켜라 ` +
                  `(listen-repeat/finale 의 words[] 에 moon 과 book 을 나란히). ` +
                  `"한 소리에 글자꼴 둘"(C/K)의 multiselect 예외가 여기서는 통하지 않는다`
              )
            }
            // 다중음 글자꼴이 **오답**인데 프롬프트가 그 글자꼴의 다른 소리인 경우.
            // 아이가 OO 를 탭하면 글자꼴로는 맞는데 오답 피드백을 받는다 -- 위의
            // "프롬프트 vs 오답 타일" 검사와 같은 종류의 답할 수 없는 문항이다.
            if (promptAudio) {
              const ps = soundOf(promptAudio)
              for (const o of options) {
                if (o.icon !== 'letterTile' || o.correct || !o.label) continue
                if (!multiSound.has(o.label)) continue
                if (!(lfSounds.get(o.label) || []).includes(ps)) continue
                problems.push(
                  `${at}: 오답 타일 ${o.id} 의 글자꼴 '${o.label}' 이 promptAudio '${promptAudio}' 를 ` +
                    `내는 글자꼴이다 (${o.label} 의 소리는 ` +
                    `[${lfSounds.get(o.label).join(', ')}] 둘이다) -- 아이가 글자꼴로는 ` +
                    `맞는 타일을 탭하고 오답 처리된다. 다중음 글자꼴은 자기 소리 문항에서 ` +
                    `오답으로 쓸 수 없다`
                )
              }
            }
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
            if (option.say !== undefined) {
              spoken.push([`${at}/${option.id} say`, option.say])
              letterformSounds.push([`${at}/${option.id}`, option.label, option.say])
            }
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
                if (word.say !== undefined) {
                  spoken.push([`${at} words[${i}].say`, word.say])
                  letterformSounds.push([`${at} words[${i}]`, word.text, word.say])
                }
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
            if (l && l.say !== undefined) {
              spoken.push([`${at} letters[${i}].say`, l.say])
              letterformSounds.push([`${at} letters[${i}]`, l.text, l.say])
            }
          }
          slots.forEach((slot, i) => displayed.push([`${at} target[${i}]`, slot]))
          buildTargets.push({ at, word: slots.join(''), slots })
        }

        if (beat.readAloud) {
          checkKeys(problems, at, beat.readAloud, READ_ALOUD_KEYS, 'readAloud')
          displayed.push([`${at} readAloud.targetText`, beat.readAloud.targetText])
          if (beat.readAloud.say !== undefined) {
            spoken.push([`${at} readAloud.say`, beat.readAloud.say])
            letterformSounds.push([`${at} readAloud`, beat.readAloud.targetText, beat.readAloud.say])
          }
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

      // ---------- 글자꼴 <-> 소리 표기 계약 (SOUND_TABLE) ----------
      // 챕터 8 파일럿의 교훈 2번이 요구한 표를 **검사로** 만든다. 표기는 측정으로
      // 확정되지만 챕터마다 손으로 옮겨 적히고, 그 순간부터 드리프트가 시작된다
      // -- 실제로 이 프로젝트에서 같은 종류의 드리프트가 두 번 있었다(콤마 규칙이
      // 두 벌로 갈렸고, reviewTargets 가 챕터 로컬 값이 됐다).
      //
      // 검사 대상은 **글자꼴로 인식되는 표시 문자열**(대문자 1~2자)뿐이다.
      // 단어(`moon`, `cat`)는 건드리지 않는다 -- 단어의 발화는 단어 자체다.
      for (const [field, text, say] of letterformSounds) {
        if (typeof text !== 'string' || !LETTERFORM.test(text)) continue
        const allowed = lfSounds.get(text)
        if (!allowed) continue
        if (allowed.includes(soundOf(say))) continue
        problems.push(
          `${field}: 글자꼴 '${text}' 에 소리 표기 '${say}' -- SOUND_TABLE 이 확정한 ` +
            `'${text}' 의 소리는 [${allowed.join(', ')}] 다. 표기를 바꾸려면 데이터가 아니라 ` +
            `**표를 고쳐라**(chapters/index.js 의 SOUND_TABLE). 표에는 측정값과 탈락 후보가 ` +
            `같이 있으므로 재측정 없이 판단할 수 있다. 재현: ${NOTATION_REPRO}`
        )
      }

      for (const [field, text] of displayed) {
        if (typeof text !== 'string') continue
        // LETTERFORM(대문자 1~2자)은 이 검사에서 면제한다. SOUND_NOTATION 이
        // `/^(.)\1+$/i` 라서 **같은 글자가 겹친 다이그래프를 소리 표기로 오인**한다
        // -- 챕터 8 의 `EE`, Jolly group 5 의 `OO` 두 개가 정확히 여기 걸린다.
        // 챕터 1~7 은 다이그래프가 `AI`/`OA` 라서 우연히 통과하고 있었고, 그래서
        // 이 결함은 group 4 후반에 처음 드러났다. 검사의 목적은 `sss` 같은 소문자
        // 소리 표기가 화면으로 새는 것이다. LETTERFORM(대문자 글자꼴)에 더해,
        // 소문자 교육 도입 이후 break beat 가 소문자 글자꼴도 띄우므로 그것도
        // 면제한다 -- 다만 '같은 글자 반복' 다이그래프만 이름을 나열해 면제한다
        // (REPEATED_LETTER_DIGRAPHS_DISPLAY 위 주석 참조). 그 외 소문자
        // (단일 문자, 또는 서로 다른 두 글자 다이그래프)는 애초에 SOUND_NOTATION 에
        // 걸리지 않으므로 별도 면제가 필요 없다 -- 아래 두 조건 모두 통과해야만
        // (즉 '같은 글자 반복'인데도 알려진 다이그래프 목록에 없어야만) 문제로 남는다.
        if (LETTERFORM.test(text)) continue
        if (REPEATED_LETTER_DIGRAPHS_DISPLAY.has(text)) continue
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
