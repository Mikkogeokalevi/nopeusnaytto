// =========================================================
// MAP.JS - KARTTA JA REITIN PIIRTO
// =========================================================

// 1. Määritellään karttatasot
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    maxZoom: 19, 
    attribution: '© OSM' 
});

const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
    attribution: 'Tiles &copy; Esri' 
});

const terrainMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { 
    maxZoom: 17, 
    attribution: '© OpenTopoMap' 
});

let dashboardMiniMap = null;
let dashboardMiniMarker = null;
let dashboardMiniPolyline = null;

function scheduleDashboardMiniMapResize(delays) {
    if (!Array.isArray(delays)) return;
    delays.forEach((ms) => {
        setTimeout(() => {
            try { window.refreshDashboardMiniMapSize(); } catch (e) {}
        }, ms);
    });
}

// 2. Luodaan kartta (map-muuttuja on määritelty globals.js:ssä)
// Varmistetaan että elementti on olemassa ennen luontia
if (document.getElementById('map')) {
    map = L.map('map', {
        center: [64.0, 26.0], 
        zoom: 16, 
        layers: [streetMap], 
        zoomControl: false 
    });

    // Lisätään tasovalitsin
    L.control.layers({ 
        "Peruskartta": streetMap, 
        "Satelliitti": satelliteMap, 
        "Maastokartta": terrainMap 
    }).addTo(map);

    // Oma sijainti -merkki (sininen pallo)
    marker = L.circleMarker([64.0, 26.0], { 
        color: '#2979ff', 
        fillColor: '#2979ff', 
        fillOpacity: 0.8, 
        radius: 8 
    }).addTo(map);

    // Sininen viiva ajon aikaiseen "live"-piirtoon
    realTimePolyline = L.polyline([], {
        color: '#2979ff', 
        weight: 5, 
        opacity: 0.7
    }).addTo(map);

    // =========================================================
    // POI (Paikkamerkinnät) - aina näkyvissä kartalla
    // =========================================================
    window._poiLayerGroup = L.layerGroup().addTo(map);

    // Kartalta lisäys: oikea klikkaus (desktop) / pitkä painallus (mobiili)
    // Leaflet ei oletuksena tarjoa long-press eventtiä, joten tehdään kevyt toteutus.
    let pressTimer = null;
    let pressStart = null;

    function tryOpenPoiAddFromLatLng(latlng) {
        if (!poiAddMode) return;
        poiAddMode = false;
        if (typeof window.openPoiEditor === 'function') {
            window.openPoiEditor(null, { lat: latlng.lat, lng: latlng.lng });
        } else {
            alert('POI editor puuttuu.');
        }
    }

    map.on('contextmenu', (e) => {
        tryOpenPoiAddFromLatLng(e.latlng);
    });

    map.on('mousedown', (e) => {
        pressStart = { x: e.originalEvent?.clientX, y: e.originalEvent?.clientY };
        pressTimer = setTimeout(() => {
            tryOpenPoiAddFromLatLng(e.latlng);
        }, 650);
    });

    map.on('mouseup', (e) => {
        if (pressTimer) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    });

    map.on('mousemove', (e) => {
        if (!pressTimer || !pressStart) return;
        const x = e.originalEvent?.clientX;
        const y = e.originalEvent?.clientY;
        if (typeof x !== 'number' || typeof y !== 'number') return;
        const dx = x - pressStart.x;
        const dy = y - pressStart.y;
        if (Math.sqrt(dx*dx + dy*dy) > 10) {
            clearTimeout(pressTimer);
            pressTimer = null;
        }
    });
}

