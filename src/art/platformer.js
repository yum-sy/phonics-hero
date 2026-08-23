// Platformer-family character art — chapter 5, the jump-platformer genre slot
// in the world order.
//
// REVISION NOTE (v10): LEGO CONVERSION FIXES. v9's approach (below) was
// approved, but the first render shipped three faults, all user-caught:
// "마리오는 관절을 표현하는 회색 원이 너무 도드라진다는게 가장 큰 문제야.
// 마리오들 중에서 두번째 마리오는 몸이랑 목이 구분도 안되고. 모든 마리오의
// 손이 머리보다 뒤에 있는 걸로 그려서 가려지는 것도 문제야." Three
// independent fixes, heroes only (villains untouched, confirmed by diff):
//  1. JOINT DISCS. `pegDisc` dropped its highlight dot (measured as the
//     single brightest mark on the whole sticker, brighter than the eye's
//     own highlight) and shrank at every call site (shoulder 0.58->0.4 of
//     limb width, hip 8->5.6, knee 7->5, boss hip/knee 9/8->6.3/5.6), plus
//     thinner strokes (2.2/1.3 -> 1.4/0.9). Six to eight of these sit on
//     every figure; shrinking one without the others left the family
//     lopsided, so all three changes shipped together.
//  2. OLLIE'S NECK. `platSpring`'s first coil turn (cy 64, ry 8, top edge
//     y 56) painted over the entire neck quad (y 58..68) because it started
//     above the neck's own top -- geometry, not colour, so no seam could
//     have fixed it. Moved the whole coil stack down and shrunk it (turns
//     72/80/88 at ry 6/6.5/6, first top edge now y 66) so ~8 units of skin
//     survive below the chin, matching what the other three heroes' shirt
//     collar already shows. The pants box shifted down to meet the new
//     stack bottom; its own height is unchanged.
//  3. HANDS BEHIND HEADS. Every hero built its whole arm (tube + peg + fist)
//     before `legoHead`, so a raised fist at head height painted UNDER the
//     cap/brim -- `platJumper`'s punching arm (wrist next to the brim) and
//     both of `platPowerup`'s (wrist inside the head's hairTuft zone) were
//     visibly clipped by it. Split `legoArm` into `legoArmBase` (tube +
//     shoulder peg, stays before the head) and `legoArmFist` (moves to
//     after it) for all four heroes -- Umo's arms never reached head height
//     so this is a no-visual-change consistency fix for that one. The
//     boss's fireballs moved with their fists (fireball-after-fist order
//     preserved) so the "held in the hand" read survives.
// All three verified by rendering, not just by the arithmetic: this file's
// own `_plat9.html` scratch harness (padded-viewBox alpha scan, the
// project's clip authority) reports all five hero variants (including the
// AI-digraph emblem case) inside the frame with no change to that harness.
//
// REVISION NOTE (v9): LEGO CONVERSION. User decision, final, not a
// prototype: "지금 마이로는 너무 조잡해 보인다. 레고 마리오 이미지를 참고해."
// v6-v8 spent three rounds getting a HUMAN skeleton right (joints, leg
// ratio, mass) and the user's complaint survived all of it — the genre
// itself was wrong, not the proportions inside it. v9 replaces the heroes
// with the LEGO Super Mario interactive-figure grammar: a head block near
// parity with the shoulder width instead of a third of it, a separate cap
// MODULE (dome + brim + a peek of hair) instead of a hat painted onto a
// human head, mitten fists instead of five-fingered gloves, and — the
// point of the whole exercise — VISIBLE PEG JOINTS at the shoulder, hip and
// knee instead of an inked crease standing in for a bend.
//
// SCOPE: heroes only (platJumper, platSpring, platBlock, platPowerup). The
// villains are explicitly out of scope for this round (lower priority, "나중에
// 돌려쓴다") and every low-level primitive they call — deltoid, neck,
// limbCrease, limbOutline, limbBand, wristSeat, towardBody, villainArm,
// villainGlove, villainShoe, plainLimb, villainFaceParts — is UNCHANGED.
// None of v9's new code touches those names; it adds a parallel set (box,
// tube, pegDisc, legoFist, legoLeg, legoBoot, legoHead/legoCap/legoFace) and
// deletes the hero-only v3-v8 primitives nothing else referenced (heroArm,
// heroGlove, heroBoot, denimLimb, cap, face, heroHead, bibPanel, pocket,
// strapPiece, heroShirt) — confirmed by grep before deletion that villains
// never called them.
//
// THREE DECISIVE DIFFERENCES FROM v8's human skeleton:
//  1. HEAD:BODY RATIO. v8 head 34 wide against 46-64 shoulders (0.53-0.74x).
//     v9 head 58 wide against a 54-wide shoulder block (1.07x) — the head is
//     now the widest mass on the figure, which is the single biggest read
//     in every reference image and the thing three rounds of joint-fixing
//     never touched.
//  2. THE CAP IS A MODULE, NOT A HAT PAINTED ON A HEAD. v8's `cap()` was a
//     dome-plus-brim glued to the top of a face that had no room left for a
//     brow (the brim doubled as one). v9's head block is tall enough that
//     the cap sits on top of it with a full face visible underneath — brow,
//     eyes, nose, mouth — and two tufts of hair break the cap's silhouette
//     at the temples, which is the detail every reference image has and no
//     prior version of this file ever drew.
//  3. PEG JOINTS ARE GEOMETRY THE FIGURE IS PROUD OF, NOT A CREASE HIDING A
//     BEND. `pegDisc` paints a distinct grey-plastic disc (ring + inset +
//     highlight) OVER the limb at the shoulder, hip and knee — the exact
//     three joints the reference images show as moulded pin caps. v4-v8
//     spent real effort making an elbow crease read as a joint at 132 px;
//     v9 does not need the trick because the joint is now its own drawn
//     object, not an inference from shading.
//
// WHAT DID NOT SURVIVE THE CONVERSION, on purpose: the jointed elbow-taper
// limb (`limbOutline`/`limbBand` on a 3-point polyline) is gone from the
// heroes, replaced by `tube()` — one or two straight trapezoid segments.
// LEGO limbs do not taper toward the wrist the way a human forearm does;
// keeping the taper would have fought the module read the whole conversion
// is for. The five-fingered `heroGlove` (thumb + two palm seams) is gone
// too, replaced by `legoFist` (block knuckles, no thumb seam) — a LEGO hand
// is a fist, not an anatomical glove, and the reference images agree.
//
// EMBLEM PLATE, UNCHANGED: `emblemPlate`/`plateType`/`PLATE_PAD` and
// `bigButton` survive the conversion untouched and are reused as-is — both
// were already generic rectangles/circles with no v8-specific geometry
// baked in, so the phonics letter's hard-won sizing math (star vs one-glyph
// vs two-glyph, corner-bite refinement) did not need to be re-derived. The
// plate stays on the BIB, not the cap: the instruction explicitly warns off
// putting a circular logo badge or a letter on the cap front (too close to
// the source's own cap emblem), and the curriculum letter has to be legible
// content regardless, which the chest already does well.
//
// ===========================================================================
// OLDER REVISION HISTORY (v2-v8) — describes the HUMAN skeleton the heroes
// used before this conversion. Kept for the villains, who still use it in
// full: deltoid, neck, limbCrease and the jointed-polyline limb system below
// are exactly what v4-v8 describe, and every villain in this file still
// calls them. Do not re-derive their numbers; they are validated.
// ===========================================================================
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
const MOUTH = '#5e1c2c'

// Dungarees. Fixed rather than palette-driven on purpose — see casting rule 2.
const DENIM = '#2a55c4'
const DENIM_LIT = '#5580e8'
const DENIM_DEEP = '#152a63'
const STITCH = '#ffd75e'
const BUTTON = '#ffcf3a'
const BUTTON_SHADE = '#b8801a'

// The dungaree cloth is a TONE SET rather than four loose constants because
// the boss wears the same garment in a different colourway (see FIRE_TONE).
// Threading a default-valued tone through denimLimb/bibPanel/strapPiece is
// what keeps the other eight figures byte-identical: they never pass one.
const DENIM_TONE = { base: DENIM, lit: DENIM_LIT, deep: DENIM_DEEP, stitch: STITCH }

// FIRE POWERUP WARDROBE (the boss only).
//
// The reference is the fire-flower powerup: the everyday red-cap/blue-dungaree
// mario with BOTH halves swapped — white cap, white shirt, red dungarees — and
// a fireball in the hand. That inversion is the whole reason this figure can be
// "the special combined one" without growing: the previous round bought bigness
// with MASS (head 38->42, shoulders 56->64) and the round before that spent the
// entire torso budget on human leg proportion, so there is nothing left to
// inflate. A colourway swap costs zero units of silhouette.
//
// Fixed, not palette-driven, for the same reason DENIM is: these are the
// reference's colours, not a slot. `bodyColor` is therefore accepted and
// ignored — see the note on platPowerup's signature.
//
// The whites are the risk, not the reds. Four near-whites meet on this figure
// (shirt, glove #f7f0e0, plate #fff3c4, halo #fffefb) and the app's own
// --surface is #fffdf4, so on a chapter card the figure's largest area sits on
// a background it cannot out-contrast: shirt/surface is 1.05:1 at BEST. What
// carries every one of those boundaries is LINE (#221a2c), which is 15.7:1
// against this white — so the whites are chosen for the two things a ratio
// cannot buy: a COOL white against warm cream neighbours (hue separation the
// luminance ratio does not see), and the largest surface-vs-glove compromise.
// #f8f8f2 measures 1.046 on --surface and 1.065 on the glove; pure #ffffff is
// 1.019/1.135 and every warmer option trades the background away faster than
// it gains on the glove.
const FIRE_WHITE = '#f8f8f2'
// The brim is a cool grey-white rather than the dome's white so dome-and-brim
// do not depend solely on the brim's 30 % black underside to separate.
const FIRE_BRIM = '#e9e9df'
const FIRE_RED = '#d92b23'
const FIRE_RED_LIT = '#ff8375'
const FIRE_RED_DEEP = '#7d130f'
const FIRE_TONE = { base: FIRE_RED, lit: FIRE_RED_LIT, deep: FIRE_RED_DEEP, stitch: STITCH }
// Star on the white cap. The reference's cap mark is RED on white, the exact
// inverse of the everyday cap — so the mark cannot stay gold: gold on this
// white is 1.7:1 and would hang on its outline alone. #c9231d is 5.27:1.
const FIRE_MARK = '#c9231d'
// Flame layers, light to dark from the core out. Flat nested fills, no
// gradient: SVG gradients are banned in this family.
const FLAME_OUT = '#e8400c'
const FLAME_MID = '#ffa81c'
const FLAME_CORE = '#fff2a0'
const LEAF = '#3fa03a'
const LEAF_DEEP = '#1f6b23'

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

