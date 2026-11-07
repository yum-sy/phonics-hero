// Chapter 12 (Carbot-flavored transforming-vehicle robots -- the family's
// 2nd appearance, world 1's chapter 1 was the first, per the reassignment
// recorded in HANDOFF.md §-1: chapter 8 was originally slated for this
// family and moved to Marvel, with the robot infrastructure carried forward
// to this slot instead): TH, QU, OU -> boss blends "THIN" + "OUT". Continues
// Jolly Phonics Group 6 (finishes it with TH) and opens Group 7 (QU, OU).
// Structure follows the chapter-07/08/9/10/11 template, skipping the middle
// new letter (QU, stage 3) in the boss word.
//
// ============================================================================
// 소리 표기 -- SOUND_TABLE(Group 6/7) 조회
// ============================================================================
// TH(무성, /th/ thin) -> 'thhu' (593/563ms). **유성 TH(/dh/, this)는 표기가
// 없다** -- SOUND_TABLE 의 해당 행이 `say: null`로 명시돼 있다(후보 7종 전부
// 탈락, 이유: 낱자 이름 나열로 접히거나 표기 속의 d 가 실제 /d/로 들려서
// "TH는 duh 소리"를 가르치게 된다). 그래서 이 챕터는 **무성 TH만 낱소리로
// 드릴**하고, 유성 TH는 this/that처럼 **단어로만** 노출한다(표의 권고 그대로).
// QU -> 'kw' (922/1112ms). OU -> 'ou' (617/506ms). 전부 'clean' 등급.
//
// ============================================================================
// 아이콘 재고 -- 세 소리 전부 그림 재고 0
// ============================================================================
// icons.js 69종 어디에도 thumb/thorn(TH), queen/quilt(QU), house/mouse/cloud
// (OU) 가 없다. 챕터 9와 같은 처방 -- 새 소리는 words[]로만 노출하고, 그림이
// 필요한 자리는 누적 복습으로 채운다.
//
// 필요한 새 아이콘: thumb, thorn (TH), queen, quilt (QU), house, mouse, cloud
// (OU)
//
// ============================================================================
// 계열: 카봇(robots.js), 2회차 재사용
// ============================================================================
// 히어로/빌런 이름은 HANDOFF.md §-1 이 이 슬롯으로 이전하라고 지목한 팔레트
// 작업(nitro/speedy/stormer/rustbot)을 그대로 쓴다. 구조는 챕터 1과 같은
// heroRobot/villainRobot(+HERO_VARIANTS/VILLAIN_VARIANTS)이고, 어떤 변주를
// 쓸지(wedge/spoiler-wide/... 등)는 art.js 팔레트가 배정한다 -- 데이터는
// style만 'robot'/'robot-deluxe'로 남긴다.
//
// ============================================================================
// 보스 단어: THIN (TH+I+N) · OUT (OU+T) -- QU는 보스에서 조립하지 않는다
// ============================================================================
// 가운데 새 글자(QU, stage3)를 뺀다. THIN은 TH가 어두인 3슬롯 단어(I·N은 이미
// 기지), OUT은 OU가 어두인 2슬롯 단어(T는 챕터 1에서 기지) -- 챕터 8의 TIE와
// 같은 슬롯 2개 계급이다. QU는 finale 보너스로 'quiz'(Z가 챕터 9에서 이미
// 기지라 자연스러운 회수다)를 노출한다.

