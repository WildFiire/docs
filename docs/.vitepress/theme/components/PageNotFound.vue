<!-- .vitepress/theme/components/PageNotFound.vue -->
<template>
  <div class="not-found-page">
    <!-- Background abstract -->
    <div class="not-found-bg">
      <div class="bg-abstract"></div>
      <div class="bg-orb orb-1"></div>
      <div class="bg-orb orb-2"></div>
    </div>

    <!-- Logo sus -->
    <div class="not-found-logo">
      <img src="/icons/wildfire.webp" alt="Wildfire.ro" class="logo-img">
      <div class="logo-ring"></div>
    </div>

    <!-- Content centrat -->
    <div class="not-found-content">
      <!-- 404 Number -->
      <div class="error-number">
        <div class="number-wrapper">
          <span class="number number-1">4</span>
          <div class="zero-container">
            <span class="zero">0</span>
            <div class="zero-ring"></div>
          </div>
          <span class="number number-2">4</span>
        </div>
      </div>

      <!-- Titlu -->
      <h1 class="not-found-title">PAGE NOT FOUND</h1>

      <!-- Mesaj scurt -->
      <p class="not-found-message">
        But if you don't change your direction, you may end up where you are heading.
      </p>

      <!-- Timer + Buton -->
      <div class="action-section">
        <div class="timer-box">
          <span class="timer-number">{{ timer }}</span>
          <span class="timer-text">redirecționare către Acasă</span>
          <button @click="cancelRedirect" class="timer-cancel" v-if="!isCanceled">
            ✕
          </button>
        </div>

        <a href="/" class="home-button">
          <span class="button-icon"></span>
          <span class="button-text">Mergi acasă</span>
          <span class="button-arrow">→</span>
        </a>
      </div>

      <!-- Quick links -->
      <div class="quick-links">
        <p class="quick-links-label">Navigare rapidă</p>
        <div class="quick-links-grid">
          <a href="/" class="quick-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
            Acasă
          </a>
          <a href="/informatii/about" class="quick-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><circle cx="12" cy="8" r="1" fill="currentColor"/></svg>
            Despre
          </a>
          <a href="/informatii/faq" class="quick-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            FAQ
          </a>
          <a href="/team" class="quick-link">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            Echipa
          </a>
        </div>

        <button class="search-trigger" @click="openSearch">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          Caută în documentație
          <kbd>K</kbd>
        </button>
      </div>

      <!-- Quote simplu -->
      <div class="not-found-quote">
        din cenușă, ardem mai tare
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'

const timer = ref(10)
let interval = null
const isCanceled = ref(false)

const startTimer = () => {
  interval = setInterval(() => {
    timer.value -= 1
    
    if (timer.value <= 0) {
      clearInterval(interval)
      if (!isCanceled.value) {
        window.location.href = '/'
      }
    }
  }, 1000)
}

const cancelRedirect = () => {
  isCanceled.value = true
  clearInterval(interval)
}

onMounted(() => {
  startTimer()
})

onBeforeUnmount(() => {
  clearInterval(interval)
})

const openSearch = () => {
  const btn = document.querySelector<HTMLButtonElement>('.VPNavBarSearch button, .DocSearch-Button')
  if (btn) { btn.click(); return }
  const kbdEvent = new KeyboardEvent('keydown', { key: 'k', metaKey: true, bubbles: true })
  document.dispatchEvent(kbdEvent)
}
</script>

<style scoped>
.not-found-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0a0a0a;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* Background */
.not-found-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 0;
}

.bg-abstract {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(circle at 20% 30%, rgba(255, 140, 0, 0.05) 0%, transparent 30%),
    radial-gradient(circle at 80% 70%, rgba(255, 140, 0, 0.05) 0%, transparent 40%);
}

.bg-orb {
  position: absolute;
  width: min(400px, 80vw);
  height: min(400px, 80vw);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 140, 0, 0.05) 0%, transparent 70%);
  filter: blur(60px);
}

.orb-1 {
  top: -150px;
  left: -150px;
  animation: float 20s ease-in-out infinite;
}

.orb-2 {
  bottom: -150px;
  right: -150px;
  animation: float 25s ease-in-out infinite reverse;
}

@keyframes float {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(40px, -40px); }
}

