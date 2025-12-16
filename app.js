// 1. FIREBASE KONFIGURAATIO
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

// Menu elementit
const menuBtn = document.getElementById('btn-menu-toggle');
const mainMenu = document.getElementById('main-menu');
const menuUserName = document.getElementById('user-name');
const menuUserAvatar = document.getElementById('user-photo');

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

// Muuttujat
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
const dashAvgEl = document.getElementById('dash-avg'); 
const dashCoordsEl = document.getElementById('dash-coords');
const dashClockEl = document.getElementById('dash-clock');
const dashDateEl = document.getElementById('dash-date'); 

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
        
        // Päivitä Menu
        menuUserName.innerText = user.displayName || user.email;
        if (user.photoURL) {
            menuUserAvatar.src = user.photoURL;
        }

        if (views.map.style.display !== 'none') setTimeout(() => map.invalidateSize(), 200);
    } else {
        currentUser = null;
        // Jos ollaan ohjesivulla, älä pakota login-näkymää heti päälle
        if (appContainer.style.display !== 'flex') {
            appContainer.style.display = 'none';
            loginView.style.display = 'flex';
        }
    }
});

document.getElementById('btn-login').addEventListener('click', () => {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => alert(e.message));
});

document.getElementById('btn-logout').addEventListener('click', () => {
    if(confirm("Kirjaudu ulos?")) auth.signOut().then(() => location.reload());
});

// UUSI: OHJEET ILMAN KIRJAUTUMISTA
document.getElementById('btn-login-help').addEventListener('click', () => {
    loginView.style.display = 'none';
    appContainer.style.display = 'flex';
    // Pakotetaan ohjesivu auki ja piilotetaan muut (paitsi yläpalkki)
    switchView('help');
    
    // Piilotetaan alapalkki (koska sitä ei tarvita ohjeissa)
    document.querySelector('.controls-container').style.display = 'none';
    
    // Lisätään "Takaisin kirjautumiseen" -nappi ohjeisiin
    const backBtn = document.createElement('button');
    backBtn.innerText = "← Takaisin kirjautumiseen";
    backBtn.className = 'action-btn blue-btn';
    backBtn.style.marginTop = "20px";
    backBtn.onclick = () => location.reload();
    
    const helpView = document.getElementById('help-view');
    // Varmistetaan ettei nappi tule moneen kertaan
    if (!helpView.querySelector('button')) {
        helpView.prepend(backBtn);
    }
});


// --- MENU LOGIIKKA ---
menuBtn.addEventListener('click', () => {
    if (mainMenu.style.display === 'none') {
        mainMenu.style.display = 'flex';
    } else {
        mainMenu.style.display = 'none';
    }
});

// --- NAVIGOINTI ---
function switchView(viewName) {
    mainMenu.style.display = 'none';
    Object.values(views).forEach(el => el.style.display = 'none');
    Object.values(navBtns).forEach(btn => btn.classList.remove('active-menu'));

    if (viewName === 'dashboard' || viewName === 'map') {
        views[viewName].style.display = 'flex';
    } else {
        views[viewName].style.display = 'block';
    }
    
    if(navBtns[viewName]) navBtns[viewName].classList.add('active-menu');

    if (viewName === 'map') setTimeout(() => map.invalidateSize(), 100);
    if (viewName === 'history') loadHistory();
}

navBtns.dashboard.addEventListener('click', () => switchView('dashboard'));
navBtns.map.addEventListener('click', () => switchView('map'));
navBtns.history.addEventListener('click', () => switchView('history'));
navBtns.help.addEventListener('click', () => switchView('help'));

// Sivunappi
document.getElementById('side-tap-left').addEventListener('click', () => switchView('map'));
document.getElementById('map-return-btn').addEventListener('click', () => switchView('dashboard'));

// --- KARTTA ---
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OSM' });
const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });

const map = L.map('map', { center: [64.0, 26.0], zoom: 16, layers: [streetMap], zoomControl: false });
L.control.layers({ "Kartta": streetMap, "Satelliitti": satelliteMap }).addTo(map);
let marker = L.circleMarker([64.0, 26.0], { color: '#2979ff', fillColor: '#2979ff', fillOpacity: 0.8, radius: 8 }).addTo(map);

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
    updateDashboardUI(0, 0, 0, 0, 0, 0);
    
    document.getElementById('btn-start-rec').style.display = 'none';
    document.getElementById('btn-stop-rec').style.display = 'inline-block';
    statusEl.innerText = "🔴 TALLENNETAAN";
    statusEl.style.color = "#ff4444";
    timerInterval = setInterval(updateTimer, 1000);
});

