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

  sock: () =>
    wrap(`
      <path d="M24 6 H38 V32 Q38 36 44 38 L56 44 Q58 48 54 50 H26 Q20 50 20 44 V6 Z"
        fill="#f5f2ea"/>
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
        <path d="M21 10 Q22 3 28 1"/>
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

  pig: () =>
    wrap(`
      <polygon points="13,12 27,10 24,26" fill="#dd7f9a"/>
      <polygon points="51,12 37,10 40,26" fill="#dd7f9a"/>
      <circle cx="32" cy="34" r="21" fill="#f0a0b4"/>
      <ellipse cx="32" cy="42" rx="13" ry="10" fill="#dd7f9a"/>
      <ellipse cx="27" cy="42" rx="3" ry="4" fill="#2c2c2a"/>
      <ellipse cx="37" cy="42" rx="3" ry="4" fill="#2c2c2a"/>
      <circle cx="23" cy="27" r="3.4" fill="#2c2c2a"/>
      <circle cx="41" cy="27" r="3.4" fill="#2c2c2a"/>
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
      ${pin(22, 10, 0.66)}
      ${pin(42, 10, 0.66)}
      ${pin(32, 15, 0.86)}
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
        <ellipse cx="9" cy="31" rx="5.6" ry="13" transform="rotate(-38 9 31)"/>
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
      <path d="M32 46 Q41 51 34 56 Q27 61 34 63" fill="none" stroke="#2c2c2a"
        stroke-width="2.8" stroke-linecap="round"/>
      <polygon points="34,48 42,45 42,53" fill="#5dd6e0"/>
      <polygon points="28,55 35,52 35,60" fill="#5dd6e0"/>
    `),

  // Two rows of five: a child can subitize the fives instead of counting ten
  // scattered dots, and no numeral is drawn -- a "10" glyph next to letter
  // tiles is exactly the kind of fake character a phonics app must avoid.
  ten: () =>
    wrap(`
      <g fill="#e24b4a">
        <circle cx="8" cy="22" r="5.6"/>
        <circle cx="20" cy="22" r="5.6"/>
        <circle cx="32" cy="22" r="5.6"/>
        <circle cx="44" cy="22" r="5.6"/>
        <circle cx="56" cy="22" r="5.6"/>
      </g>
      <g fill="#ef9f27">
        <circle cx="8" cy="42" r="5.6"/>
        <circle cx="20" cy="42" r="5.6"/>
        <circle cx="32" cy="42" r="5.6"/>
        <circle cx="44" cy="42" r="5.6"/>
        <circle cx="56" cy="42" r="5.6"/>
      </g>
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
      <path d="M16 42 Q4 46 4 56 Q4 64 14 62" fill="none" stroke="#e0a273" stroke-width="4.5" stroke-linecap="round"/>
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

  // A long flat stick (pale) with a striped foil wrapper peeled back at one
  // corner -- horizontal and low where `gift` is a tall knotted box, so the
  // two /g/ words never trade places even at 60px. An earlier draft used two
  // opposing triangles for the peeled foil and read as a flashlight/arrow;
  // a single lifted parallelogram flap avoids that directional look.
  gum: () =>
    wrap(`
      <rect x="9" y="27" width="46" height="13" rx="6" fill="#fdf6ec" stroke="#d8cfb8" stroke-width="1.6"/>
      <rect x="7" y="25" width="26" height="17" rx="4" fill="#378add"/>
      <line x1="16" y1="25" x2="16" y2="42" stroke="#eafcff" stroke-width="2"/>
      <line x1="25" y1="25" x2="25" y2="42" stroke="#eafcff" stroke-width="2"/>
      <path d="M30 25 L40 19 L41 26 L31 32 Z" fill="#5dd6e0"/>
    `),

  // Big head-and-eyes plus five curling tentacles with suction-cup dots --
  // legs kept to five (not eight) so they stay separated at 60px, and cool
  // purple keeps it off every warm-toned animal icon already in the set.
  octopus: () =>
    wrap(`
      <ellipse cx="32" cy="27" rx="23" ry="19" fill="#534ab7"/>
      <circle cx="23" cy="24" r="7.5" fill="#eafcff"/>
      <circle cx="41" cy="24" r="7.5" fill="#eafcff"/>
      <circle cx="23" cy="25" r="3.8" fill="#2c2c2a"/>
      <circle cx="41" cy="25" r="3.8" fill="#2c2c2a"/>
      <g stroke="#443a99" stroke-width="6" fill="none" stroke-linecap="round">
        <path d="M12 38 Q6 48 12 58"/>
        <path d="M22 42 Q19 52 24 60"/>
        <path d="M32 43 Q32 53 32 61"/>
        <path d="M42 42 Q45 52 40 60"/>
        <path d="M52 38 Q58 48 52 58"/>
      </g>
      <g fill="#eafcff">
        <circle cx="12" cy="53" r="2.4"/>
        <circle cx="24" cy="55" r="2.4"/>
        <circle cx="40" cy="55" r="2.4"/>
        <circle cx="52" cy="53" r="2.4"/>
      </g>
    `),

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

  // A bent knee (thigh, round joint, offset shin) ending in a shoe --
  // built from solid blocks, not five parallel fingers, so it can never be
  // mistaken for `hand`. The shorts band anchors it as a leg, not an arm.
  leg: () =>
    wrap(`
      <rect x="21" y="14" width="18" height="26" rx="8" fill="#e0a273"/>
      <rect x="19" y="4" width="22" height="14" rx="6" fill="#378add"/>
      <circle cx="30" cy="38" r="10" fill="#e0a273"/>
      <rect x="28" y="34" width="16" height="24" rx="8" fill="#e0a273"/>
      <ellipse cx="44" cy="58" rx="15" ry="7" fill="#2c2c2a"/>
      <rect x="31" y="60" width="26" height="4" rx="2" fill="#b8b8b8"/>
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
  fan: () =>
    wrap(`
      <rect x="26" y="46" width="12" height="14" rx="3" fill="#b8b8b8"/>
      <rect x="18" y="58" width="28" height="5" rx="2.5" fill="#b8b8b8"/>
      <circle cx="32" cy="30" r="26" fill="none" stroke="#b8b8b8" stroke-width="4"/>
      <g fill="#f4c95d">
        <path d="M32 30 Q32 8 46 10 Q40 24 32 30 Z"/>
        <path d="M32 30 Q52 34 48 50 Q34 44 32 30 Z"/>
        <path d="M32 30 Q12 40 16 54 Q28 46 32 30 Z"/>
      </g>
      <circle cx="32" cy="30" r="5" fill="#712b13"/>
    `),

  // A solid orange sphere with basketball-style seam curves, not the
  // cream-and-red bowling `pin` -- round silhouette and a warm solid color
  // that shares nothing with pin's white cylinder + red stripes.
  ball: () =>
    wrap(`
      <circle cx="32" cy="32" r="26" fill="#ef9f27"/>
      <path d="M32 6 Q20 32 32 58" fill="none" stroke="#2c2c2a" stroke-width="2.4"/>
      <path d="M32 6 Q44 32 32 58" fill="none" stroke="#2c2c2a" stroke-width="2.4"/>
      <path d="M6 32 Q32 22 58 32" fill="none" stroke="#2c2c2a" stroke-width="2.4"/>
      <path d="M18 15 Q23 10 29 11" fill="none" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.6"/>
    `),

  // A ribbon-less corrugated shipping box: a folded-flap ridge on top and
  // a cream tape cross instead of `gift`'s bow, and a flat rectangular body
  // instead of `pot`'s handled, lidded silhouette.
  box: () =>
    wrap(`
      <rect x="8" y="24" width="48" height="34" rx="2" fill="#c9975c"/>
      <rect x="8" y="24" width="48" height="34" rx="2" fill="none" stroke="#8a5a33" stroke-width="2"/>
      <polygon points="8,24 32,14 56,24 32,32" fill="#b8874f"/>
      <polygon points="8,24 32,32 32,14" fill="#8a5a33" opacity="0.35"/>
      <rect x="27" y="14" width="10" height="44" fill="#d8cfb8" opacity="0.9"/>
      <rect x="8" y="37" width="48" height="8" fill="#d8cfb8" opacity="0.9"/>
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
