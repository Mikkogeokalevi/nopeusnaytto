// =========================================================
// GPS.JS - PAIKANNUS, MATKA JA TALLENNUS (v6.12 SEGMENTS + ADDRESSES)
// =========================================================

// --- 0. SILENT AUDIO HACK (BACKGROUND MODE) ---
// Tämä pitää selaimen prosessin hengissä vaikka näyttö sammuisi.
const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzb21tcDQyAFRTU0UAAAAPAAADTGF2ZjU3LjU2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh//OEAAAAAAAAAAAAAAAAAAAAAAAAMExhdmM1Ny42NAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAFccAAABAAAAAAAAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA");
silentAudio.loop = true;
silentAudio.volume = 0.01; // Hyvin hiljainen varmuuden vuoksi

// CRASH RECOVERY KEY
const RECOVERY_KEY = 'ajopro_crash_recovery_v1';

// OSOITEMUISTI (v6.10)
var startAddressSnapshot = ""; 

// OSIO-SEURANTA (v6.12 SUB-TRIPS)
var sessionStartTime = null;      // Tämän nimenomaisen pätkän aloitusaika
var sessionStartDistance = 0;     // Mittarilukema tämän pätkän alussa
var sessionPauseTime = 0;         // Tauot vain tämän pätkän aikana
var sessionStartAddress = "";     // Tämän pätkän lähtöosoite
var existingSessions = [];        // Lista aiemmista osamatkoista (jos continue)

window.ensurePoiAudioContext = function() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        if (!window._poiAudioCtx) window._poiAudioCtx = new AudioCtx();
        if (window._poiAudioCtx && window._poiAudioCtx.state === 'suspended') {
            window._poiAudioCtx.resume().catch(() => {});
        }
        return window._poiAudioCtx;
    } catch (e) {
        return null;
    }
}

window.playPoiAlertBeep = function() {
    // 1 = päällä, 0 = pois
    const enabled = localStorage.getItem('poiBeepEnabled');
    if (enabled === '0') return;

    const ctx = window.ensurePoiAudioContext();
    if (!ctx) return;
    if (ctx.state !== 'running') return;

    try {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 880;
        gain.gain.value = 0.0001;
        osc.connect(gain);
        gain.connect(ctx.destination);

        const t0 = ctx.currentTime;
        gain.gain.setValueAtTime(0.0001, t0);
        gain.gain.exponentialRampToValueAtTime(0.12, t0 + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);

        osc.start(t0);
        osc.stop(t0 + 0.2);
    } catch (e) {
        // ignore
    }
}

// 1. KONTROLLIPAINIKKEET JA LOGIIKKA

// Aktivointinappi
const btnActivate = document.getElementById('btn-activate-gps');
if (btnActivate) {
    btnActivate.addEventListener('click', () => {
        if (!isGPSActive) {
            startGPS();
            
            // Käynnistetään taustaääni heti käyttäjän interaktiosta
            silentAudio.play().then(() => {
                console.log("Background audio started");
            }).catch(e => {
                console.warn("Background audio failed:", e);
            });

            btnActivate.style.display = 'none';
            
            if(document.getElementById('rec-controls')) {
                document.getElementById('rec-controls').style.display = 'flex';
            }
            if(activeRecBtns) activeRecBtns.style.display = 'none'; 
            
            // Varmistetaan että aloitusnapit näkyvät
            const startContainer = document.getElementById('start-buttons-container');
            if(startContainer) startContainer.style.display = 'flex';
            else if(btnStartRec) btnStartRec.style.display = 'inline-block';
            
            if(statusEl) statusEl.innerText = "GPS Päällä";
        }
    });
}

// NAPPI: JATKA VANHAA AJOA (VIE HISTORIAAN)
const btnGotoHistory = document.getElementById('btn-goto-history');
if (btnGotoHistory) {
    btnGotoHistory.addEventListener('click', () => {
        if(typeof switchView === 'function') {
            switchView('history');
            if(typeof showToast === 'function') showToast("Valitse jatkettava ajo listasta (⏯️) 📋");
        }
    });
}

// NAPPI: MERKKAA AJON AIKANA
const btnDriveMark = document.getElementById('btn-drive-mark');
if (btnDriveMark) {
    btnDriveMark.addEventListener('click', () => {
        if (!isRecording || isPaused) {
            if (typeof showToast === 'function') showToast('Merkkaus onnistuu vain tallennuksen aikana.');
            return;
        }
        if (!lastLatLng) {
            if (typeof showToast === 'function') showToast('Odotetaan GPS-sijaintia...');
            return;
        }

        const label = prompt('Merkinnän teksti (valinnainen)', '');
        if (label === null) return;
        const type = 'mark';

        const markerObj = {
            lat: lastLatLng.lat,
            lng: lastLatLng.lng,
            ts: Date.now(),
            type,
            label: (label || '').trim()
        };
        driveMarkers.push(markerObj);

        if (typeof showToast === 'function') {
            showToast('📌 Merkintä lisätty ajolle');
        }
    });
}

