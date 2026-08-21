// Platformer-family character art (chapter 4 onward). A third drawing
// language, deliberately unlike src/art/robots.js (angular armour plates, cold
// greys, 8-head action-figure build) and src/art/dinosaurs.js (bezier animals,
// warm creams, side-on poses).
//
// DESIGN GRAMMAR — every figure in this file follows all of it.
//
//  1. CLASSIC 2D GAME SPRITE PROPORTIONS. Front-facing, upright, roughly
//     2.5 heads tall: the head is as wide as the torso and nearly as tall.
//     This is the family's loudest signal and the exact inverse of the
//     robots' shoulder-heavy build.
//  2. HUGE WHITE GLOVES AND HUGE SHOES. Hands and feet are drawn far larger
//     than anatomy allows, as separate round masses with air between them and
//     the body, so they still register as hands/feet at 66 px.
//  3. CAP OR HELM WITH A WIDE BRIM, always overhanging the head silhouette.
//     Nothing else sits on the head.
//  4. THE SIMPLEST FACE IN THE APP: two dot eyes and one short curved mouth
//     stroke. No pupils, no highlights, no visor (the dinos own the big round
//     eye, the robots own the visor slit).
//  5. ROUNDED GEOMETRIC PRIMITIVES ONLY — `rect` with a large `rx`, circles,
//     ellipses, and thick sloped quads for limbs. No bezier animal curves, no
//     angular armour facets.
//  6. TWO SATURATED PRIMARIES PLUS WHITE, over fixed neutrals (SKIN, GLOVE,
//     SHOE, SOLE, INK). Flat fills only, and the neutrals are warm-dark
//     rather than the robots' chrome, so a platformer never reads as metal.
//  7. ONE POSE IDEA PER CHARACTER, readable as a solid black shape: airborne /
//     coiled / boxy / winged-and-massive.
//
// `visorColor` names the EMBLEM PLATE colour here, not a face part — the
// family has no visor. It must stay bright or the phonics letter dies.
//
// This file must not import ../art.js (circular); it carries its own svgWrap.

function svgWrap(inner, viewBox = '0 0 120 140') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

function mirrored(inner) {
  return `<g transform="translate(120,0) scale(-1,1)">${inner}</g>`
}

const SKIN = '#ffd7ae' // face; warm, and shared by all four so they read as one cast
const GLOVE = '#fffdf7'
const SHOE = '#4a3320' // warm dark brown, never the robots' cold grey
const SOLE = '#2a1d12'
const INK = '#33283c' // eyes and mouth
const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Oversized cartoon glove: a white lobe, a thin rim so the white keeps an edge
// on the app's near-white surfaces, and a bold cuff crescent poking out on the
// wrist side. Without the cuff a rimmed white circle read as an empty hoop at
// every size — the crescent is what turns it into a hand on an arm.
// `bodyDeg` points from the glove back towards the body.
function glove(cx, cy, r, cuffColor, bodyDeg) {
  const a = (bodyDeg * Math.PI) / 180
  const wx = (cx + Math.cos(a) * r * 0.62).toFixed(1)
  const wy = (cy + Math.sin(a) * r * 0.62).toFixed(1)
  return `
    <circle cx="${wx}" cy="${wy}" r="${(r * 0.92).toFixed(1)}" fill="${cuffColor}"/>
    <circle cx="${cx}" cy="${cy}" r="${r + 2}" fill="${cuffColor}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${GLOVE}"/>`
}

