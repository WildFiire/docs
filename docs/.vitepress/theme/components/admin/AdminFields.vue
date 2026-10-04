<script setup lang="ts">
defineOptions({ name: 'AdminFields' });
const props = defineProps<{ modelValue: Record<string, any>; disabled?: boolean }>();
const emit = defineEmits<{ 'update:modelValue': [Record<string, any>] }>();
const hidden =
  /passwordHash|salt|totpSecret|backupCodes|sessionId|createdAt|updatedAt|updatedBy|^id$|^isRoot$|^hasKey$/i;
const choices: Record<string, string[]> = {
  role: [
    'root_admin',
    'doc_lead',
    'content_editor',
    'moderator',
    'viewer',
    'security_auditor',
    'custom',
  ],
  priority: ['low', 'medium', 'high', 'urgent'],
  provider: ['local', 'supabase'],
  scope: ['read_only', 'read_write'],
  severity: ['info', 'success', 'warning', 'urgent'],
};
function title(key: string) {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replaceAll('_', ' ')
    .replace(/^./, (c) => c.toUpperCase());
}
function update(key: string, value: any) {
  emit('update:modelValue', { ...props.modelValue, [key]: value });
}
function objectArray(value: any, key: string) {
  return (
    Array.isArray(value) &&
    (value.some((v) => v && typeof v === 'object') || ['subtasks', 'comments'].includes(key))
  );
}
function changeItem(key: string, index: number, value: any) {
  const list = [...props.modelValue[key]];
  list[index] = value;
  update(key, list);
}
function addItem(key: string) {
  update(key, [...props.modelValue[key], { id: crypto.randomUUID(), title: '', completed: false }]);
}
</script>
<template>
  <div class="admin-fields">
    <template v-for="(value, key) in modelValue" :key="key">
      <fieldset v-if="objectArray(value, String(key)) && !hidden.test(String(key))">
        <legend>{{ title(String(key)) }}</legend>
        <div v-for="(item, index) in value" :key="item.id || index" class="array-item">
          <AdminFields
            :model-value="item"
            :disabled="disabled || key === 'comments'"
            @update:model-value="changeItem(String(key), Number(index), $event)"
          /><button
            v-if="!disabled && key !== 'comments'"
            type="button"
            @click="
              update(
                String(key),
                value.filter((_, i) => i !== index),
              )
            "
          >
            Elimină elementul
          </button>
        </div>
        <button v-if="!disabled && key === 'subtasks'" type="button" @click="addItem(String(key))">
          Adaugă subtask
        </button>
      </fieldset>
      <fieldset
        v-else-if="
          value && typeof value === 'object' && !Array.isArray(value) && !hidden.test(String(key))
        "
      >
        <legend>{{ title(String(key)) }}</legend>
        <AdminFields
          :model-value="value"
          :disabled="disabled"
          @update:model-value="update(String(key), $event)"
        />
      </fieldset>
      <label
        v-else-if="!hidden.test(String(key))"
        :class="{ 'check-row': typeof value === 'boolean' }"
        ><span>{{ title(String(key)) }}</span>
        <input
          v-if="typeof value === 'boolean'"
          type="checkbox"
          :checked="value"
          :disabled="disabled"
          @change="update(String(key), ($event.target as HTMLInputElement).checked)"
        />
        <select
          v-else-if="choices[String(key)] && !disabled"
          :value="value"
          @change="update(String(key), ($event.target as HTMLSelectElement).value)"
        >
          <option v-for="choice in choices[String(key)]" :key="choice">{{ choice }}</option>
        </select>
        <textarea
          v-else-if="Array.isArray(value)"
          :value="value.join('\n')"
          :disabled="disabled"
          @input="
            update(
              String(key),
              ($event.target as HTMLTextAreaElement).value.split('\n').filter(Boolean),
            )
          "
        />
        <textarea
          v-else-if="/description|message|bio|text/i.test(String(key))"
          :value="value"
          :disabled="disabled"
          @input="update(String(key), ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          :type="
            /password|token|secret|key$/i.test(String(key))
              ? 'password'
              : key === 'dueDate'
                ? 'date'
                : typeof value === 'number'
                  ? 'number'
                  : 'text'
          "
          :value="value"
          :disabled="disabled"
          @input="
            update(
              String(key),
              typeof value === 'number'
                ? Number(($event.target as HTMLInputElement).value)
                : ($event.target as HTMLInputElement).value,
            )
          "
        />
      </label>
    </template>
  </div>
</template>
