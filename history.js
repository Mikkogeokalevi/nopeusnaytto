// =========================================================
// HISTORY.JS - HISTORIA, SUODATUS JA UI (FULL v6.5 SummaryFix)
// =========================================================

// --- 1. MÄÄRITELLÄÄN ELEMENTIT ---
// Huom: Osa elementeistä luodaan dynaamisesti buildHistoryToolbar-funktiossa
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

// --- 2. HISTORIAN LATAUS JA UI:N RAKENNUS ---
function loadHistory() {
    if (!currentUser) return;

    // 1. Rakennetaan "Siisti Toolbar" heti kun historia ladataan
    buildHistoryToolbar();

    // Poistetaan vanhat kuuntelijat
    db.ref(DB_PATHS.DRIVELOG + currentUser.uid).off();
    
    // Haetaan data
    const historyRef = db.ref(DB_PATHS.DRIVELOG + currentUser.uid)
                         .orderByChild('startTime')
                         .limitToLast(1000); 

    historyRef.on('value', (snapshot) => {
        allHistoryData = [];
        allRefuelings = []; 
        
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                // Tuki sekä vanhalle 'refuel' että uudelle 'refueling' tyypille
                if (data.type === 'refueling' || data.type === 'refuel') { 
                    allRefuelings.push({ key: child.key, ...data });
                } else {
                    allHistoryData.push({ key: child.key, ...data });
                }
            });
            // Järjestetään uusin ensin
            allHistoryData.reverse();
            allRefuelings.reverse();
        }

        // TÄRKEÄÄ: Asetetaan oletussuodatin ja pakotetaan päivitys heti datan tultua
        const filterEl = document.getElementById('history-filter-select');
        if (filterEl && !filterEl.value) {
            filterEl.value = '7d'; // Oletus: Viimeiset 7 päivää
        }
        
        refreshActiveView();
    });
}

function refreshActiveView() {
    // Tarkistetaan kumpi tabi on auki (Ajot vai Tankkaukset)
    const fuelList = document.getElementById('fuel-list');
    
    if (fuelList && fuelList.style.display !== 'none') {
        renderFuelList();
    } else {
        renderHistoryList();
    }
    // Päivitetään myös tilastot taustalla valmiiksi
    renderStats();
}

