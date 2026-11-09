// Publish locally generated candidates after WAV/codec checks. No API requests.
// Listening/iPad approval remains separate from these automated checks.
import assert from 'node:assert/strict'
import { measureWav, prepareNarrationWav } from './narration-wav.mjs'
import { narrationRequest } from './narration-request.mjs'
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir, rename, mkdtemp, rm, readdir } from 'node:fs/promises'
import { execFileSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { tmpdir } from 'node:os'

const root = fileURLToPath(new URL('../', import.meta.url))
const hash = value => createHash('sha256').update(value).digest('hex')
const args = process.argv.slice(2), options = {}
for (let i = 0; i < args.length; i++) {
  if (args[i] === '--available') options.available = true
  else if (['--model', '--voice'].includes(args[i]) && args[i + 1]) options[args[i++].slice(2)] = args[i]
  else throw new Error('Use --model MODEL --voice VOICE [--available]')
}
const model = options.model, voice = options.voice || 'nova'
assert(model && /^[a-zA-Z0-9._-]+$/.test(model), 'Explicit model required')
assert(/^[a-zA-Z0-9._-]+$/.test(voice))
const inventory = JSON.parse(await readFile(join(root, 'design/audio/narration-inventory.json'), 'utf8'))
const protectedKeys = new Set(inventory.protectedRecordings.map(x => x.key))
for (const recording of inventory.protectedRecordings) {
  assert(/^[a-z]+$/.test(recording.key))
  assert.equal(recording.path, `public/sounds/${recording.key}.wav`)
  assert.equal(hash(await readFile(join(root, recording.path))), recording.sha256)
}

// The raw WAV cache (design/audio/generated/, gitignored) does not travel with
// the repo. An entry whose cache is missing but whose published m4a already
// exists for the same lang+text (sha256 intact, same model/voice) is kept as
// published rather than treated as pending -- otherwise every machine without
// the cache would have to re-buy the whole library to add a single clip.
const existingManifest = await readFile(join(root, 'public/narration/manifest.json'), 'utf8').then(JSON.parse).catch(() => null)
const existingByKey = new Map((existingManifest?.entries || []).map(e => [`${e.lang}\0${e.text}`, e]))
const candidates = [], pending = [], kept = []
for (const entry of inventory.entries) {
  assert(/^(en|ko)-[a-f0-9]{16}$/.test(entry.id))
  assert(!protectedKeys.has(entry.text))
  const request = narrationRequest(entry, model, voice)
  const requestHash = hash(JSON.stringify(request))
  const basename = `${entry.id}-${requestHash.slice(0, 16)}`
  // Adding clips must not re-encode already validated, identical requests.
  const prior = existingByKey.get(`${entry.lang}\0${entry.text}`)
  if (prior?.requestHash === requestHash && prior.model === model && prior.voice === voice) {
    const bytes = await readFile(join(root, 'public/narration', prior.file)).catch(e => { if (e.code !== 'ENOENT') throw e; return null })
    if (bytes && hash(bytes) === prior.sha256) { kept.push({ ...prior, id: entry.id }); continue }
  }
  const wav = join(root, 'design/audio/generated', `${basename}.wav`)
  let metadata, bytes
  try {
    metadata = JSON.parse(await readFile(join(root, 'design/audio/generated', `${basename}.json`), 'utf8'))
    bytes = await readFile(wav)
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
    const published = existingByKey.get(`${entry.lang}\0${entry.text}`)
    if (published && published.model === model && published.voice === voice) {
      let bytes = null
      try { bytes = await readFile(join(root, 'public/narration', published.file)) } catch (e) { if (e.code !== 'ENOENT') throw e }
      if (bytes && hash(bytes) === published.sha256) { kept.push({ ...published, id: entry.id }); continue }
    }
    pending.push(entry.id); continue
  }
  assert.equal(metadata.requestHash, requestHash)
  assert.equal(metadata.sha256, hash(bytes))
  try { candidates.push({ entry, basename, wav, raw: measureWav(bytes), requestHash, sourceSha256: metadata.sha256 }) }
  catch (error) { pending.push(entry.id); console.log(`Rejected ${entry.id}: ${error.message}`) }
}
if (pending.length && !options.available) throw new Error(`${pending.length} files pending; no manifest published`)
assert(candidates.length || kept.length, 'No generated candidates available')
const output = join(root, 'public/narration')
await mkdir(output, { recursive: true })
const temporary = await mkdtemp(join(tmpdir(), 'phonics-narration-'))
const entries = []
try {
  for (const candidate of candidates) {
    const { entry, basename, wav, raw, requestHash, sourceSha256 } = candidate
    const file = `${basename}-p2.m4a`, temporaryM4a = join(temporary, file), decoded = join(temporary, 'decoded.wav')
    const prepared = prepareNarrationWav(await readFile(wav)), preparedFile = join(temporary, 'prepared.wav')
    await writeFile(preparedFile, prepared.bytes)
    execFileSync('/usr/bin/afconvert', ['-f', 'm4af', '-d', 'aac', '-b', '64000', preparedFile, temporaryM4a], { stdio: 'pipe' })
    execFileSync('/usr/bin/afconvert', ['-f', 'WAVE', '-d', 'LEI16', temporaryM4a, decoded], { stdio: 'pipe' })
    const decodedMeasures = measureWav(await readFile(decoded))
    assert(Math.abs(decodedMeasures.durationMs - prepared.measures.durationMs) <= 150, 'AAC duration drift')
    const compressed = await readFile(temporaryM4a)
    await writeFile(join(output, `${file}.tmp`), compressed)
    await rename(join(output, `${file}.tmp`), join(output, file))
    entries.push({ id: entry.id, lang: entry.lang, text: entry.text, file, sha256: hash(compressed), sourceSha256, requestHash, model, voice, ...decodedMeasures, processing: prepared.processing, bytes: compressed.length, status: 'generated-automated-validation-only' })
  }
} finally { await rm(temporary, { recursive: true, force: true }) }
const allEntries = [...kept, ...entries].sort((a, b) => a.lang.localeCompare(b.lang, 'en') || a.text.localeCompare(b.text, 'en'))
const manifest = { schemaVersion: 1, model, voice, format: 'aac-m4a', aiGenerated: true, expectedEntries: inventory.entries.length, complete: pending.length === 0, pending, keptFromPreviousPublish: kept.length, listeningVerified: false, iPadVerified: false, entries: allEntries }
await writeFile(join(output, 'manifest.json.tmp'), JSON.stringify(manifest, null, 2) + '\n')
await rename(join(output, 'manifest.json.tmp'), join(output, 'manifest.json'))
// Only after the complete new manifest exists, remove our obsolete generated
// variants. Source WAVs remain local for comparison; unrelated files stay intact.
if (!pending.length) {
  const used = new Set(allEntries.map(entry => entry.file))
  for (const file of await readdir(output)) {
    if (/^(en|ko)-[a-f0-9]{16}-[a-f0-9]{16}(?:-p\d+)?\.m4a$/.test(file) && !used.has(file)) await rm(join(output, file))
  }
}
console.log(JSON.stringify({ published: entries.length, kept: kept.length, total: allEntries.length, pending: pending.length, bytes: entries.reduce((n, x) => n + x.bytes, 0), phonemesChanged: 0, listeningVerified: false }))
