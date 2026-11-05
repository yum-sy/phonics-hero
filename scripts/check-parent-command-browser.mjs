// Run against Vite: node scripts/check-character-assets.mjs [http://localhost:5174]
// Uses a private headless Chrome process, never the user's browser/profile.
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const base = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '')
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const work = await mkdtemp(join(tmpdir(), 'phonics-parent-check-'))
const profile = join(work, 'profile')
const output = process.env.PARENT_CHECK_OUTPUT || join(work, 'results')
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
const report = { base, generatedAt: new Date().toISOString(), gallery: null, cases: [], failures: [] }

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

const decodedImages = `(async () => {
  const urls = [...new Set([...document.querySelectorAll('.character-asset image')].map(el => new URL(el.getAttribute('href'), location.href).href))];
  return await Promise.all(urls.map(async url => {
    const image = new Image(); image.src = url;
    try { await image.decode(); return {url, width:image.naturalWidth, height:image.naturalHeight}; }
    catch { return {url, error:'decode failed'}; }
  }));
})()`

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
  await command('Emulation.setDeviceMetricsOverride', { width: 1194, height: 834, deviceScaleFactor: 1, mobile: false })
  await navigate('/')
  await until(() => evaluate(`!!document.querySelector('.map-header')`), 'world title')
  const saved = JSON.stringify({clearedStages:['stage-1'],stars:{'stage-1':3},checkpoint:null})
  await evaluate(`localStorage.setItem('carbot-phonics-progress-v1',${JSON.stringify(saved)}); sessionStorage.clear()`)
  await navigate('/?parent-check=1')
  await until(() => evaluate(`!!document.querySelector('.parent-hold-target')`), 'parent target')
  const point = async selector => evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`)
  const press = async selector => { const p=await point(selector); await command('Input.dispatchMouseEvent',{type:'mousePressed',...p,button:'left',buttons:1,clickCount:1}); return p }
  const release = p => command('Input.dispatchMouseEvent',{type:'mouseReleased',...p,button:'left',buttons:0,clickCount:1})
  const enabled = () => evaluate(`document.querySelector('.parent-hold-target')?.dataset.parentUnlocked==='true'`)
  const unchanged = async () => assert.equal(await evaluate(`localStorage.getItem('carbot-phonics-progress-v1')`),saved)
  let p=await press('.parent-hold-target'); await sleep(600); await release(p); assert.equal(await enabled(),false); await unchanged()
  p=await press('.parent-hold-target'); await sleep(10500); assert.equal(await enabled(),false); await sleep(800); assert.equal(await enabled(),true)
  await sleep(1000); assert.equal(await enabled(),true); await release(p)
  assert.equal(await evaluate(`document.querySelectorAll('.chapter-card.locked').length`),0); await unchanged()
  report.cases.push({name:'trusted-pointer-11-second-unlock',passed:true,elapsedBeforeCheckMs:11300})
  await navigate('/?parent-check=reload'); await until(enabled,'reload retains session unlock'); await unchanged()
  await evaluate(`document.querySelectorAll('.chapter-card[data-world]')[4].click()`)
  await until(() => evaluate(`document.querySelectorAll('.chapter-card[data-chapter]').length===5`),'world five chapters')
  assert.equal(await evaluate(`document.querySelectorAll('.chapter-card.locked').length`),0)
  await evaluate(`document.querySelectorAll('.chapter-card[data-chapter]')[4].click()`)
  await until(() => evaluate(`document.querySelectorAll('.stage-node[data-stage]').length===5`),'all five stages')
  assert.equal(await evaluate(`document.querySelectorAll('.stage-node.locked').length`),0); await unchanged()
  report.cases.push({name:'all-hierarchy-access-without-clears',passed:true})
  await evaluate(`document.querySelectorAll('.stage-node[data-stage]')[0].click()`)
  await until(() => evaluate(`!!document.querySelector('.stage-parent-title.parent-hold-target')`),'play title')
  await evaluate(`window.parentBeatBefore=document.querySelector('#beat-area').firstElementChild;window.parentHpBefore=document.querySelector('#health-fill').style.width;window.parentProgressBefore=localStorage.getItem('carbot-phonics-progress-v1')`)
  await screenshot('play-parent-on-landscape')
  p=await press('.stage-parent-title'); await sleep(11300); assert.equal(await enabled(),false); await release(p)
  assert(await evaluate(`window.parentBeatBefore.isConnected && window.parentHpBefore===document.querySelector('#health-fill').style.width && window.parentProgressBefore===localStorage.getItem('carbot-phonics-progress-v1')`))
  report.cases.push({name:'trusted-pointer-play-relock-preserves-beat-hp-checkpoint',passed:true})
  await evaluate(`document.querySelector('#exit-stage').click()`)
  await until(() => evaluate(`document.querySelectorAll('.chapter-card[data-world]').length===5`),'locked parent world exit')
  assert.equal(await evaluate(`document.querySelectorAll('.chapter-card.locked').length`),4); await unchanged()
  report.cases.push({name:'relock-restores-earned-progress',passed:true})
  await navigate('/review.html'); await until(() => evaluate(`document.querySelectorAll('.review-stage').length===5`),'review catalog')
  assert.equal(await evaluate(`document.querySelectorAll('.parent-hold-target').length`),0); await unchanged()
  report.cases.push({name:'review-command-isolated',passed:true})
  assert.deepEqual(currentErrors,[])
} catch (error) {
  report.failures.push({name:'setup-or-gallery',error:error.stack})
  console.error(error.stack)
} finally {
  await writeFile(join(output,'report.json'),JSON.stringify(report,null,2)+'\n')
  if (socket?.readyState===WebSocket.OPEN) await command('Browser.close').catch(()=>{})
  socket?.close()
  if(chrome.exitCode===null) chrome.kill('SIGTERM')
  await new Promise(resolve=>{if(chrome.exitCode!==null)resolve();else {chrome.once('exit',resolve);setTimeout(resolve,3000)}})
  await rm(profile,{recursive:true,force:true,maxRetries:3}).catch(()=>{})
  console.log(`Evidence: ${output}`)
  console.log(`${report.cases.filter(c=>c.passed).length}/${report.cases.length} screens passed; ${report.failures.length} failures`)
  if(report.failures.length)process.exitCode=1
}
