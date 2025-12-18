// =========================================================
// MIKKOKALEVIN AJOPÄIVÄKIRJA PRO - APP.JS (MASTER FIXED)
// OSA 1: ALUSTUS, KIRJAUTUMINEN, NAVIGAATIO
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

// Alustetaan Firebase vain kerran
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
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
    stats: document.getElementById('stats-view'),
    settings: document.getElementById('settings-view'),
    help: document.getElementById('help-view')
};

// Navigaationapit
const navBtns = {
    dashboard: document.getElementById('nav-dashboard'),
    map: document.getElementById('nav-map'),
    history: document.getElementById('nav-history'),
    stats: document.getElementById('nav-stats'),
    settings: document.getElementById('nav-settings'),
    help: document.getElementById('nav-help')
};

// Modaalit
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

// TANKKAUS MODAALI
const refuelModal = document.getElementById('refuel-modal');
const btnRefuelSave = document.getElementById('btn-refuel-save');
const btnRefuelCancel = document.getElementById('btn-refuel-cancel');
const btnRefuelDelete = document.getElementById('btn-refuel-delete');

// MUUTTUJAT
let currentUser = null; 
let watchId = null;
let wakeLock = null;

// TÄRKEÄT LISTAT MUISTISSA
let allHistoryData = []; 
let allRefuelData = []; 
let userCars = [];
let currentCarId = "all"; 
let currentCarType = "car"; 

const carSelectEl = document.getElementById('car-select');

// --- KIRJAUTUMINEN ---

auth.onAuthStateChanged((user) => {
    if (splashScreen) {
        setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);
    }

    if (user) {
        // KÄYTTÄJÄ KIRJAUTUNUT
        currentUser = user;
        loginView.style.display = 'none';
        appContainer.style.display = 'flex';
        
        menuUserName.innerText = user.displayName || user.email;
        if (user.photoURL) {
            menuUserAvatar.src = user.photoURL;
        } else {
            menuUserAvatar.src = "ajopaivakirja_logo.png";
        }

        // Ladataan tiedot
        loadCars(); 
        loadHistory(); 
        generateCarIcons(); 

        // Korjataan kartan koko
        if (views.map.style.display !== 'none') {
            setTimeout(() => map.invalidateSize(), 200);
        }
    } else {
        // EI KIRJAUTUNUT
        currentUser = null;
        appContainer.style.display = 'none';
        loginView.style.display = 'flex';
    }
});

// Kirjautumispainikkeet
document.getElementById('btn-login').addEventListener('click', () => {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider()).catch(e => alert(e.message));
});
document.getElementById('btn-email-login').addEventListener('click', () => {
    const email = document.getElementById('email-input').value;
    const pass = document.getElementById('password-input').value;
    if(!email || !pass) { alert("Syötä tiedot."); return; }
    auth.signInWithEmailAndPassword(email, pass).catch(e => alert(e.message));
});
document.getElementById('btn-email-register').addEventListener('click', () => {
    const email = document.getElementById('email-input').value;
    const pass = document.getElementById('password-input').value;
    if(!email || !pass) { alert("Syötä tiedot."); return; }
    auth.createUserWithEmailAndPassword(email, pass).catch(e => alert(e.message));
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
    backBtn.innerText = "← Takaisin";
    backBtn.className = 'action-btn blue-btn';
    backBtn.style.marginTop = "20px";
    backBtn.onclick = () => location.reload();
    const helpView = document.getElementById('help-view');
    if (!helpView.querySelector('button')) { helpView.prepend(backBtn); }
});

// --- NAVIGAATIO ---

menuBtn.addEventListener('click', () => {
    if (mainMenu.style.display === 'none') mainMenu.style.display = 'flex';
    else mainMenu.style.display = 'none';
});

document.getElementById('app-logo').addEventListener('click', () => {
    switchView('dashboard');
});

// DASHBOARD TANKKAUSNAPPI
const quickRefuelBtn = document.getElementById('btn-quick-refuel');
if (quickRefuelBtn) {
    quickRefuelBtn.addEventListener('click', () => {
        if(currentCarId === 'all') {
            alert("Valitse ensin auto yläpalkista!");
        } else {
            if (typeof window.openRefuelModal === 'function') {
                window.openRefuelModal(currentCarId);
            } else {
                alert("Virhe: Lataa sivu uudelleen.");
            }
        }
    });
}

