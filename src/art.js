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
  platFlip,
  platSlime,
  platMagnetjack,
  platBrick,
  platGlitch,
} from './art/platformer.js'
import {
  creatureRocket,
  creatureMagno,
  creatureDrillo,
  creatureCaptainRed,
  creatureFlippy,
  creatureSlippy,
  creatureGrabby,
  creatureCorky,
  creatureMuncher,
} from './art/creatures.js'
import {
  dcRay,
  dcJett,
  dcCloak,
  dcNightray,
  dcBlackout,
  dcMirage,
  dcGridlock,
  dcFloodlight,
  dcNightfall,
} from './art/dc.js'
import {
  toyLeo,
  toyFifi,
  toyBobo,
  toyCaptainBig,
  toyWobbly,
  toyTangly,
  toyBoxxy,
  toyTumbles,
  toyWindDown,
} from './art/toys.js'

// Shared by every style family defined *in this file*; ./art/robots.js
// keeps its own copy so it stays importable without this module.
function svgWrap(inner, viewBox = '0 0 120 120') {
  return `<svg viewBox="${viewBox}" xmlns="http://www.w3.org/2000/svg" class="carbot-art">${inner}</svg>`
}

const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

// ---------------------------------------------------------------------------
// EMBLEM NAMEPLATE (superhero family)
//
// The four heroes below used to carry four INLINE copies of `<circle r=9..13>`
// plus `<text>`, and that is exactly how this family's type sizes drifted to
// 10 / 12 / 12 / 14 while every other family sits at 18-26. Measured inked
// glyph height at a 96 px chapter card was 6-9 px here against 12-15 px
// everywhere else: a child was reading chapter 2's I/P/N at half the size of
// chapter 1's S/A/T, and chapter 2 is the second chapter it ever sees. The
// geometry now lives in one function and each hero only picks an anchor box
// and its own two colours.
//
// WIDE BORDERED PLATE, not a badge -- the shape the leader's A/B settled on.
// A circle is also the wrong container for a two-glyph label, and that is not
// hypothetical: chapter 9 is this family's next slot and it teaches digraphs,
// and the old circles already overflowed on OA (Inky and Nord had 0.5 units of
// margin left, Captain Pin -1.0).
//
// ASPECT 0.68, DERIVED, not copied from the DC family's 0.60. These chests are
// narrower than that family's, and on a width-limited chest a squarer plate
// buys a taller SINGLE glyph for free: the two-glyph case is limited by width,
// never by height, so lowering the plate's height would cost the single-letter
// case without buying the digraph case anything. Both limits are applied:
//   by height -- 1.06h for one letter, 0.94h for two, 0.82h for a non-letter
//     (a star inks 0.93 of its em box where a capital inks 0.72, so one rule
//      for both crams the star to the plate edge; the DC family hit this too)
//   by width  -- worst-case advance measured off the rendered families: 0.85
//     of the font size for one capital (M), 1.45 for two (OA)
// Whichever limit is tighter wins, so a narrow chest yields a smaller letter
// instead of an overflowing one.
const SH_PLATE = '#f7f3e6'
const SH_ASPECT = 0.68

