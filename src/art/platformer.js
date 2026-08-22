// Platformer-family character art — chapter 5, the jump-platformer genre slot
// in the world order.
//
// REVISION NOTE (v6): PROPORTION. v5 gave the family joints; the user's
// objection survived them, and it was never about joints — "몸과 팔다리가 너무
// 부자연스러워. 저런 비율이 세상에는 존재하지 않아서." Measured, v5's heroes had
// 8 to 13 units of leg visible between the dungarees' hem and the top of the
// boot, on figures ~123 units tall. The gloves hung level with the boot tops.
// A child was not looking at short legs, it was looking at a torso resting on
// a pair of shoes.
//
//  * LEGS. Hip-to-sole went from 31..35 units to 38..42, i.e. 25..33% of the
//    figure's height instead of 23..27%. Every unit came out of the TORSO
//    (shirt 22 -> 18, bib 27 -> 22) and out of two units of extra sole depth;
//    NOT out of the head. v5's note recorded that shrinking the villains'
//    heads for neck clearance had already cost them their "big-headed villain"
//    read, and the heroes' 37-unit head is the whole chibi cast. The emblem
//    plate lost 3 units of PADDING and no type size at all — h 25/size 24
//    became h 21/size 24 — so the phonics letter is untouched (checked at
//    66 px, where a unit is under half a pixel).
//  * NEGATIVE SPACE, and the hard limit on it. A hard cutout showed v5's
//    upright heroes as one mass: arms welded to the flank, no hole anywhere.
//    The reason is the sticker halo. It is 4.5 units per side, so two masses
//    need MORE THAN 9 UNITS of background between them to survive
//    brightness(0) at all — and beside a 52-to-58-unit bib inside a 120-unit
//    frame, a hanging arm plus its r=9 glove plus two halos does not fit. So
//    the torso was narrowed (shoulders 52 -> 46, waist 44 -> 38, hips 58 ->
//    50) to buy the arms 8..9 units of slot, the stance was widened, and where
//    a real cutout hole was needed the arm went UP (Ollie's right arm, both of
//    Captain Gum's). Scanned at 4 px/unit, the vertical extent over which the
//    silhouette is more than one mass: Ollie 5.5 -> 28 units, Umo 6.5 -> 30,
//    Blocko 3.3 -> 14, Bug King 18.3 -> 23.5, Captain Gum 24 -> 41.3.
//    Hanging arms are still fused at the armpit. That is geometry, not
//    laziness — see the halo arithmetic above.
//  * THE BOSS READS AS THE COMBINED FORM BY MASS, not by bounding box: every
//    figure already fills the 140-unit frame, so "bigger" had to be width and
//    weight. Head 38 -> 41 tall and 38 -> 42 wide, shoulders 56 -> 64, hips 60
//    -> 72, limb widths +20%, and both arms raised into the frame's top
//    corners, which the minibots leave empty. Its aura also stopped fusing
//    with it: the rays start at r=44 instead of r=36, outboard of the halo, so
//    they are detached spikes rather than a spiked outline.
//
// REVISION NOTE (v5): FINISHING v4. v4 built the skeleton primitives and wired
// them into all nine figures, but it was never rendered or measured — and it
// had shipped four kinds of fault that only measurement and a hard cutout find:
//
//  * FOUR FIGURES CLIPPED. platJumper's speed lines at y 140.9, platFlip's
//    flipped head at y 145.4 (chin sheared off), platMagnetjack's antenna at
//    y -2.1, platBrick at x -1.4 / y -0.9 / y 142.1, platGlitch at x 121.3.
//    v4 gave the figures joints, which made them longer, and never re-measured
//    the 6-unit halo budget. All nine now measure inside 0..120 / 0..140 with
//    `getBBox` -> CTM -> stroke/2 inflation (NOT getBoundingClientRect, which
//    omits stroke in this Chrome build).
//  * TWO FIGURES DREW THE ARMS BEFORE THE TORSO — platSlime and platBrick — so
//    the torso covered every deltoid and those two kept v3's exact fault while
//    the file claimed rule S2 was applied everywhere.
//  * THREE FIGURES HAD AN INVISIBLE NECK. platFlip, platBrick and (all but two
//    units of) platMagnetjack drew the neck quad inside the union of head and
//    collar, so rule S5 was satisfied in code and not on screen.
//  * FEATURES OUTSIDE THEIR OWN SILHOUETTE: platSlime's brows crossed the
//    blob's crown and read as ANTENNAE; platGlitch's left horn sat inside the
//    skull and read as nothing while the right one read as a horn.
//
// v5 also finished two things v4 left half-done: hero arms reached only to the
// waist (fingertips above the hip), and the deltoid's bright crescent was broad
// enough that the shoulder read as a sphere stuck on the flank.
//
// REVISION NOTE (v4): the SKELETON. v2 fixed the casting (proportions and
// colour placement), v3 fixed the rendering style (inked sticker art), and
// both left the skeleton wrong — which is what the user finally put a finger
// on: "몸과 팔다리가 너무 부자연스러워. 저런 비율이 세상에는 존재하지 않아서."
// Concretely, v3 had: arms leaving the torso at a right angle as
// constant-width bars with a balloon glove floating at the far end; legs that
// were two logs plugged under the pelvis with no knee; hips 71 units against
// 50-unit shoulders; and a head socketed straight into the shirt with no neck.
// v4 changes ONLY joints and proportions. The ink hierarchy, the computed
// white sticker halo, the eyes and mouths, the two-tone dungarees and every
// colour value are v3's, untouched.
//
// SKELETON GRAMMAR — v4, the load-bearing change.
//
//  S1. LIMBS ARE JOINTED POLYLINES, NOT QUADS. A limb is a list of
//      {x,y,w} joints; `limbOutline` offsets each joint along the BISECTOR
//      normal, so the outline keeps its width through a bend instead of
//      pinching, and one primitive builds both a shoulder→elbow→wrist arm and
//      a hip→knee→ankle leg. `limbCrease` puts the elbow/knee crease exactly
//      on the bend. Widths always DECREASE outward (arm 9.5→8→6.3, leg
//      11→8.6→7.2): a limb that does not taper cannot read as a limb no
//      matter what is drawn on it.
//  S2. THE SHOULDER IS A DELTOID BALL. `deltoid` puts a circle at the arm's
//      first joint and it is drawn AFTER the torso so it overlaps the torso
//      edge — its inner arc reads as the armhole seam, its outer arc as the
//      round shoulder. v3 drew the arms first and the torso on top of them,
//      which is precisely why the arms looked bolted to the flank.
//  S3. THE WRIST IS THE NARROWEST POINT. The gloves stay oversized (that is
//      the genre) but they are seated ON the wrist joint — centre = wrist + 7
//      units along the limb direction, so the lobe overlaps the cuff — and
//      the glove's own cuff band lands across that wrist. Attached, not
//      adjacent.
//  S4. KNEES BEND. Thigh angles inward from the hip, shin angles back out,
//      crease at the break, turn-up cuff on the last segment only, boot
//      swallowing the shin's end. The bend is ~25°, which is what makes it
//      visible at 132 px without turning the pose into a squat.
//  S5. A NECK EXISTS. `neck` is drawn before the torso and the shirt's collar
//      line is dropped below the chin, so ~7 units of skin show. Nothing else
//      separated a big head from a wide torso; without it the whole family
//      read as dolls with the head pushed onto a peg.
//  S6. PROPORTIONS (v6) head 34 wide / shoulders 46 / waist 38 / hips 50,
//      against v4's 52 / 44 / 58 and v3's 50 / — / 71. The hips are still the
//      widest point — the dungarees need that — but the whole torso came in 6
//      units so the arms have somewhere to hang that is not the flank, and so
//      the legs read as legs rather than as the bottom of a bell. The torso is
//      also SHORTER: shirt 18 units and bib 22, against v4's 22 and 27.
//  S7. THE VILLAINS GET THE SAME SKELETON. Applied to the heroes only, the
//      villains look broken standing beside them. Their tilt, their
//      deliberately mismatched limb lengths and every gimmick (inverted
//      Topsy, melting Gloop, the stolen magnet, the brick stack, the belly
//      maw) are untouched.
//
// DRAWING STYLE — v3, unchanged.
//
//  A. BLACK INK ON EVERY MASS. Nothing is a bare colour plane. `ink(w)` puts
//     LINE (#221a2c, near-black with a violet cast so it sits with the
//     palette instead of punching a hole in it) on a shape. Weights are a
//     three-step hierarchy, not one value: 3.0–3.4 on silhouette masses
//     (torso, head, boots, gloves), 2.0–2.6 on parts sitting inside another
//     mass (thumbs, brims, plates, bricks), 1.3–1.7 on surface detail
//     (stitching, panel seams, plank courses, joint creases). Uniform line
//     weight is what makes inked art look like clip art; the hierarchy is
//     what makes the silhouette read first and the detail second.
//
//  B. THE WHITE STICKER BORDER IS REAL, AND IT IS COMPUTED, NOT DRAWN. Every
//     figure is painted twice from one part list: `haloPaint` first, which
//     re-emits each shape with white fill and a white stroke 9 units fatter
//     than its own, then `paint` for the real thing on top. Because the real
//     pass covers the union of the geometry exactly, the only white that
//     survives is a 4.5-unit rim around the outside — a true silhouette
//     offset, with no hand-authored outline path to drift out of sync when a
//     limb moves. Parts whose halo would show OUTSIDE that union (ground
//     shadows, speed lines, sparkles, glitch debris, the boss's glow) are
//     marked `nohalo:true`, and text is skipped, since a haloed letter would
//     lose its counters. Consequence for geometry: the halo costs 4.5 units
//     of margin on every side. The hard limit is the viewBox: a mass with ink
//     w must keep its edge inside w/2 + 4.5 of 0..120 / 0..140, which for the
//     usual 3-unit ink is x 6..114 / y 6..134. Measured (getBBox -> getCTM ->
//     stroke/2, normalised by render width — NOT getBoundingClientRect, which
//     omits stroke in this Chrome build) the nine run x 1.5..118.5 /
//     y 0.9..138.6; the extremes are nohalo backdrop parts (ground shadows,
//     speed lines, aura rays), which have no rim to fit.
//
//  C. BIG EXPRESSIVE EYES. An outlined white sclera with a DOMINANT pupil
//     (0.72 of the sclera) and a highlight. The pupil has to dominate: a
//     small pupil in a big thin-rimmed sclera reads as SPECTACLES. Heroes get
//     a heavy lid wedge sitting on the sclera (the cap brim leaves no room
//     above the eye for a brow, and in practice the brim acts as the brow);
//     villains have no cap, so they get real brows — thick strokes angled
//     down toward the nose. That one difference is the whole hero/villain
//     face split.
//
//  D. OPEN MOUTHS WITH CORNER TICKS. A single curved stroke cannot carry an
//     expression at any size. Heroes get an open smile — dark mouth shape,
//     white teeth strip, ink ticks at the corners; villains get the same
//     shape with fangs. Bug King is the exception: the void in its belly is
//     its mouth, so its head carries eyes and brows only.
//
//  E. ANGULAR CONSTRUCTION WHERE THE GENRE ALLOWS IT. Torsos are tapered
//     paths, the bib is a trapezoid flaring to the hips, boots are domed
//     uppers on FLAT soles, the cap brim is a pointed lens, and the head is a
//     jawed shape rather than a pill. It does NOT port all the way: this
//     genre's face and its big round nose are round on purpose, so heads stay
//     curve-topped and the nose, gloves, buttons, coil turns, cap disc, the
//     deltoid balls and the spring's emblem plate remain circles.
//
//  F. PUSHED PRIMARIES. With ink around them the fills can go louder without
//     turning muddy.
//
// CASTING GRAMMAR — v2's colour placement, kept; v4 restates the numbers.
//
//  1. SQUAT GROWN-UP PROPORTIONS, ~3.2 heads. Head 34 wide / shoulders 46 /
//     waist 38 / hips 50 (see S6). Legs are 31..33% of the figure's height;
//     below ~28% the figure stops reading as a body on legs, which is what v5
//     measured at 23..27%.
//  2. DUNGAREE TWO-TONE, split top from bottom. Shirt, sleeves, deltoids and
//     cap dome take `bodyColor`; bib, straps and legs take the fixed DENIM
//     constant. DENIM is deliberately not palette-driven — the genre read
//     only survives if the bottom half is reliably cool whatever colour a
//     chapter hands the shirt.
//  3. THE DUNGAREES MUST SURVIVE A FLAT GREY SILHOUETTE — three structural
//     devices, all re-verified after the v4 skeleton moved the arms: the bib
//     is WIDER than the shirt so the outline steps outward at the waist; the
//     straps run PAST the shoulder line as knobs (and the knobs sit inboard
//     of the new deltoid balls, which is why the arms do not eat them); the
//     two big buttons are centred ON the bib's outer edge so half of each
//     circle sticks out. The hanging arms occlude only the buttons' outermost
//     tips — the arm keeps a background gap from the hip precisely so those
//     three reads survive.
//  4. OVERSIZED WHITE GLOVES AND BOOTS as separate masses. Heroes get
//     `heroGlove`/`heroBoot` (thumb, cuff band, toe cap, sole slab); villains
//     keep the plainer `villainGlove`/`villainShoe`, so hands differ on sight.
//  5. CAP WITH A BRIM WIDER THAN THE SHOULDERS. With v4's neck the brim is no
//     longer the only thing separating head from torso, but it is still the
//     genre's loudest headwear tell.
//  6. BIG ROUND NOSE. No moustache: that is one specific character's
//     property, not the genre's.
//  7. NO GRADIENTS OR FILTERS anywhere. Volume is stacked planes plus ink.
//  8. ONE POSE IDEA PER HERO: airborne / coiled / boxy / winged-and-massive.
//     Villains are tilted and lopsided where heroes are upright.
//  9. THE EMBLEM PLATE SITS ON THE BIB, not the shirt — on the shirt it plus
//     the straps covered the warm half entirely and the two-tone died. On
//     dark denim the bright plate also gets its strongest contrast.
//
// SIZES: judged at 132–256 px, which is what style.css renders (132 combine
// minibot, 170 map node, 186 battle sprite, 250 reward, 256 final form).
// Joints are judged at 132 px and up; at 66 px a knee crease is not expected
// to survive. The `emblem` letter is curriculum content, so its plate stays
// oversized past good taste and is checked pixel-by-pixel at 66 px.
//
// `visorColor` names the EMBLEM PLATE and the cap's front disc, not a face
// part — the family has no visor. It must stay bright or the phonics letter
// dies.
//
// This file must not import ../art.js (circular); it carries its own svgWrap.
//
// Function names and destructured parameters are UNCHANGED from v2/v3 —
// art.js wires all nine styles by name and the palettes pass bodyColor/
// accent/emblem/visorColor/panelColor exactly as before.

