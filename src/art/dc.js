// DC-family character art (chapter 7 onward): the night-city vigilante cast.
// This family shares a genre with the chapter-2 superhero cast in src/art.js,
// so it is drawn to be the *opposite* of that file in every measurable way.
// If a figure here could be dropped into chapter 2 unnoticed, it is wrong.
//
// DESIGN GRAMMAR (every figure obeys all of it)
//
//  1. LEAN ADULT PROPORTIONS. Head radius 12–15 on a 120x140 box, torso
//     44–56 wide, legs running from y≈94 to y≈136. That is roughly 4.9 head
//     heights, against the chapter-2 chibi cast's 3.1. Small head + long legs
//     is the single strongest tell between the two superhero families and it
//     survives the hard cut-out test.
//  2. LIMBS ARE ROUND-CAPPED STROKES, not stacked rounded rects. Elbows,
//     wrists and knees exist because the caps put them there. Chapter 2 draws
//     arms as `rect ... rx`, so this reads as a different hand at a glance.
//  3. THE CAPE IS THE BIGGEST SHAPE. Heroes get a SCALLOPED hem (round
//     arcs); villains that have a cape get a JAGGED hem (sharp teeth). The
//     chapter-2 capes are narrow straight-sided triangles.
//  4. COWL, NOT FACE. Heroes are fully masked: one dark skull shape with two
//     pale angular lenses and no mouth. Chapter 2 shows a round face under a
//     domino mask.
//  5. LIGHT IS A HARD-EDGED FLAT WEDGE. Every beam is three nested polygons
//     at fixed opacity plus a dark rim line. No gradients, no filters (project
//     rule), and no soft glow circles either -- this family's light has an
//     edge you could cut on, and on the app's pale cards the rim is the only
//     reason the light is visible at all (measured: gold on cream is 1.35:1).
//  6. HERO / VILLAIN SPLIT ON FOUR AXES, never on brightness alone (that
//     mistake was rejected once already in the chapter-4 family):
//       a. HUE NEIGHBOURHOOD -- heroes live in the 200-235 degree azure/teal/
//          indigo band; villains live outside it (plum, magenta, acid olive,
//          rust). No hero uses a villain hue and no villain uses azure.
//       b. THE GOLD IS THE HEROES'. Warm gold trim appears on heroes only.
//          Villain emission is violet, mint, acid green, cyan-white or red.
//       c. CHEST TONE -- every hero carries a large cream emblem plate high
//          on the torso. No villain has any cream on its torso at all; a
//          villain's brights are lamps, eyes and beams, never a chest plate.
//       d. STANCE -- heroes are upright/symmetric or flying forward; villains
//          are tilted, asymmetric and silhouette-jagged.
//  7. EYES ALWAYS SIT ON A PLATE THAT IS LIGHTER THAN THE BODY. The chapter-4
//     round measured ink-dot eyes on a dark body at 2.0:1; the fix was to put
//     them on a bright plate. The darkest figures here (Blackout, Nightfall)
//     get the brightest eye plates in the file for exactly that reason.
//  8. THE EMBLEM PLATE IS CURRICULUM CONTENT, not decoration. Chapter 7
//     teaches AI / J / OA, so two of the four labels are two characters wide;
//     the plate is a wide BORDERED rounded nameplate (not the other families'
//     ellipse), sized to the chest rather than worn as a badge, and the font
//     size steps down by label length so both fit one plate geometry. The
//     border colour differs per hero. See `emblemPlate` for the A/B that
//     settled the size and for the two limits it must not cross.
//
// This file must not import ../art.js (circular); it carries its own svgWrap.

function svgWrap(inner, viewBox = '0 0 120 140') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

const CREAM = '#f7f3e6' // emblem plate and hero mask lenses
const PLATE_INK = '#0f1830' // emblem letter colour, measured against CREAM
const GOLD = '#ffcf4a' // hero-only warm emission and trim
const BEAM_RIM = '#c07a10' // deep amber: the only tone that edges gold light
                           // without reading as a dark pole (see `beam`)
const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Mirrors arbitrary drawing content about the centre line. Done with a
// transform rather than by rewriting point lists: `polygon points` are
// absolute coordinates here, and hand-flipping them is where the x-goes-
// negative mistakes come from.
function mirrored(inner) {
  return `<g transform="translate(120,0) scale(-1,1)">${inner}</g>`
}

// A hem of `n` round arcs bulging by `depth`, used for hero cape bottoms.
// Returned as path commands that continue from (x1,y1) to (x2,y2).
function scallop(x1, y1, x2, y2, n, depth) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const ax = x1 + ((x2 - x1) * i) / n
    const ay = y1 + ((y2 - y1) * i) / n
    const bx = x1 + ((x2 - x1) * (i + 1)) / n
    const by = y1 + ((y2 - y1) * (i + 1)) / n
    d += ` Q ${((ax + bx) / 2).toFixed(1)},${((ay + by) / 2 + depth).toFixed(1)} ${bx.toFixed(1)},${by.toFixed(1)}`
  }
  return d
}

// The villain counterpart of `scallop`: the same hem as sharp teeth. Heroes
// round, villains point -- readable in a pure cut-out with the colour gone.
function jagged(x1, y1, x2, y2, n, depth) {
  let d = ''
  for (let i = 0; i < n; i++) {
    const ax = x1 + ((x2 - x1) * i) / n
    const ay = y1 + ((y2 - y1) * i) / n
    const bx = x1 + ((x2 - x1) * (i + 1)) / n
    const by = y1 + ((y2 - y1) * (i + 1)) / n
    d += ` L ${((ax + bx) / 2).toFixed(1)},${((ay + by) / 2 + depth).toFixed(1)} L ${bx.toFixed(1)},${by.toFixed(1)}`
  }
  return d
}

// Hard-edged flat light: three nested wedges of increasing opacity instead of
// a gradient (banned inside SVG here), edged with a thin `rimColor` line.
// Both parts were forced by measurement, in two rounds:
//  - The app renders these on near-white cards and gold on cream is about
//    1.35:1. A fully opaque gold core was still invisible at 250 px, so the
//    light needs a boundary darker than itself to exist at all.
//  - But the rim must be a MID-TONE, warm relative to the beam, and thin. The
//    first attempt used the figure's ink accent at 1.8 wide and the result read
//    as a dark pole or a fishing rod held in the hand, not as light. A 1-wide
//    deep-amber edge around an opaque gold core reads as a beam.
// NOTE for callers: the rim is a stroke, so a far-edge endpoint placed exactly
// on the viewBox boundary clips by half its width. Keep endpoints a unit
// inside the frame.
function beam(ax, ay, x1, y1, x2, y2, color, rimColor) {
  const at = (t) => [x1 + (x2 - x1) * t, y1 + (y2 - y1) * t]
  const wedge = (t0, t1, o) => {
    const [px, py] = at(t0)
    const [qx, qy] = at(t1)
    return `<polygon points="${ax},${ay} ${px.toFixed(1)},${py.toFixed(1)} ${qx.toFixed(1)},${qy.toFixed(1)}" fill="${color}" opacity="${o}"/>`
  }
  const rim = rimColor
    ? `<path d="M ${x1},${y1} L ${ax},${ay} L ${x2},${y2}" stroke="${rimColor}" stroke-width="1" fill="none" stroke-linejoin="round"/>`
    : ''
  // Third round on these numbers. 0.3 for the outer wedge was measured wrong:
  // gold at 0.3 over the app's cream card is under 1.1:1, so only the opaque
  // core was ever visible and the beam read as a pole again -- the exact
  // failure the rim was added to cure. 0.48 is the lowest step where the outer
  // wedge is visible on cream, and the width of the visible wedge is what
  // makes it light rather than a stick.
  return wedge(0, 1, 0.48) + wedge(0.26, 0.74, 0.76) + wedge(0.4, 0.6, 1) + rim
}

