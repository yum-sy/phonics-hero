# Phonics Hero (카봇 파닉스 대작전)

5세 한국 남아를 위한 iPad 영어 파닉스 학습 게임. Jolly Phonics 42개 소리 전체를
변신 로봇·코믹북 히어로·클레이 공룡·픽셀 몬스터·조립 블록·직업 히어로·DC풍 7개 계열의
히어로/빌런 전투로 가르친다. 프레임워크 없는 Vanilla JS + Vite 단일 페이지 앱.

> 이 문서는 **개발 명세서 + 규칙 요약**이다. 세부 규칙의 단일 진실원은
> [`CLAUDE.md`](CLAUDE.md)(항구적 규칙)이고, 지금 중단된 지점과 다음 할 일은
> [`HANDOFF.md`](HANDOFF.md)에 있다. 새 세션은 `HANDOFF.md` → `CLAUDE.md` 순으로 읽는다.

---

## 읽으면 힘이 되는 전투 동료 (2026-11-06)

히어로 그림의 상시 글자·별 배지를 제거하고 기존 캐릭터 디자인을 유지한다.
글자와 소리는 독립된 학습 영역에서 다루고, 정답의 에너지가 히어로의 공격으로
이어진다. 합체의 소리 순서·다이그래프·단어 구성은 기존 커리큘럼을 따른다.
마이크 ATTACK은 음량에 반응하는 참여 연출이며 발음 정확도를 평가하지 않는다.
아래 V2의 상시 배지 설명은 이전 기록으로, 현재 규칙은 `CLAUDE.md` 맨 위를 따른다.

행동 검증: `node scripts/check-game-flow.mjs http://localhost:5174`.
오답·충전·마이크 권한거부 폴백·중복 공격·합체·글자 Undo를 실제 화면에서 검사한다.
테스트는 별도 브라우저 프로필을 사용하며 iPad 실제 청취/발음 평가를 대신하지 않는다.

## 월드별 캐릭터 V3 (2026-11-05)

V2 기본 디자인에 **70종(일반 히어로35 + 최종 보스35)**을 추가했다.
현재 33챕터에 66종을 사용하며 월드5의 픽셀·직업군 4종은 예비다.
신규 히어로는 일반 스테이지와 합체 연출에 등장한다. 각 월드 보스는 주색과
체형·장비를 다르게 구성했다. 잠긴 그림은 검정 실루엣으로 표시한다.

`src/art/world-character-assets.js`가 V2 배선보다 우선하며 PNG는 `public/art/v3/`,
제작 계획은 `design/world-art-plan.json`에 있다. 상하 기본16px + 기기 안전 영역을
확보하고 UI 색상을 부드럽게 조정했다. 설치형 iPad 실기기 확인은 별도로 필요하다.

검증: `node scripts/check-world-characters.mjs`,
`node scripts/check-character-assets.mjs`, `node scripts/check-safe-layout.mjs`.

## 캐릭터 디자인 V2 (2026-11-05)

295개 캐릭터 연결을 7개 투명 PNG 아틀라스의 65개 역할 디자인으로 교체했다.
일반 히어로·합체 히어로·일반 빌런·최종 보스를 구별하고, 직업군의 합체는
우주비행사다. 픽셀 몬스터는 공룡 체형과 구분한다. 글자는 그림 아래 독립된
SVG 배지에 표시하므로 학습 소리·글자 계약을 유지한다.

`src/art/character-assets.js`가 안정 슬러그를 배선하고 `src/art/atlas.js`가
렌더링한다. PNG는 `public/art/v2/`, 디자인 근거와 프롬프트는
`design/concepts/2026-11-05/`에 있다. 아래 기존 순수 SVG 설명과 동결 규칙보다
`CLAUDE.md` 맨 위 V2 규칙을 우선한다. 실제 iPad 확인 여부는 `HANDOFF.md` 참고.

검증: `node scripts/check-character-assets.mjs http://localhost:5174`.

## 1. 제품 명세

