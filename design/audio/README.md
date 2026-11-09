# 안내·단어 음성 제작

## 2026-11-09 — 동작 안내 Nova39개 추가

F는 풍선로 확정했다. SOUND_CUES42개 중 공유 문장을 합친 고유39개를
`--category sound-cue`로 생성했다. teach의 동작 칩을 탭하면 한국어 안내를 읽는다.
기존1,069클립은 파일 해시 그대로 유지하며 현재 총1,108개(한국어96·영어1,012)다.
신규39개는1,257,143바이트, 생성 실패0. 전체 수치는 `validation-summary.json`을 따른다.

```sh
node scripts/export-narration.mjs
node scripts/generate-narration.mjs --model gpt-4o-mini-tts --voice nova --category sound-cue --concurrency 4 --generate
node scripts/publish-narration.mjs --model gpt-4o-mini-tts --voice nova
node scripts/summarize-narration.mjs
node scripts/check-narration-assets.mjs http://localhost:5174
node scripts/check-cue-audio.mjs http://localhost:5174
```

발행기는 요청 해시와 파일 해시가 동일한 기존 클립을 재인코딩하지 않는다. 요약 도구는
현재 전체 라이브러리의 수치와 해시를 검증하며, 과거590개 배치 수치를 전체 수치로
혼용하지 않는다. 기술 검증은 사람의 발음 청취나 iPad 검증을 대신하지 않는다.
아래 날짜별 수치는 해당 과거 배치의 이력이다.

사용자 제공 파닉스 녹음 41종은 그대로 유지한다. 단어·빌런 이름·한국어 해설의
교체 에셋은 `public/narration/`에 둔다. 클리어 안내는
`stage.recapAudio.ko`와 `.en`, 다른 소리 고르기 해설은 `confirmOddOneOut()`의
한국어 문장 → 영어 단어 → 한국어 문장 순서다. 화면에 표시만 하는 오답 안내를
이미 음성이 있는 것으로 잘못 포함하지 않았다.

2026-11-06 최종 제작 목소리는 사용자가 선택한 `gpt-4o-mini-tts`/`nova`다. 한국어57개,
영어533개이며 후자에는 현재 탭해서 듣는 빌런 이름도 포함된다. 파일의 신호·길이·
디코딩을 자동 검사했으며 **사람의 청취 승인이나 실제 iPad 검증을 뜻하지 않는다**.
게임 연결 상태와 브라우저 검증 결과는 루트 `HANDOFF.md`를 따른다. 사용자는
shimmer/nova의 동일 문장 샘플을 듣고 **2번 Nova**를 선택했다. 한국어 지시문은
그 샘플의 성인 여성 보육교사 톤을 그대로 사용한다. 따뜻한 미소·친근하고 자연스러운
대화·또렷한 발음·충분한 음량을 유지하며 과한 진행자 말투나 속삭임은 피한다.
영어533개도 같은 여성 교사 톤으로, 단어를 노래처럼 늘리지 않고 정확한 발음을
우선한다. 목소리 샘플 선택은 전체590개 발음의 청취 승인을 뜻하지 않는다.

## 2026-11-07 — 한글→영어 전환용 영어 안내 음성 479개 (phrase 배치)

