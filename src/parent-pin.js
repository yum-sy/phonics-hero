// A local parent convenience gate, not account authentication. Each game owns
// its PIN independently; no PIN is sent to a server or mixed into child progress.
export const PIN_STORAGE_KEY = 'phonics-hero-parent-pin-v1'

export function readParentPin() {
  const stored = localStorage.getItem(PIN_STORAGE_KEY)
  if (stored === null) return '0000'
  if (!/^\d{4}$/.test(stored)) throw new Error('PIN storage is invalid')
  return stored
}

export function saveParentPin(pin) {
  if (!/^\d{4}$/.test(pin)) throw new TypeError('PIN needs exactly four digits')
  localStorage.setItem(PIN_STORAGE_KEY, pin)
  if (localStorage.getItem(PIN_STORAGE_KEY) !== pin) throw new Error('PIN was not saved')
}

// Explicit keypad buttons keep the iPad/Fold viewport stable (no OS keyboard).
// Returns a silent disposer for navigation; normal closure restores focus.
export function openParentPinDialog({ change = false, settings = false, onUnlock = () => {}, onExit = () => {}, onClose = () => {} } = {}) {
  if (document.getElementById('parent-pin-dialog')) return () => {}
  const previousFocus = document.activeElement
  const overlay = document.createElement('div')
  overlay.id = 'parent-pin-dialog'
  overlay.className = 'parent-pin-overlay'
  overlay.innerHTML = `<section class="parent-pin-panel" role="dialog" aria-modal="true" aria-labelledby="parent-pin-title" aria-describedby="parent-pin-help">
    <h2 id="parent-pin-title">${settings ? '부모 설정' : change ? '부모 PIN 변경' : '부모 모드'}</h2>
    <p id="parent-pin-help"></p>
    <div class="parent-pin-settings" hidden><button type="button" id="parent-dialog-change">PIN 변경</button><button type="button" id="parent-dialog-exit">부모 모드 종료</button></div>
    <output id="parent-pin-digits" aria-live="polite" aria-label="PIN 입력 0자리">○ ○ ○ ○</output>
    <p id="parent-pin-error" role="status" aria-live="polite"></p>
    <div class="parent-pin-keypad">${[1,2,3,4,5,6,7,8,9].map(n => `<button type="button" data-pin-digit="${n}">${n}</button>`).join('')}<button type="button" id="parent-pin-backspace" aria-label="한 자리 지우기">⌫</button><button type="button" data-pin-digit="0">0</button><button type="button" id="parent-pin-confirm" disabled>확인</button></div>
    <button type="button" id="parent-pin-cancel">취소</button>
  </section>`
  let digits = '', firstPin = null, closed = false, completed = false
  const inertNodes = [...document.body.children].filter(node => node !== overlay && !node.inert)
  for (const node of inertNodes) node.inert = true
  document.body.append(overlay)
  const help = overlay.querySelector('#parent-pin-help')
  const error = overlay.querySelector('#parent-pin-error')
  const confirm = overlay.querySelector('#parent-pin-confirm')
  const draw = () => {
    overlay.querySelector('.parent-pin-settings').hidden = !settings
    overlay.querySelector('.parent-pin-keypad').hidden = settings
    overlay.querySelector('#parent-pin-digits').hidden = settings
    help.textContent = settings ? '설정을 바꾸거나 부모 모드를 종료하세요.' : change ? (firstPin === null ? '새 PIN 4자리를 입력하세요.' : '새 PIN을 한 번 더 입력하세요.') : 'PIN 4자리를 입력하세요.'
    overlay.querySelector('#parent-pin-digits').textContent = [...digits.padEnd(4, ' ')].map(c => c === ' ' ? '○' : '●').join(' ')
    overlay.querySelector('#parent-pin-digits').setAttribute('aria-label', `PIN 입력 ${digits.length}자리`)
    confirm.disabled = digits.length !== 4
  }
  const close = (restoreFocus = true) => {
    if (closed) return
    closed = true
    overlay.remove()
    for (const node of inertNodes) if (node.isConnected) node.inert = false
    document.removeEventListener('keydown', keydown, true)
    if (restoreFocus && previousFocus?.isConnected) previousFocus.focus?.({ preventScroll: true })
    onClose()
  }
  const submit = () => {
    if (closed || completed || settings || digits.length !== 4) return
    if (change) {
      if (firstPin === null) { firstPin = digits; digits = ''; error.textContent = ''; draw(); return }
      if (digits !== firstPin) { digits = ''; firstPin = null; error.textContent = '두 PIN이 달라요. 새 PIN부터 다시 입력하세요.'; draw(); return }
      try { saveParentPin(digits) }
      catch { error.textContent = '저장하지 못했어요. 다시 시도해 주세요.'; return }
      completed = true
      digits = ''; firstPin = null
      error.textContent = 'PIN을 변경했어요.'
      help.textContent = '다음부터 새 PIN으로 들어오세요.'
      overlay.querySelector('.parent-pin-keypad').hidden = true
      overlay.querySelector('#parent-pin-digits').hidden = true
      overlay.querySelector('#parent-pin-cancel').textContent = '닫기'
      overlay.querySelector('#parent-pin-cancel').focus({ preventScroll: true })
      return
    }
    try {
      if (digits !== readParentPin()) { digits = ''; error.textContent = 'PIN이 맞지 않아요. 다시 입력하세요.'; draw(); return }
    } catch { digits = ''; error.textContent = 'PIN을 읽지 못했어요. 다시 시도해 주세요.'; draw(); return }
    close(false)
    onUnlock()
  }
  const addDigit = digit => { if (!completed && digits.length < 4 && !overlay.querySelector('.parent-pin-keypad').hidden) { digits += digit; error.textContent = ''; draw() } }
  overlay.querySelectorAll('[data-pin-digit]').forEach(button => button.addEventListener('click', () => addDigit(button.dataset.pinDigit)))
  const backspace = () => { if (completed || settings) return; digits = digits.slice(0, -1); error.textContent = ''; draw() }
  overlay.querySelector('#parent-pin-backspace').addEventListener('click', backspace)
  confirm.addEventListener('click', submit)
  overlay.querySelector('#parent-dialog-change').addEventListener('click', () => {
    settings = false; change = true; digits = ''; firstPin = null
    overlay.querySelector('#parent-pin-title').textContent = '부모 PIN 변경'
    draw(); overlay.querySelector('[data-pin-digit]').focus({ preventScroll: true })
  })
  overlay.querySelector('#parent-dialog-exit').addEventListener('click', () => { close(false); onExit() })
  overlay.querySelector('#parent-pin-cancel').addEventListener('click', () => close())
  const keydown = event => {
    if (closed) return
    if (/^\d$/.test(event.key)) { event.preventDefault(); event.stopPropagation(); addDigit(event.key) }
    else if (event.key === 'Backspace') { event.preventDefault(); event.stopPropagation(); backspace() }
    else if (event.key === 'Enter') {
      // Let native buttons in settings/success/cancel keep keyboard activation.
      if (settings || completed || event.target.id === 'parent-pin-cancel') return
      event.preventDefault(); event.stopPropagation(); submit()
    }
    else if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close() }
    else if (event.key === 'Tab') {
      const buttons = [...overlay.querySelectorAll('button:not(:disabled)')].filter(button => !button.closest('[hidden]'))
      const first = buttons[0], last = buttons.at(-1)
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus() }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus() }
    }
  }
  document.addEventListener('keydown', keydown, true)
  draw()
  overlay.querySelector(settings ? '#parent-dialog-change' : '[data-pin-digit]').focus({ preventScroll: true })
  return () => close(false)
}
