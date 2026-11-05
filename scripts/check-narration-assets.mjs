// Decode every published narration file in real Chrome, then exercise native mixed playback.
// This is desktop evidence, not iPad or human pronunciation approval.
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const base = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '')
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const work = await mkdtemp(join(tmpdir(), 'phonics-narration-'))
const profile = join(work, 'profile')
const output = process.env.NARRATION_CHECK_OUTPUT || join(work, 'results')
await mkdir(output, { recursive: true })
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--ignore-certificate-errors',
  '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] })
let chromeErrors = ''
chrome.stderr.on('data', (chunk) => { chromeErrors = (chromeErrors + chunk).slice(-6000) })
let socket
let requestId = 0
const pending = new Map()
let currentErrors = []
let currentNetworkFailures = []
const report = { base, generatedAt: new Date().toISOString(), cases: [], failures: [] }

async function until(fn, description, timeout = 20000) {
  const end = Date.now() + timeout
  while (Date.now() < end) {
    const result = await fn()
    if (result) return result
    await sleep(100)
  }
  throw new Error(`Timed out: ${description}`)
}

function command(method, params = {}) {
  const id = ++requestId
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => { pending.delete(id); reject(new Error(`CDP timeout: ${method}`)) }, 30000)
    pending.set(id, { resolve, reject, timeout })
    socket.send(JSON.stringify({ id, method, params }))
  })
}