function switchView(viewName) {
    mainMenu.style.display = 'none';
    
    // Piilota kaikki
    Object.values(views).forEach(el => el.style.display = 'none');
    Object.values(navBtns).forEach(btn => { if(btn) btn.classList.remove('active-menu'); });

    // Näytä valittu
    if (viewName === 'dashboard' || viewName === 'map') {
        views[viewName].style.display = 'flex';
    } else {
        views[viewName].style.display = 'block';
    }
    
    if(navBtns[viewName]) navBtns[viewName].classList.add('active-menu');

    // Erikoiskäsittelyt
    if (viewName !== 'map') {
        clearSavedRoute(); 
        isViewingHistory = false;
        mapLegend.style.display = 'none';
    }

    if (viewName === 'map') setTimeout(() => map.invalidateSize(), 100);
    
    if (viewName === 'history') {
        // Varmista että oikea välilehti latautuu
        if(typeof window.switchHistoryTab === 'function') {
            // Jos tankkauslista oli auki, pidetään se, muuten ajot
            if(document.getElementById('history-refuels-section').style.display === 'block') {
                window.renderRefuelList();
            } else {
                window.switchHistoryTab('drives');
            }
        }
    }
    if (viewName === 'settings') renderCarList();
    if (viewName === 'stats') renderStats();
}

// Navigaatio Listenerit
Object.keys(navBtns).forEach(key => {
    if(navBtns[key]) navBtns[key].addEventListener('click', () => switchView(key));
});

document.getElementById('side-tap-left').addEventListener('click', () => switchView('map'));
document.getElementById('map-return-btn').addEventListener('click', () => switchView('dashboard'));
// =========================================================
// OSA 2: GPS, KARTTA JA AJON TALLENNUS
// =========================================================

// Kartta elementit
const mapSpeedEl = document.getElementById('map-speed');
const mapCoordsEl = document.getElementById('map-coords');
const statusEl = document.getElementById('status');
const mapGpsToggle = document.getElementById('map-gps-toggle');
const mapLegend = document.getElementById('map-legend');

// Dashboard elementit
const dashSpeedEl = document.getElementById('dash-speed');
const dashMaxSpeedEl = document.getElementById('dash-max-speed');
const dashDistEl = document.getElementById('dash-dist');
const dashTimeEl = document.getElementById('dash-time');
const dashAltEl = document.getElementById('dash-alt');
const dashAvgEl = document.getElementById('dash-avg'); 
const dashCoordsEl = document.getElementById('dash-coords');
const dashHeadingEl = document.getElementById('dash-heading'); 
const dashWeatherEl = document.getElementById('dash-weather');
const liveStatusBar = document.getElementById('live-status-bar');
const liveStyleEl = document.getElementById('live-style-indicator');

// Kontrollit
const btnStartRec = document.getElementById('btn-start-rec');
const activeRecBtns = document.getElementById('active-rec-btns');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnStopRec = document.getElementById('btn-stop-rec');

// Muuttujat
let isGPSActive = false;
let isRecording = false; 
let isPaused = false; 
let isViewingHistory = false; 

let tempDriveData = null;
let lastLatLng = null;
let routePath = []; 
let realTimePolyline = null; 
let savedRouteLayers = []; 
let savedRouteLayer = null; 

// KARTTA (Leaflet)
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {});
const terrainMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 });

const map = L.map('map', { center: [64.0, 26.0], zoom: 16, layers: [streetMap], zoomControl: false });
L.control.layers({ "Peruskartta": streetMap, "Satelliitti": satelliteMap, "Maastokartta": terrainMap }).addTo(map);

let marker = L.circleMarker([64.0, 26.0], { color: '#2979ff', fillColor: '#2979ff', fillOpacity: 0.8, radius: 8 }).addTo(map);
realTimePolyline = L.polyline([], {color: '#2979ff', weight: 5, opacity: 0.7}).addTo(map);

mapGpsToggle.addEventListener('click', () => {
    isViewingHistory = !isViewingHistory;
    if(isViewingHistory) {
        mapGpsToggle.innerText = "📡 OFF";
        mapGpsToggle.classList.add('inactive');
    } else {
        mapGpsToggle.innerText = "📡 ON";
        mapGpsToggle.classList.remove('inactive');
        if(lastLatLng) map.panTo([lastLatLng.lat, lastLatLng.lng]);
    }
});

