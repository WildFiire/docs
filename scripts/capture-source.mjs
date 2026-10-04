import fs from 'node:fs';
import {pathToFileURL} from 'node:url';
import os from 'node:os';
import path from 'node:path';
import {spawn} from 'node:child_process';
import {chromium} from 'playwright-core';
const source='C:/Users/iannc/Desktop/wf-docscore';
const fixture=fs.mkdtempSync(path.join(os.tmpdir(),'wf-source-visual-'));
// The source checkout is read only. Next runs from an isolated copy outside the target.
fs.cpSync(path.join(source,'.next'),path.join(fixture,'.next'),{recursive:true,filter:p=>!/[\\/](cache|dev|diagnostics|types)([\\/]|$)/.test(p)});
fs.copyFileSync(path.join(source,'package.json'),path.join(fixture,'package.json'));
fs.symlinkSync(path.join(source,'node_modules'),path.join(fixture,'node_modules'),'junction');
fs.symlinkSync(path.join(source,'public'),path.join(fixture,'public'),'junction');
fs.cpSync(path.join(source,'content/docs'),path.join(fixture,'content/docs'),{recursive:true});
const guard=path.join(fixture,'read-only-network.mjs');
fs.writeFileSync(guard,`const original=globalThis.fetch;globalThis.fetch=(url,options={})=>{if(!['GET','HEAD'].includes(options.method||'GET'))throw Error('External writes disabled for visual comparison');return original(url,options)};`);
const child=spawn(process.execPath,['--import',pathToFileURL(guard).href,path.join(source,'node_modules/next/dist/bin/next'),'start','-p','4174','-H','127.0.0.1'],{cwd:fixture,windowsHide:true,env:{...process.env,NODE_ENV:'production',NEXT_TELEMETRY_DISABLED:'1'},stdio:['ignore','pipe','pipe']});
let logs='',browser;child.stdout.on('data',b=>logs+=b);child.stderr.on('data',b=>logs+=b);
try{
 for(let i=0;i<100;i++){if(child.exitCode!==null)throw Error(logs);try{const r=await fetch('http://127.0.0.1:4174');if(r.status<500)break}catch{}await new Promise(r=>setTimeout(r,100))}
 browser=await chromium.launch({channel:'msedge',headless:true});const context=await browser.newContext({reducedMotion:'reduce'});const page=await context.newPage();
 fs.mkdirSync('migration/test-results/source-screenshots',{recursive:true});
 for(const [name,route] of [['home','/docs'],['document','/docs/currency/credits'],['admin-login','/admin/login']])for(const width of [1920,1440,1280,768,390,375])for(const theme of ['dark','light']){
   await page.setViewportSize({width,height:1000});await page.goto('http://127.0.0.1:4174'+route);await page.evaluate(theme=>{localStorage.setItem('theme',theme);document.documentElement.setAttribute('data-theme',theme)},theme);await page.waitForTimeout(200);await page.screenshot({path:`migration/test-results/source-screenshots/${name}-${width}-${theme}.png`,fullPage:true});
 }
 console.log('Captured source home, document and login at six widths in both themes.');
}finally{if(browser)await browser.close();child.kill();fs.mkdirSync('migration/test-results',{recursive:true});fs.writeFileSync('migration/test-results/source-preview.json',JSON.stringify({fixture,source,node:process.version}));fs.writeFileSync('migration/test-results/source-preview.log',logs)}
