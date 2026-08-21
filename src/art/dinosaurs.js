// Dinosaur-family character art (chapter 3 onward). Deliberately the opposite
// drawing language from src/art/robots.js so the two families read as
// different worlds at a glance.
//
// DESIGN GRAMMAR — every figure in this file follows all of it.
//
//  1. ORGANIC, NEVER ANGULAR. Bodies, necks, tails and limbs are bezier
//     `path`/`ellipse` curves. The only straight-edged shapes are the pointed
//     bits — horns, back plates, claws, teeth, beaks. The robots' rule was
//     "no rounded rectangles"; here the rule is the mirror image of it.
//  2. ONE DOMINANT SILHOUETTE FEATURE PER CHARACTER, chosen so the four
//     heroes are told apart with the colour thrown away: raptor = forward
//     lean + long horizontal tail; armored = low/wide + back-plate ridge;
//     flyer = wings filling the full width; horned = huge frill, biggest mass.
//  3. FRIENDLY, NOT SCARY (5-year-old audience). Big white eye with a round
//     pupil and a highlight dot, soft snout, teeth only as small bone
//     triangles that never overlap the eye line.
//  4. COLOUR BLOCKING: bodyColor skin + accent for plates/horns/claw beds +
//     fixed neutrals (BELLY, BONE, PUPIL). Flat fills only — no gradients,
//     no filters. Volume comes from a lighter belly patch, never a gradient.
//  5. THE EMBLEM PLATE IS CURRICULUM CONTENT, not decoration. It is an
//     oversized bright ellipse on the flank (profile figures) or chest
//     (front-facing ones), sized to stay legible in a 66 px box, which
//     letterboxes a 120x140 viewBox down to 57x66 -- roughly 0.47 px per
//     viewBox unit, so anything under ~3 units disappears.
//
// This file must not import ../art.js (circular); it carries its own svgWrap.

function svgWrap(inner, viewBox = '0 0 120 140') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

// Mirrors arbitrary drawing content about the centre line. The robots file
// mirrors by rewriting polygon point lists; that cannot work here because
// these figures are bezier paths, so the mirror is done with a transform.
function mirrored(inner) {
  return `<g transform="translate(120,0) scale(-1,1)">${inner}</g>`
}

const BELLY = '#f9e9c9' // warm underside patch, gives volume without a gradient
const BONE = '#fdf6e3' // claws, teeth, beak tips
const PUPIL = '#2f2618' // warm dark — never the robots' cold grey
const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Far-side limbs: the same path as the near limb with a flat dark wash on top.
// A separate darker palette colour would fight `accent`, which the horns,
// plates and claw beds already own.
function farLimb(d, bodyColor) {
  return `<path d="${d}" fill="${bodyColor}"/><path d="${d}" fill="#000" opacity="0.2"/>`
}

// Big friendly eye: white, round pupil, one highlight dot. Shared so all four
// heroes read as the same cast.
function eye(cx, cy, r) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="#fff"/>
    <circle cx="${cx + r * 0.3}" cy="${cy}" r="${r * 0.52}" fill="${PUPIL}"/>
    <circle cx="${cx + r * 0.55}" cy="${cy - r * 0.28}" r="${r * 0.2}" fill="#fff"/>`
}

const GLOW = '#ff5c4d' // villain eye glow, always inside a dark socket

// Villain eye: a slanted glowing slit on the same size budget as the heroes'
// round eye, so it survives 66 px while reading as the opposite feeling.
function angryEye(cx, cy, r) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 0.62}" fill="#1b1712" transform="rotate(-18 ${cx} ${cy})"/>
    <ellipse cx="${cx}" cy="${cy}" rx="${r * 0.5}" ry="${r * 0.3}" fill="${GLOW}" transform="rotate(-18 ${cx} ${cy})"/>`
}

