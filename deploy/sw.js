const CACHE = 'korfu2026-v1';

// Alle lokalen Dateien die offline verfügbar sein sollen
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png',
  './favicon.png',
  // Avatar-Bilder (die 18 aktiven)
  './av-airport.png',
  './av-faehre.png',
  './av-abend.png',
  './av-strand.png',
  './av-taverna.png',
  './av-city-fam.png',
  './av-ksamil-strand.png',
  './av-bar.png',
  './av-aqualand.png',
  './av-kids-sport.png',
  './av-kids-swim.png',
  './av-kids-city.png',
  './av-kids-strand.png',
  './av-eltern-jetski.png',
  './av-eltern-pool.png',
  './av-eltern-swim.png',
  './av-eltern-taverna.png',
  './av-eltern-strand.png',
];

// Installation: alle Assets in den Cache laden
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Aktivierung: alten Cache löschen
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: erst Cache, dann Netzwerk (Offline-first für lokale Dateien)
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // Externe URLs (Wikimedia-Fotos, CDN-Fonts) — nur Netzwerk, kein Cache
  if (url.origin !== self.location.origin) {
    e.respondWith(fetch(e.request).catch(() => new Response('', { status: 408 })));
    return;
  }

  // Lokale Dateien: Cache-first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
