// =========================================================
// 1. FIREBASE KONFIGURAATIO
// =========================================================
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
const auth = firebase.auth();

// =========================================================
// 2. DOM ELEMENTTIEN HAKU
// =========================================================
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
    stats: document.getElementById('stats-view'),
    settings: document.getElementById('settings-view'),
    help: document.getElementById('help-view')
};

const navBtns = {
    dashboard: document.getElementById('nav-dashboard'),
    map: document.getElementById('nav-map'),
    history: document.getElementById('nav-history'),
    stats: document.getElementById('nav-stats'),
    settings: document.getElementById('nav-settings'),
    help: document.getElementById('nav-help')
};

// Modaalit (Tallennus, Editointi, Poisto, Tankkaus)
const saveModal = document.getElementById('save-modal');
const modalDistEl = document.getElementById('modal-dist');
const modalTimeEl = document.getElementById('modal-time');
const modalSubjectEl = document.getElementById('modal-subject');
const modalCarNameEl = document.getElementById('modal-car-name');
const btnModalSave = document.getElementById('btn-modal-save');
const btnModalCancel = document.getElementById('btn-modal-cancel');

const editModal = document.getElementById('edit-modal');
const editKeyEl = document.getElementById('edit-key');
const editSubjectEl = document.getElementById('edit-subject');
const editCarSelectEl = document.getElementById('edit-car-select');
const btnEditSave = document.getElementById('btn-edit-save');
const btnEditCancel = document.getElementById('btn-edit-cancel');

const deleteModal = document.getElementById('delete-modal');
const btnDeleteConfirm = document.getElementById('btn-delete-confirm');
const btnDeleteCancel = document.getElementById('btn-delete-cancel');

const refuelModal = document.getElementById('refuel-modal');
const btnRefuelSave = document.getElementById('btn-refuel-save');
const btnRefuelCancel = document.getElementById('btn-refuel-cancel');
const btnRefuelDelete = document.getElementById('btn-refuel-delete');

// UI Elementit (Dashboard)
const dashSpeedEl = document.getElementById('dash-speed');
const dashMaxSpeedEl = document.getElementById('dash-max-speed');
const dashDistEl = document.getElementById('dash-dist');
const dashTimeEl = document.getElementById('dash-time');
const dashAltEl = document.getElementById('dash-alt');
const dashAvgEl = document.getElementById('dash-avg'); 
const dashCoordsEl = document.getElementById('dash-coords');
const dashClockEl = document.getElementById('dash-clock');
const dashDateEl = document.getElementById('dash-date'); 
const dashHeadingEl = document.getElementById('dash-heading'); 
const dashWeatherEl = document.getElementById('dash-weather');
const liveStatusBar = document.getElementById('live-status-bar');
const liveStyleEl = document.getElementById('live-style-indicator');

// UI Elementit (Kartta & Historia)
const mapSpeedEl = document.getElementById('map-speed');
const mapCoordsEl = document.getElementById('map-coords');
const statusEl = document.getElementById('status');
const mapGpsToggle = document.getElementById('map-gps-toggle');
const mapLegend = document.getElementById('map-legend');

const historySummaryEl = document.getElementById('history-summary');
const sumKmEl = document.getElementById('sum-km');
const sumCountEl = document.getElementById('sum-count');
const sumTimeEl = document.getElementById('sum-time');
const filterEl = document.getElementById('history-filter');
const customFilterContainer = document.getElementById('custom-filter-container');
const filterStart = document.getElementById('filter-start');
const filterEnd = document.getElementById('filter-end');

// Kontrollit
const btnStartRec = document.getElementById('btn-start-rec');
const activeRecBtns = document.getElementById('active-rec-btns');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnStopRec = document.getElementById('btn-stop-rec');

// =========================================================
// 3. MUUTTUJAT
// =========================================================
let currentUser = null, watchId = null, wakeLock = null;
let isGPSActive = false, isRecording = false, isPaused = false, isViewingHistory = false;
let startTime = null, pauseStartTime = null, totalPauseTime = 0, timerInterval = null;
let tempDriveData = null, deleteKey = null, refuelKey = null;
let maxSpeed = 0, totalDistance = 0, lastLatLng = null;
let routePath = [], realTimePolyline = null, savedRouteLayers = [], savedRouteLayer = null;
let currentDriveWeather = "", aggressiveEvents = 0, lastMotionTime = 0, styleResetTimer = null;
let allHistoryData = [], allRefuelData = [], userCars = [];
let currentCarId = "all", currentCarType = "car";
const carSelectEl = document.getElementById('car-select');

// =========================================================
// 4. AUTHENTICATION (KIRJAUTUMINEN)
// =========================================================
auth.onAuthStateChanged((user) => {
    if (splashScreen) setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);
    if (user) {
        currentUser = user;
        loginView.style.display = 'none';
        appContainer.style.display = 'flex';
        menuUserName.innerText = user.displayName || user.email;
        if(user.photoURL) menuUserAvatar.src = user.photoURL;
        
        // Ladataan tiedot
        loadCars(); 
        loadHistory(); 
        generateCarIcons(); 
        
        if (views.map.style.display !== 'none') setTimeout(() => map.invalidateSize(), 200);
    } else {
        currentUser = null;
        appContainer.style.display = 'none';
        loginView.style.display = 'flex';
    }
});

