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
        ''
      )
    })
    if (texts.length > 12) lines.push(`... and ${texts.length - 12} more, not shown`)
    body.textContent = lines.join('\n')
  }

  btn.onclick = scan
  // Auto-scan once shortly after mount too, in case the user forgets to tap.
  setTimeout(scan, 1500)
}
