// =========================================================
// MAP.JS - KARTTA JA REITIN PIIRTO (v6.00 LAYERS)
// =========================================================

// 1. Määritellään karttatasot

// Peruskartta (OSM)
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    maxZoom: 19, 
    attribution: '© OSM' 
});

// Satelliitti (Esri)
const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
    attribution: 'Tiles &copy; Esri' 
});

// Maastokartta (OpenTopoMap)
const terrainMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { 
    maxZoom: 17, 
    attribution: '© OpenTopoMap' 
});

// Tumma kartta (CartoDB Dark Matter) - UUSI!
const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

// Merikartta (OSM + OpenSeaMap Overlay) - UUSI!
const openSeaMapOverlay = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
});
// Yhdistetään pohjakartta ja merimerkit yhdeksi valinnaksi, jotta näkyy rannat JA poijut
const marineMap = L.layerGroup([streetMap, openSeaMapOverlay]);


// 2. Luodaan kartta (map-muuttuja on määritelty globals.js:ssä)
// Varmistetaan että elementti on olemassa ennen luontia
if (document.getElementById('map')) {
    map = L.map('map', {
        center: [64.0, 26.0], 
        zoom: 16, 
        layers: [streetMap], // Oletus: Peruskartta
        zoomControl: false   // Poistetaan oletuszoom, lisätään se myöhemmin eri paikkaan
    });

    // Lisätään tasovalitsin (Oikea yläkulma)
    const baseMaps = {
        "Peruskartta": streetMap,
        "Tumma kartta": darkMap,
        "Satelliitti": satelliteMap,
        "Merikartta": marineMap,
        "Maastokartta": terrainMap
    };

    L.control.layers(baseMaps).addTo(map);

    // Zoom-kontrolli vasempaan alareunaan (ei häiritse nappeja)
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);
}

// 3. Funktio: Piirrä reitti kartalle (Historiasta)
window.showRouteOnMap = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive || !drive.route || drive.route.length === 0) {
        if(typeof showToast === 'function') showToast("Ei reittitietoja.");
        return;
    }

    clearSavedRoute();

    // Tarkistetaan onko reitti tallennettu uutena (array of objects) vai vanhana (array of arrays)
    const latLngs = drive.route.map(p => {
        if (Array.isArray(p)) return p; // Vanha formaatti [lat, lng]
        return [p.lat, p.lng]; // Uusi formaatti {lat:..., lng:...}
    });

    // Piirretään viiva nopeusväreillä (jos dataa on)
    if (drive.route[0].spd !== undefined) {
        // Monimutkainen monivärinen viiva
        for (let i = 0; i < drive.route.length - 1; i++) {
            const p1 = drive.route[i];
            const p2 = drive.route[i+1];
            const color = getSpeedColor(p1.spd, drive.carType);
            
            const line = L.polyline([[p1.lat, p1.lng], [p2.lat, p2.lng]], {
                color: color,
                weight: 5,
                opacity: 0.8
            }).addTo(map);
            savedRouteLayers.push(line);
        }
        
        // Sovita näkymä
        const bounds = L.latLngBounds(drive.route.map(p => [p.lat, p.lng]));
        map.fitBounds(bounds, {padding: [50, 50]});
        
    } else {
        // VANHA ORANSSI VIIVA (Yhteensopivuus vanhan datan kanssa, jos nopeus puuttuu)
        savedRouteLayer = L.polyline(latLngs, {color: '#ff9100', weight: 5, opacity: 0.8}).addTo(map);
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

// Laskee värin nopeuden perusteella (PÄIVITETTY LOGIIKKA)
function getSpeedColor(speed, type) {
    // PYÖRÄ (Bike)
    if (type === 'bike') {
        if (speed < 5) return '#2979ff';   // Sininen (Talutus/Pysähdys)
        if (speed < 20) return '#00e676';  // Vihreä (Normaali)
        if (speed < 35) return '#ffea00';  // Keltainen (Kovaa)
        return '#ff1744';                  // Punainen (Huippu)
    } 
    // AUTO (Car)
    else {
        if (speed < 10) return '#2979ff';  // Sininen (Ruuhka/Pysähdys)
        if (speed < 50) return '#00e676';  // Vihreä (Kaupunki)
        if (speed < 90) return '#ffea00';  // Keltainen (Maantie)
        return '#ff1744';                  // Punainen (Moottoritie)
    }
}

// Live-reitin piirto (kutsutaan gps.js:stä)
// Alustetaan punainen viiva reaaliaikaiseen piirtoon
if (map) {
    realTimePolyline = L.polyline([], {color: 'red', weight: 4}).addTo(map);
}
