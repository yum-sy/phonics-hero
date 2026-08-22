// Platformer-family character art — chapter 5, the jump-platformer genre slot
// in the world order.
//
// REVISION NOTE (v2): v1 drew generic "2D game sprites" — 2.5 heads tall, one
// flat body colour, a head WIDER than its own torso. It read as a toddler
// mascot, and nothing in it said which genre the chapter belongs to. The genre
// has a much more specific grammar than "sprite": a squat grown-up in a
// brimmed cap and DUNGAREES, warm shirt above, cool denim below, a big round
// nose, oversized white gloves and boots. That silhouette and that two-tone
// are the entire borrow — no moustache (that is one specific character's
// property, not the genre's), no franchise face, logo, or colour placement.
//
// DESIGN GRAMMAR — every hero in this file follows all of it.
//
//  1. SQUAT GROWN-UP PROPORTIONS, ~3 heads tall (v1 was 2.5). The head is 46
//     of a ~134-unit figure, and — the load-bearing change — it is NARROWER
//     than the shoulders, which are narrower than the hips: 36 / 50 / 71 units
//     wide, against v1's head 48 over a 40-wide torso (a head wider than its
//     own body is what made v1 read as a toddler). Limbs stay short and thick.
//  2. DUNGAREE TWO-TONE, split top from bottom. Shirt, sleeves and cap dome
//     take the palette's `bodyColor`; the bib, straps and trouser legs take
//     the fixed DENIM constant. DENIM is deliberately NOT palette-driven:
//     the genre read only survives if the bottom half is reliably cool
//     whatever colour a chapter hands the shirt, and DENIM_DEEP rims every
//     denim piece so it keeps an edge even against a blue shirt.
//  3. THE DUNGAREES MUST SURVIVE A FLAT GREY SILHOUETTE — three devices, all
//     structural rather than coloured: the bib is WIDER than the shirt so the
//     outline steps outward at the waist; the two straps run PAST the
//     shoulder line as knobs; and the two big buttons are centred ON the
//     bib's outer edge, so half of each circle sticks out of the body.
//  4. OVERSIZED WHITE GLOVES AND BOOTS, separate masses with air between them
//     and the body. heroGlove/heroBoot carry knuckle creases, thumb lobes,
//     cuff bands, toe caps and sole slabs; the villains keep the older flat
//     glove()/shoe(), so hero hands and villain hands differ on sight.
//  5. CAP WITH A WIDE BRIM, panel seams on the dome, a shadow cast on the
//     forehead, and a bright front disc.
//  6. BIG ROUND NOSE — the genre's strongest face tell — over two ink eyes
//     with a highlight, blushed cheeks and one mouth stroke.
//  7. FLAT FILLS, GEOMETRIC PRIMITIVES, NO GRADIENTS OR FILTERS. Volume comes
//     from stacking planes: a lighter inset shape on the lit side, `#000` at
//     low opacity on the shaded side — the same trick robots.js uses for its
//     metal facets.
//  8. ONE POSE IDEA PER HERO, readable as a solid shape: airborne / coiled /
//     boxy / winged-and-massive.
//  9. THE EMBLEM PLATE SITS ON THE BIB, not on the shirt. v2's first attempt
//     put it on the chest and the plate plus the two straps covered the shirt
//     completely — the figures came out all denim and the two-tone died. On
//     the bib, the plate also gets the strongest possible contrast (a bright
//     plate on dark denim) for the phonics letter.
//
// SIZES: judged at 132–256 px, which is what style.css actually renders (132
// combine minibot, 170 map node, 186 battle sprite, 250 reward, 256 final
// form). 66 px only has to stay recognisable, so detail is no longer capped
// at 3 viewBox units — but the `emblem` letter is curriculum content, not
// decoration, so its plate stays oversized past good taste.
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
const SKIN_SHADE = '#e7ab7c' // jaw/ear shading plane
const NOSE = '#ffc79c'
const NOSE_SHADE = '#dd9166'
const CHEEK = '#ff9d86'
const GLOVE = '#fffdf7'
const GLOVE_RIM = '#e3d9c8' // keeps the white gloves edged on near-white surfaces
const GLOVE_SHADE = '#cdc0ab' // knuckle creases
const SHOE = '#4a3320' // warm dark brown, never the robots' cold grey
const SOLE = '#2a1d12'
const SOLE_MID = '#6f4f31'
const INK = '#33283c' // eyes and mouth

