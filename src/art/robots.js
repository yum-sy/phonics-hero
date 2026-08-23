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

// ---------------------------------------------------------------------------
// EMBLEM PLATE SIZING. Shared rule, duplicated verbatim in art/dinosaurs.js,
// art/toys.js and art/platformer.js, and matching art.js `superheroPlate` /
// art/dc.js `emblemPlate`. Five of the seven families could not fit a
// TWO-GLYPH label and Jolly phonics groups 5-7 are entirely digraphs, so
// chapter 8 had to put a `★` on four heroes' chests instead of IE/EE/OR.
//
// TWO LIMITS, THE TIGHTER ONE WINS, so a narrow chest yields a SMALLER glyph
// instead of one that leaves its plate. The em factors are measured off this
// project's rendered font at weight 800 (see public/_emb4.html), not guessed:
//   advance   one capital 0.85 em worst case (M), two capitals 1.43 (OA/OR),
//             the boss star 0.91
//   inked height  capital 0.75 em, star 0.88 em -- a non-letter label needs
//             its own step or it crams the plate edge to edge, which is the
//             `★` defect the DC and platformer families both measured.
// A glyph that stays inside the FRAME can still have left its PLATE, so this
// is checked by pixels (ink mask vs the plate's contrast-holding region),
// never by a viewBox scan.
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

// Bezel + plate + glyph, as a car's framed licence plate. `w`/`h` are the
// BEZEL's outer box; `bezel` is the frame width, so the glyph is sized off
// what is actually left inside. Square corners only (grammar rule 8).
function carPlate(cx, cy, w, h, bezel, bezelColor, plateColor, inkColor, label) {
  const iw = w - bezel * 2
  const ih = h - bezel * 2
  const t = plateType(label, iw, ih)
  const box = (bw, bh, fill) =>
    `<polygon points="${(cx - bw / 2).toFixed(1)},${(cy - bh / 2).toFixed(1)} ` +
    `${(cx + bw / 2).toFixed(1)},${(cy - bh / 2).toFixed(1)} ` +
    `${(cx + bw / 2).toFixed(1)},${(cy + bh / 2).toFixed(1)} ` +
    `${(cx - bw / 2).toFixed(1)},${(cy + bh / 2).toFixed(1)}" fill="${fill}"/>`
  return `${box(w, h, bezelColor)}
      ${box(iw, ih, plateColor)}
      <text x="${cx}" y="${(cy + t.base).toFixed(1)}" text-anchor="middle" font-family="${FONT}"
        font-size="${t.size.toFixed(1)}" font-weight="800" fill="${inkColor}">${t.text}</text>`
}

