// Chapter 23 (Beacon City Reborn) -- consonant blend chapter (world 4, no new
// phonemes: Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이
// 챕터가 가르치는 것은 이미 배운 낱글자 소리 두세 개를 이어 말하는 것뿐이다
// -- SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: DC 히어로(dc.js), style dc-hero
// 블렌드: NT (ant/tent, icon ant) / ND (hand/sand, icon hand) / FT (gift/raft, icon gift)
// 보스 단어: ANT(A+N+T) + GIFT(G+I+F+T)
// 아이콘: ant, hand, gift (모두 기존 재고)
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
export const chapter23 = {
  "id": "chapter-23",
  "order": 23,
  "title": "Beacon City Reborn",
  "stages": [
    {
      "id": "c23-stage-1",
      "order": 1,
      "title": "An Ant Sound",
      "villain": {
        "name": "Ashveil",
        "art": "ashveil",
        "style": "dc-hero"
      },
      "hero": {
        "name": "Halo",
        "art": "halo-c23",
        "style": "dc-hero"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c23s1-teach",
          "kind": "teach",
          "instructionKo": "Halo가 \"ant\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "ant"
          ]
        },
        {
          "id": "c23s1-r1",
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
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            "ant"
          ]
        },
        {
          "id": "c23s1-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tent"
          ]
        },
        {
          "id": "c23s1-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"horse\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "huh",
          "options": [
            {
              "id": "c23s1-r2-oc",
              "icon": "horse",
              "label": "horse",
              "correct": true
            },
            {
              "id": "c23s1-r2-o0",
              "icon": "rain",
              "label": "rain",
              "correct": false
            },
            {
              "id": "c23s1-r2-o1",
              "icon": "man",
              "label": "man",
              "correct": false
            },
            {
              "id": "c23s1-r2-o2",
              "icon": "dog",
              "label": "dog",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "horse"
          }
        },
        {
          "id": "c23s1-r3",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"gum\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "guh",
          "options": [
            {
              "id": "c23s1-r3-o0",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            },
            {
              "id": "c23s1-r3-oc",
              "icon": "gum",
              "label": "gum",
              "correct": true
            },
            {
              "id": "c23s1-r3-o1",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            },
            {
              "id": "c23s1-r3-o2",
              "icon": "lion",
              "label": "lion",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "gum"
          }
        },
        {
          "id": "c23s1-r4",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"hat\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c23s1-r4-w0",
              "icon": "jam",
              "label": "jam",
              "correct": false
            },
            {
              "id": "c23s1-r4-w1",
              "icon": "jug",
              "label": "jug",
              "correct": false
            },
            {
              "id": "c23s1-r4-w2",
              "icon": "bee",
              "label": "bee",
              "correct": false
            },
            {
              "id": "c23s1-r4-c0",
              "icon": "hat",
              "label": "hat",
              "correct": true
            },
            {
              "id": "c23s1-r4-c1",
              "icon": "hen",
              "label": "hen",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "hat"
          }
        },
        {
          "id": "c23s1-r5",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "ant",
            "tent"
          ]
        },
        {
          "id": "c23s1-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "ant"
          ]
        }
      ],
      "recapKo": "새로운 소리 조합을 찾았어요! ant, tent — 둘 다 이 소리가 들어있어요!",
      "recapAudio": {
        "ko": "새로운 소리 조합을 배웠어요. 잘 들어보세요.",
        "en": [
          "ant",
          "tent"
        ]
      }
    },
    {
      "id": "c23-stage-2",
      "order": 2,
      "title": "Power of NT",
      "villain": {
        "name": "Nightcoil",
        "art": "nightcoil",
        "style": "dc-hero"
      },
      "hero": {
        "name": "Halo",
        "art": "halo-c23",
        "style": "dc-hero"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c23s2-teach",
          "kind": "teach",
          "instructionKo": "Halo가 \"ant\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "ant"
          ]
        },
        {
          "id": "c23s2-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "진짜 단어를 찾아보세요! (연습이에요)",
          "options": [
            {
              "id": "c23s2-r1-warmup-o0",
              "icon": "letterTile",
              "label": "ATN",
              "correct": false
            },
            {
              "id": "c23s2-r1-warmup-oc",
              "icon": "letterTile",
              "label": "ANT",
              "correct": true
            },
            {
              "id": "c23s2-r1-warmup-o1",
              "icon": "letterTile",
              "label": "NTA",
              "correct": false
            }
          ]
        },
        {
          "id": "c23s2-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"tree\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "ee",
          "options": [
            {
              "id": "c23s2-r2-o0",
              "icon": "fork",
              "label": "fork",
              "correct": false
            },
            {
              "id": "c23s2-r2-o1",
              "icon": "zebra",
              "label": "zebra",
              "correct": false
            },
            {
              "id": "c23s2-r2-oc",
              "icon": "tree",
              "label": "tree",
              "correct": true
            },
            {
              "id": "c23s2-r2-o2",
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
          "id": "c23s2-r3-blenddemo",
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
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            "ant"
          ]
        },
        {
          "id": "c23s2-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tent"
          ]
        },
        {
          "id": "c23s2-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"ball\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c23s2-r4-multiselect-w0",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": false
            },
            {
              "id": "c23s2-r4-multiselect-w1",
              "icon": "chips",
              "label": "chips",
              "correct": false
            },
            {
              "id": "c23s2-r4-multiselect-c0",
              "icon": "ball",
              "label": "ball",
              "correct": true
            },
            {
              "id": "c23s2-r4-multiselect-c1",
              "icon": "bed",
              "label": "bed",
              "correct": true
            },
            {
              "id": "c23s2-r4-multiselect-c2",
              "icon": "box",
              "label": "box",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "ball"
          }
        },
        {
          "id": "c23s2-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요! (조금 어려워요)",
          "options": [
            {
              "id": "c23s2-r5-hard-o0",
              "icon": "letterTile",
              "label": "NAT",
              "correct": false
            },
            {
              "id": "c23s2-r5-hard-o1",
              "icon": "letterTile",
              "label": "ATN",
              "correct": false
            },
            {
              "id": "c23s2-r5-hard-o2",
              "icon": "letterTile",
              "label": "NTA",
              "correct": false
            },
            {
              "id": "c23s2-r5-hard-o3",
              "icon": "letterTile",
              "label": "TNA",
              "correct": false
            },
            {
              "id": "c23s2-r5-hard-oc",
              "icon": "letterTile",
              "label": "ANT",
              "correct": true
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "ant"
          }
        },
        {
          "id": "c23s2-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리들이 들어있는 그림을 찾아보세요!",
          "promptLetter": "NT",
          "options": [
            {
              "id": "c23s2-r6-o0",
              "icon": "lion",
              "label": "lion",
              "correct": false
            },
            {
              "id": "c23s2-r6-o1",
              "icon": "cup",
              "label": "cup",
              "correct": false
            },
            {
              "id": "c23s2-r6-o2",
              "icon": "hen",
              "label": "hen",
              "correct": false
            },
            {
              "id": "c23s2-r6-oc",
              "icon": "ant",
              "label": "ant",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "ant"
          }
        },
        {
          "id": "c23s2-r7-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "ant",
            "tent"
          ]
        },
        {
          "id": "c23s2-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "ant"
          ]
        }
      ],
      "recapKo": "ant에는 두 소리가 이어져 있어요 — ant, tent!",
      "recapAudio": {
        "ko": "두 소리가 이어진 단어를 배웠어요. 잘 들어보세요.",
        "en": [
          "ant",
          "tent"
        ]
      }
    },
    {
      "id": "c23-stage-3",
      "order": 3,
      "title": "Power of ND",
      "villain": {
        "name": "Grimstatic",
        "art": "grimstatic",
        "style": "dc-hero"
      },
      "hero": {
        "name": "Vex",
        "art": "vex-c23",
        "style": "dc-hero"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c23s3-teach",
          "kind": "teach",
          "instructionKo": "Vex가 \"hand\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "hand"
          ]
        },
        {
          "id": "c23s3-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "진짜 단어를 찾아보세요! (연습이에요)",
          "options": [
            {
              "id": "c23s3-r1-warmup-o0",
              "icon": "letterTile",
              "label": "NDHA",
              "correct": false
            },
            {
              "id": "c23s3-r1-warmup-o1",
              "icon": "letterTile",
              "label": "DNHA",
              "correct": false
            },
            {
              "id": "c23s3-r1-warmup-oc",
              "icon": "letterTile",
              "label": "HAND",
              "correct": true
            }
          ]
        },
        {
          "id": "c23s3-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"yoyo\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "yyuh",
          "options": [
            {
              "id": "c23s3-r2-oc",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": true
            },
            {
              "id": "c23s3-r2-o0",
              "icon": "box",
              "label": "box",
              "correct": false
            },
            {
              "id": "c23s3-r2-o1",
              "icon": "chips",
              "label": "chips",
              "correct": false
            },
            {
              "id": "c23s3-r2-o2",
              "icon": "shoe",
              "label": "shoe",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "yoyo"
          }
        },
        {
          "id": "c23s3-r3-blenddemo",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 하나씩 듣고, 이어서 단어를 말해보세요!",
          "words": [
            {
              "text": "H",
              "say": "huh"
            },
            {
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "D",
              "say": "duh"
            },
            "hand"
          ]
        },
        {
          "id": "c23s3-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "sand"
          ]
        },
        {
          "id": "c23s3-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"sun\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c23s3-r4-multiselect-c0",
              "icon": "sun",
              "label": "sun",
              "correct": true
            },
            {
              "id": "c23s3-r4-multiselect-c1",
              "icon": "sock",
              "label": "sock",
              "correct": true
            },
            {
              "id": "c23s3-r4-multiselect-c2",
              "icon": "star",
              "label": "star",
              "correct": true
            },
            {
              "id": "c23s3-r4-multiselect-w0",
              "icon": "coat",
              "label": "coat",
              "correct": false
            },
            {
              "id": "c23s3-r4-multiselect-w1",
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
          "id": "c23s3-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요! (조금 어려워요)",
          "options": [
            {
              "id": "c23s3-r5-hard-o0",
              "icon": "letterTile",
              "label": "ANDH",
              "correct": false
            },
            {
              "id": "c23s3-r5-hard-oc",
              "icon": "letterTile",
              "label": "HAND",
              "correct": true
            },
            {
              "id": "c23s3-r5-hard-o1",
              "icon": "letterTile",
              "label": "AHND",
              "correct": false
            },
            {
              "id": "c23s3-r5-hard-o2",
              "icon": "letterTile",
              "label": "NHAD",
              "correct": false
            },
            {
              "id": "c23s3-r5-hard-o3",
              "icon": "letterTile",
              "label": "HNAD",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "hand"
          }
        },
        {
          "id": "c23s3-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리들이 들어있는 그림을 찾아보세요!",
          "promptLetter": "ND",
          "options": [
            {
              "id": "c23s3-r6-o0",
              "icon": "lion",
              "label": "lion",
              "correct": false
            },
            {
              "id": "c23s3-r6-oc",
              "icon": "hand",
              "label": "hand",
              "correct": true
            },
            {
              "id": "c23s3-r6-o1",
              "icon": "cup",
              "label": "cup",
              "correct": false
            },
            {
              "id": "c23s3-r6-o2",
              "icon": "hen",
              "label": "hen",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "hand"
          }
        },
        {
          "id": "c23s3-r7-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "hand",
            "sand"
          ]
        },
        {
          "id": "c23s3-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "hand"
          ]
        }
      ],
      "recapKo": "hand에는 두 소리가 이어져 있어요 — hand, sand!",
      "recapAudio": {
        "ko": "두 소리가 이어진 단어를 배웠어요. 잘 들어보세요.",
        "en": [
          "hand",
          "sand"
        ]
      }
    },
    {
      "id": "c23-stage-4",
      "order": 4,
      "title": "Power of FT",
      "villain": {
        "name": "Duskframe",
        "art": "duskframe",
        "style": "dc-hero"
      },
      "hero": {
        "name": "Quill",
        "art": "quill-c23",
        "style": "dc-hero"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c23s4-teach",
          "kind": "teach",
          "instructionKo": "Quill가 \"gift\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "gift"
          ]
        },
        {
          "id": "c23s4-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "진짜 단어를 찾아보세요! (연습이에요)",
          "options": [
            {
              "id": "c23s4-r1-warmup-oc",
              "icon": "letterTile",
              "label": "GIFT",
              "correct": true
            },
            {
              "id": "c23s4-r1-warmup-o0",
              "icon": "letterTile",
              "label": "IGFT",
              "correct": false
            },
            {
              "id": "c23s4-r1-warmup-o1",
              "icon": "letterTile",
              "label": "FGIT",
              "correct": false
            }
          ]
        },
        {
          "id": "c23s4-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"coat\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "oh",
          "options": [
            {
              "id": "c23s4-r2-o0",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c23s4-r2-o1",
              "icon": "sun",
              "label": "sun",
              "correct": false
            },
            {
              "id": "c23s4-r2-oc",
              "icon": "coat",
              "label": "coat",
              "correct": true
            },
            {
              "id": "c23s4-r2-o2",
              "icon": "apple",
              "label": "apple",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "coat"
          }
        },
        {
          "id": "c23s4-r3-blenddemo",
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
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "F",
              "say": "fff"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            "gift"
          ]
        },
        {
          "id": "c23s4-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "raft"
          ]
        },
        {
          "id": "c23s4-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"rain\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c23s4-r4-multiselect-c2",
              "icon": "rubber",
              "label": "rubber",
              "correct": true
            },
            {
              "id": "c23s4-r4-multiselect-w0",
              "icon": "top",
              "label": "top",
              "correct": false
            },
            {
              "id": "c23s4-r4-multiselect-w1",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c23s4-r4-multiselect-c0",
              "icon": "rain",
              "label": "rain",
              "correct": true
            },
            {
              "id": "c23s4-r4-multiselect-c1",
              "icon": "rat",
              "label": "rat",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "rain"
          }
        },
        {
          "id": "c23s4-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요! (조금 어려워요)",
          "options": [
            {
              "id": "c23s4-r5-hard-o0",
              "icon": "letterTile",
              "label": "GTIF",
              "correct": false
            },
            {
              "id": "c23s4-r5-hard-o1",
              "icon": "letterTile",
              "label": "TGIF",
              "correct": false
            },
            {
              "id": "c23s4-r5-hard-o2",
              "icon": "letterTile",
              "label": "IGTF",
              "correct": false
            },
            {
              "id": "c23s4-r5-hard-oc",
              "icon": "letterTile",
              "label": "GIFT",
              "correct": true
            },
            {
              "id": "c23s4-r5-hard-o3",
              "icon": "letterTile",
              "label": "GITF",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "gift"
          }
        },
        {
          "id": "c23s4-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리들이 들어있는 그림을 찾아보세요!",
          "promptLetter": "FT",
          "options": [
            {
              "id": "c23s4-r6-o0",
              "icon": "lion",
              "label": "lion",
              "correct": false
            },
            {
              "id": "c23s4-r6-o1",
              "icon": "cup",
              "label": "cup",
              "correct": false
            },
            {
              "id": "c23s4-r6-o2",
              "icon": "hen",
              "label": "hen",
              "correct": false
            },
            {
              "id": "c23s4-r6-oc",
              "icon": "gift",
              "label": "gift",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "gift"
          }
        },
        {
          "id": "c23s4-r7-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "gift",
            "raft"
          ]
        },
        {
          "id": "c23s4-r8-cycle",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c23s4-r8-cycle-s0-o0",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s0-oc",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                },
                {
                  "id": "c23s4-r8-cycle-s0-o1",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s0-o2",
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
                  "id": "c23s4-r8-cycle-s1-o0",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s1-o1",
                  "icon": "letterTile",
                  "label": "K",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s1-oc",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                },
                {
                  "id": "c23s4-r8-cycle-s1-o2",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "mmm",
              "options": [
                {
                  "id": "c23s4-r8-cycle-s2-o0",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s2-o1",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s2-o2",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s2-oc",
                  "icon": "letterTile",
                  "label": "M",
                  "say": "mmm",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "rrr",
              "options": [
                {
                  "id": "c23s4-r8-cycle-s3-oc",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                },
                {
                  "id": "c23s4-r8-cycle-s3-o0",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s3-o1",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s3-o2",
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
                  "id": "c23s4-r8-cycle-s4-o0",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s4-oc",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                },
                {
                  "id": "c23s4-r8-cycle-s4-o1",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c23s4-r8-cycle-s4-o2",
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
          "id": "c23s4-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "gift"
          ]
        }
      ],
      "recapKo": "gift에는 두 소리가 이어져 있어요 — gift, raft!",
      "recapAudio": {
        "ko": "두 소리가 이어진 단어를 배웠어요. 잘 들어보세요.",
        "en": [
          "gift",
          "raft"
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
      "id": "c23-stage-5",
      "order": 5,
      "title": "Boss: ANT and GIFT!",
      "villain": {
        "name": "Umbral King",
        "art": "umbral-king",
        "style": "dc-hero"
      },
      "hero": {
        "name": "Halo Ultra",
        "art": "halo-ultra-c23",
        "style": "dc-hero"
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
          "id": "c23s5-teach",
          "kind": "teach",
          "instructionKo": "Halo Ultra가 합체해요! 먼저 ant을 만들어요.",
          "repeatAudio": [
            "aaa",
            "nnn",
            "tuh",
            "ant"
          ]
        },
        {
          "id": "c23s5-r1-warmup",
          "kind": "drag-build",
          "scored": false,
          "instructionKo": "글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)",
          "letters": [
            {
              "text": "A",
              "say": "aaa"
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
            "A",
            "N",
            "T"
          ]
        },
        {
          "id": "c23s5-r2",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "천천히 따라 말해보세요.",
          "words": [
            {
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            "ant"
          ]
        },
        {
          "id": "c23s5-break",
          "kind": "break",
          "instructionKo": "이번엔 gift이에요! 함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "guh",
            "ihh",
            "fff",
            "tuh",
            "gift"
          ]
        },
        {
          "id": "c23s5-r3-quickfire",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "duh",
              "options": [
                {
                  "id": "c23s5-r3-quickfire-s0-o0",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s0-oc",
                  "icon": "letterTile",
                  "label": "D",
                  "say": "duh",
                  "correct": true
                },
                {
                  "id": "c23s5-r3-quickfire-s0-o1",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s0-o2",
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
                  "id": "c23s5-r3-quickfire-s1-o0",
                  "icon": "letterTile",
                  "label": "SH",
                  "say": "shhu",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s1-o1",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s1-oc",
                  "icon": "letterTile",
                  "label": "CH",
                  "say": "ch",
                  "correct": true
                },
                {
                  "id": "c23s5-r3-quickfire-s1-o2",
                  "icon": "letterTile",
                  "label": "J",
                  "say": "juh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "or",
              "options": [
                {
                  "id": "c23s5-r3-quickfire-s2-o0",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s2-o1",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s2-o2",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s2-oc",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "ngh",
              "options": [
                {
                  "id": "c23s5-r3-quickfire-s3-oc",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": true
                },
                {
                  "id": "c23s5-r3-quickfire-s3-o0",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s3-o1",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s3-o2",
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
                  "id": "c23s5-r3-quickfire-s4-o0",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s4-oc",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": true
                },
                {
                  "id": "c23s5-r3-quickfire-s4-o1",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                },
                {
                  "id": "c23s5-r3-quickfire-s4-o2",
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
          "id": "c23s5-r4",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "A",
              "say": "aaa"
            }
          ],
          "target": [
            "A",
            "N",
            "T"
          ],
          "readAloud": {
            "targetText": "ant"
          }
        },
        {
          "id": "c23s5-r5-wordspot",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요! (조금 어려워요)",
          "options": [
            {
              "id": "c23s5-r5-wordspot-o0",
              "icon": "letterTile",
              "label": "GTFI",
              "correct": false
            },
            {
              "id": "c23s5-r5-wordspot-oc",
              "icon": "letterTile",
              "label": "GIFT",
              "correct": true
            },
            {
              "id": "c23s5-r5-wordspot-o1",
              "icon": "letterTile",
              "label": "FGTI",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "gift"
          }
        },
        {
          "id": "c23s5-r6",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 gift을 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "F",
              "say": "fff"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "G",
              "say": "guh"
            },
            {
              "text": "I",
              "say": "ihh"
            }
          ],
          "target": [
            "G",
            "I",
            "F",
            "T"
          ],
          "readAloud": {
            "targetText": "gift"
          }
        },
        {
          "id": "c23s5-r7-bonus",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "gift도 천천히 따라 말해보세요.",
          "words": [
            {
              "text": "G",
              "say": "guh"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "F",
              "say": "fff"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            "gift"
          ]
        },
        {
          "id": "c23s5-finale",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! ANT! GIFT!",
          "words": [
            "ant",
            "gift"
          ]
        }
      ],
      "recapKo": "ANT와 GIFT, 단어 두 개를 만들었어요! 챕터 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "ant",
          "gift"
        ]
      }
    }
  ]
}
