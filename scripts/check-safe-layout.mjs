// Run against Vite: node scripts/check-safe-layout.mjs [http://localhost:5174]
// Uses a private headless Chrome process, never the user's browser/profile.
// Optional: CHROME_PATH, LAYOUT_CHECK_OUTPUT, LAYOUT_CHECK_CASES=chapters,chapters-locked
// LAYOUT_PARENT_MODE=1 checks editor controls; LAYOUT_PARENT_PROGRESS=partial
// seeds a mixed completion/lock fixture instead of clearing the full curriculum.
// LAYOUT_REDUCED_MOTION=1 also checks static battle feedback under reduced motion.
// LAYOUT_STANDALONE=1 activates the shipped standalone CSS rule (not iOS emulation).
// 24 screens × portrait/landscape × normal/simulated safe insets = 96 cases.
// Desktop layout evidence only: injected CSS insets do not emulate iOS or installed PWA behavior.
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const base = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '')
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const work = await mkdtemp(join(tmpdir(), 'phonics-safe-layout-'))
const profile = join(work, 'profile')
const output = process.env.LAYOUT_CHECK_OUTPUT || join(work, 'results')
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
const standalone = process.env.LAYOUT_STANDALONE === '1'
const report = { standalone, base, generatedAt: new Date().toISOString(), cases: [], failures: [] }

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
      if (url.includes('/art/') && status >= 400) currentNetworkFailures.push({ url, status })
    }
  })
  await Promise.all([command('Page.enable'), command('Runtime.enable'), command('Network.enable')])
  await command('Emulation.setDeviceMetricsOverride', { width: 834, height: 1194, deviceScaleFactor: 1, mobile: false })
  const mediaFeatures = []
  if (process.env.LAYOUT_REDUCED_MOTION === '1') mediaFeatures.push({ name: 'prefers-reduced-motion', value: 'reduce' })
  await command('Emulation.setEmulatedMedia', { features: mediaFeatures })
  const parentMode = process.env.LAYOUT_PARENT_MODE === '1'
  const partialProgress = parentMode && process.env.LAYOUT_PARENT_PROGRESS === 'partial'
  await command('Page.addScriptToEvaluateOnNewDocument', {source: `
    localStorage.clear(); sessionStorage.clear();
    ${parentMode ? "sessionStorage.setItem('phonics-hero-parent-access-v1', '1');" : ''}
    ${partialProgress ? `localStorage.setItem('carbot-phonics-progress-v1', JSON.stringify({
      clearedStages: ['stage-1'], stars: {'stage-1': 3}, lockedStages: ['stage-3'], checkpoint: null
    }));` : ''}
  `});
  const cases = ['world','chapters','map1','map4','battle1','battle4','battle7','boss1','boss5','boss7','boss1after','boss5after','boss7after','reward1','reward33','long3','long4','build7','listen1','finale1','finale2','lang6c','lang6t','lang6b','lang7m','lang9c','lang20t','reward6','reward16'].map(name=>({name,query:'shot='+name,screen:name==='world'||name==='chapters'?'chapter-select-screen':name.startsWith('map')?'map-screen':name.startsWith('reward')?'reward-screen':'stage-screen'}));
  cases.unshift(...['world','chapters','map1'].map(name=>({name:name+'-locked',query:'shot='+name,locked:true,screen:name==='map1'?'map-screen':'chapter-select-screen'})));
  const filter = process.env.LAYOUT_CHECK_CASES?.split(',')
  for (const [orientation,width,height,safeTop,safeBottom] of [['portrait',834,1194,0,0],['landscape',1194,834,0,0],['portrait-safe',834,1194,24,20],['landscape-safe',1194,834,24,20]]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
    for (const item of cases.filter(c => !filter || filter.includes(c.name))) {
      const label=`${orientation}-${item.name}`
      const entry={name:label}
      report.cases.push(entry)
      try {
        const safeCSS = `:root{--safe-top:${safeTop}px;--safe-bottom:${safeBottom}px}`
        await navigate(`/_probe.html?${item.query}${item.locked || partialProgress ? '' : '&unlock=1'}&delay=1200&css=${encodeURIComponent(safeCSS)}`)
        if (standalone) {
          await until(() => evaluate(`(() => {
            const rule = [...document.styleSheets].flatMap(sheet => [...sheet.cssRules])
              .find(rule => rule.media?.mediaText === '(display-mode: standalone)');
            if (!rule) return false;
            rule.media.mediaText = 'all';
            return true;
          })()`), 'shipped standalone CSS rule');
        }
        entry.hud=await until(() => evaluate(`document.documentElement.getAttribute('data-probe')`),label)
        entry.images=await evaluate(decodedImages)
        entry.dom=await evaluate(`({viewport:[innerWidth,innerHeight],families:[...new Set([...document.querySelectorAll('#app .character-asset')].map(e=>e.dataset.artFamily))],legacy:[...document.querySelectorAll('#app svg.carbot-art')].filter(e=>!e.classList.contains('character-asset')).length})`)
        entry.consoleErrors=[...currentErrors]
        entry.networkFailures=[...currentNetworkFailures]
        assert.match(entry.hud,/^NOSCROLL\b/,'HUD reports scrolling')
        assert(!entry.hud.includes('***'),'HUD reports wrong beat or expectation failure')
        assert(!/CLIP=|SPILL=/.test(entry.hud), 'HUD reports clipping or content spill')
        assert(entry.hud.includes(item.screen) && !entry.hud.includes('on=[none|'),'HUD rendered wrong screen')
        assert.deepEqual(entry.dom.viewport,[width,height],'Viewport differs from iPad dimensions')

        assert.equal(entry.dom.legacy,0,'Legacy character SVG remains')
        assert(entry.images.length>0 && entry.images.every(i=>!i.error),'Character image decode failed')
        assert.deepEqual(entry.consoleErrors,[],'Console errors')
        assert.deepEqual(entry.networkFailures,[],'Atlas network errors')
        entry.bounds=await evaluate(`(()=>{const s=document.querySelector('#app > .screen'),c=getComputedStyle(s),r=s.getBoundingClientRect();return {screen:{top:r.top,bottom:r.bottom,height:r.height},padding:{top:parseFloat(c.paddingTop),bottom:parseFloat(c.paddingBottom),left:parseFloat(c.paddingLeft),right:parseFloat(c.paddingRight)},topbar:document.querySelector('.stage-topbar')?.getBoundingClientRect().top,locked:[...document.querySelectorAll('.locked .carbot-art')].map(e=>({filter:getComputedStyle(e).filter,opacity:getComputedStyle(e).opacity,parentOpacity:getComputedStyle(e.closest('.locked')).opacity}))}})()`)
        assert.equal(entry.bounds.screen.top, 0, 'Screen is offset from viewport');
        assert.equal(entry.bounds.screen.height, height, 'Screen exceeds viewport height');
        const expectedTop = 16 + (standalone ? Math.max(24, safeTop) : safeTop);
        if (entry.bounds.topbar !== undefined) assert(entry.bounds.topbar >= expectedTop, 'Topbar overlaps safe gutter');
        assert.equal(entry.bounds.padding.top,expectedTop,'Top inset counted incorrectly');
        assert.equal(entry.bounds.padding.bottom,16+safeBottom,'Bottom inset counted incorrectly');
        if(item.locked) {assert(entry.bounds.locked.length>0,'Missing locked art');assert(entry.bounds.locked.every(x=>x.filter==='brightness(0)'&&x.opacity==='1'&&x.parentOpacity==='1'),'Locked silhouette not opaque black');}
        entry.motion = await evaluate(`(() => {
          const scene = document.querySelector('.battle-scene');
          return { reduced: matchMedia('(prefers-reduced-motion: reduce)').matches,
            state: scene?.dataset.combatState,
            activeBattleAnimations: scene ? scene.getAnimations({subtree:true}).filter(a => a.playState === 'running').length : 0,
            badges: document.querySelectorAll('.character-asset text').length };
        })()`)
        if (entry.motion.reduced || entry.motion.state === 'studying') {
          assert.equal(entry.motion.activeBattleAnimations, 0, 'Battle animation runs while studying or reduced motion')
        }
        assert.equal(entry.motion.badges, 0, 'Character learning badge remains')
        entry.passed=true
        await screenshot(label)
        console.log(`PASS ${label}`)
      } catch(error) {
        entry.passed=false;entry.error=error.message;report.failures.push({name:label,error:error.message})
        await screenshot(`${label}-FAIL`).catch(()=>{})
        console.error(`FAIL ${label}: ${error.message}`)
      }
    }
  }
} catch (error) {
  report.failures.push({name:'setup-or-layout',error:error.stack})
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
