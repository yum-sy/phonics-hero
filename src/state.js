import { stages as authoredStages } from './data/chapters/index.js'

const STORAGE_KEY = 'carbot-phonics-progress-v1'
const PARENT_ACCESS_KEY = 'phonics-hero-parent-access-v1'
const validStageIds = new Set(authoredStages.map(stage => stage.id))

function loadParentAccess() {
  try { return sessionStorage.getItem(PARENT_ACCESS_KEY) === '1' }
  catch { return false }
}
let parentAccess = loadParentAccess()

// Curriculum content is complete (33 chapters) and now needs real
// stage-by-stage playtesting, so the dev-mode unlock-everything bypass is
// off: progression must be earned in order, same as production, even
// while running the dev server. Flip back to
// `typeof import.meta.env !== 'undefined' && import.meta.env.DEV === true`
// if free-jumping during content authoring is needed again.
const DEV_UNLOCK_ALL = false

function emptyProgress() {
  return { clearedStages: [], stars: {}, checkpoint: null, lockedStages: [] }
}

// A checkpoint written by an older build (or truncated mid-write) must never
// reach renderStage as a half-shape: a bad beatIndex would resume the child
// into a beat that does not exist.
function sanitizeCheckpoint(cp) {
  if (!cp || typeof cp !== 'object') return null
  if (typeof cp.stageId !== 'string' || !cp.stageId) return null
  if (!Number.isInteger(cp.beatIndex) || cp.beatIndex < 0) return null
  if (!Number.isInteger(cp.hitsDealt) || cp.hitsDealt < 0) return null
  return {
    stageId: cp.stageId,
    beatIndex: cp.beatIndex,
    hitsDealt: cp.hitsDealt,
  }
}

// Anything persisted by an older/never-shipped build (or hand-edited, or
// truncated by a crash mid-write) still has to produce a *usable* shape:
// every screen touches progress.clearedStages and progress.stars on render,
// so one wrong type here would throw on the very first paint and leave the
// child staring at a blank app that only clearing Safari data can fix.
function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return emptyProgress()
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return emptyProgress()
    return {
      clearedStages: Array.isArray(parsed.clearedStages)
        ? parsed.clearedStages.filter((id) => typeof id === 'string')
        : [],
      stars:
        parsed.stars && typeof parsed.stars === 'object' ? parsed.stars : {},
      checkpoint: sanitizeCheckpoint(parsed.checkpoint),
      lockedStages: Array.isArray(parsed.lockedStages)
        ? [...new Set(parsed.lockedStages.filter(id => validStageIds.has(id)))]
        : [],
    }
  } catch (e) {
    return emptyProgress()
  }
}

export const progress = load()

// Explicitly enabled only by the separate review entry point. Keep the exported
// object identity, but detach every mutable field from the child's saved data.
let reviewMode = false
let parentUndo = null

export function enableReviewMode() {
  if (reviewMode) return
  reviewMode = true
  parentUndo = null
  Object.assign(progress, emptyProgress())
}

export function isReviewMode() {
  return reviewMode
}

// Entering parent mode only enables the editor/navigation bypass. Progress
// changes require a separate explicit scope edit through setParentProgress.
export function isParentAccessEnabled() {
  return !reviewMode && parentAccess
}

export function toggleParentAccess() {
  if (reviewMode) return false
  parentAccess = !parentAccess
  if (!parentAccess) parentUndo = null
  try {
    if (parentAccess) sessionStorage.setItem(PARENT_ACCESS_KEY, '1')
    else sessionStorage.removeItem(PARENT_ACCESS_KEY)
  } catch { /* Keep this page usable when session storage is unavailable. */ }
  return parentAccess
}

export function save({ preserveParentUndo = false } = {}) {
  if (!preserveParentUndo) parentUndo = null
  if (reviewMode) return false
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    return true
  } catch (e) {
    return false // e.g. private mode quota; parent editor can show save failure.
  }
}