window.ensureDashboardMiniMap = function() {
    const mapEl = document.getElementById('dashboard-mini-map');
    if (!mapEl) return null;
    if (dashboardMiniMap) return dashboardMiniMap;

    dashboardMiniMap = L.map('dashboard-mini-map', {
        center: [64.0, 26.0],
        zoom: 15,
        layers: [L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '© OSM'
        })],
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
        tap: false,
        touchZoom: false
    });

    dashboardMiniMarker = L.circleMarker([64.0, 26.0], {
        color: '#47d2ff',
        fillColor: '#47d2ff',
        fillOpacity: 0.9,
        radius: 6,
        weight: 2
    }).addTo(dashboardMiniMap);

    dashboardMiniPolyline = L.polyline([], {
        color: '#47d2ff',
        weight: 3,
        opacity: 0.65
    }).addTo(dashboardMiniMap);

    if (Array.isArray(routePath) && routePath.length > 0) {
        dashboardMiniPolyline.setLatLngs(routePath.map((p) => [p.lat, p.lng]));
    }

    scheduleDashboardMiniMapResize([50, 180, 360]);

    return dashboardMiniMap;
};

window.refreshDashboardMiniMapSize = function() {
    if (!dashboardMiniMap) return;
    const mapEl = document.getElementById('dashboard-mini-map');
    if (!mapEl || mapEl.offsetWidth < 40 || mapEl.offsetHeight < 40) return;
    try { dashboardMiniMap.invalidateSize(); } catch (e) {}
};

window.updateDashboardMiniMap = function(lat, lng, coordsText) {
    if (!isFinite(lat) || !isFinite(lng)) return;
    const mapInst = window.ensureDashboardMiniMap();
    if (!mapInst) return;

    const pos = [lat, lng];
    if (dashboardMiniMarker) dashboardMiniMarker.setLatLng(pos);
    mapInst.setView(pos, 16, { animate: false });

    const coordsEl = document.getElementById('dashboard-map-coords');
    if (coordsEl && typeof coordsText === 'string' && coordsText.trim()) {
        coordsEl.innerText = coordsText;
    }
};

window.addDashboardMiniMapTrailPoint = function(lat, lng) {
    if (!isFinite(lat) || !isFinite(lng)) return;
    const mapInst = window.ensureDashboardMiniMap();
    if (!mapInst) return;
    if (!dashboardMiniPolyline) return;
    dashboardMiniPolyline.addLatLng([lat, lng]);
};

window.clearDashboardMiniMapTrail = function() {
    if (!dashboardMiniPolyline) return;
    dashboardMiniPolyline.setLatLngs([]);
};

window.setDashboardMiniMapTrailFromRoute = function(route) {
    if (!Array.isArray(route)) return;
    const mapInst = window.ensureDashboardMiniMap();
    if (!mapInst || !dashboardMiniPolyline) return;
    const latLngs = route
        .filter((p) => p && isFinite(p.lat) && isFinite(p.lng))
        .map((p) => [p.lat, p.lng]);
    dashboardMiniPolyline.setLatLngs(latLngs);
};

window.addEventListener('resize', () => {
    scheduleDashboardMiniMapResize([80, 260]);
});

window.addEventListener('orientationchange', () => {
    scheduleDashboardMiniMapResize([120, 360, 620]);
});

window.addEventListener('pageshow', () => {
    scheduleDashboardMiniMapResize([120, 320, 620]);
});

document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        scheduleDashboardMiniMapResize([120, 320, 620]);
    }
});

// =========================================================
// POI renderöinti ja kartta-apurit
// =========================================================

function getPoiStyle(type) {
    if (type === 'speedcamera') return { color: '#ff1744', fillColor: '#ff1744', icon: '📷' };
    if (type === 'danger') return { color: '#ff9800', fillColor: '#ff9800', icon: '⚠️' };
    if (type === 'customer') return { color: '#00e676', fillColor: '#00e676', icon: '🏁' };
    if (type === 'reminder') return { color: '#2979ff', fillColor: '#2979ff', icon: '📝' };
    return { color: '#888', fillColor: '#888', icon: '📍' };
}