// Structural silhouette variants for heroRobot -- the user reported that
// chapter 1/8's six heroes (새미/에이스/터보, 나이트로/스피디/스토머) all render
// through this one function and only differ by bodyColor/accent, i.e. "color
// play" with zero silhouette variety. Each variant below only touches the
// BACK FIN, SHOULDER WEDGE, EAR BLOCK and HEAD CREST -- the chest car-front,
// torso taper, emblem plate, arms, legs and boots are left byte-identical to
// the original geometry across every variant, so the plate sizing and
// clipping math already verified for those parts (see the long comments
// above `carPlate` and the torso polygon) does not need re-deriving per
// variant. `crest`/`grille` are functions of the fixed neutrals (never
// bodyColor/accent) so they read the same module consts the base shape did.
const HERO_VARIANTS = {
  // The original heroRobot silhouette, kept as the default so any existing
  // caller that omits `variant` renders pixel-identical to before this file
  // grew variants.
  wedge: {
    fin: '38,44 10,20 6,34 34,56',
    shoulder: '37,42 19,47 15,68 35,64',
    shoulderFacet: '37,42 21,46 22,53 37,49',
    ear: '38,21 42,19 42,33 38,31',
    crest: (CHROME) => `<polygon points="49,17 60,0 71,17 60,9" fill="${CHROME}"/>`,
    grille: (STEEL) => `
      <rect x="53" y="56" width="3.6" height="8" fill="${STEEL}"/>
      <rect x="58.2" y="56" width="3.6" height="8" fill="${STEEL}"/>
      <rect x="63.4" y="56" width="3.6" height="8" fill="${STEEL}"/>`,
  },
  // A wide, low shoulder wing plus a flat back spoiler blade instead of the
  // base's tall bat-fin -- reads as a racing spoiler bolted low across the
  // back rather than a fin sweeping up past the head.
  'spoiler-wide': {
    fin: '34,48 6,44 4,50 30,58',
    shoulder: '37,44 14,44 10,66 35,62',
    shoulderFacet: '37,44 16,44 18,52 37,50',
    ear: '38,21 42,19 42,33 38,31',
    crest: (CHROME) => `<polygon points="49,17 60,0 71,17 60,9" fill="${CHROME}"/>`,
    grille: (STEEL) => `
      <rect x="53" y="56" width="3.6" height="8" fill="${STEEL}"/>
      <rect x="58.2" y="56" width="3.6" height="8" fill="${STEEL}"/>
      <rect x="63.4" y="56" width="3.6" height="8" fill="${STEEL}"/>`,
    strut: true,
  },
  // Twin V crest (two chevrons) instead of one, with the ear block pulled up
  // and out a touch to balance the wider crown.
  'crest-double': {
    fin: '38,44 10,20 6,34 34,56',
    shoulder: '37,42 19,47 15,68 35,64',
    shoulderFacet: '37,42 21,46 22,53 37,49',
    ear: '36,20 44,15 44,33 36,30',
    crest: (CHROME) => `
      <polygon points="42,17 51,2 60,17 51,10" fill="${CHROME}"/>
      <polygon points="60,17 69,2 78,17 69,10" fill="${CHROME}"/>`,
    grille: (STEEL) => `
      <rect x="53" y="56" width="3.6" height="8" fill="${STEEL}"/>
      <rect x="58.2" y="56" width="3.6" height="8" fill="${STEEL}"/>
      <rect x="63.4" y="56" width="3.6" height="8" fill="${STEEL}"/>`,
  },
  // Horizontal grille bands (the base's grille is narrow vertical bars) plus
  // a stepped, louvred shoulder silhouette -- the outer edge itself notches
  // down in three stairs (unlike the other variants' smooth wedge), so this
  // reads as an air-intake vent panel by OUTLINE, not just by an added
  // internal line, and its silhouette is genuinely distinct from `wedge`'s.
  'vent-slats': {
    fin: '38,44 10,20 6,34 34,56',
    shoulder: '37,42 20,42 20,48 16,48 16,54 14,54 14,68 35,64',
    shoulderFacet: '36,42 22,42 22,47 36,47',
    ear: '38,21 42,19 42,33 38,31',
    crest: (CHROME) => `<polygon points="49,17 60,0 71,17 60,9" fill="${CHROME}"/>`,
    grille: (STEEL) => `
      <rect x="52" y="57" width="16" height="2.8" fill="${STEEL}"/>
      <rect x="52" y="61.5" width="16" height="2.8" fill="${STEEL}"/>`,
    vents: true,
  },
}

