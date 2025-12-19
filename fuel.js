// =========================================================
// FUEL.JS - TANKKAUSTEN HALLINTA (CRUD)
// =========================================================

// DOM Elementit
const btnOpenFuel = document.getElementById('btn-open-fuel');
const fuelModal = document.getElementById('fuel-modal');
const fuelModalTitle = document.getElementById('fuel-modal-title'); // UUSI
const fuelCarNameEl = document.getElementById('fuel-car-name');
const inpFuelOdo = document.getElementById('fuel-odo');
const inpFuelLiters = document.getElementById('fuel-liters');
const inpFuelEuros = document.getElementById('fuel-euros');
const txtFuelPrice = document.getElementById('fuel-price-calc');
const btnFuelSave = document.getElementById('btn-fuel-save');
const btnFuelCancel = document.getElementById('btn-fuel-cancel');

// Historia-tabit
const tabDrives = document.getElementById('tab-drives');
const tabFuel = document.getElementById('tab-fuel');
const divLogList = document.getElementById('log-list');
const divFuelList = document.getElementById('fuel-list');
const divHistoryFilter = document.getElementById('history-filter'); 

// Tilan hallinta
let currentFuelEditKey = null; // Jos tämä on null, luodaan uusi. Jos arvo, muokataan.

// 1. LATAA TANKKAUKSET FIREBASESTA
function loadRefuelings() {
    if (!currentUser) return;
    
    // Kuunnellaan käyttäjän omia tankkauksia
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
        
        // Jos tankkauslista on auki, päivitä se
        if (divFuelList && divFuelList.style.display !== 'none') {
            renderFuelList();
        }
        
        // Päivitä tilastot (jos halutaan lennosta)
        if (typeof renderStats === 'function') renderStats();
    });
}

// 2. AVAA MODAALI (UUSI TANKKAUS)
if (btnOpenFuel) {
    btnOpenFuel.addEventListener('click', () => {
        // Nollataan muokkaustila
        currentFuelEditKey = null;
        if(fuelModalTitle) fuelModalTitle.innerText = "⛽ Uusi tankkaus";

        // Selvitä mikä auto on valittuna
        let carName = "Tuntematon auto";
        
        // Hae nimi userCars-listasta globaalin currentCarId:n avulla
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
        inpFuelOdo.value = "";
        inpFuelLiters.value = "";
        inpFuelEuros.value = "";
        txtFuelPrice.innerText = "0.00";
        
        fuelModal.style.display = 'flex';
    });
}

// 3. AVAA MODAALI (MUOKKAUS) - Globaali funktio
window.openEditFuelModal = (key) => {
    const ref = allRefuelings.find(r => r.key === key);
    if (!ref) return;

    // Asetetaan muokkaustilaan
    currentFuelEditKey = key;
    currentRefuelingCarId = ref.carId; // Varmistetaan että auto pysyy samana muokkauksessa
    if(fuelModalTitle) fuelModalTitle.innerText = "✏️ Muokkaa tankkausta";

    // Hae auton nimi
    const c = userCars.find(x => x.id === ref.carId);
    fuelCarNameEl.innerText = c ? c.name : "Tuntematon auto";

    // Täytä arvot
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

// 4. TALLENNA (Create tai Update)
if (btnFuelSave) {
    btnFuelSave.addEventListener('click', () => {
        const odo = parseFloat(inpFuelOdo.value);
        const lit = parseFloat(inpFuelLiters.value);
        const eur = parseFloat(inpFuelEuros.value);
        
        if (!odo || !lit || !eur) {
            alert("Täytä kaikki kentät.");
            return;
        }
        
        // Datan runko
        const data = {
            carId: currentRefuelingCarId,
            odometer: odo,
            liters: lit,
            euros: eur,
            pricePerLiter: (eur / lit).toFixed(3)
        };

        // Jos muokkaamme vanhaa
        if (currentFuelEditKey) {
            db.ref('refuelings/' + currentUser.uid + '/' + currentFuelEditKey).update(data)
                .then(() => {
                    fuelModal.style.display = 'none';
                    currentFuelEditKey = null; // Nollaa tila
                })
                .catch(err => alert("Virhe muokkauksessa: " + err.message));
        } 
        // Jos luomme uutta
        else {
            data.date = new Date().toISOString(); // Lisää päiväys vain uudelle (tai halutessasi voi muokata päiväystäkin)
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

// 5. HISTORIAN VÄLILEHDET & RENDERÖINTI

if (tabDrives) {
    tabDrives.addEventListener('click', () => {
        divLogList.style.display = 'block';
        divFuelList.style.display = 'none';
        tabDrives.classList.add('blue-btn'); tabDrives.style.backgroundColor = '';
        tabFuel.classList.remove('blue-btn'); tabFuel.style.backgroundColor = '#333';
        if(divHistoryFilter) divHistoryFilter.style.display = 'block'; 
    });
}

if (tabFuel) {
    tabFuel.addEventListener('click', () => {
        divLogList.style.display = 'none';
        divFuelList.style.display = 'block';
        tabFuel.classList.add('blue-btn'); tabFuel.style.backgroundColor = '';
        tabDrives.classList.remove('blue-btn'); tabDrives.style.backgroundColor = '#333';
        if(divHistoryFilter) divHistoryFilter.style.display = 'none'; 
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

    if (filtered.length === 0) {
        divFuelList.innerHTML = "<p style='text-align:center; color:#888;'>Ei tankkauksia valitulla autolla.</p>";
        return;
    }

    // Renderöinti
    filtered.forEach((ref, index) => {
        const date = new Date(ref.date);
        const dateStr = date.toLocaleDateString('fi-FI') + " " + date.toLocaleTimeString('fi-FI', {hour:'2-digit', minute:'2-digit'});
        
        const car = userCars.find(c => c.id === ref.carId);
        const carIcon = car ? (car.icon || "⛽") : "⛽";
        const carName = car ? car.name : "Tuntematon";

        // Yksinkertainen kulutuslaskenta
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
