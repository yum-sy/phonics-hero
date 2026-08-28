// On-screen SVG diagnostics for a real device with no attached console.
// Opt-in via ?debugart=1 -- never loaded otherwise, zero cost in the
// normal app path. Reports computed geometry/style for every SVG <text>
// element found (the hero/villain chest emblem badges are drawn this way),
// since a real-device report says these render fine on desktop Chrome but
// are blank on iPad across every chapter, and there's no console on the
// device to inspect why.
export function mountArtDebugPanel() {
  const wrap = document.createElement('div')
  wrap.style.cssText =
    'position:fixed;right:0;top:0;bottom:0;width:260px;z-index:99999;' +
    'overflow:auto;background:rgba(0,0,0,0.88);color:#0ff;' +
    'font:9px/1.3 monospace;padding:6px;white-space:pre-wrap;word-break:break-word;' +
    'border-left:2px solid #0ff;'
  document.body.appendChild(wrap)

  const btn = document.createElement('button')
  btn.textContent = 'scan SVG <text> now'
  btn.style.cssText = 'font:11px monospace;padding:6px 10px;margin-bottom:6px;'
  const body = document.createElement('div')
  wrap.appendChild(btn)
  wrap.appendChild(body)

  function scan() {
    const texts = Array.from(document.querySelectorAll('svg text'))
    const lines = [`document.querySelectorAll('svg text').length = ${texts.length}`, '']
    texts.slice(0, 12).forEach((el, i) => {
      let bbox = null
      let bboxErr = null
      try {
        bbox = el.getBBox()
      } catch (e) {
        bboxErr = String(e)
      }
      const cs = window.getComputedStyle(el)
      const svg = el.closest('svg')
      const svgRect = svg ? svg.getBoundingClientRect() : null
      // None of the checks above can catch OCCLUSION: a later-drawn shape
      // sitting visually on top of this text would still leave the text
      // element itself reporting perfectly normal attrs/computed style/bbox
      // -- those describe the element, not what a human eye actually sees
      // at its position. elementFromPoint() asks the browser what is
      // topmost at the text's own screen center, which is the one check
      // that can actually catch this.
      let occlusion = '(no screen position available)'
      try {
        const screenRect = el.getBoundingClientRect()
        const cx = screenRect.x + screenRect.width / 2
        const cy = screenRect.y + screenRect.height / 2
        const topEl = document.elementFromPoint(cx, cy)
        const isSelfOrAncestor = topEl === el || (topEl && el.contains(topEl)) || (topEl && topEl.contains(el))
        occlusion = `screenRect=${screenRect.width.toFixed(1)}x${screenRect.height.toFixed(
          1
        )} @(${cx.toFixed(0)},${cy.toFixed(0)}) topmost-at-that-point=${
          topEl ? topEl.tagName + (topEl.className ? '.' + topEl.className : '') : '(none)'
        } ${isSelfOrAncestor ? '[OK -- text itself is on top]' : '[!! SOMETHING ELSE IS ON TOP, LIKELY HIDING THIS TEXT]'}`
      } catch (e) {
        occlusion = 'elementFromPoint check threw: ' + e
      }
      // Real-device report: a two-glyph emblem ("EE") shows one glyph
      // stranded far outside the badge, well past the other -- on a device
      // where getBBox()/computed-style/occlusion all read completely
      // normal (checked above). None of those describe INTER-CHARACTER
      // spacing within one multi-glyph <text> -- getExtentOfChar() is the
      // one SVG API that reports each character's own rendered box, so if
      // WebKit is laying out this string with anomalous per-glyph advance
      // (a real, if obscure, category of SVG text-shaping bug, more likely
      // to surface here because these badges render at a SCALED-UP size --
      // CSS stretches a 120-unit-wide viewBox up to ~186px, so any small
      // per-engine rounding in glyph advance gets multiplied along with
      // it), this is what will show it directly instead of guessing from
      // an already-confirmed-normal bounding box.
      let perChar = '(single glyph or unavailable)'
      try {
        const n = el.textContent.length
        if (n > 1 && el.getExtentOfChar) {
          const extents = []
          for (let ci = 0; ci < n; ci++) {
            const ext = el.getExtentOfChar(ci)
            extents.push(`  char[${ci}]=${JSON.stringify(el.textContent[ci])} x=${ext.x.toFixed(1)} y=${ext.y.toFixed(1)} w=${ext.width.toFixed(1)} h=${ext.height.toFixed(1)}`)
          }
          perChar = '\n' + extents.join('\n')
        }
      } catch (e) {
        perChar = 'getExtentOfChar threw: ' + e
      }
      lines.push(
        `--- text #${i} ---`,
        `content: ${JSON.stringify(el.textContent)}`,
        `attrs: x=${el.getAttribute('x')} y=${el.getAttribute('y')} font-size=${el.getAttribute(
          'font-size'
        )} font-family=${el.getAttribute('font-family')} fill=${el.getAttribute('fill')}`,
        `computed: fill=${cs.fill} opacity=${cs.opacity} visibility=${cs.visibility} display=${cs.display} font-family=${cs.fontFamily}`,
        `getBBox(): ${bbox ? `x=${bbox.x.toFixed(1)} y=${bbox.y.toFixed(1)} w=${bbox.width.toFixed(1)} h=${bbox.height.toFixed(1)}` : 'THREW: ' + bboxErr}`,
        `parent svg: viewBox=${svg ? svg.getAttribute('viewBox') : '(none)'} clientRect=${
          svgRect ? `${svgRect.width.toFixed(1)}x${svgRect.height.toFixed(1)}` : '(none)'
        }`,
        `occlusion check: ${occlusion}`,
        `per-character extent: ${perChar}`,
        ''
      )
    })
    if (texts.length > 12) lines.push(`... and ${texts.length - 12} more, not shown`)
    body.textContent = lines.join('\n')
  }

  // Real-device report: a lone "E" floats outside the emblem badge on the
  // battle scene, confirmed present with NO debug panel loaded at all (so
  // it isn't this panel's own layout interfering). The svg-text scan above
  // only ever finds the 2 legitimate "EE" <text> elements with normal
  // getBBox()/per-character spacing -- neither can be the stray glyph. If
  // it's real and not from those 2 elements, it must be a DIFFERENT kind of
  // node the svg-text scan can't see at all: a plain HTML element (div/span),
  // not <svg text>. Walk every text node in the whole document, not just
  // inside <svg>, and report anything short enough to be a bare letter.
  function scanStray() {
    const finds = []
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
    let node
    while ((node = walker.nextNode())) {
      const t = node.textContent.trim()
      if (t.length >= 1 && t.length <= 3 && /^[A-Za-z]+$/.test(t)) {
        const parent = node.parentElement
        if (!parent) continue
        const rect = parent.getBoundingClientRect()
        const isSvg = parent.namespaceURI === 'http://www.w3.org/2000/svg'
        const heroSlot = parent.closest('.hero-slot')
        const villainSlot = parent.closest('.villain-slot')
        finds.push(
          `text=${JSON.stringify(t)} tag=${isSvg ? 'SVG:' : ''}${parent.tagName} class=${JSON.stringify(
            parent.className
          )} rect=(${rect.x.toFixed(0)},${rect.y.toFixed(0)} ${rect.width.toFixed(1)}x${rect.height.toFixed(
            1
          )}) in-hero-slot=${!!heroSlot} in-villain-slot=${!!villainSlot}`
        )
      }
    }
    body.textContent = 'STRAY-TEXT SCAN (whole document, any short bare-letter node):\n\n' + (finds.length ? finds.join('\n') : '(none found)')
  }
  const strayBtn = document.createElement('button')
  strayBtn.textContent = 'scan WHOLE PAGE for stray letters'
  strayBtn.style.cssText = 'font:11px monospace;padding:6px 10px;margin-bottom:6px;display:block;'
  wrap.insertBefore(strayBtn, body)
  strayBtn.onclick = scanStray

  btn.onclick = scan
  // Auto-scan once shortly after mount too, in case the user forgets to tap.
  setTimeout(scan, 1500)
  // A one-off scan goes stale the moment the user navigates to a different
  // stage (already happened once: a screenshot showed "EE" in the readout
  // while the visible screen had already moved on to "OR") -- auto-rescan
  // on an interval so the panel always reflects whatever screen is
  // currently up, without relying on remembering to tap the button after
  // every navigation.
  setInterval(scan, 2000)
}