// GPS LOGIIKKA
document.getElementById('btn-activate-gps').addEventListener('click', () => {
    if (!isGPSActive) {
        startGPS();
        document.getElementById('btn-activate-gps').style.display = 'none';
        document.getElementById('rec-controls').style.display = 'flex';
        statusEl.innerText = "GPS Päällä";
    }
});

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
    const speedMs = position.coords.speed || 0; 
    let speedKmh = speedMs * 3.6;
    if (speedKmh < 1.0) speedKmh = 0;

    let currentAvg = 0;

    if (currentDriveWeather === "") fetchWeather(lat, lng);

    // TALLENNUS PÄÄLLÄ
    if (isRecording && !isPaused) {
        if (speedKmh > maxSpeed) maxSpeed = speedKmh;
        if (lastLatLng) {
            const dist = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
            if ((speedKmh > 3 || dist > 0.02) && dist < 50.0) totalDistance += dist;
        }
        
        if (speedKmh > 3 || (lastLatLng && getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng) > 0.02)) {
            routePath.push({ lat: lat, lng: lng, spd: speedKmh });
            realTimePolyline.addLatLng([lat, lng]);
        }

        if (startTime) {
            const now = new Date();
            const activeTimeMs = (now - startTime) - totalPauseTime;
            const durationHrs = activeTimeMs / (1000 * 60 * 60);
            if (durationHrs > 0) currentAvg = totalDistance / durationHrs;
        }
    }
    
    // KARTAN PÄIVITYS
    if (!lastLatLng || speedKmh > 0 || isGPSActive) {
        lastLatLng = { lat, lng };
        const newLatLng = new L.LatLng(lat, lng);
        marker.setLatLng(newLatLng);
        
        if (views.map.style.display !== 'none' && !isViewingHistory) {
            let targetZoom = 18; 
            if (currentCarType !== 'bike') {
                if (speedKmh > 100) targetZoom = 14; 
                else if (speedKmh > 70) targetZoom = 16;
                else targetZoom = 18;
            }
            if (map.getZoom() !== targetZoom) map.setView(newLatLng, targetZoom); else map.panTo(newLatLng);
        }
        mapSpeedEl.innerText = speedKmh.toFixed(1);
        mapCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    }

    updateDashboardUI(speedKmh, maxSpeed, totalDistance, null, position.coords.altitude||0, currentAvg);
    
    if (position.coords.heading && dashHeadingEl) {
        dashHeadingEl.innerText = getCardinalDirection(position.coords.heading);
    }

    if (isGPSActive && wakeLock === null) requestWakeLock();
}

// NAPIT (Start, Pause, Stop)
btnStartRec.addEventListener('click', () => {
    // Kiihtyvyysanturi
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(r => { if (r === 'granted') window.addEventListener('devicemotion', handleMotion); });
    } else {
        window.addEventListener('devicemotion', handleMotion);
    }

    isRecording = true; isPaused = false; isViewingHistory = false;
    mapGpsToggle.innerText = "📡 ON"; mapGpsToggle.classList.remove('inactive');

    startTime = new Date(); totalPauseTime = 0; maxSpeed = 0; totalDistance = 0;
    routePath = []; realTimePolyline.setLatLngs([]); clearSavedRoute();
    
    currentDriveWeather = ""; aggressiveEvents = 0;
    
    updateDashboardUI(0, 0, 0, 0, 0, 0);
    
    if (currentCarType === 'bike') {
        liveStatusBar.style.opacity = '0';
    } else {
        liveStatusBar.style.opacity = '1'; 
        liveStyleEl.innerText = "Taloudellinen"; 
        liveStyleEl.className = "style-badge style-green";
    }
    
    btnStartRec.style.display = 'none'; activeRecBtns.style.display = 'flex';
    btnPause.style.display = 'inline-block'; btnResume.style.display = 'none';
    statusEl.innerText = "🔴 TALLENNETAAN"; statusEl.style.color = "#ff4444";
    
    timerInterval = setInterval(updateTimer, 1000);
});

btnPause.addEventListener('click', () => {
    isPaused = true; pauseStartTime = new Date(); clearInterval(timerInterval);
    btnPause.style.display = 'none'; btnResume.style.display = 'inline-block';
    statusEl.innerText = "⏸ TAUKO"; statusEl.style.color = "#fbc02d";
});

btnResume.addEventListener('click', () => {
    isPaused = false; totalPauseTime += (new Date() - pauseStartTime);
    btnResume.style.display = 'none'; btnPause.style.display = 'inline-block';
    statusEl.innerText = "🔴 TALLENNETAAN"; statusEl.style.color = "#ff4444";
    timerInterval = setInterval(updateTimer, 1000);
});

