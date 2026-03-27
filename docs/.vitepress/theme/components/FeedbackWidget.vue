<template>
  <div class="feedback-wrapper">
    <div class="feedback-glass">
      <div class="feedback-header">
        <div class="header-icon">
          <Icon icon="lucide:message-square" class="icon" />
        </div>
        <div class="header-text">
          <h3>Was this page helpful?</h3>
          <p>Your feedback on <strong>{{ formattedPageTitle }}</strong> helps us improve</p>
        </div>
      </div>
      
      <div class="feedback-actions">
        <button 
          :class="['btn-feedback', { active: selected === 'good' }]"
          @click="selectFeedback('good')"
          :disabled="submitting"
        >
          <Icon icon="lucide:thumbs-up" />
          <span>Yes, helpful</span>
        </button>
        
        <button 
          :class="['btn-feedback', { active: selected === 'bad' }]"
          @click="selectFeedback('bad')"
          :disabled="submitting"
        >
          <Icon icon="lucide:thumbs-down" />
          <span>No, not helpful</span>
        </button>
      </div>
      
      <transition name="slide">
        <div v-if="selected && !submitted" class="feedback-detail">
          <div class="textarea-wrapper">
            <textarea 
              v-model="comment" 
              :placeholder="`Please tell us what made this page ${selected === 'good' ? 'helpful' : 'not helpful'}...`"
              rows="3"
              :disabled="submitting"
              class="comment-input"
              :maxlength="maxChars"
              autofocus
            ></textarea>
            <div class="char-counter" :class="{ warning: comment.length > maxChars * 0.9 }">
              <Icon icon="lucide:message-square" class="counter-icon" />
              <span>{{ comment.length }}/{{ maxChars }}</span>
            </div>
          </div>
          
          <div class="footer-actions">
            <!-- Stars Rating -->
            <div class="rating-section">
              <div class="stars-container">
                <button 
                  v-for="star in 5" 
                  :key="star"
                  @click="selectRating(star)"
                  :disabled="submitting"
                  class="star-btn"
                  :class="{ active: rating >= star }"
                >
                  <Icon :icon="rating >= star ? 'lucide:star' : 'lucide:star'" class="star-icon" :class="{ filled: rating >= star }" />
                </button>
              </div>
              <span class="rating-label" v-if="rating">({{ getRatingText() }})</span>
              <span class="rating-label muted" v-else>Rate (optional)</span>
            </div>
            
            <!-- Buttons -->
            <div class="action-buttons">
              <button 
                @click="submitFeedback" 
                :disabled="!comment.trim() || submitting || comment.length > maxChars"
                :class="['btn-submit', { active: comment.trim() && comment.length <= maxChars }]"
              >
                <Icon icon="lucide:send" v-if="!submitting" />
                <Icon icon="lucide:loader-circle" class="spin" v-else />
                {{ submitting ? 'Sending...' : 'Send' }}
              </button>
              <button 
                @click="resetSelection" 
                :disabled="submitting"
                class="btn-cancel"
              >
                <Icon icon="lucide:x" />
                Cancel
              </button>
            </div>
          </div>
          
          <div v-if="!comment.trim()" class="input-hint">
            <Icon icon="lucide:info" class="hint-icon" />
            <span>Please share your thoughts before submitting</span>
          </div>
          <div v-if="comment.length > maxChars" class="input-hint error-hint">
            <Icon icon="lucide:alert-circle" class="hint-icon" />
            <span>Maximum {{ maxChars }} characters allowed</span>
          </div>
        </div>
      </transition>
      
      <transition name="fade">
        <div v-if="submitted" class="success-state">
          <Icon icon="lucide:check-circle-2" class="success-icon" />
          <div class="success-text">
            <strong>Thank you!</strong>
            <span>Your feedback has been submitted</span>
          </div>
          <div class="success-links">
            <a :href="discussionUrl" target="_blank" rel="noopener noreferrer" class="github-link">
              <Icon icon="lucide:github" />
              <span>View on GitHub</span>
            </a>
            <button @click="reset" class="again-link">
              <Icon icon="lucide:refresh-cw" />
              <span>Submit again</span>
            </button>
          </div>
        </div>
      </transition>
      
      <transition name="fade">
        <div v-if="error" class="error-state">
          <Icon icon="lucide:alert-triangle" class="error-icon" />
          <span>{{ errorMessage }}</span>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

const formattedPageTitle = computed(() => {
  const path = page.value.relativePath
  let title = path.replace(/\.md$/, '').replace(/[-_]/g, ' ')
  title = title.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ')
  return title || 'this page'
})

// Configurare GitHub cu verificări
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN
const GITHUB_REPO = 'WildFiire/docs'  // Setat direct

