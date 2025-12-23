// =========================================================
// HISTORY.JS - HISTORIA, SUODATUS JA TILASTOT (v5.99 FULL)
// =========================================================

// --- 1. MÄÄRITELLÄÄN ELEMENTIT ---
const filterEl = document.getElementById('history-filter');
const customFilterContainer = document.getElementById('custom-filter-container');
const filterStart = document.getElementById('filter-start');
const filterEnd = document.getElementById('filter-end');
const historySummaryEl = document.getElementById('history-summary');
const statsTimeRange = document.getElementById('stats-time-range');

// Varmistetaan globaalit funktiot
window.renderHistoryList = renderHistoryList;
window.renderFuelList = renderFuelList;
window.renderStats = renderStats;
window.renderDriveStats = renderDriveStats;
window.renderFuelStats = renderFuelStats;
window.exportToCSV = exportToCSV;

// --- 2. HISTORIAN LATAUS ---
function loadHistory() {
    if (!currentUser) return;

    db.ref('ajopaivakirja/' + currentUser.uid).off();
    
    const historyRef = db.ref('ajopaivakirja/' + currentUser.uid)
                         .orderByChild('startTime')
                         .limitToLast(1000); 

    historyRef.on('value', (snapshot) => {
        allHistoryData = [];
        allRefuelings = [];
        
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                if (data.type === 'refuel') {
                    allRefuelings.push({ key: child.key, ...data });
                } else {
                    allHistoryData.push({ key: child.key, ...data });
                }
            });
        }
        
        // Järjestetään (uusin ensin)
        allHistoryData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        allRefuelings.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if(typeof populateFilter === 'function') populateFilter();
        
        // Päivitetään se lista, kumpi onkaan näkyvissä
        const logList = document.getElementById('log-list');
        const fuelList = document.getElementById('fuel-list');
        
        if (logList && logList.style.display !== 'none') {
            renderHistoryList();
        } else if (fuelList && fuelList.style.display !== 'none') {
            renderFuelList();
        } else {
            renderHistoryList();
        }
        
        renderStats();

    }, (error) => {
        console.error("Firebase virhe:", error);
    });
}

// --- 3. SUODATUS LOGIIKKA (Historia-sivulle) ---
if(filterEl) {
    filterEl.addEventListener('change', () => {
        if (filterEl.value === 'custom') {
            if(customFilterContainer) customFilterContainer.style.display = 'block';
        } else {
            if(customFilterContainer) customFilterContainer.style.display = 'none';
            renderHistoryList(); 
            renderFuelList();
        }
    });
}
if(filterStart) filterStart.addEventListener('change', () => { renderHistoryList(); renderFuelList(); });
if(filterEnd) filterEnd.addEventListener('change', () => { renderHistoryList(); renderFuelList(); });

// --- AIKAVÄLI VALINTA (Tilastot-sivulle) ---
if(statsTimeRange) {
    statsTimeRange.addEventListener('change', () => {
        renderStats();
    });
}

function populateFilter() {
    if(!filterEl) return;
    const currentVal = filterEl.value;
    filterEl.innerHTML = `<option value="all">Kaikki ajot</option><option value="custom">Mukautettu aikaväli...</option>`;
    
    const periods = new Set();
    allHistoryData.forEach(drive => {
        if (drive.startTime) {
            const d = new Date(drive.startTime);
            if (!isNaN(d.getTime())) {
                const yearKey = "YEAR-" + d.getFullYear();
                periods.add(JSON.stringify({key: yearKey, label: "Vuosi " + d.getFullYear(), sort: d.getFullYear() * 100}));
                const monthKey = d.getFullYear() + '-' + (d.getMonth() + 1);
                const monthLabel = d.toLocaleString('fi-FI', { month: 'long', year: 'numeric' });
                const finalMonthLabel = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);
                periods.add(JSON.stringify({key: monthKey, label: finalMonthLabel, sort: d.getFullYear() * 100 + (d.getMonth() + 1)}));
            }
        }
    });
    const sortedPeriods = Array.from(periods).map(p => JSON.parse(p)).sort((a, b) => b.sort - a.sort);
    sortedPeriods.forEach(p => {
        const option = document.createElement('option');
        option.value = p.key;
        option.innerText = p.label;
        filterEl.appendChild(option);
    });
    if (currentVal && Array.from(filterEl.options).some(o => o.value === currentVal)) {
        filterEl.value = currentVal;
    }
}

