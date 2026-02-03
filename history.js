// =========================================================
// HISTORY.JS - HISTORIA, TILASTOT JA RAPORTOINTI (v6.13 SEGMENT ADDRESSES)
// =========================================================

// --- ASETUKSET ---
const DEFAULT_KM_RATE = 0.57; 

// --- 1. DOM ELEMENTIT (SIIRRETTY ALKUUN VIRHEIDEN VÄLTTÄMISEKSI) ---
const filterEl = document.getElementById('history-filter');
const customFilterContainer = document.getElementById('custom-filter-container');
const filterStart = document.getElementById('filter-start');
const filterEnd = document.getElementById('filter-end');
const historySummaryEl = document.getElementById('history-summary');
const statsTimeRange = document.getElementById('stats-time-range');

// Globaalit muuttujat datalle
if (typeof allHistoryData === 'undefined') var allHistoryData = [];
if (typeof allRefuelings === 'undefined') var allRefuelings = [];
let chartInstances = {}; // Chart.js instanssien hallinta

// =========================================================
// 0. OFFLINE MANAGER
// =========================================================

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
    setTimeout(updateSyncButton, 1000);
}

window.saveDriveSafely = function(driveData, updateKey = null) {
    if (navigator.onLine) {
        if (updateKey) {
            return db.ref('ajopaivakirja/' + currentUser.uid + '/' + updateKey).update(driveData)
                .then(() => {
                    if(typeof showToast === 'function') showToast("Ajo päivitetty pilveen! ☁️");
                    return true;
                })
                .catch((err) => {
                    alert("Virhe päivityksessä: " + err.message);
                    return false;
                });
        } else {
            return db.ref('ajopaivakirja/' + currentUser.uid).push().set(driveData)
                .then(() => {
                    if(typeof showToast === 'function') showToast("Tallennettu pilveen! ☁️");
                    return true;
                })
                .catch((err) => {
                    console.warn("Pilvitallennus epäonnistui, tallennetaan paikallisesti.", err);
                    saveLocally(driveData);
                    return true;
                });
        }
    } else {
        saveLocally(driveData);
        return Promise.resolve(true);
    }
};

function saveLocally(data) {
    data.tempId = Date.now().toString(); 
    data.isPending = true; 
    pendingDrives.push(data);
    localStorage.setItem('pendingDrives', JSON.stringify(pendingDrives));
    if(typeof showToast === 'function') showToast("Ei nettiä. Tallennettu laitteen muistiin! 💾");
    updateSyncButton();
    if(typeof renderHistoryList === 'function') renderHistoryList();
}

window.syncOfflineDrives = function() {
    if (pendingDrives.length === 0) return;
    if (!navigator.onLine) {
        if(typeof showToast === 'function') showToast("Ei nettiyhteyttä. Yritä myöhemmin. 🚫");
        return;
    }

    const btn = document.getElementById('btn-sync-drives');
    if(btn) { 
        btn.disabled = true; 
        btn.innerText = "Lähetetään..."; 
    }

    const promises = pendingDrives.map(drive => {
        const driveToSend = { ...drive };
        delete driveToSend.tempId;
        delete driveToSend.isPending;
        return db.ref('ajopaivakirja/' + currentUser.uid).push().set(driveToSend);
    });

    Promise.all(promises)
        .then(() => {
            if(typeof showToast === 'function') showToast(`${pendingDrives.length} ajoa synkronoitu! ✅`);
            pendingDrives = []; 
            localStorage.removeItem('pendingDrives');
            updateSyncButton();
            if(typeof renderHistoryList === 'function') renderHistoryList();
        })
        .catch(err => {
            if(typeof showToast === 'function') showToast("Virhe synkronoinnissa.");
            console.error(err);
        })
        .finally(() => {
            if(btn) { btn.disabled = false; }
        });
};

function updateSyncButton() {
    let container = document.getElementById('sync-container');
    if (!container) {
        const list = document.getElementById('log-list');
        if (list && list.parentNode) {
            container = document.createElement('div');
            container.id = 'sync-container';
            container.style.padding = "10px";
            container.style.textAlign = "center";
            list.parentNode.insertBefore(container, list);
        } else { return; }
    }

    if (pendingDrives.length > 0) {
        container.innerHTML = `
            <button id="btn-sync-drives" class="action-btn yellow-btn" onclick="window.syncOfflineDrives()" style="margin-bottom:15px; border: 2px solid #fff;">
                📡 Lähetä ${pendingDrives.length} odottavaa ajoa pilveen
            </button>
        `;
        container.style.display = 'block';
    } else {
        container.style.display = 'none';
        container.innerHTML = "";
    }
}
initOfflineManager();

// =========================================================
// 2. DATAN LATAUS JA UI-PÄIVITYS
// =========================================================

// Varmistetaan globaalit funktiot
window.renderHistoryList = renderHistoryList;
window.renderFuelList = renderFuelList;
window.renderStats = renderStats;
window.renderDriveStats = renderDriveStats;
window.renderFuelStats = renderFuelStats;
window.populatePreviewTable = populatePreviewTable;
window.updateReportPreview = updateReportPreview;
window.generateReport = generateReport;

