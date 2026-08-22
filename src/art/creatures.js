// "Pokemon-genre" companion-creature art (chapter 4). A fourth drawing
// language, deliberately unlike the other three: src/art/robots.js (angular
// human-shaped machines), src/art/dinosaurs.js (bezier animals, upright,
// human-scale, side-on), src/art/platformer.js (2.5-head sprite PEOPLE in
// caps and gloves). This file draws no person at all -- every figure is a
// small round non-humanoid critter, front-facing, that a child would want to
// "catch." It deliberately borrows none of a real creature-collecting
// franchise's specific silhouettes, colours, or ball/badge trade dress.
//
// DESIGN GRAMMAR (v7 -- SOFT LINE-ART CEL STYLE). This replaced an earlier
// "angular and spiky" pass outright: the reference the client picked is a
// hand-drawn creature chart whose whole appeal is softness, so spiky crests,
// triangle claws, diamond cheek marks and hard facet shading are gone. Every
// figure in this file follows all of the following.
//
//  1. WARM SEPIA OUTLINE ON EVERYTHING, IN WEIGHT TIERS. `ol(w)` puts
//     stroke=LINE (#7a5c48, never black) on the shape, and the weight carries
//     depth the way it does in src/art/toys.js -- only thinner throughout,
//     because this family's reference is a soft pencil-and-wash chart rather
//     than a bold inked cartoon: 2.6 for the silhouette masses (body, wing,
//     shell, puddle), 2.0 for limbs / ears / props / muzzles, 1.4 for
//     interior seams, and 3.0 -- the heaviest line in the file -- for the
//     emblem plate, which has to survive being the smallest thing that still
//     must be read. A uniform weight looked flat and traced; the tiers are
//     what make it look drawn.
//     A limb drawn as a thick stroke gets its outline the only way a stroke
//     can: the same path painted twice, wider in LINE underneath (`tube`).
//  2. PASTEL, LOW-SATURATION FILLS. Bodies sit in the pale coral / pale sky /
//     warm sand / soft lavender band -- high value, low chroma. Villains use
//     the same band one step duller and darker, never a saturated "evil"
//     colour. The outline and the eyes are the only dark values on the page.
//  3. LIMBS BEHIND THE BODY, ONE CLEAN SILHOUETTE. Stub paws and feet are
//     outlined and emitted BEFORE the body ellipse, so the body's opaque fill
//     eats their inner strokes and the figure reads as one continuous outline
//     with limbs poking out -- the way an inked drawing works.
//  4. DOT EYES, TINY MOUTH, NOTHING ELSE. Two small dark ellipses and one
//     short mouth stroke carry the whole face: no sclera, no highlight dot,
//     no brows on heroes. Expression lives in the lid alone -- heroes plain
//     dots, Magno a half-lid, villains a lid drooping toward the OUTSIDE
//     corner (sulky/sly, never angry; an inward-up brow is the angry read).
//  5. ONE OR TWO SPECIES CUES, RADICALLY SIMPLIFIED. Each figure keeps only
//     the marks that name its animal -- long rounded ears + round cheek dots
//     + a zigzag tail, a horseshoe-arch ear, a spiral snout, wings + a flame
//     tail -- and nothing else. Anything that could be unscrewed and handed
//     to another character does not belong on a hero.
//  6. ROUND ENDS EVERYWHERE. Round caps and joins are set once on each
//     figure's root group and inherited, and every "pointed" feature -- ear
//     tips, horns, wingtips, zigzag corners, flame, drips -- terminates in a
//     curve instead of a corner.
//  7. THE EMBLEM IS A CHEST BADGE, sized past good taste: it is the phonics
//     letter. Pastel bodies make a tinted badge disappear, so the badge plate
//     is the lightest value in the figure, ringed in the sepia outline, with
//     the letter in the darkest ink -- the contrast is structural rather than
//     a colour choice a palette override could weaken. Badges are positioned
//     to land wholly inside the belly patch, checked per figure.
//  8. NO GRADIENTS, NO FILTERS. Volume is a belly patch plus one HARD-EDGED
//     shade crescent per figure, cut on the body's own ellipse arc
//     (`shadeCrescent`) so its outer edge is flush with the silhouette. A
//     floating soft blob of tint, which is what this file used before, reads
//     as a smudge; a shadow that follows the form reads as cel shading even
//     in pastel.
//
// `visorColor` names the EMBLEM BADGE fill here (the family has no visor) --
// report this at integration time the way dinosaurs.js and platformer.js
// did, so the palette table omits it from anywhere a real visor is expected.
//
// This file must not import ../art.js (circular); it carries its own svgWrap.

function svgWrap(inner, viewBox = '0 0 120 140') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

// Mirrors arbitrary drawing content about the centre line via a transform --
// the creature parts are ellipses/paths, not polygon point lists, so the
// robots' point-rewrite trick does not apply (dinosaurs.js and
// platformer.js hit the same constraint and solved it the same way).
// x -> 120-x maps the box onto itself, so a mirrored in-range shape stays in
// range: every two-sided feature here is written once, on the left.
function mirrored(inner) {
  return `<g transform="translate(120,0) scale(-1,1)">${inner}</g>`
}

