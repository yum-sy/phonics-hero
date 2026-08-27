// Chapter 13 (DC-hero-flavored theme, 2nd appearance -- world 1's chapter 7
// was the first): OI, UE -> boss blends "COIN" + "CUE". Continues Jolly
// Phonics Group 7 (qu ou oi ue er ar) -- chapter 12 took QU/OU, this takes
// OI/UE, chapter 14 takes ER/AR.
//
// ============================================================================
// 이 챕터는 **새 글자가 둘뿐**이다 -- 5스테이지 구조를 유지하기 위해 4번째
// 스테이지가 "새 글자 없는 집중 복습" 이다(챕터 7~12의 "3번째 새 글자 teach"
// 자리를 대신한다). teach/break 없이 choose/multiselect/hard/choose-sequence
// 로만 구성했다 -- 검증기는 스테이지에 teach/break가 반드시 있어야 한다는
// 규칙이 없고(있으면 그 안의 repeatAudio만 검사한다), 실제로 필요하지도
// 않다: 이 스테이지는 가르칠 새 소리가 없다.
//
// ============================================================================
// 소리 표기 -- SOUND_TABLE(Group 7) 조회
// ============================================================================
// OI -> 'oi' (442/622ms, 'phoneme' 등급 -- oi/oy 철자 군집 전체가 /oi/로
// 수렴하는 것이 Samantha에서 증명됐다). UE -> 'u' (384/331ms, 'phoneme' 등급
// -- `u`==`you`==`ewe`==`yew` 가 Samantha에서 바이트 동일이고 그 소리가 UE의
// 목표음이다. **Alex에서는 다르게 렌더된다**는 표의 경고를 실기기 청취 때
// 반드시 확인해라).
//
// ============================================================================
// 아이콘 재고 -- 둘 다 0
// ============================================================================
// icons.js 69종에 coin/boy(OI), cue/blue/glue(UE) 어느 것도 없다. 그림 문항은
// 전부 누적 복습으로 채운다.
//
// 필요한 새 아이콘: coin, boy (OI), glue, blue (UE)
//
// ============================================================================
// 계열: DC 히어로(dc.js), 2회차 재사용
// ============================================================================
// 히어로는 챕터 7의 3개 구조 함수(dc-ray/jett/cloak)를 재사용하고 보스는
// dc-boss(조커 모티브)를 재사용한다. 빌런은 챕터 7의 5개 구조 함수
// (dc-blackout/mirage/gridlock/floodlight/nightfall)를 재사용하되 새 이름 --
// 색은 art.js 팔레트가 "챕터 7과 갈리게" 배정한다.
//
// ============================================================================
// 보스 단어: COIN (C+OI+N) · CUE (C+UE) -- 둘 다 이 챕터의 새 글자를 담는다
// ============================================================================
// 새 글자가 둘뿐이라 "가운데 글자 생략" 규칙이 적용되지 않는다(챕터 7/9/10/
// 11/12는 셋 중 하나를 뺐다). COIN은 C(챕터3 기지)+OI+N(챕터1/2 기지) 3슬롯,
// CUE는 C+UE 2슬롯(챕터 8의 TIE와 같은 계급)이다.