// Debug - verifică variabilele
console.log('=== GITHUB CONFIG DEBUG ===')
console.log('VITE_GITHUB_TOKEN:', GITHUB_TOKEN ? '✅ Present' : '❌ Missing')
console.log('VITE_GITHUB_REPO:', GITHUB_REPO || '❌ Missing')
console.log('=============================')

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
  
  // Verifică dacă variabilele sunt setate
  if (!GITHUB_TOKEN || !GITHUB_REPO) {
    error.value = true
    errorMessage.value = 'GitHub configuration missing. Please check .env file.'
    setTimeout(() => { error.value = false }, 4000)
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
      
      // Play sound
      const audio = new Audio('/sounds/sunet.mp3')
      audio.play().catch(err => console.log('Audio play failed:', err))
    } else {
      throw new Error('Unexpected response')
    }
    
  } catch (err) {
    console.error(err)
    error.value = true
    errorMessage.value = err.message || 'Failed to submit feedback'
    setTimeout(() => { error.value = false }, 4000)
  } finally {
    submitting.value = false
  }
}

const getRepositoryId = async () => {
  if (!GITHUB_REPO) {
    throw new Error('Repository configuration missing. Please check your .env file.')
  }
  
  const [owner, name] = GITHUB_REPO.split('/')
  
  if (!owner || !name) {
    throw new Error(`Invalid repository format: ${GITHUB_REPO}. Expected format: owner/repo`)
  }
  
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
  if (!GITHUB_REPO) {
    throw new Error('Repository configuration missing. Please check your .env file.')
  }
  
  const [owner, name] = GITHUB_REPO.split('/')
  
  if (!owner || !name) {
    throw new Error(`Invalid repository format: ${GITHUB_REPO}. Expected format: owner/repo`)
  }
  
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
.feedback-wrapper {
  margin-top: 2.5rem;
  width: 100%;
}

.feedback-glass {
  position: relative;
  background: var(--vp-c-bg-soft);
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 1.25rem;
  transition: all 0.3s ease;
  border: 1px solid rgba(249, 115, 22, 0.2);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.feedback-glass::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  padding: 1px;
  background: linear-gradient(135deg, #f97316, #ff8c42, #f97316);
  -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  pointer-events: none;
  opacity: 0.6;
}

.feedback-glass::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: 24px;
  background: radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.15), transparent 70%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.feedback-glass:hover::after {
  opacity: 1;
}

.feedback-glass:hover {
  transform: translateY(-2px);
  border-color: rgba(249, 115, 22, 0.3);
  box-shadow: 0 8px 24px rgba(249, 115, 22, 0.1);
}

.feedback-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.25rem;
  align-items: flex-start;
  position: relative;
  z-index: 1;
}

.header-icon {
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, rgba(249, 115, 22, 0.12), rgba(255, 140, 66, 0.08));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(249, 115, 22, 0.2);
  transition: all 0.2s ease;
}

.feedback-glass:hover .header-icon {
  transform: scale(1.02);
  border-color: rgba(249, 115, 22, 0.35);
}

.header-icon .icon {
  width: 22px;
  height: 22px;
  color: #f97316;
}

.header-text {
  flex: 1;
}

.header-text h3 {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.25rem 0;
  color: var(--vp-c-text-1);
}

.header-text p {
  font-size: 0.8125rem;
  margin: 0;
  color: var(--vp-c-text-2);
  line-height: 1.4;
}

.header-text strong {
  color: #f97316;
  font-weight: 600;
}

.feedback-actions {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  position: relative;
  z-index: 1;
}

.btn-feedback {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--vp-c-text-2);
}

.btn-feedback svg {
  width: 1rem;
  height: 1rem;
  transition: all 0.2s ease;
}

.btn-feedback:hover {
  transform: translateY(-2px);
  border-color: #f97316;
  background: rgba(249, 115, 22, 0.05);
  color: #f97316;
}

.btn-feedback:hover svg {
  transform: scale(1.1);
}

.btn-feedback.active {
  background: linear-gradient(135deg, #f97316, #ff8c42);
  border-color: #f97316;
  color: white;
  box-shadow: 0 4px 12px rgba(249, 115, 22, 0.25);
}

.btn-feedback.active svg {
  color: white;
}

.btn-feedback:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
}

.feedback-detail {
  margin-top: 1rem;
  animation: slideIn 0.25s ease;
  position: relative;
  z-index: 1;
}

.textarea-wrapper {
  position: relative;
}

.comment-input {
  width: 100%;
  padding: 0.75rem 1rem;
  padding-right: 4rem;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 14px;
  color: var(--vp-c-text-1);
  font-family: inherit;
  font-size: 0.8125rem;
  line-height: 1.5;
  resize: vertical;
  transition: all 0.2s ease;
}

.comment-input:focus {
  outline: none;
  border-color: #f97316;
  box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.08);
}

.comment-input::placeholder {
  color: var(--vp-c-text-3);
  font-size: 0.75rem;
}

.char-counter {
  position: absolute;
  bottom: 0.75rem;
  right: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  background: var(--vp-c-bg);
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  backdrop-filter: blur(4px);
  transition: all 0.2s ease;
  pointer-events: none;
}

.char-counter.warning {
  color: #f97316;
}

.counter-icon {
  width: 0.7rem;
  height: 0.7rem;
}

