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
//     Captain Red is the deliberate exception, earned by being the evolved
//     form: two brow RIDGES (flat accent crescents, one per eye, not strokes),
//     an OVERBITE of two pale fangs hanging past the jaw, and -- since v11 --
//     an ASYMMETRIC eye pair, the near one larger, because its head is turned
//     three-quarter rather than front-on. A round head with two dots and a
//     small smile could not be made to read as a dragon; a front-facing head
//     could not either, for a reason that is geometric rather than aesthetic.
//     See its own note.
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
//     Two shapes in the file are not ellipses and so cannot use the helper --
//     Captain Red's head path and Drillo's drill cone. Both keep the rule by
//     the same trick: their shade REUSES the shape's own edge segments verbatim
//     (Drillo's steel faces are x-scalings of the cone's edge cubic, which on
//     an x-symmetric convex shape can only move inward). A shade generated from
//     the silhouette cannot leave it, which is also why neither has ever needed
//     a clipping fix.
//  9. NOT VALID STANDALONE XML, on purpose. The prose comments in this file
//     contain `--`, which an XML comment may not; that is harmless because the
//     app always inlines these strings into HTML, but a tool that loads one as
//     an `<img src="data:image/svg+xml,...">` or writes it to a .svg file will
//     get a parse error. Strip `<!--...-->` first if you need that.
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
//
// SINGLE-GLYPH PATH IS FROZEN, BYTE FOR BYTE. Chapter 4 (this whole file) is
// shipped and approved -- "아주 좋아 더 이상 변경할게 없어 보여" -- so the
// four calls this file already makes (`R`/`M`/`D`/`★`) must render exactly
// the markup they did before. Everything below `text.length <= 1` is
// untouched from the pre-digraph version; the digraph branch is new and
// additive, and no existing call site's numbers changed to make room for it.
//
// DIGRAPH PATH: chapters 11/18/25/32 repeat this family and Jolly groups 5-7
// are entirely two-letter, so a hero drawn here with `emblem: 'R'` today may
// be redrawn in a later chapter's palette entry with `emblem: 'OA'` -- same
// shape function, longer label, and that call has nowhere else to grow into
// except this function.
//
// THE PLATE WIDENS INTO AN ELLIPSE, NOT A ROUNDED RECT. Every other family
// that solved this (art/robots.js, art/dinosaurs.js, art/toys.js,
// art/platformer.js) went rectangular, but their plates sit on flat armour
// panels or scutes; this family's rule 7 names the badge explicitly ("a
// tinted badge... ringed in the sepia outline") and its whole grammar is
// round bodies, round ears, dot eyes (rule 6, "ROUND ENDS EVERYWHERE") --  a
// license-plate rectangle would be the one squared-off shape in the file. A
// wider ellipse keeps the "chest badge" identity a rounded rect cannot.
//
// SIZING IS THE CLOSED-FORM "RECTANGLE INSCRIBED IN AN ELLIPSE" -- NOT the
// other families' two-independent-limits split, because an ellipse's width
// budget and height budget are not independent: a rectangle's CORNER is what
// has to stay inside the curve, and that is a single combined constraint,
// (wx/a)^2 + (hy/b)^2 <= 1, not two separate ones. Solved for the largest
// font size `s` such that a two-glyph ink box of half-width s*ADV/2 and
// half-height s*INK/2 still clears both semi-axes (a, b) with PAD held back
// from each:
//   s_max = 1 / sqrt( (ADV / (2*(a-PAD)))^2 + (INK / (2*(b-PAD)))^2 )
// ADV/INK are this project's own measured em factors for a two-capital label
// at font-weight 800 (public/_emb4.html: advance 1.43em, inked height
// 0.75em) -- the same numbers art/robots.js's `plateType` uses, because it
// is the same font.
const DIGRAPH_ADV = 1.43
const DIGRAPH_INK = 0.75
const DIGRAPH_PAD = 1.3
// The single-glyph ring (3/3.6, sized for a 28-unit circle) was measured to
// fail its own job on a small digraph ellipse: the sepia ring's own contrast
// against the ink is only ~2.6:1 (both are warm browns), so it was never a
// safe surface for a glyph to touch, and a thick ring eats a much bigger
// FRACTION of a small ellipse's interior than of the old circle's. Pixel
// measurement (public/_crt-emb.html) confirmed this directly: at the
// original ring width Rocket's `QU` inked onto the ring on all four sides
// (28 off-contrast pixels). Capping the digraph ring at 2 and SUBTRACTING
// its half-width from the fitting math (not just the padding) fixed it to 0
// across all sixteen curriculum digraphs on all four figures.
const DIGRAPH_RING_MAX = 2

