// DC-family character art (chapter 7 onward). The user picked the cast from
// four Justice League minifigure references: Batman -> Flash -> Cyborg ->
// Superman for the heroes, the Joker for the boss villain, and asked for
// "roughly LEGO proportions". So this file is drawn to THE TOY, not to the
// comic, and that decision is what every number below serves.
//
// WHY THE TOY IS THE RIGHT TARGET HERE, and what it cost:
// The pre-minifig version of this file was a lean 4.9-head-height vigilante
// cast whose whole reason for existing was to be measurably unlike the
// chapter-2 chibi superheroes (3.1 heads). Minifig proportions land at about
// 3.5, so HEIGHT RATIO NO LONGER SEPARATES THE TWO SUPERHERO FAMILIES. The
// separator is now RECTILINEARITY, and it is a stronger one: chapter 2 is
// built from capsules and circles (`rect rx="26"`, `circle r="27"`), this file
// is built from blocks, trapezoids, 5-unit corner radii and C-clip hands. A
// figure from either file dropped into the other is obvious at a glance.
//
// DESIGN GRAMMAR
//
//  1. MINIFIGURE BUILD, SHARED. Block head 36x34 with softened corners, a
//     6-unit neck, a trapezoid torso 54 wide at the shoulders, round-capped
//     tube arms, C-clip hands, a hip block with a crotch notch, two short
//     square legs with an 8-unit gap and a boot band. The four heroes differ
//     by HEADGEAR, COLOUR AND PROP -- never by build. That is how the real toy
//     works, and see `EMBLEM_BOX` for the measured payoff.
//  2. THE FACE IS THE CHARACTER. The old rule was "cowl, not face"; it is
//     inverted now, because a five-year-old identifies these five from the
//     head. Batman = eared cowl + pale lenses + exposed grey jaw. Flash =
//     all-red cowl with two big gold ear-bolts in free air outside the head.
//     Cyborg = head split down the middle, dark human half with one pale eye
//     against a steel half with a red optic. Superman = the family's ONLY
//     unmasked face, black hair with a widow's peak. Joker = white greasepaint
//     block, green mane, one huge red grin.
//  3. ONE PROP EACH, AND IT OWNS A QUADRANT. Batman's cape, Flash's stride,
//     Cyborg's shoulder cannon, Superman's raised cape lobes, Joker's fanned
//     cards. The prop is what carries the read at the 96 px chapter card,
//     where face detail is gone.
//  4. VOLUME BY STACKED OPAQUE FACES. No gradients and no filters inside SVG
//     (project rule). Side facets, collar strips and boot bands do the work.
//  5. HERO / VILLAIN SPLIT ON FOUR AXES, never on brightness alone. Real
//     characters forced one axis to be restated; that is recorded honestly
//     rather than quietly dropped:
//       a. WAS "heroes live in the 200-235 degree azure band". BROKEN BY THE
//          CAST -- Flash has to be red. Restated as PRIMARY vs SECONDARY, which
//          is DC's own convention, and it still measures. Hero body hues:
//          Batman 219 (s=0.27), Flash 358 (s=0.85), Cyborg 216 (s=0.16),
//          Superman 224 (s=0.85). Villain body hues: Blackout 260, Mirage 322,
//          Gridlock 75, Floodlight 19, Joker 269 + green mane 134. NO VILLAIN
//          SITS IN THE HERO AZURE BAND and none is within 39 degrees of
//          Flash's red, so "no villain wears a hero body hue" survives the
//          restatement -- it is now the measurable form of the axis.
//       b. THE GOLD IS THE HEROES'. Warm gold trim appears on heroes only.
//          Villain emission stays violet, mint, acid green, cyan-white, red.
//       c. CREAM IS THE HERO CHEST PLATE. `CREAM` (#f7f3e6) appears nowhere on
//          a villain. The Joker's greasepaint is deliberately a DIFFERENT
//          white (#fbfbfb) and it is on the head, which is where every other
//          villain's bright already lives (lamps, eyes, beams). No villain has
//          a bright torso plate.
//       d. STANCE. Heroes are upright and symmetric; villains are tilted and
//          asymmetric with a `jagged()` hem. The Joker's coat shoulders are
//          tilted, one arm is up and one down, the mane is lopsided and both
//          coattails are jagged.
//  6. EYES ALWAYS SIT ON A PLATE LIGHTER THAN THE BODY. Kept from the
//     chapter-4 lesson: ink dots on a dark body measured 2.0:1 there.
//  7. THE EMBLEM PLATE IS CURRICULUM CONTENT, not decoration. See
//     `emblemPlate` and `EMBLEM_BOX` -- and note that the minifig rewrite made
//     the letter BIGGER, not smaller, which was the risk going in.
//
// KNOWN INCONSISTENCY, USER-SANCTIONED. Only the five characters the user
// named are minifigs. Blackout / Mirage / Gridlock / Floodlight (stages 7-1 to
// 7-4's ordinary villains) keep the earlier lean-adult build, because the user
// scoped them out: "the villains just get roughly reused, so they matter less".
// They are byte-identical to the previous round on purpose -- each of them
// carries a hard-won fix (Blackout's letter-`I` cure, Gridlock's mesh draw
// order, Mirage's two-head separation, Floodlight's hood attachment) and
// re-proportioning them would put all four back at risk for no user-visible
// gain. Their palettes were checked against the Joker's and need no change:
// purple+green sits between Blackout's plum/magenta and Gridlock's olive/acid.
//
// WHAT THIS ROUND COST -- read this before the next one.
//  - THE MINIFIG BUILD IS INTRINSICALLY LOW-FRAGMENTATION and the index knows
//    it. A minifig has exactly two natural holes: the 8-unit leg gap and the
//    C-hand rings, and the rings are under the index's 6-unit threshold. So
//    every figure here has to EARN its articulation from the pose or the prop,
//    and the two that did not, measured badly at once (Batman 32.5 with the
//    cape over both arms, Cyborg 32.8 when the new fat cannon closed the hole
//    beside the head). Both are fixed and both fixes were pose changes, not
//    decoration. If you add a figure to this file, check the index BEFORE
//    calling it done -- the build will not give you a hole for free.
//  - SUPERMAN AND THE CHAPTER-2 LEAD ARE THE CLOSEST PAIR IN THE APP: both are
//    blue bodies with red capes, gold trim and a star plate. They separate on
//    build (block vs capsule), on the face (this one is the app's only unmasked
//    hero; that one wears a black domino mask on a round head) and on the cape
//    (two lobes swept UP vs one 7-point hem hanging DOWN). Verified side by
//    side in colour and in hard cut-out. It holds, but it is the pair to
//    re-check if either family is ever recoloured.
//  - THE HERO HUE AXIS IS WEAKER THAN IT WAS. It used to be a 35-degree band;
//    it is now "no villain wears a hero body hue", which is true (measured, see
//    axis (a)) but is a weaker claim than the old one. Flash's red did that.
//  - THE FOUR LEAN-ADULT VILLAINS NOW LOOK LIKE A DIFFERENT FAMILY from the
//    five minifigs they share a chapter with. This is the user's call, not an
//    oversight, but it IS the most visible cost of the round.
//  - `_probe.html` HAS NO `map7` SHOT, so the chapter-7 map screen is still
//    unverified in the app. The viewBox is fixed at 0 0 120 140 so layout
//    cannot move, but that is an argument, not a measurement.
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

