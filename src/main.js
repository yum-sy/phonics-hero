import './style.css'
import { renderWorldSelect } from './screens.js'
import { resetProgress, forceClearStage } from './state.js'
import { stages } from './data/chapters/index.js'

// Opt-in dev convenience: a device's saved progress can only be cleared
// from that device itself, so a query param stands in for a "clear site
// data" button neither Safari nor Chrome on iPad exposes as a one-tap
// action. Consumed once, then stripped so a reload/share of the URL
// doesn't wipe progress again by accident.
const devParams = new URLSearchParams(location.search)
let devParamConsumed = false
if (devParams.get('resetprogress') === '1') {
  resetProgress()
  devParamConsumed = true
}
// ?forceclear=<stageId>[,<stageId>...] unlocks specific stages being tested
// (comma-separated, e.g. marking a whole run of prior chapters cleared at
// once so real-device playtesting can resume partway through the
// curriculum), without flipping DEV_UNLOCK_ALL and re-opening every stage.
if (devParams.get('forceclear')) {
  devParams
    .get('forceclear')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean)
    .forEach((id) => forceClearStage(id))
  devParamConsumed = true
}
// ?forceclearthrough=<stageId> is the one-shot form of the above: it marks
// every stage up to and including the given one cleared, in curriculum
// order (stages is chapters.flatMap(...), already in play order) -- so
// resuming a real-device playtest partway through doesn't need a URL
// listing every prior stage id by hand.
if (devParams.get('forceclearthrough')) {
  const targetId = devParams.get('forceclearthrough')
  const idx = stages.findIndex((s) => s.id === targetId)
  if (idx >= 0) {
    for (let i = 0; i <= idx; i++) forceClearStage(stages[i].id)
  }
  devParamConsumed = true
}
if (devParamConsumed) {
  const url = new URL(location.href)
  url.searchParams.delete('resetprogress')
  url.searchParams.delete('forceclear')
  url.searchParams.delete('forceclearthrough')
  history.replaceState(null, '', url)
}

renderWorldSelect()

// Opt-in on-screen audio diagnostics for a device with no attached console
// (?debugaudio=1) -- see src/debugAudio.js. Lazy-imported so it costs
// nothing in the normal app path.
if (new URLSearchParams(location.search).get('debugaudio') === '1') {
  // .catch() logs instead of leaving an unhandled rejection: with no
  // console open on the real device this opt-in was mounted for, a
  // rejection here used to fail completely silently -- the panel just
  // never appears, with no clue why (real-device report, 2026-09).
  import('./debugAudio.js')
    .then((m) => m.mountAudioDebugPanel())
    .catch((e) => console.error('[debugaudio] failed to mount', e))
}
if (new URLSearchParams(location.search).get('debugart') === '1') {
  import('./debugArt.js')
    .then((m) => m.mountArtDebugPanel())
    .catch((e) => console.error('[debugart] failed to mount', e))
}
