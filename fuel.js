// =========================================================
// FUEL.JS - TANKKAUSTEN HALLINTA (CRUD)
// =========================================================

// DOM Elementit
const btnOpenFuel = document.getElementById('btn-open-fuel');
const fuelModal = document.getElementById('fuel-modal');
const fuelModalTitle = document.getElementById('fuel-modal-title');
const fuelCarNameEl = document.getElementById('fuel-car-name');
const inpFuelOdo = document.getElementById('fuel-odo');
const inpFuelLiters = document.getElementById('fuel-liters');
const inpFuelEuros = document.getElementById('fuel-euros');
const txtFuelPrice = document.getElementById('fuel-price-calc');
const btnFuelSave = document.getElementById('btn-fuel-save');
const btnFuelCancel = document.getElementById('btn-fuel-cancel');

// Uudet aikakentät
const inpFuelDate = document.getElementById('fuel-date');
const inpFuelTime = document.getElementById('fuel-time');

// Historia-tabit
const tabDrives = document.getElementById('tab-drives');
const tabFuel = document.getElementById('tab-fuel');
const divLogList = document.getElementById('log-list');
const divFuelList = document.getElementById('fuel-list');
const divHistoryFilter = document.getElementById('history-filter'); 

// Tilan hallinta
let currentFuelEditKey = null; 

// 1. LATAA TANKKAUKSET FIREBASESTA
function loadRefuelings() {
    if (!currentUser) return;
    
    const refRef = db.ref('refuelings/' + currentUser.uid).orderByChild('date');
    
    refRef.on('value', (snapshot) => {
        allRefuelings = [];
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                allRefuelings.push({ key: child.key, ...child.val() });
            });
        }
        // Järjestä uusin ensin
        allRefuelings.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Jos tankkauslista on auki, päivitä se heti
        if (divFuelList && divFuelList.style.display !== 'none') {
            renderFuelList();
        }
        
        // Päivitä myös tilastot, jos ne ovat auki
        if (typeof renderStats === 'function') renderStats();
    });
}

// 2. AVAA MODAALI (LISÄYS)
if (btnOpenFuel) {
    btnOpenFuel.addEventListener('click', () => {
        currentFuelEditKey = null;
        if(fuelModalTitle) fuelModalTitle.innerText = "⛽ Uusi tankkaus";

        let carName = "Tuntematon auto";
        if (currentCarId && currentCarId !== 'all') {
            const c = userCars.find(x => x.id === currentCarId);
            if(c) {
                carName = c.name;
                currentRefuelingCarId = currentCarId;
            } else {
                alert("Valitse ensin auto ylävalikosta!");
                return;
            }
        } else {
            alert("Valitse jokin tietty auto ylävalikosta lisätäksesi tankkauksen.");
            return;
        }

        fuelCarNameEl.innerText = carName;
        
        // Aseta nykyhetki oletukseksi
        const now = new Date();
        inpFuelDate.value = now.toISOString().split('T')[0]; // YYYY-MM-DD
        inpFuelTime.value = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM

        inpFuelOdo.value = "";
        inpFuelLiters.value = "";
        inpFuelEuros.value = "";
        txtFuelPrice.innerText = "0.00";
        fuelModal.style.display = 'flex';
    });
}

// AVAA MODAALI (MUOKKAUS) - Globaali funktio
window.openEditFuelModal = (key) => {
    const ref = allRefuelings.find(r => r.key === key);
    if (!ref) return;

    currentFuelEditKey = key;
    currentRefuelingCarId = ref.carId; 
    if(fuelModalTitle) fuelModalTitle.innerText = "✏️ Muokkaa tankkausta";

    const c = userCars.find(x => x.id === ref.carId);
    fuelCarNameEl.innerText = c ? c.name : "Tuntematon auto";

    // Pura tallennettu päiväys inputteihin
    if (ref.date) {
        const d = new Date(ref.date);
        // Puretaan manuaalisesti jotta aikavyöhyke ei sotke
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const hours = String(d.getHours()).padStart(2, '0');
        const minutes = String(d.getMinutes()).padStart(2, '0');
        
        inpFuelDate.value = `${year}-${month}-${day}`;
        inpFuelTime.value = `${hours}:${minutes}`;
    }

    inpFuelOdo.value = ref.odometer || "";
    inpFuelLiters.value = ref.liters || "";
    inpFuelEuros.value = ref.euros || "";
    
    calcPrice(); // Päivitä litrahinta näkyviin
    
    fuelModal.style.display = 'flex';
};

