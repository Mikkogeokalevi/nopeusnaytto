// =========================================================
// HISTORY.JS - HISTORIA, SUODATUS JA RAPORTOINTI (v5.99 OFFLINE & WALKING)
// =========================================================

// --- 0. OFFLINE MANAGER (UUSI) ---

// Ladataan odottavat ajot heti käynnistyksessä
function initOfflineManager() {
    const stored = localStorage.getItem('pendingDrives');
    if (stored) {
        try {
            pendingDrives = JSON.parse(stored);
            console.log(`[OfflineManager] Ladattiin ${pendingDrives.length} odottavaa ajoa muistista.`);
        } catch (e) {
            console.error("Virhe offline-datan latauksessa", e);
            pendingDrives = [];
        }
    }
    // Päivitetään synkronointinappi näkyviin jos tarve (pienellä viiveellä että DOM on valmis)
    setTimeout(updateSyncButton, 1000);
}

// Turvallinen tallennus (Kutsutaan GPS.js:stä)
window.saveDriveSafely = function(driveData) {
    if (navigator.onLine) {
        return db.ref('ajopaivakirja/' + currentUser.uid).push().set(driveData)
            .then(() => {
                if(typeof showToast === 'function') showToast("Tallennettu pilveen! ☁️");
                return true;
            })
            .catch((err) => {
                console.warn("Pilvitallennus epäonnistui, tallennetaan paikallisesti.", err);
                saveOffline(driveData);
                return false;
            });
    } else {
        saveOffline(driveData);
        return Promise.resolve(false);
    }
};

function saveOffline(data) {
    data.tempId = Date.now(); // Väliaikainen ID
    data.isOffline = true;
    pendingDrives.push(data);
    localStorage.setItem('pendingDrives', JSON.stringify(pendingDrives));
    if(typeof showToast === 'function') showToast("Ei yhteyttä. Tallennettu laitteelle! 💾");
    updateSyncButton();
    if(typeof renderHistoryList === 'function') renderHistoryList(); // Päivitä lista heti
}

function updateSyncButton() {
    const btnSync = document.getElementById('btn-sync-offline');
    if (!btnSync) return;

    if (pendingDrives.length > 0) {
        btnSync.style.display = 'inline-block';
        btnSync.innerText = `🔄 Synkronoi (${pendingDrives.length})`;
        btnSync.onclick = uploadPendingDrives;
    } else {
        btnSync.style.display = 'none';
    }
}

function uploadPendingDrives() {
    if (!navigator.onLine) {
        alert("Ei verkkoyhteyttä. Yritä myöhemmin.");
        return;
    }
    
    if (!currentUser) return;

    const btnSync = document.getElementById('btn-sync-offline');
    btnSync.disabled = true;
    btnSync.innerText = "Lähetetään...";

    let promises = pendingDrives.map(drive => {
        const cleanDrive = { ...drive };
        delete cleanDrive.tempId;
        delete cleanDrive.isOffline;
        
        return db.ref('ajopaivakirja/' + currentUser.uid).push().set(cleanDrive)
            .then(() => ({ success: true, tempId: drive.tempId }))
            .catch(err => ({ success: false, tempId: drive.tempId, error: err }));
    });

    Promise.all(promises).then(results => {
        const successIds = results.filter(r => r.success).map(r => r.tempId);
        
        // Poistetaan onnistuneet listasta
        pendingDrives = pendingDrives.filter(d => !successIds.includes(d.tempId));
        localStorage.setItem('pendingDrives', JSON.stringify(pendingDrives));
        
        updateSyncButton();
        if(typeof showToast === 'function') showToast(`Synkronoitu ${successIds.length} ajoa! ✅`);
        if(typeof renderHistoryList === 'function') renderHistoryList();
    });
}


// --- 1. HISTORIAN LATAUS ---

let allRefuelings = []; 

