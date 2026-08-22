# 카봇 파닉스 대작전 — CLAUDE.md

> **새 세션이면 `HANDOFF.md` 를 먼저 읽어라.** 이 문서는 *항구적 규칙*이고,
> `HANDOFF.md` 는 *지금 중단된 지점과 재발주 목록*이다. 둘은 역할이 다르다.

## 프로젝트 개요
5세 한국 남아를 위한 iPad 영어 파닉스 학습 앱. 한국 장난감 로봇(카봇) 액션 테마.
- **대상 기기**: iPad Pro 11" 4세대 (MNXG3KH/A), Safari/Chrome
- **뷰포트**: 세로 834×1194 / 가로 1194×834, 스크롤 없음 필수
- **파닉스 커리큘럼**: Jolly Phonics Group 1–7 전체 (42개 소리)
- **전체 구성**: 5개 월드, 33개 챕터, 챕터당 5개 스테이지 (~15분/스테이지)

## 기술 스택
- **빌드**: Vite + Vanilla JS/HTML/CSS (프레임워크 없음)
- **오디오**: Web Speech API (SpeechSynthesis 큐, SpeechRecognition 보너스)
- **저장**: localStorage (진행 상태 영속)
- **아트**: 인라인 SVG, flat color, polygon/rect/circle, viewBox "0 0 120 140"

## 팀 구성 (에이전트 역할 분담)
리더(=현재 세션)가 지시·검토하고, 나머지는 전문 에이전트로 위임한다. 리더는
**직접 코딩을 최소화**한다.

**병렬 처리의 핵심은 파일 소유권을 겹치지 않게 나누는 것이다** — 같은 파일에 두
에이전트를 넣으면 서로 덮어쓴다.

| 담당 | 소유 파일 |
|---|---|
| **리더** | `art.js` 배선, `CLAUDE.md`, `HANDOFF.md`, 커밋 |
| **파닉스** | `src/data/chapters/**` |
| **풀스택** | `screens.js`, `audio.js`, `state.js`, `_probe-fs.html` |
| **레이아웃** | `style.css`, `_probe.html` |
| **아트(계열별)** | `src/art/<family>.js` — 계열마다 다른 에이전트 가능 |
| **아이콘** | `icons.js` |

### 에이전트 보고를 그대로 받지 마라 (전부 실제로 겪은 일)
- "챕터 5 전체 크래시" → 오진. 동시 편집 중인 파일의 낡은 진단이었다.
  **동시 편집 파일에 대한 진단은 시점 확인이 필요하다**
- "boss6 스크롤 4px" → 오진. 해당 `?shot=` 이 없어서 아무것도 렌더되지 않았다
- "검증기에 아이콘 키 검사 없음" → 틀렸다. 있었고 작동했다
- 아이콘 개수는 **리더가** 틀리게 셌고 에이전트가 바로잡았다 — 방향은 양쪽이다
- **리더의 제안이 측정으로 반박된 사례도 있다**: 콤마 묶음을 보편 형식으로 통일하자고
  했는데, 이미 긴 소리에 적용하면 한 발화가 5초가 된다는 측정이 나왔다(`sssss` 콤마
  삼중 = Alex 5.05초). 결론은 단어앵커(무조건)와 콤마삼중(측정 조건부)의 분리였다

→ **양방향으로 직접 재현·재측정해라.** 보고서의 숫자는 재현 명령과 함께 요구해라.

## 파일 구조
```
HANDOFF.md             # 중단 지점 + 재발주 목록 (새 세션은 이걸 먼저 읽는다)
CLAUDE.md              # 항구적 규칙 (이 파일)
src/
  main.js              # 진입점, renderWorldSelect() 호출
  screens.js           # 4단계 네비게이션 + 9종 beat 렌더러 + 보스 등식 유도
  audio.js             # TTS 큐 (겹침 방지, minSpeechMs 바닥), SpeechRecognition
  state.js             # 진행 상태, 잠금 로직, 체크포인트
  art.js               # heroArt/villainArt dispatch + style 테이블 + 팔레트,
                       #   슈퍼히어로 계열 함수
  art/
    robots.js          # 챕터 1 · 카봇 (각진 변신자동차)
    dinosaurs.js       # 챕터 3 · 공룡 (유기적 곡선)
    creatures.js       # 챕터 4 · 포켓몬 계열 (세피아 선화)
    platformer.js      # 챕터 5 · 마리오 계열 (검정 선화 + 흰 후광)
    toys.js            # 챕터 6 · 토이스토리 계열 (굵은 잉크)
  icons.js             # 단어 아이콘 50종 + shoutBurst() 집중선 효과
  style.css            # 전체 스타일, 가로/세로 방향 지원
  data/
    chapters/
      index.js         # 챕터 통합, worlds/stages 배열, 조회 함수,
                       #   validateChapters() (dev 전용 계약 검증)
      chapter-01.js    # …  chapter-07.js (챕터 1–7, 스테이지 35개)
    stages.js          # 하위 호환 shim → chapters/index.js 재export
public/                # 검증 하네스 — 전부 gitignore, 버려지는 파일
  _probe.html          # 앱 화면 + 스크롤/여백 판정 HUD
  _probe-fs.html       # 게임 로직·오디오 하네스 (현실적 TTS 스텁)
  _art.html            # 아트 갤러리 (크기 전환 + 실루엣 모드)
```


