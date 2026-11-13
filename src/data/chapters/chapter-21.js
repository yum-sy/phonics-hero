// Chapter 21 -- consonant blend chapter (world 3, no new phonemes:
// Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이 챕터가
// 가르치는 것은 이미 배운 낱글자 소리 두 개를 이어 말하는 것뿐이다 --
// SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: 마리오(레고) 계열(art/platformer.js), 2회차 재사용
// 블렌드: PL(plum) / DR(drum)
// 보스 단어: PLUM(P+L+U+M) / DRUM(D+R+U+M)
// 아이콘: plum/drum 둘 다 icons.js 재고에 없다 -- 이 챕터의 그림 인식 문항은 전부 누적 복습(기존 아이콘)으로 채웠다.
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
export const chapter21 = {
  "id": "chapter-21",
  "order": 21,
  "title": "Knights: Blend Quest",
  "stages": [
    {
      "id": "c21-stage-1",
      "order": 1,
      "title": "P and L Together",
      "villain": {
        "name": "Flipnik",
        "art": "flipnik-c21",
        "style": "plat-flip"
      },
      "hero": {
        "name": "Hopkin",
        "art": "hopkin-c21",
        "style": "plat-jumper"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c21s1-teach-874",
          "kind": "teach",
          "instructionKo": "히어로가 P와 L 소리를 나란히 들려줘요! 잘 들어보세요.",
          "art": "hero",
          "repeatAudio": [
            "puh"
          ]
        },
        {
          "id": "c21s1-r1-875",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 다른 소리예요. 잘 듣고 따라 말해보세요!",
          "words": [
            {
              "text": "L",
              "say": "lll"
            }
          ]
        },
        {
          "id": "c21s1-break-876",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c21s1-blend-877",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "P랑 L 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "P",
              "say": "puh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            "plum"
          ]
        },
        {
          "id": "c21s1-r2-878",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"pin\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "puh",
          "options": [
            {
              "id": "c21s1-o0-879",
              "icon": "ring",
              "label": "ring",
              "correct": false
            },
            {
              "id": "c21s1-o1-880",
              "icon": "map",
              "label": "map",
              "correct": false
            },
            {
              "id": "c21s1-o2-881",
              "icon": "pin",
              "label": "pin",
              "correct": true
            },
            {
              "id": "c21s1-o3-882",
              "icon": "duck",
              "label": "duck",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "pin"
          }
        },
        {
          "id": "c21s1-r3-883",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"lion\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "lll",
          "options": [
            {
              "id": "c21s1-o0-884",
              "icon": "gum",
              "label": "gum",
              "correct": false
            },
            {
              "id": "c21s1-o1-885",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            },
            {
              "id": "c21s1-o2-886",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            },
            {
              "id": "c21s1-o3-887",
              "icon": "lion",
              "label": "lion",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "lion"
          }
        },
        {
          "id": "c21s1-r5-888",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "pin",
            "lion"
          ]
        },
        {
          "id": "c21s1-finale-889",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "plum"
          ]
        }
      ],
      "recapKo": "P와 L 소리를 이어봤어요! plum처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "plum"
        ]
      }
    },
    {
      "id": "c21-stage-2",
      "order": 2,
      "title": "Power of PL",
      "villain": {
        "name": "Oozelle",
        "art": "oozelle-c21",
        "style": "plat-slime"
      },
      "hero": {
        "name": "Hopkin",
        "art": "hopkin-c21",
        "style": "plat-jumper"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c21s2-r1-warmup-890",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "puh",
          "options": [
            {
              "id": "c21s2-w0-891",
              "icon": "letterTile",
              "label": "L",
              "say": "lll",
              "correct": false
            },
            {
              "id": "c21s2-w1-892",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": true
            },
            {
              "id": "c21s2-w2-893",
              "icon": "letterTile",
              "label": "F",
              "say": "fff",
              "correct": false
            }
          ]
        },
        {
          "id": "c21s2-r2-894",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"bed\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "buh",
          "options": [
            {
              "id": "c21s2-a0-895",
              "icon": "bed",
              "label": "bed",
              "correct": true
            },
            {
              "id": "c21s2-a1-896",
              "icon": "rain",
              "label": "rain",
              "correct": false
            },
            {
              "id": "c21s2-a2-897",
              "icon": "jam",
              "label": "jam",
              "correct": false
            },
            {
              "id": "c21s2-a3-898",
              "icon": "boat",
              "label": "boat",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "bed"
          }
        },
        {
          "id": "c21s2-r3-trace-899",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 L을 따라 그리면서 소리를 내보세요!",
          "trace": "upper",
          "words": [
            {
              "text": "L",
              "say": "lll"
            }
          ]
        },
        {
          "id": "c21s2-break-900",
          "kind": "break",
          "instructionKo": "P랑 L을 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c21s2-r4-multiselect-901",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/k/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c21s2-m1-903",
              "icon": "cup",
              "label": "cup",
              "correct": true
            },
            {
              "id": "c21s2-m3-905",
              "icon": "pie",
              "label": "pie",
              "correct": false
            },
            {
              "id": "c21s2-m0-902",
              "icon": "cat",
              "label": "cat",
              "correct": true
            },
            {
              "id": "c21s2-m4-906",
              "icon": "feet",
              "label": "feet",
              "correct": false
            },
            {
              "id": "c21s2-m2-904",
              "icon": "cake",
              "label": "cake",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "cat"
          }
        },
        {
          "id": "c21s2-r5-hard-912",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "lll",
          "options": [
            {
              "id": "c21s2-h-correct-907",
              "icon": "letterTile",
              "label": "L",
              "say": "lll",
              "correct": true
            },
            {
              "id": "c21s2-h0-908",
              "icon": "letterTile",
              "label": "OR",
              "say": "or",
              "correct": false
            },
            {
              "id": "c21s2-h1-909",
              "icon": "letterTile",
              "label": "Z",
              "say": "zze",
              "correct": false
            },
            {
              "id": "c21s2-h2-910",
              "icon": "letterTile",
              "label": "W",
              "say": "weh",
              "correct": false
            },
            {
              "id": "c21s2-h3-911",
              "icon": "letterTile",
              "label": "NG",
              "say": "ngh",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "L",
            "say": "lll"
          }
        },
        {
          "id": "c21s2-r6-reversed-913",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "V",
          "options": [
            {
              "id": "c21s2-v0-914",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": false
            },
            {
              "id": "c21s2-v1-915",
              "icon": "chips",
              "label": "chips",
              "correct": false
            },
            {
              "id": "c21s2-v2-916",
              "icon": "van",
              "label": "van",
              "correct": true
            },
            {
              "id": "c21s2-v3-2001",
              "icon": "hand",
              "label": "hand",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "van"
          }
        },
        {
          "id": "c21s2-r7-listenrepeat-917",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "plum",
            "bed"
          ]
        },
        {
          "id": "c21s2-finale-918",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "L",
              "say": "lll"
            },
            "plum"
          ]
        }
      ],
      "recapKo": "P+L = PLUM! 소리를 잘 익혔어요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "plum"
        ]
      }
    },
    {
      "id": "c21-stage-3",
      "order": 3,
      "title": "D and R Together",
      "villain": {
        "name": "Magnojack",
        "art": "magnojack-c21",
        "style": "plat-magnetjack"
      },
      "hero": {
        "name": "Coilster",
        "art": "coilster-c21",
        "style": "plat-spring"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c21s3-teach-919",
          "kind": "teach",
          "instructionKo": "히어로가 D와 R 소리를 나란히 들려줘요! 잘 들어보세요.",
          "art": "hero",
          "repeatAudio": [
            "duh"
          ]
        },
        {
          "id": "c21s3-r1-920",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 다른 소리예요. 잘 듣고 따라 말해보세요!",
          "words": [
            {
              "text": "R",
              "say": "rrr"
            }
          ]
        },
        {
          "id": "c21s3-break-921",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "rrr"
          ]
        },
        {
          "id": "c21s3-blend-922",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "D랑 R 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "D",
              "say": "duh"
            },
            {
              "text": "R",
              "say": "rrr"
            },
            "drum"
          ]
        },
        {
          "id": "c21s3-r2-923",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"dog\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "duh",
          "options": [
            {
              "id": "c21s3-o0-924",
              "icon": "dog",
              "label": "dog",
              "correct": true
            },
            {
              "id": "c21s3-o1-925",
              "icon": "shoe",
              "label": "shoe",
              "correct": false
            },
            {
              "id": "c21s3-o2-926",
              "icon": "thumb",
              "label": "thumb",
              "correct": false
            },
            {
              "id": "c21s3-o3-927",
              "icon": "queen",
              "label": "queen",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "dog"
          }
        },
        {
          "id": "c21s3-r3-928",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"rubber\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c21s3-o0-929",
              "icon": "coin",
              "label": "coin",
              "correct": false
            },
            {
              "id": "c21s3-o1-930",
              "icon": "rubber",
              "label": "rubber",
              "correct": true
            },
            {
              "id": "c21s3-o2-2002",
              "icon": "leg",
              "label": "leg",
              "correct": false
            },
            {
              "id": "c21s3-o3-2003",
              "icon": "sock",
              "label": "sock",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "rubber"
          }
        },
        {
          "id": "c21s3-r5-931",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "dog",
            "rubber"
          ]
        },
        {
          "id": "c21s3-finale-932",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "drum"
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
      "recapKo": "D와 R 소리를 이어봤어요! drum처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "drum"
        ]
      }
    },
    {
      "id": "c21-stage-4",
      "order": 4,
      "title": "Power of DR",
      "villain": {
        "name": "Brickle",
        "art": "brickle-c21",
        "style": "plat-brick"
      },
      "hero": {
        "name": "Blockhart",
        "art": "blockhart-c21",
        "style": "plat-block"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c21s4-r1-warmup-933",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "duh",
          "options": [
            {
              "id": "c21s4-w0-934",
              "icon": "letterTile",
              "label": "AR",
              "say": "arh",
              "correct": false
            },
            {
              "id": "c21s4-w1-935",
              "icon": "letterTile",
              "label": "D",
              "say": "duh",
              "correct": true
            },
            {
              "id": "c21s4-w2-936",
              "icon": "letterTile",
              "label": "ER",
              "say": "erh",
              "correct": false
            }
          ]
        },
        {
          "id": "c21s4-r2-937",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"sun\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c21s4-a0-938",
              "icon": "apple",
              "label": "apple",
              "correct": false
            },
            {
              "id": "c21s4-a1-939",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c21s4-a2-940",
              "icon": "sun",
              "label": "sun",
              "correct": true
            },
            {
              "id": "c21s4-a3-941",
              "icon": "igloo",
              "label": "igloo",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "sun"
          }
        },
        {
          "id": "c21s4-r3-trace-942",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 R을 따라 그리면서 소리를 내보세요!",
          "trace": "upper",
          "words": [
            {
              "text": "R",
              "say": "rrr"
            }
          ]
        },
        {
          "id": "c21s4-break-943",
          "kind": "break",
          "instructionKo": "D랑 R을 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "rrr"
          ]
        },
        {
          "id": "c21s4-r4-multiselect-944",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/f/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c21s4-m1-946",
              "icon": "fan",
              "label": "fan",
              "correct": true
            },
            {
              "id": "c21s4-m3-948",
              "icon": "pie",
              "label": "pie",
              "correct": false
            },
            {
              "id": "c21s4-m2-947",
              "icon": "fox",
              "label": "fox",
              "correct": true
            },
            {
              "id": "c21s4-m4-949",
              "icon": "nose",
              "label": "nose",
              "correct": false
            },
            {
              "id": "c21s4-m0-945",
              "icon": "fish",
              "label": "fish",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "fish"
          }
        },
        {
          "id": "c21s4-r5-hard-955",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c21s4-h0-951",
              "icon": "letterTile",
              "label": "C",
              "say": "kuh",
              "correct": false
            },
            {
              "id": "c21s4-h1-952",
              "icon": "letterTile",
              "label": "L",
              "say": "lll",
              "correct": false
            },
            {
              "id": "c21s4-h-correct-950",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": true
            },
            {
              "id": "c21s4-h2-953",
              "icon": "letterTile",
              "label": "H",
              "say": "huh",
              "correct": false
            },
            {
              "id": "c21s4-h3-954",
              "icon": "letterTile",
              "label": "M",
              "say": "mmm",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "R",
            "say": "rrr"
          }
        },
        {
          "id": "c21s4-r6-reversed-956",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "D",
          "options": [
            {
              "id": "c21s4-v0-957",
              "icon": "door",
              "label": "door",
              "correct": true
            },
            {
              "id": "c21s4-v1-958",
              "icon": "zebra",
              "label": "zebra",
              "correct": false
            },
            {
              "id": "c21s4-v2-959",
              "icon": "hen",
              "label": "hen",
              "correct": false
            },
            {
              "id": "c21s4-v3-960",
              "icon": "nut",
              "label": "nut",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "door"
          }
        },
        {
          "id": "c21s4-r7-listenrepeat-961",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "drum",
            "sun"
          ]
        },
        {
          "id": "c21s4-r8-cycle-982",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "duh",
              "options": [
                {
                  "id": "c21s4-q0-0-962",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": false
                },
                {
                  "id": "c21s4-q0-1-963",
                  "icon": "letterTile",
                  "label": "D",
                  "say": "duh",
                  "correct": true
                },
                {
                  "id": "c21s4-q0-2-964",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": false
                },
                {
                  "id": "c21s4-q0-3-965",
                  "icon": "letterTile",
                  "label": "AI",
                  "say": "a",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "rrr",
              "options": [
                {
                  "id": "c21s4-q1-0-966",
                  "icon": "letterTile",
                  "label": "J",
                  "say": "juh",
                  "correct": false
                },
                {
                  "id": "c21s4-q1-1-967",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                },
                {
                  "id": "c21s4-q1-2-968",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                },
                {
                  "id": "c21s4-q1-3-969",
                  "icon": "letterTile",
                  "label": "IE",
                  "say": "eye",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "zze",
              "options": [
                {
                  "id": "c21s4-q2-0-970",
                  "icon": "letterTile",
                  "label": "EE",
                  "say": "ee",
                  "correct": false
                },
                {
                  "id": "c21s4-q2-1-971",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": false
                },
                {
                  "id": "c21s4-q2-2-972",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c21s4-q2-3-973",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "juh",
              "options": [
                {
                  "id": "c21s4-q3-0-974",
                  "icon": "letterTile",
                  "label": "J",
                  "say": "juh",
                  "correct": true
                },
                {
                  "id": "c21s4-q3-1-975",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": false
                },
                {
                  "id": "c21s4-q3-2-976",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": false
                },
                {
                  "id": "c21s4-q3-3-977",
                  "icon": "letterTile",
                  "label": "Y",
                  "say": "yyuh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "vve",
              "options": [
                {
                  "id": "c21s4-q4-0-978",
                  "icon": "letterTile",
                  "label": "X",
                  "say": "ksuh",
                  "correct": false
                },
                {
                  "id": "c21s4-q4-1-979",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": true
                },
                {
                  "id": "c21s4-q4-2-980",
                  "icon": "letterTile",
                  "label": "CH",
                  "say": "ch",
                  "correct": false
                },
                {
                  "id": "c21s4-q4-3-981",
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
          "id": "c21s4-finale-983",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "R",
              "say": "rrr"
            },
            "drum"
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
      "recapKo": "D+R = DRUM! 이제 두 블렌드를 모두 알아요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "drum"
        ]
      }
    },
    {
      "id": "c21-stage-5",
      "order": 5,
      "title": "Boss: PLUM and DRUM!",
      "villain": {
        "name": "Glitchmar",
        "art": "glitchmar-c21",
        "style": "plat-glitch"
      },
      "hero": {
        "name": "Megashroom",
        "art": "megashroom-c21",
        "style": "plat-powerup"
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
          "id": "c21s5-teach-984",
          "kind": "teach",
          "instructionKo": "히어로가 합체해요! 먼저 plum을 만들어요.",
          "repeatAudio": [
            "puh",
            "lll",
            "uh",
            "mmm",
            "plum"
          ]
        },
        {
          "id": "c21s5-r1-warmup-985",
          "kind": "drag-build",
          "scored": false,
          "instructionKo": "글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)",
          "letters": [
            {
              "text": "P",
              "say": "puh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "U",
              "say": "uh"
            },
            {
              "text": "M",
              "say": "mmm"
            }
          ],
          "target": [
            "P",
            "L",
            "U",
            "M"
          ]
        },
        {
          "id": "c21s5-r2-986",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "천천히 따라 말해보세요.",
          "words": [
            {
              "text": "P",
              "say": "puh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "U",
              "say": "uh"
            },
            {
              "text": "M",
              "say": "mmm"
            },
            "plum"
          ]
        },
        {
          "id": "c21s5-break-987",
          "kind": "break",
          "instructionKo": "이번엔 drum이에요! 함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "duh",
            "rrr",
            "uh",
            "mmm",
            "drum"
          ]
        },
        {
          "id": "c21s5-r3-quickfire-1004",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "puh",
              "options": [
                {
                  "id": "c21s5-bq0-0-988",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c21s5-bq0-1-989",
                  "icon": "letterTile",
                  "label": "QU",
                  "say": "kw",
                  "correct": false
                },
                {
                  "id": "c21s5-bq0-2-990",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": true
                },
                {
                  "id": "c21s5-bq0-3-991",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "lll",
              "options": [
                {
                  "id": "c21s5-bq1-0-992",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": false
                },
                {
                  "id": "c21s5-bq1-1-993",
                  "icon": "letterTile",
                  "label": "UE",
                  "say": "u",
                  "correct": false
                },
                {
                  "id": "c21s5-bq1-2-994",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": false
                },
                {
                  "id": "c21s5-bq1-3-995",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "uh",
              "options": [
                {
                  "id": "c21s5-bq2-0-996",
                  "icon": "letterTile",
                  "label": "U",
                  "say": "uh",
                  "correct": true
                },
                {
                  "id": "c21s5-bq2-1-997",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                },
                {
                  "id": "c21s5-bq2-2-998",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c21s5-bq2-3-999",
                  "icon": "letterTile",
                  "label": "A",
                  "say": "aaa",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "mmm",
              "options": [
                {
                  "id": "c21s5-bq3-0-1000",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c21s5-bq3-1-1001",
                  "icon": "letterTile",
                  "label": "M",
                  "say": "mmm",
                  "correct": true
                },
                {
                  "id": "c21s5-bq3-2-1002",
                  "icon": "letterTile",
                  "label": "I",
                  "say": "ihh",
                  "correct": false
                },
                {
                  "id": "c21s5-bq3-3-1003",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c21s5-r4-1005",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "U",
              "say": "uh"
            },
            {
              "text": "M",
              "say": "mmm"
            },
            {
              "text": "P",
              "say": "puh"
            }
          ],
          "target": [
            "P",
            "L",
            "U",
            "M"
          ],
          "readAloud": {
            "targetText": "plum"
          }
        },
        {
          "id": "c21s5-r5-wordspot-1006",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c21s5-ws0-1007",
              "icon": "letterTile",
              "label": "MULP",
              "correct": false
            },
            {
              "id": "c21s5-ws1-1008",
              "icon": "letterTile",
              "label": "PLUM",
              "correct": true
            },
            {
              "id": "c21s5-ws2-1009",
              "icon": "letterTile",
              "label": "MPLU",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "plum"
          }
        },
        {
          "id": "c21s5-r6-1010",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 drum을 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "U",
              "say": "uh"
            },
            {
              "text": "M",
              "say": "mmm"
            },
            {
              "text": "D",
              "say": "duh"
            }
          ],
          "target": [
            "D",
            "R",
            "U",
            "M"
          ],
          "readAloud": {
            "targetText": "drum"
          }
        },
        {
          "id": "c21s5-r7-bonus-1011",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "drum도 천천히 따라 말해보세요.",
          "words": [
            {
              "text": "D",
              "say": "duh"
            },
            {
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "U",
              "say": "uh"
            },
            {
              "text": "M",
              "say": "mmm"
            },
            "drum"
          ]
        },
        {
          "id": "c21s5-finale-1012",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! PLUM! DRUM!",
          "words": [
            "plum",
            "drum"
          ]
        }
      ],
      "recapKo": "PLUM과 DRUM을 만들었어요! 챕터 21 클리어! 월드 3 완성!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "plum",
          "drum"
        ]
      }
    }
  ]
}
