// "Pokemon-genre" companion-creature art (chapter 4). A fourth drawing
// language, deliberately unlike the other three: src/art/robots.js (angular
// human-shaped machines), src/art/dinosaurs.js (bezier animals, upright,
// human-scale, side-on), src/art/platformer.js (2.5-head sprite PEOPLE in
// caps and gloves). This file draws no person at all -- every figure is a
// small round non-humanoid critter, front-facing, that a child would want to
// "catch." It deliberately borrows none of a real creature-collecting
// franchise's specific silhouettes, colours, or ball/badge trade dress.
//
// REVISION NOTE (v2): the first draft gave each hero a round animal body and
// then hung a gadget on it (a rocket pod, a horseshoe magnet, a drill bit) --
// it read as "blob wearing a tool," not as an animal. This version rebuilds
// every hero around an animal archetype first; the phonics gimmick survives
// only as a body part that animal would plausibly have (an ear shape, a
// tail shape, a horn, a cheek mark). If a feature could be unscrewed and
// handed to a different character, it does not belong in this file.
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
//  4. AN ANIMAL ARCHETYPE FIRST, A GIMMICK SECOND. Each hero reads as a
//     familiar small-animal silhouette -- an electric-mouse ear/tail shape,
//     a sleepy round bear/seal shape, a fluffy fox/badger shape -- and the
//     phonics gimmick is demoted to one plausible body part on that animal
//     (a zigzag tail tip, a horseshoe-shaped ear, a single forehead horn).
//     If the gimmick were removed the figure must still read as its animal;
//     if the animal reading were removed the gimmick must still be a body
//     part, never a held or worn object.
//  5. ELEMENTAL COLOUR, NEVER THE FRANCHISE PALETTE. Each hero reads as a
//     "type" through a warm/cool colour choice (ember red, static blue,
//     earth amber), but none of them use the red/white two-tone or a
//     circular midline seam -- that specific two-tone + seam combination is
//     the one thing this family must never draw. Cheek marks are a diamond,
//     not a circle, for the same trade-dress reason.
//  6. THE EMBLEM IS A CHEST BADGE, sized past good taste (same rule as
//     every other family): it is the phonics letter, so it has to survive a
//     66 px box, where this 120x140 viewBox letterboxes to 57x66 -- under
//     half a pixel per viewBox unit, so any detail thinner than ~3 units
//     disappears. Villains carry no badge; the letters belong to the heroes.
//  7. FLAT FILLS ONLY. Ellipses, circles and a handful of paths/polygons for
//     the pointed species features (ears, tails, horns, wings). No
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
const FLAME = '#ffb020' // fixed spark/fire colour, independent of body palette
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

// Sleepy eye: a heavy lid mass covers the top of the white, leaving only a
// low crescent with the pupil peeking through. Magno's whole "large and
// lazy" read leans on this one shape being unmistakably different from the
// alert round eye() every other hero uses.
function sleepyEye(cx, cy, r, lidColor) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.72}" fill="#fff"/>
    <circle cx="${cx}" cy="${cy + r * 0.3}" r="${r * 0.36}" fill="${PUPIL}"/>
    <path d="M ${cx - r * 1.08},${cy - r * 0.1}
             Q ${cx},${cy - r * 1.1} ${cx + r * 1.08},${cy - r * 0.1}
             Q ${cx},${cy - r * 0.28} ${cx - r * 1.08},${cy - r * 0.1} Z" fill="${lidColor}"/>`
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

