// Original chibi toy-robot SVG art, inspired by the general look of Korean
// transforming-robot toy shows (chunky rounded bodies, big eyes, bold primary
// colors, chest emblem) — no copied character designs, logos, or names.

function svgWrap(inner, viewBox = '0 0 120 120') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

// A "cool" action-figure-proportioned hero robot: broad angular shoulders,
// a tapered torso, a visored head instead of round cartoon eyes, standing
// tall rather than chibi-round. Proportions only nod at the general look of
// Korean toy-robot shows — no copied character design.
export function heroRobot({
  bodyColor = '#378add',
  accent = '#0c447c',
  emblem = 'S',
  visorColor = '#eafcff',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="26" ry="6" fill="#000" opacity="0.08"/>
      <rect x="42" y="100" width="14" height="30" rx="4" fill="${accent}"/>
      <rect x="64" y="100" width="14" height="30" rx="4" fill="${accent}"/>
      <rect x="39" y="124" width="18" height="10" rx="3" fill="${bodyColor}"/>
      <rect x="63" y="124" width="18" height="10" rx="3" fill="${bodyColor}"/>
      <polygon points="34,58 86,58 78,100 42,100" fill="${bodyColor}"/>
      <polygon points="46,66 74,66 70,88 50,88" fill="#fff"/>
      <circle cx="60" cy="76" r="10" fill="#fff"/>
      <text x="60" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="${accent}">${emblem}</text>
      <rect x="16" y="54" width="22" height="20" rx="8" fill="${accent}"/>
      <rect x="82" y="54" width="22" height="20" rx="8" fill="${accent}"/>
      <rect x="18" y="72" width="14" height="26" rx="6" fill="${bodyColor}"/>
      <rect x="88" y="72" width="14" height="26" rx="6" fill="${bodyColor}"/>
      <rect x="50" y="44" width="20" height="12" fill="${accent}"/>
      <rect x="38" y="16" width="44" height="34" rx="12" fill="${bodyColor}"/>
      <rect x="44" y="30" width="32" height="9" rx="4" fill="${visorColor}"/>
      <rect x="57" y="4" width="6" height="12" rx="3" fill="${accent}"/>
      <circle cx="60" cy="4" r="5" fill="#ffd43b"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// A flashier "final form" hero robot: angular armor, back wings/fins, gold
// trim and a sharp visor — an original design, only borrowing the general
// red/white/gold toy-robot color language, not any specific product's shape.
export function heroDeluxeRobot({
  bodyColor = '#d1332f',
  panelColor = '#f5f2ea',
  accent = '#f4c95d',
  visorColor = '#5dd6e0',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="26" ry="6" fill="#000" opacity="0.1"/>
      <rect x="42" y="100" width="14" height="30" rx="4" fill="${accent}"/>
      <rect x="64" y="100" width="14" height="30" rx="4" fill="${accent}"/>
      <rect x="39" y="124" width="18" height="10" rx="3" fill="${bodyColor}"/>
      <rect x="63" y="124" width="18" height="10" rx="3" fill="${bodyColor}"/>
      <polygon points="30,64 2,44 16,72 30,80" fill="${bodyColor}"/>
      <polygon points="30,64 10,48 20,70" fill="${accent}" opacity="0.7"/>
      <polygon points="90,64 118,44 104,72 90,80" fill="${bodyColor}"/>
      <polygon points="90,64 110,48 100,70" fill="${accent}" opacity="0.7"/>
      <polygon points="34,58 86,58 78,100 42,100" fill="${bodyColor}"/>
      <polygon points="46,66 74,66 70,88 50,88" fill="${panelColor}"/>
      <circle cx="60" cy="76" r="10" fill="${panelColor}"/>
      <text x="60" y="80" text-anchor="middle" font-size="13" font-weight="800" fill="${accent}">★</text>
      <rect x="16" y="54" width="22" height="20" rx="8" fill="${accent}"/>
      <rect x="82" y="54" width="22" height="20" rx="8" fill="${accent}"/>
      <rect x="18" y="72" width="14" height="26" rx="6" fill="${bodyColor}"/>
      <rect x="88" y="72" width="14" height="26" rx="6" fill="${bodyColor}"/>
      <rect x="50" y="44" width="20" height="12" fill="${accent}"/>
      <rect x="38" y="16" width="44" height="34" rx="12" fill="${bodyColor}"/>
      <rect x="44" y="30" width="32" height="9" rx="4" fill="${visorColor}"/>
      <polygon points="52,16 60,2 68,16" fill="${accent}"/>
      <rect x="57" y="4" width="6" height="10" rx="3" fill="${accent}"/>
      <circle cx="60" cy="4" r="4" fill="${visorColor}"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// A menacing action-figure-proportioned villain robot: same broad-shoulder,
// tapered-torso silhouette as the heroes, but with a spiky crown, slanted
// angry eyes and a jagged mouth instead of a friendly visor.
export function villainRobot({ bodyColor = '#e24b4a', accent = '#791f1f' } = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="26" ry="6" fill="#000" opacity="0.1"/>
      <rect x="42" y="100" width="14" height="30" rx="4" fill="${accent}"/>
      <rect x="64" y="100" width="14" height="30" rx="4" fill="${accent}"/>
      <rect x="39" y="124" width="18" height="10" rx="3" fill="${bodyColor}"/>
      <rect x="63" y="124" width="18" height="10" rx="3" fill="${bodyColor}"/>
      <polygon points="34,58 86,58 78,100 42,100" fill="${bodyColor}"/>
      <polygon points="46,66 74,66 70,88 50,88" fill="#2c2c2a" opacity="0.35"/>
      <polygon points="14,50 38,58 38,74 20,74" fill="${accent}"/>
      <polygon points="106,50 82,58 82,74 100,74" fill="${accent}"/>
      <rect x="18" y="72" width="14" height="26" rx="6" fill="${bodyColor}"/>
      <rect x="88" y="72" width="14" height="26" rx="6" fill="${bodyColor}"/>
      <rect x="50" y="44" width="20" height="12" fill="${accent}"/>
      <rect x="38" y="16" width="44" height="34" rx="10" fill="${bodyColor}"/>
      <polygon points="40,16 46,2 52,16" fill="${accent}"/>
      <polygon points="54,16 60,0 66,16" fill="${accent}"/>
      <polygon points="68,16 74,2 80,16" fill="${accent}"/>
      <polygon points="45,30 58,26 58,34 45,36" fill="#1c1c1c"/>
      <polygon points="75,30 62,26 62,34 75,36" fill="#1c1c1c"/>
      <path d="M47 44 L53 40 L60 44 L67 40 L73 44" stroke="#1c1c1c" stroke-width="3" fill="none" stroke-linecap="round"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// A menacing "boss form" villain: dark cape, samurai-style rounded helmet
// with a glowing visor, a diagonal staff — an original design, only
// borrowing the general dark-armor/cape/staff silhouette language, not any
// specific costume or character's exact shape.
export function villainDeluxeRobot({
  bodyColor = '#2c2c2a',
  accent = '#b8b8b8',
  capeColor = '#1c1c1c',
  visorColor = '#e24b4a',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="34" ry="7" fill="#000" opacity="0.12"/>
      <polygon points="70,46 104,64 92,124 66,96" fill="${capeColor}"/>
      <polygon points="70,46 100,60 92,64 68,52" fill="${accent}" opacity="0.5"/>
      <polygon points="42,96 34,124 48,128 54,100" fill="${bodyColor}"/>
      <polygon points="72,96 78,124 64,128 60,100" fill="${bodyColor}"/>
      <polygon points="16,102 12,94 92,22 98,30" fill="${accent}"/>
      <circle cx="14" cy="98" r="7" fill="${accent}"/>
      <circle cx="96" cy="26" r="7" fill="${accent}"/>
      <polygon points="42,56 78,56 84,88 60,100 36,88" fill="${bodyColor}"/>
      <polygon points="48,64 72,64 76,84 60,92 44,84" fill="#3a3a38"/>
      <path d="M60 92 a8 8 0 1 0 0 16 a6 6 0 1 1 0 -16 Z" fill="${accent}"/>
      <circle cx="60" cy="30" r="23" fill="${bodyColor}"/>
      <polygon points="42,10 60,2 78,10 70,20 50,20" fill="${accent}"/>
      <circle cx="60" cy="31" r="12" fill="#161615"/>
      <circle cx="60" cy="31" r="8" fill="${visorColor}"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// A rounder, chibi-caped "superhero" hero: big round head and torso instead
// of the transforming-robot's angular shoulder blocks, a flowing cape, a
// domino mask, and a chest emblem badge. An original silhouette that only
// borrows the general cape/mask/chest-emblem color language of the
// superhero-comic genre — no specific costume, cowl shape, or logo copied.
export function heroSuperhero({
  bodyColor = '#3a63c7',
  accent = '#f4c95d',
  capeColor = '#d1332f',
  maskColor = '#1c1c1c',
  emblem = '★',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="26" ry="6" fill="#000" opacity="0.08"/>
      <polygon points="42,56 16,118 44,104 60,132 76,104 104,118 78,56" fill="${capeColor}"/>
      <rect x="44" y="100" width="14" height="26" rx="7" fill="${accent}"/>
      <rect x="62" y="100" width="14" height="26" rx="7" fill="${accent}"/>
      <rect x="40" y="120" width="20" height="12" rx="6" fill="${capeColor}"/>
      <rect x="60" y="120" width="20" height="12" rx="6" fill="${capeColor}"/>
      <rect x="34" y="52" width="52" height="56" rx="26" fill="${bodyColor}"/>
      <rect x="34" y="92" width="52" height="10" rx="5" fill="${accent}"/>
      <circle cx="60" cy="74" r="13" fill="#fff"/>
      <text x="60" y="79" text-anchor="middle" font-size="15" font-weight="800" fill="${bodyColor}">${emblem}</text>
      <circle cx="28" cy="68" r="12" fill="${bodyColor}"/>
      <circle cx="92" cy="68" r="12" fill="${bodyColor}"/>
      <rect x="20" y="76" width="16" height="10" rx="5" fill="${accent}"/>
      <rect x="84" y="76" width="16" height="10" rx="5" fill="${accent}"/>
      <circle cx="60" cy="32" r="27" fill="${bodyColor}"/>
      <path d="M35 30 Q60 18 85 30 Q83 40 60 38 Q37 40 35 30 Z" fill="${maskColor}"/>
      <circle cx="49" cy="30" r="3.4" fill="#fff"/>
      <circle cx="71" cy="30" r="3.4" fill="#fff"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// Four hero archetypes for chapter 2 onward. heroSuperhero draws every
// caped hero with one silhouette, so a chapter's four heroes came out as the
// same figure in four colors -- unreadable for a 5-year-old. Each of these
// carries one dominant prop or shape that survives at 60px: mask lenses,
// round shield, winged helm + hammer, bulk + chest core. All are generic
// genre/mythology motifs (acrobat, shield-bearer, Norse thunder god, powered
// armor); no specific character, costume, logo, or color scheme is copied.

// The acrobat: slim suit, full-face mask with big angular lenses (the app's
// only mask-eyes silhouette), no cape, one arm thrown forward mid-leap.
// Having no cape, `capeColor` doubles as the darker panel tone.
export function heroAcrobat({
  bodyColor = '#3a63c7',
  accent = '#f4c95d',
  capeColor = '#1f3c88',
  maskColor = bodyColor,
  emblem = 'I',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="58" cy="132" rx="22" ry="5" fill="#000" opacity="0.08"/>
      <polygon points="50,94 60,94 56,126 46,124" fill="${capeColor}"/>
      <polygon points="60,94 70,94 74,124 64,126" fill="${capeColor}"/>
      <rect x="38" y="119" width="21" height="11" rx="5" fill="${accent}"/>
      <rect x="61" y="121" width="21" height="11" rx="5" fill="${accent}"/>
      <polygon points="42,56 51,63 38,94 28,89" fill="${bodyColor}"/>
      <circle cx="32" cy="93" r="7" fill="${accent}"/>
      <polygon points="48,58 72,58 68,98 52,98" fill="${bodyColor}"/>
      <path d="M50 63 L60 72 L70 63" fill="none" stroke="${capeColor}" stroke-width="3.5"/>
      <circle cx="60" cy="80" r="9" fill="#fff"/>
      <text x="60" y="85" text-anchor="middle" font-size="12" font-weight="800" fill="${bodyColor}">${emblem}</text>
      <rect x="51" y="90" width="18" height="6" fill="${accent}"/>
      <circle cx="47" cy="61" r="8" fill="${bodyColor}"/>
      <circle cx="73" cy="61" r="8" fill="${bodyColor}"/>
      <rect x="76" y="56" width="32" height="11" rx="5" fill="${bodyColor}"/>
      <circle cx="106" cy="61" r="8" fill="${accent}"/>
      <circle cx="60" cy="32" r="19" fill="${maskColor}"/>
      <polygon points="47,26 58,30 56,41 46,37" fill="#fff" stroke="${capeColor}" stroke-width="2"/>
      <polygon points="73,26 62,30 64,41 74,37" fill="#fff" stroke="${capeColor}" stroke-width="2"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// The shield-bearer: a big concentric round shield is the whole read, so it
// is drawn last and largest and the body sits off-center to clear it. The
// emblem letter rides the shield boss rather than a small chest badge --
// biggest, highest-contrast spot in the figure for the letter being taught.
// No cape, so `capeColor` becomes the boots.
export function heroShield({
  bodyColor = '#d1332f',
  accent = '#ffd43b',
  capeColor = '#791f1f',
  maskColor = '#2c2c2a',
  emblem = 'P',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="66" cy="132" rx="24" ry="5" fill="#000" opacity="0.08"/>
      <rect x="56" y="98" width="14" height="24" rx="3" fill="${bodyColor}"/>
      <rect x="72" y="98" width="14" height="24" rx="3" fill="${bodyColor}"/>
      <rect x="52" y="118" width="21" height="13" rx="4" fill="${capeColor}"/>
      <rect x="69" y="118" width="21" height="13" rx="4" fill="${capeColor}"/>
      <polygon points="48,58 86,58 82,102 52,102" fill="${bodyColor}"/>
      <rect x="52" y="94" width="30" height="8" fill="${accent}"/>
      <circle cx="50" cy="63" r="10" fill="${bodyColor}"/>
      <circle cx="84" cy="63" r="10" fill="${bodyColor}"/>
      <rect x="36" y="70" width="15" height="24" rx="6" fill="${bodyColor}"/>
      <rect x="84" y="70" width="15" height="26" rx="6" fill="${bodyColor}"/>
      <circle cx="91" cy="98" r="8" fill="${accent}"/>
      <circle cx="67" cy="32" r="19" fill="${bodyColor}"/>
      <polygon points="63,14 67,3 71,14" fill="${accent}"/>
      <rect x="54" y="27" width="26" height="10" rx="5" fill="${maskColor}"/>
      <circle cx="61" cy="32" r="3" fill="#fff"/>
      <circle cx="74" cy="32" r="3" fill="#fff"/>
      <circle cx="34" cy="76" r="25" fill="${accent}"/>
      <circle cx="34" cy="76" r="19" fill="${bodyColor}"/>
      <circle cx="34" cy="76" r="13" fill="#f5f2ea"/>
      <text x="34" y="83" text-anchor="middle" font-size="19" font-weight="800" fill="${bodyColor}">${emblem}</text>
    </g>
  `,
    '0 0 120 140'
  )
}

// The thunder god: winged helm plus a blocky short-handled hammer, flowing
// cape, armor discs. Norse mythology motifs, public domain. Bolts stay a
// fixed warm yellow so they read even when `accent` is a pale trim color.
export function heroThunder({
  bodyColor = '#2f8f6b',
  accent = '#eafcff',
  capeColor = '#14513c',
  maskColor = '#b8b8b8',
  emblem = 'N',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="24" ry="5" fill="#000" opacity="0.08"/>
      <polygon points="15.2,6 8,21.6 12.8,21.6 10.4,34.8 20,16.8 14,16.8 17.6,6" fill="#ffd43b"/>
      <polygon points="44,56 12,116 44,102 60,132 76,102 108,116 78,56" fill="${capeColor}"/>
      <rect x="48" y="96" width="14" height="26" rx="3" fill="${bodyColor}"/>
      <rect x="62" y="96" width="14" height="26" rx="3" fill="${bodyColor}"/>
      <rect x="44" y="118" width="21" height="13" rx="4" fill="${maskColor}"/>
      <rect x="59" y="118" width="21" height="13" rx="4" fill="${maskColor}"/>
      <polygon points="44,58 78,58 74,100 48,100" fill="${bodyColor}"/>
      <circle cx="52" cy="67" r="4.5" fill="${maskColor}"/>
      <circle cx="70" cy="67" r="4.5" fill="${maskColor}"/>
      <circle cx="53" cy="82" r="4.5" fill="${maskColor}"/>
      <circle cx="69" cy="82" r="4.5" fill="${maskColor}"/>
      <rect x="47" y="90" width="28" height="7" fill="${accent}"/>
      <circle cx="61" cy="74" r="9" fill="#fff"/>
      <text x="61" y="79" text-anchor="middle" font-size="12" font-weight="800" fill="${bodyColor}">${emblem}</text>
      <rect x="32" y="66" width="13" height="28" rx="6" fill="${bodyColor}"/>
      <circle cx="38" cy="96" r="7" fill="${maskColor}"/>
      <circle cx="46" cy="62" r="9" fill="${bodyColor}"/>
      <circle cx="76" cy="62" r="9" fill="${bodyColor}"/>
      <polygon points="42,28 24,18 28,34 38,36" fill="${maskColor}"/>
      <polygon points="78,28 96,18 92,34 82,36" fill="${maskColor}"/>
      <circle cx="60" cy="32" r="19" fill="${bodyColor}"/>
      <path d="M41 32 A19 19 0 0 1 79 32 Z" fill="${maskColor}"/>
      <circle cx="53" cy="38" r="3.6" fill="#fff"/>
      <circle cx="67" cy="38" r="3.6" fill="#fff"/>
      <circle cx="53" cy="38" r="1.6" fill="#2c2c2a"/>
      <circle cx="67" cy="38" r="1.6" fill="#2c2c2a"/>
      <polygon points="72,54 84,62 102,42 92,32" fill="${bodyColor}"/>
      <circle cx="97" cy="37" r="8" fill="${maskColor}"/>
      <rect x="93" y="16" width="8" height="26" rx="3" fill="#712b13"/>
      <rect x="80" y="2" width="36" height="18" rx="3" fill="${maskColor}"/>
      <rect x="80" y="2" width="7" height="18" fill="#2c2c2a"/>
      <rect x="109" y="2" width="7" height="18" fill="#2c2c2a"/>
      <polygon points="112.4,20 104,38.2 109.6,38.2 106.8,53.6 118,32.6 111,32.6 115.2,20" fill="#ffd43b"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// The powered armor: deliberately the heaviest silhouette of the four --
// widest torso, huge pauldrons, thruster flames -- for a chapter-boss
// combined form. Glow is flat concentric circles, never a gradient.
export function heroPoweredArmor({
  bodyColor = '#534ab7',
  accent = '#f4c95d',
  panelColor = '#b8b8b8',
  visorColor = '#5dd6e0',
  capeColor = '#d1332f',
  maskColor = '#2c2c2a',
  emblem = '★',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="134" rx="32" ry="6" fill="#000" opacity="0.12"/>
      <polygon points="34,52 18,86 40,78 60,84 80,78 102,86 86,52" fill="${capeColor}"/>
      <polygon points="40,124 54,124 47,139" fill="#f4a71b"/>
      <polygon points="43,124 51,124 47,134" fill="#ffd43b"/>
      <polygon points="66,124 80,124 73,139" fill="#f4a71b"/>
      <polygon points="69,124 77,124 73,134" fill="#ffd43b"/>
      <rect x="41" y="94" width="17" height="24" rx="4" fill="${bodyColor}"/>
      <rect x="62" y="94" width="17" height="24" rx="4" fill="${bodyColor}"/>
      <rect x="41" y="104" width="17" height="6" fill="${panelColor}"/>
      <rect x="62" y="104" width="17" height="6" fill="${panelColor}"/>
      <rect x="37" y="112" width="23" height="13" rx="4" fill="${panelColor}"/>
      <rect x="60" y="112" width="23" height="13" rx="4" fill="${panelColor}"/>
      <polygon points="32,52 88,52 82,100 38,100" fill="${bodyColor}"/>
      <polygon points="35,55 50,55 48,74 37,70" fill="${panelColor}"/>
      <polygon points="85,55 70,55 72,74 83,70" fill="${panelColor}"/>
      <rect x="40" y="86" width="40" height="5" fill="${panelColor}"/>
      <rect x="41" y="93" width="38" height="5" fill="${panelColor}"/>
      <circle cx="60" cy="70" r="14" fill="${accent}"/>
      <circle cx="60" cy="70" r="10" fill="${visorColor}"/>
      <circle cx="60" cy="70" r="6" fill="#fff"/>
      <text x="60" y="74" text-anchor="middle" font-size="10" font-weight="800" fill="${bodyColor}">${emblem}</text>
      <rect x="18" y="40" width="9" height="9" rx="2" fill="${maskColor}"/>
      <rect x="93" y="40" width="9" height="9" rx="2" fill="${maskColor}"/>
      <rect x="12" y="46" width="28" height="24" rx="8" fill="${panelColor}"/>
      <rect x="80" y="46" width="28" height="24" rx="8" fill="${panelColor}"/>
      <rect x="12" y="57" width="28" height="3" fill="${bodyColor}"/>
      <rect x="80" y="57" width="28" height="3" fill="${bodyColor}"/>
      <rect x="16" y="66" width="18" height="30" rx="6" fill="${bodyColor}"/>
      <rect x="86" y="66" width="18" height="30" rx="6" fill="${bodyColor}"/>
      <rect x="16" y="80" width="18" height="6" fill="${panelColor}"/>
      <rect x="86" y="80" width="18" height="6" fill="${panelColor}"/>
      <circle cx="25" cy="100" r="9" fill="${panelColor}"/>
      <circle cx="25" cy="100" r="5" fill="${visorColor}"/>
      <circle cx="25" cy="100" r="2.5" fill="#fff"/>
      <circle cx="95" cy="100" r="9" fill="${panelColor}"/>
      <circle cx="95" cy="100" r="5" fill="${visorColor}"/>
      <circle cx="95" cy="100" r="2.5" fill="#fff"/>
      <rect x="54" y="42" width="12" height="12" fill="${maskColor}"/>
      <rect x="41" y="14" width="9" height="26" rx="4" fill="${bodyColor}"/>
      <rect x="70" y="14" width="9" height="26" rx="4" fill="${bodyColor}"/>
      <rect x="44" y="10" width="32" height="34" rx="10" fill="${accent}"/>
      <rect x="48" y="25" width="24" height="6" rx="3" fill="${visorColor}"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// A rounder "supervillain" counterpart to heroSuperhero: same big-head/big-
// torso chibi base, but a spiky dark collar instead of a soft cape, and
// slanted angry eye-shapes cut into a jagged brow-crown instead of a
// friendly mask. An original design, only nodding at the general
// dark-supervillain color/silhouette language — no specific costume.
export function villainSuperhero({
  bodyColor = '#4b3f6b',
  accent = '#211b33',
  collarColor = '#1c1c1c',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="26" ry="6" fill="#000" opacity="0.1"/>
      <polygon points="60,50 14,90 40,80 60,130 80,80 106,90" fill="${collarColor}"/>
      <rect x="44" y="100" width="14" height="26" rx="7" fill="${accent}"/>
      <rect x="62" y="100" width="14" height="26" rx="7" fill="${accent}"/>
      <rect x="40" y="120" width="20" height="12" rx="6" fill="${collarColor}"/>
      <rect x="60" y="120" width="20" height="12" rx="6" fill="${collarColor}"/>
      <rect x="34" y="52" width="52" height="56" rx="24" fill="${bodyColor}"/>
      <rect x="34" y="92" width="52" height="10" rx="5" fill="${accent}"/>
      <polygon points="52,68 68,68 64,84 56,84" fill="${accent}" opacity="0.6"/>
      <circle cx="28" cy="68" r="12" fill="${bodyColor}"/>
      <circle cx="92" cy="68" r="12" fill="${bodyColor}"/>
      <polygon points="18,58 38,50 44,64 26,74" fill="${collarColor}"/>
      <polygon points="102,58 82,50 76,64 94,74" fill="${collarColor}"/>
      <circle cx="60" cy="32" r="27" fill="${bodyColor}"/>
      <polygon points="34,28 60,16 86,28 82,38 60,32 38,38" fill="${collarColor}"/>
      <polygon points="44,28 56,32 44,36" fill="#e24b4a"/>
      <polygon points="76,28 64,32 76,36" fill="#e24b4a"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// Fallback palettes keyed by character name, for chapter data that names a
// character without spelling out its colors. Entries may also carry a
// `style`, which is how a bare name still resolves to a non-robot art
// function. Boss entries deliberately carry no colors so they render with
// their deluxe art's own signature palette.
const HERO_PALETTES = {
  '새미': { bodyColor: '#3b9922', accent: '#27500a', emblem: 'S' },
  '에이스': { bodyColor: '#ef9f27', accent: '#854f0b', emblem: 'A' },
  '터보': { bodyColor: '#378add', accent: '#0c447c', emblem: 'T' },
  '카본': { style: 'robot-deluxe' },
  '잉키': { style: 'superhero-acrobat', bodyColor: '#3a63c7', accent: '#f4c95d', capeColor: '#1f3c88', emblem: 'I' },
  '파워피': { style: 'superhero-shield', bodyColor: '#d1332f', accent: '#ffd43b', capeColor: '#791f1f', emblem: 'P' },
  '나이토': { style: 'superhero-thunder', bodyColor: '#2f8f6b', accent: '#eafcff', capeColor: '#14513c', emblem: 'N' },
  '캡틴핀': { style: 'superhero-armor', bodyColor: '#534ab7', accent: '#f4c95d', capeColor: '#d1332f', emblem: '★' },
}

const VILLAIN_PALETTES = {
  '노이즈봇': { bodyColor: '#888780', accent: '#444441' },
  '무음괴물': { bodyColor: '#7f77dd', accent: '#3c3489' },
  '그림자봇': { bodyColor: '#5f5e5a', accent: '#2c2c2a' },
  '타이머봇': { bodyColor: '#d85a30', accent: '#712b13' },
  '다크스파크': { style: 'robot-deluxe' },
  '흐림괴물': { style: 'superhero', bodyColor: '#7a8b99', accent: '#3d4852', collarColor: '#222a30' },
  '지우개맨': { style: 'superhero', bodyColor: '#c96a9b', accent: '#6b2f4c', collarColor: '#2a1420' },
  '멈춤맨': { style: 'superhero', bodyColor: '#8a7f4b', accent: '#4a4222', collarColor: '#231f10' },
  '뒤죽박죽': { style: 'superhero', bodyColor: '#6b8f3a', accent: '#39501c', collarColor: '#1b260d' },
  '섀도우킹': { style: 'superhero', bodyColor: '#4b3f6b', accent: '#211b33', collarColor: '#1c1c1c' },
}

// style -> art function. Later worlds cycle through more looks (dinosaur,
// platformer, dark-vigilante, jet-pilot, mecha); adding one is a single row
// here plus the art function itself, and any style not yet built keeps
// rendering as `robot` instead of crashing a stage.
const HERO_STYLES = {
  robot: heroRobot,
  'robot-deluxe': heroDeluxeRobot,
  superhero: heroSuperhero,
  'superhero-acrobat': heroAcrobat,
  'superhero-shield': heroShield,
  'superhero-thunder': heroThunder,
  'superhero-armor': heroPoweredArmor,
  // Alias so chapter data authored against the earlier style name for this
  // slot still resolves instead of silently falling back to a robot.
  'superhero-spider': heroAcrobat,
}

const VILLAIN_STYLES = {
  robot: villainRobot,
  'robot-deluxe': villainDeluxeRobot,
  superhero: villainSuperhero,
}

// Styles that name a family rather than a final look. Chapter data written
// before the archetypes existed asks for the family ('superhero'), which
// would render all four of a chapter's heroes as the same figure, so a named
// character's own archetype outranks a family request. A concrete style in
// the data still wins, and an unknown name still gets the family default.
const FAMILY_STYLES = new Set(['superhero'])

// Explicit spec colors win over the name palette, which wins over the art
// function's own defaults. Undefined spec fields are dropped so a partially
// filled chapter entry doesn't blank out palette colors.
function resolveArt(input, palettes, styles) {
  const spec = typeof input === 'string' ? { name: input } : input || {}
  const { style: namedStyle, ...namedColors } = palettes[spec.name] || {}
  const colors = { ...namedColors }
  for (const [key, value] of Object.entries(spec)) {
    if (key !== 'name' && key !== 'style' && value !== undefined) colors[key] = value
  }
  const requested =
    namedStyle && FAMILY_STYLES.has(spec.style) ? namedStyle : spec.style
  const make = styles[requested] || styles[namedStyle] || styles.robot
  return make(colors)
}

export function heroArt(heroOrName) {
  return resolveArt(heroOrName, HERO_PALETTES, HERO_STYLES)
}

export function villainArt(heroOrName) {
  return resolveArt(heroOrName, VILLAIN_PALETTES, VILLAIN_STYLES)
}