// Emblem plate. Oversized on purpose: it is the phonics letter the child ties
// to the character, and it is the only thing on the figure that must survive
// a 66 px render intact.
function emblemPlate(cx, cy, rx, ry, plateColor, textColor, label, size) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${plateColor}"/>
    <text x="${cx}" y="${cy + size * 0.36}" text-anchor="middle" font-family="${FONT}"
      font-size="${size}" font-weight="800" fill="${textColor}">${label}</text>`
}

// 케이라. The sleek one: leans forward over its hips, balanced by a long
// horizontal tail, narrow snout, smooth back (the back-plate ridge is the
// armored dino's signature and must not be diluted here).
export function dinoRaptor({
  bodyColor = '#4bb377',
  accent = '#1f6b45',
  emblem = 'C',
  visorColor = '#fdf6e3',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="58" cy="133" rx="36" ry="5" fill="#000" opacity="0.1"/>

      <path d="M 48,82 C 32,78 14,74 2,66 C 8,80 24,90 46,96 Z" fill="${bodyColor}"/>
      <path d="M 48,82 C 32,78 14,74 2,66 C 12,76 28,83 48,87 Z" fill="${accent}"/>

      ${farLimb(
        `M 56,92 C 44,98 37,110 40,120 C 42,127 46,130 48,133 L 66,133 L 66,126
         C 57,124 52,120 52,114 C 52,106 59,99 64,95 Z`,
        bodyColor
      )}

      <path d="M 42,90 C 38,70 52,56 72,58 C 88,60 96,74 92,90 C 88,106 60,112 48,102 Z" fill="${bodyColor}"/>
      <path d="M 48,100 C 58,110 80,108 90,92 C 92,106 66,114 48,104 Z" fill="${BELLY}"/>

      <path d="M 72,62 C 74,50 82,42 93,39 C 98,43 98,50 93,55 C 85,59 81,66 81,74 Z" fill="${bodyColor}"/>

      <path d="M 68,94 C 54,100 46,112 49,122 C 51,129 55,132 57,135 L 80,135 L 80,127
               C 68,125 62,121 62,114 C 62,105 70,99 76,95 Z" fill="${bodyColor}"/>
      <path d="M 80,126 C 88,127 94,130 97,134 C 92,137 82,137 80,135 Z" fill="${BONE}"/>
      <path d="M 57,135 C 51,136 47,138 46,140 L 60,140 Z" fill="${BONE}"/>

      <path d="M 78,74 C 85,77 91,83 91,90 C 89,92 85,90 83,86 C 81,82 79,78 78,74 Z" fill="${bodyColor}"/>
      <path d="M 90,88 C 95,90 98,92 98,94 C 95,95 91,93 89,91 Z" fill="${BONE}"/>

      <path d="M 84,30 C 76,24 70,22 65,24 C 72,27 78,31 82,36 Z" fill="${accent}"/>
      <path d="M 88,25 C 84,17 80,12 76,11 C 79,18 82,24 85,29 Z" fill="${accent}"/>

      <path d="M 82,46 C 80,32 90,23 101,25 C 109,26 114,31 116,37
               C 118,39 119,42 119,44 C 119,47 114,48 108,47
               C 100,52 88,53 82,46 Z" fill="${bodyColor}"/>
      <path d="M 89,47 C 97,52 109,51 117,45 C 117,50 110,55 99,55 C 91,55 88,51 89,47 Z" fill="${accent}"/>
      <path d="M 101,49 L 104,54 L 107,49 Z" fill="${BONE}"/>
      <path d="M 109,48 L 111,52 L 113,47 Z" fill="${BONE}"/>
      ${eye(95, 36, 6.6)}

      ${emblemPlate(64, 84, 15, 12.5, visorColor, accent, emblem, 21)}
    </g>
  `
  )
}