function svgWrap(inner, viewBox = '0 0 120 140') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

// ---------------------------------------------------------------------------
// Part objects. Shapes are described rather than serialised so the same list
// can be painted twice — once as the white sticker halo, once for real. See
// style rule B; a hand-drawn outline path cannot stay in sync with nine poses.
// ---------------------------------------------------------------------------

const LINE = '#221a2c'
const HALO = '#fffefb'
const HALO_W = 9

function el(tag, attrs, children) {
  return children ? { tag, attrs, children } : { tag, attrs }
}

const R = (x, y, w, h, rx, fill, extra) => el('rect', { x, y, width: w, height: h, rx, fill, ...extra })
const C = (cx, cy, r, fill, extra) => el('circle', { cx, cy, r, fill, ...extra })
const E = (cx, cy, rx, ry, fill, extra) => el('ellipse', { cx, cy, rx, ry, fill, ...extra })
const P = (points, fill, extra) => el('polygon', { points, fill, ...extra })
const D = (d, fill, extra) => el('path', { d, fill, ...extra })
const S = (d, stroke, w, extra) =>
  el('path', { d, fill: 'none', stroke, 'stroke-width': w, 'stroke-linecap': 'round', ...extra })
const G = (transform, children) => el('g', { transform }, children)
const mirror = (children) => G('translate(120,0) scale(-1,1)', children)

function ink(w = 3) {
  return { stroke: LINE, 'stroke-width': w, 'stroke-linejoin': 'round' }
}

const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

const TEXT = (x, y, size, fill, label, extra) =>
  el('text', {
    x,
    y,
    'text-anchor': 'middle',
    'font-family': FONT,
    'font-size': size,
    'font-weight': 800,
    fill,
    label,
    ...extra,
  })

const SKIP = new Set(['label', 'nohalo'])

function attrStr(attrs) {
  let out = ''
  for (const k in attrs) {
    if (SKIP.has(k)) continue
    const v = attrs[k]
    if (v === undefined || v === null) continue
    out += ` ${k}="${typeof v === 'number' ? +v.toFixed(2) : v}"`
  }
  return out
}

function flatten(parts, out = []) {
  for (const p of parts) {
    if (!p) continue
    if (Array.isArray(p)) flatten(p, out)
    else out.push(p)
  }
  return out
}

function paint(parts) {
  return flatten(parts)
    .map((p) => {
      if (p.tag === 'g') return `<g${attrStr(p.attrs)}>${paint(p.children)}</g>`
      if (p.tag === 'text') return `<text${attrStr(p.attrs)}>${p.attrs.label}</text>`
      return `<${p.tag}${attrStr(p.attrs)}/>`
    })
    .join('')
}

function haloPaint(parts) {
  return flatten(parts)
    .map((p) => {
      if (p.tag === 'g') {
        const kids = haloPaint(p.children)
        return kids ? `<g${attrStr(p.attrs)}>${kids}</g>` : ''
      }
      if (p.tag === 'text' || p.attrs.nohalo) return ''
      const a = { ...p.attrs }
      delete a.opacity
      delete a['stroke-dasharray']
      const w = parseFloat(a['stroke-width']) || 0
      a.fill = a.fill && a.fill !== 'none' ? HALO : 'none'
      a.stroke = HALO
      a['stroke-width'] = w + HALO_W
      a['stroke-linejoin'] = 'round'
      a['stroke-linecap'] = 'round'
      return `<${p.tag}${attrStr(a)}/>`
    })
    .join('')
}

// Backdrop parts (shadows, speed lines, sparkles) are painted before the halo
// so the halo never rings them; body parts are painted twice.
function sticker(backdrop, body) {
  return svgWrap(`<g>${paint(backdrop)}${haloPaint(body)}${paint(body)}</g>`)
}

// ---------------------------------------------------------------------------
// Palette
// ---------------------------------------------------------------------------

const SKIN = '#ffd9b0'
const SKIN_SHADE = '#e3a173'
const NOSE = '#ffc396'
const NOSE_SHADE = '#dd8a5c'
const CHEEK = '#ff8f7a'
// Deliberately a cream white, not HALO's white: when the two matched, every
// glove merged with its own sticker rim and read as an empty hoop.
const GLOVE = '#f7f0e0'
const GLOVE_SHADE = '#cbb99c'
const SHOE = '#4d3018'
const SOLE = '#241608'
const SOLE_MID = '#7d5330'
const MOUTH = '#5e1c2c'

// Dungarees. Fixed rather than palette-driven on purpose — see casting rule 2.
const DENIM = '#2a55c4'
const DENIM_LIT = '#5580e8'
const DENIM_DEEP = '#152a63'
const STITCH = '#ffd75e'
const BUTTON = '#ffcf3a'
const BUTTON_SHADE = '#b8801a'

// ---------------------------------------------------------------------------
// SKELETON PRIMITIVES (v4). See style rules S1–S4.
// ---------------------------------------------------------------------------

// Unit normals at each joint of a limb polyline. Interior joints use the
// BISECTOR of the two adjoining segment directions, which is what lets a bend
// keep its width — offsetting by each segment's own normal instead leaves a
// notch on the inside of every elbow and knee.
function limbNormals(pts) {
  const n = pts.length
  const dirs = []
  for (let i = 0; i < n - 1; i += 1) {
    const dx = pts[i + 1].x - pts[i].x
    const dy = pts[i + 1].y - pts[i].y
    const l = Math.hypot(dx, dy) || 1
    dirs.push([dx / l, dy / l])
  }
  return pts.map((_, i) => {
    let ux
    let uy
    if (i === 0) [ux, uy] = dirs[0]
    else if (i === n - 1) [ux, uy] = dirs[n - 2]
    else {
      ux = dirs[i - 1][0] + dirs[i][0]
      uy = dirs[i - 1][1] + dirs[i][1]
      const l = Math.hypot(ux, uy) || 1
      ux /= l
      uy /= l
    }
    return [-uy, ux]
  })
}

// A polygon running between two fractional offsets of the limb's own width.
// (1,-1) is the full outline; (0.96,0.3) is the lit strip down one side; a
// two-point slice is a cross-band, which is how the trouser turn-up is built
// from the taper's own normals instead of an axis-aligned rect.
function limbBand(pts, a, b) {
  const nrm = limbNormals(pts)
  const A = []
  const B = []
  pts.forEach((p, i) => {
    const [nx, ny] = nrm[i]
    A.push(`${(p.x + nx * p.w * a).toFixed(1)},${(p.y + ny * p.w * a).toFixed(1)}`)
    B.push(`${(p.x + nx * p.w * b).toFixed(1)},${(p.y + ny * p.w * b).toFixed(1)}`)
  })
  return A.concat(B.reverse()).join(' ')
}

const limbOutline = (pts) => limbBand(pts, 1, -1)

// The crease that says "this is a joint". Surface-detail ink weight, drawn
// across the limb at the bend, stopping short of both edges so it does not
// read as a cut.
function limbCrease(pts, i, w = 1.7, op = 0.5) {
  const [nx, ny] = limbNormals(pts)[i]
  const p = pts[i]
  const k = p.w * 0.78
  return S(
    `M ${(p.x + nx * k).toFixed(1)},${(p.y + ny * k).toFixed(1)} L ${(p.x - nx * k).toFixed(1)},${(p.y - ny * k).toFixed(1)}`,
    LINE,
    w,
    { opacity: op, nohalo: true }
  )
}

// Where a glove goes: just past the wrist along the limb, so the lobe overlaps
// the wrist instead of hanging off its tip (style rule S3).
function wristSeat(pts, reach = 7) {
  const a = pts[pts.length - 2]
  const b = pts[pts.length - 1]
  const l = Math.hypot(b.x - a.x, b.y - a.y) || 1
  return [b.x + ((b.x - a.x) / l) * reach, b.y + ((b.y - a.y) / l) * reach]
}

// The angle from a hand back at the shoulder — heroGlove/villainGlove take it
// to place the cuff on the wrist side rather than the knuckle side.
function towardBody(pts, hx, hy) {
  return (Math.atan2(pts[0].y - hy, pts[0].x - hx) * 180) / Math.PI
}

