// =========================================================
// HISTORY.JS - HISTORIA, SUODATUS JA TILASTOT (FULL)
// =========================================================

// 1. HISTORIAN LATAUS
function loadHistory() {
    if (!currentUser) return;

    db.ref('ajopaivakirja/' + currentUser.uid).off();
    
    const historyRef = db.ref('ajopaivakirja/' + currentUser.uid)
                         .orderByChild('startTime')
                         .limitToLast(300);

    historyRef.on('value', (snapshot) => {
        allHistoryData = [];
        allRefuelings = []; // Nollataan tankkaukset
        
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                // Erotellaan tankkaukset ja ajot
                if (data.type === 'refuel') {
                    allRefuelings.push({ key: child.key, ...data });
                } else {
                    allHistoryData.push({ key: child.key, ...data });
                }
            });
        }
        
        // Järjestetään molemmat listat (uusin ensin)
        allHistoryData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        allRefuelings.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if(typeof populateFilter === 'function') populateFilter();
        
        // Päivitä näkyvä lista riippuen siitä kumpi on auki
        const logList = document.getElementById('log-list');
        const fuelList = document.getElementById('fuel-list');
        
        if (logList && logList.style.display !== 'none') {
            renderHistoryList();
        }
        if (fuelList && fuelList.style.display !== 'none') {
            renderFuelList();
        }
        
        // Päivitä tilastot jos ne on auki
        if(typeof renderStats === 'function') renderStats();

    }, (error) => {
        console.error(error);
        const logList = document.getElementById('log-list');
        if(logList) logList.innerHTML = `<p style="color:red; text-align:center;">Virhe: ${error.message}</p>`;
    });
}

// 2. SUODATUS LOGIIKKA
if(filterEl) {
    filterEl.addEventListener('change', () => {
        if (filterEl.value === 'custom') {
            if(customFilterContainer) customFilterContainer.style.display = 'block';
        } else {
            if(customFilterContainer) customFilterContainer.style.display = 'none';
            renderHistoryList();
        }
    });
}
if(filterStart) filterStart.addEventListener('change', renderHistoryList);
if(filterEnd) filterEnd.addEventListener('change', renderHistoryList);

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

// 3. LISTAN RENDERÖINTI (AJOT)
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

    allHistoryData.forEach((drive, index) => {
        try {
            // Autosuodatus
            if (currentCarId !== 'all') {
                if (drive.carId && drive.carId !== currentCarId) return;
                if (!drive.carId) return;
            }

            let start = new Date(drive.startTime);
            if (isNaN(start.getTime())) return;

            // Aikasuodatus
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

            const card = document.createElement('div');
            card.className = 'log-card';
            
            const delay = Math.min(renderCount * 0.05, 1.0); 
            card.style.animationDelay = `${delay}s`;

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
            `;
            logList.appendChild(card);
            renderCount++;
        } catch (err) { console.error(err); }
    });

    if (renderCount === 0) {
        logList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei ajoja valittuna ajanjaksona.</p>";
        if(historySummaryEl) historySummaryEl.style.display = 'none';
    } else {
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        
        document.getElementById('sum-val-1').innerText = totalKm.toFixed(1);
        document.getElementById('sum-label-1').innerText = "km";

        document.getElementById('sum-val-2').innerText = renderCount;
        document.getElementById('sum-label-2').innerText = "kpl";

        document.getElementById('sum-val-3').innerText = `${h}h ${m}min`;
        document.getElementById('sum-label-3').innerText = "aika";
        
        if(historySummaryEl) historySummaryEl.style.display = 'flex';
    }
}

// 3B. LISTAN RENDERÖINTI (TANKKAUKSET)
window.renderFuelList = function() {
    const fuelList = document.getElementById('fuel-list');
    if(!fuelList) return;
    
    fuelList.innerHTML = "";
    
    if(!allRefuelings || allRefuelings.length === 0) {
        fuelList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei tankkauksia.</p>";
        return;
    }

    allRefuelings.forEach((ref, index) => {
        const date = new Date(ref.date);
        const dateStr = date.toLocaleDateString('fi-FI') + " " + date.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
        
        let carObj = userCars.find(c => c.id === ref.carId);
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
                <button class="delete-btn" onclick="window.openDeleteLogModal('${ref.key}')">🗑</button>
            </div>
            <div class="log-stats" style="grid-template-columns: repeat(3, 1fr);">
                <div><span class="stat-label">LITRAT</span>${ref.liters} L</div>
                <div><span class="stat-label">HINTA</span>${ref.euros} €</div>
                <div><span class="stat-label">€ / L</span>${ref.pricePerLiter}</div>
            </div>
            <div style="font-size:12px; color:#888; text-align:center; margin-top:5px;">Mittarilukema: ${ref.odo || "-"} km</div>
        `;
        fuelList.appendChild(card);
    });
}