// ALOITA TALLENNUS (UUSI AJO)
if (btnStartRec) {
    btnStartRec.addEventListener('click', () => {
        // --- TARKISTUS: Estä aloitus jos autoa ei ole valittu ---
        if (currentCarId === 'all' || currentCarId === 'all_archived') {
            if(typeof showToast === 'function') {
                showToast("Valitse ajoneuvo ennen aloitusta! ⚠️");
            } else {
                alert("Valitse ajoneuvo ennen aloitusta!");
            }
            const carSelect = document.getElementById('car-select');
            if(carSelect) {
                carSelect.style.borderColor = 'red';
                setTimeout(() => carSelect.style.borderColor = '', 2000);
            }
            return;
        }
        // -------------------------------------------------------------

        startRecordingSession(); // Käynnistetään "puhtaalta pöydältä"
    });
}

// Apufunktio tallennuksen aloitukseen (käytetään myös continueDrivessa osittain)
function startRecordingSession(isContinue = false) {
    // Liikeanturien aktivointi
    activateMotionSensors();

    isRecording = true;
    isPaused = false;
    isViewingHistory = false;
    
    // Alustetaan nykyisen session muuttujat (SUB-TRIP)
    sessionStartTime = new Date();
    sessionPauseTime = 0;
    sessionStartAddress = currentAddress; // Otetaan talteen pätkän aloitusosoite
    
    // Varmistetaan että ääni soi
    if (silentAudio.paused) {
        silentAudio.play().catch(e => console.warn(e));
    }
    
    if(mapGpsToggle) {
        mapGpsToggle.innerText = "📡 ON";
        mapGpsToggle.classList.remove('inactive');
    }

    // Jos kyseessä on UUSI ajo (ei jatkettu), nollataan globaalit
    if (!isContinue) {
        startTime = new Date();
        totalPauseTime = 0;
        maxSpeed = 0;
        totalDistance = 0;
        routePath = [];
        driveMarkers = [];
        // OSOITEKORJAUS: Otetaan talteen tämän hetken osoite lähtöosoitteeksi (Pääajo)
        startAddressSnapshot = currentAddress;
        
        // Nollataan sessiotiedot
        existingSessions = [];
        sessionStartDistance = 0; 
        
        if(realTimePolyline) realTimePolyline.setLatLngs([]);
        if(typeof clearSavedRoute === 'function') clearSavedRoute();
        currentDriveWeather = "";
        aggressiveEvents = 0;
        currentDriveId = null; // Varmistetaan että ID on null (uusi ajo)
    } else {
        // Jos jatketaan, asetetaan session aloitusmatka nykyiseen kokonaismatkaan
        sessionStartDistance = totalDistance;
    }
    
    if(typeof updateDashboardUI === 'function') updateDashboardUI(0, maxSpeed, totalDistance, 0, 0, 0);
    
    // Päivitetty: Piilota statusbar myös kävelyssä
    if (currentCarType === 'bike' || currentCarType === 'walking') {
        if(liveStatusBar) liveStatusBar.style.opacity = '0';
    } else {
        if(liveStatusBar) liveStatusBar.style.opacity = '1'; 
        if(liveStyleEl) {
            liveStyleEl.innerText = "Taloudellinen";
            liveStyleEl.className = "style-badge style-green";
        }
    }
    
    // UI-tilojen päivitys
    const startContainer = document.getElementById('start-buttons-container');
    if (startContainer) startContainer.style.display = 'none';
    else if (btnStartRec) btnStartRec.style.display = 'none';

    if (activeRecBtns) activeRecBtns.style.display = 'flex';
    if (btnPause) btnPause.style.display = 'inline-block';
    if (btnResume) btnResume.style.display = 'none';
    
    if(statusEl) {
        statusEl.innerText = isContinue ? "🔴 JATKETAAN AJOA" : "🔴 TALLENNETAAN";
        statusEl.style.color = "#ff4444";
    }
    
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

// UUSI FUNKTIO: JATKA AJOA HISTORIASTA
window.continueDrive = function(driveData) {
    try {
        console.log("Jatketaan ajoa:", driveData);
        
        // 1. Asetetaan ID, jotta tallennus tietää päivittää vanhaa
        currentDriveId = driveData.key;

        // 2. Palautetaan muuttujat vanhasta datasta
        startTime = new Date(driveData.startTime);
        
        // 3. Palautetaan alkuperäinen lähtöosoite (ettei se muutu nykyiseksi)
        startAddressSnapshot = driveData.startAddress || currentAddress;
        
        // SUB-TRIPS: Ladataan olemassa olevat sessiot
        existingSessions = driveData.sessions || [];

        // LASKETAAN TAUKOAIKA
        const oldEndTime = new Date(driveData.endTime);
        const now = new Date();
        const prevActiveDuration = driveData.durationMs || 0;
        const totalTimeSinceStart = now - startTime;
        totalPauseTime = totalTimeSinceStart - prevActiveDuration;

        // Muut muuttujat
        maxSpeed = parseFloat(driveData.maxSpeed) || 0;
        totalDistance = parseFloat(driveData.distanceKm) || 0;
        aggressiveEvents = 0; 
        currentDriveWeather = driveData.weather || "";

        // Palautetaan reitti
        routePath = driveData.route || [];
        driveMarkers = driveData.markers || [];
        if(realTimePolyline) {
            realTimePolyline.setLatLngs([]);
            if(routePath.length > 0) {
                const latLngs = routePath.map(p => [p.lat, p.lng]);
                realTimePolyline.setLatLngs(latLngs);
            }
        }
        
        if(typeof clearSavedRoute === 'function') clearSavedRoute();

        // Varmistetaan että GPS on päällä
        if (!isGPSActive) {
            startGPS();
            if(btnActivate) btnActivate.style.display = 'none';
            if(document.getElementById('rec-controls')) document.getElementById('rec-controls').style.display = 'flex';
        }

        startRecordingSession(true);
        
        if(typeof switchView === 'function') switchView('dashboard');
        if(typeof showToast === 'function') showToast(`Jatketaan ajoa! Matka: ${totalDistance.toFixed(1)} km.`);

    } catch (e) {
        console.error("Virhe ajon jatkamisessa:", e);
        alert("Virhe ajon jatkamisessa: " + e.message);
    }
};

// TAUKO
if (btnPause) {
    btnPause.addEventListener('click', () => {
        isPaused = true;
        pauseStartTime = new Date();
        clearInterval(timerInterval);
        btnPause.style.display = 'none';
        btnResume.style.display = 'inline-block';
        if(statusEl) {
            statusEl.innerText = "⏸ TAUKO";
            statusEl.style.color = "#fbc02d";
        }
        saveCrashData(); // Tallenna tila myös tauolla
    });
}

// JATKA (Tauolta)
if (btnResume) {
    btnResume.addEventListener('click', () => {
        isPaused = false;
        const now = new Date();
        const pauseDuration = (now - pauseStartTime);
        
        // Lisätään tauko globaaliin ja nykyiseen sessioon
        totalPauseTime += pauseDuration;
        sessionPauseTime += pauseDuration;

        btnResume.style.display = 'none';
        btnPause.style.display = 'inline-block';
        if(statusEl) {
            statusEl.innerText = currentDriveId ? "🔴 JATKETAAN AJOA" : "🔴 TALLENNETAAN";
            statusEl.style.color = "#ff4444";
        }
        timerInterval = setInterval(updateTimer, 1000);
    });
}

// LOPETA
if (btnStopRec) {
    btnStopRec.addEventListener('click', () => {
        if (!isRecording) return;
        clearInterval(timerInterval);
        window.removeEventListener('devicemotion', handleMotion);
        
        // Jos lopetetaan tauolta, lisätään tauko laskuriin
        if (isPaused && pauseStartTime) {
            const pauseLen = (new Date() - pauseStartTime);
            totalPauseTime += pauseLen;
            sessionPauseTime += pauseLen;
        }

        const endTime = new Date();
        
        // KOKONAISLASKENTA
        const activeDurationMs = (endTime - startTime) - totalPauseTime;
        const durationHours = activeDurationMs / (1000 * 60 * 60);
        let avgSpeed = durationHours > 0 ? (totalDistance / durationHours) : 0;

        // OSIOLASKENTA (New Segment)
        const segmentDist = totalDistance - sessionStartDistance;
        const segmentDurationMs = (endTime - sessionStartTime) - sessionPauseTime;
        
        // Luodaan uusi osio-objekti
        // Varmistetaan, ettei luoda "tyhjää" osiota
        if (segmentDurationMs > 1000 || segmentDist > 0.01) {
            const newSession = {
                startTime: sessionStartTime.toISOString(),
                endTime: endTime.toISOString(),
                dist: segmentDist.toFixed(2),
                durationMs: segmentDurationMs,
                startAddr: sessionStartAddress || "",   // LISÄTTY: Pätkän aloitus
                endAddr: currentAddress || ""           // LISÄTTY: Pätkän lopetus
            };
            existingSessions.push(newSession);
        }

        let styleLabel = "";
        if (currentCarType !== 'bike' && currentCarType !== 'walking') {
            styleLabel = "Tasainen";
            if (aggressiveEvents > 5) styleLabel = "Reipas";
            if (aggressiveEvents > 15) styleLabel = "Aggressiivinen";
        }

        let selectedCarName = "Muu ajoneuvo";
        let selectedCarIcon = "🚗";
        if (currentCarId !== 'all' && currentCarId !== 'all_archived') {
            const c = userCars.find(x => x.id === currentCarId);
            if(c) {
                selectedCarName = c.name;
                selectedCarIcon = c.icon || (c.type === 'bike' ? "🚲" : "🚗");
                if (c.type === 'walking' && (!c.icon || c.icon === '🚗')) selectedCarIcon = "🚶";
            }
        }

        tempDriveData = {
            type: 'end_drive',
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            distanceKm: totalDistance.toFixed(2),
            maxSpeed: maxSpeed.toFixed(1),
            avgSpeed: avgSpeed.toFixed(1),
            durationMs: activeDurationMs,
            subject: "", 
            weather: currentDriveWeather,
            drivingStyle: styleLabel,
            carName: selectedCarName,
            carIcon: selectedCarIcon, 
            carId: currentCarId,
            carType: currentCarType,
            route: routePath,
            markers: driveMarkers,
            // OSOITTEET
            startAddress: startAddressSnapshot,
            endAddress: currentAddress,
            // SUB-TRIPS (LISÄTTY)
            sessions: existingSessions
        };

        const mins = Math.floor(activeDurationMs / 60000);
        if(modalDistEl) modalDistEl.innerText = totalDistance.toFixed(2) + " km";
        if(modalTimeEl) modalTimeEl.innerText = mins + " min";
        
        if(modalSubjectEl) modalSubjectEl.value = ""; 
        if(modalCarNameEl) modalCarNameEl.innerText = selectedCarName; 

        if(saveModal) saveModal.style.display = 'flex';
        if(liveStatusBar) liveStatusBar.style.opacity = '0';
    });
}

// MODAL NAPIT
if (btnModalSave) {
    btnModalSave.addEventListener('click', () => {
        if (tempDriveData) {
            tempDriveData.subject = modalSubjectEl ? modalSubjectEl.value : "";
            
            const typeRadios = document.getElementsByName('save-type');
            let selectedType = 'private';
            for (const radio of typeRadios) {
                if (radio.checked) {
                    selectedType = radio.value;
                    break;
                }
            }
            tempDriveData.driveType = selectedType;

            saveToFirebase(tempDriveData);
        }
        if(saveModal) saveModal.style.display = 'none';
        resetRecordingUI();
    });
}

if (btnModalCancel) {
    btnModalCancel.addEventListener('click', () => {
        if(typeof openConfirmModal === 'function') {
            openConfirmModal("Hylkää ajo?", "Haluatko varmasti hylätä tämän ajon? Tietoja ei tallenneta.", () => {
                if(saveModal) saveModal.style.display = 'none';
                resetRecordingUI();
            });
        } else {
            if(confirm("Haluatko varmasti hylätä tämän ajon?")) {
                if(saveModal) saveModal.style.display = 'none';
                resetRecordingUI();
            }
        }
    });
}

// 2. GPS LOGIIKKA

function startGPS() {
    isGPSActive = true;
    requestWakeLock();
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true, timeout: 5000, maximumAge: 0
        });
    }
}

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const alt = position.coords.altitude || 0;
    const heading = position.coords.heading; 
    const speedMs = position.coords.speed || 0; 
    let speedKmh = speedMs * 3.6;
    if (speedKmh < 1.0) speedKmh = 0;

    let currentAvg = 0;

    const now = Date.now();
    if (now - lastAddressFetchTime > 30000 && speedKmh > 2) {
        fetchAddress(lat, lng);
        lastAddressFetchTime = now;
    }

    if (currentDriveWeather === "") fetchWeather(lat, lng);

    if (isRecording && !isPaused) {
        if (speedKmh > maxSpeed) maxSpeed = speedKmh;
        if (lastLatLng) {
            const dist = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
            if ((speedKmh > 3 || dist > 0.02) && dist < 50.0) totalDistance += dist;
        }
        
        if (speedKmh > 3 || (lastLatLng && getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng) > 0.02)) {
            routePath.push({ lat: lat, lng: lng, spd: speedKmh });
            if(realTimePolyline) realTimePolyline.addLatLng([lat, lng]);
        }

        if (startTime) {
            const now = new Date();
            const activeTimeMs = (now - startTime) - totalPauseTime;
            const durationHrs = activeTimeMs / (1000 * 60 * 60);
            if (durationHrs > 0) currentAvg = totalDistance / durationHrs;
        }

        saveCrashData();

        // UUSI V6.14: Päivitä visuaaliset elementit
        if (typeof updateSpeedometer === 'function') {
            updateSpeedometer(speedKmh);
        }
        
        if (typeof updateGraphs === 'function') {
            // G-voiman laskenta (jos anturit saatavilla)
            let gx = 0, gy = 0;
            if (window.motionData) {
                gx = window.motionData.x || 0;
                gy = window.motionData.y || 0;
            }
            updateGraphs(speedKmh, alt, Math.sqrt(gx * gx + gy * gy));
        }
        
        if (typeof updateGIndicator === 'function' && window.motionData) {
            updateGIndicator(window.motionData.x || 0, window.motionData.y || 0);
        }
    }
    
    if (!lastLatLng || speedKmh > 0 || isGPSActive) {
        lastLatLng = { lat, lng };
        const newLatLng = new L.LatLng(lat, lng);
        if(marker) marker.setLatLng(newLatLng);
        
        if (views.map && views.map.style.display !== 'none' && !isViewingHistory && map) {
            let targetZoom = 18; 
            if (currentCarType === 'bike' || currentCarType === 'walking') {
                if (speedKmh > 15) targetZoom = 17; else targetZoom = 19; 
            } else {
                if (speedKmh > 100) targetZoom = 14; 
                else if (speedKmh > 70) targetZoom = 16;
                else if (speedKmh > 40) targetZoom = 17;
                else targetZoom = 18;
            }
            if (map.getZoom() !== targetZoom) map.setView(newLatLng, targetZoom);
            else map.panTo(newLatLng);
        }
        if(mapSpeedEl) mapSpeedEl.innerText = speedKmh.toFixed(1);
        if(mapCoordsEl) mapCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    }

    if(typeof updateDashboardUI === 'function') {
        updateDashboardUI(speedKmh, maxSpeed, totalDistance, null, alt, currentAvg);
    }
    
    if(dashCoordsEl) dashCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    
    if (heading !== null && !isNaN(heading)) {
        if(dashHeadingEl) dashHeadingEl.innerText = `${Math.round(heading)}°`;
        if(compassArrowEl) compassArrowEl.style.transform = `rotate(${heading}deg)`;
    }

    if (isGPSActive && wakeLock === null) requestWakeLock();

    // =========================================================
    // POI VAROITUKSET (Lähestyessä)
    // =========================================================
    if (currentUser && Array.isArray(poiData) && poiData.length > 0) {
        try {
            checkPoiAlerts(lat, lng, heading, speedKmh);
        } catch (e) {
            // Ei kaadeta GPS-loopia
        }
    }
}

