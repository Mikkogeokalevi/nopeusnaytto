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

// --- DOM ELEMENTIT ---
const splashScreen = document.getElementById('splash-screen');
const loginView = document.getElementById('login-view');
const appContainer = document.getElementById('app-container');

// Menu
const menuBtn = document.getElementById('btn-menu-toggle');
const mainMenu = document.getElementById('main-menu');
const menuUserName = document.getElementById('user-name');
const menuUserAvatar = document.getElementById('user-photo');

// Näkymät
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

// Modalit
const saveModal = document.getElementById('save-modal');
const modalDistEl = document.getElementById('modal-dist');
const modalTimeEl = document.getElementById('modal-time');
const modalSubjectEl = document.getElementById('modal-subject');
const btnModalSave = document.getElementById('btn-modal-save');
const btnModalCancel = document.getElementById('btn-modal-cancel');

const deleteModal = document.getElementById('delete-modal');
const btnDeleteConfirm = document.getElementById('btn-delete-confirm');
const btnDeleteCancel = document.getElementById('btn-delete-cancel');

// --- MUUTTUJAT ---
let currentUser = null; 
let watchId = null;
let isGPSActive = false;
let isRecording = false; 
let isPaused = false; 

let wakeLock = null;
let startTime = null;
let pauseStartTime = null; 
let totalPauseTime = 0;    

let timerInterval = null;
let tempDriveData = null; 
let deleteKey = null;

let maxSpeed = 0;
let totalDistance = 0;
let lastLatLng = null;

let allHistoryData = []; // Kaikki ajot muistissa

// UI Elementit
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

// Yhteenveto elementit
const historySummaryEl = document.getElementById('history-summary');
const sumKmEl = document.getElementById('sum-km');
const sumCountEl = document.getElementById('sum-count');
const sumTimeEl = document.getElementById('sum-time');

// Kontrollit
const btnStartRec = document.getElementById('btn-start-rec');
const activeRecBtns = document.getElementById('active-rec-btns');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnStopRec = document.getElementById('btn-stop-rec');


// --- AUTH ---
auth.onAuthStateChanged((user) => {
    if (splashScreen) setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);

    if (user) {
        currentUser = user;
        loginView.style.display = 'none';
        appContainer.style.display = 'flex';
        
        menuUserName.innerText = user.displayName || user.email;
        if (user.photoURL) {
            menuUserAvatar.src = user.photoURL;
        }

        if (views.map.style.display !== 'none') setTimeout(() => map.invalidateSize(), 200);
    } else {
        currentUser = null;
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

document.getElementById('btn-login-help').addEventListener('click', () => {
    loginView.style.display = 'none';
    appContainer.style.display = 'flex';
    switchView('help');
    document.querySelector('.controls-container').style.display = 'none';
    
    const backBtn = document.createElement('button');
    backBtn.innerText = "← Takaisin kirjautumiseen";
    backBtn.className = 'action-btn blue-btn';
    backBtn.style.marginTop = "20px";
    backBtn.onclick = () => location.reload();
    
    const helpView = document.getElementById('help-view');
    if (!helpView.querySelector('button')) {
        helpView.prepend(backBtn);
    }
});


// --- MENU ---
menuBtn.addEventListener('click', () => {
    if (mainMenu.style.display === 'none') {
        mainMenu.style.display = 'flex';
    } else {
        mainMenu.style.display = 'none';
    }
});

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

document.getElementById('side-tap-left').addEventListener('click', () => switchView('map'));
document.getElementById('map-return-btn').addEventListener('click', () => switchView('dashboard'));


// --- KARTTA ---
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OSM' });
const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });

const map = L.map('map', { center: [64.0, 26.0], zoom: 16, layers: [streetMap], zoomControl: false });
L.control.layers({ "Kartta": streetMap, "Satelliitti": satelliteMap }).addTo(map);
let marker = L.circleMarker([64.0, 26.0], { color: '#2979ff', fillColor: '#2979ff', fillOpacity: 0.8, radius: 8 }).addTo(map);


