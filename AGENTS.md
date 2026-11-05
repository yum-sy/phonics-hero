# AGENTS.md — 이 레포에서 작업하는 모든 에이전트(Codex, Claude, 기타)의 진입점

**먼저 읽을 순서**: `HANDOFF.md`(지금 중단된 지점 + 다음 할 일) →
`CLAUDE.md`(항구적 규칙·데이터 계약·비싸게 배운 함정) → `README.md`(요약).
`CLAUDE.md`는 이름만 Claude일 뿐 **이 프로젝트의 규칙 문서**다. 어느 도구를
쓰든 그대로 적용된다.

## 반드시 지킬 것 (전문은 CLAUDE.md)
- `speechSynthesis.cancel()` 호출 금지, `await ctx.resume()` 금지 — iOS에서 영구 무음/교착
- 소리 표기는 `src/data/chapters/index.js`의 `SOUND_TABLE`만 바꾼다. 챕터 데이터에 직접 쓰지 않는다
- 하이픈형(`t-t-t`)·공백 연결(`a a a`) 금지, `repeatAudio`에 단어/이름 금지
- 캐릭터 색·외형은 `art.js`/`art/*.js` 소유. 데이터는 `{ name, art, style }`만
- 캐릭터 V2는 `CLAUDE.md` 맨 위 새 규칙 우선: 투명 PNG 아틀라스 + 별도 학습 배지.
  픽셀 몬스터는 공룡과 구분, 직업군 합체는 우주비행사, 마지막 빌런은 별도 보스 디자인.
- 콘솔에 `[chapters]`(validateChapters) 에러가 있으면 커밋하지 않는다
- iPad 세로/가로 스크롤 0 — 눈이 아니라 `public/_probe.html` HUD로 판정
- 실기기(WebKit) 증거 없이 "안전해 보이는" 오디오 예외를 만들지 않는다

## 개발
- `npm install && npm run dev -- --host` (포트는 `.claude/launch.json` 기준 5174; 5173은 다른 프로젝트가 점유할 수 있다)
- 검증 하네스: `public/_probe.html`(화면), `public/_probe-fs.html`(로직·오디오), `_art.html`/`_audio.html`(갤러리)
- 배포: `main` 푸시 → GitHub Actions → https://yum-sy.github.io/phonics-hero/

## 작업을 마칠 때
1. `HANDOFF.md` 맨 위 섹션에 **무엇을 왜 바꿨고, 실기기에서 확인됐는지**를 추가한다
2. 작은 단위로 커밋하고 `main`에 푸시한다 (다른 에이전트가 이어받는다)
3. 추측으로 고친 것과 실기기로 확인한 것을 구분해서 적는다
