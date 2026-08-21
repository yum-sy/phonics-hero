// Angular "transforming car robot" art for the four카봇 robots. Replaces the
// earlier rounded-block versions, which read as soft toy bricks at every size.
//
// DESIGN GRAMMAR — every robot in this file follows all of it. Later
// style-family files should copy the structure, not the coordinates.
//
//  1. CHEST = CAR FRONT. The single element that makes the figure read as a
//     transforming car robot: a windshield trapezoid on top, a full-width dark
//     grille band under it with two bright headlight polygons at its ends and
//     silver slats between them, then the emblem plate below.
//  2. SHOULDERS = CAR DOOR WEDGES tilted outward, with the wheel exposed at
//     the outer end (dark tyre + mid hub + bright centre).
//  3. BACK FINS/SPOILERS poke up and back past the shoulders so the
//     silhouette has direction even as a solid black shape.
//  4. HEAD is small: a narrow horizontal visor slit, a V crest above it, ear
//     blocks at the sides, a mouth-guard block below.
//  5. LIMBS LAYER dark machine frame (accent) under bright armour plates
//     (bodyColor), with an angular knee guard at the joint.
//  6. THIN WAIST, HEAVY BOOTS wider than the ankle.
//  7. THREE-TONE BLOCKING: bodyColor armour + accent machinery + fixed
//     neutrals (CHROME/STEEL/MECH) + glass. Flat fills only — the metallic
//     look comes from overlaying a brighter facet polygon, never a gradient.
//  8. NO ROUNDED RECTANGLES. Corners are polygons; `rect` is used only where
//     a true square edge is wanted (grille slats).
//
// The `emblem` letter is curriculum content, not decoration — the child ties
// the sound to the character — so its plate is deliberately oversized. It is
// also the only non-colour difference between 새미/에이스/터보, which all
// render through `heroRobot`.
//
// This file must not import ../art.js (circular); it carries its own svgWrap.

function svgWrap(inner, viewBox = '0 0 120 140') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

// Right-side limbs are exact mirrors of the left, so both are generated from
// one point list; hand-copied mirrors drifted by a unit or two and made the
// figures look accidentally lopsided.
function mirror(points) {
  return points
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(',')
      return `${120 - Number(x)},${y}`
    })
    .join(' ')
}

