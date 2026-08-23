// "Living toy" art (chapter 6) -- INKED CARTOON family.
//
// This file is the reference implementation of the app's first LINE-ART
// drawing language. The other four families (robots.js, dinosaurs.js,
// platformer.js, creatures.js) are all *fill-only*: colour areas butt
// against each other with no outline, so however much detail gets piled on,
// the silhouette keeps reading soft and round. Chapter 6 breaks out of that
// by changing the drawing grammar itself, not the amount of detail.
//
// The previous pass on this cast (fill-only, "spend more shapes") failed
// review for exactly that reason -- more detail on round shapes is still
// round -- and the astronaut boss did not read as an astronaut at all. This
// pass changes the drawing language instead, and is the pattern to copy for
// any future family that wants a cartoon/manga look.
//
// FOLLOW-UP PASS (minifigure-reference review). The user supplied a
// Toy-Story minifigure render sheet and asked this family to be revisited.
// Checked at the sizes that actually ship (66/96/132/250 px in
// public/_art.html) plus a hard silhouette pass: the inked-cartoon grammar
// above already carries Leo/Fifi/Bobo/Captain Big's genre reads well in
// COLOUR at every render size -- this was verified, not assumed, and is why
// the grammar itself (ink outlines, angular construction) was kept rather
// than rewritten into the reference's flat vinyl-block look. The one
// concrete gap the silhouette pass found: Bobo's third eye is a flat colour
// disc sitting flush inside the head outline, so it carries zero silhouette
// weight and vanishes under a hard cutout even though it reads fine in
// colour -- fixed by giving it a real domed housing that pokes past the
// cranium's flat top edge. Leo's shirt already had a check pattern but it
// was faint at 96 px, and his buckle was a token square, so both got made
// bigger and bolder (CLAUDE.md explicitly permits growing prop detail this
// way). Fifi's four legs were plain paws with no prop distinguishing the
// pair nearer the coil from the pair nearer the head, so the coil-side pair
// got wind-up-toy wheels -- a generic pull-toy trait, not any specific
// character's design, and matched to the coil's own STEEL/STEEL_DK so the
// new prop reads as the same hardware. Captain Big was left untouched: of
// the four heroes it already matches the reference sheet's identification
// marks most closely (clear dome over a fully visible face, tri-colour hard
// panels, a chest button row) and no gap was found worth the risk of
// touching the file's most finished figure.
//
// DESIGN GRAMMAR -- inked cartoon. All nine figures follow all of it.
//
//  1. EVERY MAJOR SHAPE IS OUTLINED IN INK. `ol(w)` puts
//     stroke=INK stroke-width=2.4..4 on the shape. Big masses (torso, head,
//     helmet, cape) take 3.2-4; limbs and props take 2.6-3; interior
//     panel-division lines take 1.8-2.4. Nothing structural is left
//     outline-less. This single rule is what separates "cartoon" from the
//     sibling families' "colour field", and it is why detail added here
//     reads as drawing instead of as noise.
//  2. ANGULAR CONSTRUCTION, `polygon`/straight `path` FIRST. Heads are
//     jawed hexagons, never circles: a flat cranium, cheek corners, a
//     tapered chin. Torsos are trapezoids, limbs are tapered quads with a
//     visible elbow/knee kink. Circles/ellipses are reserved for things
//     that really are round in the toy: buttons, joint rings, spring coils,
//     lenses, the helmet dome.
//  3. EXPLICIT CARTOON FACE, built from four separate marks: (a) a thick
//     tapered ink brow whose ANGLE carries the mood -- heroes tilt the
//     inner end up, villains tilt it down; (b) an outlined white sclera
//     with a big ink pupil and a square catch-light; (c) a nose drawn as a
//     line/wedge, never left out; (d) a stroked mouth with corner ticks.
//     Faces are drawn at cartoon scale (an eye is ~10% of body height), so
//     they still carry expression at 66 px.
//  4. SHADING BY OVERLAID FLAT PANELS, cut on the ink lines. A shade
//     polygon follows the same edge geometry as the shape under it so the
//     shadow has a hard cartoon edge (`shadeP`/`litP`). SVG gradients and
//     filters stay banned app-wide; `stroke` is not -- it is the point of
//     this family.
//  5. GENRE PROPS OVER TOY MATERIAL. Each figure is read by its costume,
//     not by what it is made of: Leo = hat brim + bandana + plaid + buckle
//     + spurs; Fifi = metal coil barrel + long low stance + floppy ear;
//     Bobo = three outlined eyes on an oversized angular head; Captain Big
//     = clear dome helmet with the face fully visible inside, tri-colour
//     hard panels, a chest button row, joint lock rings, black waist
//     bellows. Villains get the same grammar with the brow angle, stance
//     tilt and tooth shapes flipped hostile.
//  6. THE EMBLEM IS CURRICULUM CONTENT. The letter always sits on a bright
//     plate that is itself ink-outlined (the outline is what makes it pop
//     out of a busy inked figure), and no plaid line, panel seam or coil
//     crosses it.
//
// Colour ownership: genre-critical colours are FIXED CONSTANTS here (hat
// leather, denim, coil steel, the astronaut's green/white panels, the
// bandana), because they are part of recognising the genre and must not be
// re-tinted by a chapter palette. `bodyColor`/`accent`/`panelColor`/
// `visorColor` tint the parts that are free to vary.
//
// No real toyline's specific face, outfit, logo or colour layout is
// reproduced -- only the generic genre props.
//
// This file must not import ../art.js (circular); it carries its own svgWrap.

function svgWrap(inner, viewBox = '0 0 120 140') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

const INK = '#2a2438' // the one ink colour every outline in this file uses
const WHITE = '#fdfaf2' // paper white: sclera, suit panels, emblem plates
const FACE = '#f0c193' // painted skin
const DARK = '#2f2a24' // unpainted dark parts: bellows, boot soles, cavities
const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// The whole family's outline attribute set. `w` is the ink weight tier:
// 3.2-4 structural mass, 2.6-3 limbs/props, 1.8-2.4 interior seams.
const ol = (w = 3) => `stroke="${INK}" stroke-width="${w}" stroke-linejoin="round" stroke-linecap="round"`

// Hard-edged cartoon shading: a second flat polygon cut along the same edge
// geometry as the shape beneath it. Never a gradient, never a blur.
const shadeP = (points, op = 0.17) => `<polygon points="${points}" fill="#000" opacity="${op}" stroke="none"/>`
const litP = (points, op = 0.22) => `<polygon points="${points}" fill="#fff" opacity="${op}" stroke="none"/>`

// cy 136 -> 134.8: at 136 the 4.6-unit ellipse ran to y=140.6, so EVERY
// figure in this file carried a 0.6-unit bottom clip from its own ground
// shadow. Measured by padded-viewBox alpha scan, invisible at any render size
// and still a clip.
const shadow = (cx, w) => `<ellipse cx="${cx}" cy="134.8" rx="${w}" ry="4.6" fill="#000" opacity="0.14" stroke="none"/>`

