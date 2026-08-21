// Chapter 3 (dinosaur theme): C/K, E, H -> boss blends "CAT" + "HEN".
// Starts Jolly Phonics Group 2 after chapters 1-2 finished Group 1 (S A T I P N).
// Beat vocabulary is identical to chapter-01.js -- see that file's header.
//
// Ids are prefixed 'c3' because getStageById() searches every chapter flat.
// 캐릭터 색·외형은 art.js 소유 -- 데이터는 { name, style } 만 준다.
// 'dino' 는 패밀리 라벨이고, 캐릭터별 구체 style 매핑은 art.js 가 갖는다.
//
// 표시/발화 규칙: 화면에는 실제 글자·단어, 발화에는 소리. 둘이 다르면
// { text: 'C', say: 'kuh' } / readAloud.say / options[].say / letters[].
// 이 챕터의 소리 표기: C `k-k-k` · K `k-k-k` (같은 소리!) · E `eh` · H `h-h-h`
//
// --- C 와 K 를 어떻게 다루는가 (이 챕터 최대 설계 과제) ---
// Jolly 는 c 와 k 를 같은 /k/ 로 함께 가르친다. 5세에게 위험한 건 "글자가 둘"
// 자체가 아니라, 둘을 **변별 대상으로 물어보는 문항**이다 -- "k-k-k 소리를
// 내는 글자는?" 에 C 와 K 를 함께 넣으면 정답이 두 개인 답할 수 없는 문제가
// 되고, 아이는 자기가 틀렸다고 학습한다. 그래서:
//   1. 채점 문항에서 C 와 K 를 절대 함께 보기로 두지 않는다 (변별 금지).
//   2. 대신 multiselect 에서 **둘 다 정답**으로 제시한다 -- "모두 찾기" 는
//      다대일 대응을 테스트가 아니라 수업으로 바꾼다. c3s2-r4, c3s3-r4.
//   3. C 를 변별시킬 때 상대는 S (c 가 /s/ 로도 읽히는 실제 함정) 나 소리가
//      확실히 다른 글자로만 한다.
//   4. 비채점 break 에서 "쌍둥이" 로 명시 -- 틀릴 수 없는 자리에서 사실로 제시.
//
// --- 아이콘 ---
// /k/ = cat·key·cake·king·kite·car·cup, /e/ = egg·elephant, /h/ = hat·hen·hand·horse.
// 세 소리 모두 그림 문항으로 다룬다. promptLetter 'C' 문항의 정답은 **C 로 시작하는
// 철자**여야 한다 -- key/king/kite 는 소리는 같아도 K 로 시작하므로 쓸 수 없다.

