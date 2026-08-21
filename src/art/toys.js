// "Living toy" art (chapter 6). A fifth drawing language, deliberately
// unlike the other four: src/art/robots.js (angular armour plates, cold
// greys), src/art/dinosaurs.js (organic bezier animals, warm creams),
// src/art/platformer.js (2.5-head sprite people in caps and gloves),
// src/art/creatures.js (seamless round animal blobs, no neck/joint lines
// anywhere).
//
// REVISION NOTE (v3): v1 built every hero around a TOY MATERIAL (rigid tin
// soldier / soft plush / stacked plastic blocks) with genre as an
// afterthought; v2 fixed the genre read (cowboy / spring dog / alien /
// astronaut) but kept the other four families' "flat colour, few shapes,
// must survive 66 px" discipline, which came back reading flat and
// undercooked. Product direction for this chapter (and, going forward,
// every chapter) dropped that constraint on purpose: **this cast does not
// need to look like it belongs in the same app as the robots/dinos/
// platformers/creatures.** The real render sizes for this cast are 132 px
// (mini-bot), 170 px (map node), 186 px (battle sprite), 250 px (reward)
// and 256 px (fusion finale) -- nothing in the shipped UI renders this art
// at 66 px -- so v3 spends far more shapes and layered flat highlight/
// shadow panels per figure than the sibling families would ever afford,
// aimed squarely at "does a 5-year-old recognise the genre and think it
// looks cool" at 132 px and up. No real toyline's specific face, outfit,
// logo or colour scheme is reproduced -- only the genre's generic props
// (wide hat + bandana + star, coil body, big-head-and-antennae, bubble
// helmet, emperor's cape) are borrowed.
//
// DESIGN GRAMMAR -- v3.
//
//  1. ONE BOLD GENRE SILHOUETTE PER HERO, still the first read: Leo = wide
//     curled-brim hat + bandana + plaid shirt + belt buckle + spurred boots
//     (cowboy). Fifi = a long horizontal coil-spring torso, many turns,
//     drawn side-on (the only pose where the coil reads as long instead of
//     collapsing into a stack of rings). Bobo = an oversized head carrying
//     three eyes and two antennae over a small green body (alien). Captain
//     Big = a clear-visored bubble helmet + panelled white suit + chest
//     control panel + back thrusters + banded joints (astronaut).
//  2. LAYERED FLAT SHADING IS NOW EXPECTED, not just tolerated: every torso,
//     limb and dome gets a lighter overlay panel on its lit side and a
//     darker overlay panel on its shadow side, both plain flat fills at
//     partial opacity -- never a `<linearGradient>`/`<radialGradient>`/
//     filter, which stay banned app-wide. This is what turns "flat sticker"
//     into "toy with some dimension" without breaking the no-gradient rule.
//  3. VISIBLE ASSEMBLY MARKS still mark every figure as manufactured, not
//     grown -- a peg/rivet joint, a dashed stitch, a mould seam, a joint
//     band -- but now sit alongside a lot more genre detail instead of
//     being one of only three shapes on the figure.
//  4. THE EMBLEM STILL SURVIVES A SMALL BOX: even though nothing in this
//     app renders below 132 px today, the letter plate keeps the same
//     high-contrast, uncluttered background it always had (no plaid/panel
//     lines cross through it) so it stays legible at any size a future
//     screen might use. Villains carry no letter; Wind-Down's medallion
//     fills that slot.
//  5. FLAT FILLS ONLY, geometric primitives only (rect/circle/ellipse/
//     polygon/path). `rx` on rects is expected -- toy plastic has soft
//     corners.
//
// VILLAINS get the same v3 detail pass as the heroes (constraint lifted
// chapter-wide) -- each keeps its v1/v2 gimmick shape exactly (Wobbly's
// loose key, Tangly's yarn ball, Boxxy's packing box, Tumbles' leaning
// block tower, Wind-Down's emperor cape+crown+sceptre) but now carries the
// same density of shading panels, texture and prop detail the heroes do, so
// hero and villain read as the same production quality standing next to
// each other in a battle screen.
//
// This file must not import ../art.js (circular); it carries its own svgWrap.

function svgWrap(inner, viewBox = '0 0 120 140') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

// Fixed neutrals shared by every character regardless of its own palette --
// the same role robots.js' CHROME/STEEL/MECH play.
const FACE = '#f3c9a0' // painted skin: Leo's head
const PLATE = '#eef1f4' // light backing behind a patch/panel/medallion dial
const DARK = '#241e17' // boots, joints, cavity shadows -- the "unpainted dark part" every toy has
const JOINT = '#8a7358' // peg/rivet joint knob, warm "wood dowel" tone
const INK = '#33281c' // eyes, mouths, stitches, seams
const FLAME = '#ffb020' // fixed thruster-flame colour, independent of body palette
const STAR_GOLD = '#f0c33e' // fixed sheriff-star colour, independent of Leo's shirt palette
const BANDANA_BLUE = '#3a6ea5' // fixed bandana colour -- kept off red on purpose (see file header)
const EMPEROR_GOLD = '#caa14a' // fixed crown/epaulette/trim colour, independent of body palette
const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const shadow = (cx, w) => `<ellipse cx="${cx}" cy="136" rx="${w}" ry="5" fill="#000" opacity="0.13"/>`

// A flat highlight or shadow panel -- a plain rect/ellipse at partial
// opacity laid over a base shape. This, repeated a lot, is the v3 "shading
// without gradients" trick: never a `<linearGradient>`, always a second
// solid shape.
const litPanel = (x, y, w, h, rx, opacity) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#fff" opacity="${opacity}"/>`
const shadePanel = (x, y, w, h, rx, opacity) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="#000" opacity="${opacity}"/>`

// A peg joint: the family's #1 "this is assembled, not grown" tell.
function peg(cx, cy, r = 5) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${JOINT}"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.4}" fill="#000" opacity="0.28"/>`
}

// A rivet pair -- Captain Big's armour-plate tell, the hard-shell counterpart
// of Leo's soft peg joint.
function bolt(cx, cy, color) {
  return `
    <circle cx="${cx}" cy="${cy}" r="2.6" fill="${color}"/>
    <rect x="${cx - 1.8}" y="${cy - 0.6}" width="3.6" height="1.2" fill="${DARK}"/>`
}

// A cuffed contrast ring wrapped around a limb tube -- the "space-suit
// joint" tell every one of Captain Big's wrists/ankles/knees carries.
function jointBand(cx, cy, rx, ry, color) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${color}"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry * 0.4}" fill="#000" opacity="0.15"/>`
}

// A cowboy spur: a small wheel with six radiating points at the boot heel.
function spurWheel(cx, cy, r, color) {
  const spokes = []
  for (let i = 0; i < 6; i += 1) {
    const a = (Math.PI / 3) * i
    const x2 = (cx + Math.cos(a) * r * 1.7).toFixed(1)
    const y2 = (cy + Math.sin(a) * r * 1.7).toFixed(1)
    spokes.push(`<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="1.4"/>`)
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${color}" stroke-width="1.6"/>${spokes.join('')}`
}

