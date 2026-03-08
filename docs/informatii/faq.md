---
outline: deep
---

<!-- Background image container -->
<div style="position: relative; overflow: hidden; border-radius: 24px; margin-bottom: 20px; min-height: 180px; background-color: var(--vp-c-bg);">

<!-- Background image layer cu BLUR -->
<div style="position: absolute; top: -20px; left: -20px; right: -20px; bottom: -20px; z-index: 0; filter: blur(5px) brightness(var(--bg-brightness, 0.7)); transform: scale(1.1);">
  <img src="/wallpaper/backgroundwf.webp" alt="background" style="width: 100%; height: 100%; object-fit: cover; opacity: var(--bg-opacity, 0.4);">
</div>

<!-- Content layer -->
<div style="position: relative; z-index: 1; padding: 30px 30px 20px 30px; border-radius: 24px;">

<!-- RÂND 0 - path -->
<div style="display: flex; align-items: center; gap: 15px; margin-bottom: 5px; font-size: 12px; color: var(--vp-c-text-2); flex-wrap: wrap;">
  <div style="display: flex; align-items: center; gap: 5px;">
    <span style="color: var(--vp-c-brand-1);">Home</span>
    <span style="color: var(--vp-c-brand-1);">/</span>
    <span style="color: var(--vp-c-brand-1);">Informatii</span>
    <span style="color: var(--vp-c-brand-1);">/</span>
    <span style="color: var(--vp-c-text-2);">Intrebari frecvente</span>
  </div>
  
  <div style="display: flex; align-items: center; gap: 6px;">
    <img src="/icons/introduction.svg" alt="introduction" class="nav-icon" style="width: 18px; height: 18px; filter: var(--icon-filter, none);">
    <span style="font-size: 12px; color: var(--vp-c-text-2);">FAQ</span>
  </div>
</div>

<!-- RÂND 1 - logo și titlu -->
<div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
  <img src="/icons/wildfire.webp" alt="Wildfire.ro" width="60" style="margin: 0; filter: var(--logo-filter, none);">
  
  <!-- TITLU -->
  <h1 style="font-size: 32px; margin: 0; background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; font-weight: 700;">
    Întrebări frecvente
  </h1>
</div>

<!-- RÂND 2 - tags -->
<div style="display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 15px; border-top: 1px solid var(--vp-c-divider); padding-top: 15px;">

  <!-- Tags -->
  <div style="display: flex; align-items: center; gap: 8px; flex-wrap: wrap;">
    <img src="/icons/tag.svg" alt="tag" class="nav-icon" style="width: 18px; height: 18px; filter: var(--icon-filter, none);">
    <PageTagRed style="font-size: 11px; padding: 2px 8px;">faq</PageTagRed>
    <PageTagGreen style="font-size: 11px; padding: 2px 8px;">cs2</PageTagGreen>
    <PageTagPurple style="font-size: 11px; padding: 2px 8px;">comunitate</PageTagPurple>
    <PageTagBlue style="font-size: 11px; padding: 2px 8px;">ajutor</PageTagBlue>
  </div>

  <div style="display: flex; align-items: center; gap: 6px;">
    <span style="font-size: 13px; color: var(--vp-c-text-2); font-weight: 500;">updated by</span>
    <a 
      href="https://github.com/ianncxd" 
      target="_blank" 
      class="github-profile"
      data-username="ianncxd"
      data-tags="show-wildfire show-dev show-wiki show-staff show-founder"
      style="display: block; padding: 2px; background: linear-gradient(135deg, #8b5cf6, #c084fc, #f472b6); border-radius: 50%;" 
      title="ianncxd"
    >
      <img src="https://github.com/ianncxd.png" alt="ianncxd" style="width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--vp-c-bg); display: block;">
    </a>
  </div>

</div>

</div> 
</div>

<!-- ===== STYLE FAQ CU DESIGN WILDFIRE - DOAR PENTRU .faq-wrapper ===== -->
<style>
.faq-wrapper {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px 0;
}

.faq-wrapper .faq-header-quote {
  text-align: center;
  margin: 20px 0 30px;
  font-size: 16px;
  color: var(--vp-c-text-2);
}

.faq-wrapper .faq-highlight {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  position: relative;
  display: inline-block;
}

.faq-wrapper .faq-highlight::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
  border-radius: 2px;
}

/* Steam Connect Card */
.faq-wrapper .steam-connect-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 20px;
  background: var(--vp-c-bg-soft);
  border-radius: 24px;
  padding: 24px 30px;
  margin: 30px 0;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.faq-wrapper .steam-connect-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.faq-wrapper .steam-connect-card:hover::before {
  opacity: 1;
}