새 챕터 추가: `chapter-NN.js` 를 만들고 `chapters/index.js` 의 import + 배열에 넣으면
끝이다. `worlds` 는 33개 챕터 슬롯을 미리 열거하므로 미작성 챕터는 자동으로 `???`
잠금 카드로 렌더된다 — 다른 파일은 손댈 필요 없다.

## 핵심 아키텍처

### 오디오 큐 (audio.js)
- 절대 겹침 없음: 모든 발화가 단일 `queueTail` promise chain에 직렬 연결
- `speakEN(text)` — 영어 TTS, 항상 소문자 변환 (대문자 S → "Capital S" 방지)
- `speakKO(text)` — 한국어 TTS
- `speakSequence(texts, lang, gapMs)` — 배열 순서대로 1100ms 간격 발화
- `whenAudioIdle()` — 현재 큐가 모두 끝날 때 resolve되는 promise (화면 전환 대기용)
- `clearAudioQueue()` — 뒤로가기 시 대기 중인 발화 무음 처리 (현재 발화는 자연 종료)
- `tryRecognize(targetText)` — SpeechRecognition 음성인식. **현재 호출하지 않는다** —
  권한 프롬프트가 리워드 순간에 뜨고, iOS 는 인식 중 `speechSynthesis` 를 최대 4초
  억제한다. 결과를 소비하는 곳도 없었다. 함수는 남겨뒀다
- **`minSpeechMs` 바닥** — `onend` 가 실측 하한보다 일찍 오면 그때까지 더 기다린다.
  iPadOS Safari 의 `onend` 조기 발화 방어. **추정이 아니라 엄격한 하한**이라
  정직한 엔진에서는 분기가 발화되지 않는다(비용 0). 계수는 콤마 유무로 갈린다 —
  콤마 묶음은 같은 길이의 평범한 단어보다 문자당 비용이 **2배**다
- `speechSynthesis.cancel()` **을 절대 호출하지 않는다** — iOS 에서 큐 전체를 죽인다

### 게임 루프 (screens.js)
- Beat 타입 9가지: `teach`, `break`, `choose`, `choose-sequence`, `multiselect`,
  `drag-build`, `match-shape`, `listen-repeat`, `finale`
  (`match-shape` = b/d 반전을 *귀*가 아니라 *모양*으로 변별시키는 beat. 아래
  "음성 충돌쌍" 규칙의 교육적 대체 경로다)
- 체력바 기반 전투: 정답 → 악당 체력 감소, 2연속 오답 → 정답 힌트 재시연
- **오답 구제**: `makeWrongStreakTracker` + `pulseHint` + `redemonstrateOption` (2연속 오답 시)
- **음성 완료 대기**: 모든 beat 전환은 `waitForTransition(minDelayMs)` = `whenAudioIdle()` + 최소 딜레이
- `optionLabelHtml(opt)` — letterTile 레이블 sr-only 처리. **조건은 `length <= 2`** —
  다이그래프(`AI`/`OA`)도 한 글자소이므로 같은 대우를 받아야 한다
- `targetSlots(target)` — `drag-build` 의 `target` 을 슬롯 배열로 정규화한다
  (`"SAT"` → `["S","A","T"]`, `["R","AI","N"]` 은 그대로). **다이그래프를 문자로
  쪼개는 사고를 구조적으로 막는 지점**이라 보스 등식 유도도 이걸 통과한다

### 캐릭터 아트 (art.js + art/*.js)
데이터가 아니라 **아트가 캐릭터의 색·외형을 소유한다.** 진입점은 두 개뿐:
```js
heroArt(heroOrName)     // 문자열(레거시) 또는 { name, style, ...색상override }
villainArt(villainOrName)
```
`resolveArt()` 의 해석 순서:
- **style**: `spec.style` → 이름 팔레트의 style → `'robot'`. 미지 style 은 크래시 없이 robot 폴백.
- **색상**: 아트 함수 기본값 ← 이름 팔레트 ← `spec` 의 명시 필드(가장 강함).
- **패밀리 라벨**: `spec.style` 이 `FAMILY_STYLES`(예: `'superhero'`, `'dino'`)이고 그 이름에
  더 구체적인 style 이 있으면 **팔레트의 구체 style 이 이긴다.** 챕터 데이터는 계열만
  선언하고 캐릭터별 외형은 아트가 결정한다.

