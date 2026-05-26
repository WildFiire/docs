---
title: "Gloves"
description: "Descopera totul despre Gloves pe platforma Wildfire.ro. Resurse complete, ghiduri si sisteme detaliate pentru Counter-Strike 2."
outline: "deep"
---

<CaseHeader 
  title="Gloves"
  :tags="[
    { text: 'skins', color: 'purple' },
    { text: 'gloves', color: 'green' },
    { text: 'items', color: 'blue' }
  ]"
  :path="['Home', 'Systems', 'WeaponSkins', 'Gloves']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="systems-gloves"
  badge-text="Gloves"
  badge-icon="lucide:hand"
/>

<div class="wf-system">

<!-- INTRO - DESCRIERE MANUSI -->
<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:hand" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <span class="wf-system-number">Cosmetic Items</span> <span class="wf-system-highlight">Gloves System</span>
    <p>Manusile sunt iteme cosmetice care inlocuiesc manusile default ale personajului. Nu ofera niciun avantaj in joc, sunt doar <span class="wf-system-highlight">vizuale</span>. Acestea pot fi obtinute din anumite cutii, de pe piata serverului sau in cadrul unor evenimente speciale.</p>
    <p>Odata castigate, manusile sunt adaugate automat in inventarul tau si pot fi echipate direct din meniul <code>!ws</code> sau de pe site. Fiecare pereche are un design unic si poate fi combinata cu diferite skin-uri de cutite.</p>
  </div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Manusile sunt iteme <span class="wf-system-highlight">cosmetice rare</span> si nu ofera niciun avantaj in joc. Fiecare pereche are un design unic, iar unele sunt disponibile doar in anumite cutii sau evenimente speciale.</p>
</div>

<!-- 1.0 CUM ECHIPEZI MANUSI -->
### 1.0 INFORMATII

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:mouse-pointer-click" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 INFORMATII</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:command" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Totul incepe cu o comanda simpla si o interfata intuitiva, controlata complet din <span class="wf-system-highlight">tastatura</span>.</p>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:info" width="22" height="22" color="#ff8c00" />
      <span>Scrie <code>!ws</code> in chat pentru a deschide interfata principala a <span class="wf-system-highlight">skin-urilor si manusilor</span>.</span>
    </div>
    
  <p>Navigarea prin meniul de manusi se face cu ajutorul tastelor:</p>
    
   <div class="wf-system-key-row">
      <div class="wf-system-key-item"><span class="wf-system-key-button">E</span><span>Tasta <span class="wf-system-highlight">E</span> - <strong>Selecteaza</strong> manusile</span></div>
      <div class="wf-system-key-item"><span class="wf-system-key-button">F</span><span>Tasta <span class="wf-system-highlight">F</span> - <strong>Navigheaza in sus</strong> prin categorii</span></div>
      <div class="wf-system-key-item"><span class="wf-system-key-button shift-btn">SHIFT</span><span>Tasta <span class="wf-system-highlight">SHIFT</span> - <strong>Navigheaza in jos</strong> prin categorii</span></div>
    </div>

    
   <div class="wf-system-tip">
      <Icon icon="lucide:lightbulb" width="22" height="22" color="#00c851" />
      <span>Meniul <code>!ws</code> iti va afisa toate <span class="wf-system-highlight">manusile disponibile</span>, grupate pe tipuri (Sport, Specialist, Moto, Hand Wraps etc.), cu preview-uri 3D si pretul in Phoenix Coins.</span>
    </div>

  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/gloves/gif_gloves_1.gif" alt="Gloves Selection - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">select gloves</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Apasa <span class="wf-system-highlight">E</span> pentru a selecta manusile dorite
      </div>
    </div>
    
   <p>Dupa ce selectezi o pereche de manusi, se deschide panoul detaliat:</p>
    
   <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:eye" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Preview</span> — poti vedea modelul 3D al manusilor inainte de achizitie</span></li>
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Buy Now</span> — cumpara manusile direct cu Phoenix Coins</span></li>
      <li><Icon icon="lucide:check-circle-2" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Equip</span> — daca le detii deja, le echipezi instant</span></li>
    </ul>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:refresh-cw" width="22" height="22" color="#ff8c00" />
      <span>Odata cumparate sau echipate, manusile sunt <span class="wf-system-highlight">vizibile instant</span> pe mainile personajului tau. Nu este necesara relogarea.</span>
    </div>
  </div>
</div>

