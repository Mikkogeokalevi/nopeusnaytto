// =========================================================
// UI.JS - KÄYTTÖLIITTYMÄELEMENTIT JA NÄKYMÄT (v6.10 REPORTING)
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

// Yläpalkin napit
const btnHud = document.getElementById('btn-hud'); 

// UUSI: Minimalistinen tila -nappi mittaristossa
const btnDashMinimal = document.getElementById('btn-dashboard-minimal');

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

// Navigaatio (Ylävalikko)
const navBtns = {
    dashboard: document.getElementById('nav-dashboard'),
    map: document.getElementById('nav-map'),
    history: document.getElementById('nav-history'),
    stats: document.getElementById('nav-stats'),
    settings: document.getElementById('nav-settings'),
    help: document.getElementById('nav-help')
};

// UUSI: Alapalkin napit
const botNavBtns = {
    dashboard: document.getElementById('bot-nav-dashboard'),
    map: document.getElementById('bot-nav-map'),
    history: document.getElementById('bot-nav-history'),
    stats: document.getElementById('bot-nav-stats'),
    settings: document.getElementById('bot-nav-settings')
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

// MANUAL DRIVE MODAL
const manualModal = document.getElementById('manual-drive-modal');
const btnManualDrive = document.getElementById('btn-manual-drive');
const btnManualCancel = document.getElementById('btn-manual-cancel');
const btnManualSave = document.getElementById('btn-manual-save');
const inpManualDate = document.getElementById('manual-date');
const inpManualCar = document.getElementById('manual-car-select');
const inpManualStart = document.getElementById('manual-start-addr');
const inpManualEnd = document.getElementById('manual-end-addr');
const inpManualDist = document.getElementById('manual-dist');
const inpManualSubj = document.getElementById('manual-subject');

// PREVIEW MODAL
const previewModal = document.getElementById('preview-modal');
const btnPreviewCancel = document.getElementById('btn-preview-cancel');
const btnPreviewConfirm = document.getElementById('btn-preview-confirm');

const deleteModal = document.getElementById('delete-modal');
const btnDeleteConfirm = document.getElementById('btn-delete-confirm');
const btnDeleteCancel = document.getElementById('btn-delete-cancel');

// CSV EXPORT BUTTON
const btnExportCsv = document.getElementById('btn-export-csv');

// PREMIUM CONFIRM MODAL
const confirmModal = document.getElementById('custom-confirm-modal');
const confirmTitle = document.getElementById('confirm-title');
const confirmMsg = document.getElementById('confirm-msg');
const btnConfirmYes = document.getElementById('btn-confirm-yes');
const btnConfirmNo = document.getElementById('btn-confirm-no');
let confirmCallback = null; 

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

// RAPORTOINTI (UUSI v6.10)
const reportModal = document.getElementById('report-modal');
const btnOpenReport = document.getElementById('btn-open-report');
const btnReportClose = document.getElementById('btn-report-close');
const btnReportDownload = document.getElementById('btn-report-download');
const inputPricePerKm = document.getElementById('settings-price-per-km');


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


// --- 3. UI LOGIIKKA (UPDATED v6.03: Walking Metrics) ---

function switchView(viewName) {
    if(mainMenu) mainMenu.style.display = 'none';
    
    Object.values(views).forEach(el => {
        if(el) {
            el.classList.remove('active-view');
            el.style.display = 'none'; 
        }
    });
    
    // Nollataan valikoiden aktiivisuus
    Object.values(navBtns).forEach(btn => {
        if(btn) btn.classList.remove('active-menu');
    });
    Object.values(botNavBtns).forEach(btn => {
        if(btn) btn.classList.remove('active');
    });

    const targetEl = views[viewName];
    if (targetEl) {
        // Jos kartta tai dashboard, käytetään flexiä jotta täyttää ruudun
        if(viewName === 'map' || viewName === 'dashboard') {
            targetEl.style.display = 'flex';
        } else {
            targetEl.style.display = 'block';
        }
        targetEl.classList.add('active-view');
    }
    
    // Aktivoidaan napit (ylä ja ala)
    if(navBtns[viewName]) navBtns[viewName].classList.add('active-menu');
    if(botNavBtns[viewName]) botNavBtns[viewName].classList.add('active');

    if (viewName !== 'map') {
        if (typeof clearSavedRoute === 'function') clearSavedRoute();
        isViewingHistory = false;
        if(mapLegend) mapLegend.style.display = 'none';
    }
    if (viewName === 'map' && map) setTimeout(() => map.invalidateSize(), 100);
    
    if (viewName === 'history' && typeof renderHistoryList === 'function') renderHistoryList();
    if (viewName === 'settings' && typeof renderCarList === 'function') renderCarList();
    if (viewName === 'stats' && typeof renderStats === 'function') renderStats();
    
    // Tallenna viimeinen näkymä
    if (viewName !== 'help') {
        localStorage.setItem('lastView', viewName);
    }
}

function updateDashboardUI(spd, max, dist, time, alt, avg) {
    if(dashSpeedEl) {
        dashSpeedEl.innerText = spd.toFixed(1);
        if (Math.abs(spd) >= 100) dashSpeedEl.classList.add('three-digits');
        else dashSpeedEl.classList.remove('three-digits');
        
        if (spd >= 120) dashSpeedEl.style.color = '#ff1744'; 
        else dashSpeedEl.style.color = ''; 
    }

    // --- KÄVELY-TILA (Walking Mode) ---
    // Vaihdetaan tietyt ruudut näyttämään askeleita, tahtia ja kaloreita
    if (currentCarType === 'walking') {
        
        // 1. Max Speed -> Askeleet (Arvio: 1312 askelta / km)
        const steps = Math.floor(dist * 1312);
        if(dashMaxSpeedEl) {
            dashMaxSpeedEl.innerText = steps;
            // Etsitään label ja unit
            const label = dashMaxSpeedEl.parentElement.querySelector('.stat-label');
            const unit = dashMaxSpeedEl.parentElement.querySelector('.stat-unit');
            if(label) label.innerText = "Askeleet";
            if(unit) unit.innerText = "kpl (arvio)";
        }

        // 2. Avg Speed -> Tahti (min/km)
        let pace = 0;
        if (spd > 0.5) { // Vältetään ääretöntä arvoa kun ollaan paikallaan
            pace = 60 / spd;
        }
        if(dashAvgEl) {
            // Muotoillaan min:sek
            const pMin = Math.floor(pace);
            const pSec = Math.round((pace - pMin) * 60);
            const pSecStr = pSec < 10 ? "0"+pSec : pSec;
            dashAvgEl.innerText = (pMin > 99) ? "--:--" : `${pMin}:${pSecStr}`;
            
            const label = dashAvgEl.parentElement.querySelector('.stat-label');
            const unit = dashAvgEl.parentElement.querySelector('.stat-unit');
            if(label) label.innerText = "Tahti";
            if(unit) unit.innerText = "min/km";
        }

        // 3. Suunta -> Kalorit (Arvio: 55 kcal / km)
        const cals = Math.floor(dist * 55);
        if(dashHeadingEl) {
            dashHeadingEl.innerText = cals;
            // Koska suunta-ruudussa on nuoli, piilotetaan se
            if(compassArrowEl) compassArrowEl.style.display = 'none';
            dashHeadingEl.style.fontSize = "20px"; // Palautetaan fonttikoko

            // Etsitään label (Suunta-ruudun rakenne on erilainen)
            const card = dashHeadingEl.closest('.stat-card');
            if(card) {
                const label = card.querySelector('.stat-label');
                if(label) label.innerText = "Kalorit";
            }
        }
        // Piilota G-pallo
        if(gBubbleEl) gBubbleEl.parentElement.parentElement.style.display = 'none';

    } else {
        // --- AUTO-TILA (Palautetaan normaalit) ---
        
        // 1. Max Speed
        if(dashMaxSpeedEl) {
            dashMaxSpeedEl.innerText = max.toFixed(1);
            const label = dashMaxSpeedEl.parentElement.querySelector('.stat-label');
            const unit = dashMaxSpeedEl.parentElement.querySelector('.stat-unit');
            if(label) label.innerText = "Huippu";
            if(unit) unit.innerText = "km/h";
        }

        // 2. Avg Speed
        if(dashAvgEl) {
            if(avg !== undefined) dashAvgEl.innerText = avg.toFixed(1);
            const label = dashAvgEl.parentElement.querySelector('.stat-label');
            const unit = dashAvgEl.parentElement.querySelector('.stat-unit');
            if(label) label.innerText = "Ø Nopeus";
            if(unit) unit.innerText = "km/h";
        }

        // 3. Suunta
        if(dashHeadingEl) {
            // Suunnan päivitys hoidetaan gps.js:ssä, mutta varmistetaan elementit
            if(compassArrowEl) compassArrowEl.style.display = 'inline-block';
            
            const card = dashHeadingEl.closest('.stat-card');
            if(card) {
                const label = card.querySelector('.stat-label');
                if(label) label.innerText = "Suunta";
            }
        }
        // Näytä G-pallo (paitsi jos minimalistinen)
        if(gBubbleEl && !document.body.classList.contains('minimalist-mode')) {
            gBubbleEl.parentElement.parentElement.style.display = 'block';
        }
    }

    // Muut (Matka, Aika, Korkeus) ovat yhteisiä
    if(dashDistEl) dashDistEl.innerText = dist.toFixed(2); 
    if(dashAltEl) dashAltEl.innerText = Math.round(alt);
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

// Ylävalikko
if (navBtns.dashboard) navBtns.dashboard.addEventListener('click', () => switchView('dashboard'));
if (navBtns.map) navBtns.map.addEventListener('click', () => switchView('map'));
if (navBtns.history) navBtns.history.addEventListener('click', () => switchView('history'));
if (navBtns.stats) navBtns.stats.addEventListener('click', () => switchView('stats'));
if (navBtns.settings) navBtns.settings.addEventListener('click', () => switchView('settings'));
if (navBtns.help) navBtns.help.addEventListener('click', () => {
    switchView('help');
    if(typeof renderHelp === 'function') renderHelp('fi');
});

// Alapalkki
if (botNavBtns.dashboard) botNavBtns.dashboard.addEventListener('click', () => switchView('dashboard'));
if (botNavBtns.map) botNavBtns.map.addEventListener('click', () => switchView('map'));
if (botNavBtns.history) botNavBtns.history.addEventListener('click', () => switchView('history'));
if (botNavBtns.stats) botNavBtns.stats.addEventListener('click', () => switchView('stats'));
if (botNavBtns.settings) botNavBtns.settings.addEventListener('click', () => switchView('settings'));


// --- HUD NAPPI & LOGIIKKA ---
if (btnHud) {
    btnHud.addEventListener('click', async () => {
        const isHudOn = document.body.classList.toggle('hud-mode');
        
        if (isHudOn) {
            showToast("HUD-tila (Koko näyttö). Napauta ruutua poistuaksesi. 🌑");
            if (document.documentElement.requestFullscreen) {
                try { await document.documentElement.requestFullscreen(); } catch(e) { console.log(e); }
            }
            if (screen.orientation && typeof screen.orientation.lock === 'function') {
                try { setTimeout(() => { screen.orientation.lock('portrait').catch(err => console.log(err)); }, 200); } catch(e) {}
            }
        } else {
            if (screen.orientation && typeof screen.orientation.unlock === 'function') screen.orientation.unlock();
            if (document.exitFullscreen) document.exitFullscreen().catch(e => console.log(e));
        }
    });
}

document.body.addEventListener('click', (e) => {
    if (document.body.classList.contains('hud-mode')) {
        if (e.target.id === 'btn-hud' || e.target.parentElement?.id === 'btn-hud') return;
        document.body.classList.remove('hud-mode');
        if (screen.orientation && typeof screen.orientation.unlock === 'function') screen.orientation.unlock();
        if (document.exitFullscreen && document.fullscreenElement) document.exitFullscreen().catch(e => console.log(e));
    }
});


// --- 5. TANKKAUS (TALLENNUSLUKKO) ---

function populateFuelCarSelect(selectedId, selectElement = inpFuelCarSelect) {
    if(!selectElement) return;
    selectElement.innerHTML = "";
    const validCars = userCars.filter(c => c.type !== 'bike' && c.type !== 'walking' && !c.isArchived);
    if(validCars.length === 0) {
        const opt = document.createElement('option');
        opt.text = "Ei tankattavia ajoneuvoja";
        selectElement.appendChild(opt);
        return;
    }
    validCars.forEach(car => {
        const opt = document.createElement('option');
        opt.value = car.id;
        const icon = car.icon || "🚗";
        opt.text = `${icon} ${car.name}`;
        if(selectedId && car.id === selectedId) opt.selected = true;
        selectElement.appendChild(opt);
    });
}

if (btnOpenFuel) {
    btnOpenFuel.addEventListener('click', () => {
        if (currentCarType === 'bike') { showToast("Polkupyörää ei voi tankata! 🚲🚫"); return; }
        if (currentCarType === 'walking') { showToast("Kävelyä ei voi tankata! 🚶🚫"); return; }

        const now = new Date();
        if(inpFuelDate) inpFuelDate.value = now.toISOString().split('T')[0];
        if(inpFuelTime) inpFuelTime.value = now.toTimeString().split(' ')[0].substring(0,5);
        if(inpFuelOdo) inpFuelOdo.value = "";
        if(inpFuelLiters) inpFuelLiters.value = "";
        if(inpFuelEuros) inpFuelEuros.value = "";
        if(inpFuelCalc) inpFuelCalc.innerText = "0.00";
        if(inpFuelEditKey) inpFuelEditKey.value = ""; 
        if(fuelModalTitle) fuelModalTitle.innerText = "⛽ Uusi tankkaus";
        const targetId = (currentCarId !== 'all' && currentCarId !== 'all_archived') ? currentCarId : null;
        populateFuelCarSelect(targetId);
        if(fuelModal) fuelModal.style.display = 'flex';
    });
}

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

function calcPrice() {
    const l = parseFloat(inpFuelLiters.value) || 0;
    const e = parseFloat(inpFuelEuros.value) || 0;
    if(l > 0 && inpFuelCalc) inpFuelCalc.innerText = (e/l).toFixed(3);
    else if(inpFuelCalc) inpFuelCalc.innerText = "0.00";
}
if(inpFuelLiters) inpFuelLiters.addEventListener('input', calcPrice);
if(inpFuelEuros) inpFuelEuros.addEventListener('input', calcPrice);

if (btnFuelSave) {
    btnFuelSave.addEventListener('click', () => {
        const date = inpFuelDate.value;
        const time = inpFuelTime.value;
        const odo = inpFuelOdo.value;
        const lit = inpFuelLiters.value;
        const eur = inpFuelEuros.value;
        const selectedCarId = inpFuelCarSelect ? inpFuelCarSelect.value : null;
        const editKey = inpFuelEditKey.value;

        if(!selectedCarId || selectedCarId === 'Ei tankattavia ajoneuvoja') { showToast("Valitse ajoneuvo!"); return; }
        if(!date || !lit || !eur) { showToast("Täytä pakolliset tiedot (pvm, litrat, eurot)!"); return; }

        if(currentUser) {
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
                btnFuelSave.disabled = false;
                btnFuelSave.innerText = originalText;
                if(fuelModal) fuelModal.style.display = 'none';
                if (!editKey) { inpFuelLiters.value = ""; inpFuelEuros.value = ""; }
                showToast(editKey ? "Tankkaus päivitetty! ✏️" : "Tankkaus tallennettu! ⛽");
                if(window.renderFuelList) window.renderFuelList();
            };
            const onError = (error) => {
                btnFuelSave.disabled = false;
                btnFuelSave.innerText = originalText;
                alert("Virhe: " + error.message);
            };

            if (editKey) {
                db.ref('ajopaivakirja/' + currentUser.uid + '/' + editKey).update(refData).then(onComplete).catch(onError);
            } else {
                db.ref('ajopaivakirja/' + currentUser.uid).push().set(refData).then(onComplete).catch(onError);
            }
        }
    });
}

// --- 6. MANUAALINEN LISÄYS ---

if (btnManualDrive) {
    btnManualDrive.addEventListener('click', () => {
        const now = new Date();
        const dateStr = now.toISOString().slice(0,16);
        if(inpManualDate) inpManualDate.value = dateStr;
        if(inpManualStart) inpManualStart.value = "";
        if(inpManualEnd) inpManualEnd.value = "";
        if(inpManualDist) inpManualDist.value = "";
        if(inpManualSubj) inpManualSubj.value = "";
        
        if(inpManualCar) populateFuelCarSelect(null, inpManualCar);
        if(manualModal) manualModal.style.display = 'flex';
    });
}

if (btnManualCancel) btnManualCancel.addEventListener('click', () => { if(manualModal) manualModal.style.display = 'none'; });

if (btnManualSave) {
    btnManualSave.addEventListener('click', () => {
        const dateTime = inpManualDate.value;
        const carId = inpManualCar.value;
        const dist = parseFloat(inpManualDist.value);
        const typeEls = document.getElementsByName('manual-type');
        let driveType = 'private';
        for(let r of typeEls) if(r.checked) driveType = r.value;

        if (!dateTime || !carId || isNaN(dist)) { showToast("Täytä aika, auto ja matka!"); return; }

        if (currentUser) {
            const origText = btnManualSave.innerText;
            btnManualSave.disabled = true;
            btnManualSave.innerText = "Tallennetaan...";

            const carObj = userCars.find(c => c.id === carId);
            const carName = carObj ? carObj.name : "Tuntematon";
            const carIcon = carObj ? (carObj.icon || "🚗") : "🚗";
            const carType = carObj ? carObj.type : "car";

            const driveData = {
                type: 'manual_drive',
                startTime: new Date(dateTime).toISOString(),
                endTime: new Date(new Date(dateTime).getTime() + (dist * 60000)).toISOString(),
                distanceKm: dist.toFixed(2),
                maxSpeed: 0, avgSpeed: 0, durationMs: 0,
                subject: inpManualSubj.value || "Manuaalinen kirjaus",
                weather: "", drivingStyle: "Manuaalinen",
                carName: carName, carIcon: carIcon, carId: carId, carType: carType,
                route: [], driveType: driveType,
                startAddress: inpManualStart.value, endAddress: inpManualEnd.value
            };

            db.ref('ajopaivakirja/' + currentUser.uid).push().set(driveData)
                .then(() => {
                    btnManualSave.disabled = false;
                    btnManualSave.innerText = origText;
                    if(manualModal) manualModal.style.display = 'none';
                    showToast("Ajo lisätty manuaalisesti! 📝");
                    if(typeof window.renderHistoryList === 'function') window.renderHistoryList();
                })
                .catch(err => {
                    btnManualSave.disabled = false;
                    btnManualSave.innerText = origText;
                    alert("Virhe: " + err.message);
                });
        }
    });
}

// --- CSV EXPORT & PREVIEW ---
if(btnExportCsv) {
    btnExportCsv.addEventListener('click', () => {
        if(typeof window.populatePreviewTable === 'function') {
            window.populatePreviewTable();
            if(previewModal) previewModal.style.display = 'flex';
        } else {
            if(typeof exportToCSV === 'function') exportToCSV();
        }
    });
}

if(btnPreviewCancel) btnPreviewCancel.addEventListener('click', () => { if(previewModal) previewModal.style.display = 'none'; });

if(btnPreviewConfirm) {
    btnPreviewConfirm.addEventListener('click', () => {
        if(typeof window.exportToCSV === 'function') {
            window.exportToCSV();
            if(previewModal) previewModal.style.display = 'none';
            showToast("Raportti ladattu! 📥");
        }
    });
}

// --- 7. APUFUNKTIOT ---

const btnEditSave2 = document.getElementById('btn-edit-save');
if(btnEditSave2) {
    // Estetään duplikaatit
    const newBtn = btnEditSave2.cloneNode(true);
    btnEditSave2.parentNode.replaceChild(newBtn, btnEditSave2);
    
    newBtn.addEventListener('click', () => {
        const key = document.getElementById('edit-key').value;
        const newCarId = document.getElementById('edit-car-select').value;
        const newSubj = document.getElementById('edit-subject').value;
        const newDateTime = document.getElementById('edit-datetime').value;
        const newDist = document.getElementById('edit-distance').value;
        
        const typeEls = document.getElementsByName('edit-type');
        let newType = 'private';
        for(let r of typeEls) if(r.checked) newType = r.value;

        const carObj = userCars.find(c => c.id === newCarId);
        
        if (key && currentUser && carObj) {
            const origText = newBtn.innerText;
            newBtn.disabled = true;
            newBtn.innerText = "Tallennetaan...";

            const updates = { 
                subject: newSubj, 
                carId: carObj.id, 
                carName: carObj.name, 
                carIcon: carObj.icon || "🚗", 
                carType: carObj.type,
                driveType: newType
            };
            if (newDateTime) updates.startTime = new Date(newDateTime).toISOString();
            if (newDist) updates.distanceKm = parseFloat(newDist).toFixed(2);

            db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update(updates)
                .then(() => { 
                    newBtn.disabled = false;
                    newBtn.innerText = origText;
                    if(editModal) editModal.style.display = 'none'; 
                    showToast("Muutokset tallennettu! ✅");
                    if(window.renderHistoryList) window.renderHistoryList();
                })
                .catch(err => {
                    newBtn.disabled = false;
                    newBtn.innerText = origText;
                    alert("Virhe tallennuksessa: " + err.message);
                });
        }
    });
}

// --- RESTORED TABS LOGIC ---
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

// ==========================================
// UUSI LOGIIKKA: ULKOASUASETUKSET & RAPORTIT
// ==========================================

// 1. VÄRIVALINTA
const colorOptions = document.querySelectorAll('.color-option');
if (colorOptions.length > 0) {
    colorOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            document.querySelectorAll('.color-option').forEach(el => el.classList.remove('selected'));
            opt.classList.add('selected');
            const newColor = opt.getAttribute('data-color');
            document.documentElement.style.setProperty('--accent-color', newColor);
            document.documentElement.style.setProperty('--speed-color', newColor);
            localStorage.setItem('accentColor', newColor);
            showToast("Väriteema vaihdettu! 🎨");
        });
    });
}