// Dungarees. Fixed rather than palette-driven on purpose: the genre's whole
// colour signature is a warm top over a cool bottom, so the bottom cannot be
// allowed to follow a chapter palette that might hand it a warm colour. See
// grammar rule 2.
const DENIM = '#2f57ad'
const DENIM_LIT = '#4d78cf'
const DENIM_DEEP = '#1a3169' // rim on every denim piece, so it holds an edge against a blue shirt too
const STITCH = '#f2d489' // the yellow topstitch every pair of dungarees has
const BUTTON = '#f7c93f'
const BUTTON_SHADE = '#b8862a'

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

// Hero glove: the villains' flat white lobe grown a thumb, a banded cuff and
// two finger seams. `bodyDeg` points from the glove back towards the body, so
// the cuff lands on the wrist side and the seams sit on the far edge.
// The seams are short and near the rim on purpose — an earlier pass ran three
// long creases into the palm centre and the result read as a chevron arrow,
// exactly the kind of accidental glyph this app has been bitten by before.
function heroGlove(cx, cy, r, cuffColor, bodyDeg) {
  const a = (bodyDeg * Math.PI) / 180
  const away = a + Math.PI
  const at = (ang, d) => `${(cx + Math.cos(ang) * d).toFixed(1)},${(cy + Math.sin(ang) * d).toFixed(1)}`
  const thumbA = away - 1.5
  const tx = (cx + Math.cos(thumbA) * r * 0.9).toFixed(1)
  const ty = (cy + Math.sin(thumbA) * r * 0.9).toFixed(1)
  const seam = (k) => {
    const g = away + k * 0.42
    return `<path d="M ${at(g, r * 0.62)} L ${at(g, r * 0.94)}"
      stroke="${GLOVE_SHADE}" stroke-width="${(r * 0.13).toFixed(1)}" stroke-linecap="round"/>`
  }
  return `
    <g transform="translate(${at(a, r * 0.88).replace(',', ' ')}) rotate(${bodyDeg + 90})">
      <rect x="${-r * 0.82}" y="${-r * 0.5}" width="${r * 1.64}" height="${r}" rx="${r * 0.3}" fill="${cuffColor}"/>
      <rect x="${-r * 0.82}" y="${-r * 0.5}" width="${r * 1.64}" height="${r * 0.34}" rx="${r * 0.17}" fill="#fff" opacity="0.22"/>
    </g>
    <circle cx="${tx}" cy="${ty}" r="${(r * 0.54).toFixed(1)}" fill="${GLOVE_RIM}"/>
    <circle cx="${tx}" cy="${ty}" r="${(r * 0.42).toFixed(1)}" fill="${GLOVE}"/>
    <circle cx="${cx}" cy="${cy}" r="${(r + 2).toFixed(1)}" fill="${GLOVE_RIM}"/>
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${GLOVE}"/>
    <circle cx="${(cx - r * 0.26).toFixed(1)}" cy="${(cy - r * 0.32).toFixed(1)}" r="${(r * 0.48).toFixed(1)}" fill="#fff"/>
    ${seam(-1)}${seam(1)}`
}

