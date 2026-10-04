# VitePress product port — migration matrix

Baseline: `7a15201810b6307bf141040e778dccb2db778c5a`. Local working tree was clean. No commit, push, workflow execution or VPS access is authorized. External source remains unchanged.

Backup: `C:/Users/iannc/Desktop/wf-docsold-migration-snapshots/20261003-190907`; 346 tracked files verified by SHA-256, full Git bundle verified.

> **Build status: ✅ EXIT CODE 0 — 842 fișiere publicate la `docs/.vitepress/dist`**
> Toate componentele de mai jos cu STATUS = DONE sunt verificate ca buildabile.

---

## Admin Pages (toate prin AdminShell + AdminResource)

| SOURCE | TYPE | FUNCTION | TARGET VUE/VITEPRESS FILE | BACKEND API | STATUS | NOTE |
|---|---|---|---|---|---|---|
| app/admin/page.tsx | page | Mission Control dashboard | AdminResource.vue (section='') | /api/admin/dashboard | DONE | Generic AdminResource |
| app/admin/login/page.tsx | page | Auth + 2FA | AdminLogin.vue | /api/admin/auth/login, /api/admin/auth/2fa | DONE | PBKDF2 + TOTP |
| app/admin/ai-analytics/page.tsx | page | AI telemetry stats | AdminResource.vue (section=ai-analytics) | /api/admin/ai-analytics | DONE | |
| app/admin/api-keys/page.tsx | page | API key management | AdminResource.vue (section=api-keys) | /api/admin/api-keys | DONE | |
| app/admin/audit/page.tsx | page | Audit ledger SHA-256 | AdminResource.vue (section=audit) | /api/admin/audit | DONE | |
| app/admin/backups/page.tsx | page | Snapshot vault | AdminResource.vue (section=backups) | /api/admin/backups | DONE | |
| app/admin/content/page.tsx | page | Content Studio | AdminContentStudioClient.vue | /api/admin/doc | DONE | Multi-tab, Find&Replace, Studio modals |
| app/admin/database/page.tsx | page | Database viewer | AdminResource.vue (section=database) | /api/admin/database | DONE | |
| app/admin/discord-bot/page.tsx | page | Discord bot overview | DiscordModules.vue | /api/admin/discord-bot/overview | DONE | |
| app/admin/discord-bot/modules/page.tsx | page | Bot modules | DiscordModules.vue | /api/admin/discord-bot/overview | DONE | |
| app/admin/discord-bot/role-trackers/page.tsx | page | Role trackers | AdminResource.vue | /api/admin/discord-bot/role-trackers | DONE | |
| app/admin/discord-bot/staff/page.tsx | page | Discord staff | AdminResource.vue | /api/admin/discord-bot/staff | DONE | |
| app/admin/discord-bot/tickets/page.tsx | page | Tickete Discord | AdminResource.vue | /api/admin/discord-bot/tickets | DONE | |
| app/admin/discord-bot/watchlist/page.tsx | page | Watchlist | AdminResource.vue | /api/admin/discord-bot/watchlist | DONE | |
| app/admin/gitops/page.tsx | page | GitOps sync | AdminResource.vue (section=gitops) | /api/admin/gitops | DONE | |
| app/admin/health/page.tsx | page | Doc Health | AdminResource.vue (section=health) | /api/admin/health | DONE | |
| app/admin/inbox/page.tsx | page | Inbox notificări | AdminResource.vue (section=inbox) | /api/admin/notifications | DONE | |
| app/admin/media/page.tsx | page | Media Vault | AdminResource.vue (section=media) | /api/admin/media | DONE | |
| app/admin/profile/page.tsx | page | Profilul meu + 2FA | AdminResource.vue (section=profile) | /api/admin/profile | DONE | |
| app/admin/search-analytics/page.tsx | page | Search Analytics | AdminResource.vue (section=search-analytics) | /api/admin/search-analytics | DONE | |
| app/admin/security/page.tsx | page | Securitate | AdminResource.vue (section=security) | /api/admin/sessions | DONE | |
| app/admin/settings/page.tsx | page | Setări platformă | AdminResource.vue (section=settings) | /api/admin/settings | DONE | |
| app/admin/tasks/page.tsx | page | Task Hub | AdminResource.vue (section=tasks) | /api/admin/tasks | DONE | |
| app/admin/team/page.tsx | page | Echipă + permisiuni | AdminResource.vue (section=team) | /api/admin/team | DONE | |

