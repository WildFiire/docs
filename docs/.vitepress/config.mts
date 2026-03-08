// config.mts
import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Wildfire.ro Docs",
  description: "Documentația platformei Wildfire - informații, sisteme, resurse și comunitate",
  
  lang: 'ro-RO',
  cleanUrls: true,
  
  
  head: [
    ['link', { rel: 'icon', href: '/icons/wildfire.webp' }],
    ['meta', { name: 'theme-color', content: '#22c55e' }],
    
    // PRELOAD PENTRU LCP
    ['link', { 
      rel: 'preload', 
      as: 'image', 
      href: '/icons/wildfire.webp', 
      fetchpriority: 'high',
      type: 'image/webp'
    }],
    
    // PRELOAD PENTRU BACKGROUND
    ['link', { 
      rel: 'preload', 
      as: 'image', 
      href: '/wallpaper/poza102.webp', 
      fetchpriority: 'low'
    }],
    
    // META PENTRU CACHE
    ['meta', { 
      'http-equiv': 'Cache-Control', 
      content: 'public, max-age=31536000, immutable' 
    }],
    
    // VIEWPORT OPTIMIZAT
    ['meta', { 
      name: 'viewport', 
      content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0' 
    }],
    
    // SCRIPT PENTRU VERSIUNE
    ['script', {}, `
      window.wikiVersion = '3.0.0';
    `],
    
    // CSS PENTRU STILIZARE ICONITE SI VERSIUNE
    ['style', {}, `
      .nav-icon {
        vertical-align: middle;
        margin-right: 8px;
        width: 16px;
        height: 16px;
        filter: brightness(0.9);
        transition: filter 0.2s;
      }
      
      .nav-icon:hover {
        filter: brightness(1.2);
      }
      
      .version-badge {
        display: inline-block;
        padding: 2px 8px;
        background-color: var(--vp-c-bg-soft);
        border: 1px solid var(--vp-c-divider);
        border-radius: 20px;
        font-weight: 600;
        font-size: 10px;
        color: var(--vp-c-text-1);
        margin-left: 1rem;
      }
      
      .version-tag {
        display: inline-block;
        padding: 2px 8px;
        background: rgba(34, 197, 94, 0.1);
        border: 1px solid #22c55e;
        border-radius: 20px;
        font-weight: 600;
        font-size: 10px;
        color: #22c55e;
        margin-left: 0.5rem;
        vertical-align: middle;
        transition: all 0.2s ease;
      }
      
      .version-tag:hover {
        background: #22c55e;
        color: white;
      }
      
      .navbar-hint {
        padding: 0.75rem 1rem;
        background-color: var(--vp-c-bg-soft);
        border-radius: 8px;
        margin: 1rem;
        font-size: 0.85rem;
        border-left: 3px solid #22c55e;
      }
      
      .navbar-hint strong {
        color: #22c55e;
        display: block;
        margin-bottom: 0.25rem;
      }
      
      .navbar-hint p {
        margin: 0;
        color: var(--vp-c-text-2);
      }
      
      .navbar-hint .hover-hint {
        font-size: 0.75rem;
        color: var(--vp-c-text-3);
        font-style: italic;
        margin-top: 0.25rem;
      }
      

      
      .version-container {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border-top: 1px solid var(--vp-c-divider);
        margin-top: 1rem;
      }
      
      .version-label {
        font-weight: 600;
        color: var(--vp-c-text-1);
      }
      
      .version-number {
        color: #22c55e;
        font-weight: 700;
      }
    `]
  ],

  lastUpdated: true,

  themeConfig: {
    logo: {
      src: '/icons/wildfire.webp',
      width: 24,
      height: 24,
      alt: 'Wildfire Logo'
    },
    
    siteTitle: 'Wildfire.ro Docs',
    
    nav: [
      { 
        text: '<img src="/icons/acasa.svg" class="nav-icon" width="16" height="16" alt=""> Acasă', 
        link: '/' 
      },
      { 
        text: '<img src="/icons/wildfire.webp" class="nav-icon" width="16" height="16" alt=""> Informații', 
        link: '/informatii/about' 
      },
      { 
        text: '<img src="/icons/faq.svg" class="nav-icon" width="16" height="16" alt=""> FAQ', 
        link: '/informatii/faq' 
      },      { 
        text: '<img src="/icons/github.svg" class="nav-icon" width="16" height="16" alt=""> Dashboard', 
        link: '/panel/panel' 
      },
    ],

    sidebar: [
      // SECȚIUNEA INFORMAȚII
{
  text: '<img src="/icons/wildfire.webp" class="nav-icon" width="16" height="16" alt=""> Informații',
  collapsed: false,
  items: [
    { text: '<img src="/icons/despre.png" class="nav-icon" width="16" height="16" alt=""> Despre Wildfire', link: '/informatii/about' },
    { text: '<img src="/icons/faq.svg" class="nav-icon" width="16" height="16" alt=""> Întrebări frecvente', link: '/informatii/faq' },
    
    // REGULAMENTE
    { 
      text: '<img src="/icons/regulament.svg" class="nav-icon" width="16" height="16" alt=""> Regulament',
      collapsed: true,
      items: [
        {
          text: 'Regulament GO',
          collapsed: true,
          items: [
            { text: 'Regulament Jucatori', link: '/informatii/regulamente/go/regulament-go' },
            { text: 'Regulament STAFF', link: '/informatii/regulamente/go/regulament-staff-go' },
            { text: 'Regulament VIP', link: '/informatii/regulamente/go/regulament-vip-go' }
          ]
        },
// {
//           text: 'Regulament AWP',
//           collapsed: true,
//           items: [
//             { text: 'Regulament Jucatori', link: '/informatii/regulamente/awp/regulament-awp' },
//             { text: 'Regulament STAFF', link: '/informatii/regulamente/awp/regulament-staff-awp' },
//             { text: 'Regulament VIP', link: '/informatii/regulamente/awp/regulament-vip-awp' }
//           ]
//         },
        // {
        //   text: 'Regulament ARENA',
        //   collapsed: true,
        //   items: [
        //     { text: 'Regulament Jucatori', link: '/informatii/regulamente/arena/regulament-arena' },
        //     { text: 'Regulament STAFF', link: '/informatii/regulamente/arena/regulament-staff-arena' },
        //     { text: 'Regulament VIP', link: '/informatii/regulamente/arena/regulament-vip-arena' }
        //   ]
        // },
      ]
    }
  ]
},
      
      // SECȚIUNEA CURRENCY
      {
        text: '<img src="/icons/currency.svg" class="nav-icon" width="16" height="16" alt=""> Currency',
        collapsed: false,
        items: [
          { text: '<img src="/icons/firecoin.svg" class="nav-icon" width="16" height="16" alt=""> Fire Coins', link: '/currency/fire-coins' },
          { text: '<img src="/icons/credits.svg" class="nav-icon" width="16" height="16" alt=""> Credits', link: '/currency/credits' },
        ]
      },
      
      // SECȚIUNEA SYSTEMS
      {
        text: '<img src="/icons/sisteme.svg" class="nav-icon" width="16" height="16" alt=""> Systems',
        collapsed: false,
        items: [
          // SUBSECȚIUNEA SKINS
          { 
            text: '<img src="/icons/skins.svg" class="nav-icon" width="16" height="16" alt=""> Skins',
            collapsed: true,
            items: [
              { text: '<img src="/icons/cases.svg" class="nav-icon" width="16" height="16" alt=""> Cases', link: '/systems/skins/cases' },
              { text: '<img src="/icons/gloves.svg" class="nav-icon" width="16" height="16" alt=""> Gloves', link: '/systems/skins/gloves' },
              { text: '<img src="/icons/agents.svg" class="nav-icon" width="16" height="16" alt=""> Agents', link: '/systems/skins/agents' },
              { text: '<img src="/icons/knives.svg" class="nav-icon" width="16" height="16" alt=""> Knife Skins', link: '/systems/skins/knives' },
              { text: '<img src="/icons/stickers.svg" class="nav-icon" width="16" height="16" alt=""> Stickers', link: '/systems/skins/stickers' },
            ]
          },
          
          // SUBSECȚIUNEA GAMBLING
          { 
            text: '<img src="/icons/gambling.svg" class="nav-icon" width="16" height="16" alt=""> Gambling',
            collapsed: true,
            items: [
              { text: '<img src="/icons/roulette.svg" class="nav-icon" width="16" height="16" alt=""> Roulette', link: '/systems/gambling/roulette' },
              { text: '<img src="/icons/bet-teams.svg" class="nav-icon" width="16" height="16" alt=""> Bet Teams', link: '/systems/gambling/bet-teams' },
              { text: '<img src="/icons/blackjack.svg" class="nav-icon" width="16" height="16" alt=""> Blackjack', link: '/systems/gambling/blackjack' },
            ]
          },
          
          // SUBSECȚIUNEA IN-GAME SHOP
          { 
            text: '<img src="/icons/shop.svg" class="nav-icon" width="16" height="16" alt=""> In-Game Shop (Credite)',
            collapsed: true,
            items: [
              { text: '<img src="/icons/trails.svg" class="nav-icon" width="16" height="16" alt=""> Trail-uri', link: '/systems/shop/trails' },
              { text: '<img src="/icons/effects.svg" class="nav-icon" width="16" height="16" alt=""> Effecte vizuale', link: '/systems/shop/effects' },
              { text: '<img src="/icons/pins.svg" class="nav-icon" width="16" height="16" alt=""> Wildfire Pins & Badges', link: '/systems/shop/pins' },
              { text: '<img src="/icons/chat.svg" class="nav-icon" width="16" height="16" alt=""> Chat & Tag-uri', link: '/systems/shop/chat-tags' },
              { text: '<img src="/icons/sprays.svg" class="nav-icon" width="16" height="16" alt=""> Spray-uri', link: '/systems/shop/sprays' },
            ]
          },
          
          // SUBSECȚIUNEA OTHER SYSTEMS
          { 
            text: '<img src="/icons/other.svg" class="nav-icon" width="16" height="16" alt=""> Other Systems',
            collapsed: true,
            items: [
              { text: '<img src="/icons/custom-sky.svg" class="nav-icon" width="16" height="16" alt=""> Custom Sky', link: '/systems/other/custom-sky' },
              { text: '<img src="/icons/hit-effect.svg" class="nav-icon" width="16" height="16" alt=""> Hit Effect', link: '/systems/other/hit-effect' },
              { text: '<img src="/icons/music.svg" class="nav-icon" width="16" height="16" alt=""> Music Kits', link: '/systems/other/music-kits' },
              { text: '<img src="/icons/gold-member.svg" class="nav-icon" width="16" height="16" alt=""> Gold Member', link: '/systems/other/gold-member' },
              { text: '<img src="/icons/map-chooser.svg" class="nav-icon" width="16" height="16" alt=""> Map Chooser / RTV', link: '/systems/other/map-chooser' },
              { text: '<img src="/icons/rank-phases.svg" class="nav-icon" width="16" height="16" alt=""> Rank Phases (Grind)', link: '/systems/other/rank-phases' },
              { text: '<img src="/icons/afk.svg" class="nav-icon" width="16" height="16" alt=""> AFK Manager', link: '/systems/other/afk-manager' },
              { text: '<img src="/icons/ad.svg" class="nav-icon" width="16" height="16" alt=""> Advertisement System', link: '/systems/other/advertisement' },
              { text: '<img src="/icons/teambalance.svg" class="nav-icon" width="16" height="16" alt=""> Teambalance', link: '/systems/other/teambalance' },
              { text: '<img src="/icons/chat-filter.svg" class="nav-icon" width="16" height="16" alt=""> Chat Filter', link: '/systems/other/chat-filter' },
              { text: '<img src="/icons/dns.svg" class="nav-icon" width="16" height="16" alt=""> DNS Text HUD', link: '/systems/other/dns-hud' },
              { text: '<img src="/icons/kill-sound.svg" class="nav-icon" width="16" height="16" alt=""> Kill Sound', link: '/systems/other/kill-sound' },
              { text: '<img src="/icons/quests.svg" class="nav-icon" width="16" height="16" alt=""> Quests & Achievements', link: '/systems/other/quests' },
            ]
          },
        ]
      },
      
      // SECȚIUNEA MARKET (DONATIONS)
      {
        text: '<img src="/icons/market.svg" class="nav-icon" width="16" height="16" alt=""> Market (Donations)',
        collapsed: false,
        items: [
          // SUBSECȚIUNEA PREMIUM SHOP
          { 
            text: '<img src="/icons/premium-shop.svg" class="nav-icon" width="16" height="16" alt=""> Premium Shop',
            collapsed: true,
            items: [
              { text: '<img src="/icons/mvp.svg" class="nav-icon" width="16" height="16" alt=""> Custom MVP', link: '/market/premium-shop/mvp' },
              { text: '<img src="/icons/custom-badge.svg" class="nav-icon" width="16" height="16" alt=""> Custom Badge / Pin', link: '/market/premium-shop/custom-badge' },
              { text: '<img src="/icons/entry.svg" class="nav-icon" width="16" height="16" alt=""> Entry Sounds', link: '/market/premium-shop/entrysounds' },
              { text: '<img src="/icons/sank.svg" class="nav-icon" width="16" height="16" alt=""> Sank Sounds', link: '/market/premium-shop/sanks' },
            ]
          },
          
          // SUBSECȚIUNEA FIRE COINS PACKS
          { 
            text: '<img src="/icons/firecoin.svg" class="nav-icon" width="16" height="16" alt=""> Fire Coins Packs',
            collapsed: true,
            items: [
              { text: '<img src="/icons/pack.svg" class="nav-icon" width="16" height="16" alt=""> Pachete', link: '/market/firecoins/pachete' },
            ]
          },
          
          // SUBSECȚIUNEA CREDITS PACKS
          { 
            text: '<img src="/icons/credits-title.svg" class="nav-icon" width="16" height="16" alt=""> Credits Packs',
            collapsed: true,
            items: [
              { text: '<img src="/icons/credits.svg" class="nav-icon" width="16" height="16" alt=""> Pachete de Credite', link: '/market/credits/pachete_credite' },
            ]
          },
          
          // SUBSECȚIUNEA VIP TIERS
          { 
            text: '<img src="/icons/vip.svg" class="nav-icon" width="16" height="16" alt=""> VIP Tiers',
            collapsed: true,
            items: [
              { text: '<img src="/icons/vip.svg" class="nav-icon" width="16" height="16" alt=""> VIP 1', link: '/market/vip/1' },
              { text: '<img src="/icons/vip.svg" class="nav-icon" width="16" height="16" alt=""> VIP 2', link: '/market/vip/2' },
              { text: '<img src="/icons/vip.svg" class="nav-icon" width="16" height="16" alt=""> VIP 3', link: '/market/vip/3' },
              { text: '<img src="/icons/vip.svg" class="nav-icon" width="16" height="16" alt=""> VIP 4', link: '/market/vip/4' },
              { text: '<img src="/icons/vip.svg" class="nav-icon" width="16" height="16" alt=""> VIP 5', link: '/market/vip/5' },
            ]
          },
          
          // METODE DE PLATĂ
          {
            text: '<img src="/icons/payment.svg" class="nav-icon" width="16" height="16" alt=""> Metode de plată',
            link: '/market/payment-methods'
          },
        ]
      },
      
      // SECȚIUNEA "RECENT GUI" CU VERSION TAG (ACELAȘI DESIGN CA ÎN FOOTER)
      {
        text: '<img src="/icons/vsc.svg" class="nav-icon" width="16" height="16" alt=""> 3.0.0 <span class="version-tag">v3.0.0</span>',
        collapsed: true,
        items: [
          { text: '<img src="/icons/web.svg" class="nav-icon" width="16" height="16" alt=""> Actualizari', link: '/updates_wiki/updateswiki' },
          { text: '<img src="/icons/trusted.svg" class="nav-icon" width="16" height="16" alt=""> Cum poti contribui?', link: '/updates_wiki/contribute' }
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/solwolfs2-dot/wiki-wildfire-inc/edit/main/docs/:path',
      text: '✏️ Editează această pagină pe GitHub'
    },

    // SOCIAL LINKS
    socialLinks: [
      { 
        icon: { 
          svg: '<img src="/icons/discord.svg" class="nav-icon" width="20" height="20" alt="Discord">' 
        }, 
        link: 'https://discord.gg/Knu76DhE9h',
        ariaLabel: 'Discord'
      },
      { 
        icon: { 
          svg: '<img src="/icons/web.svg" class="nav-icon" width="20" height="20" alt="Website">' 
        }, 
        link: 'https://www.wildfire.ro',
        ariaLabel: 'Web Site'
      },
      { 
        icon: { 
          svg: '<img src="/icons/tiktok.svg" class="nav-icon" width="20" height="20" alt="TikTok">' 
        }, 
        link: 'https://www.tiktok.com/@wildfire.ro',
        ariaLabel: 'TikTok'
      }
    ],

    // SEARCH
    search: {
      provider: 'local'
    },

    outline: {
      level: [2, 3],
      label: 'Pe această pagină'
    },

    sidebarMenuLabel: 'Meniu',
    returnToTopLabel: 'Înapoi sus',
    darkModeSwitchLabel: 'Mod întunecat',
    lightModeSwitchTitle: 'Comută la modul luminos',
    darkModeSwitchTitle: 'Comută la modul întunecat'
  },

  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true
    }
  },

  vite: {
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue']
          }
        }
      },
      target: 'es2018',
      minify: 'terser',
      cssMinify: true,
      sourcemap: false
    },
    server: {
      fs: {
        strict: false
      }
    },
    ssr: {
      noExternal: ['vue']
    }
  }
})