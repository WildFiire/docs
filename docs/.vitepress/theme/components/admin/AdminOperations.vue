<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { api } from '../../composables/useApi';
import AdminFields from './AdminFields.vue';
const props = defineProps<{ section: string; data: any; user: any }>();
const emit = defineEmits<{ refresh: [] }>();
function confirm(message: string) {
  return window.confirm(message);
}
const error = ref(''),
  message = ref(''),
  busy = ref(false),
  prompt = ref(''),
  answer = ref(''),
  prefs = ref<any>({}),
  schedule = ref<any>({}),
  selectedTask = ref(''),
  comment = ref('');
watch(
  () => props.data.manifest,
  (value) => {
    if (value)
      schedule.value = {
        autoBackupEnabled: value.autoBackupEnabled,
        intervalDays: value.intervalDays,
        retentionLimit: value.retentionLimit,
      };
  },
  { immediate: true },
);
async function run(url: string, body?: any, method = body === undefined ? 'GET' : 'POST') {
  busy.value = true;
  error.value = '';
  try {
    const r = await api(url, body, method);
    if (r.success === false) throw Error(r.error || 'Operațiunea a eșuat.');
    message.value = r.message || 'Operațiune finalizată.';
    emit('refresh');
    return r;
  } catch (e: any) {
    error.value = e.message;
    return null;
  } finally {
    busy.value = false;
  }
}
async function testAI() {
  const r = await run('/api/admin/ai-analytics', { action: 'test_prompt', prompt: prompt.value });
  if (r) answer.value = r.answer || r.response || JSON.stringify(r);
}
async function addComment() {
  if (
    await run(
      '/api/admin/tasks',
      { id: selectedTask.value, action: 'add_comment', comment: comment.value },
      'PATCH',
    )
  )
    comment.value = '';
}
async function deleteRecord(kind: string, id: string) {
  if (confirm('Confirmi ștergerea acestei înregistrări?'))
    await run('/api/admin/database', { action: 'delete_' + kind, id });
}
onMounted(async () => {
  if (props.section === 'inbox' || props.section === 'profile') {
    try {
      prefs.value = (await api('/api/admin/notifications/preferences')).preferences;
    } catch (e: any) {
      error.value = e.message;
    }
  }
});
</script>
<template>
  <div class="admin-operations">
    <p v-if="error" class="admin-error" role="alert">{{ error }}</p>
    <p v-if="message" role="status">{{ message }}</p>
    <form
      v-if="section === 'backups'"
      class="glass-panel"
      @submit.prevent="run('/api/admin/backups', { action: 'update_scheduler', ...schedule })"
    >
      <h2>Backup automat</h2>
      <AdminFields v-model="schedule" /><button type="submit" :disabled="busy">
        Salvează programarea</button
      ><button
        type="button"
        :disabled="busy"
        @click="run('/api/admin/backups', { action: 'run_auto_check' })"
      >
        Execută verificarea acum
      </button>
    </form>
    <form
      v-if="['inbox', 'profile'].includes(section)"
      class="glass-panel"
      @submit.prevent="run('/api/admin/notifications/preferences', { preferences: prefs }, 'PATCH')"
    >
      <h2>Preferințe notificări</h2>
      <AdminFields v-model="prefs" /><button type="submit" :disabled="busy">
        Salvează preferințele
      </button>
    </form>
    <section v-if="section === 'ai-analytics'" class="glass-panel">
      <h2>Diagnostic AI</h2>
      <form @submit.prevent="testAI">
        <label>Întrebare de test<textarea v-model="prompt" required maxlength="2000" /></label
        ><button type="submit" :disabled="busy">Testează răspunsul</button>
      </form>
      <p class="preserve-lines" v-if="answer">{{ answer }}</p>
      <button
        type="button"
        class="danger"
        @click="
          confirm('Ștergi telemetria AI?') && run('/api/admin/ai-analytics', undefined, 'DELETE')
        "
      >
        Șterge telemetria
      </button>
      <details v-if="data.knowledgeBase">
        <summary>Documente indexate pentru AI</summary>
        <ul>
          <li v-for="doc in data.knowledgeBase.docs" :key="doc.path">
            {{ doc.title }} · {{ doc.estTokens }} tokens
          </li>
        </ul>
      </details>
    </section>
    <section v-if="section === 'tasks'" class="glass-panel">
      <h2>Subtask-uri și conversație</h2>
      <label
        >Sarcină<select v-model="selectedTask">
          <option value="">Alege o sarcină</option>
          <option v-for="task in data.tasks || []" :key="task.id" :value="task.id">
            {{ task.title }}
          </option>
        </select></label
      ><template
        v-for="task in (data.tasks || []).filter((t) => t.id === selectedTask)"
        :key="task.id"
        ><label class="check-row" v-for="subtask in task.subtasks || []" :key="subtask.id"
          ><input
            type="checkbox"
            :checked="subtask.completed"
            @change="
              run(
                '/api/admin/tasks',
                { id: task.id, action: 'toggle_subtask', subtaskId: subtask.id },
                'PATCH',
              )
            "
          />{{ subtask.title }}</label
        >
        <article v-for="entry in task.comments || []" :key="entry.id">
          <strong>{{ entry.author }}</strong
          ><time>{{ new Date(entry.createdAt).toLocaleString('ro-RO') }}</time>
          <p>{{ entry.text }}</p>
        </article>
        <form @submit.prevent="addComment">
          <label>Comentariu<textarea v-model="comment" required maxlength="5000" /></label
          ><button type="submit" :disabled="busy">Adaugă comentariu</button>
        </form>
        <button
          type="button"
          @click="
            run('/api/admin/tasks', { id: task.id, updates: { archived: !task.archived } }, 'PATCH')
          "
        >
          {{ task.archived ? 'Reactivează' : 'Arhivează' }}
        </button></template
      >
    </section>
    <section v-if="section === 'database'" class="glass-panel">
      <h2>Administrarea datelor</h2>
      <button
        type="button"
        :disabled="busy"
        @click="run('/api/admin/database', { action: 'sync_all_to_supabase' })"
      >
        Sincronizează datele locale cu Supabase
      </button>
      <h3>Feedback</h3>
      <article v-for="row in data.feedbacks || []" :key="row.id">
        <span>{{ row.slug }} — {{ row.comment || row.rating }}</span
        ><button type="button" @click="deleteRecord('feedback', row.id)">Șterge</button>
      </article>
      <h3>Rapoarte</h3>
      <article v-for="row in data.reports || []" :key="row.id">
        <span>{{ row.slug }} — {{ row.description || row.type }}</span
        ><select
          :value="row.status"
          @change="
            run('/api/admin/database', {
              action: 'update_report_status',
              id: row.id,
              status: ($event.target as HTMLSelectElement).value,
            })
          "
          aria-label="Status raport"
        >
          <option>open</option>
          <option>in_progress</option>
          <option>resolved</option>
          <option>dismissed</option></select
        ><button type="button" @click="deleteRecord('report', row.id)">Șterge</button>
      </article>
    </section>
  </div>
</template>
<style scoped>
.admin-operations {
  display: grid;
  gap: 20px;
  margin: 20px 0;
}
.admin-operations h2 {
  font-size: 18px;
  font-weight: 650;
  margin-bottom: 16px;
}
.admin-operations article {
  padding: 12px 0;
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}
.admin-operations article p {
  flex-basis: 100%;
}
.admin-operations time {
  font-size: 12px;
  color: var(--color-text-secondary);
}
.preserve-lines {
  white-space: pre-wrap;
}
input, select, textarea {
  background: hsl(220 18% 10%);
  border: 1px solid var(--color-border, hsl(220 14% 24%));
  color: #f1f5f9;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.82rem;
  outline: none;
}
input:focus, select:focus, textarea:focus {
  border-color: hsl(26 100% 52% / 0.6);
}
button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 6px 14px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  background: hsl(220 14% 14%);
  border: 1px solid hsl(220 14% 24%);
  color: var(--color-text, #f1f5f9);
}
button:hover {
  background: hsl(220 14% 20%);
}
</style>
