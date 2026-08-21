// "Pokemon-genre" companion-creature art (chapter 4). A fourth drawing
// language, deliberately unlike the other three: src/art/robots.js (angular
// human-shaped machines), src/art/dinosaurs.js (bezier animals, upright,
// human-scale, side-on), src/art/platformer.js (2.5-head sprite PEOPLE in
// caps and gloves). This file draws no person at all -- every figure is a
// small round non-humanoid critter, front-facing, that a child would want to
// "catch." It deliberately borrows none of a real creature-collecting
// franchise's specific silhouettes, colours, or ball/badge trade dress --
// see the file-level warning in the project brief. Only the *genre* (round
// elemental companion monsters with a species gimmick) is reused.
//
// DESIGN GRAMMAR -- every figure in this file follows all of it.
//
//  1. ONE ROUND MASS, HEAD FUSED TO BODY. No neck, no torso/head seam, no
//     articulated limb joints -- a single big ellipse "blob" is the whole
//     figure. This is the loudest signal that separates the family from the
//     three human-shaped casts: nothing here has a human proportion to
//     compare against.
//  2. TINY STUB LIMBS FLOATING OFF THE BLOB. Paws and feet are small
//     separate ellipses with a gap of visible background between them and
//     the body -- never a jointed arm/leg shape. They read as "a round
//     animal standing" rather than "a person."
//  3. GIANT EYES, NO OTHER FACE DETAIL BUDGET. Two big white-sclera eyes
//     with a round pupil + highlight dot (heroes) or one-sided squint +
//     tiny fang (villains) carry the entire expression. A single short
//     mouth stroke is the only other face mark.
//  4. ONE SPECIES FEATURE PER CHARACTER breaks the round-blob sameness and
//     doubles as the phonics gimmick made literal: a rocket tail, magnet
//     horns, a drill snout, bat wings, a puddle-melt, a stolen magnet, a
//     cork-segmented shell, a gaping pixel-shedding maw. Colour alone must
//     never be the only distinguishing signal.
//  5. ELEMENTAL COLOUR, NEVER THE FRANCHISE PALETTE. Each hero reads as a
//     "type" through a warm/cool colour choice (ember red, static blue,
//     earth amber), but none of them use the red/white two-tone or a
//     circular midline seam -- that specific two-tone + seam combination is
//     the one thing this family must never draw.
//  6. THE EMBLEM IS A CHEST BADGE, sized past good taste (same rule as
//     every other family): it is the phonics letter, so it has to survive a
//     66 px box, where this 120x140 viewBox letterboxes to 57x66 -- under
//     half a pixel per viewBox unit, so any detail thinner than ~3 units
//     disappears. Villains carry no badge; the letters belong to the heroes.
//  7. FLAT FILLS ONLY. Ellipses, circles and a handful of paths/polygons for
//     the pointed species features (horns, wings, fins, shell ridges). No
//     gradients, no filters, no `rx` needed since almost nothing here is a
//     rectangle.
//
// `visorColor` names the EMBLEM BADGE fill here (the family has no visor
// either) -- report this at integration time the way dinosaurs.js and
// platformer.js did, so the palette table omits it from anywhere a real
// visor is expected.
//
// This file must not import ../art.js (circular); it carries its own svgWrap.

function svgWrap(inner, viewBox = '0 0 120 140') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

// Mirrors arbitrary drawing content about the centre line via a transform --
// the creature parts are ellipses/paths, not polygon point lists, so the
// robots' point-rewrite trick does not apply (dinosaurs.js and
// platformer.js hit the same constraint and solved it the same way).
function mirrored(inner) {
  return `<g transform="translate(120,0) scale(-1,1)">${inner}</g>`
}

