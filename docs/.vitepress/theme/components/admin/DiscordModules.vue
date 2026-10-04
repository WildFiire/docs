<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vitepress';
import { Icon } from '@iconify/vue';

defineProps<{
  user?: any;
}>();

const router = useRouter();

const NAV = [
  { href: '/admin/discord-bot', label: 'Overview', icon: 'lucide:bot' },
  { href: '/admin/discord-bot/tickets', label: 'Tickete', icon: 'lucide:ticket' },
  { href: '/admin/discord-bot/staff', label: 'Staff', icon: 'lucide:users' },
  { href: '/admin/discord-bot/watchlist', label: 'Watchlist', icon: 'lucide:eye' },
  { href: '/admin/discord-bot/role-trackers', label: 'Role Trackers', icon: 'lucide:radio' },
  { href: '/admin/discord-bot/modules', label: 'Module', icon: 'lucide:cpu', active: true },
];

const BOT_MODULES = [
  {
    name: 'Ticket System',
    files: ['buttonHandler.js', 'modalHandler.js', 'closeHandler.js'],
    color: 'emerald',
    icon: 'lucide:ticket',
    status: 'ACTIV',
    desc: 'Sistem complet de deschidere, gestionare și arhivare tickete demo anti-cheat. Include integrare Steam API pentru verificarea profilurilor suspecților.',
    features: [
      'Creare canal privat per ticket',
      'Steam API deep verification (VAC bans, ore CS2, vârstă cont)',
      'Watchlist check automat la fiecare ticket',
      'Verdict system (Curat / Codat / Insuficient)',
      'Generare transcript HTML la arhivare',
      'DM automat cu chitanță pentru jucător',
      'Mirror automat în canalele personale ale adminilor',
    ],
  },
  {
    name: 'AI Handler',
    files: ['aiHandler.js'],
    color: 'purple',
    icon: 'lucide:cpu',
    status: 'ACTIV',
    desc: 'Sistem de răspunsuri AI bazat pe Google Gemini. Procesează mesajele din canalul AI dedicat și generează răspunsuri contextuale pentru echipa de staff.',
    features: [
      'Integrat cu Google Gemini API',
      'Context pe conversație (memorie per sesiune)',
      'Răspunsuri doar în canalul AI desemnat',
      'Procesare asincronă pentru latență minimă',
    ],
  },
  {
    name: 'Staff Setup',
    files: ['staffSetupHandler.js', 'setupStaff.js', 'setupStaffAuto.js'],
    color: 'blue',
    icon: 'lucide:users',
    status: 'ACTIV',
    desc: 'Configurare automată a adminilor cu camere personale (canal postate + canal rezolvate). Permite urmărirea activității individuale a fiecărui admin.',
    features: [
      'Configurare canal "Demo Postate" per admin',
      'Configurare canal "Demo Rezolvate" per admin',
      'Setup manual și automat (selectare rol)',
      'Stocare în Supabase cu sync live',
    ],
  },
  {
    name: 'Role Tracker',
    files: ['trackerHandler.js', 'tracker.js (cron)'],
    color: 'cyan',
    icon: 'lucide:radio',
    status: 'ACTIV',
    desc: 'Canale vocale care afișează în timp real numărul de membri cu un anumit rol. Update automat la fiecare 15 minute prin cron job.',
    features: [
      'Creare automată categorie STATISTICI',
      'Canal vocal per rol cu member count live',
      'Cron job la 15 minute',
      'Rate limit protection (update doar dacă s-a schimbat)',
      'Auto-cleanup la ștergerea canalului vocal',
    ],
  },
  {
    name: 'Watchlist',
    files: ['watchlistHandler.js'],
    color: 'amber',
    icon: 'lucide:eye',
    status: 'ACTIV',
    desc: 'Sistem de supraveghere pentru jucători suspecți. Adminii pot adăuga suspecți cu dovezi în canalul Watchlist dedicat.',
    features: [
      'Adăugare suspect direct din ticket',
      'Stocare SteamID64 în Supabase',
      'Alert automat dacă suspectul deschide un nou ticket',
      'Canal Watchlist cu dovezi adăugabile',
    ],
  },
  {
    name: 'Welcome System',
    files: ['welcomeHandler.js'],
    color: 'teal',
    icon: 'lucide:message-square',
    status: 'ACTIV',
    desc: 'Mesaje de bun venit automate pentru membrii noi care se alătură serverului Discord.',
    features: [
      'Trigger la evenimentul guildMemberAdd',
      'Canal de welcome configurabil via WELCOME_CHANNEL_ID',
      'Embed personalizat cu username și avatar',
    ],
  },
  {
    name: 'Ghost Ping Detector',
    files: ['ghostPingHandler.js'],
    color: 'rose',
    icon: 'lucide:zap',
    status: 'ACTIV',
    desc: 'Detectează și alertează când un mesaj care conținea un ping este șters imediat după trimitere (ghost ping).',
    features: [
      'Trigger la evenimentul messageDelete',
      'Detectare ping-uri șterse în sub X secunde',
      'Notificare în canal despre ghost ping',
    ],
  },
  {
    name: 'Reminder Cron',
    files: ['reminder.js'],
    color: 'indigo',
    icon: 'lucide:clock',
    status: 'ACTIV',
    desc: 'Sistem de remindere automate programate pentru staff. Trimite notificări la intervale predefinite.',
    features: [
      'Remindere programate prin node-cron',
      'Configurare interval și canal',
      'Pornit automat la startup bot',
    ],
  },
  {
    name: 'Morning Briefing',
    files: ['morningBriefing.js'],
    color: 'orange',
    icon: 'lucide:bar-chart-3',
    status: 'ACTIV',
    desc: 'Raport zilnic automat dimineața cu statistici despre activitatea serverului și a echipei de staff.',
    features: [
      'Raport generat zilnic la ora configurată',
      'Statistici activitate: tickete deschise, rezolvate',
      'Trimis în canalul staff principal',
    ],
  },
  {
    name: 'Burnout Detector',
    files: ['burnoutDetector.js'],
    color: 'rose',
    icon: 'lucide:shield',
    status: 'ACTIV',
    desc: 'Monitorizează activitatea excesivă a adminilor și trimite alerte când un admin lucrează prea mult, pentru prevenirea epuizării.',
    features: [
      'Monitorizare activitate per admin',
      'Alertă la depășirea pragului de activitate',
      'Recomandare pauză pentru staff suprasolicitat',
    ],
  },
];