// ---------------------------------------------------------------------------
// MINIFIGURE KIT. Shared build for the five characters the user named, so they
// differ by headgear, colour and prop rather than by anatomy.
// ---------------------------------------------------------------------------

// The minifig head is a cylinder, so head-on it is a wide block with softened
// corners -- wide enough to carry a whole face, which is the point (grammar
// rule 2). 36x34 here, 40x36 on the boss.
function legoBlock(x, y, w, h, color, r = 5) {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${color}"/>`
}

// A minifig arm: shoulder -> elbow -> wrist as one round-capped stroke. The
// cap at the shoulder IS the shoulder, which is why these are drawn BEFORE the
// torso: the torso then hides the inner half and the visible arm starts at the
// body edge, exactly like the toy. A separately drawn shoulder ball was tried
// and it collided with the chest plate (see EMBLEM_BOX for the clearances).
function legoArm(sx, sy, ex, ey, wx, wy, color, w) {
  return `<path d="M ${sx},${sy} L ${ex},${ey} L ${wx},${wy}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
}

// The C-clip hand -- the most recognisable minifig part after the head. It is
// an OPEN ring, so the hole is real background and it survives the hard
// cut-out instead of reading as a blob on the end of the arm. `gapDeg` aims
// the opening (SVG angles run clockwise on screen because y points down).
function legoHand(cx, cy, color, r = 5, gapDeg = -120, w = 3.4) {
  const p = (deg) => {
    const a = (deg * Math.PI) / 180
    return [(cx + r * Math.cos(a)).toFixed(1), (cy + r * Math.sin(a)).toFixed(1)]
  }
  const [x0, y0] = p(gapDeg + 30)
  const [x1, y1] = p(gapDeg + 330)
  return `<path d="M ${x0},${y0} A ${r},${r} 0 1 1 ${x1},${y1}" stroke="${color}" stroke-width="${w}" fill="none" stroke-linecap="round"/>`
}

// One leg: block plus boot band, optionally rotated about the hip pivot the
// way the toy's leg actually rotates (Flash's stride uses it). Rotation is a
// transform, never rewritten point lists -- `polygon points` are absolute
// coordinates in this file and hand-flipping them is where the x-goes-negative
// mistakes come from.
function legoLeg(x, y, w, h, legColor, bootColor, bootH, rot = 0, px = 0, py = 0) {
  const inner =
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="2.5" fill="${legColor}"/>` +
    `<rect x="${x}" y="${(y + h - bootH).toFixed(1)}" width="${w}" height="${bootH}" rx="2.5" fill="${bootColor}"/>`
  return rot ? `<g transform="rotate(${rot} ${px} ${py})">${inner}</g>` : inner
}

// Where each hero carries the letter -- and the answer to the biggest risk in
// this rewrite. Minifig proportions grow the head and shorten the torso, which
// normally means LESS chest, and chapter 7 teaches the digraphs AI and OA, so
// two glyphs have to fit. It came out AHEAD, for a reason that belongs to the
// toy rather than to luck: EVERY MINIFIG SHARES ONE TORSO, and the real thing
// wears its print edge to edge across it. So the plate is sized once against
// one 54-unit shoulder line (62 on the boss) instead of being fitted to four
// different chests, and `w` went UP.
// Clearances that hold it there, measured, per hero:
//   - plate outer edge x=38.8; nearest arm ink is the shoulder cap at x=36.5,
//     so the plate never sits on an arm (2.3 units of body between them).
//   - torso edge at the plate's lowest row is x=35.6, so 3.2 units of body
//     surround the plate: it cannot alter the hard-cut-out silhouette, which
//     is the one rule an internal detail must never break.
//   - plate bottom 84.4 against a belt at 87: the belt is not part of the
//     plate and must not touch it.
const EMBLEM_BOX = {
  ray: { cx: 60, cy: 70, w: 38 },
  jett: { cx: 60, cy: 70, w: 38 },
  cloak: { cx: 60, cy: 70, w: 38 },
  nightray: { cx: 60, cy: 74, w: 44 },
}

// ---------------------------------------------------------------------------
// HEROES. Batman -> Flash -> Cyborg -> Superman, in the order the user gave.
// All four share the minifig build; each owns one quadrant of the frame with
// one prop so the four are still four silhouettes and not one figure in four
// colour schemes.
// ---------------------------------------------------------------------------

