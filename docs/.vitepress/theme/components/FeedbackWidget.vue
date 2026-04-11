<template>
  <div class="fw-wrap">

    <div class="fw-separator">
      <span class="fw-sep-text">Page Feedback</span>
    </div>

    <div class="fw-card">
      <div class="fw-accent-bar"></div>

      <div v-if="!submitted" class="fw-body">
        <div class="fw-prompt">
          <span class="fw-prompt-icon">
            <Icon icon="lucide:flame" />
          </span>
          <div class="fw-prompt-text">
            <span class="fw-label">Was this helpful?</span>
            <span class="fw-sub">{{ formattedPageTitle }}</span>
          </div>
        </div>

        <div class="fw-votes">
          <button
            :class="['fw-vote', 'fw-vote--yes', { 'fw-vote--active': selected === 'good' }]"
            @click="selectFeedback('good')"
            :disabled="submitting"
          >
            <Icon icon="lucide:thumbs-up" class="fw-vote-icon" />
            <span>Yes</span>
          </button>
          <button
            :class="['fw-vote', 'fw-vote--no', { 'fw-vote--active': selected === 'bad' }]"
            @click="selectFeedback('bad')"
            :disabled="submitting"
          >
            <Icon icon="lucide:thumbs-down" class="fw-vote-icon" />
            <span>No</span>
          </button>
        </div>
      </div>

      <transition name="fw-expand">
        <div v-if="selected && !submitted" class="fw-detail">
          <div class="fw-divider"></div>

          <div class="fw-textarea-wrap">
            <textarea
              v-model="comment"
              :placeholder="`Tell us what made this page ${selected === 'good' ? 'helpful' : 'not helpful'}...`"
              rows="3"
              :disabled="submitting"
              class="fw-textarea"
              :maxlength="maxChars"
              autofocus
            ></textarea>
            <span class="fw-char" :class="{ 'fw-char--warn': comment.length > maxChars * 0.85 }">
              {{ comment.length }}/{{ maxChars }}
            </span>
          </div>

          <div class="fw-footer">
            <div class="fw-stars">
              <button
                v-for="star in 5"
                :key="star"
                @click="selectRating(star)"
                :disabled="submitting"
                class="fw-star"
                :class="{ 'fw-star--on': rating >= star }"
              >★</button>
              <span class="fw-star-label">{{ rating ? getRatingText() : 'Rate (optional)' }}</span>
            </div>

            <div class="fw-actions">
              <button @click="resetSelection" :disabled="submitting" class="fw-btn fw-btn--ghost">
                Cancel
              </button>
              <button
                @click="submitFeedback"
                :disabled="!comment.trim() || submitting || comment.length > maxChars"
                class="fw-btn fw-btn--primary"
                :class="{ 'fw-btn--ready': comment.trim() && comment.length <= maxChars }"
              >
                <Icon icon="lucide:send" v-if="!submitting" class="fw-btn-icon" />
                <Icon icon="lucide:loader-circle" class="fw-btn-icon fw-spin" v-else />
                {{ submitting ? 'Sending...' : 'Send feedback' }}
              </button>
            </div>
          </div>

          <div v-if="error" class="fw-error">
            <Icon icon="lucide:alert-triangle" />
            {{ errorMessage }}
          </div>
        </div>
      </transition>

      <transition name="fw-fade">
        <div v-if="submitted" class="fw-success">
          <div class="fw-success-icon">
            <Icon icon="lucide:check-circle-2" />
          </div>
          <div class="fw-success-body">
            <strong>Thank you for your feedback!</strong>
            <span>Your input helps improve the documentation.</span>
          </div>
          <div class="fw-success-actions">
            <a v-if="discussionUrl" :href="discussionUrl" target="_blank" rel="noopener noreferrer" class="fw-link">
              <Icon icon="lucide:github" />
              View discussion
            </a>
            <button @click="reset" class="fw-link fw-link--muted">
              <Icon icon="lucide:refresh-cw" />
              Submit again
            </button>
          </div>
        </div>
      </transition>
    </div>

    <transition name="fw-toast">
      <div v-if="toast.show" class="fw-toast" :class="`fw-toast--${toast.type}`">
        <Icon :icon="toast.icon" class="fw-toast-icon" />
        <div class="fw-toast-body">
          <strong>{{ toast.title }}</strong>
          <span>{{ toast.message }}</span>
        </div>
        <button @click="toast.show = false" class="fw-toast-close">
          <Icon icon="lucide:x" />
        </button>
        <div class="fw-toast-bar"></div>
      </div>
    </transition>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useData } from 'vitepress'