| 항목 | 값 |
|---|---|
| 대상 | 5세 남아, 한국어 모어, 영어 파닉스 입문 |
| 기기 | iPad Pro 11" 4세대, Safari/Chrome |
| 뷰포트 | 세로 834×1194 / 가로 1194×834 — **스크롤 0 필수** |
| 커리큘럼 | Jolly Phonics Group 1~7, 42개 소리 (챕터 1~14) + 자음 블렌드/누적 복습 (챕터 15~33) |
| 규모 | 5개 월드 · 33개 챕터 · 165개 스테이지(챕터당 5, 스테이지당 ~15분) |
| 캐릭터 | 295명 (히어로 130 + 빌런 165), 7개 그림체 계열 |
| 단어 아이콘 | 84종 (대부분 실사진 크롭 `photoIcon()`, 일부 손그림 SVG) |
| 음소 에셋 | `public/sounds/*.wav` 41종 (TH 유성음만 의도적 무표기) |
| 원칙 | **절대 실패 없음** — 무한 재시도, 오답 패널티 없음, 2연속 오답 시 재시연 |

### 게임 루프
월드 선택 → 챕터 선택 → 스테이지 맵 → 스테이지(beat 시퀀스). 체력바 전투:
정답이면 빌런 체력 감소, 마지막 스테이지(`chapterBoss: true`)는 미니봇 합체 연출
+ 글자 등식(`S + A + T = SAT`).

Beat 타입 9종: `teach` `break` `choose` `choose-sequence` `multiselect` `drag-build`
`match-shape` `listen-repeat` `finale`. `match-shape`는 b/d 반전을 *귀*가 아니라
*모양*으로 변별시키는 beat다(아래 "음성 충돌쌍" 참고).

**마이크 ATTACK**: 정답 후 아이가 소리치면 공격이 나간다. 음성 *인식*이 아니라
`getUserMedia` + `AnalyserNode`로 **음량(RMS)만** 본다. 마이크가 없거나 거부되면
그냥 탭-투-컨티뉴로 폴백한다(아이에게 에러를 보이지 않는다).

### 월드 구성 (전부 확정)

| 월드 | 챕터 | 계열 순서 |
|---|---|---|
| 1 | 1~7 | 카봇→마블→공룡→포켓몬→마리오→토이스토리→DC |
| 2 | 8~14 | 마블→공룡→마리오→토이스토리→카봇→DC→포켓몬 |
| 3 | 15~21 | 공룡→DC→토이스토리→포켓몬→마블→카봇→마리오 |
| 4 | 22~28 | 포켓몬→DC→마블→마리오→공룡→토이스토리→카봇 |
| 5 | 29~33 | DC→마리오→카봇→마블→공룡(최종보스) |

월드 선택 카드는 **그 월드 첫 챕터의 보스 히어로**를 보여준다 → 월드 순서를
다시 짤 때 인접 월드의 첫/마지막 챕터 계열이 겹치지 않게 할 것.

---

## 2. 기술 스택 · 시작하기

- **빌드**: Vite 8 + Vanilla JS/HTML/CSS (프레임워크 없음)
- **오디오**: WebAudio(음소 에셋) + Web Speech API `SpeechSynthesis`(TTS 폴백)
- **저장**: `localStorage` (진행 상태)
- **아트**: 인라인 SVG, viewBox `"0 0 120 140"`, 그라디언트/필터 금지

```bash
npm install
npm run dev -- --host        # https://localhost:5173  (또는 .claude/launch.json → 5174)
npm run build                # dist/
```

### iPad로 붙기
1. `ifconfig | grep "inet 192"` 로 Mac의 LAN IP 확인
2. iPad와 Mac이 같은 Wi-Fi에 있어야 한다
3. **`https://<LAN-IP>:<port>`** 로 접속 (http 아님 — 아래 참고). 자체서명 인증서
   경고는 "계속 진행"
