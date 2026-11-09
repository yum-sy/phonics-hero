// Offline inventory only: never rewrites audio, chapter data, or source recordings.
import { createHash } from 'node:crypto'
import { readFile, writeFile, mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { join } from 'node:path'
import assert from 'node:assert/strict'
import { chapters, SOUND_TABLE, SOUND_CUES, validateChapters } from '../src/data/chapters/index.js'
import { wordIconKeys } from '../src/icons.js'
import { synthesisInput } from './narration-request.mjs'
import { englishFor } from '../src/data/phrasebook.js'

const root = fileURLToPath(new URL('../', import.meta.url))
const output = join(root, 'design/audio/narration-inventory.json')
const hash = value => createHash('sha256').update(value).digest('hex')
const manifest = JSON.parse(await readFile(join(root, 'public/sounds/manifest.json'), 'utf8'))
const protectedKeys = new Set(Object.keys(manifest.sounds))
assert.equal(protectedKeys.size, 41, 'Review phoneme inventory if asset count changes')
assert.deepEqual(validateChapters(chapters, wordIconKeys), [], 'Chapter contract errors')
const entries = new Map(), exclusions = new Map()

// `sentence` marks a full English sentence from the phrasebook (instruction /
// stage-clear / UI narration for the Korean→English transition). The compound
// phoneme guard below exists for word lists, where a token like `a` or `or`
// IS a recorded phoneme key; in a sentence those are ordinary English words
// ("a new sound", "ee or oo"), so only the exact-key refusal applies.
function add(text, lang, category, source, { sentence = false } = {}) {
  if (typeof text !== 'string' || !text.trim()) return
  text = text.trim()
  const compound = text.split(/[\s,;.!?]+/).filter(Boolean)
  const protectedReason = lang === 'en-US' && (protectedKeys.has(text)
    ? 'existing-recorded-phoneme'
    : !sentence && compound.length > 1 && compound.some(token => protectedKeys.has(token))
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
  if (sentence && !item.categories.includes('phrase')) item.categories.push('phrase')
  if (!item.sources.includes(source)) item.sources.push(source)
  if (sentence) item.sentence = true
  entries.set(key, item)
}
for (const [key, cue] of Object.entries(SOUND_CUES)) {
  add(cue.action, 'ko-KR', 'sound-cue', `SOUND_CUES.${key}.action`)
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
// English narration for the Korean→English transition (audio switches to
// English from chapter 6 -- see src/data/language-policy.js): every
// instruction and stage-clear line of chapters >= 6, as the exact string
// `englishFor(ko)` returns (runtime lookup is by exact text), plus the two
// spoken UI literals and the generated review beat's fixed instruction.
const PHRASE_AUDIO_FROM_CHAPTER = 6
function addPhrase(ko, category, source) {
  const en = englishFor(ko)
  assert(en, `Phrasebook has no English for: ${ko} (${source})`)
  assert(!/[가-힣]/.test(en), `Hangul in English phrase: ${en}`)
  add(en, 'en-US', category, source, { sentence: true })
}
function collectPhraseBeat(beat, source) {
  if (beat.instructionKo) addPhrase(beat.instructionKo, 'phrase-instruction', `${source}.instructionKo`)
  for (const [i, step] of (beat.steps || []).entries()) collectPhraseBeat(step, `${source}.steps[${i}]`)
}
for (const chapter of chapters) {
  if (chapter.order < PHRASE_AUDIO_FROM_CHAPTER) continue
  for (const stage of chapter.stages) {
    const source = `${chapter.id}/${stage.id}`
    if (stage.recapAudio?.ko) addPhrase(stage.recapAudio.ko, 'phrase-stage-clear', `${source}.recapAudio.ko`)
    for (const [i, beat] of stage.beats.entries()) collectPhraseBeat(beat, `${source}.beats[${i}](${beat.id})`)
  }
}
addPhrase('소리에 맞는 글자를 고르고 ✓를 누르세요!', 'phrase-instruction', 'src/screens.js:withGeneratedReview.instructionKo')
addPhrase('정답이에요!', 'phrase-ui', "src/screens.js:speakKO('정답이에요!')")
addPhrase('이 단어만 다른 소리를 내요.', 'phrase-ui', "src/screens.js:speakKO('이 단어만 다른 소리를 내요.')")
const screenSource = await readFile(join(root, 'src/screens.js'), 'utf8')
// Capture only direct literal Korean speech calls, not displayed feedback text.
// speakLocalized() speaks the Korean literal in chapters whose audio policy is
// 'ko' (1-5) and its phrasebook English otherwise, so the Korean clip stays
// required even though no bare speakKO('…') literal remains in screens.js.
for (const match of screenSource.matchAll(/speak(?:KO|Localized)\((?:runtime, )?'([^'\\]*)'\)/g)) {
  add(match[1], 'ko-KR', 'odd-one-out-explanation', `src/screens.js:speak(${JSON.stringify(match[1])})`)
}
assert(entries.has('ko-KR\0정답이에요!') && entries.has('ko-KR\0이 단어만 다른 소리를 내요.'), 'Korean odd-one-out literals missing from screens.js scan')
const list = [...entries.values()].sort((a, b) => a.lang.localeCompare(b.lang, 'en') || a.text.localeCompare(b.text, 'en'))
for (const item of list) {
  item.categories.sort(); item.sources.sort()
  item.synthesisInput = synthesisInput(item)
  item.instructions = item.sentence
    ? 'Read the supplied short English instruction once, exactly as written, as a warm adult female preschool teacher speaking kindly and directly to a five-year-old English learner. Use a recognizably feminine adult voice with a friendly smile, clear audible projection, and gentle upbeat encouragement. Speak slightly slower than normal conversation with crisp intelligible consonants, natural vowels, and a small natural pause between sentences; keep the rhythm natural, never sing-song or chanted. Say letter names as letter names and read quoted words naturally as whole words. Never use deep masculine resonance, booming announcer delivery, shouting, whispering, mumbling, rushing, baby talk, or added words, music, or effects.'
    : item.lang === 'ko-KR'
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
    'Entries with sentence:true are phrasebook English (chapters >= 6 instructions, stage-clear, spoken UI). They keep raw case for synthesis and skip the compound-phoneme guard; exact text is the runtime lookup key.',
  ],
  counts: { chapters: chapters.length, stages: chapters.reduce((n, c) => n + c.stages.length, 0), protectedRecordings: protectedRecordings.length, entries: list.length, korean: list.filter(x => x.lang === 'ko-KR').length, english: list.filter(x => x.lang === 'en-US').length, phraseSentences: list.filter(x => x.sentence).length, soundCueSentences: list.filter(x => x.categories.includes('sound-cue')).length, excludedUniqueTexts: exclusions.size },
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