// A flat dark wash over an already-drawn shape. This family builds volume by
// stacking opaque faces; this is the one place transparency stands in for a
// second palette colour, so that `accent` stays free for trim.
function shade(d, o = 0.22) {
  return `<path d="${d}" fill="#000" opacity="${o}"/>`
}

// Tilted parallelogram: the eye shape shared by heroes (pale lenses) and
// villains (glowing slits), so the whole cast reads as one world.
function slit(cx, cy, w, h, tilt, color) {
  const l = cx - w / 2
  const r = cx + w / 2
  return `<polygon points="${l.toFixed(1)},${(cy - h / 2 + tilt).toFixed(1)} ${r.toFixed(1)},${(cy - h / 2 - tilt).toFixed(1)} ${r.toFixed(1)},${(cy + h / 2 - tilt).toFixed(1)} ${l.toFixed(1)},${(cy + h / 2 + tilt).toFixed(1)}" fill="${color}"/>`
}

// Hero mask: two pale angular lenses, outer ends lifted. No pupils and no
// mouth -- a cowl reads as a cowl because the face is unreadable.
function lenses(cx, cy, color = CREAM, scale = 1) {
  const w = 9 * scale
  const h = 5.6 * scale
  const off = 6.2 * scale
  return slit(cx - off, cy, w, h, 1.5 * scale, color) + slit(cx + off, cy, w, h, -1.5 * scale, color)
}

// Villain eyes. Three layers, because a villain has to glow AND be legible
// and those pull against each other: a bright plate (must out-light the body
// it sits on), a near-ink slit on it (the slit SHAPE is what carries
// legibility -- the chapter-4 family measured ink eyes straight on a dark body
// at 2.0:1 and only reached 10.7:1 by lifting them onto a plate), and a small
// saturated core inside the slit that supplies the glow. The core is small
// enough that its own contrast is not load bearing.
function eyePlate(cx, cy, w, h, plateColor, slitColor, coreColor, tilt = 1.6) {
  const l = cx - w / 2
  const r = cx + w / 2
  const off = w * 0.24
  const sw = w * 0.3
  const sh = h * 0.42
  const core = coreColor
    ? slit(cx - off, cy, sw * 0.5, sh * 0.5, tilt, coreColor) +
      slit(cx + off, cy, sw * 0.5, sh * 0.5, -tilt, coreColor)
    : ''
  return `
    <polygon points="${l},${cy - h / 2} ${r},${cy - h / 2 - 1} ${r},${cy + h / 2 - 1} ${l},${cy + h / 2}" fill="${plateColor}"/>
    ${slit(cx - off, cy, sw, sh, tilt, slitColor)}
    ${slit(cx + off, cy, sw, sh, -tilt, slitColor)}
    ${core}`
}

// Emblem nameplate. Wide and rectangular rather than the other families'
// ellipse because chapter 7 teaches the digraphs AI and OA: half of this
// cast's labels are two glyphs wide and must survive the same 96 px render
// as the single-glyph 'J'. `size` therefore steps down by label length, so
// both fit one plate geometry.
//
// It is a BORDERED plate sized to the chest, not a small badge. An A/B render
// of the two settled it: the plate the body can carry gives a 21-22 unit
// letter (about 20 px at a 132 px render, 15 px at 96 px), against 18-19 for a
// badge -- worth having when the letter is the curriculum.
// Two hard limits came out of that A/B and both are respected here:
//  - The plate must stay INSIDE the torso outline. An oversized plate poked
//    1.6 units past the body edge, which changes the hard cut-out silhouette;
//    an internal detail must never do that. The upright heroes' chests were
//    widened to 50-56 units to earn the bigger plate honestly instead.
//  - The border colour VARIES per character. Four heroes wearing one identical
//    cream slab, on bodies that are all dark, puts the only bright shape in
//    the figure in the same place with the same outline every time; the frame
//    colour is what keeps them apart. The plate shape stays constant because
//    it is the same teaching device on every hero.
// The plate is a rounded rectangle throughout: this family risks its art
// being misread as a letter, and a rounded rect is not one. Villains get no
// plate at all, which is one of the four hero/villain axes.
//
// GEOMETRY LIVES IN ONE PLACE. `EMBLEM_BOX` below holds every hero's anchor
// and `emblemPlate` is the only function that turns an anchor into shapes, so
// the still-open question of WHERE the letter goes (chest badge / chest
// nameplate / a disc held in the hand) is a change to two things, not to nine
// figures. Each hero body draws its own chest so that any of the three fits.
//
// The proportions here were re-measured, not inherited. The first version used
// h = 0.63w with the glyph at 0.79h, which spends most of the plate on padding:
// Ray's plate was 41x25.8 units to carry a 14.7-unit letter, i.e. it ate the
// whole torso for a letter a much smaller plate could hold. h = 0.60w with the
// glyph at 0.94h (two glyphs) / 1.06h (one) keeps the letter the same height
// on a plate 26% smaller in area. Measured glyph heights at the app's four
// real render sizes are in `_dc-scan.html` section 3.
function emblemPlate(
  box,
  label,
  borderColor = GOLD,
  plateColor = CREAM,
  textColor = PLATE_INK,
  border = 2.2
) {
  const { cx, cy, w } = box
  const text = String(label)
  const h = w * 0.6
  // Non-letter labels get their own step. Measured inked heights: a capital
  // letter fills about 0.72 of its font size, but the boss star fills 0.93, so
  // one rule for both left the star with 0.5 units of margin inside the plate
  // on three of the four heroes -- a plate crammed edge to edge stops reading
  // as a plate. Letters keep the larger step because the letter is the
  // curriculum and the star is not.
  const lettery = /^[A-Za-z0-9]+$/.test(text)
  const size = text.length > 1 ? h * 0.94 : lettery ? h * 1.06 : h * 0.82
  const rx = w * 0.11
  return `
    <rect x="${(cx - w / 2 - border).toFixed(1)}" y="${(cy - h / 2 - border).toFixed(1)}"
      width="${(w + border * 2).toFixed(1)}" height="${(h + border * 2).toFixed(1)}"
      rx="${(rx + border).toFixed(1)}" fill="${borderColor}"/>
    <rect x="${(cx - w / 2).toFixed(1)}" y="${(cy - h / 2).toFixed(1)}" width="${w}" height="${h.toFixed(1)}" rx="${rx.toFixed(1)}" fill="${plateColor}"/>
    <text x="${cx}" y="${(cy + size * 0.355).toFixed(1)}" text-anchor="middle" font-family="${FONT}"
      font-size="${size.toFixed(1)}" font-weight="800" fill="${textColor}">${text}</text>`
}

