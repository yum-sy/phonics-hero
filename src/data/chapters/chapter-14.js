// Chapter 14 (Pokemon-flavored creature theme, 2nd appearance -- world 1's
// chapter 4 was the first, and per HANDOFF.md §-1 this family was held back
// to the last slot of world 2 until the emblem plate could take digraphs;
// that fix (`171ce22`, emblemBadge's oval expansion) already landed): AR,
// ER -> boss blends "CAR" + "HER". Finishes Jolly Phonics Group 7 (the whole
// group: qu ou | oi ue | er ar is now spread across chapters 12/13/14).
//
// ============================================================================
// 이 챕터도 챕터 13처럼 새 글자가 둘뿐이다 -- 4번째 스테이지는 새 글자 없는
// 집중 복습이다(teach/break 없이 choose/multiselect/hard/choose-sequence로만
// 구성, 챕터 13의 구조를 그대로 따른다).
//
// ============================================================================
// 소리 표기 -- SOUND_TABLE(Group 7) 조회
// ============================================================================
// AR -> 'arh' (1015/1121ms, 'clean' -- AR 후보 14종 중 유일한 생존자, 나머지는
// `are`/`our`/글자 이름 R 군집이나 `air` 군집으로 접힌다). ER -> 'erh'
// (911/1039ms, 'clean' -- `er`==`air`(Alex), Samantha에서는 `err`/`ehr`가
// `air`·`arr`·`arrr`와 한 군집이라 ER과 AR이 같은 소리가 될 뻔했다. 표기 뒤에
// h를 붙여서 그 군집에서 빠져나온다).
//
// **AR을 먼저, ER을 나중에 가르친다** -- 아이콘 재고 순서를 따랐다(아래).
//
// ============================================================================
// 아이콘 재고
// ============================================================================
// AR: `car`·`star`(기존, 둘 다 ar로 끝난다) 2개 -- 이 챕터에서 유일하게
// **그림 문항과 multiselect(정답 2개)까지 가능한** 새 소리다. ER: 0개(bird/
// fern/letter 없음) -- 그림 문항은 누적 복습으로 채운다.
//
// 필요한 새 아이콘: bird, fern (ER)
//
// ============================================================================
// 계열: 포켓몬(creatures.js), 2회차 재사용. **선화는 계속 동결**이다
// ============================================================================
// (CLAUDE.md: creatures.js는 세피아 선화 `#7a5c48` + 굵기 계층이 이 계열의
// 정체성이라 동결돼 있다 -- 여기서 바꾸지 않는다.) 히어로는 챕터 4의 3개
// 구조 함수(creature-rocket/magno/drillo)를 재사용하고 보스는 creature-boss
// (Captain Red의 드래곤화 버전)를 재사용한다. 빌런은 챕터 4의 5개 구조 함수
// (creature-flippy/slippy/grabby/corky/glitch)를 재사용하되 새 이름 -- 색은
// art.js 팔레트가 "챕터 4와 갈리게" 배정한다. 엠블럼 판은 두 글자 다이그래프
// (AR/ER)를 이미 담을 수 있다(`emblemBadge`의 타원 확장, 위 헤더 참조).
//
// ============================================================================
// 보스 단어: CAR (C+AR) · HER (H+ER) -- 둘 다 이 챕터의 새 글자를 담는다
// ============================================================================
// 새 글자가 둘뿐이라 "가운데 생략" 규칙이 적용되지 않는다. 둘 다 2슬롯(챕터
// 8의 TIE와 같은 계급)이고 C·H는 이미 기지다. `car` 아이콘이 있어서 CAR는
// 이 앱에서 드물게 **보스 단어 자체를 그림으로도 보여줄 수 있는** 사례다.