const BELLY = '#faeecb' // warm underside patch shared by the whole cast, like dinosaurs' BELLY
const PUPIL = '#2b2118' // warm dark, never the robots' cold grey
const INK = '#2b2118' // mouth / villain brow strokes, same warm dark as PUPIL
const FLAME = '#ffb020' // fixed jet-exhaust colour, independent of body palette
const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Big friendly eye: white sclera, round pupil, one highlight dot. Shared so
// all four heroes read as the same cast, the same role dinosaurs.js' eye()
// and platformer.js' face() play for their families.
function eye(cx, cy, r) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>
    <circle cx="${cx + r * 0.28}" cy="${cy + r * 0.1}" r="${r * 0.52}" fill="${PUPIL}"/>
    <circle cx="${cx + r * 0.5}" cy="${cy - r * 0.28}" r="${r * 0.2}" fill="#fff"/>`
}

// Villain eye: one relaxed round eye plus one squint-and-brow, so the face
// reads as sly/mischievous rather than frightened symmetry -- kept
// friendly-not-scary per the 5-year-old audience rule that every other
// family's villains already follow.
function wildEyes(cx1, cx2, cy, r) {
  return `
    ${eye(cx1, cy, r)}
    <ellipse cx="${cx2}" cy="${cy + r * 0.3}" rx="${r}" ry="${r * 0.42}" fill="#fff"/>
    <ellipse cx="${cx2 + r * 0.15}" cy="${cy + r * 0.3}" rx="${r * 0.46}" ry="${r * 0.3}" fill="${PUPIL}"/>
    <path d="M ${cx2 - r * 1.1},${cy - r * 0.9} L ${cx2 + r * 0.6},${cy - r * 0.3}"
      stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
}

// Small mouth: a closed smile for heroes, an open-corner smirk with one
// fang for villains. Kept on the same one-stroke-plus-a-triangle budget so
// both survive 66 px.
function smile(cx, cy, w) {
  return `<path d="M ${cx - w},${cy} Q ${cx},${cy + w * 0.7} ${cx + w},${cy}"
    fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>`
}
function smirk(cx, cy, w) {
  return `
    <path d="M ${cx - w},${cy - w * 0.2} Q ${cx},${cy + w * 0.55} ${cx + w},${cy}"
      fill="none" stroke="${INK}" stroke-width="2.6" stroke-linecap="round"/>
    <path d="M ${cx - w * 0.3},${cy + w * 0.2} L ${cx - w * 0.15},${cy + w * 0.75} L ${cx},${cy + w * 0.25} Z" fill="#fff"/>`
}

// Chest badge: the phonics letter, oversized on purpose (see file header).
function emblemBadge(cx, cy, r, plateColor, textColor, label, size) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${plateColor}"/>
    <text x="${cx}" y="${cy + size * 0.36}" text-anchor="middle" font-family="${FONT}"
      font-size="${size}" font-weight="800" fill="${textColor}">${label}</text>`
}

// The shared blob: one big body ellipse + a lighter belly patch. Every hero
// and villain in the file paints this first and then adds its own species
// feature and limbs on top, the same layering dinosaurs.js' farLimb()/eye()
// helpers support without dictating the whole figure.
function blob(bodyColor, cx = 60, cy = 90, rx = 36, ry = 42) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${bodyColor}"/>
    <ellipse cx="${cx}" cy="${cy + ry * 0.24}" rx="${rx * 0.62}" ry="${ry * 0.62}" fill="${BELLY}"/>`
}

// Stub paws + stub feet -- kept as separate floating ellipses (see grammar
// rule 2) so nothing here reads as a jointed human arm or leg.
function paws(accent, cy = 92) {
  return `
    <ellipse cx="21" cy="${cy}" rx="11" ry="13" fill="${accent}"/>
    <ellipse cx="99" cy="${cy}" rx="11" ry="13" fill="${accent}"/>`
}
function feet(accent) {
  return `
    <ellipse cx="41" cy="128" rx="13" ry="8" fill="${accent}"/>
    <ellipse cx="79" cy="128" rx="13" ry="8" fill="${accent}"/>`
}

// Default rounded ear nub, used by any hero/villain whose species feature
// is not on the head.
function roundEars(bodyColor) {
  return `
    <ellipse cx="39" cy="45" rx="9" ry="13" fill="${bodyColor}"/>
    <ellipse cx="81" cy="45" rx="9" ry="13" fill="${bodyColor}"/>`
}

// ---------------------------------------------------------------------------
// HEROES
// ---------------------------------------------------------------------------

