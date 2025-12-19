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

// Laskee värin nopeuden perusteella
function getSpeedColor(speed, type) {
    let max = (type === 'bike') ? 30 : 100;
    
    if (speed <= 3) return '#2979ff'; // Sininen (Hidas)
    
    let ratio = speed / max;
    if (ratio > 1) ratio = 1;

    if (ratio < 0.33) return '#00e676'; // Vihreä
    if (ratio < 0.66) return '#ffea00'; // Keltainen
    return '#ff1744'; // Punainen
}