// Oversized shoe: one mass plus a darker sole slab. Drawn wider than the leg
// it hangs off, which is most of why these figures read as game sprites.
function shoe(cx, cy, rx, ry) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${SHOE}"/>
    <ellipse cx="${cx}" cy="${cy + ry * 0.52}" rx="${rx * 0.96}" ry="${ry * 0.44}" fill="${SOLE}"/>`
}

// Cap: dome overhanging the head, then a full-width brim. The brim is the
// family's head silhouette, so it is always wider than the dome.
function cap(cx, top, halfW, domeColor, brimColor) {
  const brimY = top + halfW * 1.02
  return `
    <path d="M ${cx - halfW},${brimY} C ${cx - halfW},${top} ${cx + halfW},${top} ${cx + halfW},${brimY} Z" fill="${domeColor}"/>
    <ellipse cx="${cx}" cy="${brimY}" rx="${halfW * 1.16}" ry="${halfW * 0.25}" fill="${brimColor}"/>`
}

function face(cx, cy, r = 4.2) {
  return `
    <circle cx="${cx - 10}" cy="${cy}" r="${r}" fill="${INK}"/>
    <circle cx="${cx + 10}" cy="${cy}" r="${r}" fill="${INK}"/>
    <path d="M ${cx - 7},${cy + 7} Q ${cx},${cy + 13} ${cx + 7},${cy + 7}"
      fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
}

// The emblem is the phonics letter the child ties to the character, so the
// plate is sized past the point of good taste: it has to survive a 66 px box,
// where a 120x140 viewBox letterboxes to 57x66 and a unit is under half a
// pixel.
function emblemPlate(x, y, w, h, plateColor, textColor, label, size) {
  return `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(w, h) * 0.26}" fill="${plateColor}"/>
    <text x="${x + w / 2}" y="${y + h / 2 + size * 0.36}" text-anchor="middle"
      font-family="${FONT}" font-size="${size}" font-weight="800" fill="${textColor}">${label}</text>`
}

// The jumper: the only figure in the family with both feet off the ground.
// One arm punches above the cap, the legs are tucked and trailing, and the
// ground shadow is left small and far below so the air gap is unmistakable.
export function platJumper({
  bodyColor = '#e03a3a',
  accent = '#1f3f8f',
  emblem = 'R',
  visorColor = '#fff3c4',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="15" ry="3.6" fill="#000" opacity="0.13"/>

      <polygon points="74,60 88,54 101,27 89,20" fill="${accent}"/>
      ${glove(96, 15, 11, accent, 113)}

      <polygon points="46,60 34,56 20,79 32,86" fill="${accent}"/>
      ${glove(22, 88, 11, accent, -54)}

      <polygon points="70,86 81,84 90,96 79,103" fill="${accent}"/>
      ${shoe(90, 102, 15, 9)}

      <polygon points="50,86 61,88 52,100 41,95" fill="${accent}"/>
      ${shoe(35, 100, 15, 9)}

      <rect x="40" y="50" width="40" height="42" rx="13" fill="${bodyColor}"/>
      ${emblemPlate(44, 56, 32, 30, visorColor, accent, emblem, 24)}

      <rect x="36" y="8" width="48" height="46" rx="18" fill="${SKIN}"/>
      ${cap(60, 4, 25, bodyColor, accent)}
      ${face(60, 39)}
    </g>
  `
  )
}

// The spring: the torso is replaced by a stack of coil turns, so this one is
// the tallest and narrowest of the four. The turns are fat and few — thin
// coils turned to grey mush at 66 px.
export function platSpring({
  bodyColor = '#2f9e5c',
  accent = '#16522f',
  emblem = 'M',
  visorColor = '#fff3c4',
} = {}) {
  // Turns step left/right so the outline waves like a helix — concentric
  // ellipses read as a caterpillar. Seams are painted after every turn, not
  // inside the turn helper, where the next turn covered them.
  const turn = (cy, rx, cx) => `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="9.5" fill="${bodyColor}"/>`
  const seam = (cy, rx) => `<ellipse cx="60" cy="${cy}" rx="${rx}" ry="3" fill="${accent}"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="28" ry="4" fill="#000" opacity="0.13"/>

      <polygon points="43,70 33,66 25,83 37,87" fill="${accent}"/>
      ${glove(27, 90, 10, accent, -48)}
      <polygon points="77,74 87,70 95,90 83,93" fill="${accent}"/>
      ${glove(93, 97, 10, accent, -127)}

      <rect x="47" y="104" width="11" height="16" fill="${accent}"/>
      <rect x="62" y="104" width="11" height="16" fill="${accent}"/>
      ${shoe(43, 122, 15, 9)}
      ${shoe(77, 122, 15, 9)}

      <rect x="53" y="46" width="14" height="12" fill="${accent}"/>
      ${turn(54, 24, 57)}
      ${turn(68, 27, 63)}
      ${turn(82, 24, 57)}
      ${seam(61.5, 25)}
      ${seam(75.5, 26)}
      <rect x="44" y="94" width="32" height="14" rx="5" fill="${accent}"/>

      <circle cx="60" cy="93" r="18" fill="${accent}"/>
      <circle cx="60" cy="93" r="15.5" fill="${visorColor}"/>
      <text x="60" y="102" text-anchor="middle" font-family="${FONT}" font-size="26"
        font-weight="800" fill="${accent}">${emblem}</text>

      <rect x="38" y="4" width="44" height="44" rx="17" fill="${SKIN}"/>
      ${cap(60, 0, 23, bodyColor, accent)}
      ${face(60, 32)}
    </g>
  `
  )
}

// The block: the squarest silhouette in the app. The torso is a crate — a
// framed box, since loose brick courses read as dungaree straps once the
// emblem plate took the middle. Limbs stay stubby and shoes wide: a boxy body
// on long legs read as a chimney at small sizes.
export function platBlock({
  bodyColor = '#e08a1e',
  accent = '#7a3d0c',
  emblem = 'D',
  visorColor = '#fff3c4',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="40" ry="4.6" fill="#000" opacity="0.13"/>

      <rect x="22" y="70" width="14" height="13" fill="${accent}"/>
      ${glove(20, 80, 11, accent, -34)}
      <rect x="84" y="70" width="14" height="13" fill="${accent}"/>
      ${glove(100, 80, 11, accent, -146)}

      <rect x="36" y="108" width="13" height="12" fill="${accent}"/>
      <rect x="71" y="108" width="13" height="12" fill="${accent}"/>
      ${shoe(39, 122, 16, 9)}
      ${shoe(81, 122, 16, 9)}

      <rect x="26" y="54" width="68" height="58" rx="7" fill="${accent}"/>
      <rect x="32" y="60" width="56" height="46" rx="4" fill="${bodyColor}"/>
      <rect x="32" y="70" width="56" height="3.6" fill="${accent}"/>
      <rect x="58" y="60" width="3.6" height="10" fill="${accent}"/>
      ${emblemPlate(42, 72, 36, 28, visorColor, accent, emblem, 24)}

      <rect x="38" y="10" width="44" height="42" rx="16" fill="${SKIN}"/>
      ${cap(60, 6, 23, bodyColor, accent)}
      ${face(60, 38)}
    </g>
  `
  )
}