스타일 계열은 파일로 분리한다 — 함수 두어 개를 넘기면 `src/art/<family>.js` 로 빼고
`art.js` 가 import 해서 `HERO_STYLES`/`VILLAIN_STYLES` 에 등록한다. 그래야 디자이너를
계열별로 병렬 투입할 수 있다(같은 파일이면 서로 덮어쓴다).
- `art/robots.js` — `robot`, `robot-deluxe` (히어로/빌런, 챕터 1 = Carbot 계열). 각진
  변신자동차 문법: 가슴=자동차 앞면(앞유리+그릴 슬랫+헤드라이트), 어깨 바퀴, 스포일러,
  V 크레스트, `rx` 금지
- `art.js` 내 슈퍼히어로 계열(챕터 2 = Marvel 히어로 계열) — `superhero`,
  `superhero-acrobat/-shield/-thunder/-armor`, `supervillain-fog/-eraser/-stop/-jumble/-king`
- `art/dinosaurs.js` — `dino-raptor/-armored/-flyer/-horned` (챕터 3 = 공룡 계열),
  `dino-blink/-echo/-upside/-swamp/-shadow-rex`. 유기적 `path` 곡선, 큰 흰 눈, 온색 중립색
  — 로봇 계열과 반대 문법
- `art/platformer.js` — `plat-jumper/-spring/-block/-powerup`, `plat-flip/-slime/
  -magnetjack/-brick/-glitch` (챕터 5 = 마리오 계열). 굵은 검정 잉크 선화 +
  **흰 스티커 후광**(부품 모델에서 `haloPaint` 흰 채움 + `stroke +9` 를 깔고 그 위에
  `paint` — 그림자/반짝임/파편은 `nohalo:true`, 텍스트는 제외). **인체 비율·관절이
  미완이다 — `HANDOFF.md` §4 참조**
- `art/creatures.js` — `crt-*` (챕터 4 = 포켓몬 계열). 세피아 선화(`#7a5c48`) +
  굵기 계층 2.6/2.0/1.4, 엠블럼 판만 **3.0(파일 내 최대)**, `shadeCrescent()` 경계
  선명한 음영. **선화 색을 검정으로 바꾸지 마라** — 토이스토리·마리오 계열과 같아진다.
  원색 몸 + 세피아 선화가 이 계열의 정체성이다
- `art/toys.js` — `toy-*` (챕터 6 = 토이스토리 계열). 굵은 잉크 선화 + 각진 구조
- 모든 SVG: viewBox `"0 0 120 140"`, 그라디언트/필터 금지(SVG 내부)

**계열 간 그림체 통일은 요구사항이 아니다 (사용자 확정).** 원문: *"챕터마다 전부 완전히
새로운 그림체와 컨셉으로 가도 상관 없어. 하나의 앱이라는 일관성이라는 게 필요 없다는
거야."* 초기에는 "5계열이 서로 다르되 한 앱처럼 보여야 한다"는 제약을 두고 flat color +
기하 프리미티브 + 최소 요소로 그렸는데, **그게 캐릭터가 밋밋해진 주된 원인이었다.**
이제 계열별로:
- **디테일 수를 자유롭게 늘려라.** 면 분할, 패턴(체크·줄무늬), 장식 요소 전부 가능
- **면 겹치기로 입체감**을 만들어라 — 밝은 면/어두운 면을 여러 겹. (SVG 그라디언트·필터는
  여전히 금지지만, 단색 면을 겹쳐 음영을 표현하는 건 얼마든지 가능하다)
- **비율·자세·그림체 관례를 계열마다 새로 정해도 된다.** 다른 계열과의 대비를 맞추려
  애쓰지 말고 **그 캐릭터 자체가 멋있어 보이는 것**에 집중해라
- 판정 기준은 하나다: **5세 남아가 그 세계관을 알아보고 멋있다고 느끼는가**

여전히 지키는 것: 함수 시그니처, viewBox `"0 0 120 140"`(클리핑 0), SVG 내부
그라디언트/필터 금지, `emblem` 글자의 가독성(파닉스 교육 요소), 아트가 알파벳으로
오독되지 않을 것.

### 세계관 순서 (챕터 스타일 계열 사이클, 7개씩 반복)
| # | 계열 | 상태 |
|---|---|---|
| 1 | **Carbot** — 각진 변신로봇 | 완료 `art/robots.js` |
| 2 | **Marvel 히어로 계열** | 완료 (`art.js` 내) |
| 3 | **공룡** | 완료 `art/dinosaurs.js` |
| 4 | **포켓몬 계열** — 라이츄/잠만보/몰드류 + 합체 리자몽 | 아트 있음, **원색 전환·자세 미완** |
| 5 | **마리오 계열** — 모자+장갑 점프 플랫포머 | 아트 있음, **인체 비율 미완** |
| 6 | **토이스토리 계열** — 살아있는 장난감들 | 완료 `art/toys.js` |
| 7 | **DC 히어로 계열** — 케이프+카울 탐정, 비행 능력자 등 | **미착수** (robot 폴백) |

