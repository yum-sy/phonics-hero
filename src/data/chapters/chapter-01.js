// Chapter 1 (Carbot theme): S, A, T -> "SAT".
// Each stage is a sequence of "beats". Scored beats require a correct
// interaction + a read-aloud confirmation before dealing hits to the villain.
//
// beat.kind:
//   'teach'         - non-scored intro/model beat, tap to continue
//   'break'         - non-scored kinesthetic/chant beat, tap to continue
//   'choose'        - tap the one correct option among options[]
//   'multiselect'   - tap all options where correct === true
//   'choose-sequence' - a run of choose-style steps (steps[]) back to back
//   'drag-build'    - drag letter tiles into slots in the right order
//   'listen-repeat' - no visual question, just listen + read-aloud confirm
//   'finale'        - like listen-repeat, but deals the closing hit(s)
//
// 표시/발화 규칙 (챕터 3+ 작성자용 계약): 화면에는 항상 실제 글자·단어를,
// 발화에는 항상 소리를 -- 둘이 다르면 words[]는 { text: 'S', say: 'sss' },
// readAloud는 { targetText: 'S', say: 'sss' }. 화면에 안 나오는
// repeatAudio/promptAudio는 소리 표기('sss','tuh')를 그대로 쓴다.
//
// teach/break 의 repeatAudio 는 "한 소리 드릴" 이다 -- 그 소리 **한 번**과,
// 화면에 letter 로 떠 있는 글자꼴 이름 한 번만 들어간다. 즉 표준 형태는
// ['S', 'sss'] 두 원소이고, 글자꼴이 없는 도입 스테이지는 ['sss'] 하나다.
// 반복하지 마라 -- 사용자가 실기기 QA 2차에서 반복 형식 전체를 반려했다:
// "전체적으로 3번 2번 빠르게 반복하는건 다 지우자 한번만 똑바로 읽어 주는게
//  좋겠어, 어짜피 반복해서 들을 수 있는 버튼도 만들어 놨잖아." 반복은 다시듣기
// 버튼(wireTeachButtons)이 담당한다. **단어와 캐릭터 이름을
// 넣지 마라.** 예전 표준은 [소리, 단어앵커, 소리] 였는데 사용자가 실기기에서
// 듣고 반려했다: "1-1 음성이 ss sun ss 라고 하네... 이 때 굳이 sun 을
// 언급하는 이유를 모르겠어. 빼버리자". 캐릭터 이름도 같이 뺐다 -- speakEN 이
// 소문자로 바꾸므로 아이는 그것을 이름이 아니라 영어 단어로 듣고, 게다가 몇
// 개는 소리가 어긋났다(단모음 A 자리의 'Ace' 는 /eɪ/, 단모음 U 자리의 'Umo'
// 는 /juː/, /t/ 구호의 'go!' 는 /g/). 소리를 단어에 붙여 들려줄 자리는
// listen-repeat/finale 의 words[] 다.
//
// 예외는 보스 스테이지의 teach/break 하나뿐이다: 거기서는 낱소리를 순서대로
// 들려준 뒤 합친 단어를 말하는 **블렌딩 시연**이고(sss-aaa-tuh-sat), 그
// 단어는 화면의 글자 등식에 그대로 떠 있다. validateChapters() 가 이 계약을
// 강제한다(비보스 teach/break 의 소리 토큰은 정확히 1개, 글자꼴도 최대 1개).
//
// 보스 블렌드의 세 슬롯은 **형태가 같아야 한다**. 사용자 원문: "sss aaa tuh tuh
// tuh 이러더라구... tuh 만 이질적이라서 반응이 '이거 대체 왜이래'였어. 그냥
// 똑같이 /s/ /a/ /t/ 이렇게 한번 똑바로 발음 해주는게 좋을 것 같아."
//
// ---------------------------------------------------------------------------
// 2026-08 구조 개편 (파일럿, 챕터 1-2 한정): 부모 플레이테스트에서 "S/A/T의
// 세 글자 루프가 완전히 똑같은 반복으로 느껴진다" 는 피드백이 나왔다 --
// 실제로 kind 시퀀스를 비교해보니 정말 비트 단위로 동일했다(문항 개수, 순서,
// 발화 자리까지). 사용자 원문: "루프가 있다고 생각되지 않을 만큼 챕터마다
// 다양하게 배치했으면 좋겠어." 이번 개편은 stage-2(S)/stage-3(A)/stage-4(T)
// 세 "Power of X" 루프의 **beat kind 구성과 순서를 서로 다르게** 만든다 --
// 문항 자체(정답/오답, 소리 표기)는 그대로 두고 뼈대만 바꾼다:
//   - S(stage-2): 기존 뼈대를 거의 유지한다(챕터의 첫 노출, 표준형).
//   - A(stage-3): break 를 teach 직후로 당기고, "hard" 단독 choose 를
//     choose-sequence 2스텝(S/A 청각 변별)으로 바꿨다.
//   - T(stage-4): drag-build 를 보스 전용에서 끌어와 2글자 실제 단어 "AT"를
//     미리 조립해보게 하고(A+T 블렌딩 예행연습), "hard"/"reversed" 대신
//     choose-sequence 3스텝(S/A/T 총복습)으로 마무리한다.
// 정답 보기 위치는 챕터 전체에서 슬롯 0/1/2 가 고르게 나오도록 재배치했다
// (validateChapters() 의 슬롯 편향 검사 대상).

