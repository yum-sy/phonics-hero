// Dry-run by default. Requires an explicit model and key only with --generate.
// Produces audition candidates outside public/. Nothing is automatically shipped.
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir, rename } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { measureWav } from './narration-wav.mjs'
import { narrationRequest } from './narration-request.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
// Node's dotenv parser handles quoted values; existing process env wins.
// Never print the local file, key, request headers, or raw provider errors.
try { process.loadEnvFile(join(root, '.env.local')) }
catch (error) { if (error.code !== 'ENOENT') throw new Error('Unable to load .env.local safely') }
const hash = value => createHash('sha256').update(value).digest('hex')
const args = process.argv.slice(2), options = {}
const valued = new Set(['--model', '--voice', '--limit', '--lang', '--category', '--concurrency', '--id'])
for (let i = 0; i < args.length; i++) {
  const flag = args[i]
  if (flag === '--generate') options.generate = true
  else if (flag === '--retry-invalid') options.retryInvalid = true
  else if (valued.has(flag) && args[i + 1] && !args[i + 1].startsWith('--')) options[flag.slice(2)] = args[++i]
  else throw new Error(`Unknown or incomplete option: ${flag}`)
}
const model = options.model || process.env.OPENAI_TTS_MODEL
const voice = options.voice || process.env.OPENAI_TTS_VOICE || 'nova'
if (model && !/^[a-zA-Z0-9._-]+$/.test(model)) throw new Error('Invalid model identifier')
if (!/^[a-zA-Z0-9._-]+$/.test(voice)) throw new Error('Invalid voice identifier')
if (options.lang && !['ko-KR', 'en-US'].includes(options.lang)) throw new Error('--lang must be ko-KR or en-US')
const limit = options.limit === undefined ? Infinity : Number(options.limit)
if (limit !== Infinity && (!Number.isSafeInteger(limit) || limit < 1)) throw new Error('--limit must be a positive integer')
const concurrency = Number(options.concurrency || 1)
if (!Number.isInteger(concurrency) || concurrency < 1 || concurrency > 4) throw new Error('--concurrency must be between 1 and 4')
const inventory = JSON.parse(await readFile(join(root, 'design/audio/narration-inventory.json'), 'utf8'))
assert.equal(inventory.schemaVersion, 1)
assert.equal(inventory.protectedRecordings.length, 41)
const protectedKeys = new Set(inventory.protectedRecordings.map(x => x.key))
for (const recording of inventory.protectedRecordings) {
  assert(/^[a-z]+$/.test(recording.key))
  assert.equal(recording.path, `public/sounds/${recording.key}.wav`)
  assert.equal(hash(await readFile(join(root, recording.path))), recording.sha256, `Protected source changed: ${recording.key}; inspect before re-exporting`)
}
const ids = new Set()
for (const entry of inventory.entries) {
  assert(/^(en|ko)-[a-f0-9]{16}$/.test(entry.id), 'Unsafe entry ID')
  assert(!ids.has(entry.id), 'Duplicate entry ID'); ids.add(entry.id)
  assert(['ko-KR', 'en-US'].includes(entry.lang))
  assert(typeof entry.text === 'string' && entry.text.trim() && entry.text.length <= 4096)
  assert.equal(entry.id, `${entry.lang.slice(0, 2)}-${hash(`${entry.lang}\0${entry.text}`).slice(0, 16)}`)
  assert(typeof entry.instructions === 'string' && entry.instructions.length > 0)
  assert(Array.isArray(entry.categories))
  assert(!protectedKeys.has(entry.text), `Refusing to synthesize phoneme ${entry.text}`)
  if (entry.lang === 'en-US') {
    const tokens = entry.text.split(/[\s,;.!?]+/).filter(Boolean)
    assert(!(tokens.length > 1 && tokens.some(x => protectedKeys.has(x))), 'Refusing compound phoneme synthesis')
  }
}
const priority = entry => entry.categories.includes('odd-one-out-explanation') ? 0 : entry.lang === 'ko-KR' ? 1 : entry.categories.includes('villain-name') ? 3 : 2
const selected = inventory.entries.filter(entry => (!options.id || entry.id === options.id) && (!options.lang || entry.lang === options.lang) && (!options.category || entry.categories.includes(options.category)))
  .sort((a, b) => priority(a) - priority(b) || a.id.localeCompare(b.id, 'en')).slice(0, limit)
