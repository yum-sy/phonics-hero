// Chapter 11 (Toy-Story-flavored living toys, 2nd appearance -- world 1's
// chapter 6 was the first): X, CH, SH -> boss blends "BOX" + "SHIP". Opens
// Jolly Phonics Group 6 (y x ch sh th th) along with chapter 10's Y.
// Structure follows the chapter-07/08/9/10 template, skipping the middle new
// letter (CH, stage 3) in the boss word -- same convention as before.
//
// ============================================================================
// 소리 표기 -- SOUND_TABLE(Group 6) 조회
// ============================================================================
// X -> 'ksuh' (667/642ms, /ks/ 계열 후보 9종 중 유일한 생존자). CH -> 'ch'
// (729/887ms -- 두 글자인데 낱자 이름 나열로 접히지 않는 드문 경우). SH ->
// 'shhu' (647/655ms). 전부 'clean' 등급.
//
// ============================================================================
// 아이콘 재고
// ============================================================================
// X: `box`(기존, /ks/로 끝난다) 1개 -- **/ks/는 대부분 어말이라 X는 시작
// 소리로 그림을 묻기 어렵다**. box 는 이미 이 프로젝트에서 여러 챕터가 "어떤
// 글자로 끝나는지" 와 무관하게 일반 오답/정답으로 재사용해왔지만, 여기서는
// **X 소리(끝소리)를 묻는 정답**으로 처음 쓴다.
// CH: 0개(chin/cherry/chick 없음). SH: `fish`(기존, sh로 끝난다) 1개. 둘 다
// 새 아이콘 없이는 각 1개 이하라 오답 오션 문항(그림 3개 이상 필요) 은 불가능
// 하다 -- choose(그림 1개 정답)만 가능하고 multiselect(정답 2개 이상)는
// 불가능하다. CH는 그림 문항 자체가 없다.
//
// 필요한 새 아이콘: fox, six (X 어말), chin, cherry, chick (CH), ship, shell,
// shoe (SH)
//
// ============================================================================
// 계열: 토이스토리(toys.js), 2회차 재사용
// ============================================================================
// 히어로는 챕터 6의 3개 구조 함수(toy-soldier/plush/block)를 재사용하고
// 보스는 toy-boss(저그 황제 모티브)를 재사용한다. 빌런은 챕터 6의 5개 구조
// 함수(toy-wobbly/tangly/boxxy/tumbles/wind-down)를 재사용하되 새 이름 --
// 색은 art.js 팔레트가 "챕터 6과 갈리게" 배정한다.
//
// ============================================================================
// 보스 단어: BOX (B+O+X) · SHIP (SH+I+P) -- CH는 보스에서 조립하지 않는다
// ============================================================================
// 가운데 새 글자(CH, stage3)를 뺀다. BOX는 X가 **어말**에 오는 첫 보스
// 단어이고(챕터 9의 RING이 NG로 그랬던 것과 같은 구조), 아이콘도 이미 있다
// (`box`). SHIP은 SH가 어두에 오는 3슬롯 단어이고 I·P는 이미 기지다.

