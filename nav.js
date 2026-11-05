// =========================================================
// NAV.JS - v6.62 - TURN-BY-TURN NAVIGAATIO (OSRM + TTS)
// Itsenainen moduuli: kaikki olemassa olevat riippuvuudet
// tarkistetaan guardilla - ilman nav.js:ää sovellus toimii
// täysin ennallaan.
// =========================================================

var navState = {
    active: false,
    mode: 'road',            // 'road' | 'direct' (suora linja, kätkö)
    destLat: null,
    destLng: null,
    destLabel: '',
    steps: [],               // OSRM-vaiheet
    routeCoords: [],         // [[lat,lng]...] reittiviiva
    routeDistM: 0,
    routeDurS: 0,
    stepIdx: 0,
    nearRouteIdx: 0,
    spokenMask: {},          // {stepIdx: {near, mid, at}}
    offRouteStrikes: 0,
    lastRerouteTs: 0,
    lastDirectSpeakTs: 0,
    polyline: null,
    inFlight: false
};

var navPickMode = false;

// --- SUOMENKIELISET OHJEET ---
const NAV_MODIFIERS_FI = {
    'uturn': 'ympäri',
    'sharp right': 'jyrkästi oikealle',
    'right': 'oikealle',
    'slight right': 'loivasti oikealle',
    'straight': 'suoraan',
    'slight left': 'loivasti vasemmalle',
    'left': 'vasemmalle',
    'sharp left': 'jyrkästi vasemmalle'
};

function navInstructionText(maneuver) {
    if (!maneuver) return '';
    const t = String(maneuver.type || '');
    const mod = NAV_MODIFIERS_FI[String(maneuver.modifier || '').toLowerCase()] || '';
    switch (t) {
        case 'depart': return 'Aja';
        case 'turn': return mod ? `Käänny ${mod}` : 'Käänny';
        case 'new name': return 'Jatka';
        case 'merge': return mod ? `Aja ${mod}` : 'Aja';
        case 'on ramp': return 'Aja ramppia';
        case 'off ramp': return 'Poistu rampilta';
        case 'fork': return mod ? `Pysy ${mod}` : 'Pysy kaarteessa';
        case 'end of road': return mod ? `Käänny ${mod}` : 'Käänny';
        case 'continue': return mod ? `Jatka ${mod}` : 'Jatka';
        case 'roundabout': {
            const ex = maneuver.exit;
            return ex ? `Aja liikenneympyrästä ${ex}. poistuma` : 'Aja liikenneympyrään';
        }
        case 'rotary': {
            const ex = maneuver.exit;
            return ex ? `Aja liikenneympyrästä ${ex}. poistuma` : 'Aja liikenneympyrään';
        }
        case 'exit roundabout': return 'Poistu liikenneympyrästä';
        case 'arrive': return 'Saavut määränpäähän';
        default: return mod ? `Käänny ${mod}` : 'Jatka';
    }
}

function navBearingWord(deg) {
    const dirs = ['pohjoinen','koillinen','itä','kaakko','etelä','lounas','länsi','luode'];
    return dirs[Math.round((((deg % 360) + 360) % 360) / 45) % 8];
}