function superheroPlate(
  cx,
  cy,
  w,
  label,
  borderColor,
  inkColor,
  border = 2.2,
  keylineColor = null
) {
  const text = String(label)
  const h = w * SH_ASPECT
  const lettery = /^[A-Za-z0-9]+$/.test(text)
  const byHeight = text.length > 1 ? h * 0.94 : lettery ? h * 1.06 : h * 0.82
  const byWidth = (w - 4) / (text.length > 1 ? 1.45 : 0.85)
  const size = Math.min(byHeight, byWidth)
  const rx = w * 0.12
  const box = (inset, fill, r) =>
    `<rect x="${(cx - w / 2 - inset).toFixed(1)}" y="${(cy - h / 2 - inset).toFixed(1)}" ` +
    `width="${(w + inset * 2).toFixed(1)}" height="${(h + inset * 2).toFixed(1)}" ` +
    `rx="${r.toFixed(1)}" fill="${fill}"/>`
  return `
      ${box(border, borderColor, rx + border)}
      ${keylineColor ? box(border * 0.62, keylineColor, rx + border * 0.62) : ''}
      ${box(0, SH_PLATE, rx)}
      <text x="${cx}" y="${(cy + size * 0.355).toFixed(1)}" text-anchor="middle" font-family="${FONT}"
        font-size="${size.toFixed(1)}" font-weight="800" fill="${inkColor}">${text}</text>`
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
  // The letter ink is a DEEPENED TONE OF THE CHARACTER'S OWN HUE, never black
  // and never the mid-tone body colour. Measured: `bodyColor` #3a63c7 on the
  // cream plate is 4.77:1, and a mid-tone simply cannot be fixed by any plate
  // -- the brightest possible background only takes it to 5.0:1. Deepening the
  // same blue reaches 11:1 and still reads as this character's blue.
  inkColor = '#16255c',
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
      ${/* The torso is a capsule (rx=26 on a 52x56 rect), so it is only wide
            enough for a 38-unit outer plate between y=60.5 and y=99.5 -- above
            that the top arc cuts in and the plate would poke outside the body,
            which changes the hard cut-out silhouette. cy=76 centres it in that
            window and still clears the belt at y=92. */ ''}
      ${superheroPlate(60, 76, 34, emblem, capeColor, inkColor)}
      <circle cx="28" cy="68" r="12" fill="${bodyColor}"/>
      <circle cx="92" cy="68" r="12" fill="${bodyColor}"/>
      <rect x="20" y="76" width="16" height="10" rx="5" fill="${accent}"/>
      <rect x="84" y="76" width="16" height="10" rx="5" fill="${accent}"/>
      <circle cx="60" cy="32" r="27" fill="${bodyColor}"/>
      <path d="M35 30 Q60 18 85 30 Q83 40 60 38 Q37 40 35 30 Z" fill="${maskColor}"/>
      ${/* Domino-mask eye holes used to be plain round dots -- neutral, no
            attitude, and read as droopy/sleepy against the sagging mask band
            around them. Cowl-slit quads instead: each eye's outer (temple)
            corner sits higher than its inner (nose) corner, the upward-angled
            slit language a masked hero's eyes should carry (user reference:
            LEGO Batman cowl -- bright slit, outer end swept up). Superman-type
            bare-faced heroes are the stated exception; this hero wears a
            mask, so it takes the slit. */ ''}
      <polygon points="38.7,25.5 56.8,34 59.3,28.5 41.2,20" fill="#fff"/>
      <polygon points="81.3,25.5 63.2,34 60.7,28.5 78.8,20" fill="#fff"/>
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
  // Deep navy: Inky's own accent hue pushed dark. The red `bodyColor` used to
  // ink this letter and red tops out at 4.35:1 on cream no matter what -- a
  // mid-tone red cannot be rescued by the plate.
  inkColor = '#1a3372',
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
      ${/* Chest widened 24 -> 34 units at the shoulder and the taper cut from
            4 to 3, purely to earn the nameplate honestly: the old 24-unit
            chest could not hold a plate at all, which is why this hero's
            letter was 8.6 units tall against chapter 1's 15.8. Still the
            slimmest torso of the four (thunder 34 tapering to 30, shield 38,
            armour 56), and the webs and no-cape are what carry "acrobat"
            anyway, not the chest width. */ ''}
      <polygon points="43,58 77,58 74,98 46,98" fill="${bodyColor}"/>
      <g stroke="${webColor}" stroke-width="1.5" fill="none" opacity="0.8">
        <line x1="60" y1="58" x2="60" y2="92"/>
        <line x1="47" y1="64" x2="73" y2="64"/>
        <line x1="49" y1="84" x2="71" y2="84"/>
        <line x1="45" y1="60" x2="73" y2="90"/>
        <line x1="75" y1="60" x2="47" y2="90"/>
      </g>
      ${superheroPlate(60, 70, 25, emblem, bodyColor, inkColor, 2.0)}
      <rect x="48" y="90" width="24" height="6" fill="${accent}"/>
      <path d="M106 61 L118 50" stroke="#f5f2ea" stroke-width="2.5" fill="none"/>
      <path d="M108 58 L116 56 M110 64 L118 63" stroke="#f5f2ea" stroke-width="1.8" fill="none"/>
      <circle cx="45" cy="61" r="8.5" fill="${bodyColor}"/>
      <circle cx="75" cy="61" r="8.5" fill="${bodyColor}"/>
      <rect x="76" y="56" width="32" height="11" rx="5" fill="${bodyColor}"/>
      <circle cx="106" cy="61" r="8" fill="${accent}"/>
      ${/* Measured gap before this patch: head bottom (cy32+r19=51) to chest
            top (58) is 7 units at center, widening to ~17 at the chest's own
            x43/x77 edges since the head is round and the chest top is flat --
            "머리가 붕 떠있어" was a real gap, not a rendering artifact. This
            rect's top edge (y32) sits at the head circle's own equator, which
            spans x41-79 there -- wider than the chest's x43-77, so the whole
            top edge is hidden under the head (drawn next, on top) with margin
            at both corners; only the strip below the head's actual curve
            shows, as a filled neck, down to y61 (3 units into the chest). */ ''}
      <rect x="43" y="32" width="34" height="29" fill="${bodyColor}"/>
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
  // Deep navy: Pip's own blue pushed dark. The letter used to be WHITE on the
  // mid-blue shield boss, which measures 5.54:1 -- and white on that blue
  // cannot pass 5.5 whatever else changes, because the pair is fixed.
  inkColor = '#1a2f63',
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
      ${/* Head (cx67,cy32,r19) bottom is y51; chest top is y58 -- a 7-unit gap
            at center, same floating-head defect as the other three archetypes
            (measured the same way: see heroAcrobat's note). This head sits at
            the chest's own x-center, so its equator (y32) spans exactly
            x48-86 -- the chest polygon's own top width -- so a patch flush
            with those edges would land exactly tangent to the head circle.
            Inset 1 unit per side (x49-85) to keep the patch's top corners
            strictly inside the head disc instead of razor-tangent to it. */ ''}
      <rect x="49" y="32" width="36" height="29" fill="${bodyColor}"/>
      <circle cx="67" cy="32" r="19" fill="${bodyColor}"/>
      <polygon points="50,22 38,26 50,31" fill="${accent}"/>
      <polygon points="84,22 96,26 84,31" fill="${accent}"/>
      <rect x="54" y="27" width="26" height="10" rx="5" fill="${maskColor}"/>
      ${/* Mask-bar eye holes were plain round dots -- flat, no expression.
            Angled cowl-slit quads instead, outer (temple) corner raised above
            the inner (nose) corner on both eyes -- same fix and same
            reasoning as heroSuperhero's mask. */ ''}
      <polygon points="55.6,31.7 64.7,35.9 66.4,32.3 57.3,28.1" fill="#fff"/>
      <polygon points="79.4,31.7 70.3,35.9 68.6,32.3 77.7,28.1" fill="#fff"/>
      <circle cx="34" cy="76" r="25" fill="${capeColor}"/>
      <circle cx="34" cy="76" r="18" fill="#f5f2ea"/>
      ${/* The nameplate rides the shield instead of the chest, because the
            chest is the one place it cannot go on THIS hero: the shield is
            drawn last and largest and covers the torso's left half. A
            34.4x24.8 outer plate has a 21.2-unit half-diagonal, inside the
            rim's r=25, so the shield's own outline -- the whole read at 96 px
            -- is untouched. The old r=11 boss disc is gone: it was the small
            container that held the letter to 10.1 units. */ ''}
      ${superheroPlate(34, 76, 30, emblem, bodyColor, inkColor)}
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
  // Deep slate: Nord's own body hue pushed dark. Its palette's mid slate
  // already measured 9.48:1 against white, but the art function's own default
  // green would have been 3.49:1 -- an emblem colour that only passes when a
  // palette happens to override the body is not a rule, it is luck.
  inkColor = '#1e2430',
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
      ${/* Taper cut from 4 to 3 units per side so the plate's outer box clears
            the torso edge at its lowest row (measured 44.6 / 76.2 there). */ ''}
      <polygon points="44,58 78,58 75,100 45,100" fill="${bodyColor}"/>
      ${superheroPlate(60, 72, 25, emblem, capeColor, inkColor, 2.0)}
      ${/* Four armour discs used to sit exactly where the plate now is. Two
            survive, below it: the winged helm and the hammer are what carry
            this hero, and the letter outranks a rivet. */ ''}
      <circle cx="50" cy="86" r="4.2" fill="${maskColor}"/>
      <circle cx="70" cy="86" r="4.2" fill="${maskColor}"/>
      <rect x="47" y="90" width="28" height="7" fill="${accent}"/>
      <rect x="32" y="66" width="13" height="28" rx="6" fill="${bodyColor}"/>
      <circle cx="38" cy="96" r="7" fill="${maskColor}"/>
      <circle cx="46" cy="62" r="9" fill="${bodyColor}"/>
      <circle cx="76" cy="62" r="9" fill="${bodyColor}"/>
      <polygon points="42,28 24,18 28,34 38,36" fill="${maskColor}"/>
      <polygon points="78,28 96,18 92,34 82,36" fill="${maskColor}"/>
      ${/* Same floating-head defect and same fix as heroAcrobat/heroShield:
            head bottom y51 to chest top y58 is a real 7-unit gap at center,
            wider at the chest polygon's own x44/x78 edges. Patch top edge
            sits at the head's own equator (y32, spans x41-79 there), inside
            the chest's x44-78 width with margin, so it stays fully hidden
            under the head and only shows as the strip below its curve. */ ''}
      <rect x="44" y="32" width="34" height="29" fill="${bodyColor}"/>
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
  // Deep indigo by default; Captain Pin's palette overrides it with its own
  // deep crimson. The old star was inked in `bodyColor` at font-size 10 -- the
  // smallest type in the whole app on the biggest figure in the chapter.
  inkColor = '#241d5c',
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
      ${/* The two chest facets were 15-unit wedges across the middle of the
            chest, i.e. exactly under the plate. They are now narrow lit edges
            OUTBOARD of it, so the armour still reads as panelled and nothing
            is merely hidden behind the plate. */ ''}
      <polygon points="33,55 39,55 38,84 35,81" fill="${panelColor}"/>
      <polygon points="87,55 81,55 82,84 85,81" fill="${panelColor}"/>
      <rect x="40" y="86" width="40" height="5" fill="${panelColor}"/>
      <rect x="41" y="93" width="38" height="5" fill="${panelColor}"/>
      ${/* The chest reactor becomes the plate's frame rather than a separate
            ornament: gold border, a thin energy keyline in the visor colour,
            cream field. The two hand thrusters already carry that glow twice
            over, so nothing about "powered armour" is lost. */ ''}
      ${superheroPlate(60, 70, 36, emblem, accent, inkColor, 2.6, visorColor)}
      <rect x="18" y="40" width="9" height="9" rx="2" fill="${maskColor}"/>
      <rect x="93" y="40" width="9" height="9" rx="2" fill="${maskColor}"/>
      <rect x="12" y="46" width="28" height="24" rx="8" fill="${panelColor}"/>
      <rect x="80" y="46" width="28" height="24" rx="8" fill="${panelColor}"/>
      <rect x="12" y="57" width="28" height="3" fill="${bodyColor}"/>
      <rect x="80" y="57" width="28" height="3" fill="${bodyColor}"/>
      ${/* Two core lights, added back because the nameplate replaced the chest
            reactor and with it the figure's only large patch of the visor
            glow. Regression found by rendering, not by measuring. */ ''}
      <circle cx="26" cy="58.5" r="4" fill="${visorColor}"/>
      <circle cx="94" cy="58.5" r="4" fill="${visorColor}"/>
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
      ${/* x=1 with a 3-wide stroke put ink at x=-0.5; the padded-viewBox alpha
            scan catches it, getBoundingClientRect does not (no stroke). */ ''}
      <rect x="2.6" y="44" width="33.4" height="30" fill="${blockColor}" stroke="${collarColor}" stroke-width="3"/>
      <rect x="21" y="44" width="15" height="30" fill="${bodyColor}" stroke="${collarColor}" stroke-width="3"/>
      <polygon points="2.6,64 13,74 2.6,74" fill="#b8b8b8"/>
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
      ${/* cy=136 ry=6 reached y=142. The 14%-opacity shadow is the easiest kind
            of clip to miss by eye and the easiest to fix. */ ''}
      <ellipse cx="60" cy="134" rx="36" ry="5" fill="#000" opacity="0.14"/>
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
// EMBLEM INK IS A PALETTE CONCERN. Every family except the frozen creature
// cast inks its emblem with a colour that arrives from here -- `accent` for
// most, `bodyColor` for three of the bosses -- so a palette entry decides
// whether a five-year-old can read the letter it is being taught.
//
// The floor is 7:1, measured from rendered pixels (see the report). It is not
// 15.8:1, which is what the creature and DC families reach with near-black ink
// on cream: forcing that everywhere would put one ink colour on all 28 heroes
// and delete the per-family palette identity the project deliberately wants.
// 7:1 is WCAG's normal-text AAA level, and normal-text is the right bar here
// because the inked glyph is 10-17 px on a 96 px chapter card.
//
// Where an entry below is darker than its family's body colour, that is the
// rule at work: the same hue pushed deep, never black, never a hue change.
const HERO_PALETTES = {
  'sammy': { bodyColor: '#3b9922', accent: '#27500a', emblem: 'S', variant: 'wedge' },
  // 6.02 -> 8.23. Same brown, deeper; it also paints Ace's trim.
  'ace': { bodyColor: '#ef9f27', accent: '#6b3d07', emblem: 'A', variant: 'crest-double' },
  'turbo': { bodyColor: '#378add', accent: '#0c447c', emblem: 'T', variant: 'spoiler-wide' },
  'carbon': { style: 'robot-deluxe' },
  'inky': { style: 'superhero-acrobat', bodyColor: '#d1332f', accent: '#1f3c88', capeColor: '#1f3c88', emblem: 'I' },
  'pip': { style: 'superhero-shield', bodyColor: '#3a63c7', accent: '#f5f2ea', capeColor: '#c0272d', emblem: 'P' },
  'nord': { style: 'superhero-thunder', bodyColor: '#3f4654', accent: '#c9cfd8', capeColor: '#c0272d', maskColor: '#c9cfd8', emblem: 'N' },
  // `inkColor` is set here rather than left to the art function because this
  // character is red/gold while heroPoweredArmor's own default is indigo.
  'captain-pin': { style: 'superhero-armor', bodyColor: '#c0272d', accent: '#f4c95d', panelColor: '#f4c95d', capeColor: '#8a1a1c', maskColor: '#7a1418', visorColor: '#8ef0ff', inkColor: '#6e1216', emblem: '★' },
  // 6.00 -> 8.75
  'coco': { style: 'dino-raptor', bodyColor: '#4bb377', accent: '#17512f', emblem: 'C' },
  'eddy': { style: 'dino-armored', bodyColor: '#6d8fd6', accent: '#2f4a86', emblem: 'E' },
  // 6.78 -> 9.40
  'huey': { style: 'dino-flyer', bodyColor: '#e0803a', accent: '#6b3009', emblem: 'H' },
  'trike': { style: 'dino-horned', bodyColor: '#c8452f', panelColor: '#f7ead2', accent: '#f0b429', visorColor: '#5dd6e0' },
  // Chapter 4's creature cast carries no colours here on purpose: the pastel
  // line-art palette is the whole point of that family's look, and a palette
  // entry outranks an art function's defaults, so colours listed here would
  // silently drag the cast back to its old saturated fills.
  'rocket': { style: 'creature-rocket', emblem: 'R' },
  'magno': { style: 'creature-magno', emblem: 'M' },
  'drillo': { style: 'creature-drillo', emblem: 'D' },
  'captain-red': { style: 'creature-boss' },
  'gogo': { style: 'plat-jumper', bodyColor: '#d1332f', accent: '#7a1a18', emblem: 'G' },
  // 6.85 -> 9.32
  'ollie': { style: 'plat-spring', bodyColor: '#e8732a', accent: '#6b2c07', emblem: 'O' },
  'umo': { style: 'plat-block', bodyColor: '#3aa15a', accent: '#1c5c30', emblem: 'U' },
  // 3.08 -> 11.0 by moving the ink, not the plate. See platPowerup's note.
  // platPowerup 은 bodyColor 를 받아서 무시한다 -- 파이어 파워업의 흰색이
  // 함수 기본값이고 팔레트 색이 기본값을 이기므로, 여기 색을 넣으면 반전이 깨진다.
  'captain-gum': { style: 'plat-powerup', accent: '#f4c95d', panelColor: '#fff3c4', inkColor: '#5c1a3d' },
  'leo': { style: 'toy-soldier', bodyColor: '#3f7d55', accent: '#f4c95d', emblem: 'L' },
  // 5.76 -> 8.60
  'fifi': { style: 'toy-plush', bodyColor: '#d99b5a', accent: '#6b3d15', emblem: 'F' },
  // 4.83 -> 8.09, the worst of the letter emblems before this round
  'bobo': { style: 'toy-block', bodyColor: '#7fd6a3', accent: '#1c5233', emblem: 'B' },
  'captain-big': { style: 'toy-boss', bodyColor: '#6b4ea8', accent: '#f4c95d', panelColor: '#f5f2ea' },
  // DC family: style only. Every colour lives in art/dc.js because the family
  // is built on a narrow dark palette that a stray bodyColor here would break.
  'ray': { style: 'dc-ray' },
  'jett': { style: 'dc-jett' },
  'cloak': { style: 'dc-cloak' },
  'nightray': { style: 'dc-boss' },
  // 챕터 8 (카봇 두 번째 슬롯). 챕터 1 의 초록/주황/파랑/빨강과 색상 이웃이
  // 겹치지 않게 청록·자주·황토를 골랐다 -- 같은 계열이 두 번 나오므로 배색이
  // 유일한 구분 수단이다.
  //
  // 챕터 8 은 IE/EE/OR 셋 다 다이그래프다. 첫 글자만 새기는 우회는
  // **축약이 아니라 모순**이었다 -- 세 다이그래프가 하필 전부 앱이 이미
  // 다른 소리로 가르친 모음으로 시작한다(I=짧은 /i/ 챕터2, E=짧은 /e/ 챕터3,
  // O=짧은 /o/ 챕터5). 그래서 판이 두 글자를 못 담던 동안은 '★' 를 썼다.
  // `e81a1ae` 가 robots.js 의 엠블럼 판을 5계열 전부 두 글자 대응으로
  // 넓혔다(IE/EE/OR 포함 16/16 클리핑 0, 재확인됨) -- 이제 실제 다이그래프를 새긴다.
  'nitro': { bodyColor: '#1f9b8e', accent: '#0d4f48', emblem: 'IE', variant: 'vent-slats' },
  'speedy': { bodyColor: '#8c4bbf', accent: '#4a1f6b', emblem: 'EE', variant: 'spoiler-wide' },
  'stormer': { bodyColor: '#c98a1f', accent: '#6b4409', emblem: 'OR', variant: 'crest-double' },
  'nitrostorm': { style: 'robot-deluxe', bodyColor: '#2f7fd6', accent: '#12406e' },
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
  // Colourless for the same reason as the chapter 4 heroes above.
  'flippy': { style: 'creature-flippy' },
  'slippy': { style: 'creature-slippy' },
  'grabby': { style: 'creature-grabby' },
  'corky': { style: 'creature-corky' },
  'pixel-muncher': { style: 'creature-glitch' },
  'topsy': { style: 'plat-flip', bodyColor: '#6a4fb0', accent: '#332570' },
  'gloop': { style: 'plat-slime', bodyColor: '#4fb08f', accent: '#1f5c48' },
  'snatchy': { style: 'plat-magnetjack', bodyColor: '#d1662f', accent: '#6b2f14' },
  'blocko': { style: 'plat-brick', bodyColor: '#8a6a3a', accent: '#4a3618' },
  'bug-king': { style: 'plat-glitch', bodyColor: '#8a1f2f', accent: '#3a0f16' },
  'wobbly': { style: 'toy-wobbly', bodyColor: '#c9622f', accent: '#6b3013' },
  'tangly': { style: 'toy-tangly', bodyColor: '#8f5fc9', accent: '#4a2f80' },
  'boxxy': { style: 'toy-boxxy', bodyColor: '#c9a35a', accent: '#6b4423' },
  'tumbles': { style: 'toy-tumbles', bodyColor: '#4f8fc9', accent: '#245080' },
  'wind-down': { style: 'toy-wind-down', bodyColor: '#332c45', accent: '#6f5bd0' },
  'blackout': { style: 'dc-blackout' },
  'mirage': { style: 'dc-mirage' },
  'gridlock': { style: 'dc-gridlock' },
  'floodlight': { style: 'dc-floodlight' },
  'nightfall': { style: 'dc-nightfall' },
  // 챕터 8 빌런. 챕터 1 의 회색/보라/암회색/주황/검정과 갈리게.
  'rustbot': { bodyColor: '#a1552e', accent: '#4f2513' },
  'crashbot': { bodyColor: '#4f6b8a', accent: '#243546' },
  'slowbot': { bodyColor: '#6b7a3a', accent: '#333d16' },
  'grindbot': { bodyColor: '#8a5f7a', accent: '#452c3c' },
  'iron-wreck': { style: 'robot-deluxe', bodyColor: '#5a5f68', accent: '#25282e' },
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
  'creature-rocket': creatureRocket,
  'creature-magno': creatureMagno,
  'creature-drillo': creatureDrillo,
  'creature-boss': creatureCaptainRed,
  'toy-soldier': toyLeo,
  'toy-plush': toyFifi,
  'toy-block': toyBobo,
  'toy-boss': toyCaptainBig,
  'dc-ray': dcRay,
  'dc-jett': dcJett,
  'dc-cloak': dcCloak,
  'dc-boss': dcNightray,
  'dc-hero': dcRay,
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
  'plat-flip': platFlip,
  'plat-slime': platSlime,
  'plat-magnetjack': platMagnetjack,
  'plat-brick': platBrick,
  'plat-glitch': platGlitch,
  'creature-flippy': creatureFlippy,
  'creature-slippy': creatureSlippy,
  'creature-grabby': creatureGrabby,
  'creature-corky': creatureCorky,
  'creature-glitch': creatureMuncher,
  'toy-wobbly': toyWobbly,
  'toy-tangly': toyTangly,
  'toy-boxxy': toyBoxxy,
  'toy-tumbles': toyTumbles,
  'toy-wind-down': toyWindDown,
  'dc-blackout': dcBlackout,
  'dc-mirage': dcMirage,
  'dc-gridlock': dcGridlock,
  'dc-floodlight': dcFloodlight,
  'dc-nightfall': dcNightfall,
  'dc-hero': dcBlackout,
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
  'creature',
  'toy',
  'dc-hero',
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
