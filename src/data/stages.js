// Backwards-compatible entry point. The actual content now lives split up
// under ./chapters/ (one file per chapter) -- see ./chapters/index.js for
// how they're combined. This file just re-exports the same public shape
// that used to live here directly, so existing imports keep working.
export {
  chapters,
  stages,
  worlds,
  getChapterById,
  getChapterForStage,
  getStageById,
  getWorldById,
  getWorldForChapterOrder,
  stageHealthMax,
} from './chapters/index.js'