window.renderPOIsOnMap = function() {
    if (!map || !window._poiLayerGroup) return;
    if (!Array.isArray(poiData)) return;

    window._poiLayerGroup.clearLayers();

    poiData.forEach(poi => {
        if (!poi) return;
        const pLat = (typeof poi.lat === 'number') ? poi.lat : parseFloat(poi.lat);
        const pLng = (typeof poi.lng === 'number') ? poi.lng : parseFloat(poi.lng);
        if (!isFinite(pLat) || !isFinite(pLng)) return;
        const type = String(poi.type || 'other').trim().toLowerCase();

        // Nopeuskamerat pois käytöstä kävely- ja pyörätilassa
        if (type === 'speedcamera' && (currentCarType === 'walking' || currentCarType === 'bike')) return;

        const style = getPoiStyle(type);

        const circle = L.circleMarker([pLat, pLng], {
            radius: 7,
            color: style.color,
            fillColor: style.fillColor,
            fillOpacity: 0.85,
            weight: 2
        });

        const title = poi.name || 'POI';
        const warn = poi.alertEnabled ? `Varoitus: PÄÄLLÄ (${poi.alertRadiusM || 350}m / ${poi.cooldownSec || 180}s)` : 'Varoitus: POIS';
        const actions = poi.id ? `
            <div style="display:flex; gap:8px; margin-top:10px;">
                <button onclick="window.openPoiEditorById && window.openPoiEditorById('${poi.id}')" class="action-btn" style="width:auto; padding:6px 10px; background:#424242;">Muokkaa</button>
                <button onclick="window.deletePoiById && window.deletePoiById('${poi.id}')" class="action-btn" style="width:auto; padding:6px 10px; background:#ff4444;">Poista</button>
            </div>
        ` : '';

        circle.bindPopup(`<strong>${style.icon} ${title}</strong><br>${warn}${actions}`);
        circle.on('click', () => {
            // Avataan popup heti
            circle.openPopup();
        });

        circle.addTo(window._poiLayerGroup);
    });
}

window.centerMapOnPOI = function(poi) {
    if (!map || !poi) return;
    if (typeof poi.lat !== 'number' || typeof poi.lng !== 'number') return;
    map.setView([poi.lat, poi.lng], Math.max(map.getZoom(), 17));
}

// =========================================================
// Ajon markerit (historiassa)
// =========================================================
window._driveMarkerLayers = [];

function renderDriveMarkersOnMap(drive, driveKey) {
    if (!map || !drive || !Array.isArray(drive.markers)) return;

    drive.markers.forEach((m, idx) => {
        if (!m) return;
        const mLat = (typeof m.lat === 'number') ? m.lat : parseFloat(m.lat);
        const mLng = (typeof m.lng === 'number') ? m.lng : parseFloat(m.lng);
        if (!isFinite(mLat) || !isFinite(mLng)) return;
        const label = (m.label && String(m.label).trim()) ? String(m.label).trim() : `Merkki #${idx + 1}`;
        const ts = m.ts ? new Date(m.ts).toLocaleString('fi-FI') : '';

        const marker = L.marker([mLat, mLng]);
        const actions = (!drive.isPending && driveKey) ? `
            <div style="display:flex; gap:8px; margin-top:8px;">
                <button onclick="window.editDriveMarker('${driveKey}', ${idx})" class="action-btn" style="width:auto; padding:6px 10px; background:#424242;">Muokkaa</button>
                <button onclick="window.deleteDriveMarker('${driveKey}', ${idx})" class="action-btn" style="width:auto; padding:6px 10px; background:#ff4444;">Poista</button>
            </div>
            <div style="display:flex; gap:8px; margin-top:8px;">
                <button onclick="window.saveMarkerAsPOI('${driveKey}', ${idx})" class="action-btn" style="width:auto; padding:6px 10px; background:#1e88e5;">Tallenna POI:ksi</button>
            </div>
        ` : '';

        marker.bindPopup(
            `<strong>📌 ${label}</strong>` +
            `${ts ? `<br><span style="font-size:12px; opacity:0.75;">${ts}</span>` : ''}` +
            actions
        );
        marker.addTo(map);
        window._driveMarkerLayers.push(marker);
    });
}