import { Icon } from '@iconify/vue'

const { page } = useData()

const selected = ref(null)
const rating = ref(null)
const comment = ref('')
const submitted = ref(false)
const submitting = ref(false)
const error = ref(false)
const errorMessage = ref('')
const discussionUrl = ref('')
const maxChars = 500

// Toast notification
const toast = ref({
  show: false,
  type: 'success',
  title: '',
  message: '',
  icon: ''
})

const showToast = (type, title, message) => {
  const icons = {
    success: 'lucide:check-circle-2',
    error: 'lucide:alert-circle',
    info: 'lucide:info'
  }
  
  toast.value = {
    show: true,
    type: type,
    title: title,
    message: message,
    icon: icons[type] || icons.info
  }
  
  // Auto hide after 4 seconds
  setTimeout(() => {
    toast.value.show = false
  }, 4000)
}

const formattedPageTitle = computed(() => {
  const path = page.value.relativePath
  let title = path.replace(/\.md$/, '').replace(/[-_]/g, ' ')
  title = title.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
  return title || 'this page'
})

const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
const GITHUB_REPO = 'WildFiire/docs'

const selectFeedback = (type) => {
  selected.value = type
  comment.value = ''
  rating.value = null
}

const selectRating = (value) => {
  rating.value = value
}

const getRatingText = () => {
  const texts = ['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent']
  return texts[rating.value] || ''
}

const submitFeedback = async () => {
  if (!selected.value || !comment.value.trim() || comment.value.length > maxChars) return
  
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    showToast('error', 'Configuration Error', 'GitHub configuration missing')
    return
  }
  
  submitting.value = true
  error.value = false
  
  const currentPath = page.value.relativePath
  const pageTitle = formattedPageTitle.value
  const ratingText = rating.value ? ` (${rating.value}★ - ${getRatingText()})` : ''
  
  const title = `[${selected.value.toUpperCase()}] ${pageTitle}${ratingText}`
  const body = `
## Feedback for: ${pageTitle}

- **Page:** ${currentPath}
- **URL:** ${window.location.href}
- **Rating:** ${selected.value === 'good' ? 'Helpful' : 'Not Helpful'}${rating.value ? ` (${rating.value}/5 stars - ${getRatingText()})` : ''}
- **Date:** ${new Date().toISOString()}

### Comment:
${comment.value.trim()}
  `.trim()

  try {
    const categoryId = await getFeedbackCategoryId()
    const repoId = await getRepositoryId()
    
    const mutation = `
      mutation($repositoryId: ID!, $categoryId: ID!, $title: String!, $body: String!) {
        createDiscussion(input: {
          repositoryId: $repositoryId
          categoryId: $categoryId
          title: $title
          body: $body
        }) {
          discussion {
            id
            url
          }
        }
      }
    `
    
    const response = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: mutation,
        variables: {
          repositoryId: repoId,
          categoryId: categoryId,
          title: title,
          body: body
        }
      })
    })

    const data = await response.json()
    
    if (data.errors) throw new Error(data.errors[0].message)
    
    if (data.data?.createDiscussion?.discussion?.url) {
      discussionUrl.value = data.data.createDiscussion.discussion.url
      submitted.value = true
      
      const audio = new Audio('/sounds/sunet.mp3')
      audio.play().catch(err => console.log('Audio play failed:', err))
      
      showToast('success', 'Feedback sent!', 'Thank you for your contribution')
    } else {
      throw new Error('Unexpected response')
    }
    
  } catch (err) {
    console.error(err)
    error.value = true
    errorMessage.value = err.message || 'Failed to submit feedback'
    showToast('error', 'Submission failed', errorMessage.value)
    setTimeout(() => { error.value = false }, 4000)
  } finally {
    submitting.value = false
  }
}

