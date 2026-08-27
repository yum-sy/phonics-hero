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
// 이 챕터의 소리 표기: C `kuh` · K `kuh` (같은 소리!) · E `eh` · H `huh`
// (하이픈 절단형 `k-k-k` 이 여기 적혀 있었는데 TTS 가 그걸 글자 이름으로 읽는다 --
//  validateChapters 가 지금은 그 패턴을 거부한다. 데이터는 처음부터 `kuh` 였다.)
//
// --- C 와 K 를 어떻게 다루는가 (이 챕터 최대 설계 과제) ---
// Jolly 는 c 와 k 를 같은 /k/ 로 함께 가르치되 **글자꼴은 둘 다** 가르친다.
// 5세에게 위험한 건 "글자가 둘" 자체가 아니라, 둘을 **소리로 변별하게 묻는
// 문항**이다 -- "kuh 소리를 내는 글자는?" 에 C 와 K 를 함께 넣으면 정답이
// 두 개인 답할 수 없는 문제가 되고, 아이는 자기가 틀렸다고 학습한다. 그래서:
//   1. 정방향(소리 -> 글자) 채점 문항에서 C 와 K 를 절대 함께 보기로 두지 않는다.
//   2. 대신 multiselect 에서 **둘 다 정답**으로 제시한다 -- "모두 찾기" 는
//      다대일 대응을 테스트가 아니라 수업으로 바꾼다. c3s2-r4, c3s3-r4.
//   3. C 를 변별시킬 때 상대는 S (c 가 /s/ 로도 읽히는 실제 함정) 나 소리가
//      확실히 다른 글자로만 한다.
//   4. **K 의 글자꼴은 정방향을 우회해서 가르친다** -- c3s2-break 가 `letter: 'K'`
//      로 큰 글자를 띄우고(비채점, 틀릴 수 없는 자리), c3s3-r4b-kreversed 가
//      `promptLetter: 'K'` 역방향으로 인출한다. 역방향은 **글자**를 묻기 때문에
//      소리를 공유해도 정답이 하나다. 이 두 자리가 없던 판에서는 K 가 챕터 3
//      전체에서 큰 글자로 한 번도 나오지 않았고, multiselect 타일 2개뿐이었다
//      (오답 패널티가 없으므로 전부 탭하면 K 를 못 알아봐도 통과됐다).
//   5. **정방향으로 K 를 정답으로 묻는 문항은 일부러 만들지 않는다.** C 를 보기에서
//      빼면 문항 자체는 성립하지만, "kuh 는 K" 와 "kuh 는 C"(c3s2-r5, c3s4 퀵파이어)가
//      5세에게 모순으로 읽힌다. 같은 이유로 c3s4 퀵파이어의 kuh 스텝은 C 만 쓴다.
//   6. 따라서 K 는 `beat.letter` 커리큘럼에 들어간다 -- reviewTargets 는 C 다음에
//      K 를 포함한다(챕터 3~7 전부). 누적 복습 배선 시 주의: **C 와 K 는 동음이라
//      소리 -> 글자 복습 문항을 생성하면 정답이 둘이 된다.** 생성기는 이 쌍을 알아야 한다.
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
          repeatAudio: ['kuh'],
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
          repeatAudio: ['kuh'],
        },
        {
          id: 'c3s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c3s1-ink', icon: 'ink', label: 'ink', correct: true },
            { id: 'c3s1-cake', icon: 'cake', label: 'cake', correct: false },
            { id: 'c3s1-car', icon: 'car', label: 'car', correct: false },
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
            { id: 'c3s1-moon', icon: 'moon', label: 'moon', correct: false },
            { id: 'c3s1-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c3s1-king', icon: 'king', label: 'king', correct: true },
          ],
          readAloud: { targetText: 'king' },
        },
        {
          id: 'c3s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/k/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
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
      recapKo: '/k/ 소리를 찾았어요! Cat, key, cake, king<br>— 모두 C로 시작해요!',
      recapAudio: {
        ko: '씨 소리를 찾았어요! 잘 들어보세요.',
        en: ['cat', 'key', 'cake'],
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
          instructionKo: 'C는 케이라의 발톱처럼 C 소리를 내요!',
          art: 'hero',
          letter: 'C',
          repeatAudio: ['C', 'kuh'],
        },
        {
          id: 'c3s2-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'C 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'kuh',
          // K 는 여기 절대 넣지 않는다 -- C 와 K 는 같은 소리라 정답이 둘이 된다.
          options: [
            { id: 'c3s2-T1', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c3s2-C1', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
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
            { id: 'c3s2-pin', icon: 'pin', label: 'pin', correct: true },
            { id: 'c3s2-cat', icon: 'cat', label: 'cat', correct: false },
            { id: 'c3s2-cake', icon: 'cake', label: 'cake', correct: false },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c3s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 C를 따라 그리면서 C 소리를 내보세요!',
          words: [{ text: 'C', say: 'kuh' }],
        },
        {
          id: 'c3s2-break',
          kind: 'break',
          // **K 의 글자꼴이 소개되는 유일한 자리다.** 이전 판은 `['C','kuh','K','kuh']`
          // 를 발화하면서 letter 를 뺐다(C 만 띄우면 K 발화와 어긋난다는 이유).
          // 그 결과 챕터 3 에서 K 가 **한 번도 큰 글자로 화면에 나오지 않았고**,
          // 아이는 빈 화면에 대고 "씨 kuh 케이 kuh" 를 들었다. C 는 이 스테이지에서
          // 이미 teach(letter 'C')와 r3-trace 로 글자꼴을 두 번 받았으므로,
          // break 는 **새 글자꼴 K** 에 준다. 화면과 발화가 K 로 일치한다.
          //
          // 쌍둥이 사실은 여기서 빠지지 않는다 -- 바로 다음 r4-multiselect 가
          // C 와 K 를 둘 다 정답으로 놓고, 타일을 탭하면 둘 다 'kuh' 를 발화한다
          // (renderMultiselectBeat -> speakTap). 말로 하는 주장보다 강한 시연이고,
          // c3s3-r4 에서 한 번 더 반복되며, 스테이지 recapAudio.ko 가 한국어로
          // 명시한다. instructionKo 는 발화되지 않는 표시 전용 필드다.
          //
          // **소문자 교육 도입(이 라운드) 예외.** 다른 7개 챕터의 break beat 는
          // 이제 소문자 글자꼴을 띄우지만, 여기는 그대로 대문자 'K' 를 유지한다 --
          // 이 자리가 챕터 3 안에서 K 의 글자꼴이 나오는 유일한 곳이라(위 문단),
          // 소문자로 바꾸면 K 가 대문자로 단 한 번도 화면에 나오지 않는다.
          instructionKo: 'C와 쌍둥이인 K예요! 손가락으로 K를 그리면서 함께 외쳐요.',
          art: 'hero',
          letter: 'K',
          repeatAudio: ['K', 'kuh'],
        },
        {
          id: 'c3s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // 쌍둥이를 "모두 찾기" 로 물어 다대일 대응을 수업으로 만든다.
          instructionKo: 'C 소리를 내는 글자를 모두 고르고 ✓를 누르세요! (두 개예요)',
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
          instructionKo: 'C 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'kuh',
          // 혼동 보기는 S 하나 -- c 가 /s/ 로도 읽히는 실제 함정이다.
          options: [
            { id: 'c3s2-S3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c3s2-C3', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
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
            { id: 'c3s2-sun', icon: 'sun', label: 'sun', correct: false },
            { id: 'c3s2-net', icon: 'net', label: 'net', correct: false },
            { id: 'c3s2-cake2', icon: 'cake', label: 'cake', correct: true },
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
      recapKo: 'C는 C 소리를 내요. 그리고 K도 똑같은 K 소리를 내는 쌍둥이예요!',
      recapAudio: {
        ko: '씨와 케이는 소리가 똑같아요. 쌍둥이예요!',
        en: ['cat', 'king'],
      },
    },

    {
      id: 'c3-stage-3',
      order: 3,
      title: 'Power of E',
      villain: { name: 'Upsy', art: 'upsy', style: 'dino' },
      hero: { name: 'Eddy', art: 'eddy', style: 'dino' },
      chapterBoss: false,
      reviewTargets: ['S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E'],
      beats: [
        {
          id: 'c3s3-teach',
          kind: 'teach',
          instructionKo: 'E는 에디가 알에서 나올 때처럼 E 소리를 내요!',
          art: 'hero',
          letter: 'E',
          repeatAudio: ['E', 'eh'],
        },
        {
          id: 'c3s3-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'E 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'eh',
          options: [
            { id: 'c3s3-A1', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c3s3-E1', icon: 'letterTile', label: 'E', say: 'eh', correct: true },
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
            { id: 'c3s3-cat', icon: 'cat', label: 'cat', correct: true },
            { id: 'c3s3-egg', icon: 'egg', label: 'egg', correct: false },
            { id: 'c3s3-elephant', icon: 'elephant', label: 'elephant', correct: false },
          ],
          readAloud: { targetText: 'egg' },
        },
        {
          id: 'c3s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 E를 따라 그리면서 E 소리를 내보세요!',
          words: [{ text: 'E', say: 'eh' }],
        },
        {
          id: 'c3s3-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 e를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'e',
          repeatAudio: ['E', 'eh'],
        },
        {
          id: 'c3s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // 쌍둥이 개념 2회차 간격 복습 -- 이 챕터에서 가장 어려운 개념이다.
          instructionKo: 'C 소리를 내는 글자를 모두 고르고 ✓를 누르세요! (두 개예요)',
          options: [
            { id: 'c3s3-K2', icon: 'letterTile', label: 'K', say: 'kuh', correct: true },
            { id: 'c3s3-E2', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
            { id: 'c3s3-C2', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
            { id: 'c3s3-N2', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
          ],
          readAloud: { targetText: 'C', say: 'kuh' },
        },
        {
          id: 'c3s3-r4b-kreversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // K 가 **글자꼴로 차갑게 인출되는 유일한 문항**이다. 앞의 multiselect 는
          // 타일 4개를 다 탭하면(오답 패널티가 없다) K 를 못 알아봐도 통과되고,
          // 2연속 오답이면 redemonstrateOption 이 남은 정답을 짚어준다 -- 즉 K 의
          // 모양에 주의를 주지 않고도 클리어된다. 역방향은 그게 불가능하다.
          //
          // **역방향이어야 하는 이유**: 정방향("kuh 소리를 내는 글자는?")은 C 가
          // 보기에 있으면 정답이 둘이라 물을 수 없고, C 를 빼면 "kuh 는 K" 와
          // "kuh 는 C"(c3s2-r5, c3s4 퀵파이어)가 서로 모순처럼 보인다. 반대로
          // promptLetter 는 **글자**를 묻기 때문에 소리를 공유해도 정답이 하나다
          // (CLAUDE.md: "보기가 그림인 promptLetter 역방향 문항은 무해하다").
          //
          // 오답은 소리가 확실히 다른 기지 단어로만 한다. cat/cake 를 넣으면
          // "소리는 같은데 글자가 다르다" 를 5세에게 변별시키는 문항이 되어
          // 이 챕터 설계 규칙 3 을 어긴다.
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'K',
          options: [
            { id: 'c3s3-egg3', icon: 'egg', label: 'egg', correct: false },
            { id: 'c3s3-net', icon: 'net', label: 'net', correct: false },
            { id: 'c3s3-key2', icon: 'key', label: 'key', correct: true },
          ],
          readAloud: { targetText: 'key' },
        },
        {
          id: 'c3s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'E 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'eh',
          // 혼동 보기는 I 하나 -- 챕터 2 의 /i/ 와 최대 혼동쌍이다.
          options: [
            { id: 'c3s3-E3', icon: 'letterTile', label: 'E', say: 'eh', correct: true },
            { id: 'c3s3-I3', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
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
            { id: 'c3s3-cake', icon: 'cake', label: 'cake', correct: false },
            { id: 'c3s3-pot', icon: 'pot', label: 'pot', correct: false },
            { id: 'c3s3-egg2', icon: 'egg', label: 'egg', correct: true },
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
      recapKo: 'E는 E 소리를 내요 — egg, elephant, ten! 그리고 C의 C 소리도 기억하고 있어요!',
      recapAudio: {
        ko: '이번엔 새로운 모음 소리예요. 잘 들어보세요.',
        en: ['egg', 'elephant', 'ten'],
      },
    },

    {
      id: 'c3-stage-4',
      order: 4,
      title: 'Power of H',
      villain: { name: 'Muddy', art: 'muddy', style: 'dino' },
      hero: { name: 'Huey', art: 'huey', style: 'dino' },
      chapterBoss: false,
      reviewTargets: ['S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H'],
      beats: [
        {
          id: 'c3s4-teach',
          kind: 'teach',
          instructionKo: 'H는 허비가 숨을 헉헉 내쉬듯 H 소리를 내요!',
          art: 'hero',
          letter: 'H',
          repeatAudio: ['H', 'huh'],
        },
        {
          id: 'c3s4-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'H 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'huh',
          options: [
            { id: 'c3s4-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
            { id: 'c3s4-H1', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
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
            { id: 'c3s4-egg', icon: 'egg', label: 'egg', correct: true },
            { id: 'c3s4-hat', icon: 'hat', label: 'hat', correct: false },
            { id: 'c3s4-hen', icon: 'hen', label: 'hen', correct: false },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c3s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 H를 따라 그리면서 H 소리를 내보세요!',
          words: [{ text: 'H', say: 'huh' }],
        },
        {
          id: 'c3s4-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 h를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'h',
          repeatAudio: ['H', 'huh'],
        },
        {
          id: 'c3s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/h/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
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
          instructionKo: 'H 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'huh',
          // 혼동 보기는 S 하나 -- /h/ 와 /s/ 는 둘 다 무성 마찰음이라 진짜 근접쌍이고,
          // S 는 챕터 1 에서 이미 배운 글자다 (N 은 warmup 에서 이미 썼다).
          options: [
            { id: 'c3s4-S3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c3s4-H3', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
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
            { id: 'c3s4-net', icon: 'net', label: 'net', correct: false },
            { id: 'c3s4-apple', icon: 'apple', label: 'apple', correct: false },
            { id: 'c3s4-hand', icon: 'hand', label: 'hand', correct: true },
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
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!',
          steps: [
            {
              promptAudio: 'kuh',
              options: [
                { id: 'c3s4-qE', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
                { id: 'c3s4-qC', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
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
                { id: 'c3s4-qC3', icon: 'letterTile', label: 'C', say: 'kuh', correct: false },
                { id: 'c3s4-qE3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
                { id: 'c3s4-qH3', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
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
        en: ['hat', 'hen', 'hand'],
      },
    },

    {
      id: 'c3-stage-5',
      order: 5,
      title: 'Boss: CAT and HEN!',
      villain: { name: 'Shadow Rex', art: 'shadow-rex', style: 'dino' },
      hero: { name: 'Trike', art: 'trike', style: 'dino' },
      chapterBoss: true,
      reviewTargets: ['S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H'],
      beats: [
        {
          id: 'c3s5-teach',
          kind: 'teach',
          instructionKo: '케이라 + 에디 + 허비가 합체해요! 먼저 cat을 만들어요.',
          repeatAudio: ['kuh', 'aaa', 'tuh', 'cat'],
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
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!',
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
                { id: 'c3s5-qC2', icon: 'letterTile', label: 'C', say: 'kuh', correct: false },
                { id: 'c3s5-qH2', icon: 'letterTile', label: 'H', say: 'huh', correct: false },
                { id: 'c3s5-qE2', icon: 'letterTile', label: 'E', say: 'eh', correct: true },
              ],
            },
            {
              promptAudio: 'huh',
              options: [
                { id: 'c3s5-qE3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
                { id: 'c3s5-qH3', icon: 'letterTile', label: 'H', say: 'huh', correct: true },
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
          instructionKo: 'hen도 천천히 따라 말해보세요.',
          words: [
            { text: 'H', say: 'huh' },
            { text: 'E', say: 'eh' },
            { text: 'N', say: 'nnn' },
            'hen',
          ],
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
