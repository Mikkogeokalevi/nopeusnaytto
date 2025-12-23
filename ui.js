// =========================================================
// UI.JS - KÄYTTÖLIITTYMÄ JA NAVIGOINTI (REFACTORED v6.1)
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

// Mittariston elementit (Dashboard)
const dashSpeedEl = document.getElementById('dash-speed');
const dashMaxEl = document.getElementById('dash-max-speed');
const dashDistEl = document.getElementById('dash-dist');
const dashTimeEl = document.getElementById('dash-time');
const dashAvgEl = document.getElementById('dash-avg');
const dashAltEl = document.getElementById('dash-alt');
const dashHeadingEl = document.getElementById('dash-heading');
const compassArrowEl = document.getElementById('compass-arrow');
const dashAddressEl = document.getElementById('dash-address');
const dashCoordsEl = document.getElementById('dash-coords');
const dashWeatherEl = document.getElementById('dash-weather');
const dashClockEl = document.getElementById('dash-clock');
const dashDateEl = document.getElementById('dash-date');

const liveStatusBar = document.getElementById('live-status-bar');
const liveStyleEl = document.getElementById('live-style-indicator');
const gBubbleEl = document.getElementById('g-bubble');

// Modaalit (Save drive dialog)
const saveModal = document.getElementById('save-modal');
const modalDistEl = document.getElementById('modal-dist');
const modalTimeEl = document.getElementById('modal-time');
const modalCarNameEl = document.getElementById('modal-car-name');
const modalSubjectEl = document.getElementById('modal-subject');
const btnModalSave = document.getElementById('btn-modal-save');
const btnModalCancel = document.getElementById('btn-modal-cancel');

// Kontrollit
const btnStartRec = document.getElementById('btn-start-rec');
const activeRecBtns = document.getElementById('active-rec-btns');
const btnPause = document.getElementById('btn-pause');
const btnResume = document.getElementById('btn-resume');
const btnStopRec = document.getElementById('btn-stop-rec');
const statusEl = document.getElementById('status');
const mapGpsToggle = document.getElementById('map-gps-toggle');
const mapSpeedEl = document.getElementById('map-speed');
const mapCoordsEl = document.getElementById('map-coords');

// Manuaalinen lisäys & Tankkaus
const btnManualDrive = document.getElementById('btn-manual-drive');
const manualModal = document.getElementById('manual-drive-modal');
const btnOpenFuel = document.getElementById('btn-open-fuel');
const fuelModal = document.getElementById('fuel-modal');

// --- 2. VIEW MANAGEMENT ---
const views = {
    dashboard: document.getElementById('dashboard-view'),
    map: document.getElementById('map-view'),
    history: document.getElementById('history-view'),
    stats: document.getElementById('stats-view'),
    settings: document.getElementById('settings-view'),
    help: document.getElementById('help-view')
};

// Globaali funktio näkymän vaihtoon
window.switchView = function(viewName) {
    // Piilota kaikki
    Object.values(views).forEach(el => {
        if(el) {
            el.style.display = 'none';
            el.classList.remove('active-view');
        }
    });
    
    // Näytä valittu
    if (views[viewName]) {
        if (viewName === 'dashboard') {
            views[viewName].style.display = 'flex'; // Flex dashboardille
        } else {
            views[viewName].style.display = 'block';
        }
        views[viewName].classList.add('active-view');
        
        // Päivitä tila
        isViewingHistory = (viewName === 'history');
        
        // Map resize fix
        if (viewName === 'map' && map) {
            setTimeout(() => map.invalidateSize(), 100);
        }
    }
    
    // Sulje menu
    if(mainMenu) mainMenu.style.display = 'none';
    
    // Päivitä valikon aktiivisuus
    document.querySelectorAll('.menu-item').forEach(btn => btn.classList.remove('active-menu'));
    const activeBtn = document.getElementById('nav-' + viewName);
    if(activeBtn) activeBtn.classList.add('active-menu');
};

// --- 3. DASHBOARD PÄIVITYS ---
// Tätä kutsutaan gps.js:stä
window.updateDashboardUI = function(speed, max, dist, timeStr, alt, avg) {
    if(dashSpeedEl) {
        // Jos nopeus on yli 100, pienennetään fonttia hieman (luokka style.css:ssä)
        if(speed >= 100) dashSpeedEl.classList.add('three-digits');
        else dashSpeedEl.classList.remove('three-digits');
        dashSpeedEl.innerText = speed.toFixed(1);
    }
    
    if(dashMaxEl) dashMaxEl.innerText = max.toFixed(0);
    if(dashDistEl) dashDistEl.innerText = dist.toFixed(2);
    if(dashAvgEl && avg !== null) dashAvgEl.innerText = avg.toFixed(1);
    if(dashAltEl && alt !== null) dashAltEl.innerText = Math.round(alt);
    
    // Aika päivittyy gps.js:n timerissa, mutta jos se tulee parametrina:
    if(timeStr && dashTimeEl) dashTimeEl.innerText = timeStr;
};

