// =========================================================
// UI.JS - KÄYTTÖLIITTYMÄELEMENTIT JA NÄKYMÄT (FIXED v6.8)
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

// MUOKKAUS MODAALI (Logit)
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

// CONFIRM MODAL
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


// --- 3. UI LOGIIKKA & NAVIGAATIO ---

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
        if (viewName === 'dashboard') targetEl.style.display = 'flex';
        else targetEl.style.display = 'block'; 
        targetEl.classList.add('active-view');
    }
    
    if(navBtns[viewName]) navBtns[viewName].classList.add('active-menu');

    if (viewName !== 'map') {
        if (typeof clearSavedRoute === 'function') clearSavedRoute();
        isViewingHistory = false;
        if(mapLegend) mapLegend.style.display = 'none';
    }
    if (viewName === 'map' && map) setTimeout(() => map.invalidateSize(), 100);
    
    // Pakotetaan päivitys
    if (viewName === 'history' && typeof loadHistory === 'function') loadHistory();
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


// --- 5. TANKKAUS (EDIT & DELETE FIX) ---

function populateFuelCarSelect(selectedId) {
    if(!inpFuelCarSelect) return;
    inpFuelCarSelect.innerHTML = "";
    const validCars = userCars.filter(c => c.type !== 'bike' && !c.isArchived);
    if(validCars.length === 0) {
        inpFuelCarSelect.add(new Option("Ei tankattavia ajoneuvoja", ""));
        return;
    }
    validCars.forEach(car => {
        const opt = new Option(`${car.icon||"🚗"} ${car.name}`, car.id);
        if(selectedId && car.id === selectedId) opt.selected = true;
        inpFuelCarSelect.appendChild(opt);
    });
}

// Lisätään polttoainetyypin valinta dynaamisesti modaaliin, jos se puuttuu
function ensureFuelTypeField() {
    if (document.getElementById('fuel-type-container')) return;
    
    // Etsitään paikka litra/hinta kenttien jälkeen
    const litersField = document.getElementById('fuel-liters').parentNode.parentNode; // .display:flex container
    
    const div = document.createElement('div');
    div.id = 'fuel-type-container';
    div.style.marginBottom = "15px";
    div.style.textAlign = "left";
    
    div.innerHTML = `
        <label>Polttoaine</label>
        <select id="fuel-type-select" class="subject-input">
            <option value="Bensiini">Bensiini</option>
            <option value="Diesel">Diesel</option>
            <option value="Sähkö">Sähkö</option>
            <option value="Muu">Muu</option>
        </select>
    `;
    
    // Lisätään DOMiin oikeaan kohtaan (esim. ennen laskuria)
    const calc = document.getElementById('fuel-price-calc').parentNode;
    fuelModal.querySelector('.modal-content').insertBefore(div, calc);
}

if (btnOpenFuel) {
    btnOpenFuel.addEventListener('click', () => {
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
        if(inpFuelEditKey) inpFuelEditKey.value = ""; 
        if(fuelModalTitle) fuelModalTitle.innerText = "⛽ Uusi tankkaus";
        
        ensureFuelTypeField();
        
        // Valitse auto ja sen polttoaine oletukseksi
        const targetId = (currentCarId !== 'all' && currentCarId !== 'all_archived') ? currentCarId : null;
        populateFuelCarSelect(targetId);
        
        const car = userCars.find(c => c.id === targetId);
        if (car && document.getElementById('fuel-type-select')) {
            const fType = car.fuel || "Bensiini";
            // Yritetään mätsätä yksinkertaiseen listaan
            const sel = document.getElementById('fuel-type-select');
            if (fType.toLowerCase().includes('diesel')) sel.value = "Diesel";
            else if (fType.toLowerCase().includes('sähkö')) sel.value = "Sähkö";
            else sel.value = "Bensiini"; 
        }

        if(fuelModal) fuelModal.style.display = 'flex';
    });
}

