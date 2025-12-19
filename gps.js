// =========================================================
// GPS.JS - PAIKANNUS, MATKA JA TALLENNUS
// =========================================================

// 1. KONTROLLIPAINIKKEET JA LOGIIKKA

// Aktivointinappi (jos ei tallenneta vielä, ensimmäinen käynnistys)
const btnActivate = document.getElementById('btn-activate-gps');
if (btnActivate) {
    btnActivate.addEventListener('click', () => {
        if (!isGPSActive) {
            startGPS();
            btnActivate.style.display = 'none';
            if(document.getElementById('rec-controls')) {
                document.getElementById('rec-controls').style.display = 'flex';
            }
            if(statusEl) statusEl.innerText = "GPS Päällä";
        }
    });
}

// ALOITA TALLENNUS
if (btnStartRec) {
    btnStartRec.addEventListener('click', () => {
        // Kiihtyvyysanturin lupa (iOS vaatii erillisen pyynnön)
        if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
            DeviceMotionEvent.requestPermission().then(response => {
                if (response === 'granted') {
                    window.addEventListener('devicemotion', handleMotion);
                }
            }).catch(console.error);
        } else {
            window.addEventListener('devicemotion', handleMotion);
        }

        isRecording = true;
        isPaused = false;
        isViewingHistory = false; // Pakota GPS-seuranta päälle
        
        if(mapGpsToggle) {
            mapGpsToggle.innerText = "📡 ON";
            mapGpsToggle.classList.remove('inactive');
        }

        // Nollataan muuttujat
        startTime = new Date();
        totalPauseTime = 0;
        maxSpeed = 0;
        totalDistance = 0;
        
        // Nollaa reittidatat
        routePath = [];
        if(realTimePolyline) realTimePolyline.setLatLngs([]);
        if(typeof clearSavedRoute === 'function') clearSavedRoute();
        
        currentDriveWeather = "";
        aggressiveEvents = 0;
        
        // Nollataan UI
        if(typeof updateDashboardUI === 'function') updateDashboardUI(0, 0, 0, 0, 0, 0);
        
        // Eco-mittarin logiikka
        if (currentCarType === 'bike') {
            if(liveStatusBar) liveStatusBar.style.opacity = '0';
        } else {
            if(liveStatusBar) liveStatusBar.style.opacity = '1'; 
            if(liveStyleEl) {
                liveStyleEl.innerText = "Taloudellinen";
                liveStyleEl.className = "style-badge style-green";
            }
        }
        
        // Päivitä napit
        btnStartRec.style.display = 'none';
        activeRecBtns.style.display = 'flex';
        btnPause.style.display = 'inline-block';
        btnResume.style.display = 'none';
        
        if(statusEl) {
            statusEl.innerText = "🔴 TALLENNETAAN";
            statusEl.style.color = "#ff4444";
        }
        
        // Käynnistä sekuntikello
        if(timerInterval) clearInterval(timerInterval);
        timerInterval = setInterval(updateTimer, 1000);
    });
}

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
    });
}

// JATKA
if (btnResume) {
    btnResume.addEventListener('click', () => {
        isPaused = false;
        const now = new Date();
        totalPauseTime += (now - pauseStartTime);
        btnResume.style.display = 'none';
        btnPause.style.display = 'inline-block';
        if(statusEl) {
            statusEl.innerText = "🔴 TALLENNETAAN";
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
        
        if (isPaused && pauseStartTime) {
            totalPauseTime += (new Date() - pauseStartTime);
        }

        const endTime = new Date();
        const activeDurationMs = (endTime - startTime) - totalPauseTime;
        const durationHours = activeDurationMs / (1000 * 60 * 60);
        let avgSpeed = durationHours > 0 ? (totalDistance / durationHours) : 0;

        let styleLabel = "";
        if (currentCarType !== 'bike') {
            styleLabel = "Tasainen";
            if (aggressiveEvents > 5) styleLabel = "Reipas";
            if (aggressiveEvents > 15) styleLabel = "Aggressiivinen";
        }

        // Hae valitun auton tiedot
        let selectedCarName = "Muu ajoneuvo";
        let selectedCarIcon = "🚗";
        if (currentCarId !== 'all') {
            const c = userCars.find(x => x.id === currentCarId);
            if(c) {
                selectedCarName = c.name;
                selectedCarIcon = c.icon || (c.type === 'bike' ? "🚲" : "🚗");
            }
        }

        // Luodaan tallennusobjekti
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
            route: routePath // TALLENNA REITTI
        };

        const mins = Math.floor(activeDurationMs / 60000);
        if(modalDistEl) modalDistEl.innerText = totalDistance.toFixed(2) + " km";
        if(modalTimeEl) modalTimeEl.innerText = mins + " min";
        if(modalSubjectEl) modalSubjectEl.value = ""; 
        if(modalCarNameEl) modalCarNameEl.innerText = selectedCarName; 

        // Avaa tallennusikkuna
        if(saveModal) saveModal.style.display = 'flex';
        if(modalSubjectEl) modalSubjectEl.focus();
        if(liveStatusBar) liveStatusBar.style.opacity = '0';
    });
}

