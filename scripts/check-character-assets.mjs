// Run against Vite: node scripts/check-character-assets.mjs [http://localhost:5174]
// Uses a private headless Chrome process, never the user's browser/profile.
import { spawn } from 'node:child_process'
import { mkdtemp, readFile, mkdir, writeFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import assert from 'node:assert/strict'

const base = (process.argv[2] || 'http://localhost:5174').replace(/\/$/, '')
const chromePath = process.env.CHROME_PATH || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const work = await mkdtemp(join(tmpdir(), 'phonics-art-check-'))
const profile = join(work, 'profile')
const output = process.env.ART_CHECK_OUTPUT || join(work, 'results')
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
  await command('Emulation.setDeviceMetricsOverride', { width: 834, height: 1194, deviceScaleFactor: 1, mobile: false })
  await navigate('/_art.html')
  await until(() => evaluate(`document.querySelectorAll('.box.art').length > 0`), 'gallery render')
  report.gallery = await evaluate(`(async () => {
    const source = await (await fetch('/src/screens.js')).text();
    const match = source.match(/from\\s+['"]([^'"]*chapters\\/index\\.js[^'"]*)['"]/);
    const {chapters} = await import(match ? new URL(match[1], location.origin + '/src/').href : '/src/data/chapters/index.js');
    const art = await import('/src/art.js');
    const unique = new Map();
    for (const chapter of chapters) for (const stage of chapter.stages) for (const role of ['hero','villain']) {
      const spec = stage[role]; unique.set(role + ':' + spec.art, {role,spec});
    }
    const missing = [], badgeErrors = [], families = {}, urls = new Set();
    for (const {role,spec} of unique.values()) {
      const doc = new DOMParser().parseFromString(art[role + 'Art'](spec), 'image/svg+xml');
      const root = doc.documentElement;
      if (doc.querySelector('parsererror') || !root.classList.contains('character-asset')) { missing.push(role+':'+spec.art); continue; }
      const family = root.getAttribute('data-art-family'); families[family]=(families[family]||0)+1;
      for (const im of doc.querySelectorAll('image')) urls.add(new URL(im.getAttribute('href'),location.href).href);
      if (root.querySelectorAll('text').length !== 0) badgeErrors.push(spec.art);
    }
    const images=await Promise.all([...urls].map(async url=>{const im=new Image();im.src=url;try{await im.decode();return {url,width:im.naturalWidth,height:im.naturalHeight}}catch{return {url,error:'decode failed'}}}));
    return {uniqueCharacters:unique.size,missing,badgeErrors,families,images,galleryCharacters:document.querySelectorAll('.box.art').length,galleryMapped:document.querySelectorAll('.box.art > .character-asset').length};
  })()`)
  report.gallery.consoleErrors = [...currentErrors]
  report.gallery.networkFailures = [...currentNetworkFailures]
  assert.equal(report.gallery.uniqueCharacters, 295, 'Expected all 295 current character identities')
  assert.deepEqual(report.gallery.missing, [], 'Legacy/unmapped character art')
  assert.deepEqual(report.gallery.badgeErrors, [], 'Character SVG contains a permanent text badge')
  assert.equal(Object.keys(report.gallery.families).length, 7, 'All seven families must be mapped')
  assert.equal(report.gallery.galleryCharacters, report.gallery.galleryMapped, 'Gallery has legacy art')
  assert.equal(report.gallery.images.length, 14, 'Expected base and world sheets for all seven families')
  assert(report.gallery.images.every(i => !i.error && i.width > 0), 'Atlas image failed to decode')
  assert.deepEqual(report.gallery.consoleErrors, [], 'Gallery console errors')
  assert.deepEqual(report.gallery.networkFailures, [], 'Gallery atlas network errors')
  await screenshot('gallery-portrait')
  console.log(`Gallery: ${report.gallery.uniqueCharacters} identities, ${report.gallery.images.length} images, all mapped`)

  const families = ['robot','comic','dino','pixel','brick','career','deco']
  report.atlasSheets = []
  for (const sheetName of [...families, ...families.map(family => `${family}-worlds`)]) {
    const isWorld = sheetName.endsWith('-worlds')
    const family = sheetName.replace(/-worlds$/, '')
    await command('Emulation.setDeviceMetricsOverride', { width: isWorld ? 1194 : 834, height: isWorld ? 834 : 1194, deviceScaleFactor: 1, mobile: false })
    const sheet = await evaluate(`(async () => {
      const {CHARACTER_ASSETS} = await import('/src/art/character-assets.js');
      const {renderCharacterAsset,CHARACTER_ATLASES} = await import('/src/art/atlas.js');
      const family=${JSON.stringify(family)};
      const sheetName=${JSON.stringify(sheetName)}, isWorld=${isWorld};
      const metadata=CHARACTER_ATLASES[sheetName];
      if(!metadata)throw new Error('Missing atlas metadata: '+sheetName);
      const slots=isWorld?metadata.frames.map((_,slot)=>slot):[...new Set(Object.values(CHARACTER_ASSETS).filter(a=>a.family===family).map(a=>a.slot))].sort((a,b)=>a-b);
      const fusion=family==='career'?5:3;
      document.body.innerHTML='<h1>'+sheetName+' — production crops</h1><div style="display:grid;grid-template-columns:repeat('+(isWorld?5:3)+',1fr);gap:10px;text-align:center">'+slots.map(slot=>'<div><div style="width:190px;height:220px;margin:auto">'+renderCharacterAsset({family,sheet:isWorld?sheetName:undefined,slot,emblem:isWorld?(slot<5?'EE':undefined):(slot<fusion?'EE':slot===fusion?'★':undefined)})+'</div><div>slot '+slot+'</div></div>').join('')+'</div>';
      document.body.style.padding='16px';
      document.querySelectorAll('.character-asset').forEach(svg=>{svg.style.width='190px';svg.style.height='220px'});
      return {family,sheet:sheetName,isWorld,slots,expectedDimensions:[metadata.width,metadata.height]};
    })()`)
    sheet.images = await evaluate(decodedImages)
    assert(sheet.images.length > 0 && sheet.images.every(i => !i.error), 'Audit sheet atlas decode failed')
    assert(sheet.images.every(i => i.width===sheet.expectedDimensions[0] && i.height===sheet.expectedDimensions[1]),'Audit sheet native dimensions differ from metadata')
    assert(sheet.images.every(i=>i.url.includes('/art/'+(isWorld?'v3':'v2')+'/')),'Audit sheet loaded wrong asset version')
    await screenshot(`atlas-${sheetName}`)
    report.atlasSheets.push(sheet)
  }
  assert.equal(report.atlasSheets.filter(s=>!s.isWorld).reduce((n,s)=>n+s.slots.length,0),65,'Expected all 65 base production slots')
  assert.equal(report.atlasSheets.filter(s=>s.isWorld).reduce((n,s)=>n+s.slots.length,0),70,'Expected all 70 world characters, including four reserved')
  console.log('Captured 65 base + 70 world crops across fourteen sheets')
  const cases = families.flatMap((family,index) => {
    const chapter=index+1;
    const stage=chapter===1?'stage-1':`c${chapter}-stage-1`;
    return [
      {name:`battle${chapter}`,family,query:`shot=battle${chapter}`,screen:'stage-screen'},
      {name:`boss${chapter}`,family,query:`shot=boss${chapter}`,screen:'stage-screen'},
      {name:`boss${chapter}after`,family,query:`shot=boss${chapter}after`,screen:'stage-screen'},
      {name:`reward${chapter}`,family,query:`shot=reward1&reward=${stage}`,screen:'reward-screen'},
    ];
  })
  const filter = process.env.ART_CHECK_CASES?.split(',')
  for (const [orientation,width,height] of [['portrait',834,1194],['landscape',1194,834]]) {
    await command('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: false })
    for (const item of cases.filter(c => !filter || filter.includes(c.name))) {
      const label=`${orientation}-${item.name}`
      const entry={name:label,family:item.family}
      report.cases.push(entry)
      try {
        await navigate(`/_probe.html?${item.query}&unlock=1&delay=1200`)
        entry.hud=await until(() => evaluate(`document.documentElement.getAttribute('data-probe')`),label)
        entry.images=await evaluate(decodedImages)
        entry.dom=await evaluate(`({viewport:[innerWidth,innerHeight],families:[...new Set([...document.querySelectorAll('#app .character-asset')].map(e=>e.dataset.artFamily))],legacy:[...document.querySelectorAll('#app svg.carbot-art')].filter(e=>!e.classList.contains('character-asset')).length})`)
        entry.consoleErrors=[...currentErrors]
        entry.networkFailures=[...currentNetworkFailures]
        assert.match(entry.hud,/^NOSCROLL\b/,'HUD reports scrolling')
        assert(!entry.hud.includes('***'),'HUD reports wrong beat or expectation failure')
        assert(entry.hud.includes(item.screen) && !entry.hud.includes('on=[none|'),'HUD rendered wrong screen')
        assert.deepEqual(entry.dom.viewport,[width,height],'Viewport differs from iPad dimensions')
        assert(entry.dom.families.includes(item.family),'Expected family absent from screen')
        assert.equal(entry.dom.legacy,0,'Legacy character SVG remains')
        assert(entry.images.length>0 && entry.images.every(i=>!i.error),'Character image decode failed')
        assert.deepEqual(entry.consoleErrors,[],'Console errors')
        assert.deepEqual(entry.networkFailures,[],'Atlas network errors')
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