// --- GEOMETRIA ---
function navDistM(lat1, lng1, lat2, lng2) {
    const R = 6371000, toR = Math.PI / 180;
    const dLat = (lat2 - lat1) * toR, dLng = (lng2 - lng1) * toR;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * toR) * Math.cos(lat2 * toR) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function navBearingDeg(lat1, lng1, lat2, lng2) {
    if (typeof calculateBearing === 'function') return calculateBearing(lat1, lng1, lat2, lng2);
    const toR = Math.PI / 180;
    const dLng = (lng2 - lng1) * toR;
    const y = Math.sin(dLng) * Math.cos(lat2 * toR);
    const x = Math.cos(lat1 * toR) * Math.sin(lat2 * toR) - Math.sin(lat1 * toR) * Math.cos(lat2 * toR) * Math.cos(dLng);
    return (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
}

// --- UI ---
function navShowPanel(show) {
    ['nav-panel', 'nav-dash-panel', 'prem-nav-panel', 'prem-turnbox'].forEach((id) => {
        const p = document.getElementById(id);
        if (p) p.style.display = show ? 'flex' : 'none';
    });
}

function navUpdatePanel(icon, text, sub) {
    [['nav-panel-icon', 'nav-panel-text', 'nav-panel-sub'],
     ['nav-dash-icon', 'nav-dash-text', 'nav-dash-sub'],
     ['prem-nav-icon', 'prem-nav-text', 'prem-nav-sub']].forEach((ids) => {
        const i = document.getElementById(ids[0]);
        const t = document.getElementById(ids[1]);
        const s = document.getElementById(ids[2]);
        if (i) i.innerText = icon;
        if (t) t.innerText = text;
        if (s) s.innerText = sub;
    });
    // Premium-tyylin iso laatikko: pelkka nuoli + etaisyys (ei pitkaa ohjetta)
    const bigI = document.getElementById('prem-nav-bigicon');
    const bigT = document.getElementById('prem-nav-bigtext');
    if (bigI) bigI.innerText = icon;
    if (bigT) bigT.innerText = String(text).split('·')[0].trim();
}

function navSpeak(text) {
    if (typeof window.speakFi === 'function') window.speakFi(text);
}

// Tallentaa viimeisimmän ohjeen "toista"-napille (v6.74)
function navSpeakGuided(text) {
    navState.lastSpokenText = text;
    navSpeak(text);
}

window.navRepeatLast = function() {
    if (navState.lastSpokenText) navSpeak(navState.lastSpokenText);
    else if (typeof showToast === 'function') showToast('Ei ohjetta toistettavaksi');
};

// --- VIIMEISIMMAT MAARANPAAT + KOTI (v6.74) ---
function navSaveRecent(dest) {
    try {
        let r = JSON.parse(localStorage.getItem('navRecent') || '[]');
        r = r.filter((x) => x && x.label !== dest.label);
        r.unshift({ lat: dest.lat, lng: dest.lng, label: dest.label });
        localStorage.setItem('navRecent', JSON.stringify(r.slice(0, 5)));
    } catch (e) {}
}

function navRenderRecent() {
    const box = document.getElementById('nav-recent-list');
    if (!box) return;
    let r = [];
    try { r = JSON.parse(localStorage.getItem('navRecent') || '[]'); } catch (e) {}
    box.innerHTML = '';
    if (!r.length) {
        box.innerHTML = '<div style="font-size:12px;opacity:0.6;">Ei aiempia määränpäitä</div>';
        return;
    }
    r.forEach((item) => {
        const row = document.createElement('div');
        row.style.cssText = 'display:flex;align-items:center;gap:6px;margin-bottom:6px;';
        const btn = document.createElement('button');
        btn.className = 'action-btn secondary-btn';
        btn.style.cssText = 'flex:1;text-align:left;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
        btn.textContent = '🕘 ' + item.label;
        btn.addEventListener('click', () => {
            window.closeNavDestModal();
            const mode = document.getElementById('nav-mode-select');
            window.startNavigation({ lat: item.lat, lng: item.lng, label: item.label, mode: (mode && mode.value === 'direct') ? 'direct' : 'road' });
        });
        const homeBtn = document.createElement('button');
        homeBtn.className = 'icon-btn';
        homeBtn.style.cssText = 'width:34px;flex-shrink:0;';
        homeBtn.textContent = '🏠';
        homeBtn.title = 'Aseta kodiksi';
        homeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            localStorage.setItem('navHome', JSON.stringify({ lat: item.lat, lng: item.lng, label: item.label }));
            if (typeof showToast === 'function') showToast('Koti tallennettu: ' + item.label);
        });
        row.appendChild(btn);
        row.appendChild(homeBtn);
        box.appendChild(row);
    });
}

window.navGoHome = function() {
    let home = null;
    try { home = JSON.parse(localStorage.getItem('navHome') || 'null'); } catch (e) {}
    if (!home) {
        if (typeof showToast === 'function') showToast('Ei kotia - tallenna määränpää kodiksi 🏠-napilla listassa');
        return;
    }
    window.closeNavDestModal();
    const mode = document.getElementById('nav-mode-select');
    window.startNavigation({ lat: home.lat, lng: home.lng, label: 'Koti: ' + home.label, mode: (mode && mode.value === 'direct') ? 'direct' : 'road' });
};

// --- REITITYS (OSRM) ---
const NAV_ROUTE_ENDPOINTS = [
    'https://router.project-osrm.org/route/v1/driving',
    'https://routing.openstreetmap.de/routed-car/route/v1/driving'
];

function fetchOsrmRoute(origLat, origLng, destLat, destLng) {
    const path = `/${origLng},${origLat};${destLng},${destLat}?steps=true&overview=full&geometries=geojson`;
    // Kokeillaan ensisijaista OSRM:ää ja sen jalkeen FOSSGIS-peili (v6.66)
    let chain = Promise.reject(new Error('start'));
    NAV_ROUTE_ENDPOINTS.forEach((base) => {
        chain = chain.catch(() => fetchOsrmEndpoint(base + path));
    });
    return chain;
}

function fetchOsrmEndpoint(url) {
    return fetch(url)
        .then((res) => { if (!res.ok) throw new Error('osrm ' + res.status); return res.json(); })
        .then((data) => {
            const r = data && data.routes && data.routes[0];
            if (!r) throw new Error('no route');
            const steps = [];
            (r.legs || []).forEach((leg) => {
                (leg.steps || []).forEach((st) => {
                    steps.push({
                        loc: st.maneuver.location, // [lon,lat]
                        instruction: navInstructionText(st.maneuver),
                        name: st.name || '',
                        distM: st.distance || 0,
                        type: st.maneuver.type || '',
                        speechKey: navSpeechKey(st.maneuver),
                        exit: st.maneuver.exit || 0
                    });
                });
            });
            const coords = (r.geometry && r.geometry.coordinates || []).map((c) => [c[1], c[0]]);
            return { steps, coords, distM: r.distance || 0, durS: r.duration || 0 };
        });
}

