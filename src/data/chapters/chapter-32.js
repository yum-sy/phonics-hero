// Chapter 32 (마블 히어로 theme): consonant blends STR + NCH -> boss words "STRING" + "BENCH". No new Jolly phonemes -- all 42
// sounds finished at chapter 14; this is a pure blend/cumulative-review chapter
// per the world-5 brief (leader-assigned art family: 마블 히어로).
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
//   STRING = S+T+R+I+NG
//   BENCH = B+E+N+CH

export const chapter32 = {
  "id": "chapter-32",
  "order": 32,
  "title": "Skyward League Returns",
  "stages": [
    {
      "id": "c32s1",
      "order": 1,
      "title": "Blend STR",
      "villain": {
        "name": "Mistveil",
        "art": "mistveil",
        "style": "supervillain-fog"
      },
      "hero": {
        "name": "Glide",
        "art": "glide",
        "style": "superhero-acrobat"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c32s1-teach",
          "kind": "teach",
          "art": "hero",
          "letter": "S",
          "repeatAudio": [
            "sss"
          ],
          "instructionKo": "Glide가 세 소리를 이어서 내는 법을 보여줘요! 먼저 이 소리를 들어보세요."
        },
        {
          "id": "c32s1-r1",
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
          "id": "c32s1-break",
          "kind": "break",
          "art": "hero",
          "letter": "T",
          "repeatAudio": [
            "tuh"
          ],
          "instructionKo": "이번엔 다른 소리예요! 함께 들어볼까요?"
        },
        {
          "id": "c32s1-r1b",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "세 번째 소리도 들어볼까요? 따라 말해보세요.",
          "words": [
            "rat",
            "rain"
          ]
        },
        {
          "id": "c32s1-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"rat\"과 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "rrr",
          "options": [
            {
              "id": "c32s1-r2-0",
              "icon": "bed",
              "label": "bed",
              "correct": false
            },
            {
              "id": "c32s1-r2-1",
              "icon": "net",
              "label": "net",
              "correct": false
            },
            {
              "id": "c32s1-r2-2",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c32s1-r2-3",
              "icon": "rat",
              "label": "rat",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "rat"
          }
        },
        {
          "id": "c32s1-r3",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/f/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c32s1-r3-0",
              "icon": "feet",
              "label": "feet",
              "correct": true
            },
            {
              "id": "c32s1-r3-1",
              "icon": "duck",
              "label": "duck",
              "correct": false
            },
            {
              "id": "c32s1-r3-2",
              "icon": "fan",
              "label": "fan",
              "correct": true
            },
            {
              "id": "c32s1-r3-3",
              "icon": "box",
              "label": "box",
              "correct": false
            },
            {
              "id": "c32s1-r3-4",
              "icon": "fries",
              "label": "fries",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "feet"
          }
        },
        {
          "id": "c32s1-r4-blend",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "S, T, R을 이어서 말하면 'STR' 소리가 돼요! 천천히 따라 말해보세요.",
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
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "NG",
              "say": "ngh"
            },
            "string"
          ]
        },
        {
          "id": "c32s1-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "string"
          ]
        }
      ],
      "recapKo": "S, T, R을 이으면 'STR' 소리가 돼요! STRING처럼요!",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "string"
        ]
      }
    },
    {
      "id": "c32s2",
      "order": 2,
      "title": "STR Power-Up",
      "villain": {
        "name": "Wipeout",
        "art": "wipeout",
        "style": "supervillain-eraser"
      },
      "hero": {
        "name": "Glide",
        "art": "glide",
        "style": "superhero-acrobat"
      },
      "chapterBoss": false,
      "beats": [
        {
          "id": "c32s2-r1-warmup",
          "kind": "choose",
          "scored": false,
          "instructionKo": "이 소리를 내는 글자를 찾아보세요! (연습이에요)",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c32s2-r1-warmup-0",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": true
            },
            {
              "id": "c32s2-r1-warmup-1",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c32s2-r1-warmup-2",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            }
          ]
        },
        {
          "id": "c32s2-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"bus\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "buh",
          "options": [
            {
              "id": "c32s2-r2-0",
              "icon": "pig",
              "label": "pig",
              "correct": false
            },
            {
              "id": "c32s2-r2-1",
              "icon": "tie",
              "label": "tie",
              "correct": false
            },
            {
              "id": "c32s2-r2-2",
              "icon": "bus",
              "label": "bus",
              "correct": true
            },
            {
              "id": "c32s2-r2-3",
              "icon": "egg",
              "label": "egg",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "bus"
          }
        },
        {
          "id": "c32s2-r3-trace",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "손가락으로 S와 T를 따라 그리면서 소리를 이어보세요! (R까지 이으면 STR이 돼요)",
          "words": [
            {
              "text": "S",
              "say": "sss"
            },
            {
              "text": "T",
              "say": "tuh"
            }
          ]
        },
        {
          "id": "c32s2-r4-multi",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/p/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c32s2-r4-multi-0",
              "icon": "pig",
              "label": "pig",
              "correct": true
            },
            {
              "id": "c32s2-r4-multi-1",
              "icon": "rat",
              "label": "rat",
              "correct": false
            },
            {
              "id": "c32s2-r4-multi-2",
              "icon": "pen",
              "label": "pen",
              "correct": true
            },
            {
              "id": "c32s2-r4-multi-3",
              "icon": "fish",
              "label": "fish",
              "correct": false
            },
            {
              "id": "c32s2-r4-multi-4",
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
          "id": "c32s2-r5-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c32s2-r5-hard-1",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c32s2-r5-hard-0",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": true
            },
            {
              "id": "c32s2-r5-hard-2",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c32s2-r5-hard-3",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": false
            },
            {
              "id": "c32s2-r5-hard-4",
              "icon": "letterTile",
              "label": "N",
              "say": "nnn",
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
          "id": "c32s2-r6-reversed",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 글자가 들어있는 그림을 찾아보세요!",
          "promptLetter": "AR",
          "options": [
            {
              "id": "c32s2-r6-reversed-0",
              "icon": "king",
              "label": "king",
              "correct": false
            },
            {
              "id": "c32s2-r6-reversed-1",
              "icon": "star",
              "label": "star",
              "correct": true
            },
            {
              "id": "c32s2-r6-reversed-2",
              "icon": "net",
              "label": "net",
              "correct": false
            },
            {
              "id": "c32s2-r6-reversed-3",
              "icon": "egg",
              "label": "egg",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "star"
          }
        },
        {
          "id": "c32s2-r7-cycle",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c32s2-r7-cycle-s0-0",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s2-r7-cycle-s0-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c32s2-r7-cycle-s0-2",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                },
                {
                  "id": "c32s2-r7-cycle-s0-3",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "tuh",
              "options": [
                {
                  "id": "c32s2-r7-cycle-s1-0",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": true
                },
                {
                  "id": "c32s2-r7-cycle-s1-1",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c32s2-r7-cycle-s1-2",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c32s2-r7-cycle-s1-3",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c32s2-r7-cycle-s2-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c32s2-r7-cycle-s2-1",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                },
                {
                  "id": "c32s2-r7-cycle-s2-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s2-r7-cycle-s2-3",
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
                  "id": "c32s2-r7-cycle-s3-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c32s2-r7-cycle-s3-1",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s2-r7-cycle-s3-2",
                  "icon": "letterTile",
                  "label": "C",
                  "say": "kuh",
                  "correct": true
                },
                {
                  "id": "c32s2-r7-cycle-s3-3",
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
          "id": "c32s2-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 이 소리로 크게 외쳐보세요!",
          "words": [
            "string"
          ]
        }
      ],
      "recapKo": "STR 소리를 다시 연습했어요! 이제 STRING을 잘 만들 수 있어요.",
      "recapAudio": {
        "ko": "다시 연습했어요. 잘 들어보세요.",
        "en": [
          "string"
        ]
      }
    },
    {
      "id": "c32s3",
      "order": 3,
      "title": "Blend NCH",
      "villain": {
        "name": "Deadbolt",
        "art": "deadbolt",
        "style": "supervillain-stop"
      },
      "hero": {
        "name": "Bastion",
        "art": "bastion",
        "style": "superhero-shield"
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
          "id": "c32s3-teach",
          "kind": "teach",
          "art": "hero",
          "letter": "N",
          "repeatAudio": [
            "nnn"
          ],
          "instructionKo": "Bastion이 또 다른 두 소리를 보여줘요! 먼저 이 소리를 들어보세요."
        },
        {
          "id": "c32s3-r1",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "이 소리가 들어있는 단어예요! 따라 말해보세요.",
          "words": [
            "net",
            "nose"
          ]
        },
        {
          "id": "c32s3-break",
          "kind": "break",
          "art": "hero",
          "letter": "CH",
          "repeatAudio": [
            "ch"
          ],
          "instructionKo": "이번엔 다른 소리예요! 함께 들어볼까요?"
        },
        {
          "id": "c32s3-r2",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "\"hand\"와 같은 소리로 시작하는 걸 찾아보세요!",
          "promptAudio": "huh",
          "options": [
            {
              "id": "c32s3-r2-0",
              "icon": "egg",
              "label": "egg",
              "correct": false
            },
            {
              "id": "c32s3-r2-1",
              "icon": "bed",
              "label": "bed",
              "correct": false
            },
            {
              "id": "c32s3-r2-2",
              "icon": "hand",
              "label": "hand",
              "correct": true
            },
            {
              "id": "c32s3-r2-3",
              "icon": "tie",
              "label": "tie",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "hand"
          }
        },
        {
          "id": "c32s3-r3",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/m/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c32s3-r3-0",
              "icon": "map",
              "label": "map",
              "correct": true
            },
            {
              "id": "c32s3-r3-1",
              "icon": "egg",
              "label": "egg",
              "correct": false
            },
            {
              "id": "c32s3-r3-2",
              "icon": "man",
              "label": "man",
              "correct": true
            },
            {
              "id": "c32s3-r3-3",
              "icon": "bed",
              "label": "bed",
              "correct": false
            },
            {
              "id": "c32s3-r3-4",
              "icon": "moon",
              "label": "moon",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "map"
          }
        },
        {
          "id": "c32s3-r4-blend",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "N과 CH를 이어서 말하면 'NCH' 소리가 돼요! 천천히 따라 말해보세요.",
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
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "CH",
              "say": "ch"
            },
            "bench"
          ]
        },
        {
          "id": "c32s3-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "bench"
          ]
        }
      ],
      "recapKo": "N과 CH를 이으면 'NCH' 소리가 돼요! BENCH처럼요!",
      "recapAudio": {
        "ko": "두 소리를 이어봤어요. 잘 들어보세요.",
        "en": [
          "bench"
        ]
      }
    },
    {
      "id": "c32s4",
      "order": 4,
      "title": "Hero Training",
      "villain": {
        "name": "Snarltangle",
        "art": "snarltangle",
        "style": "supervillain-jumble"
      },
      "hero": {
        "name": "Voltbeam",
        "art": "voltbeam",
        "style": "superhero-thunder"
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
          "id": "c32s4-r1",
          "kind": "choose",
          "scored": true,
          "instructionKo": "STR과 NCH 소리를 다시 연습해요! 이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "sss",
          "options": [
            {
              "id": "c32s4-r1-1",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c32s4-r1-2",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c32s4-r1-3",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": false
            },
            {
              "id": "c32s4-r1-0",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": true
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "S",
            "say": "sss"
          }
        },
        {
          "id": "c32s4-r2",
          "kind": "choose",
          "scored": true,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "nnn",
          "options": [
            {
              "id": "c32s4-r2-0",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c32s4-r2-2",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c32s4-r2-3",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c32s4-r2-1",
              "icon": "letterTile",
              "label": "N",
              "say": "nnn",
              "correct": true
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "N",
            "say": "nnn"
          }
        },
        {
          "id": "c32s4-r3-multi",
          "kind": "multiselect",
          "scored": true,
          "hits": 1,
          "instructionKo": "/d/ 소리로 시작하는 걸 모두 고르고 ✓를 누르세요!",
          "options": [
            {
              "id": "c32s4-r3-multi-0",
              "icon": "door",
              "label": "door",
              "correct": true
            },
            {
              "id": "c32s4-r3-multi-1",
              "icon": "egg",
              "label": "egg",
              "correct": false
            },
            {
              "id": "c32s4-r3-multi-2",
              "icon": "dog",
              "label": "dog",
              "correct": true
            },
            {
              "id": "c32s4-r3-multi-3",
              "icon": "bed",
              "label": "bed",
              "correct": false
            },
            {
              "id": "c32s4-r3-multi-4",
              "icon": "duck",
              "label": "duck",
              "correct": true
            }
          ],
          "readAloud": {
            "targetText": "door"
          }
        },
        {
          "id": "c32s4-r4-hard",
          "kind": "choose",
          "scored": true,
          "instructionKo": "이 소리를 내는 글자를 고르고 ✓를 누르세요!",
          "promptAudio": "ch",
          "options": [
            {
              "id": "c32s4-r4-hard-0",
              "icon": "letterTile",
              "label": "S",
              "say": "sss",
              "correct": false
            },
            {
              "id": "c32s4-r4-hard-2",
              "icon": "letterTile",
              "label": "T",
              "say": "tuh",
              "correct": false
            },
            {
              "id": "c32s4-r4-hard-3",
              "icon": "letterTile",
              "label": "R",
              "say": "rrr",
              "correct": false
            },
            {
              "id": "c32s4-r4-hard-4",
              "icon": "letterTile",
              "label": "P",
              "say": "puh",
              "correct": false
            },
            {
              "id": "c32s4-r4-hard-1",
              "icon": "letterTile",
              "label": "CH",
              "say": "ch",
              "correct": true
            }
          ],
          "hits": 1,
          "readAloud": {
            "targetText": "CH",
            "say": "ch"
          }
        },
        {
          "id": "c32s4-r5-cycle",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c32s4-r5-cycle-s0-0",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s4-r5-cycle-s0-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c32s4-r5-cycle-s0-2",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                },
                {
                  "id": "c32s4-r5-cycle-s0-3",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c32s4-r5-cycle-s1-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c32s4-r5-cycle-s1-1",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s4-r5-cycle-s1-2",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c32s4-r5-cycle-s1-3",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "guh",
              "options": [
                {
                  "id": "c32s4-r5-cycle-s2-0",
                  "icon": "letterTile",
                  "label": "G",
                  "say": "guh",
                  "correct": true
                },
                {
                  "id": "c32s4-r5-cycle-s2-1",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c32s4-r5-cycle-s2-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s4-r5-cycle-s2-3",
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
                  "id": "c32s4-r5-cycle-s3-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c32s4-r5-cycle-s3-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": true
                },
                {
                  "id": "c32s4-r5-cycle-s3-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s4-r5-cycle-s3-3",
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
          "id": "c32s4-r6-listenrepeat",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "단어를 하나씩 따라 말해보세요!",
          "words": [
            "string",
            "bench"
          ]
        },
        {
          "id": "c32s4-finale",
          "kind": "finale",
          "scored": true,
          "hits": 1,
          "instructionKo": "마지막 공격! 큰 소리로 말해보세요!",
          "words": [
            "string"
          ]
        }
      ],
      "recapKo": "STR과 NCH를 다시 연습했어요! 이제 합체할 준비 완료예요!",
      "recapAudio": {
        "ko": "두 블렌드를 다시 연습했어요. 이제 준비됐어요.",
        "en": [
          "sss",
          "nnn"
        ]
      }
    },
    {
      "id": "c32s5",
      "order": 5,
      "title": "Boss: STRING and BENCH!",
      "villain": {
        "name": "Lord Static",
        "art": "lord-static",
        "style": "supervillain-king"
      },
      "hero": {
        "name": "Captain Glide",
        "art": "captain-glide",
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
          "id": "c32s5-teach",
          "kind": "teach",
          "instructionKo": "Glide + Bastion + Voltbeam이 합체해요! 먼저 STRING을 만들어요.",
          "repeatAudio": [
            "sss",
            "tuh",
            "rrr",
            "ihh",
            "ngh",
            "string"
          ]
        },
        {
          "id": "c32s5-r1-warmup",
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
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "NG",
              "say": "ngh"
            }
          ],
          "target": [
            "S",
            "T",
            "R",
            "I",
            "NG"
          ]
        },
        {
          "id": "c32s5-r2",
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
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "NG",
              "say": "ngh"
            },
            "string"
          ]
        },
        {
          "id": "c32s5-break",
          "kind": "break",
          "art": "hero",
          "instructionKo": "이번엔 BENCH예요! 함께 외쳐볼까요?",
          "repeatAudio": [
            "buh",
            "eh",
            "nnn",
            "ch",
            "bench"
          ]
        },
        {
          "id": "c32s5-r3-quickfire",
          "kind": "choose-sequence",
          "scored": true,
          "hits": 1,
          "instructionKo": "소리를 듣고 맞는 글자를 고르고 ✓를 누르세요! 지금까지 배운 글자도 나와요.",
          "steps": [
            {
              "promptAudio": "sss",
              "options": [
                {
                  "id": "c32s5-r3-quickfire-s0-0",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s5-r3-quickfire-s0-1",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c32s5-r3-quickfire-s0-2",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": true
                },
                {
                  "id": "c32s5-r3-quickfire-s0-3",
                  "icon": "letterTile",
                  "label": "P",
                  "say": "puh",
                  "correct": false
                }
              ]
            },
            {
              "promptAudio": "nnn",
              "options": [
                {
                  "id": "c32s5-r3-quickfire-s1-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c32s5-r3-quickfire-s1-1",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s5-r3-quickfire-s1-2",
                  "icon": "letterTile",
                  "label": "R",
                  "say": "rrr",
                  "correct": false
                },
                {
                  "id": "c32s5-r3-quickfire-s1-3",
                  "icon": "letterTile",
                  "label": "N",
                  "say": "nnn",
                  "correct": true
                }
              ]
            },
            {
              "promptAudio": "fff",
              "options": [
                {
                  "id": "c32s5-r3-quickfire-s2-0",
                  "icon": "letterTile",
                  "label": "F",
                  "say": "fff",
                  "correct": true
                },
                {
                  "id": "c32s5-r3-quickfire-s2-1",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c32s5-r3-quickfire-s2-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s5-r3-quickfire-s2-3",
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
                  "id": "c32s5-r3-quickfire-s3-0",
                  "icon": "letterTile",
                  "label": "S",
                  "say": "sss",
                  "correct": false
                },
                {
                  "id": "c32s5-r3-quickfire-s3-1",
                  "icon": "letterTile",
                  "label": "B",
                  "say": "buh",
                  "correct": true
                },
                {
                  "id": "c32s5-r3-quickfire-s3-2",
                  "icon": "letterTile",
                  "label": "T",
                  "say": "tuh",
                  "correct": false
                },
                {
                  "id": "c32s5-r3-quickfire-s3-3",
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
          "id": "c32s5-r4",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이번엔 글자가 섞여있어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "NG",
              "say": "ngh"
            },
            {
              "text": "I",
              "say": "ihh"
            },
            {
              "text": "R",
              "say": "rrr"
            },
            {
              "text": "T",
              "say": "tuh"
            },
            {
              "text": "S",
              "say": "sss"
            }
          ],
          "target": [
            "S",
            "T",
            "R",
            "I",
            "NG"
          ],
          "readAloud": {
            "targetText": "string"
          }
        },
        {
          "id": "c32s5-r5-wordspot",
          "kind": "choose",
          "scored": true,
          "hits": 1,
          "instructionKo": "진짜 단어를 찾아보세요!",
          "options": [
            {
              "id": "c32s5-w3",
              "icon": "letterTile",
              "label": "STRING",
              "correct": true
            },
            {
              "id": "c32s5-w1",
              "icon": "letterTile",
              "label": "TRINGS",
              "correct": false
            },
            {
              "id": "c32s5-w2",
              "icon": "letterTile",
              "label": "RINGST",
              "correct": false
            }
          ],
          "readAloud": {
            "targetText": "string"
          }
        },
        {
          "id": "c32s5-r6",
          "kind": "drag-build",
          "scored": true,
          "hits": 1,
          "instructionKo": "이제 BENCH를 만들어요! 순서대로 옮겨보세요.",
          "letters": [
            {
              "text": "CH",
              "say": "ch"
            },
            {
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "E",
              "say": "eh"
            },
            {
              "text": "B",
              "say": "buh"
            }
          ],
          "target": [
            "B",
            "E",
            "N",
            "CH"
          ],
          "readAloud": {
            "targetText": "bench"
          }
        },
        {
          "id": "c32s5-r7-bonus",
          "kind": "listen-repeat",
          "scored": true,
          "hits": 1,
          "instructionKo": "BENCH도 천천히 따라 말해보세요.",
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
              "text": "N",
              "say": "nnn"
            },
            {
              "text": "CH",
              "say": "ch"
            },
            "bench"
          ]
        },
        {
          "id": "c32s5-finale",
          "kind": "finale",
          "scored": true,
          "hits": 2,
          "instructionKo": "마지막 합체 공격! STRING! BENCH!",
          "words": [
            "string",
            "bench"
          ]
        }
      ],
      "recapKo": "S-T-R-I-NG는 STRING, B-E-N-CH는 BENCH! 단어 두 개를 만들었어요! 챕터 32 클리어!",
      "recapAudio": {
        "ko": "단어 두 개를 만들었어요! 잘 들어보세요.",
        "en": [
          "string",
          "bench"
        ]
      }
    }
  ]
}