export const chapter3 = {
  id: 'chapter-3',
  order: 3,
  title: 'Dino Valley Secret',
  stages: [
    {
      id: 'c3-stage-1',
      order: 1,
      title: 'The Valley Roar',
      villain: { name: 'Blinky', art: 'blinky', style: 'dino' },
      hero: { name: 'Coco', art: 'coco', style: 'dino' },
      chapterBoss: false,
      beats: [
        {
          id: 'c3s1-teach',
          kind: 'teach',
          instructionKo: '케이라가 골짜기에서 나는 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['kuh', 'kuh', 'kuh'],
        },
        {
          id: 'c3s1-r1',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c3s1-cat', icon: 'cat', label: 'cat', correct: false },
            { id: 'c3s1-key', icon: 'key', label: 'key', correct: false },
            { id: 'c3s1-sun', icon: 'sun', label: 'sun', correct: true },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c3s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['kuh', 'kuh', 'Coco', 'kuh', 'kuh', 'cup'],
        },
        {
          id: 'c3s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c3s1-cake', icon: 'cake', label: 'cake', correct: false },
            { id: 'c3s1-car', icon: 'car', label: 'car', correct: false },
            { id: 'c3s1-ink', icon: 'ink', label: 'ink', correct: true },
          ],
          readAloud: { targetText: 'cake' },
        },
        {
          id: 'c3s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"cat"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'cat',
          options: [
            { id: 'c3s1-king', icon: 'king', label: 'king', correct: true },
            { id: 'c3s1-moon', icon: 'moon', label: 'moon', correct: false },
            { id: 'c3s1-pig', icon: 'pig', label: 'pig', correct: false },
          ],
          readAloud: { targetText: 'king' },
        },
        {
          id: 'c3s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/k/ 소리로 시작하는 걸 모두 찾아 탭하세요!',
          options: [
            { id: 'c3s1-cat2', icon: 'cat', label: 'cat', correct: true },
            { id: 'c3s1-bus', icon: 'bus', label: 'bus', correct: false },
            { id: 'c3s1-key2', icon: 'key', label: 'key', correct: true },
            { id: 'c3s1-cake2', icon: 'cake', label: 'cake', correct: true },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c3s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '들려주는 단어를 하나씩 따라 말해보세요!',
          words: ['cat', 'key', 'cake'],
        },
        {
          id: 'c3s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['cat'],
        },
      ],
      recapKo: '/k/ 소리를 찾았어요! Cat, key, cake, king — 모두 kuh로 시작해요!',
      recapAudio: {
        ko: '씨 소리를 찾았어요! 잘 들어보세요.',
        en: ['kuh', 'cat', 'key', 'cake'],
      },
    },

    {
      id: 'c3-stage-2',
      order: 2,
      title: 'Power of C',
      villain: { name: 'Echo', art: 'echo', style: 'dino' },
      hero: { name: 'Coco', art: 'coco', style: 'dino' },
      chapterBoss: false,
      beats: [
        {
          id: 'c3s2-teach',
          kind: 'teach',
          instructionKo: 'C는 케이라의 발톱처럼 k-k-k 소리를 내요!',
          art: 'hero',
          letter: 'C',
          repeatAudio: ['C', 'kuh', 'C', 'kuh'],
        },
        {
          id: 'c3s2-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'k-k-k 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'kuh',
          // K 는 여기 절대 넣지 않는다 -- C 와 K 는 같은 소리라 정답이 둘이 된다.
          options: [
            { id: 'c3s2-C1', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
            { id: 'c3s2-T1', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c3s2-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
          ],
        },
        {
          id: 'c3s2-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c3s2-cat', icon: 'cat', label: 'cat', correct: false },
            { id: 'c3s2-cake', icon: 'cake', label: 'cake', correct: false },
            { id: 'c3s2-pin', icon: 'pin', label: 'pin', correct: true },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c3s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 C를 따라 그리면서 k-k-k 소리를 내보세요!',
          words: [{ text: 'C', say: 'kuh' }],
        },
        {
          id: 'c3s2-break',
          kind: 'break',
          // 쌍둥이 사실을 "틀릴 수 없는" 비채점 자리에서 먼저 제시한다.
          // 큰 글자를 C 하나만 띄우면 K 발화와 어긋나 보이므로 letter 를 뺐다.
          instructionKo: 'C와 K는 쌍둥이예요! 글자는 다른데 소리는 똑같이 k-k-k 예요.',
          art: 'hero',
          repeatAudio: ['C', 'kuh', 'K', 'kuh'],
        },
        {
          id: 'c3s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // 쌍둥이를 "모두 찾기" 로 물어 다대일 대응을 수업으로 만든다.
          instructionKo: 'k-k-k 소리를 내는 글자를 모두 찾아 탭하세요! (두 개예요)',
          options: [
            { id: 'c3s2-C2', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
            { id: 'c3s2-S2', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c3s2-K2', icon: 'letterTile', label: 'K', say: 'kuh', correct: true },
            { id: 'c3s2-T2', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
          ],
          readAloud: { targetText: 'C', say: 'kuh' },
        },
        {
          id: 'c3s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'k-k-k 소리를 내는 글자를 찾아 탭하세요! (조금 어려워요)',
          promptAudio: 'kuh',
          // 혼동 보기는 S 하나 -- c 가 /s/ 로도 읽히는 실제 함정이다.
          options: [
            { id: 'c3s2-C3', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
            { id: 'c3s2-S3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c3s2-P3', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
          ],
          readAloud: { targetText: 'C', say: 'kuh' },
        },
        {
          id: 'c3s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'C',
          options: [
            { id: 'c3s2-cake2', icon: 'cake', label: 'cake', correct: true },
            { id: 'c3s2-sun', icon: 'sun', label: 'sun', correct: false },
            { id: 'c3s2-net', icon: 'net', label: 'net', correct: false },
          ],
          readAloud: { targetText: 'cake' },
        },
        {
          id: 'c3s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['cat', 'cake'],
        },
        {
          id: 'c3s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'cat' 을 여기서 미리 듣고 말해본다 (조립은 보스에서).
          instructionKo: '마지막 공격! C 소리로 크게 외쳐보세요!',
          words: [{ text: 'C', say: 'kuh' }, 'cat'],
        },
      ],
      recapKo: 'C는 kuh 소리를 내요. 그리고 K도 똑같은 kuh 소리를 내는 쌍둥이예요!',
      recapAudio: {
        ko: '씨와 케이는 소리가 똑같아요. 쌍둥이예요!',
        en: ['kuh', 'cat', 'kuh', 'king'],
      },
    },

    {
      id: 'c3-stage-3',
      order: 3,
      title: 'Power of E',
      villain: { name: 'Upsy', art: 'upsy', style: 'dino' },
      hero: { name: 'Eddy', art: 'eddy', style: 'dino' },
      chapterBoss: false,
      reviewTargets: ['C'],
      beats: [
        {
          id: 'c3s3-teach',
          kind: 'teach',
          instructionKo: 'E는 에디가 알에서 나올 때처럼 eh 소리를 내요!',
          art: 'hero',
          letter: 'E',
          repeatAudio: ['E', 'eh', 'E', 'eh'],
        },
        {
          id: 'c3s3-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'eh 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'eh',
          options: [
            { id: 'c3s3-E1', icon: 'letterTile', label: 'E', say: 'eh', correct: true },
            { id: 'c3s3-A1', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c3s3-T1', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
          ],
        },
        {
          id: 'c3s3-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c3s3-egg', icon: 'egg', label: 'egg', correct: false },
            { id: 'c3s3-elephant', icon: 'elephant', label: 'elephant', correct: false },
            { id: 'c3s3-cat', icon: 'cat', label: 'cat', correct: true },
          ],
          readAloud: { targetText: 'egg' },
        },
        {
          id: 'c3s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 E를 따라 그리면서 eh 소리를 내보세요!',
          words: [{ text: 'E', say: 'eh' }],
        },
        {
          id: 'c3s3-break',
          kind: 'break',
          instructionKo: '손가락으로 E를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'E',
          repeatAudio: ['E', 'Eddy', 'eh'],
        },
        {
          id: 'c3s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // 쌍둥이 개념 2회차 간격 복습 -- 이 챕터에서 가장 어려운 개념이다.
          instructionKo: 'k-k-k 소리를 내는 글자를 모두 찾아 탭하세요! (두 개예요)',
          options: [
            { id: 'c3s3-K2', icon: 'letterTile', label: 'K', say: 'kuh', correct: true },
            { id: 'c3s3-E2', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
            { id: 'c3s3-C2', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
            { id: 'c3s3-N2', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
          ],
          readAloud: { targetText: 'C', say: 'kuh' },
        },
        {
          id: 'c3s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'eh 소리를 내는 글자를 찾아 탭하세요! (조금 어려워요)',
          promptAudio: 'eh',
          // 혼동 보기는 I 하나 -- 챕터 2 의 /i/ 와 최대 혼동쌍이다.
          options: [
            { id: 'c3s3-E3', icon: 'letterTile', label: 'E', say: 'eh', correct: true },
            { id: 'c3s3-I3', icon: 'letterTile', label: 'I', say: 'iii', correct: false },
            { id: 'c3s3-S3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
          ],
          readAloud: { targetText: 'E', say: 'eh' },
        },
        {
          id: 'c3s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'E',
          options: [
            { id: 'c3s3-egg2', icon: 'egg', label: 'egg', correct: true },
            { id: 'c3s3-cake', icon: 'cake', label: 'cake', correct: false },
            { id: 'c3s3-pot', icon: 'pot', label: 'pot', correct: false },
          ],
          readAloud: { targetText: 'egg' },
        },
        {
          id: 'c3s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['egg', 'elephant', 'ten'],
        },
        {
          id: 'c3s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 공격! E 소리로 크게 외쳐보세요!',
          words: [{ text: 'E', say: 'eh' }, 'egg'],
        },
      ],
      recapKo: 'E는 eh 소리를 내요 — egg, elephant, ten! 그리고 C의 kuh도 기억하고 있어요!',
      recapAudio: {
        ko: '이번엔 새로운 모음 소리예요. 잘 들어보세요.',
        en: ['eh', 'egg', 'elephant', 'ten'],
      },
    },

    {
      id: 'c3-stage-4',
      order: 4,
      title: 'Power of H',
      villain: { name: 'Muddy', art: 'muddy', style: 'dino' },
      hero: { name: 'Huey', art: 'huey', style: 'dino' },
      chapterBoss: false,
      reviewTargets: ['C', 'E'],
      beats: [
        {
          id: 'c3s4-teach',
          kind: 'teach',
          instructionKo: 'H는 허비가 숨을 헉헉 내쉬듯 h-h-h 소리를 내요!',
          art: 'hero',
          letter: 'H',
          repeatAudio: ['H', 'huh', 'H', 'huh'],
        },
        {
          id: 'c3s4-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'h-h-h 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'huh',
          options: [
            { id: 'c3s4-H1', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
            { id: 'c3s4-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
            { id: 'c3s4-S1', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
          ],
        },
        {
          id: 'c3s4-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c3s4-hat', icon: 'hat', label: 'hat', correct: false },
            { id: 'c3s4-hen', icon: 'hen', label: 'hen', correct: false },
            { id: 'c3s4-egg', icon: 'egg', label: 'egg', correct: true },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c3s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 H를 따라 그리면서 h-h-h 소리를 내보세요!',
          words: [{ text: 'H', say: 'huh' }],
        },
        {
          id: 'c3s4-break',
          kind: 'break',
          instructionKo: '손가락으로 H를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'H',
          repeatAudio: ['H', 'Huey', 'huh'],
        },
        {
          id: 'c3s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/h/ 소리로 시작하는 걸 모두 찾아 탭하세요!',
          options: [
            { id: 'c3s4-hat2', icon: 'hat', label: 'hat', correct: true },
            { id: 'c3s4-cat', icon: 'cat', label: 'cat', correct: false },
            { id: 'c3s4-hen2', icon: 'hen', label: 'hen', correct: true },
            { id: 'c3s4-horse', icon: 'horse', label: 'horse', correct: true },
          ],
          readAloud: { targetText: 'horse' },
        },
        {
          id: 'c3s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'h-h-h 소리를 내는 글자를 찾아 탭하세요! (조금 어려워요)',
          promptAudio: 'huh',
          // 혼동 보기는 M 하나 (N 은 warmup 에서 이미 썼다).
          options: [
            { id: 'c3s4-H3', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
            { id: 'c3s4-M3', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
            { id: 'c3s4-E3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
          ],
          readAloud: { targetText: 'H', say: 'huh' },
        },
        {
          id: 'c3s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'H',
          options: [
            { id: 'c3s4-hand', icon: 'hand', label: 'hand', correct: true },
            { id: 'c3s4-net', icon: 'net', label: 'net', correct: false },
            { id: 'c3s4-apple', icon: 'apple', label: 'apple', correct: false },
          ],
          readAloud: { targetText: 'hand' },
        },
        {
          id: 'c3s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          // 보스 단어 'hen' 을 여기서 미리 듣고 말해본다 (조립은 보스에서).
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['hen', 'hat', 'hand'],
        },
        {
          id: 'c3s4-finale-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: 'C, E, H를 빠르게 찾아볼까요?',
          steps: [
            {
              promptAudio: 'kuh',
              options: [
                { id: 'c3s4-qC', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
                { id: 'c3s4-qE', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
                { id: 'c3s4-qH', icon: 'letterTile', label: 'H', say: 'huh', correct: false },
              ],
            },
            {
              promptAudio: 'eh',
              options: [
                { id: 'c3s4-qE2', icon: 'letterTile', label: 'E', say: 'eh', correct: true },
                { id: 'c3s4-qH2', icon: 'letterTile', label: 'H', say: 'huh', correct: false },
                { id: 'c3s4-qC2', icon: 'letterTile', label: 'C', say: 'kuh', correct: false },
              ],
            },
            {
              promptAudio: 'huh',
              options: [
                { id: 'c3s4-qH3', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
                { id: 'c3s4-qC3', icon: 'letterTile', label: 'C', say: 'kuh', correct: false },
                { id: 'c3s4-qE3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c3s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! H 소리로 크게 외쳐보세요!',
          words: [{ text: 'H', say: 'huh' }, 'hen'],
        },
      ],
      recapKo: '이제 C, E, H를 모두 알아요! 케이라, 에디, 허비가 합체할 준비를 해요!',
      recapAudio: {
        ko: '에이치는 이런 소리를 내요. 세 소리를 모두 배웠어요.',
        en: ['huh', 'hat', 'hen', 'hand'],
      },
    },

    {
      id: 'c3-stage-5',
      order: 5,
      title: 'Boss: CAT and HEN!',
      villain: { name: 'Shadow Rex', art: 'shadow-rex', style: 'dino' },
      hero: { name: 'Trike', art: 'trike', style: 'dino' },
      chapterBoss: true,
      reviewTargets: ['C', 'E', 'H'],
      beats: [
        {
          id: 'c3s5-teach',
          kind: 'teach',
          instructionKo: '케이라 + 에디 + 허비가 합체해요! 먼저 cat을 만들어요.',
          emoji: '🐱🐔➡️🦕',
          repeatAudio: ['kuh', 'aaa', 'tuh', 'cat', 'cat'],
        },
        {
          id: 'c3s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'C', say: 'kuh' },
            { text: 'A', say: 'aaa' },
            { text: 'T', say: 'tuh' },
          ],
          target: 'CAT',
        },
        {
          id: 'c3s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [
            { text: 'C', say: 'kuh' },
            { text: 'A', say: 'aaa' },
            { text: 'T', say: 'tuh' },
            'cat',
          ],
        },
        {
          id: 'c3s5-break',
          kind: 'break',
          // 두 번째 단어 hen 의 소리를 여기서 모델링한다.
          instructionKo: '이번엔 hen이에요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['huh', 'eh', 'nnn', 'hen'],
        },
        {
          id: 'c3s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: 'C, E, H를 빠르게 찾아볼까요?',
          steps: [
            {
              promptAudio: 'kuh',
              options: [
                { id: 'c3s5-qC', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
                { id: 'c3s5-qH', icon: 'letterTile', label: 'H', say: 'huh', correct: false },
                { id: 'c3s5-qE', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
              ],
            },
            {
              promptAudio: 'eh',
              options: [
                { id: 'c3s5-qE2', icon: 'letterTile', label: 'E', say: 'eh', correct: true },
                { id: 'c3s5-qC2', icon: 'letterTile', label: 'C', say: 'kuh', correct: false },
                { id: 'c3s5-qH2', icon: 'letterTile', label: 'H', say: 'huh', correct: false },
              ],
            },
            {
              promptAudio: 'huh',
              options: [
                { id: 'c3s5-qH3', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
                { id: 'c3s5-qE3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
                { id: 'c3s5-qC3', icon: 'letterTile', label: 'C', say: 'kuh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c3s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'T', say: 'tuh' },
            { text: 'C', say: 'kuh' },
            { text: 'A', say: 'aaa' },
          ],
          target: 'CAT',
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c3s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c3s5-CAT', icon: 'letterTile', label: 'CAT', correct: true },
            { id: 'c3s5-TAC', icon: 'letterTile', label: 'TAC', correct: false },
            { id: 'c3s5-CTA', icon: 'letterTile', label: 'CTA', correct: false },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c3s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 hen을 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'N', say: 'nnn' },
            { text: 'H', say: 'huh' },
            { text: 'E', say: 'eh' },
          ],
          target: 'HEN',
          readAloud: { targetText: 'hen' },
        },
        {
          id: 'c3s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '트라이케라가 외쳐요! 같이 말해볼까요?',
          words: ['hen'],
        },
        {
          id: 'c3s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! CAT! HEN!',
          words: ['cat', 'hen'],
        },
      ],
      recapKo: 'C-A-T는 CAT, H-E-N은 HEN! 단어 두 개를 만들었어요! 챕터 3 클리어!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['cat', 'hen'],
      },
    },
  ],
}