function loadHistory() {
    if (!currentUser) return;

    db.ref('ajopaivakirja/' + currentUser.uid).off();
    
    // Haetaan data (Viimeiset 1000)
    const historyRef = db.ref('ajopaivakirja/' + currentUser.uid).orderByChild('startTime').limitToLast(1000); 

    historyRef.on('value', (snapshot) => {
        let cloudHistory = [];
        allRefuelings = [];
        
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                const data = child.val();
                if (data.type === 'refuel') {
                    allRefuelings.push({ key: child.key, ...data });
                } else {
                    cloudHistory.push({ key: child.key, ...data, isPending: false });
                }
            });
        }
        
        // Yhdistetään Offline ja Cloud data
        allHistoryData = [...pendingDrives, ...cloudHistory];
        
        // Järjestetään (uusin ensin)
        allHistoryData.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        allRefuelings.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        if(typeof populateFilter === 'function') populateFilter();
        
        updateSyncButton();
        
        // Pakotetaan päivitys kaikkiin näkymiin
        renderHistoryList();
        renderFuelList();
        
        const statsView = document.getElementById('stats-view');
        if (statsView && statsView.style.display !== 'none') {
            renderStats();
        }
        
        // Raportin esikatselu
        if (document.getElementById('report-modal') && document.getElementById('report-modal').style.display !== 'none') {
            updateReportPreview();
        }

    }, (error) => { console.error("Firebase virhe:", error); });
}

// SUODATTIMIEN KUUNTELIJAT (Nyt elementit on varmasti määritelty)
if(filterEl) {
    filterEl.addEventListener('change', () => {
        if (filterEl.value === 'custom') {
            if(customFilterContainer) customFilterContainer.style.display = 'block';
        } else {
            if(customFilterContainer) customFilterContainer.style.display = 'none';
            renderHistoryList(); renderFuelList();
        }
    });
}
if(filterStart) filterStart.addEventListener('change', () => { renderHistoryList(); renderFuelList(); });
if(filterEnd) filterEnd.addEventListener('change', () => { renderHistoryList(); renderFuelList(); });
if(statsTimeRange) statsTimeRange.addEventListener('change', () => { renderStats(); });

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
    if (currentVal && Array.from(filterEl.options).some(o => o.value === currentVal)) filterEl.value = currentVal;
}

// =========================================================
// 3. AJOHISTORIA (LISTA)
// =========================================================