export const chapter13 = {
  id: 'chapter-13',
  order: 13,
  title: 'Shadow City Returns',
  stages: [
    {
      id: 'c13-stage-1',
      order: 1,
      title: 'A Coiling Sound',
      villain: { name: 'Blackspell', art: 'blackspell', style: 'dc-blackout' },
      hero: { name: 'Beacon', art: 'beacon', style: 'dc-ray' },
      chapterBoss: false,
      beats: [
        {
          id: 'c13s1-teach',
          kind: 'teach',
          instructionKo: 'Beacon이 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['oi'],
        },
        {
          id: 'c13s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '이 소리가 들어있는 단어예요! 따라 말해보세요.',
          words: ['coin', 'boy'],
        },
        {
          id: 'c13s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['oi'],
        },
        {
          id: 'c13s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"fish"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'fff',
          options: [
            { id: 'c13s1-fish5', icon: 'fish', label: 'fish', correct: true },
            { id: 'c13s1-dog5', icon: 'dog', label: 'dog', correct: false },
            { id: 'c13s1-pig3', icon: 'pig', label: 'pig', correct: false },
            { id: 'c13s1-ten5', icon: 'ten', label: 'ten', correct: false },
          ],
          readAloud: { targetText: 'fish' },
        },
        {
          id: 'c13s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"rat"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'rrr',
          options: [
            { id: 'c13s1-lion4', icon: 'lion', label: 'lion', correct: false },
            { id: 'c13s1-rat7', icon: 'rat', label: 'rat', correct: true },
            { id: 'c13s1-net18', icon: 'net', label: 'net', correct: false },
            { id: 'c13s1-fan16', icon: 'fan', label: 'fan', correct: false },
          ],
          readAloud: { targetText: 'rat' },
        },
        {
          id: 'c13s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/k/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c13s1-cat10', icon: 'cat', label: 'cat', correct: true },
            { id: 'c13s1-net19', icon: 'net', label: 'net', correct: false },
            { id: 'c13s1-cake6', icon: 'cake', label: 'cake', correct: true },
            { id: 'c13s1-fan17', icon: 'fan', label: 'fan', correct: false },
            { id: 'c13s1-cup16', icon: 'cup', label: 'cup', correct: true },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c13s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['boy', 'coin'],
        },
        {
          id: 'c13s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['coin'],
        },
      ],
      recapKo: '새로운 소리를 찾았어요! Coin, boy — 둘 다 이 소리가 들어있어요!',
      recapAudio: {
        ko: '새로운 소리를 배웠어요. 잘 들어보세요.',
        en: ['coin', 'boy'],
      },
    },

    {
      id: 'c13-stage-2',
      order: 2,
      title: 'Power of OI',
      villain: { name: 'Mirror Fade', art: 'mirror-fade', style: 'dc-mirage' },
      hero: { name: 'Beacon', art: 'beacon', style: 'dc-ray' },
      chapterBoss: false,
      beats: [
        {
          id: 'c13s2-teach',
          kind: 'teach',
          instructionKo: 'Beacon의 신호가 튀어오르는 것처럼 OI 소리를 내요!',
          art: 'hero',
          letter: 'OI',
          repeatAudio: ['oi'],
        },
        {
          id: 'c13s2-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: O(OI의 첫 요소)와 OA(비슷하게 생긴 둥근 다이그래프).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'oi',
          options: [
            { id: 'c13s2-O1', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c13s2-OA1', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c13s2-OI1', icon: 'letterTile', label: 'OI', say: 'oi', correct: true },
          ],
        },
        {
          id: 'c13s2-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // OI 그림이 0개라 그림 문항은 누적 복습으로 채운다.
          instructionKo: '"moon"과 같은 소리가 들어있는 걸 찾아보세요!',
          promptAudio: 'uuu',
          options: [
            { id: 'c13s2-hat13', icon: 'hat', label: 'hat', correct: false },
            { id: 'c13s2-bed7', icon: 'bed', label: 'bed', correct: false },
            { id: 'c13s2-sun5', icon: 'sun', label: 'sun', correct: false },
            { id: 'c13s2-moon5', icon: 'moon', label: 'moon', correct: true },
          ],
          readAloud: { targetText: 'moon' },
        },
        {
          id: 'c13s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 OI를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'OI', say: 'oi' }],
        },
        {
          id: 'c13s2-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 oi를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'oi',
          repeatAudio: ['oi'],
        },
        {
          id: 'c13s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/b/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c13s2-ball2', icon: 'ball', label: 'ball', correct: true },
            { id: 'c13s2-sun6', icon: 'sun', label: 'sun', correct: false },
            { id: 'c13s2-box12', icon: 'box', label: 'box', correct: true },
            { id: 'c13s2-cat11', icon: 'cat', label: 'cat', correct: false },
            { id: 'c13s2-bed8', icon: 'bed', label: 'bed', correct: true },
          ],
          readAloud: { targetText: 'ball' },
        },
        {
          id: 'c13s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개: O(OI의 첫 요소), OA(비슷한 둥근 다이그래프), OU(직전
          // 챕터의 다이그래프), OR(첫 글자가 같다).
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'oi',
          options: [
            { id: 'c13s2-OI3', icon: 'letterTile', label: 'OI', say: 'oi', correct: true },
            { id: 'c13s2-O3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c13s2-OA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c13s2-OU3', icon: 'letterTile', label: 'OU', say: 'ou', correct: false },
            { id: 'c13s2-OR3', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
          ],
          readAloud: { targetText: 'OI', say: 'oi' },
        },
        {
          id: 'c13s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 챕터 12의 OU(house 대체 -- 아이콘이 없으니 OR의 horse로 복습한다).
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'OR',
          options: [
            { id: 'c13s2-net20', icon: 'net', label: 'net', correct: false },
            { id: 'c13s2-horse5', icon: 'horse', label: 'horse', correct: true },
            { id: 'c13s2-cup17', icon: 'cup', label: 'cup', correct: false },
            { id: 'c13s2-bed9', icon: 'bed', label: 'bed', correct: false },
          ],
          readAloud: { targetText: 'horse' },
        },
        {
          id: 'c13s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['coin', 'boy'],
        },
        {
          id: 'c13s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'coin' 사전 노출 (OI로 완성, C·N은 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'C', say: 'kuh' }, { text: 'OI', say: 'oi' }, 'coin'],
        },
      ],
      recapKo: 'OI는 신호가 튀어오르는 것처럼 소리를 내요 — coin, boy!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 코인, 보이!',
        en: ['coin', 'boy'],
      },
    },

    {
      id: 'c13-stage-3',
      order: 3,
      title: 'Power of UE',
      villain: { name: 'Static Lock', art: 'static-lock', style: 'dc-gridlock' },
      hero: { name: 'Cascade', art: 'cascade', style: 'dc-cloak' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH', 'TH', 'QU', 'OU', 'OI', 'UE',
      ],
      beats: [
        {
          id: 'c13s3-teach',
          // UE는 U가 자기 이름을 말할 때 소리를 낸다 -- AI(a)/IE(eye)와 같은
          // Jolly의 장치다(SOUND_TABLE의 UE 행 참조: u=="you"=="ewe" 등이
          // Samantha에서 바이트 동일).
          kind: 'teach',
          instructionKo: 'UE는 U가 자기 이름을 말할 때처럼 소리를 내요!',
          art: 'hero',
          letter: 'UE',
          repeatAudio: ['u'],
        },
        {
          id: 'c13s3-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: U(짧은 U, 덮어쓰기 대상)와 OO(비슷한 둥근 모음).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'u',
          options: [
            { id: 'c13s3-UE1', icon: 'letterTile', label: 'UE', say: 'u', correct: true },
            { id: 'c13s3-U1', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
            { id: 'c13s3-OO1', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
          ],
        },
        {
          id: 'c13s3-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"pen"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'puh',
          options: [
            { id: 'c13s3-duck6', icon: 'duck', label: 'duck', correct: false },
            { id: 'c13s3-gum7', icon: 'gum', label: 'gum', correct: false },
            { id: 'c13s3-hen5', icon: 'hen', label: 'hen', correct: false },
            { id: 'c13s3-pen3', icon: 'pen', label: 'pen', correct: true },
          ],
          readAloud: { targetText: 'pen' },
        },
        {
          id: 'c13s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 UE를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'UE', say: 'u' }],
        },
        {
          id: 'c13s3-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 ue를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'ue',
          repeatAudio: ['u'],
        },
        {
          id: 'c13s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/s/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c13s3-sun7', icon: 'sun', label: 'sun', correct: true },
            { id: 'c13s3-net21', icon: 'net', label: 'net', correct: false },
            { id: 'c13s3-sock', icon: 'sock', label: 'sock', correct: true },
            { id: 'c13s3-fan18', icon: 'fan', label: 'fan', correct: false },
            { id: 'c13s3-star', icon: 'star', label: 'star', correct: true },
          ],
          readAloud: { targetText: 'sun' },
        },
        {
          id: 'c13s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답 4개: U(짧은 U, 덮어쓰기 대상), OO(비슷한 둥근 모음), IE/OI
          // (다른 이중모음 다이그래프).
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'u',
          options: [
            { id: 'c13s3-U3', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
            { id: 'c13s3-OO3', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
            { id: 'c13s3-IE3b', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
            { id: 'c13s3-OI3b', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
            { id: 'c13s3-UE3', icon: 'letterTile', label: 'UE', say: 'u', correct: true },
          ],
          readAloud: { targetText: 'UE', say: 'u' },
        },
        {
          id: 'c13s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'X',
          options: [
            { id: 'c13s3-mat9', icon: 'mat', label: 'mat', correct: false },
            { id: 'c13s3-box13', icon: 'box', label: 'box', correct: true },
            { id: 'c13s3-fan19', icon: 'fan', label: 'fan', correct: false },
            { id: 'c13s3-hat14', icon: 'hat', label: 'hat', correct: false },
          ],
          readAloud: { targetText: 'box' },
        },
        {
          id: 'c13s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['cue', 'glue'],
        },
        {
          id: 'c13s3-r8-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          // 스텝 5개(새 글자 2 + 누적 복습 3, 새 글자가 하나 적은 대신 복습을
          // 하나 늘렸다). 복습 대상: U(UE가 덮어쓰는 짧은 모음), C(보스 단어
          // COIN·CUE 양쪽에 쓰인다), OA(OI와 비슷한 둥근 다이그래프).
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'oi',
              options: [
                { id: 'c13s3-qO', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
                { id: 'c13s3-qUE', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
                { id: 'c13s3-qOI', icon: 'letterTile', label: 'OI', say: 'oi', correct: true },
                { id: 'c13s3-qOA', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
              ],
            },
            {
              promptAudio: 'u',
              options: [
                { id: 'c13s3-qOI2', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
                { id: 'c13s3-qU2', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
                { id: 'c13s3-qOO2', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
                { id: 'c13s3-qUE2', icon: 'letterTile', label: 'UE', say: 'u', correct: true },
              ],
            },
            // 누적 복습 (챕터 5의 U). UE가 덮어쓰는 짧은 모음이다.
            {
              promptAudio: 'uh',
              options: [
                { id: 'c13s3-qU3', icon: 'letterTile', label: 'U', say: 'uh', correct: true },
                { id: 'c13s3-qUE3', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
                { id: 'c13s3-qOI3', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
                { id: 'c13s3-qOO3', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
              ],
            },
            // 누적 복습 (챕터 3의 C). 보스 단어 COIN·CUE 양쪽의 첫 소리다.
            {
              promptAudio: 'kuh',
              options: [
                { id: 'c13s3-qUE4', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
                { id: 'c13s3-qC4', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
                { id: 'c13s3-qOI4', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
                { id: 'c13s3-qG4', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
              ],
            },
            // 누적 복습 (챕터 7의 OA). OI와 비슷한 둥근 다이그래프다.
            {
              promptAudio: 'oh',
              options: [
                { id: 'c13s3-qOI5', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
                { id: 'c13s3-qUE5', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
                { id: 'c13s3-qOA5', icon: 'letterTile', label: 'OA', say: 'oh', correct: true },
                { id: 'c13s3-qOR5', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c13s3-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'cue' 사전 노출 (C+UE로 완성).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'C', say: 'kuh' }, { text: 'UE', say: 'u' }, 'cue'],
        },
      ],
      recapKo: '이제 OI, UE를 모두 알아요! Beacon과 Cascade가 힘을 합쳐요!',
      recapAudio: {
        ko: '이 글자는 이런 소리를 내요. 이제 두 소리를 모두 배웠어요.',
        en: ['cue', 'glue'],
      },
    },

    {
      id: 'c13-stage-4',
      order: 4,
      title: 'Signal Overload',
      villain: { name: 'Flare Static', art: 'flare-static', style: 'dc-floodlight' },
      hero: { name: 'Beacon', art: 'beacon', style: 'dc-ray' },
      chapterBoss: false,
      // 이 챕터는 새 글자가 둘뿐이라 5스테이지를 채우려면 새 글자 없는 집중
      // 복습 스테이지가 필요하다(파일 헤더 참조). teach/break가 없다.
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH', 'TH', 'QU', 'OU', 'OI', 'UE',
      ],
      beats: [
        {
          id: 'c13s4-r1',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'OI와 UE 소리를 다시 연습해요! 이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'oi',
          options: [
            { id: 'c13s4-OA1', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c13s4-UE1', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
            { id: 'c13s4-OR1', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
            { id: 'c13s4-OI1', icon: 'letterTile', label: 'OI', say: 'oi', correct: true },
          ],
          readAloud: { targetText: 'OI', say: 'oi' },
        },
        {
          id: 'c13s4-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'u',
          options: [
            { id: 'c13s4-UE2', icon: 'letterTile', label: 'UE', say: 'u', correct: true },
            { id: 'c13s4-U2', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
            { id: 'c13s4-OI2', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
            { id: 'c13s4-OO2', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
          ],
          readAloud: { targetText: 'UE', say: 'u' },
        },
        {
          id: 'c13s4-r3-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/n/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c13s4-nose2', icon: 'nose', label: 'nose', correct: true },
            { id: 'c13s4-mat10', icon: 'mat', label: 'mat', correct: false },
            { id: 'c13s4-nut2', icon: 'nut', label: 'nut', correct: true },
            { id: 'c13s4-fan20', icon: 'fan', label: 'fan', correct: false },
            { id: 'c13s4-net22', icon: 'net', label: 'net', correct: true },
          ],
          readAloud: { targetText: 'nose' },
        },
        {
          id: 'c13s4-r4-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'oi',
          options: [
            { id: 'c13s4-OU4', icon: 'letterTile', label: 'OU', say: 'ou', correct: false },
            { id: 'c13s4-UE4', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
            { id: 'c13s4-OA4', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c13s4-OI4', icon: 'letterTile', label: 'OI', say: 'oi', correct: true },
            { id: 'c13s4-O4', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
          ],
          readAloud: { targetText: 'OI', say: 'oi' },
        },
        {
          id: 'c13s4-r5-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'oi',
              options: [
                { id: 'c13s4-qUE', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
                { id: 'c13s4-qOA', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c13s4-qOI', icon: 'letterTile', label: 'OI', say: 'oi', correct: true },
                { id: 'c13s4-qOR', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
              ],
            },
            {
              promptAudio: 'u',
              options: [
                { id: 'c13s4-qOI2', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
                { id: 'c13s4-qOO2', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
                { id: 'c13s4-qU2', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
                { id: 'c13s4-qUE2', icon: 'letterTile', label: 'UE', say: 'u', correct: true },
              ],
            },
            // 누적 복습 (챕터 6의 B). 보스 단어에는 없지만 이 챕터 전체에서
            // 아직 한 번도 복습되지 않았다.
            {
              promptAudio: 'buh',
              options: [
                { id: 'c13s4-qB3', icon: 'letterTile', label: 'B', say: 'buh', correct: true },
                { id: 'c13s4-qOI3', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
                { id: 'c13s4-qUE3', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
                { id: 'c13s4-qG3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
              ],
            },
            {
              promptAudio: 'kuh',
              options: [
                { id: 'c13s4-qUE4', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
                { id: 'c13s4-qK4', icon: 'letterTile', label: 'K', say: 'kuh', correct: true },
                { id: 'c13s4-qOI4', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
                { id: 'c13s4-qOR4', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c13s4-r6-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['coin', 'cue'],
        },
        {
          id: 'c13s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['coin'],
        },
      ],
      recapKo: 'OI와 UE를 다시 연습했어요! 이제 합체할 준비 완료예요!',
      recapAudio: {
        ko: '두 소리를 다시 연습했어요. 이제 준비됐어요.',
        en: ['oi', 'u'],
      },
    },

    {
      id: 'c13-stage-5',
      order: 5,
      title: 'Boss: COIN and CUE!',
      villain: { name: 'Nightshade', art: 'nightshade', style: 'dc-nightfall' },
      hero: { name: 'Nightray Prime', art: 'nightray-prime', style: 'dc-boss' },
      chapterBoss: true,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
        'Z', 'W', 'NG', 'V', 'OO', 'Y', 'X', 'CH', 'SH', 'TH', 'QU', 'OU', 'OI', 'UE',
      ],
      beats: [
        {
          id: 'c13s5-teach',
          kind: 'teach',
          instructionKo: 'Beacon + Cascade가 합체해요! 먼저 coin을 만들어요.',
          repeatAudio: ['kuh', 'oi', 'nnn', 'coin'],
        },
        {
          id: 'c13s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'C', say: 'kuh' },
            { text: 'OI', say: 'oi' },
            { text: 'N', say: 'nnn' },
          ],
          target: ['C', 'OI', 'N'],
        },
        {
          id: 'c13s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [{ text: 'C', say: 'kuh' }, { text: 'OI', say: 'oi' }, { text: 'N', say: 'nnn' }, 'coin'],
        },
        {
          id: 'c13s5-break',
          kind: 'break',
          instructionKo: '이번엔 cue예요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['kuh', 'u', 'cue'],
        },
        {
          id: 'c13s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'oi',
              options: [
                { id: 'c13s5-qOA', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c13s5-qUE', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
                { id: 'c13s5-qOI', icon: 'letterTile', label: 'OI', say: 'oi', correct: true },
                { id: 'c13s5-qOR', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
              ],
            },
            {
              promptAudio: 'u',
              options: [
                { id: 'c13s5-qOI2', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
                { id: 'c13s5-qOO2', icon: 'letterTile', label: 'OO', say: 'uuu', correct: false },
                { id: 'c13s5-qU2', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
                { id: 'c13s5-qUE2', icon: 'letterTile', label: 'UE', say: 'u', correct: true },
              ],
            },
            // 누적 복습 (챕터 3의 C). 보스 단어 두 개의 공통 첫 소리다.
            {
              promptAudio: 'kuh',
              options: [
                { id: 'c13s5-qC3', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
                { id: 'c13s5-qOI3', icon: 'letterTile', label: 'OI', say: 'oi', correct: false },
                { id: 'c13s5-qUE3', icon: 'letterTile', label: 'UE', say: 'u', correct: false },
                { id: 'c13s5-qG3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c13s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'N', say: 'nnn' },
            { text: 'C', say: 'kuh' },
            { text: 'OI', say: 'oi' },
          ],
          target: ['C', 'OI', 'N'],
          readAloud: { targetText: 'coin' },
        },
        {
          id: 'c13s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c13s5-NCOI', icon: 'letterTile', label: 'NCOI', correct: false },
            { id: 'c13s5-COIN', icon: 'letterTile', label: 'COIN', correct: true },
            { id: 'c13s5-OINC', icon: 'letterTile', label: 'OINC', correct: false },
          ],
          readAloud: { targetText: 'coin' },
        },
        {
          id: 'c13s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 cue를 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'UE', say: 'u' },
            { text: 'C', say: 'kuh' },
          ],
          target: ['C', 'UE'],
          readAloud: { targetText: 'cue' },
        },
        {
          id: 'c13s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'cue도 천천히 따라 말해보세요.',
          words: [{ text: 'C', say: 'kuh' }, { text: 'UE', say: 'u' }, 'cue'],
        },
        {
          id: 'c13s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! COIN! CUE!',
          words: ['coin', 'cue'],
        },
      ],
      recapKo: 'C-OI-N은 COIN, C-UE는 CUE! 단어 두 개를 만들었어요! 챕터 13 클리어!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['coin', 'cue'],
      },
    },
  ],
}
