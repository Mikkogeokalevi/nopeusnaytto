// =========================================================
// GARAGE.JS - AJONEUVOJEN HALLINTA (v5.99 Moto & Badges)
// =========================================================

// Määritellään ikonit, joita voi valita
const carIcons = [
    "🚗", "🚙", "🚕", "🏎️", "🚓", "🚑", "🚐", "🛻", 
    "🚌", "🚚", "🚜", "🛵", "🏍️", "🚲", "🛴", "🛸"
];

// --- 1. ALUSTUS ---

function initGarage() {
    // Luodaan ikonivalitsin
    const grid = document.getElementById('car-icon-selector');
    if (grid) {
        grid.innerHTML = "";
        carIcons.forEach(icon => {
            const span = document.createElement('span');
            span.className = "car-icon-option";
            span.innerText = icon;
            span.onclick = () => selectIcon(span, icon);
            grid.appendChild(span);
        });
    }

    // Kuunnellaan tallennusnappeja
    const btnSave = document.getElementById('btn-save-car');
    if (btnSave) btnSave.addEventListener('click', saveCar);

    const btnCancel = document.getElementById('btn-cancel-car');
    if (btnCancel) btnCancel.addEventListener('click', () => {
        document.getElementById('add-car-form').style.display = 'none';
        resetForm();
    });

    const btnAdd = document.getElementById('btn-add-car');
    if (btnAdd) btnAdd.addEventListener('click', () => {
        resetForm();
        document.getElementById('form-title').innerText = "Lisää ajoneuvo";
        document.getElementById('add-car-form').style.display = 'block';
        // Skrollataan alas
        document.getElementById('settings-view').scrollTop = document.getElementById('settings-view').scrollHeight;
    });
}

function selectIcon(el, icon) {
    document.querySelectorAll('.car-icon-option').forEach(e => e.classList.remove('selected'));
    el.classList.add('selected');
    document.getElementById('selected-car-icon').value = icon;
}

// --- 2. LISTAUS JA UI ---

window.renderCarList = function() {
    const list = document.getElementById('cars-list');
    if (!list) return;

    list.innerHTML = "";
    
    // Suodatetaan: näytetään aktiiviset (ja arkistoidut vain jos erikseen halutaan, tässä versiossa "Settings" näyttää kaikki eroteltuna)
    // Tässä versiossa näytämme asetuksissa KAIKKI, mutta himmennämme arkistoidut.
    
    if (userCars.length === 0) {
        list.innerHTML = "<div class='loading'>Ei ajoneuvoja. Lisää ensimmäinen!</div>";
        return;
    }

    userCars.forEach(car => {
        const div = document.createElement('div');
        div.className = "car-item";
        if (car.isArchived) div.style.opacity = "0.5";

        // Määritellään A/P/M -badge
        let typeBadge = "";
        if (car.type === 'bike') typeBadge = "<span style='font-size:10px; font-weight:bold; background:#555; color:#fff; padding:2px 5px; border-radius:4px; margin-left:5px;'>P</span>";
        else if (car.type === 'motorcycle') typeBadge = "<span style='font-size:10px; font-weight:bold; background:#ff9800; color:#000; padding:2px 5px; border-radius:4px; margin-left:5px;'>M</span>";
        else typeBadge = "<span style='font-size:10px; font-weight:bold; background:#2979ff; color:#fff; padding:2px 5px; border-radius:4px; margin-left:5px;'>A</span>";

        const archiveBtnIcon = car.isArchived ? "♻️" : "🗄️";
        const archiveTitle = car.isArchived ? "Palauta" : "Arkistoi";

        div.innerHTML = `
            <div>
                <div class="car-title">
                    ${car.icon || "🚗"} ${car.name} ${typeBadge}
                    ${car.isArchived ? "<span style='font-size:10px; color:red; margin-left:5px;'>(Arkistoitu)</span>" : ""}
                </div>
                <div class="car-details">
                    ${car.plate || "-"} • ${car.fuel || "-"}
                </div>
            </div>
            <div class="car-actions">
                <button class="icon-btn" onclick="window.editCar('${car.id}')">✏️</button>
                <button class="icon-btn" onclick="window.archiveCar('${car.id}', ${!car.isArchived})" title="${archiveTitle}">${archiveBtnIcon}</button>
            </div>
        `;
        list.appendChild(div);
    });

    updateCarSelect();
};

