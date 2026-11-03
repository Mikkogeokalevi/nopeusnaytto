// V2 KARTTA — Leaflet + tumma Carto-tile, seurantamarkeri + reittiviiva (VAIHE 7)
(function() {
    let map = null, marker = null, track = null, inited = false;

    window.v2InitMap = function() {
        if (inited || !window.L) return;
        inited = true;
        map = L.map('v2-map', { zoomControl: false, attributionControl: false }).setView([61.5, 23.8], 6);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19, subdomains: 'abcd'
        }).addTo(map);
        marker = L.circleMarker([0, 0], { radius: 8, color: '#fff', weight: 2, fillColor: '#2979ff', fillOpacity: 1 }).addTo(map);
        track = L.polyline([], { color: '#2979ff', weight: 4, opacity: 0.85 }).addTo(map);
        if (window.v2Pos) map.setView([window.v2Pos.lat, window.v2Pos.lng], 15);
        setTimeout(() => map.invalidateSize(), 200);
    };

    window.v2MapUpdate = function(lat, lng) {
        if (!map) return;
        marker.setLatLng([lat, lng]);
        map.panTo([lat, lng], { animate: false });
    };

    window.v2MapTrack = function(pts) {
        if (!track || !pts.length) return;
        track.setLatLngs(pts.map((p) => [p.lat, p.lng]));
    };

    // Alusta kartta kun Kartta-tab avataan
    document.querySelectorAll('.v2-tab').forEach((t) => {
        t.addEventListener('click', () => {
            if (t.dataset.view === 'v2-view-map') setTimeout(v2InitMap, 50);
        });
    });
})();
