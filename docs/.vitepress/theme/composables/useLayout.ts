import { reactive, onMounted, onUnmounted } from 'vue';

export const layout = reactive({
  mode: 'standard',
  sidebarOpen: true,
  tocOpen: true,
  mobileOpen: false,
});

export function setLayout(mode: string) {
  if (!['standard', 'focus', 'full'].includes(mode)) return;
  layout.mode = mode;
  layout.sidebarOpen = mode === 'standard';
  layout.tocOpen = mode !== 'full';
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('wf_docs_layout_mode', mode);
    } catch {}
    document.documentElement.dataset.layout = mode;
  }
}

export function toggleSidebar() {
  const next = !layout.sidebarOpen;
  layout.sidebarOpen = next;
  if (next) {
    setLayout('standard');
  } else {
    setLayout(layout.tocOpen ? 'focus' : 'full');
  }
}

export function toggleToc() {
  layout.tocOpen = !layout.tocOpen;
}

export function useLayout() {
  const key = (e: KeyboardEvent) => {
    if ((e.target as HTMLElement)?.closest('input,textarea,[contenteditable]')) return;
    if (e.key === '[') {
      e.preventDefault();
      toggleSidebar();
    }
    if (e.key === ']') {
      e.preventDefault();
      toggleToc();
    }
  };

  onMounted(() => {
    try {
      const saved = localStorage.getItem('wf_docs_layout_mode') || 'standard';
      setLayout(saved);
    } catch {}
    window.addEventListener('keydown', key);
  });

  onUnmounted(() => window.removeEventListener('keydown', key));
  return layout;
}
