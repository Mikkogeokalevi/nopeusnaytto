// =========================================================
// GARAGE.JS - AJONEUVOJEN HALLINTA (OPTIMIZED v6.1)
// =========================================================

// 1. AJONEUVOJEN LATAUS
function loadCars() {
    if(!currentUser) return;
    
    // Käytetään uutta keskitettyä polkua
    const carsRef = db.ref(DB_PATHS.USERS + currentUser.uid + '/cars');
    
    carsRef.on('value', (snapshot) => {
        userCars = []; 
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                userCars.push({ id: child.key, ...child.val() });
            });
        }
        
        updateCarSelect(); 
        
        // Päivitetään näkymät tarvittaessa
        if (typeof renderCarList === 'function' && views.settings && views.settings.style.display !== 'none') renderCarList();
        if (typeof renderHistoryList === 'function' && views.history && views.history.style.display !== 'none') renderHistoryList();
        if (typeof renderStats === 'function' && views.stats && views.stats.style.display !== 'none') renderStats();
    });
    
    // Palauta muistista valinta
    const stored = localStorage.getItem(APP_CONFIG.CAR_STORAGE_KEY);
    if (stored) {
        currentCarId = stored;
        updateCarTypeVariable();
    }
}

// 2. VALIKKOJEN PÄIVITYS (YLÄPALKKI)
function updateCarSelect() {
    const select = document.getElementById('car-select');
    if (!select) return;
    
    let targetValue = currentCarId; 
    select.innerHTML = "";

    // Oletusvalinnat
    select.add(new Option("Kaikki aktiiviset", "all"));
    
    const optArchived = new Option("Kaikki (sis. arkistoidut)", "all_archived");
    optArchived.style.color = "#888";
    select.add(optArchived);

    const activeCars = userCars.filter(c => !c.isArchived);
    const archivedCars = userCars.filter(c => c.isArchived);

    // Aktiiviset
    if (activeCars.length > 0) {
        const group = document.createElement('optgroup');
        group.label = "Aktiiviset";
        activeCars.forEach(car => {
            const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
            group.appendChild(new Option(`${icon} ${car.name}`, car.id));
        });
        select.appendChild(group);
    }

    // Arkistoidut (Näytetään vain jos tarve vaatii)
    const currentCarIsArchived = userCars.find(c => c.id === currentCarId)?.isArchived;
    const showArchived = (currentCarId === 'all_archived' || currentCarIsArchived);

    if (showArchived && archivedCars.length > 0) {
        const group = document.createElement('optgroup');
        group.label = "Arkistoidut";
        archivedCars.forEach(car => {
            const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
            const opt = new Option(`🗄️ ${icon} ${car.name}`, car.id);
            opt.style.color = "#888";
            group.appendChild(opt);
        });
        select.appendChild(group);
    }

    select.value = targetValue;
    if (!select.value) { // Fallback
        select.value = 'all';
        currentCarId = 'all';
    }
    updateCarTypeVariable();
}

// Kuuntelija
const carSelectElLocal = document.getElementById('car-select');
if (carSelectElLocal) {
    carSelectElLocal.addEventListener('change', (e) => {
        currentCarId = e.target.value;
        localStorage.setItem(APP_CONFIG.CAR_STORAGE_KEY, currentCarId);
        updateCarTypeVariable();
        updateCarSelect(); // Päivitä lista (piilottaa/näyttää arkistoidut logiikan mukaan)
        
        if (typeof renderHistoryList === 'function') renderHistoryList();
        if (typeof renderStats === 'function') renderStats();
        if (typeof clearSavedRoute === 'function') clearSavedRoute();
    });
}

function updateCarTypeVariable() {
    if (currentCarId === 'all' || currentCarId === 'all_archived') {
        currentCarType = 'car';
    } else {
        const c = userCars.find(x => x.id === currentCarId);
        if (c) currentCarType = c.type;
    }
}

