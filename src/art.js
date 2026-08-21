// Character SVG art. Each style family lives in its own module under
// ./art/ once it grows past a couple of functions -- the robot family
// already did (see ./art/robots.js). Everything below is the superhero
// family plus the name/style resolution the rest of the app calls into.

import {
  heroRobot,
  heroDeluxeRobot,
  villainRobot,
  villainDeluxeRobot,
} from './art/robots.js'
import {
  dinoRaptor,
  dinoArmored,
  dinoFlyer,
  dinoHorned,
  dinoBlink,
  dinoEcho,
  dinoUpside,
  dinoSwamp,
  dinoShadowRex,
} from './art/dinosaurs.js'
import {
  platJumper,
  platSpring,
  platBlock,
  platPowerup,
} from './art/platformer.js'

// Shared by every style family defined *in this file*; ./art/robots.js
// keeps its own copy so it stays importable without this module.
function svgWrap(inner, viewBox = '0 0 120 120') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
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
  bodyColor = '#d1332f',
  accent = '#1f3c88',
  capeColor = '#1f3c88',
  maskColor = bodyColor,
  // Web line-work needs its own colour: it has to stay legible on both the
  // suit and the white mask lenses, so it can't reuse any of the above.
  webColor = '#0f2350',
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
      <g stroke="${webColor}" stroke-width="1.5" fill="none" opacity="0.8">
        <line x1="60" y1="58" x2="60" y2="90"/>
        <line x1="50" y1="66" x2="70" y2="66"/>
        <line x1="51" y1="78" x2="69" y2="78"/>
        <line x1="49" y1="60" x2="69" y2="88"/>
        <line x1="71" y1="60" x2="51" y2="88"/>
      </g>
      <circle cx="60" cy="80" r="9" fill="#fff"/>
      <text x="60" y="85" text-anchor="middle" font-size="12" font-weight="800" fill="${bodyColor}">${emblem}</text>
      <rect x="51" y="90" width="18" height="6" fill="${accent}"/>
      <path d="M106 61 L118 50" stroke="#f5f2ea" stroke-width="2.5" fill="none"/>
      <path d="M108 58 L116 56 M110 64 L118 63" stroke="#f5f2ea" stroke-width="1.8" fill="none"/>
      <circle cx="47" cy="61" r="8" fill="${bodyColor}"/>
      <circle cx="73" cy="61" r="8" fill="${bodyColor}"/>
      <rect x="76" y="56" width="32" height="11" rx="5" fill="${bodyColor}"/>
      <circle cx="106" cy="61" r="8" fill="${accent}"/>
      <circle cx="60" cy="32" r="19" fill="${maskColor}"/>
      <g stroke="${webColor}" stroke-width="1.6" fill="none" opacity="0.85">
        <line x1="60" y1="13" x2="60" y2="51"/>
        <line x1="41" y1="32" x2="79" y2="32"/>
        <line x1="47" y1="19" x2="73" y2="45"/>
        <line x1="73" y1="19" x2="47" y2="45"/>
        <circle cx="60" cy="32" r="7"/>
        <circle cx="60" cy="32" r="13"/>
      </g>
      <polygon points="47,26 58,30 56,41 46,37" fill="#fff" stroke="${webColor}" stroke-width="2"/>
      <polygon points="73,26 62,30 64,41 74,37" fill="#fff" stroke="${webColor}" stroke-width="2"/>
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
  bodyColor = '#3a63c7',
  accent = '#f5f2ea',
  capeColor = '#c0272d',
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
      <g>
        <rect x="55" y="82" width="5" height="13" fill="${capeColor}"/>
        <rect x="60" y="82" width="5" height="13" fill="${accent}"/>
        <rect x="65" y="82" width="5" height="13" fill="${capeColor}"/>
        <rect x="70" y="82" width="5" height="13" fill="${accent}"/>
        <rect x="75" y="82" width="5" height="13" fill="${capeColor}"/>
      </g>
      <polygon points="67,62 69.5,68.6 76.5,68.9 71,73.3 72.9,80.1 67,76.2 61.1,80.1 63,73.3 57.5,68.9 64.5,68.6" fill="${accent}"/>
      <rect x="52" y="94" width="30" height="8" fill="${capeColor}"/>
      <circle cx="50" cy="63" r="10" fill="${bodyColor}"/>
      <circle cx="84" cy="63" r="10" fill="${bodyColor}"/>
      <rect x="36" y="70" width="15" height="24" rx="6" fill="${bodyColor}"/>
      <rect x="84" y="70" width="15" height="26" rx="6" fill="${bodyColor}"/>
      <circle cx="91" cy="98" r="8" fill="${accent}"/>
      <circle cx="67" cy="32" r="19" fill="${bodyColor}"/>
      <polygon points="50,22 38,26 50,31" fill="${accent}"/>
      <polygon points="84,22 96,26 84,31" fill="${accent}"/>
      <rect x="54" y="27" width="26" height="10" rx="5" fill="${maskColor}"/>
      <circle cx="61" cy="32" r="3" fill="#fff"/>
      <circle cx="74" cy="32" r="3" fill="#fff"/>
      <circle cx="34" cy="76" r="25" fill="${capeColor}"/>
      <circle cx="34" cy="76" r="18" fill="#f5f2ea"/>
      <circle cx="34" cy="76" r="11" fill="${bodyColor}"/>
      <text x="34" y="81" text-anchor="middle" font-size="14" font-weight="800" fill="#fff">${emblem}</text>
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

