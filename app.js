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
const auth = firebase.auth(); // Otetaan Auth käyttöön

// --- DOM ELEMENTIT ---
const splashScreen = document.getElementById('splash-screen');
const loginView = document.getElementById('login-view');
const appContainer = document.getElementById('app-container');
const btnLogin = document.getElementById('btn-login');
const btnLogout = document.getElementById('btn-logout');
const userPhoto = document.getElementById('user-photo');

// --- MUUTTUJAT ---
let currentUser = null; // Tähän tallentuu kirjautunut käyttäjä
let watchId = null;
let isGPSActive = false;
let isRecording = false; 
let wakeLock = null;
let startTime = null;
let timerInterval = null;

// Tilastot
let maxSpeed = 0;
let totalDistance = 0;
let lastLatLng = null;

// UI
const btnActivateGPS = document.getElementById('btn-activate-gps');
const recControls = document.getElementById('rec-controls');
const btnStartRec = document.getElementById('btn-start-rec');
const btnStopRec = document.getElementById('btn-stop-rec');
const statusEl = document.getElementById('status');

const btnTheme = document.getElementById('btn-theme');
const btnView = document.getElementById('btn-view-toggle');
const dashboardView = document.getElementById('dashboard-view');
const mapView = document.getElementById('map-view');
let isMapMode = false; 

// Mittaristo ja Kartta elementit
const dashSpeedEl = document.getElementById('dash-speed');
const dashMaxSpeedEl = document.getElementById('dash-max-speed');
const dashDistEl = document.getElementById('dash-dist');
const dashTimeEl = document.getElementById('dash-time');
const dashAltEl = document.getElementById('dash-alt');
const dashCoordsEl = document.getElementById('dash-coords');
const dashClockEl = document.getElementById('dash-clock');
const mapSpeedEl = document.getElementById('map-speed');
const mapCoordsEl = document.getElementById('map-coords');

// --- AUTHENTICATION LOGIIKKA (KÄYTTÄJÄNHALLINTA) ---

// 1. Kuunnellaan kirjautumistilaa
auth.onAuthStateChanged((user) => {
    // Piilotetaan splash screen joka tapauksessa
    if (splashScreen) {
        setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);
    }

    if (user) {
        // KÄYTTÄJÄ ON KIRJAUTUNUT
        currentUser = user;
        console.log("Kirjautunut käyttäjä:", user.displayName);
        
        loginView.style.display = 'none';
        appContainer.style.display = 'flex';
        
        // Asetetaan profiilikuva jos on, muuten oletuslogo
        if (user.photoURL) {
            userPhoto.src = user.photoURL;
        }
        
    } else {
        // EI KIRJAUTUNUT
        currentUser = null;
        appContainer.style.display = 'none';
        loginView.style.display = 'flex';
    }
});

// 2. Kirjaudu sisään -nappi
btnLogin.addEventListener('click', () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider).catch((error) => {
        alert("Kirjautuminen epäonnistui: " + error.message);
    });
});

// 3. Kirjaudu ulos -nappi
btnLogout.addEventListener('click', () => {
    if (confirm("Haluatko varmasti kirjautua ulos?")) {
        auth.signOut().then(() => {
            // Nollataan tila
            stopGPSAndRec();
            location.reload(); // Ladataan sivu uudelleen varmuuden vuoksi
        });
    }
});

// --- KARTTA ALUSTUS ---
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OSM' });
const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });
const map = L.map('map', { center: [64.0, 26.0], zoom: 16, layers: [streetMap], zoomControl: false });
L.control.layers({ "Kartta": streetMap, "Satelliitti": satelliteMap }).addTo(map);
let marker = L.circleMarker([64.0, 26.0], { color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.8, radius: 8 }).addTo(map);

// --- NAPPIEN TOIMINNOT ---

btnActivateGPS.addEventListener('click', () => {
    if (!isGPSActive) {
        startGPS();
        btnActivateGPS.style.display = 'none';
        recControls.style.display = 'flex'; 
        statusEl.innerText = "GPS Päällä - Ei tallennusta";
    }
});

btnStartRec.addEventListener('click', () => {
    isRecording = true;
    startTime = new Date();
    maxSpeed = 0;
    totalDistance = 0;
    updateDashboardUI(0, 0, 0, 0, 0);
    
    btnStartRec.style.display = 'none';
    btnStopRec.style.display = 'inline-block';
    statusEl.innerText = "🔴 TALLENNETAAN AJOA";
    statusEl.style.color = "#ff4444";
    
    timerInterval = setInterval(updateTimer, 1000);
});

btnStopRec.addEventListener('click', () => {
    if (isRecording) {
        saveToFirebase({
            type: 'end_drive',
            startTime: startTime.toISOString(),
            endTime: new Date().toISOString(),
            distanceKm: totalDistance.toFixed(2),
            maxSpeed: maxSpeed.toFixed(1),
            subject: "" 
        });
    }
    stopRecording();
});