.faq-wrapper .steam-connect-card:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: 0 15px 30px rgba(255,140,0,0.1);
}

.faq-wrapper .steam-left {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.faq-wrapper .steam-icon-box {
  width: 56px;
  height: 56px;
  background: linear-gradient(145deg, #1b2838, #0f1a24);
  border-radius: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #2a3f5a;
  transition: all 0.3s ease;
}

.faq-wrapper .steam-connect-card:hover .steam-icon-box {
  transform: scale(1.05);
  border-color: var(--vp-c-brand-1);
}

.faq-wrapper .steam-icon-box svg {
  width: 30px;
  height: 30px;
  stroke: #66c0f4;
  fill: none;
  transition: all 0.3s ease;
}

.faq-wrapper .steam-connect-card:hover .steam-icon-box svg {
  stroke: var(--vp-c-brand-1);
}

.faq-wrapper .steam-text {
  font-size: 15px;
  color: var(--vp-c-text-2);
  line-height: 1.6;
}

.faq-wrapper .steam-text strong {
  color: var(--vp-c-text-1);
  font-weight: 700;
  position: relative;
  display: inline-block;
}

.faq-wrapper .steam-text strong::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
  border-radius: 2px;
}

.faq-wrapper .steam-connect-link {
  color: var(--vp-c-brand-1);
  text-decoration: none;
  font-weight: 600;
  position: relative;
  display: inline-block;
  padding: 0 2px;
}

.faq-wrapper .steam-connect-link::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
  border-radius: 2px;
  opacity: 0.7;
  transition: opacity 0.3s ease;
}

.faq-wrapper .steam-connect-link:hover::after {
  opacity: 1;
  height: 3px;
}

.faq-wrapper .steam-copy-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  background: transparent;
  border: 1px solid var(--vp-c-divider);
  border-radius: 40px;
  padding: 12px 28px;
  color: var(--vp-c-text-1);
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.faq-wrapper .steam-copy-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,140,0,0.1), transparent);
  transition: left 0.5s ease;
}

.faq-wrapper .steam-copy-btn:hover::before {
  left: 100%;
}

.faq-wrapper .steam-copy-btn:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  background: rgba(255,140,0,0.05);
  transform: translateY(-2px);
}

.faq-wrapper .steam-copy-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  transition: transform 0.3s ease;
}

.faq-wrapper .steam-copy-btn:hover svg {
  transform: rotate(5deg);
}

/* Ticket System Card */
.faq-wrapper .ticket-system-card {
  background: var(--vp-c-bg-soft);
  border-radius: 28px;
  padding: 32px;
  margin: 40px 0;
  border: 1px solid var(--vp-c-divider);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.faq-wrapper .ticket-system-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, rgba(255,140,0,0.03) 0%, transparent 70%);
  animation: rotate 30s linear infinite;
  z-index: 0;
}

@keyframes rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.faq-wrapper .ticket-header {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--vp-c-divider);
  position: relative;
  z-index: 1;
}

.faq-wrapper .ticket-header-icon {
  width: 64px;
  height: 64px;
  background: rgba(255,140,0,0.1);
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,140,0,0.2);
  transition: all 0.3s ease;
}

.faq-wrapper .ticket-system-card:hover .ticket-header-icon {
  background: rgba(255,140,0,0.15);
  transform: rotate(5deg);
}

.faq-wrapper .ticket-header-icon svg {
  width: 32px;
  height: 32px;
  stroke: var(--vp-c-brand-1);
  fill: none;
}

.faq-wrapper .ticket-header-title {
  flex: 1;
}

.faq-wrapper .ticket-header-title h3 {
  margin: 0;
  font-size: 26px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  display: flex;
  align-items: center;
  gap: 12px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.faq-wrapper .ticket-badge-new {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 14px;
  border-radius: 30px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 2px 10px rgba(255,140,0,0.3);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { opacity: 0.9; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.05); }
  100% { opacity: 0.9; transform: scale(1); }
}

.faq-wrapper .ticket-header-title p {
  margin: 8px 0 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
}

/* Stats */
.faq-wrapper .ticket-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.faq-wrapper .ticket-stat {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  padding: 18px 12px;
  text-align: center;
  transition: all 0.3s ease;
}

.faq-wrapper .ticket-stat:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-3px);
  box-shadow: 0 10px 20px rgba(255,140,0,0.1);
}