function checkPoiAlerts(lat, lng, heading, speedKmh) {
    const now = Date.now();

    // 1) Jos meillä on aktiivinen varoitus, pidetään se kunnes se ei enää kelpaa
    if (activePoiAlert && activePoiAlert.id) {
        const existing = poiData.find(p => p && p.id === activePoiAlert.id);
        const ok = existing && poiQualifies(existing, lat, lng, heading, speedKmh);
        if (ok) {
            updateActivePoiToast(existing, lat, lng, now);
            return;
        } else {
            activePoiAlert = null;
            if (typeof hidePersistentToast === 'function') hidePersistentToast();
        }
    }

    // 2) Ei aktiivista tai se ei kelvannut -> etsitään paras osuma
    let best = null;
    let bestDistM = Infinity;

    for (const poi of poiData) {
        if (!poi || !poi.id) continue;
        if (!poiQualifies(poi, lat, lng, heading, speedKmh)) continue;

        const distM = getDistanceFromLatLonInKm(lat, lng, poi.lat, poi.lng) * 1000;
        if (distM < bestDistM) {
            best = poi;
            bestDistM = distM;
        }
    }

    if (best) {
        activePoiAlert = { id: best.id, startedAt: now, lastShownAt: 0, minDistM: null };
        updateActivePoiToast(best, lat, lng, now);
    } else {
        if (typeof hidePersistentToast === 'function') hidePersistentToast();
    }
}