export const chapter11 = {
  id: 'chapter-11',
  order: 11,
  title: 'Toy Box Returns',
  stages: [
    {
      id: 'c11-stage-1',
      order: 1,
      title: 'A Clicking Sound',
      villain: { name: 'Springler', art: 'springler', style: 'toy-wobbly' },
      hero: { name: 'Sarge', art: 'sarge', style: 'toy-soldier' },
      chapterBoss: false,
      beats: [
        {
          id: 'c11s1-teach',
          kind: 'teach',
          instructionKo: 'Sarge가 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['ksuh'],
        },
        {
          id: 'c11s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          // /ks/는 어말 소리라 "이 소리로 끝나는 단어" 로 노출한다.
          instructionKo: '이 소리로 끝나는 단어예요! 따라 말해보세요.',
          words: ['box', 'six'],
        },
        {
          id: 'c11s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['ksuh'],
        },
        {
          id: 'c11s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"gum"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'guh',
          options: [
            { id: 'c11s1-gum2', icon: 'gum', label: 'gum', correct: true },
            { id: 'c11s1-cup8', icon: 'cup', label: 'cup', correct: false },
            { id: 'c11s1-net8', icon: 'net', label: 'net', correct: false },
            { id: 'c11s1-mat3', icon: 'mat', label: 'mat', correct: false },
          ],
          readAloud: { targetText: 'gum' },
        },
        {
          id: 'c11s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"pen"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'puh',
          options: [
            { id: 'c11s1-duck3', icon: 'duck', label: 'duck', correct: false },
            { id: 'c11s1-pen2', icon: 'pen', label: 'pen', correct: true },
            { id: 'c11s1-key', icon: 'key', label: 'key', correct: false },
            { id: 'c11s1-rat3', icon: 'rat', label: 'rat', correct: false },
          ],
          readAloud: { targetText: 'pen' },
        },
        {
          id: 'c11s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/h/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c11s1-hat7', icon: 'hat', label: 'hat', correct: true },
            { id: 'c11s1-key2', icon: 'key', label: 'key', correct: false },
            { id: 'c11s1-hand2', icon: 'hand', label: 'hand', correct: true },
            { id: 'c11s1-fan8', icon: 'fan', label: 'fan', correct: false },
            { id: 'c11s1-horse3', icon: 'horse', label: 'horse', correct: true },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c11s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['six', 'box'],
        },
        {
          id: 'c11s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['box'],
        },
      ],
      recapKo: '새로운 소리를 찾았어요! Box, six — 둘 다 이 소리로 끝나요!',
      recapAudio: {
        ko: '새로운 소리를 배웠어요. 잘 들어보세요.',
        en: ['box', 'six'],
      },
    },

    {
      id: 'c11-stage-2',
      order: 2,
      title: 'Power of X',
      villain: { name: 'Fuzzynap', art: 'fuzzynap', style: 'toy-tangly' },
      hero: { name: 'Sarge', art: 'sarge', style: 'toy-soldier' },
      chapterBoss: false,
      beats: [
        {
          id: 'c11s2-teach',
          kind: 'teach',
          instructionKo: 'Sarge가 상자를 잠그는 소리처럼 X 소리를 내요!',
          art: 'hero',
          letter: 'X',
          repeatAudio: ['ksuh'],
        },
        {
          id: 'c11s2-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: K/S(X를 구성하는 두 소리).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'ksuh',
          options: [
            { id: 'c11s2-K1', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
            { id: 'c11s2-S1', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c11s2-X1', icon: 'letterTile', label: 'X', say: 'ksuh', correct: true },
          ],
        },
        {
          id: 'c11s2-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // X 그림은 box 하나뿐이다.
          instructionKo: '이 소리로 끝나는 그림을 찾아보세요!',
          promptAudio: 'ksuh',
          options: [
            { id: 'c11s2-bed6', icon: 'bed', label: 'bed', correct: false },
            { id: 'c11s2-sun4', icon: 'sun', label: 'sun', correct: false },
            { id: 'c11s2-cat6', icon: 'cat', label: 'cat', correct: false },
            { id: 'c11s2-box', icon: 'box', label: 'box', correct: true },
          ],
          readAloud: { targetText: 'box' },
        },
        {
          id: 'c11s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 X를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'X', say: 'ksuh' }],
        },
        {
          id: 'c11s2-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 x를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'x',
          repeatAudio: ['ksuh'],
        },
        {
          id: 'c11s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/d/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c11s2-dog4', icon: 'dog', label: 'dog', correct: true },
            { id: 'c11s2-top3', icon: 'top', label: 'top', correct: false },
            { id: 'c11s2-duck4', icon: 'duck', label: 'duck', correct: true },
            { id: 'c11s2-net9', icon: 'net', label: 'net', correct: false },
            { id: 'c11s2-door4', icon: 'door', label: 'door', correct: true },
          ],
          readAloud: { targetText: 'dog' },
        },
        {
          id: 'c11s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개는 X를 구성하는 K/S, 그리고 조음이 가까운 Z/T.
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'ksuh',
          options: [
            { id: 'c11s2-K3', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
            { id: 'c11s2-S3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c11s2-X3', icon: 'letterTile', label: 'X', say: 'ksuh', correct: true },
            { id: 'c11s2-Z3b', icon: 'letterTile', label: 'Z', say: 'zze', correct: false },
            { id: 'c11s2-T3', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
          ],
          readAloud: { targetText: 'X', say: 'ksuh' },
        },
        {
          id: 'c11s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 챕터 10의 OO(moon)로 대신 복습한다.
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'OO',
          options: [
            { id: 'c11s2-fan9', icon: 'fan', label: 'fan', correct: false },
            { id: 'c11s2-moon3', icon: 'moon', label: 'moon', correct: true },
            { id: 'c11s2-hat8', icon: 'hat', label: 'hat', correct: false },
            { id: 'c11s2-cup9', icon: 'cup', label: 'cup', correct: false },
          ],
          readAloud: { targetText: 'moon' },
        },
        {
          id: 'c11s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['box', 'six'],
        },
        {
          id: 'c11s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'box' 사전 노출 (X로 완성, B·O는 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: ['box', { text: 'X', say: 'ksuh' }],
        },
      ],
      recapKo: 'X는 상자를 잠그는 것처럼 소리를 내요 — box, six!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 박스, 식스!',
        en: ['box', 'six'],
      },
    },

    {
      id: 'c11-stage-3',
      order: 3,
      title: 'Power of CH',
      villain: { name: 'Boxxo', art: 'boxxo', style: 'toy-boxxy' },
      hero: { name: 'Pluma', art: 'pluma', style: 'toy-plush' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH',
      ],
      beats: [
        {
          id: 'c11s3-teach',
          kind: 'teach',
          instructionKo: 'Pluma가 기차처럼 칙칙 CH 소리를 내요!',
          art: 'hero',
          letter: 'CH',
          repeatAudio: ['ch'],
        },
        {
          id: 'c11s3-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: SH(다음 스테이지, 조음이 가장 가깝다)와 J(파찰음 계열).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'ch',
          options: [
            { id: 'c11s3-CH1', icon: 'letterTile', label: 'CH', say: 'ch', correct: true },
            { id: 'c11s3-SH1', icon: 'letterTile', label: 'SH', say: 'shhu', correct: false },
            { id: 'c11s3-J1', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
          ],
        },
        {
          id: 'c11s3-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // CH 그림이 0개라 이 챕터의 그림 문항은 누적 복습으로 채운다.
          instructionKo: '"nut"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'nnn',
          options: [
            { id: 'c11s3-top4', icon: 'top', label: 'top', correct: false },
            { id: 'c11s3-gift2', icon: 'gift', label: 'gift', correct: false },
            { id: 'c11s3-hen', icon: 'hen', label: 'hen', correct: false },
            { id: 'c11s3-nut', icon: 'nut', label: 'nut', correct: true },
          ],
          readAloud: { targetText: 'nut' },
        },
        {
          id: 'c11s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 CH를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'CH', say: 'ch' }],
        },
        {
          id: 'c11s3-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 ch를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'ch',
          repeatAudio: ['ch'],
        },
        {
          id: 'c11s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/t/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c11s3-top5', icon: 'top', label: 'top', correct: true },
            { id: 'c11s3-net10', icon: 'net', label: 'net', correct: false },
            { id: 'c11s3-tap', icon: 'tap', label: 'tap', correct: true },
            { id: 'c11s3-box6', icon: 'box', label: 'box', correct: false },
            { id: 'c11s3-ten3', icon: 'ten', label: 'ten', correct: true },
          ],
          readAloud: { targetText: 'top' },
        },
        {
          id: 'c11s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개: SH(가장 가까운 경쟁자), J(파찰음), T(CH의 첫 요소),
          // X(직전 스테이지, 조음 위치는 다르지만 시각적으로 새 글자다).
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'ch',
          options: [
            { id: 'c11s3-SH3', icon: 'letterTile', label: 'SH', say: 'shhu', correct: false },
            { id: 'c11s3-CH3', icon: 'letterTile', label: 'CH', say: 'ch', correct: true },
            { id: 'c11s3-J3', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
            { id: 'c11s3-T3', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c11s3-X3b', icon: 'letterTile', label: 'X', say: 'ksuh', correct: false },
          ],
          readAloud: { targetText: 'CH', say: 'ch' },
        },
        {
          id: 'c11s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 끝나는 그림을 찾아보세요!',
          promptLetter: 'X',
          options: [
            { id: 'c11s3-cup10', icon: 'cup', label: 'cup', correct: false },
            { id: 'c11s3-box7', icon: 'box', label: 'box', correct: true },
            { id: 'c11s3-mat4', icon: 'mat', label: 'mat', correct: false },
            { id: 'c11s3-fan10', icon: 'fan', label: 'fan', correct: false },
          ],
          readAloud: { targetText: 'box' },
        },
        {
          id: 'c11s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['chip', 'chin'],
        },
        {
          id: 'c11s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // CH는 가운데 새 글자라 보스에서 조립하지 않는다(파일 헤더 참조) --
          // 보너스 단어로 소리를 마지막에 한 번 더 확인한다.
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'CH', say: 'ch' }, 'chip'],
        },
      ],
      recapKo: 'CH는 기차처럼 칙칙 소리를 내요 — chip, chin!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 칩, 친!',
        en: ['chip', 'chin'],
      },
    },

    {
      id: 'c11-stage-4',
      order: 4,
      title: 'Power of SH',
      villain: { name: 'Rollo', art: 'rollo', style: 'toy-tumbles' },
      hero: { name: 'Blocko Jr.', art: 'blocko-jr', style: 'toy-block' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH',
      ],
      beats: [
        {
          id: 'c11s4-teach',
          kind: 'teach',
          instructionKo: 'Blocko Jr.가 조용히 하라는 듯 SH 소리를 내요!',
          art: 'hero',
          letter: 'SH',
          repeatAudio: ['shhu'],
        },
        {
          id: 'c11s4-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: S(SH의 첫 요소)와 CH(직전 스테이지, 가장 가까운 경쟁자).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'shhu',
          options: [
            { id: 'c11s4-S1', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c11s4-SH1', icon: 'letterTile', label: 'SH', say: 'shhu', correct: true },
            { id: 'c11s4-CH1', icon: 'letterTile', label: 'CH', say: 'ch', correct: false },
          ],
        },
        {
          id: 'c11s4-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // SH 그림은 fish 하나뿐이다(끝소리).
          instructionKo: '이 소리로 끝나는 그림을 찾아보세요!',
          promptAudio: 'shhu',
          options: [
            { id: 'c11s4-hen2', icon: 'hen', label: 'hen', correct: false },
            { id: 'c11s4-mat5', icon: 'mat', label: 'mat', correct: false },
            { id: 'c11s4-box8', icon: 'box', label: 'box', correct: false },
            { id: 'c11s4-fish', icon: 'fish', label: 'fish', correct: true },
          ],
          readAloud: { targetText: 'fish' },
        },
        {
          id: 'c11s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 SH를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'SH', say: 'shhu' }],
        },
        {
          id: 'c11s4-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 sh를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'sh',
          repeatAudio: ['shhu'],
        },
        {
          id: 'c11s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/g/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c11s4-gift3', icon: 'gift', label: 'gift', correct: true },
            { id: 'c11s4-hat9', icon: 'hat', label: 'hat', correct: false },
            { id: 'c11s4-gum4', icon: 'gum', label: 'gum', correct: true },
            { id: 'c11s4-net11', icon: 'net', label: 'net', correct: false },
            { id: 'c11s4-jug2', icon: 'jug', label: 'jug', correct: false },
          ],
          readAloud: { targetText: 'gift' },
        },
        {
          id: 'c11s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'shhu',
          options: [
            { id: 'c11s4-SH3', icon: 'letterTile', label: 'SH', say: 'shhu', correct: true },
            { id: 'c11s4-S3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c11s4-CH3', icon: 'letterTile', label: 'CH', say: 'ch', correct: false },
            { id: 'c11s4-X3c', icon: 'letterTile', label: 'X', say: 'ksuh', correct: false },
            { id: 'c11s4-H3', icon: 'letterTile', label: 'H', say: 'huh', correct: false },
          ],
          readAloud: { targetText: 'SH', say: 'shhu' },
        },
        {
          id: 'c11s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'SH',
          options: [
            { id: 'c11s4-cup11', icon: 'cup', label: 'cup', correct: false },
            { id: 'c11s4-fish2', icon: 'fish', label: 'fish', correct: true },
            { id: 'c11s4-rat4', icon: 'rat', label: 'rat', correct: false },
            { id: 'c11s4-hand3', icon: 'hand', label: 'hand', correct: false },
          ],
          readAloud: { targetText: 'fish' },
        },
        {
          id: 'c11s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['ship', 'shed'],
        },
        {
          id: 'c11s4-r8-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          // 스텝 5개(새 글자 3 + 누적 복습 2). 복습 대상: S(SH의 첫 요소),
          // CH(직전 스테이지, 가장 가까운 경쟁자).
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'ksuh',
              options: [
                { id: 'c11s4-qK', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
                { id: 'c11s4-qCH', icon: 'letterTile', label: 'CH', say: 'ch', correct: false },
                { id: 'c11s4-qX', icon: 'letterTile', label: 'X', say: 'ksuh', correct: true },
                { id: 'c11s4-qSH', icon: 'letterTile', label: 'SH', say: 'shhu', correct: false },
              ],
            },
            {
              promptAudio: 'ch',
              options: [
                { id: 'c11s4-qSH2', icon: 'letterTile', label: 'SH', say: 'shhu', correct: false },
                { id: 'c11s4-qX2', icon: 'letterTile', label: 'X', say: 'ksuh', correct: false },
                { id: 'c11s4-qJ2', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
                { id: 'c11s4-qCH2', icon: 'letterTile', label: 'CH', say: 'ch', correct: true },
              ],
            },
            {
              promptAudio: 'shhu',
              options: [
                { id: 'c11s4-qSH3', icon: 'letterTile', label: 'SH', say: 'shhu', correct: true },
                { id: 'c11s4-qCH3', icon: 'letterTile', label: 'CH', say: 'ch', correct: false },
                { id: 'c11s4-qX3', icon: 'letterTile', label: 'X', say: 'ksuh', correct: false },
                { id: 'c11s4-qS3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
              ],
            },
            // 누적 복습 (챕터 1의 S). SH의 첫 요소다.
            {
              promptAudio: 'sss',
              options: [
                { id: 'c11s4-qSH4', icon: 'letterTile', label: 'SH', say: 'shhu', correct: false },
                { id: 'c11s4-qS4', icon: 'letterTile', label: 'S', say: 'sss', correct: true },
                { id: 'c11s4-qCH4', icon: 'letterTile', label: 'CH', say: 'ch', correct: false },
                { id: 'c11s4-qX4', icon: 'letterTile', label: 'X', say: 'ksuh', correct: false },
              ],
            },
            // 누적 복습 (직전 스테이지의 CH). SH와 조음이 가장 가깝다.
            {
              promptAudio: 'ch',
              options: [
                { id: 'c11s4-qSH5', icon: 'letterTile', label: 'SH', say: 'shhu', correct: false },
                { id: 'c11s4-qS5', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
                { id: 'c11s4-qCH5', icon: 'letterTile', label: 'CH', say: 'ch', correct: true },
                { id: 'c11s4-qX5', icon: 'letterTile', label: 'X', say: 'ksuh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c11s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'ship' 사전 노출 (SH로 완성, I·P는 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'SH', say: 'shhu' }, 'ship'],
        },
      ],
      recapKo: '이제 X, CH, SH를 모두 알아요! Sarge, Pluma, Blocko Jr.가 합체할 준비를 해요!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 이제 세 소리를 모두 배웠어요.',
        en: ['ship', 'shed'],
      },
    },

    {
      id: 'c11-stage-5',
      order: 5,
      title: 'Boss: BOX and SHIP!',
      villain: { name: 'Windup Duke', art: 'windup-duke', style: 'toy-wind-down' },
      hero: { name: 'Captain Blockhead', art: 'captain-blockhead', style: 'toy-boss' },
      chapterBoss: true,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH',
      ],
      beats: [
        {
          id: 'c11s5-teach',
          kind: 'teach',
          instructionKo: 'Sarge + Pluma + Blocko Jr.가 합체해요! 먼저 box를 만들어요.',
          repeatAudio: ['buh', 'awh', 'ksuh', 'box'],
        },
        {
          id: 'c11s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'B', say: 'buh' },
            { text: 'O', say: 'awh' },
            { text: 'X', say: 'ksuh' },
          ],
          target: ['B', 'O', 'X'],
        },
        {
          id: 'c11s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [{ text: 'B', say: 'buh' }, { text: 'O', say: 'awh' }, { text: 'X', say: 'ksuh' }, 'box'],
        },
        {
          id: 'c11s5-break',
          kind: 'break',
          instructionKo: '이번엔 ship이에요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['shhu', 'ihh', 'puh', 'ship'],
        },
        {
          id: 'c11s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'ksuh',
              options: [
                { id: 'c11s5-qCH', icon: 'letterTile', label: 'CH', say: 'ch', correct: false },
                { id: 'c11s5-qSH', icon: 'letterTile', label: 'SH', say: 'shhu', correct: false },
                { id: 'c11s5-qK', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
                { id: 'c11s5-qX', icon: 'letterTile', label: 'X', say: 'ksuh', correct: true },
              ],
            },
            {
              promptAudio: 'shhu',
              options: [
                { id: 'c11s5-qSH2', icon: 'letterTile', label: 'SH', say: 'shhu', correct: true },
                { id: 'c11s5-qX2', icon: 'letterTile', label: 'X', say: 'ksuh', correct: false },
                { id: 'c11s5-qCH2', icon: 'letterTile', label: 'CH', say: 'ch', correct: false },
                { id: 'c11s5-qS2', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
              ],
            },
            {
              promptAudio: 'ch',
              options: [
                { id: 'c11s5-qSH3', icon: 'letterTile', label: 'SH', say: 'shhu', correct: false },
                { id: 'c11s5-qCH3', icon: 'letterTile', label: 'CH', say: 'ch', correct: true },
                { id: 'c11s5-qX3', icon: 'letterTile', label: 'X', say: 'ksuh', correct: false },
                { id: 'c11s5-qJ3', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
              ],
            },
            // 누적 복습 (챕터 3의 O). BOX의 가운데 소리라 지금 되꺼낼 값이 있다.
            {
              promptAudio: 'awh',
              options: [
                { id: 'c11s5-qX4', icon: 'letterTile', label: 'X', say: 'ksuh', correct: false },
                { id: 'c11s5-qSH4', icon: 'letterTile', label: 'SH', say: 'shhu', correct: false },
                { id: 'c11s5-qO4', icon: 'letterTile', label: 'O', say: 'awh', correct: true },
                { id: 'c11s5-qOA4', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c11s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'X', say: 'ksuh' },
            { text: 'B', say: 'buh' },
            { text: 'O', say: 'awh' },
          ],
          target: ['B', 'O', 'X'],
          readAloud: { targetText: 'box' },
        },
        {
          id: 'c11s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c11s5-OXB', icon: 'letterTile', label: 'OXB', correct: false },
            { id: 'c11s5-XBO', icon: 'letterTile', label: 'XBO', correct: false },
            { id: 'c11s5-BOX', icon: 'letterTile', label: 'BOX', correct: true },
          ],
          readAloud: { targetText: 'box' },
        },
        {
          id: 'c11s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 ship을 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'P', say: 'puh' },
            { text: 'SH', say: 'shhu' },
            { text: 'I', say: 'ihh' },
          ],
          target: ['SH', 'I', 'P'],
          readAloud: { targetText: 'ship' },
        },
        {
          id: 'c11s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'ship도 천천히 따라 말해보세요.',
          words: [
            { text: 'SH', say: 'shhu' },
            { text: 'I', say: 'ihh' },
            { text: 'P', say: 'puh' },
            'ship',
          ],
        },
        {
          id: 'c11s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! BOX! SHIP!',
          words: ['box', 'ship'],
        },
      ],
      recapKo: 'B-O-X는 BOX, SH-I-P는 SHIP! 단어 두 개를 만들었어요! 챕터 11 클리어!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['box', 'ship'],
      },
    },
  ],
}
