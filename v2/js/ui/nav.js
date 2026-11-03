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

    // Offline-reittivalimuisti (v0.14): viimeisin onnistunut reitti per maaranpaa
    function v2CacheRoute(name, destObj, r) {
        try {
            const c = JSON.parse(localStorage.getItem('v2RouteCache') || '{}');
            c[name.toLowerCase()] = { dest: destObj, route: r, ts: Date.now() };
            const keys = Object.keys(c);
            if (keys.length > 15) delete c[keys[0]]; // vanhin pois
            localStorage.setItem('v2RouteCache', JSON.stringify(c));
        } catch (e) {}
    }
    function v2CachedRoute(name) {
        try {
            const c = JSON.parse(localStorage.getItem('v2RouteCache') || '{}');
            const e = c[name.toLowerCase()];
            return (e && Date.now() - e.ts < 7 * 86400000) ? e : null; // 7 vrk
        } catch (e) { return null; }
    }

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
            .then(() => { if (route && dest) v2CacheRoute(q, dest, route); })
            .catch((e) => {
                // Offline-fallback: kayta valimuistin reittia samalle maaranpaalle
                const cached = v2CachedRoute(q);
                if (cached) {
                    dest = cached.dest; route = cached.route; active = true;
                    if (window.L && route.geometry) {
                        if (window.v2RouteLayer) window.v2RouteLayer.remove();
                        window.v2RouteLayer = L.polyline(
                            route.geometry.coordinates.map((c2) => [c2[1], c2[0]]),
                            { color: '#ff3b30', weight: 5, opacity: 0.9 }
                        ).addTo(window.v2map || {});
                        if (window.v2map) window.v2map.fitBounds(window.v2RouteLayer.getBounds());
                    }
                    el('v2-nav-panel').style.display = 'block';
                    el('v2-nav-status').textContent = 'Offline-reitti (valimuisti)';
                    v2NavTick();
                } else {
                    el('v2-nav-status').textContent = e.message;
                }
            });
    };

    window.v2NavStop = function() {
        active = false; route = null;
        el('v2-nav-panel').style.display = 'none';
        const dp = el('v2-dash-nav');
        if (dp) dp.style.display = 'none';
        if (window.v2RouteLayer) { window.v2RouteLayer.remove(); window.v2RouteLayer = null; }
    };

    window.v2NavTick = function() {
        if (!active || !route || !window.v2Pos) return;
        const rem = route.distance || 0;
        const d = hav(window.v2Pos.lat, window.v2Pos.lng, dest.lat, dest.lng);
        const instr = (route.legs && route.legs[0] && route.legs[0].steps[0])
            ? (route.legs[0].steps[0].maneuver.instruction || 'Jatka')
            : 'Jatka';
        if (instr !== (window._v2LastInstr || '')) {
            window._v2LastInstr = instr;
            const st = route.legs && route.legs[0] && route.legs[0].steps[0];
            const key = (typeof window.v2SpeechKey === 'function' && st) ? window.v2SpeechKey(st) : null;
            const text = (typeof window.v2InstrText === 'function' && key)
                ? window.v2InstrText(key, [['exit', (st.maneuver && st.maneuver.exit) || '1']])
                : instr;
            if (typeof window.v2Speak === 'function') window.v2Speak(text);
        }
        el('v2-nav-instr').textContent = instr;
        el('v2-nav-info').textContent = dest.name + ' · ' + (d / 1000).toFixed(1) + ' km (' + (rem / 1000).toFixed(1) + ' km reittia)';
        // Mittariston nav-palkki (v0.13)
        const dp = el('v2-dash-nav');
        if (dp) {
            dp.style.display = 'flex';
            const di = el('v2-dash-nav-instr'), dn = el('v2-dash-nav-info');
            if (di) di.textContent = instr;
            if (dn) dn.textContent = dest.name + ' · ' + (d / 1000).toFixed(1) + ' km';
        }
        if (d < 40) { v2NavStop(); el('v2-nav-status').textContent = 'Perilla!'; }
    };

    // Integraatio: kartta + GPS-tikki
    const origTick = window.v2MapUpdate;
    window.v2MapUpdate = function(lat, lng) {
        if (typeof origTick === 'function') origTick(lat, lng);
        v2NavTick();
    };
})();