btnStopRec.addEventListener('click', () => {
    if (!isRecording) return;
    clearInterval(timerInterval); window.removeEventListener('devicemotion', handleMotion);
    
    if (isPaused) totalPauseTime += (new Date() - pauseStartTime);

    const endTime = new Date();
    const activeDurationMs = (endTime - startTime) - totalPauseTime;
    
    // Hae autotiedot
    let cName = "Muu"; let cIcon = "🚗";
    if (currentCarId !== 'all') {
        const c = userCars.find(x => x.id === currentCarId);
        if(c) { cName = c.name; cIcon = c.icon || (c.type === 'bike' ? "🚲" : "🚗"); }
    }

    // Tallennusobjekti
    tempDriveData = {
        type: 'end_drive',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        distanceKm: totalDistance.toFixed(2),
        maxSpeed: maxSpeed.toFixed(1),
        durationMs: activeDurationMs,
        subject: "",
        weather: currentDriveWeather,
        carName: cName, carIcon: cIcon, carId: currentCarId, carType: currentCarType,
        route: routePath
    };

    const mins = Math.floor(activeDurationMs / 60000);
    modalDistEl.innerText = totalDistance.toFixed(2) + " km";
    modalTimeEl.innerText = mins + " min";
    modalSubjectEl.value = ""; 
    modalCarNameEl.innerText = cName; 

    saveModal.style.display = 'flex';
    liveStatusBar.style.opacity = '0';
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
// =========================================================
// OSA 3: HISTORIA, AUTOTALLI JA TILASTOT
// =========================================================

// --- AUTOTALLI ---

function loadCars() {
    if(!currentUser) return;
    
    const carsRef = db.ref('users/' + currentUser.uid + '/cars');
    carsRef.on('value', (snapshot) => {
        userCars = [];
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                userCars.push({ id: child.key, ...child.val() });
            });
        }
        updateCarSelect(); 
        
        // Päivitetään listat, jos käyttäjä on niissä näkymissä
        if (views.settings.style.display !== 'none') renderCarList();
        
        // PÄIVITETÄÄN HISTORIA JOS AUTOJEN NIMET MUUTTUI
        if (views.history.style.display !== 'none') {
             // Tarkista kumpi lista on auki
             if(document.getElementById('history-refuels-section').style.display === 'block') {
                 renderRefuelList();
             } else {
                 renderHistoryList();
             }
        }
    });
    
    const stored = localStorage.getItem('selectedCarId');
    if (stored) {
        currentCarId = stored;
        updateCarTypeVariable();
    }
}

function updateCarTypeVariable() {
    const c = userCars.find(x => x.id === currentCarId);
    currentCarType = (c && c.type) ? c.type : "car";
}

function updateCarSelect() {
    carSelectEl.innerHTML = "";
    const allOpt = document.createElement('option'); allOpt.value = 'all'; allOpt.text = "Kaikki ajoneuvot"; carSelectEl.appendChild(allOpt);
    
    userCars.forEach(car => {
        const opt = document.createElement('option');
        opt.value = car.id;
        const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
        opt.text = `${icon} ${car.name}`;
        if(car.id === currentCarId) opt.selected = true;
        carSelectEl.appendChild(opt);
    });
}

carSelectEl.addEventListener('change', () => {
    currentCarId = carSelectEl.value;
    localStorage.setItem('selectedCarId', currentCarId);
    updateCarTypeVariable();
    
    // Päivitetään historia-näkymä valinnan mukaan
    if (views.history.style.display !== 'none') {
         if(document.getElementById('history-refuels-section').style.display === 'block') {
             renderRefuelList();
         } else {
             renderHistoryList();
         }
    }
});

// --- HISTORIA JA DATAN LATAUS ---

function loadHistory() {
    if (!currentUser) return;
    
    // 1. Lataa AJOT
    db.ref('ajopaivakirja/' + currentUser.uid).on('value', (snapshot) => {
        allHistoryData = [];
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                allHistoryData.push({ key: child.key, ...child.val() });
            });
        }
        // Järjestä uusin ensin
        allHistoryData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        populateFilter();
        
        // Päivitä ajolista, jos se on näkyvissä
        if (views.history.style.display !== 'none' && document.getElementById('history-drives-section').style.display !== 'none') {
            renderHistoryList();
        }
        if (views.stats.style.display !== 'none') renderStats();
    });

    // 2. Lataa TANKKAUKSET
    db.ref('refuelings/' + currentUser.uid).on('value', (snapshot) => {
        allRefuelData = [];
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                allRefuelData.push({ key: child.key, ...child.val() });
            });
        }
        
        // Päivitä tankkauslista, jos se on näkyvissä
        if (views.history.style.display !== 'none' && document.getElementById('history-refuels-section').style.display !== 'none') {
            renderRefuelList();
        }
        if (views.stats.style.display !== 'none') renderStats();
    });
}

