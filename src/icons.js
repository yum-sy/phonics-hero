import { ICON_PHOTOS } from './icon-photos.js'

// Original flat-color SVG word/picture icons used on choice buttons in
// place of plain Unicode emoji. Historically kept in the same
// geometric-primitive style as the character art in art.js (circles/rects/
// polygons, 2-3 flat colors, no gradients/photorealism).
//
// 2026-08 PROTOTYPE ROUND: the user asked for a move away from that
// abstract-icon look toward picture-book/word-card flashcard illustrations
// -- natural object silhouettes (a real key shape, a real leg with a knee)
// with mid-level detail and soft layered shading, not geometric shorthand.
// Ten icons (ant, corn, feet, fish, jug, mat, nose, sock, tap, top) were
// redrawn this round as a sample before committing the other ~60. Gradients
// and SVG filters stay banned either way; shading is faked the same way the
// character art fakes it -- overlapping flat-color fills (a darker patch
// clipped over a lighter body) rather than a `<linearGradient>`.
//
// ROUND 2 (same 2026-08 pass): of those ten, only `mat` and `sock` passed
// user review. The other eight (ant, corn, feet, fish, jug, nose, tap, top)
// were rejected as "silhouette barely changed, just shading added on top of
// the same shape" -- true of most of them on inspection. This round redrew
// those eight with the silhouette itself changed (new poses/proportions,
// not recolors), using web-searched reference for real-object proportions
// (ant's wasp-waist, corn's vertical kernel columns vs. a grid, a jug's
// bulbous belly, a faucet's thick gooseneck, a spinning top's disc-over-cone
// profile) -- see each icon's own comment for what specifically changed and
// why. Each was checked against a hard-cutout render and the same
// background-proximity metric described below before being kept.
//
// SIZE: these render at 200-261px on an option button (the exact figure is
// set by the option count and the device orientation, since the option grid
// became elastic) and at 150px in _art.html's gallery. This header used to
// say "~60px", which was true before the grid change and is what made
// earlier rounds draw detail too coarse. Judge every icon at 150px+.
//
// Two things decide whether an icon works, and neither is visible in the
// source. Its HARD CUTOUT (`filter: brightness(0)`) must not match another
// icon's -- greyscale is too forgiving, it leaves the internal linework in.
// And its own opaque area must not sink into the button: the metric is the
// share of the icon's opaque pixels within dE 12 of the background
// (`#fffdf4` normal, `#c8f5a8` selected). `sock` measured 72% once and was
// effectively invisible. Pale fills therefore always carry a dark contour.
//
// 2026-08 PHOTO-CROP ROUND (chapter 9-14 sound icons): the user licensed a
// set of phonics flashcard reference sheets (`icon_refs/*.png`, confirmed
// copyright-clear -- ours to crop and ship as-is, no redraw needed) and
// asked for the new Group 5-7 sound icons to be cropped straight from them
// instead of hand-redrawn as SVG. `ICON_PHOTOS` (`icon-photos.js`) holds
// each crop as a base64 PNG + its natural pixel size; `photoIcon()` below
// wraps it in an `<image>` so `wordIcon()` still returns one SVG markup
// string either way -- callers can't tell a hand-drawn icon from a photo
// crop apart. Base64 (not a `public/icons/*.png` URL reference) was chosen
// deliberately: this project's clipping/silhouette probes serialize icon
// markup into a standalone `data:image/svg+xml` URI and rasterize it to a
// canvas (see CLAUDE.md's "SVG를 데이터 URI로 파싱할 때" pitfalls) -- a
// `<image href="/icons/x.png">` would need a second network fetch with no
// reliable base URL once nested inside that data URI, while a base64 data
// URI is self-contained and decodes synchronously wherever the SVG ends up.
// The crops themselves are tightly trimmed to the illustration only (no
// flashcard letter/caption text) with the card's background flood-filled
// to transparent from the edges inward, so interior whites (a book's pages,
// a watch face) survive untouched. See `scripts/crop-icon-photos.py` for
// the crop tool if more flashcard icons get promoted later.

