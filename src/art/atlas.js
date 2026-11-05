// Art stays independent of chapter data: callers resolve a character's stable
// identity to a family/slot and pass the existing curriculum emblem separately.
import frames from './atlas-frames.json' with { type: 'json' }

const ART_BASE = `${import.meta.env?.BASE_URL || '/'}art/v2/`
const FONT = "system-ui, -apple-system, 'Helvetica Neue', Arial, sans-serif"

export const CHARACTER_ATLASES = Object.freeze(Object.fromEntries(
  Object.entries(frames).map(([family, sheet]) => [family, Object.freeze({
    ...sheet, columns: 3, rows: family === 'career' ? 4 : 3,
  })]),
))

function xml(value) {
  return String(value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;',
  })[c])
}

function emblemBadge(emblem) {
  if (emblem === undefined || emblem === null || emblem === '') return ''
  const text = String(emblem)
  const star = text === '★'
  // A fixed plate below the illustration never depends on a generated chest
  // position, and leaves even two-letter graphemes unobstructed by equipment.
  const size = Math.min(21, 43 / Math.max(1, text.length * 0.85))
  return `<rect x="33" y="115" width="54" height="24" rx="8" fill="${star ? '#e7b441' : '#20334e'}"/>
    <rect x="36" y="117" width="48" height="20" rx="6" fill="#fff4d9"/>
    <text x="60" y="${127 + size * (star ? 0.36 : 0.35)}" text-anchor="middle" font-family="${FONT}" font-size="${size}" font-weight="800" fill="#15283e" style="transform-origin:60px 0">${xml(text)}</text>`
}

/** Row-major slot, zero-based. Omit emblem for villains; ★ marks fusion heroes. */
export function renderCharacterAsset({ family, slot, emblem }) {
  const { width, height, frames: crops } = CHARACTER_ATLASES[family]
  const [cropX, cropY, cellWidth, cellHeight] = crops[slot]
  const badge = emblemBadge(emblem)
  const availableHeight = badge ? 114 : 140
  const scale = Math.min(120 / cellWidth, availableHeight / cellHeight)
  const artWidth = cellWidth * scale
  const artHeight = cellHeight * scale
  const artX = (120 - artWidth) / 2
  const artY = (availableHeight - artHeight) / 2
  // A nested SVG clips in its own tile coordinates without shared clipPath IDs.
  // Multiple instances can safely coexist in the map and combine introduction.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" class="carbot-art character-asset" data-art-family="${family}" data-art-slot="${slot}" aria-hidden="true">
    <svg x="${artX}" y="${artY}" width="${artWidth}" height="${artHeight}" viewBox="0 0 ${cellWidth} ${cellHeight}" preserveAspectRatio="xMidYMid meet" overflow="hidden">
      <image href="${ART_BASE}${family}.png" x="${-cropX}" y="${-cropY}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"${family === 'pixel' ? ' style="image-rendering:pixelated"' : ''}/>
    </svg>
    ${badge}
  </svg>`
}
