// Chapter-by-chapter Korean -> English transition (user decision, 2026-11-07).
//
// Audio switches FIRST and all at once: chapters 1-5 speak Korean, chapter 6
// onward speaks the English phrase (the generated Nova clip when it exists,
// system TTS until then). Text follows family by family so the child meets
// each English sentence next to the Korean it already knows:
//   1-5   ko      Korean only
//   6-7   en-ko   English primary + Korean subtitle, once the family switched
//                 (even-ranked families at 6, odd-ranked at 7; rank = how
//                 frequent the family is, 0 = most frequent)
//   8-14  fade    the Korean subtitle drops family by family at
//                 8 + (rank % 7); by chapter 14 every family is English only
//   15+   en      English only
// A string the phrasebook does not know keeps its Korean text in every
// chapter and is still spoken in Korean -- never a crash, never a blank.
export const KO_ONLY_MAX_CHAPTER = 5
export const BILINGUAL_MAX_CHAPTER = 7
export const FADE_MAX_CHAPTER = 14

export function audioLang(chapterOrder) {
  return chapterOrder <= KO_ONLY_MAX_CHAPTER ? 'ko' : 'en'
}

export function textModeForRank(chapterOrder, rank) {
  if (!Number.isInteger(rank) || rank < 0) return 'ko'
  if (chapterOrder <= KO_ONLY_MAX_CHAPTER) return 'ko'
  if (chapterOrder > FADE_MAX_CHAPTER) return 'en'
  if (chapterOrder <= BILINGUAL_MAX_CHAPTER) {
    const switchAt = rank % 2 === 0 ? KO_ONLY_MAX_CHAPTER + 1 : BILINGUAL_MAX_CHAPTER
    return chapterOrder >= switchAt ? 'en-ko' : 'ko'
  }
  const dropAt = BILINGUAL_MAX_CHAPTER + 1 + (rank % 7)
  return chapterOrder >= dropAt ? 'en' : 'en-ko'
}

// `phrase` is phrasebook.js's phraseFor() result (or null for unknown text).
export function textMode(chapterOrder, phrase) {
  if (!phrase || typeof phrase.en !== 'string' || !phrase.en) return 'ko'
  return textModeForRank(chapterOrder, phrase.rank)
}

export function describePolicy(maxRank = 14, maxChapter = 16) {
  const rows = []
  for (let chapter = 1; chapter <= maxChapter; chapter++) {
    const modes = {}
    for (let rank = 0; rank < maxRank; rank++) modes[rank] = textModeForRank(chapter, rank)
    rows.push({ chapter, audio: audioLang(chapter), modes })
  }
  return rows
}
