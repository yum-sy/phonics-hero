// Chapter 7 (DC hero theme): AI, J, OA -> boss blends "RAIN" + "BOAT".
// Starts Jolly Phonics Group 4. This completes world 1 (chapters 1-7).
// Beat vocabulary is identical to chapter-01.js -- see that file's header.
//
// Ids are prefixed 'c7' because getStageById() searches every chapter flat.
// 캐릭터 색·외형은 art.js 소유 -- 데이터는 { name, art, style } 만 준다.
//
// --- 이 챕터는 프로젝트 최초의 다이그래프(digraph) 도입이다 ---
// AI 와 OA 는 두 글자가 합쳐진 한 소리(장모음)다. J 는 단일 글자지만
// 소리 표기 검증 방식이 새로 필요했다(아래 참조). 표시는 항상 실제
// 두 글자('AI'/'OA')로, 발화는 항상 소리(`say`)로 분리하는 원칙은
// 그대로다 -- 다이그래프도 예외가 아니다.
//
// 렌더링 검증(실제 스크린샷): letterTile 아이콘의 SVG 내부 텍스트와
// .big-letter 둘 다 2글자 라벨을 66/96/110px 및 실제 iPad 뷰포트
// (834x1194) 폭에서 잘림 없이 렌더한다 -- 코드 수정 불필요. 풀스택이
// 별도로 optionLabelHtml() 의 sr-only 판정을 `length === 1` 에서
// `length <= 2` 로 넓혀 다이그래프 옵션의 캡션 중복 표시 버그를 고쳤다.
//
// --- drag-build 계약 확장 (풀스택 라우팅, 이 세션에서 합의) ---
// `target` 이 문자열(챕터1-6, 한 슬롯=한 글자)이거나 **슬롯 배열**
// (`['r','ai','n']`, 한 슬롯이 다이그래프 두 글자를 담을 수 있음)일 수
// 있다. 문자열 우회안(다이그래프를 drag-build 에 안 씀)을 거부한 이유:
// "두 글자가 한 소리"를 한 슬롯으로 조립하는 게 다이그래프 교육의
// 핵심이라, r-a-i-n(4슬롯)으로 조립시키면 A 와 I 를 별개 소리로
// 가르치는 셈이 되어 이 챕터의 목적과 정반대가 된다. validateChapters()
// 의 drag-build 검사도 슬롯 배열을 지원하도록 확장했다(멀티셋 비교로
// 타일 4개 vs 슬롯 3개 같은 구조 불일치까지 잡는다).
//
// --- 소리 표기: AI `a` (단일 알파벳 A, 글자 이름 그대로) ---
// 이례적인 선택이라 근거를 자세히 남긴다. 원문 'ai'/'ay'/'eye'/'eigh'/
// 'ei'/'ey' 를 전부 큰 배수(15/20/30x)로 측정했다:
//   - 'ai'(원문) 는 두 음성 모두 안전하지 않다. Samantha 에서는 'eye'·
//     'ay' 와 완전히 동일(diff 0.0ms, 모든 배수) -- 즉 세 단어가 전부
//     장모음 I(/ai/, eye) 로 렌더된다. Alex 에서는 'ai' 가 'eye'/'ay'
//     보다 훨씬 길게(15x 기준 4~8초 차이) 렌더돼 무언가 다른(아마
//     "에이-아이" 식으로 풀어읽는) 처리를 한다 -- 어느 쪽이든 목표음
//     (장모음 A, /ei/)이 아니다.
//   - 'ay'/'eigh'/'ei' 도 전부 실패: Samantha 에서 글자이름 A 와
//     비교하면 배수에 비례해 격차가 벌어진다(진짜 다른 음소).
//     Alex 에서 'ey' 만 글자이름 A 와 근접했으나(15x~50x diff 151~163ms,
//     diff/N 이 10.1->8.15->5.05->4.07->3.26 로 꾸준히 감소 -- guh/duh
//     패턴과 유사한 "고정 오프셋" 신호) Samantha 에서는 'ey' 가 글자이름
//     A 와 배수에 비례해 벌어져(15x~30x diff 755~1649ms) 실패한다.
//     즉 두 음성 모두를 만족하는 대안 철자가 없었다.
//   - 반면 **글자 이름 A 자체(대소문자 무관, 'a'='A' 완전히 동일 확인)
//     는 정의상 두 음성 모두에서 정확히 /ei/(장모음 A) 다.** Jolly 가
//     AI 를 가르치는 방식 자체가 "A 가 자기 이름을 말한다" 이므로
//     이건 우회가 아니라 정확히 그 교육 장치와 일치한다. 단모음
//     글자 레슨에서 글자 이름을 피해야 했던 것(챕터 1-6 내내)과
//     충돌하지 않는다 -- 거기서는 글자 이름이 **틀린** 소리였고,
//     여기서는 글자 이름이 **정확한** 목표음이다.
//
// --- 소리 표기: J `juh` ---
// 글자 이름(`jay`)과 큰 배수로 재확인 -- 두 음성 모두 격차가 수백~수천
// ms 로 벌어지며 N 에 비례해 커진다(Samantha 627->1300ms, Alex
// 2261->4583ms, 15x->30x). G(`guh`)·D(`duh`) 와도 각각 대조해
// 챕터 내 공존 안전 확인(수백ms, N 에 비례해 커짐 -- 충돌 아님).
//
// --- 소리 표기: OA `oh` ---
// AI 와 같은 논리, 그리고 이번엔 딱 맞는 철자가 있었다. 'oh'/'ow'/'owe'
// 를 글자이름 O 와 50x 까지 대조: Samantha 는 셋 다 O 와 **완전히 동일**
// (diff 0.0ms, 15x~50x 전부) -- 어느 걸 써도 안전. Alex 는 'oh' 만 O 와
// 완전히 동일(0.0ms, 15x~50x 전부)하고, 'ow'/'owe' 는 배수에 비례해
// 벌어진다(diff/N 이 각각 -41~-43, -56~-57 로 안정적 -- 'ow' 를 /au/
// (cow 의 아우)로 잘못 읽는 것으로 보인다). **'oh' 만 두 음성 모두
// 안전**해서 확정했다. AI 와 마찬가지로 OA 의 목표음이 정확히 글자
// O 의 이름이므로 챕터 3 에서 O 자체를 가르칠 때 글자 이름(`oh`)을
// 피해야 했던 것과 반대 상황이다.
//
// 새 소리들이 기존 단모음과 안전하게 공존하는지도 확인했다: 'a'(AI) vs
// 'aaa'(단모음 A) 는 두 음성 모두 5~18초 차이(30x 기준, N 에 비례),
// 'oh'(OA) vs 'awh'(단모음 O) 는 1.3~2.7초 차이 -- 확인된 대비쌍
// 문항에서 안전하게 공존한다.
//
// ============================================================================
// 난이도 곡선 파일럿 (이 라운드) -- chapter-06.js 헤더와 같은 라운드,
// 전체 분석·계획은 CLAUDE.md 를 보라. 챕터 6 에서 세운 표(표준 4 / hard 5,
// warmup·wordspot·multiselect 는 그대로)를 그대로 이어서 챕터 8 진입 시
// 단절이 없게 한다.
//
// 늘리지 않은 것: **oddoneout(과반 일치) 형식**은 이 챕터의 세 소리(AI/J/OA)
// 전부 그림이 2개뿐이라(rain·train·aim 은 있지만 odd-one-out 에는 그 중
// 둘만 쓴다, jam·jug, boat·coat) 과반을 3개로 못 채운다 -- c7s3-r2-oddoneout,
// c7s4-r2-oddoneout 은 아이콘 담당의 신규 그림 없이는 그대로 둔다.
// promptAudio 직접 지목 형식과 reversed, letterTile 기반(hard,
// choose-sequence)은 이 제약이 없어서 전부 늘렸다.
// ============================================================================
//
// --- 보스 단어: RAIN(R+AI+N) · BOAT(B+OA+T) ---
// 챕터 3-6 구조 그대로: 각 소리를 자기 스테이지 finale 에서 미리 노출
// -> 보스는 조립 시험. J 는 stage-3 finale 에 보너스 단어 'jam'
// (J+A+M, 전부 기지 글자)만 노출하고 보스에서 다시 조립하지 않는다 --
// 이 챕터의 핵심 신개념은 AI/OA 지 J 가 아니므로, 두 다이그래프 단어를
// 보스에서 조립시켜 새 슬롯 계약을 실제로 써먹는다.
//
// --- 아이콘: 이제 이 챕터가 자기 소리를 그림으로 연습한다 ---
// rain/train/aim(AI) · jam/jug(J) · boat/coat(OA) 가 생겼다. 그 전에는 그림
// 문항 12개 중 **0개**가 AI/J/OA 를 다뤘다(전부 챕터 1-6 누적 복습이었다).
//
// 문항 형식을 결정하는 것은 **다이그래프가 어중에 온다**는 사실이다 --
// rain 의 ai, boat 의 oa. 초성 매칭으로는 물어볼 수 없으므로 AI/OA 문항은
// '들어있는' 형(포함)이고, J 문항만 '시작하는' 형(초성)이다. aim 은 AI 가
// 어두에 오는 예외라 '포함' 형에 그대로 들어간다.
// 쉬운 형에서 어려운 형으로 배치했다:
//   s1-r2  포함 + promptAudio     소리를 듣고 하나 찾기 (가장 쉽다)
//   s2-r2  포함 + 모두 찾기       rain/train/aim 셋 다 정답
//   s2-r6  역방향 promptLetter AI -> 그림
//   s3-r2  J 초성 odd-one-out     s3-r6  역방향 promptLetter J
//   s4-r2  OA 포함 odd-one-out    s4-r6  역방향 promptLetter OA
// 역방향 문항은 보기가 그림이므로 발화되는 건 그림 단어다 -- letterTile 음성
// 충돌쌍 규칙과 무관하다(그래서 다이그래프를 promptLetter 로 띄울 수 있다).
//
// s3-r4 · s4-r4 의 '모두 찾기' 슬롯은 누적 복습으로 남겼다: multiselect 는
// 정답이 2개 이상 필요한데 /j/ 는 jam·jug 둘, OA 는 boat·coat 둘뿐이라
// odd-one-out 의 정답 쌍과 완전히 같아진다(챕터 4·5 에서 세운 규칙 -- 같은
// 쌍이 두 문항에 반복되면 그 슬롯은 복습으로 돌린다). AI 만 그림이 3개라
// 이 규칙에 걸리지 않아서 '모두 찾기' 를 만들 수 있었다.
// TODO(icon): 세 번째 /j/ 그림(jet 등) 또는 세 번째 OA 그림(goat/road 등)이
// 생기면 s3-r4 / s4-r4 를 각각 /j/ · OA '모두 찾기' 로 교체할 수 있다.