function stopRecording() {
    isRecording = false;
    clearInterval(timerInterval);
    btnStartRec.style.display = 'inline-block';
    btnStopRec.style.display = 'none';
    statusEl.innerText = "Tallennus lopetettu. GPS yhä päällä.";
    statusEl.style.color = "var(--subtext-color)";
}

function stopGPSAndRec() {
    stopRecording();
    isGPSActive = false;
    navigator.geolocation.clearWatch(watchId);
}

// --- GPS LOGIIKKA ---
function startGPS() {
    isGPSActive = true;
    requestWakeLock();
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true, timeout: 5000, maximumAge: 0
        });
    }
}

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const alt = position.coords.altitude || 0;
    const speedMs = position.coords.speed || 0; 
    let speedKmh = speedMs * 3.6;
    if (speedKmh < 1.0) speedKmh = 0;

    if (isRecording) {
        if (speedKmh > maxSpeed) maxSpeed = speedKmh;
        if (lastLatLng) {
            const dist = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
            if ((speedKmh > 3 || dist > 0.02) && dist < 2.0) { 
                totalDistance += dist;
            }
        }
    }
    
    if (!lastLatLng || speedKmh > 0 || isGPSActive) {
        lastLatLng = { lat, lng };
        const newLatLng = new L.LatLng(lat, lng);
        marker.setLatLng(newLatLng);
        
        if (isMapMode) {
            let targetZoom = 17; 
            if (speedKmh > 90) targetZoom = 13; 
            else if (speedKmh > 50) targetZoom = 15; 
            
            const currentZoom = map.getZoom();
            if (currentZoom !== targetZoom) map.setView(newLatLng, targetZoom); 
            else map.panTo(newLatLng);

            mapSpeedEl.innerText = Math.round(speedKmh);
            mapCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
        }
    }

    dashSpeedEl.innerText = Math.round(speedKmh);
    dashMaxSpeedEl.innerText = maxSpeed.toFixed(1);
    dashDistEl.innerText = totalDistance.toFixed(2);
    dashAltEl.innerText = Math.round(alt);
    dashCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;

    if (isRecording) statusEl.innerText = "🔴 REC";
    if (isGPSActive && wakeLock === null) requestWakeLock();
}

// --- APUFUNKTIOT ---
btnView.addEventListener('click', () => {
    isMapMode = !isMapMode;
    if (isMapMode) {
        mapView.classList.remove('view-hidden');
        dashboardView.classList.add('view-hidden');
        btnView.innerText = "⊞"; 
        setTimeout(() => map.invalidateSize(), 100);
    } else {
        mapView.classList.add('view-hidden');
        dashboardView.classList.remove('view-hidden');
        btnView.innerText = "🗺"; 
    }
});

btnTheme.addEventListener('click', () => document.body.classList.toggle('light-theme'));
setInterval(updateClock, 1000); // Käynnistä kello

function updateClock() {
    const now = new Date();
    dashClockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function updateTimer() {
    if (!startTime) return;
    const now = new Date();
    const diff = now - startTime;
    const hrs = Math.floor(diff / 3600000);
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    dashTimeEl.innerText = (hrs>0?hrs+":":"") + (mins<10?"0":"")+mins + ":" + (secs<10?"0":"")+secs;
}

function updateDashboardUI(spd, max, dist, time, alt) {
    dashSpeedEl.innerText = spd; dashMaxSpeedEl.innerText = max;
    dashDistEl.innerText = dist; dashAltEl.innerText = alt;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  var R = 6371; var dLat = deg2rad(lat2-lat1); var dLon = deg2rad(lon2-lon1); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return R * c; 
}
function deg2rad(deg) { return deg * (Math.PI/180) }

function toGeocacheFormat(degrees, isLat) {
    const d = Math.floor(Math.abs(degrees)); const m = (Math.abs(degrees) - d) * 60;
    let dir = isLat ? (degrees >= 0 ? "N" : "S") : (degrees >= 0 ? "E" : "W");
    let mStr = m.toFixed(3); if (m < 10) mStr = "0" + mStr;
    return `${dir} ${d}° ${mStr}`;
}

function handleError(error) { statusEl.innerText = "GPS Virhe: " + error.message; }
async function requestWakeLock() { try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {} }

// --- TALLENNUS OMAAN KANSIOON ---
function saveToFirebase(data) {
    if (currentUser) {
        // TALLENNETAAN KÄYTTÄJÄN OMAAN HAKEMISTOON: ajopaivakirja/USER_ID/...
        db.ref('ajopaivakirja/' + currentUser.uid).push().set(data);
    } else {
        alert("Et ole kirjautunut! Tietoja ei tallennettu.");
    }
}
