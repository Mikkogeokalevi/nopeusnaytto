// =========================================================
// HISTORY.JS - HISTORIA, SUODATUS JA RAPORTOINTI (OPTIMIZED v6.1)
// =========================================================

// --- 1. MÄÄRITELLÄÄN ELEMENTIT ---
const filterEl = document.getElementById('history-filter');
const customFilterContainer = document.getElementById('custom-filter-container');
const filterStart = document.getElementById('filter-start');
const filterEnd = document.getElementById('filter-end');
const historySummaryEl = document.getElementById('history-summary');
const statsTimeRange = document.getElementById('stats-time-range');

// Varmistetaan globaalit funktiot (UI:n käyttöön)
window.renderHistoryList = renderHistoryList;
window.renderFuelList = renderFuelList;
window.renderStats = renderStats;
window.renderDriveStats = renderDriveStats;
window.renderFuelStats = renderFuelStats;
window.exportToCSV = exportToCSV;
window.populatePreviewTable = populatePreviewTable;

// --- 2. HISTORIAN LATAUS ---
function loadHistory() {
    if (!currentUser) return;

    // Poistetaan vanha kuuntelija, jotta ei tule tuplia
    db.ref(DB_PATHS.DRIVELOG + currentUser.uid).off();
    
    // Ladataan viimeiset 1000 ajoa (optimoitu järjestys)
    const historyRef = db.ref(DB_PATHS.DRIVELOG + currentUser.uid)
                         .orderByChild('startTime')
                         .limitToLast(1000); 

    historyRef.on('value', (snapshot) => {
        allHistoryData = [];
        allRefuelings = []; // Jos tankkaukset olisivat samassa kannassa (valmius)
        
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                if (data.type === 'refueling') {
                    allRefuelings.push({ key: child.key, ...data });
                } else {
                    allHistoryData.push({ key: child.key, ...data });
                }
            });
            // Käännetään järjestys: Uusin ensin
            allHistoryData.reverse();
            allRefuelings.reverse();
        }

        // Päivitetään näkymät
        if (views.history && views.history.style.display !== 'none') {
            renderHistoryList(); 
        }
        if (views.stats && views.stats.style.display !== 'none') {
            renderStats();
        }
        
        // Päivitetään suodatusvalikon vaihtoehdot (Autot joilla on ajettu)
        updateFilterOptions(); 
    });
}

// Päivittää suodatusvalikon (Näytä vain autot joilla on historiaa)
function updateFilterOptions() {
    if (!filterEl) return;
    const currentVal = filterEl.value;
    
    // Kerää uniikit auto-ID:t historiasta
    const usedCarIds = new Set(allHistoryData.map(d => d.carId));
    
    filterEl.innerHTML = '<option value="all">Kaikki ajot</option>';
    
    // 1. Omat autot (Garage)
    userCars.forEach(car => {
        if (usedCarIds.has(car.id)) {
            const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
            const opt = document.createElement('option');
            opt.value = car.id;
            opt.innerText = `${icon} ${car.name}`;
            filterEl.appendChild(opt);
        }
    });

    // 2. Tuntemattomat/Poistetut autot historiassa
    usedCarIds.forEach(id => {
        if (!userCars.find(c => c.id === id) && id !== undefined) {
            const opt = document.createElement('option');
            opt.value = id;
            opt.innerText = `❓ Tuntematon (${id})`;
            filterEl.appendChild(opt);
        }
    });
    
    filterEl.add(new Option("📅 Aikaväli...", "custom_range"));
    filterEl.value = currentVal;
}