function wrap(inner, viewBox = '0 0 64 64') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="word-icon-art">${inner}</svg>`
}

// Fits a cropped photo (given its natural pixel size) into the 64x64
// viewBox at `box` px max on the long side, centered -- same visual weight
// as the hand-drawn icons, which mostly fill the box with a small margin.
function photoIcon(name, box = 58) {
  const photo = ICON_PHOTOS[name]
  if (!photo) return FALLBACK()
  const { w, h, data } = photo
  const scale = Math.min(box / w, box / h)
  const rw = w * scale
  const rh = h * scale
  const x = (64 - rw) / 2
  const y = (64 - rh) / 2
  return wrap(
    `<image href="data:image/png;base64,${data}" x="${x.toFixed(2)}" y="${y.toFixed(2)}" width="${rw.toFixed(2)}" height="${rh.toFixed(2)}" preserveAspectRatio="xMidYMid meet"/>`
  )
}

// Counter so icons that need a local <mask>/<clipPath> id (e.g. moon) don't
// collide when the same icon is rendered multiple times on one page.
let uid = 0
function nextId(prefix) {
  uid += 1
  return `${prefix}-${uid}`
}

const ICONS = {
  sun: () => photoIcon('sun'),
  snake: () =>
    wrap(`
      <path d="M10 20 Q10 8 22 8 Q34 8 34 18 Q34 28 22 28 Q14 28 14 34 Q14 44 26 44 Q46 44 46 30"
        fill="none" stroke="#3b9922" stroke-width="9" stroke-linecap="round"/>
      <polygon points="46,30 58,26 58,34" fill="#e24b4a"/>
      <circle cx="22" cy="10" r="2.4" fill="#161615"/>
    `),

  dog: () => photoIcon('dog'),
  // Flashcard-style redraw (2026-08 icon prototype round): a real tube sock
  // silhouette -- straight back edge, ankle bend, rounded toe -- carrying
  // classic sport-sock stripes and reinforced heel/toe patches as the two
  // cues a 5-year-old already knows from real socks. The patches double as
  // the "layered solid fills" shading technique: a warm-gray overlay clipped
  // to the body reads as fabric shadow without any gradient. Off-white body
  // still keeps the dark contour the header requires for pale fills.
  sock: () => {
    const clipId = nextId('sock-clip')
    const body =
      'M20 6 H40 V26 Q40 32 45 35 L55 41 Q60 44 60 49 Q60 55 53 55 L26 55 Q20 55 20 48 Z'
    return wrap(`
      <clipPath id="${clipId}"><path d="${body}"/></clipPath>
      <path d="${body}" fill="#f5f2ea"/>
      <g clip-path="url(#${clipId})">
        <rect x="14" y="9" width="32" height="6" fill="#e24b4a"/>
        <rect x="14" y="16" width="32" height="6" fill="#378add"/>
        <ellipse cx="26" cy="49" rx="11" ry="9" fill="#d8d2c4"/>
        <ellipse cx="51" cy="46" rx="11" ry="9" fill="#d8d2c4"/>
      </g>
      <path d="${body}" fill="none" stroke="#2c2c2a" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M20 6 H40" fill="none" stroke="#2c2c2a" stroke-width="3.2" stroke-linecap="round"/>
      <g stroke="#c9c2b0" stroke-width="1.6" stroke-linecap="round">
        <line x1="24" y1="6" x2="24" y2="8.5"/>
        <line x1="30" y1="6" x2="30" y2="8.5"/>
        <line x1="36" y1="6" x2="36" y2="8.5"/>
      </g>
    `)
  },

  star: () =>
    wrap(`
      <polygon points="32,4 39,24 60,24 43,37 49,58 32,46 15,58 21,37 4,24 25,24"
        fill="#ffd43b" stroke="#f4a71b" stroke-width="2" stroke-linejoin="round"/>
    `),

  car: () => photoIcon('car'),
  moon: () => photoIcon('moon'),
  cup: () => photoIcon('cup'),
  bus: () =>
    wrap(`
      <rect x="6" y="14" width="52" height="28" rx="6" fill="#f4c95d"/>
      <rect x="12" y="20" width="12" height="10" fill="#eafcff"/>
      <rect x="28" y="20" width="12" height="10" fill="#eafcff"/>
      <rect x="44" y="20" width="8" height="10" fill="#eafcff"/>
      <rect x="6" y="38" width="52" height="8" fill="#791f1f"/>
      <circle cx="18" cy="48" r="7" fill="#2c2c2a"/>
      <circle cx="46" cy="48" r="7" fill="#2c2c2a"/>
      <circle cx="18" cy="48" r="3" fill="#b8b8b8"/>
      <circle cx="46" cy="48" r="3" fill="#b8b8b8"/>
    `),

  // Round 3 redraw against 4 user-supplied ant-clipart photos (classic
  // red ant, an "A is for Ant" card, a blue variant, a b/w silhouette).
  // Round 2 was rejected as spider/goat-like for two specific reasons the
  // references make obvious: the antennae were straight zigzag segments
  // (read as horns) instead of one smooth insect-antenna curve, and the
  // thorax circle (r=7.6) was drawn BIGGER than the head (r=6.4) -- the
  // opposite of a wasp-waist pinch, so the "waist" never read as a waist.
  // Also the legs kept diverging outward past the knee instead of bending
  // back toward the body, which is what made them look like spread/splayed
  // spider legs rather than legs supporting the body from below. Fixed
  // all three: thorax is now clearly the smallest of the three lobes
  // (head 6.4 > thorax 5.0 < abdomen 16x12.8, abdomen still the largest as
  // every reference shows), antennae are single Q-curves with no angle
  // break, and each leg's second segment bends back toward the midline
  // instead of continuing outward, so the stance reads as "legs bent under
  // the body" instead of "legs planted wide".
  // Round 3 redraw. Rejected again as an all-#2c2c2a silhouette (same black
  // as `insect`'s outline strokes and most other line-art) with legs thinner
  // than the antennae -- at button size it read as a scribble, not a bug.
  // This one gives the body a warm rust-brown fill (real ants read
  // red-brown/black in picture books, not pure ink-black) with a lighter
  // highlight patch per segment for the layered-shading convention, a much
  // bigger cartoon eye with a white catch-light, visible mandible, and
  // fewer/thicker legs so the silhouette reads as three body blobs + bent
  // legs at 150px instead of dissolving into thin lines.
  ant: () =>
    wrap(`
      <ellipse cx="43" cy="35" rx="17" ry="12.6" fill="#7a3319" stroke="#2c2c2a" stroke-width="2.6"/>
      <path d="M35 28 Q43 24 51 29 Q45 31 35 28 Z" fill="#a5502a" opacity="0.8"/>
      <circle cx="24" cy="30" r="7.4" fill="#7a3319" stroke="#2c2c2a" stroke-width="2.6"/>
      <path d="M19 26 Q24 23 29 27 Q24 28 19 26 Z" fill="#a5502a" opacity="0.8"/>
      <circle cx="11" cy="26" r="6.8" fill="#7a3319" stroke="#2c2c2a" stroke-width="2.6"/>
      <path d="M6 22 Q11 20 16 23" fill="none" stroke="#a5502a" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>
      <path d="M8 21 Q3 11 7 3" fill="none" stroke="#2c2c2a" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M14 20 Q19 10 26 5" fill="none" stroke="#2c2c2a" stroke-width="3.2" stroke-linecap="round"/>
      <circle cx="7" cy="3" r="2.2" fill="#2c2c2a"/>
      <circle cx="26" cy="5" r="2.2" fill="#2c2c2a"/>
      <path d="M4 27 L11 31 L4 33 Z" fill="#2c2c2a"/>
      <circle cx="9" cy="24" r="3.4" fill="#f5f2ea"/>
      <circle cx="8.3" cy="24" r="1.6" fill="#2c2c2a"/>
      <g stroke="#2c2c2a" stroke-width="5.2" stroke-linecap="round" fill="none">
        <path d="M20 33 L12 42 L15 53"/>
        <path d="M31 37 L33 48 L29 58"/>
        <path d="M46 40 L55 48 L53 59"/>
      </g>
    `),

  apple: () => photoIcon('apple'),
  // User: "top은 그냥 원래 이미지로 돌아가자" -- round 2's disc-over-cone
  // redesign read as a mushroom/umbrella, not a spinning top. Reverted to
  // the original triangle-body top verbatim.
  top: () =>
    wrap(`
      <polygon points="16,12 48,12 40,46 24,46" fill="#534ab7"/>
      <rect x="16" y="12" width="32" height="9" fill="#f4c95d"/>
      <rect x="16" y="26" width="32" height="6" fill="#eafcff"/>
      <polygon points="24,46 40,46 32,58" fill="#26215c"/>
      <rect x="28" y="4" width="8" height="10" rx="2" fill="#26215c"/>
    `),

  // Round 2 redraw. Round 1 kept the same "handle block + spout block"
  // skeleton and was rejected as unclear. This one leads with a much
  // thicker, larger-radius gooseneck pipe (kitchen-faucet clipart reads
  // overwhelmingly as one bold curved tube, not a thin elbow), mounted flush
  // to a wall tile so the pipe visibly emerges FROM something instead of
  // floating, with a single fat lever handle -- not rotated at an odd
  // angle -- perpendicular off the base, and an oversized water drop.
  tap: () =>
    wrap(`
      <rect x="6" y="16" width="15" height="30" rx="2.4" fill="#dfe4e8"/>
      <line x1="6" y1="24" x2="21" y2="24" stroke="#c3cad0" stroke-width="1.6"/>
      <line x1="6" y1="34" x2="21" y2="34" stroke="#c3cad0" stroke-width="1.6"/>
      <path d="M17 22 Q17 12 28 12 Q46 12 46 26 L46 38"
        fill="none" stroke="#9aa0a6" stroke-width="13" stroke-linecap="round"/>
      <path d="M17 22 Q17 12 28 12 Q46 12 46 26 L46 38"
        fill="none" stroke="#e3e8ec" stroke-width="5.5" stroke-linecap="round"/>
      <g transform="rotate(6 14 24)">
        <rect x="1" y="20" width="22" height="8.5" rx="4.2" fill="#5dd6e0" stroke="#378add" stroke-width="1.8"/>
        <circle cx="21" cy="24.2" r="5.4" fill="#5dd6e0" stroke="#378add" stroke-width="1.8"/>
      </g>
      <path d="M44 42 Q52 50 48 58 A6.5 6.5 0 0 1 36 58 Q32 50 44 42 Z" fill="#5dd6e0" stroke="#0c447c" stroke-width="2.2"/>
      <path d="M44 46 Q47 51 45 55" fill="none" stroke="#eafcff" stroke-width="1.6" stroke-linecap="round" opacity="0.7"/>
    `),

  // -- Group 1 remainder: I / P / N (chapter 2) --

  // The spilled puddle and falling drop carry the "ink" reading; the bottle
  // alone would just read as a jar at 60px.
  ink: () =>
    wrap(`
      <ellipse cx="34" cy="56" rx="20" ry="5" fill="#0c447c"/>
      <ellipse cx="14" cy="52" rx="5" ry="4" fill="#0c447c"/>
      <rect x="16" y="24" width="32" height="28" rx="6" fill="#eafcff"/>
      <path d="M16 34 H48 V46 Q48 52 42 52 H22 Q16 52 16 46 Z" fill="#0c447c"/>
      <rect x="26" y="14" width="12" height="12" fill="#eafcff"/>
      <rect x="22" y="6" width="20" height="10" rx="3" fill="#2c2c2a"/>
      <rect x="20" y="26" width="24" height="6" rx="3" fill="#b8b8b8"/>
    `),

  // Round 2 redraw. Thin light-gray brick lines (stroke 2.5, #b8b8b8) washed
  // out at button size, and the arch reused ink's exact navy (#0c447c) --
  // both flagged after a licensed reference sheet (i=igloo cell) was
  // supplied. Matched it directly: thick black outline (stroke 3.4, same
  // weight the rest of the bold-outline icon family uses), a visible grid
  // of individually-outlined brick blocks instead of overlaid arc/line
  // strokes, and a plain dark entrance (not ink's specific navy).
  igloo: () => photoIcon('igloo'),
  // A top-down winged ladybug, so it never reads as the side-on all-black
  // `ant` icon that also appears in this app.
  insect: () =>
    wrap(`
      <g stroke="#2c2c2a" stroke-width="3" stroke-linecap="round">
        <line x1="20" y1="28" x2="8" y2="22"/>
        <line x1="18" y1="38" x2="6" y2="40"/>
        <line x1="22" y1="47" x2="12" y2="55"/>
        <line x1="44" y1="28" x2="56" y2="22"/>
        <line x1="46" y1="38" x2="58" y2="40"/>
        <line x1="42" y1="47" x2="52" y2="55"/>
        <path d="M27 14 Q22 6 16 5"/>
        <path d="M37 14 Q42 6 48 5"/>
      </g>
      <circle cx="16" cy="5" r="3" fill="#2c2c2a"/>
      <circle cx="48" cy="5" r="3" fill="#2c2c2a"/>
      <circle cx="32" cy="36" r="18" fill="#e24b4a"/>
      <rect x="30.6" y="20" width="2.8" height="32" fill="#2c2c2a"/>
      <circle cx="23" cy="30" r="4" fill="#2c2c2a"/>
      <circle cx="41" cy="30" r="4" fill="#2c2c2a"/>
      <circle cx="23" cy="44" r="3.4" fill="#2c2c2a"/>
      <circle cx="41" cy="44" r="3.4" fill="#2c2c2a"/>
      <circle cx="32" cy="18" r="9" fill="#2c2c2a"/>
      <circle cx="28" cy="16" r="2" fill="#f5f2ea"/>
      <circle cx="36" cy="16" r="2" fill="#f5f2ea"/>
    `),

  // Head + two ears + a muzzle ellipse is the exact skeleton dog uses, and the
  // two share beat c6s1-r3, so the pig has to differ where a hard cutout can
  // see it: the ears flop out past the head instead of spiking up, and the
  // snout breaks the chin outline. With the snout tucked inside the head
  // circle the two silhouettes were 87% identical.
  pig: () => photoIcon('pig'),
  // Drawn on the diagonal so barrel, cap and nib all stay chunky inside the
  // square instead of shrinking to a thin vertical sliver.
  pen: () =>
    wrap(`
      <polygon points="10,55 14.5,40.5 23.2,49.2" fill="#b8b8b8"/>
      <line x1="10" y1="55" x2="18.5" y2="45" stroke="#2c2c2a" stroke-width="2.5"/>
      <polygon points="14.3,41.3 22.7,49.7 50.2,22.2 41.8,13.8" fill="#378add"/>
      <polygon points="32.7,20.7 43.3,31.3 57.3,17.3 46.7,6.7" fill="#0c447c"/>
      <polygon points="40.1,28.1 42.2,30.2 56.2,16.2 54.1,14.1" fill="#b8b8b8"/>
      <polygon points="26,29 34,37 30,41 22,33" fill="#eafcff"/>
    `),

  pot: () =>
    wrap(`
      <g stroke="#b8b8b8" stroke-width="3.5" stroke-linecap="round" fill="none">
        <path d="M24 12 Q19 8 24 3"/>
        <path d="M40 12 Q35 8 40 3"/>
      </g>
      <rect x="5" y="28" width="12" height="8" rx="4" fill="#2c2c2a"/>
      <rect x="47" y="28" width="12" height="8" rx="4" fill="#2c2c2a"/>
      <path d="M13 24 H51 L48 46 Q47 54 39 54 H25 Q17 54 16 46 Z" fill="#2c2c2a"/>
      <rect x="9" y="17" width="46" height="8" rx="4" fill="#b8b8b8"/>
      <rect x="27" y="10" width="10" height="8" rx="4" fill="#b8b8b8"/>
    `),

  // Three bowling pins and no ball: with a ball present the picture names
  // "bowling" rather than the single word being taught, while a group of
  // three makes the pin itself the subject. Each pin gets a wide light halo
  // stroke under its gray outline so the overlapping silhouettes stay
  // readable as separate objects at 60px on any button color.
  pin: () => {
    const clipId = nextId('pin-clip')
    // Local pin coords: waist at 0, top at 0, base at 54 -- placed by the
    // per-pin transform below, so one clip path serves all three.
    // The white separator stroke is 8 wide, so every placement needs 4 units
    // of viewBox margin past the body -- that is what caps ty at 13.5 for the
    // 0.86 pin (13.5 + 54*0.86 + 4 = 63.94).
    const body =
      'M0 0 C5 0 7 4 7 10 C7 16 4 18 4 22 C4 29 14 30 14 40 C14 48 11 54 8 54 L-8 54 C-11 54 -14 48 -14 40 C-14 30 -4 29 -4 22 C-4 18 -7 16 -7 10 C-7 4 -5 0 0 0 Z'
    const pin = (tx, ty, s) => `
      <g transform="translate(${tx},${ty}) scale(${s})">
        <path d="${body}" fill="none" stroke="#f5f2ea" stroke-width="${(8 / s).toFixed(2)}"/>
        <g clip-path="url(#${clipId})">
          <rect x="-15" y="-2" width="30" height="58" fill="#f5f2ea"/>
          <rect x="-15" y="19" width="30" height="5" fill="#d1332f"/>
          <rect x="-15" y="27" width="30" height="5" fill="#d1332f"/>
        </g>
        <path d="${body}" fill="none" stroke="#2c2c2a" stroke-width="${(2.4 / s).toFixed(2)}"/>
      </g>`
    return wrap(`
      <clipPath id="${clipId}"><path d="${body}"/></clipPath>
      ${pin(22, 8.5, 0.66)}
      ${pin(42, 8.5, 0.66)}
      ${pin(32, 13.5, 0.86)}
    `)
  },

  // A scoop net: the hanging mesh bag is what stops it reading as a
  // magnifying glass, which a plain mesh-filled ring does.
  net: () => {
    const clipId = nextId('net-clip')
    const bag = 'M6 20 Q9 44 20 50 H32 Q43 44 46 20 Z'
    return wrap(`
      <line x1="40" y1="30" x2="58" y2="56" stroke="#712b13" stroke-width="8" stroke-linecap="round"/>
      <clipPath id="${clipId}"><path d="${bag}"/></clipPath>
      <path d="${bag}" fill="#eafcff"/>
      <g clip-path="url(#${clipId})" stroke="#378add" stroke-width="2.6">
        <line x1="-4" y1="16" x2="34" y2="54"/>
        <line x1="6" y1="12" x2="44" y2="50"/>
        <line x1="18" y1="10" x2="56" y2="48"/>
        <line x1="30" y1="10" x2="68" y2="48"/>
        <line x1="52" y1="16" x2="14" y2="54"/>
        <line x1="42" y1="12" x2="4" y2="50"/>
        <line x1="30" y1="10" x2="-8" y2="48"/>
        <line x1="18" y1="10" x2="-20" y2="48"/>
      </g>
      <ellipse cx="26" cy="20" rx="21" ry="9" fill="none" stroke="#f4c95d" stroke-width="5"/>
    `)
  },

  // Peanut in shell: two full lobes plus a narrow waist band, so the pinch
  // reads at 60px instead of collapsing into one blob.
  nut: () =>
    wrap(`
      <g fill="#c98f4e">
        <circle cx="20" cy="30" r="15"/>
        <circle cx="45" cy="37" r="14"/>
        <polygon points="20,18 45,25 45,49 20,42"/>
      </g>
      <g stroke="#8a5a33" stroke-width="2.6" fill="none" stroke-linecap="round">
        <path d="M11 22 Q7 30 11 38"/>
        <path d="M52 30 Q56 37 52 45"/>
        <path d="M30 22 Q28 31 30 40"/>
        <path d="M36 23 Q34 32 36 41"/>
      </g>
    `),

  // Round 3: round 2's side-profile silhouette risked reading as a chili
  // pepper / abstract blob in isolation. Switched to a front-on nose --
  // the more universal "nose" pictogram shape: a bell that widens toward
  // two separate nostril wings with a shallow inward notch between them at
  // the very bottom, so the SILHOUETTE itself (not just the dark nostril
  // fills) reads as two-holes-in-a-nose rather than a smooth round bottom
  // with two dots, which could still land as eyes or a heart. Two very
  // faint cheek-line strokes well outside the nose body are the minimal
  // face anchor the brief asked for -- present enough to say "this sits on
  // a face" without drawing eyes, a mouth, or a chin. Measured a first
  // draft's hard-cutout against every existing icon afterward -- it came
  // back closest to `tie` (both a centered vertical teardrop), so this is
  // drawn shorter and noticeably WIDER (a round bulb nose, not a slim
  // wedge) specifically to sit apart from tie's narrow necktie silhouette,
  // which stays that narrow the whole way down with squared-off shoulders.
  // Round 2 (rejected). Framed the nose with eyebrows/mouth/cheeks for face
  // context. Round 3 redraw: user supplied a licensed reference sheet
  // (Jolly-style alphabet chart, Nn cell) and asked to match it directly --
  // that reference has NO face context at all, just the nose alone: a
  // simple front-view bulb, pale tan fill, thick black outline, two dark
  // oval nostrils near the bottom. Matched that exactly rather than
  // re-litigating the context question -- bolder outline (stroke 3.4 vs the
  // old 2.6) is what the reference actually leans on to read clearly alone.
  nose: () => photoIcon('nose'),
  // Head-only like `dog`, so the split has to come from silhouette and hue:
  // ears are fused spikes on one continuous outline (dog has two detached
  // triangles over a circle), the coat is cool gray instead of dog's tan, and
  // the slit pupils plus whiskers that run past the cheeks are cat-only cues.
  cat: () => photoIcon('cat'),
  // Full-body bird, so it never competes with the head-only `dog`/`cat`: the
  // red comb, gold beak and dark tail fan are the three shapes that survive
  // 60px, and the dark outline keeps the pale body off a white button.
  hen: () =>
    wrap(`
      <g stroke="#ef9f27" stroke-width="4.5" stroke-linecap="round">
        <line x1="25" y1="50" x2="25" y2="57"/>
        <line x1="37" y1="50" x2="37" y2="57"/>
        <line x1="19" y1="59" x2="31" y2="59"/>
        <line x1="31" y1="59" x2="43" y2="59"/>
      </g>
      <g fill="#2c2c2a">
        <ellipse cx="9.4" cy="31" rx="5.6" ry="13" transform="rotate(-38 9.4 31)"/>
        <ellipse cx="11" cy="23" rx="5.6" ry="13" transform="rotate(-18 11 23)"/>
        <ellipse cx="17" cy="18" rx="5" ry="11" transform="rotate(-2 17 18)"/>
      </g>
      <path d="M13 36 Q13 16 32 16 Q51 16 51 34 Q51 52 32 52 Q13 52 13 36 Z"
        fill="#f5f2ea" stroke="#2c2c2a" stroke-width="2.6"/>
      <path d="M34 15 Q36 3 42 11 Q46 1 50 12 Q55 5 56 17 Z" fill="#e24b4a"/>
      <circle cx="44" cy="23" r="12" fill="#f5f2ea" stroke="#2c2c2a" stroke-width="2.6"/>
      <polygon points="54,21 62,26 54,30" fill="#ef9f27"/>
      <ellipse cx="50" cy="34" rx="3.6" ry="5.4" fill="#e24b4a"/>
      <path d="M20 34 Q31 30 38 40 Q28 47 20 42 Z" fill="#ef9f27"/>
      <circle cx="45" cy="21" r="2.8" fill="#2c2c2a"/>
    `),

  // A plain white oval disappears on a light button and says nothing, so the
  // egg is drawn mid-crack: lifted cap, zigzag break line and a yellow yolk
  // dome are what make it read as "egg" rather than "ball" at 60px.
  egg: () =>
    wrap(`
      <path d="M13 32 L18 26 L23 32 L28 26 L32 32 L37 26 L42 32 L47 26 L51 32
          C51 47 43 58 32 58 C21 58 13 47 13 32 Z"
        fill="#f5f2ea" stroke="#2c2c2a" stroke-width="2.6" stroke-linejoin="round"/>
      <circle cx="31" cy="33" r="9" fill="#ffd43b" stroke="#ef9f27" stroke-width="2.4"/>
      <g transform="rotate(-14 32 11)">
        <path d="M13 20 L18 14 L23 20 L28 14 L32 20 L37 14 L42 20 L47 14 L51 20
            C51 9 43 2 32 2 C21 2 13 9 13 20 Z"
          fill="#f5f2ea" stroke="#2c2c2a" stroke-width="2.6" stroke-linejoin="round"/>
      </g>
    `),

  // The brim is the whole point: it spans the full 64 units so the outline
  // can never be mistaken for the tall red `cup`, and brown/gold keeps it out
  // of every other icon's palette.
  hat: () => photoIcon('hat'),
  // One even-odd path: the bow's hole is a real hole, so a single outline
  // wraps the whole key and no <mask> id can collide. Drawn flat-horizontal
  // to stay clear of the diagonal `pen`, with teeth 7 units wide so they
  // still separate at 60px.
  key: () => photoIcon('key'),
  // Ears wider than the head plus a hanging trunk: the two shapes that hold
  // up at 60px. Neutral gray, not the cool gray of `cat`, and nothing about
  // the outline invites comparison with the head-only `pig`.
  elephant: () => photoIcon('elephant'),
  // Fingers are separate fills with 3-unit background gaps instead of one
  // stroked outline -- at 60px a stroked gap fills in and the fingers fuse
  // into a mitten. The green cuff anchors the wrist on any button color.
  hand: () => photoIcon('hand'),
  // Crown-dominant so it can't trade places with `nose`, the app's other
  // face icon: gold spikes over the whole top third, a red band, and a gray
  // beard that `nose` has no equivalent of.
  king: () =>
    wrap(`
      <circle cx="32" cy="37" r="16" fill="#f5d6b0"/>
      <path d="M16 38 Q15 58 32 58 Q49 58 48 38 Q40 46 32 46 Q24 46 16 38 Z" fill="#b8b8b8"/>
      <path d="M26 40 Q32 45 38 40" fill="none" stroke="#b5573c" stroke-width="3" stroke-linecap="round"/>
      <circle cx="25" cy="34" r="2.8" fill="#2c2c2a"/>
      <circle cx="39" cy="34" r="2.8" fill="#2c2c2a"/>
      <polygon points="13,29 13,7 22,17 32,4 42,17 51,7 51,29" fill="#ffd43b"/>
      <rect x="12" y="25" width="40" height="8" fill="#e24b4a"/>
      <circle cx="22" cy="29" r="2.4" fill="#5dd6e0"/>
      <circle cx="32" cy="29" r="2.4" fill="#5dd6e0"/>
      <circle cx="42" cy="29" r="2.4" fill="#5dd6e0"/>
    `),

  // Candles and a dripping frosting edge on a plate -- a plain layered slab
  // reads as a box, and the lid-and-handles silhouette of `pot` shares none
  // of these three cues.
  cake: () => photoIcon('cake'),
  // Profile head with ears and a mane, so the front-facing round `dog` face
  // never comes close: the long muzzle is the whole silhouette.
  horse: () =>
    wrap(`
      <path d="M7 37 L18 22 Q23 14 31 14 L25 1 L36 11 L43 1 L47 17
          Q52 21 54 30 L58 58 L36 58 Q25 54 19 44 L7 41 Z"
        fill="#8a5a33"/>
      <path d="M45 14 L52 26 L58 56 L48 56 L45 30 L38 16 Z" fill="#2c2c2a"/>
      <polygon points="9,37 18,26 22,29 13,40" fill="#f5f2ea"/>
      <circle cx="27" cy="27" r="3" fill="#2c2c2a"/>
      <ellipse cx="12" cy="34" rx="2.2" ry="1.8" fill="#2c2c2a"/>
    `),

  // Four solid quadrants make the spars readable without drawing hairlines,
  // and the bowed tail is what separates the diamond from the `star`.
  kite: () => photoIcon('kite'),
  // The numeral itself, on a red round badge. An earlier version drew ten
  // dots to avoid putting a digit glyph next to letter tiles, but this app
  // never teaches numbers, so there is nothing for "10" to be confused with,
  // and the numeral is far more immediate for a 5-year-old. The round red
  // badge is what keeps it visually apart from `letterTile`'s blue square.
  ten: () =>
    wrap(`
      <circle cx="32" cy="32" r="26" fill="#e24b4a"/>
      <circle cx="32" cy="32" r="26" fill="none" stroke="#d1332f" stroke-width="3"/>
      <circle cx="32" cy="32" r="20" fill="none" stroke="#f5f2ea" stroke-width="2" opacity="0.5"/>
      <text x="32" y="45" text-anchor="middle" font-size="33" font-weight="800" fill="#fff">10</text>
    `),

  // Side view: the tall headboard on the left and the low footboard on the
  // right give the asymmetric outline a bed needs, and the green blanket
  // keeps the white sheet from washing out on a light button.
  bed: () =>
    wrap(`
      <rect x="4" y="12" width="9" height="42" rx="3" fill="#712b13"/>
      <rect x="54" y="28" width="8" height="26" rx="3" fill="#712b13"/>
      <rect x="8" y="31" width="50" height="11" fill="#f5f2ea" stroke="#b8b8b8" stroke-width="2"/>
      <rect x="26" y="28" width="32" height="14" fill="#3b9922"/>
      <rect x="11" y="22" width="16" height="10" rx="5" fill="#f5f2ea" stroke="#b8b8b8" stroke-width="2"/>
      <rect x="6" y="42" width="54" height="7" fill="#8a5a33"/>
      <rect x="9" y="48" width="7" height="10" fill="#712b13"/>
      <rect x="50" y="48" width="7" height="10" fill="#712b13"/>
    `),

  // -- Group 3 additions: R (chapter 4), G / O / U (chapter 5) --

  // Side profile with a pointed snout, not the front-facing round `dog`/`cat`
  // heads: gray coat (not dog's tan or cat's cool blue-gray) plus a long bare
  // tail are the two cues that separate rat from every other animal icon.
  // The tail is drawn first and rooted well inside the body ellipse (same
  // trick as `ant`'s legs) so the body fill covers the seam and it reads as
  // one continuous curl instead of a detached blob.
  rat: () => photoIcon('rat'),
  // A gold band drawn as a circle-with-a-hole (mask, like `moon`) so it can
  // never be read as the disc-shaped `key` head, topped with a mounted gem --
  // the gem is the cue that separates it from `moon`'s bare crescent.
  ring: () => photoIcon('ring'),
  // A wrapped box with a knotted bow, not the flat unwrapped `gum` strip --
  // the bow loops and the vertical+horizontal ribbon cross are the shapes
  // that make it read as "present" rather than "box" at 60px.
  gift: () => photoIcon('gift'),
  // A stick of gum sliding out of a torn wrapper. Two earlier drafts failed:
  // a blue wrapped stick was an unreadable object, and bare pink slabs read
  // as an eraser. The wrapper is what names the object and the pink is what
  // names it as gum, so both have to be visible at once -- hence the zigzag
  // torn edge with the gum emerging past it. Slabs, never spheres: gumballs
  // would collide with `ball`. No bow and a diagonal stick shape keep it
  // clear of `gift`'s upright knotted box.
  gum: () =>
    wrap(`
      <g transform="rotate(-20 32 32)">
        <rect x="16" y="23" width="42" height="18" rx="5" fill="#f0a0b4"/>
        <rect x="24" y="26" width="32" height="5" rx="2.5" fill="#f9d3de"/>
        <path d="M6 21 H32 L27 26 L32 32 L27 37 L32 43 H6 Q2 43 2 39 V25 Q2 21 6 21 Z"
          fill="#dfe4e8" stroke="#b8b8b8" stroke-width="1.2"/>
        <rect x="3" y="28" width="26" height="8" fill="#378add"/>
      </g>
    `),

  // A real octopus has eight arms, so all eight are drawn. Two things make
  // them survive 60px. Arm tips are spread on an even arc by computation --
  // hand-placed arms crowded, and the inner ones ended up hidden underneath
  // their neighbours. And the shade alternates arm by arm, so neighbours stay
  // separate by color even where their strokes nearly touch. Cool purple
  // keeps it off every warm-toned animal icon already in the set.
  octopus: () => photoIcon('octopus'),
  // Same round-fruit build as `apple` (so the /o/ vs /a/ family reads as
  // fruit either way) but orange, not red, with a dimpled rind and a stubby
  // navel instead of apple's stem+leaf, so the two can never be confused.
  orange: () => photoIcon('orange'),
  // A domed canopy (round top, scalloped bottom edge) on a straight pole --
  // the opposite silhouette from `top`'s pointed triangle spinning toy, so
  // the two never compete even though both are drawn in cool/warm blocks.
  umbrella: () => photoIcon('umbrella'),
  // A fluffy ring of overlapping fur tufts (computed, alternating radii) is
  // what separates lion from `dog`/`horse` -- a first draft used sharp
  // triangular spikes here (same technique as `shoutBurst`) and it rendered
  // as a smiling `sun`, since a thin radiating halo around a plain circle is
  // exactly what makes `sun` legible. Round tufts plus ear peaks read as fur
  // instead of rays, and the face keeps eyes/nose/mouth that `sun` has none of.
  lion: () => {
    const cx = 32
    const cy = 34
    const tufts = 16
    const rInner = 19
    let mane = ''
    for (let i = 0; i < tufts; i++) {
      const a = (i / tufts) * Math.PI * 2
      const rad = i % 2 === 0 ? 9.5 : 7.5
      const x = (cx + Math.cos(a) * rInner).toFixed(1)
      const y = (cy + Math.sin(a) * rInner).toFixed(1)
      mane += `<circle cx="${x}" cy="${y}" r="${rad}" fill="#a9611f"/>`
    }
    return wrap(`
      ${mane}
      <circle cx="${cx}" cy="${cy}" r="17" fill="#f4c95d"/>
      <polygon points="19,20 25,7 31,21" fill="#a9611f"/>
      <polygon points="45,20 39,7 33,21" fill="#a9611f"/>
      <circle cx="24" cy="31" r="2.6" fill="#2c2c2a"/>
      <circle cx="40" cy="31" r="2.6" fill="#2c2c2a"/>
      <ellipse cx="32" cy="39" rx="4" ry="3" fill="#712b13"/>
      <path d="M28 42 Q32 46 36 42" fill="none" stroke="#712b13" stroke-width="2" stroke-linecap="round"/>
    `)
  },

  // One continuous limb: the thigh and shin are two overlapping strokes of
  // the SAME color, so the knee bend has no seam -- an earlier version built
  // it from a rect, a circle joint and an offset rect and read as a broken
  // leg. The thigh stroke is wider than the shin to give a natural taper.
  // Shorts and a shoe (not five fingers) keep it clear of `hand`.
  leg: () =>
    wrap(`
      <g fill="none" stroke="#e0a273" stroke-linecap="round">
        <path d="M31 13 L32 31" stroke-width="18"/>
        <path d="M32 28 Q32 39 35 46" stroke-width="13"/>
      </g>
      <rect x="19" y="2" width="24" height="17" rx="5" fill="#378add"/>
      <path d="M29 43 Q35 45 41 43 L41 48 Q35 50 29 48 Z" fill="#f5f2ea"/>
      <path d="M29 46 H38 Q42 46 44 51 L53 55 Q56 57 53 59 H32 Q28 59 28 54 Z" fill="#2c2c2a"/>
      <rect x="27" y="57" width="29" height="3.4" rx="1.7" fill="#b8b8b8"/>
    `),

  // Round 2 redraw. Round 1 kept an ellipse-body-plus-triangle-tail skeleton
  // and only added surface texture, which read as the same silhouette.
  // This one changes the outline itself: a streamlined torpedo body (single
  // curved path, pointed at the mouth, tapering to a narrow peduncle before
  // the tail) instead of a plain oval, a large forked tail with a concave
  // notch, a pectoral side fin plus gill lines near the head, and scale
  // arcs covering a visibly larger share of the body -- the fins/scales/
  // streamlined-taper combination clipart references consistently lead
  // with, which a bare ellipse body doesn't carry on its own.
  // User: "fish는 상어 지느러미 같이 생긴 등 지느러미만 빼면 첫 번째
  // 이미지(원본)로 해도 될 것 같아" -- reverted to the original body
  // verbatim, only the dorsal fin changed: was a sharp straight-edged
  // triangle (read as a shark fin), now a soft curved fin (rounded
  // sides meeting at a blunt tip, no straight shark-tooth edges).
  // Round 3 redraw (rejected). The torpedo-body-plus-fins-and-scales design
  // still read ambiguous at button size -- too many small strokes (gill
  // lines, scale arcs, a separate pectoral fin) collapse into visual noise
  // once the icon is scaled down and viewed briefly, and the goldfish-orange
  // body sits close enough to `orange`'s fruit-orange that a glancing read
  // could pull toward "round orange thing" instead of "fish."
  // Round 4 redraw (rejected). Kept the forked-tail-plus-plain-body
  // silhouette (that part stuck) but two things were off: the dorsal fin
  // sat right next to the eye/head, at the body's very top edge near x22-33
  // -- close enough to the head that it read as a second head-fin rather
  // than a fin on the BACK -- and the coral/orange palette was asked to
  // revert to blue (this project's classic fish color, and clearly apart
  // from `orange`'s fruit-orange with no hue-lane ambiguity to manage).
  // Round 5 redraw. Same silhouette (forked tail, plain rounded body, no
  // scales/gills/pectoral fin), fin moved from the head-adjacent top-left
  // to the actual mid-back (centered over the body's own horizontal
  // midpoint, well clear of both the head/eye on the left and the tail
  // root on the right) so it reads as "fin on the back," not "second ear."
  // Blue restored: deep teal-blue body, a lighter sky-blue belly stripe for
  // the classic two-tone fish read, navy fin/tail for contrast.
  fish: () => photoIcon('fish'),
  // Chose a desk fan (wire-cage ring + pinwheel blades + stand) over a
  // folding hand fan: the circular cage-and-blade silhouette is a more
  // universal "fan" reading for a 5-year-old than a pleated paper wedge,
  // which risks reading as a peacock tail, and its round-cage-on-a-stand
  // shape can't trade places with `top`'s solid triangle or `kite`'s
  // diamond even at 60px.
  fan: () => {
    // Blades are one shape rotated by exact thirds, so the spacing is even
    // by construction (hand-placed paths were what made it look lopsided),
    // and all three sweep the same way, which reads as rotation.
    const blade = 'M32 30 C29 16 33 7 42 6 C47 13 43 25 32 30 Z'
    const blades = [0, 120, 240]
      .map(a => `<path d="${blade}" fill="#f4c95d" transform="rotate(${a} 32 30)"/>`)
      .join('')
    return wrap(`
      <rect x="26" y="46" width="12" height="14" rx="3" fill="#b8b8b8"/>
      <rect x="18" y="58" width="28" height="5" rx="2.5" fill="#b8b8b8"/>
      <circle cx="32" cy="30" r="26" fill="none" stroke="#b8b8b8" stroke-width="4"/>
      ${blades}
      <circle cx="32" cy="30" r="5" fill="#712b13"/>
    `)
  },

  // Basketball: heavy black rim plus the canonical seam set -- one straight
  // vertical, one straight horizontal, and two side arcs bowing toward the
  // centre. The seams are deliberately thick; thin ones vanished at 60px and
  // left a plain orange disc that could pass for `orange`, which has no
  // black anywhere and carries a leaf and rind dots instead.
  ball: () => photoIcon('ball'),
  // An OPEN corrugated box in three-quarter view: four flaps folded outward,
  // a dark interior through the mouth, and two front faces at different
  // shades for depth. The open mouth is what makes it read as "box" at a
  // glance, and it also pushes it further from `gift` (closed box with a
  // bow) and from `pot` (lidded vessel with handles).
  box: () =>
    wrap(`
      <g stroke="#8a5a33" stroke-width="1.3" stroke-linejoin="round">
        <polygon points="9,31 32,21 27,7 4,17" fill="#d9a96b"/>
        <polygon points="32,21 55,31 60,17 37,7" fill="#d9a96b"/>
        <polygon points="9,31 32,41 29,52 3,42" fill="#c9975c"/>
        <polygon points="32,41 55,31 61,42 35,52" fill="#c9975c"/>
      </g>
      <polygon points="9,31 32,21 55,31 32,41" fill="#6b4423"/>
      <polygon points="9,31 32,41 32,57 9,47" fill="#a87a45"/>
      <polygon points="32,41 55,31 55,47 32,57" fill="#c9975c"/>
    `),

  // -- Chapter 4 gaps: M (man, mat, map) and D (duck, door) --

  // Full body, because the app's other human icons are heads only (`king`,
  // `nose`) -- silhouette alone separates them, so no hue or feature has to
  // do the work. White shirt + red tie + dark trousers reads as an adult man
  // rather than a child, and the white shirt carries a gray outline so it
  // does not wash out on the cream button.
  man: () =>
    wrap(`
      <circle cx="32" cy="15" r="9" fill="#f5d6b0"/>
      <path d="M22.6 13 Q22.6 3.5 32 3.5 Q41.4 3.5 41.4 13 Q36.5 9 32 9 Q27.5 9 22.6 13 Z"
        fill="#2c2c2a"/>
      <circle cx="28.5" cy="15" r="1.7" fill="#2c2c2a"/>
      <circle cx="35.5" cy="15" r="1.7" fill="#2c2c2a"/>
      <path d="M27 19 Q32 18 37 19 Q35 22 32 21 Q29 22 27 19 Z" fill="#2c2c2a"/>
      <g fill="#f5f2ea" stroke="#b8b8b8" stroke-width="1.6">
        <rect x="14.5" y="25" width="6.5" height="19" rx="3.2"/>
        <rect x="43" y="25" width="6.5" height="19" rx="3.2"/>
        <rect x="21" y="24" width="22" height="19" rx="3"/>
      </g>
      <polygon points="32,24 35,28 32,39 29,28" fill="#e24b4a"/>
      <circle cx="17.7" cy="46" r="3.4" fill="#f5d6b0"/>
      <circle cx="46.3" cy="46" r="3.4" fill="#f5d6b0"/>
      <rect x="20" y="41" width="24" height="3.4" fill="#2c2c2a"/>
      <g fill="#0c447c">
        <rect x="21.5" y="43" width="9" height="14"/>
        <rect x="33.5" y="43" width="9" height="14"/>
      </g>
      <g fill="#2c2c2a">
        <rect x="19.5" y="55" width="12" height="4.6" rx="2.3"/>
        <rect x="32.5" y="55" width="12" height="4.6" rx="2.3"/>
      </g>
    `),

  // Flashcard-style redraw, take two: a straight-on top-down rug instead of
  // the old diamond-perspective outline (the earlier isometric angle was
  // one of the harder-to-identify icons). The first redraw of this attempt
  // used straight evenly-spaced pin-like fringe lines around a nested
  // rectangle-in-rectangle border, and on-screen review caught that the
  // whole silhouette read as a DIP computer chip, not a rug -- exactly the
  // failure mode this round is supposed to fix. The rebuild replaces the
  // straight pins with a scalloped/looped fringe (an arc-based path, the
  // shape a tassel actually makes) and swaps the nested-box border for a
  // single frame plus a row of diamond motifs, which is a real woven-rug
  // pattern with no chip-package reading. Rounded corners also work against
  // the chip silhouette, which is always square. Deliberately cool
  // indigo/cyan while `map` is warm gold parchment -- the two /m/ pictures
  // can appear in the same multiselect.
  mat: () => {
    const fringe = (y, dir) => {
      let d = `M8 ${y}`
      for (let i = 0; i < 10; i++) {
        const x2 = (8 + (i + 1) * 4.8).toFixed(1)
        d += ` A2.4 2.4 0 0 ${dir} ${x2} ${y}`
      }
      return d
    }
    return wrap(`
      <path d="${fringe(16, 0)}" fill="none" stroke="#26215c" stroke-width="2.2"/>
      <path d="${fringe(48, 1)}" fill="none" stroke="#26215c" stroke-width="2.2"/>
      <rect x="8" y="16" width="48" height="32" rx="4" fill="#534ab7"/>
      <rect x="8" y="16" width="48" height="32" rx="4" fill="none" stroke="#26215c" stroke-width="2.6"/>
      <rect x="13" y="21" width="38" height="22" rx="2" fill="none" stroke="#5dd6e0" stroke-width="2"/>
      <g fill="#5dd6e0">
        <polygon points="20,26 25,32 20,38 15,32"/>
        <polygon points="32,26 37,32 32,38 27,32"/>
        <polygon points="44,26 49,32 44,38 39,32"/>
      </g>
    `)
  },

  // Treasure map: torn parchment edge, a green island, a dashed route and a
  // planted flag. The flag replaces the conventional X mark on purpose -- an
  // X inside a phonics app is a letter, and this app must never invite a
  // picture to be read as one.
  map: () =>
    wrap(`
      <path d="M5 11 Q11 8 17 11 Q24 8 32 10 Q40 8 47 11 Q54 8 59 11
               Q57 20 59 29 Q57 39 59 52 Q53 55 47 52 Q40 55 32 53
               Q24 55 17 52 Q10 55 5 52 Q7 39 5 29 Q7 20 5 11 Z"
        fill="#f4c95d" stroke="#c98f4e" stroke-width="2.2" stroke-linejoin="round"/>
      <path d="M16 27 Q24 19 34 23 Q45 27 43 35 Q39 46 28 44 Q16 42 16 34 Z" fill="#3b9922"/>
      <g fill="none" stroke="#0c447c" stroke-width="2" stroke-linecap="round">
        <path d="M11 45 Q17 49 23 45"/>
        <path d="M45 17 Q50 21 55 17"/>
      </g>
      <path d="M13 46 Q20 35 27 34 Q35 33 40 25" fill="none" stroke="#d1332f"
        stroke-width="2.8" stroke-linecap="round" stroke-dasharray="1.4 4.4"/>
      <line x1="41" y1="25" x2="41" y2="13" stroke="#2c2c2a" stroke-width="2.2"/>
      <polygon points="41,13 52,16.5 41,20" fill="#e24b4a"/>
    `),

  // A bath-toy duck, not a realistic one: `hen` already owns the "standing
  // bird with legs, comb and tail fan" silhouette, so this is deliberately
  // the opposite -- one smooth floating oval, an oversized round head, a
  // flat orange bill, no legs at all, and water lines underneath.
  duck: () => photoIcon('duck'),
  // Standing ajar, hinged on the right. The gap is filled with pale daylight
  // rather than a dark room on purpose: a dark opening is invisible in
  // silhouette, so the whole icon flattened into a plain black rectangle.
  // Light puts a real hole in the outline, and the leaf's near edge is drawn
  // taller than the frame so it overhangs top and bottom -- between the hole
  // and the overhang, nothing about the shape can pass for `box` (wide,
  // isometric, flaps out).
  door: () =>
    wrap(`
      <rect x="12" y="5" width="42" height="56" fill="#8a5a33"/>
      <rect x="17" y="10" width="32" height="51" fill="#eafcff"/>
      <g fill="#b8b8b8">
        <rect x="46" y="18" width="4.5" height="6"/>
        <rect x="46" y="45" width="4.5" height="6"/>
      </g>
      <polygon points="49,12 49,58 27,62 27,4" fill="#a9611f" stroke="#712b13" stroke-width="2"/>
      <g fill="#8a5a33" stroke="#712b13" stroke-width="1.6">
        <polygon points="31,12 45,16 45,30 31,28"/>
        <polygon points="31,37 45,36 45,50 31,53"/>
      </g>
      <circle cx="31.5" cy="33" r="3.8" fill="#f4c95d" stroke="#ef9f27" stroke-width="1.4"/>
      <rect x="9" y="60" width="48" height="4" fill="#712b13"/>
    `),

  // -- Chapter 7: AI (rain, train, aim), J (jam, jug), OA (boat, coat) --

  // Cloud above, three falling drops below, with a clear band of empty space
  // between them -- the gap is what reads as "falling" at 150px. Cyan drops
  // over a navy outline instead of plain blue fill, so they survive both the
  // cream button and a saturated blue one; `umbrella` keeps the canopy-and-
  // pole silhouette, so the two weather icons never converge.
  rain: () => photoIcon('rain'),
  // A steam locomotive, because `bus` and `car` already own the plain
  // box-on-two-wheels reading. Three cues do the separating and all three
  // survive 150px: the funnel with white smoke puffs floating clear above
  // the body, three wheels of two sizes instead of two matched ones, and the
  // rail under them. Wheels reuse the dark tyre + gray hub of `bus`/`car` so
  // the vehicle family still looks drawn by one hand.
  train: () =>
    wrap(`
      <g fill="#f5f2ea" stroke="#b8b8b8" stroke-width="1.6">
        <circle cx="13" cy="9" r="5.4"/>
        <circle cx="24" cy="5.4" r="4.4"/>
        <circle cx="34" cy="4.6" r="3.4"/>
      </g>
      <rect x="7" y="14" width="14" height="4" rx="2" fill="#2c2c2a"/>
      <rect x="9" y="17" width="10" height="10" fill="#2c2c2a"/>
      <rect x="34" y="10" width="24" height="5" rx="2" fill="#791f1f"/>
      <rect x="36" y="14" width="20" height="26" rx="3" fill="#d1332f"/>
      <rect x="40" y="18" width="12" height="11" rx="2" fill="#eafcff"/>
      <rect x="5" y="26" width="33" height="15" rx="7" fill="#e24b4a"/>
      <circle cx="9" cy="33.5" r="4.6" fill="#ffd43b" stroke="#ef9f27" stroke-width="1.6"/>
      <rect x="3" y="40" width="56" height="6" rx="2" fill="#2c2c2a"/>
      <polygon points="2,46 9,40 9,54" fill="#791f1f"/>
      <g fill="#2c2c2a">
        <circle cx="22" cy="50" r="8"/>
        <circle cx="42" cy="50" r="6"/>
        <circle cx="53" cy="50" r="6"/>
      </g>
      <g fill="#b8b8b8">
        <circle cx="22" cy="50" r="3.2"/>
        <circle cx="42" cy="50" r="2.6"/>
        <circle cx="53" cy="50" r="2.6"/>
      </g>
      <rect x="0" y="58" width="64" height="3.4" fill="#8a5a33"/>
    `),

  // Archery target with an arrow planted in the bullseye. The arrow is not
  // decoration: a bare ring stack is just a disc and would sit next to `ten`
  // (red badge) and `ball` (orange disc). The fletching is deliberately
  // oversized -- with small fins the hard-cutout silhouette was a disc on a
  // thin diagonal handle, which is exactly `net`'s outline; two long swept
  // fins turn the tail into a wide wedge instead. In color the two never
  // meet (red ring stack + green feathers vs. a cyan mesh scoop on gold).
  // This is the one abstract word in the set -- see the note in the report.
  aim: () =>
    wrap(`
      <circle cx="39" cy="25" r="20" fill="#f5f2ea" stroke="#2c2c2a" stroke-width="2.6"/>
      <circle cx="39" cy="25" r="15" fill="#e24b4a"/>
      <circle cx="39" cy="25" r="10" fill="#f5f2ea"/>
      <circle cx="39" cy="25" r="5" fill="#e24b4a"/>
      <line x1="5" y1="59" x2="40" y2="24" stroke="#712b13" stroke-width="4" stroke-linecap="round"/>
      <g fill="#3b9922" stroke="#256614" stroke-width="1.2" stroke-linejoin="round">
        <polygon points="5,59 19,45 6.3,46.3"/>
        <polygon points="5,59 19,45 17.7,57.7"/>
      </g>
      <polygon points="43,21 39.5,31.5 32.5,24.5" fill="#2c2c2a"/>
    `),

  // Jam jar. Two things name it: dark red preserve filling a clear jar (not
  // a metal pot, not a navy ink bottle) and the checked cloth cap tied with
  // string, which is the universal "homemade jam" shorthand. The cap is
  // deliberately wider than the jar so the outline is top-heavy -- `ink` is
  // a narrow-necked bottle sitting in a puddle, the opposite profile.
  jam: () => {
    const clipId = nextId('jam-clip')
    const capId = nextId('jam-cap')
    const jar = 'M15 22 H49 V50 Q49 56 43 56 H21 Q15 56 15 50 Z'
    const cap = 'M13 22 Q13 8 32 8 Q51 8 51 22 Z'
    return wrap(`
      <clipPath id="${clipId}"><path d="${jar}"/></clipPath>
      <path d="${jar}" fill="#eafcff"/>
      <g clip-path="url(#${clipId})">
        <rect x="13" y="30" width="38" height="28" fill="#d1332f"/>
        <rect x="13" y="30" width="38" height="4" fill="#791f1f"/>
        <rect x="18" y="34" width="4" height="22" fill="#e24b4a"/>
      </g>
      <path d="${jar}" fill="none" stroke="#2c2c2a" stroke-width="2.6" stroke-linejoin="round"/>
      <rect x="20" y="36" width="24" height="14" rx="2" fill="#f5f2ea" stroke="#b8b8b8" stroke-width="1.4"/>
      <path d="M27.6 40 Q32 38.8 36.4 40 Q35.6 48 32 49 Q28.4 48 27.6 40 Z" fill="#e24b4a"/>
      <path d="M27 39.6 Q32 37 37 39.6 Q32 41.2 27 39.6 Z" fill="#3b9922"/>
      <g fill="#791f1f">
        <circle cx="30.4" cy="42.6" r="0.8"/>
        <circle cx="33.6" cy="43.6" r="0.8"/>
        <circle cx="32" cy="46" r="0.8"/>
      </g>
      <clipPath id="${capId}"><path d="${cap}"/></clipPath>
      <path d="${cap}" fill="#f4c95d"/>
      <g clip-path="url(#${capId})" fill="#ef9f27">
        <rect x="13" y="8" width="7" height="7"/>
        <rect x="27" y="8" width="7" height="7"/>
        <rect x="41" y="8" width="7" height="7"/>
        <rect x="6" y="15" width="7" height="7"/>
        <rect x="20" y="15" width="7" height="7"/>
        <rect x="34" y="15" width="7" height="7"/>
        <rect x="48" y="15" width="7" height="7"/>
      </g>
      <path d="${cap}" fill="none" stroke="#2c2c2a" stroke-width="2.2" stroke-linejoin="round"/>
      <rect x="11" y="19" width="42" height="5.4" rx="2.7" fill="#3b9922"/>
    `)
  },

  // Round 2 redraw. Round 1's body was closer to a tall vase than a jug and
  // was rejected; the fix is a genuinely bulbous belly (the widest point is
  // now well below the shoulder, not a near-cylinder) with a narrow neck
  // and an asymmetric pinched pour-spout at the rim -- both cues real
  // pitcher/jug clipart leads with. The handle is drawn as a single closed
  // band that traces its own outer edge down and its own inner edge back up
  // (same one-path-with-a-real-hole technique the `key` icon uses for its
  // bow), so the loop you'd hook a finger through is actual background,
  // not just a paler fill -- round 1's handle had no such hole.
  jug: () => {
    const clipId = nextId('jug-clip')
    const body =
      'M22 8 L18 16 Q10 22 8 32 Q6 42 10 50 Q14 58 32 58 Q50 58 52 46 Q54 34 46 24 Q40 18 38 8 Z'
    const handle = 'M46 20 Q60 22 60 34 Q60 46 48 49 L47 44 Q56 42 56 34 Q56 26 45 24 Z'
    return wrap(`
      <path d="${handle}" fill="#256614"/>
      <path d="${handle}" fill="none" stroke="#1c4d10" stroke-width="1.2"/>
      <clipPath id="${clipId}"><path d="${body}"/></clipPath>
      <path d="${body}" fill="#3b9922"/>
      <g clip-path="url(#${clipId})">
        <path d="M6 42 Q10 54 32 56 Q50 54 52 44 Q48 54 32 55 Q12 54 8 40 Z" fill="#256614"/>
        <path d="M14 14 Q9 24 8 34" fill="none" stroke="#5fce3a" stroke-width="3.4" stroke-linecap="round" opacity="0.65"/>
        <ellipse cx="34" cy="34" rx="24" ry="16" fill="#ffffff" opacity="0.08"/>
      </g>
      <path d="${body}" fill="none" stroke="#1c4d10" stroke-width="2.6" stroke-linejoin="round"/>
      <path d="M18 16 Q24 10 30 12 Q26 16 22 20 Z" fill="#3b9922" stroke="#1c4d10" stroke-width="2" stroke-linejoin="round"/>
      <ellipse cx="30" cy="9" rx="9" ry="3.4" fill="#eafcff" stroke="#1c4d10" stroke-width="2"/>
    `)
  },

  // Sailboat: two triangular sails over a trapezoid hull, on water. Nothing
  // about it can reach `bus`/`car` (no wheels, no windows) or `fish` (the
  // blue oval body) -- the mast plus sail triangles dominate the outline,
  // and the navy wave line is the second "this floats" cue after the hull.
  boat: () => photoIcon('boat'),
  // A belted coat, front on. The sleeves stop 11 units short of the hem, so
  // the outline carries a notch on each side -- that pair of notches is what
  // reads as "two sleeves plus a body" instead of the shapeless blob a
  // one-piece garment outline collapses into. The belt with a buckle names it
  // as outerwear rather than a shirt, and it sits at the waist: an earlier
  // draft put it at chest height with a big white collar and the whole thing
  // read as a life vest. Sleeves point down, never out, so the silhouette
  // never resolves into a T shape.
  coat: () =>
    wrap(`
      <path d="M25 11 L17 16 L8 30 L8 44 L18 44 L18 60 L46 60 L46 44 L56 44 L56 30 L47 16 L39 11 Z"
        fill="#e24b4a" stroke="#2c2c2a" stroke-width="2.4" stroke-linejoin="round"/>
      <g fill="#791f1f">
        <rect x="8" y="38" width="10" height="6"/>
        <rect x="46" y="38" width="10" height="6"/>
        <rect x="30.4" y="24" width="3.2" height="36"/>
        <rect x="20" y="50" width="9" height="3.6" rx="1.2"/>
        <rect x="35" y="50" width="9" height="3.6" rx="1.2"/>
      </g>
      <rect x="18" y="35" width="28" height="5.6" fill="#712b13"/>
      <rect x="28.4" y="33.6" width="7.2" height="8.4" rx="1.6" fill="#f4c95d" stroke="#ef9f27" stroke-width="1.4"/>
      <g fill="#f4c95d" stroke="#ef9f27" stroke-width="1.2">
        <circle cx="32" cy="28" r="2.8"/>
        <circle cx="32" cy="46" r="2.8"/>
        <circle cx="32" cy="56" r="2.8"/>
      </g>
      <path d="M25 11 H39 L32 24 Z" fill="#f5f2ea" stroke="#2c2c2a" stroke-width="2" stroke-linejoin="round"/>
    `),

  // -- Chapter 8: IE (tie, pie, fries), EE (bee, tree, feet), OR (fork, corn) --

  // A necktie: knot plus blade, and nothing else. A first draft added an open
  // shirt collar behind the knot and the hard cutout was a wide flat-topped
  // bar over a narrow tapering stem -- a letter T, on the icon for the word
  // TIE. The collar is gone and the reading is carried instead by the sharp
  // step from the 20-wide knot to the 11-wide blade neck: `top` is the other
  // narrow shape that tapers to a point, and its outline narrows
  // monotonically with no such shoulder, while `leg` and `sock` both end in
  // a foot jutting sideways where this ends in a centred V. Navy with gold
  // stripes stays clear of the red `coat` and of `man`'s red tie.
  tie: () => {
    const clipId = nextId('tie-clip')
    const knot = 'M24 8 Q32 5.5 40 8 L42 25 L22 25 Z'
    const blade = 'M26.5 25 L37.5 25 L42 48 L32 60.5 L22 48 Z'
    return wrap(`
      <path d="${blade}" fill="#0c447c"/>
      <path d="${knot}" fill="#0c447c"/>
      <clipPath id="${clipId}"><path d="${knot}"/><path d="${blade}"/></clipPath>
      <g clip-path="url(#${clipId})" stroke="#f4c95d" stroke-width="4.6">
        <line x1="12" y1="22" x2="44" y2="6"/>
        <line x1="12" y1="34" x2="44" y2="18"/>
        <line x1="12" y1="46" x2="44" y2="30"/>
        <line x1="14" y1="58" x2="46" y2="42"/>
        <line x1="20" y1="70" x2="52" y2="54"/>
      </g>
      <path d="${blade}" fill="none" stroke="#2c2c2a" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="${knot}" fill="none" stroke="#2c2c2a" stroke-width="2.4" stroke-linejoin="round"/>
    `)
  },

  // Round 2 (rejected). Lattice pie in a dish -- too many stacked shapes
  // (dish, crimp bumps, lattice bands, clip path) read as visual noise at
  // button size. User supplied a licensed reference sheet (ie=pie cell) and
  // asked to match it: a single plain domed pie, no dish, no lattice --
  // just a round golden-brown crust with a few curved texture lines across
  // the top (the crimped-edge/vent-slit look real pie photos show), bold
  // black outline. Kept away from `cake` the same way as before (wide/
  // shallow oval vs. cake's tall tiers), just with far fewer shapes.
  pie: () => photoIcon('pie'),
  // The third IE picture. `lie` was the obvious candidate and was rejected --
  // see the report: it is a verb, and a figure lying down reads as "sleep",
  // which lands on `bed`. Fries are a concrete object a Korean 5-year-old
  // names instantly, and `ie` is both the spelling and the /ai/ sound. The
  // carton is red on purpose: the only other yellow food in the set is
  // `corn`, which this can share a board with (IE answer vs OR distractor),
  // so the two must not both read as "yellow lump". Two details are there to
  // keep the cutout away from `hand`, which is also a splayed set of digits
  // over a body: the tips are square-cut (rx 0.8, not `hand`'s fully rounded
  // rx 3.1) and the lengths are deliberately uneven, so the top edge is a
  // jagged skyline instead of the smooth fingertip arch a hand makes.
  fries: () => {
    const angles = [-22, -13, -4, 5, 14, 23]
    const lens = [24, 31, 22, 33, 26, 26]
    let sticks = ''
    angles.forEach((a, i) => {
      const x = 20 + i * 4.4
      const len = lens[i]
      sticks +=
        `<rect x="${x.toFixed(1)}" y="${(39 - len).toFixed(1)}" width="5.2" height="${len}" rx="0.8" ` +
        `fill="#ffd43b" stroke="#ef9f27" stroke-width="1.4" transform="rotate(${a} ${(x + 2.6).toFixed(1)} 39)"/>`
    })
    return wrap(`
      ${sticks}
      <polygon points="15,33 49,33 45,60 19,60" fill="#e24b4a"/>
      <polygon points="15,33 49,33 48,39.5 16,39.5" fill="#d1332f"/>
      <polygon points="30,33 34,33 33,60 31,60" fill="#f5f2ea"/>
      <path d="M19 60 H45 L44.4 63 H19.6 Z" fill="#791f1f"/>
    `)
  },

  // A flying bee. The set already has two insects, so the split is by build:
  // `ant` is all-black in three blobs seen side on, `insect` is a red
  // top-down ladybug. This one is gold banded with black, with two pale
  // wings above the body. The bands cover about half the body on purpose --
  // `duck` is also a big yellow oval with a round head, and a plain yellow
  // bee would have been its twin. The three short legs are the second half
  // of that split: the duck comment says it has no legs at all.
  bee: () => photoIcon('bee'),
  // Three overlapping canopy lobes plus a trunk with root flare. The lobes
  // matter: a single dome on a stick is `umbrella`'s silhouette, and a ring
  // of small round tufts is `lion`'s mane. Three big lobes leave two notches
  // in the outline that neither of those has, and the bare branch poking out
  // to the left breaks the symmetry an umbrella canopy always has. No fruit
  // on it -- red dots would name it as `apple`.
  tree: () => photoIcon('tree'),
  // Round 3/4/5 (all rejected). Every prior attempt built the foot out of
  // `hand`'s own grammar -- a round/rect palm-like mass with digits fanning
  // or standing off its top edge -- and every one of them traded "floats
  // with no context" for "reads as a second hand," because that grammar
  // IS hand's grammar: elongated digits, roughly hand-digit proportions,
  // same silhouette family. Differentiating by cuff color or digit
  // thickness alone was never going to survive a glance at button size.
  // Round 6 (rejected). Single top-down sole with five small toe DOTS
  // clustered along the top edge -- fixed the hand confusion, but still
  // didn't land as clearly "foot" as hoped.
  // Round 7 (rejected). Paired "baby footprints" glyph (two teardrop soles,
  // oval toes fanned across each) -- user's next pass sent a second,
  // different reference and asked to match THAT one closely instead: a
  // SINGLE foot with the ankle/leg attached, seen at an angle (leg entering
  // top-left, heel bottom-left, toes fanning out to the bottom-right),
  // scalloped toe bumps built into one continuous outline rather than
  // separate ovals.
  // Round 8 (rejected on self-render). Tried sculpting all five toe bumps
  // directly into one continuous outline path (bumps-and-valleys as bezier
  // control points). Hand-fit control points produced thin spiky teeth
  // instead of rounded toes -- getting a smooth dome via a single quadratic
  // per bump needs the tip ON the curve, not acting as its own control
  // point, and doing that by hand across 5 bumps was fighting the tool.
  // Round 9 (rejected -- caught on self-render this round, not user review).
  // The diagonal leg+heel+ball silhouette with five toes fanned off one
  // corner rendered at button size as a THUMBS-UP FIST: a rounded knuckle
  // mass with a stack of small round bumps along one edge is exactly a
  // curled hand's grammar (the same failure mode rounds 3-5 supposedly
  // already closed off), and this composition wandered back into it by a
  // different path. Caught by actually rendering it standalone before
  // shipping -- every prior round's rejection reason had been trusted on
  // faith instead of looking at the pixels, which is how the same failure
  // mode shipped twice.
  // Round 10 redraw. Abandoned the diagonal ankle-attached foot for the
  // classic top-down BARE FOOTPRINT glyph instead: a single vertical sole
  // (rounded rectangle, ball wider than heel) with five toes as separate
  // ellipses spaced EVENLY ACROSS THE TOP EDGE, not fanned off one corner.
  // That symmetric top row is the one layout a curled hand can't produce --
  // a hand's digits stack along one side of the palm, never spread flat
  // across its far edge -- so the hand reading is closed off structurally,
  // not just by styling. No ankle/leg stub either (that's `leg`'s job
  // already); this is the sole alone, which is also what real "foot"
  // flashcard pictograms actually draw. A darker heel patch (the same
  // layered-flat-fill shading every other icon here uses) is the only
  // shading, so the toes read as rounded bumps rather than flat dots.
  feet: () => {
    const skin = '#f5d3ab'
    const ink = '#1c1c1c'
    const shade = '#e0ab78'
    const sole = 'M32 13 Q50 13 52 29 L52 45 Q52 61 32 61 Q12 61 12 45 L12 29 Q14 13 32 13 Z'
    const heel = 'M32 40 Q45 40 45 50 Q45 61 32 61 Q19 61 19 50 Q19 40 32 40 Z'
    // Big toe at one end shrinking to the pinky at the other, same as a
    // real foot -- all five centered on one shallow arc so the row reads as
    // "toes on a foot" rather than a straight ruled line of dots.
    const toes = [
      [15, 10, 6, 7.4],
      [24.5, 6, 6.4, 8],
      [34, 5.3, 6.4, 8],
      [43, 7.5, 5.8, 7.2],
      [50.5, 12.5, 4.8, 6],
    ]
    const toeShapes = toes
      .map(
        ([cx, cy, rx, ry]) =>
          `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${skin}" stroke="${ink}" stroke-width="3"/>`
      )
      .join('')
    return wrap(`
      <path d="${sole}" fill="${skin}" stroke="${ink}" stroke-width="3.4" stroke-linejoin="round"/>
      <path d="${heel}" fill="${shade}" opacity="0.55"/>
      ${toeShapes}
      <path d="${sole}" fill="none" stroke="${ink}" stroke-width="3.4" stroke-linejoin="round"/>
    `)
  },

  // A table fork, tilted so no axis-aligned symmetry invites a letter
  // reading. Drawn as ONE path with the tine gaps cut out of the outline,
  // never as four stroked bars: at this size two strokes facing each other
  // across a 2-unit gap close it up and the tines fuse into a paddle.
  // The proportions are the whole fight. A first draft had short blunt tines
  // on a wide shoulder and the hard cutout was `hand` -- four round-tipped
  // digits over a mass -- with the colour version reading as a garden rake.
  // So the tines are long (24 of the 53 units of height), pointed rather
  // than round-tipped, and the shoulder necks down to a 7-wide handle.
  // `net` and `aim` are a disc on a thin diagonal handle; `hand` has five
  // staggered digits, a wide palm and a cuff.
  // Round 2: bolder outline (3.4 vs 2.2) and a steeper tilt (-28deg vs -10),
  // matching a licensed reference sheet (or=fork cell) the user supplied --
  // same tine/handle construction, just thicker ink and a more diagonal
  // rest-on-a-table angle, which is what made the reference read clearly as
  // cutlery rather than a comb.
  fork: () => photoIcon('fork'),
  // An ear of corn: a kernel grid in two golds inside the cob outline, with
  // two husk leaves peeled forward from the base and a short silk tuft. The
  // grid is what names it -- a plain yellow capsule would be a lump, and
  // `gum` is already the "yellowish slab" shape in the set (pink, rotated,
  // in a torn wrapper). Spelling and sound both carry /or/ here, which is
  // the bar `orange` and `door` fail (see chapter-08.js's header).
  // Round 2 redraw. Round 1's kernels were rows offset brick-fashion, which
  // reads as a checkerboard grid rather than corn -- the note this round
  // was briefed on specifically: real corn is VERTICAL columns of kernels
  // curving with the cob, not a grid. This version draws explicit vertical
  // groove lines the full height of the cob (the column boundaries) with
  // small individual kernel highlights inside each column instead of row
  // rects, plus a rounder, more tapered cob silhouette (the old shape had a
  // near-flat top that read as a canister) and larger, more sharply peeled
  // husk leaves.
  corn: () => {
    const clipId = nextId('corn-clip')
    const cob = 'M32 6 Q46 10 46 26 L46 46 Q46 60 32 60 Q18 60 18 46 L18 26 Q18 10 32 6 Z'
    let cols = ''
    let notches = ''
    const colXs = [21, 26, 31, 36, 41]
    colXs.forEach((x, ci) => {
      cols += `<line x1="${x}" y1="9" x2="${x}" y2="58" stroke="#c9781a" stroke-width="1.2" opacity="0.55"/>`
      for (let r = 0; r < 11; r++) {
        const y = 10 + r * 4.6 + (ci % 2 === 0 ? 0 : 2.3)
        if (y > 56) continue
        notches += `<ellipse cx="${x + 2.5}" cy="${y.toFixed(1)}" rx="2.1" ry="1.6" fill="#fff0b0" opacity="0.55"/>`
      }
    })
    return wrap(`
      <g stroke="#c98f4e" stroke-width="2.2" stroke-linecap="round" fill="none">
        <path d="M30 9 Q26 4 26 2"/>
        <path d="M33 8 Q34 3 34.5 1"/>
        <path d="M36 9 Q40 5 41 3"/>
      </g>
      <path d="${cob}" fill="#ffd43b"/>
      <clipPath id="${clipId}"><path d="${cob}"/></clipPath>
      <g clip-path="url(#${clipId})">
        ${cols}
        ${notches}
        <rect x="37" y="6" width="10" height="54" fill="#c9781a" opacity="0.3"/>
        <rect x="18" y="6" width="6" height="54" fill="#fff6d0" opacity="0.4"/>
      </g>
      <path d="${cob}" fill="none" stroke="#c98f4e" stroke-width="2.2"/>
      <path d="M26 50 Q6 46 2 22 Q8 40 26 55 Q14 46 10 30 Z" fill="#3b9922"/>
      <path d="M26 50 Q6 46 2 22 Q8 40 26 55 Z" fill="#256614" opacity="0.3"/>
      <path d="M38 52 Q58 47 60 26 Q56 42 40 57 Q52 47 55 32 Z" fill="#3b9922"/>
      <path d="M38 52 Q58 47 60 26 Z" fill="#ffffff" opacity="0.15"/>
    `)
  },

  // -------------------------------------------------------------------
  // Chapter 9-14 sound icons (Group 5-7), photo-cropped -- see the
  // "PHOTO-CROP ROUND" header comment above and `photoIcon()`/
  // `icon-photos.js` for the mechanism. Each maps to the new letter/
  // digraph a phonics-chapter comment flagged as "아이콘 재고 0":
  //   zebra  -- Z  (chapter 9)
  //   watch  -- W  (chapter 9)
  //   van    -- V  (chapter 10)
  //   book   -- OO short/book sound (chapter 10)
  //   yoyo   -- Y  (chapter 10)
  //   fox    -- X word-final /ks/ (chapter 11, joins the existing `box`)
  //   chips  -- CH (chapter 11)
  //   shoe   -- SH (chapter 11, joins the existing `fish`)
  //   thumb  -- TH voiceless (chapter 12)
  //   queen  -- QU (chapter 12)
  //   cloud  -- OU (chapter 12)
  //   coin   -- OI (chapter 13)
  //   glue   -- UE (chapter 13)
  //   rubber -- ER (chapter 14)
  // NG (chapter 9) needed no new icon -- the phonics comment already
  // repurposes the existing `ring`/`king` art (both end in NG even though
  // they'd only been used as R/K onset pictures before).
  zebra: () => photoIcon('zebra'),
  watch: () => photoIcon('watch'),
  van: () => photoIcon('van'),
  book: () => photoIcon('book'),
  yoyo: () => photoIcon('yoyo'),
  fox: () => photoIcon('fox'),
  // A potato-chip bag, redrawn by hand after the photo-crop version (still a
  // reference-sheet fries carton at these proportions) read as a duplicate
  // of `fries` -- same red carton, same yellow sticks poking up. This is
  // deliberately the opposite build on every axis fries uses: a tall
  // standing pouch (not a wide short carton) with a jagged heat-sealed
  // crimp on top and a folded seam band at the bottom (fries has neither --
  // it is an open-top box), green (not red -- the only other green in the
  // set is `snake`'s cord-thin body, nothing bag-shaped), and the chips
  // themselves are ruffled ovals with a wavy scalloped rim, not straight
  // rods -- the single detail meant to kill the fries confusion even in a
  // hard greyscale cutout where the color split disappears. Style/palette
  // are original, not traced from any reference image.
  chips: () => {
    const clipId = nextId('chips-clip')
    const bagTop =
      'M15 20 L18.5 11 L23 18 L27.5 10 L32 18 L36.5 10 L41 18 L45.5 11 L49 20 Z'
    const bagBody =
      'M15 20 Q13 34 14.5 46 L49.5 46 Q51 34 49 20 Z'
    const bagFold = 'M14.5 46 Q14 51 17 56 L47 56 Q50 51 49.5 46 Z'
    // Ruffled chip: a lumpy oval built from alternating wide/narrow curves
    // around the rim instead of a smooth ellipse, so the scallop reads even
    // at a hard cutout.
    const chip = (cx, cy, s, rot) =>
      `<g transform="translate(${cx} ${cy}) rotate(${rot}) scale(${s})">` +
      `<path d="M-11 1 Q-9 -7 -3 -6 Q1 -9 6 -5 Q12 -6 11 1 Q13 6 6 7 Q2 10 -2 7 Q-9 9 -11 3 Z" ` +
      `fill="#f0c987" stroke="#a5672a" stroke-width="1.8" stroke-linejoin="round"/>` +
      `<path d="M-6 -2 Q0 -4.5 5 -1" fill="none" stroke="#c9975c" stroke-width="1.3" stroke-linecap="round"/>` +
      `</g>`
    return wrap(`
      <g>${chip(24, 8, 1.35, -18)}${chip(33, 4, 1.5, 10)}${chip(41, 9, 1.3, 28)}</g>
      <path d="${bagBody}" fill="#2f9e5c"/>
      <path d="${bagTop}" fill="#2f9e5c"/>
      <clipPath id="${clipId}"><path d="${bagBody}"/></clipPath>
      <path d="M32 20 L49.5 20 Q51 34 49.5 46 L36 46 Q34 34 32 20 Z" fill="#3fb86e" clip-path="url(#${clipId})"/>
      <path d="${bagFold}" fill="#1c7a43"/>
      <line x1="17.5" y1="51" x2="46.5" y2="51" stroke="#0f5c30" stroke-width="1.6"/>
      <ellipse cx="32" cy="33" rx="9" ry="6.5" fill="#e7d9a8" stroke="#a5672a" stroke-width="1.6"/>
      <path d="${bagBody}" fill="none" stroke="#2c2c2a" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="${bagTop}" fill="none" stroke="#2c2c2a" stroke-width="2.4" stroke-linejoin="round"/>
      <path d="${bagFold}" fill="none" stroke="#2c2c2a" stroke-width="2.4" stroke-linejoin="round"/>
    `)
  },
  shoe: () => photoIcon('shoe'),
  thumb: () => photoIcon('thumb'),
  queen: () => photoIcon('queen'),
  cloud: () => photoIcon('cloud'),
  coin: () => photoIcon('coin'),
  glue: () => photoIcon('glue'),
  rubber: () => photoIcon('rubber'),

  // Generic letter/word tile -- embosses the actual letter(s) so the icon
  // itself carries shape-recognition value instead of being blank filler.
  letterTile: (label = '') =>
    wrap(`
      <rect x="8" y="8" width="48" height="48" rx="10" fill="#378add"/>
      <rect x="8" y="8" width="48" height="48" rx="10" fill="none" stroke="#0c447c" stroke-width="3"/>
      <polygon points="8,18 18,8 8,8" fill="#eafcff" opacity="0.8"/>
      <text x="32" y="40" text-anchor="middle" font-size="${
        label.length > 2 ? 18 : 26
      }" font-weight="800" fill="#fff">${label}</text>
    `),
}