const CHROME = '#f5f2ea' // brightest neutral: crest, headlights, panel facets
const STEEL = '#b8b8b8' // mid neutral: grille slats, wheel hubs, mouth guard
const MECH = '#2c2c2a' // exposed machinery, neck, brow shadow
const MECH_DEEP = '#18181a' // grille cavity, tyres, eye housings
const HOSTILE = '#ff4b3e' // villain eye/core glow, always on a MECH_DEEP housing
const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Standard hero: 새미 / 에이스 / 터보. Car front on the chest, door-wedge
// shoulders with exposed wheels, one oversized emblem plate.
export function heroRobot({
  bodyColor = '#378add',
  accent = '#0c447c',
  emblem = 'S',
  visorColor = '#eafcff',
} = {}) {
  const fin = '38,44 10,20 6,34 34,56'
  const finTip = '10,20 6,34 16,29'
  const shoulder = '37,42 19,47 15,68 35,64'
  const shoulderFacet = '37,42 21,46 22,53 37,49'
  const upperArm = '18,66 34,63 33,80 20,84'
  const armPlate = '16,68 26,66 25,80 15,82'
  const forearm = '17,80 32,78 33,94 19,96'
  const fist = '16,92 32,90 33,102 18,104'
  const knuckle = '18,94 31,92 31,97 18,99'
  const thigh = '44,102 58,102 57,118 45,118'
  const thighPlate = '42,104 52,104 51,116 41,116'
  const shin = '43,121 56,121 55,130 44,130'
  const knee = '41,114 57,114 56,124 42,124'
  const kneeNotch = '43,116 54,116 53,120 43,120'
  const boot = '38,126 58,126 59,134 37,134'
  const bootFacet = '38,126 58,126 58,129 38,129'
  const headlight = '43,57 52,57 51,67 44,67'
  const ear = '39,22 43,20 43,32 39,30'

  return svgWrap(
    `
    <g>
      <polygon points="36,133 84,133 78,139 42,139" fill="#000" opacity="0.09"/>

      <polygon points="${fin}" fill="${accent}"/>
      <polygon points="${mirror(fin)}" fill="${accent}"/>
      <polygon points="${finTip}" fill="${CHROME}"/>
      <polygon points="${mirror(finTip)}" fill="${CHROME}"/>

      <polygon points="54,34 66,34 65,44 55,44" fill="${MECH}"/>

      <polygon points="46,92 74,92 72,104 48,104" fill="${accent}"/>
      <polygon points="55,94 65,94 64,101 56,101" fill="${STEEL}"/>
      <polygon points="${thigh}" fill="${accent}"/>
      <polygon points="${mirror(thigh)}" fill="${accent}"/>
      <polygon points="${thighPlate}" fill="${bodyColor}"/>
      <polygon points="${mirror(thighPlate)}" fill="${bodyColor}"/>
      <polygon points="${shin}" fill="${accent}"/>
      <polygon points="${mirror(shin)}" fill="${accent}"/>
      <polygon points="${knee}" fill="${bodyColor}"/>
      <polygon points="${mirror(knee)}" fill="${bodyColor}"/>
      <polygon points="${kneeNotch}" fill="${STEEL}"/>
      <polygon points="${mirror(kneeNotch)}" fill="${STEEL}"/>
      <polygon points="${boot}" fill="${bodyColor}"/>
      <polygon points="${mirror(boot)}" fill="${bodyColor}"/>
      <polygon points="${bootFacet}" fill="#fff" opacity="0.22"/>
      <polygon points="${mirror(bootFacet)}" fill="#fff" opacity="0.22"/>

      <polygon points="38,42 82,42 78,80 74,94 46,94 42,80" fill="${bodyColor}"/>
      <polygon points="45,44 75,44 78,53 42,53" fill="${visorColor}"/>
      <rect x="59" y="44" width="2.4" height="9" fill="${bodyColor}"/>
      <polygon points="41,55 79,55 78,69 42,69" fill="${MECH_DEEP}"/>
      <polygon points="${headlight}" fill="${CHROME}"/>
      <polygon points="${mirror(headlight)}" fill="${CHROME}"/>
      <rect x="53" y="58" width="3.6" height="8" fill="${STEEL}"/>
      <rect x="58.2" y="58" width="3.6" height="8" fill="${STEEL}"/>
      <rect x="63.4" y="58" width="3.6" height="8" fill="${STEEL}"/>
      <polygon points="45,71 75,71 73,93 47,93" fill="${CHROME}"/>
      <text x="60" y="89" text-anchor="middle" font-family="${FONT}" font-size="21" font-weight="800" fill="${accent}">${emblem}</text>

      <polygon points="${shoulder}" fill="${bodyColor}"/>
      <polygon points="${mirror(shoulder)}" fill="${bodyColor}"/>
      <polygon points="${shoulderFacet}" fill="#fff" opacity="0.24"/>
      <polygon points="${mirror(shoulderFacet)}" fill="#fff" opacity="0.24"/>
      <circle cx="20" cy="63" r="9" fill="${MECH_DEEP}"/>
      <circle cx="20" cy="63" r="4.6" fill="${STEEL}"/>
      <circle cx="20" cy="63" r="1.8" fill="${CHROME}"/>
      <circle cx="100" cy="63" r="9" fill="${MECH_DEEP}"/>
      <circle cx="100" cy="63" r="4.6" fill="${STEEL}"/>
      <circle cx="100" cy="63" r="1.8" fill="${CHROME}"/>

      <polygon points="${upperArm}" fill="${accent}"/>
      <polygon points="${mirror(upperArm)}" fill="${accent}"/>
      <polygon points="${armPlate}" fill="${bodyColor}"/>
      <polygon points="${mirror(armPlate)}" fill="${bodyColor}"/>
      <polygon points="${forearm}" fill="${accent}"/>
      <polygon points="${mirror(forearm)}" fill="${accent}"/>
      <polygon points="${fist}" fill="${bodyColor}"/>
      <polygon points="${mirror(fist)}" fill="${bodyColor}"/>
      <polygon points="${knuckle}" fill="${STEEL}"/>
      <polygon points="${mirror(knuckle)}" fill="${STEEL}"/>

      <polygon points="${ear}" fill="${accent}"/>
      <polygon points="${mirror(ear)}" fill="${accent}"/>
      <polygon points="43,16 77,16 79,28 72,39 48,39 41,28" fill="${bodyColor}"/>
      <polygon points="45,21 75,21 74,24 46,24" fill="${MECH}"/>
      <polygon points="46,24 74,24 72,31 48,31" fill="${visorColor}"/>
      <polygon points="51,32 69,32 68,38 52,38" fill="${STEEL}"/>
      <polygon points="52,18 60,3 68,18 60,12" fill="${CHROME}"/>
    </g>
  `
  )
}

