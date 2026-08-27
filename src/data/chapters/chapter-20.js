// Chapter 20 -- consonant blend chapter (world 3, no new phonemes:
// Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이 챕터가
// 가르치는 것은 이미 배운 낱글자 소리 두 개를 이어 말하는 것뿐이다 --
// SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: 카봇 계열(art/robots.js robot/robot-deluxe), 3회차 재사용
// 블렌드: SP(spin) / SK(skip)
// 보스 단어: SPIN(S+P+I+N) / SKIP(S+K+I+P)
// 아이콘: spin/skip 둘 다 icons.js 재고에 없다 -- 이 챕터의 그림 인식 문항은 전부 누적 복습(기존 아이콘)으로 채웠다(챕터 9의 Z/W 처방과 동일). HERO_VARIANTS/VILLAIN_VARIANTS 의 실루엣 배정(wedge/spoiler-wide/... 등)은 리더가 팔레트 배선 시 정할 몫이라 여기서는 style만 robot/robot-deluxe로 남겼다.
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
export const chapter20 = {
  "id": "chapter-20",
  "order": 20,
  "title": "Carbot Squad: Blend Drive",
  "stages": [
    {
      "id": "c20-stage-1",
      "order": 1,
      "title": "S and P Together",
      "villain": {
        "name": "Rustbolt",
        "art": "rustbolt-c20",
        "style": "robot"
      },
      "hero": {
        "name": "Gearspin",
        "art": "gearspin-c20",
        "style": "robot"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c20s1-teach-737",
          "kind": "teach",
          "instructionKo": "Gearspin이 S와 P 소리를 나란히 들려줘요! 잘 들어보세요.",
          "art": "hero",
          "repeatAudio": [
            "sss"
          ]
        },
        {
          "id": "c20s1-r1-738",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 다른 소리예요. 잘 듣고 따라 말해보세요!",
          "words": [
            {
              "text": "P",
              "say": "puh"
            }
          ]
        },
        {
          "id": "c20s1-break-739",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "puh"
          ]
        },
        {
          "id": "c20s1-blend-740",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "S랑 P 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "P",
              "say": "puh"
            },
            "spin"
          ]
        },
        {
          "id": "c20s1-r2-741",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"sock\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c20s1-o0-742",
              "icon": "gum",
              "label": "gum",
              "correct": false
            },
            {
              "id": "c20s1-o1-743",
              "icon": "sock",
              "label": "sock",
              "correct": true
            },
            {
              "id": "c20s1-o2-744",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            },
            {
              "id": "c20s1-o3-745",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "sock"
          }
        },
        {
          "id": "c20s1-r3-746",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"pen\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "puh",
          "options": [
            {
              "id": "c20s1-o0-747",
              "icon": "lion",
              "label": "lion",
              "correct": false
            },
            {
              "id": "c20s1-o1-748",
              "icon": "fork",
              "label": "fork",
              "correct": false
            },
            {
              "id": "c20s1-o2-749",
              "icon": "pen",
              "label": "pen",
              "correct": true
            },
            {
              "id": "c20s1-o3-750",
              "icon": "ball",
              "label": "ball",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "pen"
          }
        },
        {
          "id": "c20s1-r5-751",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "sock",
            "pen"
          ]
        },
        {
          "id": "c20s1-finale-752",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "spin"
          ]
        }
      ],
      "recapKo": "S와 P 소리를 이어봤어요! spin처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "spin"
        ]
      }
    },
    {
      "id": "c20-stage-2",
      "order": 2,
      "title": "Power of SP",
      "villain": {
        "name": "Scraphook",
        "art": "scraphook-c20",
        "style": "robot"
      },
      "hero": {
        "name": "Gearspin",
        "art": "gearspin-c20",
        "style": "robot"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c20s2-r1-warmup-753",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c20s2-w0-754",
              "icon": "letterTile",
              "label": "AI",
              "say": "a",
              "correct": false
            },
            {
              "id": "c20s2-w1-755",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": true
            },
            {
              "id": "c20s2-w2-756",
              "icon": "letterTile",
              "label": "J",
              "say": "juh",
              "correct": false
            }
          ]
        },
        {
          "id": "c20s2-r2-757",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"coat\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "oh",
          "options": [
            {
              "id": "c20s2-a0-758",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c20s2-a1-759",
              "icon": "bee",
              "label": "bee",
              "correct": false
            },
            {
              "id": "c20s2-a2-760",
              "icon": "corn",
              "label": "corn",
              "correct": false
            },
            {
              "id": "c20s2-a3-761",
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
          "id": "c20s2-r3-trace-762",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 P를 따라 그리면서 소리를 내보세요!",
          "words": [
            {
              "text": "P",
              "say": "puh"
            }
          ]
        },
        {
          "id": "c20s2-break-763",
          "kind": "break",
          "instructionKo": "S랑 P를 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "puh"
          ]
        },
        {
          "id": "c20s2-r4-multiselect-764",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/c/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c20s2-m0-765",
              "icon": "cat",
              "label": "cat",
              "correct": true
            },
            {
              "id": "c20s2-m1-766",
              "icon": "cup",
              "label": "cup",
              "correct": true
            },
            {
              "id": "c20s2-m2-767",
              "icon": "cake",
              "label": "cake",
              "correct": true
            },
            {
              "id": "c20s2-m3-768",
              "icon": "zebra",
              "label": "zebra",
              "correct": false
            },
            {
              "id": "c20s2-m4-768b",
              "icon": "gum",
              "label": "gum",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "cat"
          }
        },
        {
          "id": "c20s2-r5-hard-774",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)",
          "promptAudio": "puh",
          "options": [
            {
              "id": "c20s2-h0-770",
              "icon": "letterTile",
              "label": "NG",
              "say": "ngh",
              "correct": false
            },
            {
              "id": "c20s2-h1-771",
              "icon": "letterTile",
              "label": "V",
              "say": "vve",
              "correct": false
            },
            {
              "id": "c20s2-h2-772",
              "icon": "letterTile",
              "label": "Y",
              "say": "yyuh",
              "correct": false
            },
            {
              "id": "c20s2-h3-773",
              "icon": "letterTile",
              "label": "X",
              "say": "ksuh",
              "correct": false
            },
            {
              "id": "c20s2-h-correct-769",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "P",
            "say": "puh"
          }
        },
        {
          "id": "c20s2-r6-reversed-775",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "CH",
          "options": [
            {
              "id": "c20s2-v0-776",
              "icon": "shoe",
              "label": "shoe",
              "correct": false
            },
            {
              "id": "c20s2-v1-777",
              "icon": "chips",
              "label": "chips",
              "correct": true
            },
            {
              "id": "c20s2-v2-778",
              "icon": "thumb",
              "label": "thumb",
              "correct": false
            },
            {
              "id": "c20s2-v3-779",
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
          "id": "c20s2-r7-listenrepeat-780",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "spin",
            "coat"
          ]
        },
        {
          "id": "c20s2-finale-781",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "P",
              "say": "puh"
            },
            "spin"
          ]
        }
      ],
      "recapKo": "S+P = SPIN! 소리를 잘 익혔어요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "spin"
        ]
      }
    },
    {
      "id": "c20-stage-3",
      "order": 3,
      "title": "S and K Together",
      "villain": {
        "name": "Ironmaw",
        "art": "ironmaw-c20",
        "style": "robot"
      },
      "hero": {
        "name": "Turbolt",
        "art": "turbolt-c20",
        "style": "robot"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c20s3-teach-782",
          "kind": "teach",
          "instructionKo": "Turbolt가 S와 K 소리를 나란히 들려줘요! 잘 들어보세요.",
          "art": "hero",
          "repeatAudio": [
            "sss"
          ]
        },
        {
          "id": "c20s3-r1-783",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 다른 소리예요. 잘 듣고 따라 말해보세요!",
          "words": [
            {
              "text": "K",
              "say": "kuh"
            }
          ]
        },
        {
          "id": "c20s3-break-784",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "kuh"
          ]
        },
        {
          "id": "c20s3-blend-785",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "S랑 K 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "K",
              "say": "kuh"
            },
            "skip"
          ]
        },
        {
          "id": "c20s3-r2-786",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"sun\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c20s3-o0-787",
              "icon": "coin",
              "label": "coin",
              "correct": false
            },
            {
              "id": "c20s3-o1-788",
              "icon": "sun",
              "label": "sun",
              "correct": true
            },
            {
              "id": "c20s3-o2-788b",
              "icon": "fan",
              "label": "fan",
              "correct": false
            },
            {
              "id": "c20s3-o3-788c",
              "icon": "leg",
              "label": "leg",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "sun"
          }
        },
        {
          "id": "c20s3-r3-789",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"cup\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c20s3-o0-790",
              "icon": "cup",
              "label": "cup",
              "correct": true
            },
            {
              "id": "c20s3-o1-791",
              "icon": "sock",
              "label": "sock",
              "correct": false
            },
            {
              "id": "c20s3-o2-791b",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c20s3-o3-791c",
              "icon": "door",
              "label": "door",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "cup"
          }
        },
        {
          "id": "c20s3-r5-792",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "sun",
            "cup"
          ]
        },
        {
          "id": "c20s3-finale-793",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "skip"
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
      "recapKo": "S와 K 소리를 이어봤어요! skip처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "skip"
        ]
      }
    },
    {
      "id": "c20-stage-4",
      "order": 4,
      "title": "Power of SK",
      "villain": {
        "name": "Voltcrusher",
        "art": "voltcrusher-c20",
        "style": "robot-deluxe"
      },
      "hero": {
        "name": "Chromewing",
        "art": "chromewing-c20",
        "style": "robot-deluxe"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c20s4-r1-warmup-794",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c20s4-w0-795",
              "icon": "letterTile",
              "label": "A",
              "say": "aaa",
              "correct": false
            },
            {
              "id": "c20s4-w1-796",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": true
            },
            {
              "id": "c20s4-w2-797",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            }
          ]
        },
        {
          "id": "c20s4-r2-798",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"insect\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "ihh",
          "options": [
            {
              "id": "c20s4-a0-799",
              "icon": "pot",
              "label": "pot",
              "correct": false
            },
            {
              "id": "c20s4-a1-800",
              "icon": "insect",
              "label": "insect",
              "correct": true
            },
            {
              "id": "c20s4-a2-801",
              "icon": "nut",
              "label": "nut",
              "correct": false
            },
            {
              "id": "c20s4-a3-802",
              "icon": "king",
              "label": "king",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "insect"
          }
        },
        {
          "id": "c20s4-r3-trace-803",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 K를 따라 그리면서 소리를 내보세요!",
          "words": [
            {
              "text": "K",
              "say": "kuh"
            }
          ]
        },
        {
          "id": "c20s4-break-804",
          "kind": "break",
          "instructionKo": "S랑 K를 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "kuh"
          ]
        },
        {
          "id": "c20s4-r4-multiselect-805",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/h/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c20s4-m0-806",
              "icon": "hen",
              "label": "hen",
              "correct": true
            },
            {
              "id": "c20s4-m1-807",
              "icon": "hat",
              "label": "hat",
              "correct": true
            },
            {
              "id": "c20s4-m2-808",
              "icon": "horse",
              "label": "horse",
              "correct": true
            },
            {
              "id": "c20s4-m3-809",
              "icon": "egg",
              "label": "egg",
              "correct": false
            },
            {
              "id": "c20s4-m4-810",
              "icon": "rat",
              "label": "rat",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "hen"
          }
        },
        {
          "id": "c20s4-r5-hard-816",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c20s4-h0-812",
              "icon": "letterTile",
              "label": "M",
              "say": "mmm",
              "correct": false
            },
            {
              "id": "c20s4-h-correct-811",
              "icon": "letterTile",
              "label": "K",
              "say": "kuh",
              "correct": true
            },
            {
              "id": "c20s4-h1-813",
              "icon": "letterTile",
              "label": "D",
              "say": "duh",
              "correct": false
            },
            {
              "id": "c20s4-h2-814",
              "icon": "letterTile",
              "label": "G",
              "say": "guh",
              "correct": false
            },
            {
              "id": "c20s4-h3-815",
              "icon": "letterTile",
              "label": "O",
              "say": "awh",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "K",
            "say": "kuh"
          }
        },
        {
          "id": "c20s4-r6-reversed-817",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "U",
          "options": [
            {
              "id": "c20s4-v0-818",
              "icon": "leg",
              "label": "leg",
              "correct": false
            },
            {
              "id": "c20s4-v1-819",
              "icon": "feet",
              "label": "feet",
              "correct": false
            },
            {
              "id": "c20s4-v2-820",
              "icon": "box",
              "label": "box",
              "correct": false
            },
            {
              "id": "c20s4-v3-821",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "umbrella"
          }
        },
        {
          "id": "c20s4-r7-listenrepeat-822",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "skip",
            "insect"
          ]
        },
        {
          "id": "c20s4-r8-cycle-843",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c20s4-q0-0-823",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                },
                {
                  "id": "c20s4-q0-1-824",
                  "icon": "letterTile",
                  "label": "AI",
                  "say": "a",
                  "correct": false
                },
                {
                  "id": "c20s4-q0-2-825",
                  "icon": "letterTile",
                  "label": "J",
                  "say": "juh",
                  "correct": false
                },
                {
                  "id": "c20s4-q0-3-826",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "kuh",
              "options": [
                {
                  "id": "c20s4-q1-0-827",
                  "icon": "letterTile",
                  "label": "IE",
                  "say": "eye",
                  "correct": false
                },
                {
                  "id": "c20s4-q1-1-828",
                  "icon": "letterTile",
                  "label": "K",
                  "say": "kuh",
                  "correct": true
                },
                {
                  "id": "c20s4-q1-2-829",
                  "icon": "letterTile",
                  "label": "EE",
                  "say": "ee",
                  "correct": false
                },
                {
                  "id": "c20s4-q1-3-830",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "guh",
              "options": [
                {
                  "id": "c20s4-q2-0-831",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": false
                },
                {
                  "id": "c20s4-q2-1-832",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c20s4-q2-2-833",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": true
                },
                {
                  "id": "c20s4-q2-3-834",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "vve",
              "options": [
                {
                  "id": "c20s4-q3-0-835",
                  "icon": "letterTile",
                  "label": "Y",
                  "say": "yyuh",
                  "correct": false
                },
                {
                  "id": "c20s4-q3-1-836",
                  "icon": "letterTile",
                  "label": "X",
                  "say": "ksuh",
                  "correct": false
                },
                {
                  "id": "c20s4-q3-2-837",
                  "icon": "letterTile",
                  "label": "CH",
                  "say": "ch",
                  "correct": false
                },
                {
                  "id": "c20s4-q3-3-838",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "weh",
              "options": [
                {
                  "id": "c20s4-q4-0-839",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": true
                },
                {
                  "id": "c20s4-q4-1-840",
                  "icon": "letterTile",
                  "label": "SH",
                  "say": "shhu",
                  "correct": false
                },
                {
                  "id": "c20s4-q4-2-841",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c20s4-q4-3-842",
                  "icon": "letterTile",
                  "label": "QU",
                  "say": "kw",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c20s4-finale-844",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "K",
              "say": "kuh"
            },
            "skip"
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
      "recapKo": "S+K = SKIP! 이제 두 블렌드를 모두 알아요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "skip"
        ]
      }
    },
    {
      "id": "c20-stage-5",
      "order": 5,
      "title": "Boss: SPIN and SKIP!",
      "villain": {
        "name": "Direforge",
        "art": "direforge-c20",
        "style": "robot-deluxe"
      },
      "hero": {
        "name": "Titanvolt",
        "art": "titanvolt-c20",
        "style": "robot-deluxe"
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
          "id": "c20s5-teach-845",
          "kind": "teach",
          "instructionKo": "Titanvolt가 합체해요! 먼저 spin을 만들어요.",
          "repeatAudio": [
            "sss",
            "puh",
            "ihh",
            "nnn",
            "spin"
          ]
        },
        {
          "id": "c20s5-r1-warmup-846",
          "kind": "drag-build",
          "scored": false,
          "instructionKo": "글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)",
          "letters": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "P",
              "say": "puh"
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
            "S",
            "P",
            "I",
            "N"
          ]
        },
        {
          "id": "c20s5-r2-847",
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
              "text": "P",
              "say": "puh"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            "spin"
          ]
        },
        {
          "id": "c20s5-break-848",
          "kind": "break",
          "instructionKo": "이번엔 skip이에요! 함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "sss",
            "kuh",
            "ihh",
            "puh",
            "skip"
          ]
        },
        {
          "id": "c20s5-r3-quickfire-865",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c20s5-bq0-0-849",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                },
                {
                  "id": "c20s5-bq0-1-850",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                },
                {
                  "id": "c20s5-bq0-2-851",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": false
                },
                {
                  "id": "c20s5-bq0-3-852",
                  "icon": "letterTile",
                  "label": "UE",
                  "say": "u",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "puh",
              "options": [
                {
                  "id": "c20s5-bq1-0-853",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": false
                },
                {
                  "id": "c20s5-bq1-1-854",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                },
                {
                  "id": "c20s5-bq1-2-855",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": true
                },
                {
                  "id": "c20s5-bq1-3-856",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "ihh",
              "options": [
                {
                  "id": "c20s5-bq2-0-857",
                  "icon": "letterTile",
                  "label": "A",
                  "say": "aaa",
                  "correct": false
                },
                {
                  "id": "c20s5-bq2-1-858",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c20s5-bq2-2-859",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c20s5-bq2-3-860",
                  "icon": "letterTile",
                  "label": "I",
                  "say": "ihh",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c20s5-bq3-0-861",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                },
                {
                  "id": "c20s5-bq3-1-862",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c20s5-bq3-2-863",
                  "icon": "letterTile",
                  "label": "E",
                  "say": "eh",
                  "correct": false
                },
                {
                  "id": "c20s5-bq3-3-864",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c20s5-r4-866",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "P",
              "say": "puh"
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
              "text": "S",
              "say": "sss"
            }
          ],
          "target": [
            "S",
            "P",
            "I",
            "N"
          ],
          "readAloud": {
            "targetText": "spin"
          }
        },
        {
          "id": "c20s5-r5-wordspot-867",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c20s5-ws0-868",
              "icon": "letterTile",
              "label": "NIPS",
              "correct": false
            },
            {
              "id": "c20s5-ws1-869",
              "icon": "letterTile",
              "label": "SPIN",
              "correct": true
            },
            {
              "id": "c20s5-ws2-870",
              "icon": "letterTile",
              "label": "NSPI",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "spin"
          }
        },
        {
          "id": "c20s5-r6-871",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 skip을 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "K",
              "say": "kuh"
            },
            {
              "text": "I",
              "say": "ihh"
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
            "K",
            "I",
            "P"
          ],
          "readAloud": {
            "targetText": "skip"
          }
        },
        {
          "id": "c20s5-r7-bonus-872",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "skip도 천천히 따라 말해보세요.",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "K",
              "say": "kuh"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "P",
              "say": "puh"
            },
            "skip"
          ]
        },
        {
          "id": "c20s5-finale-873",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! SPIN! SKIP!",
          "words": [
            "spin",
            "skip"
          ]
        }
      ],
      "recapKo": "SPIN과 SKIP을 만들었어요! 챕터 20 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "spin",
          "skip"
        ]
      }
    }
  ]
}