const LINE = '#7a5c48' // warm sepia outline -- the whole style rests on this
const LINE_SOFT = '#a98b72' // interior seams, one step lighter than LINE
const INK = '#3f2d22' // eyes and mouth, the darkest value in the figure
const BADGE = '#fffaf0' // emblem plate: lightest value, for letter contrast
const BELLY = '#fdf1e0' // shared warm cream underside
const FLAME = '#f7b96b' // soft ember, the one place any chroma is allowed
const FLAME_CORE = '#fdeec4'
const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// Outline weight tiers (grammar rule 1). Anything structural takes SW; a
// limb, ear, prop or muzzle takes SW_MID; an interior seam takes SW_IN; the
// emblem plate alone takes SW_BADGE.
const SW = 2.6
const SW_MID = 2
const SW_IN = 1.4
const SW_BADGE = 3

const ol = (w = SW) => `stroke="${LINE}" stroke-width="${w}"`

// Each figure's root group sets the round-end defaults once and children
// inherit them -- that is how grammar rule 6 holds without repeating two
// attributes on forty paths.
function fig(inner) {
  return `<g stroke-linecap="round" stroke-linejoin="round">${inner}</g>`
}

// Hard-edged cel shade: a crescent whose outer edge IS the body ellipse's own
// arc (from -50 deg to 72 deg, i.e. upper-right around to lower-right), closed
// by one curve back through the body's interior. Emitted after the belly patch
// and before the badge, so the shadow crosses the belly the way a real one
// would but never dims the letter plate.
function shadeCrescent(cx, cy, rx, ry, op = 0.13) {
  const rad = (d) => (d * Math.PI) / 180
  const p = (deg) => [cx + rx * Math.cos(rad(deg)), cy + ry * Math.sin(rad(deg))]
  const [x1, y1] = p(-50)
  const [x2, y2] = p(72)
  return `<path d="M ${x1.toFixed(1)},${y1.toFixed(1)} A ${rx},${ry} 0 0 1 ${x2.toFixed(1)},${y2.toFixed(1)}
    Q ${(cx + rx * 0.3).toFixed(1)},${cy} ${x1.toFixed(1)},${y1.toFixed(1)} Z"
    fill="${LINE}" opacity="${op}"/>`
}

// Ground shadow. `cy` is clamped so the ellipse's own bottom (cy + rx*0.16)
// stays inside the 140-tall box: the first version of this pass let the four
// widest figures' shadows run to y=142.4, which reads as a shadow sliced flat
// against the frame -- the one clipping bug that survived every hand check
// because a 13%-opacity shape is easy to look past.
function shadow(cx, cy, rx) {
  const ry = rx * 0.16
  return `<ellipse cx="${cx}" cy="${Math.min(cy, 138.5 - ry)}" rx="${rx}" ry="${ry}" fill="${LINE}" opacity="0.13"/>`
}

// A limb drawn as a thick stroke cannot take a stroke of its own, so it is
// painted twice: LINE first at width+2*SW, the fill on top at width.
function tube(d, width, fill) {
  return `
    <path d="${d}" fill="none" stroke="${LINE}" stroke-width="${width + SW_MID * 2}"/>
    <path d="${d}" fill="none" stroke="${fill}" stroke-width="${width}"/>`
}

// Plain dot eye. No sclera, no glint -- grammar rule 4.
function dot(cx, cy, r) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${r}" ry="${r * 1.08}" fill="${INK}"/>`
}
function dotEyes(cx1, cx2, cy, r) {
  return `${dot(cx1, cy, r)}${dot(cx2, cy, r)}`
}

// Half-lidded pair: a flattened dot with the upper lid arcing OVER it, bowing
// upward. The direction matters more than anything else in this function -- a
// lid that dips down in the middle is a frown and reads angry (the first
// version of this pass did exactly that and Magno came out scowling); bowing
// up over a squashed pupil is the drowsy read.
function sleepyEyes(cx1, cx2, cy, r) {
  const one = (cx) => `
    <ellipse cx="${cx}" cy="${cy + r * 0.55}" rx="${r * 0.92}" ry="${r * 0.45}" fill="${INK}"/>
    <path d="M ${cx - r * 1.3},${cy + r * 0.1} Q ${cx},${cy - r * 1.15} ${cx + r * 1.3},${cy + r * 0.1}"
      fill="none" stroke="${INK}" stroke-width="2.3"/>`
  return `${one(cx1)}${one(cx2)}`
}

// Villain pair: dot plus a lid sitting LOW on the outside corner. Kept thin
// (1.8) and shallow (0.5r of rise across 2.4r of width): the first version was
// 2.1 wide with twice the rise and, even though inner-high/outer-low is
// geometrically the sulky shape rather than the angry one, at that weight it
// read as a heavy scowl. Villains here are meant to look put-upon, not fierce.
function droopyEyes(cx1, cx2, cy, r) {
  return `
    ${dot(cx1, cy, r)}
    ${dot(cx2, cy, r)}
    <path d="M ${cx1 - r * 1.3},${cy - r * 1.15} Q ${cx1 - r * 0.1},${cy - r * 1.8} ${cx1 + r * 1.1},${cy - r * 1.65}"
      fill="none" stroke="${INK}" stroke-width="1.8"/>
    <path d="M ${cx2 + r * 1.3},${cy - r * 1.15} Q ${cx2 + r * 0.1},${cy - r * 1.8} ${cx2 - r * 1.1},${cy - r * 1.65}"
      fill="none" stroke="${INK}" stroke-width="1.8"/>`
}