// 카본, the combined final form: deliberately the heaviest silhouette in the
// app — wider shoulders, thicker legs, a two-pronged crest, and a small car
// parked on each shoulder so "three of them merged" reads at a glance.
export function heroDeluxeRobot({
  bodyColor = '#d1332f',
  panelColor = '#f5f2ea',
  accent = '#f4c95d',
  visorColor = '#5dd6e0',
} = {}) {
  const fin = '36,42 2,12 0,32 32,56'
  const finTip = '2,12 0,32 11,25'
  const shoulder = '31,40 6,47 2,74 28,68'
  const shoulderFacet = '31,40 8,46 10,54 31,48'
  const carBody = '5,36 10,28 25,28 30,36 30,44 4,44'
  const carWindow = '12,30 23,30 25,35 11,35'
  const carSill = '4,40 30,40 30,44 4,44'
  const upperArm = '13,68 30,64 29,84 15,88'
  const armPlate = '10,70 22,68 21,84 9,86'
  const forearm = '12,84 28,81 29,100 14,102'
  const fist = '10,97 27,94 28,109 12,111'
  const knuckle = '12,100 26,97 26,102 12,105'
  const thigh = '40,104 58,104 57,121 42,121'
  const thighPlate = '37,106 50,106 49,119 36,119'
  const shin = '39,119 57,119 56,130 41,130'
  const knee = '35,113 57,113 56,125 37,125'
  const kneeNotch = '38,115 54,115 53,120 38,120'
  const boot = '32,127 59,127 60,137 31,137'
  const bootFacet = '32,127 59,127 59,131 32,131'
  const headlight = '36,57 49,57 48,69 37,69'
  const ear = '36,20 40,18 40,33 36,31'
  const crest = '47,14 40,0 54,13'

  return svgWrap(
    `
    <g>
      <polygon points="30,136 90,136 84,140 36,140" fill="#000" opacity="0.13"/>

      <polygon points="${fin}" fill="${accent}"/>
      <polygon points="${mirror(fin)}" fill="${accent}"/>
      <polygon points="${finTip}" fill="${panelColor}"/>
      <polygon points="${mirror(finTip)}" fill="${panelColor}"/>

      <polygon points="52,34 68,34 67,44 53,44" fill="${MECH}"/>

      <polygon points="44,92 76,92 74,106 46,106" fill="${MECH}"/>
      <polygon points="54,95 66,95 65,103 55,103" fill="${accent}"/>
      <polygon points="${thigh}" fill="${MECH}"/>
      <polygon points="${mirror(thigh)}" fill="${MECH}"/>
      <polygon points="${thighPlate}" fill="${bodyColor}"/>
      <polygon points="${mirror(thighPlate)}" fill="${bodyColor}"/>
      <polygon points="${shin}" fill="${MECH}"/>
      <polygon points="${mirror(shin)}" fill="${MECH}"/>
      <polygon points="${knee}" fill="${bodyColor}"/>
      <polygon points="${mirror(knee)}" fill="${bodyColor}"/>
      <polygon points="${kneeNotch}" fill="${accent}"/>
      <polygon points="${mirror(kneeNotch)}" fill="${accent}"/>
      <polygon points="${boot}" fill="${bodyColor}"/>
      <polygon points="${mirror(boot)}" fill="${bodyColor}"/>
      <polygon points="${bootFacet}" fill="#fff" opacity="0.22"/>
      <polygon points="${mirror(bootFacet)}" fill="#fff" opacity="0.22"/>

      <polygon points="32,40 88,40 84,80 79,96 41,96 36,80" fill="${bodyColor}"/>
      <polygon points="38,42 82,42 85,53 35,53" fill="${visorColor}"/>
      <rect x="58.8" y="42" width="2.6" height="11" fill="${bodyColor}"/>
      <polygon points="34,55 86,55 85,71 35,71" fill="${MECH_DEEP}"/>
      <polygon points="${headlight}" fill="${panelColor}"/>
      <polygon points="${mirror(headlight)}" fill="${panelColor}"/>
      <rect x="51" y="58" width="4.4" height="10" fill="${STEEL}"/>
      <rect x="57.8" y="58" width="4.4" height="10" fill="${STEEL}"/>
      <rect x="64.6" y="58" width="4.4" height="10" fill="${STEEL}"/>
      <polygon points="41,72 79,72 77,97 43,97" fill="${accent}"/>
      <polygon points="44,74 76,74 74,95 46,95" fill="${panelColor}"/>
      <text x="60" y="91" text-anchor="middle" font-family="${FONT}" font-size="22" font-weight="800" fill="${bodyColor}">★</text>

      <polygon points="${shoulder}" fill="${bodyColor}"/>
      <polygon points="${mirror(shoulder)}" fill="${bodyColor}"/>
      <polygon points="${shoulderFacet}" fill="${panelColor}"/>
      <polygon points="${mirror(shoulderFacet)}" fill="${panelColor}"/>
      <circle cx="12" cy="69" r="10" fill="${MECH_DEEP}"/>
      <circle cx="12" cy="69" r="5" fill="${STEEL}"/>
      <circle cx="12" cy="69" r="2" fill="${panelColor}"/>
      <circle cx="108" cy="69" r="10" fill="${MECH_DEEP}"/>
      <circle cx="108" cy="69" r="5" fill="${STEEL}"/>
      <circle cx="108" cy="69" r="2" fill="${panelColor}"/>

      <polygon points="${carBody}" fill="${panelColor}"/>
      <polygon points="${mirror(carBody)}" fill="${panelColor}"/>
      <polygon points="${carWindow}" fill="${visorColor}"/>
      <polygon points="${mirror(carWindow)}" fill="${visorColor}"/>
      <polygon points="${carSill}" fill="${accent}"/>
      <polygon points="${mirror(carSill)}" fill="${accent}"/>
      <circle cx="11" cy="44" r="3.8" fill="${MECH_DEEP}"/>
      <circle cx="24" cy="44" r="3.8" fill="${MECH_DEEP}"/>
      <circle cx="109" cy="44" r="3.8" fill="${MECH_DEEP}"/>
      <circle cx="96" cy="44" r="3.8" fill="${MECH_DEEP}"/>

      <polygon points="${upperArm}" fill="${MECH}"/>
      <polygon points="${mirror(upperArm)}" fill="${MECH}"/>
      <polygon points="${armPlate}" fill="${bodyColor}"/>
      <polygon points="${mirror(armPlate)}" fill="${bodyColor}"/>
      <polygon points="${forearm}" fill="${MECH}"/>
      <polygon points="${mirror(forearm)}" fill="${MECH}"/>
      <polygon points="${fist}" fill="${bodyColor}"/>
      <polygon points="${mirror(fist)}" fill="${bodyColor}"/>
      <polygon points="${knuckle}" fill="${panelColor}"/>
      <polygon points="${mirror(knuckle)}" fill="${panelColor}"/>

      <polygon points="${ear}" fill="${accent}"/>
      <polygon points="${mirror(ear)}" fill="${accent}"/>
      <polygon points="${crest}" fill="${accent}"/>
      <polygon points="${mirror(crest)}" fill="${accent}"/>
      <polygon points="40,13 80,13 82,27 74,39 46,39 38,27" fill="${bodyColor}"/>
      <polygon points="43,20 77,20 76,23 44,23" fill="${MECH}"/>
      <polygon points="44,23 76,23 74,31 46,31" fill="${visorColor}"/>
      <polygon points="49,32 71,32 70,39 50,39" fill="${STEEL}"/>
      <polygon points="56,14 60,4 64,14" fill="${panelColor}"/>
    </g>
  `
  )
}

