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

// 2. Luodaan kartta
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

    // Oma sijainti -merkki
    marker = L.circleMarker([64.0, 26.0], { 
        color: '#2979ff', 
        fillColor: '#2979ff', 
        fillOpacity: 0.8, 
        radius: 8 
    }).addTo(map);

    // Live-viiva
    realTimePolyline = L.polyline([], {
        color: '#2979ff', 
        weight: 5, 
        opacity: 0.7
    }).addTo(map);
}

// 3. GPS Toggle Kartalla
const mapGpsToggle = document.getElementById('map-gps-toggle');
if (mapGpsToggle) {
    mapGpsToggle.addEventListener('click', () => {
        isViewingHistory = !isViewingHistory;
        
        if(isViewingHistory) {
            mapGpsToggle.innerText = "📡 OFF";
            mapGpsToggle.classList.add('inactive');
        } else {
            mapGpsToggle.innerText = "📡 ON";
            mapGpsToggle.classList.remove('inactive');
            if(lastLatLng && map) map.panTo([lastLatLng.lat, lastLatLng.lng]);
        }
    });
}

// 4. Reitin katselu historiasta
window.showRouteOnMap = (key) => {
    // 1. Vaihda näkymä ensin, jotta kartta tulee esiin
    if(typeof switchView === 'function') switchView('map');

    const drive = allHistoryData.find(d => d.key === key);
    if (!drive || !drive.route) { 
        alert("Ei reittidataa."); 
        return; 
    }

    clearSavedRoute();
    
    // Aktivoi katselutila
    isViewingHistory = true; 
    if(mapGpsToggle) {
        mapGpsToggle.innerText = "📡 OFF";
        mapGpsToggle.classList.add('inactive');
    }
    const mapLegend = document.getElementById('map-legend');
    if(mapLegend) mapLegend.style.display = 'flex';

    // VAIHDA NAPIT: Piilota "Mittaristo", näytä "Takaisin Historiaan"
    const btnDash = document.getElementById('map-return-btn');
    const btnHist = document.getElementById('map-history-btn');
    if(btnDash) btnDash.style.display = 'none';
    if(btnHist) btnHist.style.display = 'block';

    // 2. Odota hetki, että kartta ehtii renderöityä (invalidateSize ui.js:ssä), ja piirrä sitten
    setTimeout(() => {
        if (!map) return;
        map.invalidateSize(); // Varmuuden vuoksi vielä tässä

        // Tarkista formaatti
        const isNewFormat = (drive.route.length > 0 && typeof drive.route[0] === 'object' && drive.route[0].lat);

        if (isNewFormat) {
            // UUSI VÄRILLINEN REÏTTI
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
            const bounds = L.latLngBounds(drive.route.map(p => [p.lat, p.lng]));
            map.fitBounds(bounds, {padding: [50, 50]});
            
        } else {
            // VANHA VIIVA
            savedRouteLayer = L.polyline(drive.route, {color: '#ff9100', weight: 5, opacity: 0.8}).addTo(map);
            map.fitBounds(savedRouteLayer.getBounds(), {padding: [50, 50]});
        }
    }, 300); // 300ms viive piirtoon
};

// 5. Apufunktiot

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

// VÄRILOGIIKKA
function getSpeedColor(speed, type) {
    // PYÖRÄ
    if (type === 'bike') {
        if (speed < 5) return '#2979ff';   // Pysähdys
        if (speed < 20) return '#00e676';  // Normaali
        return '#ff1744';                  // Kovaa
    }

    // AUTO
    if (speed < 20) return '#2979ff';  // Sininen (Hidas / Ruuhka / Valot)
    if (speed < 60) return '#00e676';  // Vihreä (Kaupunkiajo)
    if (speed < 90) return '#ffea00';  // Keltainen (Maantie)
    return '#ff1744';                  // Punainen (Moottoritie / Nopea)
}