/* Logo sus */
.not-found-logo {
  position: relative;
  z-index: 10;
  margin-bottom: clamp(10px, 3vh, 30px);
  width: clamp(60px, 15vw, 100px);
  height: clamp(60px, 15vw, 100px);
  animation: logoAppear 0.8s ease;
}

@keyframes logoAppear {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

.logo-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
  z-index: 2;
  filter: drop-shadow(0 0 15px rgba(255, 140, 0, 0.3));
  animation: gentleFloat 4s ease-in-out infinite;
}

@keyframes gentleFloat {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.logo-ring {
  position: absolute;
  top: -10%;
  left: -10%;
  right: -10%;
  bottom: -10%;
  border: 2px solid transparent;
  border-radius: 50%;
  border-top-color: #ff7800;
  border-bottom-color: #ff7800;
  animation: ringSpin 6s linear infinite;
  opacity: 0.5;
}

@keyframes ringSpin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Content */
.not-found-content {
  position: relative;
  z-index: 2;
  max-width: 600px;
  width: 100%;
  text-align: center;
  animation: fadeIn 0.5s ease;
  padding: 0 15px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 404 Number - responsive */
.error-number {
  margin-bottom: clamp(15px, 3vh, 25px);
}

.number-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(2px, 1vw, 10px);
  flex-wrap: wrap;
}

.number {
  font-size: clamp(60px, 20vw, 120px);
  font-weight: 700;
  color: #1a1a1a;
  line-height: 1;
  text-shadow: 2px 2px 0 rgba(255, 140, 0, 0.1);
}

.number-1 {
  transform: rotate(-2deg);
}

.number-2 {
  transform: rotate(2deg);
}

.zero-container {
  position: relative;
  width: clamp(70px, 22vw, 130px);
  height: clamp(70px, 22vw, 130px);
  display: flex;
  align-items: center;
  justify-content: center;
}

.zero {
  font-size: clamp(70px, 22vw, 130px);
  font-weight: 700;
  color: #ff7800;
  line-height: 1;
  position: relative;
  z-index: 2;
  text-shadow: 0 0 20px rgba(255, 140, 0, 0.2);
}

.zero-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  border: 2px dashed rgba(255, 140, 0, 0.2);
  border-radius: 50%;
  animation: spin 15s linear infinite;
}

@keyframes spin {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

/* Titlu */
.not-found-title {
  font-size: clamp(20px, 6vw, 32px);
  font-weight: 600;
  margin: 0 0 10px 0;
  color: #e0e0e0;
  letter-spacing: clamp(2px, 1vw, 4px);
  text-transform: uppercase;
  line-height: 1.3;
}

/* Mesaj */
.not-found-message {
  font-size: clamp(13px, 4vw, 16px);
  color: #777;
  margin-bottom: clamp(20px, 4vh, 35px);
  line-height: 1.6;
  max-width: 90%;
  margin-left: auto;
  margin-right: auto;
  font-style: italic;
  padding: 0 10px;
}

/* Action section */
.action-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(15px, 3vh, 25px);
  margin-bottom: clamp(20px, 4vh, 35px);
  width: 100%;
}

/* Timer box - responsive */
.timer-box {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: clamp(8px, 2vw, 12px);
  padding: clamp(6px, 1.5vh, 10px) clamp(12px, 3vw, 20px);
  background: rgba(20, 20, 20, 0.8);
  backdrop-filter: blur(5px);
  border-radius: 40px;
  border: 1px solid rgba(255, 140, 0, 0.15);
  font-size: clamp(12px, 3.5vw, 14px);
  flex-wrap: wrap;
  width: fit-content;
  max-width: 100%;
}

.timer-number {
  font-weight: 600;
  color: #ff7800;
  background: rgba(255, 140, 0, 0.1);
  padding: 2px 8px;
  border-radius: 20px;
  font-size: clamp(11px, 3vw, 13px);
  white-space: nowrap;
}

.timer-text {
  color: #888;
  white-space: nowrap;
}