async function evaluate(expression) {
  const r = await command('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })
  if (r.exceptionDetails) throw new Error(r.exceptionDetails.exception?.description || r.exceptionDetails.text)
  return r.result.value
}

async function navigate(path) {
  currentErrors = []
  currentNetworkFailures = []
  const url = base + path
  await command('Page.navigate', { url })
  await until(async () => {
    try { return await evaluate(`location.href === ${JSON.stringify(url)} && document.readyState !== 'loading'`) }
    catch { return false }
  }, `new document ${path}`)
}

async function screenshot(name) {
  const { data } = await command('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false })
  await writeFile(join(output, `${name}.png`), Buffer.from(data, 'base64'))
}


try {
  const port = await until(async () => {
    try { return Number((await readFile(join(profile, 'DevToolsActivePort'), 'utf8')).split('\n')[0]) }
    catch { if (chrome.exitCode !== null) throw new Error(chromeErrors); return null }
  }, 'Chrome debugging port')
  const tabs = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json()
  socket = new WebSocket(tabs.find(t => t.type === 'page').webSocketDebuggerUrl)
  await new Promise((resolve, reject) => { socket.addEventListener('open', resolve, { once: true }); socket.addEventListener('error', reject, { once: true }) })
  socket.addEventListener('message', ({ data }) => {
    const message = JSON.parse(data)
    if (message.id) {
      const job = pending.get(message.id)
      if (!job) return
      clearTimeout(job.timeout); pending.delete(message.id)
      if (message.error) job.reject(new Error(JSON.stringify(message.error)))
      else job.resolve(message.result)
    } else if (message.method === 'Runtime.consoleAPICalled') {
      const text = message.params.args.map(a => a.value ?? a.description ?? '').join(' ')
      if (text.includes('[chapters]') || message.params.type === 'error') currentErrors.push(text)
    } else if (message.method === 'Runtime.exceptionThrown') {
      currentErrors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text)
    } else if (message.method === 'Network.responseReceived') {
      const { url, status } = message.params.response
      if (/\/art\/v[23]\//.test(url) && status >= 400) currentNetworkFailures.push({ url, status })
    }
  })
  await Promise.all([command('Page.enable'), command('Runtime.enable'), command('Network.enable')])
  await command('Emulation.setDeviceMetricsOverride', { width: 834, height: 1194, deviceScaleFactor: 1, mobile: false })
  await navigate('/narration/manifest.json')
  const manifest = await evaluate(`fetch(location.href).then(r => r.json())`)
  assert(manifest.entries.length > 0)
  if (process.env.NARRATION_EXPECT_VOICE) {
    assert(manifest.entries.every(entry => entry.voice === process.env.NARRATION_EXPECT_VOICE),
      `Manifest contains a voice other than ${process.env.NARRATION_EXPECT_VOICE}`)
  }
  report.manifestEntries = manifest.entries.length
  report.voices = Object.fromEntries([...new Set(manifest.entries.map(entry => entry.voice))]
    .map(voice => [voice, manifest.entries.filter(entry => entry.voice === voice).length]))
  report.files = manifest.entries.map(({ id, file, sha256 }) => ({ id, file, sha256 }))
  await evaluate('window.__decodeCtx = new AudioContext()')
  for (let i = 0; i < manifest.entries.length; i += 16) {
    const batch = manifest.entries.slice(i, i + 16)
    const decoded = await evaluate(`Promise.all(${JSON.stringify(batch)}.map(async clip => {
      const response = await fetch(new URL(clip.file, location.href))
      if (!response.ok) throw new Error(clip.file + ': HTTP ' + response.status)
      const data = await window.__decodeCtx.decodeAudioData(await response.arrayBuffer())
      let sum = 0, peak = 0, count = 0
      for (let channel = 0; channel < data.numberOfChannels; channel++) {
        for (const sample of data.getChannelData(channel)) { sum += sample * sample; peak = Math.max(peak, Math.abs(sample)); count++ }
      }
      return { id: clip.id, file: clip.file, durationMs: data.duration * 1000, expectedMs: clip.durationMs, rms: Math.sqrt(sum/count), peak }
    }))`)
    for (const row of decoded) {
      const passed = row.rms > 0.0005 && Math.abs(row.durationMs - row.expectedMs) < 150 && row.peak <= 1.01
      report.cases.push({ name: row.id, passed, ...row })
      if (!passed) report.failures.push(row)
    }
  }
  await evaluate('window.__decodeCtx.close()')
  console.log(`Decoded ${manifest.entries.length} published clips; ${report.failures.length} failures`)
  // Fresh native context is created by audio.js. Its ordinary click handler
  // resumes it; no autoplay-policy overrides are used by this browser.
  const word = manifest.entries.find(e => e.lang === 'en-US' && e.text === 'dog') || manifest.entries.find(e => e.lang === 'en-US')
  const korean = manifest.entries.find(e => e.lang === 'ko-KR' && e.durationMs < 7000)
  assert(word && korean)
  await evaluate(`(async () => {
    document.body.innerHTML = '<button id="play" style="width:200px;height:100px">Play test</button>'
    window.__starts = []; window.__tts = []
    const create = AudioContext.prototype.createBufferSource
    AudioContext.prototype.createBufferSource = function() {
      const source = create.call(this), start = source.start
      source.start = function(...args) { window.__starts.push({ at: performance.now(), duration: this.buffer.duration }); return start.apply(this,args) }
      return source
    }
    const speak = speechSynthesis.speak.bind(speechSynthesis)
    speechSynthesis.speak = utter => { if (utter.volume !== 0) window.__tts.push(utter.text); return speak(utter) }
    const audio = await import('/src/audio.js')
    document.getElementById('play').onclick = async () => {
      try {
        await Promise.all([audio.speakEN('sss'), audio.speakEN(${JSON.stringify(word.text)}), audio.speakKO(${JSON.stringify(korean.text)})])
        await audio.whenAudioIdle()
        window.__nativeResult = { starts: window.__starts, tts: window.__tts, idle: audio.isAudioIdle() }
      } catch (e) { window.__nativeResult = { error: String(e) } }
    }
  })()`)
  await command('Input.dispatchMouseEvent', { type:'mousePressed', x:80, y:50, button:'left', clickCount:1 })
  await command('Input.dispatchMouseEvent', { type:'mouseReleased', x:80, y:50, button:'left', clickCount:1 })
  const native = await until(() => evaluate('window.__nativeResult'), 'native mixed queue', 30000)
  const passed = !native.error && native.idle && native.tts.length === 0 && native.starts.length === 3 &&
    native.starts.every((entry,i,list) => !i || entry.at >= list[i-1].at + list[i-1].duration * 1000 - 3)
  report.cases.push({name:'native-mixed-queue',passed,...native})
  if (!passed) report.failures.push({name:'native-mixed-queue',...native})
  if (currentErrors.length) report.failures.push({name:'console',errors:currentErrors})
  const finalManifest = await evaluate(`fetch(location.href, {cache:'no-store'}).then(r => r.json())`)
  assert.deepEqual(finalManifest.entries, manifest.entries, 'Published files changed during verification; rerun on stable output')
  console.log(`${passed ? 'PASS' : 'FAIL'} native phoneme + generated English + Korean playback`)
} catch (error) {
  report.failures.push({name:'narration',error:error.stack})
  console.error(error.stack)
} finally {
  await writeFile(join(output,'report.json'),JSON.stringify(report,null,2)+'\n')
  if (socket?.readyState===WebSocket.OPEN) await command('Browser.close').catch(()=>{})
  socket?.close()
  if(chrome.exitCode===null) chrome.kill('SIGTERM')
  await new Promise(resolve=>{if(chrome.exitCode!==null)resolve();else {chrome.once('exit',resolve);setTimeout(resolve,3000)}})
  await rm(profile,{recursive:true,force:true,maxRetries:3}).catch(()=>{})
  console.log(`Evidence: ${output}`)
  console.log(`${report.cases.filter(c=>c.passed).length}/${report.cases.length} suites passed; ${report.failures.length} failures`)
  if(report.failures.length)process.exitCode=1
}