// Kirjautumisnapit
document.getElementById('btn-login').addEventListener('click', () => auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => alert(e.message)));
document.getElementById('btn-email-login').addEventListener('click', () => {
    const e = document.getElementById('email-input').value, p = document.getElementById('password-input').value;
    if(!e || !p) return alert("Syötä tiedot.");
    auth.signInWithEmailAndPassword(e, p).catch(er => alert(er.message));
});
document.getElementById('btn-logout').addEventListener('click', () => { if(confirm("Kirjaudu ulos?")) auth.signOut().then(() => location.reload()); });

// =========================================================
// 5. NAVIGAATIO LOGIIKKA
// =========================================================
menuBtn.addEventListener('click', () => mainMenu.style.display = (mainMenu.style.display === 'none') ? 'flex' : 'none');
document.getElementById('app-logo').addEventListener('click', () => switchView('dashboard'));

// TANKKAUSNAPPI (DASHBOARD) - KORJATTU
const quickRefuelBtn = document.getElementById('btn-quick-refuel');
if (quickRefuelBtn) {
    quickRefuelBtn.addEventListener('click', () => {
        if(currentCarId === 'all') {
            alert("Valitse ensin auto yläpalkista!");
        } else {
            // Varmistetaan että funktio on olemassa ennen kutsua
            if (typeof window.openRefuelModal === 'function') {
                window.openRefuelModal(currentCarId);
            } else {
                console.error("Funktiota openRefuelModal ei löydy!");
            }
        }
    });
}

function switchView(viewName) {
    mainMenu.style.display = 'none';
    Object.values(views).forEach(el => el.style.display = 'none');
    Object.values(navBtns).forEach(btn => { if(btn) btn.classList.remove('active-menu'); });

    if (viewName === 'dashboard' || viewName === 'map') views[viewName].style.display = 'flex';
    else views[viewName].style.display = 'block';
    
    if(navBtns[viewName]) navBtns[viewName].classList.add('active-menu');

    if (viewName !== 'map') { clearSavedRoute(); isViewingHistory = false; mapLegend.style.display = 'none'; }
    if (viewName === 'map') setTimeout(() => map.invalidateSize(), 100);
    
    // Jos avataan historia, varmista että jompikumpi välilehti on auki
    if (viewName === 'history') {
        if (typeof window.switchHistoryTab === 'function') {
            window.switchHistoryTab('drives');
        }
    }
    if (viewName === 'settings') renderCarList();
    if (viewName === 'stats') renderStats();
}

Object.keys(navBtns).forEach(k => navBtns[k].addEventListener('click', () => switchView(k)));
document.getElementById('side-tap-left').addEventListener('click', () => switchView('map'));
document.getElementById('map-return-btn').addEventListener('click', () => switchView('dashboard'));
// =========================================================
// 6. KARTTA
// =========================================================
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {});
const terrainMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 });
const map = L.map('map', { center: [64.0, 26.0], zoom: 16, layers: [streetMap], zoomControl: false });
L.control.layers({ "Peruskartta": streetMap, "Satelliitti": satelliteMap, "Maastokartta": terrainMap }).addTo(map);
let marker = L.circleMarker([64.0, 26.0], { color: '#2979ff', fillColor: '#2979ff', fillOpacity: 0.8, radius: 8 }).addTo(map);
realTimePolyline = L.polyline([], {color: '#2979ff', weight: 5, opacity: 0.7}).addTo(map);

mapGpsToggle.addEventListener('click', () => {
    isViewingHistory = !isViewingHistory;
    mapGpsToggle.innerText = isViewingHistory ? "📡 OFF" : "📡 ON";
    if(isViewingHistory) mapGpsToggle.classList.add('inactive');
    else { mapGpsToggle.classList.remove('inactive'); if(lastLatLng) map.panTo([lastLatLng.lat, lastLatLng.lng]); }
});

