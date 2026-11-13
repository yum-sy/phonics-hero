export const PARENT_ROUND_TRIPS = 5

// Use visible letters, not the full-width header box. Clip text ranges to the
// title so an ellipsized play title still has a reachable right endpoint.
export function getParentGestureBounds(target) {
  const box = target.getBoundingClientRect()
  const walker = document.createTreeWalker(target, NodeFilter.SHOW_TEXT)
  const nodes = []
  while (walker.nextNode()) nodes.push(walker.currentNode)
  const letters = nodes.flatMap(node => {
    const matches = [...node.textContent.matchAll(/[\p{L}\p{N}]/gu)]
    return matches.length ? [{ node, start: matches[0].index, end: matches.at(-1).index + matches.at(-1)[0].length }] : []
  })
  if (!letters.length) return null
  const range = document.createRange()
  range.setStart(letters[0].node, letters[0].start)
  range.setEnd(letters.at(-1).node, letters.at(-1).end)
  const text = range.getBoundingClientRect()
  const left = Math.max(box.left, text.left), right = Math.min(box.right, text.right)
  const top = Math.max(box.top, text.top), bottom = Math.min(box.bottom, text.bottom)
  return right > left && bottom > top ? { left, right, top, bottom } : null
}

// Five left -> right -> left trips in one contact. There is no timer, progress
// hint, or cumulative credit between gestures. The cleanup cancels navigation.
export function bindParentSweep(target, onComplete) {
  let pointer = null, bounds = null, legs = 0, fired = false
  const clear = () => {
    const oldPointer = pointer
    pointer = null
    bounds = null
    legs = 0
    fired = false
    if (oldPointer !== null && target.hasPointerCapture?.(oldPointer)) {
      target.releasePointerCapture(oldPointer)
    }
  }
  const inside = event => bounds && event.clientX >= bounds.left - 24 &&
    event.clientX <= bounds.right + 24 && event.clientY >= bounds.top - 18 &&
    event.clientY <= bounds.bottom + 18
  const edgeTolerance = () => Math.min(24, (bounds.right - bounds.left) * .22)
  const down = event => {
    if (pointer !== null) { clear(); return }
    if (event.isPrimary === false || event.button !== 0 || document.hidden) return
    bounds = getParentGestureBounds(target)
    if (!inside(event) || event.clientX > bounds.left + edgeTolerance()) { clear(); return }
    event.preventDefault()
    pointer = event.pointerId
    legs = 0
    fired = false
    try { target.setPointerCapture(event.pointerId) } catch {}
  }
  const move = event => {
    if (event.pointerId !== pointer || fired) return
    if (!target.isConnected || document.hidden || !inside(event)) { clear(); return }
    event.preventDefault()
    const atNextEdge = legs % 2 === 0
      ? event.clientX >= bounds.right - edgeTolerance()
      : event.clientX <= bounds.left + edgeTolerance()
    if (!atNextEdge) return
    legs += 1
    if (legs === PARENT_ROUND_TRIPS * 2) {
      fired = true
      onComplete()
    }
  }
  const end = event => { if (event.pointerId === pointer) clear() }
  const extraPointer = event => { if (pointer !== null && event.pointerId !== pointer) clear() }
  const hidden = () => { if (document.hidden) clear() }
  const suppress = event => event.preventDefault()
  target.addEventListener('pointerdown', down)
  window.addEventListener('pointerdown', extraPointer, true)
  window.addEventListener('pointermove', move, { passive: false })
  window.addEventListener('pointerup', end)
  window.addEventListener('pointercancel', end)
  target.addEventListener('lostpointercapture', end)
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
    window.removeEventListener('pointerup', end)
    window.removeEventListener('pointercancel', end)
    target.removeEventListener('lostpointercapture', end)
    target.removeEventListener('contextmenu', suppress)
    target.removeEventListener('selectstart', suppress)
    window.removeEventListener('blur', clear)
    window.removeEventListener('resize', clear)
    document.removeEventListener('visibilitychange', hidden)
  }
  cleanup.cancel = clear
  return cleanup
}
