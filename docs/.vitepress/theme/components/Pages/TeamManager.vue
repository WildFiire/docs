<template>
  <div class="team-manager-overlay" v-if="modelValue">
    <div class="tm-modal">
      <div class="tm-header">
        <div class="tm-title">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 20.94c1.5 0 2.75 1.06 4 1.06 3 0 6-8 6-12.22A4.91 4.91 0 0 0 17 5c-2.22 0-4 1.44-5 2-1-.56-2.78-2-5-2a4.9 4.9 0 0 0-5 4.78C2 14 5 22 8 22c1.25 0 2.5-1.06 4-1.06Z" />
            <path d="M10 2c1 .5 2 2 2 5" />
          </svg>
          <h2>Staff Database Manager <span class="dev-badge">LOCAL DEV</span></h2>
        </div>
        <div class="tm-actions">
          <div class="tm-history-controls">
            <button class="tm-action-btn" @click="undo" :disabled="historyIndex <= 0" title="Undo (Ctrl+Z)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/></svg>
            </button>
            <button class="tm-action-btn" @click="redo" :disabled="historyIndex >= history.length - 1" title="Redo (Ctrl+Y)">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 7v6h-6"/><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3l3 2.7"/></svg>
            </button>
          </div>
          <button class="tm-btn tm-btn-primary" @click="saveToServer" :disabled="isSaving">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline>
            </svg>
            {{ isSaving ? 'Saving...' : 'Instant Save' }}
          </button>
          <button class="tm-btn-close" @click="$emit('close')">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="tm-body">
        <div class="tm-sidebar">
          <div class="tm-section-title">
            <h3>Hierarchy Levels</h3>
            <button class="tm-action-btn" @click="addLevel" title="Add Level">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </button>
          </div>
          
          <div 
            v-for="(level, index) in localData" 
            :key="'level-' + index"
            class="tm-level-item"
            :class="{ active: selectedLevelIndex === index }"
            @click="selectedLevelIndex = index"
          >
            <div class="level-info">
              <span class="level-badge" :style="{ color: level.color || '#fff' }">
                {{ (level.emoji || '') + ' ' + (level.roleName || 'Empty Role') }}
              </span>
              <span class="level-count">{{ level.members ? level.members.length : 0 }} members</span>
            </div>
            <div class="level-actions">
              <button class="tm-action-btn small" @click.stop="moveLevel(index, -1)" :disabled="index === 0" title="Move Up">↑</button>
              <button class="tm-action-btn small" @click.stop="moveLevel(index, 1)" :disabled="index === localData.length - 1" title="Move Down">↓</button>
              <button class="tm-action-btn danger small" @click.stop="removeLevel(index)" title="Remove Level">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
              </button>
            </div>
          </div>
        </div>

        <div class="tm-content" v-if="selectedLevel !== null">
          <div class="tm-section-title">
            <h3>Editing Role: {{ selectedLevel.roleName }}</h3>
            <button class="tm-action-btn" style="width:auto; padding:0 12px; font-weight:600; background:rgba(255,120,0,0.2); color:#ff7800; border-color:rgba(255,120,0,0.5)" @click="addMember">
              + Add Member to Role
            </button>
          </div>

          <div v-if="selectedLevel" class="tm-role-settings">
            <h4>Global Role Settings</h4>
            <div class="tm-form-grid">
              <div class="tm-form-group">
                <label>Role Name</label>
                <input type="text" :value="selectedLevel.roleName" @input="syncRoleProperty('roleName', 'fullRole', $event.target.value)" placeholder="e.g. Administrator CS2" />
              </div>
              <div class="tm-form-group">
                <label>Role CSS Class</label>
                <input type="text" :value="selectedLevel.roleClass" @input="syncRoleProperty('roleClass', 'roleClass', $event.target.value)" placeholder="e.g. admin" />
              </div>
              <div class="tm-form-group">
                <label>Role Color</label>
                <div class="tm-color-input">
                  <input type="color" :value="selectedLevel.color" @input="syncRoleProperty('color', 'color', $event.target.value)" />
                  <input type="text" :value="selectedLevel.color" @input="syncRoleProperty('color', 'color', $event.target.value)" />
                </div>
              </div>
              <div class="tm-form-group">
                <label>Role Emoji</label>
                <input type="text" :value="selectedLevel.emoji" @input="syncRoleProperty('emoji', 'emoji', $event.target.value)" placeholder="👑" />
              </div>
              <div class="tm-form-group" style="grid-column: 1 / -1;">
                <label>Role Biography (Default for all members in this role)</label>
                <textarea :value="selectedLevel.roleBio" @input="syncRoleProperty('roleBio', 'roleBio', $event.target.value)" placeholder="Description for everyone in this role..."></textarea>
              </div>
            </div>
          </div>

          <div v-if="selectedLevel && (!selectedLevel.members || selectedLevel.members.length === 0)" class="tm-empty-state">
            <p>No members in this role. Add someone to define the role!</p>
          </div>

          <div class="tm-members-grid">
            <div v-for="(member, mIndex) in selectedLevel.members" :key="mIndex" class="tm-member-card">
              <div class="tm-member-header">
                <div class="tm-member-preview" :style="{ borderColor: member.color }">
                  <div class="preview-init" :style="{ background: member.color }">{{ member.init || '?' }}</div>
                  <span class="preview-name">{{ member.display || 'New Member' }}</span>
                </div>
                <div class="member-actions">
                  <button class="tm-action-btn small" @click="moveMember(mIndex, -1)" :disabled="mIndex === 0" title="Move Left">←</button>
                  <button class="tm-action-btn small" @click="moveMember(mIndex, 1)" :disabled="mIndex === selectedLevel.members.length - 1" title="Move Right">→</button>
                  <button class="tm-action-btn small" style="margin-left: 8px" @click="transferMember(mIndex, -1)" :disabled="selectedLevelIndex === 0" title="Move to Higher Role">⇧</button>
                  <button class="tm-action-btn small" @click="transferMember(mIndex, 1)" :disabled="selectedLevelIndex === localData.length - 1" title="Move to Lower Role">⇩</button>
                  <button class="tm-action-btn danger small" style="margin-left: 8px" @click="removeMember(mIndex)" title="Delete Member">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
                  </button>
                </div>
              </div>
              
              <div class="tm-form-grid">
                <div class="tm-form-group">
                  <label>Discord ID</label>
                  <input type="text" v-model="member.discordId" placeholder="e.g. 250205071478882306" />
                </div>
                <div class="tm-form-group">
                  <label>Display Name</label>
                  <input type="text" v-model="member.display" placeholder="e.g. Trapi" />
                </div>
                <div class="tm-form-group">
                  <label>Discord Username</label>
                  <input type="text" v-model="member.name" placeholder="e.g. trapi (without @)" />
                </div>
                <div class="tm-form-group">
                  <label>Custom CSS Class (cls)</label>
                  <input type="text" v-model="member.cls" placeholder="e.g. glow-admin" />
                </div>
                <div class="tm-form-group short">
                  <label>Initial</label>
                  <input type="text" v-model="member.init" placeholder="T" maxlength="2" />
                </div>
                <div class="tm-form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" v-model="member.crown" />
                    Show Crown Badge?
                  </label>
                </div>
                <div class="tm-form-group" style="grid-column: 1 / -1;">
                  <label>Individual Biography</label>
                  <textarea v-model="member.bio" placeholder="Leave empty to use the Role Biography..."></textarea>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['close', 'copied'])

