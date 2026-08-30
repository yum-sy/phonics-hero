// Chapter 24 (Skyward City Crisis) -- consonant blend chapter (world 4, no new
// phonemes: Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이
// 챕터가 가르치는 것은 이미 배운 낱글자 소리 두세 개를 이어 말하는 것뿐이다
// -- SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: 마블 히어로(art.js superhero*), 히어로는 Inky/Nord/Pip/Captain Pin 재사용(새 art 슬러그 -c24)
// 블렌드: NCH (bench/lunch) / STR (strap/strong) -- 스테이지3은 원래 THR
// (three/throb)를 가르쳤으나 보스가 실제로 쓰는 블렌드와 무관한 고아
// 콘텐츠였다(리더 QA 감사로 발견, 2026-08). 보스가 실제로 조립하는 두 번째
// 블렌드(STR)의 소개 스테이지로 교체했다(챕터15 패턴과 일치).
// 보스 단어: BENCH(B+E+N+CH) + STRAP(S+T+R+A+P)
// 아이콘: icon 재고 없음 -- 전부 단어 기반
//
// ============================================================================
// 구조 (chapter-09/29 템플릿 그대로: 5스테이지, 블렌드 3개를 스테이지1-2 /
// 3 / 4에 배정, 스테이지5 보스가 첫 번째와 세 번째 블렌드를 합체 -- 가운데
// 블렌드는 챕터 7/8/9/12 관례대로 보스에서 스킵)
// ============================================================================
// - 비보스 teach/break beat는 검증기 규칙상 소리 토큰이 정확히 1개여야 한다
//   (MAX_DRILL_SOUND_TOKENS=1). 블렌드 자체(소리 2~3개)는 이 자리에서
//   시연하지 않는다 -- 대신 각 단어의 실제 사전 발음(TTS가 정확히 읽는
//   진짜 단어, 예: 'scan')을 그 자체로 repeatAudio에 쓴다. 낱소리 -> 단어
//   블렌딩 시연은 listen-repeat의 words[] 배열({text,say} 나열 뒤 합친
//   단어 문자열)이 담당하고, chapterBoss 전용이 아니라 모든 스테이지에서
//   같은 패턴을 쓴다(검증기의 블렌드 계약 자체는 보스에서만 강제된다).
// - 그림 재고가 있는 블렌드는 promptLetter 기반 choose로 인식 문항을 만들고,
//   재고가 없는 블렌드는 챕터 9의 처방 그대로 누적 복습(기존 69종 아이콘)으로
//   채운다.
// - "진짜 단어를 찾아보세요" wordspot 문항의 오답은 정답 철자의 순열이다
//   (예: SCAN -> SCNA/SANC/...). 이미 배운 실제 단어(cat/tan 등)와 우연히
//   겹치는 순열은 걸러낸다(gen.mjs의 KNOWN_WORDS) -- 아이가 이미 아는 다른
//   진짜 단어를 오답으로 만나면 "진짜 단어 찾기"가 무의미해지기 때문이다.
// - reviewTargets는 챕터 14까지 가르친 42개 소리(글자꼴 41종, OO가 긴/짧은
//   두 소리를 한 글자꼴로 묶는다)를 그대로 나열한다 -- 이 챕터가 새 글자꼴을
//   가르치지 않으므로 챕터 22~33 전체가 이 배열과 동일해야 한다(누적 복습
//   생성기 withGeneratedReview가 chapter.order > 8에서 소비한다).
//
export const chapter24 = {
  "id": "chapter-24",
  "order": 24,
  "title": "Skyward City Crisis",
  "stages": [
    {
      "id": "c24-stage-1",
      "order": 1,
      "title": "A Bench Sound",
      "villain": {
        "name": "Fizzlecrack",
        "art": "fizzlecrack",
        "style": "supervillain-fog"
      },
      "hero": {
        "name": "Inky",
        "art": "inky-c24",
        "style": "superhero-acrobat"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c24s1-teach",
          "kind": "teach",
          "instructionKo": "Inky가 \"bench\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "nnn"
          ]
        },
        {
          "id": "c24s1-r1",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 하나씩 듣고, 이어서 단어를 말해보세요!",
          "words": [
            {
              "text": "B",
              "say": "buh"
            },
            {
              "text": "E",
              "say": "eh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "CH",
              "say": "ch"
            },
            "bench"
          ]
        },
        {
          "id": "c24s1-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "ch"
          ]
        },
        {
          "id": "c24s1-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"elephant\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "eh",
          "options": [
            {
              "id": "c24s1-r2-oc",
              "icon": "elephant",
              "label": "elephant",
              "correct": true
            },
            {
              "id": "c24s1-r2-o0",
              "icon": "hat",
              "label": "hat",
              "correct": false
            },
            {
              "id": "c24s1-r2-o1",
              "icon": "rain",
              "label": "rain",
              "correct": false
            },
            {
              "id": "c24s1-r2-o2",
              "icon": "man",
              "label": "man",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "elephant"
          }
        },
        {
          "id": "c24s1-r3",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"duck\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "duh",
          "options": [
            {
              "id": "c24s1-r3-o0",
              "icon": "gum",
              "label": "gum",
              "correct": false
            },
            {
              "id": "c24s1-r3-oc",
              "icon": "duck",
              "label": "duck",
              "correct": true
            },
            {
              "id": "c24s1-r3-o1",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            },
            {
              "id": "c24s1-r3-o2",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "duck"
          }
        },
        {
          "id": "c24s1-r4",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"boat\"와 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c24s1-r4-w2",
              "icon": "cup",
              "label": "cup",
              "correct": false
            },
            {
              "id": "c24s1-r4-c0",
              "icon": "boat",
              "label": "boat",
              "correct": true
            },
            {
              "id": "c24s1-r4-c1",
              "icon": "bed",
              "label": "bed",
              "correct": true
            },
            {
              "id": "c24s1-r4-w0",
              "icon": "car",
              "label": "car",
              "correct": false
            },
            {
              "id": "c24s1-r4-w1",
              "icon": "cat",
              "label": "cat",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "boat"
          }
        },
        {
          "id": "c24s1-r5",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "bench",
            "lunch"
          ]
        },
        {
          "id": "c24s1-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "bench"
          ]
        }
      ],
      "recapKo": "새로운 소리 조합을 찾았어요! bench, lunch — 둘 다 이 소리가 들어있어요!",
      "recapAudio": {
        "ko": "새로운 소리 조합을 배웠어요. 잘 들어보세요.",
        "en": [
          "bench",
          "lunch"
        ]
      }
    },
    {
      "id": "c24-stage-2",
      "order": 2,
      "title": "Power of NCH",
      "villain": {
        "name": "Benchwraith",
        "art": "benchwraith",
        "style": "supervillain-eraser"
      },
      "hero": {
        "name": "Inky",
        "art": "inky-c24",
        "style": "superhero-acrobat"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c24s2-teach",
          "kind": "teach",
          "instructionKo": "Inky가 \"bench\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "nnn"
          ]
        },
        {
          "id": "c24s2-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "진짜 단어를 찾아보세요! (연습이에요)",
          "options": [
            {
              "id": "c24s2-r1-warmup-o0",
              "icon": "letterTile",
              "label": "EHNBC",
              "correct": false
            },
            {
              "id": "c24s2-r1-warmup-o1",
              "icon": "letterTile",
              "label": "EHBNC",
              "correct": false
            },
            {
              "id": "c24s2-r1-warmup-oc",
              "icon": "letterTile",
              "label": "BENCH",
              "correct": true
            }
          ]
        },
        {
          "id": "c24s2-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"jam\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "juh",
          "options": [
            {
              "id": "c24s2-r2-o0",
              "icon": "bee",
              "label": "bee",
              "correct": false
            },
            {
              "id": "c24s2-r2-o1",
              "icon": "fork",
              "label": "fork",
              "correct": false
            },
            {
              "id": "c24s2-r2-oc",
              "icon": "jam",
              "label": "jam",
              "correct": true
            },
            {
              "id": "c24s2-r2-o2",
              "icon": "zebra",
              "label": "zebra",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "jam"
          }
        },
        {
          "id": "c24s2-r3-blenddemo",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 하나씩 듣고, 이어서 단어를 말해보세요!",
          "words": [
            {
              "text": "B",
              "say": "buh"
            },
            {
              "text": "E",
              "say": "eh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "CH",
              "say": "ch"
            },
            "bench"
          ]
        },
        {
          "id": "c24s2-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "ch"
          ]
        },
        {
          "id": "c24s2-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"cake\"와 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c24s2-r4-multiselect-c0",
              "icon": "cake",
              "label": "cake",
              "correct": true
            },
            {
              "id": "c24s2-r4-multiselect-c1",
              "icon": "car",
              "label": "car",
              "correct": true
            },
            {
              "id": "c24s2-r4-multiselect-w0",
              "icon": "mat",
              "label": "mat",
              "correct": false
            },
            {
              "id": "c24s2-r4-multiselect-w1",
              "icon": "moon",
              "label": "moon",
              "correct": false
            },
            {
              "id": "c24s2-r4-multiselect-w2",
              "icon": "dog",
              "label": "dog",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "cake"
          }
        },
        {
          "id": "c24s2-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c24s2-r5-hard-o0",
              "icon": "letterTile",
              "label": "CHENB",
              "correct": false
            },
            {
              "id": "c24s2-r5-hard-oc",
              "icon": "letterTile",
              "label": "BENCH",
              "correct": true
            },
            {
              "id": "c24s2-r5-hard-o1",
              "icon": "letterTile",
              "label": "HCENB",
              "correct": false
            },
            {
              "id": "c24s2-r5-hard-o2",
              "icon": "letterTile",
              "label": "ECHNB",
              "correct": false
            },
            {
              "id": "c24s2-r5-hard-o3",
              "icon": "letterTile",
              "label": "CEHNB",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "bench"
          }
        },
        {
          "id": "c24s2-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"moon\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "mmm",
          "options": [
            {
              "id": "c24s2-r6-reversed-o0",
              "icon": "book",
              "label": "book",
              "correct": false
            },
            {
              "id": "c24s2-r6-reversed-o1",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": false
            },
            {
              "id": "c24s2-r6-reversed-o2",
              "icon": "box",
              "label": "box",
              "correct": false
            },
            {
              "id": "c24s2-r6-reversed-oc",
              "icon": "moon",
              "label": "moon",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "moon"
          }
        },
        {
          "id": "c24s2-r7-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "bench",
            "lunch"
          ]
        },
        {
          "id": "c24s2-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "bench"
          ]
        }
      ],
      "recapKo": "bench에는 두 소리가 이어져 있어요 — bench, lunch!",
      "recapAudio": {
        "ko": "두 소리가 이어진 단어를 배웠어요. 잘 들어보세요.",
        "en": [
          "bench",
          "lunch"
        ]
      }
    },
    {
      "id": "c24-stage-3",
      "order": 3,
      "title": "A Strap Sound",
      "villain": {
        "name": "Echofang",
        "art": "echofang",
        "style": "supervillain-stop"
      },
      "hero": {
        "name": "Nord",
        "art": "nord-c24",
        "style": "superhero-thunder"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c24s3-teach",
          "kind": "teach",
          "instructionKo": "Nord가 \"strap\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "sss"
          ]
        },
        {
          "id": "c24s3-r1",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 하나씩 듣고, 이어서 단어를 말해보세요!",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "P",
              "say": "puh"
            },
            "strap"
          ]
        },
        {
          "id": "c24s3-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c24s3-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"zebra\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "zze",
          "options": [
            {
              "id": "c24s3-r2-oc",
              "icon": "zebra",
              "label": "zebra",
              "correct": true
            },
            {
              "id": "c24s3-r2-o0",
              "icon": "king",
              "label": "king",
              "correct": false
            },
            {
              "id": "c24s3-r2-o1",
              "icon": "van",
              "label": "van",
              "correct": false
            },
            {
              "id": "c24s3-r2-o2",
              "icon": "pig",
              "label": "pig",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "zebra"
          }
        },
        {
          "id": "c24s3-r3",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"yoyo\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "yyuh",
          "options": [
            {
              "id": "c24s3-r3-oc",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": true
            },
            {
              "id": "c24s3-r3-o0",
              "icon": "watch",
              "label": "watch",
              "correct": false
            },
            {
              "id": "c24s3-r3-o1",
              "icon": "box",
              "label": "box",
              "correct": false
            },
            {
              "id": "c24s3-r3-o2",
              "icon": "chips",
              "label": "chips",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "yoyo"
          }
        },
        {
          "id": "c24s3-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"sun\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c24s3-r4-multiselect-c0",
              "icon": "sun",
              "label": "sun",
              "correct": true
            },
            {
              "id": "c24s3-r4-multiselect-c1",
              "icon": "sock",
              "label": "sock",
              "correct": true
            },
            {
              "id": "c24s3-r4-multiselect-c2",
              "icon": "star",
              "label": "star",
              "correct": true
            },
            {
              "id": "c24s3-r4-multiselect-w0",
              "icon": "top",
              "label": "top",
              "correct": false
            },
            {
              "id": "c24s3-r4-multiselect-w1",
              "icon": "apple",
              "label": "apple",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "sun"
          }
        },
        {
          "id": "c24s3-r5",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "strap",
            "strong"
          ]
        },
        {
          "id": "c24s3-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "strap"
          ]
        }
      ],
      "recapKo": "새로운 소리 조합을 찾았어요! strap, strong — 둘 다 이 소리가 들어있어요!",
      "recapAudio": {
        "ko": "새로운 소리 조합을 배웠어요. 잘 들어보세요.",
        "en": [
          "strap",
          "strong"
        ]
      }
    },
    {
      "id": "c24-stage-4",
      "order": 4,
      "title": "Power of STR",
      "villain": {
        "name": "Strapwire",
        "art": "strapwire",
        "style": "supervillain-jumble"
      },
      "hero": {
        "name": "Pip",
        "art": "pip-c24",
        "style": "superhero-shield"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c24s4-teach",
          "kind": "teach",
          "instructionKo": "Pip가 \"strap\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "sss"
          ]
        },
        {
          "id": "c24s4-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "진짜 단어를 찾아보세요! (연습이에요)",
          "options": [
            {
              "id": "c24s4-r1-warmup-o0",
              "icon": "letterTile",
              "label": "RTAPS",
              "correct": false
            },
            {
              "id": "c24s4-r1-warmup-oc",
              "icon": "letterTile",
              "label": "STRAP",
              "correct": true
            },
            {
              "id": "c24s4-r1-warmup-o1",
              "icon": "letterTile",
              "label": "RTPAS",
              "correct": false
            }
          ]
        },
        {
          "id": "c24s4-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"cat\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c24s4-r2-o0",
              "icon": "egg",
              "label": "egg",
              "correct": false
            },
            {
              "id": "c24s4-r2-o1",
              "icon": "hat",
              "label": "hat",
              "correct": false
            },
            {
              "id": "c24s4-r2-oc",
              "icon": "cat",
              "label": "cat",
              "correct": true
            },
            {
              "id": "c24s4-r2-o2",
              "icon": "rain",
              "label": "rain",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "cat"
          }
        },
        {
          "id": "c24s4-r3-blenddemo",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 하나씩 듣고, 이어서 단어를 말해보세요!",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "P",
              "say": "puh"
            },
            "strap"
          ]
        },
        {
          "id": "c24s4-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c24s4-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"hat\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c24s4-r4-multiselect-w2",
              "icon": "book",
              "label": "book",
              "correct": false
            },
            {
              "id": "c24s4-r4-multiselect-c0",
              "icon": "hat",
              "label": "hat",
              "correct": true
            },
            {
              "id": "c24s4-r4-multiselect-c1",
              "icon": "hen",
              "label": "hen",
              "correct": true
            },
            {
              "id": "c24s4-r4-multiselect-w0",
              "icon": "boat",
              "label": "boat",
              "correct": false
            },
            {
              "id": "c24s4-r4-multiselect-w1",
              "icon": "bus",
              "label": "bus",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "hat"
          }
        },
        {
          "id": "c24s4-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c24s4-r5-hard-oc",
              "icon": "letterTile",
              "label": "STRAP",
              "correct": true
            },
            {
              "id": "c24s4-r5-hard-o0",
              "icon": "letterTile",
              "label": "TSRAP",
              "correct": false
            },
            {
              "id": "c24s4-r5-hard-o1",
              "icon": "letterTile",
              "label": "RSTAP",
              "correct": false
            },
            {
              "id": "c24s4-r5-hard-o2",
              "icon": "letterTile",
              "label": "SRTAP",
              "correct": false
            },
            {
              "id": "c24s4-r5-hard-o3",
              "icon": "letterTile",
              "label": "TRSAP",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "strap"
          }
        },
        {
          "id": "c24s4-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"octopus\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "awh",
          "options": [
            {
              "id": "c24s4-r6-reversed-o0",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            },
            {
              "id": "c24s4-r6-reversed-o1",
              "icon": "lion",
              "label": "lion",
              "correct": false
            },
            {
              "id": "c24s4-r6-reversed-o2",
              "icon": "fan",
              "label": "fan",
              "correct": false
            },
            {
              "id": "c24s4-r6-reversed-oc",
              "icon": "octopus",
              "label": "octopus",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "octopus"
          }
        },
        {
          "id": "c24s4-r7-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "strap",
            "strong"
          ]
        },
        {
          "id": "c24s4-r8-cycle",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c24s4-r8-cycle-s0-o1",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s0-o0",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s0-oc",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                },
                {
                  "id": "c24s4-r8-cycle-s0-o2",
                  "icon": "letterTile",
                  "label": "X",
                  "say": "ksuh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "tuh",
              "options": [
                {
                  "id": "c24s4-r8-cycle-s1-o0",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s1-o2",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s1-o1",
                  "icon": "letterTile",
                  "label": "K",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s1-oc",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "mmm",
              "options": [
                {
                  "id": "c24s4-r8-cycle-s2-oc",
                  "icon": "letterTile",
                  "label": "M",
                  "say": "mmm",
                  "correct": true
                },
                {
                  "id": "c24s4-r8-cycle-s2-o1",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s2-o0",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s2-o2",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "rrr",
              "options": [
                {
                  "id": "c24s4-r8-cycle-s3-o0",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s3-oc",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                },
                {
                  "id": "c24s4-r8-cycle-s3-o1",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s3-o2",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "fff",
              "options": [
                {
                  "id": "c24s4-r8-cycle-s4-o0",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s4-o1",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c24s4-r8-cycle-s4-oc",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                },
                {
                  "id": "c24s4-r8-cycle-s4-o2",
                  "icon": "letterTile",
                  "label": "SH",
                  "say": "shhu",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c24s4-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "strap"
          ]
        }
      ],
      "recapKo": "strap에는 두 소리가 이어져 있어요 — strap, strong!",
      "recapAudio": {
        "ko": "두 소리가 이어진 단어를 배웠어요. 잘 들어보세요.",
        "en": [
          "strap",
          "strong"
        ]
      },
      "reviewTargets": [
        "S",
        "A",
        "T",
        "I",
        "P",
        "N",
        "C",
        "K",
        "E",
        "H",
        "R",
        "M",
        "D",
        "G",
        "O",
        "U",
        "L",
        "F",
        "B",
        "AI",
        "J",
        "OA",
        "IE",
        "EE",
        "OR",
        "Z",
        "W",
        "NG",
        "V",
        "OO",
        "Y",
        "X",
        "CH",
        "SH",
        "TH",
        "QU",
        "OU",
        "OI",
        "UE",
        "AR",
        "ER"
      ]
    },
    {
      "id": "c24-stage-5",
      "order": 5,
      "title": "Boss: BENCH and STRAP!",
      "villain": {
        "name": "Overload Prime",
        "art": "overload-prime",
        "style": "supervillain-king"
      },
      "hero": {
        "name": "Captain Pin",
        "art": "captain-pin-c24",
        "style": "superhero-armor"
      },
      "chapterBoss": true,
      "reviewTargets": [
        "S",
        "A",
        "T",
        "I",
        "P",
        "N",
        "C",
        "K",
        "E",
        "H",
        "R",
        "M",
        "D",
        "G",
        "O",
        "U",
        "L",
        "F",
        "B",
        "AI",
        "J",
        "OA",
        "IE",
        "EE",
        "OR",
        "Z",
        "W",
        "NG",
        "V",
        "OO",
        "Y",
        "X",
        "CH",
        "SH",
        "TH",
        "QU",
        "OU",
        "OI",
        "UE",
        "AR",
        "ER"
      ],
      "beats": [
        {
          "id": "c24s5-teach",
          "kind": "teach",
          "instructionKo": "Captain Pin이 합체해요! 먼저 bench를 만들어요.",
          "repeatAudio": [
            "buh",
            "eh",
            "nnn",
            "ch",
            "bench"
          ]
        },
        {
          "id": "c24s5-r1-warmup",
          "kind": "drag-build",
          "scored": false,
          "instructionKo": "글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)",
          "letters": [
            {
              "text": "B",
              "say": "buh"
            },
            {
              "text": "E",
              "say": "eh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "CH",
              "say": "ch"
            }
          ],
          "target": [
            "B",
            "E",
            "N",
            "CH"
          ]
        },
        {
          "id": "c24s5-r2",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "천천히 따라 말해보세요.",
          "words": [
            {
              "text": "B",
              "say": "buh"
            },
            {
              "text": "E",
              "say": "eh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "CH",
              "say": "ch"
            },
            "bench"
          ]
        },
        {
          "id": "c24s5-break",
          "kind": "break",
          "instructionKo": "이번엔 strap이에요! 함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "sss",
            "tuh",
            "rrr",
            "aaa",
            "puh",
            "strap"
          ]
        },
        {
          "id": "c24s5-r3-quickfire",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "duh",
              "options": [
                {
                  "id": "c24s5-r3-quickfire-s0-o1",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s0-o0",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s0-oc",
                  "icon": "letterTile",
                  "label": "D",
                  "say": "duh",
                  "correct": true
                },
                {
                  "id": "c24s5-r3-quickfire-s0-o2",
                  "icon": "letterTile",
                  "label": "K",
                  "say": "kuh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "ch",
              "options": [
                {
                  "id": "c24s5-r3-quickfire-s1-o0",
                  "icon": "letterTile",
                  "label": "SH",
                  "say": "shhu",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s1-o2",
                  "icon": "letterTile",
                  "label": "J",
                  "say": "juh",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s1-o1",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s1-oc",
                  "icon": "letterTile",
                  "label": "CH",
                  "say": "ch",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "or",
              "options": [
                {
                  "id": "c24s5-r3-quickfire-s2-oc",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": true
                },
                {
                  "id": "c24s5-r3-quickfire-s2-o1",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s2-o0",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s2-o2",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "ngh",
              "options": [
                {
                  "id": "c24s5-r3-quickfire-s3-o0",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s3-oc",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": true
                },
                {
                  "id": "c24s5-r3-quickfire-s3-o1",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s3-o2",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "oi",
              "options": [
                {
                  "id": "c24s5-r3-quickfire-s4-o0",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s4-o1",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                },
                {
                  "id": "c24s5-r3-quickfire-s4-oc",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": true
                },
                {
                  "id": "c24s5-r3-quickfire-s4-o2",
                  "icon": "letterTile",
                  "label": "AI",
                  "say": "a",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c24s5-r4",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "E",
              "say": "eh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "CH",
              "say": "ch"
            },
            {
              "text": "B",
              "say": "buh"
            }
          ],
          "target": [
            "B",
            "E",
            "N",
            "CH"
          ],
          "readAloud": {
            "targetText": "bench"
          }
        },
        {
          "id": "c24s5-r5-wordspot",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c24s5-r5-wordspot-o0",
              "icon": "letterTile",
              "label": "CEBNH",
              "correct": false
            },
            {
              "id": "c24s5-r5-wordspot-o1",
              "icon": "letterTile",
              "label": "ECBNH",
              "correct": false
            },
            {
              "id": "c24s5-r5-wordspot-oc",
              "icon": "letterTile",
              "label": "BENCH",
              "correct": true
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "bench"
          }
        },
        {
          "id": "c24s5-r6",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 strap을 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "P",
              "say": "puh"
            },
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "T",
              "say": "tuh"
            }
          ],
          "target": [
            "S",
            "T",
            "R",
            "A",
            "P"
          ],
          "readAloud": {
            "targetText": "strap"
          }
        },
        {
          "id": "c24s5-r7-bonus",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "strap도 천천히 따라 말해보세요.",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "P",
              "say": "puh"
            },
            "strap"
          ]
        },
        {
          "id": "c24s5-finale",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! BENCH! STRAP!",
          "words": [
            "bench",
            "strap"
          ]
        }
      ],
      "recapKo": "BENCH와 STRAP, 단어 두 개를 만들었어요! 챕터 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "bench",
          "strap"
        ]
      }
    }
  ]
}
