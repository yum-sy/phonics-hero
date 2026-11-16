// Dev-only parent UI layout checks: node scripts/check-parent-controls-layout.mjs [http://localhost:5174]
// PIN modal uses shipped standalone CSS with simulated 24px insets; not real-device evidence.
// Uses a private headless Chrome process, never the user's browser/profile.
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const base = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '')
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const work = await mkdtemp(join(tmpdir(), 'phonics-parent-layout-'))
const profile = join(work, 'profile')
const output = process.env.PARENT_LAYOUT_OUTPUT || join(work, 'results')
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



function pass(name, detail = {}) { report.cases.push({name, passed:true, ...detail}); console.log(`PASS ${name}`) }
async function runChecks() {
  await navigate('/'); await until(()=>evaluate(`!!document.querySelector('.screen')`),'game');
  const key=(process.env.LAYOUT_PROGRESS_PREFIX==='phonics-poke'||base.endsWith('5175'))?'phonics-poke-parent-access-v2':'phonics-hero-parent-access-v2';
  await evaluate(`sessionStorage.setItem(${JSON.stringify(key)},'1')`);
  for(const [width,height]of[[834,1194],[1194,834],[604,725],[725,604]])for(const shot of ['world','chapters','map4','battle1']){
    await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    await navigate('/_probe.html?shot='+shot);await until(()=>evaluate(`!!document.querySelector('.parent-hold-target[data-parent-unlocked="true"]')`),'parent view');await evaluate(`document.fonts.ready.then(()=>true)`);await sleep(100);
    const m=await evaluate(`(()=>{const rect=x=>x.getBoundingClientRect();const hit=(a,b)=>a.left<b.right-1&&a.right>b.left+1&&a.top<b.bottom-1&&a.bottom>b.top+1;const title=document.querySelector('.stage-parent-title');const checks=title?[[title,document.querySelector('#exit-stage')],[title,document.querySelector('.battle-scene')]]:[[document.querySelector('.parent-progress-bar [role=status]'),document.querySelector('.parent-session-controls')]];return {overlap:checks.filter(([a,b])=>a&&b&&hit(rect(a),rect(b))).map(([a,b])=>[a.className,rect(a).toJSON(),b.className,rect(b).toJSON()]),buttons:[...document.querySelectorAll('.parent-session-controls button,.stage-parent-title[data-parent-unlocked=true]')].map(e=>({text:e.textContent,width:rect(e).width,height:rect(e).height}))}})()`);
    assert.equal(m.overlap.length,0,JSON.stringify(m));assert(m.buttons.every(b=>b.width>=44&&b.height>=44));pass(`controls-${shot}-${width}x${height}`,m);
  }
  assert.deepEqual(currentErrors,[]);
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
      if (url.startsWith(base) && !new URL(url).pathname.endsWith('/favicon.ico') && status >= 400) currentNetworkFailures.push({ url, status })
    }
  })
  await Promise.all([command('Page.enable'), command('Runtime.enable'), command('Network.enable')])
  await command('Emulation.setDeviceMetricsOverride', { width: 834, height: 1194, deviceScaleFactor: 1, mobile: false })
  // This runner uses its own browser profile.
  await runChecks()
} catch (error) {
  report.failures.push({name:'parent-layout',error:error.stack,errors:currentErrors,networkFailures:currentNetworkFailures})
  await screenshot('failure').catch(()=>{})
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
