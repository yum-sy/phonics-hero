import assert from 'node:assert/strict'
import { chapters, validateChapters } from '../src/data/chapters/index.js'
import { wordIconKeys } from '../src/icons.js'
import { HERO_ROSTER, applyHeroRotation, rosterInstruction } from '../src/art/hero-roster.js'
import { WORLD_CHARACTER_ASSETS } from '../src/art/world-character-assets.js'
import { CHARACTER_ASSETS } from '../src/art/character-assets.js'
import { heroArt, heroEmblem } from '../src/art.js'
import { fusionLineup, fusionSounds } from '../src/art/fusion-lineup.js'

const originals = await Promise.all(chapters.map(async chapter => {
  const module = await import(`../src/data/chapters/chapter-${String(chapter.order).padStart(2, '0')}.js`)
  return module[`chapter${chapter.order}`]
}))
const before = JSON.stringify(originals)
const asset = hero => HERO_ROSTER[hero.art]?.asset || WORLD_CHARACTER_ASSETS[hero.art] || CHARACTER_ASSETS[hero.art]
const visual = hero => JSON.stringify(asset(hero))
const withoutHero = stage => { const { hero, ...rest } = stage; return rest }
const previous = new Map()
let rotations = 0, preservedSounds = 0
for (const [index, chapter] of chapters.entries()) {
  const raw = originals[index]
  assert.deepEqual(chapter.stages.map(withoutHero), raw.stages.map(withoutHero), `Learning content changed: ${chapter.id}`)
  for (const [i, stage] of chapter.stages.entries()) {
    assert(Object.keys(stage.hero).every(key => ['art', 'name', 'style'].includes(key)))
    assert(stage.hero.art && stage.hero.name)
    assert.equal(heroEmblem(stage.hero), heroEmblem(raw.stages[i].hero), `Sound changed: ${stage.id}`)
    preservedSounds++
  }
  // Display prose names no character (old or rotated) -- it says 히어로 --
  // so rosterInstruction() is a passthrough and nothing may leak a name.
  const heroNames = [...new Set([...chapter.stages, ...raw.stages].map(s => s.hero.name))]
  for (const stage of chapter.stages) {
    for (const text of [stage.recapKo, ...stage.beats.map(b => b.instructionKo)]) {
      if (typeof text !== 'string') continue
      assert.equal(rosterInstruction(stage.id, text), text, `Instruction rewritten: ${stage.id}`)
      for (const name of heroNames) {
        assert(!new RegExp(`(^|[^A-Za-z0-9])${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(가|이|는|은|를|을|와|과|의|에게|,|\\s*\\+)`).test(text), `Hero name in prose: ${stage.id} "${text}"`)
      }
    }
  }
  assert.deepEqual(chapter.stages[4], raw.stages[4], `Fusion stage changed: ${chapter.id}`)
  const family = asset(chapter.stages[3].hero).family
  const prior = previous.get(family)
  const team = [0, 2, 3].map(i => chapter.stages[i])
  assert.equal(new Set(team.map(s => visual(s.hero))).size, 3, `Repeated team appearance: ${chapter.id}`)
  assert.equal(new Set(team.map(s => s.hero.name)).size, 3, `Repeated team name: ${chapter.id}`)
  if (prior) {
    for (const [to, from] of [[0, 2], [1, 2], [2, 3]]) {
      assert.equal(visual(chapter.stages[to].hero), visual(prior.stages[from].hero), `Returning appearance: ${chapter.id}/${to}`)
      assert.equal(chapter.stages[to].hero.name, prior.stages[from].hero.name, `Returning name: ${chapter.id}/${to}`)
    }
    assert(!team.some(s => visual(s.hero) === visual(prior.stages[0].hero)), `Retired leader remains: ${chapter.id}`)
    rotations++
  } else assert.deepEqual(chapter, raw, `First theme changed: ${chapter.id}`)
  assert.equal(visual(chapter.stages[3].hero), visual(raw.stages[3].hero), `Newcomer changed: ${chapter.id}`)
  assert.deepEqual(fusionLineup(chapter.stages).map(s => s.id), team.map(s => s.id))
  const originalSounds = [...new Set(raw.stages.filter(s => !s.chapterBoss).map(s => heroEmblem(s.hero)))].slice(0, 3).filter(s => s && s !== '★')
  assert.deepEqual(fusionSounds(chapter.stages), originalSounds, `Learning strip changed: ${chapter.id}`)
  for (const s of team) {
    const svg = heroArt(s.hero), frame = asset(s.hero)
    assert(svg.includes(`data-art-slot="${frame.slot}"`))
    assert(svg.includes(`/art/${frame.sheet ? 'v3' : 'v2'}/${frame.sheet || frame.family}.png`))
    assert(!/<text\b/.test(svg))
  }
  previous.set(family, chapter)
}
assert.equal(rosterInstruction('c33s1', 'Blaze가 두 소리를 들려줘요.'), 'Blaze가 두 소리를 들려줘요.')
assert.equal(rotations, 26)
assert.equal(preservedSounds, 165)
assert.equal(Object.keys(HERO_ROSTER).length, 52)
assert.equal(JSON.stringify(originals), before, 'Original chapters mutated')
assert.deepEqual(applyHeroRotation(originals), chapters, 'Repeated initialization changes roster')
assert.equal(JSON.stringify(originals), before, 'Repeated initialization mutates originals')
assert.deepEqual(validateChapters(chapters, wordIconKeys), [])
console.log(JSON.stringify({ passed: true, chapters: chapters.length, rotations, aliases: Object.keys(HERO_ROSTER).length, preservedSounds, currentTeamFusion: 33, originalContentUnchanged: true, repeatInitializationStable: true }, null, 2))
