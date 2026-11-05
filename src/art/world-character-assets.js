// Per-world newcomers use stable art identities, preserving names and phonics
// badges. Each 5-column x 2-row sheet has ordinary heroes W1..W5 above the
// corresponding final bosses W1..W5. No curriculum import is needed at runtime.
// Stage-4 hero slugs are replaced. Ch13 intentionally shares beacon across
// stages 1, 2 and 4, so all three receive that world's newcomer. Fusion lineup
// deduplication must prefer these newcomers when another hero shares a sound.
export const WORLD_CHARACTER_ASSETS = {
  'turbo': { family: 'robot', sheet: 'robot-worlds', slot: 0 }, // World 1, chapter 1, hero
  'dark-spark': { family: 'robot', sheet: 'robot-worlds', slot: 5 }, // World 1, chapter 1, boss
  'nord': { family: 'comic', sheet: 'comic-worlds', slot: 0 }, // World 1, chapter 2, hero
  'shadow-king': { family: 'comic', sheet: 'comic-worlds', slot: 5 }, // World 1, chapter 2, boss
  'huey': { family: 'dino', sheet: 'dino-worlds', slot: 0 }, // World 1, chapter 3, hero
  'shadow-rex': { family: 'dino', sheet: 'dino-worlds', slot: 5 }, // World 1, chapter 3, boss
  'drillo': { family: 'pixel', sheet: 'pixel-worlds', slot: 0 }, // World 1, chapter 4, hero
  'pixel-muncher': { family: 'pixel', sheet: 'pixel-worlds', slot: 5 }, // World 1, chapter 4, boss
  'umo': { family: 'brick', sheet: 'brick-worlds', slot: 0 }, // World 1, chapter 5, hero
  'bug-king': { family: 'brick', sheet: 'brick-worlds', slot: 5 }, // World 1, chapter 5, boss
  'bobo': { family: 'career', sheet: 'career-worlds', slot: 0 }, // World 1, chapter 6, hero
  'wind-down': { family: 'career', sheet: 'career-worlds', slot: 5 }, // World 1, chapter 6, boss
  'cloak': { family: 'deco', sheet: 'deco-worlds', slot: 0 }, // World 1, chapter 7, hero
  'nightfall': { family: 'deco', sheet: 'deco-worlds', slot: 5 }, // World 1, chapter 7, boss
  'nord-c8': { family: 'comic', sheet: 'comic-worlds', slot: 1 }, // World 2, chapter 8, hero
  'king-static': { family: 'comic', sheet: 'comic-worlds', slot: 6 }, // World 2, chapter 8, boss
  'wingo': { family: 'dino', sheet: 'dino-worlds', slot: 1 }, // World 2, chapter 9, hero
  'bonecrash': { family: 'dino', sheet: 'dino-worlds', slot: 6 }, // World 2, chapter 9, boss
  'blocky': { family: 'brick', sheet: 'brick-worlds', slot: 1 }, // World 2, chapter 10, hero
  'glitchking': { family: 'brick', sheet: 'brick-worlds', slot: 6 }, // World 2, chapter 10, boss
  'blocko-jr': { family: 'career', sheet: 'career-worlds', slot: 1 }, // World 2, chapter 11, hero
  'windup-duke': { family: 'career', sheet: 'career-worlds', slot: 6 }, // World 2, chapter 11, boss
  'stormer': { family: 'robot', sheet: 'robot-worlds', slot: 1 }, // World 2, chapter 12, hero
  'overclock': { family: 'robot', sheet: 'robot-worlds', slot: 6 }, // World 2, chapter 12, boss
  'beacon': { family: 'deco', sheet: 'deco-worlds', slot: 1 }, // World 2, chapter 13, hero
  'nightshade': { family: 'deco', sheet: 'deco-worlds', slot: 6 }, // World 2, chapter 13, boss
  'drillbit': { family: 'pixel', sheet: 'pixel-worlds', slot: 1 }, // World 2, chapter 14, hero
  'glitch-emperor': { family: 'pixel', sheet: 'pixel-worlds', slot: 6 }, // World 2, chapter 14, boss
  'skyfin-c15': { family: 'dino', sheet: 'dino-worlds', slot: 2 }, // World 3, chapter 15, hero
  'voidrex-c15': { family: 'dino', sheet: 'dino-worlds', slot: 7 }, // World 3, chapter 15, boss
  'nightveil-c16': { family: 'deco', sheet: 'deco-worlds', slot: 2 }, // World 3, chapter 16, hero
  'duskfall-c16': { family: 'deco', sheet: 'deco-worlds', slot: 7 }, // World 3, chapter 16, boss
  'stax-c17': { family: 'career', sheet: 'career-worlds', slot: 2 }, // World 3, chapter 17, hero
  'windup-king-c17': { family: 'career', sheet: 'career-worlds', slot: 7 }, // World 3, chapter 17, boss
  'drillbit-c18': { family: 'pixel', sheet: 'pixel-worlds', slot: 2 }, // World 3, chapter 18, hero
  'munchor-c18': { family: 'pixel', sheet: 'pixel-worlds', slot: 7 }, // World 3, chapter 18, boss
  'voltarc-c19': { family: 'comic', sheet: 'comic-worlds', slot: 2 }, // World 3, chapter 19, hero
  'umbraking-c19': { family: 'comic', sheet: 'comic-worlds', slot: 7 }, // World 3, chapter 19, boss
  'chromewing-c20': { family: 'robot', sheet: 'robot-worlds', slot: 2 }, // World 3, chapter 20, hero
  'direforge-c20': { family: 'robot', sheet: 'robot-worlds', slot: 7 }, // World 3, chapter 20, boss
  'blockhart-c21': { family: 'brick', sheet: 'brick-worlds', slot: 2 }, // World 3, chapter 21, hero
  'glitchmar-c21': { family: 'brick', sheet: 'brick-worlds', slot: 7 }, // World 3, chapter 21, boss
  'drillbit-c28': { family: 'pixel', sheet: 'pixel-worlds', slot: 3 }, // World 4, chapter 22, hero
  'static-muncher': { family: 'pixel', sheet: 'pixel-worlds', slot: 8 }, // World 4, chapter 22, boss
  'quill-c23': { family: 'deco', sheet: 'deco-worlds', slot: 3 }, // World 4, chapter 23, hero
  'umbral-king': { family: 'deco', sheet: 'deco-worlds', slot: 8 }, // World 4, chapter 23, boss
  'pip-c24': { family: 'comic', sheet: 'comic-worlds', slot: 3 }, // World 4, chapter 24, hero
  'overload-prime': { family: 'comic', sheet: 'comic-worlds', slot: 8 }, // World 4, chapter 24, boss
  'blocky-c25': { family: 'brick', sheet: 'brick-worlds', slot: 3 }, // World 4, chapter 25, hero
  'glitchsink': { family: 'brick', sheet: 'brick-worlds', slot: 8 }, // World 4, chapter 25, boss
  'wingo-c26': { family: 'dino', sheet: 'dino-worlds', slot: 3 }, // World 4, chapter 26, hero
  'boneshade': { family: 'dino', sheet: 'dino-worlds', slot: 8 }, // World 4, chapter 26, boss
  'blocko-jr-c27': { family: 'career', sheet: 'career-worlds', slot: 3 }, // World 4, chapter 27, hero
  'windup-baron': { family: 'career', sheet: 'career-worlds', slot: 8 }, // World 4, chapter 27, boss
  'cragrunner': { family: 'robot', sheet: 'robot-worlds', slot: 3 }, // World 4, chapter 28, hero
  'voltmaw': { family: 'robot', sheet: 'robot-worlds', slot: 8 }, // World 4, chapter 28, boss
  'halcyon': { family: 'deco', sheet: 'deco-worlds', slot: 4 }, // World 5, chapter 29, hero
  'duskfang-c29': { family: 'deco', sheet: 'deco-worlds', slot: 9 }, // World 5, chapter 29, boss
  'coggo': { family: 'brick', sheet: 'brick-worlds', slot: 4 }, // World 5, chapter 30, hero
  'faultline': { family: 'brick', sheet: 'brick-worlds', slot: 9 }, // World 5, chapter 30, boss
  'ratchett': { family: 'robot', sheet: 'robot-worlds', slot: 4 }, // World 5, chapter 31, hero
  'voltrust': { family: 'robot', sheet: 'robot-worlds', slot: 9 }, // World 5, chapter 31, boss
  'voltbeam': { family: 'comic', sheet: 'comic-worlds', slot: 4 }, // World 5, chapter 32, hero
  'lord-static': { family: 'comic', sheet: 'comic-worlds', slot: 9 }, // World 5, chapter 32, boss
  'skyra': { family: 'dino', sheet: 'dino-worlds', slot: 4 }, // World 5, chapter 33, hero
  'voidjaw': { family: 'dino', sheet: 'dino-worlds', slot: 9 }, // World 5, chapter 33, boss
}

export const WORLD_CHARACTER_ASSET_METADATA = {
  "columns": 5,
  "rows": 2,
  "slotOrder": "Top row: World 1..5 ordinary heroes; bottom row: World 1..5 final bosses",
  "generatedCharacters": 70,
  "mappedCharacters": 66,
  "reserved": [
    {
      "family": "pixel",
      "sheet": "pixel-worlds",
      "world": 5,
      "slots": [
        4,
        9
      ],
      "reason": "World 5 has no pixel-monster chapter"
    },
    {
      "family": "career",
      "sheet": "career-worlds",
      "world": 5,
      "slots": [
        4,
        9
      ],
      "reason": "World 5 has no career chapter"
    }
  ],
  "sharedOrdinaryHeroReplacements": [
    {
      "chapter": 13,
      "art": "beacon",
      "positions": [
        1,
        2,
        4
      ]
    }
  ],
  "fusionRepresentativePreferenceChapters": [
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    23,
    24,
    25,
    26,
    27,
    28
  ]
}
