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
  await evaluate(`localStorage.setItem('carbot-phonics-progress-v1',${JSON.stringify(saved)}); sessionStorage.clear()`)
  await navigate('/?parent-check=1')
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
  const enabled = () => evaluate(`document.querySelector('.parent-hold-target')?.dataset.parentUnlocked==='true'`)
  const unchanged = async () => assert.equal(await evaluate(`localStorage.getItem('carbot-phonics-progress-v1')`),saved)
  let p=await points('.parent-hold-target'); await input('down',p.left); await trip(p,4); assert.equal(await enabled(),false); await input('up',p.left);
  await input('down',p.left);await trip(p,1);assert.equal(await enabled(),false);await input('up',p.left);
  await input('down',{x:(p.left.x+p.right.x)/2,y:p.left.y});await trip(p);assert.equal(await enabled(),false);await input('up',p.left);
  await sweep('.parent-hold-target');assert.equal(await enabled(),true);
  assert.equal(await evaluate(`document.querySelectorAll('.chapter-card.locked').length`),0); await unchanged()
  report.cases.push({name:'trusted-mouse-five-roundtrips-world-and-release-reset',passed:true})
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
  await sweep('.stage-parent-title');assert.equal(await enabled(),false)
  assert(await evaluate(`window.parentBeatBefore.isConnected && window.parentHpBefore===document.querySelector('#health-fill').style.width && window.parentProgressBefore===localStorage.getItem('carbot-phonics-progress-v1')`))
  report.cases.push({name:'trusted-pointer-play-relock-preserves-beat-hp-checkpoint',passed:true})
  await evaluate(`document.querySelector('#exit-stage').click()`)
  await until(() => evaluate(`document.querySelectorAll('.chapter-card[data-world]').length===5`),'locked parent world exit')
  assert.equal(await evaluate(`document.querySelectorAll('.chapter-card.locked').length`),4); await unchanged()
  report.cases.push({name:'relock-restores-earned-progress',passed:true})
  await command('Emulation.setTouchEmulationEnabled',{enabled:true,maxTouchPoints:5})
  for(const [name,width,height]of [['ipad-p',834,1194],['ipad-l',1194,834],['fold-p',691,829],['fold-l',829,691]]){
    await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:true});await sleep(100);
    await navigate('/?touch='+name);await until(()=>evaluate(`!!document.querySelector('.parent-hold-target')`),'touch title');
    await sweep('.parent-hold-target',true);assert.equal(await enabled(),true,name+' world');
    await evaluate(`document.querySelector('[data-world]').click()`);await sweep('.parent-hold-target',true);assert.equal(await enabled(),false,name+' chapter');await sweep('.parent-hold-target',true);
    await evaluate(`document.querySelector('[data-chapter]').click()`);await sweep('.parent-hold-target',true);assert.equal(await enabled(),false,name+' map');await sweep('.parent-hold-target',true);
    await evaluate(`document.querySelector('[data-stage]').click()`);await until(()=>evaluate(`!!document.querySelector('.stage-parent-title')`),'touch play title');await sweep('.stage-parent-title',true);assert.equal(await enabled(),false,name+' play');
    report.cases.push({name:'trusted-touch-four-titles-'+name,passed:true});
  }
  const beforeReview=await evaluate(`localStorage.getItem('carbot-phonics-progress-v1')`);
  await navigate('/review.html'); await until(() => evaluate(`document.querySelectorAll('.review-stage').length===5`),'review catalog')
  assert.equal(await evaluate(`document.querySelectorAll('.parent-hold-target').length`),0); assert.equal(await evaluate(`localStorage.getItem('carbot-phonics-progress-v1')`),beforeReview)
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
