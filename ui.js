// =========================================================
// UI.JS - KÄYTTÖLIITTYMÄELEMENTIT JA NÄKYMÄT (PREMIUM UI v5.9 FIX)
// =========================================================

// --- 1. DOM ELEMENTIT ---

const splashScreen = document.getElementById('splash-screen');
const loginView = document.getElementById('login-view');
const appContainer = document.getElementById('app-container');

// Menu
const menuBtn = document.getElementById('btn-menu-toggle');
const mainMenu = document.getElementById('main-menu');
const menuUserName = document.getElementById('user-name');
const menuUserAvatar = document.getElementById('user-photo');
const appLogo = document.getElementById('app-logo'); 

// Versio
const splashVersionEl = document.getElementById('splash-version-el');
const menuVersionEl = document.getElementById('menu-version-el');

// Sivupainikkeet
const sideTapLeft = document.getElementById('side-tap-left');
const mapReturnBtn = document.getElementById('map-return-btn');

// Näkymät
const views = {
    dashboard: document.getElementById('dashboard-view'),
    map: document.getElementById('map-view'),
    history: document.getElementById('history-view'),
    stats: document.getElementById('stats-view'),
    settings: document.getElementById('settings-view'),
    help: document.getElementById('help-view')
};

// Navigaatio
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

// PREMIUM CONFIRM MODAL
const confirmModal = document.getElementById('custom-confirm-modal');
const confirmTitle = document.getElementById('confirm-title');
const confirmMsg = document.getElementById('confirm-msg');
const btnConfirmYes = document.getElementById('btn-confirm-yes');
const btnConfirmNo = document.getElementById('btn-confirm-no');
let confirmCallback = null; // Callback funktiolle

// TANKKAUS ELEMENTIT
const fuelModal = document.getElementById('fuel-modal');
const btnOpenFuel = document.getElementById('btn-open-fuel');
const btnFuelSave = document.getElementById('btn-fuel-save');
const btnFuelCancel = document.getElementById('btn-fuel-cancel');
const inpFuelLiters = document.getElementById('fuel-liters');
const inpFuelEuros = document.getElementById('fuel-euros');
const inpFuelCalc = document.getElementById('fuel-price-calc');
const inpFuelOdo = document.getElementById('fuel-odo');
const inpFuelDate = document.getElementById('fuel-date');
const inpFuelTime = document.getElementById('fuel-time');
const inpFuelCarSelect = document.getElementById('fuel-car-select');
const inpFuelEditKey = document.getElementById('fuel-edit-key');
const fuelModalTitle = document.getElementById('fuel-modal-title');

// Mittaristo
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
const dashAddressEl = document.getElementById('dash-address');
const compassArrowEl = document.getElementById('compass-arrow');
const gBubbleEl = document.getElementById('g-bubble');
const liveStatusBar = document.getElementById('live-status-bar');
const liveStyleEl = document.getElementById('live-style-indicator');

// Kartta
const mapSpeedEl = document.getElementById('map-speed');
const mapCoordsEl = document.getElementById('map-coords');
const statusEl = document.getElementById('status');
const mapGpsToggle = document.getElementById('map-gps-toggle');
const mapLegend = document.getElementById('map-legend');

// Muut
const carSelectEl = document.getElementById('car-select');
const btnStartRec = document.getElementById('btn-start-rec');
const activeRecBtns = document.getElementById('active-rec-btns');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnStopRec = document.getElementById('btn-stop-rec');

const addCarForm = document.getElementById('add-car-form');
const btnAddCar = document.getElementById('btn-add-car');
const btnCancelCar = document.getElementById('btn-cancel-car');
const btnSaveCar = document.getElementById('btn-save-car');
const carTypeSelect = document.getElementById('car-type');
const carSpecificFields = document.getElementById('car-specific-fields');


// --- 2. APUFUNKTIOT (TOAST & CONFIRM) ---

window.showToast = (msg, type = 'info') => {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('visible');
    setTimeout(() => {
        toast.classList.remove('visible');
    }, 3000);
}

window.openConfirmModal = (title, message, callback) => {
    if(confirmTitle) confirmTitle.innerText = title;
    if(confirmMsg) confirmMsg.innerText = message;
    confirmCallback = callback;
    if(confirmModal) confirmModal.style.display = 'flex';
}

// Confirm napit
if(btnConfirmNo) {
    btnConfirmNo.addEventListener('click', () => {
        if(confirmModal) confirmModal.style.display = 'none';
        confirmCallback = null;
    });
}
if(btnConfirmYes) {
    btnConfirmYes.addEventListener('click', () => {
        if(confirmCallback) confirmCallback();
        if(confirmModal) confirmModal.style.display = 'none';
        confirmCallback = null;
    });
}


