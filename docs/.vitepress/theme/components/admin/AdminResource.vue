<script setup lang="ts">
import { ref, computed, onMounted, defineAsyncComponent } from 'vue';
import { Icon } from '@iconify/vue';
import { api } from '../../composables/useApi';
import Modal from '../ui/Modal.vue';
import AdminFields from './AdminFields.vue';
const Operations = defineAsyncComponent(() => import('./AdminOperations.vue'));
const Terminal = defineAsyncComponent(() => import('./AdminLiveTerminal.vue'));
const Charts = defineAsyncComponent(() => import('./JarvisChartsSuite.vue'));
const props = defineProps<{ section: string; user: any }>();
const data = ref<any>({}),
  loading = ref(true),
  error = ref(''),
  message = ref(''),
  query = ref(''),
  statusFilter = ref(''),
  modal = ref(''),
  form = ref<any>({}),
  selected = ref<any>(null),
  newToken = ref(''),
  qr = ref(''),
  code = ref(''),
  busy = ref(false);
const endpoint = computed(
  () =>
    '/api/admin/' +
    ({
      '': 'dashboard',
      inbox: 'notifications',
      security: 'sessions',
      webhooks: 'reports/daily-digest',
      'discord-bot': 'discord-bot/overview',
      'discord-bot/modules': 'discord-bot/modules',
    }[props.section] || props.section),
);
const scalarStats = computed(() => {
  const source = data.value.stats || data.value.summary || data.value;
  return Object.fromEntries(
    Object.entries(source).filter(([, v]) => typeof v === 'number'),
  ) as Record<string, number>;
});
const groups = computed(() =>
  Object.entries(data.value)
    .filter(([key, value]) => Array.isArray(value) && !['docSlugs', 'rolePresets'].includes(key))
    .filter(([key]) => props.section !== 'tasks' || key === 'tasks')
    .map(([key, value]) => ({
      key,
      rows: (value as any[]).filter(
        (row) =>
          (!query.value || JSON.stringify(row).toLowerCase().includes(query.value.toLowerCase())) &&
          (!statusFilter.value || row.status === statusFilter.value),
      ),
    })),
);
function clone(value: any) {
  return JSON.parse(JSON.stringify(value));
}
function label(value: string) {
  return value
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replaceAll('_', ' ')
    .replace(/^./, (s) => s.toUpperCase());
}
function columns(rows: any[]) {
  return rows.length && typeof rows[0] === 'object'
    ? Object.keys(rows[0])
        .filter(
          (k) =>
            !/(hash|secret|token|password|permissions|metadata|details|content|body|preferences)/i.test(
              k,
            ) &&
            !Array.isArray(rows[0][k]) &&
            typeof rows[0][k] !== 'object',
        )
        .slice(0, 7)
    : ['value'];
}
async function load() {
  loading.value = true;
  error.value = '';
  try {
    data.value = await api(endpoint.value);
    if (['settings', 'profile', 'gitops', 'database'].includes(props.section)) {
      form.value = clone(
        data.value.profile || data.value.settings || data.value.config || data.value,
      );
      delete form.value.subscribers;
      delete form.value.subscribersCount;
      if (props.section === 'profile') form.value.password = '';
      if (form.value.sync) {
        form.value.sync.githubToken = '';
        delete form.value.sync.webhookSecret;
      }
    }
  } catch (e: any) {
    error.value = e.message;
  } finally {
    loading.value = false;
  }
}
async function action(body: any, method = 'POST', url = endpoint.value) {
  busy.value = true;
  error.value = '';
  try {
    const result = await api(url, body, method);
    if (result.success === false) throw new Error(result.error || 'Operațiunea a eșuat.');
    message.value = result.message || 'Operațiunea a fost finalizată.';
    if (result.rawToken) newToken.value = result.rawToken;
    await load();
    return result;
  } catch (e: any) {
    error.value = e.message;
    throw e;
  } finally {
    busy.value = false;
  }
}
function create() {
  selected.value = null;
  modal.value = 'edit';
  const defaults: Record<string, any> = {
    tasks: {
      title: '',
      description: '',
      priority: 'medium',
      category: 'docs_update',
      assignees: [],
      targetDoc: '',
      dueDate: '',
      subtasks: [],
    },
    team: {
      username: '',
      displayName: '',
      email: '',
      role: 'content_editor',
      password: '',
      customTitle: '',
      avatarUrl: '',
      discord: '',
      steamId: '',
      githubUsername: '',
      bio: '',
      responsibilities: [],
    },
    'api-keys': { name: '', scope: 'read_only' },
    backups: { label: '' },
    inbox: {
      title: '',
      message: '',
      category: 'system',
      severity: 'info',
      targetUser: '',
      isGlobal: false,
      link: '',
    },
    'discord-bot/staff': { user_id: '', name: '' },
  };
  form.value = clone(defaults[props.section] || {});
}
function edit(row: any) {
  selected.value = row;
  form.value = clone(row);
  modal.value = 'edit';
}
async function save() {
  try {
    let body = form.value,
      method = selected.value ? 'PUT' : 'POST';
    if (props.section === 'tasks' && selected.value) {
      body = { id: selected.value.id, updates: form.value };
      method = 'PATCH';
    }
    if (props.section === 'api-keys') body = { ...body, action: 'create' };
    await action(body, method);
    modal.value = '';
  } catch {}
}
async function remove(row: any) {
  if (!confirm('Confirmi ștergerea acestui element?')) return;
  try {
    const s = props.section;
    if (s === 'api-keys') await action({ action: 'revoke', keyId: row.id });
    else if (s === 'security') await action({ sessionId: row.sessionId });
    else if (s === 'discord-bot/watchlist') await action({ steam_id: row.steam_id }, 'DELETE');
    else if (s === 'discord-bot/staff') await action({ user_id: row.user_id }, 'DELETE');
    else if (s === 'discord-bot/role-trackers') await action({ id: row.id }, 'DELETE');
    else await action(undefined, 'DELETE', `${endpoint.value}?id=${encodeURIComponent(row.id)}`);
  } catch {}
}
async function saveSettings() {
  try {
    let body = form.value;
    if (props.section === 'database') body = { action: 'save_config', ...body };
    await action(body, props.section === 'profile' ? 'PUT' : 'POST');
  } catch {}
}
async function upload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;
  const body = new FormData();
  body.set('file', file);
  body.set('folder', 'media');
  try {
    await action(body);
  } catch {}
}
async function deleteMedia(row: any) {
  if (confirm(`Ștergi ${row.filename}?`))
    try {
      await action(
        undefined,
        'DELETE',
        `${endpoint.value}?path=${encodeURIComponent(row.relativePath)}`,
      );
    } catch {}
}
async function totpSetup() {
  try {
    const result = await api('/api/admin/profile/2fa', {});
    qr.value = result.qrCode;
    modal.value = '2fa';
  } catch (e: any) {
    error.value = e.message;
  }
}
async function verifyTotp() {
  try {
    await action({ code: code.value }, 'PUT', '/api/admin/profile/2fa');
    modal.value = '';
  } catch {}
}
async function panic() {
  if (!confirm('Activezi Panic Lockdown? Toate sesiunile vor fi revocate.')) return;
  try {
    await action({ action: 'trigger' }, 'POST', '/api/admin/auth/panic');
    location.href = '/admin/login';
  } catch {}
}
async function readAll() {
  try {
    await action({ action: 'read_all' }, 'PATCH');
  } catch {}
}
async function markRead(row: any) {
  try {
    await action({ action: 'read', id: row.id }, 'PATCH');
  } catch {}
}
async function restoreSnapshot(row: any) {
  if (confirm('Restaurarea va înlocui datele incluse în snapshot. Continui?'))
    try {
      await action({ action: 'restore', id: row.id }, 'PATCH');
    } catch {}
}
async function setTaskStatus(row: any, event: Event) {
  try {
    await action(
      { id: row.id, updates: { status: (event.target as HTMLSelectElement).value } },
      'PATCH',
    );
  } catch {}
}
async function git(command: string) {
  try {
    const result = await action({}, 'POST', `/api/admin/gitops/${command}`);
    if (result) message.value = [result.message, ...(result.logs || [])].filter(Boolean).join('\n');
  } catch {}
}
async function sendReport(kind: string) {
  try {
    await action({}, 'POST', `/api/admin/reports/${kind}`);
  } catch {}
}
async function changeTicket(row: any, event: Event) {
  try {
    await action(
      { ticket_id: row.ticket_id || row.id, status: (event.target as HTMLSelectElement).value },
      'PATCH',
    );
  } catch {}
}
onMounted(load);
</script>
<template>
  <div class="admin-resource">
    <div class="admin-view-toolbar">
      <div>
        <span class="admin-status-pill">{{ user.isRoot ? 'Root access' : 'Acces autorizat' }}</span>
        <p class="admin-subtitle">Date actualizate din serviciile platformei.</p>
      </div>
      <div class="admin-toolbar-actions">
        <button type="button" @click="load" :disabled="loading">
          <Icon icon="lucide:refresh-cw" />Actualizează
        </button>
        <button
          v-if="['tasks', 'team', 'api-keys', 'backups', 'inbox', 'discord-bot/staff'].includes(section)"
          type="button"
          class="primary"
          @click="create"
        >
          <Icon icon="lucide:plus" />Adaugă
        </button>
      </div>
    </div>
    <p v-if="loading" role="status">Se încarcă…</p>
    <p v-if="error" role="alert" class="admin-error">{{ error }}</p>
    <p v-if="message" role="status" class="admin-notice">{{ message }}</p>
    <section v-if="newToken" class="glass-panel">
      <h2>Cheia API nouă</h2>
      <p>Copiază această cheie acum; nu va fi afișată din nou.</p>
      <code>{{ newToken }}</code
      ><button type="button" @click="newToken = ''">Am salvat cheia</button>
    </section>
    <div v-if="Object.keys(scalarStats).length" class="admin-metrics-grid">
      <article v-for="(value, key) in scalarStats" :key="key" class="admin-metric-card glass-panel">
        <span>{{ label(String(key)) }}</span
        ><strong>{{ value }}</strong>
      </article>
    </div>
    <Charts
      v-if="Object.keys(scalarStats).length > 1"
      :values="scalarStats"
      title="Indicatori platformă"
    />
    <div v-if="section === 'audit' && data.integrity" class="glass-panel">
      <Icon icon="lucide:shield-check" /><strong>Integritate audit</strong
      ><span class="admin-status-pill">{{
        data.integrity.valid || data.integrity.isValid ? 'Lanț verificat' : 'Verifică rezultatul'
      }}</span>
      <p>{{ data.integrity.message }}</p>
    </div>
    <form
      v-if="['settings', 'profile', 'gitops', 'database'].includes(section) && !loading"
      class="glass-panel"
      @submit.prevent="saveSettings"
    >
      <AdminFields v-model="form" /><button type="submit" class="primary" :disabled="busy">
        Salvează setările</button
      ><button v-if="section === 'profile'" type="button" @click="totpSetup">
        Configurează 2FA
      </button>
    </form>
    <div v-if="section === 'gitops'" class="glass-panel action-bar">
      <button type="button" @click="git('test')">Testează conexiunea</button
      ><button type="button" @click="git('sync')">Sincronizează</button
      ><button type="button" @click="git('export-initial')">Export inițial</button>
    </div>
    <div v-if="section === 'security'" class="glass-panel action-bar">
      <button type="button" @click="totpSetup">Configurează 2FA</button
      ><button v-if="user.isRoot" type="button" class="danger" @click="panic">
        Panic Lockdown
      </button>
    </div>
    <div v-if="section === 'media'" class="glass-panel">
      <label
        >Încarcă imagine, video sau audio (max. 64 MB)<input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml,video/mp4,video/webm,audio/mpeg,audio/ogg,audio/wav"
          @change="upload"
      /></label>
    </div>
    <div v-if="section === 'webhooks'" class="glass-panel action-bar">
      <button
        v-for="kind in ['daily-digest', 'ai-telemetry', 'security-snapshot', 'system-health']"
        :key="kind"
        type="button"
        @click="sendReport(kind)"
      >
        Trimite {{ label(kind) }}</button
      ><button
        type="button"
        @click="
          modal = 'webhook';
          form = {
            mode: 'create',
            messageId: '',
            channelPreset: '#procedura',
            customWebhookUrl: '',
            content: '',
            embed: { title: '', description: '', color: 16744448 },
          };
        "
      >
        Mesaj personalizat
      </button>
    </div>
    <button
      v-if="section === 'ai-analytics'"
      type="button"
      @click="action({ action: 'rebuild_context' })"
    >
      Reconstruiește contextul AI</button
    ><button v-if="section === 'inbox'" type="button" @click="readAll">
      Marchează toate ca citite</button
    ><Operations :section="section" :data="data" :user="user" @refresh="load" /><Terminal
      v-if="section === ''"
    />
    <div class="admin-table-controls">
      <label>Caută<input v-model="query" placeholder="Filtrează rezultatele…" /></label
      ><label v-if="section === 'tasks'"
        >Status<select v-model="statusFilter">
          <option value="">Toate</option>
          <option
            v-for="s in ['todo', 'in_progress', 'in_review', 'completed']"
            :key="s"
            :value="s"
          >
            {{ label(s) }}
          </option>
        </select></label
      >
    </div>
    <section v-for="group in groups" :key="group.key" class="glass-panel admin-table-panel">
      <h2>
        {{ label(group.key) }} <span class="admin-status-pill">{{ group.rows.length }}</span>
      </h2>
      <p v-if="!group.rows.length">Nu există înregistrări pentru filtrul ales.</p>
      <div v-else class="table-scroll">
        <table>
          <thead>
            <tr>
              <th v-for="column in columns(group.rows)" :key="column">{{ label(column) }}</th>
              <th>Acțiuni</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in group.rows" :key="row.id || index">
              <td v-for="column in columns(group.rows)" :key="column">
                <span
                  :class="/status|role|severity|category/.test(column) ? 'admin-status-pill' : ''"
                  >{{ typeof row === 'object' ? String(row[column] ?? '—') : row }}</span
                >
              </td>
              <td class="row-actions">
                <button
                  type="button"
                  @click="
                    selected = row;
                    modal = 'details';
                  "
                >
                  Detalii</button
                ><button
                  v-if="['team', 'tasks'].includes(section)"
                  type="button"
                  @click="edit(row)"
                >
                  Editează</button
                ><select
                  v-if="section === 'tasks'"
                  :value="row.status"
                  @change="setTaskStatus(row, $event)"
                  aria-label="Status sarcină"
                >
                  <option
                    v-for="s in ['todo', 'in_progress', 'in_review', 'completed']"
                    :key="s"
                    :value="s"
                  >
                    {{ label(s) }}
                  </option></select
                ><template v-if="section === 'backups'"
                  ><a :href="`/api/admin/backups/download?id=${encodeURIComponent(row.id)}`"
                    >Descarcă</a
                  ><button type="button" @click="restoreSnapshot(row)">
                    Restaurează
                  </button></template
                ><template v-if="section === 'media'"
                  ><a :href="row.url" target="_blank" rel="noopener">Deschide</a
                  ><button type="button" @click="deleteMedia(row)">Șterge</button></template
                ><button v-if="section === 'inbox'" type="button" @click="markRead(row)">
                  Marchează citită</button
                ><select
                  v-if="section === 'discord-bot/tickets'"
                  :value="row.status"
                  @change="changeTicket(row, $event)"
                  aria-label="Status ticket"
                >
                  <option>active</option>
                  <option>pending_evidence</option>
                  <option>archived</option>
                  <option>deleted</option></select
                ><button
                  v-if="
                    [
                      'team',
                      'tasks',
                      'api-keys',
                      'security',
                      'backups',
                      'discord-bot/staff',
                      'discord-bot/watchlist',
                      'discord-bot/role-trackers',
                    ].includes(section)
                  "
                  type="button"
                  class="danger"
                  @click="remove(row)"
                >
                  {{ ['api-keys', 'security'].includes(section) ? 'Revocă' : 'Șterge' }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <Modal
      :open="!!modal"
      :title="
        modal === '2fa' ? 'Autentificare 2FA' : modal === 'details' ? 'Detalii' : 'Configurare'
      "
      @close="modal = ''"
      ><form v-if="modal === 'edit'" @submit.prevent="save">
        <AdminFields v-model="form" /><button type="submit" class="primary" :disabled="busy">
          Salvează
        </button>
      </form>
      <form
        v-else-if="modal === 'webhook'"
        @submit.prevent="
          action(form, 'POST', '/api/admin/webhooks/custom-embed').then(() => (modal = ''))
        "
      >
        <AdminFields v-model="form" /><button type="submit" class="primary">Trimite mesajul</button>
      </form>
      <form v-else-if="modal === '2fa'" @submit.prevent="verifyTotp">
        <img :src="qr" alt="Cod QR de configurare 2FA" /><label
          >Cod de verificare<input
            v-model="code"
            inputmode="numeric"
            pattern="[0-9]{6}"
            required /></label
        ><button type="submit">Activează 2FA</button>
      </form>
      <AdminFields
        v-else-if="modal === 'details' && selected && typeof selected === 'object'"
        :model-value="selected"
        disabled
    /></Modal>
  </div>
</template>

<style scoped>
.admin-resource {
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
}

.admin-view-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  padding: 18px 24px;
  border-radius: var(--radius-lg, 12px);
  background: hsl(220 20% 7% / 0.7);
  border: 1px solid var(--color-border, hsl(220 14% 20%));
}