const localData = ref(JSON.parse(JSON.stringify(props.modelValue)))
const selectedLevelIndex = ref(0)
const isSaving = ref(false)

const selectedLevel = computed(() => {
  return localData.value[selectedLevelIndex.value] || null
})

function moveLevel(index, direction) {
  if (index + direction >= 0 && index + direction < localData.value.length) {
    const item = localData.value.splice(index, 1)[0]
    localData.value.splice(index + direction, 0, item)
    if (selectedLevelIndex.value === index) {
      selectedLevelIndex.value = index + direction
    } else if (selectedLevelIndex.value === index + direction) {
      selectedLevelIndex.value = index
    }
  }
}

function moveMember(index, direction) {
  if (selectedLevel.value && index + direction >= 0 && index + direction < selectedLevel.value.members.length) {
    const member = selectedLevel.value.members.splice(index, 1)[0]
    selectedLevel.value.members.splice(index + direction, 0, member)
    saveHistory()
  }
}

function transferMember(mIndex, levelDirection) {
  const currentLevelIndex = selectedLevelIndex.value
  const targetLevelIndex = currentLevelIndex + levelDirection
  
  if (targetLevelIndex >= 0 && targetLevelIndex < localData.value.length) {
    const member = localData.value[currentLevelIndex].members.splice(mIndex, 1)[0]
    const targetLevel = localData.value[targetLevelIndex]
    
    // Match the new role properties
    member.fullRole = targetLevel.roleName
    member.color = targetLevel.color
    member.emoji = targetLevel.emoji
    member.roleClass = targetLevel.roleClass
    
    targetLevel.members.push(member)
    saveHistory()
  }
}

// History State
const history = ref([JSON.parse(JSON.stringify(props.modelValue))])
const historyIndex = ref(0)
let isUndoRedo = false

