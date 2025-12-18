// ---------------------------------------------------------
// 1. FIREBASE KONFIGURAATIO
// ---------------------------------------------------------
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

// ---------------------------------------------------------
// 2. DOM ELEMENTIT (HTML-viittaukset)
// ---------------------------------------------------------
const splashScreen = document.getElementById('splash-screen');
const loginView = document.getElementById('login-view');
const appContainer = document.getElementById('app-container');

// Menu
const menuBtn = document.getElementById('btn-menu-toggle');
const mainMenu = document.getElementById('main-menu');
const menuUserName = document.getElementById('user-name');
const menuUserAvatar = document.getElementById('user-photo');

// Näkymät (Views)
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

// Modalit (Pop-up ikkunat)
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

// ---------------------------------------------------------
// 3. MUUTTUJAT JA TILA (STATE)
// ---------------------------------------------------------
let currentUser = null; 
let watchId = null;
let isGPSActive = false;
let isRecording = false; 
let isPaused = false; 
let isViewingHistory = false; // Estää kartan keskittämisen kun katsellaan historiaa

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

// Reittiviiva
let routePath = []; // Tallentaa {lat, lng, spd}
let realTimePolyline = null; // Sininen viiva ajon aikana
let savedRouteLayers = []; // Taulukko historian väriviivoille
let savedRouteLayer = null; // Vanhan version viiva

// Sää ja Ajotapa
let currentDriveWeather = ""; 
let aggressiveEvents = 0;
let lastMotionTime = 0;
let styleResetTimer = null; 

let allHistoryData = []; // KESKEINEN TIETOVARASTO

// Autotalli
let userCars = [];
let currentCarId = "all"; 
let currentCarType = "car"; 
const carSelectEl = document.getElementById('car-select');

// UI Elementit (Mittaristo)
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

const mapSpeedEl = document.getElementById('map-speed');
const mapCoordsEl = document.getElementById('map-coords');
const statusEl = document.getElementById('status');
const mapGpsToggle = document.getElementById('map-gps-toggle');
const mapLegend = document.getElementById('map-legend');

// Yhteenveto & Suodatus
const historySummaryEl = document.getElementById('history-summary');
const sumKmEl = document.getElementById('sum-km');
const sumCountEl = document.getElementById('sum-count');
const sumTimeEl = document.getElementById('sum-time');

const filterEl = document.getElementById('history-filter');
const customFilterContainer = document.getElementById('custom-filter-container');
const filterStart = document.getElementById('filter-start');
const filterEnd = document.getElementById('filter-end');

// Kontrollit (Start, Stop, Pause)
const btnStartRec = document.getElementById('btn-start-rec');
const activeRecBtns = document.getElementById('active-rec-btns');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnStopRec = document.getElementById('btn-stop-rec');


// ---------------------------------------------------------
// 4. AUTHENTICATION (KIRJAUTUMINEN)
// ---------------------------------------------------------
auth.onAuthStateChanged((user) => {
    if (splashScreen) {
        setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);
    }

    if (user) {
        currentUser = user;
        loginView.style.display = 'none';
        appContainer.style.display = 'flex';
        
        menuUserName.innerText = user.displayName || user.email;
        if (user.photoURL) {
            menuUserAvatar.src = user.photoURL;
        } else {
            menuUserAvatar.src = "ajopaivakirja_logo.png";
        }

        // TÄRKEÄÄ: Ladataan tiedot heti kun kirjaudutaan
        loadCars(); 
        loadHistory(); 
        generateCarIcons(); 

        if (views.map.style.display !== 'none') {
            setTimeout(() => map.invalidateSize(), 200);
        }
    } else {
        currentUser = null;
        if (appContainer.style.display !== 'flex') {
            appContainer.style.display = 'none';
            loginView.style.display = 'flex';
        }
    }
});

// Login painikkeet
document.getElementById('btn-login').addEventListener('click', () => {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
        .catch(e => alert(e.message));
});

document.getElementById('btn-email-login').addEventListener('click', () => {
    const email = document.getElementById('email-input').value;
    const pass = document.getElementById('password-input').value;
    if(!email || !pass) { 
        alert("Syötä sähköposti ja salasana."); 
        return; 
    }
    auth.signInWithEmailAndPassword(email, pass)
        .catch(e => alert("Virhe kirjautumisessa: " + e.message));
});

