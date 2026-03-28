<!-- Background image container -->
<div style="position: relative; overflow: hidden; border-radius: 24px; margin-bottom: 20px; min-height: 180px; background-color: #0a0a0a;">

<!-- Background image layer cu BLUR și PARALLAX -->
<div style="position: absolute; top: -20px; left: -20px; right: -20px; bottom: -20px; z-index: 0; filter: blur(5px) brightness(0.7); transform: scale(1.1);">
  <img src="/wallpaper/backgroundwf.webp" alt="background" style="width: 100%; height: 100%; object-fit: cover; opacity: 0.4;">
</div>

<!-- Content layer -->
<div style="position: relative; z-index: 1; padding: 30px 30px 20px 30px; border-radius: 24px;">

<!-- RÂND 0 - path și introduction -->
<div style="display: flex; align-items: center; gap: 15px; margin-bottom: 5px; font-size: 12px; color: var(--wf-gray); flex-wrap: wrap; opacity: 0.9;">
  <div style="display: flex; align-items: center; gap: 5px;">
    <a href="/" style="color: var(--wf-orange); text-decoration: none;">Home</a>
    <span style="color: var(--wf-orange);">/</span>
    <span>Updates</span>
    <span style="color: var(--wf-orange);">/</span>
    <span style="color: #e0e0e0;">Changelogs</span>
  </div>
  
  <div style="display: flex; align-items: center; gap: 6px;">
    <img src="/icons/introduction.svg" alt="introduction" class="nav-icon" style="width: 18px; height: 18px;">
    <span style="font-size: 12px; color: var(--wf-gray);">Updates</span>
  </div>
</div>

<!-- RÂND 1 - logo și titlu - PORTOCALIU -->
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
  <img src="/icons/wildfire.webp" alt="Wildfire.ro" width="60" style="margin: 0;">
  
  <!-- TITLU PORTOCALIU -->
  <h1 style="font-size: 32px; margin: 0; color: #ff8c00; font-weight: 700;">
    Changelogs Wikipedia
  </h1>
</div>

<!-- RÂND 2 - tags și updated by JOS, pe același rând -->
<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid rgba(255,69,0,0.2); padding-top: 15px; margin-top: 5px;">

  <!-- Tags în stânga -->
  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
    <img src="/icons/tag.svg" alt="tag" class="nav-icon" style="width: 18px; height: 18px;">
    <PageTagRed style="font-size: 11px; padding: 2px 8px;">information</PageTagRed>
    <PageTagGreen style="font-size: 11px; padding: 2px 8px;">connect</PageTagGreen>
    <PageTagPurple style="font-size: 11px; padding: 2px 8px;">faq</PageTagPurple>
  </div>

  <!-- Updated by în dreapta -->
  <div style="display: flex; align-items: center; gap: 6px;">
    <span style="font-size: 13px; color: var(--wf-gray); font-weight: 500;">updated by</span>
    <a 
      href="https://github.com/iannc69" 
      target="_blank" 
      class="github-profile"
      data-username="iannc69"
      data-tags="show-wildfire show-dev show-wiki show-staff   "
      style="display: block; padding: 2px; background: linear-gradient(135deg, #8b5cf6, #c084fc, #f472b6); border-radius: 50%;" 
      title="iannc69"
    >
      <img src="https://github.com/iannc69.png" alt="iannc69" style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid #1a1a1a; display: block;">
    </a>
  </div>

</div>

</div> 
</div>

<Changelogs />