// Rocket (R): a small back-mounted rocket pod with fins and a flame trail is
// the whole silhouette read, worn slung over one shoulder so it pokes past
// the body outline even head-on. The figure leans into its own thrust
// (a whole-group rotate, the same trick platJumper's punch pose relies on)
// and two short speed-strokes trail the opposite way to sell the launch.
export function creatureRocket({
  bodyColor = '#ef5b3c',
  accent = '#9c2e1d',
  emblem = 'R',
  visorColor = '#fff3c4',
} = {}) {
  return svgWrap(
    `
    <g transform="rotate(-7 60 92)">
      <ellipse cx="58" cy="134" rx="30" ry="5" fill="#000" opacity="0.12"/>

      <path d="M 6,70 L 22,80 M 2,86 L 20,92" stroke="${accent}" stroke-width="3" stroke-linecap="round" opacity="0.5"/>

      ${blob(bodyColor)}
      ${paws(accent)}
      ${feet(accent)}

      <path d="M 33,40 C 30,28 36,20 42,24 C 46,30 44,40 40,46 Z" fill="${bodyColor}"/>
      <path d="M 87,40 C 90,28 84,20 78,24 C 74,30 76,40 80,46 Z" fill="${bodyColor}"/>

      <g transform="translate(93,70) rotate(30)">
        <polygon points="-6,17 0,38 6,17" fill="${FLAME}"/>
        <polygon points="-3,17 0,29 3,17" fill="#fff8e0"/>
        <polygon points="-11,10 -21,27 -6,19" fill="${accent}"/>
        <polygon points="11,10 21,27 6,19" fill="${accent}"/>
        <path d="M -9,-25 C -9,-35 9,-35 9,-25 L 10,12 L -10,12 Z" fill="${accent}"/>
        <rect x="-7" y="-11" width="14" height="13" fill="${bodyColor}"/>
        <circle cx="0" cy="-23" r="4.5" fill="#fff"/>
      </g>

      ${eye(45, 76, 12)}
      ${eye(75, 76, 12)}
      ${smile(60, 92, 8)}

      ${emblemBadge(60, 108, 18, visorColor, accent, emblem, 24)}
    </g>
  `
  )
}

// Magno (M): a horseshoe magnet grown as a pair of head horns, one leg
// tipped red and the other blue on each horn -- the magnet motif made into
// anatomy instead of a held prop. The horns are the only asymmetric-coloured
// detail on an otherwise calm, upright figure.
export function creatureMagno({
  bodyColor = '#3f7ad1',
  accent = '#1d3f7a',
  emblem = 'M',
  visorColor = '#fff3c4',
} = {}) {
  const horn = `
    <path d="M -9,-15 C -9,-27 9,-27 9,-15 L 9,5 C 9,9 3,9 3,5 L 3,-14
             C 3,-19 -3,-19 -3,-14 L -3,5 C -3,9 -9,9 -9,5 Z" fill="${accent}"/>
    <rect x="-8.5" y="1" width="6.5" height="6.5" rx="1.4" fill="#d1332f"/>
    <rect x="2.5" y="1" width="6.5" height="6.5" rx="1.4" fill="#2f5fb0"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="134" rx="30" ry="5" fill="#000" opacity="0.12"/>

      <g transform="translate(35,42) rotate(-12)">${horn}</g>
      <g transform="translate(85,42) rotate(12) scale(-1,1)">${horn}</g>

      ${blob(bodyColor)}
      ${paws(accent)}
      ${feet(accent)}

      ${eye(45, 76, 12)}
      ${eye(75, 76, 12)}
      ${smile(60, 92, 8)}

      ${emblemBadge(60, 108, 18, visorColor, accent, emblem, 24)}
    </g>
  `
  )
}

// Drillo (D): a twist-striped drill bit for a nose horn, angled slightly
// down as if already boring into the ground -- the only hero whose species
// feature sits on the face rather than the head or back.
export function creatureDrillo({
  bodyColor = '#c98a2e',
  accent = '#6b4310',
  emblem = 'D',
  visorColor = '#fff3c4',
} = {}) {
  // Diagonal bands (rather than straight horizontal rings) so the cone
  // reads as a twisted drill thread instead of a candy-striped horn.
  const drill = `
    <polygon points="0,-36 16,7 -16,7" fill="${accent}"/>
    <path d="M -13,-19 L 14,-6 L 11,0 L -16,-13 Z" fill="${bodyColor}"/>
    <path d="M -9,-29 L 12,-18 L 9,-13 L -12,-24 Z" fill="${bodyColor}"/>
    <path d="M -4,-35 L 9,-28 L 7,-24 L -7,-30 Z" fill="${bodyColor}"/>
    <circle cx="0" cy="5" r="6" fill="${accent}"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="58" cy="134" rx="30" ry="5" fill="#000" opacity="0.12"/>

      ${blob(bodyColor)}
      ${roundEars(bodyColor)}
      ${paws(accent)}
      ${feet(accent)}

      <g transform="translate(60,74) rotate(8)">${drill}</g>

      ${eye(41, 72, 11)}
      ${eye(79, 72, 11)}
      ${smile(60, 98, 8)}

      ${emblemBadge(60, 112, 18, visorColor, accent, emblem, 24)}
    </g>
  `
  )
}

