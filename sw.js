// v4 - network first, always fresh
const CACHE = 'liga-v4';

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k))))
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Skip external APIs
  if (e.request.url.includes('googleapis.com') ||
      e.request.url.includes('jsdelivr.net') ||
      e.request.url.includes('firebasedatabase.app')) return;

  // Network first — if offline, try cache
  e.respondWith(
    fetch(e.request)
      .then(res => {
        // Cache a copy for offline
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
