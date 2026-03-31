---
outline: deep
---

<CaseHeader 
  title="Changelogs Wikipedia"
  :tags="[
    { text: 'information', component: 'PageTagRed' },
    { text: 'connect', component: 'PageTagGreen' },
    { text: 'faq', component: 'PageTagPurple' }
  ]"
  :path="['Home', 'Updates', 'Changelogs']"
  background="/wallpaper/backgroundwf.webp"
  :blur-amount="6"
  icon="/icons/wildfire.webp"
  page-id="changelogs-wikipedia"
  badge-text="Updates"
  badge-icon="lucide:git-commit"
/>

<Changelogs />