// A shoulder that exists. Drawn after the torso so it overlaps the torso edge:
// the outer arc becomes the round shoulder, the inner arc reads as the armhole
// seam. v3's arms had neither, which is the whole "bar bolted to the flank"
// problem.
function deltoid(cx, cy, r, color, dark) {
  return [
    C(cx, cy, r, color, ink(3)),
    D(
      `M ${(cx - r * 0.74).toFixed(1)},${(cy - r * 0.18).toFixed(1)} A ${(r * 0.92).toFixed(1)},${(r * 0.92).toFixed(1)} 0 0 1 ${(cx + r * 0.28).toFixed(1)},${(cy - r * 0.8).toFixed(1)} A ${r},${r} 0 0 0 ${(cx - r * 0.74).toFixed(1)},${(cy - r * 0.18).toFixed(1)} Z`,
      dark ? '#000' : '#fff',
      // v5: a broad bright crescent turned the deltoid into a SPHERE stuck on
      // the flank. Thinned (0.84 -> 0.92 inner radius) and dimmed, it reads as
      // the top light on a rounded shoulder instead.
      { opacity: dark ? 0.11 : 0.15, nohalo: true }
    ),
  ]
}

// A sleeved hero arm: deltoid ball, tapered limb, elbow crease, and the glove
// seated on the wrist. `dark` shades the strip instead of lighting it, for
// arms on the figure's shadowed side.
function heroArm(pts, color, cuffColor, gloveR, dark) {
  const [hx, hy] = wristSeat(pts)
  return [
    deltoid(pts[0].x, pts[0].y - 1, pts[0].w, color, dark),
    P(limbOutline(pts), color, ink(3)),
    P(limbBand(pts, 0.96, 0.3), dark ? '#000' : '#fff', { opacity: dark ? 0.16 : 0.2, nohalo: true }),
    limbCrease(pts, 1),
    heroGlove(hx, hy, gloveR, cuffColor, towardBody(pts, hx, hy)),
  ]
}

// Villain arm: same skeleton, plainer hand, no lit strip on the deltoid crown
// (villains are shaded rather than lit — the family's hero/villain split).
function villainArm(pts, color, cuffColor, gloveR) {
  const [hx, hy] = wristSeat(pts)
  return [
    deltoid(pts[0].x, pts[0].y - 1, pts[0].w, color, true),
    P(limbOutline(pts), color, ink(2.8)),
    limbCrease(pts, 1),
    villainGlove(hx, hy, gloveR, cuffColor, towardBody(pts, hx, hy)),
  ]
}

// A trouser leg with a knee. `pts` is [hip, knee, cuffTop, ankle]: the crease
// lands on the knee, the turn-up is the last segment only, and the boot is
// drawn after so it swallows the ankle.
function denimLimb(pts) {
  const tail = pts.slice(pts.length - 2)
  return [
    P(limbOutline(pts), DENIM, ink(3)),
    P(limbBand(pts, 0.95, 0.25), DENIM_LIT, { opacity: 0.5, nohalo: true }),
    limbCrease(pts, 1, 1.7, 0.45),
    P(limbBand(tail, 1.05, -1.05), DENIM_DEEP, {
      opacity: 0.9,
      stroke: LINE,
      'stroke-width': 1.6,
      nohalo: true,
    }),
  ]
}

// A bare villain leg: taper plus knee crease, no dungarees.
function plainLimb(pts, color, inkW = 2.6) {
  return [P(limbOutline(pts), color, ink(inkW)), limbCrease(pts, 1, 1.6, 0.4)]
}

// A short neck, drawn BEFORE the torso so the shirt's collar covers its base
// and roughly seven units of it show under the jaw. v3 socketed the head
// straight into the shirt, which is the single strongest "doll, not person"
// cue in the family (style rule S5).
function neck(cx, top, bottom, halfTop, halfBot, color = SKIN, shade = SKIN_SHADE) {
  return [
    P(
      `${cx - halfTop},${top} ${cx + halfTop},${top} ${cx + halfBot},${bottom} ${cx - halfBot},${bottom}`,
      color,
      ink(2.8)
    ),
    E(cx, top + (bottom - top) * 0.34, halfTop * 0.86, 2.6, shade, { opacity: 0.5, nohalo: true }),
  ]
}

// ---------------------------------------------------------------------------
// Shared body parts
// ---------------------------------------------------------------------------

// Hero glove: outlined white lobe, a thumb, and a cuff band laid across the
// wrist as an absolute-coordinate quad (a rotated <g> would have to be
// duplicated in the halo pass). `bodyDeg` points from the glove back at the
// body, so the cuff lands on the wrist side and the finger seams on the far
// edge. The seams stay short and near the rim: an earlier pass ran three long
// creases into the palm centre and the result read as a chevron arrow.
function heroGlove(cx, cy, r, cuffColor, bodyDeg) {
  const a = (bodyDeg * Math.PI) / 180
  const away = a + Math.PI
  const at = (ang, d) => [cx + Math.cos(ang) * d, cy + Math.sin(ang) * d]
  const [wx, wy] = at(a, r * 0.86)
  const ux = Math.cos(a)
  const uy = Math.sin(a)
  const px = -uy
  const py = ux
  const half = r * 0.86
  const thick = r * 0.46
  const corner = (sp, st) => `${(wx + px * sp * half + ux * st * thick).toFixed(1)},${(wy + py * sp * half + uy * st * thick).toFixed(1)}`
  const [tx, ty] = at(away - 1.5, r * 0.88)
  const seam = (k) => {
    const g = away + k * 0.44
    const [x1, y1] = at(g, r * 0.55)
    const [x2, y2] = at(g, r * 0.9)
    return S(`M ${x1.toFixed(1)},${y1.toFixed(1)} L ${x2.toFixed(1)},${y2.toFixed(1)}`, GLOVE_SHADE, r * 0.16, {
      nohalo: true,
    })
  }
  return [
    P(`${corner(-1, -1)} ${corner(1, -1)} ${corner(1, 1)} ${corner(-1, 1)}`, cuffColor, ink(2.4)),
    C(tx, ty, r * 0.46, GLOVE, ink(2.2)),
    C(cx, cy, r, GLOVE, ink(3)),
    // Interior shading. Without it an outlined white circle on the app's
    // near-white surfaces reads as an empty hoop, not a hand.
    D(
      `M ${(cx - r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} A ${r},${r} 0 0 0 ${(cx + r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} A ${r * 1.3},${r * 1.3} 0 0 1 ${(cx - r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} Z`,
      GLOVE_SHADE,
      { opacity: 0.5, nohalo: true }
    ),
    seam(-1),
    seam(1),
  ]
}

// Villain glove: the same lobe without the thumb or seams, so hero hands and
// villain hands differ on sight even in silhouette.
function villainGlove(cx, cy, r, cuffColor, bodyDeg) {
  const a = (bodyDeg * Math.PI) / 180
  return [
    C(cx + Math.cos(a) * r * 0.62, cy + Math.sin(a) * r * 0.62, r * 0.86, cuffColor, ink(2.4)),
    C(cx, cy, r, GLOVE, ink(3)),
    D(
      `M ${(cx - r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} A ${r},${r} 0 0 0 ${(cx + r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} A ${r * 1.3},${r * 1.3} 0 0 1 ${(cx - r * 0.95).toFixed(1)},${(cy + r * 0.3).toFixed(1)} Z`,
      GLOVE_SHADE,
      { opacity: 0.5, nohalo: true }
    ),
  ]
}

// Hero boot: one outlined mass, then a sole whose bottom arc coincides with
// the boot's so the inner outline reads as a welt rather than a stray ellipse,
// then a lit toe cap. Drawn wider than the shin it hangs off, and placed so
// the shin's end sits INSIDE the dome — a boot butted against a leg's tip is
// the same "floating" mistake the gloves used to make.
function heroBoot(cx, cy, rx, ry) {
  const wy = cy + ry * 0.3
  const bot = cy + ry
  return [
    // A domed upper on a FLAT sole, not an ellipse: a shoe is only round on
    // top, and the straight bottom edge is what makes the figure stand on the
    // ground instead of balancing on a bead.
    D(
      `M ${cx - rx},${wy.toFixed(1)} C ${cx - rx},${(cy - ry * 1.02).toFixed(1)} ${cx + rx},${(cy - ry * 1.02).toFixed(1)} ${cx + rx},${wy.toFixed(1)}
       L ${cx + rx},${bot.toFixed(1)} L ${cx - rx},${bot.toFixed(1)} Z`,
      SHOE,
      ink(3)
    ),
    R(cx - rx, wy, rx * 2, ry * 0.44, 0, SOLE_MID, { stroke: LINE, 'stroke-width': 2, nohalo: true }),
    R(cx - rx, bot - ry * 0.28, rx * 2, ry * 0.28, 0, SOLE, { nohalo: true }),
    E(cx + rx * 0.24, cy - ry * 0.44, rx * 0.4, ry * 0.26, '#fff', { opacity: 0.2, nohalo: true }),
  ]
}

// Villain shoe: the boot without the welt or toe cap.
function villainShoe(cx, cy, rx, ry) {
  const bot = cy + ry
  return [
    D(
      `M ${cx - rx},${(cy + ry * 0.35).toFixed(1)} C ${cx - rx},${(cy - ry).toFixed(1)} ${cx + rx},${(cy - ry).toFixed(1)} ${cx + rx},${(cy + ry * 0.35).toFixed(1)}
       L ${cx + rx},${bot.toFixed(1)} L ${cx - rx},${bot.toFixed(1)} Z`,
      SHOE,
      ink(3)
    ),
    R(cx - rx, bot - ry * 0.42, rx * 2, ry * 0.42, 0, SOLE, { nohalo: true }),
  ]
}

// Cap: dome, panel seams, a brim wider than the shoulders with a dark
// underside, and a bright front disc. The brim is drawn thin and high on the
// head (0.86 of halfW) because the big v3 eyes need the room underneath it.
// `discColor` is skipped on the boss, whose cap already carries a star.
function cap(cx, top, halfW, domeColor, brimColor, discColor) {
  const brimY = top + halfW * 0.86
  // The dome is a cubic whose control points sit at `top`, so its actual crown
  // is at top + 0.215*halfW, not at `top`. Seams authored up to `top` poked out
  // of the cap as two grey arcs floating above the head. They now stop below
  // the crown.
  const crown = top + halfW * 0.3
  const seam = (k) =>
    S(
      `M ${cx + k * halfW * 0.5},${brimY} C ${cx + k * halfW * 0.55},${top + halfW * 0.6}
       ${cx + k * halfW * 0.34},${crown} ${cx + k * halfW * 0.12},${crown}`,
      LINE,
      1.5,
      { opacity: 0.3, nohalo: true }
    )
  return [
    D(`M ${cx - halfW},${brimY} C ${cx - halfW},${top} ${cx + halfW},${top} ${cx + halfW},${brimY} Z`, domeColor, ink(3.2)),
    D(
      `M ${cx - halfW * 0.9},${brimY} C ${cx - halfW * 0.88},${top + halfW * 0.42}
       ${cx - halfW * 0.16},${crown} ${cx - halfW * 0.04},${crown}
       C ${cx - halfW * 0.55},${top + halfW * 0.5} ${cx - halfW * 0.66},${top + halfW * 0.78} ${cx - halfW * 0.62},${brimY} Z`,
      '#fff',
      { opacity: 0.22, nohalo: true }
    ),
    seam(-1),
    seam(1),
    // A lens with pointed tips rather than an ellipse: the drawn tips are what
    // make it read as the stiff peak of a cap instead of a disc behind a head.
    D(
      `M ${cx - halfW * 1.3},${brimY} Q ${cx},${brimY - halfW * 0.44} ${cx + halfW * 1.3},${brimY}
       Q ${cx},${brimY + halfW * 0.34} ${cx - halfW * 1.3},${brimY} Z`,
      brimColor,
      ink(2.8)
    ),
    D(
      `M ${cx - halfW * 1.24},${brimY + halfW * 0.02} Q ${cx},${brimY + halfW * 0.32} ${cx + halfW * 1.24},${brimY + halfW * 0.02}
       Q ${cx},${brimY + halfW * 0.16} ${cx - halfW * 1.24},${brimY + halfW * 0.02} Z`,
      '#000',
      { opacity: 0.3, nohalo: true }
    ),
    discColor
      ? [
          C(cx, brimY - halfW * 0.4, halfW * 0.27, discColor, ink(2.4)),
          S(
            `M ${cx - halfW * 0.17},${brimY - halfW * 0.48} A ${halfW * 0.22},${halfW * 0.22} 0 0 1 ${cx + halfW * 0.06},${brimY - halfW * 0.58}`,
            '#fff',
            1.7,
            { opacity: 0.75, nohalo: true }
          ),
        ]
      : null,
  ]
}