function scopeIds(stageIds) {
  if (!Array.isArray(stageIds) || stageIds.length === 0 ||
      stageIds.some(id => typeof id !== 'string' || !validStageIds.has(id))) {
    throw new TypeError('Parent progress scope must contain known stage IDs')
  }
  return [...new Set(stageIds)]
}

function copyProgress() {
  return {
    clearedStages: [...progress.clearedStages], stars: { ...progress.stars },
    checkpoint: progress.checkpoint ? { ...progress.checkpoint } : null,
    lockedStages: [...progress.lockedStages],
  }
}

export function getParentProgressStatus(stageIds) {
  const ids = scopeIds(stageIds)
  const cleared = ids.filter(isStageCleared).length
  const locked = ids.filter(id => progress.lockedStages.includes(id)).length
  const complete = cleared === ids.length
  return { status: complete ? 'complete' : locked === ids.length ? 'locked' : 'partial',
    total: ids.length, cleared, locked, complete }
}

// Only the selected subtree changes. Explicit locks survive a completed
// predecessor; a later normal playthrough cannot silently reopen them.
export function setParentProgress(stageIds, completed) {
  if (!isParentAccessEnabled()) return { changed: false, count: 0, completed, saved: false }
  if (typeof completed !== 'boolean') throw new TypeError('Completion must be boolean')
  const ids = scopeIds(stageIds), scope = new Set(ids)
  const before = copyProgress()
  if (completed) {
    progress.clearedStages = [...new Set([...progress.clearedStages, ...ids])]
    progress.lockedStages = progress.lockedStages.filter(id => !scope.has(id))
    for (const id of ids) progress.stars[id] = Math.max(progress.stars[id] || 0, 3)
  } else {
    progress.clearedStages = progress.clearedStages.filter(id => !scope.has(id))
    progress.lockedStages = [...new Set([...progress.lockedStages, ...ids])]
    for (const id of ids) delete progress.stars[id]
  }
  if (scope.has(progress.checkpoint?.stageId)) progress.checkpoint = null
  parentUndo = before
  return { changed: true, count: ids.length, completed, saved: save({ preserveParentUndo: true }) }
}

export function canUndoParentProgress() {
  return isParentAccessEnabled() && parentUndo !== null
}

export function undoParentProgress() {
  if (!canUndoParentProgress()) return { changed: false, saved: false }
  Object.assign(progress, parentUndo)
  parentUndo = null
  return { changed: true, saved: save() }
}

// Opt-in dev convenience (?resetprogress=1, see main.js) for wiping a
// device's saved progress before a fresh real-device playtest -- there is
// no other way to reach a device's own localStorage remotely.
export function resetProgress() {
  progress.clearedStages = []
  progress.stars = {}
  progress.checkpoint = null
  progress.lockedStages = []
  save()
}

// Opt-in dev convenience (?forceclear=<stageId>, see main.js) for unlocking
// one specific stage during a real-device playtest without flipping
// DEV_UNLOCK_ALL (which would re-open every stage, not just the one being
// tested right now).
export function forceClearStage(stageId) {
  markStageCleared(stageId)
}

export function isStageCleared(stageId) {
  return !progress.lockedStages.includes(stageId) && progress.clearedStages.includes(stageId)
}

export function markStageCleared(stageId, stars = 3) {
  progress.lockedStages = progress.lockedStages.filter(id => id !== stageId)
  if (!progress.clearedStages.includes(stageId)) {
    progress.clearedStages.push(stageId)
  }
  const prevStars = progress.stars[stageId] || 0
  progress.stars[stageId] = Math.max(prevStars, stars)
  progress.checkpoint = null
  save()
}

// ---- mid-stage checkpoint ----
//
// A stage runs ~15 minutes; losing all of it to an iPad going to sleep or a
// Safari tab reload is a real accident for a 5-year-old. This checkpoint is
// deliberately fragile so it only ever rescues an accident: every *intentional*
// leave (the 나가기 button, the recovery panel's exit, clearing the stage)
// erases it, so starting a stage over from the beginning always works and the
// child is never asked to choose between resume and restart.