window.editRefueling = (key) => {
    const ref = allRefuelings.find(r => r.key === key);
    if(!ref) return;
    
    // PVM & Aika
    let dateVal = "", timeVal = "";
    if (ref.date && ref.date.includes('T')) {
        const parts = ref.date.split('T');
        dateVal = parts[0];
        timeVal = parts[1].substring(0,5);
    } else if (ref.startTime) {
        const d = new Date(ref.startTime);
        dateVal = d.toISOString().split('T')[0];
        timeVal = d.toTimeString().substring(0,5);
    }
    
    if(inpFuelDate) inpFuelDate.value = dateVal;
    if(inpFuelTime) inpFuelTime.value = timeVal;
    if(inpFuelOdo) inpFuelOdo.value = ref.odo || ref.odometer || "";
    if(inpFuelLiters) inpFuelLiters.value = ref.liters || "";
    if(inpFuelEuros) inpFuelEuros.value = ref.euros || ref.totalCost || "";
    if(inpFuelCalc) inpFuelCalc.innerText = ref.pricePerLiter || "0.00";
    if(inpFuelEditKey) inpFuelEditKey.value = key; 
    
    if(fuelModalTitle) fuelModalTitle.innerText = "✏️ Muokkaa tankkausta";
    
    ensureFuelTypeField();
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
        const fType = document.getElementById('fuel-type-select') ? document.getElementById('fuel-type-select').value : "";

        if(!selectedCarId) { showToast("Valitse ajoneuvo!"); return; }
        if(!date || !lit || !eur) { showToast("Täytä pakolliset tiedot!"); return; }

        if(currentUser) {
            const originalText = btnFuelSave.innerText;
            btnFuelSave.disabled = true;
            btnFuelSave.innerText = "Tallennetaan...";

            const car = userCars.find(c => c.id === selectedCarId);
            
            const refData = {
                type: 'refueling', // Yhtenäinen tyyppi
                startTime: new Date(date + "T" + time).toISOString(), // Yhtenäinen aika
                date: date + "T" + time, // Legacy tuki
                odo: odo,
                odometer: odo,
                liters: lit,
                euros: eur,
                totalCost: eur,
                pricePerLiter: (parseFloat(eur)/parseFloat(lit)).toFixed(3),
                carId: selectedCarId,
                carName: car ? car.name : "Tuntematon",
                fuelType: fType
            };

            const dbPath = (typeof DB_PATHS !== 'undefined') ? DB_PATHS.DRIVELOG : 'ajopaivakirja/';

            const onComplete = () => {
                btnFuelSave.disabled = false;
                btnFuelSave.innerText = originalText;
                if(fuelModal) fuelModal.style.display = 'none';
                showToast(editKey ? "Tankkaus päivitetty! ✏️" : "Tankkaus tallennettu! ⛽");
                
                // Pakota listojen päivitys
                if(typeof loadHistory === 'function') loadHistory();
            };

            if (editKey) {
                db.ref(dbPath + currentUser.uid + '/' + editKey).update(refData).then(onComplete);
            } else {
                db.ref(dbPath + currentUser.uid).push().set(refData).then(onComplete);
            }
        }
    });
}

// --- 6. MANUAALINEN LISÄYS (FIX: LÄHTÖ/MÄÄRÄNPÄÄ TALLENNUS) ---

if (btnManualDrive) {
    btnManualDrive.addEventListener('click', () => {
        const now = new Date();
        const tzOffset = now.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(now - tzOffset)).toISOString().slice(0, 16);
        
        if(inpManualDate) inpManualDate.value = localISOTime;
        if(inpManualStart) inpManualStart.value = "";
        if(inpManualEnd) inpManualEnd.value = "";
        if(inpManualDist) inpManualDist.value = "";
        if(inpManualSubj) inpManualSubj.value = "";
        
        if(inpManualCar) {
            populateFuelCarSelect(currentCarId !== 'all' ? currentCarId : null);
        }
        if(manualModal) manualModal.style.display = 'flex';
    });
}

if (btnManualCancel) {
    btnManualCancel.addEventListener('click', () => { if(manualModal) manualModal.style.display = 'none'; });
}

