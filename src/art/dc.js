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
//          Batman 219 (s=0.16), Flash 358 (s=0.73), Cyborg 216 (s=0.17),
//          Superman 224 (s=0.75). Villain body hues: Blackout 259, Mirage 322,
//          Gridlock 75, Floodlight 19, Joker 269 + green mane 134. NO VILLAIN
//          SITS IN THE HERO AZURE BAND, which is the load-bearing half.
//          CORRECTION, MEASURED: this note used to add "and none is within 39
//          degrees of Flash's red", and that was simply wrong -- Floodlight's
//          rust at hue 19 is 21 degrees off Flash's 358, the tightest pair in
//          the file. What actually separates them is saturation and value
//          (0.66/0.33 against 0.73/0.47), so the pair reads brown-against-red
//          rather than red-against-red, and that is a weaker guarantee than
//          hue distance. It is the pair to re-check if either is recoloured.
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
// ALL NINE ARE MINIFIGS. The round that introduced this build only converted
// the five characters the user named by name and left Blackout / Mirage /
// Gridlock / Floodlight (stages 7-1 to 7-4) on the older lean-adult build,
// recording "four thin grown-ups sharing a chapter card with five toys" as its
// most visible cost. The user's ruling on that was "matching the style within
// a chapter would be nice, but it is not a big problem", so the four were
// converted on a low budget with a hard rule attached: NO IDENTIFIER MAY BE
// TRADED FOR THE PROPORTION. Nothing had to be traded, because each of the
// four identifiers is headgear or a prop and that is exactly the axis a
// minifigure differentiates on -- see the note above the villain block. The
// five approved figures are byte-identical, in source and in emitted SVG, for
// every chapter-7 label.
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
//  - THE MINIFIG VILLAINS COST TWO SILHOUETTE BREAKS, and both were paying for
//    the hero/villain split rather than for the character. Blackout was
//    LEGLESS (a flared robe), which was the sharpest anatomy break in the
//    file; Floodlight was SHORT AND BROAD against tall lean heroes. Both are
//    gone by design, so the split now rests entirely on the four colour and
//    stance axes and not at all on build. Neither character's read depended on
//    it: a streetlamp is identified by its lamp and a floodlight by its bank,
//    and both are the head.
//  - MEASURE THE SIZE LADDER AFTER ANY VILLAIN EDIT. The minifig build is
//    denser than the lean one, so all four grew by 700-1500 units and
//    Floodlight briefly passed the Joker (8709 against 8647), which breaks
//    "the boss villain is the biggest villain". It was bought back by
//    narrowing the lamp bank, dropping a decorative hose and leaving the
//    jagged hem off this one figure; the margin is now 398 units and it is the
//    tightest number in the file.
//  - THE JAGGED HEM ONLY EXISTS IF IT LEAVES THE HIP BLOCK. Teeth drawn inside
//    x 37..83 are invisible the moment colour is removed. See `villainHem`.
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
//
// TILT SIGN, checked against `slit()`'s own point order (not assumed): for
// the left lens (cx - off), `l` is the OUTER point and `r` is the INNER one,
// and `slit` puts `+tilt` on `l`'s corners and `-tilt` on `r`'s -- so a
// POSITIVE tilt here lowers the outer corner and raises the inner one, i.e.
// droops outward. This function used to pass +1.5*scale to the left lens and
// -1.5*scale to the right one, which is that droop on both eyes (confirmed
// by rendering it before this fix -- both lenses sloped down toward the
// temples, a sad-eyed read, not the angled-up cowl slit the comment always
// claimed). The signs below are swapped from that original so the OUTER
// corner is raised on both sides instead.
function lenses(cx, cy, color = CREAM, scale = 1) {
  const w = 9 * scale
  const h = 5.6 * scale
  const off = 6.2 * scale
  return slit(cx - off, cy, w, h, -1.5 * scale, color) + slit(cx + off, cy, w, h, 1.5 * scale, color)
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
      font-size="${size.toFixed(1)}" font-weight="800" fill="${textColor}" style="transform-origin:${cx}px 0">${text}</text>`
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
// Gridlock's 34.3, on the figure the child sees for two whole stages. A
// minifig has only two natural holes (the 8-unit leg gap and the C-hand
// rings, and the rings are under the index's 6-unit threshold), so a cape
// that covers the arms leaves the leg gap as the ONLY articulation. Two
// changes bought it back:
//   - the cape is 64 wide at the collar, unchanged from the original fix.
//   - the elbows swing out to x=16/104, clear of the tapering cape edge, so
//     twenty-five rows carry real background between each arm and the body.
// The hem keeps a DEEP CENTRE NOTCH with its apex at (60,100): earlier rounds
// of this character failed the cut-out because a hem spanning the frame below
// y=100 fills the gap between the legs and the figure reads "in a dress". The
// notch lines the open channel up with the leg gap for 26 rows. Do not close
// either one, and do not widen the hem back out.
//
// THE HEM WAS RE-CUT: it used to taper INWARD as it fell (64 wide at the
// collar narrowing to a hem that ended up level with -- in places narrower
// than -- the torso and legs beneath it), so from the shoulders down the cape
// contributed nothing to the front silhouette at all: no peekout beside the
// torso, no peekout beside the legs, just a plain suit with a dark collar
// flare at the neck. That is the exact user complaint ("the cape doesn't
// look attached to the back") and it is why RENDERING THE FUNCTION AND
// LOOKING AT IT matters more than trusting this comment block -- the
// previous round's claim that it "still shows 5 units outboard of the torso"
// was checked here and was wrong; the arms' own shoulder caps (drawn right at
// the torso edge) swallowed that sliver every time.
// The hem now WIDENS instead of narrowing below y=104 (safely under the
// C-hand ring, whose outer radius reaches x=~31/89 at worst -- push the
// widen point higher than that and the cape overlaps the ring, which turns
// the hand's open "hole" into filled cape colour in a hard cut-out and the
// ring stops reading as a ring), flaring out to x=20/100 and running down to
// y=128, well outside the legs (x=37/83). That is the only part of the
// figure below the shoulders where the cape was ever going to be visible
// beside a hero built this narrow, and it is now the dominant read: two dark
// wings flanking the legs in both colour and hard cut-out.
// MEASURED COST: fragmentation index 55.5 -> 54.0 (rasterised via
// `_dc-scan.html`, gapUnits=6, k=4) -- filling part of the old arm/hip
// background with cape trades away a little of that gap's credit. Clipping
// stayed clean (0 overflow, `_dc-scan.html` section 1) and the cape's own
// mid-section (y 80-104, beside the hand) is DELIBERATELY LEFT CLOSE TO THE
// OLD POSITION (x 34->37, barely tapering) rather than swung wide there too --
// an earlier attempt at this fix pushed the whole hem outward starting right
// at the shoulder and cost 55.5 -> 47.3, because it ate directly into the
// hand-ring clearance zone the old build depended on. Widen only below y=104.
//
// SIZE PASS: the user asked for the cape bigger after the above round fixed
// only its attachment (it was reading as detached, not as small). The
// pre-widen point (37,104 / 83,104) is UNCHANGED -- that is still the C-hand
// ring boundary from the paragraph above and moving it costs the same 47.3
// regression. Everything below y=104 is free to grow, so both wing tips
// swing out from x=20/100 to x=14/106 (six units per side, tip-to-tip 92 of
// the 120-unit frame, 14 units of margin on each side -- nowhere near clip)
// and the hem drops from y=128 to y=133 (the scallop's own curve peaks at
// y=133.2, checked by sampling the quadratic bezier at 1000 steps rather than
// trusting the endpoint, and the shadow ellipse at cy=136 still clears it by
// 2.8 units). Lining and shade share the same path string with the family's
// usual inset (the lining point is the outer point plus the fixed offset that
// already existed between the two paths here, e.g. the tip offset was
// +4/-6 and stays +4/-6 off the new outer tip) so the two-tone edge and the
// dark wash keep tracking the bigger shape instead of the old one peeking out
// from under it.
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

      <path d="M 28,48 L 34,80 L 37,104 L 14,126 ${scallop(14, 126, 28, 133, 1, 5)} L 60,100 L 92,133 ${scallop(92, 133, 106, 126, 1, 5)} L 83,104 L 86,80 L 92,48 Z" fill="${capeColor}"/>
      <path d="M 34,51 L 39,80 L 41,100 L 18,120 ${scallop(18, 120, 30, 127, 1, 4)} L 60,96 L 90,127 ${scallop(90, 127, 102, 120, 1, 4)} L 79,100 L 81,80 L 86,51 Z" fill="${liningColor}"/>
      ${shade(`M 34,51 L 39,80 L 41,100 L 18,120 ${scallop(18, 120, 30, 127, 1, 4)} L 60,96 L 90,127 ${scallop(90, 127, 102, 120, 1, 4)} L 79,100 L 81,80 L 86,51 Z`, 0.3)}
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
//
// THE HUMAN EYE DOES NOT GO THROUGH `lenses()` -- it is one asymmetric slit,
// drawn by hand -- so it carried the same droop bug independently and had to
// be fixed independently. Outward (toward the temple, x=44) used to sit lower
// than inward (toward the seam, x=57), on both the eyebrow and the eye slit;
// both are flipped now so the outward corner is the raised one, matching the
// fix in `lenses()`.
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
      <polygon points="44,21 57,23 57,27 44,25" fill="#2b1a12"/>
      ${slit(50, 32, 11, 6.4, -1.6, '#efe7dc')}
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
//
// ALL FOUR ORDINARY VILLAINS ARE NOW MINIFIGURES TOO. The previous round left
// them on the older lean-adult build and recorded it as that round's most
// visible cost: four thin grown-ups sharing a chapter card with five toys.
// The user's ruling was "matching the style within a chapter would be nice,
// but it is not a big problem", so this round spends exactly as much as that
// buys and no more:
//   - The BUILD is now shared with the heroes and with the Joker: the same
//     36x34 block head, the same 14-unit neck, the same 54-unit trapezoid
//     torso, round-capped tube arms, C-clip hands, the hip block with its
//     crotch notch, and two short legs with the 8-unit gap and a boot band.
//   - EACH VILLAIN'S IDENTIFYING PART BECAME HEADGEAR OR A PROP, which is how
//     the real toy differentiates figures and is why nothing had to be given
//     up: Blackout's lamp cowl, Gridlock's signal gantry and Floodlight's
//     six-lamp bank are all helmets wider than the head they sit on, exactly
//     as Batman's ears and Flash's ear-bolts are.
//   - THE FOUR HERO/VILLAIN AXES ARE UNCHANGED, and half of axis (d) got
//     STRONGER: the TILT is now universal, because all four go through
//     `villainTorso`. Gridlock and Floodlight were both perfectly symmetric
//     trapezoids before, which was a quiet hole in the axis. The JAGGED HEM
//     is still only on Blackout, Mirage and the Joker -- the same three as
//     before -- and that is deliberate, not an oversight: Gridlock's hem rows
//     are where the mesh's bottom rail runs, and Floodlight cannot afford the
//     ~230 units of area (see its own note; the boss villain has to stay the
//     largest villain and the margin is 280 units).
// The five hard-won fixes carried by the old build were re-earned rather than
// inherited, and the notes on each function say how.
// ---------------------------------------------------------------------------

// The villain torso: the hero trapezoid with the shoulder line tilted. Same
// 54-unit shoulder span and the same taper, so a villain standing next to a
// hero is visibly the same toy -- that is the whole point of this round --
// while the tilt is hero/villain axis (d) and survives the hard cut-out.
// `lift` raises the right shoulder. Drawn AFTER the arms, like every hero
// here, so the shoulder caps become shoulders and the visible arm starts at
// the body edge.
function villainTorso(bodyColor, accent, lift = 5) {
  const l = 55
  const r = 55 - lift
  return `
    <path d="M 33,${l + 6} Q 33,${l} 39,${l} L 81,${r} Q 87,${r} 87,${r + 6} L 83,98 L 37,98 Z" fill="${bodyColor}"/>
    <polygon points="34.2,${l + 3} 44,${l} 40.5,98 37,98" fill="${accent}" opacity="0.45"/>
    <polygon points="85.8,${r + 3} 76,${r} 79.5,98 83,98" fill="${accent}" opacity="0.45"/>
    <polygon points="37,${l + 2} 81,${r + 2} 81,${r + 6} 37,${l + 6}" fill="${accent}" opacity="0.85"/>`
}

// The villain hem, IN TWO SIDE PANELS RATHER THAN ONE BAND, squeezed between
// two constraints that both cost a round to find:
//  - A HEM THAT SPANS THE FRAME FILLS THE 8-UNIT LEG GAP and the figure reads
//    "wearing a dress" -- the failure Batman's cape paid for two hundred lines
//    up -- and the leg gap is one of only two natural holes a minifigure has.
//    So there are no teeth over the crotch channel and it stays open to the
//    floor.
//  - BUT TEETH DRAWN OVER THE LEGS AND THE HIP BLOCK DO NOT EXIST IN THE
//    CUT-OUT. The first version ran x 34..53 / 67..86 with 5-unit teeth,
//    entirely inside the hip block's own x 37..83 and above the leg tops, so
//    it measured as decoration and vanished the moment colour was removed --
//    which is precisely where hero/villain axis (d) has to be readable. The
//    panels now start 7 units outboard of the hip block and the teeth run to
//    y=114, past the block's y=109, so on each side the outer tooth is real
//    background against a real point.
function villainHem(color, depth = 10) {
  const panel = (x0, x1) =>
    `<path d="M ${x0},92 L ${x1},92 L ${x1},104 ${jagged(x1, 104, x0, 104, 3, depth)} Z" fill="${color}"/>`
  return panel(30, 52) + panel(68, 90)
}

// The shared hip block with its crotch notch, so all nine figures separate
// into legs at the same row.
function villainHip(color) {
  return `<path d="M 37,96 L 83,96 L 83,109 L 63,109 L 60,113 L 57,109 L 37,109 Z" fill="${color}"/>`
}

// Blackout. The dead streetlamp: a wide hooded lamp cowl for headgear and a
// dead cracked bulb gripped in each C-clip hand.
//
// THIS FIGURE ONCE READ AS THE LETTER `I` AND THAT MUST NOT COME BACK.
// The original was a 52-unit lamp head on a 22-unit vertical post over a
// 56-unit flared foot, perfectly symmetric: that is a serif capital I, and
// Blackout is the stage-1 villain of the chapter that teaches AI, so `I` is a
// letter the child is hunting for on that very screen. The cure was three
// properties and the minifigure build keeps all three -- but it keeps them
// for DIFFERENT reasons than the robe did, so they are restated here:
//   1. NO THIN STEM UNDER A WIDE BAR. Brim 66 across, cowl 52 tapering to 33,
//      shoulders 54, where a capital I's stem is about a fifth of its bar.
//      THE COWL IS A TAPERED TRAPEZOID, NOT A BLOCK UNDER A SLAB, and that is
//      a correction inside this round: a 34-wide block head under a 64-wide
//      brim put a 30-unit step in the profile and the cut-out read as a mallet
//      -- one bar over one narrow post, which is the first half of the letter
//      the whole redraw exists to avoid. The taper is also the more literal
//      street lamp: wide flat top, cone, lens at the bottom.
//   2. THE WIDEST ROW IS NOT THE LAST ROW. It is the cowl, at the top. The
//      minifigure gives this for free and gives a second reason with it: the
//      bottom row is not a bar at all, it is TWO legs with an 8-unit gap, and
//      a serif I's foot is solid.
//   3. NO VERTICAL MIRROR SYMMETRY. The cowl is raked (left brim 4 units
//      lower than the right), one bulb is held low-left and the other high
//      above the shoulder, the shoulder line is tilted and the hem is
//      `jagged()`.
// Re-checked against serif I T L Y A H -- see `_dc-cut.html?letters=1`.
//
// WHAT THE REBUILD COST, recorded because it is real: the old figure had NO
// LEGS, a flared robe instead, and legless was the sharpest silhouette break
// from the heroes in the file. That break is gone by design -- matching the
// heroes was the assignment -- and the hero/villain split now rests entirely
// on the four axes rather than partly on anatomy. The character read does not
// depend on it: a streetlamp is identified by the lamp, which is the head.
export function dcBlackout({
  bodyColor = '#2b1f45',
  accent = '#140d24',
  lensColor = '#c99bff',
  glowColor = '#ff5cf0',
} = {}) {
  // A dead bulb gripped in a C-clip hand. `hx,hy` is the HAND centre, and the
  // collar is built along the bulb-to-hand vector, so the collar always points
  // back down its own arm and the ring visibly holds the bulb instead of
  // sitting beside it. The old version aimed the collar with a hand-supplied
  // offset pair and it read as a little hat on the raised arm.
  const bulb = (cx, cy, hx, hy) => {
    const m = Math.hypot(hx - cx, hy - cy) || 1
    const ux = (hx - cx) / m
    const uy = (hy - cy) / m
    const p = (t, s) =>
      `${(cx + ux * t - uy * s).toFixed(1)},${(cy + uy * t + ux * s).toFixed(1)}`
    return `
      <polygon points="${p(2, -3.6)} ${p(2, 3.6)} ${p(9.5, 2.8)} ${p(9.5, -2.8)}" fill="${accent}"/>
      <circle cx="${cx}" cy="${cy}" r="7" fill="${accent}"/>
      <circle cx="${cx}" cy="${cy}" r="4.8" fill="${bodyColor}"/>
      <path d="M ${(cx - 3.4).toFixed(1)},${(cy + 1.4).toFixed(1)} L ${(cx - 3.4).toFixed(1)},${(cy - 1).toFixed(1)} L ${(cx - 1.2).toFixed(1)},${(cy - 2.4).toFixed(1)}"
        stroke="${lensColor}" stroke-width="1.5" fill="none" opacity="0.9"/>
      <path d="M ${(cx + 1.2).toFixed(1)},${(cy - 2.4).toFixed(1)} L ${(cx + 3.4).toFixed(1)},${(cy - 1).toFixed(1)} L ${(cx + 3.4).toFixed(1)},${(cy + 1.4).toFixed(1)}"
        stroke="${lensColor}" stroke-width="1.5" fill="none" opacity="0.9"/>`
  }

  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="32" ry="3.4" fill="#000" opacity="0.13"/>

      ${legoArm(31, 62, 21, 77, 18, 90, bodyColor, 11)}
      ${legoHand(17, 94, accent, 5, -120)}
      ${bulb(14, 101, 17, 94)}
      ${legoArm(89, 57, 100, 45, 104, 33, bodyColor, 11)}
      ${legoHand(106, 29, accent, 5, -50)}
      ${bulb(108, 22, 106, 29)}

      ${legoLeg(37, 106, 19, 29, bodyColor, accent, 11)}
      ${legoLeg(64, 106, 19, 29, bodyColor, accent, 11)}
      ${villainHip(accent)}
      ${villainHem(accent)}

      <rect x="53" y="42" width="14" height="15" fill="${accent}"/>

      ${villainTorso(bodyColor, accent, 6)}
      <polygon points="38,70 82,66 82,72 38,76" fill="${accent}"/>
      <polygon points="39,81 81,77 81,83 39,87" fill="${accent}"/>

      <polygon points="34,18 86,14 77,47 44,48" fill="${accent}"/>
      <polygon points="37,22 83,18 75,43 46,44" fill="${bodyColor}"/>
      <g transform="rotate(-4 60 48)">${eyePlate(60, 32, 26, 11, lensColor, '#0b0512', glowColor, 2)}</g>
      <polygon points="45,39 76,36 75,47 44,48" fill="${accent}"/>

      <polygon points="28,15 92,9 94,20 30,26" fill="${accent}"/>
      <polygon points="28,15 92,9 92,13 28.6,19" fill="${bodyColor}"/>
    </g>
  `
  )
}

