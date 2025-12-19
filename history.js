// =========================================================
// HISTORY.JS - HISTORIA, SUODATUS JA TILASTOT
// =========================================================

// 1. HISTORIAN LATAUS
function loadHistory() {
    if (!currentUser) {
        console.log("loadHistory: Ei käyttäjää, keskeytetään.");
        return;
    }

    console.log("loadHistory: Aloitetaan lataus käyttäjälle", currentUser.uid);
    
    // Poista vanha kuuntelija ja lisää uusi
    db.ref('ajopaivakirja/' + currentUser.uid).off();
    
    // KORJAUS: Käytetään startTime-indeksiä, joka on määritelty säännöissä
    const historyRef = db.ref('ajopaivakirja/' + currentUser.uid)
                         .orderByChild('startTime')
                         .limitToLast(300);

    historyRef.on('value', (snapshot) => {
        console.log("loadHistory: Data saapui Firebasesta.");
        allHistoryData = [];
        
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                if (data && typeof data === 'object') {
                    allHistoryData.push({ key: child.key, ...data });
                }
            });
        } else {
            console.log("loadHistory: Ei löytynyt tallennettuja ajoja.");
        }

        // Järjestä uusin ensin (käänteinen järjestys, koska Firebase antaa vanhimman ensin)
        allHistoryData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        
        // Päivitä suodatinvalikko
        if(typeof populateFilter === 'function') populateFilter();
        
        // KORJAUS: Pakota listan päivitys heti, jotta "Ladataan..." teksti katoaa
        if(typeof renderHistoryList === 'function') renderHistoryList();
        
        // Päivitä tilastot
        if(typeof renderStats === 'function') renderStats();

    }, (error) => {
        // VIRHEENKÄSITTELY
        console.error("loadHistory VIRHE:", error);
        const logList = document.getElementById('log-list');
        if(logList) {
            logList.innerHTML = `<p style="color:red; text-align:center;">Virhe tietojen latauksessa:<br>${error.message}</p>`;
        }
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
    filterEl.innerHTML = `
        <option value="all">Kaikki ajot</option>
        <option value="custom">Mukautettu aikaväli...</option>
    `;
    
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
        if(currentVal === 'custom' && customFilterContainer) customFilterContainer.style.display = 'block';
    }
}