.faq-wrapper .ticket-stat-value {
  font-size: 26px;
  font-weight: 800;
  color: var(--vp-c-brand-1);
  line-height: 1.2;
  margin-bottom: 6px;
}

.faq-wrapper .ticket-stat-label {
  font-size: 12px;
  color: var(--vp-c-text-2);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Steps */
.faq-wrapper .ticket-steps {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 32px;
  position: relative;
  z-index: 1;
}

.faq-wrapper .ticket-step {
  display: flex;
  gap: 20px;
  padding: 20px;
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 20px;
  transition: all 0.3s ease;
}

.faq-wrapper .ticket-step:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(5px);
  box-shadow: 0 10px 20px rgba(255,140,0,0.1);
}

.faq-wrapper .ticket-step-number {
  width: 44px;
  height: 44px;
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 22px;
  color: white;
  flex-shrink: 0;
  box-shadow: 0 5px 15px rgba(255,140,0,0.3);
}

.faq-wrapper .ticket-step-content {
  flex: 1;
}

.faq-wrapper .ticket-step-content strong {
  color: var(--vp-c-brand-1);
  font-size: 18px;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.faq-wrapper .ticket-step-content strong svg {
  stroke: var(--vp-c-brand-1);
  width: 18px;
  height: 18px;
  fill: none;
}

.faq-wrapper .ticket-step-content p {
  margin: 0 0 12px 0;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.6;
}

.faq-wrapper .ticket-highlight {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  background: rgba(255,140,0,0.1);
  padding: 3px 12px;
  border-radius: 30px;
  display: inline-block;
  border: 1px solid rgba(255,140,0,0.2);
}

.faq-wrapper .ticket-features {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.faq-wrapper .ticket-feature {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 30px;
  padding: 5px 14px;
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  transition: all 0.3s ease;
}

.faq-wrapper .ticket-feature:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
}

.faq-wrapper .ticket-feature svg {
  stroke: var(--vp-c-brand-1);
  width: 14px;
  height: 14px;
  fill: none;
}

.faq-wrapper .ticket-step-progress {
  width: 100px;
  height: 4px;
  background: var(--vp-c-divider);
  border-radius: 2px;
  margin-top: 12px;
  position: relative;
  overflow: hidden;
}

.faq-wrapper .ticket-step-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 66%;
  height: 100%;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  border-radius: 2px;
}

/* Ticket Types */
.faq-wrapper .ticket-types {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 12px;
}

.faq-wrapper .ticket-type {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 18px;
  border-radius: 40px;
  font-size: 13px;
  font-weight: 600;
  border: 1px solid;
  background: transparent;
  transition: all 0.3s ease;
}

.faq-wrapper .ticket-type:hover {
  transform: translateY(-2px);
}

.faq-wrapper .ticket-type svg {
  width: 16px;
  height: 16px;
  fill: none;
}

.faq-wrapper .ticket-type.unban {
  color: #ffaa00;
  border-color: #ffaa00;
  background: rgba(255,170,0,0.05);
}
.faq-wrapper .ticket-type.unban:hover {
  background: #ffaa00;
  color: white;
}
.faq-wrapper .ticket-type.unban:hover svg {
  stroke: white;
}

.faq-wrapper .ticket-type.report {
  color: #ff4444;
  border-color: #ff4444;
  background: rgba(255,68,68,0.05);
}
.faq-wrapper .ticket-type.report:hover {
  background: #ff4444;
  color: white;
}
.faq-wrapper .ticket-type.report:hover svg {
  stroke: white;
}

.faq-wrapper .ticket-type.request {
  color: #0066ff;
  border-color: #0066ff;
  background: rgba(0,102,255,0.05);
}
.faq-wrapper .ticket-type.request:hover {
  background: #0066ff;
  color: white;
}
.faq-wrapper .ticket-type.request:hover svg {
  stroke: white;
}

.faq-wrapper .ticket-type.helper {
  color: #aa66ff;
  border-color: #aa66ff;
  background: rgba(170,102,255,0.05);
}
.faq-wrapper .ticket-type.helper:hover {
  background: #aa66ff;
  color: white;
}
.faq-wrapper .ticket-type.helper:hover svg {
  stroke: white;
}

/* CTA Buttons */
.faq-wrapper .ticket-cta {
  display: flex;
  gap: 15px;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 25px;
  padding-top: 25px;
  border-top: 1px solid var(--vp-c-divider);
  position: relative;
  z-index: 1;
}

.faq-wrapper .ticket-cta-btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 14px 32px;
  border-radius: 50px;
  font-weight: 700;
  font-size: 16px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.faq-wrapper .ticket-cta-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.faq-wrapper .ticket-cta-btn:hover::before {
  left: 100%;
}

