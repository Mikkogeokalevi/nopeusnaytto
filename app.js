const firebaseConfig = {
    apiKey: "AIzaSyCZIupycr2puYrPK2KajAW7PcThW9Pjhb0",
    authDomain: "perhekalenteri-projekti.firebaseapp.com",
    databaseURL: "https://perhekalenteri-projekti-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "perhekalenteri-projekti",
    storageBucket: "perhekalenteri-projekti.appspot.com",
    messagingSenderId: "588536838615",
    appId: "1:588536838615:web:148de0581bbd46c42c7392"
};

if (!firebase.apps.length) { firebase.initializeApp(firebaseConfig); }
const db = firebase.database();
const auth = firebase.auth(); 

// Elementit
const splashScreen = document.getElementById('splash-screen');
const loginView = document.getElementById('login-view');
const appContainer = document.getElementById('app-container');
const userPhoto = document.getElementById('user-photo');

const views = {
    dashboard: document.getElementById('dashboard-view'),
    map: document.getElementById('map-view'),
    history: document.getElementById('history-view'),
    help: document.getElementById('help-view')
};

const navBtns = {
    dashboard: document.getElementById('nav-dashboard'),
    map: document.getElementById('nav-map'),
    history: document.getElementById('nav-history'),
    help: document.getElementById('nav-help')
};

let currentUser = null; 
let watchId = null;
let isGPSActive = false;
let isRecording = false; 
let wakeLock = null;
let startTime = null;
let timerInterval = null;
let maxSpeed = 0;
let totalDistance = 0;
let lastLatLng = null;

const dashSpeedEl = document.getElementById('dash-speed');
const dashMaxSpeedEl = document.getElementById('dash-max-speed');
const dashDistEl = document.getElementById('dash-dist');
const dashTimeEl = document.getElementById('dash-time');
const dashAltEl = document.getElementById('dash-alt');
const dashCoordsEl = document.getElementById('dash-coords');
const mapSpeedEl = document.getElementById('map-speed');
const mapCoordsEl = document.getElementById('map-coords');
const statusEl = document.getElementById('status');

// --- AUTH ---
auth.onAuthStateChanged((user) => {
    if (splashScreen) setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);

    if (user) {
        currentUser = user;
        loginView.style.display = 'none';
        appContainer.style.display = 'flex';
        if (user.photoURL) {
            userPhoto.src = user.photoURL;
            userPhoto.style.display = 'block';
        }
    } else {
        currentUser = null;
        appContainer.style.display = 'none';
        loginView.style.display = 'flex';
    }
});

document.getElementById('btn-login').addEventListener('click', () => {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => alert(e.message));
});

document.getElementById('btn-logout').addEventListener('click', () => {
    if(confirm("Kirjaudu ulos?")) auth.signOut().then(() => location.reload());
});

// --- NAVIGOINTI ---
function switchView(viewName) {
    Object.values(views).forEach(el => el.style.display = 'none');
    Object.values(navBtns).forEach(btn => btn.classList.remove('active-nav'));

    views[viewName].style.display = (viewName === 'dashboard' || viewName === 'map') ? 'flex' : 'block';
    if(navBtns[viewName]) navBtns[viewName].classList.add('active-nav');

    if (viewName === 'map') setTimeout(() => map.invalidateSize(), 100);
    if (viewName === 'history') loadHistory();
}

navBtns.dashboard.addEventListener('click', () => switchView('dashboard'));
navBtns.map.addEventListener('click', () => switchView('map'));
navBtns.history.addEventListener('click', () => switchView('history'));
navBtns.help.addEventListener('click', () => switchView('help'));

// SIVUNAPIT
document.getElementById('side-tap-left').addEventListener('click', () => switchView('map'));
document.getElementById('side-tap-right').addEventListener('click', () => switchView('map'));
document.getElementById('map-return-btn').addEventListener('click', () => switchView('dashboard')); // UUSI NAPPI

// --- KARTTA ---
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OSM' });
const map = L.map('map', { center: [64.0, 26.0], zoom: 16, layers: [streetMap], zoomControl: false });
let marker = L.circleMarker([64.0, 26.0], { color: '#3388ff', fillColor: '#3388ff', fillOpacity: 0.8, radius: 8 }).addTo(map);

// --- GPS & TALLENNUS ---
document.getElementById('btn-activate-gps').addEventListener('click', () => {
    if (!isGPSActive) {
        startGPS();
        document.getElementById('btn-activate-gps').style.display = 'none';
        document.getElementById('rec-controls').style.display = 'flex';
        statusEl.innerText = "GPS Päällä";
    }
});

document.getElementById('btn-start-rec').addEventListener('click', () => {
    isRecording = true;
    startTime = new Date();
    maxSpeed = 0;
    totalDistance = 0;
    updateDashboardUI(0, 0, 0, 0, 0);
    
    document.getElementById('btn-start-rec').style.display = 'none';
    document.getElementById('btn-stop-rec').style.display = 'inline-block';
    statusEl.innerText = "🔴 TALLENNETAAN";
    statusEl.style.color = "#ff4444";
    timerInterval = setInterval(updateTimer, 1000);
});

