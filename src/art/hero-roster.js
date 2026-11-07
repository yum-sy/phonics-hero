import { CHARACTER_ASSETS } from './character-assets.js'
import { WORLD_CHARACTER_ASSETS } from './world-character-assets.js'

// A chapter role keeps its original sound identity while its returning hero
// carries appearance and name forward. No curriculum or audio content lives here.
export const HERO_ROSTER = Object.create(null)
export const HERO_ROSTER_BASELINES = new Map()

const assetFor = hero => HERO_ROSTER[hero.art]?.asset
  || WORLD_CHARACTER_ASSETS[hero.art] || CHARACTER_ASSETS[hero.art]
const roman = n => ['','I','II','III','IV','V','VI'][n] || String(n)

export function applyHeroRotation(chapters) {
  const previous = new Map()
  const introducedNames = new Map()
  return chapters.map(chapter => {
    const original = chapter.stages
    for (const stage of original) HERO_ROSTER_BASELINES.set(stage.id, { ...stage.hero })
    const family = assetFor(original[3].hero).family
    const prior = previous.get(family)
    const names = introducedNames.get(family) || new Map()
    introducedNames.set(family, names)
    const stages = original.map(stage => ({ ...stage, hero: { ...stage.hero } }))
    if (!prior) {
      for (const index of [0, 2, 3]) {
        const name = stages[index].hero.name
        names.set(name, (names.get(name) || 0) + 1)
      }
    } else {
      for (const [positions, returning] of [[[0, 1], prior[2].hero], [[2], prior[3].hero]]) {
        for (const index of positions) {
          const soundRole = original[index].hero
          const alias = `${soundRole.art}-roster-c${chapter.order}-p${index < 2 ? 1 : 3}`
          HERO_ROSTER[alias] = Object.freeze({
            asset: Object.freeze({ ...assetFor(returning) }),
            soundArt: soundRole.art,
            returningArt: returning.art,
          })
          stages[index].hero = { name: returning.name, art: alias, style: soundRole.style }
        }
      }
      const name = stages[3].hero.name
      const count = (names.get(name) || 0) + 1
      names.set(name, count)
      if (count > 1) stages[3].hero.name = `${name} ${roman(count)}`
    }
    previous.set(family, stages)
    return { ...chapter, stages }
  })
}

// Passthrough: instructionKo/recapKo no longer name any character (they say
// 히어로/세 히어로 instead), so there is nothing to rewrite per rotated stage.
// Kept as an export only because screens.js still wraps every instruction in it.
export function rosterInstruction(stageId, text) {
  return text
}