function loadHistory() {
    if (!currentUser) return;

    const historyRef = db.ref('ajopaivakirja/' + currentUser.uid).orderByChild('startTime');
    historyRef.on('value', (snapshot) => {
        allHistoryData = []; 
        allRefuelings = [];

        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const val = child.val();
                val.key = child.key;

                // Erotellaan tankkaukset ja ajot
                if (val.type === 'refuel') {
                    allRefuelings.push(val);
                } else {
                    allHistoryData.push(val);
                }
            });
            // Käännetään järjestys: uusin ensin
            allHistoryData.reverse();
            allRefuelings.reverse();
        }
        
        renderHistoryList();
        renderFuelList(); // Päivitetään myös tankkauslista
    });
}

function loadRefuelings() {
    // Tämä on nyt yhdistetty loadHistoryyn tehokkuuden vuoksi, 
    // mutta pidetään funktio olemassa yhteensopivuuden takia.
}

// --- 2. LISTAN RENDERÖINTI (Drives) ---

window.renderHistoryList = () => {
    const list = document.getElementById('log-list');
    if (!list) return;
    list.innerHTML = "";

    // Yhdistetään pilvidata ja offline-data
    // Offline-datat näytetään ensin (ne ovat yleensä uusimpia)
    let displayData = [...pendingDrives.slice().reverse(), ...allHistoryData];

    // Suodatus
    if (currentCarId !== 'all' && currentCarId !== 'all_archived') {
        displayData = displayData.filter(d => d.carId === currentCarId);
    }

    if (displayData.length === 0) {
        list.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Ei ajohistoriaa.</div>";
        return;
    }

    displayData.forEach(drive => {
        // Määritellään ikoni ja väri tyypin mukaan
        let icon = drive.carIcon || "🚗";
        let typeColor = "var(--accent-color)";
        
        // KÄVELY (Walking)
        if (drive.carType === 'walking') {
            if (!drive.carIcon || drive.carIcon === '🚗') icon = "🚶";
            typeColor = "#8bc34a"; // Vihreä
        }
        // PYÖRÄ (Bike)
        else if (drive.carType === 'bike') {
            if (!drive.carIcon || drive.carIcon === '🚗') icon = "🚲";
            typeColor = "#555"; // Harmaa
        }
        // MP (Motorcycle)
        else if (drive.carType === 'motorcycle') {
             typeColor = "#ff9800"; // Oranssi
        }

        const dateObj = new Date(drive.startTime);
        const dateStr = dateObj.toLocaleDateString('fi-FI');
        const timeStr = dateObj.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        const dist = parseFloat(drive.distanceKm || 0).toFixed(2);
        const duration = (drive.durationMs / 60000).toFixed(0);
        
        let offlineBadge = "";
        if (drive.isOffline) {
            offlineBadge = `<span style="background:var(--accent-color); color:#fff; font-size:10px; padding:2px 5px; border-radius:4px; margin-left:5px;">OFFLINE</span>`;
        }

        const div = document.createElement('div');
        div.className = 'log-item';
        div.style.borderLeft = `4px solid ${typeColor}`; // Värikoodi reunaan
        
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <strong style="font-size:16px;">${dateStr} ${timeStr} ${offlineBadge}</strong><br>
                    <span style="color:var(--speed-color); font-weight:bold; font-size:14px;">${icon} ${dist} km</span> 
                    <span style="color:var(--subtext-color); font-size:13px;">• ${duration} min</span>
                    <div style="margin-top:4px; font-size:13px; color:#ccc;">${drive.subject || "Ei aihetta"}</div>
                    <div style="font-size:11px; color:#666; margin-top:2px;">${drive.carName || "Auto"} • ${drive.driveType === 'job' ? 'Työajo' : 'Oma ajo'}</div>
                </div>
                <div style="display:flex; flex-direction:column; gap:5px;">
                    <button class="icon-btn" onclick="showRouteOnMap('${drive.key}')">🗺</button>
                    ${!drive.isOffline ? `<button class="icon-btn" onclick="openEditLog('${drive.key}')">✏️</button>` : ''}
                    ${drive.isOffline ? 
                        `<button class="icon-btn" style="color:red;" onclick="deleteOfflineDrive(${drive.tempId})">🗑</button>` : 
                        `<button class="icon-btn" style="color:red;" onclick="openDeleteLog('${drive.key}')">🗑</button>`
                    }
                </div>
            </div>
        `;
        list.appendChild(div);
    });
};

// --- 3. LISTAN RENDERÖINTI (Fuel) ---

window.renderFuelList = () => {
    const list = document.getElementById('fuel-list');
    if (!list) return;
    list.innerHTML = "";

    // Suodatetaan tankkaukset valitun auton mukaan
    let displayData = allRefuelings;
    if (currentCarId !== 'all' && currentCarId !== 'all_archived') {
        displayData = displayData.filter(d => d.carId === currentCarId);
    }

    if (displayData.length === 0) {
        list.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Ei tankkauksia.</div>";
        return;
    }

    displayData.forEach(ref => {
        const dateObj = new Date(ref.date); // ref.date on ISO string
        const dateStr = dateObj.toLocaleDateString('fi-FI');
        
        const div = document.createElement('div');
        div.className = 'log-item';
        div.style.borderLeft = "4px solid #ffeb3b"; // Keltainen tankkauksille
        
        // Etsitään auton nimi (voi olla poistettu, joten varaudutaan)
        const car = userCars.find(c => c.id === ref.carId);
        const carName = car ? car.name : "Tuntematon";

        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <div>
                    <strong style="font-size:15px;">⛽ ${dateStr}</strong><br>
                    <span style="font-size:14px;">${ref.liters} L • ${ref.euros} €</span><br>
                    <span style="font-size:12px; color:#888;">${carName} • ${ref.pricePerLiter} €/L</span>
                </div>
                <div style="display:flex; gap:5px;">
                    <button class="icon-btn" onclick="editRefueling('${ref.key}')">✏️</button>
                    <button class="icon-btn" style="color:red;" onclick="if(confirm('Poista tankkaus?')) db.ref('ajopaivakirja/'+currentUser.uid+'/'+'${ref.key}').remove()">🗑</button>
                </div>
            </div>
        `;
        list.appendChild(div);
    });
};