// Diamond cheek mark -- an elemental "type" flourish shaped as a rhombus,
// never a circle, so it cannot read as the one franchise's trademark cheek
// dot no matter the colour.
function cheekMark(cx, cy, s, fill) {
  return `<polygon points="${cx},${cy - s} ${cx + s * 0.78},${cy} ${cx},${cy + s} ${cx - s * 0.78},${cy}" fill="${fill}"/>`
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
function paws(accent, cy = 92, rx = 11, ry = 13) {
  return `
    <ellipse cx="21" cy="${cy}" rx="${rx}" ry="${ry}" fill="${accent}"/>
    <ellipse cx="99" cy="${cy}" rx="${rx}" ry="${ry}" fill="${accent}"/>`
}
function feet(accent, rx = 13, ry = 8) {
  return `
    <ellipse cx="41" cy="128" rx="${rx}" ry="${ry}" fill="${accent}"/>
    <ellipse cx="79" cy="128" rx="${rx}" ry="${ry}" fill="${accent}"/>`
}

// Default rounded ear nub, used by any hero/villain whose species feature
// is not on the head.
function roundEars(bodyColor) {
  return `
    <ellipse cx="39" cy="45" rx="9" ry="13" fill="${bodyColor}"/>
    <ellipse cx="81" cy="45" rx="9" ry="13" fill="${bodyColor}"/>`
}

// Tall pointed ear with an inner-ear patch, canted outward from the crown --
// the mouse/rabbit silhouette Rocket and Captain Red's ear-traces both
// build on.
function pointedEar(cx, cy, w, h, rot, bodyColor, innerColor) {
  return `
    <g transform="translate(${cx},${cy}) rotate(${rot})">
      <path d="M ${-w},${h * 0.35} C ${-w * 1.15},${-h * 0.5} ${-w * 0.25},${-h} 0,${-h}
               C ${w * 0.25},${-h} ${w * 1.15},${-h * 0.5} ${w},${h * 0.35}
               C ${w * 0.6},${h * 0.55} ${-w * 0.6},${h * 0.55} ${-w},${h * 0.35} Z" fill="${bodyColor}"/>
      <path d="M ${-w * 0.5},${h * 0.2} C ${-w * 0.55},${-h * 0.3} ${-w * 0.12},${-h * 0.62} 0,${-h * 0.58}
               C ${w * 0.12},${-h * 0.62} ${w * 0.55},${-h * 0.3} ${w * 0.5},${h * 0.2} Z" fill="${innerColor}"/>
    </g>`
}

// ---------------------------------------------------------------------------
// HEROES
// ---------------------------------------------------------------------------

// Rocket (R): an electric-mouse archetype. Tall pointed ears, a diamond
// cheek mark by each eye, and a zigzag tail peeking past the body edge --
// the tail is the gimmick's new home, a lightning-bolt shape that is also
// legible as "leaves a rocket-trail," so the name still makes sense without
// a rocket ever appearing as an object.
export function creatureRocket({
  bodyColor = '#ef5b3c',
  accent = '#9c2e1d',
  emblem = 'R',
  visorColor = '#fff3c4',
} = {}) {
  return svgWrap(
    `
    <g transform="rotate(-6 60 92)">
      <ellipse cx="58" cy="134" rx="30" ry="5" fill="#000" opacity="0.12"/>

      <path d="M 4,72 L 20,80 M 0,88 L 18,94" stroke="${accent}" stroke-width="3" stroke-linecap="round" opacity="0.4"/>

      <g transform="translate(92,80) rotate(6)">
        <polygon points="6,-32 -8,0 2,0 -10,32 12,-4 3,-4" fill="${accent}"/>
        <polygon points="4,-25 -3,-2 2,-2 -5,16" fill="${FLAME}"/>
      </g>

      ${blob(bodyColor)}
      ${paws(accent)}
      ${feet(accent)}

      ${pointedEar(38, 26, 10, 30, -14, bodyColor, visorColor)}
      ${pointedEar(82, 26, 10, 30, 14, bodyColor, visorColor)}

      ${cheekMark(37, 93, 8.5, '#e8483a')}
      ${cheekMark(83, 93, 8.5, '#e8483a')}

      ${eye(45, 76, 12)}
      ${eye(75, 76, 12)}
      ${smile(60, 92, 8)}

      ${emblemBadge(60, 108, 18, visorColor, accent, emblem, 24)}
    </g>
  `
  )
}

// Magno (M): a big, round, sleepy archetype -- half-lidded eyes, a rounder
// heavier body than its castmates, and short stubby limbs pulled in close.
// The horseshoe magnet survives only as the ear shape, with its two poles
// reduced to two small dots instead of a held prop's coloured blocks.
export function creatureMagno({
  bodyColor = '#3f7ad1',
  accent = '#1d3f7a',
  emblem = 'M',
  visorColor = '#fff3c4',
} = {}) {
  const sleepyEar = `
    <path d="M -9,-14 C -9,-26 9,-26 9,-14 L 9,4 C 9,8 3,8 3,4 L 3,-13
             C 3,-18 -3,-18 -3,-13 L -3,4 C -3,8 -9,8 -9,4 Z" fill="${accent}"/>
    <circle cx="-5.5" cy="-1" r="2.6" fill="#d1332f"/>
    <circle cx="5.5" cy="-1" r="2.6" fill="#2f5fb0"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="134" rx="32" ry="5" fill="#000" opacity="0.12"/>

      <g transform="translate(35,40) rotate(-10)">${sleepyEar}</g>
      <g transform="translate(85,40) rotate(10) scale(-1,1)">${sleepyEar}</g>

      ${blob(bodyColor, 60, 90, 40, 40)}
      ${paws(accent, 96, 12, 13)}
      ${feet(accent, 15, 8)}

      ${sleepyEye(45, 80, 12, bodyColor)}
      ${sleepyEye(75, 80, 12, bodyColor)}
      ${smile(60, 96, 7)}

      ${emblemBadge(60, 110, 18, visorColor, accent, emblem, 24)}
    </g>
  `
  )
}