// --- NAVIGAATION KÄYNNISTYS / LOPETUS ---
window.startNavigation = function(dest) {
    if (!dest || !isFinite(dest.lat) || !isFinite(dest.lng)) {
        if (typeof showToast === 'function') showToast('Virheellinen määränpää');
        return;
    }
    navState.destLat = dest.lat;
    navState.destLng = dest.lng;
    navState.destLabel = dest.label || 'Määränpää';
    navState.mode = (dest.mode === 'direct') ? 'direct' : 'road';
    navState.steps = [];
    navState.routeCoords = [];
    navState.stepIdx = 0;
    navState.nearRouteIdx = 0;
    navState.spokenMask = {};
    navState.offRouteStrikes = 0;
    navState.active = true;
    navShowPanel(true);
    navUpdatePanel('🧭', 'Haetaan reittiä...', navState.destLabel);
    navSaveRecent(dest);
    // Kaynnistetaan GPS automaattisesti jos se ei ole paalla (v6.66)
    if (typeof isGPSActive !== 'undefined' && !isGPSActive && typeof startGPS === 'function') {
        try {
            startGPS();
            const btnActivate = document.getElementById('btn-activate-gps');
            if (btnActivate) btnActivate.style.display = 'none';
            if (typeof showToast === 'function') showToast('GPS kaynnistetty opastusta varten');
        } catch (e) {}
    }
    if (navState.mode === 'direct') {
        if (typeof showToast === 'function') showToast('Suoran linjan opastus: ' + navState.destLabel);
        drawDirectLine();
    } else {
        requestRoute();
    }
};

window.stopNavigation = function() {
    navState.active = false;
    navShowPanel(false);
    clearNavPolyline();
    if (typeof showToast === 'function') showToast('Navigaatio lopetettu');
};

function clearNavPolyline() {
    try {
        if (navState.polyline && typeof map !== 'undefined' && map) {
            map.removeLayer(navState.polyline);
        }
    } catch (e) {}
    navState.polyline = null;
}

function drawNavPolyline(coords) {
    const hadRoute = !!navState.polyline;
    clearNavPolyline();
    if (typeof map === 'undefined' || !map || !Array.isArray(coords) || coords.length < 2) return;
    try {
        // Punainen reittiviiva valkoisella reunuksella - erottuu sinisesta ajo-kayrasta (v6.72)
        const casing = L.polyline(coords, { color: '#ffffff', weight: 9, opacity: 0.9 }).addTo(map);
        const line = L.polyline(coords, { color: '#ff3b30', weight: 5, opacity: 0.95 }).addTo(map);
        navState.polyline = L.layerGroup([casing, line]);
        if (!hadRoute) {
            window.mapProgrammaticMove = true;
            map.fitBounds(navState.polyline.getBounds(), { padding: [60, 60] });
            setTimeout(() => { window.mapProgrammaticMove = false; }, 300);
        }
    } catch (e) {}
}

function drawDirectLine() {
    if (typeof lastLatLng === 'undefined' || !lastLatLng) return;
    drawNavPolyline([[lastLatLng.lat, lastLatLng.lng], [navState.destLat, navState.destLng]]);
}

function requestRoute() {
    if (navState.inFlight) return;
    if (typeof lastLatLng === 'undefined' || !lastLatLng) {
        navUpdatePanel('⚠️', 'Ei sijaintia vielä', 'Odota GPS-signaalia');
        return;
    }
    navState.inFlight = true;
    fetchOsrmRoute(lastLatLng.lat, lastLatLng.lng, navState.destLat, navState.destLng)
        .then((r) => {
            navState.steps = r.steps;
            navState.routeCoords = r.coords;
            navState.routeDistM = r.distM;
            navState.routeDurS = r.durS;
            navState.stepIdx = 0;
            navState.nearRouteIdx = 0;
            navState.spokenMask = {};
            drawNavPolyline(r.coords);
            // Offline-reittivalimuisti (v6.74): toimiva reitti talteen
            try {
                localStorage.setItem('navRouteCache', JSON.stringify({
                    steps: r.steps.slice(0, 80), coords: r.coords.slice(0, 500),
                    destLat: navState.destLat, destLng: navState.destLng,
                    distM: r.distM, durS: r.durS, ts: Date.now()
                }));
            } catch (e) {}
            navSpeak(navT('depart', { dist: formatNavDist(r.distM) }));
        })
        .catch((err) => {
            // Ensisijaisesti yritetaan valimuistissa olevaa reittia samaan maaranpaahan (v6.74)
            let cached = null;
            try { cached = JSON.parse(localStorage.getItem('navRouteCache') || 'null'); } catch (e) {}
            if (cached && navDistM(cached.destLat, cached.destLng, navState.destLat, navState.destLng) < 500
                && Array.isArray(cached.steps) && cached.steps.length) {
                navState.steps = cached.steps;
                navState.routeCoords = cached.coords;
                navState.routeDistM = cached.distM;
                navState.routeDurS = cached.durS;
                navState.stepIdx = 0;
                navState.nearRouteIdx = 0;
                navState.spokenMask = {};
                drawNavPolyline(cached.coords);
                navUpdatePanel('📴', 'Valimuistissa oleva reitti', navState.destLabel + ' · ' + formatNavDist(cached.distM));
                if (typeof showToast === 'function') showToast('Ei verkkoa - kaytetaan valimuistissa olevaa reittia');
                return;
            }
            navState.mode = 'direct';
            navUpdatePanel('⚠️', 'Reittiä ei löytynyt', 'Suoran linjan opastus käytössä');
            const msg = (err && err.message) ? err.message : String(err || 'tuntematon');
            if (typeof showToast === 'function') showToast('Reititysvirhe: ' + msg + ' - suora linja käytössä');
            console.warn('[nav] route fetch failed:', err);
            drawDirectLine();
        })
        .finally(() => { navState.inFlight = false; });
}

function formatNavDist(m) {
    return m >= 1000 ? (m / 1000).toFixed(1) + ' km' : Math.round(m) + ' m';
}
function formatNavDur(s) {
    const h = Math.floor(s / 3600), m = Math.round((s % 3600) / 60);
    return h > 0 ? `${h} h ${m} min` : `${m} min`;
}