// Kello ja PVM päivitys
setInterval(() => {
    const now = new Date();
    if(dashClockEl) dashClockEl.innerText = now.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
    if(dashDateEl) dashDateEl.innerText = now.toLocaleDateString('fi-FI');
}, 1000);

// --- 4. NAVIGAATIO & MENU ---
if(menuBtn) {
    menuBtn.addEventListener('click', () => {
        if (mainMenu.style.display === 'block') {
            mainMenu.style.display = 'none';
        } else {
            mainMenu.style.display = 'block';
        }
    });
}

// Sulje menu jos klikkaa ohi
document.addEventListener('click', (e) => {
    if (mainMenu && mainMenu.style.display === 'block' && 
        !mainMenu.contains(e.target) && e.target !== menuBtn) {
        mainMenu.style.display = 'none';
    }
});

// Navigaationapit
['dashboard', 'map', 'history', 'stats', 'settings', 'help'].forEach(view => {
    const btn = document.getElementById('nav-' + view);
    if(btn) btn.addEventListener('click', () => window.switchView(view));
});

if(appLogo) appLogo.addEventListener('click', () => window.switchView('dashboard'));
if(sideTapLeft) sideTapLeft.addEventListener('click', () => window.switchView('map'));
if(mapReturnBtn) mapReturnBtn.addEventListener('click', () => window.switchView('dashboard'));

// --- 5. TALLENNUSLOGIIKKA (MANUAL & FUEL) ---

// A. Manuaalinen ajo
if (btnManualDrive) {
    btnManualDrive.addEventListener('click', () => {
        if(manualModal) manualModal.style.display = 'flex';
        
        // Alusta kentät
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        document.getElementById('manual-date').value = now.toISOString().slice(0,16);
        document.getElementById('manual-start-addr').value = "";
        document.getElementById('manual-end-addr').value = "";
        document.getElementById('manual-dist').value = "";
        document.getElementById('manual-subject').value = "";
        
        // Täytä autovalikko
        const carSel = document.getElementById('manual-car-select');
        carSel.innerHTML = "";
        userCars.forEach(car => {
            if(!car.isArchived) {
                carSel.add(new Option(car.name, car.id));
            }
        });
        if(currentCarId !== 'all' && currentCarId !== 'all_archived') {
            carSel.value = currentCarId;
        }
    });
}

const btnManualSave = document.getElementById('btn-manual-save');
if (btnManualSave) {
    btnManualSave.addEventListener('click', saveManualDrive);
}

function saveManualDrive() {
    if (!currentUser) return;
    
    const dist = parseFloat(document.getElementById('manual-dist').value);
    const carId = document.getElementById('manual-car-select').value;
    const dateVal = document.getElementById('manual-date').value;
    
    if (!dist || !carId || !dateVal) {
        alert("Täytä pakolliset kentät (Pvm, Auto, Matka).");
        return;
    }

    let type = 'private';
    document.getElementsByName('manual-type').forEach(r => { if(r.checked) type = r.value; });
    
    const car = userCars.find(c => c.id === carId);
    
    const driveData = {
        type: 'manual', // Tunniste että on manuaalinen
        startTime: new Date(dateVal).toISOString(),
        endTime: new Date(dateVal).toISOString(), // Sama aika
        distanceKm: dist,
        durationMs: 0, 
        avgSpeed: 0,
        maxSpeed: 0,
        subject: document.getElementById('manual-subject').value,
        driveType: type,
        carId: carId,
        carName: car ? car.name : "Tuntematon",
        carIcon: car ? (car.icon || "🚗") : "🚗",
        startAddress: document.getElementById('manual-start-addr').value,
        endAddress: document.getElementById('manual-end-addr').value
    };

    // Käytetään uutta DB_PATHS vakiota
    db.ref(DB_PATHS.DRIVELOG + currentUser.uid).push().set(driveData)
        .then(() => {
            if(manualModal) manualModal.style.display = 'none';
            window.showToast("Ajo lisätty manuaalisesti! 📝");
        })
        .catch(e => alert("Virhe: " + e.message));
}

const btnManualCancel = document.getElementById('btn-manual-cancel');
if(btnManualCancel) btnManualCancel.addEventListener('click', () => { if(manualModal) manualModal.style.display = 'none'; });


// B. Tankkaus (Fuel)
if (btnOpenFuel) {
    btnOpenFuel.addEventListener('click', () => {
        if(fuelModal) fuelModal.style.display = 'flex';
        
        const now = new Date();
        document.getElementById('fuel-date').valueAsDate = now;
        document.getElementById('fuel-time').value = now.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
        document.getElementById('fuel-odo').value = "";
        document.getElementById('fuel-liters').value = "";
        document.getElementById('fuel-euros').value = "";
        document.getElementById('fuel-price-calc').innerText = "0.00";
        
        // Autovalikko
        const carSel = document.getElementById('fuel-car-select');
        carSel.innerHTML = "";
        userCars.forEach(car => {
            if(!car.isArchived && car.type !== 'bike') { // Ei pyöriä tankkaukseen
                carSel.add(new Option("⛽ " + car.name, car.id));
            }
        });
        if(currentCarId !== 'all' && currentCarType !== 'bike') {
            carSel.value = currentCarId;
        }
    });
}