챕터 8 부터 이 7개 계열이 다시 반복된다.

**계열 성격은 데이터가 아니라 아트가 소유한다.** 사용자가 계열별로 원작 캐릭터의
**특징을 분명하게** 잡으라고 지시했다 — 원문: *"아는 캐릭터가 나오는 거랑 오리지널
캐릭터가 나오는 거랑의 몰입도 차이는 엄청나거든."* 실제로 특징이 흐릿할 때마다
반려됐다(포켓몬 히어로/빌런 구분 없음, 버즈 연상 안 됨, 파스텔 톤). 따라서
**과감하게 잡아라.** 저작권은 사용자가 판단했고 팀이 고려할 사항이 아니다.
다만 상표 캐릭터를 **그대로 재현하는 것**(정확한 얼굴·로고·실루엣 복제)이나
사용자 제공 이미지를 잘라 쓰는 것은 하지 않는다 — 특징 강조와는 별개 문제다.

### 챕터/월드 구조 (data/chapters/index.js)
- `WORLD_SIZE = 7`, `TOTAL_PLANNED_CHAPTERS = 33`
- 5개 월드: Ch1–7, Ch8–14, Ch15–21, Ch22–28, Ch29–33
- 각 챕터에 `stages[]` (5개), 마지막 스테이지가 `chapterBoss: true`
- 조회 함수: `getChapterById`, `getChapterForStage`, `getStageById`, `getWorldById`, `getWorldForChapterOrder`

## 현재 구현 상태

> **세션을 새로 시작했다면 먼저 `HANDOFF.md` 를 읽어라.** 그 파일이 "지금 중단된
> 지점"과 재발주할 작업 목록을 담고 있다. 이 문서(`CLAUDE.md`)는 항구적 규칙이다.

측정된 현재 수치 (커밋 `1c74cc5` 기준):
챕터 **7개** / 스테이지 **35개** / 단어 아이콘 **50종** / 캐릭터 슬롯 **70개**
`validateChapters` **0건** / 프로덕션 빌드 **통과** / 캐릭터 렌더 실패 **0**

### 완료
- [x] 월드 선택 → 챕터 선택 → 스테이지 맵 → 스테이지 화면 네비게이션
- [x] **챕터 1–7 (월드 1 완결)** — Jolly Group 1–4:
      S/A/T · I/P/N · C·K/E/H · R/M/D · G/O/U · L/F/B · AI/J/OA
- [x] 9가지 beat 타입 렌더러 (`match-shape` 포함 — b/d 반전을 *모양*으로 가르치는 beat)
- [x] TTS 큐 (겹침 방지, 안전 타임아웃, stuck 방지, `cancel()` 미호출 원칙)
- [x] **최소 발화 시간 바닥 (`minSpeechMs`)** — iPadOS 의 `onend` 조기 발화에 대한 방어.
      추정이 아니라 **엄격한 하한**이라 정직한 엔진에서는 분기가 발화되지 않는다
      (정직 경로 간격 바이트 동일). 리워드 화면 겹침 +2292ms → −14ms
- [x] 오답 재시연 (2연속 오답 시 힌트), 음성 중 화면 이동 차단(`whenAudioIdle()`)
- [x] `clearAudioQueue()` — 뒤로가기 시 대기 발화 취소(진행 중 발화는 자연 종료)
- [x] 체크포인트 복구 — 슬립/리로드/크래시에서만 살아남고 의도적 이탈에는 지워진다
- [x] 가로/세로 방향 동시 지원, shoutBurst() 집중선
- [x] 보스 합체 연출 — 미니봇 **3개(스테이지 2–4)** 슬라이드인 + 최종 형태,
      **탭으로 즉시 스킵**(이중 실행 가드)
- [x] **보스 합체 다음 화면 = 글자 등식** — `drag-build` `target` 에서 `targetSlots()`
      로 유도한다(`S + A + T = SAT`, 챕터 7 은 `R + AI + N = RAIN` 으로 다이그래프 유지).
      빌드 타깃에서 유도하므로 아이가 실제로 조립하는 것과 어긋날 수 없다
- [x] **표시 / 발화 분리** — `words[]`·`readAloud`·`options[]`·`letters[]` 가 표시용과
      발화용을 따로 갖는다. `screens.js` 의 모든 `speakEN` 이 오디오 전용 필드나
      `spokenPair()`/`optionSpeech()` 정규화 결과만 받는다(표시 문자열 직접 발화 경로 0개)
- [x] **다이그래프 지원 전체 경로** — `drag-build` 슬롯 배열(`['R','AI','N']`),
      `optionLabelHtml` 의 `length <= 2` sr-only, 검증기, 등식 유도
