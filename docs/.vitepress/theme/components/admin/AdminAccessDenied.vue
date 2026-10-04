<script setup lang="ts">
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

interface RoutePermissionSpec {
  permKey?: string;
  label?: string;
  category?: string;
}

const props = withDefaults(
  defineProps<{
    username?: string;
    displayName?: string;
    role?: string;
    pathname: string;
    requiredSpec?: RoutePermissionSpec;
    canEditDocs?: boolean;
  }>(),
  {
    username: 'Administrator',
    role: 'Membru Echipă',
    canEditDocs: false,
  }
);

const isGuest = computed(() => props.role === 'Guest');
</script>

<template>
  <div class="admin-access-denied-container">
    <div class="admin-access-denied-card">
      <!-- Top Glow & Shield Icon -->
      <div class="admin-access-denied-icon-wrap">
        <div class="admin-access-denied-icon-pulse" />
        <Icon icon="lucide:shield-alert" width="44" height="44" class="admin-access-denied-shield" />
      </div>

      <!-- Status Pill & Headings -->
      <div class="admin-access-denied-badge">
        <Icon icon="lucide:lock" width="12" height="12" />
        <span>ACCES RESTRICȚIONAT (403 FORBIDDEN)</span>
      </div>

      <h1 class="admin-access-denied-title">
        {{ isGuest ? 'Autentificare Necesară' : 'Nivel de Autorizare Insuficient' }}
      </h1>
      <p class="admin-access-denied-desc">
        {{
          isGuest
            ? 'Această secțiune a panoului de control este protejată și necesită o sesiune validă. Trebuie să te autentifici pentru a continua.'
            : 'Această secțiune a panoului de control conține operațiuni cu impact critic asupra platformei și necesită permisiuni extinse pe care contul tău nu le deține în prezent.'
        }}
      </p>

      <!-- Security Breakdown Matrix -->
      <div class="admin-access-denied-matrix">
        <div class="admin-access-denied-row">
          <span class="admin-access-denied-key">
            <Icon icon="lucide:user" width="13" height="13" />
            <span>Cont Autentificat</span>
          </span>
          <div class="admin-access-denied-val">
            <span class="admin-status-pill admin-status-pill--neutral">
              {{ props.displayName || props.username }}
            </span>
            <span class="admin-status-pill admin-status-pill--role">
              {{ props.role.replace(/_/g, ' ').toUpperCase() }}
            </span>
          </div>
        </div>

        <div class="admin-access-denied-row">
          <span class="admin-access-denied-key">
            <Icon icon="lucide:alert-octagon" width="13" height="13" />
            <span>Secțiune Solicitată</span>
          </span>
          <div class="admin-access-denied-val">
            <code class="admin-code-cell">{{ props.pathname }}</code>
            <span v-if="props.requiredSpec?.category" class="admin-status-pill admin-status-pill--category">
              {{ props.requiredSpec.category }}
            </span>
          </div>
        </div>

        <template v-if="!isGuest">
          <div class="admin-access-denied-row">
            <span class="admin-access-denied-key">
              <Icon icon="lucide:key" width="13" height="13" />
              <span>Permisiune Necesară</span>
            </span>
            <div class="admin-access-denied-val">
              <span class="admin-perm-tag admin-perm-tag--denied">
                {{ props.requiredSpec?.permKey || 'Drepturi Extinse' }}
              </span>
              <span v-if="props.requiredSpec?.label" class="text-xs text-[var(--color-text-secondary)] font-medium">
                ({{ props.requiredSpec.label }})
              </span>
            </div>
          </div>

          <div class="admin-access-denied-row">
            <span class="admin-access-denied-key">
              <Icon icon="lucide:shield-check" width="13" height="13" />
              <span>Autoritate de Deblocare</span>
            </span>
            <div class="admin-access-denied-val">
              <span class="admin-root-badge">SUPER ADMIN ROOT (@iannC69)</span>
            </div>
          </div>
        </template>
      </div>

      <!-- Helpful Info Alert -->
      <div class="admin-access-denied-notice">
        <Icon icon="lucide:lock" width="14" height="14" class="text-amber-400 flex-shrink-0" />
        <span>
          {{
            isGuest
              ? 'Sesiunea ta a expirat sau nu ești conectat. Te rugăm să te autentifici folosind formularul de login.'
              : 'Dacă ai nevoie de acces la această secțiune pentru îndeplinirea atribuțiilor administrative, solicită Super Administratorului Root (iannC69) activarea permisiunii specifice în modulul de gestiune a echipei.'
          }}
        </span>
      </div>

      <!-- Action Buttons -->
      <div class="admin-access-denied-actions">
        <template v-if="isGuest">
          <a href="/admin/login" class="admin-btn admin-btn--primary">
            <Icon icon="lucide:key" width="14" height="14" />
            <span>Autentificare (Login)</span>
          </a>
          <a href="/" class="admin-btn admin-btn--secondary">
            <Icon icon="lucide:arrow-left" width="14" height="14" />
            <span>Înapoi pe Site</span>
          </a>
        </template>
        <template v-else>
          <a href="/admin" class="admin-btn admin-btn--primary">
            <Icon icon="lucide:layout-dashboard" width="14" height="14" />
            <span>Înapoi la Mission Control</span>
          </a>
          <a v-if="props.canEditDocs" href="/admin/content" class="admin-btn admin-btn--secondary">
            <Icon icon="lucide:file-edit" width="14" height="14" />
            <span>Deschide Content Studio</span>
          </a>
        </template>
      </div>
    </div>
  </div>
</template>
