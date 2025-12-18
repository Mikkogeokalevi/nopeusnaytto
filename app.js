// =========================================================
// 1. FIREBASE KONFIGURAATIO JA ALUSTUS
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

// Tarkistetaan, onko Firebase jo alustettu
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Otetaan tietokanta ja autentikaatio käyttöön
const db = firebase.database();
const auth = firebase.auth(); 


// =========================================================
// 2. DOM ELEMENTTIEN HAKU (Käyttöliittymä)
// =========================================================

// Päänäkymät
const splashScreen = document.getElementById('splash-screen');
const loginView = document.getElementById('login-view');
const appContainer = document.getElementById('app-container');

// Menu-elementit
const menuBtn = document.getElementById('btn-menu-toggle');
const mainMenu = document.getElementById('main-menu');
const menuUserName = document.getElementById('user-name');
const menuUserAvatar = document.getElementById('user-photo');

// Näkymät (Views) - Nämä ovat eri "sivut" sovelluksessa
const views = {
    dashboard: document.getElementById('dashboard-view'),
    map: document.getElementById('map-view'),
    history: document.getElementById('history-view'),
    stats: document.getElementById('stats-view'),
    settings: document.getElementById('settings-view'),
    help: document.getElementById('help-view')
};

// Navigaationapit (Menuvalikko)
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

// UUSI: TANKKAUS MODAALI
const refuelModal = document.getElementById('refuel-modal');
const btnRefuelSave = document.getElementById('btn-refuel-save');
const btnRefuelCancel = document.getElementById('btn-refuel-cancel');
const btnRefuelDelete = document.getElementById('btn-refuel-delete');


// =========================================================
// 3. MUUTTUJAT JA SOVELLUKSEN TILA
// =========================================================

// Käyttäjä ja GPS tila
let currentUser = null; 
let watchId = null;
let isGPSActive = false;
let isRecording = false; 
let isPaused = false; 
let isViewingHistory = false; // Tärkeä: Estää kartan automaattisen keskityksen katselutilassa

let wakeLock = null; // Näytön hereillä pito

// Ajanotto ja matka
let startTime = null;
let pauseStartTime = null; 
let totalPauseTime = 0;    
let timerInterval = null;

// Väliaikaiset tallennustiedot
let tempDriveData = null; 
let deleteKey = null;
let refuelKey = null; // Käytetään tankkauksen muokkauksessa

// Ajodata
let maxSpeed = 0;
let totalDistance = 0;
let lastLatLng = null;

// Reittiviiva ja piirto
let routePath = []; // Tallentaa objektit: {lat, lng, spd}
let realTimePolyline = null; // Sininen viiva (live-piirto)
let savedRouteLayers = []; // Taulukko historian väriviivoille (segmentit)
let savedRouteLayer = null; // Vanhan version viiva (yhteensopivuus)

// Sää ja Ajotapa
let currentDriveWeather = ""; 
let aggressiveEvents = 0;
let lastMotionTime = 0;
let styleResetTimer = null; 

// Historia-data muistissa
let allHistoryData = []; 
let allRefuelData = []; // UUSI: Tankkausdata muistissa

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

// Kartta UI
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

// Kontrollipainikkeet (Start, Stop, Pause)
const btnStartRec = document.getElementById('btn-start-rec');
const activeRecBtns = document.getElementById('active-rec-btns');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnStopRec = document.getElementById('btn-stop-rec');


// =========================================================
// 4. AUTHENTICATION (KIRJAUTUMINEN)
// =========================================================