// ---------------------------------------------------------------------------
// LEGO HERO PRIMITIVES (v9). See the v9 revision note above. Nothing in this
// section is called by any villain — grep confirmed before each v3-v8 hero
// primitive below was deleted.
// ---------------------------------------------------------------------------

// A grey-plastic joint disc: ring plus a soft inset, no separate highlight
// dot. Painted AFTER the limb parts it sits on, at the shoulder, hip and
// knee — the three joints the reference images show as a moulded pin cap,
// not an inked crease standing in for one.
//
// v9's first draft stacked THREE layers (ring + inset + a 0.55-opacity
// white highlight) at a radius spanning most of the limb's own width, and
// six to eight of those landed on every figure — shoulders, hips, knees.
// User feedback: "관절을 표현하는 회색 원이 너무 도드라진다." Measured on a
// render, that highlight dot was the single brightest, most saturated-white
// mark on the whole sticker (brighter than the eye's own highlight), which
// is why the joints read before the character did. Fixed on three axes
// together, none sufficient alone: every call site below now passes a
// smaller `r` (a fraction of the limb width instead of ~all of it), the
// highlight dot is gone outright, and both strokes are thinner (2.2/1.3 ->
// 1.4/0.9) so the disc reads as a moulded seam in the plastic rather than an
// outlined target sitting on top of the limb.
const PEG = '#cdc6b4'
const PEG_DEEP = '#a89a7c'
function pegDisc(cx, cy, r) {
  return [
    C(cx, cy, r, PEG, { stroke: LINE, 'stroke-width': 1.4, 'stroke-linejoin': 'round' }),
    C(cx, cy, r * 0.55, PEG_DEEP, { stroke: LINE, 'stroke-width': 0.9, opacity: 0.8, nohalo: true }),
  ]
}

// A rounded box with independently-flat top/bottom edges (`flat` containing
// 't' and/or 'b'). LEGO masses are boxes with a small radius, not the
// tapered/curved masses the human skeleton used — a big radius on a 58-unit
// head would turn it back into the pill v4 already fought free of.
function box(x0, y0, x1, y1, r, fill, extra, flat = '') {
  const rt = flat.includes('t') ? 0 : r
  const rb = flat.includes('b') ? 0 : r
  return D(
    `M ${x0 + rt},${y0} L ${x1 - rt},${y0} Q ${x1},${y0} ${x1},${y0 + rt}
     L ${x1},${y1 - rb} Q ${x1},${y1} ${x1 - rb},${y1}
     L ${x0 + rb},${y1} Q ${x0},${y1} ${x0},${y1 - rb}
     L ${x0},${y0 + rt} Q ${x0},${y0} ${x0 + rt},${y0} Z`,
    fill,
    extra
  )
}

// A straight tapered trapezoid between two joint points. LEGO limbs are
// moulded tubes with at most one bend, not a human forearm's continuous
// taper — this replaces `limbOutline`/`limbBand` for the heroes only; the
// villains keep the polyline system untouched.
function tube(x0, y0, w0, x1, y1, w1, fill, extra) {
  const a = Math.atan2(y1 - y0, x1 - x0)
  const nx = -Math.sin(a)
  const ny = Math.cos(a)
  const pts = [
    [x0 + (nx * w0) / 2, y0 + (ny * w0) / 2],
    [x1 + (nx * w1) / 2, y1 + (ny * w1) / 2],
    [x1 - (nx * w1) / 2, y1 - (ny * w1) / 2],
    [x0 - (nx * w0) / 2, y0 - (ny * w0) / 2],
  ]
  return P(pts.map((p) => `${p[0].toFixed(2)},${p[1].toFixed(2)}`).join(' '), fill, extra)
}

// A mitten fist: block knuckles plus a thumb bump plus two knuckle creases,
// no thumb seam. A round lobe with a seam is a GLOVE; a block with a bump is
// a FIST, which is what every reference image is holding up. `deg` points the
// fist away from the body so the cuff band lands on the wrist side.
function legoFist(cx, cy, r, deg, cuffColor) {
  return G(`translate(${cx.toFixed(2)},${cy.toFixed(2)}) rotate(${deg.toFixed(1)})`, [
    R(-r * 1.05, -r * 0.9, r * 0.5, r * 1.82, r * 0.24, cuffColor, {
      stroke: LINE,
      'stroke-width': 2.2,
      nohalo: true,
    }),
    box(-r * 0.62, -r * 0.94, r * 0.86, r * 0.94, r * 0.42, GLOVE, ink(3)),
    C(r * 0.52, r * 0.32, r * 0.4, GLOVE, ink(2.4)),
    S(
      `M ${(r * 0.18).toFixed(1)},${(-r * 0.6).toFixed(1)} L ${(r * 0.18).toFixed(1)},${(-r * 0.02).toFixed(1)}
       M ${(-r * 0.28).toFixed(1)},${(-r * 0.6).toFixed(1)} L ${(-r * 0.28).toFixed(1)},${(-r * 0.02).toFixed(1)}`,
      LINE,
      1.5,
      { opacity: 0.4, nohalo: true }
    ),
    E(-r * 0.05, -r * 0.6, r * 0.36, r * 0.13, '#fff', { opacity: 0.55, nohalo: true }),
    E(-r * 0.05, r * 0.68, r * 0.4, r * 0.13, GLOVE_SHADE, { opacity: 0.5, nohalo: true }),
  ])
}

// A dungaree leg segment: a denim box with a lit stripe and a dashed
// topstitch hem — the box replaces the tapered `denimLimb` polyline, and a
// `pegDisc` at the knee (drawn by the caller, between two `legoLeg` calls) is
// what used to be `limbCrease`.
function legoLeg(x0, x1, top, bot, t = DENIM_TONE) {
  return [
    box(x0, top, x1, bot, 3.6, t.base, ink(3.2)),
    R(x0 + 1.4, top + 1.4, (x1 - x0) * 0.36, bot - top - 2.8, 2.6, t.lit, { opacity: 0.5, nohalo: true }),
    S(`M ${x0 + 2},${bot - 5} L ${x1 - 2},${bot - 5}`, t.stitch, 1.6, {
      'stroke-dasharray': '4,3',
      opacity: 0.85,
      nohalo: true,
    }),
  ]
}

// A chunky boot box, flat on top (it swallows the shin's end) and rounded at
// the toe and heel, with a flat sole slab.
function legoBoot(x0, x1, top, bot, color = SHOE) {
  return [
    box(x0, top, x1, bot, 4.6, color, ink(3.2), 't'),
    R(x0, bot - (bot - top) * 0.32, x1 - x0, (bot - top) * 0.32, 0, SOLE, { nohalo: true }),
    S(`M ${x0 + 2.4},${top + 3} L ${x1 - 2.4},${top + 3}`, '#fff', 1.7, { opacity: 0.28, nohalo: true }),
  ]
}

// A tuft of hair, authored pointing down-and-outward from `(x,y)`. Two of
// these sit at the temples, just below the brim's outer ends, where the
// reference images show hair breaking the cap's silhouette; drawing them
// BEFORE the head box and cap means only the part that pokes past those two
// masses survives — a true "peeking out" rather than a hand-placed sliver.
const HAIR = '#3a2417'
const HAIR_LIT = '#5c3d26'
function hairTuft(x, y, k) {
  return [
    D(
      `M ${x},${y} Q ${x + k * 7},${y - 1.5} ${x + k * 9},${y + 6.5}
       Q ${x + k * 4.5},${y + 10} ${x - k * 1},${y + 5.5} Z`,
      HAIR,
      ink(2.2)
    ),
    S(`M ${x + k * 1},${y + 1.5} Q ${x + k * 5},${y + 3} ${x + k * 5.5},${y + 7}`, HAIR_LIT, 1.4, {
      opacity: 0.7,
      nohalo: true,
    }),
  ]
}