if (btnManualSave) {
    btnManualSave.addEventListener('click', () => {
        const dateTime = inpManualDate.value;
        const carId = inpManualCar.value;
        const dist = parseFloat(inpManualDist.value);
        
        // Hae tyyppi
        let driveType = 'private';
        document.getElementsByName('manual-type').forEach(r => { if(r.checked) driveType = r.value; });

        if (!dateTime || !carId || isNaN(dist)) { showToast("Täytä aika, auto ja matka!"); return; }

        if (currentUser) {
            const origText = btnManualSave.innerText;
            btnManualSave.disabled = true;
            btnManualSave.innerText = "Tallennetaan...";

            const carObj = userCars.find(c => c.id === carId);
            
            const dbPath = (typeof DB_PATHS !== 'undefined') ? DB_PATHS.DRIVELOG : 'ajopaivakirja/';

            const driveData = {
                type: 'manual_drive',
                startTime: new Date(dateTime).toISOString(),
                endTime: new Date(new Date(dateTime).getTime() + (dist * 60000)).toISOString(),
                distanceKm: dist.toFixed(2),
                maxSpeed: 0, avgSpeed: 0, durationMs: 0,
                subject: inpManualSubj.value || "",
                carName: carObj ? carObj.name : "Tuntematon",
                carIcon: carObj ? (carObj.icon || "🚗") : "🚗",
                carId: carId,
                carType: carObj ? carObj.type : "car",
                route: [], 
                driveType: driveType,
                startAddress: inpManualStart.value, 
                endAddress: inpManualEnd.value
            };

            db.ref(dbPath + currentUser.uid).push().set(driveData)
                .then(() => {
                    btnManualSave.disabled = false;
                    btnManualSave.innerText = origText;
                    if(manualModal) manualModal.style.display = 'none';
                    showToast("Ajo lisätty manuaalisesti! 📝");
                    if(typeof loadHistory === 'function') loadHistory();
                });
        }
    });
}

// --- 7. AJON MUOKKAUS (INJECT OSOITTEET) ---

// Korvataan vanha btnEditSave kuuntelija uudella
const btnEditSaveNew = document.getElementById('btn-edit-save');
if(btnEditSaveNew) {
    // Kloonataan jotta vanhat kuuntelijat poistuvat
    const newBtn = btnEditSaveNew.cloneNode(true);
    btnEditSaveNew.parentNode.replaceChild(newBtn, btnEditSaveNew);
    
    newBtn.addEventListener('click', () => {
        const key = document.getElementById('edit-key').value;
        const newCarId = document.getElementById('edit-car-select').value;
        const newSubj = document.getElementById('edit-subject').value;
        const newDateTime = document.getElementById('edit-datetime').value;
        const newDist = document.getElementById('edit-distance').value;
        
        const newStart = document.getElementById('edit-start-addr') ? document.getElementById('edit-start-addr').value : "";
        const newEnd = document.getElementById('edit-end-addr') ? document.getElementById('edit-end-addr').value : "";
        
        let newType = 'private';
        document.getElementsByName('edit-type').forEach(r => { if(r.checked) newType = r.value; });

        const carObj = userCars.find(c => c.id === newCarId);
        
        if (key && currentUser) {
            const dbPath = (typeof DB_PATHS !== 'undefined') ? DB_PATHS.DRIVELOG : 'ajopaivakirja/';
            
            const updates = { 
                subject: newSubj, 
                carId: newCarId, 
                carName: carObj ? carObj.name : "Muu", 
                carIcon: carObj ? (carObj.icon || "🚗") : "🚗",
                driveType: newType,
                startAddress: newStart,
                endAddress: newEnd
            };
            if (newDateTime) updates.startTime = new Date(newDateTime).toISOString();
            if (newDist) updates.distanceKm = parseFloat(newDist).toFixed(2);

            db.ref(dbPath + currentUser.uid + '/' + key).update(updates)
                .then(() => { 
                    if(editModal) editModal.style.display = 'none'; 
                    showToast("Muutokset tallennettu! ✅");
                    if(typeof loadHistory === 'function') loadHistory();
                });
        }
    });
}

