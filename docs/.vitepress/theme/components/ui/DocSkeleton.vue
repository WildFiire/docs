<script setup lang="ts">
// 1:1 Port of wf-docscore/components/ui/DocSkeleton.tsx
</script>

<template>
  <div class="doc-skeleton-container" aria-hidden="true">
    <div class="doc-skeleton-main">
      <!-- Breadcrumb Skeleton -->
      <div class="doc-skeleton-breadcrumbs">
        <div class="doc-skeleton-box doc-skeleton-crumb-1" />
        <div class="doc-skeleton-crumb-sep">/</div>
        <div class="doc-skeleton-box doc-skeleton-crumb-2" />
      </div>

      <!-- Article Title & Description Skeleton -->
      <div class="doc-skeleton-header">
        <div class="doc-skeleton-box doc-skeleton-title" />
        <div class="doc-skeleton-box doc-skeleton-desc-1" />
        <div class="doc-skeleton-box doc-skeleton-desc-2" />
      </div>

      <!-- Metadata Badges Skeleton -->
      <div class="doc-skeleton-meta-row">
        <div class="doc-skeleton-box doc-skeleton-badge" />
        <div class="doc-skeleton-box doc-skeleton-badge" />
        <div class="doc-skeleton-box doc-skeleton-badge" />
        <div class="doc-skeleton-box doc-skeleton-badge-sm" />
      </div>

      <div class="doc-skeleton-divider" />

      <!-- Paragraph 1 -->
      <div class="doc-skeleton-paragraph">
        <div class="doc-skeleton-box doc-skeleton-line doc-skeleton-w-full" />
        <div class="doc-skeleton-box doc-skeleton-line doc-skeleton-w-92" />
        <div class="doc-skeleton-box doc-skeleton-line doc-skeleton-w-85" />
        <div class="doc-skeleton-box doc-skeleton-line doc-skeleton-w-60" />
      </div>

      <!-- Heading 2 Skeleton -->
      <div class="doc-skeleton-box doc-skeleton-h2" />

      <!-- Code Block Skeleton -->
      <div class="doc-skeleton-code-block">
        <div class="doc-skeleton-code-header">
          <div class="doc-skeleton-dots">
            <span />
            <span />
            <span />
          </div>
          <div class="doc-skeleton-box doc-skeleton-code-lang" />
        </div>
        <div class="doc-skeleton-code-body">
          <div class="doc-skeleton-box doc-skeleton-code-line doc-skeleton-w-75" />
          <div class="doc-skeleton-box doc-skeleton-code-line doc-skeleton-w-50" />
          <div class="doc-skeleton-box doc-skeleton-code-line doc-skeleton-w-90" />
          <div class="doc-skeleton-box doc-skeleton-code-line doc-skeleton-w-65" />
          <div class="doc-skeleton-box doc-skeleton-code-line doc-skeleton-w-40" />
        </div>
      </div>

      <!-- Callout Alert Skeleton -->
      <div class="doc-skeleton-callout">
        <div class="doc-skeleton-box doc-skeleton-callout-icon" />
        <div class="doc-skeleton-callout-text">
          <div class="doc-skeleton-box doc-skeleton-line doc-skeleton-w-95" />
          <div class="doc-skeleton-box doc-skeleton-line doc-skeleton-w-70" />
        </div>
      </div>

      <!-- Paragraph 2 -->
      <div class="doc-skeleton-paragraph">
        <div class="doc-skeleton-box doc-skeleton-line doc-skeleton-w-full" />
        <div class="doc-skeleton-box doc-skeleton-line doc-skeleton-w-90" />
        <div class="doc-skeleton-box doc-skeleton-line doc-skeleton-w-78" />
      </div>

      <!-- Page Nav Skeleton (Prev / Next) -->
      <div class="doc-skeleton-footer-nav">
        <div class="doc-skeleton-nav-card">
          <div class="doc-skeleton-box doc-skeleton-nav-sub" />
          <div class="doc-skeleton-box doc-skeleton-nav-title" />
        </div>
        <div class="doc-skeleton-nav-card">
          <div class="doc-skeleton-box doc-skeleton-nav-sub" />
          <div class="doc-skeleton-box doc-skeleton-nav-title" />
        </div>
      </div>
    </div>

    <!-- Right Column: Table of Contents Skeleton -->
    <aside class="doc-skeleton-toc">
      <div class="doc-skeleton-box doc-skeleton-toc-header" />
      <div class="doc-skeleton-toc-list">
        <div class="doc-skeleton-box doc-skeleton-toc-item doc-skeleton-toc-item--active" />
        <div class="doc-skeleton-box doc-skeleton-toc-item doc-skeleton-w-80" />
        <div class="doc-skeleton-box doc-skeleton-toc-item doc-skeleton-w-65 doc-skeleton-toc-sub" />
        <div class="doc-skeleton-box doc-skeleton-toc-item doc-skeleton-w-70 doc-skeleton-toc-sub" />
        <div class="doc-skeleton-box doc-skeleton-toc-item doc-skeleton-w-85" />
        <div class="doc-skeleton-box doc-skeleton-toc-item doc-skeleton-w-55" />
      </div>
    </aside>
  </div>
</template>