// --- 3. LISTAUKSEN RENDERÖINTI ---
function renderHistoryList() {
    const list = document.getElementById('log-list');
    if (!list) return;
    list.innerHTML = "";

    const filterVal = filterEl ? filterEl.value : 'all';
    
    // Suodatuslogiikka
    let filtered = allHistoryData;
    
    if (filterVal === 'custom_range') {
        customFilterContainer.style.display = 'flex';
        const start = filterStart.value ? new Date(filterStart.value).getTime() : 0;
        const end = filterEnd.value ? new Date(filterEnd.value).getTime() + 86400000 : Infinity; // +1 päivä jotta haku on inclusive
        filtered = allHistoryData.filter(d => {
            const t = new Date(d.startTime).getTime();
            return t >= start && t < end;
        });
    } else {
        customFilterContainer.style.display = 'none';
        if (filterVal !== 'all') {
            filtered = allHistoryData.filter(d => d.carId === filterVal);
        }
    }

    // Yhteenveto (Summary Box)
    calculateSummary(filtered);

    if (filtered.length === 0) {
        list.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Ei ajoja valitulla rajauksella.</div>";
        return;
    }

    // Renderöinti
    filtered.forEach(drive => {
        const dateObj = new Date(drive.startTime);
        const dateStr = dateObj.toLocaleDateString('fi-FI');
        const timeStr = dateObj.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
        
        // Etsi auton tiedot
        let carName = drive.carName || "Tuntematon";
        let carIcon = drive.carIcon || "🚗";
        const carInfo = userCars.find(c => c.id === drive.carId);
        if (carInfo) {
            carName = carInfo.name;
            carIcon = carInfo.icon || (carInfo.type === 'bike' ? "🚲" : "🚗");
        }

        const isWork = (drive.driveType === 'work');
        const dist = parseFloat(drive.distanceKm || 0).toFixed(1);
        const dur = Math.round((drive.durationMs || 0) / 60000);
        
        // CSS-luokat
        const borderStyle = isWork ? "border-left: 4px solid #ff9800;" : "border-left: 4px solid var(--accent-color);"; // Työajo oranssi

        const div = document.createElement('div');
        div.className = 'log-card';
        div.style.cssText = borderStyle;

        div.innerHTML = `
            <div class="log-header">
                <div class="log-title-group">
                    <span class="log-date-line">${dateStr} • ${timeStr}</span>
                    <span class="log-car-big">${carIcon} ${carName}</span>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:18px; font-weight:bold; color:var(--text-color);">${dist} km</div>
                    <div style="font-size:11px; color:var(--subtext-color);">${dur} min</div>
                </div>
            </div>
            
            <div class="log-tags">
                ${isWork ? '<span class="tag" style="background:#ff9800; color:#000;">Työajo</span>' : ''}
                ${drive.weather ? `<span class="tag">${drive.weather}</span>` : ''}
                ${drive.drivingStyle ? `<span class="tag">${drive.drivingStyle}</span>` : ''}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:flex-end;">
                <div style="flex:1;">
                    <input type="text" class="subject-input" 
                        value="${drive.subject || ''}" 
                        placeholder="Lisää selite..." 
                        onchange="updateLogSubject('${drive.key}', this.value)">
                </div>
                <div style="display:flex; margin-left:10px;">
                    ${drive.route && drive.route.length > 0 ? `<button class="map-btn" onclick="openMapForDrive('${drive.key}')" title="Näytä kartalla">🗺</button>` : ''}
                    <button class="edit-btn" onclick="openEditLog('${drive.key}')">✏️</button>
                    <button class="delete-btn" onclick="openDeleteLogModal('${drive.key}')">🗑</button>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
}

function calculateSummary(data) {
    if (!historySummaryEl) return;
    
    let totalKm = 0;
    let totalWork = 0;
    let count = data.length;

    data.forEach(d => {
        const km = parseFloat(d.distanceKm || 0);
        totalKm += km;
        if(d.driveType === 'work') totalWork += km;
    });

    historySummaryEl.style.display = 'flex';
    document.getElementById('sum-val-1').innerText = count;
    document.getElementById('sum-label-1').innerText = "KPL";

    document.getElementById('sum-val-2').innerText = totalKm.toFixed(0);
    document.getElementById('sum-label-2').innerText = "KM (YHT)";

    document.getElementById('sum-val-3').innerText = totalWork.toFixed(0);
    document.getElementById('sum-label-3').innerText = "KM (TYÖ)";
}

// --- 4. TANKKAUSTEN LISTAUS (Placeholder) ---
function renderFuelList() {
    const list = document.getElementById('fuel-list');
    if(!list) return;
    list.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Tankkaushistoria on tulossa pian.</div>";
    // Tähän voidaan lisätä tankkausten renderöinti myöhemmin DB_PATHS logiikalla
}

// --- 5. TILASTOT (CHART.JS) ---
function renderStats() {
    if (document.getElementById('stats-drives-container').style.display !== 'none') {
        renderDriveStats();
    } else {
        renderFuelStats();
    }
}

function renderDriveStats() {
    // Aikaväli
    const range = statsTimeRange ? statsTimeRange.value : '30d';
    const now = new Date();
    let cutoff = 0;

    if(range === '7d') cutoff = now.getTime() - (7 * 86400000);
    else if(range === '30d') cutoff = now.getTime() - (30 * 86400000);
    else if(range === 'year') cutoff = new Date(now.getFullYear(), 0, 1).getTime();
    else cutoff = 0; // All time

    const filtered = allHistoryData.filter(d => new Date(d.startTime).getTime() >= cutoff);

    // Datan käsittely graafeille
    const dates = {};
    const vehicleDist = {};
    const styles = {};

    // Alustetaan nykyinen kuukausi/viikko jotta viiva ei ala tyhjästä
    filtered.forEach(d => {
        // PVM
        const dateStr = new Date(d.startTime).toLocaleDateString('fi-FI');
        if(!dates[dateStr]) dates[dateStr] = 0;
        dates[dateStr] += parseFloat(d.distanceKm || 0);

        // AUTO
        let cName = d.carName || "Muu";
        if(d.carId) {
            const c = userCars.find(x => x.id === d.carId);
            if(c) cName = c.name;
        }
        if(!vehicleDist[cName]) vehicleDist[cName] = 0;
        vehicleDist[cName] += parseFloat(d.distanceKm || 0);

        // TYYLI
        const s = d.drivingStyle || "Ei dataa";
        if(!styles[s]) styles[s] = 0;
        styles[s]++;
    });

    // 1. TREND (VIIVA)
    const ctxTrend = document.getElementById('chart-drive-trend');
    if(ctxTrend) {
        if(chartInstances.trend) chartInstances.trend.destroy();
        chartInstances.trend = new Chart(ctxTrend, {
            type: 'line',
            data: {
                labels: Object.keys(dates).reverse(), // Vanhin ensin
                datasets: [{
                    label: 'Kilometrit',
                    data: Object.values(dates).reverse(),
                    borderColor: '#2979ff',
                    backgroundColor: 'rgba(41, 121, 255, 0.1)',
                    fill: true,
                    tension: 0.3
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }

    // 2. AJONEUVOT (PIIRAKKA)
    const ctxVeh = document.getElementById('chart-drive-vehicles');
    if(ctxVeh) {
        if(chartInstances.vehicles) chartInstances.vehicles.destroy();
        chartInstances.vehicles = new Chart(ctxVeh, {
            type: 'doughnut',
            data: {
                labels: Object.keys(vehicleDist),
                datasets: [{
                    data: Object.values(vehicleDist),
                    backgroundColor: ['#2979ff', '#00e676', '#ff1744', '#ffea00', '#aa00ff']
                }]
            },
            options: { responsive: true }
        });
    }
    
    // 3. AJOTYYLI (BAR)
    const ctxStyle = document.getElementById('chart-drive-style');
    if(ctxStyle) {
        if(chartInstances.style) chartInstances.style.destroy();
        chartInstances.style = new Chart(ctxStyle, {
            type: 'bar',
            data: {
                labels: Object.keys(styles),
                datasets: [{
                    label: 'Ajot',
                    data: Object.values(styles),
                    backgroundColor: '#00e676'
                }]
            },
            options: { responsive: true, plugins: { legend: { display: false } } }
        });
    }
}

function renderFuelStats() {
    // Placeholder myöhempää käyttöä varten
}

// --- 6. EXPORT (CSV) ---
function exportToCSV() {
    if(typeof populatePreviewTable === 'function') {
        populatePreviewTable();
        const modal = document.getElementById('preview-modal');
        if(modal) modal.style.display = 'flex';
    } else {
        alert("Virhe: Esikatselufunktio puuttuu.");
    }
}

function populatePreviewTable() {
    // Haetaan suodatettu data
    // (Toistaiseksi otetaan kaikki näkyvissä olevat tai 'filtered' jos se olisi globaali.
    // Tässä yksinkertaistuksen vuoksi otetaan allHistoryData, ellei käyttäjä ole filtteröinyt)
    
    // TODO: Paranna tämä hakemaan renderöidystä listasta jos halutaan tarkka WYSIWYG
    const data = allHistoryData; 

    const tbody = document.getElementById('preview-tbody');
    if(!tbody) return;
    tbody.innerHTML = "";

    let totalKm = 0;

    data.forEach(d => {
        const tr = document.createElement('tr');
        const date = new Date(d.startTime).toLocaleString('fi-FI');
        const dist = parseFloat(d.distanceKm).toFixed(1).replace('.', ',');
        totalKm += parseFloat(d.distanceKm);
        
        tr.innerHTML = `
            <td style="padding:5px; border-bottom:1px solid #444;">${date}</td>
            <td style="padding:5px; border-bottom:1px solid #444;">${d.carName}</td>
            <td style="padding:5px; border-bottom:1px solid #444;">${d.driveType === 'work' ? 'Työ' : 'Oma'}</td>
            <td style="padding:5px; border-bottom:1px solid #444;">${dist}</td>
            <td style="padding:5px; border-bottom:1px solid #444;">${d.subject || ''}</td>
        `;
        tbody.appendChild(tr);
    });

    if(document.getElementById('preview-count')) document.getElementById('preview-count').innerText = data.length + " ajoa";
    if(document.getElementById('preview-total')) document.getElementById('preview-total').innerText = totalKm.toFixed(1) + " km";
}

// --- 7. TAPAHTUMAKUUNTELIJAT ---
// Lisätään kuuntelijat elementeille jos ne ovat olemassa
if(filterEl) filterEl.addEventListener('change', renderHistoryList);
if(filterStart) filterStart.addEventListener('change', renderHistoryList);
if(filterEnd) filterEnd.addEventListener('change', renderHistoryList);
if(statsTimeRange) statsTimeRange.addEventListener('change', renderStats);

// Globaalit apufunktiot HTML:n onclick-kutsuille
window.openMapForDrive = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if(drive && drive.route) {
        // Tallennetaan globaaliin muuttujaan piirtoa varten
        savedRouteLayer = L.polyline(drive.route.map(p => [p.lat, p.lng]), {color: '#ff9100', weight: 5}).addTo(map);
        // Siirrytään kartalle
        if(typeof switchView === 'function') switchView('map');
        // Zoomataan reittiin
        setTimeout(() => map.fitBounds(savedRouteLayer.getBounds(), {padding: [50,50]}), 200);
    }
};

window.openEditLog = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if(!drive) return;
    
    document.getElementById('edit-key').value = key;
    // PVM muunnos datetime-local formaattiin (yyyy-MM-ddThh:mm)
    const d = new Date(drive.startTime);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    document.getElementById('edit-datetime').value = d.toISOString().slice(0,16);
    
    document.getElementById('edit-distance').value = drive.distanceKm;
    document.getElementById('edit-subject').value = drive.subject || "";
    
    const carSel = document.getElementById('edit-car-select');
    carSel.innerHTML = "";
    userCars.forEach(car => {
        const opt = new Option(car.name, car.id);
        if(drive.carId === car.id) opt.selected = true;
        carSel.appendChild(opt);
    });

    const modal = document.getElementById('edit-modal');
    if(modal) modal.style.display = 'flex';
};

window.openDeleteLogModal = (key) => {
    deleteKey = key;
    const modal = document.getElementById('delete-modal');
    if(modal) modal.style.display = 'flex';
};

window.updateLogSubject = (key, text) => { 
    if(currentUser) db.ref(DB_PATHS.DRIVELOG + currentUser.uid + '/' + key).update({ subject: text }); 
};

// Varmistusnapit (Modal Actions)
const btnEditCancel2 = document.getElementById('btn-edit-cancel');
if(btnEditCancel2) btnEditCancel2.addEventListener('click', () => { 
    document.getElementById('edit-modal').style.display = 'none'; 
});

const btnEditSave = document.getElementById('btn-edit-save');
if(btnEditSave) btnEditSave.addEventListener('click', () => {
    const key = document.getElementById('edit-key').value;
    const dist = document.getElementById('edit-distance').value;
    const subj = document.getElementById('edit-subject').value;
    const carId = document.getElementById('edit-car-select').value;
    const dateVal = document.getElementById('edit-datetime').value;
    
    // Tyyppi
    let type = 'private';
    document.getElementsByName('edit-type').forEach(r => { if(r.checked) type = r.value; });

    if(key && currentUser) {
        const updates = {
            distanceKm: dist,
            subject: subj,
            carId: carId,
            driveType: type,
            startTime: new Date(dateVal).toISOString()
        };
        db.ref(DB_PATHS.DRIVELOG + currentUser.uid + '/' + key).update(updates)
            .then(() => {
                document.getElementById('edit-modal').style.display = 'none';
                if(typeof showToast === 'function') showToast("Tiedot päivitetty.");
            });
    }
});

const btnDeleteCancel2 = document.getElementById('btn-delete-cancel');
if(btnDeleteCancel2) btnDeleteCancel2.addEventListener('click', () => { 
    document.getElementById('delete-modal').style.display = 'none'; 
    deleteKey = null; 
});

const btnDeleteConfirm2 = document.getElementById('btn-delete-confirm');
if(btnDeleteConfirm2) btnDeleteConfirm2.addEventListener('click', () => {
    if(deleteKey && currentUser) {
        db.ref(DB_PATHS.DRIVELOG + currentUser.uid + '/' + deleteKey).remove()
            .then(() => {
                document.getElementById('delete-modal').style.display = 'none';
                deleteKey = null;
                if(typeof showToast === 'function') showToast("Merkintä poistettu 🗑");
            });
    }
});
