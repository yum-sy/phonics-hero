// Offline inventory only: never rewrites audio, chapter data, or source recordings.
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { chapters, SOUND_TABLE, validateChapters } from '../src/data/chapters/index.js'
import { wordIconKeys } from '../src/icons.js'
import { synthesisInput } from './narration-request.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = join(root, 'design/audio/narration-inventory.json')
const hash = value => createHash('sha256').update(value).digest('hex')
const manifest = JSON.parse(await readFile(join(root, 'public/sounds/manifest.json'), 'utf8'))
const protectedKeys = new Set(Object.keys(manifest.sounds))
assert.equal(protectedKeys.size, 41, 'Review phoneme inventory if asset count changes')
assert.deepEqual(validateChapters(chapters, wordIconKeys), [], 'Chapter contract errors')
const entries = new Map(), exclusions = new Map()

function add(text, lang, category, source) {
  if (typeof text !== 'string' || !text.trim()) return
  text = text.trim()
  const compound = text.split(/[\s,;.!?]+/).filter(Boolean)
  const protectedReason = lang === 'en-US' && (protectedKeys.has(text)
    ? 'existing-recorded-phoneme'
    : compound.length > 1 && compound.some(token => protectedKeys.has(token))
      ? 'compound-containing-phoneme-do-not-synthesize' : null)
  if (protectedReason) {
    const id = `${protectedReason}:${text}`
    const item = exclusions.get(id) || { text, reason: protectedReason, sources: [] }
    if (!item.sources.includes(source)) item.sources.push(source)
    exclusions.set(id, item)
    return
  }
  // Preserve case: A is a letter name, a is an existing phoneme asset key.
  const key = `${lang}\0${text}`
  const item = entries.get(key) || {
    id: `${lang.slice(0, 2)}-${hash(key).slice(0, 16)}`,
    lang, text, categories: [], sources: [], status: 'source-script-inventory',
  }
  if (!item.categories.includes(category)) item.categories.push(category)
  if (!item.sources.includes(source)) item.sources.push(source)
  entries.set(key, item)
}
const spoken = item => typeof item === 'string' ? item : item.say || item.text
function collectBeat(beat, source) {
  if (beat.promptAudio) add(beat.promptAudio, 'en-US', 'prompt', `${source}.promptAudio`)
  for (const field of ['repeatAudio', 'words', 'letters']) {
    for (const [i, item] of (beat[field] || []).entries()) {
      add(spoken(item), 'en-US', field === 'repeatAudio' ? 'model-sequence' : field === 'letters' ? 'build-tile' : 'word', `${source}.${field}[${i}]`)
    }
  }
  for (const [i, opt] of (beat.options || []).entries()) {
    add(beat.kind === 'match-shape' ? opt.label : opt.say || opt.label, 'en-US', 'option', `${source}.options[${i}]`)
  }
  if (beat.readAloud) add(beat.readAloud.say || beat.readAloud.targetText, 'en-US', 'read-aloud', `${source}.readAloud`)
  for (const [i, step] of (beat.steps || []).entries()) collectBeat(step, `${source}.steps[${i}]`)
}
for (const chapter of chapters) for (const stage of chapter.stages) {
  const source = `${chapter.id}/${stage.id}`
  add(stage.recapAudio?.ko, 'ko-KR', 'stage-clear', `${source}.recapAudio.ko`)
  for (const [i, text] of (stage.recapAudio?.en || []).entries()) add(text, 'en-US', 'stage-clear-word', `${source}.recapAudio.en[${i}]`)
  add(stage.villain.name, 'en-US', 'villain-name', `${source}.villain.name`)
  for (const [i, beat] of stage.beats.entries()) collectBeat(beat, `${source}.beats[${i}](${beat.id})`)
}
const screenSource = await readFile(join(root, 'src/screens.js'), 'utf8')
// Capture only direct literal Korean speakKO calls, not displayed feedback text.
for (const match of screenSource.matchAll(/speakKO\('([^'\\]*)'\)/g)) {
  add(match[1], 'ko-KR', 'odd-one-out-explanation', `src/screens.js:speakKO(${JSON.stringify(match[1])})`)
}
const list = [...entries.values()].sort((a, b) => a.lang.localeCompare(b.lang, 'en') || a.text.localeCompare(b.text, 'en'))
for (const item of list) {
  item.categories.sort(); item.sources.sort()
  item.synthesisInput = synthesisInput(item)
  item.instructions = item.lang === 'ko-KR'
    ? "Speak natural standard Korean with a clearly feminine adult female voice, like a caring preschool teacher talking kindly and directly to a five-year-old child. Sound recognizably like a warm adult woman: soft rounded feminine timbre, a friendly smile, gentle expressive intonation, patient and reassuring, natural conversational delivery. Be clearly audible and articulate every syllable at a comfortable moderate pace. Warm encouragement, never flat or sleepy. Do not use a deep masculine resonance, booming announcer voice, theatrical host style, shouting, squealing, baby talk, whispering, breathy ASMR, singing, music or sound effects. Read only the supplied Korean text, adding no words."
    : /^[A-Za-z]$/.test(item.text)
      ? 'Say only the English alphabet letter name once in clear American English as a warm adult female preschool teacher speaking kindly to a five-year-old. Use a recognizably feminine adult voice, a friendly smile, gentle expressive intonation and clear audible projection at a comfortable moderate pace. Keep correct natural letter-name pronunciation; no singsong stretching, deep masculine resonance, booming announcer delivery, shouting, baby talk, or whispering. Do not say capital, lowercase, or letter. No added words, music, or effects.'
      : 'Read only the supplied English word or name once in clear American English as a warm adult female preschool teacher speaking kindly to a five-year-old phonics learner. Use a recognizably feminine adult voice, a friendly smile, gentle expressive intonation and clear audible projection at a comfortable moderate pace. Keep crisp intelligible consonants, natural vowels and accurate whole-word pronunciation. Never use deep masculine resonance, booming announcer delivery, whispering, mumbling, rushing, shouting, singing, baby talk, unnatural elongation, or letter spelling. No added words, explanations, music, or effects.'
}
const protectedRecordings = []
for (const key of [...protectedKeys].sort()) {
  const path = `public/sounds/${key}.${manifest.ext}`
  protectedRecordings.push({ key, path, sha256: hash(await readFile(join(root, path))), source: manifest.sounds[key].source })
}
const inventory = {
  schemaVersion: 1,
  scope: 'Actual authored speech fields plus current literal Korean explanations and tappable villain names; not a full execution trace.',
  constraints: [
    'Never regenerate or overwrite protectedRecordings. Keep raw case in lookup keys.',
    'Generated review uses SOUND_TABLE phonemes, so it introduces no replacement TTS entries.',
    'Korean explanation and its English word remain separate queue items. Never synthesize an English phoneme in a Korean sentence.',
    'InstructionKo, recapKo, hero names, UI feedback that is not spoken, and gesture-unlock ping are excluded.',
    'The Korean odd-one-out explanation is a full sentence, queued separately from its English word; actual delivery still needs listening review.',
    'This export only inventories scripts. Generated/published audio status is in public/narration/manifest.json.',
  ],
  counts: { chapters: chapters.length, stages: chapters.reduce((n, c) => n + c.stages.length, 0), protectedRecordings: protectedRecordings.length, entries: list.length, korean: list.filter(x => x.lang === 'ko-KR').length, english: list.filter(x => x.lang === 'en-US').length, excludedUniqueTexts: exclusions.size },
  protectedRecordings,
  entries: list,
  exclusions: [...exclusions.values()].sort((a, b) => a.text.localeCompare(b.text, 'en')),
}
// Cross-check every declared phoneme spelling remains excluded, independent of categories.
for (const sound of SOUND_TABLE) if (sound.say) assert(protectedKeys.has(sound.say), `Unprotected SOUND_TABLE spelling: ${sound.say}`)
for (const item of list) assert(!protectedKeys.has(item.text), `Phoneme leaked into synthesis: ${item.text}`)
await mkdir(join(root, 'design/audio'), { recursive: true })
await writeFile(output, JSON.stringify(inventory, null, 2) + '\n')
console.log(JSON.stringify(inventory.counts))
console.log('Wrote design/audio/narration-inventory.json; source recordings unchanged.')
