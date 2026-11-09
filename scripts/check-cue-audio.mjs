// Run against Vite: node scripts/check-cue-audio.mjs [http://localhost:5174]
// Native cue playback with rapid taps, Next waiting, original phonemes and Exit cancellation.
// Set CUE_CHECK_OUTPUT to retain evidence. Desktop Chrome does not certify iPad audio.
// Uses a private headless Chrome process, never the user's browser/profile.
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const base = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '')
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const work = await mkdtemp(join(tmpdir(), 'phonics-cue-audio-'))
const profile = join(work, 'profile')
const output = process.env.CUE_CHECK_OUTPUT || join(work, 'results')
await mkdir(output, { recursive: true })
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
const chrome = spawn(chromePath, [
  '--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
  '--disable-background-networking', '--ignore-certificate-errors',
  // The harness clicks programmatically; permit real buffer playback instead
  // of silently exercising only the system-TTS fallback in suspended contexts.
  '--autoplay-policy=no-user-gesture-required',
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
  await command('Page.addScriptToEvaluateOnNewDocument', {source: `
    const rawBuffers = new WeakMap(), decodedBuffers = new WeakMap();
    window.cueAudioEvents = [];
    const readBuffer = Response.prototype.arrayBuffer;
    Response.prototype.arrayBuffer = async function(...args) {
      const buffer = await readBuffer.apply(this,args); rawBuffers.set(buffer,this.url); return buffer;
    };
    const decode = AudioContext.prototype.decodeAudioData;
    AudioContext.prototype.decodeAudioData = function(buffer,...args) {
      const url = rawBuffers.get(buffer);
      const result = decode.call(this,buffer,...args);
      return result.then(decoded => { decodedBuffers.set(decoded,url); return decoded; });
    };
    const start = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function(...args) {
      const url = decodedBuffers.get(this.buffer);
      window.cueAudioEvents.push({url, event:'start', at:performance.now()});
      this.addEventListener('ended',()=>window.cueAudioEvents.push({url,event:'end',at:performance.now()}),{once:true});
      return start.apply(this,args);
    };
  `});
  await navigate('/review.html');
  await until(() => evaluate(`document.querySelector('.review-catalog')`), 'review catalog');
  const fixture = await evaluate(`(async () => {
    const {chapters,SOUND_CUES} = await import('/src/data/chapters/index.js');
    const {narrationFor} = await import('/src/audio/narration-assets.js');
    const stage = chapters.flatMap(c=>c.stages).find(s=>s.beats[0]?.kind==='teach' && s.beats[0].repeatAudio?.includes('fff'));
    const cue = SOUND_CUES.fff;
    const clip = narrationFor(cue.action,'ko-KR');
    if (!clip) throw new Error('F cue Nova asset missing');
    window.cueStageId = stage.id;
    const chapterIndex = chapters.findIndex(c=>c.stages.some(s=>s.id===stage.id));
    const selector = document.querySelector('#review-chapter');
    selector.value = String(chapterIndex); selector.dispatchEvent(new Event('change'));
    document.querySelector('[data-review-stage="'+stage.id+'"]').click();
    return {stage:stage.id,action:cue.action,file:clip.file};
  })()`);
  assert.equal(fixture.action,'풍선의 바람을 빼듯 두 손을 천천히 모아요');
  const check = (name,condition) => {assert(condition,name);report.cases.push({name,passed:true});console.log('PASS '+name)};
  check('native-cue-button-balloon-label',await evaluate(`(() => {const b=document.querySelector('.beat-cue-line'); return b?.tagName==='BUTTON' && b.textContent.includes('풍선') && b.getAttribute('aria-label').startsWith('동작 듣기:')})()`));
  await screenshot('balloon-cue');
  await evaluate(`(() => {const cue=document.querySelector('.beat-cue-line'); cue.click(); cue.click(); cue.click(); document.querySelector('#replay-btn').click(); document.querySelector('#continue-btn').click();})()`);
  await sleep(150);
  check('next-waits-for-model-and-cue',await evaluate(`!!document.querySelector('.beat-cue-line') && document.querySelector('#continue-btn').disabled`));
  await until(() => evaluate(`!document.querySelector('.beat-cue-line')`),'advance after cue',30000);
  const events = await evaluate('window.cueAudioEvents');
  const cueEvents = events.filter(e=>e.url?.endsWith(fixture.file));
  check('repeated-taps-queue-one-cue',cueEvents.filter(e=>e.event==='start').length===1);
  check('cue-finished-before-next',cueEvents.some(e=>e.event==='end'));
  const originalSound = events.filter(e=>e.url?.includes('/sounds/') && e.event==='end');
  check('original-phoneme-finishes-before-cue',originalSound.length>0 && originalSound.some(e=>e.at < cueEvents.find(e=>e.event==='start').at));
  await evaluate(`document.querySelector('#exit-stage').click(); document.querySelector('[data-review-stage="'+window.cueStageId+'"]').click()`);
  const countBeforeExit = await evaluate(`window.cueAudioEvents.filter(e=>e.url?.endsWith(${JSON.stringify(fixture.file)}) && e.event==='start').length`);
  await evaluate(`document.querySelector('.beat-cue-line').click(); document.querySelector('#exit-stage').click()`);
  await sleep(5000);
  check('exit-discards-pending-cue',await evaluate(`window.cueAudioEvents.filter(e=>e.url?.endsWith(${JSON.stringify(fixture.file)}) && e.event==='start').length === ${countBeforeExit}`));
  check('exit-stays-in-review',await evaluate(`!!document.querySelector('.review-catalog')`));
  check('console-clean',currentErrors.length===0);
  report.events=events;
  for (const [orientation,width,height] of [['portrait',834,1194],['landscape',1194,834]]) {
    await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    await navigate('/_probe.html?iso='+fixture.stage+':teach&unlock=1&delay=1200');
    const hud = await until(()=>evaluate(`document.documentElement.getAttribute('data-probe')`),'F cue HUD');
    check('balloon-cue-'+orientation+'-HUD',/^NOSCROLL\b/.test(hud) && !/CLIP=|SPILL=|\*\*\*/.test(hud));
    check('balloon-cue-'+orientation+'-rendered',await evaluate(`document.querySelector('.beat-cue-line')?.textContent.includes('풍선')`));
    await screenshot('balloon-'+orientation);
    report.cases[report.cases.length-1].hud=hud;
  }

} catch (error) {
  report.failures.push({name:'game-flow',error:error.stack})
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