- [x] **`validateChapters()`** — dev 로드 시 데이터 계약 위반을 `console.error` 로 출력.
      프로덕션 번들에서는 tree-shaking 으로 제거됨(빌드로 확인)
- [x] **아트 데이터화** — `heroArt`/`villainArt` 가 style 테이블로 dispatch, 계열별 파일 분리
- [x] **아트 계열 6종** — 카봇 / 마블 / 공룡 / 포켓몬 / 마리오 / 토이스토리.
      계열마다 그림체가 다르다 (의도된 것 — 위 "캐릭터 아트" 절 참조)
- [x] 텍스트 1.5~2.2배 확대 + 애니메이션 톤 팔레트 → 레이아웃 빈 공간 해결
      (세계 선택 62.3%→1.7%, 보스 합체 29.2%→2.8%)

### 진행 중 / 미완료
전체 목록과 재발주용 상세는 **`HANDOFF.md` §4** 를 보라. 요약:
- [ ] **맵 화면 4건** — 텍스트 2배 더, `Power of I` 의 타깃 글자 색 강조, 별 제거,
      제목 줄바꿈 시 노드 정렬. `battle4` 가 텍스트 확대로 `SCROLL ovfY=46` 회귀
- [ ] **마리오 인체 비율·관절** — 어깨/손목/무릎 관절 없음, 엉덩이 폭이 어깨보다 넓음
- [ ] **Magno(잠만보) 누운 자세** + **포켓몬 원색 전환** + **Captain Red 과감하게**
- [ ] **난이도 곡선** — 7챕터의 beat 구성·보기 개수·`reviewTargets` 가 사실상 동일한데
      아이가 아는 글자는 3→18개로 늘어난다. **챕터 간 누적 복습이 설계되지 않았다**
- [ ] `.beat-equation` 스타일링 (등식 전용 중간 크기 — 훅만 있고 규칙이 없다)
- [ ] `icons3` 세로 `gap=136px(11.4%)` — 보기 3개 `choose` beat 하나만 8% 초과
- [ ] 챕터 7 **DC 히어로 계열 아트 미착수** (현재 robot 폴백 — 크래시는 없다)
- [ ] 아이콘 공백 (`grep -rn "TODO(icon)" src/data/chapters/*.js`)
- [ ] 챕터 8–33 콘텐츠 (26개)

### 출시 전 확인
- [x] ~~`DEV_UNLOCK_ALL` 을 손으로 `false` 로 바꾸기~~ → **구조적으로 해결됨.**
      `src/state.js` 가 `DEV_UNLOCK_ALL = import.meta.env.DEV` 이므로 프로덕션 빌드에서
      상수 접힘으로 사라진다. 손으로 바꾸는 체크리스트 항목은 언젠가 잊히므로 없앴다.
- [ ] 빌드 산출물 확인(회귀 방지): `dist/assets/*.js` 에 `DEV_UNLOCK`·`import.meta.env`·
      `validateChapters` 가 **없고**, 잠금 함수가 `return true` 로 단축되지 않고 실제 로직
      (`return n<=0||m(e[n-1].id)` 형태)을 유지하는지 확인
- [ ] **실기기에서 소리 표기 청취 확인** — macOS `say` 측정으로 하이픈형 결함을 잡았지만
      iPad Safari 음성과 동일 보장은 없다. 챕터 1 스테이지 1(`sssss` 단일형)과
      챕터 7(`a, a, a` 콤마형) 두 개만 들어보면 형식 양쪽을 다 확인한다

## 검증 방법 (재현 가능)
이 맥에는 `rsvg-convert`/`magick`/`inkscape` 가 **없다.** SVG·화면 확인은 두 경로뿐:
- **정적 아트 시트**: Node 로 HTML 시트 생성 → `qlmanage -t -s 1400 -o <dir> sheet.html`
- **실제 앱 화면**: `public/_probe.html` 하네스 + headless Chrome.
  `?shot=` 으로 화면 지정(`world`/`map2`/`battle2`/`boss1`/`build1`/`finale2`/`reward1` 등),
  TTS 를 no-op 으로 막아 오디오 대기 없이 렌더된다. 하단 HUD 에
  `NOSCROLL/SCROLL … gap=NNpx(N%)` 판정이 표시된다(스크롤은 눈으로 판정하지 말 것).
  ```
  CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  "$CH" --headless --disable-gpu --window-size=834,1281 --virtual-time-budget=5000 \
    --screenshot=out.png "http://localhost:5173/_probe.html?shot=battle2"
  ```
  합체 연출 **진행 중** 화면은 `--virtual-time-budget=700` (1650ms 자동 해제 전).
- Node 가 PATH 에 없을 수 있다: `/Users/kami.san/.nvm/versions/node/v24.19.0/bin/node`