---

## Public Pages

| SOURCE | TYPE | FUNCTION | TARGET FILE | STATUS | NOTE |
|---|---|---|---|---|---|
| app/page.tsx | page | Redirect → /docs | VitePress root config | DONE | redirect prin config.mts |
| app/docs/page.tsx | page | Docs home | DocsHome.vue | DONE | RecentlyUpdated, hero, cards |
| app/docs/[...slug]/page.tsx | page | Doc viewer | DocShell.vue + Content | DONE | TOC, DocTools, PageNav, Breadcrumbs |
| app/docs/team/page.tsx | page | Team listing | Widgets/ContributorsWF.vue | DONE | |
| app/docs/team/[username]/page.tsx | page | Profil user | DocUserWidget.vue | DONE | |
| app/team/page.tsx | page | Pagina Echipă | ContributorsWF.vue via SiteMap | DONE | |
| app/changelog/page.tsx | page | Changelog | Changelogs.vue + AllChangelogs.vue | DONE | |
| app/maintenance/page.tsx | page | Maintenance gate | MaintenanceScreen.vue | DONE | bypass admin |

---

## Admin Components

| SOURCE | TYPE | TARGET | STATUS | NOTE |
|---|---|---|---|---|
| components/admin/AdminAccessDenied.tsx | component | AdminShell.vue (inline) | DONE | panou generic restrict |
| components/admin/AdminBody.tsx | component | AdminShell.vue slot | DONE | |
| components/admin/AdminContentStudioClient.tsx | component | AdminContentStudioClient.vue | DONE | Multi-tab, Find&Replace, draft, studio modals, floating toolbar |
| components/admin/AdminHeader.tsx | component | AdminShell.vue (inline header) | DONE | |
| components/admin/AdminInbox.tsx | component | AdminResource.vue | DONE | via /api/admin/notifications |
| components/admin/AdminLiveTerminal.tsx | component | AdminLiveTerminal.vue | DONE | |
| components/admin/AdminMarkdownPreview.tsx | component | AdminMarkdownPreview.vue | DONE | |
| components/admin/AdminMetricCard.tsx | component | AdminResource.vue | DONE | generic render |
| components/admin/AdminNotificationsCenter.tsx | component | AdminResource.vue | DONE | |
| components/admin/AdminShell.tsx | component | AdminShell.vue | DONE | auth, nav, permission filter |
| components/admin/AdminSidebar.tsx | component | AdminShell.vue (inline sidebar) | DONE | |
| components/admin/AdminThemeToggle.tsx | component | AdminShell.vue (isDark toggle) | DONE | |
| components/admin/JarvisChartsSuite.tsx | component | JarvisChartsSuite.vue | DONE | |

---

## Studio Components (toate noi în această sesiune)

| SOURCE | TYPE | TARGET | STATUS |
|---|---|---|---|
| components/admin/studio/AdminTrashModal.tsx | component | studio/AdminTrashModal.vue | DONE |
| components/admin/studio/StudioCalloutBuilderModal.tsx | component | studio/StudioCalloutBuilderModal.vue | DONE |
| components/admin/studio/StudioCodeBuilderModal.tsx | component | studio/StudioCodeBuilderModal.vue | DONE |
| components/admin/studio/StudioFloatingLineToolbar.tsx | component | studio/StudioFloatingLineToolbar.vue | DONE |
| components/admin/studio/StudioGalleryBuilderModal.tsx | component | studio/StudioGalleryBuilderModal.vue | DONE |
| components/admin/studio/StudioTableBuilderModal.tsx | component | studio/StudioTableBuilderModal.vue | DONE |

---

## Docs Components