document.getElementById('btn-email-register').addEventListener('click', () => {
    const email = document.getElementById('email-input').value;
    const pass = document.getElementById('password-input').value;
    if(!email || !pass) { 
        alert("Syötä sähköposti ja salasana."); 
        return; 
    }
    auth.createUserWithEmailAndPassword(email, pass)
        .catch(e => alert("Virhe rekisteröinnissä: " + e.message));
});

document.getElementById('btn-logout').addEventListener('click', () => {
    if(confirm("Kirjaudu ulos?")) {
        auth.signOut().then(() => location.reload());
    }
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


// ---------------------------------------------------------
// 5. NAVIGAATIO & MENU
// ---------------------------------------------------------
menuBtn.addEventListener('click', () => {
    if (mainMenu.style.display === 'none') {
        mainMenu.style.display = 'flex';
    } else {
        mainMenu.style.display = 'none';
    }
});

document.getElementById('app-logo').addEventListener('click', () => {
    switchView('dashboard');
});

function switchView(viewName) {
    mainMenu.style.display = 'none';
    
    // Piilota kaikki näkymät ensin
    Object.values(views).forEach(el => el.style.display = 'none');
    
    // Poista aktiivinen luokka napeista
    Object.values(navBtns).forEach(btn => {
        if(btn) btn.classList.remove('active-menu');
    });

    // Näytä valittu
    if (viewName === 'dashboard' || viewName === 'map') {
        views[viewName].style.display = 'flex';
    } else {
        views[viewName].style.display = 'block';
    }
    
    if(navBtns[viewName]) navBtns[viewName].classList.add('active-menu');

    // Jos poistutaan kartalta, siivotaan tila
    if (viewName !== 'map') {
        clearSavedRoute(); // Poista väriviivat
        isViewingHistory = false;
        mapLegend.style.display = 'none';
    }

    if (viewName === 'map') {
        setTimeout(() => map.invalidateSize(), 100);
    }
    
    // Renderöi listat aina kun sivu avataan
    if (viewName === 'history') {
        renderHistoryList();
    }
    
    if (viewName === 'settings') {
        renderCarList();
    }
    
    if (viewName === 'stats') {
        renderStats();
    }
}

// Navigaatio napit
navBtns.dashboard.addEventListener('click', () => switchView('dashboard'));
navBtns.map.addEventListener('click', () => switchView('map'));
navBtns.history.addEventListener('click', () => switchView('history'));
navBtns.stats.addEventListener('click', () => switchView('stats'));
navBtns.settings.addEventListener('click', () => switchView('settings'));
navBtns.help.addEventListener('click', () => switchView('help'));

document.getElementById('side-tap-left').addEventListener('click', () => switchView('map'));
document.getElementById('map-return-btn').addEventListener('click', () => switchView('dashboard'));


// ---------------------------------------------------------
// 6. KARTTA (Leaflet)
// ---------------------------------------------------------
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '© OSM' });
const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { attribution: 'Tiles &copy; Esri' });
const terrainMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17, attribution: '© OpenTopoMap' });

const map = L.map('map', { center: [64.0, 26.0], zoom: 16, layers: [streetMap], zoomControl: false });
L.control.layers({ "Peruskartta": streetMap, "Satelliitti": satelliteMap, "Maastokartta": terrainMap }).addTo(map);

let marker = L.circleMarker([64.0, 26.0], { color: '#2979ff', fillColor: '#2979ff', fillOpacity: 0.8, radius: 8 }).addTo(map);

// Sininen viiva ajon aikaiseen piirtoon
realTimePolyline = L.polyline([], {color: '#2979ff', weight: 5, opacity: 0.7}).addTo(map);

// GPS Toggle Kartalla
mapGpsToggle.addEventListener('click', () => {
    isViewingHistory = !isViewingHistory;
    if(isViewingHistory) {
        mapGpsToggle.innerText = "📡 OFF";
        mapGpsToggle.classList.add('inactive');
    } else {
        mapGpsToggle.innerText = "📡 ON";
        mapGpsToggle.classList.remove('inactive');
        // Keskitä heti, jos sijainti on tiedossa
        if(lastLatLng) map.panTo([lastLatLng.lat, lastLatLng.lng]);
    }
});


// ---------------------------------------------------------
// 7. GPS & SEURANTA LOGIIKKA
// ---------------------------------------------------------
document.getElementById('btn-activate-gps').addEventListener('click', () => {
    if (!isGPSActive) {
        startGPS();
        document.getElementById('btn-activate-gps').style.display = 'none';
        document.getElementById('rec-controls').style.display = 'flex';
        statusEl.innerText = "GPS Päällä";
    }
});

