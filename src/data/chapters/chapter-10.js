// Chapter 10 (Mario-flavored platformer theme, 2nd appearance -- world 1's
// chapter 5 was the first): V, OO, Y -> boss blends "VAN" + "YAM". Continues
// Jolly Phonics Group 5 (OO finishes the group; Y opens group 6). Structure
// follows the chapter-07/08/9 template (intro-sound stage -> teach x3 ->
// boss), skipping the middle new letter (OO, stage 3) in the boss word --
// same convention chapter 7 (skipped J) and chapter 9 (skipped W) used.
//
// ============================================================================
// 소리 표기 -- SOUND_TABLE(Group 5) 조회
// ============================================================================
// V -> 'vve' (697/979ms). OO 긴소리(/u:/, moon) -> 'uuu' (685/795ms). OO
// 짧은소리(/u/, book) -> 'uuh' (1033/1132ms). Y -> 'yyuh' (627/621ms). 전부
// 'clean' 등급(미끼 스윕 무충돌) -- 표의 `rejected` 항목이 이미 이 후보들의
// 대안을 전부 검토해뒀다.
//
// ============================================================================
// OO는 이 앱에서 **한 글자꼴에 소리가 둘**인 첫 사례다
// ============================================================================
// chapters/index.js 의 multiSoundLetterforms() 가 'OO'를 자동으로 잡는다.
// 검증기 규칙(같은 파일 주석 참조): 한 문항의 letterTile 보기에 OO를 두 번
// (긴소리 타일 + 짧은소리 타일) 넣으면 안 된다 -- 둘 다 화면에는 똑같이
// "OO"로 보여서 아이가 무엇을 보고 고를지가 없다. 그래서 이 챕터는:
//   - 낱소리 문항(choose/hard/warmup)에서는 **한 스테이지 안에 OO를 한 번만**
//     쓴다(긴소리로 통일 -- Jolly도 긴 oo를 먼저 가르친다).
//   - 두 소리의 **대비**는 단어로 시킨다: listen-repeat/finale 에 moon(긴)과
//     book(짧은)을 나란히 둔다. 검증기 헤더가 정확히 이 처방을 권고한다.
//   - 화면 표시용 소문자 'oo'(break beat)는 REPEATED_LETTER_DIGRAPHS_DISPLAY
//     에 추가해뒀다(SOUND_NOTATION이 `/^(.)\1+$/i`라 같은 글자 반복 다이그래프를
//     소리 표기 노출로 오인하기 때문 -- EE가 챕터 8에서 걸렸던 것과 같다).
// **실기기 청취 우선순위**: HANDOFF/SOUND_TABLE 모두 "아이가 긴/짧은 oo를
// 실제로 구별하는지가 이 챕터의 성패"라고 적어뒀다. 구별되지 않으면 낱소리
// 드릴은 긴 oo 하나로 줄이고 짧은 oo는 단어로만 남겨라(이미 그 구조에 가깝다).
//
// ============================================================================
// 아이콘 재고
// ============================================================================
// V: 0개(van/vest/violin 없음). OO 긴소리: moon 1개(기존). OO 짧은소리: 0개
// (book/foot 없음). Y: 0개(yo-yo/yak 없음). moon 을 제외한 세 소리는 그림
// 문항이 불가능하다 -- 챕터 9와 같은 처방(그림 필요한 자리는 누적 복습으로,
// 새 소리는 words[]로만 노출)을 그대로 쓴다.
//
// 필요한 새 아이콘: van, vest (V), book, foot (짧은 OO), yoyo, yak (Y)
//
// ============================================================================
// 계열: 마리오(platformer.js), 2회차 재사용
// ============================================================================
// 히어로는 챕터 5의 3개 구조 함수(plat-jumper/spring/block)를 재사용하고,
// 보스는 챕터 5와 같은 plat-powerup(레고 파워업 문법, "화면을 꽉 채워야
// 한다"는 그 챕터의 실측 기준이 이 함수 자체의 요구사항이라 여기서도 유지된다).
// 빌런은 챕터 5의 5개 구조 함수(plat-flip/slime/magnetjack/brick/glitch)를
// 재사용하되 새 이름 -- 색은 art.js 팔레트가 "챕터 5와 갈리게" 배정한다.
//
// ============================================================================
// 보스 단어: VAN (V+A+N) · YAM (Y+A+M) -- OO는 보스에서 조립하지 않는다
// ============================================================================
// 가운데 새 글자(OO, stage3)를 뺀다 -- 챕터 7의 J, 챕터 9의 W와 같은 자리다.
// VAN·YAM 둘 다 3슬롯 CVC 실단어이고 A·N·M은 전부 기지 글자다.