<!-- 2.0 CUM OBTII MANUSI -->
### 2.0 CUM OBTII MANUSI

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:gift" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />2.0 CUM OBTII MANUSI</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:package" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Exista mai multe metode prin care poti obtine manusi pe server:</p>
    
  <ul class="wf-system-custom-list">
      <li><Icon icon="lucide:shopping-cart" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Market</span> — cumperi din <code>!ws</code> folosind Phoenix Coins</span></li>
      <li><Icon icon="lucide:box" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Cases</span> — deschizi un case care contine manusi (raritate foarte mare)</span></li>
      <li><Icon icon="lucide:calendar" width="18" height="18" color="#ff8c00" /><span><span class="wf-system-highlight">Events</span> — recompense speciale la evenimente</span></li>
    </ul>
    
   <div class="wf-system-tip orange">
      <Icon icon="lucide:alert-triangle" width="22" height="22" color="#ff8c00" />
      <span>Manusile sunt printre cele mai rare iteme — sansa de drop este extrem de mica!</span>
    </div>

  <div style="margin: 28px 0 20px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/gloves/gif_gloves_2.gif" alt="Gloves Purchase Preview - !ws" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">preview & purchase</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:eye" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Preview 3D inainte de achizitie si cumparare instant cu Phoenix Coins
      </div>
    </div>
  </div>
</div>

<!-- 3.0 INVENTAR & LOADOUT -->
### 3.0 INVENTAR & LOADOUT

<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:layers" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />3.0 INVENTAR & LOADOUT</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:layers" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content">
    <p>Toate item-urile tale sunt stocate in inventar si pot fi gestionate atat din joc, cat si de pe site-ul oficial.</p>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/inventory.png" alt="Inventory Menu - !inv" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">!inv - inventory menu</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:command" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        Foloseste comanda <span class="wf-system-highlight">!inv</span> in joc pentru a-ti deschide inventarul
      </div>
    </div>
    
  <div class="wf-system-tip">
      <Icon icon="lucide:monitor" width="22" height="22" color="#00c851" />
      <span><span class="wf-system-highlight">Pe site-ul oficial:</span> Acceseaza <code>wildfire.ro/skins-market</code> si autentifica-te cu Steam pentru a accesa sectiunea <span class="wf-system-highlight">Inventory</span>. Acolo vei gasi toate skin-urile, cutitele, manusile si agentii pe care ii detii.</span>
    </div>
    
   <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/gif_inventory.gif" alt="Site Inventory - wildfire.ro/skins-market" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site inventory</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:package-open" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        In sectiunea <span class="wf-system-highlight">Inventory</span> de pe site poti vedea toate item-urile castigate
      </div>
    </div>
    
   <div class="wf-system-tip">
      <Icon icon="lucide:mouse-pointer-click" width="22" height="22" color="#00c851" />
      <span>Dupa ce ai vizualizat inventarul, acceseaza sectiunea <span class="wf-system-highlight">Loadout</span> pentru a-ti echipa item-urile direct din browser.</span>
    </div>
    
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
      <div style="position: relative; border-radius: 12px; overflow: hidden;">
        <img src="/utility/gif_loadout.gif" alt="Site Loadout - Echipa iteme" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
        <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">site loadout - equip items</div>
      </div>
      <div style="text-align: center; padding: 12px; font-size: 12px; color: var(--vp-c-text-2);">
        <Icon icon="lucide:check-circle-2" width="14" height="14" style="display: inline-block; vertical-align: middle; margin-right: 4px;" />
        In sectiunea <span class="wf-system-highlight">Loadout</span> selecteaza item-ul dorit si apasa Equip
      </div>
    </div>
    
  <div class="wf-system-tip orange">
      <Icon icon="lucide:zap" width="22" height="22" color="#ff8c00" />
      <span>Toate item-urile echipate pe site sunt <span class="wf-system-highlight">sincronizate automat</span> cu jocul. Nu este nevoie de relogare - schimbarile sunt vizibile instant in CS2!</span>
    </div>
  </div>
</div>

<!-- 4.0 TIPURI DE MANUSI -->
### 4.0 TIPURI DE MANUSI

<div style="display: flex; align-items: center; gap: 16px; margin: 48px 0 28px 0; padding-bottom: 14px; border-bottom: 2px solid rgba(255,140,0,0.25);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:grid-3x3" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />4.0 TIPURI DE MANUSI</span>
</div>

