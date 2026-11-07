// Chapter 5 (platformer theme, reused from the mislabeled chapter-4 art):
// G, O, U -> boss blends "DOG" + "GUM". Starts Jolly Phonics Group 3
// (G, O, U, L, F, B) -- chapter 6 will cover L, F, B.
// Beat vocabulary is identical to chapter-01.js -- see that file's header.
//
// Ids are prefixed 'c5' because getStageById() searches every chapter flat.
// 캐릭터 색·외형은 art.js 소유 -- 데이터는 { name, art, style } 만 준다.
// art 슬러그는 리더가 art.js 팔레트에 등록한다(이 파일 작성 시점엔 미등록).
//
// 표시/발화 규칙: 화면에는 실제 글자·단어, 발화에는 소리.
// 이 챕터의 소리 표기: G `guh` · O `awh` · U `uh`
//
// --- G = `guh` 측정 근거 ---
// 글자 이름(`gee`)과는 두 음성 모두 배수 재측정에서 격차가 N에 비례해 커진다
// (Samantha 1x=27ms -> 10x=373ms, Alex 1x=10ms -> 10x=136ms, 5x 근처 이상치
// 하나 제외하면 단조 증가) -- 실제로 다른 음소다.
// 한 번 충돌로 의심됐다가 기각된 사례: `guh` vs `duh` 가 Samantha 3회 반복형
//에서 3.8ms 차이로 근접했다. 하지만 15x/20x/30x 로 확인하니 그 차이가 절대값
// 3.5ms 로 **고정**돼 있었다(N 에 비례해 커지지 않음, diff/N 이 0.24->0.18->0.12
// 로 오히려 감소) -- 이게 실제 다른 음소의 신호다(고정 오프셋 = 경계에서 한 번
// 생기는 실제 조음 차이). 대조로 확인된 진짜 충돌쌍 `buh`/`duh`(Alex) 는 같은
// 방식으로 재보면 15x/20x/30x 전부 **정확히 0.0ms** 차이였다 -- 그게 진짜
// "같은 음소" 신호다. 이 대조 덕분에 guh/duh 를 안전하게 기각할 수 있었다.
// 앞으로 근접한 후보를 만나면: 큰 배수(15/20/30x)에서 diff 가 0 으로 수렴하면
// 충돌, N 에 비례해 커지거나 절대값이 일정하게 유지되면(0이 아니면) 실제
// 다른 음소다.
//
// --- O = `awh` (`ough` 는 오독으로 폐기됐다) ---
// 이전 라운드는 `ough` 를 대비쌍(A/U/글자이름 O)과의 **격차**로만 검증하고
// "안전 확정" 했다. 그 검사는 통과했지만 축이 하나 빠져 있었다 -- 표기가
// **다른 어휘 항목으로 렌더되는지**를 아무도 보지 않았다. 재측정 결과:
//   say -v Samantha "ough"  ==  "oof"  (0.473515s, 0 differing bytes)
//   say -v Alex     "ough"  ==  "ow"   (0.435057s, 0 differing bytes)
// 즉 O 를 가르치는 자리에서 아이가 /f/(챕터 6 의 F 소리다) 나 /au/ 를 들었다.
// 대비쌍 격차가 아무리 커도 소용없다 -- 발화 자체가 다른 단어였다.
//
// 대체는 `awh` (Samantha 1329ms / Alex 1620ms). 낱자 이름 O(o/oh/oah/ogh),
// aw/awe/augh/awww, ar/ah, all/awl, oof/ow, "aw aitch"(684/889),
// "a double u aitch"(1259/1632) 전부와 바이트가 다르다(두 음성). 두 음성의
// 렌더 길이 비가 일정해 구조적으로도 예측 가능하다.
// 차점자 `ahh`(481/1504) 도 두 음성에서 깨끗하지만 음성 간 3배 차이가 나서
// 탈락시켰다. **실기기 청취로 최종 확인이 필요한 1순위 항목이다** --
// /o/ 의 목표음은 got/on/dog 의 단모음이다.
//
// --- 의도된 대비쌍 (혼동시키려는 게 아니라 구별시키려는 것) ---
// G↔C/K(유무성 대비, 유용함) · O↔A · O↔U · U↔A -- 전부 위와 같은 방식으로
// 대형 배수 재확인했고 격차가 초 단위로 벌어진다(수백~수천 ms). 충돌 아님.
//
// --- 아이콘 제약 ---
// G 는 `gift`/`gum`, O 는 `octopus`/`orange` 두 개씩 생겨서 odd-one-out 과
// promptLetter 역방향 문항이 둘 다 이 챕터의 소리로 성립한다.
// U 는 **초성** 그림이 `umbrella` 하나뿐이라 같은편 2개를 세울 수 없어서,
// s4 의 odd-one-out 은 /o/ 둘 + /u/ 하나로 짜서 **이 챕터가 가르치는 두 모음을
// 맞붙였다** -- 정답이 umbrella 이고, 모음 근접쌍이라 무작위 오답보다 낫다.
// multiselect 슬롯은 정답이 2개 이상 필요한데 G/O 초성 그림이 딱 2개라 같은
// 쌍이 두 문항에서 반복되므로, s2·s3 의 그 슬롯은 누적 복습으로 남겼다.
//
// --- s4 의 '모두 찾기' 는 **어중** /u/ 다 (up/under 를 만들지 않는 이유) ---
// 초성 단모음 /u/ 를 가진 구체 명사가 영어에 거의 없다는 것이 근본 제약이다.
// up 은 위쪽 화살표밖에 될 수 없는데 그건 그림이 아니라 기호 관례여서 5세
// 한국 학습자가 '위'/'화살표' 가 아니라 영어 단어 up 에 대응시킬 이유가 없고,
// under 는 두 물체의 **관계**가 필요한데 150px 에서 아이는 관계가 아니라 물체를
// 이름 부른다 -- 오답을 정답으로 가르치는 셈이다(아이콘 담당 판단, 승인됨).
// 그래서 초성 대신 어중으로 물어본다: cup/nut/duck 은 모두 자음으로 시작하므로
// **초성 매칭으로는 절대 풀 수 없고**, 그 점이 같은 스테이지의 초성 문항
// (r2 odd-one-out, r6 promptLetter U)과 이 문항을 구조적으로 갈라준다.
// 교육적으로도 어중이 더 강한 연습이다: 보스가 조립하는 DOG/GUM 의 모음이
// 둘 다 어중이라 CVC 블렌딩 자체가 어중 모음 청취를 요구한다.
// 오답 dog 은 어중이 /o/ 라 이 문항이 곧 어중 /o/ 대 /u/ 변별이 된다 -- 그래서
// O 에 별도의 어중 슬롯을 새로 열지 않았다(O 는 초성 그림이 octopus/orange
// 둘이라 커버리지가 막혀 있지도 않고, 보스 teach 가 duh-awh-guh 로 이미
// 어중 /o/ 를 명시적으로 분절해준다).
//
// --- 보스 단어: DOG(D+O+G) · GUM(G+U+M) ---
// 두 단어 모두 이 챕터에서 새로 배우는 글자(O 또는 U)가 완성되는 시점의
// 스테이지 finale 에서 미리 노출한다(챕터 3/4 에서 확립한 구조) -- 'dog' 는
// O 를 배우는 stage-3 finale(D+G 는 이미 알고 O 만 새로 완성됨), 'gum' 은
// U 를 배우는 stage-4 finale(G 는 이미 알고 U 만 새로 완성됨). G 자신의
// stage-2 finale 는 보스 단어가 아닌 보너스 단어 'gap'(G+A+P, 전부 기지
// 글자)을 미리 노출한다 -- 챕터 4의 R 스테이지가 'rat' 을 보너스로 미리
// 노출하고 보스는 따로 mat+red 를 조립했던 것과 같은 패턴.