function poiDebug(msg) {
    try {
        if (localStorage.getItem('poiDebug') !== '1') return;
        console.log('[POI]', msg);
        // Kevyt throttlaus, ettei spämmää
        const last = parseInt(localStorage.getItem('poiDebugLast') || '0', 10) || 0;
        const now = Date.now();
        if (now - last < 3000) return;
        localStorage.setItem('poiDebugLast', String(now));
        if (typeof showToast === 'function') showToast(msg);
    } catch (e) {
        // ignore
    }
}

function poiQualifies(poi, lat, lng, heading, speedKmh) {
    const alertEnabled = (poi.alertEnabled === true || poi.alertEnabled === 1 || poi.alertEnabled === '1' || String(poi.alertEnabled).toLowerCase() === 'true');
    if (!alertEnabled) return false;

    const poiType = String(poi.type || 'other').trim().toLowerCase();

    const poiLat = (typeof poi.lat === 'number') ? poi.lat : parseFloat(poi.lat);
    const poiLng = (typeof poi.lng === 'number') ? poi.lng : parseFloat(poi.lng);
    if (!isFinite(poiLat) || !isFinite(poiLng)) return false;

    const radiusM = Math.max(30, parseInt(poi.alertRadiusM || 350, 10));
    const distM = getDistanceFromLatLonInKm(lat, lng, poiLat, poiLng) * 1000;
    if (distM > radiusM) {
        return false;
    }

    // Nopeuskamera: suunnan mukaan, jos heading on saatavilla
    // HUOM: heading on monilla laitteilla epäluotettava hitaassa vauhdissa, joten käytetään suodatusta vain liikkeessä.
    const useHeading = (typeof speedKmh === 'number' && speedKmh >= 8);
    if ((poiType === 'speedcamera') && useHeading && (heading !== null) && (!isNaN(heading))) {
        const bearingToPoi = calculateBearing(lat, lng, poiLat, poiLng);
        const diff = angularDiffDeg(heading, bearingToPoi);
        if (diff > 70) {
            poiDebug(`Nopeuskamera ei kelpaa (suunta): diff ${Math.round(diff)}° (head ${Math.round(heading)}°)`);
            return false;
        }
    } else if (poiType === 'speedcamera' && !useHeading) {
        // Heading suodatus pois päältä hitaassa vauhdissa
        poiDebug(`Nopeuskamera: heading-suodatus OFF (spd ${Math.round(speedKmh || 0)} km/h)`);
    }

    return true;
}