// Ray = BATMAN, and the chapter's most-seen figure (stages 7-1 and 7-2).
// The read, in the order a five-year-old gets it: (1) two pointed cowl ears
// running to the top of the frame, (2) the biggest cape in the hero set with a
// SCALLOPED hem -- which is Batman's actual hem, so the family's hero-cape rule
// and the character agree for once, (3) the classic grey-suit / black-cowl-
// cape-gloves-boots-trunks split, (4) a gold utility belt, (5) the gold-framed
// chest plate, which is exactly where Batman's yellow oval emblem goes. That
// last one is why this character absorbs the phonics plate with no argument.
// The exposed grey jaw under the cowl is load bearing: without it the head is
// one black block and the cut-out loses the chin line that says "mask".
//
// THE CAPE TAPERS DOWNWARD AND THE ELBOWS ARE PUSHED OUT PAST IT. This is the
// one place where the minifig build fights the silhouette, and it measured:
// a cape wide at the shoulders AND wide at the hem swallows both arms, and the
// fragmentation index came back at 32.5 -- the lowest in the file, below even
// Gridlock's 34.3, on the figure the child sees for two whole stages. A minifig
// has only two natural holes (the 8-unit leg gap and the C-hand rings, and the
// rings are under the index's 6-unit threshold), so a cape that covers the arms
// leaves the leg gap as the ONLY articulation. Two changes bought it back:
//   - the cape is 64 wide at the collar and tapers to 46 at the hem, which is
//     the shape of the actual LEGO cape piece anyway. It still shows 5 units
//     outboard of the torso at the top, so it reads as a cape from the front.
//   - the elbows swing out to x=16/104, clear of the tapering cape edge, so
//     twenty-five rows carry real background between each arm and the body.
// The hem keeps a DEEP CENTRE NOTCH with its apex at (60,100): earlier rounds
// of this character failed the cut-out because a hem spanning the frame below
// y=100 fills the gap between the legs and the figure reads "in a dress". The
// notch lines the open channel up with the leg gap for 26 rows. Do not close
// either one, and do not widen the hem back out.
export function dcRay({
  bodyColor = '#4a5466',
  accent = '#12151d',
  capeColor = '#171b26',
  liningColor = '#2c3444',
  jawColor = '#7d8798',
  emblem = 'AI',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="34" ry="3.4" fill="#000" opacity="0.13"/>

      <path d="M 28,48 L 34,80 L 40,118 ${scallop(40, 118, 48, 120, 1, 4)} L 60,100 L 72,120 ${scallop(72, 120, 80, 118, 1, 4)} L 86,80 L 92,48 Z" fill="${capeColor}"/>
      <path d="M 34,51 L 39,80 L 44,112 ${scallop(44, 112, 50, 114, 1, 3)} L 60,96 L 70,114 ${scallop(70, 114, 76, 112, 1, 3)} L 81,80 L 86,51 Z" fill="${liningColor}"/>
      ${shade(`M 34,51 L 39,80 L 44,112 ${scallop(44, 112, 50, 114, 1, 3)} L 60,96 L 70,114 ${scallop(70, 114, 76, 112, 1, 3)} L 81,80 L 86,51 Z`, 0.3)}
      <polygon points="43,41 77,41 92,58 28,58" fill="${capeColor}"/>

      ${legoArm(31, 60, 16, 80, 24, 94, bodyColor, 11)}
      ${legoArm(89, 60, 104, 80, 96, 94, bodyColor, 11)}
      <polygon points="21,84 11,80 20,89" fill="${accent}"/>
      <polygon points="23,90 14,87 22,95" fill="${accent}"/>
      <polygon points="99,84 109,80 100,89" fill="${accent}"/>
      <polygon points="97,90 106,87 98,95" fill="${accent}"/>
      ${legoHand(25, 98, accent, 5, -120)}
      ${legoHand(95, 98, accent, 5, -60)}

      ${legoLeg(37, 106, 19, 29, bodyColor, accent, 11)}
      ${legoLeg(64, 106, 19, 29, bodyColor, accent, 11)}
      <path d="M 37,96 L 83,96 L 83,109 L 63,109 L 60,113 L 57,109 L 37,109 Z" fill="${accent}"/>

      <path d="M 33,60 Q 33,54 39,54 L 81,54 Q 87,54 87,60 L 83,98 L 37,98 Z" fill="${bodyColor}"/>
      <polygon points="34.2,57 44,54 40.5,98 37,98" fill="${accent}" opacity="0.4"/>
      <polygon points="85.8,57 76,54 79.5,98 83,98" fill="${accent}" opacity="0.4"/>
      <path d="M 36.5,57 Q 41,64 38,71" stroke="${accent}" stroke-width="1.4" fill="none" opacity="0.7"/>
      <path d="M 83.5,57 Q 79,64 82,71" stroke="${accent}" stroke-width="1.4" fill="none" opacity="0.7"/>

      <rect x="37" y="87" width="46" height="9" fill="${GOLD}"/>
      <rect x="53" y="85" width="14" height="12" rx="2" fill="${accent}"/>
      <rect x="56" y="88" width="8" height="6" fill="${GOLD}"/>
      ${emblemPlate(EMBLEM_BOX.ray, emblem, GOLD)}

      <rect x="53" y="43" width="14" height="13" fill="${accent}"/>

      ${legoBlock(42, 14, 36, 34, accent)}
      <polygon points="46,19 55,19 48,1" fill="${accent}"/>
      <polygon points="74,19 65,19 72,1" fill="${accent}"/>
      <rect x="45" y="17" width="30" height="4.6" rx="2.2" fill="${liningColor}"/>
      <path d="M 49,35 L 71,35 L 71,43 Q 71,48 65,48 L 55,48 Q 49,48 49,43 Z" fill="${jawColor}"/>
      <polygon points="54,41 66,41 65,44 55,44" fill="${accent}"/>
      ${lenses(60, 28, CREAM, 1.3)}
    </g>
  `
  )
}

// Jett = THE FLASH. The character is speed, and the two things that carry it
// at 96 px are not detail:
//   1. TWO GOLD EAR-BOLTS IN FREE AIR. Flash's cowl bolts are normally a
//      printed detail a few units across; here they are 21-unit zigzags that
//      live OUTSIDE the head block, one per side, so they are ink against the
//      pale card rather than ink against red. They are also the reason this
//      figure needs no cape: head-plus-bolts is already a shape nothing else
//      in the app has.
//   2. THE MINIFIG STRIDE. Minifig legs rotate at the hip, so a run is drawn
//      the way the toy does it: both legs swung out of vertical about the hip
//      pivot (+18 and -22 degrees), one arm thrown up-forward and the other
//      back-down. That opens a wide V between the legs and a diagonal across
//      the whole frame, and it is why the FIRST version's two floating cream
//      speed lines are not here -- in a hard cut-out those were two grey
//      dashes in empty space, and the stance says "fast" without them.
// All-red suit with gold boots, belt and gauntlet-ring hands. No cape.
export function dcJett({
  bodyColor = '#cf2027',
  accent = '#8b1218',
  emblem = 'J',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136.5" rx="33" ry="3" fill="#000" opacity="0.12"/>

      ${legoArm(31, 60, 21, 73, 20, 86, bodyColor, 11)}
      ${legoHand(20, 90, GOLD, 5, -110)}
      ${legoArm(89, 58, 99, 49, 105, 39, bodyColor, 11)}
      ${legoHand(107, 36, GOLD, 5, -30)}

      ${legoLeg(37, 106, 19, 28, bodyColor, GOLD, 12, 18, 46.5, 106)}
      ${legoLeg(64, 106, 19, 28, bodyColor, GOLD, 12, -22, 73.5, 106)}
      <path d="M 37,96 L 83,96 L 83,110 L 63,110 L 60,114 L 57,110 L 37,110 Z" fill="${accent}"/>

      <path d="M 33,60 Q 33,54 39,54 L 81,54 Q 87,54 87,60 L 83,98 L 37,98 Z" fill="${bodyColor}"/>
      <polygon points="34.2,57 44,54 40.5,98 37,98" fill="${accent}" opacity="0.45"/>
      <polygon points="85.8,57 76,54 79.5,98 83,98" fill="${accent}" opacity="0.45"/>
      <path d="M 36.5,57 Q 41,64 38,71" stroke="${accent}" stroke-width="1.4" fill="none" opacity="0.7"/>
      <path d="M 83.5,57 Q 79,64 82,71" stroke="${accent}" stroke-width="1.4" fill="none" opacity="0.7"/>

      <rect x="37" y="87" width="46" height="9" fill="${GOLD}"/>
      <rect x="53" y="85" width="14" height="12" rx="2" fill="${accent}"/>
      <polygon points="63,86 56,91.5 60,91.5 57,96 64,90 60,90" fill="${GOLD}"/>
      ${emblemPlate(EMBLEM_BOX.jett, emblem, GOLD)}

      <rect x="53" y="43" width="14" height="13" fill="${accent}"/>

      <polygon points="45,21 31,34 38,34 24,48 31,36 24,36" fill="${GOLD}"/>
      <polygon points="75,21 89,34 82,34 96,48 89,36 96,36" fill="${GOLD}"/>
      ${legoBlock(42, 14, 36, 34, bodyColor)}
      <rect x="45" y="16.5" width="30" height="5" rx="2.4" fill="#e8474b"/>
      <polygon points="42,33 78,33 78,40 42,40" fill="${accent}" opacity="0.35"/>
      ${lenses(60, 28, CREAM, 1.32)}
      <rect x="53" y="41.6" width="14" height="2.4" rx="1.2" fill="${accent}"/>
    </g>
  `
  )
}