function renderHistoryList() {
    const logList = document.getElementById('log-list');
    if(!logList) return;
    
    // Tyhjennetään ensin
    logList.innerHTML = ""; 
    updateSyncButton();
    
    // Tarkistus: Onko dataa?
    if (allHistoryData.length === 0) {
        logList.innerHTML = "<p style='text-align:center; margin-top:20px; color:#888;'>Ei tallennettuja ajoja.</p>";
        if(historySummaryEl) historySummaryEl.style.display = 'none';
        return;
    }

    const selectedFilter = filterEl ? filterEl.value : 'all';
    
    // Hae km-korvaus localStoragesta
    const savedRate = localStorage.getItem('pricePerKm');
    const kmRate = savedRate ? parseFloat(savedRate) : DEFAULT_KM_RATE;

    let renderCount = 0;
    let totalKm = 0;
    let totalMs = 0;
    const now = new Date().getTime();
    const recentLimit = 48 * 60 * 60 * 1000; 

    // LOOP: Käydään ajot läpi
    allHistoryData.forEach((drive) => {
        try {
            // --- SUODATUS ---
            if (currentCarId === 'all') {
                const carObj = userCars.find(c => c.id === drive.carId);
                if (carObj && carObj.isArchived) return; 
            } else if (currentCarId === 'all_archived') {
            } else {
                if (drive.carId && drive.carId !== currentCarId) return;
                if (!drive.carId && currentCarId !== 'all') return; 
            }

            let start = new Date(drive.startTime);
            if (isNaN(start.getTime())) return; 

            // Aikasuojaus
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

            // Laskennat
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

            // UI Elementtien valmistelu
            let mapBtn = "";
            if (drive.route && drive.route.length > 0) {
                mapBtn = `<button class="map-btn" onclick="window.showRouteOnMap('${drive.key}')" title="Näytä reitti">🗺️</button>`;
            }
            
            let continueBtn = "";
            const endTime = drive.endTime ? new Date(drive.endTime).getTime() : start.getTime();
            if (!drive.isPending && (now - endTime) < recentLimit) {
                continueBtn = `<button class="map-btn" style="color:#00e676;" onclick="window.prepareContinueDrive('${drive.key}')" title="Jatka tätä ajoa">⏯️</button>`;
            }
            
            let carObj = userCars.find(c => c.id === drive.carId);
            let defaultIcon = "🚗";
            if(drive.carType === 'bike') defaultIcon = "🚲";
            if(drive.carType === 'motorcycle') defaultIcon = "🏍️";
            if(drive.carType === 'walking') defaultIcon = "🚶";
            
            let icon = carObj ? (carObj.icon || defaultIcon) : (drive.carIcon || defaultIcon);
            let carName = carObj ? carObj.name : (drive.carName || "Muu");
            
            let dateStr = start.toLocaleDateString('fi-FI');
            let startH = start.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
            let endH = drive.endTime ? " - " + new Date(drive.endTime).toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'}) : "";

            const typeIcon = (drive.driveType === 'work') ? "💼" : "🏠";
            const typeLabel = (drive.driveType === 'work') ? "Työajo" : "Oma ajo";
            const typeColor = (drive.driveType === 'work') ? "#00695c" : "#424242";

            // EURO-LASKENTA UI
            let euroInfo = "";
            if (drive.driveType === 'work') {
                const allowance = dist * kmRate;
                euroInfo = `<span style="color:#ffd600; font-size:11px; margin-left:5px;">(~${allowance.toFixed(2)}€)</span>`;
            }

            // OSOITENÄYTTÖ (Pääajo)
            let addressLine = "";
            if (drive.startAddress || drive.endAddress) {
                const s = drive.startAddress || "?";
                const e = drive.endAddress || "?";
                addressLine = `<div style="font-size:11px; color:#aaa; margin-top:5px; border-top:1px solid rgba(255,255,255,0.05); padding-top:4px;">📍 ${s} ➝ ${e}</div>`;
            }

            // --- SEGMENTTIEN RENDERÖINTI (SUB-TRIPS) + OSOITTEET ---
            let segmentsHtml = "";
            if (drive.sessions && Array.isArray(drive.sessions) && drive.sessions.length > 1) {
                segmentsHtml = `<div class="log-segments" style="margin-top:8px; padding-top:4px; border-top:1px solid rgba(255,255,255,0.05);">`;
                
                drive.sessions.forEach((sess, idx) => {
                    const sTime = new Date(sess.startTime).toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
                    const eTime = new Date(sess.endTime).toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
                    const dist = parseFloat(sess.dist).toFixed(1);
                    const dur = Math.floor(sess.durationMs / 60000);
                    
                    // Osoitteet per segmentti
                    const sAddr = sess.startAddr || "?";
                    const eAddr = sess.endAddr || "?";
                    let addrStr = "";
                    if(sess.startAddr || sess.endAddr) {
                        addrStr = `<div style="font-size:10px; opacity:0.6; margin-left:15px;">📍 ${sAddr} ➝ ${eAddr}</div>`;
                    }
                    
                    segmentsHtml += `
                        <div style="margin-bottom:6px;">
                            <div style="display:flex; justify-content:space-between; font-size:11px; color:var(--subtext-color);">
                                <span style="font-weight:bold; color:#ddd;">#${idx+1} ${sTime}-${eTime}</span>
                                <span>${dist} km (${dur} min)</span>
                            </div>
                            ${addrStr}
                        </div>
                    `;
                });
                segmentsHtml += `</div>`;
            }
            // -------------------------------------------

            let cardStyle = "";
            let syncBadge = "";
            if (drive.isPending) {
                cardStyle = "border: 1px dashed #ffd600;";
                syncBadge = `<span style="color:#ffd600; font-weight:bold; font-size:12px; margin-left:5px;">⚠️ Offline</span>`;
            }

            const card = document.createElement('div');
            card.className = 'log-card';
            card.style.cssText = cardStyle;
            
            // LAZY LOAD ANIMAATIO
            if(renderCount < 20) {
                card.style.animationDelay = `${Math.min(renderCount * 0.05, 1.0)}s`;
            } else {
                card.style.opacity = 1; 
                card.style.animation = 'none';
            }
            
            card.onclick = (e) => {
                if (e.target.closest('button') || e.target.closest('input')) return;
                const list = document.getElementById('log-list');
                if (list && list.classList.contains('compact')) card.classList.toggle('expanded');
            };

            card.innerHTML = `
                <div class="log-header">
                    <div class="log-title-group">
                        <div class="log-date-line">${dateStr} (${startH}${endH})</div>
                        <div class="log-car-big">${icon} ${carName} ${syncBadge}</div>
                    </div>
                    <div style="display:flex; align-items:center;">
                        ${!drive.isPending ? `${continueBtn} ${mapBtn} <button class="edit-btn" onclick="window.openEditLogModal('${drive.key}')">✏️</button> <button class="delete-btn" onclick="window.openDeleteLogModal('${drive.key}')">🗑</button>` : `<button class="delete-btn" onclick="window.deleteOfflineDrive('${drive.tempId}')">🗑</button>`}
                    </div>
                </div>
                <div class="log-tags">
                    <span class="tag" style="background-color: ${typeColor}; color:#fff;">${typeIcon} ${typeLabel} ${euroInfo}</span>
                    ${drive.weather ? `<span class="tag">🌡️ ${drive.weather}</span>` : ''}
                    ${drive.drivingStyle ? `<span class="tag">🏎️ ${drive.drivingStyle}</span>` : ''}
                </div>
                <div class="log-stats">
                    <div><span class="stat-label">KM</span>${drive.distanceKm || "0.00"}</div>
                    <div><span class="stat-label">AIKA</span>${durationMinutes} min</div>
                    <div><span class="stat-label">MAX</span>${drive.maxSpeed || "0"}</div>
                    <div><span class="stat-label">Ø KM/H</span>${drive.avgSpeed || "-"}</div>
                </div>
                ${!drive.isPending ? `<input type="text" class="subject-input" placeholder="Kirjoita aihe..." value="${drive.subject || ""}" onchange="window.updateLogSubject('${drive.key}', this.value)">` : `<div style="font-style:italic; color:#888; font-size:12px; padding:5px;">${drive.subject || "Ei aihetta"} (Muokkaa synkronoinnin jälkeen)</div>`}
                ${segmentsHtml}
                ${addressLine}
            `;
            logList.appendChild(card);
            renderCount++;
        } catch (err) { 
            console.error("Virhe renderöinnissä:", err, drive); 
        }
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

// VALMISTELE AJON JATKAMINEN
window.prepareContinueDrive = function(key) {
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive) { alert("Ajoa ei löydy!"); return; }
    const driveCarId = drive.carId;
    if (currentCarId === 'all' || (currentCarId !== 'all_archived' && currentCarId !== driveCarId)) {
        const targetCar = userCars.find(c => c.id === driveCarId);
        const carName = targetCar ? targetCar.name : "Tuntematon auto";
        if (confirm(`Tämä ajo on ajettu ajoneuvolla: ${carName}.\nHaluatko vaihtaa ajoneuvon ja jatkaa ajoa?`)) {
            const select = document.getElementById('car-select');
            if (select) {
                select.value = driveCarId;
                const event = new Event('change');
                select.dispatchEvent(event);
            }
        } else { return; }
    }
    if (typeof window.continueDrive === 'function') {
        window.continueDrive(drive);
    } else { alert("GPS-moduuli ei ole valmis."); }
};

// =========================================================
// 4. TANKKAUKSET (LISTA)
// =========================================================

function renderFuelList() {
    const fuelList = document.getElementById('fuel-list');
    if(!fuelList) return;
    fuelList.innerHTML = "";
    
    let totalRefuelEur = 0; let totalRefuelLit = 0; let sumGas = 0; let sumDiesel = 0; let renderCount = 0;

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
        if (fuelType.includes('diesel')) { sumDiesel += lit; } else { sumGas += lit; }

        const date = new Date(ref.date);
        const dateStr = date.toLocaleDateString('fi-FI') + " " + date.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
        let carName = carObj ? carObj.name : "Tuntematon";
        let icon = "⛽";

        let consumptionInfo = "";
        let consumptionVal = null;
        const currentRefDate = new Date(ref.date);
        const prevRef = allRefuelings.find(r => r.carId === ref.carId && new Date(r.date) < currentRefDate && r.odo);
        if (prevRef && ref.odo && prevRef.odo) {
            const dist = parseFloat(ref.odo) - parseFloat(prevRef.odo);
            const l = parseFloat(ref.liters);
            if (dist > 0 && l > 0) {
                consumptionVal = (l / dist) * 100;
                if (consumptionVal < 100) consumptionInfo = `<span style="color:#00e676; font-weight:bold; margin-left:8px;">Ø ${consumptionVal.toFixed(1)} l/100km</span>`;
            }
        }

        const card = document.createElement('div');
        card.className = 'log-card';
        if(renderCount < 20) card.style.animationDelay = `${Math.min(index * 0.05, 1.0)}s`;
        card.innerHTML = `
            <div class="log-header">
                <div class="log-title-group">
                    <div class="log-date-line">${dateStr}</div>
                    <div class="log-car-big">${icon} ${carName}</div>
                </div>
                <div><button class="edit-btn" onclick="window.editRefueling('${ref.key}')">✏️</button> <button class="delete-btn" onclick="window.openDeleteLogModal('${ref.key}')">🗑</button></div>
            </div>
            <div class="log-stats" style="grid-template-columns: repeat(3, 1fr);">
                <div><span class="stat-label">LITRAT</span>${lit.toFixed(2)} L <span style="font-size:11px; opacity:0.7; display:block;">${displayFuel}</span></div>
                <div><span class="stat-label">HINTA</span>${eur.toFixed(2)} €</div>
                <div><span class="stat-label">€ / L</span>${ref.pricePerLiter}</div>
            </div>
            <div style="font-size:12px; color:#888; text-align:center; margin-top:5px; border-top:1px solid rgba(255,255,255,0.05); padding-top:5px;">
                Mittarilukema: ${ref.odo || "-"} km ${consumptionInfo}
            </div>
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

// =========================================================
// 5. TILASTOT (CHART.JS)
// =========================================================

function renderStats() {
    if (typeof Chart === 'undefined') { console.warn("Chart.js puuttuu."); return; }
    const statsFuelContainer = document.getElementById('stats-fuel-container');
    if(statsFuelContainer && statsFuelContainer.style.display !== 'none') {
        renderFuelStats();
    } else {
        renderDriveStats();
    }
}

function renderDriveStats() {
    if (!allHistoryData || allHistoryData.length === 0) return;
    const rangeEl = document.getElementById('stats-time-range');
    const range = rangeEl ? rangeEl.value : '30d'; 
    const savedRate = localStorage.getItem('pricePerKm');
    const kmRate = savedRate ? parseFloat(savedRate) : DEFAULT_KM_RATE;

    const timeData = {}; 
    const vehicleData = {}; 
    const styleData = { "Taloudellinen": 0, "Tasainen": 0, "Reipas": 0, "Aggressiivinen": 0 };
    const carTimeData = {}; 
    const speedData = {}; 
    
    let totalEstimatedEuros = 0;

    const now = new Date();
    let startDate = new Date(1970, 0, 1); 
    if (range === '7d') { startDate = new Date(); startDate.setDate(now.getDate() - 7); } 
    else if (range === '30d') { startDate = new Date(); startDate.setDate(now.getDate() - 30); } 
    else if (range === 'year') { startDate = new Date(now.getFullYear(), 0, 1); }

    const sortedDrives = [...allHistoryData]
        .filter(d => {
            if (currentCarId === 'all') { const c = userCars.find(x => x.id === d.carId); if (c && c.isArchived) return false; }
            else if (currentCarId !== 'all_archived') { if (d.carId !== currentCarId) return false; }
            return new Date(d.startTime) >= startDate;
        })
        .sort((a,b) => new Date(a.startTime) - new Date(b.startTime));

    sortedDrives.forEach(d => {
        const dist = parseFloat(d.distanceKm) || 0;
        const avgSpd = parseFloat(d.avgSpeed) || 0;
        const date = new Date(d.startTime);
        
        if (d.driveType === 'work') totalEstimatedEuros += (dist * kmRate);

        let key = (range === '7d' || range === '30d') ? `${date.getDate()}.${date.getMonth()+1}.` : `${date.getMonth()+1}/${date.getFullYear()}`;
        if (!timeData[key]) timeData[key] = 0;
        timeData[key] += dist;

        let carName = (userCars.find(c => c.id === d.carId) || {}).name || d.carName || "Muu";
        if (!vehicleData[carName]) vehicleData[carName] = 0;
        vehicleData[carName] += dist;

        if (!carTimeData[carName]) carTimeData[carName] = {};
        if (!carTimeData[carName][key]) carTimeData[carName][key] = 0;
        carTimeData[carName][key] += dist;

        if(avgSpd > 0) {
            if(!speedData[key]) speedData[key] = {sum:0, count:0};
            speedData[key].sum += avgSpd; speedData[key].count++;
        }
        if(d.drivingStyle) { if(!styleData[d.drivingStyle]) styleData[d.drivingStyle] = 0; styleData[d.drivingStyle]++; }
    });

    const moneyHeader = document.getElementById('label-drive-trend'); 
    if(moneyHeader) moneyHeader.innerHTML = `📈 Kilometrikehitys <span style="font-size:12px; color:#00e676; display:block; margin-top:5px;">(Arvioidut korvaukset: ${totalEstimatedEuros.toFixed(2)} €)</span>`;

    const labels = Object.keys(timeData); 
    const values = Object.values(timeData).map(v => v.toFixed(1));

    // GRAAFIT ---------------------------------
    
    // 1. Monthly Bar
    const canvasMonthly = document.getElementById('chart-drive-monthly');
    if (canvasMonthly) {
        if (chartInstances['driveMonthly']) chartInstances['driveMonthly'].destroy();
        chartInstances['driveMonthly'] = new Chart(canvasMonthly.getContext('2d'), {
            type: 'bar', 
            data: { 
                labels: labels, 
                datasets: [{ 
                    label: 'Kilometrit', 
                    data: values, 
                    backgroundColor: 'rgba(41, 121, 255, 0.6)', 
                    borderColor: 'rgba(41, 121, 255, 1)', 
                    borderWidth: 1 
                }] 
            },
            options: { 
                responsive: true, 
                scales: { 
                    y: { beginAtZero: true } 
                }, 
                plugins: { 
                    legend: { display: false } 
                } 
            }
        });
    }

    // 2. Trend Line
    const canvasTrend = document.getElementById('chart-drive-trend');
    if (canvasTrend) {
        if (chartInstances['driveTrend']) chartInstances['driveTrend'].destroy();
        const trendDatasets = [];
        const colors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'];
        let colorIdx = 0;
        for (const [carName, timesObj] of Object.entries(carTimeData)) {
            trendDatasets.push({ 
                label: carName, 
                data: labels.map(lbl => (timesObj[lbl] || 0)), 
                borderColor: colors[colorIdx % colors.length], 
                tension: 0.3, 
                fill: false 
            });
            colorIdx++;
        }
        chartInstances['driveTrend'] = new Chart(canvasTrend.getContext('2d'), { 
            type: 'line', 
            data: { 
                labels: labels, 
                datasets: trendDatasets 
            }, 
            options: { 
                responsive: true, 
                scales: { 
                    y: { beginAtZero: true } 
                } 
            } 
        });
    }

    // 3. Speed
    const canvasSpeed = document.getElementById('chart-drive-speed');
    if (canvasSpeed) {
        if (chartInstances['driveSpeed']) chartInstances['driveSpeed'].destroy();
        chartInstances['driveSpeed'] = new Chart(canvasSpeed.getContext('2d'), {
            type: 'line', 
            data: { 
                labels: labels, 
                datasets: [{ 
                    label: 'Ø Nopeus', 
                    data: labels.map(k => (speedData[k] && speedData[k].count > 0 ? (speedData[k].sum / speedData[k].count).toFixed(1) : 0)), 
                    borderColor: '#00e676', 
                    backgroundColor: 'rgba(0, 230, 118, 0.1)', 
                    fill: true, 
                    tension: 0.4 
                }] 
            },
            options: { 
                responsive: true, 
                scales: { 
                    y: { beginAtZero: true } 
                } 
            }
        });
    }

    // 4. Vehicles
    const canvasVehicles = document.getElementById('chart-drive-vehicles');
    if (canvasVehicles) {
        if (chartInstances['driveVehicles']) chartInstances['driveVehicles'].destroy();
        chartInstances['driveVehicles'] = new Chart(canvasVehicles.getContext('2d'), { 
            type: 'doughnut', 
            data: { 
                labels: Object.keys(vehicleData), 
                datasets: [{ 
                    data: Object.values(vehicleData).map(v => v.toFixed(1)), 
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'], 
                    borderWidth: 1 
                }] 
            } 
        });
    }

    // 5. Style
    const canvasStyle = document.getElementById('chart-drive-style');
    if (canvasStyle) {
        if (chartInstances['driveStyle']) chartInstances['driveStyle'].destroy();
        const filteredStyle = Object.entries(styleData).filter(([k,v]) => v > 0);
        chartInstances['driveStyle'] = new Chart(canvasStyle.getContext('2d'), { 
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
             if (currentCarId === 'all') { const c = userCars.find(x => x.id === r.carId); if (c && c.isArchived) return false; }
             else if (currentCarId !== 'all_archived') { if (r.carId !== currentCarId) return false; }
            return new Date(r.date) >= startDate;
        })
        .sort((a,b) => new Date(a.date) - new Date(b.date));

    sortedRefs.forEach(ref => {
        const eur = parseFloat(ref.euros) || 0; const lit = parseFloat(ref.liters) || 0; const price = parseFloat(ref.pricePerLiter) || 0;
        const date = new Date(ref.date); const dateStr = date.toLocaleDateString('fi-FI');
        totalRefuelEur += eur;
        
        const car = userCars.find(c => c.id === ref.carId);
        const fuelType = (car ? car.fuel : "Muu").toLowerCase();
        
        if(fuelType.includes('bensiini') || fuelType.includes('gas')) {
             sumGas += lit; fuelTypeData['Bensiini'] = (fuelTypeData['Bensiini'] || 0) + lit;
             if(price > 0) trendGas.push({ x: dateStr, y: price });
        } else if(fuelType.includes('diesel')) {
             sumDiesel += lit; fuelTypeData['Diesel'] = (fuelTypeData['Diesel'] || 0) + lit;
             if(price > 0) trendDiesel.push({ x: dateStr, y: price });
        } else { fuelTypeData['Muu'] = (fuelTypeData['Muu'] || 0) + lit; }

        let key = (range === '7d' || range === '30d') ? `${date.getDate()}.${date.getMonth()+1}.` : `${date.getMonth()+1}/${date.getFullYear()}`;
        if(!timeCosts[key]) timeCosts[key] = 0; timeCosts[key] += eur;
        const carName = car ? car.name : "Tuntematon";
        if(!carCosts[carName]) carCosts[carName] = 0; carCosts[carName] += eur;
    });

    document.getElementById('stat-fuel-eur').innerText = totalRefuelEur.toFixed(2) + " €";
    document.getElementById('stat-fuel-gas').innerText = sumGas.toFixed(1) + " L";
    document.getElementById('stat-fuel-diesel').innerText = sumDiesel.toFixed(1) + " L";

    // FUEL GRAAFIT
    const canvasFuelType = document.getElementById('chart-fuel-type');
    if (canvasFuelType) {
        if (chartInstances['fuelType']) chartInstances['fuelType'].destroy();
        chartInstances['fuelType'] = new Chart(canvasFuelType.getContext('2d'), { 
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
    const canvasMonthly = document.getElementById('chart-fuel-monthly');
    if (canvasMonthly) {
        if (chartInstances['fuelMonthly']) chartInstances['fuelMonthly'].destroy();
        chartInstances['fuelMonthly'] = new Chart(canvasMonthly.getContext('2d'), { 
            type: 'bar', 
            data: { 
                labels: Object.keys(timeCosts), 
                datasets: [{ 
                    label: 'Euroa (€)', 
                    data: Object.values(timeCosts), 
                    backgroundColor: '#fbc02d', 
                    borderColor: '#fbc02d', 
                    borderWidth: 1 
                }] 
            }, 
            options: { 
                responsive: true, 
                scales: { 
                    y: { beginAtZero: true } 
                }, 
                plugins: { 
                    legend: { display: false } 
                } 
            } 
        });
    }
    const canvasTrend = document.getElementById('chart-fuel-trend');
    if (canvasTrend) {
        if (chartInstances['fuelTrend']) chartInstances['fuelTrend'].destroy();
        const allDates = [...new Set([...trendGas.map(d=>d.x), ...trendDiesel.map(d=>d.x)])];
        chartInstances['fuelTrend'] = new Chart(canvasTrend.getContext('2d'), { 
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
            options: { 
                responsive: true 
            } 
        });
    }
    const canvasCar = document.getElementById('chart-fuel-car');
    if (canvasCar) {
        if (chartInstances['fuelCar']) chartInstances['fuelCar'].destroy();
        chartInstances['fuelCar'] = new Chart(canvasCar.getContext('2d'), { 
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


// =========================================================
// 6. RAPORTOINTI (UUSI v6.10 PRO ENGINE)
// =========================================================

function getFilteredDataForReport() {
    const period = document.getElementById('report-period').value;
    const carFilter = document.getElementById('report-car').value;
    const typeFilter = document.querySelector('input[name="report-type"]:checked').value;

    const now = new Date();
    let startDate = new Date(0);
    let endDate = new Date(9999, 11, 31);

    if (period === 'this_month') {
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
        endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);
    } else if (period === 'last_month') {
        startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        endDate = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59);
    } else if (period === 'this_year') {
        startDate = new Date(now.getFullYear(), 0, 1);
        endDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59);
    }

    return allHistoryData.filter(d => {
        const dTime = new Date(d.startTime);
        if (dTime < startDate || dTime > endDate) return false;
        if (carFilter !== 'all' && d.carId !== carFilter) return false;
        if (typeFilter !== 'all') {
            const dType = d.driveType || 'private';
            if (typeFilter === 'work' && dType !== 'work') return false;
            if (typeFilter === 'private' && dType !== 'private') return false;
        }
        return true;
    });
}

function updateReportPreview() {
    const statsEl = document.getElementById('report-preview-stats');
    if (!statsEl) return;

    // Täytä autovalikko dynaamisesti, jos tyhjä (varmistus)
    const carSel = document.getElementById('report-car');
    if (carSel && carSel.options.length <= 1 && userCars.length > 0) {
        userCars.forEach(c => {
            if(!c.isArchived) {
                const opt = document.createElement('option');
                opt.value = c.id;
                opt.text = c.name;
                carSel.appendChild(opt);
            }
        });
    }

    const data = getFilteredDataForReport();
    
    let totalKm = 0;
    let workKm = 0;
    
    data.forEach(d => {
        const dist = parseFloat(d.distanceKm) || 0;
        totalKm += dist;
        if (d.driveType === 'work') workKm += dist;
    });

    const savedRate = localStorage.getItem('pricePerKm');
    const kmRate = savedRate ? parseFloat(savedRate) : DEFAULT_KM_RATE;
    const money = workKm * kmRate;

    statsEl.innerHTML = `
        <strong>Yhteenveto valinnasta:</strong><br>
        Ajoja: ${data.length} kpl<br>
        Matka yht: ${totalKm.toFixed(1)} km<br>
        Työajoa: ${workKm.toFixed(1)} km<br>
        <span style="color:#00e676;">Korvausarvio: ${money.toFixed(2)} €</span>
    `;
}

function generateReport() {
    const data = getFilteredDataForReport();
    
    if (data.length === 0) {
        if(typeof showToast === 'function') showToast("Ei dataa valitulla aikavälillä.");
        return;
    }

    const savedRate = localStorage.getItem('pricePerKm');
    const kmRate = savedRate ? parseFloat(savedRate) : DEFAULT_KM_RATE;

    let csvContent = "data:text/csv;charset=utf-8,";
    // Header
    csvContent += "Pvm;Kello;Auto;Rekisteri;Matka (km);Korvaus (€);Tyyppi;Lähtö;Määränpää;Aihe\n";

    data.forEach(d => {
        const date = new Date(d.startTime).toLocaleDateString('fi-FI');
        const time = new Date(d.startTime).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
        
        let plate = "-";
        const car = userCars.find(c => c.id === d.carId);
        if(car) plate = car.plate || "-";
        
        const km = (parseFloat(d.distanceKm) || 0);
        let euros = 0;
        if(d.driveType === 'work') euros = km * kmRate;
        
        const typeStr = (d.driveType === 'work') ? "Työajo" : "Oma ajo";
        
        // Siivotaan pilkut CSV:tä varten
        const safeStart = (d.startAddress || "").replace(/;/g, ",");
        const safeEnd = (d.endAddress || "").replace(/;/g, ",");
        const safeSubj = (d.subject || "").replace(/;/g, ",");

        const row = [
            date, time, d.carName, plate, 
            km.toFixed(2).replace('.',','), 
            euros.toFixed(2).replace('.',','), 
            typeStr, safeStart, safeEnd, safeSubj
        ].join(";");
        
        csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    const now = new Date().toISOString().slice(0,10);
    link.setAttribute("download", `ajopaivakirja_export_${now}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// VANHAT APUFUNKTIOT (LEGACY)
// Legacy export, jos joku kutsuu sitä suoraan koodista
window.exportToCSV = generateReport;

function populatePreviewTable() {
    const tbody = document.getElementById('preview-tbody');
    const countEl = document.getElementById('preview-count');
    const totalEl = document.getElementById('preview-total');
    
    if (!tbody) return;
    tbody.innerHTML = "";
    
    let count = 0;
    let sumKm = 0;
    const selectedFilter = filterEl ? filterEl.value : 'all';

    allHistoryData.forEach(drive => {
        // Suodatus
        if (currentCarId !== 'all' && currentCarId !== 'all_archived' && drive.carId !== currentCarId) return;

        let start = new Date(drive.startTime);
        if (selectedFilter !== 'all') { /* Suodatuslogiikka tässä */ }

        count++;
        const dist = parseFloat(drive.distanceKm) || 0;
        sumKm += dist;

        const dateStr = start.toLocaleDateString('fi-FI');
        const typeIcon = (drive.driveType === 'work') ? "💼" : "🏠";
        
        const row = document.createElement('tr');
        row.style.borderBottom = "1px solid rgba(255,255,255,0.1)";
        row.innerHTML = `<td style="padding:8px;">${dateStr}</td><td style="padding:8px;">${drive.carName}</td><td style="padding:8px;">${typeIcon}</td><td style="padding:8px;">${dist.toFixed(1)}</td><td style="padding:8px; font-style:italic; opacity:0.8;">${drive.subject || "-"}</td>`;
        tbody.appendChild(row);
    });

    if(countEl) countEl.innerText = `${count} ajoa`;
    if(totalEl) totalEl.innerText = `${sumKm.toFixed(1)} km`;
}

window.openEditLogModal = (key) => {
    const drive = allHistoryData.find(d => d.key === key);
    if (!drive) return;
    const keyEl = document.getElementById('edit-key'); if(keyEl) keyEl.value = key;
    const dateEl = document.getElementById('edit-datetime');
    if(dateEl && drive.startTime) {
        const d = new Date(drive.startTime); const tzOffset = d.getTimezoneOffset() * 60000; 
        dateEl.value = (new Date(d - tzOffset)).toISOString().slice(0, 16);
    }
    const distEl = document.getElementById('edit-distance'); if(distEl) distEl.value = drive.distanceKm || "";
    const subjEl = document.getElementById('edit-subject'); if(subjEl) subjEl.value = drive.subject || "";
    const typeEls = document.getElementsByName('edit-type'); const targetType = drive.driveType || 'private';
    for(let r of typeEls) { if(r.value === targetType) r.checked = true; }
    
    const carSel = document.getElementById('edit-car-select');
    if(carSel) {
        carSel.innerHTML = "";
        userCars.forEach(car => {
            const opt = document.createElement('option'); opt.value = car.id;
            let defIcon = "🚗"; if(car.type === 'bike') defaultIcon = "🚲"; if(car.type === 'walking') defIcon = "🚶"; if(car.type === 'motorcycle') defIcon = "🏍️";
            const icon = car.icon || defIcon; const archivedLabel = car.isArchived ? " (Arkistoitu)" : "";
            opt.text = `${icon} ${car.name}${archivedLabel}`;
            if(drive.carId === car.id) opt.selected = true;
            carSel.appendChild(opt);
        });
    }
    const modal = document.getElementById('edit-modal'); if(modal) modal.style.display = 'flex';
};

window.openDeleteLogModal = (key) => {
    deleteKey = key;
    if(document.getElementById('delete-modal')) document.getElementById('delete-modal').style.display = 'flex';
};

window.deleteOfflineDrive = function(tempId) {
    if(confirm("Poistetaanko tämä tallentamaton ajo puhelimen muistista?")) {
        pendingDrives = pendingDrives.filter(d => d.tempId !== tempId);
        localStorage.setItem('pendingDrives', JSON.stringify(pendingDrives));
        if(typeof renderHistoryList === 'function') renderHistoryList();
        updateSyncButton();
    }
};

window.updateLogSubject = (key, text) => { 
    if(currentUser) db.ref('ajopaivakirja/' + currentUser.uid + '/' + key).update({ subject: text }); 
};

// Varmistusnapit
const btnEditCancel2 = document.getElementById('btn-edit-cancel');
if(btnEditCancel2) btnEditCancel2.addEventListener('click', () => { if(document.getElementById('edit-modal')) document.getElementById('edit-modal').style.display = 'none'; });

const btnDeleteCancel2 = document.getElementById('btn-delete-cancel');
if(btnDeleteCancel2) btnDeleteCancel2.addEventListener('click', () => { if(document.getElementById('delete-modal')) document.getElementById('delete-modal').style.display = 'none'; deleteKey = null; });

const btnDeleteConfirm2 = document.getElementById('btn-delete-confirm');
if(btnDeleteConfirm2) btnDeleteConfirm2.addEventListener('click', () => { 
    if (deleteKey && currentUser) { 
        db.ref('ajopaivakirja/' + currentUser.uid + '/' + deleteKey).remove(); 
        if(document.getElementById('delete-modal')) document.getElementById('delete-modal').style.display = 'none'; 
        deleteKey = null; 
    } 
});

// WINDOW.EXPORTTOCSV Määritys lopuksi varmistamaan yhteensopivuus
window.exportToCSV = generateReport;

// Init
window.addEventListener('load', initOfflineManager);
