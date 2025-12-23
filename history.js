// =========================================================
// HISTORY.JS - HISTORIA, SUODATUS JA RAPORTOINTI (FIXED v6.2)
// =========================================================

// --- 1. MÄÄRITELLÄÄN ELEMENTIT ---
const filterEl = document.getElementById('history-filter'); // Tämä on nyt AIKAVÄLI-valitsin
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

// Alustetaan aikavälivalikko heti
initTimeFilterOptions();

function initTimeFilterOptions() {
    if (!filterEl) return;
    // Tyhjennetään ja luodaan aikavälivaihtoehdot autojen sijaan
    filterEl.innerHTML = "";
    
    const options = [
        { val: '30d', text: 'Viimeiset 30 päivää' },
        { val: '7d', text: 'Viimeiset 7 päivää' },
        { val: 'this_year', text: 'Tämä vuosi' },
        { val: 'all_time', text: 'Koko historia' },
        { val: 'custom_range', text: 'Mukautettu väli...' }
    ];

    options.forEach(opt => {
        const el = document.createElement('option');
        el.value = opt.val;
        el.innerText = opt.text;
        filterEl.appendChild(el);
    });
    
    // Oletusvalinta
    filterEl.value = '30d';
}

// --- 2. HISTORIAN LATAUS ---
function loadHistory() {
    if (!currentUser) return;

    // Poistetaan vanha kuuntelija
    db.ref(DB_PATHS.DRIVELOG + currentUser.uid).off();
    
    // Ladataan data
    const historyRef = db.ref(DB_PATHS.DRIVELOG + currentUser.uid)
                         .orderByChild('startTime')
                         .limitToLast(1000); 

    historyRef.on('value', (snapshot) => {
        allHistoryData = [];
        allRefuelings = []; 
        
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                if (data.type === 'refueling') {
                    allRefuelings.push({ key: child.key, ...data });
                } else {
                    allHistoryData.push({ key: child.key, ...data });
                }
            });
            // Uusin ensin
            allHistoryData.reverse();
            allRefuelings.reverse();
        }

        // Päivitetään näkymät heti datan latauduttua
        if (views.history && views.history.style.display !== 'none') {
            renderHistoryList(); 
            // Jos tankkaus-tabi on auki, päivitä sekin
            const fuelList = document.getElementById('fuel-list');
            if(fuelList && fuelList.style.display !== 'none') renderFuelList();
        }
        if (views.stats && views.stats.style.display !== 'none') {
            renderStats();
        }
    });
}