// Captain Red, the evolved/merged boss form: deliberately the biggest blob
// in the family, with a trace of every earlier hero fused onto it -- a
// scaled-down rocket pod on the back, small magnet-tipped horn stubs, and a
// short drill-ridged nose -- the same "one visible trace of each ancestor"
// rule dinoHorned, heroDeluxeRobot and platPowerup all follow for their
// chapter bosses.
export function creatureCaptainRed({
  bodyColor = '#d1332f',
  panelColor = '#fff6df',
  accent = '#8a1f1f',
  visorColor = '#5dd6e0',
} = {}) {
  const smallHorn = `
    <path d="M -6,-10 C -6,-18 6,-18 6,-10 L 6,3 C 6,6 2,6 2,3 L 2,-9
             C 2,-13 -2,-13 -2,-9 L -2,3 C -2,6 -6,6 -6,3 Z" fill="${accent}"/>
    <rect x="-5.5" y="0" width="4.5" height="4.5" fill="#d1332f"/>
    <rect x="1" y="0" width="4.5" height="4.5" fill="#2f5fb0"/>`
  const smallDrill = `
    <polygon points="0,-18 8,3 -8,3" fill="${accent}"/>
    <path d="M -5,-8 L 5,-8 L 4,-3 L -4,-3 Z" fill="${panelColor}"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="40" ry="6" fill="#000" opacity="0.16"/>

      <g transform="translate(30,44) rotate(-14)">${smallHorn}</g>
      <g transform="translate(90,44) rotate(14) scale(-1,1)">${smallHorn}</g>

      ${blob(bodyColor, 60, 92, 42, 46)}
      <ellipse cx="21" cy="94" rx="13" ry="15" fill="${accent}"/>
      <ellipse cx="99" cy="94" rx="13" ry="15" fill="${accent}"/>
      <ellipse cx="39" cy="130" rx="16" ry="9" fill="${accent}"/>
      <ellipse cx="81" cy="130" rx="16" ry="9" fill="${accent}"/>

      <g transform="translate(97,64) rotate(30)">
        <polygon points="-7,15 0,37 7,15" fill="${FLAME}"/>
        <polygon points="-11,9 -21,27 -5,19" fill="${accent}"/>
        <polygon points="11,9 21,27 5,19" fill="${accent}"/>
        <path d="M -10,-27 C -10,-37 10,-37 10,-27 L 11,11 L -11,11 Z" fill="${accent}"/>
        <rect x="-8" y="-12" width="16" height="14" fill="${panelColor}"/>
      </g>

      <g transform="translate(60,82) rotate(6)">${smallDrill}</g>

      ${eye(42, 74, 13)}
      ${eye(78, 74, 13)}
      ${smile(60, 92, 9)}

      ${emblemBadge(60, 111, 21, panelColor, bodyColor, '★', 27)}
    </g>
  `
  )
}

// ---------------------------------------------------------------------------
// VILLAINS. Same round-blob, big-eyed language as the heroes so the two
// belong in one battle scene, but wild/feral instead of tame: tilted
// postures, a mischievous squint-and-fang face instead of the heroes'
// friendly symmetric eyes, and no chest badge (the letters belong to the
// heroes). Each one's silhouette is its gameplay gimmick made literal, the
// way the chapter 2/3 villains worked. Villains take only
// { bodyColor, accent }.
// ---------------------------------------------------------------------------