export const chapter12 = {
  id: 'chapter-12',
  order: 12,
  title: 'Gearford City Returns',
  stages: [
    {
      id: 'c12-stage-1',
      order: 1,
      title: 'A Rasping Sound',
      villain: { name: 'Rustbot', art: 'rustbot', style: 'robot' },
      hero: { name: 'Nitro', art: 'nitro', style: 'robot' },
      chapterBoss: false,
      beats: [
        {
          id: 'c12s1-teach',
          kind: 'teach',
          instructionKo: '히어로가 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['thhu'],
        },
        {
          id: 'c12s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '이 소리가 들어있는 단어예요! 따라 말해보세요.',
          words: ['thin', 'thud'],
        },
        {
          id: 'c12s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['thhu'],
        },
        {
          id: 'c12s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"cat"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'kuh',
          options: [
            { id: 'c12s1-cat7', icon: 'cat', label: 'cat', correct: true },
            { id: 'c12s1-net12', icon: 'net', label: 'net', correct: false },
            { id: 'c12s1-fan11', icon: 'fan', label: 'fan', correct: false },
            { id: 'c12s1-hat10', icon: 'hat', label: 'hat', correct: false },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c12s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"box"과 같은 소리로 끝나는 걸 찾아보세요!',
          promptAudio: 'ksuh',
          options: [
            { id: 'c12s1-mat6', icon: 'mat', label: 'mat', correct: false },
            { id: 'c12s1-box9', icon: 'box', label: 'box', correct: true },
            { id: 'c12s1-hen3', icon: 'hen', label: 'hen', correct: false },
            { id: 'c12s1-cup12', icon: 'cup', label: 'cup', correct: false },
          ],
          readAloud: { targetText: 'box' },
        },
        {
          id: 'c12s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/r/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c12s1-rat5', icon: 'rat', label: 'rat', correct: true },
            { id: 'c12s1-lion3', icon: 'lion', label: 'lion', correct: false },
            { id: 'c12s1-ring3', icon: 'ring', label: 'ring', correct: true },
            { id: 'c12s1-leg4', icon: 'leg', label: 'leg', correct: false },
            { id: 'c12s1-rain3', icon: 'rain', label: 'rain', correct: true },
          ],
          readAloud: { targetText: 'rat' },
        },
        {
          id: 'c12s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['thud', 'thin'],
        },
        {
          id: 'c12s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['thin'],
        },
      ],
      recapKo: '새로운 소리를 찾았어요! Thin, thud — 둘 다 이 소리가 들어있어요!',
      recapAudio: {
        ko: '새로운 소리를 배웠어요. 잘 들어보세요.',
        en: ['thin', 'thud'],
      },
    },

    {
      id: 'c12-stage-2',
      order: 2,
      title: 'Power of TH',
      villain: { name: 'Grindbot', art: 'grindbot', style: 'robot' },
      hero: { name: 'Nitro', art: 'nitro', style: 'robot' },
      chapterBoss: false,
      beats: [
        {
          id: 'c12s2-teach',
          kind: 'teach',
          instructionKo: '엔진이 식는 소리처럼 TH 소리를 내요!',
          art: 'hero',
          letter: 'TH',
          repeatAudio: ['thhu'],
        },
        {
          id: 'c12s2-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: T(TH의 첫 요소)와 F(조음 위치가 가까운 마찰음).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'thhu',
          options: [
            { id: 'c12s2-T1', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c12s2-F1', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
            { id: 'c12s2-TH1', icon: 'letterTile', label: 'TH', say: 'thhu', correct: true },
          ],
        },
        {
          id: 'c12s2-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"jam"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'juh',
          options: [
            { id: 'c12s2-gum5', icon: 'gum', label: 'gum', correct: false },
            { id: 'c12s2-horse4', icon: 'horse', label: 'horse', correct: false },
            { id: 'c12s2-fan12', icon: 'fan', label: 'fan', correct: false },
            { id: 'c12s2-jam3', icon: 'jam', label: 'jam', correct: true },
          ],
          readAloud: { targetText: 'jam' },
        },
        {
          id: 'c12s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 TH를 따라 그리면서 소리를 내보세요!',
          trace: 'upper',
          words: [{ text: 'TH', say: 'thhu' }],
        },
        {
          id: 'c12s2-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 th를 그려볼까요? 함께 외쳐요!',
          trace: 'lower',
          art: 'hero',
          letter: 'th',
          repeatAudio: ['thhu'],
        },
        {
          id: 'c12s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/m/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c12s2-man3', icon: 'man', label: 'man', correct: true },
            { id: 'c12s2-net13', icon: 'net', label: 'net', correct: false },
            { id: 'c12s2-mat7', icon: 'mat', label: 'mat', correct: true },
            { id: 'c12s2-box10', icon: 'box', label: 'box', correct: false },
            { id: 'c12s2-map3', icon: 'map', label: 'map', correct: true },
          ],
          readAloud: { targetText: 'man' },
        },
        {
          id: 'c12s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개: T(TH의 첫 요소), F(마찰음 계열), D(유성 TH에서 들리는
          // 소리, 착각하기 쉽다), H(TH의 둘째 요소처럼 보이는 글자).
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'thhu',
          options: [
            { id: 'c12s2-T3', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c12s2-TH3', icon: 'letterTile', label: 'TH', say: 'thhu', correct: true },
            { id: 'c12s2-F3b', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
            { id: 'c12s2-D3b', icon: 'letterTile', label: 'D', say: 'duh', correct: false },
            { id: 'c12s2-H3b', icon: 'letterTile', label: 'H', say: 'huh', correct: false },
          ],
          readAloud: { targetText: 'TH', say: 'thhu' },
        },
        {
          id: 'c12s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // TH 그림이 없어 챕터 11의 SH(fish)로 대신 복습한다.
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'SH',
          options: [
            { id: 'c12s2-cup13', icon: 'cup', label: 'cup', correct: false },
            { id: 'c12s2-fish3', icon: 'fish', label: 'fish', correct: true },
            { id: 'c12s2-hat11', icon: 'hat', label: 'hat', correct: false },
            { id: 'c12s2-rat6', icon: 'rat', label: 'rat', correct: false },
          ],
          readAloud: { targetText: 'fish' },
        },
        {
          id: 'c12s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          // 유성 TH(/dh/)는 낱소리 표기가 없다(파일 헤더 참조) -- 단어로만
          // 노출한다. this/that 은 사전에 있는 실제 단어라 발화가 보장된다.
          instructionKo: '이 단어들도 TH 소리가 들어있어요! 따라 말해보세요.',
          words: ['this', 'that'],
        },
        {
          id: 'c12s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'thin' 사전 노출 (TH로 완성, I·N은 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'TH', say: 'thhu' }, 'thin'],
        },
      ],
      recapKo: 'TH는 엔진이 식을 때처럼 소리를 내요 — thin, thud!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 씬, 써드!',
        en: ['thin', 'thud'],
      },
    },

    {
      id: 'c12-stage-3',
      order: 3,
      title: 'Power of QU',
      villain: { name: 'Sparkbot', art: 'sparkbot', style: 'robot' },
      hero: { name: 'Speedy', art: 'speedy', style: 'robot' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH', 'TH', 'QU',
      ],
      beats: [
        {
          id: 'c12s3-teach',
          kind: 'teach',
          instructionKo: '히어로가 바퀴를 굴리며 QU 소리를 내요!',
          art: 'hero',
          letter: 'QU',
          repeatAudio: ['kw'],
        },
        {
          id: 'c12s3-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: K(QU를 구성하는 첫 소리)와 W(둘째 소리).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'kw',
          options: [
            { id: 'c12s3-QU1', icon: 'letterTile', label: 'QU', say: 'kw', correct: true },
            { id: 'c12s3-K1', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
            { id: 'c12s3-W1b', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
          ],
        },
        {
          id: 'c12s3-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // QU 그림이 0개라 그림 문항은 누적 복습으로 채운다.
          instructionKo: '"gift"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'guh',
          options: [
            { id: 'c12s3-top6', icon: 'top', label: 'top', correct: false },
            { id: 'c12s3-net14', icon: 'net', label: 'net', correct: false },
            { id: 'c12s3-hen4', icon: 'hen', label: 'hen', correct: false },
            { id: 'c12s3-gift4', icon: 'gift', label: 'gift', correct: true },
          ],
          readAloud: { targetText: 'gift' },
        },
        {
          id: 'c12s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 QU를 따라 그리면서 소리를 내보세요!',
          trace: 'upper',
          words: [{ text: 'QU', say: 'kw' }],
        },
        {
          id: 'c12s3-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 qu를 그려볼까요? 함께 외쳐요!',
          trace: 'lower',
          art: 'hero',
          letter: 'qu',
          repeatAudio: ['kw'],
        },
        {
          id: 'c12s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/f/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c12s3-fish4', icon: 'fish', label: 'fish', correct: true },
            { id: 'c12s3-cat8', icon: 'cat', label: 'cat', correct: false },
            { id: 'c12s3-fan13', icon: 'fan', label: 'fan', correct: true },
            { id: 'c12s3-net15', icon: 'net', label: 'net', correct: false },
            { id: 'c12s3-fork2', icon: 'fork', label: 'fork', correct: true },
          ],
          readAloud: { targetText: 'fish' },
        },
        {
          id: 'c12s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개: QU를 구성하는 K/W, 그리고 조음이 가까운 V/G.
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'kw',
          options: [
            { id: 'c12s3-QU3', icon: 'letterTile', label: 'QU', say: 'kw', correct: true },
            { id: 'c12s3-K3', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
            { id: 'c12s3-W3', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
            { id: 'c12s3-V3b', icon: 'letterTile', label: 'V', say: 'vve', correct: false },
            { id: 'c12s3-G3b', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
          ],
          readAloud: { targetText: 'QU', say: 'kw' },
        },
        {
          id: 'c12s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 챕터 11의 X(box)로 대신 복습한다.
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'X',
          options: [
            { id: 'c12s3-cup14', icon: 'cup', label: 'cup', correct: false },
            { id: 'c12s3-box11', icon: 'box', label: 'box', correct: true },
            { id: 'c12s3-mat8', icon: 'mat', label: 'mat', correct: false },
            { id: 'c12s3-fan14', icon: 'fan', label: 'fan', correct: false },
          ],
          readAloud: { targetText: 'box' },
        },
        {
          id: 'c12s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['quiz', 'quack'],
        },
        {
          id: 'c12s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // QU는 가운데 새 글자라 보스에서 조립하지 않는다(파일 헤더 참조).
          // 보너스 단어 'quiz' -- Z가 챕터 9에서 이미 기지라 자연스러운 회수다.
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'QU', say: 'kw' }, 'quiz'],
        },
      ],
      recapKo: 'QU는 바퀴가 구르는 것처럼 소리를 내요 — quiz, quack!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 퀴즈, 쾍!',
        en: ['quiz', 'quack'],
      },
    },

    {
      id: 'c12-stage-4',
      order: 4,
      title: 'Power of OU',
      villain: { name: 'Fumebot', art: 'fumebot', style: 'robot' },
      hero: { name: 'Stormer', art: 'stormer', style: 'robot' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH', 'TH', 'QU', 'OU',
      ],
      beats: [
        {
          id: 'c12s4-teach',
          kind: 'teach',
          instructionKo: '히어로가 연기를 뿜으며 OU 소리를 크게 내요!',
          art: 'hero',
          letter: 'OU',
          repeatAudio: ['ou'],
        },
        {
          id: 'c12s4-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: OA/O(둥근 모음 계열이라 OU와 헷갈리기 쉽다).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'ou',
          options: [
            { id: 'c12s4-OA1', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c12s4-OU1', icon: 'letterTile', label: 'OU', say: 'ou', correct: true },
            { id: 'c12s4-O1', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
          ],
        },
        {
          id: 'c12s4-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"leg"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'lll',
          options: [
            { id: 'c12s4-net16', icon: 'net', label: 'net', correct: false },
            { id: 'c12s4-duck5', icon: 'duck', label: 'duck', correct: false },
            { id: 'c12s4-ten4', icon: 'ten', label: 'ten', correct: false },
            { id: 'c12s4-leg5', icon: 'leg', label: 'leg', correct: true },
          ],
          readAloud: { targetText: 'leg' },
        },
        {
          id: 'c12s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 OU를 따라 그리면서 소리를 내보세요!',
          trace: 'upper',
          words: [{ text: 'OU', say: 'ou' }],
        },
        {
          id: 'c12s4-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 ou를 그려볼까요? 함께 외쳐요!',
          trace: 'lower',
          art: 'hero',
          letter: 'ou',
          repeatAudio: ['ou'],
        },
        {
          id: 'c12s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/k/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c12s4-cat9', icon: 'cat', label: 'cat', correct: true },
            { id: 'c12s4-gum6', icon: 'gum', label: 'gum', correct: false },
            { id: 'c12s4-cup15', icon: 'cup', label: 'cup', correct: true },
            { id: 'c12s4-gift5', icon: 'gift', label: 'gift', correct: false },
            { id: 'c12s4-cake5', icon: 'cake', label: 'cake', correct: true },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c12s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'ou',
          options: [
            { id: 'c12s4-OA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c12s4-O3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c12s4-OO3', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
            { id: 'c12s4-OR3', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
            { id: 'c12s4-OU3', icon: 'letterTile', label: 'OU', say: 'ou', correct: true },
          ],
          readAloud: { targetText: 'OU', say: 'ou' },
        },
        {
          id: 'c12s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'OO',
          options: [
            { id: 'c12s4-net17', icon: 'net', label: 'net', correct: false },
            { id: 'c12s4-moon4', icon: 'moon', label: 'moon', correct: true },
            { id: 'c12s4-hat12', icon: 'hat', label: 'hat', correct: false },
            { id: 'c12s4-fan15', icon: 'fan', label: 'fan', correct: false },
          ],
          readAloud: { targetText: 'moon' },
        },
        {
          id: 'c12s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['out', 'loud'],
        },
        {
          id: 'c12s4-r8-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          // 스텝 5개(새 글자 3 + 누적 복습 2). 복습 대상: OA(첫 글자가 같은
          // 다이그래프), O(짧은 모음, OU가 덮어쓸 위험).
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'thhu',
              options: [
                { id: 'c12s4-qT', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
                { id: 'c12s4-qQU', icon: 'letterTile', label: 'QU', say: 'kw', correct: false },
                { id: 'c12s4-qTH', icon: 'letterTile', label: 'TH', say: 'thhu', correct: true },
                { id: 'c12s4-qOU', icon: 'letterTile', label: 'OU', say: 'ou', correct: false },
              ],
            },
            {
              promptAudio: 'kw',
              options: [
                { id: 'c12s4-qOU2', icon: 'letterTile', label: 'OU', say: 'ou', correct: false },
                { id: 'c12s4-qTH2', icon: 'letterTile', label: 'TH', say: 'thhu', correct: false },
                { id: 'c12s4-qK2', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
                { id: 'c12s4-qQU2', icon: 'letterTile', label: 'QU', say: 'kw', correct: true },
              ],
            },
            {
              promptAudio: 'ou',
              options: [
                { id: 'c12s4-qOU3', icon: 'letterTile', label: 'OU', say: 'ou', correct: true },
                { id: 'c12s4-qQU3', icon: 'letterTile', label: 'QU', say: 'kw', correct: false },
                { id: 'c12s4-qTH3', icon: 'letterTile', label: 'TH', say: 'thhu', correct: false },
                { id: 'c12s4-qOA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
              ],
            },
            // 누적 복습 (챕터 7의 OA). OU와 첫 글자가 같은 다이그래프다.
            {
              promptAudio: 'oh',
              options: [
                { id: 'c12s4-qOU4', icon: 'letterTile', label: 'OU', say: 'ou', correct: false },
                { id: 'c12s4-qOA4', icon: 'letterTile', label: 'OA', say: 'oh', correct: true },
                { id: 'c12s4-qTH4', icon: 'letterTile', label: 'TH', say: 'thhu', correct: false },
                { id: 'c12s4-qQU4', icon: 'letterTile', label: 'QU', say: 'kw', correct: false },
              ],
            },
            // 누적 복습 (챕터 5의 O). OU가 덮어쓰는 짧은 모음이다.
            {
              promptAudio: 'awh',
              options: [
                { id: 'c12s4-qQU5', icon: 'letterTile', label: 'QU', say: 'kw', correct: false },
                { id: 'c12s4-qOU5', icon: 'letterTile', label: 'OU', say: 'ou', correct: false },
                { id: 'c12s4-qO5', icon: 'letterTile', label: 'O', say: 'awh', correct: true },
                { id: 'c12s4-qTH5', icon: 'letterTile', label: 'TH', say: 'thhu', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c12s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'out' 사전 노출 (OU로 완성, T는 챕터 1에서 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'OU', say: 'ou' }, 'out'],
        },
      ],
      recapKo: '이제 TH, QU, OU를 모두 알아요! 히어로들이 합체할 준비를 해요!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 이제 세 소리를 모두 배웠어요.',
        en: ['out', 'loud'],
      },
    },

    {
      id: 'c12-stage-5',
      order: 5,
      title: 'Boss: THIN and OUT!',
      villain: { name: 'Overclock', art: 'overclock', style: 'robot' },
      hero: { name: 'Vector Prime', art: 'vector-prime', style: 'robot-deluxe' },
      chapterBoss: true,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH', 'TH', 'QU', 'OU',
      ],
      beats: [
        {
          id: 'c12s5-teach',
          kind: 'teach',
          instructionKo: '세 히어로가 합체해요! 먼저 thin을 만들어요.',
          repeatAudio: ['thhu', 'ihh', 'nnn', 'thin'],
        },
        {
          id: 'c12s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'TH', say: 'thhu' },
            { text: 'I', say: 'ihh' },
            { text: 'N', say: 'nnn' },
          ],
          target: ['TH', 'I', 'N'],
        },
        {
          id: 'c12s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [{ text: 'TH', say: 'thhu' }, { text: 'I', say: 'ihh' }, { text: 'N', say: 'nnn' }, 'thin'],
        },
        {
          id: 'c12s5-break',
          kind: 'break',
          instructionKo: '이번엔 out이에요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['ou', 'tuh', 'out'],
        },
        {
          id: 'c12s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'thhu',
              options: [
                { id: 'c12s5-qF', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
                { id: 'c12s5-qOU', icon: 'letterTile', label: 'OU', say: 'ou', correct: false },
                { id: 'c12s5-qQU', icon: 'letterTile', label: 'QU', say: 'kw', correct: false },
                { id: 'c12s5-qTH', icon: 'letterTile', label: 'TH', say: 'thhu', correct: true },
              ],
            },
            {
              promptAudio: 'ou',
              options: [
                { id: 'c12s5-qOU2', icon: 'letterTile', label: 'OU', say: 'ou', correct: true },
                { id: 'c12s5-qTH2', icon: 'letterTile', label: 'TH', say: 'thhu', correct: false },
                { id: 'c12s5-qQU2', icon: 'letterTile', label: 'QU', say: 'kw', correct: false },
                { id: 'c12s5-qOA2', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
              ],
            },
            {
              promptAudio: 'kw',
              options: [
                { id: 'c12s5-qTH3', icon: 'letterTile', label: 'TH', say: 'thhu', correct: false },
                { id: 'c12s5-qQU3', icon: 'letterTile', label: 'QU', say: 'kw', correct: true },
                { id: 'c12s5-qOU3', icon: 'letterTile', label: 'OU', say: 'ou', correct: false },
                { id: 'c12s5-qK3', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
              ],
            },
            // 누적 복습 (챕터 2의 I). THIN의 가운데 소리라 지금 되꺼낼 값이 있다.
            {
              promptAudio: 'ihh',
              options: [
                { id: 'c12s5-qOU4', icon: 'letterTile', label: 'OU', say: 'ou', correct: false },
                { id: 'c12s5-qTH4', icon: 'letterTile', label: 'TH', say: 'thhu', correct: false },
                { id: 'c12s5-qI4', icon: 'letterTile', label: 'I', say: 'ihh', correct: true },
                { id: 'c12s5-qIE4', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c12s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'N', say: 'nnn' },
            { text: 'TH', say: 'thhu' },
            { text: 'I', say: 'ihh' },
          ],
          target: ['TH', 'I', 'N'],
          readAloud: { targetText: 'thin' },
        },
        {
          id: 'c12s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c12s5-ITHN', icon: 'letterTile', label: 'ITHN', correct: false },
            { id: 'c12s5-NITH', icon: 'letterTile', label: 'NITH', correct: false },
            { id: 'c12s5-THIN', icon: 'letterTile', label: 'THIN', correct: true },
          ],
          readAloud: { targetText: 'thin' },
        },
        {
          id: 'c12s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 out을 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'T', say: 'tuh' },
            { text: 'OU', say: 'ou' },
          ],
          target: ['OU', 'T'],
          readAloud: { targetText: 'out' },
        },
        {
          id: 'c12s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'out도 천천히 따라 말해보세요.',
          words: [
            { text: 'OU', say: 'ou' },
            { text: 'T', say: 'tuh' },
            'out',
          ],
        },
        {
          id: 'c12s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! THIN! OUT!',
          words: ['thin', 'out'],
        },
      ],
      recapKo: 'TH-I-N은 THIN, OU-T는 OUT! 단어 두 개를 만들었어요! 챕터 12 클리어!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['thin', 'out'],
      },
    },
  ],
}
