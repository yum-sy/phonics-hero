// Chapter 4 (platformer theme): R, M, D -> boss blends "MAT" + "RED".
// Finishes Jolly Phonics Group 2 (chapter 3 did c/k, e, h).
// Beat vocabulary is identical to chapter-01.js -- see that file's header.
//
// Ids are prefixed 'c4' because getStageById() searches every chapter flat.
// 캐릭터 색·외형은 art.js 소유 -- 데이터는 { name, style } 만 준다.
//
// 표시/발화 규칙: 화면에는 실제 글자·단어, 발화에는 소리.
// 이 챕터의 소리 표기: R `rrr` · M `mmm` · D `duh`
//   R = `rrr` -- /r/ 은 지속 가능하므로 반복문자형. 글자 이름 `ar` 과 두 음성
//   모두에서 크게 distinct (Samantha 1.970 vs 0.727, Alex 1.797 vs 0.636).
//   `sss` 와 3회 반복형에서 우연히 근접하지만 1·2·5회에서 갈라지므로 다른 음소다.
//
// --- D 와 B: 소리가 아니라 모양으로 변별시킨다 ---
// Alex 는 `duh` 와 `buh` 를 같은 음소열로 렌더한다(둘 다 0.582630). 게다가 b/d
// 반전은 본래 *글자 모양* 혼동이고 /b/·/d/ 는 둘 다 유성 파열음으로 조음 위치만
// 달라서 5세에게 귀로 변별시키는 건 애초에 약한 연습이다. 그래서 소리 기반
// letterTile 문항(choose/multiselect/choose-sequence)에는 B 를 아예 쓰지 않고,
// D 의 소리 변별 상대로 T(무성/유성 대비)와 P(회전)만 쓴다 -- validateChapters 의
// SPEECH_COLLISION_PAIRS 가 이를 강제한다. b/d 자체는 대신 `match-shape` beat
// (c4s4-r5b-shape) 하나로 순수 시각 변별시킨다 -- 그 beat 은 opt.label 만
// 발화하고 opt.say/optionSpeech() 를 절대 읽지 않으므로 같은 문항에 있어도
// 안전하고, validateChapters 도 match-shape 를 충돌쌍 검사에서 스킵한다.
//
// --- 아이콘 제약 (이 챕터에서 가장 큰 제약) ---
// /r/ 은 `rat`/`ring` 두 개가 생겨서 odd-one-out 과 promptLetter 역방향 문항을
// 만들 수 있다(둘 다 이제 /r/ 문항이다). multiselect 는 같은 첫소리 그림이 2개
// 이상 *정답*으로 필요한데 /r/ 은 딱 2개라 두 문항에서 같은 쌍이 반복되므로,
// 그 슬롯은 앞 챕터 누적 복습으로 남긴다.
// /m/ 은 `moon`+`man`/`mat`/`map` 넷, /d/ 는 `dog`+`duck`/`door` 셋이 되어
// s3·s4 의 '모두 찾기' 슬롯이 드디어 이 챕터의 소리로 성립한다 -- 그 전에는
// 정답 그림을 2개 세울 수 없어서 /k/·/p/ 누적 복습으로 대체돼 있었다.
// s3-r4 = /m/ 정답 3개(man/mat/map) + 오답 net, s4-r4 = /d/ 정답 2개(duck/door)
// + 오답 2개(pig/pot). s4 의 오답을 /p/ 로 고른 것은 이 스테이지가 이미 D↔P
// 회전 혼동을 letterTile 문항(c4s4-r5-hard)에서 다루고 있어서, 그림 문항이
// 같은 대비를 귀로 한 번 더 확인해주기 때문이다.
// `mat` 은 이 챕터의 보스 단어이므로 s3-r4 의 정답에 넣어 미리 붙여둔다.

