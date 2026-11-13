// Chapter 30 (마리오(레고) theme): consonant blends CL + FR -> boss words "CLOUD" + "FROG". No new Jolly phonemes -- all 42
// sounds finished at chapter 14; this is a pure blend/cumulative-review chapter
// per the world-5 brief (leader-assigned art family: 마리오(레고)).
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
//   CLOUD = C+L+OU+D
//   FROG = F+R+O+G

export const chapter30 = {
  "id": "chapter-30",
  "order": 30,
  "title": "Royal Knights Return",
  "stages": [
    {
      "id": "c30s1",
      "order": 1,
      "title": "Blend CL",
      "villain": {
        "name": "Sproing",
        "art": "sproing",
        "style": "plat-flip"
      },
      "hero": {
        "name": "Bolty",
        "art": "bolty",
        "style": "plat-jumper"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c30s1-teach",
          "kind": "teach",
          "art": "hero",
          "letter": "C",
          "repeatAudio": [
            "kuh"
          ],
          "instructionKo": "히어로가 두 소리를 이어서 내는 법을 보여줘요! 먼저 이 소리를 들어보세요."
        },
        {
          "id": "c30s1-r1",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리가 들어있는 단어예요! 따라 말해보세요.",
          "words": [
            "cat",
            "cup"
          ]
        },
        {
          "id": "c30s1-break",
          "kind": "break",
          "art": "hero",
          "letter": "L",
          "repeatAudio": [
            "lll"
          ],
          "instructionKo": "이번엔 다른 소리예요! 함께 들어볼까요?"
        },
        {
          "id": "c30s1-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"ring\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c30s1-r2-0",
              "icon": "cat",
              "label": "cat",
              "correct": false
            },
            {
              "id": "c30s1-r2-1",
              "icon": "box",
              "label": "box",
              "correct": false
            },
            {
              "id": "c30s1-r2-2",
              "icon": "ring",
              "label": "ring",
              "correct": true
            },
            {
              "id": "c30s1-r2-3",
              "icon": "hen",
              "label": "hen",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "ring"
          }
        },
        {
          "id": "c30s1-r3",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/f/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c30s1-r3-0",
              "icon": "fan",
              "label": "fan",
              "correct": true
            },
            {
              "id": "c30s1-r3-1",
              "icon": "dog",
              "label": "dog",
              "correct": false
            },
            {
              "id": "c30s1-r3-2",
              "icon": "feet",
              "label": "feet",
              "correct": true
            },
            {
              "id": "c30s1-r3-3",
              "icon": "cat",
              "label": "cat",
              "correct": false
            },
            {
              "id": "c30s1-r3-4",
              "icon": "fox",
              "label": "fox",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "fan"
          }
        },
        {
          "id": "c30s1-r4-blend",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "C와 L을 이어서 말하면 'CL' 소리가 돼요! 천천히 따라 말해보세요.",
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
              "text": "OU",
              "say": "ou"
            },
            {
              "text": "D",
              "say": "duh"
            },
            "cloud"
          ]
        },
        {
          "id": "c30s1-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "cloud"
          ]
        }
      ],
      "recapKo": "C와 L을 이으면 'CL' 소리가 돼요! CLOUD처럼요!",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "cloud"
        ]
      }
    },
    {
      "id": "c30s2",
      "order": 2,
      "title": "CL Power-Up",
      "villain": {
        "name": "Muckle",
        "art": "muckle",
        "style": "plat-slime"
      },
      "hero": {
        "name": "Bolty",
        "art": "bolty",
        "style": "plat-jumper"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c30s2-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c30s2-r1-warmup-1",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c30s2-r1-warmup-0",
              "icon": "letterTile",
              "label": "C",
              "say": "kuh",
              "correct": true
            },
            {
              "id": "c30s2-r1-warmup-2",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            }
          ]
        },
        {
          "id": "c30s2-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"bed\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "buh",
          "options": [
            {
              "id": "c30s2-r2-0",
              "icon": "cat",
              "label": "cat",
              "correct": false
            },
            {
              "id": "c30s2-r2-1",
              "icon": "hen",
              "label": "hen",
              "correct": false
            },
            {
              "id": "c30s2-r2-2",
              "icon": "duck",
              "label": "duck",
              "correct": false
            },
            {
              "id": "c30s2-r2-3",
              "icon": "bed",
              "label": "bed",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "bed"
          }
        },
        {
          "id": "c30s2-r3-trace",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 C와 L을 따라 그리면서 두 소리를 이어보세요!",
          "trace": "upper",
          "words": [
            {
              "text": "C",
              "say": "kuh"
            },
            {
              "text": "L",
              "say": "lll"
            }
          ]
        },
        {
          "id": "c30s2-r4-multi",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/p/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c30s2-r4-multi-0",
              "icon": "pig",
              "label": "pig",
              "correct": true
            },
            {
              "id": "c30s2-r4-multi-1",
              "icon": "rat",
              "label": "rat",
              "correct": false
            },
            {
              "id": "c30s2-r4-multi-2",
              "icon": "pen",
              "label": "pen",
              "correct": true
            },
            {
              "id": "c30s2-r4-multi-3",
              "icon": "fish",
              "label": "fish",
              "correct": false
            },
            {
              "id": "c30s2-r4-multi-4",
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
          "id": "c30s2-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c30s2-r5-hard-1",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c30s2-r5-hard-2",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c30s2-r5-hard-0",
              "icon": "letterTile",
              "label": "C",
              "say": "kuh",
              "correct": true
            },
            {
              "id": "c30s2-r5-hard-3",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c30s2-r5-hard-4",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "C",
            "say": "kuh"
          }
        },
        {
          "id": "c30s2-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "AR",
          "options": [
            {
              "id": "c30s2-r6-reversed-0",
              "icon": "star",
              "label": "star",
              "correct": true
            },
            {
              "id": "c30s2-r6-reversed-1",
              "icon": "cat",
              "label": "cat",
              "correct": false
            },
            {
              "id": "c30s2-r6-reversed-2",
              "icon": "fish",
              "label": "fish",
              "correct": false
            },
            {
              "id": "c30s2-r6-reversed-3",
              "icon": "duck",
              "label": "duck",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "star"
          }
        },
        {
          "id": "c30s2-r7-cycle",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "kuh",
              "options": [
                {
                  "id": "c30s2-r7-cycle-s0-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s2-r7-cycle-s0-1",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s2-r7-cycle-s0-2",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c30s2-r7-cycle-s0-3",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "lll",
              "options": [
                {
                  "id": "c30s2-r7-cycle-s1-0",
                  "icon": "letterTile",
                  "label": "L",
                  "say": "lll",
                  "correct": true
                },
                {
                  "id": "c30s2-r7-cycle-s1-1",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s2-r7-cycle-s1-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s2-r7-cycle-s1-3",
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
                  "id": "c30s2-r7-cycle-s2-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s2-r7-cycle-s2-1",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                },
                {
                  "id": "c30s2-r7-cycle-s2-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s2-r7-cycle-s2-3",
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
                  "id": "c30s2-r7-cycle-s3-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s2-r7-cycle-s3-1",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s2-r7-cycle-s3-2",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": true
                },
                {
                  "id": "c30s2-r7-cycle-s3-3",
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
          "id": "c30s2-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            "cloud"
          ]
        }
      ],
      "recapKo": "CL 소리를 다시 연습했어요! 이제 CLOUD를 잘 만들 수 있어요.",
      "recapAudio": {
        "ko": "다시 연습했어요. 잘 들어보세요.",
        "en": [
          "cloud"
        ]
      }
    },
    {
      "id": "c30s3",
      "order": 3,
      "title": "Blend FR",
      "villain": {
        "name": "Clampjaw",
        "art": "clampjaw",
        "style": "plat-magnetjack"
      },
      "hero": {
        "name": "Ricochet",
        "art": "ricochet",
        "style": "plat-spring"
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
          "id": "c30s3-teach",
          "kind": "teach",
          "art": "hero",
          "letter": "F",
          "repeatAudio": [
            "fff"
          ],
          "instructionKo": "히어로가 또 다른 두 소리를 보여줘요! 먼저 이 소리를 들어보세요."
        },
        {
          "id": "c30s3-r1",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리가 들어있는 단어예요! 따라 말해보세요.",
          "words": [
            "fish",
            "fox"
          ]
        },
        {
          "id": "c30s3-break",
          "kind": "break",
          "art": "hero",
          "letter": "R",
          "repeatAudio": [
            "rrr"
          ],
          "instructionKo": "이번엔 다른 소리예요! 함께 들어볼까요?"
        },
        {
          "id": "c30s3-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"hen\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "huh",
          "options": [
            {
              "id": "c30s3-r2-0",
              "icon": "cat",
              "label": "cat",
              "correct": false
            },
            {
              "id": "c30s3-r2-1",
              "icon": "hen",
              "label": "hen",
              "correct": true
            },
            {
              "id": "c30s3-r2-2",
              "icon": "duck",
              "label": "duck",
              "correct": false
            },
            {
              "id": "c30s3-r2-3",
              "icon": "box",
              "label": "box",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "hen"
          }
        },
        {
          "id": "c30s3-r3",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/m/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c30s3-r3-0",
              "icon": "mat",
              "label": "mat",
              "correct": true
            },
            {
              "id": "c30s3-r3-1",
              "icon": "dog",
              "label": "dog",
              "correct": false
            },
            {
              "id": "c30s3-r3-2",
              "icon": "moon",
              "label": "moon",
              "correct": true
            },
            {
              "id": "c30s3-r3-3",
              "icon": "hen",
              "label": "hen",
              "correct": false
            },
            {
              "id": "c30s3-r3-4",
              "icon": "map",
              "label": "map",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "mat"
          }
        },
        {
          "id": "c30s3-r4-blend",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "F와 R을 이어서 말하면 'FR' 소리가 돼요! 천천히 따라 말해보세요.",
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
          "id": "c30s3-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "frog"
          ]
        }
      ],
      "recapKo": "F와 R을 이으면 'FR' 소리가 돼요! FROG처럼요!",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "frog"
        ]
      }
    },
    {
      "id": "c30s4",
      "order": 4,
      "title": "Knight Training",
      "villain": {
        "name": "Rubblehorn",
        "art": "rubblehorn",
        "style": "plat-brick"
      },
      "hero": {
        "name": "Coggo",
        "art": "coggo",
        "style": "plat-block"
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
          "id": "c30s4-r1",
          "kind": "choose",
          "scored": true,
          "instructionKo": "CL과 FR 소리를 다시 연습해요! 이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "kuh",
          "options": [
            {
              "id": "c30s4-r1-1",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c30s4-r1-0",
              "icon": "letterTile",
              "label": "C",
              "say": "kuh",
              "correct": true
            },
            {
              "id": "c30s4-r1-2",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c30s4-r1-3",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "C",
            "say": "kuh"
          }
        },
        {
          "id": "c30s4-r2",
          "kind": "choose",
          "scored": true,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "fff",
          "options": [
            {
              "id": "c30s4-r2-1",
              "icon": "letterTile",
              "label": "F",
              "say": "fff",
              "correct": true
            },
            {
              "id": "c30s4-r2-0",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c30s4-r2-2",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c30s4-r2-3",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "F",
            "say": "fff"
          }
        },
        {
          "id": "c30s4-r3-multi",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/d/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c30s4-r3-multi-0",
              "icon": "dog",
              "label": "dog",
              "correct": true
            },
            {
              "id": "c30s4-r3-multi-1",
              "icon": "cat",
              "label": "cat",
              "correct": false
            },
            {
              "id": "c30s4-r3-multi-2",
              "icon": "duck",
              "label": "duck",
              "correct": true
            },
            {
              "id": "c30s4-r3-multi-3",
              "icon": "hen",
              "label": "hen",
              "correct": false
            },
            {
              "id": "c30s4-r3-multi-4",
              "icon": "door",
              "label": "door",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "dog"
          }
        },
        {
          "id": "c30s4-r4-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c30s4-r4-hard-0",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c30s4-r4-hard-2",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c30s4-r4-hard-3",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": false
            },
            {
              "id": "c30s4-r4-hard-1",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": true
            },
            {
              "id": "c30s4-r4-hard-4",
              "icon": "letterTile",
              "label": "N",
              "say": "nnn",
              "correct": false
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "R",
            "say": "rrr"
          }
        },
        {
          "id": "c30s4-r5-cycle",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "kuh",
              "options": [
                {
                  "id": "c30s4-r5-cycle-s0-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s4-r5-cycle-s0-1",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s4-r5-cycle-s0-2",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": true
                },
                {
                  "id": "c30s4-r5-cycle-s0-3",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "fff",
              "options": [
                {
                  "id": "c30s4-r5-cycle-s1-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s4-r5-cycle-s1-1",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s4-r5-cycle-s1-2",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c30s4-r5-cycle-s1-3",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "guh",
              "options": [
                {
                  "id": "c30s4-r5-cycle-s2-0",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": true
                },
                {
                  "id": "c30s4-r5-cycle-s2-1",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s4-r5-cycle-s2-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s4-r5-cycle-s2-3",
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
                  "id": "c30s4-r5-cycle-s3-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s4-r5-cycle-s3-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                },
                {
                  "id": "c30s4-r5-cycle-s3-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s4-r5-cycle-s3-3",
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
          "id": "c30s4-r6-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "cloud",
            "frog"
          ]
        },
        {
          "id": "c30s4-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "cloud"
          ]
        }
      ],
      "recapKo": "CL과 FR을 다시 연습했어요! 이제 합체할 준비 완료예요!",
      "recapAudio": {
        "ko": "두 블렌드를 다시 연습했어요. 이제 준비됐어요.",
        "en": [
          "kuh",
          "fff"
        ]
      }
    },
    {
      "id": "c30s5",
      "order": 5,
      "title": "Boss: CLOUD and FROG!",
      "villain": {
        "name": "Faultline",
        "art": "faultline",
        "style": "plat-glitch"
      },
      "hero": {
        "name": "Captain Bolty",
        "art": "captain-bolty",
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
          "id": "c30s5-teach",
          "kind": "teach",
          "instructionKo": "세 히어로가 합체해요! 먼저 CLOUD를 만들어요.",
          "repeatAudio": [
            "kuh",
            "lll",
            "ou",
            "duh",
            "cloud"
          ]
        },
        {
          "id": "c30s5-r1-warmup",
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
              "text": "OU",
              "say": "ou"
            },
            {
              "text": "D",
              "say": "duh"
            }
          ],
          "target": [
            "C",
            "L",
            "OU",
            "D"
          ]
        },
        {
          "id": "c30s5-r2",
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
              "text": "OU",
              "say": "ou"
            },
            {
              "text": "D",
              "say": "duh"
            },
            "cloud"
          ]
        },
        {
          "id": "c30s5-break",
          "kind": "break",
          "art": "hero",
          "instructionKo": "이번엔 FROG예요! 함께 외쳐볼까요?",
          "repeatAudio": [
            "fff",
            "rrr",
            "awh",
            "guh",
            "frog"
          ]
        },
        {
          "id": "c30s5-r3-quickfire",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "kuh",
              "options": [
                {
                  "id": "c30s5-r3-quickfire-s0-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s5-r3-quickfire-s0-1",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s5-r3-quickfire-s0-2",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": true
                },
                {
                  "id": "c30s5-r3-quickfire-s0-3",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "fff",
              "options": [
                {
                  "id": "c30s5-r3-quickfire-s1-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s5-r3-quickfire-s1-1",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s5-r3-quickfire-s1-2",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c30s5-r3-quickfire-s1-3",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "fff",
              "options": [
                {
                  "id": "c30s5-r3-quickfire-s2-0",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                },
                {
                  "id": "c30s5-r3-quickfire-s2-1",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s5-r3-quickfire-s2-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s5-r3-quickfire-s2-3",
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
                  "id": "c30s5-r3-quickfire-s3-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c30s5-r3-quickfire-s3-1",
                  "icon": "letterTile",
                  "label": "B",
                  "say": "buh",
                  "correct": true
                },
                {
                  "id": "c30s5-r3-quickfire-s3-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c30s5-r3-quickfire-s3-3",
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
          "id": "c30s5-r4",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "D",
              "say": "duh"
            },
            {
              "text": "OU",
              "say": "ou"
            },
            {
              "text": "L",
              "say": "lll"
            },
            {
              "text": "C",
              "say": "kuh"
            }
          ],
          "target": [
            "C",
            "L",
            "OU",
            "D"
          ],
          "readAloud": {
            "targetText": "cloud"
          }
        },
        {
          "id": "c30s5-r5-wordspot",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c30s5-w1",
              "icon": "letterTile",
              "label": "LOUDC",
              "correct": false
            },
            {
              "id": "c30s5-w3",
              "icon": "letterTile",
              "label": "CLOUD",
              "correct": true
            },
            {
              "id": "c30s5-w2",
              "icon": "letterTile",
              "label": "OUDCL",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "cloud"
          }
        },
        {
          "id": "c30s5-r6",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 FROG를 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "G",
              "say": "guh"
            },
            {
              "text": "O",
              "say": "awh"
            },
            {
              "text": "R",
              "say": "rrr"
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
          "id": "c30s5-r7-bonus",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "FROG도 천천히 따라 말해보세요.",
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
          "id": "c30s5-finale",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! CLOUD! FROG!",
          "words": [
            "cloud",
            "frog"
          ]
        }
      ],
      "recapKo": "C-L-OU-D는 CLOUD, F-R-O-G는 FROG! 단어 두 개를 만들었어요! 챕터 30 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "cloud",
          "frog"
        ]
      }
    }
  ]
}
