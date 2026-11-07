// Chapter 17 -- consonant blend chapter (world 3, no new phonemes:
// Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이 챕터가
// 가르치는 것은 이미 배운 낱글자 소리 두 개를 이어 말하는 것뿐이다 --
// SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: 토이스토리 계열(art/toys.js), 2회차 재사용
// 블렌드: CL(cloud) / GL(glue)
// 보스 단어: CLAP(C+L+A+P) / GLUE(G+L+UE, UE는 이전 다이그래프 재사용)
// 아이콘: cloud/glue 둘 다 icons.js 재고에 있다(신규 아이콘 불필요).
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
export const chapter17 = {
  "id": "chapter-17",
  "order": 17,
  "title": "Toybox Uprising: Blend Squad",
  "stages": [
    {
      "id": "c17-stage-1",
      "order": 1,
      "title": "C and L Together",
      "villain": {
        "name": "Wobblina",
        "art": "wobblina-c17",
        "style": "toy-wobbly"
      },
      "hero": {
        "name": "Rook",
        "art": "rook-c17",
        "style": "toy-soldier"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c17s1-teach-296",
          "kind": "teach",
          "instructionKo": "히어로가 C와 L 소리를 나란히 들려줘요! 잘 들어보세요.",
          "art": "hero",
          "repeatAudio": [
            "kuh"
          ]
        },
        {
          "id": "c17s1-r1-297",
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
          "id": "c17s1-break-298",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c17s1-blend-299",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "C랑 L 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "C",
              "say": "kuh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            "cloud"
          ]
        },
        {
          "id": "c17s1-r2-300",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"coin\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c17s1-o2-303",
              "icon": "coin",
              "label": "coin",
              "correct": true
            },
            {
              "id": "c17s1-o0-301",
              "icon": "elephant",
              "label": "elephant",
              "correct": false
            },
            {
              "id": "c17s1-o1-302",
              "icon": "horse",
              "label": "horse",
              "correct": false
            },
            {
              "id": "c17s1-o3-304",
              "icon": "rain",
              "label": "rain",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "coin"
          }
        },
        {
          "id": "c17s1-r3-305",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"lion\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "lll",
          "options": [
            {
              "id": "c17s1-o0-306",
              "icon": "map",
              "label": "map",
              "correct": false
            },
            {
              "id": "c17s1-o1-307",
              "icon": "dog",
              "label": "dog",
              "correct": false
            },
            {
              "id": "c17s1-o2-308",
              "icon": "gum",
              "label": "gum",
              "correct": false
            },
            {
              "id": "c17s1-o3-309",
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
          "id": "c17s1-r4-310",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "cloud처럼 C랑 L 소리가 이어지는 그림을 찾아보세요!",
          "promptAudio": "cloud",
          "options": [
            {
              "id": "c17s1-p0-311",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            },
            {
              "id": "c17s1-p1-312",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            },
            {
              "id": "c17s1-p2-313",
              "icon": "cloud",
              "label": "cloud",
              "correct": true
            },
            {
              "id": "c17s1-p3-314",
              "icon": "leg",
              "label": "leg",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "cloud"
          }
        },
        {
          "id": "c17s1-r5-315",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "coin",
            "lion"
          ]
        },
        {
          "id": "c17s1-finale-316",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "cloud"
          ]
        }
      ],
      "recapKo": "C와 L 소리를 이어봤어요! cloud처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "cloud"
        ]
      }
    },
    {
      "id": "c17-stage-2",
      "order": 2,
      "title": "Power of CL",
      "villain": {
        "name": "Tanglewire",
        "art": "tanglewire-c17",
        "style": "toy-tangly"
      },
      "hero": {
        "name": "Rook",
        "art": "rook-c17",
        "style": "toy-soldier"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c17s2-r1-warmup-317",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c17s2-w0-318",
              "icon": "letterTile",
              "label": "F",
              "say": "fff",
              "correct": false
            },
            {
              "id": "c17s2-w1-319",
              "icon": "letterTile",
              "label": "C",
              "say": "kuh",
              "correct": true
            },
            {
              "id": "c17s2-w2-320",
              "icon": "letterTile",
              "label": "B",
              "say": "buh",
              "correct": false
            }
          ]
        },
        {
          "id": "c17s2-r2-321",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"aim\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "a",
          "options": [
            {
              "id": "c17s2-a0-322",
              "icon": "aim",
              "label": "aim",
              "correct": true
            },
            {
              "id": "c17s2-a1-323",
              "icon": "jam",
              "label": "jam",
              "correct": false
            },
            {
              "id": "c17s2-a2-324",
              "icon": "coat",
              "label": "coat",
              "correct": false
            },
            {
              "id": "c17s2-a3-325",
              "icon": "pie",
              "label": "pie",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "aim"
          }
        },
        {
          "id": "c17s2-r3-trace-326",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 L을 따라 그리면서 소리를 내보세요!",
          "words": [
            {
              "text": "L",
              "say": "lll"
            }
          ]
        },
        {
          "id": "c17s2-break-327",
          "kind": "break",
          "instructionKo": "C랑 L을 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c17s2-r4-multiselect-328",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/b/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c17s2-m0-329",
              "icon": "ball",
              "label": "ball",
              "correct": true
            },
            {
              "id": "c17s2-m1-330",
              "icon": "box",
              "label": "box",
              "correct": true
            },
            {
              "id": "c17s2-m2-331",
              "icon": "bed",
              "label": "bed",
              "correct": true
            },
            {
              "id": "c17s2-m3-332",
              "icon": "kite",
              "label": "kite",
              "correct": false
            },
            {
              "id": "c17s2-m4-333",
              "icon": "fork",
              "label": "fork",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "ball"
          }
        },
        {
          "id": "c17s2-r5-hard-339",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "lll",
          "options": [
            {
              "id": "c17s2-h0-335",
              "icon": "letterTile",
              "label": "Z",
              "say": "zze",
              "correct": false
            },
            {
              "id": "c17s2-h-correct-334",
              "icon": "letterTile",
              "label": "L",
              "say": "lll",
              "correct": true
            },
            {
              "id": "c17s2-h1-336",
              "icon": "letterTile",
              "label": "W",
              "say": "weh",
              "correct": false
            },
            {
              "id": "c17s2-h2-337",
              "icon": "letterTile",
              "label": "NG",
              "say": "ngh",
              "correct": false
            },
            {
              "id": "c17s2-h3-338",
              "icon": "letterTile",
              "label": "V",
              "say": "vve",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "L",
            "say": "lll"
          }
        },
        {
          "id": "c17s2-r6-reversed-340",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "Y",
          "options": [
            {
              "id": "c17s2-v0-341",
              "icon": "chips",
              "label": "chips",
              "correct": false
            },
            {
              "id": "c17s2-v1-342",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": true
            },
            {
              "id": "c17s2-v2-343",
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
          "id": "c17s2-r7-listenrepeat-344",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "cloud",
            "aim"
          ]
        },
        {
          "id": "c17s2-finale-345",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "L",
              "say": "lll"
            },
            "cloud"
          ]
        }
      ],
      "recapKo": "C+L = CLOUD! 소리를 잘 익혔어요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "cloud"
        ]
      }
    },
    {
      "id": "c17-stage-3",
      "order": 3,
      "title": "G and L Together",
      "villain": {
        "name": "Boxel",
        "art": "boxel-c17",
        "style": "toy-boxxy"
      },
      "hero": {
        "name": "Snuggles",
        "art": "snuggles-c17",
        "style": "toy-plush"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c17s3-teach-346",
          "kind": "teach",
          "instructionKo": "히어로가 G와 L 소리를 나란히 들려줘요! 잘 들어보세요.",
          "art": "hero",
          "repeatAudio": [
            "guh"
          ]
        },
        {
          "id": "c17s3-r1-347",
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
          "id": "c17s3-break-348",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c17s3-blend-349",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "G랑 L 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "G",
              "say": "guh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            "glue"
          ]
        },
        {
          "id": "c17s3-r2-350",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"gum\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "guh",
          "options": [
            {
              "id": "c17s3-o0-351",
              "icon": "thumb",
              "label": "thumb",
              "correct": false
            },
            {
              "id": "c17s3-o2-353",
              "icon": "gum",
              "label": "gum",
              "correct": true
            },
            {
              "id": "c17s3-o1-352",
              "icon": "queen",
              "label": "queen",
              "correct": false
            },
            {
              "id": "c17s3-o3-353b",
              "icon": "kite",
              "label": "kite",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "gum"
          }
        },
        {
          "id": "c17s3-r3-354",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"lion\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "lll",
          "options": [
            {
              "id": "c17s3-o1-356",
              "icon": "lion",
              "label": "lion",
              "correct": true
            },
            {
              "id": "c17s3-o0-355",
              "icon": "coin",
              "label": "coin",
              "correct": false
            },
            {
              "id": "c17s3-o2-356b",
              "icon": "nose",
              "label": "nose",
              "correct": false
            },
            {
              "id": "c17s3-o3-356c",
              "icon": "door",
              "label": "door",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "lion"
          }
        },
        {
          "id": "c17s3-r4-357",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "glue처럼 G랑 L 소리가 이어지는 그림을 찾아보세요!",
          "promptAudio": "glue",
          "options": [
            {
              "id": "c17s3-p0-358",
              "icon": "sun",
              "label": "sun",
              "correct": false
            },
            {
              "id": "c17s3-p2-360",
              "icon": "glue",
              "label": "glue",
              "correct": true
            },
            {
              "id": "c17s3-p1-359",
              "icon": "apple",
              "label": "apple",
              "correct": false
            },
            {
              "id": "c17s3-p3-360b",
              "icon": "rain",
              "label": "rain",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "glue"
          }
        },
        {
          "id": "c17s3-r5-361",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "gum",
            "lion"
          ]
        },
        {
          "id": "c17s3-finale-362",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "glue"
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
      "recapKo": "G와 L 소리를 이어봤어요! glue처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "glue"
        ]
      }
    },
    {
      "id": "c17-stage-4",
      "order": 4,
      "title": "Power of GL",
      "villain": {
        "name": "Tumbleton",
        "art": "tumbleton-c17",
        "style": "toy-tumbles"
      },
      "hero": {
        "name": "Stax",
        "art": "stax-c17",
        "style": "toy-block"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c17s4-r1-warmup-363",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "guh",
          "options": [
            {
              "id": "c17s4-w0-364",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c17s4-w1-365",
              "icon": "letterTile",
              "label": "G",
              "say": "guh",
              "correct": true
            },
            {
              "id": "c17s4-w2-366",
              "icon": "letterTile",
              "label": "I",
              "say": "ihh",
              "correct": false
            }
          ]
        },
        {
          "id": "c17s4-r2-367",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"pie\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "puh",
          "options": [
            {
              "id": "c17s4-a0-368",
              "icon": "nose",
              "label": "nose",
              "correct": false
            },
            {
              "id": "c17s4-a1-369",
              "icon": "key",
              "label": "key",
              "correct": false
            },
            {
              "id": "c17s4-a2-370",
              "icon": "pie",
              "label": "pie",
              "correct": true
            },
            {
              "id": "c17s4-a3-371",
              "icon": "egg",
              "label": "egg",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "pie"
          }
        },
        {
          "id": "c17s4-r3-trace-372",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 L을 따라 그리면서 소리를 내보세요!",
          "words": [
            {
              "text": "L",
              "say": "lll"
            }
          ]
        },
        {
          "id": "c17s4-break-373",
          "kind": "break",
          "instructionKo": "G랑 L을 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "lll"
          ]
        },
        {
          "id": "c17s4-r4-multiselect-374",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/b/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c17s4-m0-375",
              "icon": "ball",
              "label": "ball",
              "correct": true
            },
            {
              "id": "c17s4-m1-376",
              "icon": "box",
              "label": "box",
              "correct": true
            },
            {
              "id": "c17s4-m2-377",
              "icon": "bed",
              "label": "bed",
              "correct": true
            },
            {
              "id": "c17s4-m3-378",
              "icon": "hen",
              "label": "hen",
              "correct": false
            },
            {
              "id": "c17s4-m4-379",
              "icon": "rat",
              "label": "rat",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "ball"
          }
        },
        {
          "id": "c17s4-r5-hard-385",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "lll",
          "options": [
            {
              "id": "c17s4-h0-381",
              "icon": "letterTile",
              "label": "M",
              "say": "mmm",
              "correct": false
            },
            {
              "id": "c17s4-h1-382",
              "icon": "letterTile",
              "label": "D",
              "say": "duh",
              "correct": false
            },
            {
              "id": "c17s4-h2-383",
              "icon": "letterTile",
              "label": "G",
              "say": "guh",
              "correct": false
            },
            {
              "id": "c17s4-h-correct-380",
              "icon": "letterTile",
              "label": "L",
              "say": "lll",
              "correct": true
            },
            {
              "id": "c17s4-h3-384",
              "icon": "letterTile",
              "label": "O",
              "say": "awh",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "L",
            "say": "lll"
          }
        },
        {
          "id": "c17s4-r6-reversed-386",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "U",
          "options": [
            {
              "id": "c17s4-v0-387",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": true
            },
            {
              "id": "c17s4-v1-388",
              "icon": "leg",
              "label": "leg",
              "correct": false
            },
            {
              "id": "c17s4-v2-389",
              "icon": "feet",
              "label": "feet",
              "correct": false
            },
            {
              "id": "c17s4-v3-390",
              "icon": "bed",
              "label": "bed",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "umbrella"
          }
        },
        {
          "id": "c17s4-r7-listenrepeat-391",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "glue",
            "pie"
          ]
        },
        {
          "id": "c17s4-r8-cycle-412",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "guh",
              "options": [
                {
                  "id": "c17s4-q0-0-392",
                  "icon": "letterTile",
                  "label": "AI",
                  "say": "a",
                  "correct": false
                },
                {
                  "id": "c17s4-q0-1-393",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": true
                },
                {
                  "id": "c17s4-q0-2-394",
                  "icon": "letterTile",
                  "label": "J",
                  "say": "juh",
                  "correct": false
                },
                {
                  "id": "c17s4-q0-3-395",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "lll",
              "options": [
                {
                  "id": "c17s4-q1-0-396",
                  "icon": "letterTile",
                  "label": "IE",
                  "say": "eye",
                  "correct": false
                },
                {
                  "id": "c17s4-q1-1-397",
                  "icon": "letterTile",
                  "label": "EE",
                  "say": "ee",
                  "correct": false
                },
                {
                  "id": "c17s4-q1-2-398",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": true
                },
                {
                  "id": "c17s4-q1-3-399",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "puh",
              "options": [
                {
                  "id": "c17s4-q2-0-400",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": false
                },
                {
                  "id": "c17s4-q2-1-401",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c17s4-q2-2-402",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": false
                },
                {
                  "id": "c17s4-q2-3-403",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c17s4-q3-0-404",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                },
                {
                  "id": "c17s4-q3-1-405",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": false
                },
                {
                  "id": "c17s4-q3-2-406",
                  "icon": "letterTile",
                  "label": "Y",
                  "say": "yyuh",
                  "correct": false
                },
                {
                  "id": "c17s4-q3-3-407",
                  "icon": "letterTile",
                  "label": "X",
                  "say": "ksuh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "duh",
              "options": [
                {
                  "id": "c17s4-q4-0-408",
                  "icon": "letterTile",
                  "label": "CH",
                  "say": "ch",
                  "correct": false
                },
                {
                  "id": "c17s4-q4-1-409",
                  "icon": "letterTile",
                  "label": "D",
                  "say": "duh",
                  "correct": true
                },
                {
                  "id": "c17s4-q4-2-410",
                  "icon": "letterTile",
                  "label": "SH",
                  "say": "shhu",
                  "correct": false
                },
                {
                  "id": "c17s4-q4-3-411",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c17s4-finale-413",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "L",
              "say": "lll"
            },
            "glue"
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
      "recapKo": "G+L = GLUE! 이제 두 블렌드를 모두 알아요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "glue"
        ]
      }
    },
    {
      "id": "c17-stage-5",
      "order": 5,
      "title": "Boss: CLAP and GLUE!",
      "villain": {
        "name": "Windup King",
        "art": "windup-king-c17",
        "style": "toy-wind-down"
      },
      "hero": {
        "name": "BigTop",
        "art": "bigtop-c17",
        "style": "toy-boss"
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
          "id": "c17s5-teach-414",
          "kind": "teach",
          "instructionKo": "히어로가 합체해요! 먼저 clap을 만들어요.",
          "repeatAudio": [
            "kuh",
            "lll",
            "aaa",
            "puh",
            "clap"
          ]
        },
        {
          "id": "c17s5-r1-warmup-415",
          "kind": "drag-build",
          "scored": false,
          "instructionKo": "글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)",
          "letters": [
            {
              "text": "C",
              "say": "kuh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "P",
              "say": "puh"
            }
          ],
          "target": [
            "C",
            "L",
            "A",
            "P"
          ]
        },
        {
          "id": "c17s5-r2-416",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "천천히 따라 말해보세요.",
          "words": [
            {
              "text": "C",
              "say": "kuh"
            },
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "P",
              "say": "puh"
            },
            "clap"
          ]
        },
        {
          "id": "c17s5-break-417",
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
          "id": "c17s5-r3-quickfire-434",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "kuh",
              "options": [
                {
                  "id": "c17s5-bq0-0-418",
                  "icon": "letterTile",
                  "label": "QU",
                  "say": "kw",
                  "correct": false
                },
                {
                  "id": "c17s5-bq0-1-419",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                },
                {
                  "id": "c17s5-bq0-2-420",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": true
                },
                {
                  "id": "c17s5-bq0-3-421",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "lll",
              "options": [
                {
                  "id": "c17s5-bq1-0-422",
                  "icon": "letterTile",
                  "label": "UE",
                  "say": "u",
                  "correct": false
                },
                {
                  "id": "c17s5-bq1-1-423",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": false
                },
                {
                  "id": "c17s5-bq1-2-424",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                },
                {
                  "id": "c17s5-bq1-3-425",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "aaa",
              "options": [
                {
                  "id": "c17s5-bq2-0-426",
                  "icon": "letterTile",
                  "label": "A",
                  "say": "aaa",
                  "correct": true
                },
                {
                  "id": "c17s5-bq2-1-427",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c17s5-bq2-2-428",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c17s5-bq2-3-429",
                  "icon": "letterTile",
                  "label": "I",
                  "say": "ihh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "puh",
              "options": [
                {
                  "id": "c17s5-bq3-0-430",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                },
                {
                  "id": "c17s5-bq3-1-431",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": true
                },
                {
                  "id": "c17s5-bq3-2-432",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c17s5-bq3-3-433",
                  "icon": "letterTile",
                  "label": "E",
                  "say": "eh",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c17s5-r4-435",
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
              "text": "A",
              "say": "aaa"
            },
            {
              "text": "P",
              "say": "puh"
            },
            {
              "text": "C",
              "say": "kuh"
            }
          ],
          "target": [
            "C",
            "L",
            "A",
            "P"
          ],
          "readAloud": {
            "targetText": "clap"
          }
        },
        {
          "id": "c17s5-r5-wordspot-436",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c17s5-ws0-437",
              "icon": "letterTile",
              "label": "PALC",
              "correct": false
            },
            {
              "id": "c17s5-ws1-438",
              "icon": "letterTile",
              "label": "CLAP",
              "correct": true
            },
            {
              "id": "c17s5-ws2-439",
              "icon": "letterTile",
              "label": "PCLA",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "clap"
          }
        },
        {
          "id": "c17s5-r6-440",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 glue를 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "UE",
              "say": "u"
            },
            {
              "text": "G",
              "say": "guh"
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
          "id": "c17s5-r7-bonus-441",
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
          "id": "c17s5-finale-442",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! CLAP! GLUE!",
          "words": [
            "clap",
            "glue"
          ]
        }
      ],
      "recapKo": "CLAP과 GLUE를 만들었어요! 챕터 17 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "clap",
          "glue"
        ]
      }
    }
  ]
}