// Hero boot: toe mass, a lit toe cap, a mid sole band and a dark sole slab,
// plus a cuff where the trouser leg ends. Drawn wider than the leg it hangs
// off, which is most of why these figures read as game characters.
function heroBoot(cx, cy, rx, ry) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${SHOE}"/>
    <ellipse cx="${(cx + rx * 0.18).toFixed(1)}" cy="${(cy - ry * 0.36).toFixed(1)}"
      rx="${(rx * 0.56).toFixed(1)}" ry="${(ry * 0.42).toFixed(1)}" fill="#fff" opacity="0.15"/>
    <ellipse cx="${cx}" cy="${(cy + ry * 0.42).toFixed(1)}" rx="${(rx * 0.99).toFixed(1)}"
      ry="${(ry * 0.5).toFixed(1)}" fill="${SOLE_MID}"/>
    <ellipse cx="${cx}" cy="${(cy + ry * 0.56).toFixed(1)}" rx="${(rx * 0.94).toFixed(1)}"
      ry="${(ry * 0.36).toFixed(1)}" fill="${SOLE}"/>`
}

// Cap: dome overhanging the head, panel seams, then a brim with a dark
// underside. The brim is drawn WIDER THAN THE SHOULDERS (1.38 * halfW) and
// thin: those two protruding lips are the only thing that separates head from
// torso once colour is stripped, since the genre's figures have no neck.
// `discColor` is the bright front patch — the genre's cap emblem — and is
// skipped on the boss, whose cap already carries a star.
function cap(cx, top, halfW, domeColor, brimColor, discColor) {
  const brimY = top + halfW * 1.02
  const seam = (k) => `<path d="M ${cx + k * halfW * 0.5},${brimY} C ${cx + k * halfW * 0.55},${top + halfW * 0.42}
    ${cx + k * halfW * 0.3},${top + halfW * 0.12} ${cx + k * halfW * 0.1},${top + halfW * 0.04}"
    fill="none" stroke="#000" stroke-width="1.6" opacity="0.16"/>`
  return `
    <path d="M ${cx - halfW},${brimY} C ${cx - halfW},${top} ${cx + halfW},${top} ${cx + halfW},${brimY} Z" fill="${domeColor}"/>
    <path d="M ${cx - halfW * 0.92},${brimY} C ${cx - halfW * 0.9},${top + halfW * 0.18}
      ${cx - halfW * 0.1},${top + halfW * 0.04} ${cx - halfW * 0.02},${top + halfW * 0.02}
      C ${cx - halfW * 0.55},${top + halfW * 0.3} ${cx - halfW * 0.66},${top + halfW * 0.66} ${cx - halfW * 0.62},${brimY} Z"
      fill="#fff" opacity="0.2"/>
    ${seam(-1)}${seam(1)}
    <ellipse cx="${cx}" cy="${brimY}" rx="${halfW * 1.38}" ry="${halfW * 0.24}" fill="${brimColor}"/>
    <ellipse cx="${cx}" cy="${brimY + halfW * 0.08}" rx="${halfW * 1.3}" ry="${halfW * 0.14}" fill="#000" opacity="0.24"/>
    <ellipse cx="${cx}" cy="${brimY - halfW * 0.09}" rx="${halfW * 1.22}" ry="${halfW * 0.09}" fill="#fff" opacity="0.18"/>
    ${
      discColor
        ? `<circle cx="${cx}" cy="${brimY - halfW * 0.5}" r="${halfW * 0.36}" fill="#000" opacity="0.2"/>
    <circle cx="${cx}" cy="${brimY - halfW * 0.53}" r="${halfW * 0.33}" fill="${discColor}"/>
    <path d="M ${cx - halfW * 0.24},${brimY - halfW * 0.68} A ${halfW * 0.3},${halfW * 0.3} 0 0 1 ${cx + halfW * 0.1},${brimY - halfW * 0.82}"
      fill="none" stroke="#fff" stroke-width="1.8" opacity="0.7"/>`
        : ''
    }`
}

// The face: a big round nose (the genre's loudest face tell), two ink eyes
// with a highlight, blushed cheeks and one mouth stroke. `s` scales every
// offset from one number so the boss can be drawn larger without re-tuning.
function face(cx, cy, s = 1) {
  const r = 4 * s
  const dx = 10.5 * s
  const nr = 6.4 * s
  const ny = cy + 8.6 * s
  const eye = (ex) => `
    <ellipse cx="${ex}" cy="${cy}" rx="${(r * 0.88).toFixed(1)}" ry="${r.toFixed(1)}" fill="${INK}"/>
    <circle cx="${(ex + r * 0.3).toFixed(1)}" cy="${(cy - r * 0.42).toFixed(1)}" r="${(r * 0.3).toFixed(1)}" fill="#fff" opacity="0.9"/>`
  return `
    <ellipse cx="${(cx - dx * 1.62).toFixed(1)}" cy="${(cy + 6 * s).toFixed(1)}" rx="${(6 * s).toFixed(1)}"
      ry="${(4 * s).toFixed(1)}" fill="${CHEEK}" opacity="0.45"/>
    <ellipse cx="${(cx + dx * 1.62).toFixed(1)}" cy="${(cy + 6 * s).toFixed(1)}" rx="${(6 * s).toFixed(1)}"
      ry="${(4 * s).toFixed(1)}" fill="${CHEEK}" opacity="0.45"/>
    ${eye(cx - dx)}${eye(cx + dx)}
    <circle cx="${cx}" cy="${ny.toFixed(1)}" r="${(nr + 1).toFixed(1)}" fill="${NOSE_SHADE}"/>
    <circle cx="${cx}" cy="${(ny - 0.7).toFixed(1)}" r="${nr.toFixed(1)}" fill="${NOSE}"/>
    <circle cx="${(cx - nr * 0.32).toFixed(1)}" cy="${(ny - nr * 0.42).toFixed(1)}" r="${(nr * 0.32).toFixed(1)}"
      fill="#fff" opacity="0.55"/>
    <path d="M ${cx - 6.5 * s},${ny + nr * 0.62} Q ${cx},${ny + nr * 1.32} ${cx + 6.5 * s},${ny + nr * 0.62}"
      fill="none" stroke="${INK}" stroke-width="${3 * s}" stroke-linecap="round"/>`
}

// The whole head assembly in draw order: ears behind, face mass, jaw shade,
// the brim's cast shadow on the forehead, the cap, then the features. Shared
// by all four heroes so the cast has one face; `s` scales the features for
// the boss's larger head.
function heroHead(cx, faceTop, faceW, faceH, capHalf, bodyColor, accent, discColor, s = 1) {
  const fx = cx - faceW / 2
  const earY = faceTop + faceH * 0.62
  const er = 4.8 * s
  const ear = (ex) => `
    <ellipse cx="${ex}" cy="${earY}" rx="${er}" ry="${er * 1.34}" fill="${SKIN}"/>
    <ellipse cx="${ex}" cy="${earY}" rx="${er * 0.46}" ry="${er * 0.7}" fill="${SKIN_SHADE}"/>`
  return `
    ${ear(fx + 1)}${ear(fx + faceW - 1)}
    <rect x="${fx}" y="${faceTop}" width="${faceW}" height="${faceH}" rx="${faceW * 0.4}" fill="${SKIN}"/>
    <ellipse cx="${cx}" cy="${faceTop + faceH - 1}" rx="${faceW * 0.36}" ry="${4 * s}" fill="${SKIN_SHADE}" opacity="0.5"/>
    <ellipse cx="${cx}" cy="${capHalf * 1.02 + 2.4}" rx="${faceW * 0.46}" ry="${5.4 * s}" fill="#000" opacity="0.14"/>
    ${cap(cx, 0, capHalf, bodyColor, accent, discColor)}
    ${face(cx, faceTop + faceH * 0.5 + s, s)}`
}

// The emblem is the phonics letter the child ties to the character, so the
// plate is sized past the point of good taste — it is the one element that
// still has to survive a 66 px box, where a 120x140 viewBox letterboxes to
// 57x66 and a unit is under half a pixel. Riveted at the corners so it reads
// as a patch sewn onto the shirt rather than a hole in it.
function emblemPlate(x, y, w, h, plateColor, textColor, label, size) {
  const r = Math.min(w, h) * 0.26
  return `
    <rect x="${x - 2}" y="${y - 2}" width="${w + 4}" height="${h + 4}" rx="${r + 2}" fill="#000" opacity="0.22"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${plateColor}"/>
    <rect x="${x + 2.5}" y="${y + 2.5}" width="${w - 5}" height="${h * 0.3}" rx="${r * 0.6}" fill="#fff" opacity="0.45"/>
    <circle cx="${x + 5}" cy="${y + 5}" r="1.7" fill="${textColor}" opacity="0.45"/>
    <circle cx="${x + w - 5}" cy="${y + 5}" r="1.7" fill="${textColor}" opacity="0.45"/>
    <circle cx="${x + 5}" cy="${y + h - 5}" r="1.7" fill="${textColor}" opacity="0.45"/>
    <circle cx="${x + w - 5}" cy="${y + h - 5}" r="1.7" fill="${textColor}" opacity="0.45"/>
    <text x="${x + w / 2}" y="${y + h / 2 + size * 0.36}" text-anchor="middle"
      font-family="${FONT}" font-size="${size}" font-weight="800" fill="${textColor}">${label}</text>`
}

// The bib-and-hips denim mass: dark rim, body, a lit plane down the left, a
// dashed topstitch border and a patch pocket. Always drawn WIDER than the
// shirt above it — see grammar rule 3, the outline step is what carries
// "wearing dungarees" into a flat silhouette.
function bibPanel(x, y, w, h, r = 10) {
  return `
    <rect x="${x - 2.5}" y="${y - 2.5}" width="${w + 5}" height="${h + 5}" rx="${r + 2.5}" fill="${DENIM_DEEP}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${DENIM}"/>
    <rect x="${x}" y="${y}" width="${w * 0.4}" height="${h}" rx="${r}" fill="${DENIM_LIT}" opacity="0.5"/>
    <rect x="${x + 3.5}" y="${y + 3.5}" width="${w - 7}" height="${h - 7}" rx="${r * 0.8}" fill="none"
      stroke="${STITCH}" stroke-width="1.5" stroke-dasharray="4.5,3.5" opacity="0.85"/>
    ${pocket(x + 4, y + h * 0.5, h)}
    ${pocket(x + w - 18, y + h * 0.5, h)}`
}

// Patch pocket, placed at the bib's two lower corners rather than its middle,
// where the emblem plate always sits.
function pocket(px, py, h) {
  return `
    <rect x="${px}" y="${py}" width="14" height="${h * 0.34}" rx="2.5" fill="${DENIM_DEEP}" opacity="0.5"/>
    <path d="M ${px},${py + 2.5} L ${px + 14},${py + 2.5}" stroke="${STITCH}" stroke-width="1.4" opacity="0.65"/>`
}

// One shoulder strap, authored for the left side and mirrored for the right.
// It deliberately runs past the shoulder line: the two strap tops are knobs
// on the silhouette, which is how the dungarees survive a colour-stripped
// read. Rimmed and topstitched like the bib it hangs from.
function strapPiece(outer, inner, stitch) {
  return `
    <polygon points="${outer}" fill="${DENIM_DEEP}"/>
    <polygon points="${inner}" fill="${DENIM}"/>
    <path d="${stitch}" fill="none" stroke="${STITCH}" stroke-width="1.5" stroke-dasharray="4.5,3.5" opacity="0.8"/>`
}

// A dungaree button, centred ON the bib's outer edge so half of it sticks out
// of the body outline (grammar rule 3). Big enough to read as a button and not
// a rivet: r=7..8.5 against the robots' 1.8-unit wheel centres.
function bigButton(cx, cy, r = 7.5) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${DENIM_DEEP}"/>
    <circle cx="${cx}" cy="${cy}" r="${r - 1.5}" fill="${BUTTON_SHADE}"/>
    <circle cx="${cx}" cy="${(cy - 0.8).toFixed(1)}" r="${r - 2.6}" fill="${BUTTON}"/>
    <circle cx="${(cx - r * 0.28).toFixed(1)}" cy="${(cy - r * 0.34).toFixed(1)}" r="${(r * 0.26).toFixed(1)}" fill="#fff" opacity="0.6"/>
    <circle cx="${cx}" cy="${cy}" r="${(r * 0.22).toFixed(1)}" fill="${BUTTON_SHADE}"/>`
}