const colorMap: Record<string, string> = {
  emerald: 'hsl(160 60% 45%)',
  purple: 'hsl(260 70% 65%)',
  blue: 'hsl(220 80% 60%)',
  cyan: 'hsl(190 80% 55%)',
  amber: 'hsl(38 92% 55%)',
  teal: 'hsl(175 60% 50%)',
  rose: 'hsl(350 70% 55%)',
  indigo: 'hsl(235 70% 65%)',
  orange: 'hsl(25 90% 55%)',
};

const activeCount = BOT_MODULES.filter((m) => m.status === 'ACTIV').length;

function navigate(href: string) {
  router.go(href);
}
</script>

<template>
  <div class="admin-page-container">
    <div class="admin-page-header">
      <div>
        <div class="admin-breadcrumb-tag">DISCORD BOT · MODULE</div>
        <h1 class="admin-page-title">Module Bot ({{ activeCount }} active)</h1>
        <p class="admin-page-description">
          Toate modulele, handler-ele și cron job-urile care rulează în botul WildFire Discord. Fiecare modul este activ și integrat în pipeline-ul principal.
        </p>
      </div>
      <span
        class="discord-bot-status-badge discord-bot-status-badge--active"
        style="font-size: 0.8rem; padding: 6px 14px;"
      >
        <Icon icon="lucide:check-circle-2" width="13" height="13" style="margin-right: 5px;" />
        {{ activeCount }} / {{ BOT_MODULES.length }} Active
      </span>
    </div>

    <nav class="discord-bot-subnav">
      <a
        v-for="l in NAV"
        :key="l.href"
        :href="l.href"
        class="discord-bot-subnav-item"
        :class="{ 'discord-bot-subnav-item--active': l.active }"
        @click.prevent="navigate(l.href)"
      >
        <Icon :icon="l.icon" width="14" height="14" />
        <span>{{ l.label }}</span>
      </a>
    </nav>

    <div class="discord-bot-modules-full-grid">
      <div
        v-for="mod in BOT_MODULES"
        :key="mod.name"
        class="discord-bot-module-full-card"
        :style="{ borderLeftColor: colorMap[mod.color] }"
      >
        <div class="discord-bot-module-full-header">
          <div
            class="discord-bot-module-full-icon"
            :style="{ background: `${colorMap[mod.color]}22`, color: colorMap[mod.color] }"
          >
            <Icon :icon="mod.icon" width="18" height="18" />
          </div>
          <div>
            <div class="discord-bot-module-full-name">{{ mod.name }}</div>
            <div class="discord-bot-module-full-files">
              <code v-for="f in mod.files" :key="f" class="discord-bot-module-file" style="margin-right: 4px;">{{ f }}</code>
            </div>
          </div>
          <span class="discord-bot-module-badge" style="margin-left: auto;">ACTIV</span>
        </div>

        <p class="discord-bot-module-full-desc">{{ mod.desc }}</p>

        <ul class="discord-bot-module-features">
          <li v-for="f in mod.features" :key="f">
            <Icon icon="lucide:check-circle-2" width="11" height="11" :style="{ color: colorMap[mod.color], flexShrink: 0 }" />
            <span>{{ f }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
