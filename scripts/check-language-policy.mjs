import assert from 'node:assert/strict'
import { audioLang, textMode, textModeForRank, describePolicy } from '../src/data/language-policy.js'

const RANKS = Array.from({ length: 40 }, (_, i) => i)
const checks = []
const check = (name, fn) => { try { fn(); checks.push([name, true]) } catch (e) { checks.push([name, false, e.message]) } }

check('ch1-5 audio ko, ch6+ en', () => {
  for (let c = 1; c <= 5; c++) assert.equal(audioLang(c), 'ko')
  for (let c = 6; c <= 33; c++) assert.equal(audioLang(c), 'en')
})
check('ch1-5 text ko for every rank', () => {
  for (let c = 1; c <= 5; c++) for (const r of RANKS) assert.equal(textModeForRank(c, r), 'ko')
})
check('ch6 exactly the even ranks are en-ko', () => {
  for (const r of RANKS) assert.equal(textModeForRank(6, r), r % 2 === 0 ? 'en-ko' : 'ko')
})
check('ch7 every rank en-ko', () => {
  for (const r of RANKS) assert.equal(textModeForRank(7, r), 'en-ko')
})
check('ch8-14 monotone fade (en-ko -> en, never back)', () => {
  for (const r of RANKS) {
    let seenEn = false
    for (let c = 8; c <= 14; c++) {
      const m = textModeForRank(c, r)
      assert(m === 'en-ko' || m === 'en', `${c}/${r}: ${m}`)
      if (m === 'en') seenEn = true
      else assert(!seenEn, `rank ${r} went back to en-ko at ch${c}`)
    }
  }
})
check('ch8 has both en-ko and en; every fade chapter 8-14 drops at least one rank', () => {
  for (let c = 8; c <= 14; c++) assert(RANKS.some(r => textModeForRank(c, r) === 'en' && textModeForRank(c - 1, r) !== 'en'), `nothing dropped at ch${c}`)
  assert(RANKS.some(r => textModeForRank(8, r) === 'en-ko'))
})
check('by ch14 every rank is en', () => { for (const r of RANKS) assert.equal(textModeForRank(14, r), 'en') })
check('ch15+ en for every rank', () => { for (let c = 15; c <= 33; c++) for (const r of RANKS) assert.equal(textModeForRank(c, r), 'en') })
check('unknown phrase -> ko in every chapter', () => {
  for (let c = 1; c <= 33; c++) { assert.equal(textMode(c, null), 'ko'); assert.equal(textMode(c, { key: 'x', en: '', rank: 0 }), 'ko'); assert.equal(textMode(c, { key: 'x', en: 'Hi', rank: undefined }), 'ko') }
})
check('textMode uses phrase rank', () => {
  assert.equal(textMode(6, { key: 'a', en: 'A', rank: 0 }), 'en-ko')
  assert.equal(textMode(6, { key: 'b', en: 'B', rank: 1 }), 'ko')
  assert.equal(textMode(9, { key: 'a', en: 'A', rank: 1 }), 'en')
  assert.equal(textMode(9, { key: 'c', en: 'C', rank: 6 }), 'en-ko')
})
check('describePolicy rows', () => { const rows = describePolicy(); assert.equal(rows.length, 16); assert.equal(rows[0].audio, 'ko'); assert.equal(rows[15].modes[3], 'en') })

const failed = checks.filter(c => !c[1])
for (const [name, ok, msg] of checks) console.log(`${ok ? 'PASS' : 'FAIL'} ${name}${msg ? ' :: ' + msg : ''}`)
console.log(`${checks.length - failed.length}/${checks.length} policy checks passed`)
if (failed.length) process.exit(1)
