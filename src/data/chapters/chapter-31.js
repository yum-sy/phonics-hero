// Chapter 31 (카봇 theme): consonant blends TW + SN -> boss words "TWIN" + "SNAP". No new Jolly phonemes -- all 42
// sounds finished at chapter 14; this is a pure blend/cumulative-review chapter
// per the world-5 brief (leader-assigned art family: 카봇).
//
// Blends are NOT new SOUND_TABLE letterforms -- there is no measured 'st'/'tr'/
// etc phoneme (that would need fresh say+afinfo measurement this session didn't
// do). Instead each blend is taught the same way multi-letter boss words already
// are (zip = Z+I+P, car = C+AR): sequential single-sound review of the component
// letters (already in SOUND_TABLE, already taught by chapter 14), then a
// listen-repeat blend demo (slot sounds -> blended word), then drag-build
// assembly at the boss. All choose/multiselect/cycle quiz content only ever
// references pre-existing single letterforms -- never a synthesized 'ST' sound.
//
// reviewTargets on every declaring stage is the frozen 41-letterform list
// chapter 14 last shipped. This is valid ONLY if chapters 15-28 (written by
// other sessions) also introduce no new letterforms, since validateChapters()
// derives taughtSoFar from every beat.letter across the whole chapter list in
// curriculum order -- flagged in the final report to the leader.
//
// Boss word slot decomposition (all letters/digraphs verified against
// SOUND_TABLE before writing):
//   TWIN = T+W+I+N
//   SNAP = S+N+A+P