// --- 4. LISTAN RENDERÖINTI (AJOT) ---
function renderHistoryList() {
    const logList = document.getElementById('log-list');
    if(!logList) return;
    
    logList.innerHTML = ""; 
    
    if (allHistoryData.length === 0) {
        logList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei tallennettuja ajoja.</p>";
        if(historySummaryEl) historySummaryEl.style.display = 'none';
        return;
    }

    const selectedFilter = filterEl ? filterEl.value : 'all';
    let renderCount = 0;
    let totalKm = 0;
    let totalMs = 0;

    allHistoryData.forEach((drive) => {
        try {
            // --- ARKISTOINTI LOGIIKKA ---
            if (currentCarId === 'all') {
                const carObj = userCars.find(c => c.id === drive.carId);
                if (carObj && carObj.isArchived) return; 
            } else if (currentCarId === 'all_archived') {
                // Näytä kaikki
            } else {
                if (drive.carId && drive.carId !== currentCarId) return;
                if (!drive.carId) return; 
            }

            let start = new Date(drive.startTime);
            if (isNaN(start.getTime())) return;

            // Suodatus (Päivämäärä)
            if (selectedFilter !== 'all') {
                if (selectedFilter === 'custom') {
                    const startInput = filterStart.value; const endInput = filterEnd.value;
                    if (startInput && endInput) {
                        const sDate = new Date(startInput); const eDate = new Date(endInput); eDate.setHours(23, 59, 59, 999);
                        if (start < sDate || start > eDate) return;
                    }
                } else if (selectedFilter.startsWith("YEAR-")) {
                    const year = selectedFilter.split("-")[1];
                    if (start.getFullYear().toString() !== year) return;
                } else {
                    const monthKey = start.getFullYear() + '-' + (start.getMonth() + 1);
                    if (monthKey !== selectedFilter) return;
                }
            }

            let durationMinutes = 0;
            let durationMs = 0;
            if (drive.durationMs) {
                durationMs = drive.durationMs;
                durationMinutes = Math.floor(drive.durationMs / 60000);
            } else if (drive.endTime && start) {
                const end = new Date(drive.endTime);
                if (!isNaN(end.getTime())) durationMs = (end - start);
                durationMinutes = Math.floor(durationMs / 60000);
            }
            
            const dist = parseFloat(drive.distanceKm) || 0;
            totalKm += dist;
            totalMs += durationMs;

            let mapBtn = "";
            if (drive.route && drive.route.length > 0) {
                mapBtn = `<button class="map-btn" onclick="window.showRouteOnMap('${drive.key}')" title="Näytä reitti">🗺️</button>`;
            }
            
            let carObj = userCars.find(c => c.id === drive.carId);
            let icon = carObj ? (carObj.icon || (carObj.type==='bike'?"🚲":"🚗")) : (drive.carIcon || (drive.carType==='bike'?"🚲":"🚗"));
            let carName = carObj ? carObj.name : (drive.carName || "Muu");
            
            let dateStr = start.toLocaleDateString('fi-FI');
            let startH = start.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
            let endH = drive.endTime ? " - " + new Date(drive.endTime).toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'}) : "";

            // AJOTYYPPI IKONI JA VÄRI
            const typeIcon = (drive.driveType === 'work') ? "💼" : "🏠";
            const typeLabel = (drive.driveType === 'work') ? "Työajo" : "Oma ajo";
            const typeColor = (drive.driveType === 'work') ? "#00695c" : "#424242";

            const card = document.createElement('div');
            card.className = 'log-card';
            card.style.animationDelay = `${Math.min(renderCount * 0.05, 1.0)}s`;

            card.innerHTML = `
                <div class="log-header">
                    <div class="log-title-group">
                        <div class="log-date-line">${dateStr} (${startH}${endH})</div>
                        <div class="log-car-big">${icon} ${carName}</div>
                    </div>
                    <div style="display:flex; align-items:center;">
                        ${mapBtn}
                        <button class="edit-btn" onclick="window.openEditLogModal('${drive.key}')">✏️</button>
                        <button class="delete-btn" onclick="window.openDeleteLogModal('${drive.key}')">🗑</button>
                    </div>
                </div>
                <div class="log-tags">
                    <span class="tag" style="background-color: ${typeColor}; color:#fff;">${typeIcon} ${typeLabel}</span>
                    ${drive.weather ? `<span class="tag">🌡️ ${drive.weather}</span>` : ''}
                    ${drive.drivingStyle ? `<span class="tag">🏎️ ${drive.drivingStyle}</span>` : ''}
                </div>
                <div class="log-stats">
                    <div><span class="stat-label">KM</span>${drive.distanceKm || "0.00"}</div>
                    <div><span class="stat-label">AIKA</span>${durationMinutes} min</div>
                    <div><span class="stat-label">MAX</span>${drive.maxSpeed || "0"}</div>
                    <div><span class="stat-label">Ø KM/H</span>${drive.avgSpeed || "-"}</div>
                </div>
                <input type="text" class="subject-input" placeholder="Kirjoita aihe..." value="${drive.subject || ""}" onchange="window.updateLogSubject('${drive.key}', this.value)">
                ${drive.startAddress ? `<div style="font-size:11px; color:#888; margin-top:5px;">${drive.startAddress} ➝ ${drive.endAddress || '?'}</div>` : ''}
            `;
            logList.appendChild(card);
            renderCount++;
        } catch (err) { console.error(err); }
    });

    if (renderCount > 0 && historySummaryEl) {
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        document.getElementById('sum-val-1').innerText = totalKm.toFixed(1);
        document.getElementById('sum-label-1').innerText = "km";
        document.getElementById('sum-val-2').innerText = renderCount;
        document.getElementById('sum-label-2').innerText = "kpl";
        document.getElementById('sum-val-3').innerText = `${h}h ${m}min`;
        document.getElementById('sum-label-3').innerText = "aika";
        historySummaryEl.style.display = 'flex';
    } else if (historySummaryEl) {
        historySummaryEl.style.display = 'none';
    }
}

