<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';
import { getDocIconName, getCategoryIconName } from '../../composables/useDocIcons';
import { layout } from '../../composables/useLayout';

defineOptions({ name: 'SidebarItem' });

const props = withDefaults(defineProps<{
  item: any;
  depth?: number;
  globalExpandState?: boolean | null;
}>(), {
  depth: 0,
  globalExpandState: null,
});

const route = useRoute();
const open = ref(true);

const label = computed(() => {
  const raw = props.item.title || props.item.text || '';
  return String(raw).replace(/<[^>]*>/g, '').trim();
});

const slug = computed(() => props.item.slug || '');
const children = computed(() => props.item.children || props.item.items || []);
const hasChildren = computed(() => children.value.length > 0);

const icon = computed(() => {
  if (props.depth === 0 && hasChildren.value) {
    return getCategoryIconName(label.value);
  }
  return getDocIconName(slug.value, label.value);
});

const href = computed(() => props.item.href || props.item.link || '');

const cleanCurrentPath = computed(() => route.path.replace(/\/$/, '') || '/');
const cleanHref = computed(() => href.value.replace(/\/$/, '') || '/');

const active = computed(() => {
  if (!href.value) return false;
  const p = cleanCurrentPath.value;
  const h = cleanHref.value;
  if (p === h) return true;
  if (p === h.replace(/^\/docs/, '')) return true;
  if ('/docs' + p === h) return true;
  return false;
});

const isAncestor = computed(() => {
  if (!href.value || active.value) return false;
  const p = cleanCurrentPath.value;
  const h = cleanHref.value;
  const hUnwrapped = h.replace(/^\/docs/, '');
  return p.startsWith(h + '/') || (hUnwrapped && p.startsWith(hUnwrapped + '/'));
});

const isChildActive = computed(() => {
  if (!hasChildren.value) return false;
  const p = cleanCurrentPath.value;
  return children.value.some((c: any) => {
    const ch = (c.href || c.link || '').replace(/\/$/, '');
    if (!ch) return false;
    const chUnwrapped = ch.replace(/^\/docs/, '');
    return p === ch || p === chUnwrapped || p.startsWith(ch + '/') || p.startsWith(chUnwrapped + '/');
  });
});

// Sync with global Collapse All / Expand All
watch(() => props.globalExpandState, (val) => {
  if (val !== null && val !== undefined) {
    open.value = val;
  }
});

// Auto-expand if active or child is active
watch(() => route.path, () => {
  if (active.value || isAncestor.value || isChildActive.value) {
    open.value = true;
  }
}, { immediate: true });

function toggle(e?: MouseEvent) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  open.value = !open.value;
}

function closeMobileSidebar() {
  if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
    layout.mobileOpen = false;
  }
}
</script>

<template>
  <!-- Top-level Category Group (depth === 0 with items) -->
  <div v-if="depth === 0 && hasChildren" class="nav-group">
    <button
      type="button"
      class="nav-group-header-btn"
      :class="{ 'nav-group-header-btn--open': open }"
      :aria-expanded="open"
      @click="toggle"
    >
      <span class="nav-group-header-left">
        <Icon :icon="icon" width="13" class="nav-group-icon" />
        <span>{{ label }}</span>
      </span>
      <Icon icon="lucide:chevron-right" width="12" class="nav-group-chevron" aria-hidden="true" />
    </button>

    <ul v-show="open" role="list" class="nav-list">
      <SidebarItem
        v-for="(child, i) in children"
        :key="child.slug || child.href || child.link || child.title || i"
        :item="child"
        :depth="depth + 1"
        :global-expand-state="globalExpandState"
      />
    </ul>
  </div>

  <!-- Regular Nav Item or Nested Section with Children (depth > 0) -->
  <li
    v-else
    class="nav-item-wrapper"
    :class="{ 'nav-item-wrapper--has-children': hasChildren }"
  >
    <div class="nav-item-row-container">
      <a
        :href="href || '#'"
        class="nav-item"
        :class="{
          'nav-item--active': active,
          'nav-item--ancestor': isAncestor || isChildActive,
          'nav-item--nested': depth > 1,
        }"
        :aria-current="active ? 'page' : undefined"
        @click="closeMobileSidebar"
      >
        <span class="nav-item-indicator" aria-hidden="true" />
        <span class="nav-item-icon">
          <Icon :icon="icon" :width="depth > 1 ? 12 : 14" />
        </span>
        <span class="nav-item-text">{{ label }}</span>
        <span v-if="item.badge" :class="`nav-item-badge badge--${String(item.badge).toLowerCase()}`">
          {{ item.badge }}
        </span>
      </a>

      <!-- Chevron toggle button for sections with children -->
      <button
        v-if="hasChildren"
        type="button"
        class="nav-item-collapse-btn"
        :class="{ 'nav-item-collapse-btn--open': open }"
        :aria-label="open ? `Collapse ${label} section` : `Expand ${label} section`"
        :title="open ? 'Collapse section' : 'Expand section'"
        @click="toggle"
      >
        <Icon icon="lucide:chevron-right" width="13" aria-hidden="true" />
      </button>
    </div>

    <!-- Nested Sublist -->
    <ul
      v-if="hasChildren && open"
      role="list"
      class="nav-sublist"
      :data-open="open"
    >
      <SidebarItem
        v-for="(child, i) in children"
        :key="child.slug || child.href || child.link || child.title || i"
        :item="child"
        :depth="depth + 1"
        :global-expand-state="globalExpandState"
      />
    </ul>
  </li>
</template>