window.editDriveMarker = function(driveKey, markerIndex) {
    if (!currentUser) return;
    const drive = allHistoryData.find(d => d && d.key === driveKey);
    if (!drive || drive.isPending) {
        if (typeof showToast === 'function') showToast('Offline-ajon markereita ei voi muokata ennen synkronointia.');
        return;
    }
    if (!Array.isArray(drive.markers) || !drive.markers[markerIndex]) return;

    const currentLabel = drive.markers[markerIndex].label || '';
    const nextLabel = prompt('Muokkaa selitettä', currentLabel);
    if (nextLabel === null) return;

    drive.markers[markerIndex].label = String(nextLabel).trim();

    db.ref('ajopaivakirja/' + currentUser.uid + '/' + driveKey + '/markers').set(drive.markers)
        .then(() => {
            if (typeof showToast === 'function') showToast('Marker päivitetty.');
            // Päivitä näkyvä kartta uudelleen jos sama reitti on auki
            if (typeof window.showRouteOnMap === 'function') window.showRouteOnMap(driveKey);
        })
        .catch((err) => {
            alert('Virhe markerin päivityksessä: ' + err.message);
        });
}

window.deleteDriveMarker = function(driveKey, markerIndex) {
    if (!currentUser) return;
    const drive = allHistoryData.find(d => d && d.key === driveKey);
    if (!drive || drive.isPending) {
        if (typeof showToast === 'function') showToast('Offline-ajon markereita ei voi poistaa ennen synkronointia.');
        return;
    }
    if (!Array.isArray(drive.markers) || !drive.markers[markerIndex]) return;
    if (!confirm('Poistetaanko tämä merkintä ajolta?')) return;

    drive.markers.splice(markerIndex, 1);

    db.ref('ajopaivakirja/' + currentUser.uid + '/' + driveKey + '/markers').set(drive.markers)
        .then(() => {
            if (typeof showToast === 'function') showToast('Marker poistettu.');
            if (typeof window.showRouteOnMap === 'function') window.showRouteOnMap(driveKey);
        })
        .catch((err) => {
            alert('Virhe markerin poistossa: ' + err.message);
        });
}

window.saveMarkerAsPOI = function(driveKey, markerIndex) {
    if (!currentUser) return;
    const drive = allHistoryData.find(d => d && d.key === driveKey);
    if (!drive || drive.isPending) {
        if (typeof showToast === 'function') showToast('Offline-ajon markereita ei voi muuntaa POI:ksi ennen synkronointia.');
        return;
    }
    if (!Array.isArray(drive.markers) || !drive.markers[markerIndex]) return;

    const m = drive.markers[markerIndex];
    const lat = (typeof m.lat === 'number') ? m.lat : parseFloat(m.lat);
    const lng = (typeof m.lng === 'number') ? m.lng : parseFloat(m.lng);
    if (!isFinite(lat) || !isFinite(lng)) return;

    const defaultType = 'speedcamera';
    const typeInput = prompt(
        'Valitse POI-tyyppi (kirjoita yksi):\n- speedcamera\n- danger\n- customer\n- reminder\n- other',
        defaultType
    );
    if (!typeInput) return;
    const type = String(typeInput).trim().toLowerCase();

    const defaultName = (m.label && String(m.label).trim()) ? String(m.label).trim() : '';
    const name = prompt('Nimi (valinnainen)', defaultName);
    if (name === null) return;

    const payload = {
        name: String(name || '').trim(),
        type,
        lat,
        lng,
        alertEnabled: true,
        alertRadiusM: 350,
        cooldownSec: 180,
        beepEnabled: true,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    db.ref('poi/' + currentUser.uid).push().set(payload)
        .then(() => {
            if (typeof showToast === 'function') showToast('POI tallennettu markerista ✅');
            if (typeof window.loadPOIs === 'function') window.loadPOIs();
        })
        .catch((err) => {
            alert('Virhe POI-tallennuksessa: ' + err.message);
        });
}

// 3. GPS Toggle Kartalla (ON/OFF)
if (mapGpsToggle) {
    mapGpsToggle.addEventListener('click', () => {
        isViewingHistory = !isViewingHistory;
        
        if(isViewingHistory) {
            // GPS pois päältä kartalla (katselutila)
            mapGpsToggle.innerText = "📡 OFF";
            mapGpsToggle.classList.add('inactive');
        } else {
            // GPS päälle kartalla (seurantatila)
            mapGpsToggle.innerText = "📡 ON";
            mapGpsToggle.classList.remove('inactive');
            
            // Keskitä heti, jos sijainti on tiedossa
            if(lastLatLng && map) {
                map.panTo([lastLatLng.lat, lastLatLng.lng]);
            }
        }
    });
}

// 4. Reitin katselu historiasta (Globaali funktio)
window.showRouteOnMap = (key) => {
    // Haetaan ajo historiasta
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive || !drive.route) { alert("Ei reittidataa."); return; }

    // Siivotaan edelliset viivat
    clearSavedRoute();
    
    // Aktivoi katselutila
    isViewingHistory = true; 
    if(mapGpsToggle) {
        mapGpsToggle.innerText = "📡 OFF";
        mapGpsToggle.classList.add('inactive');
    }
    if(mapLegend) mapLegend.style.display = 'flex';

    // Tarkista formaatti (uusi vs vanha)
    const isNewFormat = (drive.route.length > 0 && typeof drive.route[0] === 'object' && drive.route[0].lat);

    if (isNewFormat) {
        // UUSI VÄRILLINEN REÏTTI (SEGMENTIT)
        // Käydään pisteet läpi ja piirretään viivaa värien mukaan
        for (let i = 0; i < drive.route.length - 1; i++) {
            const p1 = drive.route[i];
            const p2 = drive.route[i+1];
            
            const color = getSpeedColor(p1.spd || 0, drive.carType);
            
            const segment = L.polyline([[p1.lat, p1.lng], [p2.lat, p2.lng]], {
                color: color, 
                weight: 5, 
                opacity: 0.8
            }).addTo(map);
            
            savedRouteLayers.push(segment);
        }
        // Keskitä kartta reittiin
        const bounds = L.latLngBounds(drive.route.map(p => [p.lat, p.lng]));
        map.fitBounds(bounds, {padding: [50, 50]});
        
    } else {
        // VANHA ORANSSI VIIVA (Yhteensopivuus vanhan datan kanssa)
        savedRouteLayer = L.polyline(drive.route, {color: '#ff9100', weight: 5, opacity: 0.8}).addTo(map);
        map.fitBounds(savedRouteLayer.getBounds(), {padding: [50, 50]});
    }

    // Markerit ajolta
    renderDriveMarkersOnMap(drive, key);
    
    // Vaihda näkymä kartalle (UI-funktio)
    if(typeof switchView === 'function') switchView('map');
};

