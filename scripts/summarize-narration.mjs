// Rebuild current-library totals after publication. This verifies bytes and
// contracts; signal measurements come from the publisher's AAC decode pass.
// Run --check to validate and print without replacing validation-summary.json.
import assert from 'node:assert/strict'
import { createHash } from 'node:crypto'
import { readFile, readdir, writeFile, rename } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import { narrationRequest } from './narration-request.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const checkOnly = process.argv.includes('--check')
assert(process.argv.slice(2).every(arg => arg === '--check'), 'Only --check is supported')
const hash = value => createHash('sha256').update(value).digest('hex')
const key = entry => `${entry.lang}\0${entry.text}`
const inventoryBytes = await readFile(join(root, 'design/audio/narration-inventory.json'))
const manifestBytes = await readFile(join(root, 'public/narration/manifest.json'))
const inventory = JSON.parse(inventoryBytes)
const manifest = JSON.parse(manifestBytes)
const entries = manifest.entries
assert(manifest.complete && manifest.pending.length === 0, 'Narration publication is incomplete')
assert(entries.length > 0, 'Empty narration library')
assert.equal(entries.length, inventory.entries.length, 'Inventory and publication counts differ')
assert.equal(manifest.expectedEntries, entries.length, 'Manifest expected count differs')
const inventoryByKey = new Map(inventory.entries.map(entry => [key(entry), entry]))
assert.equal(inventoryByKey.size, inventory.entries.length, 'Duplicate inventory key')
assert.equal(new Set(entries.map(key)).size, entries.length, 'Duplicate published key')
assert.equal(new Set(entries.map(entry => entry.file)).size, entries.length, 'Duplicate published file')

const byCategory = {}
for (const entry of entries) {
  const source = inventoryByKey.get(key(entry))
  assert(source, `Published text missing from inventory: ${entry.id}`)
  assert.equal(entry.id, source.id, `Inventory ID differs: ${entry.id}`)
  assert.equal(entry.model, manifest.model, `Model differs: ${entry.id}`)
  assert.equal(entry.voice, manifest.voice, `Voice differs: ${entry.id}`)
  assert.match(entry.file, /^(en|ko)-[a-f0-9]{16}-[a-f0-9]{16}(?:-p\d+)?\.m4a$/)
  const bytes = await readFile(join(root, 'public/narration', entry.file))
  assert.equal(hash(bytes), entry.sha256, `Published file hash differs: ${entry.id}`)
  assert.equal(bytes.length, entry.bytes, `Published file size differs: ${entry.id}`)
  assert.equal(hash(JSON.stringify(narrationRequest(source, entry.model, entry.voice))),
    entry.requestHash, `Current synthesis request differs: ${entry.id}`)
  for (const field of ['durationMs', 'rms', 'peak', 'clippedFraction']) {
    assert(Number.isFinite(entry[field]), `Missing publication measurement ${field}: ${entry.id}`)
  }
  assert(entry.durationMs >= 100 && entry.durationMs <= 60000, `Invalid duration: ${entry.id}`)
  assert(entry.rms > 0.005 && entry.peak > 0.01, `Near-silent publication measurement: ${entry.id}`)
  assert(entry.clippedFraction >= 0 && entry.clippedFraction < 0.01, `Clipping measurement: ${entry.id}`)
  for (const category of source.categories) byCategory[category] = (byCategory[category] || 0) + 1
}
const files = (await readdir(join(root, 'public/narration'))).filter(file => file.endsWith('.m4a')).sort()
assert.deepEqual(files, entries.map(entry => entry.file).sort(), 'Unlisted or missing public m4a files')
assert.equal(inventory.protectedRecordings.length, 41, 'Original phoneme count changed')
assert.equal(new Set(inventory.protectedRecordings.map(recording => recording.key)).size, 41,
  'Duplicate original phoneme keys')
for (const recording of inventory.protectedRecordings) {
  assert.match(recording.key, /^[a-z]+$/)
  assert.equal(recording.path, `public/sounds/${recording.key}.wav`)
  assert.equal(hash(await readFile(join(root, recording.path))), recording.sha256,
    `Original phoneme changed: ${recording.key}`)
}

const summary = {
  schemaVersion: 2,
  date: new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul' }).format(new Date()),
  generatedAt: new Date().toISOString(),
  passed: true,
  scope: 'Entire current published narration library; all totals below describe the same manifest.',
  model: manifest.model,
  voice: manifest.voice,
  entries: entries.length,
  korean: entries.filter(entry => entry.lang === 'ko-KR').length,
  english: entries.filter(entry => entry.lang === 'en-US').length,
  protectedPhonemesUnchanged: inventory.protectedRecordings.length,
  bytes: entries.reduce((sum, entry) => sum + entry.bytes, 0),
  seconds: Number((entries.reduce((sum, entry) => sum + entry.durationMs, 0) / 1000).toFixed(3)),
  rmsMin: Math.min(...entries.map(entry => entry.rms)),
  rmsMax: Math.max(...entries.map(entry => entry.rms)),
  peakMax: Math.max(...entries.map(entry => entry.peak)),
  clippedFiles: entries.filter(entry => entry.clippedFraction > 0).length,
  trimmedFiles: entries.filter(entry => entry.processing?.removedLeadMs > 0 || entry.processing?.removedTailMs > 0).length,
  byCategory,
  categoryNote: 'An entry can have several categories; category counts must not be summed as unique clips.',
  inventorySha256: hash(inventoryBytes),
  manifestSha256: hash(manifestBytes),
  checks: [
    `${entries.length} inventory/publication language + exact-text keys and IDs match`,
    `${entries.length} current synthesis request hashes match model, voice, text and instructions`,
    `${entries.length} published file SHA256 hashes and byte sizes match manifest`,
    'No unlisted m4a files in public/narration',
    '41 original phoneme SHA256 hashes match the protected inventory',
    'All stored publisher signal measurements satisfy duration, non-silence and clipping bounds',
  ],
  measurementsSource: 'Stored manifest measurements from AAC decoding during publication; this command does not decode or listen to audio again.',
  browserDecodeVerifiedByThisCommand: false,
  listeningVerified: false,
  iPadVerified: false,
}
if (!checkOnly) {
  const destination = join(root, 'design/audio/validation-summary.json')
  await writeFile(`${destination}.tmp`, JSON.stringify(summary, null, 2) + '\n')
  await rename(`${destination}.tmp`, destination)
}
console.log(JSON.stringify(summary, null, 2))