// Mirage. Two heads on one body: the solid one plus an illusion rising from
// the same shoulders on its own visible column, so the cut-out itself asks
// which is real. A mirror shard in the far hand carries a third, tiny face.
// On the minifigure build the two-head read got STRONGER rather than weaker,
// because a block head is a bigger, flatter shape than the old circle and two
// of them side by side cannot be mistaken for one head with horns -- which is
// exactly what the first version of this character was mistaken for.
//   - The real head sits LEFT of centre (x 28-64) and the illusion is up and
//     RIGHT (x 80-110), 16 units of clear background between the two
//     outlines. That is up from 14.8 on the old build.
//   - The illusion is a SMALLER block, 30x28 against the real head's 36x34,
//     which is the one place the two differ in build. An illusion that
//     measures identical to the original reads as a twin, not a mirage.
//   - THE COLUMN IS THE PART THAT MAKES IT ONE FIGURE. It runs from inside the
//     right shoulder up to inside the illusion's jaw, overlapping both, and is
//     drawn BEFORE the arms and the torso so it emerges from behind the
//     shoulder. The lesson underneath it: an earlier round of this character
//     had the real head bottoming out half a unit above the torso, and a
//     component scan returned the head as its own piece. Half a unit is
//     invisible at every size the app renders, so only the scan catches it.
//   - The body is split down the middle into two tones AND the two legs are
//     different colours, so nothing about the figure agrees with itself.
// The mirror shard is opaque with a dark rim, not a translucent plate over an
// opaque one: in a hard cut-out the translucent version was one rectangle
// ghosting another.
export function dcMirage({
  bodyColor = '#6e2352',
  accent = '#37102a',
  ghostColor = '#a3468a',
  shimmerColor = '#5ff0d8',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="58" cy="136" rx="30" ry="3.2" fill="#000" opacity="0.1"/>

      <polygon points="80,56 96,52 98,34 82,36" fill="${ghostColor}"/>
      ${legoBlock(76, 6, 32, 30, ghostColor, 4)}
      ${eyePlate(92, 18, 20, 9, '#b8f0e4', '#3a1030', null, 1.3)}

      ${legoArm(33, 58, 20, 65, 12, 74, bodyColor, 11)}
      ${legoHand(10, 78, accent, 5, -120)}
      <polygon points="2,49 25,41 28,69 6,77" fill="${accent}"/>
      <polygon points="5,52 22,46 24.5,66 8,72" fill="${shimmerColor}"/>
      ${slit(12, 56, 6, 3.2, 0.9, accent)}
      ${slit(19.5, 53.5, 6, 3.2, -0.9, accent)}
      <polygon points="12.5,62 20.5,59.5 20.5,61.5 12.5,64" fill="${accent}"/>
      <polygon points="8,72 24.5,66 24,71 9,75" fill="${accent}" opacity="0.55"/>
      ${legoArm(87, 55, 98, 67, 94, 81, accent, 11)}
      ${legoHand(93, 85, bodyColor, 5, -60)}

      ${legoLeg(37, 106, 19, 29, bodyColor, accent, 11)}
      ${legoLeg(64, 106, 19, 29, ghostColor, accent, 11)}
      ${villainHip(accent)}
      ${villainHem(accent, 6)}

      <rect x="37" y="42" width="14" height="17" fill="${accent}"/>

      ${villainTorso(bodyColor, accent, 5)}
      <polygon points="60,53 80,50.5 86,57 83,98 60,98" fill="${accent}"/>
      <path d="M 41,74 L 48,68 L 55,74 L 62,68 L 69,74 L 76,68 L 80,71 L 80,77 L 76,74 L 69,80 L 62,74 L 55,80 L 48,74 L 41,80 Z" fill="${shimmerColor}" opacity="0.62"/>

      ${legoBlock(26, 12, 36, 34, bodyColor)}
      <path d="M 26,26 L 26,17 Q 26,12 31,12 L 57,12 L 57,29 Z" fill="${accent}"/>
      ${eyePlate(44, 31, 26, 11, shimmerColor, '#25081c', '#eaffff', 1.6)}
      <polygon points="31,17 41,20 24,2" fill="${accent}"/>
      <rect x="32" y="40" width="24" height="2.6" rx="1.2" fill="${accent}"/>
    </g>
  `
  )
}

// Gridlock. The jam: a traffic-signal GANTRY for headgear and a diamond-mesh
// barrier strung between two outstretched fists across the lower frame. The
// mesh is diamonds rather than squares on purpose -- a square grid reads as a
// hash mark, and this family already risks being misread as letters.
//
// THE USER ONCE SAW THIS FIGURE AND SAID THE HEAD WAS COMING OFF, and it was
// literally true: a component scan returned the signal box and the body as two
// pieces with two units of completely empty rows between them. The minifigure
// build is a rebuild, so that fix had to be re-earned, not inherited:
//   - THE BOX SITS ON A REAL NECK. The signal box bottom runs to y=47 and the
//     14-unit neck spans y 42..57 against a torso whose shoulder line is at
//     y=49..55, so the neck overlaps the box by 5 units and the torso by at
//     least 2. Overlap on both ends is what makes this ONE component; edges
//     that merely touch are the defect.
//   - ABOUT SEVEN UNITS OF THE NECK ARE VISIBLE, measured off the row-width
//     profile rather than assumed. A neck that exists in code but is swallowed
//     by the union of head and torso measures zero, which is what happened
//     three times in the Mario family.
//   - THE MESH TOP RAIL MOVED DOWN to y=78 so that it hangs from the fists
//     instead of crossing the neck. The old rail was at y=54, which on this
//     build would have covered the join the fix is about.
//
// THE ARMS MUST NOT BECOME ONE HORIZONTAL BAR. On the old build, fists plus
// arms plus torso added up to a solid full-width run for fifteen rows -- rows
// carrying no shape information at all. Here the arms go out AND DOWN, so the
// fists sit twenty-odd units below the shoulder line and there are fifteen
// units of clear background between each fist and the waist.
// The SIDE PODS are the other half of that: two small lamp pods hung off the
// gantry crossbar, 7-9 units clear of the signal box on either side, which
// puts real background inside the head band as well. They hang off the
// crossbar rather than floating, so the figure stays one component.
//
// DO NOT EXPECT THE FRAGMENTATION INDEX TO REWARD THE ARMS THEMSELVES -- it
// counts holes, not articulation, and an articulated arm is bulkier than a bar
// of the same reach. The mesh does not help it either: at 11-unit diamond
// spacing the gaps along a row are about five units, under the index's
// six-unit threshold, so every mesh row reads as solid to it. Judge the arms
// by eye or with the net stripped.
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
  // It stops at y=104, above the row where the legs separate. The first
  // version ran it to y=126, exactly the rows where the legs part: the net
  // filled the gap and the cut-out came back as a slab with no legs in it.
  // It is drawn IN FRONT of the torso and BEHIND the head. Behind the torso,
  // the body hid the middle and the net read as two green patches at the
  // sides -- something growing out of him rather than something he is holding
  // across himself, which is the whole character.
  const mesh = (() => {
    const X0 = 8
    const X1 = 112
    const Y0 = 70
    const Y1 = 94
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
      <ellipse cx="60" cy="136" rx="32" ry="3.4" fill="#000" opacity="0.12"/>

      ${legoLeg(37, 106, 19, 29, bodyColor, accent, 11)}
      ${legoLeg(64, 106, 19, 29, bodyColor, accent, 11)}
      <rect x="40" y="112" width="13" height="3" fill="${barColor}"/>
      <rect x="67" y="112" width="13" height="3" fill="${barColor}"/>
      ${villainHip(accent)}

      <rect x="53" y="42" width="14" height="15" fill="${bodyColor}"/>
      <rect x="51" y="46" width="18" height="3.4" fill="${barColor}"/>

      ${villainTorso(bodyColor, accent, 6)}
      <rect x="39" y="62" width="42" height="5" fill="${accent}"/>

      ${legoArm(33, 59, 22, 66, 17, 75, bodyColor, 11)}
      ${legoArm(87, 54, 98, 61, 103, 70, bodyColor, 11)}
      <circle cx="33" cy="59" r="7.4" fill="${bodyColor}"/>
      <circle cx="87" cy="54" r="7.4" fill="${bodyColor}"/>
      <path d="M 35.4,53.4 A 6,6 0 0 1 35.4,64.6" stroke="${accent}" stroke-width="1.8" fill="none"/>
      <path d="M 84.6,48.4 A 6,6 0 0 0 84.6,59.6" stroke="${accent}" stroke-width="1.8" fill="none"/>
      ${legoHand(15, 79, accent, 5.4, -110)}
      ${legoHand(105, 74, accent, 5.4, -60)}

      ${mesh}
      <rect x="8" y="68" width="104" height="4" fill="${accent}"/>
      <rect x="8" y="92" width="104" height="4" fill="${accent}"/>

      <polygon points="22,13 98,7 98,13.5 22,19.5" fill="${accent}"/>
      <polygon points="22,13 98,7 98,10 22,16" fill="${barColor}"/>
      <rect x="22" y="15" width="13" height="17" rx="2" fill="${accent}"/>
      <rect x="22" y="15" width="13" height="3.4" fill="${barColor}"/>
      <circle cx="28.5" cy="25" r="3.4" fill="${lampColor}"/>
      <rect x="85" y="10" width="13" height="17" rx="2" fill="${accent}"/>
      <rect x="85" y="10" width="13" height="3.4" fill="${barColor}"/>
      <circle cx="91.5" cy="20" r="3.4" fill="${lampColor}"/>

      <polygon points="45,7 76,4 78,44 47,47" fill="${accent}"/>
      <polygon points="47.5,10.5 74,8 75.5,40.5 49.5,43" fill="${bodyColor}"/>
      <circle cx="54" cy="21" r="5.2" fill="${lampColor}"/>
      <circle cx="67" cy="19.8" r="5.2" fill="${lampColor}"/>
      <circle cx="54" cy="21" r="2.2" fill="${accent}"/>
      <circle cx="67" cy="19.8" r="2.2" fill="${accent}"/>
      <rect x="48.5" y="31" width="26" height="2.6" fill="${barColor}"/>
      <rect x="49" y="36" width="26" height="2.6" fill="${accent}"/>
    </g>
  `
  )
}

