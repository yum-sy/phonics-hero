# 카봇 파닉스 대작전 — CLAUDE.md

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
리더(=현재 세션)가 지시·검토, 나머지는 전문 에이전트로 위임.

| 역할 | 담당 영역 |
|---|---|
| **리더** | 요청 분석, 에이전트 위임, 결과 비판·재지시 — 직접 코딩 최소화 |
| **디자인 에이전트** | SVG 아트, CSS 애니메이션, UI 레이아웃 (`art.js`, `icons.js`, `style.css`) |
| **풀스택 에이전트** | 게임 로직, 오디오, 상태관리 (`screens.js`, `audio.js`, `state.js`) |
| **파닉스 에이전트** | 커리큘럼 설계, 문제 구성, 발음 데이터 (`data/chapters/*.js`) |

## 파일 구조
```
src/
  main.js              # 진입점, renderWorldSelect() 호출
  screens.js           # 4단계 네비게이션: 월드 → 챕터 → 맵 → 스테이지
  audio.js             # TTS 큐 (겹침 방지), SpeechRecognition
  state.js             # 진행 상태, 잠금 로직
  art.js               # heroArt/villainArt dispatch + style 테이블 + 팔레트,
                       #   슈퍼히어로 계열 함수
  art/
    robots.js          # 로봇 계열 (각진 변신자동차 문법)
  icons.js             # 단어 아이콘 SVG + shoutBurst() 집중선 효과
  style.css            # 전체 스타일, 가로/세로 방향 지원
  data/
    chapters/
      index.js         # 챕터 통합, worlds/stages 배열, 조회 함수,
                       #   validateChapters() (dev 전용 계약 검증)
      chapter-01.js    # 챕터 1 (S/A/T → SAT)
      chapter-02.js    # 챕터 2 (I/P/N → PIN)
    stages.js          # 하위 호환 shim → chapters/index.js 재export
public/
  _probe.html          # 화면 검증 하네스 (gitignore, 버려지는 파일)
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
- `tryRecognize(targetText)` — SpeechRecognition 음성인식 (보너스, 실패 허용)

### 게임 루프 (screens.js)
- Beat 타입 8가지: `teach`, `break`, `choose`, `choose-sequence`, `multiselect`, `drag-build`, `listen-repeat`, `finale`
- 체력바 기반 전투: 정답 → 악당 체력 감소, 2연속 오답 → 정답 힌트 재시연
- **오답 구제**: `makeWrongStreakTracker` + `pulseHint` + `redemonstrateOption` (2연속 오답 시)
- **음성 완료 대기**: 모든 beat 전환은 `waitForTransition(minDelayMs)` = `whenAudioIdle()` + 최소 딜레이
- `optionLabelHtml(opt)` — 단일 알파벳 letterTile의 텍스트 레이블 sr-only 처리

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
- `art/robots.js` — `robot`, `robot-deluxe` (히어로/빌런). 각진 변신자동차 문법:
  가슴=자동차 앞면(앞유리+그릴 슬랫+헤드라이트), 어깨 바퀴, 스포일러, V 크레스트, `rx` 금지
- `art.js` 내 슈퍼히어로 계열 — `superhero`, `superhero-acrobat/-shield/-thunder/-armor`,
  `supervillain-fog/-eraser/-stop/-jumble/-king`
- 모든 SVG: viewBox `"0 0 120 140"`, flat color, 그라디언트/필터 금지, 기하 프리미티브만

**표시 크기가 여러 개다**: 66px(합체 연출 미니봇) / 96px(챕터 카드) / 110px(전투 스프라이트)
/ 132px(합체 최종 형태). 66px 에서 1 viewBox 단위 ≈ 0.47px 이므로 **3단위 미만 디테일은
회색 죽이 된다.** 작은 크기에서 통하는 유일한 전략은 요소 수를 줄이고 남은 것을 과장하는 것.
`emblem` 글자는 파닉스 교육 요소이므로 66px 에서 읽혀야 한다.

### 챕터/월드 구조 (data/chapters/index.js)
- `WORLD_SIZE = 7`, `TOTAL_PLANNED_CHAPTERS = 33`
- 5개 월드: Ch1–7, Ch8–14, Ch15–21, Ch22–28, Ch29–33
- 각 챕터에 `stages[]` (5개), 마지막 스테이지가 `chapterBoss: true`
- 조회 함수: `getChapterById`, `getChapterForStage`, `getStageById`, `getWorldById`, `getWorldForChapterOrder`

## 현재 구현 상태

### 완료
- [x] 월드 선택 → 챕터 선택 → 스테이지 맵 → 스테이지 화면 네비게이션
- [x] 챕터 1 (S/A/T → SAT), 챕터 2 (I/P/N → PIN) — Jolly Group 1 완료
- [x] 8가지 beat 타입 렌더러
- [x] TTS 큐 (겹침 방지, 안전 타임아웃, stuck 방지)
- [x] 오답 재시연 (2연속 오답 시 힌트)
- [x] 음성 재생 중 화면 이동 차단 (`whenAudioIdle()` 패턴)
- [x] `clearAudioQueue()` — 뒤로가기 시 대기 발화 취소
- [x] 가로/세로 방향 동시 지원 (CSS 미디어쿼리)
- [x] shoutBurst() — 집중선 SVG
- [x] 보스 합체 연출 — 미니봇 **3개(스테이지 2–4)** 슬라이드인 + 최종 형태 등장,
      **탭으로 즉시 스킵**(타임아웃/탭 이중 실행 가드), 아트는 스테이지 데이터 기반
- [x] **표시 / 발화 분리** — `words[]`·`readAloud`·`options[]`·`letters[]` 가 표시용과
      발화용을 따로 갖는다. `screens.js` 의 모든 `speakEN` 이 오디오 전용 필드나
      `spokenPair()`/`optionSpeech()` 정규화 결과만 받는다(표시 문자열 직접 발화 경로 0개)
- [x] **`validateChapters()`** — dev 로드 시 데이터 계약 위반을 `console.error` 로 출력.
      프로덕션 번들에서는 tree-shaking 으로 제거됨(빌드로 확인)
- [x] **아트 데이터화** — `heroArt`/`villainArt` 가 style 테이블로 dispatch, 계열별 파일 분리
- [x] 카봇 로봇 4종 각진 재설계, 챕터 2 히어로 4종 + 빌런 5종 개성화

### 진행 중 / 미완료
- [ ] 챕터 3 (Jolly Group 2 앞 3개: C/K, E, H) — 파닉스 에이전트 작업 중
- [ ] 공룡 계열 아트 (`src/art/dinosaurs.js`) — 디자인 에이전트 작업 중
- [ ] 레이아웃 — 834×1194 에서 세로 공간 약 1/3 이 빈 채로 낭비됨(전투 씬 아래 ~190px,
      버튼 아래 ~190px). 스크롤은 없으나 아트·글자를 키울 공간을 안 쓰고 있다
- [ ] 챕터 4–33 콘텐츠

### 출시 전 확인
- [x] ~~`DEV_UNLOCK_ALL` 을 손으로 `false` 로 바꾸기~~ → **구조적으로 해결됨.**
      `src/state.js` 가 `DEV_UNLOCK_ALL = import.meta.env.DEV` 이므로 프로덕션 빌드에서
      상수 접힘으로 사라진다. 손으로 바꾸는 체크리스트 항목은 언젠가 잊히므로 없앴다.
- [ ] 빌드 산출물 확인(회귀 방지): `dist/assets/*.js` 에 `DEV_UNLOCK`·`import.meta.env`·
      `validateChapters` 가 **없고**, 잠금 함수가 `return true` 로 단축되지 않고 실제 로직
      (`return n<=0||m(e[n-1].id)` 형태)을 유지하는지 확인
- [ ] **실기기에서 소리 표기 청취 확인** — macOS `say` 측정으로 하이픈형 결함을 잡았지만
      iPad Safari 음성과 동일 보장은 없다. 챕터 1 스테이지 4(T) 한 번만 들어보면 된다

## 검증 방법 (재현 가능)
이 맥에는 `rsvg-convert`/`magick`/`inkscape` 가 **없다.** SVG·화면 확인은 두 경로뿐:
- **정적 아트 시트**: Node 로 HTML 시트 생성 → `qlmanage -t -s 1400 -o <dir> sheet.html`
- **실제 앱 화면**: `public/_probe.html` 하네스 + headless Chrome.
  `?shot=` 으로 화면 지정(`world`/`map2`/`battle2`/`boss1`/`build1`/`finale2`/`reward1` 등),
  TTS 를 no-op 으로 막아 오디오 대기 없이 렌더된다. 하단 HUD 에
  `NOSCROLL/SCROLL … gap=NNpx(N%)` 판정이 표시된다(스크롤은 눈으로 판정하지 말 것).
  ```
  CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  "$CH" --headless --disable-gpu --window-size=834,1194 --virtual-time-budget=5000 \
    --screenshot=out.png "http://localhost:5173/_probe.html?shot=battle2"
  ```
  합체 연출 **진행 중** 화면은 `--virtual-time-budget=700` (1650ms 자동 해제 전).
- Node 가 PATH 에 없을 수 있다: `/Users/kami.san/.nvm/versions/node/v24.19.0/bin/node`

## 중요 규칙 / 설계 원칙

### 절대 실패 없음
- 무한 재시도 허용, 2연속 오답 → 재시연, 오답 패널티 없음

### TTS 규칙
- 영어 텍스트는 항상 소문자로 변환 후 발화 (`speakNow()` 내부 처리)
- `repeatAudio` 배열: 원소 하나 = 발화 하나 (여러 단어 한 문자열에 cramming 금지)
- 발화 간 최소 gap: 1100ms (sequence), 500ms (단독)

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
s1-5: 챕터 보스 SAT 합체 (chapterBoss: true, hero: '카본', villain: '다크스파크')
```
