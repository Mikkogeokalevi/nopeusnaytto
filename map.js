// =========================================================
// MAP.JS - KARTTA JA REITIN PIIRTO (FIXED)
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

// 2. Luodaan kartta turvallisesti
if (document.getElementById('map')) {
    // Varmistetaan että globaali map-muuttuja on käytössä
    window.map = L.map('map', {
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
    }).addTo(window.map);

    // Oma sijainti -merkki
    window.marker = L.circleMarker([64.0, 26.0], { 
        color: '#2979ff', 
        fillColor: '#2979ff', 
        fillOpacity: 0.8, 
        radius: 8 
    }).addTo(window.map);

    // Live-viiva
    window.realTimePolyline = L.polyline([], {
        color: '#2979ff', 
        weight: 5, 
        opacity: 0.7
    }).addTo(window.map);
} else {
    console.error("Karttaelementtiä (div id='map') ei löytynyt!");
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
            if(lastLatLng && window.map) window.map.panTo([lastLatLng.lat, lastLatLng.lng]);
        }
    });
}

// 4. Reitin katselu historiasta (Määritellään suoraan window-objektiin)
window.showRouteOnMap = function(key) {
    console.log("Avataan reitti avaimella:", key);

    // 1. Etsi ajo datasta
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive) { alert("Virhe: Ajoa ei löydy muistista."); return; }
    if (!drive.route) { alert("Tällä ajolla ei ole tallennettua reittiä."); return; }

    // 2. Pakota näkymän vaihto kartalle
    if(typeof switchView === 'function') {
        switchView('map');
    } else {
        // Hätätapaus: vaihda manuaalisesti
        document.getElementById('history-view').style.display = 'none';
        document.getElementById('map-view').style.display = 'flex';
    }

    // 3. Siivoa vanhat viivat
    clearSavedRoute();
    
    // 4. Aseta tila
    isViewingHistory = true; 
    if(mapGpsToggle) {
        mapGpsToggle.innerText = "📡 OFF";
        mapGpsToggle.classList.add('inactive');
    }
    const mapLegend = document.getElementById('map-legend');
    if(mapLegend) mapLegend.style.display = 'flex';

    // 5. Vaihda napit (Piilota mittaristo-nappi, näytä takaisin-nappi)
    const btnDash = document.getElementById('map-return-btn');
    const btnHist = document.getElementById('map-history-btn');
    if(btnDash) btnDash.style.display = 'none';
    if(btnHist) btnHist.style.display = 'block';

    // 6. Piirrä reitti (pienellä viiveellä, jotta kartta ehtii aueta)
    setTimeout(() => {
        if (!window.map) return;
        
        window.map.invalidateSize(); // KRIITTINEN KORJAUS

        const isNewFormat = (drive.route.length > 0 && typeof drive.route[0] === 'object' && drive.route[0].lat);

        if (isNewFormat) {
            // Uusi värillinen viiva
            for (let i = 0; i < drive.route.length - 1; i++) {
                const p1 = drive.route[i];
                const p2 = drive.route[i+1];
                const color = getSpeedColor(p1.spd || 0, drive.carType);
                
                const segment = L.polyline([[p1.lat, p1.lng], [p2.lat, p2.lng]], {
                    color: color, 
                    weight: 5, 
                    opacity: 0.8
                }).addTo(window.map);
                savedRouteLayers.push(segment);
            }
            const bounds = L.latLngBounds(drive.route.map(p => [p.lat, p.lng]));
            window.map.fitBounds(bounds, {padding: [50, 50]});
        } else {
            // Vanha viiva
            savedRouteLayer = L.polyline(drive.route, {color: '#ff9100', weight: 5, opacity: 0.8}).addTo(window.map);
            window.map.fitBounds(savedRouteLayer.getBounds(), {padding: [50, 50]});
        }
    }, 300); // 300ms odotus
};

// 5. Apufunktiot

function clearSavedRoute() {
    if(savedRouteLayers.length > 0) {
        savedRouteLayers.forEach(layer => window.map.removeLayer(layer));
        savedRouteLayers = [];
    }
    if(savedRouteLayer) {
        window.map.removeLayer(savedRouteLayer);
        savedRouteLayer = null;
    }
}

function getSpeedColor(speed, type) {
    // PYÖRÄ
    if (type === 'bike') {
        if (speed < 5) return '#2979ff';
        if (speed < 20) return '#00e676';
        return '#ff1744';
    }
    // AUTO
    if (speed < 20) return '#2979ff';
    if (speed < 60) return '#00e676';
    if (speed < 90) return '#ffea00';
    return '#ff1744';
}