// --- 3. UI LOGIIKKA ---

function switchView(viewName) {
    if(mainMenu) mainMenu.style.display = 'none';
    
    Object.values(views).forEach(el => {
        if(el) {
            el.classList.remove('active-view');
            el.style.display = 'none'; 
        }
    });
    Object.values(navBtns).forEach(btn => {
        if(btn) btn.classList.remove('active-menu');
    });

    const targetEl = views[viewName];
    if (targetEl) {
        targetEl.style.display = ''; 
        targetEl.classList.add('active-view');
    }
    
    if(navBtns[viewName]) navBtns[viewName].classList.add('active-menu');

    if (viewName !== 'map') {
        if (typeof clearSavedRoute === 'function') clearSavedRoute();
        isViewingHistory = false;
        if(mapLegend) mapLegend.style.display = 'none';
    }
    if (viewName === 'map' && map) setTimeout(() => map.invalidateSize(), 100);
    
    if (viewName === 'history' && typeof renderHistoryList === 'function') renderHistoryList();
    if (viewName === 'settings' && typeof renderCarList === 'function') renderCarList();
    if (viewName === 'stats' && typeof renderStats === 'function') renderStats();
}

function updateDashboardUI(spd, max, dist, time, alt, avg) {
    if(dashSpeedEl) {
        dashSpeedEl.innerText = spd.toFixed(1);
        if (Math.abs(spd) >= 100) dashSpeedEl.classList.add('three-digits');
        else dashSpeedEl.classList.remove('three-digits');
        
        if (spd >= 120) dashSpeedEl.style.color = '#ff1744'; 
        else dashSpeedEl.style.color = ''; 
    }
    if(dashMaxSpeedEl) dashMaxSpeedEl.innerText = max.toFixed(1);
    if(dashDistEl) dashDistEl.innerText = dist.toFixed(2); 
    if(dashAltEl) dashAltEl.innerText = Math.round(alt);
    if(avg !== undefined && dashAvgEl) dashAvgEl.innerText = avg.toFixed(1);
}

function updateClockAndDate() {
    const now = new Date();
    if(dashClockEl) dashClockEl.innerText = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if(dashDateEl) dashDateEl.innerText = now.toLocaleDateString('fi-FI', { weekday: 'short', day: '2-digit', month: '2-digit', year: 'numeric' });
}
setInterval(updateClockAndDate, 1000);
updateClockAndDate();


// --- 4. PERUS EVENT LISTENERS ---

if (menuBtn) menuBtn.addEventListener('click', () => { mainMenu.style.display = (mainMenu.style.display === 'none' || mainMenu.style.display === '') ? 'flex' : 'none'; });
if (appLogo) appLogo.addEventListener('click', () => switchView('dashboard'));
if (sideTapLeft) sideTapLeft.addEventListener('click', () => switchView('map'));
if (mapReturnBtn) mapReturnBtn.addEventListener('click', () => switchView('dashboard'));

if (navBtns.dashboard) navBtns.dashboard.addEventListener('click', () => switchView('dashboard'));
if (navBtns.map) navBtns.map.addEventListener('click', () => switchView('map'));
if (navBtns.history) navBtns.history.addEventListener('click', () => switchView('history'));
if (navBtns.stats) navBtns.stats.addEventListener('click', () => switchView('stats'));
if (navBtns.settings) navBtns.settings.addEventListener('click', () => switchView('settings'));
if (navBtns.help) navBtns.help.addEventListener('click', () => switchView('help'));


// --- 5. TANKKAUS (KORJATTU: TALLENNUSLUKKO) ---

// Apufunktio valikon täyttöön (Vain aktiiviset autot)
function populateFuelCarSelect(selectedId) {
    if(!inpFuelCarSelect) return;
    inpFuelCarSelect.innerHTML = "";
    
    // Suodatetaan pois pyörät JA arkistoidut
    const validCars = userCars.filter(c => c.type !== 'bike' && !c.isArchived);
    
    if(validCars.length === 0) {
        const opt = document.createElement('option');
        opt.text = "Ei tankattavia ajoneuvoja";
        inpFuelCarSelect.appendChild(opt);
        return;
    }
    
    validCars.forEach(car => {
        const opt = document.createElement('option');
        opt.value = car.id;
        const icon = car.icon || "🚗";
        opt.text = `${icon} ${car.name}`;
        
        // Jos valittu ID täsmää, tai jos ei valintaa ja tämä on eka, valitaan se
        if(selectedId && car.id === selectedId) {
            opt.selected = true;
        }
        inpFuelCarSelect.appendChild(opt);
    });
}