// =========================================================
// 7. GPS & SEURANTA
// =========================================================
document.getElementById('btn-activate-gps').addEventListener('click', () => {
    if (!isGPSActive) { startGPS(); document.getElementById('btn-activate-gps').style.display = 'none'; document.getElementById('rec-controls').style.display = 'flex'; statusEl.innerText = "GPS Päällä"; }
});
btnStartRec.addEventListener('click', () => {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(r => { if (r === 'granted') window.addEventListener('devicemotion', handleMotion); });
    } else window.addEventListener('devicemotion', handleMotion);
    isRecording = true; isPaused = false; isViewingHistory = false; 
    mapGpsToggle.innerText = "📡 ON"; mapGpsToggle.classList.remove('inactive');
    startTime = new Date(); totalPauseTime = 0; maxSpeed = 0; totalDistance = 0;
    routePath = []; realTimePolyline.setLatLngs([]); clearSavedRoute();
    currentDriveWeather = ""; aggressiveEvents = 0; updateDashboardUI(0, 0, 0, 0, 0, 0);
    if (currentCarType === 'bike') liveStatusBar.style.opacity = '0';
    else { liveStatusBar.style.opacity = '1'; liveStyleEl.innerText = "Taloudellinen"; liveStyleEl.className = "style-badge style-green"; }
    btnStartRec.style.display = 'none'; activeRecBtns.style.display = 'flex'; btnPause.style.display = 'inline-block'; btnResume.style.display = 'none';
    statusEl.innerText = "🔴 TALLENNETAAN"; statusEl.style.color = "#ff4444";
    timerInterval = setInterval(updateTimer, 1000);
});
btnPause.addEventListener('click', () => {
    isPaused = true; pauseStartTime = new Date(); clearInterval(timerInterval);
    btnPause.style.display = 'none'; btnResume.style.display = 'inline-block'; statusEl.innerText = "⏸ TAUKO"; statusEl.style.color = "#fbc02d";
});
btnResume.addEventListener('click', () => {
    isPaused = false; totalPauseTime += (new Date() - pauseStartTime);
    btnResume.style.display = 'none'; btnPause.style.display = 'inline-block'; statusEl.innerText = "🔴 TALLENNETAAN"; statusEl.style.color = "#ff4444";
    timerInterval = setInterval(updateTimer, 1000);
});
btnStopRec.addEventListener('click', () => {
    if (!isRecording) return;
    clearInterval(timerInterval); window.removeEventListener('devicemotion', handleMotion);
    if (isPaused) totalPauseTime += (new Date() - pauseStartTime);
    const endTime = new Date();
    const activeDurationMs = (endTime - startTime) - totalPauseTime;
    let avgSpeed = activeDurationMs > 0 ? (totalDistance / (activeDurationMs / 3600000)) : 0;
    let styleLabel = ""; if (currentCarType !== 'bike') { styleLabel = "Tasainen"; if (aggressiveEvents > 5) styleLabel = "Reipas"; if (aggressiveEvents > 15) styleLabel = "Aggressiivinen"; }
    let cName = "Muu", cIcon = "🚗";
    if (currentCarId !== 'all') { const c = userCars.find(x => x.id === currentCarId); if (c) { cName = c.name; cIcon = c.icon || (c.type === 'bike' ? "🚲" : "🚗"); } }
    tempDriveData = {
        type: 'end_drive', startTime: startTime.toISOString(), endTime: endTime.toISOString(),
        distanceKm: totalDistance.toFixed(2), maxSpeed: maxSpeed.toFixed(1), avgSpeed: avgSpeed.toFixed(1),
        durationMs: activeDurationMs, subject: "", weather: currentDriveWeather, drivingStyle: styleLabel,
        carName: cName, carIcon: cIcon, carId: currentCarId, carType: currentCarType, route: routePath
    };
    modalDistEl.innerText = totalDistance.toFixed(2) + " km"; modalTimeEl.innerText = Math.floor(activeDurationMs / 60000) + " min";
    modalSubjectEl.value = ""; modalCarNameEl.innerText = cName;
    saveModal.style.display = 'flex'; liveStatusBar.style.opacity = '0';
});
btnModalSave.addEventListener('click', () => { if (tempDriveData) { tempDriveData.subject = modalSubjectEl.value; saveToFirebase(tempDriveData); } saveModal.style.display = 'none'; resetRecordingUI(); });
btnModalCancel.addEventListener('click', () => { if (confirm("Hylätäänkö ajo?")) { saveModal.style.display = 'none'; resetRecordingUI(); } });
function openDeleteModal(key) { deleteKey = key; deleteModal.style.display = 'flex'; }
btnDeleteConfirm.addEventListener('click', () => { if (deleteKey && currentUser) { db.ref('ajopaivakirja/' + currentUser.uid + '/' + deleteKey).remove(); deleteModal.style.display = 'none'; deleteKey = null; } });
btnDeleteCancel.addEventListener('click', () => { deleteModal.style.display = 'none'; deleteKey = null; });
function resetRecordingUI() {
    isRecording = false; isPaused = false; tempDriveData = null; routePath = []; realTimePolyline.setLatLngs([]);
    btnStartRec.style.display = 'inline-block'; activeRecBtns.style.display = 'none';
    statusEl.innerText = "GPS Päällä"; statusEl.style.color = "var(--subtext-color)";
    updateDashboardUI(0, 0, 0, 0, 0, 0); dashTimeEl.innerText = "00:00"; liveStatusBar.style.opacity = '0';
}
function startGPS() { isGPSActive = true; requestWakeLock(); if (navigator.geolocation) watchId = navigator.geolocation.watchPosition(updatePosition, handleError, { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }); }
document.addEventListener('visibilitychange', async () => { if (document.visibilityState === 'visible' && isGPSActive) requestWakeLock(); });
function updatePosition(pos) {
    const lat = pos.coords.latitude, lng = pos.coords.longitude, spd = (pos.coords.speed || 0) * 3.6;
    let k = spd < 1 ? 0 : spd, avg = 0;
    if (currentDriveWeather === "") fetchWeather(lat, lng);
    if (isRecording && !isPaused) {
        if (k > maxSpeed) maxSpeed = k;
        if (lastLatLng) {
            const d = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
            if ((k > 3 || d > 0.02) && d < 50) totalDistance += d;
        }
        if (k > 3 || (lastLatLng && getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng) > 0.02)) {
            routePath.push({ lat: lat, lng: lng, spd: k }); realTimePolyline.addLatLng([lat, lng]);
        }
        if (startTime) { const dur = (new Date() - startTime) - totalPauseTime; if (dur > 0) avg = totalDistance / (dur / 3600000); }
    }
    if (!lastLatLng || k > 0 || isGPSActive) {
        lastLatLng = { lat, lng }; const nl = new L.LatLng(lat, lng); marker.setLatLng(nl);
        if (views.map.style.display !== 'none' && !isViewingHistory) {
            let z = 18; if (currentCarType !== 'bike') { if (k > 100) z = 14; else if (k > 70) z = 16; else z = 18; }
            if (map.getZoom() !== z) map.setView(nl, z); else map.panTo(nl);
        }
        mapSpeedEl.innerText = k.toFixed(1); mapCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    }
    updateDashboardUI(k, maxSpeed, totalDistance, null, pos.coords.altitude || 0, avg);
    if (pos.coords.heading) dashHeadingEl.innerText = getCardinalDirection(pos.coords.heading);
    if (isGPSActive && !wakeLock) requestWakeLock();
}
function getCardinalDirection(angle) { const d = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']; return d[Math.round(angle / 45) % 8]; }
function fetchWeather(lat, lon) {
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code`)
        .then(res => res.json()).then(d => {
            if (d.current) {
                let e = "☁️", c = d.current.weather_code;
                if (c === 0) e = "☀️"; else if (c <= 3) e = "⛅"; else if (c <= 67) e = "🌧"; else if (c <= 86) e = "❄️";
                currentDriveWeather = `${e} ${Math.round(d.current.temperature_2m)}°C`; dashWeatherEl.innerText = currentDriveWeather;
            }
        }).catch(console.error);
}
function handleMotion(e) {
    if (!isRecording || isPaused || currentCarType === 'bike') return;
    const now = Date.now(); if (now - lastMotionTime < 500) return; lastMotionTime = now;
    const acc = e.acceleration; if (!acc) return;
    if (Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2) > 3.5) {
        liveStyleEl.innerText = "Kiihdytys!"; liveStyleEl.className = "style-badge style-red"; dashSpeedEl.style.color = "#ff1744";
        if (styleResetTimer) clearTimeout(styleResetTimer);
        styleResetTimer = setTimeout(() => { liveStyleEl.innerText = "Taloudellinen"; liveStyleEl.className = "style-badge style-green"; dashSpeedEl.style.color = "var(--speed-color)"; }, 3000);
    }
}

// =========================================================
// 8. AUTOTALLI LOGIIKKA
// =========================================================
function loadCars() {
    if(!currentUser) return;
    db.ref('users/'+currentUser.uid+'/cars').on('value', snap => {
        userCars = []; if (snap.exists()) snap.forEach(c => userCars.push({id:c.key, ...c.val()}));
        updateCarSelect();
        if (views.settings.style.display !== 'none') renderCarList();
        if (views.history.style.display !== 'none') {
            // Päivitetään aktiivinen lista
            const isRefuelTab = document.getElementById('history-refuels-section').style.display !== 'none';
            if (isRefuelTab) renderRefuelList(); else renderHistoryList();
        }
    });
    const stored = localStorage.getItem('selectedCarId'); if (stored) { currentCarId = stored; updateCarTypeVariable(); }
}
function updateCarTypeVariable() { const c = userCars.find(x => x.id === currentCarId); currentCarType = (c && c.type) ? c.type : "car"; }
function updateCarSelect() {
    carSelectEl.innerHTML = ""; carSelectEl.appendChild(new Option("Kaikki ajoneuvot", "all"));
    userCars.forEach(c => { const o = new Option(`${c.icon || "🚗"} ${c.name}`, c.id); if (c.id === currentCarId) o.selected = true; carSelectEl.appendChild(o); });
}
carSelectEl.addEventListener('change', () => {
    currentCarId = carSelectEl.value; localStorage.setItem('selectedCarId', currentCarId); updateCarTypeVariable();
    // PÄIVITETÄÄN OIKEA LISTA
    if (views.history.style.display !== 'none') {
        const isRefuelTab = document.getElementById('history-refuels-section').style.display !== 'none';
        if (isRefuelTab) renderRefuelList(); else renderHistoryList();
    }
});
function renderCarList() {
    const list = document.getElementById('cars-list'); list.innerHTML = "";
    if (userCars.length === 0) { list.innerHTML = "<p>Ei ajoneuvoja.</p>"; return; }
    userCars.forEach(c => {
        const d = document.createElement('div'); d.className = 'car-item';
        d.innerHTML = `<div><div class="car-title">${c.icon || "🚗"} ${c.name}</div><div class="car-details">${c.plate||''}</div></div><div class="car-actions"><button class="refuel-btn" onclick="window.openRefuelModal('${c.id}')">⛽</button><button class="edit-btn" onclick="window.editCar('${c.id}')">✏️</button><button class="delete-btn" onclick="window.deleteCar('${c.id}')">🗑</button></div>`;
        list.appendChild(d);
    });
}
window.openRefuelModal = (carId) => {
    // Varmistetaan että carId on validi
    const car = userCars.find(c => c.id === carId); 
    if (!car) { alert("Autoa ei löydy. Lataa sivu uudelleen."); return; }
    
    refuelKey = null; 
    
    // Turvalliset elementtihaut
    const idEl = document.getElementById('refuel-car-id');
    const nameEl = document.getElementById('refuel-car-name');
    const kmEl = document.getElementById('refuel-km');
    const delBtn = document.getElementById('btn-refuel-delete');
    
    if(idEl) idEl.value = carId;
    if(nameEl) nameEl.innerText = `${car.icon||"🚗"} ${car.name}`;
    if(kmEl) kmEl.value = "";
    document.getElementById('refuel-liters').value = "";
    document.getElementById('refuel-price').value = "";
    if(delBtn) delBtn.style.display = 'none';
    
    // Hae edelliset km
    const carRefuels = allRefuelData.filter(r => r.carId === carId);
    carRefuels.sort((a,b) => b.km - a.km);
    const prevEl = document.getElementById('prev-km');
    if(prevEl) prevEl.innerText = carRefuels.length > 0 ? carRefuels[0].km : 0;
    
    refuelModal.style.display = 'flex';
};
// =========================================================
// 9. HISTORIA & TANKKAUS LISTAT
// =========================================================
function loadHistory() {
    if (!currentUser) return;
    
    // Ajot
    db.ref('ajopaivakirja/' + currentUser.uid).on('value', s => {
        allHistoryData = []; if (s.exists()) s.forEach(c => allHistoryData.push({ key: c.key, ...c.val() }));
        allHistoryData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        populateFilter();
        if (views.history.style.display !== 'none' && document.getElementById('history-drives-section').style.display !== 'none') renderHistoryList();
        if (views.stats.style.display !== 'none') renderStats();
    });

    // Tankkaukset
    db.ref('refuelings/' + currentUser.uid).on('value', s => {
        allRefuelData = []; if (s.exists()) s.forEach(c => allRefuelData.push({ key: c.key, ...c.val() }));
        if (views.history.style.display !== 'none' && document.getElementById('history-refuels-section').style.display !== 'none') renderRefuelList();
        if (views.stats.style.display !== 'none') renderStats();
    });
}

function populateFilter() {
    filterEl.innerHTML = `<option value="all">Kaikki ajot</option><option value="custom">Mukautettu...</option>`;
    const s = new Set();
    allHistoryData.forEach(d => { if (d.startTime) { const x = new Date(d.startTime); s.add(JSON.stringify({ k: `YEAR-${x.getFullYear()}`, l: `Vuosi ${x.getFullYear()}`, s: x.getFullYear()*100 })); }});
    Array.from(s).map(JSON.parse).sort((a, b) => b.s - a.s).forEach(p => filterEl.appendChild(new Option(p.l, p.k)));
}
filterEl.addEventListener('change', () => { customFilterContainer.style.display = (filterEl.value === 'custom') ? 'block' : 'none'; renderHistoryList(); });
filterStart.addEventListener('change', renderHistoryList); filterEnd.addEventListener('change', renderHistoryList);

function renderHistoryList() {
    const list = document.getElementById('log-list'); list.innerHTML = "";
    if (allHistoryData.length === 0) { list.innerHTML = "<p style='text-align:center;color:#888;'>Ei ajoja.</p>"; historySummaryEl.style.display = 'none'; return; }
    let count = 0, km = 0, ms = 0; const filter = filterEl.value;
    allHistoryData.forEach(d => {
        if (currentCarId !== 'all' && d.carId !== currentCarId) return;
        const start = new Date(d.startTime);
        if (filter !== 'all') {
            if (filter === 'custom') { if (filterStart.value && filterEnd.value && (start < new Date(filterStart.value) || start > new Date(filterEnd.value))) return; }
            else if (filter.startsWith("YEAR") && start.getFullYear().toString() !== filter.split("-")[1]) return;
        }
        km += parseFloat(d.distanceKm) || 0; ms += d.durationMs || 0; count++;
        let cObj = userCars.find(c => c.id === d.carId), icon = cObj ? (cObj.icon || "🚗") : (d.carIcon || "🚗"), name = cObj ? cObj.name : (d.carName || "Muu");
        const div = document.createElement('div'); div.className = 'log-card';
        div.innerHTML = `<div class="log-header"><div class="log-title-group"><div class="log-date-line">${start.toLocaleDateString()}</div><div class="log-car-big">${icon} ${name}</div></div><div style="display:flex;">${(d.route && d.route.length) ? `<button class="map-btn" onclick="window.showRouteOnMap('${d.key}')">🗺️</button>` : ''}<button class="edit-btn" onclick="window.openEditLogModal('${d.key}')">✏️</button><button class="delete-btn" onclick="window.openDeleteLogModal('${d.key}')">🗑</button></div></div>
        <div class="log-stats"><div><span class="stat-label">KM</span>${d.distanceKm}</div><div><span class="stat-label">AIKA</span>${Math.floor((d.durationMs||0)/60000)} min</div></div>`;
        list.appendChild(div);
    });
    if (count === 0) { list.innerHTML = "<p style='text-align:center;color:#888;'>Ei tuloksia.</p>"; historySummaryEl.style.display = 'none'; }
    else { sumKmEl.innerText = km.toFixed(1); sumCountEl.innerText = count; sumTimeEl.innerText = `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}min`; historySummaryEl.style.display = 'flex'; }
}

// VÄLILEHTIEN VAIHTO
window.switchHistoryTab = (tab) => {
    document.querySelectorAll('.history-tab').forEach(t => t.classList.remove('active'));
    if (tab === 'drives') {
        document.querySelector('.history-tab:first-child').classList.add('active');
        document.getElementById('history-drives-section').style.display = 'block';
        document.getElementById('history-refuels-section').style.display = 'none';
        renderHistoryList();
    } else {
        document.querySelector('.history-tab:last-child').classList.add('active');
        document.getElementById('history-drives-section').style.display = 'none';
        document.getElementById('history-refuels-section').style.display = 'block';
        renderRefuelList();
    }
};

function renderRefuelList() {
    const list = document.getElementById('refuel-list'); list.innerHTML = "";
    if (allRefuelData.length === 0) { list.innerHTML = "<p style='text-align:center;color:#888;'>Ei tankkauksia.</p>"; return; }
    
    // Filtteröidään valitun auton mukaan
    const filtered = (currentCarId === 'all') ? allRefuelData : allRefuelData.filter(r => r.carId === currentCarId);
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    filtered.forEach(r => {
        const d = new Date(r.date);
        const car = userCars.find(c => c.id === r.carId);
        const icon = car ? (car.icon||"🚗") : "🚗";
        const div = document.createElement('div'); div.className = 'log-card';
        div.innerHTML = `
            <div class="log-header"><div class="log-title-group"><div class="log-date-line">${d.toLocaleDateString()}</div><div class="log-car-big">${icon} ${car?car.name:'?'}</div></div><button class="edit-btn" onclick="window.openRefuelEdit('${r.key}')">✏️</button></div>
            <div class="log-stats"><div><span class="stat-label">LITRAT</span>${r.liters}</div><div><span class="stat-label">HINTA</span>${r.totalPrice}€</div><div><span class="stat-label">€/L</span>${r.pricePerLiter}</div><div><span class="stat-label">KM</span>${r.km}</div></div>`;
        list.appendChild(div);
    });
}

// =========================================================
// 10. LISÄTOIMINNOT (MODAALIT & LASKURIT)
// =========================================================
window.openRefuelEdit = (key) => {
    const r = allRefuelData.find(x => x.key === key); if (!r) return;
    refuelKey = key; const c = userCars.find(x => x.id === r.carId);
    document.getElementById('refuel-car-id').value = r.carId; document.getElementById('refuel-car-name').innerText = `${c ? c.icon : "🚗"} ${c ? c.name : "?"} (Muokkaus)`;
    document.getElementById('refuel-km').value = r.km; document.getElementById('refuel-liters').value = r.liters; document.getElementById('refuel-price').value = r.totalPrice;
    document.getElementById('btn-refuel-delete').style.display = 'block';
    window.calculateRefuelStats(); refuelModal.style.display = 'flex';
};
window.calculateRefuelStats = () => {
    const l = parseFloat(document.getElementById('refuel-liters').value), p = parseFloat(document.getElementById('refuel-price').value), k = parseFloat(document.getElementById('refuel-km').value);
    const prevEl = document.getElementById('prev-km'); const prev = prevEl ? parseFloat(prevEl.innerText) : 0;
    const pplEl = document.getElementById('refuel-ppl'); if(pplEl) pplEl.innerText = (l > 0 && p > 0) ? (p / l).toFixed(3) : "0.000";
    const tripEl = document.getElementById('refuel-trip'), consEl = document.getElementById('refuel-cons');
    if (k > prev && prev > 0 && l > 0) {
        const dist = k - prev; if(tripEl) tripEl.innerText = dist.toFixed(0); if(consEl) consEl.innerText = ((l * 100) / dist).toFixed(1);
    } else { if(tripEl) tripEl.innerText = "-"; if(consEl) consEl.innerText = "-"; }
};
btnRefuelCancel.addEventListener('click', () => refuelModal.style.display = 'none');
btnRefuelDelete.addEventListener('click', () => { if (confirm("Poista?")) db.ref('refuelings/' + currentUser.uid + '/' + refuelKey).remove().then(() => refuelModal.style.display = 'none'); });
btnRefuelSave.addEventListener('click', () => {
    const d = { carId: document.getElementById('refuel-car-id').value, km: document.getElementById('refuel-km').value, liters: document.getElementById('refuel-liters').value, totalPrice: document.getElementById('refuel-price').value, pricePerLiter: document.getElementById('refuel-ppl').innerText, date: new Date().toISOString() };
    if (!d.km || !d.liters || !d.totalPrice) return alert("Täytä tiedot");
    if (refuelKey) db.ref('refuelings/' + currentUser.uid + '/' + refuelKey).update(d); else db.ref('refuelings/' + currentUser.uid).push().set(d);
    refuelModal.style.display = 'none';
});

// TILASTOT
let chartM = null, chartV = null, chartP = null, chartC = null;
function renderStats() {
    if (allHistoryData.length > 0) {
        const m = {}, v = {};
        allHistoryData.forEach(d => {
            const dist = parseFloat(d.distanceKm) || 0, date = new Date(d.startTime), mk = `${date.getMonth() + 1}/${date.getFullYear()}`;
            if (!m[mk]) m[mk] = 0; m[mk] += dist;
            let cObj = userCars.find(c => c.id === d.carId), l = `${(cObj ? cObj.icon : "🚗")} ${(cObj ? cObj.name : "Muu")}`;
            if (!v[l]) v[l] = 0; v[l] += dist;
        });
        const mL = Object.keys(m).reverse().slice(0, 6).reverse(), mV = mL.map(k => m[k].toFixed(1));
        const vL = Object.keys(v), vV = Object.values(v).map(val => val.toFixed(1));
        
        if (chartM) chartM.destroy(); chartM = new Chart(document.getElementById('chart-monthly'), { type: 'bar', data: { labels: mL, datasets: [{ label: 'km', data: mV, backgroundColor: 'rgba(41,121,255,0.6)' }] } });
        if (chartV) chartV.destroy(); chartV = new Chart(document.getElementById('chart-vehicles'), { type: 'doughnut', data: { labels: vL, datasets: [{ data: vV, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }] } });
    }
    if (allRefuelData.length > 0) {
        const pD = [], cD = {};
        allRefuelData.sort((a, b) => new Date(a.date) - new Date(b.date));
        allRefuelData.forEach(r => {
            const d = new Date(r.date), l = `${d.getDate()}.${d.getMonth() + 1}`, mk = `${d.getMonth() + 1}/${d.getFullYear()}`;
            pD.push({ x: l, y: parseFloat(r.pricePerLiter) });
            if (!cD[mk]) cD[mk] = 0; cD[mk] += parseFloat(r.totalPrice);
        });
        if (chartP) chartP.destroy(); chartP = new Chart(document.getElementById('chart-fuel-price'), { type: 'line', data: { labels: pD.map(d => d.x), datasets: [{ label: '€/l', data: pD.map(d => d.y), borderColor: '#aa00ff', fill: true }] } });
        const cL = Object.keys(cD).slice(-6), cV = cL.map(k => cD[k]);
        if (chartC) chartC.destroy(); chartC = new Chart(document.getElementById('chart-fuel-cost'), { type: 'bar', data: { labels: cL, datasets: [{ label: '€', data: cV, backgroundColor: '#ff9f40' }] } });
    }
}

// APUFUNKTIOT
window.showRouteOnMap = (key) => {
    const d = allHistoryData.find(x => x.key === key); if (!d || !d.route) return alert("Ei reittidataa");
    clearSavedRoute(); isViewingHistory = true; mapGpsToggle.innerText = "📡 OFF"; mapGpsToggle.classList.add('inactive'); mapLegend.style.display = 'flex';
    if (d.route[0] && d.route[0].spd !== undefined) {
        for (let i = 0; i < d.route.length - 1; i++) {
            const p1 = d.route[i], p2 = d.route[i + 1], c = getSpeedColor(p1.spd, d.carType);
            savedRouteLayers.push(L.polyline([[p1.lat, p1.lng], [p2.lat, p2.lng]], { color: c, weight: 5, opacity: 0.8 }).addTo(map));
        }
    } else savedRouteLayer = L.polyline(d.route, { color: '#ff9100', weight: 5 }).addTo(map);
    const b = L.latLngBounds(d.route.map(p => [p.lat, p.lng])); map.fitBounds(b, { padding: [50, 50] }); switchView('map');
};
function clearSavedRoute() { savedRouteLayers.forEach(l => map.removeLayer(l)); savedRouteLayers = []; if (savedRouteLayer) { map.removeLayer(savedRouteLayer); savedRouteLayer = null; } }
function getSpeedColor(s, t) { let m = (t === 'bike') ? 30 : 100; if (s <= 3) return '#2979ff'; if (s / m < 0.33) return '#00e676'; if (s / m < 0.66) return '#ffea00'; return '#ff1744'; }
function updateDashboardUI(s, m, d, t, a, avg) {
    dashSpeedEl.innerText = s.toFixed(1); dashMaxSpeedEl.innerText = m.toFixed(1); dashDistEl.innerText = d.toFixed(2); dashAltEl.innerText = Math.round(a); if (avg !== undefined) dashAvgEl.innerText = avg.toFixed(1);
}
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371, dLat = (lat2 - lat1) * (Math.PI / 180), dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function handleError(e) { statusEl.innerText = "GPS Virhe: " + e.message; }
function toGeocacheFormat(d, isLat) { const deg = Math.floor(Math.abs(d)), m = (Math.abs(d) - deg) * 60; return `${isLat ? (d >= 0 ? "N" : "S") : (d >= 0 ? "E" : "W")} ${deg}° ${m.toFixed(3)}`; }
function saveToFirebase(d) { if (currentUser) db.ref('ajopaivakirja/' + currentUser.uid).push().set(d).catch(e => alert(e.message)); else alert("Kirjaudu sisään"); }
async function requestWakeLock() { try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (e) { } }

// Autotallin napit
window.openEditLogModal = (k) => {
    const d = allHistoryData.find(x => x.key === k); if (!d) return;
    editKeyEl.value = k; document.getElementById('edit-subject').value = d.subject || ""; editCarSelectEl.innerHTML = "";
    userCars.forEach(c => { const o = new Option(c.name, c.id); if (d.carId === c.id) o.selected = true; editCarSelectEl.appendChild(o); });
    editModal.style.display = 'flex';
};
window.openDeleteLogModal = (k) => { deleteKey = k; deleteModal.style.display = 'flex'; };
window.updateLogSubject = (k, v) => { if (currentUser) db.ref('ajopaivakirja/' + currentUser.uid + '/' + k).update({ subject: v }); };
btnEditCancel.addEventListener('click', () => editModal.style.display = 'none');
btnEditSave.addEventListener('click', () => {
    const k = editKeyEl.value, c = userCars.find(x => x.id === editCarSelectEl.value);
    if (k && c) db.ref('ajopaivakirja/' + currentUser.uid + '/' + k).update({ subject: document.getElementById('edit-subject').value, carId: c.id, carName: c.name, carIcon: c.icon, carType: c.type }).then(() => editModal.style.display = 'none');
});
const carIcons = ["🚗", "🚙", "🛻", "🚌", "🏎️", "🚕", "🚓", "🚑", "🚒", "🚐", "🚚", "🚜", "🏍️", "🛵", "🚲", "🛴", "🚘", "🚔", "🚖", "🚍", "🦽", "🦼", "🛹", "🛶", "🚤", "🛳️"];
function generateCarIcons() {
    const grid = document.getElementById('car-icon-selector'); if(!grid) return;
    grid.innerHTML = "";
    carIcons.forEach(icon => {
        const div = document.createElement('div'); div.className = 'car-icon-option'; div.innerText = icon;
        div.onclick = () => {
            document.querySelectorAll('.car-icon-option').forEach(el=>el.classList.remove('selected-icon'));
            div.classList.add('selected-icon'); document.getElementById('selected-car-icon').value = icon;
        };
        grid.appendChild(div);
    });
}
window.editCar = (id) => {
    const car = userCars.find(c => c.id === id); if(!car) return;
    document.getElementById('car-id').value = car.id;
    document.getElementById('car-name').value = car.name;
    document.getElementById('car-type').value = car.type;
    document.getElementById('selected-car-icon').value = car.icon || "🚗";
    generateCarIcons();
    document.getElementById('add-car-form').style.display = 'block'; document.getElementById('btn-add-car').style.display = 'none';
};
window.deleteCar = (id) => { if(confirm("Poista?")) db.ref('users/'+currentUser.uid+'/cars/'+id).remove(); };
document.getElementById('btn-add-car').addEventListener('click', () => {
    document.getElementById('car-id').value = ''; document.getElementById('add-car-form').style.display = 'block'; document.getElementById('btn-add-car').style.display = 'none';
});
document.getElementById('btn-cancel-car').addEventListener('click', () => {
    document.getElementById('add-car-form').style.display = 'none'; document.getElementById('btn-add-car').style.display = 'block';
});
document.getElementById('btn-save-car').addEventListener('click', () => {
    const id = document.getElementById('car-id').value;
    const data = {
        name: document.getElementById('car-name').value, type: document.getElementById('car-type').value,
        icon: document.getElementById('selected-car-icon').value, plate: document.getElementById('car-plate').value,
        fuel: document.getElementById('car-fuel').value, tank: document.getElementById('car-tank').value
    };
    if(id) db.ref('users/'+currentUser.uid+'/cars/'+id).update(data); else db.ref('users/'+currentUser.uid+'/cars').push().set(data);
    document.getElementById('add-car-form').style.display = 'none'; document.getElementById('btn-add-car').style.display = 'block';
});

document.addEventListener('DOMContentLoaded', () => { updateClockAndDate(); setInterval(updateClockAndDate, 1000); });
function updateClockAndDate() { const n = new Date(); if (dashClockEl) dashClockEl.innerText = n.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); if (dashDateEl) dashDateEl.innerText = n.toLocaleDateString('fi-FI', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' }); }
function updateTimer() { if (!startTime) return; const n = new Date(), d = n - startTime - totalPauseTime, m = Math.floor((d % 3600000) / 60000), s = Math.floor((d % 60000) / 1000), h = Math.floor(d / 3600000); dashTimeEl.innerText = (h > 0 ? h + ":" : "") + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s; }