// --- 4. TILASTOT (STATS) ---

window.renderStats = () => {
    // Ohjataan oikeaan funktioon tabin perusteella
    const drivesContainer = document.getElementById('stats-drives-container');
    if (drivesContainer && drivesContainer.style.display !== 'none') {
        window.renderDriveStats();
    } else {
        window.renderFuelStats();
    }
};

window.renderDriveStats = () => {
    const container = document.getElementById('stats-drives-container');
    if (!container) return;
    container.innerHTML = "";

    // Suodatus
    let data = allHistoryData;
    if (currentCarId !== 'all' && currentCarId !== 'all_archived') {
        data = data.filter(d => d.carId === currentCarId);
    }

    let totalDist = 0;
    let totalTimeMs = 0;
    let driveCount = data.length;
    
    // Kategoriat donitsia varten
    let kmByCar = 0;
    let kmByMoto = 0;
    let kmByBike = 0;
    let kmByWalk = 0;

    data.forEach(d => {
        const km = parseFloat(d.distanceKm || 0);
        totalDist += km;
        totalTimeMs += (d.durationMs || 0);

        if (d.carType === 'bike') kmByBike += km;
        else if (d.carType === 'motorcycle') kmByMoto += km;
        else if (d.carType === 'walking') kmByWalk += km;
        else kmByCar += km; // Default car
    });

    const hours = Math.floor(totalTimeMs / 3600000);
    const mins = Math.floor((totalTimeMs % 3600000) / 60000);

    // Yhteenvetokortti
    container.innerHTML += `
        <div class="stat-card" style="text-align:center;">
            <div style="font-size:14px; color:#888;">Yhteensä</div>
            <div style="font-size:32px; font-weight:bold; color:var(--accent-color); margin:5px 0;">${totalDist.toFixed(1)} <span style="font-size:16px;">km</span></div>
            <div style="font-size:14px; color:#ccc;">${hours}h ${mins}min • ${driveCount} kpl</div>
        </div>
    `;

    // Canvas donitsille
    const chartDiv = document.createElement('div');
    chartDiv.style.position = "relative";
    chartDiv.style.height = "250px";
    chartDiv.style.width = "100%";
    chartDiv.innerHTML = '<canvas id="driveChart"></canvas>';
    container.appendChild(chartDiv);

    // Piirretään Chart.js
    const ctx = document.getElementById('driveChart').getContext('2d');
    
    // Piilotetaan tyhjät kategoriat
    const labels = [];
    const points = [];
    const colors = [];

    if (kmByCar > 0) { labels.push('Auto'); points.push(kmByCar); colors.push('#2979ff'); }
    if (kmByMoto > 0) { labels.push('MP'); points.push(kmByMoto); colors.push('#ff9800'); }
    if (kmByBike > 0) { labels.push('Pyörä'); points.push(kmByBike); colors.push('#555555'); }
    if (kmByWalk > 0) { labels.push('Kävely'); points.push(kmByWalk); colors.push('#8bc34a'); }

    if (points.length === 0) {
        chartDiv.innerHTML = "<div style='text-align:center; padding-top:100px; color:#666;'>Ei dataa kaaviolle.</div>";
    } else {
        new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: labels,
                datasets: [{
                    data: points,
                    backgroundColor: colors,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { position: 'bottom', labels: { color: '#ccc' } }
                }
            }
        });
    }
};