// Cloak = CYBORG. Two identifiers, and both are silhouette rather than print:
//   1. THE SHOULDER CANNON replaces the left arm outright -- a 15-unit barrel
//      raked up to the frame edge with a ringed muzzle. It is the only arm in
//      the app that is not an arm, so the cut-out separates this figure from
//      the other three heroes before any colour is involved.
//   2. THE HEAD IS SPLIT DOWN THE MIDDLE. Dark human half with one pale eye
//      slit, steel half with a red optic ring, and a 2-unit seam between them.
//      Half a face is the character.
// Bulk is the third mark: chunky pauldrons over both shoulders make this the
// widest-shouldered non-boss hero, against Batman's cape width and Flash's
// stride width, so the three ordinary heroes are wide in three different ways.
// No cape and no gold; the trim hue is the tech cyan, which is also the plate
// border, and gold staying absent here is fine -- axis (b) says no VILLAIN has
// gold, not that every hero must.
export function dcCloak({
  bodyColor = '#9aa6b8',
  accent = '#242c3a',
  skinColor = '#6d4a35',
  techColor = '#3fc9f0',
  opticColor = '#e83a2c',
  emblem = 'OA',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="33" ry="3.4" fill="#000" opacity="0.13"/>

      <g transform="translate(30,66) rotate(245)">
        <rect x="-2" y="-8.5" width="24" height="17" rx="3" fill="${bodyColor}"/>
        <rect x="-2" y="4" width="24" height="4.6" rx="2.2" fill="#c8d1dc"/>
        <rect x="4" y="-12" width="14" height="8" rx="2" fill="${accent}"/>
        <rect x="20" y="-10.5" width="7" height="21" rx="2" fill="${accent}"/>
        <rect x="26" y="-7" width="3.5" height="14" rx="1.6" fill="${bodyColor}"/>
        <circle cx="23.5" cy="0" r="5.6" fill="${accent}"/>
        <circle cx="23.5" cy="0" r="3.4" fill="${techColor}"/>
        <rect x="7" y="-7" width="3" height="14" fill="${accent}" opacity="0.5"/>
      </g>

      ${legoArm(89, 60, 99, 77, 93, 90, bodyColor, 11)}
      <rect x="87" y="82" width="12" height="3.6" fill="${techColor}"/>
      ${legoHand(92, 94, accent, 5, -60)}

      ${legoLeg(37, 106, 19, 29, bodyColor, accent, 11)}
      ${legoLeg(64, 106, 19, 29, bodyColor, accent, 11)}
      <rect x="40" y="112" width="13" height="3.4" fill="${techColor}"/>
      <rect x="67" y="112" width="13" height="3.4" fill="${techColor}"/>
      <path d="M 37,96 L 83,96 L 83,109 L 63,109 L 60,113 L 57,109 L 37,109 Z" fill="${accent}"/>

      <path d="M 33,60 Q 33,54 39,54 L 81,54 Q 87,54 87,60 L 83,98 L 37,98 Z" fill="${bodyColor}"/>
      <polygon points="34.2,57 44,54 40.5,98 37,98" fill="${accent}" opacity="0.5"/>
      <polygon points="85.8,57 76,54 79.5,98 83,98" fill="${accent}" opacity="0.5"/>
      <rect x="44" y="54.5" width="32" height="3.4" fill="${techColor}"/>

      <polygon points="22,50 39,48 40,66 20,68" fill="${bodyColor}"/>
      <polygon points="22,50 39,48 39,53 21,55" fill="${accent}"/>
      <polygon points="100,50 81,48 79,64 102,66" fill="${bodyColor}"/>
      <polygon points="100,50 81,48 81,53 101,55" fill="${accent}"/>

      <rect x="37" y="87" width="46" height="9" fill="${accent}"/>
      <rect x="54" y="85" width="12" height="12" rx="2" fill="${techColor}"/>
      ${emblemPlate(EMBLEM_BOX.cloak, emblem, techColor)}

      <rect x="53" y="43" width="14" height="13" fill="${accent}"/>

      <path d="M 47,14 L 60,14 L 60,48 L 47,48 Q 42,48 42,43 L 42,19 Q 42,14 47,14 Z" fill="${skinColor}"/>
      <path d="M 60,14 L 73,14 Q 78,14 78,19 L 78,43 Q 78,48 73,48 L 60,48 Z" fill="${bodyColor}"/>
      <rect x="62" y="15.5" width="14" height="5" rx="2" fill="#c8d1dc"/>
      <polygon points="60,21 78,19 78,26 60,27" fill="${accent}"/>
      <circle cx="69" cy="32" r="6.8" fill="${accent}"/>
      <circle cx="69" cy="32" r="4.9" fill="${opticColor}"/>
      <circle cx="69" cy="32" r="1.8" fill="#ffe9cf"/>
      <circle cx="75.5" cy="40" r="1.9" fill="${accent}"/>
      <polygon points="44,23 57,21 57,25 44,27" fill="#2b1a12"/>
      ${slit(50, 32, 11, 6.4, 1.6, '#efe7dc')}
      <circle cx="50" cy="32" r="2.1" fill="#2b1a12"/>
      <rect x="59" y="14" width="2.2" height="34" fill="${accent}"/>
      <rect x="49" y="41.4" width="22" height="2.6" rx="1.2" fill="${accent}"/>
    </g>
  `
  )
}

// Nightray = SUPERMAN, the chapter-7 boss and the combined form.
// WHAT MAKES IT READ AS THE FINAL FORM, and it is deliberately not "more
// area": the chapter-4 family already proved that buying size with overlapping
// mass just smears the silhouette. Four clear shapes instead:
//   - THE ONLY UNMASKED FACE IN THE FAMILY, with black hair and a widow's
//     peak. Every other figure here is a mask or a machine, so the face alone
//     marks rank.
//   - THE CHEST SHIELD. A gold pentagon behind the plate, with the plate's
//     border switched to cape red: gold rim, red frame, cream field, letter.
//     The pentagon's bottom point clears the plate by 5 units, which is the
//     part that actually reads at 96 px. This is also the cleanest solution to
//     the emblem problem in the whole file -- Superman's chest is a plate with
//     a symbol in it by design.
//   - TWO CAPE LOBES SWEPT UP TO THE TOP CORNERS with a deep centre notch at
//     (60,86). Up-and-out, not down: down puts the cape over the legs and the
//     cut-out becomes one bell. The notch keeps the centre channel open.
//   - HANDS ON HIPS. Elbows pushed out to x=12/108 open an 11-unit hole
//     between each arm and the torso for twenty rows, and the pose is
//     symmetric, which is hero axis (d). Raised fists were tried first and
//     they landed inside the up-swept cape, contributing nothing.
// Biggest in every dimension: head 40x36, torso 66 at the shoulders, plate
// w=44, legs 24 wide.
export function dcNightray({
  bodyColor = '#1c48c0',
  accent = '#12307f',
  capeColor = '#c8252c',
  liningColor = '#8f1a20',
  hairColor = '#14161f',
  skinColor = '#f0c49e',
  emblem = '★',
} = {}) {
  const capeLobe = `
      <path d="M 38,50 L 3,12 L 11,40 L 2,50 L 8,80 ${scallop(8, 80, 32, 106, 2, 8)} L 60,86 L 58,50 Z" fill="${capeColor}"/>
      <path d="M 43,53 L 17,30 L 21,48 L 14,55 L 20,78 ${scallop(20, 78, 36, 98, 1, 6)} L 60,84 L 57,53 Z" fill="${liningColor}"/>
      ${shade(`M 43,53 L 17,30 L 21,48 L 14,55 L 20,78 ${scallop(20, 78, 36, 98, 1, 6)} L 60,84 L 57,53 Z`, 0.28)}`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="137" rx="40" ry="2.6" fill="#000" opacity="0.15"/>

      ${capeLobe}
      ${mirrored(capeLobe)}
      <polygon points="44,40 76,40 90,58 30,58" fill="${capeColor}"/>

      ${legoArm(25, 63, 12, 80, 30, 93, bodyColor, 12.5)}
      ${legoArm(95, 63, 108, 80, 90, 93, bodyColor, 12.5)}
      ${legoHand(31, 97, skinColor, 5.6, -150, 3.8)}
      ${legoHand(89, 97, skinColor, 5.6, -30, 3.8)}

      ${legoLeg(32, 111, 24, 25, bodyColor, capeColor, 12)}
      ${legoLeg(64, 111, 24, 25, bodyColor, capeColor, 12)}
      <path d="M 31,98 L 89,98 L 89,114 L 64,114 L 60,119 L 56,114 L 31,114 Z" fill="${capeColor}"/>

      <path d="M 27,62 Q 27,55 34,55 L 86,55 Q 93,55 93,62 L 89,100 L 31,100 Z" fill="${bodyColor}"/>
      <polygon points="28.4,58 40,55 35.5,100 31,100" fill="${accent}" opacity="0.42"/>
      <polygon points="91.6,58 80,55 84.5,100 89,100" fill="${accent}" opacity="0.42"/>
      <path d="M 30.5,58 Q 35,66 32,74" stroke="${accent}" stroke-width="1.5" fill="none" opacity="0.7"/>
      <path d="M 89.5,58 Q 85,66 88,74" stroke="${accent}" stroke-width="1.5" fill="none" opacity="0.7"/>

      <polygon points="31,58 89,58 89,76 60,94 31,76" fill="${GOLD}"/>
      ${emblemPlate(EMBLEM_BOX.nightray, emblem, capeColor)}
      <rect x="33" y="99" width="54" height="7" fill="${GOLD}"/>
      <rect x="53" y="97" width="14" height="11" rx="2" fill="${accent}"/>

      <rect x="52" y="42" width="16" height="14" fill="${skinColor}"/>

      ${legoBlock(40, 12, 40, 36, skinColor)}
      <path d="M 40,32 Q 40,12 47,12 L 73,12 Q 80,12 80,32 L 71,24 L 60,34 L 49,24 Z" fill="${hairColor}"/>
      <polygon points="60,34 66,28 62,39" fill="${hairColor}"/>
      <polygon points="45,28 55,29.5 55,31.5 45,30.5" fill="${hairColor}"/>
      <polygon points="75,28 65,29.5 65,31.5 75,30.5" fill="${hairColor}"/>
      <ellipse cx="50" cy="34.5" rx="2.6" ry="3" fill="${hairColor}"/>
      <ellipse cx="70" cy="34.5" rx="2.6" ry="3" fill="${hairColor}"/>
      <path d="M 52,42 Q 60,46.5 68,42" stroke="#a8674a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
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
//
// THIRD ROUND -- THE ILLUSION HAD A NECK AND THE REAL HEAD DID NOT. The head
// circle bottomed out at y=45.5 against a torso starting at y=46, so a
// component scan returned the head (506u2) as its own piece. Half a unit is
// invisible at every render size the app uses, which is why nobody caught it
// by eye, but it is the same defect class the user reported on Gridlock and it
// is one edge-case antialiasing away from showing. The head moved up 4 units
// and got the same tapering column the illusion has. Cost, recorded because it
// is a real one: the gap between the two heads' outlines drops 16.5 -> 14.8
// units, so the "which one is real" read is slightly tighter than it was.
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

      <polygon points="44,37 56,37 57,50 43,50" fill="${accent}"/>

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

      <circle cx="50" cy="30" r="11.5" fill="${bodyColor}"/>
      <path d="M 38.5,28 A 11.5,11.5 0 0 1 61.5,28 Z" fill="${accent}"/>
      ${eyePlate(50, 33, 17, 8, shimmerColor, '#25081c', '#eaffff', 1.5)}
      <polygon points="39,22 47,24 33,7" fill="${accent}"/>
    </g>
  `
  )
}

