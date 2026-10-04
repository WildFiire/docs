<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vitepress';
import { Icon } from '@iconify/vue';

interface BreadcrumbItem {
  title: string;
  href?: string;
  isCurrent?: boolean;
}

const props = defineProps<{
  items?: BreadcrumbItem[];
}>();

const route = useRoute();

const crumbs = computed<BreadcrumbItem[]>(() => {
  if (props.items?.length) return props.items;

  const parts = route.path.replace(/\/$/, '').split('/').filter(Boolean);
  const result: BreadcrumbItem[] = [];
  let href = '';

  for (let i = 0; i < parts.length; i++) {
    href += '/' + parts[i];
    const isLast = i === parts.length - 1;
    result.push({
      title: parts[i]
        .replace(/-/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase()),
      href: isLast ? undefined : href,
      isCurrent: isLast,
    });
  }

  return result;
});
</script>

<template>
  <nav v-if="crumbs.length > 1" aria-label="Breadcrumb" class="breadcrumbs">
    <ol>
      <li v-for="(item, i) in crumbs" :key="item.href || item.title">
        <Icon v-if="i > 0" icon="lucide:chevron-right" width="14" class="breadcrumb-sep" aria-hidden="true" />
        <span v-if="item.isCurrent" aria-current="page">{{ item.title }}</span>
        <a v-else :href="item.href">{{ item.title }}</a>
      </li>
    </ol>
  </nav>
</template>