// Floodlight. The blinder: headgear is a tilted bank of six stadium lamps in
// a frame, its two centre lamps doubling as eyes, and a hard glare wedge falls
// across the lower-left of the frame. The bank is 62 units across against the
// 54-unit shoulders, so this figure is still the broad one in the villain set
// -- the width just moved from the body to the helmet, which is how a
// minifigure carries bulk.
//
// THE OVERHANGING VISOR IS LOAD BEARING and it is the trap on this character.
// Without it the cut-out reads "television head", which is a different joke.
// On the old build it was also FLOATING: its underside ran 2.7-3.3 units clear
// of the lamp frame's top edge all the way across, so a component scan
// returned the visor as a separate 561u2 piece -- the same defect the user
// reported on Gridlock. It is squeezed between two hard limits and both were
// solved by arithmetic, not by eye:
//   - it must OVERLAP the bank's top edge (that is what makes one component);
//   - it must CLEAR the top row of lamp rims, or it covers the lamps.
// The window between those two is about five units wide at the left end and
// shrinks to the right because both edges are tilted. The visor's underside
// runs (28,15) to (96,10.6) and sits 2.7-2.9 units below the bank top and
// 1.5-1.8 units above the nearest lamp rim. DO NOT SLIDE IT EITHER WAY
// without re-running the component scan and re-checking the lamp clearance.
//
// The lamp geometry that sets that floor: rims at r=6.2 on centres following
// the bank's own -4-in-62 tilt, top row at y 21.8/20.7/19.6 and bottom row
// 13 units under it. Six lamps, not four: four in a square reads as a die.
export function dcFloodlight({
  bodyColor = '#8a3f1c',
  accent = '#3f1608',
  lampColor = '#eaffff',
  glareColor = '#9fe8f5',
} = {}) {
  const lamp = (cx, cy, pupil) => `
    <circle cx="${cx}" cy="${cy}" r="6.2" fill="${accent}"/>
    <circle cx="${cx}" cy="${cy}" r="5" fill="${lampColor}"/>
    ${pupil ? `<circle cx="${cx}" cy="${cy}" r="2.1" fill="${accent}"/>` : ''}`

  return svgWrap(
    `
    <g>
      <ellipse cx="62" cy="136" rx="32" ry="3.4" fill="#000" opacity="0.12"/>

      ${beam(45, 35, 2, 86, 8, 134, glareColor, '#2a7f96')}

      ${legoArm(33, 58, 22, 70, 18, 84, bodyColor, 11)}
      ${legoHand(17, 88, accent, 5.4, -120)}
      ${legoArm(87, 53, 99, 66, 103, 80, bodyColor, 11)}
      ${legoHand(104, 84, accent, 5.4, -55)}

      ${legoLeg(37, 106, 19, 29, bodyColor, accent, 11)}
      ${legoLeg(64, 106, 19, 29, bodyColor, accent, 11)}
      ${villainHip(accent)}

      <rect x="53" y="42" width="14" height="15" fill="${accent}"/>

      ${villainTorso(bodyColor, accent, 6)}
      <rect x="42" y="84" width="36" height="7" fill="${accent}"/>

      <polygon points="34,12 91,8 93,42 37,46" fill="${accent}"/>
      <polygon points="37,15 88,11 90,39 40,43" fill="${bodyColor}"/>
      <polygon points="37,15 44,14.5 47,43 40,43" fill="${accent}" opacity="0.5"/>
      ${lamp(46, 21.8, true)}
      ${lamp(61, 20.8, false)}
      ${lamp(76, 19.8, true)}
      <polygon points="39.5,29.2 88,25.2 88,28.4 39.5,32.4" fill="${accent}"/>
      ${lamp(46, 34.8, false)}
      ${lamp(61, 33.8, false)}
      ${lamp(76, 32.8, false)}
      <polygon points="29,6 91,2 93,10.4 31,14.6" fill="${accent}"/>
      <polygon points="29,6 91,2 91,5.2 29.5,9.4" fill="${bodyColor}"/>
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
