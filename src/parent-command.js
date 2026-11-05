export const PARENT_HOLD_MS = 11000

// Deliberately no short-test mode: production always needs one uninterrupted
// eleven-second pointer hold. The returned cleanup also cancels navigation.
export function bindParentHold(target, onComplete) {
  let pointer = null, timer = null, fired = false
  const clear = () => {
    if (timer !== null) clearTimeout(timer)
    timer = null
    const oldPointer = pointer
    pointer = null
    fired = false
    if (oldPointer !== null && target.hasPointerCapture?.(oldPointer)) {
      target.releasePointerCapture(oldPointer)
    }
  }
  const inside = event => {
    const rect = target.getBoundingClientRect()
    return event.clientX >= rect.left && event.clientX <= rect.right &&
      event.clientY >= rect.top && event.clientY <= rect.bottom
  }
  const down = event => {
    if (pointer !== null) { clear(); return }
    if (event.isPrimary === false || event.button !== 0 || !inside(event)) return
    event.preventDefault()
    pointer = event.pointerId
    fired = false
    try { target.setPointerCapture(event.pointerId) } catch {}
    timer = setTimeout(() => {
      timer = null
      if (pointer === null || fired || !target.isConnected || document.hidden) return
      fired = true
      onComplete()
    }, PARENT_HOLD_MS)
  }
  const move = event => { if (event.pointerId === pointer && !inside(event)) clear() }
  const end = event => { if (event.pointerId === pointer) clear() }
  const hidden = () => { if (document.hidden) clear() }
  const suppress = event => event.preventDefault()
  target.addEventListener('pointerdown', down)
  window.addEventListener('pointermove', move)
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
  target.addEventListener('lostpointercapture', end)
  target.addEventListener('contextmenu', suppress)
  target.addEventListener('selectstart', suppress)
  window.addEventListener('blur', clear)
  document.addEventListener('visibilitychange', hidden)
  const cleanup = () => {
    clear()
    target.removeEventListener('pointerdown', down)
    window.removeEventListener('pointermove', move)
    window.removeEventListener('pointerup', end)
    window.removeEventListener('pointercancel', end)
    target.removeEventListener('lostpointercapture', end)
    target.removeEventListener('contextmenu', suppress)
    target.removeEventListener('selectstart', suppress)
    window.removeEventListener('blur', clear)
    document.removeEventListener('visibilitychange', hidden)
  }
  cleanup.cancel = clear
  return cleanup
}
