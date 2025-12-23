// =========================================================
// MAP.JS - KARTTA, TASOT JA VÄRILLINEN REITTI (FIXED v6.6)
// =========================================================

// 1. KARTTATASOJEN MÄÄRITTELY

// Peruskartta (OSM)
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    maxZoom: 19, 
    attribution: '© OSM' 
});

// Satelliitti (Esri World Imagery)
const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
    attribution: 'Tiles &copy; Esri' 
});

// Maastokartta (OpenTopoMap)
const terrainMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { 
    maxZoom: 17, 
    attribution: '© OpenTopoMap' 
});

// Tumma kartta (CartoDB Dark Matter) - Sopii yökäyttöön
const darkMap = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20
});

// Merikartta (OpenSeaMap Overlay + OSM pohja)
const openSeaMapOverlay = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', {
    maxZoom: 18,
    attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
});
// Yhdistetään pohjakartta ja merimerkit
const marineMap = L.layerGroup([streetMap, openSeaMapOverlay]);


// 2. KARTAN ALUSTUS
// (map-muuttuja on määritelty globals.js:ssä)

if (document.getElementById('map')) {
    // Tarkistetaan onko kartta jo alustettu, jotta ei tule "Map container is already initialized" -virhettä
    if (map !== null) {
        map.remove(); // Tuhotaan vanha instanssi jos sellainen on
    }

    map = L.map('map', {
        center: [64.0, 26.0], // Suomen keskipiste suurinpiirtein
        zoom: 5, 
        layers: [streetMap], // Oletus: Peruskartta
        zoomControl: false   // Poistetaan oletuszoom, siirretään se
    });

    // Tasovalitsin (Oikea yläkulma)
    const baseMaps = {
        "Peruskartta": streetMap,
        "Tumma kartta": darkMap,
        "Satelliitti": satelliteMap,
        "Merikartta": marineMap,
        "Maastokartta": terrainMap
    };

    L.control.layers(baseMaps).addTo(map);

    // Zoom-napit vasempaan alareunaan (pois peukalon tieltä)
    L.control.zoom({
        position: 'bottomleft'
    }).addTo(map);
}

// 3. REAALIAIKAINEN PIIRTO (GPS.JS KUTSUU)
// Alustetaan punainen viiva live-seurantaa varten
if (map) {
    realTimePolyline = L.polyline([], {color: 'red', weight: 4}).addTo(map);
}


// 4. HISTORIAN REITIN PIIRTO (NOPEUSVÄRITYS PALAUTETTU)
window.showRouteOnMap = (key) => {
    // Etsitään ajo avaimen perusteella
    const drive = allHistoryData.find(d => d.key === key);
    
    if (!drive || !drive.route || drive.route.length === 0) {
        if(typeof showToast === 'function') showToast("Ei reittitietoja.");
        else alert("Ei reittitietoja.");
        return;
    }

    // Tyhjennetään vanhat viivat
    clearSavedRoute();

    // Tarkistetaan onko reitissä nopeustietoa (uusi data) vai pelkät koordinaatit (vanha data)
    // Uusi data on muotoa [{lat:x, lng:y, spd:z}, ...]
    // Vanha data on muotoa [[lat,lng], [lat,lng]]
    const hasSpeedData = (drive.route[0].spd !== undefined);

    if (hasSpeedData) {
        // --- MONIVÄRINEN VIIVA (NOPEUS) ---
        // Piirretään viiva pätkissä (segment), jotta väri voi vaihtua välillä
        
        // Haetaan autotyyppi väriskaalaa varten
        let carType = 'car';
        if (drive.carType) carType = drive.carType;
        else if (drive.carId) {
            // Yritetään selvittää auton tyyppi ID:n perusteella
            const car = userCars.find(c => c.id === drive.carId);
            if (car) carType = car.type;
        }

        // Käydään pisteet läpi
        for (let i = 0; i < drive.route.length - 1; i++) {
            const p1 = drive.route[i];
            const p2 = drive.route[i+1];
            
            // Haetaan väri alkupisteen nopeuden mukaan
            const color = getSpeedColor(p1.spd, carType);
            
            const lineSegment = L.polyline([[p1.lat, p1.lng], [p2.lat, p2.lng]], {
                color: color,
                weight: 5,
                opacity: 0.8,
                smoothFactor: 1
            }).addTo(map);
            
            savedRouteLayers.push(lineSegment);
        }
        
        // Lisätään selite (Legend) näkyviin kartalle
        if(document.getElementById('map-legend')) {
            document.getElementById('map-legend').style.display = 'flex';
        }

    } else {
        // --- YKSIVÄRINEN VIIVA (VANHA DATA) ---
        // Jos nopeustieto puuttuu, piirretään oranssi viiva
        // Konvertoidaan vanha formaatti [lat,lng] tarvittaessa
        const latLngs = drive.route.map(p => {
            if(Array.isArray(p)) return p;
            return [p.lat, p.lng];
        });
        
        savedRouteLayer = L.polyline(latLngs, {color: '#ff9100', weight: 5, opacity: 0.8}).addTo(map);
        
        if(document.getElementById('map-legend')) {
            document.getElementById('map-legend').style.display = 'none';
        }
    }
    
    // Zoomataan reittiin
    // Lasketaan boundsit riippumatta datamuodosta
    const allPoints = drive.route.map(p => {
        if(Array.isArray(p)) return p;
        return [p.lat, p.lng];
    });
    
    const bounds = L.latLngBounds(allPoints);
    map.fitBounds(bounds, {padding: [50, 50]});
    
    // Vaihdetaan näkymä kartalle
    if(typeof switchView === 'function') switchView('map');
};


// 5. APUFUNKTIOT

// Poistaa piirretyt viivat kartalta
function clearSavedRoute() {
    // Poista moniväriset pätkät
    if(savedRouteLayers.length > 0) {
        savedRouteLayers.forEach(layer => map.removeLayer(layer));
        savedRouteLayers = [];
    }
    // Poista yksivärinen viiva
    if(savedRouteLayer) {
        map.removeLayer(savedRouteLayer);
        savedRouteLayer = null;
    }
}

// Laskee värin nopeuden perusteella
function getSpeedColor(speed, type) {
    if (type === 'bike') {
        // PYÖRÄILY SKAALA
        if (speed < 5) return '#2979ff';   // Sininen (Talutus/Hidas)
        if (speed < 20) return '#00e676';  // Vihreä (Normaali)
        if (speed < 35) return '#ffea00';  // Keltainen (Reipas)
        return '#ff1744';                  // Punainen (Kovaa / Alamäki)
    } else {
        // AUTOILY SKAALA
        if (speed < 10) return '#2979ff';  // Sininen (Ruuhka/Pysähdys)
        if (speed < 50) return '#00e676';  // Vihreä (Taajama)
        if (speed < 90) return '#ffea00';  // Keltainen (Maantie)
        return '#ff1744';                  // Punainen (Moottoritie)
    }
}