// Laske litrahinta lennosta
function calcPrice() {
    const l = parseFloat(inpFuelLiters.value);
    const e = parseFloat(inpFuelEuros.value);
    if(l > 0 && e > 0) {
        txtFuelPrice.innerText = (e / l).toFixed(3);
    } else {
        txtFuelPrice.innerText = "0.00";
    }
}
if(inpFuelLiters) inpFuelLiters.addEventListener('input', calcPrice);
if(inpFuelEuros) inpFuelEuros.addEventListener('input', calcPrice);

// 3. TALLENNA
if (btnFuelSave) {
    btnFuelSave.addEventListener('click', () => {
        const odo = parseFloat(inpFuelOdo.value);
        const lit = parseFloat(inpFuelLiters.value);
        const eur = parseFloat(inpFuelEuros.value);
        const dateVal = inpFuelDate.value;
        const timeVal = inpFuelTime.value;
        
        if (!odo || !lit || !eur || !dateVal || !timeVal) {
            alert("Täytä kaikki kentät.");
            return;
        }
        
        // Yhdistä pvm ja aika ISO-stringiksi
        const combinedDate = new Date(dateVal + 'T' + timeVal);
        
        const data = {
            carId: currentRefuelingCarId,
            date: combinedDate.toISOString(),
            odometer: odo,
            liters: lit,
            euros: eur,
            pricePerLiter: (eur / lit).toFixed(3)
        };

        if (currentFuelEditKey) {
            // PÄIVITYS
            db.ref('refuelings/' + currentUser.uid + '/' + currentFuelEditKey).update(data)
                .then(() => {
                    fuelModal.style.display = 'none';
                    currentFuelEditKey = null; 
                })
                .catch(err => alert("Virhe muokkauksessa: " + err.message));
        } else {
            // UUSI
            db.ref('refuelings/' + currentUser.uid).push(data)
                .then(() => {
                    fuelModal.style.display = 'none';
                    alert("Tankkaus tallennettu!");
                })
                .catch(err => alert("Virhe tallennuksessa: " + err.message));
        }
    });
}

if (btnFuelCancel) {
    btnFuelCancel.addEventListener('click', () => {
        fuelModal.style.display = 'none';
        currentFuelEditKey = null;
    });
}

// 4. HISTORIAN VÄLILEHDET & RENDERÖINTI

if (tabDrives) {
    tabDrives.addEventListener('click', () => {
        divLogList.style.display = 'block';
        divFuelList.style.display = 'none';
        tabDrives.classList.add('blue-btn'); tabDrives.style.backgroundColor = '';
        tabFuel.classList.remove('blue-btn'); tabFuel.style.backgroundColor = '#333';
        if(divHistoryFilter) divHistoryFilter.style.display = 'block'; 
        
        // Päivitä yhteenveto ajotilanteeseen
        if(typeof renderHistoryList === 'function') renderHistoryList();
    });
}

if (tabFuel) {
    tabFuel.addEventListener('click', () => {
        divLogList.style.display = 'none';
        divFuelList.style.display = 'block';
        tabFuel.classList.add('blue-btn'); tabFuel.style.backgroundColor = '';
        tabDrives.classList.remove('blue-btn'); tabDrives.style.backgroundColor = '#333';
        if(divHistoryFilter) divHistoryFilter.style.display = 'none'; 
        
        // Päivitä lista ja yhteenveto
        renderFuelList();
    });
}