btnStartRec.addEventListener('click', () => {
    // Kiihtyvyysanturin lupa (iOS vaatii)
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === 'granted') window.addEventListener('devicemotion', handleMotion);
        }).catch(console.error);
    } else {
        window.addEventListener('devicemotion', handleMotion);
    }

    isRecording = true;
    isPaused = false;
    isViewingHistory = false; // Pakota GPS-seuranta päälle
    mapGpsToggle.innerText = "📡 ON";
    mapGpsToggle.classList.remove('inactive');

    startTime = new Date();
    totalPauseTime = 0;
    maxSpeed = 0;
    totalDistance = 0;
    
    // Nollaa reittidatat
    routePath = [];
    realTimePolyline.setLatLngs([]);
    clearSavedRoute();
    
    currentDriveWeather = "";
    aggressiveEvents = 0;
    
    updateDashboardUI(0, 0, 0, 0, 0, 0);
    
    if (currentCarType === 'bike') {
        liveStatusBar.style.opacity = '0';
    } else {
        liveStatusBar.style.opacity = '1'; 
        liveStyleEl.innerText = "Taloudellinen";
        liveStyleEl.className = "style-badge style-green";
    }
    
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
    window.removeEventListener('devicemotion', handleMotion);
    
    if (isPaused && pauseStartTime) {
        totalPauseTime += (new Date() - pauseStartTime);
    }

    const endTime = new Date();
    const activeDurationMs = (endTime - startTime) - totalPauseTime;
    const durationHours = activeDurationMs / (1000 * 60 * 60);
    let avgSpeed = durationHours > 0 ? (totalDistance / durationHours) : 0;

    let styleLabel = "";
    if (currentCarType !== 'bike') {
        styleLabel = "Tasainen";
        if (aggressiveEvents > 5) styleLabel = "Reipas";
        if (aggressiveEvents > 15) styleLabel = "Aggressiivinen";
    }

    let selectedCarName = "Muu ajoneuvo";
    let selectedCarIcon = "🚗";
    if (currentCarId !== 'all') {
        const c = userCars.find(x => x.id === currentCarId);
        if(c) {
            selectedCarName = c.name;
            selectedCarIcon = c.icon || (c.type === 'bike' ? "🚲" : "🚗");
        }
    }

    tempDriveData = {
        type: 'end_drive',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        distanceKm: totalDistance.toFixed(2),
        maxSpeed: maxSpeed.toFixed(1),
        avgSpeed: avgSpeed.toFixed(1),
        durationMs: activeDurationMs,
        subject: "",
        weather: currentDriveWeather,
        drivingStyle: styleLabel,
        carName: selectedCarName,
        carIcon: selectedCarIcon, 
        carId: currentCarId,
        carType: currentCarType,
        route: routePath // TALLENNA REITTI TIETOKANTAAN
    };

    const mins = Math.floor(activeDurationMs / 60000);
    modalDistEl.innerText = totalDistance.toFixed(2) + " km";
    modalTimeEl.innerText = mins + " min";
    modalSubjectEl.value = ""; 
    modalCarNameEl.innerText = selectedCarName; 

    saveModal.style.display = 'flex';
    modalSubjectEl.focus();
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

function resetRecordingUI() {
    isRecording = false;
    isPaused = false;
    tempDriveData = null;
    routePath = [];
    realTimePolyline.setLatLngs([]);

    btnStartRec.style.display = 'inline-block';
    activeRecBtns.style.display = 'none';
    statusEl.innerText = "GPS Päällä";
    statusEl.style.color = "var(--subtext-color)";
    updateDashboardUI(0, 0, 0, 0, 0, 0);
    dashTimeEl.innerText = "00:00";
    liveStatusBar.style.opacity = '0'; 
}

