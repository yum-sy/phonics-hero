// State contracts only; uses isolated in-memory storage, never a child's browser.
import assert from 'node:assert/strict'
import { chapters, worlds } from '../src/data/chapters/index.js'

const KEY = 'carbot-phonics-progress-v1'
const storage = () => {
  const values = new Map()
  return { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, String(value)), removeItem: key => values.delete(key) }
}
let serial = 0
async function fresh(value = null, parent = false) {
  globalThis.localStorage = storage()
  globalThis.sessionStorage = storage()
  if (value) localStorage.setItem(KEY, JSON.stringify(value))
  if (parent) sessionStorage.setItem('phonics-hero-parent-access-v1', '1')
  return import(`../src/state.js?progress-case=${++serial}`)
}
const snapshot = state => JSON.parse(JSON.stringify(state.progress))
const worldIds = world => world.slots.flatMap(slot => slot.chapter?.stages.map(stage => stage.id) || [])
const lastChapter = chapters.at(-1), target = lastChapter.stages[3].id
const checks = []
const check = (name, callback) => { callback(); checks.push(name) }

let state = await fresh({ clearedStages: ['stage-1'], stars: { 'stage-1': 2 }, checkpoint: null })
check('old-save-migration-and-parent-guard', () => {
  assert.deepEqual(state.progress.lockedStages, [])
  const before = localStorage.getItem(KEY)
  assert.equal(state.setParentProgress([target], true).changed, false)
  assert.equal(localStorage.getItem(KEY), before)
  assert(state.isStageCleared('stage-1'))
})
state.toggleParentAccess()
const invalidBefore = snapshot(state)
check('invalid-scope-is-atomic', () => {
  assert.throws(() => state.setParentProgress([target, 'not-a-stage'], true), TypeError)
  assert.throws(() => state.setParentProgress([], true), TypeError)
  assert.throws(() => state.setParentProgress([target], 'yes'), TypeError)
  assert.deepEqual(snapshot(state), invalidBefore)
})
const subtree = worldIds(worlds[2])
state.saveCheckpoint(target, 3, 1)
const unrelatedBefore = snapshot(state)
const result = state.setParentProgress(subtree, true)
check('world-restores-only-own-35-stages', () => {
  assert.deepEqual(result, { changed: true, count: 35, completed: true, saved: true })
  assert.equal(state.getParentProgressStatus(subtree).complete, true)
  assert(subtree.every(id => state.progress.stars[id] === 3))
  assert.equal(state.progress.stars['stage-1'], 2)
  assert.deepEqual(state.progress.checkpoint, unrelatedBefore.checkpoint)
  assert(!state.isStageCleared(chapters[7].stages[0].id))
})
state.toggleParentAccess()
state = await import(`../src/state.js?progress-case=${++serial}`)
check('reload-and-restored-world-access', () => {
  assert.equal(state.isParentAccessEnabled(), false)
  assert(state.isWorldUnlocked(worlds, worlds[2].id))
  assert(state.isChapterUnlocked(chapters, chapters[14].id))
  assert(state.isStageUnlocked(chapters[14].stages, chapters[14].stages[0].id))
  assert.equal(state.getParentProgressStatus(subtree).cleared, 35)
})
state.toggleParentAccess()
state.setParentProgress(subtree, false)
state.toggleParentAccess()
check('world-relock-clears-subtree-and-preserves-others', () => {
  assert(subtree.every(id => state.progress.lockedStages.includes(id)))
  assert(subtree.every(id => !state.isStageCleared(id) && !(id in state.progress.stars)))
  assert(!state.isWorldUnlocked(worlds, worlds[2].id))
  assert.equal(state.progress.stars['stage-1'], 2)
  assert.deepEqual(state.progress.checkpoint, unrelatedBefore.checkpoint)
})

state = await fresh(null, true)
state.setParentProgress(worldIds(worlds[4]), false)
state.setParentProgress([target], true)
state.toggleParentAccess()
check('single-stage-restoration-opens-ancestors-not-siblings', () => {
  assert(state.isWorldUnlocked(worlds, worlds[4].id))
  assert(state.isChapterUnlocked(chapters, lastChapter.id))
  assert(state.isStageUnlocked(lastChapter.stages, target))
  assert(!state.isChapterUnlocked(chapters, chapters[28].id))
  // Siblings follow the ordinary rule inside the now-open chapter: its
  // first stage is playable, the second is gated by the (uncleared) first,
  // the stage after the restored one opens because the restored one counts.
  assert(state.isStageUnlocked(lastChapter.stages, lastChapter.stages[0].id))
  assert(!state.isStageUnlocked(lastChapter.stages, lastChapter.stages[1].id))
  assert(state.isStageUnlocked(lastChapter.stages, lastChapter.stages[4].id))
  assert.deepEqual(state.progress.clearedStages, [target])
})
state.toggleParentAccess()
state.saveCheckpoint(target, 2, 1)
const expectedUndo = snapshot(state)
state.setParentProgress([target], false)
check('affected-checkpoint-clears-and-undo-restores-exact-state', () => {
  assert.equal(state.progress.checkpoint, null)
  assert(state.canUndoParentProgress())
  assert.deepEqual(state.undoParentProgress(), { changed: true, saved: true })
  assert.deepEqual(snapshot(state), expectedUndo)
  assert.deepEqual(JSON.parse(localStorage.getItem(KEY)), expectedUndo)
  assert.equal(state.canUndoParentProgress(), false)
})
state.setParentProgress([target], false)
state.saveCheckpoint('stage-1', 0, 0)
check('gameplay-mutation-invalidates-undo', () => {
  assert.equal(state.canUndoParentProgress(), false)
  assert.deepEqual(state.undoParentProgress(), { changed: false, saved: false })
})
state.setParentProgress([target], true)
state.toggleParentAccess()
state.toggleParentAccess()
check('leaving-parent-mode-clears-undo', () => assert.equal(state.canUndoParentProgress(), false))

