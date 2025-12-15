// 1. Firebase konfiguraatio
const firebaseConfig = {
    apiKey: "AIzaSyCZIupycr2puYrPK2KajAW7PcThW9Pjhb0",
    authDomain: "perhekalenteri-projekti.firebaseapp.com",
    databaseURL: "https://perhekalenteri-projekti-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "perhekalenteri-projekti",
    storageBucket: "perhekalenteri-projekti.appspot.com",
    messagingSenderId: "588536838615",
    appId: "1:588536838615:web:148de0581bbd46c42c7392"
};

// Alustetaan Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// --- MUUTTUJAT ---
let watchId = null;
let isDriving = false;
let wakeLock = null; // Näytön hereillä pito

const speedEl = document.getElementById('speed');
const coordsEl = document.getElementById('coords');
const statusEl = document.getElementById('status');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const btnTheme = document.getElementById('btn-theme');

// --- 2. KARTAN ALUSTUS JA TASOT ---

// Määritellään eri karttapohjat
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
});

const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles &copy; Esri'
});

// Luodaan kartta oletuksena katukartalla
const map = L.map('map', {
    center: [64.0, 26.0],
    zoom: 5,
    layers: [streetMap], // Oletuskerros
    zoomControl: false // Siirretään zoom-napit jos halutaan, nyt pois tieltä
});

// Lisätään kerrosvalikko (oikea yläkulma)
const baseMaps = {
    "Kartta": streetMap,
    "Satelliitti": satelliteMap
};
L.control.layers(baseMaps).addTo(map);

let marker = L.marker([64.0, 26.0]).addTo(map);

// --- 3. TEEMA LOGIIKKA ---
function initTheme() {
    // Tarkistetaan onko käyttäjä jo valinnut teeman aiemmin?
    // Tai noudatetaan järjestelmän asetusta
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        document.body.classList.add('light-theme');
    }
}

btnTheme.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
});

initTheme();

// --- 4. WAKE LOCK (NÄYTÖN HEREILLÄ PITO) ---
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Näyttö pidetään päällä.');
            statusEl.innerText = "Seuranta päällä (Näyttö lukittu auki)";
        }
    } catch (err) {
        console.error(`${err.name}, ${err.message}`);
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release()
            .then(() => {
                wakeLock = null;
                console.log('Näytön lukitus vapautettu.');
            });
    }
}

// --- 5. LOGIIKKA ---

btnStart.addEventListener('click', startDrive);
btnStop.addEventListener('click', stopDrive);

function startDrive() {
    isDriving = true;
    
    btnStart.style.display = 'none';
    btnStop.style.display = 'inline-block';
    statusEl.innerText = "Haetaan GPS...";

    // Pyydetään näyttöä pysymään päällä
    requestWakeLock();

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        alert("Selaimesi ei tue paikannusta.");
    }
}

function stopDrive() {
    isDriving = false;
    navigator.geolocation.clearWatch(watchId);
    
    // Vapautetaan näyttö
    releaseWakeLock();
    
    btnStart.style.display = 'inline-block';
    btnStop.style.display = 'none';
    speedEl.innerText = "0.00";
    statusEl.innerText = "Ajo lopetettu.";

    saveToFirebase({
        type: 'end_drive',
        timestamp: new Date().toISOString()
    });
}

// --- APUFUNKTIO: Geocaching format (DD MM.MMM) ---
function toGeocacheFormat(degrees, isLat) {
    const d = Math.floor(Math.abs(degrees));
    const m = (Math.abs(degrees) - d) * 60;
    
    let dir = "";
    if (isLat) {
        dir = degrees >= 0 ? "N" : "S";
    } else {
        dir = degrees >= 0 ? "E" : "W";
    }
    
    // Muotoillaan minuutit 3 desimaalin tarkkuudella, lisätään etunolla jos < 10
    let mStr = m.toFixed(3);
    if (m < 10) mStr = "0" + mStr;
    
    return `${dir} ${d}° ${mStr}`;
}

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const speedMs = position.coords.speed || 0; 
    const speedKmh = speedMs * 3.6;

    // Päivitetään UI: Nopeus 2 desimaalilla
    speedEl.innerText = speedKmh.toFixed(2);
    
    // Päivitetään UI: Koordinaatit
    const latStr = toGeocacheFormat(lat, true);
    const lngStr = toGeocacheFormat(lng, false);
    coordsEl.innerText = `${latStr} ${lngStr}`;

    statusEl.innerText = isDriving ? "Tallennetaan..." : "Valmiustila";

    // Päivitetään kartta
    const newLatLng = new L.LatLng(lat, lng);
    marker.setLatLng(newLatLng);
    map.setView(newLatLng, 17); // Zoom lähemmäs

    // Jos näyttö on sammunut hetkellisesti (esim. käyttäjä vaihtoi sovellusta),
    // yritetään ottaa Wake Lock uudelleen, jos se on kadonnut
    if (isDriving && wakeLock === null) {
        requestWakeLock();
    }
}

function handleError(error) {
    console.warn('ERROR(' + error.code + '): ' + error.message);
    statusEl.innerText = "Virhe paikannuksessa.";
}

function saveToFirebase(data) {
    const newDriveRef = db.ref('ajopaivakirja').push();
    newDriveRef.set(data);
}

// Kuunnellaan näkyvyyden muutoksia (jos käyttäjä käy kotivalikossa ja palaa)
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        requestWakeLock();
    }
});