// Standard hero: 새미 / 에이스 / 터보. Car front on the chest, door-wedge
// shoulders with exposed wheels, one oversized emblem plate. `variant` picks
// a structural silhouette from HERO_VARIANTS (see its comment) -- callers
// that omit it keep the original 'wedge' shape.
export function heroRobot({
  bodyColor = '#378add',
  accent = '#0c447c',
  emblem = 'S',
  visorColor = '#eafcff',
  variant = 'wedge',
} = {}) {
  const V = HERO_VARIANTS[variant] || HERO_VARIANTS.wedge
  const fin = V.fin
  const shoulder = V.shoulder
  const shoulderFacet = V.shoulderFacet
  const ear = V.ear
  const upperArm = '18,66 34,63 33,80 20,84'
  const armPlate = '16,68 26,66 25,80 15,82'
  const forearm = '17,80 32,78 33,94 19,96'
  const fist = '16,92 32,90 33,102 18,104'
  const knuckle = '18,94 31,92 31,97 18,99'
  const thigh = '44,102 58,102 57,118 45,118'
  const thighPlate = '42,104 52,104 51,116 41,116'
  const shin = '43,120 56,120 55,128 44,128'
  const knee = '41,113 57,113 56,123 42,123'
  const boot = '36,124 60,124 61,132 35,132'
  const sole = '35,130 61,130 61,133 35,133'
  const headlight = '42,56 51,56 50,64 43,64'

  return svgWrap(
    `
    <g>
      <polygon points="34,134 86,134 80,140 40,140" fill="#000" opacity="0.09"/>

      <polygon points="${fin}" fill="${accent}"/>
      <polygon points="${mirror(fin)}" fill="${accent}"/>
      ${
        V.strut
          ? `<polygon points="32,48 35,48 34,54 31,53" fill="${accent}"/>
      <polygon points="${mirror('32,48 35,48 34,54 31,53')}" fill="${accent}"/>`
          : ''
      }

      <polygon points="54,34 66,34 65,44 55,44" fill="${MECH}"/>

      ${/* Down 4 units with the torso's new hem at y=98, so the same amount
            of hip machinery stays visible between the thighs as before. */ ''}
      <polygon points="46,96 74,96 72,108 48,108" fill="${accent}"/>
      <polygon points="55,98 65,98 64,105 56,105" fill="${STEEL}"/>
      <polygon points="${thigh}" fill="${accent}"/>
      <polygon points="${mirror(thigh)}" fill="${accent}"/>
      <polygon points="${thighPlate}" fill="${bodyColor}"/>
      <polygon points="${mirror(thighPlate)}" fill="${bodyColor}"/>
      <polygon points="${shin}" fill="${accent}"/>
      <polygon points="${mirror(shin)}" fill="${accent}"/>
      <polygon points="${knee}" fill="${bodyColor}"/>
      <polygon points="${mirror(knee)}" fill="${bodyColor}"/>
      <polygon points="${boot}" fill="${bodyColor}"/>
      <polygon points="${mirror(boot)}" fill="${bodyColor}"/>
      <polygon points="${sole}" fill="${MECH}"/>
      <polygon points="${mirror(sole)}" fill="${MECH}"/>

      ${/* THE CAR FRONT IS RE-PROPORTIONED FOR THE PLATE, and the plate is why.
            The old torso tapered from y=42 (44 units wide) to 28 units at
            y=94, so the plate's widest usable row was 26.7 and the letter's
            BASELINE -- the row a glyph needs most -- sat in the narrowest
            part of the chest. Measured, `OA` inked 29.5 units there and left
            the plate on both sides. Straightening the chest to y=90 and
            wedging to the waist over 8 units instead of 52 gives a 25-unit
            plate band that is 40 wide all the way down, which is what makes
            a two-glyph label possible at all. The windshield loses 2 units
            and the grille cavity 2 to pay for the plate's extra height; the
            waist is still the narrowest point of the figure, it is just a
            sharp wedge now instead of a long slope, which is the more
            transforming-car shape of the two anyway. */ ''}
      <polygon points="38,42 82,42 82,90 74,98 46,98 38,90" fill="${bodyColor}"/>
      <polygon points="44,43 76,43 78,52 42,52" fill="${visorColor}"/>
      <rect x="58.8" y="43" width="2.4" height="9" fill="${bodyColor}"/>
      <polygon points="40,54 80,54 80,66 40,66" fill="${MECH_DEEP}"/>
      <polygon points="${headlight}" fill="#eafcff"/>
      <polygon points="${mirror(headlight)}" fill="#eafcff"/>
      ${V.grille(STEEL)}
      ${carPlate(60, 79.5, 36, 25, 2.2, accent, CHROME, accent, emblem)}

      <polygon points="${shoulder}" fill="${bodyColor}"/>
      <polygon points="${mirror(shoulder)}" fill="${bodyColor}"/>
      <polygon points="${shoulderFacet}" fill="#fff" opacity="0.24"/>
      <polygon points="${mirror(shoulderFacet)}" fill="#fff" opacity="0.24"/>
      ${
        V.vents
          ? `<rect x="19" y="50" width="11" height="2" fill="${MECH_DEEP}"/>
      <rect x="18" y="55" width="12" height="2" fill="${MECH_DEEP}"/>
      <rect x="17" y="60" width="13" height="2" fill="${MECH_DEEP}"/>
      <rect x="90" y="50" width="11" height="2" fill="${MECH_DEEP}"/>
      <rect x="90" y="55" width="12" height="2" fill="${MECH_DEEP}"/>
      <rect x="90" y="60" width="13" height="2" fill="${MECH_DEEP}"/>`
          : ''
      }
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
      <polygon points="42,15 78,15 80,28 73,40 47,40 40,28" fill="${bodyColor}"/>
      <polygon points="44,20 76,20 75,24 45,24" fill="${MECH}"/>
      <polygon points="45,24 75,24 73,32 47,32" fill="${visorColor}"/>
      <polygon points="49,33 71,33 69,40 51,40" fill="${MECH}"/>
      <rect x="52" y="34" width="16" height="1.8" fill="${STEEL}"/>
      ${V.crest(CHROME)}
      <polygon points="43,15 33,7 41,18" fill="${accent}"/>
      <polygon points="${mirror('43,15 33,7 41,18')}" fill="${accent}"/>
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
  // The `★` used to be inked in `bodyColor`, which measured 4.97:1 on the
  // cream plate. A mid-tone cannot be rescued by any plate colour -- #d1332f
  // is 4.99:1 even on pure white -- so the ink is the SAME RED PUSHED DEEP,
  // never black and never a hue change. 11:1 measured, and it still reads as
  // this character's red.
  inkColor = '#5e1210',
  emblem = '★',
} = {}) {
  const fin = '36,42 2,12 0,32 32,56'
  const finTip = '2,12 0,32 11,25'
  const shoulder = '31,40 6,47 2,74 28,68'
  const shoulderFacet = '31,40 8,46 10,54 31,48'
  const carBody = '4,35 10,26 25,26 31,35 31,45 3,45'
  const carWindow = '11,28 24,28 27,35 8,35'
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
      <polygon points="${headlight}" fill="#eafcff"/>
      <polygon points="${mirror(headlight)}" fill="#eafcff"/>
      <rect x="51" y="58" width="4.4" height="10" fill="${STEEL}"/>
      <rect x="57.8" y="58" width="4.4" height="10" fill="${STEEL}"/>
      <rect x="64.6" y="58" width="4.4" height="10" fill="${STEEL}"/>
      ${carPlate(60, 83.5, 36, 26, 2.4, accent, panelColor, inkColor, emblem)}

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
      <polygon points="${carWindow}" fill="${MECH_DEEP}"/>
      <polygon points="${mirror(carWindow)}" fill="${MECH_DEEP}"/>
      <circle cx="10" cy="45" r="4.6" fill="${MECH_DEEP}"/>
      <circle cx="25" cy="45" r="4.6" fill="${MECH_DEEP}"/>
      <circle cx="110" cy="45" r="4.6" fill="${MECH_DEEP}"/>
      <circle cx="95" cy="45" r="4.6" fill="${MECH_DEEP}"/>

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
      <polygon points="49,32 71,32 70,39 50,39" fill="${MECH}"/>
      <rect x="52" y="34" width="16" height="1.8" fill="${STEEL}"/>
      <rect x="53" y="37" width="14" height="1.8" fill="${STEEL}"/>
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
      <polygon points="43,45 60,45 54,57 43,53" fill="#000" opacity="0.26"/>
      <polygon points="65,45 68,45 63,57 70,70 66,70 60,57" fill="${MECH_DEEP}"/>
      <polygon points="52,60 55,58 51,70 48,70" fill="${MECH_DEEP}"/>
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
      <polygon points="99,54 107,58 107,68 99,72 91,68 91,58" fill="${MECH_DEEP}"/>
      <polygon points="99,58 103,60 103,66 99,68 95,66 95,60" fill="${accent}"/>

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
  const spikeC = '2,74 0,55 14,58'
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
  const horn = '44,14 29,0 40,20'

  return svgWrap(
    `
    <g>
      <polygon points="28,137 92,137 86,140 34,140" fill="#000" opacity="0.15"/>

      <polygon points="38,38 4,64 14,126 40,110 60,120 80,110 106,126 116,64 82,38" fill="${capeColor}"/>
      <polygon points="${capeEdge}" fill="${accent}" opacity="0.45"/>
      <polygon points="${mirror(capeEdge)}" fill="${accent}" opacity="0.45"/>

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
      <polygon points="62,42 67,42 60,56 70,74 64,74 55,56" fill="${MECH_DEEP}"/>
      <polygon points="46,42 74,42 80,52 76,84 60,94 44,84 40,52" fill="${accent}"/>
      <polygon points="47,46 73,46 76,54 72,82 60,90 48,82 44,54" fill="${MECH_DEEP}"/>
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
      <polygon points="40,13 80,13 81,20 39,20" fill="${accent}"/>
      <polygon points="38,25 45,25 43,39 39,32" fill="${accent}"/>
      <polygon points="${mirror('38,25 45,25 43,39 39,32')}" fill="${accent}"/>
      <polygon points="43,21 77,21 73,33 47,33" fill="${MECH_DEEP}"/>
      <polygon points="46,24 74,24 71,31 49,31" fill="${visorColor}"/>
      <polygon points="49,34 71,34 69,41 51,41" fill="${MECH_DEEP}"/>
      <polygon points="51,34 55,40 59,34" fill="${accent}"/>
      <polygon points="61,34 65,40 69,34" fill="${accent}"/>
      <polygon points="54,13 60,1 66,13" fill="${accent}"/>
    </g>
  `
  )
}