// VÄLILEHTIEN VAIHTO (Tab Switch)
window.switchHistoryTab = (tab) => {
    // Poista active-luokka kaikista
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

// RENDERÖI AJOT
function renderHistoryList() {
    const list = document.getElementById('log-list');
    list.innerHTML = "";
    
    if (allHistoryData.length === 0) {
        list.innerHTML = "<p style='text-align:center;color:#888;'>Ei ajoja.</p>";
        historySummaryEl.style.display = 'none';
        return;
    }

    let count = 0, km = 0, ms = 0;
    const filter = filterEl.value;

    allHistoryData.forEach(d => {
        // Suodatus Auton mukaan
        if (currentCarId !== 'all' && d.carId !== currentCarId) return;
        
        // Suodatus Ajan mukaan
        const start = new Date(d.startTime);
        if (filter !== 'all') {
            if (filter === 'custom') { 
                if (filterStart.value && filterEnd.value) {
                    if (start < new Date(filterStart.value) || start > new Date(filterEnd.value)) return;
                }
            } else if (filter.startsWith("YEAR")) {
                if (start.getFullYear().toString() !== filter.split("-")[1]) return;
            }
        }

        km += parseFloat(d.distanceKm) || 0;
        ms += d.durationMs || 0;
        count++;

        // Etsi auton tiedot
        let cObj = userCars.find(c => c.id === d.carId);
        let icon = cObj ? (cObj.icon || "🚗") : (d.carIcon || "🚗");
        let name = cObj ? cObj.name : (d.carName || "Muu");

        const div = document.createElement('div');
        div.className = 'log-card';
        div.innerHTML = `
            <div class="log-header">
                <div class="log-title-group">
                    <div class="log-date-line">${start.toLocaleDateString()} ${start.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                    <div class="log-car-big">${icon} ${name}</div>
                </div>
                <div style="display:flex;">
                    ${(d.route && d.route.length) ? `<button class="map-btn" onclick="window.showRouteOnMap('${d.key}')">🗺️</button>` : ''}
                    <button class="edit-btn" onclick="window.openEditLogModal('${d.key}')">✏️</button>
                    <button class="delete-btn" onclick="window.openDeleteLogModal('${d.key}')">🗑</button>
                </div>
            </div>
            <div class="log-stats">
                <div><span class="stat-label">KM</span>${d.distanceKm}</div>
                <div><span class="stat-label">AIKA</span>${Math.floor((d.durationMs||0)/60000)} min</div>
                <div><span class="stat-label">MAX</span>${d.maxSpeed}</div>
            </div>
        `;
        list.appendChild(div);
    });

    if (count === 0) {
        list.innerHTML = "<p style='text-align:center;color:#888;'>Ei tuloksia valinnalla.</p>";
        historySummaryEl.style.display = 'none';
    } else {
        sumKmEl.innerText = km.toFixed(1);
        sumCountEl.innerText = count;
        sumTimeEl.innerText = `${Math.floor(ms / 3600000)}h ${Math.floor((ms % 3600000) / 60000)}min`;
        historySummaryEl.style.display = 'flex';
    }
}

// RENDERÖI TANKKAUKSET
function renderRefuelList() {
    const list = document.getElementById('refuel-list');
    list.innerHTML = "";
    
    if (allRefuelData.length === 0) {
        list.innerHTML = "<p style='text-align:center;color:#888;'>Ei tankkauksia.</p>";
        return;
    }
    
    // Suodatus Auton mukaan
    const filtered = (currentCarId === 'all') 
        ? allRefuelData 
        : allRefuelData.filter(r => r.carId === currentCarId);
        
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));

    if (filtered.length === 0) {
        list.innerHTML = "<p style='text-align:center;color:#888;'>Ei tankkauksia tälle autolle.</p>";
        return;
    }

    filtered.forEach(r => {
        const d = new Date(r.date);
        const car = userCars.find(c => c.id === r.carId);
        const icon = car ? (car.icon||"🚗") : "🚗";
        const name = car ? car.name : "?";
        
        const div = document.createElement('div');
        div.className = 'log-card';
        div.innerHTML = `
            <div class="log-header">
                <div class="log-title-group">
                    <div class="log-date-line">${d.toLocaleDateString()}</div>
                    <div class="log-car-big">${icon} ${name}</div>
                </div>
                <button class="edit-btn" onclick="window.openRefuelEdit('${r.key}')">✏️</button>
            </div>
            <div class="log-stats">
                <div><span class="stat-label">LITRAT</span>${r.liters}</div>
                <div><span class="stat-label">HINTA</span>${r.totalPrice}€</div>
                <div><span class="stat-label">€/L</span>${r.pricePerLiter}</div>
                <div><span class="stat-label">KM</span>${r.km}</div>
            </div>`;
        list.appendChild(div);
    });
}

function populateFilter() {
    filterEl.innerHTML = `<option value="all">Kaikki ajot</option><option value="custom">Mukautettu...</option>`;
    const s = new Set();
    allHistoryData.forEach(d => { if (d.startTime) { const x = new Date(d.startTime); s.add(JSON.stringify({ k: `YEAR-${x.getFullYear()}`, l: `Vuosi ${x.getFullYear()}`, s: x.getFullYear()*100 })); }});
    Array.from(s).map(JSON.parse).sort((a, b) => b.s - a.s).forEach(p => filterEl.appendChild(new Option(p.l, p.k)));
}
filterEl.addEventListener('change', () => { customFilterContainer.style.display = (filterEl.value === 'custom') ? 'block' : 'none'; renderHistoryList(); });
filterStart.addEventListener('change', renderHistoryList); 
filterEnd.addEventListener('change', renderHistoryList);