// 5. Apufunktiot

// Poistaa historian viivat kartalta
function clearSavedRoute() {
    if(savedRouteLayers.length > 0) {
        savedRouteLayers.forEach(layer => map.removeLayer(layer));
        savedRouteLayers = [];
    }
    if(savedRouteLayer) {
        map.removeLayer(savedRouteLayer);
        savedRouteLayer = null;
    }

    if (window._driveMarkerLayers && window._driveMarkerLayers.length > 0) {
        window._driveMarkerLayers.forEach(layer => {
            try { map.removeLayer(layer); } catch(e) {}
        });
        window._driveMarkerLayers = [];
    }
}

// Laskee värin nopeuden perusteella (PÄIVITETTY LOGIIKKA: KÄVELY LISÄTTY)
function getSpeedColor(speed, type) {
    // KÄVELY (Walking)
    if (type === 'walking') {
        if (speed < 2) return '#2979ff';   // Sininen (Pysähdys/Hidas)
        if (speed < 8) return '#00e676';   // Vihreä (Kävely)
        return '#ff1744';                  // Punainen (Juoksu/Kova vauhti)
    }

    // PYÖRÄ (Bike)
    if (type === 'bike') {
        if (speed < 5) return '#2979ff';   // Sininen (Talutus/Pysähdys)
        if (speed < 20) return '#00e676';  // Vihreä (Normaali)
        return '#ff1744';                  // Punainen (Kova vauhti)
    }

    // AUTO / MOTO (Default)
    if (speed < 20) return '#2979ff';  // Sininen (Ruuhka/Piha/Valot)
    if (speed < 60) return '#00e676';  // Vihreä (Kaupunki)
    if (speed < 90) return '#ffea00';  // Keltainen (Maantie)
    return '#ff1744';                  // Punainen (Moottoritie/Ylinopeus)
}