function getPoiLabel(poi) {
    const type = String(poi.type || 'other').trim().toLowerCase();
    if (poi.name && String(poi.name).trim()) return String(poi.name).trim();
    if (type === 'speedcamera') return 'Nopeuskamera';
    if (type === 'danger') return 'Vaara';
    if (type === 'customer') return 'Asiakas';
    if (type === 'reminder') return 'Muistutus';
    return 'POI';
}

function updateActivePoiToast(poi, lat, lng, now) {
    const radiusM = Math.max(30, parseInt(poi.alertRadiusM || 350, 10));
    const cooldownSec = Math.max(0, parseInt(poi.cooldownSec || 180, 10));

    const poiLat = (typeof poi.lat === 'number') ? poi.lat : parseFloat(poi.lat);
    const poiLng = (typeof poi.lng === 'number') ? poi.lng : parseFloat(poi.lng);
    if (!isFinite(poiLat) || !isFinite(poiLng)) return;

    const distM = Math.max(0, Math.min(radiusM, getDistanceFromLatLonInKm(lat, lng, poiLat, poiLng) * 1000));

    // Tallennetaan pienin saavutettu etäisyys ja poistetaan varoitus, jos ohituksen jälkeen etäisyys kasvaa selvästi.
    if (activePoiAlert) {
        if (typeof activePoiAlert.minDistM !== 'number' || activePoiAlert.minDistM === null) {
            activePoiAlert.minDistM = distM;
        } else {
            if (distM < activePoiAlert.minDistM) activePoiAlert.minDistM = distM;

            // Ohitusheuristiikka: jos oltiin jo lähellä ja nyt kasvaa selvästi, lopetetaan varoitus.
            if (activePoiAlert.minDistM < 80 && distM > activePoiAlert.minDistM + 25) {
                activePoiAlert = null;
                if (typeof hidePersistentToast === 'function') hidePersistentToast();
                return;
            }
        }
    }

    // Päivitetään näyttö max ~1x/sek (säästää vähän)
    if (activePoiAlert && activePoiAlert.lastShownAt && (now - activePoiAlert.lastShownAt) < 800) {
        return;
    }
    if (activePoiAlert) activePoiAlert.lastShownAt = now;

    const label = getPoiLabel(poi);
    const meters = Math.round(distM);
    if (typeof showPersistentToast === 'function') {
        showPersistentToast(`📍 ${label}: ${meters} m`);
    } else if (typeof showToast === 'function') {
        showToast(`📍 ${label}: ${meters} m`);
    }

    // Värinä + "hälytys" vain cooldownin mukaan (ei joka päivitys)
    const lastTs = poiAlertState[poi.id] || 0;
    if (cooldownSec === 0 || !lastTs || (now - lastTs) >= cooldownSec * 1000) {
        poiAlertState[poi.id] = now;
        if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
        if (typeof window.playPoiAlertBeep === 'function') window.playPoiAlertBeep();
    }

    // Kun ollaan käytännössä perillä, voidaan piilottaa varoitus
    if (meters <= 0) {
        activePoiAlert = null;
        if (typeof hidePersistentToast === 'function') hidePersistentToast();
    }
}

