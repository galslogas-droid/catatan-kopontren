// Service Worker Cache Offline untuk Kopontren Gus Lim
const CACHE_NAME = 'kopontren-v23';
// PENTING: mung asèt sing DI-DEPLOY (ora ing .gitignore) sing kena di-cache.
// logo-kopontren.svg ora direferensi HTML + di-gitignore → ora di-cache.
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.svg',
  './icon-512.svg',
  './icon-180.png'
];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Individual catch — yen salah siji file 404, install tetep sukses
      return Promise.all(
        ASSETS.map(url =>
          cache.add(url).catch(err => console.warn('[SW] Skip cache:', url, err))
        )
      );
    })
  );
  self.skipWaiting();
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
  // Mung handle GET — POST/request liyane dibiarkan lewat
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