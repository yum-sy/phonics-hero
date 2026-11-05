// Preserve exact raw text for runtime lookup; match speakNow's lowercase English
// pronunciation input while explicitly asking for a single letter's NAME.
export function synthesisInput(entry) {
  if (entry.lang !== 'en-US') return entry.text
  return /^[A-Za-z]$/.test(entry.text) ? entry.text.toUpperCase() : entry.text.toLowerCase()
}

export function narrationRequest(entry, model, voice) {
  return { model, voice, input: synthesisInput(entry), instructions: entry.instructions, response_format: 'wav' }
}