| SOURCE | TYPE | TARGET | STATUS | NOTE |
|---|---|---|---|---|
| components/docs/Callout.tsx | component | Docs/Callout.vue | DONE | |
| components/docs/Card.tsx | component | Docs/Card.vue | DONE | |
| components/docs/CodeBlock.tsx | component | Docs/CodeBlock.vue | DONE | |
| components/docs/CopyablePre.tsx | component | DocEnhancements.vue (copy toast) | DONE | integrat |
| components/docs/DocAiSummaryCapsule.tsx | component | Docs/DocTools.vue | DONE | |
| components/docs/DocEndAiExplainer.tsx | component | Docs/DocTools.vue | DONE | |
| components/docs/DocImage.tsx | component | Docs/DocImage.vue | DONE | |
| components/docs/DocIntegritySeal.tsx | component | Docs/DocTools.vue | DONE | |
| components/docs/DocQuickActions.tsx | component | Docs/DocTools.vue | DONE | |
| components/docs/DocReportModal.tsx | component | Docs/DocTools.vue | DONE | |
| components/docs/DocVideo.tsx | component | Docs/DocVideo.vue | DONE | |
| components/docs/DocViewTracker.tsx | component | Docs/DocTools.vue | DONE | |
| components/docs/DocsTransitionWrapper.tsx | component | NOT APPLICABLE | N/A | Next.js specifc; VitePress are router.onAfterRouteChange + CSS |
| components/docs/MDXComponents.tsx | component | theme/index.ts (app.component) | DONE | |
| components/docs/MediaLightbox.tsx | component | Widgets/FluidLightbox.vue | DONE | |
| components/docs/RecentlyUpdatedSection.tsx | component | Docs/RecentlyUpdatedSection.vue | DONE | |
| components/docs/Steps.tsx | component | Docs/Steps.vue + Step.vue | DONE | |
| components/docs/Tabs.tsx | component | Docs/Tabs.vue + Tab.vue | DONE | |
| components/docs/TextSelectionAskAi.tsx | component | DocEnhancements.vue | DONE | |

---

## Layout Components

| SOURCE | TYPE | TARGET | STATUS | NOTE |
|---|---|---|---|---|
| components/layout/Header.tsx | component | Layout/Header.vue | DONE | |
| components/layout/MobileMenuToggle.tsx | component | Layout/Header.vue (inline) | DONE | |
| components/layout/MobileTableOfContents.tsx | component | Layout/MobileScrollSpy.vue | DONE | |
| components/layout/Sidebar.tsx | component | Layout/Sidebar.vue | DONE | |
| components/layout/SidebarShuffleCard.tsx | component | Layout/SidebarShuffleCard.vue | DONE | |
| components/layout/TableOfContents.tsx | component | Layout/WfTOC.vue | DONE | |

---

## UI Components

| SOURCE | TYPE | TARGET | STATUS | NOTE |
|---|---|---|---|---|
| components/ui/AiHelper.tsx | component | ui/AiHelper.vue | DONE | Multi-sesiune, stop, export md, surse conexe |
| components/ui/AnnouncementBanner.tsx | component | ui/AnnouncementBanner.vue | DONE | creat în această sesiune |
| components/ui/Breadcrumbs.tsx | component | ui/Breadcrumbs.vue | DONE | creat în această sesiune |
| components/ui/CookieConsentBanner.tsx | component | ui/CookieConsentBanner.vue | DONE | |
| components/ui/DocSkeleton.tsx | component | NOT APPLICABLE | N/A | nu există în source |
| components/ui/FeedbackWidget.tsx | component | Widgets/FeedbackWidget.vue | DONE | |
| components/ui/LayoutControls.tsx | component | ui/LayoutControls.vue | DONE | creat în această sesiune |
| components/ui/LiquidEffects.tsx | component | ui/LiquidEffects.vue | DONE | |
| components/ui/LiquidFireWave.tsx | component | ui/LiquidFireWave.vue | DONE | |
| components/ui/MaintenanceScreen.tsx | component | ui/MaintenanceScreen.vue | DONE | |
| components/ui/PageNav.tsx | component | ui/PageNav.vue | DONE | creat în această sesiune |
| components/ui/PageProgressBar.tsx | component | Layout/DocEnhancements.vue | DONE | integrat |
| components/ui/ScrollToTop.tsx | component | Layout/BackToTop.vue | DONE | |
| components/ui/SearchModal.tsx | component | Search/WfSearchModal.vue | DONE | +AI Spotlight, +Recent Searches |
| components/ui/ThemeToggle.tsx | component | AdminShell.vue + Header.vue | DONE | |