// --- 5. TANKKAUKSET LISTA ---
function renderFuelList() {
    const fuelList = document.getElementById('fuel-list');
    if(!fuelList) return;
    
    fuelList.innerHTML = "";
    
    let totalRefuelEur = 0;
    let totalRefuelLit = 0;
    let sumGas = 0;
    let sumDiesel = 0;
    let renderCount = 0;

    const filteredRefuelings = allRefuelings.filter(ref => {
        if (currentCarId === 'all') {
            const carObj = userCars.find(c => c.id === ref.carId);
            if (carObj && carObj.isArchived) return false; 
        } else if (currentCarId === 'all_archived') {
        } else {
            if (ref.carId && ref.carId !== currentCarId) return false;
            if (!ref.carId) return false;
        }
        return true;
    });

    if(!filteredRefuelings || filteredRefuelings.length === 0) {
        fuelList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei tankkauksia valituilla ehdoilla.</p>";
        if(historySummaryEl) historySummaryEl.style.display = 'none';
        return;
    }

    filteredRefuelings.forEach((ref, index) => {
        const eur = parseFloat(ref.euros) || 0;
        const lit = parseFloat(ref.liters) || 0;
        
        totalRefuelEur += eur;
        totalRefuelLit += lit;

        let carObj = userCars.find(c => c.id === ref.carId);
        let fuelType = (carObj ? carObj.fuel : "").toLowerCase();
        let displayFuel = carObj ? (carObj.fuel || "") : ""; 
        
        if (fuelType.includes('diesel')) {
            sumDiesel += lit;
        } else {
            sumGas += lit;
        }

        const date = new Date(ref.date);
        const dateStr = date.toLocaleDateString('fi-FI') + " " + date.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
        
        let carName = carObj ? carObj.name : "Tuntematon";
        let icon = "⛽";

        const card = document.createElement('div');
        card.className = 'log-card';
        card.style.animationDelay = `${Math.min(index * 0.05, 1.0)}s`;
        
        card.innerHTML = `
            <div class="log-header">
                <div class="log-title-group">
                    <div class="log-date-line">${dateStr}</div>
                    <div class="log-car-big">${icon} ${carName}</div>
                </div>
                <div>
                    <button class="edit-btn" onclick="window.editRefueling('${ref.key}')">✏️</button>
                    <button class="delete-btn" onclick="window.openDeleteLogModal('${ref.key}')">🗑</button>
                </div>
            </div>
            <div class="log-stats" style="grid-template-columns: repeat(3, 1fr);">
                <div><span class="stat-label">LITRAT</span>${lit.toFixed(2)} L <span style="font-size:11px; opacity:0.7; display:block;">${displayFuel}</span></div>
                <div><span class="stat-label">HINTA</span>${eur.toFixed(2)} €</div>
                <div><span class="stat-label">€ / L</span>${ref.pricePerLiter}</div>
            </div>
            <div style="font-size:12px; color:#888; text-align:center; margin-top:5px;">Mittarilukema: ${ref.odo || "-"} km</div>
        `;
        fuelList.appendChild(card);
        renderCount++;
    });

    if (renderCount > 0 && historySummaryEl) {
        document.getElementById('sum-val-1').innerText = totalRefuelEur.toFixed(1) + " €";
        document.getElementById('sum-label-1').innerText = "Rahaa";
        document.getElementById('sum-val-2').innerText = totalRefuelLit.toFixed(1) + " L";
        document.getElementById('sum-label-2').innerText = "Litroja";
        document.getElementById('sum-val-3').innerText = `B:${sumGas.toFixed(0)} / D:${sumDiesel.toFixed(0)}`;
        document.getElementById('sum-label-3').innerText = "Bensa / Diesel (L)";
        historySummaryEl.style.display = 'flex';
    }
}

