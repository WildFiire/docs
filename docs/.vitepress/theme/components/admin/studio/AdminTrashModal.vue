<script setup lang="ts">
import { ref, watch } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../../composables/useApi';

interface TrashFile {
  id: string;
  originalPath: string;
  deletedAt: number;
  size: number;
}

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'restored'): void;
}>();

const files = ref<TrashFile[]>([]);
const loading = ref(false);
const error = ref('');

async function fetchTrashFiles() {
  try {
    loading.value = true;
    error.value = '';
    const data = await api('/api/admin/doc/trash');
    files.value = data?.files || [];
  } catch (err: any) {
    error.value = err.message || 'Eroare la obținerea listei de trash.';
  } finally {
    loading.value = false;
  }
}

watch(
  () => props.isOpen,
  (val) => {
    if (val) {
      fetchTrashFiles();
    } else {
      error.value = '';
    }
  },
  { immediate: true }
);

async function handleAction(id: string, action: 'restore' | 'delete_forever') {
  try {
    await api('/api/admin/doc/trash', { id, action });
    await fetchTrashFiles();
    if (action === 'restore') {
      emit('restored');
    }
  } catch (err: any) {
    alert('Eroare de conexiune: ' + err.message);
  }
}

function confirmAndDeleteForever(id: string) {
  if (confirm('Sigur vrei să ștergi acest document DEFINITIV?')) {
    handleAction(id, 'delete_forever');
  }
}
</script>

<template>
  <div v-if="isOpen" class="studio-modal-overlay" @click="emit('close')">
    <div
      class="studio-modal"
      style="width: 600px; max-height: 80vh; display: flex; flex-direction: column;"
      @click.stop
    >
      <div class="studio-modal-header">
        <div class="studio-modal-title">
          <Icon icon="lucide:trash-2" width="16" height="16" />
          <span>Recycle Bin (Documente Șterse)</span>
        </div>
        <button type="button" class="studio-modal-close" @click="emit('close')">
          <Icon icon="lucide:x" width="16" height="16" />
        </button>
      </div>

      <div class="studio-modal-body" style="overflow-y: auto; flex: 1; padding: 16px;">
        <p style="font-size: 12px; color: var(--text-muted); margin-bottom: 16px;">
          Documentele sunt păstrate aici timp de 10 ore înainte de a fi șterse definitiv.
        </p>

        <div v-if="error" style="color: hsl(0 84% 60%); font-size: 13px; margin-bottom: 16px;">
          {{ error }}
        </div>

        <div v-if="loading" style="text-align: center; padding: 20px; color: var(--text-muted);">
          Se încarcă...
        </div>
        <div
          v-else-if="files.length === 0"
          style="text-align: center; padding: 40px 20px; color: var(--text-muted); background: rgba(0,0,0,0.2); border-radius: 8px;"
        >
          <Icon icon="lucide:trash-2" width="32" height="32" style="opacity: 0.3; margin-bottom: 8px;" />
          <div>Coșul de gunoi este gol.</div>
        </div>
        <div v-else style="display: flex; flex-direction: column; gap: 8px;">
          <div
            v-for="f in files"
            :key="f.id"
            style="display: flex; align-items: center; justify-content: space-between; background: rgba(255,255,255,0.03); padding: 12px; border-radius: 6px; border: 1px solid var(--glass-border);"
          >
            <div style="display: flex; flex-direction: column; gap: 4px; overflow: hidden;">
              <div style="display: flex; align-items: center; gap: 6px; color: #fff; font-size: 13px; font-weight: 500;">
                <Icon icon="lucide:file-code" width="13" height="13" style="color: var(--color-primary);" />
                <span style="text-overflow: ellipsis; overflow: hidden; white-space: nowrap;">{{ f.originalPath }}</span>
              </div>
              <div style="display: flex; align-items: center; gap: 6px; color: var(--text-muted); font-size: 11px;">
                <Icon icon="lucide:clock" width="11" height="11" />
                <span>Șters acum: {{ new Date(f.deletedAt).toLocaleString('ro-RO') }}</span>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 8px; flex-shrink: 0;">
              <button
                type="button"
                style="display: flex; align-items: center; gap: 4px; background: rgba(56, 189, 248, 0.1); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.2); padding: 4px 10px; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 600;"
                title="Restaurează documentul"
                @click="handleAction(f.id, 'restore')"
              >
                <Icon icon="lucide:refresh-ccw" width="12" height="12" /> Restore
              </button>
              <button
                type="button"
                style="display: flex; align-items: center; gap: 4px; background: rgba(239, 68, 68, 0.1); color: hsl(0 84% 60%); border: 1px solid rgba(239, 68, 68, 0.2); padding: 4px 10px; border-radius: 4px; font-size: 12px; cursor: pointer; font-weight: 600;"
                title="Șterge definitiv"
                @click="confirmAndDeleteForever(f.id)"
              >
                <Icon icon="lucide:trash-2" width="12" height="12" /> Delete Forever
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