// Painted dot eye: flat pupil plus a small square paint-highlight (never a
// round highlight -- that shape belongs to the animal families' eyes).
function paintedEye(cx, cy, r) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${INK}"/>
    <rect x="${cx - r * 0.32}" y="${cy - r * 0.62}" width="${r * 0.5}" height="${r * 0.5}" fill="#fff" opacity="0.85"/>`
}

// Big plastic eye: white sclera + round pupil + highlight dot. This is the
// "big eyes" tell shared by Bobo and, as a callback, Captain Big's visor.
function bigEye(cx, cy, r) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>
    <circle cx="${cx + r * 0.25}" cy="${cy + r * 0.1}" r="${r * 0.55}" fill="${INK}"/>
    <circle cx="${cx + r * 0.42}" cy="${cy - r * 0.32}" r="${r * 0.2}" fill="#fff"/>`
}

// Short painted smile, shared by the calm heroes.
function smile(cx, cy, w) {
  return `<path d="M ${cx - w},${cy} Q ${cx},${cy + w * 0.7} ${cx + w},${cy}"
    fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
}

// Villain face: one round startled eye, one flat squint-with-brow, a
// crooked smirk -- friendly mischief, not fear, the same asymmetry every
// other family's villains use.
function villainEyes(cx1, cy1, cx2, cy2, r) {
  return `
    <circle cx="${cx1}" cy="${cy1}" r="${r}" fill="#fff"/>
    <circle cx="${cx1 + r * 0.25}" cy="${cy1 + r * 0.1}" r="${r * 0.55}" fill="${INK}"/>
    <ellipse cx="${cx2}" cy="${cy2 + r * 0.3}" rx="${r * 0.95}" ry="${r * 0.4}" fill="${INK}"/>
    <path d="M ${cx2 - r * 1.05},${cy2 - r * 0.85} L ${cx2 + r * 0.55},${cy2 - r * 0.25}"
      stroke="${INK}" stroke-width="2.4" stroke-linecap="round"/>`
}
function villainSmirk(cx, cy, w) {
  return `<path d="M ${cx - w},${cy - w * 0.15} Q ${cx},${cy + w * 0.6} ${cx + w},${cy}"
    fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
}

