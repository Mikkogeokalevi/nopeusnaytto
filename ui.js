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
const dashLimitCardEl = document.getElementById('dash-limit-card');
const dashSpeedLimitEl = document.getElementById('dash-speed-limit');
const dashSpeedLimitSourceEl = document.getElementById('dash-speed-limit-source');
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

// POI (Paikkamerkinnät)
const poiListEl = document.getElementById('poi-list');
const btnPoiAddHere = document.getElementById('btn-poi-add-here');
const btnPoiAddCoords = document.getElementById('btn-poi-add-coords');
const btnPoiAddMap = document.getElementById('btn-poi-add-map');
const btnPoiImportCameras = document.getElementById('btn-poi-import-cameras');
const inpPoiImportCameras = document.getElementById('inp-poi-import-cameras');
const togglePoiDebug = document.getElementById('toggle-poi-debug');
const btnPoiDebugLog = document.getElementById('btn-poi-debug-log');
const poiMasterVolumeEl = document.getElementById('poi-master-volume');
const poiMasterVolumeValueEl = document.getElementById('poi-master-volume-value');
const poiSensitivityEl = document.getElementById('settings-poi-sensitivity');
const poiRearmDistanceEl = document.getElementById('settings-poi-rearm-distance');
const poiSoundSelectSpeedcamera = document.getElementById('settings-poi-sound-speedcamera');
const poiSoundSelectDanger = document.getElementById('settings-poi-sound-danger');
const poiSoundSelectCustomer = document.getElementById('settings-poi-sound-customer');
const poiSoundSelectReminder = document.getElementById('settings-poi-sound-reminder');
const poiSoundSelectOther = document.getElementById('settings-poi-sound-other');
const btnTestPoiSoundSpeedcamera = document.getElementById('btn-test-poi-sound-speedcamera');
const btnTestPoiSoundDanger = document.getElementById('btn-test-poi-sound-danger');
const btnTestPoiSoundCustomer = document.getElementById('btn-test-poi-sound-customer');
const btnTestPoiSoundReminder = document.getElementById('btn-test-poi-sound-reminder');
const btnTestPoiSoundOther = document.getElementById('btn-test-poi-sound-other');
const poiSearchEl = document.getElementById('poi-search');
const poiFilterTypeEl = document.getElementById('poi-filter-type');
const btnPoiShowMore = document.getElementById('btn-poi-show-more');
const btnPoiShowAll = document.getElementById('btn-poi-show-all');
const btnPoiNearby = document.getElementById('btn-poi-nearby');

const poiDebugLogModal = document.getElementById('poi-debug-log-modal');
const btnPoiDebugLogClose = document.getElementById('btn-poi-debug-log-close');
const poiDebugLogTextEl = document.getElementById('poi-debug-log-text');
const btnPoiDebugLogCopy = document.getElementById('btn-poi-debug-log-copy');
const btnPoiDebugLogClear = document.getElementById('btn-poi-debug-log-clear');
const btnPoiDebugRunTests = document.getElementById('btn-poi-debug-run-tests');

const poiModal = document.getElementById('poi-modal');
const poiModalTitleEl = document.getElementById('poi-modal-title');
const btnPoiModalClose = document.getElementById('btn-poi-modal-close');
const poiModalIdEl = document.getElementById('poi-modal-id');
const poiModalTypeEl = document.getElementById('poi-modal-type');
const poiModalNameEl = document.getElementById('poi-modal-name');
const poiModalCoordsEl = document.getElementById('poi-modal-coords');
const poiModalLatEl = document.getElementById('poi-modal-lat');
const poiModalLngEl = document.getElementById('poi-modal-lng');
const poiModalAlertEl = document.getElementById('poi-modal-alert');
const poiModalRadiusEl = document.getElementById('poi-modal-radius');
const poiModalCooldownEl = document.getElementById('poi-modal-cooldown');
const poiModalBeepEl = document.getElementById('poi-modal-beep');
const poiModalSoundProfileEl = document.getElementById('poi-modal-sound-profile');
const btnPoiModalSave = document.getElementById('btn-poi-modal-save');
const btnPoiModalDelete = document.getElementById('btn-poi-modal-delete');

let poiRenderLimit = 60;
let poiNearbyMode = false;


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

window.appendPoiDebugLog = (msg) => {
    try {
        const key = 'poiDebugLog';
        const now = new Date();
        const ts = `${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}:${String(now.getSeconds()).padStart(2,'0')}`;
        const line = `[${ts}] ${String(msg || '')}`;

        let arr = [];
        try {
            arr = JSON.parse(localStorage.getItem(key) || '[]');
            if (!Array.isArray(arr)) arr = [];
        } catch (e) {
            arr = [];
        }

        arr.push(line);
        if (arr.length > 80) arr = arr.slice(arr.length - 80);
        localStorage.setItem(key, JSON.stringify(arr));
    } catch (e) {
        // ignore
    }
};