// Hero face. Big outlined eyes with a heavy eyelid stroke standing in for a
// brow (the cap brim leaves no room above the eye), a big round nose over the
// top of them, blushed cheeks, and an open smile with a teeth strip. `s`
// scales every offset from one number so the boss's larger head needs no
// re-tuning.
function face(cx, cy, s = 1) {
  const dx = 9 * s
  const ex = 5.9 * s
  const ey = 6.7 * s
  const nr = 6 * s
  const ny = cy + 7.6 * s
  const my = ny + 6.6 * s
  const mw = 8 * s
  // A big white sclera under a thin outline plus a small pupil reads as
  // SPECTACLES. The fix is a dominant pupil (0.72 of the sclera) under a heavy
  // lid wedge that sits ON the sclera rather than floating above it as a rim.
  const eye = (px, k) => [
    E(px, cy, ex, ey, '#fff', ink(2 * s)),
    C(px + k * ex * 0.14, cy + ey * 0.2, ex * 0.72, LINE, { nohalo: true }),
    C(px + k * ex * 0.14 - ex * 0.3, cy - ey * 0.14, ex * 0.26, '#fff', { nohalo: true }),
    D(
      `M ${px - ex * 1.05},${cy - ey * 0.42} Q ${px + k * ex * 0.2},${cy - ey * 1.5} ${px + ex * 1.05},${cy - ey * 0.36}
       Q ${px},${cy - ey * 0.62} ${px - ex * 1.05},${cy - ey * 0.42} Z`,
      LINE,
      { nohalo: true }
    ),
  ]
  return [
    E(cx - dx * 1.72, cy + 5.6 * s, 5 * s, 3.2 * s, CHEEK, { opacity: 0.6, nohalo: true }),
    E(cx + dx * 1.72, cy + 5.6 * s, 5 * s, 3.2 * s, CHEEK, { opacity: 0.6, nohalo: true }),
    eye(cx - dx, 1),
    eye(cx + dx, -1),
    D(
      `M ${cx - mw},${my} Q ${cx},${my + 2.4 * s} ${cx + mw},${my} Q ${cx},${my + 8 * s} ${cx - mw},${my} Z`,
      MOUTH,
      ink(2.2 * s)
    ),
    D(
      `M ${cx - mw * 0.78},${my + 0.6 * s} Q ${cx},${my + 2.4 * s} ${cx + mw * 0.78},${my + 0.6 * s}
       Q ${cx},${my + 4 * s} ${cx - mw * 0.78},${my + 0.6 * s} Z`,
      '#fff',
      { nohalo: true }
    ),
    // Corner ticks. Without them an inked mouth shape reads as a scratch
    // rather than a smile — lifted from the toy family's `grin`.
    S(
      `M ${cx - mw},${my} L ${cx - mw - 2.2 * s},${my - 2.4 * s} M ${cx + mw},${my} L ${cx + mw + 2.2 * s},${my - 2.4 * s}`,
      LINE,
      2.4 * s,
      { nohalo: true }
    ),
    C(cx, ny, nr, NOSE, ink(2.6 * s)),
    E(cx, ny + nr * 0.44, nr * 0.7, nr * 0.4, NOSE_SHADE, { opacity: 0.65, nohalo: true }),
    C(cx - nr * 0.32, ny - nr * 0.36, nr * 0.28, '#fff', { opacity: 0.8, nohalo: true }),
  ]
}

// Head assembly in draw order: ears behind, face mass, the brim's cast shadow
// on the forehead, the cap, then the features. Shared by all four heroes so
// the cast has one face.
function heroHead(cx, capTop, faceTop, faceW, faceH, capHalf, bodyColor, accent, discColor, s = 1) {
  const fx = cx - faceW / 2
  const earY = faceTop + faceH * 0.52
  const er = 4.6 * s
  const ear = (px) => [
    E(px, earY, er, er * 1.3, SKIN, ink(2.4)),
    // A crescent, not a filled inner ellipse: filled, the pair read as dark
    // ear-muffs clamped to the head at 132 px.
    S(`M ${px},${earY - er * 0.6} Q ${px + er * 0.5},${earY} ${px},${earY + er * 0.6}`, SKIN_SHADE, 1.8, {
      nohalo: true,
    }),
  ]
  // A JAWED head, not a pill. Round cranium (it is under a cap anyway), then
  // straight cheeks tapering to a narrower chin. The genre's face is round
  // enough that a full hexagon would fight it, but a pill reads as a bean —
  // the taper is the compromise that keeps the genre and loses the bean.
  const jaw = faceW * 0.4
  return [
    ear(fx + 1),
    ear(fx + faceW - 1),
    D(
      `M ${fx},${faceTop + faceH * 0.34} C ${fx},${faceTop} ${fx + faceW},${faceTop} ${fx + faceW},${faceTop + faceH * 0.34}
       L ${cx + jaw},${faceTop + faceH * 0.78} Q ${cx + jaw},${faceTop + faceH} ${cx},${faceTop + faceH}
       Q ${cx - jaw},${faceTop + faceH} ${cx - jaw},${faceTop + faceH * 0.78} Z`,
      SKIN,
      ink(3.2)
    ),
    // No jaw shade plane here: at 132 px a soft patch under the mouth read as
    // a goatee. The jaw's own ink line carries the chin.
    E(cx, capTop + capHalf * 0.86 + 3, faceW * 0.44, 4.6 * s, '#000', { opacity: 0.16, nohalo: true }),
    cap(cx, capTop, capHalf, bodyColor, accent, discColor),
    face(cx, faceTop + faceH * 0.5, s),
  ]
}