// Kuunnellaan kirjautumistilan muutoksia
auth.onAuthStateChanged((user) => {
    // Piilotetaan latausruutu viiveellä
    if (splashScreen) {
        setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);
    }

    if (user) {
        // Käyttäjä on kirjautunut
        currentUser = user;
        loginView.style.display = 'none';
        appContainer.style.display = 'flex';
        
        // Päivitetään valikon tiedot
        menuUserName.innerText = user.displayName || user.email;
        if (user.photoURL) {
            menuUserAvatar.src = user.photoURL;
        } else {
            menuUserAvatar.src = "ajopaivakirja_logo.png";
        }

        // TÄRKEÄÄ: Ladataan tiedot heti kun kirjaudutaan sisään
        loadCars(); 
        loadHistory(); 
        generateCarIcons(); 

        // Korjataan kartan koko jos se on piilossa lataushetkellä
        if (views.map.style.display !== 'none') {
            setTimeout(() => map.invalidateSize(), 200);
        }
    } else {
        // Käyttäjä ei ole kirjautunut
        currentUser = null;
        if (appContainer.style.display !== 'flex') {
            appContainer.style.display = 'none';
            loginView.style.display = 'flex';
        }
    }
});

// Kirjautumispainikkeiden toiminnot
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
    if(confirm("Haluatko varmasti kirjautua ulos?")) {
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


// =========================================================
// 5. NAVIGAATIO & MENU
// =========================================================

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

// --- UUSI TANKKAUSNAPPI DASHBOARDISSA ---
// Tämä lisättiin versioon 4.9
const quickRefuelBtn = document.getElementById('btn-quick-refuel');
if (quickRefuelBtn) {
    quickRefuelBtn.addEventListener('click', () => {
        // Debug
        console.log("Quick refuel clicked. Current Car ID:", currentCarId);
        
        if(currentCarId === 'all') {
            alert("Valitse ensin auto yläpalkin valikosta, jotta tankkaus voidaan kirjata sille!");
        } else {
            // Varmistetaan että funktio löytyy window-objektista
            if (typeof window.openRefuelModal === 'function') {
                window.openRefuelModal(currentCarId);
            } else {
                console.error("openRefuelModal function not found on window object!");
                alert("Virhe: Tankkaus-ikkunaa ei voitu avata. Kokeile ladata sivu uudelleen.");
            }
        }
    });
}

// Päänäkymän vaihtaja
function switchView(viewName) {
    mainMenu.style.display = 'none';
    
    // Piilota kaikki näkymät ensin
    Object.values(views).forEach(el => {
        el.style.display = 'none';
    });
    
    // Poista aktiivinen luokka napeista
    Object.values(navBtns).forEach(btn => {
        if(btn) btn.classList.remove('active-menu');
    });

    // Näytä valittu näkymä (flex mittaristolle/kartalle, block muille)
    if (viewName === 'dashboard' || viewName === 'map') {
        views[viewName].style.display = 'flex';
    } else {
        views[viewName].style.display = 'block';
    }
    
    if(navBtns[viewName]) {
        navBtns[viewName].classList.add('active-menu');
    }

    // Jos poistutaan kartalta, siivotaan tila
    if (viewName !== 'map') {
        clearSavedRoute(); // Poista väriviivat kartalta
        isViewingHistory = false;
        mapLegend.style.display = 'none';
    }

    // Jos tullaan kartalle, korjataan sen koko
    if (viewName === 'map') {
        setTimeout(() => map.invalidateSize(), 100);
    }
    
    // Päivitetään listat tarvittaessa
    if (viewName === 'history') {
        // Oletuksena näytetään ajot, jos ei muuta valittu
        if(typeof window.switchHistoryTab === 'function') {
            window.switchHistoryTab('drives');
        }
    }
    
    if (viewName === 'settings') {
        renderCarList();
    }
    
    if (viewName === 'stats') {
        renderStats();
    }
}

// Navigaationapit tapahtumankuuntelijat
navBtns.dashboard.addEventListener('click', () => switchView('dashboard'));
navBtns.map.addEventListener('click', () => switchView('map'));
navBtns.history.addEventListener('click', () => switchView('history'));
navBtns.stats.addEventListener('click', () => switchView('stats'));
navBtns.settings.addEventListener('click', () => switchView('settings'));
navBtns.help.addEventListener('click', () => switchView('help'));

document.getElementById('side-tap-left').addEventListener('click', () => switchView('map'));
document.getElementById('map-return-btn').addEventListener('click', () => switchView('dashboard'));


// =========================================================
// 6. KARTTA (Leaflet)
// =========================================================

// Määritellään karttatasot
const streetMap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
    maxZoom: 19, 
    attribution: '© OSM' 
});
const satelliteMap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { 
    attribution: 'Tiles &copy; Esri' 
});
const terrainMap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { 
    maxZoom: 17, 
    attribution: '© OpenTopoMap' 
});