function getPoiDebugLogText() {
    try {
        const arr = JSON.parse(localStorage.getItem('poiDebugLog') || '[]');
        if (!Array.isArray(arr)) return '';
        return arr.join('\n');
    } catch (e) {
        return '';
    }
}

function refreshPoiDebugLogModal() {
    if (!poiDebugLogTextEl) return;
    poiDebugLogTextEl.value = getPoiDebugLogText();
}

async function copyTextToClipboard(text) {
    const t = String(text || '');
    if (!t) return false;

    try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === 'function') {
            await navigator.clipboard.writeText(t);
            return true;
        }
    } catch (e) {
        // fallback below
    }

    try {
        if (poiDebugLogTextEl) {
            poiDebugLogTextEl.focus();
            poiDebugLogTextEl.select();
            const ok = document.execCommand('copy');
            return !!ok;
        }
    } catch (e) {
        // ignore
    }
    return false;
}

function parsePoiCoordsInput(input) {
    const s = String(input || '').trim();
    if (!s) return null;

    // 1) Geokätköilymuoto
    if (/[NS].*[EW]/i.test(s) && typeof window.parseGeocacheCoordinates === 'function') {
        const parsed = window.parseGeocacheCoordinates(s);
        if (parsed && isFinite(parsed.lat) && isFinite(parsed.lng)) return { lat: parsed.lat, lng: parsed.lng };
    }

    // 2) CSV-tyyli: lon, lat, "name"
    const m = s.match(/^\s*([+-]?(?:\d+\.?\d*|\d*\.?\d+))\s*,\s*([+-]?(?:\d+\.?\d*|\d*\.?\d+))\s*,?\s*(?:"([^"]*)"\s*)?$/);
    if (m) {
        const a = parseFloat(m[1]);
        const b = parseFloat(m[2]);
        if (!isFinite(a) || !isFinite(b)) return null;
        // Oletus: lon,lat (kuten kameratiedostoissa)
        const res = { lat: b, lng: a };
        if (m[3] !== undefined && m[3] !== null) res.name = String(m[3]).trim();
        return res;
    }

    return null;
}

function applyCoordsFieldToLatLng() {
    if (!poiModalCoordsEl) return;
    const parsed = parsePoiCoordsInput(poiModalCoordsEl.value);
    if (!parsed) return;
    if (poiModalLatEl) poiModalLatEl.value = parsed.lat;
    if (poiModalLngEl) poiModalLngEl.value = parsed.lng;
    if (parsed.name && poiModalNameEl && !String(poiModalNameEl.value || '').trim()) {
        poiModalNameEl.value = parsed.name;
    }
}

if (poiModalCoordsEl) {
    poiModalCoordsEl.addEventListener('blur', applyCoordsFieldToLatLng);
    poiModalCoordsEl.addEventListener('paste', () => {
        setTimeout(applyCoordsFieldToLatLng, 0);
    });
}

window.showPersistentToast = (msg) => {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.innerText = msg;
    toast.classList.add('visible');
}

window.hidePersistentToast = () => {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.classList.remove('visible');
}

window.addEventListener('pointerdown', () => {
    if (typeof window.ensurePoiAudioContext === 'function') window.ensurePoiAudioContext();
}, { once: true });

window.openConfirmModal = (title, message, callback) => {
    if(confirmTitle) confirmTitle.innerText = title;
    if(confirmMsg) confirmMsg.innerText = message;
    confirmCallback = callback;
    if(confirmModal) confirmModal.style.display = 'flex';
}

// LATAUS FIREBASESTA (auth.js kutsuu tätä kirjautumisen jälkeen)
window.loadPOIs = function() {
    if (!currentUser) return;

    const ref = db.ref('poi/' + currentUser.uid);
    ref.off();
    ref.on('value', (snapshot) => {
        const list = [];
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                list.push({ id: child.key, ...child.val() });
            });
        }
        poiData = list;

        if (typeof renderPoiList === 'function') renderPoiList();
        if (typeof window.renderPOIsOnMap === 'function') window.renderPOIsOnMap();

    }, (err) => {
        console.error('POI load error:', err);
    });
}

function resetPoiListView() {
    poiRenderLimit = 60;
    poiNearbyMode = false;
    if (typeof renderPoiList === 'function') renderPoiList();
}

if (poiSearchEl) {
    poiSearchEl.addEventListener('input', () => {
        poiRenderLimit = 60;
        poiNearbyMode = false;
        renderPoiList();
    });
}

if (poiFilterTypeEl) {
    poiFilterTypeEl.addEventListener('change', () => {
        poiRenderLimit = 60;
        poiNearbyMode = false;
        renderPoiList();
    });
}

if (btnPoiShowMore) {
    btnPoiShowMore.addEventListener('click', () => {
        poiRenderLimit = Math.min(2000, poiRenderLimit + 100);
        renderPoiList();
    });
}

if (btnPoiShowAll) {
    btnPoiShowAll.addEventListener('click', () => {
        if (confirm('Näytetäänkö kaikki POI:t? Tämä voi olla hidasta jos POI:ta on paljon.')) {
            poiRenderLimit = 1000000;
            renderPoiList();
        }
    });
}