### 이미 비싸게 배운 함정 — 다시 겪지 마라
- **`--dump-dom` 의 뷰포트는 `--window-size` 보다 87px 짧지만 `--screenshot` 은
  정확히 window-size 다.** 그래서 측정용 창은 세로 `834,1281` / 가로 `1194,921` 이다.
  이걸 모르고 `834,1194` 로 재면 세로 87px 을 덜 주고 측정하는 셈이다
- **HUD 의 `on=[…]` 를 항상 확인해라.** 존재하지 않는 `?shot=` 은 아무것도 렌더하지
  않으면서 `NOSCROLL gap=100%` 를 보고한다 — 통과처럼 읽힌다. `on=[none|-]` 이
  유일한 단서다. 실제로 이 때문에 "boss6 스크롤 4px" 오진 보고가 나왔다
- **하드 컷아웃(`filter: brightness(0)`)이 실루엣 판정의 1순위다.** 회색조는 내부
  선화가 남아서 관대하다 — 컷아웃만이 잡아낸 결함이 있다(Drillo 의 드릴 원뿔이
  외곽선을 1.6단위만 넘겨서, 회색조에서는 드릴로 보였지만 실루엣은 여전히 곰이었다)
- **`getBoundingClientRect` 는 이 Chrome 빌드에서 스트로크를 포함하지 않는다.**
  클리핑 검증은 `getBBox` → CTM 합성 → `stroke-width/2` 팽창으로 해야 한다.
  이렇게 바꾸자마자 눈에 안 보이던 13% 불투명도 그림자의 y=142.4 클리핑이 나왔다
- **`polygon points` 는 절대 좌표다.** 로컬 좌표로 착각해 `scale` 을 걸면 x 가
  음수로 날아가고, `mirrored()`(`x→120-x`)가 그걸 뷰박스 밖으로 옮긴다.
  변환은 눈대중하지 말고 숫자로 합성해라
- **Vite 모듈 인스턴스 함정** — Vite 는 변경된 모듈에 `?t=…` 를 붙인다. 하네스가
  `/src/…js` 를 직접 import 하면 **앱이 쓰는 것과 다른 인스턴스**를 받아, 앱이 읽지
  않는 객체를 변형하고도 진짜처럼 보이는 PASS 를 출력한다. 앱이 실제로 쓰는
  specifier 를 `fetch('/src/screens.js')` 에서 파싱해 재사용해라 (`_art.html` 참조)
- 가로 모드의 `gap` 수치는 `.battle-scene` 이 전체 높이 측면 컬럼이라 **무의미하다.**
  `?dbg=1` 기하 정보로 직접 재라
- **개정 전/후 비교 시트를 만들어라**: `git show HEAD:<file> > /tmp/before.js`

## 중요 규칙 / 설계 원칙

### 절대 실패 없음
- 무한 재시도 허용, 2연속 오답 → 재시연, 오답 패널티 없음

### TTS 규칙
- 영어 텍스트는 항상 소문자로 변환 후 발화 (`speakNow()` 내부 처리)
- `repeatAudio` 배열: 원소 하나 = 발화 하나 (여러 단어 한 문자열에 cramming 금지)
- 발화 간 최소 gap: 1100ms (sequence), 500ms (단독). **음성 상수 5개는 측정으로
  검토를 마쳤고 전부 유지 결론이다** — 바꾸려면 근거를 새로 측정해라:
  `MIN_GAP_MS`(500) · sequence gap(1100) · `speakEN`/`speakTap` rate(0.85) ·
  `speakKO` rate(1) · 안전 타이머(실제 길이의 ~3배 — 절대 발화되지 않아야 하는 그물)
- **gap 을 키우는 것은 "너무 빠르다"의 해법이 아니다.** 이미 1100ms 침묵이 있고,
  거짓 `onend` 에서도 250ms 는 남는다. 해법은 **반복 구조**(콤마 묶음)다
- **rate 를 낮춰도 짧은 소리는 길어지지 않는다** — 고정 조음 시간이 지배한다
  (`a` 는 rate 1.0→0.5 에서 0.33s→0.40s, +21% 뿐). 반대로 rate 를 올리면
  블립이 더 짧아져 증상이 악화된다
- 최종 수단은 **철자 자체**다. `a`(366ms)/`oh`(386ms)는 어떤 타이밍 조정으로도
  붙잡을 수 없다. 잘 들리는 소리는 반복당 780~855ms(`lll` 784, `sss` 854)

### UI 규칙
- 아이패드 양방향(세로/가로) 스크롤 없음 필수
- 텍스트 사이즈: 5세 기준 충분히 크게 (기본 font-size 높게 유지)
- 단일 알파벳 letterTile: 텍스트 레이블 숨김 (`.sr-only`), 블록 자체가 문자 표현

### 코드 스타일
- 주석은 "왜"가 비자명한 경우만 (what 설명 금지)
- 에러 핸들링은 실제 발생 가능한 경우만 (내부 보장 신뢰)