// LEGO face. Big tall-oval eyes (a straight-edged lid stands in for the lash
// line, not the old cap-brim-as-brow trick — this head has room for a real
// brow above it), a heavy separate eyebrow, blushed cheeks, a big round nose,
// and an open smile with a teeth strip. `s` scales every offset from one
// number so the boss's bigger head needs no re-tuning.
function legoFace(cx, g, s = 1) {
  const dx = 15 * s
  const ex = 6.6 * s
  const ey = 8.6 * s
  const eyeCy = g.eyeCy
  const nr = 6.4 * s
  const noseCy = g.noseCy
  const my = g.mouthY
  const mw = 8.6 * s
  const eye = (px, k) => [
    E(px, eyeCy, ex, ey, '#fff', ink(2.2 * s)),
    C(px + k * ex * 0.1, eyeCy + ey * 0.18, ex * 0.62, LINE, { nohalo: true }),
    C(px + k * ex * 0.1 - ex * 0.28, eyeCy - ey * 0.14, ex * 0.24, '#fff', { nohalo: true }),
    // A straight-edged lid clipped to the sclera's own top third — a curved
    // rim wedge here (the v3-v8 hero eye) reads as a thin spectacle frame at
    // this much larger size, not a lid.
    D(
      `M ${px - ex},${eyeCy - ey * 0.5} L ${px + ex},${eyeCy - ey * 0.5}
       L ${px + ex * 0.86},${eyeCy - ey * 0.98} Q ${px},${eyeCy - ey * 1.18} ${px - ex * 0.86},${eyeCy - ey * 0.98} Z`,
      LINE,
      { nohalo: true }
    ),
    // The brow itself, sitting clear ABOVE the lid with a visible strip of
    // skin between the two — the thing v3-v8's heroes could never have
    // because the brim occupied this exact band. First-draft offsets (1.32/
    // 1.62/1.3) put the brow's own stroke width touching the lid's peak
    // (measured gap ~0.1 units, read as one merged blob); these clear it by
    // about 1.9 units.
    S(
      `M ${px - ex * 1.05},${eyeCy - ey * 1.38} Q ${px},${eyeCy - ey * 1.7} ${px + ex * 1.05},${eyeCy - ey * 1.36}`,
      LINE,
      2.6 * s,
      { nohalo: true }
    ),
  ]
  return [
    E(cx - dx * 1.55, eyeCy + ey * 0.85, 5 * s, 3.2 * s, CHEEK, { opacity: 0.55, nohalo: true }),
    E(cx + dx * 1.55, eyeCy + ey * 0.85, 5 * s, 3.2 * s, CHEEK, { opacity: 0.55, nohalo: true }),
    eye(cx - dx, 1),
    eye(cx + dx, -1),
    D(
      `M ${cx - mw},${my} Q ${cx},${my + 2.6 * s} ${cx + mw},${my} Q ${cx},${my + 8.4 * s} ${cx - mw},${my} Z`,
      MOUTH,
      ink(2.2 * s)
    ),
    D(
      `M ${cx - mw * 0.78},${my + 0.6 * s} Q ${cx},${my + 2.6 * s} ${cx + mw * 0.78},${my + 0.6 * s}
       Q ${cx},${my + 4.2 * s} ${cx - mw * 0.78},${my + 0.6 * s} Z`,
      '#fff',
      { nohalo: true }
    ),
    S(
      `M ${cx - mw},${my} L ${cx - mw - 2.2 * s},${my - 2.4 * s} M ${cx + mw},${my} L ${cx + mw + 2.2 * s},${my - 2.4 * s}`,
      LINE,
      2.4 * s,
      { nohalo: true }
    ),
    C(cx, noseCy, nr, NOSE, ink(2.6 * s)),
    E(cx, noseCy + nr * 0.44, nr * 0.7, nr * 0.4, NOSE_SHADE, { opacity: 0.65, nohalo: true }),
    C(cx - nr * 0.32, noseCy - nr * 0.36, nr * 0.28, '#fff', { opacity: 0.8, nohalo: true }),
  ]
}

// The cap MODULE: a flat-bottomed dome sitting on the head block, a wide flat
// brim (a slab, not the v3-v8 pointed lens — a pointed peak this wide reads
// as a bird's beak) with a dark underside and a light top band, and a small
// plain accent disc at the front. The disc carries NO letter and NO ring —
// deliberately, per the instruction not to reproduce a circular logo badge on
// the cap; the phonics letter lives on the chest plate, unchanged from v3-v8.
function legoCap(cx, g, headHalf, brimHalf, domeColor, brimColor, discColor) {
  const bx0 = cx - brimHalf
  const bx1 = cx + brimHalf
  const by0 = g.brimY
  const by1 = g.brimY + g.brimH
  return [
    box(cx - headHalf - 2, g.capTop, cx + headHalf + 2, g.domeBot, 10, domeColor, ink(3.2), 'b'),
    R(cx - headHalf + 2, g.capTop + 3, (headHalf + 2) * 2 - 4, 6, 4, '#fff', { opacity: 0.2, nohalo: true }),
    R(cx + headHalf - 7, g.capTop + 4, 9, g.domeBot - g.capTop - 4, 4, '#000', { opacity: 0.14, nohalo: true }),
    box(bx0, by0, bx1, by1, 4.6, brimColor, ink(3)),
    R(bx0 + 1, by0 + g.brimH * 0.58, bx1 - bx0 - 2, g.brimH * 0.38, 2, '#000', { opacity: 0.32, nohalo: true }),
    R(bx0 + 4, by0 + 1.5, (bx1 - bx0) * 0.4, 2.4, 1.4, '#fff', { opacity: 0.26, nohalo: true }),
    discColor ? C(cx, by0 - 3.5, 6.6, discColor, ink(2.2)) : null,
    discColor
      ? S(`M ${cx - 3.6},${by0 - 6.4} A 4.6,4.6 0 0 1 ${cx + 0.8},${by0 - 10.4}`, '#fff', 1.5, {
          opacity: 0.7,
          nohalo: true,
        })
      : null,
  ]
}

// The full head assembly: hair (drawn first so the head/cap cover its inner
// mass), the head block, the cap module, then the face. Shared by the three
// standing heroes; the boss calls it with a scaled-up `g`/`headHalf`.
function legoHead(g, headHalf, brimHalf, bodyColor, accent, discColor, s = 1) {
  const cx = 60
  return [
    // Positioned OUTSIDE both the head box (x < cx-headHalf) and below the
    // brim (y > brimY+brimH) — the first-draft position sat inside the
    // brim's own box and was painted over completely; measured on a render,
    // zero hair pixels survived. This position is confirmed visible.
    hairTuft(cx - headHalf - 3, g.brimY + g.brimH + 2, -1),
    hairTuft(cx + headHalf + 3, g.brimY + g.brimH + 2, 1),
    box(cx - headHalf, g.faceTop, cx + headHalf, g.chin, 9, SKIN, ink(3.4)),
    R(cx + headHalf - 9, g.faceTop + 4, 9, g.chin - g.faceTop - 8, 5, SKIN_SHADE, { opacity: 0.4, nohalo: true }),
    legoCap(cx, g, headHalf, brimHalf, bodyColor, accent, discColor),
    legoFace(cx, g, s),
  ]
}

// The emblem is the phonics letter the child ties to the character, so the
// plate is sized past the point of good taste — it is the one element that
// still has to survive a 66 px box, where a 120x140 viewBox letterboxes to
// 57x66 and a unit is under half a pixel. Riveted at the corners so it reads
// as a patch sewn onto the bib rather than a hole in it, and inked so the
// bright plate keeps its edge on any denim.
// EMBLEM PLATE SIZING. Same rule as art/robots.js, art/dinosaurs.js,
// art/toys.js, art.js `superheroPlate` and art/dc.js `emblemPlate`. Five of
// the seven families could not fit a TWO-GLYPH label and Jolly phonics groups
// 5-7 are entirely digraphs, so chapter 8 had to put a `★` on four heroes'
// chests instead of IE/EE/OR.
//
// TWO LIMITS, THE TIGHTER ONE WINS, so a narrow chest yields a SMALLER glyph
// instead of one that leaves its plate. Em factors measured off this
// project's rendered font at weight 800 (public/_emb4.html): advance 0.85 em
// for one capital (M worst case), 1.43 for two (OA/OR), 0.91 for the star;
// inked height 0.75 em for a capital and 0.88 for the star. The star step is
// the same finding this file already recorded by hand, now shared.
//
// THE CALL SITES NO LONGER PASS A SIZE, and that is the whole point: every
// hero here asked for 24, which on a 21-unit plate inks 17.7 units into a
// 17.8-unit clear interior -- measured, the letters were crammed edge to edge
// with 0.05 units of margin and the two-glyph labels simply left the plate.
// 24 was never an honest number on this bib.
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

