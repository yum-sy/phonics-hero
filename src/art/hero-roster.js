import { CHARACTER_ASSETS } from './character-assets.js'
import { WORLD_CHARACTER_ASSETS } from './world-character-assets.js'

// A chapter role keeps its original sound identity while its returning hero
// carries appearance and name forward. No curriculum or audio content lives here.
export const HERO_ROSTER = Object.create(null)
export const HERO_ROSTER_BASELINES = new Map()
const instructionRoles = new Map()

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
    const originalTeam = [...new Set([0, 2, 3].map(i => original[i].hero.name))]
    const currentTeam = [0, 2, 3].map(i => stages[i].hero.name)
    for (const [i, stage] of stages.entries()) instructionRoles.set(stage.id, {
      originalName: original[i].hero.name, currentName: stage.hero.name,
      originalTeam, currentTeam, boss: !!stage.chapterBoss, rotated: !!prior,
    })
    previous.set(family, stages)
    return { ...chapter, stages }
  })
}

const escapePattern = text => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

// Display-only story references: learning words, phoneme prompts, source data
// and generated speech remain untouched. Korean particles attach to 히어로,
// rather than guessing how an English proper name should be pronounced.
export function rosterInstruction(stageId, text) {
  const role = instructionRoles.get(stageId)
  if (!role?.rotated || typeof text !== 'string') return text
  if (role.boss) {
    const names = role.originalTeam.map(escapePattern).join('|')
    const list = new RegExp(`^(?:${names})(?:\\s*\\+\\s*(?:${names})){1,2}[이가](?=\\s*(?:최후의\\s*)?합체)`)
    return text.replace(list, `${role.currentTeam.join(' + ')}, 세 히어로가`)
  }
  if (role.originalName === role.currentName) return text
  const mention = new RegExp(`(^|[^A-Za-z0-9])${escapePattern(role.originalName)}(가|이|는|은|를|을|와|과|의|에게)(?=\\s|$)`, 'g')
  const particles = { 이:'가', 은:'는', 을:'를', 과:'와' }
  return text.replace(mention, (_, prefix, particle) => `${prefix}${role.currentName} 히어로${particles[particle] || particle}`)
}