// Ten-point star outline used by Leo's sheriff badge, Captain Big's shoulder
// star trace, and Tumbles' cracked-block accent -- shared so every star in
// the file is the same shape family.
function starPoints(cx, cy, outerR, innerR) {
  const pts = []
  for (let i = 0; i < 10; i += 1) {
    const a = (Math.PI / 5) * i - Math.PI / 2
    const rr = i % 2 === 0 ? outerR : innerR
    pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`)
  }
  return pts.join(' ')
}

// The rect emblem plate, riveted on -- Bobo's belly decal and Captain Big's
// chest panel share this. `rivet` is left off for Bobo (a soft squeeze toy
// has no hardware) and on for Captain Big (armour is bolted). The plate
// background is always kept plain (rule 4) even as everything around it
// gets busier.
function emblemPlate(cx, cy, w, h, plateColor, textColor, label, size, rivet) {
  const x = cx - w / 2
  const y = cy - h / 2
  const rivets = rivet
    ? `
    <circle cx="${x + 4}" cy="${y + 4}" r="1.8" fill="${DARK}" opacity="0.5"/>
    <circle cx="${x + w - 4}" cy="${y + 4}" r="1.8" fill="${DARK}" opacity="0.5"/>
    <circle cx="${x + 4}" cy="${y + h - 4}" r="1.8" fill="${DARK}" opacity="0.5"/>
    <circle cx="${x + w - 4}" cy="${y + h - 4}" r="1.8" fill="${DARK}" opacity="0.5"/>`
    : ''
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) * 0.24}" fill="${plateColor}"/>
    ${rivets}
    <text x="${cx}" y="${cy + size * 0.36}" text-anchor="middle" font-family="${FONT}"
      font-size="${size}" font-weight="800" fill="${textColor}">${label}</text>`
}

// ---------------------------------------------------------------------------
// HEROES
// ---------------------------------------------------------------------------

// Leo (L): cowboy toy. Curled-brim hat, a knotted bandana, a plaid shirt (a
// real crossed grid, not a hint of one), a belt with an oversized buckle,
// and spurred pointed-toe boots -- six cowboy props stacked on one figure so
// the genre reads instantly even before the palette registers.
export function toyLeo({
  bodyColor = '#3f7a52',
  accent = '#6b4423',
  emblem = 'L',
  visorColor = '#fff6da',
} = {}) {
  const DENIM = '#3a5a82'
  const DENIM_DARK = '#25405f'
  const PLAID_LIGHT = '#f2e6c8'

  // Boot: a cuffed shaft plus a toe wedge kicked outward (`dir` = -1 left,
  // +1 right), a heel shadow, and a spur wheel at the back of the heel --
  // the spur is what pushes this past "generic dark shoe."
  const cowboyBoot = (cx, y, dir) => `
    <g transform="translate(${cx},${y})">
      <rect x="-11" y="-16" width="22" height="20" rx="4" fill="${accent}"/>
      <rect x="-11" y="-16" width="22" height="6" fill="${DARK}" opacity="0.5"/>
      <rect x="-9" y="-14" width="4" height="16" fill="#fff" opacity="0.14"/>
      <path d="M -11,0 L ${dir * 20},0 L ${dir * 20},10 L -11,14 Z" fill="${accent}"/>
      <path d="M ${dir * 8},2 L ${dir * 20},2 L ${dir * 20},9 L ${dir * 4},9 Z" fill="#000" opacity="0.18"/>
      ${spurWheel(dir * 16, 6, 3.2, '#d9cfa8')}
    </g>`

  // Sheriff star: a slightly larger dark star behind the main gold star (a
  // one-unit offset "bevel," never a gradient) so the badge reads as
  // embossed metal instead of a paper cutout; the letter sits on a plain
  // circle so the points never crowd the text.
  const starBadge = (cx, cy, outerR, plateR, label, size) => `
    <polygon points="${starPoints(cx, cy, outerR + 1.6, outerR * 0.5 + 1)}" fill="${accent}" opacity="0.5"/>
    <polygon points="${starPoints(cx, cy, outerR, outerR * 0.5)}" fill="${STAR_GOLD}"/>
    <polygon points="${starPoints(cx, cy - 1, outerR * 0.62, outerR * 0.32)}" fill="#fff" opacity="0.25"/>
    <circle cx="${cx}" cy="${cy}" r="${plateR}" fill="${visorColor}"/>
    <circle cx="${cx}" cy="${cy}" r="${plateR}" fill="none" stroke="${accent}" stroke-width="1.4" opacity="0.4"/>
    <text x="${cx}" y="${cy + size * 0.36}" text-anchor="middle" font-family="${FONT}"
      font-size="${size}" font-weight="800" fill="${accent}">${label}</text>`

  // A real crossed plaid grid: two light lines and two dark lines each way,
  // offset so the crossings read as woven fabric rather than a single flat
  // grid -- kept inside the shirt rect only, well clear of the badge below.
  const plaid = `
    <line x1="42" y1="58" x2="42" y2="94" stroke="${PLAID_LIGHT}" stroke-width="2.2" opacity="0.85"/>
    <line x1="54" y1="58" x2="54" y2="94" stroke="${DARK}" stroke-width="1.3" opacity="0.4"/>
    <line x1="66" y1="58" x2="66" y2="94" stroke="${PLAID_LIGHT}" stroke-width="2.2" opacity="0.85"/>
    <line x1="78" y1="58" x2="78" y2="94" stroke="${DARK}" stroke-width="1.3" opacity="0.4"/>
    <line x1="32" y1="66" x2="88" y2="66" stroke="${PLAID_LIGHT}" stroke-width="2.2" opacity="0.85"/>
    <line x1="32" y1="78" x2="88" y2="78" stroke="${DARK}" stroke-width="1.3" opacity="0.4"/>
    <line x1="32" y1="88" x2="88" y2="88" stroke="${PLAID_LIGHT}" stroke-width="2.2" opacity="0.85"/>`

  return svgWrap(
    `
    <g>
      ${shadow(60, 30)}

      <rect x="38" y="98" width="18" height="26" rx="7" fill="${DENIM}"/>
      <rect x="64" y="98" width="18" height="26" rx="7" fill="${DENIM}"/>
      ${litPanel(38, 98, 5, 26, 2.5, 0.14)}
      ${shadePanel(77, 98, 5, 26, 2.5, 0.22)}
      <path d="M 47,101 L 47,121" stroke="${DENIM_DARK}" stroke-width="1.2" stroke-dasharray="2,2" opacity="0.7"/>
      <path d="M 73,101 L 73,121" stroke="${DENIM_DARK}" stroke-width="1.2" stroke-dasharray="2,2" opacity="0.7"/>
      ${peg(47, 100)}
      ${peg(73, 100)}
      ${cowboyBoot(47, 122, -1)}
      ${cowboyBoot(73, 122, 1)}

      <rect x="30" y="54" width="60" height="44" rx="12" fill="${bodyColor}"/>
      ${plaid}
      ${litPanel(30, 54, 18, 44, 12, 0.1)}
      ${shadePanel(72, 54, 18, 44, 12, 0.12)}

      <rect x="34" y="92" width="52" height="9" rx="2" fill="${DARK}"/>
      <rect x="52" y="88" width="16" height="16" rx="3" fill="${STAR_GOLD}"/>
      <rect x="55" y="91" width="10" height="10" rx="1.5" fill="none" stroke="${accent}" stroke-width="1.4"/>
      <rect x="53" y="89" width="6" height="4" fill="#fff" opacity="0.25"/>

      <rect x="14" y="62" width="16" height="44" rx="8" fill="${bodyColor}" transform="rotate(9 22 84)"/>
      <rect x="14" y="62" width="16" height="44" rx="8" fill="#000" opacity="0.12" transform="rotate(9 22 84)"/>
      <rect x="12" y="94" width="18" height="8" rx="3" fill="${PLAID_LIGHT}" transform="rotate(9 21 98)"/>
      <circle cx="22" cy="112" r="10" fill="${accent}"/>
      <circle cx="19" cy="108" r="3" fill="#fff" opacity="0.2"/>
      ${peg(24, 66)}
      <rect x="90" y="62" width="16" height="44" rx="8" fill="${bodyColor}" transform="rotate(-9 98 84)"/>
      <rect x="94" y="94" width="18" height="8" rx="3" fill="${PLAID_LIGHT}" transform="rotate(-9 99 98)"/>
      <circle cx="98" cy="112" r="10" fill="${accent}"/>
      <circle cx="101" cy="108" r="3" fill="#fff" opacity="0.2"/>
      ${peg(96, 66)}

      <polygon points="42,54 78,54 60,72" fill="${BANDANA_BLUE}"/>
      <circle cx="60" cy="54" r="5" fill="${BANDANA_BLUE}"/>
      <path d="M 57,58 L 54,66 M 63,58 L 66,66" stroke="${BANDANA_BLUE}" stroke-width="3" stroke-linecap="round"/>
      <polygon points="46,56 60,66 50,58" fill="#fff" opacity="0.15"/>

      ${starBadge(60, 92, 20, 13, emblem, 22)}

      <circle cx="60" cy="40" r="18" fill="${FACE}"/>
      <ellipse cx="53" cy="35" rx="6" ry="4" fill="#fff" opacity="0.18"/>
      <ellipse cx="52" cy="50" rx="6" ry="3.5" fill="#e0906a" opacity="0.35"/>
      <ellipse cx="68" cy="50" rx="6" ry="3.5" fill="#e0906a" opacity="0.35"/>
      <path d="M 46,38 Q 50,34 54,37" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
      <path d="M 66,37 Q 70,34 74,38" stroke="${INK}" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>

      <ellipse cx="60" cy="30" rx="44" ry="9" fill="${accent}"/>
      <ellipse cx="60" cy="29" rx="44" ry="9" fill="#000" opacity="0.08"/>
      <path d="M 16,30 Q 11,23 18,18" fill="none" stroke="${accent}" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M 104,30 Q 109,23 102,18" fill="none" stroke="${accent}" stroke-width="5.5" stroke-linecap="round"/>
      <path d="M 42,30 C 40,10 46,1 60,1 C 74,1 80,10 78,30 Z" fill="${accent}"/>
      <path d="M 46,26 C 45,14 50,5 60,4" fill="none" stroke="#000" stroke-width="1.6" opacity="0.2"/>
      <ellipse cx="50" cy="12" rx="10" ry="6" fill="#fff" opacity="0.12"/>
      <rect x="42" y="25" width="36" height="6" fill="${DARK}" opacity="0.55"/>

      ${paintedEye(52, 42, 3.6)}
      ${paintedEye(68, 42, 3.6)}
      ${smile(60, 50, 7)}
    </g>
  `
  )
}

// Fifi (F): spring-bodied dog toy, drawn side-on (the only pose that keeps
// the coil long instead of collapsing it into a stack of rings). Seven
// tightly-packed coil turns, each with its own shine streak and shadow
// streak, are the loudest single signal in the file; floppy two-tone ears,
// a raised eyebrow and a tongue carry the "dog," not just "spring."
export function toyFifi({
  bodyColor = '#e0975a',
  accent = '#8b96a0',
  emblem = 'F',
  visorColor = '#fff6da',
} = {}) {
  const loopXs = [45, 53.5, 62, 70.5, 79, 87.5, 96]
  const coilLoops = loopXs
    .map((x, i) => {
      const cy = i % 2 === 0 ? 85 : 90
      return `
        <ellipse cx="${x}" cy="${cy}" rx="8.6" ry="17" fill="${bodyColor}"/>
        <ellipse cx="${x}" cy="${cy}" rx="8.6" ry="17" fill="none" stroke="${accent}" stroke-width="2.2"/>
        <path d="M ${x - 4},${cy - 11} Q ${x - 7.2},${cy} ${x - 4},${cy + 11}" stroke="#fff" stroke-width="1.8" opacity="0.4" fill="none"/>
        <path d="M ${x + 4.2},${cy - 9} Q ${x + 7.2},${cy} ${x + 4.2},${cy + 9}" stroke="#000" stroke-width="1.8" opacity="0.22" fill="none"/>`
    })
    .join('')

  return svgWrap(
    `
    <g>
      ${shadow(62, 54)}

      <path d="M 100,80 C 110,71 118,73 114,62" fill="none" stroke="${bodyColor}" stroke-width="7.5" stroke-linecap="round"/>
      <path d="M 101,79 C 109,71 115,73 113,64" fill="none" stroke="#fff" stroke-width="2" opacity="0.3" stroke-linecap="round"/>
      <circle cx="114" cy="62" r="3.6" fill="${accent}"/>

      <rect x="19" y="70" width="8.5" height="41" rx="4" fill="${bodyColor}" opacity="0.82"/>
      <ellipse cx="23.5" cy="113" rx="7.5" ry="5" fill="${accent}" opacity="0.82"/>
      <rect x="90" y="76" width="8.5" height="39" rx="4" fill="${bodyColor}" opacity="0.82"/>
      <ellipse cx="94.5" cy="117" rx="7.5" ry="5" fill="${accent}" opacity="0.82"/>

      ${coilLoops}
      ${litPanel(43, 68, 56, 12, 8, 0.12)}
      ${shadePanel(43, 92, 56, 12, 8, 0.14)}

      <rect x="101" y="78" width="9.5" height="41" rx="4.5" fill="${bodyColor}"/>
      <ellipse cx="105.8" cy="121" rx="8.5" ry="5.4" fill="${accent}"/>
      <path d="M 99,124 L 99,130 M 106,124 L 106,131 M 113,124 L 113,130" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
      <rect x="31" y="72" width="9.5" height="43" rx="4.5" fill="${bodyColor}"/>
      <ellipse cx="35.8" cy="118" rx="8.5" ry="5.4" fill="${accent}"/>
      <path d="M 29,121 L 29,127 M 36,121 L 36,128 M 43,121 L 43,127" stroke="${accent}" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>

      <rect x="32" y="53" width="11" height="9" fill="${accent}"/>
      <circle cx="33" cy="53" r="1.6" fill="#fff" opacity="0.7"/>
      <circle cx="41" cy="53" r="1.6" fill="#fff" opacity="0.7"/>
      <circle cx="38" cy="68" r="15" fill="${visorColor}"/>
      <circle cx="38" cy="68" r="15" fill="none" stroke="${accent}" stroke-width="1.6" opacity="0.5"/>
      <ellipse cx="34" cy="63" rx="4" ry="2.6" fill="#fff" opacity="0.5"/>
      <text x="38" y="74" text-anchor="middle" font-family="${FONT}" font-size="18" font-weight="800" fill="${accent}">${emblem}</text>

      <path d="M 33,33 C 47,35 54,53 45,76 C 39,80 29,73 29,60 C 29,49 29,39 33,33 Z" fill="${accent}"/>
      <path d="M 33,33 C 39,34 43,42 43,52" fill="none" stroke="#fff" stroke-width="1.6" opacity="0.2"/>
      <path d="M 38,44 C 42,52 42,64 36,72" fill="none" stroke="${DARK}" stroke-width="6" opacity="0.16"/>

      <ellipse cx="25" cy="45" rx="16" ry="14" fill="${bodyColor}"/>
      ${litPanel(15, 34, 14, 12, 8, 0.16)}
      <rect x="2" y="41" width="21" height="13" rx="5.5" fill="${bodyColor}"/>
      <ellipse cx="4" cy="47" rx="4.4" ry="3.4" fill="${accent}"/>
      <path d="M 6,50 Q 12,54 18,50" stroke="${DARK}" stroke-width="1.6" fill="none" stroke-linecap="round" opacity="0.5"/>
      <path d="M 4,55 Q 10,60 6,64" fill="${accent}" opacity="0.85"/>
      <path d="M 27,38 Q 32,33 37,35" stroke="${INK}" stroke-width="1.8" fill="none" stroke-linecap="round" opacity="0.7"/>
      <circle cx="29" cy="42" r="3.8" fill="${INK}"/>
      <circle cx="30.4" cy="40.8" r="1.3" fill="#fff"/>
    </g>
  `
  )
}

// Bobo (B): three-eyed alien toy. A big head (roughly two-thirds of the
// figure) carries the whole read: two ordinary eyes plus a smaller third
// eye on the forehead in a triangle arrangement, two ball-tipped antennae,
// nubby three-finger hands, and a crown-highlight/jaw-shadow pair of panels
// that round the head out without a gradient.
export function toyBobo({
  bodyColor = '#8fd6b0',
  accent = '#3f8f6e',
  emblem = 'B',
  visorColor = '#fff6da',
} = {}) {
  const fingers = (cx, cy, rot) => `
    <g transform="translate(${cx},${cy}) rotate(${rot})">
      <ellipse cx="-4" cy="0" rx="2.6" ry="4" fill="${accent}"/>
      <ellipse cx="0" cy="1.5" rx="2.6" ry="4.4" fill="${accent}"/>
      <ellipse cx="4" cy="0" rx="2.6" ry="4" fill="${accent}"/>
    </g>`

  return svgWrap(
    `
    <g>
      ${shadow(60, 32)}

      <rect x="39" y="112" width="11" height="19" rx="5.5" fill="${bodyColor}"/>
      <ellipse cx="44.5" cy="133" rx="9.5" ry="6.4" fill="${accent}"/>
      <path d="M 40,133 L 40,137 M 45,134 L 45,138 M 50,133 L 50,137" stroke="${DARK}" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>
      <rect x="70" y="112" width="11" height="19" rx="5.5" fill="${bodyColor}"/>
      <ellipse cx="75.5" cy="133" rx="9.5" ry="6.4" fill="${accent}"/>
      <path d="M 71,133 L 71,137 M 76,134 L 76,138 M 81,133 L 81,137" stroke="${DARK}" stroke-width="1.6" stroke-linecap="round" opacity="0.5"/>

      <ellipse cx="26" cy="96" rx="10" ry="14.5" fill="${bodyColor}" transform="rotate(-14 26 96)"/>
      ${fingers(21, 110, -18)}
      <ellipse cx="94" cy="96" rx="10" ry="14.5" fill="${bodyColor}" transform="rotate(14 94 96)"/>
      ${fingers(99, 110, 18)}

      <rect x="36" y="76" width="48" height="40" rx="20" fill="${bodyColor}"/>
      ${litPanel(36, 76, 20, 40, 20, 0.12)}
      ${shadePanel(64, 96, 20, 20, 20, 0.14)}
      ${emblemPlate(60, 98, 32, 25, visorColor, accent, emblem, 21, false)}

      <ellipse cx="60" cy="46" rx="34" ry="32" fill="${bodyColor}"/>
      <ellipse cx="52" cy="24" rx="20" ry="12" fill="#fff" opacity="0.14"/>
      <ellipse cx="66" cy="68" rx="24" ry="12" fill="#000" opacity="0.1"/>
      <path d="M 28,50 Q 60,57 92,50" stroke="${accent}" stroke-width="2.2" opacity="0.4" fill="none"/>

      <path d="M 44,20 Q 34,6 24,2" stroke="${accent}" stroke-width="4.4" fill="none" stroke-linecap="round"/>
      <circle cx="24" cy="2" r="5.4" fill="${accent}"/>
      <circle cx="22.6" cy="0.4" r="1.8" fill="#fff" opacity="0.6"/>
      <path d="M 76,20 Q 86,6 96,2" stroke="${accent}" stroke-width="4.4" fill="none" stroke-linecap="round"/>
      <circle cx="96" cy="2" r="5.4" fill="${accent}"/>
      <circle cx="94.6" cy="0.4" r="1.8" fill="#fff" opacity="0.6"/>

      ${bigEye(60, 28, 7.5)}
      ${bigEye(44, 50, 12)}
      ${bigEye(76, 50, 12)}
      <ellipse cx="60" cy="66" rx="8" ry="6" fill="${INK}"/>
      <ellipse cx="60" cy="64" rx="4.5" ry="3" fill="#c98fb0" opacity="0.7"/>
    </g>
  `
  )
}

// Captain Big, the merged boss form: a clear bubble-helmet astronaut in a
// white panelled suit, deliberately the biggest and busiest silhouette in
// the family. A lit chest control panel, banded joints at every wrist,
// ankle and knee, and glowing back thrusters push the detail density well
// past the other three heroes -- this is the "combined form," so it earns
// it. One visible trace of each earlier hero survives: a star on each
// shoulder pad (Leo), a trio of coil rings at the neck (Fifi), and Bobo's
// big plastic eyes looking out through the visor.
export function toyCaptainBig({
  bodyColor = '#3457a0',
  panelColor = '#f5f0e6',
  accent = '#e0a53f',
  visorColor = '#5dd6e0',
} = {}) {
  const SUIT = '#f4f2ec'
  const SUIT_SHADE = '#d8d4c8'

  return svgWrap(
    `
    <g>
      ${shadow(60, 48)}

      <rect x="12" y="86" width="17" height="37" rx="7" fill="${SUIT}"/>
      <rect x="12" y="86" width="17" height="37" rx="7" fill="${SUIT_SHADE}" opacity="0.6"/>
      <rect x="14" y="90" width="13" height="10" rx="3" fill="${accent}"/>
      <circle cx="17.5" cy="95" r="1.6" fill="${FLAME}"/>
      <circle cx="23" cy="95" r="1.6" fill="#7fe0a0"/>
      <ellipse cx="20.5" cy="127" rx="9" ry="6" fill="${FLAME}"/>
      <ellipse cx="20.5" cy="125" rx="5.5" ry="4" fill="#fff6c2" opacity="0.85"/>
      <rect x="91" y="86" width="17" height="37" rx="7" fill="${SUIT}"/>
      <rect x="91" y="86" width="17" height="37" rx="7" fill="${SUIT_SHADE}" opacity="0.6"/>
      <rect x="93" y="90" width="13" height="10" rx="3" fill="${accent}"/>
      <circle cx="96.5" cy="95" r="1.6" fill="${FLAME}"/>
      <circle cx="102" cy="95" r="1.6" fill="#7fe0a0"/>
      <ellipse cx="99.5" cy="127" rx="9" ry="6" fill="${FLAME}"/>
      <ellipse cx="99.5" cy="125" rx="5.5" ry="4" fill="#fff6c2" opacity="0.85"/>

      <rect x="41" y="102" width="14" height="18" rx="5" fill="${SUIT}"/>
      <rect x="65" y="102" width="14" height="18" rx="5" fill="${SUIT}"/>
      ${jointBand(48, 112, 9, 4.5, accent)}
      ${jointBand(72, 112, 9, 4.5, accent)}
      <rect x="34" y="118" width="26" height="17" rx="8" fill="${bodyColor}"/>
      <rect x="60" y="118" width="26" height="17" rx="8" fill="${bodyColor}"/>
      ${litPanel(34, 118, 8, 17, 8, 0.15)}
      <ellipse cx="47" cy="134" rx="12" ry="4" fill="${DARK}" opacity="0.4"/>
      <ellipse cx="73" cy="134" rx="12" ry="4" fill="${DARK}" opacity="0.4"/>

      <rect x="10" y="56" width="24" height="30" rx="9" fill="${SUIT}"/>
      <rect x="10" y="56" width="24" height="30" rx="9" fill="${SUIT_SHADE}" opacity="0.5"/>
      <polygon points="${starPoints(22, 71, 6.4, 2.8)}" fill="${bodyColor}"/>
      <rect x="86" y="56" width="24" height="30" rx="9" fill="${SUIT}"/>
      <rect x="86" y="56" width="24" height="30" rx="9" fill="${SUIT_SHADE}" opacity="0.5"/>
      <polygon points="${starPoints(98, 71, 6.4, 2.8)}" fill="${bodyColor}"/>

      <ellipse cx="33" cy="60" rx="4.2" ry="7.4" fill="none" stroke="${accent}" stroke-width="2.2"/>
      <ellipse cx="36.4" cy="64.4" rx="4.2" ry="7.4" fill="none" stroke="${accent}" stroke-width="2.2"/>
      <ellipse cx="39.8" cy="60" rx="4.2" ry="7.4" fill="none" stroke="${accent}" stroke-width="2.2"/>

      <rect x="26" y="54" width="68" height="52" rx="18" fill="${SUIT}"/>
      ${litPanel(26, 54, 22, 52, 18, 0.14)}
      ${shadePanel(72, 54, 22, 52, 18, 0.12)}
      <rect x="33" y="60" width="54" height="40" rx="12" fill="${bodyColor}"/>
      ${bolt(38, 66, accent)}
      ${bolt(82, 66, accent)}
      ${bolt(38, 94, accent)}
      ${bolt(82, 94, accent)}
      ${emblemPlate(60, 80, 34, 26, panelColor, bodyColor, '★', 26, true)}
      <rect x="40" y="90" width="12" height="5" rx="2" fill="${FLAME}" opacity="0.9"/>
      <rect x="54" y="90" width="6" height="5" rx="2" fill="#7fe0a0"/>
      <rect x="62" y="90" width="6" height="5" rx="2" fill="${visorColor}"/>

      <rect x="20" y="68" width="15" height="28" rx="7" fill="${SUIT}" transform="rotate(-12 27.5 82)"/>
      ${jointBand(27, 94, 8, 4, accent)}
      <circle cx="15" cy="98" r="15" fill="${panelColor}"/>
      <circle cx="15" cy="98" r="15" fill="none" stroke="${accent}" stroke-width="3.2"/>
      <circle cx="11" cy="93" r="4" fill="#fff" opacity="0.4"/>
      <rect x="85" y="68" width="15" height="28" rx="7" fill="${SUIT}" transform="rotate(12 92.5 82)"/>
      ${jointBand(93, 94, 8, 4, accent)}
      <circle cx="105" cy="98" r="15" fill="${panelColor}"/>
      <circle cx="105" cy="98" r="15" fill="none" stroke="${accent}" stroke-width="3.2"/>
      <circle cx="101" cy="93" r="4" fill="#fff" opacity="0.4"/>

      <circle cx="60" cy="30" r="27" fill="${accent}"/>
      <circle cx="60" cy="30" r="24.5" fill="${visorColor}" opacity="0.55"/>
      <circle cx="60" cy="30" r="24.5" fill="none" stroke="#fff" stroke-width="1.4" opacity="0.5"/>
      <path d="M 39,16 Q 48,7 60,7 Q 74,7 80,18" fill="none" stroke="#fff" stroke-width="4.5" opacity="0.45" stroke-linecap="round"/>
      <path d="M 42,44 Q 60,50 78,44" fill="none" stroke="#000" stroke-width="4" opacity="0.08" stroke-linecap="round"/>
      ${bigEye(50, 31, 9.5)}
      ${bigEye(70, 31, 9.5)}
      ${smile(60, 43, 6.5)}
    </g>
  `
  )
}

// ---------------------------------------------------------------------------
// VILLAINS. Same "assembled toy, not a body" grammar and the same v3 detail
// density as the heroes -- each one's silhouette IS its gameplay gimmick,
// drawn literally: a loose wind-up key, a yarn ball, a packing box, a
// leaning block stack, a stopped key turned emperor's sceptre. No letter
// patch (the letters belong to the heroes). Villains take only
// { bodyColor, accent }.
// ---------------------------------------------------------------------------

// Wobbly: spring wound down, moves erratically. A tin can body tilted off
// its own vertical, a wind-up key hanging loose at a wrong angle (unlike
// Wind-Down's rigid one below), a warning-stripe waist band, bent legs, a
// tin side-seam, dizzy motion arcs.
export function toyWobbly({ bodyColor = '#c9622f', accent = '#6b3013' } = {}) {
  const windupKey = (cx, cy, rot, shaftLen, ringR) => `
    <g transform="translate(${cx},${cy}) rotate(${rot})">
      <rect x="-3.6" y="0" width="7.2" height="${shaftLen}" fill="${accent}"/>
      <rect x="-3.6" y="0" width="2.6" height="${shaftLen}" fill="#fff" opacity="0.2"/>
      <circle cx="0" cy="${shaftLen + ringR + 2}" r="${ringR}" fill="none" stroke="${accent}" stroke-width="5.5"/>
      <circle cx="0" cy="${shaftLen + ringR + 2}" r="${ringR}" fill="none" stroke="#fff" stroke-width="1.4" opacity="0.3"/>
    </g>`

  return svgWrap(
    `
    <g transform="rotate(9 60 92)">
      ${shadow(58, 26)}

      <path d="M 18,118 Q 24,128 34,124" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="3,3" opacity="0.45"/>
      <path d="M 12,110 Q 20,122 32,120" fill="none" stroke="${INK}" stroke-width="1.6" stroke-dasharray="2,3" opacity="0.3"/>
      <path d="M 86,116 Q 92,124 102,120" fill="none" stroke="${INK}" stroke-width="2" stroke-dasharray="3,3" opacity="0.45"/>

      <g transform="rotate(-18 40 118)">
        <rect x="33" y="102" width="11" height="32" rx="4.5" fill="${accent}"/>
        <ellipse cx="38.5" cy="136" rx="9.5" ry="5.4" fill="${accent}"/>
        <ellipse cx="38.5" cy="134" rx="5" ry="3" fill="#fff" opacity="0.2"/>
      </g>
      <g transform="rotate(24 78 116)">
        <rect x="73" y="100" width="11" height="32" rx="4.5" fill="${accent}"/>
        <ellipse cx="78.5" cy="134" rx="9.5" ry="5.4" fill="${accent}"/>
      </g>

      ${windupKey(90, 64, 48, 24, 8.5)}

      <rect x="35" y="50" width="50" height="58" rx="18" fill="${bodyColor}"/>
      ${litPanel(35, 50, 16, 58, 18, 0.14)}
      ${shadePanel(69, 50, 16, 58, 18, 0.16)}
      <rect x="35" y="62" width="50" height="5" fill="${accent}" opacity="0.65"/>
      <rect x="35" y="94" width="50" height="5" fill="${accent}" opacity="0.65"/>
      <path d="M 60,50 L 60,108" stroke="${accent}" stroke-width="1.4" opacity="0.3" stroke-dasharray="1,3"/>

      <circle cx="60" cy="32" r="17" fill="${bodyColor}"/>
      <ellipse cx="53" cy="26" rx="7" ry="5" fill="#fff" opacity="0.14"/>

      ${villainEyes(51, 28, 71, 32, 8.2)}
      <path d="M 54,41 Q 60,35 66,41 Q 60,45 54,41" fill="none" stroke="${INK}" stroke-width="2.4"/>
    </g>
  `
  )
}

// Tangly: a yarn-ball body with wound strands, loose trailing ends, a held
// crochet hook, and small fuzzy tufts poking off the surface -- the
// tangling gimmick made literal and given more wound texture and shading
// than the v1/v2 pass had.
export function toyTangly({ bodyColor = '#8f5fc9', accent = '#4a2f80' } = {}) {
  const tuft = (cx, cy, rot) => `<path d="M 0,0 L -2.4,-6 M 0,0 L 0,-7 M 0,0 L 2.4,-6"
    transform="translate(${cx},${cy}) rotate(${rot})" stroke="${accent}" stroke-width="1.3" stroke-linecap="round" opacity="0.55"/>`

  return svgWrap(
    `
    <g transform="rotate(-6 60 90)">
      ${shadow(60, 32)}

      <path d="M 26,96 Q 10,108 14,124" fill="none" stroke="${accent}" stroke-width="4.2" stroke-linecap="round"/>
      <circle cx="14" cy="126" r="4.6" fill="${accent}"/>
      <path d="M 94,92 Q 110,100 106,116" fill="none" stroke="${accent}" stroke-width="4.2" stroke-linecap="round"/>
      <circle cx="106" cy="118" r="4.6" fill="${accent}"/>

      <ellipse cx="41" cy="118" rx="11.5" ry="8.4" fill="${bodyColor}"/>
      <ellipse cx="79" cy="118" rx="11.5" ry="8.4" fill="${bodyColor}"/>
      <path d="M 32,113 Q 41,120 50,113" fill="none" stroke="${accent}" stroke-width="2.4"/>
      <path d="M 70,113 Q 79,120 88,113" fill="none" stroke="${accent}" stroke-width="2.4"/>

      <path d="M 30,90 Q 12,84 8,68" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
      <g transform="translate(6,60) rotate(-30)">
        <rect x="-2" y="-14" width="4" height="20" rx="2" fill="${accent}"/>
        <path d="M 0,-14 Q 6,-18 4,-24" fill="none" stroke="${accent}" stroke-width="3.4" stroke-linecap="round"/>
      </g>
      <path d="M 90,88 Q 106,82 111,66" fill="none" stroke="${accent}" stroke-width="5" stroke-linecap="round"/>
      <g transform="translate(4,58) rotate(-10)">
        <rect x="0" y="0" width="11" height="15" rx="1.6" fill="${accent}"/>
        <path d="M 1,3 L 10,3 M 1,7.5 L 10,7.5 M 1,12 L 10,12" stroke="${bodyColor}" stroke-width="1.3"/>
      </g>

      <circle cx="60" cy="80" r="37" fill="${bodyColor}"/>
      ${litPanel(28, 50, 30, 26, 30, 0.16)}
      ${shadePanel(64, 96, 34, 26, 30, 0.15)}
      <path d="M 26,68 Q 60,44 94,68" stroke="${accent}" stroke-width="3.2" fill="none" opacity="0.7"/>
      <path d="M 24,86 Q 60,102 96,86" stroke="${accent}" stroke-width="3.2" fill="none" opacity="0.7"/>
      <path d="M 30,52 Q 60,86 90,110" stroke="${accent}" stroke-width="2.8" fill="none" opacity="0.55"/>
      <path d="M 90,52 Q 60,86 30,110" stroke="${accent}" stroke-width="2.8" fill="none" opacity="0.55"/>
      <path d="M 34,102 Q 60,116 86,102" stroke="${accent}" stroke-width="2.4" fill="none" opacity="0.4"/>
      ${tuft(30, 58, -20)}
      ${tuft(90, 58, 20)}
      ${tuft(60, 44, 0)}
      ${tuft(38, 108, 20)}
      ${tuft(82, 108, -20)}

      <circle cx="44" cy="52" r="7.4" fill="none" stroke="${accent}" stroke-width="4.6"/>
      <circle cx="76" cy="52" r="7.4" fill="none" stroke="${accent}" stroke-width="4.6"/>

      ${villainEyes(49, 74, 73, 78, 9.4)}
      ${villainSmirk(60, 92, 9.4)}
      <path d="M 30,70 L 35,73 M 33,68 L 30,73" stroke="${INK}" stroke-width="1.4" opacity="0.6"/>
    </g>
  `
  )
}

// Boxxy: a packing box body with a hinged flap "mouth," corrugated edge
// ribbing, crossed tape seams, a hazard-tag scribble (no letterforms), and
// a padlock held in one flap-arm -- "locks toys away" drawn as an object a
// child can name at a glance.
export function toyBoxxy({ bodyColor = '#c9a35a', accent = '#6b4423' } = {}) {
  const ribs = []
  for (let x = 33; x <= 87; x += 6) ribs.push(`<line x1="${x}" y1="58" x2="${x}" y2="110" stroke="${accent}" stroke-width="1" opacity="0.18"/>`)

  return svgWrap(
    `
    <g>
      ${shadow(60, 32)}

      <rect x="27" y="106" width="19" height="17" rx="2.5" fill="${bodyColor}"/>
      <rect x="27" y="106" width="19" height="17" rx="2.5" fill="#000" opacity="0.08"/>
      <rect x="74" y="106" width="19" height="17" rx="2.5" fill="${bodyColor}"/>
      <rect x="27" y="119" width="19" height="6" fill="${accent}"/>
      <rect x="74" y="119" width="19" height="6" fill="${accent}"/>

      <polygon points="34,64 25,57 10,72 6,88 26,80" fill="${bodyColor}"/>
      <polygon points="86,64 95,57 110,72 114,88 94,80" fill="${bodyColor}"/>
      <g transform="translate(8,75) rotate(-8)">
        <rect x="0" y="0" width="13" height="11" rx="2" fill="${accent}"/>
        <rect x="1.5" y="1.5" width="10" height="8" rx="1.4" fill="none" stroke="#fff" stroke-width="0.9" opacity="0.3"/>
        <path d="M 3,0 Q 3,-6.5 9.5,-6.5 Q 16,-6.5 16,0" fill="none" stroke="${accent}" stroke-width="3.2"/>
        <circle cx="6.5" cy="5.5" r="1.6" fill="${bodyColor}"/>
      </g>

      <rect x="29" y="55" width="62" height="58" rx="3" fill="${bodyColor}"/>
      ${litPanel(29, 55, 20, 58, 3, 0.12)}
      ${shadePanel(71, 55, 20, 58, 3, 0.12)}
      ${ribs.join('')}
      <rect x="57" y="55" width="6" height="58" fill="${accent}"/>
      <rect x="29" y="83" width="62" height="6" fill="${accent}"/>

      <polygon points="29,57 91,57 82,80 38,80" fill="${bodyColor}"/>
      <polygon points="37,59 83,59 76,73 44,73" fill="#17120c"/>
      <polygon points="46,61 55,61 50,70" fill="${accent}" opacity="0.75"/>
      <polygon points="65,61 74,61 69,70" fill="${accent}" opacity="0.75"/>

      <g transform="translate(70,64) rotate(-6)">
        <circle cx="0" cy="0" r="6.4" fill="none" stroke="#c94a3a" stroke-width="1.6" opacity="0.7"/>
        <path d="M -4,0 L 4,0 M 0,-4 L 0,4" stroke="#c94a3a" stroke-width="1.4" opacity="0.6"/>
      </g>

      <rect x="39" y="39" width="15" height="4.4" fill="${INK}" transform="rotate(-8 46.5 41.2)"/>
      <rect x="66" y="39" width="15" height="4.4" fill="${INK}" transform="rotate(8 73.5 41.2)"/>
      <circle cx="45" cy="46" r="4.8" fill="#fff"/>
      <circle cx="46.6" cy="47.2" r="2.6" fill="${INK}"/>
      <circle cx="75" cy="46" r="4.8" fill="#fff"/>
      <circle cx="76.6" cy="47.2" r="2.6" fill="${INK}"/>
    </g>
  `
  )
}

// Tumbles: a leaning tower of blocks, mid-topple, one arm flailing up.
// Every block now carries its own top-edge highlight and side-edge shadow
// (the "assembled from separate pieces" read gets louder, not just the
// silhouette), and the debris chips mix diamonds and small triangles at
// scattered sizes/opacities, never two in a row on the same edge, so the
// erosion cannot settle into a straight line or right angle that would
// read as a letterform.
export function toyTumbles({ bodyColor = '#4f8fc9', accent = '#245080' } = {}) {
  const diamond = (cx, cy, s, op) =>
    `<rect x="${-s / 2}" y="${-s / 2}" width="${s}" height="${s}" fill="${accent}" opacity="${op}" transform="translate(${cx},${cy}) rotate(45)"/>`
  const shard = (cx, cy, s, op, rot) =>
    `<polygon points="0,${-s / 2} ${s / 2},${s / 2} ${-s / 2},${s / 2}" fill="${accent}" opacity="${op}" transform="translate(${cx},${cy}) rotate(${rot})"/>`
  const block = (x, y, w, h, rot) => `
    <g transform="rotate(${rot} ${x + w / 2} ${y + h})">
      <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="3" fill="${bodyColor}"/>
      <rect x="${x}" y="${y}" width="${w}" height="${h * 0.28}" rx="3" fill="#fff" opacity="0.16"/>
      <rect x="${x + w * 0.78}" y="${y}" width="${w * 0.22}" height="${h}" fill="#000" opacity="0.14"/>
      <rect x="${x}" y="${y - 4}" width="${w}" height="4" fill="${accent}"/>
    </g>`

  return svgWrap(
    `
    <g transform="rotate(11 55 90)">
      ${shadow(58, 32)}

      ${diamond(13, 96, 7, 0.55)}
      ${shard(5, 112, 5, 0.35, 20)}
      ${diamond(20, 118, 6, 0.45)}
      ${shard(100, 70, 5, 0.4, -15)}
      ${diamond(108, 84, 7, 0.3)}
      ${shard(112, 100, 4, 0.3, 40)}

      ${block(40, 112, 18, 20, 0)}
      ${block(66, 116, 16, 16, 0)}
      ${block(38, 88, 46, 26, 0)}
      ${block(10, 70, 18, 16, -24)}
      ${block(42, 60, 40, 30, 0)}
      ${block(46, 32, 34, 30, 0)}

      ${villainEyes(55, 44, 73, 42, 8.2)}
      <ellipse cx="63" cy="53" rx="5.2" ry="6.2" fill="${INK}"/>
    </g>
  `
  )
}

// Wind-Down, the chapter boss: stops every toy's key. A "sinister space
// emperor" -- a flowing scalloped-hem cape, jewelled gold epaulettes, a
// spiked and gemmed crown, a sceptre -- deliberately the biggest and
// darkest silhouette in the family. The gimmick survives in two places: the
// sceptre's finial is the same rigid, dead-straight wind-up key Wobbly's
// hangs loose and off-axis, and the chest medallion keeps the frozen
// clock-hands from the original design, now set in a jewelled bezel.
export function toyWindDown({ bodyColor = '#332c45', accent = '#6f5bd0' } = {}) {
  return svgWrap(
    `
    <g>
      ${shadow(60, 52)}

      <path d="M 30,50 C 10,70 4,110 10,136 L 34,124 L 60,128 L 86,124 L 110,136
               C 116,110 110,70 90,50 C 78,60 66,64 60,64 C 54,64 42,60 30,50 Z" fill="${bodyColor}"/>
      <path d="M 30,50 C 16,68 10,98 13,122 L 30,113 C 26,92 28,68 38,54 Z" fill="${accent}" opacity="0.3"/>
      <path d="M 34,120 L 60,124 L 86,120" fill="none" stroke="${EMPEROR_GOLD}" stroke-width="2" opacity="0.6"/>
      <path d="M 90,50 C 108,70 114,110 108,136" fill="none" stroke="#000" stroke-width="3" opacity="0.15"/>

      <rect x="48" y="122" width="12" height="14" rx="3" fill="${DARK}"/>
      <rect x="60" y="122" width="12" height="14" rx="3" fill="${DARK}"/>

      <rect x="34" y="52" width="52" height="48" rx="10" fill="${bodyColor}"/>
      ${litPanel(34, 52, 16, 48, 10, 0.1)}
      ${shadePanel(70, 52, 16, 48, 10, 0.16)}
      <rect x="34" y="72" width="52" height="6" fill="${accent}" opacity="0.5"/>

      <g transform="translate(34,58)">
        <path d="M 0,0 C -14,-4 -22,4 -20,14 C -10,18 4,14 8,4 Z" fill="${EMPEROR_GOLD}"/>
        <path d="M -18,10 L -22,20 M -10,14 L -12,24 M -2,15 L -2,25"
          stroke="${EMPEROR_GOLD}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="-10" cy="6" r="2.6" fill="#c94a8a"/>
      </g>
      <g transform="translate(86,58) scale(-1,1)">
        <path d="M 0,0 C -14,-4 -22,4 -20,14 C -10,18 4,14 8,4 Z" fill="${EMPEROR_GOLD}"/>
        <path d="M -18,10 L -22,20 M -10,14 L -12,24 M -2,15 L -2,25"
          stroke="${EMPEROR_GOLD}" stroke-width="3" stroke-linecap="round"/>
        <circle cx="-10" cy="6" r="2.6" fill="#c94a8a"/>
      </g>

      <rect x="16" y="60" width="14" height="38" rx="6" fill="${bodyColor}" transform="rotate(-8 23 79)"/>
      <rect x="16" y="40" width="5" height="58" rx="2" fill="${EMPEROR_GOLD}"/>
      <circle cx="18.5" cy="36" r="7" fill="${EMPEROR_GOLD}"/>
      <circle cx="18.5" cy="22" r="6" fill="none" stroke="${EMPEROR_GOLD}" stroke-width="4"/>
      <circle cx="19" cy="97" r="8" fill="${DARK}"/>

      <circle cx="60" cy="78" r="21" fill="${EMPEROR_GOLD}"/>
      <circle cx="60" cy="78" r="18" fill="${PLATE}"/>
      <circle cx="60" cy="78" r="18" fill="${bodyColor}" opacity="0.12"/>
      <circle cx="60" cy="60" r="1.6" fill="${accent}"/>
      <circle cx="60" cy="96" r="1.6" fill="${accent}"/>
      <circle cx="42" cy="78" r="1.6" fill="${accent}"/>
      <circle cx="78" cy="78" r="1.6" fill="${accent}"/>
      <rect x="59" y="65" width="2" height="13" fill="${INK}" transform="rotate(35 60 78)"/>
      <rect x="59" y="69" width="1.6" height="9" fill="${INK}" transform="rotate(-70 60 78)"/>
      <circle cx="60" cy="78" r="2.2" fill="${INK}"/>

      <path d="M 40,30 L 44,8 L 52,22 L 60,2 L 68,22 L 76,8 L 80,30 Z" fill="${EMPEROR_GOLD}"/>
      <circle cx="52" cy="17" r="2.4" fill="#c94a8a"/>
      <circle cx="60" cy="10" r="2.6" fill="#4ab0c9"/>
      <circle cx="68" cy="17" r="2.4" fill="#c94a8a"/>
      <rect x="38" y="28" width="44" height="8" rx="3" fill="${bodyColor}"/>

      <circle cx="60" cy="40" r="18" fill="${bodyColor}"/>
      <ellipse cx="53" cy="34" rx="7" ry="5" fill="#fff" opacity="0.1"/>

      ${villainEyes(51, 38, 71, 42, 8.4)}
      ${villainSmirk(60, 50, 9.4)}
    </g>
  `
  )
}