// Funktio, joka lisää osoitekentät muokkausikkunaan jos ne puuttuvat
window.ensureEditAddressFields = () => {
    const container = document.querySelector('#edit-modal .modal-content');
    if (!container || document.getElementById('edit-start-addr')) return;

    // Etsitään Aihe-kenttä
    const subjectDiv = document.getElementById('edit-subject').parentNode;
    
    const addrDiv = document.createElement('div');
    addrDiv.style.marginBottom = "10px";
    addrDiv.style.textAlign = "left";
    addrDiv.innerHTML = `
        <div style="display:flex; gap:10px;">
            <div style="flex:1;">
                <label>Lähtö:</label>
                <input type="text" id="edit-start-addr" class="subject-input">
            </div>
            <div style="flex:1;">
                <label>Määränpää:</label>
                <input type="text" id="edit-end-addr" class="subject-input">
            </div>
        </div>
    `;
    
    // Lisätään aiheen jälkeen
    container.insertBefore(addrDiv, subjectDiv.nextSibling);
};

// Päivitetään avausfunktio
window.openEditLog = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if(!drive) return;
    
    // Varmista kentät
    window.ensureEditAddressFields();
    
    document.getElementById('edit-key').value = key;
    
    // Aika
    const d = new Date(drive.startTime);
    const tzOffset = d.getTimezoneOffset() * 60000;
    document.getElementById('edit-datetime').value = (new Date(d - tzOffset)).toISOString().slice(0, 16);
    
    document.getElementById('edit-distance').value = drive.distanceKm || "";
    document.getElementById('edit-subject').value = drive.subject || "";
    
    if(document.getElementById('edit-start-addr')) document.getElementById('edit-start-addr').value = drive.startAddress || "";
    if(document.getElementById('edit-end-addr')) document.getElementById('edit-end-addr').value = drive.endAddress || "";
    
    // Tyyppi
    const targetType = drive.driveType || 'private';
    document.getElementsByName('edit-type').forEach(r => {
        if(r.value === targetType) r.checked = true;
    });
    
    // Auto
    const carSel = document.getElementById('edit-car-select');
    if(carSel) {
        carSel.innerHTML = "";
        userCars.forEach(car => {
            const opt = new Option(`${car.icon||"🚗"} ${car.name}`, car.id);
            if(drive.carId === car.id) opt.selected = true;
            carSel.appendChild(opt);
        });
    }

    if(editModal) editModal.style.display = 'flex';
};

// --- 8. POISTAMINEN ---
window.openDeleteLogModal = (key) => {
    deleteKey = key; // Globaali deleteKey (globals.js)
    if(deleteModal) deleteModal.style.display = 'flex';
};

if(btnDeleteConfirm) {
    const newDel = btnDeleteConfirm.cloneNode(true);
    btnDeleteConfirm.parentNode.replaceChild(newDel, btnDeleteConfirm);
    
    newDel.addEventListener('click', () => {
        if (deleteKey && currentUser) {
            const dbPath = (typeof DB_PATHS !== 'undefined') ? DB_PATHS.DRIVELOG : 'ajopaivakirja/';
            db.ref(dbPath + currentUser.uid + '/' + deleteKey).remove()
                .then(() => {
                    if(deleteModal) deleteModal.style.display = 'none';
                    deleteKey = null;
                    showToast("Merkintä poistettu 🗑");
                    // Jos tankkaus poistettiin, päivitetään historia
                    if(typeof loadHistory === 'function') loadHistory();
                });
        }
    });
}

if(btnDeleteCancel) {
    btnDeleteCancel.addEventListener('click', () => {
        if(deleteModal) deleteModal.style.display = 'none';
        deleteKey = null;
    });
}

// --- 9. ALUSTUS ---
window.addEventListener('DOMContentLoaded', () => {
    switchView('dashboard');
});