### 챕터 데이터 계약 (챕터 3–33 작성자 필수)
- **표시 / 발화 분리**: 화면에는 실제 글자·단어만, 발화에는 소리만.
  둘이 다르면 `words: [{ text: 'S', say: 'sss' }]`,
  `readAloud: { targetText: 'S', say: 'sss' }`,
  `options: [{ label: 'S', say: 'sss' }]`,
  `letters: [{ text: 'S', say: 'sss' }]`.
  화면에 안 나오는 `repeatAudio`/`promptAudio`는 소리 표기를 직접 쓴다.
  단일 문자를 그대로 발화하면 글자 **이름**("에스", "아이")으로 읽힌다.
- **소리 표기 규칙**: 지속음은 **반복문자**(`sss`/`nnn`/`iii`), 지속 불가한 소리는
  **근사 CV 철자**(`tuh`/`puh`/`kuh`/`huh`), 반복 시 장모음이 되는 모음은 근사 철자(`eh`/`uh`).
  S `sss` · A `aaa` · I `iii` · N `nnn` · M `mmm` · L `lll` · Z `zzz` · E `eh` · U `uh` ·
  O `ough` · T `tuh` · P `puh` · B `buh` · D `duh` · H `huh` ·
  C/K `kuh` (Jolly는 c를 /k/로 가르치고, C와 K는 **같은 표기**를 써야 한다)
- **음성 충돌쌍 — B와 D를 소리로 변별시키지 마라.** `buh`/`duh` 는 Alex 음성에서
  **완전히 동일하게** 렌더된다(`bbuh`/`dduh` 등 대안 4종도 전부 동일). 그래서
  **한 beat(또는 `choose-sequence` 한 step) 안에서 두 개 이상의 `letterTile` 보기가
  충돌쌍 표기를 가질 수 없다** — `validateChapters()` 가 명시 테이블로 강제한다.
  보기가 그림인 `promptLetter` 역방향 문항은 무해하다(발화되는 건 그림 단어다).
  교육적으로도 이게 옳다: b/d 반전은 *글자 모양* 혼동이므로 모양으로 가르쳐야 하고,
  둘 다 유성 파열음이라 5세에게 귀로 변별시키는 건 애초에 약한 연습이다.
  `aw`(O)도 Alex에서 `oh`와 동일해 탈락했고, Alex는 짧은 모음 철자(`ah`/`o`/`awe`/
  `augh`)를 죄다 글자 이름 하나로 정규화한다 — 그래서 O는 `ough` 다.
- **하이픈형(`t-t-t`) 은 절대 쓰지 마라.** TTS 가 하이픈을 무시하고 글자 **이름**으로
  읽는다 — 측정으로 확인됐다(`t-t-t` 와 `"tee tee tee"` 의 합성 길이가 두 음성에서
  소수점 6자리까지 동일). `validateChapters()` 가 이 패턴을 잡는다.
- **새 소리 표기를 정할 때는 반드시 측정해라** (오디오 출력 없이도 가능):
  ```bash
  say -v Samantha -o a.aiff "tuh tuh tuh" && afinfo a.aiff | grep "estimated duration"
  say -v Samantha -o b.aiff "tee tee tee" && afinfo b.aiff | grep "estimated duration"
  ```
  후보와 글자 이름을 **3회 반복형**으로 비교하고(단음절 비교는 노이즈가 커서 결론이
  흔들린다), `Samantha`/`Alex` 두 음성 교차 확인. 길이가 같으면 같은 음소 시퀀스다.
  **길이가 근접해서 애매하면 반복 배수를 바꿔 재측정해라** — 같은 음소라면 1x·2x·3x·5x
  *모든* 배수에서 일치해야 한다. 한 배수에서의 근접은 우연일 수 있다(`rrr`/`sss` 가
  Samantha 3x 에서 0.7ms 차이였는데 다른 배수에서 갈라져 별개 음소로 확정됐다).
  **판별 규칙**: 배수를 15x/20x/30x 로 올렸을 때 차이가 **0으로 수렴하면 진짜 충돌**,
  **고정된 절대값으로 유지되면(예: 항상 3.5ms) 별개 음소**다(`guh`/`duh` 가 절대값
  고정이라 별개로 확정됐고, 확정 충돌쌍 `buh`/`duh` 는 모든 배수에서 정확히 0.0ms 였다).
  O 의 `aw` 는 Alex 에서 `oh` 와 충돌한다 — O 를 실제로 가르치는 챕터에서 재선정 필요.
  최종 확인은 실기기에서 귀로 한 번 해야 한다(macOS 음성 ≈ iOS 음성이지만 동일 보장 없음).
- **캐릭터 색·외형은 `art.js` 소유**: 데이터는 `hero: { name, art, style }` 만 준다.
  색이나 엠블럼을 데이터에서 넘기면 캐릭터 고유색을 덮어쓴다.
