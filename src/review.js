import './style.css'
import './review.css'
import { chapters } from './data/chapters/index.js'
import { heroArt, villainArt } from './art.js'
import { enableReviewMode } from './state.js'
import { configureReviewNavigation, startReviewStage } from './screens.js'

// Review owns only its catalog. Playing uses the real game, with a separate
// in-memory progress store enabled before any screen can write a checkpoint.
enableReviewMode()
const app = document.getElementById('app')
const deepLink = new URLSearchParams(location.hash.slice(1))
let selectedStageId = deepLink.get('stage') || ''
let chapterIndex = chapters.findIndex((chapter) =>
  chapter.stages.some((stage) => stage.id === selectedStageId)
)
if (chapterIndex < 0) {
  chapterIndex = chapters.findIndex((chapter) => chapter.id === deepLink.get('chapter'))
  selectedStageId = ''
}
if (chapterIndex < 0) chapterIndex = 0

const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]
)

function updateLink() {
  const hash = new URLSearchParams({ chapter: chapters[chapterIndex].id })
  if (selectedStageId) hash.set('stage', selectedStageId)
  history.replaceState(null, '', `${location.pathname}${location.search}#${hash}`)
}

function selectChapter(index) {
  chapterIndex = Math.max(0, Math.min(chapters.length - 1, index))
  selectedStageId = ''
  updateLink()
  renderCatalog()
}

function renderCatalog(chapterId) {
  const incomingIndex = chapters.findIndex((item) => item.id === chapterId)
  if (incomingIndex >= 0 && incomingIndex !== chapterIndex) {
    chapterIndex = incomingIndex
    selectedStageId = ''
    updateLink()
  }
  const chapter = chapters[chapterIndex]
  document.title = `Chapter ${chapter.order} · Phonics Hero Review`
  app.innerHTML = `
    <main class="screen review-catalog">
      <header class="review-header">
        <h1>Stage Review</h1>
        <a class="review-game-link" href="./">일반 게임으로</a>
      </header>
      <p class="review-notice">검수 모드 · 실제 진행 기록에 저장하지 않아요</p>
      <nav class="review-chapter-nav" aria-label="챕터 선택">
        <button type="button" id="review-prev" ${chapterIndex === 0 ? 'disabled' : ''} aria-label="이전 챕터">◀ 이전</button>
        <label class="review-chapter-field">
          <span class="sr-only">챕터</span>
          <select id="review-chapter" aria-label="챕터 선택">
            ${chapters.map((item, index) => `<option value="${index}" ${index === chapterIndex ? 'selected' : ''}>${item.order}. ${escapeHTML(item.title)}</option>`).join('')}
          </select>
        </label>
        <button type="button" id="review-next" ${chapterIndex === chapters.length - 1 ? 'disabled' : ''} aria-label="다음 챕터">다음 ▶</button>
      </nav>
      <p class="review-chapter-summary">Chapter ${chapter.order} / ${chapters.length} · 원하는 스테이지를 누르면 처음부터 시작해요</p>
      <div class="review-stages" aria-label="스테이지 목록">
        ${chapter.stages.map((stage, index) => `
          <button type="button" class="review-stage ${stage.id === selectedStageId ? 'review-stage-selected' : ''}" data-review-stage="${escapeHTML(stage.id)}" ${stage.id === selectedStageId ? 'aria-current="true"' : ''}>
            <span class="review-stage-number">${index + 1}${stage.chapterBoss ? '<span class="review-boss-badge">BOSS</span>' : ''}</span>
            <span class="review-stage-copy">
              <span class="review-stage-title">${escapeHTML(stage.title)}</span>
              <span class="review-stage-names">${escapeHTML(stage.hero.name)} <span aria-label="versus">vs</span> ${escapeHTML(stage.villain.name)}</span>
            </span>
            <span class="review-stage-art" aria-hidden="true">${heroArt(stage.hero)}${villainArt(stage.villain)}</span>
            <span class="review-stage-play" aria-hidden="true">▶</span>
          </button>`).join('')}
      </div>
    </main>`
  document.getElementById('review-prev').addEventListener('click', () => selectChapter(chapterIndex - 1))
  document.getElementById('review-next').addEventListener('click', () => selectChapter(chapterIndex + 1))
  document.getElementById('review-chapter').addEventListener('change', (event) => selectChapter(Number(event.target.value)))
  app.querySelectorAll('[data-review-stage]').forEach((button) => {
    button.addEventListener('click', () => {
      selectedStageId = button.dataset.reviewStage
      updateLink()
      // No await or timer here: the real game must unlock audio in this tap.
      startReviewStage(selectedStageId)
    })
  })
}

configureReviewNavigation(renderCatalog)
renderCatalog()