function emblemBadge(cx, cy, r, plateColor, label, size, ring = SW_BADGE, digraph = null) {
  const text = String(label)
  if (text.length <= 1) {
    return `
    <circle cx="${cx}" cy="${cy}" r="${r}" fill="${plateColor}" ${ol(ring)}/>
    <text x="${cx}" y="${cy + size * 0.36}" text-anchor="middle" font-family="${FONT}"
      font-size="${size}" font-weight="800" fill="${INK}">${label}</text>`
  }
  // `digraph` is a per-character { cx, cy, rx, ry } override: each figure's
  // other painted parts (a cheek disc, a drill, a pair of feet) sit at fixed
  // distances from the plate and were never designed with a wider badge in
  // mind, so the safe ellipse is not a uniform scale-up of `r` and has to be
  // measured per figure (see the call sites). Falling back to a modest
  // uniform widen keeps this function safe to call without one.
  const { cx: dcx = cx, cy: dcy = cy, rx: a = r * 1.4, ry: b = r } = digraph || {}
  const ringW = Math.min(ring, DIGRAPH_RING_MAX)
  const aa = a - ringW / 2 - DIGRAPH_PAD
  const bb = b - ringW / 2 - DIGRAPH_PAD
  const s = 1 / Math.sqrt((DIGRAPH_ADV / (2 * aa)) ** 2 + (DIGRAPH_INK / (2 * bb)) ** 2)
  const base = s * 0.36
  return `
    <ellipse cx="${dcx}" cy="${dcy}" rx="${a}" ry="${b}" fill="${plateColor}" ${ol(ringW)}/>
    <text x="${dcx}" y="${(dcy + base).toFixed(1)}" text-anchor="middle" font-family="${FONT}"
      font-size="${s.toFixed(1)}" font-weight="800" fill="${INK}">${text}</text>`
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
      <!-- DIGRAPH OVERRIDE, measured against this figure's own neighbours
           (public/_crt-emb.html, public/_crt-emb-view.html): the cheek
           discs (cx 36.5/83.5, cy 93, r 10.5) sit directly above the single
           badge and their own bottom edge is y=103.5, so the digraph
           ellipse is centred lower (cy 112, was 107) rather than widened in
           place -- an ellipse widened around the OLD centre reaches nearly
           full width within a unit of its own top pole, which would have
           clipped straight into the cheeks. The bottom pole (119) lands
           exactly on the feet's own top pole (y=119, cx 44/76), so it does
           not reach them either. rx=19 clears the body ellipse's (cx 60,
           cy 88, rx 36, ry 36) own edge at every row in range with margin
           to spare. Zero off-plate ink and zero cheek/feet collision across
           all sixteen curriculum digraphs, measured. -->
      ${emblemBadge(60, 107, 14, visorColor, emblem, 20, 3.6, { cy: 112, rx: 19, ry: 7 })}
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

      <!-- DIGRAPH OVERRIDE: Magno's belly patch is this file's biggest light
           shape (92x46, cx 60 cy 102), and the nearest painted neighbours --
           the arm's palm (cx 18, cy 92, r 11x9.5) and the feet (cx 27/93,
           cy 122, rx 20 ry 13) -- sit far enough from the badge's own centre
           (cx 60) that widening does not reach either one (measured,
           public/_crt-emb.html: zero off-plate ink and zero collision
           across all sixteen curriculum digraphs). This is the one figure
           in the file with real room to spare, so rx/ry went up a lot
           rather than being squeezed like the other three. -->
      ${emblemBadge(60, 97, 14, visorColor, emblem, 20, SW_BADGE, { cy: 100, rx: 24, ry: 12 })}
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
  const wedge = (f, fill) => `<path d="M 0,-6.9 Q ${(-7.9 * f).toFixed(2)},-6.9 ${(-11 * f).toFixed(2)},-2
    C ${(-9.5 * f).toFixed(2)},16 ${(-5.5 * f).toFixed(2)},38 0,52 Z" fill="${fill}"/>`
  // Local space: the cone's mouth is the +-9.5 wide arc at y~0, the tip is at
  // y=52. Four curved bands cross it, each bowing the same way, which is what
  // makes a smooth taper read as a drill flute without a single straight edge
  // or corner anywhere in the shape. Band half-widths (8.6/7.2/4.4/2.6) were
  // taken off the cubic's actual width at each height, not guessed, so no band
  // pokes through the cone's edge. They are drawn LAST, over all five faces, so
  // the banding ties the faces into one object instead of striping each.
  const drill = `
    <path d="M -11,-2 C -11,-9.8 11,-9.8 11,-2 C 11,18 6.4,39 0,52
             C -6.4,39 -11,18 -11,-2 Z"
      fill="${STEEL}" ${ol(SW_MID)}/>
    ${wedge(-1, STEEL_DK)}${wedge(-0.55, STEEL)}
    ${wedge(0.62, STEEL_LT)}${wedge(0.45, STEEL_HI)}${wedge(0.18, STEEL_LT)}
    <path d="M -10,10 C -3.5,15 3.5,15 10,10" fill="none" stroke="${FLUTE}" stroke-width="2.1"/>
    <path d="M -8.4,24 C -3,29 3,29 8.4,24" fill="none" stroke="${FLUTE}" stroke-width="2.1"/>
    <path d="M -5.2,37 C -1.9,41 1.9,41 5.2,37" fill="none" stroke="${FLUTE}" stroke-width="2.1"/>
    <path d="M -3,45 C -1.1,47.5 1.1,47.5 3,45" fill="none" stroke="${FLUTE}" stroke-width="1.8"/>`

  return svgWrap(
    fig(`
      ${shadow(64, 136, 31)}

      ${roundEar(51, 56, 9.5, bodyColor, BELLY)}
      ${roundEar(77, 56, 9.5, bodyColor, BELLY)}

      <!-- front paws raised to shoulder height (cy=74) and pulled in to cx
           30/96. Both numbers are the drill's, not the paw's: the exposed cone
           now runs x 6..32 across y 89..100, and a paw at the old cx 22 / cy 78
           sat in exactly that box, so in a hard cutout the paw filled the air
           the cone needs to be seen against and the drill went back to being a
           nose bump. At cy 74 the paw occupies y 63..85, four units clear of
           the cone's topmost exposed point. cx had to come in from 22 to 30 as
           well, because the narrowed body (rx 31) no longer reached a paw at
           22 and it floated free of the figure. -->
      ${stub(33, 74, 9.5, 11, accent)}
      ${stub(95, 74, 9.5, 11, accent)}
      ${stub(48, 128, 12, 7, accent)}
      ${stub(80, 128, 12, 7, accent)}
      ${blob(bodyColor, 64, 94, 32, 40)}
      ${shadeCrescent(64, 94, 32, 40)}

      ${dotEyes(52, 76, 63, 4.8)}

      <!-- THE DRILL IS THE ONLY THING THAT NAMES THIS ANIMAL, and how far it
           leaves the body is the whole game. The metric that matters is the
           EXPOSED cone length: the distance along the cone's axis from where
           that axis exits the body ellipse to the tip. Everything inside the
           ellipse is invisible in a hard cutout, so it is not drill, it is
           bear. v8 cleared the outline by 1.6 units and read as a plain round
           bear; v10 cleared it by 12.0 and read as a bear with a small nose
           bump. This is 27.2, measured with the same closed-form intersection
           (scratch/cone.mjs), i.e. 2.3x v10.
           The lever is NOT the cone's length -- lengthening it while the tip
           stays inside the frame just moves the root, and the exposed length
           comes out ~25 for every root position. The exposed length is fixed
           by where the TIP sits relative to the body outline, so the fix is a
           NARROWER BODY, pushed right, plus the last unit of frame margin:
           rx 37 -> 32, cx 60 -> 64, cy 92 -> 94. ry went the other way, 38 ->
           40, because it is FREE: the exposed length depends on the body's
           edge at the tip's own height (y~100), and there dropping the flank
           in by 1 while moving the centre out by 1 cancels exactly, so the
           height buys back mass at no cost to the drill. It matters -- the
           first pass at this narrowed the body and Drillo's painted coverage
           fell 36.0% -> 32.6%, which for a chunky digging animal is a real
           loss and not a rounding error.
           The angle went 62 -> 68 deg for the same reason: further from
           vertical puts the tip further from the body's flank, and 68 still
           leaves the cone low enough to pass under the left eye (bottom 68.8,
           collar top 69.5) and left of the badge (x 49..77) at every height.
           Tip (7.0, 100.4); the body's left edge at that height is x=32.4. -->
      <!-- muzzle collar in warm cream, not the badge's pure white: on the old
           sand body the two whites were indistinguishable anyway, but against
           brown a second pure-white disc 30 units above the emblem plate reads
           as a second badge and the eye has to pick which one carries the
           letter. -->
      <circle cx="60" cy="79" r="9.5" fill="${BELLY}" ${ol(SW_MID)}/>
      <g transform="translate(60,79) rotate(68) scale(1.1)">${drill}</g>
      ${mouth(63, 86, 4)}

      <!-- DIGRAPH OVERRIDE, checked against the drill: the cone's exposed
           length runs up out of the body toward the tip at (7,100.4), well
           left of this widened ellipse's own left edge (measured on render,
           see public/_crt-emb.html), so widening rightward-symmetric from
           cx=64 does not reach it. -->
      ${emblemBadge(64, 110, 14, visorColor, emblem, 20, SW_BADGE, { cy: 112, rx: 17, ry: 11 })}
    `)
  )
}

