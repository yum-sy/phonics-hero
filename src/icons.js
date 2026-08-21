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
      <path d="M14 40 Q14 22 32 22 Q40 22 40 30" fill="none" stroke="#8a5a33" stroke-width="4" stroke-linecap="round" opacity="0"/>
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
