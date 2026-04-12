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
        if (!poi || typeof poi.lat !== 'number' || typeof poi.lng !== 'number') return;
        const style = getPoiStyle(poi.type);

        const circle = L.circleMarker([poi.lat, poi.lng], {
            radius: 7,
            color: style.color,
            fillColor: style.fillColor,
            fillOpacity: 0.85,
            weight: 2
        });

        const title = poi.name || 'POI';
        const warn = poi.alertEnabled ? `Varoitus: PÄÄLLÄ (${poi.alertRadiusM || 350}m / ${poi.cooldownSec || 180}s)` : 'Varoitus: POIS';

        circle.bindPopup(`<strong>${style.icon} ${title}</strong><br>${warn}`);
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