assert(selected.length > 0, 'No entries match selection')
console.log(JSON.stringify({ mode: options.generate ? 'generate-audition-only' : 'dry-run', model: model || 'explicit model required before generation', voice, count: selected.length, characters: selected.reduce((n, x) => n + x.text.length, 0), examples: selected.slice(0, 6).map(x => ({ id: x.id, text: x.text })) }, null, 2))
if (!options.generate) process.exit(0)
if (!model) throw new Error('Set --model or OPENAI_TTS_MODEL explicitly; check current OpenAI model/API availability first')
const key = process.env.OPENAI_API_KEY
if (!key) throw new Error('OPENAI_API_KEY is not configured. Set it locally; never put it in chat, browser code, or this manifest.')
const output = join(root, 'design/audio/generated')
await mkdir(output, { recursive: true })
let generated = 0, reused = 0, rejectedSignalRetries = 0
async function generateEntry(entry) {
  const request = narrationRequest(entry, model, voice)
  const requestHash = hash(JSON.stringify(request))
  const basename = `${entry.id}-${requestHash.slice(0, 16)}`
  const file = join(output, `${basename}.wav`), metaFile = join(output, `${basename}.json`)
  try {
    const [metadata, bytes] = await Promise.all([readFile(metaFile, 'utf8').then(JSON.parse), readFile(file)])
    if (metadata.requestHash === requestHash && metadata.sha256 === hash(bytes) && bytes.subarray(0, 4).toString() === 'RIFF' && bytes.subarray(8, 12).toString() === 'WAVE') {
      measureWav(bytes)
      reused++; console.log(`Reused ${entry.id}`); return
    }
  } catch (error) {
    if (error.code !== 'ENOENT' && !options.retryInvalid) throw new Error(`Invalid local audition cache for ${entry.id}; inspect files before retrying with --retry-invalid`)
    if (error.code !== 'ENOENT') console.log(`Retrying invalid signal ${entry.id}`)
  }
  let response
  try {
    response = await fetch('https://api.openai.com/v1/audio/speech', {
      method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(request), signal: AbortSignal.timeout(120000),
    })
  } catch {
    throw new Error(`Speech request failed for ${entry.id}; no automatic retry to avoid duplicate charges`)
  }
  // Do not print the provider's raw error body or any request headers.
  if (!response.ok) throw new Error(`Speech API HTTP ${response.status} for ${entry.id}; check account/model access locally`)
  const mime = response.headers.get('content-type') || ''
  assert(/audio\/|application\/octet-stream/.test(mime), 'Speech API did not return audio')
  const bytes = Buffer.from(await response.arrayBuffer())
  assert(bytes.length > 44 && bytes.length < 50 * 1024 * 1024, 'Unexpected audio size')
  assert.equal(bytes.subarray(0, 4).toString(), 'RIFF', 'Expected WAV RIFF header')
  assert.equal(bytes.subarray(8, 12).toString(), 'WAVE', 'Expected WAV format')
  const measures = measureWav(bytes)
  await writeFile(`${file}.tmp`, bytes)
  await rename(`${file}.tmp`, file)
  await writeFile(metaFile, JSON.stringify({ schemaVersion: 1, entryId: entry.id, lang: entry.lang, text: entry.text, model, voice, instructions: entry.instructions, requestHash, sha256: hash(bytes), bytes: bytes.length, ...measures, status: 'unreviewed-not-published' }, null, 2) + '\n')
  generated++; console.log(`Generated ${entry.id} (${bytes.length} bytes; listening review required)`)
}
let cursor = 0, failure = null
await Promise.all(Array.from({ length: concurrency }, async () => {
  while (!failure && cursor < selected.length) {
    const entry = selected[cursor++]
    for (let attempt = 1; attempt <= 3; attempt++) {
      try { await generateEntry(entry); break }
      catch (error) {
        const invalidSignal = error instanceof assert.AssertionError && /Silent or near-silent|Excessive full-scale clipping|Unexpected duration/.test(error.message)
        if (invalidSignal && attempt < 3) {
          rejectedSignalRetries++
          console.log(`Rejected signal ${entry.id}; bounded retry ${attempt}/2`)
        } else { failure ||= new Error(`Generation failed for ${entry.id}: ${error.message}`); break }
      }
    }
  }
}))
if (failure) throw failure
console.log(JSON.stringify({ generated, reused, rejectedSignalRetries, output: 'design/audio/generated/', published: 0, phonemesChanged: 0 }))