// A denim trouser leg. Rimmed, with a lit plane and a turn-up cuff at the
// boot, so the legs never read as bare skin (the genre's dungarees run all
// the way down to the boot).
function denimLeg(x, y, w, h, r = 5) {
  return `
    <rect x="${x - 2}" y="${y}" width="${w + 4}" height="${h + 2}" rx="${r + 2}" fill="${DENIM_DEEP}"/>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${DENIM}"/>
    <rect x="${x}" y="${y}" width="${w * 0.42}" height="${h}" rx="${r}" fill="${DENIM_LIT}" opacity="0.5"/>
    <rect x="${x - 2}" y="${y + h - 5}" width="${w + 4}" height="5" rx="2" fill="${DENIM_DEEP}"/>`
}

// A denim limb drawn as a sloped quad (tucked/kicking legs). Same rim + lit
// plane layering as denimLeg, in polygon form.
function denimQuad(outer, inner, lit) {
  return `
    <polygon points="${outer}" fill="${DENIM_DEEP}"/>
    <polygon points="${inner}" fill="${DENIM}"/>
    <polygon points="${lit}" fill="${DENIM_LIT}" opacity="0.5"/>`
}

// A shirt sleeve: bodyColor quad plus a lit plane along its top edge. Short
// and thick — the sleeves and the chest above the bib are the only places the
// warm half of the two-tone shows, so they must not be nubs.
function sleeve(outer, lit, bodyColor) {
  return `
    <polygon points="${outer}" fill="${bodyColor}"/>
    <polygon points="${lit}" fill="#fff" opacity="0.18"/>`
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
  const strapL = strapPiece('32,34 45,38 40,88 26,88', '34,38 42,42 38,85 29,85', 'M 38,44 L 33,82')
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="12" ry="3" fill="#000" opacity="0.12"/>
      <path d="M 14,124 L 20,112 M 25,130 L 29,120 M 106,124 L 100,112 M 95,130 L 91,120"
        stroke="${bodyColor}" stroke-width="3.2" stroke-linecap="round" opacity="0.32"/>

      ${sleeve('73,48 85,42 97,24 85,17', '74,49 83,45 94,26 88,22', bodyColor)}
      ${heroGlove(93, 15, 11.5, accent, 125)}

      ${sleeve('36,46 36,66 24,70 19,50', '37,47 37,56 25,60 22,51', bodyColor)}
      ${heroGlove(15, 57, 11.5, accent, -12)}

      ${denimQuad('42,100 60,100 48,120 32,116', '44,102 57,102 47,117 35,113', '45,103 51,103 46,113 39,111')}
      ${heroBoot(28, 122, 15, 9)}

      ${denimQuad('60,100 78,100 88,116 72,120', '63,102 76,102 85,113 73,117', '64,103 70,103 78,111 72,114')}
      ${heroBoot(92, 122, 15, 9)}

      <rect x="35" y="44" width="50" height="36" rx="13" fill="${bodyColor}"/>
      <rect x="70" y="45" width="15" height="34" rx="10" fill="#000" opacity="0.13"/>
      <ellipse cx="60" cy="45" rx="13" ry="4.5" fill="#fff" opacity="0.2"/>

      ${bibPanel(27, 78, 66, 30, 11)}

      ${strapL}
      ${mirrored(strapL)}
      ${bigButton(26, 86, 8)}
      ${mirrored(bigButton(26, 86, 8))}

      ${emblemPlate(44, 79, 32, 28, visorColor, accent, emblem, 24)}

      ${heroHead(60, 8, 36, 38, 21, bodyColor, accent, visorColor)}
    </g>
  `
  )
}

// The spring: the shirt is replaced by a stack of coil turns, so this one is
// the tallest and narrowest of the four. The turns are fat and few — thin
// coils turn to mush at small sizes — and each carries its own lit crescent
// so the stack reads as a helix rather than a pile of rings. The straps are
// drawn BEFORE the coil on purpose: over the top they would flatten the
// helix's waving outline, so only their shoulder knobs show.
export function platSpring({
  bodyColor = '#2f9e5c',
  accent = '#16522f',
  emblem = 'M',
  visorColor = '#fff3c4',
} = {}) {
  const turn = (cy, rx, cx) => `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="10" fill="${accent}"/>
    <ellipse cx="${cx}" cy="${cy - 1}" rx="${rx - 1.8}" ry="8.4" fill="${bodyColor}"/>
    <ellipse cx="${cx - rx * 0.32}" cy="${cy - 3.6}" rx="${rx * 0.48}" ry="3" fill="#fff" opacity="0.24"/>`
  const seam = (cy, rx) => `
    <ellipse cx="60" cy="${cy}" rx="${rx}" ry="3.4" fill="${accent}"/>
    <ellipse cx="60" cy="${cy - 0.8}" rx="${rx - 3}" ry="1.7" fill="#000" opacity="0.22"/>`
  const strapL = strapPiece('32,34 45,38 40,88 26,88', '34,38 42,42 38,85 29,85', 'M 38,44 L 33,82')

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="134" rx="26" ry="4" fill="#000" opacity="0.13"/>

      ${strapL}
      ${mirrored(strapL)}

      ${sleeve('42,48 42,64 30,68 26,50', '43,49 43,57 31,61 28,51', bodyColor)}
      ${heroGlove(18, 58, 11, accent, -15)}
      ${sleeve('78,52 78,68 90,72 94,54', '77,53 77,61 89,65 92,55', bodyColor)}
      ${heroGlove(102, 62, 11, accent, -165)}

      ${denimLeg(44, 110, 14, 16, 4)}
      ${denimLeg(62, 110, 14, 16, 4)}
      ${heroBoot(42, 128, 15, 9)}
      ${heroBoot(78, 128, 15, 9)}

      <rect x="53" y="42" width="14" height="10" rx="3" fill="${accent}"/>
      ${turn(50, 18, 57)}
      ${turn(62, 21, 63)}
      ${turn(74, 18, 57)}
      ${seam(56, 19)}
      ${seam(68, 20)}

      ${bibPanel(31, 78, 58, 34, 10)}
      ${bigButton(30, 86, 8)}
      ${mirrored(bigButton(30, 86, 8))}

      <circle cx="60" cy="95" r="18.5" fill="#000" opacity="0.22"/>
      <circle cx="60" cy="95" r="17" fill="${accent}"/>
      <circle cx="60" cy="95" r="15" fill="${visorColor}"/>
      <path d="M 48,87 A 15,15 0 0 1 68,82" fill="none" stroke="#fff" stroke-width="2.4" opacity="0.55"/>
      <text x="60" y="104" text-anchor="middle" font-family="${FONT}" font-size="26"
        font-weight="800" fill="${accent}">${emblem}</text>

      ${heroHead(60, 8, 36, 38, 21, bodyColor, accent, visorColor)}
    </g>
  `
  )
}