// 3. LISTAN RENDERÖINTI
function renderHistoryList() {
    const logList = document.getElementById('log-list');
    if(!logList) return; // Jos elementtiä ei löydy, lopeta
    
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

    allHistoryData.forEach(drive => {
        try {
            // Suodatus autotallin valinnan mukaan
            if (currentCarId !== 'all') {
                if (drive.carId && drive.carId !== currentCarId) return;
                // Vanhat merkinnät ilman carId:tä näytetään vain jos "all"
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

            // Ajan laskenta
            let durationMinutes = 0;
            let durationMs = 0;
            if (drive.durationMs) {
                durationMs = drive.durationMs;
                durationMinutes = Math.floor(drive.durationMs / 60000);
            } else if (drive.endTime && start) {
                const end = new Date(drive.endTime);
                if (!isNaN(end.getTime())) {
                    durationMs = (end - start);
                    durationMinutes = Math.floor(durationMs / 60000);
                }
            }
            
            const dist = parseFloat(drive.distanceKm) || 0;
            totalKm += dist;
            totalMs += durationMs;

            // Karttanappi
            let mapBtn = "";
            if (drive.route && drive.route.length > 0) {
                mapBtn = `<button class="map-btn" onclick="window.showRouteOnMap('${drive.key}')" title="Näytä reitti">🗺️</button>`;
            }

            // Hae ikoni
            let carObj = userCars.find(c => c.id === drive.carId);
            let icon = carObj ? (carObj.icon || (carObj.type==='bike'?"🚲":"🚗")) : (drive.carIcon || (drive.carType==='bike'?"🚲":"🚗"));
            let carName = carObj ? carObj.name : (drive.carName || "Muu");

            // Muotoilu
            let dateStr = start.toLocaleDateString('fi-FI');
            let startH = start.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
            let endH = "";
            if (drive.endTime) {
                endH = " - " + new Date(drive.endTime).toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
            }
            let timeRange = `(${startH}${endH})`;

            const card = document.createElement('div');
            card.className = 'log-card';
            card.innerHTML = `
                <div class="log-header">
                    <div class="log-title-group">
                        <div class="log-date-line">${dateStr} ${timeRange}</div>
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
        logList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei ajoja valittuna ajanjaksona / ajoneuvolla.</p>";
        if(historySummaryEl) historySummaryEl.style.display = 'none';
    } else {
        if(sumKmEl) sumKmEl.innerText = totalKm.toFixed(1);
        if(sumCountEl) sumCountEl.innerText = renderCount;
        
        const h = Math.floor(totalMs / 3600000);
        const m = Math.floor((totalMs % 3600000) / 60000);
        if(sumTimeEl) sumTimeEl.innerText = `${h}h ${m}min`;
        
        if(historySummaryEl) historySummaryEl.style.display = 'flex';
    }
}

// 4. TILASTOT (GRAAFIT)
function renderStats() {
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

        // Hae oikea ikoni ja nimi
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
        // Tuhotaan vanha ennen uuden luontia, jotta ei tule haamukuvia
        if (chartInstanceMonthly) {
            chartInstanceMonthly.destroy();
            chartInstanceMonthly = null;
        }
        const ctxMonthly = canvasMonthly.getContext('2d');
        
        chartInstanceMonthly = new Chart(ctxMonthly, {
            type: 'bar',
            data: {
                labels: monthLabels,
                datasets: [{
                    label: 'Kilometrit',
                    data: monthValues,
                    backgroundColor: 'rgba(41, 121, 255, 0.6)',
                    borderColor: 'rgba(41, 121, 255, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                scales: { y: { beginAtZero: true } },
                plugins: { legend: { display: false } }
            }
        });
    }

    const canvasVehicles = document.getElementById('chart-vehicles');
    if (canvasVehicles) {
        if (chartInstanceVehicles) {
            chartInstanceVehicles.destroy();
            chartInstanceVehicles = null;
        }
        const ctxVehicles = canvasVehicles.getContext('2d');
        
        chartInstanceVehicles = new Chart(ctxVehicles, {
            type: 'doughnut',
            data: {
                labels: vehicleLabels,
                datasets: [{
                    data: vehicleValues,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.7)',
                        'rgba(54, 162, 235, 0.7)',
                        'rgba(255, 206, 86, 0.7)',
                        'rgba(75, 192, 192, 0.7)',
                        'rgba(153, 102, 255, 0.7)'
                    ],
                    borderWidth: 1
                }]
            }
        });
    }
}

// 5. MUOKKAUS JA POISTO (Globaalit funktiot)

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

// Modal logiikka
if(btnEditCancel) {
    btnEditCancel.addEventListener('click', () => {
        if(editModal) editModal.style.display = 'none';
    });
}

if(btnEditSave) {
    btnEditSave.addEventListener('click', () => {
        const key = editKeyEl.value;
        const newCarId = editCarSelectEl.value;
        const carObj = userCars.find(c => c.id === newCarId);
        
        if (key && currentUser && carObj) {
            db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update({
                subject: editSubjectEl.value,
                carId: carObj.id,
                carName: carObj.name,
                carIcon: carObj.icon || "🚗",
                carType: carObj.type
            }).then(() => {
                if(editModal) editModal.style.display = 'none';
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

if(btnDeleteConfirm) {
    btnDeleteConfirm.addEventListener('click', () => {
        if (deleteKey && currentUser) {
            db.ref('ajopaivakirja/' + currentUser.uid + '/' + deleteKey).remove();
            if(deleteModal) deleteModal.style.display = 'none';
            deleteKey = null;
        }
    });
}