// Where each hero carries the letter. Chapter 7's labels are AI / J / OA, so
// `w` is sized for the two-glyph case and the one-glyph case just gets a
// taller letter on the same plate; every hero is verified against all of
// AI / OA / J / * in `_dc-scan.html` section 2.
// Jett's box is the small one because its plate sits on a foreshortened chest
// facet rather than a square-on torso.
const EMBLEM_BOX = {
  ray: { cx: 60, cy: 64, w: 36 },
  jett: { cx: 66, cy: 59, w: 35 },
  cloak: { cx: 60, cy: 64, w: 38 },
  nightray: { cx: 60, cy: 63, w: 43 },
}

// ---------------------------------------------------------------------------
// HEROES. Azure/teal/indigo bodies, gold trim, cream chest slab, scalloped
// cape, cowl with pale lenses. Three distinct silhouettes plus the boss:
// Ray = raised lantern arm; Jett = the only diagonal flying figure; Cloak =
// eared cowl over the widest cape; Nightray = all three, oversized.
// ---------------------------------------------------------------------------

// Ray. The light-bringer: a lantern held overhead throws a hard wedge into
// the top-right corner, and the raised arm is the whole read at small sizes,
// so the other arm stays down at the hip.
// The cape is a WING SWEPT UP AND TO ONE SIDE, and its hem stays above the
// knees. Two earlier versions failed the hard cut-out for the same reason:
// a hem that reaches down past y=100 fills the gap between the legs and the
// figure reads "in a dress" no matter which way it is swept. Ending the hem at
// y<=96 and x<=32 leaves both legs and the body edge free, which is what makes
// it read as a cape at all. Do not lengthen it without re-running the cut-out.
export function dcRay({
  bodyColor = '#2f5fb3',
  accent = '#16233f',
  capeColor = '#122a55',
  liningColor = '#3b74d1',
  emblem = 'AI',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="58" cy="134" rx="28" ry="5" fill="#000" opacity="0.12"/>

      ${beam(99, 22, 46, 1, 119, 60, GOLD, BEAM_RIM)}

      <path d="M 74,44 L 2,62 ${scallop(2, 62, 26, 88, 3, 8)} L 58,52 Z" fill="${capeColor}"/>
      <path d="M 70,48 L 18,60 ${scallop(18, 60, 30, 80, 2, 6)} L 58,54 Z" fill="${liningColor}"/>
      ${shade(`M 70,48 L 18,60 ${scallop(18, 60, 30, 80, 2, 6)} L 58,54 Z`, 0.3)}

      <path d="M 45,95 L 43,120 L 44,130" stroke="${bodyColor}" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 74,95 L 76,120 L 76,130" stroke="${bodyColor}" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="34,124 51,124 51,136 32,136" fill="${accent}"/>
      <polygon points="86,124 69,124 69,136 88,136" fill="${accent}"/>
      <rect x="34" y="124" width="17" height="3.4" fill="${GOLD}"/>
      <rect x="69" y="124" width="17" height="3.4" fill="${GOLD}"/>

      <rect x="53" y="36" width="14" height="13" fill="${accent}"/>
      <polygon points="35,47 85,47 83,80 78,98 42,98 37,80" fill="${bodyColor}"/>
      <polygon points="35,47 49,47 45,86 38,78" fill="${accent}"/>
      <polygon points="85,47 71,47 75,86 82,78" fill="${accent}"/>

      <path d="M 38,55 L 30,77 L 32,91" stroke="${bodyColor}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="32" cy="94" r="6.2" fill="${accent}"/>
      <circle cx="32" cy="94" r="2.6" fill="${GOLD}"/>

      <path d="M 82,55 L 95,40 L 99,25" stroke="${bodyColor}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="99" cy="24" r="6.2" fill="${accent}"/>
      <polygon points="93,22 105,22 108,11 90,11" fill="${GOLD}"/>
      <polygon points="90,11 108,11 105,5 93,5" fill="${accent}"/>
      <polygon points="95,20 103,20 104,13 94,13" fill="${CREAM}"/>

      <rect x="40" y="89" width="40" height="8" fill="${accent}"/>
      <rect x="53" y="88" width="14" height="10" fill="${GOLD}"/>
      ${emblemPlate(EMBLEM_BOX.ray, emblem, GOLD)}

      <circle cx="60" cy="27" r="12.5" fill="${accent}"/>
      <path d="M 47.5,27 A 12.5,12.5 0 0 1 72.5,27 Z" fill="${bodyColor}"/>
      <rect x="47.6" y="25.4" width="24.8" height="3.2" fill="${GOLD}"/>
      ${lenses(60, 32.5)}
      <polygon points="56,16 64,16 60,3" fill="${GOLD}"/>
      <polygon points="58,16 62,16 60,6" fill="${accent}"/>
    </g>
  `
  )
}

// Jett. The only diagonal figure in the app: cowl high-right, fist thrown
// forward past the frame's shoulder, legs trailing low-left.
// Drawn by hand rather than rotated because a rotate about the body centre
// pushes the fist and the cape hem straight out of the viewBox.
//
// THE CAPE BILLOWS UP AND BACK, NOT DOWN AND BACK. Two passes drew the cape
// trailing down-left, which is where a cape physically goes -- and both times
// it landed on top of the trailing legs and the hard cut-out came back as one
// featureless diagonal streak. The fragmentation index (rows whose filled runs
// are split by >=6 units) measured 9.3 on that version, against 61 for a
// figure that reads and 39 for the Mario lead. Lifting the cape into the band
// above the shoulders puts a 12-30 unit hole between the cape and the cowl for
// thirty rows, and splaying the two trailing legs adds another twenty-four.
// Both gaps are the whole reason this figure is legible; closing either one
// puts it straight back to a streak.
//
// SECOND ROUND: it passed the index at 55.0 and still read as "a flying thing",
// never as "a strong thing". Three measurements said why, and all three are
// fixed here without touching the up-and-back sweep:
//   1. THE CAPE WAS AS BIG AS THE BODY. Cape 1422 square units against a torso
//      of 1480 -- and the cape is crimson on a pale card while the torso is
//      teal and half-covered by arms and the nameplate, so it won the look
//      even at parity. It is now TWO STREAMERS totalling about 1030 against a
//      torso of 1920: the body is nearly twice the cape. Splitting the cape in
//      two also buys back, as a gap between the streamers, more articulation
//      than the lost area cost.
//   2. THE COWL FUSED WITH THE RAISED ARM. Head radius 11.5 at (88,36) with
//      the arm elbow at (99,34) and a 9.5-wide stroke: centre distance 11.2
//      against a required 16.25, i.e. a 5-unit OVERLAP. At 96 px that is one
//      blob. The head is now r=14 at (85,27) -- 48% more area -- and it owns
//      the top-right quadrant alone: the nearest ink is the punching arm at
//      8.3 units of clear air, comfortably over the 6-unit gap the index
//      counts.
//   3. THE HEAD WAS SMALL FOR THE FAMILY. 23 units across against Cloak's 26
//      and the boss's 30, on the figure whose head has the least support from
//      anything around it. Now 28.
// The punch had to come DOWN off the shoulder to buy that clearance: a fist
// thrown up past the cowl is always within a few units of it, whatever the
// radius. A near-level thrust at chest height still reads as a punch and it
// leaves the head alone.
// The two cream speed lines from the first version are gone: in a cut-out they
// were two grey dashes floating in empty space, and the cape sweep already
// says "moving fast".
//
// This is also the one figure that needs a dedicated front-facing CHEST FACET.
// A foreshortened diagonal slab is about 18 units thick and an axis-aligned
// nameplate is 24 tall including its border, so the plate pokes past the body
// outline -- a cut-out pixel diff with and without it measured 382 pixels. The
// facet is body, so it is a deliberate silhouette choice, and the plate sits
// inside it.
export function dcJett({
  bodyColor = '#1a7d9e',
  accent = '#0b3a4c',
  capeColor = '#a8272c',
  liningColor = '#d8443f',
  emblem = 'J',
} = {}) {
  return svgWrap(
    `
    <g>
      <path d="M 66,44 L 10,10 ${scallop(10, 10, 24, 34, 2, 7)} L 56,50 Z" fill="${capeColor}"/>
      <path d="M 62,47 L 22,23 ${scallop(22, 23, 30, 40, 1, 5)} L 54,50 Z" fill="${liningColor}"/>
      ${shade(`M 62,47 L 22,23 ${scallop(22, 23, 30, 40, 1, 5)} L 54,50 Z`, 0.26)}

      <path d="M 58,54 L 14,44 ${scallop(14, 44, 26, 58, 1, 6)} L 50,60 Z" fill="${capeColor}"/>
      <path d="M 56,56 L 22,49 ${scallop(22, 49, 30,58, 1, 4)} L 50,59 Z" fill="${liningColor}"/>
      ${shade(`M 56,56 L 22,49 ${scallop(22, 49, 30, 58, 1, 4)} L 50,59 Z`, 0.3)}

      <path d="M 54,86 L 41,105 L 31,121" stroke="${bodyColor}" stroke-width="12.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="25,114 37,119 33,132 21,126" fill="${accent}"/>
      <path d="M 66,88 L 58,110 L 55,129" stroke="${bodyColor}" stroke-width="12.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="48,123 62,125 62,137 48,136" fill="${accent}"/>
      <rect x="48" y="123" width="14" height="3.2" fill="${GOLD}"/>

      <polygon points="40,44 88,36 92,76 46,84" fill="${bodyColor}"/>
      <polygon points="40,44 56,42 60,82 46,84" fill="${accent}"/>
      <polygon points="88,36 92,76 84,78 80,38" fill="${accent}" opacity="0.5"/>

      <path d="M 48,56 L 36,74 L 32,88" stroke="${bodyColor}" stroke-width="9.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="32" cy="90" r="6" fill="${accent}"/>

      <path d="M 86,56 L 101,50 L 111,43" stroke="${bodyColor}" stroke-width="10" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="112" cy="42" r="6.6" fill="${accent}"/>
      <rect x="106.5" y="39.8" width="11" height="4.4" fill="${GOLD}"/>

      <polygon points="46,76 90,69 89,80 46,86" fill="${accent}"/>
      <rect x="60" y="72" width="13" height="10" fill="${GOLD}"/>
      ${emblemPlate(EMBLEM_BOX.jett, emblem, liningColor)}

      <polygon points="74,20 84,14 60,8" fill="${accent}"/>
      <polygon points="76,23 84,18 64,13" fill="${GOLD}"/>
      <circle cx="85" cy="27" r="14" fill="${accent}"/>
      <path d="M 71.5,23.4 A 14,14 0 0 1 97.1,20 Z" fill="${bodyColor}"/>
      ${lenses(85, 32, CREAM, 1.05)}
      <polygon points="95,17 105,27 96,35" fill="${accent}"/>
    </g>
  `
  )
}

// Cloak. The detective: the family's signature figure. Two long pointed cowl
// ears run to the very top of the viewBox and the widest cape in the hero set
// spreads off the shoulders, so the cut-out reads "eared cowl over a
// bat-shaped cape" with every colour thrown away.
// The cape is TWO LOBES WITH A DEEP CENTRE NOTCH, not one hem: the notch is
// what keeps the legs visible as legs. Cowl ears belong to Cloak and to the
// boss that merges from him -- Ray and Jett deliberately have none, or the
// three heroes' heads stop being distinguishable.
export function dcCloak({
  bodyColor = '#28304f',
  accent = '#101628',
  capeColor = '#151a2e',
  liningColor = '#5d688f',
  emblem = 'OA',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="135" rx="32" ry="5" fill="#000" opacity="0.13"/>

      <path d="M 44,44 L 4,98 ${scallop(4, 98, 42, 108, 2, 9)} L 60,80 L 78,108 ${scallop(78, 108, 116, 98, 2, 9)} L 76,44 Z" fill="${capeColor}"/>
      <path d="M 48,47 L 20,92 ${scallop(20, 92, 46, 100, 1, 7)} L 60,84 L 74,100 ${scallop(74, 100, 100, 92, 1, 7)} L 72,47 Z" fill="${liningColor}"/>
      ${shade(`M 48,47 L 20,92 ${scallop(20, 92, 46, 100, 1, 7)} L 60,84 L 74,100 ${scallop(74, 100, 100, 92, 1, 7)} L 72,47 Z`, 0.34)}

      <path d="M 47,94 L 45,118 L 46,129" stroke="${bodyColor}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 73,94 L 75,118 L 74,129" stroke="${bodyColor}" stroke-width="14" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="36,122 53,122 53,137 34,137" fill="${accent}"/>
      <polygon points="84,122 67,122 67,137 86,137" fill="${accent}"/>
      <rect x="36" y="122" width="17" height="3.6" fill="${GOLD}"/>
      <rect x="67" y="122" width="17" height="3.6" fill="${GOLD}"/>

      <polygon points="34,45 86,45 84,80 79,97 41,97 36,80" fill="${bodyColor}"/>
      <polygon points="34,45 48,45 44,86 37,78" fill="${accent}"/>
      <polygon points="86,45 72,45 76,86 83,78" fill="${accent}"/>

      <path d="M 37,53 L 26,74 L 25,90" stroke="${bodyColor}" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="20,58 33,64 29,80 17,74" fill="${capeColor}"/>
      <circle cx="25" cy="93" r="6.4" fill="${accent}"/>
      <path d="M 83,53 L 94,74 L 95,90" stroke="${bodyColor}" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="100,58 87,64 91,80 103,74" fill="${capeColor}"/>
      <circle cx="95" cy="93" r="6.4" fill="${accent}"/>

      <rect x="39" y="88" width="42" height="9" fill="${accent}"/>
      <rect x="43" y="89" width="7" height="7" fill="${GOLD}"/>
      <rect x="56" y="87" width="9" height="11" fill="${GOLD}"/>
      <rect x="71" y="89" width="7" height="7" fill="${GOLD}"/>
      ${emblemPlate(EMBLEM_BOX.cloak, emblem, liningColor)}

      <circle cx="60" cy="30" r="13" fill="${accent}"/>
      <polygon points="49,21 57,20 45,2" fill="${accent}"/>
      <polygon points="71,21 63,20 75,2" fill="${accent}"/>
      <path d="M 47.2,28 A 13,13 0 0 1 72.8,28 Z" fill="${bodyColor}"/>
      ${lenses(60, 34.5, CREAM, 1.02)}
      <polygon points="53,42 67,42 64,46 56,46" fill="${accent}"/>
    </g>
  `
  )
}

