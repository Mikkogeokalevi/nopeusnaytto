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
function navPanelEl() { return document.getElementById('nav-panel'); }

function navShowPanel(show) {
    const p = navPanelEl();
    if (p) p.style.display = show ? 'flex' : 'none';
}

function navUpdatePanel(icon, text, sub) {
    const p = navPanelEl();
    if (!p) return;
    const i = document.getElementById('nav-panel-icon');
    const t = document.getElementById('nav-panel-text');
    const s = document.getElementById('nav-panel-sub');
    if (i) i.innerText = icon;
    if (t) t.innerText = text;
    if (s) s.innerText = sub;
}

function navSpeak(text) {
    if (typeof window.speakFi === 'function') window.speakFi(text);
}

// --- REITITYS (OSRM) ---
function fetchOsrmRoute(origLat, origLng, destLat, destLng) {
    const url = `https://router.project-osrm.org/route/v1/driving/${origLng},${origLat};${destLng},${destLat}` +
        `?steps=true&overview=full&geometries=geojson&voice=false`;
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
                        type: st.maneuver.type || ''
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
    clearNavPolyline();
    if (typeof map === 'undefined' || !map || !Array.isArray(coords) || coords.length < 2) return;
    try {
        navState.polyline = L.polyline(coords, { color: '#2979ff', weight: 6, opacity: 0.85 }).addTo(map);
        map.fitBounds(navState.polyline.getBounds(), { padding: [60, 60] });
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
            navSpeak('Navigaatio aloitettu. Matkaa ' + formatNavDist(r.distM) + '.');
        })
        .catch(() => {
            navState.mode = 'direct';
            navUpdatePanel('⚠️', 'Reittiä ei löytynyt', 'Suoran linjan opastus käytössä');
            if (typeof showToast === 'function') showToast('Reititys epäonnistui - suora linja käytössä');
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
            navSpeak('Lasketaan reitti uudelleen');
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
            navSpeak('Saavuit perille');
            window.stopNavigation();
            return;
        }
        navUpdatePanel('🏁', 'Saavut pian', formatNavDist(dDest));
        return;
    }

    const distToStep = navDistM(lat, lng, next.loc[1], next.loc[0]);
    const instr = next.instruction;

    // Puhekynnykset
    const mask = navState.spokenMask[nextIdx] || (navState.spokenMask[nextIdx] = {});
    if (distToStep < 40 && !mask.at) {
        mask.at = true;
        navSpeak(instr);
    } else if (distToStep < 130 && !mask.mid) {
        mask.mid = true;
        navSpeak('Sadan metrin päästä ' + instr.toLowerCase());
    } else if (distToStep < 350 && !mask.near) {
        mask.near = true;
        navSpeak('Kolmensadan metrin päästä ' + instr.toLowerCase());
    }

    // ETA + matka
    let remM = distToStep;
    for (let i = nextIdx + 1; i < navState.steps.length; i++) remM += navState.steps[i].distM;
    const etaS = (pos.speedKmh > 3) ? (remM / (pos.speedKmh / 3.6)) : navState.routeDurS;
    const icon = instr.indexOf('vasemm') !== -1 ? '⬅️' : (instr.indexOf('oikeall') !== -1 || instr.indexOf('oikea') !== -1) ? '➡️' : (instr.indexOf('Saavut') !== -1 ? '🏁' : '⬆️');
    navUpdatePanel(icon, `${formatNavDist(distToStep)} · ${instr}`, `${navState.destLabel} · ${formatNavDist(remM)} · ~${formatNavDur(etaS)}`);
};

function tickDirect(lat, lng) {
    const d = navDistM(lat, lng, navState.destLat, navState.destLng);
    const brg = navBearingDeg(lat, lng, navState.destLat, navState.destLng);
    if (d < 40) {
        navUpdatePanel('🏁', 'Perillä', navState.destLabel);
        navSpeak('Saavuit perille');
        window.stopNavigation();
        return;
    }
    const relBrg = (typeof pos !== 'undefined') ? brg : brg;
    navUpdatePanel('🧭', `${navBearingWord(brg)} · ${formatNavDist(d)}`, `${navState.destLabel} · suunnasta ${Math.round(brg)}°`);
    const now = Date.now();
    if (now - navState.lastDirectSpeakTs > 45000) {
        navState.lastDirectSpeakTs = now;
        navSpeak(`Määränpää ${formatNavDist(d)} suunnassa ${navBearingWord(brg)}`);
    }
}

// --- DESTINAATIOMODAALI ---
window.openNavDestModal = function() {
    const m = document.getElementById('nav-dest-modal');
    if (m) m.style.display = 'flex';
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
    const goAddr = document.getElementById('btn-nav-go-address');
    if (goAddr) goAddr.addEventListener('click', window.navUseAddress);
    const goCoords = document.getElementById('btn-nav-go-coords');
    if (goCoords) goCoords.addEventListener('click', window.navUseCoords);
    const goPoi = document.getElementById('btn-nav-go-poi');
    if (goPoi) goPoi.addEventListener('click', window.navUsePoi);
    const goMap = document.getElementById('btn-nav-pick-map');
    if (goMap) goMap.addEventListener('click', window.navPickFromMap);
})();
