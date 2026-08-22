// Chapter 6 (toy story theme): L, F, B -> boss blends "FIT" + "BIG".
// Finishes Jolly Phonics Group 3 (chapter 5 did G, O, U). This completes
// 6 of world 1's 7 style cycles -- only chapter 7 (DC hero style) is left.
// Beat vocabulary is identical to chapter-01.js -- see that file's header.
//
// Ids are prefixed 'c6' because getStageById() searches every chapter flat.
// 캐릭터 색·외형은 art.js 소유 -- 데이터는 { name, art, style } 만 준다.
// 이 챕터는 챕터4/5 와 달리 스타일 서브타입이 없다 -- 전원 style:'toy' 하나로
// 통일하고, 인형/태엽장난감/블록장난감/장난감병정 같은 장난감 종류별 형상은
// art 가 이름·색으로 구현한다(디자이너 발주는 이 파일의 보고 4번 참조).
//
// 표시/발화 규칙: 화면에는 실제 글자·단어, 발화에는 소리.
// 이 챕터의 소리 표기: L `lll`(기확정) · F `fff` · B `buh`(기확정)
//
// --- F = `fff` 측정 근거 ---
// 글자 이름(`eff`)과 큰 배수(15/20/30x)로 재확인 -- 두 음성 모두 격차가
// 수천 ms 로 벌어지며 N 에 비례해 커진다(Samantha 5.2->10.3초, Alex
// 9.4->18.9초). S(`sss`, 무성마찰음 대비쌍)와도 900ms~7.6초로 확실히 distinct.
// L(`lll`)·B(`buh`) 와도 각각 대조 측정해 챕터 내 공존 안전 확인(수백ms~수초).
//
// --- L↔R: 억지 충돌이 아니라 의도된 학습 목표다 ---
// lll 과 rrr 은 합성기 상에서 명백히 다른 음소다(15x 기준 Samantha 1.9초,
// Alex 2.8초 차이, N 에 비례해 커짐 -- 진짜 충돌 buh/duh 의 "0으로 수렴"
// 신호와 다르다). 즉 이건 SPEECH_COLLISION_PAIRS 에 넣을 합성기 결함이
// 아니라, 한국어 화자가 실제로 귀로 구별하기 어려운 두 소리를 **의도적으로**
// 대비시키는 학습 목표다 -- 그래서 warmup/hard 양쪽에서 반복 노출한다.
//
// --- B 와 D: 소리가 아니라 모양으로 변별시킨다 (챕터4와 동일 처리) ---
// SPEECH_COLLISION_PAIRS 의 buh/duh 항목이 그대로 적용된다. 소리 기반
// letterTile 문항에는 D 를 아예 쓰지 않고, B 의 소리 변별 상대로는 P 만
// 쓴다 -- buh/puh 는 합성기에서 명백히 다른 음소로 측정됐다(15x 기준
// Samantha 500ms, Alex 200ms 차이, N 에 비례해 커짐) -- 챕터4가 D 의 소리
// 변별 상대로 P 를 썼던 것과 동일한 논리(회전 혼동이지만 소리는 다르다).
// b/d 자체는 `match-shape` beat(c6s4-r5b-shape, b/d/p 셋 중 정답 b)로
// 순수 시각 변별시킨다 -- 챕터4의 c4s4-r5b-shape 와 동일 패턴, 대상만
// D 에서 B 로 바뀐 것.
//
// --- 아이콘 제약 ---
// L 은 초성 그림 0개, F 도 0개, B 는 `bed` 하나뿐이다(odd-one-out/multiselect
// 는 같은 소리 그림 2개 이상 필요해서 B 도 그림 문항을 만들 수 없다 -- 단
// bed 하나는 역방향(promptLetter) 문항에 쓸 수 있어 이 챕터에서 유일하게
// 그림-글자 매칭이 실제로 성립한다). 나머지는 챕터 1-5 아이콘 누적 복습으로
// 대체했다. // TODO(icon): 위치마다 표시했다.
//
// --- 보스 단어: FIT(F+I+T) · BIG(B+I+G) ---
// 챕터 3-5 에서 확립한 구조: 각 단어를 자기 스테이지 finale 에서 미리
// 노출 -> 보스는 조립 시험. L 은 stage-2 finale 에 보너스 단어 'lap'
// (L+A+P, 전부 기지 글자)만 노출하고 보스에서 다시 조립하지 않는다 --
// 챕터4의 R 스테이지가 'rat' 을 보너스로만 쓴 것과 같은 패턴. 'fib'(F+I+B,
// 거짓말)도 후보였지만 5세 대상 앱에 부적절한 의미라 'big'(크다, 긍정적)
// 으로 대체했다.