// Fallback: an empty rounded tile, in case a stage ever references an
// unknown icon key — keeps rendering safe instead of crashing.
const FALLBACK = () =>
  wrap(`<rect x="10" y="10" width="44" height="44" rx="10" fill="#b8b8b8"/>`)

export function wordIcon(key, label) {
  const make = ICONS[key] || FALLBACK
  return make(label)
}

export const wordIconKeys = Object.keys(ICONS)

// Decorative "say it LOUD" background effect for the read-aloud/finale
// target word: classic manga/comic "speed lines" (집중선) radiating out
// from the word in all directions, each tapering from a thick base to a
// fine point — a generic, ubiquitous comic-art convention, not tied to any
// character or franchise. Flat color, no gradients. The lines use
// currentColor so the wrapping element's `color` can retint them (the
// default accent vs. the finale's danger-red).
export function shoutBurst() {
  const cx = 120
  const cy = 100
  // Clear open center — lines start well away from the word
  const rInner = 42
  const lineCount = 48
  // Alternating lengths produce the uneven, hand-drawn manga rhythm;
  // longer lines dominate so the burst fills the viewBox to the edges.
  const lengths = [108, 78, 96, 68, 104, 72, 90, 64]
  // Half-angle controls wedge width; narrower = tighter, more authentic lines
  const half = 0.035
  let lines = ''
  for (let i = 0; i < lineCount; i++) {
    const angle = (i / lineCount) * Math.PI * 2
    const rOuter = lengths[i % lengths.length]
    const x1 = (cx + Math.cos(angle - half) * rInner).toFixed(1)
    const y1 = (cy + Math.sin(angle - half) * rInner).toFixed(1)
    const x2 = (cx + Math.cos(angle + half) * rInner).toFixed(1)
    const y2 = (cy + Math.sin(angle + half) * rInner).toFixed(1)
    const x3 = (cx + Math.cos(angle) * rOuter).toFixed(1)
    const y3 = (cy + Math.sin(angle) * rOuter).toFixed(1)
    lines += `<polygon points="${x1},${y1} ${x2},${y2} ${x3},${y3}" fill="currentColor"/>`
  }
  return `<svg viewBox="0 0 240 200" xmlns="http://www.w3.org/2000/svg" class="shout-fx-art" aria-hidden="true">
      <g opacity="0.75">${lines}</g>
    </svg>`
}