export const chapter5 = {
  id: 'chapter-5',
  order: 5,
  title: 'Brick Road Dash',
  stages: [
    {
      id: 'c5-stage-1',
      order: 1,
      title: 'A Rumbling Sound',
      villain: { name: 'Topsy', art: 'topsy', style: 'plat-flip' },
      hero: { name: 'Gogo', art: 'gogo', style: 'plat-jumper' },
      chapterBoss: false,
      beats: [
        {
          id: 'c5s1-teach',
          kind: 'teach',
          instructionKo: '히어로가 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['guh'],
        },
        {
          id: 'c5s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          // /g/ 그림이 0개라 아이콘이 필요 없는 beat 로 /g/ 를 나른다.
          instructionKo: 'G 소리로 시작하는 단어예요! 따라 말해보세요.',
          words: ['gap', 'gum'],
        },
        {
          id: 'c5s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['guh'],
        },
        {
          id: 'c5s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          oddOneOut: true,
          options: [
            { id: 'c5s1-gift', icon: 'gift', label: 'gift', correct: false },
            { id: 'c5s1-gum', icon: 'gum', label: 'gum', correct: false },
            { id: 'c5s1-dog', icon: 'dog', label: 'dog', correct: true },
          ],
          readAloud: { targetText: 'gift' },
        },
        {
          id: 'c5s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"egg"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'egg',
          options: [
            { id: 'c5s1-elephant', icon: 'elephant', label: 'elephant', correct: true },
            { id: 'c5s1-hat2', icon: 'hat', label: 'hat', correct: false },
            { id: 'c5s1-pot', icon: 'pot', label: 'pot', correct: false },
          ],
          readAloud: { targetText: 'elephant' },
        },
        {
          id: 'c5s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/h/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c5s1-hat3', icon: 'hat', label: 'hat', correct: true },
            { id: 'c5s1-moon', icon: 'moon', label: 'moon', correct: false },
            { id: 'c5s1-hen2', icon: 'hen', label: 'hen', correct: true },
            { id: 'c5s1-horse', icon: 'horse', label: 'horse', correct: true },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c5s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['gum', 'gap'],
        },
        {
          id: 'c5s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['gap'],
        },
      ],
      recapKo: '/g/ 소리를 찾았어요! Gap, gum<br>— 모두 G로 시작해요!',
      recapAudio: {
        ko: '지 소리를 찾았어요! 잘 들어보세요.',
        en: ['gap', 'gum'],
      },
    },

    {
      id: 'c5-stage-2',
      order: 2,
      title: 'Power of G',
      villain: { name: 'Gloop', art: 'gloop', style: 'plat-slime' },
      hero: { name: 'Gogo', art: 'gogo', style: 'plat-jumper' },
      chapterBoss: false,
      beats: [
        {
          id: 'c5s2-teach',
          kind: 'teach',
          instructionKo: 'G는 뛰어오를 때처럼 G 소리를 내요!',
          art: 'hero',
          letter: 'G',
          repeatAudio: ['G', 'guh'],
        },
        {
          id: 'c5s2-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'G 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'guh',
          // 혼동 보기는 K 하나 -- G/C·K 는 유무성 대비로 유용하다.
          options: [
            { id: 'c5s2-K1', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
            { id: 'c5s2-T1', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'c5s2-G1', icon: 'letterTile', label: 'G', say: 'guh', correct: true },
          ],
        },
        {
          id: 'c5s2-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          oddOneOut: true,
          options: [
            { id: 'c5s2-gum', icon: 'gum', label: 'gum', correct: false },
            { id: 'c5s2-hen', icon: 'hen', label: 'hen', correct: true },
            { id: 'c5s2-gift', icon: 'gift', label: 'gift', correct: false },
          ],
          readAloud: { targetText: 'gum' },
        },
        {
          id: 'c5s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 G를 따라 그리면서 G 소리를 내보세요!',
          trace: 'upper',
          words: [{ text: 'G', say: 'guh' }],
        },
        {
          id: 'c5s2-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 g를 그려볼까요? 함께 외쳐요!',
          trace: 'lower',
          art: 'hero',
          letter: 'g',
          repeatAudio: ['G', 'guh'],
        },
        {
          id: 'c5s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // /g/ 그림이 없어 /k/ 복습으로 대체 -- G/K 는 이 챕터의 핵심 대비쌍
          // 이라 오히려 자연스러운 연결이다.
          instructionKo: '/k/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c5s2-cat', icon: 'cat', label: 'cat', correct: true },
            { id: 'c5s2-moon', icon: 'moon', label: 'moon', correct: false },
            { id: 'c5s2-key', icon: 'key', label: 'key', correct: true },
            { id: 'c5s2-net', icon: 'net', label: 'net', correct: false },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c5s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'G 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'guh',
          options: [
            { id: 'c5s2-G3', icon: 'letterTile', label: 'G', say: 'guh', correct: true },
            { id: 'c5s2-K3', icon: 'letterTile', label: 'K', say: 'kuh', correct: false },
            { id: 'c5s2-M3', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
          ],
          readAloud: { targetText: 'G', say: 'guh' },
        },
        {
          id: 'c5s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'G',
          options: [
            { id: 'c5s2-egg', icon: 'egg', label: 'egg', correct: false },
            { id: 'c5s2-gum2', icon: 'gum', label: 'gum', correct: true },
            { id: 'c5s2-pot', icon: 'pot', label: 'pot', correct: false },
          ],
          readAloud: { targetText: 'gum' },
        },
        {
          id: 'c5s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['gum', 'gap'],
        },
        {
          id: 'c5s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어가 아닌 보너스 단어 'gap' (G+A+T 전부 기지 글자).
          instructionKo: '마지막 공격! G 소리로 크게 외쳐보세요!',
          words: [{ text: 'G', say: 'guh' }, 'gap'],
        },
      ],
      recapKo: 'G는 G 소리를 내요 — gap, gum! K의 K 소리와 헷갈리지 마세요!',
      recapAudio: {
        ko: '지는 이런 소리를 내요. 키 소리와 다르니 잘 들어보세요.',
        en: ['gap', 'gum'],
      },
    },

    {
      id: 'c5-stage-3',
      order: 3,
      title: 'Power of O',
      villain: { name: 'Snatchy', art: 'snatchy', style: 'plat-magnetjack' },
      hero: { name: 'Ollie', art: 'ollie', style: 'plat-spring' },
      chapterBoss: false,
      reviewTargets: ['S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M', 'D', 'G', 'O'],
      beats: [
        {
          id: 'c5s3-teach',
          kind: 'teach',
          instructionKo: 'O는 튕겨 오를 때처럼 O 소리를 내요!',
          art: 'hero',
          letter: 'O',
          repeatAudio: ['O', 'awh'],
        },
        {
          id: 'c5s3-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'O 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'awh',
          // 혼동 보기는 A 하나 -- O/A 는 의도된 대비쌍이다.
          options: [
            { id: 'c5s3-A1', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c5s3-I1', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
            { id: 'c5s3-O1', icon: 'letterTile', label: 'O', say: 'awh', correct: true },
          ],
        },
        {
          id: 'c5s3-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          oddOneOut: true,
          options: [
            { id: 'c5s3-octopus', icon: 'octopus', label: 'octopus', correct: false },
            { id: 'c5s3-net', icon: 'net', label: 'net', correct: true },
            { id: 'c5s3-orange', icon: 'orange', label: 'orange', correct: false },
          ],
          readAloud: { targetText: 'octopus' },
        },
        {
          id: 'c5s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 O를 따라 그리면서 O 소리를 내보세요!',
          trace: 'upper',
          words: [{ text: 'O', say: 'awh' }],
        },
        {
          id: 'c5s3-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 o를 그려볼까요? 함께 외쳐요!',
          trace: 'lower',
          art: 'hero',
          letter: 'o',
          repeatAudio: ['O', 'awh'],
        },
        {
          id: 'c5s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/e/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c5s3-egg', icon: 'egg', label: 'egg', correct: true },
            { id: 'c5s3-hat', icon: 'hat', label: 'hat', correct: false },
            { id: 'c5s3-elephant', icon: 'elephant', label: 'elephant', correct: true },
            { id: 'c5s3-moon', icon: 'moon', label: 'moon', correct: false },
          ],
          readAloud: { targetText: 'egg' },
        },
        {
          id: 'c5s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'O 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'awh',
          options: [
            { id: 'c5s3-O3', icon: 'letterTile', label: 'O', say: 'awh', correct: true },
            { id: 'c5s3-A3', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c5s3-E3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
          ],
          readAloud: { targetText: 'O', say: 'awh' },
        },
        {
          id: 'c5s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'O',
          options: [
            { id: 'c5s3-hen', icon: 'hen', label: 'hen', correct: false },
            { id: 'c5s3-cake', icon: 'cake', label: 'cake', correct: false },
            { id: 'c5s3-orange2', icon: 'orange', label: 'orange', correct: true },
          ],
          readAloud: { targetText: 'orange' },
        },
        {
          id: 'c5s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['got', 'on'],
        },
        {
          id: 'c5s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'dog' 사전 노출 (D+G 는 이미 알고 O 로 완성된다, 조립은 보스에서).
          instructionKo: '마지막 공격! O 소리로 크게 외쳐보세요!',
          words: [{ text: 'O', say: 'awh' }, 'dog'],
        },
      ],
      recapKo: 'O는 O 소리를 내요 — got, on, dog! G의 G 소리도 기억하고 있어요!',
      recapAudio: {
        ko: '오는 이런 소리를 내요. 에이 소리와 다르니 잘 들어보세요.',
        en: ['got', 'dog'],
      },
    },

    {
      id: 'c5-stage-4',
      order: 4,
      title: 'Power of U',
      villain: { name: 'Blocko', art: 'blocko', style: 'plat-brick' },
      hero: { name: 'Umo', art: 'umo', style: 'plat-block' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U',
      ],
      beats: [
        {
          id: 'c5s4-teach',
          kind: 'teach',
          instructionKo: 'U는 힘을 낼 때처럼 U 소리를 내요!',
          art: 'hero',
          letter: 'U',
          repeatAudio: ['U', 'uh'],
        },
        {
          id: 'c5s4-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'U 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'uh',
          // 혼동 보기는 A 하나 -- U/A 는 의도된 대비쌍이다.
          options: [
            { id: 'c5s4-U1', icon: 'letterTile', label: 'U', say: 'uh', correct: true },
            { id: 'c5s4-A1', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
            { id: 'c5s4-N1', icon: 'letterTile', label: 'N', say: 'nnn', correct: false },
          ],
        },
        {
          id: 'c5s4-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          // /u/ 그림은 umbrella 하나뿐이라 /u/ 를 같은편 2개로 세울 수 없다.
          // 대신 이 챕터의 두 모음을 맞붙인다 -- /o/ 둘 + /u/ 하나라서 정답이
          // umbrella 이고, 모음 근접쌍이라 그냥 무작위 오답보다 훨씬 좋은 연습이다.
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          oddOneOut: true,
          options: [
            { id: 'c5s4-orange', icon: 'orange', label: 'orange', correct: false },
            { id: 'c5s4-octopus', icon: 'octopus', label: 'octopus', correct: false },
            { id: 'c5s4-umbrella', icon: 'umbrella', label: 'umbrella', correct: true },
          ],
          readAloud: { targetText: 'orange' },
        },
        {
          id: 'c5s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 U를 따라 그리면서 U 소리를 내보세요!',
          trace: 'upper',
          words: [{ text: 'U', say: 'uh' }],
        },
        {
          id: 'c5s4-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 u를 그려볼까요? 함께 외쳐요!',
          trace: 'lower',
          art: 'hero',
          letter: 'u',
          repeatAudio: ['U', 'uh'],
        },
        {
          id: 'c5s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // 어중 /u/ -- 근거는 파일 헤더에 있다. 보기 넷이 모두 자음으로
          // 시작하므로 초성 매칭으로는 풀 수 없고, 오답 dog 은 어중이 /o/ 라
          // 이 문항이 그대로 어중 /o/ 대 /u/ 변별이 된다.
          instructionKo: 'U 소리가 가운데 들어있는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c5s4-cup', icon: 'cup', label: 'cup', correct: true },
            { id: 'c5s4-dog', icon: 'dog', label: 'dog', correct: false },
            { id: 'c5s4-nut', icon: 'nut', label: 'nut', correct: true },
            { id: 'c5s4-duck', icon: 'duck', label: 'duck', correct: true },
          ],
          readAloud: { targetText: 'cup' },
        },
        {
          id: 'c5s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'U 소리를 내는 글자를 고르고 ✓를 누르세요!',
          promptAudio: 'uh',
          // 혼동 보기는 O 하나 -- 방금 배운 글자와 대비시킨다(U/O 도 의도된
          // 대비쌍). warmup 에서 이미 U/A 를 다뤄서 여기선 겹치지 않는다.
          options: [
            { id: 'c5s4-O3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c5s4-U3', icon: 'letterTile', label: 'U', say: 'uh', correct: true },
            { id: 'c5s4-E3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
          ],
          readAloud: { targetText: 'U', say: 'uh' },
        },
        {
          id: 'c5s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'U',
          options: [
            { id: 'c5s4-umbrella2', icon: 'umbrella', label: 'umbrella', correct: true },
            { id: 'c5s4-cat', icon: 'cat', label: 'cat', correct: false },
            { id: 'c5s4-key', icon: 'key', label: 'key', correct: false },
          ],
          readAloud: { targetText: 'umbrella' },
        },
        {
          id: 'c5s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['sun', 'nut'],
        },
        {
          id: 'c5s4-finale-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'guh',
              options: [
                { id: 'c5s4-qO', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
                { id: 'c5s4-qG', icon: 'letterTile', label: 'G', say: 'guh', correct: true },
                { id: 'c5s4-qU', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
              ],
            },
            {
              promptAudio: 'awh',
              options: [
                { id: 'c5s4-qU2', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
                { id: 'c5s4-qG2', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
                { id: 'c5s4-qO2', icon: 'letterTile', label: 'O', say: 'awh', correct: true },
              ],
            },
            {
              promptAudio: 'uh',
              options: [
                { id: 'c5s4-qG3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
                { id: 'c5s4-qU3', icon: 'letterTile', label: 'U', say: 'uh', correct: true },
                { id: 'c5s4-qO3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
              ],
            },
            // 누적 복습(챕터 3 의 C). G 를 배우면서 가장 위험해지는 앞 글자가 C 다
            // -- /k/ 와 /g/ 는 같은 자리 유무성 짝이라 새 글자가 옛 글자를 덮어쓴다.
            // 오답을 이 챕터의 새 글자(G/O)로 둬서 최신 기억이 방해하게 만든다.
            // kuh 대 guh 는 두 음성 20x 에서 13.4~16.1초 벌어진다(별개 음소).
            // K 는 C 와 같은 표기(kuh)이므로 같은 스텝에 둘 수 없다.
            {
              promptAudio: 'kuh',
              options: [
                { id: 'c5s4-qC', icon: 'letterTile', label: 'C', say: 'kuh', correct: true },
                { id: 'c5s4-qG4', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
                { id: 'c5s4-qO4', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c5s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'gum' 사전 노출 (G+M 은 이미 알고 U 로 완성된다, 조립은 보스에서).
          instructionKo: '마지막 공격! U 소리로 크게 외쳐보세요!',
          words: [{ text: 'U', say: 'uh' }, 'gum'],
        },
      ],
      recapKo: '이제 G, O, U를 모두 알아요! 히어로들이 합체할 준비를 해요!',
      recapAudio: {
        ko: '유는 이런 소리를 내요. 이제 세 소리를 모두 배웠어요.',
        en: ['sun', 'nut'],
      },
    },

    {
      id: 'c5-stage-5',
      order: 5,
      title: 'Boss: DOG and GUM!',
      villain: { name: 'Bug King', art: 'bug-king', style: 'plat-glitch' },
      hero: { name: 'Captain Gum', art: 'captain-gum', style: 'plat-powerup' },
      chapterBoss: true,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U',
      ],
      beats: [
        {
          id: 'c5s5-teach',
          kind: 'teach',
          instructionKo: '세 히어로가 합체해요! 먼저 dog을 만들어요.',
          repeatAudio: ['duh', 'awh', 'guh', 'dog'],
        },
        {
          id: 'c5s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'D', say: 'duh' },
            { text: 'O', say: 'awh' },
            { text: 'G', say: 'guh' },
          ],
          target: 'DOG',
        },
        {
          id: 'c5s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [
            { text: 'D', say: 'duh' },
            { text: 'O', say: 'awh' },
            { text: 'G', say: 'guh' },
            'dog',
          ],
        },
        {
          id: 'c5s5-break',
          kind: 'break',
          instructionKo: '이번엔 gum이에요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['guh', 'uh', 'mmm', 'gum'],
        },
        {
          id: 'c5s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'guh',
              options: [
                { id: 'c5s5-qU', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
                { id: 'c5s5-qO', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
                { id: 'c5s5-qG', icon: 'letterTile', label: 'G', say: 'guh', correct: true },
              ],
            },
            {
              promptAudio: 'awh',
              options: [
                { id: 'c5s5-qO2', icon: 'letterTile', label: 'O', say: 'awh', correct: true },
                { id: 'c5s5-qG2', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
                { id: 'c5s5-qU2', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
              ],
            },
            {
              promptAudio: 'uh',
              options: [
                { id: 'c5s5-qO3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
                { id: 'c5s5-qG3', icon: 'letterTile', label: 'G', say: 'guh', correct: false },
                { id: 'c5s5-qU3', icon: 'letterTile', label: 'U', say: 'uh', correct: true },
              ],
            },
            // 누적 복습(챕터 1 의 A). 이 챕터가 모음 두 개(O/U)를 새로 넣으므로
            // 가장 오래 인출되지 않은 모음 A 가 그 둘에 밀린다. 오답이 O/U 라
            // 세 모음을 한 문항에서 갈라야 한다.
            {
              promptAudio: 'aaa',
              options: [
                { id: 'c5s5-qO4', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
                { id: 'c5s5-qA', icon: 'letterTile', label: 'A', say: 'aaa', correct: true },
                { id: 'c5s5-qU4', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c5s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'O', say: 'awh' },
            { text: 'D', say: 'duh' },
            { text: 'G', say: 'guh' },
          ],
          target: 'DOG',
          readAloud: { targetText: 'dog' },
        },
        {
          id: 'c5s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c5s5-DOG', icon: 'letterTile', label: 'DOG', correct: true },
            { id: 'c5s5-ODG', icon: 'letterTile', label: 'ODG', correct: false },
            { id: 'c5s5-GDO', icon: 'letterTile', label: 'GDO', correct: false },
          ],
          readAloud: { targetText: 'dog' },
        },
        {
          id: 'c5s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 gum을 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'U', say: 'uh' },
            { text: 'G', say: 'guh' },
            { text: 'M', say: 'mmm' },
          ],
          target: 'GUM',
          readAloud: { targetText: 'gum' },
        },
        {
          id: 'c5s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'gum도 천천히 따라 말해보세요.',
          words: [
            { text: 'G', say: 'guh' },
            { text: 'U', say: 'uh' },
            { text: 'M', say: 'mmm' },
            'gum',
          ],
        },
        {
          id: 'c5s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! DOG! GUM!',
          words: ['dog', 'gum'],
        },
      ],
      recapKo: 'D-O-G는 DOG, G-U-M은 GUM! 단어 두 개를 만들었어요! 챕터 5 클리어!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['dog', 'gum'],
      },
    },
  ],
}