// 에디. The low wide one: four thick pillar legs, a ridge of back plates that
// is the whole read at small sizes, and a clubbed tail. Its flank is the
// widest of the four, so it carries the biggest emblem plate.
export function dinoArmored({
  bodyColor = '#6d8fd6',
  accent = '#2f4a86',
  emblem = 'E',
  visorColor = '#fdf6e3',
} = {}) {
  const plate = (x, y, w, h) =>
    `<path d="M ${x - w},${y} C ${x - w},${y - h * 0.6} ${x - w * 0.55},${y - h} ${x},${y - h}
              C ${x + w * 0.55},${y - h} ${x + w},${y - h * 0.6} ${x + w},${y} Z" fill="${accent}"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="134" rx="46" ry="5" fill="#000" opacity="0.1"/>

      <path d="M 32,96 C 22,94 12,92 6,88 C 10,98 20,104 32,106 Z" fill="${bodyColor}"/>
      <circle cx="11" cy="90" r="9.5" fill="${accent}"/>
      <path d="M 11,76 L 15,84 L 5,84 Z" fill="${BONE}"/>
      <path d="M 0,90 L 6,86 L 6,95 Z" fill="${BONE}"/>
      <path d="M 11,104 L 15,96 L 5,96 Z" fill="${BONE}"/>

      <path d="M 78,110 C 76,118 76,126 78,132 L 92,132 C 94,126 94,118 92,110 Z" fill="${accent}"/>
      <path d="M 30,110 C 28,118 28,126 30,132 L 44,132 C 46,126 46,118 44,110 Z" fill="${accent}"/>

      <path d="M 26,100 C 24,84 40,74 62,74 C 84,74 100,82 100,98 C 100,112 80,118 62,118
               C 42,118 26,112 26,100 Z" fill="${bodyColor}"/>
      <path d="M 30,106 C 42,118 84,118 98,102 C 96,116 76,122 60,122 C 42,122 30,116 30,106 Z" fill="${BELLY}"/>

      ${plate(36, 78, 6, 13)}
      ${plate(50, 76, 7, 20)}
      ${plate(64, 74, 8, 25)}
      ${plate(78, 76, 7, 20)}
      ${plate(91, 79, 6, 13)}

      <path d="M 88,84 C 92,77 101,77 105,82 C 100,90 96,97 94,104 C 87,99 85,90 88,84 Z" fill="${bodyColor}"/>
      <path d="M 96,90 C 94,82 101,76 109,77 C 115,78 119,83 119,89 C 119,94 112,97 105,97
               C 99,97 96,94 96,90 Z" fill="${bodyColor}"/>
      <path d="M 111,88 C 118,87 121,91 118,95 C 113,96 109,93 109,90 Z" fill="${accent}"/>
      ${eye(104, 85, 5.6)}

      <path d="M 72,112 C 70,120 70,130 72,134 L 88,134 C 90,130 90,120 88,112 Z" fill="${bodyColor}"/>
      <path d="M 74,131 C 76,134 76,136 74,136 C 72,135 72,132 74,131 Z" fill="${BONE}"/>
      <path d="M 80,131 C 82,134 82,136 80,136 C 78,135 78,132 80,131 Z" fill="${BONE}"/>
      <path d="M 24,112 C 22,120 22,130 24,134 L 40,134 C 42,130 42,120 40,112 Z" fill="${bodyColor}"/>
      <path d="M 26,131 C 28,134 28,136 26,136 C 24,135 24,132 26,131 Z" fill="${BONE}"/>
      <path d="M 32,131 C 34,134 34,136 32,136 C 30,135 30,132 32,131 Z" fill="${BONE}"/>

      ${emblemPlate(60, 98, 18, 13.5, visorColor, accent, emblem, 22)}
    </g>
  `
  )
}