window.renderFuelStats = () => {
    const container = document.getElementById('stats-fuel-container');
    if (!container) return;
    container.innerHTML = "";

    // Suodatus
    let data = allRefuelings;
    if (currentCarId !== 'all' && currentCarId !== 'all_archived') {
        data = data.filter(d => d.carId === currentCarId);
    }

    if (data.length === 0) {
        container.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Ei tankkaustietoja.</div>";
        return;
    }

    let totalLiters = 0;
    let totalEuros = 0;
    
    data.forEach(d => {
        totalLiters += parseFloat(d.liters || 0);
        totalEuros += parseFloat(d.euros || 0);
    });
    
    const avgPrice = totalLiters > 0 ? (totalEuros / totalLiters).toFixed(3) : "0.000";

    container.innerHTML = `
        <div class="stat-card" style="display:flex; justify-content:space-around; text-align:center;">
            <div>
                <div style="font-size:12px; color:#888;">Litrat</div>
                <div style="font-size:20px; color:#ffeb3b;">${totalLiters.toFixed(1)}</div>
            </div>
            <div>
                <div style="font-size:12px; color:#888;">Eurot</div>
                <div style="font-size:20px; color:#ffeb3b;">${totalEuros.toFixed(2)}€</div>
            </div>
        </div>
        <div class="stat-card" style="text-align:center;">
            <div style="font-size:12px; color:#888;">Keskihinta</div>
            <div style="font-size:24px;">${avgPrice} €/L</div>
        </div>
    `;
};


// --- 5. CSV EXPORT & PREVIEW ---