// 4. TILASTOT (GRAAFIT + TABIT)
function renderStats() {
    const statsFuelContainer = document.getElementById('stats-fuel-container');
    if(statsFuelContainer && statsFuelContainer.style.display !== 'none') {
        renderFuelStats();
    } else {
        renderDriveStats();
    }
}

function renderDriveStats() {
    if (!allHistoryData || allHistoryData.length === 0) return;
    if (typeof Chart === 'undefined') return;

    // DATA PREP
    const monthlyData = {};
    const vehicleData = {};
    const styleData = { "Taloudellinen": 0, "Tasainen": 0, "Reipas": 0, "Aggressiivinen": 0 };
    
    // Autokohtainen kuukausidata viivakaaviolle
    const carMonthlyData = {}; 
    const speedData = {}; 

    // Järjestetään vanhimmasta uusimpaan trendejä varten
    const sortedDrives = [...allHistoryData].sort((a,b) => new Date(a.startTime) - new Date(b.startTime));

    sortedDrives.forEach(d => {
        const dist = parseFloat(d.distanceKm) || 0;
        const avgSpd = parseFloat(d.avgSpeed) || 0;
        const date = new Date(d.startTime);
        const monthKey = `${date.getMonth()+1}/${date.getFullYear()}`; 

        // Kokonaiskilometrit
        if (!monthlyData[monthKey]) monthlyData[monthKey] = 0;
        monthlyData[monthKey] += dist;

        // Ajoneuvot
        let carObj = userCars.find(c => c.id === d.carId);
        let carIcon = carObj ? (carObj.icon || (carObj.type==='bike'?"🚲":"🚗")) : (d.carIcon || (d.carType==='bike'?"🚲":"🚗"));
        let carName = carObj ? carObj.name : (d.carName || "Muu");
        let label = `${carIcon} ${carName}`;
        
        if (!vehicleData[label]) vehicleData[label] = 0;
        vehicleData[label] += dist;

        // Autokohtainen trendi
        if (!carMonthlyData[carName]) carMonthlyData[carName] = {};
        if (!carMonthlyData[carName][monthKey]) carMonthlyData[carName][monthKey] = 0;
        carMonthlyData[carName][monthKey] += dist;

        // Keskinopeus trendi
        if(avgSpd > 0) {
            if(!speedData[monthKey]) speedData[monthKey] = {sum:0, count:0};
            speedData[monthKey].sum += avgSpd;
            speedData[monthKey].count++;
        }

        // Ajotyyli
        if(d.drivingStyle) {
            if(!styleData[d.drivingStyle]) styleData[d.drivingStyle] = 0;
            styleData[d.drivingStyle]++;
        }
    });

    const monthLabels = Object.keys(monthlyData); 
    const monthValues = Object.values(monthlyData).map(v => v.toFixed(1));

    // 1. KILOMETRIT (BAR)
    const canvasMonthly = document.getElementById('chart-drive-monthly');
    if (canvasMonthly) {
        if (chartInstanceMonthly) { chartInstanceMonthly.destroy(); }
        chartInstanceMonthly = new Chart(canvasMonthly.getContext('2d'), {
            type: 'bar',
            data: { labels: monthLabels, datasets: [{ label: 'Kilometrit', data: monthValues, backgroundColor: 'rgba(41, 121, 255, 0.6)', borderColor: 'rgba(41, 121, 255, 1)', borderWidth: 1 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
        });
    }

    // 2. KILOMETRITRENDI (LINE)
    const canvasTrend = document.getElementById('chart-drive-trend');
    if (canvasTrend) {
        if (chartInstanceDriveTrend) { chartInstanceDriveTrend.destroy(); }
        
        const trendDatasets = [];
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        let colorIdx = 0;

        for (const [carName, monthsObj] of Object.entries(carMonthlyData)) {
            const dataArr = monthLabels.map(m => (monthsObj[m] || 0));
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
            data: { labels: monthLabels, datasets: trendDatasets },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }

    // 3. NOPEUSTRENDI (LINE)
    const canvasSpeed = document.getElementById('chart-drive-speed');
    if (canvasSpeed) {
        if (chartInstanceDriveSpeed) { chartInstanceDriveSpeed.destroy(); }
        
        const speedValues = monthLabels.map(m => {
            if(speedData[m] && speedData[m].count > 0) {
                return (speedData[m].sum / speedData[m].count).toFixed(1);
            }
            return 0;
        });

        chartInstanceDriveSpeed = new Chart(canvasSpeed.getContext('2d'), {
            type: 'line',
            data: { 
                labels: monthLabels, 
                datasets: [{
                    label: 'Ø Nopeus (km/h)',
                    data: speedValues,
                    borderColor: '#00e676',
                    backgroundColor: 'rgba(0, 230, 118, 0.1)',
                    fill: true,
                    tension: 0.4
                }] 
            },
            options: { responsive: true, scales: { y: { beginAtZero: true } } }
        });
    }

    // 4. AJONEUVOT (DOUGHNUT)
    const canvasVehicles = document.getElementById('chart-drive-vehicles');
    if (canvasVehicles) {
        if (chartInstanceVehicles) { chartInstanceVehicles.destroy(); }
        chartInstanceVehicles = new Chart(canvasVehicles.getContext('2d'), {
            type: 'doughnut',
            data: { labels: Object.keys(vehicleData), datasets: [{ data: Object.values(vehicleData).map(v => v.toFixed(1)), backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], borderWidth: 1 }] }
        });
    }

    // 5. AJOTYYLI (PIE)
    const canvasStyle = document.getElementById('chart-drive-style');
    if (canvasStyle) {
        if (chartInstanceStyle) { chartInstanceStyle.destroy(); }
        const filteredStyle = Object.entries(styleData).filter(([k,v]) => v > 0);
        chartInstanceStyle = new Chart(canvasStyle.getContext('2d'), {
            type: 'pie',
            data: { 
                labels: filteredStyle.map(x => x[0]), 
                datasets: [{ 
                    data: filteredStyle.map(x => x[1]),
                    backgroundColor: ['#00c853', '#2979ff', '#fbc02d', '#ff1744'] 
                }] 
            }
        });
    }
}

function renderFuelStats() {
    if (!allRefuelings || allRefuelings.length === 0) return;
    if (typeof Chart === 'undefined') return;

    // DATA PREP
    let totalRefuelEur = 0;
    let sumGas = 0; 
    let sumDiesel = 0; 
    
    const monthlyCosts = {};
    const trendGas = [];
    const trendDiesel = [];
    const carCosts = {};
    const fuelTypeData = {}; 

    const sortedRefs = [...allRefuelings].sort((a,b) => new Date(a.date) - new Date(b.date));

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

        const monthKey = `${date.getMonth()+1}/${date.getFullYear()}`;
        if(!monthlyCosts[monthKey]) monthlyCosts[monthKey] = 0;
        monthlyCosts[monthKey] += eur;

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

    // 1. POLTTOAINEJAKAUMA
    const canvasFuelType = document.getElementById('chart-fuel-type');
    if (canvasFuelType) {
        if (chartInstanceFuelType) { chartInstanceFuelType.destroy(); }
        chartInstanceFuelType = new Chart(canvasFuelType.getContext('2d'), {
            type: 'doughnut',
            data: { 
                labels: Object.keys(fuelTypeData), 
                datasets: [{ 
                    data: Object.values(fuelTypeData).map(v => v.toFixed(1)), 
                    backgroundColor: ['#4caf50', '#2196f3', '#9e9e9e'] 
                }] 
            }
        });
    }

    // 2. KUUKAUSIKULUT
    const monthLabels = Object.keys(monthlyCosts); 
    const monthValues = Object.values(monthlyCosts).map(v => v.toFixed(2));
    
    const canvasMonthly = document.getElementById('chart-fuel-monthly');
    if (canvasMonthly) {
        if (chartInstanceFuelMonthly) { chartInstanceFuelMonthly.destroy(); }
        chartInstanceFuelMonthly = new Chart(canvasMonthly.getContext('2d'), {
            type: 'bar',
            data: { labels: monthLabels, datasets: [{ label: 'Euroa (€)', data: monthValues, backgroundColor: '#fbc02d', borderColor: '#fbc02d', borderWidth: 1 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
        });
    }

    // 3. HINTATRENDI
    const canvasTrend = document.getElementById('chart-fuel-trend');
    if (canvasTrend) {
        if (chartInstanceFuelTrend) { chartInstanceFuelTrend.destroy(); }
        
        const allDates = [...new Set([...trendGas.map(d=>d.x), ...trendDiesel.map(d=>d.x)])];
        
        chartInstanceFuelTrend = new Chart(canvasTrend.getContext('2d'), {
            type: 'line',
            data: { 
                labels: allDates, 
                datasets: [
                    { 
                        label: 'Bensiini (€)', 
                        data: trendGas, 
                        borderColor: '#00e676', 
                        tension: 0.3,
                        pointRadius: 3
                    },
                    { 
                        label: 'Diesel (€)', 
                        data: trendDiesel, 
                        borderColor: '#212121', 
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        tension: 0.3,
                        pointRadius: 3
                    }
                ] 
            },
            options: { responsive: true }
        });
    }

    // 4. KULUT PER AUTO
    const canvasCar = document.getElementById('chart-fuel-car');
    if (canvasCar) {
        if (chartInstanceFuelCar) { chartInstanceFuelCar.destroy(); }
        chartInstanceFuelCar = new Chart(canvasCar.getContext('2d'), {
            type: 'doughnut',
            data: { 
                labels: Object.keys(carCosts), 
                datasets: [{ 
                    data: Object.values(carCosts).map(v => v.toFixed(2)), 
                    backgroundColor: ['#36A2EB', '#FF6384', '#4BC0C0', '#FF9F40'] 
                }] 
            }
        });
    }
}


// 5. APUFUNKTIOT
window.openEditLogModal = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive) return;
    if(editKeyEl) editKeyEl.value = key;
    if(editSubjectEl) editSubjectEl.value = drive.subject || "";
    if(editCarSelectEl) {
        editCarSelectEl.innerHTML = "";
        userCars.forEach(car => {
            const opt = document.createElement('option');
            opt.value = car.id;
            const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
            opt.text = `${icon} ${car.name}`;
            if(drive.carId === car.id) opt.selected = true;
            editCarSelectEl.appendChild(opt);
        });
    }
    if(editModal) editModal.style.display = 'flex';
};

window.openDeleteLogModal = (key) => {
    deleteKey = key;
    if(deleteModal) deleteModal.style.display = 'flex';
};

window.updateLogSubject = (key, text) => { 
    if(currentUser) db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update({ subject: text }); 
};

if(btnEditCancel) btnEditCancel.addEventListener('click', () => { if(editModal) editModal.style.display = 'none'; });
if(btnEditSave) btnEditSave.addEventListener('click', () => {
    const key = editKeyEl.value;
    const newCarId = editCarSelectEl.value;
    const carObj = userCars.find(c => c.id === newCarId);
    if (key && currentUser && carObj) {
        db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update({ subject: editSubjectEl.value, carId: carObj.id, carName: carObj.name, carIcon: carObj.icon || "🚗", carType: carObj.type }).then(() => { if(editModal) editModal.style.display = 'none'; });
    }
});
if(btnDeleteCancel) btnDeleteCancel.addEventListener('click', () => { if(deleteModal) deleteModal.style.display = 'none'; deleteKey = null; });
if(btnDeleteConfirm) btnDeleteConfirm.addEventListener('click', () => { if (deleteKey && currentUser) { db.ref('ajopaivakirja/' + currentUser.uid + '/' + deleteKey).remove(); if(deleteModal) deleteModal.style.display = 'none'; deleteKey = null; } });