// 3. ASETUSNÄKYMÄN LISTAUS
function renderCarList() {
    const list = document.getElementById('cars-list');
    if(!list) return;
    list.innerHTML = "";

    const activeCars = userCars.filter(c => !c.isArchived);
    const archivedCars = userCars.filter(c => c.isArchived);

    if (activeCars.length === 0 && archivedCars.length === 0) {
        list.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Ei ajoneuvoja. Lisää ensimmäinen!</div>";
        return;
    }

    activeCars.forEach(car => renderCarCard(car, list, false));

    if (archivedCars.length > 0) {
        const sep = document.createElement('div');
        sep.innerHTML = "<h4 style='color:var(--subtext-color); margin: 20px 0 10px 0; text-align:center; text-transform:uppercase; font-size:12px; letter-spacing:1px;'>Arkisto</h4>";
        list.appendChild(sep);
        archivedCars.forEach(car => renderCarCard(car, list, true));
    }
}

function renderCarCard(car, container, isArchived) {
    const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
    const div = document.createElement('div');
    div.className = 'car-item' + (isArchived ? ' car-archived' : '');
    // Tyylit on siirretty CSS:ään .car-item luokkaan, mutta pidetään inline tässä yhteensopivuuden varmistamiseksi jos CSS ei päivity heti
    div.style.cssText = `display:flex; justify-content:space-between; align-items:center; padding:15px; margin-bottom:10px; background:var(--panel-bg); border:1px solid var(--border-color); border-radius:8px; ${isArchived ? 'opacity:0.6;' : ''}`;

    div.innerHTML = `
        <div>
            <strong style="font-size:16px;">${icon} ${car.name}</strong><br>
            <span style="font-size:12px; color:var(--subtext-color);">
                ${car.plate || '-'} • ${car.fuel || '-'} • ${car.tank || 0}
            </span>
        </div>
        <div style="display:flex; gap:10px;">
            <button class="icon-btn" style="border:1px solid var(--border-color);" onclick='openEditCar(${JSON.stringify(car)})'>✏️</button>
            <button class="icon-btn" style="border:1px solid var(--border-color);" title="${isArchived ? "Palauta" : "Arkistoi"}" onclick="toggleCarArchive('${car.id}', ${!isArchived})">${isArchived ? "♻️" : "🗄️"}</button>
            <button class="icon-btn" style="color:#ff4444; border-color:#ff4444;" onclick="deleteCar('${car.id}')">🗑</button>
        </div>
    `;
    container.appendChild(div);
}

// 4. MUOKKAUS JA TALLENNUS LOGIIKKA
window.toggleCarFields = () => {
    const type = document.getElementById('car-type').value;
    const fields = document.getElementById('car-specific-fields');
    if(fields) fields.style.display = (type === 'bike') ? 'none' : 'block';
};

window.openEditCar = (car) => {
    const form = document.getElementById('add-car-form');
    const btnAdd = document.getElementById('btn-add-car');
    if(form) form.style.display = 'block';
    if(btnAdd) btnAdd.style.display = 'none';
    
    document.getElementById('form-title').innerText = "Muokkaa ajoneuvoa";
    document.getElementById('car-id').value = car.id;
    document.getElementById('car-name').value = car.name;
    document.getElementById('car-type').value = car.type || 'car';
    document.getElementById('selected-car-icon').value = car.icon || "🚗";
    
    window.toggleCarFields();
    
    if (car.type !== 'bike') {
        document.getElementById('car-plate').value = car.plate || "";
        document.getElementById('car-fuel').value = car.fuel || "Bensiini";
        document.getElementById('car-tank').value = car.tank || "";
    }
    generateCarIcons(car.icon); 
};

