// Chapter 26 (Dino Valley Uprising) -- consonant blend chapter (world 4, no new
// phonemes: Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이
// 챕터가 가르치는 것은 이미 배운 낱글자 소리 두세 개를 이어 말하는 것뿐이다
// -- SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: 공룡(dinosaurs.js), 히어로는 Fizz/Talon/Wingo/Roara 재사용(-c26)
// 블렌드: LT (belt/melt) / LF (self/golf) -- 스테이지3은 원래 LP
// (help/gulp)를 가르쳤으나 보스가 실제로 쓰는 블렌드와 무관한 고아
// 콘텐츠였다(리더 QA 감사로 발견, 2026-08). 보스가 실제로 조립하는 두 번째
// 블렌드(LF)의 소개 스테이지로 교체했다(챕터15 패턴과 일치).
// 보스 단어: BELT(B+E+L+T) + SELF(S+E+L+F)
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
export const chapter26 = {
  "id": "chapter-26",
  "order": 26,
  "title": "Dino Valley Uprising",
  "stages": [
    {
      "id": "c26-stage-1",
      "order": 1,
      "title": "A Belt Sound",
      "villain": {
        "name": "Grimtusk",
        "art": "grimtusk",
        "style": "dino-blink"
      },
      "hero": {
        "name": "Fizz",
        "art": "fizz-c26",
        "style": "dino-raptor"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c26s1-teach",
          "kind": "teach",
          "instructionKo": "Fizz가 \"belt\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c26s1-r1",
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
              "text": "L",
              "say": "lll"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            "belt"
          ]
        },
        {
          "id": "c26s1-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c26s1-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"chips\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "ch",
          "options": [
            {
              "id": "c26s1-r2-oc",
              "icon": "chips",
              "label": "chips",
              "correct": true
            },
            {
              "id": "c26s1-r2-o0",
              "icon": "shoe",
              "label": "shoe",
              "correct": false
            },
            {
              "id": "c26s1-r2-o1",
              "icon": "thumb",
              "label": "thumb",
              "correct": false
            },
            {
              "id": "c26s1-r2-o2",
              "icon": "queen",
              "label": "queen",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "chips"
          }
        },
        {
          "id": "c26s1-r3",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"coin\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "oi",
          "options": [
            {
              "id": "c26s1-r3-o0",
              "icon": "rain",
              "label": "rain",
              "correct": false
            },
            {
              "id": "c26s1-r3-oc",
              "icon": "coin",
              "label": "coin",
              "correct": true
            },
            {
              "id": "c26s1-r3-o1",
              "icon": "boat",
              "label": "boat",
              "correct": false
            },
            {
              "id": "c26s1-r3-o2",
              "icon": "tie",
              "label": "tie",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "coin"
          }
        },
        {
          "id": "c26s1-r4",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"pen\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c26s1-r4-w0",
              "icon": "boat",
              "label": "boat",
              "correct": false
            },
            {
              "id": "c26s1-r4-w1",
              "icon": "bus",
              "label": "bus",
              "correct": false
            },
            {
              "id": "c26s1-r4-c0",
              "icon": "pen",
              "label": "pen",
              "correct": true
            },
            {
              "id": "c26s1-r4-c1",
              "icon": "pig",
              "label": "pig",
              "correct": true
            },
            {
              "id": "c26s1-r4-c2",
              "icon": "pie",
              "label": "pie",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "pen"
          }
        },
        {
          "id": "c26s1-r5",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "belt",
            "melt"
          ]
        },
        {
          "id": "c26s1-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "belt"
          ]
        }
      ],
      "recapKo": "새로운 소리 조합을 찾았어요! belt, melt — 둘 다 이 소리가 들어있어요!",
      "recapAudio": {
        "ko": "새로운 소리 조합을 배웠어요. 잘 들어보세요.",
        "en": [
          "belt",
          "melt"
        ]
      }
    },
    {
      "id": "c26-stage-2",
      "order": 2,
      "title": "Power of LT",
      "villain": {
        "name": "Duskfang",
        "art": "duskfang",
        "style": "dino-echo"
      },
      "hero": {
        "name": "Fizz",
        "art": "fizz-c26",
        "style": "dino-raptor"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c26s2-teach",
          "kind": "teach",
          "instructionKo": "Fizz가 \"belt\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c26s2-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "진짜 단어를 찾아보세요! (연습이에요)",
          "options": [
            {
              "id": "c26s2-r1-warmup-o0",
              "icon": "letterTile",
              "label": "LETB",
              "correct": false
            },
            {
              "id": "c26s2-r1-warmup-oc",
              "icon": "letterTile",
              "label": "BELT",
              "correct": true
            },
            {
              "id": "c26s2-r1-warmup-o1",
              "icon": "letterTile",
              "label": "ELTB",
              "correct": false
            }
          ]
        },
        {
          "id": "c26s2-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"igloo\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "ihh",
          "options": [
            {
              "id": "c26s2-r2-o0",
              "icon": "pen",
              "label": "pen",
              "correct": false
            },
            {
              "id": "c26s2-r2-o1",
              "icon": "cake",
              "label": "cake",
              "correct": false
            },
            {
              "id": "c26s2-r2-oc",
              "icon": "igloo",
              "label": "igloo",
              "correct": true
            },
            {
              "id": "c26s2-r2-o2",
              "icon": "egg",
              "label": "egg",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "igloo"
          }
        },
        {
          "id": "c26s2-r3-blenddemo",
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
              "text": "L",
              "say": "lll"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            "belt"
          ]
        },
        {
          "id": "c26s2-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c26s2-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"umbrella\"와 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c26s2-r4-multiselect-w2",
              "icon": "boat",
              "label": "boat",
              "correct": false
            },
            {
              "id": "c26s2-r4-multiselect-c0",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": true
            },
            {
              "id": "c26s2-r4-multiselect-c1",
              "icon": "nut",
              "label": "nut",
              "correct": true
            },
            {
              "id": "c26s2-r4-multiselect-w0",
              "icon": "bed",
              "label": "bed",
              "correct": false
            },
            {
              "id": "c26s2-r4-multiselect-w1",
              "icon": "box",
              "label": "box",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "umbrella"
          }
        },
        {
          "id": "c26s2-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c26s2-r5-hard-oc",
              "icon": "letterTile",
              "label": "BELT",
              "correct": true
            },
            {
              "id": "c26s2-r5-hard-o0",
              "icon": "letterTile",
              "label": "TEBL",
              "correct": false
            },
            {
              "id": "c26s2-r5-hard-o1",
              "icon": "letterTile",
              "label": "ETBL",
              "correct": false
            },
            {
              "id": "c26s2-r5-hard-o2",
              "icon": "letterTile",
              "label": "BTEL",
              "correct": false
            },
            {
              "id": "c26s2-r5-hard-o3",
              "icon": "letterTile",
              "label": "TBEL",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "belt"
          }
        },
        {
          "id": "c26s2-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"duck\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "duh",
          "options": [
            {
              "id": "c26s2-r6-reversed-o0",
              "icon": "gum",
              "label": "gum",
              "correct": false
            },
            {
              "id": "c26s2-r6-reversed-o1",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            },
            {
              "id": "c26s2-r6-reversed-o2",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            },
            {
              "id": "c26s2-r6-reversed-oc",
              "icon": "duck",
              "label": "duck",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "duck"
          }
        },
        {
          "id": "c26s2-r7-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "belt",
            "melt"
          ]
        },
        {
          "id": "c26s2-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "belt"
          ]
        }
      ],
      "recapKo": "belt에는 두 소리가 이어져 있어요 — belt, melt!",
      "recapAudio": {
        "ko": "두 소리가 이어진 단어를 배웠어요. 잘 들어보세요.",
        "en": [
          "belt",
          "melt"
        ]
      }
    },
    {
      "id": "c26-stage-3",
      "order": 3,
      "title": "A Self Sound",
      "villain": {
        "name": "Marrowjaw",
        "art": "marrowjaw",
        "style": "dino-upside"
      },
      "hero": {
        "name": "Talon",
        "art": "talon-c26",
        "style": "dino-armored"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c26s3-teach",
          "kind": "teach",
          "instructionKo": "Talon이 \"self\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c26s3-r1",
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
              "text": "E",
              "say": "eh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "F",
              "say": "fff"
            },
            "self"
          ]
        },
        {
          "id": "c26s3-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "fff"
          ]
        },
        {
          "id": "c26s3-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"rain\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c26s3-r2-oc",
              "icon": "rain",
              "label": "rain",
              "correct": true
            },
            {
              "id": "c26s3-r2-o0",
              "icon": "van",
              "label": "van",
              "correct": false
            },
            {
              "id": "c26s3-r2-o1",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": false
            },
            {
              "id": "c26s3-r2-o2",
              "icon": "moon",
              "label": "moon",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "rain"
          }
        },
        {
          "id": "c26s3-r3",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"nut\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c26s3-r3-oc",
              "icon": "nut",
              "label": "nut",
              "correct": true
            },
            {
              "id": "c26s3-r3-o0",
              "icon": "shoe",
              "label": "shoe",
              "correct": false
            },
            {
              "id": "c26s3-r3-o1",
              "icon": "thumb",
              "label": "thumb",
              "correct": false
            },
            {
              "id": "c26s3-r3-o2",
              "icon": "queen",
              "label": "queen",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "nut"
          }
        },
        {
          "id": "c26s3-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"ball\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c26s3-r4-multiselect-c0",
              "icon": "ball",
              "label": "ball",
              "correct": true
            },
            {
              "id": "c26s3-r4-multiselect-c1",
              "icon": "box",
              "label": "box",
              "correct": true
            },
            {
              "id": "c26s3-r4-multiselect-c2",
              "icon": "bed",
              "label": "bed",
              "correct": true
            },
            {
              "id": "c26s3-r4-multiselect-w0",
              "icon": "nose",
              "label": "nose",
              "correct": false
            },
            {
              "id": "c26s3-r4-multiselect-w1",
              "icon": "cup",
              "label": "cup",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "ball"
          }
        },
        {
          "id": "c26s3-r5",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "self",
            "golf"
          ]
        },
        {
          "id": "c26s3-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "self"
          ]
        }
      ],
      "recapKo": "새로운 소리 조합을 찾았어요! self, golf — 둘 다 이 소리가 들어있어요!",
      "recapAudio": {
        "ko": "새로운 소리 조합을 배웠어요. 잘 들어보세요.",
        "en": [
          "self",
          "golf"
        ]
      }
    },
    {
      "id": "c26-stage-4",
      "order": 4,
      "title": "Power of LF",
      "villain": {
        "name": "Ashclaw",
        "art": "ashclaw",
        "style": "dino-swamp"
      },
      "hero": {
        "name": "Wingo",
        "art": "wingo-c26",
        "style": "dino-flyer"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c26s4-teach",
          "kind": "teach",
          "instructionKo": "Wingo가 \"self\"에 숨어있는 소리들을 들려줘요! 소리를 빠르게 이어서 말해보세요.",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c26s4-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "진짜 단어를 찾아보세요! (연습이에요)",
          "options": [
            {
              "id": "c26s4-r1-warmup-oc",
              "icon": "letterTile",
              "label": "SELF",
              "correct": true
            },
            {
              "id": "c26s4-r1-warmup-o0",
              "icon": "letterTile",
              "label": "ELFS",
              "correct": false
            },
            {
              "id": "c26s4-r1-warmup-o1",
              "icon": "letterTile",
              "label": "ESLF",
              "correct": false
            }
          ]
        },
        {
          "id": "c26s4-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"box\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "ksuh",
          "options": [
            {
              "id": "c26s4-r2-o0",
              "icon": "chips",
              "label": "chips",
              "correct": false
            },
            {
              "id": "c26s4-r2-o1",
              "icon": "shoe",
              "label": "shoe",
              "correct": false
            },
            {
              "id": "c26s4-r2-oc",
              "icon": "box",
              "label": "box",
              "correct": true
            },
            {
              "id": "c26s4-r2-o2",
              "icon": "thumb",
              "label": "thumb",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "box"
          }
        },
        {
          "id": "c26s4-r3-blenddemo",
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
              "text": "E",
              "say": "eh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "F",
              "say": "fff"
            },
            "self"
          ]
        },
        {
          "id": "c26s4-break",
          "kind": "break",
          "instructionKo": "함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "fff"
          ]
        },
        {
          "id": "c26s4-r4-multiselect",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"fan\"과 같은 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c26s4-r4-multiselect-w1",
              "icon": "top",
              "label": "top",
              "correct": false
            },
            {
              "id": "c26s4-r4-multiselect-w2",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c26s4-r4-multiselect-c0",
              "icon": "fan",
              "label": "fan",
              "correct": true
            },
            {
              "id": "c26s4-r4-multiselect-c1",
              "icon": "fish",
              "label": "fish",
              "correct": true
            },
            {
              "id": "c26s4-r4-multiselect-w0",
              "icon": "ten",
              "label": "ten",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "fan"
          }
        },
        {
          "id": "c26s4-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c26s4-r5-hard-o0",
              "icon": "letterTile",
              "label": "EFSL",
              "correct": false
            },
            {
              "id": "c26s4-r5-hard-o1",
              "icon": "letterTile",
              "label": "SFEL",
              "correct": false
            },
            {
              "id": "c26s4-r5-hard-o2",
              "icon": "letterTile",
              "label": "FSEL",
              "correct": false
            },
            {
              "id": "c26s4-r5-hard-o3",
              "icon": "letterTile",
              "label": "ESFL",
              "correct": false
            },
            {
              "id": "c26s4-r5-hard-oc",
              "icon": "letterTile",
              "label": "SELF",
              "correct": true
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "self"
          }
        },
        {
          "id": "c26s4-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"coat\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "oh",
          "options": [
            {
              "id": "c26s4-r6-reversed-o0",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c26s4-r6-reversed-o1",
              "icon": "sun",
              "label": "sun",
              "correct": false
            },
            {
              "id": "c26s4-r6-reversed-o2",
              "icon": "apple",
              "label": "apple",
              "correct": false
            },
            {
              "id": "c26s4-r6-reversed-oc",
              "icon": "coat",
              "label": "coat",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "coat"
          }
        },
        {
          "id": "c26s4-r7-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "self",
            "golf"
          ]
        },
        {
          "id": "c26s4-r8-cycle",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c26s4-r8-cycle-s0-oc",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                },
                {
                  "id": "c26s4-r8-cycle-s0-o0",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s0-o1",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s0-o2",
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
                  "id": "c26s4-r8-cycle-s1-o0",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s1-oc",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                },
                {
                  "id": "c26s4-r8-cycle-s1-o1",
                  "icon": "letterTile",
                  "label": "K",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s1-o2",
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
                  "id": "c26s4-r8-cycle-s2-o0",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s2-o1",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s2-oc",
                  "icon": "letterTile",
                  "label": "M",
                  "say": "mmm",
                  "correct": true
                },
                {
                  "id": "c26s4-r8-cycle-s2-o2",
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
                  "id": "c26s4-r8-cycle-s3-o2",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s3-o0",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s3-o1",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s3-oc",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "fff",
              "options": [
                {
                  "id": "c26s4-r8-cycle-s4-oc",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                },
                {
                  "id": "c26s4-r8-cycle-s4-o0",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s4-o1",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c26s4-r8-cycle-s4-o2",
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
          "id": "c26s4-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "self"
          ]
        }
      ],
      "recapKo": "self에는 두 소리가 이어져 있어요 — self, golf!",
      "recapAudio": {
        "ko": "두 소리가 이어진 단어를 배웠어요. 잘 들어보세요.",
        "en": [
          "self",
          "golf"
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
      "id": "c26-stage-5",
      "order": 5,
      "title": "Boss: BELT and SELF!",
      "villain": {
        "name": "Boneshade",
        "art": "boneshade",
        "style": "dino-shadow-rex"
      },
      "hero": {
        "name": "Roara",
        "art": "roara-c26",
        "style": "dino-horned"
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
          "id": "c26s5-teach",
          "kind": "teach",
          "instructionKo": "Roara가 합체해요! 먼저 belt를 만들어요.",
          "repeatAudio": [
            "buh",
            "eh",
            "lll",
            "tuh",
            "belt"
          ]
        },
        {
          "id": "c26s5-r1-warmup",
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
              "text": "L",
              "say": "lll"
            },
            {
              "text": "T",
              "say": "tuh"
            }
          ],
          "target": [
            "B",
            "E",
            "L",
            "T"
          ]
        },
        {
          "id": "c26s5-r2",
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
              "text": "L",
              "say": "lll"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            "belt"
          ]
        },
        {
          "id": "c26s5-break",
          "kind": "break",
          "instructionKo": "이번엔 self이에요! 함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "sss",
            "eh",
            "lll",
            "fff",
            "self"
          ]
        },
        {
          "id": "c26s5-r3-quickfire",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "duh",
              "options": [
                {
                  "id": "c26s5-r3-quickfire-s0-oc",
                  "icon": "letterTile",
                  "label": "D",
                  "say": "duh",
                  "correct": true
                },
                {
                  "id": "c26s5-r3-quickfire-s0-o0",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s0-o1",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s0-o2",
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
                  "id": "c26s5-r3-quickfire-s1-o0",
                  "icon": "letterTile",
                  "label": "SH",
                  "say": "shhu",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s1-oc",
                  "icon": "letterTile",
                  "label": "CH",
                  "say": "ch",
                  "correct": true
                },
                {
                  "id": "c26s5-r3-quickfire-s1-o1",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s1-o2",
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
                  "id": "c26s5-r3-quickfire-s2-o0",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s2-o1",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s2-oc",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": true
                },
                {
                  "id": "c26s5-r3-quickfire-s2-o2",
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
                  "id": "c26s5-r3-quickfire-s3-o2",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s3-o0",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s3-o1",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s3-oc",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "oi",
              "options": [
                {
                  "id": "c26s5-r3-quickfire-s4-oc",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": true
                },
                {
                  "id": "c26s5-r3-quickfire-s4-o0",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s4-o1",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                },
                {
                  "id": "c26s5-r3-quickfire-s4-o2",
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
          "id": "c26s5-r4",
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
              "text": "L",
              "say": "lll"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "B",
              "say": "buh"
            }
          ],
          "target": [
            "B",
            "E",
            "L",
            "T"
          ],
          "readAloud": {
            "targetText": "belt"
          }
        },
        {
          "id": "c26s5-r5-wordspot",
          "kind": "choose",
          "scored": true,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c26s5-r5-wordspot-o0",
              "icon": "letterTile",
              "label": "BLTE",
              "correct": false
            },
            {
              "id": "c26s5-r5-wordspot-oc",
              "icon": "letterTile",
              "label": "BELT",
              "correct": true
            },
            {
              "id": "c26s5-r5-wordspot-o1",
              "icon": "letterTile",
              "label": "LBTE",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "belt"
          }
        },
        {
          "id": "c26s5-r6",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 self을 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "F",
              "say": "fff"
            },
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "E",
              "say": "eh"
            }
          ],
          "target": [
            "S",
            "E",
            "L",
            "F"
          ],
          "readAloud": {
            "targetText": "self"
          }
        },
        {
          "id": "c26s5-r7-bonus",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "self도 천천히 따라 말해보세요.",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "E",
              "say": "eh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "F",
              "say": "fff"
            },
            "self"
          ]
        },
        {
          "id": "c26s5-finale",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! BELT! SELF!",
          "words": [
            "belt",
            "self"
          ]
        }
      ],
      "recapKo": "BELT와 SELF, 단어 두 개를 만들었어요! 챕터 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "belt",
          "self"
        ]
      }
    }
  ]
}