<div class="wf-system-type-grid">
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3Nwb3J0eV9nbG92ZXNfc3BvcnR5X2JsYWNrX3dlYmJpbmdfeWVsbG93X2xpZ2h0LjIyZDZkMmMzYTBiMjcyMTJlYjI4OGY3ZmU2NTE5YzQ1MGZmMzFmZjgucG5n/auto/auto/85/notrim/23da20bfbb7f60fa77271b238157c4db.webp" alt="Sport Gloves"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Sport Gloves</p><p class="wf-system-type-desc">Design modern, culori vibrante</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3NwZWNpYWxpc3RfZ2xvdmVzX3NwZWNpYWxpc3RfZGRwYXRfZ3JlZW5fY2Ftb19saWdodC42NmIyN2E2MGY2MzM1ZjZiZDhiZDY3MjNiOGYxM2ZmOTE5NWQ2ODhjLnBuZw--/auto/auto/85/notrim/86fb11e6c6ffcf6cfece6481fc2ec996.webp" alt="Specialist Gloves"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Specialist Gloves</p><p class="wf-system-type-desc">Tactice, detalii fine, finisaje premium</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL21vdG9yY3ljbGVfZ2xvdmVzX21vdG9yY3ljbGVfYmFzaWNfYmxhY2tfbGlnaHQuYTFlMDE2OGQ2OTk0Y2ZkYTI1YmY2ZWRlYmZiNmE4MTRjMGU5MDEwZi5wbmc-/auto/auto/85/notrim/3c09fe9883a3e7e4124e185fa0dc549b.webp" alt="Moto Gloves"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Moto Gloves</p><p class="wf-system-type-desc">Protectie si stil agresiv</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL2xlYXRoZXJfaGFuZHdyYXBzX2hhbmR3cmFwX2NhbW9fZ3JleV9saWdodC43MjZjODhhNjc0Mjc4MGM5MzA2M2QyYjc0MGQ3ZTY5MGZjZWZmYWZlLnBuZw--/auto/auto/85/notrim/c49acf5ebd27d3a71f323ba205e864f2.webp" alt="Hand Wraps"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Hand Wraps</p><p class="wf-system-type-desc">Aspect rugged, textura unica</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3N0dWRkZWRfYmxvb2Rob3VuZF9nbG92ZXNfYmxvb2Rob3VuZF9ibGFja19zaWx2ZXJfbGlnaHQuOGMzNTgwZjQ1MDhkMjQxYTQ3YWJjNjE2ZDk0ZGZiM2QyZmNlYzM0Yy5wbmc-/auto/auto/85/notrim/becbbaa216ffa6c8b764af5698768847.webp" alt="Bloodhound Gloves"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Bloodhound Gloves</p><p class="wf-system-type-desc">Camuflaj, texturi terestre</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3NsaWNrX2dsb3Zlc19zbGlja19ibGFja19saWdodC5iOTBkMjUxYTNjYTEyNmJkMDA5NGFiMDQzNzczZjExYTNiNjE4Nzg2LnBuZw--/auto/auto/85/notrim/bdf3129541e747332f13294224f880dc.webp" alt="Driver Gloves"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Driver Gloves</p><p class="wf-system-type-desc">Eleganta inspirata din motorsport</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3N0dWRkZWRfYnJva2VuZmFuZ19nbG92ZXNfb3BlcmF0aW9uMTBfZmxvcmFsX2xpZ2h0LjE3NjU4MjE2M2JlNjI4NjhmZjhiN2MxMWRlMDU4YWFjZjRmY2I3NDUucG5n/auto/auto/85/notrim/2cfadb344815b9708a062498d430278b.webp" alt="Broken Fang Gloves"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Broken Fang Gloves</p><p class="wf-system-type-desc">Design unic, texturi detaliate</p></div></div>
  <div class="wf-system-type-card"><div class="wf-system-type-corner"></div><div class="wf-system-type-img-wrap"><img src="https://cdn.csgoskins.gg/public/uih/weapons/aHR0cHM6Ly9jZG4uY3Nnb3NraW5zLmdnL3B1YmxpYy9pbWFnZXMvYnVja2V0cy9lY29uL2RlZmF1bHRfZ2VuZXJhdGVkL3N0dWRkZWRfaHlkcmFfZ2xvdmVzX2Jsb29kaG91bmRfaHlkcmFfYmxhY2tfZ3JlZW5fbGlnaHQuMWQ5MDg5YzFlY2UyMjk3NDA5MzVlZWUxMWNiMGZiZTM5ZWNiZTU4MC5wbmc-/auto/auto/85/notrim/039503cd70c2f0b50605dd7d139b9419.webp" alt="Hydra Gloves"></div><div class="wf-system-type-info"><p class="wf-system-type-name">Hydra Gloves</p><p class="wf-system-type-desc">Stil casual, culori indraznete</p></div></div>
</div>

<div class="wf-system-tip">
  <svg class="wf-system-tip-icon" viewBox="0 0 24 24" fill="none" stroke="#00c851" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
  <p class="wf-system-tip-text">Fiecare tip de manusi are <span class="wf-system-highlight">multiple variante de culori si modele</span> (Doppler, Crimson Web, Fade etc.). Poti inspecta fiecare model inainte de achizitie direct din meniul <code>!ws</code>.</p>
</div>

<!-- INFO BOX FINAL -->
<div class="wf-system-box">
  <ul>
    <li><Icon icon="lucide:alert-triangle" width="20" height="20" color="currentColor" /><span><span class="wf-system-highlight">Atentie!</span> Manusile sunt iteme cosmetic rare. Verifica sansele de drop inainte sa deschizi un case care le contine. Preturile variaza in functie de raritate si design.</span></li>
  </ul>
</div>

</div>