// 2. MINIMALISTINEN TILA
const toggleMinimal = document.getElementById('toggle-minimalist');

function setMinimalistMode(enable) {
    if (enable) {
        document.body.classList.add('minimalist-mode');
        if(toggleMinimal) toggleMinimal.checked = true;
    } else {
        document.body.classList.remove('minimalist-mode');
        if(toggleMinimal) toggleMinimal.checked = false;
    }
    localStorage.setItem('minimalistMode', enable ? 'true' : 'false');
}

if (toggleMinimal) {
    toggleMinimal.addEventListener('change', (e) => {
        setMinimalistMode(e.target.checked);
    });
}

if (btnDashMinimal) {
    btnDashMinimal.addEventListener('click', () => {
        const isMin = document.body.classList.contains('minimalist-mode');
        setMinimalistMode(!isMin); 
        showToast(!isMin ? "Yksinkertaistettu tila: PÄÄLLÄ" : "Yksinkertaistettu tila: POIS");
    });
}

// 3. KOMPAKTI HISTORIA
const toggleCompact = document.getElementById('toggle-compact-history');
if (toggleCompact) {
    toggleCompact.addEventListener('change', (e) => {
        const logList = document.getElementById('log-list');
        if (e.target.checked) {
            if(logList) logList.classList.add('compact');
            localStorage.setItem('compactHistory', 'true');
        } else {
            if(logList) logList.classList.remove('compact');
            localStorage.setItem('compactHistory', 'false');
        }
    });
}