// =========================================================
// KOORDINAATTIAPU: GEOKÄTKÖILY-MUOTO -> desimaaliasteet
// Esim: "N 60° 10.123 E 024° 56.789"
// =========================================================

window.parseGeocacheCoordinates = function(input) {
    if (!input || typeof input !== 'string') return null;
    const s = input.trim().replace(/\s+/g, ' ');

    // Yritetään erottaa N/S ja E/W -osat
    // Etsitään ensin N/S ja E/W kirjain
    const nsMatch = s.match(/([NS])\s*([0-9]{1,2})\s*[°º]?\s*([0-9]{1,2}(?:\.[0-9]+)?)\s*['’]?/i);
    const ewMatch = s.match(/([EW])\s*([0-9]{1,3})\s*[°º]?\s*([0-9]{1,2}(?:\.[0-9]+)?)\s*['’]?/i);

    if (!nsMatch || !ewMatch) return null;

    const ns = nsMatch[1].toUpperCase();
    const latDeg = parseInt(nsMatch[2], 10);
    const latMin = parseFloat(nsMatch[3]);

    const ew = ewMatch[1].toUpperCase();
    const lngDeg = parseInt(ewMatch[2], 10);
    const lngMin = parseFloat(ewMatch[3]);

    if (isNaN(latDeg) || isNaN(latMin) || isNaN(lngDeg) || isNaN(lngMin)) return null;
    if (latMin >= 60 || lngMin >= 60) return null;

    let lat = latDeg + (latMin / 60);
    let lng = lngDeg + (lngMin / 60);
    if (ns === 'S') lat = -lat;
    if (ew === 'W') lng = -lng;

    // Perusvalidointi
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

    return { lat, lng };
}

function stopGPSAndRec() {
    isRecording = false;
    isPaused = false;
    clearInterval(timerInterval);
    isGPSActive = false;
    if(watchId) navigator.geolocation.clearWatch(watchId);
    window.removeEventListener('devicemotion', handleMotion);
    
    if(silentAudio) {
        silentAudio.pause();
        silentAudio.currentTime = 0;
    }
}

// APUFUNKTIO: Liikeanturien aktivointi
function activateMotionSensors() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === 'granted') {
                window.addEventListener('devicemotion', handleMotion);
            }
        }).catch(console.error);
    } else {
        window.addEventListener('devicemotion', handleMotion);
    }
}

function handleMotion(event) {
    if (!isRecording || isPaused) return;
    
    const acc = event.acceleration; 
    const accG = event.accelerationIncludingGravity; 
    
    if (!acc) return;

    if(gBubbleEl && accG) {
        let x = -acc.x * 5; 
        let y = acc.z * 5; 

        const maxDist = 25;
        const dist = Math.sqrt(x*x + y*y);
        if (dist > maxDist) {
            x = (x / dist) * maxDist;
            y = (y / dist) * maxDist;
        }
        
        gBubbleEl.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }

    if (currentCarType === 'bike' || currentCarType === 'walking') return;
    
    const now = Date.now();
    if (now - lastMotionTime < 500) return; 
    lastMotionTime = now;
    
    const magnitude = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
    if (magnitude > 3.5) {
        aggressiveEvents++;
        if(liveStyleEl) {
            liveStyleEl.innerText = "Kiihdytys!";
            liveStyleEl.className = "style-badge style-red";
        }
        if(dashSpeedEl) dashSpeedEl.style.color = "#ff1744";
        
        if (styleResetTimer) clearTimeout(styleResetTimer);
        styleResetTimer = setTimeout(() => {
            if(liveStyleEl) {
                liveStyleEl.innerText = "Taloudellinen";
                liveStyleEl.className = "style-badge style-green";
            }
            if(dashSpeedEl) dashSpeedEl.style.color = "var(--speed-color)";
        }, 3000);
    }
}