if (btnPoiNearby) {
    btnPoiNearby.addEventListener('click', () => {
        if (!lastLatLng) {
            if (typeof showToast === 'function') showToast('Odotetaan GPS-sijaintia...');
            return;
        }
        poiNearbyMode = !poiNearbyMode;
        poiRenderLimit = 80;
        if (typeof renderPoiList === 'function') renderPoiList();
        if (typeof showToast === 'function') showToast(poiNearbyMode ? 'Näytetään lähimmät POI:t' : 'Lähin-näkymä pois');
    });
}

// =========================================================
// POI (Paikkamerkinnät) - UI + Firebase CRUD
// =========================================================

function getPoiTypeLabel(type) {
    if (type === 'speedcamera') return 'Nopeuskamera';
    if (type === 'danger') return 'Vaara';
    if (type === 'customer') return 'Asiakas';
    if (type === 'reminder') return 'Muistutus';
    return 'Muu';
}

function getPoiTypeIcon(type) {
    if (type === 'speedcamera') return '📷';
    if (type === 'danger') return '⚠️';
    if (type === 'customer') return '🏁';
    if (type === 'reminder') return '📝';
    return '📍';
}

function normalizePoiSoundProfile(v) {
    const s = String(v || '').trim().toLowerCase();
    if (s === 'double_beep' || s === 'alarm_pulse' || s === 'single_chime' || s === 'soft_ping') return s;
    return '';
}

function getPoiSoundProfileLabel(v) {
    const s = normalizePoiSoundProfile(v);
    if (!s) return 'Auto';
    if (s === 'double_beep') return 'Double beep';
    if (s === 'alarm_pulse') return 'Alarm pulse';
    if (s === 'single_chime') return 'Single chime';
    if (s === 'soft_ping') return 'Soft ping';
    return 'Auto';
}

