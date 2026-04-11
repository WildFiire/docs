// config.mts
import { defineConfig } from 'vitepress'
import { fileURLToPath } from 'url'
import path from 'path'
import { lastUpdatesPlugin } from './plugins/lastUpdatesPlugin'
import { newPagesPlugin } from './plugins/newPagesPlugin'
import { commitCache } from './plugins/commitCache'

const __vitepressDir = fileURLToPath(new URL('.', import.meta.url))
const docsDir = path.resolve(__vitepressDir, '..')
const repoRoot = path.resolve(__vitepressDir, '../..')

export default defineConfig({
  title: "Wildfire.ro Docs",
  description: "Documentația platformei Wildfire - informații, sisteme, resurse și comunitate",

  lang: 'ro-RO',
  cleanUrls: true,


  head: [
    ['link', { rel: 'icon', href: '/icons/wildfire.webp' }],
    ['meta', { name: 'theme-color', content: '#ff4000ff' }],

    // PRECONNECT — must come before any script/link that uses these origins
    ['link', { rel: 'preconnect', href: 'https://fonts.googleapis.com' }],
    ['link', { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }],
    ['link', { rel: 'preconnect', href: 'https://cdn.jsdelivr.net' }],

    // Iconify — async so it doesn't block HTML parsing
    ['script', { src: 'https://cdn.jsdelivr.net/npm/iconify-icon@2.1.0/dist/iconify-icon.min.js', async: '' }],
    // Non-blocking font load — dynamically inserted stylesheets never block rendering
    ['script', {}, `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Inter:wght@300;400;500;600;700&display=swap';document.head.appendChild(l)})()`],

    // PRELOAD PENTRU LCP
    ['link', {
      rel: 'preload',
      as: 'image',
      href: '/icons/wildfire.webp',
      fetchpriority: 'high',
      type: 'image/webp'
    }],

    // VIEWPORT OPTIMIZAT
    ['meta', {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1.0, maximum-scale=5.0'
    }],

    // SEO & SOCIAL SHARING (CS2 COUNTER-STRIKE BRANDING)
    ['meta', { name: 'keywords', content: 'cs2, counter-strike 2, wildfire.ro, wildfire, wiki, wikipedia, docs, tutoriale cs2, servere cs2, wildfire wildfire.ro docs' }],
    ['meta', { property: 'og:title', content: 'Wildfire.ro Docs - CS2 Wikipedia' }],
    ['meta', { property: 'og:description', content: 'Documentația platformei Wildfire - Resurse, sisteme și informații pentru Counter-Strike 2.' }],
    ['meta', { property: 'og:image', content: 'https://docs.wildfire.ro/wallpaper/content.webp' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:url', content: 'https://docs.wildfire.ro/' }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:title', content: 'Wildfire.ro Docs - CS2 Wikipedia' }],
    ['meta', { name: 'twitter:description', content: 'Resurse, sisteme și informații complete pentru Counter-Strike 2 pe Wildfire.ro.' }],
    ['meta', { name: 'twitter:image', content: 'https://docs.wildfire.ro/wallpaper/content.webp' }],
    ['meta', { name: 'twitter:image', content: 'https://docs.wildfire.ro/wallpaper/content.webp' }],

    // SCRIPT PENTRU VERSIUNE
    ['script', {}, `
      window.wikiVersion = '3.0.0';
    `],

    // CSS PENTRU STILIZARE ICONITE SI VERSIUNE
    ['style', {}, `
      .nav-icon {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        width: 16px;
        height: 16px;
        position: relative;
        top: -1px;
      }
      
      img.nav-icon {
        filter: brightness(0.9);
        transition: filter 0.2s;
      }
      
      img.nav-icon:hover {
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
        background: rgba(255, 69, 0, 0.08);
        border: 1px solid rgba(255, 69, 0, 0.3);
        border-radius: 6px;
        font-weight: 600;
        font-size: 10px;
        color: #ff5c1a;
        margin-left: 0.5rem;
        vertical-align: middle;
        transition: all 0.2s ease;
      }
      
      .version-tag:hover {
        background: #ff4500;
        border-color: #ff4500;
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
        text: '<iconify-icon icon="solar:home-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Acasă',
        link: '/'
      },
      {
        text: '<iconify-icon icon="solar:fire-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Informații',
        link: '/informatii/about'
      },
      {
        text: '<iconify-icon icon="solar:question-circle-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> FAQ',
        link: '/informatii/faq'
      }, {
        text: '<iconify-icon icon="solar:chart-square-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Dashboard',
        link: '/panel'
      },
      {
        text: '<iconify-icon icon="solar:users-group-two-rounded-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Echipa',
        link: '/team'
      },
    ],

    sidebar: [
      // SECȚIUNEA INFORMAȚII
      {
        text: '<iconify-icon icon="solar:fire-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Informații',
        collapsed: false,
        items: [
          { text: '<iconify-icon icon="lucide-star" class="nav-icon" width="16" height="16"></iconify-icon> Despre Wildfire', link: '/informatii/about' },
          { text: '<iconify-icon icon="solar:question-circle-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Întrebări frecvente', link: '/informatii/faq' },

          // REGULAMENTE
          {
            text: '<iconify-icon icon="solar:document-text-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Regulament',
            collapsed: true,
            items: [
              {
                text: '<iconify-icon icon="solar:gamepad-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Regulament GO',
                collapsed: true,
                items: [
                  { text: '<iconify-icon icon="solar:user-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Regulament Jucatori', link: '/informatii/regulamente/go/regulament-go' },
                  { text: '<iconify-icon icon="solar:shield-user-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Regulament STAFF', link: '/informatii/regulamente/go/regulament-staff-go' },
                  { text: '<iconify-icon icon="solar:crown-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Regulament VIP', link: '/informatii/regulamente/go/regulament-vip-go' }
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
        text: '<iconify-icon icon="solar:dollar-minimalistic-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Currency',
        collapsed: false,
        items: [
          { text: '<iconify-icon icon="solar:fire-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Phoenix Coins', link: '/currency/fire-coins' },
          // { text: '<img src="/icons/credits.svg" class="nav-icon" width="16" height="16" alt=""> Credits', link: '/currency/credits' },
        ]
      },

      // SECȚIUNEA SYSTEMS
      {
        text: '<iconify-icon icon="solar:cpu-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Systems',
        collapsed: false,
        items: [
          // SUBSECȚIUNEA SKINS
          {
            text: '<iconify-icon icon="lucide-swords" class="nav-icon" width="16" height="16"></iconify-icon> WeaponSkins',
            collapsed: true,
            items: [
              { text: '<iconify-icon icon="solar:info-circle-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Informatii', link: '/systems/skins/informatiiws' },
              { text: '<iconify-icon icon="solar:box-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Cases', link: '/systems/skins/cases' },
              { text: '<iconify-icon icon="solar:hand-shake-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Gloves', link: '/systems/skins/gloves' },
              { text: '<iconify-icon icon="solar:user-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Agents', link: '/systems/skins/agents' },
              { text: '<iconify-icon icon="lucide-sparkles" class="nav-icon" width="16" height="16"></iconify-icon> Knife Skins', link: '/systems/skins/knives' },
            ]
          },

          // SUBSECȚIUNEA GAMBLING
          {
            text: '<iconify-icon icon="lucide-clover" class="nav-icon" width="16" height="16"></iconify-icon> Gambling',
            collapsed: true,
            items: [
              { text: '<iconify-icon icon="solar:refresh-circle-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Roulette', link: '/systems/gambling/roulette' },
              { text: '<iconify-icon icon="solar:hand-money-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Slots', link: '/systems/gambling/slots' },
              { text: '<iconify-icon icon="solar:card-2-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Dices', link: '/systems/gambling/dices' },
            ]
          },

          // SUBSECȚIUNEA IN-GAME SHOP
          {
            text: '<iconify-icon icon="solar:shop-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> In-Game Shop (Credite)',
            collapsed: true,
            items: [
              { text: '<iconify-icon icon="solar:stars-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Trail-uri', link: '/systems/shop/trails' },
              { text: '<iconify-icon icon="solar:magic-stick-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Effecte vizuale', link: '/systems/shop/effects' },
              { text: '<iconify-icon icon="solar:pin-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Wildfire Pins & Badges', link: '/systems/shop/pins' },
              { text: '<iconify-icon icon="solar:chat-round-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Chat & Tag-uri', link: '/systems/shop/chat-tags' },
              { text: '<iconify-icon icon="solar:airbuds-case-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Spray-uri', link: '/systems/shop/sprays' },
            ]
          },

          // SUBSECȚIUNEA OTHER SYSTEMS
          {
            text: '<iconify-icon icon="solar:layers-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Other Systems',
            collapsed: true,
            items: [
              { text: '<iconify-icon icon="solar:target-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Hit Effect', link: '/systems/other/hit-effect' },
              { text: '<iconify-icon icon="solar:music-note-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Music Kits', link: '/systems/other/music-kits' },
              { text: '<iconify-icon icon="solar:crown-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Gold Member', link: '/systems/other/gold-member' },
              { text: '<iconify-icon icon="solar:map-point-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Map Chooser / RTV', link: '/systems/other/map-chooser' },
              { text: '<iconify-icon icon="solar:chart-2-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Rank Phases (Grind)', link: '/systems/other/rank-phases' },
              { text: '<iconify-icon icon="lucide-user" class="nav-icon" width="16" height="16"></iconify-icon> AFK Manager', link: '/systems/other/afk-manager' },
              { text: '<iconify-icon icon="solar:users-group-two-rounded-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Teambalance', link: '/systems/other/teambalance' },
              { text: '<iconify-icon icon="solar:filter-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Chat Filter', link: '/systems/other/chat-filter' },
            ]
          },
        ]
      },

      // SECȚIUNEA MARKET (DONATIONS)
      {
        text: '<iconify-icon icon="solar:shop-2-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Market (Donations)',
        collapsed: false,
        items: [
          // SUBSECȚIUNEA PREMIUM SHOP
          {
            text: '<iconify-icon icon="solar:star-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Premium Shop',
            collapsed: true,
            items: [
              { text: '<iconify-icon icon="solar:medal-ribbon-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Custom MVP', link: '/market/premium-shop/mvp' },
              { text: '<iconify-icon icon="solar:shield-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Custom Badge / Pin', link: '/market/premium-shop/custom-badge' },
              { text: '<iconify-icon icon="lucide-door-open" class="nav-icon" width="16" height="16"></iconify-icon> Entry Sounds', link: '/market/premium-shop/entrysounds' },
              { text: '<iconify-icon icon="solar:volume-loud-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Sank Sounds', link: '/market/premium-shop/sanks' },
            ]
          },

          // SUBSECȚIUNEA FIRE COINS PACKS
          {
            text: '<iconify-icon icon="solar:fire-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Fire Coins Packs',
            collapsed: true,
            items: [
              { text: '<iconify-icon icon="solar:box-minimalistic-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Pachete', link: '/market/firecoins/pachete' },
            ]
          },

          // SUBSECȚIUNEA CREDITS PACKS
          {
            text: '<iconify-icon icon="solar:wallet-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Credits Packs',
            collapsed: true,
            items: [
              { text: '<iconify-icon icon="solar:wallet-money-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Pachete de Credite', link: '/market/credits/pachete_credite' },
            ]
          },

          // SUBSECȚIUNEA VIP TIERS
          {
            text: '<iconify-icon icon="solar:crown-star-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> VIP Tiers',
            collapsed: true,
            items: [
              { text: '<iconify-icon icon="solar:crown-star-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> VIP 1', link: '/market/vip/1' },
              { text: '<iconify-icon icon="solar:crown-star-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> VIP 2', link: '/market/vip/2' },
              { text: '<iconify-icon icon="solar:crown-star-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> VIP 3', link: '/market/vip/3' },
              { text: '<iconify-icon icon="solar:crown-star-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> VIP 4', link: '/market/vip/4' },
              { text: '<iconify-icon icon="solar:crown-star-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> VIP 5', link: '/market/vip/5' },
            ]
          },

          // METODE DE PLATĂ
          {
            text: '<iconify-icon icon="solar:card-recive-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Metode de plată',
            link: '/market/payment-methods'
          },
        ]
      },

      // SECȚIUNEA "RECENT GUI" CU VERSION TAG (ACELAȘI DESIGN CA ÎN FOOTER)
      {
        text: '<iconify-icon icon="solar:code-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> 3.0.0 <span class="version-tag">v3.0.0</span>',
        collapsed: true,
        items: [
          { text: '<iconify-icon icon="solar:global-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Actualizari', link: '/updates_wiki/updateswiki' },
          { text: '<iconify-icon icon="solar:hand-heart-bold-duotone" class="nav-icon" width="16" height="16"></iconify-icon> Cum poti contribui?', link: '/updates_wiki/contribute' }
        ]
      }
    ],

    editLink: {
      pattern: 'https://github.com/Wildfiire/docs/edit/main/docs/:path',
      text: 'Editează această pagină pe GitHub'
    },

    // SOCIAL LINKS
    socialLinks: [
      {
        icon: {
          svg: '<svg viewBox="-1.5 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="m13.93 11.4c-.054.633-.582 1.127-1.224 1.127-.678 0-1.229-.55-1.229-1.229s.55-1.229 1.228-1.229c.683.029 1.225.59 1.225 1.277 0 .019 0 .037-.001.056v-.003zm-5.604-1.33c-.688.061-1.223.634-1.223 1.332s.535 1.271 1.218 1.332h.005c.683-.029 1.225-.59 1.225-1.277 0-.019 0-.037-.001-.056v.003c.001-.02.002-.043.002-.067 0-.685-.541-1.243-1.219-1.269h-.002zm12.674-7.598v21.528c-3.023-2.672-2.057-1.787-5.568-5.052l.636 2.22h-13.609c-1.359-.004-2.46-1.106-2.46-2.466 0-.002 0-.004 0-.006v-16.224c0-.002 0-.004 0-.006 0-1.36 1.101-2.462 2.459-2.466h16.081c1.359.004 2.46 1.106 2.46 2.466v.006zm-3.42 11.376c-.042-2.559-.676-4.96-1.77-7.086l.042.09c-.924-.731-2.088-1.195-3.358-1.259l-.014-.001-.168.192c1.15.312 2.15.837 3.002 1.535l-.014-.011c-1.399-.769-3.066-1.222-4.839-1.222-1.493 0-2.911.321-4.189.898l.064-.026c-.444.204-.708.35-.708.35.884-.722 1.942-1.266 3.1-1.56l.056-.012-.12-.144c-1.284.065-2.448.529-3.384 1.269l.012-.009c-1.052 2.036-1.686 4.437-1.728 6.982v.014c.799 1.111 2.088 1.826 3.543 1.826.041 0 .082-.001.123-.002h-.006s.444-.54.804-.996c-.866-.223-1.592-.727-2.093-1.406l-.007-.01c.176.124.468.284.49.3 1.209.672 2.652 1.067 4.188 1.067 1.191 0 2.326-.238 3.36-.668l-.058.021c.528-.202.982-.44 1.404-.723l-.025.016c-.526.703-1.277 1.212-2.144 1.423l-.026.005c.36.456.792.972.792.972.033.001.072.001.111.001 1.461 0 2.755-.714 3.552-1.813l.009-.013z"/></svg>'
        },
        link: 'https://discord.gg/Knu76DhE9h',
        ariaLabel: 'Discord'
      },
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">  <path d="M3.51211712,15 L8.17190229,15 C8.05949197,14.0523506 8,13.0444554 8,12 C8,10.9555446 8.05949197,9.94764942 8.17190229,9 L3.51211712,9 C3.18046266,9.93833678 3,10.9480937 3,12 C3,13.0519063 3.18046266,14.0616632 3.51211712,15 L3.51211712,15 Z M3.93551965,16 C5.12590433,18.3953444 7.35207678,20.1851177 10.0280093,20.783292 C9.24889451,19.7227751 8.65216136,18.0371362 8.31375067,16 L3.93551965,16 L3.93551965,16 Z M20.4878829,15 C20.8195373,14.0616632 21,13.0519063 21,12 C21,10.9480937 20.8195373,9.93833678 20.4878829,9 L15.8280977,9 C15.940508,9.94764942 16,10.9555446 16,12 C16,13.0444554 15.940508,14.0523506 15.8280977,15 L20.4878829,15 L20.4878829,15 Z M20.0644804,16 L15.6862493,16 C15.3478386,18.0371362 14.7511055,19.7227751 13.9719907,20.783292 C16.6479232,20.1851177 18.8740957,18.3953444 20.0644804,16 L20.0644804,16 Z M9.18440269,15 L14.8155973,15 C14.9340177,14.0623882 15,13.0528256 15,12 C15,10.9471744 14.9340177,9.93761183 14.8155973,9 L9.18440269,9 C9.06598229,9.93761183 9,10.9471744 9,12 C9,13.0528256 9.06598229,14.0623882 9.18440269,15 L9.18440269,15 Z M9.3349823,16 C9.85717082,18.9678295 10.9180729,21 12,21 C13.0819271,21 14.1428292,18.9678295 14.6650177,16 L9.3349823,16 L9.3349823,16 Z M3.93551965,8 L8.31375067,8 C8.65216136,5.96286383 9.24889451,4.27722486 10.0280093,3.21670804 C7.35207678,3.81488234 5.12590433,5.60465556 3.93551965,8 L3.93551965,8 Z M20.0644804,8 C18.8740957,5.60465556 16.6479232,3.81488234 13.9719907,3.21670804 C14.7511055,4.27722486 15.3478386,5.96286383 15.6862493,8 L20.0644804,8 L20.0644804,8 Z M9.3349823,8 L14.6650177,8 C14.1428292,5.03217048 13.0819271,3 12,3 C10.9180729,3 9.85717082,5.03217048 9.3349823,8 L9.3349823,8 Z M12,22 C6.4771525,22 2,17.5228475 2,12 C2,6.4771525 6.4771525,2 12,2 C17.5228475,2 22,6.4771525 22,12 C22,17.5228475 17.5228475,22 12,22 Z"/></svg>'
        },
        link: 'https://www.wildfire.ro',
        ariaLabel: 'Web Site'
      },
      {
        icon: {
          svg: '<svg viewBox="0 0 24 24" role="img" xmlns="http://www.w3.org/2000/svg"><title>TikTok icon</title><path d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/></svg>'
        },
        link: 'https://www.tiktok.com/@wildfire.ro',
        ariaLabel: 'TikTok'
      }
    ],

    // SEARCH
    search: {
      provider: 'local',
      options: {
        detailedView: true,
        miniSearch: {
          options: {
            tokenize: (text: string) => {
              return text
                .toLowerCase()
                .split(/[\s\-_.,;:!?()[\]{}"'`/\\<>]+/)
                .filter((t: string) => t.length > 1)
            }
          },
          searchOptions: {
            fuzzy: 0.2,
            prefix: true,
            combineWith: 'OR',
            boost: { title: 4, text: 2, titles: 1 }
          }
        },
        translations: {
          button: { buttonText: 'Caută', buttonAriaLabel: 'Caută' },
          modal: {
            displayDetails: 'Afișează detalii',
            resetButtonTitle: 'Resetează',
            backButtonTitle: 'Închide',
            noResultsText: 'Nu s-au găsit rezultate pentru',
            footer: {
              selectText: 'selectează',
              navigateText: 'navighează',
              closeText: 'închide'
            }
          }
        }
      }
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

  async transformPageData(pageData, ctx) {
    try {
      const token = process.env.VITE_GITHUB_TOKEN
      if (!token) return

      // Full repo-relative path (e.g. docs/informatii/about.md)
      const repoPath = ('docs/' + pageData.relativePath).replace(/\\/g, '/')

      if (commitCache.has(repoPath)) {
        const login = commitCache.get(repoPath)
        if (login) pageData.frontmatter.gitLastCommitter = login
        return
      }

      // commits?path= resolves through merge commits → returns actual PR author
      const res = await fetch(
        `https://api.github.com/repos/Wildfiire/docs/commits?path=${encodeURIComponent(repoPath)}&per_page=1`,
        { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
      )
      if (!res.ok) { commitCache.set(repoPath, null); return }

      const data = await res.json() as any[]
      const commit = data[0]
      if (!commit) { commitCache.set(repoPath, null); return }

      // author.login = GitHub account of the person who wrote the content
      // If merge commit hides author, fall back to checking associated PR
      let login: string | null = commit.author?.login || null

      if (!login) {
        const prRes = await fetch(
          `https://api.github.com/repos/Wildfiire/docs/commits/${commit.sha}/pulls`,
          { headers: { Authorization: `token ${token}`, Accept: 'application/vnd.github.v3+json' } }
        )
        if (prRes.ok) {
          const prs = await prRes.json() as any[]
          login = prs[0]?.user?.login || null
        }
      }

      commitCache.set(repoPath, login)
      if (login) pageData.frontmatter.gitLastCommitter = login
    } catch { }
  },

  markdown: {
    lineNumbers: true,
    image: {
      lazyLoading: true
    }
  },

  vite: {
    plugins: [lastUpdatesPlugin(docsDir, repoRoot), newPagesPlugin(docsDir, repoRoot)],

    build: {
      cssCodeSplit: false,
      target: 'es2018',
      minify: 'esbuild',
      cssMinify: true,
      sourcemap: false
    },
    server: {
      fs: {
        strict: false
      },
      proxy: {
        '/api/github/device-code': {
          target: 'https://github.com',
          changeOrigin: true,
          rewrite: () => '/login/device/code'
        },
        '/api/github/token': {
          target: 'https://github.com',
          changeOrigin: true,
          rewrite: () => '/login/oauth/access_token'
        }
      }
    },
    ssr: {
      noExternal: ['vue', 'chart.js', 'lodash']
    }
  }
})