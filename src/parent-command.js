export const PARENT_TAP_COUNT = 7
export const PARENT_TAP_GAP_MS = 2500
export const PARENT_TAP_WINDOW_MS = 15000
export const PARENT_TAP_HOLD_MS = 1000

// Count a completed contact once, never both pointerup and the following click.
// No debounce/minimum interval: fast taps and leisurely taps use the same path.
export function bindParentTaps(target, onComplete) {
  let pointer = null, startX = 0, startY = 0, downAt = 0
  let count = 0, firstAt = 0, lastAt = 0
  const release = () => {
    const old = pointer
    pointer = null
    if (old !== null && target.hasPointerCapture?.(old)) target.releasePointerCapture(old)
  }
  const clear = () => { count = 0; firstAt = 0; lastAt = 0; release() }
  const inside = event => {
    const r = target.getBoundingClientRect()
    return event.clientX >= r.left - 12 && event.clientX <= r.right + 12 &&
      event.clientY >= r.top - 12 && event.clientY <= r.bottom + 12
  }
  const down = event => {
    if (pointer !== null) { clear(); return }
    if (event.isPrimary === false || event.button !== 0 || document.hidden || !inside(event)) return
    const now = Date.now()
    if (now - lastAt > PARENT_TAP_GAP_MS || now - firstAt > PARENT_TAP_WINDOW_MS) count = 0
    event.preventDefault()
    pointer = event.pointerId
    startX = event.clientX; startY = event.clientY; downAt = now
    try { target.setPointerCapture(pointer) } catch {}
  }
  const moved = event => Math.hypot(event.clientX - startX, event.clientY - startY) > 24
  const move = event => { if (event.pointerId === pointer && (moved(event) || !inside(event))) clear() }
  const up = event => {
    if (event.pointerId !== pointer) return
    const now = Date.now()
    if (!target.isConnected || document.hidden || moved(event) || !inside(event) || now - downAt > PARENT_TAP_HOLD_MS) { clear(); return }
    event.preventDefault()
    // Release capture before updating count: lostpointercapture must not discard
    // a valid completed tap. The active pointer has already been cleared.
    release()
    if (now - lastAt > PARENT_TAP_GAP_MS || now - firstAt > PARENT_TAP_WINDOW_MS) count = 0
    if (count === 0) firstAt = now
    lastAt = now
    count += 1
    if (count === PARENT_TAP_COUNT) { clear(); onComplete() }
  }
  const cancelled = event => { if (event.pointerId === pointer) clear() }
  const extraPointer = event => { if (pointer !== null && event.pointerId !== pointer) clear() }
  const hidden = () => { if (document.hidden) clear() }
  const suppress = event => event.preventDefault()
  target.addEventListener('pointerdown', down)
  window.addEventListener('pointerdown', extraPointer, true)
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', up, { passive: false })
  window.addEventListener('pointercancel', cancelled)
  target.addEventListener('lostpointercapture', cancelled)
  target.addEventListener('contextmenu', suppress)
  target.addEventListener('selectstart', suppress)
  window.addEventListener('blur', clear)
  window.addEventListener('resize', clear)
  document.addEventListener('visibilitychange', hidden)
  const cleanup = () => {
    clear()
    target.removeEventListener('pointerdown', down)
    window.removeEventListener('pointerdown', extraPointer, true)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', up)
    window.removeEventListener('pointercancel', cancelled)
    target.removeEventListener('lostpointercapture', cancelled)
    target.removeEventListener('contextmenu', suppress)
    target.removeEventListener('selectstart', suppress)
    window.removeEventListener('blur', clear)
    window.removeEventListener('resize', clear)
    document.removeEventListener('visibilitychange', hidden)
  }
  cleanup.cancel = clear
  return cleanup
}
