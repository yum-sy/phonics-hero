import './style.css'
import { renderWorldSelect } from './screens.js'
import { resetProgress, forceClearStage } from './state.js'

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
// ?forceclear=<stageId> unlocks the one next stage being tested, without
// flipping DEV_UNLOCK_ALL and re-opening every stage in the app.
if (devParams.get('forceclear')) {
  forceClearStage(devParams.get('forceclear'))
  devParamConsumed = true
}
if (devParamConsumed) {
  const url = new URL(location.href)
  url.searchParams.delete('resetprogress')
  url.searchParams.delete('forceclear')
  history.replaceState(null, '', url)
}

renderWorldSelect()

// Opt-in on-screen audio diagnostics for a device with no attached console
// (?debugaudio=1) -- see src/debugAudio.js. Lazy-imported so it costs
// nothing in the normal app path.
if (new URLSearchParams(location.search).get('debugaudio') === '1') {
  import('./debugAudio.js').then((m) => m.mountAudioDebugPanel())
}
if (new URLSearchParams(location.search).get('debugart') === '1') {
  import('./debugArt.js').then((m) => m.mountArtDebugPanel())
}