// Luodaan kartta
const map = L.map('map', { 
    center: [64.0, 26.0], 
    zoom: 16, 
    layers: [streetMap], 
    zoomControl: false 
});

// Lisätään tasovalitsin
L.control.layers({ 
    "Peruskartta": streetMap, 
    "Satelliitti": satelliteMap, 
    "Maastokartta": terrainMap 
}).addTo(map);

// Oma sijainti -merkki (sininen pallo)
let marker = L.circleMarker([64.0, 26.0], { 
    color: '#2979ff', 
    fillColor: '#2979ff', 
    fillOpacity: 0.8, 
    radius: 8 
}).addTo(map);

// Sininen viiva ajon aikaiseen "live"-piirtoon
realTimePolyline = L.polyline([], {
    color: '#2979ff', 
    weight: 5, 
    opacity: 0.7
}).addTo(map);

// GPS Toggle Kartalla (ON/OFF)
mapGpsToggle.addEventListener('click', () => {
    isViewingHistory = !isViewingHistory;
    
    if(isViewingHistory) {
        // GPS pois päältä kartalla (katselutila)
        mapGpsToggle.innerText = "📡 OFF";
        mapGpsToggle.classList.add('inactive');
    } else {
        // GPS päälle kartalla (seurantatila)
        mapGpsToggle.innerText = "📡 ON";
        mapGpsToggle.classList.remove('inactive');
        
        // Keskitä heti, jos sijainti on tiedossa
        if(lastLatLng) {
            map.panTo([lastLatLng.lat, lastLatLng.lng]);
        }
    }
});


// =========================================================
// 7. GPS & SEURANTA LOGIIKKA
// =========================================================

// Aktivointinappi (jos ei tallenneta vielä)
document.getElementById('btn-activate-gps').addEventListener('click', () => {
    if (!isGPSActive) {
        startGPS();
        document.getElementById('btn-activate-gps').style.display = 'none';
        document.getElementById('rec-controls').style.display = 'flex';
        statusEl.innerText = "GPS Päällä";
    }
});

// ALOITA TALLENNUS
btnStartRec.addEventListener('click', () => {
    // Kiihtyvyysanturin lupa (iOS vaatii erillisen pyynnön)
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === 'granted') {
                window.addEventListener('devicemotion', handleMotion);
            }
        }).catch(console.error);
    } else {
        window.addEventListener('devicemotion', handleMotion);
    }

    isRecording = true;
    isPaused = false;
    isViewingHistory = false; // Pakota GPS-seuranta päälle
    mapGpsToggle.innerText = "📡 ON";
    mapGpsToggle.classList.remove('inactive');

    // Nollataan muuttujat
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
    
    // Eco-mittarin logiikka
    if (currentCarType === 'bike') {
        liveStatusBar.style.opacity = '0';
    } else {
        liveStatusBar.style.opacity = '1'; 
        liveStyleEl.innerText = "Taloudellinen";
        liveStyleEl.className = "style-badge style-green";
    }
    
    // Päivitä napit
    btnStartRec.style.display = 'none';
    activeRecBtns.style.display = 'flex';
    btnPause.style.display = 'inline-block';
    btnResume.style.display = 'none';
    
    statusEl.innerText = "🔴 TALLENNETAAN";
    statusEl.style.color = "#ff4444";
    timerInterval = setInterval(updateTimer, 1000);
});

// TAUKO
btnPause.addEventListener('click', () => {
    isPaused = true;
    pauseStartTime = new Date();
    clearInterval(timerInterval);
    btnPause.style.display = 'none';
    btnResume.style.display = 'inline-block';
    statusEl.innerText = "⏸ TAUKO";
    statusEl.style.color = "#fbc02d";
});

// JATKA
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

