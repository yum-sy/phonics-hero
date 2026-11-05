// Exercise the actual audio.js queue with deterministic browser/audio doubles.
// This verifies routing/timing/failure recovery, not iPad playback or pronunciation.
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

const events = [], requests = [], lookups = []
let context, stuckResume = false
const handlers = new Map()
const clips = new Map([
  ['en-US\0dog', 'dog.m4a'], ['ko-KR\0좋아요!', 'good.m4a'],
  ['en-US\0A', 'letter-a.m4a'], ['en-US\0sss', 'forbidden-sss.m4a'],
  ['en-US\0missing', 'missing.m4a'], ['en-US\0broken', 'broken.m4a'],
  ['en-US\0startfail', 'startfail.m4a'], ['en-US\0long', 'long.m4a'],
  ['en-US\0stalled', 'stalled.m4a'],
])
globalThis.__narrationFor = (text, lang) => {
  lookups.push(`${lang}\0${text}`)
  const file = clips.get(`${lang}\0${text}`)
  return file ? { file } : null
}
class AudioContext {
  constructor() { context = this }
  state = 'running'
  destination = {}
  resume() {
    if (stuckResume) return new Promise(() => {})
    this.state = 'running'; return Promise.resolve()
  }
  suspend() { this.state = 'suspended'; return Promise.resolve() }
  async decodeAudioData(bytes) {
    if (bytes.url.endsWith('broken.m4a')) throw new Error('Invalid audio fixture')
    return { file: bytes.url, duration: bytes.url.endsWith('long.m4a') ? 0.15 : 0.025 }
  }
  createGain() { return { gain: {}, connect() {} } }
  createBufferSource() {
    return { connect() {}, start() {
      if (this.buffer.file.endsWith('startfail.m4a')) throw new Error('Cannot start fixture')
      events.push({ type: 'buffer', file: this.buffer.file, at: Date.now(), duration: this.buffer.duration })
    } }
  }
}
globalThis.fetch = async (url, options) => {
  requests.push(url)
  if (url.endsWith('stalled.m4a')) return new Promise((_, reject) => {
    options.signal.addEventListener('abort', () => reject(new Error('Aborted fixture')))
  })
  return { ok: !url.endsWith('missing.m4a'), arrayBuffer: async () => ({ url }) }
}
globalThis.document = { addEventListener: (name, callback) => handlers.set(name, callback) }
globalThis.SpeechSynthesisUtterance = class { constructor(text) { this.text = text } }
globalThis.window = {
  AudioContext, addEventListener() {},
  speechSynthesis: {
    speaking: false, getVoices: () => [], addEventListener() {},
    cancel() { throw new Error('Forbidden cancel called') },
    speak(utter) {
      if (utter.volume === 0) return
      events.push({ type: 'tts', text: utter.text, at: Date.now() })
      this.speaking = true
      setTimeout(() => { this.speaking = false; utter.onend?.() }, 10)
    },
  },
}
const source = (await readFile(new URL('../src/audio.js', import.meta.url), 'utf8'))
  .replace("import { narrationFor } from './audio/narration-assets.js'", 'const narrationFor = globalThis.__narrationFor')
  .replaceAll('import.meta.env.BASE_URL', "'/phonics-hero/'")
const audio = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
handlers.get('click')()
let count = 0
const check = (label, fn) => { fn(); count++; console.log(`PASS ${label}`) }
await Promise.all([audio.speakEN('sss'), audio.speakEN('dog'), audio.speakKO('좋아요!')])
await audio.whenAudioIdle()
check('mixed phoneme/word/Korean stays serial and uses recorded audio', () => {
  assert.deepEqual(events.map(x => x.file), ['/phonics-hero/sounds/sss.wav', '/phonics-hero/narration/dog.m4a', '/phonics-hero/narration/good.m4a'])
  for (let i = 1; i < events.length; i++) assert(events[i].at >= events[i - 1].at + events[i - 1].duration * 1000)
  assert(!lookups.includes('en-US\0sss'))
})
await audio.speakEN('A'); await audio.speakEN('a')
check('raw case keeps letter name distinct from original a phoneme', () => {
  assert.equal(events.at(-2).file, '/phonics-hero/narration/letter-a.m4a')
  assert.equal(events.at(-1).file, '/phonics-hero/sounds/a.wav')
})
for (const text of ['missing', 'broken', 'startfail', 'unmapped']) {
  await audio.speakEN(text)
  check(`${text} narration failure uses system voice`, () => assert.equal(events.at(-1).text, text))
}
await audio.whenAudioIdle()
const before = events.length
const playing = audio.speakEN('long')
for (let i = 0; events.length === before && i < 100; i++) await new Promise(r => setTimeout(r, 10))
assert(events.at(-1).file.endsWith('long.m4a'))
const dropped = audio.speakEN('dog')
audio.clearAudioQueue()
await Promise.all([playing, dropped])
await audio.whenAudioIdle()
check('clear drops pending narration but lets current duration finish', () => {
  assert.equal(events.length, before + 1)
  assert(Date.now() - events.at(-1).at >= 150)
  assert(audio.isAudioIdle())
})
await audio.speakEN('dog')
check('decoded narration is cached', () => assert.equal(requests.filter(x => x.endsWith('/dog.m4a')).length, 1))
const stalledAt = Date.now()
await audio.speakEN('stalled')
check('stalled network aborts and queue falls back within a finite deadline', () => {
  assert.equal(events.at(-1).text, 'stalled')
  assert(Date.now() - stalledAt < 6000)
})
context.state = 'suspended'
stuckResume = true
const resumeAt = Date.now()
await audio.speakEN('dog')
check('unsettled resume promise never blocks narration fallback indefinitely', () => {
  assert.equal(events.at(-1).text, 'dog')
  assert(Date.now() - resumeAt < 6000)
})
console.log(`${count} checks passed; browser doubles only, not real-device audio evidence.`)
