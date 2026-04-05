---
outline: deep
---

<CaseHeader 
  title="Knives"
  :tags="[
    { text: 'skins', component: 'PageTagPurple' },
    { text: 'knives', component: 'PageTagGreen' },
    { text: 'melee', component: 'PageTagBlue' }
  ]"
  :path="['Home', 'Systems', 'Skins', 'Knives']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="systems-knives"
  badge-text="Knives"
  badge-icon="lucide:sword"
/>

<div class="wf-system">

<!-- INTRO - DESCRIERE CUȚITE -->
<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:sword" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Melee Weapons</span> <span class="wf-system-highlight">Knives System</span>
    <p>Cuțitele sunt iteme cosmetice care înlocuiesc cuțitul default al personajului. Nu oferă niciun avantaj în joc în afara aspectului vizual, dar sunt printre cele mai căutate și valoroase iteme din server.</p>
    <p>Odată câștigate, cuțitele sunt adăugate automat în inventarul tău și pot fi echipate direct din meniul <code>!ws</code> sau de pe site. Fiecare model are animații unice și poate fi combinat cu diferite skin-uri de mănuși.</p>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Cuțitele sunt iteme <span class="wf-system-highlight">cosmetice rare</span> și nu oferă niciun avantaj în joc. Fiecare model are animații unice de inspect și atac.</p>
</div>

### 1.0 INFORMAȚII

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMAȚII</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Totul începe cu o comandă simplă și o interfață intuitivă, controlată complet din <span class="wf-system-highlight">tastatură</span>.</p>
    
  <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!ws</code> în chat pentru a deschide interfața principală a <span class="wf-system-highlight">skin-urilor și cuțitelor</span>.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/knives/gif_knives_1.gif" alt="Knives Menu Navigation - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!ws knives menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:mouse-pointer-click" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Folosește tastele <span class="wf-system-highlight">E</span>, <span class="wf-system-highlight">F</span> și <span class="wf-system-highlight">SHIFT</span> pentru a naviga prin meniul !ws
      </div>
    </div>
    
   <p>Navigarea prin meniul de cuțite se face cu ajutorul tastelor:</p>
    
  <div class="wf-system-key-row">
      <div class="wf-system-key-item"><span class="wf-system-key-button">E</span><span>Tasta <span class="wf-system-highlight">E</span> - <strong>Selectează</strong> cuțitul</span></div>
      <div class="wf-system-key-item"><span class="wf-system-key-button">F</span><span>Tasta <span class="wf-system-highlight">F</span> - <strong>Navighează în sus</strong> prin categorii</span></div>
      <div class="wf-system-key-item"><span class="wf-system-key-button shift-btn">SHIFT</span><span>Tasta <span class="wf-system-highlight">SHIFT</span> - <strong>Navighează în jos</strong> prin categorii</span></div>
    </div>
    
  <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Meniul <code>!ws</code> îți va afișa toate <span class="wf-system-highlight">cuțitele disponibile</span>, grupate pe tipuri (Karambit, M9 Bayonet, Butterfly etc.), cu preview-uri și prețul în Phoenix Coins.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/knives/gif_knives_2.gif" alt="Knives Selection - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">select knife</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Apasă <span class="wf-system-highlight">E</span> pentru a selecta cuțitul dorit
      </div>
    </div>
    
   <p>După ce selectezi un cuțit, se deschide panoul detaliat:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Preview</span> — poți vedea modelul cuțitului înainte de achiziție</span></li>
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Buy Now</span> — cumpără cuțitul direct cu Phoenix Coins</span></li>
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Equip</span> — dacă îl deții deja, îl echipezi instant</span></li>
    </ul>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span>Odată cumpărate sau echipate, cuțitele sunt <span class="wf-system-highlight">vizibile instant</span> în mâna personajului tău. Nu este necesară relogarea.</span>
    </div>
  </div>
</div>

