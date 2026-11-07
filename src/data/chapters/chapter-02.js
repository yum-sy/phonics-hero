// Chapter 2 (superhero theme): I, P, N -> "PIN".
// Continues Jolly Phonics Group 1 after chapter 1's S/A/T. Same beat
// vocabulary as chapter-01.js -- see that file's header for beat.kind docs.
//
// Stage/beat ids are prefixed 'c2' because getStageById() searches every
// chapter flat: 'stage-1'..'stage-5' are already taken by chapter 1.
//
// 캐릭터 시각 정보는 art.js 가 소유한다: 데이터는 name + style(계열)만 주고
// 색·엠블럼·구체적 외형은 넘기지 않는다 (명시 필드가 이름 팔레트를 이기므로
// 여기서 색을 주면 캐릭터 고유색이 커리큘럼 데이터에 덮인다). style 은
// 'superhero' 처럼 계열만 -- art.js 가 더 구체적인 style 로 좁힐 수 있다.
//
// /i/ here is always short i (as in "pin") -- no long-i words anywhere.
// 'nose' appears only as /n/ onset practice, never as a vowel example.
//
// 표시/발화 규칙 (챕터 3+ 작성자용 계약): 화면에는 항상 실제 글자·단어를,
// 발화에는 항상 소리를 -- 둘이 다르면 words[]는 { text: 'I', say: 'ihh' },
// readAloud는 { targetText: 'I', say: 'ihh' }. 화면에 안 나오는
// repeatAudio/promptAudio는 소리 표기('ihh','puh')를 그대로 쓴다.
//
// ---------------------------------------------------------------------------
// 2026-08 구조 개편 (파일럿, 챕터 1-2 한정): 챕터 1 이 S/A/T 세 "Power of X"
// 루프의 beat 뼈대를 서로 다르게 바꾼 것과 같은 작업을 챕터 2 에도 했다 --
// 다만 챕터 2 는 챕터 1 이 새로 만든 그 뼈대 셋을 그대로 재사용하지 않고,
// **다시 독립적으로** 짰다("같은 모양에 글자만 다르다"를 피하는 게 목적이라
// 챕터 1 의 새 뼈대를 복붙해도 실패다). 이번 라운드가 다르게 쓴 것:
//   - I/P/N 은 아이콘 재고가 각각 3~4개라(ink/insect/igloo, pig/pen/pot,
//     net/nut/nose) S(4개)보다는 넉넉하고 A/T(각 2개)보다 훨씬 넉넉하다 --
//     그래서 "다른 소리 찾기(oddoneout)" 라운드를 4지선다로 늘렸다(정답
//     3개 + 오답 1개 성립에 소리별 아이콘 3개가 필요한데 I/P/N 모두 정확히
//     3개씩 있다). CLAUDE.md 의 난이도 곡선 표가 챕터 2 를 표준3/hard4 로
//     계획해둔 것과도 방향이 맞는다(다만 이 파일럿의 주목적은 여전히
//     "beat 종류의 다양성" 이지 보기 개수 튜닝이 아니다).
//   - N 스테이지에 drag-build 를 끌어와 I+P+N 세 글자로 보스 단어 "PIN" 이
//     아닌 **다른 순서의 진짜 단어 "nip"** 를 미리 조립해본다 -- 챕터 1
//     T 스테이지가 "at" 을 미리 조립한 것과 같은 장치이되 다른 단어를 써서
//     "같은 트릭의 복붙"으로 보이지 않게 했고, 조립 순서(N-I-P)가 보스의
//     "P-I-N" 과 달라 아이가 글자 순서를 외우는 게 아니라 실제로 블렌딩
//     하고 있다는 증거가 된다.
//   - P 스테이지에 choose-sequence 2스텝(I/P 변별)을 넣고, N 스테이지에는
//     3스텝(I/P/N 총복습)을 넣었다 -- 챕터 1 은 A 에서 2스텝, T 에서 3스텝을
//     썼는데 여기서는 그 위치를 P/N 으로 옮겨 정확히 같은 진행이 되지
//     않게 했다.
// 정답 보기 위치는 챕터 전체에서 슬롯이 고르게 나오도록 배치했다
// (validateChapters() 의 슬롯 편향 검사 대상).

