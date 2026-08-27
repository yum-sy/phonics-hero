import './style.css'
import { renderWorldSelect } from './screens.js'

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