- **표시 이름 / 아트 정체성 분리 (필수)**:
  `name` 은 **표시 문자열**이고 언제든 번역·변경된다.
  `art` 는 **안정적 정체성 슬러그**(kebab-case ASCII)이고 팔레트 조회 키다.
  `resolveArt()` 는 `spec.art` → `spec.name` → style 순으로 찾는다.
  **`art` 가 없으면 이름을 바꾸는 순간 캐릭터 고유색이 전부 날아간다.**
  한글을 코드 키로 쓰면 따옴표·IME·`grep` 마찰에 인코딩 사고 위험까지 붙고,
  무엇보다 표시 문자열과 식별자가 같은 값이 되어 이름 변경이 곧 아트 파손이 된다.
  `validateChapters()` 가 `art` 누락을 잡는다.
- **표시 언어 규칙**: 문제를 설명하는 문장(`instructionKo`, `recapKo`, 오답 유도 문구)은
  **한글**. 그 밖의 모든 것(버튼, 짧은 피드백 라벨, 캐릭터 이름, 챕터/스테이지/월드
  제목)은 **영어** — 영어 학습 앱이므로 화면의 영어가 그 자체로 환경 문자 노출이다.
- **스테이지 1 튜토리얼 `teach` 표준 형식**: `repeatAudio` 는 항상
  **`[소리블록, 단어앵커, 소리블록]` 3원소**다. 단어앵커는 그 스테이지에서
  실제로 쓰는 단어 하나(소리→단어→소리 순환이 Jolly 표준 절차이고 단어가
  소리의 음향적 기준점을 준다). 소리블록의 내부 형태만 측정으로 갈린다 —
  두 음성 모두 0.5초 이상으로 렌더되는 소리는 **단일 발화**(`'sssss'`),
  그보다 짧으면 **콤마 삼중**(`'a, a, a'`).
- **콤마 묶음은 "붙잡을 수 없는 소리"에 대한 처방이지 보편 형식이 아니다.**
  이미 긴 소리에 적용하면 한 발화가 2~5초가 되어 역효과다(`sssss` 콤마삼중
  = Alex 5.05초). 반대로 **공백 연결(`'a a a'`)은 절대 쓰지 마라** — 엔진이
  압축·융합해 3토큰이 안 들린다(단일의 1.49배뿐). 콤마는 토큰당 ~510ms 로
  선형이라 또박또박 나온다. `validateChapters()` 가 공백 연결을 잡는다.
- **`recapKo` 는 표시 전용이다.** 리워드 화면 발화는 `recapAudio: { ko, en }` 이
  담당한다 — `ko` 는 한글만(`speakKO`), `en` 은 영어만(`speakEN`).
  **영어 텍스트를 `speakKO` 로 보내지 마라.** 한글 근사 표기(`'크 소리'`)로 바꾸는 것도
  금지다 — /s/ 를 ㅅ, /r/ 을 ㄹ로 가르치는 건 한국 학습자의 대표 오류를 앱이 심는 것이다.
- **`scored: true` 인 `choose`/`multiselect`/`drag-build` 에는 `readAloud` 필수.**
  없으면 `multiselect` 는 크래시, 나머지는 데미지가 영원히 안 들어가서 체력바가
  0에 도달하지 못한다 — 크래시보다 진단이 어려운 실패다.
- **stage/beat id 는 전역 유니크** (`getStageById()` 가 전체 챕터를 flat 검색).
  챕터 N 은 `cN-stage-*` / `cNsM-*` 접두사를 쓴다.
- 위 전부 `validateChapters()` 가 dev 로드 시 `console.error` 로 잡는다.
  **콘솔에 `[chapters]` 가 보이면 커밋하지 마라.**

## 개발 서버

```bash
# 프로젝트 루트에서
npm run dev -- --host
```

또는 `.claude/launch.json`의 `carbot-phonics-dev` 설정으로 Browser pane에서 실행.

- 로컬: http://localhost:5173
- iPad 테스트: `ifconfig | grep "inet 192"` 로 LAN IP 확인 후 `http://<IP>:5173`

## 챕터 1 스테이지 구조 (참고)
```
s1-1: S 소리 가르치기 (teach → break)
s1-2: A 소리 가르치기 (teach → break)
s1-3: T 소리 가르치기 (teach → break)
s1-4: S/A/T 복합 연습 (choose, multiselect, listen-repeat)
s1-5: 챕터 보스 SAT 합체 (chapterBoss: true) — 미니봇 3개 합체 + `S + A + T = SAT`
```
**`chapterBoss: true` 다** (`boss: true` 가 아니다). 틀리면 조용히 망가진다 —
합체 연출도, 보스 아트도, 등식도 안 나오고 잠금 로직이 폴백으로 빠진다.
