// V2 Service Worker — cache-first staattiset, network-first HTML
const V2_CACHE = 'ajopro-v2-0.25.0';
const V2_ASSETS = [
    './', './index.html', './manifest.json',
    './css/app.css?v=0.25.0',
    './js/core/firebase.js?v=0.25.0', './js/core/perms.js?v=0.25.0', './js/core/auth.js?v=0.25.0', './js/core/version.js?v=0.25.0',
    './js/ui/dashboard.js?v=0.25.0', './js/ui/map.js?v=0.25.0', './js/ui/history.js?v=0.25.0', './js/ui/cars.js?v=0.25.0',
    './js/ui/nav.js?v=0.25.0', './js/ui/speech.js?v=0.25.0', './js/ui/speechpacks.js?v=0.25.0', './js/ui/poi.js?v=0.25.0',
    './js/admin/admin.js?v=0.25.0',
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
