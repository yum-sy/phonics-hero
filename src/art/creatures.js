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
function softEar(cx, cy, w, h, rot, fill, innerFill) {
  return `
    <g transform="translate(${cx},${cy}) rotate(${rot})">
      <path d="M ${-w},${h * 0.4} C ${-w * 1.05},${-h * 0.45} ${-w * 0.85},${-h} 0,${-h}
               C ${w * 0.85},${-h} ${w * 1.05},${-h * 0.45} ${w},${h * 0.4} Z"
        fill="${fill}" ${ol(SW_MID)}/>
      <path d="M ${-w * 0.46},${h * 0.2} C ${-w * 0.5},${-h * 0.4} ${-w * 0.42},${-h * 0.74} 0,${-h * 0.74}
               C ${w * 0.42},${-h * 0.74} ${w * 0.5},${-h * 0.4} ${w * 0.46},${h * 0.2} Z"
        fill="${innerFill}" ${ol(SW_IN)}/>
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

// Rocket (R): electric mouse/rabbit. Two long rounded ears, two ROUND cheek
// dots (the earlier diamond was a trade-dress dodge that also read spiky; a
// plain circle in a non-franchise colour and placement does the same job),
// and a zigzag tail whose corners are round joins on a thick stroke, so it
// reads as soft lightning rather than cut glass.
export function creatureRocket({
  bodyColor = '#f6a893',
  accent = '#e2846c',
  emblem = 'R',
  visorColor = BADGE,
} = {}) {
  return svgWrap(
    fig(`
      ${shadow(60, 132, 28)}

      <!-- tail: one thick round-jointed stroke, so every zigzag corner is a
           curve. Rooted at (87,92), inside the rx=34 body silhouette (edge
           x=93.5 at that height) so the join hides, then up and out to the
           right: max x 111 + half stroke 4 + outline 2.2 = 117.2, min y
           50 - 6.2 = 43.8. Held above the right paw (88.5..107.5 x
           89..111, drawn later) rather than through it -- an earlier version
           ran the tail lower and the paw swallowed all but a stub of it. -->
      ${tube('M 87,92 L 106,79 L 97,68 L 111,50', 8, accent)}

      <!-- ears before the body so their roots vanish under it. Apexes land at
           (33.8,17) and (86.2,17) -- computed through the rotate, not
           eyeballed; ~15 units of headroom above the box. -->
      ${softEar(42, 50, 11, 34, -14, bodyColor, BELLY)}
      ${softEar(78, 50, 11, 34, 14, bodyColor, BELLY)}

      ${paws(accent, 100)}
      ${feet(accent, 126)}
      ${blob(bodyColor, 60, 88, 34, 36)}

      <!-- soft volume tint: one same-hue lobe at low opacity, no facets. -->
      ${shadeCrescent(60, 88, 34, 36)}

      <circle cx="34" cy="90" r="6.5" fill="${accent}" ${ol(SW_IN)}/>
      <circle cx="86" cy="90" r="6.5" fill="${accent}" ${ol(SW_IN)}/>

      ${dotEyes(47, 73, 78, 4.8)}
      ${mouth(60, 88, 5)}

      ${emblemBadge(60, 107, 14, visorColor, emblem, 20)}
    `)
  )
}

// Magno (M): the big sleepy one. Widest, lowest-sitting body of the three
// small heroes, half-lidded eyes, limbs pulled in short. The magnet survives
// only as the ARCH SHAPE of the ears, body-coloured with no pole caps --
// legible as a horseshoe if you look for it, reading as ears if you do not.
export function creatureMagno({
  bodyColor = '#a9c9ea',
  accent = '#82a9d2',
  emblem = 'M',
  visorColor = BADGE,
} = {}) {
  return svgWrap(
    fig(`
      ${shadow(60, 134, 34)}

      <g transform="translate(40,52) rotate(-12) scale(1.15)">${archShape(bodyColor)}</g>
      <g transform="translate(80,52) rotate(12) scale(-1.15,1.15)">${archShape(bodyColor)}</g>

      ${paws(accent, 100, 10, 11)}
      ${feet(accent, 128, 13, 7)}
      ${blob(bodyColor, 60, 90, 40, 36)}
      ${shadeCrescent(60, 90, 40, 36)}

      ${sleepyEyes(45, 75, 78, 6)}
      ${mouth(60, 90, 4.5)}

      ${emblemBadge(60, 108, 14, visorColor, emblem, 20)}
    `)
  )
}

// Drillo (D): burrowing mole. The drill is the SNOUT and only the snout -- a
// round muzzle carrying a soft two-turn spiral, seen head-on, which is how a
// front-facing figure can own a drill without holding one. Small round ears
// and short round feet finish the mole read.
export function creatureDrillo({
  bodyColor = '#e6c894',
  accent = '#c9a56e',
  emblem = 'D',
  visorColor = BADGE,
} = {}) {
  // Spiral as a bezier chain, kept inside r=6 of its own origin so it sits in
  // the muzzle's upper half and leaves room for the mouth below. Drawn in the
  // outline colour, not the softer seam colour: at 66 px a 1.9-wide seam-tone
  // spiral greyed out into a smudge and the drill read vanished.
  const spiral = `
    <path d="M 0,-6 C 4.8,-6 6.3,-2 6.3,0.5 C 6.3,4 3.2,6 0,6
             C -3.9,6 -6.3,3 -6.3,0 C -6.3,-2.6 -4.4,-4 -2.4,-4
             C -0.5,-4 0.9,-2.6 0.9,-0.9 C 0.9,0.6 -0.3,1.7 -1.5,1.7"
      fill="none" stroke="${LINE}" stroke-width="2"/>`

  return svgWrap(
    fig(`
      ${shadow(60, 136, 30)}

      ${roundEar(34, 64, 10, bodyColor, BELLY)}
      ${roundEar(86, 64, 10, bodyColor, BELLY)}

      ${paws(accent, 102)}
      ${feet(accent, 128, 12, 7)}
      ${blob(bodyColor, 60, 92, 37, 38)}
      ${shadeCrescent(60, 92, 37, 38)}

      <!-- eyes flank the snout rather than sitting above it: at y=64 they
           landed near the crown and the muzzle read as a forehead spot with
           a snail shell on it. -->
      ${dotEyes(42, 78, 70, 4.8)}

      <!-- muzzle held clear of the belly patch (top y=90.5): both are cream,
           so an overlap fuses them into one shapeless pale mass and the snout
           stops reading as a snout. Sized as large as that clearance allows,
           because the spiral is the entire species cue and a small one read
           as a snail shell stuck on the forehead. -->
      <ellipse cx="60" cy="80" rx="14" ry="10" fill="${BADGE}" ${ol(SW_MID)}/>
      <g transform="translate(60,76) scale(0.75)">${spiral}</g>
      ${mouth(60, 85, 4)}

      ${emblemBadge(60, 106, 14, visorColor, emblem, 20)}
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
  // Every wing point is an absolute viewBox coordinate in [4,50]; mirrored()
  // maps x -> 120-x, so the mirror lands in [70,116]. With the 2.2 stroke's
  // 1.1 half-width that leaves ~2.9 units of clearance at both edges -- the
  // failure an earlier pass hit (a polygon scaled to x=-54, then mirrored to
  // x=174) cannot recur from a shape written this way.
  // Reach raised to y=34 (from 42): at the smaller span the lobes sat beside
  // the body and read as fish fins rather than as wings above the shoulder.
  const wing = `
    <path d="M 50,70 C 34,50 20,32 8,37 C 13,45 11,51 4,55
             C 12,59 12,67 5,73 C 15,77 17,85 12,93
             C 30,95 44,86 48,76 Z"
      fill="${panelColor}" ${ol(SW)}/>
    <path d="M 45,71 C 33,56 22,42 12,40 M 43,77 C 31,70 20,64 11,63" fill="none"
      stroke="${LINE_SOFT}" stroke-width="${SW_IN}"/>`
  const horn = `
    <path d="M -4,7 C -5,-1 -3,-9 0,-12 C 3,-9 5,-1 4,7 Z"
      fill="${accent}" ${ol(SW_MID)}/>`

  return svgWrap(
    fig(`
      ${shadow(60, 136, 40)}

      ${wing}
      ${mirrored(wing)}

      ${paws(accent, 92, 11, 12)}
      ${feet(accent, 128, 14, 7)}

      <!-- tail and flame in absolute coordinates, no rotate wrapper (a local-
           space curve carried through one is what pushed an earlier version
           32 units off the bottom edge). Tail half-width 6 plus outline 2.2
           is budgeted into every point: max x 106+8.2=114.2, max y
           120+8.2=128.2. The flame teardrop peaks at (112,133) -> 113.1 and
           134.1 with its outline. Both clear the right foot (x 62..90). -->
      ${tube('M 88,100 C 102,104 106,112 102,120', 12, accent)}
      <path d="M 102,116 C 112,122 110,130 102,133 C 94,130 92,122 102,116 Z"
        fill="${FLAME}" ${ol(SW_MID)}/>
      <path d="M 102,121 C 107,125 106,129 102,131 C 98,129 97,124 102,121 Z"
        fill="${FLAME_CORE}"/>

      ${blob(bodyColor, 60, 92, 40, 38)}
      ${shadeCrescent(60, 92, 40, 38)}

      <g transform="translate(48,62) rotate(-16)">${horn}</g>
      <g transform="translate(72,62) rotate(16)">${horn}</g>

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
