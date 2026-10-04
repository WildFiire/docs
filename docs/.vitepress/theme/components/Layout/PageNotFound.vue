<script setup lang="ts">
import { onMounted } from 'vue';

onMounted(() => {
  if (typeof window !== 'undefined') {
    const p = window.location.pathname;
    let target = p;
    if (target.includes('regulamento')) target = target.replace(/regulamento/g, 'regulamente');
    if (target.includes('/regulamente/go/')) target = target.replace('/regulamente/go/', '/regulamente/');
    if (!target.startsWith('/docs') && !['/team', '/changelog', '/maintenance', '/admin'].some(x => target.startsWith(x))) {
      target = '/docs' + (target.startsWith('/') ? target : '/' + target);
    }
    if (target !== p) {
      window.location.replace(target);
    }
  }
});
</script>

<template>
  <div
    class="not-found-wrapper"
    style="
      align-items: center;
      display: flex;
      flex-direction: column;
      gap: var(--space-5);
      justify-content: center;
      min-height: 60vh;
      padding: var(--space-16) var(--space-6);
      text-align: center;
    "
  >
    <div
      class="not-found-icon-container"
      style="
        align-items: center;
        background: var(--color-bg-subtle);
        border: 1px solid var(--color-border);
        border-radius: var(--radius-full);
        color: var(--color-text-tertiary);
        display: flex;
        height: 64px;
        justify-content: center;
        width: 64px;
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="28"
        height="28"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        aria-hidden="true"
      >
        <path d="M12 17h.01" />
        <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7z" />
        <path d="M9.1 9a3 3 0 0 1 5.82 1c0 2-3 3-3 3" />
      </svg>
    </div>

    <div>
      <h1
        style="
          font-size: var(--text-2xl);
          font-weight: 700;
          letter-spacing: -0.02em;
          color: var(--color-text);
          margin-bottom: var(--space-2);
          margin-top: 0;
          line-height: 1.25;
        "
      >
        Page not found
      </h1>
      <p
        style="
          color: var(--color-text-secondary);
          font-size: var(--text-base);
          margin: 0;
          line-height: 1.5;
        "
      >
        This page doesn't exist yet, or may have been moved.
      </p>
    </div>

    <a
      href="/"
      class="not-found-link-btn"
      style="
        align-items: center;
        background: var(--color-primary);
        border-radius: var(--radius-md);
        color: var(--color-text-on-primary);
        display: inline-flex;
        font-size: var(--text-sm);
        font-weight: 600;
        padding: var(--space-2) var(--space-5);
        text-decoration: none;
        transition: opacity var(--transition-fast);
      "
    >
      Back to docs
    </a>
  </div>
</template>

<style scoped>
.not-found-link-btn:hover {
  opacity: 0.88;
}
</style>
