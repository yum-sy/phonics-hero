// Chapter 15 -- consonant blend chapter (world 3, no new phonemes:
// Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이 챕터가
// 가르치는 것은 이미 배운 낱글자 소리 두 개를 이어 말하는 것뿐이다 --
// SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: 공룡(dinosaurs.js), 3회차 재사용
// 블렌드: ST(star) / SN(snake)
// 보스 단어: STAR(S+T+AR, AR은 챕터14 다이그래프 재사용) / SNAP(S+N+A+P)
// 아이콘: star/snake 둘 다 icons.js 재고에 그대로 있다(신규 아이콘 불필요).
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
export const chapter15 = {
  "id": "chapter-15",
  "order": 15,
  "title": "Dino Valley: Blend Power",
  "stages": [
    {
      "id": "c15-stage-1",
      "order": 1,
      "title": "S and T Together",
      "villain": {
        "name": "Snaggle",
        "art": "snaggle-c15",
        "style": "dino-blink"
      },
      "hero": {
        "name": "Fernclaw",
        "art": "fernclaw-c15",
        "style": "dino-raptor"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c15s1-teach-1",
          "kind": "teach",
          "instructionKo": "히어로가 S와 T 소리를 나란히 들려줘요! 잘 들어보세요.",
          "art": "hero",
          "repeatAudio": [
            "sss"
          ]
        },
        {
          "id": "c15s1-r1-2",
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
          "id": "c15s1-break-3",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c15s1-blend-4",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "S랑 T 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            "star"
          ]
        },
        {
          "id": "c15s1-r2-5",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"sun\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c15s1-o0-6",
              "icon": "sun",
              "label": "sun",
              "correct": true
            },
            {
              "id": "c15s1-o1-7",
              "icon": "igloo",
              "label": "igloo",
              "correct": false
            },
            {
              "id": "c15s1-o2-8",
              "icon": "pig",
              "label": "pig",
              "correct": false
            },
            {
              "id": "c15s1-o3-9",
              "icon": "net",
              "label": "net",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "sun"
          }
        },
        {
          "id": "c15s1-r3-10",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"top\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c15s1-o0-11",
              "icon": "cat",
              "label": "cat",
              "correct": false
            },
            {
              "id": "c15s1-o1-12",
              "icon": "top",
              "label": "top",
              "correct": true
            },
            {
              "id": "c15s1-o2-13",
              "icon": "egg",
              "label": "egg",
              "correct": false
            },
            {
              "id": "c15s1-o3-14",
              "icon": "hen",
              "label": "hen",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "top"
          }
        },
        {
          "id": "c15s1-r4-15",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "star처럼 S랑 T 소리가 이어지는 그림을 찾아보세요!",
          "promptAudio": "star",
          "options": [
            {
              "id": "c15s1-p0-16",
              "icon": "star",
              "label": "star",
              "correct": true
            },
            {
              "id": "c15s1-p1-17",
              "icon": "rat",
              "label": "rat",
              "correct": false
            },
            {
              "id": "c15s1-p2-18",
              "icon": "man",
              "label": "man",
              "correct": false
            },
            {
              "id": "c15s1-p3-19",
              "icon": "dog",
              "label": "dog",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "star"
          }
        },
        {
          "id": "c15s1-r5-20",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "sun",
            "top"
          ]
        },
        {
          "id": "c15s1-finale-21",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "star"
          ]
        }
      ],
      "recapKo": "S와 T 소리를 이어봤어요! star처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "star"
        ]
      }
    },
    {
      "id": "c15-stage-2",
      "order": 2,
      "title": "Power of ST",
      "villain": {
        "name": "Rustjaw",
        "art": "rustjaw-c15",
        "style": "dino-echo"
      },
      "hero": {
        "name": "Fernclaw",
        "art": "fernclaw-c15",
        "style": "dino-raptor"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c15s2-r1-warmup-22",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c15s2-w0-23",
              "icon": "letterTile",
              "label": "G",
              "say": "guh",
              "correct": false
            },
            {
              "id": "c15s2-w1-24",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": true
            },
            {
              "id": "c15s2-w2-25",
              "icon": "letterTile",
              "label": "O",
              "say": "awh",
              "correct": false
            }
          ]
        },
        {
          "id": "c15s2-r2-26",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"umbrella\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "uh",
          "options": [
            {
              "id": "c15s2-a0-27",
              "icon": "lion",
              "label": "lion",
              "correct": false
            },
            {
              "id": "c15s2-a1-28",
              "icon": "fish",
              "label": "fish",
              "correct": false
            },
            {
              "id": "c15s2-a2-29",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": true
            },
            {
              "id": "c15s2-a3-30",
              "icon": "ball",
              "label": "ball",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "umbrella"
          }
        },
        {
          "id": "c15s2-r3-trace-31",
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
          "id": "c15s2-break-32",
          "kind": "break",
          "instructionKo": "S랑 T를 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c15s2-r4-multiselect-33",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/d/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c15s2-m0-34",
              "icon": "dog",
              "label": "dog",
              "correct": true
            },
            {
              "id": "c15s2-m1-35",
              "icon": "door",
              "label": "door",
              "correct": true
            },
            {
              "id": "c15s2-m2-36",
              "icon": "duck",
              "label": "duck",
              "correct": true
            },
            {
              "id": "c15s2-m3-37",
              "icon": "aim",
              "label": "aim",
              "correct": false
            },
            {
              "id": "c15s2-m4-38",
              "icon": "jam",
              "label": "jam",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "dog"
          }
        },
        {
          "id": "c15s2-r5-hard-44",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c15s2-h0-40",
              "icon": "letterTile",
              "label": "OA",
              "say": "oh",
              "correct": false
            },
            {
              "id": "c15s2-h1-41",
              "icon": "letterTile",
              "label": "IE",
              "say": "eye",
              "correct": false
            },
            {
              "id": "c15s2-h2-42",
              "icon": "letterTile",
              "label": "EE",
              "say": "ee",
              "correct": false
            },
            {
              "id": "c15s2-h3-43",
              "icon": "letterTile",
              "label": "OR",
              "say": "or",
              "correct": false
            },
            {
              "id": "c15s2-h-correct-39",
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
          "id": "c15s2-r6-reversed-45",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "Z",
          "options": [
            {
              "id": "c15s2-v0-46",
              "icon": "king",
              "label": "king",
              "correct": false
            },
            {
              "id": "c15s2-v1-47",
              "icon": "van",
              "label": "van",
              "correct": false
            },
            {
              "id": "c15s2-v2-48",
              "icon": "zebra",
              "label": "zebra",
              "correct": true
            },
            {
              "id": "c15s2-v3-48b",
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
          "id": "c15s2-r7-listenrepeat-49",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "star",
            "umbrella"
          ]
        },
        {
          "id": "c15s2-finale-50",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "T",
              "say": "tuh"
            },
            "star"
          ]
        }
      ],
      "recapKo": "S+T = STAR! 소리를 잘 익혔어요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "star"
        ]
      }
    },
    {
      "id": "c15-stage-3",
      "order": 3,
      "title": "S and N Together",
      "villain": {
        "name": "Mudback",
        "art": "mudback-c15",
        "style": "dino-upside"
      },
      "hero": {
        "name": "Bristleback",
        "art": "bristleback-c15",
        "style": "dino-armored"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c15s3-teach-51",
          "kind": "teach",
          "instructionKo": "히어로가 S와 N 소리를 나란히 들려줘요! 잘 들어보세요.",
          "art": "hero",
          "repeatAudio": [
            "sss"
          ]
        },
        {
          "id": "c15s3-r1-52",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 다른 소리예요. 잘 듣고 따라 말해보세요!",
          "words": [
            {
              "text": "N",
              "say": "nnn"
            }
          ]
        },
        {
          "id": "c15s3-break-53",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "nnn"
          ]
        },
        {
          "id": "c15s3-blend-54",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "S랑 N 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            "snake"
          ]
        },
        {
          "id": "c15s3-r2-55",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"sock\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c15s3-o0-56",
              "icon": "sock",
              "label": "sock",
              "correct": true
            },
            {
              "id": "c15s3-o1-57",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": false
            },
            {
              "id": "c15s3-o2-58",
              "icon": "chips",
              "label": "chips",
              "correct": false
            },
            {
              "id": "c15s3-o3-58b",
              "icon": "hen",
              "label": "hen",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "sock"
          }
        },
        {
          "id": "c15s3-r3-59",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"nut\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c15s3-o0-60",
              "icon": "shoe",
              "label": "shoe",
              "correct": false
            },
            {
              "id": "c15s3-o1-61",
              "icon": "thumb",
              "label": "thumb",
              "correct": false
            },
            {
              "id": "c15s3-o2-62",
              "icon": "queen",
              "label": "queen",
              "correct": false
            },
            {
              "id": "c15s3-o3-63",
              "icon": "nut",
              "label": "nut",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "nut"
          }
        },
        {
          "id": "c15s3-r4-64",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "snake처럼 S랑 N 소리가 이어지는 그림을 찾아보세요!",
          "promptAudio": "snake",
          "options": [
            {
              "id": "c15s3-p0-65",
              "icon": "snake",
              "label": "snake",
              "correct": true
            },
            {
              "id": "c15s3-p1-66",
              "icon": "coin",
              "label": "coin",
              "correct": false
            },
            {
              "id": "c15s3-p2-66b",
              "icon": "moon",
              "label": "moon",
              "correct": false
            },
            {
              "id": "c15s3-p3-66c",
              "icon": "rat",
              "label": "rat",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "snake"
          }
        },
        {
          "id": "c15s3-r5-67",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "sock",
            "nut"
          ]
        },
        {
          "id": "c15s3-finale-68",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "snake"
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
      "recapKo": "S와 N 소리를 이어봤어요! snake처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "snake"
        ]
      }
    },
    {
      "id": "c15-stage-4",
      "order": 4,
      "title": "Power of SN",
      "villain": {
        "name": "Coldfang",
        "art": "coldfang-c15",
        "style": "dino-swamp"
      },
      "hero": {
        "name": "Skyfin",
        "art": "skyfin-c15",
        "style": "dino-flyer"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c15s4-r1-warmup-69",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c15s4-w0-70",
              "icon": "letterTile",
              "label": "AR",
              "say": "arh",
              "correct": false
            },
            {
              "id": "c15s4-w1-71",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": true
            },
            {
              "id": "c15s4-w2-72",
              "icon": "letterTile",
              "label": "ER",
              "say": "erh",
              "correct": false
            }
          ]
        },
        {
          "id": "c15s4-r2-73",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"apple\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "aaa",
          "options": [
            {
              "id": "c15s4-a0-74",
              "icon": "apple",
              "label": "apple",
              "correct": true
            },
            {
              "id": "c15s4-a1-75",
              "icon": "tap",
              "label": "tap",
              "correct": false
            },
            {
              "id": "c15s4-a2-76",
              "icon": "insect",
              "label": "insect",
              "correct": false
            },
            {
              "id": "c15s4-a3-77",
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
          "id": "c15s4-r3-trace-78",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 N을 따라 그리면서 소리를 내보세요!",
          "words": [
            {
              "text": "N",
              "say": "nnn"
            }
          ]
        },
        {
          "id": "c15s4-break-79",
          "kind": "break",
          "instructionKo": "S랑 N을 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "nnn"
          ]
        },
        {
          "id": "c15s4-r4-multiselect-80",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/b/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c15s4-m0-81",
              "icon": "ball",
              "label": "ball",
              "correct": true
            },
            {
              "id": "c15s4-m1-82",
              "icon": "box",
              "label": "box",
              "correct": true
            },
            {
              "id": "c15s4-m2-83",
              "icon": "bed",
              "label": "bed",
              "correct": true
            },
            {
              "id": "c15s4-m3-84",
              "icon": "nose",
              "label": "nose",
              "correct": false
            },
            {
              "id": "c15s4-m4-85",
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
          "id": "c15s4-r5-hard-91",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c15s4-h0-87",
              "icon": "letterTile",
              "label": "E",
              "say": "eh",
              "correct": false
            },
            {
              "id": "c15s4-h-correct-86",
              "icon": "letterTile",
              "label": "N",
              "say": "nnn",
              "correct": true
            },
            {
              "id": "c15s4-h1-88",
              "icon": "letterTile",
              "label": "H",
              "say": "huh",
              "correct": false
            },
            {
              "id": "c15s4-h2-89",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c15s4-h3-90",
              "icon": "letterTile",
              "label": "M",
              "say": "mmm",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "N",
            "say": "nnn"
          }
        },
        {
          "id": "c15s4-r6-reversed-92",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "D",
          "options": [
            {
              "id": "c15s4-v0-93",
              "icon": "gum",
              "label": "gum",
              "correct": false
            },
            {
              "id": "c15s4-v1-94",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            },
            {
              "id": "c15s4-v2-95",
              "icon": "door",
              "label": "door",
              "correct": true
            },
            {
              "id": "c15s4-v3-96",
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
          "id": "c15s4-r7-listenrepeat-97",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "snake",
            "apple"
          ]
        },
        {
          "id": "c15s4-r8-cycle-118",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c15s4-q0-0-98",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": false
                },
                {
                  "id": "c15s4-q0-1-99",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": false
                },
                {
                  "id": "c15s4-q0-2-100",
                  "icon": "letterTile",
                  "label": "B",
                  "say": "buh",
                  "correct": false
                },
                {
                  "id": "c15s4-q0-3-101",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c15s4-q1-0-102",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                },
                {
                  "id": "c15s4-q1-1-103",
                  "icon": "letterTile",
                  "label": "AI",
                  "say": "a",
                  "correct": false
                },
                {
                  "id": "c15s4-q1-2-104",
                  "icon": "letterTile",
                  "label": "J",
                  "say": "juh",
                  "correct": false
                },
                {
                  "id": "c15s4-q1-3-105",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "rrr",
              "options": [
                {
                  "id": "c15s4-q2-0-106",
                  "icon": "letterTile",
                  "label": "IE",
                  "say": "eye",
                  "correct": false
                },
                {
                  "id": "c15s4-q2-1-107",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                },
                {
                  "id": "c15s4-q2-2-108",
                  "icon": "letterTile",
                  "label": "EE",
                  "say": "ee",
                  "correct": false
                },
                {
                  "id": "c15s4-q2-3-109",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "mmm",
              "options": [
                {
                  "id": "c15s4-q3-0-110",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": false
                },
                {
                  "id": "c15s4-q3-1-111",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c15s4-q3-2-112",
                  "icon": "letterTile",
                  "label": "M",
                  "say": "mmm",
                  "correct": true
                },
                {
                  "id": "c15s4-q3-3-113",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "duh",
              "options": [
                {
                  "id": "c15s4-q4-0-114",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": false
                },
                {
                  "id": "c15s4-q4-1-115",
                  "icon": "letterTile",
                  "label": "Y",
                  "say": "yyuh",
                  "correct": false
                },
                {
                  "id": "c15s4-q4-2-116",
                  "icon": "letterTile",
                  "label": "X",
                  "say": "ksuh",
                  "correct": false
                },
                {
                  "id": "c15s4-q4-3-117",
                  "icon": "letterTile",
                  "label": "D",
                  "say": "duh",
                  "correct": true
                }
              ]
            }
          ]
        },
        {
          "id": "c15s4-finale-119",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "N",
              "say": "nnn"
            },
            "snake"
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
      "recapKo": "S+N = SNAKE! 이제 두 블렌드를 모두 알아요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "snake"
        ]
      }
    },
    {
      "id": "c15-stage-5",
      "order": 5,
      "title": "Boss: STAR and SNAP!",
      "villain": {
        "name": "Voidrex",
        "art": "voidrex-c15",
        "style": "dino-shadow-rex"
      },
      "hero": {
        "name": "Duskmaw",
        "art": "duskmaw-c15",
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
          "id": "c15s5-teach-120",
          "kind": "teach",
          "instructionKo": "히어로가 합체해요! 먼저 star를 만들어요.",
          "repeatAudio": [
            "sss",
            "tuh",
            "arh",
            "star"
          ]
        },
        {
          "id": "c15s5-r1-warmup-121",
          "kind": "drag-build",
          "scored": false,
          "instructionKo": "글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)",
          "letters": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "AR",
              "say": "arh"
            }
          ],
          "target": [
            "S",
            "T",
            "AR"
          ]
        },
        {
          "id": "c15s5-r2-122",
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
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "AR",
              "say": "arh"
            },
            "star"
          ]
        },
        {
          "id": "c15s5-break-123",
          "kind": "break",
          "instructionKo": "이번엔 snap이에요! 함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "sss",
            "nnn",
            "aaa",
            "puh",
            "snap"
          ]
        },
        {
          "id": "c15s5-r3-quickfire-140",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c15s5-bq0-0-124",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                },
                {
                  "id": "c15s5-bq0-1-125",
                  "icon": "letterTile",
                  "label": "CH",
                  "say": "ch",
                  "correct": false
                },
                {
                  "id": "c15s5-bq0-2-126",
                  "icon": "letterTile",
                  "label": "SH",
                  "say": "shhu",
                  "correct": false
                },
                {
                  "id": "c15s5-bq0-3-127",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "tuh",
              "options": [
                {
                  "id": "c15s5-bq1-0-128",
                  "icon": "letterTile",
                  "label": "QU",
                  "say": "kw",
                  "correct": false
                },
                {
                  "id": "c15s5-bq1-1-129",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                },
                {
                  "id": "c15s5-bq1-2-130",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                },
                {
                  "id": "c15s5-bq1-3-131",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "arh",
              "options": [
                {
                  "id": "c15s5-bq2-0-132",
                  "icon": "letterTile",
                  "label": "UE",
                  "say": "u",
                  "correct": false
                },
                {
                  "id": "c15s5-bq2-1-133",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                },
                {
                  "id": "c15s5-bq2-2-134",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": true
                },
                {
                  "id": "c15s5-bq2-3-135",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c15s5-bq3-0-136",
                  "icon": "letterTile",
                  "label": "A",
                  "say": "aaa",
                  "correct": false
                },
                {
                  "id": "c15s5-bq3-1-137",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c15s5-bq3-2-138",
                  "icon": "letterTile",
                  "label": "I",
                  "say": "ihh",
                  "correct": false
                },
                {
                  "id": "c15s5-bq3-3-139",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                }
              ]
            }
          ]
        },
        {
          "id": "c15s5-r4-141",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "AR",
              "say": "arh"
            },
            {
              "text": "S",
              "say": "sss"
            }
          ],
          "target": [
            "S",
            "T",
            "AR"
          ],
          "readAloud": {
            "targetText": "star"
          }
        },
        {
          "id": "c15s5-r5-wordspot-142",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c15s5-ws0-143",
              "icon": "letterTile",
              "label": "ATRS",
              "correct": false
            },
            {
              "id": "c15s5-ws1-144",
              "icon": "letterTile",
              "label": "STAR",
              "correct": true
            },
            {
              "id": "c15s5-ws2-145",
              "icon": "letterTile",
              "label": "ARST",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "star"
          }
        },
        {
          "id": "c15s5-r6-146",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 snap을 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "N",
              "say": "nnn"
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
            }
          ],
          "target": [
            "S",
            "N",
            "A",
            "P"
          ],
          "readAloud": {
            "targetText": "snap"
          }
        },
        {
          "id": "c15s5-r7-bonus-147",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "snap도 천천히 따라 말해보세요.",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "P",
              "say": "puh"
            },
            "snap"
          ]
        },
        {
          "id": "c15s5-finale-148",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! STAR! SNAP!",
          "words": [
            "star",
            "snap"
          ]
        }
      ],
      "recapKo": "STAR와 SNAP을 만들었어요! 챕터 15 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "star",
          "snap"
        ]
      }
    }
  ]
}
