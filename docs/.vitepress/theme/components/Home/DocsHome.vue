<script setup lang="ts">
import { Icon } from '@iconify/vue';
import RecentlyUpdatedSection from '../Docs/RecentlyUpdatedSection.vue';
</script>
<template>
  <div class="docs-home-wrapper">
    <main class="docs-home" id="main-content">
      <section class="docs-home-hero">
        <div class="docs-home-badge">
          <span class="docs-badge-dot" aria-hidden="true" />
          <span>Wildfire Documentation Engine v1.8.5</span>
        </div>
        <h1 class="docs-home-title">Wildfire Documentation Hub</h1>
        <p class="docs-home-desc">
          Ghiduri complete, regulamente oficiale, economie in-game, sisteme de joc și informații
          despre gradele VIP pe serverele CS2 Wildfire.ro.
        </p>

        <div class="docs-home-search-hint">
          <div class="search-hint-left">
            <Icon icon="lucide:search" width="15" class="search-hint-icon" aria-hidden="true" />
            <span>Apasă <kbd>Ctrl K</kbd> oriunde pentru căutare instantanee în documente</span>
          </div>
          <a href="/docs/informatii/getting-started" class="docs-hero-btn">
            <span>Ghid de Început</span>
            <Icon icon="lucide:arrow-right" width="14" aria-hidden="true" />
          </a>
        </div>
      </section>

      <RecentlyUpdatedSection />

      <section class="docs-home-section">
        <div class="section-header">
          <h2 class="docs-home-section-title">Secțiuni Principale</h2>
          <span class="section-sub">Explorează documentația oficială a comunității</span>
        </div>

        <div class="home-cards-grid">
          <a href="/docs/informatii/about" class="home-card">
            <div class="home-card-header">
              <div class="home-card-icon-wrap home-card-icon--orange">
                <Icon icon="lucide:flame" width="18" aria-hidden="true" />
              </div>
              <span class="home-card-tag">Ghiduri</span>
              <Icon
                icon="lucide:arrow-right"
                width="15"
                class="home-card-arrow"
                aria-hidden="true"
              />
            </div>
            <h3 class="home-card-title">Informații &amp; Ghiduri</h3>
            <p class="home-card-desc">
              Despre comunitate, verificare cont Steam cu Discord și răspunsuri la întrebări
              frecvente.
            </p>
          </a>

          <a href="/docs/informatii/regulamente/regulament-go" class="home-card">
            <div class="home-card-header">
              <div class="home-card-icon-wrap home-card-icon--blue">
                <Icon icon="lucide:gamepad-2" width="18" aria-hidden="true" />
              </div>
              <span class="home-card-tag">Oficial</span>
              <Icon
                icon="lucide:arrow-right"
                width="15"
                class="home-card-arrow"
                aria-hidden="true"
              />
            </div>
            <h3 class="home-card-title">Regulamente Server</h3>
            <p class="home-card-desc">
              Regulamentul oficial pentru jucători, ghidul administrativ pentru STAFF și regulile
              deținătorilor VIP.
            </p>
          </a>

          <a href="/docs/systems/skins" class="home-card">
            <div class="home-card-header">
              <div class="home-card-icon-wrap home-card-icon--red">
                <Icon icon="lucide:swords" width="18" aria-hidden="true" />
              </div>
              <span class="home-card-tag">CS2 !ws</span>
              <Icon
                icon="lucide:arrow-right"
                width="15"
                class="home-card-arrow"
                aria-hidden="true"
              />
            </div>
            <h3 class="home-card-title">Weapon Skins (!ws)</h3>
            <p class="home-card-desc">
              Sistemul complet de arme, cuțite, mănuși, agenți și deschidere de cutii interactive.
            </p>
          </a>

          <a href="/docs/systems/gambling/roulette" class="home-card">
            <div class="home-card-header">
              <div class="home-card-icon-wrap home-card-icon--purple">
                <Icon icon="lucide:clover" width="18" aria-hidden="true" />
              </div>
              <span class="home-card-tag">Gambling</span>
              <Icon
                icon="lucide:arrow-right"
                width="15"
                class="home-card-arrow"
                aria-hidden="true"
              />
            </div>
            <h3 class="home-card-title">Sisteme de Gambling</h3>
            <p class="home-card-desc">
              Jocuri de noroc in-game: Ruletă, Slots (aparate) și Dices (barbut) cu credite și
              Phoenix Coins.
            </p>
          </a>

          <a href="/docs/systems/shop/chat-tags" class="home-card">
            <div class="home-card-header">
              <div class="home-card-icon-wrap home-card-icon--teal">
                <Icon icon="lucide:shopping-cart" width="18" aria-hidden="true" />
              </div>
              <span class="home-card-tag">In-Game</span>
              <Icon
                icon="lucide:arrow-right"
                width="15"
                class="home-card-arrow"
                aria-hidden="true"
              />
            </div>
            <h3 class="home-card-title">In-Game Shop (!shop)</h3>
            <p class="home-card-desc">
              Personalizări de profil și chat: Chat Tags, culori de nume, fumuri colorate și weapon
              tracers.
            </p>
          </a>

          <a href="/docs/market/vip/vip-overview" class="home-card">
            <div class="home-card-header">
              <div class="home-card-icon-wrap home-card-icon--yellow">
                <Icon icon="lucide:crown" width="18" aria-hidden="true" />
              </div>
              <span class="home-card-tag">VIP &amp; Shop</span>
              <Icon
                icon="lucide:arrow-right"
                width="15"
                class="home-card-arrow"
                aria-hidden="true"
              />
            </div>
            <h3 class="home-card-title">Grade VIP &amp; Market</h3>
            <p class="home-card-desc">
              Tabelul comparativ complet al gradelor VIP (Rebirth, Immortal, Mythic), Custom MVP și
              Entry Songs.
            </p>
          </a>
        </div>
      </section>

      <section class="docs-home-section">
        <div class="section-header">
          <h2 class="docs-home-section-title">Economie &amp; Utilități</h2>
          <span class="section-sub">Sisteme native dezvoltate pentru serverele Wildfire</span>
        </div>

        <div class="home-features-list">
          <div class="feature-item">
            <div class="feature-item-icon">
              <Icon icon="lucide:coins" width="16" aria-hidden="true" />
            </div>
            <div class="feature-item-content">
              <h3 class="feature-item-title">Economie Dublă (Credits &amp; Phoenix Coins)</h3>
              <p class="feature-item-desc">
                Câștigă credite jucând pe server și acumulează Phoenix Coins din evenimente,
                drop-uri și donații.
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-item-icon">
              <Icon icon="lucide:cpu" width="16" aria-hidden="true" />
            </div>
            <div class="feature-item-content">
              <h3 class="feature-item-title">Moduri &amp; Misiuni Dinamice</h3>
              <p class="feature-item-desc">
                Misiuni zilnice, sistem avansat de rank phases, RTV map chooser și echilibrare
                automată a echipelor.
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-item-icon">
              <Icon icon="lucide:shield" width="16" aria-hidden="true" />
            </div>
            <div class="feature-item-content">
              <h3 class="feature-item-title">Securitate &amp; Atestare Criptografică</h3>
              <p class="feature-item-desc">
                Toate ghidurile și regulamentele sunt verificate prin amprente SHA-256 pentru
                integritate totală.
              </p>
            </div>
          </div>

          <div class="feature-item">
            <div class="feature-item-icon">
              <Icon icon="lucide:book-open" width="16" aria-hidden="true" />
            </div>
            <div class="feature-item-content">
              <h3 class="feature-item-title">Căutare Globală Rapidă (DeepSearch)</h3>
              <p class="feature-item-desc">
                Indexare la publicare a tuturor comenzilor, sistemelor și regulamentelor cu tastă
                rapidă <kbd>Ctrl+K</kbd>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <footer class="docs-home-footer">
        <div class="docs-footer-inner">
          <div class="docs-footer-brand">
            <span class="docs-footer-logo-dot" aria-hidden="true" />
            <span class="docs-footer-title">WILDFIRE DOCS PLATFORM</span>
            <span class="docs-footer-version">v1.8.5</span>
          </div>
          <p class="docs-footer-copyright">
            Next.js 16 Turbopack Architecture • Author
            <a
              href="https://github.com/iannC69"
              target="_blank"
              rel="noopener noreferrer"
              class="docs-footer-author"
              >@iannC69</a
            >
          </p>
        </div>
      </footer>
  
    </main>
  </div>
</template>