// Gridlock. The jam: a traffic-signal box for a head and a diamond-mesh
// barrier strung between two outstretched fists across the whole lower frame.
// The mesh is diamonds rather than squares on purpose -- a square grid reads
// as a hash mark, and this family already risks being misread as letters.
//
// THIRD ROUND -- THE USER SAW THIS ONE AND SAID THE HEAD WAS COMING OFF, and
// it was literally true, not a matter of taste. A 4-connected component scan
// of the hard cut-out returned TWO PARTS: the signal box 1177u2 at y[10,50]
// and everything else 5766u2 at y[52,137], with 2.0 units of COMPLETELY EMPTY
// ROWS at y=50..52 running the full width of the frame. The box was not
// resting on anything. Three things came out of that:
//
//  1. THE HEAD NOW HAS A MAST TO SIT ON. The signal box moved up 5 units
//     (y 14..50 -> 8..45, contents with it) purely to buy room, because the
//     net's top rail is at y=54 and the shoulder line at y=52, so there was
//     nowhere else for a neck to go. The mast spans y 40..57, which puts it
//     4 units under the box and 5 units under the torso: overlap on both
//     ends is what makes the figure ONE component instead of two, and the
//     overlap is deliberate margin, not a touching pair of edges.
//  2. SEVEN UNITS OF IT SHOW, and the bolt-on bracket plate is inside those
//     seven. A neck that exists in code but is swallowed by the union of head
//     and torso measures zero, which is what happened three times in the Mario
//     family; the number here is measured off the row-width profile, not
//     assumed.
//  3. THE ARMS WERE A HORIZONTAL BAR. Fists (x4-18) + arms + torso (x34-86) +
//     arms + fists (x102-116) added up to a SOLID 100% run across rows
//     y=60..74 -- the profile read fill=112u out of a 112u span, i.e. fifteen
//     rows carrying no shape information at all. They now have a shoulder ball
//     drawn AFTER the torso (outer arc = the shoulder, inner arc = the armhole
//     seam: the chapter-5 fix for this exact defect), an elbow below the
//     shoulder-to-fist line, and a taper, 11 wide on the upper arm and 9 on
//     the forearm. The joints are bolted plates rather than organic deltoids
//     because this figure is a traffic machine.
//
//     DO NOT EXPECT THE FRAGMENTATION INDEX TO CONFIRM THIS -- IT GOES THE
//     WRONG WAY, and the reason is measurable rather than mysterious. Whole
//     figure: 37.0 -> 34.3. A per-10-unit-band census locates every unit of
//     it: the neck band gains (y50-60: 0.0 -> 1.3, the shoulder caps flanking
//     the mast) and the arm bands lose (y60-70: 2.0 -> 0.0, y70-80: 4.0 ->
//     2.0). An articulated arm is BULKIER than a bar of the same reach, so it
//     covers mesh-only air that used to count as a gap. The index rewards
//     holes, not articulation -- the same lesson Mirage recorded one figure
//     over. The measure that does track this is the body with the net
//     stripped, where edge-to-edge solid rows fall 5.8 -> 2.8 and
//     fragmentation rises 39.3 -> 41.3. Judge the arms there, or by eye.
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

      <polygon points="53,40 67,40 69,57 51,57" fill="${bodyColor}"/>
      <polygon points="60,40 67,40 69,57 60,57" fill="${accent}"/>
      <rect x="49.5" y="45.6" width="21" height="3.2" fill="${barColor}"/>

      <polygon points="34,52 86,52 80,96 40,96" fill="${bodyColor}"/>
      <rect x="36" y="60" width="48" height="6" fill="${accent}"/>
      <rect x="36" y="72" width="46" height="6" fill="${accent}"/>
      <rect x="37" y="84" width="44" height="6" fill="${accent}"/>
      <polygon points="34,52 86,52 84,58 36,58" fill="${barColor}"/>

      <path d="M 37,59 L 25,70" stroke="${bodyColor}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <path d="M 83,59 L 95,68" stroke="${bodyColor}" stroke-width="11" fill="none" stroke-linecap="round"/>
      <path d="M 25,70 L 14,67" stroke="${bodyColor}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <path d="M 95,68 L 106,67" stroke="${bodyColor}" stroke-width="9" fill="none" stroke-linecap="round"/>
      <circle cx="25" cy="70" r="6.2" fill="${bodyColor}"/>
      <circle cx="95" cy="68" r="6.2" fill="${bodyColor}"/>
      <circle cx="25" cy="70" r="2.1" fill="${accent}"/>
      <circle cx="95" cy="68" r="2.1" fill="${accent}"/>
      <circle cx="37" cy="59" r="8.2" fill="${bodyColor}"/>
      <circle cx="83" cy="59" r="8.2" fill="${bodyColor}"/>
      <path d="M 39.7,53.1 A 6.5,6.5 0 0 1 39.7,64.9" stroke="${accent}" stroke-width="1.8" fill="none"/>
      <path d="M 80.3,53.1 A 6.5,6.5 0 0 0 80.3,64.9" stroke="${accent}" stroke-width="1.8" fill="none"/>
      <circle cx="37" cy="59" r="2.4" fill="${accent}"/>
      <circle cx="83" cy="59" r="2.4" fill="${accent}"/>
      <polygon points="4,60 18,60 18,74 4,74" fill="${accent}"/>
      <polygon points="116,60 102,60 102,74 116,74" fill="${accent}"/>

      ${mesh}
      <rect x="6" y="54" width="108" height="4" fill="${accent}"/>
      <rect x="6" y="98" width="108" height="4" fill="${accent}"/>

      <polygon points="46,8 74,8 74,45 46,45" fill="${accent}"/>
      <polygon points="46,8 74,8 76,4 44,4" fill="${bodyColor}"/>
      <polygon points="42,14 46,14 46,20 42,20" fill="${bodyColor}"/>
      <polygon points="78,14 74,14 74,20 78,20" fill="${bodyColor}"/>
      <circle cx="54" cy="19" r="5.2" fill="${lampColor}"/>
      <circle cx="66" cy="19" r="5.2" fill="${lampColor}"/>
      <circle cx="54" cy="19" r="2.2" fill="${accent}"/>
      <circle cx="66" cy="19" r="2.2" fill="${accent}"/>
      <circle cx="60" cy="35.5" r="5.4" fill="${bodyColor}"/>
      <rect x="47" y="26.2" width="26" height="2.6" fill="${barColor}"/>
    </g>
  `
  )
}

// Floodlight. The blinder: the head is a tilted bank of six stadium lamps in
// a frame, its two centre lamps doubling as eyes, and a hard glare wedge
// falls across the lower-left of the frame. Broad and short so it reads as a
// machine on legs next to the tall lean heroes.
// The overhanging visor hood on top of the frame is load bearing: without it
// the cut-out reads "television head", which is a different joke. IT WAS ALSO
// FLOATING: its bottom edge ran 2.7-3.3 units clear of the lamp frame's top
// edge all the way across, so a component scan of the cut-out returned the
// hood (561u2) as a separate piece -- the same defect the user reported on
// Gridlock, one figure over. Dropped 5 units so the edges overlap by 1.7-2.3.
// The lamps set the floor on that number: the hood's underside now clears the
// three top lamp rims by 0.8-0.9 units and must not be dropped further.
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
      <polygon points="36,22 94,14 96,7 34,15" fill="${accent}"/>
      <polygon points="34,15 96,7 96,11 36,19" fill="${bodyColor}"/>
      <polygon points="20,25 34,15 36,22 24,33" fill="${accent}"/>
    </g>
  `
  )
}