.timer-cancel {
  background: transparent;
  border: 1px solid rgba(255, 140, 0, 0.2);
  color: #aaa;
  width: clamp(20px, 5vw, 24px);
  height: clamp(20px, 5vw, 24px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: clamp(10px, 3vw, 12px);
  transition: all 0.2s ease;
  padding: 0;
}

.timer-cancel:hover {
  border-color: #ff7800;
  color: #ff7800;
  background: rgba(255, 140, 0, 0.1);
}

/* Home button - responsive */
.home-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: clamp(6px, 1.5vw, 10px);
  padding: clamp(10px, 2.5vh, 14px) clamp(20px, 6vw, 32px);
  background: linear-gradient(135deg, #ff7800, #ff7800);
  color: white;
  text-decoration: none;
  border-radius: 40px;
  font-size: clamp(14px, 4vw, 17px);
  font-weight: 500;
  transition: all 0.3s ease;
  border: none;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  width: fit-content;
  max-width: 100%;
}

.home-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4);
}

.button-icon {
  font-size: clamp(16px, 5vw, 20px);
}

.button-arrow {
  transition: transform 0.3s ease;
  font-size: clamp(16px, 5vw, 20px);
}

.home-button:hover .button-arrow {
  transform: translateX(4px);
}

/* Quote */
.not-found-quote {
  color: #555;
  font-size: clamp(12px, 3.5vw, 14px);
  font-style: italic;
  letter-spacing: 0.5px;
  border-top: 1px solid rgba(255, 140, 0, 0.1);
  padding-top: clamp(15px, 3vh, 20px);
  margin-top: clamp(10px, 2vh, 15px);
  width: 100%;
}

/* Tablet optimization */
@media (min-width: 768px) and (max-width: 1024px) {
  .not-found-logo {
    width: 80px;
    height: 80px;
  }
  
  .number {
    font-size: 90px;
  }
  
  .zero {
    font-size: 100px;
  }
  
  .zero-container {
    width: 100px;
    height: 100px;
  }
  
  .not-found-title {
    font-size: 28px;
  }
  
  .not-found-message {
    font-size: 15px;
    max-width: 80%;
  }
}

/* Landscape orientation */
@media (max-height: 600px) and (orientation: landscape) {
  .not-found-page {
    min-height: 100vh;
    padding: 15px;
  }
  
  .not-found-logo {
    width: 50px;
    height: 50px;
    margin-bottom: 10px;
  }
  
  .error-number {
    margin-bottom: 10px;
  }
  
  .not-found-message {
    margin-bottom: 15px;
    max-width: 70%;
  }
  
  .action-section {
    gap: 12px;
    margin-bottom: 15px;
  }
  
  .not-found-quote {
    padding-top: 12px;
    margin-top: 8px;
  }
}

/* Small phones */
@media (max-width: 380px) {
  .timer-box {
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    padding: 8px 12px;
  }
  
  .timer-text {
    white-space: normal;
    text-align: center;
    width: 100%;
  }
  
  .timer-number {
    margin-right: 0;
  }
  
  .timer-cancel {
    margin-left: 0;
  }
  
  .not-found-message {
    max-width: 95%;
  }
}

/* Prevent overflow on very small devices */
@media (max-width: 320px) {
  .home-button {
    padding: 10px 16px;
    font-size: 13px;
  }
  
  .button-icon, .button-arrow {
    font-size: 14px;
  }
  
  .not-found-title {
    font-size: 18px;
    letter-spacing: 1px;
  }
}

/* Quick links */
.quick-links {
  margin-top: 8px;
  margin-bottom: 8px;
  width: 100%;
  text-align: center;
}

.quick-links-label {
  font-size: 11px;
  color: #555;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  margin-bottom: 12px;
}

.quick-links-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
  margin-bottom: 14px;
}

.quick-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 14px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 140, 0, 0.12);
  border-radius: 30px;
  color: #aaa;
  text-decoration: none;
  font-size: 13px;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.quick-link:hover {
  background: rgba(255, 140, 0, 0.08);
  border-color: rgba(255, 140, 0, 0.3);
  color: #ff7800;
  transform: translateY(-2px);
}

.quick-link svg {
  flex-shrink: 0;
}

.search-trigger {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 18px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px dashed rgba(255, 140, 0, 0.2);
  border-radius: 30px;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.search-trigger:hover {
  background: rgba(255, 140, 0, 0.07);
  border-color: rgba(255, 140, 0, 0.4);
  color: #ff7800;
}

.search-trigger kbd {
  background: rgba(255, 140, 0, 0.15);
  border: 1px solid rgba(255, 140, 0, 0.3);
  border-radius: 4px;
  padding: 1px 6px;
  font-size: 11px;
  font-family: monospace;
  color: #ff7800;
}
</style>
