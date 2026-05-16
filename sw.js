// v3 - force clear all caches
const CACHE = 'bets-v3';
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.map(k => caches.delete(k)))));
  self.clients.claim();
});
self.addEventListener('fetch', e => {
  if (e.request.url.includes('googleapis.com') || e.request.url.includes('jsdelivr')) return;
  e.respondWith(fetch(e.request).catch(() => new Response('', {status: 404})));
});