// 4. KM-KORVAUS (UUSI v6.10)
if (inputPricePerKm) {
    inputPricePerKm.addEventListener('change', () => {
        const val = parseFloat(inputPricePerKm.value);
        if (!isNaN(val)) {
            localStorage.setItem('pricePerKm', val);
            if(typeof showToast === 'function') showToast(`Km-korvaus tallennettu: ${val} €/km`);
        }
    });
}

// --- 6. RAPORTOINTIMODAALI (UUSI v6.10) ---
if (btnOpenReport) {
    btnOpenReport.addEventListener('click', () => {
        if (reportModal) reportModal.style.display = 'flex';
        if (typeof updateReportPreview === 'function') updateReportPreview();
    });
}

if (btnReportClose) {
    btnReportClose.addEventListener('click', () => {
        if (reportModal) reportModal.style.display = 'none';
    });
}

if (btnReportDownload) {
    btnReportDownload.addEventListener('click', () => {
        if (typeof generateReport === 'function') {
            generateReport();
            if (reportModal) reportModal.style.display = 'none';
        }
    });
}

// Kuuntele muutoksia raporttimodaalissa esikatselua varten
const reportInputs = document.querySelectorAll('#report-period, #report-car, input[name="report-type"]');
reportInputs.forEach(input => {
    input.addEventListener('change', () => {
        if (typeof updateReportPreview === 'function') updateReportPreview();
    });
});


