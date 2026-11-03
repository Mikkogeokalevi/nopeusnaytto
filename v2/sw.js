// V2 Service Worker — cache-first staattiset, network-first HTML
const V2_CACHE = 'ajopro-v2-0.8.0';
const V2_ASSETS = [
    './', './index.html', './manifest.json',
    './css/app.css',
    './js/core/firebase.js', './js/core/perms.js', './js/core/auth.js', './js/core/version.js',
    './js/ui/dashboard.js', './js/ui/map.js', './js/ui/history.js', './js/ui/cars.js',
    './js/admin/admin.js',
    './assets/ajopaivakirja_logo.png'
];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(V2_CACHE).then((c) => c.addAll(V2_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
    e.waitUntil(caches.keys().then((keys) =>
        Promise.all(keys.filter((k) => k.indexOf('ajopro-v2-') === 0 && k !== V2_CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim()));
});

self.addEventListener('fetch', (e) => {
    if (e.request.method !== 'GET') return;
    const url = e.request.url;
    // Firebase & API:t aina verkosta
    if (url.indexOf('firebase') !== -1 || url.indexOf('firebasedatabase') !== -1 || url.indexOf('overpass') !== -1 || url.indexOf('osrm') !== -1 || url.indexOf('basemaps') !== -1) return;
    // HTML network-first
    if (e.request.mode === 'navigate' || url.indexOf('index.html') !== -1) {
        e.respondWith(fetch(e.request).then((r) => {
            const c = r.clone(); caches.open(V2_CACHE).then((ca) => ca.put(e.request, c));
            return r;
        }).catch(() => caches.match(e.request)));
        return;
    }
    e.respondWith(caches.match(e.request).then((m) => m || fetch(e.request)));
});
