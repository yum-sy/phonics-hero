// Chapter 18 -- consonant blend chapter (world 3, no new phonemes:
// Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이 챕터가
// 가르치는 것은 이미 배운 낱글자 소리 두 개를 이어 말하는 것뿐이다 --
// SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: 포켓몬 계열(art/creatures.js, 동결), 2회차 재사용
// 블렌드: ND(hand, 어말) / NT(ant, 어말)
// 보스 단어: SAND(S+A+N+D) / ANT(A+N+T)
// 아이콘: hand/ant 둘 다 icons.js 재고에 있다(신규 아이콘 불필요). 어말 블렌드라 도입 문구를 '단어 끝에서 나요'로 조정했다.
//
// ============================================================================
// 구조 (chapter-09 템플릿 그대로 적용: 5스테이지, 소리 2개를 스테이지1-2 /
// 3-4에 나눠 배정, 스테이지5 보스가 둘을 합체)
// ============================================================================
// - 비보스 teach/break beat는 검증기 규칙상 "한 소리만" 반복할 수 있다
//   (MAX_DRILL_SOUND_TOKENS=1) -- 그래서 블렌드 자체(두 소리)는 teach/break로
//   시연하지 않는다. 대신 listen-repeat의 words[] 배열(낱글자 { text, say }
//   나열 뒤 합친 단어)로 "S 소리 -> T 소리 -> star" 순서로 들려준다. 이 형태는
//   chapterBoss 전용이 아니다 -- 검증기의 블렌드 계약은 보스 스테이지에서만
//   강제되지만, 배열 자체는 어느 스테이지에서나 쓸 수 있는 정식 포맷이다.
// - "이 소리로 시작하는 그림을 찾아보세요" 류의 choose 문항은 블렌드의 낱글자
//   두 개를 각각 복습시킨다(예: ST라면 S 문항 하나, T 문항 하나) -- 블렌드
//   자체는 SOUND_TABLE의 letterform이 아니라 promptAudio로 지목할 별도
//   phoneme이 없기 때문이다.
// - 블렌드 단어 자체가 icons.js에 있으면 그림 인식 문항을 하나 더 넣었다(위
//   아이콘 메모 참조). 없으면 챕터 9의 Z/W 처방대로 그 자리를 누적 복습으로
//   채웠다.
// - reviewTargets는 챕터 14가 가르친 42개 글자소(Jolly 전체) 그대로다 --
//   이 챕터가 새 letterform을 teach하지 않으므로(beat.letter를 쓰지 않음)
//   taughtSoFar가 늘어나지 않는다. 검증기가 정확한 값을 강제한다.
// - 보스 조립 단어는 전부 이미 배운 낱글자/다이그래프로만 구성된다. STAR와
//   GLUE는 각각 AR·UE 다이그래프(이미 학습됨)를 슬롯 하나로 재사용해 발음이
//   실제 단어와 어긋나지 않게 했다(star를 S-T-A-R 넷으로 쪼개면 AR 소리를
//   A+R로 잘못 가르치게 된다).
//
// ============================================================================
// 블렌드 재배정 -- 리더의 초안 표(15:st,sk/16:tr,dr/17:bl,fl/18:sp,sm/19:cr,gr/
// 20:sl,pl/21:br,fr)를 그대로 쓰지 않았다. icons.js 84종(신규 사진 아이콘
// 포함)을 전수 확인한 결과 그 표의 블렌드 대부분(sk/dr/bl/fl/sp/sm/cr/gr/sl/
// pl/br 대부분)이 그림 재고 0개였다 -- fr(fries)만 예외였다. 반면 star/
// snake/train/fries/cloud/glue/hand/ant/ink/gift 는 이미 icons.js에 있는데
// 어느 블렌드에도 배정돼 있지 않았다. 그래서 "아이콘 재고와 난이도를 보고
// 합리적으로 재배치해도 된다"(발주 원문)에 따라 이 10개 블렌드가 그림 인식
// 문항을 가질 수 있도록 순서를 다시 짰다 -- 이 파일이 배정받은 블렌드는 아래
// 헤더에 적는다. 그림 재고가 여전히 0인 블렌드(챕터 20의 SP/SK, 21의 PL/DR)는
// 챕터 9의 Z/W가 쓴 것과 같은 처방(그림 문항 자리를 누적 복습으로 채운다)을
// 그대로 썼다.
// ============================================================================
export const chapter18 = {
  "id": "chapter-18",
  "order": 18,
  "title": "Creature Cove: Blend Evolution",
  "stages": [
    {
      "id": "c18-stage-1",
      "order": 1,
      "title": "N and D Together",
      "villain": {
        "name": "Flippen",
        "art": "flippen-c18",
        "style": "creature-flippy"
      },
      "hero": {
        "name": "Rocketail",
        "art": "rocketail-c18",
        "style": "creature-rocket"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c18s1-teach-443",
          "kind": "teach",
          "instructionKo": "Rocketail가 N과 D 소리를 나란히 들려줘요! 이번엔 단어 끝에서 나요.",
          "art": "hero",
          "repeatAudio": [
            "nnn"
          ]
        },
        {
          "id": "c18s1-r1-444",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 다른 소리예요. 잘 듣고 따라 말해보세요!",
          "words": [
            {
              "text": "D",
              "say": "duh"
            }
          ]
        },
        {
          "id": "c18s1-break-445",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "duh"
          ]
        },
        {
          "id": "c18s1-blend-446",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "N랑 D 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
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
          "id": "c18s1-r2-447",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"net\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c18s1-o3-451",
              "icon": "net",
              "label": "net",
              "correct": true
            },
            {
              "id": "c18s1-o0-448",
              "icon": "hat",
              "label": "hat",
              "correct": false
            },
            {
              "id": "c18s1-o1-449",
              "icon": "ring",
              "label": "ring",
              "correct": false
            },
            {
              "id": "c18s1-o2-450",
              "icon": "moon",
              "label": "moon",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "net"
          }
        },
        {
          "id": "c18s1-r3-452",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"door\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "duh",
          "options": [
            {
              "id": "c18s1-o0-453",
              "icon": "door",
              "label": "door",
              "correct": true
            },
            {
              "id": "c18s1-o1-454",
              "icon": "gum",
              "label": "gum",
              "correct": false
            },
            {
              "id": "c18s1-o2-455",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            },
            {
              "id": "c18s1-o3-456",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "door"
          }
        },
        {
          "id": "c18s1-r4-457",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "hand처럼 N랑 D 소리가 이어지는 그림을 찾아보세요!",
          "promptAudio": "hand",
          "options": [
            {
              "id": "c18s1-p0-458",
              "icon": "lion",
              "label": "lion",
              "correct": false
            },
            {
              "id": "c18s1-p1-459",
              "icon": "fish",
              "label": "fish",
              "correct": false
            },
            {
              "id": "c18s1-p2-460",
              "icon": "boat",
              "label": "boat",
              "correct": false
            },
            {
              "id": "c18s1-p3-461",
              "icon": "hand",
              "label": "hand",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "hand"
          }
        },
        {
          "id": "c18s1-r5-462",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "net",
            "door"
          ]
        },
        {
          "id": "c18s1-finale-463",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "hand"
          ]
        }
      ],
      "recapKo": "N과 D 소리를 이어봤어요! hand처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "nnn",
          "duh",
          "hand"
        ]
      }
    },
    {
      "id": "c18-stage-2",
      "order": 2,
      "title": "Power of ND",
      "villain": {
        "name": "Slipster",
        "art": "slipster-c18",
        "style": "creature-slippy"
      },
      "hero": {
        "name": "Rocketail",
        "art": "rocketail-c18",
        "style": "creature-rocket"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c18s2-r1-warmup-464",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c18s2-w0-465",
              "icon": "letterTile",
              "label": "AI",
              "say": "a",
              "correct": false
            },
            {
              "id": "c18s2-w1-466",
              "icon": "letterTile",
              "label": "N",
              "say": "nnn",
              "correct": true
            },
            {
              "id": "c18s2-w2-467",
              "icon": "letterTile",
              "label": "J",
              "say": "juh",
              "correct": false
            }
          ]
        },
        {
          "id": "c18s2-r2-468",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"boat\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "oh",
          "options": [
            {
              "id": "c18s2-a0-469",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c18s2-a1-470",
              "icon": "boat",
              "label": "boat",
              "correct": true
            },
            {
              "id": "c18s2-a2-471",
              "icon": "feet",
              "label": "feet",
              "correct": false
            },
            {
              "id": "c18s2-a3-472",
              "icon": "corn",
              "label": "corn",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "boat"
          }
        },
        {
          "id": "c18s2-r3-trace-473",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 D를 따라 그리면서 소리를 내보세요!",
          "words": [
            {
              "text": "D",
              "say": "duh"
            }
          ]
        },
        {
          "id": "c18s2-break-474",
          "kind": "break",
          "instructionKo": "N랑 D를 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "duh"
          ]
        },
        {
          "id": "c18s2-r4-multiselect-475",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/c/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c18s2-m0-476",
              "icon": "cat",
              "label": "cat",
              "correct": true
            },
            {
              "id": "c18s2-m1-477",
              "icon": "cup",
              "label": "cup",
              "correct": true
            },
            {
              "id": "c18s2-m2-478",
              "icon": "cake",
              "label": "cake",
              "correct": true
            },
            {
              "id": "c18s2-m3-479",
              "icon": "zebra",
              "label": "zebra",
              "correct": false
            },
            {
              "id": "c18s2-m4-479b",
              "icon": "moon",
              "label": "moon",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "cat"
          }
        },
        {
          "id": "c18s2-r5-hard-485",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)",
          "promptAudio": "duh",
          "options": [
            {
              "id": "c18s2-h0-481",
              "icon": "letterTile",
              "label": "NG",
              "say": "ngh",
              "correct": false
            },
            {
              "id": "c18s2-h1-482",
              "icon": "letterTile",
              "label": "V",
              "say": "vve",
              "correct": false
            },
            {
              "id": "c18s2-h-correct-480",
              "icon": "letterTile",
              "label": "D",
              "say": "duh",
              "correct": true
            },
            {
              "id": "c18s2-h2-483",
              "icon": "letterTile",
              "label": "Y",
              "say": "yyuh",
              "correct": false
            },
            {
              "id": "c18s2-h3-484",
              "icon": "letterTile",
              "label": "X",
              "say": "ksuh",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "D",
            "say": "duh"
          }
        },
        {
          "id": "c18s2-r6-reversed-486",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "CH",
          "options": [
            {
              "id": "c18s2-v0-487",
              "icon": "shoe",
              "label": "shoe",
              "correct": false
            },
            {
              "id": "c18s2-v1-488",
              "icon": "thumb",
              "label": "thumb",
              "correct": false
            },
            {
              "id": "c18s2-v2-489",
              "icon": "queen",
              "label": "queen",
              "correct": false
            },
            {
              "id": "c18s2-v3-490",
              "icon": "chips",
              "label": "chips",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "chips"
          }
        },
        {
          "id": "c18s2-r7-listenrepeat-491",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "hand",
            "boat"
          ]
        },
        {
          "id": "c18s2-finale-492",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "D",
              "say": "duh"
            },
            "hand"
          ]
        }
      ],
      "recapKo": "N+D = HAND! 소리를 잘 익혔어요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "duh",
          "hand"
        ]
      }
    },
    {
      "id": "c18-stage-3",
      "order": 3,
      "title": "N and T Together",
      "villain": {
        "name": "Grabnip",
        "art": "grabnip-c18",
        "style": "creature-grabby"
      },
      "hero": {
        "name": "Magnetip",
        "art": "magnetip-c18",
        "style": "creature-magno"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c18s3-teach-493",
          "kind": "teach",
          "instructionKo": "Magnetip가 N과 T 소리를 나란히 들려줘요! 이번에도 단어 끝에서 나요.",
          "art": "hero",
          "repeatAudio": [
            "nnn"
          ]
        },
        {
          "id": "c18s3-r1-494",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 다른 소리예요. 잘 듣고 따라 말해보세요!",
          "words": [
            {
              "text": "T",
              "say": "tuh"
            }
          ]
        },
        {
          "id": "c18s3-break-495",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c18s3-blend-496",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "N랑 T 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
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
          "id": "c18s3-r2-497",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"nut\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c18s3-o0-498",
              "icon": "coin",
              "label": "coin",
              "correct": false
            },
            {
              "id": "c18s3-o2-499b",
              "icon": "map",
              "label": "map",
              "correct": false
            },
            {
              "id": "c18s3-o1-499",
              "icon": "nut",
              "label": "nut",
              "correct": true
            },
            {
              "id": "c18s3-o3-499c",
              "icon": "jam",
              "label": "jam",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "nut"
          }
        },
        {
          "id": "c18s3-r3-500",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"top\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c18s3-o2-502b",
              "icon": "duck",
              "label": "duck",
              "correct": false
            },
            {
              "id": "c18s3-o3-502c",
              "icon": "key",
              "label": "key",
              "correct": false
            },
            {
              "id": "c18s3-o0-501",
              "icon": "top",
              "label": "top",
              "correct": true
            },
            {
              "id": "c18s3-o1-502",
              "icon": "sock",
              "label": "sock",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "top"
          }
        },
        {
          "id": "c18s3-r4-503",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "ant처럼 N랑 T 소리가 이어지는 그림을 찾아보세요!",
          "promptAudio": "ant",
          "options": [
            {
              "id": "c18s3-p0-504",
              "icon": "apple",
              "label": "apple",
              "correct": false
            },
            {
              "id": "c18s3-p1-505",
              "icon": "ant",
              "label": "ant",
              "correct": true
            },
            {
              "id": "c18s3-p2-506",
              "icon": "tap",
              "label": "tap",
              "correct": false
            },
            {
              "id": "c18s3-p3-507",
              "icon": "insect",
              "label": "insect",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "ant"
          }
        },
        {
          "id": "c18s3-r5-508",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "nut",
            "top"
          ]
        },
        {
          "id": "c18s3-finale-509",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "ant"
          ]
        }
      ],
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
      "recapKo": "N과 T 소리를 이어봤어요! ant처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "nnn",
          "tuh",
          "ant"
        ]
      }
    },
    {
      "id": "c18-stage-4",
      "order": 4,
      "title": "Power of NT",
      "villain": {
        "name": "Corkle",
        "art": "corkle-c18",
        "style": "creature-corky"
      },
      "hero": {
        "name": "Drillbit",
        "art": "drillbit-c18",
        "style": "creature-drillo"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c18s4-r1-warmup-510",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c18s4-w0-511",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": false
            },
            {
              "id": "c18s4-w1-512",
              "icon": "letterTile",
              "label": "N",
              "say": "nnn",
              "correct": true
            },
            {
              "id": "c18s4-w2-513",
              "icon": "letterTile",
              "label": "C",
              "say": "kuh",
              "correct": false
            }
          ]
        },
        {
          "id": "c18s4-r2-514",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"elephant\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "eh",
          "options": [
            {
              "id": "c18s4-a0-515",
              "icon": "horse",
              "label": "horse",
              "correct": false
            },
            {
              "id": "c18s4-a1-516",
              "icon": "rubber",
              "label": "rubber",
              "correct": false
            },
            {
              "id": "c18s4-a2-517",
              "icon": "man",
              "label": "man",
              "correct": false
            },
            {
              "id": "c18s4-a3-518",
              "icon": "elephant",
              "label": "elephant",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "elephant"
          }
        },
        {
          "id": "c18s4-r3-trace-519",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 T를 따라 그리면서 소리를 내보세요!",
          "words": [
            {
              "text": "T",
              "say": "tuh"
            }
          ]
        },
        {
          "id": "c18s4-break-520",
          "kind": "break",
          "instructionKo": "N랑 T를 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c18s4-r4-multiselect-521",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/r/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c18s4-m0-522",
              "icon": "rat",
              "label": "rat",
              "correct": true
            },
            {
              "id": "c18s4-m1-523",
              "icon": "ring",
              "label": "ring",
              "correct": true
            },
            {
              "id": "c18s4-m2-524",
              "icon": "rubber",
              "label": "rubber",
              "correct": true
            },
            {
              "id": "c18s4-m3-525",
              "icon": "duck",
              "label": "duck",
              "correct": false
            },
            {
              "id": "c18s4-m4-526",
              "icon": "gum",
              "label": "gum",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "rat"
          }
        },
        {
          "id": "c18s4-r5-hard-532",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c18s4-h0-528",
              "icon": "letterTile",
              "label": "O",
              "say": "awh",
              "correct": false
            },
            {
              "id": "c18s4-h1-529",
              "icon": "letterTile",
              "label": "U",
              "say": "uh",
              "correct": false
            },
            {
              "id": "c18s4-h2-530",
              "icon": "letterTile",
              "label": "L",
              "say": "lll",
              "correct": false
            },
            {
              "id": "c18s4-h3-531",
              "icon": "letterTile",
              "label": "F",
              "say": "fff",
              "correct": false
            },
            {
              "id": "c18s4-h-correct-527",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "T",
            "say": "tuh"
          }
        },
        {
          "id": "c18s4-r6-reversed-533",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "B",
          "options": [
            {
              "id": "c18s4-v0-534",
              "icon": "rain",
              "label": "rain",
              "correct": false
            },
            {
              "id": "c18s4-v1-535",
              "icon": "bee",
              "label": "bee",
              "correct": true
            },
            {
              "id": "c18s4-v2-536",
              "icon": "jug",
              "label": "jug",
              "correct": false
            },
            {
              "id": "c18s4-v3-537",
              "icon": "coat",
              "label": "coat",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "bee"
          }
        },
        {
          "id": "c18s4-r7-listenrepeat-538",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "ant",
            "elephant"
          ]
        },
        {
          "id": "c18s4-r8-cycle-559",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c18s4-q0-0-539",
                  "icon": "letterTile",
                  "label": "IE",
                  "say": "eye",
                  "correct": false
                },
                {
                  "id": "c18s4-q0-1-540",
                  "icon": "letterTile",
                  "label": "EE",
                  "say": "ee",
                  "correct": false
                },
                {
                  "id": "c18s4-q0-2-541",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                },
                {
                  "id": "c18s4-q0-3-542",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "tuh",
              "options": [
                {
                  "id": "c18s4-q1-0-543",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": false
                },
                {
                  "id": "c18s4-q1-1-544",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c18s4-q1-2-545",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": false
                },
                {
                  "id": "c18s4-q1-3-546",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c18s4-q2-0-547",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                },
                {
                  "id": "c18s4-q2-1-548",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": false
                },
                {
                  "id": "c18s4-q2-2-549",
                  "icon": "letterTile",
                  "label": "Y",
                  "say": "yyuh",
                  "correct": false
                },
                {
                  "id": "c18s4-q2-3-550",
                  "icon": "letterTile",
                  "label": "X",
                  "say": "ksuh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "kuh",
              "options": [
                {
                  "id": "c18s4-q3-0-551",
                  "icon": "letterTile",
                  "label": "CH",
                  "say": "ch",
                  "correct": false
                },
                {
                  "id": "c18s4-q3-1-552",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": true
                },
                {
                  "id": "c18s4-q3-2-553",
                  "icon": "letterTile",
                  "label": "SH",
                  "say": "shhu",
                  "correct": false
                },
                {
                  "id": "c18s4-q3-3-554",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "mmm",
              "options": [
                {
                  "id": "c18s4-q4-0-555",
                  "icon": "letterTile",
                  "label": "QU",
                  "say": "kw",
                  "correct": false
                },
                {
                  "id": "c18s4-q4-1-556",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                },
                {
                  "id": "c18s4-q4-2-557",
                  "icon": "letterTile",
                  "label": "M",
                  "say": "mmm",
                  "correct": true
                },
                {
                  "id": "c18s4-q4-3-558",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c18s4-finale-560",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "T",
              "say": "tuh"
            },
            "ant"
          ]
        }
      ],
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
      "recapKo": "N+T = ANT! 이제 두 블렌드를 모두 알아요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "tuh",
          "ant"
        ]
      }
    },
    {
      "id": "c18-stage-5",
      "order": 5,
      "title": "Boss: SAND and ANT!",
      "villain": {
        "name": "Munchor",
        "art": "munchor-c18",
        "style": "creature-glitch"
      },
      "hero": {
        "name": "Redcap",
        "art": "redcap-c18",
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
          "id": "c18s5-teach-561",
          "kind": "teach",
          "instructionKo": "Redcap가 합체해요! 먼저 sand를 만들어요.",
          "repeatAudio": [
            "sss",
            "aaa",
            "nnn",
            "duh",
            "sand"
          ]
        },
        {
          "id": "c18s5-r1-warmup-562",
          "kind": "drag-build",
          "scored": false,
          "instructionKo": "글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)",
          "letters": [
            {
              "text": "S",
              "say": "sss"
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
            }
          ],
          "target": [
            "S",
            "A",
            "N",
            "D"
          ]
        },
        {
          "id": "c18s5-r2-563",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "천천히 따라 말해보세요.",
          "words": [
            {
              "text": "S",
              "say": "sss"
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
            "sand"
          ]
        },
        {
          "id": "c18s5-break-564",
          "kind": "break",
          "instructionKo": "이번엔 ant이에요! 함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "aaa",
            "nnn",
            "tuh",
            "ant"
          ]
        },
        {
          "id": "c18s5-r3-quickfire-581",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c18s5-bq0-0-565",
                  "icon": "letterTile",
                  "label": "UE",
                  "say": "u",
                  "correct": false
                },
                {
                  "id": "c18s5-bq0-1-566",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": false
                },
                {
                  "id": "c18s5-bq0-2-567",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                },
                {
                  "id": "c18s5-bq0-3-568",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "aaa",
              "options": [
                {
                  "id": "c18s5-bq1-0-569",
                  "icon": "letterTile",
                  "label": "A",
                  "say": "aaa",
                  "correct": true
                },
                {
                  "id": "c18s5-bq1-1-570",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c18s5-bq1-2-571",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c18s5-bq1-3-572",
                  "icon": "letterTile",
                  "label": "I",
                  "say": "ihh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c18s5-bq2-0-573",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c18s5-bq2-1-574",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                },
                {
                  "id": "c18s5-bq2-2-575",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c18s5-bq2-3-576",
                  "icon": "letterTile",
                  "label": "E",
                  "say": "eh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "duh",
              "options": [
                {
                  "id": "c18s5-bq3-0-577",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": false
                },
                {
                  "id": "c18s5-bq3-1-578",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c18s5-bq3-2-579",
                  "icon": "letterTile",
                  "label": "D",
                  "say": "duh",
                  "correct": true
                },
                {
                  "id": "c18s5-bq3-3-580",
                  "icon": "letterTile",
                  "label": "M",
                  "say": "mmm",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c18s5-r4-582",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
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
              "text": "D",
              "say": "duh"
            },
            {
              "text": "S",
              "say": "sss"
            }
          ],
          "target": [
            "S",
            "A",
            "N",
            "D"
          ],
          "readAloud": {
            "targetText": "sand"
          }
        },
        {
          "id": "c18s5-r5-wordspot-583",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c18s5-ws0-584",
              "icon": "letterTile",
              "label": "DNAS",
              "correct": false
            },
            {
              "id": "c18s5-ws1-585",
              "icon": "letterTile",
              "label": "SAND",
              "correct": true
            },
            {
              "id": "c18s5-ws2-586",
              "icon": "letterTile",
              "label": "DSAN",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "sand"
          }
        },
        {
          "id": "c18s5-r6-587",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 ant을 만들어요! 순서대로 옮겨보세요.",
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
          "id": "c18s5-r7-bonus-588",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "ant도 천천히 따라 말해보세요.",
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
          "id": "c18s5-finale-589",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! SAND! ANT!",
          "words": [
            "sand",
            "ant"
          ]
        }
      ],
      "recapKo": "SAND와 ANT를 만들었어요! 챕터 18 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "sand",
          "ant"
        ]
      }
    }
  ]
}