// Tiny mouths. Hero: a short symmetric curve. Villain: the same curve with
// one corner lifted, which is all a smirk needs at this line weight.
function mouth(cx, cy, w) {
  return `<path d="M ${cx - w},${cy} Q ${cx},${cy + w * 0.8} ${cx + w},${cy}"
    fill="none" stroke="${INK}" stroke-width="2.1"/>`
}
function smirk(cx, cy, w) {
  return `<path d="M ${cx - w},${cy + w * 0.3} Q ${cx},${cy + w * 0.85} ${cx + w},${cy - w * 0.35}"
    fill="none" stroke="${INK}" stroke-width="2.1"/>`
}

// Chest badge: lightest plate + sepia ring + darkest ink letter (rule 7).
function emblemBadge(cx, cy, r, plateColor, label, size) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${plateColor}" ${ol(SW_BADGE)}/>
    <text x="${cx}" y="${cy + size * 0.36}" text-anchor="middle" font-family="${FONT}"
      font-size="${size}" font-weight="800" fill="${INK}">${label}</text>`
}

// The shared mass: one outlined body ellipse plus an outlined belly patch.
// Corky and Flippy pass withBelly=false (see their own notes).
//
// The belly is deliberately much WIDER than it is tall. A near-circular patch
// with the round badge centred in it reads as a dartboard -- two concentric
// cream rings -- and swallows so much of the figure that the pastel body
// barely shows, which was the loudest complaint about the first version of
// this pass. A shallow wide oval behind a round badge reads as a bib with a
// name tag instead, and leaves the body colour dominant. The badge still has
// to sit inside the patch: there is no room to put it above one, because the
// face already owns the top half of a 72-unit-tall body.
function blob(fill, cx, cy, rx, ry, withBelly = true) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${ol(SW)}/>
    ${withBelly
      ? `<ellipse cx="${cx}" cy="${cy + ry * 0.4}" rx="${rx * 0.8}" ry="${ry * 0.44}"
           fill="${BELLY}" ${ol(SW_IN)}/>`
      : ''}`
}

// Stub limbs -- outlined, and always emitted BEFORE the body (rule 3).
function stub(cx, cy, rx, ry, fill) {
  return `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${ol(SW_MID)}/>`
}
function paws(fill, cy, rx = 9.5, ry = 11) {
  return `${stub(22, cy, rx, ry, fill)}${stub(98, cy, rx, ry, fill)}`
}
function feet(fill, cy, rx = 12, ry = 7) {
  return `${stub(44, cy, rx, ry, fill)}${stub(76, cy, rx, ry, fill)}`
}

// Long ear with a ROUNDED tip: the tip's two control handles meet at (0,-h)
// pulled sideways, so the apex is a dome. This is the shape the previous
// spiky pass got wrong.
// `tipFill` caps the dome in a contrasting tone. It is a value contrast, not
// a point: the ear stays rounded, but a long pastel ear with no tip marking
// loses its end against the background at map-node size, and the species cue
// is the ear LENGTH, which you cannot read if the end is invisible.
function softEar(cx, cy, w, h, rot, fill, innerFill, tipFill) {
  return `
    <g transform="translate(${cx},${cy}) rotate(${rot})">
      <path d="M ${-w},${h * 0.4} C ${-w * 1.05},${-h * 0.45} ${-w * 0.85},${-h} 0,${-h}
               C ${w * 0.85},${-h} ${w * 1.05},${-h * 0.45} ${w},${h * 0.4} Z"
        fill="${fill}" ${ol(SW_MID)}/>
      <path d="M ${-w * 0.46},${h * 0.2} C ${-w * 0.5},${-h * 0.4} ${-w * 0.42},${-h * 0.74} 0,${-h * 0.74}
               C ${w * 0.42},${-h * 0.74} ${w * 0.5},${-h * 0.4} ${w * 0.46},${h * 0.2} Z"
        fill="${innerFill}" ${ol(SW_IN)}/>
      ${tipFill
        ? `<path d="M ${-w * 0.78},${-h * 0.58} C ${-w * 0.86},${-h * 0.86} ${-w * 0.52},${-h} 0,${-h}
                    C ${w * 0.52},${-h} ${w * 0.86},${-h * 0.86} ${w * 0.78},${-h * 0.58}
                    C ${w * 0.42},${-h * 0.7} ${-w * 0.42},${-h * 0.7} ${-w * 0.78},${-h * 0.58} Z"
             fill="${tipFill}" ${ol(SW_IN)}/>`
        : ''}
    </g>`
}