// Nightray, the chapter-7 boss and the combined form. The three earlier heroes
// are all still visible in it -- Cloak's eared cowl, Jett's crimson cape
// lining, Ray's lantern in BOTH fists with a beam off each -- so "the three
// merged" reads without narration.
//
// SIZE IS BOUGHT IN SHAPE, NOT IN AREA. The first version was the biggest
// figure in the file by filled area (9295 square units against Cloak's 7090)
// and still read as "Cloak again", because the extra area went into a wider
// cape that lay over the arms and legs. Measured: its fragmentation index was
// 37.8, BELOW the 47.8 of the ordinary hero it merges from -- the boss was
// less articulate than its own component. Two changes fixed that:
//   - THE CAPE IS TWO SEPARATE SIDE LOBES that stay outboard of the legs
//     instead of one hem that spans the frame. The centre stays open, so the
//     legs are legs and there are three holes across the lower rows.
//   - THE LANTERN ARMS ARE RAISED CLEAR OF THE BODY, hands up at y=26 where
//     the torso is not, which opens a 30-unit hole on each side for fifteen
//     rows. Lowered arms sat inside the cape and contributed nothing.
// The third mark of rank is the crest: Cloak has two cowl ears, Nightray has
// two ears PLUS a gold centre spike, which is the difference a five-year-old
// reads as a crown. Do not give the other heroes a third point.
export function dcNightray({
  bodyColor = '#2b3aa0',
  accent = '#0f1436',
  capeColor = '#0d1024',
  liningColor = '#c0332f',
  panelColor = '#7c88c8',
  emblem = '★',
} = {}) {
  // Hem ends at x<=22: anything further right lands on the leg and closes the
  // gap that makes the lower half readable.
  const capeLobe = `
      <path d="M 42,44 L 2,88 ${scallop(2, 88, 22, 102, 2, 9)} L 52,68 Z" fill="${capeColor}"/>
      <path d="M 44,48 L 14,84 ${scallop(14, 84, 24, 94, 1, 7)} L 50,66 Z" fill="${liningColor}"/>
      ${shade(`M 44,48 L 14,84 ${scallop(14, 84, 24, 94, 1, 7)} L 50,66 Z`, 0.34)}`

  const lanternArm = `
      <path d="M 30,48 L 18,38 L 9,28" stroke="${bodyColor}" stroke-width="11.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="8" cy="26" r="7.2" fill="${accent}"/>
      <polygon points="2,24 15,24 16,14 1,14" fill="${GOLD}"/>
      <polygon points="4,22 13,22 14,16 3,16" fill="${CREAM}"/>`

  const searchBeam = beam(8, 24, 1, 1, 36, 1, GOLD, BEAM_RIM)

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="135" rx="42" ry="4.6" fill="#000" opacity="0.15"/>

      ${searchBeam}
      ${mirrored(searchBeam)}

      ${capeLobe}
      ${mirrored(capeLobe)}

      <path d="M 47,98 L 42,122 L 42,132" stroke="${bodyColor}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 73,98 L 78,122 L 78,132" stroke="${bodyColor}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="30,124 51,124 51,139 28,139" fill="${accent}"/>
      <polygon points="90,124 69,124 69,139 92,139" fill="${accent}"/>
      <rect x="30" y="124" width="21" height="4" fill="${GOLD}"/>
      <rect x="69" y="124" width="21" height="4" fill="${GOLD}"/>

      <polygon points="30,43 90,43 88,82 82,100 38,100 32,82" fill="${bodyColor}"/>
      <polygon points="30,43 46,43 42,90 34,80" fill="${accent}"/>
      <polygon points="90,43 74,43 78,90 86,80" fill="${accent}"/>
      <polygon points="38,100 82,100 78,106 42,106" fill="${accent}"/>

      <polygon points="24,42 48,42 44,60 20,58" fill="${bodyColor}"/>
      <polygon points="96,42 72,42 76,60 100,58" fill="${bodyColor}"/>
      <rect x="22" y="42" width="24" height="4.4" fill="${GOLD}"/>
      <rect x="74" y="42" width="24" height="4.4" fill="${GOLD}"/>

      ${lanternArm}
      ${mirrored(lanternArm)}

      <rect x="36" y="88" width="48" height="10" fill="${accent}"/>
      <rect x="52" y="86" width="16" height="14" fill="${GOLD}"/>
      <rect x="32" y="43" width="56" height="3.6" fill="${panelColor}"/>
      ${emblemPlate(EMBLEM_BOX.nightray, emblem, GOLD)}

      <circle cx="60" cy="27" r="15" fill="${accent}"/>
      <polygon points="47,17 56,16 41,1" fill="${accent}"/>
      <polygon points="73,17 64,16 79,1" fill="${accent}"/>
      <path d="M 45.2,25 A 15,15 0 0 1 74.8,25 Z" fill="${bodyColor}"/>
      <rect x="45.4" y="22.4" width="29.2" height="3.6" fill="${GOLD}"/>
      ${lenses(60, 31.5, CREAM, 1.18)}
      <polygon points="52,40 68,40 64,45 56,45" fill="${accent}"/>
      <polygon points="54,15 66,15 60,0.6" fill="${GOLD}"/>
      <polygon points="56.6,14 63.4,14 60,5" fill="${accent}"/>
    </g>
  `
  )
}

// ---------------------------------------------------------------------------
// VILLAINS. Same night-city drawing language, inverted on all four axes:
// hues outside the heroes' azure band, no gold anywhere, no cream on the
// torso, and tilted/jagged silhouettes. None of them carries an emblem --
// the letters belong to the heroes. Each one's own name is made literal in
// the silhouette, which is how the chapter-2 and chapter-3 villains worked.
// ---------------------------------------------------------------------------

// Blackout. The dead streetlamp: a wide hooded lamp cowl for a head, dead
// cracked bulbs on both hands, and no legs at all -- a robe-like flared base
// instead. Legless is the sharpest silhouette break from the four heroes and
// is kept from the first version.
//
// THIS FIGURE WAS REDRAWN BECAUSE IT READ AS THE LETTER `I`.
// The first version was a 52-unit lamp head on a 22-unit vertical post over a
// 56-unit flared foot, perfectly symmetric: that is a serif capital I, and in
// a hard cut-out only the two thin drooping arms argued otherwise. It cannot
// stand in a phonics app, and least of all here -- Blackout is the stage-1
// villain of the chapter that teaches AI, so `I` is a letter the child is
// looking for on that very screen.
// The letter needs three things at once and the redraw denies all three:
//   1. A THIN STEM UNDER A WIDE BAR. The post is now a shoulder-and-torso:
//      64 units across at the shoulders against the cowl's 70, so there is no
//      bar-over-stem step left to read. (Profile, top to bottom: cowl 70,
//      shoulders 64, waist 40, hips 74, hem 48.)
//   2. THE WIDEST PART AT THE VERY BOTTOM. The robe now reaches its widest at
//      the hips and NARROWS into the hem, so the lower serif is gone. A
//      capital I cannot have its widest row above its last row.
//   3. SYMMETRY ABOUT A VERTICAL AXIS. The cowl sits left of the body centre
//      and rakes down to the right, one arm droops low-left while the other is
//      flung up-right, and the hem is `jagged()`. That last one also repairs a
//      quiet violation: this figure had no jagged hem at all, which is axis (d)
//      of the hero/villain split.
// Checked against T, L, Y, A, H as well -- see `_dc-cut.html?letters=1`.
export function dcBlackout({
  bodyColor = '#241a38',
  accent = '#120c1e',
  lensColor = '#c99bff',
  glowColor = '#ff5cf0',
} = {}) {
  // `ox,oy` aims the mounting collar back up its own arm. The two arms now
  // leave the shoulders in opposite directions, and a collar that always sits
  // on top of the bulb reads as a little hat on the raised one.
  const bulb = (cx, cy, ox, oy) => `
    <polygon points="${cx + ox * 0.7 - 3.4},${cy + oy * 0.7 - 2.2} ${cx + ox * 0.7 + 3.4},${cy + oy * 0.7 + 2.2} ${cx + ox + 3},${cy + oy + 2} ${cx + ox - 3},${cy + oy - 2}" fill="${accent}"/>
    <circle cx="${cx}" cy="${cy}" r="8.4" fill="${accent}"/>
    <circle cx="${cx}" cy="${cy}" r="5.6" fill="${bodyColor}"/>
    <path d="M ${cx - 3.6},${cy + 1.6} L ${cx - 3.6},${cy - 1.2} L ${cx - 1.4},${cy - 2.6}"
      stroke="${lensColor}" stroke-width="1.6" fill="none" opacity="0.9"/>
    <path d="M ${cx + 1.4},${cy - 2.6} L ${cx + 3.6},${cy - 1.2} L ${cx + 3.6},${cy + 1.6}"
      stroke="${lensColor}" stroke-width="1.6" fill="none" opacity="0.9"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="62" cy="134" rx="30" ry="4.6" fill="#000" opacity="0.14"/>

      <path d="M 44,66 L 22,82 L 14,100" stroke="${bodyColor}" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${bulb(13, 102, 6, -8)}
      <path d="M 78,64 L 96,56 L 106,44" stroke="${bodyColor}" stroke-width="10.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ${bulb(107, 42, -8, 6)}

      <path d="M 40,96 L 80,96 L 100,120 L 86,132 ${jagged(86, 132, 36, 132, 4, 6)} L 26,116 Z" fill="${bodyColor}"/>
      <polygon points="40,96 52,96 44,132 36,132 26,116" fill="${accent}"/>
      <polygon points="30,122 94,124 87,130 34,128" fill="${accent}"/>

      <polygon points="26,56 90,61 80,98 40,98" fill="${bodyColor}"/>
      <polygon points="26,56 46,57.6 43,98 40,98" fill="${accent}"/>
      <polygon points="35,72 84,76 84,81 35,77" fill="${accent}"/>
      <polygon points="39,86 80,90 80,95 39,91" fill="${accent}"/>

      <polygon points="35,45 76,48 74,62 34,59" fill="${accent}"/>

      <polygon points="36,14 68,18 69,23 35,19" fill="${bodyColor}"/>
      <polygon points="24,16 84,24 86,33 25,25" fill="${accent}"/>
      <polygon points="29,25 79,31.5 76,50 32,43" fill="${bodyColor}"/>
      <g transform="rotate(7.6 53 37)">${eyePlate(53, 37, 32, 12, lensColor, '#0b0512', glowColor, 2)}</g>
      <polygon points="33,41 76,48 74,55 34,46" fill="${accent}"/>
    </g>
  `
  )
}

// Mirage. Two heads on one body: the solid one plus an illusion rising from
// the same shoulders on a visible second neck, so the cut-out itself asks
// which is real. A mirror shard in the far hand carries a third, tiny face.
// Hem is jagged (villain rule) and the body is split down the middle into two
// tones so nothing about the figure agrees with itself.
// The second head needs a NECK and 30-plus units of separation. The first
// pass put it 20 units away with no neck and the cut-out read as one head
// with two horns, which is a different villain entirely.
//
// THIS FIGURE HAD THE HIGHEST FRAGMENTATION INDEX IN THE FILE (96.5) AND THAT
// WAS PARTLY A LIE. The index rewards a detached fragment whatever it is, so
// three defects were paying into it and a viewer read them as clutter, not as
// articulation. High fragmentation is not automatically good:
//   - THE SHIMMER CHEVRON BROKE THE TORSO OUTLINE. It ran from x=40 to x=78
//     while the torso edges at those rows are 42.1 and 76.2, so it poked 2-3
//     units past the body on BOTH sides and showed up in the cut-out as two
//     grey lumps on the hips. That is the same rule the emblem plate obeys:
//     an internal detail must never alter the outline. It is now inset.
//   - THE JAGGED HEM HAD FIVE TEETH AND THE LEGS COVERED THREE OF THEM, so
//     what survived was two unexplained spikes at the hips. Three teeth on a
//     wider tabard put every tooth in a gap between the legs instead.
//   - THE MIRROR SHARD WAS A TRANSLUCENT PLATE BEHIND AN OPAQUE ONE, which in
//     a cut-out is one rectangle ghosting another. The frame is opaque now, so
//     the shard is a held object with a dark rim.
// The ghost's diamond shoulder and stub neck are also gone, replaced by one
// tapering column: they made an angular pile at the right shoulder where the
// real arm, the real shoulder and the illusion all met.
export function dcMirage({
  bodyColor = '#6e2352',
  accent = '#37102a',
  ghostColor = '#a3468a',
  shimmerColor = '#5ff0d8',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="56" cy="134" rx="26" ry="4.6" fill="#000" opacity="0.1"/>

      <polygon points="70,52 84,50 88,26 76,24" fill="${ghostColor}"/>
      <circle cx="84" cy="16" r="10.5" fill="${ghostColor}"/>
      ${eyePlate(84, 18, 15, 7, '#b8f0e4', '#3a1030', null, 1.2)}

      <path d="M 50,92 L 46,114 L 45,126" stroke="${bodyColor}" stroke-width="11.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 68,92 L 72,114 L 73,126" stroke="${accent}" stroke-width="11.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="36,122 51,122 51,134 34,134" fill="${accent}"/>
      <polygon points="82,122 67,122 67,134 84,134" fill="${bodyColor}"/>

      <polygon points="40,46 78,46 74,94 45,94" fill="${bodyColor}"/>
      <polygon points="59,46 78,46 74,94 59,94" fill="${accent}"/>
      <path d="M 44,66 L 51,60 L 60,70 L 69,62 L 75,68 L 75,76 L 69,70 L 60,78 L 51,68 L 44,74 Z" fill="${shimmerColor}" opacity="0.62"/>

      <path d="M 44,52 L 30,68 L 28,84" stroke="${bodyColor}" stroke-width="9.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="28" cy="86" r="5.8" fill="${accent}"/>
      <path d="M 74,52 L 92,60 L 100,68" stroke="${accent}" stroke-width="9.5" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="101" cy="70" r="5.8" fill="${bodyColor}"/>
      <polygon points="94,50 116,42 118,72 100,78" fill="${accent}"/>
      <polygon points="97,52 112,46 114,68 101,72" fill="${shimmerColor}"/>
      <circle cx="106" cy="57" r="5" fill="${accent}"/>
      <polygon points="101,72 114,68 113,74 102,76" fill="${accent}" opacity="0.5"/>

      <path d="M 36,92 L 82,92 ${jagged(82, 92, 36, 92, 3, 13)} Z" fill="${accent}"/>

      <circle cx="50" cy="34" r="11.5" fill="${bodyColor}"/>
      <path d="M 38.5,32 A 11.5,11.5 0 0 1 61.5,32 Z" fill="${accent}"/>
      ${eyePlate(50, 37, 17, 8, shimmerColor, '#25081c', '#eaffff', 1.5)}
      <polygon points="39,26 47,28 33,11" fill="${accent}"/>
    </g>
  `
  )
}