export const chapter4 = {
  id: 'chapter-4',
  order: 4,
  title: 'Pixel Kingdom Passage',
  stages: [
    {
      id: 'c4-stage-1',
      order: 1,
      title: 'The Running Sound',
      villain: { name: 'Flippy', art: 'flippy', style: 'creature' },
      hero: { name: 'Rocket', art: 'rocket', style: 'creature' },
      chapterBoss: false,
      beats: [
        {
          id: 'c4s1-teach',
          kind: 'teach',
          instructionKo: '로켓런이 달릴 때 나는 소리예요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['rrr'],
        },
        {
          id: 'c4s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          // /r/ 그림이 0개라 아이콘이 필요 없는 beat 로 /r/ 를 나른다.
          instructionKo: 'rrr 소리로 시작하는 단어예요! 따라 말해보세요.',
          words: ['rat', 'ring'],
        },
        {
          id: 'c4s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['rrr'],
        },
        {
          id: 'c4s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c4s1-rat', icon: 'rat', label: 'rat', correct: false },
            { id: 'c4s1-dog', icon: 'dog', label: 'dog', correct: true },
            { id: 'c4s1-ring', icon: 'ring', label: 'ring', correct: false },
          ],
          readAloud: { targetText: 'rat' },
        },
        {
          id: 'c4s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"cat"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'cat',
          options: [
            { id: 'c4s1-egg', icon: 'egg', label: 'egg', correct: false },
            { id: 'c4s1-pin', icon: 'pin', label: 'pin', correct: false },
            { id: 'c4s1-cake', icon: 'cake', label: 'cake', correct: true },
          ],
          readAloud: { targetText: 'cake' },
        },
        {
          id: 'c4s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/e/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c4s1-egg2', icon: 'egg', label: 'egg', correct: true },
            { id: 'c4s1-moon', icon: 'moon', label: 'moon', correct: false },
            { id: 'c4s1-elephant', icon: 'elephant', label: 'elephant', correct: true },
            { id: 'c4s1-dog2', icon: 'dog', label: 'dog', correct: false },
          ],
          readAloud: { targetText: 'egg' },
        },
        {
          id: 'c4s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['red', 'run'],
        },
        {
          id: 'c4s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['rat'],
        },
      ],
      recapKo: '/r/ 소리를 찾았어요! Rat, ring, red, run — 모두 rrr로 시작해요!',
      recapAudio: {
        ko: '아르 소리를 찾았어요! 잘 들어보세요.',
        en: ['rrr', 'rat', 'ring', 'red'],
      },
    },

    {
      id: 'c4-stage-2',
      order: 2,
      title: 'Power of R',
      villain: { name: 'Slippy', art: 'slippy', style: 'creature' },
      hero: { name: 'Rocket', art: 'rocket', style: 'creature' },
      chapterBoss: false,
      beats: [
        {
          id: 'c4s2-teach',
          kind: 'teach',
          instructionKo: 'R은 로켓런의 엔진처럼 rrr 소리를 내요!',
          art: 'hero',
          letter: 'R',
          repeatAudio: ['R', 'rrr'],
        },
        {
          id: 'c4s2-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'rrr 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'rrr',
          options: [
            { id: 'c4s2-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
            { id: 'c4s2-R1', icon: 'letterTile', label: 'R', say: 'rrr', correct: true },
            { id: 'c4s2-T1', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
          ],
        },
        {
          id: 'c4s2-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c4s2-net', icon: 'net', label: 'net', correct: true },
            { id: 'c4s2-ring', icon: 'ring', label: 'ring', correct: false },
            { id: 'c4s2-rat', icon: 'rat', label: 'rat', correct: false },
          ],
          readAloud: { targetText: 'ring' },
        },
        {
          id: 'c4s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 R을 따라 그리면서 rrr 소리를 내보세요!',
          words: [{ text: 'R', say: 'rrr' }],
        },
        {
          id: 'c4s2-break',
          kind: 'break',
          instructionKo: '손가락으로 R을 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'R',
          repeatAudio: ['R', 'rrr'],
        },
        {
          id: 'c4s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // 챕터 3 의 H 는 그림 문항이 하나도 없었다 -- 이제 아이콘이 생겼으니
          // 여기서 /h/ 를 그림으로 복습한다.
          instructionKo: '/h/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c4s2-hat', icon: 'hat', label: 'hat', correct: true },
            { id: 'c4s2-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c4s2-hen', icon: 'hen', label: 'hen', correct: true },
            { id: 'c4s2-horse', icon: 'horse', label: 'horse', correct: true },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c4s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'rrr 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'rrr',
          // 혼동 보기는 L 하나 -- /r/ 와 /l/ 은 한국어 화자에게 최대 난점이다.
          options: [
            { id: 'c4s2-L3', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
            { id: 'c4s2-T3', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c4s2-R3', icon: 'letterTile', label: 'R', say: 'rrr', correct: true },
          ],
          readAloud: { targetText: 'R', say: 'rrr' },
        },
        {
          id: 'c4s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'R',
          options: [
            { id: 'c4s2-rat2', icon: 'rat', label: 'rat', correct: true },
            { id: 'c4s2-moon', icon: 'moon', label: 'moon', correct: false },
            { id: 'c4s2-pot', icon: 'pot', label: 'pot', correct: false },
          ],
          readAloud: { targetText: 'rat' },
        },
        {
          id: 'c4s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['rat', 'ring', 'red'],
        },
        {
          id: 'c4s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 공격! R 소리로 크게 외쳐보세요!',
          words: [{ text: 'R', say: 'rrr' }, 'rat'],
        },
      ],
      recapKo: 'R은 rrr 소리를 내요 — rat, ring, red! 혀를 굴려서 rrr!',
      recapAudio: {
        ko: '아르는 이런 소리를 내요. 혀를 굴려보세요.',
        en: ['rrr', 'rat', 'ring', 'red'],
      },
    },

    {
      id: 'c4-stage-3',
      order: 3,
      title: 'Power of M',
      villain: { name: 'Grabby', art: 'grabby', style: 'creature' },
      hero: { name: 'Magno', art: 'magno', style: 'creature' },
      chapterBoss: false,
      reviewTargets: ['S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M'],
      beats: [
        {
          id: 'c4s3-teach',
          kind: 'teach',
          instructionKo: 'M은 마그넷몬의 자석이 붙을 때처럼 mmm 소리를 내요!',
          art: 'hero',
          letter: 'M',
          repeatAudio: ['M', 'mmm'],
        },
        {
          id: 'c4s3-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'mmm 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'mmm',
          // 혼동 보기는 N 하나 -- M/N 은 획 수 차이로 최대 혼동쌍이다.
          options: [
            { id: 'c4s3-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
            { id: 'c4s3-T1', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c4s3-M1', icon: 'letterTile', label: 'M', say: 'mmm', correct: true },
          ],
        },
        {
          id: 'c4s3-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // moon 을 "다른 하나" 로 두어 /m/ 을 그림으로 한 번 들려준다.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c4s3-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c4s3-moon', icon: 'moon', label: 'moon', correct: true },
            { id: 'c4s3-pen', icon: 'pen', label: 'pen', correct: false },
          ],
          readAloud: { targetText: 'pig' },
        },
        {
          id: 'c4s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 M을 따라 그리면서 mmm 소리를 내보세요!',
          words: [{ text: 'M', say: 'mmm' }],
        },
        {
          id: 'c4s3-break',
          kind: 'break',
          instructionKo: '손가락으로 M을 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'M',
          repeatAudio: ['M', 'mmm'],
        },
        {
          id: 'c4s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // 오답을 net 으로 둔다 -- 이 스테이지는 M/N 을 계속 맞붙이고 있다
          // (warmup 의 혼동 보기도 N, r6 의 오답도 net/nose). 무작위 오답이면
          // 그림 이름 대기 문항이 되지만, /n/ 오답은 실제 소리 변별을 묻는다.
          instructionKo: '/m/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c4s3-man', icon: 'man', label: 'man', correct: true },
            { id: 'c4s3-net2', icon: 'net', label: 'net', correct: false },
            { id: 'c4s3-mat', icon: 'mat', label: 'mat', correct: true },
            { id: 'c4s3-map', icon: 'map', label: 'map', correct: true },
          ],
          readAloud: { targetText: 'mat' },
        },
        {
          id: 'c4s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'mmm 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'mmm',
          // 혼동 보기는 R 하나 -- 방금 배운 글자이고 /m/ 처럼 지속음이다.
          options: [
            { id: 'c4s3-M3', icon: 'letterTile', label: 'M', say: 'mmm', correct: true },
            { id: 'c4s3-R3', icon: 'letterTile', label: 'R', say: 'rrr', correct: false },
            { id: 'c4s3-S3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
          ],
          readAloud: { targetText: 'M', say: 'mmm' },
        },
        {
          id: 'c4s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답을 /n/ 으로 둔다 -- /m/ 과 /n/ 은 둘 다 비음이라 진짜 근접쌍이고,
          // N 은 챕터 2 에서 이미 배운 글자다. 무작위 오답(hat/ten)이면 이 문항은
          // "moon 을 아는가" 만 묻지만, 이렇게 하면 실제 소리 변별을 묻는다.
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'M',
          options: [
            { id: 'c4s3-net', icon: 'net', label: 'net', correct: false },
            { id: 'c4s3-moon2', icon: 'moon', label: 'moon', correct: true },
            { id: 'c4s3-nose', icon: 'nose', label: 'nose', correct: false },
          ],
          readAloud: { targetText: 'moon' },
        },
        {
          id: 'c4s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['moon', 'man', 'mat'],
        },
        {
          id: 'c4s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'mat' 사전 노출 (조립은 보스에서).
          instructionKo: '마지막 공격! M 소리로 크게 외쳐보세요!',
          words: [{ text: 'M', say: 'mmm' }, 'mat'],
        },
      ],
      recapKo: 'M은 mmm 소리를 내요 — moon, man, mat! R의 rrr도 기억하고 있어요!',
      recapAudio: {
        ko: '엠은 이런 소리를 내요. 아르 소리도 기억하고 있어요.',
        en: ['mmm', 'moon', 'man', 'mat'],
      },
    },

    {
      id: 'c4-stage-4',
      order: 4,
      title: 'Power of D',
      villain: { name: 'Corky', art: 'corky', style: 'creature' },
      hero: { name: 'Drillo', art: 'drillo', style: 'creature' },
      chapterBoss: false,
      reviewTargets: ['S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M', 'D'],
      beats: [
        {
          id: 'c4s4-teach',
          kind: 'teach',
          instructionKo: 'D는 드릴돌이가 땅을 파듯 duh 소리를 내요!',
          art: 'hero',
          letter: 'D',
          repeatAudio: ['D', 'duh'],
        },
        {
          id: 'c4s4-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'duh 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'duh',
          // 혼동 보기는 T 하나 -- /t/ 와 /d/ 는 무성/유성 대비로 유용하다.
          // B 는 절대 넣지 않는다 (SPEECH_COLLISION_PAIRS 참조).
          options: [
            { id: 'c4s4-T1', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c4s4-S1', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c4s4-D1', icon: 'letterTile', label: 'D', say: 'duh', correct: true },
          ],
        },
        {
          id: 'c4s4-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // dog 을 "다른 하나" 로 두어 /d/ 를 그림으로 들려준다.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c4s4-egg', icon: 'egg', label: 'egg', correct: false },
            { id: 'c4s4-dog', icon: 'dog', label: 'dog', correct: true },
            { id: 'c4s4-elephant', icon: 'elephant', label: 'elephant', correct: false },
          ],
          readAloud: { targetText: 'egg' },
        },
        {
          id: 'c4s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 D를 따라 그리면서 duh 소리를 내보세요!',
          words: [{ text: 'D', say: 'duh' }],
        },
        {
          id: 'c4s4-break',
          kind: 'break',
          instructionKo: '손가락으로 D를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'D',
          repeatAudio: ['D', 'duh'],
        },
        {
          id: 'c4s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // /d/ 그림은 dog·duck·door 셋인데 dog 은 이미 r2(정답)와 r6(정답)에
          // 쓰였다. 세 문항 모두 같은 그림이 되지 않게 여기서는 새 그림 둘만
          // 정답으로 세우고, 오답은 /p/ 로 둔다 -- r5-hard 가 D↔P 를 letterTile
          // 로 대비시키는 것과 같은 대비를 그림으로 한 번 더 준다.
          instructionKo: '/d/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c4s4-duck', icon: 'duck', label: 'duck', correct: true },
            { id: 'c4s4-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c4s4-door', icon: 'door', label: 'door', correct: true },
            { id: 'c4s4-pot', icon: 'pot', label: 'pot', correct: false },
          ],
          readAloud: { targetText: 'duck' },
        },
        {
          id: 'c4s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'duh 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'duh',
          // 혼동 보기는 P 하나 (회전 혼동). B 는 여기에도 넣지 않는다.
          options: [
            { id: 'c4s4-D3', icon: 'letterTile', label: 'D', say: 'duh', correct: true },
            { id: 'c4s4-P3', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
            { id: 'c4s4-M3', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
          ],
          readAloud: { targetText: 'D', say: 'duh' },
        },
        {
          id: 'c4s4-r5b-shape',
          kind: 'match-shape',
          scored: true,
          hits: 1,
          // 소리 문항이 아니다 -- b/d 는 좌우 대칭이라 소리로는 절대 변별시키지
          // 않는다(validateChapters 의 SPEECH_COLLISION_PAIRS, screens.js 의
          // renderMatchShapeBeat 코멘트 참조). 방금 D 를 소리로 배웠으니 이제
          // 눈으로 D 와 B 를 구분하는 연습을 한다. say 필드는 넣지 않는다 --
          // match-shape 는 opt.label 만 발화하고 opt.say/optionSpeech() 를
          // 절대 읽지 않는다.
          instructionKo: '똑같이 생긴 글자를 찾아보세요!',
          promptLetter: 'd',
          options: [
            { id: 'c4s4-shape-b', icon: 'letterTile', label: 'b', correct: false },
            { id: 'c4s4-shape-p', icon: 'letterTile', label: 'p', correct: false },
            { id: 'c4s4-shape-d', icon: 'letterTile', label: 'd', correct: true },
          ],
          readAloud: { targetText: 'd' },
        },
        {
          id: 'c4s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'D',
          options: [
            { id: 'c4s4-dog2', icon: 'dog', label: 'dog', correct: true },
            { id: 'c4s4-moon2', icon: 'moon', label: 'moon', correct: false },
            { id: 'c4s4-egg2', icon: 'egg', label: 'egg', correct: false },
          ],
          readAloud: { targetText: 'dog' },
        },
        {
          id: 'c4s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['dog', 'dad', 'red'],
        },
        {
          id: 'c4s4-finale-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!',
          steps: [
            {
              promptAudio: 'rrr',
              options: [
                { id: 'c4s4-qM', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
                { id: 'c4s4-qD', icon: 'letterTile', label: 'D', say: 'duh', correct: false },
                { id: 'c4s4-qR', icon: 'letterTile', label: 'R', say: 'rrr', correct: true },
              ],
            },
            {
              promptAudio: 'mmm',
              options: [
                { id: 'c4s4-qD2', icon: 'letterTile', label: 'D', say: 'duh', correct: false },
                { id: 'c4s4-qM2', icon: 'letterTile', label: 'M', say: 'mmm', correct: true },
                { id: 'c4s4-qR2', icon: 'letterTile', label: 'R', say: 'rrr', correct: false },
              ],
            },
            {
              promptAudio: 'duh',
              options: [
                { id: 'c4s4-qD3', icon: 'letterTile', label: 'D', say: 'duh', correct: true },
                { id: 'c4s4-qR3', icon: 'letterTile', label: 'R', say: 'rrr', correct: false },
                { id: 'c4s4-qM3', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c4s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'red' 사전 노출 (조립은 보스에서).
          instructionKo: '마지막 공격! D 소리로 크게 외쳐보세요!',
          words: [{ text: 'D', say: 'duh' }, 'red'],
        },
      ],
      recapKo: '이제 R, M, D를 모두 알아요! 로켓런, 마그넷몬, 드릴돌이가 합체할 준비를 해요!',
      recapAudio: {
        ko: '디는 이런 소리를 내요. 세 소리를 모두 배웠어요.',
        en: ['duh', 'dog', 'dad', 'red'],
      },
    },

    {
      id: 'c4-stage-5',
      order: 5,
      title: 'Boss: MAT and RED!',
      villain: { name: 'Pixel Muncher', art: 'pixel-muncher', style: 'creature' },
      hero: { name: 'Captain Red', art: 'captain-red', style: 'creature' },
      chapterBoss: true,
      reviewTargets: ['S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M', 'D'],
      beats: [
        {
          id: 'c4s5-teach',
          kind: 'teach',
          instructionKo: '로켓런 + 마그넷몬 + 드릴돌이가 합체해요! 먼저 mat을 만들어요.',
          repeatAudio: ['mmm', 'aaa', 'tuh', 'mat'],
        },
        {
          id: 'c4s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'M', say: 'mmm' },
            { text: 'A', say: 'aaa' },
            { text: 'T', say: 'tuh' },
          ],
          target: 'MAT',
        },
        {
          id: 'c4s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [
            { text: 'M', say: 'mmm' },
            { text: 'A', say: 'aaa' },
            { text: 'T', say: 'tuh' },
            'mat',
          ],
        },
        {
          id: 'c4s5-break',
          kind: 'break',
          instructionKo: '이번엔 red예요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['rrr', 'eh', 'duh', 'red'],
        },
        {
          id: 'c4s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!',
          steps: [
            {
              promptAudio: 'mmm',
              options: [
                { id: 'c4s5-qR', icon: 'letterTile', label: 'R', say: 'rrr', correct: false },
                { id: 'c4s5-qM', icon: 'letterTile', label: 'M', say: 'mmm', correct: true },
                { id: 'c4s5-qD', icon: 'letterTile', label: 'D', say: 'duh', correct: false },
              ],
            },
            {
              promptAudio: 'rrr',
              options: [
                { id: 'c4s5-qD2', icon: 'letterTile', label: 'D', say: 'duh', correct: false },
                { id: 'c4s5-qM2', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
                { id: 'c4s5-qR2', icon: 'letterTile', label: 'R', say: 'rrr', correct: true },
              ],
            },
            {
              promptAudio: 'duh',
              options: [
                { id: 'c4s5-qM3', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
                { id: 'c4s5-qD3', icon: 'letterTile', label: 'D', say: 'duh', correct: true },
                { id: 'c4s5-qR3', icon: 'letterTile', label: 'R', say: 'rrr', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c4s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'T', say: 'tuh' },
            { text: 'M', say: 'mmm' },
            { text: 'A', say: 'aaa' },
          ],
          target: 'MAT',
          readAloud: { targetText: 'mat' },
        },
        {
          id: 'c4s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c4s5-MAT', icon: 'letterTile', label: 'MAT', correct: true },
            { id: 'c4s5-AMT', icon: 'letterTile', label: 'AMT', correct: false },
            { id: 'c4s5-MTA', icon: 'letterTile', label: 'MTA', correct: false },
          ],
          readAloud: { targetText: 'mat' },
        },
        {
          id: 'c4s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 red를 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'D', say: 'duh' },
            { text: 'R', say: 'rrr' },
            { text: 'E', say: 'eh' },
          ],
          target: 'RED',
          readAloud: { targetText: 'red' },
        },
        {
          id: 'c4s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'red도 천천히 따라 말해보세요.',
          words: [
            { text: 'R', say: 'rrr' },
            { text: 'E', say: 'eh' },
            { text: 'D', say: 'duh' },
            'red',
          ],
        },
        {
          id: 'c4s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! MAT! RED!',
          words: ['mat', 'red'],
        },
      ],
      recapKo: 'M-A-T는 MAT, R-E-D는 RED! 단어 두 개를 만들었어요! 챕터 4 클리어!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['mat', 'red'],
      },
    },
  ],
}
