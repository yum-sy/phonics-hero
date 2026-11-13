// Run against Vite or built preview: node scripts/check-parent-progress-browser.mjs [http://localhost:5174]
// Uses a private headless Chrome process, never the user's browser/profile.
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const base = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '')
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const work = await mkdtemp(join(tmpdir(), 'phonics-parent-progress-'))
const profile = join(work, 'profile')
const output = process.env.PARENT_PROGRESS_OUTPUT || join(work, 'results')
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
  await command('Emulation.setDeviceMetricsOverride', { width: 1194, height: 834, deviceScaleFactor: 1, mobile: false })
  await navigate('/')
  await until(() => evaluate(`!!document.querySelector('.map-header')`), 'world title')
  const saved = JSON.stringify({clearedStages:[],stars:{},checkpoint:null})
  await evaluate(`localStorage.setItem('carbot-phonics-progress-v1',${JSON.stringify(saved)}); sessionStorage.clear()`)
  await navigate('/?parent-progress-check=1')
  await until(() => evaluate(`!!document.querySelector('.parent-hold-target')`), 'parent target')
  const points = async selector => evaluate(`(()=>{
    const el=document.querySelector(${JSON.stringify(selector)}), walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT), rects=[];
    while(walker.nextNode()){const n=walker.currentNode;for(let i=0;i<n.length;i++){if(!/[A-Za-z0-9가-힣]/.test(n.data[i]))continue;const r=document.createRange();r.setStart(n,i);r.setEnd(n,i+1);rects.push(r.getBoundingClientRect())}}
    const b=el.getBoundingClientRect(),first=rects[0],last=rects.at(-1);
    return {left:{x:Math.max(b.left,first.left)+2,y:Math.max(b.top,first.top)+Math.min(b.bottom-first.top,first.height)/2},right:{x:Math.min(b.right,last.right)-2,y:Math.max(b.top,first.top)+Math.min(b.bottom-first.top,first.height)/2}};
  })()`)
  const input = async(type,p,touch=false)=> touch
    ? command('Input.dispatchTouchEvent',{type:({down:'touchStart',move:'touchMove',up:'touchEnd'})[type],touchPoints:type==='up'?[]:[{...p,id:1,radiusX:5,radiusY:5,force:1}]})
    : command('Input.dispatchMouseEvent',{type:({down:'mousePressed',move:'mouseMoved',up:'mouseReleased'})[type],...p,button:'left',buttons:type==='up'?0:1,clickCount:1})
  const trip = async(p,n=5,touch=false)=>{for(let i=0;i<n;i++){await input('move',p.right,touch);await input('move',p.left,touch)}}
  const sweep = async(selector,touch=false)=>{const p=await points(selector);await input('down',p.left,touch);await trip(p,5,touch);await input('up',p.left,touch)}
  const click = async selector => { await evaluate(`document.querySelector(${JSON.stringify(selector)}).click()`); await sleep(150) }
  const progress = () => evaluate(`JSON.parse(localStorage.getItem('carbot-phonics-progress-v1'))`)
  const check = (name, passed) => { assert(passed,name); report.cases.push({name,passed:true}); console.log('PASS '+name) }
  await sweep('.parent-hold-target')
  check('five-roundtrips-open-five-world-edit-controls',await evaluate(`document.querySelectorAll('[data-parent-scope="world"]').length===5 && !document.querySelector('button button')`))
  const worldId=await evaluate(`document.querySelectorAll('[data-world]')[4].dataset.world`)
  await click(`[data-parent-scope="world"][data-parent-id="${worldId}"]`)
  check('world-control-completes25-without-navigation',(await progress()).clearedStages.length===25 && await evaluate(`document.querySelectorAll('[data-world]').length===5`))
  await screenshot('world-completed-landscape')
  await navigate('/?parent-progress-check=reload'); await until(()=>evaluate(`document.querySelectorAll('[data-parent-scope="world"]').length===5`),'reload edit controls')
  check('world-restoration-survives-reload',(await progress()).clearedStages.length===25)
  await click(`[data-world="${worldId}"]`)
  const chapterId=await evaluate(`document.querySelectorAll('[data-chapter]')[4].dataset.chapter`)
  await click(`[data-parent-scope="chapter"][data-parent-id="${chapterId}"]`)
  check('chapter-relock-only-five',(await progress()).clearedStages.length===20 && (await progress()).lockedStages.length===5)
  await click('#parent-progress-undo')
  check('undo-restores-exact-subtree',(await progress()).clearedStages.length===25 && (await progress()).lockedStages.length===0)
  await click(`[data-chapter="${chapterId}"]`)
  const stageId=await evaluate(`document.querySelectorAll('[data-stage]')[2].dataset.stage`)
  await click(`[data-parent-scope="stage"][data-parent-id="${stageId}"]`)
  check('stage-relock-does-not-start-game',!(await progress()).clearedStages.includes(stageId) && await evaluate(`document.querySelectorAll('[data-stage]').length===5 && !document.querySelector('#beat-area')`))
  await screenshot('stage-partial-landscape')
  await click('#back-to-chapters')
  check('partial-chapter-has-direct-relock',await evaluate(`!!document.querySelector('.parent-progress-relock[data-parent-id="${chapterId}"]')`))
  await click(`.parent-progress-relock[data-parent-id="${chapterId}"]`)
  check('partial-chapter-relocks-directly',(await progress()).lockedStages.length===5)
  await click('#parent-progress-undo')
  await click(`[data-chapter="${chapterId}"]`)
  await sweep('.parent-hold-target')
  const nextStageId=await evaluate(`document.querySelectorAll('[data-stage]')[3].dataset.stage`)
  // Relock = "not cleared": the relocked stage (its predecessor is cleared)
  // stays playable; the stage after it is what becomes locked.
  check('off-keeps-relocked-stage-playable-and-locks-its-successor',await evaluate(`!document.querySelector('[data-stage="${stageId}"]').disabled && document.querySelector('[data-stage="${nextStageId}"]').disabled && !document.querySelector('[data-parent-scope]')`))
  await navigate('/?parent-progress-check=child-reload'); await until(()=>evaluate(`document.querySelectorAll('[data-world]').length===5`),'child reload world')
  check('saved-world-remains-accessible-outside-parent',await evaluate(`!document.querySelector('[data-world="${worldId}"]').disabled && !document.querySelector('[data-parent-scope]')`))
  await click(`[data-world="${worldId}"]`); await click(`[data-chapter="${chapterId}"]`)
  check('relock-survives-reload-as-uncleared',await evaluate(`!document.querySelector('[data-stage="${stageId}"]').disabled && !document.querySelector('[data-stage="${stageId}"]').classList.contains('cleared') && document.querySelector('[data-stage="${nextStageId}"]').disabled`))
  const exact=await evaluate(`localStorage.getItem('carbot-phonics-progress-v1')`)
  await navigate('/review.html'); await until(()=>evaluate(`document.querySelectorAll('.review-stage').length===5`),'review catalog')
  check('review-has-no-progress-editor',await evaluate(`!document.querySelector('[data-parent-scope]') && !document.querySelector('#parent-progress-undo')`))
  check('review-keeps-real-progress',await evaluate(`localStorage.getItem('carbot-phonics-progress-v1')`)===exact)
  assert.deepEqual(currentErrors,[])
  assert.deepEqual(currentNetworkFailures,[])
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
