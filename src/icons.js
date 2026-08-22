// Original flat-color SVG word/picture icons used on choice buttons in
// place of plain Unicode emoji. Kept in the same geometric-primitive style
// as the character art in art.js (circles/rects/polygons, 2-3 flat colors,
// no gradients/photorealism), sized to read clearly at ~60px on a button.

function wrap(inner, viewBox = '0 0 64 64') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="word-icon-art">${inner}</svg>`
}

// Counter so icons that need a local <mask>/<clipPath> id (e.g. moon) don't
// collide when the same icon is rendered multiple times on one page.
let uid = 0
function nextId(prefix) {
  uid += 1
  return `${prefix}-${uid}`
}

const ICONS = {
  sun: () =>
    wrap(`
      <g stroke="#f4a71b" stroke-width="4" stroke-linecap="round">
        <line x1="32" y1="4" x2="32" y2="14"/>
        <line x1="32" y1="50" x2="32" y2="60"/>
        <line x1="4" y1="32" x2="14" y2="32"/>
        <line x1="50" y1="32" x2="60" y2="32"/>
        <line x1="12" y1="12" x2="19" y2="19"/>
        <line x1="45" y1="45" x2="52" y2="52"/>
        <line x1="52" y1="12" x2="45" y2="19"/>
        <line x1="19" y1="45" x2="12" y2="52"/>
      </g>
      <circle cx="32" cy="32" r="16" fill="#ffd43b" stroke="#f4a71b" stroke-width="2"/>
    `),

  snake: () =>
    wrap(`
      <path d="M10 20 Q10 8 22 8 Q34 8 34 18 Q34 28 22 28 Q14 28 14 34 Q14 44 26 44 Q46 44 46 30"
        fill="none" stroke="#3b9922" stroke-width="9" stroke-linecap="round"/>
      <polygon points="46,30 58,26 58,34" fill="#e24b4a"/>
      <circle cx="22" cy="10" r="2.4" fill="#161615"/>
    `),

  dog: () =>
    wrap(`
      <polygon points="16,10 26,26 10,26" fill="#ef9f27"/>
      <polygon points="48,10 54,26 38,26" fill="#ef9f27"/>
      <circle cx="32" cy="34" r="20" fill="#f4c07a"/>
      <ellipse cx="32" cy="42" rx="9" ry="7" fill="#fff6e8"/>
      <circle cx="24" cy="30" r="3" fill="#161615"/>
      <circle cx="40" cy="30" r="3" fill="#161615"/>
      <ellipse cx="32" cy="40" rx="3.4" ry="2.6" fill="#161615"/>
    `),

  // The body fill is off-white on a near-white button, so without the contour
  // 72% of the drawing measures as background and only the cuff and sole are
  // left to read -- the same contour every other off-white icon here carries.
  sock: () =>
    wrap(`
      <path d="M24 6 H38 V32 Q38 36 44 38 L56 44 Q58 48 54 50 H26 Q20 50 20 44 V6 Z"
        fill="#f5f2ea" stroke="#2c2c2a" stroke-width="2.6" stroke-linejoin="round"/>
      <rect x="24" y="6" width="14" height="9" fill="#378add"/>
      <path d="M20 44 H54 Q54 48 50 48 H24 Q20 48 20 44 Z" fill="#d1332f"/>
    `),

  star: () =>
    wrap(`
      <polygon points="32,4 39,24 60,24 43,37 49,58 32,46 15,58 21,37 4,24 25,24"
        fill="#ffd43b" stroke="#f4a71b" stroke-width="2" stroke-linejoin="round"/>
    `),

  car: () =>
    wrap(`
      <path d="M6 40 L12 26 Q14 22 20 22 H44 Q50 22 52 26 L58 40 Z" fill="#378add"/>
      <polygon points="18,24 26,24 24,34 16,34" fill="#eafcff"/>
      <polygon points="30,24 42,24 42,34 32,34" fill="#eafcff"/>
      <rect x="4" y="38" width="56" height="8" rx="3" fill="#0c447c"/>
      <circle cx="18" cy="48" r="7" fill="#2c2c2a"/>
      <circle cx="46" cy="48" r="7" fill="#2c2c2a"/>
      <circle cx="18" cy="48" r="3" fill="#b8b8b8"/>
      <circle cx="46" cy="48" r="3" fill="#b8b8b8"/>
    `),

  moon: () => {
    const maskId = nextId('moon-mask')
    return wrap(`
      <mask id="${maskId}">
        <rect x="0" y="0" width="64" height="64" fill="#fff"/>
        <circle cx="40" cy="26" r="16" fill="#000"/>
      </mask>
      <circle cx="28" cy="32" r="20" fill="#f4c95d" mask="url(#${maskId})"/>
    `)
  },

  cup: () =>
    wrap(`
      <rect x="12" y="22" width="30" height="24" rx="4" fill="#d1332f"/>
      <path d="M42 26 Q54 26 54 34 Q54 42 42 42 Z" fill="none" stroke="#d1332f" stroke-width="5"/>
      <g stroke="#b8b8b8" stroke-width="3" stroke-linecap="round">
        <path d="M20 14 Q20 10 24 10"/>
        <path d="M30 14 Q30 10 34 10"/>
      </g>
    `),

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

  // Legs are drawn first and rooted deep inside the thorax, so the body
  // paints over their anchor points -- anchored on the outline they read as
  // detached at 60px. The three body blobs keep visible pinch gaps between
  // them, which is what separates an ant from a two-part spider.
  ant: () =>
    wrap(`
      <g stroke="#2c2c2a" stroke-width="4" stroke-linecap="round" fill="none">
        <path d="M30 27 L38 21 L46 21"/>
        <path d="M32 30 L45 28 L55 32"/>
        <path d="M28 26 L21 21 L13 23"/>
        <path d="M28 31 L19 35 L11 43"/>
        <path d="M31 34 L28 46 L20 53"/>
        <path d="M34 35 L38 48 L33 57"/>
      </g>
      <g stroke="#2c2c2a" stroke-width="3" stroke-linecap="round" fill="none">
        <path d="M16 12 Q11 5 5 4"/>
        <path d="M21 10 Q22 4 28 2.5"/>
      </g>
      <circle cx="18" cy="15" r="7.5" fill="#2c2c2a"/>
      <circle cx="31" cy="29" r="8.5" fill="#2c2c2a"/>
      <ellipse cx="49" cy="43" rx="12.5" ry="10.5" fill="#2c2c2a"/>
      <circle cx="20" cy="13" r="2.2" fill="#f5f2ea"/>
    `),

  apple: () =>
    wrap(`
      <polygon points="30,10 34,10 33,16 31,16" fill="#712b13"/>
      <path d="M34 12 Q44 8 42 16" fill="none" stroke="#3b9922" stroke-width="4" stroke-linecap="round"/>
      <path d="M32 18 C14 18 10 34 16 46 C20 54 28 56 32 52 C36 56 44 54 48 46 C54 34 50 18 32 18 Z"
        fill="#e24b4a"/>
      <path d="M22 26 Q26 22 30 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.55"/>
    `),

  top: () =>
    wrap(`
      <polygon points="16,12 48,12 40,46 24,46" fill="#534ab7"/>
      <rect x="16" y="12" width="32" height="9" fill="#f4c95d"/>
      <rect x="16" y="26" width="32" height="6" fill="#eafcff"/>
      <polygon points="24,46 40,46 32,58" fill="#26215c"/>
      <rect x="28" y="4" width="8" height="10" rx="2" fill="#26215c"/>
    `),

  tap: () =>
    wrap(`
      <rect x="12" y="6" width="10" height="24" rx="2" fill="#b8b8b8"/>
      <circle cx="17" cy="6" r="6" fill="#e24b4a"/>
      <rect x="12" y="24" width="30" height="9" rx="4" fill="#b8b8b8"/>
      <path d="M40 33 Q47 42 47 48 A7 7 0 1 1 33 48 Q33 42 40 33 Z" fill="#5dd6e0"/>
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

  igloo: () =>
    wrap(`
      <rect x="1" y="50" width="62" height="8" rx="4" fill="#eafcff"/>
      <path d="M3 52 A29 29 0 0 1 61 52 Z" fill="#f5f2ea"/>
      <g stroke="#b8b8b8" stroke-width="2.5" fill="none">
        <path d="M7 38 A28 26 0 0 1 57 38"/>
        <path d="M17 27 A19 19 0 0 1 47 27"/>
        <path d="M12 52 V40"/>
        <path d="M52 52 V40"/>
        <path d="M22 38 V28"/>
        <path d="M42 38 V28"/>
      </g>
      <path d="M18 52 A14 17 0 0 1 46 52 Z" fill="#f5f2ea" stroke="#b8b8b8" stroke-width="2.5"/>
      <path d="M22 52 A10 13 0 0 1 42 52 Z" fill="#0c447c"/>
    `),

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
  pig: () =>
    wrap(`
      <ellipse cx="15" cy="19" rx="7" ry="9.5" transform="rotate(-28 15 19)" fill="#dd7f9a"/>
      <ellipse cx="49" cy="19" rx="7" ry="9.5" transform="rotate(28 49 19)" fill="#dd7f9a"/>
      <circle cx="32" cy="32" r="20" fill="#f0a0b4"/>
      <ellipse cx="32" cy="47" rx="13" ry="10" fill="#dd7f9a"/>
      <ellipse cx="27" cy="47" rx="3" ry="4" fill="#2c2c2a"/>
      <ellipse cx="37" cy="47" rx="3" ry="4" fill="#2c2c2a"/>
      <circle cx="23" cy="26" r="3.4" fill="#2c2c2a"/>
      <circle cx="41" cy="26" r="3.4" fill="#2c2c2a"/>
    `),

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

  // A nose alone is unreadable, so it sits in a human face -- hair and mouth
  // keep it from reading as the `pig` snout, and the nose is the only
  // outlined, darker feature.
  nose: () => {
    const clipId = nextId('nose-clip')
    return wrap(`
      <clipPath id="${clipId}"><circle cx="32" cy="32" r="25"/></clipPath>
      <circle cx="32" cy="32" r="25" fill="#f5d6b0"/>
      <path d="M4 32 Q4 4 32 4 Q60 4 60 32 Q48 20 32 20 Q16 20 4 32 Z"
        fill="#2c2c2a" clip-path="url(#${clipId})"/>
      <circle cx="21" cy="30" r="3" fill="#2c2c2a"/>
      <circle cx="43" cy="30" r="3" fill="#2c2c2a"/>
      <path d="M32 27 Q29 37 26 42 Q26 48 32 48 Q38 48 38 42 Q35 37 32 27 Z"
        fill="#e0a273" stroke="#a06e33" stroke-width="2.5" stroke-linejoin="round"/>
      <circle cx="29" cy="44" r="1.8" fill="#2c2c2a"/>
      <circle cx="35" cy="44" r="1.8" fill="#2c2c2a"/>
      <path d="M25 53 Q32 57 39 53" fill="none" stroke="#b5573c" stroke-width="3" stroke-linecap="round"/>
    `)
  },

  // -- Group 2: C/K, E, H (chapter 3) --

  // Head-only like `dog`, so the split has to come from silhouette and hue:
  // ears are fused spikes on one continuous outline (dog has two detached
  // triangles over a circle), the coat is cool gray instead of dog's tan, and
  // the slit pupils plus whiskers that run past the cheeks are cat-only cues.
  cat: () =>
    wrap(`
      <path d="M8 6 L25 21 H39 L56 6 L53 31 C56 45 46 56 32 56 C18 56 8 45 11 31 Z"
        fill="#8e8e96" stroke="#2c2c2a" stroke-width="2.6" stroke-linejoin="round"/>
      <polygon points="13,13 24,23 12,26" fill="#f0a0b4"/>
      <polygon points="51,13 40,23 52,26" fill="#f0a0b4"/>
      <g stroke="#2c2c2a" stroke-width="2.4" stroke-linecap="round">
        <line x1="26" y1="44" x2="3" y2="40"/>
        <line x1="26" y1="47" x2="4" y2="51"/>
        <line x1="38" y1="44" x2="61" y2="40"/>
        <line x1="38" y1="47" x2="60" y2="51"/>
      </g>
      <ellipse cx="23" cy="34" rx="5.4" ry="6.4" fill="#ffd43b"/>
      <ellipse cx="41" cy="34" rx="5.4" ry="6.4" fill="#ffd43b"/>
      <ellipse cx="23" cy="34" rx="1.7" ry="5.2" fill="#2c2c2a"/>
      <ellipse cx="41" cy="34" rx="1.7" ry="5.2" fill="#2c2c2a"/>
      <polygon points="28,43 36,43 32,48" fill="#e24b4a"/>
    `),

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
  hat: () =>
    wrap(`
      <path d="M17 44 Q14 14 32 14 Q50 14 47 44 Z" fill="#712b13"/>
      <rect x="16" y="30" width="32" height="10" fill="#ef9f27"/>
      <path d="M2 44 Q32 32 62 44 Q32 58 2 44 Z" fill="#712b13"/>
    `),

  // One even-odd path: the bow's hole is a real hole, so a single outline
  // wraps the whole key and no <mask> id can collide. Drawn flat-horizontal
  // to stay clear of the diagonal `pen`, with teeth 7 units wide so they
  // still separate at 60px.
  key: () =>
    wrap(`
      <path fill-rule="evenodd" fill="#f4c95d" stroke="#ef9f27" stroke-width="2.6"
        stroke-linejoin="round"
        d="M31.8 25 L60 25 L60 49 L53 49 L53 37 L46 37 L46 49 L39 49 L39 37 L31.8 37
           A15 15 0 1 1 31.8 25 Z
           M25 31 A7 7 0 1 0 11 31 A7 7 0 1 0 25 31 Z"/>
    `),

  // Ears wider than the head plus a hanging trunk: the two shapes that hold
  // up at 60px. Neutral gray, not the cool gray of `cat`, and nothing about
  // the outline invites comparison with the head-only `pig`.
  elephant: () =>
    wrap(`
      <ellipse cx="12" cy="29" rx="12" ry="14" fill="#78787f"/>
      <ellipse cx="52" cy="29" rx="12" ry="14" fill="#78787f"/>
      <path d="M20 12 H44 Q50 12 50 20 V34 Q50 44 40 44 H24 Q14 44 14 34 V20 Q14 12 20 12 Z"
        fill="#a3a3ab"/>
      <path d="M31 42 V50 Q31 59 40 58" fill="none" stroke="#a3a3ab" stroke-width="10"
        stroke-linecap="round"/>
      <polygon points="21,42 26,42 17,54" fill="#f5f2ea"/>
      <polygon points="38,42 43,42 47,54" fill="#f5f2ea"/>
      <circle cx="25" cy="27" r="3.2" fill="#2c2c2a"/>
      <circle cx="39" cy="27" r="3.2" fill="#2c2c2a"/>
    `),

  // Fingers are separate fills with 3-unit background gaps instead of one
  // stroked outline -- at 60px a stroked gap fills in and the fingers fuse
  // into a mitten. The green cuff anchors the wrist on any button color.
  hand: () =>
    wrap(`
      <rect x="12" y="30" width="6.4" height="18" rx="3.2" fill="#e0a273"
        transform="rotate(-32 15.2 48)"/>
      <rect x="17.5" y="14" width="6.2" height="24" rx="3.1" fill="#e0a273"/>
      <rect x="26.7" y="10" width="6.2" height="28" rx="3.1" fill="#e0a273"/>
      <rect x="35.9" y="14" width="6.2" height="24" rx="3.1" fill="#e0a273"/>
      <rect x="45.1" y="21" width="6.2" height="17" rx="3.1" fill="#e0a273"/>
      <rect x="15" y="32" width="36" height="20" rx="9" fill="#e0a273"/>
      <rect x="20" y="50" width="26" height="9" rx="4" fill="#3b9922"/>
    `),

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
  cake: () =>
    wrap(`
      <g fill="#e24b4a">
        <rect x="17" y="8" width="5" height="14"/>
        <rect x="29.5" y="6" width="5" height="16"/>
        <rect x="42" y="8" width="5" height="14"/>
      </g>
      <g fill="#ffd43b">
        <circle cx="19.5" cy="6" r="3.4"/>
        <circle cx="32" cy="4" r="3.4"/>
        <circle cx="44.5" cy="6" r="3.4"/>
      </g>
      <rect x="9" y="32" width="46" height="19" fill="#f4c95d"/>
      <path d="M9 22 H55 V34 Q49 40 43 34 Q37 40 32 34 Q26 40 21 34 Q15 40 9 34 Z"
        fill="#f0a0b4"/>
      <rect x="4" y="51" width="56" height="6" rx="3" fill="#b8b8b8"/>
    `),

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
  kite: () =>
    wrap(`
      <polygon points="32,2 32,24 12,24" fill="#e24b4a"/>
      <polygon points="32,2 52,24 32,24" fill="#ffd43b"/>
      <polygon points="12,24 32,24 32,46" fill="#378add"/>
      <polygon points="32,24 52,24 32,46" fill="#3b9922"/>
      <path d="M32 46 Q41 51 34 56 Q27 60 34 62" fill="none" stroke="#2c2c2a"
        stroke-width="2.8" stroke-linecap="round"/>
      <polygon points="34,48 42,45 42,53" fill="#5dd6e0"/>
      <polygon points="28,55 35,52 35,60" fill="#5dd6e0"/>
    `),

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
  rat: () =>
    wrap(`
      <path d="M16 42 Q4 46 4 54 Q4 61 14 59" fill="none" stroke="#e0a273" stroke-width="4.5" stroke-linecap="round"/>
      <ellipse cx="26" cy="36" rx="20" ry="15" fill="#9b9ba3"/>
      <circle cx="44" cy="22" r="10" fill="#9b9ba3"/>
      <polygon points="52,19 63,22 52,26" fill="#7c7c86"/>
      <circle cx="38" cy="12" r="5.6" fill="#9b9ba3"/>
      <circle cx="38" cy="12" r="2.6" fill="#e6b8c4"/>
      <circle cx="47" cy="19" r="2.1" fill="#2c2c2a"/>
      <g stroke="#7c7c86" stroke-width="1.5" stroke-linecap="round">
        <line x1="53" y1="19" x2="62" y2="14"/>
        <line x1="54" y1="22" x2="63" y2="22"/>
        <line x1="53" y1="25" x2="62" y2="29"/>
      </g>
      <ellipse cx="18" cy="49" rx="4" ry="2.4" fill="#7c7c86"/>
      <ellipse cx="32" cy="50" rx="4" ry="2.4" fill="#7c7c86"/>
    `),

  // A gold band drawn as a circle-with-a-hole (mask, like `moon`) so it can
  // never be read as the disc-shaped `key` head, topped with a mounted gem --
  // the gem is the cue that separates it from `moon`'s bare crescent.
  ring: () => {
    const maskId = nextId('ring-mask')
    return wrap(`
      <mask id="${maskId}">
        <rect width="64" height="64" fill="#fff"/>
        <circle cx="32" cy="42" r="13" fill="#000"/>
      </mask>
      <circle cx="32" cy="42" r="19" fill="#f4c95d" mask="url(#${maskId})"/>
      <circle cx="32" cy="42" r="19" fill="none" stroke="#ef9f27" stroke-width="2" mask="url(#${maskId})"/>
      <polygon points="32,10 44,24 32,34 20,24" fill="#5dd6e0" stroke="#378add" stroke-width="2.4" stroke-linejoin="round"/>
      <polygon points="26,20 32,15 38,20 32,26" fill="#eafcff" opacity="0.7"/>
    `)
  },

  // A wrapped box with a knotted bow, not the flat unwrapped `gum` strip --
  // the bow loops and the vertical+horizontal ribbon cross are the shapes
  // that make it read as "present" rather than "box" at 60px.
  gift: () =>
    wrap(`
      <rect x="10" y="26" width="44" height="30" rx="3" fill="#e24b4a"/>
      <rect x="10" y="35" width="44" height="8" fill="#f4c95d"/>
      <rect x="27" y="26" width="10" height="30" fill="#f4c95d"/>
      <path d="M20 26 Q12 14 22 10 Q30 8 32 20 Q34 8 42 10 Q52 14 44 26 Z"
        fill="#f4c95d" stroke="#ef9f27" stroke-width="2" stroke-linejoin="round"/>
      <circle cx="32" cy="21" r="4" fill="#ef9f27"/>
    `),

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
  octopus: () => {
    let arms = ''
    for (let i = 0; i < 8; i++) {
      const t = (i - 3.5) / 3.5
      const sx = 32 + t * 18
      const sy = 40 - 4 * t * t
      const tx = 32 + t * 27
      const ty = 58 - 10 * t * t
      const cx = sx + t * 6
      const cy = (sy + ty) / 2
      const color = i % 2 === 0 ? '#3a3280' : '#7a70e0'
      arms +=
        `<path d="M${sx.toFixed(1)} ${sy.toFixed(1)} Q${cx.toFixed(1)} ${cy.toFixed(1)} ` +
        `${tx.toFixed(1)} ${ty.toFixed(1)}" fill="none" stroke="${color}" ` +
        `stroke-width="5.6" stroke-linecap="round"/>`
    }
    return wrap(`
      ${arms}
      <ellipse cx="32" cy="24" rx="22" ry="17" fill="#534ab7"/>
      <circle cx="23" cy="22" r="7.5" fill="#eafcff"/>
      <circle cx="41" cy="22" r="7.5" fill="#eafcff"/>
      <circle cx="23" cy="23" r="3.8" fill="#2c2c2a"/>
      <circle cx="41" cy="23" r="3.8" fill="#2c2c2a"/>
    `)
  },

  // Same round-fruit build as `apple` (so the /o/ vs /a/ family reads as
  // fruit either way) but orange, not red, with a dimpled rind and a stubby
  // navel instead of apple's stem+leaf, so the two can never be confused.
  orange: () =>
    wrap(`
      <circle cx="32" cy="36" r="24" fill="#ef9f27"/>
      <circle cx="32" cy="13" r="3.2" fill="#712b13"/>
      <path d="M32 13 Q40 7 46 13" fill="none" stroke="#3b9922" stroke-width="4" stroke-linecap="round"/>
      <g fill="#d97f1f" opacity="0.7">
        <circle cx="22" cy="28" r="1.6"/>
        <circle cx="30" cy="24" r="1.6"/>
        <circle cx="40" cy="30" r="1.6"/>
        <circle cx="24" cy="42" r="1.6"/>
        <circle cx="36" cy="46" r="1.6"/>
        <circle cx="44" cy="38" r="1.6"/>
        <circle cx="30" cy="50" r="1.6"/>
      </g>
      <path d="M18 26 Q24 20 30 24" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.5"/>
    `),

  // A domed canopy (round top, scalloped bottom edge) on a straight pole --
  // the opposite silhouette from `top`'s pointed triangle spinning toy, so
  // the two never compete even though both are drawn in cool/warm blocks.
  umbrella: () =>
    wrap(`
      <path d="M4 34 A28 28 0 0 1 32 6 A28 28 0 0 1 60 34 Z" fill="#e24b4a"/>
      <path d="M4 34 A28 28 0 0 1 32 6 Z" fill="#378add"/>
      <g stroke="#2c2c2a" stroke-width="1.6" fill="none">
        <line x1="14" y1="16" x2="20" y2="32"/>
        <line x1="32" y1="6" x2="32" y2="34"/>
        <line x1="50" y1="16" x2="44" y2="32"/>
      </g>
      <path d="M4 34 Q4 40 10 36 Q16 40 22 36 Q28 40 34 36 Q40 40 46 36 Q52 40 58 36 Q60 35 60 34"
        fill="none" stroke="#2c2c2a" stroke-width="2.2" stroke-linejoin="round"/>
      <rect x="30" y="4" width="4" height="4" fill="#f4c95d"/>
      <line x1="32" y1="34" x2="32" y2="54" stroke="#712b13" stroke-width="4"/>
      <path d="M32 54 Q32 61 23 61" fill="none" stroke="#712b13" stroke-width="4" stroke-linecap="round"/>
    `),

  // -- Group 4 additions: L / F / B (chapter 6) --

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

  // Oval body + triangular tail fin + dorsal spike carry the silhouette
  // instead of scale texture (which dies at 60px); a lighter belly band
  // splits the body into back/belly so it reads as fish, not a plain blob.
  fish: () =>
    wrap(`
      <polygon points="46,32 62,18 62,46" fill="#0c447c"/>
      <ellipse cx="28" cy="32" rx="24" ry="15" fill="#378add"/>
      <path d="M6 38 Q28 50 50 38 Q28 46 6 38 Z" fill="#5dd6e0"/>
      <polygon points="22,17 32,17 27,5" fill="#0c447c"/>
      <circle cx="16" cy="28" r="3.6" fill="#f5f2ea"/>
      <circle cx="15" cy="28" r="1.9" fill="#2c2c2a"/>
    `),

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
  ball: () =>
    wrap(`
      <circle cx="32" cy="32" r="25" fill="#ef9f27" stroke="#2c2c2a" stroke-width="3.6"/>
      <g fill="none" stroke="#2c2c2a" stroke-width="3.4" stroke-linecap="round">
        <path d="M32 8 V56"/>
        <path d="M8 32 H56"/>
        <path d="M17 11 Q27 32 17 53"/>
        <path d="M47 11 Q37 32 47 53"/>
      </g>
    `),

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

  // A rug seen flat on the floor: the fringe tassels on both long edges are
  // the cue that says "textile lying down", which is what keeps it away from
  // `box` (a 3D carton with flaps). Deliberately cool indigo/cyan while `map`
  // is warm gold parchment -- the two /m/ pictures can appear in the same
  // multiselect, so they are separated by hue as well as by outline.
  mat: () =>
    wrap(`
      <g stroke="#26215c" stroke-width="2.8" stroke-linecap="round">
        <line x1="9" y1="49" x2="9" y2="56"/><line x1="17" y1="49" x2="17" y2="56"/>
        <line x1="25" y1="49" x2="25" y2="56"/><line x1="32" y1="49" x2="32" y2="56"/>
        <line x1="39" y1="49" x2="39" y2="56"/><line x1="47" y1="49" x2="47" y2="56"/>
        <line x1="55" y1="49" x2="55" y2="56"/>
      </g>
      <polygon points="6,50 58,50 48,26 16,26" fill="#26215c"/>
      <polygon points="12,46 52,46 44,30 20,30" fill="#534ab7"/>
      <g stroke="#5dd6e0" stroke-width="2.6" stroke-linecap="round">
        <line x1="19" y1="34" x2="45" y2="34"/>
        <line x1="16.5" y1="39" x2="47.5" y2="39"/>
        <line x1="14" y1="44" x2="50" y2="44"/>
      </g>
    `),

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
  duck: () =>
    wrap(`
      <polygon points="13,38 2,29 15,30" fill="#f4c95d"/>
      <ellipse cx="29" cy="41" rx="22" ry="15" fill="#ffd43b"/>
      <circle cx="44" cy="23" r="13" fill="#ffd43b"/>
      <path d="M55 23 Q63 24 61 29 Q56 31 52 28 Z" fill="#ef9f27"/>
      <path d="M21 39 Q29 33 38 39 Q32 48 21 45 Z" fill="#f4c95d"/>
      <path d="M21 39 Q29 33 38 39" fill="none" stroke="#ef9f27" stroke-width="1.8"/>
      <circle cx="44" cy="20" r="3.2" fill="#2c2c2a"/>
      <circle cx="45.2" cy="19" r="1.1" fill="#f5f2ea"/>
      <g fill="none" stroke="#0c447c" stroke-width="3" stroke-linecap="round">
        <path d="M4 56 Q13 51 22 56 Q31 61 40 56 Q49 51 60 56"/>
      </g>
    `),

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
  rain: () =>
    wrap(`
      <g fill="#5dd6e0" stroke="#0c447c" stroke-width="2" stroke-linejoin="round">
        <path d="M14 36 C17 43 20 46 20 50 A6 6 0 0 1 8 50 C8 46 11 43 14 36 Z"/>
        <path d="M32 40 C35 47 38 50 38 54 A6 6 0 0 1 26 54 C26 50 29 47 32 40 Z"/>
        <path d="M50 36 C53 43 56 46 56 50 A6 6 0 0 1 44 50 C44 46 47 43 50 36 Z"/>
      </g>
      <g fill="#b8b8b8">
        <circle cx="19" cy="21" r="11"/>
        <circle cx="33" cy="16" r="13"/>
        <circle cx="46" cy="22" r="10"/>
        <rect x="8" y="20" width="47" height="13" rx="6"/>
      </g>
      <rect x="12" y="27" width="40" height="6" rx="3" fill="#8e8e96"/>
    `),

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

  // A pouring jug. `cup` is a small red cylinder with a token handle, so
  // this is built from the two features a cup does not have: a beaked
  // pouring lip that juts past the body outline, and a handle loop large
  // enough to show daylight through it. Green ceramic keeps it out of the
  // red `cup` / black `pot` / red `jam` vessel palette.
  jug: () => {
    const clipId = nextId('jug-clip')
    const body =
      'M12 13 L24 21 Q14 30 14 44 Q14 57 32 57 Q50 57 50 44 Q50 30 42 21 L42 14 Z'
    return wrap(`
      <path d="M45 24 Q58 28 58 37 Q58 46 46 48" fill="none" stroke="#2c2c2a" stroke-width="10.5" stroke-linecap="round"/>
      <path d="M45 24 Q58 28 58 37 Q58 46 46 48" fill="none" stroke="#3b9922" stroke-width="6" stroke-linecap="round"/>
      <clipPath id="${clipId}"><path d="${body}"/></clipPath>
      <path d="${body}" fill="#3b9922"/>
      <rect x="10" y="36" width="44" height="8" fill="#f5f2ea" clip-path="url(#${clipId})"/>
      <path d="${body}" fill="none" stroke="#2c2c2a" stroke-width="2.6" stroke-linejoin="round"/>
      <ellipse cx="27" cy="15" rx="15" ry="4" fill="#eafcff" stroke="#2c2c2a" stroke-width="2"/>
    `)
  },

  // Sailboat: two triangular sails over a trapezoid hull, on water. Nothing
  // about it can reach `bus`/`car` (no wheels, no windows) or `fish` (the
  // blue oval body) -- the mast plus sail triangles dominate the outline,
  // and the navy wave line is the second "this floats" cue after the hull.
  boat: () =>
    wrap(`
      <polygon points="33,4 44,7.5 33,11" fill="#ffd43b"/>
      <rect x="30.5" y="8" width="3.5" height="33" fill="#8a5a33"/>
      <polygon points="35,10 35,38 55,38" fill="#f5f2ea" stroke="#b8b8b8" stroke-width="1.8"/>
      <polygon points="29,13 29,38 13,38" fill="#e24b4a"/>
      <polygon points="6,40 58,40 50,52 14,52" fill="#712b13"/>
      <rect x="6" y="40" width="52" height="4" fill="#f4c95d"/>
      <path d="M2 57 Q10 52 18 57 Q26 62 34 57 Q42 52 50 57 Q58 62 62 57"
        fill="none" stroke="#0c447c" stroke-width="3.4" stroke-linecap="round"/>
    `),

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
