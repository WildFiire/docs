---
outline: deep
---

<CaseHeader 
  title="New Page"
  :tags="[
    { text: 'da', component: 'PageTagOrange' },
    { text: 'da', component: 'PageTagOrange' },
    { text: 'da', component: 'PageTagRed' }
  ]"
  :path="['Home', 'Systems']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  badge-icon="lucide:star"
/>

<div class="wf-system">


### 1.0 TEST

<div style="display: flex; align-items: center; gap: 16px; margin: 40px 0 25px 0; padding-bottom: 12px; border-bottom: 2px solid rgba(255,140,0,0.2);" class="wf-system-title-hover">
  <span style="font-size: 28px; font-weight: 800; line-height: 1; display: inline-block; background: linear-gradient(135deg, #ff8c00, #ff5500, #ff4400); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;" class="wf-system-font"><Icon icon="lucide:star" width="30" height="30" color="#ff8c00" style="display: inline-block; vertical-align: middle; margin-right: 8px;" />1.0 TEST</span>
</div>

<div class="wf-system-card">
  <div class="wf-system-icon"><Icon icon="lucide:info" width="18" height="18" color="#ff8c00" /></div>
  <div class="wf-system-content"> <span class="wf-system-highlight">Title</span>
    <p>Content here.</p>
  <div style="margin: 24px 0; border-radius: 16px; overflow: hidden; background: linear-gradient(135deg, rgba(255,140,0,0.1), rgba(255,140,0,0.02)); border: 1px solid rgba(255,140,0,0.2); padding: 8px;">
    <div style="position: relative; border-radius: 12px; overflow: hidden;">
    <img src="https://i.imgur.com/2LDUPPO.jpeg" alt="test" style="width: 100%; max-width: 800px; height: auto; display: block; margin: 0 auto; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);" loading="lazy">
    <div style="position: absolute; bottom: 12px; right: 12px; background: rgba(0,0,0,0.7); backdrop-filter: blur(4px); padding: 4px 12px; border-radius: 20px; font-size: 11px; font-family: 'Orbitron', monospace; color: #ff8c00;">test</div>
    </div>
  <div style="text-align: center; padding: 10px 12px 4px; font-size: 12px; color: var(--vp-c-text-2);">test</div>
  </div>
  </div>
</div>

</div>