4. `.certs/`는 gitignore. **LAN IP가 바뀌면 인증서를 재생성**해야 한다(SAN에 IP가 박혀 있음):
   ```bash
   openssl req -x509 -newkey rsa:2048 -nodes -keyout .certs/dev.key -out .certs/dev.crt -days 3650 \
     -subj "/CN=carbot-phonics-dev" \
     -addext "subjectAltName=DNS:localhost,IP:127.0.0.1,IP:<LAN IP>"
   ```

**왜 https인가**: `getUserMedia`(마이크 ATTACK)는 secure context에서만 존재한다.
`http://<LAN-IP>`는 secure context가 아니라 API 자체가 `undefined`다 — 버그가
아니라 원래 없는 것이고, 앱은 조용히 탭-투-컨티뉴로 폴백한다.
`http://`와 `https://`는 **별개 origin**이라 localStorage 진행 상태가 안 이어진다.

### 진행 상태 URL 헬퍼 (dev)
`DEV_UNLOCK_ALL`은 `false`로 고정돼 있다(순서대로 클리어해야 열린다). 특정 지점부터
테스트하려면:
- `?forceclearthrough=c7-stage-5` — 그 스테이지까지 전부 클리어 처리 (예: 월드 2부터 시작)
- `?forceclear=c3-stage-2,c3-stage-3` — 지정 스테이지만
- `?debugaudio=1` — 화면 위 오디오/마이크 진단 패널(🐞 탭, 기본 접힘). 실기기에
  콘솔이 없을 때 유일한 창구. 모든 `speak()`/WebAudio/`getUserMedia`/`[shout] rms=` 가
  실제 게임과 나란히 찍힌다.

---

## 3. 파일 구조

```
CLAUDE.md / HANDOFF.md     규칙 / 중단 지점
vite.config.js             HTTPS dev 서버 + /__verdict 미들웨어(갤러리 판정 저장)
sound-verdicts.json        소리 갤러리 OK/NO (사용자가 실기기에서 판정)
art-verdicts.json          아트 갤러리 OK/NO
scripts/gen-sounds.py      음소 에셋 생성기 → public/sounds/*.wav + manifest.json
scripts/crop-icon-photos.py 아이콘 크롭 파이프라인(icon_refs/ 원본 보존)
src/
  main.js                  진입점, dev URL 헬퍼
  screens.js               네비게이션 + 9종 beat 렌더러 + 보스 등식 + 누적복습 생성기
  audio.js                 오디오 큐(에셋+TTS 통합), 마이크 ATTACK
  state.js                 진행 상태 / 잠금 / 체크포인트
  art.js                   heroArt/villainArt dispatch + 팔레트 + 마블 계열
  art/{robots,dinosaurs,creatures,platformer,toys,dc}.js   계열별 아트
  icons.js                 단어 아이콘 84종
  debugAudio.js            ?debugaudio=1 패널
  style.css                전체 스타일, 세로/가로
  data/chapters/index.js   챕터 통합, SOUND_TABLE(42개 소리 단일 진실원), validateChapters()
  data/chapters/chapter-01..33.js
public/
  sounds/                  음소 wav 41종 + manifest.json
  _probe.html              화면 회귀 하네스 (NOSCROLL/SPILL/CLIP 판정 HUD)
  _probe-fs.html           게임 로직·오디오 시나리오 하네스
  _art.html                아트 갤러리 + OK/NO
  _audio.html              소리 갤러리 + OK/NO
```

새 챕터 추가 = `chapter-NN.js` 작성 + `chapters/index.js`의 import/배열에 추가. 끝.
새 캐릭터/소리는 갤러리(`_art.html`/`_audio.html`)에 **자동 반영**되므로 실기기
검증 경로가 항상 열려 있다.

---

## 4. 핵심 아키텍처

### 오디오 큐 (`audio.js`) — 규칙이 가장 많은 곳
- 모든 발화는 단일 `queueTail` promise chain에 직렬 → **절대 겹침 없음**
- `speakEN()`은 항상 소문자 변환(대문자 `S` → "Capital S" 방지)
- 모든 beat 전환은 `whenAudioIdle()`을 기다린다. 뒤로가기는 `clearAudioQueue()`
  (대기 발화만 취소, 진행 중 발화는 자연 종료)
