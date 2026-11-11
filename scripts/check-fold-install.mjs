// Run against Vite: node scripts/check-fold-install.mjs [http://localhost:5174]
// Activates shipped standalone CSS with simulated 24px insets; not real device evidence.
// Uses a private headless Chrome process, never the user's browser/profile.
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const base = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '')
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const work = await mkdtemp(join(tmpdir(), 'phonics-review-'))
const profile = join(work, 'profile')
const output = process.env.FOLD_INSTALL_OUTPUT || join(work, 'results')
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
  await navigate('/index.html')
  await until(()=>evaluate(`!!document.querySelector('#app .screen')`),'game entry')
  const install=await evaluate(`(async()=>{
    const href=document.querySelector('link[rel="manifest"]')?.href;
    if(!href) throw new Error('Manifest link missing');
    const response=await fetch(href);if(!response.ok)throw new Error('Manifest unavailable');
    const manifest=await response.json();
    const icons=await Promise.all(manifest.icons.map(async icon=>{const image=new Image();image.src=new URL(icon.src,href).href;await image.decode();return {sizes:icon.sizes,width:image.naturalWidth,height:image.naturalHeight}}));
    return {href,manifest,icons,viewport:document.querySelector('meta[name="viewport"]')?.content,start:new URL(manifest.start_url,href).href,scope:new URL(manifest.scope,href).href};
  })()`)
  assert.equal(install.manifest.display,'standalone');assert.equal(install.manifest.orientation,'any');
  assert(install.viewport.includes('viewport-fit=cover'));
  assert(install.start.startsWith(install.scope));assert.equal(install.scope,base+'/');
  assert(install.icons.some(i=>i.width>=512&&i.height>=512));
  for(const icon of install.icons)assert(icon.sizes.split(' ').includes(`${icon.width}x${icon.height}`));
  pass('standalone-manifest-start-scope-orientation-icons',install);
  await navigate('/review.html');
  await until(()=>evaluate(`!!document.querySelector('.review-catalog')`),'review catalog');
  await evaluate(`(()=>{
    const rule=[...document.styleSheets].flatMap(s=>[...s.cssRules]).find(r=>r.media?.mediaText==='(display-mode: standalone)');
    if(!rule)throw new Error('Standalone CSS rule missing');rule.media.mediaText='all';
    document.documentElement.style.setProperty('--safe-top','24px');document.documentElement.style.setProperty('--safe-bottom','24px');
  })()`);
  for(const [width,height] of [[691,829],[829,691],[604,725],[725,604]]) {
    await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false});
    for(let index=0;index<33;index++) {
      await evaluate(`(()=>{const s=document.querySelector('#review-chapter');s.value='${index}';s.dispatchEvent(new Event('change',{bubbles:true}))})()`);
      await sleep(20);
      const m=await evaluate(`(()=>{
        const root=document.querySelector('.review-catalog');
        const nodes=[...root.querySelectorAll('.review-header,.review-notice,.review-chapter-nav,.review-chapter-summary,.review-stage,.review-stage-title,.review-stage-names,.review-stage-art,.review-stage-play')];
        const spill=nodes.filter(el=>{const r=el.getBoundingClientRect();return r.left<0||r.right>innerWidth+1||r.top<0||r.bottom>innerHeight-24+1||el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1}).map(el=>({class:el.className,text:el.textContent,rect:el.getBoundingClientRect().toJSON(),scroll:[el.scrollWidth,el.scrollHeight],client:[el.clientWidth,el.clientHeight]}));
        return {scroll:[Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth,Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)-innerHeight],spill,cards:[...root.querySelectorAll('[data-review-stage]')].map(e=>({disabled:e.disabled,height:e.getBoundingClientRect().height})),padding:getComputedStyle(root).paddingTop};
      })()`);
      assert(m.scroll.every(n=>n<=1)&&m.spill.length===0,`Chapter${index+1} ${width}x${height}: ${JSON.stringify(m)}`);
      assert.equal(m.cards.length,5);assert(m.cards.every(c=>!c.disabled&&c.height>=44));assert.equal(m.padding,'40px');
    }
    await screenshot(`catalog-${width}x${height}`);
    pass(`catalog-${width}x${height}`,{chapters:33,cards:165,safeTop:24,safeBottom:24});
  }
  assert.deepEqual(currentErrors,[]);assert.deepEqual(currentNetworkFailures,[]);
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
  // Review UI assertions are below; this runner uses its own browser profile.
  await runChecks()
} catch (error) {
  report.failures.push({name:'review-page',error:error.stack,errors:currentErrors,networkFailures:currentNetworkFailures})
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