// `round` gives the spring its stadium plate: still an all-curves shape, so
// the letter O is not fighting square corners, but a stadium is full width
// across the whole middle where a circle is full width for one row. Measured,
// the circle cost this hero 39% of its glyph height on a digraph; the stadium
// costs 2.7 units of width against a rectangle.
function emblemPlate(x, y, w, h, plateColor, textColor, label, round = false) {
  const r = round ? h / 2 : Math.min(w, h) * 0.19
  // A NON-LETTER LABEL NEEDS ITS OWN SIZE STEP. A capital inks 0.72 of its em
  // box; the boss's ★ inks 0.93. One `size` for both is why Captain Gum's star
  // measured 20.6 units tall inside a plate whose clear interior is 16.8 (21
  // minus the 3.2 outline) -- it overflowed onto its own dark outline by ~1.9
  // units a side, invisible only because both are dark. The three letters at
  // the same nominal 24 ink 17.3-18.2 and do fit. Scaling by 0.72/0.93 makes
  // the call sites comparable again: every hero here asks for 24 and the letter
  // and the star come out the same INKED height.
  // Deliberately NOT fixed by growing the plate: the plate already fills the
  // bib to 0.5 units top and bottom, so a bigger plate means a bigger bib,
  // and v6 spent the whole torso budget getting the legs to a human ratio.
  // The label being traded down is a star, not a phonics letter.
  // The star also sits HIGHER in its em box than a capital does: measured, its
  // ink centre is 0.75 units above where the 0.36 baseline factor puts a
  // letter's, so the star needs its own baseline too or it overflows the top
  // while leaving slack at the bottom.
  // THE CORNER RADIUS HAS TO BE CHARGED, stadium or not. A glyph needs its
  // whole cap height at full width and the top and bottom rows of that band
  // sit inside the corner arcs, so a plate sized on its nominal width leaves
  // a digraph 0.8 units of slack where the padding asked for 1.6 -- measured,
  // not derived. One refinement pass: size the glyph, measure how far the arc
  // cuts in at its own cap height, resize.
  const bite = (inkH) => {
    const over = inkH / 2 - ((h - 3.2) / 2 - r)
    return over <= 0 ? 0 : 2 * (r - Math.sqrt(Math.max(0, r * r - over * over)))
  }
  const first = plateType(label, w - 3.2, h - 3.2)
  const t = plateType(label, w - 3.2 - bite(first.size * 0.75), h - 3.2)
  const size2 = t.size
  const base = t.base / t.size
  return [
    R(x, y, w, h, r, plateColor, ink(3.2)),
    R(x + 3, y + 3, w - 6, h * 0.26, r * 0.5, '#fff', { opacity: 0.5, nohalo: true }),
    // THE RIVETS MOVED OUTSIDE THE PLATE, and this is the kind of defect only
    // a pixel scan finds. At inset 5.5 they sat at x+3.8..x+7.2, i.e. inside
    // the plate's clear interior and inside the rows a two-glyph label
    // occupies -- measured, the widest clear run through the glyph's own band
    // was 19.7 units on a 30.8-unit plate, because the run stopped at a
    // rivet. They were landing ON the letter. Out on the denim they still
    // read as what they are (a patch riveted to the dungarees, and the lower
    // pair lands on the pockets, which is where denim rivets live anyway) and
    // the plate interior is finally the plate interior.
    C(x - 1.6, y + 3.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    C(x + w + 1.6, y + 3.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    C(x - 1.6, y + h - 3.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    C(x + w + 1.6, y + h - 3.5, 1.7, LINE, { opacity: 0.4, nohalo: true }),
    TEXT(x + w / 2, y + h / 2 + t.base, size2, textColor, t.text),
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
// HEROES (v9 — LEGO). See the v9 revision note at the top of the file for
// why. Standing geometry shared by the three non-boss heroes:
//
//   head   cap 3..26, brim 23..32, face 15..58, width 58, brim half 37
//   neck   58..70
//   shirt  33..87 (width 54) @ y 68..102, mostly covered by the bib
//   bib    39..81 (width 42) @ y 76..102 — matches the emblem plate width
//   arm    single straight tube, shoulder -> wrist, peg at the shoulder only
//          (the reference figure's arm is one rigid piece that pivots at the
//          shoulder — there is no elbow to peg)
//   leg    hip {_,102} -> knee {_,118} -> ankle {_,128}, pegs at hip AND knee,
//          boot 124..136
//
// `legoOveralls`/`legoLegsStanding`/`legoArmBase`+`legoArmFist`/`legoHead`
// are shared by all three; only the limb points, backdrop and (for Umo) a
// crate overlay differ per hero, the same division v3-v8 used for
// `heroHead`/`bibPanel`/`neck`.
// ---------------------------------------------------------------------------

// capTop/domeBot/brimY/brimH sit 4 units lower than the first-draft numbers
// (3/26/23/9). Measured with a padded-viewBox alpha scan (the authority, not
// getBBox): at capTop 3 the dome's halo edge landed at y -3.1..-3.3, outside
// the frame. `capTop + stroke/2 + HALO_W/2` has to clear 0, i.e.
// capTop >= 6.1 for this box's 3.2 stroke — 7 leaves a hair of margin. The
// face zone (faceTop/chin/eyeCy/noseCy/mouthY) did NOT move: the cap simply
// covers a little less of the head box than the first draft assumed, which
// costs nothing since that region was hidden under the dome either way.
const G_STD = {
  capTop: 7,
  domeBot: 28,
  brimY: 26,
  brimH: 8,
  faceTop: 15,
  chin: 58,
  eyeCy: 40,
  noseCy: 48.5,
  mouthY: 53,
}
const HEAD_HALF = 29
const BRIM_HALF = 37

// Neck, shirt block, straps, bib and rivets, and the phonics plate. Shared by
// all three standing heroes — only the arms/legs/backdrop differ per hero.
function legoOveralls(bodyColor, accent, visorColor, emblem, tone = DENIM_TONE) {
  const strapL = [
    P('35,68 44,68 41,80 34,80', tone.base, ink(2.6)),
    S('M 38,70 L 36,78', tone.stitch, 1.4, { 'stroke-dasharray': '3,2.5', opacity: 0.85, nohalo: true }),
  ]
  return [
    neck(60, 58, 70, 7, 8),
    box(33, 68, 87, 102, 8, bodyColor, ink(3.2)),
    R(35, 70, 14, 10, 5, '#fff', { opacity: 0.18, nohalo: true }),
    strapL,
    mirror(strapL),
    box(39, 76, 81, 102, 7, tone.base, ink(3.2)),
    R(40, 77, 14, 22, 5, tone.lit, { opacity: 0.5, nohalo: true }),
    R(42, 80, 36, 18, 4, 'none', {
      stroke: tone.stitch,
      'stroke-width': 1.5,
      'stroke-dasharray': '4,3',
      opacity: 0.85,
      nohalo: true,
    }),
    // Rivets at the bib's TOP corners, where the strap meets it — not the
    // lower corners v3-v8 used. That is the one placement every reference
    // image agrees on, and it is a straight coordinate move, not a redesign
    // of `bigButton` itself.
    bigButton(35, 80, 7),
    mirror(bigButton(35, 80, 7)),
    emblemPlate(39, 79, 42, 21, visorColor, accent, emblem),
  ]
}

// Both standing legs: thigh, knee peg, shin, boot, hip peg — mirrored from one
// authored side. `pegDisc` is drawn LAST in each side's list so it sits on top
// of both the bib (hip peg) and the leg's own seam (knee peg).
// Thigh/shin/boot heights come in 4 units shorter than the first-draft
// numbers (102..118 / 118..128 / 124..136), for the matching reason at the
// OTHER end of the frame: bootBot 136 put the halo edge at y 142.1..142.3
// (measured), and `bootBot + stroke/2 + HALO_W/2 <= 140` caps bootBot at
// 133.9 for this box's 3.2 stroke. 131 leaves a hair of margin.
function legoLegsStanding(tone = DENIM_TONE, bootColor = SHOE) {
  const side = [
    legoLeg(37, 53, 102, 114, tone),
    legoLeg(38, 52, 114, 122, tone),
    legoBoot(35, 55, 118, 131, bootColor),
    pegDisc(45, 102, 5.6),
    pegDisc(45, 114, 5),
  ]
  return [side, mirror(side)]
}

// One straight rigid arm: a single tapered tube from shoulder to wrist, a
// peg at the shoulder (the only joint this genre's arm has), and a fist
// seated just past the wrist. Pose comes entirely from where `shoulder` and
// `wrist` are — there is no elbow to bend.
//
// Split into two halves, `legoArmBase` (tube + shoulder peg) and
// `legoArmFist` (just the fist), because every hero drew the whole arm
// before `legoHead` and a raised arm's fist can sit at head height —
// `platJumper`'s punching arm, both of `platPowerup`'s — so the head/cap
// painted over it. User: "모든 마리오의 손이 머리보다 뒤에 있는 걸로 그려서
// 가려지는 것도 문제야." The tube+peg half never reaches that high (it
// stays down near the shoulder), so only the fist needs to move to after
// the head; splitting it out is simpler and safer than reordering the
// tube's own draw position, which would relitigate the shoulder-to-torso
// connection this arm already gets right.
function legoArmBase(shoulder, wrist, bodyColor) {
  return [
    tube(shoulder.x, shoulder.y, shoulder.w, wrist.x, wrist.y, wrist.w, bodyColor, ink(3.2)),
    S(
      `M ${((shoulder.x + wrist.x) / 2 - 2).toFixed(1)},${((shoulder.y + wrist.y) / 2 - 2).toFixed(1)} L ${((shoulder.x + wrist.x) / 2 + 2).toFixed(1)},${((shoulder.y + wrist.y) / 2 + 2).toFixed(1)}`,
      '#fff',
      shoulder.w * 0.22,
      { opacity: 0.22, nohalo: true }
    ),
    pegDisc(shoulder.x, shoulder.y, shoulder.w * 0.4),
  ]
}

function legoArmFist(shoulder, wrist, cuffColor, handR) {
  const pts = [shoulder, wrist]
  const [hx, hy] = wristSeat(pts, 6)
  const deg = towardBody(pts, hx, hy) + 180
  // Wrapped in an array (`legoFist` itself returns one `<g>` element, not a
  // list) because `mirror()` needs an array for its own children -- every
  // other mirror() call site in this file passes one.
  return [legoFist(hx, hy, handR, deg, cuffColor)]
}

// The jumper: the only figure in the family with both feet off the ground.
// One arm punches above the cap, the legs are split — one knee tucked up, the
// other trailing straight — and the ground shadow is left small and far below
// so the air gap is unmistakable. The tucked knee is still a `pegDisc`, same
// as a standing figure's — the joint does not stop being a peg because the
// pose bent it.
export function platJumper({
  bodyColor = '#e03a3a',
  accent = '#1f3f8f',
  emblem = 'R',
  visorColor = '#fff3c4',
} = {}) {
  // Ankle y kept low enough that the boot (ankle+2 .. ankle+13) clears the
  // same bootBot<=131 limit `legoLegsStanding` measured its own boots
  // against (see that function's note) — a bent leg's halo obeys the same
  // frame-edge arithmetic a straight one does.
  const legTuck = [
    { x: 47, y: 102, w: 16 },
    { x: 38, y: 108, w: 13 },
    { x: 35, y: 113, w: 11 },
  ]
  const legTrail = [
    { x: 73, y: 102, w: 16 },
    { x: 81, y: 110, w: 13 },
    { x: 85, y: 116, w: 11 },
  ]
  const bentLeg = (pts) => [
    tube(pts[0].x, pts[0].y, pts[0].w, pts[1].x, pts[1].y, pts[1].w, DENIM_TONE.base, ink(3.2)),
    tube(pts[1].x, pts[1].y, pts[1].w, pts[2].x, pts[2].y, pts[2].w, DENIM_TONE.base, ink(3.2)),
    legoBoot(pts[2].x - 10, pts[2].x + 10, pts[2].y + 2, pts[2].y + 13),
    pegDisc(pts[0].x, pts[0].y, 5.6),
    pegDisc(pts[1].x, pts[1].y, 5),
  ]
  const backdrop = [
    E(60, 136, 12, 2.4, '#000', { opacity: 0.14 }),
    S('M 12,128 L 24,120 M 108,128 L 98,122 M 44,136 L 52,128 M 78,136 L 70,129', accent, 3.6, { opacity: 0.65 }),
  ]
  // The punching arm is `armR`: its fist sits up near the brim (wrist
  // {97,42} against the cap's brim box, which reaches to x 97 / y 34) so its
  // `legoArmFist` call has to land after `legoHead` below or the brim paints
  // over the fist — the exact case the user called out ("특히
  // platJumper(Gogo)의 치켜든 팔").
  const armL = { shoulder: { x: 34, y: 76, w: 15 }, wrist: { x: 22, y: 96, w: 11 } }
  const armR = { shoulder: { x: 84, y: 72, w: 15 }, wrist: { x: 97, y: 42, w: 11 } }
  const body = [
    ...legoOveralls(bodyColor, accent, visorColor, emblem),
    bentLeg(legTuck),
    bentLeg(legTrail),
    legoArmBase(armL.shoulder, armL.wrist, bodyColor),
    legoArmBase(armR.shoulder, armR.wrist, bodyColor),
    legoHead(G_STD, HEAD_HALF, BRIM_HALF, bodyColor, accent, visorColor),
    legoArmFist(armL.shoulder, armL.wrist, accent, 10),
    legoArmFist(armR.shoulder, armR.wrist, accent, 10),
  ]
  return sticker(backdrop, body)
}

// The spring: the shirt is replaced by a stack of coil turns, and one arm
// stays raised — the same "bounce" identity v3-v8 gave this slot, kept
// because it is a torso substitution, not a skeleton choice, and survives the
// LEGO conversion unchanged in concept.
export function platSpring({
  bodyColor = '#2f9e5c',
  accent = '#16522f',
  emblem = 'M',
  visorColor = '#fff3c4',
} = {}) {
  const turn = (cy, rx, ry = 9) => [
    E(60, cy, rx, ry, bodyColor, ink(3)),
    E(60 - rx * 0.3, cy - ry * 0.32, rx * 0.4, ry * 0.28, '#fff', { opacity: 0.24, nohalo: true }),
    E(60 + rx * 0.24, cy + ry * 0.3, rx * 0.32, ry * 0.2, '#000', { opacity: 0.12, nohalo: true }),
  ]
  const seam = (cy, rx) => E(60, cy, rx, 2.6, accent, ink(2.2))
  const backdrop = [E(60, 135, 22, 3, '#000', { opacity: 0.14 })]
  // v11: NO SKIN NECK. v9 had the coil stack's own top turn swallow the whole
  // neck quad; v10's fix was to shrink/lower the stack so the skin trapezoid
  // showed again -- and the user reviewed THAT render and reversed the call:
  // "코일 컨셉을 할라고 하면 목 대신에 적당한 굵기의 코일이 들어가면 좋겠어."
  // Skin neck is wrong twice over for this hero specifically -- it is the one
  // figure whose torso is a coil, so a bare neck between head and spring reads
  // as an unfinished stack, not a design choice. The fix is a THIRD option,
  // not a rerun of v9 or v10: one extra turn, narrower than the chest turns
  // (rx 19 against 26-29) so it cannot swallow the 58-wide head the way v9's
  // rx-26 first turn did, but wider than the old skin neck (14-16) so it does
  // not read as a thin disconnected ring either. Its top edge (64-6.5=57.5)
  // sits right at the chin (58) -- legoHead is painted after this whole list,
  // so its face box quietly trims the 0.5 units that poke above the chin
  // instead of a seam needing to line up by hand.
  const body = [
    turn(64, 19, 6.5),
    turn(72, 26, 6),
    turn(80, 29, 6.5),
    turn(88, 26, 6),
    seam(68, 20),
    seam(76, 27.5),
    seam(84, 27.5),

    // BIGGER CHEST, BIGGER LETTER. User: "몸통이 너무 작아서 O 글자도 너무
    // 작아졌어." The old box (92..108, 16 tall) was 10 units shorter than the
    // other three heroes' bib (76..102, 26 tall) despite spanning the same
    // 42-unit width -- the plate inherited that shortfall directly (h 16
    // against their 21). Grown to 90..111 (21 tall, matching) and 4 units
    // wider (38..82) so the plate gets real padding on every side instead of
    // being sized to the box's own edge.
    box(38, 90, 82, 111, 7, DENIM, ink(3.2)),
    R(39, 91, 15, 16, 5, DENIM_LIT, { opacity: 0.5, nohalo: true }),
    bigButton(36, 94, 7),
    mirror(bigButton(36, 94, 7)),
    // Ollie keeps the family's one round plate — a stadium, not a disc, so
    // the letter O is not fighting square corners while still being full
    // width down the whole middle. h 17 against the old 16 is a small jump on
    // paper; on a round plate `emblemPlate`'s own radius (h/2) grows with it,
    // so the glyph's usable band grows faster than the number suggests.
    emblemPlate(40, 92, 40, 17, visorColor, accent, emblem, true),

    legoLegsStanding(),

    legoArmBase({ x: 34, y: 90, w: 14 }, { x: 22, y: 108, w: 11 }, bodyColor),
    legoArmBase({ x: 86, y: 82, w: 14 }, { x: 98, y: 58, w: 11 }, bodyColor),

    legoHead(G_STD, HEAD_HALF, BRIM_HALF, bodyColor, accent, visorColor),

    legoArmFist({ x: 34, y: 90, w: 14 }, { x: 22, y: 108, w: 11 }, accent, 10),
    legoArmFist({ x: 86, y: 82, w: 14 }, { x: 98, y: 58, w: 11 }, accent, 10),
  ]
  return sticker(backdrop, body)
}

// The block: the squarest, widest figure — a crate panel riveted onto the
// shirt, plank courses and corner brackets standing in for the shirt's own
// flat colour, dungarees below.
export function platBlock({
  bodyColor = '#e08a1e',
  accent = '#7a3d0c',
  emblem = 'D',
  visorColor = '#fff3c4',
} = {}) {
  const course = (y) => R(42, y, 36, 3, 0.8, accent, { opacity: 0.85, stroke: LINE, 'stroke-width': 1.4, nohalo: true })
  const bracket = (x, y) => R(x, y, 7, 7, 2, '#000', { opacity: 0.22, stroke: LINE, 'stroke-width': 1.4, nohalo: true })
  const backdrop = [E(60, 136, 32, 3.4, '#000', { opacity: 0.14 })]
  const body = [
    ...legoOveralls(bodyColor, accent, visorColor, emblem),
    // The crate overlay sits on the shirt, ABOVE the bib (drawn after
    // `legoOveralls` here would cover the bib — so this hero calls the two
    // in the opposite order from the others: overalls first, crate painted
    // on the shirt margins the bib leaves exposed).
    box(35, 69, 85, 79, 4, accent, ink(2.6)),
    R(37, 71, 46, 6, 2, bodyColor, ink(2)),
    course(73.5),
    bracket(35.5, 70.5),
    bracket(80.5, 70.5),

    legoLegsStanding(),

    legoArmBase({ x: 34, y: 76, w: 15.5 }, { x: 22, y: 92, w: 11.5 }, bodyColor),
    legoArmBase({ x: 86, y: 76, w: 15.5 }, { x: 98, y: 92, w: 11.5 }, bodyColor),

    legoHead(G_STD, HEAD_HALF, BRIM_HALF, bodyColor, accent, visorColor),

    // Umo's arms hang level with the shoulders, well clear of the head, so
    // this split is not fixing a visible overlap for THIS hero — it is here
    // for the same reason every other hero got it: consistency, and so a
    // future repose of this arm does not quietly reopen the bug the other
    // three were fixed for.
    legoArmFist({ x: 34, y: 76, w: 15.5 }, { x: 22, y: 92, w: 11.5 }, accent, 10),
    legoArmFist({ x: 86, y: 76, w: 15.5 }, { x: 98, y: 92, w: 11.5 }, accent, 10),
  ]
  return sticker(backdrop, body)
}

// The power-up form, chapter boss: deliberately the biggest figure in the
// family and the only one whose cap is winged. It keeps every decorative
// trace v3-v8 gave it — the fire-flower colour inversion, the aura ray burst,
// the wings, the fireballs, the spring's coil rings on the shins, the block's
// plank panels on the bib flanks — none of which are skeleton geometry, so
// none of them needed to change for the LEGO conversion. Only the body
// underneath (head, torso, limbs) is rebuilt in the new grammar, bigger.
//
// `bodyColor` IS ACCEPTED AND IGNORED, same as before: the wardrobe is fixed
// (casting rule 2's reasoning for DENIM applies here too) and the palette
// entry for `captain-gum` still does not pass one.
export function platPowerup({
  bodyColor = '#f8f8f2',
  panelColor = '#fff6e2',
  accent = '#f0b429',
  // Aura rays. Orange rather than the old pale yellow, and that is load-bearing
  // now rather than decorative: a white figure needs the ring behind it to be
  // warm, or the whole upper body sits on nothing.
  visorColor = '#ff8a1f',
  // The star used to be inked in `bodyColor` straight onto the cream plate,
  // which measured 3.08:1 -- the worst emblem in the app, and a full point
  // below the next worst. The cause was not the plate and not the size: this
  // figure already carries the second-largest glyph in the app (21.6 units
  // inked, 17 px at a 96 px card). It was that a MID-TONE cannot be rescued by
  // a background. #e05a9e against pure white is 2.9:1; against the brightest
  // conceivable plate it still cannot pass 3.1. So the ink moves and the plate
  // does not -- which is also why this fix costs the costume nothing: the plate
  // stays 34x20 at the same anchor, and the two-tone dungarees, the buttons and
  // the topstitch that v6 fought for are untouched.
  //
  // The colourway inversion did NOT move this number, and that was the one
  // thing worth checking before shipping it: the plate is bounded on all four
  // sides by the bib, so the bib turning red changes nothing the star sits on.
  // art.js's #5c1a3d measures 11.30:1 on the shipped plate and is left alone;
  // the default below is the same value pulled toward the new red identity
  // (10.74:1), for callers that do not override.
  inkColor = '#6e1210',
  emblem = '★',
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
  // The fire flower itself, small and in the backdrop. It is here because the
  // reference sheet shows the item beside the figure, and it is THIS SIZE and
  // THIS HIGH because there is nowhere bigger or lower: the frame's two free
  // pockets are the lower corners, and a boot's halo claims everything from
  // x 14 (mirrored: 106) and y 112.5 down. Measured, an earlier seat at
  // (11,100) put the lower leaf at y 114.8 and CLOSED a background gap that
  // used to be 4.8 units wide at y 114. Seated at y 96 the whole plant ends at
  // y 109.2 and is clear of it.
  //
  // What replacing the two lower sparkles DOES cost, measured and not hidden:
  // the pocket outboard of the left boot at (23,108) used to be an ENCLOSED
  // hole of 120 units, because the old sparkle at (14,116) walled it in from
  // below. It is now an OPEN bay reaching the frame edge — scanline y 114 went
  // from three ink runs ([8.3,19.8] [24.6,95.4] [98.3,109.8]) to one. That is
  // the opposite of a fusion, but a hole count alone reads it as a loss, so:
  // no ink merged, one decoration moved 20 units up. The hole that matters —
  // the 48-unit enclosure between the boots at (60,124) — is untouched.
  // Between the boots is wider but that gap IS the family's only cutout hole
  // and cannot be filled.
  // No halo (backdrop), so it carries its own thin ink.
  const fireFlower = (cx, cy) => {
    const petal = (dx, dy) => C(cx + dx, cy + dy, 3.4, FLAME_OUT, ink(1.8))
    return [
      S(`M ${cx},${cy + 3} L ${cx},${cy + 12}`, LEAF_DEEP, 2.4),
      E(cx - 4.4, cy + 6.6, 3.6, 2, LEAF, ink(1.6)),
      E(cx + 4.4, cy + 9, 3.6, 2, LEAF, ink(1.6)),
      petal(0, -4.6),
      petal(-4.4, -1.4),
      petal(4.4, -1.4),
      petal(-2.7, 3.7),
      petal(2.7, 3.7),
      C(cx, cy, 3.6, FLAME_CORE, ink(1.8)),
      C(cx - 1.3, cy - 0.5, 0.9, LINE, { opacity: 0.85 }),
      C(cx + 1.3, cy - 0.5, 0.9, LINE, { opacity: 0.85 }),
    ]
  }
  // The fireball, one per raised fist. The reference holds one; this figure is
  // mirror-symmetric in every other part, and a single ball made the pose look
  // like a mistake rather than a stance. Sized and seated to add NOTHING to the
  // clip envelope the raised arm already owns: the ball plus licks span
  // x 9..27, y 24..47.4, and the glove's own thumb already reaches x 1.5 (it is
  // r*0.88 out from the lobe centre plus r*0.46 of its own). Nested flat fills,
  // darkest outside, because gradients are banned here.
  const fireball = (cx, cy) => {
    const lick = (x1, y1, tx, ty, x2, y2) =>
      P(`${x1},${y1} ${tx},${ty} ${x2},${y2}`, FLAME_OUT, ink(2.2))
    return [
      lick(cx - 6.5, cy - 1, cx - 9.5, cy - 12, cx - 1.5, cy - 5),
      lick(cx - 3, cy - 3, cx + 0.5, cy - 16, cx + 4, cy - 3),
      lick(cx + 1.5, cy - 1, cx + 8.5, cy - 11, cx + 6.5, cy - 2),
      C(cx, cy, 7.4, FLAME_OUT, ink(2.4)),
      C(cx + 0.6, cy + 0.8, 4.6, FLAME_MID, { nohalo: true }),
      C(cx + 1.1, cy + 1.4, 2.2, FLAME_CORE, { nohalo: true }),
    ]
  }
  // One broad wing with a serrated trailing edge. Smooth rounded lobes read as
  // rabbit ears, a single sharp wedge as a devil horn, and thin separate
  // feathers as insect antennae; a wide mass plus notches is the only version
  // that stayed a wing down to 66 px.
  //
  // v8 changes the FILLS ONLY — the two polygons are byte-identical, so the
  // hard cutout is untouched — and the serrated edge that was fighting to read
  // as feathers now reads as what it always looked like: flame. Three nested
  // tones instead of gold-over-cream.
  const wing = [
    P('42,18 10,7 15,15 9,14 16,20 9,23 19,28 42,29', FLAME_OUT, ink(2.8)),
    P('42,19 16,11 18,16 26,21 42,25', FLAME_MID, { nohalo: true }),
    P('42,20 24,15 27,19 42,23', FLAME_CORE, { nohalo: true }),
  ]
  // Narrow: wider, the two panels plus the emblem plate covered the bib edge
  // to edge and the denim — half of the family's two-tone — disappeared on the
  // one figure that most needs to look like the others.
  const plankPanel = (x) => [
    R(x, 86, 10, 20, 2.5, accent, ink(2.4)),
    S(`M ${x + 1},${92} L ${x + 9},${92}`, LINE, 1.6, { opacity: 0.5, nohalo: true }),
    S(`M ${x + 1},${99} L ${x + 9},${99}`, LINE, 1.6, { opacity: 0.5, nohalo: true }),
  ]
  // The spring's trace, moved from the ankles to the shins so it sits ON the
  // new tapered leg instead of floating between leg and boot.
  const coilRing = (cx, cy) => E(cx, cy, 11, 3, accent, ink(2.2))
  // v9: BOTH ARMS RAISED, unchanged in concept from v6-v8 — the reasoning
  // (a hanging arm has nowhere to be beside a wide hip block once both carry
  // a halo; raised, the mass pushes into the frame's empty top corners, which
  // is most of what reads as "the bigger, combined form") did not depend on
  // the human skeleton, so it survives untouched. Only the arm ITSELF is now
  // a single rigid `legoArm` tube instead of a jointed elbow taper.
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
    // The two LOWER sparkles become the item; the upper pair stay motes.
    fireFlower(11, 96),
    mirror(fireFlower(11, 96)),
    sparkle(11, 70, 4.4),
    sparkle(108, 76, 4.4),
  ]
  // Boss geometry: the same three-block skeleton as the standing heroes
  // (shirt/bib/legs/head), scaled up — head half 33 against the standard 29,
  // shirt half 33 against 27 — so the boss reads as heavier without changing
  // the family's grammar.
  // capTop/domeBot/brimY shifted +6 from the first draft for the same reason
  // G_STD's did (measured padded-viewBox scan: capTop 1 put the halo edge at
  // y -5.2..-5.3). The face zone is untouched.
  const G_BOSS = {
    capTop: 7,
    domeBot: 30,
    brimY: 27,
    brimH: 9,
    faceTop: 16,
    chin: 62,
    eyeCy: 44,
    noseCy: 53,
    mouthY: 58,
  }
  const strapL = [
    P('29,75 40,75 37,88 28,88', FIRE_TONE.base, ink(2.8)),
    S('M 33,77 L 31,86', FIRE_TONE.stitch, 1.5, { 'stroke-dasharray': '3.5,3', opacity: 0.85, nohalo: true }),
  ]
  const armShoulder = { x: 27, y: 80, w: 16 }
  const armWrist = { x: 21, y: 54, w: 12 }
  const body = [
    neck(60, 62, 75, 9, 10),
    box(27, 75, 93, 110, 9, FIRE_WHITE, ink(3.4)),
    R(29, 77, 15, 12, 5, '#000', { opacity: 0.06, nohalo: true }),
    strapL,
    mirror(strapL),
    box(35, 84, 85, 110, 8, FIRE_TONE.base, ink(3.4)),
    R(37, 86, 15, 22, 5, FIRE_TONE.lit, { opacity: 0.4, nohalo: true }),
    bigButton(35, 88, 8),
    mirror(bigButton(35, 88, 8)),
    emblemPlate(39, 86, 42, 20, panelColor, inkColor, emblem),
    plankPanel(28),
    plankPanel(82),

    // Leg heights come in shorter than the first draft (110..123/123..131,
    // boot to 137) for the same bootBot<=131-ish reason `legoLegsStanding`
    // measured its own boots against — this boss's boot carries the same
    // 3.2 stroke.
    legoLeg(36, 56, 110, 119, FIRE_TONE),
    legoLeg(37, 55, 119, 125, FIRE_TONE),
    legoBoot(33, 59, 122, 131, SHOE),
    coilRing(46, 122),
    pegDisc(46, 110, 6.3),
    pegDisc(46, 119, 5.6),
    mirror([
      legoLeg(36, 56, 110, 119, FIRE_TONE),
      legoLeg(37, 55, 119, 125, FIRE_TONE),
      legoBoot(33, 59, 122, 131, SHOE),
      coilRing(46, 122),
      pegDisc(46, 110, 6.3),
      pegDisc(46, 119, 5.6),
    ]),

    // Red cuffs on white sleeves. Not decoration: the sleeve, the fist and
    // the halo are all near-whites within 1.07:1 of each other, so the wrist
    // is the one boundary on this figure with three whites meeting at it.
    //
    // Only the BASE (tube + shoulder peg) goes here. The fist stays with
    // `armShoulder`/`armWrist` below, drawn after `legoHead` — this boss's
    // raised fist (wrist y 54, right where the head's hairTuft/cap sit at
    // this scale) was getting painted over by the head, the same "손이
    // 머리보다 뒤에 있다" defect the user found on platJumper.
    legoArmBase(armShoulder, armWrist, FIRE_WHITE),
    mirror(legoArmBase(armShoulder, armWrist, FIRE_WHITE)),

    wing,
    mirror(wing),
    legoHead(G_BOSS, 33, 43, FIRE_WHITE, FIRE_BRIM, null, 1.14),

    // Fist, then fireball, in that order and both after the head: the
    // fireball has to land on top of its own fist for the "holding the
    // flower's fireball" read the original comment describes, and both need
    // to be on top of the head to actually be visible at all.
    legoArmFist(armShoulder, armWrist, FIRE_RED, 11),
    fireball(18, 41),
    mirror(legoArmFist(armShoulder, armWrist, FIRE_RED, 11)),
    mirror(fireball(18, 41)),
    // Sits in the same slot as the other three heroes' cap disc, but a star:
    // `legoHead` was called with `discColor = null` so its own plain accent
    // disc is skipped, and this figure gets the mark instead — the phonics
    // plate stays on the chest either way, so this is not the badge the
    // instruction warns off (it carries no letter, no logo, no ring).
    star(60, 23.5, 7.5, FIRE_MARK, ink(1.7)),
    star(60, 23.5, 2.6, accent, { nohalo: true }),
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
  const {
    s = 1,
    dx = 10.5,
    ex = 6.2,
    tilt = 1,
    mouthY = cy + 16,
    mouthW = 10,
    fangs = 2,
    mouth = true,
    // Iris colour, LINE (near-black) by default -- every villain but Bug King
    // keeps that default untouched. Bug King passes FIRE_RED: the Bowser
    // reference photos all show red eyes, and the pupil is the only part of
    // this shared face that can carry it without touching the other four
    // villains' calls.
    eyeColor = LINE,
  } = opts
  const ey = ex * 1.06
  const eye = (px, k) => [
    E(px, cy, ex * s, ey * s, '#fff', ink(2.2)),
    C(px + k * ex * 0.22 * s, cy + ey * 0.16 * s, ex * 0.56 * s, eyeColor, { nohalo: true }),
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

// Wrist spike band -- Bug King only. Bowser's reference photos all show a
// black wristlet with white spikes on both arms ("라이엇 건틀릿" read); none
// of the other four villains grow one. Drawn AFTER `villainArm` and seated on
// the limb's OWN last joint (`pts[pts.length-1]`), not the further-out point
// `wristSeat()` hands the glove -- so the band sits between forearm and
// glove instead of colliding with the glove's own cuff badge.
function wristSpikeBand(pts) {
  const j = pts[pts.length - 1]
  const prev = pts[pts.length - 2]
  const deg = (Math.atan2(j.y - prev.y, j.x - prev.x) * 180) / Math.PI
  const r = j.w * 0.62
  const spike = (a, len) => {
    const rad = (a * Math.PI) / 180
    const ux = Math.cos(rad)
    const uy = Math.sin(rad)
    const px = -uy
    const py = ux
    const baseR = r * 0.9
    const bw = r * 0.34
    return P(
      `${(ux * baseR + px * bw).toFixed(1)},${(uy * baseR + py * bw).toFixed(1)} ${(ux * (baseR + len)).toFixed(1)},${(uy * (baseR + len)).toFixed(1)} ${(ux * baseR - px * bw).toFixed(1)},${(uy * baseR - py * bw).toFixed(1)}`,
      '#fff',
      ink(1.4)
    )
  }
  return G(`translate(${j.x.toFixed(1)},${j.y.toFixed(1)}) rotate(${deg.toFixed(1)})`, [
    E(0, 0, r * 1.05, r * 0.74, '#000', { stroke: LINE, 'stroke-width': 1.8 }),
    spike(90, r),
    spike(-90, r),
    spike(180, r * 0.8),
  ])
}

// Bug King (plat-glitch), the chapter boss: deliberately the biggest and
// heaviest figure in the family. Its jaw is a dark void wide enough to pull a
// checkerboard block halfway in, and it is shedding itself along one flank —
// small squares at scattered sizes and opacities, never more than two in a
// row, so the erosion cannot settle into a straight edge or corner that would
// read as a letterform. The debris squares are backdrop parts: haloed, they
// would turn into a row of white-framed tiles and stop reading as decay.
//
// REVISION NOTE (BOWSER MOTIF): the actual request, twice misrouted to the
// combined hero (Captain Gum) before the user corrected it — "합체한 히어로
// 말하는게 아니라 bug king(보스 빌런)을 수정해달라는 요청이었어." Bowser
// features chosen to be recognisable without copying him: a shell silhouette
// (one big shoulder spike plus a three-tooth flank ridge per side, both
// attached to the torso's own edge so they read as armour, not stickers), a
// fire-breath column, a taller/heavier belly, and thicker limbs.
//
// FIRE COMES FROM THE VOID, NOT A SECOND MOUTH. This figure's belly void has
// been "this one's mouth" since v4 (the head carries eyes and brows only —
// see below); a flame plume anywhere else would give it two mouths. The
// stream runs straight down between the legs, which is the only direction
// the void actually opens toward.
//
// THE FRAME WAS ALREADY NEARLY FULL, so "bigger" could not mean "reaches
// further outward" — the pre-edit render's own padded-viewBox alpha scan
// (this file's clip authority, `public/_bugking.html` scratch harness, K=3
// px/unit) measured x 4.3..116.3 / y 3.7..137.7 on the 0..120/0..140 canvas
// and an ink ratio (opaque pixels / frame area) of 68.20%, i.e. every edge
// already had well under 6 units of slack (the left arm's glove and the horn
// tips own that ceiling). Every new tip below was placed to stay inside that
// existing envelope and rechecked with the same scan after each edit — final
// result x 2.3..117.3 / y 3.7..137.7, CLIP-free, ink ratio 75.33% (+7.1
// points). The gain is FILL, not reach: the background gaps between torso
// and arm, above the shoulder below the horns, and between the legs, which
// is exactly where an earlier attempt at this same brief measured
// 82.36% -> 82.65% on a different figure (decoration added, no real change)
// before it was caught and sent back. Horn tips and the head's own vertical
// reach are UNTOUCHED — they set that 3.7-unit ceiling, and the new mass
// targets the frame's actual empty interior instead of pushing past them.
// Limb ANCHOR points (shoulder/elbow/wrist, hip/knee/ankle) are unchanged
// from v4 too, on purpose: only each joint's `w` grew, which thickens the
// tube around its existing centreline instead of moving its tip further from
// the pivot — the one part of "thicker limbs" that could not reopen the old
// clips.
export function platGlitch({ bodyColor = '#3d3d46', accent = '#7d5fe0' } = {}) {
  const bit = (x, y, s, fill, op) => R(x, y, s, s, 0, fill, { opacity: op })
  // Shell green, not `accent` -- the reference photos' shell/horn/spike
  // material is consistently green regardless of the villain's own accent
  // slot (`accent` stays in charge of the legs and the glove cuff badge,
  // where the reference gives no directive). Reuses LEAF/LEAF_DEEP verbatim:
  // they already exist in this file for the fire-flower petals, so this is
  // zero new module-level colour surface.
  const SHELL = LEAF
  const SHELL_TIP = GLOVE
  // `tip` is the outermost vertex of `points`, given separately because a
  // horn's silhouette point list has no reliable "last point is the tip"
  // convention and guessing wrong would put the highlight on the ROOT.
  const horn = (points, tip) => [P(points, SHELL, ink(2.6)), C(tip[0], tip[1], 2.1, SHELL_TIP, { opacity: 0.9, nohalo: true })]
  // Shell shoulder spike, left side; mirrored for the right. Anchored on the
  // torso's own widened top edge (see the torso path below) so the ink reads
  // as a plate riveted to the shell, not a shape floating beside the figure.
  // Tip (12,44) sits ~35 units below the horns' y 9 ceiling and, even after
  // the group's own -4 deg rotation, measured well inside the old x 4.3
  // floor (see the revision note's before/after scan) — it cannot become the
  // new extreme.
  // Wrapped in arrays (not bare part objects) because `mirror()` needs an
  // array for its own children -- every other mirror() call site in this
  // file passes one (see `legoFist`'s own note on the same requirement).
  const shoulderSpike = [
    P('27,64 12,44 37,59', SHELL, ink(3)),
    // White-tipped horn-spike, per the reference: a root colour and a light
    // tip in two flat layers (no gradient). Inset a hair from the true vertex
    // (12,44) so the highlight sits ON the ink mass rather than riding its
    // own stroke.
    C(15.2, 47, 2.3, SHELL_TIP, { opacity: 0.92, nohalo: true }),
  ]
  // Three-tooth flank ridge, left side; mirrored for the right. Kept to
  // y 62..90 -- the shoulder deltoid ball's own vertical span -- rather than
  // running the full torso height: lower than that, the arm's forearm and
  // glove already reach past any tip this ridge could offer without risking
  // the frame edge, and the teeth would fuse into the arm's own silhouette
  // instead of reading as a separate plate (measured on a render: the first
  // draft's full-height ridge did exactly that). Tips at x 9, a good 10
  // units outside the deltoid ball's own x 19 reach at its widest (y 74), so
  // the middle tooth clears the arm rather than disappearing into it.
  const flankRidge = [
    P('25,62 9,67 25,72 9,76 25,81 9,85 25,90', SHELL, ink(2.8)),
    // Same white tip treatment on all three teeth.
    C(9, 67, 1.5, SHELL_TIP, { opacity: 0.9, nohalo: true }),
    C(9, 76, 1.5, SHELL_TIP, { opacity: 0.9, nohalo: true }),
    C(9, 85, 1.5, SHELL_TIP, { opacity: 0.9, nohalo: true }),
  ]
  // Anchor points identical to v4's — only `w` (tube width) grew, so the
  // thickening happens around the existing centreline instead of pushing any
  // tip further from the torso.
  const armL = [
    { x: 31, y: 74, w: 13 },
    { x: 23, y: 85, w: 11 },
    { x: 21, y: 95, w: 9.2 },
  ]
  const armR = [
    { x: 89, y: 72, w: 13 },
    { x: 96, y: 83, w: 11 },
    { x: 97, y: 93, w: 9.2 },
  ]
  const legL = [
    { x: 52, y: 90, w: 13 },
    { x: 47, y: 105, w: 10.5 },
    { x: 44, y: 117, w: 9.2 },
  ]
  const legR = [
    { x: 68, y: 90, w: 13 },
    { x: 74, y: 107, w: 10.5 },
    { x: 77, y: 119, w: 9.2 },
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
      // halfTop/halfBot grew 10/11 -> 11/12 to match the deeper belly below.
      neck(58, 52, 66, 11, 12, bodyColor, '#000'),

      plainLimb(legL, accent, 3),
      plainLimb(legR, accent, 3),
      villainShoe(41, 121, 14, 8.5),
      villainShoe(80, 123, 14, 8.5),

      // Taller AND wider belly: top edge 63 -> 60, bottom 87/92 -> 94/99 (was
      // a 29-unit torso, now 39 tall), span 29..91 -> 25..95 (62 -> 70 wide).
      // Re-verified after the widen with the same alpha scan (see the
      // revision note above) rather than assumed safe by proximity to the
      // old arm/horn extremes.
      // BELLY PLATE IS CREAM, NOT `bodyColor` — the reference's underbelly is
      // reliably cream/beige regardless of the villain's own body tone, the
      // same reasoning `DENIM`/`FIRE_TONE` already use elsewhere in this
      // file for a garment the genre needs to read a specific way. Reuses
      // GLOVE/GLOVE_SHADE verbatim (already this file's cream-white), so
      // this costs no new colour constant either.
      D(
        `M 25,75 C 25,60 36,60 48,60 L 72,60 C 84,60 95,60 95,75
         L 92,94 Q 92,99 84,99 L 36,99 Q 28,99 25,94 Z`,
        GLOVE,
        ink(3.4)
      ),
      // Rib stripes. Most of this plate's area is claimed by the void below,
      // so the only cream left to carry them is the thin margin above and
      // below it — two short strokes is what that margin can hold without
      // crossing into the void's own outline.
      S('M 33,63.5 L 87,63.5', GLOVE_SHADE, 1.8, { opacity: 0.55, nohalo: true }),
      S('M 38,97 L 82,97', GLOVE_SHADE, 1.6, { opacity: 0.5, nohalo: true }),

      shoulderSpike,
      mirror(shoulderSpike),
      flankRidge,
      mirror(flankRidge),

      // The void in the belly IS this one's mouth — so the head carries eyes
      // and brows only. Giving the head its own mouth as well produced a
      // figure with two mouths and neither read. Grown with the deeper belly
      // (23x13 -> 28x16) and re-centred on it (77 -> 80).
      E(58, 80, 28, 16, SOLE, ink(3)),
      R(43, 65, 15, 15, 0, bodyColor, { nohalo: true }),
      R(58, 65, 15, 15, 0, accent, { nohalo: true }),
      R(43, 80, 15, 15, 0, accent, { nohalo: true }),
      R(58, 80, 15, 15, 0, bodyColor, { nohalo: true }),
      R(43, 65, 30, 30, 0, 'none', { stroke: LINE, 'stroke-width': 2.4, nohalo: true }),
      // Fangs at the maw's rim, as triangles rather than the chevron strokes a
      // first pass used — a '<' next to a '>' is exactly the accidental glyph
      // this app has been bitten by before.
      P('35,71 43,71 38,81', '#fff', { nohalo: true }),
      P('75,71 83,71 78,81', '#fff', { nohalo: true }),

      // Fire breath. The void is this figure's mouth, so the flame has to
      // come from there rather than the face — a stream pouring straight
      // down between the legs. Contained to x 35..81 / y 92..131, well
      // inside every edge the old scan measured, so it adds mass without
      // touching the frame's tight margins at all. Three nested flat fills
      // (no gradient, per the family rule), outer ring haloed like the rest
      // of the body so it reads as attached to the maw rather than a loose
      // decal.
      D('M 45,96 C 39,106 35,116 40,126 C 47,131 69,131 76,126 C 81,116 77,106 71,96 Z', FLAME_OUT, ink(2.4)),
      D('M 48,98 C 43,107 40,115 45,123 C 50,127 66,127 71,123 C 76,115 73,107 68,98 Z', FLAME_MID, { nohalo: true }),
      D('M 51,101 C 48,108 46,113 50,120 C 53,123 63,123 66,120 C 70,113 68,108 65,101 Z', FLAME_CORE, { nohalo: true }),

      villainArm(armL, bodyColor, accent, 12),
      villainArm(armR, bodyColor, accent, 12),
      // Wristlets. Drawn after each arm (and so after that arm's own glove),
      // at the joint the arm itself defines -- see `wristSpikeBand`'s note.
      wristSpikeBand(armL),
      wristSpikeBand(armR),

      // Flame-crest hair. Drawn BEFORE the horns and the head box, same
      // layering `legoHead` uses for its own hair tufts: the base (y 18..20)
      // is hidden under the head box below (its own top edge runs from y 20
      // at the sides to y ~12.5 at the crown, a cubic with both control
      // points at y 10), so only the three licks that clear that edge
      // survive as "hair peeking out". First draft peaked at y 3, which
      // alone pushed the whole figure's alpha-scan ceiling to y -2 (CLIP);
      // walked back to y 6.5..8 so the ceiling lands at y 1.3, inside the
      // frame with the same order of margin the horns' own tip (y 9) used
      // to hold it at y 3.7 before this hair existed.
      D(
        `M 39,18 L 44,8 L 49,15 L 55,6.5 L 61,15 L 67,8 L 74,17 L 76,20 L 39,20 Z`,
        FLAME_OUT,
        ink(2.2)
      ),
      D('M 45,19 L 48,13 L 51,18 L 55,11.5 L 59,18 L 63,13 L 67,19 Z', FLAME_MID, { nohalo: true }),

      // v4's left horn had its tip at x 23 against a head whose left edge is
      // x 28 — it was drawn INSIDE the skull and read as nothing at all, while
      // the right one read as a triangle. Now both break the silhouette by the
      // same 12 units and both tips sit at y 13, level with the shortened
      // crown, which is what makes them horns rather than ears. UNTOUCHED by
      // the Bowser pass — see the revision note above. (Fill and tip highlight
      // ARE new -- see `horn`'s own note.)
      horn('38,18 15,9 33,27', [15, 9]),
      horn('74,18 97,12 79,27', [97, 12]),
      // Widened 56 -> 60 units (28..84 -> 26..86); vertical reach is
      // UNTOUCHED (still 20..58) since it owns the frame's y 3.7 ceiling.
      D('M 26,20 C 26,10 86,10 86,20 L 86,44 C 86,54 76,58 56,58 C 38,58 26,54 26,44 Z', bodyColor, ink(3.4)),
      // eyeColor: red irises, per every one of the four reference photos --
      // see `villainFaceParts`'s own note. Every other villain's call is
      // unchanged and keeps the LINE default.
      villainFaceParts(56, 32, { dx: 13, ex: 7.2, tilt: 1.3, mouth: false, eyeColor: FIRE_RED }),
    ]),
  ]
  return sticker(backdrop, body)
}
