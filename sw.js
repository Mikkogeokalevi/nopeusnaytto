// =========================================================
// SW.JS - SERVICE WORKER (OFFLINE-LATAUS) v5.99c
// =========================================================

const CACHE_NAME = 'ajopro-v5.99-final';
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './style.css',
    
    // Javascript-tiedostot
    './globals.js',
    './ui.js',
    './auth.js',
    './map.js',
    './gps.js',
    './garage.js',
    './history.js',
    './help.js',
    './fuel.js',
    './app.js',

    // Kuvat (Tärkeät!)
    './ajopaivakirja_logo.png',
    './ajopaivakirja_logo_mu.png',
    './alareunakuva.png',
    './alareunakuva_mu.png',

    // Ulkoiset kirjastot (Nämä pitää myös tallentaa, jotta toimii ilman nettiä)
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://cdn.jsdelivr.net/npm/chart.js',
    // Firebase-kirjastot (Core)
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js',
    'https://www.gstatic.com/firebasejs/9.23.0/firebase-database-compat.js'
];

// 1. ASENNUS: Ladataan tiedostot välimuistiin
self.addEventListener('install', (event) => {
    console.log('[ServiceWorker] Asennetaan...');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[ServiceWorker] Ladataan tiedostot välimuistiin');
                return cache.addAll(urlsToCache);
            })
            .catch(err => console.error('[ServiceWorker] Välimuistin lataus epäonnistui:', err))
    );
    self.skipWaiting();
});

// 2. AKTIVOINTI: Siivotaan vanhat versiot pois
self.addEventListener('activate', (event) => {
    console.log('[ServiceWorker] Aktivoidaan...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[ServiceWorker] Poistetaan vanha cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    return self.clients.claim();
});

// 3. HAKU: Palvellaan tiedostot muistista, jos nettiä ei ole
self.addEventListener('fetch', (event) => {
    // Vain http/https pyynnöt
    if (!event.request.url.startsWith('http')) return;

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Löytyi välimuistista -> Palauta se
                if (response) {
                    return response;
                }
                // Ei löytynyt -> Hae netistä
                return fetch(event.request).catch(() => {
                    // Jos netti ei toimi EIKÄ tiedostoa ole muistissa
                    console.log("[ServiceWorker] Offline, puuttuva tiedosto: ", event.request.url);
                });
            })
    );
});
