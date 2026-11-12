const CACHE="startup-v6";
const FILES=["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","apple-touch-icon.png","splash.jpg"];
self.addEventListener("install",e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))));self.clients.claim()});
self.addEventListener("fetch",e=>{
  if(e.request.method!=="GET")return;
  const u=new URL(e.request.url);
  // Let the browser stream video itself (range requests) — needed for iPhone.
  if(u.pathname.endsWith(".mp4")||e.request.headers.has("range"))return;
  e.respondWith(fetch(e.request).then(r=>{const c=r.clone();if(u.origin===location.origin&&r.ok)caches.open(CACHE).then(x=>x.put(e.request,c));return r}).catch(()=>caches.match(e.request).then(r=>r||caches.match("index.html"))));
});
