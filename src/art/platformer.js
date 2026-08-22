// Platformer-family character art — chapter 5, the jump-platformer genre slot
// in the world order.
//
// REVISION NOTE (v3): v2 fixed the CASTING — proportions and colour placement.
// v1 had drawn generic 2.5-head sprites with a head wider than its own torso,
// which read as a toddler mascot; v2 rebuilt them as squat grown-ups in
// brimmed caps and dungarees, warm shirt above and cool denim below. That part
// held up and is carried over unchanged.
//
// What v2 still got wrong was the RENDERING STYLE. Every shape was an
// unoutlined colour plane, which is this app's oldest habit and the reason
// these figures stayed soft and flat next to the reference art for the genre.
// v3 changes only that: the same cast, redrawn as INKED STICKER ART.
//
// DRAWING STYLE — v3, the load-bearing change.
//
//  A. BLACK INK ON EVERY MASS. Nothing is a bare colour plane any more.
//     `ink(w)` puts LINE (#221a2c, near-black with a violet cast so it sits
//     with the palette instead of punching a hole in it) on a shape. Weights
//     are a three-step hierarchy, not one value: 3.0–3.4 on silhouette masses
//     (torso, head, boots, gloves), 2.0–2.6 on parts sitting inside another
//     mass (thumbs, brims, plates, bricks), 1.3–1.7 on surface detail
//     (stitching, panel seams, plank courses). Uniform line weight is what
//     makes inked art look like clip art; the hierarchy is what makes the
//     silhouette read first and the detail second.
//
//  B. THE WHITE STICKER BORDER IS REAL, AND IT IS COMPUTED, NOT DRAWN. Every
//     figure is painted twice from one part list: `haloPaint` first, which
//     re-emits each shape with white fill and a white stroke 9 units fatter
//     than its own, then `paint` for the real thing on top. Because the real
//     pass covers the union of the geometry exactly, the only white that
//     survives is a 4.5-unit rim around the outside — a true silhouette
//     offset, with no hand-authored outline path to drift out of sync when a
//     limb moves. Parts whose halo would show OUTSIDE that union (ground
//     shadows, speed lines, sparkles, glitch debris, the boss's glow) are
//     marked `nohalo:true`, and text is skipped, since a haloed letter would
//     lose its counters. Verified at 132/186/256 px: the rim is what makes
//     these read as cut-out stickers rather than shapes on a page, and it is
//     what keeps a dark villain legible against a dark battle backdrop.
//     Consequence for geometry: the halo costs 4.5 units of margin on every
//     side, so nothing may go past x 6..114 / y 5..135. v2 was already
//     clipping platGlitch's right glove at x=131 and the boss's wings at x=0;
//     both are pulled in here.
//
//  C. BIG EXPRESSIVE EYES. v2 had 4-unit ink dots. v3 draws an outlined white
//     sclera with a DOMINANT pupil (0.72 of the sclera) and a highlight. The
//     pupil has to dominate: a small pupil in a big thin-rimmed sclera reads as
//     SPECTACLES, which is exactly how the first v3 pass came out. Heroes get a
//     heavy lid wedge sitting on the sclera (the cap brim leaves no room above
//     the eye for a brow, and in practice the brim itself acts as the brow);
//     villains have no cap, so they get real brows — thick strokes angled down
//     toward the nose. That one difference is the whole hero/villain face split.
//
//  D. OPEN MOUTHS WITH CORNER TICKS. A single curved stroke cannot carry an
//     expression at any size. Heroes get an open smile — dark mouth shape,
//     white teeth strip, ink ticks at the corners; villains get the same shape
//     with fangs. Bug King is the exception: the void in its belly is its
//     mouth, so its head carries eyes and brows only.
//
//  E. ANGULAR CONSTRUCTION WHERE THE GENRE ALLOWS IT. The toy family's rule is
//     "circles only for things that are really round", and most of it ports:
//     torsos are trapezoids (shoulders 48, waist 56), the bib is a trapezoid
//     flaring to the hips, trouser legs are tapered quads, boots are domed
//     uppers on FLAT soles, the cap brim is a pointed lens, and the head is a
//     jawed shape rather than a pill. It does NOT port all the way: this
//     genre's face and its big round nose are round on purpose, so heads stay
//     curve-topped and the nose, gloves, buttons, coil turns, cap disc and the
//     spring's emblem plate remain circles. Everything else that was a rect or
//     an ellipse in v2 is now a quad, a taper or a lens.
//
//  F. PUSHED PRIMARIES. With ink around them the fills can go louder without
//     turning muddy, so denim, stitch yellow and button gold are all more
//     saturated than v2's.
//
// CASTING GRAMMAR — v2's proportions and colour placement, kept.
//
//  1. SQUAT GROWN-UP PROPORTIONS, ~2.9–3.1 heads. The head is NARROWER than
//     the shoulders, which are narrower than the hips: 36 / 50 / 71 units.
//  2. DUNGAREE TWO-TONE, split top from bottom. Shirt, sleeves and cap dome
//     take `bodyColor`; bib, straps and legs take the fixed DENIM constant.
//     DENIM is deliberately not palette-driven — the genre read only survives
//     if the bottom half is reliably cool whatever colour a chapter hands the
//     shirt.
//  3. THE DUNGAREES MUST SURVIVE A FLAT GREY SILHOUETTE — three structural
//     devices: the bib is WIDER than the shirt so the outline steps outward at
//     the waist; the straps run PAST the shoulder line as knobs; the two big
//     buttons are centred ON the bib's outer edge so half of each circle
//     sticks out of the body.
//  4. OVERSIZED WHITE GLOVES AND BOOTS as separate masses. Heroes get
//     `heroGlove`/`heroBoot` (thumb, cuff band, toe cap, sole slab); villains
//     keep the plainer `villainGlove`/`villainShoe`, so hands differ on sight.
//  5. CAP WITH A BRIM WIDER THAN THE SHOULDERS — with no neck in the family,
//     those two protruding lips are the only thing separating head from torso
//     in a colour-stripped read.
//  6. BIG ROUND NOSE — the genre's loudest face tell. No moustache: that is
//     one specific character's property, not the genre's.
//  7. NO GRADIENTS OR FILTERS anywhere. Volume is stacked planes plus ink.
//  8. ONE POSE IDEA PER HERO: airborne / coiled / boxy / winged-and-massive.
//     Villains are tilted and lopsided where heroes are upright.
//  9. THE EMBLEM PLATE SITS ON THE BIB, not the shirt — on the shirt it plus
//     the straps covered the warm half entirely and the two-tone died. On dark
//     denim the bright plate also gets its strongest contrast.
//
// SIZES: judged at 132–256 px, which is what style.css renders (132 combine
// minibot, 170 map node, 186 battle sprite, 250 reward, 256 final form). The
// `emblem` letter is curriculum content, so its plate stays oversized past
// good taste and is checked pixel-by-pixel at 66 px.
//
// `visorColor` names the EMBLEM PLATE and the cap's front disc, not a face
// part — the family has no visor. It must stay bright or the phonics letter
// dies.
//
// This file must not import ../art.js (circular); it carries its own svgWrap.
//
// Function names and destructured parameters are UNCHANGED from v2 — art.js
// wires all nine styles by name and the palettes pass bodyColor/accent/emblem/
// visorColor/panelColor exactly as before.

function svgWrap(inner, viewBox = '0 0 120 140') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

// ---------------------------------------------------------------------------
// Part objects. Shapes are described rather than serialised so the same list
// can be painted twice — once as the white sticker halo, once for real. See
// style rule B; a hand-drawn outline path cannot stay in sync with nine poses.
// ---------------------------------------------------------------------------

const LINE = '#221a2c'
const HALO = '#fffefb'
const HALO_W = 9

function el(tag, attrs, children) {
  return children ? { tag, attrs, children } : { tag, attrs }
}

