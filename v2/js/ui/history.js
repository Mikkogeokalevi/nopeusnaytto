// V2 HISTORIA — ajopaivakirja/{uid}-lista (jaettu V1:n kanssa) + rajoitukset OSM:sta
(function() {
    const el = (id) => document.getElementById(id);
    let histLoaded = false;

    window.v2LoadHistory = function() {
        if (!v2Perms.user) return;
        window.v2db.ref('ajopaivakirja/' + v2Perms.user.uid)
            .orderByChild('startTime').limitToLast(20).once('value').then((snap) => {
                const box = el('v2-history-list');
                if (!box) return;
                const items = [];
                snap.forEach((c) => items.unshift({ id: c.key, ...c.val() }));
                if (!items.length) { box.innerHTML = '<div class="v2-muted">Ei ajoja viela</div>'; return; }
                box.innerHTML = items.map((d) => {
                    const t = new Date(d.startTime || 0);
                    return '<div class="v2-listrow"><div class="grow">' +
                        '<div class="t">' + t.toLocaleDateString('fi-FI') + ' ' + t.toLocaleTimeString('fi-FI', { hour: '2-digit', minute: '2-digit' }) +
                        (d.source === 'v2' ? ' <span class="v2-badge" style="font-size:9px;">V2</span>' : '') + '</div>' +
                        '<div class="s">' + ((d.distance || 0) / 1000).toFixed(1) + ' km · huippu ' + (d.maxSpeed || 0).toFixed(0) + ' km/h · Ø ' + (d.avgSpeed || 0).toFixed(0) + '</div>' +
                        '</div></div>';
                }).join('');
            }).catch((e) => {
                const box = el('v2-history-list');
                if (box) box.innerHTML = '<div class="v2-notice">Historia-virhe: ' + e.message + '</div>';
            });
    };

    document.querySelectorAll('.v2-tab').forEach((t) => {
        t.addEventListener('click', () => {
            if (t.dataset.view === 'v2-view-hist') v2LoadHistory();
        });
    });

    // --- NOPEUSRAJOITUS Overpass:lla (throttled) ---
    let lastLimitQ = 0, lastLimitPos = null;
    window.v2LimitUpdate = function(lat, lng, kmh) {
        const now = Date.now();
        if (kmh < 5 || now - lastLimitQ < 15000) return;
        if (lastLimitPos && hav2(lat, lng, lastLimitPos.lat, lastLimitPos.lng) < 120) return;
        lastLimitQ = now; lastLimitPos = { lat, lng };
        const q = '[out:json][timeout:8];way(around:45,' + lat + ',' + lng + ')[maxspeed];out tags 3;';
        fetch('https://overpass-api.de/api/interpreter', { method: 'POST', body: 'data=' + encodeURIComponent(q) })
            .then((r) => r.json())
            .then((j) => {
                const ways = (j.elements || []).filter((w) => w.tags && w.tags.maxspeed);
                const v = ways.length ? parseInt(ways[0].tags.maxspeed, 10) : null;
                const lim = document.querySelector('#v2-view-dash .v2-listrow .t');
                if (v) {
                    if (lim) { lim.textContent = v; lim.nextElementSibling.textContent = 'OSM'; }
                    window.v2Limit = v;
                    const n = el('v2-speed-num');
                    if (n) n.style.color = kmh > v ? '#ff3b30' : '';
                } else {
                    if (lim) { lim.textContent = '--'; lim.nextElementSibling.textContent = 'Ei dataa'; }
                    window.v2Limit = null;
                }
            }).catch(() => {});
    };

    function hav2(a, b, c, d) {
        const R = 6371000, t = Math.PI / 180;
        const dLa = (c - a) * t, dLo = (d - b) * t;
        const q = Math.sin(dLa / 2) ** 2 + Math.cos(a * t) * Math.cos(c * t) * Math.sin(dLo / 2) ** 2;
        return R * 2 * Math.atan2(Math.sqrt(q), Math.sqrt(1 - q));
    }
})();