// Standard villain: the same angular plating language as the heroes so the two
// belong in one battle scene, inverted in character — a cracked armour plate
// and a glowing core where the car front would be, spikes and a saw blade
// where the wheels would be, and a deliberately lopsided build (one clawed
// arm, one fist) against the heroes' strict symmetry.
export function villainRobot({ bodyColor = '#e24b4a', accent = '#791f1f' } = {}) {
  const shoulder = '37,42 19,47 15,68 35,64'
  const spikeUp = '19,47 5,31 25,44'
  const spikeOut = '15,68 1,60 16,55'
  const upperArm = '18,66 34,63 33,80 20,84'
  const armPlate = '16,68 26,66 25,80 15,82'
  const forearm = '17,80 32,78 33,94 19,96'
  const thigh = '44,102 58,102 57,118 45,118'
  const thighPlate = '42,104 52,104 51,116 41,116'
  const shin = '43,121 56,121 55,130 44,130'
  const knee = '41,114 57,114 56,124 42,124'
  const boot = '38,124 58,124 59,132 37,132'
  const eyeHousing = '42,21 60,28 60,38 42,33'
  const eye = '45,24 58,30 58,36 45,31'
  const claw = '38,131 44,131 41,139'
  const horn = '41,18 34,0 51,16'

  return svgWrap(
    `
    <g>
      <polygon points="36,136 84,136 78,140 42,140" fill="#000" opacity="0.1"/>

      <polygon points="34,46 4,20 16,44 34,54" fill="${accent}"/>
      <polygon points="86,48 108,30 98,46 86,54" fill="${accent}"/>

      <polygon points="54,34 66,34 65,44 55,44" fill="${MECH}"/>

      <polygon points="46,92 74,92 72,104 48,104" fill="${MECH}"/>
      <polygon points="${thigh}" fill="${MECH}"/>
      <polygon points="${mirror(thigh)}" fill="${MECH}"/>
      <polygon points="${thighPlate}" fill="${bodyColor}"/>
      <polygon points="${mirror(thighPlate)}" fill="${bodyColor}"/>
      <polygon points="${shin}" fill="${MECH}"/>
      <polygon points="${mirror(shin)}" fill="${MECH}"/>
      <polygon points="${knee}" fill="${bodyColor}"/>
      <polygon points="${mirror(knee)}" fill="${bodyColor}"/>
      <polygon points="${boot}" fill="${bodyColor}"/>
      <polygon points="${mirror(boot)}" fill="${bodyColor}"/>
      <polygon points="${claw}" fill="${STEEL}"/>
      <polygon points="${mirror(claw)}" fill="${STEEL}"/>
      <polygon points="45,131 51,131 48,139" fill="${STEEL}"/>
      <polygon points="${mirror('45,131 51,131 48,139')}" fill="${STEEL}"/>

      <polygon points="38,42 82,42 78,80 74,94 46,94 42,80" fill="${bodyColor}"/>
      <polygon points="43,45 79,45 75,70 47,70" fill="${accent}"/>
      <polygon points="43,45 58,45 52,58 43,54" fill="#000" opacity="0.22"/>
      <path d="M59 45 L67 55 L57 60 L65 70" stroke="${MECH_DEEP}" stroke-width="3.6" fill="none"/>
      <polygon points="47,72 73,72 71,93 49,93" fill="${MECH_DEEP}"/>
      <polygon points="60,74 71,82.5 60,91 49,82.5" fill="${HOSTILE}"/>
      <polygon points="60,79 64.5,82.5 60,86 55.5,82.5" fill="${CHROME}"/>

      <polygon points="${shoulder}" fill="${bodyColor}"/>
      <polygon points="${mirror(shoulder)}" fill="${bodyColor}"/>
      <polygon points="${spikeUp}" fill="${accent}"/>
      <polygon points="${mirror(spikeUp)}" fill="${accent}"/>
      <polygon points="${spikeOut}" fill="${accent}"/>
      <circle cx="21" cy="62" r="9.5" fill="${STEEL}"/>
      <polygon points="21,49 26,55 16,55" fill="${STEEL}"/>
      <polygon points="21,75 26,69 16,69" fill="${STEEL}"/>
      <polygon points="8,62 14,57 14,67" fill="${STEEL}"/>
      <polygon points="34,62 28,57 28,67" fill="${STEEL}"/>
      <circle cx="21" cy="62" r="4" fill="${MECH_DEEP}"/>
      <circle cx="99" cy="63" r="8.5" fill="${MECH_DEEP}"/>
      <circle cx="99" cy="63" r="3.6" fill="${accent}"/>

      <polygon points="${upperArm}" fill="${MECH}"/>
      <polygon points="${mirror(upperArm)}" fill="${MECH}"/>
      <polygon points="${armPlate}" fill="${bodyColor}"/>
      <polygon points="${mirror(armPlate)}" fill="${bodyColor}"/>
      <polygon points="${forearm}" fill="${MECH}"/>
      <polygon points="${mirror(forearm)}" fill="${MECH}"/>
      <polygon points="16,92 32,90 33,102 18,104" fill="${bodyColor}"/>
      <polygon points="18,94 31,92 31,97 18,99" fill="${STEEL}"/>
      <polygon points="102,92 92,91 96,104 104,103" fill="${bodyColor}"/>
      <polygon points="103,100 111,96 108,110 101,109" fill="${STEEL}"/>
      <polygon points="93,101 100,99 97,112 91,110" fill="${STEEL}"/>

      <polygon points="${horn}" fill="${accent}"/>
      <polygon points="${mirror(horn)}" fill="${accent}"/>
      <polygon points="53,16 60,0 67,16" fill="${accent}"/>
      <polygon points="43,16 77,16 79,29 70,40 50,40 41,29" fill="${bodyColor}"/>
      <polygon points="${eyeHousing}" fill="${MECH_DEEP}"/>
      <polygon points="${mirror(eyeHousing)}" fill="${MECH_DEEP}"/>
      <polygon points="${eye}" fill="${HOSTILE}"/>
      <polygon points="${mirror(eye)}" fill="${HOSTILE}"/>
      <polygon points="50,34 70,34 68,41 52,41" fill="${MECH_DEEP}"/>
      <polygon points="52,34 56,40 60,34" fill="${CHROME}"/>
      <polygon points="61,34 65,40 69,34" fill="${CHROME}"/>
    </g>
  `
  )
}