export const chapter10 = {
  id: 'chapter-10',
  order: 10,
  title: 'Knights Return',
  stages: [
    {
      id: 'c10-stage-1',
      order: 1,
      title: 'A Humming Sound',
      villain: { name: 'Wobblegear', art: 'wobblegear', style: 'plat-flip' },
      hero: { name: 'Bounce', art: 'bounce', style: 'plat-jumper' },
      chapterBoss: false,
      beats: [
        {
          id: 'c10s1-teach',
          kind: 'teach',
          instructionKo: '히어로가 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['vve'],
        },
        {
          id: 'c10s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '이 소리가 들어있는 단어예요! 따라 말해보세요.',
          words: ['van', 'vet'],
        },
        {
          id: 'c10s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['vve'],
        },
        {
          id: 'c10s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"horse"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'huh',
          options: [
            { id: 'c10s1-horse', icon: 'horse', label: 'horse', correct: true },
            { id: 'c10s1-nose', icon: 'nose', label: 'nose', correct: false },
            { id: 'c10s1-cup', icon: 'cup', label: 'cup', correct: false },
            { id: 'c10s1-map', icon: 'map', label: 'map', correct: false },
          ],
          readAloud: { targetText: 'horse' },
        },
        {
          id: 'c10s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"leg"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'lll',
          options: [
            { id: 'c10s1-net', icon: 'net', label: 'net', correct: false },
            { id: 'c10s1-leg', icon: 'leg', label: 'leg', correct: true },
            { id: 'c10s1-duck', icon: 'duck', label: 'duck', correct: false },
            { id: 'c10s1-ten', icon: 'ten', label: 'ten', correct: false },
          ],
          readAloud: { targetText: 'leg' },
        },
        {
          id: 'c10s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/g/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c10s1-gum', icon: 'gum', label: 'gum', correct: true },
            { id: 'c10s1-cat4', icon: 'cat', label: 'cat', correct: false },
            { id: 'c10s1-gift', icon: 'gift', label: 'gift', correct: true },
            { id: 'c10s1-hat2', icon: 'hat', label: 'hat', correct: false },
            { id: 'c10s1-jug', icon: 'jug', label: 'jug', correct: false },
          ],
          readAloud: { targetText: 'gum' },
        },
        {
          id: 'c10s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['vet', 'van'],
        },
        {
          id: 'c10s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['van'],
        },
      ],
      recapKo: '새로운 소리를 찾았어요! Van, vet — 둘 다 이 소리가 들어있어요!',
      recapAudio: {
        ko: '새로운 소리를 배웠어요. 잘 들어보세요.',
        en: ['van', 'vet'],
      },
    },

    {
      id: 'c10-stage-2',
      order: 2,
      title: 'Power of V',
      villain: { name: 'Ooze', art: 'ooze', style: 'plat-slime' },
      hero: { name: 'Bounce', art: 'bounce', style: 'plat-jumper' },
      chapterBoss: false,
      beats: [
        {
          id: 'c10s2-teach',
          kind: 'teach',
          instructionKo: '엔진이 붕붕거리며 V 소리를 내요!',
          art: 'hero',
          letter: 'V',
          repeatAudio: ['vve'],
        },
        {
          id: 'c10s2-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: B/F(조음 위치가 가까운 파열음/마찰음).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'vve',
          options: [
            { id: 'c10s2-B1', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
            { id: 'c10s2-F1', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
            { id: 'c10s2-V1', icon: 'letterTile', label: 'V', say: 'vve', correct: true },
          ],
        },
        {
          id: 'c10s2-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"top"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'tuh',
          options: [
            { id: 'c10s2-pig2', icon: 'pig', label: 'pig', correct: false },
            { id: 'c10s2-cake3', icon: 'cake', label: 'cake', correct: false },
            { id: 'c10s2-hat3', icon: 'hat', label: 'hat', correct: false },
            { id: 'c10s2-top', icon: 'top', label: 'top', correct: true },
          ],
          readAloud: { targetText: 'top' },
        },
        {
          id: 'c10s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 V를 따라 그리면서 소리를 내보세요!',
          trace: 'upper',
          words: [{ text: 'V', say: 'vve' }],
        },
        {
          id: 'c10s2-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 v를 그려볼까요? 함께 외쳐요!',
          trace: 'lower',
          art: 'hero',
          letter: 'v',
          repeatAudio: ['vve'],
        },
        {
          id: 'c10s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/m/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c10s2-man2', icon: 'man', label: 'man', correct: true },
            { id: 'c10s2-net4', icon: 'net', label: 'net', correct: false },
            { id: 'c10s2-mat2', icon: 'mat', label: 'mat', correct: true },
            { id: 'c10s2-box3', icon: 'box', label: 'box', correct: false },
            { id: 'c10s2-map2', icon: 'map', label: 'map', correct: true },
          ],
          readAloud: { targetText: 'man' },
        },
        {
          id: 'c10s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'vve',
          options: [
            { id: 'c10s2-B3', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
            { id: 'c10s2-F3', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
            { id: 'c10s2-Z3', icon: 'letterTile', label: 'Z', say: 'zze', correct: false },
            { id: 'c10s2-V3', icon: 'letterTile', label: 'V', say: 'vve', correct: true },
            { id: 'c10s2-W3', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
          ],
          readAloud: { targetText: 'V', say: 'vve' },
        },
        {
          id: 'c10s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // V 그림이 없어 챕터 9의 NG(king/ring 재고)로 대신 복습한다.
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'NG',
          options: [
            { id: 'c10s2-fan6', icon: 'fan', label: 'fan', correct: false },
            { id: 'c10s2-king', icon: 'king', label: 'king', correct: true },
            { id: 'c10s2-cup6', icon: 'cup', label: 'cup', correct: false },
            { id: 'c10s2-bed4', icon: 'bed', label: 'bed', correct: false },
          ],
          readAloud: { targetText: 'king' },
        },
        {
          id: 'c10s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['van', 'vet'],
        },
        {
          id: 'c10s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'van' 사전 노출 (V로 완성, A·N은 챕터 1/2에서 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'V', say: 'vve' }, 'van'],
        },
      ],
      recapKo: 'V는 엔진처럼 붕붕 소리를 내요 — van, vet!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 밴, 벳!',
        en: ['van', 'vet'],
      },
    },

    {
      id: 'c10-stage-3',
      order: 3,
      title: 'Power of OO',
      villain: { name: 'Magnetta', art: 'magnetta', style: 'plat-magnetjack' },
      hero: { name: 'Zoomer', art: 'zoomer', style: 'plat-spring' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO',
      ],
      beats: [
        {
          id: 'c10s3-teach',
          kind: 'teach',
          // 긴 oo(moon)를 먼저 가르친다 -- Jolly의 순서와 같다.
          instructionKo: '히어로가 달을 향해 뛰어오르며 OO 소리를 길게 내요!',
          art: 'hero',
          letter: 'OO',
          repeatAudio: ['uuu'],
        },
        {
          id: 'c10s3-r1-warmup',
          kind: 'choose',
          scored: false,
          // 낱소리 문항엔 OO를 한 번만 쓴다(파일 헤더 규칙). 혼동 보기는
          // O/U(같은 계열의 짧은 모음).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'uuu',
          options: [
            { id: 'c10s3-OO1', icon: 'letterTile', label: 'OO', say: 'uuu', correct: true },
            { id: 'c10s3-O1', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c10s3-U1', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
          ],
        },
        {
          id: 'c10s3-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // OO 그림은 moon 하나뿐이다.
          instructionKo: '이 소리가 들어있는 그림을 찾아보세요!',
          promptAudio: 'uuu',
          options: [
            { id: 'c10s3-hat4', icon: 'hat', label: 'hat', correct: false },
            { id: 'c10s3-sun3', icon: 'sun', label: 'sun', correct: false },
            { id: 'c10s3-bed5', icon: 'bed', label: 'bed', correct: false },
            { id: 'c10s3-moon', icon: 'moon', label: 'moon', correct: true },
          ],
          readAloud: { targetText: 'moon' },
        },
        {
          id: 'c10s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 OO를 따라 그리면서 소리를 내보세요!',
          trace: 'upper',
          words: [{ text: 'OO', say: 'uuu' }],
        },
        {
          id: 'c10s3-break',
          kind: 'break',
          // 여기서 짧은 oo(book)를 도입한다 -- 같은 글자꼴, 다른 소리.
          instructionKo: 'OO는 book처럼 짧게 소리 낼 수도 있어요! 손가락으로 소문자 oo를 그려볼까요?',
          trace: 'lower',
          art: 'hero',
          letter: 'oo',
          repeatAudio: ['uuh'],
        },
        {
          id: 'c10s3-r4-contrast',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          // 두 소리의 대비는 단어로만 시킨다(검증기 헤더의 처방 -- letterTile
          // 로 OO를 두 번 띄울 수 없다).
          instructionKo: '긴 소리와 짧은 소리를 비교해서 따라 말해보세요!',
          words: ['moon', 'book'],
        },
        {
          id: 'c10s3-r5-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/h/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c10s3-horse2', icon: 'horse', label: 'horse', correct: true },
            { id: 'c10s3-cat5', icon: 'cat', label: 'cat', correct: false },
            { id: 'c10s3-hat5', icon: 'hat', label: 'hat', correct: true },
            { id: 'c10s3-hand', icon: 'hand', label: 'hand', correct: true },
            { id: 'c10s3-net5', icon: 'net', label: 'net', correct: false },
          ],
          readAloud: { targetText: 'horse' },
        },
        {
          id: 'c10s3-r6-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개는 O/U(짧은 모음 계열)와 AI/OA(다른 장모음 다이그래프).
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'uuu',
          options: [
            { id: 'c10s3-O3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c10s3-U3', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
            { id: 'c10s3-OO3', icon: 'letterTile', label: 'OO', say: 'uuu', correct: true },
            { id: 'c10s3-OA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c10s3-IE3', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
          ],
          readAloud: { targetText: 'OO', say: 'uuu' },
        },
        {
          id: 'c10s3-r7-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'OO',
          options: [
            { id: 'c10s3-fan7', icon: 'fan', label: 'fan', correct: false },
            { id: 'c10s3-moon2', icon: 'moon', label: 'moon', correct: true },
            { id: 'c10s3-net6', icon: 'net', label: 'net', correct: false },
            { id: 'c10s3-box4', icon: 'box', label: 'box', correct: false },
          ],
          readAloud: { targetText: 'moon' },
        },
        {
          id: 'c10s3-r8-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['moon', 'book'],
        },
        {
          id: 'c10s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // OO는 보스에서 조립하지 않는다(가운데 새 글자, 파일 헤더 참조) --
          // 마지막으로 긴/짧은 대비를 한 번 더 확인한다.
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'OO', say: 'uuu' }, 'moon', 'book'],
        },
      ],
      recapKo: 'OO는 moon처럼 길게, book처럼 짧게도 소리 낼 수 있어요!',
      recapAudio: {
        ko: '이 글자는 두 가지 소리를 내요. 문, 북!',
        en: ['moon', 'book'],
      },
    },

    {
      id: 'c10-stage-4',
      order: 4,
      title: 'Power of Y',
      villain: { name: 'Bricker', art: 'bricker', style: 'plat-brick' },
      hero: { name: 'Blocky', art: 'blocky', style: 'plat-block' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y',
      ],
      beats: [
        {
          id: 'c10s4-teach',
          kind: 'teach',
          instructionKo: '히어로가 벽돌을 옮기며 Y 소리를 내요!',
          art: 'hero',
          letter: 'Y',
          repeatAudio: ['yyuh'],
        },
        {
          id: 'c10s4-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: IE/UE(활음/모음 계열이라 Y와 헷갈리기 쉽다. UE는
          // 다음 챕터에서 가르치지 않으므로 여기서는 안전하게 뺐다).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'yyuh',
          options: [
            { id: 'c10s4-IE1', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
            { id: 'c10s4-Y1', icon: 'letterTile', label: 'Y', say: 'yyuh', correct: true },
            { id: 'c10s4-I1', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
          ],
        },
        {
          id: 'c10s4-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"door"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'duh',
          options: [
            { id: 'c10s4-top2', icon: 'top', label: 'top', correct: false },
            { id: 'c10s4-cake4', icon: 'cake', label: 'cake', correct: false },
            { id: 'c10s4-net7', icon: 'net', label: 'net', correct: false },
            { id: 'c10s4-door3', icon: 'door', label: 'door', correct: true },
          ],
          readAloud: { targetText: 'door' },
        },
        {
          id: 'c10s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 Y를 따라 그리면서 소리를 내보세요!',
          trace: 'upper',
          words: [{ text: 'Y', say: 'yyuh' }],
        },
        {
          id: 'c10s4-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 y를 그려볼까요? 함께 외쳐요!',
          trace: 'lower',
          art: 'hero',
          letter: 'y',
          repeatAudio: ['yyuh'],
        },
        {
          id: 'c10s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/r/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c10s4-rat2', icon: 'rat', label: 'rat', correct: true },
            { id: 'c10s4-lion2', icon: 'lion', label: 'lion', correct: false },
            { id: 'c10s4-rain2', icon: 'rain', label: 'rain', correct: true },
            { id: 'c10s4-leg3', icon: 'leg', label: 'leg', correct: false },
            { id: 'c10s4-ring2', icon: 'ring', label: 'ring', correct: true },
          ],
          readAloud: { targetText: 'rat' },
        },
        {
          id: 'c10s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'yyuh',
          options: [
            { id: 'c10s4-IE3', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
            { id: 'c10s4-Y3', icon: 'letterTile', label: 'Y', say: 'yyuh', correct: true },
            { id: 'c10s4-I3', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
            { id: 'c10s4-W3b', icon: 'letterTile', label: 'W', say: 'weh', correct: false },
            { id: 'c10s4-J3', icon: 'letterTile', label: 'J', say: 'juh', correct: false },
          ],
          readAloud: { targetText: 'Y', say: 'yyuh' },
        },
        {
          id: 'c10s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // Y 그림이 없어 챕터 10의 V(생략) 대신 EE(bee/tree/feet)로 복습한다.
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'EE',
          options: [
            { id: 'c10s4-cup7', icon: 'cup', label: 'cup', correct: false },
            { id: 'c10s4-tree', icon: 'tree', label: 'tree', correct: true },
            { id: 'c10s4-hat6', icon: 'hat', label: 'hat', correct: false },
            { id: 'c10s4-box5', icon: 'box', label: 'box', correct: false },
          ],
          readAloud: { targetText: 'tree' },
        },
        {
          id: 'c10s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['yam', 'yes'],
        },
        {
          id: 'c10s4-r8-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          // 스텝 5개(새 글자 3 + 누적 복습 2). 복습 대상: I(Y와 활음/모음으로
          // 경쟁), OO(직전 스테이지, 아직 낯설다).
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'vve',
              options: [
                { id: 'c10s4-qB', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
                { id: 'c10s4-qF', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
                { id: 'c10s4-qV', icon: 'letterTile', label: 'V', say: 'vve', correct: true },
                { id: 'c10s4-qY', icon: 'letterTile', label: 'Y', say: 'yyuh', correct: false },
              ],
            },
            {
              promptAudio: 'uuu',
              options: [
                { id: 'c10s4-qO2', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
                { id: 'c10s4-qU2', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
                { id: 'c10s4-qV2', icon: 'letterTile', label: 'V', say: 'vve', correct: false },
                { id: 'c10s4-qOO2', icon: 'letterTile', label: 'OO', say: 'uuu', correct: true },
              ],
            },
            {
              promptAudio: 'yyuh',
              options: [
                { id: 'c10s4-qY3', icon: 'letterTile', label: 'Y', say: 'yyuh', correct: true },
                { id: 'c10s4-qV3', icon: 'letterTile', label: 'V', say: 'vve', correct: false },
                { id: 'c10s4-qOO3', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
                { id: 'c10s4-qI3', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
              ],
            },
            // 누적 복습 (챕터 2의 I). Y의 활음 조음이 짧은 I와 가장 가깝다.
            {
              promptAudio: 'ihh',
              options: [
                { id: 'c10s4-qY4', icon: 'letterTile', label: 'Y', say: 'yyuh', correct: false },
                { id: 'c10s4-qI4', icon: 'letterTile', label: 'I', say: 'ihh', correct: true },
                { id: 'c10s4-qIE4', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
                { id: 'c10s4-qOO4', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
              ],
            },
            // 누적 복습 (직전 스테이지의 OO). 아직 낯선 새 글자다.
            {
              promptAudio: 'uuu',
              options: [
                { id: 'c10s4-qY5', icon: 'letterTile', label: 'Y', say: 'yyuh', correct: false },
                { id: 'c10s4-qO5', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
                { id: 'c10s4-qOO5', icon: 'letterTile', label: 'OO', say: 'uuu', correct: true },
                { id: 'c10s4-qV5', icon: 'letterTile', label: 'V', say: 'vve', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c10s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'yam' 사전 노출 (Y로 완성, A·M은 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'Y', say: 'yyuh' }, 'yam'],
        },
      ],
      recapKo: '이제 V, OO, Y를 모두 알아요! 히어로들이 합체할 준비를 해요!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 이제 세 소리를 모두 배웠어요.',
        en: ['yam', 'yes'],
      },
    },

    {
      id: 'c10-stage-5',
      order: 5,
      title: 'Boss: VAN and YAM!',
      villain: { name: 'Glitchking', art: 'glitchking', style: 'plat-glitch' },
      hero: { name: 'Turbo Gum', art: 'turbo-gum', style: 'plat-powerup' },
      chapterBoss: true,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y',
      ],
      beats: [
        {
          id: 'c10s5-teach',
          kind: 'teach',
          instructionKo: '세 히어로가 합체해요! 먼저 van을 만들어요.',
          repeatAudio: ['vve', 'aaa', 'nnn', 'van'],
        },
        {
          id: 'c10s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'V', say: 'vve' },
            { text: 'A', say: 'aaa' },
            { text: 'N', say: 'nnn' },
          ],
          target: ['V', 'A', 'N'],
        },
        {
          id: 'c10s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [{ text: 'V', say: 'vve' }, { text: 'A', say: 'aaa' }, { text: 'N', say: 'nnn' }, 'van'],
        },
        {
          id: 'c10s5-break',
          kind: 'break',
          instructionKo: '이번엔 yam이에요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['yyuh', 'aaa', 'mmm', 'yam'],
        },
        {
          id: 'c10s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'vve',
              options: [
                { id: 'c10s5-qF', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
                { id: 'c10s5-qY', icon: 'letterTile', label: 'Y', say: 'yyuh', correct: false },
                { id: 'c10s5-qOO', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
                { id: 'c10s5-qV', icon: 'letterTile', label: 'V', say: 'vve', correct: true },
              ],
            },
            {
              promptAudio: 'yyuh',
              options: [
                { id: 'c10s5-qY2', icon: 'letterTile', label: 'Y', say: 'yyuh', correct: true },
                { id: 'c10s5-qV2', icon: 'letterTile', label: 'V', say: 'vve', correct: false },
                { id: 'c10s5-qOO2', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
                { id: 'c10s5-qI2', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
              ],
            },
            {
              promptAudio: 'uuu',
              options: [
                { id: 'c10s5-qV3', icon: 'letterTile', label: 'V', say: 'vve', correct: false },
                { id: 'c10s5-qOO3', icon: 'letterTile', label: 'OO', say: 'uuu', correct: true },
                { id: 'c10s5-qO3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
                { id: 'c10s5-qY3', icon: 'letterTile', label: 'Y', say: 'yyuh', correct: false },
              ],
            },
            // 누적 복습 (챕터 3의 M). YAM의 마지막 소리라 지금 되꺼낼 값이 있다.
            {
              promptAudio: 'mmm',
              options: [
                { id: 'c10s5-qY4', icon: 'letterTile', label: 'Y', say: 'yyuh', correct: false },
                { id: 'c10s5-qV4', icon: 'letterTile', label: 'V', say: 'vve', correct: false },
                { id: 'c10s5-qM4', icon: 'letterTile', label: 'M', say: 'mmm', correct: true },
                { id: 'c10s5-qN4', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c10s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'N', say: 'nnn' },
            { text: 'V', say: 'vve' },
            { text: 'A', say: 'aaa' },
          ],
          target: ['V', 'A', 'N'],
          readAloud: { targetText: 'van' },
        },
        {
          id: 'c10s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c10s5-NVA', icon: 'letterTile', label: 'NVA', correct: false },
            { id: 'c10s5-ANV', icon: 'letterTile', label: 'ANV', correct: false },
            { id: 'c10s5-VAN', icon: 'letterTile', label: 'VAN', correct: true },
          ],
          readAloud: { targetText: 'van' },
        },
        {
          id: 'c10s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 yam을 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'M', say: 'mmm' },
            { text: 'Y', say: 'yyuh' },
            { text: 'A', say: 'aaa' },
          ],
          target: ['Y', 'A', 'M'],
          readAloud: { targetText: 'yam' },
        },
        {
          id: 'c10s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'yam도 천천히 따라 말해보세요.',
          words: [
            { text: 'Y', say: 'yyuh' },
            { text: 'A', say: 'aaa' },
            { text: 'M', say: 'mmm' },
            'yam',
          ],
        },
        {
          id: 'c10s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! VAN! YAM!',
          words: ['van', 'yam'],
        },
      ],
      recapKo: 'V-A-N은 VAN, Y-A-M은 YAM! 단어 두 개를 만들었어요! 챕터 10 클리어!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['van', 'yam'],
      },
    },
  ],
}