window.populatePreviewTable = () => {
    const tableBody = document.querySelector('#preview-table tbody');
    if(!tableBody) return;
    tableBody.innerHTML = "";
    
    // Otetaan viimeiset 5 ajoa esikatseluun
    const previewData = allHistoryData.slice(0, 5);
    
    if (previewData.length === 0) {
        tableBody.innerHTML = "<tr><td colspan='4' style='text-align:center;'>Ei dataa</td></tr>";
        return;
    }

    previewData.forEach(d => {
        const date = new Date(d.startTime).toLocaleDateString();
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${date}</td>
            <td>${d.carName || '-'}</td>
            <td>${d.distanceKm} km</td>
            <td>${d.driveType === 'job' ? 'Työ' : 'Oma'}</td>
        `;
        tableBody.appendChild(tr);
    });
};

window.exportToCSV = () => {
    // 1. Luodaan CSV-sisältö
    let csvContent = "\uFEFF"; // BOM (Byte Order Mark) jotta Excel ymmärtää UTF-8 (ääkköset)
    csvContent += "Pvm;Klo;Auto;Rekisteri;Tyyppi;Matka (km);Kesto (min);Keskinopeus;Huippunopeus;Aihe;Sijainti;Ajotapa\n";

    // Suodatetaan tarvittaessa
    let dataToExport = allHistoryData;
    if (currentCarId !== 'all' && currentCarId !== 'all_archived') {
        dataToExport = dataToExport.filter(d => d.carId === currentCarId);
    }

    dataToExport.forEach(d => {
        const start = new Date(d.startTime);
        const dateStr = start.toLocaleDateString('fi-FI');
        const timeStr = start.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
        
        // Haetaan rekisterinumero (jos tallessa autolistassa)
        let plate = "-";
        const carObj = userCars.find(c => c.id === d.carId);
        if (carObj) plate = carObj.plate || "-";

        let row = [
            dateStr,
            timeStr,
            d.carName || "Muu",
            plate,
            (d.driveType === 'job' ? "Työajo" : "Oma ajo"),
            (d.distanceKm || "0").toString().replace('.', ','),
            (d.durationMs / 60000).toFixed(0),
            (d.avgSpeed || "0").toString().replace('.', ','),
            (d.maxSpeed || "0").toString().replace('.', ','),
            (d.subject || "").replace(/;/g, ' '), // Poista puolipisteet tekstistä
            (d.startAddress || "").replace(/;/g, ' '),
            d.drivingStyle || "-"
        ];
        
        csvContent += row.join(";") + "\n";
    });

    // 2. Latauslinkki
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `ajopaivakirja_export_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};


// --- 6. MUOKKAUS JA POISTO ---

window.openEditLog = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive) return;
    
    // Täytä modaali
    document.getElementById('edit-key').value = key;
    document.getElementById('edit-subject').value = drive.subject || "";
    
    // Aseta aika ja matka (jos kentät ovat olemassa edit-modalissa)
    const dtField = document.getElementById('edit-datetime');
    if (dtField) dtField.value = new Date(drive.startTime).toISOString().slice(0,16);
    
    const distField = document.getElementById('edit-distance');
    if (distField) distField.value = drive.distanceKm;

    // Aseta auto
    const sel = document.getElementById('edit-car-select');
    if (sel) {
        populateFuelCarSelect(drive.carId, sel); 
    }

    // Aseta tyyppi (Työ/Oma)
    const rPrivate = document.getElementById('edit-type-private');
    const rJob = document.getElementById('edit-type-job');
    if (drive.driveType === 'job') { if(rJob) rJob.checked = true; }
    else { if(rPrivate) rPrivate.checked = true; }

    const modal = document.getElementById('edit-modal');
    if(modal) modal.style.display = 'flex';
};

window.openDeleteLogModal = (key) => {
    deleteKey = key;
    if(deleteModal) deleteModal.style.display = 'flex';
};

window.deleteOfflineDrive = function(tempId) {
    if(confirm("Poistetaanko tämä tallentamaton ajo puhelimen muistista?")) {
        pendingDrives = pendingDrives.filter(d => d.tempId !== tempId);
        localStorage.setItem('pendingDrives', JSON.stringify(pendingDrives));
        // Päivitä lista
        if(typeof renderHistoryList === 'function') renderHistoryList();
        updateSyncButton();
    }
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
if(btnDeleteConfirm2) btnDeleteConfirm2.addEventListener('click', () => { 
    if (deleteKey && currentUser) {
        db.ref('ajopaivakirja/' + currentUser.uid + '/' + deleteKey).remove()
            .then(() => {
                if(typeof showToast === 'function') showToast("Merkintä poistettu! 🗑");
                if(deleteModal) deleteModal.style.display = 'none';
                deleteKey = null;
            });
    }
});

// Init
window.addEventListener('load', initOfflineManager);