// Litrahinnan automaattilaskenta
const fLit = document.getElementById('fuel-liters');
const fEur = document.getElementById('fuel-euros');
const fCalc = document.getElementById('fuel-price-calc');

function updateFuelPrice() {
    const l = parseFloat(fLit.value);
    const e = parseFloat(fEur.value);
    if(l > 0 && e > 0) {
        fCalc.innerText = (e / l).toFixed(3);
    } else {
        fCalc.innerText = "0.00";
    }
}
if(fLit) fLit.addEventListener('input', updateFuelPrice);
if(fEur) fEur.addEventListener('input', updateFuelPrice);

const btnFuelSave = document.getElementById('btn-fuel-save');
if (btnFuelSave) {
    btnFuelSave.addEventListener('click', saveRefueling);
}

function saveRefueling() {
    if (!currentUser) return;
    
    const carId = document.getElementById('fuel-car-select').value;
    const lit = parseFloat(fLit.value);
    const eur = parseFloat(fEur.value);
    const odo = parseInt(document.getElementById('fuel-odo').value);
    const dateVal = document.getElementById('fuel-date').value;
    const timeVal = document.getElementById('fuel-time').value;

    if (!carId || !lit || !eur || !dateVal) {
        alert("Täytä pakolliset kentät!");
        return;
    }

    const fullDate = new Date(dateVal + 'T' + timeVal);
    const car = userCars.find(c => c.id === carId);

    const fuelData = {
        type: 'refueling', // Tunniste
        startTime: fullDate.toISOString(),
        carId: carId,
        carName: car ? car.name : "Tuntematon",
        liters: lit,
        totalCost: eur,
        pricePerLiter: (eur/lit),
        odometer: odo || 0
    };

    // Tallennetaan samaan polkuun DRIVELOG, mutta tyypillä 'refueling'
    // History.js osaa sitten erotella nämä.
    db.ref(DB_PATHS.DRIVELOG + currentUser.uid).push().set(fuelData)
        .then(() => {
            if(fuelModal) fuelModal.style.display = 'none';
            window.showToast("Tankkaus tallennettu! ⛽");
        });
}

const btnFuelCancel = document.getElementById('btn-fuel-cancel');
if(btnFuelCancel) btnFuelCancel.addEventListener('click', () => { if(fuelModal) fuelModal.style.display = 'none'; });


// --- 6. APUFUNKTIOT ---

// Toast-ilmoitus (popup alareunassa)
window.showToast = function(msg) {
    const toast = document.getElementById('toast-notification');
    if(toast) {
        toast.innerText = msg;
        toast.classList.add('visible');
        setTimeout(() => {
            toast.classList.remove('visible');
        }, 3000);
    }
};

// Vahvistus-modaali (korvaa window.confirm)
window.openConfirmModal = function(title, msg, onConfirm) {
    const modal = document.getElementById('custom-confirm-modal');
    const titleEl = document.getElementById('confirm-title');
    const msgEl = document.getElementById('confirm-msg');
    const btnYes = document.getElementById('btn-confirm-yes');
    const btnNo = document.getElementById('btn-confirm-no');
    
    if(modal && titleEl && msgEl && btnYes && btnNo) {
        titleEl.innerText = title;
        msgEl.innerText = msg;
        
        // Puhdistetaan vanhat kuuntelijat kloonaamalla
        const newYes = btnYes.cloneNode(true);
        const newNo = btnNo.cloneNode(true);
        btnYes.parentNode.replaceChild(newYes, btnYes);
        btnNo.parentNode.replaceChild(newNo, btnNo);
        
        newYes.addEventListener('click', () => {
            modal.style.display = 'none';
            onConfirm();
        });
        
        newNo.addEventListener('click', () => {
            modal.style.display = 'none';
        });
        
        modal.style.display = 'flex';
    } else {
        // Fallback jos modaalia ei löydy
        if(confirm(title + "\n\n" + msg)) onConfirm();
    }
};

// --- 7. ALUSTUS ---
(function initUI() {
    // Versiotiedot
    if(typeof APP_CONFIG !== 'undefined') {
        const v = APP_CONFIG.VERSION;
        if(splashVersionEl) splashVersionEl.innerText = "Ladataan v" + v + "...";
        if(menuVersionEl) menuVersionEl.innerText = "Mikkokalevin Ajopäiväkirja Pro v" + v;
    }

    // Tilastojen välilehdet
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
})();
