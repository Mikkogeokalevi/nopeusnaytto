// V2 NAVIGAATIO — Nominatim + OSRM + ohjepaneeli kartalla (VAIHE 7, kevyt versio)
(function() {
    let route = null, active = false, dest = null;

    function hav(a, b, c, d) {
        const R = 6371000, t = Math.PI / 180;
        const dLa = (c - a) * t, dLo = (d - b) * t;
        const q = Math.sin(dLa / 2) ** 2 + Math.cos(a * t) * Math.cos(c * t) * Math.sin(dLo / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
    }
    const el = (id) => document.getElementById(id);

    window.v2NavGo = function() {
        const q = el('v2-nav-input').value.trim();
        if (!q || !window.v2Pos) { alert('Syota maaranpaan osoite ja odota GPS'); return; }
        el('v2-nav-status').textContent = 'Haetaan...';
        fetch('https://nominatim.openstreetmap.org/search?format=json&countrycodes=fi&limit=1&q=' + encodeURIComponent(q))
            .then((r) => r.json())
            .then((j) => {
                if (!j.length) throw new Error('Maaranpaata ei loydy');
                dest = { lat: +j[0].lat, lng: +j[0].lon, name: j[0].display_name.split(',')[0] };
                const u = 'https://router.project-osrm.org/route/v1/driving/' +
                    window.v2Pos.lng + ',' + window.v2Pos.lat + ';' + dest.lng + ',' + dest.lat +
                    '?overview=full&geometries=geojson&steps=true';
                return fetch(u);
            })
            .then((r) => r.json())
            .then((j) => {
                if (j.code !== 'Ok') throw new Error('Reititys epaonnistui: ' + j.code);
                route = j.routes[0];
                active = true;
                if (window.L && route.geometry) {
                    if (window.v2RouteLayer) window.v2RouteLayer.remove();
                    window.v2RouteLayer = L.polyline(
                        route.geometry.coordinates.map((c) => [c[1], c[0]]),
                        { color: '#ff3b30', weight: 5, opacity: 0.9 }
                    ).addTo(window.v2map || {});
                    if (window.v2map) window.v2map.fitBounds(window.v2RouteLayer.getBounds());
                }
                el('v2-nav-panel').style.display = 'block';
                el('v2-nav-status').textContent = '';
                v2NavTick();
            })
            .catch((e) => { el('v2-nav-status').textContent = e.message; });
    };

    window.v2NavStop = function() {
        active = false; route = null;
        el('v2-nav-panel').style.display = 'none';
        if (window.v2RouteLayer) { window.v2RouteLayer.remove(); window.v2RouteLayer = null; }
    };

    window.v2NavTick = function() {
        if (!active || !route || !window.v2Pos) return;
        const rem = route.distance || 0;
        const d = hav(window.v2Pos.lat, window.v2Pos.lng, dest.lat, dest.lng);
        const instr = (route.legs && route.legs[0] && route.legs[0].steps[0])
            ? (route.legs[0].steps[0].maneuver.instruction || 'Jatka')
            : 'Jatka';
        el('v2-nav-instr').textContent = instr;
        el('v2-nav-info').textContent = dest.name + ' · ' + (d / 1000).toFixed(1) + ' km (' + (rem / 1000).toFixed(1) + ' km reittia)';
        if (d < 40) { v2NavStop(); el('v2-nav-status').textContent = 'Perilla!'; }
    };

    // Integraatio: kartta + GPS-tikki
    const origTick = window.v2MapUpdate;
    window.v2MapUpdate = function(lat, lng) {
        if (typeof origTick === 'function') origTick(lat, lng);
        v2NavTick();
    };
})();
