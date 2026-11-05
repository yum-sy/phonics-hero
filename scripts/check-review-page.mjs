// Run against Vite: node scripts/check-review-page.mjs [http://localhost:5174]
// REVIEW_CHECK_PRODUCTION=1 checks a built preview (pass its /phonics-hero base).
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
const output = process.env.REVIEW_CHECK_OUTPUT || join(work, 'results')
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


const production = process.env.REVIEW_CHECK_PRODUCTION === '1'
const storageKey = 'carbot-phonics-progress-v1'
const sentinel = JSON.stringify({clearedStages:['stage-1'],stars:{'stage-1':2},checkpoint:{stageId:'stage-2',beatIndex:1,hitsDealt:0},qaSentinel:'review-must-preserve-exact-bytes'})
function pass(name, detail = {}) { report.cases.push({name,passed:true,...detail}); console.log(`PASS ${name}`) }
async function storageUnchanged() {
  assert.equal(await evaluate(`localStorage.getItem(${JSON.stringify(storageKey)})`),sentinel,'Review changed normal progress')
}
async function tap(selector) {
  const box = await evaluate(`(()=>{const el=document.querySelector(${JSON.stringify(selector)});if(!el||el.disabled)throw new Error('Missing/enabled button: '+${JSON.stringify(selector)});const r=el.getBoundingClientRect();return {x:r.left+r.width/2,y:r.top+r.height/2}})()`)
  await command('Input.dispatchMouseEvent',{type:'mousePressed',button:'left',clickCount:1,...box})
  await command('Input.dispatchMouseEvent',{type:'mouseReleased',button:'left',clickCount:1,...box})
}
async function selectChapter(index) {
  await evaluate(`(()=>{const el=document.querySelector('#review-chapter');el.value=${JSON.stringify(String(index))};el.dispatchEvent(new Event('change',{bubbles:true}))})()`)
  await until(()=>evaluate(`document.querySelector('#review-chapter')?.value===${JSON.stringify(String(index))}`),'chapter selection')
}
async function layout() {
  return evaluate(`(()=>{
    const nodes=[...document.querySelectorAll('.review-catalog,.review-header,.review-chapter-nav,.review-stages,.review-stage,.review-stage-title,.review-stage-names')];
    const bounds=nodes.map(el=>{const r=el.getBoundingClientRect();return {tag:el.className,x:r.x,y:r.y,w:r.width,h:r.height}});
    const spill=bounds.filter(r=>r.x<-.5||r.y<-.5||r.x+r.w>innerWidth+.5||r.y+r.h>innerHeight+.5);
    const scroll={x:Math.max(document.body.scrollWidth,document.documentElement.scrollWidth)-innerWidth,y:Math.max(document.body.scrollHeight,document.documentElement.scrollHeight)-innerHeight};
    const clipped=nodes.filter(el=>el.classList.contains('review-stage')&&(el.scrollWidth>el.clientWidth+1||el.scrollHeight>el.clientHeight+1)).map(el=>el.dataset.reviewStage);
    const verdict=scroll.x<=1&&scroll.y<=1&&!spill.length&&!clipped.length;
    let hud=document.querySelector('#review-test-hud');if(!hud){hud=document.createElement('div');hud.id='review-test-hud';hud.style.cssText='position:fixed;bottom:0;left:0;z-index:99999;background:#111;color:#fff;font:10px monospace;pointer-events:none;padding:2px';document.body.append(hud)}
    hud.textContent=(verdict?'NOSCROLL':'FAIL')+' '+innerWidth+'×'+innerHeight+' scroll='+scroll.x+'/'+scroll.y+' SPILL='+spill.length+' CLIP='+clipped.length;
    return {verdict,scroll,spill,clipped};
  })()`)
}
async function checkErrors() {
  assert.deepEqual(currentErrors,[],'Browser errors')
  assert.deepEqual(currentNetworkFailures,[],'Failed same-origin responses')
}
async function runReviewChecks() {
  // Seed only the private browser profile, before review initializes its store.
  await navigate('/index.html')
  await evaluate(`localStorage.setItem(${JSON.stringify(storageKey)},${JSON.stringify(sentinel)})`)
  await navigate('/review.html')
  report.entryScripts = await evaluate(`[...document.scripts].map(el=>el.src).filter(Boolean)`)
  if (production) {
    assert(report.entryScripts.some(src=>new URL(src).pathname.startsWith(new URL(base).pathname+'/assets/review-')),'Preview did not serve the built review entry')
    assert(report.entryScripts.every(src=>!new URL(src).pathname.includes('/src/')),'Production loaded source modules')
  }
  await until(()=>evaluate(`!!document.querySelector('.review-catalog')`),'review catalog')
  assert.equal(await evaluate(`document.querySelectorAll('#review-chapter option').length`),33)
  await storageUnchanged()
  const imageUrls = new Set()
  for (const [width,height] of [[834,1194],[1194,834]]) {
    await command('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile:false})
    const stages = new Set()
    for (let index=0;index<33;index++) {
      await selectChapter(index)
      const cards=await evaluate(`[...document.querySelectorAll('[data-review-stage]')].map(el=>({id:el.dataset.reviewStage,enabled:!el.disabled,title:el.querySelector('.review-stage-title')?.textContent,images:[...el.querySelectorAll('image')].map(im=>im.getAttribute('href'))}))`)
      assert.equal(cards.length,5)
      cards.forEach(card=>{assert(card.enabled&&card.title);stages.add(card.id);card.images.forEach(url=>imageUrls.add(url))})
      const metrics=await layout()
      assert(metrics.verdict,`Catalog bounds chapter ${index+1} ${width}×${height}: ${JSON.stringify(metrics)}`)
    }
    assert.equal(stages.size,165)
    await evaluate(`document.documentElement.style.setProperty('--safe-top','24px');document.documentElement.style.setProperty('--safe-bottom','20px')`)
    for (const index of [0,32]) {
      await selectChapter(index)
      const safeMetrics=await layout()
      assert(safeMetrics.verdict,`Safe area chapter ${index+1}: ${JSON.stringify(safeMetrics)}`)
      pass(`catalog-safe-${index+1}-${width}x${height}`,{safeTop:24,safeBottom:20,...safeMetrics})
    }
    await screenshot(`catalog-safe-${width}x${height}`)
    await evaluate(`document.documentElement.style.removeProperty('--safe-top');document.documentElement.style.removeProperty('--safe-bottom')`)
    pass(`catalog-${width}x${height}`,{chapters:33,enabledStageCards:165})
    await screenshot(`catalog-last-${width}x${height}`)
    // Real trusted taps: first ordinary stage, middle chapter boss, last boss.
    for(const [chapterIndex,slot] of [[0,0],[16,4],[32,4]]) {
      await selectChapter(chapterIndex)
      const selected=await evaluate(`(()=>{const el=document.querySelectorAll('[data-review-stage]')[${slot}];return {id:el.dataset.reviewStage,names:el.querySelector('.review-stage-names').textContent}})()`)
      await tap(`[data-review-stage="${selected.id}"]`)
      await until(()=>evaluate(`!!document.querySelector('#health-fill')`),'real stage')
      const stage=await evaluate(`({health:document.querySelector('#health-fill').style.width,villain:document.querySelector('.nameplate-name').textContent,boss:!!document.querySelector('#boss-intro'),catalog:!!document.querySelector('.review-catalog')})`)
      assert.equal(stage.health,'100%');assert(selected.names.includes(stage.villain));assert(!stage.catalog)
      if(slot===4)assert(stage.boss,'Boss introduction missing')
      await screenshot(`stage-${selected.id}-${width}x${height}`)
      await tap('#exit-stage')
      await until(()=>evaluate(`!!document.querySelector('.review-catalog')`),'Exit returns to catalog')
      assert.equal(await evaluate(`document.querySelector('#review-chapter').value`),String(chapterIndex))
      assert.equal(await evaluate(`document.querySelector('.review-stage-selected')?.dataset.reviewStage`),selected.id)
      await storageUnchanged();await checkErrors()
      pass(`play-exit-${selected.id}-${width}x${height}`)
    }
  }
  // Decode actual production PNG URLs, including generated /phonics-hero base.
  const images=await evaluate(`Promise.all(${JSON.stringify([...imageUrls])}.map(async href=>{const image=new Image();image.src=href;await image.decode();return {url:image.src,width:image.naturalWidth,height:image.naturalHeight}}))`)
  assert.equal(images.length,14);images.forEach(im=>assert(im.width>500&&im.height>500))
  if(production)images.forEach(im=>assert(new URL(im.url).pathname.startsWith(new URL(base).pathname+'/art/')))
  pass('atlas-decode',{images})
  if(!production) {
    const mutation=await evaluate(`(async()=>{
      const src=await(await fetch('/src/review.js')).text();const m=src.match(/from\\s*['"]([^'"]*state\\.js[^'"]*)['"]/);
      const state=await import(m?new URL(m[1],location.origin+'/src/').href:'/src/state.js');
      if(!state.isReviewMode())throw new Error('Not the active review state instance');
      state.saveCheckpoint('c33s5',2,1);const checkpoint=JSON.stringify(state.progress.checkpoint);
      state.markStageCleared('c33s5',3);const cleared=state.progress.clearedStages.includes('c33s5');
      state.forceClearStage('c17-stage-5');state.clearCheckpoint();state.save();state.resetProgress();
      return {checkpoint,cleared,reset:state.progress.clearedStages.length===0,stored:localStorage.getItem(${JSON.stringify(storageKey)})};
    })()`)
    assert(mutation.cleared&&mutation.reset);assert.equal(mutation.stored,sentinel)
    await checkErrors();pass('checkpoint-clear-reset-storage-isolation',mutation)
  }
  await navigate('/review.html?reload-check=1#stage=c33s5')
  await until(()=>evaluate(`!!document.querySelector('.review-catalog')`),'reload catalog')
  assert.equal(await evaluate(`document.querySelector('#review-chapter').value`),'32')
  assert.equal(await evaluate(`document.querySelector('.review-stage-selected')?.dataset.reviewStage`),'c33s5')
  assert.equal(await evaluate(`!!document.querySelector('#health-fill')`),false,'Deep link must not auto-play')
  await storageUnchanged();await checkErrors();pass('reload-isolated-deep-link')
  await navigate('/index.html')
  await until(()=>evaluate(`!!document.querySelector('[data-world]')`),'normal game')
  assert.equal(await evaluate(`document.querySelectorAll('.chapter-card.locked[data-world]').length`),4)
  await tap('.chapter-card[data-world]:not(:disabled)')
  await until(()=>evaluate(`!!document.querySelector('[data-chapter]')`),'normal chapters')
  await tap('.chapter-card[data-chapter]:not(:disabled)')
  await until(()=>evaluate(`!!document.querySelector('[data-stage]')`),'normal map')
  const normal=await evaluate(`[...document.querySelectorAll('[data-stage]')].map(el=>({id:el.dataset.stage,locked:el.classList.contains('locked'),disabled:el.disabled}))`)
  assert.equal(normal.length,5);assert(normal.slice(2).every(stage=>stage.locked&&stage.disabled))
  await storageUnchanged();await checkErrors()
  pass('normal-game-progression-remains-locked',{normal})
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
  await runReviewChecks()
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
