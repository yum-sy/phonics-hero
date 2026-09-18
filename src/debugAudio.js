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
//
// Structural rule for this whole function, learned the hard way on a real
// device (two rounds of "ReferenceError: Cannot access 'X' before
// initialization", first for `body` then for `wrap`): EVERY DOM element
// `render()` touches must be created, and `render` itself defined, BEFORE
// `log()` is defined and before any hook that can call `log()` is
// installed. `log()` calls `render()`, and every hook below (speechSynthesis,
// AudioBufferSourceNode, getUserMedia) calls `log()` from inside a
// REPLACEMENT function it installs -- V8 (desktop Chrome, where this was
// first written and tested) tolerated referencing those `const`s from a
// closure defined earlier in the function, as long as they were assigned
// before anything actually CALLED that closure. Whatever is different
// about the real device's engine does not, so don't rely on "nothing calls
// it that early" again -- keep the dependency order itself impossible to
// violate instead of re-auditing it by hand.
export function mountAudioDebugPanel() {
  const lines = []
  const t0 = Date.now()

  // ---- 1. every DOM element + render() -- before anything can call it ----

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
  const body = document.createElement('div')
  let collapsed = false
  mkBtn('collapse', () => {
    collapsed = !collapsed
    body.style.display = collapsed ? 'none' : 'block'
  })
  mkBtn('clear', () => {
    lines.length = 0
    render()
  })
  // Isolates ONE variable: does a raw speak() call still produce audible
  // sound if it happens a couple seconds AFTER the tap that triggered it,
  // instead of synchronously inside the tap handler? The real game's word
  // audio always goes through several async awaits (queue gaps, asset
  // wait timeouts) before the actual speak() call, so if iOS's "must be
  // inside a live user-activation window" gesture policy is stricter here
  // than assumed, a delayed call would silently fail exactly like the real
  // game does, while an immediate one (like the earlier working manual
  // button tests) succeeds.
  mkBtn('TEST A: raw speak NOW (sync in tap)', () => {
    log('TEST A: calling raw speak() synchronously inside this tap...')
    const u = new SpeechSynthesisUtterance('testing sync')
    u.lang = 'en-US'
    window.speechSynthesis.speak(u)
  })
  mkBtn('TEST B: raw speak after 2s delay', () => {
    log('TEST B: waiting 2s after this tap, THEN calling raw speak()...')
    setTimeout(() => {
      const u = new SpeechSynthesisUtterance('testing after delay')
      u.lang = 'en-US'
      window.speechSynthesis.speak(u)
    }, 2000)
  })
  // The real game's onTap() (screens.js) fires its handler from
  // `pointerdown`, not `click` -- deliberately, for touch responsiveness.
  // A and B above both used a plain <button>, whose only listener here is
  // `click` (a mouse/tap "activation" event fired on release). If iOS
  // WebKit only grants speechSynthesis a live user-activation window for
  // click/touchend-style events and NOT pointerdown/touchstart (touchstart
  // can be the start of a scroll, not a deliberate tap, so some iOS APIs
  // are documented to require the touchEND-family event instead), then
  // every one of the real game's pointerdown-triggered speak() calls would
  // be silently rejected while an identical click-triggered call succeeds
  // -- exactly the split observed so far (debug buttons: audible; real
  // game: silent). This box has its own pointerdown listener, bypassing
  // the button's click entirely, to test that split directly.
  const pdBox = document.createElement('div')
  pdBox.textContent = 'TEST C: tap here (pointerdown, not click)'
  pdBox.style.cssText =
    'font:10px monospace;padding:6px;border:1px solid #0f0;margin-top:4px;' +
    'background:#030;cursor:pointer;'
  pdBox.addEventListener('pointerdown', () => {
    log('TEST C: pointerdown fired -- calling raw speak() synchronously inside it...')
    const u = new SpeechSynthesisUtterance('testing pointerdown')
    u.lang = 'en-US'
    window.speechSynthesis.speak(u)
  })
  bar.appendChild(pdBox)
  // navigator.clipboard needs a secure context (https/localhost) and
  // silently isn't available over plain http:// LAN addresses, which is
  // exactly how this gets loaded on a real device -- so instead of the
  // Clipboard API, populate a real <textarea> and select() it: iOS's
  // native text-selection handles + "Copy" popup work regardless of
  // clipboard permissions, since that's OS-level selection, not a JS API.
  const copyBox = document.createElement('textarea')
  copyBox.readOnly = true
  copyBox.style.cssText =
    'display:none;width:100%;height:200px;margin-top:6px;background:#000;color:#0f0;' +
    'font:10px monospace;border:1px solid #0f0;'
  mkBtn('select text to copy', () => {
    copyBox.value = lines.join('\n')
    copyBox.style.display = 'block'
    copyBox.focus()
    copyBox.select()
    log('[textarea below is selected -- use the native "Copy" popup, or just screenshot the log]')
  })
  wrap.appendChild(bar)
  wrap.appendChild(copyBox)
  wrap.appendChild(body)

  function render() {
    body.textContent = lines.slice(-120).join('\n')
    wrap.scrollTop = wrap.scrollHeight
  }

  // ---- 2. log(), which only needs render() (already defined above) ----

  const log = (s) => {
    lines.push(`[+${((Date.now() - t0) / 1000).toFixed(2)}s] ${s}`)
    if (lines.length > 300) lines.shift()
    render()
  }

  // ---- 3. hooks -- only now, since every one of these can call log() ----

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

  // Real-device report: the mic-gated ATTACK ("소리쳐서 공격") lands a hit
  // with no sound at all, immediately -- which is the exact symptom of
  // attemptShoutAttack() (audio.js) resolving 'unsupported' (no mic API,
  // permission denied, or getUserMedia rejecting) rather than actually
  // sampling volume, since the caller (screens.js) treats 'unsupported'
  // exactly like a real detected shout by design (no mic access must never
  // block the game). Whether that's what's happening here, or the RMS
  // threshold itself is being crossed by something else, can't be told
  // apart without seeing which one actually fires on THIS device -- hence
  // this hook instead of guessing. getUserMedia is a global browser API
  // (unlike attemptShoutAttack, which is a module-internal function), so
  // it's hookable the same way speechSynthesis/AudioBufferSourceNode are
  // above; attemptShoutAttack's own RMS samples/result log via
  // window.__debugAudioLog, set below, which audio.js calls if present
  // (module-load order between this file and audio.js is otherwise
  // irrelevant since it's read at call time, not import time).
  window.__debugAudioLog = log
  // Wrapped separately and defensively: `navigator.mediaDevices` is a
  // browser-owned object, and WebKit/iOS has a real history of getter-only
  // or non-configurable properties on host objects that throw on plain
  // assignment in strict mode (every ES module is strict mode). This hook
  // is a diagnostic nice-to-have -- if it can't attach on some engine, that
  // must not take the rest of the panel down with it.
  try {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      const origGUM = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices)
      navigator.mediaDevices.getUserMedia = function (constraints) {
        log(`getUserMedia(${JSON.stringify(constraints)}) called`)
        return origGUM(constraints).then(
          (stream) => {
            const track = stream.getAudioTracks()[0]
            log(
              `  getUserMedia RESOLVED, audio track settings: ${
                track ? JSON.stringify(track.getSettings()) : '(no audio track!)'
              }`
            )
            return stream
          },
          (err) => {
            log(`  getUserMedia REJECTED: ${err && err.name} -- ${err && err.message}`)
            throw err
          }
        )
      }
    } else {
      log('navigator.mediaDevices.getUserMedia not present on this browser/context')
    }
  } catch (e) {
    log(`  could not hook navigator.mediaDevices.getUserMedia (${e}) -- attemptShoutAttack()'s own [shout] logs (audio.js) still work regardless`)
  }

  log(
    `panel mounted. speechSynthesis in window: ${'speechSynthesis' in window}. ` +
      `Play the real game normally -- every speak()/WebAudio call anywhere in the app will log here live.`
  )
  render()
}
