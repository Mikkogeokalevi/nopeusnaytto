// =========================================================
// HISTORY.JS - HISTORIA, SUODATUS JA TILASTOT
// =========================================================

// 1. HISTORIAN LATAUS
function loadHistory() {
    if (!currentUser) return;

    // Poista vanha kuuntelija ja lisää uusi
    db.ref('ajopaivakirja/' + currentUser.uid).off();
    
    const historyRef = db.ref('ajopaivakirja/' + currentUser.uid)
                         .orderByChild('startTime')
                         .limitToLast(300);

    historyRef.on('value', (snapshot) => {
        allHistoryData = [];
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                if (data && typeof data === 'object') {
                    allHistoryData.push({ key: child.key, ...data });
                }
            });
        }
        // Järjestä uusin ensin
        allHistoryData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        
        if(typeof populateFilter === 'function') populateFilter();
        
        // Jos olemme "Ajot"-tabissa, renderöi lista.
        const logList = document.getElementById('log-list');
        if (logList && logList.style.display !== 'none') {
            renderHistoryList();
        }
        
        if(typeof renderStats === 'function') renderStats();

    }, (error) => {
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

// 3. LISTAN RENDERÖINTI
function renderHistoryList() {
    const logList = document.getElementById('log-list');
    if(!logList) return; 
    
    logList.innerHTML = "";
    
    // Tarkistetaan onko yhtään ajoa
    if (allHistoryData.length === 0) {
        logList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei tallennettuja ajoja.</p>";
        if(historySummaryEl) historySummaryEl.style.display = 'none';
        return;
    }

    const selectedFilter = filterEl ? filterEl.value : 'all';
    let renderCount = 0;
    let totalKm = 0;
    let totalMs = 0;

    allHistoryData.forEach(drive => {
        try {
            if (currentCarId !== 'all') {
                if (drive.carId && drive.carId !== currentCarId) return;
                if (!drive.carId) return;
            }

            let start = new Date(drive.startTime);
            if (isNaN(start.getTime())) return;

            // Aikavälisuodatus
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

            // Data calculation
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

            // UI Elements
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

    // PÄIVITÄ YHTEENVETO (UUSI ID-JÄRJESTELMÄ)
    if (renderCount === 0) {
        logList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei ajoja valittuna ajanjaksona.</p>";
        if(historySummaryEl) historySummaryEl.style.display = 'none';
    } else {
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        
        // PAIKKA 1: KM
        document.getElementById('sum-val-1').innerText = totalKm.toFixed(1);
        document.getElementById('sum-label-1').innerText = "km";

        // PAIKKA 2: KPL
        document.getElementById('sum-val-2').innerText = renderCount;
        document.getElementById('sum-label-2').innerText = "kpl";

        // PAIKKA 3: AIKA
        document.getElementById('sum-val-3').innerText = `${h}h ${m}min`;
        document.getElementById('sum-label-3').innerText = "aika";
        
        if(historySummaryEl) historySummaryEl.style.display = 'flex';
    }
}

// 4. TILASTOT
function renderStats() {
    // Tankkaukset
    let totalRefuelEur = 0;
    let totalRefuelLit = 0;
    if (allRefuelings && allRefuelings.length > 0) {
        allRefuelings.forEach(ref => {
            if (currentCarId === 'all' || ref.carId === currentCarId) {
                totalRefuelEur += (parseFloat(ref.euros) || 0);
                totalRefuelLit += (parseFloat(ref.liters) || 0);
            }
        });
    }
    const statFuelEur = document.getElementById('stat-fuel-eur');
    const statFuelLit = document.getElementById('stat-fuel-lit');
    if(statFuelEur) statFuelEur.innerText = totalRefuelEur.toFixed(2) + " €";
    if(statFuelLit) statFuelLit.innerText = totalRefuelLit.toFixed(1) + " L";

    // Graafit
    if (!allHistoryData || allHistoryData.length === 0) return;
    if (typeof Chart === 'undefined') return;

    const monthlyData = {};
    const vehicleData = {};

    allHistoryData.forEach(d => {
        const dist = parseFloat(d.distanceKm) || 0;
        const date = new Date(d.startTime);
        const monthKey = `${date.getMonth()+1}/${date.getFullYear()}`;
        if (!monthlyData[monthKey]) monthlyData[monthKey] = 0;
        monthlyData[monthKey] += dist;

        let carObj = userCars.find(c => c.id === d.carId);
        let carIcon = carObj ? (carObj.icon || (carObj.type==='bike'?"🚲":"🚗")) : (d.carIcon || (d.carType==='bike'?"🚲":"🚗"));
        let carName = carObj ? carObj.name : (d.carName || "Muu");
        let label = `${carIcon} ${carName}`;
        
        if (!vehicleData[label]) vehicleData[label] = 0;
        vehicleData[label] += dist;
    });

    const monthLabels = Object.keys(monthlyData).reverse().slice(0, 6).reverse(); 
    const monthValues = monthLabels.map(k => monthlyData[k].toFixed(1));
    const vehicleLabels = Object.keys(vehicleData);
    const vehicleValues = Object.values(vehicleData).map(v => v.toFixed(1));

    const canvasMonthly = document.getElementById('chart-monthly');
    if (canvasMonthly) {
        if (chartInstanceMonthly) { chartInstanceMonthly.destroy(); chartInstanceMonthly = null; }
        chartInstanceMonthly = new Chart(canvasMonthly.getContext('2d'), {
            type: 'bar',
            data: { labels: monthLabels, datasets: [{ label: 'Kilometrit', data: monthValues, backgroundColor: 'rgba(41, 121, 255, 0.6)', borderColor: 'rgba(41, 121, 255, 1)', borderWidth: 1 }] },
            options: { responsive: true, scales: { y: { beginAtZero: true } }, plugins: { legend: { display: false } } }
        });
    }
    const canvasVehicles = document.getElementById('chart-vehicles');
    if (canvasVehicles) {
        if (chartInstanceVehicles) { chartInstanceVehicles.destroy(); chartInstanceVehicles = null; }
        chartInstanceVehicles = new Chart(canvasVehicles.getContext('2d'), {
            type: 'doughnut',
            data: { labels: vehicleLabels, datasets: [{ data: vehicleValues, backgroundColor: ['rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)', 'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)', 'rgba(153, 102, 255, 0.7)'], borderWidth: 1 }] }
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