function renderPoiList() {
    if (!poiListEl) return;

    if (!currentUser) {
        poiListEl.innerHTML = '<div style="text-align:center; padding:15px; color:#888;">Kirjaudu sisään nähdäksesi POI:t.</div>';
        return;
    }

    let list = Array.isArray(poiData) ? poiData.slice() : [];

    const q = (poiSearchEl && typeof poiSearchEl.value === 'string') ? poiSearchEl.value.trim().toLowerCase() : '';
    const typeFilter = (poiFilterTypeEl && typeof poiFilterTypeEl.value === 'string') ? poiFilterTypeEl.value.trim().toLowerCase() : '';

    if (typeFilter) {
        list = list.filter(p => String(p?.type || '').trim().toLowerCase() === typeFilter);
    }

    if (q) {
        list = list.filter(p => {
            const name = String(p?.name || '').toLowerCase();
            const type = String(p?.type || '').toLowerCase();
            const label = String(getPoiTypeLabel(p?.type) || '').toLowerCase();
            return name.includes(q) || type.includes(q) || label.includes(q);
        });
    }

    if (poiNearbyMode && lastLatLng && typeof lastLatLng.lat === 'number' && typeof lastLatLng.lng === 'number') {
        list.forEach(p => {
            const pLat = (typeof p.lat === 'number') ? p.lat : parseFloat(p.lat);
            const pLng = (typeof p.lng === 'number') ? p.lng : parseFloat(p.lng);
            p._distM = (isFinite(pLat) && isFinite(pLng)) ? (getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, pLat, pLng) * 1000) : Infinity;
        });
        list.sort((a, b) => (a._distM || Infinity) - (b._distM || Infinity));
    } else {
        list.sort((a, b) => (b.updatedAt || b.createdAt || 0) - (a.updatedAt || a.createdAt || 0));
    }

    if (list.length === 0) {
        poiListEl.innerHTML = '<div style="text-align:center; padding:15px; color:#888;">Ei POI-merkintöjä. Lisää ensimmäinen.</div>';
        return;
    }

    poiListEl.innerHTML = '';
    const total = list.length;
    const limited = list.slice(0, Math.max(1, poiRenderLimit));

    if (total > limited.length) {
        const info = document.createElement('div');
        info.style.textAlign = 'center';
        info.style.padding = '8px';
        info.style.color = 'var(--subtext-color)';
        info.style.fontSize = '12px';
        info.innerText = `Näytetään ${limited.length}/${total}. Käytä hakua tai "Näytä lisää".`;
        poiListEl.appendChild(info);
    }

    limited.forEach(poi => {
        const div = document.createElement('div');
        div.className = 'car-item';
        div.style.display = 'flex';
        div.style.justifyContent = 'space-between';
        div.style.alignItems = 'center';
        div.style.padding = '12px';
        div.style.marginBottom = '10px';
        div.style.backgroundColor = 'var(--panel-bg)';
        div.style.border = '1px solid var(--border-color)';
        div.style.borderRadius = '8px';

        const title = poi.name || getPoiTypeLabel(poi.type);
        const icon = getPoiTypeIcon(poi.type);

        const enabled = (poi.alertEnabled === true || poi.alertEnabled === 1 || poi.alertEnabled === '1' || String(poi.alertEnabled).toLowerCase() === 'true');
        const radius = parseInt(poi.alertRadiusM || 350, 10);
        const cd = parseInt(poi.cooldownSec || 180, 10);
        const beepOn = (poi.beepEnabled !== false);
        const soundLabel = getPoiSoundProfileLabel(poi.soundProfile);

        const distSuffix = (poiNearbyMode && isFinite(poi._distM)) ? ` • ${Math.round(poi._distM)} m` : '';

        const infoDiv = document.createElement('div');
        infoDiv.style.flex = '1';
        infoDiv.style.paddingRight = '10px';
        infoDiv.innerHTML = `
            <strong style="font-size:15px;">${icon} ${title}</strong>
            <div style="font-size:12px; color:var(--subtext-color); margin-top:2px;">
                ${getPoiTypeLabel(poi.type)}${distSuffix} • ${enabled ? `Varoitus: PÄÄLLÄ (${radius}m / ${cd}s)` : 'Varoitus: POIS'} • Ääni: ${beepOn ? 'ON' : 'OFF'} (${soundLabel})
            </div>
            <div style="font-size:12px; color:var(--subtext-color); margin-top:2px;">
                ${typeof toGeocacheFormat === 'function' ? `${toGeocacheFormat(poi.lat, true)} ${toGeocacheFormat(poi.lng, false)}` : `${poi.lat}, ${poi.lng}`}
            </div>
        `;

        const btnGroup = document.createElement('div');
        btnGroup.style.display = 'flex';
        btnGroup.style.gap = '10px';

        const btnCenter = document.createElement('button');
        btnCenter.innerText = '🗺️';
        btnCenter.title = 'Näytä kartalla';
        btnCenter.className = 'icon-btn';
        btnCenter.onclick = () => {
            if (typeof window.centerMapOnPOI === 'function') window.centerMapOnPOI(poi);
            if (typeof switchView === 'function') switchView('map');
        };

        const btnEdit = document.createElement('button');
        btnEdit.innerText = '✏️';
        btnEdit.title = 'Muokkaa';
        btnEdit.className = 'icon-btn';
        btnEdit.onclick = () => openPoiEditor(poi);

        const btnDel = document.createElement('button');
        btnDel.innerText = '🗑';
        btnDel.title = 'Poista';
        btnDel.className = 'icon-btn';
        btnDel.style.color = '#ff4444';
        btnDel.style.borderColor = '#ff4444';
        btnDel.onclick = () => {
            if (typeof openConfirmModal === 'function') {
                openConfirmModal('Poista POI?', 'Haluatko varmasti poistaa tämän paikkamerkinnän?', () => deletePOI(poi.id));
            } else {
                if (confirm('Haluatko varmasti poistaa tämän paikkamerkinnän?')) deletePOI(poi.id);
            }
        };

        btnGroup.appendChild(btnCenter);
        btnGroup.appendChild(btnEdit);
        btnGroup.appendChild(btnDel);

        div.appendChild(infoDiv);
        div.appendChild(btnGroup);
        poiListEl.appendChild(div);
    });
}

function openPoiEditor(existingPoi = null, fixedCoords = null) {
    if (!currentUser) return;
    if (!poiModal) {
        return;
    }

    const isEdit = !!existingPoi && !!existingPoi.id;
    if (poiModalTitleEl) poiModalTitleEl.innerText = isEdit ? '📍 Muokkaa POI' : '📍 Lisää POI';
    if (poiModalIdEl) poiModalIdEl.value = isEdit ? existingPoi.id : '';

    const type = String(existingPoi?.type || 'speedcamera').trim().toLowerCase();
    if (poiModalTypeEl) poiModalTypeEl.value = type;

    const name = String(existingPoi?.name || '').trim();
    if (poiModalNameEl) poiModalNameEl.value = name;

    const lat = fixedCoords?.lat ?? existingPoi?.lat;
    const lng = fixedCoords?.lng ?? existingPoi?.lng;
    if (poiModalLatEl) poiModalLatEl.value = (typeof lat === 'number' ? lat : parseFloat(lat || 0)) || '';
    if (poiModalLngEl) poiModalLngEl.value = (typeof lng === 'number' ? lng : parseFloat(lng || 0)) || '';

    if (poiModalCoordsEl) {
        if (typeof toGeocacheFormat === 'function' && isFinite(parseFloat(poiModalLatEl?.value)) && isFinite(parseFloat(poiModalLngEl?.value))) {
            const lt = parseFloat(poiModalLatEl.value);
            const lg = parseFloat(poiModalLngEl.value);
            poiModalCoordsEl.value = `${toGeocacheFormat(lt, true)} ${toGeocacheFormat(lg, false)}`;
        } else {
            poiModalCoordsEl.value = '';
        }
    }

    const alertEnabled = (existingPoi?.alertEnabled === true || existingPoi?.alertEnabled === 1 || existingPoi?.alertEnabled === '1' || String(existingPoi?.alertEnabled).toLowerCase() === 'true');
    if (poiModalAlertEl) poiModalAlertEl.checked = isEdit ? alertEnabled : true;

    if (poiModalRadiusEl) poiModalRadiusEl.value = String(existingPoi?.alertRadiusM ?? 350);
    if (poiModalCooldownEl) poiModalCooldownEl.value = String(existingPoi?.cooldownSec ?? 180);
    if (poiModalBeepEl) poiModalBeepEl.checked = (existingPoi?.beepEnabled !== false);
    if (poiModalSoundProfileEl) poiModalSoundProfileEl.value = normalizePoiSoundProfile(existingPoi?.soundProfile);

    if (btnPoiModalDelete) btnPoiModalDelete.style.display = isEdit ? 'block' : 'none';
    poiModal.style.display = 'flex';
}

