// Chapter 8 (Carbot theme, world 2 opens): IE, EE, OR -> boss blends "TIE" + "CORN".
// Finishes Jolly Phonics Group 4 (ai j oa | ie ee or) -- chapter 7 took the
// first three, this takes the rest. Beat vocabulary is identical to
// chapter-01.js -- see that file's header.
//
// Ids are prefixed 'c8' because getStageById() searches every chapter flat.
// 캐릭터 색·외형은 art.js 소유 -- 데이터는 { name, art, style } 만 준다.
//
// ============================================================================
// 이 챕터는 **세 소리가 전부 다이그래프**인 최초의 챕터다
// ============================================================================
// 챕터 7 은 AI/J/OA 로 셋 중 하나(J)가 홑글자였다. 여기는 IE/EE/OR 셋 다
// 두 글자이고, 그 사실이 이 파일의 거의 모든 결정을 만들었다.
//
// 1) drag-build 의 `target` 은 **슬롯 배열**이다(`['T','IE']`). 문자열로 주면
//    targetSlots() 가 문자 단위로 쪼개 T+I+E 세 슬롯이 되고, 그건 이 챕터가
//    가르치려는 것("두 글자가 한 소리")의 정반대다.
// 2) `optionLabelHtml` 의 sr-only 판정이 `length <= 2` 라 IE/EE/OR 전부
//    한 글자소로 취급된다(정상, 챕터 7 에서 확장됨).
// 3) **`EE` 가 검증기의 SOUND_NOTATION(`/^(.)\1+$/i`) 에 걸렸다.** 같은 글자가
//    겹친 다이그래프를 "화면에 소리 표기 노출" 로 오인한다. 챕터 1~7 은
//    다이그래프가 AI/OA 라 우연히 통과하고 있었다. chapters/index.js 의 그
//    검사에 LETTERFORM 면제를 넣어 고쳤다 -- **Jolly group 5 의 `OO` 두 개도
//    같은 결함에 걸린다**(먼저 고쳐두었다).
//
// ============================================================================
// 소리 표기 -- 전부 측정으로 확정했다 (say -r 88 = EN_RATE 0.5, cmp 판정)
// ============================================================================
// 재현: say -v <voice> -r 88 -o a.aiff "<후보>" && say -v <voice> -r 88 -o b.aiff "<미끼>" && cmp a.aiff b.aiff
// 25개 표기(기존 22 + 신규 3) 전수 pairwise + 미끼 60종(낱자 26 · 숫자 0~12 ·
// 로마 숫자 I/II/III/IV/V/X/L/C/D/M · 약어 · /ai//i://or/ 철자 변이형)을
// 두 음성 교차 스윕했다. 결과: 기존 확정 충돌 a==eh 하나 말고는 **전부 깨끗**.
//
// --- IE `eye` (445 / 412 ms) --- **증명됨**
// `eye` 는 글자 이름 I 와 **두 음성 모두에서 바이트 동일**하다(1x 와 30x 반복형
// 양쪽에서 확인). IE 의 목표음이 정확히 글자 I 의 이름(/ai/)이므로 이건 우회가
// 아니라 Jolly 의 교육 장치("I 가 자기 이름을 말한다") 그대로다 -- 챕터 7 이
// AI 에 `a`(글자 이름 A)를 쓴 것과 같은 논리다.
//   `igh` 도 `eye` 와 바이트 동일해서 쓸 수 있지만 `eye` 를 골랐다: 실제 영어
//   단어라 엔진 사전에 확실히 있고, 짧은 /i/ 표기 `ihh` 와 눈으로 안 헷갈린다.
//   **단일 `i` 를 쓰면 안 된다** -- 검증기의 LETTER_NAME_ONLY(`/^[b-z]$/`)가
//   막는다. `eye` 는 그 그물을 건드리지 않고 같은 소리를 낸다(면제를 늘리는
//   것보다 이게 낫다).
//   기존 표기와의 거리: ihh(짧은 I) 1049/1504ms, a(AI) 399/413ms -- 30x 에서
//   파형이 80~93% 다르다. 대비쌍 문항에 안전하게 같이 놓을 수 있다.
//
// --- OR `or` (384 / 413 ms) --- **증명됨**
// `or` == `ore` == `oar` == `orr`, **두 음성 모두 바이트 동일**. 서로 독립적인
// /or/ 철자 네 개가 한 렌더로 수렴하는 것이 이 소리가 /or/ 라는 증거다.
// 그리고 엔진에는 **또 다른 안정 군집** `ar` == `are` == `our` 가 따로 있고
// `or` 는 거기 속하지 않는다 -- /ar/(car) 로 읽히지 않는다는 뜻이다.
// awh(짧은 O) 1329/1620 · oh(OA) 419/355 · awe/aw 338/355 · o(글자 이름)
// 419/355 · four 495/338 전부와 다르다.
//
// --- EE `ee` (482 / 575 ms) --- **미끼 스윕은 깨끗하지만 음소 자체는 미증명**
// 이 챕터에서 유일하게 "동일성으로 증명" 이 안 된 표기다. 판단 근거를 남긴다:
//   - 이 프로젝트가 실제로 당한 오독 4건(`iii`=="three", `ough`=="oof"/"ow",
//     `ih`==글자이름 I, `sssss`=="ss")은 **전부 충돌**이다 -- 다른 어휘 항목과
//     바이트 동일해진다. `ee` 는 미끼 60종 x 2음성에서 **하나도 안 걸린다**
//     (글자 이름 e/i, 숫자, "double e", key, bee, three 포함).
//   - 길이가 글자 이름 E 의 1.41배(Samantha) / 1.62배(Alex)다. 어휘 항목으로
//     오독되면 길이가 그 어휘의 길이가 되는데, 그런 어휘가 없다.
//   - **Samantha 에서 `eeee` == `ee` 바이트 동일(2개에서 포화)** -- 프로젝트가
//     이미 확인한 지속음(`ss`/`aa`/`mm`/`ll`)의 포화 패턴과 같다. 즉 어휘가
//     아니라 **늘어난 모음**으로 렌더된다는 신호다.
//   - 영어 철자에서 "ee" 는 /i:/ 하나로만 읽힌다. `ough` 가 깨진 이유는 그게
//     진짜로 다의적인 철자열이기 때문이다(though/through/rough/cough).
// 탈락시킨 후보와 이유(다시 시도하지 마라):
//   - `e` : 글자 이름 E 자체라 음소는 확실하지만 342/354ms 로 **앱에서 가장 짧은
//          소리**가 된다(현재 최단은 oh 355ms). 게다가 LETTER_NAME_ONLY 면제를
//          늘려야 한다. 사용자의 실기기 불만이 "너무 빠르다" 쪽이라 반대 방향이다.
//   - `eeh`: Samantha 에서는 글자 이름 E 와 바이트 동일인데 **Alex 에서는 길이만
//          같고 파형이 76% 다르다**(30x, 556913/730364 바이트). 즉 Alex 에서 뭘
//          내는지 모른다 -- `ough` 와 같은 실패 모드다.
//   - `ea`/`ei`/`eee`/`ey`/`iy`: 두 음성 모두를 만족하는 동일성이 없다.
//          (`ey` 는 Samantha 에서만 글자 이름 E 와 동일 -- 음성 의존)
// **실기기 청취 순위 1번이다** (`awh` 와 같은 등급). 폴백은 `ea`
// (481/644ms, 미끼 스윕 깨끗) 이고 표기 하나를 sed 한 번으로 바꿀 수 있다.
//
// --- 검증기에 추가한 블랙리스트 2건 ---
// `ai`(다이그래프 원문)와 `ay` 를 MISREAD_NOTATIONS 에 넣었다. 둘 다
// "다이그래프 철자를 발화 필드에 그대로 쓰는" 가장 자연스러운 실수이고,
// `ay` 는 **음성마다 다른 글자 이름**으로 읽혀서 같은 데이터가 기기에 따라
// 다른 소리를 가르친다. 챕터 9~33 이 group 5~7(전부 다이그래프)을 쓸 때
// 이 그물이 필요하다.
//
// ============================================================================
// 아트 선행 조건 -- 데이터만으로는 해결할 수 없다 (리더/아트 담당에게)
// ============================================================================
// 챕터 8 은 계열 사이클이 카봇(`art/robots.js`)으로 돌아오는 자리다.
// robots.js 의 엠블럼 판은 `polygon points="45,72 75,72 73,94 47,94"`
// (아래 26 ~ 위 30 단위) 이고 글자는 font-size 21 / weight 800 이다.
// 실측(헤드리스 Chrome, getBBox advance width, 판 경계는 글자의 y 대역에서
// 사다리꼴 변을 보간):
//     IE  w=18.70  여유 +3.65/측   -> 들어간다
//     EE  w=24.96  여유 +0.52/측   -> 판 폭의 2% 만 남는다 (실질적으로 안 들어간다)
//     OR  w=30.09  여유 -2.04/측   -> **넘친다**
//     (대조: S 13.73 / A 15.11 / T 13.21 -- 판은 한 글자용으로 설계돼 있다)
// 재현: 이 파일의 커밋 메시지에 하네스가 있다. 리더의 이전 측정(sammy OA -1.4)
// 과 값이 다른 이유는 측정 기준선이다 -- 여기서는 판의 사다리꼴 변을 글자
// y 대역에서 보간했고 advance width 를 썼다(더 보수적).
//
// **다이그래프의 첫 글자만 새기는 우회는 하지 마라.** 이 챕터의 세 다이그래프는
// 하필 전부 **앱이 이미 다른 소리로 가르친 모음**으로 시작한다:
// I=짧은 /i/(챕터 2) · E=짧은 /e/(챕터 3) · O=짧은 /o/(챕터 5). 그러니
// 가슴에 `I` 만 새기는 것은 정보를 줄이는 게 아니라 **아이가 이미 배운 다른
// 소리의 글자를 그 소리의 히어로 가슴에 붙이는 것**이다 -- 축약이 아니라 모순이다.
// 챕터 7 의 DC 계열이 같은 문제를 "큰 이름표" 로 풀었다(HANDOFF §1). 카봇도
// 같은 방향이어야 한다. 그때까지 `★` 로 두는 것이 첫 글자보다 낫다 --
// 파닉스 정보는 0 이지만 틀린 정보는 아니다.
//
// **그리고 그 전에 art.js 팔레트 배선이 필요하다.** 이 파일의 art 슬러그 9개
// (nitro/speedy/stormer/nitrostorm, rustbot/crashbot/slowbot/grindbot/iron-wreck)
// 는 아직 HERO_PALETTES/VILLAIN_PALETTES 에 없다. 없으면 robots.js 의 기본값이
// 쓰이고 **기본 emblem 이 'S' 다** -- 챕터 8 히어로 전원이 가슴에 S 를 달고
// 나온다. 크래시는 없어서 조용히 지나간다. 의도한 엠블럼은
// nitro='IE' · speedy='EE' · stormer='OR' · nitrostorm='★'(보스 관례) 다.
//
// ============================================================================
// 난이도: 보기 개수를 3 -> 4~5 로 올렸다 (챕터 8 이 이걸 처음 한다)
// ============================================================================
// 근거는 우연 정답률이다. 챕터 8 시작 시점에 아이가 아는 글자소는 22개이고
// 이 챕터가 25개로 만든다. 그런데 챕터 1~7 은 보기가 전부 3개여서 **아무것도
// 듣지 않아도 33%** 를 맞는다 -- 아는 글자가 3개일 때와 22개일 때의 난이도가
// 같다는 뜻이고, 그게 HANDOFF 의 "난이도 곡선" 항목이다.
//   보기 3개 -> 4개 : 33% -> 25%
//   보기 5개        : 20%
// 역할별로 갈랐다(전부 올리지 않았다):
//   - `r1-warmup` (scored:false) : **3 유지**. 새 소리를 처음 만나는 자리라
//     부하를 낮게 둔다. 여기서 넓히면 "연습이에요" 가 거짓이 된다.
//   - 그림·역방향 문항, choose-sequence : **4**. 표준 난이도를 25% 로.
//   - `r5-hard` ("조금 어려워요") : **5**. 챕터 1~7 에서는 이 라벨이 붙은 문항이
//     쉬운 문항과 보기 개수가 같아서 **라벨이 빈말이었다**. 이제 참이 된다.
//   - `r5-wordspot` (진짜 단어 찾기) : **3 유지**. 보기가 서로 아나그램이라
//     개수를 늘리면 변별이 아니라 시각 탐색 과제가 된다.
//   - `multiselect` : **5**(정답 3 / 오답 2). 챕터 1~7 은 4(정답 2~3)였다.
// 레이아웃은 측정된 상한 안이다(보기 5개 양방향 스크롤 0, `1c96033`).
// "절대 실패 없음" 은 그대로다 -- 무한 재시도, 2연속 오답 재시연.
//
// 오답 배치 규칙도 유지했다(`eefcab4`): 그림 문항의 오답은 무작위가 아니라
// **한국어 화자의 실제 근접쌍**이다 -- /r/ 에는 /l/, /m/ 에는 /n/, /d/ 에는
// /t/, /k/ 에는 /g/, /p/ 에는 /b/, /j/ 에는 /g/.
//
// ============================================================================
// 누적 복습 (`997aa43` 의 기준을 그대로 적용)
// ============================================================================
// 되꺼낼 글자는 "가장 오래된 것" 이 아니라 **이 챕터의 새 글자와 경쟁하는 것**
// 이다(역행 간섭). 이 챕터는 그 구조가 유난히 깨끗하다 -- 세 다이그래프가
// 각각 이미 배운 홑글자를 하나씩 덮어쓴다:
//     IE(/ai/) 가 I(짧은 /i/) 를 덮는다
//     EE(/i:/) 가 E(짧은 /e/) 를 덮는다
//     OR(/or/) 가 O(짧은 /o/) 를 덮는다
// 게다가 다이그래프끼리도 간섭한다: AI(/ei/) vs IE(/ai/) 는 철자가 뒤집힌
// 쌍이고, OA(/ou/) vs OR 는 첫 글자가 같다. 그래서 복습 스텝의 오답은 전부
// 이 챕터의 새 글자이거나 챕터 7 의 다이그래프다.
//     c8s4-r8-cycle  step4: I(챕터2)  <- 오답 IE, EE, AI
//                    step5: O(챕터5)  <- 오답 OR, OA, EE
//     c8s5-r3-quickfire step4: E(챕터3) <- 오답 EE, IE, OR
// 챕터 7 은 복습 스텝이 choose-sequence 당 1개였다. 여기는 2개(s4)라 스텝이
// 5개인데, 997aa43 이 반박한 "교체" 가 아니라 **추가**다 -- 새 글자 3개의
// 인출은 하나도 줄지 않는다. 그리고 두 beat 에 분산돼 있다(s4 와 s5).
//
// 코드로 못 잡는 제약: 이 챕터의 복습 스텝에 **A 를 넣으면 안 된다**.
// `a`(AI) == `eh`(E) 가 확정 충돌쌍이라 E 복습 스텝과 공존할 수 없고,
// AI 를 오답으로 쓰는 스텝(step4)에 E 를 같이 넣는 것도 같은 이유로 막힌다.
// 검증기가 잡지만 여기 적어두는 편이 빠르다.
//
// ============================================================================
// 보스 단어: TIE (T + IE) · CORN (C + OR + N)
// ============================================================================
// 챕터 3~7 의 구조 그대로: 각 소리를 자기 스테이지 finale 에서 미리 노출하고
// 보스는 조립 시험이다. 세 소리 중 **EE 만 보스에서 조립하지 않는다** --
// 챕터 7 이 J 를 그렇게 뺀 것과 같은 자리(가운데 스테이지)이고, EE 는
// stage-3 finale 에서 보너스 단어 `feet`(F+EE+T, 전부 기지 글자)로 노출된다.
//
// 단어 선정 근거:
//   - **다이그래프 두 개가 한 단어에 들어가지 않게** 했다. 그러면 슬롯 세 개
//     중 두 개가 두 글자가 되어 5세에게 조립 부하가 급증한다.
//   - `TIE` 는 **다이그래프가 어말에 오는 첫 보스 단어**다. 챕터 7 의
//     RAIN/BOAT 는 둘 다 어중이었다. 슬롯 2개짜리 보스 단어도 처음이다
//     (buildEquationsHtml 은 슬롯 수에 무관하다 -- "T + IE = TIE" 13글자,
//      "C + OR + N = CORN" 17글자로 챕터 7 의 RAIN 과 같은 폭 계급이다).
//   - `CORN` 은 어중 다이그래프 + 3슬롯으로 챕터 7 의 형태를 잇는다.
//     C 는 챕터 3 에서 /k/ 로 배웠으므로 낱소리는 `kuh` 다.
//   - 둘 다 5세 한국 남아에게 구체물이다(넥타이, 옥수수).
//
// ============================================================================
// 아이콘: 이 챕터의 그림 커버리지가 1/3 이다 -- 아이콘 담당에게 넘길 것
// ============================================================================
// 현재 62종에서 이 챕터의 세 소리를 그림으로 물어볼 수 있는 것은 **`horse`
// 하나**(OR, h-OR-se)뿐이다. IE 와 EE 는 그림이 **0개**라 두 소리의 문항이
// 전부 letterTile 과 listen-repeat/finale 의 words[] 로만 나간다.
//
// TODO(icon): 아래가 생기면 그 자리에서 바로 그림 문항으로 바꿀 수 있다.
//   조건을 개수로 적는다 -- 낡은 주석이 챕터 4~6 의 버그 원인이었다.
//   * IE: `tie`, `pie` 2개가 생기면 -> c8s2-r2 를 "IE 가 들어있는 그림 찾기"
//     (오답은 어중 모음이 다른 그림 2개)로 교체. `lie` 까지 3개가 되면
//     c8s2 에 multiselect "IE 소리가 들어있는 걸 모두" 를 만들 수 있다
//     (multiselect 는 정답 2개 이상이 필요하고, 정답 쌍이 odd-one-out 과
//      완전히 같아지면 안 되므로 **3개**가 필요하다 -- 챕터 7 이 AI 에서만
//      '모두 찾기' 를 만들 수 있었던 이유가 이것이다).
//   * EE: `bee`, `tree` 2개 -> c8s3-r2 를 "EE 가 들어있는 그림 찾기" 로 교체.
//     `feet` 까지 3개 -> c8s3 에 '모두 찾기' 신설 가능(위와 같은 이유).
//   * OR: `fork`, `corn` 2개 -> `horse` 와 합쳐 3개가 되므로 c8s4 에
//     '모두 찾기' 신설 가능. 지금은 1개라 odd-one-out 도 못 만든다
//     (odd-one-out 은 같은 소리 2개 + 다른 것 1개가 필요하다).
//   * 보스 단어 `tie`·`corn` 의 그림이 생기면 c8s5-r5-wordspot 앞에
//     그림-단어 짝짓기를 넣을 수 있다.
//
// **OR 보드에 절대 올리면 안 되는 기존 아이콘 2종** (사람 눈에는 정답처럼
// 보이지만 아니다 -- 나중에 누가 "OR 그림이 더 있는데?" 하며 넣을 자리다):
//   * `orange` : 철자에 or 이 있지만 소리는 /or/(fork)가 아니라 짧은 /o/+/r/
//                (/orindz/)다. 철자로는 정답, 소리로는 오답인 최악의 보기다.
//   * `door`   : /or/ 소리는 맞지만 철자가 `oo` 다. Jolly 의 or 은 소리-철자
//                짝으로 가르치는 것이므로, 이걸 정답으로 두면 철자를 무너뜨리고
//                오답으로 두면 소리로 판단한 아이가 틀린다. 어느 쪽도 안 된다.
// (`door` 는 이 파일에서 stage-3 의 /d/ 초성 '모두 찾기' 에만 쓴다 -- 그 보드는
//  초성만 묻고 OR 은 아직 배우지도 않은 스테이지다.)