.faq-wrapper .ticket-cta-btn.primary {
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  color: white;
  box-shadow: 0 5px 20px rgba(255,140,0,0.3);
}

.faq-wrapper .ticket-cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(255,140,0,0.4);
}

.faq-wrapper .ticket-cta-btn.secondary {
  background: transparent;
  border: 2px solid var(--vp-c-divider);
  color: var(--vp-c-text-1);
}

.faq-wrapper .ticket-cta-btn.secondary:hover {
  border-color: var(--vp-c-brand-1);
  color: var(--vp-c-brand-1);
  transform: translateY(-3px);
}

.faq-wrapper .ticket-cta-btn svg {
  width: 18px;
  height: 18px;
  stroke: currentColor;
  fill: none;
  transition: transform 0.3s ease;
}

.faq-wrapper .ticket-cta-btn:hover svg {
  transform: rotate(5deg);
}

/* FAQ Items */
.faq-wrapper .faq-section {
  margin: 40px 0;
}

.faq-wrapper .faq-title {
  margin: 40px 0 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid var(--vp-c-divider);
  display: flex;
  align-items: center;
  gap: 12px;
  position: relative;
}

.faq-wrapper .faq-title::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 80px;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
  border-radius: 2px;
}

.faq-wrapper .faq-title svg {
  width: 24px;
  height: 24px;
  stroke: var(--vp-c-brand-1);
  fill: none;
  transition: transform 0.3s ease;
}

.faq-wrapper .faq-title:hover svg {
  transform: rotate(5deg);
}

.faq-wrapper .faq-title h3 {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: var(--vp-c-text-1);
  background: linear-gradient(135deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.faq-wrapper .faq-item-custom {
  background: var(--vp-c-bg-soft);
  border: 1px solid var(--vp-c-divider);
  border-radius: 18px;
  margin-bottom: 15px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.faq-wrapper .faq-item-custom:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(255,140,0,0.1);
}

.faq-wrapper .faq-question-custom {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  cursor: pointer;
  background: var(--vp-c-bg);
  transition: background 0.3s ease;
}

.faq-wrapper .faq-question-custom:hover {
  background: rgba(255,140,0,0.03);
}

.faq-wrapper .faq-icon-wrapper {
  width: 40px;
  height: 40px;
  background: rgba(255,140,0,0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,140,0,0.2);
  transition: all 0.3s ease;
}

.faq-wrapper .faq-item-custom:hover .faq-icon-wrapper {
  background: rgba(255,140,0,0.15);
  transform: rotate(5deg);
}

.faq-wrapper .faq-icon-wrapper svg {
  width: 20px;
  height: 20px;
  stroke: var(--vp-c-brand-1);
  fill: none;
  transition: all 0.3s ease;
}

.faq-wrapper .faq-question-custom.active .faq-icon-wrapper svg {
  transform: rotate(90deg);
}

.faq-wrapper .faq-question-text-custom {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
  transition: color 0.3s ease;
}

.faq-wrapper .faq-item-custom:hover .faq-question-text-custom {
  color: var(--vp-c-brand-1);
}

.faq-wrapper .faq-arrow {
  width: 20px;
  height: 20px;
  stroke: var(--vp-c-brand-1);
  fill: none;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.faq-wrapper .faq-question-custom.active .faq-arrow {
  transform: rotate(180deg);
  opacity: 1;
}

.faq-wrapper .faq-answer-custom {
  padding: 0 24px 24px 78px;
  color: var(--vp-c-text-2);
  font-size: 15px;
  line-height: 1.7;
  border-top: 1px solid var(--vp-c-divider);
  background: var(--vp-c-bg-soft);
}

.faq-wrapper .faq-answer-custom p {
  margin: 15px 0;
}

.faq-wrapper .faq-answer-custom ul {
  margin: 10px 0;
  padding-left: 20px;
}

.faq-wrapper .faq-answer-custom li {
  margin: 6px 0;
  list-style-type: none;
  position: relative;
  padding-left: 24px;
}

.faq-wrapper .faq-answer-custom li::before {
  content: '▹';
  position: absolute;
  left: 0;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  opacity: 0.7;
}

.faq-wrapper .faq-answer-custom code {
  background: rgba(255,140,0,0.1);
  color: var(--vp-c-brand-1);
  padding: 3px 12px;
  border-radius: 30px;
  font-size: 13px;
  font-family: 'JetBrains Mono', monospace;
  border: 1px solid rgba(255,140,0,0.2);
}

.faq-wrapper .faq-answer-custom strong {
  color: var(--vp-c-brand-1);
  font-weight: 700;
}

/* Underline Effect */
.faq-wrapper .underline-effect {
  position: relative;
  display: inline-block;
  color: var(--vp-c-brand-1);
  font-weight: 600;
  cursor: default;
}

.faq-wrapper .underline-effect::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), transparent);
  border-radius: 2px;
  transition: all 0.3s ease;
}