function stopGPSAndRec() {
    isRecording = false;
    isPaused = false;
    clearInterval(timerInterval);
    isGPSActive = false;
    navigator.geolocation.clearWatch(watchId);
    window.removeEventListener('devicemotion', handleMotion);
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
    const heading = position.coords.heading; 
    const speedMs = position.coords.speed || 0; 
    let speedKmh = speedMs * 3.6;
    if (speedKmh < 1.0) speedKmh = 0;

    let currentAvg = 0;

    if (currentDriveWeather === "") {
        fetchWeather(lat, lng);
    }

    if (isRecording && !isPaused) {
        if (speedKmh > maxSpeed) maxSpeed = speedKmh;
        if (lastLatLng) {
            const dist = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
            // WhatsApp-korjaus: Sallitaan 50km hyppy
            if ((speedKmh > 3 || dist > 0.02) && dist < 50.0) totalDistance += dist;
        }
        
        // Tallenna reittipiste (LAT, LNG, SPEED)
        if (speedKmh > 3 || (lastLatLng && getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng) > 0.02)) {
            routePath.push({ lat: lat, lng: lng, spd: speedKmh });
            
            // Piirrä live-viivaa
            realTimePolyline.addLatLng([lat, lng]);
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
        
        // Keskitä kartta VAIN JOS emme katsele historiaa
        if (views.map.style.display !== 'none' && !isViewingHistory) {
            
            // ZOOM Logiikka
            let targetZoom = 18; 
            if (currentCarType === 'bike') {
                if (speedKmh > 15) targetZoom = 17; 
                else targetZoom = 19; 
            } else {
                if (speedKmh > 100) targetZoom = 14; 
                else if (speedKmh > 70) targetZoom = 16;
                else if (speedKmh > 40) targetZoom = 17;
                else targetZoom = 18;
            }
            
            if (map.getZoom() !== targetZoom) map.setView(newLatLng, targetZoom); else map.panTo(newLatLng);
        }
        mapSpeedEl.innerText = speedKmh.toFixed(1);
        mapCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    }

    updateDashboardUI(speedKmh, maxSpeed, totalDistance, null, alt, currentAvg);
    dashCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    
    if (heading !== null && !isNaN(heading) && speedKmh > 3) {
        dashHeadingEl.innerText = `${getCardinalDirection(heading)} ${Math.round(heading)}°`;
    } else if (dashHeadingEl.innerText === "--") {
        dashHeadingEl.innerText = "--";
    }

    if (isGPSActive && wakeLock === null) requestWakeLock();
}

function getCardinalDirection(angle) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(angle / 45) % 8];
}