// --- 3. UUSI KÄYTTÖLIITTYMÄ (TOOLBAR) ---
function buildHistoryToolbar() {
    const historyView = document.getElementById('history-view');
    if (!historyView) return;

    // Tarkistetaan onko toolbar jo tehty
    if (document.getElementById('custom-history-toolbar')) return;

    // Haetaan olemassa olevat elementit talteen
    const logList = document.getElementById('log-list');
    const fuelList = document.getElementById('fuel-list');
    const summary = document.getElementById('history-summary');
    
    // Tyhjennetään näkymä
    historyView.innerHTML = ""; 
    
    const toolbar = document.createElement('div');
    toolbar.id = 'custom-history-toolbar';
    toolbar.style.paddingBottom = "10px";
    
    toolbar.innerHTML = `
        <h2 style="text-align:center; color:var(--accent-color); margin-top:0; margin-bottom:15px;">Ajohistoria</h2>
        
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:15px;">
            <button id="new-tab-drives" class="action-btn blue-btn" style="width:auto; font-size:13px; padding:8px 20px; flex:1; max-width:140px;">🏎️ Ajot</button>
            <button id="new-tab-fuel" class="action-btn" style="width:auto; font-size:13px; padding:8px 20px; background-color: #333; flex:1; max-width:140px;">⛽ Tankkaukset</button>
        </div>

        <div style="display:flex; align-items:center; gap:10px; margin-bottom:15px; background:rgba(255,255,255,0.05); padding:10px; border-radius:12px;">
            
            <div style="flex:1;">
                <select id="history-filter-select" class="subject-input" style="width: 100%; font-weight:bold; cursor:pointer;">
                    <option value="7d">📅 7 päivää</option>
                    <option value="30d">📅 30 päivää</option>
                    <option value="this_year">📅 Tämä vuosi</option>
                    <option value="all_time">📅 Kaikki</option>
                    <option value="custom_range">📅 Oma väli...</option>
                </select>
            </div>

            <div style="display:flex; gap:8px;">
                <button id="new-btn-manual" class="icon-btn" style="border-color:#444; background:#333;" title="Lisää manuaalisesti">📝</button>
                <button id="new-btn-csv" class="icon-btn" style="border-color:#00796b; background:#004d40;" title="Lataa Excel/CSV">📥</button>
            </div>
        </div>

        <div id="custom-filter-container" style="display:none; margin-bottom: 15px; text-align: center; background:rgba(0,0,0,0.2); padding:10px; border-radius:8px;">
            <div style="display:flex; gap:5px; align-items:center; justify-content:center;">
                <input type="date" id="filter-start" class="date-input" style="background:#222; color:#fff; border:1px solid #444; padding:5px; border-radius:4px;">
                <span>-</span>
                <input type="date" id="filter-end" class="date-input" style="background:#222; color:#fff; border:1px solid #444; padding:5px; border-radius:4px;">
            </div>
        </div>
    `;

    historyView.appendChild(toolbar);
    
    // Palautetaan listat ja summary DOMiin
    if(summary) historyView.appendChild(summary);
    if(logList) historyView.appendChild(logList);
    if(fuelList) historyView.appendChild(fuelList);

    // --- KYTKETÄÄN TAPAHTUMAKUUNTELIJAT ---
    
    // 1. Tabit
    document.getElementById('new-tab-drives').onclick = () => {
        document.getElementById('new-tab-drives').className = "action-btn blue-btn";
        document.getElementById('new-tab-drives').style.backgroundColor = "";
        document.getElementById('new-tab-fuel').className = "action-btn";
        document.getElementById('new-tab-fuel').style.backgroundColor = "#333";
        
        if(logList) logList.style.display = 'block';
        if(fuelList) fuelList.style.display = 'none';
        renderHistoryList();
    };

    document.getElementById('new-tab-fuel').onclick = () => {
        document.getElementById('new-tab-fuel').className = "action-btn blue-btn";
        document.getElementById('new-tab-fuel').style.backgroundColor = "";
        document.getElementById('new-tab-drives').className = "action-btn";
        document.getElementById('new-tab-drives').style.backgroundColor = "#333";
        
        if(logList) logList.style.display = 'none';
        if(fuelList) fuelList.style.display = 'block';
        renderFuelList();
    };

    // 2. Filtteri
    const filterSelect = document.getElementById('history-filter-select');
    filterSelect.onchange = () => {
        const customCont = document.getElementById('custom-filter-container');
        if(filterSelect.value === 'custom_range') {
            customCont.style.display = 'block';
        } else {
            customCont.style.display = 'none';
        }
        refreshActiveView();
    };

    // 3. Päivämäärät
    const fStart = document.getElementById('filter-start');
    const fEnd = document.getElementById('filter-end');
    if(fStart) fStart.onchange = refreshActiveView;
    if(fEnd) fEnd.onchange = refreshActiveView;

    // 4. Napit (Manuaalinen & CSV)
    document.getElementById('new-btn-manual').onclick = () => {
        const modal = document.getElementById('manual-drive-modal');
        if(modal) {
            const now = new Date();
            const inpDate = document.getElementById('manual-date');
            if(inpDate) {
                const tzOffset = now.getTimezoneOffset() * 60000;
                inpDate.value = (new Date(now - tzOffset)).toISOString().slice(0,16);
            }
            const carSel = document.getElementById('manual-car-select');
            if(carSel) {
                carSel.innerHTML = "";
                userCars.forEach(car => {
                    if(!car.isArchived) carSel.add(new Option(car.name, car.id));
                });
            }
            modal.style.display = 'flex';
        }
    };

    document.getElementById('new-btn-csv').onclick = () => {
        if(typeof populatePreviewTable === 'function') {
            populatePreviewTable();
            const modal = document.getElementById('preview-modal');
            if(modal) modal.style.display = 'flex';
        }
    };
}