export const chapter31 = {
  "id": "chapter-31",
  "order": 31,
  "title": "Chrome Convoy Returns",
  "stages": [
    {
      "id": "c31s1",
      "order": 1,
      "title": "Blend TW",
      "villain": {
        "name": "Corrode",
        "art": "corrode",
        "style": "robot"
      },
      "hero": {
        "name": "Torque",
        "art": "torque-c31",
        "style": "robot"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c31s1-teach",
          "kind": "teach",
          "art": "hero",
          "letter": "T",
          "repeatAudio": [
            "tuh"
          ],
          "instructionKo": "Torque가 두 소리를 이어서 내는 법을 보여줘요! 먼저 이 소리를 들어보세요."
        },
        {
          "id": "c31s1-r1",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리가 들어있는 단어예요! 따라 말해보세요.",
          "words": [
            "top",
            "ten"
          ]
        },
        {
          "id": "c31s1-break",
          "kind": "break",
          "art": "hero",
          "letter": "W",
          "repeatAudio": [
            "weh"
          ],
          "instructionKo": "이번엔 다른 소리예요! 함께 들어볼까요?"
        },
        {
          "id": "c31s1-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"rain\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c31s1-r2-0",
              "icon": "duck",
              "label": "duck",
              "correct": false
            },
            {
              "id": "c31s1-r2-1",
              "icon": "rain",
              "label": "rain",
              "correct": true
            },
            {
              "id": "c31s1-r2-2",
              "icon": "egg",
              "label": "egg",
              "correct": false
            },
            {
              "id": "c31s1-r2-3",
              "icon": "king",
              "label": "king",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "rain"
          }
        },
        {
          "id": "c31s1-r3",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/f/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c31s1-r3-0",
              "icon": "fries",
              "label": "fries",
              "correct": true
            },
            {
              "id": "c31s1-r3-1",
              "icon": "pig",
              "label": "pig",
              "correct": false
            },
            {
              "id": "c31s1-r3-2",
              "icon": "fish",
              "label": "fish",
              "correct": true
            },
            {
              "id": "c31s1-r3-3",
              "icon": "hen",
              "label": "hen",
              "correct": false
            },
            {
              "id": "c31s1-r3-4",
              "icon": "fox",
              "label": "fox",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "fries"
          }
        },
        {
          "id": "c31s1-r4-blend",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "T와 W를 이어서 말하면 'TW' 소리가 돼요! 천천히 따라 말해보세요.",
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
          "id": "c31s1-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "twin"
          ]
        }
      ],
      "recapKo": "T와 W를 이으면 'TW' 소리가 돼요! TWIN처럼요!",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "tuh",
          "weh",
          "twin"
        ]
      }
    },
    {
      "id": "c31s2",
      "order": 2,
      "title": "TW Power-Up",
      "villain": {
        "name": "Jamlock",
        "art": "jamlock",
        "style": "robot"
      },
      "hero": {
        "name": "Torque",
        "art": "torque-c31",
        "style": "robot"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c31s2-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c31s2-r1-warmup-1",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c31s2-r1-warmup-2",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c31s2-r1-warmup-0",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": true
            }
          ]
        },
        {
          "id": "c31s2-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"bee\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "buh",
          "options": [
            {
              "id": "c31s2-r2-0",
              "icon": "bee",
              "label": "bee",
              "correct": true
            },
            {
              "id": "c31s2-r2-1",
              "icon": "fox",
              "label": "fox",
              "correct": false
            },
            {
              "id": "c31s2-r2-2",
              "icon": "king",
              "label": "king",
              "correct": false
            },
            {
              "id": "c31s2-r2-3",
              "icon": "net",
              "label": "net",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "bee"
          }
        },
        {
          "id": "c31s2-r3-trace",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 T와 W를 따라 그리면서 두 소리를 이어보세요!",
          "words": [
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "W",
              "say": "weh"
            }
          ]
        },
        {
          "id": "c31s2-r4-multi",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/p/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c31s2-r4-multi-0",
              "icon": "pig",
              "label": "pig",
              "correct": true
            },
            {
              "id": "c31s2-r4-multi-1",
              "icon": "rat",
              "label": "rat",
              "correct": false
            },
            {
              "id": "c31s2-r4-multi-2",
              "icon": "pen",
              "label": "pen",
              "correct": true
            },
            {
              "id": "c31s2-r4-multi-3",
              "icon": "fish",
              "label": "fish",
              "correct": false
            },
            {
              "id": "c31s2-r4-multi-4",
              "icon": "pot",
              "label": "pot",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "pig"
          }
        },
        {
          "id": "c31s2-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c31s2-r5-hard-1",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c31s2-r5-hard-2",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c31s2-r5-hard-3",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": false
            },
            {
              "id": "c31s2-r5-hard-4",
              "icon": "letterTile",
              "label": "N",
              "say": "nnn",
              "correct": false
            },
            {
              "id": "c31s2-r5-hard-0",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": true
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "T",
            "say": "tuh"
          }
        },
        {
          "id": "c31s2-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "AR",
          "options": [
            {
              "id": "c31s2-r6-reversed-0",
              "icon": "pig",
              "label": "pig",
              "correct": false
            },
            {
              "id": "c31s2-r6-reversed-1",
              "icon": "hen",
              "label": "hen",
              "correct": false
            },
            {
              "id": "c31s2-r6-reversed-2",
              "icon": "box",
              "label": "box",
              "correct": false
            },
            {
              "id": "c31s2-r6-reversed-3",
              "icon": "car",
              "label": "car",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "car"
          }
        },
        {
          "id": "c31s2-r7-cycle",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "tuh",
              "options": [
                {
                  "id": "c31s2-r7-cycle-s0-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c31s2-r7-cycle-s0-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c31s2-r7-cycle-s0-2",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c31s2-r7-cycle-s0-3",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "weh",
              "options": [
                {
                  "id": "c31s2-r7-cycle-s1-0",
                  "icon": "letterTile",
                  "label": "W",
                  "say": "weh",
                  "correct": true
                },
                {
                  "id": "c31s2-r7-cycle-s1-1",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c31s2-r7-cycle-s1-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c31s2-r7-cycle-s1-3",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c31s2-r7-cycle-s2-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c31s2-r7-cycle-s2-1",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                },
                {
                  "id": "c31s2-r7-cycle-s2-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c31s2-r7-cycle-s2-3",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "kuh",
              "options": [
                {
                  "id": "c31s2-r7-cycle-s3-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c31s2-r7-cycle-s3-1",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c31s2-r7-cycle-s3-2",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": true
                },
                {
                  "id": "c31s2-r7-cycle-s3-3",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c31s2-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            "twin"
          ]
        }
      ],
      "recapKo": "TW 소리를 다시 연습했어요! 이제 TWIN를 잘 만들 수 있어요.",
      "recapAudio": {
        "ko": "다시 연습했어요. 잘 들어보세요.",
        "en": [
          "tuh",
          "weh",
          "twin"
        ]
      }
    },
    {
      "id": "c31s3",
      "order": 3,
      "title": "Blend SN",
      "villain": {
        "name": "Shredfang",
        "art": "shredfang",
        "style": "robot"
      },
      "hero": {
        "name": "Skidder",
        "art": "skidder",
        "style": "robot"
      },
      "chapterBoss": false,
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
          "id": "c31s3-teach",
          "kind": "teach",
          "art": "hero",
          "letter": "S",
          "repeatAudio": [
            "sss"
          ],
          "instructionKo": "Skidder가 또 다른 두 소리를 보여줘요! 먼저 이 소리를 들어보세요."
        },
        {
          "id": "c31s3-r1",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리가 들어있는 단어예요! 따라 말해보세요.",
          "words": [
            "sun",
            "sock"
          ]
        },
        {
          "id": "c31s3-break",
          "kind": "break",
          "art": "hero",
          "letter": "N",
          "repeatAudio": [
            "nnn"
          ],
          "instructionKo": "이번엔 다른 소리예요! 함께 들어볼까요?"
        },
        {
          "id": "c31s3-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"horse\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "huh",
          "options": [
            {
              "id": "c31s3-r2-0",
              "icon": "horse",
              "label": "horse",
              "correct": true
            },
            {
              "id": "c31s3-r2-1",
              "icon": "pig",
              "label": "pig",
              "correct": false
            },
            {
              "id": "c31s3-r2-2",
              "icon": "king",
              "label": "king",
              "correct": false
            },
            {
              "id": "c31s3-r2-3",
              "icon": "net",
              "label": "net",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "horse"
          }
        },
        {
          "id": "c31s3-r3",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/m/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c31s3-r3-0",
              "icon": "moon",
              "label": "moon",
              "correct": true
            },
            {
              "id": "c31s3-r3-1",
              "icon": "pig",
              "label": "pig",
              "correct": false
            },
            {
              "id": "c31s3-r3-2",
              "icon": "man",
              "label": "man",
              "correct": true
            },
            {
              "id": "c31s3-r3-3",
              "icon": "king",
              "label": "king",
              "correct": false
            },
            {
              "id": "c31s3-r3-4",
              "icon": "mat",
              "label": "mat",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "moon"
          }
        },
        {
          "id": "c31s3-r4-blend",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "S와 N를 이어서 말하면 'SN' 소리가 돼요! 천천히 따라 말해보세요.",
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
          "id": "c31s3-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "snap"
          ]
        }
      ],
      "recapKo": "S와 N를 이으면 'SN' 소리가 돼요! SNAP처럼요!",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "sss",
          "nnn",
          "snap"
        ]
      }
    },
    {
      "id": "c31s4",
      "order": 4,
      "title": "카봇 Training",
      "villain": {
        "name": "Barricade",
        "art": "barricade",
        "style": "robot"
      },
      "hero": {
        "name": "Ratchett",
        "art": "ratchett",
        "style": "robot"
      },
      "chapterBoss": false,
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
          "id": "c31s4-r1",
          "kind": "choose",
          "scored": true,
          "instructionKo": "TW와 SN 소리를 다시 연습해요! 이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "tuh",
          "options": [
            {
              "id": "c31s4-r1-1",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c31s4-r1-2",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c31s4-r1-0",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": true
            },
            {
              "id": "c31s4-r1-3",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "T",
            "say": "tuh"
          }
        },
        {
          "id": "c31s4-r2",
          "kind": "choose",
          "scored": true,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c31s4-r2-0",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c31s4-r2-2",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c31s4-r2-1",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": true
            },
            {
              "id": "c31s4-r2-3",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "S",
            "say": "sss"
          }
        },
        {
          "id": "c31s4-r3-multi",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/d/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c31s4-r3-multi-0",
              "icon": "duck",
              "label": "duck",
              "correct": true
            },
            {
              "id": "c31s4-r3-multi-1",
              "icon": "pig",
              "label": "pig",
              "correct": false
            },
            {
              "id": "c31s4-r3-multi-2",
              "icon": "door",
              "label": "door",
              "correct": true
            },
            {
              "id": "c31s4-r3-multi-3",
              "icon": "king",
              "label": "king",
              "correct": false
            },
            {
              "id": "c31s4-r3-multi-4",
              "icon": "dog",
              "label": "dog",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "duck"
          }
        },
        {
          "id": "c31s4-r4-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요! (조금 어려워요)",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c31s4-r4-hard-1",
              "icon": "letterTile",
              "label": "N",
              "say": "nnn",
              "correct": true
            },
            {
              "id": "c31s4-r4-hard-0",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c31s4-r4-hard-2",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c31s4-r4-hard-3",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c31s4-r4-hard-4",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "N",
            "say": "nnn"
          }
        },
        {
          "id": "c31s4-r5-cycle",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "tuh",
              "options": [
                {
                  "id": "c31s4-r5-cycle-s0-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c31s4-r5-cycle-s0-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c31s4-r5-cycle-s0-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                },
                {
                  "id": "c31s4-r5-cycle-s0-3",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c31s4-r5-cycle-s1-0",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c31s4-r5-cycle-s1-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c31s4-r5-cycle-s1-2",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c31s4-r5-cycle-s1-3",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "guh",
              "options": [
                {
                  "id": "c31s4-r5-cycle-s2-0",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": true
                },
                {
                  "id": "c31s4-r5-cycle-s2-1",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c31s4-r5-cycle-s2-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c31s4-r5-cycle-s2-3",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "rrr",
              "options": [
                {
                  "id": "c31s4-r5-cycle-s3-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c31s4-r5-cycle-s3-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                },
                {
                  "id": "c31s4-r5-cycle-s3-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c31s4-r5-cycle-s3-3",
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
          "id": "c31s4-r6-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "twin",
            "snap"
          ]
        },
        {
          "id": "c31s4-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "twin"
          ]
        }
      ],
      "recapKo": "TW와 SN를 다시 연습했어요! 이제 합체할 준비 완료예요!",
      "recapAudio": {
        "ko": "두 블렌드를 다시 연습했어요. 이제 준비됐어요.",
        "en": [
          "tuh",
          "sss"
        ]
      }
    },
    {
      "id": "c31s5",
      "order": 5,
      "title": "Boss: TWIN and SNAP!",
      "villain": {
        "name": "Voltrust",
        "art": "voltrust",
        "style": "robot"
      },
      "hero": {
        "name": "Torque Ultra",
        "art": "torque-ultra",
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
          "id": "c31s5-teach",
          "kind": "teach",
          "instructionKo": "Torque + Skidder + Ratchett가 합체해요! 먼저 TWIN를 만들어요.",
          "repeatAudio": [
            "tuh",
            "weh",
            "ihh",
            "nnn",
            "twin"
          ]
        },
        {
          "id": "c31s5-r1-warmup",
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
          "id": "c31s5-r2",
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
          "id": "c31s5-break",
          "kind": "break",
          "art": "hero",
          "instructionKo": "이번엔 SNAP예요! 함께 외쳐볼까요?",
          "repeatAudio": [
            "sss",
            "nnn",
            "aaa",
            "puh",
            "snap"
          ]
        },
        {
          "id": "c31s5-r3-quickfire",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "tuh",
              "options": [
                {
                  "id": "c31s5-r3-quickfire-s0-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c31s5-r3-quickfire-s0-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c31s5-r3-quickfire-s0-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                },
                {
                  "id": "c31s5-r3-quickfire-s0-3",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c31s5-r3-quickfire-s1-0",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c31s5-r3-quickfire-s1-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c31s5-r3-quickfire-s1-2",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c31s5-r3-quickfire-s1-3",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "fff",
              "options": [
                {
                  "id": "c31s5-r3-quickfire-s2-0",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                },
                {
                  "id": "c31s5-r3-quickfire-s2-1",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c31s5-r3-quickfire-s2-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c31s5-r3-quickfire-s2-3",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "buh",
              "options": [
                {
                  "id": "c31s5-r3-quickfire-s3-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c31s5-r3-quickfire-s3-1",
                  "icon": "letterTile",
                  "label": "B",
                  "say": "buh",
                  "correct": true
                },
                {
                  "id": "c31s5-r3-quickfire-s3-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c31s5-r3-quickfire-s3-3",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                }
              ]
            }
          ]
        },
        {
          "id": "c31s5-r4",
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
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "W",
              "say": "weh"
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
          "id": "c31s5-r5-wordspot",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c31s5-w1",
              "icon": "letterTile",
              "label": "WINT",
              "correct": false
            },
            {
              "id": "c31s5-w2",
              "icon": "letterTile",
              "label": "INTW",
              "correct": false
            },
            {
              "id": "c31s5-w3",
              "icon": "letterTile",
              "label": "TWIN",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "twin"
          }
        },
        {
          "id": "c31s5-r6",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 SNAP를 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "P",
              "say": "puh"
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
          "id": "c31s5-r7-bonus",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "SNAP도 천천히 따라 말해보세요.",
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
          "id": "c31s5-finale",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! TWIN! SNAP!",
          "words": [
            "twin",
            "snap"
          ]
        }
      ],
      "recapKo": "T-W-I-N는 TWIN, S-N-A-P는 SNAP! 단어 두 개를 만들었어요! 챕터 31 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "twin",
          "snap"
        ]
      }
    }
  ]
}