// 허비. The only one that is wider than it is tall: two big membrane wings
// span the full viewBox, a swept-back head crest balances the long beak. The
// torso stays narrow on purpose so the wings own the silhouette, which is why
// this one's emblem plate is the smallest and sits high on the chest.
export function dinoFlyer({
  bodyColor = '#e0803a',
  accent = '#8a4213',
  emblem = 'H',
  visorColor = '#fdf6e3',
} = {}) {
  const wing = `
    <path d="M 52,58 C 38,46 18,38 3,42 C 12,55 20,68 22,82 C 33,75 43,66 54,64 Z" fill="${bodyColor}"/>
    <path d="M 52,58 C 38,46 18,38 3,42 C 14,49 30,56 42,62 Z" fill="${accent}"/>
    <path d="M 24,45 C 26,56 27,68 24,80" stroke="${accent}" stroke-width="2.6" fill="none"/>
    <path d="M 38,50 C 39,58 39,66 36,74" stroke="${accent}" stroke-width="2.2" fill="none"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="24" ry="4.5" fill="#000" opacity="0.1"/>

      ${wing}
      ${mirrored(wing)}

      ${(() => {
        const leg = `<path d="M 50,98 C 43,108 41,120 44,127 L 55,127 C 55,118 54,107 56,97 Z" fill="${bodyColor}"/>
        <path d="M 44,125 C 37,128 33,131 32,134 C 38,136 50,133 53,130 Z" fill="${BONE}"/>`
        return leg + mirrored(leg)
      })()}

      <path d="M 46,50 C 43,74 48,96 60,112 C 72,96 77,74 74,50 C 66,43 54,43 46,50 Z" fill="${bodyColor}"/>
      <path d="M 57,74 C 57,92 58,104 60,110 C 62,104 63,92 63,74 Z" fill="${BELLY}"/>

      <path d="M 54,26 C 44,14 30,6 19,6 C 27,17 35,27 41,38 C 45,32 49,28 54,26 Z" fill="${accent}"/>
      <path d="M 54,26 C 44,14 30,6 19,6 C 29,14 39,23 46,32 Z" fill="${BONE}" opacity="0.35"/>

      <path d="M 50,38 C 48,26 56,19 65,19 C 74,19 80,26 80,36 C 80,44 72,48 63,48
               C 55,48 50,44 50,38 Z" fill="${bodyColor}"/>
      <path d="M 76,31 C 89,31 102,36 109,42 C 99,47 84,46 74,40 Z" fill="${accent}"/>
      <path d="M 97,38 C 104,39 108,41 109,42 C 105,44 99,43 96,41 Z" fill="${BONE}"/>
      ${eye(64, 33, 6.6)}

      ${emblemPlate(60, 74, 12.5, 14.5, visorColor, accent, emblem, 20)}
    </g>
  `
  )
}