function deletePOI(poiId) {
    if (!currentUser || !poiId) return;
    return db.ref('poi/' + currentUser.uid + '/' + poiId).remove()
        .then(() => { if(typeof showToast === 'function') showToast('POI poistettu 🗑'); })
        .catch(err => alert('Virhe POI-poistossa: ' + err.message));
}

window.renderPoiList = renderPoiList;
window.openPoiEditor = openPoiEditor;
window.deletePOI = deletePOI;

window.openPoiEditorById = function(poiId) {
    if (!poiId) return;
    const poi = Array.isArray(poiData) ? poiData.find(p => p && p.id === poiId) : null;
    if (!poi) {
        if (typeof showToast === 'function') showToast('POI:tä ei löytynyt.');
        return;
    }
    openPoiEditor(poi, null);
}

window.deletePoiById = function(poiId) {
    if (!poiId) return;
    if (typeof openConfirmModal === 'function') {
        openConfirmModal('Poista POI?', 'Haluatko varmasti poistaa tämän paikkamerkinnän?', () => deletePOI(poiId));
    } else {
        if (confirm('Haluatko varmasti poistaa tämän paikkamerkinnän?')) deletePOI(poiId);
    }
}

// NAPIT
if (btnPoiAddHere) {
    btnPoiAddHere.addEventListener('click', () => {
        if (!lastLatLng) {
            if(typeof showToast === 'function') showToast('Odotetaan GPS-sijaintia...');
            return;
        }
        openPoiEditor(null, { lat: lastLatLng.lat, lng: lastLatLng.lng });
    });
}

function closePoiModal() {
    if (!poiModal) return;
    poiModal.style.display = 'none';
}

if (btnPoiModalClose) btnPoiModalClose.addEventListener('click', closePoiModal);
if (poiModal) {
    poiModal.addEventListener('click', (e) => {
        if (e.target === poiModal) closePoiModal();
    });
}

if (btnPoiModalSave) {
    btnPoiModalSave.addEventListener('click', () => {
        if (!currentUser) return;
        const id = poiModalIdEl ? poiModalIdEl.value : '';
        const isEdit = !!id;

        const type = String(poiModalTypeEl?.value || 'other').trim().toLowerCase();
        const name = String(poiModalNameEl?.value || '').trim();
        // Yritetään ensin parsia koordinaattikentästä, jos se on täytetty
        if (poiModalCoordsEl && String(poiModalCoordsEl.value || '').trim()) {
            applyCoordsFieldToLatLng();
        }

        const lat = parseFloat(poiModalLatEl?.value);
        const lng = parseFloat(poiModalLngEl?.value);
        if (!isFinite(lat) || !isFinite(lng)) {
            alert('Koordinaatit puuttuvat tai ovat virheelliset.');
            return;
        }

        const alertEnabled = !!poiModalAlertEl?.checked;
        const alertRadiusM = Math.max(30, parseInt(poiModalRadiusEl?.value || '350', 10) || 350);
        const cooldownSec = Math.max(0, parseInt(poiModalCooldownEl?.value || '180', 10) || 180);
        const beepEnabled = !!poiModalBeepEl?.checked;
        const soundProfile = normalizePoiSoundProfile(poiModalSoundProfileEl?.value || '');

        const payload = {
            name,
            type,
            lat,
            lng,
            alertEnabled,
            alertRadiusM,
            cooldownSec,
            beepEnabled,
            soundProfile,
            updatedAt: Date.now()
        };
        if (!isEdit) payload.createdAt = Date.now();

        const p = isEdit
            ? db.ref('poi/' + currentUser.uid + '/' + id).update(payload)
            : db.ref('poi/' + currentUser.uid).push().set(payload);

        p.then(() => {
            if (typeof showToast === 'function') showToast(isEdit ? 'POI päivitetty ✅' : 'POI lisätty ✅');
            closePoiModal();
        }).catch(err => alert('Virhe POI-tallennuksessa: ' + err.message));
    });
}

if (btnPoiModalDelete) {
    btnPoiModalDelete.addEventListener('click', () => {
        const id = poiModalIdEl ? poiModalIdEl.value : '';
        if (!id) return;
        window.deletePoiById(id);
        closePoiModal();
    });
}

