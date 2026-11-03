// V2 MITTARISTO — live GPS-nopeus premium-naytolle (VAIHE 3/4)
// Sessioseuranta (huippu/matka/aika/keskiarvo) lokaalisti; historia kytketaan VAIHEESSA 7.
(function() {
    let watchId = null, started = false;
    let rec = { on: false, dist: 0, max: 0, t0: 0, pts: [] };
    const el = (id) => document.getElementById(id);

    function fmtDur(ms) {
        const s = Math.floor(ms / 1000);
        const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
        return (h ? h + ':' + String(m).padStart(2, '0') : '') + String(m).padStart(2, '0') + ':' + String(ss).padStart(2, '0');
    }
    function hav(a, b, c, d) {
        const R = 6371000, t = Math.PI / 180;
        const dLa = (c - a) * t, dLo = (d - b) * t;
        const q = Math.sin(dLa / 2) ** 2 + Math.cos(a * t) * Math.cos(c * t) * Math.sin(dLo / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
    }
    function setBadge(txt, cls) {
        const b = el('v2-gps-badge');
        if (b) { b.textContent = txt; b.className = 'v2-badge ' + (cls || ''); }
    }
    function toGC(lat, latAxis) {
        const a = Math.abs(lat), dg = Math.floor(a), mn = ((a - dg) * 60).toFixed(3);
        return (latAxis ? (lat >= 0 ? 'N' : 'S') : (lat >= 0 ? 'E' : 'W')) + ' ' + dg + '° ' + mn;
    }

    function onPos(pos) {
        const c = pos.coords;
        const kmh = (typeof c.speed === 'number' && c.speed >= 0) ? c.speed * 3.6 : 0;
        const n = el('v2-speed-num');
        if (n && n._l !== kmh.toFixed(1)) { n._l = kmh.toFixed(1); n.textContent = n._l; }

        const acc = c.accuracy;
        if (typeof acc === 'number') {
            setBadge(acc <= 20 ? 'GPS A' : acc <= 45 ? 'GPS B' : 'GPS C', acc <= 20 ? 'ok' : acc <= 45 ? 'warn' : 'err');
        }
        const co = el('v2-coords');
        if (co) co.textContent = toGC(c.latitude, true) + '  ' + toGC(c.longitude, false);
        const hd = el('v2-heading');
        if (hd) hd.textContent = (typeof c.heading === 'number' && !isNaN(c.heading)) ? Math.round(c.heading) + '°' : '--';
        const al = el('v2-alt');
        if (al) al.textContent = (typeof c.altitude === 'number' && c.altitude !== null) ? Math.round(c.altitude) + ' m' : '--';

        if (rec.on) {
            const last = rec.pts[rec.pts.length - 1];
            if (kmh > rec.max) rec.max = kmh;
            if (last && kmh > 2) {
                const d = hav(last.lat, last.lng, c.latitude, c.longitude);
                if (d < 500) rec.dist += d;
            }
            if (!last || pos.timestamp - last.ts > 3000) rec.pts.push({ lat: c.latitude, lng: c.longitude, ts: pos.timestamp });
            if (rec.pts.length > 3000) rec.pts.splice(0, rec.pts.length - 3000);
        }
        v2RefreshRec();
    }

    function v2RefreshRec() {
        const t = el('v2-rec-time');
        if (!t) return;
        const dur = rec.on ? Date.now() - rec.t0 : 0;
        t.textContent = fmtDur(dur);
        const m = el('v2-rec-max'); if (m) m.textContent = rec.max.toFixed(1);
        const d = el('v2-rec-dist'); if (d) d.textContent = (rec.dist / 1000).toFixed(2);
        const a = el('v2-rec-avg');
        if (a) a.textContent = dur > 30000 ? ((rec.dist / 1000) / (dur / 3600000)).toFixed(1) : '0.0';
    }
    setInterval(v2RefreshRec, 1000);

    window.v2ToggleRec = function() {
        rec.on = !rec.on;
        if (rec.on) { rec.t0 = Date.now(); rec.dist = 0; rec.max = 0; rec.pts = []; }
        const b = el('v2-btn-rec'), st = el('v2-rec-state');
        if (b) { b.textContent = rec.on ? '⏹ LOPETA' : '● ALOITA'; b.className = 'v2-btn ' + (rec.on ? 'v2-btn-danger' : 'v2-btn-primary'); }
        if (st) st.textContent = rec.on ? 'TALLENNETAAN' : 'VALMIS';
        if (!rec.on) alert('Ajo tallennettu lokaaliin muistiin - historia tulee VAIHEESSA 7. Matka: ' + (rec.dist / 1000).toFixed(2) + ' km');
    };

    window.v2StartDashboard = function() {
        if (started) return;
        started = true;
        if (!('geolocation' in navigator)) { setBadge('EI GPS', 'err'); return; }
        watchId = navigator.geolocation.watchPosition(onPos,
            () => setBadge('GPS VIRHE', 'err'),
            { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 });
        if ('wakeLock' in navigator) {
            navigator.wakeLock.request('screen').catch(() => {});
            document.addEventListener('visibilitychange', () => {
                if (document.visibilityState === 'visible') navigator.wakeLock.request('screen').catch(() => {});
            });
        }
    };

    // Kaynnistetaan kun kirjautunut
    window.v2auth && window.v2auth.onAuthStateChanged((u) => { if (u) v2StartDashboard(); });
})();