// --- GPS ---
document.getElementById('btn-activate-gps').addEventListener('click', () => {
    if (!isGPSActive) {
        startGPS();
        document.getElementById('btn-activate-gps').style.display = 'none';
        document.getElementById('rec-controls').style.display = 'flex';
        statusEl.innerText = "GPS Päällä";
    }
});

btnStartRec.addEventListener('click', () => {
    isRecording = true;
    isPaused = false;
    startTime = new Date();
    totalPauseTime = 0;
    maxSpeed = 0;
    totalDistance = 0;
    updateDashboardUI(0, 0, 0, 0, 0, 0);
    
    btnStartRec.style.display = 'none';
    activeRecBtns.style.display = 'flex';
    btnPause.style.display = 'inline-block';
    btnResume.style.display = 'none';
    
    statusEl.innerText = "🔴 TALLENNETAAN";
    statusEl.style.color = "#ff4444";
    timerInterval = setInterval(updateTimer, 1000);
});

btnPause.addEventListener('click', () => {
    isPaused = true;
    pauseStartTime = new Date();
    clearInterval(timerInterval);
    btnPause.style.display = 'none';
    btnResume.style.display = 'inline-block';
    statusEl.innerText = "⏸ TAUKO";
    statusEl.style.color = "#fbc02d";
});

btnResume.addEventListener('click', () => {
    isPaused = false;
    const now = new Date();
    totalPauseTime += (now - pauseStartTime);
    btnResume.style.display = 'none';
    btnPause.style.display = 'inline-block';
    statusEl.innerText = "🔴 TALLENNETAAN";
    statusEl.style.color = "#ff4444";
    timerInterval = setInterval(updateTimer, 1000);
});

btnStopRec.addEventListener('click', () => {
    if (!isRecording) return;
    clearInterval(timerInterval);
    
    if (isPaused && pauseStartTime) {
        totalPauseTime += (new Date() - pauseStartTime);
    }

    const endTime = new Date();
    const activeDurationMs = (endTime - startTime) - totalPauseTime;
    const durationHours = activeDurationMs / (1000 * 60 * 60);
    let avgSpeed = durationHours > 0 ? (totalDistance / durationHours) : 0;

    tempDriveData = {
        type: 'end_drive',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        distanceKm: totalDistance.toFixed(2),
        maxSpeed: maxSpeed.toFixed(1),
        avgSpeed: avgSpeed.toFixed(1),
        durationMs: activeDurationMs,
        subject: "" 
    };

    const mins = Math.floor(activeDurationMs / 60000);
    modalDistEl.innerText = totalDistance.toFixed(2) + " km";
    modalTimeEl.innerText = mins + " min";
    modalSubjectEl.value = ""; 

    saveModal.style.display = 'flex';
    modalSubjectEl.focus();
});

btnModalSave.addEventListener('click', () => {
    if (tempDriveData) {
        tempDriveData.subject = modalSubjectEl.value;
        saveToFirebase(tempDriveData);
    }
    saveModal.style.display = 'none';
    resetRecordingUI();
});

btnModalCancel.addEventListener('click', () => {
    if(confirm("Haluatko varmasti hylätä tämän ajon?")) {
        saveModal.style.display = 'none';
        resetRecordingUI();
    }
});

// Poisto Modal
function openDeleteModal(key) {
    deleteKey = key;
    deleteModal.style.display = 'flex';
}

btnDeleteConfirm.addEventListener('click', () => {
    if (deleteKey && currentUser) {
        db.ref('ajopaivakirja/' + currentUser.uid + '/' + deleteKey).remove();
        deleteModal.style.display = 'none';
        deleteKey = null;
    }
});

btnDeleteCancel.addEventListener('click', () => {
    deleteModal.style.display = 'none';
    deleteKey = null;
});

function resetRecordingUI() {
    isRecording = false;
    isPaused = false;
    tempDriveData = null;
    
    btnStartRec.style.display = 'inline-block';
    activeRecBtns.style.display = 'none';
    statusEl.innerText = "GPS Päällä";
    statusEl.style.color = "var(--subtext-color)";
    updateDashboardUI(0, 0, 0, 0, 0, 0);
    dashTimeEl.innerText = "00:00";
}