const R = (x, y, w, h, rx, fill, extra) => el('rect', { x, y, width: w, height: h, rx, fill, ...extra })
const C = (cx, cy, r, fill, extra) => el('circle', { cx, cy, r, fill, ...extra })
const E = (cx, cy, rx, ry, fill, extra) => el('ellipse', { cx, cy, rx, ry, fill, ...extra })
const P = (points, fill, extra) => el('polygon', { points, fill, ...extra })
const D = (d, fill, extra) => el('path', { d, fill, ...extra })
const S = (d, stroke, w, extra) =>
  el('path', { d, fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', ...extra })
const G = (transform, children) => el('g', { transform }, children)
const mirror = (children) => G('translate(120,0) scale(-1,1)', children)

function ink(w = 3) {
  return { stroke: LINE, 'stroke-width': w, 'stroke-linejoin': 'round' }
}

const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const TEXT = (x, y, size, fill, label, extra) =>
  el('text', {
    x,
    y,
    'text-anchor': 'middle',
    'font-family': FONT,
    'font-size': size,
    'font-weight': 800,
    fill,
    label,
    ...extra,
  })

const SKIP = new Set(['label', 'nohalo'])

function attrStr(attrs) {
  let out = ''
  for (const k in attrs) {
    if (SKIP.has(k)) continue
    const v = attrs[k]
    if (v === undefined || v === null) continue
    out += ` ${k}="${typeof v === 'number' ? +v.toFixed(2) : v}"`
  }
  return out
}

function flatten(parts, out = []) {
  for (const p of parts) {
    if (!p) continue
    if (Array.isArray(p)) flatten(p, out)
    else out.push(p)
  }
  return out
}

function paint(parts) {
  return flatten(parts)
    .map((p) => {
      if (p.tag === 'g') return `<g${attrStr(p.attrs)}>${paint(p.children)}</g>`
      if (p.tag === 'text') return `<text${attrStr(p.attrs)}>${p.attrs.label}</text>`
      return `<${p.tag}${attrStr(p.attrs)}/>`
    })
    .join('')
}

function haloPaint(parts) {
  return flatten(parts)
    .map((p) => {
      if (p.tag === 'g') {
        const kids = haloPaint(p.children)
        return kids ? `<g${attrStr(p.attrs)}>${kids}</g>` : ''
      }
      if (p.tag === 'text' || p.attrs.nohalo) return ''
      const a = { ...p.attrs }
      delete a.opacity
      delete a['stroke-dasharray']
      const w = parseFloat(a['stroke-width']) || 0
      a.fill = a.fill && a.fill !== 'none' ? HALO : 'none'
      a.stroke = HALO
      a['stroke-width'] = w + HALO_W
      a['stroke-linejoin'] = 'round'
      a['stroke-linecap'] = 'round'
      return `<${p.tag}${attrStr(a)}/>`
    })
    .join('')
}

// Backdrop parts (shadows, speed lines, sparkles) are painted before the halo
// so the halo never rings them; body parts are painted twice.
function sticker(backdrop, body) {
  return svgWrap(`<g>${paint(backdrop)}${haloPaint(body)}${paint(body)}</g>`)
}

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

const SKIN = '#ffd9b0'
const SKIN_SHADE = '#e3a173'
const NOSE = '#ffc396'
const NOSE_SHADE = '#dd8a5c'
const CHEEK = '#ff8f7a'
// Deliberately a cream white, not HALO's white: when the two matched, every
// glove merged with its own sticker rim and read as an empty hoop.
const GLOVE = '#f7f0e0'
const GLOVE_SHADE = '#cbb99c'
const SHOE = '#4d3018'
const SOLE = '#241608'
const SOLE_MID = '#7d5330'
const MOUTH = '#5e1c2c'

// Dungarees. Fixed rather than palette-driven on purpose — see casting rule 2.
const DENIM = '#2a55c4'
const DENIM_LIT = '#5580e8'
const DENIM_DEEP = '#152a63'
const STITCH = '#ffd75e'
const BUTTON = '#ffcf3a'
const BUTTON_SHADE = '#b8801a'

// ---------------------------------------------------------------------------
// Shared body parts
// ---------------------------------------------------------------------------

// Hero glove: outlined white lobe, a thumb, and a cuff band laid across the
// wrist as an absolute-coordinate quad (a rotated <g> would have to be
// duplicated in the halo pass). `bodyDeg` points from the glove back at the
// body, so the cuff lands on the wrist side and the finger seams on the far
// edge. The seams stay short and near the rim: an earlier pass ran three long
// creases into the palm centre and the result read as a chevron arrow.
function heroGlove(cx, cy, r, cuffColor, bodyDeg) {
  const a = (bodyDeg * Math.PI) / 180
  const away = a + Math.PI
  const at = (ang, d) => [cx + Math.cos(ang) * d, cy + Math.sin(ang) * d]
  const [wx, wy] = at(a, r * 0.86)
  const ux = Math.cos(a)
  const uy = Math.sin(a)
  const px = -uy
  const py = ux
  const half = r * 0.86
  const thick = r * 0.46
  const corner = (sp, st) => `${(wx + px * sp * half + ux * st * thick).toFixed(1)},${(wy + py * sp * half + uy * st * thick).toFixed(1)}`
  const [tx, ty] = at(away - 1.5, r * 0.88)
  const seam = (k) => {
    const g = away + k * 0.44
    const [x1, y1] = at(g, r * 0.55)
    const [x2, y2] = at(g, r * 0.9)
    return S(`M ${x1.toFixed(1)},${y1.toFixed(1)} L ${x2.toFixed(1)},${y2.toFixed(1)}`, GLOVE_SHADE, r * 0.16, {
      nohalo: true,
    })
  }
  return [
    P(`${corner(-1, -1)} ${corner(1, -1)} ${corner(1, 1)} ${corner(-1, 1)}`, cuffColor, ink(2.4)),
    C(tx, ty, r * 0.46, GLOVE, ink(2.2)),
    C(cx, cy, r, GLOVE, ink(3)),
    // Interior shading. Without it an outlined white circle on the app's
    // near-white surfaces reads as an empty hoop, not a hand.
    D(
      `M ${(cx - r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} A ${r},${r} 0 0 0 ${(cx + r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} A ${r * 1.3},${r * 1.3} 0 0 1 ${(cx - r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} Z`,
      GLOVE_SHADE,
      { opacity: 0.5, nohalo: true }
    ),
    seam(-1),
    seam(1),
  ]
}

// Villain glove: the same lobe without the thumb or seams, so hero hands and
// villain hands differ on sight even in silhouette.
function villainGlove(cx, cy, r, cuffColor, bodyDeg) {
  const a = (bodyDeg * Math.PI) / 180
  return [
    C(cx + Math.cos(a) * r * 0.62, cy + Math.sin(a) * r * 0.62, r * 0.86, cuffColor, ink(2.4)),
    C(cx, cy, r, GLOVE, ink(3)),
    D(
      `M ${(cx - r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} A ${r},${r} 0 0 0 ${(cx + r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} A ${r * 1.3},${r * 1.3} 0 0 1 ${(cx - r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} Z`,
      GLOVE_SHADE,
      { opacity: 0.5, nohalo: true }
    ),
  ]
}

// Hero boot: one outlined mass, then a sole whose bottom arc coincides with
// the boot's so the inner outline reads as a welt rather than a stray ellipse,
// then a lit toe cap. Drawn wider than the leg it hangs off, which is most of
// why these figures read as game characters.
function heroBoot(cx, cy, rx, ry) {
  const wy = cy + ry * 0.3
  const bot = cy + ry
  return [
    // A domed upper on a FLAT sole, not an ellipse: a shoe is only round on
    // top, and the straight bottom edge is what makes the figure stand on the
    // ground instead of balancing on a bead.
    D(
      `M ${cx - rx},${wy.toFixed(1)} C ${cx - rx},${(cy - ry * 1.02).toFixed(1)} ${cx + rx},${(cy - ry * 1.02).toFixed(1)} ${cx + rx},${wy.toFixed(1)}
       L ${cx + rx},${bot.toFixed(1)} L ${cx - rx},${bot.toFixed(1)} Z`,
      SHOE,
      ink(3)
    ),
    R(cx - rx, wy, rx * 2, ry * 0.44, 0, SOLE_MID, { stroke: LINE, 'stroke-width': 2, nohalo: true }),
    R(cx - rx, bot - ry * 0.28, rx * 2, ry * 0.28, 0, SOLE, { nohalo: true }),
    E(cx + rx * 0.24, cy - ry * 0.44, rx * 0.4, ry * 0.26, '#fff', { opacity: 0.2, nohalo: true }),
  ]
}

// Villain shoe: the boot without the welt or toe cap.
function villainShoe(cx, cy, rx, ry) {
  const bot = cy + ry
  return [
    D(
      `M ${cx - rx},${(cy + ry * 0.35).toFixed(1)} C ${cx - rx},${(cy - ry).toFixed(1)} ${cx + rx},${(cy - ry).toFixed(1)} ${cx + rx},${(cy + ry * 0.35).toFixed(1)}
       L ${cx + rx},${bot.toFixed(1)} L ${cx - rx},${bot.toFixed(1)} Z`,
      SHOE,
      ink(3)
    ),
    R(cx - rx, bot - ry * 0.42, rx * 2, ry * 0.42, 0, SOLE, { nohalo: true }),
  ]
}

// Cap: dome, panel seams, a brim wider than the shoulders with a dark
// underside, and a bright front disc. The brim is drawn thin and high on the
// head (0.86 of halfW rather than v2's 1.02) because the bigger v3 eyes need
// the room underneath it. `discColor` is skipped on the boss, whose cap
// already carries a star.
function cap(cx, top, halfW, domeColor, brimColor, discColor) {
  const brimY = top + halfW * 0.86
  // The dome is a cubic whose control points sit at `top`, so its actual crown
  // is at top + 0.215*halfW, not at `top`. Seams authored up to `top` poked out
  // of the cap as two grey arcs floating above the head — visible at 132 px and
  // present since v2. They now stop below the crown.
  const crown = top + halfW * 0.3
  const seam = (k) =>
    S(
      `M ${cx + k * halfW * 0.5},${brimY} C ${cx + k * halfW * 0.55},${top + halfW * 0.6}
       ${cx + k * halfW * 0.34},${crown} ${cx + k * halfW * 0.12},${crown}`,
      LINE,
      1.5,
      { opacity: 0.3, nohalo: true }
    )
  return [
    D(`M ${cx - halfW},${brimY} C ${cx - halfW},${top} ${cx + halfW},${top} ${cx + halfW},${brimY} Z`, domeColor, ink(3.2)),
    D(
      `M ${cx - halfW * 0.9},${brimY} C ${cx - halfW * 0.88},${top + halfW * 0.42}
       ${cx - halfW * 0.16},${crown} ${cx - halfW * 0.04},${crown}
       C ${cx - halfW * 0.55},${top + halfW * 0.5} ${cx - halfW * 0.66},${top + halfW * 0.78} ${cx - halfW * 0.62},${brimY} Z`,
      '#fff',
      { opacity: 0.22, nohalo: true }
    ),
    seam(-1),
    seam(1),
    // A lens with pointed tips rather than an ellipse: the drawn tips are what
    // make it read as the stiff peak of a cap instead of a disc behind a head.
    D(
      `M ${cx - halfW * 1.3},${brimY} Q ${cx},${brimY - halfW * 0.44} ${cx + halfW * 1.3},${brimY}
       Q ${cx},${brimY + halfW * 0.34} ${cx - halfW * 1.3},${brimY} Z`,
      brimColor,
      ink(2.8)
    ),
    D(
      `M ${cx - halfW * 1.24},${brimY + halfW * 0.02} Q ${cx},${brimY + halfW * 0.32} ${cx + halfW * 1.24},${brimY + halfW * 0.02}
       Q ${cx},${brimY + halfW * 0.16} ${cx - halfW * 1.24},${brimY + halfW * 0.02} Z`,
      '#000',
      { opacity: 0.3, nohalo: true }
    ),
    discColor
      ? [
          C(cx, brimY - halfW * 0.4, halfW * 0.27, discColor, ink(2.4)),
          S(
            `M ${cx - halfW * 0.17},${brimY - halfW * 0.48} A ${halfW * 0.22},${halfW * 0.22} 0 0 1 ${cx + halfW * 0.06},${brimY - halfW * 0.58}`,
            '#fff',
            1.7,
            { opacity: 0.75, nohalo: true }
          ),
        ]
      : null,
  ]
}

// Hero face. Big outlined eyes with a heavy eyelid stroke standing in for a
// brow (the cap brim leaves no room above the eye), a big round nose over the
// top of them, blushed cheeks, and an open smile with a teeth strip. `s`
// scales every offset from one number so the boss's larger head needs no
// re-tuning.
function face(cx, cy, s = 1) {
  const dx = 9 * s
  const ex = 5.9 * s
  const ey = 6.7 * s
  const nr = 6 * s
  const ny = cy + 7.6 * s
  const my = ny + 6.6 * s
  const mw = 8 * s
  // A big white sclera under a thin outline plus a small pupil reads as
  // SPECTACLES, which is how the first v3 pass came out. The fix is a dominant
  // pupil (0.72 of the sclera) under a heavy lid wedge that sits ON the sclera
  // rather than floating above it as a rim.
  const eye = (px, k) => [
    E(px, cy, ex, ey, '#fff', ink(2 * s)),
    C(px + k * ex * 0.14, cy + ey * 0.2, ex * 0.72, LINE, { nohalo: true }),
    C(px + k * ex * 0.14 - ex * 0.3, cy - ey * 0.14, ex * 0.26, '#fff', { nohalo: true }),
    D(
      `M ${px - ex * 1.05},${cy - ey * 0.42} Q ${px + k * ex * 0.2},${cy - ey * 1.5} ${px + ex * 1.05},${cy - ey * 0.36}
       Q ${px},${cy - ey * 0.62} ${px - ex * 1.05},${cy - ey * 0.42} Z`,
      LINE,
      { nohalo: true }
    ),
  ]
  return [
    E(cx - dx * 1.72, cy + 5.6 * s, 5 * s, 3.2 * s, CHEEK, { opacity: 0.6, nohalo: true }),
    E(cx + dx * 1.72, cy + 5.6 * s, 5 * s, 3.2 * s, CHEEK, { opacity: 0.6, nohalo: true }),
    eye(cx - dx, 1),
    eye(cx + dx, -1),
    D(
      `M ${cx - mw},${my} Q ${cx},${my + 2.4 * s} ${cx + mw},${my} Q ${cx},${my + 8 * s} ${cx - mw},${my} Z`,
      MOUTH,
      ink(2.2 * s)
    ),
    D(
      `M ${cx - mw * 0.78},${my + 0.6 * s} Q ${cx},${my + 2.4 * s} ${cx + mw * 0.78},${my + 0.6 * s}
       Q ${cx},${my + 4 * s} ${cx - mw * 0.78},${my + 0.6 * s} Z`,
      '#fff',
      { nohalo: true }
    ),
    // Corner ticks. Without them an inked mouth shape reads as a scratch
    // rather than a smile — lifted from the toy family's `grin`.
    S(
      `M ${cx - mw},${my} L ${cx - mw - 2.2 * s},${my - 2.4 * s} M ${cx + mw},${my} L ${cx + mw + 2.2 * s},${my - 2.4 * s}`,
      LINE,
      2.4 * s,
      { nohalo: true }
    ),
    C(cx, ny, nr, NOSE, ink(2.6 * s)),
    E(cx, ny + nr * 0.44, nr * 0.7, nr * 0.4, NOSE_SHADE, { opacity: 0.65, nohalo: true }),
    C(cx - nr * 0.32, ny - nr * 0.36, nr * 0.28, '#fff', { opacity: 0.8, nohalo: true }),
  ]
}

// Head assembly in draw order: ears behind, face mass, jaw shade, the brim's
// cast shadow on the forehead, the cap, then the features. Shared by all four
// heroes so the cast has one face.
function heroHead(cx, capTop, faceTop, faceW, faceH, capHalf, bodyColor, accent, discColor, s = 1) {
  const fx = cx - faceW / 2
  const earY = faceTop + faceH * 0.52
  const er = 4.6 * s
  const ear = (px) => [
    E(px, earY, er, er * 1.3, SKIN, ink(2.4)),
    // A crescent, not a filled inner ellipse: filled, the pair read as dark
    // ear-muffs clamped to the head at 132 px.
    S(`M ${px},${earY - er * 0.6} Q ${px + er * 0.5},${earY} ${px},${earY + er * 0.6}`, SKIN_SHADE, 1.8, {
      nohalo: true,
    }),
  ]
  // A JAWED head, not a pill. Round cranium (it is under a cap anyway), then
  // straight cheeks tapering to a narrower chin. The genre's face is round
  // enough that a full hexagon would fight it, but a pill reads as a bean —
  // the taper is the compromise that keeps the genre and loses the bean.
  const jaw = faceW * 0.4
  return [
    ear(fx + 1),
    ear(fx + faceW - 1),
    D(
      `M ${fx},${faceTop + faceH * 0.34} C ${fx},${faceTop} ${fx + faceW},${faceTop} ${fx + faceW},${faceTop + faceH * 0.34}
       L ${cx + jaw},${faceTop + faceH * 0.78} Q ${cx + jaw},${faceTop + faceH} ${cx},${faceTop + faceH}
       Q ${cx - jaw},${faceTop + faceH} ${cx - jaw},${faceTop + faceH * 0.78} Z`,
      SKIN,
      ink(3.2)
    ),
    // No jaw shade plane here: at 132 px a soft patch under the mouth read as
    // a goatee. The jaw's own ink line carries the chin.
    E(cx, capTop + capHalf * 0.86 + 3, faceW * 0.44, 4.6 * s, '#000', { opacity: 0.16, nohalo: true }),
    cap(cx, capTop, capHalf, bodyColor, accent, discColor),
    face(cx, faceTop + faceH * 0.5, s),
  ]
}

// The emblem is the phonics letter the child ties to the character, so the
// plate is sized past the point of good taste — it is the one element that
// still has to survive a 66 px box, where a 120x140 viewBox letterboxes to
// 57x66 and a unit is under half a pixel. Riveted at the corners so it reads
// as a patch sewn onto the bib rather than a hole in it, and inked so the
// bright plate keeps its edge on any denim.
function emblemPlate(x, y, w, h, plateColor, textColor, label, size) {
  const r = Math.min(w, h) * 0.26
  return [
    R(x, y, w, h, r, plateColor, ink(3.2)),
    R(x + 3, y + 3, w - 6, h * 0.26, r * 0.5, '#fff', { opacity: 0.5, nohalo: true }),
    C(x + 5.5, y + 5.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    C(x + w - 5.5, y + 5.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    C(x + 5.5, y + h - 5.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    C(x + w - 5.5, y + h - 5.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    TEXT(x + w / 2, y + h / 2 + size * 0.36, size, textColor, label),
  ]
}

// The bib-and-hips denim mass: inked body, a lit plane down the left, a dashed
// topstitch border and two patch pockets. Always drawn WIDER than the shirt
// above it — see casting rule 3, the outline step is what carries "wearing
// dungarees" into a flat silhouette.
function bibPanel(x, y, w, h, r = 10, flare = 4) {
  return [
    // Flared: a trapezoid widening downward, so the widest point of the whole
    // figure is the hips (casting rule 1) and the waist step is a real angle
    // rather than a rectangle edge.
    D(`M ${x},${y} L ${x + w},${y} L ${x + w + flare},${y + h - r} Q ${x + w + flare},${y + h} ${x + w + flare - r},${y + h}
       L ${x - flare + r},${y + h} Q ${x - flare},${y + h} ${x - flare},${y + h - r} Z`, DENIM, ink(3.2)),
    R(x + 1, y + 1, w * 0.38, h - 2, r, DENIM_LIT, { opacity: 0.5, nohalo: true }),
    R(x + 4, y + 4, w - 8, h - 8, r * 0.8, 'none', {
      stroke: STITCH,
      'stroke-width': 1.6,
      'stroke-dasharray': '4.5,3.5',
      opacity: 0.9,
      nohalo: true,
    }),
    pocket(x + 4.5, y + h * 0.5, h),
    pocket(x + w - 18.5, y + h * 0.5, h),
  ]
}

// Patch pocket, placed at the bib's two lower corners rather than its middle,
// where the emblem plate always sits.
function pocket(px, py, h) {
  return [
    R(px, py, 14, h * 0.34, 2.5, DENIM_DEEP, { opacity: 0.55, stroke: LINE, 'stroke-width': 1.5, nohalo: true }),
    S(`M ${px + 1},${py + 3} L ${px + 13},${py + 3}`, STITCH, 1.5, { opacity: 0.75, nohalo: true }),
  ]
}

// One shoulder strap, authored for the left side and mirrored for the right.
// It deliberately runs past the shoulder line: the two strap tops are knobs on
// the silhouette, which is how the dungarees survive a colour-stripped read.
function strapPiece(outer, stitch) {
  return [
    P(outer, DENIM, ink(2.8)),
    S(stitch, STITCH, 1.6, { 'stroke-dasharray': '4.5,3.5', opacity: 0.85, nohalo: true }),
  ]
}

// A dungaree button, centred ON the bib's outer edge so half of it sticks out
// of the body outline (casting rule 3). Big enough to read as a button and not
// a rivet: r=7..8.5 against the robots' 1.8-unit wheel centres.
function bigButton(cx, cy, r = 7.5) {
  return [
    C(cx, cy, r, BUTTON, ink(2.8)),
    C(cx, cy + r * 0.22, r * 0.68, BUTTON_SHADE, { opacity: 0.55, nohalo: true }),
    C(cx - r * 0.26, cy - r * 0.32, r * 0.3, '#fff', { opacity: 0.8, nohalo: true }),
    C(cx, cy, r * 0.2, LINE, { opacity: 0.6, nohalo: true }),
  ]
}

// A denim trouser leg with a lit plane and a turn-up cuff at the boot, so the
// legs never read as bare skin (the genre's dungarees run all the way down).
function denimLeg(x, y, w, h, r = 5) {
  return [
    // Tapered quad, not a rect — a straight-sided tube read as pipe.
    P(`${x},${y} ${x + w},${y} ${x + w + 2},${y + h} ${x - 2},${y + h}`, DENIM, ink(3)),
    R(x + 1, y + 1, w * 0.4, h - 2, r, DENIM_LIT, { opacity: 0.5, nohalo: true }),
    P(`${x - 1.4},${y + h - 5.5} ${x + w + 1.4},${y + h - 5.5} ${x + w + 2},${y + h} ${x - 2},${y + h}`, DENIM_DEEP, {
      opacity: 0.9,
      stroke: LINE,
      'stroke-width': 1.6,
      nohalo: true,
    }),
  ]
}

// A denim limb drawn as a sloped quad (tucked/kicking legs).
function denimQuad(outer, lit) {
  return [P(outer, DENIM, ink(3)), P(lit, DENIM_LIT, { opacity: 0.5, nohalo: true })]
}

// A shirt sleeve: an inked bodyColor quad plus a lit plane along its top edge.
// Short and thick — the sleeves and the chest above the bib are the only
// places the warm half of the two-tone shows, so they must not be nubs.
function sleeve(outer, lit, bodyColor) {
  return [P(outer, bodyColor, ink(3)), P(lit, '#fff', { opacity: 0.2, nohalo: true })]
}

// ---------------------------------------------------------------------------
// HEROES
// ---------------------------------------------------------------------------

// The jumper: the only figure in the family with both feet off the ground. One
// arm punches above the cap, the legs are tucked and trailing, and the ground
// shadow is left small and far below so the air gap is unmistakable.
export function platJumper({
  bodyColor = '#e03a3a',
  accent = '#1f3f8f',
  emblem = 'R',
  visorColor = '#fff3c4',
} = {}) {
  const strapL = strapPiece('41,35 52,39 49,88 40,88', 'M 46,44 L 44,82')
  const backdrop = [
    E(60, 135, 12, 3, '#000', { opacity: 0.14 }),
    // Trailing speed lines in the air the tucked legs just left. They and the
    // small far-below shadow are the whole "airborne" cue, so they sit in the
    // gap between boot and ground rather than beside the torso.
    // Kept strictly in the empty band between boot and ground: run up beside
    // the hips instead and they read as scratches on the character.
    S(
      'M 12,130 L 26,122 M 108,130 L 94,122 M 40,136 L 50,128 M 80,136 L 70,128 M 60,138 L 60,130',
      accent,
      3.8,
      { opacity: 0.7 }
    ),
  ]
  const body = [
    sleeve('72,50 84,44 95,28 82,22', '73,51 82,47 91,30 86,27', bodyColor),
    heroGlove(90, 21, 10.5, accent, 125),

    // The sleeve reaches ABOVE the glove's top so a band of the warm shirt
    // colour stays visible; earlier the glove covered the whole sleeve and
    // both arms went colourless.
    sleeve('37,44 37,68 24,72 19,47', '38,45 38,56 25,60 21,48', bodyColor),
    heroGlove(20, 62, 10, accent, -12),

    denimQuad('42,98 60,98 48,113 33,109', '45,101 51,101 46,106 39,104'),
    heroBoot(30, 114, 14, 8.5),

    denimQuad('60,98 78,98 87,109 72,113', '64,101 70,101 78,104 72,107'),
    heroBoot(90, 114, 14, 8.5),

    // Trapezoid torso: shoulders 48, waist 56. A rect gave the family a
    // straight-sided box; the flare is what carries "hips are the widest part"
    // down into the bib below it.
    P('36,44 84,44 88,80 32,80', bodyColor, ink(3.2)),
    P('72,45 84,44 88,80 76,80', '#000', { opacity: 0.14, nohalo: true }),
    P('42,45 78,45 74,50 46,50', '#fff', { opacity: 0.22, nohalo: true }),

    bibPanel(29, 78, 62, 30, 11, 4),

    strapL,
    mirror(strapL),
    bigButton(26, 86, 8),
    mirror(bigButton(26, 86, 8)),

    emblemPlate(44, 79, 32, 28, visorColor, accent, emblem, 24),

    heroHead(60, 5, 11, 36, 40, 21, bodyColor, accent, visorColor),
  ]
  return sticker(backdrop, body)
}

// The spring: the shirt is replaced by a stack of coil turns, so this one is
// the tallest and narrowest of the four. The turns are fat and few — thin
// coils turn to mush at small sizes — and each carries its own lit crescent so
// the stack reads as a helix rather than a pile of rings. The straps are drawn
// BEFORE the coil on purpose: over the top they would flatten the helix's
// waving outline, so only their shoulder knobs show.
export function platSpring({
  bodyColor = '#2f9e5c',
  accent = '#16522f',
  emblem = 'M',
  visorColor = '#fff3c4',
} = {}) {
  const turn = (cy, rx, cx) => [
    E(cx, cy, rx, 9.5, bodyColor, ink(3)),
    E(cx - rx * 0.3, cy - 3.2, rx * 0.44, 2.8, '#fff', { opacity: 0.26, nohalo: true }),
  ]
  const seam = (cy, rx) => E(60, cy, rx, 3.2, accent, ink(2.2))
  const strapL = strapPiece('41,35 52,39 49,88 40,88', 'M 46,44 L 44,82')
  const backdrop = [E(60, 134, 24, 3.6, '#000', { opacity: 0.14 })]
  const body = [
    strapL,
    mirror(strapL),

    sleeve('43,44 43,66 29,70 25,47', '44,45 44,56 30,60 27,48', bodyColor),
    heroGlove(22, 62, 10, accent, -15),
    sleeve('77,48 77,70 91,74 95,51', '76,49 76,60 90,64 93,52', bodyColor),
    heroGlove(98, 66, 10, accent, -165),

    denimLeg(44, 104, 14, 16, 4),
    denimLeg(62, 104, 14, 16, 4),
    heroBoot(43, 123, 14, 8.5),
    heroBoot(77, 123, 14, 8.5),

    R(53, 42, 14, 10, 3, accent, ink(2.6)),
    turn(50, 17, 57),
    turn(62, 20, 63),
    turn(74, 17, 57),
    seam(56, 18),
    seam(68, 19),

    bibPanel(33, 76, 54, 32, 10, 5),
    bigButton(30, 84, 8),
    mirror(bigButton(30, 84, 8)),

    C(60, 92, 17, visorColor, ink(3.4)),
    S('M 48,85 A 15,15 0 0 1 68,80', '#fff', 2.4, { opacity: 0.6, nohalo: true }),
    TEXT(60, 101, 27, accent, emblem),

    heroHead(60, 5, 11, 36, 40, 21, bodyColor, accent, visorColor),
  ]
  return sticker(backdrop, body)
}

// The block: the squarest silhouette in the family and the widest. The shirt is
// a crate — a framed box with plank courses down each side of the emblem — and
// the dungarees hang below it, so the boxy chest and the denim hips read as two
// stacked masses. Limbs stay stubby and boots wide: a boxy body on long legs
// read as a chimney. Straps go behind the crate for the same reason the
// spring's do: over the top they would break up the box.
export function platBlock({
  bodyColor = '#e08a1e',
  accent = '#7a3d0c',
  emblem = 'D',
  visorColor = '#fff3c4',
} = {}) {
  const course = (y) => [
    R(37, y, 46, 3.4, 0.8, accent, { opacity: 0.85, stroke: LINE, 'stroke-width': 1.4, nohalo: true }),
  ]
  const bracket = (x, y) => R(x, y, 9, 9, 2, '#000', { opacity: 0.22, stroke: LINE, 'stroke-width': 1.5, nohalo: true })
  const strapL = strapPiece('41,35 52,39 49,88 40,88', 'M 46,44 L 44,82')
  const backdrop = [E(60, 134, 40, 4, '#000', { opacity: 0.14 })]
  const sleeveL = sleeve('34,44 34,68 22,72 17,48', '35,45 35,57 23,61 19,49', bodyColor)
  const gloveL = heroGlove(20, 62, 10.5, accent, -12)
  const body = [
    strapL,
    mirror(strapL),

    sleeveL,
    gloveL,
    mirror(sleeveL),
    mirror(gloveL),

    denimLeg(35, 104, 19, 16, 5),
    denimLeg(66, 104, 19, 16, 5),
    heroBoot(39, 124, 16, 9),
    heroBoot(81, 124, 16, 9),

    R(31, 44, 58, 38, 8, accent, ink(3.2)),
    R(37, 50, 46, 26, 5, bodyColor, ink(2.2)),
    R(38, 51, 44, 7, 4, '#fff', { opacity: 0.2, nohalo: true }),
    course(59),
    course(68),
    R(58, 50, 3.4, 9, 0.8, accent, { opacity: 0.85, nohalo: true }),
    R(46, 62, 3.4, 6, 0.8, accent, { opacity: 0.85, nohalo: true }),
    R(71, 62, 3.4, 6, 0.8, accent, { opacity: 0.85, nohalo: true }),
    bracket(32, 45),
    bracket(79, 45),
    bracket(32, 72),
    bracket(79, 72),

    bibPanel(28, 78, 64, 32, 10, 5),
    bigButton(25, 86, 8),
    mirror(bigButton(25, 86, 8)),

    emblemPlate(44, 79, 32, 28, visorColor, accent, emblem, 24),

    heroHead(60, 5, 11, 36, 40, 21, bodyColor, accent, visorColor),
  ]
  return sticker(backdrop, body)
}

// The power-up form, chapter boss: deliberately the heaviest figure in the
// family, and the only one whose cap is winged. It carries one visible trace of
// each earlier hero — the jumper's gloves grown to their largest, the spring's
// coil turns as rings above the boots, the block's plank slabs as the bib's
// side panels — the same "trace, never louder than the combined form" rule the
// other families' bosses follow. The glow is a flat ray burst: the first v3
// pass used two big translucent discs behind the figure the way v2 did, and the
// white sticker halo painted straight over them, so the glow simply vanished.
// Rays reaching past the silhouette are the only kind of glow that survives the
// halo pass. Gradients and filters are banned family-wide.
export function platPowerup({
  bodyColor = '#c8342f',
  panelColor = '#fff6df',
  accent = '#f0b429',
  visorColor = '#ffe066',
} = {}) {
  const star = (cx, cy, r, fill, extra) => {
    const pts = []
    for (let i = 0; i < 10; i += 1) {
      const a = (Math.PI / 5) * i - Math.PI / 2
      const rr = i % 2 === 0 ? r : r * 0.44
      pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`)
    }
    return P(pts.join(' '), fill, extra)
  }
  const sparkle = (cx, cy, r) => [
    star(cx, cy, r, visorColor, { opacity: 0.85 }),
    C(cx, cy, r * 0.3, panelColor, { opacity: 0.9 }),
  ]
  // One broad wing with a serrated trailing edge. Smooth rounded lobes read as
  // rabbit ears, a single sharp wedge as a devil horn, and thin separate
  // feathers as insect antennae; a wide mass plus notches is the only version
  // that stayed a wing down to 66 px. Pulled inside x>=11 / y>=9 for the halo
  // margin — v2's wing started at 2,0 and was clipped.
  const wing = [
    P('40,25 12,9 17,19 11,18 19,25 12,27 21,31 40,31', accent, ink(2.8)),
    P('40,26 19,13 21,20 29,25 40,29', panelColor, { nohalo: true }),
  ]
  // Narrow: at v3's first width (15) the two panels plus the emblem plate
  // covered the bib edge to edge and the denim — half of the family's two-tone
  // — disappeared on the one figure that most needs to look like the others.
  const plankPanel = (x) => [
    R(x, 76, 11, 26, 2.5, accent, ink(2.4)),
    S(`M ${x + 1},${84} L ${x + 10},${84}`, LINE, 1.6, { opacity: 0.5, nohalo: true }),
    S(`M ${x + 1},${93} L ${x + 10},${93}`, LINE, 1.6, { opacity: 0.5, nohalo: true }),
  ]
  const coilRing = (cx, cy) => E(cx, cy, 12, 3.2, accent, ink(2.2))
  const strapL = strapPiece('39,33 51,38 48,86 38,86', 'M 45,43 L 43,80')
  // Rays reach as far as the frame allows in their own direction rather than
  // sharing one radius: at a fixed radius the diagonals stopped well short of
  // the corners, which is the only place a ray has room to be seen past the
  // silhouette at all.
  const ray = (deg, r0, r1, half, fill, op) => {
    const a = (deg * Math.PI) / 180
    const ca = Math.cos(a)
    const sa = Math.sin(a)
    const reach = Math.min(r1, 56 / (Math.abs(ca) || 1e-6), 58 / (Math.abs(sa) || 1e-6))
    const at = (d, k) => `${(60 + ca * d - sa * k).toFixed(1)},${(76 + sa * d + ca * k).toFixed(1)}`
    return P(`${at(r0, -half)} ${at(reach, 0)} ${at(r0, half)}`, fill, { opacity: op })
  }
  const backdrop = [
    E(60, 135, 46, 4.4, '#000', { opacity: 0.16 }),
    ...Array.from({ length: 16 }, (_, i) => ray(i * 22.5 + 11, 36, 78, 8, visorColor, 0.85)),
    ...Array.from({ length: 8 }, (_, i) => ray(i * 45 + 22.5, 36, 82, 4.5, panelColor, 0.9)),
    sparkle(14, 116, 6),
    sparkle(104, 116, 6),
    sparkle(11, 70, 4.4),
    sparkle(108, 76, 4.4),
  ]
  const sleeveL = sleeve('35,44 35,66 22,70 17,47', '36,45 36,57 23,61 19,48', bodyColor)
  const gloveL = heroGlove(20, 58, 11.5, bodyColor, -12)
  const body = [
    strapL,
    mirror(strapL),

    denimLeg(38, 98, 20, 20, 5),
    denimLeg(64, 98, 20, 20, 5),
    coilRing(48, 108),
    coilRing(72, 108),
    coilRing(48, 114),
    coilRing(72, 114),
    heroBoot(37, 123, 18, 9.5),
    heroBoot(83, 123, 18, 9.5),

    P('34,46 86,46 90,80 30,80', bodyColor, ink(3.4)),
    P('74,47 86,46 90,80 78,80', '#000', { opacity: 0.15, nohalo: true }),
    P('42,47 78,47 74,53 46,53', '#fff', { opacity: 0.22, nohalo: true }),

    bibPanel(24, 72, 72, 34, 12, 5),
    plankPanel(22),
    plankPanel(87),
    bigButton(20, 84, 8.5),
    mirror(bigButton(20, 84, 8.5)),

    sleeveL,
    gloveL,
    mirror(sleeveL),
    mirror(gloveL),

    emblemPlate(43, 74, 34, 30, panelColor, bodyColor, '★', 27),

    wing,
    mirror(wing),
    heroHead(60, 7, 14, 40, 42, 23, bodyColor, bodyColor, null, 1.08),
    // Sits in the same slot as the other three heroes' cap disc. Higher and
    // larger, its top point pushed through the dome's crown and left a stray
    // nub of ink and halo above the cap.
    star(60, 19, 6.6, accent, ink(2.2)),
    star(60, 19, 3, panelColor, { nohalo: true }),
  ]
  return sticker(backdrop, body)
}

// ---------------------------------------------------------------------------
// VILLAINS. Same inked-sticker rendering as the heroes, but tilted, lopsided
// and asymmetric where the heroes are upright and balanced — the family's
// hero/villain split. No cap, no emblem plate (the letters belong to the
// heroes), and because there is no brim they get real angled brows rather than
// the heroes' eyelid strokes. Each one's silhouette is its gameplay gimmick
// made literal, the way the chapter-2/3 villains worked. Villains take only
// { bodyColor, accent }.
// ---------------------------------------------------------------------------

// Fixed magnet colours — a horseshoe magnet reads as red/blue regardless of
// the character palette, the same way the robots' headlights stay chrome.
const MAGNET_RED = '#d1332f'
const MAGNET_BLUE = '#2f5fb0'

// Villain face: the heroes' big outlined eyes, but the eyelid stroke is
// replaced by a heavy brow angled down toward the nose, and the smile becomes
// a fanged mouth. `tilt` skews the brows further for the nastier ones.
function villainFaceParts(cx, cy, opts = {}) {
  const { s = 1, dx = 10.5, ex = 6.2, tilt = 1, mouthY = cy + 16, mouthW = 10, fangs = 2, mouth = true } = opts
  const ey = ex * 1.06
  const eye = (px, k) => [
    E(px, cy, ex * s, ey * s, '#fff', ink(2.2)),
    C(px + k * ex * 0.22 * s, cy + ey * 0.16 * s, ex * 0.56 * s, LINE, { nohalo: true }),
    C(px + k * ex * 0.22 * s - ex * 0.24 * s, cy - ey * 0.18 * s, ex * 0.2 * s, '#fff', { nohalo: true }),
  ]
  const brow = (px, k) =>
    S(
      `M ${px - k * ex * 1.5 * s},${cy - ey * (1.05 + 0.55 * tilt) * s} L ${px + k * ex * 1.15 * s},${cy - ey * 1.0 * s}`,
      LINE,
      4.4 * s,
      { nohalo: true }
    )
  const fang = (k) =>
    D(
      `M ${cx + k * mouthW * 0.42},${mouthY + 0.6} l ${mouthW * 0.2},0 l ${-mouthW * 0.1},${mouthW * 0.5} Z`,
      '#fff',
      { nohalo: true }
    )
  return [
    eye(cx - dx * s, -1),
    eye(cx + dx * s, 1),
    brow(cx - dx * s, 1),
    brow(cx + dx * s, -1),
    mouth
      ? [
          D(
            `M ${cx - mouthW},${mouthY} Q ${cx},${mouthY + 3} ${cx + mouthW},${mouthY}
             Q ${cx},${mouthY + 13} ${cx - mouthW},${mouthY} Z`,
            MOUTH,
            ink(2.4)
          ),
          fangs >= 1 ? fang(-1) : null,
          fangs >= 2 ? fang(1) : null,
        ]
      : null,
  ]
}

// Topsy (plat-flip): inverts the child's jump. The BODY is drawn as an ordinary
// standing figure and then flipped vertically — the same trick dinoUpside used
// — so the feet land at the top without hand-redrawing every part upside down.
// The FACE is painted outside that flip, upright, at the flipped head's
// position: a fully inverted face put the brows under the eyes and the mouth
// above them, which read as a rendering bug rather than a gag. Standing on its
// head while still looking straight at the child is the readable version.
// The chest chevron is authored pointing at the head (up, pre-flip); after the
// flip it points at the ground, reading as "down" regardless of body facing.
export function platFlip({ bodyColor = '#7a3fc9', accent = '#3f1f70' } = {}) {
  const FLIP = 138 // y' = FLIP - y
  const upright = [
    D('M 42,48 C 32,44 22,46 17,52 C 25,54 33,56 39,60 Z', accent, ink(2.6)),
    P('82,52 93,46 103,54 94,60', bodyColor, ink(2.8)),
    villainGlove(101, 62, 9.5, accent, 200),
    P('38,60 27,58 20,69 31,73', bodyColor, ink(2.8)),
    villainGlove(22, 77, 9, accent, -20),

    R(38, 48, 44, 42, 13, bodyColor, ink(3.2)),
    // Density pass: a hard shade plane cut on the torso's own right edge, a
    // belt, and banded socks. Upside down the bands land at the top of the
    // figure, where there is nothing else to look at.
    P('70,49 81,49 81,89 70,89', '#000', { opacity: 0.16, nohalo: true }),
    P('60,60 50,72 70,72', accent, ink(2.4)),
    R(39, 78, 42, 7, 2, accent, ink(2)),
    C(60, 81.5, 3.4, bodyColor, ink(1.8)),

    R(43, 86, 14, 18, 3, accent, ink(2.6)),
    R(63, 86, 14, 18, 3, accent, ink(2.6)),
    R(43, 90, 14, 3.4, 0, bodyColor, { nohalo: true }),
    R(43, 97, 14, 3.4, 0, bodyColor, { nohalo: true }),
    R(63, 90, 14, 3.4, 0, bodyColor, { nohalo: true }),
    R(63, 97, 14, 3.4, 0, bodyColor, { nohalo: true }),
    villainShoe(47, 110, 14, 8.5),
    villainShoe(74, 113, 15, 9),

    R(38, 8, 44, 44, 17, bodyColor, ink(3.2)),
    P('70,12 79,14 79,48 70,48', '#000', { opacity: 0.14, nohalo: true }),
  ]
  const backdrop = [E(63, 133, 24, 4, '#000', { opacity: 0.13 })]
  const body = [
    G('rotate(6 60 70)', [
      G(`translate(0,${FLIP}) scale(1,-1)`, upright),
      villainFaceParts(60, FLIP - 30, { tilt: 1.1, mouthW: 9 }),
    ]),
  ]
  return sticker(backdrop, body)
}

// Gloop (plat-slime): melts the floor so nothing can stop. No legs — the lower
// body dissolves into a puddle with drips, one arm droops further than the
// other so the melt reads as ongoing rather than a static shape, and a flat
// highlight (never a gradient) stands in for shine. The puddle is `nohalo` and
// painted at the head of the body list rather than as a backdrop: haloed, the
// spill gets ringed in white and stops reading as liquid, but behind the halo
// it was half-erased by the blob's own white rim.
export function platSlime({ bodyColor = '#4fb5c9', accent = '#1d6b78' } = {}) {
  const puddle = D(
    `M 12,120 C 27,114 35,124 50,118 C 66,112 76,122 91,116 C 104,111 110,118 110,122
     C 106,130 88,134 60,134 C 32,134 16,129 12,120 Z`,
    accent,
    { opacity: 0.65, stroke: LINE, 'stroke-width': 2.2, 'stroke-linejoin': 'round', nohalo: true }
  )
  // Inked noodle arm: the ink is a second, fatter stroke of the same path
  // underneath. v3's first pass left these two as bare strokes and they were
  // the only unoutlined masses on any figure in the file — they read as
  // detached green blobs behind the body.
  const arm = (d) => [
    S(d, LINE, 18.5, { 'stroke-linejoin': 'round' }),
    S(d, bodyColor, 13, { 'stroke-linejoin': 'round', nohalo: true }),
  ]
  const body = [
    puddle,
    G('rotate(-5 60 100)', [
      // Both arms start LOW on the flank and droop outward. Started high, they
      // curled beside the head and read as ears.
      arm('M 36,78 C 24,82 18,92 22,100 C 15,106 16,114 22,117'),
      arm('M 86,80 C 96,84 101,90 98,96 L 101,104'),

      D(
        `M 34,52 C 28,74 30,96 44,110 C 52,118 70,118 78,109
         C 90,96 90,72 82,52 C 68,42 48,42 34,52 Z`,
        bodyColor,
        ink(3.2)
      ),
      // Density pass. Against the toy family this figure was the sparsest
      // thing in either file — a plain blob with a face — so it gets a hard
      // shade plane cut on its own right edge, surface bubbles, and a run of
      // sag lines. Flat planes only; no gradients.
      D('M 74,54 C 84,74 84,96 74,108 C 86,98 90,74 82,52 Z', '#000', { opacity: 0.16, nohalo: true }),
      D('M 40,100 C 50,110 70,110 80,100 C 82,110 68,120 58,120 C 46,120 38,109 40,100 Z', '#fff', {
        opacity: 0.24,
        nohalo: true,
      }),
      C(43, 56, 4.6, '#fff', { opacity: 0.4, stroke: LINE, 'stroke-width': 1.6, nohalo: true }),
      C(72, 100, 3.6, '#fff', { opacity: 0.34, stroke: LINE, 'stroke-width': 1.5, nohalo: true }),
      C(48, 96, 2.8, '#fff', { opacity: 0.3, stroke: LINE, 'stroke-width': 1.4, nohalo: true }),
      S('M 36,60 C 33,72 34,84 39,94', LINE, 1.7, { opacity: 0.45, nohalo: true }),
      S('M 80,62 C 82,72 81,82 78,90', LINE, 1.7, { opacity: 0.45, nohalo: true }),
      D('M 44,104 C 40,114 41,124 47,127 C 53,124 53,111 49,103 Z', bodyColor, ink(2.6)),
      D('M 67,106 C 64,114 66,122 71,124 C 76,121 75,112 72,105 Z', bodyColor, ink(2.6)),

      villainFaceParts(58, 68, { dx: 13, ex: 7.2, tilt: 1.2, mouthY: 86, mouthW: 12.5, fangs: 2 }),
    ]),
  ]
  return sticker([], body)
}

// Snatchy (plat-magnetjack): stole the spring hero's horseshoe magnet and
// wears it slung on its back with the poles swapped — S sits in the
// traditionally-red slot and N in the traditionally-blue one. The magnet's
// weight is what tips the whole figure off balance.
export function platMagnetjack({ bodyColor = '#c9622f', accent = '#6b3013' } = {}) {
  const backdrop = [E(58, 132, 22, 4, '#000', { opacity: 0.13 })]
  const body = [
    G('rotate(-9 60 80)', [
      D(
        `M 78,44 C 78,31 87,22 98,22 C 109,22 114,31 114,42
         L 103,42 C 103,35 100,30 95,30 C 90,30 87,35 87,42 Z`,
        MAGNET_BLUE,
        ink(2.8)
      ),
      R(78, 42, 9, 16, 1.5, MAGNET_BLUE, ink(2.4)),
      R(103, 42, 11, 16, 1.5, MAGNET_RED, ink(2.4)),
      TEXT(82.5, 54, 10, '#fff', 'S'),
      TEXT(108.5, 54, 10, '#fff', 'N'),

      P('72,62 84,58 95,70 84,76', accent, ink(2.8)),
      villainGlove(92, 82, 9.5, accent, -125),
      P('40,60 29,58 20,72 31,78', accent, ink(2.8)),
      villainGlove(23, 84, 9.5, accent, -25),

      R(40, 52, 40, 42, 13, bodyColor, ink(3.2)),
      P('68,53 78,53 78,93 68,93', '#000', { opacity: 0.16, nohalo: true }),
      R(41, 66, 38, 6, 1.5, accent, { stroke: LINE, 'stroke-width': 1.6, nohalo: true }),
      // Density pass: a plate riveted over the chest and a strap for the
      // magnet, so the flank is not one bare colour field.
      R(46, 74, 28, 16, 2.5, accent, ink(2.2)),
      C(50, 78, 1.7, bodyColor, { nohalo: true }),
      C(70, 78, 1.7, bodyColor, { nohalo: true }),
      C(50, 86, 1.7, bodyColor, { nohalo: true }),
      C(70, 86, 1.7, bodyColor, { nohalo: true }),
      S('M 44,58 L 76,52', accent, 4.4, { nohalo: true }),

      R(45, 92, 13, 18, 3, accent, ink(2.6)),
      R(63, 92, 13, 18, 3, accent, ink(2.6)),
      villainShoe(39, 114, 14, 8.5),
      villainShoe(72, 118, 15, 9),

      R(38, 12, 44, 42, 17, bodyColor, ink(3.2)),
      R(58, 3, 4, 10, 1.5, accent, ink(2)),
      C(60, 9, 4.4, accent, ink(2.2)),
      villainFaceParts(60, 34, { tilt: 1 }),
    ]),
  ]
  return sticker(backdrop, body)
}

// Blocko (plat-brick): plugs the tunnels shut. The torso is a cork stopper —
// wide at the shoulders, tapering to a narrow foot, so the body silhouette
// itself reads as a plug — with a plank patch for a hole it has already sealed
// and a brick in each hand, one arm loaded with a heavier stack than the other
// for the villain tilt. An early draft put the face on the cork's narrow tip
// with no separate head and no feet, which floated eyes at ankle height; the
// head now sits on top of the cork like any other figure in the family, and
// two shoe stubs anchor the tapered tip to the ground.
export function platBrick({ bodyColor = '#a8763a', accent = '#5c3d18' } = {}) {
  const brick = (x, y, w, h) => [
    R(x, y, w, h, 1.5, '#b34a30', ink(2.4)),
    S(`M ${x + 1},${y + h * 0.52} L ${x + w - 1},${y + h * 0.52}`, LINE, 1.8, { opacity: 0.7, nohalo: true }),
    S(`M ${x + w * 0.5},${y + 1} L ${x + w * 0.5},${y + h * 0.5}`, LINE, 1.8, { opacity: 0.7, nohalo: true }),
    S(`M ${x + w * 0.26},${y + h * 0.56} L ${x + w * 0.26},${y + h - 1}`, LINE, 1.8, { opacity: 0.7, nohalo: true }),
    S(`M ${x + w * 0.74},${y + h * 0.56} L ${x + w * 0.74},${y + h - 1}`, LINE, 1.8, { opacity: 0.7, nohalo: true }),
  ]
  const backdrop = [E(58, 134, 24, 4.2, '#000', { opacity: 0.13 })]
  const body = [
    G('rotate(6 60 90)', [
      P('32,68 21,64 12,78 23,84', bodyColor, ink(2.8)),
      brick(8, 86, 25, 15),
      brick(11, 72, 21, 13),

      P('88,70 99,66 106,78 95,84', bodyColor, ink(2.8)),
      brick(88, 86, 23, 14),

      P('32,58 88,58 78,108 42,108', bodyColor, ink(3.2)),
      P('35,66 85,66 79,72 39,72', accent, { stroke: LINE, 'stroke-width': 1.6, nohalo: true }),
      P('38,86 82,86 78,92 42,92', accent, { stroke: LINE, 'stroke-width': 1.6, nohalo: true }),

      R(46, 66, 16, 16, 2, accent, ink(2.4)),
      S('M 48,72 L 60,68 M 48,79 L 60,75', bodyColor, 2.6, { nohalo: true }),

      R(45, 104, 11, 14, 2.5, accent, ink(2.4)),
      R(64, 104, 11, 14, 2.5, accent, ink(2.4)),
      villainShoe(45, 121, 13, 8.5),
      villainShoe(76, 121, 13, 8.5),

      R(34, 14, 52, 46, 19, bodyColor, ink(3.2)),
      C(60, 10, 5, accent, ink(2.2)),
      villainFaceParts(60, 37, { dx: 11.5, ex: 6.6, tilt: 0.9, mouthY: 54, mouthW: 11 }),
    ]),
  ]
  return sticker(backdrop, body)
}

// Bug King (plat-glitch), the chapter boss: deliberately the biggest and
// heaviest figure in the family. Its jaw is a dark void wide enough to pull a
// checkerboard block halfway in, and it is shedding itself along one flank —
// small squares at scattered sizes and opacities, never more than two in a
// row, so the erosion cannot settle into a straight edge or corner that would
// read as a letterform. The debris squares are backdrop parts: haloed, they
// would turn into a row of white-framed tiles and stop reading as decay.
export function platGlitch({ bodyColor = '#3d3d46', accent = '#7d5fe0' } = {}) {
  const bit = (x, y, s, fill, op) => R(x, y, s, s, 0, fill, { opacity: op })
  const horn = (points) => P(points, accent, ink(2.6))
  const backdrop = [
    E(60, 135, 44, 5, '#000', { opacity: 0.17 }),
    bit(7, 74, 6, accent, 0.5),
    bit(16, 92, 4, bodyColor, 0.6),
    bit(6, 100, 5, accent, 0.7),
    bit(21, 110, 7, bodyColor, 0.5),
    bit(96, 40, 5, accent, 0.55),
    bit(105, 56, 4, bodyColor, 0.7),
    bit(100, 100, 6, accent, 0.4),
    bit(89, 118, 4, bodyColor, 0.65),
  ]
  const body = [
    G('rotate(-4 60 78)', [
      P('30,80 15,68 9,84 23,92', bodyColor, ink(3)),
      villainGlove(13, 97, 13, accent, -35),
      P('92,70 106,56 111,73 96,84', bodyColor, ink(3)),
      villainGlove(102, 89, 13, accent, -140),

      R(48, 96, 15, 22, 3, accent, ink(2.8)),
      R(69, 96, 15, 22, 3, accent, ink(2.8)),
      villainShoe(47, 125, 17, 9),
      villainShoe(81, 125, 17, 9),

      R(28, 52, 62, 50, 16, bodyColor, ink(3.4)),

      // The void in the belly IS this one's mouth — so the head carries eyes
      // and brows only. Giving the head its own mouth as well (v3's first pass)
      // produced a figure with two mouths and neither read.
      E(58, 86, 25, 16, SOLE, ink(3)),
      R(41, 78, 12, 12, 0, bodyColor, { nohalo: true }),
      R(53, 78, 12, 12, 0, accent, { nohalo: true }),
      R(41, 90, 12, 12, 0, accent, { nohalo: true }),
      R(53, 90, 12, 12, 0, bodyColor, { nohalo: true }),
      R(41, 78, 24, 24, 0, 'none', { stroke: LINE, 'stroke-width': 2.4, nohalo: true }),
      // Fangs at the maw's rim, as triangles rather than the chevron strokes a
      // first pass used — a '<' next to a '>' is exactly the accidental glyph
      // this app has been bitten by before.
      P('35,78 41,78 38,86', '#fff', { nohalo: true }),
      P('75,78 81,78 78,86', '#fff', { nohalo: true }),

      horn('31,22 23,8 41,17'),
      horn('86,20 96,6 100,22'),
      R(26, 16, 58, 46, 20, bodyColor, ink(3.4)),
      villainFaceParts(58, 38, { dx: 13, ex: 7.2, tilt: 1.3, mouth: false }),
    ]),
  ]
  return sticker(backdrop, body)
}