// Uusi tankkaus (Nappi)
if (btnOpenFuel) {
    btnOpenFuel.addEventListener('click', () => {
        // TARKISTUS: Estä jos nykyinen kulkuneuvo on pyörä
        if (currentCarType === 'bike') {
            showToast("Polkupyörää ei voi tankata! 🚲🚫");
            return;
        }

        const now = new Date();
        if(inpFuelDate) inpFuelDate.value = now.toISOString().split('T')[0];
        if(inpFuelTime) inpFuelTime.value = now.toTimeString().split(' ')[0].substring(0,5);
        if(inpFuelOdo) inpFuelOdo.value = "";
        if(inpFuelLiters) inpFuelLiters.value = "";
        if(inpFuelEuros) inpFuelEuros.value = "";
        if(inpFuelCalc) inpFuelCalc.innerText = "0.00";
        if(inpFuelEditKey) inpFuelEditKey.value = ""; // Tyhjä = Uusi
        
        if(fuelModalTitle) fuelModalTitle.innerText = "⛽ Uusi tankkaus";
        
        // Valitse nykyinen auto oletuksena (jos se ei ole 'all')
        // Jos on 'all', populateFuelCarSelect valitsee listan ensimmäisen auton
        const targetId = (currentCarId !== 'all') ? currentCarId : null;
        populateFuelCarSelect(targetId);
        
        if(fuelModal) fuelModal.style.display = 'flex';
    });
}

// Muokkaa tankkausta (Kutsutaan historiasta)
window.editRefueling = (key) => {
    const ref = allRefuelings.find(r => r.key === key);
    if(!ref) return;
    
    let dateVal = "";
    let timeVal = "";
    if (ref.date.includes('T')) {
        const parts = ref.date.split('T');
        dateVal = parts[0];
        timeVal = parts[1].substring(0,5);
    } else {
        dateVal = new Date(ref.date).toISOString().split('T')[0];
        timeVal = "12:00";
    }

    if(inpFuelDate) inpFuelDate.value = dateVal;
    if(inpFuelTime) inpFuelTime.value = timeVal;
    if(inpFuelOdo) inpFuelOdo.value = ref.odo || "";
    if(inpFuelLiters) inpFuelLiters.value = ref.liters || "";
    if(inpFuelEuros) inpFuelEuros.value = ref.euros || "";
    if(inpFuelCalc) inpFuelCalc.innerText = ref.pricePerLiter || "0.00";
    if(inpFuelEditKey) inpFuelEditKey.value = key; 

    if(fuelModalTitle) fuelModalTitle.innerText = "✏️ Muokkaa tankkausta";
    
    populateFuelCarSelect(ref.carId);
    
    if(fuelModal) fuelModal.style.display = 'flex';
};

if (btnFuelCancel) btnFuelCancel.addEventListener('click', () => { if(fuelModal) fuelModal.style.display = 'none'; });

// Litrahinnan laskenta
function calcPrice() {
    const l = parseFloat(inpFuelLiters.value) || 0;
    const e = parseFloat(inpFuelEuros.value) || 0;
    if(l > 0 && inpFuelCalc) inpFuelCalc.innerText = (e/l).toFixed(3);
    else if(inpFuelCalc) inpFuelCalc.innerText = "0.00";
}
if(inpFuelLiters) inpFuelLiters.addEventListener('input', calcPrice);
if(inpFuelEuros) inpFuelEuros.addEventListener('input', calcPrice);