export const chapter8 = {
  id: 'chapter-8',
  order: 8,
  title: 'Carbot Steel Harbor',
  stages: [
    {
      id: 'c8-stage-1',
      order: 1,
      title: 'A Rising Sound',
      villain: { name: 'Rustbot', art: 'rustbot', style: 'robot' },
      hero: { name: 'Nitro', art: 'nitro', style: 'robot' },
      chapterBoss: false,
      beats: [
        {
          id: 'c8s1-teach',
          kind: 'teach',
          instructionKo: 'Nitro가 새로운 소리를 들려줘요. 잘 들어보세요!',
          art: 'hero',
          repeatAudio: ['eye'],
        },
        {
          id: 'c8s1-r1',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          // IE 그림이 0개라 아이콘이 필요 없는 beat 로 IE 소리를 나른다
          // (챕터 7 이 AI 에서 쓴 것과 같은 방법). '시작하는' 이 아니라
          // '들어있는' 이다 -- tie/pie 의 ie 는 어말이다.
          instructionKo: '이 소리가 들어있는 단어예요! 따라 말해보세요.',
          words: ['tie', 'pie'],
        },
        {
          id: 'c8s1-break',
          kind: 'break',
          instructionKo: '함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['eye'],
        },
        {
          id: 'c8s1-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 그림 문항은 전부 누적 복습이다(IE 그림 0개). 오답은 근접쌍 --
          // /d3/ 의 근접쌍은 /g/ 이므로 gum 을 오답으로 둔다.
          instructionKo: '"jam"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'jam',
          options: [
            { id: 'c8s1-gum', icon: 'gum', label: 'gum', correct: false },
            { id: 'c8s1-jug', icon: 'jug', label: 'jug', correct: true },
            { id: 'c8s1-horse', icon: 'horse', label: 'horse', correct: false },
            { id: 'c8s1-fan', icon: 'fan', label: 'fan', correct: false },
          ],
          readAloud: { targetText: 'jug' },
        },
        {
          id: 'c8s1-r3',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"coat"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'coat',
          options: [
            { id: 'c8s1-pen', icon: 'pen', label: 'pen', correct: false },
            { id: 'c8s1-gift', icon: 'gift', label: 'gift', correct: false },
            { id: 'c8s1-nose', icon: 'nose', label: 'nose', correct: false },
            { id: 'c8s1-cake', icon: 'cake', label: 'cake', correct: true },
          ],
          readAloud: { targetText: 'cake' },
        },
        {
          id: 'c8s1-r4',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // 보기 5개(정답 3 / 오답 2). 오답은 /r/ 의 근접쌍 /l/ 이다 --
          // 한국어 화자가 실제로 무너지는 지점이라 무작위 오답보다 훈련이 된다.
          instructionKo: '/r/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c8s1-rat', icon: 'rat', label: 'rat', correct: true },
            { id: 'c8s1-lion', icon: 'lion', label: 'lion', correct: false },
            { id: 'c8s1-ring', icon: 'ring', label: 'ring', correct: true },
            { id: 'c8s1-leg', icon: 'leg', label: 'leg', correct: false },
            { id: 'c8s1-rain', icon: 'rain', label: 'rain', correct: true },
          ],
          readAloud: { targetText: 'rat' },
        },
        {
          id: 'c8s1-r5',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['pie', 'tie'],
        },
        {
          id: 'c8s1-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          instructionKo: '마지막 공격! 큰 소리로 말해보세요!',
          words: ['tie'],
        },
      ],
      recapKo: '새로운 소리를 찾았어요! Tie, pie — 둘 다 이 소리가 들어있어요!',
      recapAudio: {
        // 스테이지 1 은 글자꼴을 아직 안 보여주므로 글자 이름을 부르지 않는다.
        ko: '새로운 긴 소리를 배웠어요. 잘 들어보세요.',
        en: ['eye', 'tie', 'pie'],
      },
    },

    {
      id: 'c8-stage-2',
      order: 2,
      title: 'Power of IE',
      villain: { name: 'Crashbot', art: 'crashbot', style: 'robot' },
      hero: { name: 'Nitro', art: 'nitro', style: 'robot' },
      chapterBoss: false,
      beats: [
        {
          id: 'c8s2-teach',
          kind: 'teach',
          // 챕터 7 의 AI 와 같은 장치 -- 다이그래프가 첫 글자의 **이름**을
          // 말한다. 원문 'ie' 를 발화 필드에 넣지 않는다(파일 헤더 참조).
          instructionKo: 'IE는 I가 자기 이름을 말할 때처럼 소리를 내요!',
          art: 'hero',
          letter: 'IE',
          repeatAudio: ['eye'],
        },
        {
          id: 'c8s2-r1-warmup',
          kind: 'choose',
          scored: false,
          // 연습 라운드만 보기 3개를 유지한다(파일 헤더의 난이도 절 참조).
          // 혼동 보기는 이 다이그래프가 실제로 덮어쓰는 둘 -- 짧은 I 와 AI.
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'eye',
          options: [
            { id: 'c8s2-IE1', icon: 'letterTile', label: 'IE', say: 'eye', correct: true },
            { id: 'c8s2-I1', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
            { id: 'c8s2-AI1', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
          ],
        },
        {
          id: 'c8s2-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '"pig"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'pig',
          // /p/ 의 근접쌍 /b/ 를 오답으로 둔다.
          options: [
            { id: 'c8s2-net', icon: 'net', label: 'net', correct: false },
            { id: 'c8s2-box', icon: 'box', label: 'box', correct: false },
            { id: 'c8s2-pen', icon: 'pen', label: 'pen', correct: true },
            { id: 'c8s2-sun', icon: 'sun', label: 'sun', correct: false },
          ],
          readAloud: { targetText: 'pen' },
        },
        {
          id: 'c8s2-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 IE를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'IE', say: 'eye' }],
        },
        {
          id: 'c8s2-break',
          kind: 'break',
          instructionKo: '손가락으로 IE를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'IE',
          repeatAudio: ['eye'],
        },
        {
          id: 'c8s2-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          instructionKo: '/m/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c8s2-moon', icon: 'moon', label: 'moon', correct: true },
            { id: 'c8s2-net2', icon: 'net', label: 'net', correct: false },
            { id: 'c8s2-man', icon: 'man', label: 'man', correct: true },
            { id: 'c8s2-nose', icon: 'nose', label: 'nose', correct: false },
            { id: 'c8s2-mat', icon: 'mat', label: 'mat', correct: true },
          ],
          readAloud: { targetText: 'moon' },
        },
        {
          id: 'c8s2-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 보기 5개 -- "조금 어려워요" 라벨이 실제로 참인 첫 챕터다.
          // 오답 4개는 전부 이 소리와 경쟁하는 모음이다: 짧은 I(덮어쓰기 대상),
          // AI(철자가 뒤집힌 다이그래프), 짧은 O·U(이미 배운 모음).
          // E 를 넣을 수 없다 -- `eh` 가 AI 의 `a` 와 확정 충돌쌍이다.
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'eye',
          options: [
            { id: 'c8s2-I3', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
            { id: 'c8s2-AI3', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
            { id: 'c8s2-O3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c8s2-U3', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
            { id: 'c8s2-IE3', icon: 'letterTile', label: 'IE', say: 'eye', correct: true },
          ],
          readAloud: { targetText: 'IE', say: 'eye' },
        },
        {
          id: 'c8s2-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 역방향(글자 -> 그림)은 보기가 그림이라 발화되는 건 그림 단어다 --
          // letterTile 음성 충돌 규칙과 무관하므로 다이그래프를 띄울 수 있다.
          // IE 그림이 0개라 여기서는 챕터 7 의 OA 를 복습한다(OA 는 다음
          // 스테이지들의 OR 과 첫 글자가 같아 미리 갈라둘 값이 있다).
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'OA',
          options: [
            { id: 'c8s2-coat', icon: 'coat', label: 'coat', correct: true },
            { id: 'c8s2-jam', icon: 'jam', label: 'jam', correct: false },
            { id: 'c8s2-pin', icon: 'pin', label: 'pin', correct: false },
            { id: 'c8s2-hat', icon: 'hat', label: 'hat', correct: false },
          ],
          readAloud: { targetText: 'coat' },
        },
        {
          id: 'c8s2-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['tie', 'pie'],
        },
        {
          id: 'c8s2-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보스 단어 'tie' 사전 노출 (IE 로 완성, T 는 챕터 1 에서 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'IE', say: 'eye' }, 'tie'],
        },
      ],
      recapKo: 'IE는 I가 이름을 말할 때 소리를 내요 — tie, pie!',
      recapAudio: {
        ko: '이 두 글자는 이런 소리를 내요. 타이, 파이!',
        en: ['eye', 'tie', 'pie'],
      },
    },

    {
      id: 'c8-stage-3',
      order: 3,
      title: 'Power of EE',
      villain: { name: 'Slowbot', art: 'slowbot', style: 'robot' },
      hero: { name: 'Speedy', art: 'speedy', style: 'robot' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE',
      ],
      beats: [
        {
          id: 'c8s3-teach',
          kind: 'teach',
          instructionKo: 'EE는 E가 자기 이름을 말할 때처럼 소리를 내요!',
          art: 'hero',
          letter: 'EE',
          repeatAudio: ['ee'],
        },
        {
          id: 'c8s3-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: 짧은 E(덮어쓰기 대상)와 IE(직전 스테이지의 다이그래프).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'ee',
          options: [
            { id: 'c8s3-E1', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
            { id: 'c8s3-IE1', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
            { id: 'c8s3-EE1', icon: 'letterTile', label: 'EE', say: 'ee', correct: true },
          ],
        },
        {
          id: 'c8s3-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 프롬프트 단어를 'horse' 로 둬서 다음 스테이지의 OR 을 미리 귀에
          // 넣는다. 여기서 묻는 것은 초성 /h/ 다.
          instructionKo: '"horse"과 같은 소리로 시작하는 걸 찾아보세요!',
          promptAudio: 'horse',
          options: [
            { id: 'c8s3-nut', icon: 'nut', label: 'nut', correct: false },
            { id: 'c8s3-hat', icon: 'hat', label: 'hat', correct: true },
            { id: 'c8s3-fish', icon: 'fish', label: 'fish', correct: false },
            { id: 'c8s3-box', icon: 'box', label: 'box', correct: false },
          ],
          readAloud: { targetText: 'hat' },
        },
        {
          id: 'c8s3-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 EE를 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'EE', say: 'ee' }],
        },
        {
          id: 'c8s3-break',
          kind: 'break',
          instructionKo: '손가락으로 EE를 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'EE',
          repeatAudio: ['ee'],
        },
        {
          id: 'c8s3-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // 오답은 /d/ 의 근접쌍 /t/. `door` 는 여기서만 쓴다 -- 초성만 묻는
          // 보드이고 OR 은 아직 안 배운 스테이지다(파일 헤더의 경고 참조).
          instructionKo: '/d/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c8s3-duck', icon: 'duck', label: 'duck', correct: true },
            { id: 'c8s3-top', icon: 'top', label: 'top', correct: false },
            { id: 'c8s3-dog', icon: 'dog', label: 'dog', correct: true },
            { id: 'c8s3-ten', icon: 'ten', label: 'ten', correct: false },
            { id: 'c8s3-door', icon: 'door', label: 'door', correct: true },
          ],
          readAloud: { targetText: 'duck' },
        },
        {
          id: 'c8s3-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 보기 5개. 오답 4개가 전부 /i:/ 와 헷갈릴 수 있는 것들이다:
          // 짧은 E(덮어쓰기 대상), IE(직전 다이그래프), 짧은 I, 짧은 A.
          // AI 는 넣을 수 없다 -- `a` 가 여기 있는 E 의 `eh` 와 확정 충돌쌍이다.
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'ee',
          options: [
            { id: 'c8s3-E3', icon: 'letterTile', label: 'E', say: 'eh', correct: false },
            { id: 'c8s3-IE3', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
            { id: 'c8s3-I3', icon: 'letterTile', label: 'I', say: 'ihh', correct: false },
            { id: 'c8s3-EE3', icon: 'letterTile', label: 'EE', say: 'ee', correct: true },
            { id: 'c8s3-A3', icon: 'letterTile', label: 'A', say: 'aaa', correct: false },
          ],
          readAloud: { targetText: 'EE', say: 'ee' },
        },
        {
          id: 'c8s3-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          instructionKo: '이 글자로 시작하는 그림을 찾아보세요!',
          promptLetter: 'J',
          options: [
            { id: 'c8s3-coat2', icon: 'coat', label: 'coat', correct: false },
            { id: 'c8s3-net3', icon: 'net', label: 'net', correct: false },
            { id: 'c8s3-jam2', icon: 'jam', label: 'jam', correct: true },
            { id: 'c8s3-top2', icon: 'top', label: 'top', correct: false },
          ],
          readAloud: { targetText: 'jam' },
        },
        {
          id: 'c8s3-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['bee', 'tree'],
        },
        {
          id: 'c8s3-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          // 보너스 단어 'feet' (F+EE+T, 전부 기지 글자). EE 는 보스에서
          // 조립하지 않는다 -- 챕터 7 의 J 와 같은 자리다(파일 헤더 참조).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'EE', say: 'ee' }, 'feet'],
        },
      ],
      recapKo: 'EE는 E가 이름을 말할 때 소리를 내요 — bee, tree, feet!',
      recapAudio: {
        ko: '이 두 글자는 이런 소리를 내요. 비, 트리!',
        en: ['ee', 'bee', 'tree'],
      },
    },

    {
      id: 'c8-stage-4',
      order: 4,
      title: 'Power of OR',
      villain: { name: 'Grindbot', art: 'grindbot', style: 'robot' },
      hero: { name: 'Stormer', art: 'stormer', style: 'robot' },
      chapterBoss: false,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
      ],
      beats: [
        {
          id: 'c8s4-teach',
          kind: 'teach',
          // OR 은 글자 이름이 아니라 별개의 장모음이라 IE/EE 의 "이름을
          // 말한다" 장치를 쓸 수 없다. 챕터 1~6 처럼 히어로 동작에 붙인다.
          instructionKo: 'OR은 Stormer의 폭풍이 몰아칠 때처럼 소리를 내요!',
          art: 'hero',
          letter: 'OR',
          repeatAudio: ['or'],
        },
        {
          id: 'c8s4-r1-warmup',
          kind: 'choose',
          scored: false,
          // 혼동 보기: OA(첫 글자가 같은 다이그래프)와 짧은 O(덮어쓰기 대상).
          instructionKo: '이 소리를 내는 글자를 찾아보세요! (연습이에요)',
          promptAudio: 'or',
          options: [
            { id: 'c8s4-OA1', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c8s4-OR1', icon: 'letterTile', label: 'OR', say: 'or', correct: true },
            { id: 'c8s4-O1', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
          ],
        },
        {
          id: 'c8s4-r2',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 이 챕터에서 새 소리를 그림으로 묻는 **유일한** 문항이다 --
          // OR 그림이 `horse` 하나뿐이다(파일 헤더의 TODO(icon) 참조).
          // 오답의 어중 모음은 서로도 다르고 /or/ 과도 다르다:
          // bed /e/, box /o/(OR 의 근접쌍), cat /a/.
          instructionKo: '이 소리가 들어있는 그림을 찾아보세요!',
          promptAudio: 'or',
          options: [
            { id: 'c8s4-horse', icon: 'horse', label: 'horse', correct: true },
            { id: 'c8s4-bed', icon: 'bed', label: 'bed', correct: false },
            { id: 'c8s4-box2', icon: 'box', label: 'box', correct: false },
            { id: 'c8s4-cat', icon: 'cat', label: 'cat', correct: false },
          ],
          readAloud: { targetText: 'horse' },
        },
        {
          id: 'c8s4-r3-trace',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '손가락으로 OR을 따라 그리면서 소리를 내보세요!',
          words: [{ text: 'OR', say: 'or' }],
        },
        {
          id: 'c8s4-break',
          kind: 'break',
          instructionKo: '손가락으로 OR을 그려볼까요? 함께 외쳐요!',
          art: 'hero',
          letter: 'OR',
          repeatAudio: ['or'],
        },
        {
          id: 'c8s4-r4-multiselect',
          kind: 'multiselect',
          scored: true,
          hits: 1,
          // 오답은 /k/ 의 근접쌍 /g/.
          instructionKo: '/k/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!',
          options: [
            { id: 'c8s4-cat2', icon: 'cat', label: 'cat', correct: true },
            { id: 'c8s4-gum', icon: 'gum', label: 'gum', correct: false },
            { id: 'c8s4-cup', icon: 'cup', label: 'cup', correct: true },
            { id: 'c8s4-gift', icon: 'gift', label: 'gift', correct: false },
            { id: 'c8s4-cake', icon: 'cake', label: 'cake', correct: true },
          ],
          readAloud: { targetText: 'cat' },
        },
        {
          id: 'c8s4-r5-hard',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 보기 5개. OA(첫 글자 공유) · 짧은 O(덮어쓰기 대상) · U · EE.
          instructionKo: '이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)',
          promptAudio: 'or',
          options: [
            { id: 'c8s4-OA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
            { id: 'c8s4-O3', icon: 'letterTile', label: 'O', say: 'awh', correct: false },
            { id: 'c8s4-OR3', icon: 'letterTile', label: 'OR', say: 'or', correct: true },
            { id: 'c8s4-U3', icon: 'letterTile', label: 'U', say: 'uh', correct: false },
            { id: 'c8s4-EE3b', icon: 'letterTile', label: 'EE', say: 'ee', correct: false },
          ],
          readAloud: { targetText: 'OR', say: 'or' },
        },
        {
          id: 'c8s4-r6-reversed',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 보스 단어가 아니라 `horse` 를 정답으로 둔다 -- OR 그림이 이것뿐이다.
          // `orange`(철자만 or) 와 `door`(소리만 or) 는 이 보드에 절대 올리지
          // 마라(파일 헤더의 경고).
          instructionKo: '이 글자가 들어있는 그림을 찾아보세요!',
          promptLetter: 'OR',
          options: [
            { id: 'c8s4-gum2', icon: 'gum', label: 'gum', correct: false },
            { id: 'c8s4-fan2', icon: 'fan', label: 'fan', correct: false },
            { id: 'c8s4-ten2', icon: 'ten', label: 'ten', correct: false },
            { id: 'c8s4-horse2', icon: 'horse', label: 'horse', correct: true },
          ],
          readAloud: { targetText: 'horse' },
        },
        {
          id: 'c8s4-r7-listenrepeat',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '단어를 하나씩 따라 말해보세요!',
          words: ['fork', 'corn'],
        },
        {
          id: 'c8s4-r8-cycle',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          // 스텝 5개(새 글자 3 + 누적 복습 2), 보기 4개. 챕터 7 은 4스텝
          // (복습 1)이었다. 복습 스텝의 오답은 전부 이 챕터의 새 글자 또는
          // 챕터 7 의 다이그래프다 -- 그래야 방해가 작동한다(997aa43).
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'eye',
              options: [
                { id: 'c8s4-qAI', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
                { id: 'c8s4-qIE', icon: 'letterTile', label: 'IE', say: 'eye', correct: true },
                { id: 'c8s4-qOA', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c8s4-qEE', icon: 'letterTile', label: 'EE', say: 'ee', correct: false },
              ],
            },
            {
              promptAudio: 'ee',
              options: [
                { id: 'c8s4-qIE2', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
                { id: 'c8s4-qOR2', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
                { id: 'c8s4-qAI2', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
                { id: 'c8s4-qEE2', icon: 'letterTile', label: 'EE', say: 'ee', correct: true },
              ],
            },
            {
              promptAudio: 'or',
              options: [
                { id: 'c8s4-qOR3', icon: 'letterTile', label: 'OR', say: 'or', correct: true },
                { id: 'c8s4-qOA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c8s4-qEE3', icon: 'letterTile', label: 'EE', say: 'ee', correct: false },
                { id: 'c8s4-qIE3', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
              ],
            },
            // 누적 복습 (챕터 2 의 짧은 I). IE 를 배우는 순간 가장 위험한 것이
            // 짧은 /i/ 다 -- 아이가 I 를 보고 IE 소리를 내기 시작하는 것이
            // 전형적 붕괴다. 오답에 IE 와 AI 를 나란히 둬서 셋을 갈라야 하게 만든다.
            {
              promptAudio: 'ihh',
              options: [
                { id: 'c8s4-qIE4', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
                { id: 'c8s4-qEE4', icon: 'letterTile', label: 'EE', say: 'ee', correct: false },
                { id: 'c8s4-qI', icon: 'letterTile', label: 'I', say: 'ihh', correct: true },
                { id: 'c8s4-qAI4', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
              ],
            },
            // 누적 복습 (챕터 5 의 짧은 O). OR 과 OA 가 둘 다 O 로 시작하므로
            // 홑글자 O 가 양쪽에서 덮인다 -- 이 챕터에서 가장 위험한 홑글자다.
            {
              promptAudio: 'awh',
              options: [
                { id: 'c8s4-qOR5', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
                { id: 'c8s4-qO', icon: 'letterTile', label: 'O', say: 'awh', correct: true },
                { id: 'c8s4-qOA5', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c8s4-qEE5', icon: 'letterTile', label: 'EE', say: 'ee', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c8s4-finale',
          kind: 'finale',
          scored: true,
          hits: 1,
          // 보스 단어 'corn' 사전 노출 (OR 로 완성, C·N 은 이미 기지).
          instructionKo: '마지막 공격! 이 소리로 크게 외쳐보세요!',
          words: [{ text: 'OR', say: 'or' }, 'corn'],
        },
      ],
      recapKo: '이제 IE, EE, OR를 모두 알아요! Nitro, Speedy, Stormer가 합체할 준비를 해요!',
      recapAudio: {
        ko: '이 두 글자는 이런 소리를 내요. 이제 세 소리를 모두 배웠어요.',
        en: ['or', 'fork', 'corn'],
      },
    },

    {
      id: 'c8-stage-5',
      order: 5,
      title: 'Boss: TIE and CORN!',
      villain: { name: 'Iron Wreck', art: 'iron-wreck', style: 'robot-deluxe' },
      hero: { name: 'Nitrostorm', art: 'nitrostorm', style: 'robot-deluxe' },
      chapterBoss: true,
      reviewTargets: [
        'S', 'A', 'T', 'I', 'P', 'N', 'C', 'K', 'E', 'H', 'R', 'M',
        'D', 'G', 'O', 'U', 'L', 'F', 'B', 'AI', 'J', 'OA', 'IE', 'EE', 'OR',
      ],
      beats: [
        {
          id: 'c8s5-teach',
          kind: 'teach',
          // 보스 인트로에는 emoji 를 달지 않는다 -- 이 자리에는
          // buildEquationsHtml() 의 글자 등식("T + IE = TIE")이 그려진다.
          instructionKo: 'Nitro + Speedy + Stormer가 합체해요! 먼저 tie를 만들어요.',
          repeatAudio: ['tuh', 'eye', 'tie'],
        },
        {
          id: 'c8s5-r1-warmup',
          kind: 'drag-build',
          scored: false,
          // 슬롯 배열 target -- 'IE' 두 글자가 한 슬롯이다. 이 앱의 첫
          // **2슬롯** 보스 단어이고 다이그래프가 **어말**에 오는 첫 사례다.
          instructionKo: '글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)',
          letters: [
            { text: 'T', say: 'tuh' },
            { text: 'IE', say: 'eye' },
          ],
          target: ['T', 'IE'],
        },
        {
          id: 'c8s5-r2',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: '천천히 따라 말해보세요.',
          words: [{ text: 'T', say: 'tuh' }, { text: 'IE', say: 'eye' }, 'tie'],
        },
        {
          id: 'c8s5-break',
          kind: 'break',
          instructionKo: '이번엔 corn이에요! 함께 외쳐볼까요?',
          art: 'hero',
          repeatAudio: ['kuh', 'or', 'nnn', 'corn'],
        },
        {
          id: 'c8s5-r3-quickfire',
          kind: 'choose-sequence',
          scored: true,
          hits: 1,
          instructionKo: '소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.',
          steps: [
            {
              promptAudio: 'or',
              options: [
                { id: 'c8s5-qOA', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
                { id: 'c8s5-qIE', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
                { id: 'c8s5-qEE', icon: 'letterTile', label: 'EE', say: 'ee', correct: false },
                { id: 'c8s5-qOR', icon: 'letterTile', label: 'OR', say: 'or', correct: true },
              ],
            },
            {
              promptAudio: 'eye',
              options: [
                { id: 'c8s5-qIE2', icon: 'letterTile', label: 'IE', say: 'eye', correct: true },
                { id: 'c8s5-qEE2', icon: 'letterTile', label: 'EE', say: 'ee', correct: false },
                { id: 'c8s5-qOR2', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
                { id: 'c8s5-qAI2', icon: 'letterTile', label: 'AI', say: 'a', correct: false },
              ],
            },
            {
              promptAudio: 'ee',
              options: [
                { id: 'c8s5-qOR3', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
                { id: 'c8s5-qIE3', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
                { id: 'c8s5-qEE3', icon: 'letterTile', label: 'EE', say: 'ee', correct: true },
                { id: 'c8s5-qOA3', icon: 'letterTile', label: 'OA', say: 'oh', correct: false },
              ],
            },
            // 누적 복습 (챕터 3 의 짧은 E). EE 가 덮어쓰는 홑글자다.
            // AI 를 오답으로 쓸 수 없다 -- `a` 가 `eh` 와 확정 충돌쌍이다.
            {
              promptAudio: 'eh',
              options: [
                { id: 'c8s5-qEE4', icon: 'letterTile', label: 'EE', say: 'ee', correct: false },
                { id: 'c8s5-qE', icon: 'letterTile', label: 'E', say: 'eh', correct: true },
                { id: 'c8s5-qIE4', icon: 'letterTile', label: 'IE', say: 'eye', correct: false },
                { id: 'c8s5-qOR4', icon: 'letterTile', label: 'OR', say: 'or', correct: false },
              ],
            },
          ],
        },
        {
          id: 'c8s5-r4',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'IE', say: 'eye' },
            { text: 'T', say: 'tuh' },
          ],
          target: ['T', 'IE'],
          readAloud: { targetText: 'tie' },
        },
        {
          id: 'c8s5-r5-wordspot',
          kind: 'choose',
          scored: true,
          hits: 1,
          // 보기 3개 유지 -- 서로 아나그램이라 개수를 늘리면 소리 변별이 아니라
          // 시각 탐색 과제가 된다(파일 헤더의 난이도 절).
          instructionKo: '진짜 단어를 찾아보세요!',
          options: [
            { id: 'c8s5-IET', icon: 'letterTile', label: 'IET', correct: false },
            { id: 'c8s5-TIE', icon: 'letterTile', label: 'TIE', correct: true },
            { id: 'c8s5-ETI', icon: 'letterTile', label: 'ETI', correct: false },
          ],
          readAloud: { targetText: 'tie' },
        },
        {
          id: 'c8s5-r6',
          kind: 'drag-build',
          scored: true,
          hits: 1,
          instructionKo: '이제 corn을 만들어요! 순서대로 옮겨보세요.',
          letters: [
            { text: 'N', say: 'nnn' },
            { text: 'C', say: 'kuh' },
            { text: 'OR', say: 'or' },
          ],
          target: ['C', 'OR', 'N'],
          readAloud: { targetText: 'corn' },
        },
        {
          id: 'c8s5-r7-bonus',
          kind: 'listen-repeat',
          scored: true,
          hits: 1,
          instructionKo: 'corn도 천천히 따라 말해보세요.',
          words: [
            { text: 'C', say: 'kuh' },
            { text: 'OR', say: 'or' },
            { text: 'N', say: 'nnn' },
            'corn',
          ],
        },
        {
          id: 'c8s5-finale',
          kind: 'finale',
          scored: true,
          hits: 2,
          instructionKo: '마지막 합체 공격! TIE! CORN!',
          words: ['tie', 'corn'],
        },
      ],
      recapKo: 'T-IE는 TIE, C-OR-N은 CORN! 단어 두 개를 만들었어요! 챕터 8 클리어!',
      recapAudio: {
        ko: '단어 두 개를 만들었어요! 잘 들어보세요.',
        en: ['tie', 'corn'],
      },
    },
  ],
}