// --- 3. LISTAKSEN RENDERÖINTI ---
function renderHistoryList() {
    const list = document.getElementById('log-list');
    if (!list) return;
    list.innerHTML = "";

    // 1. Haetaan aikaväli (Local dropdown)
    const timeFilter = filterEl ? filterEl.value : 'all_time';
    
    // Näytetäänkö mukautettu päivämäärävalinta?
    if (timeFilter === 'custom_range') {
        customFilterContainer.style.display = 'flex';
    } else {
        customFilterContainer.style.display = 'none';
    }

    // 2. SUODATUS (Global Car + Local Time)
    const filtered = allHistoryData.filter(d => {
        // A) AUTO SUODATUS (Tottelee yläpalkkia)
        let carMatch = false;
        
        if (currentCarId === 'all') {
            // Näytä kaikki paitsi arkistoidut
            const car = userCars.find(c => c.id === d.carId);
            // Jos autoa ei löydy (poistettu), näytetään se historiassa silti, tai jos se ei ole arkistoitu
            if (!car || !car.isArchived) carMatch = true;
        } else if (currentCarId === 'all_archived') {
            // Näytä kaikki (myös arkistoidut)
            carMatch = true;
        } else {
            // Tietty auto valittu
            if (d.carId === currentCarId) carMatch = true;
        }
        
        if (!carMatch) return false;

        // B) AIKA SUODATUS
        const driveTime = new Date(d.startTime).getTime();
        const now = Date.now();
        const oneDay = 86400000;

        if (timeFilter === '7d') {
            return driveTime >= (now - (7 * oneDay));
        } else if (timeFilter === '30d') {
            return driveTime >= (now - (30 * oneDay));
        } else if (timeFilter === 'this_year') {
            const startOfYear = new Date(new Date().getFullYear(), 0, 1).getTime();
            return driveTime >= startOfYear;
        } else if (timeFilter === 'custom_range') {
            const start = filterStart.value ? new Date(filterStart.value).getTime() : 0;
            const end = filterEnd.value ? new Date(filterEnd.value).getTime() + oneDay : Infinity;
            return driveTime >= start && driveTime < end;
        }
        
        return true; // 'all_time'
    });

    // Yhteenveto (Summary Box)
    calculateSummary(filtered);

    if (filtered.length === 0) {
        list.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Ei ajoja valitulla aikavälillä/autolla.</div>";
        return;
    }

    // Renderöinti
    filtered.forEach(drive => {
        const dateObj = new Date(drive.startTime);
        const dateStr = dateObj.toLocaleDateString('fi-FI');
        const timeStr = dateObj.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
        
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
        
        const borderStyle = isWork ? "border-left: 4px solid #ff9800;" : "border-left: 4px solid var(--accent-color);";

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

// --- 4. TANKKAUKSET (Päivitetty noudattamaan suodattimia) ---
function renderFuelList() {
    const list = document.getElementById('fuel-list');
    if(!list) return;
    list.innerHTML = "";

    const timeFilter = filterEl ? filterEl.value : 'all_time';

    // Suodatus (Sama logiikka kuin ajoissa)
    const filtered = allRefuelings.filter(r => {
        // A) AUTO
        let carMatch = false;
        if (currentCarId === 'all') {
            const car = userCars.find(c => c.id === r.carId);
            if (!car || !car.isArchived) carMatch = true;
        } else if (currentCarId === 'all_archived') {
            carMatch = true;
        } else {
            if (r.carId === currentCarId) carMatch = true;
        }
        if (!carMatch) return false;

        // B) AIKA
        const refTime = new Date(r.startTime).getTime();
        const now = Date.now();
        const oneDay = 86400000;

        if (timeFilter === '7d') return refTime >= (now - (7 * oneDay));
        if (timeFilter === '30d') return refTime >= (now - (30 * oneDay));
        if (timeFilter === 'this_year') return refTime >= new Date(new Date().getFullYear(), 0, 1).getTime();
        if (timeFilter === 'custom_range') {
            const start = filterStart.value ? new Date(filterStart.value).getTime() : 0;
            const end = filterEnd.value ? new Date(filterEnd.value).getTime() + oneDay : Infinity;
            return refTime >= start && refTime < end;
        }
        return true;
    });

    if (filtered.length === 0) {
        list.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Ei tankkauksia valitulla aikavälillä.</div>";
        return;
    }

    filtered.forEach(fuel => {
        const dateObj = new Date(fuel.startTime);
        const dateStr = dateObj.toLocaleDateString('fi-FI');
        
        let carName = fuel.carName || "Tuntematon";
        const carInfo = userCars.find(c => c.id === fuel.carId);
        if (carInfo) carName = carInfo.name;

        const div = document.createElement('div');
        div.className = 'log-card';
        div.style.borderLeft = "4px solid #00e676"; // Vihreä reuna tankkauksille

        div.innerHTML = `
            <div class="log-header">
                <div class="log-title-group">
                    <span class="log-date-line">${dateStr}</span>
                    <span class="log-car-big">⛽ ${carName}</span>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:18px; font-weight:bold; color:var(--text-color);">${parseFloat(fuel.totalCost).toFixed(2)} €</div>
                    <div style="font-size:11px; color:var(--subtext-color);">${parseFloat(fuel.liters).toFixed(1)} L</div>
                </div>
            </div>
            <div class="log-stats" style="grid-template-columns: 1fr 1fr;">
                 <div><span class="stat-label">Hinta/L</span>${parseFloat(fuel.pricePerLiter).toFixed(3)} €</div>
                 <div><span class="stat-label">Mittari</span>${fuel.odometer || '-'} km</div>
            </div>
        `;
        list.appendChild(div);
    });
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
    // Käytetään stats-näkymän omaa aikavalitsinta, ei historian
    const range = statsTimeRange ? statsTimeRange.value : '30d';
    const now = new Date();
    let cutoff = 0;

    if(range === '7d') cutoff = now.getTime() - (7 * 86400000);
    else if(range === '30d') cutoff = now.getTime() - (30 * 86400000);
    else if(range === 'year') cutoff = new Date(now.getFullYear(), 0, 1).getTime();
    else cutoff = 0; 

    // Suodatetaan ensin autot yläpalkin mukaan
    const carFiltered = allHistoryData.filter(d => {
        if (currentCarId === 'all') return !userCars.find(c => c.id === d.carId)?.isArchived;
        if (currentCarId === 'all_archived') return true;
        return d.carId === currentCarId;
    });

    const filtered = carFiltered.filter(d => new Date(d.startTime).getTime() >= cutoff);

    // Datan käsittely graafeille
    const dates = {};
    const vehicleDist = {};
    const styles = {};

    filtered.forEach(d => {
        const dateStr = new Date(d.startTime).toLocaleDateString('fi-FI');
        if(!dates[dateStr]) dates[dateStr] = 0;
        dates[dateStr] += parseFloat(d.distanceKm || 0);

        let cName = d.carName || "Muu";
        if(d.carId) {
            const c = userCars.find(x => x.id === d.carId);
            if(c) cName = c.name;
        }
        if(!vehicleDist[cName]) vehicleDist[cName] = 0;
        vehicleDist[cName] += parseFloat(d.distanceKm || 0);

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
                labels: Object.keys(dates).reverse(), 
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
    // Placeholder myöhempää käyttöä varten, logiikka vastaava kuin yllä
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
    // Käytetään samaa renderHistoryList-suodatuslogiikkaa datan hakemiseen
    // Jotta export vastaa tasan sitä mitä ruudulla näkyy
    
    const timeFilter = filterEl ? filterEl.value : 'all_time';
    
    const filteredData = allHistoryData.filter(d => {
        // A) AUTO
        let carMatch = false;
        if (currentCarId === 'all') {
            const car = userCars.find(c => c.id === d.carId);
            if (!car || !car.isArchived) carMatch = true;
        } else if (currentCarId === 'all_archived') {
            carMatch = true;
        } else {
            if (d.carId === currentCarId) carMatch = true;
        }
        if (!carMatch) return false;

        // B) AIKA
        const driveTime = new Date(d.startTime).getTime();
        const now = Date.now();
        const oneDay = 86400000;

        if (timeFilter === '7d') return driveTime >= (now - (7 * oneDay));
        if (timeFilter === '30d') return driveTime >= (now - (30 * oneDay));
        if (timeFilter === 'this_year') return driveTime >= new Date(new Date().getFullYear(), 0, 1).getTime();
        if (timeFilter === 'custom_range') {
            const start = filterStart.value ? new Date(filterStart.value).getTime() : 0;
            const end = filterEnd.value ? new Date(filterEnd.value).getTime() + oneDay : Infinity;
            return driveTime >= start && driveTime < end;
        }
        return true;
    });

    const tbody = document.getElementById('preview-tbody');
    if(!tbody) return;
    tbody.innerHTML = "";

    let totalKm = 0;

    filteredData.forEach(d => {
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

    if(document.getElementById('preview-count')) document.getElementById('preview-count').innerText = filteredData.length + " ajoa";
    if(document.getElementById('preview-total')) document.getElementById('preview-total').innerText = totalKm.toFixed(1) + " km";
}

// --- 7. TAPAHTUMAKUUNTELIJAT ---
if(filterEl) filterEl.addEventListener('change', () => {
    renderHistoryList();
    if(document.getElementById('fuel-list').style.display !== 'none') renderFuelList();
});
if(filterStart) filterStart.addEventListener('change', renderHistoryList);
if(filterEnd) filterEnd.addEventListener('change', renderHistoryList);
if(statsTimeRange) statsTimeRange.addEventListener('change', renderStats);

// Globaalit apufunktiot HTML:n onclick-kutsuille
window.openMapForDrive = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if(drive && drive.route) {
        savedRouteLayer = L.polyline(drive.route.map(p => [p.lat, p.lng]), {color: '#ff9100', weight: 5}).addTo(map);
        if(typeof switchView === 'function') switchView('map');
        setTimeout(() => map.fitBounds(savedRouteLayer.getBounds(), {padding: [50,50]}), 200);
    }
};

window.openEditLog = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if(!drive) return;
    
    document.getElementById('edit-key').value = key;
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