// --- TILASTOT ---
let chartM = null, chartV = null, chartP = null, chartC = null;

function renderStats() {
    // 1. Ajot
    if (allHistoryData.length > 0) {
        const m = {}, v = {};
        allHistoryData.forEach(d => {
            const dist = parseFloat(d.distanceKm) || 0;
            const date = new Date(d.startTime);
            const mKey = `${date.getMonth()+1}/${date.getFullYear()}`;
            if (!m[mKey]) m[mKey] = 0; m[mKey] += dist;

            let cObj = userCars.find(c => c.id === d.carId);
            let label = `${(cObj?cObj.icon:"🚗")} ${(cObj?cObj.name:"Muu")}`;
            if (!v[label]) v[label] = 0; v[label] += dist;
        });

        const mL = Object.keys(m).reverse().slice(0, 6).reverse(); 
        const mV = mL.map(k => m[k].toFixed(1));
        const vL = Object.keys(v); 
        const vV = Object.values(v).map(val => val.toFixed(1));

        const ctxM = document.getElementById('chart-monthly').getContext('2d');
        if (chartM) chartM.destroy();
        chartM = new Chart(ctxM, { type: 'bar', data: { labels: mL, datasets: [{ label: 'km', data: mV, backgroundColor: 'rgba(41,121,255,0.6)' }] } });

        const ctxV = document.getElementById('chart-vehicles').getContext('2d');
        if (chartV) chartV.destroy();
        chartV = new Chart(ctxV, { type: 'doughnut', data: { labels: vL, datasets: [{ data: vV, backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'] }] } });
    }

    // 2. Tankkaukset
    if (allRefuelData.length > 0) {
        const pD = [], cD = {};
        // Lajitellaan vanhimmasta uusimpaan graafeja varten
        const sorted = [...allRefuelData].sort((a,b) => new Date(a.date) - new Date(b.date));
        
        sorted.forEach(r => {
            const d = new Date(r.date);
            const label = `${d.getDate()}.${d.getMonth()+1}`;
            pD.push({ x: label, y: parseFloat(r.pricePerLiter) });
            
            const mKey = `${d.getMonth()+1}/${d.getFullYear()}`;
            if(!cD[mKey]) cD[mKey] = 0; 
            cD[mKey] += parseFloat(r.totalPrice);
        });

        const ctxP = document.getElementById('chart-fuel-price').getContext('2d');
        if(chartP) chartP.destroy();
        chartP = new Chart(ctxP, { type: 'line', data: { labels: pD.map(d=>d.x), datasets: [{ label: '€/l', data: pD.map(d=>d.y), borderColor: '#aa00ff', fill: true }] } });

        const cL = Object.keys(cD).slice(-6); 
        const cV = cL.map(k => cD[k]);
        const ctxC = document.getElementById('chart-fuel-cost').getContext('2d');
        if(chartC) chartC.destroy();
        chartC = new Chart(ctxC, { type: 'bar', data: { labels: cL, datasets: [{ label: '€', data: cV, backgroundColor: '#ff9f40' }] } });
    }
}
// =========================================================
// OSA 4: MODAALIT, NAPIT JA APUFUNKTIOT
// =========================================================

// --- TANKKAUS MODAALI ---

window.openRefuelModal = (carId) => {
    const car = userCars.find(c => c.id === carId); 
    if(!car) { alert("Autoa ei löydy. Päivitä sivu."); return;}
    
    refuelKey = null;
    
    document.getElementById('refuel-car-id').value = carId;
    document.getElementById('refuel-car-name').innerText = `${car.icon||"🚗"} ${car.name}`;
    document.getElementById('refuel-km').value = "";
    document.getElementById('refuel-liters').value = "";
    document.getElementById('refuel-price').value = "";
    document.getElementById('btn-refuel-delete').style.display = 'none';
    
    // Hae edelliset km
    const carRefuels = allRefuelData.filter(r => r.carId === carId);
    carRefuels.sort((a,b) => b.km - a.km); // Suurin km ensin
    const prevKm = carRefuels.length > 0 ? carRefuels[0].km : 0;
    document.getElementById('prev-km').innerText = prevKm;
    
    // Nollaa laskurit
    document.getElementById('refuel-ppl').innerText = "0.000";
    document.getElementById('refuel-trip').innerText = "-";
    document.getElementById('refuel-cons').innerText = "-";
    
    refuelModal.style.display = 'flex';
};

window.openRefuelEdit = (key) => {
    const r = allRefuelData.find(x => x.key === key); if(!r) return;
    refuelKey = key;
    const c = userCars.find(x => x.id === r.carId);
    
    document.getElementById('refuel-car-id').value = r.carId;
    document.getElementById('refuel-car-name').innerText = `${c?c.icon:"🚗"} ${c?c.name:"?"} (Muokkaus)`;
    document.getElementById('refuel-km').value = r.km;
    document.getElementById('refuel-liters').value = r.liters;
    document.getElementById('refuel-price').value = r.totalPrice;
    document.getElementById('btn-refuel-delete').style.display = 'block';
    
    window.calculateRefuelStats();
    refuelModal.style.display = 'flex';
};

window.calculateRefuelStats = () => {
    const l = parseFloat(document.getElementById('refuel-liters').value);
    const p = parseFloat(document.getElementById('refuel-price').value);
    const k = parseFloat(document.getElementById('refuel-km').value);
    
    // Turvallinen haku elementeille
    const prevEl = document.getElementById('prev-km');
    const prev = prevEl ? parseFloat(prevEl.innerText) : 0;
    
    const pplEl = document.getElementById('refuel-ppl');
    if(pplEl) pplEl.innerText = (l > 0 && p > 0) ? (p / l).toFixed(3) : "0.000";
    
    const tripEl = document.getElementById('refuel-trip');
    const consEl = document.getElementById('refuel-cons');

    if(k > prev && prev > 0 && l > 0) {
        const dist = k - prev;
        if(tripEl) tripEl.innerText = dist.toFixed(0);
        if(consEl) consEl.innerText = ((l * 100) / dist).toFixed(1);
    } else {
        if(tripEl) tripEl.innerText = "-";
        if(consEl) consEl.innerText = "-";
    }
};

btnRefuelCancel.addEventListener('click', () => refuelModal.style.display = 'none');

btnRefuelDelete.addEventListener('click', () => {
    if(confirm("Poista tankkaus?")) {
        db.ref('refuelings/' + currentUser.uid + '/' + refuelKey).remove()
            .then(() => refuelModal.style.display = 'none');
    }
});

btnRefuelSave.addEventListener('click', () => {
    const data = {
        carId: document.getElementById('refuel-car-id').value,
        km: document.getElementById('refuel-km').value,
        liters: document.getElementById('refuel-liters').value,
        totalPrice: document.getElementById('refuel-price').value,
        pricePerLiter: document.getElementById('refuel-ppl').innerText,
        date: new Date().toISOString()
    };
    
    if(!data.km || !data.liters || !data.totalPrice) return alert("Täytä kaikki tiedot!");
    
    if(refuelKey) {
        db.ref('refuelings/' + currentUser.uid + '/' + refuelKey).update(data);
    } else {
        db.ref('refuelings/' + currentUser.uid).push().set(data);
    }
    
    refuelModal.style.display = 'none';
});

// --- AJONEUVOJEN HALLINTA (Modaalit) ---

window.editCar = (id) => {
    const car = userCars.find(c => c.id === id); if(!car) return;
    document.getElementById('car-id').value = car.id;
    document.getElementById('car-name').value = car.name;
    document.getElementById('car-type').value = car.type;
    document.getElementById('selected-car-icon').value = car.icon || "🚗";
    
    generateCarIcons();
    document.getElementById('add-car-form').style.display = 'block';
    document.getElementById('btn-add-car').style.display = 'none';
};

window.deleteCar = (id) => {
    if(confirm("Poista ajoneuvo?")) db.ref('users/'+currentUser.uid+'/cars/'+id).remove();
};

document.getElementById('btn-add-car').addEventListener('click', () => {
    document.getElementById('car-id').value = '';
    document.getElementById('add-car-form').style.display = 'block';
    document.getElementById('btn-add-car').style.display = 'none';
});
document.getElementById('btn-cancel-car').addEventListener('click', () => {
    document.getElementById('add-car-form').style.display = 'none';
    document.getElementById('btn-add-car').style.display = 'block';
});
document.getElementById('btn-save-car').addEventListener('click', () => {
    const id = document.getElementById('car-id').value;
    const data = {
        name: document.getElementById('car-name').value,
        type: document.getElementById('car-type').value,
        icon: document.getElementById('selected-car-icon').value,
        plate: document.getElementById('car-plate').value,
        fuel: document.getElementById('car-fuel').value,
        tank: document.getElementById('car-tank').value
    };
    if(id) db.ref('users/'+currentUser.uid+'/cars/'+id).update(data);
    else db.ref('users/'+currentUser.uid+'/cars').push().set(data);
    
    document.getElementById('add-car-form').style.display = 'none';
    document.getElementById('btn-add-car').style.display = 'block';
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

// --- MUUT APUFUNKTIOT ---

window.showRouteOnMap = (key) => {
    const d = allHistoryData.find(x => x.key === key); 
    if (!d || !d.route) { alert("Ei reittidataa"); return; }
    
    clearSavedRoute(); 
    isViewingHistory = true; 
    mapGpsToggle.innerText = "📡 OFF"; 
    mapGpsToggle.classList.add('inactive'); 
    mapLegend.style.display = 'flex';

    if (d.route[0] && d.route[0].spd !== undefined) {
        for (let i = 0; i < d.route.length - 1; i++) {
            const p1 = d.route[i];
            const p2 = d.route[i + 1];
            const c = getSpeedColor(p1.spd, d.carType);
            const seg = L.polyline([[p1.lat, p1.lng], [p2.lat, p2.lng]], { color: c, weight: 5, opacity: 0.8 }).addTo(map);
            savedRouteLayers.push(seg);
        }
    } else {
        savedRouteLayer = L.polyline(d.route, { color: '#ff9100', weight: 5 }).addTo(map);
    }
    
    const b = L.latLngBounds(d.route.map(p => [p.lat, p.lng])); 
    map.fitBounds(b, { padding: [50, 50] }); 
    switchView('map');
};

function clearSavedRoute() {
    savedRouteLayers.forEach(l => map.removeLayer(l)); 
    savedRouteLayers = [];
    if(savedRouteLayer) { map.removeLayer(savedRouteLayer); savedRouteLayer = null; }
}

function getSpeedColor(s, t) {
    let m = (t === 'bike') ? 30 : 100;
    if (s <= 3) return '#2979ff';
    if (s / m < 0.33) return '#00e676';
    if (s / m < 0.66) return '#ffea00';
    return '#ff1744';
}

function updateDashboardUI(s, m, d, t, a, avg) {
    dashSpeedEl.innerText = s.toFixed(1); 
    dashMaxSpeedEl.innerText = m.toFixed(1);
    dashDistEl.innerText = d.toFixed(2); 
    dashAltEl.innerText = Math.round(a);
    if(avg !== undefined) dashAvgEl.innerText = avg.toFixed(1);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    const R = 6371; 
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function handleError(e) { statusEl.innerText = "GPS Virhe: " + e.message; }

function toGeocacheFormat(d, isLat) {
    const deg = Math.floor(Math.abs(d));
    const m = (Math.abs(d) - deg) * 60;
    return `${isLat ? (d >= 0 ? "N" : "S") : (d >= 0 ? "E" : "W")} ${deg}° ${m.toFixed(3)}`;
}

function saveToFirebase(d) {
    if (currentUser) db.ref('ajopaivakirja/' + currentUser.uid).push().set(d).catch(e => alert(e.message));
    else alert("Kirjaudu sisään");
}

async function requestWakeLock() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (e) { }
}

// Log Edit Helpers
window.openEditLogModal = (k) => {
    const d = allHistoryData.find(x => x.key === k); if (!d) return;
    editKeyEl.value = k;
    document.getElementById('edit-subject').value = d.subject || "";
    editCarSelectEl.innerHTML = "";
    userCars.forEach(c => {
        const o = new Option(c.name, c.id);
        if (d.carId === c.id) o.selected = true;
        editCarSelectEl.appendChild(o);
    });
    editModal.style.display = 'flex';
};

window.openDeleteLogModal = (k) => { deleteKey = k; deleteModal.style.display = 'flex'; };

window.updateLogSubject = (k, v) => { if (currentUser) db.ref('ajopaivakirja/' + currentUser.uid + '/' + k).update({ subject: v }); };

btnEditCancel.addEventListener('click', () => editModal.style.display = 'none');

btnEditSave.addEventListener('click', () => {
    const k = editKeyEl.value;
    const cId = editCarSelectEl.value;
    const c = userCars.find(x => x.id === cId);
    
    if (k && c) {
        db.ref('ajopaivakirja/' + currentUser.uid + '/' + k).update({
            subject: document.getElementById('edit-subject').value,
            carId: c.id, carName: c.name, carIcon: c.icon, carType: c.type
        }).then(() => editModal.style.display = 'none');
    }
});

// Kello ja Ajastin
document.addEventListener('DOMContentLoaded', () => {
    updateClockAndDate();
    setInterval(updateClockAndDate, 1000);
});

function updateClockAndDate() {
    const n = new Date();
    if(dashClockEl) dashClockEl.innerText = n.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if(dashDateEl) dashDateEl.innerText = n.toLocaleDateString('fi-FI', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function updateTimer() {
    if (!startTime) return;
    const n = new Date();
    const d = n - startTime - totalPauseTime;
    const m = Math.floor((d % 3600000) / 60000);
    const s = Math.floor((d % 60000) / 1000);
    const h = Math.floor(d / 3600000);
    dashTimeEl.innerText = (h > 0 ? h + ":" : "") + (m < 10 ? "0" : "") + m + ":" + (s < 10 ? "0" : "") + s;
}

// --- END OF FILE ---