// The block: the squarest silhouette in the family and the widest. The shirt
// is a crate — a framed box with plank courses down each side of the emblem —
// and the dungarees hang below it, so the boxy chest and the denim hips read
// as two stacked masses. Limbs stay stubby and boots wide: a boxy body on
// long legs read as a chimney. Straps go behind the crate for the same reason
// the spring's do: over the top they would break up the box.
export function platBlock({
  bodyColor = '#e08a1e',
  accent = '#7a3d0c',
  emblem = 'D',
  visorColor = '#fff3c4',
} = {}) {
  const course = (y) => `
    <rect x="37" y="${y}" width="46" height="3.2" fill="${accent}" opacity="0.8"/>
    <rect x="37" y="${y + 3.2}" width="46" height="1.4" fill="#fff" opacity="0.22"/>`
  const bracket = (x, y) => `<rect x="${x}" y="${y}" width="9" height="9" rx="2" fill="#000" opacity="0.2"/>`
  const strapL = strapPiece('32,34 45,38 40,88 26,88', '34,38 42,42 38,85 29,85', 'M 38,44 L 33,82')

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="134" rx="44" ry="4.5" fill="#000" opacity="0.13"/>

      ${strapL}
      ${mirrored(strapL)}

      ${sleeve('32,48 32,66 21,70 16,52', '33,49 33,58 22,62 19,53', bodyColor)}
      ${heroGlove(15, 58, 12, accent, -12)}
      ${mirrored(sleeve('32,48 32,66 21,70 16,52', '33,49 33,58 22,62 19,53', bodyColor))}
      ${mirrored(heroGlove(15, 58, 12, accent, -12))}

      ${denimLeg(35, 110, 19, 16, 5)}
      ${denimLeg(66, 110, 19, 16, 5)}
      ${heroBoot(39, 130, 17, 9.5)}
      ${heroBoot(81, 130, 17, 9.5)}

      <rect x="31" y="44" width="58" height="38" rx="8" fill="${accent}"/>
      <rect x="37" y="50" width="46" height="26" rx="5" fill="${bodyColor}"/>
      <rect x="37" y="50" width="46" height="8" rx="5" fill="#fff" opacity="0.18"/>
      ${course(59)}
      ${course(68)}
      <rect x="58" y="50" width="3.4" height="9" fill="${accent}" opacity="0.8"/>
      <rect x="46" y="62" width="3.4" height="6" fill="${accent}" opacity="0.8"/>
      <rect x="71" y="62" width="3.4" height="6" fill="${accent}" opacity="0.8"/>
      ${bracket(32, 45)}
      ${bracket(79, 45)}
      ${bracket(32, 72)}
      ${bracket(79, 72)}

      ${bibPanel(26, 78, 68, 34, 10)}
      ${bigButton(25, 86, 8)}
      ${mirrored(bigButton(25, 86, 8))}

      ${emblemPlate(44, 80, 32, 28, visorColor, accent, emblem, 24)}

      ${heroHead(60, 8, 36, 38, 21, bodyColor, accent, visorColor)}
    </g>
  `
  )
}

// The power-up form, chapter boss: deliberately the heaviest figure in the
// family, and the only one whose cap is winged. It carries one visible trace
// of each earlier hero — the jumper's gloves grown to their largest, the
// spring's coil turns as a waistband on the dungarees, the block's plank
// slabs as shoulder pads — the same "trace, never louder than the combined
// form" rule the other families' bosses follow. The glow is overlapping flat
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
    <polygon points="39,22 2,0 7,12 0,11 9,20 2,22 13,28 39,29" fill="${accent}"/>
    <polygon points="39,23 10,7 12,15 22,21 39,27" fill="${panelColor}"/>
    <polygon points="38,24 16,12 18,18 26,23 38,26" fill="${accent}" opacity="0.5"/>`
  // Traces of the three earlier heroes, all on parts the boss's own silhouette
  // already needs: the block's plank courses become the bib's side panels, the
  // spring's coil turns become rings above each boot, and the jumper's gloves
  // are simply the largest in the family. Shoulder pads had to go — they
  // occupied exactly the band of canvas the raised arms and the protruding
  // buttons need, and the buttons are load-bearing for the silhouette test.
  const plankPanel = (x) => `
    <rect x="${x}" y="80" width="16" height="26" rx="3" fill="${accent}" opacity="0.85"/>
    <rect x="${x}" y="80" width="16" height="3" fill="#fff" opacity="0.3"/>
    <rect x="${x}" y="88" width="16" height="2.6" fill="${DENIM_DEEP}" opacity="0.6"/>
    <rect x="${x}" y="97" width="16" height="2.6" fill="${DENIM_DEEP}" opacity="0.6"/>`
  const coilRing = (cx, cy) => `
    <ellipse cx="${cx}" cy="${cy}" rx="13" ry="3.6" fill="${accent}"/>
    <ellipse cx="${cx}" cy="${cy - 0.9}" rx="10" ry="1.8" fill="#000" opacity="0.22"/>`
  const strapL = strapPiece('30,32 45,37 40,86 24,86', '32,36 42,41 38,83 27,83', 'M 36,42 L 32,80')

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="134" rx="50" ry="5" fill="#000" opacity="0.15"/>

      ${sparkle(13, 118, 6)}
      ${sparkle(101, 118, 6)}
      ${sparkle(10, 74, 4.4)}
      ${sparkle(108, 78, 4.4)}

      <circle cx="60" cy="76" r="40" fill="${visorColor}" opacity="0.28"/>
      <circle cx="60" cy="66" r="30" fill="${visorColor}" opacity="0.28"/>

      ${strapL}
      ${mirrored(strapL)}

      ${denimLeg(38, 104, 20, 18, 5)}
      ${denimLeg(64, 104, 20, 18, 5)}
      ${coilRing(48, 110)}
      ${coilRing(72, 110)}
      ${coilRing(48, 117)}
      ${coilRing(72, 117)}
      ${heroBoot(36, 128, 20, 11)}
      ${heroBoot(84, 128, 20, 11)}

      <rect x="32" y="46" width="56" height="34" rx="14" fill="${bodyColor}"/>
      <rect x="72" y="47" width="15" height="32" rx="10" fill="#000" opacity="0.14"/>
      <ellipse cx="60" cy="47" rx="15" ry="4.5" fill="#fff" opacity="0.2"/>

      ${bibPanel(22, 76, 76, 38, 12)}
      ${plankPanel(24)}
      ${plankPanel(80)}
      ${bigButton(21, 84, 8.5)}
      ${mirrored(bigButton(21, 84, 8.5))}

      ${sleeve('33,46 33,64 22,68 17,48', '34,47 34,56 23,60 20,49', bodyColor)}
      ${heroGlove(16, 54, 13, bodyColor, -12)}
      ${mirrored(sleeve('33,46 33,64 22,68 17,48', '34,47 34,56 23,60 20,49', bodyColor))}
      ${mirrored(heroGlove(16, 54, 13, bodyColor, -12))}

      ${emblemPlate(41, 78, 38, 34, panelColor, bodyColor, '★', 28)}

      ${wing}
      ${mirrored(wing)}
      ${heroHead(60, 6, 40, 42, 24, bodyColor, bodyColor, null, 1.1)}
      ${star(60, 12, 8.5, accent)}
      ${star(60, 12, 4, panelColor)}
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