// --- 4. LISTAKSEN RENDERÖINTI (AJOT) ---
function renderHistoryList() {
    const list = document.getElementById('log-list');
    if (!list) return;
    list.innerHTML = "";

    const filterSelect = document.getElementById('history-filter-select');
    const timeFilter = filterSelect ? filterSelect.value : '7d';
    
    // SUODATUS
    const filtered = allHistoryData.filter(d => {
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
            const sVal = document.getElementById('filter-start').value;
            const eVal = document.getElementById('filter-end').value;
            const start = sVal ? new Date(sVal).getTime() : 0;
            const end = eVal ? new Date(eVal).getTime() + oneDay : Infinity;
            return driveTime >= start && driveTime < end;
        }
        return true; 
    });

    // PÄIVITETTY YHTEENVETO (KM OMA / KM TYÖ / KM YHT + AJAT)
    calculateSummary(filtered);

    if (filtered.length === 0) {
        list.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Ei ajoja valitulla aikavälillä.</div>";
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

// UUSI YHTEENVETO LASKURI
function calculateSummary(data) {
    if (!historySummaryEl) return;
    
    let privateKm = 0;
    let workKm = 0;
    let privateMs = 0;
    let workMs = 0;

    data.forEach(d => {
        const km = parseFloat(d.distanceKm || 0);
        const ms = d.durationMs || 0;
        
        if(d.driveType === 'work') {
            workKm += km;
            workMs += ms;
        } else {
            privateKm += km;
            privateMs += ms;
        }
    });

    const totalKm = privateKm + workKm;
    const totalMs = privateMs + workMs;

    // Apufunktio ajan muotoiluun (esim. 5h 30m)
    const fmtTime = (ms) => {
        if (!ms) return "0min";
        const h = Math.floor(ms / 3600000);
        const m = Math.floor((ms % 3600000) / 60000);
        if (h > 0) return `${h}h ${m}m`;
        return `${m}min`;
    };

    historySummaryEl.style.display = 'flex';

    // 1. SARAKE: OMA
    document.getElementById('sum-val-1').innerText = privateKm.toFixed(0) + " km";
    document.getElementById('sum-label-1').innerText = "Oma (" + fmtTime(privateMs) + ")";

    // 2. SARAKE: TYÖ
    document.getElementById('sum-val-2').innerText = workKm.toFixed(0) + " km";
    document.getElementById('sum-label-2').innerText = "Työ (" + fmtTime(workMs) + ")";

    // 3. SARAKE: YHTEENSÄ
    document.getElementById('sum-val-3').innerText = totalKm.toFixed(0) + " km";
    document.getElementById('sum-label-3').innerText = "Yht (" + fmtTime(totalMs) + ")";
}

// --- 5. TANKKAUKSET LISTA & YHTEENVETO ---
function renderFuelList() {
    const list = document.getElementById('fuel-list');
    if(!list) return;
    list.innerHTML = "";

    const filterSelect = document.getElementById('history-filter-select');
    const timeFilter = filterSelect ? filterSelect.value : '7d';

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
        const refTime = new Date(r.startTime || r.date).getTime();
        const now = Date.now();
        const oneDay = 86400000;

        if (timeFilter === '7d') return refTime >= (now - (7 * oneDay));
        if (timeFilter === '30d') return refTime >= (now - (30 * oneDay));
        if (timeFilter === 'this_year') return refTime >= new Date(new Date().getFullYear(), 0, 1).getTime();
        if (timeFilter === 'custom_range') {
            const sVal = document.getElementById('filter-start').value;
            const eVal = document.getElementById('filter-end').value;
            const start = sVal ? new Date(sVal).getTime() : 0;
            const end = eVal ? new Date(eVal).getTime() + oneDay : Infinity;
            return refTime >= start && refTime < end;
        }
        return true;
    });

    // LASKETAAN TANKKAUSTEN YHTEENVETO
    let totalEur = 0;
    let totalLit = 0;
    
    filtered.forEach(f => {
        totalEur += parseFloat(f.totalCost || f.euros || 0);
        totalLit += parseFloat(f.liters || 0);
    });
    
    let avgPrice = totalLit > 0 ? (totalEur / totalLit) : 0;

    // NÄYTETÄÄN YHTEENVETOPALKKI MYÖS TANKKAUKSILLE
    if (historySummaryEl) {
        historySummaryEl.style.display = 'flex';
        
        document.getElementById('sum-val-1').innerText = totalEur.toFixed(1) + " €";
        document.getElementById('sum-label-1').innerText = "Rahaa";

        document.getElementById('sum-val-2').innerText = totalLit.toFixed(1) + " L";
        document.getElementById('sum-label-2').innerText = "Litrat";

        document.getElementById('sum-val-3').innerText = avgPrice.toFixed(3) + " €/l";
        document.getElementById('sum-label-3').innerText = "Keskihinta";
    }

    if (filtered.length === 0) {
        list.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Ei tankkauksia valitulla aikavälillä.</div>";
        // Jos lista on tyhjä, nollataan silti palkki, mutta pidetään näkyvissä
        return;
    }

    filtered.forEach(fuel => {
        const dateObj = new Date(fuel.startTime || fuel.date);
        const dateStr = dateObj.toLocaleDateString('fi-FI');
        
        let carName = fuel.carName || "Tuntematon";
        const carInfo = userCars.find(c => c.id === fuel.carId);
        if (carInfo) carName = carInfo.name;

        const div = document.createElement('div');
        div.className = 'log-card';
        div.style.borderLeft = "4px solid #00e676";

        div.innerHTML = `
            <div class="log-header">
                <div class="log-title-group">
                    <span class="log-date-line">${dateStr}</span>
                    <span class="log-car-big">⛽ ${carName}</span>
                </div>
                <div style="text-align:right;">
                    <div style="font-size:18px; font-weight:bold; color:var(--text-color);">${parseFloat(fuel.totalCost || fuel.euros).toFixed(2)} €</div>
                    <div style="font-size:11px; color:var(--subtext-color);">${parseFloat(fuel.liters).toFixed(1)} L</div>
                </div>
            </div>
            <div class="log-stats" style="grid-template-columns: 1fr 1fr;">
                 <div><span class="stat-label">Hinta/L</span>${parseFloat(fuel.pricePerLiter).toFixed(3)} €</div>
                 <div><span class="stat-label">Mittari</span>${fuel.odometer || fuel.odo || '-'} km</div>
            </div>
        `;
        list.appendChild(div);
    });
}