// LOPETA
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

    // Hae valitun auton tiedot
    let selectedCarName = "Muu ajoneuvo";
    let selectedCarIcon = "🚗";
    if (currentCarId !== 'all') {
        const c = userCars.find(x => x.id === currentCarId);
        if(c) {
            selectedCarName = c.name;
            selectedCarIcon = c.icon || (c.type === 'bike' ? "🚲" : "🚗");
        }
    }

    // Luodaan tallennusobjekti
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

    // Avaa tallennusikkuna
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

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const alt = position.coords.altitude || 0;
    const heading = position.coords.heading; 
    const speedMs = position.coords.speed || 0; 
    let speedKmh = speedMs * 3.6;
    if (speedKmh < 1.0) speedKmh = 0;

    let currentAvg = 0;

    if (currentDriveWeather === "") fetchWeather(lat, lng);

    // Jos nauhoitus on päällä, tallenna dataa
    if (isRecording && !isPaused) {
        if (speedKmh > maxSpeed) maxSpeed = speedKmh;
        if (lastLatLng) {
            const dist = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
            if ((speedKmh > 3 || dist > 0.02) && dist < 50.0) totalDistance += dist;
        }
        
        // Tallenna reittipiste
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
    
    // Päivitä sijainti kartalla
    if (!lastLatLng || speedKmh > 0 || isGPSActive) {
        lastLatLng = { lat, lng };
        const newLatLng = new L.LatLng(lat, lng);
        marker.setLatLng(newLatLng);
        
        // Keskitä kartta VAIN JOS emme katsele historiaa
        if (views.map.style.display !== 'none' && !isViewingHistory) {
            
            // ZOOM Logiikka nopeuden mukaan
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
            
            if (map.getZoom() !== targetZoom) {
                map.setView(newLatLng, targetZoom);
            } else {
                map.panTo(newLatLng);
            }
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

// =========================================================
// 8. TILASTOT (GRAAFIT)
// =========================================================
let chartInstanceMonthly = null;
let chartInstanceVehicles = null;
let chartInstanceFuelPrice = null; 
let chartInstanceFuelCost = null; 

function renderStats() {
    if (allHistoryData.length > 0) {
        const monthlyData = {};
        const vehicleData = {};

        allHistoryData.forEach(d => {
            const dist = parseFloat(d.distanceKm) || 0;
            const date = new Date(d.startTime);
            const monthKey = `${date.getMonth()+1}/${date.getFullYear()}`;
            if (!monthlyData[monthKey]) monthlyData[monthKey] = 0;
            monthlyData[monthKey] += dist;

            let carObj = userCars.find(c => c.id === d.carId);
            let carIcon = carObj ? (carObj.icon || (carObj.type==='bike'?"🚲":"🚗")) : (d.carIcon || (d.carType==='bike'?"🚲":"🚗"));
            let carName = carObj ? carObj.name : (d.carName || "Muu");
            let label = `${carIcon} ${carName}`;
            
            if (!vehicleData[label]) vehicleData[label] = 0;
            vehicleData[label] += dist;
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
            options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
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

    if (allRefuelData.length > 0) {
        const priceData = [];
        const costData = {};
        
        allRefuelData.sort((a,b) => new Date(a.date) - new Date(b.date));

        allRefuelData.forEach(r => {
            const d = new Date(r.date);
            const label = `${d.getDate()}.${d.getMonth()+1}`;
            priceData.push({x: label, y: parseFloat(r.pricePerLiter)});

            const monthKey = `${d.getMonth()+1}/${d.getFullYear()}`;
            if(!costData[monthKey]) costData[monthKey] = 0;
            costData[monthKey] += parseFloat(r.totalPrice);
        });

        const ctxPrice = document.getElementById('chart-fuel-price').getContext('2d');
        if(chartInstanceFuelPrice) chartInstanceFuelPrice.destroy();
        chartInstanceFuelPrice = new Chart(ctxPrice, {
            type: 'line',
            data: {
                labels: priceData.map(d => d.x),
                datasets: [{
                    label: '€/l',
                    data: priceData.map(d => d.y),
                    borderColor: '#aa00ff',
                    backgroundColor: 'rgba(170, 0, 255, 0.1)',
                    fill: true
                }]
            }
        });

        const costLabels = Object.keys(costData).slice(-6); 
        const costValues = costLabels.map(k => costData[k]);

        const ctxCost = document.getElementById('chart-fuel-cost').getContext('2d');
        if(chartInstanceFuelCost) chartInstanceFuelCost.destroy();
        chartInstanceFuelCost = new Chart(ctxCost, {
            type: 'bar',
            data: {
                labels: costLabels,
                datasets: [{
                    label: 'Kustannukset (€)',
                    data: costValues,
                    backgroundColor: 'rgba(255, 159, 64, 0.7)'
                }]
            }
        });
    }
}

// =========================================================
// 9. AUTOTALLI LOGIIKKA
// =========================================================
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
        if (views.history.style.display !== 'none') renderHistoryList();
        if (views.stats.style.display !== 'none') renderStats();
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
    const allOpt = document.createElement('option'); allOpt.value = 'all'; allOpt.text = "Kaikki ajoneuvot"; carSelectEl.appendChild(allOpt);
    userCars.forEach(car => {
        const opt = document.createElement('option'); opt.value = car.id;
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
    if (views.history.style.display !== 'none') renderHistoryList();
});

const carIconsList = [
    "🚗", "🚙", "🛻", "🚌", "🏎️", "🚕", "🚓", "🚑", "🚒", "🚐", "🚚", "🚜", "🏍️", "🛵", "🚲", "🛴", 
    "🚘", "🚔", "🚖", "🚍", "🦽", "🦼", "🛹", "🛶", "🚤", "🛳️"
];

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

function renderCarList() {
    const list = document.getElementById('cars-list'); list.innerHTML = "";
    if (userCars.length === 0) { list.innerHTML = "<p>Ei ajoneuvoja. Lisää ensimmäinen!</p>"; return; }
    userCars.forEach(car => {
        const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
        const div = document.createElement('div'); div.className = 'car-item';
        div.innerHTML = `
            <div>
                <div class="car-title">${icon} ${car.name}</div>
                <div class="car-details">${car.plate || ''} ${car.fuel || ''}</div>
            </div>
            <div class="car-actions">
                <button class="refuel-btn" onclick="window.openRefuelModal('${car.id}')">⛽</button>
                <button class="edit-btn" onclick="window.editCar('${car.id}')">✏️</button>
                <button class="delete-btn" onclick="window.deleteCar('${car.id}')">🗑</button>
            </div>`;
        list.appendChild(div);
    });
}
// =========================================================
// 10. TANKKAUS & HISTORIA LOGIIKKA
// =========================================================

// Vaihda välilehteä Historiassa
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
    const list = document.getElementById('refuel-list');
    list.innerHTML = "";
    
    if(allRefuelData.length === 0) {
        list.innerHTML = "<p style='text-align:center; color:#888;'>Ei tankkauksia.</p>";
        return;
    }
    
    const filtered = (currentCarId === 'all') 
        ? allRefuelData 
        : allRefuelData.filter(r => r.carId === currentCarId);
        
    filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    filtered.forEach(r => {
        const d = new Date(r.date);
        const dateStr = d.toLocaleDateString('fi-FI');
        const car = userCars.find(c => c.id === r.carId);
        const icon = car ? (car.icon||"🚗") : "🚗";
        const div = document.createElement('div');
        div.className = 'log-card';
        div.innerHTML = `
            <div class="log-header">
                <div class="log-title-group">
                    <div class="log-date-line">${dateStr}</div>
                    <div class="log-car-big">${icon} ${car ? car.name : '?'}</div>
                </div>
                <button class="edit-btn" onclick="window.openRefuelEdit('${r.key}')">✏️</button>
            </div>
            <div class="log-stats">
                <div><span class="stat-label">LITRAT</span>${r.liters}</div>
                <div><span class="stat-label">HINTA</span>${r.totalPrice}€</div>
                <div><span class="stat-label">€/L</span>${r.pricePerLiter}</div>
                <div><span class="stat-label">KM</span>${r.km}</div>
            </div>
        `;
        list.appendChild(div);
    });
}

// UUSI TANKKAUS (KORJATTU JA SUOJATTU)
window.openRefuelModal = (carId) => {
    const car = userCars.find(c => c.id === carId);
    if(!car) { alert("Autoa ei löydy (Tuntematon ID)"); return;}
    
    refuelKey = null;
    
    const idEl = document.getElementById('refuel-car-id');
    const nameEl = document.getElementById('refuel-car-name');
    const kmEl = document.getElementById('refuel-km');
    const prevEl = document.getElementById('prev-km');
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
    if(prevEl) prevEl.innerText = carRefuels.length > 0 ? carRefuels[0].km : 0;
    
    refuelModal.style.display = 'flex';
};

// MUOKKAA TANKKAUSTA
window.openRefuelEdit = (key) => {
    const r = allRefuelData.find(x => x.key === key);
    if(!r) return;
    
    refuelKey = key;
    const car = userCars.find(c => c.id === r.carId);
    
    document.getElementById('refuel-car-id').value = r.carId;
    document.getElementById('refuel-car-name').innerText = `${car ? car.icon : "🚗"} ${car ? car.name : "?"}`;
    document.getElementById('refuel-km').value = r.km;
    document.getElementById('refuel-liters').value = r.liters;
    document.getElementById('refuel-price').value = r.totalPrice;
    
    const delBtn = document.getElementById('btn-refuel-delete');
    if(delBtn) delBtn.style.display = 'block';
    
    window.calculateRefuelStats();
    refuelModal.style.display = 'flex';
};

// LASKURI (Suojattu virheiltä)
window.calculateRefuelStats = () => {
    const l = parseFloat(document.getElementById('refuel-liters').value);
    const p = parseFloat(document.getElementById('refuel-price').value);
    const k = parseFloat(document.getElementById('refuel-km').value);
    
    const prevEl = document.getElementById('prev-km');
    const prev = prevEl ? parseFloat(prevEl.innerText) : 0;
    
    const pplEl = document.getElementById('refuel-ppl');
    if(pplEl) pplEl.innerText = (l>0 && p>0) ? (p/l).toFixed(3) : "0.000";
    
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

// Tankkausnapit
if(btnRefuelCancel) btnRefuelCancel.addEventListener('click', () => refuelModal.style.display = 'none');

if(btnRefuelDelete) {
    btnRefuelDelete.addEventListener('click', () => {
        if(confirm("Poista tankkausmerkintä?")) {
            db.ref('refuelings/' + currentUser.uid + '/' + refuelKey).remove()
                .then(() => refuelModal.style.display = 'none');
        }
    });
}

if(btnRefuelSave) {
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
            db.ref('refuelings/' + currentUser.uid + '/' + refuelKey).update(data)
                .then(() => refuelModal.style.display = 'none');
        } else {
            db.ref('refuelings/' + currentUser.uid).push().set(data)
                .then(() => refuelModal.style.display = 'none')
                .catch(e => alert("Virhe tallennuksessa: " + e.message));
        }
    });
}

// =========================================================
// 11. GLOBAL FUNCTIONS & APU
// =========================================================

window.showRouteOnMap = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive || !drive.route) { alert("Ei reittidataa."); return; }

    clearSavedRoute();
    isViewingHistory = true; 
    mapGpsToggle.innerText = "📡 OFF";
    mapGpsToggle.classList.add('inactive');
    mapLegend.style.display = 'flex';

    if (drive.route[0] && drive.route[0].spd !== undefined) {
        for (let i = 0; i < drive.route.length - 1; i++) {
            const p1 = drive.route[i];
            const p2 = drive.route[i+1];
            const color = getSpeedColor(p1.spd, drive.carType);
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
        // Fallback vanhalle datalle
        savedRouteLayer = L.polyline(drive.route, {color: '#ff9100', weight: 5}).addTo(map);
        map.fitBounds(savedRouteLayer.getBounds(), {padding: [50, 50]});
    }
    
    switchView('map');
};

function clearSavedRoute() {
    savedRouteLayers.forEach(layer => map.removeLayer(layer));
    savedRouteLayers = [];
    if(savedRouteLayer) {
        map.removeLayer(savedRouteLayer);
        savedRouteLayer = null;
    }
}

function getSpeedColor(speed, type) {
    let max = (type === 'bike') ? 30 : 100;
    if (speed <= 3) return '#2979ff'; 
    let ratio = speed / max;
    if (ratio > 1) ratio = 1;
    if (ratio < 0.33) return '#00e676';
    if (ratio < 0.66) return '#ffea00';
    return '#ff1744'; 
}

// Muut apufunktiot
function updateDashboardUI(spd, max, dist, time, alt, avg) {
    dashSpeedEl.innerText = spd.toFixed(1); 
    dashMaxSpeedEl.innerText = max.toFixed(1);
    dashDistEl.innerText = dist.toFixed(2); 
    dashAltEl.innerText = Math.round(alt);
    if(avg !== undefined) dashAvgEl.innerText = avg.toFixed(1);
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2-lat1)*(Math.PI/180);
  const dLon = (lon2-lon1)*(Math.PI/180);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
            Math.cos(lat1*(Math.PI/180))*Math.cos(lat2*(Math.PI/180)) *
            Math.sin(dLon/2)*Math.sin(dLon/2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
}

function handleError(e) { statusEl.innerText = "GPS Virhe: " + e.message; }

function toGeocacheFormat(deg, isLat) {
    const d = Math.floor(Math.abs(deg));
    const m = (Math.abs(deg)-d)*60;
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

async function requestWakeLock() { 
    try { 
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen'); 
        }
    } catch (err) {
        console.log("Wake Lock ei onnistunut");
    } 
}

// Helpers for Log Edit Modal
window.openEditLogModal = (key) => {
    const d = allHistoryData.find(x => x.key === key);
    if(!d) return;

    editKeyEl.value = key;
    document.getElementById('edit-subject').value = d.subject || "";
    
    editCarSelectEl.innerHTML = "";
    userCars.forEach(c => {
        const opt = new Option(c.name, c.id);
        if(d.carId === c.id) opt.selected = true;
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

// Edit Modal Logic
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

// Autojen lisäys/muokkaus ikkuna funktiot
window.editCar = (id) => {
    const car = userCars.find(c => c.id === id);
    if(!car) return;
    
    document.getElementById('car-id').value = car.id;
    document.getElementById('car-name').value = car.name;
    document.getElementById('car-type').value = car.type;
    document.getElementById('selected-car-icon').value = car.icon || "🚗";
    
    generateCarIcons(); 
    
    document.getElementById('add-car-form').style.display = 'block';
    document.getElementById('btn-add-car').style.display = 'none';
};

window.deleteCar = (id) => {
    if(confirm("Poista ajoneuvo?")) db.ref('users/' + currentUser.uid + '/cars/' + id).remove();
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
    
    if(id) {
        db.ref('users/' + currentUser.uid + '/cars/' + id).update(data);
    } else {
        db.ref('users/' + currentUser.uid + '/cars').push().set(data);
    }
    
    document.getElementById('add-car-form').style.display = 'none';
    document.getElementById('btn-add-car').style.display = 'block';
});

// =========================================================
// 12. DOKUMENTIN LATAUS VALMIS
// =========================================================
document.addEventListener('DOMContentLoaded', () => {
    updateClockAndDate();
    setInterval(updateClockAndDate, 1000);
});

function updateClockAndDate() {
    const now = new Date();
    if(dashClockEl) dashClockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if(dashDateEl) dashDateEl.innerText = now.toLocaleDateString('fi-FI', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
}

function updateTimer() {
    if (!startTime) return;
    const now = new Date();
    const diff = now - startTime - totalPauseTime;
    
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const hrs = Math.floor(diff / 3600000);
    dashTimeEl.innerText = (hrs>0?hrs+":":"") + (mins<10?"0":"")+mins + ":" + (secs<10?"0":"")+secs;
}

// --- END OF FILE ---