state = await fresh(null, true)
const first = chapters[0].stages[0].id, second = chapters[0].stages[1].id
state.setParentProgress([first, second], true)
state.setParentProgress([second], false)
state.toggleParentAccess()
state = await import(`../src/state.js?progress-case=${++serial}`)
const third = chapters[0].stages[2].id
check('relock-means-uncleared-not-forbidden-after-reload', () => {
  assert(state.isStageCleared(first))
  assert(!state.isStageCleared(second))
  assert.equal(state.progress.stars[second], undefined)
  // The relocked stage is still reachable (its predecessor is cleared);
  // what it gates is the stage AFTER it.
  assert(state.isStageUnlocked(chapters[0].stages, second))
  assert(!state.isStageUnlocked(chapters[0].stages, third))
})
state.markStageCleared(second)
check('child-clearing-relocked-stage-reopens-next', () => {
  assert(!state.progress.lockedStages.includes(second))
  assert(state.isStageUnlocked(chapters[0].stages, third))
})
state.toggleParentAccess()
state.setParentProgress(worldIds(worlds[0]), false)
state.toggleParentAccess()
check('locking-first-world-keeps-first-stage-playable', () => {
  assert(state.isWorldUnlocked(worlds, worlds[0].id))
  assert(state.isChapterUnlocked(chapters, chapters[0].id))
  assert(state.isStageUnlocked(chapters[0].stages, first))
  assert(!state.isStageUnlocked(chapters[0].stages, second))
  assert(!state.isChapterUnlocked(chapters, chapters[1].id))
})
state.toggleParentAccess()
state.setParentProgress(chapters.flatMap(c => c.stages.map(st => st.id)), false)
state.toggleParentAccess()
check('locking-everything-leaves-exactly-first-stage-open', () => {
  // A stage is reachable only through an unlocked chapter -- isStageUnlocked
  // alone treats each chapter's first stage as open (chapter gating is
  // isChapterUnlocked's job), so combine the two like the map screen does.
  const open = chapters.flatMap(c => state.isChapterUnlocked(chapters, c.id)
    ? c.stages.filter(st => state.isStageUnlocked(c.stages, st.id)).map(st => st.id) : [])
  assert.deepEqual(open, [first])
  state.markStageCleared(first)
  assert(state.isStageUnlocked(chapters[0].stages, second))
  assert(!state.isStageUnlocked(chapters[0].stages, third))
})
state.resetProgress()
check('reset-removes-manual-locks', () => {
  assert.deepEqual(state.progress.lockedStages, [])
  assert(state.isWorldUnlocked(worlds, worlds[0].id))
  assert(state.isStageUnlocked(chapters[0].stages, first))
})

state = await fresh(null, true)
const ch1 = chapters[0].stages.map(st => st.id), ch2 = chapters[1].stages.map(st => st.id)
state.setParentProgress([...ch1, ...ch2], true)
state.setParentProgress(ch2, false)
state.toggleParentAccess()
check('chapter-relock-keeps-its-first-stage-reachable', () => {
  assert(state.isChapterUnlocked(chapters, chapters[1].id))
  assert(state.isStageUnlocked(chapters[1].stages, ch2[0]))
  assert(!state.isStageUnlocked(chapters[1].stages, ch2[1]))
  assert(!state.isChapterUnlocked(chapters, chapters[2].id))
  state.markStageCleared(ch2[0])
  assert(state.isStageUnlocked(chapters[1].stages, ch2[1]))
  assert(!state.isStageUnlocked(chapters[1].stages, ch2[2]))
})
state.toggleParentAccess()
state.setParentProgress(ch1, true)
state.setParentProgress([ch1[2]], false)
state.toggleParentAccess()
check('middle-stage-relock-gates-only-its-successor', () => {
  assert(state.isStageUnlocked(chapters[0].stages, ch1[2]))
  assert(!state.isStageUnlocked(chapters[0].stages, ch1[3]))
  assert(state.progress.clearedStages.includes(ch1[3]))
  assert(!state.isStageCleared(ch1[2]))
  state.markStageCleared(ch1[2])
  assert(state.isStageUnlocked(chapters[0].stages, ch1[3]))
  assert(state.isStageCleared(ch1[3]))
})

state = await fresh({ clearedStages: [first], stars: { [first]: 2 }, lockedStages: [second, second, 'bad', null] }, true)
check('corrupt-lock-list-sanitized', () => assert.deepEqual(state.progress.lockedStages, [second]))
const reviewBefore = localStorage.getItem(KEY)
state.enableReviewMode()
check('review-edit-and-undo-cannot-touch-real-storage', () => {
  assert.equal(state.setParentProgress([target], true).changed, false)
  assert.equal(state.undoParentProgress().changed, false)
  assert.deepEqual(state.progress.lockedStages, [])
  assert(state.isStageUnlocked(chapters[0].stages, second))
  state.markStageCleared(second)
  assert.equal(localStorage.getItem(KEY), reviewBefore)
})

state = await fresh(null, true)
localStorage.setItem = () => { throw new Error('Quota fixture') }
check('storage-failure-is-reported', () => {
  const failure = state.setParentProgress([first], true)
  assert.equal(failure.changed, true)
  assert.equal(failure.saved, false)
})

console.log(JSON.stringify({ passed: true, checks: checks.length, cases: checks }, null, 2))