// Round ear nub, for the species whose ears are small.
function roundEar(cx, cy, r, fill, innerFill) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" ${ol(SW_MID)}/>
    <circle cx="${cx}" cy="${cy}" r="${r * 0.5}" fill="${innerFill}" ${ol(SW_IN)}/>`
}

// Horseshoe arch, one closed path with round joins so both legs end soft.
// Magno wears it as an EAR (body-coloured, no pole caps, so it reads as an
// ear first and a magnet second); Grabby wears the stolen one as an actual
// object, pole caps and all, which is what makes the theft legible.
function archShape(fill, poleA, poleB) {
  return `
    <path d="M -9,11 C -9,-11 9,-11 9,11 L 3,11 C 3,-3 -3,-3 -3,11 Z"
      fill="${fill}" ${ol(SW_MID)}/>
    ${poleA ? `<rect x="-9.2" y="6.6" width="6.4" height="5.8" rx="2.2" fill="${poleA}" ${ol(SW_IN)}/>` : ''}
    ${poleB ? `<rect x="2.8" y="6.6" width="6.4" height="5.8" rx="2.2" fill="${poleB}" ${ol(SW_IN)}/>` : ''}`
}

// ---------------------------------------------------------------------------
// HEROES
// ---------------------------------------------------------------------------

// Rocket (R): electric mouse/rabbit. Three cues, all of them deliberately
// oversized (v8): long tipped ears, big saturated cheek discs, and a zigzag
// bolt tail that leaves the silhouette. The v7 pass had all three at "tasteful"
// scale and the figure read as a plain pink rabbit -- the electric motif was
// technically present and practically invisible. Nothing here got sharper; the
// soft shapes just got bigger.
export function creatureRocket({
  bodyColor = '#f6a893',
  accent = '#e2846c',
  emblem = 'R',
  visorColor = BADGE,
} = {}) {
  // The one place in this family where saturation is allowed to spike (see
  // the palette rule in the header): the cheek disc is Rocket's signature and
  // has to win the face at 66 px. It also carries the limb-weight outline
  // (2.0) instead of a seam weight, so it reads as a feature rather than a
  // shading patch.
  const CHEEK = '#f4664c'
  return svgWrap(
    fig(`
      ${shadow(60, 132, 30)}

      ${softEar(42, 52, 12, 40, -14, bodyColor, BELLY, accent)}
      ${softEar(78, 52, 12, 40, 14, bodyColor, BELLY, accent)}

      <!-- paws dropped to cy=104 for the tail's sake: at cy=100 they spanned
           y 89..111 and swallowed the lower half of the bolt. -->
      ${paws(accent, 104)}
      ${feet(accent, 126)}

      <!-- tail: rooted at (84,94), inside the rx=36 body silhouette (edge
           x=94.6 there) so the join hides, then out to (110,56) -- 26 units
           of travel past the body edge, where v7's version cleared it by 12.
           Width 10 (was 8): outer width 14, half 7, so max x 110+7=117 and
           min y 56-7=49. Lowest tail point y=94 sits 1 unit above the paw
           top (95), so nothing eats it. Round caps and joins keep every
           corner of the zigzag curved. -->
      ${tube('M 84,94 L 108,84 L 96,72 L 110,56', 10, accent)}

      ${blob(bodyColor, 60, 88, 36, 36)}
      ${shadeCrescent(60, 88, 36, 36)}

      <!-- cheek radius 10.5, from v7's 6.5 -- 2.6x the area. This is the
           largest disc the body can hold on that centre: at y=93 the rx=36
           body's left edge is x=24.35, and 36.5-10.5 = 26 clears it by 1.65
           with the outline's half-width inside that margin. -->
      <circle cx="36.5" cy="93" r="10.5" fill="${CHEEK}" ${ol(SW_MID)}/>
      <circle cx="83.5" cy="93" r="10.5" fill="${CHEEK}" ${ol(SW_MID)}/>

      ${dotEyes(47, 73, 76, 5)}
      ${mouth(60, 86, 5)}

      ${emblemBadge(60, 107, 14, visorColor, emblem, 20)}
    `)
  )
}

// Magno (M): the big sleepy one, and BULK IS THE SPECIES CUE (v8). At v7's
// 80x72 body it was within a few units of its castmates and read as "another
// round creature that happens to be sleepy"; the archetype only works if the
// size difference is unmissable, so the body is now 92x80 -- the widest in the
// file, filling the viewBox nearly edge to edge -- while the limbs got SHORTER
// and stubbier. The contrast between a huge mass and small limbs is what reads
// as heavy; a big figure with proportionate limbs just reads as a big figure.
// The magnet survives only as the ARCH SHAPE of the ears, body-coloured with
// no pole caps: legible as a horseshoe if you look, ears if you do not.
export function creatureMagno({
  bodyColor = '#a9c9ea',
  accent = '#82a9d2',
  emblem = 'M',
  visorColor = BADGE,
} = {}) {
  return svgWrap(
    fig(`
      ${shadow(60, 136, 40)}

      <g transform="translate(36,48) rotate(-12) scale(1.25)">${archShape(bodyColor)}</g>
      <g transform="translate(84,48) rotate(12) scale(-1.25,1.25)">${archShape(bodyColor)}</g>

      <!-- limbs placed by hand, not through paws()/feet(): those helpers put
           paws at x=22/98, which the rx=46 body swallows whole (its edge is
           at x=16.1 that low). Stubbier than any other figure's, on purpose. -->
      ${stub(15, 102, 10.5, 9.5, accent)}
      ${stub(105, 102, 10.5, 9.5, accent)}
      ${stub(42, 128, 15, 7, accent)}
      ${stub(78, 128, 15, 7, accent)}

      ${blob(bodyColor, 60, 90, 46, 40)}
      ${shadeCrescent(60, 90, 46, 40)}

      ${sleepyEyes(43, 77, 78, 6.5)}
      ${mouth(60, 90, 4.5)}

      ${emblemBadge(60, 108, 14, visorColor, emblem, 20)}
    `)
  )
}

// Drillo (D): burrowing mole. The drill is the SNOUT, and as of v8 it is a
// real PROTRUDING cone rather than a spiral engraved on a flat muzzle -- at
// v7 the groove sat on the muzzle's surface and the figure read as a bear
// with a swirl on its nose. The cone leaves the face down-and-left and its
// rounded tip crosses the body outline, so the snout is part of the
// silhouette. It also carries its own dark ochre tone, well away from both
// bodyColor and accent (which are both pale warm sand and washed the old
// spiral out at small sizes).
export function creatureDrillo({
  bodyColor = '#e6c894',
  accent = '#c9a56e',
  emblem = 'D',
  visorColor = BADGE,
} = {}) {
  const DRILL = '#8f7350' // dark warm ochre: separates from the body at 66 px
  const DRILL_DK = '#6d5738'
  // Local space: the cone's mouth is the +-9.5 wide arc at y~0, the tip is at
  // y=52. Four curved bands cross it, each bowing the same way, which is what
  // makes a smooth taper read as a drill flute without a single straight edge
  // or corner anywhere in the shape. Band half-widths (8.6/7.2/4.4/2.6) were
  // taken off the cubic's actual width at each height, not guessed, so no band
  // pokes through the cone's edge.
  const drill = `
    <path d="M -9.5,-2 C -9.5,-8.5 9.5,-8.5 9.5,-2 C 9.5,16 5.5,38 0,52
             C -5.5,38 -9.5,16 -9.5,-2 Z"
      fill="${DRILL}" ${ol(SW_MID)}/>
    <path d="M -8.6,9 C -3,13.5 3,13.5 8.6,9" fill="none" stroke="${DRILL_DK}" stroke-width="2.1"/>
    <path d="M -7.2,22 C -2.6,26.5 2.6,26.5 7.2,22" fill="none" stroke="${DRILL_DK}" stroke-width="2.1"/>
    <path d="M -4.4,35 C -1.6,38.5 1.6,38.5 4.4,35" fill="none" stroke="${DRILL_DK}" stroke-width="2.1"/>
    <path d="M -2.6,44 C -1,46.5 1,46.5 2.6,44" fill="none" stroke="${DRILL_DK}" stroke-width="1.8"/>
    <path d="M -6.5,-1 C -3.5,6 -1.5,18 -0.8,32" fill="none" stroke="${BELLY}" stroke-width="1.8" opacity="0.45"/>`

  return svgWrap(
    fig(`
      ${shadow(60, 136, 32)}

      ${roundEar(33, 62, 10.5, bodyColor, BELLY)}
      ${roundEar(87, 62, 10.5, bodyColor, BELLY)}

      <!-- front paws raised to shoulder height (cy=78) so the snout's whole
           travel has clear air: at cy=102 they occupied y 91..113 and at 88
           they still crossed the cone. High front paws suit a digging animal
           anyway. -->
      ${paws(accent, 78)}
      ${feet(accent, 128, 12, 7)}
      ${blob(bodyColor, 60, 92, 37, 38)}
      ${shadeCrescent(60, 92, 37, 38)}

      ${dotEyes(42, 78, 64, 4.8)}

      <!-- snout: a small round muzzle collar for the cone to grow out of, then
           the cone at 62 deg. Composed numerically, not eyeballed: the tip
           (0,52) lands at (54 - 52*sin62, 80 + 52*cos62) = (8.1, 104.4),
           while the rx=37 body's left edge at that height is x=24.9 -- so
           ~17 units of cone sit OUTSIDE the silhouette, which is what finally
           made Drillo nameable in a hard cutout (the first v8 attempt cleared
           the outline by 1.6 units and still read as a plain round bear).
           The angle matters as much as the length: at 40-52 deg the cone
           crossed the middle of the face and buried the muzzle; at 62 it
           leaves the head low and left, clearing the left eye's box
           (37..47 x 59..69) and passing left of the badge (x 46..74) at every
           height, so neither the face nor the letter is ever crossed. -->
      <circle cx="58" cy="78" r="9.5" fill="${BADGE}" ${ol(SW_MID)}/>
      <!-- scale 0.9 on top of the rotate: at full length the measured inked
           extent reached x=2.3, i.e. 2.3 units from the frame. Not clipping,
           but this file has a history of clipping accidents and a margin that
           thin is not worth the two units of cone. Tip now lands at (12.6,
           101.9), still ~12 units outside the body edge (x=24.4 there). -->
      <g transform="translate(54,80) rotate(62) scale(0.9)">${drill}</g>
      ${mouth(60, 88, 4)}

      ${emblemBadge(60, 108, 14, visorColor, emblem, 20)}
    `)
  )
}

// Captain Red, the evolved boss form: a flame dragon, the biggest silhouette
// in the family but drawn dependable rather than menacing -- same pastel
// band, same dot eyes, same closed smile as the three small heroes. Rounded
// wing lobes, a teardrop flame at the tail tip and two short blunt horns are
// the only things the smaller heroes do not have.
export function creatureCaptainRed({
  bodyColor = '#f0a196',
  panelColor = '#fbe6c8',
  accent = '#d4796e',
  visorColor = BADGE,
} = {}) {
  // Every wing point is an absolute viewBox coordinate in [5,52]; mirrored()
  // maps x -> 120-x, so the mirror lands in [68,115]. With the 2.6 stroke's
  // 1.3 half-width that leaves ~3.7 units of clearance at both edges -- the
  // failure an earlier pass hit (a polygon scaled to x=-54, then mirrored to
  // x=174) cannot recur from a shape written this way.
  // v8 reach: the leading edge now climbs to y=20 (v7: 34, the original: 42)
  // and the span runs x=5..115, i.e. 110 of the 120-unit box. The point of a
  // final evolved form is that the wings dominate the silhouette, and at v7's
  // span they were merely present. Every lobe still ends in a curve.
  const wing = `
    <path d="M 52,72 C 38,48 22,20 8,26 C 14,36 12,44 5,48
             C 14,53 14,62 6,69 C 16,74 18,84 11,94
             C 30,98 46,86 50,76 Z"
      fill="${panelColor}" ${ol(SW)}/>
    <path d="M 47,72 C 35,50 22,28 11,28 M 45,79 C 32,70 20,62 9,60" fill="none"
      stroke="${LINE_SOFT}" stroke-width="${SW_IN}"/>`
  const horn = `
    <path d="M -4.5,8 C -5.5,-2 -3.5,-11 0,-15 C 3.5,-11 5.5,-2 4.5,8 Z"
      fill="${accent}" ${ol(SW_MID)}/>`

  return svgWrap(
    fig(`
      ${shadow(60, 136, 42)}

      ${wing}
      ${mirrored(wing)}

      ${paws(accent, 92, 11, 12)}
      ${feet(accent, 128, 14, 7)}

      <!-- tail and flame in absolute coordinates, no rotate wrapper (a local-
           space curve carried through one is what pushed an earlier version
           32 units off the bottom edge). Tail half-width 6 plus outline 2 is
           budgeted into every point: max x 106+8=114, max y 120+8=128.
           The flame is three nested teardrops now instead of two, and half
           again as big (28x24 against v7's 20x17), peaking at (116,136) ->
           117.3 and 137.3 inked. All of it clears the right foot (x 62..90). -->
      ${tube('M 88,100 C 102,104 106,112 102,120', 12, accent)}
      <path d="M 102,110 C 116,119 114,132 102,136 C 90,132 88,119 102,110 Z"
        fill="${FLAME}" ${ol(SW_MID)}/>
      <path d="M 102,117 C 110,123 109,130 102,133 C 95,130 94,123 102,117 Z"
        fill="${FLAME_CORE}"/>
      <path d="M 102,123 C 106,126 105,130 102,131 C 99,130 98,126 102,123 Z"
        fill="${BADGE}" opacity="0.8"/>

      ${blob(bodyColor, 60, 92, 42, 39)}
      ${shadeCrescent(60, 92, 42, 39)}

      <g transform="translate(47,61) rotate(-16)">${horn}</g>
      <g transform="translate(73,61) rotate(16)">${horn}</g>

      ${dotEyes(46, 74, 72, 5.2)}
      ${mouth(60, 85, 6)}

      ${emblemBadge(60, 107, 16, visorColor, '★', 23)}
    `)
  )
}

// ---------------------------------------------------------------------------
// VILLAINS. Same sepia-outline pastel language as the heroes -- an inked
// pastel hero next to a saturated flat-colour villain was exactly the "these
// do not belong together" complaint that produced this revision -- but one
// step duller and darker in value, with the droopy outside-corner lid and a
// lopsided smirk instead of the heroes' plain dots and level smile. No chest
// badge: the letters belong to the heroes.
// Villains take only { bodyColor, accent }.
// ---------------------------------------------------------------------------

// Flippy: inverts the child's jump, so it hangs upside down. Built upright
// and flipped with y -> 140-y, which is also why nothing here can leave the
// box: that map sends [0,140] onto itself. The face is drawn AFTER the flip,
// upright, so the droopy lids still droop.
export function creatureFlippy({ bodyColor = '#b2a2d0', accent = '#8d7cb0' } = {}) {
  const wing = `
    <path d="M 45,74 C 30,56 14,46 5,52 C 11,58 10,63 4,67
             C 12,71 12,78 5,84 C 15,88 17,95 12,102
             C 28,102 40,92 44,84 Z"
      fill="${accent}" ${ol(SW)}/>
    <path d="M 41,77 C 30,64 19,55 11,55" fill="none" stroke="${LINE_SOFT}" stroke-width="${SW_IN}"/>`
  const clawFoot = (cx) => `
    <ellipse cx="${cx}" cy="124" rx="10" ry="7" fill="${accent}" ${ol(SW_MID)}/>
    <path d="M ${cx - 6},128 C ${cx - 8},131 ${cx - 8},133 ${cx - 6},134
             M ${cx + 6},128 C ${cx + 8},131 ${cx + 8},133 ${cx + 6},134"
      fill="none" stroke="${LINE}" stroke-width="2.4"/>`

  const upright = `
    ${wing}
    ${mirrored(wing)}
    ${clawFoot(45)}
    ${clawFoot(75)}
    <path d="M 38,52 C 32,42 34,32 41,34 C 45,40 44,48 42,54 Z"
      fill="${bodyColor}" ${ol(SW_MID)}/>
    <path d="M 82,52 C 88,42 86,32 79,34 C 75,40 76,48 78,54 Z"
      fill="${bodyColor}" ${ol(SW_MID)}/>
    <!-- no belly patch: the flip puts it at the TOP of the finished figure,
         where a big pale disc above the face reads as the head and turns the
         real face into a mark on the chest. One clean mass is correct here. -->
    ${blob(bodyColor, 60, 88, 33, 34, false)}
    <ellipse cx="60" cy="68" rx="20" ry="12" fill="${BELLY}" opacity="0.5"/>
  `

  return svgWrap(
    fig(`
      ${shadow(60, 132, 24)}
      <g transform="translate(0,140) scale(1,-1)">${upright}</g>
      ${droopyEyes(46, 74, 64, 5)}
      ${smirk(60, 78, 6)}
    `)
  )
}

// Slippy: melts the floor. No feet -- the lower body dissolves into a puddle
// with round drips, the same "no legs" language platSlime and dinoSwamp use
// for their own gripless villains.
export function creatureSlippy({ bodyColor = '#a8c9a5', accent = '#7fa37e' } = {}) {
  return svgWrap(
    fig(`
      <path d="M 16,120 C 26,113 34,122 46,116 C 60,109 70,120 84,114
               C 98,109 106,115 105,121 C 100,130 84,134 60,134
               C 36,134 18,129 16,120 Z"
        fill="${accent}" ${ol(SW)} opacity="0.9"/>

      <!-- arms hang from the flank, not from beside the head: at their first
           y=76 start they flanked the skull and read as two drooping EARS,
           which is the one thing a slime is not supposed to have. Ending
           inside the puddle also sells the melt. -->
      ${tube('M 31,88 C 22,94 22,102 29,106 C 23,110 25,116 31,118', 10, bodyColor)}
      ${tube('M 89,90 C 98,96 98,103 92,107', 10, bodyColor)}

      <path d="M 60,54 C 84,54 94,72 92,94 C 90,112 78,122 60,122
               C 42,122 30,112 28,94 C 26,72 36,54 60,54 Z"
        fill="${bodyColor}" ${ol(SW)}/>
      <ellipse cx="60" cy="100" rx="21" ry="17" fill="${BELLY}" ${ol(SW_IN)}/>
      ${shadeCrescent(60, 88, 31, 33)}

      <!-- drips: rounded teardrops hanging off the belly edge, never a
           pointed spike -- the melt reads as ongoing without going sharp. -->
      <path d="M 45,110 C 42,118 43,124 47,124 C 51,123 50,116 48,109 Z"
        fill="${bodyColor}" ${ol(SW_IN)}/>
      <path d="M 72,112 C 70,118 71,122 74,122 C 77,121 76,116 74,111 Z"
        fill="${bodyColor}" ${ol(SW_IN)}/>

      ${droopyEyes(47, 73, 80, 5)}
      ${smirk(60, 94, 6)}
    `)
  )
}

// Grabby: stole Magno's horseshoe and wears it slung on its back with the
// pole caps swapped. Grabby is the only figure in the file carrying a real
// object, which is the point -- on a hero a detachable prop is a design
// failure, on this one it is the crime.
export function creatureGrabby({ bodyColor = '#d5a184', accent = '#ac7c60' } = {}) {
  return svgWrap(
    fig(`
      ${shadow(60, 134, 28)}

      <!-- scale 1.5, not 1.1: at the smaller size the stolen magnet read as a
           hair clip behind one ear instead of as loot. At 1.5 the rotated
           extents reach x=110.3 and y=37.9, both clear of the box. Painted in
           pale steel rather than the body's accent for the same reason -- an
           accent-coloured prop on an accent-trimmed animal disappears into
           the character, and this one has to look like it belongs to someone
           else. Pushed out to (98,50) as well: at (92,58) the body ellipse
           (rx 35) and the right ear covered everything but one thin sliver of
           a leg. From here only the arch's inner leg tucks behind the
           shoulder, and the rotated extents (x 120.3-6 = clear at 116.3
           inked, y from 29.9) still sit inside the box. -->
      <g transform="translate(98,50) rotate(20) scale(1.4)">${archShape('#c2c7cf', '#8fa8c4', '#c98f88')}</g>

      ${roundEar(36, 62, 9, bodyColor, BELLY)}
      ${roundEar(84, 62, 9, bodyColor, BELLY)}
      ${paws(accent, 100)}
      ${feet(accent, 128)}
      ${blob(bodyColor, 60, 92, 35, 36)}
      ${shadeCrescent(60, 92, 35, 36)}

      ${droopyEyes(47, 73, 80, 5)}
      ${smirk(60, 94, 6)}
    `)
  )
}

// Corky: plugs holes with the plated shell across its back. The shell is one
// continuous cap fused over the top of the body (a row of separate bumps read
// as ear tufts in an early draft) with soft seams and rounded plate edges, so
// the face sits low, under its brim.
export function creatureCorky({ bodyColor = '#cbb389', accent = '#9d8563' } = {}) {
  const seam = (x) => `<path d="M ${x},48 C ${x - 2},58 ${x - 2},70 ${x},80" fill="none"
    stroke="${LINE_SOFT}" stroke-width="${SW_IN}"/>`

  return svgWrap(
    fig(`
      ${shadow(60, 134, 31)}

      ${paws(accent, 100)}
      ${feet(accent, 128)}
      ${blob(bodyColor, 60, 92, 36, 37, false)}
      ${shadeCrescent(60, 92, 35, 36)}

      <path d="M 27,66 C 28,42 40,30 60,30 C 80,30 92,42 93,66
               C 94,77 86,83 60,83 C 34,83 26,77 27,66 Z"
        fill="${accent}" ${ol(SW)}/>
      <!-- crown highlight: without it the smooth cap read as an acorn shell
           rather than a plated back. -->
      <path d="M 36,54 C 39,40 48,34 60,34 C 72,34 81,40 84,54
               C 77,47 69,44 60,44 C 51,44 43,47 36,54 Z"
        fill="${BELLY}" opacity="0.35"/>
      ${seam(42)}
      ${seam(60)}
      ${seam(78)}

      ${droopyEyes(47, 73, 94, 5)}
      ${smirk(60, 108, 6)}
    `)
  )
}

// Pixel Muncher, the chapter boss: a toad with the family's biggest, heaviest
// body and one gimmick -- the wide mouth. The earlier version shed sharp
// checkerboard squares along one flank; those went with the rest of the
// angular pass, replaced by three round crumbs, which also removes any chance
// of the erosion settling into a right angle that reads as a letterform.
export function creatureMuncher({ bodyColor = '#a49bb4', accent = '#7e7492' } = {}) {
  // Domed toad eyes: the shells go in before the body so the body's outline
  // cuts across them (they bulge half above the head, the way a real toad's
  // do), but the pupils and lids go in after, or the body would clip the
  // bottom of each pupil.
  const domeShell = (cx) => `
    <circle cx="${cx}" cy="56" r="13" fill="${bodyColor}" ${ol(SW_MID)}/>`
  const domeFace = (cx) => `
    <ellipse cx="${cx}" cy="55" rx="5" ry="5.4" fill="${INK}"/>
    <path d="M ${cx - 8},48 C ${cx - 4},43.5 ${cx + 4},43.5 ${cx + 8},48" fill="none"
      stroke="${INK}" stroke-width="2.1" opacity="0.75"/>`

  return svgWrap(
    fig(`
      ${shadow(60, 136, 40)}

      ${paws(accent, 100, 11, 12)}
      ${feet(accent, 128, 14, 8)}
      ${domeShell(42)}
      ${domeShell(78)}
      ${blob(bodyColor, 60, 94, 40, 36)}
      ${domeFace(42)}
      ${domeFace(78)}
      ${shadeCrescent(60, 94, 40, 36)}

      <!-- the maw, sitting on the belly patch. Teeth are a ROW of four small
           blunt nubs along the upper lip: the first version had two big round
           teeth centred in the dark oval and they read unmistakably as a
           second pair of eyes, which made the real domed eyes above read as
           ears. A row cannot be misread that way. -->
      <path d="M 34,98 C 40,116 80,116 86,98 C 76,92 44,92 34,98 Z"
        fill="${INK}" ${ol(SW_MID)}/>
      <circle cx="45" cy="98" r="2.7" fill="${BELLY}"/>
      <circle cx="55" cy="96" r="2.7" fill="${BELLY}"/>
      <circle cx="65" cy="96" r="2.7" fill="${BELLY}"/>
      <circle cx="75" cy="98" r="2.7" fill="${BELLY}"/>

      <circle cx="16" cy="80" r="3.4" fill="${accent}" stroke="${LINE}" stroke-width="1.2"/>
      <circle cx="104" cy="72" r="3" fill="${accent}" stroke="${LINE}" stroke-width="1.2"/>
      <circle cx="100" cy="110" r="3.8" fill="${accent}" stroke="${LINE}" stroke-width="1.2"/>
    `)
  )
}
