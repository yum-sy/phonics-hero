// Preserve exact raw text for runtime lookup; match speakNow's lowercase English
// pronunciation input while explicitly asking for a single letter's NAME.
export function synthesisInput(entry) {
  if (entry.lang !== 'en-US') return entry.text
  // Full sentences keep their case ("S makes this sound" must stay a letter
  // name). Two display-only notations are spelled out for speech only -- the
  // runtime lookup key is still the exact on-screen text:
  //   "tap ✓"      -> "tap the check mark"
  //   "/s/ sound"  -> "S sound"   (a letter name; never a Hangul or IPA reading)
  if (entry.sentence) return entry.text.replace(/✓/g, 'the check mark').replace(/\/([a-z]{1,3})\//g, (_, l) => l.toUpperCase())
  return /^[A-Za-z]$/.test(entry.text) ? entry.text.toUpperCase() : entry.text.toLowerCase()
}

export function narrationRequest(entry, model, voice) {
  return { model, voice, input: synthesisInput(entry), instructions: entry.instructions, response_format: 'wav' }
}