// MODAL NAPIT (TALLENNA / PERUUTA)
if (btnModalSave) {
    btnModalSave.addEventListener('click', () => {
        if (tempDriveData) {
            tempDriveData.subject = modalSubjectEl ? modalSubjectEl.value : "";
            saveToFirebase(tempDriveData);
        }
        if(saveModal) saveModal.style.display = 'none';
        resetRecordingUI();
    });
}

if (btnModalCancel) {
    btnModalCancel.addEventListener('click', () => {
        if(confirm("Haluatko varmasti hylätä tämän ajon?")) {
            if(saveModal) saveModal.style.display = 'none';
            resetRecordingUI();
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

    if (currentDriveWeather === "") fetchWeather(lat, lng);

    // Jos nauhoitus on päällä, tallenna dataa
    if (isRecording && !isPaused) {
        if (speedKmh > maxSpeed) maxSpeed = speedKmh;
        if (lastLatLng) {
            const dist = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
            // WhatsApp-korjaus: Sallitaan 50km hyppy, suodattaa isommat virheet
            if ((speedKmh > 3 || dist > 0.02) && dist < 50.0) totalDistance += dist;
        }
        
        // Tallenna reittipiste (LAT, LNG, SPEED)
        if (speedKmh > 3 || (lastLatLng && getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng) > 0.02)) {
            routePath.push({ lat: lat, lng: lng, spd: speedKmh });
            
            // Piirrä live-viivaa (tarkistetaan onko map ja polyline olemassa)
            if(realTimePolyline) realTimePolyline.addLatLng([lat, lng]);
        }

        if (startTime) {
            const now = new Date();
            const activeTimeMs = (now - startTime) - totalPauseTime;
            const durationHrs = activeTimeMs / (1000 * 60 * 60);
            if (durationHrs > 0) currentAvg = totalDistance / durationHrs;
        }
    }
    
    // Päivitä sijainti kartalla
    if (!lastLatLng || speedKmh > 0 || isGPSActive) {
        lastLatLng = { lat, lng };
        const newLatLng = new L.LatLng(lat, lng);
        if(marker) marker.setLatLng(newLatLng);
        
        // Keskitä kartta VAIN JOS emme katsele historiaa
        if (views.map && views.map.style.display !== 'none' && !isViewingHistory && map) {
            
            // ZOOM Logiikka nopeuden mukaan
            let targetZoom = 18; 
            if (currentCarType === 'bike') {
                if (speedKmh > 15) targetZoom = 17; 
                else targetZoom = 19; 
            } else {
                if (speedKmh > 100) targetZoom = 14; 
                else if (speedKmh > 70) targetZoom = 16;
                else if (speedKmh > 40) targetZoom = 17;
                else targetZoom = 18;
            }
            
            if (map.getZoom() !== targetZoom) {
                map.setView(newLatLng, targetZoom);
            } else {
                map.panTo(newLatLng);
            }
        }
        if(mapSpeedEl) mapSpeedEl.innerText = speedKmh.toFixed(1);
        if(mapCoordsEl) mapCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    }

    if(typeof updateDashboardUI === 'function') {
        updateDashboardUI(speedKmh, maxSpeed, totalDistance, null, alt, currentAvg);
    }
    
    if(dashCoordsEl) dashCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    
    if (heading !== null && !isNaN(heading) && speedKmh > 3 && dashHeadingEl) {
        dashHeadingEl.innerText = `${getCardinalDirection(heading)} ${Math.round(heading)}°`;
    } else if (dashHeadingEl && dashHeadingEl.innerText === "--") {
        dashHeadingEl.innerText = "--";
    }

    if (isGPSActive && wakeLock === null) requestWakeLock();
}

function stopGPSAndRec() {
    isRecording = false;
    isPaused = false;
    clearInterval(timerInterval);
    isGPSActive = false;
    if(watchId) navigator.geolocation.clearWatch(watchId);
    window.removeEventListener('devicemotion', handleMotion);
}

function handleMotion(event) {
    if (!isRecording || isPaused) return;
    if (currentCarType === 'bike') return;

    const now = Date.now();
    if (now - lastMotionTime < 500) return; 
    lastMotionTime = now;
    const acc = event.acceleration; 
    if (!acc) return;
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
    if(realTimePolyline) realTimePolyline.setLatLngs([]);

    if(btnStartRec) btnStartRec.style.display = 'inline-block';
    if(activeRecBtns) activeRecBtns.style.display = 'none';
    if(statusEl) {
        statusEl.innerText = "GPS Päällä";
        statusEl.style.color = "var(--subtext-color)";
    }
    if(typeof updateDashboardUI === 'function') updateDashboardUI(0, 0, 0, 0, 0, 0);
    if(dashTimeEl) dashTimeEl.innerText = "00:00";
    if(liveStatusBar) liveStatusBar.style.opacity = '0'; 
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

// Tallennus Firebaseen
function saveToFirebase(data) {
    if (currentUser) {
        db.ref('ajopaivakirja/' + currentUser.uid).push().set(data)
            .then(() => { console.log("Tallennus onnistui"); })
            .catch((error) => { alert("VIRHE: " + error.message); });
    } else {
        alert("Virhe: Et ole kirjautunut sisään!");
    }
}

// Wake Lock
document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && isGPSActive) requestWakeLock();
});

async function requestWakeLock() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {}
}