// Tankkauksen tallennus (Uusi tai Päivitys) - KORJATTU LUKKO
if (btnFuelSave) {
    btnFuelSave.addEventListener('click', () => {
        const date = inpFuelDate.value;
        const time = inpFuelTime.value;
        const odo = inpFuelOdo.value;
        const lit = inpFuelLiters.value;
        const eur = inpFuelEuros.value;
        const selectedCarId = inpFuelCarSelect ? inpFuelCarSelect.value : null;
        const editKey = inpFuelEditKey.value;

        if(!selectedCarId || selectedCarId === 'Ei tankattavia ajoneuvoja') {
             showToast("Valitse ajoneuvo!");
             return;
        }

        if(!date || !lit || !eur) { 
            showToast("Täytä pakolliset tiedot (pvm, litrat, eurot)!"); 
            return; 
        }

        if(currentUser) {
            // --- ESTÄ TUPLAKLIKKAUS ---
            const originalText = btnFuelSave.innerText;
            btnFuelSave.disabled = true;
            btnFuelSave.innerText = "Tallennetaan...";

            const refData = {
                type: 'refuel',
                date: date + "T" + time,
                odo: odo,
                liters: lit,
                euros: eur,
                pricePerLiter: (parseFloat(eur)/parseFloat(lit)).toFixed(3),
                carId: selectedCarId
            };

            const onComplete = () => {
                // --- PALAUTA NAPPI ---
                btnFuelSave.disabled = false;
                btnFuelSave.innerText = originalText;

                // --- SULJE IKKUNA ---
                if(fuelModal) fuelModal.style.display = 'none';
                
                // Tyhjennä vain jos oli uusi tankkaus
                if (!editKey) {
                    inpFuelLiters.value = ""; 
                    inpFuelEuros.value = "";
                }
                
                showToast(editKey ? "Tankkaus päivitetty! ✏️" : "Tankkaus tallennettu! ⛽");
                if(window.renderFuelList) window.renderFuelList();
            };

            const onError = (error) => {
                // Virheen sattuessa vapauta nappi
                btnFuelSave.disabled = false;
                btnFuelSave.innerText = originalText;
                alert("Virhe: " + error.message);
            };

            if (editKey) {
                // PÄIVITYS
                db.ref('ajopaivakirja/' + currentUser.uid + '/' + editKey).update(refData)
                    .then(onComplete)
                    .catch(onError);
            } else {
                // UUSI
                db.ref('ajopaivakirja/' + currentUser.uid).push().set(refData)
                    .then(onComplete)
                    .catch(onError);
            }
        }
    });
}

// --- HISTORIA & TILASTO TABIT ---

const tabDrives = document.getElementById('tab-drives');
const tabFuel = document.getElementById('tab-fuel');
const historyDrivesList = document.getElementById('log-list');
const historyFuelList = document.getElementById('fuel-list');

if(tabDrives && tabFuel) {
    tabDrives.addEventListener('click', () => {
        tabDrives.classList.add('blue-btn'); tabDrives.style.backgroundColor = '';
        tabFuel.classList.remove('blue-btn'); tabFuel.style.backgroundColor = '#333';
        historyDrivesList.style.display = 'block';
        historyFuelList.style.display = 'none';
        if(window.renderHistoryList) window.renderHistoryList();
    });

    tabFuel.addEventListener('click', () => {
        tabFuel.classList.add('blue-btn'); tabFuel.style.backgroundColor = '';
        tabDrives.classList.remove('blue-btn'); tabDrives.style.backgroundColor = '#333';
        historyDrivesList.style.display = 'none';
        historyFuelList.style.display = 'block';
        if(window.renderFuelList) window.renderFuelList();
    });
}

const statTabDrives = document.getElementById('stat-tab-drives');
const statTabFuel = document.getElementById('stat-tab-fuel');
const statsDrivesCont = document.getElementById('stats-drives-container');
const statsFuelCont = document.getElementById('stats-fuel-container');

if(statTabDrives && statTabFuel) {
    statTabDrives.addEventListener('click', () => {
        statTabDrives.classList.add('blue-btn'); statTabDrives.style.backgroundColor = '';
        statTabFuel.classList.remove('blue-btn'); statTabFuel.style.backgroundColor = '#333';
        statsDrivesCont.style.display = 'block';
        statsFuelCont.style.display = 'none';
        if(window.renderDriveStats) window.renderDriveStats();
    });

    statTabFuel.addEventListener('click', () => {
        statTabFuel.classList.add('blue-btn'); statTabFuel.style.backgroundColor = '';
        statTabDrives.classList.remove('blue-btn'); statTabDrives.style.backgroundColor = '#333';
        statsDrivesCont.style.display = 'none';
        statsFuelCont.style.display = 'block';
        if(window.renderFuelStats) window.renderFuelStats();
    });
}

// --- 6. ALUSTUS ---
(function updateVersionText() {
    if(typeof APP_VERSION !== 'undefined') {
        if(splashVersionEl) splashVersionEl.innerText = "Modular v" + APP_VERSION;
        if(menuVersionEl) menuVersionEl.innerText = "Mikkokalevin Ajopäiväkirja Pro v" + APP_VERSION;
    }
})();

// Pakota mittaristo näkyviin heti latauksessa
window.addEventListener('DOMContentLoaded', () => {
    switchView('dashboard');
});
