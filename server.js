// Stable PM2 entrypoint: /var/www/wiki/server.js, port 3000.
import { config } from 'dotenv';
config({quiet:true});
if (process.env.WF_DISABLE_EXTERNAL_WRITES === '1') {
  const originalFetch = globalThis.fetch;
  globalThis.fetch = (input,options={}) => {
    const url=new URL(typeof input==='string'?input:input instanceof URL?input.href:input.url);
    const method=String(options.method || 'GET').toUpperCase();
    if(!['GET','HEAD'].includes(method)&&!['localhost','127.0.0.1','::1'].includes(url.hostname))throw new Error('External writes disabled for local verification');
    return originalFetch(input,options);
  };
}
const {createApp}=await import('./server/.build/app.mjs');
const port = Number(process.env.PORT || 3000);
const server = createApp().listen(port, () => console.log(`Wildfire API listening on port ${port}`));
for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));

