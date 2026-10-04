<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';

interface AnnouncementSettings {
  enabled: boolean;
  text: string;
  type?: 'info' | 'warning' | 'success';
  link?: string;
  linkText?: string;
}

const settings = ref<AnnouncementSettings | null>(null);
const dismissed = ref(false);

const ICON_MAP = {
  info: 'lucide:info',
  warning: 'lucide:triangle-alert',
  success: 'lucide:sparkles',
};

const icon = computed(() => ICON_MAP[settings.value?.type ?? 'info'] || ICON_MAP.info);

function dismiss() {
  dismissed.value = true;
  if (settings.value?.text) {
    try { sessionStorage.setItem(`wf_announcement_${settings.value.text}`, '1'); } catch {}
  }
  document.documentElement.style.setProperty('--announcement-height', '0px');
}

onMounted(async () => {
  try {
    const data = await api('/api/admin/settings');
    const ann = data.announcement as AnnouncementSettings | undefined;
    if (ann?.enabled && ann.text) {
      const isDismissed = sessionStorage.getItem(`wf_announcement_${ann.text}`);
      if (!isDismissed) {
        settings.value = ann;
        document.documentElement.style.setProperty('--announcement-height', '38px');
      } else {
        dismissed.value = true;
        document.documentElement.style.setProperty('--announcement-height', '0px');
      }
    } else {
      document.documentElement.style.setProperty('--announcement-height', '0px');
    }
  } catch {
    document.documentElement.style.setProperty('--announcement-height', '0px');
  }
});
</script>

<template>
  <Transition name="banner-slide">
    <div
      v-if="settings && !dismissed"
      class="announcement-banner"
      :class="`announcement-banner--${settings.type || 'info'}`"
      role="banner"
    >
      <div class="announcement-inner">
        <Icon :icon="icon" width="14" class="ann-icon" aria-hidden="true" />
        <span class="ann-text">{{ settings.text }}</span>
        <a v-if="settings.link" :href="settings.link" class="ann-link">
          {{ settings.linkText || 'Află mai mult' }}
          <Icon icon="lucide:arrow-right" width="12" />
        </a>
        <button type="button" class="ann-close" @click="dismiss" aria-label="Închide anunțul">
          <Icon icon="lucide:x" width="13" />
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.announcement-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 500;
}
.announcement-banner--info {
  background: linear-gradient(90deg, hsl(210 85% 56% / 0.15), hsl(210 85% 56% / 0.08));
  border-bottom: 1px solid hsl(210 85% 56% / 0.25);
  color: hsl(210 85% 70%);
}
.announcement-banner--warning {
  background: linear-gradient(90deg, hsl(44 100% 52% / 0.15), hsl(44 100% 52% / 0.08));
  border-bottom: 1px solid hsl(44 100% 52% / 0.25);
  color: hsl(44 100% 60%);
}
.announcement-banner--success {
  background: linear-gradient(90deg, hsl(26 100% 52% / 0.15), hsl(26 100% 52% / 0.08));
  border-bottom: 1px solid hsl(26 100% 52% / 0.25);
  color: var(--color-primary);
}
.announcement-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 16px;
  max-width: 900px;
  width: 100%;
}
.ann-icon { flex-shrink: 0; }
.ann-text { flex: 1; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.ann-link {
  display: flex;
  align-items: center;
  gap: 4px;
  font-weight: 700;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
  opacity: .9;
}
.ann-link:hover { opacity: 1; text-decoration: underline; }
.ann-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 4px;
  color: inherit;
  opacity: .7;
  flex-shrink: 0;
}
.ann-close:hover { opacity: 1; background: rgba(255,255,255,.08); }
.banner-slide-enter-active, .banner-slide-leave-active { transition: transform .2s ease, opacity .2s; }
.banner-slide-enter-from, .banner-slide-leave-to { transform: translateY(-100%); opacity: 0; }
</style>