function resetRecordingUI() {
    isRecording = false;
    isPaused = false;
    tempDriveData = null;
    routePath = [];
    driveMarkers = [];
    if(realTimePolyline) realTimePolyline.setLatLngs([]);
    currentDriveId = null; 
    
    clearCrashData(); 

    const startContainer = document.getElementById('start-buttons-container');
    if(startContainer) startContainer.style.display = 'flex';
    else if(btnStartRec) btnStartRec.style.display = 'inline-block';

    if(activeRecBtns) activeRecBtns.style.display = 'none';
    if(statusEl) {
        statusEl.innerText = "GPS Päällä";
        statusEl.style.color = "var(--subtext-color)";
    }
    if(typeof updateDashboardUI === 'function') updateDashboardUI(0, 0, 0, 0, 0, 0);
    if(dashTimeEl) dashTimeEl.innerText = "00:00";
    if(liveStatusBar) liveStatusBar.style.opacity = '0'; 
    if(dashAddressEl) dashAddressEl.innerText = "Odottaa sijaintia...";
    
    // Nollataan sessiot
    existingSessions = [];
    sessionStartDistance = 0;
    sessionStartAddress = "";
    
    if(silentAudio) {
        silentAudio.pause();
        silentAudio.currentTime = 0;
    }
}

// 3. APUFUNKTIOT

function updateTimer() {
    if (!startTime) return;
    const now = new Date();
    const diff = now - startTime - totalPauseTime;
    
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const hrs = Math.floor(diff / 3600000);
    if(dashTimeEl) dashTimeEl.innerText = (hrs>0?hrs+":":"") + (mins<10?"0":"")+mins + ":" + (secs<10?"0":"")+secs;
}