function generateCarIcons(selectedIcon) {
    const grid = document.getElementById('car-icon-selector');
    if(!grid) return;
    grid.innerHTML = "";
    
    const icons = ["🚗","🚙","🏎️","🚕","🚓","🚌","🚐","🛻","🚚","🚜","🚲","🛵","🏍️","🛴"];
    icons.forEach(icon => {
        const div = document.createElement('div');
        div.innerText = icon;
        div.className = 'car-icon-item' + (icon === selectedIcon ? ' selected' : '');
        div.onclick = () => {
            document.querySelectorAll('.car-icon-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            document.getElementById('selected-car-icon').value = icon;
        };
        grid.appendChild(div);
    });
}

// CRUD OPERAATIOT
function toggleCarArchive(id, shouldArchive) {
    if (!currentUser) return;
    const action = shouldArchive ? "arkistoida" : "palauttaa";
    if (confirm(`Haluatko varmasti ${action} tämän ajoneuvon?`)) {
        db.ref(DB_PATHS.USERS + currentUser.uid + '/cars/' + id).update({ isArchived: shouldArchive })
            .then(() => {
                if (currentCarId === id && shouldArchive) {
                    currentCarId = 'all';
                    updateCarSelect();
                } else {
                    updateCarSelect();
                }
                if(typeof showToast === 'function') showToast(shouldArchive ? "Ajoneuvo arkistoitu 🗄️" : "Ajoneuvo palautettu ♻️");
            });
    }
}

function deleteCar(id) {
    if (!currentUser) return;
    if (confirm("VAROITUS: Poistetaanko auto pysyvästi?\n(Suositus: Käytä arkistointia)")) {
        db.ref(DB_PATHS.USERS + currentUser.uid + '/cars/' + id).remove();
    }
}

function saveCar() {
    if(!currentUser) return;
    const name = document.getElementById('car-name').value;
    if (!name) { alert("Anna ajoneuvolle nimi!"); return; }
    
    const type = document.getElementById('car-type').value;
    const id = document.getElementById('car-id').value;
    const icon = document.getElementById('selected-car-icon').value;
    
    let isArchived = false;
    if (id) {
        const existing = userCars.find(c => c.id === id);
        if(existing) isArchived = existing.isArchived || false;
    }

    const carData = {
        name: name, type: type, icon: icon, isArchived: isArchived,
        plate: (type === 'car') ? document.getElementById('car-plate').value : "",
        fuel: (type === 'car') ? document.getElementById('car-fuel').value : "",
        tank: (type === 'car') ? document.getElementById('car-tank').value : ""
    };
    
    const form = document.getElementById('add-car-form');
    const btnAdd = document.getElementById('btn-add-car');
    const onComplete = (msg) => {
        if(form) form.style.display = 'none';
        if(btnAdd) btnAdd.style.display = 'block';
        if(typeof showToast === 'function') showToast(msg);
    };

    if (id) {
        db.ref(DB_PATHS.USERS + currentUser.uid + '/cars/' + id).update(carData)
            .then(() => onComplete("Tiedot tallennettu! ✅"));
    } else {
        db.ref(DB_PATHS.USERS + currentUser.uid + '/cars').push().set(carData)
            .then(() => onComplete("Ajoneuvo lisätty! 🚗"));
    }
}

// 5. EVENT LISTENERS (INITIALIZATION)
// Nämä ajetaan kun tiedosto latautuu, elementtien pitäisi olla DOMissa
const gBtnAddCar = document.getElementById('btn-add-car');
const gBtnCancelCar = document.getElementById('btn-cancel-car');
const gBtnSaveCar = document.getElementById('btn-save-car');

if(gBtnAddCar) {
    gBtnAddCar.addEventListener('click', () => {
        const form = document.getElementById('add-car-form');
        if(form) form.style.display = 'block';
        gBtnAddCar.style.display = 'none';
        
        document.getElementById('form-title').innerText = "Lisää ajoneuvo";
        document.getElementById('car-id').value = "";
        document.getElementById('car-name').value = "";
        document.getElementById('car-plate').value = "";
        document.getElementById('car-tank').value = "";
        generateCarIcons("🚗");
        window.toggleCarFields();
    });
}

if(gBtnCancelCar) {
    gBtnCancelCar.addEventListener('click', () => {
        const form = document.getElementById('add-car-form');
        if(form) form.style.display = 'none';
        if(gBtnAddCar) gBtnAddCar.style.display = 'block';
    });
}

if(gBtnSaveCar) {
    gBtnSaveCar.addEventListener('click', saveCar);
}
