// On-screen audio diagnostics for real devices with no attached console
// (e.g. iPad Chrome, where remote Web Inspector isn't available/wanted).
// Opt-in only, via ?debugaudio=1 -- never loaded otherwise, zero cost in
// the normal app path. Renders live state as visible text instead of
// console.log, and lets a real tap on the device drive real speak() calls
// so the failure (or success) is visible right on the screen it happens on.
import { unlockAudio, speakEN, speakTap } from './audio.js'

export function mountAudioDebugPanel() {
  const el = document.createElement('div')
  el.style.cssText =
    'position:fixed;inset:0;z-index:99999;background:#111;color:#0f0;' +
    'font:12px/1.4 monospace;padding:12px;overflow:auto;white-space:pre-wrap;'
  document.body.appendChild(el)

  const lines = []
  const log = (s) => {
    lines.push(`[${new Date().toISOString().slice(11, 23)}] ${s}`)
    render()
  }

  const origSpeak = window.speechSynthesis && window.speechSynthesis.speak.bind(window.speechSynthesis)
  if (origSpeak) {
    window.speechSynthesis.speak = function (u) {
      const t0 = Date.now()
      log(`speak() CALLED text=${JSON.stringify(u.text)} voice=${u.voice ? u.voice.name : '(none)'} lang=${u.lang}`)
      u.addEventListener('start', () => log(`  -> onstart (+${Date.now() - t0}ms)`))
      u.addEventListener('end', () => log(`  -> onend (+${Date.now() - t0}ms)`))
      u.addEventListener('error', (e) => log(`  -> onerror: ${e.error} (+${Date.now() - t0}ms)`))
      let threw = null
      try {
        return origSpeak(u)
      } catch (e) {
        threw = e
        log(`  -> speak() THREW: ${e}`)
        throw e
      }
    }
  }

  function voiceInfo() {
    if (!('speechSynthesis' in window)) return 'speechSynthesis: NOT SUPPORTED'
    const list = window.speechSynthesis.getVoices() || []
    const chosen = window.__carbotVoices
    return [
      `getVoices() count: ${list.length}`,
      `chosen (window.__carbotVoices): ${chosen ? JSON.stringify(chosen, null, 1) : '(not set yet -- tap "Unlock" first)'}`,
      `speaking=${window.speechSynthesis.speaking} pending=${window.speechSynthesis.pending} paused=${window.speechSynthesis.paused}`,
      '',
      'full voice list:',
      ...list.map((v) => `  ${v.name} [${v.lang}] local=${v.localService} default=${v.default}`),
    ].join('\n')
  }

  function render() {
    el.textContent =
      '=== AUDIO DEBUG (?debugaudio=1) ===\n\n' +
      voiceInfo() +
      '\n\n=== EVENT LOG (newest last) ===\n' +
      lines.slice(-40).join('\n')
  }

  const btnBar = document.createElement('div')
  btnBar.style.cssText = 'position:sticky;top:0;background:#111;padding-bottom:8px;display:flex;gap:8px;flex-wrap:wrap;'
  const mkBtn = (label, fn) => {
    const b = document.createElement('button')
    b.textContent = label
    b.style.cssText = 'font:14px monospace;padding:8px 12px;'
    b.onclick = fn
    btnBar.appendChild(b)
    return b
  }
  mkBtn('1. Unlock (tap first)', () => {
    log('tapping unlockAudio()...')
    unlockAudio()
    setTimeout(render, 300)
  })
  mkBtn('2. speakEN("dog")', () => {
    log('calling speakEN("dog")...')
    speakEN('dog').then((trusted) => log(`speakEN("dog") promise resolved, trusted=${trusted}`))
  })
  mkBtn('3. speakTap("sun")', () => {
    log('calling speakTap("sun")...')
    speakTap('sun').then((trusted) => log(`speakTap("sun") promise resolved, trusted=${trusted}`))
  })
  mkBtn('4. raw speak("hello")', () => {
    log('calling raw window.speechSynthesis.speak(new SpeechSynthesisUtterance("hello")) with NO voice/lang set...')
    try {
      window.speechSynthesis.speak(new SpeechSynthesisUtterance('hello'))
    } catch (e) {
      log('raw speak threw: ' + e)
    }
  })
  mkBtn('Refresh', render)
  mkBtn('Clear log', () => {
    lines.length = 0
    render()
  })

  el.innerHTML = ''
  el.appendChild(btnBar)
  const body = document.createElement('div')
  el.appendChild(body)
  const origRender = render
  render = () => {
    body.textContent =
      voiceInfo() + '\n\n=== EVENT LOG (newest last) ===\n' + lines.slice(-40).join('\n')
  }
  render()

  // Voices often populate asynchronously after the panel mounts.
  if ('speechSynthesis' in window) {
    window.speechSynthesis.addEventListener?.('voiceschanged', render)
  }
  setInterval(render, 1000)
}