if (btnPoiAddCoords) {
    btnPoiAddCoords.addEventListener('click', () => {
        openPoiEditor(null, null);
    });
}

if (btnPoiAddMap) {
    btnPoiAddMap.addEventListener('click', () => {
        poiAddMode = true;
        if(typeof showToast === 'function') {
            showToast('Kartalta lisäys: avaa Kartta ja tee pitkä painallus kohtaan.');
        }
        if (typeof switchView === 'function') switchView('map');
    });
}

function parseCameraLinesToPois(text, fileLabel = '') {
    const out = [];
    if (!text || typeof text !== 'string') return out;
    const prefix = (fileLabel && String(fileLabel).trim()) ? (String(fileLabel).trim() + ' - ') : '';
    const lines = text.split(/\r?\n/);
    for (const raw of lines) {
        const line = String(raw || '').trim();
        if (!line) continue;

        const m = line.match(/^\s*([+-]?(?:\d+\.?\d*|\d*\.?\d+))\s*,\s*([+-]?(?:\d+\.?\d*|\d*\.?\d+))\s*,?\s*(?:"([^"]*)"\s*)?$/);
        if (!m) continue;

        const lon = parseFloat(m[1]);
        const lat = parseFloat(m[2]);
        const rawName = (m[3] !== undefined && m[3] !== null) ? String(m[3]).trim() : '';
        const name = prefix + rawName;
        if (!isFinite(lat) || !isFinite(lon)) continue;

        out.push({
            name,
            type: 'speedcamera',
            lat,
            lng: lon,
            alertEnabled: true,
            alertRadiusM: 350,
            cooldownSec: 180,
            beepEnabled: true,
            createdAt: Date.now(),
            updatedAt: Date.now()
        });
    }
    return out;
}

async function importSpeedCamerasFromFiles(fileList) {
    if (!currentUser) return;
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    const allPois = [];
    for (const f of files) {
        const text = await f.text();
        const fileLabel = String(f.name || '').replace(/\.[^/.]+$/, '');
        const pois = parseCameraLinesToPois(text, fileLabel);
        allPois.push(...pois);
    }

    if (allPois.length === 0) {
        alert('Tuonti epäonnistui: tiedostoista ei löytynyt kelvollisia rivejä.');
        return;
    }

    const radiusStr = prompt('Varoitusetäisyys metreinä (esim. 350)', '350');
    if (radiusStr === null) return;
    const alertRadiusM = Math.max(30, parseInt(radiusStr, 10) || 350);

    const cdStr = prompt('Cooldown sekunteina (esim. 180)', '180');
    if (cdStr === null) return;
    const cooldownSec = Math.max(0, parseInt(cdStr, 10) || 180);

    const beepStr = prompt('Äänimerkki hälytyksessä? (1 = päällä, 0 = pois)', '1');
    if (beepStr === null) return;
    const beepEnabled = beepStr.trim() === '1' || beepStr.trim().toLowerCase() === 'true';

    const baseRef = db.ref('poi/' + currentUser.uid);

    // Deduplikointi/upsert: jos löytyy olemassa oleva (sama tiedostoprefix + lähellä), päivitetään eikä luoda uutta
    const existing = Array.isArray(poiData) ? poiData.filter(p => String(p?.type || '').trim().toLowerCase() === 'speedcamera') : [];
    const matchRadiusM = 35; // sallitaan pieni siirtymä

    const createBatch = {};
    let created = 0;
    let updated = 0;

    for (const p of allPois) {
        const nm = String(p.name || '');
        const filePrefix = nm.includes(' - ') ? nm.split(' - ')[0].trim() : '';
        const candidates = filePrefix ? existing.filter(e => String(e?.name || '').startsWith(filePrefix + ' - ')) : existing;

        let best = null;
        let bestDist = Infinity;
        for (const e of candidates) {
            const eLat = (typeof e.lat === 'number') ? e.lat : parseFloat(e.lat);
            const eLng = (typeof e.lng === 'number') ? e.lng : parseFloat(e.lng);
            if (!isFinite(eLat) || !isFinite(eLng)) continue;
            const dM = (getDistanceFromLatLonInKm(p.lat, p.lng, eLat, eLng) * 1000);
            if (dM < bestDist) {
                bestDist = dM;
                best = e;
            }
        }

        const payload = {
            ...p,
            alertRadiusM,
            cooldownSec,
            beepEnabled,
            updatedAt: Date.now()
        };

        if (best && best.id && bestDist <= matchRadiusM) {
            await baseRef.child(best.id).update(payload);
            updated++;
        } else {
            const key = baseRef.push().key;
            createBatch[key] = payload;
            created++;
        }
    }

    if (Object.keys(createBatch).length > 0) {
        await baseRef.update(createBatch);
    }

    if (typeof showToast === 'function') showToast(`Tuotu: ${created} • Päivitetty: ${updated} ✅`);
}