.admin-view-toolbar .admin-subtitle {
  color: var(--color-text-secondary, #94a3b8);
  font-size: 0.85rem;
  margin: 4px 0 0;
}

.admin-toolbar-actions,
.action-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: var(--radius-md, 8px);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  background: hsl(220 14% 14%);
  border: 1px solid hsl(220 14% 24%);
  color: var(--color-text, #f1f5f9);
  transition: all var(--transition-fast, 0.15s ease);
}

button:hover {
  background: hsl(220 14% 20%);
  border-color: hsl(220 14% 34%);
}

button.primary {
  background: linear-gradient(135deg, hsl(26 100% 52%), hsl(38 100% 50%)) !important;
  color: #fff !important;
  border: 1px solid hsl(26 100% 60%) !important;
  box-shadow: 0 2px 10px hsl(26 100% 52% / 0.25);
}

button.primary:hover {
  box-shadow: 0 4px 16px hsl(26 100% 52% / 0.4);
}

button.danger {
  background: hsl(0 84% 60% / 0.15) !important;
  border-color: hsl(0 84% 60% / 0.4) !important;
  color: #f87171 !important;
}

button.danger:hover {
  background: hsl(0 84% 60% / 0.25) !important;
}

.admin-metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.admin-metric-card {
  background: hsl(220 20% 7% / 0.7);
  border: 1px solid var(--color-border, hsl(220 14% 20%));
  border-radius: var(--radius-md, 10px);
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.admin-metric-card span {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-secondary, #94a3b8);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.admin-metric-card strong {
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--color-text, #f1f5f9);
}

.glass-panel {
  background: hsl(220 20% 7% / 0.7);
  border: 1px solid var(--color-border, hsl(220 14% 20%));
  border-radius: var(--radius-lg, 12px);
  padding: 20px 24px;
}

.admin-table-controls {
  display: flex;
  align-items: center;
  gap: 14px;
  flex-wrap: wrap;
  padding: 12px 18px;
  background: hsl(220 20% 7% / 0.5);
  border: 1px solid var(--color-border, hsl(220 14% 20%));
  border-radius: var(--radius-md, 8px);
}

.admin-table-controls label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text-secondary, #94a3b8);
}

.admin-table-controls input,
.admin-table-controls select,
select {
  background: hsl(220 18% 10%);
  border: 1px solid var(--color-border, hsl(220 14% 24%));
  color: #f1f5f9;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 0.82rem;
  outline: none;
}

.admin-table-controls input:focus,
.admin-table-controls select:focus,
select:focus {
  border-color: hsl(26 100% 52% / 0.6);
}

.admin-table-panel {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.admin-table-panel h2 {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.15rem;
  font-weight: 800;
  color: #fff;
  margin: 0;
}

.table-scroll {
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--color-border, hsl(220 14% 20%));
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.84rem;
}

th {
  background: hsl(220 18% 9%);
  padding: 12px 16px;
  font-weight: 700;
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: #94a3b8;
  border-bottom: 1px solid var(--color-border, hsl(220 14% 20%));
}

td {
  padding: 12px 16px;
  border-bottom: 1px solid hsl(220 14% 13%);
  color: #e2e8f0;
  vertical-align: middle;
}

tr:hover td {
  background: hsl(220 14% 10% / 0.6);
}

.row-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.row-actions button,
.row-actions a {
  padding: 4px 10px;
  font-size: 0.74rem;
  border-radius: 6px;
  text-decoration: none;
  background: hsl(220 14% 14%);
  border: 1px solid hsl(220 14% 24%);
  color: #f1f5f9;
}

.row-actions button:hover,
.row-actions a:hover {
  background: hsl(220 14% 20%);
}

.row-actions a {
  display: inline-flex;
  align-items: center;
}
</style>