.faq-wrapper .underline-effect:hover::after {
  height: 3px;
  background: linear-gradient(90deg, var(--vp-c-brand-1), var(--vp-c-brand-2));
}

/* Server Grid */
.faq-wrapper .server-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
  margin: 15px 0;
}

.faq-wrapper .server-item {
  background: var(--vp-c-bg);
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 15px;
  transition: all 0.3s ease;
}

.faq-wrapper .server-item:hover {
  border-color: var(--vp-c-brand-1);
  transform: translateX(5px);
  background: rgba(255,140,0,0.03);
}

.faq-wrapper .server-icon {
  width: 44px;
  height: 44px;
  background: rgba(255,140,0,0.1);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(255,140,0,0.2);
  transition: all 0.3s ease;
}

.faq-wrapper .server-item:hover .server-icon {
  background: rgba(255,140,0,0.15);
  transform: rotate(5deg);
}

.faq-wrapper .server-icon svg {
  width: 24px;
  height: 24px;
  stroke: var(--vp-c-brand-1);
  fill: none;
}

.faq-wrapper .server-info {
  flex: 1;
}

.faq-wrapper .server-name {
  font-weight: 700;
  color: var(--vp-c-text-1);
  font-size: 16px;
  margin-bottom: 4px;
}

.faq-wrapper .server-ip {
  font-size: 12px;
  color: var(--vp-c-brand-1);
  font-family: 'JetBrains Mono', monospace;
  background: rgba(255,140,0,0.05);
  padding: 3px 10px;
  border-radius: 30px;
  display: inline-block;
  border: 1px solid rgba(255,140,0,0.2);
}

.faq-wrapper .server-status {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #4caf50;
  margin-left: 10px;
  box-shadow: 0 0 10px #4caf50;
}

