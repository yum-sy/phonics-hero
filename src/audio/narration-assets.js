import manifest from '../../public/narration/manifest.json' with { type: 'json' }

// The publication tool lists only generated, decoded files. Raw case matters:
// "A" is a letter name, while "a" belongs to the original phoneme recordings.
const clips = new Map()
for (const entry of manifest.entries) {
  if (!/^[a-zA-Z0-9_-]+\.(wav|mp3|m4a)$/.test(entry.file) ||
      !Number.isFinite(entry.durationMs) || entry.durationMs <= 0) {
    throw new Error(`Invalid narration asset: ${entry.id}`)
  }
  const key = `${entry.lang}\0${entry.text}`
  if (clips.has(key)) throw new Error(`Duplicate narration asset: ${entry.id}`)
  clips.set(key, Object.freeze(entry))
}

export function narrationFor(text, lang) {
  return clips.get(`${lang}\0${String(text ?? '').trim()}`) || null
}