// 트라이케라, the chapter-3 boss combined form: deliberately the heaviest
// figure in the family. The frill is drawn wider than any other silhouette
// element in the file, and the three earlier heroes leave visible traces —
// a plate ridge on one flank, a wing shard on the other, oversized raptor
// claws on the front feet — so "the three merged" reads without narration.
export function dinoHorned({
  bodyColor = '#c8452f',
  panelColor = '#f7ead2',
  accent = '#f0b429',
  visorColor = '#5dd6e0',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="56" cy="136" rx="50" ry="6" fill="#000" opacity="0.13"/>

      <path d="M 22,94 C 12,92 5,88 1,82 C 4,96 12,104 24,108 Z" fill="${bodyColor}"/>

      <path d="M 30,72 C 20,64 12,56 12,51 C 22,57 32,66 38,75 Z" fill="${accent}"/>
      <path d="M 30,72 C 20,64 12,56 12,51 C 21,60 30,67 35,74 Z" fill="${panelColor}" opacity="0.5"/>

      ${farLimb(
        `M 68,106 C 66,116 66,126 68,131 L 84,131 C 86,126 86,116 84,106 Z`,
        bodyColor
      )}
      ${farLimb(
        `M 20,106 C 18,116 18,126 20,131 L 36,131 C 38,126 38,116 36,106 Z`,
        bodyColor
      )}

      <path d="M 14,98 C 12,74 34,62 58,62 C 80,62 94,74 94,94 C 94,114 74,124 52,124
               C 30,124 16,116 14,98 Z" fill="${bodyColor}"/>
      <path d="M 20,106 C 34,124 78,124 90,102 C 88,120 74,130 52,130 C 30,130 22,122 20,106 Z" fill="${BELLY}"/>

      <path d="M 30,64 C 28,56 32,50 36,50 C 40,50 42,56 40,64 Z" fill="${accent}"/>
      <path d="M 42,62 C 40,53 44,46 49,46 C 54,46 56,53 54,62 Z" fill="${accent}"/>
      <path d="M 56,62 C 54,54 58,49 62,49 C 66,49 68,55 66,63 Z" fill="${accent}"/>

      <circle cx="79" cy="12" r="4.4" fill="${accent}"/>
      <circle cx="93" cy="11" r="4.4" fill="${accent}"/>
      <circle cx="105" cy="18" r="4.4" fill="${accent}"/>
      <circle cx="114" cy="31" r="4.4" fill="${accent}"/>
      <circle cx="117" cy="46" r="4.4" fill="${accent}"/>
      <circle cx="113" cy="61" r="4.4" fill="${accent}"/>
      <path d="M 66,80 C 52,58 58,26 79,15 C 98,5 114,20 116,44
               C 118,66 102,82 86,86 Z" fill="${panelColor}"/>
      <path d="M 76,76 C 66,56 70,32 85,24 C 99,17 108,30 109,47
               C 110,63 99,76 88,80 Z" fill="${visorColor}" opacity="0.35"/>

      <path d="M 94,44 C 98,28 107,16 117,9 C 112,24 106,37 102,50 Z" fill="${accent}"/>
      <path d="M 81,44 C 83,31 89,21 97,15 C 92,28 88,38 87,50 Z" fill="${accent}"/>

      <path d="M 80,62 C 78,48 90,40 101,42 C 110,44 115,51 115,58
               C 115,67 105,73 94,73 C 85,73 80,68 80,62 Z" fill="${bodyColor}"/>
      <path d="M 106,52 C 112,47 117,46 119,48 C 116,53 111,57 107,59 Z" fill="${accent}"/>
      <path d="M 106,64 C 115,62 119,65 117,70 C 111,72 105,69 105,66 Z" fill="${accent}"/>
      ${eye(95, 55, 7)}

      <path d="M 66,110 C 64,120 64,132 66,137 L 84,137 C 86,132 86,120 84,110 Z" fill="${bodyColor}"/>
      <path d="M 84,133 C 92,134 98,137 100,140 L 82,140 Z" fill="${BONE}"/>
      <path d="M 16,110 C 14,120 14,132 16,137 L 34,137 C 36,132 36,120 34,110 Z" fill="${bodyColor}"/>
      <path d="M 34,133 C 42,134 48,137 50,140 L 32,140 Z" fill="${BONE}"/>

      ${emblemPlate(50, 96, 20, 16, panelColor, bodyColor, '★', 26)}
    </g>
  `
  )
}

// ---------------------------------------------------------------------------
// VILLAINS. Same organic dinosaur language as the heroes so they belong in one
// battle scene, inverted in feeling: hunched and tilted instead of upright,
// jagged spine ridges, slit glowing eyes instead of big round friendly ones,
// and no emblem plate (the letters belong to the heroes). Each one's silhouette
// is its own name gimmick made literal, the way the chapter-2 villains worked.
// ---------------------------------------------------------------------------

// 깜빡괴물. Half of it has blinked out: the rear body, tail, far leg and one
// eye survive only as dashed outlines. The solid front half carries all the
// colour, so the missing part reads as missing rather than as background.
export function dinoBlink({ bodyColor = '#8f7fd4', accent = '#463a80' } = {}) {
  const ghost = `fill="none" stroke="${bodyColor}" stroke-width="2.6" stroke-dasharray="5 4" stroke-linejoin="round"`
  return svgWrap(
    `
    <g>
      <ellipse cx="62" cy="132" rx="30" ry="5" fill="#000" opacity="0.07"/>

      <path d="M 46,86 C 32,80 16,74 4,64 C 8,80 24,92 44,98 Z" ${ghost}/>
      <path d="M 44,90 C 32,96 26,108 29,118 C 31,126 35,130 37,134 L 54,134" ${ghost}/>

      <path d="M 62,58 C 84,58 98,74 94,92 C 90,110 70,118 58,110 Z" fill="${bodyColor}"/>
      <path d="M 62,58 C 42,56 30,70 32,90 C 34,106 46,114 58,110 Z" ${ghost}/>
      <path d="M 64,104 C 76,112 90,110 94,96 C 94,112 72,120 62,112 Z" fill="${accent}"/>

      <path d="M 74,62 C 76,52 82,44 91,40 C 96,44 96,50 91,55 C 84,60 80,66 80,74 Z" fill="${bodyColor}"/>

      <path d="M 70,94 C 60,100 55,112 58,122 C 60,130 64,134 66,138 L 86,138 L 86,130
               C 74,128 68,123 68,116 C 68,107 74,100 79,96 Z" fill="${bodyColor}"/>

      <path d="M 80,46 C 78,32 88,23 100,25 C 109,26 115,32 117,39
               C 118,42 119,45 118,47 C 114,49 108,48 104,47
               C 98,53 86,54 80,46 Z" fill="${bodyColor}"/>
      <path d="M 88,48 C 96,53 108,52 117,46 C 116,52 108,57 97,57 C 90,57 87,52 88,48 Z" fill="${accent}"/>
      <path d="M 99,50 L 102,56 L 105,50 Z" fill="${BONE}"/>
      <path d="M 108,49 L 110,54 L 113,48 Z" fill="${BONE}"/>
      <path d="M 84,32 C 78,24 72,20 66,20 C 74,24 80,29 83,36 Z" fill="${accent}"/>
      ${angryEye(96, 36, 6.4)}
      <circle cx="83" cy="34" r="4.6" ${ghost}/>
    </g>
  `
  )
}

// 메아리도둑. Two offset copies of the whole body trail behind the solid one,
// so the figure reads as a sound that has not caught up with itself. The long
// neck is what makes the echo legible — a compact body's ghosts would just
// look like a blur.
export function dinoEcho({ bodyColor = '#5aa6a0', accent = '#1f5a56' } = {}) {
  const figure = `
    <path d="M 40,96 C 26,92 12,86 2,76 C 6,92 20,104 40,110 Z" fill="${bodyColor}"/>
    <path d="M 36,104 C 30,96 22,88 14,82 C 22,94 30,102 38,108 Z" fill="${accent}"/>
    <path d="M 34,100 C 30,82 46,70 66,72 C 84,74 94,86 90,102 C 86,118 56,124 44,112 Z" fill="${bodyColor}"/>
    <path d="M 40,110 C 54,120 82,116 90,102 C 90,120 56,128 40,116 Z" fill="${accent}"/>
    <path d="M 68,74 C 66,58 74,42 88,34 C 96,29 102,34 98,42 C 90,52 82,64 82,78 Z" fill="${bodyColor}"/>
    <path d="M 90,26 C 82,22 76,26 76,34 C 76,42 84,46 94,45 C 104,44 112,40 116,34
             C 112,30 104,26 96,26 Z" fill="${bodyColor}"/>
    <path d="M 96,40 C 104,40 112,37 116,34 C 114,41 106,47 96,47 C 90,47 88,43 90,40 Z" fill="${accent}"/>
    <path d="M 100,42 L 102,47 L 105,41 Z" fill="${BONE}"/>
    <path d="M 108,40 L 109,45 L 112,38 Z" fill="${BONE}"/>
    <path d="M 60,116 C 56,124 56,132 58,136 L 72,136 C 72,130 70,122 70,114 Z" fill="${accent}"/>
    ${angryEye(90, 35, 5.8)}`

  return svgWrap(
    `
    <g>
      <ellipse cx="58" cy="136" rx="34" ry="5" fill="#000" opacity="0.08"/>
      <g transform="translate(-21,-12)" opacity="0.24">${figure}</g>
      <g transform="translate(-11,-6)" opacity="0.48">${figure}</g>
      ${figure}
    </g>
  `
  )
}

// 거꾸로용. The whole animal is drawn the right way up and then flipped, so its
// legs paddle at the ceiling, its head hangs at the floor, and the eye
// highlight lands under the pupil instead of over it — the upside-down read
// comes free from the transform rather than from redrawing every curve.
export function dinoUpside({ bodyColor = '#c96a9b', accent = '#6b2f4c' } = {}) {
  // Drawn as an ordinary standing dinosaur — a legible upright figure is what
  // makes the flip read as "wrong way up" rather than as an abstract blob.
  const upright = `
    <path d="M 40,68 C 28,64 16,58 8,48 C 12,62 24,72 40,76 Z" fill="${bodyColor}"/>
    <path d="M 40,68 C 28,64 16,58 8,48 C 18,58 30,66 40,71 Z" fill="${accent}"/>

    ${farLimb(`M 66,80 C 60,94 62,110 70,120 C 74,122 82,122 86,120 C 80,106 76,92 78,78 Z`, bodyColor)}

    <path d="M 36,74 C 32,54 48,42 68,44 C 86,46 94,58 90,76 C 86,94 56,98 44,88 Z" fill="${bodyColor}"/>
    <path d="M 44,86 C 56,96 84,92 90,76 C 90,92 58,100 44,90 Z" fill="${accent}"/>

    <path d="M 70,44 C 68,32 76,24 86,22 C 92,26 92,33 86,37 C 80,41 78,45 78,50 Z" fill="${bodyColor}"/>

    <path d="M 48,82 C 42,96 42,112 48,122 C 52,124 60,124 64,122 C 60,108 58,94 60,80 Z" fill="${bodyColor}"/>
    <path d="M 44,119 C 33,123 27,130 30,134 C 37,136 62,136 70,134 C 75,130 73,123 66,119 Z" fill="${bodyColor}"/>
    <path d="M 31,133 L 36,123 L 42,134 Z" fill="${accent}"/>
    <path d="M 44,135 L 48,123 L 53,135 Z" fill="${accent}"/>
    <path d="M 56,134 L 60,124 L 65,133 Z" fill="${accent}"/>

    <path d="M 76,28 C 74,15 84,7 96,9 C 106,11 112,17 113,24
             C 114,27 113,30 110,31 C 106,31 102,30 98,29
             C 92,34 82,35 76,28 Z" fill="${bodyColor}"/>
    <path d="M 83,30 C 92,35 104,34 112,29 C 111,36 103,41 92,41 C 85,41 82,35 83,30 Z" fill="${accent}"/>
    <path d="M 94,33 L 97,39 L 100,32 Z" fill="${BONE}"/>
    <path d="M 103,31 L 105,36 L 108,30 Z" fill="${BONE}"/>
    ${angryEye(92, 21, 6.2)}`

  return svgWrap(
    `
    <g>
      <ellipse cx="94" cy="134" rx="24" ry="5" fill="#000" opacity="0.08"/>
      <g transform="translate(0,136) scale(1,-1)">${upright}</g>
    </g>
  `
  )
}

// 늪지괴물. It has no legs — the lower half has gone soft and sunk, so the
// body dissolves into a wavy pool and drips fall out of it. The wobbly bottom
// edge and the free-floating droplets are the whole silhouette read; the
// upper body is kept simple so the melt is unmistakable.
export function dinoSwamp({ bodyColor = '#7d9b3a', accent = '#3c4d18' } = {}) {
  return svgWrap(
    `
    <g>
      <path d="M 26,86 C 20,78 10,72 2,70 C 8,84 18,94 30,98 Z" fill="${bodyColor}"/>

      <path d="M 28,102 C 22,74 44,54 68,56 C 90,58 100,76 96,98
               C 94,114 86,124 76,126 C 60,130 38,126 32,118 C 28,112 28,106 28,102 Z" fill="${bodyColor}"/>
      <path d="M 42,80 C 38,68 42,56 50,50 C 48,62 48,72 50,82 Z" fill="${accent}"/>
      <path d="M 58,74 C 54,60 58,48 66,42 C 64,54 64,66 66,76 Z" fill="${accent}"/>

      <path d="M 74,66 C 76,54 84,46 94,43 C 99,47 99,54 94,59 C 86,64 82,70 82,78 Z" fill="${bodyColor}"/>
      <path d="M 80,48 C 78,34 88,26 100,28 C 109,29 115,36 116,43
               C 116,46 115,48 112,49 C 108,49 104,48 100,47
               C 94,53 84,55 80,48 Z" fill="${bodyColor}"/>
      <path d="M 87,50 C 96,55 107,53 115,48 C 114,54 106,59 95,59 C 88,59 85,54 87,50 Z" fill="${accent}"/>
      <path d="M 98,52 L 101,58 L 104,51 Z" fill="${BONE}"/>
      ${angryEye(95, 39, 6.2)}

      <path d="M 2,105 C 14,97 26,109 40,103 C 54,96 63,109 77,104 C 91,99 105,110 119,102
               C 119,114 106,122 84,125 C 60,128 36,127 22,122 C 4,116 1,113 2,105 Z" fill="${accent}"/>
      <path d="M 5,106 C 17,98 28,110 42,104 C 56,97 64,110 78,105 C 92,100 105,110 116,103
               C 116,109 102,115 84,117 C 60,120 38,118 24,114 C 10,110 4,111 5,106 Z"
            fill="${bodyColor}"/>
      <ellipse cx="52" cy="112" rx="26" ry="3.6" fill="none" stroke="${accent}" stroke-width="1.8" opacity="0.5"/>
      <ellipse cx="90" cy="116" rx="14" ry="2.8" fill="none" stroke="${accent}" stroke-width="1.8" opacity="0.42"/>

      <path d="M 24,133 C 26,137 27,140 25,140 L 20,140 C 19,137 21,134 24,133 Z" fill="${bodyColor}"/>
      <path d="M 60,136 C 62,139 63,140 61,140 L 56,140 C 55,138 57,136 60,136 Z" fill="${bodyColor}"/>
      <path d="M 98,132 C 100,136 101,140 99,140 L 94,140 C 93,137 95,133 98,132 Z" fill="${bodyColor}"/>
    </g>
  `
  )
}

// 그림자렉스, the chapter boss: deliberately the largest figure in the file.
// The head alone is wider than 깜빡괴물's whole body, the open jaw runs off the
// right edge of the viewBox, and the tail runs off the left, so the animal
// reads as too big for its own frame.
export function dinoShadowRex({ bodyColor = '#4a4a52', accent = '#22222a' } = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="58" cy="136" rx="52" ry="6" fill="#000" opacity="0.14"/>

      <path d="M 34,86 C 22,80 8,70 0,56 C 2,78 16,94 36,102 Z" fill="${bodyColor}"/>
      <path d="M 34,86 C 22,80 8,70 0,56 C 12,70 26,80 36,88 Z" fill="${accent}"/>

      ${farLimb(
        `M 40,92 C 26,100 18,114 22,126 C 24,133 28,137 30,140 L 52,140 L 52,132
         C 38,130 32,125 32,117 C 32,107 40,99 46,95 Z`,
        bodyColor
      )}

      <path d="M 26,92 C 22,66 44,48 70,50 C 92,52 104,68 100,90 C 96,112 60,120 44,108 Z" fill="${bodyColor}"/>
      <path d="M 34,100 C 48,114 84,110 98,88 C 96,106 78,116 58,114 C 44,112 36,108 34,100 Z" fill="${BELLY}" opacity="0.5"/>
      <path d="M 32,104 C 46,120 88,116 100,90 C 100,114 62,126 38,112 Z" fill="${accent}"/>

      <path d="M 36,58 L 42,44 L 48,58 Z" fill="${accent}"/>
      <path d="M 50,52 L 57,37 L 63,52 Z" fill="${accent}"/>
      <path d="M 65,50 L 72,36 L 78,51 Z" fill="${accent}"/>

      <path d="M 52,94 C 42,102 34,118 39,130 C 42,137 46,140 48,140 L 74,140 L 74,131
               C 58,128 51,122 51,113 C 51,103 60,96 66,92 Z" fill="${bodyColor}"/>
      <path d="M 74,130 C 86,131 96,135 100,140 L 72,140 Z" fill="${BONE}"/>

      <path d="M 82,72 C 92,76 100,84 99,92 C 96,95 90,92 87,86 C 84,80 82,76 82,72 Z" fill="${bodyColor}"/>
      <path d="M 97,90 C 104,92 108,95 108,97 C 104,99 98,96 95,93 Z" fill="${BONE}"/>

      <path d="M 62,42 C 58,20 76,4 96,6 C 112,8 120,20 120,32
               C 120,38 114,42 106,42 C 96,50 74,54 62,42 Z" fill="${bodyColor}"/>
      <path d="M 68,44 C 82,54 106,50 118,38 C 120,44 120,52 114,58
               C 100,66 74,62 66,52 Z" fill="${accent}"/>
      <path d="M 78,44 L 82,54 L 87,44 Z" fill="${BONE}"/>
      <path d="M 90,45 L 94,55 L 99,44 Z" fill="${BONE}"/>
      <path d="M 102,43 L 106,52 L 111,41 Z" fill="${BONE}"/>
      <path d="M 84,58 L 88,50 L 92,59 Z" fill="${BONE}"/>
      <path d="M 98,57 L 102,49 L 106,57 Z" fill="${BONE}"/>
      <path d="M 64,26 C 56,18 48,14 40,14 C 50,19 58,25 62,32 Z" fill="${accent}"/>
      ${angryEye(84, 26, 7.4)}
    </g>
  `
  )
}