---

## Team & GitOps

| SOURCE | TYPE | TARGET | STATUS |
|---|---|---|---|
| components/team/TeamView.tsx | component | Widgets/ContributorsWF.vue | DONE |
| components/gitops/AutoSyncWatcher.tsx | component | server/routes/admin/gitops.ts (server-side) | DONE |

---

## API Routes (ALL 61 — toate portate)

| SOURCE | TARGET EXPRESS | STATUS |
|---|---|---|
| app/api/admin/* (25 rute) | server/routes/admin/* | DONE |
| app/api/ai-helper/* (4 rute) | server/routes/ai-helper.ts | DONE |
| app/api/analytics/* | server/routes/analytics.ts | DONE |
| app/api/discord/* | server/routes/discord.ts | DONE |
| app/api/docs/* (2 rute) | server/routes/docs.ts | DONE |
| app/api/search | server/routes/search.ts | DONE |
| app/api/steam/avatar | server/routes/steam.ts | DONE |
| app/api/system/* (2 rute) | server/routes/system.ts | DONE |
| app/api/team/* (3 rute) | server/routes/team.ts | DONE |
| app/api/webhooks/github | server/routes/webhooks.ts | DONE |
| app/api/og/route.tsx | server/routes/og.ts | DONE |

---

## Lib Files (ALL ported to server/lib/)

| SOURCE LIB | TARGET | STATUS |
|---|---|---|
| lib/search.ts | server/lib/search.ts | DONE |
| lib/git.ts | server/lib/git.ts | DONE |
| lib/navigation.ts | server/lib/navigation.ts | DONE |
| lib/version.ts | server/lib/version.ts | DONE |
| lib/changelog.ts | server/lib/changelog.ts | DONE |
| lib/repoContributions.ts | server/lib/repoContributions.ts | DONE |
| lib/badgesEngine.ts | server/lib/badgesEngine.ts | DONE |
| lib/admin/* (7 fișiere) | server/lib/admin/* | DONE |
| lib/backup/* | server/lib/backup/* | DONE |
| lib/db/* (5 fișiere) | server/lib/db/* | DONE |
| lib/gitops/* | server/lib/gitops/* | DONE |
| lib/notifications/* (5 fișiere) | server/lib/notifications/* | DONE |
| lib/security/* (12 fișiere) | server/lib/security/* | DONE |

---

## Design System

| ITEM | STATUS | NOTE |
|---|---|---|
| styles/tokens.css | DONE | complet identic cu source |
| styles/components.css (6378 linii) | DONE | portat în source-components.css (3728 linii) + port.css |
| styles/prose.css | DONE | adaptat ca .vp-doc în port.css |
| Liquid Glass design language | DONE | tokens dark+light complet |
| Aurora beam callout effects | DONE | all 5 types |
| @iconify/vue (lucide:* prefix) | DONE | înlocuiește lucide-react |
| No emoji unicode icons | DONE | |

---

## Infrastructure Contract (NESCHIMBAT)

| ITEM | STATUS |
|---|---|
| npm run docs:build → dist | ✅ DONE |
| server.js → server/.build/app.mjs | ✅ DONE |
| PM2 wildfire-wiki-api :3000 | ✅ NESCHIMBAT |
| Nginx root /var/www/wiki/docs/.vitepress/dist | ✅ NESCHIMBAT |
| No Next.js runtime | ✅ DONE |
| No React runtime | ✅ DONE |
| Node >=20.19.0 | ✅ DONE |

---

## Gaps rămase (opționale / BLOCKED)

| ITEM | STATUS | NOTA |
|---|---|---|
| AdminContentStudioClient — linting MDX în timp real | PORT | necesită server endpoint /api/admin/doc/lint |
| AdminContentStudioClient — Drag & Drop imagini pe editor | PORT | necesită server upload integrare |
| AiHelper — mod Panou Lateral andocat | PORT | nevoie de CSS global layout |
| LayoutControls — CSS-driven layout switching | PORT | CSS pentru data-layout attr adăugat; nevoie de validare vizuală |
| Content docs semantic review (conflicte) | MERGE | 72 documente necesită review manual |