function renderFuelList() {
    divFuelList.innerHTML = "";
    
    // Suodata valitun auton mukaan
    const filtered = allRefuelings.filter(f => {
        if (currentCarId === 'all') return true;
        return f.carId === currentCarId;
    });
    
    // --- LASKETAAN YHTEENVETO (EURO, BENSA, DIESEL) ---
    let sumEur = 0;
    let sumGas = 0;
    let sumDiesel = 0;
    
    filtered.forEach(ref => {
        sumEur += parseFloat(ref.euros) || 0;
        
        const car = userCars.find(c => c.id === ref.carId);
        const fuelType = (car ? car.fuel : "Muu").toLowerCase();
        
        if (fuelType.includes('bensiini') || fuelType.includes('gas')) {
            sumGas += parseFloat(ref.liters) || 0;
        } else if (fuelType.includes('diesel')) {
            sumDiesel += parseFloat(ref.liters) || 0;
        } else {
            // Jos muu, lisätään vaikka bensaan tai jätetään huomiotta. 
            // Tässä oletetaan bensaksi jos ei ole diesel.
            sumGas += parseFloat(ref.liters) || 0; 
        }
    });
    
    // PÄIVITETÄÄN SININEN LAATIKKO
    document.getElementById('sum-val-1').innerText = sumEur.toFixed(0) + " €";
    document.getElementById('sum-label-1').innerText = "Rahaa";

    document.getElementById('sum-val-2').innerText = sumGas.toFixed(0);
    document.getElementById('sum-label-2').innerText = "Bensa (l)";

    document.getElementById('sum-val-3').innerText = sumDiesel.toFixed(0);
    document.getElementById('sum-label-3').innerText = "Diesel (l)";
    
    // Varmista että boksi näkyy
    const historySummaryEl = document.getElementById('history-summary');
    if(historySummaryEl) historySummaryEl.style.display = 'flex';

    if (filtered.length === 0) {
        divFuelList.innerHTML = "<p style='text-align:center; color:#888;'>Ei tankkauksia valitulla autolla.</p>";
        // Nollataan luvut jos lista tyhjä
        document.getElementById('sum-val-1').innerText = "0 €";
        document.getElementById('sum-val-2').innerText = "0";
        document.getElementById('sum-val-3').innerText = "0";
        return;
    }

    // Renderöinti
    filtered.forEach((ref, index) => {
        const date = new Date(ref.date);
        const dateStr = date.toLocaleDateString('fi-FI') + " " + date.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
        
        const car = userCars.find(c => c.id === ref.carId);
        const carIcon = car ? (car.icon || "⛽") : "⛽";
        const carName = car ? car.name : "Tuntematon";

        // Yksinkertainen kulutuslaskenta (vertaa edelliseen tankkaukseen listalla)
        let consumptionStr = "-";
        if (index < filtered.length - 1) {
            const prev = filtered[index + 1];
            if (prev.carId === ref.carId) {
                const dist = ref.odometer - prev.odometer;
                if (dist > 0) {
                    const cons = (ref.liters / dist) * 100;
                    consumptionStr = cons.toFixed(1) + " l/100km";
                }
            }
        }

        const div = document.createElement('div');
        div.className = 'log-card';
        
        // ANIMAATIO-VIIVE: luo "putoavan" efektin
        const delay = Math.min(index * 0.05, 1.0); // Maksimissaan 1s viive
        div.style.animationDelay = `${delay}s`;

        div.innerHTML = `
            <div class="log-header">
                <div class="log-title-group">
                    <div class="log-date-line">${dateStr}</div>
                    <div class="log-car-big">${carIcon} ${carName}</div>
                </div>
                <div style="font-size:20px; font-weight:bold; color:#00e676;">
                    ${parseFloat(ref.euros).toFixed(2)} €
                </div>
            </div>
            <div class="log-stats">
                <div><span class="stat-label">LITRAT</span>${parseFloat(ref.liters).toFixed(1)} L</div>
                <div><span class="stat-label">€ / L</span>${ref.pricePerLiter}</div>
                <div><span class="stat-label">KM</span>${ref.odometer}</div>
                <div><span class="stat-label">KULUTUS</span>${consumptionStr}</div>
            </div>
            <div style="text-align:right; margin-top:10px;">
                <button class="edit-btn" onclick="window.openEditFuelModal('${ref.key}')">✏️ Muokkaa</button>
                <button class="delete-btn" onclick="window.deleteRefueling('${ref.key}')">🗑 Poista</button>
            </div>
        `;
        divFuelList.appendChild(div);
    });
}

window.deleteRefueling = (key) => {
    if(confirm("Poista tämä tankkausmerkintä?")) {
        db.ref('refuelings/' + currentUser.uid + '/' + key).remove();
    }
};