// Drillo (D): a burrowing mole archetype. Small tucked ears, small eyes and
// small clawed paws carry the animal read; the drill sits where a real
// burrowing animal's digging feature would be -- the snout -- as one small
// twisted horn, not the oversized threaded cone the first draft wore on
// its forehead like a tool.
export function creatureDrillo({
  bodyColor = '#c98a2e',
  accent = '#6b4310',
  emblem = 'D',
  visorColor = '#fff3c4',
} = {}) {
  const snoutDrill = `
    <path d="M 0,9 C 4,2 -5,-5 0,-13 C 4,-19 -3,-24 0,-30"
      fill="none" stroke="${accent}" stroke-width="6.5" stroke-linecap="round"/>
    <circle cx="0" cy="-30" r="3.2" fill="${accent}"/>`
  const clawTick = (cx, cy) => `
    <path d="M ${cx - 6},${cy + 6} L ${cx - 8},${cy + 11} M ${cx},${cy + 8} L ${cx},${cy + 13} M ${cx + 6},${cy + 6} L ${cx + 8},${cy + 11}"
      stroke="${accent}" stroke-width="2" stroke-linecap="round" opacity="0.7"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="58" cy="134" rx="30" ry="5" fill="#000" opacity="0.12"/>

      ${roundEars(bodyColor)}

      ${blob(bodyColor)}
      ${paws(accent)}
      ${feet(accent)}
      ${clawTick(21, 92)}
      ${clawTick(99, 92)}

      <g transform="translate(60,94) rotate(4)">${snoutDrill}</g>

      ${eye(43, 74, 9.5)}
      ${eye(77, 74, 9.5)}
      ${smile(60, 90, 7)}

      ${emblemBadge(60, 112, 18, visorColor, accent, emblem, 24)}
    </g>
  `
  )
}

