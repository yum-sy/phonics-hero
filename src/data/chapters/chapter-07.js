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
// 'oh'(OA) vs 'ough'(단모음 O) 는 1.3~2.7초 차이 -- 확인된 대비쌍
// 문항에서 안전하게 공존한다.
//
// --- 보스 단어: RAIN(R+AI+N) · BOAT(B+OA+T) ---
// 챕터 3-6 구조 그대로: 각 소리를 자기 스테이지 finale 에서 미리 노출
// -> 보스는 조립 시험. J 는 stage-3 finale 에 보너스 단어 'jam'
// (J+A+M, 전부 기지 글자)만 노출하고 보스에서 다시 조립하지 않는다 --
// 이 챕터의 핵심 신개념은 AI/OA 지 J 가 아니므로, 두 다이그래프 단어를
// 보스에서 조립시켜 새 슬롯 계약을 실제로 써먹는다.
//
// --- 아이콘 제약 ---
// AI/J/OA 초성(또는 AI/OA 포함) 그림이 0개다. 나머지는 챕터 1-6
// 아이콘 누적 복습으로 대체했다. // TODO(icon): 위치마다 표시했다.

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
          repeatAudio: ['a, a, a', 'rain', 'a, a, a'],
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
          repeatAudio: ['a, a', 'Ray', 'a, a', 'rain'],
        },
        {
          id: 'c7s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): rain, train -- AI 그림이 생기면 이 자리를 교체.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c7s1-bed', icon: 'bed', label: 'bed', correct: false },
            { id: 'c7s1-box', icon: 'box', label: 'box', correct: false },
            { id: 'c7s1-fish', icon: 'fish', label: 'fish', correct: true },
          ],
          readAloud: { targetText: 'bed' },
        },
        {
          id: 'c7s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"gift"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'gift',
          options: [
            { id: 'c7s1-gum', icon: 'gum', label: 'gum', correct: true },
            { id: 'c7s1-octopus', icon: 'octopus', label: 'octopus', correct: false },
            { id: 'c7s1-leg', icon: 'leg', label: 'leg', correct: false },
          ],
          readAloud: { targetText: 'gum' },
        },
        {
          id: 'c7s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/h/ 소리로 시작하는 걸 모두 찾아 탭하세요!',
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
      recapKo: '새로운 소리를 찾았어요! Rain, aim — 모두 이 소리로 시작해요!',
      recapAudio: {
        ko: '에이아이는 이런 소리를 내요. 잘 들어보세요.',
        en: ['a', 'rain', 'aim'],
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
          repeatAudio: ['a, a, a', 'rain', 'a, a, a'],
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
          id: 'c7s2-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): rain, aim -- AI 그림이 생기면 교체.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c7s2-octopus', icon: 'octopus', label: 'octopus', correct: false },
            { id: 'c7s2-orange', icon: 'orange', label: 'orange', correct: false },
            { id: 'c7s2-umbrella', icon: 'umbrella', label: 'umbrella', correct: true },
          ],
          readAloud: { targetText: 'octopus' },
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
          instructionKo: '손가락으로 AI를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'AI',
          repeatAudio: ['a, a', 'Ray', 'a, a', 'rain'],
        },
        {
          id: 'c7s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/f/ 소리로 시작하는 걸 모두 찾아 탭하세요!',
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
          instructionKo: '이 소리를 내는 글자를 찾아 탭하세요! (조금 어려워요)',
          promptAudio: 'a',
          options: [
            { id: 'c7s2-AI3', icon: 'letterTile', label: 'AI', say: 'a', correct: true },
            { id: 'c7s2-A3', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c7s2-E3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
          ],
          readAloud: { targetText: 'AI', say: 'a' },
        },
        {
          id: 'c7s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): rain, aim -- promptLetter 'AI' 문항으로 교체할 자리.
          // 지금은 R 을 누적 복습한다.
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'R',
          options: [
            { id: 'c7s2-rat', icon: 'rat', label: 'rat', correct: true },
            { id: 'c7s2-gum', icon: 'gum', label: 'gum', correct: false },
            { id: 'c7s2-fish2', icon: 'fish', label: 'fish', correct: false },
          ],
          readAloud: { targetText: 'rat' },
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
        en: ['a', 'rain', 'aim'],
      },
    },

    {
      id: 'c7-stage-3',
      order: 3,
      title: 'Power of J',
      villain: { name: 'Gridlock', art: 'gridlock', style: 'dc-hero' },
      hero: { name: 'Jett', art: 'jett', style: 'dc-hero' },
      chapterBoss: false,
      reviewTargets: ['AI'],
      beats: [
        {
          id: 'c7s3-teach',
          kind: 'teach',
          instructionKo: 'J는 Jett가 하늘을 가를 때처럼 juh 소리를 내요!',
          art: 'hero',
          letter: 'J',
          repeatAudio: ['J', 'juh', 'J', 'juh'],
        },
        {
          id: 'c7s3-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'juh 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'juh',
          // 혼동 보기는 G 하나 -- /d3/ 와 /g/ 는 둘 다 연구개 근처 파열/
          // 파찰음이라 살짝 대비된다(측정으로 안전 확인).
          options: [
            { id: 'c7s3-J1', icon: 'letterTile', label: 'J', say: 'juh', correct: true },
            { id: 'c7s3-G1', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
            { id: 'c7s3-D1', icon: 'letterTile', label: 'D', say: 'duh', correct: false },
          ],
        },
        {
          id: 'c7s3-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): jam, jug -- /j/ 그림이 생기면 교체.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c7s3-lion', icon: 'lion', label: 'lion', correct: false },
            { id: 'c7s3-leg', icon: 'leg', label: 'leg', correct: false },
            { id: 'c7s3-ball', icon: 'ball', label: 'ball', correct: true },
          ],
          readAloud: { targetText: 'lion' },
        },
        {
          id: 'c7s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 J를 따라 그리면서 juh 소리를 내보세요!',
          words: [{ text: 'J', say: 'juh' }],
        },
        {
          id: 'c7s3-break',
          kind: 'break',
          instructionKo: '손가락으로 J를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'J',
          repeatAudio: ['J', 'Jett', 'juh'],
        },
        {
          id: 'c7s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/o/ 소리로 시작하는 걸 모두 찾아 탭하세요!',
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
          instructionKo: 'juh 소리를 내는 글자를 찾아 탭하세요! (조금 어려워요)',
          promptAudio: 'juh',
          options: [
            { id: 'c7s3-J3', icon: 'letterTile', label: 'J', say: 'juh', correct: true },
            { id: 'c7s3-G3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
            { id: 'c7s3-B3', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
          ],
          readAloud: { targetText: 'J', say: 'juh' },
        },
        {
          id: 'c7s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): jam, jug -- promptLetter 'J' 문항으로 교체할 자리.
          // 지금은 F 를 누적 복습한다.
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'F',
          options: [
            { id: 'c7s3-fish3', icon: 'fish', label: 'fish', correct: true },
            { id: 'c7s3-bed3', icon: 'bed', label: 'bed', correct: false },
            { id: 'c7s3-octopus2', icon: 'octopus', label: 'octopus', correct: false },
          ],
          readAloud: { targetText: 'fish' },
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
      recapKo: 'J는 juh 소리를 내요 — jam, jog! AI 소리도 기억하고 있어요!',
      recapAudio: {
        ko: '제이는 이런 소리를 내요. 잼, 조그!',
        en: ['juh', 'jam', 'jog'],
      },
    },

    {
      id: 'c7-stage-4',
      order: 4,
      title: 'Power of OA',
      villain: { name: 'Floodlight', art: 'floodlight', style: 'dc-hero' },
      hero: { name: 'Cloak', art: 'cloak', style: 'dc-hero' },
      chapterBoss: false,
      reviewTargets: ['AI', 'J'],
      beats: [
        {
          id: 'c7s4-teach',
          kind: 'teach',
          instructionKo: 'OA는 O가 자기 이름을 말할 때처럼 소리를 내요!',
          art: 'hero',
          letter: 'OA',
          repeatAudio: ['oh, oh, oh', 'boat', 'oh, oh, oh'],
        },
        {
          id: 'c7s4-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'oh',
          // 혼동 보기는 단모음 O 하나 -- 챕터5 의 단모음 O 와의 대비쌍.
          options: [
            { id: 'c7s4-OA1', icon: 'letterTile', label: 'OA', say: 'oh', correct: true },
            { id: 'c7s4-O1', icon: 'letterTile', label: 'O', say: 'ough', correct: false },
            { id: 'c7s4-U1', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
          ],
        },
        {
          id: 'c7s4-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): boat, coat -- OA 그림이 생기면 교체.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c7s4-ball', icon: 'ball', label: 'ball', correct: false },
            { id: 'c7s4-box', icon: 'box', label: 'box', correct: false },
            { id: 'c7s4-key', icon: 'key', label: 'key', correct: true },
          ],
          readAloud: { targetText: 'ball' },
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
          instructionKo: '손가락으로 OA를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'OA',
          repeatAudio: ['oh, oh', 'Cloak', 'oh, oh', 'boat'],
        },
        {
          id: 'c7s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/l/ 소리로 시작하는 걸 모두 찾아 탭하세요!',
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
          instructionKo: '이 소리를 내는 글자를 찾아 탭하세요! (조금 어려워요)',
          promptAudio: 'oh',
          options: [
            { id: 'c7s4-OA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: true },
            { id: 'c7s4-O3', icon: 'letterTile', label: 'O', say: 'ough', correct: false },
            { id: 'c7s4-E3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
          ],
          readAloud: { targetText: 'OA', say: 'oh' },
        },
        {
          id: 'c7s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): boat, coat -- promptLetter 'OA' 문항으로 교체할
          // 자리. 지금은 G 를 누적 복습한다.
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'G',
          options: [
            { id: 'c7s4-gift', icon: 'gift', label: 'gift', correct: true },
            { id: 'c7s4-fish4', icon: 'fish', label: 'fish', correct: false },
            { id: 'c7s4-box4', icon: 'box', label: 'box', correct: false },
          ],
          readAloud: { targetText: 'gift' },
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
          instructionKo: 'AI, J, OA를 빠르게 찾아볼까요?',
          steps: [
            {
              promptAudio: 'a',
              options: [
                { id: 'c7s4-qAI', icon: 'letterTile', label: 'AI', say: 'a', correct: true },
                { id: 'c7s4-qJ', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
                { id: 'c7s4-qOA', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
              ],
            },
            {
              promptAudio: 'juh',
              options: [
                { id: 'c7s4-qJ2', icon: 'letterTile', label: 'J', say: 'juh', correct: true },
                { id: 'c7s4-qOA2', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c7s4-qAI2', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
              ],
            },
            {
              promptAudio: 'oh',
              options: [
                { id: 'c7s4-qOA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: true },
                { id: 'c7s4-qAI3', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
                { id: 'c7s4-qJ3', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
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
        en: ['oh', 'boat', 'coat'],
      },
    },

    {
      id: 'c7-stage-5',
      order: 5,
      title: 'Boss: RAIN and BOAT!',
      villain: { name: 'Nightfall', art: 'nightfall', style: 'dc-hero' },
      hero: { name: 'Nightray', art: 'nightray', style: 'dc-hero' },
      chapterBoss: true,
      reviewTargets: ['AI', 'J', 'OA'],
      beats: [
        {
          id: 'c7s5-teach',
          kind: 'teach',
          instructionKo: 'Ray + Jett + Cloak이 합체해요! 먼저 rain을 만들어요.',
          emoji: '🌧️⛵➡️🦸',
          repeatAudio: ['rrr', 'a', 'nnn', 'rain', 'rain'],
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
          instructionKo: 'AI, J, OA를 빠르게 찾아볼까요?',
          steps: [
            {
              promptAudio: 'oh',
              options: [
                { id: 'c7s5-qOA', icon: 'letterTile', label: 'OA', say: 'oh', correct: true },
                { id: 'c7s5-qAI', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
                { id: 'c7s5-qJ', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
              ],
            },
            {
              promptAudio: 'a',
              options: [
                { id: 'c7s5-qAI2', icon: 'letterTile', label: 'AI', say: 'a', correct: true },
                { id: 'c7s5-qJ2', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
                { id: 'c7s5-qOA2', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
              ],
            },
            {
              promptAudio: 'juh',
              options: [
                { id: 'c7s5-qJ3', icon: 'letterTile', label: 'J', say: 'juh', correct: true },
                { id: 'c7s5-qOA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c7s5-qAI3', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
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
            { id: 'c7s5-RAIN', icon: 'letterTile', label: 'RAIN', correct: true },
            { id: 'c7s5-RANI', icon: 'letterTile', label: 'RANI', correct: false },
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
          instructionKo: 'Nightray가 외쳐요! 같이 말해볼까요?',
          words: ['boat'],
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
