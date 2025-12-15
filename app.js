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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.database();

// --- SPLASH SCREEN ---
window.addEventListener('load', () => {
    const splash = document.getElementById('splash-screen');
    setTimeout(() => {
        splash.style.opacity = '0';
        setTimeout(() => splash.style.display = 'none', 500);
    }, 2000);
    setInterval(updateClock, 1000);
});

// --- MUUTTUJAT ---
let watchId = null;
let isDriving = false;
let wakeLock = null;
let startTime = null;
let timerInterval = null;

// Tilastomuuttujat
let maxSpeed = 0;
let totalDistance = 0;
let lastLatLng = null;

// UI Elementit
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');
const statusEl = document.getElementById('status');
const btnTheme = document.getElementById('btn-theme');
const btnView = document.getElementById('btn-view-toggle');

// Näkymät
const dashboardView = document.getElementById('dashboard-view');
const mapView = document.getElementById('map-view');

// *** MUUTOS: Oletuksena kartta on POIS päältä (false) ***
let isMapMode = false; 

// Mittariston elementit
const dashSpeedEl = document.getElementById('dash-speed');
const dashMaxSpeedEl = document.getElementById('dash-max-speed');
const dashDistEl = document.getElementById('dash-dist');
const dashTimeEl = document.getElementById('dash-time');
const dashAltEl = document.getElementById('dash-alt');
const dashCoordsEl = document.getElementById('dash-coords');
const dashClockEl = document.getElementById('dash-clock');

// Kartan elementit
const mapSpeedEl = document.getElementById('map-speed');
const mapCoordsEl = document.getElementById('map-coords');

// --- KARTTA ALUSTUS ---
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OSM' });
const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });

const map = L.map('map', {
    center: [64.0, 26.0],
    zoom: 5,
    layers: [streetMap],
    zoomControl: false
});

const baseMaps = { "Kartta": streetMap, "Satelliitti": satelliteMap };
L.control.layers(baseMaps).addTo(map);
let marker = L.marker([64.0, 26.0]).addTo(map);

// --- NÄKYMÄN VAIHTO ---
btnView.addEventListener('click', () => {
    isMapMode = !isMapMode;
    
    if (isMapMode) {
        // Vaihdetaan KARTTAAN
        mapView.classList.remove('view-hidden');
        dashboardView.classList.add('view-hidden');
        btnView.innerText = "⊞"; // Ikoniksi tulee "Dashboard" (paluu mittaristoon)
        
        // Tärkeä: Kartta pitää päivittää, kun se tulee näkyviin piilosta
        setTimeout(() => map.invalidateSize(), 100);
    } else {
        // Vaihdetaan MITTARISTOON
        mapView.classList.add('view-hidden');
        dashboardView.classList.remove('view-hidden');
        btnView.innerText = "🗺"; // Ikoniksi tulee "Kartta" (paluu karttaan)
    }
});

// --- TEEMA ---
btnTheme.addEventListener('click', () => document.body.classList.toggle('light-theme'));

// --- LOGIIKKA ---
btnStart.addEventListener('click', startDrive);
btnStop.addEventListener('click', stopDrive);

function startDrive() {
    isDriving = true;
    startTime = new Date();
    maxSpeed = 0;
    totalDistance = 0;
    lastLatLng = null;

    updateDashboardUI(0, 0, 0, 0, 0);
    
    btnStart.style.display = 'none';
    btnStop.style.display = 'inline-block';
    statusEl.innerText = "Haetaan GPS...";

    requestWakeLock();

    timerInterval = setInterval(updateTimer, 1000);

    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }
}

function stopDrive() {
    isDriving = false;
    navigator.geolocation.clearWatch(watchId);
    clearInterval(timerInterval);
    releaseWakeLock();
    
    btnStart.style.display = 'inline-block';
    btnStop.style.display = 'none';
    statusEl.innerText = "Ajo tallennettu.";

    saveToFirebase({
        type: 'end_drive',
        startTime: startTime.toISOString(),
        endTime: new Date().toISOString(),
        distanceKm: totalDistance.toFixed(2),
        maxSpeed: maxSpeed.toFixed(1)
    });
}

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const alt = position.coords.altitude || 0;
    const speedMs = position.coords.speed || 0; 
    let speedKmh = speedMs * 3.6;
    if (speedKmh < 0) speedKmh = 0;

    // 1. Huippunopeus
    if (speedKmh > maxSpeed) maxSpeed = speedKmh;

    // 2. Matkan laskenta
    if (isDriving && lastLatLng) {
        const dist = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
        if (dist > 0.005) { 
            totalDistance += dist;
        }
    }
    lastLatLng = { lat, lng };

    // 3. Päivitä Kartta (Vain jos se on näkyvissä, säästää tehoja)
    const newLatLng = new L.LatLng(lat, lng);
    marker.setLatLng(newLatLng);
    if (isMapMode) {
        map.setView(newLatLng, 17);
        mapSpeedEl.innerText = Math.round(speedKmh);
        mapCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    }

    // 4. Päivitä Dashboard (Aina taustalla)
    dashSpeedEl.innerText = Math.round(speedKmh);
    dashMaxSpeedEl.innerText = maxSpeed.toFixed(1);
    dashDistEl.innerText = totalDistance.toFixed(2);
    dashAltEl.innerText = Math.round(alt);
    dashCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;

    statusEl.innerText = "Tallennetaan...";

    if (isDriving && wakeLock === null) requestWakeLock();
}

// --- APUFUNKTIOT ---

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dashClockEl.innerText = timeStr;
}

function updateTimer() {
    if (!startTime) return;
    const now = new Date();
    const diff = now - startTime;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    dashTimeEl.innerText = 
        (hrs > 0 ? hrs + ":" : "") + 
        (mins < 10 ? "0" : "") + mins + ":" + 
        (secs < 10 ? "0" : "") + secs;
}

function updateDashboardUI(spd, max, dist, time, alt) {
    dashSpeedEl.innerText = spd;
    dashMaxSpeedEl.innerText = max;
    dashDistEl.innerText = dist;
    dashAltEl.innerText = alt;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; 
  var dLat = deg2rad(lat2-lat1);  
  var dLon = deg2rad(lon2-lon1); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c; 
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI/180)
}

function toGeocacheFormat(degrees, isLat) {
    const d = Math.floor(Math.abs(degrees));
    const m = (Math.abs(degrees) - d) * 60;
    let dir = isLat ? (degrees >= 0 ? "N" : "S") : (degrees >= 0 ? "E" : "W");
    let mStr = m.toFixed(3);
    if (m < 10) mStr = "0" + mStr;
    return `${dir} ${d}° ${mStr}`;
}

function handleError(error) {
    console.warn('ERROR(' + error.code + '): ' + error.message);
    statusEl.innerText = "Odotetaan GPS...";
}

async function requestWakeLock() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {}
}
function releaseWakeLock() {
    if (wakeLock) { wakeLock.release(); wakeLock = null; }
}

function saveToFirebase(data) {
    db.ref('ajopaivakirja').push().set(data);
}