if (btnPoiImportCameras && inpPoiImportCameras) {
    btnPoiImportCameras.addEventListener('click', () => {
        if (!currentUser) {
            if (typeof showToast === 'function') showToast('Kirjaudu sisään tuodaksesi POI:t.');
            return;
        }
        inpPoiImportCameras.value = '';
        inpPoiImportCameras.click();
    });

    inpPoiImportCameras.addEventListener('change', async (e) => {
        try {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            const ok = confirm(`Tuodaanko ${files.length} tiedoston kamerat POI:ksi?`);
            if (!ok) return;
            await importSpeedCamerasFromFiles(files);
        } catch (err) {
            alert('Virhe tuonnissa: ' + err.message);
        }
    });
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

window.updateDashboardSpeedLimit = function(info) {
    if (!dashSpeedLimitEl || !dashSpeedLimitSourceEl || !dashLimitCardEl) return;

    const data = info || {};
    const val = Number(data.limitKmh);
    const source = String(data.source || 'unknown').toLowerCase();

    dashLimitCardEl.classList.remove('limit-exact', 'limit-estimated', 'limit-unknown');

    if (isFinite(val) && val > 0) {
        dashSpeedLimitEl.innerText = String(Math.round(val));
        if (source === 'estimated') {
            dashSpeedLimitSourceEl.innerText = 'Yleisrajoitus-arvio';
            dashLimitCardEl.classList.add('limit-estimated');
        } else {
            dashSpeedLimitSourceEl.innerText = 'Tiekohtainen';
            dashLimitCardEl.classList.add('limit-exact');
        }
        return;
    }

    dashSpeedLimitEl.innerText = '--';
    dashSpeedLimitSourceEl.innerText = 'Ei dataa';
    dashLimitCardEl.classList.add('limit-unknown');
};

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

// 3.5 POI DEBUG (näytä hylkäyssyyt toastina)
if (togglePoiDebug) {
    togglePoiDebug.addEventListener('change', (e) => {
        try {
            localStorage.setItem('poiDebug', e.target.checked ? '1' : '0');
        } catch (err) {}
        if (typeof showToast === 'function') showToast(e.target.checked ? 'POI debug: PÄÄLLÄ' : 'POI debug: POIS');
    });
}

if (btnPoiDebugLog) {
    btnPoiDebugLog.addEventListener('click', () => {
        refreshPoiDebugLogModal();
        if (poiDebugLogModal) poiDebugLogModal.style.display = 'flex';
    });
}

if (btnPoiDebugLogClose) {
    btnPoiDebugLogClose.addEventListener('click', () => {
        if (poiDebugLogModal) poiDebugLogModal.style.display = 'none';
    });
}

if (btnPoiDebugLogClear) {
    btnPoiDebugLogClear.addEventListener('click', () => {
        try { localStorage.removeItem('poiDebugLog'); } catch (e) {}
        refreshPoiDebugLogModal();
        if (typeof showToast === 'function') showToast('POI debug -loki tyhjennetty');
    });
}

if (btnPoiDebugLogCopy) {
    btnPoiDebugLogCopy.addEventListener('click', async () => {
        const txt = getPoiDebugLogText();
        const ok = await copyTextToClipboard(txt);
        if (typeof showToast === 'function') showToast(ok ? 'Kopioitu leikepöydälle' : 'Kopiointi ei onnistunut (voit valita tekstin käsin)');
    });
}

if (btnPoiDebugRunTests) {
    btnPoiDebugRunTests.addEventListener('click', () => {
        if (typeof window.runPoiRegressionTests !== 'function') {
            if (typeof showToast === 'function') showToast('POI regressiotesti ei ole saatavilla');
            return;
        }

        const out = window.runPoiRegressionTests();
        refreshPoiDebugLogModal();
        if (typeof showToast === 'function') {
            const msg = (out && out.summary) ? out.summary : 'POI regressiotesti suoritettu';
            showToast(msg);
        }
    });
}

function setPoiMasterVolumeText(v) {
    if (!poiMasterVolumeValueEl) return;
    const pct = Math.round(Math.max(0, Math.min(1, Number(v) || 0)) * 100);
    poiMasterVolumeValueEl.innerText = `${pct}%`;
}

function bindPoiSoundSelect(el, type) {
    if (!el || !type) return;
    el.addEventListener('change', () => {
        const value = String(el.value || '').trim().toLowerCase();
        if (!value) return;
        localStorage.setItem(`poiSoundProfile_${type}`, value);
        if (typeof showToast === 'function') showToast(`POI-ääni (${type}) päivitetty`);
    });
}

function bindPoiSoundTest(btn, type) {
    if (!btn || !type) return;
    btn.addEventListener('click', () => {
        if (typeof window.ensurePoiAudioContext === 'function') window.ensurePoiAudioContext();
        if (typeof window.playPoiAlertBeep === 'function') window.playPoiAlertBeep(type);
    });
}

if (poiMasterVolumeEl) {
    poiMasterVolumeEl.addEventListener('input', () => {
        const v = Math.max(0, Math.min(1, parseFloat(poiMasterVolumeEl.value) || 0));
        localStorage.setItem('poiBeepMasterGain', String(v));
        setPoiMasterVolumeText(v);
    });
}

if (poiSensitivityEl) {
    poiSensitivityEl.addEventListener('change', () => {
        const mode = String(poiSensitivityEl.value || 'normal').trim().toLowerCase();
        const normalized = (mode === 'strict' || mode === 'sensitive') ? mode : 'normal';
        localStorage.setItem('poiSensitivityMode', normalized);
        if (typeof showToast === 'function') {
            const txt = normalized === 'strict' ? 'Varma' : (normalized === 'sensitive' ? 'Herkkä' : 'Normaali');
            showToast(`POI herkkyys: ${txt}`);
        }
    });
}

if (poiRearmDistanceEl) {
    poiRearmDistanceEl.addEventListener('change', () => {
        const raw = parseInt(poiRearmDistanceEl.value || '400', 10);
        const val = isFinite(raw) ? Math.max(120, Math.min(2500, raw)) : 400;
        poiRearmDistanceEl.value = String(val);
        localStorage.setItem('poiRearmDistanceM', String(val));
        if (typeof showToast === 'function') showToast(`POI uudelleenhälytys: ${val} m`);
    });
}

bindPoiSoundSelect(poiSoundSelectSpeedcamera, 'speedcamera');
bindPoiSoundSelect(poiSoundSelectDanger, 'danger');
bindPoiSoundSelect(poiSoundSelectCustomer, 'customer');
bindPoiSoundSelect(poiSoundSelectReminder, 'reminder');
bindPoiSoundSelect(poiSoundSelectOther, 'other');

bindPoiSoundTest(btnTestPoiSoundSpeedcamera, 'speedcamera');
bindPoiSoundTest(btnTestPoiSoundDanger, 'danger');
bindPoiSoundTest(btnTestPoiSoundCustomer, 'customer');
bindPoiSoundTest(btnTestPoiSoundReminder, 'reminder');
bindPoiSoundTest(btnTestPoiSoundOther, 'other');

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

    // POI debug
    try {
        const savedPoiDebug = localStorage.getItem('poiDebug');
        if (togglePoiDebug) togglePoiDebug.checked = (savedPoiDebug === '1');
    } catch (e) {}

    // POI ääniasetukset
    try {
        const rawGain = parseFloat(localStorage.getItem('poiBeepMasterGain') || '0.45');
        const gain = isFinite(rawGain) ? Math.max(0, Math.min(1, rawGain)) : 0.45;
        if (poiMasterVolumeEl) poiMasterVolumeEl.value = String(gain);
        setPoiMasterVolumeText(gain);

        const sensitivityMode = String(localStorage.getItem('poiSensitivityMode') || 'normal').trim().toLowerCase();
        if (poiSensitivityEl) {
            poiSensitivityEl.value = (sensitivityMode === 'strict' || sensitivityMode === 'sensitive') ? sensitivityMode : 'normal';
        }

        const rawRearm = parseInt(localStorage.getItem('poiRearmDistanceM') || '400', 10);
        const rearmDist = isFinite(rawRearm) ? Math.max(120, Math.min(2500, rawRearm)) : 400;
        if (poiRearmDistanceEl) poiRearmDistanceEl.value = String(rearmDist);

        const defaults = {
            speedcamera: 'double_beep',
            danger: 'alarm_pulse',
            customer: 'soft_ping',
            reminder: 'single_chime',
            other: 'single_chime'
        };

        const savedSpeedcamera = String(localStorage.getItem('poiSoundProfile_speedcamera') || defaults.speedcamera).trim().toLowerCase();
        const savedDanger = String(localStorage.getItem('poiSoundProfile_danger') || defaults.danger).trim().toLowerCase();
        const savedCustomer = String(localStorage.getItem('poiSoundProfile_customer') || defaults.customer).trim().toLowerCase();
        const savedReminder = String(localStorage.getItem('poiSoundProfile_reminder') || defaults.reminder).trim().toLowerCase();
        const savedOther = String(localStorage.getItem('poiSoundProfile_other') || defaults.other).trim().toLowerCase();

        if (poiSoundSelectSpeedcamera) poiSoundSelectSpeedcamera.value = savedSpeedcamera;
        if (poiSoundSelectDanger) poiSoundSelectDanger.value = savedDanger;
        if (poiSoundSelectCustomer) poiSoundSelectCustomer.value = savedCustomer;
        if (poiSoundSelectReminder) poiSoundSelectReminder.value = savedReminder;
        if (poiSoundSelectOther) poiSoundSelectOther.value = savedOther;
    } catch (e) {}
    
    // Lataa km-hinta
    const savedPrice = localStorage.getItem('pricePerKm');
    if (savedPrice && inputPricePerKm) {
        inputPricePerKm.value = savedPrice;
    }
    
    // UUSI V6.14: Alusta visuaaliset elementit
    if (typeof initVisuals === 'function') {
        initVisuals();
    }
});