/* Responsive */
@media (max-width: 768px) {
  .faq-wrapper .ticket-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .faq-wrapper .ticket-stats {
    grid-template-columns: 1fr;
  }
  
  .faq-wrapper .ticket-step {
    flex-direction: column;
  }
  
  .faq-wrapper .ticket-cta {
    flex-direction: column;
  }
  
  .faq-wrapper .ticket-cta-btn {
    width: 100%;
    justify-content: center;
  }
  
  .faq-wrapper .server-grid {
    grid-template-columns: 1fr;
  }
  
  .faq-wrapper .faq-answer-custom {
    padding: 0 18px 18px 66px;
  }
  
  .faq-wrapper .steam-connect-card {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .faq-wrapper .steam-copy-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>

<div class="faq-wrapper">

<!-- STEAM CONNECT CARD -->
<div class="steam-connect-card">
  <div class="steam-left">
    <div class="steam-icon-box">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 8v4l3 3"/>
        <circle cx="12" cy="12" r="3" fill="rgba(102,192,244,0.2)" stroke="none"/>
      </svg>
    </div>
    <div class="steam-text">
      Ai nevoie de <strong>Counter-Strike 2</strong> instalat.<br>
      Adaugă la favorite: <span class="steam-connect-link">go.wildfire.ro:27015</span>
    </div>
  </div>
  
  <div class="steam-copy-btn" onclick="navigator.clipboard.writeText('go.wildfire.ro:27015'); alert('IP copiat în clipboard!');">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
    </svg>
    Copiază IP
  </div>
</div>

<!-- TICKET SYSTEM CARD -->
<div class="ticket-system-card">
  <div class="ticket-header">
    <div class="ticket-header-icon">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <rect x="2" y="2" width="20" height="20" rx="3" ry="3"/>
        <line x1="8" y1="2" x2="8" y2="22" stroke-dasharray="2 2"/>
        <line x1="16" y1="2" x2="16" y2="22" stroke-dasharray="2 2"/>
        <line x1="2" y1="8" x2="22" y2="8" stroke-dasharray="2 2"/>
        <line x1="2" y1="16" x2="22" y2="16" stroke-dasharray="2 2"/>
        <circle cx="12" cy="12" r="4" fill="none" stroke="var(--vp-c-brand-1)" stroke-width="1.5"/>
      </svg>
    </div>
    <div class="ticket-header-title">
      <h3>Sistem tickete </h3>
      <p>Unban, report-uri, request-uri pe wildfire.ro</p>
    </div>
  </div>

  <div class="ticket-stats">
    <div class="ticket-stat">
      <div class="ticket-stat-value">24/7</div>
      <div class="ticket-stat-label">Suport</div>
    </div>
    <div class="ticket-stat">
      <div class="ticket-stat-value">&lt;12h</div>
      <div class="ticket-stat-label">Răspuns</div>
    </div>
    <div class="ticket-stat">
      <div class="ticket-stat-value">4</div>
      <div class="ticket-stat-label">Tipuri</div>
    </div>
  </div>

  <div class="ticket-steps">
    <!-- Step 1 -->
    <div class="ticket-step">
      <div class="ticket-step-number">1</div>
      <div class="ticket-step-content">
        <strong>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <path d="M12 8v4l3 3"/>
            <circle cx="12" cy="12" r="9"/>
          </svg>
          Crează cont pe site
        </strong>
        <p>Accesează <span class="ticket-highlight">wildfire.ro</span> și autentifică-te cu Steam.</p>
        <div class="ticket-step-progress"></div>
      </div>
    </div>

   <div class="ticket-step">
      <div class="ticket-step-number">2</div>
      <div class="ticket-step-content">
        <strong>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <path d="M4 4h16v16H4z"/>
            <path d="M8 8h8M8 12h8M8 16h4"/>
          </svg>
          Accesează Dashboard
        </strong>
        <p>Ai acces la <span class="ticket-highlight">tickete, statistici și noutăți</span>.</p>
        <div class="ticket-features">
          <span class="ticket-feature">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Tickete active
          </span>
          <span class="ticket-feature">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Statistici
          </span>
          <span class="ticket-feature">
            <svg viewBox="0 0 24 24" width="12" height="12">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
            Noutăți
          </span>
        </div>
      </div>
    </div>

   <div class="ticket-step">
      <div class="ticket-step-number">3</div>
      <div class="ticket-step-content">
        <strong>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="2" y="2" width="20" height="20" rx="3"/>
            <path d="M12 8v4l3 3"/>
            <path d="M12 16h.01"/>
          </svg>
          Deschide ticket
        </strong>
        <p>Alege tipul de ticket:</p>
        <div class="ticket-types">
          <div class="ticket-type unban">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            Unban
          </div>
          <div class="ticket-type report">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            Report
          </div>
          <div class="ticket-type request">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <circle cx="12" cy="12" r="10"/>
              <path d="M12 8v4M12 16h.01"/>
            </svg>
            Request
          </div>
          <div class="ticket-type helper">
            <svg viewBox="0 0 24 24" width="14" height="14">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
            </svg>
            Helper
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="ticket-cta">
    <a href="https://wildfire.ro/dashboard" target="_blank" class="ticket-cta-btn primary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="2" y="2" width="20" height="20" rx="3"/>
        <line x1="8" y1="2" x2="8" y2="22"/>
        <line x1="16" y1="2" x2="16" y2="22"/>
        <line x1="2" y1="8" x2="22" y2="8"/>
        <line x1="2" y1="16" x2="22" y2="16"/>
      </svg>
      Deschide Dashboard
    </a>
    <a href="https://wildfire.ro/news" target="_blank" class="ticket-cta-btn secondary">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <polyline points="12 6 12 12 16 14"/>
      </svg>
      Noutăți
    </a>
  </div>
</div>

<!-- FAQ SECTION -->
<div class="faq-section">

  <!-- 1. CUM INTRU PE SERVER? -->
  ### <span style="display: none;">Cum intru pe server</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <polygon points="10 8 16 12 10 16 10 8"/>
    </svg>
    <h3>1. Cum intru pe server?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <polygon points="10 8 16 12 10 16 10 8"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Cum mă conectez?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>Deschizi <span class="underline-effect">Counter-Strike 2</span>, apoi:</p>
      <ul>
        <li>Adaugă la favorite: <span class="underline-effect">go.wildfire.ro:27015</span></li>
        <li>Sau în consolă: <code>connect go.wildfire.ro</code></li>
      </ul>
      <p>Toate serverele sunt <span class="underline-effect">VAC secured</span>, <span class="underline-effect">128 tick</span>.</p>
    </div>
  </div>

  <!-- 2. CE MODURI DE JOC AVEM? -->
  ### <span style="display: none;">Ce moduri de joc sunt disponibile</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="2"/>
      <line x1="8" y1="2" x2="8" y2="22"/>
    </svg>
    <h3>2. Ce moduri de joc avem?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <line x1="8" y1="2" x2="8" y2="22"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Ce servere sunt active?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <div class="server-grid">
        <div class="server-item">
          <div class="server-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
            </svg>
          </div>
          <div class="server-info">
            <div class="server-name">Competitive</div>
            <span class="server-ip">go.wildfire.ro:27015</span>
            <span class="server-status"></span>
          </div>
        </div>
        <div class="server-item">
          <div class="server-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polygon points="10 8 16 12 10 16 10 8"/>
            </svg>
          </div>
          <div class="server-info">
            <div class="server-name">Deathmatch</div>
            <span class="server-ip">go.wildfire.ro:27016</span>
            <span class="server-status"></span>
          </div>
        </div>
        <div class="server-item">
          <div class="server-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M2 12L12 2L22 12L12 22L2 12Z"/>
            </svg>
          </div>
          <div class="server-info">
            <div class="server-name">Retake</div>
            <span class="server-ip">go.wildfire.ro:27017</span>
            <span class="server-status"></span>
          </div>
        </div>
        <div class="server-item">
          <div class="server-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 4L20 20M20 4L4 20"/>
            </svg>
          </div>
          <div class="server-info">
            <div class="server-name">Surf</div>
            <span class="server-ip">În curând</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 3. CUM FUNCȚIONEAZĂ RANK-UL? -->
  ### <span style="display: none;">Cum funcționează rank-ul</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
      <path d="M2 17L12 22L22 17"/>
    </svg>
    <h3>3. Cum funcționează rank-ul?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
          <path d="M2 17L12 22L22 17"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Cum progresez în rank?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>Sistem <span class="underline-effect">ELO propriu</span> bazat pe:</p>
      <ul>
        <li>Câștig/pierdere meci (±25 ELO)</li>
        <li>Performanță (K/D, MVP-uri)</li>
        <li>Contribuție în echipă</li>
      </ul>
      <p>Vezi statistici în <span class="underline-effect">Dashboard</span>.</p>
    </div>
  </div>

  <!-- 4. AM NEVOIE DE VAC/PLUGIN-URI? -->
  ### <span style="display: none;">Am nevoie de VAC sau plugin-uri</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
    <h3>4. Am nevoie de plugin-uri?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Ce software e necesar?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>Serverul e <span class="underline-effect">VAC secured</span>. Plugin-urile se descarcă automat.</p>
      <p>Anti-cheat propriu activ <span class="underline-effect">24/7</span>.</p>
    </div>
  </div>

  <!-- 5. CUM DEVII VIP? -->
  ### <span style="display: none;">Cum devii VIP</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
    <h3>5. Cum devii VIP?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Cum susțin serverul?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>Pe <span class="underline-effect">wildfire.ro/market</span>:</p>
      <ul>
        <li>Fire Coins bonus</li>
        <li>Custom MVP</li>
        <li>Slot-uri prioritare</li>
        <li>Chat exclusiv</li>
      </ul>
    </div>
  </div>

  <!-- 6. CUM RAPORTEZ UN JUCĂTOR? -->
  ### <span style="display: none;">Cum raportez un jucător</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <h3>6. Cum raportez un jucător?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Unde fac reclamatii?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>În <span class="underline-effect">Dashboard</span> la Report Player (cu dovezi).</p>
      <p>În joc: <code>!report nume motiv</code> sau <code>u@</code></p>
    </div>
  </div>

  <!-- 7. CE FACE COMUNITATEA SPECIALĂ? -->
  ### <span style="display: none;">Ce face comunitatea specială</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
      <circle cx="9" cy="7" r="4"/>
    </svg>
    <h3>7. Ce face comunitatea specială?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Ce ne diferențiază?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <ul>
        <li><span class="underline-effect">Oameni faini</span>, zero toxicitate</li>
        <li>Eventuri săptămânale</li>
        <li>Staff activ <span class="underline-effect">24/7</span></li>
        <li>Economie <span class="underline-effect">Fire Coins</span></li>
      </ul>
    </div>
  </div>

  <!-- 8. AM PIERDUT PAROLA? -->
  ### <span style="display: none;">Am pierdut parola</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
    <h3>8. Am pierdut accesul la cont</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
          <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Cum recuperez contul?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>Contul e legat de <span class="underline-effect">Steam ID</span>. Nu există parolă separată.</p>
      <p>Probleme? Deschide ticket la <span class="underline-effect">General Request</span>.</p>
    </div>
  </div>

  <!-- 9. CE ESTE ECONOMIA FIRE COINS? -->
  ### <span style="display: none;">Ce este economia Fire Coins</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
    </svg>
    <h3>9. Ce sunt Fire Coins?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Cum funcționează?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>Monedă virtuală câștigată jucând:</p>
      <ul>
        <li>Meciuri, kill-uri, MVP-uri</li>
        <li>Bonus zilnic</li>
        <li>Misiuni săptămânale</li>
      </ul>
    </div>
  </div>

  <!-- 10. CUM FUNCȚIONEAZĂ MARKET-UL? -->
  ### <span style="display: none;">Cum funcționează market-ul</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="2" y1="12" x2="22" y2="12"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
    </svg>
    <h3>10. Cum funcționează market-ul?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="2" y1="12" x2="22" y2="12"/>
          <line x1="12" y1="2" x2="12" y2="22"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Ce pot face în market?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>Pe <span class="underline-effect">wildfire.ro/market</span> poți:</p>
      <ul>
        <li>Cumpăra iteme cosmetice</li>
        <li>Vinde iteme câștigate</li>
        <li>Transfera Fire Coins</li>
      </ul>
    </div>
  </div>

  <!-- 11. CE TICK-RATE AU SERVERELE? -->
  ### <span style="display: none;">Ce tick-rate au serverele</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="2"/>
      <line x1="8" y1="2" x2="8" y2="22"/>
      <line x1="16" y1="2" x2="16" y2="22"/>
    </svg>
    <h3>11. Ce tick-rate au serverele?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <line x1="8" y1="2" x2="8" y2="22"/>
          <line x1="16" y1="2" x2="16" y2="22"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Ce înseamnă 128 tick?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>Toate serverele rulează la <span class="underline-effect">128 tick</span>:</p>
      <ul>
        <li>Hit registration mai precis</li>
        <li>Mișcare fluidă</li>
        <li>Experiență competitivă</li>
      </ul>
    </div>
  </div>

  <!-- 12. AM GĂSIT UN BUG -->
  ### <span style="display: none;">Am găsit un bug</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <h3>12. Am găsit un bug</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Unde raportez bug-uri?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>În Dashboard la <span class="underline-effect">General Request</span>, selectează "Bug Report".</p>
      <p>În joc: <code>!bug descriere</code></p>
    </div>
  </div>

  <!-- 13. CUM FOLOSESC !REPORT? -->
  ### <span style="display: none;">Cum folosesc !report</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
    <h3>13. Cum folosesc !report?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Cum funcționează în joc?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p><code>!report nume motiv</code></p>
      <p><code>u@</code> - report rapid</p>
      <p><code>!reportlist</code> - vezi status</p>
    </div>
  </div>

  <!-- 14. POT JOCA DE PE TELEFON? -->
  ### <span style="display: none;">Pot juca de pe telefon</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="2" y="2" width="20" height="20" rx="2"/>
      <line x1="8" y1="2" x2="8" y2="22"/>
      <line x1="16" y1="2" x2="16" y2="22"/>
    </svg>
    <h3>14. Pot juca de pe telefon?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="2" y="2" width="20" height="20" rx="2"/>
          <line x1="8" y1="2" x2="8" y2="22"/>
          <line x1="16" y1="2" x2="16" y2="22"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Serverul e compatibil?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <p>Serverele sunt exclusiv pentru <span class="underline-effect">CS2 pe PC</span>.</p>
      <p>Poți accesa site-ul de pe telefon pentru tickete.</p>
    </div>
  </div>

  <!-- 15. EXISTĂ STATISTICI PUBLICE? -->
  ### <span style="display: none;">Există statistici publice</span>
  <div class="faq-title">
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
      <path d="M2 17L12 22L22 17"/>
    </svg>
    <h3>15. Există statistici publice?</h3>
  </div>
  
  <div class="faq-item-custom">
    <div class="faq-question-custom" onclick="this.classList.toggle('active'); this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none';">
      <div class="faq-icon-wrapper">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M12 2L2 7L12 12L22 7L12 2Z"/>
          <path d="M2 17L12 22L22 17"/>
        </svg>
      </div>
      <span class="faq-question-text-custom">Unde pot vedea statistici?</span>
      <svg class="faq-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </div>
    <div class="faq-answer-custom" style="display: none;">
      <ul>
        <li>Dashboard personal</li>
        <li>Top leaderboard public</li>
        <li>În joc: <code>!stats nume</code></li>
      </ul>
    </div>
  </div>
</div>

</div>