- **`speechSynthesis.cancel()`을 절대 호출하지 않는다** — iOS에서 큐 전체가 영구
  무음이 된다. "이 경우는 예외적으로 안전하다"는 판단이 실제로 두 번 틀렸다.
  예외를 만들 때마다 실기기 `?debugaudio=1` 로그로 검증할 것
- **`await ctx.resume()`을 하지 않는다** — 제스처 없이 영원히 settle되지 않아
  `pump()`가 교착하고 앱이 얼어붙는다. fire-and-forget 또는 바운드된 race만
- 주기적 `pause()/resume()` 킥은 **실기기에서 해롭다**는 증거가 있어 꺼져 있다.
  실기기 증거 없이 다시 켜지 말 것
- 제스처 확립 핑은 **공용 큐를 우회해 클릭 핸들러 안에서 동기 `speak()`** 해야 한다
- 소리 드릴은 TTS가 아니라 **단어에서 뜬 음소 에셋**(`sss` = `sun`의 /s/ 260ms).
  TTS로 맨 음소를 내면 `sss`가 "ess ess ess"(글자 이름)로 읽힌다 — 실기기 3회 반려
  후 전환. 모든 실패 경로는 TTS로 폴백하므로 **무음에 도달할 수 없다**

### 마이크 ATTACK (`attemptShoutAttack`)
- 음량만 본다. `autoGainControl/noiseSuppression/echoCancellation` **전부 off**
  (AGC가 속삭임도 "정상 발화 크기"로 증폭해 임계값이 무의미해진다)
- `SHOUT_RMS_THRESHOLD = 0.005` — 어른 큰 외침 실측 최대 0.0082 기준. 단일 측정치라
  재조정 여지 있음
- **시도마다 `getUserMedia` + `AudioContext`를 새로 만든다.** 캐시 재사용은 TTS가
  한 번이라도 재생된 뒤 `rms=0.0000` 완전 무음을 만든다(트랙은 `live`, `ended`
  없음, `ctx.state`는 `running` — JS에서 관측 불가). 실기기 로그로 확정
- 게임 자체 스피커 출력이 마이크에 잡히지 않게, 큐에 뭐든 들어오는 순간
  (`onAudioActivity`) 듣기 창을 즉시 취소한다

### 챕터 데이터 계약 (`validateChapters()`가 dev 로드 시 강제)
- **표시 / 발화 분리**: 화면엔 글자·단어, 발화엔 소리.
  `{ text: 'S', say: 'sss' }`, `{ label: 'S', say: 'sss' }`. 단일 문자를 그대로
  발화하면 글자 **이름**으로 읽힌다
- 소리 표기는 `SOUND_TABLE`이 단일 진실원. **표를 바꿔라, 챕터를 바꾸지 마라**
- **하이픈형(`t-t-t`) 금지** — TTS가 글자 이름으로 읽는다(측정 확인)
- **공백 연결(`'a a a'`) 금지** — 엔진이 융합해 3토큰이 안 들린다
- **`repeatAudio`에 단어/캐릭터 이름 금지** (보스 블렌드만 예외)
- **음성 충돌쌍**: `buh`/`duh`는 길이가 동일해 귀로 변별 불가 → b/d는 `match-shape`로
  *모양*으로 가르친다. 한 beat 안에 충돌쌍 `letterTile` 보기 2개 이상 금지
- `scored: true`인 `choose/multiselect/drag-build`에 `readAloud` 필수 — 없으면
  데미지가 영원히 안 들어가 체력바가 0에 못 간다(크래시보다 찾기 어렵다)
- `chapterBoss: true`다 (`boss: true` 아님) — 틀리면 합체·등식·잠금이 조용히 망가진다
- 캐릭터는 `hero: { name, art, style }`만. **`art`는 안정 슬러그, `name`은 표시
  문자열** — `art` 없이 이름을 바꾸면 고유색이 전부 날아간다. 색은 `art.js` 소유