function saveHistory() {
  if (isUndoRedo) return
  if (historyIndex.value < history.value.length - 1) {
    history.value.splice(historyIndex.value + 1)
  }
  history.value.push(JSON.parse(JSON.stringify(localData.value)))
  if (history.value.length > 50) {
    history.value.shift()
  } else {
    historyIndex.value++
  }
}

function undo() {
  if (historyIndex.value > 0) {
    isUndoRedo = true
    historyIndex.value--
    localData.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    setTimeout(() => { isUndoRedo = false }, 50)
  }
}

function redo() {
  if (historyIndex.value < history.value.length - 1) {
    isUndoRedo = true
    historyIndex.value++
    localData.value = JSON.parse(JSON.stringify(history.value[historyIndex.value]))
    setTimeout(() => { isUndoRedo = false }, 50)
  }
}

function handleKeyDown(e) {
  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'z' || e.key === 'Z') {
      if (e.shiftKey) {
        e.preventDefault(); redo()
      } else {
        e.preventDefault(); undo()
      }
    } else if (e.key === 'y' || e.key === 'Y') {
      e.preventDefault(); redo()
    }
  }
}

onMounted(() => {
  document.documentElement.style.overflow = 'hidden'
  document.body.style.overflow = 'hidden'
  window.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.documentElement.style.overflow = ''
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeyDown)
})

function addLevel() {
  localData.value.push({
    roleName: 'New Role',
    color: '#ffffff',
    emoji: '🔰',
    roleClass: 'helper',
    members: []
  })
  selectedLevelIndex.value = localData.value.length - 1
  saveHistory()
}

function removeLevel(index) {
  if (confirm(`Are you sure you want to delete this Role and ALL its members?`)) {
    localData.value.splice(index, 1)
    if (selectedLevelIndex.value >= localData.value.length) {
      selectedLevelIndex.value = Math.max(0, localData.value.length - 1)
    }
    saveHistory()
  }
}

function addMember() {
  if (selectedLevel.value) {
    selectedLevel.value.members.push({
      id: 'new_' + Date.now(),
      name: 'username',
      display: 'New Staff',
      fullRole: selectedLevel.value.roleName,
      emoji: selectedLevel.value.emoji,
      discordId: '',
      color: selectedLevel.value.color,
      roleClass: selectedLevel.value.roleClass,
      cls: '',
      init: 'N',
      crown: false
    })
    saveHistory()
  }
}

function removeMember(mIndex) {
  if (confirm('Delete this member?')) {
    selectedLevel.value.members.splice(mIndex, 1)
    saveHistory()
  }
}

function syncRoleProperty(levelProp, memberProp, value) {
  if (selectedLevel.value) {
    selectedLevel.value[levelProp] = value
    if (selectedLevel.value.members) {
      selectedLevel.value.members.forEach(member => {
        member[memberProp] = value
      })
    }
  }
}

async function saveToServer() {
  const codeStr = `[\n${localData.value.map((level, i) => {
    return `  {
    roleName: '${level.roleName}',
    color: '${level.color}',
    emoji: '${level.emoji}',
    roleClass: '${level.roleClass}',
    ${level.roleBio ? `roleBio: \`${level.roleBio.replace(/`/g, '\\`')}\`,` : ''}
    members: [\n${(level.members || []).map(m => {
      const parts = [
        `        id: '${m.id || m.name}'`,
        `name: '${m.name}'`,
        `display: '${m.display}'`,
        `fullRole: '${m.fullRole}'`,
        m.emoji ? `emoji: '${m.emoji}'` : '',
        `discordId: '${m.discordId}'`,
        `color: '${m.color}'`,
        `roleClass: '${m.roleClass}'`,
        `cls: '${m.cls || ''}'`,
        `init: '${m.init}'`,
        `crown: ${!!m.crown}`,
        m.bio ? `bio: \`${m.bio.replace(/`/g, '\\`')}\`` : ''
      ].filter(Boolean)
      return `      { \n${parts.join(', \n        ')}\n      }`
    }).join(',\n')}\n    ]
  }`
  }).join(',\n')}\n]`

  isSaving.value = true
  try {
    const res = await fetch('/__api/save-team', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: codeStr })
    })
    const json = await res.json()
    if (json.success) {
      alert('Success! Team.vue was updated instantly.')
      emit('copied')
    } else {
      alert('Error saving: ' + json.error)
    }
  } catch (e) {
    console.error(e)
    alert('Failed to save via API. Check terminal.')
  }
  isSaving.value = false
}

// Ensure IDs stay somewhat synced if username changes
let debounceTimer = null
watch(localData, (newVal) => {
  if (!isUndoRedo) {
    clearTimeout(debounceTimer)
    debounceTimer = setTimeout(() => {
      saveHistory()
    }, 400)
  }

  newVal.forEach(level => {
    if (level.members) {
      level.members.forEach(member => {
        if (!member.id || member.id.startsWith('new_')) {
          member.id = member.name
        }
      })
    }
  })
}, { deep: true })
</script>