/* Footer Actions - Stars + Buttons on same line */
.footer-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.rating-section {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars-container {
  display: flex;
  gap: 0.25rem;
}

.star-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.25rem;
  transition: all 0.2s ease;
}

.star-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: var(--vp-c-text-3);
  transition: all 0.2s ease;
}

.star-icon.filled {
  color: #fbbf24;
  fill: #fbbf24;
}

.star-btn:hover .star-icon {
  transform: scale(1.1);
  color: #fbbf24;
}

.star-btn.active .star-icon {
  color: #fbbf24;
  fill: #fbbf24;
}

.star-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.rating-label {
  font-size: 0.7rem;
  color: #fbbf24;
  font-weight: 500;
}

.rating-label.muted {
  color: var(--vp-c-text-3);
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-submit,
.btn-cancel {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: transparent;
}

.btn-submit svg,
.btn-cancel svg {
  width: 0.875rem;
  height: 0.875rem;
}

.btn-submit {
  background: rgba(249, 115, 22, 0.25);
  color: rgba(255, 255, 255, 0.5);
}

.btn-submit.active {
  background: linear-gradient(135deg, #f97316, #ff8c42);
  color: white;
  box-shadow: 0 2px 8px rgba(249, 115, 22, 0.2);
}

.btn-submit.active:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 16px rgba(249, 115, 22, 0.3);
}

.btn-submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-cancel {
  border: 1px solid var(--vp-c-divider);
  color: var(--vp-c-text-2);
}

.btn-cancel:hover:not(:disabled) {
  border-color: #f97316;
  color: #f97316;
  background: rgba(249, 115, 22, 0.05);
}

.input-hint {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.75rem;
  padding: 0.5rem 0.75rem;
  background: rgba(249, 115, 22, 0.04);
  border-radius: 10px;
  font-size: 0.7rem;
  color: var(--vp-c-text-3);
  animation: fadeIn 0.2s ease;
}

.input-hint.error-hint {
  background: rgba(239, 68, 68, 0.08);
  color: #f87171;
}

.hint-icon {
  width: 0.75rem;
  height: 0.75rem;
  color: #f97316;
}

.error-hint .hint-icon {
  color: #f87171;
}

.success-state {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding: 0.75rem 1rem;
  background: rgba(249, 115, 22, 0.08);
  border-radius: 14px;
  border: 1px solid rgba(249, 115, 22, 0.15);
  animation: fadeIn 0.25s ease;
}

.success-icon {
  width: 1.125rem;
  height: 1.125rem;
  color: #f97316;
  flex-shrink: 0;
}

.success-text {
  flex: 1;
}

.success-text strong {
  font-size: 0.8125rem;
  color: #f97316;
  display: block;
}

.success-text span {
  font-size: 0.75rem;
  color: var(--vp-c-text-2);
}

.success-links {
  display: flex;
  gap: 0.75rem;
}

.github-link,
.again-link {
  display: inline-flex;
  align-items: center;
  gap: 0.375rem;
  font-size: 0.75rem;
  padding: 0.25rem 0.625rem;
  border-radius: 8px;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease;
  background: transparent;
  border: none;
}

.github-link svg,
.again-link svg {
  width: 0.75rem;
  height: 0.75rem;
}

.github-link {
  color: #f97316;
}

.github-link:hover {
  background: rgba(249, 115, 22, 0.08);
  text-decoration: underline;
}

.again-link {
  color: var(--vp-c-text-2);
}

.again-link:hover {
  color: #f97316;
  background: rgba(249, 115, 22, 0.05);
}

.error-state {
  margin-top: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--vp-c-danger-soft);
  border-radius: 12px;
  font-size: 0.75rem;
  color: var(--vp-c-danger);
  border: 1px solid var(--vp-c-danger-soft);
  animation: fadeIn 0.2s ease;
}

.error-icon {
  width: 1rem;
  height: 1rem;
  color: var(--vp-c-danger);
  flex-shrink: 0;
}

.spin {
  animation: spin 0.6s linear infinite;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-4px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.25s ease;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}

@media (max-width: 640px) {
  .feedback-glass {
    padding: 1rem;
  }
  
  .feedback-header {
    gap: 0.75rem;
  }
  
  .header-icon {
    width: 38px;
    height: 38px;
  }
  
  .header-icon .icon {
    width: 19px;
    height: 19px;
  }
  
  .header-text h3 {
    font-size: 0.9375rem;
  }
  
  .header-text p {
    font-size: 0.75rem;
  }
  
  .btn-feedback {
    padding: 0.5rem 0.75rem;
    font-size: 0.75rem;
  }
  
  .btn-feedback span {
    font-size: 0.75rem;
  }
  
  .footer-actions {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  
  .rating-section {
    justify-content: center;
  }
  
  .action-buttons {
    justify-content: center;
  }
  
  .btn-submit,
  .btn-cancel {
    flex: 1;
  }
  
  .success-state {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .success-links {
    width: 100%;
    justify-content: flex-start;
  }
  
  .char-counter {
    font-size: 0.65rem;
    padding: 0.2rem 0.4rem;
  }
}
</style>