document.getElementById('btn-stop-rec').addEventListener('click', () => {
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
    document.getElementById('btn-start-rec').style.display = 'inline-block';
    document.getElementById('btn-stop-rec').style.display = 'none';
    statusEl.innerText = "GPS Päällä";
    statusEl.style.color = "var(--subtext-color)";
}

function startGPS() {
    isGPSActive = true;
    requestWakeLock();
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true, timeout: 5000, maximumAge: 0
        });
    }
}

document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && isGPSActive) requestWakeLock();
});

async function requestWakeLock() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {}
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
            if ((speedKmh > 3 || dist > 0.02) && dist < 2.0) totalDistance += dist;
        }
    }
    
    if (!lastLatLng || speedKmh > 0 || isGPSActive) {
        lastLatLng = { lat, lng };
        const newLatLng = new L.LatLng(lat, lng);
        marker.setLatLng(newLatLng);
        
        if (views.map.style.display !== 'none') {
            let targetZoom = 17; 
            if (speedKmh > 90) targetZoom = 13; else if (speedKmh > 50) targetZoom = 15;
            if (map.getZoom() !== targetZoom) map.setView(newLatLng, targetZoom); else map.panTo(newLatLng);
            mapSpeedEl.innerText = speedKmh.toFixed(1);
            mapCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
        }
    }

    dashSpeedEl.innerText = speedKmh.toFixed(1);
    dashMaxSpeedEl.innerText = maxSpeed.toFixed(1);
    dashDistEl.innerText = totalDistance.toFixed(2);
    dashAltEl.innerText = Math.round(alt);
    dashCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
}

// --- HISTORIA KORJAUS ---
function loadHistory() {
    const logList = document.getElementById('log-list');
    if (!currentUser) return;
    
    logList.innerHTML = "<div class='loading'>Ladataan...</div>";
    
    // Käytetään .on() ja tarkistetaan exists()
    db.ref('ajopaivakirja/' + currentUser.uid).orderByChild('startTime').limitToLast(30).on('value', (snapshot) => {
        logList.innerHTML = "";
        
        if (!snapshot.exists()) {
            logList.innerHTML = "<p style='text-align:center; margin-top:20px;'>Ei tallennettuja ajoja.</p>";
            return;
        }

        const logs = [];
        snapshot.forEach(child => logs.push({ key: child.key, ...child.val() }));
        logs.reverse();

        logs.forEach(drive => {
            const start = new Date(drive.startTime);
            const dateStr = start.toLocaleDateString('fi-FI') + ' ' + start.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
            let durationStr = "?";
            if (drive.endTime) durationStr = Math.floor((new Date(drive.endTime) - start) / 60000) + " min";

            const card = document.createElement('div');
            card.className = 'log-card';
            card.innerHTML = `
                <div class="log-header">
                    <div class="log-date">${dateStr}</div>
                    <button class="delete-btn" onclick="deleteDrive('${drive.key}')">🗑</button>
                </div>
                <div class="log-stats">
                    <div><span class="stat-label">KM</span>${drive.distanceKm}</div>
                    <div><span class="stat-label">AIKA</span>${durationStr}</div>
                    <div><span class="stat-label">MAX</span>${drive.maxSpeed}</div>
                </div>
                <input type="text" class="subject-input" placeholder="Aihe..." value="${drive.subject || ''}" onchange="updateSubject('${drive.key}', this.value)">
            `;
            logList.appendChild(card);
        });
    });
}

window.updateSubject = (key, text) => db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update({ subject: text });
window.deleteDrive = (key) => {
    if(confirm("Poista?")) db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).remove();
};

document.getElementById('btn-theme').addEventListener('click', () => document.body.classList.toggle('light-theme'));
setInterval(() => {
    const now = new Date();
    document.getElementById('dash-clock').innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}, 1000);

function updateTimer() {
    if (!startTime) return;
    const diff = new Date() - startTime;
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const hrs = Math.floor(diff / 3600000);
    dashTimeEl.innerText = (hrs>0?hrs+":":"") + (mins<10?"0":"")+mins + ":" + (secs<10?"0":"")+secs;
}

function updateDashboardUI(spd, max, dist, time, alt) {
    dashSpeedEl.innerText = spd.toFixed(1); dashMaxSpeedEl.innerText = max;
    dashDistEl.innerText = dist; dashAltEl.innerText = alt;
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; const dLat = (lat2-lat1)*(Math.PI/180); const dLon = (lon2-lon1)*(Math.PI/180);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) + Math.cos(lat1*(Math.PI/180))*Math.cos(lat2*(Math.PI/180))*Math.sin(dLon/2)*Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}
function handleError(e) { statusEl.innerText = "GPS Virhe: " + e.message; }
function toGeocacheFormat(deg, isLat) {
    const d = Math.floor(Math.abs(deg)); const m = (Math.abs(deg)-d)*60;
    return `${isLat?(deg>=0?"N":"S"):(deg>=0?"E":"W")} ${d}° ${m.toFixed(3)}`;
}
function saveToFirebase(data) {
    if (currentUser) db.ref('ajopaivakirja/' + currentUser.uid).push().set(data);
}