// --- 6. TILASTOT ---
function renderStats() {
    const statsFuelContainer = document.getElementById('stats-fuel-container');
    if (typeof Chart === 'undefined') return;
    if(statsFuelContainer && statsFuelContainer.style.display !== 'none') {
        renderFuelStats();
    } else {
        renderDriveStats();
    }
}

function renderDriveStats() {
    if (!allHistoryData || allHistoryData.length === 0) return;
    const range = statsTimeRange ? statsTimeRange.value : '30d'; 
    const timeData = {}; 
    const vehicleData = {};
    const styleData = { "Taloudellinen": 0, "Tasainen": 0, "Reipas": 0, "Aggressiivinen": 0 };
    const carTimeData = {}; 
    const speedData = {}; 

    const now = new Date();
    let startDate = new Date(1970, 0, 1); 
    if (range === '7d') { startDate = new Date(); startDate.setDate(now.getDate() - 7); }
    else if (range === '30d') { startDate = new Date(); startDate.setDate(now.getDate() - 30); }
    else if (range === 'year') { startDate = new Date(now.getFullYear(), 0, 1); }

    const sortedDrives = [...allHistoryData]
        .filter(d => {
            if (currentCarId === 'all') {
                const carObj = userCars.find(c => c.id === d.carId);
                if (carObj && carObj.isArchived) return false; 
            } else if (currentCarId === 'all_archived') {
            } else {
                if (d.carId && d.carId !== currentCarId) return false;
            }
            return new Date(d.startTime) >= startDate;
        })
        .sort((a,b) => new Date(a.startTime) - new Date(b.startTime));

    sortedDrives.forEach(d => {
        const dist = parseFloat(d.distanceKm) || 0;
        const avgSpd = parseFloat(d.avgSpeed) || 0;
        const date = new Date(d.startTime);
        
        let key = "";
        if (range === '7d' || range === '30d') {
            key = `${date.getDate()}.${date.getMonth()+1}.`;
        } else {
            key = `${date.getMonth()+1}/${date.getFullYear()}`;
        }

        if (!timeData[key]) timeData[key] = 0;
        timeData[key] += dist;

        let carObj = userCars.find(c => c.id === d.carId);
        let carName = carObj ? carObj.name : (d.carName || "Muu");
        
        if (!vehicleData[carName]) vehicleData[carName] = 0;
        vehicleData[carName] += dist;

        if (!carTimeData[carName]) carTimeData[carName] = {};
        if (!carTimeData[carName][key]) carTimeData[carName][key] = 0;
        carTimeData[carName][key] += dist;

        if(avgSpd > 0) {
            if(!speedData[key]) speedData[key] = {sum:0, count:0};
            speedData[key].sum += avgSpd;
            speedData[key].count++;
        }

        if(d.drivingStyle) {
            if(!styleData[d.drivingStyle]) styleData[d.drivingStyle] = 0;
            styleData[d.drivingStyle]++;
        }
    });

    const labelTrend = document.getElementById('label-drive-trend');
    const labelTotal = document.getElementById('label-drive-total');
    const unit = (range === '7d' || range === '30d') ? "(km/pv)" : "(km/kk)";
    if(labelTrend) labelTrend.innerText = `📈 Kilometrikehitys ${unit}`;
    if(labelTotal) labelTotal.innerText = `📅 Kilometrit yhteensä`;

    const labels = Object.keys(timeData); 
    const values = Object.values(timeData).map(v => v.toFixed(1));

    const canvasMonthly = document.getElementById('chart-drive-monthly');
    if (canvasMonthly) {
        if (chartInstanceMonthly) { chartInstanceMonthly.destroy(); }
        chartInstanceMonthly = new Chart(canvasMonthly.getContext('2d'), {
            type: 'bar',
            data: { labels: labels, datasets: [{ label: 'Kilometrit', data: values, backgroundColor: 'rgba(41, 121, 255, 0.6)', borderColor: 'rgba(41, 121, 255, 1)', borderWidth: 1 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
        });
    }

    const canvasTrend = document.getElementById('chart-drive-trend');
    if (canvasTrend) {
        if (chartInstanceDriveTrend) { chartInstanceDriveTrend.destroy(); }
        const trendDatasets = [];
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        let colorIdx = 0;
        for (const [carName, timesObj] of Object.entries(carTimeData)) {
            const dataArr = labels.map(lbl => (timesObj[lbl] || 0));
            trendDatasets.push({
                label: carName,
                data: dataArr,
                borderColor: colors[colorIdx % colors.length],
                tension: 0.3,
                fill: false
            });
            colorIdx++;
        }
        chartInstanceDriveTrend = new Chart(canvasTrend.getContext('2d'), {
            type: 'line',
            data: { labels: labels, datasets: trendDatasets },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }

    const canvasSpeed = document.getElementById('chart-drive-speed');
    if (canvasSpeed) {
        if (chartInstanceDriveSpeed) { chartInstanceDriveSpeed.destroy(); }
        const speedValues = labels.map(k => {
            if(speedData[k] && speedData[k].count > 0) return (speedData[k].sum / speedData[k].count).toFixed(1);
            return 0;
        });
        chartInstanceDriveSpeed = new Chart(canvasSpeed.getContext('2d'), {
            type: 'line',
            data: { 
                labels: labels, 
                datasets: [{ label: 'Ø Nopeus', data: speedValues, borderColor: '#00e676', backgroundColor: 'rgba(0, 230, 118, 0.1)', fill: true, tension: 0.4 }] 
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }

    const canvasVehicles = document.getElementById('chart-drive-vehicles');
    if (canvasVehicles) {
        if (chartInstanceVehicles) { chartInstanceVehicles.destroy(); }
        chartInstanceVehicles = new Chart(canvasVehicles.getContext('2d'), {
            type: 'doughnut',
            data: { labels: Object.keys(vehicleData), datasets: [{ data: Object.values(vehicleData).map(v => v.toFixed(1)), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], borderWidth: 1 }] }
        });
    }

    const canvasStyle = document.getElementById('chart-drive-style');
    if (canvasStyle) {
        if (chartInstanceStyle) { chartInstanceStyle.destroy(); }
        const filteredStyle = Object.entries(styleData).filter(([k,v]) => v > 0);
        chartInstanceStyle = new Chart(canvasStyle.getContext('2d'), {
            type: 'pie',
            data: { 
                labels: filteredStyle.map(x => x[0]), 
                datasets: [{ data: filteredStyle.map(x => x[1]), backgroundColor: ['#00c853', '#2979ff', '#fbc02d', '#ff1744'] }] 
            }
        });
    }
}

function renderFuelStats() {
    if (!allRefuelings || allRefuelings.length === 0) return;
    const range = statsTimeRange ? statsTimeRange.value : '30d';
    let totalRefuelEur = 0; let sumGas = 0; let sumDiesel = 0; 
    const timeCosts = {}; const trendGas = []; const trendDiesel = []; const carCosts = {}; const fuelTypeData = {}; 

    const now = new Date();
    let startDate = new Date(1970, 0, 1);
    if (range === '7d') { startDate = new Date(); startDate.setDate(now.getDate() - 7); }
    else if (range === '30d') { startDate = new Date(); startDate.setDate(now.getDate() - 30); }
    else if (range === 'year') { startDate = new Date(now.getFullYear(), 0, 1); }

    const sortedRefs = [...allRefuelings]
        .filter(r => {
             if (currentCarId === 'all') {
                const carObj = userCars.find(c => c.id === r.carId);
                if (carObj && carObj.isArchived) return false;
            } else if (currentCarId === 'all_archived') {
            } else {
                if (r.carId && r.carId !== currentCarId) return false;
            }
            return new Date(r.date) >= startDate;
        })
        .sort((a,b) => new Date(a.date) - new Date(b.date));

    sortedRefs.forEach(ref => {
        const eur = parseFloat(ref.euros) || 0;
        const lit = parseFloat(ref.liters) || 0;
        const price = parseFloat(ref.pricePerLiter) || 0;
        const date = new Date(ref.date);
        const dateStr = date.toLocaleDateString('fi-FI');

        totalRefuelEur += eur;
        const car = userCars.find(c => c.id === ref.carId);
        const fuelType = (car ? car.fuel : "Muu").toLowerCase();
        
        if(fuelType.includes('bensiini') || fuelType.includes('gas')) {
             sumGas += lit;
             fuelTypeData['Bensiini'] = (fuelTypeData['Bensiini'] || 0) + lit;
             if(price > 0) trendGas.push({ x: dateStr, y: price });
        } else if(fuelType.includes('diesel')) {
             sumDiesel += lit;
             fuelTypeData['Diesel'] = (fuelTypeData['Diesel'] || 0) + lit;
             if(price > 0) trendDiesel.push({ x: dateStr, y: price });
        } else {
             fuelTypeData['Muu'] = (fuelTypeData['Muu'] || 0) + lit;
        }

        let key = "";
        if (range === '7d' || range === '30d') {
            key = `${date.getDate()}.${date.getMonth()+1}.`;
        } else {
            key = `${date.getMonth()+1}/${date.getFullYear()}`;
        }

        if(!timeCosts[key]) timeCosts[key] = 0;
        timeCosts[key] += eur;

        const carName = car ? car.name : "Tuntematon";
        if(!carCosts[carName]) carCosts[carName] = 0;
        carCosts[carName] += eur;
    });

    const statFuelEur = document.getElementById('stat-fuel-eur');
    const statFuelGas = document.getElementById('stat-fuel-gas');
    const statFuelDiesel = document.getElementById('stat-fuel-diesel');
    if(statFuelEur) statFuelEur.innerText = totalRefuelEur.toFixed(2) + " €";
    if(statFuelGas) statFuelGas.innerText = sumGas.toFixed(1) + " L";
    if(statFuelDiesel) statFuelDiesel.innerText = sumDiesel.toFixed(1) + " L";

    const canvasFuelType = document.getElementById('chart-fuel-type');
    if (canvasFuelType) {
        if (chartInstanceFuelType) { chartInstanceFuelType.destroy(); }
        chartInstanceFuelType = new Chart(canvasFuelType.getContext('2d'), {
            type: 'doughnut',
            data: { labels: Object.keys(fuelTypeData), datasets: [{ data: Object.values(fuelTypeData).map(v => v.toFixed(1)), backgroundColor: ['#4caf50', '#2196f3', '#9e9e9e'] }] }
        });
    }

    const canvasMonthly = document.getElementById('chart-fuel-monthly');
    if (canvasMonthly) {
        if (chartInstanceFuelMonthly) { chartInstanceFuelMonthly.destroy(); }
        chartInstanceFuelMonthly = new Chart(canvasMonthly.getContext('2d'), {
            type: 'bar',
            data: { labels: Object.keys(timeCosts), datasets: [{ label: 'Euroa (€)', data: Object.values(timeCosts), backgroundColor: '#fbc02d', borderColor: '#fbc02d', borderWidth: 1 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
        });
    }

    const canvasTrend = document.getElementById('chart-fuel-trend');
    if (canvasTrend) {
        if (chartInstanceFuelTrend) { chartInstanceFuelTrend.destroy(); }
        const allDates = [...new Set([...trendGas.map(d=>d.x), ...trendDiesel.map(d=>d.x)])];
        chartInstanceFuelTrend = new Chart(canvasTrend.getContext('2d'), {
            type: 'line',
            data: { 
                labels: allDates, 
                datasets: [
                    { label: 'Bensiini (€)', data: trendGas, borderColor: '#00e676', tension: 0.3, pointRadius: 3 },
                    { label: 'Diesel (€)', data: trendDiesel, borderColor: '#212121', backgroundColor: 'rgba(0,0,0,0.5)', tension: 0.3, pointRadius: 3 }
                ] 
            },
            options: { responsive: true }
        });
    }

    const canvasCar = document.getElementById('chart-fuel-car');
    if (canvasCar) {
        if (chartInstanceFuelCar) { chartInstanceFuelCar.destroy(); }
        chartInstanceFuelCar = new Chart(canvasCar.getContext('2d'), {
            type: 'doughnut',
            data: { labels: Object.keys(carCosts), datasets: [{ data: Object.values(carCosts).map(v => v.toFixed(2)), backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FF9F40'] }] }
        });
    }
}


// --- 7. APUFUNKTIOT ---

// CSV EXPORT (KORJATTU: KUNNIOITTAA SUODATTIMIA)
function exportToCSV() {
    if (!allHistoryData || allHistoryData.length === 0) {
        if(typeof showToast === 'function') showToast("Ei dataa ladattavaksi.");
        return;
    }

    const selectedFilter = filterEl ? filterEl.value : 'all';
    let csvContent = "data:text/csv;charset=utf-8,";
    // Otsikot
    csvContent += "Pvm,Kello,Ajoneuvo,Tyyppi,Matka (km),Kesto (min),Aihe,Lähtö,Määränpää\n";

    allHistoryData.forEach(drive => {
        // --- SUODATUS LOGIIKKA (SAMA KUIN LISTASSA) ---
        if (currentCarId === 'all') {
            const carObj = userCars.find(c => c.id === drive.carId);
            if (carObj && carObj.isArchived) return; 
        } else if (currentCarId === 'all_archived') {
        } else {
            if (drive.carId && drive.carId !== currentCarId) return;
            if (!drive.carId) return; 
        }

        let start = new Date(drive.startTime);
        if (isNaN(start.getTime())) return;

        if (selectedFilter !== 'all') {
            if (selectedFilter === 'custom') {
                const startInput = filterStart.value; const endInput = filterEnd.value;
                if (startInput && endInput) {
                    const sDate = new Date(startInput); const eDate = new Date(endInput); eDate.setHours(23, 59, 59, 999);
                    if (start < sDate || start > eDate) return;
                }
            } else if (selectedFilter.startsWith("YEAR-")) {
                const year = selectedFilter.split("-")[1];
                if (start.getFullYear().toString() !== year) return;
            } else {
                const monthKey = start.getFullYear() + '-' + (start.getMonth() + 1);
                if (monthKey !== selectedFilter) return;
            }
        }
        // ----------------------------------------------

        const d = new Date(drive.startTime);
        const dateStr = d.toLocaleDateString('fi-FI');
        const timeStr = d.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
        const typeStr = (drive.driveType === 'work') ? "Työajo" : "Oma ajo";
        const durMin = Math.floor((drive.durationMs || 0) / 60000);
        
        // CSV-turvalliset merkkijonot (vältä pilkkuja tekstissä)
        const safeSubj = (drive.subject || "").replace(/,/g, " ");
        const safeStart = (drive.startAddress || "").replace(/,/g, " ");
        const safeEnd = (drive.endAddress || "").replace(/,/g, " ");

        const row = `${dateStr},${timeStr},${drive.carName},${typeStr},${drive.distanceKm},${durMin},${safeSubj},${safeStart},${safeEnd}`;
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const now = new Date().toISOString().slice(0,10);
    link.setAttribute("download", `ajopaivakirja_${now}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Muokkausikkunan täyttö
window.openEditLogModal = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive) return;
    
    // Täytä piilokenttä ID:llä
    const keyEl = document.getElementById('edit-key');
    if(keyEl) keyEl.value = key;

    // Täytä pvm
    const dateEl = document.getElementById('edit-datetime');
    if(dateEl && drive.startTime) {
        // datetime-local vaatii muodon YYYY-MM-DDTHH:mm
        const d = new Date(drive.startTime);
        // Huomioi aikavyöhyke (ruma hack mutta toimii yleensä selaimessa)
        const tzOffset = d.getTimezoneOffset() * 60000; 
        const localISOTime = (new Date(d - tzOffset)).toISOString().slice(0, 16);
        dateEl.value = localISOTime;
    }

    // Täytä matka
    const distEl = document.getElementById('edit-distance');
    if(distEl) distEl.value = drive.distanceKm || "";

    // Täytä aihe
    const subjEl = document.getElementById('edit-subject');
    if(subjEl) subjEl.value = drive.subject || "";

    // Täytä ajotyyppi
    const typeEls = document.getElementsByName('edit-type');
    const targetType = drive.driveType || 'private';
    for(let r of typeEls) {
        if(r.value === targetType) r.checked = true;
    }

    // Täytä autovalikko
    const carSel = document.getElementById('edit-car-select');
    if(carSel) {
        carSel.innerHTML = "";
        userCars.forEach(car => {
            const opt = document.createElement('option');
            opt.value = car.id;
            const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
            const archivedLabel = car.isArchived ? " (Arkistoitu)" : "";
            opt.text = `${icon} ${car.name}${archivedLabel}`;
            if(drive.carId === car.id) opt.selected = true;
            carSel.appendChild(opt);
        });
    }

    const modal = document.getElementById('edit-modal');
    if(modal) modal.style.display = 'flex';
};

window.openDeleteLogModal = (key) => {
    deleteKey = key;
    if(deleteModal) deleteModal.style.display = 'flex';
};

window.updateLogSubject = (key, text) => { 
    if(currentUser) db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update({ subject: text }); 
};

// Varmistusnapit
const btnEditCancel2 = document.getElementById('btn-edit-cancel');
if(btnEditCancel2) btnEditCancel2.addEventListener('click', () => { if(editModal) editModal.style.display = 'none'; });

const btnDeleteCancel2 = document.getElementById('btn-delete-cancel');
if(btnDeleteCancel2) btnDeleteCancel2.addEventListener('click', () => { if(deleteModal) deleteModal.style.display = 'none'; deleteKey = null; });

const btnDeleteConfirm2 = document.getElementById('btn-delete-confirm');
if(btnDeleteConfirm2) btnDeleteConfirm2.addEventListener('click', () => { if (deleteKey && currentUser) { db.ref('ajopaivakirja/' + currentUser.uid + '/' + deleteKey).remove(); if(deleteModal) deleteModal.style.display = 'none'; deleteKey = null; } });