// The power-up form, chapter boss: deliberately the heaviest figure in the
// family. Winged helm, a star, and one visible trace of each earlier hero —
// the jumper's gloves grown to their largest, the spring's coil at the waist,
// the block's brick slabs as shoulder pads. The glow is overlapping flat
// circles; gradients and filters are banned family-wide.
export function platPowerup({
  bodyColor = '#c8342f',
  panelColor = '#fff6df',
  accent = '#f0b429',
  visorColor = '#ffe066',
} = {}) {
  const star = (cx, cy, r, fill) => {
    const pts = []
    for (let i = 0; i < 10; i += 1) {
      const a = (Math.PI / 5) * i - Math.PI / 2
      const rr = i % 2 === 0 ? r : r * 0.44
      pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`)
    }
    return `<polygon points="${pts.join(' ')}" fill="${fill}"/>`
  }
  const sparkle = (cx, cy, r) => `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${visorColor}" opacity="0.5"/>
    <circle cx="${cx + r * 0.7}" cy="${cy - r * 0.6}" r="${r * 0.62}" fill="${panelColor}" opacity="0.85"/>`
  // One broad wing with a serrated trailing edge. Smooth rounded lobes read as
  // rabbit ears, a single sharp wedge as a devil horn, and thin separate
  // feathers as insect antennae; a wide mass plus notches is the only version
  // that stayed a wing down to 66 px.
  const wing = `
    <polygon points="39,27 2,5 7,17 0,16 9,25 2,27 13,33 39,34" fill="${accent}"/>
    <polygon points="39,28 10,12 12,20 22,26 39,32" fill="${panelColor}"/>`
  const pad = `
    <rect x="8" y="60" width="26" height="24" rx="4" fill="${panelColor}"/>
    <rect x="8" y="70" width="26" height="3.4" fill="${accent}"/>
    <rect x="20" y="60" width="3.4" height="10" fill="${accent}"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="137" rx="50" ry="6" fill="#000" opacity="0.15"/>

      ${sparkle(14, 122, 6)}
      ${sparkle(100, 122, 6)}

      <circle cx="60" cy="78" r="40" fill="${visorColor}" opacity="0.3"/>
      <circle cx="60" cy="72" r="30" fill="${visorColor}" opacity="0.3"/>

      <rect x="39" y="112" width="18" height="14" fill="${accent}"/>
      <rect x="63" y="112" width="18" height="14" fill="${accent}"/>
      ${shoe(37, 128, 20, 11)}
      ${shoe(83, 128, 20, 11)}

      <ellipse cx="60" cy="106" rx="22" ry="7.5" fill="${bodyColor}"/>
      <ellipse cx="60" cy="117" rx="20" ry="7" fill="${bodyColor}"/>
      <ellipse cx="60" cy="111.5" rx="21" ry="2.8" fill="${accent}"/>
      <ellipse cx="60" cy="122.5" rx="18" ry="2.6" fill="${accent}"/>

      <rect x="32" y="56" width="56" height="48" rx="14" fill="${bodyColor}"/>
      ${pad}
      ${mirrored(pad)}

      <polygon points="26,68 36,64 20,88 8,83" fill="${bodyColor}"/>
      ${glove(11, 96, 14, bodyColor, -57)}
      <polygon points="94,68 84,64 100,88 112,83" fill="${bodyColor}"/>
      ${glove(109, 96, 14, bodyColor, -123)}

      ${emblemPlate(41, 62, 38, 34, panelColor, bodyColor, '★', 28)}

      ${wing}
      ${mirrored(wing)}
      <rect x="34" y="8" width="52" height="48" rx="19" fill="${SKIN}"/>
      ${cap(60, 2, 27, bodyColor, bodyColor)}
      ${star(60, 22, 9, accent)}
      ${face(60, 40, 4.6)}
    </g>
  `
  )
}

// ---------------------------------------------------------------------------
// VILLAINS. Same rounded-primitive, front-ish language as the heroes, but
// tilted, lopsided and asymmetric where the heroes are upright and balanced —
// the family's hero/villain split. No cap, no emblem plate (the letters
// belong to the heroes), and angled brows replace the heroes' simple dot eyes.
// Each one's silhouette is its gameplay gimmick made literal, the way the
// chapter-2/3 villains worked. Villains take only { bodyColor, accent }.
// ---------------------------------------------------------------------------

// Fixed magnet colours for 마그넷잭 — a horseshoe magnet reads as red/blue
// regardless of the character palette, the same way the robots' headlights
// stay chrome regardless of bodyColor.
const MAGNET_RED = '#d1332f'
const MAGNET_BLUE = '#2f5fb0'

// Angry brow + flat mouth, the villain counterpart of the heroes' `face()`.
// Kept on the same budget (two dots, a few strokes) so it survives 66 px.
function villainFace(cx, cy, r = 4.2) {
  return `
    <circle cx="${cx - 10}" cy="${cy}" r="${r}" fill="${INK}"/>
    <circle cx="${cx + 10}" cy="${cy}" r="${r}" fill="${INK}"/>
    <path d="M ${cx - 15},${cy - 9} L ${cx - 5},${cy - 4}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M ${cx + 15},${cy - 9} L ${cx + 5},${cy - 4}" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    <path d="M ${cx - 7},${cy + 10} Q ${cx},${cy + 6} ${cx + 7},${cy + 10}"
      fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>`
}

// 뒤집깨비 (plat-flip): inverts the child's jump. Drawn as an ordinary
// standing figure and then flipped vertically — the same trick dinoUpside
// used — so the feet land at the top and the head at the bottom without
// hand-redrawing every part upside down. The chest chevron is authored
// pointing at the head (up, pre-flip); after the flip it points at the
// ground, reading as "down" regardless of which way the body faces.
export function platFlip({ bodyColor = '#7a3fc9', accent = '#3f1f70' } = {}) {
  const upright = `
    <path d="M 40,46 C 30,42 20,44 14,50 C 22,52 30,54 36,58 Z" fill="${accent}"/>
    <polygon points="82,50 94,44 106,52 96,58" fill="${bodyColor}"/>
    ${glove(102, 60, 10, accent, 200)}
    <polygon points="38,58 26,56 18,68 30,72" fill="${bodyColor}"/>
    ${glove(20, 76, 9, accent, -20)}

    <rect x="38" y="46" width="44" height="42" rx="13" fill="${bodyColor}"/>
    <polygon points="60,58 49,71 71,71" fill="${accent}"/>

    <rect x="42" y="84" width="15" height="20" fill="${accent}"/>
    <rect x="63" y="84" width="15" height="20" fill="${accent}"/>
    ${shoe(46, 112, 15, 9)}
    ${shoe(74, 116, 16, 9.5)}

    <rect x="38" y="4" width="44" height="44" rx="17" fill="${bodyColor}"/>
    <polygon points="46,6 38,-6 54,2" fill="${accent}"/>
    ${villainFace(60, 30)}
  `
  return svgWrap(
    `
    <g transform="rotate(7 60 70)">
      <ellipse cx="63" cy="132" rx="26" ry="4.4" fill="#000" opacity="0.12"/>
      <g transform="translate(0,136) scale(1,-1)">${upright}</g>
    </g>
  `
  )
}

// 물렁제리 (plat-slime): melts the floor so nothing can stop. No legs — the
// lower body dissolves into a puddle with drips, one arm droops further than
// the other so the melt reads as ongoing rather than a static shape, and a
// flat highlight (never a gradient) stands in for shine.
export function platSlime({ bodyColor = '#4fb5c9', accent = '#1d6b78' } = {}) {
  return svgWrap(
    `
    <g transform="rotate(-5 60 100)">
      <path d="M 10,120 C 26,114 34,124 50,118 C 66,112 76,122 92,116 C 106,111 112,118 112,122
               C 108,130 88,134 60,134 C 32,134 14,129 10,120 Z" fill="${accent}" opacity="0.55"/>

      <path d="M 30,58 C 22,66 20,76 26,82 C 20,88 22,96 30,98 L 24,108" fill="none"
        stroke="${bodyColor}" stroke-width="13" stroke-linecap="round"/>
      <path d="M 90,60 C 98,66 100,72 96,76 L 100,84" fill="none"
        stroke="${bodyColor}" stroke-width="13" stroke-linecap="round"/>

      <path d="M 34,52 C 28,74 30,96 44,110 C 52,118 70,118 78,109
               C 90,96 90,72 82,52 C 68,42 48,42 34,52 Z" fill="${bodyColor}"/>
      <path d="M 40,100 C 50,110 70,110 80,100 C 82,110 68,120 58,120 C 46,120 38,109 40,100 Z"
        fill="#fff" opacity="0.22"/>

      <path d="M 46,106 C 44,114 45,120 49,122 C 53,120 53,112 50,105 Z" fill="${bodyColor}"/>
      <path d="M 68,108 C 67,113 68,117 71,118 C 74,116 73,111 71,107 Z" fill="${bodyColor}"/>

      ${villainFace(58, 68)}
      <circle cx="46" cy="66" r="4.6" fill="${INK}"/>
      <circle cx="70" cy="72" r="4.6" fill="${INK}"/>
      <path d="M 34,58 L 44,62" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M 82,64 L 74,68" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M 50,80 Q 58,84 66,79" fill="none" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    </g>
  `
  )
}

// 마그넷잭 (plat-magnetjack): stole the spring hero's horseshoe magnet and
// wears it slung on its back with the poles swapped — S sits in the
// traditionally-red slot and N in the traditionally-blue one. The magnet's
// weight is what tips the whole figure off balance.
export function platMagnetjack({ bodyColor = '#c9622f', accent = '#6b3013' } = {}) {
  return svgWrap(
    `
    <g transform="rotate(-9 60 80)">
      <ellipse cx="58" cy="132" rx="24" ry="4.4" fill="#000" opacity="0.12"/>

      <path d="M 78,44 C 78,30 88,20 100,20 C 112,20 118,30 118,42
               L 106,42 C 106,34 102,29 96,29 C 90,29 87,34 87,42 Z" fill="${MAGNET_BLUE}"/>
      <path d="M 78,44 L 87,44 L 87,58 L 78,58 Z" fill="${MAGNET_BLUE}"/>
      <path d="M 106,42 L 118,42 L 118,58 L 106,58 Z" fill="${MAGNET_RED}"/>
      <text x="82.5" y="53" text-anchor="middle" font-family="${FONT}" font-size="9" font-weight="800" fill="#fff">S</text>
      <text x="112" y="53" text-anchor="middle" font-family="${FONT}" font-size="9" font-weight="800" fill="#fff">N</text>

      <polygon points="72,62 84,58 96,70 84,76" fill="${accent}"/>
      ${glove(93, 82, 10, accent, -125)}
      <polygon points="40,60 28,58 18,72 30,78" fill="${accent}"/>
      ${glove(21, 84, 10, accent, -25)}

      <rect x="40" y="52" width="40" height="42" rx="13" fill="${bodyColor}"/>
      <rect x="42" y="66" width="36" height="6" fill="${accent}"/>

      <rect x="44" y="94" width="13" height="18" fill="${accent}"/>
      <rect x="63" y="94" width="13" height="18" fill="${accent}"/>
      ${shoe(38, 116, 15, 9)}
      ${shoe(72, 120, 16, 9.5)}

      <rect x="38" y="10" width="44" height="44" rx="17" fill="${bodyColor}"/>
      <circle cx="60" cy="8" r="4.4" fill="${accent}"/>
      <rect x="58" y="0" width="4" height="10" fill="${accent}"/>
      ${villainFace(60, 34)}
    </g>
  `
  )
}

// 벽돌아재 (plat-brick): plugs the drill's tunnels shut. The torso is a cork
// stopper — wide at the shoulders, tapering to a narrow foot, so the body
// silhouette itself reads as a plug — with a plank patch for a hole it has
// already sealed and a brick in each hand, one arm loaded with a heavier
// stack than the other for the villain tilt. The first draft put the face on
// the cork's narrow tip with no separate head and no feet, which floated
// eyes at ankle height and left the figure looking legless; the head now
// sits on top of the cork like any other figure in the family, and two shoe
// stubs anchor the tapered tip to the ground.
export function platBrick({ bodyColor = '#a8763a', accent = '#5c3d18' } = {}) {
  const brick = (x, y, w, h) => `
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#a8462f"/>
    <rect x="${x}" y="${y + h * 0.48}" width="${w}" height="${h * 0.16}" fill="${accent}"/>
    <rect x="${x + w * 0.46}" y="${y}" width="${w * 0.08}" height="${h * 0.48}" fill="${accent}"/>
    <rect x="${x + w * 0.2}" y="${y + h * 0.64}" width="${w * 0.08}" height="${h * 0.36}" fill="${accent}"/>
    <rect x="${x + w * 0.72}" y="${y + h * 0.64}" width="${w * 0.08}" height="${h * 0.36}" fill="${accent}"/>`

  return svgWrap(
    `
    <g transform="rotate(6 60 90)">
      <ellipse cx="58" cy="134" rx="26" ry="4.6" fill="#000" opacity="0.12"/>

      <polygon points="32,68 20,64 10,78 22,84" fill="${bodyColor}"/>
      ${brick(0, 86, 26, 15)}
      ${brick(4, 72, 22, 13)}

      <polygon points="88,70 100,66 108,78 96,84" fill="${bodyColor}"/>
      ${brick(94, 86, 24, 14)}

      <polygon points="32,58 88,58 78,108 42,108" fill="${bodyColor}"/>
      <polygon points="35,66 85,66 79,72 39,72" fill="${accent}"/>
      <polygon points="38,86 82,86 78,92 42,92" fill="${accent}"/>

      <rect x="46" y="66" width="16" height="16" rx="2" fill="${accent}"/>
      <path d="M 47,72 L 61,68 M 47,79 L 61,75" stroke="${bodyColor}" stroke-width="2.4" stroke-linecap="round"/>

      <rect x="45" y="106" width="11" height="14" fill="${accent}"/>
      <rect x="64" y="106" width="11" height="14" fill="${accent}"/>
      ${shoe(44, 122, 14, 9)}
      ${shoe(76, 122, 14, 9)}

      <rect x="36" y="14" width="48" height="46" rx="18" fill="${bodyColor}"/>
      <circle cx="60" cy="8" r="5" fill="${accent}"/>
      ${villainFace(60, 38)}
    </g>
  `
  )
}

// 글리치렉스 (plat-glitch), the chapter boss: deliberately the biggest and
// heaviest figure in the family. Its jaw is a dark void wide enough to pull
// a checkerboard block halfway in, and it is shedding itself along one
// flank — small squares at scattered sizes and opacities, never more than
// two in a row, so the erosion cannot settle into a straight edge or corner
// that would read as a letterform.
export function platGlitch({ bodyColor = '#3d3d46', accent = '#7d5fe0' } = {}) {
  const bit = (x, y, s, fill, op) => `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${fill}" opacity="${op}"/>`
  return svgWrap(
    `
    <g transform="rotate(-4 60 78)">
      <ellipse cx="60" cy="137" rx="48" ry="6" fill="#000" opacity="0.16"/>

      ${bit(4, 74, 6, accent, 0.35)}
      ${bit(14, 92, 4, bodyColor, 0.5)}
      ${bit(2, 100, 5, accent, 0.6)}
      ${bit(20, 110, 7, bodyColor, 0.4)}
      ${bit(96, 40, 5, accent, 0.45)}
      ${bit(106, 56, 4, bodyColor, 0.6)}
      ${bit(100, 100, 6, accent, 0.3)}
      ${bit(88, 118, 4, bodyColor, 0.55)}

      <polygon points="30,80 12,68 6,84 22,92" fill="${bodyColor}"/>
      ${glove(9, 96, 15, accent, -35)}
      <polygon points="94,70 112,54 118,72 100,84" fill="${bodyColor}"/>
      ${glove(112, 90, 17, accent, -140)}

      <rect x="52" y="102" width="15" height="20" fill="${accent}"/>
      <rect x="72" y="102" width="15" height="20" fill="${accent}"/>
      ${shoe(50, 128, 18, 10)}
      ${shoe(86, 128, 18, 10)}

      <rect x="30" y="52" width="66" height="56" rx="16" fill="${bodyColor}"/>

      <ellipse cx="63" cy="86" rx="26" ry="17" fill="${SOLE}"/>
      <rect x="46" y="78" width="12" height="12" fill="${bodyColor}"/>
      <rect x="58" y="78" width="12" height="12" fill="${accent}"/>
      <rect x="46" y="90" width="12" height="12" fill="${accent}"/>
      <rect x="58" y="90" width="12" height="12" fill="${bodyColor}"/>

      <polygon points="30,20 22,4 40,14" fill="${accent}"/>
      <polygon points="90,18 100,2 104,20" fill="${accent}"/>
      <rect x="26" y="14" width="58" height="46" rx="20" fill="${bodyColor}"/>
      <circle cx="46" cy="36" r="5.2" fill="${accent}"/>
      <circle cx="74" cy="36" r="5.2" fill="${accent}"/>
      <path d="M 36,26 L 50,32" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
      <path d="M 84,26 L 70,32" stroke="${INK}" stroke-width="3" stroke-linecap="round"/>
    </g>
  `
  )
}