### 2.0 CUM OBȚII CUȚITE

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 CUM OBȚII CUȚITE</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:package" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Există mai multe metode prin care poți obține cuțite pe server:</p>
    <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Market</span> — cumperi din <code>!ws</code> folosind Phoenix Coins</span></li>
      <li><Icon icon="lucide:box" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Cases</span> — deschizi un case care conține cuțite (raritate extrem de mare)</span></li>
      <li><Icon icon="lucide:calendar" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Events</span> — recompense speciale la evenimente</span></li>
    </ul>
    <div class="wf-system-tip orange">
      <Icon icon="lucide:alert-triangle" width="22" height="22" color="#ff8c00" />
      <span>Cuțitele sunt printre cele mai rare iteme — șansa de drop este extrem de mică!</span>
    </div>
  </div>
</div>

### 3.0 INVENTAR & LOADOUT

<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:layers" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 INVENTAR & LOADOUT</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:layers" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Toate item-urile tale sunt stocate în inventar și pot fi gestionate atât din joc, cât și de pe site-ul oficial.</p>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/inventory.png" alt="Inventory Menu - !inv" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!inv - inventory menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:command" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Folosește comanda <span class="wf-system-highlight">!inv</span> în joc pentru a-ți deschide inventarul
      </div>
    </div>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:monitor" width="22" height="22" color="#00c851" />
      <span><span class="wf-system-highlight">Pe site-ul oficial:</span> Accesează <code>wildfire.ro/skins-market</code> și autentifică-te cu Steam pentru a accesa secțiunea <span class="wf-system-highlight">Inventory</span>. Acolo vei găsi toate skin-urile, cuțitele, mănușile și agenții pe care îi deții.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/gif_inventory.gif" alt="Site Inventory - wildfire.ro/skins-market" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site inventory</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:package-open" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        În secțiunea <span class="wf-system-highlight">Inventory</span> de pe site poți vedea toate item-urile câștigate
      </div>
    </div>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:mouse-pointer-click" width="22" height="22" color="#00c851" />
      <span>După ce ai vizualizat inventarul, accesează secțiunea <span class="wf-system-highlight">Loadout</span> pentru a-ți echipa item-urile direct din browser.</span>
    </div>
    
 <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/gif_loadout.gif" alt="Site Loadout - Echipa iteme" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site loadout - equip items</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check-circle-2" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        În secțiunea <span class="wf-system-highlight">Loadout</span> selectează item-ul dorit și apasă Equip
      </div>
    </div>
    
  <div class="wf-system-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Toate item-urile echipate pe site sunt <span class="wf-system-highlight">sincronizate automat</span> cu jocul. Nu este nevoie de relogare - schimbările sunt vizibile instant în CS2!</span>
    </div>
  </div>
</div>

### 4.0 TIPURI DE CUȚITE

<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:grid-3x3" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 TIPURI DE CUȚITE</span>
</div>