// Gridlock. The jam: a traffic-signal box for a head and a diamond-mesh
// barrier strung between two outstretched fists across the whole lower frame.
// The mesh is diamonds rather than squares on purpose -- a square grid reads
// as a hash mark, and this family already risks being misread as letters.
export function dcGridlock({
  bodyColor = '#4d5a25',
  accent = '#212a0d',
  lampColor = '#c2e83a',
  barColor = '#6f7d3d',
} = {}) {
  // The barrier is clipped to its own rectangle by arithmetic rather than by
  // a <clipPath id>: the same figure can appear several times on one page
  // (gallery, battle scene, reward), and duplicate ids in a document are a
  // real bug waiting to happen.
  // The band is CHEST HEIGHT, strung between the two fists that hold it, and
  // it stops at y=100. The first version ran it from 78 to 126, which is
  // exactly the rows where the legs separate: the net filled the gap and the
  // hard cut-out came back as a slab with no legs in it (fragmentation 23.8
  // against 61 for a figure that reads). Holding it up at the hands is also
  // the more literal read of the character.
  // It is drawn IN FRONT of the torso and behind the head. Behind the torso,
  // the body hid the middle of it and the net read as two green patches at the
  // sides -- something growing out of him rather than something he is holding
  // across himself, which is the whole character.
  const mesh = (() => {
    const X0 = 6
    const X1 = 114
    const Y0 = 56
    const Y1 = 100
    const line = (xa, ya, xb, yb) =>
      `<path d="M ${xa.toFixed(1)},${ya.toFixed(1)} L ${xb.toFixed(1)},${yb.toFixed(1)}" stroke="${lampColor}" stroke-width="2" opacity="0.5" fill="none"/>`
    let d = ''
    const span = Y1 - Y0
    for (let x0 = X0 - span; x0 <= X1 + span; x0 += 11) {
      const ra = Math.max(X0, x0)
      const rb = Math.min(X1, x0 + span)
      if (rb > ra) d += line(ra, Y0 + (ra - x0), rb, Y0 + (rb - x0))
      const la = Math.max(X0, x0 - span)
      const lb = Math.min(X1, x0)
      if (lb > la) d += line(la, Y0 + (x0 - la), lb, Y0 + (x0 - lb))
    }
    return d
  })()

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="34" ry="5" fill="#000" opacity="0.12"/>

      <path d="M 44,94 L 42,114 L 42,126" stroke="${bodyColor}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 76,94 L 78,114 L 78,126" stroke="${bodyColor}" stroke-width="15" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="32,120 51,120 51,133 30,133" fill="${accent}"/>
      <polygon points="88,120 69,120 69,133 90,133" fill="${accent}"/>

      <polygon points="34,52 86,52 80,96 40,96" fill="${bodyColor}"/>
      <rect x="36" y="60" width="48" height="6" fill="${accent}"/>
      <rect x="36" y="72" width="46" height="6" fill="${accent}"/>
      <rect x="37" y="84" width="44" height="6" fill="${accent}"/>
      <polygon points="34,52 86,52 84,58 36,58" fill="${barColor}"/>

      <path d="M 38,58 L 22,62 L 12,66" stroke="${bodyColor}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 82,58 L 98,62 L 108,66" stroke="${bodyColor}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="4,60 18,60 18,74 4,74" fill="${accent}"/>
      <polygon points="116,60 102,60 102,74 116,74" fill="${accent}"/>

      ${mesh}
      <rect x="6" y="54" width="108" height="4" fill="${accent}"/>
      <rect x="6" y="98" width="108" height="4" fill="${accent}"/>

      <polygon points="46,14 74,14 74,50 46,50" fill="${accent}"/>
      <polygon points="46,14 74,14 76,10 44,10" fill="${bodyColor}"/>
      <polygon points="42,20 46,20 46,26 42,26" fill="${bodyColor}"/>
      <polygon points="78,20 74,20 74,26 78,26" fill="${bodyColor}"/>
      <circle cx="54" cy="24" r="5.2" fill="${lampColor}"/>
      <circle cx="66" cy="24" r="5.2" fill="${lampColor}"/>
      <circle cx="54" cy="24" r="2.2" fill="${accent}"/>
      <circle cx="66" cy="24" r="2.2" fill="${accent}"/>
      <circle cx="60" cy="40" r="5.4" fill="${bodyColor}"/>
      <rect x="47" y="31" width="26" height="2.6" fill="${barColor}"/>
    </g>
  `
  )
}

// Floodlight. The blinder: the head is a tilted bank of six stadium lamps in
// a frame, its two centre lamps doubling as eyes, and a hard glare wedge
// falls across the lower-left of the frame. Broad and short so it reads as a
// machine on legs next to the tall lean heroes.
// The overhanging visor hood on top of the frame is load bearing: without it
// the cut-out reads "television head", which is a different joke.
export function dcFloodlight({
  bodyColor = '#8a3f1c',
  accent = '#3f1608',
  lampColor = '#eaffff',
  glareColor = '#9fe8f5',
} = {}) {
  const lamp = (cx, cy, pupil) => `
    <circle cx="${cx}" cy="${cy}" r="6.4" fill="${accent}"/>
    <circle cx="${cx}" cy="${cy}" r="5.1" fill="${lampColor}"/>
    ${pupil ? `<circle cx="${cx}" cy="${cy}" r="2.1" fill="${accent}"/>` : ''}`

  return svgWrap(
    `
    <g>
      <ellipse cx="62" cy="134" rx="30" ry="5" fill="#000" opacity="0.12"/>

      ${beam(52, 44, 1, 84, 5, 134, glareColor, '#2a7f96')}

      <path d="M 52,96 L 48,116 L 48,128" stroke="${bodyColor}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 76,96 L 80,116 L 80,128" stroke="${bodyColor}" stroke-width="16" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="38,122 57,122 57,135 36,135" fill="${accent}"/>
      <polygon points="92,122 73,122 73,135 94,135" fill="${accent}"/>

      <polygon points="40,54 88,54 84,98 46,98" fill="${bodyColor}"/>
      <polygon points="40,54 56,54 52,90 44,82" fill="${accent}"/>
      <rect x="45" y="88" width="38" height="8" fill="${accent}"/>
      <path d="M 84,60 C 100,66 102,84 92,94" stroke="${accent}" stroke-width="4" fill="none"/>
      <path d="M 80,58 C 94,64 96,80 88,90" stroke="${accent}" stroke-width="3" fill="none"/>

      <path d="M 46,60 L 30,72 L 26,86" stroke="${bodyColor}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="26" cy="88" r="6.4" fill="${accent}"/>
      <path d="M 82,60 L 98,72 L 102,86" stroke="${bodyColor}" stroke-width="11" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <circle cx="102" cy="88" r="6.4" fill="${accent}"/>

      <polygon points="44,52 56,42 60,52" fill="${accent}"/>
      <polygon points="72,50 84,40 86,50" fill="${accent}"/>

      <polygon points="38,20 92,12 96,44 42,50" fill="${accent}"/>
      <polygon points="41,23 89,16 92,41 45,47" fill="${bodyColor}"/>
      <polygon points="30,26 38,20 42,50 32,52" fill="${accent}"/>
      <polygon points="32,29 38,25 41,47 34,48" fill="${bodyColor}"/>
      ${lamp(52, 27, false)}
      ${lamp(67, 25, true)}
      ${lamp(82, 23, false)}
      ${lamp(54, 41, true)}
      ${lamp(69, 39, false)}
      ${lamp(84, 37, false)}
      <polygon points="36,17 94,9 96,2 34,10" fill="${accent}"/>
      <polygon points="34,10 96,2 96,6 36,14" fill="${bodyColor}"/>
      <polygon points="20,20 34,10 36,17 24,28" fill="${accent}"/>
    </g>
  `
  )
}

// Nightfall, the chapter-7 boss villain and the largest ink mass in the file.
// Two enormous jagged wings sweep UP to the top corners; the cloak flares off
// a wide shoulder yoke and tears into a ragged hem, so nothing touches the
// floor.
// The wings are chosen against a specific collision: the chapter-2 boss
// villain (Shadow King, src/art.js) is also a big cloaked figure with a
// spiked crown and a jagged hem that flares outward at the bottom. The first
// pass here drew exactly that and the two were indistinguishable in cut-out
// side by side. Raised wings invert the shape while keeping the menace, and
// this is the only figure in the family with no ground contact at all.
//
// SECOND ROUND -- IT DID NOT READ AS A BOSS, ON TWO COUNTS THAT BOTH MEASURED:
//   1. IT WAS NOT THE BIGGEST VILLAIN. 7067 filled square units against
//      Floodlight's 8046, on the figure that is supposed to end the chapter.
//      The yoke, the wings and the cloak are all wider now.
//   2. IT HAD NO HEAD. The first version paired a hood tapering to a point at
//      (60,10) with a cloak tapering to a point at (60,132): a perfect rhombus,
//      and in a hard cut-out that is exactly what it read as -- one big
//      diamond, no figure inside it. Both ends are broken now:
//        - THE HEAD GETS TWO SWEPT HORNS at head height with 16 to 24 units of
//          clear air between the horn and the shoulder yoke below it. A head is
//          read from the hole under its jaw, not from its outline; the earlier
//          hood had nothing but outline.
//        - THE HEM IS `jagged()`, not a point. Quietly, this figure was the
//          only caped villain in the file with no jagged hem at all, which is
//          axis (d) of the hero/villain split -- so the fix that kills the
//          rhombus is also the one the family rules already asked for.
export function dcNightfall({
  bodyColor = "#221436",
  accent = "#0b0616",
  lensColor = "#f0dcff",
  eyeColor = "#ff2e4d",
  glowColor = "#a45cff",
} = {}) {
  const shard = (x, y, s) =>
    `<polygon points="${x},${y} ${x + 6 * s},${y + 2 * s} ${x + 2 * s},${y + 9 * s}" fill="${glowColor}" opacity="0.55"/>`

  // Leading edge sweeps out to the frame corner; the trailing edge comes back
  // in as three teeth. Sharp, never scalloped -- that hem shape is this
  // family reserved marker for a villain.
  const wing = `
    <path d="M 36,54 L 2,2 L 9,22 L 3,28 L 15,44 L 8,50 L 22,64 L 18,74 L 34,82 Z" fill="${accent}"/>
    <path d="M 34,57 L 12,23 L 16,36 L 12,40 L 21,51 L 17,56 L 26,66 L 24,72 L 32,77 Z" fill="${bodyColor}"/>`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="135" rx="22" ry="3.4" fill="#000" opacity="0.16"/>

      ${shard(96, 66, 0.85)}
      ${shard(16, 74, 0.7)}
      ${shard(100, 96, 0.6)}
      ${shard(14, 100, 0.55)}

      ${wing}
      ${mirrored(wing)}

      <path d="M 16,62 L 104,62 L 86,118 ${jagged(86, 118, 34, 112, 4, 16)} Z" fill="${accent}"/>
      <path d="M 26,68 L 94,68 L 80,112 ${jagged(80, 112, 40, 108, 3, 12)} Z" fill="${bodyColor}"/>
      <polygon points="42,80 78,80 68,110 60,122 52,108" fill="${accent}"/>

      <path d="M 34,64 L 18,80 L 11,94" stroke="${accent}" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M 86,64 L 102,80 L 109,94" stroke="${accent}" stroke-width="13" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="3,92 21,92 17,106 7,106" fill="${bodyColor}"/>
      <polygon points="117,92 99,92 103,106 113,106" fill="${bodyColor}"/>
      <polygon points="4,105 8,119 12,105" fill="${glowColor}"/>
      <polygon points="12,105 16,116 20,105" fill="${glowColor}"/>
      <polygon points="100,105 104,116 108,105" fill="${glowColor}"/>
      <polygon points="108,105 112,119 116,105" fill="${glowColor}"/>

      <polygon points="10,66 30,36 90,36 110,66 96,60 24,60" fill="${accent}"/>
      <polygon points="26,42 94,42 102,66 18,66" fill="${bodyColor}"/>
      <polygon points="26,42 94,42 92,48 28,48" fill="${accent}"/>

      <polygon points="46,30 26,4 44,20" fill="${accent}"/>
      <polygon points="74,30 96,7 76,20" fill="${accent}"/>
      <polygon points="44,36 60,6 76,36" fill="${accent}"/>

      <polygon points="45,22 75,22 78,46 42,46" fill="${accent}"/>
      ${eyePlate(60, 34, 26, 12, lensColor, "#1a0426", eyeColor, 2.2)}
      <polygon points="50,44 70,44 66,52 54,52" fill="${accent}"/>
      <polygon points="52,52 68,52 64,58 56,58" fill="${glowColor}" opacity="0.55"/>
    </g>
  `
  )
}
