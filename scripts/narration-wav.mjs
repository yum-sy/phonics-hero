import assert from 'node:assert/strict'

export function measureWav(bytes) {
  assert.equal(bytes.subarray(0, 4).toString(), 'RIFF')
  assert.equal(bytes.subarray(8, 12).toString(), 'WAVE')
  let format, data
  for (let at = 12; at + 8 <= bytes.length;) {
    const tag = bytes.subarray(at, at + 4).toString(), size = bytes.readUInt32LE(at + 4)
    // Speech API can return a streaming WAV with unknown data length (UINT_MAX).
    // The completed HTTP body supplies the actual end; other truncation is invalid.
    const end = tag === 'data' && size === 0xffffffff ? bytes.length : at + 8 + size
    assert(end <= bytes.length, 'Truncated WAV chunk')
    if (tag === 'fmt ') format = bytes.subarray(at + 8, end)
    if (tag === 'data') data = bytes.subarray(at + 8, end)
    at = end + (size % 2)
  }
  assert(format?.length >= 16 && data?.length, 'Missing PCM data')
  const formatTag = format.readUInt16LE(0)
  assert(formatTag === 1 || (formatTag === 0xfffe && format.length >= 40 && format.readUInt16LE(24) === 1), 'Expected PCM WAV')
  const channels = format.readUInt16LE(2), sampleRate = format.readUInt32LE(4)
  assert.equal(channels, 1, 'Expected mono'); assert.equal(format.readUInt16LE(14), 16)
  assert(sampleRate >= 16000 && sampleRate <= 48000)
  const count = data.length / 2, durationMs = count / sampleRate * 1000
  assert(Number.isInteger(count) && durationMs >= 100 && durationMs <= 60000, 'Unexpected duration')
  let sum = 0, peak = 0, active = 0, firstActive = -1, lastActive = -1, clipped = 0
  for (let at = 0; at < data.length; at += 2) {
    const sample = data.readInt16LE(at) / 32768
    peak = Math.max(peak, Math.abs(sample)); sum += sample * sample
    if (Math.abs(sample) >= 0.999) clipped++
    if (Math.abs(sample) > 0.002) {
      active++
      if (firstActive < 0) firstActive = at / 2
      lastActive = at / 2
    }
  }
  const rms = Math.sqrt(sum / count)
  assert(rms > 0.005 && peak > 0.01 && active > sampleRate * 0.03, 'Silent or near-silent audio')
  assert(clipped / count < 0.01, 'Excessive full-scale clipping')
  return { durationMs: Math.round(durationMs), sampleRate, peak: Number(peak.toFixed(5)), rms: Number(rms.toFixed(5)), leadingSilenceMs: Math.round(firstActive / sampleRate * 1000), trailingSilenceMs: Math.round((count - lastActive - 1) / sampleRate * 1000), clippedFraction: Number((clipped / count).toFixed(6)) }
}

// Touch only newly generated narration. Keep original API WAVs unchanged.
export function prepareNarrationWav(bytes) {
  const raw = measureWav(bytes)
  let pcm
  for (let at = 12; at + 8 <= bytes.length;) {
    const tag = bytes.subarray(at, at + 4).toString(), size = bytes.readUInt32LE(at + 4)
    const end = tag === 'data' && size === 0xffffffff ? bytes.length : at + 8 + size
    if (tag === 'data') { pcm = bytes.subarray(at + 8, end); break }
    at = end + size % 2
  }
  const threshold = raw.peak * 10 ** (-50 / 20), count = pcm.length / 2
  let first = 0, last = count - 1
  // Only consecutive outer silence is removed; no internal pauses are cut.
  while (first < count && Math.abs(pcm.readInt16LE(first * 2) / 32768) < threshold) first++
  while (last > first && Math.abs(pcm.readInt16LE(last * 2) / 32768) < threshold) last--
  const start = Math.max(0, first - Math.round(raw.sampleRate * 0.08))
  const end = Math.min(count, last + 1 + Math.round(raw.sampleRate * 0.18))
  const data = Buffer.from(pcm.subarray(start * 2, end * 2))
  let sum = 0
  for (let at = 0; at < data.length; at += 2) sum += (data.readInt16LE(at) / 32768) ** 2
  const rms = Math.sqrt(sum / (data.length / 2))
  const gain = Math.min(4, 0.95 / raw.peak, Math.max(0.5, 0.12 / rms))
  for (let at = 0; at < data.length; at += 2) data.writeInt16LE(Math.max(-32768, Math.min(32767, Math.round(data.readInt16LE(at) * gain))), at)
  const header = Buffer.alloc(44)
  header.write('RIFF', 0); header.writeUInt32LE(36 + data.length, 4); header.write('WAVEfmt ', 8)
  header.writeUInt32LE(16, 16); header.writeUInt16LE(1, 20); header.writeUInt16LE(1, 22)
  header.writeUInt32LE(raw.sampleRate, 24); header.writeUInt32LE(raw.sampleRate * 2, 28)
  header.writeUInt16LE(2, 32); header.writeUInt16LE(16, 34); header.write('data', 36); header.writeUInt32LE(data.length, 40)
  const prepared = Buffer.concat([header, data])
  return { bytes: prepared, measures: measureWav(prepared), processing: { version: 2, targetRms: 0.12, maxGain: 4, thresholdDbRelativePeak: -50, retainedLeadMs: 80, retainedTailMs: 180, removedLeadMs: Math.round(start / raw.sampleRate * 1000), removedTailMs: Math.round((count - end) / raw.sampleRate * 1000), gain: Number(gain.toFixed(5)), sourceDurationMs: raw.durationMs } }
}