- 표시 언어: 문제 설명 문장은 **한글**, 그 외(버튼·이름·제목)는 **영어**
- `recapKo`는 표시 전용, 발화는 `recapAudio: { ko, en }`. 영어를 `speakKO`로 보내지
  말 것, 한글 근사 표기(`'크 소리'`)도 금지 — 한국 학습자 대표 오류를 앱이 심는다
- **콘솔에 `[chapters]`가 보이면 커밋하지 마라**

### 아트 (`art.js` + `art/*.js`)
- 데이터가 아니라 **아트가 캐릭터의 색·외형을 소유**한다
- 계열마다 파일 분리 → 디자이너 병렬 투입 가능(같은 파일이면 서로 덮어쓴다)
- **계열 간 그림체 통일은 요구사항이 아니다** (사용자 확정). 오히려 통일하려던
  것이 캐릭터가 밋밋해진 주원인이었다. 계열별로 디테일·면 겹치기 음영·비율을
  자유롭게. 판정 기준은 하나: *5세 남아가 그 세계관을 알아보고 멋있다고 느끼는가*
- 원작 캐릭터 **특징은 과감하게** 잡되, 그대로 재현(얼굴·로고 복제)이나 사용자
  제공 이미지 크롭은 하지 않는다
- 계열 반복 시 히어로는 구조 재사용 + 이름·엠블럼만, 빌런은 매번 색을 눈에 띄게
  다르게. `HERO_VARIANTS/VILLAIN_VARIANTS`로 실루엣도 변주
- 엠블럼 글자(파닉스 교육 요소)의 가독성, 아트가 알파벳으로 오독되지 않을 것

### UI
- 양방향 스크롤 0. `_probe.html` HUD의 `NOSCROLL/SCROLL gap=` 판정으로 확인(눈으로
  판정하지 말 것)
- 옵션 그리드 탄성화: 보기 5개까지 양방향 스크롤 0, 아이콘 200~261px
- 긴 라벨은 `--label-len`으로 축소. `overflow-wrap: break-word` 금지 —
  `umbrel/la`는 파닉스 앱에서 **거짓 음절 분할**이다
- 단일 글자 `letterTile`은 텍스트 `.sr-only`, 조건은 `length <= 2`(다이그래프 포함)
- 그림 선택지 스펠링은 탭 전까지 숨긴다(글자 읽는 아이의 첫 글자 비교 우회 방지)

---

## 5. 검증 방법

이 맥에는 `rsvg-convert`/`magick`/`inkscape`/`timeout`이 **없다.**

- **앱 화면**: `public/_probe.html` + headless Chrome. `?shot=battle2` 등으로 화면
  지정, TTS no-op, HUD에 스크롤/넘침/클리핑 판정
  ```bash
  CH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
  "$CH" --headless --disable-gpu --window-size=834,1281 --virtual-time-budget=5000 \
    --screenshot=out.png "http://localhost:5173/_probe.html?shot=battle2"
  ```
  **세로는 `834,1281`, 가로는 `1194,921`** — headless 창 크롬이 87px을 먹는다
- **게임 로직/오디오**: `_probe-fs.html?only=allstages`, `--virtual-time-budget=3000000`
  (가상 시간이라 거의 무료)
- **정적 아트 시트**: Node로 HTML 생성 → `qlmanage -t -s 1400 -o <dir> sheet.html`
- **실기기**: `_art.html`/`_audio.html` 갤러리에서 사용자가 OK/NO 판정 →
  `*-verdicts.json`으로 저장소에 들어온다
- **실기기 전용 회귀는 헤드리스만으로 완결됐다고 믿지 마라** — `safe-area-inset`,
  `fill-box`, TDZ(WebKit은 잡고 V8은 봐준다) 등 실제로 헤드리스가 못 잡은 버그가
  여럿이다

---