export const chapter6 = {
  id: 'chapter-6',
  order: 6,
  title: 'Wind-Up Wonderland',
  stages: [
    {
      id: 'c6-stage-1',
      order: 1,
      title: 'A Wobbly Sound',
      villain: { name: 'Wobbly', art: 'wobbly', style: 'toy' },
      hero: { name: 'Leo', art: 'leo', style: 'toy' },
      chapterBoss: false,
      beats: [
        {
          id: 'c6s1-teach',
          kind: 'teach',
          instructionKo: 'Leo가 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['lll, lll, lll', 'lap', 'lll, lll, lll'],
        },
        {
          id: 'c6s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          // /l/ 그림이 0개라 아이콘이 필요 없는 beat 로 /l/ 를 나른다.
          instructionKo: 'lll 소리로 시작하는 단어예요! 따라 말해보세요.',
          words: ['lap', 'lid'],
        },
        {
          id: 'c6s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['lll, lll', 'Leo', 'lll, lll', 'lap'],
        },
        {
          id: 'c6s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): lion, leg -- /l/ 그림이 생기면 이 자리를 /l/ 문항으로.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c6s1-cat', icon: 'cat', label: 'cat', correct: false },
            { id: 'c6s1-key', icon: 'key', label: 'key', correct: false },
            { id: 'c6s1-dog', icon: 'dog', label: 'dog', correct: true },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c6s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"hen"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'hen',
          options: [
            { id: 'c6s1-hat', icon: 'hat', label: 'hat', correct: true },
            { id: 'c6s1-dog2', icon: 'dog', label: 'dog', correct: false },
            { id: 'c6s1-pig', icon: 'pig', label: 'pig', correct: false },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c6s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/p/ 소리로 시작하는 걸 모두 찾아 탭하세요!',
          options: [
            { id: 'c6s1-pig2', icon: 'pig', label: 'pig', correct: true },
            { id: 'c6s1-net', icon: 'net', label: 'net', correct: false },
            { id: 'c6s1-pin', icon: 'pin', label: 'pin', correct: true },
            { id: 'c6s1-cake', icon: 'cake', label: 'cake', correct: false },
          ],
          readAloud: { targetText: 'pig' },
        },
        {
          id: 'c6s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['lid', 'lap'],
        },
        {
          id: 'c6s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['lap'],
        },
      ],
      recapKo: '/l/ 소리를 찾았어요! Lap, lid — 모두 lll로 시작해요!',
      recapAudio: {
        ko: '을 소리를 찾았어요! 잘 들어보세요.',
        en: ['lll', 'lap', 'lid'],
      },
    },

    {
      id: 'c6-stage-2',
      order: 2,
      title: 'Power of L',
      villain: { name: 'Tangly', art: 'tangly', style: 'toy' },
      hero: { name: 'Leo', art: 'leo', style: 'toy' },
      chapterBoss: false,
      beats: [
        {
          id: 'c6s2-teach',
          kind: 'teach',
          instructionKo: 'L은 Leo가 씩씩하게 행진할 때처럼 lll 소리를 내요!',
          art: 'hero',
          letter: 'L',
          repeatAudio: ['L', 'lll', 'L', 'lll'],
        },
        {
          id: 'c6s2-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'lll 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'lll',
          // 혼동 보기는 R 하나 -- L/R 은 한국어 화자에게 최대 난점이라
          // 의도적으로 반복 노출한다(합성기 결함이 아니라 학습 목표).
          options: [
            { id: 'c6s2-L1', icon: 'letterTile', label: 'L', say: 'lll', correct: true },
            { id: 'c6s2-R1', icon: 'letterTile', label: 'R', say: 'rrr', correct: false },
            { id: 'c6s2-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
          ],
        },
        {
          id: 'c6s2-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): lion, leg -- /l/ 그림이 생기면 교체.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c6s2-cake', icon: 'cake', label: 'cake', correct: false },
            { id: 'c6s2-key', icon: 'key', label: 'key', correct: false },
            { id: 'c6s2-dog', icon: 'dog', label: 'dog', correct: true },
          ],
          readAloud: { targetText: 'cake' },
        },
        {
          id: 'c6s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 L을 따라 그리면서 lll 소리를 내보세요!',
          words: [{ text: 'L', say: 'lll' }],
        },
        {
          id: 'c6s2-break',
          kind: 'break',
          instructionKo: '손가락으로 L을 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'L',
          repeatAudio: ['L', 'Leo', 'lll'],
        },
        {
          id: 'c6s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/h/ 소리로 시작하는 걸 모두 찾아 탭하세요!',
          options: [
            { id: 'c6s2-hat', icon: 'hat', label: 'hat', correct: true },
            { id: 'c6s2-moon', icon: 'moon', label: 'moon', correct: false },
            { id: 'c6s2-hen', icon: 'hen', label: 'hen', correct: true },
            { id: 'c6s2-horse', icon: 'horse', label: 'horse', correct: true },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c6s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'lll 소리를 내는 글자를 찾아 탭하세요! (조금 어려워요)',
          promptAudio: 'lll',
          options: [
            { id: 'c6s2-L3', icon: 'letterTile', label: 'L', say: 'lll', correct: true },
            { id: 'c6s2-R3', icon: 'letterTile', label: 'R', say: 'rrr', correct: false },
            { id: 'c6s2-M3', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
          ],
          readAloud: { targetText: 'L', say: 'lll' },
        },
        {
          id: 'c6s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): lion, leg -- promptLetter 'L' 문항으로 교체할 자리.
          // 지금은 C 를 누적 복습한다.
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'C',
          options: [
            { id: 'c6s2-cat2', icon: 'cat', label: 'cat', correct: true },
            { id: 'c6s2-dog2', icon: 'dog', label: 'dog', correct: false },
            { id: 'c6s2-egg', icon: 'egg', label: 'egg', correct: false },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c6s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['lap', 'lid'],
        },
        {
          id: 'c6s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어가 아닌 보너스 단어 'lap' (L+A+P 전부 기지 글자).
          instructionKo: '마지막 공격! L 소리로 크게 외쳐보세요!',
          words: [{ text: 'L', say: 'lll' }, 'lap'],
        },
      ],
      recapKo: 'L은 lll 소리를 내요 — lap, lid! R의 rrr 소리와 헷갈리지 마세요!',
      recapAudio: {
        ko: '을은 이런 소리를 내요. 아르 소리와 다르니 잘 들어보세요.',
        en: ['lll', 'lap', 'lid'],
      },
    },

    {
      id: 'c6-stage-3',
      order: 3,
      title: 'Power of F',
      villain: { name: 'Boxxy', art: 'boxxy', style: 'toy' },
      hero: { name: 'Fifi', art: 'fifi', style: 'toy' },
      chapterBoss: false,
      reviewTargets: ['L'],
      beats: [
        {
          id: 'c6s3-teach',
          kind: 'teach',
          instructionKo: 'F는 Fifi가 바람을 내뿜을 때처럼 fff 소리를 내요!',
          art: 'hero',
          letter: 'F',
          repeatAudio: ['F', 'fff', 'F', 'fff'],
        },
        {
          id: 'c6s3-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'fff 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'fff',
          // 혼동 보기는 S 하나 -- 둘 다 무성마찰음이라 살짝 대비된다.
          options: [
            { id: 'c6s3-F1', icon: 'letterTile', label: 'F', say: 'fff', correct: true },
            { id: 'c6s3-S1', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c6s3-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
          ],
        },
        {
          id: 'c6s3-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): fish, fan -- /f/ 그림이 생기면 교체.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c6s3-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c6s3-pot', icon: 'pot', label: 'pot', correct: false },
            { id: 'c6s3-key', icon: 'key', label: 'key', correct: true },
          ],
          readAloud: { targetText: 'pig' },
        },
        {
          id: 'c6s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 F를 따라 그리면서 fff 소리를 내보세요!',
          words: [{ text: 'F', say: 'fff' }],
        },
        {
          id: 'c6s3-break',
          kind: 'break',
          instructionKo: '손가락으로 F를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'F',
          repeatAudio: ['F', 'Fifi', 'fff'],
        },
        {
          id: 'c6s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/e/ 소리로 시작하는 걸 모두 찾아 탭하세요!',
          options: [
            { id: 'c6s3-egg', icon: 'egg', label: 'egg', correct: true },
            { id: 'c6s3-hat', icon: 'hat', label: 'hat', correct: false },
            { id: 'c6s3-elephant', icon: 'elephant', label: 'elephant', correct: true },
            { id: 'c6s3-dog', icon: 'dog', label: 'dog', correct: false },
          ],
          readAloud: { targetText: 'egg' },
        },
        {
          id: 'c6s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'fff 소리를 내는 글자를 찾아 탭하세요! (조금 어려워요)',
          promptAudio: 'fff',
          options: [
            { id: 'c6s3-F3', icon: 'letterTile', label: 'F', say: 'fff', correct: true },
            { id: 'c6s3-S3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c6s3-G3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
          ],
          readAloud: { targetText: 'F', say: 'fff' },
        },
        {
          id: 'c6s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TODO(icon): fish, fan -- promptLetter 'F' 문항으로 교체할 자리.
          // 지금은 E 를 누적 복습한다.
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'E',
          options: [
            { id: 'c6s3-egg2', icon: 'egg', label: 'egg', correct: true },
            { id: 'c6s3-hat2', icon: 'hat', label: 'hat', correct: false },
            { id: 'c6s3-net', icon: 'net', label: 'net', correct: false },
          ],
          readAloud: { targetText: 'egg' },
        },
        {
          id: 'c6s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['fit', 'fan'],
        },
        {
          id: 'c6s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'fit' 사전 노출 (F 로 완성, I·T 는 이미 기지).
          instructionKo: '마지막 공격! F 소리로 크게 외쳐보세요!',
          words: [{ text: 'F', say: 'fff' }, 'fit'],
        },
      ],
      recapKo: 'F는 fff 소리를 내요 — fit, fan! L의 lll도 기억하고 있어요!',
      recapAudio: {
        ko: '에프는 이런 소리를 내요. 을 소리도 아직 기억하고 있어요.',
        en: ['fff', 'fit', 'fan'],
      },
    },

    {
      id: 'c6-stage-4',
      order: 4,
      title: 'Power of B',
      villain: { name: 'Tumbles', art: 'tumbles', style: 'toy' },
      hero: { name: 'Bobo', art: 'bobo', style: 'toy' },
      chapterBoss: false,
      reviewTargets: ['L', 'F'],
      beats: [
        {
          id: 'c6s4-teach',
          kind: 'teach',
          instructionKo: 'B는 Bobo가 블록을 쌓을 때처럼 buh 소리를 내요!',
          art: 'hero',
          letter: 'B',
          repeatAudio: ['B', 'buh', 'B', 'buh'],
        },
        {
          id: 'c6s4-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'buh 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'buh',
          // 혼동 보기는 P 하나 -- buh/puh 는 합성기에서 명백히 다른 음소로
          // 측정됐다(회전 혼동이지만 소리는 다르다, 챕터4가 D 의 소리 변별
          // 상대로 P 를 쓴 것과 같은 논리). D 는 여기 절대 넣지 않는다
          // (SPEECH_COLLISION_PAIRS).
          options: [
            { id: 'c6s4-B1', icon: 'letterTile', label: 'B', say: 'buh', correct: true },
            { id: 'c6s4-P1', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
            { id: 'c6s4-M1', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
          ],
        },
        {
          id: 'c6s4-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c6s4-egg', icon: 'egg', label: 'egg', correct: false },
            { id: 'c6s4-elephant', icon: 'elephant', label: 'elephant', correct: false },
            { id: 'c6s4-cat', icon: 'cat', label: 'cat', correct: true },
          ],
          readAloud: { targetText: 'egg' },
        },
        {
          id: 'c6s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 B를 따라 그리면서 buh 소리를 내보세요!',
          words: [{ text: 'B', say: 'buh' }],
        },
        {
          id: 'c6s4-break',
          kind: 'break',
          instructionKo: '손가락으로 B를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'B',
          repeatAudio: ['B', 'Bobo', 'buh'],
        },
        {
          id: 'c6s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // /b/ 그림이 bed 하나뿐이라 multiselect(2개 이상 정답 필요)는
          // 여전히 안 되고 /p/ 복습으로 대체한다.
          instructionKo: '/p/ 소리로 시작하는 걸 모두 찾아 탭하세요!',
          options: [
            { id: 'c6s4-pig', icon: 'pig', label: 'pig', correct: true },
            { id: 'c6s4-dog', icon: 'dog', label: 'dog', correct: false },
            { id: 'c6s4-pen', icon: 'pen', label: 'pen', correct: true },
            { id: 'c6s4-moon', icon: 'moon', label: 'moon', correct: false },
          ],
          readAloud: { targetText: 'pig' },
        },
        {
          id: 'c6s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'buh 소리를 내는 글자를 찾아 탭하세요! (조금 어려워요)',
          promptAudio: 'buh',
          options: [
            { id: 'c6s4-B3', icon: 'letterTile', label: 'B', say: 'buh', correct: true },
            { id: 'c6s4-P3', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
            { id: 'c6s4-T3', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
          ],
          readAloud: { targetText: 'B', say: 'buh' },
        },
        {
          id: 'c6s4-r5b-shape',
          kind: 'match-shape',
          scored: true,
          hits: 1,
          // 소리 문항이 아니다 -- b/d 는 좌우 대칭이라 소리로는 절대 변별시키지
          // 않는다. 챕터4의 c4s4-r5b-shape 와 동일 패턴, 대상만 D 에서 B 로.
          // say 필드는 넣지 않는다 -- match-shape 는 opt.label 만 발화한다.
          instructionKo: '똑같이 생긴 글자를 찾아보세요!',
          promptLetter: 'b',
          options: [
            { id: 'c6s4-shape-d', icon: 'letterTile', label: 'd', correct: false },
            { id: 'c6s4-shape-b', icon: 'letterTile', label: 'b', correct: true },
            { id: 'c6s4-shape-p', icon: 'letterTile', label: 'p', correct: false },
          ],
          readAloud: { targetText: 'b' },
        },
        {
          id: 'c6s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 이 챕터에서 유일하게 진짜 B 그림(bed)으로 성립하는 역방향 문항.
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'B',
          options: [
            { id: 'c6s4-bed', icon: 'bed', label: 'bed', correct: true },
            { id: 'c6s4-moon2', icon: 'moon', label: 'moon', correct: false },
            { id: 'c6s4-egg2', icon: 'egg', label: 'egg', correct: false },
          ],
          readAloud: { targetText: 'bed' },
        },
        {
          id: 'c6s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['bag', 'bed'],
        },
        {
          id: 'c6s4-finale-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: 'L, F, B를 빠르게 찾아볼까요?',
          steps: [
            {
              promptAudio: 'lll',
              options: [
                { id: 'c6s4-qL', icon: 'letterTile', label: 'L', say: 'lll', correct: true },
                { id: 'c6s4-qF', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
                { id: 'c6s4-qB', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
              ],
            },
            {
              promptAudio: 'fff',
              options: [
                { id: 'c6s4-qF2', icon: 'letterTile', label: 'F', say: 'fff', correct: true },
                { id: 'c6s4-qB2', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
                { id: 'c6s4-qL2', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
              ],
            },
            {
              promptAudio: 'buh',
              options: [
                { id: 'c6s4-qB3', icon: 'letterTile', label: 'B', say: 'buh', correct: true },
                { id: 'c6s4-qL3', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
                { id: 'c6s4-qF3', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c6s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'big' 사전 노출 (B 로 완성, I·G 는 이미 기지).
          instructionKo: '마지막 공격! B 소리로 크게 외쳐보세요!',
          words: [{ text: 'B', say: 'buh' }, 'big'],
        },
      ],
      recapKo: '이제 L, F, B를 모두 알아요! Leo, Fifi, Bobo가 합체할 준비를 해요!',
      recapAudio: {
        ko: '비는 이런 소리를 내요. 이제 세 소리를 모두 배웠어요.',
        en: ['buh', 'bag', 'bed'],
      },
    },

    {
      id: 'c6-stage-5',
      order: 5,
      title: 'Boss: FIT and BIG!',
      villain: { name: 'Wind-Down', art: 'wind-down', style: 'toy' },
      hero: { name: 'Captain Big', art: 'captain-big', style: 'toy' },
      chapterBoss: true,
      reviewTargets: ['L', 'F', 'B'],
      beats: [
        {
          id: 'c6s5-teach',
          kind: 'teach',
          instructionKo: 'Leo + Fifi + Bobo가 합체해요! 먼저 fit을 만들어요.',
          emoji: '🪖🧸➡️🦸',
          repeatAudio: ['fff', 'iii', 'tuh', 'fit', 'fit'],
        },
        {
          id: 'c6s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'F', say: 'fff' },
            { text: 'I', say: 'iii' },
            { text: 'T', say: 'tuh' },
          ],
          target: 'FIT',
        },
        {
          id: 'c6s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [
            { text: 'F', say: 'fff' },
            { text: 'I', say: 'iii' },
            { text: 'T', say: 'tuh' },
            'fit',
          ],
        },
        {
          id: 'c6s5-break',
          kind: 'break',
          instructionKo: '이번엔 big이에요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['buh', 'iii', 'guh', 'big'],
        },
        {
          id: 'c6s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: 'L, F, B를 빠르게 찾아볼까요?',
          steps: [
            {
              promptAudio: 'fff',
              options: [
                { id: 'c6s5-qF', icon: 'letterTile', label: 'F', say: 'fff', correct: true },
                { id: 'c6s5-qB', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
                { id: 'c6s5-qL', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
              ],
            },
            {
              promptAudio: 'buh',
              options: [
                { id: 'c6s5-qB2', icon: 'letterTile', label: 'B', say: 'buh', correct: true },
                { id: 'c6s5-qL2', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
                { id: 'c6s5-qF2', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
              ],
            },
            {
              promptAudio: 'lll',
              options: [
                { id: 'c6s5-qL3', icon: 'letterTile', label: 'L', say: 'lll', correct: true },
                { id: 'c6s5-qF3', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
                { id: 'c6s5-qB3', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c6s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'T', say: 'tuh' },
            { text: 'F', say: 'fff' },
            { text: 'I', say: 'iii' },
          ],
          target: 'FIT',
          readAloud: { targetText: 'fit' },
        },
        {
          id: 'c6s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c6s5-FIT', icon: 'letterTile', label: 'FIT', correct: true },
            { id: 'c6s5-TFI', icon: 'letterTile', label: 'TFI', correct: false },
            { id: 'c6s5-ITF', icon: 'letterTile', label: 'ITF', correct: false },
          ],
          readAloud: { targetText: 'fit' },
        },
        {
          id: 'c6s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 big을 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'G', say: 'guh' },
            { text: 'B', say: 'buh' },
            { text: 'I', say: 'iii' },
          ],
          target: 'BIG',
          readAloud: { targetText: 'big' },
        },
        {
          id: 'c6s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'Captain Big이 외쳐요! 같이 말해볼까요?',
          words: ['big'],
        },
        {
          id: 'c6s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! FIT! BIG!',
          words: ['fit', 'big'],
        },
      ],
      recapKo: 'F-I-T는 FIT, B-I-G는 BIG! 단어 두 개를 만들었어요! 챕터 6 클리어!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['fit', 'big'],
      },
    },
  ],
}
