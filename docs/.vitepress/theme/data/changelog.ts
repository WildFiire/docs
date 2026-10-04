export type ChangeType = 'feature' | 'improvement' | 'breaking' | 'fix';

export interface ChangeItem {
  type: ChangeType;
  title: string;
  description?: string;
  badge?: string;
}

export interface ReleaseEntry {
  version: string;
  isLatest?: boolean;
  date: string;
  title: string;
  summary: string;
  author: {
    name: string;
    username: string;
    avatar: string;
  };
  git: {
    commitHash: string;
    commitUrl: string;
    tagUrl: string;
  };
  changes: ChangeItem[];
  highlights?: string[];
  slug: string;
}

export const RELEASES_DATA: ReleaseEntry[] = [
  {
    version: 'v1.8.5',
    isLatest: true,
    date: 'August 21, 2026',
    title: 'Cookie Consent Morphing, CS2 Community Spotlight & Admin Fortress 2.0',
    summary:
      'Official v1.8.5 release featuring in-place payment-style cookie consent animations, dynamic CS2 rotating community cards, and complete Admin Gateway Liquid Glass overhaul.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: 'e4c892a',
      commitUrl: 'https://github.com/iannC69/wf-docscore/commit/e4c892a',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v1.8.5',
    },
    changes: [
      {
        type: 'feature',
        title:
          'In-place Cookie Consent Payment-Style Animation System with SVG arc fill and particle burst',
        description:
          'Smooth morphing confirmation directly inside the floating banner with zero DOM duplication or layout shifts.',
      },
      {
        type: 'feature',
        title:
          'Interactive CS2 Community Spotlight & Shuffle Card in Sidebar with 5 rotating live modules',
        description:
          'Integrated real-time CS2 commands (!ws, !knife), Discord 2.860+ members hub, AI launcher, and pro-tips generator.',
      },
      {
        type: 'improvement',
        title:
          'Complete Admin Gateway (/admin/login) Liquid Glass redesign with Aurora flares and password toggle',
        description:
          'Upgraded with 28px backdrop blur, top shimmer beams, WebKit dark autofill, and security status tags.',
      },
      {
        type: 'improvement',
        title:
          'Strict Counter-Strike 2 terminology and ecosystem synchronization across entire documentation platform',
        description:
          'Aligned all AI prompts, system guides, commands, and quick search indices exclusively for CS2.',
      },
    ],
    highlights: [
      'Official v1.8.5 production engine update',
      'Liquid Glass & Aurora aesthetic enhancements',
    ],
    slug: 'v1-8-5',
  },
  {
    version: 'v1.8.0',
    isLatest: false,
    date: 'August 21, 2026',
    title: 'Core Team Liquid Glass Upgrades & Full Admin Inspector',
    summary:
      'Official v1.8.0 update introducing platform enhancements, performance optimizations, and documentation refinements.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: 'b58c95f',
      commitUrl: 'https://github.com/iannC69/wf-docscore/commit/b58c95f',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v1.8.0',
    },
    changes: [
      {
        type: 'feature',
        title:
          'Initialize comprehensive documentation portal with integrated AI-assisted search, admin analytics, and categorized system guides',
        description: 'Included in commit b58c95f.',
      },
      {
        type: 'feature',
        title:
          'Implement AI helper assistant with analytics, telemetry, and customized Aurora-themed UI components',
        description: 'Included in commit 8706d23.',
      },
      {
        type: 'feature',
        title:
          'Implement comprehensive MDX rendering engine and dynamic scroll-aware table of contents components',
        description: 'Included in commit e9a0af9.',
      },
      {
        type: 'feature',
        title:
          'V1.6.0 Granular RBAC 2.0 Team Matrix, Root Session Immunity and Liquid Glass UI Architecture',
        description: 'Included in commit e81e855.',
      },
      {
        type: 'feature',
        title:
          'Complete wildfire wiki migration, studio hd lightbox, orange video player & 61-doc carousel',
        description: 'Included in commit 271a80e.',
      },
      {
        type: 'feature',
        title:
          'Implement platform version 1.4.0 with administrative settings store and UI for maintenance and announcements',
        description: 'Included in commit f56dc1c.',
      },
      {
        type: 'feature',
        title:
          'Implement comprehensive administrative dashboard, security suite, maintenance mode, and search infrastructure',
        description: 'Included in commit f728058.',
      },
      {
        type: 'improvement',
        title:
          'Ensure uninterrupted hardware-accelerated GPU transition on Table of Contents gliding capsule for 100% clean smooth scrolling',
        description: 'Included in commit 892fa56.',
      },
    ],
    highlights: [
      'Full release packaging for v1.8.0',
      'Live synchronization with GitHub commit b58c95f',
    ],
    slug: 'v1-8-0',
  },

  {
    version: 'v1.7.0',
    isLatest: false,
    date: 'August 21, 2026',
    title:
      'WildFire AI Assistant Engine, LocalStorage Multi-Session History, Search Spotlight & Ambient Liquid Glass Parity',
    summary:
      'Version 1.7.0 introduces the WildFire AI Intelligence Engine grounded on all 62 documentation guides, LocalStorage multi-conversation history with intelligent naming and session management, Command Palette AI Spotlight with live telemetry suggestions, confidential error masking (ERROR_WF-XYZ), multilingual language matching, and 1:1 ambient Liquid Fire background parity.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: 'HEAD',
      commitUrl: 'https://github.com/iannC69/wf-docscore/tree/main',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v1.7.0',
    },
    changes: [
      {
        type: 'feature',
        title: 'WildFire AI Assistant Engine & Security Grounding',
        description:
          'Google Gemini-powered intelligent assistant strictly grounded on the entire documentation index (62 guides). Includes server-side prompt injection defenses, zero secrets leakage, and confidential error code masking (ERROR_WF-XYZ).',
        badge: 'AI Core',
      },
      {
        type: 'feature',
        title: 'LocalStorage Multi-Session Conversation History',
        description:
          'Full conversation persistence across page reloads. Includes a dedicated History drawer, automatic conversation naming from user prompts, timestamps, message counters, active session indicators, and individual/bulk session management.',
        badge: 'AI Sessions',
      },
      {
        type: 'feature',
        title: 'Search Modal AI Spotlight & Live Telemetry Suggestions',
        description:
          "Command Palette (Ctrl + K) displays an interactive AI Spotlight action card when typing questions, a quick 'Ask AI' tab, and live telemetry suggestions from the community query log.",
        badge: 'DeepSearch',
      },
      {
        type: 'feature',
        title: 'Bilingual Multilingual Intelligence',
        description:
          'Exact language matching ensuring English questions receive pure English responses and Romanian questions receive clean Romanian responses without cross-language pollution.',
        badge: 'Intelligence',
      },
      {
        type: 'improvement',
        title: '1:1 Docs Ambient Liquid Fire Background Continuity',
        description:
          'Enhanced AI panel with drifting warm ember radial gradient blobs, fractal noise texture, and translucent frosted glass header/input trays matching the documentation aesthetic.',
        badge: 'Design System',
      },
      {
        type: 'improvement',
        title: 'Multi-Layout Responsive Architecture',
        description:
          'Three customizable display modes: Side Drawer (460px right dock), Centered Modal (820px floating window), and Expansive Fullscreen, with layout preference saved in localStorage.',
        badge: 'UI / UX',
      },
      {
        type: 'fix',
        title: 'Search Modal Recent Searches CSS & Zero-Emoji Enforcement',
        description:
          'Restored and polished CSS styling for recent searches chips and enforced 100% Lucide React SVG vector iconography across all assistant markdown responses.',
        badge: 'Bug Fix',
      },
    ],
    highlights: [
      'WildFire AI Assistant grounded in 62 documentation guides with prompt injection defenses',
      'Multi-session conversation history stored in LocalStorage with quick New Chat & session switching',
      'Command Palette AI Spotlight action card & dynamic telemetry questions',
      'Exact multilingual language matching (English / Romanian)',
      '1:1 Docs ambient Liquid Fire background aura & translucent glass panels',
      'Confidential ERROR_WF-XYZ error code masking with zero raw provider traces',
    ],
    slug: 'v1-7-0',
  },
  {
    version: 'v1.6.0',
    isLatest: false,
    date: 'August 17, 2026',
    title:
      'Granular RBAC 2.0 Team Matrix, Root Session Immunity, Liquid Glass Inspector & Zero-Emoji Security Architecture',
    summary:
      'Version 1.6.0 introduces a comprehensive RBAC 2.0 administration matrix with 10 granular permissions, Root Super Admin session immunity, emergency Panic Lockdown authorization shields, an overhauled Liquid Glass profile inspector, vibrant permission pills, auto-syncing .env.local credentials, and dynamic sidebar privilege filtering.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: 'HEAD',
      commitUrl: 'https://github.com/iannC69/wf-docscore/tree/main',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v1.6.0',
    },
    changes: [
      {
        type: 'feature',
        title: 'Granular RBAC 2.0 Matrix & Live Team Store',
        description:
          'Fine-grained 10-module permission engine (Content Studio, Delete Docs, Media Vault, Search Telemetry, Audit Ledger, Platform Settings, Security 2FA, API Tokens, Panic Lockdown, Team Access) with instant .env.local credential synchronization.',
        badge: 'Security Core',
      },
      {
        type: 'feature',
        title: 'Root Super Admin Session Immunity & Panic Shield',
        description:
          'Root administrator sessions (iannC69) are permanently immune to unauthorized revocation. Emergency Panic Lockdown controls and API endpoints are strictly guarded by Root cryptographic verification.',
        badge: 'Fortress RBAC',
      },
      {
        type: 'feature',
        title: 'Dynamic Sidebar Matrix Privilege Filtering',
        description:
          'Navigation matrix automatically filters out inaccessible administrative modules in real-time based on active member permissions with 403 Forbidden enforcement on server routes.',
        badge: 'Admin Matrix',
      },
      {
        type: 'improvement',
        title: 'Liquid Glass 2-Column Compact Profile Inspector',
        description:
          'Replaced text-heavy forms with a clean 2-column permission matrix featuring colored SVG icon capsules, green ACTIV and subtle grey BLOCAT status pills, and root-only interactive toggle switches.',
        badge: 'UI / UX',
      },
      {
        type: 'improvement',
        title: 'Restrained Liquid Glass Metric Cards & Session Pills',
        description:
          'Upgraded top team metric cards with color-tinted Lucide vector icon boxes, micro-status badges (2 ACTIVE, ROOT PROFIL, 10 MODULI), adaptive search toolbar, and wrap-protected session indicators.',
        badge: 'Design System',
      },
      {
        type: 'improvement',
        title: 'Dark Liquid Glass Select & Filter Architecture',
        description:
          'Custom dark glass select dropdowns and filter capsules with Lucide SVG vectors across Audit Ledger, API Tokens, Media Vault, and Content Studio, eliminating unstyled native browser elements.',
        badge: 'Styling',
      },
      {
        type: 'improvement',
        title: 'Vibrant Frosted Glass Permission Badges',
        description:
          'Standardized color-coded frosted glass pill badges for all 10 module access tags across member cards and profile views.',
        badge: 'Visual Polish',
      },
    ],
    highlights: [
      '10-module Granular RBAC 2.0 engine with .env.local credential auto-sync',
      'Root Super Admin (iannC69) session immunity and Panic Lockdown shields',
      'Dynamic sidebar navigation matrix with server-side 403 gatekeeping',
      'Compact 2-column Liquid Glass permission matrix inspector',
      'Restrained metric cards, vibrant frosted badges, and dark glass dropdowns',
      'Strict zero-emoji compliance with 100% Lucide React vector icons',
    ],
    slug: 'v1-6-0',
  },
  {
    version: 'v1.5.0',
    isLatest: false,
    date: 'August 17, 2026',
    title:
      'Wildfire Full Migration, Studio HD Media Lightbox, Orange Video Player & 61-Doc Live Carousel',
    summary:
      'Version 1.5.0 delivers the complete migration of the official Wildfire documentation (61+ pure semantic MDX articles across 4 core groups), a studio-grade HD Media Lightbox with Zoom & Pan for all imagery, the Wildfire Orange Video Player with Frosted Blur & Theatre Mode, a dynamic 61-document paginated slider in Recently Updated, and clean Lucide vector iconography.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: 'HEAD',
      commitUrl: 'https://github.com/iannC69/wf-docscore/tree/main',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v1.5.0',
    },
    changes: [
      {
        type: 'feature',
        title: '100% Wildfire Documentation Migration (61+ Articles)',
        description:
          'Full port and semantic normalization of all server documentation into 4 official categories: Informații, Currency, Systems, and Market & Donații. Generated intermediate route indexes for 100% 404-free navigation across 87 static routes.',
        badge: 'Content Core',
      },
      {
        type: 'feature',
        title: 'Studio HD Media Lightbox with Zoom & Pan',
        description:
          'Global interactive lightbox for all documentation images with 50%-300% zoom controls, 90-degree rotation, 1-click URL copy, direct file download, and full keyboard navigation (Esc, +, -, 0).',
        badge: 'Media Engine',
      },
      {
        type: 'feature',
        title: 'Wildfire Orange Video Player with Theatre Mode',
        description:
          'Frosted glass blur preview card with pulsing orange circular play button, auto-transforming all MDX <video> tags into HD Lightbox theatre modals without native control bleeding or console warnings.',
        badge: 'Video Player',
      },
      {
        type: 'feature',
        title: '61-Document Live Git Sync Carousel with Pagination',
        description:
          'Uncapped Recently Updated section scanning all 61 active articles, featuring header arrow navigation (< 1 / 11 >), bottom numbered pagination, dynamic change counter pill, and full collapse/expand toggle.',
        badge: 'Documentation Hub',
      },
      {
        type: 'improvement',
        title: 'Lucide Vector Iconography System',
        description:
          'Replaced legacy emojis across sidebar groups and document cards with crisp, themed Lucide React SVG vectors with category-specific color badges.',
        badge: 'UI / UX',
      },
      {
        type: 'fix',
        title: 'MDX AST Sanitizer & Console Warning Elimination',
        description:
          'Resolved empty string src warnings on media elements, auto-escaped placeholder tags (<cod>, <nume>), and stripped orphan HTML closing tags for bulletproof Turbopack builds.',
        badge: 'Stability',
      },
    ],
    highlights: [
      '61+ fully migrated and verified documentation articles',
      'Studio HD Media Lightbox with zoom, rotation, and keyboard controls',
      'Wildfire Orange Video Player with frosted blur & theatre modal',
      'Paginated 61-doc carousel with live change counter in Documentation Hub',
      'Zero 404s and 100% clean builds across all 87 routes',
    ],
    slug: 'v1-5-0',
  },
  {
    version: 'v1.4.0',
    isLatest: false,
    date: 'August 17, 2026',
    title: 'Cryptographic Integrity Seal, DeepSearch Engine & Quick Actions Toolbar',
    summary:
      'Version 1.4.0 elevates Wildfire Docs with a cryptographic attestation engine (SHA-256 Checksums, GPG Signing, Turso Ledger Chain), an upgraded DeepSearch system with dynamic category tabs and scroll containment, a developer quick actions toolbar (Share, Copy Markdown, A4 Spec Export), and dual-theme print architecture.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: '9d8293e',
      commitUrl: 'https://github.com/iannC69/wf-docscore/commit/9d8293e',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v1.4.0',
    },
    changes: [
      {
        type: 'feature',
        title: 'Fortress Cryptographic Integrity Seal & GPG Attestation',
        description:
          'Real-time SHA-256 checksum generation for Markdown content, verified ED25519 GPG signature proof by iannC, and Turso SQLite chained audit ledger attestation with 1-click CLI verification.',
        badge: 'Security Core',
      },
      {
        type: 'feature',
        title: 'Dynamic DeepSearch Engine with Scroll Lock',
        description:
          'Recursive indexing across build and dev environments, background scroll lock with overscroll containment, dynamic category filter tabs, and localStorage recent search history.',
        badge: 'Search',
      },
      {
        type: 'feature',
        title: 'Developer Quick Actions Toolbar',
        description:
          'Native Web Share API & clean link copying, 1-click raw Markdown clipboard export, direct Admin live editor routing, and dual-theme PDF export engine.',
        badge: 'Productivity',
      },
      {
        type: 'improvement',
        title: 'Wildfire Technical Specification A4 Print Engine',
        description:
          'Full-bleed dual-theme (Dark Obsidian / Clean White) print layout with official flame watermarks, cryptographic certification footer, and zero margin offset leaks.',
        badge: 'Print & PDF',
      },
    ],
    highlights: [
      'Cryptographic Document Attestation (Live SHA-256 + GPG)',
      'DeepSearch with Dynamic Category Tabs & Body Scroll Lock',
      'Developer Quick Actions Toolbar (Share, Markdown, PDF, Admin)',
      'Dual-Theme Wildfire Technical Specification Print Template',
    ],
    slug: 'v1-4-0',
  },
  {
    version: 'v1.3.0',
    date: 'August 16, 2026',
    title: 'Ultra-Smooth Table of Contents Engine, Frosted Glass Aesthetic & Layout Architecture',
    summary:
      'Version 1.3.0 introduces a state-of-the-art 120 FPS hardware-accelerated Table of Contents engine with magnetic frosted glass gliding pill, uninterrupted GPU transitions, refined layout mode controls (Standard, Full, Focus), and official WILDFIRE DOCS primary branding.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: '892fa56',
      commitUrl: 'https://github.com/iannC69/wf-docscore/commit/892fa56',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v1.3.0',
    },
    changes: [
      {
        type: 'feature',
        title: 'Deterministic 120 FPS Table of Contents Scroll Spy',
        description:
          'Pre-caches document heading offsets into memory to eliminate forced layout reflows and deliver butter-smooth 120 FPS scrolling.',
      },
      {
        type: 'feature',
        title: 'Magnetic Frosted Glass Gliding Capsule',
        description:
          'Single dedicated frosted capsule with unbroken GPU compositor interpolation and integrated glowing amber vertical indicator pip.',
      },
      {
        type: 'feature',
        title: 'Orderly Typographical Heading Hierarchy',
        description:
          'Replaced messy bracket lines and beaded curves with clean typographical indentation for ##, ###, and #### sections.',
      },
      {
        type: 'feature',
        title: 'Silky Smooth Panel Collapse & Expand Transitions',
        description:
          'Added physics-based cubic-bezier transitions for Sidebar ([) and Table of Contents (]) with floating expand buttons.',
      },
      {
        type: 'improvement',
        title: 'Reordered Layout Mode Switcher',
        description:
          'Reordered header layout controls to Standard -> Full -> Focus for optimal developer reading ergonomics.',
      },
      {
        type: 'improvement',
        title: 'Harmonized Frosted Liquid Glass Tokens',
        description:
          'Synchronized backdrop blur, hairline borders, and specular highlight reflections across Sidebar and Table of Contents.',
      },
      {
        type: 'improvement',
        title: 'Official WILDFIRE DOCS Branding & Subtle Engine Watermark',
        description:
          'Prominently displays WILDFIRE DOCS in top navbar header while maintaining WF-DOCSCORE engine watermark in footer and status dock.',
      },
      {
        type: 'fix',
        title: 'Next.js Scroll Warning & SVG Path Syntax Fixes',
        description:
          'Resolved data-scroll-behavior Next.js console warning and recalculated cubic bezier coordinate pairs in liquid effects.',
      },
    ],
    highlights: [
      'Ultra-Smooth 120 FPS Table of Contents with magnetic frosted glass sliding capsule',
      'Silky smooth collapse / expand panel transitions with floating toggle controls',
      'Synchronized frosted glass aesthetic across Sidebar and Navigation components',
      'Reordered header layout switcher to Standard -> Full -> Focus',
      'Full release packaging for v1.3.0 with live Git commit tracking',
    ],
    slug: 'v1-3-0',
  },
  {
    version: 'v1.2.0',
    isLatest: false,
    date: 'August 16, 2026',
    title: 'Mobile & Tablet Optimization, Liquid Glass Header & Official Logo',
    summary:
      'A major UX evolution bringing 100% mobile and tablet responsive layouts, an in-page mobile Table of Contents accordion, official brand logo integration, and refined liquid glass headers.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: 'e739c21',
      commitUrl: 'https://github.com/iannC69/wf-docscore/commit/e739c21',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v1.2.0',
    },
    changes: [
      {
        type: 'feature',
        title: 'In-Page Mobile Table of Contents Accordion',
        description:
          'Automatically collapses desktop right sidebar on <= 1200px screens into a sleek frosted dropdown that smoothly scrolls to sections.',
      },
      {
        type: 'feature',
        title: 'Official Brand Logo & Tab Favicon Integration',
        description:
          'Configured official logo.png across browser tabs, favicons, Apple touch icons, and fixed navbar.',
      },
      {
        type: 'improvement',
        title: '100% Touch-Optimized Slide-Out Drawer',
        description:
          'Mobile sidebar now features 38px finger-friendly tap targets with automatic drawer closure on link navigation.',
      },
      {
        type: 'improvement',
        title: 'Refined Liquid Glass Header & Search Pill',
        description:
          'Added ember hover elevation, version badge tags, and mobile search button in the top navbar.',
      },
    ],
    highlights: [
      'Responsive 1/2/3 column layout switching for cards and grids',
      'Dynamic browser tab titles per documentation sub-page',
      'Zero TypeScript compilation warnings with Turbopack engine',
    ],
    slug: 'v1-2-0',
  },
  {
    version: 'v1.1.0',
    isLatest: false,
    date: 'August 15, 2026',
    title: 'Multi-Level Collapsible Navigation & Pinned Sidebar Dock',
    summary:
      'Introduced recursive collapsible sub-sections, comprehensive 6-part Installation guide, pinned 3-tier sidebar architecture, and bottom fade-down scroll effects.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: '3cbb240',
      commitUrl: 'https://github.com/iannC69/wf-docscore/commit/3cbb240',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v1.1.0',
    },
    changes: [
      {
        type: 'feature',
        title: 'Multi-Level Collapsible Tree Navigation',
        description:
          'Added interactive collapsible group headers and sub-page rows with rotating chevron indicators and persistent active states.',
      },
      {
        type: 'feature',
        title: 'Pinned 3-Tier Sidebar Architecture',
        description:
          'Production Edge card, system status indicator, and Molten Lava Wave Tank are now permanently pinned to the bottom dock.',
      },
      {
        type: 'improvement',
        title: 'Fade-Down Smooth Scroll Mask',
        description:
          'Long navigation lists cleanly dissolve behind the bottom dock with a 36px gradient overlay.',
      },
      {
        type: 'improvement',
        title: 'Comprehensive 6-Part Installation Sub-Guides',
        description:
          'Added Overview, Prerequisites, Quickstart, CLI Tooling, Docker Deployment, and Troubleshooting guides.',
      },
    ],
    highlights: [
      'Dynamic route-specific category pills with semantic icon colors',
      'Auto-expanding active parent directories on page load',
    ],
    slug: 'v1-1-0',
  },
  {
    version: 'v1.0.0',
    isLatest: false,
    date: 'August 14, 2026',
    title: 'Initial Production Release: Next-Gen Docs Platform',
    summary:
      'First official release of Wildfire Docs featuring Next.js 16 App Router, MDX rendering engine, live Git metadata sync, and tri-mode responsive layout system.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: 'f2bfbdf',
      commitUrl: 'https://github.com/iannC69/wf-docscore/commit/f2bfbdf',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v1.0.0',
    },
    changes: [
      {
        type: 'feature',
        title: 'Tri-Mode Responsive Layout (Standard, Focus, Full)',
        description:
          'Customizable reading modes with keyboard shortcuts ([ to toggle Left Sidebar, ] to toggle Table of Contents).',
      },
      {
        type: 'feature',
        title: 'Live Git Metadata Synchronization',
        description:
          'Direct integration with Git commits displaying author avatar, commit hash chips, and 1-click GitHub Edit Page button.',
      },
      {
        type: 'feature',
        title: 'CmdK Raycast-Style Search Modal',
        description:
          'Fast fuzzy search over all documentation headings and body content with keyboard shortcut (⌘K / Ctrl+K).',
      },
      {
        type: 'feature',
        title: 'Liquid Glass & Molten Ember Theme',
        description:
          'Frosted glass aesthetic with seamless Molten Lava wave animation and dynamic dark/light themes.',
      },
    ],
    highlights: [
      'Interactive MDX components: Callouts, Tabs, Steps, CodeBlocks with copy',
      'Dynamic Recently Updated cards on the documentation hub',
      'Zero-runtime CSS variables design system with high performance',
    ],
    slug: 'v1-0-0',
  },
  {
    version: 'v0.9.0',
    isLatest: false,
    date: 'August 10, 2026',
    title: 'Alpha Engine Prototype & Core Architecture',
    summary:
      'Proof of concept exploring Turbopack-powered SSG document generation, frontmatter metadata parsing, and syntax highlighting.',
    author: {
      name: 'iannC69',
      username: 'iannC69',
      avatar: 'https://github.com/iannC69.png',
    },
    git: {
      commitHash: '0a1b2c3',
      commitUrl: 'https://github.com/iannC69/wf-docscore',
      tagUrl: 'https://github.com/iannC69/wf-docscore/releases/tag/v0.9.0',
    },
    changes: [
      {
        type: 'feature',
        title: 'Core MDX Parser & Unified Pipeline',
        description: 'Implemented remark-gfm, rehype-slug, and shiki syntax highlighting engine.',
      },
      {
        type: 'improvement',
        title: 'Static Site Generation (SSG) with generateStaticParams',
        description:
          'Pre-rendered all documentation routes at build time for sub-millisecond response times.',
      },
    ],
    slug: 'v0-9-0',
  },
];
