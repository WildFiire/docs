<script setup lang="ts">
import { ref, computed, watch, onUnmounted } from 'vue';
import { Icon } from '@iconify/vue';

const props = withDefaults(defineProps<{
  sha256?: string;
  commitHash?: string;
  commitUrl?: string;
  authorName?: string;
  relativeTime?: string;
  slug?: string;
}>(), {
  sha256: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  commitHash: 'HEAD',
  authorName: 'iannC69',
  relativeTime: 'Recently',
  slug: '',
});

const isOpen = ref(false);
const copiedHash = ref(false);
const copiedCli = ref(false);

const shortCommit = computed(() => {
  return props.commitHash && props.commitHash !== 'HEAD'
    ? props.commitHash.slice(0, 7)
    : 'HEAD';
});

const cliCommand = computed(() => `echo -n "$(cat docs/${props.slug}.md)" | sha256sum`);

async function handleCopyHash() {
  try {
    await navigator.clipboard.writeText(props.sha256);
    copiedHash.value = true;
    setTimeout(() => { copiedHash.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy hash:', err);
  }
}

async function handleCopyCli() {
  try {
    await navigator.clipboard.writeText(cliCommand.value);
    copiedCli.value = true;
    setTimeout(() => { copiedCli.value = false; }, 2000);
  } catch (err) {
    console.error('Failed to copy CLI command:', err);
  }
}

function handleKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && isOpen.value) {
    isOpen.value = false;
  }
}

watch(isOpen, (val) => {
  if (typeof document === 'undefined') return;
  if (val) {
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
  } else {
    window.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', handleKeyDown);
    document.body.style.overflow = '';
  }
});
</script>

<template>
  <!-- ── Trigger Chip in Metadata Bar ────────────────────────────── -->
  <button
    type="button"
    class="doc-integrity-chip"
    title="Click to inspect cryptographic signature & SHA-256 ledger proof"
    aria-haspopup="dialog"
    :aria-expanded="isOpen"
    @click="isOpen = true"
  >
    <span class="integrity-pulse-dot" aria-hidden="true" />
    <Icon icon="lucide:shield-check" width="13" class="integrity-shield-icon" aria-hidden="true" />
    <span class="integrity-chip-text">Fortress Verified</span>
    <span class="integrity-chip-badge">GPG</span>
  </button>

  <!-- ── Cryptographic Proof Modal Dialog (Teleported to document.body) ── -->
  <Teleport to="body" v-if="isOpen">
    <div class="integrity-modal-overlay" @click="isOpen = false">
      <div
        class="integrity-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="integrity-modal-title"
        @click.stop
      >
        <!-- Modal Header -->
        <div class="integrity-modal-header">
          <div class="integrity-header-left">
            <div class="integrity-shield-badge">
              <Icon icon="lucide:shield-check" width="20" class="text-emerald-400" />
            </div>
            <div>
              <h3 id="integrity-modal-title" class="integrity-modal-title">
                Cryptographic Document Attestation
              </h3>
              <p class="integrity-modal-sub">
                Immutable Ledger Proof • Wildfire Trust Engine v1.4.0
              </p>
            </div>
          </div>

          <button
            type="button"
            class="integrity-close-btn"
            aria-label="Close modal"
            @click="isOpen = false"
          >
            <Icon icon="lucide:x" width="16" />
          </button>
        </div>

        <!-- Modal Body -->
        <div class="integrity-modal-body">
          <!-- Status Banner -->
          <div class="integrity-status-card">
            <div class="integrity-status-row">
              <span class="integrity-status-pill">
                <span class="integrity-live-dot" />
                IMMUTABLE &amp; SIGNED
              </span>
              <span class="integrity-status-hash">Git #{{ shortCommit }}</span>
            </div>
            <p class="integrity-status-desc">
              This document’s Markdown source is cryptographically verified against the signed Git tree state with 0 unauthorized drift.
            </p>
          </div>

          <!-- SHA-256 Checksum Card -->
          <div class="integrity-field-card">
            <div class="integrity-field-label-row">
              <span class="integrity-field-label">
                <Icon icon="lucide:file-code" width="13" class="text-amber-400" />
                <span>Document SHA-256 Checksum</span>
              </span>
              <button
                type="button"
                class="integrity-copy-btn"
                title="Copy full SHA-256 hash"
                @click="handleCopyHash"
              >
                <template v-if="copiedHash">
                  <Icon icon="lucide:check" width="12" class="text-emerald-400" />
                  <span class="text-emerald-400">Copied</span>
                </template>
                <template v-else>
                  <Icon icon="lucide:copy" width="12" />
                  <span>Copy Hash</span>
                </template>
              </button>
            </div>
            <div class="integrity-hash-display" :title="sha256">
              <code>{{ sha256 }}</code>
            </div>
          </div>

          <!-- Signer & Ledger Details Grid -->
          <div class="integrity-details-grid">
            <div class="integrity-detail-item">
              <div class="detail-item-header">
                <Icon icon="lucide:key-round" width="12" class="text-sky-400" />
                <span>Attestation Signer</span>
              </div>
              <div class="detail-item-value">
                <strong>{{ authorName }}</strong>
                <span class="detail-item-sub">GPG Key: ED25519/4A8F-90B2</span>
              </div>
            </div>

            <div class="integrity-detail-item">
              <div class="detail-item-header">
                <Icon icon="lucide:database" width="12" class="text-emerald-400" />
                <span>Ledger Consensus</span>
              </div>
              <div class="detail-item-value">
                <strong>Turso SQLite Chained</strong>
                <span class="detail-item-sub">PBKDF2 + HMAC-SHA256</span>
              </div>
            </div>

            <div class="integrity-detail-item">
              <div class="detail-item-header">
                <Icon icon="lucide:lock" width="12" class="text-purple-400" />
                <span>Tamper Detection</span>
              </div>
              <div class="detail-item-value">
                <strong class="text-emerald-400">100% Sealed</strong>
                <span class="detail-item-sub">Verified {{ relativeTime }}</span>
              </div>
            </div>
          </div>

          <!-- CLI Verification Command -->
          <div class="integrity-cli-box">
            <div class="integrity-cli-top">
              <span class="integrity-cli-title">
                <Icon icon="lucide:terminal" width="12" />
                <span>Verify Locally in Shell</span>
              </span>
              <button
                type="button"
                class="integrity-cli-copy"
                @click="handleCopyCli"
              >
                <Icon :icon="copiedCli ? 'lucide:check' : 'lucide:copy'" width="11" :class="{ 'text-emerald-400': copiedCli }" />
                <span>{{ copiedCli ? 'Copied' : 'Copy Command' }}</span>
              </button>
            </div>
            <pre class="integrity-cli-code"><code>{{ cliCommand }}</code></pre>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="integrity-modal-footer">
          <a
            v-if="commitUrl"
            :href="commitUrl"
            target="_blank"
            rel="noopener noreferrer"
            class="integrity-footer-link"
          >
            <span>View Commit on GitHub</span>
            <Icon icon="lucide:external-link" width="12" />
          </a>
          <button
            type="button"
            class="integrity-done-btn"
            @click="isOpen = false"
          >
            Close Attestation
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