const getRepositoryId = async () => {
  if (!GITHUB_REPO) throw new Error('Repository configuration missing')
  
  const [owner, name] = GITHUB_REPO.split('/')
  
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) { id }
      }`,
      variables: { owner, name }
    })
  })
  const data = await response.json()
  if (data.errors) throw new Error(data.errors[0].message)
  return data.data.repository.id
}

const getFeedbackCategoryId = async () => {
  if (!GITHUB_REPO) throw new Error('Repository configuration missing')
  
  const [owner, name] = GITHUB_REPO.split('/')
  
  const response = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${GITHUB_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `query($owner: String!, $name: String!) {
        repository(owner: $owner, name: $name) {
          discussionCategories(first: 10) { nodes { id name } }
        }
      }`,
      variables: { owner, name }
    })
  })
  const data = await response.json()
  if (data.errors) throw new Error(data.errors[0].message)
  
  const categories = data.data.repository.discussionCategories.nodes
  const feedbackCategory = categories.find(c => c.name === 'Feedbacks')
  
  if (!feedbackCategory) {
    throw new Error(`Feedback category not found. Available: ${categories.map(c => c.name).join(', ')}`)
  }
  return feedbackCategory.id
}

const resetSelection = () => {
  selected.value = null
  rating.value = null
  comment.value = ''
}

const reset = () => {
  submitted.value = false
  selected.value = null
  rating.value = null
  comment.value = ''
  error.value = false
  errorMessage.value = ''
  discussionUrl.value = ''
}

</script>

<style scoped>
  /* ── Wrapper ──────────────────────────────────────────── */
  .fw-wrap {
    margin-top: 2.5rem;
    margin-bottom: 2.5rem;
    width: 100%;
    position: relative;
  }

  .fw-separator {
    margin-bottom: 0.75rem;
  }

  .fw-sep-text {
    font-size: 0.6875rem;
    font-weight: 600;
    color: var(--vp-c-text-3);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    white-space: nowrap;
  }

  /* ── Card ─────────────────────────────────────────────── */
  .fw-card {
    background: var(--vp-c-bg-soft);
    border: 1px solid rgba(255, 120, 0, 0.14);
    border-radius: 10px;
    overflow: hidden;
    transition: border-color 0.25s ease, box-shadow 0.25s ease;
  }

  .fw-card:hover {
    border-color: rgba(255, 120, 0, 0.28);
    box-shadow: 0 4px 20px rgba(255, 120, 0, 0.06);
  }

  .fw-accent-bar {
    height: 2px;
    background: linear-gradient(90deg, #ff7800, #ff7800 60%, transparent);
  }

  /* ── Body row ─────────────────────────────────────────── */
  .fw-body {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 0.875rem 1.125rem;
  }

  .fw-prompt {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    min-width: 0;
  }

  .fw-prompt-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: rgba(255, 120, 0, 0.08);
    border: 1px solid rgba(255, 120, 0, 0.16);
    color: #ff7800;
    flex-shrink: 0;
    font-size: 15px;
  }

  .fw-prompt-text {
    display: flex;
    flex-direction: column;
    min-width: 0;
  }

  .fw-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
    white-space: nowrap;
  }

  .fw-sub {
    font-size: 0.75rem;
    color: var(--vp-c-text-3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 240px;
  }

  /* ── Vote buttons ─────────────────────────────────────── */
  .fw-votes {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .fw-vote {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.45rem 1rem;
    border-radius: 6px;
    border: 1px solid var(--vp-c-divider);
    background: var(--vp-c-bg);
    color: var(--vp-c-text-2);
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: inherit;
  }

  .fw-vote-icon {
    width: 14px;
    height: 14px;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .fw-vote:hover:not(:disabled) {
    border-color: rgba(255, 120, 0, 0.4);
    color: #ff7800;
    background: rgba(255, 120, 0, 0.04);
  }

  .fw-vote:hover:not(:disabled) .fw-vote-icon {
    transform: scale(1.15);
  }

  .fw-vote--active {
    background: linear-gradient(135deg, #ff7800, #ff7a00) !important;
    border-color: #ff7800 !important;
    color: white !important;
    box-shadow: 0 2px 10px rgba(255, 120, 0, 0.25);
  }

  .fw-vote:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* ── Divider ──────────────────────────────────────────── */
  .fw-divider {
    height: 1px;
    background: var(--vp-c-divider);
    margin: 0 1.125rem;
  }

  /* ── Detail section ───────────────────────────────────── */
  .fw-detail {
    padding: 0.875rem 1.125rem 1rem;
  }

  /* ── Textarea ─────────────────────────────────────────── */
  .fw-textarea-wrap {
    position: relative;
  }

  .fw-textarea {
    width: 100%;
    padding: 0.625rem 0.875rem;
    background: var(--vp-c-bg);
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    color: var(--vp-c-text-1);
    font-family: inherit;
    font-size: 0.8125rem;
    line-height: 1.55;
    resize: none;
    transition: border-color 0.18s ease, box-shadow 0.18s ease;
    display: block;
    box-sizing: border-box;
  }

  .fw-textarea:focus {
    outline: none;
    border-color: rgba(255, 120, 0, 0.45);
    box-shadow: 0 0 0 3px rgba(255, 120, 0, 0.07);
  }

  .fw-textarea::placeholder {
    color: var(--vp-c-text-3);
    font-size: 0.775rem;
  }

  .fw-char {
    position: absolute;
    bottom: 0.5rem;
    right: 0.625rem;
    font-size: 0.675rem;
    color: var(--vp-c-text-3);
    pointer-events: none;
    transition: color 0.18s ease;
  }

  .fw-char--warn {
    color: #ff7800;
  }

  /* ── Footer row ───────────────────────────────────────── */
  .fw-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.625rem;
    flex-wrap: wrap;
  }

  /* ── Stars ────────────────────────────────────────────── */
  .fw-stars {
    display: flex;
    align-items: center;
    gap: 0.05rem;
  }

  .fw-star {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.05rem;
    color: var(--vp-c-text-3);
    padding: 0 0.1rem;
    transition: color 0.15s ease, transform 0.15s ease;
    line-height: 1;
  }

  .fw-star:hover,
  .fw-star--on {
    color: #f59e0b;
    transform: scale(1.18);
  }

  .fw-star:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .fw-star-label {
    font-size: 0.7rem;
    color: var(--vp-c-text-3);
    margin-left: 0.4rem;
    white-space: nowrap;
  }

  /* ── Action buttons ───────────────────────────────────── */
  .fw-actions {
    display: flex;
    gap: 0.5rem;
  }

  .fw-btn {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.4rem 0.875rem;
    border-radius: 6px;
    font-size: 0.8rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.18s ease;
    font-family: inherit;
    border: none;
    white-space: nowrap;
  }

  .fw-btn-icon {
    width: 13px;
    height: 13px;
    flex-shrink: 0;
  }

  .fw-btn--ghost {
    background: transparent;
    border: 1px solid var(--vp-c-divider);
    color: var(--vp-c-text-2);
  }

  .fw-btn--ghost:hover:not(:disabled) {
    border-color: rgba(255, 120, 0, 0.3);
    color: #ff7800;
    background: rgba(255, 120, 0, 0.04);
  }

  .fw-btn--primary {
    background: rgba(255, 120, 0, 0.1);
    color: rgba(255, 100, 0, 0.45);
  }

  .fw-btn--primary.fw-btn--ready {
    background: linear-gradient(135deg, #ff7800, #ff7a00);
    color: white;
    box-shadow: 0 2px 8px rgba(255, 120, 0, 0.2);
  }

  .fw-btn--primary.fw-btn--ready:hover:not(:disabled) {
    box-shadow: 0 4px 14px rgba(255, 120, 0, 0.32);
    transform: translateY(-1px);
  }

  .fw-btn:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .fw-spin {
    animation: fw-spin 0.7s linear infinite;
  }

  /* ── Error ────────────────────────────────────────────── */
  .fw-error {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 0.625rem;
    padding: 0.5rem 0.75rem;
    background: rgba(239, 68, 68, 0.06);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 6px;
    font-size: 0.75rem;
    color: #ef4444;
  }

  /* ── Success state ────────────────────────────────────── */
  .fw-success {
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 1rem 1.125rem;
    flex-wrap: wrap;
  }

  .fw-success-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255, 120, 0, 0.08);
    border: 1px solid rgba(255, 120, 0, 0.18);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ff7800;
    flex-shrink: 0;
    font-size: 1.1rem;
  }

  .fw-success-body {
    flex: 1;
    min-width: 0;
  }

  .fw-success-body strong {
    display: block;
    font-size: 0.875rem;
    color: var(--vp-c-text-1);
    margin-bottom: 0.125rem;
  }

  .fw-success-body span {
    font-size: 0.75rem;
    color: var(--vp-c-text-2);
  }

  .fw-success-actions {
    display: flex;
    gap: 0.5rem;
    flex-shrink: 0;
  }

  .fw-link {
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
    font-size: 0.775rem;
    padding: 0.3rem 0.65rem;
    border-radius: 6px;
    color: #ff7800;
    text-decoration: none;
    background: rgba(255, 120, 0, 0.06);
    border: 1px solid rgba(255, 120, 0, 0.15);
    cursor: pointer;
    font-family: inherit;
    font-weight: 500;
    transition: all 0.18s ease;
  }

  .fw-link:hover {
    background: rgba(255, 120, 0, 0.1);
    border-color: rgba(255, 120, 0, 0.3);
  }

  .fw-link--muted {
    color: var(--vp-c-text-2);
    background: transparent;
    border-color: var(--vp-c-divider);
  }

  .fw-link--muted:hover {
    color: #ff7800;
    background: rgba(255, 120, 0, 0.05);
    border-color: rgba(255, 120, 0, 0.2);
  }

  /* ── Toast ────────────────────────────────────────────── */
  .fw-toast {
    position: fixed;
    bottom: 1.75rem;
    right: 1.75rem;
    display: flex;
    align-items: center;
    gap: 0.875rem;
    padding: 0.875rem 1.125rem;
    background: var(--vp-c-bg);
    border: 1px solid rgba(0, 0, 0, 0.08);
    border-radius: 10px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.15), 0 2px 8px rgba(0, 0, 0, 0.08);
    z-index: 10000;
    max-width: 360px;
    min-width: 260px;
    overflow: hidden;
  }

  .fw-toast--success {
    border-left: 3px solid #10b981;
  }

  .fw-toast--error {
    border-left: 3px solid #ef4444;
  }

  .fw-toast-icon {
    width: 1.25rem;
    height: 1.25rem;
    flex-shrink: 0;
  }

  .fw-toast--success .fw-toast-icon { color: #10b981; }
  .fw-toast--error .fw-toast-icon { color: #ef4444; }

  .fw-toast-body {
    flex: 1;
  }

  .fw-toast-body strong {
    display: block;
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--vp-c-text-1);
    margin-bottom: 0.1rem;
  }

  .fw-toast-body span {
    font-size: 0.75rem;
    color: var(--vp-c-text-2);
  }

  .fw-toast-close {
    background: transparent;
    border: none;
    cursor: pointer;
    color: var(--vp-c-text-3);
    display: flex;
    align-items: center;
    padding: 0.2rem;
    border-radius: 4px;
    transition: color 0.15s ease;
  }

  .fw-toast-close:hover { color: var(--vp-c-text-1); }

  .fw-toast-close svg {
    width: 0.875rem;
    height: 0.875rem;
  }

  .fw-toast-bar {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 2px;
    width: 100%;
    animation: fw-toast-bar 4s linear forwards;
  }

  .fw-toast--success .fw-toast-bar { background: #10b981; }
  .fw-toast--error .fw-toast-bar { background: #ef4444; }

  /* ── Transitions ──────────────────────────────────────── */
  .fw-expand-enter-active,
  .fw-expand-leave-active {
    transition: opacity 0.22s ease, transform 0.22s ease;
  }

  .fw-expand-enter-from,
  .fw-expand-leave-to {
    opacity: 0;
    transform: translateY(-6px);
  }

  .fw-fade-enter-active,
  .fw-fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fw-fade-enter-from,
  .fw-fade-leave-to {
    opacity: 0;
  }

  .fw-toast-enter-active,
  .fw-toast-leave-active {
    transition: all 0.3s ease;
  }

  .fw-toast-enter-from,
  .fw-toast-leave-to {
    opacity: 0;
    transform: translateX(100%) scale(0.92);
  }

  /* ── Keyframes ────────────────────────────────────────── */
  @keyframes fw-spin {
    to { transform: rotate(360deg); }
  }

  @keyframes fw-toast-bar {
    from { width: 100%; }
    to   { width: 0%; }
  }

  /* ── Mobile ───────────────────────────────────────────── */
  @media (max-width: 640px) {
    .fw-body {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
    }

    .fw-votes {
      width: 100%;
    }

    .fw-vote {
      flex: 1;
      justify-content: center;
    }

    .fw-detail {
      padding: 0.75rem 1rem;
    }

    .fw-footer {
      flex-direction: column;
      align-items: stretch;
    }

    .fw-stars {
      justify-content: center;
    }

    .fw-actions {
      justify-content: flex-end;
    }

    .fw-success {
      flex-direction: column;
      align-items: flex-start;
      gap: 0.75rem;
      padding: 0.875rem 1rem;
    }

    .fw-success-actions {
      width: 100%;
    }

    .fw-sub {
      max-width: 180px;
    }

    .fw-toast {
      bottom: 1rem;
      right: 1rem;
      left: 1rem;
      max-width: none;
    }
  }
</style>