export const chapter1 = {
  id: 'chapter-1',
  order: 1,
  title: 'Carbot Sound Town',
  stages: [
    {
      id: 'stage-1',
      order: 1,
      title: 'A Strange Sound',
      villain: { name: 'Noisebot', art: 'noisebot' },
      hero: { name: 'Sammy', art: 'sammy' },
      chapterBoss: false,
      // 2026-08 구조 개편 (파일럿 후속, 챕터 1-2 stage-1 한정): stage-2~4는
      // 앞선 파일럿(76e1e69)이 이미 뼈대를 다양화했지만 stage-1(순수 음소
      // 인식, 글자꼴 0개)은 그대로 남아 있었다 -- 실기기 플레이테스트에서
      // "stage-1이 stage-2를 글자만 뺀 축소판처럼 느껴진다"는 피드백이
      // 나왔다. stage-1은 태생적으로 letterTile/promptLetter 를 못 쓰므로
      // (글자를 아직 안 가르쳤다) 도구가 stage-2보다 좁지만, 그 좁은 도구
      // 안에서도 순서·묶음 방식을 바꿔 리듬을 다르게 만들 수 있다:
      //   - 앱 전체 첫 옵션 그리드 스캐폴딩(s1-r1)은 위치를 그대로 둔다 --
      //     이 문장이 확인 버튼(✓) 사용법을 설명하는 유일한 자리라, 뒤에
      //     오는 choose-sequence 묶음 문항보다 먼저 나와야 아이가 낱개
      //     선택 기제를 먼저 익힌다.
      //   - multiselect 를 stage 중반(옛 위치는 끝에서 두 번째)으로
      //     당기고, break(챈트)를 그 다음(옛 위치는 두 번째)으로 옮겼다 --
      //     stage-2가 "choose,choose,break"로 여는 것과 달리 여기는
      //     "choose,multiselect,break"로 연다.
      //   - 옛 s1-r2/s1-r3 두 개의 단독 choose 를 choose-sequence 2스텝
      //     하나로 묶었다. 같은 그림·소리 내용이지만(같은 소리를 더
      //     들어보는 것뿐, 아직 두 번째 소리가 없어 변별 대상은 없다)
      //     한 beat 안에서 연달아 판정되는 퀵파이어 리듬은 stage-2에 없는
      //     형태라 stage-1만의 질감이 된다.
      beats: [
        {
          id: 's1-teach',
          kind: 'teach',
          instructionKo: '새미가 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['sss'],
        },
        {
          id: 's1-r1',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 앱 전체에서 아이가 처음 만나는 옵션 그리드다. 확인 버튼(`51cdd44`)
          // 이후로 탭은 **고르기**이고 채점은 ✓ 가 하므로, 그 기제를 여기서
          // 한 번 말한다. 나머지 27개 '다른 소리로 시작하는 걸 찾아보세요!' 는
          // 그대로 둔다 -- 그 문장은 완료 조건을 주장하지 않으므로 틀리지 않았고,
          // 158개 옵션 그리드 지시문 전부에 UI 기제를 붙이면 매 화면의 문장이
          // 파닉스 내용 대신 버튼 설명이 된다. 첫 만남에서만 스캐폴딩한다.
          instructionKo: '다른 소리로 시작하는 걸 고르고 ✓를 누르세요!',
          options: [
            { id: 'dog', icon: 'dog', label: 'dog', correct: true },
            { id: 'sun', icon: 'sun', label: 'sun', correct: false },
            { id: 'snake', icon: 'snake', label: 'snake', correct: false },
          ],
          readAloud: { targetText: 'sun' },
        },
        {
          id: 's1-r2-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/s/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'snake2', icon: 'snake', label: 'snake', correct: true },
            { id: 'star2', icon: 'star', label: 'star', correct: true },
            { id: 'bus', icon: 'bus', label: 'bus', correct: false },
            { id: 'sock3', icon: 'sock', label: 'sock', correct: true },
          ],
          readAloud: { targetText: 'star' },
        },
        {
          id: 's1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['sss'],
        },
        {
          id: 's1-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          steps: [
            {
              promptAudio: 'sss',
              options: [
                { id: 'sock', icon: 'sock', label: 'sock', correct: false },
                { id: 'star', icon: 'star', label: 'star', correct: false },
                { id: 'car', icon: 'car', label: 'car', correct: true },
              ],
            },
            {
              promptAudio: 'sun',
              options: [
                { id: 'moon', icon: 'moon', label: 'moon', correct: true },
                { id: 'sock2', icon: 'sock', label: 'sock', correct: false },
                { id: 'snake3', icon: 'snake', label: 'snake', correct: false },
              ],
            },
          ],
        },
        {
          id: 's1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '들려주는 단어를 하나씩 따라 말해보세요!',
          words: ['star', 'sock', 'sun'],
        },
        {
          id: 's1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['sun'],
        },
      ],
      recapKo: '/s/ 소리를 찾았어요! Sun, sock, star, snake<br>— 모두 S로 시작해요!',
      recapAudio: {
        ko: '에스 소리를 찾았어요! 잘 들어보세요.',
        en: ['sun', 'sock', 'star'],
      },
    },

    {
      id: 'stage-2',
      order: 2,
      title: 'Power of S',
      villain: { name: 'Hushbot', art: 'hushbot' },
      hero: { name: 'Sammy', art: 'sammy' },
      chapterBoss: false,
      beats: [
        {
          id: 's2-teach',
          kind: 'teach',
          instructionKo: 'S는 새미처럼 S 소리를 내요!',
          art: 'hero',
          letter: 'S',
          repeatAudio: ['S', 'sss'],
        },
        {
          id: 's2-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'S 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'sss',
          options: [
            { id: 'S1', icon: 'letterTile', label: 'S', say: 'sss', correct: true },
            { id: 'T1', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
            { id: 'M1', icon: 'letterTile', label: 'M', say: 'mmm', correct: false },
          ],
        },
        {
          id: 's2-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'snake', icon: 'snake', label: 'snake', correct: false },
            { id: 'bus', icon: 'bus', label: 'bus', correct: true },
            { id: 'star', icon: 'star', label: 'star', correct: false },
          ],
          readAloud: { targetText: 'star' },
        },
        {
          id: 's2-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 s를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 's',
          repeatAudio: ['S', 'sss'],
        },
        {
          id: 's2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 S를 따라 그리면서 S 소리를 내보세요!',
          words: [{ text: 'S', say: 'sss' }],
        },
        {
          id: 's2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/s/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'sock', icon: 'sock', label: 'sock', correct: true },
            { id: 'moon', icon: 'moon', label: 'moon', correct: false },
            { id: 'star2', icon: 'star', label: 'star', correct: true },
            { id: 'cup', icon: 'cup', label: 'cup', correct: false },
          ],
          readAloud: { targetText: 'sock' },
        },
        {
          id: 's2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: 'S 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'sss',
          options: [
            { id: 'Z3', icon: 'letterTile', label: 'Z', say: 'zze', correct: false },
            { id: 'C3', icon: 'letterTile', label: 'C', say: 'kuh', correct: false },
            { id: 'S3', icon: 'letterTile', label: 'S', say: 'sss', correct: true },
          ],
          readAloud: { targetText: 'S', say: 'sss' },
        },
        {
          id: 's2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'S',
          options: [
            { id: 'dog', icon: 'dog', label: 'dog', correct: false },
            { id: 'sun', icon: 'sun', label: 'sun', correct: true },
            { id: 'cup2', icon: 'cup', label: 'cup', correct: false },
          ],
          readAloud: { targetText: 'sun' },
        },
        {
          id: 's2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['sun', 'sock', 'star'],
        },
        {
          id: 's2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 공격! S 소리로 크게 외쳐보세요!',
          words: [{ text: 'S', say: 'sss' }, 'sun'],
        },
      ],
      recapKo: 'S는 S 소리를 내요 — sun, sock, star도 모두 기억해요!',
      recapAudio: {
        ko: '에스는 이런 소리를 내요. 따라 말해볼까요?',
        en: ['sun', 'sock', 'star'],
      },
    },

    {
      id: 'stage-3',
      order: 3,
      title: 'Power of A',
      villain: { name: 'Shadowbot', art: 'shadowbot' },
      hero: { name: 'Ace', art: 'ace' },
      chapterBoss: false,
      reviewTargets: ['S', 'A'],
      beats: [
        {
          id: 's3-teach',
          kind: 'teach',
          instructionKo: 'A는 에이스처럼 A 소리를 내요!',
          art: 'hero',
          letter: 'A',
          repeatAudio: ['A', 'aaa'],
        },
        {
          id: 's3-break',
          kind: 'break',
          // S 스테이지는 break 가 뒤(연습 이후)에 왔다. A 스테이지는 배운
          // 직후 바로 몸으로 그려보게 해서 순서 자체를 다르게 느끼게 한다.
          instructionKo: '손가락으로 소문자 a를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'a',
          repeatAudio: ['A', 'aaa'],
        },
        {
          id: 's3-r1-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'bus', icon: 'bus', label: 'bus', correct: true },
            { id: 'ant', icon: 'ant', label: 'ant', correct: false },
            { id: 'apple', icon: 'apple', label: 'apple', correct: false },
          ],
          readAloud: { targetText: 'apple' },
        },
        {
          id: 's3-r2-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/a/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'apple2', icon: 'apple', label: 'apple', correct: true },
            { id: 'sun', icon: 'sun', label: 'sun', correct: false },
            { id: 'ant2', icon: 'ant', label: 'ant', correct: true },
            { id: 'snake', icon: 'snake', label: 'snake', correct: false },
          ],
          readAloud: { targetText: 'ant' },
        },
        {
          id: 's3-r3-quickfire',
          // S 스테이지의 "hard" 단독 문항 대신, 지금까지 배운 두 소리(S/A)를
          // 연속으로 변별하는 미니 퀵파이어로 바꿨다 -- 복습과 난이도 상승을
          // 한 beat 에서 같이 한다.
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!',
          steps: [
            {
              promptAudio: 'sss',
              options: [
                { id: 'qA1', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
                { id: 'qO1', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
                { id: 'qS1', icon: 'letterTile', label: 'S', say: 'sss', correct: true },
              ],
            },
            {
              promptAudio: 'aaa',
              options: [
                { id: 'qA2', icon: 'letterTile', label: 'A', say: 'aaa', correct: true },
                { id: 'qS2', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
                { id: 'qU2', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
              ],
            },
          ],
        },
        {
          id: 's3-r4-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 A를 따라 그리면서 A 소리를 내보세요!',
          words: [{ text: 'A', say: 'aaa' }],
        },
        {
          id: 's3-r5-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'A',
          options: [
            { id: 'dog', icon: 'dog', label: 'dog', correct: false },
            { id: 'apple3', icon: 'apple', label: 'apple', correct: true },
            { id: 'sock', icon: 'sock', label: 'sock', correct: false },
          ],
          readAloud: { targetText: 'apple' },
        },
        {
          id: 's3-r6-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['ant', 'apple'],
        },
        {
          id: 's3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 공격! A 소리로 크게 외쳐보세요!',
          words: [{ text: 'A', say: 'aaa' }, 'apple'],
        },
      ],
      recapKo: 'A는 A 소리를 내요 — 그리고 S도 아직 기억하고 있어요!',
      recapAudio: {
        ko: '에이는 이런 소리를 내요. 에스도 기억하고 있어요.',
        en: ['ant', 'apple'],
      },
    },

    {
      id: 'stage-4',
      order: 4,
      title: 'Power of T',
      villain: { name: 'Tickbot', art: 'tickbot' },
      hero: { name: 'Turbo', art: 'turbo' },
      chapterBoss: false,
      reviewTargets: ['S', 'A', 'T'],
      beats: [
        {
          id: 's4-teach',
          kind: 'teach',
          instructionKo: 'T는 터보의 엔진처럼 T 소리를 내요!',
          art: 'hero',
          letter: 'T',
          repeatAudio: ['T', 'tuh'],
        },
        {
          id: 's4-r1-warmup',
          kind: 'choose',
          scored: false,
          instructionKo: 'T 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'tuh',
          options: [
            { id: 'L1', icon: 'letterTile', label: 'L', say: 'lll', correct: false },
            { id: 'T1', icon: 'letterTile', label: 'T', say: 'tuh', correct: true },
            { id: 'D1', icon: 'letterTile', label: 'D', say: 'duh', correct: false },
          ],
        },
        {
          id: 's4-r2-oddoneout',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '다른 소리로 시작하는 걸 찾아보세요!',
          options: [
            { id: 'top', icon: 'top', label: 'top', correct: false },
            { id: 'tap', icon: 'tap', label: 'tap', correct: false },
            { id: 'sun', icon: 'sun', label: 'sun', correct: true },
          ],
          readAloud: { targetText: 'top' },
        },
        {
          id: 's4-break',
          kind: 'break',
          instructionKo: '손가락으로 소문자 t를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 't',
          repeatAudio: ['tuh'],
        },
        {
          id: 's4-r3-build-warmup',
          // 보스 전용이던 drag-build 를 여기로 끌어왔다: S+A+T 세 글자를
          // 조립하기 전에, 이미 배운 A+T 두 글자로 진짜 단어 "at" 을 먼저
          // 조립해본다 -- 블렌딩 자체를 미리 연습하는 예행연습이다.
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'A', say: 'aaa' },
            { text: 'T', say: 'tuh' },
          ],
          target: 'AT',
        },
        {
          id: 's4-r4-build',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'T', say: 'tuh' },
            { text: 'A', say: 'aaa' },
          ],
          target: 'AT',
          readAloud: { targetText: 'at' },
        },
        {
          id: 's4-r5-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/t/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'top2', icon: 'top', label: 'top', correct: true },
            { id: 'ant', icon: 'ant', label: 'ant', correct: false },
            { id: 'tap2', icon: 'tap', label: 'tap', correct: true },
            { id: 'snake', icon: 'snake', label: 'snake', correct: false },
          ],
          readAloud: { targetText: 'top' },
        },
        {
          id: 's4-r6-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 T를 따라 그리면서 T 소리를 내보세요!',
          words: [{ text: 'T', say: 'tuh' }],
        },
        {
          id: 's4-r7-quickfire',
          // S/A/T 총복습 -- A 스테이지가 2소리만 묻던 것과 달리 이제 세
          // 소리를 전부 묻는다. 보스 직전의 캡스톤 역할이라 hard/reversed
          // 단독 문항은 생략했다.
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!',
          steps: [
            {
              promptAudio: 'sss',
              options: [
                { id: 'cA1', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
                { id: 'cS1', icon: 'letterTile', label: 'S', say: 'sss', correct: true },
                { id: 'cT1', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
              ],
            },
            {
              promptAudio: 'aaa',
              options: [
                { id: 'cS2', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
                { id: 'cT2', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
                { id: 'cA2', icon: 'letterTile', label: 'A', say: 'aaa', correct: true },
              ],
            },
            {
              promptAudio: 'tuh',
              options: [
                { id: 'cT3', icon: 'letterTile', label: 'T', say: 'tuh', correct: true },
                { id: 'cA3', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
                { id: 'cS3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
              ],
            },
          ],
        },
        {
          id: 's4-r8-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['top', 'tap'],
        },
        {
          id: 's4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! T 소리로 크게 외쳐보세요!',
          words: [{ text: 'T', say: 'tuh' }, 'top'],
        },
      ],
      recapKo: '이제 S, A, T를 모두 알아요! 새미, 에이스, 터보가 합체할 준비를 해요!',
      recapAudio: {
        ko: '티는 이런 소리를 내요. 세 소리를 모두 배웠어요.',
        en: ['top', 'tap'],
      },
    },

    {
      id: 'stage-5',
      order: 5,
      title: 'Boss: SAT Combine!',
      villain: { name: 'Dark Spark', art: 'dark-spark' },
      hero: { name: 'Carbon', art: 'carbon' },
      chapterBoss: true,
      reviewTargets: ['S', 'A', 'T'],
      beats: [
        {
          id: 's5-teach',
          kind: 'teach',
          instructionKo: '새미 + 에이스 + 터보가 합체해요! 천천히 들어보세요.',
          repeatAudio: ['sss', 'aaa', 'tuh', 'sat'],
        },
        {
          id: 's5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'S', say: 'sss' },
            { text: 'A', say: 'aaa' },
            { text: 'T', say: 'tuh' },
          ],
          target: 'SAT',
        },
        {
          id: 's5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [
            { text: 'S', say: 'sss' },
            { text: 'A', say: 'aaa' },
            { text: 'T', say: 'tuh' },
            'sat',
          ],
        },
        {
          id: 's5-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['sss', 'aaa', 'tuh', 'sat'],
        },
        {
          id: 's5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요!',
          steps: [
            {
              promptAudio: 'sss',
              options: [
                { id: 'qS', icon: 'letterTile', label: 'S', say: 'sss', correct: true },
                { id: 'qA', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
                { id: 'qT', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
              ],
            },
            {
              promptAudio: 'aaa',
              options: [
                { id: 'qS2', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
                { id: 'qT2', icon: 'letterTile', label: 'T', say: 'tuh', correct: false },
                { id: 'qA2', icon: 'letterTile', label: 'A', say: 'aaa', correct: true },
              ],
            },
            {
              promptAudio: 'tuh',
              options: [
                { id: 'qS3', icon: 'letterTile', label: 'S', say: 'sss', correct: false },
                { id: 'qT3', icon: 'letterTile', label: 'T', say: 'tuh', correct: true },
                { id: 'qA3', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
              ],
            },
          ],
        },
        {
          id: 's5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'T', say: 'tuh' },
            { text: 'S', say: 'sss' },
            { text: 'A', say: 'aaa' },
          ],
          target: 'SAT',
          readAloud: { targetText: 'sat' },
        },
        {
          id: 's5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'SAT', icon: 'letterTile', label: 'SAT', correct: true },
            { id: 'TAS', icon: 'letterTile', label: 'TAS', correct: false },
            { id: 'ATS', icon: 'letterTile', label: 'ATS', correct: false },
          ],
          readAloud: { targetText: 'sat' },
        },
        {
          id: 's5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '단어를 만들고, 큰 소리로 읽어보세요!',
          letters: [
            { text: 'A', say: 'aaa' },
            { text: 'T', say: 'tuh' },
            { text: 'S', say: 'sss' },
          ],
          target: 'SAT',
          readAloud: { targetText: 'sat' },
        },
        {
          id: 's5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '카봇이 외쳐요! 같이 말해볼까요?',
          words: ['sat'],
        },
        {
          id: 's5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! SAT!',
          words: ['sat', 'sat'],
        },
      ],
      recapKo: 'S-A-T는 SAT! 첫 번째 진짜 단어를 만들었어요! 챕터 1 클리어!',
      recapAudio: {
        ko: '세 소리를 합쳐서 첫 번째 단어를 만들었어요!',
        en: ['sss', 'aaa', 'tuh', 'sat'],
      },
    },
  ],
}