## 6. 이미 비싸게 배운 함정 (요약 — 전문은 `CLAUDE.md`)

- `window.innerHeight`는 `--window-size`보다 항상 87px 짧다
- 존재하지 않는 `?shot=`은 아무것도 렌더하지 않으면서 `NOSCROLL gap=100%`를 보고한다 →
  HUD의 `on=[…]`를 항상 확인
- 실루엣 판정 1순위는 하드 컷아웃(`filter: brightness(0)`), 클리핑 진실은 패딩
  뷰박스 알파 스캔. `getBBox`+CTM은 회전 부품에서 과대보고
- SVG 데이터 URI 파싱: 주석의 `--`를 벗겨라, `xmlns` 중복이면 조용히 아무것도 안
  그려지고 "클리핑 0"이 **거짓 통과**로 나온다. 렌더 실패 수와 잉크 픽셀 수를 함께 출력
- `timeout`/`gtimeout` 없음 → exit 127로 Chrome이 아예 안 뜨면서 "NO RESULTS"
- `_probe.html` `gap`은 ±1px 흔들린다. 1px을 회귀로 읽지 마라
- Chrome 병렬은 4-wide 이하. `pkill -f "Google Chrome.*headless"` 금지(다른 에이전트 Chrome을 죽인다)
- Vite는 변경 모듈에 `?t=`를 붙인다 — 하네스가 `/src/…js`를 직접 import하면 앱과
  다른 인스턴스를 받아 거짓 PASS가 난다. 앱이 쓰는 specifier를 파싱해 재사용
- `polygon points`는 절대 좌표다. `scale`을 눈대중으로 걸지 마라
- 5173 포트를 다른 프로젝트 vite가 점유하면 TLS 핸드셰이크부터 거부된다 —
  `lsof -i :5173`로 **어느 프로젝트의** 프로세스인지 확인

---

## 7. 팀 운영 (에이전트 역할 분담)

리더는 직접 코딩을 최소화하고 위임·검토·재지시한다. **병렬 처리의 핵심은 파일
소유권을 겹치지 않게 나누는 것** — 같은 파일에 두 에이전트를 넣으면 서로 덮어쓴다.

| 담당 | 소유 파일 |
|---|---|
| 리더 | `art.js` 배선, `CLAUDE.md`, `HANDOFF.md`, 커밋 |
| 파닉스 | `src/data/chapters/**` |
| 풀스택 | `screens.js`, `audio.js`, `state.js`, `_probe-fs.html` |
| 레이아웃 | `style.css`, `_probe.html` |
| 아트(계열별) | `src/art/<family>.js` |
| 아이콘 | `icons.js` |

**에이전트 보고를 그대로 받지 마라.** 양방향으로 직접 재현·재측정한다. 보고서의
숫자는 재현 명령과 함께 요구한다. 실제로 겪은 것: 동시 편집 중인 파일의 낡은
진단("챕터 5 전체 크래시"), 렌더 안 된 shot의 오진("boss6 스크롤 4px"), 리더가 틀린
아이콘 개수, 리더 제안이 측정으로 반박된 사례(콤마 묶음 보편화 → 5초 발화).
**자기 자신의 진단도 실기기 증거 앞에서는 잠정적이다.**

사용자의 실기기 스크린샷/로그가 진단 도구의 "정상"과 충돌하면 **진단 도구를
의심**한다. 합성 재현 테스트는 실제 버그를 못 잡을 수 있으니 **실제 플레이와
나란히 로깅**(`?debugaudio=1`)을 우선한다.

---

## 8. 현재 상태

챕터 33 / 스테이지 165 / 캐릭터 295 / 아이콘 84 / 음소 41 — 전체 커리큘럼 완결,
`validateChapters` 0건, 프로덕션 빌드 통과, `DEV_UNLOCK_ALL=false`로 실기기 순차
테스트 중. 남은 항목과 중단 지점은 [`HANDOFF.md`](HANDOFF.md) §-2 "다음 세션이
먼저 할 일".
