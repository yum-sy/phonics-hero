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
  art.js               # 캐릭터 SVG (heroRobot, villainRobot 등)
  icons.js             # 단어 아이콘 SVG + shoutBurst() 집중선 효과
  style.css            # 전체 스타일, 가로/세로 방향 지원
  data/
    chapters/
      index.js         # 챕터 목록 통합, worlds/stages 배열, 조회 함수
      chapter-01.js    # 챕터 1 (S/A/T) — 현재 유일하게 구현된 챕터
    stages.js          # 하위 호환 shim → chapters/index.js 재export
```

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

### 캐릭터 아트 (art.js)
```js
heroRobot({bodyColor, accent, emblem, visorColor})        // 일반 히어로
heroDeluxeRobot({bodyColor, panelColor, accent, visorColor}) // 카본 (보스전 합체 형태)
heroSuperhero({bodyColor, accent, capeColor, maskColor, emblem}) // 슈퍼히어로 스타일 (Ch2, 9, 16)
villainRobot({bodyColor, accent})                          // 일반 악당
villainDeluxeRobot({bodyColor, accent, capeColor, visorColor}) // 다크스파크 (챕터 보스)
heroArt(name)   // 이름으로 dispatch
villainArt(name) // 이름으로 dispatch
```
- 모든 SVG: viewBox "0 0 120 140", action figure 비율, flat color

### 챕터/월드 구조 (data/chapters/index.js)
- `WORLD_SIZE = 7`, `TOTAL_PLANNED_CHAPTERS = 33`
- 5개 월드: Ch1–7, Ch8–14, Ch15–21, Ch22–28, Ch29–33
- 각 챕터에 `stages[]` (5개), 마지막 스테이지가 `chapterBoss: true`
- 조회 함수: `getChapterById`, `getChapterForStage`, `getStageById`, `getWorldById`, `getWorldForChapterOrder`

## 현재 구현 상태

### 완료
- [x] 월드 선택 → 챕터 선택 → 스테이지 맵 → 스테이지 화면 네비게이션
- [x] 챕터 1 (S/A/T + SAT 합체): 5개 스테이지 완전 구현
- [x] 8가지 beat 타입 렌더러
- [x] TTS 큐 (겹침 방지, 안전 타임아웃, stuck 방지)
- [x] 오답 재시연 (2연속 오답 시 힌트)
- [x] 음성 재생 중 화면 이동 차단 (`whenAudioIdle()` 패턴)
- [x] `clearAudioQueue()` — 뒤로가기 시 대기 발화 취소
- [x] 가로/세로 방향 동시 지원 (CSS 미디어쿼리)
- [x] letterTile 단일 알파벳 레이블 sr-only (`.sr-only` CSS)
- [x] shoutBurst() — 집중선 SVG (중앙 비어있음, 48개 선, 삼각형 accent 없음)
- [x] 보스 스테이지 "합체 연출" — 미니 로봇 3개(스테이지 2–4) 슬라이드인 + 카본 등장
  - 탭으로 스킵 가능 (풀스택 에이전트가 추가 예정/확인 필요)
  - 미니 로봇 팔레트 동적 처리 (챕터 데이터 기반, 풀스택 에이전트 확인 필요)

### 진행 중 / 미완료
- [ ] 챕터 2–33 콘텐츠 미구현 (챕터 1만 존재)
- [ ] 합체 연출: 튜토리얼 스테이지(1번) 제외, 스테이지 2–4 3개 로봇 — 풀스택 에이전트에 지시함
- [ ] 합체 연출: 탭 스킵 + 팔레트 동적화 — 풀스택 에이전트에 지시함

### 출시 전 반드시 할 것
- [ ] `src/state.js` 6번 줄: `DEV_UNLOCK_ALL = true` → `false` 로 변경

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
