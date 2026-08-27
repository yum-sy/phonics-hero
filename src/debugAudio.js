// On-screen audio diagnostics for real devices with no attached console
// (e.g. iPad Chrome, where remote Web Inspector isn't available/wanted).
// Opt-in only, via ?debugaudio=1 -- never loaded otherwise, zero cost in
// the normal app path.
//
// This is a small, non-blocking corner overlay that logs every real
// speechSynthesis.speak() call (and its onstart/onend/onerror) AND every
// WebAudio phoneme buffer play, live, WHILE THE ACTUAL GAME RUNS
// underneath -- earlier synthetic "reproduce it in isolation" test buttons
// (WebAudio-then-TTS with various delays/kicks) all worked fine on the
// real device even when the real game's word audio was totally silent at
// the same time, meaning the synthetic reproductions weren't faithful to
// whatever the real queue/pump() history actually does. This mounts
// alongside real gameplay instead, so the log IS the real sequence of
// events, not a guess at it.
export function mountAudioDebugPanel() {
  const lines = []
  const t0 = Date.now()
  const log = (s) => {
    lines.push(`[+${((Date.now() - t0) / 1000).toFixed(2)}s] ${s}`)
    if (lines.length > 300) lines.shift()
    render()
  }

  // Hook speechSynthesis.speak at the lowest level so every call from
  // anywhere in the app (not just debug-triggered ones) is captured.
  if ('speechSynthesis' in window) {
    const origSpeak = window.speechSynthesis.speak.bind(window.speechSynthesis)
    window.speechSynthesis.speak = function (u) {
      const callAt = Date.now()
      log(`SPEAK text=${JSON.stringify(u.text)} voice=${u.voice ? u.voice.name : '(none)'} vol=${u.volume}`)
      u.addEventListener('start', () => log(`  onstart (+${Date.now() - callAt}ms) "${u.text}"`))
      u.addEventListener('end', () => log(`  onend (+${Date.now() - callAt}ms) "${u.text}"`))
      u.addEventListener('error', (e) => log(`  onerror: ${e.error} (+${Date.now() - callAt}ms) "${u.text}"`))
      try {
        return origSpeak(u)
      } catch (e) {
        log(`  speak() THREW: ${e}`)
        throw e
      }
    }
    const origPause = window.speechSynthesis.pause.bind(window.speechSynthesis)
    window.speechSynthesis.pause = function (...a) {
      log('  [pause() called]')
      return origPause(...a)
    }
    const origResume = window.speechSynthesis.resume.bind(window.speechSynthesis)
    window.speechSynthesis.resume = function (...a) {
      log('  [resume() called]')
      return origResume(...a)
    }
    const origCancel = window.speechSynthesis.cancel.bind(window.speechSynthesis)
    window.speechSynthesis.cancel = function (...a) {
      log('  [cancel() called !!]')
      return origCancel(...a)
    }
  }

  // Hook WebAudio phoneme playback the same way, so its timing relative to
  // speechSynthesis calls is visible in the same timeline.
  if (window.AudioBufferSourceNode) {
    const origStart = AudioBufferSourceNode.prototype.start
    AudioBufferSourceNode.prototype.start = function (...args) {
      const dur = this.buffer ? this.buffer.duration : '?'
      log(`WEBAUDIO buffer.start() dur=${dur}`)
      this.addEventListener('ended', () => log(`  webaudio ended (dur=${dur})`))
      return origStart.apply(this, args)
    }
  }

  // Narrow left-side column instead of a bottom bar -- a bottom bar grows
  // over the game's own bottom-anchored buttons (confirm/options), which
  // made the game unplayable underneath it. A fixed-width side column never
  // overlaps that area regardless of how much log accumulates.
  const wrap = document.createElement('div')
  wrap.style.cssText =
    'position:fixed;left:0;top:0;bottom:0;width:240px;z-index:99999;' +
    'overflow:auto;background:rgba(0,0,0,0.88);color:#0f0;' +
    'font:10px/1.35 monospace;padding:6px;white-space:pre-wrap;word-break:break-word;' +
    'border-right:2px solid #0f0;'
  document.body.appendChild(wrap)

  const bar = document.createElement('div')
  bar.style.cssText =
    'display:flex;flex-direction:row;flex-wrap:wrap;gap:4px;margin-bottom:5px;' +
    'position:sticky;top:0;background:rgba(0,0,0,0.88);'
  const mkBtn = (label, fn) => {
    const b = document.createElement('button')
    b.textContent = label
    b.style.cssText = 'font:10px monospace;padding:4px 6px;'
    b.onclick = fn
    bar.appendChild(b)
    return b
  }
  let collapsed = false
  const body = document.createElement('div')
  mkBtn('collapse', () => {
    collapsed = !collapsed
    body.style.display = collapsed ? 'none' : 'block'
  })
  mkBtn('clear', () => {
    lines.length = 0
    render()
  })
  mkBtn('copy all', () => {
    const text = lines.join('\n')
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(
        () => log('[copied to clipboard]'),
        () => log('[clipboard copy failed -- select text manually]')
      )
    }
  })
  wrap.appendChild(bar)
  wrap.appendChild(body)

  function render() {
    body.textContent = lines.slice(-120).join('\n')
    wrap.scrollTop = wrap.scrollHeight
  }

  log(
    `panel mounted. speechSynthesis in window: ${'speechSynthesis' in window}. ` +
      `Play the real game normally -- every speak()/WebAudio call anywhere in the app will log here live.`
  )
  render()
}
