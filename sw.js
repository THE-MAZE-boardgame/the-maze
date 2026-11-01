/* THE MAZE service worker: caches the game so it works offline after the first visit.
   Change VERSION when you upload a new index.html, so everyone gets the update. */
const VERSION='maze-v3';
const FILES=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(VERSION).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==VERSION).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
 if(e.request.method!=='GET')return;
 e.respondWith(caches.open(VERSION).then(async c=>{
  const hit=await c.match(e.request,{ignoreSearch:true})||(e.request.mode==='navigate'?await c.match('./index.html'):undefined);
  const net=fetch(e.request).then(r=>{if(r&&r.ok&&new URL(e.request.url).origin===location.origin)c.put(e.request,r.clone());return r}).catch(()=>hit);
  return hit||net}))});