// Captain Red, the evolved/merged boss form: a winged flame-dragon archetype
// deliberately the biggest silhouette in the family. Broad pointed wings
// and a curling flame-tipped tail are the dominant read; the three earlier
// heroes only leave small traces -- a tiny ear nub, a tiny forehead horn --
// the same "one visible trace of each ancestor, but never louder than the
// evolved form" rule dinoHorned, heroDeluxeRobot and platPowerup all follow.
export function creatureCaptainRed({
  bodyColor = '#d1332f',
  panelColor = '#fff6df',
  accent = '#8a1f1f',
  visorColor = '#5dd6e0',
} = {}) {
  const wing = `
    <polygon points="36,64 4,28 -10,34 -2,46 -18,48 -4,58 -16,62 4,74 32,88" fill="${accent}"/>
    <polygon points="30,62 8,36 -4,42 22,72" fill="${panelColor}" opacity="0.5"/>`
  const earTrace = `
    <path d="M -6,-10 C -6,-18 6,-18 6,-10 L 6,3 C 6,6 2,6 2,3 L 2,-9
             C 2,-13 -2,-13 -2,-9 L -2,3 C -2,6 -6,6 -6,3 Z" fill="${accent}"/>
    <circle cx="-3.5" cy="-1" r="1.8" fill="#d1332f"/>
    <circle cx="3.5" cy="-1" r="1.8" fill="#2f5fb0"/>`
  const hornTrace = `
    <path d="M 0,5 C 2,0 -3,-4 0,-9 C 2,-13 -1,-16 0,-20"
      fill="none" stroke="${accent}" stroke-width="4" stroke-linecap="round"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="42" ry="6" fill="#000" opacity="0.16"/>

      ${wing}
      ${mirrored(wing)}

      <g transform="translate(93,100) rotate(18)">
        <path d="M 0,0 C 16,8 22,26 12,40 C 6,48 -3,52 -10,48" fill="none"
          stroke="${accent}" stroke-width="13" stroke-linecap="round"/>
        <polygon points="-15,46 -3,38 -12,64 -24,55" fill="${FLAME}"/>
      </g>

      ${blob(bodyColor, 60, 90, 42, 44)}
      <ellipse cx="21" cy="92" rx="13" ry="15" fill="${accent}"/>
      <ellipse cx="99" cy="92" rx="13" ry="15" fill="${accent}"/>
      <ellipse cx="39" cy="128" rx="16" ry="9" fill="${accent}"/>
      <ellipse cx="81" cy="128" rx="16" ry="9" fill="${accent}"/>

      <g transform="translate(28,42) rotate(-12)">${earTrace}</g>
      <g transform="translate(60,68)">${hornTrace}</g>

      ${eye(42, 72, 13)}
      ${eye(78, 72, 13)}
      ${smile(60, 90, 9)}

      ${emblemBadge(60, 109, 21, panelColor, bodyColor, '★', 27)}
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
// way the chapter 2/3 villains worked -- these four already read as animal
// archetypes (bat, slime, thief, armadillo) and were kept as-is in the v2
// revision. Villains take only { bodyColor, accent }.
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
  // A single shell cap fused over the top third of the body, divided into
  // segments by grain seams -- a row of separate bumps read as ear tufts
  // (an early draft's mistake), so the shell has to be one continuous mass
  // that overlaps the blob outline before it reads as armour on the back.
  const seam = (x) => `<path d="M ${x},46 C ${x - 2},56 ${x - 2},70 ${x},80"
    stroke="${bodyColor}" stroke-width="2.2" stroke-linecap="round" opacity="0.6" fill="none"/>`

  return svgWrap(
    `
    <g transform="rotate(5 60 92)">
      <ellipse cx="60" cy="132" rx="32" ry="5" fill="#000" opacity="0.12"/>

      ${blob(bodyColor, 60, 90, 38, 40)}

      <path d="M 25,64 C 27,38 38,26 60,26 C 82,26 93,38 95,64
               C 96,76 88,82 60,82 C 32,82 24,76 25,64 Z" fill="${accent}"/>
      <path d="M 32,58 C 36,40 46,32 60,32 C 74,32 84,40 88,58
               C 82,52 72,48 60,48 C 48,48 38,52 32,58 Z" fill="#fff" opacity="0.14"/>
      ${seam(42)}
      ${seam(60)}
      ${seam(78)}

      ${paws(accent)}
      ${feet(accent)}

      ${wildEyes(45, 76, 76, 12)}
      ${smirk(60, 92, 8)}
    </g>
  `
  )
}

// Pixel Muncher, the chapter boss: a toad/frog archetype (revised from a
// generic "big mouth blob" -- reviewers could not name an animal for it).
// Bulging domed eyes sit half above the head silhouette, the way a real
// toad's do, and the mouth becomes a wide froggy maw instead of a floating
// void. It is still deliberately the biggest and heaviest figure in the
// family, and it still sheds itself along one flank as scattered
// checkerboard squares at mixed sizes and opacities, never two in a row on
// the same edge, so the erosion cannot settle into a straight line or right
// angle that would read as a letterform -- the same constraint platGlitch's
// shedding villain had to satisfy for the same reason.
export function creatureMuncher({ bodyColor = '#3d3d46', accent = '#7d5fe0' } = {}) {
  const bit = (x, y, s, fill, op) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fill}" opacity="${op}"/>`
  const frogEye = (cx, cy, r) => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${bodyColor}"/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.68}" fill="${accent}"/>
    <circle cx="${cx + r * 0.12}" cy="${cy + r * 0.12}" r="${r * 0.32}" fill="${PUPIL}"/>`

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

      ${blob(bodyColor, 60, 92, 42, 42)}
      <ellipse cx="21" cy="92" rx="13" ry="15" fill="${accent}"/>
      <ellipse cx="99" cy="92" rx="13" ry="15" fill="${accent}"/>
      <ellipse cx="39" cy="128" rx="15" ry="9" fill="${accent}"/>
      <ellipse cx="81" cy="128" rx="15" ry="9" fill="${accent}"/>
      <path d="M 30,132 L 30,137 M 39,133 L 39,138 M 48,132 L 48,137" stroke="${INK}" stroke-width="2" opacity="0.4"/>
      <path d="M 72,132 L 72,137 M 81,133 L 81,138 M 90,132 L 90,137" stroke="${INK}" stroke-width="2" opacity="0.4"/>

      ${frogEye(42, 46, 15)}
      ${frogEye(78, 46, 15)}
      <path d="M 30,44 L 45,50" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M 90,44 L 75,50" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>

      <ellipse cx="60" cy="100" rx="28" ry="18" fill="#17151c"/>
      <path d="M 39,92 L 47,100 L 39,108 M 51,92 L 59,100 L 51,108 M 63,92 L 71,100 L 63,108 M 75,92 L 83,100 L 75,108"
        stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/>
    </g>
  `
  )
}
