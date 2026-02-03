// =========================================================
// SW.JS - SERVICE WORKER (OFFLINE-LATAUS) v6.14 ANIMATED SPEEDOMETER
// =========================================================

const CACHE_NAME = 'ajopro-v6.14-animated'; // Versionosto pakottaa päivityksen
const urlsToCache = [
    './',
    './index.html',
    './manifest.json',
    './style.css',
    
    // Javascript-moduulit
    './globals.js',
    './visuals.js', // UUSI v6.14
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
    self.clients.claim();
});

// 3. FETCH (VERKKO PYYNNÖT)
self.addEventListener('fetch', (event) => {
    const requestUrl = new URL(event.request.url);

    // --- TÄRKEÄ KORJAUS IPHONE/FIREBASE LOGINILLE ---
    // Jos pyyntö menee Googlelle tai Firebaselle, ohita välimuisti kokonaan.
    // Tämä estää "AuthError / network-request-failed" -virheen.
    if (requestUrl.origin.includes('googleapis.com') || 
        requestUrl.origin.includes('firebase') || 
        requestUrl.origin.includes('google.com') ||
        requestUrl.origin.includes('accounts.google.com')) {
        
        event.respondWith(fetch(event.request));
        return;
    }
    // -----------------------------------------------

    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Palauta välimuistista jos löytyy, muuten hae verkosta
                if (response) {
                    return response;
                }
                return fetch(event.request).catch(() => {
                    // Jos verkkopyyntö epäonnistuu (esim. offline), ei tehdä mitään erityistä
                    // tai palautetaan offline-sivu jos sellainen olisi.
                });
            })
    );
});