// Captain Red, the evolved boss form -- a flame dragon, and the one figure in
// the file that has to look like it outranks the others.
//
// v12 IS A COMPOSITION PASS. v11's head rebuild worked -- the snout reads as a
// snout in a hard cutout -- but the FIGURE got worse: of the four heroes it was
// the only one a cutout could not name. Two measurements at 4 px per viewBox
// unit say why. v11 had 14 separate protrusions off its core mass against
// Rocket's 5, Drillo's 3 and Magno's 0; and counting runs of painted pixels
// across single rows, v11 read:
//     y=40  wing 9.5-24 | head 30.8-87.8 | wing 96-110.5   3 runs
//     y=50  13.5-106.5                                     ONE run, 93 wide
//     y=60  8.8-11 | 11.8-44 | 44.8-74.5 | 76-108.3 | ...  5 runs
//     y=70  13.5-106.5                                     ONE run
// The wings cleared the head for eight rows and then fused with it; the neck
// "waist" existed only as one of five noisy runs at y=60; from y=70 down the
// figure was a single 96-wide band with a frilly edge. Nothing in it could be
// read as head, wing or body.
//
// THE METRIC THIS PASS IS AIMED AT, because coverage and compactness both miss
// it: for each row, count the runs and ask whether any GAP between them is at
// least 6 units (about 7 px on a 132-px sprite, i.e. actually visible). Summing
// the rows that qualify gives the height over which the figure reads as more
// than one part; summing the rows with a gap under 3 units gives the height of
// pure hairline noise.
//                       reads as >1 part     hairline noise
//     Captain Red v11        10.5 units         14.0 units   <- worst in file
//     Captain Red v12        54.8                4.3
//     Rocket                 61.0                3.8   <- the readable one
//     Magno                   8.0                0.5   <- single mass by design
//     Drillo                  9.8                2.3
// v11 was the noisiest figure in the file. v12 has Rocket's profile, which is
// the one the leader named as instantly readable.
//
// v12 keeps everything v11 earned -- the same turned head path, the snout spur,
// the overbite, the backswept horns, the primaries -- and moves the parts:
//
//  1. THE HEAD BAND IS EMPTY. Above y=38 nothing exists but head and horns; the
//     wings' own tips start there, 16 units clear of the head at y=40 and 7.8
//     at y=50, which is the narrowest point and the same clearance v11 used
//     between its wing tip and the snout. The head owns the top 40% of the
//     frame, which is what makes a head read at 132 px.
//     The head is also 12% larger, one uniform scale-and-shift of the whole
//     head group (X = 1.12x - 6.48, Y = 1.12y - 3.08) so the stop and the snout
//     spur keep their proportions. Filled area 2079 -> 2609 units: the body
//     ellipse is unchanged at 3519, so the body/head ratio the leader called
//     out goes 1.69 to 1.35, and head plus horns is now the largest mass in the
//     figure. The 4-unit rightward shift is what stops the snout from
//     overhanging the left wing.
//  2. THE WINGS ARE BEHIND AND BELOW, not beside the head. Each is one big
//     triangular sail: the arm runs from inside the hip up-and-out to a wrist
//     tip at (9,38), and the outer edge comes back down with ONE notch at
//     (22,82) splitting it into two large lobes. v11 had three lobes per wing,
//     and three notches on a 40-wide wing leaves lobes too small to survive
//     being 12 px tall on a chapter card -- they read as a hem. Two lobes of
//     ~30 units survive. Same "fewer, larger" result the platformer family
//     measured for its halo.
//     v11 bought its coverage by letting the wing climb into the head band;
//     v12 buys it back by spanning further down and further out, where nothing
//     else lives, and by growing the horns instead.
//  3. THE NECK NOTCH IS THE POINT OF THE POSE. From y=63 to y=76 the only
//     painted things are the neck (27 wide, x 46.5..73.5) and the two wings out
//     at the frame edges -- three runs with 8.5 and 8.0 units of clear
//     background between them at y=70. That is what says "head on a neck above
//     a body with wings behind it" in one glance, and it is why the side paws
//     had to go: at cx 32 a paw sat exactly in that gap. Wings-as-arms is a
//     wyvern, and it is also one fewer pair of stubs to confuse with the wing
//     lobes, which was a recorded v11 defect on Drillo.
//     The neck is centred on 60, not on the head: at v11's x-offset the right
//     gap measured 6.5 against the left's 10.
//  4. THE BODY DID NOT SHRINK -- it moved DOWN, cy 102 to 105, which is what
//     opens the neck band; 35x32 is v11's own size. The badge went 14 to 13.5
//     because v11's plate, measured against the belly patch it is supposed to
//     sit inside, was 3% outside it at the top.
//  5. THE FLAME MOVED OUT into the empty bottom-right corner, tip (110,102).
//     v11's flame passed 1.3 units from the right wing's lower lobe -- at 132 px
//     they touch, and two black shapes touching in a cutout cost the flame its
//     outline. It now clears the mirrored lower lobe by 8 units and the right
//     foot by 3.8, and the lobe was shortened (y 102 to 96) to buy that. This
//     corner is contested by three parts and is the one place in the figure
//     where every unit was spent twice.
//
// THE ARM TUBE IS PART OF THE SILHOUETTE, which is the trap here and the reason
// the first v12 draft failed its own row scan with a 1.0-unit gap at y=50.
// `tube` paints the path twice, so an arm on the membrane's leading edge inks
// (width/2 + 2) units OUTSIDE the membrane along its whole length. The arm is
// deliberately left ON the edge -- inboard it read as a bone floating in the
// membrane, and its outer half is real silhouette area the figure needs -- so
// every clearance above is measured from the TUBE's outer skin, not from the
// membrane path.
//
// On the copyright boundary (CLAUDE.md): the brief asked for orange with teal
// wing membranes, which is close to the trademark character's colour placement,
// so the separation is carried by everything else -- a two-lobed chibi sail wing
// with visible orange struts instead of a plain membrane, a round stub-legged
// body with a cream belly patch and a chest star badge, dot eyes, and the
// family's sepia outline. The silhouette is not the original's and no logo or
// marking is borrowed.
export function creatureCaptainRed({
  bodyColor = '#f4600f',
  panelColor = '#ffdca6',
  accent = '#c94409',
  visorColor = BADGE,
  // Boss slots across every family default their badge to `★` (the letters
  // belong to the pre-boss heroes; the boss chapter's badge is decorative),
  // but the param exists -- matching art/robots.js `heroDeluxeRobot` and
  // art/dinosaurs.js `dinoHorned` -- so a chapter data entry COULD override
  // it with a digraph and still hit the emblemBadge digraph path rather than
  // a hardcoded string that can only ever be one glyph.
  emblem = '★',
} = {}) {
  const WING_MEM = '#1a9ea8' // teal membrane
  const WING_ARM = '#d9490f' // arm bone and finger struts
  // Horns are TEAL, not a warm brown. The first attempt made them dark amber
  // and in a hard cutout they merged with the orange wing struts into one spiky
  // thicket -- two horns and six struts all reading as the same kind of spine.
  // Teal ties them to the wings as the figure's second colour while putting the
  // widest possible value gap against the orange head they sit on.
  const HORN = '#0e7a84'
  const TOOTH = '#fff6e2'

  // Every wing coordinate is an absolute viewBox value in [6,48]; mirrored()
  // maps x -> 120-x, so the mirror lands in [72,114]. The failure an earlier
  // pass hit (a polygon scaled to x=-54, then mirrored to x=174) cannot recur
  // from a shape written this way.
  //
  // Margins are budgeted per shape because the widths differ. The membrane's
  // outer edge bottoms out at x=6 and its 2.6 stroke inks to 4.7; the arm tube
  // rides the same leading edge at 4.2 wide plus a 2.0 outline each side, so at
  // the wrist tip (9,38) it inks to 4.9. Both clear the 4.5 this file settled on
  // after losing a session to a 13%-opacity shadow that clipped at y=142.
  // Measured on the rendered pixels the whole figure inks to x 4.83..115.17,
  // y 5.67..138.5, with no painted pixel in any edge row or column.
  //
  // The outer edge is listed once in LOBES and REUSED verbatim by the shade
  // path, which is the only way to keep the shade flush with the wing's own
  // edge rather than a unit off it. The lower lobe stops at y=96 rather than
  // running on down: below that the mirrored copy reaches the flame.
  const LOBES = `C 6,48 6,60 9,71 C 15,74 20,78 22,82 C 15,86 10,90 19,96`
  const EDGE = 'M 48,92 C 44,78 12,61 9,38'
  const wing = `
    <path d="${EDGE} ${LOBES} C 30,104 42,102 48,92 Z"
      fill="${WING_MEM}" ${ol(SW)}/>
    <path d="M 9,38 ${LOBES} C 24,80 22,54 9,38 Z"
      fill="${LINE}" opacity="0.15"/>
    ${tube(EDGE, 4.2, WING_ARM)}
    ${tube('M 24,62 C 19,65 15,68 12,70', 1.8, WING_ARM)}
    ${tube('M 34,84 C 28,87 22,90 17,92', 1.8, WING_ARM)}`

  // Horn. The local shape is unchanged since v10 -- it points along -y, runs to
  // y=-28, and collapses its half-width early (~5.5 by y=-5) so the exposed
  // portion is 23 long at 11 wide, ratio 0.48. That ratio is the whole reason
  // it is a horn: v9's 0.67 wedge on a round head was a CAT EAR in cutout.
  // Both sweep RIGHT, staggered, because on a head turned left "back" is to the
  // right, and both grew a lot in v12 -- scale 1.45 and 1.6 against v11's 1.15
  // and 1.0. That is where the coverage the wings gave up came back, and it is
  // the right place to spend it: a horn is one large protrusion, which is what
  // this pass is buying. Roots (73,34) and (70,25) sit inside the head path so
  // only the swept length shows; tips land at (113.2,28.4) and (112.6,11.2),
  // both inked ~1 unit further out, which is why neither may grow again.
  // The dark face REUSES the horn's own right edge verbatim, so it cannot poke
  // through the outline, and closes with an inner curve. Two flat faces is all
  // the roundness a banned-gradient horn can have, and without it the horn read
  // as a flat paper triangle at 340 px.
  const horn = `
    <path d="M -7,10 C -6,0 -3.5,-14 0,-28 C 3.5,-14 6,0 7,10 Z"
      fill="${HORN}" ${ol(SW_MID)}/>
    <path d="M 1.6,9.5 C 2.6,-1 2.2,-14 0,-28 C 3.5,-14 6,0 7,10 Z"
      fill="#0a5d66"/>`

  // THE HEAD, as one path, clockwise from the back of the skull. Read it as
  // five features rather than nine curves:
  //   (91,34)   -> (66,7)    the crown, high and to the right (the back of a
  //                          turned head)
  //   (66,7)    -> (42.8,18) the brow, coming forward and down
  //   (42.8,18) -> (45,33)   THE STOP: the outline reverses direction, moving
  //                          back to the RIGHT. Without this the head is an egg
  //                          and the snout is just its narrow end.
  //   (45,33)   -> (27,47)   the bridge, out to the snout front
  //   (27,47)   -> (36,58)   the nose, rounding under
  //   (36,58)   -> (91,34)   the lower jaw and cheek, back to the start
  // Extents x 27.1..91, y 7..63; inked 25.8..92.3 x 5.7..64.3. Stroke widths
  // did NOT scale with the head -- the file's 2.6/2.0/1.4 tiers are absolute.
  const HEAD = `M 91,33.9
    C 89.8,16 80.9,7 66.3,7
    C 55.1,7 46.2,10.4 42.8,18.2
    C 45,24.9 47.3,29.4 45,32.8
    C 37.2,35 28.2,40.6 27.1,47.3
    C 26,52.9 29.4,57.4 36.1,58.5
    C 45,61.9 57.4,63 69.7,61.9
    C 83.1,60.8 91,49.6 91,33.9 Z`

  return svgWrap(
    fig(`
      ${shadow(60, 136, 44)}

      ${wing}
      ${mirrored(wing)}

      <!-- tail and flame in absolute coordinates, no rotate wrapper (a local-
           space curve carried through one is what pushed an earlier version
           32 units off the bottom edge). Both go in BEFORE the body so the
           body's fill eats the overlap and the flame reads as rising from
           behind the hip. The flame sits in the bottom-right corner, the only
           large empty region left once the wings went low, and it LEANS OUT:
           tip (110,102), base y=136, extents x 92..113. Leaning is what buys
           the clearance -- an upright flame in this corner is either inside the
           right foot or inside the mirrored wing's lower lobe. As drawn it
           clears the lobe by 8 units and the foot by 3.8. Its tip is POINTED so
           the cutout shows a spike rather than a leaf. -->
      ${tube('M 84,114 C 98,118 105,123 104,129', 11, accent)}
      <path d="M 110,102 C 114,112 114,124 111,131 C 108,136 95,136 93,130
               C 91,121 101,113 110,102 Z"
        fill="${FLAME}" ${ol(SW_MID)}/>
      <path d="M 109,110 C 112,117 112,125 110,131 C 107,135 97,135 95,130
               C 93,123 102,118 109,110 Z"
        fill="${FLAME_MID}"/>
      <path d="M 108,118 C 110,123 111,127 109,131 C 107,134 99,134 98,130
               C 97,126 104,122 108,118 Z"
        fill="${FLAME_CORE}"/>

      <!-- feet at cx 46/74 rather than the shared feet() helper's 44/76: at 76
           the right foot's inked edge came within 1.5 units of the flame.
           cy=129, not 131: at 131 the ry=8 stub plus its 2.0 outline inked to
           y=140, at the frame. No side paws -- see note 3. -->
      ${stub(46, 129, 12.5, 8, accent)}
      ${stub(74, 129, 12.5, 8, accent)}

      <!-- neck as a MASS, 27 wide (x 46.5..73.5), slanting slightly. Its top at
           y=54 is under the jaw and its bottom at y=84 is inside the body's
           crown, so both joins are swallowed and 13 units show. Two numbers are
           load-bearing: the WIDTH, because at v10's 36 the neck matched the
           body's crown and the two masses fused, and the CENTRE, because the
           head sits right of centre and a neck centred on the head left only
           6.5 units between it and the right wing against 10 on the left. -->
      <path d="M 46.5,54 C 44.5,64 45.5,74 47.5,84 L 73.5,84 C 75.5,74 75.5,64 73.5,54 Z"
        fill="${accent}" ${ol(SW)}/>

      ${blob(bodyColor, 60, 105, 35, 32, true, panelColor)}
      ${shadeCrescent(60, 105, 35, 32)}

      <g transform="translate(73,34) rotate(82) scale(1.45)">${horn}</g>
      <g transform="translate(70,25) rotate(72) scale(1.6)">${horn}</g>

      <path d="${HEAD}" fill="${bodyColor}" ${ol(SW)}/>
      <!-- head shade: outer boundary is the head path's own crown and jaw
           segments, verbatim, closed by one interior curve. Same trick as the
           body's shadeCrescent and Drillo's steel faces -- a shade generated
           from the silhouette cannot leave it. -->
      <path d="M 91,33.9 C 91,49.6 83.1,60.8 69.7,61.9 C 78.6,46.2 80.9,35 91,33.9 Z"
        fill="${LINE}" opacity="0.15"/>

      <!-- brow ridge in the accent, angled down toward the snout. On a turned
           head this is not decoration: the brow is what puts the eyes at the
           snout's root instead of high on a dome, which was the primate
           arrangement v10 could not shake. -->
      <path d="M 60.7,24.9 C 67.4,17.1 82,17.1 87.6,24.9 C 82,21.6 67.4,21.6 60.7,24.9 Z"
        fill="${accent}"/>
      <path d="M 43.9,26 C 48.4,19.3 57.4,19.3 60.7,24.9 C 56.2,22.7 48.4,22.7 43.9,26 Z"
        fill="${accent}"/>

      <!-- CHIN, not a muzzle pad. The cream covers only the snout's
           UNDERSIDE: its outer edge is the head path's nose and jaw segments
           copied verbatim, so it is flush with the silhouette, and its top edge
           is an interior curve. The first v11 draft filled the whole snout
           cream and the head read as a DOG -- a pale muzzle on a coloured head
           is the canine marking, and the ape read had only been traded for it.
           Leaving the snout body-coloured is affordable now precisely because
           the OUTLINE carries the snout: the fill no longer has to say
           "projection", so it is free to say "reptile underside" instead. -->
      <path d="M 27.1,47.3 C 26,52.9 29.4,57.4 36.1,58.5 C 43.9,60.8 50.6,57.4 51.8,49.6
               C 43.9,51.8 33.8,50.7 27.1,47.3 Z"
        fill="${panelColor}" ${ol(SW_MID)}/>
      <!-- one nostril, at the snout FRONT rather than on the bridge. In a
           turned head only one shows, and that is the point: a pair of dark
           spots on a pale muzzle is a second pair of eyes on any face, which is
           the failure v10 recorded when its nostrils sat low and 12 apart. -->
      <ellipse cx="31.6" cy="42.8" rx="2.2" ry="1.8" fill="${INK}"/>
      <path d="M 29.4,50.7 C 35,54 41.7,56.3 48.4,57.4" fill="none"
        stroke="${INK}" stroke-width="2.4"/>

      <!-- overbite: two pale fangs hanging past the jaw outline (which runs
           y 58..62 here), so they are silhouette, not marking. Kept pale with
           a sepia outline rather than ink -- two dark spikes under a jaw read
           as a gap in the outline instead of as teeth. They stop at y=67/68:
           scaled with the head they reached 70.8, which put the far one across
           the neck's own left edge and closed part of the notch note 3 is
           about. -->
      <path d="M 35,56.3 C 39.4,56.3 40.6,57.4 40,58.5 C 39.4,63.4 38.3,65.8 37.2,67
               C 36.1,64 35,61.9 34.4,58.5 C 33.8,57.4 33.8,56.3 35,56.3 Z"
        fill="${TOOTH}" ${ol(SW_IN)}/>
      <path d="M 44.5,59.6 C 49,59.6 50.1,60.8 49.5,61.9 C 49,65.8 47.8,67.2 46.7,68
               C 45.6,65.5 44.5,64.1 43.9,61.9 C 43.4,60.8 43.4,59.6 44.5,59.6 Z"
        fill="${TOOTH}" ${ol(SW_IN)}/>

      <!-- eyes: the near one (right) larger, the far one smaller and closer to
           the bridge, which is what a turned head does to a pair. Still the
           largest eyes in the file (the small heroes use 4.8 to 5.0) which is
           what an evolved form should have. -->
      ${dot(71.9, 30.5, 5.4)}
      ${dot(52.9, 29.4, 4.5)}

      <!-- DIGRAPH OVERRIDE, checked against the feet (cx 46/74, cy 129,
           rx 12.5 ry 8, top pole y=121): the digraph ellipse's own bottom
           pole is pulled up to y=119.5, clear of the feet, rather than left
           at the single badge's 117.5+13.5=131, which would already sit
           inside them. Measured (public/_crt-emb.html): zero off-plate ink
           and zero collision across all sixteen curriculum digraphs. -->
      ${emblemBadge(60, 117.5, 13.5, visorColor, emblem, 21, SW_BADGE, { cy: 111, rx: 19, ry: 8.5 })}
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

// Slippy: melts the floor. No feet -- the lower body dissolves into a puddle,
// the same "no legs" language platSlime and dinoSwamp use for their own
// gripless villains.
//
// v11 REBUILT THE SILHOUETTE, because in a hard cutout Slippy was a plain
// dome -- the only figure in the file with no identifying shape at all -- and
// everything that was supposed to say "slime" was invisible there:
//   * the two drips were tucked INSIDE the body outline, so they were interior
//     seams, not silhouette,
//   * the two arms hugged the flank and were swallowed by the body's own fill,
//   * and the puddle carried opacity="0.9", which in a cutout renders as a
//     mid-GREY slab under a black figure -- a second, lighter shape that broke
//     the character's outline into two pieces. Opacity is now 1 and the wet
//     look comes from a lighter sheen path inside the pool instead. (Whatever
//     translucency is worth on a colour render, it costs more than it earns:
//     a semi-transparent shape is the one thing a monochrome silhouette test
//     cannot read, and this file's other translucent shape -- the 13% ground
//     shadow -- has already cost a session once.)
// The body is now a single path whose lower edge is FOUR HANGING TONGUES with
// notches of background between them, so the melt is in the outline rather
// than drawn on top of it, plus one detached falling droplet between the
// lowest tongue and the pool. That is the whole identity: a blob coming apart.
//
// The arms are GONE, and not for want of room. With tongues in the outline, a
// pair of limbs at the flanks reads as two more tongues that happen to point
// sideways, and the count of dangling things is exactly what says "melting"
// rather than "creature with limbs". A slime with arms was also the one thing
// separating this figure from the other two gripless villains in the project.
export function creatureSlippy({ bodyColor = '#3f8f2a', accent = '#2c6b1c' } = {}) {
  // Dulled tint of the body, per the villain note -- and dulled twice. The
  // first value (#c9dfb4) measured out as the brightest shape on the whole
  // villain side of the cast, and on a figure whose belly patch sits directly
  // under the eyes it read as a pale muzzle rather than an underside.
  const BELLY_GN = '#a9c98e'
  const SHEEN = '#4fa634' // pool sheen: one step lighter than the body, not white
  return svgWrap(
    fig(`
      <!-- the pool, opaque. Lobed top edge so it reads as a spreading spill
           rather than as a shadow ellipse; bottom held at y=134 so the 2.6
           outline inks to 135.3 and stays inside the frame. -->
      <path d="M 13,122 C 23,114 31,124 43,118 C 57,111 67,122 81,116
               C 96,110 107,116 106,123 C 101,132 84,134 60,134
               C 35,134 15,130 13,122 Z"
        fill="${accent}" ${ol(SW)}/>
      <!-- sheen as two irregular patches, not one long lens: a single lens
           down the pool's middle read as a LEAF MIDRIB and turned the whole
           pool into a lily pad the figure was standing on. -->
      <path d="M 28,124 C 36,120 46,126 52,123 C 48,129 38,130 28,124 Z"
        fill="${SHEEN}"/>
      <path d="M 66,123 C 76,119 88,123 94,121 C 88,128 74,129 66,123 Z"
        fill="${SHEEN}"/>

      <!-- ONE PATH: dome on top, four tongues hanging off the bottom with real
           notches between them. Each tongue swings out and down, then the
           outline climbs back UP inside itself before the next one starts --
           that climb is the notch, and it is what makes four tongues instead of
           one scalloped hem. Lengths are staggered (the middle pair hang
           lowest) because four equal tongues read as a decorative fringe.
           Extents x 20..100, y 46..116; inked 18.7..101.3 x 44.7..117.3. -->
      <path d="M 58,46
               C 80,46 92,60 92,74
               C 99,77 100,88 95,92 C 90,95 87,90 87,82
               C 88,95 81,103 74,100 C 69,97 71,90 71,84
               C 72,99 69,112 58,112 C 50,112 53,95 53,88
               C 54,101 46,107 40,103 C 35,99 38,90 38,84
               C 37,96 28,98 24,90 C 20,82 20,76 22,72
               C 22,58 36,46 58,46 Z"
        fill="${bodyColor}" ${ol(SW)}/>
      <ellipse cx="57" cy="70" rx="24" ry="15" fill="${BELLY_GN}" ${ol(SW_IN)}/>
      ${shadeCrescent(57, 70, 34, 24)}

      <!-- the detached drop. A falling droplet is the one cue that reads as
           LIQUID rather than as a lumpy animal, and it only works detached:
           attached to the tongue above it, it is just more tongue. Sits in the
           17-unit gap of background at x=34, between the fourth tongue's tip
           (y=103) and the pool's crown under it (y=120). The centre tongue,
           by contrast, was lengthened to y=112 and left BROAD (x 53..71) so it
           sits down into the pool's crown (y=111). At 109 every tongue stopped
           short of the water and the whole figure read as hovering over a lily
           pad; at 116 that same tongue narrowed to a point on the way down and
           turned the figure into a MUSHROOM ON A STALK. Broad contact anchors
           it without making a stem, and the other three tongues still hang in
           clear air. -->
      <path d="M 34,110 C 38,114 37,118 34,118 C 31,118 30,114 34,110 Z"
        fill="${bodyColor}" ${ol(SW_IN)}/>

      ${droopyEyes(46, 70, 68, 5)}
      ${smirk(57, 80, 6)}
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
      <!-- POLE CAPS: blue + white, which is the fix for a real regression. v10
           read the convention as "red and blue", saw that Grabby's body had
           just become red, and made both caps metal instead (blue-steel and
           brass) -- so the prop lost the two-pole convention entirely and read
           as decorative trim. But the premise was wrong: the caps sit at
           roughly x 92..110, y 60..72, and the body's own right edge at y=65 is
           x=83, so the caps are on BACKGROUND, not on the red body, and a red
           cap was never going to blend into it. What it would do is put a third
           red in the frame next to a red animal and a darker red trim, which is
           the muddle v10 was actually reacting to.
           Blue + white keeps polarity (two caps, maximum value gap between
           them, one of them the convention's own blue) with no hue shared with
           the body at all -- and blue/white is itself a common magnet livery,
           so nothing about the read depends on the missing red. The horseshoe
           shape carries "magnet" regardless; the caps only have to say the two
           ends are different. The arch itself dropped from #c2c7cf to #a8b0ba so the
           white cap has a value to sit against (1.35:1 -> 1.75:1).
           MEASURED, AND IT CHANGED THE FIX: the inner cap lands at (85.6,59.6)
           and the right ear is a r=9 disc at (84,62), so with the prop drawn
           before the ears the inner cap was 100% covered and only ONE pole cap
           had ever been visible -- which is why no choice of two colours could
           have read as polarity. The prop now draws AFTER the ears (still
           before the body, so the shoulder still swallows the arch's inner
           leg): the arch reads as hanging in FRONT of the ear, which is what
           a thing slung over a shoulder does, and both caps show. -->
      ${roundEar(36, 62, 9, bodyColor, BELLY_RD)}
      ${roundEar(84, 62, 9, bodyColor, BELLY_RD)}
      <g transform="translate(98,50) rotate(20) scale(1.4)">${archShape('#a8b0ba', '#2f6fd0', '#f7fafd')}</g>

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
    <circle cx="${cx}" cy="50" r="16" fill="${DOME}" ${ol(SW_MID)}/>`
  const domeFace = (cx) => `
    <ellipse cx="${cx}" cy="49" rx="6" ry="6.6" fill="${INK}"/>
    <path d="M ${cx - 10},44 C ${cx - 5},36 ${cx + 5},36 ${cx + 10},44" fill="none"
      stroke="${INK}" stroke-width="2.1" opacity="0.75"/>`

  return svgWrap(
    fig(`
      ${shadow(60, 136, 48)}

      ${paws(accent, 94, 13, 14)}
      ${feet(accent, 126, 16, 9)}
      ${domeShell(40)}
      ${domeShell(80)}
      ${blob(bodyColor, 60, 88, 48, 44, true, BELLY_MG)}
      ${domeFace(40)}
      ${domeFace(80)}
      ${shadeCrescent(60, 88, 48, 44)}

      <!-- the maw, sitting on the belly patch. Teeth are a ROW of four small
           blunt nubs along the upper lip: the first version had two big round
           teeth centred in the dark oval and they read unmistakably as a
           second pair of eyes, which made the real domed eyes above read as
           ears. A row cannot be misread that way. -->
      <path d="M 29,90 C 36,112 84,112 91,90 C 79,84 41,84 29,90 Z"
        fill="${INK}" ${ol(SW_MID)}/>
      <polygon points="38,89 46,89 42,97" fill="${BELLY}" stroke="${INK}" stroke-width="1.2"/>
      <polygon points="50,87 58,87 54,95" fill="${BELLY}" stroke="${INK}" stroke-width="1.2"/>
      <polygon points="62,87 70,87 66,95" fill="${BELLY}" stroke="${INK}" stroke-width="1.2"/>
      <polygon points="74,89 82,89 78,97" fill="${BELLY}" stroke="${INK}" stroke-width="1.2"/>

      <circle cx="16" cy="74" r="3.4" fill="${accent}" stroke="${LINE}" stroke-width="1.2"/>
      <circle cx="104" cy="66" r="3" fill="${accent}" stroke="${LINE}" stroke-width="1.2"/>
      <circle cx="100" cy="104" r="3.8" fill="${accent}" stroke="${LINE}" stroke-width="1.2"/>
    `)
  )
}
