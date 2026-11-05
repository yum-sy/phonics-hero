// Run after atlas generation: node scripts/check-world-characters.mjs
// Exit 2 means asset generation/integration is still pending, not a passing test.
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'

const root = fileURLToPath(new URL('../', import.meta.url))
const pending = []
const report = { passed: false, pending, checks: {} }

async function json(path) {
  return JSON.parse(await readFile(join(root, path), 'utf8'))
}

async function optionalJson(path) {
  try { return await json(path) }
  catch (error) {
    if (error.code !== 'ENOENT') throw error
    pending.push(path)
    return {}
  }
}

try {
  const [{ chapters, validateChapters }, { CHARACTER_ASSETS }, {
    WORLD_CHARACTER_ASSETS: worldAssets, WORLD_CHARACTER_ASSET_METADATA: metadata,
  }] = await Promise.all([
    import('../src/data/chapters/index.js'),
    import('../src/art/character-assets.js'),
    import('../src/art/world-character-assets.js'),
  ])
  const { wordIconKeys } = await import('../src/icons.js')
  assert.deepEqual(validateChapters(chapters, wordIconKeys), [], 'Chapter contract errors')
  const characters = new Map()
  for (const chapter of chapters) for (const stage of chapter.stages) {
    for (const role of ['hero', 'villain']) {
      const spec = stage[role]
      const prior = characters.get(spec.art)
      assert(!prior || prior.role === role, `Hero/villain slug collision: ${spec.art}`)
      characters.set(spec.art, { role, spec })
      assert(CHARACTER_ASSETS[spec.art], `Missing baseline asset: ${spec.art}`)
    }
  }
  assert.equal(characters.size, 295)
  assert.equal(Object.keys(CHARACTER_ASSETS).length, 295)
  assert.equal(Object.keys(worldAssets).length, 66)
  const selectedHeroes = new Set(), selectedBosses = new Set(), worldSlots = new Set()
  for (const chapter of chapters) {
    const world = Math.floor((chapter.order - 1) / 7) + 1
    const hero = chapter.stages[3].hero.art
    const boss = chapter.stages.find(stage => stage.chapterBoss).villain.art
    for (const [art, expectedSlot] of [[hero, world - 1], [boss, world + 4]]) {
      const asset = worldAssets[art]
      assert(asset, `Missing world asset: ${art}`)
      assert.equal(asset.family, CHARACTER_ASSETS[art].family)
      assert.equal(asset.sheet, `${asset.family}-worlds`)
      assert.equal(asset.slot, expectedSlot, `Wrong world slot: ${art}`)
      const key = `${asset.sheet}:${asset.slot}`
      assert(!worldSlots.has(key), `Shared world asset: ${key}`)
      worldSlots.add(key)
    }
    selectedHeroes.add(hero); selectedBosses.add(boss)
  }
  assert.equal(selectedHeroes.size, 33)
  assert.equal(selectedBosses.size, 33)
  assert.equal(metadata.columns, 5); assert.equal(metadata.rows, 2)
  assert.equal(metadata.generatedCharacters, 70); assert.equal(metadata.mappedCharacters, 66)
  const reserved = metadata.reserved.flatMap(entry => entry.slots.map(slot => `${entry.sheet}:${slot}`))
  assert.deepEqual(reserved.sort(), ['career-worlds:4', 'career-worlds:9', 'pixel-worlds:4', 'pixel-worlds:9'])
  for (const key of reserved) assert(!worldSlots.has(key), `Reserved slot is in use: ${key}`)
  report.checks.mapping = { characters: 295, newHeroes: 33, finalBosses: 33, reserved: 4 }

  const baselineFrames = await json('src/art/atlas-frames.json')
  const worldFrames = await optionalJson('src/art/world-atlas-frames.json')
  let pngCount = 0, frameCount = 0
  for (const [sheet, data] of Object.entries({ ...baselineFrames, ...worldFrames })) {
    const isWorld = sheet.endsWith('-worlds')
    const path = `public/art/${isWorld ? 'v3' : 'v2'}/${sheet}.png`
    let png
    try { png = await readFile(join(root, path)) }
    catch (error) {
      if (error.code !== 'ENOENT') throw error
      pending.push(path); continue
    }
    assert.equal(png.subarray(0, 8).toString('hex'), '89504e470d0a1a0a', `Not PNG: ${path}`)
    assert.equal(png.toString('ascii', 12, 16), 'IHDR', `Missing IHDR: ${path}`)
    assert.equal(data.width, png.readUInt32BE(16), `PNG width mismatch: ${sheet}`)
    assert.equal(data.height, png.readUInt32BE(20), `PNG height mismatch: ${sheet}`)
    assert.equal(data.frames.length, isWorld ? 10 : sheet === 'career' ? 12 : 9, `Frame count: ${sheet}`)
    for (const [slot, frame] of data.frames.entries()) {
      assert.equal(frame.length, 4)
      const [x, y, width, height] = frame
      assert(frame.every(Number.isInteger), `Non-integer frame: ${sheet}:${slot}`)
      assert(x >= 0 && y >= 0 && width > 0 && height > 0 && x + width <= data.width && y + height <= data.height,
        `Frame out of bounds: ${sheet}:${slot}`)
      frameCount++
    }
    pngCount++
  }
  for (const asset of Object.values(worldAssets)) {
    if (!worldFrames[asset.sheet]) pending.push(`world frame metadata: ${asset.sheet}`)
    else assert(worldFrames[asset.sheet].frames[asset.slot], `Missing frame: ${asset.sheet}:${asset.slot}`)
  }
  pending.splice(0, pending.length, ...new Set(pending))
  report.checks.pngHeaders = { pngCount, frameCount }

  let art, fusionLineup
  try {
    art = await import('../src/art.js')
    ;({ fusionLineup } = await import('../src/art/fusion-lineup.js'))
  } catch (error) {
    if (error.code !== 'ERR_MODULE_NOT_FOUND' && error.code !== 'ENOENT') throw error
    pending.push(`runtime integration: ${error.message}`)
  }
  if (art && fusionLineup) {
    const inventory = await json('design/character-inventory.json')
    let heroCount = 0
    for (const entry of inventory.characters.filter(character => character.role === 'hero')) {
      const spec = characters.get(entry.art).spec
      assert.equal(String(art.heroEmblem(spec)), entry.renderedText[0], `Changed phonics emblem: ${entry.art}`)
      heroCount++
    }
    assert.equal(heroCount, 130)
    const sound = stage => art.heroEmblem(stage.hero) || stage.hero.art
    for (const chapter of chapters) {
      const seen = new Set()
      const before = chapter.stages.filter(stage => !stage.chapterBoss).filter(stage => {
        const key = sound(stage)
        if (!key || seen.has(key)) return false
        seen.add(key); return true
      }).slice(0, 3)
      const after = fusionLineup(chapter.stages)
      assert.deepEqual(after.map(sound), before.map(sound), `Fusion sound order/count: chapter ${chapter.order}`)
      assert.equal(new Set(after.map(sound)).size, after.length, `Duplicate fusion sound: chapter ${chapter.order}`)
      assert(after.some(stage => stage.hero.art === chapter.stages[3].hero.art), `New hero absent from fusion: chapter ${chapter.order}`)
    }
    report.checks.emblemsAndFusion = { emblemsPreserved: heroCount, chaptersPassed: chapters.length }
    if (!pending.length) {
      for (const [slug, { role, spec }] of characters) {
        const rendered = art[`${role}Art`](spec)
        const asset = worldAssets[slug] || CHARACTER_ASSETS[slug]
        const sheet = asset.sheet || asset.family
        const version = asset.sheet ? 'v3' : 'v2'
        assert(rendered.includes(`/art/${version}/${sheet}.png`), `Renderer uses wrong sheet: ${slug}`)
        assert(rendered.includes(`data-art-slot="${asset.slot}"`), `Renderer uses wrong slot: ${slug}`)
      }
      assert.equal(pngCount, 14); assert.equal(frameCount, 136)
      report.checks.renderedCharacters = characters.size
    }
  }
  report.passed = pending.length === 0
  console.log(JSON.stringify(report, null, 2))
  process.exitCode = report.passed ? 0 : 2
} catch (error) {
  report.error = error.stack
  console.error(JSON.stringify(report, null, 2))
  process.exitCode = 1
}
