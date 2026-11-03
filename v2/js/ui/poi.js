// V2 POI — lukee poi/{uid} (jaettu V1:n kanssa), merkit kartalle + lahestymishalytys
(function() {
    let pois = [], markers = [], armed = {};
    const TYPE_ICON = { speedcamera: '📷', danger: '⚠️', customer: '🏠', reminder: '🔔', other: '📍' };

    function hav(a, b, c, d) {
        const R = 6371000, t = Math.PI / 180;
        const dLa = (c - a) * t, dLo = (d - b) * t;
        const q = Math.sin(dLa / 2) ** 2 + Math.cos(a * t) * Math.cos(c * t) * Math.sin(dLo / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
    }
    const g = (o, ks) => { for (const k of ks) if (o && o[k] !== undefined) return o[k]; return null; };

    window.v2LoadPois = function() {
        if (!v2Perms.user) return;
        window.v2db.ref('poi/' + v2Perms.user.uid).once('value').then((snap) => {
            pois = [];
            snap.forEach((c) => {
                const p = c.val() || {};
                const lat = g(p, ['lat', 'latitude']), lng = g(p, ['lng', 'lon', 'longitude']);
                if (lat == null || lng == null) return;
                pois.push({ id: c.key, lat: +lat, lng: +lng, name: p.name || p.label || '', type: p.type || 'other' });
            });
            renderMarkers();
        }).catch(() => {});
    };

    function renderMarkers() {
        if (!window.v2map) return;
        markers.forEach((m) => m.remove()); markers = [];
        pois.forEach((p) => {
            const m = L.circleMarker([p.lat, p.lng], {
                radius: 7, color: '#ffc107', weight: 2, fillColor: '#ffc107', fillOpacity: 0.35
            }).addTo(window.v2map);
            m.bindTooltip((TYPE_ICON[p.type] || '📍') + ' ' + (p.name || p.type), { permanent: false });
            markers.push(m);
        });
        const c = document.getElementById('v2-poi-count');
        if (c) c.textContent = pois.length ? pois.length + ' paikkamerkintaa' : '';
    }

    // Lahestymishalytys: <150 m ilmoittaa kerran, uusiutus >300 m paassa
    window.v2PoiTick = function(lat, lng) {
        for (const p of pois) {
            const d = hav(lat, lng, p.lat, p.lng);
            if (d < 150 && armed[p.id] !== false) {
                armed[p.id] = false;
                if (typeof window.v2Speak === 'function') {
                    window.v2Speak(p.type === 'speedcamera' ? 'Nopeuskamera' : (p.name || 'Paikkamerkinta'));
                }
            } else if (d > 300) {
                armed[p.id] = true;
            }
        }
    };

    // Kytkenta GPS-tikkiin (dashboard paivittaa window.v2Pos -> mapUpdate)
    const orig = window.v2MapUpdate;
    window.v2MapUpdate = function(lat, lng) {
        if (typeof orig === 'function') orig(lat, lng);
        v2PoiTick(lat, lng);
    };

    window.v2auth && window.v2auth.onAuthStateChanged((u) => { if (u) setTimeout(v2LoadPois, 900); });
})();