window.toggleCarFields = function() {
    const typeSelect = document.getElementById('car-type');
    const fields = document.getElementById('car-specific-fields');
    if (typeSelect && fields) {
        // Auto ja Moottoripyörä tarvitsevat rekisterikilven ja bensan
        if (typeSelect.value === 'car' || typeSelect.value === 'motorcycle') {
            fields.style.display = 'block';
        } else {
            // Polkupyörä ei tarvitse
            fields.style.display = 'none';
        }
    }
};

// --- 3. TOIMINNOT ---

function resetForm() {
    document.getElementById('car-id').value = "";
    document.getElementById('car-name').value = "";
    document.getElementById('car-plate').value = "";
    document.getElementById('car-tank').value = "";
    document.getElementById('car-type').value = "car";
    document.getElementById('car-fuel').value = "Bensiini";
    document.getElementById('selected-car-icon').value = "🚗";
    
    document.querySelectorAll('.car-icon-option').forEach(e => e.classList.remove('selected'));
    
    // Resetoidaan myös moottoripyörä-valinta takaisin autoon tai oletukseen
    // Lisätään MP vaihtoehto dynaamisesti jos puuttuu (varmistus)
    const typeSel = document.getElementById('car-type');
    let hasMoto = false;
    for(let i=0; i<typeSel.options.length; i++) {
        if(typeSel.options[i].value === 'motorcycle') hasMoto = true;
    }
    if(!hasMoto) {
        const opt = document.createElement('option');
        opt.value = 'motorcycle';
        opt.innerText = '🏍️ Moottoripyörä';
        typeSel.appendChild(opt);
    }
    
    window.toggleCarFields();
}

window.editCar = function(id) {
    const car = userCars.find(c => c.id === id);
    if (!car) return;

    resetForm();
    document.getElementById('form-title').innerText = "Muokkaa ajoneuvoa";
    document.getElementById('car-id').value = car.id;
    document.getElementById('car-name').value = car.name;
    document.getElementById('car-type').value = car.type || "car";
    document.getElementById('car-plate').value = car.plate || "";
    document.getElementById('car-fuel').value = car.fuel || "Bensiini";
    document.getElementById('car-tank').value = car.tankSize || "";
    document.getElementById('selected-car-icon').value = car.icon || "🚗";

    // Ikonin valinta UI:ssa
    const icons = document.querySelectorAll('.car-icon-option');
    icons.forEach(el => {
        if (el.innerText === car.icon) el.classList.add('selected');
    });

    document.getElementById('add-car-form').style.display = 'block';
    window.toggleCarFields();
    
    // Skrollataan alas
    document.getElementById('settings-view').scrollTop = document.getElementById('settings-view').scrollHeight;
};

function saveCar() {
    if (!currentUser) return;

    const id = document.getElementById('car-id').value;
    const name = document.getElementById('car-name').value;
    const type = document.getElementById('car-type').value;
    const icon = document.getElementById('selected-car-icon').value;
    
    // Haetaan kentät, mutta polkupyörälle nollataan turhat
    let plate = document.getElementById('car-plate').value;
    let fuel = document.getElementById('car-fuel').value;
    let tank = document.getElementById('car-tank').value;

    if (type === 'bike') {
        plate = "";
        fuel = "";
        tank = "";
    }

    if (!name) {
        alert("Nimi on pakollinen!");
        return;
    }

    const carData = {
        name: name,
        type: type,
        icon: icon,
        plate: plate,
        fuel: fuel,
        tankSize: tank,
        isArchived: false
    };

    if (id) {
        // Päivitys. Säilytetään arkistointitila jos se oli.
        const oldCar = userCars.find(c => c.id === id);
        if (oldCar) carData.isArchived = oldCar.isArchived;
        
        db.ref('users/' + currentUser.uid + '/cars/' + id).update(carData);
        showToast("Ajoneuvo päivitetty! 🚗");
    } else {
        // Uusi
        db.ref('users/' + currentUser.uid + '/cars').push().set(carData);
        showToast("Ajoneuvo lisätty! 🚙");
    }

    document.getElementById('add-car-form').style.display = 'none';
}