// --- 7. ALUSTUS ---
(function updateVersionText() {
    if(typeof APP_VERSION !== 'undefined') {
        if(splashVersionEl) splashVersionEl.innerText = "Modular v" + APP_VERSION;
        if(menuVersionEl) menuVersionEl.innerText = "Mikkokalevin Ajopäiväkirja Pro v" + APP_VERSION;
    }
})();

// LATAA TALLENNETUT ASETUKSET
window.addEventListener('DOMContentLoaded', () => {
    // Palauta viimeisin näkymä (jos on)
    const lastView = localStorage.getItem('lastView');
    if (lastView && views[lastView]) {
        switchView(lastView);
    } else {
        switchView('dashboard');
    }
    
    const savedColor = localStorage.getItem('accentColor');
    if (savedColor) {
        document.documentElement.style.setProperty('--accent-color', savedColor);
        document.documentElement.style.setProperty('--speed-color', savedColor);
        const opts = document.querySelectorAll('.color-option');
        opts.forEach(o => {
            o.classList.remove('selected');
            if (o.getAttribute('data-color') === savedColor) o.classList.add('selected');
        });
    }
    
    const savedMinimal = localStorage.getItem('minimalistMode');
    if (savedMinimal === 'true') {
        setMinimalistMode(true);
        if(toggleMinimal) toggleMinimal.checked = true;
    }
    
    const savedCompact = localStorage.getItem('compactHistory');
    if (savedCompact === 'true') {
        const logList = document.getElementById('log-list');
        if(logList) logList.classList.add('compact');
        if(toggleCompact) toggleCompact.checked = true;
    }
    
    // Lataa km-hinta
    const savedPrice = localStorage.getItem('pricePerKm');
    if (savedPrice && inputPricePerKm) {
        inputPricePerKm.value = savedPrice;
    }
});
