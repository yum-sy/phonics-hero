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
//  2. PRIMARY, FULL-CHROMA FILLS (v10 -- replaces the pastel band outright).
//     The pale coral / pale sky / warm sand pass this file shipped with was
//     rejected: children do not read pastel as exciting. Every body is now a
//     saturated primary -- vivid yellow (Rocket), deep teal (Magno), caramel
//     brown with real steel on the drill (Drillo), hot orange with teal wing
//     membranes (Captain Red) -- and the drawing was left alone everywhere the
//     colour was the only problem. Rocket, Drillo and all five villains changed
//     hue and nothing else; Magno's reclining pose and Captain Red's rebuild
//     were separate briefs that landed in the same pass.
//     The villain side is NOT simply "the same primaries, darker". It differs
//     from the heroes on three axes at once -- hue family, value band, and belly
//     tone -- and the reasoning plus the measured floor that decides how dark a
//     villain body may go are written out at the VILLAINS header below. That
//     block is the authority; do not re-derive it from this summary.
//     Two knock-on values had to move with the fills, because on a pastel body
//     the old ones were the darkest and lightest things on the page and on a
//     vivid body they were not: INK went to #2e2018 (dot eyes have to hold
//     against a mid-value body) and the badge plate to pure white.
//     Measured on the rendered pixels, every emblem letter sits at 15.7:1
//     against its plate. The risk flagged for Rocket -- yellow body plus a
//     near-white plate burying the letter -- did not happen: its plate measures
//     3.09:1 against its surround, the second best in the file, because the
//     badge ring was widened to 3.6 for it. The weakest are Magno at 1.43 and
//     Drillo at 1.40, and in this family the RING is what separates a plate
//     from a light belly, by design, on every figure.
//     The OUTLINE STAYS SEPIA. Swapping #7a5c48 for black is the one change
//     that would cost this family its identity -- black line + primary fill is
//     the toys.js / platformer.js inking, and chapter 4 would stop looking
//     like its own world. Saturated fill under a warm sepia line is the point.
//  3. LIMBS BEHIND THE BODY, ONE CLEAN SILHOUETTE. Stub paws and feet are
//     outlined and emitted BEFORE the body ellipse, so the body's opaque fill
//     eats their inner strokes and the figure reads as one continuous outline
//     with limbs poking out -- the way an inked drawing works.
//  4. DOT EYES, TINY MOUTH, NOTHING ELSE. Two small dark ellipses and one
//     short mouth stroke carry the whole face: no sclera, no highlight dot,
//     no brows on heroes. Expression lives in the lid alone -- heroes plain
//     dots, Magno a half-lid, villains a lid drooping toward the OUTSIDE
//     corner (sulky/sly, never angry; an inward-up brow is the angry read).
//     Captain Red is the deliberate exception on two counts, both earned by
//     being the evolved form: it has a brow RIDGE (a flat accent crescent, not
//     a stroke) and an open maw with two fangs instead of a mouth stroke. A
//     round head with two dots and a small smile could not be made to read as
//     a dragon -- see its own note. The dot eyes themselves are unchanged.
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
//     letter. A tinted badge disappears on any body, pastel or vivid, so the
//     badge plate is the lightest value in the figure, ringed in the sepia
//     outline, with the letter in the darkest ink -- the contrast is structural
//     rather than a colour choice a palette override could weaken. Positioned
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
// Eyes and mouth. Darker than the pastel pass needed: a dot eye has to hold
// against a full-chroma body, and #3f2d22 on saturated brown or plum was only
// ~1.6:1. Still a warm brown-black, never pure black -- the sepia line and the
// ink belong to the same family.
const INK = '#2e2018'
const BADGE = '#ffffff' // emblem plate: pure white now, see grammar rule 2
const BELLY = '#fdf1e0' // shared warm cream underside
const FLAME = '#ff6a1a' // outer flame: hot orange, layered inward to yellow
const FLAME_MID = '#ffa826'
const FLAME_CORE = '#ffe86b'
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
// op raised from 0.13 with the move to full chroma: a 13% sepia wash was
// legible over pastel and vanished over saturated yellow and teal.
function shadeCrescent(cx, cy, rx, ry, op = 0.17) {
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
// `ring` exists for one figure: Rocket's body went vivid YELLOW, whose value
// sits close enough to a white plate on a cream belly that the plate's only
// separation is the ring itself, so Rocket asks for a heavier one.
function emblemBadge(cx, cy, r, plateColor, label, size, ring = SW_BADGE) {
  return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${plateColor}" ${ol(ring)}/>
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
//
// `bellyFill` is here for Rocket alone: a neutral cream belly on a vivid yellow
// body left the white badge plate with nothing to sit against, so Rocket tints
// its belly a pale amber -- a lighter shade of its own body, which is how the
// electric-rodent reference does the underside anyway.
function blob(fill, cx, cy, rx, ry, withBelly = true, bellyFill = BELLY) {
  return `
    <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${ol(SW)}/>
    ${withBelly
      ? `<ellipse cx="${cx}" cy="${cy + ry * 0.4}" rx="${rx * 0.8}" ry="${ry * 0.44}"
           fill="${bellyFill}" ${ol(SW_IN)}/>`
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
  bodyColor = '#ffc61a',
  accent = '#ef9506',
  emblem = 'R',
  visorColor = BADGE,
} = {}) {
  // The cheek disc is Rocket's signature and has to win the face at 66 px.
  // v9 pushed it from a coral-red to a true red: on the old pale-coral body a
  // #f4664c disc was already the loudest thing in the figure, on vivid yellow
  // it was a near-neighbour hue and went quiet. Red on yellow is the widest
  // hue gap the palette can spend here. It also carries the limb-weight
  // outline (2.0) instead of a seam weight, so it reads as a feature rather
  // than a shading patch.
  const CHEEK = '#e8281a'
  // Belly one step lighter than the body instead of neutral cream -- see blob().
  const BELLY_LT = '#ffeeb4'
  // Ear tips went from `accent` to a dark burnt amber. The tip marking exists
  // so the ear END is findable at map-node size (softEar's own note); amber on
  // yellow is a two-step value gap and stopped doing that job once the body
  // went vivid. It also gives an otherwise very high-key figure a dark accent
  // that is not the outline.
  const EAR_TIP = '#8a5410'
  return svgWrap(
    fig(`
      ${shadow(60, 132, 30)}

      ${softEar(42, 52, 12, 40, -14, bodyColor, BELLY_LT, EAR_TIP)}
      ${softEar(78, 52, 12, 40, 14, bodyColor, BELLY_LT, EAR_TIP)}

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

      ${blob(bodyColor, 60, 88, 36, 36, true, BELLY_LT)}
      ${shadeCrescent(60, 88, 36, 36)}

      <!-- cheek radius 10.5, from v7's 6.5 -- 2.6x the area. This is the
           largest disc the body can hold on that centre: at y=93 the rx=36
           body's left edge is x=24.35, and 36.5-10.5 = 26 clears it by 1.65
           with the outline's half-width inside that margin. -->
      <circle cx="36.5" cy="93" r="10.5" fill="${CHEEK}" ${ol(SW_MID)}/>
      <circle cx="83.5" cy="93" r="10.5" fill="${CHEEK}" ${ol(SW_MID)}/>

      ${dotEyes(47, 73, 76, 5)}
      ${mouth(60, 86, 5)}

      <!-- ring 3.6 rather than the file's 3.0: white plate on a pale amber
           belly on a yellow body is three high-value shapes stacked, so the
           ring is the only thing separating the plate. The LETTER's contrast
           is unaffected either way -- near-black ink on white. -->
      ${emblemBadge(60, 107, 14, visorColor, emblem, 20, 3.6)}
    `)
  )
}

// Magno (M): the big sleepy one, and BULK IS THE SPECIES CUE. v9 changes the
// POSE, because scale alone had stopped paying. v8 pushed the standing body to
// 92x80 (77% of the viewBox width) and it still did not feel full: a standing
// silhouette is tall, so it spends its height on air. Measured, v8 painted
// 44.7% of the box and left the top 39.5 units (28% of the height) completely
// empty. v9 sits the figure back on the floor instead: a low reclining mass
// 110 wide with the head sunk into it, arms flopped out along the flanks, and
// both SOLES turned to face the viewer at the bottom corners. Reclining is
// what buys the width, and the forward-facing soles are what say "this thing
// is not standing up" at a glance.
//
// Deliberate departure from grammar rule 3 (limbs behind the body): the arms
// and the feet are emitted AFTER the mass and keep their own outlines. A sole
// pointed at the viewer is in front of the belly by definition, and hand-drawn
// reclining-giant art draws it exactly that way. The single-silhouette read
// survives because both feet break the mass's outline at the bottom corners
// (the body's edge is at x=27.3 where the left foot reaches x=7), so the
// outline still gains lobes rather than losing them.
//
// The magnet survives only as the ARCH SHAPE of the ears, body-coloured with
// no pole caps, now swept back at 42 deg instead of 12: laid-back ears are
// half of what makes a head read as tipped back.
// v9 also recoloured it: pale sky -> deep teal. The pose is untouched.
export function creatureMagno({
  bodyColor = '#17a8ab',
  accent = '#0c7f85',
  emblem = 'M',
  visorColor = BADGE,
} = {}) {
  // Pale AQUA rather than the file's neutral cream, and this is a legibility
  // fix, not a taste one. Magno's belly patch is the biggest light shape in the
  // file (92x46) and the white emblem plate sits inside it: in cream the two
  // measured 1.12:1 apart, so at 96 px the plate dissolved into the patch and
  // the letter looked like it was floating on the belly. A tint of the body's
  // own hue drops that to a still-low but visibly different value while keeping
  // the underside reading as an underside. The letter itself is unaffected --
  // it is near-black ink on a white plate either way, which is the contrast
  // that actually has to hold.
  // The paw and sole pads stay cream: they sit on the DARK accent, where cream
  // is already the high-contrast choice, and tinting them too would have put
  // four more aqua shapes on an aqua-bellied figure.
  const BELLY_AQ = '#a5e3e4'
  // The reclining mass. Written as one symmetric path rather than an ellipse
  // because the bottom has to be FLAT (weight resting on the floor) while the
  // shoulders taper, which no ellipse does. Inked extents, stroke included:
  // x 3.7..116.3, y 48.7..128.3.
  const RIGHT_FLANK = `C 95,127 116,114 115,96 C 113,72 96,50 60,50`
  const body = `
    <path d="M 60,50 C 24,50 7,72 5,96 C 4,114 25,127 60,127 ${RIGHT_FLANK} Z"
      fill="${bodyColor}" ${ol(SW)}/>`
  // Cel shade for a mass that is not an ellipse, so shadeCrescent() cannot be
  // used: the crescent's outer edge REUSES the body path's own right-flank
  // cubics verbatim, which is the only way to guarantee it stays flush with
  // the silhouette, and closes with a bow through x=84 so it tapers to nothing
  // at both poles the way shadeCrescent's does. The bow passes right of the
  // badge (x 44.5..75.5) at every height, so the letter plate is never dimmed.
  const bodyShade = `
    <path d="M 60,127 ${RIGHT_FLANK} C 78,62 84,80 84,92 C 84,108 76,119 60,127 Z"
      fill="${LINE}" opacity="0.17"/>`

  // Arm: flopped out from beside the head and down the flank, ending in a paw
  // resting on the belly with its palm showing. Written once on the left and
  // mirrored. The tube's outer half-width is 9.5, so the path's own min x of
  // 18.4 inks to 8.9, inside the body edge: the arm reads as a heavy limb
  // lying ON the mass, not as a stub poking out of it.
  // The palm faces the viewer for the same reason the soles do, and carries a
  // scaled-down version of the same pad cluster, so hands and feet read as
  // parts of one animal rather than two unrelated blobs.
  const arm = `
    ${tube('M 36,60 C 24,66 17,76 20,88', 15, accent)}
    <ellipse cx="18" cy="92" rx="11" ry="9.5" fill="${accent}" ${ol(SW_MID)}/>
    <g fill="${BELLY}" ${ol(SW_IN)}>
      <ellipse cx="12.5" cy="87" rx="2.6" ry="2.2"/>
      <ellipse cx="18" cy="85.5" rx="2.6" ry="2.2"/>
      <ellipse cx="23.5" cy="87" rx="2.6" ry="2.2"/>
      <ellipse cx="18" cy="95" rx="6.5" ry="4.8"/>
    </g>`

  // Sole turned to face the viewer: three claws poking above the foot's top
  // edge, three toe pads and one big heel pad on the sole itself. The claws go
  // in BEFORE the foot so the foot's fill eats their bases and only the tips
  // show. Rightmost claw inks to x=42.5, clear of the badge's x=44.5.
  const claw = `M -3.2,4.5 C -4,-1 -2,-5.5 0,-5.5 C 2,-5.5 4,-1 3.2,4.5 Z`
  const foot = `
    <g fill="${BELLY}" ${ol(SW_IN)}>
      <path d="${claw}" transform="translate(16,112)"/>
      <path d="${claw}" transform="translate(27,110)"/>
      <path d="${claw}" transform="translate(38,112)"/>
    </g>
    <ellipse cx="27" cy="122" rx="20" ry="13" fill="${accent}" ${ol(SW_MID)}/>
    <g fill="${BELLY}" ${ol(SW_IN)}>
      <ellipse cx="16" cy="116" rx="4" ry="3.2"/>
      <ellipse cx="27" cy="114" rx="4" ry="3.2"/>
      <ellipse cx="38" cy="116" rx="4" ry="3.2"/>
      <ellipse cx="27" cy="127" rx="13" ry="6.5"/>
    </g>`

  return svgWrap(
    fig(`
      <!-- the mass reaches y=127 itself, so the ground shadow only shows in
           the gap between the two soles, which is where ground contact is
           actually visible on a figure sitting down. -->
      ${shadow(60, 136, 44)}

      <g transform="translate(38,30) rotate(-42) scale(1.2)">${archShape(bodyColor)}</g>
      <g transform="translate(82,30) rotate(42) scale(-1.2,1.2)">${archShape(bodyColor)}</g>

      ${body}
      <!-- belly patch: 92 wide by 46 tall (aspect 2.0) against a round r=14
           badge. The aspect gap is what stops the two pale shapes reading as
           one dartboard, which is the failure this file already had once; the
           badge also sits 5 units above the patch's centre rather than on it,
           so they are not concentric either. -->
      <ellipse cx="60" cy="102" rx="46" ry="23" fill="${BELLY_AQ}" ${ol(SW_IN)}/>
      ${bodyShade}

      ${arm}
      ${mirrored(arm)}
      ${foot}
      ${mirrored(foot)}

      <!-- head: wider than tall (64x50) and dropped so 20 units of it are
           behind the mass. Drawn after the limbs so it swallows the arm roots
           at x=36/84 the way rule 3 wants. -->
      <ellipse cx="60" cy="45" rx="32" ry="25" fill="${bodyColor}" ${ol(SW)}/>
      ${shadeCrescent(60, 45, 32, 25)}
      <!-- the underside of the jaw, visible because the head is tipped back.
           Eyes sit ABOVE the head's centre for the same reason. -->
      <ellipse cx="60" cy="60" rx="21" ry="9.5" fill="${BELLY_AQ}" ${ol(SW_IN)}/>

      ${sleepyEyes(43, 77, 40, 7)}
      ${mouth(60, 58, 5)}

      ${emblemBadge(60, 97, 14, visorColor, emblem, 20)}
    `)
  )
}

// Drillo (D): burrowing mole. The drill is the SNOUT, and as of v8 it is a
// real PROTRUDING cone rather than a spiral engraved on a flat muzzle -- at
// v7 the groove sat on the muzzle's surface and the figure read as a bear
// with a swirl on its nose. The cone leaves the face down-and-left and its
// rounded tip crosses the body outline, so the snout is part of the
// silhouette.
//
// v10 recoloured it to the brief's "brown plus a metal finish": a caramel-brown
// body (#b06a2c, up from pale sand #e6c894) with the cone in real STEEL rather
// than the ochre it used to share with the fur. Cool grey against warm brown is
// the widest separation available without a second hue, so the drill now reads
// as hardware bolted to an animal instead of as a differently-shaded nose --
// which is the whole point of the character.
export function creatureDrillo({
  bodyColor = '#b06a2c',
  accent = '#8a4d18',
  emblem = 'D',
  visorColor = BADGE,
} = {}) {
  // STEEL, WITHOUT A GRADIENT. SVG gradients are banned in this project, so the
  // machined look is built the only way flat colour can build it: five vertical
  // FACES stacked across the cone, dark on the shaded right rim through to a
  // near-white specular band left of centre. Five steps is the point -- three
  // read as stripes, five read as a turned surface.
  //
  // Every face is generated by `wedge(f)`, which takes the cone's OWN edge
  // cubic and scales only its x by f. Scaling x on an x-symmetric convex shape
  // can only move a point inward, so no face can poke through the outline no
  // matter what f is, and every face still meets the tip at (0,52) and the
  // mouth's midpoint at (0,-6.9) -- i.e. the faces converge exactly where a
  // real cone's do. Negative f mirrors to the right side. This is the same
  // "reuse the silhouette's own path" trick Magno's body shade uses, and it is
  // why this pass needed no clipping fixes.
  const STEEL = '#8b98a8'
  const STEEL_DK = '#4d5766'
  const STEEL_LT = '#ccd6e0'
  const STEEL_HI = '#f2f6fa'
  const FLUTE = '#3c4553'
  const wedge = (f, fill) => `<path d="M 0,-6.9 Q ${(-6.8 * f).toFixed(2)},-6.9 ${(-9.5 * f).toFixed(2)},-2
    C ${(-9.5 * f).toFixed(2)},16 ${(-5.5 * f).toFixed(2)},38 0,52 Z" fill="${fill}"/>`
  // Local space: the cone's mouth is the +-9.5 wide arc at y~0, the tip is at
  // y=52. Four curved bands cross it, each bowing the same way, which is what
  // makes a smooth taper read as a drill flute without a single straight edge
  // or corner anywhere in the shape. Band half-widths (8.6/7.2/4.4/2.6) were
  // taken off the cubic's actual width at each height, not guessed, so no band
  // pokes through the cone's edge. They are drawn LAST, over all five faces, so
  // the banding ties the faces into one object instead of striping each.
  const drill = `
    <path d="M -9.5,-2 C -9.5,-8.5 9.5,-8.5 9.5,-2 C 9.5,16 5.5,38 0,52
             C -5.5,38 -9.5,16 -9.5,-2 Z"
      fill="${STEEL}" ${ol(SW_MID)}/>
    ${wedge(-1, STEEL_DK)}${wedge(-0.55, STEEL)}
    ${wedge(0.62, STEEL_LT)}${wedge(0.45, STEEL_HI)}${wedge(0.18, STEEL_LT)}
    <path d="M -8.6,9 C -3,13.5 3,13.5 8.6,9" fill="none" stroke="${FLUTE}" stroke-width="2.1"/>
    <path d="M -7.2,22 C -2.6,26.5 2.6,26.5 7.2,22" fill="none" stroke="${FLUTE}" stroke-width="2.1"/>
    <path d="M -4.4,35 C -1.6,38.5 1.6,38.5 4.4,35" fill="none" stroke="${FLUTE}" stroke-width="2.1"/>
    <path d="M -2.6,44 C -1,46.5 1,46.5 2.6,44" fill="none" stroke="${FLUTE}" stroke-width="1.8"/>`

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
      <!-- muzzle collar in warm cream, not the badge's pure white: on the old
           sand body the two whites were indistinguishable anyway, but against
           brown a second pure-white disc 30 units above the emblem plate reads
           as a second badge and the eye has to pick which one carries the
           letter. -->
      <circle cx="58" cy="78" r="9.5" fill="${BELLY}" ${ol(SW_MID)}/>
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

// Captain Red, the evolved boss form -- a flame dragon, and the one figure in
// the file that has to look like it outranks the others. v10 rebuilt it from
// the ground up, because v9 had left it as a round pastel body with two blunt
// nubs on top: the head was fused straight onto the mass, the wings were one
// flat cream shape, and its bounding box was no bigger than Rocket's, so
// "evolved form" was carried by nothing at all.
//
// Four structural changes, in order of how much they buy:
//
//  1. A NECK AND A REAL DRAGON HEAD, drawn as separate masses. The head is its
//     own ellipse 57 units above the body's centre, bridged by a tube that both
//     ends swallow, and it carries a projecting cream MUZZLE whose bottom edge
//     breaks the head's outline by 5 units. A snout that stays inside the head
//     outline is just a face marking; it has to cross the silhouette to read as
//     a snout. Every other figure here is a head-less blob, so the neck alone
//     separates this one at a glance.
//  2. TWO-TONE WINGS, which is the strongest species cue and was being spent on
//     a single flat fill. The membrane is teal and the leading-edge ARM plus
//     three finger struts are deep orange, i.e. the colour break follows the
//     wing's actual anatomy rather than being a decorative stripe.
//  3. BACKSWEPT HORNS, rooted inside the head so only the swept length shows.
//     Blunt forward nubs read as ears; a horn has to go BACK.
//  4. A THREE-LAYER FLAME at 32x28 (v9: 28x24), orange -> amber -> yellow core.
//
// On the copyright boundary (CLAUDE.md): the brief asked for orange with teal
// wing membranes, which is close to the trademark character's colour placement,
// so the separation is carried by everything else -- a chibi 3-lobed wing with
// visible orange struts instead of a plain membrane, a round stub-limbed body
// with a cream belly patch and a chest star badge, dot eyes, a closed smile,
// and the family's sepia outline. The silhouette is not the original's and no
// logo or marking is borrowed.
export function creatureCaptainRed({
  bodyColor = '#f4600f',
  panelColor = '#ffdca6',
  accent = '#c94409',
  visorColor = BADGE,
} = {}) {
  const WING_MEM = '#1a9ea8' // teal membrane
  const WING_ARM = '#d9490f' // leading-edge arm and finger struts
  // Horns are TEAL, not a warm brown. The first attempt made them dark amber
  // and in a hard cutout they merged with the orange wing struts into one spiky
  // thicket -- two horns and six struts all reading as the same kind of spine.
  // Teal ties them to the wings as the figure's second colour while putting the
  // widest possible value gap against the orange head they sit on.
  const HORN = '#0e7a84'

  // Every wing coordinate is an absolute viewBox value in [6,54]; mirrored()
  // maps x -> 120-x, so the mirror lands in [66,114]. The failure an earlier
  // pass hit (a polygon scaled to x=-54, then mirrored to x=174) cannot recur
  // from a shape written this way.
  //
  // THE WING GEOMETRY IS A SILHOUETTE FIX, and the hard cutout is what forced
  // it. The first v10 wing was a shallow fan beside a 84-wide body: it cleared
  // the body's edge by only 13 units, so in cutout the wing lobes were ripples
  // on one continuous blob and the two tips read as ears. Three changes, all
  // measured against the cutout rather than the colour render:
  //   * the body narrowed from rx 42 to rx 35, so each wing now protrudes 19
  //     units past it instead of 13,
  //   * the leading edge climbs to y=18, level with the head's top, and the tip
  //     sits at x=8 while the head starts at x=35 -- a 27-unit notch of clear
  //     background between wing tip and skull, which is the single feature that
  //     makes the silhouette read "winged" rather than "lumpy",
  //   * the trailing lobes cut deeper (to x=6/8/14 from 8/10/14) and the lowest
  //     one now hangs to y=98, below the body's shoulder, so the wing breaks the
  //     outline at the bottom as well as the top.
  //
  // The trailing edge's three lobes are listed once here and REUSED verbatim by
  // the shade path below, which is the only way to guarantee the shade stays
  // flush with the wing's own edge rather than drifting a unit off it.
  // The arm tube's round cap is the westernmost ink in the figure, and it is
  // 5.5 units wide on each side of its own path, so the tip sits at x=10 rather
  // than the 8 it wants: at 8 the cap inked to x=2.5, and this file has already
  // lost a session to a 13%-opacity shadow clipping at y=142. 4.5 units of
  // margin, matching the deepest lobe notch's 4.7, is the budget.
  const LOBES = `C 16,30 13,38 6,42 C 17,50 17,62 8,70 C 21,78 23,90 14,98`
  const ARM = 'M 50,86 C 40,58 22,26 10,19'
  const wing = `
    <path d="M 50,86 C 40,58 22,26 10,19 ${LOBES} C 34,98 48,92 50,86 Z"
      fill="${WING_MEM}" ${ol(SW)}/>
    <path d="M 14,98 C 23,90 21,78 8,70 C 17,62 17,50 6,42 C 13,38 16,30 10,19
             C 28,58 26,60 14,98 Z"
      fill="${LINE}" opacity="0.15"/>
    ${tube(ARM, 7, WING_ARM)}
    ${tube('M 20.4,29.8 C 16,34 12,38 10.5,41', 3.4, WING_ARM)}
    ${tube('M 30.5,44.5 C 24,52 16,60 12.5,67.5', 3.4, WING_ARM)}
    ${tube('M 39.2,60.5 C 34,72 26,84 18.5,94', 3.4, WING_ARM)}`

  // Horn. Swept at 34 deg, not the 42 of the first try: at 42 the tips landed at
  // x=31, close enough to the wing arm that in a cutout the horns joined the
  // struts into one undifferentiated thicket of spines.
  //
  // The length and the TAPER are what stop it reading as an ear, and this took
  // a second pass to get. At 32 units long the horn's visible portion -- the
  // part clear of the head -- was 15 long and 10 wide where it left the skull,
  // and a 0.67 width-to-length wedge on top of a round head is a cat ear, which
  // is exactly what the cutout showed. Now the horn runs to local y=-28 with the
  // width collapsing early (half-width ~5.5 by y=-5 instead of ~7), so 23 units
  // show above the skull at 11 wide: ratio 0.48, which is a horn.
  // Root at (48,32)/(72,32) is inside the head ellipse (half-width 24.0 there,
  // i.e. x 36..84) so the base is swallowed and only the swept length shows, and
  // the tip lands at (32.4, 8.8) -- inked 7.8 from the top edge.
  // The dark face REUSES the horn's own right edge verbatim, so it cannot poke
  // through the outline, and closes with an inner curve. Two flat faces is all
  // the roundness a banned-gradient horn can have, and without it the horn read
  // as a flat paper triangle at 340 px.
  const horn = `
    <path d="M -7,10 C -6,0 -3.5,-14 0,-28 C 3.5,-14 6,0 7,10 Z"
      fill="${HORN}" ${ol(SW_MID)}/>
    <path d="M 1.6,9.5 C 2.6,-1 2.2,-14 0,-28 C 3.5,-14 6,0 7,10 Z"
      fill="#0a5d66"/>`

  return svgWrap(
    fig(`
      ${shadow(60, 136, 44)}

      ${wing}
      ${mirrored(wing)}

      <!-- tail and flame in absolute coordinates, no rotate wrapper (a local-
           space curve carried through one is what pushed an earlier version
           32 units off the bottom edge). Both go in BEFORE the body so the
           body's fill eats the overlap and the flame reads as rising from
           behind the hip. Tail: half-width 6 plus outline 2 budgeted into every
           point, max x 103+8=111, max y 124+8=132. Flame 32x37 (v9: 28x24),
           extents x 85..117 y 100..137, inked 83.7..118.3 x 98.7..138.3.
           Three layers, orange to amber to yellow core -- the layering is what
           the brief meant by a flame that reads as hot rather than as an
           orange leaf. -->
      ${tube('M 86,112 C 98,113 103,118 101,124', 12, accent)}
      <path d="M 101,100 C 117,112 115,130 101,137 C 87,130 85,112 101,100 Z"
        fill="${FLAME}" ${ol(SW_MID)}/>
      <path d="M 101,108 C 112,117 111,130 101,134 C 91,130 90,117 101,108 Z"
        fill="${FLAME_MID}"/>
      <path d="M 101,116 C 108,122 107,130 101,132 C 95,130 94,122 101,116 Z"
        fill="${FLAME_CORE}"/>

      <!-- feet at cy=129, not 131: at 131 the ry=7.5 stub plus its 2.0 outline
           inked to y=139.5, half a unit from the frame. -->
      ${paws(accent, 98, 11.5, 12.5)}
      ${feet(accent, 129, 15, 7.5)}

      <!-- neck, and it is DRAWN AS A MASS rather than as a tube because it has
           to be seen. The tube version was invisible: a stroke from head-centre
           to body-centre is covered at both ends by the very shapes it joins,
           leaving nothing in the gap. Even as a mass it only became visible once
           the head moved UP to cy=38 -- at cy=42 the muzzle's own bottom edge
           reached y=70 and covered the whole gap by itself, so the head still
           sat straight on the body.
           The second thing it needed was to be WIDER THAN THE MUZZLE. At x
           48..72 the neck was exactly as wide as the snout above it, so the
           snout's flare covered both flanks and the neck was again invisible in
           the render even though the geometry said it was there. At 42..78
           against a 28-wide muzzle, 20 units of neck show on each side, between
           the head's underside at y=53.4 and the body's crown at y=74.1. The
           bottom edge at y=79 is inside the body's own crown (35.7..84.3 there)
           so the join is swallowed. -->
      <path d="M 42,48 C 40,58 40,69 42,79 L 78,79 C 80,69 80,58 78,48 Z"
        fill="${accent}" ${ol(SW)}/>

      ${blob(bodyColor, 60, 102, 35, 32, true, panelColor)}
      ${shadeCrescent(60, 102, 35, 32)}

      <g transform="translate(48,32) rotate(-34)">${horn}</g>
      <g transform="translate(72,32) rotate(34)">${horn}</g>

      <ellipse cx="60" cy="38" rx="25" ry="21" fill="${bodyColor}" ${ol(SW)}/>
      ${shadeCrescent(60, 38, 25, 21)}

      <!-- brow ridge: a shallow crescent in the accent, the one thing that
           stops a round head with two dots on it reading as a cub. Kept to a
           value step rather than a new hue, because a loud brow on a hero this
           young an audience has to like would tip it into angry. -->
      <path d="M 38,29 C 43,21 51,19 60,19 C 69,19 77,21 82,29
               C 75,25 67,24 60,24 C 53,24 45,25 38,29 Z"
        fill="${accent}"/>

      <!-- SNOUT. Two failed attempts are worth recording, because the fix was
           not the one that looks obvious. First it was a 30-wide rounded cream
           pad with two round nostrils low in the middle, which read as a COW.
           Narrowing it to 22 made that worse, not better -- a small cream tab
           hanging off a round head reads as a bib. What actually carries "snout"
           is the JAW, so the muzzle went back to 28 wide and the smile was
           replaced by an open grinning maw with two fangs, and the nostrils
           moved up to the bridge and in to 7 units apart. Nostrils sitting low
           and 12 apart are a second pair of eyes on any face; up on the bridge
           and close together they can only be nostrils.
           A third pass fixed the TOP EDGE, which was the last thing keeping it
           from working. A straight horizontal cut across the muzzle's top made
           it a pale patch stuck on the face and, with the taper below, that
           patch read as a hanging chin. The top now DOMES to y=40.5, so it
           reads as the bridge of a snout continuing out of the forehead. It
           stops 3.9 units short of the eyes' undersides at 37.6.
           The muzzle's bottom (65) clears the head's own outline (59) by 6, so
           the snout is part of the silhouette rather than a mark inside it. -->
      <path d="M 46,47 C 47,40 73,40 74,47 C 75,56 70,65 60,65 C 50,65 45,56 46,47 Z"
        fill="${panelColor}" ${ol(SW_MID)}/>
      <ellipse cx="56.5" cy="45" rx="1.8" ry="1.4" fill="${INK}"/>
      <ellipse cx="63.5" cy="45" rx="1.8" ry="1.4" fill="${INK}"/>
      <!-- the maw's upper edge bows UP, which is the whole difference between a
           grin and a snarl on a figure that has to stay likeable. Fangs are
           taller than wide and sit at the CORNERS: Muncher's note in this file
           records that two round teeth centred in a dark mouth read as eyes,
           and this is the same shape, so both of that failure's conditions
           (round, centred) are avoided. -->
      <path d="M 52,53 Q 60,49.5 68,53 Q 60,62 52,53 Z" fill="${INK}" ${ol(SW_MID)}/>
      <ellipse cx="55.5" cy="56.5" rx="1.6" ry="2.7" fill="#fff6e2"/>
      <ellipse cx="64.5" cy="56.5" rx="1.6" ry="2.7" fill="#fff6e2"/>

      <!-- eyes at r=4.6 and 20 apart, down from r=5.2 and 22. On a head this
           size the bigger pair were two black voids taking a third of the face
           each and, with the maw below them, the whole head read as a mask.
           This is still the largest eye in the file (the small heroes use 4.8
           to 5.0) which is what an evolved form should have. -->
      ${dotEyes(50, 70, 33, 4.6)}

      ${emblemBadge(60, 114.5, 14, visorColor, '★', 21)}
    `)
  )
}

// ---------------------------------------------------------------------------
// VILLAINS. Same sepia-outline language as the heroes -- an inked hero next to
// a differently-inked villain was the "these do not belong together" complaint
// that produced this revision -- with the droopy outside-corner lid and a
// lopsided smirk instead of the heroes' plain dots and level smile. No chest
// badge: the letters belong to the heroes.
// Villains take only { bodyColor, accent }.
//
// v10 PALETTE SPLIT. When both sides were pastel the client's complaint was
// that hero and villain looked the same, and simply saturating both sides would
// have reproduced that with louder colours. So the two sides now differ on
// three axes at once:
//
//   * HUE FAMILY. The heroes hold warm-and-bright plus one cyan: yellow 45deg
//     (Rocket), orange 25 (Captain Red), brown 28-dark (Drillo), cyan 181
//     (Magno). The villains hold the cool and off-primary half of the wheel:
//     violet 260 (Flippy), blue 217 (Corky), red 1 (Grabby), green 105
//     (Slippy), magenta 313 (Muncher). No two figures in the file share a hue
//     neighbourhood, which the pastel pass could not say -- Drillo, Grabby and
//     Corky were three tans within one step of each other.
//   * VALUE BAND. The villains sit in a deliberately narrow mid-dark band
//     (relative luminance 0.17-0.21, plus Muncher lower still at 0.09) while
//     the heroes span 0.16 to 0.62. Five figures at one dark value read as a
//     faction; four figures at wildly different values read as individuals,
//     which is what the two sides are.
//   * BELLY TONE. The heroes' underside patches stay in the clean cream/white
//     family. Every villain's is a DULLED tint of its own body instead -- the
//     "one step duller" instruction applied where it actually shows, since on a
//     dark body the belly is the largest light shape and a clean cream one
//     would have been the brightest thing on the villain side of the screen.
//
// The floor on how dark a villain may go is set by its EYES, not by taste: the
// dot eyes are INK (#2e2018) with no sclera and no outline, so the body they sit
// on has to stay above ~3:1 against ink or the face turns to mush. Measured, at
// these values: Flippy 3.53, Corky 3.30, Grabby 3.33, Slippy 4.33. Muncher is
// the exception and is allowed to go to 0.09 because its eyes moved off the body
// onto pale domes -- see its own note.
// ---------------------------------------------------------------------------

// Flippy: inverts the child's jump, so it hangs upside down. Built upright
// and flipped with y -> 140-y, which is also why nothing here can leave the
// box: that map sends [0,140] onto itself. The face is drawn AFTER the flip,
// upright, so the droopy lids still droop.
export function creatureFlippy({ bodyColor = '#8a5fd6', accent = '#6a3fae' } = {}) {
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
    <!-- this is the only "belly" Flippy has, and it needs no explicit tint: a
         half-opacity cream over the violet body composites to #c3a8db, which is
         already the dulled body tint the other four villains got by hand. It
         also lands right under the eyes after the flip, so the face gets the
         lightest field on the figure for free. -->
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
export function creatureSlippy({ bodyColor = '#3f8f2a', accent = '#2c6b1c' } = {}) {
  // Dulled tint of the body, per the villain note -- and dulled twice. The
  // first value (#c9dfb4) measured out as the brightest shape on the whole
  // villain side of the cast, and on a figure whose belly patch sits directly
  // under the eyes it read as a pale muzzle rather than an underside.
  const BELLY_GN = '#a9c98e'
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
      <ellipse cx="60" cy="100" rx="21" ry="17" fill="${BELLY_GN}" ${ol(SW_IN)}/>
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
export function creatureGrabby({ bodyColor = '#cc4340', accent = '#9c2a2c' } = {}) {
  // Grabby moved OFF brown, and not for its own sake: Drillo took the saturated
  // brown this pass, and a tan villain shaped like a round bear standing next to
  // a brown hero shaped like a round bear was the single worst hero/villain
  // collision in the pastel file. Red is the farthest the villain half of the
  // wheel can get from Drillo while staying a primary.
  // Dulled tint of the body, per the villain note -- and dulled twice, for the
  // same reason as Slippy's. Grabby's belly patch is the largest light shape on
  // any villain (a 56x30 oval on a 70-wide figure), so at #f2d3c4 it was the
  // whole character: a pale pink bear rather than a dark red one.
  const BELLY_RD = '#e0a898'
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
      <!-- the warm pole cap went from a dusty pink to brass. A magnet's poles
           are conventionally red and blue, but Grabby's body is now red, and a
           red cap on a red animal loses exactly the "this belongs to someone
           else" read the pale steel was chosen for. Brass keeps two metal tones
           on the prop and nothing on it borrows the body's hue. -->
      <g transform="translate(98,50) rotate(20) scale(1.4)">${archShape('#c2c7cf', '#8fa8c4', '#e2c15c')}</g>

      ${roundEar(36, 62, 9, bodyColor, BELLY_RD)}
      ${roundEar(84, 62, 9, bodyColor, BELLY_RD)}
      ${paws(accent, 100)}
      ${feet(accent, 128)}
      ${blob(bodyColor, 60, 92, 35, 36, true, BELLY_RD)}
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
//
// v10: blue body, SLATE shell. Corky is the one villain whose accent covers
// half the figure, so making the accent a darker blue would have produced a
// two-tone blue lump; a grey-slate cap over a blue body says "armour bolted to
// an animal", which is the character. It also puts the shell a step LIGHTER
// than the body, so the brim's edge is visible at 96 px -- in the tan pass the
// cap and body were one value apart and the brim vanished.
export function creatureCorky({ bodyColor = '#3a72c4', accent = '#5b6b82' } = {}) {
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
export function creatureMuncher({ bodyColor = '#932a80', accent = '#6b1c5c' } = {}) {
  // Muncher is the chapter boss and is allowed to be the DARKEST figure in the
  // file -- luminance 0.088, half the value of the other four villains -- which
  // is only possible because of the domes below. Every other villain's floor is
  // set by ink dot eyes sitting directly on the body; move the eyes onto a pale
  // field and that floor disappears, so the boss can go as dark as it wants.
  const BELLY_MG = '#e9bcd6' // dulled tint of the body, per the villain note
  // Domed toad eyes: the shells go in before the body so the body's outline
  // cuts across them (they bulge half above the head, the way a real toad's
  // do), but the pupils and lids go in after, or the body would clip the
  // bottom of each pupil.
  //
  // The domes are ACID YELLOW rather than body-coloured, and it does two jobs
  // at once. Legibility: an ink pupil on #932a80 measures 2.0:1 and turns to
  // mush, on #e8d84a it measures 10.7:1 -- the best eye contrast in the file.
  // Character: a pale amphibian eye with a small dark pupil is the one facial
  // arrangement in this soft-lined family that can look predatory, which is
  // what the chapter boss needed and the pastel version could not do.
  const DOME = '#e8d84a'
  const domeShell = (cx) => `
    <circle cx="${cx}" cy="56" r="13" fill="${DOME}" ${ol(SW_MID)}/>`
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
      ${blob(bodyColor, 60, 94, 40, 36, true, BELLY_MG)}
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
