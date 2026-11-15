const CACHE = 'crew-health-workspace-v4';
const ASSETS = ['index.html','styles.css','favicon.svg','i18n.js','ui-text.js','core.js','planner-core.js','app.js','planning.js'];
self.addEventListener('install', event => event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS))));
self.addEventListener('activate', event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('crew-health-') && key !== CACHE).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;
  if (event.request.mode === 'navigate') event.respondWith(fetch(event.request).catch(() => caches.match('index.html')));
  else event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request)));
});