// Nightfall = THE JOKER, chapter-7's boss villain and the only minifig on the
// villain side. Read order: green mane -> white face -> the grin, then the
// purple tailcoat.
// THE GRIN IS THE CHARACTER AND IT IS SIZED LIKE IT. 32 units wide across a
// 36-unit head, so at the 96 px chapter card it is still 26 px of red. Every
// other feature on this face is subordinate to it.
// HOW THE FOUR HERO/VILLAIN AXES SURVIVE A CHARACTER WHOSE FACE IS WHITE:
//   a. HUE. Purple 274 and green 133 -- outside every hero body hue (Batman
//      grey, Flash red 357, Cyborg steel + cyan 194, Superman blue 222). The
//      restated axis is primary vs secondary and the Joker is the clearest
//      case of the secondary side in the file.
//   b. NO GOLD anywhere on him.
//   c. CREAM. The greasepaint is #fbfbfb, deliberately NOT `CREAM` (#f7f3e6),
//      so the hero plate tone stays unique and greppable. More importantly the
//      white is on the HEAD, which is where every other villain in this file
//      already keeps its bright (Blackout's lamp cowl, Floodlight's lamp bank,
//      Mirage's eye plates). His torso is purple, green and red with no light
//      value on it at all, and the neck is drawn UNDER the coat so no white
//      reaches the torso. The axis is intact as written.
//   d. STANCE. Coat shoulders tilted (left y=55, right y=50), one arm up with
//      fanned cards and one down, mane lopsided (left spikes stop at x=28, the
//      right ones run to x=106), and BOTH coattails end in `jagged()` teeth.
// The fanned cards are the prop, and they are cards rather than the cane or
// the crowbar for a measured reason: a thin held stick reads as a pole or a
// fishing rod, which is the exact failure the `beam` rim was invented to cure
// one family over. Three overlapping rectangles at three angles cannot.
// Size: this has to stay the biggest villain (the previous round's fix), so the
// coat, tails, mane and raised arm are all sized against Floodlight's 7919.
export function dcNightfall({
  bodyColor = '#6d2fb0',
  accent = '#3c1470',
  vestColor = '#2fa84f',
  hairColor = '#3ecf5f',
  faceColor = '#fbfbfb',
  grinColor = '#d8243f',
  eyeColor = '#1b0a22',
} = {}) {
  const card = (rot) =>
    `<g transform="rotate(${rot} 16 24)"><rect x="11.5" y="9" width="9" height="14" rx="1.2" fill="${faceColor}"/><polygon points="16,12.8 18.4,16 16,19.2 13.6,16" fill="${grinColor}"/></g>`

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="30" ry="3.2" fill="#000" opacity="0.14"/>

      <path d="M 30,82 L 52,90 L 48,120 ${jagged(48, 120, 16, 130, 2, 8)} Z" fill="${accent}"/>
      <path d="M 92,80 L 68,89 L 72,118 ${jagged(72, 118, 104, 128, 2, 8)} Z" fill="${accent}"/>

      ${legoArm(31, 58, 22, 44, 18, 30, bodyColor, 11)}
      ${legoHand(17, 26, vestColor, 5, -100)}
      ${card(-24)}${card(0)}${card(24)}
      ${legoArm(91, 56, 104, 72, 100, 87, bodyColor, 11)}
      ${legoHand(100, 91, vestColor, 5, -60)}

      ${legoLeg(38, 108, 18, 26, bodyColor, eyeColor, 9)}
      ${legoLeg(64, 108, 18, 26, bodyColor, eyeColor, 9)}
      <path d="M 34,98 L 88,98 L 88,111 L 64,111 L 60,115 L 56,111 L 34,111 Z" fill="${accent}"/>

      <rect x="53" y="42" width="14" height="14" fill="${faceColor}"/>

      <path d="M 27,60 Q 27,53 35,54 L 85,48 Q 93,47 93,55 L 90,100 L 32,100 Z" fill="${bodyColor}"/>
      <polygon points="52,53 69,51 66,98 55,98" fill="${vestColor}"/>
      <polygon points="50,53 60,86 39,56" fill="${accent}"/>
      <polygon points="71,50 60,86 81,54" fill="${accent}"/>
      <polygon points="58,53 64,52.5 62,74 59,74" fill="${grinColor}"/>
      <polygon points="32,100 90,100 90,105 32,105" fill="${accent}"/>

      <polygon points="50,18 34,7 46,25" fill="${hairColor}"/>
      <polygon points="46,23 28,20 46,32" fill="${hairColor}"/>
      <polygon points="46,31 32,42 50,38" fill="${hairColor}"/>
      <polygon points="70,17 98,2 74,24" fill="${hairColor}"/>
      <polygon points="74,22 106,20 74,32" fill="${hairColor}"/>
      <polygon points="74,30 102,42 70,38" fill="${hairColor}"/>
      ${legoBlock(42, 14, 36, 34, faceColor)}
      <path d="M 42,32 Q 42,13 60,13 Q 78,13 78,30 L 70,24 L 60,30 L 50,24 Z" fill="${hairColor}"/>
      <polygon points="44,21 58,25 58,27.5 44,24" fill="${eyeColor}"/>
      <polygon points="76,20.5 62,24.5 62,27 76,23.5" fill="${eyeColor}"/>
      ${slit(51, 31, 11, 5.4, 1.8, eyeColor)}
      ${slit(69, 31, 11, 5.4, -1.8, eyeColor)}
      ${slit(51, 31, 4, 2.4, 1.8, hairColor)}
      ${slit(69, 31, 4, 2.4, -1.8, hairColor)}
      <path d="M 44,34 Q 60,55 76,34 Q 60,45 44,34 Z" fill="${grinColor}"/>
    </g>
  `
  )
}