export const chapter14 = {
  id: 'chapter-14',
  order: 14,
  title: 'Dragon Isle Returns',
  stages: [
    {
      id: 'c14-stage-1',
      order: 1,
      title: 'A Roaring Sound',
      villain: { name: 'Flipzag', art: 'flipzag', style: 'creature-flippy' },
      hero: { name: 'Sparkit', art: 'sparkit', style: 'creature-rocket' },
      chapterBoss: false,
      beats: [
        {
          id: 'c14s1-teach',
          kind: 'teach',
          instructionKo: 'Sparkit이 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['arh'],
        },
        {
          id: 'c14s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '이 소리가 들어있는 단어예요! 따라 말해보세요.',
          words: ['car', 'star'],
        },
        {
          id: 'c14s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['arh'],
        },
        {
          id: 'c14s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"hat"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'huh',
          options: [
            { id: 'c14s1-net23', icon: 'net', label: 'net', correct: false },
            { id: 'c14s1-dog6', icon: 'dog', label: 'dog', correct: false },
            { id: 'c14s1-hat15', icon: 'hat', label: 'hat', correct: true },
            { id: 'c14s1-cup18', icon: 'cup', label: 'cup', correct: false },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c14s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"leg"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'lll',
          options: [
            { id: 'c14s1-fan21', icon: 'fan', label: 'fan', correct: false },
            { id: 'c14s1-bed10', icon: 'bed', label: 'bed', correct: false },
            { id: 'c14s1-ten6', icon: 'ten', label: 'ten', correct: false },
            { id: 'c14s1-leg6', icon: 'leg', label: 'leg', correct: true },
          ],
          readAloud: { targetText: 'leg' },
        },
        {
          id: 'c14s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/d/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c14s1-dog7', icon: 'dog', label: 'dog', correct: true },
            { id: 'c14s1-cake7', icon: 'cake', label: 'cake', correct: false },
            { id: 'c14s1-duck7', icon: 'duck', label: 'duck', correct: true },
            { id: 'c14s1-net24', icon: 'net', label: 'net', correct: false },
            { id: 'c14s1-door5', icon: 'door', label: 'door', correct: true },
          ],
          readAloud: { targetText: 'dog' },
        },
        {
          id: 'c14s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['star', 'car'],
        },
        {
          id: 'c14s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['car'],
        },
      ],
      recapKo: '새로운 소리를 찾았어요! Car, star — 둘 다 이 소리가 들어있어요!',
      recapAudio: {
        ko: '새로운 소리를 배웠어요. 잘 들어보세요.',
        en: ['car', 'star'],
      },
    },

    {
      id: 'c14-stage-2',
      order: 2,
      title: 'Power of AR',
      villain: { name: 'Slickspin', art: 'slickspin', style: 'creature-slippy' },
      hero: { name: 'Sparkit', art: 'sparkit', style: 'creature-rocket' },
      chapterBoss: false,
      beats: [
        {
          id: 'c14s2-teach',
          kind: 'teach',
          instructionKo: 'Sparkit이 엔진을 부릉거리며 AR 소리를 내요!',
          art: 'hero',
          letter: 'AR',
          repeatAudio: ['arh'],
        },
        {
          id: 'c14s2-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: A(AR의 첫 글자 이름)와 OR(비슷하게 생긴 R 다이그래프).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'arh',
          options: [
            { id: 'c14s2-A1', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c14s2-AR1', icon: 'letterTile', label: 'AR', say: 'arh', correct: true },
            { id: 'c14s2-OR1', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
          ],
        },
        {
          id: 'c14s2-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // AR 그림 -- car를 정답으로 둔다.
          instructionKo: '이 소리가 들어있는 그림을 찾아보세요!',
          promptAudio: 'arh',
          options: [
            { id: 'c14s2-bed11', icon: 'bed', label: 'bed', correct: false },
            { id: 'c14s2-car', icon: 'car', label: 'car', correct: true },
            { id: 'c14s2-net25', icon: 'net', label: 'net', correct: false },
            { id: 'c14s2-hen6', icon: 'hen', label: 'hen', correct: false },
          ],
          readAloud: { targetText: 'car' },
        },
        {
          id: 'c14s2-r2b-multi',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // AR 그림 재고는 car/star 2개다(NG가 king/ring 2개였던 것과 같은
          // 자리 -- multiselect 조건은 정답 2개 이상이지 3개가 아니다).
          instructionKo: 'AR 소리가 들어있는 그림을 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c14s2-car2', icon: 'car', label: 'car', correct: true },
            { id: 'c14s2-fan22', icon: 'fan', label: 'fan', correct: false },
            { id: 'c14s2-star2', icon: 'star', label: 'star', correct: true },
            { id: 'c14s2-cup19', icon: 'cup', label: 'cup', correct: false },
            { id: 'c14s2-net26', icon: 'net', label: 'net', correct: false },
          ],
          readAloud: { targetText: 'car' },
        },
        {
          id: 'c14s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 AR을 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'AR', say: 'arh' }],
        },
        {
          id: 'c14s2-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 ar을 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'ar',
          repeatAudio: ['arh'],
        },
        {
          id: 'c14s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/p/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c14s2-pig4', icon: 'pig', label: 'pig', correct: true },
            { id: 'c14s2-cat12', icon: 'cat', label: 'cat', correct: false },
            { id: 'c14s2-pot2', icon: 'pot', label: 'pot', correct: true },
            { id: 'c14s2-duck8', icon: 'duck', label: 'duck', correct: false },
            { id: 'c14s2-pen4', icon: 'pen', label: 'pen', correct: true },
          ],
          readAloud: { targetText: 'pig' },
        },
        {
          id: 'c14s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개: A(AR의 글자 이름 요소), OR(비슷한 R 다이그래프), ER
          // (다음 스테이지, 가장 가까운 경쟁자), OA(다른 둥근 다이그래프).
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'arh',
          options: [
            { id: 'c14s2-A3', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c14s2-AR3', icon: 'letterTile', label: 'AR', say: 'arh', correct: true },
            { id: 'c14s2-OR3', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
            { id: 'c14s2-ER3', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
            { id: 'c14s2-OA3b', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
          ],
          readAloud: { targetText: 'AR', say: 'arh' },
        },
        {
          id: 'c14s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'AR',
          options: [
            { id: 'c14s2-fan23', icon: 'fan', label: 'fan', correct: false },
            { id: 'c14s2-hen7', icon: 'hen', label: 'hen', correct: false },
            { id: 'c14s2-net27', icon: 'net', label: 'net', correct: false },
            { id: 'c14s2-star3', icon: 'star', label: 'star', correct: true },
          ],
          readAloud: { targetText: 'star' },
        },
        {
          id: 'c14s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['car', 'star'],
        },
        {
          id: 'c14s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'car' 사전 노출 (C·AR로 완성, C는 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'C', say: 'kuh' }, { text: 'AR', say: 'arh' }, 'car'],
        },
      ],
      recapKo: 'AR은 엔진이 부릉거리는 것처럼 소리를 내요 — car, star!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 카, 스타!',
        en: ['car', 'star'],
      },
    },

    {
      id: 'c14-stage-3',
      order: 3,
      title: 'Power of ER',
      villain: { name: 'Grabnar', art: 'grabnar', style: 'creature-grabby' },
      hero: { name: 'Magnix', art: 'magnix', style: 'creature-magno' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH', 'TH', 'QU', 'OU', 'OI', 'UE',
        'AR', 'ER',
      ],
      beats: [
        {
          id: 'c14s3-teach',
          kind: 'teach',
          instructionKo: 'Magnix가 자석을 당기며 ER 소리를 내요!',
          art: 'hero',
          letter: 'ER',
          repeatAudio: ['erh'],
        },
        {
          id: 'c14s3-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: E(ER의 첫 요소)와 AR(직전 스테이지, 가장 가까운 경쟁자).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'erh',
          options: [
            { id: 'c14s3-E1', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
            { id: 'c14s3-AR1', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
            { id: 'c14s3-ER1', icon: 'letterTile', label: 'ER', say: 'erh', correct: true },
          ],
        },
        {
          id: 'c14s3-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // ER 그림이 0개라 그림 문항은 누적 복습으로 채운다.
          instructionKo: '"jug"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'juh',
          options: [
            { id: 'c14s3-gum8', icon: 'gum', label: 'gum', correct: false },
            { id: 'c14s3-jug3', icon: 'jug', label: 'jug', correct: true },
            { id: 'c14s3-cake8', icon: 'cake', label: 'cake', correct: false },
            { id: 'c14s3-top7', icon: 'top', label: 'top', correct: false },
          ],
          readAloud: { targetText: 'jug' },
        },
        {
          id: 'c14s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 ER을 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'ER', say: 'erh' }],
        },
        {
          id: 'c14s3-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 er을 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'er',
          repeatAudio: ['erh'],
        },
        {
          id: 'c14s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/f/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c14s3-fan24', icon: 'fan', label: 'fan', correct: true },
            { id: 'c14s3-cat13', icon: 'cat', label: 'cat', correct: false },
            { id: 'c14s3-fish6', icon: 'fish', label: 'fish', correct: true },
            { id: 'c14s3-net28', icon: 'net', label: 'net', correct: false },
            { id: 'c14s3-fork3', icon: 'fork', label: 'fork', correct: true },
          ],
          readAloud: { targetText: 'fan' },
        },
        {
          id: 'c14s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개: E(ER의 첫 요소), AR(가장 가까운 경쟁자), OR(다른 R
          // 다이그래프), IE(다른 이중모음).
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'erh',
          options: [
            { id: 'c14s3-ER3', icon: 'letterTile', label: 'ER', say: 'erh', correct: true },
            { id: 'c14s3-E3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
            { id: 'c14s3-AR3', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
            { id: 'c14s3-OR3b', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
            { id: 'c14s3-IE3c', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
          ],
          readAloud: { targetText: 'ER', say: 'erh' },
        },
        {
          id: 'c14s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 챕터 14 자신의 AR(car/star)로 복습한다.
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'AR',
          options: [
            { id: 'c14s3-net29', icon: 'net', label: 'net', correct: false },
            { id: 'c14s3-hat16', icon: 'hat', label: 'hat', correct: false },
            { id: 'c14s3-bed12', icon: 'bed', label: 'bed', correct: false },
            { id: 'c14s3-car3', icon: 'car', label: 'car', correct: true },
          ],
          readAloud: { targetText: 'car' },
        },
        {
          id: 'c14s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['her', 'fern'],
        },
        {
          id: 'c14s3-r8-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          // 스텝 5개(새 글자 2 + 누적 복습 3). 복습 대상: E(ER의 첫 요소),
          // H(보스 단어 HER의 첫 소리), AR(직전 스테이지, 가장 가까운 경쟁자).
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'arh',
              options: [
                { id: 'c14s3-qAR', icon: 'letterTile', label: 'AR', say: 'arh', correct: true },
                { id: 'c14s3-qA', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
                { id: 'c14s3-qER', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
                { id: 'c14s3-qOR', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
              ],
            },
            {
              promptAudio: 'erh',
              options: [
                { id: 'c14s3-qAR2', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
                { id: 'c14s3-qER2', icon: 'letterTile', label: 'ER', say: 'erh', correct: true },
                { id: 'c14s3-qE2', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
                { id: 'c14s3-qOR2', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
              ],
            },
            // 누적 복습 (챕터 3의 E). ER의 첫 요소다.
            {
              promptAudio: 'eh',
              options: [
                { id: 'c14s3-qER3', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
                { id: 'c14s3-qAR3', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
                { id: 'c14s3-qE3', icon: 'letterTile', label: 'E', say: 'eh', correct: true },
                { id: 'c14s3-qEE3', icon: 'letterTile', label: 'EE', say: 'ee', correct: false },
              ],
            },
            // 누적 복습 (챕터 3의 H). 보스 단어 HER의 첫 소리다.
            {
              promptAudio: 'huh',
              options: [
                { id: 'c14s3-qAR4', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
                { id: 'c14s3-qER4', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
                { id: 'c14s3-qN4', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
                { id: 'c14s3-qH4', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
              ],
            },
            // 누적 복습 (직전 스테이지의 AR).
            {
              promptAudio: 'arh',
              options: [
                { id: 'c14s3-qAR5', icon: 'letterTile', label: 'AR', say: 'arh', correct: true },
                { id: 'c14s3-qER5', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
                { id: 'c14s3-qOR5', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
                { id: 'c14s3-qOA5', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c14s3-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'her' 사전 노출 (H+ER로 완성, H는 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'H', say: 'huh' }, { text: 'ER', say: 'erh' }, 'her'],
        },
      ],
      recapKo: '이제 AR, ER을 모두 알아요! Sparkit과 Magnix가 힘을 합쳐요!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 이제 두 소리를 모두 배웠어요.',
        en: ['her', 'fern'],
      },
    },

    {
      id: 'c14-stage-4',
      order: 4,
      title: 'Dragon Roar Practice',
      villain: { name: 'Corvid', art: 'corvid', style: 'creature-corky' },
      hero: { name: 'Drillbit', art: 'drillbit', style: 'creature-drillo' },
      chapterBoss: false,
      // 새 글자가 둘뿐이라 5스테이지를 채우려면 새 글자 없는 집중 복습
      // 스테이지가 필요하다(챕터 13과 같은 구조) -- teach/break가 없다.
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH', 'TH', 'QU', 'OU', 'OI', 'UE',
        'AR', 'ER',
      ],
      beats: [
        {
          id: 'c14s4-r1',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'AR과 ER 소리를 다시 연습해요! 이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'arh',
          options: [
            { id: 'c14s4-OR1', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
            { id: 'c14s4-AR1', icon: 'letterTile', label: 'AR', say: 'arh', correct: true },
            { id: 'c14s4-ER1', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
            { id: 'c14s4-A1', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
          ],
          readAloud: { targetText: 'AR', say: 'arh' },
        },
        {
          id: 'c14s4-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'erh',
          options: [
            { id: 'c14s4-E2', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
            { id: 'c14s4-AR2', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
            { id: 'c14s4-ER2', icon: 'letterTile', label: 'ER', say: 'erh', correct: true },
            { id: 'c14s4-OR2', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
          ],
          readAloud: { targetText: 'ER', say: 'erh' },
        },
        {
          id: 'c14s4-r3-multi',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: 'AR 소리가 들어있는 그림을 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c14s4-star4', icon: 'star', label: 'star', correct: true },
            { id: 'c14s4-hen8', icon: 'hen', label: 'hen', correct: false },
            { id: 'c14s4-car4', icon: 'car', label: 'car', correct: true },
            { id: 'c14s4-net30', icon: 'net', label: 'net', correct: false },
            { id: 'c14s4-fan25', icon: 'fan', label: 'fan', correct: false },
          ],
          readAloud: { targetText: 'car' },
        },
        {
          id: 'c14s4-r4-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'erh',
          options: [
            { id: 'c14s4-AR4', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
            { id: 'c14s4-OR4', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
            { id: 'c14s4-E4', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
            { id: 'c14s4-UE4', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
            { id: 'c14s4-ER4', icon: 'letterTile', label: 'ER', say: 'erh', correct: true },
          ],
          readAloud: { targetText: 'ER', say: 'erh' },
        },
        {
          id: 'c14s4-r5-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'arh',
              options: [
                { id: 'c14s4-qAR', icon: 'letterTile', label: 'AR', say: 'arh', correct: true },
                { id: 'c14s4-qER', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
                { id: 'c14s4-qOR', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
                { id: 'c14s4-qOI', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
              ],
            },
            {
              promptAudio: 'erh',
              options: [
                { id: 'c14s4-qAR2', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
                { id: 'c14s4-qER2', icon: 'letterTile', label: 'ER', say: 'erh', correct: true },
                { id: 'c14s4-qOR2', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
                { id: 'c14s4-qUE2', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
              ],
            },
            // 누적 복습 (챕터 3의 H). 보스 단어 HER의 첫 소리다.
            {
              promptAudio: 'huh',
              options: [
                { id: 'c14s4-qER3', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
                { id: 'c14s4-qAR3', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
                { id: 'c14s4-qH3', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
                { id: 'c14s4-qN3', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
              ],
            },
            // 누적 복습 (챕터 3의 C). 보스 단어 CAR의 첫 소리다.
            {
              promptAudio: 'kuh',
              options: [
                { id: 'c14s4-qAR4', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
                { id: 'c14s4-qER4', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
                { id: 'c14s4-qG4', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
                { id: 'c14s4-qC4', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
              ],
            },
          ],
        },
        {
          id: 'c14s4-r6-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['car', 'her'],
        },
        {
          id: 'c14s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['car'],
        },
      ],
      recapKo: 'AR과 ER을 다시 연습했어요! 이제 합체할 준비 완료예요!',
      recapAudio: {
        ko: '두 소리를 다시 연습했어요. 이제 준비됐어요.',
        en: ['arh', 'erh'],
      },
    },

    {
      id: 'c14-stage-5',
      order: 5,
      title: 'Boss: CAR and HER!',
      villain: { name: 'Glitch Emperor', art: 'glitch-emperor', style: 'creature-glitch' },
      hero: { name: 'Captain Ember', art: 'captain-ember', style: 'creature-boss' },
      chapterBoss: true,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH', 'TH', 'QU', 'OU', 'OI', 'UE',
        'AR', 'ER',
      ],
      beats: [
        {
          id: 'c14s5-teach',
          kind: 'teach',
          instructionKo: 'Sparkit + Magnix가 합체해요! 먼저 car를 만들어요.',
          repeatAudio: ['kuh', 'arh', 'car'],
        },
        {
          id: 'c14s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'C', say: 'kuh' },
            { text: 'AR', say: 'arh' },
          ],
          target: ['C', 'AR'],
        },
        {
          id: 'c14s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [{ text: 'C', say: 'kuh' }, { text: 'AR', say: 'arh' }, 'car'],
        },
        {
          id: 'c14s5-break',
          kind: 'break',
          instructionKo: '이번엔 her예요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['huh', 'erh', 'her'],
        },
        {
          id: 'c14s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'arh',
              options: [
                { id: 'c14s5-qAR', icon: 'letterTile', label: 'AR', say: 'arh', correct: true },
                { id: 'c14s5-qOR', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
                { id: 'c14s5-qER', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
                { id: 'c14s5-qA', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
              ],
            },
            {
              promptAudio: 'erh',
              options: [
                { id: 'c14s5-qAR2', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
                { id: 'c14s5-qER2', icon: 'letterTile', label: 'ER', say: 'erh', correct: true },
                { id: 'c14s5-qE2', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
                { id: 'c14s5-qOR2', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
              ],
            },
            // 누적 복습 (챕터 3의 H). 보스 단어 HER의 첫 소리다.
            {
              promptAudio: 'huh',
              options: [
                { id: 'c14s5-qER3', icon: 'letterTile', label: 'ER', say: 'erh', correct: false },
                { id: 'c14s5-qAR3', icon: 'letterTile', label: 'AR', say: 'arh', correct: false },
                { id: 'c14s5-qH3', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
                { id: 'c14s5-qN3', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c14s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'AR', say: 'arh' },
            { text: 'C', say: 'kuh' },
          ],
          target: ['C', 'AR'],
          readAloud: { targetText: 'car' },
        },
        {
          id: 'c14s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c14s5-CAR', icon: 'letterTile', label: 'CAR', correct: true },
            { id: 'c14s5-ACR', icon: 'letterTile', label: 'ACR', correct: false },
            { id: 'c14s5-RCA', icon: 'letterTile', label: 'RCA', correct: false },
          ],
          readAloud: { targetText: 'car' },
        },
        {
          id: 'c14s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 her를 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'ER', say: 'erh' },
            { text: 'H', say: 'huh' },
          ],
          target: ['H', 'ER'],
          readAloud: { targetText: 'her' },
        },
        {
          id: 'c14s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'her도 천천히 따라 말해보세요.',
          words: [{ text: 'H', say: 'huh' }, { text: 'ER', say: 'erh' }, 'her'],
        },
        {
          id: 'c14s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! CAR! HER!',
          words: ['car', 'her'],
        },
      ],
      recapKo: 'C-AR는 CAR, H-ER는 HER! 단어 두 개를 만들었어요! 챕터 14 클리어! 월드 2 완결!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['car', 'her'],
      },
    },
  ],
}