// The emblem is the phonics letter the child ties to the character, so the
// plate is sized past the point of good taste — it is the one element that
// still has to survive a 66 px box, where a 120x140 viewBox letterboxes to
// 57x66 and a unit is under half a pixel. Riveted at the corners so it reads
// as a patch sewn onto the bib rather than a hole in it, and inked so the
// bright plate keeps its edge on any denim.
function emblemPlate(x, y, w, h, plateColor, textColor, label, size) {
  const r = Math.min(w, h) * 0.26
  return [
    R(x, y, w, h, r, plateColor, ink(3.2)),
    R(x + 3, y + 3, w - 6, h * 0.26, r * 0.5, '#fff', { opacity: 0.5, nohalo: true }),
    C(x + 5.5, y + 5.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    C(x + w - 5.5, y + 5.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    C(x + 5.5, y + h - 5.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    C(x + w - 5.5, y + h - 5.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    TEXT(x + w / 2, y + h / 2 + size * 0.36, size, textColor, label),
  ]
}

// The bib-and-hips denim mass: inked body, a lit plane down the left, a dashed
// topstitch border and two patch pockets. Always drawn WIDER than the shirt
// above it — see casting rule 3, the outline step is what carries "wearing
// dungarees" into a flat silhouette.
function bibPanel(x, y, w, h, r = 10, flare = 4) {
  return [
    // Flared: a trapezoid widening downward, so the widest point of the whole
    // figure is the hips and the waist step is a real angle rather than a
    // rectangle edge.
    D(`M ${x},${y} L ${x + w},${y} L ${x + w + flare},${y + h - r} Q ${x + w + flare},${y + h} ${x + w + flare - r},${y + h}
       L ${x - flare + r},${y + h} Q ${x - flare},${y + h} ${x - flare},${y + h - r} Z`, DENIM, ink(3.2)),
    R(x + 1, y + 1, w * 0.38, h - 2, r, DENIM_LIT, { opacity: 0.5, nohalo: true }),
    R(x + 4, y + 4, w - 8, h - 8, r * 0.8, 'none', {
      stroke: STITCH,
      'stroke-width': 1.6,
      'stroke-dasharray': '4.5,3.5',
      opacity: 0.9,
      nohalo: true,
    }),
    // Pushed right out to the bib's flared corners: v4's narrower hips left no
    // room between the emblem plate and the pockets, and the plate is drawn
    // after, so a centred pocket was simply painted over.
    pocket(x - 0.5, y + h * 0.5, h),
    pocket(x + w - 8.5, y + h * 0.5, h),
  ]
}

// Patch pocket, at the bib's lower corners rather than its middle, where the
// emblem plate always sits.
function pocket(px, py, h) {
  return [
    R(px, py, 9, h * 0.34, 2.5, DENIM_DEEP, { opacity: 0.55, stroke: LINE, 'stroke-width': 1.5, nohalo: true }),
    S(`M ${px + 1},${py + 3} L ${px + 8},${py + 3}`, STITCH, 1.5, { opacity: 0.75, nohalo: true }),
  ]
}

// One shoulder strap, authored for the left side and mirrored for the right.
// It deliberately runs past the shoulder line: the two strap tops are knobs on
// the silhouette, which is how the dungarees survive a colour-stripped read.
// v4 keeps them INBOARD of the deltoid balls so the new arms cannot cover them.
function strapPiece(outer, stitch) {
  return [
    P(outer, DENIM, ink(2.8)),
    S(stitch, STITCH, 1.6, { 'stroke-dasharray': '4.5,3.5', opacity: 0.85, nohalo: true }),
  ]
}

// A dungaree button, centred ON the bib's outer edge so half of it sticks out
// of the body outline (casting rule 3). Big enough to read as a button and not
// a rivet: r=7..8.5 against the robots' 1.8-unit wheel centres.
function bigButton(cx, cy, r = 7.5) {
  return [
    C(cx, cy, r, BUTTON, ink(2.8)),
    C(cx, cy + r * 0.22, r * 0.68, BUTTON_SHADE, { opacity: 0.55, nohalo: true }),
    C(cx - r * 0.26, cy - r * 0.32, r * 0.3, '#fff', { opacity: 0.8, nohalo: true }),
    C(cx, cy, r * 0.2, LINE, { opacity: 0.6, nohalo: true }),
  ]
}

// ---------------------------------------------------------------------------
// HEROES
//
// Standing skeleton shared by all four (the jumper swaps the legs for a tuck):
//   head    cap 4, face 10..47, width 34, brim half 20   (UNCHANGED in v6)
//   neck    43..56, 7 units of it visible under the jaw
//   shirt   collar 54, shoulders 46 @ y 62, waist 38 @ y 72
//   bib     46 wide @ 70, flaring to 50 @ 92
//   arm     shoulder {37,62,9} elbow {22,74,7.6} wrist {19,89,6}
//   leg     hip {51,90,10} knee {45,108,8.2} cuff {42.5,116,7} ankle {41,120,6.8}
//   boot    centred 3 units outboard of the ankle, sole at y 131..132
//
// The v6 numbers are one budget, not four independent choices. Chin 47 and
// sole ~131 are both fixed (the head is not shrinking, and the sole cannot
// pass ~132 without the halo leaving the frame), so the 84 units between them
// are split torso-against-leg and nothing else. 18 + 22 for shirt and bib is
// the floor: the shirt has to be at least as tall as the 18-unit deltoid ball
// sitting in it, and the bib has to hold a 21-unit emblem plate. What is left
// — 40 units — is the leg, and that is the whole of v6's leg gain.
//
// The KNEE-OUT, ANKLE-OUT splay (hip 51 -> knee 45 -> ankle 41) is not a
// stance idea, it is the only cutout hole this family can have: at the ankle
// the two legs leave 22 units of background and the two boots 20, which clears
// the 9 units two halos eat. Straight-down legs measured 13 and merged.
//
// v5's note on arm length still holds — the glove sits beside the hip, not in
// the armpit — but in v6 it also has to CLEAR the bib rather than overlap it,
// which is what the narrower torso buys.
// ---------------------------------------------------------------------------

const HERO_ARM_L = [
  { x: 37, y: 62, w: 9 },
  { x: 22, y: 74, w: 7.6 },
  { x: 19, y: 89, w: 6 },
]

const HERO_LEG_L = [
  { x: 51, y: 90, w: 10 },
  { x: 45, y: 108, w: 8.2 },
  { x: 42.5, y: 116, w: 7 },
  { x: 41, y: 120, w: 6.8 },
]

// Shirt with sloped shoulders and a dropped collar. The slope is what lets the
// neck exist and what stops the shoulder from being a corner.
function heroShirt(bodyColor) {
  return [
    D('M 37,62 C 37,56 43,54 50,54 L 70,54 C 77,54 83,56 83,62 L 79,72 L 41,72 Z', bodyColor, ink(3.2)),
    P('70,55 83,62 79,72 71,72', '#000', { opacity: 0.14, nohalo: true }),
    P('44,57 68,57 66,62 46,62', '#fff', { opacity: 0.22, nohalo: true }),
  ]
}

// The jumper: the only figure in the family with both feet off the ground. One
// arm punches above the cap, the legs are split — one knee tucked up, the other
// trailing straight — and the ground shadow is left small and far below so the
// air gap is unmistakable. The split legs are also the clearest knee read in
// the family, since the two bends go opposite ways.
export function platJumper({
  bodyColor = '#e03a3a',
  accent = '#1f3f8f',
  emblem = 'R',
  visorColor = '#fff3c4',
} = {}) {
  const strapL = strapPiece('40,47 49,51 47,78 39,78', 'M 45,55 L 43,74')
  const legTuck = [
    { x: 51, y: 90, w: 10 },
    { x: 39, y: 101, w: 8.2 },
    { x: 36, y: 109, w: 7 },
    { x: 35, y: 113, w: 6.8 },
  ]
  const legTrail = [
    { x: 69, y: 90, w: 10 },
    { x: 79, y: 105, w: 8.2 },
    { x: 83, y: 114, w: 7 },
    { x: 85, y: 118, w: 6.8 },
  ]
  const armPunch = [
    { x: 83, y: 61, w: 9 },
    { x: 94, y: 47, w: 7.6 },
    { x: 97, y: 33, w: 6 },
  ]
  const backdrop = [
    E(60, 136, 12, 2.6, '#000', { opacity: 0.14 }),
    // Trailing speed lines in the air the tucked legs just left. They and the
    // small far-below shadow are the whole "airborne" cue, so they sit in the
    // gap between boot and ground rather than beside the torso, where they
    // read as scratches on the character.
    // Held at y <= 136: at v4's y 139 the 3.8-wide round cap reached y 140.9
    // and the bottom line was shaved off by the viewBox edge.
    S(
      'M 12,130 L 24,122 M 108,130 L 98,124 M 44,136 L 52,128 M 78,136 L 70,129 M 60,136 L 60,129',
      accent,
      3.8,
      { opacity: 0.7 }
    ),
  ]
  const body = [
    strapL,
    mirror(strapL),
    neck(60, 43, 56, 7, 8),

    denimLimb(legTuck),
    heroBoot(32, 115, 12, 7),
    denimLimb(legTrail),
    heroBoot(88, 121, 12, 7),

    heroShirt(bodyColor),

    bibPanel(37, 70, 46, 22, 10, 2),
    bigButton(36, 81, 6.5),
    mirror(bigButton(36, 81, 6.5)),
    emblemPlate(45, 70.5, 30, 21, visorColor, accent, emblem, 24),

    heroArm(HERO_ARM_L, bodyColor, accent, 9),
    heroArm(armPunch, bodyColor, accent, 10, true),

    heroHead(60, 4, 10, 34, 37, 20, bodyColor, accent, visorColor),
  ]
  return sticker(backdrop, body)
}

// The spring: the shirt is replaced by a stack of coil turns, so this one is
// the tallest and narrowest of the four. The turns are fat and few — thin
// coils turn to mush at small sizes — and each carries its own lit crescent so
// the stack reads as a helix rather than a pile of rings. The coil's collar
// block is where the neck lands, and the shoulders sit on the widest turn, so
// the arms leave the coil on a curve like everyone else's.
export function platSpring({
  bodyColor = '#2f9e5c',
  accent = '#16522f',
  emblem = 'M',
  visorColor = '#fff3c4',
} = {}) {
  const turn = (cy, rx, cx) => [
    E(cx, cy, rx, 8.5, bodyColor, ink(3)),
    E(cx - rx * 0.3, cy - 3, rx * 0.44, 2.6, '#fff', { opacity: 0.26, nohalo: true }),
  ]
  const seam = (cy, rx) => E(60, cy, rx, 3.2, accent, ink(2.2))
  const strapL = strapPiece('40,47 49,52 47,80 39,80', 'M 45,56 L 43,76')
  const armL = [
    { x: 45, y: 65, w: 9 },
    { x: 23, y: 75, w: 7.6 },
    { x: 20, y: 89, w: 6 },
  ]
  // Deliberately not a mirror, and v6's biggest silhouette change in the
  // family: the right arm is RAISED. A hanging arm cannot separate from a
  // 46-unit bib inside a 120-unit frame once both masses carry a 4.5-unit
  // halo — measured, the best a hanging pair gets is an 8-unit slot, which
  // reads on screen and vanishes in a hard cutout. Raised, the background
  // between forearm and neck measures 18 units, so the armpit is a real hole
  // in the cutout. One arm up also gives the spring its bounce.
  const armR = [
    { x: 74, y: 66, w: 9 },
    { x: 90, y: 58, w: 7.6 },
    { x: 96, y: 45, w: 6 },
  ]
  const legL = [
    { x: 51, y: 94, w: 10 },
    { x: 45, y: 111, w: 8.2 },
    { x: 42.5, y: 119, w: 7 },
    { x: 41, y: 123, w: 6.8 },
  ]
  const backdrop = [E(60, 135, 22, 3.2, '#000', { opacity: 0.14 })]
  const body = [
    strapL,
    mirror(strapL),
    neck(60, 43, 56, 7, 8),

    denimLimb(legL),
    mirror(denimLimb(legL)),
    heroBoot(38, 125, 12, 7),
    mirror(heroBoot(38, 125, 12, 7)),

    R(52, 53, 16, 7, 3, accent, ink(2.6)),
    turn(60, 15, 58),
    turn(66, 18, 62),
    turn(72, 15, 58),
    seam(63, 17),
    seam(69, 17),

    bibPanel(37, 74, 46, 22, 10, 2),
    bigButton(36, 85, 6.5),
    mirror(bigButton(36, 85, 6.5)),

    // Ollie's emblem is a round plate rather than the others' rectangle, so
    // the letter O is not fighting a rectangle around it. Checked at 66 px.
    // v6 shortened the bib by 4 units but the plate keeps its 26-unit letter:
    // the disc lost radius, not type size, so the phonics read is unchanged.
    C(60, 85, 14.5, visorColor, ink(3.4)),
    S('M 48,78 A 14,14 0 0 1 68,73', '#fff', 2.4, { opacity: 0.6, nohalo: true }),
    TEXT(60, 94.4, 26, accent, emblem),

    heroArm(armL, bodyColor, accent, 9),
    heroArm(armR, bodyColor, accent, 9, true),

    heroHead(60, 4, 10, 34, 37, 20, bodyColor, accent, visorColor),
  ]
  return sticker(backdrop, body)
}

// The block: the squarest silhouette in the family and the widest. The shirt is
// a crate — a framed box with plank courses down each side of the emblem — and
// the dungarees hang below it, so the boxy chest and the denim hips read as two
// stacked masses. Limbs stay stubby and boots wide: a boxy body on long legs
// read as a chimney. The crate has no collar to drop, so the neck is short
// here and the deltoid balls do more of the head-to-torso separation.
export function platBlock({
  bodyColor = '#e08a1e',
  accent = '#7a3d0c',
  emblem = 'D',
  visorColor = '#fff3c4',
} = {}) {
  const course = (y) => [
    R(42, y, 36, 3.2, 0.8, accent, { opacity: 0.85, stroke: LINE, 'stroke-width': 1.4, nohalo: true }),
  ]
  const bracket = (x, y) => R(x, y, 8, 8, 2, '#000', { opacity: 0.22, stroke: LINE, 'stroke-width': 1.5, nohalo: true })
  const strapL = strapPiece('41,46 50,50 48,80 40,80', 'M 46,54 L 44,76')
  const armL = [
    { x: 37, y: 58, w: 9.5 },
    { x: 22, y: 70, w: 8 },
    { x: 19, y: 85, w: 6.3 },
  ]
  const legL = [
    { x: 51, y: 92, w: 10 },
    { x: 45, y: 109, w: 8.2 },
    { x: 42.5, y: 117, w: 7 },
    { x: 41, y: 121, w: 6.8 },
  ]
  const backdrop = [E(60, 135, 34, 3.6, '#000', { opacity: 0.14 })]
  const body = [
    strapL,
    mirror(strapL),
    neck(60, 42, 55, 7, 8),

    denimLimb(legL),
    mirror(denimLimb(legL)),
    heroBoot(38, 124, 13, 7),
    mirror(heroBoot(38, 124, 13, 7)),

    R(37, 52, 46, 26, 7, accent, ink(3.2)),
    R(42, 57, 36, 17, 4, bodyColor, ink(2.2)),
    R(43, 58, 34, 5, 3, '#fff', { opacity: 0.2, nohalo: true }),
    course(65),
    course(70),
    R(58.4, 57, 3.2, 8, 0.8, accent, { opacity: 0.85, nohalo: true }),
    R(49, 68, 3.2, 6, 0.8, accent, { opacity: 0.85, nohalo: true }),
    R(67, 68, 3.2, 6, 0.8, accent, { opacity: 0.85, nohalo: true }),
    bracket(38, 53),
    bracket(75, 53),
    bracket(38, 69),
    bracket(75, 69),

    bibPanel(37, 74, 46, 22, 10, 2),
    bigButton(36, 85, 6.5),
    mirror(bigButton(36, 85, 6.5)),
    emblemPlate(45, 74.5, 30, 21, visorColor, accent, emblem, 24),

    heroArm(armL, bodyColor, accent, 9.5),
    mirror(heroArm(armL, bodyColor, accent, 9.5)),

    heroHead(60, 4, 10, 34, 37, 20, bodyColor, accent, visorColor),
  ]
  return sticker(backdrop, body)
}

// The power-up form, chapter boss: deliberately the heaviest figure in the
// family, and the only one whose cap is winged. It carries one visible trace of
// each earlier hero — the jumper's gloves grown to their largest, the spring's
// coil turns as rings around the shins, the block's plank slabs as the bib's
// side panels — the same "trace, never louder than the combined form" rule the
// other families' bosses follow. The glow is a flat ray burst: translucent
// discs behind the figure are painted straight over by the white sticker halo,
// so rays reaching past the silhouette are the only kind of glow that survives.
export function platPowerup({
  bodyColor = '#c8342f',
  panelColor = '#fff6df',
  accent = '#f0b429',
  visorColor = '#ffe066',
} = {}) {
  const star = (cx, cy, r, fill, extra) => {
    const pts = []
    for (let i = 0; i < 10; i += 1) {
      const a = (Math.PI / 5) * i - Math.PI / 2
      const rr = i % 2 === 0 ? r : r * 0.44
      pts.push(`${(cx + Math.cos(a) * rr).toFixed(1)},${(cy + Math.sin(a) * rr).toFixed(1)}`)
    }
    return P(pts.join(' '), fill, extra)
  }
  const sparkle = (cx, cy, r) => [
    star(cx, cy, r, visorColor, { opacity: 0.85 }),
    C(cx, cy, r * 0.3, panelColor, { opacity: 0.9 }),
  ]
  // One broad wing with a serrated trailing edge. Smooth rounded lobes read as
  // rabbit ears, a single sharp wedge as a devil horn, and thin separate
  // feathers as insect antennae; a wide mass plus notches is the only version
  // that stayed a wing down to 66 px.
  const wing = [
    P('42,18 10,7 15,15 9,14 16,20 9,23 19,28 42,29', accent, ink(2.8)),
    P('42,19 16,11 18,16 26,21 42,25', panelColor, { nohalo: true }),
  ]
  // Narrow: wider, the two panels plus the emblem plate covered the bib edge
  // to edge and the denim — half of the family's two-tone — disappeared on the
  // one figure that most needs to look like the others.
  const plankPanel = (x) => [
    R(x, 75, 11, 19, 2.5, accent, ink(2.4)),
    S(`M ${x + 1},${81} L ${x + 10},${81}`, LINE, 1.6, { opacity: 0.5, nohalo: true }),
    S(`M ${x + 1},${87} L ${x + 10},${87}`, LINE, 1.6, { opacity: 0.5, nohalo: true }),
  ]
  // The spring's trace, moved from the ankles to the shins so it sits ON the
  // new tapered leg instead of floating between leg and boot.
  const coilRing = (cx, cy) => E(cx, cy, 11, 3, accent, ink(2.2))
  const strapL = strapPiece('35,47 47,52 45,80 34,80', 'M 41,56 L 39,76')
  // v6: BOTH ARMS RAISED, and thicker than any other figure's. Two problems at
  // once. (a) Silhouette: this figure is 64 units across the hips, so a hanging
  // arm has nowhere to be except against the flank — measured, the glove
  // overlapped the bib's flared corner by 5 units and the boss was the most
  // fused shape of the nine. Raised, the background between forearm and jaw is
  // an open notch instead. (b) Size: arms up push the figure's mass to the top
  // corners of a frame the minibots leave empty, which is most of what makes
  // this one read as the bigger, combined form.
  // Hand height is set by the HEAD's jaw taper, not by the arm: at y 42+ the
  // 42-unit head narrows to 43.2..76.8, so a fist parked there clears the face
  // by 12 units of background instead of 8. And the binding clip is not the
  // glove lobe but its THUMB, which sits r*0.88 out from the centre and adds
  // r*0.46 of its own — 14 units before ink and halo. Measured, wrist x 18.5
  // put the thumb's halo at x -1.0.
  const armL = [
    { x: 30, y: 70, w: 12 },
    { x: 22.5, y: 62, w: 10.2 },
    { x: 21.5, y: 52, w: 8.5 },
  ]
  const legL = [
    { x: 52, y: 93, w: 12.5 },
    { x: 46, y: 109, w: 10 },
    { x: 42, y: 117, w: 8.6 },
    { x: 40, y: 121, w: 8.4 },
  ]
  // Rays reach as far as the frame allows in their own direction rather than
  // sharing one radius: at a fixed radius the diagonals stopped well short of
  // the corners, which is the only place a ray has room to be seen past the
  // silhouette at all.
  const ray = (deg, r0, r1, half, fill, op) => {
    const a = (deg * Math.PI) / 180
    const ca = Math.cos(a)
    const sa = Math.sin(a)
    const reach = Math.min(r1, 56 / (Math.abs(ca) || 1e-6), 58 / (Math.abs(sa) || 1e-6))
    const at = (d, k) => `${(60 + ca * d - sa * k).toFixed(1)},${(76 + sa * d + ca * k).toFixed(1)}`
    return P(`${at(r0, -half)} ${at(reach, 0)} ${at(r0, half)}`, fill, { opacity: op })
  }
  const backdrop = [
    E(60, 134, 46, 4, '#000', { opacity: 0.16 }),
    // v6: inner radius 36 -> 44, width 8 -> 6.5. At 36 every ray started INSIDE the figure, so
    // the white halo ate its root and the burst fused into the torso mass — in
    // a hard cutout the boss was a spiked blob. Starting outboard of the
    // silhouette's halo, the rays are detached spikes with real background
    // between them and the body, which is what an aura has to be here.
    ...Array.from({ length: 16 }, (_, i) => ray(i * 22.5 + 11, 44, 78, 6.5, visorColor, 0.85)),
    ...Array.from({ length: 8 }, (_, i) => ray(i * 45 + 22.5, 44, 82, 4, panelColor, 0.9)),
    sparkle(14, 116, 6),
    sparkle(104, 116, 6),
    sparkle(11, 70, 4.4),
    sparkle(108, 76, 4.4),
  ]
  const body = [
    strapL,
    mirror(strapL),
    neck(60, 44, 59, 10, 11),

    denimLimb(legL),
    mirror(denimLimb(legL)),
    coilRing(44, 110),
    coilRing(42.5, 117),
    mirror([coilRing(44, 110), coilRing(42.5, 117)]),
    heroBoot(36, 124, 16, 8),
    mirror(heroBoot(36, 124, 16, 8)),

    D('M 28,67 C 28,58 38,56 46,56 L 74,56 C 82,56 92,58 92,67 L 87,77 L 33,77 Z', bodyColor, ink(3.4)),
    P('74,57 92,67 87,77 75,77', '#000', { opacity: 0.15, nohalo: true }),
    P('40,59 72,59 70,64 42,64', '#fff', { opacity: 0.22, nohalo: true }),

    bibPanel(28, 74, 64, 21, 12, 4),
    plankPanel(27),
    plankPanel(82),
    bigButton(26, 84.5, 8),
    mirror(bigButton(26, 84.5, 8)),
    emblemPlate(43, 74.5, 34, 20, panelColor, bodyColor, '★', 24),

    heroArm(armL, bodyColor, bodyColor, 10.5),
    mirror(heroArm(armL, bodyColor, bodyColor, 10.5)),

    wing,
    mirror(wing),
    heroHead(60, 3, 10, 42, 41, 24, bodyColor, bodyColor, null, 1.108),
    // Sits in the same slot as the other three heroes' cap disc. Higher and
    // larger, its top point pushed through the dome's crown and left a stray
    // nub of ink and halo above the cap.
    star(60, 14, 7.5, accent, ink(2.2)),
    star(60, 14, 3.4, panelColor, { nohalo: true }),
  ]
  return sticker(backdrop, body)
}

// ---------------------------------------------------------------------------
// VILLAINS. Same inked-sticker rendering AND the same v4 skeleton as the
// heroes — deltoid balls, tapered limbs with elbow and knee creases, a neck —
// but tilted, lopsided and asymmetric where the heroes are upright and
// balanced. Applying the skeleton to only half the cast was never an option:
// side by side in a battle screen, the untouched half looks broken. No cap, no
// emblem plate (the letters belong to the heroes), and because there is no
// brim they get real angled brows rather than the heroes' eyelid strokes. Each
// one's silhouette is its gameplay gimmick made literal. Villains take only
// { bodyColor, accent }.
// ---------------------------------------------------------------------------

// Fixed magnet colours — a horseshoe magnet reads as red/blue regardless of
// the character palette, the same way the robots' headlights stay chrome.
const MAGNET_RED = '#d1332f'
const MAGNET_BLUE = '#2f5fb0'

// Villain face: the heroes' big outlined eyes, but the eyelid stroke is
// replaced by a heavy brow angled down toward the nose, and the smile becomes
// a fanged mouth. `tilt` skews the brows further for the nastier ones.
function villainFaceParts(cx, cy, opts = {}) {
  const { s = 1, dx = 10.5, ex = 6.2, tilt = 1, mouthY = cy + 16, mouthW = 10, fangs = 2, mouth = true } = opts
  const ey = ex * 1.06
  const eye = (px, k) => [
    E(px, cy, ex * s, ey * s, '#fff', ink(2.2)),
    C(px + k * ex * 0.22 * s, cy + ey * 0.16 * s, ex * 0.56 * s, LINE, { nohalo: true }),
    C(px + k * ex * 0.22 * s - ex * 0.24 * s, cy - ey * 0.18 * s, ex * 0.2 * s, '#fff', { nohalo: true }),
  ]
  const brow = (px, k) =>
    S(
      `M ${px - k * ex * 1.5 * s},${cy - ey * (1.05 + 0.55 * tilt) * s} L ${px + k * ex * 1.15 * s},${cy - ey * 1.0 * s}`,
      LINE,
      4.4 * s,
      { nohalo: true }
    )
  const fang = (k) =>
    D(
      `M ${cx + k * mouthW * 0.42},${mouthY + 0.6} l ${mouthW * 0.2},0 l ${-mouthW * 0.1},${mouthW * 0.5} Z`,
      '#fff',
      { nohalo: true }
    )
  return [
    eye(cx - dx * s, -1),
    eye(cx + dx * s, 1),
    brow(cx - dx * s, 1),
    brow(cx + dx * s, -1),
    mouth
      ? [
          D(
            `M ${cx - mouthW},${mouthY} Q ${cx},${mouthY + 3} ${cx + mouthW},${mouthY}
             Q ${cx},${mouthY + 13} ${cx - mouthW},${mouthY} Z`,
            MOUTH,
            ink(2.4)
          ),
          fangs >= 1 ? fang(-1) : null,
          fangs >= 2 ? fang(1) : null,
        ]
      : null,
  ]
}

// Topsy (plat-flip): inverts the child's jump. The BODY is drawn as an ordinary
// standing figure and then flipped vertically — the same trick dinoUpside used
// — so the feet land at the top without hand-redrawing every part upside down.
// The FACE is painted outside that flip, upright, at the flipped head's
// position: a fully inverted face put the brows under the eyes and the mouth
// above them, which read as a rendering bug rather than a gag. Standing on its
// head while still looking straight at the child is the readable version.
// The chest chevron is authored pointing at the head (up, pre-flip); after the
// flip it points at the ground, reading as "down" regardless of body facing.
// v4 note: the flip is exactly why this figure needed the skeleton most —
// upside down, the eye lands on the knees and the hands, so a leg with no knee
// is the first thing a child sees.
export function platFlip({ bodyColor = '#7a3fc9', accent = '#3f1f70' } = {}) {
  const FLIP = 131 // y' = FLIP - y
  const armL = [
    { x: 38, y: 58, w: 8.5 },
    { x: 28, y: 68, w: 7.2 },
    { x: 24, y: 79, w: 6 },
  ]
  const armR = [
    { x: 82, y: 57, w: 8.5 },
    { x: 92, y: 65, w: 7.2 },
    { x: 96, y: 75, w: 6 },
  ]
  // Mismatched on purpose: one leg longer and kicked further out than the
  // other is the family's villain tell, and upside down it reads immediately.
  const legL = [
    { x: 50, y: 82, w: 9.5 },
    { x: 45, y: 96, w: 7.6 },
    { x: 44, y: 107, w: 6.6 },
  ]
  const legR = [
    { x: 70, y: 82, w: 9.5 },
    { x: 76, y: 98, w: 7.6 },
    { x: 77, y: 109, w: 6.6 },
  ]
  const sock = (pts, y0) => [
    P(limbBand(pts.slice(1), 1.02, -1.02), accent, { opacity: 0.9, stroke: LINE, 'stroke-width': 1.6, nohalo: true }),
    S(`M ${pts[2].x - 6},${y0} L ${pts[2].x + 6},${y0}`, bodyColor, 3, { nohalo: true }),
  ]
  const upright = [
    // v4 drew this neck and then covered every unit of it: the head reached
    // y 54 and the torso started at 48, so the 42..56 quad was inside their
    // union and nothing showed. A 40-unit head ending at 42 leaves the
    // family's 6 visible units above the collar.
    neck(60, 38, 52, 7.5, 8.5, bodyColor, '#000'),

    // Hourglass torso: shoulders 44, waist 36, hips 42. v3 had a single
    // rounded rect, which is the shape that made the flip read as a box on a
    // box rather than a person doing a handstand.
    D(
      `M 38,60 C 38,52 44,48 50,48 L 70,48 C 76,48 82,52 82,60 L 78,72
       L 81,80 Q 81,84 77,84 L 43,84 Q 39,84 39,80 L 42,72 Z`,
      bodyColor,
      ink(3.2)
    ),
    P('70,50 82,60 78,72 81,82 71,82 71,50', '#000', { opacity: 0.16, nohalo: true }),
    P('60,56 50,68 70,68', accent, ink(2.4)),
    R(41, 70, 38, 6, 2, accent, ink(2)),
    C(60, 73, 3.2, bodyColor, ink(1.8)),

    plainLimb(legL, accent),
    sock(legL, 102),
    plainLimb(legR, accent),
    sock(legR, 104),
    villainShoe(43, 112, 13, 8),
    villainShoe(78, 114, 14, 8.5),

    villainArm(armL, bodyColor, accent, 9),
    villainArm(armR, bodyColor, accent, 9),

    // 48 wide against 40 tall. The height had to come down for the halo to
    // fit; widening keeps the head from reading as a small knob on a big body.
    D('M 36,10 C 36,2 84,2 84,10 L 84,32 C 84,39 74,42 60,42 C 46,42 36,39 36,32 Z', bodyColor, ink(3.2)),
    P('72,5 82,10 82,33 74,39 72,39', '#000', { opacity: 0.14, nohalo: true }),
  ]
  const backdrop = [E(63, 130, 24, 3.6, '#000', { opacity: 0.13 })]
  // Height is the whole problem with this figure and it is a HARD constraint,
  // not a style choice: upright, v4 ran y -2..124.5, and a 6-unit halo on both
  // ends makes 138.6 units of content for a 140-unit box — so the flipped head
  // spilled to y 145.4 with its chin sheared off. v5 buys the room back inside
  // the drawing instead of scaling the whole figure down (a scale wrapper cost
  // 12% of the display size and made this one visibly the runt of the nine):
  // a 40-unit head at y 2..42 instead of 56 units at y -2..54, and shins 4
  // units shorter. Upright is now y 2..119.5, so FLIP 131 lands the flipped
  // extent at y 5.4..139 with the halo counted.
  const body = [
    G('rotate(6 60 70)', [
      G(`translate(0,${FLIP}) scale(1,-1)`, upright),
      // mouthY is passed explicitly rather than left at its cy+16 default: the
      // default put the lip at y 125 on a head whose (flipped) chin edge is
      // y 129, so the mouth curve and both fangs hung outside the skull.
      villainFaceParts(60, FLIP - 25, { tilt: 1.1, mouthW: 9, mouthY: 118 }),
    ]),
  ]
  return sticker(backdrop, body)
}

// Gloop (plat-slime): melts the floor so nothing can stop. No legs — the lower
// body dissolves into a puddle with drips, one arm droops further than the
// other so the melt reads as ongoing rather than a static shape, and a flat
// highlight (never a gradient) stands in for shine. The puddle is `nohalo` and
// painted at the head of the body list rather than as a backdrop: haloed, the
// spill gets ringed in white and stops reading as liquid, but behind the halo
// it was half-erased by the blob's own white rim.
// v4 note: a blob has no bones, so the skeleton shows up here as the two
// things a blob CAN have — a pinched neck between head-bulge and belly, and
// arms that taper from a shoulder to a wrist with a hand on the end. v3's arms
// were constant-width noodles with no hand at all, which is why this one
// looked least like a character in the family.
export function platSlime({ bodyColor = '#4fb5c9', accent = '#1d6b78' } = {}) {
  const puddle = D(
    `M 12,120 C 27,114 35,124 50,118 C 66,112 76,122 91,116 C 104,111 110,118 110,122
     C 106,130 88,134 60,134 C 32,134 16,129 12,120 Z`,
    accent,
    { opacity: 0.65, stroke: LINE, 'stroke-width': 2.2, 'stroke-linejoin': 'round', nohalo: true }
  )
  // FOUR joints, not three. This is the one figure whose arm must not have a
  // visible corner: a blob with a hard elbow angle read as a CRAB CLAW. Two
  // shallow bends of ~14 degrees each, spread over the same drop, give the
  // droop a curve instead. Both arms also start outboard of the blob's own
  // outline (widest x 27 and x 90 around y 85), since they are painted after
  // the body now — rooted inside it, an arm is just a stub with a hand.
  // The blob is the one figure that must NOT get a visible joint. Two attempts
  // failed before this one: a three-point arm rooted just outside the outline
  // gave it a hard elbow corner and a flat shoulder cap, and the pair read as
  // CRAB CLAWS; pushing the roots outboard only made the claws bigger. What a
  // blob can have is the taper and the hand — so the arms run as four-point
  // shallow curves ROOTED DEEP INSIDE the belly (x 46 and x 74, well inboard of
  // the outline's x 26/x 92), painted before the body so the blob hides the
  // flat root cap, and each one clears the outline around y 88 with a good
  // 20 units of smooth tapering tube left to show.
  const armL = [
    { x: 44, y: 80, w: 9.5 },
    { x: 31, y: 88, w: 10 },
    { x: 24, y: 97, w: 8.5 },
    { x: 21, y: 106, w: 7 },
  ]
  // Shorter and set higher: one arm still melting further than the other is
  // what says the melt is ongoing rather than a finished shape.
  const armR = [
    { x: 76, y: 82, w: 9.5 },
    { x: 89, y: 90, w: 10 },
    { x: 95, y: 98, w: 8 },
  ]
  // No `limbCrease` here, unlike every other limb in the file: an elbow crease
  // on a liquid arm is a joint where there is no bone.
  const noodle = (pts) => {
    const [hx, hy] = wristSeat(pts, 6.5)
    return [
      P(limbOutline(pts), bodyColor, ink(3)),
      villainGlove(hx, hy, 8, accent, towardBody(pts, hx, hy)),
    ]
  }
  const body = [
    puddle,
    G('rotate(-5 60 100)', [
      noodle(armL),
      noodle(armR),

      // A pinched neck. The blob is one mass, so the pinch is the only neck it
      // can have — and it is what turns "a bag with a face" into a head on a
      // body at 132 px.
      D(
        `M 42,52 C 34,60 30,64 34,70 C 26,80 26,98 42,110
         C 50,118 70,118 78,109 C 92,98 92,80 85,70 C 89,64 85,60 78,52
         C 68,44 52,44 42,52 Z`,
        bodyColor,
        ink(3.2)
      ),
      // Density pass: a hard shade plane cut on the figure's own right edge,
      // surface bubbles, and a run of sag lines. Flat planes only.
      D('M 74,54 C 80,62 78,66 82,71 C 88,80 86,98 74,108 C 90,98 92,80 85,70 C 89,64 85,60 78,52 Z', '#000', {
        opacity: 0.16,
        nohalo: true,
      }),
      S('M 36,70 Q 44,76 60,76 Q 76,76 84,70', LINE, 1.7, { opacity: 0.4, nohalo: true }),
      D('M 40,100 C 50,110 70,110 80,100 C 82,110 68,120 58,120 C 46,120 38,109 40,100 Z', '#fff', {
        opacity: 0.24,
        nohalo: true,
      }),
      C(46, 56, 4.4, '#fff', { opacity: 0.4, stroke: LINE, 'stroke-width': 1.6, nohalo: true }),
      C(72, 98, 3.6, '#fff', { opacity: 0.34, stroke: LINE, 'stroke-width': 1.5, nohalo: true }),
      C(48, 94, 2.8, '#fff', { opacity: 0.3, stroke: LINE, 'stroke-width': 1.4, nohalo: true }),
      S('M 33,80 C 31,88 33,96 38,102', LINE, 1.7, { opacity: 0.45, nohalo: true }),
      S('M 86,82 C 87,90 85,96 82,101', LINE, 1.7, { opacity: 0.45, nohalo: true }),
      D('M 44,104 C 40,114 41,124 47,127 C 53,124 53,111 49,103 Z', bodyColor, ink(2.6)),
      D('M 67,106 C 64,114 66,122 71,124 C 76,121 75,112 72,105 Z', bodyColor, ink(2.6)),

      // cy pushed 60 -> 64, dx 12 -> 11 and tilt 1.2 -> 0.7. The brow sits at
      // cy - ey*(1.05 + 0.55*tilt) and spans px +- ex*1.5; at v4's numbers that
      // put it at y 48 reaching x 38, while the blob's crown is y 46 and its
      // outline at that height is x 42 — so both brows crossed the silhouette
      // and read as a pair of ANTENNAE rather than a scowl. Now y 54, brow top
      // 51.8 with its 4.4 stroke, inside the outline on all three sides.
      villainFaceParts(60, 64, { dx: 11, ex: 6.6, tilt: 0.7, mouthY: 89, mouthW: 12.5, fangs: 2 }),
    ]),
  ]
  return sticker([], body)
}

// Snatchy (plat-magnetjack): stole the spring hero's horseshoe magnet and
// wears it slung on its back with the poles swapped — S sits in the
// traditionally-red slot and N in the traditionally-blue one. The magnet's
// weight is what tips the whole figure off balance, and v4 leans into that: the
// arm on the magnet side reaches back and UP to hold the strap, the other hangs
// slack, so the tilt now has a cause a five-year-old can see.
export function platMagnetjack({ bodyColor = '#c9622f', accent = '#6b3013' } = {}) {
  const armL = [
    { x: 39, y: 66, w: 8.5 },
    { x: 29, y: 76, w: 7.2 },
    { x: 25, y: 87, w: 6 },
  ]
  const armR = [
    { x: 81, y: 64, w: 8.5 },
    { x: 90, y: 72, w: 7.2 },
    { x: 93, y: 82, w: 6 },
  ]
  const legL = [
    { x: 51, y: 86, w: 8.5 },
    { x: 46, y: 100, w: 7 },
    { x: 45, y: 113, w: 6.2 },
  ]
  const legR = [
    { x: 69, y: 86, w: 8.5 },
    { x: 75, y: 102, w: 7 },
    { x: 76, y: 115, w: 6.2 },
  ]
  const backdrop = [E(58, 132, 22, 4, '#000', { opacity: 0.13 })]
  const body = [
    G('rotate(-9 60 80)', [
      D(
        `M 78,44 C 78,31 87,22 98,22 C 109,22 114,31 114,42
         L 103,42 C 103,35 100,30 95,30 C 90,30 87,35 87,42 Z`,
        MAGNET_BLUE,
        ink(2.8)
      ),
      R(78, 42, 9, 16, 1.5, MAGNET_BLUE, ink(2.4)),
      R(103, 42, 11, 16, 1.5, MAGNET_RED, ink(2.4)),
      TEXT(82.5, 54, 10, '#fff', 'S'),
      TEXT(108.5, 54, 10, '#fff', 'N'),

      neck(60, 44, 58, 7, 8, bodyColor, '#000'),

      // Shoulders 42, waist 34, hips 40 — the same hourglass as the heroes at
      // villain scale, so the two silhouettes belong to one world.
      D(
        `M 39,66 C 39,59 45,55 51,55 L 69,55 C 75,55 81,59 81,66 L 77,78
         L 80,84 Q 80,88 76,88 L 44,88 Q 40,88 40,84 L 43,78 Z`,
        bodyColor,
        ink(3.2)
      ),
      P('69,57 81,66 77,78 80,86 70,86 70,57', '#000', { opacity: 0.16, nohalo: true }),
      // Density pass: a plate riveted over the chest and a strap for the
      // magnet, so the flank is not one bare colour field.
      R(47, 68, 26, 13, 2.5, accent, ink(2.2)),
      C(51, 72, 1.7, bodyColor, { nohalo: true }),
      C(69, 72, 1.7, bodyColor, { nohalo: true }),
      C(51, 77, 1.7, bodyColor, { nohalo: true }),
      C(69, 77, 1.7, bodyColor, { nohalo: true }),
      R(42, 81, 36, 5.5, 1.5, accent, { stroke: LINE, 'stroke-width': 1.6, nohalo: true }),
      S('M 46,62 L 80,54', accent, 4.4, { nohalo: true }),

      plainLimb(legL, accent),
      plainLimb(legR, accent),
      villainShoe(43, 118, 13, 8),
      villainShoe(78, 120, 14, 8.5),

      villainArm(armL, bodyColor, accent, 9),
      villainArm(armR, bodyColor, accent, 9),

      // v5 shortened the head from 40 units to 40x40 and moved the whole
      // assembly down 5. Two v4 faults at once: the antenna stalk started at
      // y 3, so its halo (stroke 2 + 9, half 5.5) reached y -2.1 and the knob
      // was shaved flat against the frame; and the head's chin at y 53 sat
      // 2 units above the collar at 55, which is not a neck, it is a seam.
      // Chin 50 against collar 55 gives this one the family's 5 visible units.
      D('M 40,18 C 40,10 80,10 80,18 L 80,38 C 80,47 72,50 60,50 C 48,50 40,47 40,38 Z', bodyColor, ink(3.2)),
      R(58, 10, 4, 9, 1.5, accent, ink(2)),
      C(60, 14, 4, accent, ink(2.2)),
      villainFaceParts(60, 30, { tilt: 1, mouthY: 40 }),
    ]),
  ]
  return sticker(backdrop, body)
}

// Blocko (plat-brick): plugs the tunnels shut. The torso is a cork stopper —
// wide at the shoulders, tapering to a narrow foot, so the body silhouette
// itself reads as a plug — with a plank patch for a hole it has already sealed
// and a brick in each hand, one arm loaded with a heavier stack than the other
// for the villain tilt. This is the one figure in the family whose hips are
// deliberately NARROWER than its shoulders: that inversion is the plug.
export function platBrick({ bodyColor = '#a8763a', accent = '#5c3d18' } = {}) {
  const brick = (x, y, w, h) => [
    R(x, y, w, h, 1.5, '#b34a30', ink(2.4)),
    S(`M ${x + 1},${y + h * 0.52} L ${x + w - 1},${y + h * 0.52}`, LINE, 1.8, { opacity: 0.7, nohalo: true }),
    S(`M ${x + w * 0.5},${y + 1} L ${x + w * 0.5},${y + h * 0.5}`, LINE, 1.8, { opacity: 0.7, nohalo: true }),
    S(`M ${x + w * 0.26},${y + h * 0.56} L ${x + w * 0.26},${y + h - 1}`, LINE, 1.8, { opacity: 0.7, nohalo: true }),
    S(`M ${x + w * 0.74},${y + h * 0.56} L ${x + w * 0.74},${y + h - 1}`, LINE, 1.8, { opacity: 0.7, nohalo: true }),
  ]
  const armL = [
    { x: 33, y: 66, w: 8 },
    { x: 25, y: 74, w: 6.8 },
    { x: 22, y: 83, w: 5.8 },
  ]
  const armR = [
    { x: 87, y: 66, w: 8 },
    { x: 95, y: 74, w: 6.8 },
    { x: 97, y: 83, w: 5.8 },
  ]
  const legL = [
    { x: 51, y: 90, w: 8 },
    { x: 47, y: 104, w: 6.6 },
    { x: 46, y: 115, w: 5.8 },
  ]
  const legR = [
    { x: 69, y: 90, w: 8 },
    { x: 74, y: 106, w: 6.6 },
    { x: 75, y: 117, w: 5.8 },
  ]
  const backdrop = [E(58, 134, 24, 4.2, '#000', { opacity: 0.13 })]
  // v5 pulled the whole stack up 4 units and the brick piles 7 units inboard.
  // v4 ran from the head knob's halo at y -0.9 to the right shoe's halo at
  // y 142.1 and the left brick's at x -1.4 — three edges off the frame at once,
  // because a 6-unit halo on a figure this tall has nowhere to go.
  const body = [
    G('rotate(6 60 90)', [
      neck(60, 44, 58, 8, 9, bodyColor, '#000'),

      D('M 32,64 C 32,58 40,56 48,56 L 72,56 C 80,56 88,58 88,64 L 78,94 L 42,94 Z', bodyColor, ink(3.2)),
      P('72,57 88,64 78,94 72,94 71,57', '#000', { opacity: 0.15, nohalo: true }),
      P('35,68 85,68 83,74 37,74', accent, { stroke: LINE, 'stroke-width': 1.6, nohalo: true }),
      P('41,82 79,82 77,88 43,88', accent, { stroke: LINE, 'stroke-width': 1.6, nohalo: true }),

      R(47, 74, 16, 14, 2, accent, ink(2.4)),
      S('M 49,80 L 61,76 M 49,85 L 61,81', bodyColor, 2.6, { nohalo: true }),

      plainLimb(legL, accent, 2.4),
      plainLimb(legR, accent, 2.4),
      villainShoe(44, 120, 12, 7),
      villainShoe(77, 122, 12, 7),

      // Arms AFTER the torso, like the other eight. v4 painted them first and
      // the torso then covered every deltoid, so this figure alone still had
      // v3's bars-bolted-to-the-flank shoulders. The bricks stay after the arms
      // so the hands read as holding them.
      villainArm(armL, bodyColor, accent, 8),
      brick(11, 91, 24, 14),
      brick(16, 108, 20, 12),

      villainArm(armR, bodyColor, accent, 8),
      brick(86, 91, 23, 14),

      // Chin at 52 against a collar at 56. v4's chin was 59 — BELOW the collar
      // — so the neck quad it drew was covered on both ends and this figure had
      // no visible neck at all, the same fault platFlip had.
      D('M 36,21 C 36,12 84,12 84,21 L 84,40 C 84,48 74,52 60,52 C 46,52 36,48 36,40 Z', bodyColor, ink(3.2)),
      C(60, 15, 4.6, accent, ink(2.2)),
      villainFaceParts(60, 30, { dx: 11.5, ex: 6.6, tilt: 0.9, mouthY: 41, mouthW: 11 }),
    ]),
  ]
  return sticker(backdrop, body)
}

// Bug King (plat-glitch), the chapter boss: deliberately the biggest and
// heaviest figure in the family. Its jaw is a dark void wide enough to pull a
// checkerboard block halfway in, and it is shedding itself along one flank —
// small squares at scattered sizes and opacities, never more than two in a
// row, so the erosion cannot settle into a straight edge or corner that would
// read as a letterform. The debris squares are backdrop parts: haloed, they
// would turn into a row of white-framed tiles and stop reading as decay.
export function platGlitch({ bodyColor = '#3d3d46', accent = '#7d5fe0' } = {}) {
  const bit = (x, y, s, fill, op) => R(x, y, s, s, 0, fill, { opacity: op })
  const horn = (points) => P(points, accent, ink(2.6))
  const armL = [
    { x: 31, y: 74, w: 11 },
    { x: 23, y: 85, w: 9.2 },
    { x: 21, y: 95, w: 7.6 },
  ]
  // Wrist pulled in 3 units: at x 100 the r=11 glove's halo reached x 121.3,
  // i.e. off the right edge of the viewBox entirely.
  const armR = [
    { x: 89, y: 72, w: 11 },
    { x: 96, y: 83, w: 9.2 },
    { x: 97, y: 93, w: 7.6 },
  ]
  // Hips lifted 102 -> 96 against a torso that now ends at 100. v4's torso ran
  // to y 106 over legs starting at 102, so four units of thigh showed above the
  // shoe and the boss read as a head-and-belly with no legs at all.
  const legL = [
    { x: 52, y: 90, w: 11 },
    { x: 47, y: 105, w: 9 },
    { x: 44, y: 117, w: 8 },
  ]
  const legR = [
    { x: 68, y: 90, w: 11 },
    { x: 74, y: 107, w: 9 },
    { x: 77, y: 119, w: 8 },
  ]
  const backdrop = [
    E(60, 133, 44, 4.6, '#000', { opacity: 0.17 }),
    bit(7, 74, 6, accent, 0.5),
    bit(16, 92, 4, bodyColor, 0.6),
    bit(6, 100, 5, accent, 0.7),
    bit(21, 110, 7, bodyColor, 0.5),
    bit(96, 40, 5, accent, 0.55),
    bit(105, 56, 4, bodyColor, 0.7),
    bit(100, 100, 6, accent, 0.4),
    bit(89, 118, 4, bodyColor, 0.65),
  ]
  const body = [
    G('rotate(-4 60 78)', [
      neck(58, 52, 66, 10, 11, bodyColor, '#000'),

      plainLimb(legL, accent, 2.8),
      plainLimb(legR, accent, 2.8),
      villainShoe(41, 121, 14, 8.5),
      villainShoe(80, 123, 14, 8.5),

      D(
        `M 29,74 C 29,66 38,63 48,63 L 72,63 C 82,63 91,66 91,74
         L 89,87 Q 89,92 83,92 L 37,92 Q 31,92 31,87 Z`,
        bodyColor,
        ink(3.4)
      ),

      // The void in the belly IS this one's mouth — so the head carries eyes
      // and brows only. Giving the head its own mouth as well produced a
      // figure with two mouths and neither read.
      // Lifted with the shortened torso: the maw's own ink is haloed, so at
      // v4's y 101 against a torso ending at 100 it left a white rim hanging
      // below the belly outline.
      E(58, 77, 23, 13, SOLE, ink(3)),
      R(46, 65, 12, 12, 0, bodyColor, { nohalo: true }),
      R(58, 65, 12, 12, 0, accent, { nohalo: true }),
      R(46, 77, 12, 12, 0, accent, { nohalo: true }),
      R(58, 77, 12, 12, 0, bodyColor, { nohalo: true }),
      R(46, 65, 24, 24, 0, 'none', { stroke: LINE, 'stroke-width': 2.4, nohalo: true }),
      // Fangs at the maw's rim, as triangles rather than the chevron strokes a
      // first pass used — a '<' next to a '>' is exactly the accidental glyph
      // this app has been bitten by before.
      P('39,70 45,70 42,78', '#fff', { nohalo: true }),
      P('71,70 77,70 74,78', '#fff', { nohalo: true }),

      villainArm(armL, bodyColor, accent, 11),
      villainArm(armR, bodyColor, accent, 11),

      // v4's left horn had its tip at x 23 against a head whose left edge is
      // x 28 — it was drawn INSIDE the skull and read as nothing at all, while
      // the right one read as a triangle. Now both break the silhouette by the
      // same 12 units and both tips sit at y 13, level with the shortened
      // crown, which is what makes them horns rather than ears.
      horn('38,18 15,9 33,27'),
      horn('74,18 97,12 79,27'),
      D('M 28,20 C 28,10 84,10 84,20 L 84,44 C 84,54 73,58 56,58 C 39,58 28,54 28,44 Z', bodyColor, ink(3.4)),
      villainFaceParts(56, 32, { dx: 13, ex: 7.2, tilt: 1.3, mouth: false }),
    ]),
  ]
  return sticker(backdrop, body)
}