// Flippy: inverts the child's jump. Drawn as an ordinary standing creature
// with small bat wings instead of paws, then flipped vertically -- the same
// trick dinoUpside and platFlip used -- so it hangs feet-up, head-down.
export function creatureFlippy({ bodyColor = '#8a5fd1', accent = '#4a3480' } = {}) {
  // Wide membrane wing, notched trailing edge (the same "wide mass plus
  // notches" fix platPowerup's wing needed once smooth lobes read as rabbit
  // ears): it has to be the dominant silhouette so the figure reads as a
  // bat even before anyone notices it is upside down.
  const wing = `
    <polygon points="30,70 4,46 -8,50 -2,58 -14,58 -4,66 -16,68 -4,76 22,90" fill="${accent}"/>
    <polygon points="24,70 6,52 -4,56 16,80" fill="${bodyColor}" opacity="0.4"/>`
  const clawFoot = (cx) => `
    <ellipse cx="${cx}" cy="126" rx="11" ry="7" fill="${accent}"/>
    <path d="M ${cx - 8},129 L ${cx - 12},137 M ${cx},131 L ${cx},139 M ${cx + 8},129 L ${cx + 12},137"
      stroke="${accent}" stroke-width="2.8" stroke-linecap="round"/>`

  const upright = `
    ${wing}
    ${mirrored(wing)}
    ${blob(bodyColor)}
    ${clawFoot(41)}
    ${clawFoot(79)}

    <path d="M 33,42 C 29,30 34,20 40,24 C 44,32 42,42 38,48 Z" fill="${bodyColor}"/>
    <path d="M 87,42 C 91,30 86,20 80,24 C 76,32 78,42 82,48 Z" fill="${bodyColor}"/>

    ${wildEyes(45, 76, 76, 12)}
    ${smirk(60, 94, 8)}
  `

  return svgWrap(
    `
    <g transform="rotate(6 60 78)">
      <ellipse cx="63" cy="132" rx="26" ry="4.6" fill="#000" opacity="0.12"/>
      <g transform="translate(0,140) scale(1,-1)">${upright}</g>
    </g>
  `
  )
}

// Slippy: melts the floor so nothing can grip it. No feet at all -- the
// lower half of the blob dissolves into a puddle with drips, one paw droops
// lower than the other so the melt reads as ongoing, the same language
// platSlime and dinoSwamp use for their own "no legs" villains.
export function creatureSlippy({ bodyColor = '#4fb08f', accent = '#1f5c48' } = {}) {
  return svgWrap(
    `
    <g transform="rotate(-5 60 100)">
      <path d="M 14,118 C 28,112 36,122 50,116 C 64,110 74,120 88,114 C 100,110 108,116 108,120
               C 104,128 86,132 60,132 C 34,132 16,127 14,118 Z" fill="${accent}" opacity="0.55"/>

      <path d="M 30,62 C 22,70 20,80 26,86 C 20,92 22,100 30,102 L 25,111" fill="none"
        stroke="${bodyColor}" stroke-width="13" stroke-linecap="round"/>
      <path d="M 88,64 C 96,70 98,76 94,80 L 98,88" fill="none"
        stroke="${bodyColor}" stroke-width="13" stroke-linecap="round"/>

      <path d="M 60,50 C 84,50 96,68 92,94 C 89,112 76,122 60,122 C 44,122 31,112 28,94
               C 24,68 36,50 60,50 Z" fill="${bodyColor}"/>
      <ellipse cx="60" cy="98" rx="21" ry="20" fill="${BELLY}"/>
      <path d="M 40,102 C 50,112 70,112 80,102 C 82,112 68,120 58,120 C 46,120 38,110 40,102 Z"
        fill="#fff" opacity="0.22"/>

      <path d="M 44,108 C 42,116 43,122 47,124 C 51,122 51,114 48,107 Z" fill="${bodyColor}"/>
      <path d="M 68,110 C 67,115 68,119 71,120 C 74,118 73,113 71,109 Z" fill="${bodyColor}"/>

      ${wildEyes(46, 72, 72, 12)}
      ${smirk(60, 90, 8)}
    </g>
  `
  )
}

// Grabby: stole Magno's horseshoe magnet and wears it slung on its back with
// the poles swapped -- red sits where Magno's blue leg sits, and blue where
// Magno's red leg sits -- so the theft reads as a colour inversion, not just
// a relocated prop. The magnet's weight is what tips the whole figure off
// balance, the same tilt logic platMagnetjack uses.
export function creatureGrabby({ bodyColor = '#c9622f', accent = '#6b3013' } = {}) {
  return svgWrap(
    `
    <g transform="rotate(-10 60 90)">
      <ellipse cx="58" cy="132" rx="28" ry="4.6" fill="#000" opacity="0.12"/>

      <g transform="translate(94,58) rotate(18)">
        <path d="M -9,-15 C -9,-27 9,-27 9,-15 L 9,5 C 9,9 3,9 3,5 L 3,-14
                 C 3,-19 -3,-19 -3,-14 L -3,5 C -3,9 -9,9 -9,5 Z" fill="${accent}"/>
        <rect x="-8.5" y="1" width="6.5" height="6.5" rx="1.4" fill="#2f5fb0"/>
        <rect x="2.5" y="1" width="6.5" height="6.5" rx="1.4" fill="#d1332f"/>
      </g>

      ${blob(bodyColor)}
      ${roundEars(bodyColor)}
      ${paws(accent)}
      ${feet(accent)}

      ${wildEyes(45, 76, 76, 12)}
      ${smirk(60, 94, 8)}
    </g>
  `
  )
}