<div class="wf-system-type-grid">
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9rYXJhbWJpdC4zMTQzNTI0MzE3ODMwYjY2OGVkMTdkMTgzYzlhZmVhMDc2ZmNiMTNiLnBuZw--/auto/auto/85/notrim/f626fe6b3555e993f3f5ee8c023048f3.webp" alt="Karambit"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Karambit</p><p class="wf-system-type-desc">Design curbat, animații iconice</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9tOV9iYXlvbmV0Ljg4M2NhNTlhN2NjZmE2MTYzOTYzYjYwYzY5Y2RkMzk0YzJiODdhNWUucG5n/auto/auto/85/notrim/1ac339a2f6491076625be3d396daf996.webp" alt="M9 Bayonet"></div><div class="wf-system-type-info"><p class="wf-system-type-name">M9 Bayonet</p><p class="wf-system-type-desc">Design militar, lama robustă</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9idXR0ZXJmbHkuMTVkYzdjYzUzYjE4ZjYyMWUxNWUyZDljYTJjODViMjQ4MzdmNmYxNi5wbmc-/auto/auto/85/notrim/2f10bc24054d400de7758453e78de394.webp" alt="Butterfly Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Butterfly Knife</p><p class="wf-system-type-desc">Animații spectaculoase, flip</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9iYXlvbmV0LjRhMzg1Njg1M2MwZTc2MjYyZTg2MTVmOThhODg4NGFlZTY2ZGEzOGIucG5n/auto/auto/85/notrim/99f374cb24987a880e31b5da97815131.webp" alt="Bayonet"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Bayonet</p><p class="wf-system-type-desc">Design clasic, lama dreaptă</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9mbGlwLmExZWVlZDVhNGExOGM2ODFmNDNkMWI0YWEyZjY1Yjg0YzM3OTBjNWUucG5n/auto/auto/85/notrim/ff0308f8e546acb6c52c0abbfd5d7213.webp" alt="Flip Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Flip Knife</p><p class="wf-system-type-desc">Design compact, animație flip</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV90YWN0aWNhbC45N2M1NmYyMTBlMWJlMTQ2YWE4ZWJkMDgyYjI0M2Q3NTQ4OGEwNDNiLnBuZw--/auto/auto/85/notrim/fa2f75126da9a9a7646e612793e05a7f.webp" alt="Huntsman Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Huntsman Knife</p><p class="wf-system-type-desc">Design vânătoare, lama zimțată</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9mYWxjaGlvbi5jNDY3ZWUzYzY3NTIxNzNkOTg5OTRlZDhmMTg3YWU1N2VmNzg2NGUwLnBuZw--/auto/auto/85/notrim/b8d71a470b4b34144ab8088a8af19ba2.webp" alt="Falchion Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Falchion Knife</p><p class="wf-system-type-desc">Design medieval, lama curbă</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9ndXQuNTIxOTJkY2JhZTEyMDJhOGFhNDhkMjMyMmQ4Y2IyOWUwMTJjMmY3OC5wbmc-/auto/auto/85/notrim/49725a5aaa6956b31c0d61efc23f8ab1.webp" alt="Gut Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Gut Knife</p><p class="wf-system-type-desc">Design curbat, animație simplă</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9neXBzeV9qYWNra25pZmUuYTY4YzFiZjMxM2Q5MTdhM2ZhMDVjNGM4NzYxYmViODdiYTI4MzBiOC5wbmc-/auto/auto/85/notrim/5c26e3b014d97d5fc86bb9d7996702d1.webp" alt="Navaja Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Navaja Knife</p><p class="wf-system-type-desc">Design pliant, stil compact</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9wdXNoLjgyNjg5M2U4MTc3ODIwYzkyMTBlNGQxZGNjM2E4NmRiNDQ1ZWFhNzUucG5n/auto/auto/85/notrim/8bdb8e271d6222828e92d2c949d7318c.webp" alt="Shadow Daggers"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Shadow Daggers</p><p class="wf-system-type-desc">Două lame, stil asasin</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9zdXJ2aXZhbF9ib3dpZS40MTVjMjhlYjdkODViYTIyOTc2MmNiMzVmNzUwNjFlMzAzODM0MzlmLnBuZw--/auto/auto/85/notrim/2254c36c877064475e49a334f652fd67.webp" alt="Bowie Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Bowie Knife</p><p class="wf-system-type-desc">Lamă lată, design robust</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9jb3JkLjM1MDVkZWNkYjY5MjMxZmRhODJkODIzZTA5OWQ3OTFjNGYxZTEwMDUucG5n/auto/auto/85/notrim/4539f176c554de63cceedcfc4a5f4a05.webp" alt="Paracord Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Paracord Knife</p><p class="wf-system-type-desc">Design tactic, mâner împletit</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9jYW5pcy4zM2E1MTUzMmM0NDVlZTMwNjFkNjhlYWE5Mjg3MjVlNThmOGRhZjkwLnBuZw--/auto/auto/85/notrim/5959b0aa64921e3c201fb3d8c2e25479.webp" alt="Survival Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Survival Knife</p><p class="wf-system-type-desc">Design utilitar, robust</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV91cnN1cy4yZjIxOGNkYmVlMTIxZjYxZWFkY2NlZjg5ZWUxN2ZjNDZmZDQyZWY2LnBuZw--/auto/auto/85/notrim/202cfb970c4667a52980632b14349aab.webp" alt="Ursus Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Ursus Knife</p><p class="wf-system-type-desc">Design compact, lama lată</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9rdWtyaS4zNDQ0NzZjMmNhNGRkOTgyOTQyMjViOTM5M2ZjMDlmODViODcwYzZmLnBuZw--/auto/auto/85/notrim/3f2f9a2c1afe13acb3f92a74f39ec2fe.webp" alt="Kukri Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Kukri Knife</p><p class="wf-system-type-desc">Design curbat, forță brută</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9jc3MuY2M1MjU4ZWY1YTUzZGNjYWNiYjA3ZmE5NDk0ZDNhMDUyYzYyZDMxYi5wbmc-/auto/auto/85/notrim/495da4a30a61a33fe5e41722894442f0.webp" alt="Classic Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Classic Knife</p><p class="wf-system-type-desc">Design original CS, nostalgic</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9zdGlsZXR0by5jNGZiNzAwNGFkMjk5ZDZiZWZjN2M5NmFmNWE0MTE3NjcwNWUzMTJkLnBuZw--/auto/auto/85/notrim/79abdddb23864b0b70d112621bdff947.webp" alt="Stiletto Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Stiletto Knife</p><p class="wf-system-type-desc">Lamă subțire, elegant</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV93aWRvd21ha2VyLjYxNzcwNDliZDg4OWQ4ZjZiNWU2NzE5ZTUxZmZjOWY5OTRlZGEwMWEucG5n/auto/auto/85/notrim/11e9ddb0856ea6417b212cd925fe085b.webp" alt="Talon Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Talon Knife</p><p class="wf-system-type-desc">Design agresiv, lama curbă</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9vdXRkb29yLjBjOWIwM2MxNmQ5ZTliMDg0NjI5MjI3NGJiNmZhN2M3YWU1ODY5NmQucG5n/auto/auto/85/notrim/ab63176a80d901dbd434a145e4343807.webp" alt="Nomad Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Nomad Knife</p><p class="wf-system-type-desc">Design rustic, practic</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL3dlYXBvbnMvYmFzZV93ZWFwb25zL3dlYXBvbl9rbmlmZV9za2VsZXRvbi5jYzhhNTFlNmEyNWViNzcwZjkxMTkxYjYwZTE3ODUxZjQzZDU4NGRkLnBuZw--/auto/auto/85/notrim/fd430bd232a67315a7cee81e4fb41b04.webp" alt="Skeleton Knife"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Skeleton Knife</p><p class="wf-system-type-desc">Design schelet, unic</p></div></div>
</div>

<div class="wf-system-tip" style="margin-top: 24px;">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Fiecare tip de cuțit are <span class="wf-system-highlight">multiple variante de culori și modele</span> (Doppler, Crimson Web, Fade etc.). Poți inspecta fiecare model înainte de achiziție direct din meniul <code>!ws</code>.</p>
</div>

<!-- INFO BOX FINAL -->
<div class="wf-system-box">
  <ul>
    <li><Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" /><span><span class="wf-system-highlight">Atenție!</span> Cuțitele sunt iteme cosmetic rare. Verifică șansele de drop înainte să deschizi un case care le conține. Prețurile variază în funcție de raritate, design și wear rating.</span></li>
    <li><Icon icon="lucide:info" width="20" height="20" color="currentColor" /><span><span class="wf-system-highlight">Notă:</span> Poți purta un singur cuțit odată, dar îl poți schimba oricând din meniul <code>!ws</code>. Cuțitele se combină perfect cu mănușile pentru un look complet.</span></li>
  </ul>
</div>

</div>