// Chapter 9 (dinosaur theme, 2nd appearance -- world 1's chapter 3 was the
// first): Z, W, NG -> boss blends "ZIP" + "RING". Opens Jolly Phonics Group 5
// (z w ng v oo oo). Beat vocabulary and structure follow chapter-07/08's
// template exactly (intro-sound stage -> teach stage x3 -> boss), including
// the "skip the middle new letter in the boss word" convention (chapter 7
// skipped J, chapter 8 skipped EE; here W is skipped -- boss uses Z and NG).
//
// ============================================================================
// 소리 표기 -- 전부 chapters/index.js 의 SOUND_TABLE(Group 5)에서 조회만 했다
// ============================================================================
// Z -> 'zze' (770/1230ms, clean). W -> 'weh' (521/331ms, clean). NG -> 'ngh'
// (968/1098ms, clean). 표를 다시 측정하지 않는다 -- 이미 확정됐다. 재측정이
// 필요하면 표의 `rejected` 항목을 먼저 읽어라(같은 후보가 이미 탈락해 있을 수
// 있다).
//
// ============================================================================
// 아이콘 재고 -- 챕터 9의 세 소리 전부 그림 문항 재고가 0이다
// ============================================================================
// icons.js 69종을 전수 확인했다: zip/zebra/zoo(Z), web/watch/worm(W),
// ring-ending/king-ending 그림(NG) 어느 것도 없다. **`ring`과 `king`은 이미
// 있지만 두 아이콘 다 이 프로젝트에서 지금까지 어두(R, K 초성) 그림으로
// 쓰였을 뿐, NG 로 끝나는 것도 사실이라 이 챕터에서 NG 그림 문항에 재사용할 수
// 있다** -- 새 아이콘 없이 NG만 유일하게 그림 지원이 가능하다(2종, king+ring).
// Z와 W는 그림 문항이 아예 불가능하다 -- 챕터 7의 J, 챕터 8의 IE/EE 가 쓴 것과
// 같은 처방을 그대로 쓴다: 새 소리는 listen-repeat/finale 의 words[](아이콘
// 불필요, 사전에 있는 실제 단어라 발화가 보장된다)로만 노출하고, 그림이 필요한
// choose/multiselect 문항 자리는 **누적 복습**(이미 아이콘이 있는 기존 글자)으로
// 채운다. drag-build 보스 단계는 애초에 아이콘이 필요 없다(타일 기반).
//
// 필요한 새 아이콘(있으면 승격 가능, 아이콘 담당에게 남기는 목록):
//   zip, zebra, zoo (Z 그림), web, watch, worm (W 그림), wing (NG 그림 추가 후보)
//
// ============================================================================
// 계열: 공룡(dinosaurs.js), 2회차 재사용
// ============================================================================
// 히어로는 챕터 3 이 쓴 4개 구조 함수(dino-raptor/armored/flyer/horned)를 그대로
// 재사용하고 이름·엠블럼만 바꾼다(HANDOFF 의 변주 정책). 빌런은 챕터 3 의 5개
// 구조 함수(dino-blink/echo/upside/swamp/shadow-rex)를 재사용하되 이름을 새로
// 짓는다 -- 색은 art.js 팔레트에서 "챕터 3 의 배색과 갈리게" 배정할 몫이라
// 여기서는 건드리지 않는다.
//
// ============================================================================
// 난이도 곡선 -- 챕터 8 파일럿 표 그대로(챕터 9 이후 전부 적용)
// ============================================================================
// warmup 3 유지 · 표준(choose 등) 4 · hard 5 · wordspot 3 유지 · multiselect 5
// (NG 는 아이콘이 2종뿐이라 그 문항만 5개 중 정답 2개로 채운다 -- 검증기는
// multiselect 정답 하한이 2개이지 3개가 아니다).
//
// ============================================================================
// 보스 단어: ZIP (Z+I+P) · RING (R+I+NG) -- W는 보스에서 조립하지 않는다
// ============================================================================
// 챕터 7 이 J를(가운데 새 글자), 챕터 8 이 EE를(가운데 새 글자) 보스에서 뺀
// 것과 같은 자리 -- 여기서는 W가 가운데(스테이지 3)라 뺐다. W는 stage4 finale
// 이전에 노출되지 않지만, stage3 자체가 W 를 낱소리+단어(web/wig)로 충분히
// 드릴한다. ZIP·RING 둘 다 5세 한국 남아에게 구체물이다(지퍼, 반지).

