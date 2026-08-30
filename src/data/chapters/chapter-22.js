// Chapter 22 (Ember Hollow Return) -- consonant blend chapter (world 4, no new
// phonemes: Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이
// 챕터가 가르치는 것은 이미 배운 낱글자 소리 두세 개를 이어 말하는 것뿐이다
// -- SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: 포켓몬(creatures.js), 히어로는 Sparkit/Magnix/Drillbit/Captain Ember 재사용(-c28)
// 블렌드: TW (twin/twig) / CT (act/duct, icon insect) / GL (glue/glad, icon glue)
// 보스 단어: TWIN(T+W+I+N) + GLUE(G+L+UE)
// 아이콘: insect (CT 인식용), glue (GL 인식용, 보스 단어이기도 함)
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
export const chapter22 = {
  "id": "chapter-22",
  "order": 22,
  "title": "Ember Hollow Return",
  "stages": [
    {
      "id": "c22-stage-1",
      "order": 1,
      "title": "A Twin Sound",
      "villain": {
        "name": "Twistfang",
        "art": "twistfang",
        "style": "creature-flippy"
      },
      "hero": {
        "name": "Sparkit",
        "art": "sparkit-c28",
        "style": "creature-rocket"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c22s1-teach",
          "kind": "teach",
          "instructionKo": "Sparkit가 \"twin\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c22s1-r1",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 하나씩 듣고, 이어서 단어를 말해보세요!",
          "words": [
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "W",
              "say": "weh"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            "twin"
          ]
        },
        {
          "id": "c22s1-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "weh"
          ]
        },
        {
          "id": "c22s1-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"leg\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "lll",
          "options": [
            {
              "id": "c22s1-r2-oc",
              "icon": "leg",
              "label": "leg",
              "correct": true
            },
            {
              "id": "c22s1-r2-o0",
              "icon": "fan",
              "label": "fan",
              "correct": false
            },
            {
              "id": "c22s1-r2-o1",
              "icon": "ball",
              "label": "ball",
              "correct": false
            },
            {
              "id": "c22s1-r2-o2",
              "icon": "jam",
              "label": "jam",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "leg"
          }
        },
        {
          "id": "c22s1-r3",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"tree\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c22s1-r3-o0",
              "icon": "fork",
              "label": "fork",
              "correct": false
            },
            {
              "id": "c22s1-r3-oc",
              "icon": "tree",
              "label": "tree",
              "correct": true
            },
            {
              "id": "c22s1-r3-o1",
              "icon": "zebra",
              "label": "zebra",
              "correct": false
            },
            {
              "id": "c22s1-r3-o2",
              "icon": "watch",
              "label": "watch",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "tree"
          }
        },
        {
          "id": "c22s1-r4",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"dog\"와 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c22s1-r4-c2",
              "icon": "duck",
              "label": "duck",
              "correct": true
            },
            {
              "id": "c22s1-r4-w0",
              "icon": "sun",
              "label": "sun",
              "correct": false
            },
            {
              "id": "c22s1-r4-w1",
              "icon": "sock",
              "label": "sock",
              "correct": false
            },
            {
              "id": "c22s1-r4-c0",
              "icon": "dog",
              "label": "dog",
              "correct": true
            },
            {
              "id": "c22s1-r4-c1",
              "icon": "door",
              "label": "door",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "dog"
          }
        },
        {
          "id": "c22s1-r5",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "twin",
            "twig"
          ]
        },
        {
          "id": "c22s1-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "twin"
          ]
        }
      ],
      "recapKo": "새로운 소리 조합을 찾았어요! twin, twig — 둘 다 이 소리가 들어있어요!",
      "recapAudio": {
        "ko": "새로운 소리 조합을 배웠어요. 잘 들어보세요.",
        "en": [
          "twin",
          "twig"
        ]
      }
    },
    {
      "id": "c22-stage-2",
      "order": 2,
      "title": "Power of TW",
      "villain": {
        "name": "Rattlecoil",
        "art": "rattlecoil",
        "style": "creature-slippy"
      },
      "hero": {
        "name": "Sparkit",
        "art": "sparkit-c28",
        "style": "creature-rocket"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c22s2-teach",
          "kind": "teach",
          "instructionKo": "Sparkit가 \"twin\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c22s2-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "진짜 단어를 찾아보세요! (연습이에요)",
          "options": [
            {
              "id": "c22s2-r1-warmup-oc",
              "icon": "letterTile",
              "label": "TWIN",
              "correct": true
            },
            {
              "id": "c22s2-r1-warmup-o0",
              "icon": "letterTile",
              "label": "WTIN",
              "correct": false
            },
            {
              "id": "c22s2-r1-warmup-o1",
              "icon": "letterTile",
              "label": "ITWN",
              "correct": false
            }
          ]
        },
        {
          "id": "c22s2-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"book\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "buh",
          "options": [
            {
              "id": "c22s2-r2-o0",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": false
            },
            {
              "id": "c22s2-r2-o1",
              "icon": "sock",
              "label": "sock",
              "correct": false
            },
            {
              "id": "c22s2-r2-oc",
              "icon": "book",
              "label": "book",
              "correct": true
            },
            {
              "id": "c22s2-r2-o2",
              "icon": "chips",
              "label": "chips",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "book"
          }
        },
        {
          "id": "c22s2-r3-blenddemo",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 하나씩 듣고, 이어서 단어를 말해보세요!",
          "words": [
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "W",
              "say": "weh"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            "twin"
          ]
        },
        {
          "id": "c22s2-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "weh"
          ]
        },
        {
          "id": "c22s2-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"fork\"와 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c22s2-r4-multiselect-w1",
              "icon": "ant",
              "label": "ant",
              "correct": false
            },
            {
              "id": "c22s2-r4-multiselect-w2",
              "icon": "tap",
              "label": "tap",
              "correct": false
            },
            {
              "id": "c22s2-r4-multiselect-c0",
              "icon": "fork",
              "label": "fork",
              "correct": true
            },
            {
              "id": "c22s2-r4-multiselect-c1",
              "icon": "fish",
              "label": "fish",
              "correct": true
            },
            {
              "id": "c22s2-r4-multiselect-w0",
              "icon": "apple",
              "label": "apple",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "fork"
          }
        },
        {
          "id": "c22s2-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c22s2-r5-hard-o0",
              "icon": "letterTile",
              "label": "TNWI",
              "correct": false
            },
            {
              "id": "c22s2-r5-hard-o1",
              "icon": "letterTile",
              "label": "NTWI",
              "correct": false
            },
            {
              "id": "c22s2-r5-hard-o2",
              "icon": "letterTile",
              "label": "WTNI",
              "correct": false
            },
            {
              "id": "c22s2-r5-hard-o3",
              "icon": "letterTile",
              "label": "TWNI",
              "correct": false
            },
            {
              "id": "c22s2-r5-hard-oc",
              "icon": "letterTile",
              "label": "TWIN",
              "correct": true
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "twin"
          }
        },
        {
          "id": "c22s2-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"coin\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c22s2-r6-reversed-o0",
              "icon": "rain",
              "label": "rain",
              "correct": false
            },
            {
              "id": "c22s2-r6-reversed-o1",
              "icon": "boat",
              "label": "boat",
              "correct": false
            },
            {
              "id": "c22s2-r6-reversed-o2",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c22s2-r6-reversed-oc",
              "icon": "coin",
              "label": "coin",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "coin"
          }
        },
        {
          "id": "c22s2-r7-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "twin",
            "twig"
          ]
        },
        {
          "id": "c22s2-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "twin"
          ]
        }
      ],
      "recapKo": "twin에는 두 소리가 이어져 있어요 — twin, twig!",
      "recapAudio": {
        "ko": "두 소리가 이어진 단어를 배웠어요. 잘 들어보세요.",
        "en": [
          "twin",
          "twig"
        ]
      }
    },
    {
      "id": "c22-stage-3",
      "order": 3,
      "title": "Power of CT",
      "villain": {
        "name": "Antlurk",
        "art": "antlurk",
        "style": "creature-grabby"
      },
      "hero": {
        "name": "Magnix",
        "art": "magnix-c28",
        "style": "creature-magno"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c22s3-teach",
          "kind": "teach",
          "instructionKo": "Magnix가 \"act\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "kuh"
          ]
        },
        {
          "id": "c22s3-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "진짜 단어를 찾아보세요! (연습이에요)",
          "options": [
            {
              "id": "c22s3-r1-warmup-o0",
              "icon": "letterTile",
              "label": "TAC",
              "correct": false
            },
            {
              "id": "c22s3-r1-warmup-oc",
              "icon": "letterTile",
              "label": "ACT",
              "correct": true
            },
            {
              "id": "c22s3-r1-warmup-o1",
              "icon": "letterTile",
              "label": "ATC",
              "correct": false
            }
          ]
        },
        {
          "id": "c22s3-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"apple\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "aaa",
          "options": [
            {
              "id": "c22s3-r2-oc",
              "icon": "apple",
              "label": "apple",
              "correct": true
            },
            {
              "id": "c22s3-r2-o0",
              "icon": "tap",
              "label": "tap",
              "correct": false
            },
            {
              "id": "c22s3-r2-o1",
              "icon": "ink",
              "label": "ink",
              "correct": false
            },
            {
              "id": "c22s3-r2-o2",
              "icon": "pen",
              "label": "pen",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "apple"
          }
        },
        {
          "id": "c22s3-r3-blenddemo",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 하나씩 듣고, 이어서 단어를 말해보세요!",
          "words": [
            {
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "C",
              "say": "kuh"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            "act"
          ]
        },
        {
          "id": "c22s3-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c22s3-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"hat\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c22s3-r4-multiselect-c0",
              "icon": "hat",
              "label": "hat",
              "correct": true
            },
            {
              "id": "c22s3-r4-multiselect-c1",
              "icon": "hen",
              "label": "hen",
              "correct": true
            },
            {
              "id": "c22s3-r4-multiselect-w0",
              "icon": "cat",
              "label": "cat",
              "correct": false
            },
            {
              "id": "c22s3-r4-multiselect-w1",
              "icon": "cup",
              "label": "cup",
              "correct": false
            },
            {
              "id": "c22s3-r4-multiselect-w2",
              "icon": "king",
              "label": "king",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "hat"
          }
        },
        {
          "id": "c22s3-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c22s3-r5-hard-o0",
              "icon": "letterTile",
              "label": "TCA",
              "correct": false
            },
            {
              "id": "c22s3-r5-hard-oc",
              "icon": "letterTile",
              "label": "ACT",
              "correct": true
            },
            {
              "id": "c22s3-r5-hard-o1",
              "icon": "letterTile",
              "label": "TAC",
              "correct": false
            },
            {
              "id": "c22s3-r5-hard-o2",
              "icon": "letterTile",
              "label": "ATC",
              "correct": false
            },
            {
              "id": "c22s3-r5-hard-o3",
              "icon": "letterTile",
              "label": "CTA",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "act"
          }
        },
        {
          "id": "c22s3-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리들이 들어있는 그림을 찾아보세요!",
          "promptLetter": "CT",
          "options": [
            {
              "id": "c22s3-r6-o0",
              "icon": "lion",
              "label": "lion",
              "correct": false
            },
            {
              "id": "c22s3-r6-oc",
              "icon": "insect",
              "label": "insect",
              "correct": true
            },
            {
              "id": "c22s3-r6-o1",
              "icon": "cup",
              "label": "cup",
              "correct": false
            },
            {
              "id": "c22s3-r6-o2",
              "icon": "hen",
              "label": "hen",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "insect"
          }
        },
        {
          "id": "c22s3-r7-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "act",
            "duct"
          ]
        },
        {
          "id": "c22s3-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "act"
          ]
        }
      ],
      "recapKo": "act에는 두 소리가 이어져 있어요 — act, duct!",
      "recapAudio": {
        "ko": "두 소리가 이어진 단어를 배웠어요. 잘 들어보세요.",
        "en": [
          "act",
          "duct"
        ]
      }
    },
    {
      "id": "c22-stage-4",
      "order": 4,
      "title": "Power of GL",
      "villain": {
        "name": "Gluckmire",
        "art": "gluckmire",
        "style": "creature-corky"
      },
      "hero": {
        "name": "Drillbit",
        "art": "drillbit-c28",
        "style": "creature-drillo"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c22s4-teach",
          "kind": "teach",
          "instructionKo": "Drillbit가 \"glue\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "guh"
          ]
        },
        {
          "id": "c22s4-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "진짜 단어를 찾아보세요! (연습이에요)",
          "options": [
            {
              "id": "c22s4-r1-warmup-o0",
              "icon": "letterTile",
              "label": "ELUG",
              "correct": false
            },
            {
              "id": "c22s4-r1-warmup-o1",
              "icon": "letterTile",
              "label": "ULEG",
              "correct": false
            },
            {
              "id": "c22s4-r1-warmup-oc",
              "icon": "letterTile",
              "label": "GLUE",
              "correct": true
            }
          ]
        },
        {
          "id": "c22s4-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"mat\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "mmm",
          "options": [
            {
              "id": "c22s4-r2-o0",
              "icon": "dog",
              "label": "dog",
              "correct": false
            },
            {
              "id": "c22s4-r2-o1",
              "icon": "gum",
              "label": "gum",
              "correct": false
            },
            {
              "id": "c22s4-r2-oc",
              "icon": "mat",
              "label": "mat",
              "correct": true
            },
            {
              "id": "c22s4-r2-o2",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "mat"
          }
        },
        {
          "id": "c22s4-r3-blenddemo",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 하나씩 듣고, 이어서 단어를 말해보세요!",
          "words": [
            {
              "text": "G",
              "say": "guh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "UE",
              "say": "u"
            },
            "glue"
          ]
        },
        {
          "id": "c22s4-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c22s4-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"jam\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c22s4-r4-multiselect-w0",
              "icon": "key",
              "label": "key",
              "correct": false
            },
            {
              "id": "c22s4-r4-multiselect-w1",
              "icon": "egg",
              "label": "egg",
              "correct": false
            },
            {
              "id": "c22s4-r4-multiselect-w2",
              "icon": "elephant",
              "label": "elephant",
              "correct": false
            },
            {
              "id": "c22s4-r4-multiselect-c0",
              "icon": "jam",
              "label": "jam",
              "correct": true
            },
            {
              "id": "c22s4-r4-multiselect-c1",
              "icon": "jug",
              "label": "jug",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "jam"
          }
        },
        {
          "id": "c22s4-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c22s4-r5-hard-o0",
              "icon": "letterTile",
              "label": "ULGE",
              "correct": false
            },
            {
              "id": "c22s4-r5-hard-o1",
              "icon": "letterTile",
              "label": "ELGU",
              "correct": false
            },
            {
              "id": "c22s4-r5-hard-o2",
              "icon": "letterTile",
              "label": "LEGU",
              "correct": false
            },
            {
              "id": "c22s4-r5-hard-oc",
              "icon": "letterTile",
              "label": "GLUE",
              "correct": true
            },
            {
              "id": "c22s4-r5-hard-o3",
              "icon": "letterTile",
              "label": "GELU",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "glue"
          }
        },
        {
          "id": "c22s4-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리들이 들어있는 그림을 찾아보세요!",
          "promptLetter": "GL",
          "options": [
            {
              "id": "c22s4-r6-o0",
              "icon": "lion",
              "label": "lion",
              "correct": false
            },
            {
              "id": "c22s4-r6-o1",
              "icon": "cup",
              "label": "cup",
              "correct": false
            },
            {
              "id": "c22s4-r6-o2",
              "icon": "hen",
              "label": "hen",
              "correct": false
            },
            {
              "id": "c22s4-r6-oc",
              "icon": "glue",
              "label": "glue",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "glue"
          }
        },
        {
          "id": "c22s4-r7-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "glue",
            "glad"
          ]
        },
        {
          "id": "c22s4-r8-cycle",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c22s4-r8-cycle-s0-o1",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s0-o0",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s0-oc",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                },
                {
                  "id": "c22s4-r8-cycle-s0-o2",
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
                  "id": "c22s4-r8-cycle-s1-o0",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s1-o2",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s1-o1",
                  "icon": "letterTile",
                  "label": "K",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s1-oc",
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
                  "id": "c22s4-r8-cycle-s2-oc",
                  "icon": "letterTile",
                  "label": "M",
                  "say": "mmm",
                  "correct": true
                },
                {
                  "id": "c22s4-r8-cycle-s2-o1",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s2-o0",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s2-o2",
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
                  "id": "c22s4-r8-cycle-s3-o0",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s3-oc",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                },
                {
                  "id": "c22s4-r8-cycle-s3-o1",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s3-o2",
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
                  "id": "c22s4-r8-cycle-s4-o0",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s4-o1",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c22s4-r8-cycle-s4-oc",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                },
                {
                  "id": "c22s4-r8-cycle-s4-o2",
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
          "id": "c22s4-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "glue"
          ]
        }
      ],
      "recapKo": "glue에는 두 소리가 이어져 있어요 — glue, glad!",
      "recapAudio": {
        "ko": "두 소리가 이어진 단어를 배웠어요. 잘 들어보세요.",
        "en": [
          "glue",
          "glad"
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
      "id": "c22-stage-5",
      "order": 5,
      "title": "Boss: TWIN and GLUE!",
      "villain": {
        "name": "Static Muncher",
        "art": "static-muncher",
        "style": "creature-glitch"
      },
      "hero": {
        "name": "Captain Ember",
        "art": "captain-ember-c28",
        "style": "creature-boss"
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
          "id": "c22s5-teach",
          "kind": "teach",
          "instructionKo": "Captain Ember가 합체해요! 먼저 twin을 만들어요.",
          "repeatAudio": [
            "tuh",
            "weh",
            "ihh",
            "nnn",
            "twin"
          ]
        },
        {
          "id": "c22s5-r1-warmup",
          "kind": "drag-build",
          "scored": false,
          "instructionKo": "글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)",
          "letters": [
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "W",
              "say": "weh"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "N",
              "say": "nnn"
            }
          ],
          "target": [
            "T",
            "W",
            "I",
            "N"
          ]
        },
        {
          "id": "c22s5-r2",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "천천히 따라 말해보세요.",
          "words": [
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "W",
              "say": "weh"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            "twin"
          ]
        },
        {
          "id": "c22s5-break",
          "kind": "break",
          "instructionKo": "이번엔 glue가에요! 함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "guh",
            "lll",
            "u",
            "glue"
          ]
        },
        {
          "id": "c22s5-r3-quickfire",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "duh",
              "options": [
                {
                  "id": "c22s5-r3-quickfire-s0-o1",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s0-o0",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s0-oc",
                  "icon": "letterTile",
                  "label": "D",
                  "say": "duh",
                  "correct": true
                },
                {
                  "id": "c22s5-r3-quickfire-s0-o2",
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
                  "id": "c22s5-r3-quickfire-s1-o0",
                  "icon": "letterTile",
                  "label": "SH",
                  "say": "shhu",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s1-o2",
                  "icon": "letterTile",
                  "label": "J",
                  "say": "juh",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s1-o1",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s1-oc",
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
                  "id": "c22s5-r3-quickfire-s2-oc",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": true
                },
                {
                  "id": "c22s5-r3-quickfire-s2-o1",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s2-o0",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s2-o2",
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
                  "id": "c22s5-r3-quickfire-s3-o0",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s3-oc",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": true
                },
                {
                  "id": "c22s5-r3-quickfire-s3-o1",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s3-o2",
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
                  "id": "c22s5-r3-quickfire-s4-o0",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s4-o1",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                },
                {
                  "id": "c22s5-r3-quickfire-s4-oc",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": true
                },
                {
                  "id": "c22s5-r3-quickfire-s4-o2",
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
          "id": "c22s5-r4",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "W",
              "say": "weh"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "T",
              "say": "tuh"
            }
          ],
          "target": [
            "T",
            "W",
            "I",
            "N"
          ],
          "readAloud": {
            "targetText": "twin"
          }
        },
        {
          "id": "c22s5-r5-wordspot",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c22s5-r5-wordspot-oc",
              "icon": "letterTile",
              "label": "TWIN",
              "correct": true
            },
            {
              "id": "c22s5-r5-wordspot-o0",
              "icon": "letterTile",
              "label": "NWTI",
              "correct": false
            },
            {
              "id": "c22s5-r5-wordspot-o1",
              "icon": "letterTile",
              "label": "WNTI",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "twin"
          }
        },
        {
          "id": "c22s5-r6",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 glue를 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "UE",
              "say": "u"
            },
            {
              "text": "G",
              "say": "guh"
            },
            {
              "text": "L",
              "say": "lll"
            }
          ],
          "target": [
            "G",
            "L",
            "UE"
          ],
          "readAloud": {
            "targetText": "glue"
          }
        },
        {
          "id": "c22s5-r7-bonus",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "glue도 천천히 따라 말해보세요.",
          "words": [
            {
              "text": "G",
              "say": "guh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "UE",
              "say": "u"
            },
            "glue"
          ]
        },
        {
          "id": "c22s5-finale",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! TWIN! GLUE!",
          "words": [
            "twin",
            "glue"
          ]
        }
      ],
      "recapKo": "TWIN과 GLUE, 단어 두 개를 만들었어요! 챕터 22 클리어! 월드 4 완성!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "twin",
          "glue"
        ]
      }
    }
  ]
}
