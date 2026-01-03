// =========================================================
// SW.JS - SERVICE WORKER (OFFLINE-LATAUS) v5.99-CLEAN
// =========================================================

const CACHE_NAME = 'ajopro-v5.99-clean';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './style.css',
    
    // Javascript-moduulit (HUOM: fuel.js POISTETTU)
    './globals.js',
    './ui.js',
    './auth.js',
    './map.js',
    './gps.js',
    './garage.js',
    './history.js',
    './help.js',
    './app.js',

    // Kuvat ja ikonit
    './ajopaivakirja_logo.png',
    './ajopaivakirja_logo_mu.png',
    './alareunakuva.png',
    './alareunakuva_mu.png',

    // Ulkoiset kirjastot
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js'
];

// 1. ASENNUS
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

// 2. AKTIVOINTI
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// 3. HAKU
self.addEventListener('fetch', (event) => {
    if (!event.request.url.startsWith('http')) return;
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request).catch(() => console.log("Offline")))
    );
});