// --- GPS-TIKKI (gps.js kutsuu) ---
window.onNavGpsTick = function(pos) {
    if (!navState.active || !pos) return;
    const lat = pos.lat, lng = pos.lng;

    if (navState.mode === 'direct') {
        tickDirect(lat, lng);
        return;
    }
    if (!navState.steps.length || !navState.routeCoords.length) return;

    // Etsi lähin reittipiste ikkunassa nykyisen indeksin ympärillä
    const win = 40;
    let bestIdx = navState.nearRouteIdx, bestD = Infinity;
    const start = Math.max(0, navState.nearRouteIdx - 5);
    const end = Math.min(navState.routeCoords.length - 1, navState.nearRouteIdx + win);
    for (let i = start; i <= end; i++) {
        const c = navState.routeCoords[i];
        const d = navDistM(lat, lng, c[0], c[1]);
        if (d < bestD) { bestD = d; bestIdx = i; }
    }
    navState.nearRouteIdx = bestIdx;

    // Off-route?
    if (bestD > 50) {
        navState.offRouteStrikes++;
        if (navState.offRouteStrikes >= 3 && (Date.now() - navState.lastRerouteTs) > 20000) {
            navState.lastRerouteTs = Date.now();
            navState.offRouteStrikes = 0;
            navSpeak(navT('reroute', {}));
            requestRoute();
        }
    } else {
        navState.offRouteStrikes = 0;
    }

    // Seuraava ohjepiste: lähin step jonka loc on reitti-indeksin EDELLÄ
    let nextIdx = navState.stepIdx;
    while (nextIdx < navState.steps.length - 1) {
        const sl = navState.steps[nextIdx + 1].loc;
        const dStep = navDistM(lat, lng, sl[1], sl[0]);
        if (dStep < 30) { nextIdx++; continue; }
        break;
    }
    navState.stepIdx = nextIdx;

    const next = navState.steps[nextIdx + 1];
    if (!next) { // reitin loppu
        const dDest = navDistM(lat, lng, navState.destLat, navState.destLng);
        if (dDest < 45) {
            navUpdatePanel('🏁', 'Perillä', navState.destLabel);
            navSpeak(navT('arrived', {}));
            window.stopNavigation();
            return;
        }
        navUpdatePanel('🏁', 'Saavut pian', formatNavDist(dDest));
        return;
    }

    const distToStep = navDistM(lat, lng, next.loc[1], next.loc[0]);
    const instr = next.instruction;

    // Nopeusmukautetut puhekynnykset (v6.74): moottoritiella ohjeet aikaisemmin
    const spd = pos.speedKmh || 0;
    const farD = spd > 90 ? 700 : spd > 60 ? 400 : 250;
    const midD = spd > 90 ? 250 : spd > 60 ? 150 : 100;
    const atD = spd > 90 ? 60 : 40;
    const mask = navState.spokenMask[nextIdx] || (navState.spokenMask[nextIdx] = {});
    if (distToStep < atD && !mask.at) {
        mask.at = true;
        navSpeakGuided(navStepSpeech(next));
    } else if (distToStep < midD && !mask.mid) {
        mask.mid = true;
        navSpeakGuided(navT('announce_mid', { instr: navStepSpeech(next).toLowerCase() }));
    } else if (distToStep < farD && !mask.near) {
        mask.near = true;
        navSpeakGuided(navT('announce_far', { instr: navStepSpeech(next).toLowerCase() }));
    }

    // ETA + matka + saapumiskello (v6.74)
    let remM = distToStep;
    for (let i = nextIdx + 1; i < navState.steps.length; i++) remM += navState.steps[i].distM;
    const etaS = (pos.speedKmh > 3) ? (remM / (pos.speedKmh / 3.6)) : navState.routeDurS;
    const arrDate = new Date(Date.now() + etaS * 1000);
    const arrClock = arrDate.getHours() + '.' + String(arrDate.getMinutes()).padStart(2, '0');
    const icon = instr.indexOf('vasemm') !== -1 ? '⬅️' : (instr.indexOf('oikeall') !== -1 || instr.indexOf('oikea') !== -1) ? '➡️' : (instr.indexOf('Saavut') !== -1 ? '🏁' : '⬆️');
    navUpdatePanel(icon, `${formatNavDist(distToStep)} · ${instr}`, `${navState.destLabel} · ${formatNavDist(remM)} · ~${formatNavDur(etaS)} · klo ${arrClock}`);
    // Premium-tyylin iso nuoli numeron vieressa vasta kun ohje lahestyy (v6.80)
    const ptb = document.getElementById('prem-turnbox');
    if (ptb && navState.active) ptb.style.display = (distToStep < farD) ? 'flex' : 'none';
};

function tickDirect(lat, lng) {
    const d = navDistM(lat, lng, navState.destLat, navState.destLng);
    const brg = navBearingDeg(lat, lng, navState.destLat, navState.destLng);
    if (d < 40) {
        navUpdatePanel('🏁', 'Perillä', navState.destLabel);
        navSpeak(navT('arrived', {}));
        window.stopNavigation();
        return;
    }
    navUpdatePanel('🧭', `${navBearingWord(brg)} · ${formatNavDist(d)}`, `${navState.destLabel} · suunnasta ${Math.round(brg)}°`);
    const ptbD = document.getElementById('prem-turnbox');
    if (ptbD) ptbD.style.display = 'flex'; // suora navi: iso nuoli aina nakyvissa
    const now = Date.now();
    if (now - navState.lastDirectSpeakTs > 45000) {
        navState.lastDirectSpeakTs = now;
        navSpeakGuided(navT('direct_info', { dist: formatNavDist(d), dir: navBearingWord(brg) }));
    }
}