// Cartoon eye: outlined sclera + oversized ink pupil + square catch-light.
// `look` shifts the pupil (-1 left .. +1 right) so a pair of eyes can aim.
function eye(cx, cy, r, look = 0) {
  const px = cx + look * r * 0.3
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.1}" fill="${WHITE}" ${ol(2.3)}/>
    <circle cx="${px}" cy="${cy + r * 0.14}" r="${r * 0.55}" fill="${INK}" stroke="none"/>
    <rect x="${px - r * 0.46}" y="${cy - r * 0.42}" width="${r * 0.32}" height="${r * 0.32}" fill="#fff" stroke="none"/>`
}

// A squeezed-shut squint eye: one bold curved lash line. Used on villains
// (paired with a wide eye for asymmetry) and on Fifi's far side.
function squint(cx, cy, w, flip = 1) {
  return `<path d="M ${cx - w},${cy + 2} Q ${cx},${cy - w * 0.7 * flip} ${cx + w},${cy + 2}"
    fill="none" ${ol(3)}/>`
}

// Thick tapered ink brow. `tilt` is the whole mood control: negative on the
// inner end reads friendly/keen, positive reads angry. Drawn as a wedge so
// the taper is visible at 132 px.
function brow(cx, cy, len, tilt, thick = 5) {
  const h = len / 2
  const pts = `${-h},${-thick * 0.3} ${h},${-thick * 0.62} ${h},${thick * 0.38} ${-h},${thick * 0.7}`
  return `<polygon points="${pts}" transform="translate(${cx},${cy}) rotate(${tilt})" fill="${INK}" stroke="none"/>`
}

// Open cartoon grin with corner ticks -- the ticks are what make an inked
// mouth read as a smile rather than a scratch.
function grin(cx, cy, w) {
  return `
    <path d="M ${cx - w},${cy} Q ${cx},${cy + w * 0.85} ${cx + w},${cy}" fill="none" ${ol(3)}/>
    <path d="M ${cx - w},${cy} L ${cx - w - 2.4},${cy - 2.6}" ${ol(2.4)}/>
    <path d="M ${cx + w},${cy} L ${cx + w + 2.4},${cy - 2.6}" ${ol(2.4)}/>`
}

// Villain mouth: a jagged band of teeth inside an outlined snarl.
function snarl(cx, cy, w, h) {
  const x0 = cx - w
  const step = (w * 2) / 5
  const teeth = []
  for (let i = 0; i < 5; i += 1) {
    const x = x0 + step * i
    teeth.push(`${x},${cy - h / 2} ${x + step / 2},${cy + h * 0.1} `)
  }
  return `
    <path d="M ${x0},${cy - h / 2} L ${cx + w},${cy - h / 2} L ${cx + w * 0.75},${cy + h / 2} L ${x0 + w * 0.25},${cy + h / 2} Z"
      fill="${DARK}" ${ol(2.6)}/>
    <polygon points="${teeth.join('')} ${cx + w},${cy - h / 2}" fill="${WHITE}" stroke="none"/>`
}

// Wedge nose: two strokes, the family's "the face is drawn, not assembled"
// tell. Every hero and villain has one.
function nose(cx, cy, w, h) {
  return `<path d="M ${cx - w * 0.2},${cy - h} L ${cx + w * 0.5},${cy} L ${cx - w},${cy + 1.2}" fill="none" ${ol(2.4)}/>`
}

// An inked stroke: the ink line is drawn wide underneath and the colour
// stroke narrower on top, which is how a *line* (tail, string, cable) gets
// the same outline every filled shape in this file has.
function inkedLine(d, color, w) {
  return `
    <path d="${d}" fill="none" stroke="${INK}" stroke-width="${w + 5}" stroke-linecap="round"/>
    <path d="${d}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>`
}

