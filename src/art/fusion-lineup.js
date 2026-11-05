import { heroEmblem } from '../art.js'
import { WORLD_CHARACTER_ASSETS } from './world-character-assets.js'

// A sound still gets exactly one place in the fusion sequence. When two heroes
// teach that sound, show the world's newcomer instead of hiding it behind the
// earlier stage's hero. Replacing a Map value preserves the original sound order.
export function fusionLineup(stages) {
  const representatives = new Map()
  for (const stage of stages) {
    if (stage.chapterBoss || !stage.hero) continue
    const key = heroEmblem(stage.hero) || stage.hero.art
    if (!key) continue
    if (!representatives.has(key) || WORLD_CHARACTER_ASSETS[stage.hero.art]) {
      representatives.set(key, stage)
    }
  }
  return [...representatives.values()].slice(0, 3)
}
