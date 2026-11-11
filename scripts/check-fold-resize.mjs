// Rotation preserves the live beat, partial answers and canvas ink.
// Run against Vite: node scripts/check-fold-resize.mjs [http://localhost:5174]
// FOLD_RESIZE_OUTPUT retains evidence. Desktop emulation is not a Fold4 device test.
// Uses a private headless Chrome process, never the user's browser/profile.
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const base = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '')
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const work = await mkdtemp(join(tmpdir(), 'phonics-fold-resize-'))
const profile = join(work, 'profile')
const output = process.env.FOLD_RESIZE_OUTPUT || join(work, 'results')
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
  await command('Page.addScriptToEvaluateOnNewDocument', {source: `
    localStorage.clear(); sessionStorage.clear();
    window.audioStarts = 0;
    const originalStart = AudioBufferSourceNode.prototype.start;
    AudioBufferSourceNode.prototype.start = function(...args) { window.audioStarts++; return originalStart.apply(this,args); };
  `});
  const check = (name, condition, detail = {}) => { assert(condition, name); report.cases.push({name,passed:true,...detail}); console.log('PASS '+name) };
  const dimensions = [[691,829],[829,691],[691,829]];
  async function resize(width,height) {
    await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:2,mobile:false});
    await sleep(500);
  }
  async function fixture(query, selector) {
    await resize(...dimensions[0]);
    await navigate('/_probe.html?'+query+'&unlock=1&delay=1200&css='+encodeURIComponent(':root{--safe-top:24px;--safe-bottom:24px;--screen-inset-top:24px}'));
    await until(()=>evaluate(`!!document.querySelector(${JSON.stringify(selector)})`),selector);
    await until(()=>evaluate(`document.documentElement.getAttribute('data-probe')`),'initial HUD');
    await evaluate(`window.savedNode = document.querySelector(${JSON.stringify(selector)}); window.savedCheckpoint = JSON.stringify(Object.entries(localStorage).sort());`);
  }
  async function fitCheck(name) {
    const bounds = await evaluate(`(() => {
      const s=document.querySelector('#app > .screen');
      const r=s.getBoundingClientRect();
      return {width:innerWidth,height:innerHeight,scrollX:Math.max(document.documentElement.scrollWidth,document.body.scrollWidth)-innerWidth,
        scrollY:Math.max(document.documentElement.scrollHeight,document.body.scrollHeight)-innerHeight,
        screenOverflowY:s.scrollHeight-s.clientHeight,screenOverflowX:s.scrollWidth-s.clientWidth,
        controls:[...s.querySelectorAll('button')].filter(b=>b.getClientRects().length).map(b=>{const r=b.getBoundingClientRect();return {top:r.top,bottom:r.bottom,left:r.left,right:r.right}})};
    })()`);
    check(name+'-fits',bounds.scrollX<=1 && bounds.scrollY<=1 && bounds.screenOverflowX<=1 && bounds.screenOverflowY<=1 && bounds.controls.every(r=>r.top>=0 && r.bottom<=bounds.height+1 && r.left>=0 && r.right<=bounds.width+1),bounds);
    await screenshot(name);
  }
  await fixture('iso=stage-2:break','#trace-canvas');
  const rect = await evaluate(`(() => {const r=window.savedNode.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height}})()`);
  await command('Input.dispatchMouseEvent',{type:'mousePressed',x:rect.x+rect.w*.3,y:rect.y+rect.h*.4,button:'left',buttons:1,clickCount:1});
  await command('Input.dispatchMouseEvent',{type:'mouseMoved',x:rect.x+rect.w*.5,y:rect.y+rect.h*.6,button:'left',buttons:1});
  await command('Input.dispatchMouseEvent',{type:'mouseReleased',x:rect.x+rect.w*.5,y:rect.y+rect.h*.6,button:'left',buttons:0,clickCount:1});
  await sleep(7000);
  const audioBefore = await evaluate('window.audioStarts');
  for (let i=0;i<dimensions.length;i++) {
    await resize(...dimensions[i]);
    const ink=await evaluate(`(() => {const c=document.querySelector('#trace-canvas'), r=c.getBoundingClientRect(),ctx=c.getContext('2d'),data=ctx.getImageData(0,0,c.width,c.height).data;let count=0,x=0,y=0;for(let p=3;p<data.length;p+=4){if(data[p]>64){const n=(p-3)/4;count++;x+=n%c.width;y+=Math.floor(n/c.width)}}return {same:c===window.savedNode,count,x:x/count/c.width,y:y/count/c.height,width:c.width,height:c.height,wantWidth:Math.round(r.width*devicePixelRatio),wantHeight:Math.round(r.height*devicePixelRatio),checkpoint:JSON.stringify(Object.entries(localStorage).sort())===window.savedCheckpoint,audio:window.audioStarts}})()`);
    check('trace-'+i+'-retains-ink-and-state',ink.same && ink.count>20 && Math.abs(ink.x-.4)<.1 && Math.abs(ink.y-.5)<.1 && ink.width===ink.wantWidth && ink.height===ink.wantHeight && ink.checkpoint && ink.audio===audioBefore,ink);
    await fitCheck('trace-'+i);
  }
  // Coordinate mapping must still match the resized bitmap, not its original box.
  await evaluate(`document.querySelector('#trace-clear-btn').click()`);
  const empty=await evaluate(`!document.querySelector('#trace-canvas').getContext('2d').getImageData(0,0,window.savedNode.width,window.savedNode.height).data.some((v,i)=>i%4===3&&v)`);
  check('trace-clear-after-rotation',empty);
  const movedRect = await evaluate(`(() => {const r=window.savedNode.getBoundingClientRect();return {x:r.left,y:r.top,w:r.width,h:r.height}})()`);
  await command('Input.dispatchMouseEvent',{type:'mousePressed',x:movedRect.x+movedRect.w*.7,y:movedRect.y+movedRect.h*.3,button:'left',buttons:1,clickCount:1});
  await command('Input.dispatchMouseEvent',{type:'mouseReleased',x:movedRect.x+movedRect.w*.7,y:movedRect.y+movedRect.h*.3,button:'left',buttons:0,clickCount:1});
  check('trace-new-stroke-maps-after-rotation',await evaluate(`(() => {const c=window.savedNode;return c.getContext('2d').getImageData(Math.round(c.width*.7),Math.round(c.height*.3),1,1).data[3]>0})()`));
  await fixture('shot=build7','.build-slots');
  await evaluate(`document.querySelector('.letter-tile').click(); window.savedSlots=document.querySelector('.build-slots').textContent;`);
  for(let i=0;i<dimensions.length;i++) {
    await resize(...dimensions[i]);
    check('build-'+i+'-retains-answer',await evaluate(`document.querySelector('.build-slots')===window.savedNode && document.querySelector('.build-slots').textContent===window.savedSlots && document.querySelector('.letter-tile.used')!==null`));
    await fitCheck('build-'+i);
  }
  await fixture('shot=reward33','.recap-line');
  await sleep(500);
  for(let i=0;i<dimensions.length;i++) {
    await resize(...dimensions[i]);
    check('reward-'+i+'-same-dom-and-progress',await evaluate(`document.querySelector('.recap-line')===window.savedNode && JSON.stringify(Object.entries(localStorage).sort())===window.savedCheckpoint`));
    await fitCheck('reward-'+i);
  }
  check('console-clean',currentErrors.length===0,{errors:currentErrors});

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
