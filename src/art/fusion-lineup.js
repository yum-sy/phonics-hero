import { heroEmblem } from '../art.js'

// The whole current team joins visually, even when two members teach the
// same sound. Returning heroes have stable per-chapter roster identities.
export function fusionLineup(stages) {
  const seen = new Set()
  return stages.filter(stage => {
    if (stage.chapterBoss || !stage.hero || seen.has(stage.hero.art)) return false
    seen.add(stage.hero.art)
    return true
  }).slice(0, 3)
}

// Learning order remains the original sound order, independent of the team.
export function fusionSounds(stages) {
  const seen = new Set()
  return stages.filter(stage => {
    if (stage.chapterBoss || !stage.hero) return false
    const key = heroEmblem(stage.hero) || stage.hero.art
    if (seen.has(key)) return false
    seen.add(key)
    return true
  }).slice(0, 3).map(stage => heroEmblem(stage.hero))
    .filter(sound => sound && sound !== '★')
}