function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&wind_speed_unit=ms`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.current) {
                const temp = Math.round(data.current.temperature_2m);
                const code = data.current.weather_code;
                let emoji = "☁️";
                if (code === 0) emoji = "☀️";
                else if (code <= 3) emoji = "⛅";
                else if (code <= 48) emoji = "🌫";
                else if (code <= 67) emoji = "🌧";
                else if (code <= 77) emoji = "❄️";
                else if (code <= 82) emoji = "🌧";
                else if (code <= 86) emoji = "❄️";
                else emoji = "⛈";
                
                currentDriveWeather = `${emoji} ${temp}°C`;
                if(dashWeatherEl) dashWeatherEl.innerText = currentDriveWeather;
            }
        })
        .catch(e => console.error(e));
}

function fetchAddress(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    fetch(url, { headers: { 'User-Agent': 'AjopaivakirjaPro/5.7' } })
        .then(res => res.json())
        .then(data => {
            if (data && data.address) {
                const road = data.address.road || "";
                const number = data.address.house_number || "";
                const city = data.address.city || data.address.town || data.address.village || "";
                if (road) {
                    currentAddress = `${road} ${number}, ${city}`;
                    if(dashAddressEl) dashAddressEl.innerText = currentAddress;
                }
            }
        })
        .catch(e => console.log("Osoitehaku ei onnistunut:", e));
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2-lat1)*(Math.PI/180);
  const dLon = (lon2-lon1)*(Math.PI/180);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
            Math.cos(lat1*(Math.PI/180))*Math.cos(lat2*(Math.PI/180)) *
            Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
}

function toGeocacheFormat(deg, isLat) {
    const d = Math.floor(Math.abs(deg));
    const m = (Math.abs(deg)-d)*60;
    return `${isLat?(deg>=0?"N":"S"):(deg>=0?"E":"W")} ${d}° ${m.toFixed(3)}`;
}

function getCardinalDirection(angle) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(angle / 45) % 8];
}

function handleError(e) { 
    if(statusEl) statusEl.innerText = "GPS Virhe: " + e.message; 
}

// TALLENNUSLOGIIKKA (PÄIVITETTY v6.05)
function saveToFirebase(data) {
    if (currentUser) {
        // Jos history.js on ladattu ja funktio löytyy, käytä sitä
        if (typeof window.saveDriveSafely === 'function') {
            window.saveDriveSafely(data, currentDriveId).then(() => {
                console.log("Safe save initiated (New or Update)");
            });
        } else {
            // Fallback vanhaan
            db.ref('ajopaivakirja/' + currentUser.uid).push().set(data)
                .then(() => { 
                    if(typeof showToast === 'function') {
                        showToast("Ajo tallennettu onnistuneesti! 🏁");
                    }
                })
                .catch((error) => { alert("VIRHE: " + error.message); });
        }
    } else {
        alert("Virhe: Et ole kirjautunut sisään!");
    }
}

document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && isGPSActive) requestWakeLock();
});

async function requestWakeLock() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {}
}

// =========================================================
// 4. CRASH RECOVERY LOGIIKKA (PÄIVITETTY v6.12 SESSION SUPPORT)
// =========================================================

function saveCrashData() {
    if (!isRecording) return;
    const crashData = {
        startTime: startTime ? startTime.toISOString() : null,
        totalPauseTime: totalPauseTime,
        maxSpeed: maxSpeed,
        totalDistance: totalDistance,
        routePath: routePath,
        driveMarkers: driveMarkers,
        aggressiveEvents: aggressiveEvents,
        currentCarId: currentCarId,
        currentCarType: currentCarType,
        isPaused: isPaused,
        pauseStartTime: (isPaused && pauseStartTime) ? pauseStartTime.toISOString() : null,
        driveDbId: currentDriveId,
        startAddress: startAddressSnapshot,
        // SESSION DATA
        sessionStartTime: sessionStartTime ? sessionStartTime.toISOString() : null,
        sessionStartDistance: sessionStartDistance,
        sessionPauseTime: sessionPauseTime,
        sessionStartAddress: sessionStartAddress, // LISÄTTY
        existingSessions: existingSessions
    };
    localStorage.setItem(RECOVERY_KEY, JSON.stringify(crashData));
}

function clearCrashData() {
    localStorage.removeItem(RECOVERY_KEY);
}

function checkCrashRecovery() {
    const saved = localStorage.getItem(RECOVERY_KEY);
    if (!saved) return;
    
    const data = JSON.parse(saved);
    const savedTime = new Date(data.startTime);
    const now = new Date();
    const hoursDiff = Math.abs(now - savedTime) / 36e5;
    
    if (hoursDiff > 24) {
        console.log("Recovery data too old, clearing.");
        clearCrashData();
        return;
    }

    if (typeof openConfirmModal === 'function') {
        openConfirmModal(
            "⚠️ Ajo keskeytyi!",
            "Havaittiin odottamatta katkennut ajo. Haluatko palauttaa tilanteen ja jatkaa tallennusta?",
            () => restoreDrive(data) 
        );
        const btnNo = document.getElementById('btn-confirm-no');
        if(btnNo) {
            const clearHandler = () => { clearCrashData(); btnNo.removeEventListener('click', clearHandler); };
            btnNo.addEventListener('click', clearHandler);
        }
    }
}

function restoreDrive(data) {
    console.log("Restoring drive...", data);
    
    startTime = new Date(data.startTime);
    totalPauseTime = data.totalPauseTime || 0;
    maxSpeed = data.maxSpeed || 0;
    totalDistance = data.totalDistance || 0;
    routePath = data.routePath || [];
    driveMarkers = data.driveMarkers || [];
    aggressiveEvents = data.aggressiveEvents || 0;
    currentCarId = data.currentCarId || 'all';
    currentCarType = data.currentCarType || 'car';
    
    currentDriveId = data.driveDbId || null;
    startAddressSnapshot = data.startAddress || ""; 
    
    // PALAUTETAAN SESSION DATA
    if (data.sessionStartTime) sessionStartTime = new Date(data.sessionStartTime);
    else sessionStartTime = new Date(); // Fallback
    
    sessionStartDistance = data.sessionStartDistance || 0;
    sessionPauseTime = data.sessionPauseTime || 0;
    sessionStartAddress = data.sessionStartAddress || ""; // LISÄTTY
    existingSessions = data.existingSessions || [];
    
    const carSelect = document.getElementById('car-select');
    if (carSelect) carSelect.value = currentCarId;
    if (typeof updateCarTypeVariable === 'function') updateCarTypeVariable();
    
    startGPS(); 
    
    silentAudio.play().then(() => console.log("Audio restored")).catch(e => console.error("Audio restore fail", e));
    activateMotionSensors(); 

    isRecording = true;
    isViewingHistory = false;
    
    if(btnActivate) btnActivate.style.display = 'none';
    if(document.getElementById('rec-controls')) document.getElementById('rec-controls').style.display = 'flex';
    
    const startContainer = document.getElementById('start-buttons-container');
    if (startContainer) startContainer.style.display = 'none';
    
    if(activeRecBtns) activeRecBtns.style.display = 'flex';
    if(btnStartRec) btnStartRec.style.display = 'none';
    
    if (data.isPaused) {
        isPaused = true;
        pauseStartTime = data.pauseStartTime ? new Date(data.pauseStartTime) : new Date();
        if(btnPause) btnPause.style.display = 'none';
        if(btnResume) btnResume.style.display = 'inline-block';
        if(statusEl) { statusEl.innerText = "⏸ TAUKO (PALAUTETTU)"; statusEl.style.color = "#fbc02d"; }
    } else {
        isPaused = false;
        if(btnPause) btnPause.style.display = 'inline-block';
        if(btnResume) btnResume.style.display = 'none';
        const statusText = currentDriveId ? "🔴 JATKETAAN AJOA (PALAUTETTU)" : "🔴 TALLENNETAAN (PALAUTETTU)";
        if(statusEl) { statusEl.innerText = statusText; statusEl.style.color = "#ff4444"; }
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    if(realTimePolyline && routePath.length > 0) {
        const latLngs = routePath.map(pt => [pt.lat, pt.lng]);
        realTimePolyline.setLatLngs(latLngs);
    }
    
    showToast("Ajo palautettu onnistuneesti! ♻️");
}

setTimeout(checkCrashRecovery, 1000);