export const chapter9 = {
  id: 'chapter-9',
  order: 9,
  title: 'Dino Valley Returns',
  stages: [
    {
      id: 'c9-stage-1',
      order: 1,
      title: 'A Buzzing Sound',
      villain: { name: 'Fangor', art: 'fangor', style: 'dino-blink' },
      hero: { name: 'Fizz', art: 'fizz', style: 'dino-raptor' },
      chapterBoss: false,
      beats: [
        {
          id: 'c9s1-teach',
          kind: 'teach',
          instructionKo: 'Fizz가 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['zze'],
        },
        {
          id: 'c9s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '이 소리가 들어있는 단어예요! 따라 말해보세요.',
          words: ['zip', 'zoo'],
        },
        {
          id: 'c9s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['zze'],
        },
        {
          id: 'c9s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // Z 그림이 0개라 이 챕터의 그림 문항은 전부 누적 복습이다.
          instructionKo: '"rat"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'rrr',
          options: [
            { id: 'c9s1-rat', icon: 'rat', label: 'rat', correct: true },
            { id: 'c9s1-lion', icon: 'lion', label: 'lion', correct: false },
            { id: 'c9s1-fan', icon: 'fan', label: 'fan', correct: false },
            { id: 'c9s1-net', icon: 'net', label: 'net', correct: false },
          ],
          readAloud: { targetText: 'rat' },
        },
        {
          id: 'c9s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"fish"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'fff',
          options: [
            { id: 'c9s1-dog', icon: 'dog', label: 'dog', correct: false },
            { id: 'c9s1-fish', icon: 'fish', label: 'fish', correct: true },
            { id: 'c9s1-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c9s1-ten', icon: 'ten', label: 'ten', correct: false },
          ],
          readAloud: { targetText: 'fish' },
        },
        {
          id: 'c9s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/b/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c9s1-sun', icon: 'sun', label: 'sun', correct: false },
            { id: 'c9s1-ball', icon: 'ball', label: 'ball', correct: true },
            { id: 'c9s1-box', icon: 'box', label: 'box', correct: true },
            { id: 'c9s1-cat', icon: 'cat', label: 'cat', correct: false },
            { id: 'c9s1-bed', icon: 'bed', label: 'bed', correct: true },
          ],
          readAloud: { targetText: 'ball' },
        },
        {
          id: 'c9s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['zoo', 'zip'],
        },
        {
          id: 'c9s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['zip'],
        },
      ],
      recapKo: '새로운 소리를 찾았어요! Zip, zoo — 둘 다 이 소리가 들어있어요!',
      recapAudio: {
        ko: '새로운 소리를 배웠어요. 잘 들어보세요.',
        en: ['zze', 'zip', 'zoo'],
      },
    },

    {
      id: 'c9-stage-2',
      order: 2,
      title: 'Power of Z',
      villain: { name: 'Snarl', art: 'snarl', style: 'dino-echo' },
      hero: { name: 'Fizz', art: 'fizz', style: 'dino-raptor' },
      chapterBoss: false,
      beats: [
        {
          id: 'c9s2-teach',
          kind: 'teach',
          instructionKo: 'Fizz의 꼬리가 흔들리는 소리처럼 Z 소리를 내요!',
          art: 'hero',
          letter: 'Z',
          repeatAudio: ['zze'],
        },
        {
          id: 'c9s2-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'zze',
          options: [
            { id: 'c9s2-S1', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c9s2-J1', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
            { id: 'c9s2-Z1', icon: 'letterTile', label: 'Z', say: 'zze', correct: true },
          ],
        },
        {
          id: 'c9s2-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"net"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'nnn',
          options: [
            { id: 'c9s2-cup', icon: 'cup', label: 'cup', correct: false },
            { id: 'c9s2-leg', icon: 'leg', label: 'leg', correct: false },
            { id: 'c9s2-horse', icon: 'horse', label: 'horse', correct: false },
            { id: 'c9s2-net', icon: 'net', label: 'net', correct: true },
          ],
          readAloud: { targetText: 'net' },
        },
        {
          id: 'c9s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 Z를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'Z', say: 'zze' }],
        },
        {
          id: 'c9s2-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 z를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'z',
          repeatAudio: ['zze'],
        },
        {
          id: 'c9s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/p/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c9s2-pig', icon: 'pig', label: 'pig', correct: true },
            { id: 'c9s2-cup2', icon: 'cup', label: 'cup', correct: false },
            { id: 'c9s2-pen', icon: 'pen', label: 'pen', correct: true },
            { id: 'c9s2-duck', icon: 'duck', label: 'duck', correct: false },
            { id: 'c9s2-pot', icon: 'pot', label: 'pot', correct: true },
          ],
          readAloud: { targetText: 'pig' },
        },
        {
          id: 'c9s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개는 지금까지 배운 자음 중 조음 위치가 가까운 것들
          // (마찰음/파찰음 계열): S, J, F, D.
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'zze',
          options: [
            { id: 'c9s2-S3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c9s2-J3', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
            { id: 'c9s2-F3', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
            { id: 'c9s2-D3', icon: 'letterTile', label: 'D', say: 'duh', correct: false },
            { id: 'c9s2-Z3', icon: 'letterTile', label: 'Z', say: 'zze', correct: true },
          ],
          readAloud: { targetText: 'Z', say: 'zze' },
        },
        {
          id: 'c9s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // Z 그림이 없어 챕터 8 의 OR(fork/corn 재고)로 대신 복습한다.
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'OR',
          options: [
            { id: 'c9s2-jug', icon: 'jug', label: 'jug', correct: false },
            { id: 'c9s2-fork', icon: 'fork', label: 'fork', correct: true },
            { id: 'c9s2-net2', icon: 'net', label: 'net', correct: false },
            { id: 'c9s2-bed2', icon: 'bed', label: 'bed', correct: false },
          ],
          readAloud: { targetText: 'fork' },
        },
        {
          id: 'c9s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['zip', 'zoo'],
        },
        {
          id: 'c9s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'zip' 사전 노출 (Z 로 완성, I·P 는 챕터 1 에서 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'Z', say: 'zze' }, 'zip'],
        },
      ],
      recapKo: 'Z는 Fizz의 꼬리처럼 지지직 소리를 내요 — zip, zoo!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 지퍼, 주!',
        en: ['zze', 'zip', 'zoo'],
      },
    },

    {
      id: 'c9-stage-3',
      order: 3,
      title: 'Power of W',
      villain: { name: 'Grimjaw', art: 'grimjaw', style: 'dino-upside' },
      hero: { name: 'Talon', art: 'talon', style: 'dino-armored' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR', 'Z', 'W',
      ],
      beats: [
        {
          id: 'c9s3-teach',
          kind: 'teach',
          instructionKo: 'Talon이 바람을 가르며 W 소리를 내요!',
          art: 'hero',
          letter: 'W',
          repeatAudio: ['weh'],
        },
        {
          id: 'c9s3-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: OA/U(둥근 모음/활음이라 W와 헷갈리기 쉽다).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'weh',
          options: [
            { id: 'c9s3-W1', icon: 'letterTile', label: 'W', say: 'weh', correct: true },
            { id: 'c9s3-OA1', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c9s3-U1', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
          ],
        },
        {
          id: 'c9s3-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"leg"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'lll',
          options: [
            { id: 'c9s3-octopus', icon: 'octopus', label: 'octopus', correct: false },
            { id: 'c9s3-ant', icon: 'ant', label: 'ant', correct: false },
            { id: 'c9s3-cake', icon: 'cake', label: 'cake', correct: false },
            { id: 'c9s3-leg', icon: 'leg', label: 'leg', correct: true },
          ],
          readAloud: { targetText: 'leg' },
        },
        {
          id: 'c9s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 W를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'W', say: 'weh' }],
        },
        {
          id: 'c9s3-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 w를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'w',
          repeatAudio: ['weh'],
        },
        {
          id: 'c9s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/k/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c9s3-cat2', icon: 'cat', label: 'cat', correct: true },
            { id: 'c9s3-dog2', icon: 'dog', label: 'dog', correct: false },
            { id: 'c9s3-cake2', icon: 'cake', label: 'cake', correct: true },
            { id: 'c9s3-net3', icon: 'net', label: 'net', correct: false },
            { id: 'c9s3-cup3', icon: 'cup', label: 'cup', correct: true },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c9s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'weh',
          options: [
            { id: 'c9s3-U3', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
            { id: 'c9s3-OA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c9s3-O3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c9s3-W3', icon: 'letterTile', label: 'W', say: 'weh', correct: true },
            { id: 'c9s3-H3', icon: 'letterTile', label: 'H', say: 'huh', correct: false },
          ],
          readAloud: { targetText: 'W', say: 'weh' },
        },
        {
          id: 'c9s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // W 그림이 없어 챕터 8 의 EE(bee/tree/feet 재고)로 대신 복습한다.
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'EE',
          options: [
            { id: 'c9s3-hat', icon: 'hat', label: 'hat', correct: false },
            { id: 'c9s3-bee', icon: 'bee', label: 'bee', correct: true },
            { id: 'c9s3-map', icon: 'map', label: 'map', correct: false },
            { id: 'c9s3-fan2', icon: 'fan', label: 'fan', correct: false },
          ],
          readAloud: { targetText: 'bee' },
        },
        {
          id: 'c9s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['web', 'wig'],
        },
        {
          id: 'c9s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // W는 보스 단어를 만들지 않는다(가운데 새 글자, 파일 헤더 참조) --
          // 보너스 단어 'wig' 로 소리를 마지막에 한 번 더 확인한다.
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'W', say: 'weh' }, 'wig'],
        },
      ],
      recapKo: 'W는 바람이 부는 것처럼 소리를 내요 — web, wig!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 웹, 위그!',
        en: ['weh', 'web', 'wig'],
      },
    },

    {
      id: 'c9-stage-4',
      order: 4,
      title: 'Power of NG',
      villain: { name: 'Thudfoot', art: 'thudfoot', style: 'dino-swamp' },
      hero: { name: 'Wingo', art: 'wingo', style: 'dino-flyer' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG',
      ],
      beats: [
        {
          id: 'c9s4-teach',
          kind: 'teach',
          instructionKo: 'Wingo가 날개를 펼치며 NG 소리로 크게 울어요!',
          art: 'hero',
          letter: 'NG',
          repeatAudio: ['ngh'],
        },
        {
          id: 'c9s4-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: N/G(NG를 구성하는 두 소리 -- 가장 위험한 경쟁자).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'ngh',
          options: [
            { id: 'c9s4-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
            { id: 'c9s4-NG1', icon: 'letterTile', label: 'NG', say: 'ngh', correct: true },
            { id: 'c9s4-G1', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
          ],
        },
        {
          id: 'c9s4-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // NG 로 끝나는 그림 -- king. `ring`은 NG 도 R 도 담당하지만 여기서는
          // NG 문항에 king 을 정답으로 둔다(다음 multiselect 에서 ring 도 쓴다).
          instructionKo: '이 소리로 끝나는 그림을 찾아보세요!',
          promptAudio: 'ngh',
          options: [
            { id: 'c9s4-cat3', icon: 'cat', label: 'cat', correct: false },
            { id: 'c9s4-bed3', icon: 'bed', label: 'bed', correct: false },
            { id: 'c9s4-sun2', icon: 'sun', label: 'sun', correct: false },
            { id: 'c9s4-king', icon: 'king', label: 'king', correct: true },
          ],
          readAloud: { targetText: 'king' },
        },
        {
          id: 'c9s4-r2b-multi',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // NG 그림 재고는 king/ring 딱 2개다 -- 정답 2개로 충분하다
          // (multiselect 조건은 정답 2개 이상이지 3개가 아니다).
          instructionKo: 'NG 소리로 끝나는 그림을 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c9s4-fan3', icon: 'fan', label: 'fan', correct: false },
            { id: 'c9s4-king2', icon: 'king', label: 'king', correct: true },
            { id: 'c9s4-cup4', icon: 'cup', label: 'cup', correct: false },
            { id: 'c9s4-ring', icon: 'ring', label: 'ring', correct: true },
            { id: 'c9s4-leg2', icon: 'leg', label: 'leg', correct: false },
          ],
          readAloud: { targetText: 'king' },
        },
        {
          id: 'c9s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 NG를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'NG', say: 'ngh' }],
        },
        {
          id: 'c9s4-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 ng를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'ng',
          repeatAudio: ['ngh'],
        },
        {
          id: 'c9s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/d/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c9s4-duck2', icon: 'duck', label: 'duck', correct: true },
            { id: 'c9s4-fan4', icon: 'fan', label: 'fan', correct: false },
            { id: 'c9s4-dog3', icon: 'dog', label: 'dog', correct: true },
            { id: 'c9s4-cup5', icon: 'cup', label: 'cup', correct: false },
            { id: 'c9s4-door2', icon: 'door', label: 'door', correct: true },
          ],
          readAloud: { targetText: 'duck' },
        },
        {
          id: 'c9s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개는 NG를 구성하는 두 소리(N, G)와, 첫 글자가 같은 W,
          // 그리고 이미 배운 M(비음이라 N과 함께 헷갈리는 계열).
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'ngh',
          options: [
            { id: 'c9s4-N3', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
            { id: 'c9s4-G3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
            { id: 'c9s4-NG3', icon: 'letterTile', label: 'NG', say: 'ngh', correct: true },
            { id: 'c9s4-W3', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
            { id: 'c9s4-M3', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
          ],
          readAloud: { targetText: 'NG', say: 'ngh' },
        },
        {
          id: 'c9s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 끝나는 그림을 찾아보세요!',
          promptLetter: 'NG',
          options: [
            { id: 'c9s4-gum3', icon: 'gum', label: 'gum', correct: false },
            { id: 'c9s4-king3', icon: 'king', label: 'king', correct: true },
            { id: 'c9s4-ten2', icon: 'ten', label: 'ten', correct: false },
            { id: 'c9s4-fan5', icon: 'fan', label: 'fan', correct: false },
          ],
          readAloud: { targetText: 'king' },
        },
        {
          id: 'c9s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['king', 'ring'],
        },
        {
          id: 'c9s4-r8-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          // 스텝 5개(새 글자 3 + 누적 복습 2). 복습 대상은 NG를 구성하는
          // N과 G -- NG를 배우는 순간 가장 위험한 경쟁자다(997aa43 기준).
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'zze',
              options: [
                { id: 'c9s4-qS', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
                { id: 'c9s4-qW', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
                { id: 'c9s4-qZ', icon: 'letterTile', label: 'Z', say: 'zze', correct: true },
                { id: 'c9s4-qJ', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
              ],
            },
            {
              promptAudio: 'weh',
              options: [
                { id: 'c9s4-qOA2', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c9s4-qNG2', icon: 'letterTile', label: 'NG', say: 'ngh', correct: false },
                { id: 'c9s4-qU2', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
                { id: 'c9s4-qW2', icon: 'letterTile', label: 'W', say: 'weh', correct: true },
              ],
            },
            {
              promptAudio: 'ngh',
              options: [
                { id: 'c9s4-qNG3', icon: 'letterTile', label: 'NG', say: 'ngh', correct: true },
                { id: 'c9s4-qZ3', icon: 'letterTile', label: 'Z', say: 'zze', correct: false },
                { id: 'c9s4-qW3', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
                { id: 'c9s4-qG3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
              ],
            },
            // 누적 복습 (챕터 5의 N). NG를 구성하는 첫 소리다.
            {
              promptAudio: 'nnn',
              options: [
                { id: 'c9s4-qNG4', icon: 'letterTile', label: 'NG', say: 'ngh', correct: false },
                { id: 'c9s4-qN4', icon: 'letterTile', label: 'N', say: 'nnn', correct: true },
                { id: 'c9s4-qZ4', icon: 'letterTile', label: 'Z', say: 'zze', correct: false },
                { id: 'c9s4-qW4', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
              ],
            },
            // 누적 복습 (챕터 5의 G). NG를 구성하는 둘째 소리다.
            {
              promptAudio: 'guh',
              options: [
                { id: 'c9s4-qW5', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
                { id: 'c9s4-qNG5', icon: 'letterTile', label: 'NG', say: 'ngh', correct: false },
                { id: 'c9s4-qG5', icon: 'letterTile', label: 'G', say: 'guh', correct: true },
                { id: 'c9s4-qZ5', icon: 'letterTile', label: 'Z', say: 'zze', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c9s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'ring' 사전 노출 (NG 로 완성, R·I 는 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'NG', say: 'ngh' }, 'ring'],
        },
      ],
      recapKo: '이제 Z, W, NG를 모두 알아요! Fizz, Talon, Wingo가 합체할 준비를 해요!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 이제 세 소리를 모두 배웠어요.',
        en: ['ngh', 'king', 'ring'],
      },
    },

    {
      id: 'c9-stage-5',
      order: 5,
      title: 'Boss: ZIP and RING!',
      villain: { name: 'Bonecrash', art: 'bonecrash', style: 'dino-shadow-rex' },
      hero: { name: 'Roara', art: 'roara', style: 'dino-horned' },
      chapterBoss: true,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG',
      ],
      beats: [
        {
          id: 'c9s5-teach',
          kind: 'teach',
          instructionKo: 'Fizz + Talon + Wingo가 합체해요! 먼저 zip을 만들어요.',
          repeatAudio: ['zze', 'ihh', 'puh', 'zip'],
        },
        {
          id: 'c9s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'Z', say: 'zze' },
            { text: 'I', say: 'ihh' },
            { text: 'P', say: 'puh' },
          ],
          target: ['Z', 'I', 'P'],
        },
        {
          id: 'c9s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [{ text: 'Z', say: 'zze' }, { text: 'I', say: 'ihh' }, { text: 'P', say: 'puh' }, 'zip'],
        },
        {
          id: 'c9s5-break',
          kind: 'break',
          instructionKo: '이번엔 ring이에요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['rrr', 'ihh', 'ngh', 'ring'],
        },
        {
          id: 'c9s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'zze',
              options: [
                { id: 'c9s5-qJ', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
                { id: 'c9s5-qW', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
                { id: 'c9s5-qNG', icon: 'letterTile', label: 'NG', say: 'ngh', correct: false },
                { id: 'c9s5-qZ', icon: 'letterTile', label: 'Z', say: 'zze', correct: true },
              ],
            },
            {
              promptAudio: 'ngh',
              options: [
                { id: 'c9s5-qNG2', icon: 'letterTile', label: 'NG', say: 'ngh', correct: true },
                { id: 'c9s5-qZ2', icon: 'letterTile', label: 'Z', say: 'zze', correct: false },
                { id: 'c9s5-qW2', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
                { id: 'c9s5-qG2', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
              ],
            },
            {
              promptAudio: 'weh',
              options: [
                { id: 'c9s5-qZ3', icon: 'letterTile', label: 'Z', say: 'zze', correct: false },
                { id: 'c9s5-qW3', icon: 'letterTile', label: 'W', say: 'weh', correct: true },
                { id: 'c9s5-qNG3', icon: 'letterTile', label: 'NG', say: 'ngh', correct: false },
                { id: 'c9s5-qOA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
              ],
            },
            // 누적 복습 (챕터 7의 J). Z와 조음 위치가 가까운 파찰음이다.
            {
              promptAudio: 'juh',
              options: [
                { id: 'c9s5-qZ4', icon: 'letterTile', label: 'Z', say: 'zze', correct: false },
                { id: 'c9s5-qNG4', icon: 'letterTile', label: 'NG', say: 'ngh', correct: false },
                { id: 'c9s5-qJ4', icon: 'letterTile', label: 'J', say: 'juh', correct: true },
                { id: 'c9s5-qW4', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c9s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'P', say: 'puh' },
            { text: 'Z', say: 'zze' },
            { text: 'I', say: 'ihh' },
          ],
          target: ['Z', 'I', 'P'],
          readAloud: { targetText: 'zip' },
        },
        {
          id: 'c9s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c9s5-IZP', icon: 'letterTile', label: 'IZP', correct: false },
            { id: 'c9s5-PIZ', icon: 'letterTile', label: 'PIZ', correct: false },
            { id: 'c9s5-ZIP', icon: 'letterTile', label: 'ZIP', correct: true },
          ],
          readAloud: { targetText: 'zip' },
        },
        {
          id: 'c9s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 ring을 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'NG', say: 'ngh' },
            { text: 'R', say: 'rrr' },
            { text: 'I', say: 'ihh' },
          ],
          target: ['R', 'I', 'NG'],
          readAloud: { targetText: 'ring' },
        },
        {
          id: 'c9s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'ring도 천천히 따라 말해보세요.',
          words: [
            { text: 'R', say: 'rrr' },
            { text: 'I', say: 'ihh' },
            { text: 'NG', say: 'ngh' },
            'ring',
          ],
        },
        {
          id: 'c9s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! ZIP! RING!',
          words: ['zip', 'ring'],
        },
      ],
      recapKo: 'Z-I-P는 ZIP, R-I-NG는 RING! 단어 두 개를 만들었어요! 챕터 9 클리어!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['zip', 'ring'],
      },
    },
  ],
}
