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
  const url = base + path
  await command('Page.navigate', { url })
  await until(async () => {
    try { return await evaluate(`location.href === ${JSON.stringify(url)} && document.readyState !== 'loading'`) }
    catch { return false }
  }, `new document ${path}`)
  await until(async()=>{try{return await evaluate('document.fonts.ready.then(() => true)')}catch{return false}},'new document fonts')
  await sleep(150)
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
  const saved = JSON.stringify({clearedStages:['stage-1'],stars:{'stage-1':3},checkpoint:null,lockedStages:[]})
  await evaluate(`localStorage.setItem('carbot-phonics-progress-v1',${JSON.stringify(saved)}); localStorage.removeItem('phonics-hero-parent-pin-v1');sessionStorage.clear();sessionStorage.setItem('phonics-hero-parent-access-v1','1')`)
  await navigate('/?parent-pin-check=1')
  await until(() => evaluate(`!!document.querySelector('.parent-hold-target')`), 'parent target')
  const point = async selector => evaluate(`(()=>{const r=document.querySelector(${JSON.stringify(selector)}).getBoundingClientRect();return{x:r.x+r.width/2,y:r.y+r.height/2}})()`)
  const input = async(type,p,touch=false)=> touch
    ? command('Input.dispatchTouchEvent',{type:({down:'touchStart',move:'touchMove',up:'touchEnd'})[type],touchPoints:type==='up'?[]:[{...p,id:1,radiusX:5,radiusY:5,force:1}]})
    : command('Input.dispatchMouseEvent',{type:({down:'mousePressed',move:'mouseMoved',up:'mouseReleased'})[type],...p,button:'left',buttons:type==='up'?0:1,clickCount:1})
  const tap = async(selector,touch=false)=>{const p=await point(selector);await input('down',p,touch);await input('up',p,touch)}
  const taps = async(n=7,touch=false,gap=0)=>{for(let i=0;i<n;i++){await tap('.parent-hold-target',touch);if(gap&&i<n-1)await sleep(gap)}}
  const modal=()=>evaluate(`!!document.querySelector('#parent-pin-dialog')`)
  const enabled=()=>evaluate(`document.querySelector('.parent-hold-target')?.dataset.parentUnlocked==='true'`)
  const pin=async(value,touch=false)=>{for(const d of value)await tap('[data-pin-digit="'+d+'"]',touch);await tap('#parent-pin-confirm',touch)}
  const enter=async(value='0000',touch=false)=>{await taps(7,touch);assert(await modal(),'seven taps opens keypad');await pin(value,touch);assert(await enabled(),'PIN enables parent mode')}
  const exit=async(touch=false)=>{if(await evaluate(`!!document.querySelector('#parent-mode-exit')`))await tap('#parent-mode-exit',touch);else{await tap('.stage-parent-title',touch);await tap('#parent-dialog-exit',touch)}assert.equal(await enabled(),false)}
  const change=async()=>{if(await evaluate(`!!document.querySelector('#parent-pin-change')`))await tap('#parent-pin-change');else{await tap('.stage-parent-title');await tap('#parent-dialog-change')}}
  const unchanged=async()=>assert.equal(await evaluate(`localStorage.getItem('carbot-phonics-progress-v1')`),saved)
  const pass=name=>{report.cases.push({name,passed:true});console.log('PASS '+name)}
  assert.equal(await enabled(),false);pass('legacy-unprotected-session-invalidated')
  await taps(6);assert.equal(await modal(),false);await taps(1);assert(await modal());assert.equal(await enabled(),false);await unchanged()
  await pin('1111');assert.equal(await enabled(),false);assert(await modal());assert(await evaluate(`!!document.querySelector('#parent-pin-error').textContent.trim()`));await pin('0000');assert(await enabled());await unchanged();pass('six-taps-hidden-seven-fast-taps-pin-gate-wrong-and-default-pin')
  await exit();await taps(7,false,1800);assert(await modal());await tap('#parent-pin-cancel');assert.equal(await modal(),false);assert.equal(await enabled(),false);pass('relaxed-seven-taps-and-cancel')
  await taps();await command('Input.dispatchKeyEvent',{type:'keyDown',key:'Tab',code:'Tab',modifiers:8});assert(await evaluate(`document.activeElement.id==='parent-pin-cancel'`),'focus wraps inside keypad');await command('Input.dispatchKeyEvent',{type:'keyDown',key:'Escape',code:'Escape'});assert.equal(await modal(),false);assert.equal(await enabled(),false);
  await taps();for(let i=0;i<4;i++)await command('Input.dispatchKeyEvent',{type:'keyDown',key:'0',code:'Digit0'});assert(await evaluate(`!document.querySelector('#parent-pin-digits').textContent.includes('0')`),'PIN digits masked');await command('Input.dispatchKeyEvent',{type:'keyDown',key:'Enter',code:'Enter'});assert(await enabled());await exit();pass('keyboard-masked-digits-enter-escape-focus-trap')
  await taps(6);await sleep(2700);await taps(1);assert.equal(await modal(),false);await taps(6);assert(await modal());await tap('#parent-pin-cancel');pass('gap-timeout-resets-without-losing-next-first-tap')
  await enter();await change();await pin('1234');assert(await modal());await pin('5678');assert(await modal());assert(await evaluate(`!!document.querySelector('#parent-pin-error').textContent.trim()`));await pin('1234');await pin('1234');assert(await evaluate(`document.querySelector('#parent-pin-error').textContent.includes('변경')`));await tap('#parent-pin-cancel');assert.equal(await modal(),false);await unchanged();pass('change-pin-repeat-mismatch-then-confirm')
  await exit();await navigate('/?pin-reload=1');await until(()=>evaluate(`!!document.querySelector('.parent-hold-target')`),'reload title');await taps();await pin('0000');assert.equal(await enabled(),false);await pin('1234');assert(await enabled());pass('changed-pin-persists-old-pin-rejected')
  await change();await pin('5678');await evaluate(`window.parentOriginalSetItem=Storage.prototype.setItem;Storage.prototype.setItem=function(k,v){if(k==='phonics-hero-parent-pin-v1')throw new Error('test quota');return window.parentOriginalSetItem.call(this,k,v)}`);await pin('5678');assert(await modal());assert(await evaluate(`!!document.querySelector('#parent-pin-error').textContent.trim()`));await evaluate(`Storage.prototype.setItem=window.parentOriginalSetItem`);await tap('#parent-pin-cancel');await exit();await enter('1234');pass('pin-storage-failure-keeps-old-pin-and-shows-error')
  await change();await pin('0000');await pin('0000');await tap('#parent-pin-cancel');assert.equal(await modal(),false)
  await navigate('/?parent-check=reload');await until(enabled,'reload retains authenticated session');await unchanged()
  await evaluate(`document.querySelectorAll('.chapter-card[data-world]')[4].click()`)
  await until(()=>evaluate(`document.querySelectorAll('.chapter-card[data-chapter]').length===5`),'world five chapters')
  assert.equal(await evaluate(`document.querySelectorAll('.chapter-card.locked').length`),0)
  await evaluate(`document.querySelectorAll('.chapter-card[data-chapter]')[4].click()`)
  await until(()=>evaluate(`document.querySelectorAll('.stage-node[data-stage]').length===5`),'five stages');assert.equal(await evaluate(`document.querySelectorAll('.stage-node.locked').length`),0);await unchanged();pass('all-hierarchy-access-without-clears')
  await evaluate(`document.querySelectorAll('.stage-node[data-stage]')[0].click()`)
  await until(()=>evaluate(`!!document.querySelector('.stage-parent-title.parent-hold-target')`),'play title')
  await evaluate(`window.parentBeatBefore=document.querySelector('#beat-area').firstElementChild;window.parentHpBefore=document.querySelector('#health-fill').style.width;window.parentProgressBefore=localStorage.getItem('carbot-phonics-progress-v1')`)
  await exit();await enter();await change();await tap('#parent-pin-cancel');await exit()
  assert(await evaluate(`window.parentBeatBefore.isConnected&&window.parentHpBefore===document.querySelector('#health-fill').style.width&&window.parentProgressBefore===localStorage.getItem('carbot-phonics-progress-v1')`));pass('play-pin-entry-change-cancel-exit-preserves-beat-hp-checkpoint')
  await evaluate(`document.querySelector('#exit-stage').click()`);await until(()=>evaluate(`document.querySelectorAll('.chapter-card[data-world]').length===5`),'locked parent world exit');assert.equal(await evaluate(`document.querySelectorAll('.chapter-card.locked').length`),4);await unchanged()
  await command('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5})
  for(const[name,width,height]of[['ipad-p',834,1194],['ipad-l',1194,834],['fold-p',604,725],['fold-l',725,604]]){
    await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});await sleep(100);await navigate('/?touch='+name);await until(()=>evaluate(`!!document.querySelector('.parent-hold-target')`),'touch title')
    await enter('0000',true);await exit(true)
    await evaluate(`document.querySelector('[data-world]').click()`);await enter('0000',true);await exit(true)
    await evaluate(`document.querySelector('[data-chapter]').click()`);await enter('0000',true);await exit(true)
    await evaluate(`document.querySelector('[data-stage]').click()`);await until(()=>evaluate(`!!document.querySelector('.stage-parent-title')`),'touch play title');await enter('0000',true);await exit(true)
    pass('trusted-touch-seven-taps-pin-four-titles-'+name)
  }
  const beforeReview=await evaluate(`localStorage.getItem('carbot-phonics-progress-v1')`)
  await navigate('/review.html');await until(()=>evaluate(`document.querySelectorAll('.review-stage').length===5`),'review catalog');assert.equal(await evaluate(`document.querySelectorAll('.parent-hold-target,#parent-pin-dialog,#parent-pin-change,#parent-mode-exit').length`),0);assert.equal(await evaluate(`localStorage.getItem('carbot-phonics-progress-v1')`),beforeReview);pass('review-command-and-pin-isolated')
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
