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
// --- 아이콘 사정 (이 챕터는 세 소리 다 그림이 있다) ---
// L=`lion`/`leg`, F=`fish`/`fan`, B=`ball`/`bed`/`box`/`bus`. B 가 4개라
// multiselect(정답 2개 이상)까지 이 챕터 소리로 성립하는 유일한 챕터다.
//
// **오답을 무작위로 고르지 않는다** -- 세 소리 모두 한국어 화자의 실제 오류에
// 맞춰 근접쌍을 붙였다: /l/↔/r/(R 은 챕터 4 기지), /f/↔/p/(한국어에 /f/ 가
// 없어 ㅍ 로 대치하는 대표 오류, P 는 챕터 2 기지), /b/↔/p/(유무성 짝).
// 그림 문항이라 발화되는 건 단어이므로 buh/duh 충돌쌍 규칙과 무관하다.
// multiselect 한 슬롯씩은 앞 챕터 누적 복습으로 남겨뒀다.
//
// ============================================================================
// 난이도 곡선 파일럿 (이 라운드) -- CLAUDE.md/HANDOFF.md 의 "챕터 간 누적
// 복습이 설계되지 않았다" 항목에 대한 첫 실행. 전체 분석과 전 챕터 계획은
// CLAUDE.md 를 보라. 요약: 챕터 8 이 이미 확립한 역할별 표(warmup 3 유지 /
// 표준 4 / hard 5 / wordspot 3 유지 / multiselect 는 이 챕터에서 유지)를
// 챕터 6 에 소급 적용해 챕터 7 로 이어지는 연속선을 만든다(챕터 6·7 모두
// 표준 4·hard 5 로 맞춰 챕터 8 진입 시 단절이 없다).
//
// 늘리지 않은 것: **oddoneout(과반 일치) 형식은 아이콘 재고가 한 소리에
// 그림 2개뿐인 경우 3 -> 4 로 못 늘린다** -- 과반을 3개로 채우려면 같은
// 소리 그림이 3개 필요한데, /l/(lion/leg) 와 /f/(fish/fan) 는 각각 2개뿐이다.
// **유일한 예외가 /b/**(ball/bed/box/bus, 4개)라 c6s4-r2-oddoneout 만 실제로
// 늘렸다. 나머지 oddoneout(c6s1-r2, c6s2-r2, c6s3-r2)은 아이콘 담당의 신규
// 그림 없이는 손대지 않는다 -- 이 파일 소유자가 icons.js 를 건드리지 않는다.
// promptAudio 로 목표 소리를 직접 지목하는 형식(과반 불필요, "match" 형)과
// reversed(promptLetter -> 그림, 오답이 서로 다른 소리이기만 하면 됨)는
// 이 제약이 없어서 전부 늘렸다. letterTile 기반(hard, choose-sequence 스텝)도
// SOUND_TABLE 전체가 후보 풀이라 제약이 없다.
// ============================================================================
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
          repeatAudio: ['lll'],
        },
        {
          id: 'c6s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          // /l/ 그림이 0개라 아이콘이 필요 없는 beat 로 /l/ 를 나른다.
          instructionKo: 'L 소리로 시작하는 단어예요! 따라 말해보세요.',
          words: ['lap', 'lid'],
        },
        {
          id: 'c6s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['lll'],
        },
        {
          id: 'c6s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c6s1-lion', icon: 'lion', label: 'lion', correct: false },
            { id: 'c6s1-dog', icon: 'dog', label: 'dog', correct: true },
            { id: 'c6s1-leg', icon: 'leg', label: 'leg', correct: false },
          ],
          readAloud: { targetText: 'lion' },
        },
        {
          id: 'c6s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"hen"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'hen',
          // 보기 3 -> 4 (난이도 곡선, CLAUDE.md 참조). 이 형식(promptAudio 로
          // 목표 소리를 직접 지목)은 나머지 보기가 서로 같은 소리일 필요가
          // 없어 아이콘 재고 제약 없이 확장할 수 있다 -- oddoneout(과반 일치)
          // 형식과 다르다.
          options: [
            { id: 'c6s1-dog2', icon: 'dog', label: 'dog', correct: false },
            { id: 'c6s1-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c6s1-egg', icon: 'egg', label: 'egg', correct: false },
            { id: 'c6s1-hat', icon: 'hat', label: 'hat', correct: true },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c6s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/p/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
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
      recapKo: '/l/ 소리를 찾았어요! Lap, lid<br>— 모두 L로 시작해요!',
      recapAudio: {
        ko: '을 소리를 찾았어요! 잘 들어보세요.',
        en: ['lap', 'lid'],
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
          instructionKo: 'L은 Leo가 씩씩하게 행진할 때처럼 L 소리를 내요!',
          art: 'hero',
          letter: 'L',
          repeatAudio: ['L', 'lll'],
        },
        {
          id: 'c6s2-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'L 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'lll',
          // 혼동 보기는 R 하나 -- L/R 은 한국어 화자에게 최대 난점이라
          // 의도적으로 반복 노출한다(합성기 결함이 아니라 학습 목표).
          options: [
            { id: 'c6s2-R1', icon: 'letterTile', label: 'R', say: 'rrr', correct: false },
            { id: 'c6s2-L1', icon: 'letterTile', label: 'L', say: 'lll', correct: true },
            { id: 'c6s2-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
          ],
        },
        {
          id: 'c6s2-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답이 /r/ 이다 -- 한국어 화자에게 /l/ 대 /r/ 이 최대 난점이고
          // R 은 챕터 4 에서 이미 배웠으므로 여기가 이 대비를 넣을 첫 지점이다.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c6s2-rat', icon: 'rat', label: 'rat', correct: true },
            { id: 'c6s2-lion', icon: 'lion', label: 'lion', correct: false },
            { id: 'c6s2-leg', icon: 'leg', label: 'leg', correct: false },
          ],
          readAloud: { targetText: 'lion' },
        },
        {
          id: 'c6s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 L을 따라 그리면서 L 소리를 내보세요!',
          words: [{ text: 'L', say: 'lll' }],
        },
        {
          id: 'c6s2-break',
          kind: 'break',
          // **소문자 교육 도입(이 라운드)에서 L 은 제외한다.** 렌더로 실제 확인했다
          // (probe `?iso=c6-stage-2:break`, San Francisco Rounded 계열): 소문자 'l'
          // 은 세로 막대 하나로 렌더되어 이미 챕터 2 에서 가르친 대문자 'I' 와
          // 화면상 구별이 안 된다(둘 다 순수 수직선). "이건 소문자 l 이에요" 라고
          // 말하면서 아이가 이미 아는 I 와 똑같이 생긴 것을 보여주면 가르치기는커녕
          // L/I 를 헷갈리게 만든다 -- 안 가르치느니만 못하다. 챕터 3 의 K 예외와
          // 같은 자리지만 원인이 다르다(K 는 커리큘럼상 유일 노출 자리라 보존,
          // L 은 이 폰트에서 소문자 글자꼴 자체가 모호해서 보류). 폰트를 바꾸거나
          // 세리프가 있는 대체 렌더링을 쓸 수 있으면 재검토하되, 그건 style.css
          // 소유자의 판단이다.
          instructionKo: '손가락으로 L을 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'L',
          repeatAudio: ['L', 'lll'],
        },
        {
          id: 'c6s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/h/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
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
          instructionKo: 'L 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'lll',
          // 보기 3 -> 5 (난이도 곡선, CLAUDE.md 참조). D 를 넣어도 안전하다 --
          // buh/duh 충돌쌍은 B 가 걸린 문항에만 해당하고, 여기는 B 가 없다.
          options: [
            { id: 'c6s2-R3', icon: 'letterTile', label: 'R', say: 'rrr', correct: false },
            { id: 'c6s2-D3', icon: 'letterTile', label: 'D', say: 'duh', correct: false },
            { id: 'c6s2-M3', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
            { id: 'c6s2-N3', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
            { id: 'c6s2-L3', icon: 'letterTile', label: 'L', say: 'lll', correct: true },
          ],
          readAloud: { targetText: 'L', say: 'lll' },
        },
        {
          id: 'c6s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'L',
          // 보기 3 -> 4 (난이도 곡선). 오답은 서로 다른 소리이기만 하면 되므로
          // (과반 일치가 필요한 oddoneout 과 다르다) 아이콘 재고 제약이 없다.
          options: [
            { id: 'c6s2-leg2', icon: 'leg', label: 'leg', correct: true },
            { id: 'c6s2-dog2', icon: 'dog', label: 'dog', correct: false },
            { id: 'c6s2-egg', icon: 'egg', label: 'egg', correct: false },
            { id: 'c6s2-net', icon: 'net', label: 'net', correct: false },
          ],
          readAloud: { targetText: 'leg' },
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
      recapKo: 'L은 L 소리를 내요 — lap, lid! R의 R 소리와 헷갈리지 마세요!',
      recapAudio: {
        ko: '을은 이런 소리를 내요. 아르 소리와 다르니 잘 들어보세요.',
        en: ['lap', 'lid'],
      },
    },

    {
      id: 'c6-stage-3',
      order: 3,
      title: 'Power of F',
      villain: { name: 'Boxxy', art: 'boxxy', style: 'toy' },
      hero: { name: 'Fifi', art: 'fifi', style: 'toy' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F',
      ],
      beats: [
        {
          id: 'c6s3-teach',
          kind: 'teach',
          instructionKo: 'F는 Fifi가 바람을 내뿜을 때처럼 F 소리를 내요!',
          art: 'hero',
          letter: 'F',
          repeatAudio: ['F', 'fff'],
        },
        {
          id: 'c6s3-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'F 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'fff',
          // 혼동 보기는 S 하나 -- 둘 다 무성마찰음이라 살짝 대비된다.
          options: [
            { id: 'c6s3-S1', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c6s3-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
            { id: 'c6s3-F1', icon: 'letterTile', label: 'F', say: 'fff', correct: true },
          ],
        },
        {
          id: 'c6s3-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답이 /p/ 다 -- 한국어에 /f/ 가 없어 ㅍ 로 대치하는 게 대표 오류이고
          // P 는 챕터 2 에서 이미 배웠다. 무작위 오답보다 훨씬 나은 연습이다.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c6s3-fish', icon: 'fish', label: 'fish', correct: false },
            { id: 'c6s3-pig', icon: 'pig', label: 'pig', correct: true },
            { id: 'c6s3-fan', icon: 'fan', label: 'fan', correct: false },
          ],
          readAloud: { targetText: 'fish' },
        },
        {
          id: 'c6s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 F를 따라 그리면서 F 소리를 내보세요!',
          words: [{ text: 'F', say: 'fff' }],
        },
        {
          id: 'c6s3-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 f를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'f',
          repeatAudio: ['F', 'fff'],
        },
        {
          id: 'c6s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/e/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
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
          instructionKo: 'F 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'fff',
          // 보기 3 -> 5 (난이도 곡선). P 는 /f/->/p/ 대치(한국어에 /f/ 가 없어
          // 생기는 대표 오류)와 정확히 같은 근접쌍이라 오답으로 넣을 값이 있다
          // (오답이 근접쌍이어야 한다는 이 챕터의 원칙, 파일 헤더 참조).
          options: [
            { id: 'c6s3-F3', icon: 'letterTile', label: 'F', say: 'fff', correct: true },
            { id: 'c6s3-S3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
            { id: 'c6s3-P3', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
            { id: 'c6s3-K3', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
            { id: 'c6s3-G3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
          ],
          readAloud: { targetText: 'F', say: 'fff' },
        },
        {
          id: 'c6s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'F',
          // 보기 3 -> 4 (난이도 곡선).
          options: [
            { id: 'c6s3-hat2', icon: 'hat', label: 'hat', correct: false },
            { id: 'c6s3-fan2', icon: 'fan', label: 'fan', correct: true },
            { id: 'c6s3-net', icon: 'net', label: 'net', correct: false },
            { id: 'c6s3-box', icon: 'box', label: 'box', correct: false },
          ],
          readAloud: { targetText: 'fan' },
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
      recapKo: 'F는 F 소리를 내요 — fit, fan! L의 L 소리도 기억하고 있어요!',
      recapAudio: {
        ko: '에프는 이런 소리를 내요. 을 소리도 아직 기억하고 있어요.',
        en: ['fit', 'fan'],
      },
    },

    {
      id: 'c6-stage-4',
      order: 4,
      title: 'Power of B',
      villain: { name: 'Tumbles', art: 'tumbles', style: 'toy' },
      hero: { name: 'Bobo', art: 'bobo', style: 'toy' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B',
      ],
      beats: [
        {
          id: 'c6s4-teach',
          kind: 'teach',
          instructionKo: 'B는 Bobo가 블록을 쌓을 때처럼 B 소리를 내요!',
          art: 'hero',
          letter: 'B',
          repeatAudio: ['B', 'buh'],
        },
        {
          id: 'c6s4-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'B 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'buh',
          // 혼동 보기는 P 하나 -- buh/puh 는 합성기에서 명백히 다른 음소로
          // 측정됐다(회전 혼동이지만 소리는 다르다, 챕터4가 D 의 소리 변별
          // 상대로 P 를 쓴 것과 같은 논리). D 는 여기 절대 넣지 않는다
          // (SPEECH_COLLISION_PAIRS).
          options: [
            { id: 'c6s4-P1', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
            { id: 'c6s4-M1', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
            { id: 'c6s4-B1', icon: 'letterTile', label: 'B', say: 'buh', correct: true },
          ],
        },
        {
          id: 'c6s4-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 오답이 /p/ 다 -- /b/ 와 /p/ 는 같은 자리 유무성 짝이라 진짜 근접쌍이다.
          // 그림 문항이므로 발화되는 건 단어이고, buh/duh 충돌쌍 규칙은
          // letterTile 보기에만 적용된다.
          // 보기 3 -> 4. 이 챕터는 유일하게 B 그림이 4개(ball/bed/box/bus)라
          // 과반(box 추가로 3개) + 오답 1개(pot) 형태의 oddoneout 을 늘릴 수
          // 있다 -- 다른 소리들은 그림이 2개뿐이라 이 형식을 못 늘린다(파일
          // 헤더의 "아이콘 사정" 참조, CLAUDE.md 의 난이도 곡선 절도 참조).
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'c6s4-ball', icon: 'ball', label: 'ball', correct: false },
            { id: 'c6s4-box2', icon: 'box', label: 'box', correct: false },
            { id: 'c6s4-pot', icon: 'pot', label: 'pot', correct: true },
            { id: 'c6s4-bed2', icon: 'bed', label: 'bed', correct: false },
          ],
          readAloud: { targetText: 'ball' },
        },
        {
          id: 'c6s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 B를 따라 그리면서 B 소리를 내보세요!',
          words: [{ text: 'B', say: 'buh' }],
        },
        {
          id: 'c6s4-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 b를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'b',
          repeatAudio: ['B', 'buh'],
        },
        {
          id: 'c6s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // /b/ 그림이 ball/bed/box/bus 네 개라 정답 2개를 세울 수 있다.
          // 오답 하나는 /p/ 로 두어 유무성 짝을 계속 맞붙인다.
          instructionKo: '/b/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c6s4-box', icon: 'box', label: 'box', correct: true },
            { id: 'c6s4-pig', icon: 'pig', label: 'pig', correct: false },
            { id: 'c6s4-bus', icon: 'bus', label: 'bus', correct: true },
            { id: 'c6s4-moon', icon: 'moon', label: 'moon', correct: false },
          ],
          readAloud: { targetText: 'box' },
        },
        {
          id: 'c6s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'B 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'buh',
          // 보기 3 -> 5 (난이도 곡선). D 는 절대 넣지 않는다 -- buh/duh 는
          // 확정 충돌쌍이다(SPEECH_COLLISION_PAIRS, 파일 헤더 참조).
          options: [
            { id: 'c6s4-B3', icon: 'letterTile', label: 'B', say: 'buh', correct: true },
            { id: 'c6s4-P3', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
            { id: 'c6s4-T3', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c6s4-G3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
            { id: 'c6s4-K3', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
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
            { id: 'c6s4-shape-p', icon: 'letterTile', label: 'p', correct: false },
            { id: 'c6s4-shape-b', icon: 'letterTile', label: 'b', correct: true },
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
          // 보기 3 -> 4 (난이도 곡선).
          options: [
            { id: 'c6s4-bed', icon: 'bed', label: 'bed', correct: true },
            { id: 'c6s4-moon2', icon: 'moon', label: 'moon', correct: false },
            { id: 'c6s4-egg2', icon: 'egg', label: 'egg', correct: false },
            { id: 'c6s4-cup', icon: 'cup', label: 'cup', correct: false },
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
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          // 스텝당 보기 3 -> 4 (난이도 곡선, CLAUDE.md 참조). D(duh)는 B(buh)가
          // 있는 스텝(2·3·4)에 절대 넣지 않는다 -- 확정 충돌쌍이다.
          steps: [
            {
              promptAudio: 'lll',
              options: [
                { id: 'c6s4-qF', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
                { id: 'c6s4-qB', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
                { id: 'c6s4-qG', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
                { id: 'c6s4-qL', icon: 'letterTile', label: 'L', say: 'lll', correct: true },
              ],
            },
            {
              promptAudio: 'fff',
              options: [
                { id: 'c6s4-qB2', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
                { id: 'c6s4-qF2', icon: 'letterTile', label: 'F', say: 'fff', correct: true },
                { id: 'c6s4-qL2', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
                { id: 'c6s4-qP2', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
              ],
            },
            {
              promptAudio: 'buh',
              options: [
                { id: 'c6s4-qB3', icon: 'letterTile', label: 'B', say: 'buh', correct: true },
                { id: 'c6s4-qL3', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
                { id: 'c6s4-qF3', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
                { id: 'c6s4-qG3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
              ],
            },
            // 누적 복습(챕터 4 의 R). L 을 배우는 순간 가장 위험해지는 앞 글자가
            // R 이다 -- 한국어 화자에게 /l/ 대 /r/ 이 최대 난점이라 새로 배운 L 이
            // R 을 덮어쓴다. 오답이 L 이라 이 스텝이 곧 그 변별 시험이다.
            // rrr 대 lll 은 두 음성 20x 에서 23.1~27.9초 벌어진다(별개 음소).
            {
              promptAudio: 'rrr',
              options: [
                { id: 'c6s4-qL4', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
                { id: 'c6s4-qR', icon: 'letterTile', label: 'R', say: 'rrr', correct: true },
                { id: 'c6s4-qB4', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
                { id: 'c6s4-qM4', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
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
        en: ['bag', 'bed'],
      },
    },

    {
      id: 'c6-stage-5',
      order: 5,
      title: 'Boss: FIT and BIG!',
      villain: { name: 'Wind-Down', art: 'wind-down', style: 'toy' },
      hero: { name: 'Captain Big', art: 'captain-big', style: 'toy' },
      chapterBoss: true,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B',
      ],
      beats: [
        {
          id: 'c6s5-teach',
          kind: 'teach',
          instructionKo: 'Leo + Fifi + Bobo가 합체해요! 먼저 fit을 만들어요.',
          repeatAudio: ['fff', 'ihh', 'tuh', 'fit'],
        },
        {
          id: 'c6s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'F', say: 'fff' },
            { text: 'I', say: 'ihh' },
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
            { text: 'I', say: 'ihh' },
            { text: 'T', say: 'tuh' },
            'fit',
          ],
        },
        {
          id: 'c6s5-break',
          kind: 'break',
          instructionKo: '이번엔 big이에요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['buh', 'ihh', 'guh', 'big'],
        },
        {
          id: 'c6s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          // 스텝당 보기 3 -> 4 (난이도 곡선, CLAUDE.md 참조). D(duh)는 B(buh)가
          // 있는 스텝에 절대 넣지 않는다 -- 확정 충돌쌍이다.
          steps: [
            {
              promptAudio: 'fff',
              options: [
                { id: 'c6s5-qB', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
                { id: 'c6s5-qL', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
                { id: 'c6s5-qF', icon: 'letterTile', label: 'F', say: 'fff', correct: true },
                { id: 'c6s5-qP1', icon: 'letterTile', label: 'P', say: 'puh', correct: false },
              ],
            },
            {
              promptAudio: 'buh',
              options: [
                { id: 'c6s5-qL2', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
                { id: 'c6s5-qB2', icon: 'letterTile', label: 'B', say: 'buh', correct: true },
                { id: 'c6s5-qF2', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
                { id: 'c6s5-qG2', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
              ],
            },
            {
              promptAudio: 'lll',
              options: [
                { id: 'c6s5-qL3', icon: 'letterTile', label: 'L', say: 'lll', correct: true },
                { id: 'c6s5-qF3', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
                { id: 'c6s5-qB3', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
                { id: 'c6s5-qR3', icon: 'letterTile', label: 'R', say: 'rrr', correct: false },
              ],
            },
            // 누적 복습(챕터 2 의 P). 한국어에 /f/ 가 없어 ㅍ 로 대치하는 것이
            // 대표 오류이므로, F 를 새로 배우는 이 챕터에서 P 가 가장 위험하다.
            // 오답 F(대치 오류) + B(같은 자리 유무성 짝) 둘 다 근접쌍이다.
            // puh 대 buh 는 두 음성 3x 에서 1071~1799ms 차이다 -- 확정 충돌쌍
            // buh/duh 가 모든 배수에서 정확히 0.0ms 였던 것과 정반대다.
            {
              promptAudio: 'puh',
              options: [
                { id: 'c6s5-qF4', icon: 'letterTile', label: 'F', say: 'fff', correct: false },
                { id: 'c6s5-qB4', icon: 'letterTile', label: 'B', say: 'buh', correct: false },
                { id: 'c6s5-qP', icon: 'letterTile', label: 'P', say: 'puh', correct: true },
                { id: 'c6s5-qK4', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
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
            { text: 'I', say: 'ihh' },
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
            { text: 'I', say: 'ihh' },
          ],
          target: 'BIG',
          readAloud: { targetText: 'big' },
        },
        {
          id: 'c6s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'big도 천천히 따라 말해보세요.',
          words: [
            { text: 'B', say: 'buh' },
            { text: 'I', say: 'ihh' },
            { text: 'G', say: 'guh' },
            'big',
          ],
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