// --- DESTINAATIOMODAALI ---
window.openNavDestModal = function() {
    const m = document.getElementById('nav-dest-modal');
    if (m) m.style.display = 'flex';
    navRenderRecent();
    const sel = document.getElementById('nav-poi-select');
    if (sel) {
        sel.innerHTML = '<option value="">— valitse POI —</option>';
        (poiData || []).forEach((p) => {
            const o = document.createElement('option');
            o.value = p.id;
            o.textContent = (p.name || 'POI') + (p.type ? ' (' + p.type + ')' : '');
            sel.appendChild(o);
        });
    }
};

window.closeNavDestModal = function() {
    const m = document.getElementById('nav-dest-modal');
    if (m) m.style.display = 'none';
};

window.navUseAddress = function() {
    const inp = document.getElementById('nav-address-input');
    const q = inp ? inp.value.trim() : '';
    if (!q) { if (typeof showToast === 'function') showToast('Kirjoita osoite'); return; }
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&countrycodes=fi&q=${encodeURIComponent(q)}`;
    fetch(url, { headers: { 'User-Agent': 'AjopaivakirjaPro/6.6' } })
        .then((r) => r.json())
        .then((arr) => {
            if (!arr || !arr.length) { if (typeof showToast === 'function') showToast('Osoitetta ei löytynyt'); return; }
            const it = arr[0];
            window.closeNavDestModal();
            window.startNavigation({ lat: parseFloat(it.lat), lng: parseFloat(it.lon), label: q, mode: 'road' });
        })
        .catch(() => { if (typeof showToast === 'function') showToast('Osoitehaku epäonnistui'); });
};

window.navUseCoords = function() {
    const inp = document.getElementById('nav-coords-input');
    const q = inp ? inp.value.trim() : '';
    let c = null;
    if (typeof window.parseGeocacheCoordinates === 'function') c = window.parseGeocacheCoordinates(q);
    if (!c) {
        const m = q.match(/(-?\d+\.?\d*)[,\s]+(-?\d+\.?\d*)/);
        if (m) c = { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
    }
    if (!c || !isFinite(c.lat) || !isFinite(c.lng)) {
        if (typeof showToast === 'function') showToast('Koordinaatteja ei tunnistettu');
        return;
    }
    const mode = document.getElementById('nav-mode-select');
    window.closeNavDestModal();
    window.startNavigation({ lat: c.lat, lng: c.lng, label: q, mode: (mode && mode.value === 'direct') ? 'direct' : 'road' });
};

window.navUsePoi = function() {
    const sel = document.getElementById('nav-poi-select');
    const id = sel ? sel.value : '';
    const p = (poiData || []).find((x) => x && x.id === id);
    if (!p) { if (typeof showToast === 'function') showToast('Valitse POI'); return; }
    const mode = document.getElementById('nav-mode-select');
    window.closeNavDestModal();
    window.startNavigation({ lat: Number(p.lat), lng: Number(p.lng), label: p.name || 'POI', mode: (mode && mode.value === 'direct') ? 'direct' : 'road' });
};

window.navPickFromMap = function() {
    window.closeNavDestModal();
    navPickMode = true;
    if (typeof switchView === 'function') switchView('map');
    if (typeof showToast === 'function') showToast('Napauta karttaa valitaksesi määränpään');
    if (typeof map !== 'undefined' && map) {
        map.once('click', (e) => {
            navPickMode = false;
            const mode = document.getElementById('nav-mode-select');
            window.startNavigation({ lat: e.latlng.lat, lng: e.latlng.lng, label: 'Kartalta valittu', mode: (mode && mode.value === 'direct') ? 'direct' : 'road' });
        });
    }
};

// --- NAPPIEN KYTKENNÄT ---
(function initNav() {
    const open = document.getElementById('btn-nav-open');
    if (open) open.addEventListener('click', window.openNavDestModal);
    const close = document.getElementById('btn-nav-close');
    if (close) close.addEventListener('click', window.closeNavDestModal);
    const stop = document.getElementById('btn-nav-stop');
    if (stop) stop.addEventListener('click', window.stopNavigation);
    const stopDash = document.getElementById('btn-nav-stop-dash');
    if (stopDash) stopDash.addEventListener('click', window.stopNavigation);
    const rep = document.getElementById('btn-nav-repeat');
    if (rep) rep.addEventListener('click', window.navRepeatLast);
    const repDash = document.getElementById('btn-nav-repeat-dash');
    if (repDash) repDash.addEventListener('click', window.navRepeatLast);
    const stopPrem = document.getElementById('btn-nav-stop-prem');
    if (stopPrem) stopPrem.addEventListener('click', window.stopNavigation);
    const repPrem = document.getElementById('btn-nav-repeat-prem');
    if (repPrem) repPrem.addEventListener('click', window.navRepeatLast);
    const homeBtn = document.getElementById('btn-nav-home');
    if (homeBtn) homeBtn.addEventListener('click', window.navGoHome);
    const goAddr = document.getElementById('btn-nav-go-address');
    if (goAddr) goAddr.addEventListener('click', window.navUseAddress);
    const goCoords = document.getElementById('btn-nav-go-coords');
    if (goCoords) goCoords.addEventListener('click', window.navUseCoords);
    const goPoi = document.getElementById('btn-nav-go-poi');
    if (goPoi) goPoi.addEventListener('click', window.navUsePoi);
    const goMap = document.getElementById('btn-nav-pick-map');
    if (goMap) goMap.addEventListener('click', window.navPickFromMap);
})();

// =========================================================
// PUHEPAKETIT v6.63 - navigaation puheohjeiden tekstipaketit
// Oletuspaketti on lukittu; omia paketteja voi luoda,
// muokata, poistaa, vieda ja tuoda tekstitiedostona.
// =========================================================

var NAV_SPEECH_DEFS = [
    ['depart', 'Navigaation alku', 'Navigaatio aloitettu. Matkaa {dist}.'],
    ['announce_far', 'Varoitus kaukaa (300 m)', 'Kolmensadan metrin päästä {instr}'],
    ['announce_mid', 'Varoitus läheltä (100 m)', 'Sadan metrin päästä {instr}'],
    ['turn_left', 'Käänny vasemmalle', 'Käänny vasemmalle'],
    ['turn_slight_left', 'Käänny loivasti vasemmalle', 'Käänny loivasti vasemmalle'],
    ['turn_sharp_left', 'Käänny jyrkästi vasemmalle', 'Käänny jyrkästi vasemmalle'],
    ['turn_right', 'Käänny oikealle', 'Käänny oikealle'],
    ['turn_slight_right', 'Käänny loivasti oikealle', 'Käänny loivasti oikealle'],
    ['turn_sharp_right', 'Käänny jyrkästi oikealle', 'Käänny jyrkästi oikealle'],
    ['uturn', 'U-käännös', 'Käänny ympäri'],
    ['continue', 'Jatka suoraan', 'Jatka suoraan'],
    ['fork', 'Pysy kaarteessa', 'Pysy kaarteessa'],
    ['on_ramp', 'Aja rampille', 'Aja rampille'],
    ['off_ramp', 'Poistu rampilta', 'Poistu rampilta'],
    ['roundabout', 'Liikenneympyrä', 'Aja liikenneympyrästä {exit}. poistuma'],
    ['arrived', 'Perillä', 'Saavuit perille'],
    ['reroute', 'Uudelleenreititys', 'Lasketaan reitti uudelleen'],
    ['direct_info', 'Suoran linjan opastus', 'Määränpää {dist} suunnassa {dir}']
];
const NAV_DEFAULT_TEXTS = {};
NAV_SPEECH_DEFS.forEach(function(def) { NAV_DEFAULT_TEXTS[def[0]] = def[2]; });

var navEditingPackId = null;

function navSpeechKey(maneuver) {
    const t = String(maneuver && maneuver.type || '').toLowerCase();
    const m = String(maneuver && maneuver.modifier || '').toLowerCase();
    if (t === 'arrive') return 'arrived';
    if (t === 'roundabout' || t === 'rotary') return 'roundabout';
    if (t === 'off ramp') return 'off_ramp';
    if (t === 'on ramp') return 'on_ramp';
    if (t === 'fork') return 'fork';
    if (m === 'uturn') return 'uturn';
    if (m.indexOf('left') !== -1) {
        if (m.indexOf('sharp') !== -1) return 'turn_sharp_left';
        if (m.indexOf('slight') !== -1) return 'turn_slight_left';
        return 'turn_left';
    }
    if (m.indexOf('right') !== -1) {
        if (m.indexOf('sharp') !== -1) return 'turn_sharp_right';
        if (m.indexOf('slight') !== -1) return 'turn_slight_right';
        return 'turn_right';
    }
    return 'continue';
}

function navLoadPacks() {
    try { return JSON.parse(localStorage.getItem('navSpeechPacks') || '[]'); }
    catch (e) { return []; }
}
function navSavePacks(packs) {
    localStorage.setItem('navSpeechPacks', JSON.stringify(packs));
    navPushPacksToFirebase();
}

// Firebase-synkronointi (v6.67): paketit ja aktiivinen valinta jaetaan
// kayttajan kaikkien laitteiden kesken samaan tapaan kuin autot/historia.
function navPushPacksToFirebase() {
    try {
        if (typeof db === 'undefined' || typeof currentUser === 'undefined' || !currentUser) return;
        db.ref('users/' + currentUser.uid + '/navSpeechPacks').set({
            packs: navLoadPacks(),
            active: localStorage.getItem('navSpeechActive') || 'default'
        }).catch(function() {});
    } catch (e) {}
}

var navPacksSyncStarted = false;
function navSyncPacksFromFirebase() {
    try {
        if (typeof db === 'undefined' || typeof currentUser === 'undefined' || !currentUser) return;
        if (navPacksSyncStarted) return;
        navPacksSyncStarted = true;
        db.ref('users/' + currentUser.uid + '/navSpeechPacks').on('value', function(snapshot) {
            const val = snapshot.val();
            if (val && Array.isArray(val.packs)) {
                localStorage.setItem('navSpeechPacks', JSON.stringify(val.packs));
                if (val.active) localStorage.setItem('navSpeechActive', val.active);
            } else {
                // Pilvessa ei dataa viela: lahetetaan paikalliset paketit ylos
                navPushPacksToFirebase();
            }
            navRefreshPackSelect();
        });
    } catch (e) {}
}

// Odotetaan auth-valmiutta (currentUser asettuu vasta kirjautumisen jalkeen)
(function navWaitAuthForPackSync() {
    if (typeof currentUser !== 'undefined' && currentUser) {
        navSyncPacksFromFirebase();
    } else {
        setTimeout(navWaitAuthForPackSync, 1500);
    }
})();
function navActivePack() {
    const id = localStorage.getItem('navSpeechActive') || 'default';
    if (id === 'default') return { id: 'default', name: 'Oletusohjeet', texts: NAV_DEFAULT_TEXTS };
    const p = navLoadPacks().find(function(x) { return x.id === id; });
    return p || { id: 'default', name: 'Oletusohjeet', texts: NAV_DEFAULT_TEXTS };
}
function navActiveTexts() {
    const p = navActivePack();
    return (p.id === 'default') ? NAV_DEFAULT_TEXTS
        : Object.assign({}, NAV_DEFAULT_TEXTS, p.texts || {});
}
function navT(key, params) {
    let t = navActiveTexts()[key] || NAV_DEFAULT_TEXTS[key] || '';
    Object.keys(params || {}).forEach(function(k) {
        t = t.split('{' + k + '}').join(String(params[k]));
    });
    return t;
}
function navStepSpeech(step) {
    if (!step) return '';
    const t = navT(step.speechKey, { exit: step.exit || 0 });
    return t || step.instruction || '';
}

// Testisoitto: korvataan paikkamerkit esimerkkiarvoilla kuuntelua varten (v6.68)
function navSampleText(text) {
    return String(text || '')
        .split('{instr}').join('käänny vasemmalle')
        .split('{dist}').join('3,2 kilometriä')
        .split('{dir}').join('luode')
        .split('{exit}').join('2');
}

function navRefreshPackSelect() {
    const active = localStorage.getItem('navSpeechActive') || 'default';
    ['nav-speech-pack-select', 'nav-dest-pack-select'].forEach(function(selId) {
        const sel = document.getElementById(selId);
        if (!sel) return;
        sel.innerHTML = '';
        const d = document.createElement('option');
        d.value = 'default'; d.textContent = 'Oletusohjeet (lukittu)';
        sel.appendChild(d);
        navLoadPacks().forEach(function(p) {
            const o = document.createElement('option');
            o.value = p.id; o.textContent = p.name;
            sel.appendChild(o);
        });
        sel.value = navLoadPacks().some(function(p) { return p.id === active; }) ? active : 'default';
    });
}

window.navPackEdit = function() {
    const active = navActivePack();
    if (active.id === 'default') {
        if (typeof showToast === 'function') showToast('Oletusta ei voi muokata - luo ensin oma paketti');
        return;
    }
    navEditingPackId = active.id;
    const nameEl = document.getElementById('nav-pack-name');
    const rows = document.getElementById('nav-pack-rows');
    if (!rows) return;
    if (nameEl) nameEl.value = active.name || '';
    rows.innerHTML = '';
    NAV_SPEECH_DEFS.forEach(function(def) {
        const key = def[0], label = def[1];
        const row = document.createElement('div');
        row.style.cssText = 'margin-bottom:8px;';
        const lab = document.createElement('label');
        lab.style.cssText = 'display:block;font-size:12px;opacity:0.75;margin-bottom:3px;';
        lab.textContent = label + ' ';
        const code = document.createElement('code');
        code.style.opacity = '0.5'; code.textContent = key;
        lab.appendChild(code);
        const inp = document.createElement('input');
        inp.className = 'subject-input nav-pack-field';
        inp.dataset.key = key;
        inp.style.flex = '1';
        inp.maxLength = 120;
        inp.value = (active.texts && active.texts[key]) || NAV_DEFAULT_TEXTS[key] || '';
        const testBtn = document.createElement('button');
        testBtn.className = 'icon-btn';
        testBtn.type = 'button';
        testBtn.style.cssText = 'width:38px; flex-shrink:0; font-size:15px;';
        testBtn.textContent = '🔊';
        testBtn.setAttribute('aria-label', 'Kuuntele: ' + label);
        testBtn.addEventListener('click', function() {
            navSpeak(navSampleText(inp.value));
        });
        const rowInner = document.createElement('div');
        rowInner.style.cssText = 'display:flex; gap:6px; align-items:center;';
        rowInner.appendChild(inp);
        rowInner.appendChild(testBtn);
        row.appendChild(lab);
        row.appendChild(rowInner);
        rows.appendChild(row);
    });
    const m = document.getElementById('nav-pack-modal');
    if (m) m.style.display = 'flex';
};

window.navPackSaveEdit = function() {
    if (!navEditingPackId) return;
    const packs = navLoadPacks();
    const p = packs.find(function(x) { return x.id === navEditingPackId; });
    if (!p) return;
    const nameEl = document.getElementById('nav-pack-name');
    if (nameEl && nameEl.value.trim()) p.name = nameEl.value.trim();
    const texts = {};
    document.querySelectorAll('.nav-pack-field').forEach(function(inp) {
        const v = inp.value.trim();
        const key = inp.dataset.key;
        if (v && v !== NAV_DEFAULT_TEXTS[key]) texts[key] = v;
    });
    p.texts = texts;
    navSavePacks(packs);
    navEditingPackId = null;
    const m = document.getElementById('nav-pack-modal');
    if (m) m.style.display = 'none';
    navRefreshPackSelect();
    if (typeof showToast === 'function') showToast('Puhepaketti tallennettu');
};

window.navPackNew = function() {
    const packs = navLoadPacks();
    const p = { id: 'pack_' + Date.now(), name: 'Oma paketti ' + (packs.length + 1), texts: {} };
    packs.push(p);
    navSavePacks(packs);
    localStorage.setItem('navSpeechActive', p.id);
    navPushPacksToFirebase();
    navRefreshPackSelect();
    window.navPackEdit();
};

window.navPackDelete = function() {
    const active = navActivePack();
    if (active.id === 'default') {
        if (typeof showToast === 'function') showToast('Oletuspakettia ei voi poistaa');
        return;
    }
    navSavePacks(navLoadPacks().filter(function(x) { return x.id !== active.id; }));
    localStorage.setItem('navSpeechActive', 'default');
    navPushPacksToFirebase();
    navRefreshPackSelect();
    if (typeof showToast === 'function') showToast('Paketti poistettu');
};

window.navPackExport = function() {
    const active = navActivePack();
    const texts = active.texts || NAV_DEFAULT_TEXTS;
    let out = '# Ajopaivakirja - navigaation puhepaketti\n';
    out += '# Muokkaa riveja: avain=teksti. Merkit {instr} {dist} {dir} {exit} korvautuvat ajon aikana.\n';
    out += '# Tyhja arvo = kaytetaan oletusta.\n';
    out += 'name=' + (active.id === 'default' ? 'Oma paketti' : active.name) + '\n';
    NAV_SPEECH_DEFS.forEach(function(def) {
        out += def[0] + '=' + (texts[def[0]] || def[2]) + '\n';
    });
    const blob = new Blob([out], { type: 'text/plain;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'puhepaketti.txt';
    a.click();
    setTimeout(function() { URL.revokeObjectURL(a.href); }, 2000);
};

// Jaettu pakettien parsinta tekstista (v6.78): kaytetaan seka tiedosto-etta liita-importissa
function navImportPackText(raw, defaultName) {
    const texts = {};
    let name = defaultName || 'Tuotu paketti';
    String(raw || '').split(/\r?\n/).forEach(function(line) {
        const l = line.trim();
        if (!l || l.charAt(0) === '#') return;
        const eq = l.indexOf('=');
        if (eq === -1) return;
        const k = l.slice(0, eq).trim(), v = l.slice(eq + 1).trim();
        if (k === 'name') { if (v) name = v; return; }
        if (NAV_DEFAULT_TEXTS.hasOwnProperty(k) && v) texts[k] = v;
    });
    if (!Object.keys(texts).length) return null;
    const packs = navLoadPacks();
    const p = { id: 'pack_' + Date.now(), name, texts };
    packs.push(p);
    navSavePacks(packs);
    localStorage.setItem('navSpeechActive', p.id);
    navPushPacksToFirebase();
    navRefreshPackSelect();
    return p;
}

window.navPackImport = function(ev) {
    const file = ev.target && ev.target.files && ev.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function() {
        const p = navImportPackText(String(reader.result || ''), 'Tuotu paketti');
        if (typeof showToast === 'function') {
            showToast(p ? ('Paketti "' + p.name + '" tuotu (' + Object.keys(p.texts).length + ' tekstia)')
                        : 'Tiedostossa ei ollut tunnistettuja teksteja');
        }
    };
    reader.readAsText(file);
    ev.target.value = '';
};

window.navPackPasteImport = function() {
    const ta = document.getElementById('nav-pack-paste-input');
    const raw = ta ? ta.value : '';
    const p = navImportPackText(raw, 'Liitetty paketti');
    if (p) {
        const m = document.getElementById('nav-pack-paste-modal');
        if (m) m.style.display = 'none';
        if (ta) ta.value = '';
        if (typeof showToast === 'function') showToast('Paketti "' + p.name + '" tuotu (' + Object.keys(p.texts).length + ' tekstia)');
    } else if (typeof showToast === 'function') {
        showToast('Ei tunnistettuja riveja - tarkista muoto avain=arvo');
    }
};

(function initNavPacks() {
    ['nav-speech-pack-select', 'nav-dest-pack-select'].forEach(function(selId) {
        const sel = document.getElementById(selId);
        if (sel) sel.addEventListener('change', function() {
            localStorage.setItem('navSpeechActive', sel.value);
            navPushPacksToFirebase();
            navRefreshPackSelect();
            if (typeof showToast === 'function') showToast('Puhepaketti: ' + sel.options[sel.selectedIndex].text);
        });
    });
    function b(id, fn) { const e = document.getElementById(id); if (e) e.addEventListener('click', fn); }
    b('btn-nav-pack-new', window.navPackNew);
    b('btn-nav-pack-edit', window.navPackEdit);
    b('btn-nav-pack-delete', window.navPackDelete);
    b('btn-nav-pack-export', window.navPackExport);
    b('btn-nav-pack-save', window.navPackSaveEdit);
    b('btn-nav-pack-close', function() {
        navEditingPackId = null;
        const m = document.getElementById('nav-pack-modal');
        if (m) m.style.display = 'none';
    });
    const imp = document.getElementById('nav-pack-import-file');
    if (imp) {
        imp.addEventListener('change', window.navPackImport);
        const ib = document.getElementById('btn-nav-pack-import');
        if (ib) ib.addEventListener('click', function() { imp.click(); });
    }
    b('btn-nav-pack-paste', function() {
        const m = document.getElementById('nav-pack-paste-modal');
        if (m) m.style.display = 'flex';
    });
    b('btn-nav-pack-paste-import', window.navPackPasteImport);
    b('btn-nav-pack-paste-close', function() {
        const m = document.getElementById('nav-pack-paste-modal');
        if (m) m.style.display = 'none';
    });
    navRefreshPackSelect();
})();