챕터 6부터 안내 음성이 영어로 바뀐다(`src/data/language-policy.js`). 그 영어 문장은
`src/data/phrasebook.js`의 `englishFor(ko)`가 돌려주는 **정확한 문자열**이고, 런타임
조회 키도 그 문자열이다(`narrationFor(text, 'en-US')`). 이번 배치: 고유 **479**개 =
지문 447(`phrase-instruction`, 자동 복습 문구 포함) + 클리어 안내 30(`phrase-stage-clear`,
챕터 ≥6의 `recapAudio.ko` 영어판) + 음성 UI 2(`phrase-ui`: "Correct!" / "Only this word
has a different sound."). 생성 479/실패 0/신호 재시도 0, AAC 64kbps 16,691,044바이트·
1,726.6초, RMS 0.085–0.120, 피크 ≤0.964, 클리핑 0. **공개 manifest는 1,069개**
(기존 590 유지 + 479). `check-narration-assets.mjs` 1069/1069 디코딩, 1070/1070 통과
(데스크톱 Chrome 기준 — 청취·iPad 검증 아님). 용량 16.7MB 추가는 사용자가 수락했다.

- 인벤토리 항목에 `sentence: true`가 붙은 것이 phrase 배치다(카테고리 `phrase` +
  세부). 문장은 **대소문자를 유지**해 합성한다("S makes this sound"의 S는 글자 이름).
  화면 표기용 기호는 합성 입력에서만 바꾼다: `✓`→"the check mark", `/s/`→"S"
  (조회 키는 화면 문자열 그대로). 단어 목록용 "음소 키 토큰 포함 거부"(`a`, `or`, `ee`)는
  문장에는 적용하지 않는다 — 문장 안의 `a`/`or`는 보통 영어 단어다.
- 문장용 지시문(`instructions`): 성인 여성 보육교사 톤, 또렷하고 약간 느리게, 문장 사이
  짧은 자연스러운 쉼, 글자 이름은 글자 이름으로, 따옴표 단어는 통째로, 노래조·진행자
  말투·속삭임·추가 단어 금지(전문은 `narration-inventory.json`의 각 항목).
- 한국어 odd-one-out 문구 2개는 이제 `screens.js`에서 `speakLocalized(runtime, '…')`로
  불리므로 export 스캔이 그 호출도 잡고, 누락되면 assert로 중단한다(한국어 클립이
  manifest에서 빠지면 공개 시 파일이 삭제되기 때문).
- **공개 규칙 추가**: `design/audio/generated/` WAV 캐시는 gitignore라 다른 체크아웃에는
  없다. `publish-narration.mjs`는 캐시가 없는 항목이라도 같은 언어+원문+모델+목소리의
  공개 m4a가 있고 SHA256이 manifest와 일치하면 **그대로 유지**(`keptFromPreviousPublish`)
  한다. 그래서 클립 하나를 추가할 때 590개를 다시 사지 않는다. 캐시도 공개 파일도 없는
  항목만 pending이다.

```sh
node scripts/export-narration.mjs
node scripts/generate-narration.mjs --model gpt-4o-mini-tts --voice nova --category phrase --concurrency 4 --generate
node scripts/publish-narration.mjs --model gpt-4o-mini-tts --voice nova
NODE_TLS_REJECT_UNAUTHORIZED=0 node scripts/check-narration-assets.mjs https://localhost:5174
```

## 목록 재생성

```sh
node scripts/export-narration.mjs
node scripts/generate-narration.mjs --lang ko-KR --limit 6
```

`narration-inventory.json`에는 실제 발화 필드의 원문·용도·출처 경로, 41개 원본 WAV의
SHA256이 있다. 1,069개 고유 발화(한국어57, 영어1,012 = 단어·이름 533 + phrase 문장 479)이며 영어에는 탭해서 듣는 빌런
이름도 포함된다. 글자 이름의 대문자를 유지한다. `A`와 음소 키 `a`는 다르다.
목록은 정적 호출 경로 분석이며 전체165스테이지 실행을 녹음한 결과는 아니다.
실제 생성 입력은 기존 `speakNow`처럼 영어 다글자를 소문자로 만든다(`SAT`→`sat`).
한 글자는 대소문자와 무관하게 글자 이름을 명시한다. 조회 키의 원문은 바꾸지 않는다.
공통 `narration-request.mjs`가 생성기와 공개 도구의 요청·해시를 일치시킨다.
자동 복습은 SOUND_TABLE의 녹음 음소만 사용하므로 새 TTS 목록에 넣지 않았다.

## 로컬 생성

`OPENAI_API_KEY`를 로컬 환경 또는 gitignore된 `.env.local`에 설정한다.
Node24 `process.loadEnvFile()`로 로컬 파일을 읽고 기존 환경변수를 우선한다.
키는 채팅·저장소·브라우저에 넣지 않는다.
기본 실행은 네트워크 요청 없는 dry-run이다. 실제 요청은 `--generate`가 필요하다.
모델은 `--model` 또는 `OPENAI_TTS_MODEL`로 명시하며 숨겨진 기본값이 없다.

```sh
# 현재 계정에서 사용 가능한 Speech API 모델을 확인하고 지정한다.
node scripts/generate-narration.mjs --model MODEL_ID --voice nova --lang ko-KR --limit 6 --generate
# 전체 생성은 최대 동시 요청 4개. 같은 요청의 검증된 캐시는 재사용한다.
node scripts/generate-narration.mjs --model MODEL_ID --voice nova --concurrency 4 --generate
node scripts/publish-narration.mjs --model MODEL_ID --voice nova
```

`--category stage-clear`, `--category odd-one-out-explanation`, `--lang en-US`, `--id ID`로
범위를 좁힐 수 있다. 생성 파일은 gitignore된 `design/audio/generated/`에만 쓴다.
원문·모델·목소리·지시문 해시가 같은 검증된 결과는 재사용한다. 네트워크 실패 시
중복 과금을 피하려고 네트워크 오류를 자동 재시도하지 않는다. 성공 응답이 근무음,
비정상 길이 또는 과도한 클리핑이면 해당 항목만 최대2회 추가 생성하고, 그래도
실패하면 중단한다.
무음 파일이 캐시에 있으면 거부하며
검토 후 `--retry-invalid`로 그 파일만 재생성할 수 있다. 이전 후보 제작에서도 근무음을
실제로 검출했으므로 최종 목소리 역시 같은 검사를 통과한 파일만 공개한다.
생성 모델이 정확한 단어를 발음했는지는 파형 검사로
알 수 없으므로 최종 청취 검수는 별도다.

최종 Nova 제작에서 비정상 후보9건을 거부하고 재생성했다. 공개590개는 총
9,757,315바이트·858.606초이며 AAC 디코딩 후 RMS0.07365–0.12049,
최대 피크0.99094·클리핑 파일0개다. 413개 파일의 앞뒤 무음을 정리했다.
원본41개 SHA256 불변과 공개 파일590개 해시/요청 지시문 일치를 확인했다.
자세한 결과는 `validation-summary.json`, 브라우저 검증은 루트 `HANDOFF.md` 참고.

## 새 음성 후처리와 공개 목록

`publish-narration.mjs`는 macOS `/usr/bin/afconvert`를 사용한다. 원본 API WAV는
로컬에 보존하고, 새 합성 음성만 아래처럼 후처리하여 AAC/M4A 64kbps로 만든다.

- 상대 피크 -50dB보다 낮은 **연속된 앞뒤 무음만** 정리하며 시작80ms/끝180ms를
  남긴다. 중간 쉼·말속도·피치는 바꾸지 않는다.
- 전체 RMS 목표0.12, 게인0.5–4배, PCM 피크0.95 상한으로 음량 차이를 줄인다.
- AAC를 다시 PCM으로 디코딩해 길이 차이150ms 이내·비무음·클리핑을 확인한다.
  `manifest.json`의 길이·RMS·피크·여백은 디코딩한 AAC 기준이다.
- 전체590개가 준비돼야 최종 manifest를 원자적으로 교체한다. `--available`은
  개발 중 부분 목록만 내보내는 옵션이며 `complete:false`와 누락 ID를 기록한다.
- manifest는 원문/언어/파일명/파일 해시/원본 해시/후처리 내역을 포함한다.
  `listeningVerified:false`, `iPadVerified:false`는 기술 검증과 청취 검증을 구분한다.
- 기존 파닉스41개 파일은 SHA256이 달라지면 도구가 중단한다. 이 파일들에는
  위의 무음 정리·음량 조정·AAC 변환을 적용하지 않는다.

2026-11-06 확인한 [OpenAI 공식 문서](https://developers.openai.com/api/docs/guides/text-to-speech)는
기존 `gpt-4o-mini-tts` 등 Speech API 모델의 2027-01-06 종료를 안내한다.
후속 `gpt-realtime-2.1-mini`는 `/v1/audio/speech`에 넣는 단순 모델 교체가 아니다.
이 도구는 현재 Speech API용 제작 준비이며 장기 사용 전 생성 전송부를 별도로
전환해야 한다. 이미 생성해 보관한 WAV의 앱 재생은 생성 API와 분리된다.

## 게임 연결 원칙과 남은 검수

- 한국어 해설과 영어 단어를 실제로 듣고 목소리·발음·속도를 검수한다.
  조각 문장 “만 다른 소리를 내요.”는 “이 단어만 다른 소리를 내요.”로 교체했다.
- 음소 판정을 우선 유지한 채 `audio.js`의 큐 내부에서 생성된 문장 파일을
  조회한다. `speakEN`/`speakKO`/`speakTap`을 우회하는 별도 Audio 재생 금지.
  언어와 원문(대소문자 포함)이 조회 키가 되어야 한다.
- 실제 파일 재생 완료를 기준으로 큐를 진행하고 기존 파일 로딩 시간 제한,
  탭 합치기, `whenAudioIdle`, `onAudioActivity`의 마이크 중단을 보존한다.
  새 안내 파일에 기존 음소별 `SOUND_GAIN`을 적용하지 않는다.
- `speechSynthesis.cancel()` 또는 `await ctx.resume()` 예외를 만들지 않는다.
  새 파일의 실패 폴백과 음소 무음 처리 계약은 혼동하지 않는다.
- AI 생성 음성임을 안내하고, 실기기에서 음소→단어→마이크→클리어 순서를
  청취한다. 기술적으로 검증돼 배포된 파일과 사람이 청취 승인한 파일을 구분한다.


## 2026-11-07 추가 — 영어 안내 문장 479개 (phrase 카테고리)

- 한글→영어 전환용. `export-narration.mjs`가 `src/data/phrasebook.js`의 `englishFor()`로
  챕터 6+ 지문(447)·클리어 음성(30)·UI(2, "Correct!" / "Only this word has a different sound.")를
  `phrase-*` 카테고리(`sentence: true`)로 내보낸다. 생성: `--category phrase --voice nova`.
- 음성용 텍스트만 `✓`→"the check mark", `/s/`→"S"로 바꾸고 조회 키(원문)는 그대로다.
- 발행 결과: 1,069 엔트리(기존 590 유지 + 479 신규), 신규 16.7 MB(64 kbps), 실패 0,
  `check-narration-assets` 1,069/1,069 디코딩. `validation-summary.json`의 수치는 이 라운드
  기준으로 재생성이 필요할 수 있다(인벤토리 JSON은 갱신됨).
- 발행 규칙 변경: WAV 캐시가 없어도 lang+text+model+voice가 같고 sha256이 맞는 기존 m4a는
  유지한다 — 다른 기기에서 돌려도 590개를 다시 생성하지 않는다.
