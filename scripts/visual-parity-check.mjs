import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const VIEWPORTS = [
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '1440x900',  width: 1440, height: 900 },
  { name: '1280x720',  width: 1280, height: 720 },
  { name: '1024x768',  width: 1024, height: 768 },
  { name: '768x1024',  width: 768,  height: 1024 },
  { name: '390x844',   width: 390,  height: 844 },
  { name: '375x667',   width: 375,  height: 667 },
];

const PAGES = [
  { name: 'homepage',    sourceUrl: 'http://localhost:3000/docs',                  targetUrl: 'http://localhost:3002/' },
  { name: 'doc_page',    sourceUrl: 'http://localhost:3000/docs/informatii/about', targetUrl: 'http://localhost:3002/informatii/about' },
  { name: 'team',        sourceUrl: 'http://localhost:3000/docs/team',             targetUrl: 'http://localhost:3002/team/' },
  { name: 'changelog',   sourceUrl: 'http://localhost:3000/changelog',             targetUrl: 'http://localhost:3002/changelog/' },
  { name: 'maintenance', sourceUrl: 'http://localhost:3000/maintenance',           targetUrl: 'http://localhost:3002/maintenance/' },
];

const outDir = path.resolve(process.cwd(), 'visual-diff', 'screenshots');
fs.mkdirSync(outDir, { recursive: true });

async function run() {
  console.log('Launching browser (Microsoft Edge)...');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const measurements = [];

  for (const pageConfig of PAGES) {
    console.log(`\n=== Testing Page: ${pageConfig.name} ===`);
    
    for (const vp of VIEWPORTS) {
      console.log(`  Viewport ${vp.name} (${vp.width}x${vp.height})...`);
      
      const contextSource = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      const contextTarget = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
      
      const pageSrc = await contextSource.newPage();
      const pageTgt = await contextTarget.newPage();

      try {
        await Promise.all([
          pageSrc.goto(pageConfig.sourceUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }),
          pageTgt.goto(pageConfig.targetUrl, { waitUntil: 'domcontentloaded', timeout: 15000 }),
        ]);

        await pageSrc.waitForTimeout(1000);
        await pageTgt.waitForTimeout(1000);

        const srcPath = path.join(outDir, `src_${pageConfig.name}_${vp.name}.png`);
        const tgtPath = path.join(outDir, `tgt_${pageConfig.name}_${vp.name}.png`);

        await pageSrc.screenshot({ path: srcPath, fullPage: false });
        await pageTgt.screenshot({ path: tgtPath, fullPage: false });

        if (vp.name === '1920x1080') {
          const srcMetrics = await pageSrc.evaluate(() => {
            const header = document.querySelector('header, .header, .docs-header, .maintenance-natural-nav');
            const sidebar = document.querySelector('.docs-sidebar, .sidebar');
            const toc = document.querySelector('.toc, .table-of-contents, .doc-toc');
            const content = document.querySelector('.docs-content, .docs-home, .changelog-container, .maintenance-natural-main');
            return {
              headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
              sidebarWidth: sidebar ? Math.round(sidebar.getBoundingClientRect().width) : null,
              tocWidth: toc ? Math.round(toc.getBoundingClientRect().width) : null,
              contentWidth: content ? Math.round(content.getBoundingClientRect().width) : null,
            };
          });

          const tgtMetrics = await pageTgt.evaluate(() => {
            const header = document.querySelector('header, .header, .docs-header, .maintenance-natural-nav');
            const sidebar = document.querySelector('.docs-sidebar, .sidebar');
            const toc = document.querySelector('.toc, .table-of-contents, .doc-toc');
            const content = document.querySelector('.docs-content, .docs-home, .changelog-container, .maintenance-natural-main');
            return {
              headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
              sidebarWidth: sidebar ? Math.round(sidebar.getBoundingClientRect().width) : null,
              tocWidth: toc ? Math.round(toc.getBoundingClientRect().width) : null,
              contentWidth: content ? Math.round(content.getBoundingClientRect().width) : null,
            };
          });

          measurements.push({
            page: pageConfig.name,
            viewport: vp.name,
            srcMetrics,
            tgtMetrics,
            matched: JSON.stringify(srcMetrics) === JSON.stringify(tgtMetrics),
          });

          console.log(`    Src Metrics:`, JSON.stringify(srcMetrics));
          console.log(`    Tgt Metrics:`, JSON.stringify(tgtMetrics));
          console.log(`    MATCH:`, JSON.stringify(srcMetrics) === JSON.stringify(tgtMetrics) ? 'PERFECT 1:1' : 'MISMATCH');
        }

      } catch (err) {
        console.error(`Error on ${pageConfig.name} at ${vp.name}:`, err.message);
      } finally {
        await contextSource.close();
        await contextTarget.close();
      }
    }
  }

  // Also test Search Modal
  console.log('\n=== Testing Search Modal ===');
  const searchCtxSrc = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const searchCtxTgt = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const searchPageSrc = await searchCtxSrc.newPage();
  const searchPageTgt = await searchCtxTgt.newPage();

  try {
    await searchPageSrc.goto('http://localhost:3000/docs', { waitUntil: 'domcontentloaded' });
    await searchPageTgt.goto('http://localhost:3002/', { waitUntil: 'domcontentloaded' });

    await searchPageSrc.keyboard.press('Control+KeyK');
    await searchPageTgt.keyboard.press('Control+KeyK');

    await searchPageSrc.waitForTimeout(600);
    await searchPageTgt.waitForTimeout(600);

    await searchPageSrc.screenshot({ path: path.join(outDir, 'src_search_modal_1920x1080.png') });
    await searchPageTgt.screenshot({ path: path.join(outDir, 'tgt_search_modal_1920x1080.png') });
    console.log('Search modal screenshots captured successfully!');
  } catch (e) {
    console.error('Search modal test error:', e.message);
  } finally {
    await searchCtxSrc.close();
    await searchCtxTgt.close();
  }

  await browser.close();

  fs.writeFileSync(
    path.join(process.cwd(), 'visual-diff', 'metrics-report.json'),
    JSON.stringify(measurements, null, 2)
  );

  console.log('\nAll screenshots and metrics saved to visual-diff/ directory!');
}

run().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