<style scoped>
.team-manager-overlay {
  position: fixed;
  inset: 0;
  z-index: 100000;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(12px);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  color: #fff;
}

.tm-modal {
  width: 90vw;
  max-width: 1200px;
  height: 90vh;
  background: linear-gradient(145deg, rgba(20, 20, 20, 0.9), rgba(10, 10, 10, 0.95));
  border: 1px solid rgba(255, 120, 0, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), inset 0 0 0 1px rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.tm-header {
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
}

.tm-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.tm-title h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 12px;
}

.dev-badge {
  background: #ff5500;
  color: white;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 8px;
  border-radius: 6px;
  letter-spacing: 1px;
}

.tm-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.tm-history-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 12px;
  padding-right: 16px;
  border-right: 1px solid rgba(255,255,255,0.1);
}

.tm-icon-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  pointer-events: none;
}

.tm-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.9rem;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.2s;
}

.tm-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.tm-btn-primary {
  background: var(--vp-c-brand-1, #ff7800);
  border-color: transparent;
  color: #000;
  font-weight: 600;
}
.tm-btn-primary:hover {
  background: #ff8c00;
  transform: translateY(-1px);
}

.tm-btn-close {
  background: transparent;
  border: none;
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
}
.tm-btn-close:hover {
  color: #ff5555;
  background: rgba(255,85,85,0.1);
}

.tm-body {
  flex: 1;
  display: flex;
  overflow: hidden;
  min-height: 0;
}

.tm-sidebar {
  width: 250px;
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
  overflow-y: auto;
  padding: 16px;
  min-height: 0;
}

.tm-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  background: rgba(255, 255, 255, 0.02);
  min-height: 0;
}

.tm-section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.tm-section-title h3 {
  margin: 0;
  font-size: 0.95rem;
  color: rgba(255,255,255,0.6);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tm-action-btn {
  background: transparent;
  border: 1px solid rgba(255,255,255,0.2);
  color: white;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  line-height: 1;
  transition: 0.2s;
  pointer-events: auto !important;
}
.tm-action-btn.small {
  width: 24px;
  height: 24px;
  font-size: 14px;
}
.tm-action-btn:hover {
  background: rgba(255,255,255,0.1);
}
.tm-action-btn.danger:hover {
  background: rgba(255,50,50,0.2);
  color: #ff5555;
  border-color: rgba(255,50,50,0.3);
}

.level-actions {
  display: flex;
  gap: 4px;
}

.member-actions {
  display: flex;
  gap: 4px;
}

.tm-level-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
  background: rgba(255,255,255,0.03);
  border: 1px solid transparent;
  cursor: pointer;
  transition: 0.2s;
}

.tm-level-item:hover {
  background: rgba(255,255,255,0.06);
}

.tm-level-item.active {
  background: rgba(255, 120, 0, 0.1);
  border-color: rgba(255, 120, 0, 0.3);
}

.level-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.level-badge {
  font-weight: 700;
  font-size: 13px;
}
.level-count {
  font-size: 11px;
  color: rgba(255,255,255,0.5);
}

.tm-members-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.tm-role-settings {
  background: rgba(255, 120, 0, 0.05);
  border: 1px solid rgba(255, 120, 0, 0.2);
  border-radius: 12px;
  padding: 16px 20px;
  margin-bottom: 30px;
}
.tm-role-settings h4 {
  margin: 0 0 16px 0;
  font-size: 13px;
  color: #ff7800;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.tm-member-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 16px;
}

.tm-member-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.05);
}

.tm-member-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  border-left: 3px solid;
  padding-left: 10px;
}

.preview-init {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 14px;
}

.preview-name {
  font-weight: 600;
  font-size: 15px;
}

.tm-form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.tm-form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.tm-form-group.short {
  grid-column: span 1;
}

.tm-form-group label {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: rgba(255,255,255,0.5);
}

.tm-form-group input[type="text"] {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  color: white;
  font-size: 13px;
  width: 100%;
}

.tm-form-group input[type="text"]:focus,
.tm-form-group textarea:focus {
  outline: none;
  border-color: var(--vp-c-brand-1, #ff7800);
}

.tm-form-group textarea {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 8px 12px;
  color: white;
  font-size: 13px;
  width: 100%;
  min-height: 70px;
  resize: vertical;
  font-family: inherit;
  line-height: 1.4;
}

.tm-color-input {
  display: flex;
  gap: 8px;
}
.tm-color-input input[type="color"] {
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  margin-top: 10px;
  text-transform: none !important;
  color: #fff !important;
  font-size: 13px !important;
}
</style>
