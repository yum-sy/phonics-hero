const STORAGE_KEY = 'carbot-phonics-progress-v1'

// TEMPORARY dev flag: content is still being reviewed stage-by-stage, so
// unlock gating is disabled to let the parent jump straight to any stage.
// Flip this back to false before shipping.
const DEV_UNLOCK_ALL = true

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { clearedStages: [], stars: {} }
    return JSON.parse(raw)
  } catch (e) {
    return { clearedStages: [], stars: {} }
  }
}

export const progress = load()

export function save() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  } catch (e) {
    // ignore (e.g. private mode quota)
  }
}

export function isStageCleared(stageId) {
  return progress.clearedStages.includes(stageId)
}

export function markStageCleared(stageId, stars = 3) {
  if (!progress.clearedStages.includes(stageId)) {
    progress.clearedStages.push(stageId)
  }
  const prevStars = progress.stars[stageId] || 0
  progress.stars[stageId] = Math.max(prevStars, stars)
  save()
}

export function isStageUnlocked(stages, stageId) {
  if (DEV_UNLOCK_ALL) return true
  const idx = stages.findIndex((s) => s.id === stageId)
  if (idx <= 0) return true
  return isStageCleared(stages[idx - 1].id)
}

// Chapters unlock the same way stages do: chapter N+1 opens once chapter
// N's boss stage is cleared. The first chapter is always unlocked.
export function isChapterUnlocked(chapters, chapterId) {
  if (DEV_UNLOCK_ALL) return true
  const idx = chapters.findIndex((c) => c.id === chapterId)
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
  if (DEV_UNLOCK_ALL) return true
  const idx = worlds.findIndex((w) => w.id === worldId)
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