// --- 6. TILASTOT (CHART.JS) ---
function renderStats() {
    if (document.getElementById('stats-drives-container') && document.getElementById('stats-drives-container').style.display !== 'none') {
        renderDriveStats();
    } else {
        renderFuelStats();
    }
}

function renderDriveStats() {
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

    const ctxTrend = document.getElementById('chart-drive-trend');
    if(ctxTrend && typeof Chart !== 'undefined') {
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

    const ctxVeh = document.getElementById('chart-drive-vehicles');
    if(ctxVeh && typeof Chart !== 'undefined') {
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
    
    const ctxStyle = document.getElementById('chart-drive-style');
    if(ctxStyle && typeof Chart !== 'undefined') {
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
    // Placeholder 
}

// --- 7. EXPORT (CSV) & PREVIEW ---
function exportToCSV() {
    populatePreviewTable();
    const modal = document.getElementById('preview-modal');
    if(modal) modal.style.display = 'flex';
}

function populatePreviewTable() {
    const filterSelect = document.getElementById('history-filter-select');
    const timeFilter = filterSelect ? filterSelect.value : '7d';
    
    const filteredData = allHistoryData.filter(d => {
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

        const driveTime = new Date(d.startTime).getTime();
        const now = Date.now();
        const oneDay = 86400000;

        if (timeFilter === '7d') return driveTime >= (now - (7 * oneDay));
        if (timeFilter === '30d') return driveTime >= (now - (30 * oneDay));
        if (timeFilter === 'this_year') return driveTime >= new Date(new Date().getFullYear(), 0, 1).getTime();
        if (timeFilter === 'custom_range') {
            const sVal = document.getElementById('filter-start').value;
            const eVal = document.getElementById('filter-end').value;
            const start = sVal ? new Date(sVal).getTime() : 0;
            const end = eVal ? new Date(eVal).getTime() + oneDay : Infinity;
            return driveTime >= start && driveTime < end;
        }
        return true;
    });

    const tbody = document.getElementById('preview-tbody');
    const countEl = document.getElementById('preview-count');
    const totalEl = document.getElementById('preview-total');
    
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

    if(countEl) countEl.innerText = filteredData.length + " ajoa";
    if(totalEl) totalEl.innerText = totalKm.toFixed(1) + " km";
}

// --- 8. TAPAHTUMAKUUNTELIJAT (GLOBAL HELPERS) ---

if(statsTimeRange) statsTimeRange.addEventListener('change', renderStats);

window.openMapForDrive = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if(drive && drive.route) {
        if(typeof showRouteOnMap === 'function') {
            showRouteOnMap(key);
        } else {
            // Fallback
            savedRouteLayer = L.polyline(drive.route.map(p => [p.lat, p.lng]), {color: '#ff9100', weight: 5}).addTo(map);
            if(typeof switchView === 'function') switchView('map');
            setTimeout(() => map.fitBounds(savedRouteLayer.getBounds(), {padding: [50,50]}), 200);
        }
    } else {
        alert("Ei reittitietoja.");
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
