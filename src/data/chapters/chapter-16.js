// Chapter 16 -- consonant blend chapter (world 3, no new phonemes:
// Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이 챕터가
// 가르치는 것은 이미 배운 낱글자 소리 두 개를 이어 말하는 것뿐이다 --
// SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: DC 히어로 계열(art.js dc-*), 2회차 재사용
// 블렌드: TR(train) / FR(fries)
// 보스 단어: TRAP(T+R+A+P) / FROG(F+R+O+G)
// 아이콘: train/fries 둘 다 icons.js 재고에 있다(신규 아이콘 불필요). tree도 TR 재고로 대체 가능.
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
export const chapter16 = {
  "id": "chapter-16",
  "order": 16,
  "title": "Night City: Blend Signal",
  "stages": [
    {
      "id": "c16-stage-1",
      "order": 1,
      "title": "T and R Together",
      "villain": {
        "name": "Smogface",
        "art": "smogface-c16",
        "style": "dc-blackout"
      },
      "hero": {
        "name": "Sparkline",
        "art": "sparkline-c16",
        "style": "dc-ray"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c16s1-teach-149",
          "kind": "teach",
          "instructionKo": "히어로가 T와 R 소리를 나란히 들려줘요! 잘 들어보세요.",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c16s1-r1-150",
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
          "id": "c16s1-break-151",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "rrr"
          ]
        },
        {
          "id": "c16s1-blend-152",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "T랑 R 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "R",
              "say": "rrr"
            },
            "train"
          ]
        },
        {
          "id": "c16s1-r2-153",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"ten\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c16s1-o0-154",
              "icon": "pot",
              "label": "pot",
              "correct": false
            },
            {
              "id": "c16s1-o1-155",
              "icon": "ten",
              "label": "ten",
              "correct": true
            },
            {
              "id": "c16s1-o2-156",
              "icon": "net",
              "label": "net",
              "correct": false
            },
            {
              "id": "c16s1-o3-157",
              "icon": "cake",
              "label": "cake",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "ten"
          }
        },
        {
          "id": "c16s1-r3-158",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"ring\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c16s1-o0-159",
              "icon": "elephant",
              "label": "elephant",
              "correct": false
            },
            {
              "id": "c16s1-o1-160",
              "icon": "hat",
              "label": "hat",
              "correct": false
            },
            {
              "id": "c16s1-o2-161",
              "icon": "ring",
              "label": "ring",
              "correct": true
            },
            {
              "id": "c16s1-o3-162",
              "icon": "mat",
              "label": "mat",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "ring"
          }
        },
        {
          "id": "c16s1-r4-163",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "train처럼 T랑 R 소리가 이어지는 그림을 찾아보세요!",
          "promptAudio": "train",
          "options": [
            {
              "id": "c16s1-p0-164",
              "icon": "duck",
              "label": "duck",
              "correct": false
            },
            {
              "id": "c16s1-p1-165",
              "icon": "train",
              "label": "train",
              "correct": true
            },
            {
              "id": "c16s1-p2-166",
              "icon": "gum",
              "label": "gum",
              "correct": false
            },
            {
              "id": "c16s1-p3-167",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "train"
          }
        },
        {
          "id": "c16s1-r5-168",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "ten",
            "ring"
          ]
        },
        {
          "id": "c16s1-finale-169",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "train"
          ]
        }
      ],
      "recapKo": "T와 R 소리를 이어봤어요! train처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "train"
        ]
      }
    },
    {
      "id": "c16-stage-2",
      "order": 2,
      "title": "Power of TR",
      "villain": {
        "name": "Mirrorfall",
        "art": "mirrorfall-c16",
        "style": "dc-mirage"
      },
      "hero": {
        "name": "Sparkline",
        "art": "sparkline-c16",
        "style": "dc-ray"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c16s2-r1-warmup-170",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c16s2-w0-171",
              "icon": "letterTile",
              "label": "U",
              "say": "uh",
              "correct": false
            },
            {
              "id": "c16s2-w1-172",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": true
            },
            {
              "id": "c16s2-w2-173",
              "icon": "letterTile",
              "label": "L",
              "say": "lll",
              "correct": false
            }
          ]
        },
        {
          "id": "c16s2-r2-174",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"fan\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "fff",
          "options": [
            {
              "id": "c16s2-a0-175",
              "icon": "box",
              "label": "box",
              "correct": false
            },
            {
              "id": "c16s2-a1-176",
              "icon": "rain",
              "label": "rain",
              "correct": false
            },
            {
              "id": "c16s2-a2-177",
              "icon": "jug",
              "label": "jug",
              "correct": false
            },
            {
              "id": "c16s2-a3-178",
              "icon": "fan",
              "label": "fan",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "fan"
          }
        },
        {
          "id": "c16s2-r3-trace-179",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 R을 따라 그리면서 소리를 내보세요!",
          "words": [
            {
              "text": "R",
              "say": "rrr"
            }
          ]
        },
        {
          "id": "c16s2-break-180",
          "kind": "break",
          "instructionKo": "T랑 R을 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "rrr"
          ]
        },
        {
          "id": "c16s2-r4-multiselect-181",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/p/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c16s2-m0-182",
              "icon": "pig",
              "label": "pig",
              "correct": true
            },
            {
              "id": "c16s2-m1-183",
              "icon": "pen",
              "label": "pen",
              "correct": true
            },
            {
              "id": "c16s2-m2-184",
              "icon": "pot",
              "label": "pot",
              "correct": true
            },
            {
              "id": "c16s2-m3-185",
              "icon": "boat",
              "label": "boat",
              "correct": false
            },
            {
              "id": "c16s2-m4-186",
              "icon": "tie",
              "label": "tie",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "pig"
          }
        },
        {
          "id": "c16s2-r5-hard-192",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c16s2-h-correct-187",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": true
            },
            {
              "id": "c16s2-h0-188",
              "icon": "letterTile",
              "label": "EE",
              "say": "ee",
              "correct": false
            },
            {
              "id": "c16s2-h1-189",
              "icon": "letterTile",
              "label": "OR",
              "say": "or",
              "correct": false
            },
            {
              "id": "c16s2-h2-190",
              "icon": "letterTile",
              "label": "Z",
              "say": "zze",
              "correct": false
            },
            {
              "id": "c16s2-h3-191",
              "icon": "letterTile",
              "label": "W",
              "say": "weh",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "R",
            "say": "rrr"
          }
        },
        {
          "id": "c16s2-r6-reversed-193",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "NG",
          "options": [
            {
              "id": "c16s2-v0-194",
              "icon": "ring",
              "label": "ring",
              "correct": true
            },
            {
              "id": "c16s2-v1-195",
              "icon": "van",
              "label": "van",
              "correct": false
            },
            {
              "id": "c16s2-v2-196",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": false
            },
            {
              "id": "c16s2-v3-196b",
              "icon": "hat",
              "label": "hat",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "ring"
          }
        },
        {
          "id": "c16s2-r7-listenrepeat-197",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "train",
            "fan"
          ]
        },
        {
          "id": "c16s2-finale-198",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "R",
              "say": "rrr"
            },
            "train"
          ]
        }
      ],
      "recapKo": "T+R = TRAIN! 소리를 잘 익혔어요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "train"
        ]
      }
    },
    {
      "id": "c16-stage-3",
      "order": 3,
      "title": "F and R Together",
      "villain": {
        "name": "Trafficjam",
        "art": "trafficjam-c16",
        "style": "dc-gridlock"
      },
      "hero": {
        "name": "Vantage",
        "art": "vantage-c16",
        "style": "dc-jett"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c16s3-teach-199",
          "kind": "teach",
          "instructionKo": "히어로가 F와 R 소리를 나란히 들려줘요! 잘 들어보세요.",
          "art": "hero",
          "repeatAudio": [
            "fff"
          ]
        },
        {
          "id": "c16s3-r1-200",
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
          "id": "c16s3-break-201",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "rrr"
          ]
        },
        {
          "id": "c16s3-blend-202",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "F랑 R 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "F",
              "say": "fff"
            },
            {
              "text": "R",
              "say": "rrr"
            },
            "fries"
          ]
        },
        {
          "id": "c16s3-r2-203",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"fox\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "fff",
          "options": [
            {
              "id": "c16s3-o0-204",
              "icon": "chips",
              "label": "chips",
              "correct": false
            },
            {
              "id": "c16s3-o1-205",
              "icon": "shoe",
              "label": "shoe",
              "correct": false
            },
            {
              "id": "c16s3-o2-206",
              "icon": "thumb",
              "label": "thumb",
              "correct": false
            },
            {
              "id": "c16s3-o3-207",
              "icon": "fox",
              "label": "fox",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "fox"
          }
        },
        {
          "id": "c16s3-r3-208",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"rubber\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c16s3-o0-209",
              "icon": "queen",
              "label": "queen",
              "correct": false
            },
            {
              "id": "c16s3-o1-210",
              "icon": "coin",
              "label": "coin",
              "correct": false
            },
            {
              "id": "c16s3-o2-211",
              "icon": "rubber",
              "label": "rubber",
              "correct": true
            },
            {
              "id": "c16s3-o3-211b",
              "icon": "leg",
              "label": "leg",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "rubber"
          }
        },
        {
          "id": "c16s3-r4-212",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "fries처럼 F랑 R 소리가 이어지는 그림을 찾아보세요!",
          "promptAudio": "fries",
          "options": [
            {
              "id": "c16s3-p0-213",
              "icon": "fries",
              "label": "fries",
              "correct": true
            },
            {
              "id": "c16s3-p1-213b",
              "icon": "gift",
              "label": "gift",
              "correct": false
            },
            {
              "id": "c16s3-p2-213c",
              "icon": "kite",
              "label": "kite",
              "correct": false
            },
            {
              "id": "c16s3-p3-213d",
              "icon": "hand",
              "label": "hand",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "fries"
          }
        },
        {
          "id": "c16s3-r5-214",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "fox",
            "rubber"
          ]
        },
        {
          "id": "c16s3-finale-215",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "fries"
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
      "recapKo": "F와 R 소리를 이어봤어요! fries처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "fries"
        ]
      }
    },
    {
      "id": "c16-stage-4",
      "order": 4,
      "title": "Power of FR",
      "villain": {
        "name": "Glareout",
        "art": "glareout-c16",
        "style": "dc-floodlight"
      },
      "hero": {
        "name": "Nightveil",
        "art": "nightveil-c16",
        "style": "dc-cloak"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c16s4-r1-warmup-216",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "fff",
          "options": [
            {
              "id": "c16s4-w0-217",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c16s4-w1-218",
              "icon": "letterTile",
              "label": "F",
              "say": "fff",
              "correct": true
            },
            {
              "id": "c16s4-w2-219",
              "icon": "letterTile",
              "label": "A",
              "say": "aaa",
              "correct": false
            }
          ]
        },
        {
          "id": "c16s4-r2-220",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"tie\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c16s4-a0-221",
              "icon": "igloo",
              "label": "igloo",
              "correct": false
            },
            {
              "id": "c16s4-a1-222",
              "icon": "tie",
              "label": "tie",
              "correct": true
            },
            {
              "id": "c16s4-a2-223",
              "icon": "pin",
              "label": "pin",
              "correct": false
            },
            {
              "id": "c16s4-a3-224",
              "icon": "nut",
              "label": "nut",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "tie"
          }
        },
        {
          "id": "c16s4-r3-trace-225",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 R을 따라 그리면서 소리를 내보세요!",
          "words": [
            {
              "text": "R",
              "say": "rrr"
            }
          ]
        },
        {
          "id": "c16s4-break-226",
          "kind": "break",
          "instructionKo": "F랑 R을 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "rrr"
          ]
        },
        {
          "id": "c16s4-r4-multiselect-227",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/n/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c16s4-m0-228",
              "icon": "net",
              "label": "net",
              "correct": true
            },
            {
              "id": "c16s4-m1-229",
              "icon": "nut",
              "label": "nut",
              "correct": true
            },
            {
              "id": "c16s4-m2-230",
              "icon": "nose",
              "label": "nose",
              "correct": true
            },
            {
              "id": "c16s4-m3-231",
              "icon": "corn",
              "label": "corn",
              "correct": false
            },
            {
              "id": "c16s4-m4-232",
              "icon": "egg",
              "label": "egg",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "net"
          }
        },
        {
          "id": "c16s4-r5-hard-238",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c16s4-h0-234",
              "icon": "letterTile",
              "label": "H",
              "say": "huh",
              "correct": false
            },
            {
              "id": "c16s4-h1-235",
              "icon": "letterTile",
              "label": "M",
              "say": "mmm",
              "correct": false
            },
            {
              "id": "c16s4-h-correct-233",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": true
            },
            {
              "id": "c16s4-h2-236",
              "icon": "letterTile",
              "label": "D",
              "say": "duh",
              "correct": false
            },
            {
              "id": "c16s4-h3-237",
              "icon": "letterTile",
              "label": "G",
              "say": "guh",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "R",
            "say": "rrr"
          }
        },
        {
          "id": "c16s4-r6-reversed-239",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "O",
          "options": [
            {
              "id": "c16s4-v0-240",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            },
            {
              "id": "c16s4-v1-241",
              "icon": "leg",
              "label": "leg",
              "correct": false
            },
            {
              "id": "c16s4-v2-242",
              "icon": "fork",
              "label": "fork",
              "correct": false
            },
            {
              "id": "c16s4-v3-243",
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
          "id": "c16s4-r7-listenrepeat-244",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "fries",
            "tie"
          ]
        },
        {
          "id": "c16s4-r8-cycle-265",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "fff",
              "options": [
                {
                  "id": "c16s4-q0-0-245",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                },
                {
                  "id": "c16s4-q0-1-246",
                  "icon": "letterTile",
                  "label": "B",
                  "say": "buh",
                  "correct": false
                },
                {
                  "id": "c16s4-q0-2-247",
                  "icon": "letterTile",
                  "label": "AI",
                  "say": "a",
                  "correct": false
                },
                {
                  "id": "c16s4-q0-3-248",
                  "icon": "letterTile",
                  "label": "J",
                  "say": "juh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "rrr",
              "options": [
                {
                  "id": "c16s4-q1-0-249",
                  "icon": "letterTile",
                  "label": "OA",
                  "say": "oh",
                  "correct": false
                },
                {
                  "id": "c16s4-q1-1-250",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                },
                {
                  "id": "c16s4-q1-2-251",
                  "icon": "letterTile",
                  "label": "IE",
                  "say": "eye",
                  "correct": false
                },
                {
                  "id": "c16s4-q1-3-252",
                  "icon": "letterTile",
                  "label": "EE",
                  "say": "ee",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "buh",
              "options": [
                {
                  "id": "c16s4-q2-0-253",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": false
                },
                {
                  "id": "c16s4-q2-1-254",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": false
                },
                {
                  "id": "c16s4-q2-2-255",
                  "icon": "letterTile",
                  "label": "B",
                  "say": "buh",
                  "correct": true
                },
                {
                  "id": "c16s4-q2-3-256",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "huh",
              "options": [
                {
                  "id": "c16s4-q3-0-257",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": false
                },
                {
                  "id": "c16s4-q3-1-258",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": false
                },
                {
                  "id": "c16s4-q3-2-259",
                  "icon": "letterTile",
                  "label": "Y",
                  "say": "yyuh",
                  "correct": false
                },
                {
                  "id": "c16s4-q3-3-260",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "lll",
              "options": [
                {
                  "id": "c16s4-q4-0-261",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": true
                },
                {
                  "id": "c16s4-q4-1-262",
                  "icon": "letterTile",
                  "label": "X",
                  "say": "ksuh",
                  "correct": false
                },
                {
                  "id": "c16s4-q4-2-263",
                  "icon": "letterTile",
                  "label": "CH",
                  "say": "ch",
                  "correct": false
                },
                {
                  "id": "c16s4-q4-3-264",
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
          "id": "c16s4-finale-266",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "R",
              "say": "rrr"
            },
            "fries"
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
      "recapKo": "F+R = FRIES! 이제 두 블렌드를 모두 알아요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "fries"
        ]
      }
    },
    {
      "id": "c16-stage-5",
      "order": 5,
      "title": "Boss: TRAP and FROG!",
      "villain": {
        "name": "Duskfall",
        "art": "duskfall-c16",
        "style": "dc-nightfall"
      },
      "hero": {
        "name": "Ironclad",
        "art": "ironclad-c16",
        "style": "dc-boss"
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
          "id": "c16s5-teach-267",
          "kind": "teach",
          "instructionKo": "히어로가 합체해요! 먼저 trap을 만들어요.",
          "repeatAudio": [
            "tuh",
            "rrr",
            "aaa",
            "puh",
            "trap"
          ]
        },
        {
          "id": "c16s5-r1-warmup-268",
          "kind": "drag-build",
          "scored": false,
          "instructionKo": "글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)",
          "letters": [
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
            }
          ],
          "target": [
            "T",
            "R",
            "A",
            "P"
          ]
        },
        {
          "id": "c16s5-r2-269",
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
            "trap"
          ]
        },
        {
          "id": "c16s5-break-270",
          "kind": "break",
          "instructionKo": "이번엔 frog가에요! 함께 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "fff",
            "rrr",
            "awh",
            "guh",
            "frog"
          ]
        },
        {
          "id": "c16s5-r3-quickfire-287",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "tuh",
              "options": [
                {
                  "id": "c16s5-bq0-0-271",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c16s5-bq0-1-272",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                },
                {
                  "id": "c16s5-bq0-2-273",
                  "icon": "letterTile",
                  "label": "QU",
                  "say": "kw",
                  "correct": false
                },
                {
                  "id": "c16s5-bq0-3-274",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "rrr",
              "options": [
                {
                  "id": "c16s5-bq1-0-275",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": false
                },
                {
                  "id": "c16s5-bq1-1-276",
                  "icon": "letterTile",
                  "label": "UE",
                  "say": "u",
                  "correct": false
                },
                {
                  "id": "c16s5-bq1-2-277",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                },
                {
                  "id": "c16s5-bq1-3-278",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "aaa",
              "options": [
                {
                  "id": "c16s5-bq2-0-279",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                },
                {
                  "id": "c16s5-bq2-1-280",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c16s5-bq2-2-281",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c16s5-bq2-3-282",
                  "icon": "letterTile",
                  "label": "A",
                  "say": "aaa",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "puh",
              "options": [
                {
                  "id": "c16s5-bq3-0-283",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": true
                },
                {
                  "id": "c16s5-bq3-1-284",
                  "icon": "letterTile",
                  "label": "I",
                  "say": "ihh",
                  "correct": false
                },
                {
                  "id": "c16s5-bq3-2-285",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                },
                {
                  "id": "c16s5-bq3-3-286",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c16s5-r4-288",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
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
              "text": "T",
              "say": "tuh"
            }
          ],
          "target": [
            "T",
            "R",
            "A",
            "P"
          ],
          "readAloud": {
            "targetText": "trap"
          }
        },
        {
          "id": "c16s5-r5-wordspot-289",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c16s5-ws0-290",
              "icon": "letterTile",
              "label": "PRTA",
              "correct": false
            },
            {
              "id": "c16s5-ws1-291",
              "icon": "letterTile",
              "label": "TRAP",
              "correct": true
            },
            {
              "id": "c16s5-ws2-292",
              "icon": "letterTile",
              "label": "PTRA",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "trap"
          }
        },
        {
          "id": "c16s5-r6-293",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 frog를 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "O",
              "say": "awh"
            },
            {
              "text": "G",
              "say": "guh"
            },
            {
              "text": "F",
              "say": "fff"
            }
          ],
          "target": [
            "F",
            "R",
            "O",
            "G"
          ],
          "readAloud": {
            "targetText": "frog"
          }
        },
        {
          "id": "c16s5-r7-bonus-294",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "frog도 천천히 따라 말해보세요.",
          "words": [
            {
              "text": "F",
              "say": "fff"
            },
            {
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "O",
              "say": "awh"
            },
            {
              "text": "G",
              "say": "guh"
            },
            "frog"
          ]
        },
        {
          "id": "c16s5-finale-295",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! TRAP! FROG!",
          "words": [
            "trap",
            "frog"
          ]
        }
      ],
      "recapKo": "TRAP과 FROG를 만들었어요! 챕터 16 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "trap",
          "frog"
        ]
      }
    }
  ]
}