// Chapter 2's five villains, one function each. villainSuperhero drew them
// all as the same hooded figure in five colors -- the same flaw the heroes
// had -- and it read as "ninja" rather than "supervillain". Each of these
// instead literalizes what the character's name says it does to the sounds,
// so the picture states the stage's obstacle. Distinction is carried by
// silhouette (formless / blocky / rigid / lopsided / towering), not color,
// and every figure leans, juts or sits off-balance against the heroes'
// upright symmetry.

// 흐림괴물, the blur: a legless ragged fog mass trailing wisps, with sharp
// slanted eyes as the only crisp shapes -- formlessness is the silhouette.
export function villainFog({
  bodyColor = '#7a8b99',
  accent = '#3d4852',
  collarColor = '#222a30',
  eyeColor = '#eafcff',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="24" ry="5" fill="#000" opacity="0.07"/>
      <ellipse cx="60" cy="96" rx="30" ry="10" fill="${bodyColor}" opacity="0.35"/>
      <polygon points="30,72 44,78 34,112 20,94" fill="${bodyColor}" opacity="0.4"/>
      <polygon points="78,74 90,70 94,106 74,92" fill="${bodyColor}" opacity="0.3"/>
      <ellipse cx="57" cy="114" rx="11" ry="6" fill="${bodyColor}" opacity="0.2"/>
      <polygon points="60,12 72,20 84,12 86,28 100,30 92,44 104,54 90,62 98,76 80,74 74,90 60,80 46,92 40,74 24,78 30,62 16,54 28,44 20,30 34,28 40,12 52,20" fill="${bodyColor}"/>
      <polygon points="60,30 72,36 78,50 70,62 58,66 46,60 42,46 50,34" fill="${accent}" opacity="0.5"/>
      <circle cx="13" cy="34" r="5" fill="${bodyColor}" opacity="0.5"/>
      <circle cx="108" cy="68" r="4" fill="${bodyColor}" opacity="0.45"/>
      <circle cx="100" cy="18" r="3.5" fill="${bodyColor}" opacity="0.4"/>
      <polygon points="36,44 58,50 56,64 34,58" fill="${collarColor}"/>
      <polygon points="84,44 62,50 64,64 86,58" fill="${collarColor}"/>
      <polygon points="40,49 53,53 52,59 39,55" fill="${eyeColor}"/>
      <polygon points="80,49 67,53 68,59 81,55" fill="${eyeColor}"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// 지우개맨, the eraser: every shape is a hard rectangle and one arm ends in
// an oversized eraser block, with half-erased marks across the torso and
// crumbs falling from the other hand.
export function villainEraser({
  bodyColor = '#c96a9b',
  accent = '#6b2f4c',
  collarColor = '#2a1420',
  blockColor = '#f5f2ea',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="132" rx="26" ry="5" fill="#000" opacity="0.1"/>
      <rect x="44" y="90" width="14" height="32" fill="${accent}"/>
      <rect x="62" y="90" width="14" height="32" fill="${accent}"/>
      <rect x="38" y="120" width="22" height="11" fill="${collarColor}"/>
      <rect x="60" y="120" width="22" height="11" fill="${collarColor}"/>
      <rect x="40" y="42" width="40" height="50" fill="${bodyColor}"/>
      <rect x="46" y="56" width="12" height="5" fill="${collarColor}"/>
      <rect x="64" y="56" width="7" height="5" fill="${collarColor}"/>
      <rect x="46" y="70" width="6" height="5" fill="${collarColor}"/>
      <rect x="58" y="70" width="16" height="5" fill="${collarColor}"/>
      <rect x="80" y="50" width="15" height="30" fill="${accent}"/>
      <rect x="78" y="78" width="20" height="14" fill="${bodyColor}"/>
      <rect x="82" y="99" width="6" height="6" fill="${collarColor}"/>
      <rect x="92" y="110" width="5" height="5" fill="${collarColor}"/>
      <rect x="84" y="118" width="4" height="4" fill="${collarColor}"/>
      <rect x="95" y="124" width="6" height="6" fill="${collarColor}"/>
      <rect x="30" y="54" width="16" height="14" fill="${accent}"/>
      <rect x="1" y="44" width="35" height="30" fill="${blockColor}" stroke="${collarColor}" stroke-width="3"/>
      <rect x="21" y="44" width="15" height="30" fill="${bodyColor}" stroke="${collarColor}" stroke-width="3"/>
      <polygon points="1,64 13,74 1,74" fill="#b8b8b8"/>
      <rect x="5" y="80" width="5" height="5" fill="${collarColor}"/>
      <rect x="15" y="86" width="4" height="4" fill="${collarColor}"/>
      <rect x="44" y="8" width="32" height="30" fill="${bodyColor}"/>
      <polygon points="48,18 60,23 59,29 47,24" fill="${collarColor}"/>
      <polygon points="72,18 60,23 61,29 73,24" fill="${collarColor}"/>
      <polygon points="50,33 56,36 60,32 64,36 70,32 70,35 50,36" fill="${collarColor}"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// 멈춤맨, the freeze: bolt-upright and exactly mirror-symmetric with
// right-angled limbs, an octagonal stop sign for a chest and a clock face
// with frozen hands. The sign keeps the universal red so a 5-year-old reads
// "stop" instantly; the octagon does the silhouette work either way.
export function villainStop({
  bodyColor = '#8a7f4b',
  accent = '#4a4222',
  collarColor = '#231f10',
  signColor = '#d1332f',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="134" rx="28" ry="5" fill="#000" opacity="0.1"/>
      <rect x="46" y="100" width="13" height="24" fill="${accent}"/>
      <rect x="61" y="100" width="13" height="24" fill="${accent}"/>
      <rect x="38" y="122" width="24" height="11" fill="${collarColor}"/>
      <rect x="58" y="122" width="24" height="11" fill="${collarColor}"/>
      <rect x="24" y="50" width="26" height="13" fill="${accent}"/>
      <rect x="24" y="63" width="13" height="31" fill="${accent}"/>
      <rect x="19" y="92" width="23" height="13" fill="${bodyColor}"/>
      <rect x="70" y="50" width="26" height="13" fill="${accent}"/>
      <rect x="83" y="63" width="13" height="31" fill="${accent}"/>
      <rect x="78" y="92" width="23" height="13" fill="${bodyColor}"/>
      <rect x="42" y="46" width="36" height="56" fill="${bodyColor}"/>
      <polygon points="53,49 67,49 77,59 77,73 67,83 53,83 43,73 43,59" fill="${signColor}"/>
      <rect x="46" y="62" width="28" height="8" fill="#f5f2ea"/>
      <circle cx="60" cy="91" r="9" fill="#f5f2ea"/>
      <rect x="59" y="84" width="2" height="3" fill="${collarColor}"/>
      <rect x="66" y="90" width="3" height="2" fill="${collarColor}"/>
      <rect x="59" y="95" width="2" height="3" fill="${collarColor}"/>
      <rect x="51" y="90" width="3" height="2" fill="${collarColor}"/>
      <path d="M60 91 L54 86" stroke="${collarColor}" stroke-width="2.4" stroke-linecap="round"/>
      <path d="M60 91 L54 93" stroke="${collarColor}" stroke-width="2" stroke-linecap="round"/>
      <polygon points="46,12 74,12 78,40 42,40" fill="${bodyColor}"/>
      <rect x="47" y="22" width="12" height="6" fill="${collarColor}"/>
      <rect x="61" y="22" width="12" height="6" fill="${collarColor}"/>
      <rect x="50" y="34" width="20" height="3" fill="${collarColor}"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// 뒤죽박죽, the scrambler: mismatched limbs, misaligned torso panels, stitch
// marks and odd-sized eyes, and the whole figure tilts -- nothing on it
// lines up with anything else.
export function villainJumble({
  bodyColor = '#6b8f3a',
  accent = '#39501c',
  collarColor = '#1b260d',
  patchColor = '#8a7f4b',
} = {}) {
  return svgWrap(
    `
    <g transform="rotate(-8 60 80)">
      <ellipse cx="60" cy="132" rx="24" ry="5" fill="#000" opacity="0.1"/>
      <rect x="44" y="92" width="19" height="24" fill="${accent}"/>
      <rect x="68" y="92" width="10" height="36" fill="${patchColor}"/>
      <rect x="38" y="114" width="26" height="10" fill="${collarColor}"/>
      <rect x="64" y="126" width="17" height="8" fill="${collarColor}"/>
      <polygon points="34,50 45,57 22,106 11,99" fill="${accent}"/>
      <circle cx="16" cy="105" r="7" fill="${patchColor}"/>
      <polygon points="42,48 76,53 74,74 40,70" fill="${bodyColor}"/>
      <polygon points="37,72 79,67 73,95 43,97" fill="${accent}"/>
      <rect x="53" y="58" width="15" height="13" fill="${patchColor}"/>
      <g stroke="${collarColor}" stroke-width="2.4" stroke-linecap="round">
        <path d="M42 71 L46 68"/>
        <path d="M52 72 L56 69"/>
        <path d="M62 71 L66 68"/>
        <path d="M72 70 L76 67"/>
      </g>
      <rect x="74" y="54" width="19" height="21" rx="3" fill="${bodyColor}"/>
      <rect x="90" y="58" width="14" height="14" fill="${patchColor}"/>
      <polygon points="44,12 78,8 84,34 50,41" fill="${bodyColor}"/>
      <polygon points="44,12 62,10 60,20 43,21" fill="${patchColor}"/>
      <circle cx="55" cy="25" r="7" fill="#f5f2ea"/>
      <circle cx="55" cy="25" r="3.2" fill="${collarColor}"/>
      <circle cx="72" cy="21" r="3.8" fill="#f5f2ea"/>
      <circle cx="72" cy="21" r="1.7" fill="${collarColor}"/>
      <polygon points="52,33 58,37 63,32 69,36 74,31 74,35 52,37" fill="${collarColor}"/>
    </g>
  `,
    '0 0 120 140'
  )
}

// 섀도우킹, the chapter boss: deliberately the largest figure in the app --
// spiked crown to the top edge, cape to the bottom edge, shadow spikes
// pushing the shoulders wider than any hero, and a face that is pure dark
// except for two burning eyes.
export function villainShadowKing({
  bodyColor = '#4b3f6b',
  accent = '#211b33',
  collarColor = '#1c1c1c',
  eyeColor = '#ffd43b',
} = {}) {
  return svgWrap(
    `
    <g>
      <ellipse cx="60" cy="136" rx="36" ry="6" fill="#000" opacity="0.14"/>
      <polygon points="40,44 6,110 18,104 14,126 30,116 36,132 48,120 60,136 72,120 84,132 90,116 106,126 102,104 114,110 80,44" fill="${collarColor}"/>
      <polygon points="34,54 12,26 26,52" fill="${accent}"/>
      <polygon points="40,50 24,18 34,48" fill="${accent}"/>
      <polygon points="86,54 108,26 94,52" fill="${accent}"/>
      <polygon points="80,50 96,18 86,48" fill="${accent}"/>
      <rect x="18" y="58" width="18" height="34" rx="5" fill="${bodyColor}"/>
      <polygon points="18,92 24,108 27,92" fill="${accent}"/>
      <polygon points="27,92 31,108 34,92" fill="${accent}"/>
      <rect x="84" y="58" width="18" height="34" rx="5" fill="${bodyColor}"/>
      <polygon points="86,92 90,108 93,92" fill="${accent}"/>
      <polygon points="93,92 97,108 100,92" fill="${accent}"/>
      <rect x="44" y="104" width="16" height="26" fill="${accent}"/>
      <rect x="60" y="104" width="16" height="26" fill="${accent}"/>
      <rect x="36" y="126" width="25" height="11" fill="${collarColor}"/>
      <rect x="59" y="126" width="25" height="11" fill="${collarColor}"/>
      <polygon points="36,52 84,52 78,106 42,106" fill="${bodyColor}"/>
      <polygon points="60,70 70,82 60,94 50,82" fill="${accent}"/>
      <polygon points="60,76 65,82 60,88 55,82" fill="${eyeColor}"/>
      <polygon points="36,52 60,64 84,52 78,36 42,36" fill="${accent}"/>
      <circle cx="60" cy="28" r="20" fill="${collarColor}"/>
      <polygon points="34,30 37,12 45,26" fill="${accent}"/>
      <polygon points="40,24 46,2 53,22" fill="${accent}"/>
      <polygon points="52,22 60,0 68,22" fill="${accent}"/>
      <polygon points="67,22 74,2 80,24" fill="${accent}"/>
      <polygon points="86,30 83,12 75,26" fill="${accent}"/>
      <polygon points="47,25 59,30 58,37 46,32" fill="${eyeColor}"/>
      <polygon points="73,25 61,30 62,37 74,32" fill="${eyeColor}"/>
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
  'sammy': { bodyColor: '#3b9922', accent: '#27500a', emblem: 'S' },
  'ace': { bodyColor: '#ef9f27', accent: '#854f0b', emblem: 'A' },
  'turbo': { bodyColor: '#378add', accent: '#0c447c', emblem: 'T' },
  'carbon': { style: 'robot-deluxe' },
  'inky': { style: 'superhero-acrobat', bodyColor: '#d1332f', accent: '#1f3c88', capeColor: '#1f3c88', emblem: 'I' },
  'pip': { style: 'superhero-shield', bodyColor: '#3a63c7', accent: '#f5f2ea', capeColor: '#c0272d', emblem: 'P' },
  'nord': { style: 'superhero-thunder', bodyColor: '#3f4654', accent: '#c9cfd8', capeColor: '#c0272d', maskColor: '#c9cfd8', emblem: 'N' },
  'captain-pin': { style: 'superhero-armor', bodyColor: '#c0272d', accent: '#f4c95d', panelColor: '#f4c95d', capeColor: '#8a1a1c', maskColor: '#7a1418', visorColor: '#8ef0ff', emblem: '★' },
  'coco': { style: 'dino-raptor', bodyColor: '#4bb377', accent: '#1f6b45', emblem: 'C' },
  'eddy': { style: 'dino-armored', bodyColor: '#6d8fd6', accent: '#2f4a86', emblem: 'E' },
  'huey': { style: 'dino-flyer', bodyColor: '#e0803a', accent: '#8a4213', emblem: 'H' },
  'trike': { style: 'dino-horned', bodyColor: '#c8452f', panelColor: '#f7ead2', accent: '#f0b429', visorColor: '#5dd6e0' },
  'rocket': { style: 'plat-jumper', bodyColor: '#3a63c7', accent: '#1f3c88', emblem: 'R' },
  'magno': { style: 'plat-spring', bodyColor: '#2f8f4a', accent: '#155225', emblem: 'M' },
  'drillo': { style: 'plat-block', bodyColor: '#b5762a', accent: '#6b4014', emblem: 'D' },
  'captain-red': { style: 'plat-powerup', bodyColor: '#d1332f', accent: '#f4c95d', panelColor: '#fff3c4' },
}

const VILLAIN_PALETTES = {
  'noisebot': { bodyColor: '#888780', accent: '#444441' },
  'hushbot': { bodyColor: '#7f77dd', accent: '#3c3489' },
  'shadowbot': { bodyColor: '#5f5e5a', accent: '#2c2c2a' },
  'tickbot': { bodyColor: '#d85a30', accent: '#712b13' },
  'dark-spark': { style: 'robot-deluxe' },
  'blurry': { style: 'supervillain-fog', bodyColor: '#7a8b99', accent: '#3d4852', collarColor: '#222a30' },
  'eraser-man': { style: 'supervillain-eraser', bodyColor: '#c96a9b', accent: '#6b2f4c', collarColor: '#2a1420' },
  'stop-man': { style: 'supervillain-stop', bodyColor: '#8a7f4b', accent: '#4a4222', collarColor: '#231f10' },
  'jumble': { style: 'supervillain-jumble', bodyColor: '#6b8f3a', accent: '#39501c', collarColor: '#1b260d' },
  'shadow-king': { style: 'supervillain-king', bodyColor: '#4b3f6b', accent: '#211b33', collarColor: '#1c1c1c' },
  'blinky': { style: 'dino-blink', bodyColor: '#8f7fd4', accent: '#463a80' },
  'echo': { style: 'dino-echo', bodyColor: '#5aa6a0', accent: '#1f5a56' },
  'upsy': { style: 'dino-upside', bodyColor: '#c96a9b', accent: '#6b2f4c' },
  'muddy': { style: 'dino-swamp', bodyColor: '#7d9b3a', accent: '#3c4d18' },
  'shadow-rex': { style: 'dino-shadow-rex', bodyColor: '#4a4a52', accent: '#22222a' },
  'flippy': { style: 'plat-flip', bodyColor: '#7a5fd1', accent: '#3d2f80' },
  'slippy': { style: 'plat-slime', bodyColor: '#4aa87a', accent: '#1e5c3f' },
  'grabby': { style: 'plat-magnetjack', bodyColor: '#c9542f', accent: '#6b2814' },
  'corky': { style: 'plat-brick', bodyColor: '#a67c52', accent: '#5a4126' },
  'pixel-muncher': { style: 'plat-glitch', bodyColor: '#3a3a42', accent: '#e0455a' },
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
  'dino-raptor': dinoRaptor,
  'dino-armored': dinoArmored,
  'dino-flyer': dinoFlyer,
  'dino-horned': dinoHorned,
  'plat-jumper': platJumper,
  'plat-spring': platSpring,
  'plat-block': platBlock,
  'plat-powerup': platPowerup,
}

const VILLAIN_STYLES = {
  robot: villainRobot,
  'robot-deluxe': villainDeluxeRobot,
  superhero: villainSuperhero,
  'supervillain-fog': villainFog,
  'supervillain-eraser': villainEraser,
  'supervillain-stop': villainStop,
  'supervillain-jumble': villainJumble,
  'supervillain-king': villainShadowKing,
  'dino-blink': dinoBlink,
  'dino-echo': dinoEcho,
  'dino-upside': dinoUpside,
  'dino-swamp': dinoSwamp,
  'dino-shadow-rex': dinoShadowRex,
}

// Styles that name a family rather than a final look. Chapter data written
// before the archetypes existed asks for the family ('superhero'), which
// would render all four of a chapter's heroes as the same figure, so a named
// character's own archetype outranks a family request. A concrete style in
// the data still wins, and an unknown name still gets the family default.
const FAMILY_STYLES = new Set([
  'superhero',
  'dino',
  'dinosaur',
  'plat',
  'platformer',
])

// Explicit spec colors win over the name palette, which wins over the art
// function's own defaults. Undefined spec fields are dropped so a partially
// filled chapter entry doesn't blank out palette colors.
// `art` is a stable identity slug; `name` is display text and may be
// translated at any time. Looking a palette up by display text means every
// rename silently drops the character's own colours, so `art` is tried first
// and `name` only as a fallback for entries that predate the slug.
const ART_META_KEYS = new Set(['name', 'style', 'art'])

function resolveArt(input, palettes, styles) {
  const spec = typeof input === 'string' ? { name: input } : input || {}
  const entry = palettes[spec.art] || palettes[spec.name] || {}
  const { style: namedStyle, ...namedColors } = entry
  const colors = { ...namedColors }
  for (const [key, value] of Object.entries(spec)) {
    if (!ART_META_KEYS.has(key) && value !== undefined) colors[key] = value
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