function stopGPSAndRec() {
    isRecording = false;
    isPaused = false;
    clearInterval(timerInterval);
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

    if (isRecording && !isPaused) {
        if (speedKmh > maxSpeed) maxSpeed = speedKmh;
        if (lastLatLng) {
            const dist = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
            if ((speedKmh > 3 || dist > 0.02) && dist < 2.0) totalDistance += dist;
        }
        
        if (startTime) {
            const now = new Date();
            const activeTimeMs = (now - startTime) - totalPauseTime;
            const durationHrs = activeTimeMs / (1000 * 60 * 60);
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

// --- HISTORIA (SUODATUS, YHTEENVETO, POISTO) ---
const filterEl = document.getElementById('history-filter');

filterEl.addEventListener('change', () => {
    renderHistoryList();
});

function loadHistory() {
    const logList = document.getElementById('log-list');
    
    if (!currentUser) {
        logList.innerHTML = "<p>Kirjaudu sisään.</p>";
        return;
    }
    
    logList.innerHTML = "<div class='loading'>Haetaan tietoja...</div>";
    
    db.ref('ajopaivakirja/' + currentUser.uid).off();
    const historyRef = db.ref('ajopaivakirja/' + currentUser.uid).limitToLast(200);

    historyRef.on('value', (snapshot) => {
        allHistoryData = [];
        
        if (!snapshot.exists()) {
            renderHistoryList();
            return;
        }

        snapshot.forEach(child => {
            const data = child.val();
            if (data && typeof data === 'object') {
                allHistoryData.push({ key: child.key, ...data });
            }
        });

        // Uusin ensin
        allHistoryData.sort((a, b) => {
            const dateA = new Date(a.startTime || 0);
            const dateB = new Date(b.startTime || 0);
            return dateB - dateA; 
        });

        populateFilter();
        renderHistoryList();

    }, (error) => {
        console.error("Latausvirhe:", error);
        logList.innerHTML = `<p style="color:red; text-align:center;">Latausvirhe.</p>`;
    });
}

function populateFilter() {
    // Säilytetään nykyinen valinta jos mahdollista
    const currentVal = filterEl.value;
    filterEl.innerHTML = '<option value="all">Kaikki ajot</option>';
    
    const periods = new Set();
    
    allHistoryData.forEach(drive => {
        if (drive.startTime) {
            const d = new Date(drive.startTime);
            if (!isNaN(d.getTime())) {
                // 1. Lisätään Vuosi (esim "2025")
                const yearKey = "YEAR-" + d.getFullYear();
                const yearLabel = "Vuosi " + d.getFullYear();
                periods.add(JSON.stringify({key: yearKey, label: yearLabel, sort: d.getFullYear() * 100}));

                // 2. Lisätään Kuukausi (esim "2025-12")
                const monthKey = d.getFullYear() + '-' + (d.getMonth() + 1);
                const monthLabel = d.toLocaleString('fi-FI', { month: 'long', year: 'numeric' });
                const finalMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
                // Sorttausavain: 202512
                periods.add(JSON.stringify({key: monthKey, label: finalMonthLabel, sort: d.getFullYear() * 100 + (d.getMonth() + 1)}));
            }
        }
    });

    // Muutetaan Set arrayksi ja järjestetään (Uusin ensin)
    const sortedPeriods = Array.from(periods).map(p => JSON.parse(p)).sort((a, b) => b.sort - a.sort);

    sortedPeriods.forEach(p => {
        const option = document.createElement('option');
        option.value = p.key;
        option.innerText = p.label;
        filterEl.appendChild(option);
    });

    // Palautetaan valinta jos se on yhä olemassa
    if (currentVal && Array.from(filterEl.options).some(o => o.value === currentVal)) {
        filterEl.value = currentVal;
    }
}

function renderHistoryList() {
    const logList = document.getElementById('log-list');
    logList.innerHTML = "";
    
    if (allHistoryData.length === 0) {
        logList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei tallennettuja ajoja.</p>";
        historySummaryEl.style.display = 'none';
        return;
    }

    const selectedFilter = filterEl.value; // "all", "2025-12" tai "YEAR-2025"
    let renderCount = 0;
    
    // Yhteenveto muuttujat
    let totalKm = 0;
    let totalMs = 0;

    allHistoryData.forEach(drive => {
        try {
            let start = null;
            let dateStr = "Aika puuttuu";
            
            if (drive.startTime) {
                start = new Date(drive.startTime);
                if (!isNaN(start.getTime())) {
                    dateStr = start.toLocaleDateString('fi-FI') + ' ' + start.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
                    
                    // SUODATUS LOGIIKKA
                    if (selectedFilter !== 'all') {
                        if (selectedFilter.startsWith("YEAR-")) {
                            // Vuosisuodatus
                            const year = selectedFilter.split("-")[1];
                            if (start.getFullYear().toString() !== year) return;
                        } else {
                            // Kuukausisuodatus
                            const monthKey = start.getFullYear() + '-' + (start.getMonth() + 1);
                            if (monthKey !== selectedFilter) return;
                        }
                    }
                }
            }

            // Laske kesto
            let durationMinutes = 0;
            let durationMs = 0;
            if (drive.durationMs) {
                durationMs = drive.durationMs;
                durationMinutes = Math.floor(drive.durationMs / 60000);
            } else if (drive.endTime && start) {
                const end = new Date(drive.endTime);
                if (!isNaN(end.getTime())) {
                    durationMs = (end - start);
                    durationMinutes = Math.floor(durationMs / 60000);
                }
            }
            
            // Laske yhteenvetoon
            const dist = parseFloat(drive.distanceKm) || 0;
            totalKm += dist;
            totalMs += durationMs;

            const avgSpeedDisplay = (drive.avgSpeed !== undefined) ? drive.avgSpeed : "-";
            const distanceDisplay = (drive.distanceKm !== undefined) ? drive.distanceKm : "0.00";
            const maxSpeedDisplay = (drive.maxSpeed !== undefined) ? drive.maxSpeed : "0";
            const subjectText = (drive.subject !== undefined) ? drive.subject : "";

            const card = document.createElement('div');
            card.className = 'log-card';
            card.innerHTML = `
                <div class="log-header">
                    <div class="log-date">${dateStr}</div>
                    <button class="delete-btn" onclick="openDeleteModal('${drive.key}')">🗑</button>
                </div>
                <div class="log-stats">
                    <div><span class="stat-label">KM</span>${distanceDisplay}</div>
                    <div><span class="stat-label">AIKA</span>${durationMinutes} min</div>
                    <div><span class="stat-label">MAX</span>${maxSpeedDisplay}</div>
                    <div><span class="stat-label">Ø KM/H</span>${avgSpeedDisplay}</div>
                </div>
                <input type="text" class="subject-input" placeholder="Kirjoita aihe..." value="${subjectText}" onchange="updateSubject('${drive.key}', this.value)">
            `;
            logList.appendChild(card);
            renderCount++;

        } catch (err) { console.error(err); }
    });

    if (renderCount === 0) {
        logList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei ajoja valittuna ajanjaksona.</p>";
        historySummaryEl.style.display = 'none';
    } else {
        // Päivitä yhteenveto ja näytä se
        sumKmEl.innerText = totalKm.toFixed(1);
        sumCountEl.innerText = renderCount;
        
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        sumTimeEl.innerText = `${h}h ${m}min`;
        
        historySummaryEl.style.display = 'flex';
    }
}

// Globaalit funktiot
window.updateSubject = (key, text) => { if(currentUser) db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update({ subject: text }); };
window.openDeleteModal = openDeleteModal; 

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
    const now = new Date();
    const diff = now - startTime - totalPauseTime;
    
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
    if (currentUser) {
        db.ref('ajopaivakirja/' + currentUser.uid).push().set(data)
            .then(() => { console.log("Tallennus onnistui"); })
            .catch((error) => { alert("VIRHE: " + error.message); });
    } else {
        alert("Virhe: Et ole kirjautunut sisään!");
    }
}