function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&wind_speed_unit=ms`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.current) {
                const temp = Math.round(data.current.temperature_2m);
                const code = data.current.weather_code;
                let emoji = "☁️";
                if (code === 0) emoji = "☀️";
                else if (code <= 3) emoji = "⛅";
                else if (code <= 48) emoji = "🌫";
                else if (code <= 67) emoji = "🌧";
                else if (code <= 77) emoji = "❄️";
                else if (code <= 82) emoji = "🌧";
                else if (code <= 86) emoji = "❄️";
                else emoji = "⛈";
                
                currentDriveWeather = `${emoji} ${temp}°C`;
                dashWeatherEl.innerText = currentDriveWeather;
            }
        })
        .catch(e => console.error(e));
}

function handleMotion(event) {
    if (!isRecording || isPaused) return;
    if (currentCarType === 'bike') return;

    const now = Date.now();
    if (now - lastMotionTime < 500) return; 
    lastMotionTime = now;
    const acc = event.acceleration; 
    if (!acc) return;
    const magnitude = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
    
    if (magnitude > 3.5) {
        aggressiveEvents++;
        liveStyleEl.innerText = "Kiihdytys!";
        liveStyleEl.className = "style-badge style-red";
        
        dashSpeedEl.style.color = "#ff1744";
        
        if (styleResetTimer) clearTimeout(styleResetTimer);
        styleResetTimer = setTimeout(() => {
            liveStyleEl.innerText = "Taloudellinen";
            liveStyleEl.className = "style-badge style-green";
            dashSpeedEl.style.color = "var(--speed-color)";
        }, 3000);
    }
}

// ---------------------------------------------------------
// 8. TILASTOT (GRAAFIT)
// ---------------------------------------------------------
let chartInstanceMonthly = null;
let chartInstanceVehicles = null;

function renderStats() {
    if (!allHistoryData || allHistoryData.length === 0) return;

    const monthlyData = {};
    const vehicleData = {};

    allHistoryData.forEach(d => {
        const dist = parseFloat(d.distanceKm) || 0;
        const date = new Date(d.startTime);
        
        const monthKey = `${date.getMonth()+1}/${date.getFullYear()}`;
        if (!monthlyData[monthKey]) monthlyData[monthKey] = 0;
        monthlyData[monthKey] += dist;

        const carName = `${d.carIcon || "🚗"} ${d.carName || "Muu"}`;
        
        if (!vehicleData[carName]) vehicleData[carName] = 0;
        vehicleData[carName] += dist;
    });

    const monthLabels = Object.keys(monthlyData).reverse().slice(0, 6).reverse(); 
    const monthValues = monthLabels.map(k => monthlyData[k].toFixed(1));
    const vehicleLabels = Object.keys(vehicleData);
    const vehicleValues = Object.values(vehicleData).map(v => v.toFixed(1));

    const ctxMonthly = document.getElementById('chart-monthly').getContext('2d');
    if (chartInstanceMonthly) chartInstanceMonthly.destroy();
    
    chartInstanceMonthly = new Chart(ctxMonthly, {
        type: 'bar',
        data: {
            labels: monthLabels,
            datasets: [{
                label: 'Kilometrit',
                data: monthValues,
                backgroundColor: 'rgba(41, 121, 255, 0.6)',
                borderColor: 'rgba(41, 121, 255, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: { y: { beginAtZero: true } },
            plugins: { legend: { display: false } }
        }
    });

    const ctxVehicles = document.getElementById('chart-vehicles').getContext('2d');
    if (chartInstanceVehicles) chartInstanceVehicles.destroy();
    
    chartInstanceVehicles = new Chart(ctxVehicles, {
        type: 'doughnut',
        data: {
            labels: vehicleLabels,
            datasets: [{
                data: vehicleValues,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)',
                    'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)'
                ],
                borderWidth: 1
            }]
        }
    });
}

// ---------------------------------------------------------
// 9. AUTOTALLI LOGIIKKA
// ---------------------------------------------------------
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
        
        if (views.settings.style.display !== 'none') {
            renderCarList(); 
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
    if (c) {
        currentCarType = c.type || "car";
    } else {
        currentCarType = "car";
    }
}

function updateCarSelect() {
    carSelectEl.innerHTML = "";
    
    const allOpt = document.createElement('option');
    allOpt.value = 'all';
    allOpt.text = "Kaikki ajoneuvot";
    carSelectEl.appendChild(allOpt);

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
    
    if (views.history.style.display !== 'none') {
        renderHistoryList();
    }
});

function renderCarList() {
    const list = document.getElementById('cars-list');
    list.innerHTML = "";
    
    if (userCars.length === 0) {
        list.innerHTML = "<p>Ei ajoneuvoja. Lisää ensimmäinen!</p>";
        return;
    }
    
    userCars.forEach(car => {
        const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
        const div = document.createElement('div');
        div.className = 'car-item';
        div.innerHTML = `
            <div>
                <div class="car-title">${icon} ${car.name}</div>
                <div class="car-details">${car.plate || ''} ${car.fuel || ''}</div>
            </div>
            <div class="car-actions">
                <button class="edit-btn" onclick="window.editCar('${car.id}')">✏️</button>
                <button class="delete-btn" onclick="window.deleteCar('${car.id}')">🗑</button>
            </div>
        `;
        list.appendChild(div);
    });
}

// UUSI: MUOKKAA AUTOA
window.editCar = (id) => {
    const car = userCars.find(c => c.id === id);
    if(!car) return;
    
    // Täytä lomake
    document.getElementById('car-id').value = car.id;
    document.getElementById('car-name').value = car.name;
    document.getElementById('car-type').value = car.type;
    
    const icon = car.icon || "🚗";
    document.getElementById('selected-car-icon').value = icon;
    
    const options = document.querySelectorAll('.car-icon-option');
    options.forEach(opt => {
        opt.classList.remove('selected-icon');
        if(opt.innerText === icon) opt.classList.add('selected-icon');
    });

    toggleCarFields();
    
    if(car.type === 'car') {
        document.getElementById('car-plate').value = car.plate || '';
        document.getElementById('car-fuel').value = car.fuel || 'Bensiini';
        document.getElementById('car-tank').value = car.tank || '';
    }
    
    document.getElementById('form-title').innerText = "Muokkaa ajoneuvoa";
    addCarForm.style.display = 'block';
    btnAddCar.style.display = 'none';
}

const addCarForm = document.getElementById('add-car-form');
const btnAddCar = document.getElementById('btn-add-car');
const btnCancelCar = document.getElementById('btn-cancel-car');
const btnSaveCar = document.getElementById('btn-save-car');
const carTypeSelect = document.getElementById('car-type');
const carSpecificFields = document.getElementById('car-specific-fields');

window.toggleCarFields = () => {
    if (carTypeSelect.value === 'bike') {
        carSpecificFields.style.display = 'none';
    } else {
        carSpecificFields.style.display = 'block';
    }
};

btnAddCar.addEventListener('click', () => {
    // Resetoi lomake
    document.getElementById('car-id').value = '';
    document.getElementById('car-name').value = '';
    document.getElementById('car-plate').value = '';
    document.getElementById('car-tank').value = '';
    document.getElementById('selected-car-icon').value = '🚗';
    document.getElementById('form-title').innerText = "Lisää ajoneuvo";
    
    document.querySelectorAll('.car-icon-option').forEach(el => el.classList.remove('selected-icon'));
    
    addCarForm.style.display = 'block';
    btnAddCar.style.display = 'none';
    carTypeSelect.value = 'car';
    toggleCarFields();
});

btnCancelCar.addEventListener('click', () => {
    addCarForm.style.display = 'none';
    btnAddCar.style.display = 'block';
});

btnSaveCar.addEventListener('click', () => {
    const name = document.getElementById('car-name').value;
    if (!name) { alert("Anna ajoneuvolle nimi!"); return; }
    
    const type = carTypeSelect.value;
    const id = document.getElementById('car-id').value;
    const icon = document.getElementById('selected-car-icon').value;
    
    const carData = {
        name: name,
        type: type,
        icon: icon,
        plate: (type === 'car') ? document.getElementById('car-plate').value : "",
        fuel: (type === 'car') ? document.getElementById('car-fuel').value : "",
        tank: (type === 'car') ? document.getElementById('car-tank').value : ""
    };
    
    if (id) {
        // PÄIVITYS
        db.ref('users/' + currentUser.uid + '/cars/' + id).update(carData)
            .then(() => {
                addCarForm.style.display = 'none';
                btnAddCar.style.display = 'block';
            });
    } else {
        // UUSI
        db.ref('users/' + currentUser.uid + '/cars').push().set(carData)
            .then(() => {
                addCarForm.style.display = 'none';
                btnAddCar.style.display = 'block';
            });
    }
});

window.deleteCar = (id) => {
    if(confirm("Poista ajoneuvo?")) db.ref('users/' + currentUser.uid + '/cars/' + id).remove();
};

// GENERATE ICONS
const carIconsList = ["🚗", "🚙", "🛻", "🚌", "🏎️", "🚕", "🚓", "🚑", "🚒", "🚐", "🚚", "🚜", "🏍️", "🛵", "🚲", "🛴"];

function generateCarIcons() {
    const grid = document.getElementById('car-icon-selector');
    if(!grid) return;
    
    grid.innerHTML = "";
    carIconsList.forEach(icon => {
        const div = document.createElement('div');
        div.className = 'car-icon-option';
        div.innerText = icon;
        div.onclick = () => selectIcon(div, icon);
        grid.appendChild(div);
    });
}

function selectIcon(element, icon) {
    document.querySelectorAll('.car-icon-option').forEach(el => el.classList.remove('selected-icon'));
    element.classList.add('selected-icon');
    document.getElementById('selected-car-icon').value = icon;
}


// ---------------------------------------------------------
// 10. HISTORIA & LATAUS
// ---------------------------------------------------------
filterEl.addEventListener('change', () => {
    if (filterEl.value === 'custom') {
        customFilterContainer.style.display = 'block';
    } else {
        customFilterContainer.style.display = 'none';
        renderHistoryList();
    }
});

filterStart.addEventListener('change', renderHistoryList);
filterEnd.addEventListener('change', renderHistoryList);

function loadHistory() {
    if (!currentUser) return;
    
    db.ref('ajopaivakirja/' + currentUser.uid).off();
    const historyRef = db.ref('ajopaivakirja/' + currentUser.uid).limitToLast(300);

    historyRef.on('value', (snapshot) => {
        allHistoryData = [];
        
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                if (data && typeof data === 'object') {
                    allHistoryData.push({ key: child.key, ...data });
                }
            });
        }

        allHistoryData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        
        populateFilter();
        
        if (views.history.style.display !== 'none') {
            renderHistoryList();
        }
        
        if (views.stats.style.display !== 'none') {
            renderStats();
        }
    });
}

function populateFilter() {
    const currentVal = filterEl.value;
    filterEl.innerHTML = `
        <option value="all">Kaikki ajot</option>
        <option value="custom">Mukautettu aikaväli...</option>
    `;
    
    const periods = new Set();
    
    allHistoryData.forEach(drive => {
        if (drive.startTime) {
            const d = new Date(drive.startTime);
            if (!isNaN(d.getTime())) {
                const yearKey = "YEAR-" + d.getFullYear();
                periods.add(JSON.stringify({key: yearKey, label: "Vuosi " + d.getFullYear(), sort: d.getFullYear() * 100}));

                const monthKey = d.getFullYear() + '-' + (d.getMonth() + 1);
                const monthLabel = d.toLocaleString('fi-FI', { month: 'long', year: 'numeric' });
                const finalMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
                periods.add(JSON.stringify({key: monthKey, label: finalMonthLabel, sort: d.getFullYear() * 100 + (d.getMonth() + 1)}));
            }
        }
    });

    const sortedPeriods = Array.from(periods).map(p => JSON.parse(p)).sort((a, b) => b.sort - a.sort);

    sortedPeriods.forEach(p => {
        const option = document.createElement('option');
        option.value = p.key;
        option.innerText = p.label;
        filterEl.appendChild(option);
    });

    if (currentVal && Array.from(filterEl.options).some(o => o.value === currentVal)) {
        filterEl.value = currentVal;
        if(currentVal === 'custom') customFilterContainer.style.display = 'block';
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

    const selectedFilter = filterEl.value;
    let renderCount = 0;
    let totalKm = 0;
    let totalMs = 0;

    allHistoryData.forEach(drive => {
        try {
            if (currentCarId !== 'all') {
                if (drive.carId && drive.carId !== currentCarId) return;
                if (!drive.carId) return;
            }

            let start = new Date(drive.startTime);
            if (isNaN(start.getTime())) return;

            // Aikavälisuodatus
            if (selectedFilter !== 'all') {
                if (selectedFilter === 'custom') {
                    const startInput = filterStart.value;
                    const endInput = filterEnd.value;
                    if (startInput && endInput) {
                        const sDate = new Date(startInput);
                        const eDate = new Date(endInput);
                        eDate.setHours(23, 59, 59, 999);
                        if (start < sDate || start > eDate) return;
                    }
                } else if (selectedFilter.startsWith("YEAR-")) {
                    const year = selectedFilter.split("-")[1];
                    if (start.getFullYear().toString() !== year) return;
                } else {
                    const monthKey = start.getFullYear() + '-' + (start.getMonth() + 1);
                    if (monthKey !== selectedFilter) return;
                }
            }

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
            
            const dist = parseFloat(drive.distanceKm) || 0;
            totalKm += dist;
            totalMs += durationMs;

            let mapBtn = "";
            if (drive.route && drive.route.length > 0) {
                // TÄRKEÄ: Nyt funktio on window-objektissa
                mapBtn = `<button class="map-btn" onclick="window.showRouteOnMap('${drive.key}')" title="Näytä reitti">🗺️</button>`;
            }

            const icon = drive.carIcon || (drive.carType === 'bike' ? "🚲" : "🚗");
            let dateStr = start.toLocaleDateString('fi-FI') + ' ' + start.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});

            const card = document.createElement('div');
            card.className = 'log-card';
            card.innerHTML = `
                <div class="log-header">
                    <div class="log-date">${dateStr}</div>
                    <div style="display:flex; align-items:center;">
                        ${mapBtn}
                        <button class="edit-btn" onclick="window.openEditLogModal('${drive.key}')">✏️</button>
                        <button class="delete-btn" onclick="window.openDeleteLogModal('${drive.key}')">🗑</button>
                    </div>
                </div>
                <div class="log-tags">
                    ${drive.carName ? `<span class="tag">${icon} ${drive.carName}</span>` : ''}
                    ${drive.weather ? `<span class="tag">🌡️ ${drive.weather}</span>` : ''}
                    ${drive.drivingStyle ? `<span class="tag">🏎️ ${drive.drivingStyle}</span>` : ''}
                </div>
                <div class="log-stats">
                    <div><span class="stat-label">KM</span>${drive.distanceKm || "0.00"}</div>
                    <div><span class="stat-label">AIKA</span>${durationMinutes} min</div>
                    <div><span class="stat-label">MAX</span>${drive.maxSpeed || "0"}</div>
                    <div><span class="stat-label">Ø KM/H</span>${drive.avgSpeed || "-"}</div>
                </div>
                <input type="text" class="subject-input" placeholder="Kirjoita aihe..." value="${drive.subject || ""}" onchange="window.updateLogSubject('${drive.key}', this.value)">
            `;
            logList.appendChild(card);
            renderCount++;

        } catch (err) { console.error(err); }
    });

    if (renderCount === 0) {
        logList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei ajoja.</p>";
        historySummaryEl.style.display = 'none';
    } else {
        sumKmEl.innerText = totalKm.toFixed(1);
        sumCountEl.innerText = renderCount;
        
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        sumTimeEl.innerText = `${h}h ${m}min`;
        
        historySummaryEl.style.display = 'flex';
    }
}

// ---------------------------------------------------------
// 11. GLOBAL FUNCTIONS (WINDOW) - Nappeja varten
// ---------------------------------------------------------

window.showRouteOnMap = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive || !drive.route) { alert("Ei reittidataa."); return; }

    clearSavedRoute();
    
    // Aktivoi katselutila
    isViewingHistory = true; 
    mapGpsToggle.innerText = "📡 OFF";
    mapGpsToggle.classList.add('inactive');
    mapLegend.style.display = 'flex';

    // Tarkista formaatti
    const isNewFormat = (drive.route.length > 0 && typeof drive.route[0] === 'object' && drive.route[0].lat);

    if (isNewFormat) {
        // UUSI VÄRILLINEN
        for (let i = 0; i < drive.route.length - 1; i++) {
            const p1 = drive.route[i];
            const p2 = drive.route[i+1];
            
            const color = getSpeedColor(p1.spd || 0, drive.carType);
            
            const segment = L.polyline([[p1.lat, p1.lng], [p2.lat, p2.lng]], {
                color: color, 
                weight: 5, 
                opacity: 0.8
            }).addTo(map);
            
            savedRouteLayers.push(segment);
        }
        const bounds = L.latLngBounds(drive.route.map(p => [p.lat, p.lng]));
        map.fitBounds(bounds, {padding: [50, 50]});
        
    } else {
        // VANHA ORANSSI
        savedRouteLayer = L.polyline(drive.route, {color: '#ff9100', weight: 5, opacity: 0.8}).addTo(map);
        map.fitBounds(savedRouteLayer.getBounds(), {padding: [50, 50]});
    }
    
    switchView('map');
};

window.openEditLogModal = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive) return;

    editKeyEl.value = key;
    document.getElementById('edit-subject').value = drive.subject || "";
    
    editCarSelectEl.innerHTML = "";
    userCars.forEach(car => {
        const opt = document.createElement('option');
        opt.value = car.id;
        const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
        opt.text = `${icon} ${car.name}`;
        if(drive.carId === car.id) opt.selected = true;
        editCarSelectEl.appendChild(opt);
    });

    editModal.style.display = 'flex';
};

window.openDeleteLogModal = (key) => {
    deleteKey = key;
    deleteModal.style.display = 'flex';
};

window.updateLogSubject = (key, text) => { 
    if(currentUser) db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update({ subject: text }); 
};

// Modal napit
btnEditCancel.addEventListener('click', () => {
    editModal.style.display = 'none';
});

btnEditSave.addEventListener('click', () => {
    const key = editKeyEl.value;
    const newCarId = editCarSelectEl.value;
    const carObj = userCars.find(c => c.id === newCarId);
    
    if (key && currentUser && carObj) {
        db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update({
            subject: document.getElementById('edit-subject').value,
            carId: carObj.id,
            carName: carObj.name,
            carIcon: carObj.icon || "🚗",
            carType: carObj.type
        }).then(() => {
            editModal.style.display = 'none';
        });
    }
});

btnDeleteCancel.addEventListener('click', () => {
    deleteModal.style.display = 'none';
    deleteKey = null;
});

btnDeleteConfirm.addEventListener('click', () => {
    if (deleteKey && currentUser) {
        db.ref('ajopaivakirja/' + currentUser.uid + '/' + deleteKey).remove();
        deleteModal.style.display = 'none';
        deleteKey = null;
    }
});

// ---------------------------------------------------------
// 12. APUFUNKTIOT
// ---------------------------------------------------------

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

function getSpeedColor(speed, type) {
    let max = (type === 'bike') ? 30 : 100;
    
    if (speed <= 3) return '#2979ff'; // Sininen (Hidas)
    
    let ratio = speed / max;
    if (ratio > 1) ratio = 1;

    if (ratio < 0.33) return '#00e676'; // Vihreä
    if (ratio < 0.66) return '#ffea00'; // Keltainen
    return '#ff1744'; // Punainen
}

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