export const chapter7 = {
  id: 'chapter-7',
  order: 7,
  title: 'Shadow City Skyline',
  stages: [
    {
      id: 'c7-stage-1',
      order: 1,
      title: 'A Gleaming Sound',
      villain: { name: 'Blackout', art: 'blackout', style: 'dc-hero' },
      hero: { name: 'Ray', art: 'ray', style: 'dc-hero' },
      chapterBoss: false,
      beats: [
        {
          id: 'c7s1-teach',
          kind: 'teach',
          instructionKo: 'Ray가 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['a'],
        },
        {
          id: 'c7s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          // AI 그림이 0개라 아이콘이 필요 없는 beat 로 AI 소리를 나른다.
          instructionKo: '이 소리로 시작하는 단어예요! 따라 말해보세요.',
          words: ['rain', 'aim'],
        },
        {
          id: 'c7s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['a'],
        },
        {
          id: 'c7s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 첫 그림 문항이라 가장 쉬운 형으로 둔다: 소리를 먼저 들려주고
          // (promptAudio, choose 렌더러는 다시 듣기 버튼까지 붙여준다) 그
          // 소리가 들어있는 그림 하나만 고르게 한다. 오답 둘은 어중 모음이
          // 서로도 다르고 AI 와도 다르다(bed /e/, box /o/).
          // 보기 3 -> 4 (난이도 곡선, CLAUDE.md 참조). promptAudio 로 목표
          // 소리를 직접 지목하는 형식이라 오답이 서로 같은 소리일 필요가
          // 없다 -- 아이콘 재고 제약이 없다.
          instructionKo: '이 소리가 들어있는 그림을 찾아보세요!',
          promptAudio: 'a',
          options: [
            { id: 'c7s1-bed', icon: 'bed', label: 'bed', correct: false },
            { id: 'c7s1-box', icon: 'box', label: 'box', correct: false },
            { id: 'c7s1-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c7s1-rain', icon: 'rain', label: 'rain', correct: true },
          ],
          readAloud: { targetText: 'rain' },
        },
        {
          id: 'c7s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 보기 3 -> 4 (난이도 곡선).
          instructionKo: '"gift"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'gift',
          options: [
            { id: 'c7s1-octopus', icon: 'octopus', label: 'octopus', correct: false },
            { id: 'c7s1-gum', icon: 'gum', label: 'gum', correct: true },
            { id: 'c7s1-leg', icon: 'leg', label: 'leg', correct: false },
            { id: 'c7s1-net', icon: 'net', label: 'net', correct: false },
          ],
          readAloud: { targetText: 'gum' },
        },
        {
          id: 'c7s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/h/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c7s1-hat', icon: 'hat', label: 'hat', correct: true },
            { id: 'c7s1-fan', icon: 'fan', label: 'fan', correct: false },
            { id: 'c7s1-hen', icon: 'hen', label: 'hen', correct: true },
            { id: 'c7s1-horse', icon: 'horse', label: 'horse', correct: true },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c7s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['aim', 'rain'],
        },
        {
          id: 'c7s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['rain'],
        },
      ],
      recapKo: '새로운 소리를 찾았어요! Rain, aim<br>— 모두 이 소리로 시작해요!',
      recapAudio: {
        ko: '에이아이는 이런 소리를 내요. 잘 들어보세요.',
        en: ['rain', 'aim'],
      },
    },

    {
      id: 'c7-stage-2',
      order: 2,
      title: 'Power of AI',
      villain: { name: 'Mirage', art: 'mirage', style: 'dc-hero' },
      hero: { name: 'Ray', art: 'ray', style: 'dc-hero' },
      chapterBoss: false,
      beats: [
        {
          id: 'c7s2-teach',
          kind: 'teach',
          // AI 는 A 가 자기 이름을 말할 때 소리와 똑같다 -- Jolly 의
          // 교육 장치 그대로. repeatAudio 에 'AI' 원문을 넣지 않는다
          // (측정 결과 두 음성 모두 신뢰할 수 없다, 헤더 참조).
          instructionKo: 'AI는 A가 자기 이름을 말할 때처럼 소리를 내요!',
          art: 'hero',
          letter: 'AI',
          repeatAudio: ['a'],
        },
        {
          id: 'c7s2-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'a',
          // 혼동 보기는 단모음 A 하나 -- 이미 배운 단모음과의 의도된 대비쌍.
          options: [
            { id: 'c7s2-AI1', icon: 'letterTile', label: 'AI', say: 'a', correct: true },
            { id: 'c7s2-A1', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c7s2-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
          ],
        },
        {
          id: 'c7s2-r2-findall',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // AI 는 그림이 3개라 이 챕터에서 유일하게 '모두 찾기' 가 성립한다
          // (다른 두 소리는 그림이 2개뿐 -- 파일 헤더 참조). multiselect
          // 렌더러는 promptAudio 를 읽지 않으므로 소리는 문장으로 지목한다.
          // 어중(rain/train)과 어두(aim)를 한 문항에 섞어 위치가 아니라
          // 소리로 판단하게 만든다.
          instructionKo: 'AI 소리가 들어있는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c7s2-rain', icon: 'rain', label: 'rain', correct: true },
            { id: 'c7s2-bed2', icon: 'bed', label: 'bed', correct: false },
            { id: 'c7s2-train', icon: 'train', label: 'train', correct: true },
            { id: 'c7s2-aim', icon: 'aim', label: 'aim', correct: true },
          ],
          readAloud: { targetText: 'rain' },
        },
        {
          id: 'c7s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 AI를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'AI', say: 'a' }],
        },
        {
          id: 'c7s2-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 ai를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'ai',
          repeatAudio: ['a'],
        },
        {
          id: 'c7s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/f/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c7s2-fish', icon: 'fish', label: 'fish', correct: true },
            { id: 'c7s2-bed', icon: 'bed', label: 'bed', correct: false },
            { id: 'c7s2-fan', icon: 'fan', label: 'fan', correct: true },
            { id: 'c7s2-box', icon: 'box', label: 'box', correct: false },
          ],
          readAloud: { targetText: 'fish' },
        },
        {
          id: 'c7s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'a',
          // 여기 세 번째 보기는 E(`eh`)였다. **`eh` 는 두 음성 모두에서 `a` 와
          // 바이트 단위로 동일하게 렌더된다** -- 즉 프롬프트 소리와 오답 타일이
          // 완전히 같은 소리였고, 아이가 E 를 탭하면 방금 들은 소리를 그대로
          // 다시 듣고 오답 처리됐다. 이 챕터 헤더는 `a` 를 `aaa`(단모음 A)·
          // 글자이름·`ey` 와 대조 측정했지만 `eh` 와는 대조하지 않았다.
          // SPEECH_COLLISION_PAIRS 에 ['a','eh'] 를 추가해 재발을 막았다.
          //
          // 대체는 I(`ihh`) -- 한국어 화자에게 /ei/↔/i/ 는 실제 근접쌍(ㅔ이/ㅣ)
          // 이면서 측정상 두 음성 모두 배수에 비례해 벌어진다(30x 기준 Alex
          // 15.5초, Samantha 5.5초 차이, 파형 차이 140~142%).
          //
          // 보기 3 -> 5 (난이도 곡선, CLAUDE.md 참조). 추가 오답은 챕터8의
          // IE 항목과 같은 논리로 **경쟁하는 다른 모음**(O·U)이다. E(`eh`)는
          // 절대 넣지 않는다 -- AI 의 `a` 와 확정 충돌쌍이고, 정확히 이 문항의
          // 실제 사고(위 주석)가 그 이유다.
          options: [
            { id: 'c7s2-A3', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c7s2-AI3', icon: 'letterTile', label: 'AI', say: 'a', correct: true },
            { id: 'c7s2-I3', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
            { id: 'c7s2-O3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c7s2-U3', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
          ],
          readAloud: { targetText: 'AI', say: 'a' },
        },
        {
          id: 'c7s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 역방향: 글자 -> 그림. 보기가 그림이라 발화되는 건 그림 단어이므로
          // 두 글자 promptLetter 도 안전하다(발화 경로 없음, 표시만 된다).
          // '시작하는' 이 아니라 '들어있는' 이다 -- train 의 ai 는 어중이다.
          // 보기 3 -> 4 (난이도 곡선).
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'AI',
          options: [
            { id: 'c7s2-gum', icon: 'gum', label: 'gum', correct: false },
            { id: 'c7s2-fish2', icon: 'fish', label: 'fish', correct: false },
            { id: 'c7s2-net2', icon: 'net', label: 'net', correct: false },
            { id: 'c7s2-train2', icon: 'train', label: 'train', correct: true },
          ],
          readAloud: { targetText: 'train' },
        },
        {
          id: 'c7s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['rain', 'aim'],
        },
        {
          id: 'c7s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'rain' 사전 노출 (AI 로 완성, R·N 은 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'AI', say: 'a' }, 'rain'],
        },
      ],
      recapKo: 'AI는 A가 이름을 말할 때 소리를 내요 — rain, aim!',
      recapAudio: {
        ko: '에이아이는 이런 소리를 내요. 레인, 에임!',
        en: ['rain', 'aim'],
      },
    },

    {
      id: 'c7-stage-3',
      order: 3,
      title: 'Power of J',
      villain: { name: 'Gridlock', art: 'gridlock', style: 'dc-hero' },
      hero: { name: 'Jett', art: 'jett', style: 'dc-hero' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J',
      ],
      beats: [
        {
          id: 'c7s3-teach',
          kind: 'teach',
          instructionKo: 'J는 Jett가 하늘을 가를 때처럼 J 소리를 내요!',
          art: 'hero',
          letter: 'J',
          repeatAudio: ['J', 'juh'],
        },
        {
          id: 'c7s3-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'J 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'juh',
          // 혼동 보기는 G 하나 -- /d3/ 와 /g/ 는 둘 다 연구개 근처 파열/
          // 파찰음이라 살짝 대비된다(측정으로 안전 확인).
          options: [
            { id: 'c7s3-G1', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
            { id: 'c7s3-J1', icon: 'letterTile', label: 'J', say: 'juh', correct: true },
            { id: 'c7s3-D1', icon: 'letterTile', label: 'D', say: 'duh', correct: false },
          ],
        },
        {
          id: 'c7s3-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // J 는 다이그래프가 아니라 홑글자 초성이므로 이 챕터에서 유일하게
          // '시작하는' 형이 그대로 성립한다.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c7s3-ball', icon: 'ball', label: 'ball', correct: true },
            { id: 'c7s3-jam', icon: 'jam', label: 'jam', correct: false },
            { id: 'c7s3-jug', icon: 'jug', label: 'jug', correct: false },
          ],
          readAloud: { targetText: 'jam' },
        },
        {
          id: 'c7s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 J를 따라 그리면서 J 소리를 내보세요!',
          words: [{ text: 'J', say: 'juh' }],
        },
        {
          id: 'c7s3-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 j를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'j',
          repeatAudio: ['J', 'juh'],
        },
        {
          id: 'c7s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/o/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c7s3-octopus', icon: 'octopus', label: 'octopus', correct: true },
            { id: 'c7s3-umbrella', icon: 'umbrella', label: 'umbrella', correct: false },
            { id: 'c7s3-orange', icon: 'orange', label: 'orange', correct: true },
            { id: 'c7s3-gift', icon: 'gift', label: 'gift', correct: false },
          ],
          readAloud: { targetText: 'octopus' },
        },
        {
          id: 'c7s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'J 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'juh',
          // 보기 3 -> 5 (난이도 곡선). D(duh)는 넣지 않는다 -- B(buh)가 이미
          // 있어서 확정 충돌쌍이 성립한다.
          options: [
            { id: 'c7s3-G3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
            { id: 'c7s3-B3', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
            { id: 'c7s3-J3', icon: 'letterTile', label: 'J', say: 'juh', correct: true },
            { id: 'c7s3-K3', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
            { id: 'c7s3-P3', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
          ],
          readAloud: { targetText: 'J', say: 'juh' },
        },
        {
          id: 'c7s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 보기 3 -> 4 (난이도 곡선).
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'J',
          options: [
            { id: 'c7s3-jug2', icon: 'jug', label: 'jug', correct: true },
            { id: 'c7s3-bed3', icon: 'bed', label: 'bed', correct: false },
            { id: 'c7s3-octopus2', icon: 'octopus', label: 'octopus', correct: false },
            { id: 'c7s3-pig2', icon: 'pig', label: 'pig', correct: false },
          ],
          readAloud: { targetText: 'jug' },
        },
        {
          id: 'c7s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['jam', 'jog'],
        },
        {
          id: 'c7s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어가 아닌 보너스 단어 'jam' (J+A+M 전부 기지 글자).
          instructionKo: '마지막 공격! J 소리로 크게 외쳐보세요!',
          words: [{ text: 'J', say: 'juh' }, 'jam'],
        },
      ],
      recapKo: 'J는 J 소리를 내요 — jam, jog! AI 소리도 기억하고 있어요!',
      recapAudio: {
        ko: '제이는 이런 소리를 내요. 잼, 조그!',
        en: ['jam', 'jog'],
      },
    },

    {
      id: 'c7-stage-4',
      order: 4,
      title: 'Power of OA',
      villain: { name: 'Floodlight', art: 'floodlight', style: 'dc-hero' },
      hero: { name: 'Cloak', art: 'cloak', style: 'dc-hero' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA',
      ],
      beats: [
        {
          id: 'c7s4-teach',
          kind: 'teach',
          instructionKo: 'OA는 O가 자기 이름을 말할 때처럼 소리를 내요!',
          art: 'hero',
          letter: 'OA',
          repeatAudio: ['oh'],
        },
        {
          id: 'c7s4-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'oh',
          // 혼동 보기는 단모음 O 하나 -- 챕터5 의 단모음 O 와의 대비쌍.
          options: [
            { id: 'c7s4-O1', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c7s4-U1', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
            { id: 'c7s4-OA1', icon: 'letterTile', label: 'OA', say: 'oh', correct: true },
          ],
        },
        {
          id: 'c7s4-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // odd-one-out 을 '포함' 형으로 쓴다 -- boat/coat 의 oa 는 어중이라
          // 초성을 비교하면 둘도 서로 다르다(/b/ 대 /k/). 정답 key 는 어중
          // 모음이 /ee/ 로 갈라진다.
          instructionKo: '다른 소리가 들어있는 걸 찾아보세요!',
          options: [
            { id: 'c7s4-boat', icon: 'boat', label: 'boat', correct: false },
            { id: 'c7s4-key', icon: 'key', label: 'key', correct: true },
            { id: 'c7s4-coat', icon: 'coat', label: 'coat', correct: false },
          ],
          readAloud: { targetText: 'coat' },
        },
        {
          id: 'c7s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 OA를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'OA', say: 'oh' }],
        },
        {
          id: 'c7s4-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 oa를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'oa',
          repeatAudio: ['oh'],
        },
        {
          id: 'c7s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/l/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c7s4-lion', icon: 'lion', label: 'lion', correct: true },
            { id: 'c7s4-bed', icon: 'bed', label: 'bed', correct: false },
            { id: 'c7s4-leg', icon: 'leg', label: 'leg', correct: true },
            { id: 'c7s4-fan', icon: 'fan', label: 'fan', correct: false },
          ],
          readAloud: { targetText: 'lion' },
        },
        {
          id: 'c7s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'oh',
          // 보기 3 -> 5 (난이도 곡선). 추가 오답은 경쟁하는 모음 U·I 다.
          // AI(`a`)는 넣지 않는다 -- E(`eh`)가 이미 있어서 확정 충돌쌍
          // a==eh 가 성립한다(위 promptAudio 'a' 문항의 실제 사고와 같은 축).
          options: [
            { id: 'c7s4-OA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: true },
            { id: 'c7s4-O3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c7s4-E3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
            { id: 'c7s4-U3', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
            { id: 'c7s4-I3', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
          ],
          readAloud: { targetText: 'OA', say: 'oh' },
        },
        {
          id: 'c7s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 보스 단어 'boat' 를 역방향 문항의 정답으로 둔다 -- 다음 스테이지가
          // B+OA+T 를 조립하므로 여기서 글자 OA 와 그림 boat 를 붙여둔다.
          // 보기 3 -> 4 (난이도 곡선).
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'OA',
          options: [
            { id: 'c7s4-gift', icon: 'gift', label: 'gift', correct: false },
            { id: 'c7s4-boat2', icon: 'boat', label: 'boat', correct: true },
            { id: 'c7s4-fish4', icon: 'fish', label: 'fish', correct: false },
            { id: 'c7s4-net4', icon: 'net', label: 'net', correct: false },
          ],
          readAloud: { targetText: 'boat' },
        },
        {
          id: 'c7s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['boat', 'coat'],
        },
        {
          id: 'c7s4-finale-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          // 스텝당 보기 3 -> 4 (난이도 곡선, CLAUDE.md 참조). E(`eh`)는 AI(`a`)가
          // 있는 스텝에 절대 넣지 않는다 -- 확정 충돌쌍이다. 그래서 추가
          // 오답은 전부 O/U 다.
          steps: [
            {
              promptAudio: 'a',
              options: [
                { id: 'c7s4-qJ', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
                { id: 'c7s4-qOA', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c7s4-qAI', icon: 'letterTile', label: 'AI', say: 'a', correct: true },
                { id: 'c7s4-qU', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
              ],
            },
            {
              promptAudio: 'juh',
              options: [
                { id: 'c7s4-qOA2', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c7s4-qJ2', icon: 'letterTile', label: 'J', say: 'juh', correct: true },
                { id: 'c7s4-qAI2', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
                { id: 'c7s4-qG2', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
              ],
            },
            {
              promptAudio: 'oh',
              options: [
                { id: 'c7s4-qOA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: true },
                { id: 'c7s4-qAI3', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
                { id: 'c7s4-qJ3', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
                { id: 'c7s4-qO3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
              ],
            },
            // 누적 복습(챕터 1 의 A). 이 챕터의 AI 는 A 와 글자를 공유하므로
            // 다이그래프를 배우는 순간 짧은 /a/ 가 가장 위험하다 -- 아이가
            // A 를 보고 AI 소리를 내기 시작하는 것이 전형적 붕괴다.
            // 오답 AI 를 나란히 둬서 홑글자와 다이그래프를 갈라야 하게 만든다.
            // aaa 대 a 는 두 음성 20x 에서 7.2~11.2초 벌어진다(별개 음소).
            {
              promptAudio: 'aaa',
              options: [
                { id: 'c7s4-qAI4', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
                { id: 'c7s4-qJ4', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
                { id: 'c7s4-qA', icon: 'letterTile', label: 'A', say: 'aaa', correct: true },
                { id: 'c7s4-qO4', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c7s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'boat' 사전 노출 (OA 로 완성, B·T 는 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'OA', say: 'oh' }, 'boat'],
        },
      ],
      recapKo: '이제 AI, J, OA를 모두 알아요! Ray, Jett, Cloak이 합체할 준비를 해요!',
      recapAudio: {
        ko: '오에이는 이런 소리를 내요. 이제 세 소리를 모두 배웠어요.',
        en: ['boat', 'coat'],
      },
    },

    {
      id: 'c7-stage-5',
      order: 5,
      title: 'Boss: RAIN and BOAT!',
      villain: { name: 'Nightfall', art: 'nightfall', style: 'dc-hero' },
      hero: { name: 'Nightray', art: 'nightray', style: 'dc-hero' },
      chapterBoss: true,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA',
      ],
      beats: [
        {
          id: 'c7s5-teach',
          kind: 'teach',
          instructionKo: 'Ray + Jett + Cloak이 합체해요! 먼저 rain을 만들어요.',
          repeatAudio: ['rrr', 'a', 'nnn', 'rain'],
        },
        {
          id: 'c7s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          // 슬롯 배열 target -- 'AI' 두 글자가 한 슬롯을 차지한다. 4타일
          // (r-a-i-n)로 조립시키면 A 와 I 를 별개 소리로 가르치는 셈이라
          // 이 챕터의 목적과 정반대가 된다(파일 헤더 참조).
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'R', say: 'rrr' },
            { text: 'AI', say: 'a' },
            { text: 'N', say: 'nnn' },
          ],
          target: ['R', 'AI', 'N'],
        },
        {
          id: 'c7s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [
            { text: 'R', say: 'rrr' },
            { text: 'AI', say: 'a' },
            { text: 'N', say: 'nnn' },
            'rain',
          ],
        },
        {
          id: 'c7s5-break',
          kind: 'break',
          instructionKo: '이번엔 boat예요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['buh', 'oh', 'tuh', 'boat'],
        },
        {
          id: 'c7s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          // 스텝당 보기 3 -> 4 (난이도 곡선, CLAUDE.md 참조). E(`eh`)는 AI(`a`)가
          // 있는 스텝에 절대 넣지 않는다 -- 확정 충돌쌍이다.
          steps: [
            {
              promptAudio: 'oh',
              options: [
                { id: 'c7s5-qOA', icon: 'letterTile', label: 'OA', say: 'oh', correct: true },
                { id: 'c7s5-qAI', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
                { id: 'c7s5-qJ', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
                { id: 'c7s5-qO', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
              ],
            },
            {
              promptAudio: 'a',
              options: [
                { id: 'c7s5-qJ2', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
                { id: 'c7s5-qOA2', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c7s5-qAI2', icon: 'letterTile', label: 'AI', say: 'a', correct: true },
                { id: 'c7s5-qU2', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
              ],
            },
            {
              promptAudio: 'juh',
              options: [
                { id: 'c7s5-qOA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c7s5-qJ3', icon: 'letterTile', label: 'J', say: 'juh', correct: true },
                { id: 'c7s5-qAI3', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
                { id: 'c7s5-qG3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
              ],
            },
            // 누적 복습(챕터 5 의 O). AI/A 와 같은 구조로 OA 가 홑글자 O 를
            // 덮어쓴다. 오답 OA 를 나란히 둔다 -- awh 대 oh 는 배수를 올릴 때
            // 차이가 토큰당 ~50ms(Samantha)/~70ms(Alex)로 비례 증가하므로
            // 0 수렴이 아니라 별개 음소다(20x 에서 996~1393ms).
            {
              promptAudio: 'awh',
              options: [
                { id: 'c7s5-qO4', icon: 'letterTile', label: 'O', say: 'awh', correct: true },
                { id: 'c7s5-qOA4', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c7s5-qAI4', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
                { id: 'c7s5-qU4', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c7s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'N', say: 'nnn' },
            { text: 'R', say: 'rrr' },
            { text: 'AI', say: 'a' },
          ],
          target: ['R', 'AI', 'N'],
          readAloud: { targetText: 'rain' },
        },
        {
          id: 'c7s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c7s5-RANI', icon: 'letterTile', label: 'RANI', correct: false },
            { id: 'c7s5-RAIN', icon: 'letterTile', label: 'RAIN', correct: true },
            { id: 'c7s5-NIRA', icon: 'letterTile', label: 'NIRA', correct: false },
          ],
          readAloud: { targetText: 'rain' },
        },
        {
          id: 'c7s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 boat를 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'T', say: 'tuh' },
            { text: 'B', say: 'buh' },
            { text: 'OA', say: 'oh' },
          ],
          target: ['B', 'OA', 'T'],
          readAloud: { targetText: 'boat' },
        },
        {
          id: 'c7s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'boat도 천천히 따라 말해보세요.',
          words: [
            { text: 'B', say: 'buh' },
            { text: 'OA', say: 'oh' },
            { text: 'T', say: 'tuh' },
            'boat',
          ],
        },
        {
          id: 'c7s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! RAIN! BOAT!',
          words: ['rain', 'boat'],
        },
      ],
      recapKo: 'R-AI-N은 RAIN, B-OA-T는 BOAT! 단어 두 개를 만들었어요! 챕터 7 클리어! 월드 1 완성!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['rain', 'boat'],
      },
    },
  ],
}
