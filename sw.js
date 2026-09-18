// Service Worker Cache Offline untuk Layang Kas (Kopontren) Gus Lim
const CACHE_NAME = 'kopontren-v32';
// PENTING: mung aset sing DI-DEPLOY (ora ing .gitignore) sing kena di-cache.
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-192-maskable.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Individual catch - yen salah siji file 404, install tetep sukses
      return Promise.all(
        ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Skip cache:', url, err))
        )
      );
    })
  );
  self.skipWaiting();
});

// Item 27/18: terima perintah SKIP_WAITING dari banner update di UI
self.addEventListener('message', (e) => {
  if (e.data && e.data.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  // Mung handle GET - POST/request liyane dibiarkan lewat
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  // Network-first untuk HTML (selalu fresh dari server)
  if (e.request.mode === 'navigate' || url.pathname.endsWith('.html')) {
    e.respondWith(
      fetch(e.request).then((res) => {
        const copy = res.clone();
        caches.open(CACHE_NAME).then((c) => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match('./index.html'))
    );
    return;
  }
  // Cache-first untuk aset statis (logo, icon, dll)
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request).catch(() => caches.match('./index.html'));
    })
  );
});