// 다크스파크 and the other chapter bosses: the villain grammar scaled up to
// match 카본's mass — a jagged shard cape instead of the hero's back fins, a
// tall horned helm, three spikes per shoulder, and a full-torso reactor core
// where the hero carries its emblem plate. Note the inverted palette here:
// `bodyColor` is the dark armour and `accent` the bright trim.
export function villainDeluxeRobot({
  bodyColor = '#2c2c2a',
  accent = '#b8b8b8',
  capeColor = '#1c1c1c',
  visorColor = '#e24b4a',
} = {}) {
  const capeEdge = '38,40 2,66 12,120 26,104'
  const shoulder = '31,40 5,48 1,74 27,68'
  const spikeA = '31,40 12,18 27,38'
  const spikeB = '5,48 0,26 18,44'
  const spikeC = '1,74 -2,56 14,58'
  const upperArm = '13,68 30,64 29,84 15,88'
  const armPlate = '10,70 22,68 21,84 9,86'
  const forearm = '12,84 28,81 29,100 14,102'
  const clawA = '13,98 22,95 18,113 11,110'
  const clawB = '24,96 31,99 27,114 21,112'
  const thigh = '40,104 58,104 57,121 42,121'
  const thighPlate = '37,106 50,106 49,119 36,119'
  const shin = '39,119 57,119 56,130 41,130'
  const knee = '35,113 57,113 56,125 37,125'
  const boot = '32,126 59,126 60,135 31,135'
  const footClaw = '33,134 40,134 36,140'
  const horn = '44,14 30,-2 40,20'

  return svgWrap(
    `
    <g>
      <polygon points="28,137 92,137 86,140 34,140" fill="#000" opacity="0.15"/>

      <polygon points="38,38 4,64 14,126 40,110 60,120 80,110 106,126 116,64 82,38" fill="${capeColor}"/>
      <polygon points="${capeEdge}" fill="${accent}" opacity="0.28"/>
      <polygon points="${mirror(capeEdge)}" fill="${accent}" opacity="0.28"/>

      <polygon points="52,34 68,34 67,44 53,44" fill="${MECH}"/>

      <polygon points="44,92 76,92 74,106 46,106" fill="${MECH}"/>
      <polygon points="${thigh}" fill="${MECH}"/>
      <polygon points="${mirror(thigh)}" fill="${MECH}"/>
      <polygon points="${thighPlate}" fill="${bodyColor}"/>
      <polygon points="${mirror(thighPlate)}" fill="${bodyColor}"/>
      <polygon points="${shin}" fill="${MECH}"/>
      <polygon points="${mirror(shin)}" fill="${MECH}"/>
      <polygon points="${knee}" fill="${bodyColor}"/>
      <polygon points="${mirror(knee)}" fill="${bodyColor}"/>
      <polygon points="${boot}" fill="${bodyColor}"/>
      <polygon points="${mirror(boot)}" fill="${bodyColor}"/>
      <polygon points="${footClaw}" fill="${accent}"/>
      <polygon points="${mirror(footClaw)}" fill="${accent}"/>
      <polygon points="42,134 49,134 45,140" fill="${accent}"/>
      <polygon points="${mirror('42,134 49,134 45,140')}" fill="${accent}"/>

      <polygon points="32,40 88,40 84,80 79,96 41,96 36,80" fill="${bodyColor}"/>
      <polygon points="37,42 83,42 79,74 41,74" fill="${accent}" opacity="0.35"/>
      <path d="M58 42 L68 54 L55 60 L64 74" stroke="${MECH_DEEP}" stroke-width="4" fill="none"/>
      <polygon points="42,46 78,46 74,90 46,90" fill="${MECH_DEEP}"/>
      <polygon points="60,50 76,68 60,86 44,68" fill="${visorColor}"/>
      <polygon points="60,58 68,68 60,78 52,68" fill="${MECH_DEEP}"/>
      <polygon points="60,63 65,68 60,73 55,68" fill="${CHROME}"/>

      <polygon points="${shoulder}" fill="${bodyColor}"/>
      <polygon points="${mirror(shoulder)}" fill="${bodyColor}"/>
      <polygon points="${spikeA}" fill="${accent}"/>
      <polygon points="${mirror(spikeA)}" fill="${accent}"/>
      <polygon points="${spikeB}" fill="${accent}"/>
      <polygon points="${mirror(spikeB)}" fill="${accent}"/>
      <polygon points="${spikeC}" fill="${accent}"/>
      <polygon points="${mirror(spikeC)}" fill="${accent}"/>
      <circle cx="13" cy="66" r="8" fill="${MECH_DEEP}"/>
      <circle cx="13" cy="66" r="3.4" fill="${visorColor}"/>
      <circle cx="107" cy="66" r="8" fill="${MECH_DEEP}"/>
      <circle cx="107" cy="66" r="3.4" fill="${visorColor}"/>

      <polygon points="${upperArm}" fill="${MECH}"/>
      <polygon points="${mirror(upperArm)}" fill="${MECH}"/>
      <polygon points="${armPlate}" fill="${bodyColor}"/>
      <polygon points="${mirror(armPlate)}" fill="${bodyColor}"/>
      <polygon points="${forearm}" fill="${MECH}"/>
      <polygon points="${mirror(forearm)}" fill="${MECH}"/>
      <polygon points="${clawA}" fill="${accent}"/>
      <polygon points="${mirror(clawA)}" fill="${accent}"/>
      <polygon points="${clawB}" fill="${accent}"/>
      <polygon points="${mirror(clawB)}" fill="${accent}"/>

      <polygon points="${horn}" fill="${accent}"/>
      <polygon points="${mirror(horn)}" fill="${accent}"/>
      <polygon points="40,13 80,13 82,28 72,41 48,41 38,28" fill="${bodyColor}"/>
      <polygon points="42,19 78,19 77,23 43,23" fill="${MECH_DEEP}"/>
      <polygon points="43,23 77,23 73,33 47,33" fill="${MECH_DEEP}"/>
      <polygon points="46,25 74,25 71,31 49,31" fill="${visorColor}"/>
      <polygon points="49,34 71,34 69,41 51,41" fill="${MECH_DEEP}"/>
      <polygon points="51,34 55,40 59,34" fill="${accent}"/>
      <polygon points="61,34 65,40 69,34" fill="${accent}"/>
      <polygon points="54,13 60,1 66,13" fill="${accent}"/>
    </g>
  `
  )
}