export const chapter2 = {
  id: 'chapter-2',
  order: 2,
  title: 'Heroes of Riddle City',
  stages: [
    {
      id: 'c2-stage-1',
      order: 1,
      title: 'The Hidden Sound',
      villain: { name: 'Blurry', art: 'blurry', style: 'superhero' },
      hero: { name: 'Inky', art: 'inky', style: 'superhero' },
      chapterBoss: false,
      // 챕터 1 stage-1 재구성(위 chapter-01.js 참고)과 같은 목적이지만
      // 뼈대는 독립적으로 짰다: 챕터 1은 choose-sequence 를 break 뒤로
      // 미루고 multiselect 를 앞으로 당겼는데, 챕터 2는 반대로
      // choose-sequence 를 break보다 **먼저** 배치하고 multiselect 는
      // break 뒤에 그대로 둔다 -- "choose, choose-sequence, break,
      // multiselect" 순서라 챕터 1의 "choose, multiselect, break,
      // choose-sequence" 와 대칭적으로 다르다. break 를 도입 직후에 두던
      // 이전 버전의 작은 차이점(주석 참고)은 이번에 buffer choose 뒤로
      // 옮겨 더 이상 챕터 1과 같은 자리를 쓰지 않는다.
      beats: [
        {
          id: 'c2s1-teach',
          kind: 'teach',
          instructionKo: '히어로가 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['ihh'],
        },
        {
          id: 'c2s1-r1',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c2s1-ink', icon: 'ink', label: 'ink', correct: false },
            { id: 'c2s1-dog', icon: 'dog', label: 'dog', correct: true },
            { id: 'c2s1-insect', icon: 'insect', label: 'insect', correct: false },
          ],
          readAloud: { targetText: 'ink' },
        },
        {
          id: 'c2s1-r2-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '"ink"과 같은 소리로 시작하는 걸 찾아보세요!',
          steps: [
            {
              promptAudio: 'ink',
              options: [
                { id: 'c2s1-igloo2', icon: 'igloo', label: 'igloo', correct: true },
                { id: 'c2s1-moon', icon: 'moon', label: 'moon', correct: false },
                { id: 'c2s1-cup', icon: 'cup', label: 'cup', correct: false },
              ],
            },
            {
              promptAudio: 'ihh',
              options: [
                { id: 'c2s1-car', icon: 'car', label: 'car', correct: false },
                { id: 'c2s1-igloo', icon: 'igloo', label: 'igloo', correct: true },
                { id: 'c2s1-dog2', icon: 'dog', label: 'dog', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c2s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['ihh'],
        },
        {
          id: 'c2s1-r3-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/i/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c2s1-ink2', icon: 'ink', label: 'ink', correct: true },
            { id: 'c2s1-insect3', icon: 'insect', label: 'insect', correct: true },
            { id: 'c2s1-bus', icon: 'bus', label: 'bus', correct: false },
            { id: 'c2s1-igloo3', icon: 'igloo', label: 'igloo', correct: true },
          ],
          readAloud: { targetText: 'insect' },
        },
        {
          id: 'c2s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '들려주는 단어를 하나씩 따라 말해보세요!',
          words: ['ink', 'igloo', 'insect'],
        },
        {
          id: 'c2s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['ink'],
        },
      ],
      recapKo: '/i/ 소리를 찾았어요! Ink, igloo, insect<br>— 모두 I로 시작해요!',
      recapAudio: {
        ko: '아이 소리를 찾았어요! 잘 들어보세요.',
        en: ['ink', 'igloo', 'insect'],
      },
    },

    {
      id: 'c2-stage-2',
      order: 2,
      title: 'Power of I',
      villain: { name: 'Eraser Man', art: 'eraser-man', style: 'superhero' },
      hero: { name: 'Inky', art: 'inky', style: 'superhero' },
      chapterBoss: false,
      beats: [
        {
          id: 'c2s2-teach',
          kind: 'teach',
          instructionKo: 'I는 이런 소리를 내요!',
          art: 'hero',
          letter: 'I',
          repeatAudio: ['I', 'ihh'],
        },
        {
          id: 'c2s2-r1-oddoneout',
          // I 소리 아이콘이 3개(ink/insect/igloo) 다 있어서 다른 소리
          // 찾기를 4지선다로 늘렸다 -- 정답 3개(같은 소리) + 오답 1개.
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요! (보기가 늘었어요)',
          options: [
            { id: 'c2s2-ink', icon: 'ink', label: 'ink', correct: false },
            { id: 'c2s2-insect', icon: 'insect', label: 'insect', correct: false },
            { id: 'c2s2-top', icon: 'top', label: 'top', correct: true },
            { id: 'c2s2-igloo', icon: 'igloo', label: 'igloo', correct: false },
          ],
          readAloud: { targetText: 'insect' },
        },
        {
          id: 'c2s2-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 i를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'i',
          repeatAudio: ['I', 'ihh'],
        },
        {
          id: 'c2s2-r2-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 I를 따라 그리면서 I 소리를 내보세요!',
          words: [{ text: 'I', say: 'ihh' }],
        },
        {
          id: 'c2s2-r3-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/i/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c2s2-ink2', icon: 'ink', label: 'ink', correct: true },
            { id: 'c2s2-insect2', icon: 'insect', label: 'insect', correct: true },
            { id: 'c2s2-top2', icon: 'top', label: 'top', correct: false },
            { id: 'c2s2-igloo2', icon: 'igloo', label: 'igloo', correct: true },
          ],
          readAloud: { targetText: 'ink' },
        },
        {
          id: 'c2s2-r4-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'I',
          options: [
            { id: 'c2s2-igloo3', icon: 'igloo', label: 'igloo', correct: true },
            { id: 'c2s2-dog', icon: 'dog', label: 'dog', correct: false },
            { id: 'c2s2-sun', icon: 'sun', label: 'sun', correct: false },
          ],
          readAloud: { targetText: 'igloo' },
        },
        {
          id: 'c2s2-r5-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['ink', 'igloo', 'insect'],
        },
        {
          id: 'c2s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 공격! I 소리로 크게 외쳐보세요!',
          words: [{ text: 'I', say: 'ihh' }, 'ink'],
        },
      ],
      recapKo: 'I는 I 소리를 내요 — ink, igloo, insect도 모두 기억해요!',
      recapAudio: {
        ko: '아이는 이런 소리를 내요. 따라 말해볼까요?',
        en: ['ink', 'igloo', 'insect'],
      },
    },

    {
      id: 'c2-stage-3',
      order: 3,
      title: 'Power of P',
      villain: { name: 'Stop Man', art: 'stop-man', style: 'superhero' },
      hero: { name: 'Pip', art: 'pip', style: 'superhero' },
      chapterBoss: false,
      reviewTargets: ['S', 'A', 'T', 'I', 'P'],
      beats: [
        {
          id: 'c2s3-teach',
          kind: 'teach',
          instructionKo: 'P는 힘을 쏠 때처럼 P 소리를 내요!',
          art: 'hero',
          letter: 'P',
          repeatAudio: ['P', 'puh'],
        },
        {
          id: 'c2s3-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'P 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'puh',
          options: [
            { id: 'c2s3-P1', icon: 'letterTile', label: 'P', say: 'puh', correct: true },
            { id: 'c2s3-A1', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c2s3-S1', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
          ],
        },
        {
          id: 'c2s3-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 p를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'p',
          repeatAudio: ['puh'],
        },
        {
          id: 'c2s3-r2-quickfire',
          // 지금까지 배운 두 소리(I/P)를 연속으로 변별하는 미니 퀵파이어.
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!',
          steps: [
            {
              promptAudio: 'ihh',
              options: [
                { id: 'c2s3-qP1', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
                { id: 'c2s3-qI1', icon: 'letterTile', label: 'I', say: 'ihh', correct: true },
                { id: 'c2s3-qO1', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
              ],
            },
            {
              promptAudio: 'puh',
              options: [
                { id: 'c2s3-qP2', icon: 'letterTile', label: 'P', say: 'puh', correct: true },
                { id: 'c2s3-qI2', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
                { id: 'c2s3-qS2', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c2s3-r3-oddoneout',
          // P 소리 아이콘도 3개(pig/pen/pot) 다 있어서 4지선다로 늘렸다.
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요! (보기가 늘었어요)',
          options: [
            { id: 'c2s3-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c2s3-pen', icon: 'pen', label: 'pen', correct: false },
            { id: 'c2s3-pot', icon: 'pot', label: 'pot', correct: false },
            { id: 'c2s3-ink', icon: 'ink', label: 'ink', correct: true },
          ],
          readAloud: { targetText: 'pen' },
        },
        {
          id: 'c2s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/p/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c2s3-pot2', icon: 'pot', label: 'pot', correct: true },
            { id: 'c2s3-insect', icon: 'insect', label: 'insect', correct: false },
            { id: 'c2s3-pen2', icon: 'pen', label: 'pen', correct: true },
            { id: 'c2s3-pig2', icon: 'pig', label: 'pig', correct: true },
          ],
          readAloud: { targetText: 'pot' },
        },
        {
          id: 'c2s3-r5-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 P를 따라 그리면서 P 소리를 내보세요!',
          words: [{ text: 'P', say: 'puh' }],
        },
        {
          id: 'c2s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'P',
          options: [
            { id: 'c2s3-insect2', icon: 'insect', label: 'insect', correct: false },
            { id: 'c2s3-sun', icon: 'sun', label: 'sun', correct: false },
            { id: 'c2s3-pig3', icon: 'pig', label: 'pig', correct: true },
          ],
          readAloud: { targetText: 'pig' },
        },
        {
          id: 'c2s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['pig', 'pen', 'pot'],
        },
        {
          id: 'c2s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 공격! P 소리로 크게 외쳐보세요!',
          words: [{ text: 'P', say: 'puh' }, 'pig'],
        },
      ],
      recapKo: 'P는 P 소리를 내요 — 그리고 I의 I 소리도 아직 기억하고 있어요!',
      recapAudio: {
        ko: '피는 이런 소리를 내요. 아이 소리도 기억하고 있어요.',
        en: ['pig', 'pen'],
      },
    },

    {
      id: 'c2-stage-4',
      order: 4,
      title: 'Power of N',
      villain: { name: 'Jumble', art: 'jumble', style: 'superhero' },
      hero: { name: 'Nord', art: 'nord', style: 'superhero' },
      chapterBoss: false,
      reviewTargets: ['S', 'A', 'T', 'I', 'P', 'N'],
      beats: [
        {
          id: 'c2s4-teach',
          kind: 'teach',
          instructionKo: 'N은 그물을 던질 때처럼 N 소리를 내요!',
          art: 'hero',
          letter: 'N',
          repeatAudio: ['N', 'nnn'],
        },
        {
          id: 'c2s4-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 n을 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'n',
          repeatAudio: ['N', 'nnn'],
        },
        {
          id: 'c2s4-r1-oddoneout',
          // N 소리 아이콘도 3개(net/nut/nose) 다 있어서 4지선다로 늘렸다.
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요! (보기가 늘었어요)',
          options: [
            { id: 'c2s4-net', icon: 'net', label: 'net', correct: false },
            { id: 'c2s4-nut', icon: 'nut', label: 'nut', correct: false },
            { id: 'c2s4-igloo', icon: 'igloo', label: 'igloo', correct: true },
            { id: 'c2s4-nose', icon: 'nose', label: 'nose', correct: false },
          ],
          readAloud: { targetText: 'nut' },
        },
        {
          id: 'c2s4-r2-build-warmup',
          // 보스 전용이던 drag-build 를 여기로 끌어왔다. 보스가 조립할
          // "PIN" 과는 다른 순서로 진짜 단어 "nip" 을 미리 만들어본다 --
          // 순서가 다르므로 아이가 글자열을 암기하는 게 아니라 실제로
          // 블렌딩하고 있다는 증거가 된다.
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'N', say: 'nnn' },
            { text: 'I', say: 'ihh' },
            { text: 'P', say: 'puh' },
          ],
          target: 'NIP',
        },
        {
          id: 'c2s4-r3-build',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'P', say: 'puh' },
            { text: 'N', say: 'nnn' },
            { text: 'I', say: 'ihh' },
          ],
          target: 'NIP',
          readAloud: { targetText: 'nip' },
        },
        {
          id: 'c2s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/n/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c2s4-net2', icon: 'net', label: 'net', correct: true },
            { id: 'c2s4-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c2s4-nut2', icon: 'nut', label: 'nut', correct: true },
            { id: 'c2s4-nose2', icon: 'nose', label: 'nose', correct: true },
          ],
          readAloud: { targetText: 'net' },
        },
        {
          id: 'c2s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'N 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'nnn',
          options: [
            { id: 'c2s4-T3', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c2s4-N3', icon: 'letterTile', label: 'N', say: 'nnn', correct: true },
            { id: 'c2s4-I3', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
          ],
          readAloud: { targetText: 'N', say: 'nnn' },
        },
        {
          id: 'c2s4-r6-quickfire',
          // I/P/N 총복습 -- P 스테이지가 2소리만 묻던 것과 달리 이제 세
          // 소리를 전부 묻는다.
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!',
          steps: [
            {
              promptAudio: 'ihh',
              options: [
                { id: 'c2s4-cN1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
                { id: 'c2s4-cP1', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
                { id: 'c2s4-cI1', icon: 'letterTile', label: 'I', say: 'ihh', correct: true },
              ],
            },
            {
              promptAudio: 'puh',
              options: [
                { id: 'c2s4-cI2', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
                { id: 'c2s4-cP2', icon: 'letterTile', label: 'P', say: 'puh', correct: true },
                { id: 'c2s4-cN2', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
              ],
            },
            {
              promptAudio: 'nnn',
              options: [
                { id: 'c2s4-cN3', icon: 'letterTile', label: 'N', say: 'nnn', correct: true },
                { id: 'c2s4-cI3', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
                { id: 'c2s4-cP3', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c2s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['net', 'nut', 'nose'],
        },
        {
          id: 'c2s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! N 소리로 크게 외쳐보세요!',
          words: [{ text: 'N', say: 'nnn' }, 'net'],
        },
      ],
      recapKo: '이제 I, P, N을 모두 알아요! 히어로들이 합체할 준비를 해요!',
      recapAudio: {
        ko: '엔은 이런 소리를 내요. 세 소리를 모두 배웠어요.',
        en: ['net', 'nut', 'nose'],
      },
    },

    {
      id: 'c2-stage-5',
      order: 5,
      title: 'Boss: PIN Combine!',
      villain: { name: 'Shadow King', art: 'shadow-king', style: 'superhero' },
      hero: { name: 'Captain Pin', art: 'captain-pin', style: 'superhero' },
      chapterBoss: true,
      reviewTargets: ['S', 'A', 'T', 'I', 'P', 'N'],
      beats: [
        {
          id: 'c2s5-teach',
          kind: 'teach',
          instructionKo: '세 히어로가 합체해요! 천천히 들어보세요.',
          repeatAudio: ['puh', 'ihh', 'nnn', 'pin'],
        },
        {
          id: 'c2s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'P', say: 'puh' },
            { text: 'I', say: 'ihh' },
            { text: 'N', say: 'nnn' },
          ],
          target: 'PIN',
        },
        {
          id: 'c2s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [
            { text: 'P', say: 'puh' },
            { text: 'I', say: 'ihh' },
            { text: 'N', say: 'nnn' },
            'pin',
          ],
        },
        {
          id: 'c2s5-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['puh', 'ihh', 'nnn', 'pin'],
        },
        {
          id: 'c2s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!',
          steps: [
            {
              promptAudio: 'puh',
              options: [
                { id: 'c2s5-qI', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
                { id: 'c2s5-qP', icon: 'letterTile', label: 'P', say: 'puh', correct: true },
                { id: 'c2s5-qN', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
              ],
            },
            {
              promptAudio: 'ihh',
              options: [
                { id: 'c2s5-qN2', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
                { id: 'c2s5-qP2', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
                { id: 'c2s5-qI2', icon: 'letterTile', label: 'I', say: 'ihh', correct: true },
              ],
            },
            {
              promptAudio: 'nnn',
              options: [
                { id: 'c2s5-qP3', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
                { id: 'c2s5-qN3', icon: 'letterTile', label: 'N', say: 'nnn', correct: true },
                { id: 'c2s5-qI3', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c2s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'N', say: 'nnn' },
            { text: 'P', say: 'puh' },
            { text: 'I', say: 'ihh' },
          ],
          target: 'PIN',
          readAloud: { targetText: 'pin' },
        },
        {
          id: 'c2s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c2s5-PIN', icon: 'letterTile', label: 'PIN', correct: true },
            { id: 'c2s5-IPN', icon: 'letterTile', label: 'IPN', correct: false },
            { id: 'c2s5-NPI', icon: 'letterTile', label: 'NPI', correct: false },
          ],
          readAloud: { targetText: 'pin' },
        },
        {
          id: 'c2s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '단어를 만들고, 큰 소리로 읽어보세요!',
          letters: [
            { text: 'I', say: 'ihh' },
            { text: 'N', say: 'nnn' },
            { text: 'P', say: 'puh' },
          ],
          target: 'PIN',
          readAloud: { targetText: 'pin' },
        },
        {
          id: 'c2s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '히어로가 외쳐요! 같이 말해볼까요?',
          words: ['pin'],
        },
        {
          id: 'c2s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! PIN!',
          words: ['pin', 'pin'],
        },
      ],
      recapKo: 'P-I-N은 PIN! 두 번째 진짜 단어를 만들었어요! 챕터 2 클리어!',
      recapAudio: {
        ko: '세 소리를 합쳐서 두 번째 단어를 만들었어요!',
        en: ['puh', 'ihh', 'nnn', 'pin'],
      },
    },
  ],
}