window.archiveCar = function(id, archiveStatus) {
    if (!currentUser) return;
    if (confirm(archiveStatus ? "Arkistoidaanko ajoneuvo? Se ei näy enää valinnoissa." : "Palautetaanko ajoneuvo käyttöön?")) {
        db.ref('users/' + currentUser.uid + '/cars/' + id).update({ isArchived: archiveStatus });
        
        // Jos nykyinen auto arkistoidaan, vaihdetaan valinta "kaikkiin"
        if (archiveStatus && currentCarId === id) {
            currentCarId = 'all';
            currentCarType = 'car';
            localStorage.setItem('selectedCarId', 'all');
            updateCarSelect();
        }
    }
};

// --- 4. VALINTALISTA (YLÄPALKKI) ---

window.updateCarSelect = function() {
    const select = document.getElementById('car-select');
    if (!select) return;

    // Tyhjennetään (paitsi ensimmäiset kiinteät optiot jos halutaan, mutta rakennetaan nyt kokonaan uusiksi)
    select.innerHTML = "";

    // 1. Kaikki aktiiviset
    let optAll = document.createElement('option');
    optAll.value = "all";
    optAll.text = "Kaikki aktiiviset";
    select.appendChild(optAll);

    // 2. Kaikki (sis arkistoidut) - Historiaa varten
    let optAllArch = document.createElement('option');
    optAllArch.value = "all_archived";
    optAllArch.text = "Kaikki (sis. arkistoidut)";
    select.appendChild(optAllArch);

    // 3. Erotin
    let optGroup = document.createElement('optgroup');
    optGroup.label = "Aktiiviset";

    userCars.forEach(car => {
        if (!car.isArchived) {
            const opt = document.createElement('option');
            opt.value = car.id;
            opt.text = `${car.icon} ${car.name}`;
            optGroup.appendChild(opt);
        }
    });
    select.appendChild(optGroup);

    // Valitaan nykyinen
    select.value = currentCarId;
    
    // Päivitetään globaalit
    if (currentCarId !== 'all' && currentCarId !== 'all_archived') {
        const car = userCars.find(c => c.id === currentCarId);
        if (car) {
            currentCarType = car.type || 'car';
        }
    } else {
        currentCarType = 'car'; // Oletus "kaikki" tilassa
    }
};

// Kuunnellaan valintaa
const carSelectEl = document.getElementById('car-select');
if (carSelectEl) {
    carSelectEl.addEventListener('change', (e) => {
        currentCarId = e.target.value;
        localStorage.setItem('selectedCarId', currentCarId);
        
        if (currentCarId !== 'all' && currentCarId !== 'all_archived') {
            const car = userCars.find(c => c.id === currentCarId);
            if (car) {
                currentCarType = car.type || 'car';
                showToast(`Valittu: ${car.name} (${car.type === 'motorcycle' ? 'Moottoripyörä' : (car.type === 'bike' ? 'Polkupyörä' : 'Auto')})`);
            }
        } else {
            currentCarType = 'car';
        }

        // Jos ollaan historiassa tai tilastoissa, päivitetään näkymä
        if (typeof renderHistoryList === 'function' && document.getElementById('history-view').style.display !== 'none') {
            renderHistoryList();
        }
        if (typeof renderStats === 'function' && document.getElementById('stats-view').style.display !== 'none') {
            renderStats();
        }
    });
}
