// Art stays independent of chapter data: callers resolve a character's stable
// identity to a family/slot. Learning letters belong to the lesson UI, not art.
import frames from './atlas-frames.json' with { type: 'json' }
import worldFrames from './world-atlas-frames.json' with { type: 'json' }

const ART_BASE = `${import.meta.env?.BASE_URL || '/'}art/`

export const CHARACTER_ATLASES = Object.freeze(Object.fromEntries(
  Object.entries({ ...frames, ...worldFrames }).map(([key, sheet]) => [key, Object.freeze({
    ...sheet, columns: key.endsWith('-worlds') ? 5 : 3,
    rows: key.endsWith('-worlds') ? 2 : key === 'career' ? 4 : 3,
  })]),
))

/** Row-major slot, zero-based. Characters never carry curriculum badges. */
export function renderCharacterAsset({ family, sheet = family, slot }) {
  const { width, height, frames: crops } = CHARACTER_ATLASES[sheet]
  const [cropX, cropY, cellWidth, cellHeight] = crops[slot]
  const availableHeight = 140
  const scale = Math.min(120 / cellWidth, availableHeight / cellHeight)
  const artWidth = cellWidth * scale
  const artHeight = cellHeight * scale
  const artX = (120 - artWidth) / 2
  const artY = (availableHeight - artHeight) / 2
  // A nested SVG clips in its own tile coordinates without shared clipPath IDs.
  // Multiple instances can safely coexist in the map and combine introduction.
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 140" class="carbot-art character-asset" data-art-family="${family}" data-art-sheet="${sheet}" data-art-slot="${slot}" aria-hidden="true">
    <svg x="${artX}" y="${artY}" width="${artWidth}" height="${artHeight}" viewBox="0 0 ${cellWidth} ${cellHeight}" preserveAspectRatio="xMidYMid meet" overflow="hidden">
      <image href="${ART_BASE}${sheet.endsWith('-worlds') ? 'v3' : 'v2'}/${sheet}.png" x="${-cropX}" y="${-cropY}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid meet"${family === 'pixel' ? ' style="image-rendering:pixelated"' : ''}/>
    </svg>
  </svg>`
}