export function saveCheckpoint(stageId, beatIndex, hitsDealt) {
  const cp = progress.checkpoint
  if (cp && cp.stageId === stageId && cp.beatIndex === beatIndex && cp.hitsDealt === hitsDealt) {
    return
  }
  progress.checkpoint = { stageId, beatIndex, hitsDealt }
  save()
}

export function getCheckpoint(stageId) {
  const cp = progress.checkpoint
  return cp && cp.stageId === stageId ? cp : null
}

export function clearCheckpoint() {
  if (!progress.checkpoint) return
  progress.checkpoint = null
  save()
}

export function isStageUnlocked(stages, stageId) {
  if (reviewMode || isParentAccessEnabled() || DEV_UNLOCK_ALL) return true
  if (progress.lockedStages.includes(stageId)) return false
  if (isStageCleared(stageId)) return true
  const idx = stages.findIndex((s) => s.id === stageId)
  if (idx <= 0) return true
  return isStageCleared(stages[idx - 1].id)
}

// Chapters unlock the same way stages do: chapter N+1 opens once chapter
// N's boss stage is cleared. The first chapter is always unlocked.
export function isChapterUnlocked(chapters, chapterId) {
  if (reviewMode || isParentAccessEnabled() || DEV_UNLOCK_ALL) return true
  const idx = chapters.findIndex((c) => c.id === chapterId)
  const chapter = chapters[idx]
  if (chapter?.stages.length && chapter.stages.every(stage => progress.lockedStages.includes(stage.id))) return false
  if (chapter?.stages.some(stage => isStageCleared(stage.id))) return true
  if (idx <= 0) return true
  const prevChapter = chapters[idx - 1]
  const bossStage = prevChapter.stages.find((s) => s.chapterBoss)
  // Defensive fallback in case a chapter is ever authored without a boss
  // stage -- don't hard-lock progression on a data-authoring mistake.
  if (!bossStage) return prevChapter.stages.every((s) => isStageCleared(s.id))
  return isStageCleared(bossStage.id)
}

// True once every stage in a chapter has been cleared (used for a
// "cleared" badge on the chapter-select screen).
export function isChapterCleared(chapter) {
  return chapter.stages.every((s) => isStageCleared(s.id))
}

// Worlds unlock the same way chapters do: world N+1 opens once the *last*
// chapter in world N has its boss stage cleared (not "every chapter in
// the world cleared" -- kept consistent with isChapterUnlocked, which
// also only checks the immediately-preceding chapter's boss, not every
// earlier chapter). The first world is always unlocked.
export function isWorldUnlocked(worlds, worldId) {
  if (reviewMode || isParentAccessEnabled() || DEV_UNLOCK_ALL) return true
  const idx = worlds.findIndex((w) => w.id === worldId)
  const stages = worlds[idx]?.slots.flatMap(slot => slot.chapter?.stages || []) || []
  if (stages.length && stages.every(stage => progress.lockedStages.includes(stage.id))) return false
  if (stages.some(stage => isStageCleared(stage.id))) return true
  if (idx <= 0) return true
  const prevWorld = worlds[idx - 1]
  const lastSlot = prevWorld.slots[prevWorld.slots.length - 1]
  const lastChapter = lastSlot && lastSlot.chapter
  // The previous world isn't even fully authored yet -- can't have
  // cleared a chapter that doesn't exist, so the next world stays locked.
  if (!lastChapter) return false
  const bossStage = lastChapter.stages.find((s) => s.chapterBoss)
  if (!bossStage) return lastChapter.stages.every((s) => isStageCleared(s.id))
  return isStageCleared(bossStage.id)
}

// True once every authored chapter in a world has been cleared (used for
// a "cleared" badge on the world-select screen). A world containing any
// not-yet-authored chapter slot is never "cleared".
export function isWorldCleared(world) {
  return world.slots.every((slot) => slot.chapter && isChapterCleared(slot.chapter))
}