// Corky: wears a cork/brick-textured armadillo shell across its back -- a
// row of rounded plates with a plank-grain stripe on each, the same seam
// language platBrick's cork-plug hero used for its shoulder loads -- and
// curls slightly forward like it is already bracing to block a hole.
export function creatureCorky({ bodyColor = '#a8763a', accent = '#5c3d18' } = {}) {
  const plate = (x, y, w, h) =>
    `<path d="M ${x - w},${y} C ${x - w},${y - h} ${x + w},${y - h} ${x + w},${y}
              C ${x + w},${y + h * 0.4} ${x - w},${y + h * 0.4} ${x - w},${y} Z" fill="${accent}"/>
     <path d="M ${x},${y - h * 0.7} L ${x},${y + h * 0.2}" stroke="${bodyColor}" stroke-width="1.6" opacity="0.6"/>`

  return svgWrap(
    `
    <g transform="rotate(5 60 92)">
      <ellipse cx="60" cy="132" rx="32" ry="5" fill="#000" opacity="0.12"/>

      ${blob(bodyColor, 60, 90, 38, 40)}

      ${plate(38, 58, 9, 13)}
      ${plate(58, 54, 10, 15)}
      ${plate(78, 58, 9, 13)}
      ${plate(94, 68, 8, 11)}

      ${roundEars(bodyColor)}
      ${paws(accent)}
      ${feet(accent)}

      ${wildEyes(45, 76, 76, 12)}
      ${smirk(60, 92, 8)}
    </g>
  `
  )
}

// Pixel Muncher, the chapter boss: deliberately the biggest and heaviest
// figure in the family. A dark void mouth takes up most of the front of the
// blob, and it is shedding itself along one flank as scattered checkerboard
// squares at mixed sizes and opacities, never two in a row on the same edge,
// so the erosion cannot settle into a straight line or right angle that
// would read as a letterform -- the same constraint platGlitch's shedding
// villain had to satisfy for the same reason.
export function creatureMuncher({ bodyColor = '#3d3d46', accent = '#7d5fe0' } = {}) {
  const bit = (x, y, s, fill, op) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fill}" opacity="${op}"/>`

  return svgWrap(
    `
    <g transform="rotate(-4 60 84)">
      <ellipse cx="60" cy="136" rx="42" ry="6" fill="#000" opacity="0.15"/>

      ${bit(6, 66, 6, accent, 0.35)}
      ${bit(16, 84, 4, bodyColor, 0.5)}
      ${bit(3, 92, 5, accent, 0.6)}
      ${bit(20, 102, 7, bodyColor, 0.4)}
      ${bit(98, 46, 5, accent, 0.45)}
      ${bit(108, 62, 4, bodyColor, 0.6)}
      ${bit(101, 100, 6, accent, 0.3)}
      ${bit(90, 116, 4, bodyColor, 0.55)}

      ${blob(bodyColor, 60, 88, 42, 46)}
      <ellipse cx="21" cy="90" rx="13" ry="15" fill="${accent}"/>
      <ellipse cx="99" cy="90" rx="13" ry="15" fill="${accent}"/>
      <ellipse cx="39" cy="126" rx="15" ry="9" fill="${accent}"/>
      <ellipse cx="81" cy="126" rx="15" ry="9" fill="${accent}"/>

      <path d="M 34,38 C 30,26 36,16 42,20 C 46,28 44,38 40,44 Z" fill="${bodyColor}"/>
      <path d="M 86,38 C 90,26 84,16 78,20 C 74,28 76,38 80,44 Z" fill="${bodyColor}"/>

      <ellipse cx="60" cy="98" rx="27" ry="19" fill="#17151c"/>
      <path d="M 39,90 L 47,98 L 39,106 M 51,90 L 59,98 L 51,106 M 63,90 L 71,98 L 63,106 M 75,90 L 83,98 L 75,106"
        stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/>

      <circle cx="44" cy="66" r="6" fill="${accent}"/>
      <circle cx="76" cy="66" r="6" fill="${accent}"/>
      <path d="M 33,56 L 48,63" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M 87,56 L 72,63" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    </g>
  `
  )
}
