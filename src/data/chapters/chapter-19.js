// Chapter 19 -- consonant blend chapter (world 3, no new phonemes:
// Jolly Phonics Group 1-7 전체가 챕터 1-14에서 이미 끝났다). 이 챕터가
// 가르치는 것은 이미 배운 낱글자 소리 두 개를 이어 말하는 것뿐이다 --
// SOUND_TABLE에 새 표기를 추가하지 않았다(신규 오디오 에셋 불필요).
//
// 계열: 마블 히어로 계열(art.js superhero-*), 2회차 재사용
// 블렌드: NK(ink, 어말) / FT(gift, 어말)
// 보스 단어: PINK(P+I+N+K) / GIFT(G+I+F+T)
// 아이콘: ink/gift 둘 다 icons.js 재고에 있다(신규 아이콘 불필요).
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
export const chapter19 = {
  "id": "chapter-19",
  "order": 19,
  "title": "Vault City: Blend Assemble",
  "stages": [
    {
      "id": "c19-stage-1",
      "order": 1,
      "title": "N and K Together",
      "villain": {
        "name": "Mistveil",
        "art": "mistveil-c19",
        "style": "supervillain-fog"
      },
      "hero": {
        "name": "Vaultleap",
        "art": "vaultleap-c19",
        "style": "superhero-acrobat"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c19s1-teach-590",
          "kind": "teach",
          "instructionKo": "Vaultleap가 N과 K 소리를 나란히 들려줘요! 단어 끝에서 나요.",
          "art": "hero",
          "repeatAudio": [
            "nnn"
          ]
        },
        {
          "id": "c19s1-r1-591",
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
          "id": "c19s1-break-592",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "kuh"
          ]
        },
        {
          "id": "c19s1-blend-593",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "N랑 K 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "K",
              "say": "kuh"
            },
            "ink"
          ]
        },
        {
          "id": "c19s1-r2-594",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"nose\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c19s1-o0-595",
              "icon": "nose",
              "label": "nose",
              "correct": true
            },
            {
              "id": "c19s1-o1-596",
              "icon": "dog",
              "label": "dog",
              "correct": false
            },
            {
              "id": "c19s1-o2-597",
              "icon": "gum",
              "label": "gum",
              "correct": false
            },
            {
              "id": "c19s1-o3-598",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "nose"
          }
        },
        {
          "id": "c19s1-r3-599",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"cat\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c19s1-o0-600",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            },
            {
              "id": "c19s1-o1-601",
              "icon": "cat",
              "label": "cat",
              "correct": true
            },
            {
              "id": "c19s1-o2-602",
              "icon": "leg",
              "label": "leg",
              "correct": false
            },
            {
              "id": "c19s1-o3-603",
              "icon": "fan",
              "label": "fan",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "cat"
          }
        },
        {
          "id": "c19s1-r4-604",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "ink처럼 N랑 K 소리가 이어지는 그림을 찾아보세요!",
          "promptAudio": "ink",
          "options": [
            {
              "id": "c19s1-p0-605",
              "icon": "ink",
              "label": "ink",
              "correct": true
            },
            {
              "id": "c19s1-p1-606",
              "icon": "book",
              "label": "book",
              "correct": false
            },
            {
              "id": "c19s1-p2-607",
              "icon": "aim",
              "label": "aim",
              "correct": false
            },
            {
              "id": "c19s1-p3-608",
              "icon": "jam",
              "label": "jam",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "ink"
          }
        },
        {
          "id": "c19s1-r5-609",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "nose",
            "cat"
          ]
        },
        {
          "id": "c19s1-finale-610",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "ink"
          ]
        }
      ],
      "recapKo": "N과 K 소리를 이어봤어요! ink처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "nnn",
          "kuh",
          "ink"
        ]
      }
    },
    {
      "id": "c19-stage-2",
      "order": 2,
      "title": "Power of NK",
      "villain": {
        "name": "Wipeout",
        "art": "wipeout-c19",
        "style": "supervillain-eraser"
      },
      "hero": {
        "name": "Vaultleap",
        "art": "vaultleap-c19",
        "style": "superhero-acrobat"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c19s2-r1-warmup-611",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c19s2-w0-612",
              "icon": "letterTile",
              "label": "OA",
              "say": "oh",
              "correct": false
            },
            {
              "id": "c19s2-w1-613",
              "icon": "letterTile",
              "label": "N",
              "say": "nnn",
              "correct": true
            },
            {
              "id": "c19s2-w2-614",
              "icon": "letterTile",
              "label": "IE",
              "say": "eye",
              "correct": false
            }
          ]
        },
        {
          "id": "c19s2-r2-615",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"bee\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "ee",
          "options": [
            {
              "id": "c19s2-a0-616",
              "icon": "fork",
              "label": "fork",
              "correct": false
            },
            {
              "id": "c19s2-a1-617",
              "icon": "bee",
              "label": "bee",
              "correct": true
            },
            {
              "id": "c19s2-a2-618",
              "icon": "zebra",
              "label": "zebra",
              "correct": false
            },
            {
              "id": "c19s2-a3-618b",
              "icon": "queen",
              "label": "queen",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "bee"
          }
        },
        {
          "id": "c19s2-r3-trace-619",
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
          "id": "c19s2-break-620",
          "kind": "break",
          "instructionKo": "N랑 K를 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "kuh"
          ]
        },
        {
          "id": "c19s2-r4-multiselect-621",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/h/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c19s2-m0-622",
              "icon": "hen",
              "label": "hen",
              "correct": true
            },
            {
              "id": "c19s2-m1-623",
              "icon": "hat",
              "label": "hat",
              "correct": true
            },
            {
              "id": "c19s2-m2-624",
              "icon": "horse",
              "label": "horse",
              "correct": true
            },
            {
              "id": "c19s2-m3-625",
              "icon": "king",
              "label": "king",
              "correct": false
            },
            {
              "id": "c19s2-m4-626",
              "icon": "van",
              "label": "van",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "hen"
          }
        },
        {
          "id": "c19s2-r5-hard-632",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c19s2-h0-628",
              "icon": "letterTile",
              "label": "Y",
              "say": "yyuh",
              "correct": false
            },
            {
              "id": "c19s2-h1-629",
              "icon": "letterTile",
              "label": "X",
              "say": "ksuh",
              "correct": false
            },
            {
              "id": "c19s2-h2-630",
              "icon": "letterTile",
              "label": "CH",
              "say": "ch",
              "correct": false
            },
            {
              "id": "c19s2-h-correct-627",
              "icon": "letterTile",
              "label": "K",
              "say": "kuh",
              "correct": true
            },
            {
              "id": "c19s2-h3-631",
              "icon": "letterTile",
              "label": "SH",
              "say": "shhu",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "K",
            "say": "kuh"
          }
        },
        {
          "id": "c19s2-r6-reversed-633",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "TH",
          "options": [
            {
              "id": "c19s2-v0-634",
              "icon": "thumb",
              "label": "thumb",
              "correct": true
            },
            {
              "id": "c19s2-v1-635",
              "icon": "queen",
              "label": "queen",
              "correct": false
            },
            {
              "id": "c19s2-v2-636",
              "icon": "coin",
              "label": "coin",
              "correct": false
            },
            {
              "id": "c19s2-v3-636b",
              "icon": "yoyo",
              "label": "yoyo",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "thumb"
          }
        },
        {
          "id": "c19s2-r7-listenrepeat-637",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "ink",
            "bee"
          ]
        },
        {
          "id": "c19s2-finale-638",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "K",
              "say": "kuh"
            },
            "ink"
          ]
        }
      ],
      "recapKo": "N+K = INK! 소리를 잘 익혔어요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "kuh",
          "ink"
        ]
      }
    },
    {
      "id": "c19-stage-3",
      "order": 3,
      "title": "F and T Together",
      "villain": {
        "name": "Haltmark",
        "art": "haltmark-c19",
        "style": "supervillain-stop"
      },
      "hero": {
        "name": "Bastion",
        "art": "bastion-c19",
        "style": "superhero-shield"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c19s3-teach-639",
          "kind": "teach",
          "instructionKo": "Bastion이 F와 T 소리를 나란히 들려줘요! 단어 끝에서 나요.",
          "art": "hero",
          "repeatAudio": [
            "fff"
          ]
        },
        {
          "id": "c19s3-r1-640",
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
          "id": "c19s3-break-641",
          "kind": "break",
          "instructionKo": "두 소리를 하나씩 다시 들어볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c19s3-blend-642",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "F랑 T 소리를 이어서 말하면 새 단어가 돼요! 잘 듣고 따라 말해보세요.",
          "words": [
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
          "id": "c19s3-r2-643",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"fox\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "fff",
          "options": [
            {
              "id": "c19s3-o0-644a",
              "icon": "van",
              "label": "van",
              "correct": false
            },
            {
              "id": "c19s3-o0-644b",
              "icon": "pot",
              "label": "pot",
              "correct": false
            },
            {
              "id": "c19s3-o0-644",
              "icon": "fox",
              "label": "fox",
              "correct": true
            },
            {
              "id": "c19s3-o0-644c",
              "icon": "jam",
              "label": "jam",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "fox"
          }
        },
        {
          "id": "c19s3-r3-645",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"ten\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c19s3-o0-646",
              "icon": "sun",
              "label": "sun",
              "correct": false
            },
            {
              "id": "c19s3-o1-647",
              "icon": "apple",
              "label": "apple",
              "correct": false
            },
            {
              "id": "c19s3-o2-648",
              "icon": "igloo",
              "label": "igloo",
              "correct": false
            },
            {
              "id": "c19s3-o3-649",
              "icon": "ten",
              "label": "ten",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "ten"
          }
        },
        {
          "id": "c19s3-r4-650",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "gift처럼 F랑 T 소리가 이어지는 그림을 찾아보세요!",
          "promptAudio": "gift",
          "options": [
            {
              "id": "c19s3-p0-651",
              "icon": "pig",
              "label": "pig",
              "correct": false
            },
            {
              "id": "c19s3-p1-652",
              "icon": "net",
              "label": "net",
              "correct": false
            },
            {
              "id": "c19s3-p2-653",
              "icon": "gift",
              "label": "gift",
              "correct": true
            },
            {
              "id": "c19s3-p3-654",
              "icon": "kite",
              "label": "kite",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "gift"
          }
        },
        {
          "id": "c19s3-r5-655",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "fox",
            "ten"
          ]
        },
        {
          "id": "c19s3-finale-656",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "gift"
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
      "recapKo": "F와 T 소리를 이어봤어요! gift처럼요.",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "fff",
          "tuh",
          "gift"
        ]
      }
    },
    {
      "id": "c19-stage-4",
      "order": 4,
      "title": "Power of FT",
      "villain": {
        "name": "Scramblor",
        "art": "scramblor-c19",
        "style": "supervillain-jumble"
      },
      "hero": {
        "name": "Voltarc",
        "art": "voltarc-c19",
        "style": "superhero-thunder"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c19s4-r1-warmup-657",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "fff",
          "options": [
            {
              "id": "c19s4-w0-658",
              "icon": "letterTile",
              "label": "E",
              "say": "eh",
              "correct": false
            },
            {
              "id": "c19s4-w1-659",
              "icon": "letterTile",
              "label": "F",
              "say": "fff",
              "correct": true
            },
            {
              "id": "c19s4-w2-660",
              "icon": "letterTile",
              "label": "H",
              "say": "huh",
              "correct": false
            }
          ]
        },
        {
          "id": "c19s4-r2-661",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"rain\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c19s4-a0-662",
              "icon": "rain",
              "label": "rain",
              "correct": true
            },
            {
              "id": "c19s4-a1-663",
              "icon": "mat",
              "label": "mat",
              "correct": false
            },
            {
              "id": "c19s4-a2-664",
              "icon": "door",
              "label": "door",
              "correct": false
            },
            {
              "id": "c19s4-a3-665",
              "icon": "gum",
              "label": "gum",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "rain"
          }
        },
        {
          "id": "c19s4-r3-trace-666",
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
          "id": "c19s4-break-667",
          "kind": "break",
          "instructionKo": "F랑 T를 이어서 다시 외쳐볼까요?",
          "art": "hero",
          "repeatAudio": [
            "tuh"
          ]
        },
        {
          "id": "c19s4-r4-multiselect-668",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/r/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c19s4-m0-669",
              "icon": "rat",
              "label": "rat",
              "correct": true
            },
            {
              "id": "c19s4-m1-670",
              "icon": "ring",
              "label": "ring",
              "correct": true
            },
            {
              "id": "c19s4-m2-671",
              "icon": "rubber",
              "label": "rubber",
              "correct": true
            },
            {
              "id": "c19s4-m3-672",
              "icon": "octopus",
              "label": "octopus",
              "correct": false
            },
            {
              "id": "c19s4-m4-673",
              "icon": "umbrella",
              "label": "umbrella",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "rat"
          }
        },
        {
          "id": "c19s4-r5-hard-679",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c19s4-h-correct-674",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": true
            },
            {
              "id": "c19s4-h0-675",
              "icon": "letterTile",
              "label": "L",
              "say": "lll",
              "correct": false
            },
            {
              "id": "c19s4-h1-676",
              "icon": "letterTile",
              "label": "F",
              "say": "fff",
              "correct": false
            },
            {
              "id": "c19s4-h2-677",
              "icon": "letterTile",
              "label": "B",
              "say": "buh",
              "correct": false
            },
            {
              "id": "c19s4-h3-678",
              "icon": "letterTile",
              "label": "AI",
              "say": "a",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "T",
            "say": "tuh"
          }
        },
        {
          "id": "c19s4-r6-reversed-680",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "J",
          "options": [
            {
              "id": "c19s4-v0-681",
              "icon": "boat",
              "label": "boat",
              "correct": false
            },
            {
              "id": "c19s4-v1-682",
              "icon": "pie",
              "label": "pie",
              "correct": false
            },
            {
              "id": "c19s4-v2-683",
              "icon": "jug",
              "label": "jug",
              "correct": true
            },
            {
              "id": "c19s4-v3-684",
              "icon": "feet",
              "label": "feet",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "jug"
          }
        },
        {
          "id": "c19s4-r7-listenrepeat-685",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "gift",
            "rain"
          ]
        },
        {
          "id": "c19s4-r8-cycle-706",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "fff",
              "options": [
                {
                  "id": "c19s4-q0-0-686",
                  "icon": "letterTile",
                  "label": "OR",
                  "say": "or",
                  "correct": false
                },
                {
                  "id": "c19s4-q0-1-687",
                  "icon": "letterTile",
                  "label": "Z",
                  "say": "zze",
                  "correct": false
                },
                {
                  "id": "c19s4-q0-2-688",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": false
                },
                {
                  "id": "c19s4-q0-3-689",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "tuh",
              "options": [
                {
                  "id": "c19s4-q1-0-690",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                },
                {
                  "id": "c19s4-q1-1-691",
                  "icon": "letterTile",
                  "label": "NG",
                  "say": "ngh",
                  "correct": false
                },
                {
                  "id": "c19s4-q1-2-692",
                  "icon": "letterTile",
                  "label": "V",
                  "say": "vve",
                  "correct": false
                },
                {
                  "id": "c19s4-q1-3-693",
                  "icon": "letterTile",
                  "label": "Y",
                  "say": "yyuh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "awh",
              "options": [
                {
                  "id": "c19s4-q2-0-694",
                  "icon": "letterTile",
                  "label": "X",
                  "say": "ksuh",
                  "correct": false
                },
                {
                  "id": "c19s4-q2-1-695",
                  "icon": "letterTile",
                  "label": "O",
                  "say": "awh",
                  "correct": true
                },
                {
                  "id": "c19s4-q2-2-696",
                  "icon": "letterTile",
                  "label": "CH",
                  "say": "ch",
                  "correct": false
                },
                {
                  "id": "c19s4-q2-3-697",
                  "icon": "letterTile",
                  "label": "SH",
                  "say": "shhu",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "huh",
              "options": [
                {
                  "id": "c19s4-q3-0-698",
                  "icon": "letterTile",
                  "label": "TH",
                  "say": "thhu",
                  "correct": false
                },
                {
                  "id": "c19s4-q3-1-699",
                  "icon": "letterTile",
                  "label": "QU",
                  "say": "kw",
                  "correct": false
                },
                {
                  "id": "c19s4-q3-2-700",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": true
                },
                {
                  "id": "c19s4-q3-3-701",
                  "icon": "letterTile",
                  "label": "OU",
                  "say": "ou",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "buh",
              "options": [
                {
                  "id": "c19s4-q4-0-702",
                  "icon": "letterTile",
                  "label": "OI",
                  "say": "oi",
                  "correct": false
                },
                {
                  "id": "c19s4-q4-1-703",
                  "icon": "letterTile",
                  "label": "UE",
                  "say": "u",
                  "correct": false
                },
                {
                  "id": "c19s4-q4-2-704",
                  "icon": "letterTile",
                  "label": "AR",
                  "say": "arh",
                  "correct": false
                },
                {
                  "id": "c19s4-q4-3-705",
                  "icon": "letterTile",
                  "label": "B",
                  "say": "buh",
                  "correct": true
                }
              ]
            }
          ]
        },
        {
          "id": "c19s4-finale-707",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            {
              "text": "T",
              "say": "tuh"
            },
            "gift"
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
      "recapKo": "F+T = GIFT! 이제 두 블렌드를 모두 알아요.",
      "recapAudio": {
        "ko": "이 소리들을 이어서 말해요.",
        "en": [
          "tuh",
          "gift"
        ]
      }
    },
    {
      "id": "c19-stage-5",
      "order": 5,
      "title": "Boss: PINK and GIFT!",
      "villain": {
        "name": "Umbraking",
        "art": "umbraking-c19",
        "style": "supervillain-king"
      },
      "hero": {
        "name": "Ironvow",
        "art": "ironvow-c19",
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
          "id": "c19s5-teach-708",
          "kind": "teach",
          "instructionKo": "Ironvow가 합체해요! 먼저 pink를 만들어요.",
          "repeatAudio": [
            "puh",
            "ihh",
            "nnn",
            "kuh",
            "pink"
          ]
        },
        {
          "id": "c19s5-r1-warmup-709",
          "kind": "drag-build",
          "scored": false,
          "instructionKo": "글자를 순서대로 옮겨서 단어를 완성하세요! (연습이에요)",
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
              "text": "K",
              "say": "kuh"
            }
          ],
          "target": [
            "P",
            "I",
            "N",
            "K"
          ]
        },
        {
          "id": "c19s5-r2-710",
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
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "K",
              "say": "kuh"
            },
            "pink"
          ]
        },
        {
          "id": "c19s5-break-711",
          "kind": "break",
          "instructionKo": "이번엔 gift가에요! 함께 외쳐볼까요?",
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
          "id": "c19s5-r3-quickfire-728",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "puh",
              "options": [
                {
                  "id": "c19s5-bq0-0-712",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": true
                },
                {
                  "id": "c19s5-bq0-1-713",
                  "icon": "letterTile",
                  "label": "ER",
                  "say": "erh",
                  "correct": false
                },
                {
                  "id": "c19s5-bq0-2-714",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c19s5-bq0-3-715",
                  "icon": "letterTile",
                  "label": "A",
                  "say": "aaa",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "ihh",
              "options": [
                {
                  "id": "c19s5-bq1-0-716",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c19s5-bq1-1-717",
                  "icon": "letterTile",
                  "label": "I",
                  "say": "ihh",
                  "correct": true
                },
                {
                  "id": "c19s5-bq1-2-718",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c19s5-bq1-3-719",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c19s5-bq2-0-720",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": false
                },
                {
                  "id": "c19s5-bq2-1-721",
                  "icon": "letterTile",
                  "label": "E",
                  "say": "eh",
                  "correct": false
                },
                {
                  "id": "c19s5-bq2-2-722",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                },
                {
                  "id": "c19s5-bq2-3-723",
                  "icon": "letterTile",
                  "label": "H",
                  "say": "huh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "kuh",
              "options": [
                {
                  "id": "c19s5-bq3-0-724",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c19s5-bq3-1-725",
                  "icon": "letterTile",
                  "label": "M",
                  "say": "mmm",
                  "correct": false
                },
                {
                  "id": "c19s5-bq3-2-726",
                  "icon": "letterTile",
                  "label": "D",
                  "say": "duh",
                  "correct": false
                },
                {
                  "id": "c19s5-bq3-3-727",
                  "icon": "letterTile",
                  "label": "K",
                  "say": "kuh",
                  "correct": true
                }
              ]
            }
          ]
        },
        {
          "id": "c19s5-r4-729",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "K",
              "say": "kuh"
            },
            {
              "text": "P",
              "say": "puh"
            }
          ],
          "target": [
            "P",
            "I",
            "N",
            "K"
          ],
          "readAloud": {
            "targetText": "pink"
          }
        },
        {
          "id": "c19s5-r5-wordspot-730",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c19s5-ws0-731",
              "icon": "letterTile",
              "label": "KNIP",
              "correct": false
            },
            {
              "id": "c19s5-ws1-732",
              "icon": "letterTile",
              "label": "PINK",
              "correct": true
            },
            {
              "id": "c19s5-ws2-733",
              "icon": "letterTile",
              "label": "KPIN",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "pink"
          }
        },
        {
          "id": "c19s5-r6-734",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 gift를 만들어요! 순서대로 옮겨보세요.",
          "letters": [
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
            {
              "text": "G",
              "say": "guh"
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
          "id": "c19s5-r7-bonus-735",
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
          "id": "c19s5-finale-736",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! PINK! GIFT!",
          "words": [
            "pink",
            "gift"
          ]
        }
      ],
      "recapKo": "PINK와 GIFT를 만들었어요! 챕터 19 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "pink",
          "gift"
        ]
      }
    }
  ]
}
