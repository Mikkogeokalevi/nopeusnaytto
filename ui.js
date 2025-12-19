// =========================================================
// UI.JS - KÄYTTÖLIITTYMÄ (FIXED GLOBAL SCOPE)
// =========================================================

// --- DOM ELEMENTIT ---
const splashScreen = document.getElementById('splash-screen');
const loginView = document.getElementById('login-view');
const appContainer = document.getElementById('app-container');

// Menu
const menuBtn = document.getElementById('btn-menu-toggle');
const mainMenu = document.getElementById('main-menu');
const menuUserName = document.getElementById('user-name');
const menuUserAvatar = document.getElementById('user-photo');
const appLogo = document.getElementById('app-logo'); 

// Sivupainikkeet
const sideTapLeft = document.getElementById('side-tap-left');
const mapReturnBtn = document.getElementById('map-return-btn');
const mapHistoryBtn = document.getElementById('map-history-btn'); 

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

// Mittaristo UI
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

// Autovalinta
const carSelectEl = document.getElementById('car-select');

// Yhteenveto & Filtterit
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

// Autotalli lomakkeet
const addCarForm = document.getElementById('add-car-form');
const btnAddCar = document.getElementById('btn-add-car');
const btnCancelCar = document.getElementById('btn-cancel-car');
const btnSaveCar = document.getElementById('btn-save-car');
const carTypeSelect = document.getElementById('car-type');
const carSpecificFields = document.getElementById('car-specific-fields');


// --- 2. UI LOGIIKKA (GLOBAALIT FUNKTIOT) ---

// Määritellään window-objektiin, jotta HTML löytää nämä varmasti
window.switchView = function(viewName) {
    if(mainMenu) mainMenu.style.display = 'none';
    
    // Piilota kaikki näkymät
    Object.values(views).forEach(el => {
        if(el) el.style.display = 'none';
    });
    
    // Poista aktiivinen luokka napeista
    Object.values(navBtns).forEach(btn => {
        if(btn) btn.classList.remove('active-menu');
    });

    // Näytä valittu
    if (views[viewName]) {
        if (viewName === 'dashboard' || viewName === 'map') {
            views[viewName].style.display = 'flex';
        } else {
            views[viewName].style.display = 'block';
        }
    }
    
    if(navBtns[viewName]) {
        navBtns[viewName].classList.add('active-menu');
    }

    // KARTAN KÄSITTELY
    if (viewName !== 'map') {
        if (typeof window.clearSavedRoute === 'function') window.clearSavedRoute();
        isViewingHistory = false;
        if(mapLegend) mapLegend.style.display = 'none';
    } else {
        // Kartalle tulo
        if (mapReturnBtn) mapReturnBtn.style.display = 'block';
        if (mapHistoryBtn) mapHistoryBtn.style.display = 'none';
        
        // PAKOTA KARTAN PÄIVITYS (FIX HARMAA RUUTU)
        if (typeof map !== 'undefined' && map) {
            map.invalidateSize();
            setTimeout(() => { map.invalidateSize(); }, 200);
            setTimeout(() => { map.invalidateSize(); }, 500);
        }
    }
    
    // Lataa listat tarvittaessa
    if (viewName === 'history' && typeof loadHistory === 'function') loadHistory(); // Varmistus
    if (viewName === 'history' && typeof renderHistoryList === 'function') renderHistoryList();
    if (viewName === 'settings' && typeof renderCarList === 'function') renderCarList();
    if (viewName === 'stats' && typeof renderStats === 'function') renderStats();
};

window.updateDashboardUI = function(spd, max, dist, time, alt, avg) {
    if(dashSpeedEl) dashSpeedEl.innerText = spd.toFixed(1); 
    if(dashMaxSpeedEl) dashMaxSpeedEl.innerText = max.toFixed(1);
    if(dashDistEl) dashDistEl.innerText = dist.toFixed(2); 
    if(dashAltEl) dashAltEl.innerText = Math.round(alt);
    if(avg !== undefined && dashAvgEl) dashAvgEl.innerText = avg.toFixed(1);
};

window.updateClockAndDate = function() {
    const now = new Date();
    if(dashClockEl) dashClockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if(dashDateEl) dashDateEl.innerText = now.toLocaleDateString('fi-FI', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
};
setInterval(window.updateClockAndDate, 1000);
window.updateClockAndDate();


// --- 3. TAPAHTUMANKUUNTELIJAT ---

if (menuBtn) {
    menuBtn.addEventListener('click', () => {
        if (mainMenu.style.display === 'none' || mainMenu.style.display === '') {
            mainMenu.style.display = 'flex';
        } else {
            mainMenu.style.display = 'none';
        }
    });
}

if (appLogo) appLogo.addEventListener('click', () => window.switchView('dashboard'));
if (sideTapLeft) sideTapLeft.addEventListener('click', () => window.switchView('map'));
if (mapReturnBtn) mapReturnBtn.addEventListener('click', () => window.switchView('dashboard'));
if (mapHistoryBtn) mapHistoryBtn.addEventListener('click', () => window.switchView('history'));

// Navigaationapit
if (navBtns.dashboard) navBtns.dashboard.addEventListener('click', () => window.switchView('dashboard'));
if (navBtns.map) navBtns.map.addEventListener('click', () => window.switchView('map'));
if (navBtns.history) navBtns.history.addEventListener('click', () => window.switchView('history'));
if (navBtns.stats) navBtns.stats.addEventListener('click', () => window.switchView('stats'));
if (navBtns.settings) navBtns.settings.addEventListener('click', () => window.switchView('settings'));
if (navBtns.help) navBtns.help.addEventListener('click', () => window.switchView('help'));