// Ten-point sheriff/space star, shared so every star in the file is one shape.
function starPoints(cx, cy, outerR, innerR) {
  const pts = []
  for (let i = 0; i < 10; i += 1) {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 === 0 ? outerR : innerR
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`)
  }
  return pts.join(' ')
}

// A joint lock ring: the outlined collar that wraps a limb where two moulded
// parts meet. Captain Big wears six of them; the villains borrow it too.
function lockRing(cx, cy, rx, ry, color) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}" ${ol(2.6)}/>
    <ellipse cx="${cx}" cy="${cy - ry * 0.25}" rx="${rx * 0.55}" ry="${ry * 0.3}" fill="#fff" opacity="0.35" stroke="none"/>`
}

// ---------------------------------------------------------------------------
// EMBLEM PLATE SIZING. Same rule as art/robots.js, art/dinosaurs.js,
// art/platformer.js, art.js `superheroPlate` and art/dc.js `emblemPlate`.
// Five of the seven families could not fit a TWO-GLYPH label and Jolly
// phonics groups 5-7 are entirely digraphs, so chapter 8 had to put a `★` on
// four heroes' chests instead of IE/EE/OR.
//
// TWO LIMITS, THE TIGHTER ONE WINS, so a narrow chest yields a SMALLER glyph
// instead of one that leaves its plate. Em factors measured off this
// project's rendered font at weight 800 (public/_emb4.html): advance 0.85 em
// for one capital (M worst case), 1.43 for two (OA/OR), 0.91 for the star;
// inked height 0.75 em for a capital and 0.88 for the star, which is why a
// non-letter label needs its own size step -- the `★` on this family's boss
// was leaving its plate for exactly that reason.
const PLATE_PAD = 1.6

function plateType(label, clearW, clearH) {
  const text = String(label)
  const star = !/^[A-Za-z0-9]+$/.test(text)
  const advance = star ? 0.91 : text.length > 1 ? 1.43 : 0.85
  const inkEm = star ? 0.88 : 0.75
  const size = Math.min(
    (clearW - PLATE_PAD * 2) / advance,
    (clearH - PLATE_PAD * 2) / inkEm
  )
  return { text, size, base: size * (star ? 0.4 : 0.36) }
}

// Ink-outlined bright letter plate (grammar rule 6). Always a bolted panel
// now: the 'disc' variant is gone because a round plate is the wrong
// container for a two-glyph label, and that is measured -- a disc loses
// 39-40% of the glyph height from `S` to `OA` where a panel loses 8-23%,
// since a round plate is only full width for one row and a glyph needs its
// whole cap height at full width. Leo's sheriff star and Fifi's collar carry
// the "badge" read instead, which is where it belonged anyway.
// The glyph is sized off what is left INSIDE the 2.8-unit ink outline.
function letterPlate(cx, cy, w, h, plateColor, textColor, label) {
  const t = plateType(label, w - 2.8, h - 2.8)
  return `
    <rect x="${(cx - w / 2).toFixed(1)}" y="${(cy - h / 2).toFixed(1)}" width="${w.toFixed(1)}"
      height="${h.toFixed(1)}" rx="3" fill="${plateColor}" ${ol(2.8)}/>
    <text x="${cx}" y="${(cy + t.base).toFixed(1)}" text-anchor="middle" font-family="${FONT}"
      font-size="${t.size.toFixed(1)}" font-weight="800" fill="${textColor}" stroke="none">${t.text}</text>`
}

// ---------------------------------------------------------------------------
// HEROES
// ---------------------------------------------------------------------------

// Leo (L): cowboy. Six western props stacked on one inked figure -- curled
// wide-brim hat, knotted bandana, woven plaid shirt, oversized buckle,
// pointed boots with spur wheels, sheriff star -- and the manga-cut face the
// reference sheet asked for: heavy angled brows, jawed hexagonal head, a
// drawn nose and an open grin.
export function toyLeo({
  bodyColor = '#4f9463',
  accent = '#f0c33e',
  emblem = 'L',
  visorColor = '#fff6da',
} = {}) {
  const HAT = '#9a6438'
  const HAT_DK = '#754a27'
  const JEAN = '#4a6d9c'
  const CREAM = '#f6e9c6'
  const BANDANA = '#3f7fbf'

  // Boot: shaft + kicked-out pointed toe + heel block + spur wheel, all
  // straight edges (grammar rule 2). `dir` mirrors the toe direction.
  const boot = (cx, y, dir) => `
    <g transform="translate(${cx},${y})">
      <polygon points="-9,-16 9,-16 11,0 ${dir * 21},3 ${dir * 20},10 -9,8" fill="${HAT}" ${ol(3)}/>
      <polygon points="-9,8 ${dir * 20},10 ${dir * 18},13 -8,11" fill="${DARK}" ${ol(2.4)}/>
      ${litP(`-7,-14 -3,-14 -3,2 -7,1`, 0.2)}
      <circle cx="${dir * -14}" cy="5" r="4.6" fill="${CREAM}" ${ol(2.4)}/>
      <path d="M ${dir * -14},0.4 L ${dir * -14},9.6 M ${dir * -18.6},5 L ${dir * -9.4},5" ${ol(1.8)}/>
    </g>`

  // Angular mitten glove with a thumb wedge -- `dir` points the thumb inboard.
  const glove = (x, y, dir) => `
    <polygon points="${x},${y} ${x + dir * 14},${y + 4} ${x + dir * 12},${y + 16} ${x + dir * 2},${y + 19} ${x - dir * 5},${y + 12}"
      fill="${FACE}" ${ol(3)}/>
    <polygon points="${x - dir * 4},${y + 4} ${x - dir * 11},${y + 7} ${x - dir * 9},${y + 13} ${x - dir * 3},${y + 11}"
      fill="${FACE}" ${ol(2.6)}/>`

  return svgWrap(
    `
    <g>
      ${shadow(60, 30)}

      ${boot(45, 125.4, -1)}
      ${boot(75, 125.4, 1)}
      <polygon points="38,98 53,98 52,122 39,122" fill="${JEAN}" ${ol(3)}/>
      <polygon points="67,98 82,98 81,122 68,122" fill="${JEAN}" ${ol(3)}/>
      ${shadeP('48,98 53,98 52,122 47,122', 0.16)}
      ${shadeP('77,98 82,98 81,122 76,122', 0.16)}

      <polygon points="34,74 24,76 12,98 24,104 37,84" fill="${bodyColor}" ${ol(3)}/>
      ${shadeP('24,101 37,84 34,80 21,99', 0.14)}
      <polygon points="12,96 26,102 23,110 9,104" fill="${CREAM}" ${ol(2.6)}/>
      ${glove(16, 104, -1)}
      <polygon points="86,74 96,76 108,98 96,104 83,84" fill="${bodyColor}" ${ol(3)}/>
      ${shadeP('96,101 83,84 86,80 99,99', 0.14)}
      <polygon points="108,96 94,102 97,110 111,104" fill="${CREAM}" ${ol(2.6)}/>
      ${glove(104, 104, 1)}

      <polygon points="34,70 86,70 89,104 31,104" fill="${bodyColor}" ${ol(3.4)}/>
      ${/* Check pattern boosted from 3v+3h at width 2.8/opacity 0.9 to 4v+3h
            at width 3.2/opacity 0.95 -- measured against the reference sheet's
            "체크 셔츠" the old grid read as a faint stripe at 96px, not a
            check. Denser lines plus the added ink cross-lines are what turns
            it into a plaid a 5-year-old can name at chapter-card size. */ ''}
      <g>
        <path d="M 40,70 L 40,104" stroke="${CREAM}" stroke-width="3.2" opacity="0.95"/>
        <path d="M 53,70 L 53,104" stroke="${INK}" stroke-width="1.8" opacity="0.32"/>
        <path d="M 67,70 L 67,104" stroke="${CREAM}" stroke-width="3.2" opacity="0.95"/>
        <path d="M 80,70 L 80,104" stroke="${INK}" stroke-width="1.8" opacity="0.32"/>
        <path d="M 32,77 L 88,77" stroke="${CREAM}" stroke-width="3.2" opacity="0.95"/>
        <path d="M 32,87 L 88,87" stroke="${INK}" stroke-width="1.8" opacity="0.32"/>
        <path d="M 31,97 L 89,97" stroke="${CREAM}" stroke-width="3.2" opacity="0.95"/>
      </g>
      ${shadeP('76,70 86,70 89,104 78,104', 0.15)}
      <path d="M 34,70 L 86,70" ${ol(3.4)}/>

      <polygon points="30,102 90,102 90,112 30,112" fill="${DARK}" ${ol(3)}/>
      ${/* Rodeo buckle: was a 20x16 token square. An oval bevel plus two
            rivets is a bigger, simpler colour-block prop that reads as a
            buckle rather than a badge placeholder, and doesn't compete with
            the sheriff star (which lives on the hat crown, not the chest --
            see the note below at the letterPlate call). */ ''}
      <ellipse cx="60" cy="107" rx="13" ry="9.5" fill="${accent}" ${ol(3)}/>
      ${litP('50,101 68,101 65,105 53,105', 0.3)}
      <ellipse cx="60" cy="107" rx="6.5" ry="4.6" fill="none" ${ol(2)}/>
      <circle cx="51" cy="107" r="1.7" fill="${HAT_DK}" stroke="none"/>
      <circle cx="69" cy="107" r="1.7" fill="${HAT_DK}" stroke="none"/>

      <polygon points="38,64 82,64 60,88" fill="${BANDANA}" ${ol(3.2)}/>
      ${shadeP('66,64 82,64 60,88 62,78', 0.16)}
      <polygon points="50,62 70,62 72,70 48,70" fill="${BANDANA}" ${ol(2.8)}/>

      ${/* THE SHERIFF STAR MOVED TO THE HAT (see the crown, below), and this
            is the one place in this round where a family prop had to be
            relocated rather than resized. A nameplate wide enough for a
            digraph is 34 units across; the star at its old 17 spanned exactly
            34, so ANY digraph-capable plate hides it. Growing the star to 22
            was tried and rendered: the badge became a cream panel with four
            gold wedges beside it, which is not a star at any size. A star on
            the crown of the hat is the other place a sheriff wears one, it
            sits on solid brown instead of competing with the letter, and it
            is more visible than the chest badge ever was at 96 px. Six
            western props, still six. */ ''}
      ${letterPlate(60, 88, 34, 21, visorColor, HAT_DK, emblem)}

      <polygon points="45,28 75,28 79,48 73,66 60,74 47,66 41,48" fill="${FACE}" ${ol(3.4)}/>
      ${shadeP('70,32 79,48 73,66 66,70 73,48 66,30', 0.12)}
      <polygon points="46,24 74,24 80,30 40,30" fill="${HAT_DK}" ${ol(3)}/>
      <polygon points="44,26 43,8 52,2 60,8 68,2 77,8 76,26" fill="${HAT}" ${ol(3.4)}/>
      ${litP('47,24 46,10 52,6 54,8 50,12 51,24', 0.24)}
      <polygon points="${starPoints(60, 16, 8, 3.6)}" fill="${accent}" ${ol(2.4)}/>
      ${shadeP('70,24 71,10 77,9 76,26', 0.16)}
      <path d="M 8,28 C 16,18 34,26 44,24 L 76,24 C 86,26 104,18 112,28
               C 98,38 76,40 60,40 C 44,40 22,38 8,28 Z" fill="${HAT}" ${ol(3.4)}/>
      ${shadeP('10,30 44,37 76,37 110,30 112,28 98,38 60,40 22,38', 0.2)}
      ${litP('14,27 44,32 76,32 106,27 102,29 76,34 44,34 18,29', 0.3)}

      ${brow(50, 46, 14, -13)}
      ${brow(71, 46, 14, 13)}
      ${eye(51, 55, 6, 0.2)}
      ${eye(70, 55, 6, 0.2)}
      ${nose(60, 60, 4.5, 4.5)}
      ${grin(60, 65, 7.5)}
      <path d="M 44,60 Q 42,62 44,65" ${ol(2)}/>
      <path d="M 76,60 Q 78,62 76,65" ${ol(2)}/>
    </g>
  `
  )
}

// Fifi (F): coil-spring dog, drawn side-on (the only pose where a coil reads
// as long instead of collapsing into a stack of rings). The barrel is six
// separately outlined steel turns -- inking each turn is what turns the coil
// from a striped tube into visible hardware. Angular muzzle with a black
// nose block, one long floppy ear down the cheek, one heavy brow.
export function toyFifi({
  bodyColor = '#d9974f',
  accent = '#8a5426',
  emblem = 'F',
  visorColor = '#fff6da',
} = {}) {
  const STEEL = '#c3ccd6'
  const STEEL_DK = '#8e9aa8'

  const turns = [50, 59, 68, 77, 86, 95]
  const coil = turns
    .map((x, i) => {
      const cy = i % 2 === 0 ? 84 : 87
      return `
        <ellipse cx="${x}" cy="${cy}" rx="7.6" ry="17" fill="${STEEL}" ${ol(2.6)}/>
        <path d="M ${x - 3.4},${cy - 12} Q ${x - 6.6},${cy} ${x - 3.4},${cy + 12}"
          fill="none" stroke="#fff" stroke-width="2.2" opacity="0.75"/>
        <path d="M ${x + 4},${cy - 10} Q ${x + 6.6},${cy} ${x + 4},${cy + 10}"
          fill="none" stroke="${STEEL_DK}" stroke-width="2.4" opacity="0.9"/>`
    })
    .join('')

  // Straight-cut dog leg: thigh quad + a paw block, then either three toe
  // ticks (front pair) or a wind-up-toy wheel (rear pair, `wheel = true`).
  // Real Slinky-style pull toys roll on the back pair only -- giving both
  // pairs the same paw made the four legs interchangeable filler instead of
  // a prop that identifies the toy, which is exactly the reference sheet's
  // complaint. The wheel's hub uses the coil's own STEEL/STEEL_DK so it
  // reads as the same wind-up hardware, not a mismatched new material.
  const leg = (x, top, w, wheel = false) => `
    <polygon points="${x},${top} ${x + w},${top} ${x + w + 2},${top + 24} ${x - 2},${top + 24}" fill="${bodyColor}" ${ol(3)}/>
    ${shadeP(`${x + w * 0.6},${top} ${x + w},${top} ${x + w + 2},${top + 24} ${x + w * 0.6},${top + 24}`, 0.14)}
    <polygon points="${x - 6},${top + 22} ${x + w + 6},${top + 22} ${x + w + 7},${top + 31} ${x - 7},${top + 31}"
      fill="${accent}" ${ol(3)}/>
    ${wheel
      ? `<circle cx="${x + w / 2}" cy="${top + 32}" r="6" fill="${STEEL}" ${ol(2.6)}/>
         <circle cx="${x + w / 2}" cy="${top + 32}" r="2.1" fill="${STEEL_DK}" stroke="none"/>
         <path d="M ${x + w / 2},${top + 27} L ${x + w / 2},${top + 37} M ${x + w / 2 - 5},${top + 32} L ${x + w / 2 + 5},${top + 32}"
           stroke="${STEEL_DK}" stroke-width="1.4"/>`
      : `<path d="M ${x - 2},${top + 31} L ${x - 2},${top + 35} M ${x + w / 2},${top + 32} L ${x + w / 2},${top + 36}
             M ${x + w + 2},${top + 31} L ${x + w + 2},${top + 35}" ${ol(2)}/>`}`

  return svgWrap(
    `
    <g>
      ${shadow(64, 50)}

      ${inkedLine('M 100,72 C 112,62 114,72 109,54', bodyColor, 9)}
      <circle cx="109" cy="53" r="4.6" fill="${accent}" ${ol(2.4)}/>

      ${leg(44, 96, 10)}
      ${leg(84, 96, 10, true)}
      ${coil}

      <polygon points="92,64 110,70 112,104 94,102" fill="${bodyColor}" ${ol(3.4)}/>
      ${shadeP('104,67 110,70 112,104 105,103', 0.15)}
      ${leg(60, 100, 11)}
      ${leg(96, 100, 11, true)}

      <polygon points="21,58 51,52 55,102 23,104" fill="${bodyColor}" ${ol(3.4)}/>
      ${litP('23,60 33,58 35,102 25,103', 0.2)}

      <polygon points="14,30 42,26 50,46 46,64 26,70 10,54" fill="${bodyColor}" ${ol(3.6)}/>
      ${shadeP('36,28 50,46 46,64 38,67 44,46 32,28', 0.12)}
      <polygon points="2,46 22,42 24,62 4,64" fill="${bodyColor}" ${ol(3.2)}/>
      ${litP('3,48 14,46 15,54 4,56', 0.22)}
      <polygon points="1,44 12,42 14,52 2,54" fill="${INK}" ${ol(2)}/>
      <path d="M 5,60 Q 13,65 22,60" fill="none" ${ol(2.6)}/>
      <polygon points="10,62 20,62 17,72 10,68" fill="#d97e8e" ${ol(2.4)}/>

      <polygon points="33,28 47,31 51,50 44,64 35,52" fill="${accent}" ${ol(3.4)}/>
      ${shadeP('42,30 47,31 51,50 45,62', 0.18)}
      <path d="M 38,34 Q 44,42 43,54" fill="none" ${ol(2)}/>

      <polygon points="21,58 51,52 53,64 23,70" fill="${accent}" ${ol(3)}/>
      ${letterPlate(37.5, 81, 28, 20, visorColor, accent, emblem)}

      ${brow(20, 36, 15, -20, 5.4)}
      ${eye(20, 47, 6.4, -0.5)}
    </g>
  `
  )
}

// Bobo (B): three-eyed alien. Oversized angular cranium (a wide flat top
// tapering to a small chin) carrying three fully outlined eyes -- two big
// ones with heavy brows plus one high on the forehead -- two ball antennae,
// and a small body with a bolted belly plate. The head is roughly 55% of the
// figure so the alien read survives being shrunk.
export function toyBobo({
  bodyColor = '#8ddba6',
  accent = '#2f7a52',
  emblem = 'B',
  visorColor = '#fff6da',
} = {}) {
  const claw = (cx, cy, rot) => `
    <g transform="translate(${cx},${cy}) rotate(${rot})">
      <polygon points="-7,-6 7,-6 5,6 -5,6" fill="${bodyColor}" ${ol(2.8)}/>
      <path d="M -4,6 L -5,12 M 0,6 L 0,13 M 4,6 L 5,12" ${ol(2.6)}/>
    </g>`

  return svgWrap(
    `
    <g>
      ${shadow(60, 30)}

      <polygon points="40,110 52,110 51,126 38,126" fill="${bodyColor}" ${ol(3)}/>
      <polygon points="34,124 54,124 55,132 32,132" fill="${accent}" ${ol(3)}/>
      <polygon points="68,110 80,110 82,126 69,126" fill="${bodyColor}" ${ol(3)}/>
      <polygon points="66,124 86,124 88,132 64,132" fill="${accent}" ${ol(3)}/>

      <polygon points="34,80 24,84 18,104 28,108 40,90" fill="${bodyColor}" ${ol(3)}/>
      ${claw(23, 112, -14)}
      <polygon points="86,80 96,84 102,104 92,108 80,90" fill="${bodyColor}" ${ol(3)}/>
      ${claw(97, 112, 14)}

      <polygon points="38,74 82,74 86,112 34,112" fill="${bodyColor}" ${ol(3.4)}/>
      ${shadeP('72,74 82,74 86,112 74,112', 0.15)}
      ${letterPlate(60, 92, 38, 24, visorColor, accent, emblem)}
      ${/* Up to y=78, above the wider plate rather than on it -- these are
            the belly panel's bolts and they were being drawn over the letter. */ ''}
      <circle cx="48" cy="78" r="2" fill="${accent}" stroke="none"/>
      <circle cx="72" cy="78" r="2" fill="${accent}" stroke="none"/>

      <polygon points="30,26 90,26 96,52 84,70 60,78 36,70 24,52" fill="${bodyColor}" ${ol(3.6)}/>
      ${litP('34,30 52,28 46,44 34,44', 0.24)}
      ${shadeP('78,30 90,28 96,52 84,70 76,72 84,52', 0.14)}
      <path d="M 32,60 Q 60,68 88,60" fill="none" ${ol(2)}/>

      ${/* Third-eye housing: a domed bump that pokes past the cranium's flat
            top edge, drawn ON TOP of the head polygon so the head's own top
            ink line only shows either side of the dome's span. The eye used
            to sit flush inside the flat top at cy=34 -- fine in colour, but
            a hard silhouette cutout showed it carries zero silhouette
            weight there (a flat-fill disc inside another flat-fill shape).
            The dome gives the three-eye trait real shape presence instead of
            depending on colour contrast alone. */ ''}
      <ellipse cx="60" cy="19" rx="12" ry="10" fill="${bodyColor}" ${ol(3.2)}/>
      ${litP('50,11 60,9 63,18 52,20', 0.22)}

      <path d="M 42,26 L 26,8" ${ol(3.4)}/>
      <circle cx="24" cy="7.6" r="6" fill="${accent}" ${ol(3)}/>
      ${litP('20,3 24,1 26,4 22,6', 0.4)}
      <path d="M 78,26 L 94,8" ${ol(3.4)}/>
      <circle cx="96" cy="7.6" r="6" fill="${accent}" ${ol(3)}/>
      ${litP('92,3 96,1 98,4 94,6', 0.4)}

      ${eye(60, 21, 7.5)}
      ${brow(43, 42, 17, -14, 5.6)}
      ${brow(78, 42, 17, 14, 5.6)}
      ${eye(43, 53, 11, -0.2)}
      ${eye(78, 53, 11, 0.2)}
      <path d="M 48,68 Q 60,76 72,68" fill="none" ${ol(3)}/>
      <path d="M 48,68 L 45,65 M 72,68 L 75,65" ${ol(2.4)}/>
    </g>
  `
  )
}

// Captain Big, the merged boss form: a SPACE-RANGER ASTRONAUT, and the one
// figure in this file whose genre read was explicitly failing before. Five
// identification marks from the reference figure, all present and large:
//   1. CLEAR DOME HELMET -- the face is drawn in full first, then the dome
//      goes over it as an outlined ring with a low-opacity glass tint and
//      two white sweep highlights. The whole face stays visible.
//   2. TRI-COLOUR HARD PANELS -- white (panelColor), green (fixed) and
//      violet (bodyColor) blocks, each separately outlined, split across
//      chest / shoulders / forearms / hips / shins so the suit reads as
//      moulded plates instead of one painted body.
//   3. CHEST CONTROL ROW -- a dark display window plus four round buttons
//      (red, blue, green, amber) in a line, each outlined.
//   4. JOINT LOCK RINGS -- shoulders, elbows, wrists, knees and ankles.
//   5. BLACK WAIST BELLOWS -- three ribbed dark bands between torso and hips.
// The star plate keeps the emblem slot; a shoulder star and the trio of
// coil rings at the collar are the callbacks to Leo and Fifi.
export function toyCaptainBig({
  bodyColor = '#6b4ea8',
  // The `★` used to be inked in `bodyColor`, which measured 5.72:1 on the
  // white panel. A mid-tone cannot be rescued by any plate colour, so the ink
  // is the SAME VIOLET PUSHED DEEP -- 12:1 measured, never black and never a
  // hue change.
  inkColor = '#39235f',
  emblem = '★',
  panelColor = '#fdfaf2',
  accent = '#f0c33e',
  visorColor = '#8fe3ea',
} = {}) {
  const GREEN = '#3fae63'
  const GREEN_DK = '#2b8449'
  const HAIR = '#7d5636'

  const button = (cx, cy, color) => `
    <circle cx="${cx}" cy="${cy}" r="4" fill="${color}" ${ol(2.2)}/>
    <circle cx="${cx - 1.2}" cy="${cy - 1.3}" r="1.2" fill="#fff" opacity="0.75" stroke="none"/>`

  return svgWrap(
    `
    <g>
      ${shadow(60, 44)}

      <polygon points="36,104 57,104 56,120 35,120" fill="${bodyColor}" ${ol(3.2)}/>
      <polygon points="63,104 84,104 85,120 64,120" fill="${bodyColor}" ${ol(3.2)}/>
      ${shadeP('50,104 57,104 56,120 49,120', 0.14)}
      ${lockRing(46, 119, 11, 4.6, accent)}
      ${lockRing(74, 119, 11, 4.6, accent)}
      <polygon points="36,118 56,118 56,130 35,130" fill="${panelColor}" ${ol(3.2)}/>
      <polygon points="64,118 84,118 85,130 64,130" fill="${panelColor}" ${ol(3.2)}/>
      <polygon points="30,128 58,128 58,137 28,135" fill="${GREEN}" ${ol(3.2)}/>
      <polygon points="62,128 90,128 92,135 62,137" fill="${GREEN}" ${ol(3.2)}/>
      ${shadeP('30,134 58,134 58,137 28,135', 0.25)}
      ${shadeP('62,134 90,134 92,135 62,137', 0.25)}

      <polygon points="34,92 86,92 85,106 35,106" fill="${DARK}" ${ol(3)}/>
      <path d="M 35,96 L 85,96 M 35,100 L 85,100 M 35,103.5 L 85,103.5" ${ol(1.8)}/>

      <polygon points="28,50 92,50 88,94 32,94" fill="${panelColor}" ${ol(3.8)}/>
      ${shadeP('76,52 92,50 88,94 78,94', 0.11)}
      <polygon points="28,50 92,50 91,60 29,60" fill="${GREEN}" ${ol(3)}/>

      <polygon points="12,50 40,44 42,66 14,70" fill="${GREEN}" ${ol(3.4)}/>
      ${litP('14,52 30,47 31,55 15,59', 0.24)}
      <polygon points="${starPoints(26, 57, 7.4, 3.2)}" fill="${panelColor}" ${ol(2.2)}/>
      <polygon points="108,50 80,44 78,66 106,70" fill="${GREEN}" ${ol(3.4)}/>
      ${shadeP('98,46 108,50 106,70 98,68', 0.15)}
      <polygon points="${starPoints(94, 57, 7.4, 3.2)}" fill="${panelColor}" ${ol(2.2)}/>

      <polygon points="12,64 30,62 34,84 16,88" fill="${panelColor}" ${ol(3.2)}/>
      ${lockRing(24, 86, 9.5, 4.4, accent)}
      <polygon points="14,86 32,84 33,102 13,104" fill="${GREEN}" ${ol(3.2)}/>
      ${lockRing(23, 104, 10, 4.4, accent)}
      <polygon points="12,104 32,104 30,118 20,122 8,116" fill="${panelColor}" ${ol(3.2)}/>
      <polygon points="30,108 37,110 35,118 29,117" fill="${panelColor}" ${ol(2.6)}/>
      <polygon points="108,64 90,62 86,84 104,88" fill="${panelColor}" ${ol(3.2)}/>
      ${lockRing(96, 86, 9.5, 4.4, accent)}
      <polygon points="106,86 88,84 87,102 107,104" fill="${GREEN}" ${ol(3.2)}/>
      ${lockRing(97, 104, 10, 4.4, accent)}
      <polygon points="108,104 88,104 90,118 100,122 112,116" fill="${panelColor}" ${ol(3.2)}/>
      <polygon points="90,108 83,110 85,118 91,117" fill="${panelColor}" ${ol(2.6)}/>

      ${lockRing(37, 55, 9, 6.4, accent)}
      ${lockRing(83, 55, 9, 6.4, accent)}

      ${letterPlate(60, 71.4, 27, 18.4, panelColor, inkColor, emblem)}
      <polygon points="32,62 45,62 45,78 32,78" fill="${DARK}" ${ol(2.6)}/>
      <path d="M 34,66 L 43,66 M 34,70 L 43,70 M 34,74 L 40,74" stroke="${GREEN}" stroke-width="1.8"/>
      <polygon points="76,60 90,60 90,80 76,80" fill="${bodyColor}" ${ol(2.8)}/>
      ${button(83, 65, '#e0503f')}
      ${button(83, 75, '#57c66e')}
      <polygon points="40,82 80,82 80,90 40,90" fill="${bodyColor}" ${ol(2.8)}/>
      ${button(49, 86, '#e0503f')}
      ${button(60, 86, '#4a8fe0')}
      ${button(71, 86, accent)}

      <polygon points="44,12 76,12 80,32 74,48 60,56 46,48 40,32" fill="${FACE}" ${ol(3.2)}/>
      ${shadeP('72,16 80,32 74,48 68,51 74,32 68,14', 0.12)}
      <path d="M 41,26 Q 43,10 60,9 Q 77,10 79,26 Q 74,18 66,20 Q 58,15 41,26 Z" fill="${HAIR}" ${ol(2.6)}/>
      <path d="M 60,12 Q 66,15 68,20" fill="none" stroke="#fff" stroke-width="1.8" opacity="0.22"/>
      ${brow(51, 26, 14, -14, 4.6)}
      ${brow(70, 26, 14, 14, 4.6)}
      ${eye(51, 35, 6.6, 0.15)}
      ${eye(70, 35, 6.6, 0.15)}
      ${nose(60, 41, 4.5, 4)}
      ${grin(60, 46, 7.5)}
      <path d="M 60,51 L 60,53" ${ol(2)}/>

      ${/* Shortened 64 -> 61. This ring is drawn AFTER the emblem plate and
            its 3.2-unit ink reached y=65.6, i.e. 5 units INSIDE the plate's
            clear interior, and its middle seam is a vertical ink line at
            x=60 -- dead centre of the letter. Measured, the widest clear run
            through the glyph's own rows was zero: the label was sitting on
            the collar, not on the plate. Only a pixel scan finds this; the
            plate's own geometry says it is 22 units tall and 14 of those were
            real. */ ''}
      <polygon points="40,52 80,52 78,59 42,59" fill="${panelColor}" ${ol(3.2)}/>
      <path d="M 47,53.5 L 47,57.5 M 60,53.5 L 60,57.5 M 73,53.5 L 73,57.5" ${ol(2)}/>

      <circle cx="60" cy="32" r="29" fill="${visorColor}" opacity="0.18" stroke="none"/>
      <circle cx="60" cy="32" r="29" fill="none" ${ol(3.8)}/>
      <circle cx="60" cy="32" r="25" fill="none" stroke="#fff" stroke-width="2" opacity="0.5"/>
      <path d="M 39,15 Q 49,5 62,4" fill="none" stroke="#fff" stroke-width="6" opacity="0.85" stroke-linecap="round"/>
      <path d="M 34,23 Q 37,17 42,12" fill="none" stroke="#fff" stroke-width="3.2" opacity="0.65" stroke-linecap="round"/>
      <path d="M 82,18 Q 88,26 88,34" fill="none" stroke="#fff" stroke-width="3" opacity="0.4" stroke-linecap="round"/>
      <path d="M 33,44 A 29,29 0 0 0 87,44" fill="none" ${ol(3.8)}/>
    </g>
  `
  )
}

// ---------------------------------------------------------------------------
// VILLAINS. Same inked-cartoon grammar as the heroes -- same ink weight
// tiers, same angular construction, same four-mark face -- with three things
// flipped hostile: the brow tilts DOWN at the inner end, the whole figure
// leans off vertical, and the mouth is a toothed snarl instead of a grin.
// Each silhouette is still literally its gameplay gimmick. Villains take
// only { bodyColor, accent } and carry no letter.
// ---------------------------------------------------------------------------

// Wobbly: wind-up gone loose. Tin-can body tilted off its own axis, a
// wind-up key hanging at a wrong angle, riveted seam bands, legs bent in
// different directions, dizzy motion ticks.
export function toyWobbly({ bodyColor = '#d1692f', accent = '#7a3413' } = {}) {
  // `rot` is an SVG rotate() angle, i.e. CLOCKWISE, so a NEGATIVE angle
  // swings the key out to the figure's right; a positive one buries it
  // behind the torso.
  const key = (cx, cy, rot) => `
    <g transform="translate(${cx},${cy}) rotate(${rot})">
      <polygon points="-4.5,0 4.5,0 3.5,16 -3.5,16" fill="${accent}" ${ol(2.8)}/>
      <circle cx="0" cy="25" r="8" fill="none" ${ol(7)}/>
      <circle cx="0" cy="25" r="8" fill="none" stroke="${accent}" stroke-width="4"/>
      <path d="M -4,3 L -4,15" stroke="#fff" stroke-width="1.6" opacity="0.3"/>
    </g>`

  return svgWrap(
    `
    ${shadow(58, 26)}
    <g transform="rotate(10 60 92)">

      <path d="M 16,112 Q 22,122 32,118" fill="none" ${ol(2.2)} stroke-dasharray="4,4"/>
      <path d="M 88,110 Q 94,120 104,116" fill="none" ${ol(2.2)} stroke-dasharray="4,4"/>

      <g transform="rotate(-20 40 116)">
        <polygon points="34,102 46,102 48,126 32,126" fill="${accent}" ${ol(3)}/>
        <polygon points="28,124 50,124 51,133 27,133" fill="${DARK}" ${ol(3)}/>
      </g>
      <g transform="rotate(26 78 114)">
        <polygon points="72,100 84,100 86,124 70,124" fill="${accent}" ${ol(3)}/>
        <polygon points="66,122 88,122 89,131 65,131" fill="${DARK}" ${ol(3)}/>
      </g>

      <polygon points="20,62 34,56 38,84 22,88" fill="${accent}" ${ol(3)}/>
      <polygon points="12,84 32,82 34,96 10,96" fill="${bodyColor}" ${ol(2.8)}/>
      <polygon points="86,66 100,72 96,96 82,90" fill="${accent}" ${ol(3)}/>
      <polygon points="94,92 112,96 110,108 90,104" fill="${bodyColor}" ${ol(2.8)}/>

      <polygon points="34,52 86,52 90,106 30,106" fill="${bodyColor}" ${ol(3.6)}/>
      <polygon points="32,48 88,48 89,56 31,56" fill="${accent}" ${ol(3)}/>
      ${litP('36,54 48,53 46,104 34,104', 0.2)}
      ${shadeP('76,53 86,52 90,106 78,105', 0.17)}
      <polygon points="33,62 87,62 87,69 33,69" fill="${accent}" ${ol(2.4)}/>
      <polygon points="31,94 89,94 89,101 31,101" fill="${accent}" ${ol(2.4)}/>
      <circle cx="40" cy="65.5" r="1.6" fill="${DARK}" stroke="none"/>
      <circle cx="80" cy="65.5" r="1.6" fill="${DARK}" stroke="none"/>

      ${key(82, 56, -58)}

      <polygon points="42,20 78,20 82,38 74,50 60,54 46,50 38,38" fill="${bodyColor}" ${ol(3.6)}/>
      ${shadeP('72,24 82,38 74,50 68,52 74,38 68,22', 0.14)}
      <polygon points="40,18 80,18 82,24 38,24" fill="${accent}" ${ol(2.8)}/>

      ${brow(49, 30, 16, 22, 5.6)}
      ${brow(72, 30, 16, -22, 5.6)}
      ${eye(50, 39, 7, 0.4)}
      ${squint(72, 38, 6, -1)}
      ${nose(60, 44, 4, 3)}
      ${snarl(60, 49, 9, 7)}
    </g>
  `
  )
}

// Tangly: tangles other toys' strings. An angular spool-and-yarn body with
// crossed wound strands, loose trailing ends that finish in hooks, and long
// crooked arms holding a knitting needle -- the gimmick as an object a child
// can name at a glance.
export function toyTangly({ bodyColor = '#9a63d1', accent = '#4f2f8a' } = {}) {
  // Thread wound around the spool waist: stacked flat bands, each with its
  // own ink line, so the middle of the body reads as wound string and not as
  // a painted stripe.
  // Wound thread on the spool waist: thin bands plus diagonal strands
  // crossing both ways. The diagonals are what keep this from reading like
  // Fifi's coil spring -- and there are enough of them, at enough angles,
  // that the lattice cannot be mistaken for a letterform.
  const winds = []
  for (let y = 73; y <= 100; y += 6.5) {
    winds.push(`<path d="M 36,${y} Q 60,${y + 4} 84,${y}" fill="none" stroke="${INK}" stroke-width="3.4" stroke-linecap="round"/>`)
    winds.push(`<path d="M 36,${y} Q 60,${y + 4} 84,${y}" fill="none" stroke="${accent}" stroke-width="1.8"/>`)
  }
  for (const [x1, x2] of [[38, 66], [48, 76], [58, 82], [80, 54], [70, 44], [60, 38]]) {
    winds.push(`<path d="M ${x1},71 L ${x2},101" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`)
    winds.push(`<path d="M ${x1},71 L ${x2},101" fill="none" stroke="${accent}" stroke-width="1.6"/>`)
  }

  return svgWrap(
    `
    ${shadow(60, 34)}
    <g transform="rotate(-7 60 90)">

      ${inkedLine('M 30,104 C 8,110 12,128 26,124', accent, 3.4)}
      ${inkedLine('M 90,102 C 112,106 108,126 94,122', accent, 3.4)}
      ${inkedLine('M 24,66 C 4,74 6,92 20,96', accent, 3)}
      ${inkedLine('M 96,64 C 116,72 114,90 100,94', accent, 3)}

      <polygon points="36,108 50,108 52,124 34,124" fill="${accent}" ${ol(3)}/>
      <polygon points="30,122 52,122 53,131 29,131" fill="${DARK}" ${ol(3)}/>
      <polygon points="70,108 84,108 86,124 68,124" fill="${accent}" ${ol(3)}/>
      <polygon points="66,122 88,122 89,131 65,131" fill="${DARK}" ${ol(3)}/>

      <polygon points="34,62 18,54 10,62 26,76" fill="${accent}" ${ol(3)}/>
      <g transform="translate(15,58) rotate(-36)">
        <polygon points="-3,-4 3,-4 2,18 -2,18" fill="#dfe4ea" ${ol(2.4)}/>
        <circle cx="0" cy="-7" r="4.4" fill="${bodyColor}" ${ol(2.4)}/>
      </g>
      <polygon points="90,62 106,54 114,62 98,76" fill="${accent}" ${ol(3)}/>
      <g transform="translate(111,58) rotate(36)">
        <polygon points="-3,-4 3,-4 2,18 -2,18" fill="#dfe4ea" ${ol(2.4)}/>
        <circle cx="0" cy="-7" r="4.4" fill="${bodyColor}" ${ol(2.4)}/>
      </g>

      <polygon points="26,60 94,60 88,72 32,72" fill="${accent}" ${ol(3.6)}/>
      <polygon points="32,100 88,100 94,112 26,112" fill="${accent}" ${ol(3.6)}/>
      <polygon points="40,70 80,70 80,102 40,102" fill="${bodyColor}" ${ol(3.2)}/>
      ${winds.join('')}
      ${litP('34,74 44,73 42,100 32,100', 0.16)}
      ${shadeP('82,73 90,74 88,101 80,101', 0.14)}
      <path d="M 30,64 Q 60,58 90,64" fill="none" stroke="${bodyColor}" stroke-width="2.4"/>

      <polygon points="38,28 82,28 86,46 80,58 60,64 40,58 34,46" fill="${bodyColor}" ${ol(3.6)}/>
      ${shadeP('74,32 86,46 80,58 72,61 78,46 70,30', 0.14)}
      <path d="M 44,28 L 38,14 M 60,26 L 60,10 M 76,28 L 82,14" ${ol(3)}/>
      <circle cx="37" cy="12" r="3.6" fill="${accent}" ${ol(2.2)}/>
      <circle cx="60" cy="8" r="3.6" fill="${accent}" ${ol(2.2)}/>
      <circle cx="83" cy="12" r="3.6" fill="${accent}" ${ol(2.2)}/>

      ${brow(48, 38, 16, 20, 5.6)}
      ${brow(72, 38, 16, -20, 5.6)}
      ${eye(49, 47, 7, 0.4)}
      ${eye(71, 47, 7, -0.4)}
      ${nose(60, 52, 4, 3)}
      ${snarl(60, 57, 9, 7)}
    </g>
  `
  )
}

// Boxxy: locks toys away. A packing carton with a hinged lid for a jaw,
// corrugated ribbing along one edge, crossed tape seams, angular flap arms
// and a padlock held out in one of them.
export function toyBoxxy({ bodyColor = '#d1a95a', accent = '#7a4a23' } = {}) {
  const ribs = []
  for (let x = 36; x <= 84; x += 8) {
    ribs.push(`<path d="M ${x},106 L ${x},114" ${ol(1.8)}/>`)
  }

  return svgWrap(
    `
    ${shadow(60, 32)}
    <g transform="rotate(-4 60 92)">

      <polygon points="30,112 48,112 50,128 28,128" fill="${accent}" ${ol(3)}/>
      <polygon points="24,126 52,126 53,134 23,134" fill="${DARK}" ${ol(3)}/>
      <polygon points="72,112 90,112 92,128 70,128" fill="${accent}" ${ol(3)}/>
      <polygon points="68,126 96,126 97,134 67,134" fill="${DARK}" ${ol(3)}/>

      <polygon points="32,66 20,58 8,74 6,90 26,84" fill="${bodyColor}" ${ol(3.2)}/>
      ${shadeP('20,62 26,68 24,82 10,86 8,78', 0.13)}
      <g transform="translate(8,84) rotate(-10)">
        <polygon points="0,0 17,0 17,15 0,15" fill="${accent}" ${ol(2.8)}/>
        <path d="M 4,0 Q 4,-9 8.5,-9 Q 13,-9 13,0" fill="none" ${ol(3.4)}/>
        <circle cx="8.5" cy="6.5" r="2.6" fill="${bodyColor}" ${ol(2)}/>
      </g>
      <polygon points="88,66 100,58 112,74 114,90 94,84" fill="${bodyColor}" ${ol(3.2)}/>
      ${shadeP('100,62 114,84 96,82 94,68', 0.16)}

      <polygon points="24,44 52,24 58,34 32,52" fill="${bodyColor}" ${ol(3.4)}/>
      ${shadeP('24,44 32,52 44,42 52,24 48,32', 0.14)}
      <polygon points="96,44 68,24 62,34 88,52" fill="${bodyColor}" ${ol(3.4)}/>
      ${shadeP('96,44 88,52 76,42 68,24 72,32', 0.2)}

      <polygon points="28,44 92,44 90,116 30,116" fill="${bodyColor}" ${ol(3.8)}/>
      ${litP('30,46 44,45 42,114 32,114', 0.2)}
      ${shadeP('78,45 92,44 90,116 78,115', 0.15)}
      <polygon points="26,42 94,42 92,52 28,52" fill="${bodyColor}" ${ol(3.2)}/>
      <polygon points="56,52 64,52 64,116 56,116" fill="${accent}" ${ol(2.4)}/>
      <polygon points="28,96 92,96 92,104 28,104" fill="${accent}" ${ol(2.4)}/>
      ${ribs.join('')}

      <polygon points="38,84 82,84 76,102 44,102" fill="${DARK}" ${ol(3)}/>
      <polygon points="43,84 53,84 48,98" fill="${WHITE}" stroke="none"/>
      <polygon points="58,84 68,84 63,98" fill="${WHITE}" stroke="none"/>
      <polygon points="72,86 78,98 66,98" fill="${WHITE}" stroke="none"/>

      ${brow(44, 58, 18, 24, 6)}
      ${brow(76, 58, 18, -24, 6)}
      ${eye(45, 70, 8, 0.4)}
      ${eye(75, 70, 8, -0.4)}
    </g>
  `
  )
}

// Tumbles: knocks block towers over. A stack of separately outlined blocks
// leaning hard off vertical, mid-topple, with the face on the top block and
// chipped debris flying off. Debris mixes diamonds and triangles at
// scattered sizes so the chips can never line up into a letterform.
export function toyTumbles({ bodyColor = '#4f95d1', accent = '#245080' } = {}) {
  const diamond = (cx, cy, s, op) =>
    `<rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" fill="${accent}" opacity="${op}"
      transform="translate(${cx},${cy}) rotate(45)" ${ol(2)}/>`
  const shard = (cx, cy, s, op, rot) =>
    `<polygon points="0,${-s / 2} ${s / 2},${s / 2} ${-s / 2},${s / 2}" fill="${accent}" opacity="${op}"
      transform="translate(${cx},${cy}) rotate(${rot})" ${ol(2)}/>`
  // Block: a face quad plus a top quad and a side quad, all separately
  // outlined -- the ink lines are what make the stack read as loose pieces.
  const block = (x, y, w, h, rot) => `
    <g transform="rotate(${rot} ${x + w / 2} ${y + h})">
      <polygon points="${x},${y} ${x + w},${y} ${x + w},${y + h} ${x},${y + h}" fill="${bodyColor}" ${ol(3.2)}/>
      <polygon points="${x},${y} ${x + w},${y} ${x + w - 5},${y - 5} ${x - 5},${y - 5}" fill="${accent}" ${ol(2.8)}/>
      ${shadeP(`${x + w * 0.76},${y} ${x + w},${y} ${x + w},${y + h} ${x + w * 0.76},${y + h}`, 0.16)}
      ${litP(`${x},${y} ${x + w * 0.2},${y} ${x + w * 0.2},${y + h} ${x},${y + h}`, 0.18)}
    </g>`

  return svgWrap(
    `
    ${shadow(58, 30)}
    <g transform="rotate(12 55 92)">

      ${diamond(14, 92, 9, 0.9)}
      ${shard(10, 110, 7, 0.75, 20)}
      ${diamond(23, 122, 7, 0.7)}
      ${shard(104, 66, 7, 0.75, -15)}
      ${diamond(110, 84, 8, 0.65)}

      ${block(30, 108, 26, 21, 0)}
      ${block(62, 110, 22, 18, 0)}
      ${block(28, 84, 58, 26, 0)}
      ${block(8, 62, 20, 18, -22)}
      ${block(34, 54, 48, 30, 0)}
      ${block(38, 22, 42, 32, 0)}

      ${brow(49, 33, 17, 24, 6)}
      ${brow(70, 33, 17, -24, 6)}
      ${eye(50, 43, 8, 0.4)}
      ${eye(69, 43, 8, -0.4)}
      ${snarl(60, 51, 9, 7)}
    </g>
  `
  )
}

// Wind-Down, the chapter boss: stops every toy's key. A space emperor drawn
// as the darkest, widest inked mass in the file -- jagged-hem cape, a spiked
// gem crown, a high collar, gold epaulettes, and a sceptre whose finial is
// the same wind-up key Wobbly's hangs loose (his is rigid and dead straight:
// the gimmick made visual). The chest medallion keeps its frozen clock hands.
export function toyWindDown({ bodyColor = '#3a3150', accent = '#7a63e0' } = {}) {
  const GOLD = '#d1a94a'

  return svgWrap(
    `
    <g>
      ${shadow(60, 50)}

      <polygon points="30,48 8,84 4,132 18,124 26,134 40,122 60,130 80,122 94,134 102,124 116,132 112,84 90,48
                       78,60 60,64 42,60" fill="${bodyColor}" ${ol(3.8)}/>
      ${litP('30,50 14,80 12,120 26,112 24,80 38,56', 0.12)}
      ${shadeP('90,50 106,80 108,122 94,114 96,80 82,56', 0.2)}
      <path d="M 22,120 L 40,116 L 60,122 L 80,116 L 98,120" fill="none" stroke="${GOLD}" stroke-width="2.4"/>

      <polygon points="46,116 58,116 58,130 45,130" fill="${DARK}" ${ol(3)}/>
      <polygon points="62,116 74,116 75,130 62,130" fill="${DARK}" ${ol(3)}/>

      <polygon points="34,50 86,50 90,104 30,104" fill="${bodyColor}" ${ol(3.8)}/>
      ${shadeP('74,52 86,50 90,104 76,103', 0.18)}
      <polygon points="32,72 88,72 88,80 32,80" fill="${accent}" ${ol(2.4)}/>

      <polygon points="34,48 12,52 10,68 34,64" fill="${GOLD}" ${ol(3.2)}/>
      <path d="M 14,66 L 12,78 M 22,65 L 21,78 M 30,64 L 30,77" ${ol(3)}/>
      <polygon points="86,48 108,52 110,68 86,64" fill="${GOLD}" ${ol(3.2)}/>
      <path d="M 106,66 L 108,78 M 98,65 L 99,78 M 90,64 L 90,77" ${ol(3)}/>

      <polygon points="16,66 30,64 34,90 20,94" fill="${bodyColor}" ${ol(3.2)}/>
      <polygon points="14,88 32,86 32,100 12,100" fill="${accent}" ${ol(3)}/>
      <polygon points="16,36 22,36 21,96 15,96" fill="${GOLD}" ${ol(2.8)}/>
      <polygon points="12,32 26,32 24,20 14,20" fill="${GOLD}" ${ol(2.8)}/>
      <circle cx="19" cy="11.4" r="8" fill="none" ${ol(6)}/>
      <circle cx="19" cy="11.4" r="8" fill="none" stroke="${GOLD}" stroke-width="3.6"/>

      <circle cx="60" cy="88" r="16" fill="${GOLD}" ${ol(3.2)}/>
      <circle cx="60" cy="88" r="11.5" fill="${WHITE}" ${ol(2.4)}/>
      <path d="M 60,88 L 60,80" ${ol(2.6)}/>
      <path d="M 60,88 L 66,91" ${ol(2.6)}/>
      <circle cx="60" cy="88" r="2" fill="${INK}" stroke="none"/>

      <polygon points="38,44 42,52 78,52 82,44 74,50 68,38 60,50 52,38 46,50" fill="${accent}" ${ol(3)}/>

      <polygon points="42,14 78,14 82,32 74,46 60,52 46,46 38,32" fill="${bodyColor}" ${ol(3.6)}/>
      ${shadeP('72,18 82,32 74,46 68,49 74,32 68,16', 0.16)}
      <polygon points="36,19 44,3.5 52,14 60,2 68,14 76,3.5 84,19" fill="${GOLD}" ${ol(3.2)}/>
      <circle cx="51" cy="10.5" r="2.6" fill="#d14a8a" ${ol(1.8)}/>
      <circle cx="60" cy="6" r="2.8" fill="#4ab0d1" ${ol(1.8)}/>
      <circle cx="69" cy="10.5" r="2.6" fill="#d14a8a" ${ol(1.8)}/>

      ${brow(50, 24, 17, 24, 6)}
      ${brow(72, 24, 17, -24, 6)}
      ${eye(51, 33, 7.4, 0.4)}
      ${eye(71, 33, 7.4, -0.4)}
      ${nose(61, 39, 4, 3)}
      ${snarl(61, 44, 9, 7)}
    </g>
  `
  )
}