document.getElementById('btn-stop-rec').addEventListener('click', () => {
    if (isRecording) {
        const endTime = new Date();
        const durationMs = endTime - startTime;
        const durationHours = durationMs / (1000 * 60 * 60);
        let avgSpeed = durationHours > 0 ? (totalDistance / durationHours) : 0;

        saveToFirebase({
            type: 'end_drive',
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            distanceKm: totalDistance.toFixed(2),
            maxSpeed: maxSpeed.toFixed(1),
            avgSpeed: avgSpeed.toFixed(1),
            durationMs: durationMs,
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

function stopGPSAndRec() {
    stopRecording();
    isGPSActive = false;
    navigator.geolocation.clearWatch(watchId);
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

    let currentAvg = 0;

    if (isRecording) {
        if (speedKmh > maxSpeed) maxSpeed = speedKmh;
        if (lastLatLng) {
            const dist = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
            if ((speedKmh > 3 || dist > 0.02) && dist < 2.0) totalDistance += dist;
        }
        
        if (startTime) {
            const durationHrs = (new Date() - startTime) / (1000 * 60 * 60);
            if (durationHrs > 0) currentAvg = totalDistance / durationHrs;
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

    updateDashboardUI(speedKmh, maxSpeed, totalDistance, null, alt, currentAvg);
    dashCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    
    if (isGPSActive && wakeLock === null) requestWakeLock();
}

// --- HISTORIA ---
function loadHistory() {
    const logList = document.getElementById('log-list');
    if (!currentUser) { logList.innerHTML = "<p>Kirjaudu sisään.</p>"; return; }
    logList.innerHTML = "<div class='loading'>Haetaan tietoja...</div>";
    
    db.ref('ajopaivakirja/' + currentUser.uid).off();
    const historyRef = db.ref('ajopaivakirja/' + currentUser.uid).orderByChild('startTime').limitToLast(50);

    historyRef.on('value', (snapshot) => {
        logList.innerHTML = "";
        if (!snapshot.exists()) { logList.innerHTML = "<p style='text-align:center;'>Ei ajoja.</p>"; return; }

        const logs = [];
        snapshot.forEach(child => logs.push({ key: child.key, ...child.val() }));
        logs.reverse();

        logs.forEach(drive => {
            const start = new Date(drive.startTime);
            const dateStr = start.toLocaleDateString('fi-FI') + ' ' + start.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
            let durationMinutes = 0;
            if (drive.durationMs) durationMinutes = Math.floor(drive.durationMs / 60000);
            else if (drive.endTime) durationMinutes = Math.floor((new Date(drive.endTime) - start) / 60000);
            
            const avgSpeedDisplay = drive.avgSpeed ? drive.avgSpeed : "-";

            const card = document.createElement('div');
            card.className = 'log-card';
            card.innerHTML = `
                <div class="log-header">
                    <div class="log-date">${dateStr}</div>
                    <button class="delete-btn" onclick="deleteDrive('${drive.key}')">🗑</button>
                </div>
                <div class="log-stats">
                    <div><span class="stat-label">KM</span>${drive.distanceKm}</div>
                    <div><span class="stat-label">AIKA</span>${durationMinutes} min</div>
                    <div><span class="stat-label">MAX</span>${drive.maxSpeed}</div>
                    <div><span class="stat-label">Ø KM/H</span>${avgSpeedDisplay}</div>
                </div>
                <input type="text" class="subject-input" placeholder="Aihe..." value="${drive.subject || ''}" onchange="updateSubject('${drive.key}', this.value)">
            `;
            logList.appendChild(card);
        });
    }, (error) => {
        logList.innerHTML = `<p style="color:red; text-align:center;">Latausvirhe: ${error.message}</p>`;
    });
}

window.updateSubject = (key, text) => { if(currentUser) db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update({ subject: text }); };
window.deleteDrive = (key) => { if(confirm("Poista?")) db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).remove(); };

// --- APUFUNKTIOT ---
document.getElementById('btn-theme').addEventListener('click', () => document.body.classList.toggle('light-theme'));

function updateClockAndDate() {
    const now = new Date();
    dashClockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    dashDateEl.innerText = now.toLocaleDateString('fi-FI', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
}
setInterval(updateClockAndDate, 1000);
updateClockAndDate(); 

function updateTimer() {
    if (!startTime) return;
    const diff = new Date() - startTime;
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const hrs = Math.floor(diff / 3600000);
    dashTimeEl.innerText = (hrs>0?hrs+":":"") + (mins<10?"0":"")+mins + ":" + (secs<10?"0":"")+secs;
}

function updateDashboardUI(spd, max, dist, time, alt, avg) {
    dashSpeedEl.innerText = spd.toFixed(1); 
    dashMaxSpeedEl.innerText = max.toFixed(1);
    dashDistEl.innerText = dist.toFixed(2); 
    dashAltEl.innerText = Math.round(alt);
    if(avg !== undefined) dashAvgEl.innerText = avg.toFixed(1);
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
