// =========================================================
// GARAGE.JS - AJONEUVOJEN HALLINTA JA ARKISTOINTI (v5.99 MOTO & BADGES)
// =========================================================

// 1. AJONEUVOJEN LATAUS
function loadCars() {
    if(!currentUser) return;
    
    const carsRef = db.ref('users/' + currentUser.uid + '/cars');
    carsRef.on('value', (snapshot) => {
        userCars = []; // Tyhjennä globaali lista
        if (snapshot.exists()) {
            snapshot.forEach(child => {
                userCars.push({ id: child.key, ...child.val() });
            });
        }
        
        // Päivitä valikot
        updateCarSelect(); 
        
        // Päivitä settings-näkymän lista jos se on auki
        if (views.settings && views.settings.style.display !== 'none') {
            renderCarList(); 
        }
        
        // Päivitä historia ja tilastot jos autojen tiedot muuttuvat
        if (views.history && views.history.style.display !== 'none' && typeof renderHistoryList === 'function') {
            renderHistoryList();
        }
        if (views.stats && views.stats.style.display !== 'none' && typeof renderStats === 'function') {
            renderStats();
        }
    });
    
    // Palauta viimeksi valittu auto muistista
    const stored = localStorage.getItem('selectedCarId');
    if (stored) {
        currentCarId = stored;
        updateCarTypeVariable();
    }
}

// 2. VALIKKOJEN PÄIVITYS (YLÄPALKKI - NYT [A/M/P] MERKINNÖILLÄ)
function updateCarSelect() {
    const select = document.getElementById('car-select');
    if (!select) return;
    
    // Otetaan talteen nykyinen valinta
    let targetValue = currentCarId; 
    
    select.innerHTML = "";

    // 1. "Kaikki aktiiviset" (Oletus)
    const optAllActive = document.createElement('option');
    optAllActive.value = "all";
    optAllActive.text = "Kaikki aktiiviset";
    select.appendChild(optAllActive);

    // 2. "Kaikki (sis. arkistoidut)" (Portti arkistoon)
    const optAllArchived = document.createElement('option');
    optAllArchived.value = "all_archived";
    optAllArchived.text = "Kaikki (sis. arkistoidut)";
    // Huom: Värit eivät toimi kaikissa mobiiliselaimissa select-optioissa, mutta yritetään
    optAllArchived.style.color = "#888"; 
    select.appendChild(optAllArchived);

    // Erotellaan autot
    const activeCars = userCars.filter(c => !c.isArchived);
    const archivedCars = userCars.filter(c => c.isArchived);

    // 3. Aktiiviset autot
    if (activeCars.length > 0) {
        const groupActive = document.createElement('optgroup');
        groupActive.label = "Aktiiviset";
        activeCars.forEach(car => {
            const opt = document.createElement('option');
            opt.value = car.id;
            
            // Ikonin määritys
            let defaultIcon = "🚗";
            if (car.type === 'bike') defaultIcon = "🚲";
            if (car.type === 'motorcycle') defaultIcon = "🏍️";
            const icon = car.icon || defaultIcon;

            // Tyyppikirjain (Koska HTML-select ei tue värejä/tyylejä tekstin seassa)
            let typeMark = " [A]"; 
            if (car.type === 'bike') typeMark = " [P]";
            else if (car.type === 'motorcycle') typeMark = " [M]";

            opt.text = `${icon} ${car.name}${typeMark}`;
            groupActive.appendChild(opt);
        });
        select.appendChild(groupActive);
    }

    // 4. Arkistoidut autot
    let showArchived = false;
    if (currentCarId === 'all_archived') {
        showArchived = true;
    } else {
        const currentCarObj = userCars.find(c => c.id === currentCarId);
        if (currentCarObj && currentCarObj.isArchived) {
            showArchived = true;
        }
    }

    if (showArchived && archivedCars.length > 0) {
        const groupArchived = document.createElement('optgroup');
        groupArchived.label = "Arkistoidut";
        archivedCars.forEach(car => {
            const opt = document.createElement('option');
            opt.value = car.id;
            
            let defaultIcon = "🚗";
            if (car.type === 'bike') defaultIcon = "🚲";
            if (car.type === 'motorcycle') defaultIcon = "🏍️";
            const icon = car.icon || defaultIcon;

            let typeMark = " [A]"; 
            if (car.type === 'bike') typeMark = " [P]";
            else if (car.type === 'motorcycle') typeMark = " [M]";

            opt.text = `🗄️ ${icon} ${car.name}${typeMark}`;
            opt.style.color = "#888";
            groupArchived.appendChild(opt);
        });
        select.appendChild(groupArchived);
    }

    select.value = targetValue;
    
    if (!select.value) {
        select.value = 'all';
        currentCarId = 'all';
    }
    
    updateCarTypeVariable();
}

const carSelectElement = document.getElementById('car-select');
if (carSelectElement) {
    carSelectElement.addEventListener('change', (e) => {
        currentCarId = e.target.value;
        localStorage.setItem('selectedCarId', currentCarId);
        updateCarTypeVariable();
        updateCarSelect(); 
        
        if (typeof renderHistoryList === 'function') renderHistoryList();
        if (typeof renderStats === 'function') renderStats();
        if (typeof clearSavedRoute === 'function') clearSavedRoute();
    });
}

function updateCarTypeVariable() {
    if (currentCarId === 'all' || currentCarId === 'all_archived') {
        currentCarType = 'car'; // Oletus
    } else {
        const c = userCars.find(x => x.id === currentCarId);
        if (c) currentCarType = c.type;
    }
}

// 3. ASETUSNÄKYMÄN LISTAUS (SETTINGS)
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

    if (activeCars.length > 0) {
        activeCars.forEach(car => {
            renderCarCard(car, list, false);
        });
    }

    if (archivedCars.length > 0) {
        const sep = document.createElement('div');
        sep.innerHTML = "<h4 style='color:var(--subtext-color); margin: 20px 0 10px 0; text-align:center; text-transform:uppercase; font-size:12px; letter-spacing:1px;'>Arkisto</h4>";
        list.appendChild(sep);

        archivedCars.forEach(car => {
            renderCarCard(car, list, true);
        });
    }
}

function renderCarCard(car, container, isArchived) {
    let defaultIcon = "🚗";
    if (car.type === 'bike') defaultIcon = "🚲";
    if (car.type === 'motorcycle') defaultIcon = "🏍️";
    
    const icon = car.icon || defaultIcon;
    
    // Määritellään Badge (A/P/M) - Täällä voimme käyttää HTML-värejä
    let typeBadge = "";
    if (car.type === 'bike') typeBadge = "<span style='font-size:10px; font-weight:bold; background:#555; color:#fff; padding:2px 6px; border-radius:4px; margin-left:8px;'>P</span>";
    else if (car.type === 'motorcycle') typeBadge = "<span style='font-size:10px; font-weight:bold; background:#ff9800; color:#000; padding:2px 6px; border-radius:4px; margin-left:8px;'>M</span>";
    else typeBadge = "<span style='font-size:10px; font-weight:bold; background:#2979ff; color:#fff; padding:2px 6px; border-radius:4px; margin-left:8px;'>A</span>";

    const div = document.createElement('div');
    div.className = 'car-item';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.alignItems = 'center';
    div.style.padding = '15px';
    div.style.marginBottom = '10px';
    div.style.backgroundColor = 'var(--panel-bg)';
    div.style.border = '1px solid var(--border-color)';
    div.style.borderRadius = '8px';
    if (isArchived) div.style.opacity = '0.6';

    const infoDiv = document.createElement('div');
    infoDiv.innerHTML = `<strong style="font-size:16px;">${icon} ${car.name} ${typeBadge}</strong><br>
                         <span style="font-size:12px; color:var(--subtext-color);">
                            ${car.plate || '-'} • ${car.fuel || '-'} • ${car.tank || 0} L
                         </span>`;
    
    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '10px';

    const editBtn = document.createElement('button');
    editBtn.innerText = "✏️";
    editBtn.className = "icon-btn";
    editBtn.style.border = "1px solid var(--border-color)";
    editBtn.onclick = () => openEditCar(car);
    
    const archiveBtn = document.createElement('button');
    archiveBtn.innerText = isArchived ? "♻️" : "🗄️"; 
    archiveBtn.title = isArchived ? "Palauta käyttöön" : "Arkistoi (piilota)";
    archiveBtn.className = "icon-btn";
    archiveBtn.style.border = "1px solid var(--border-color)";
    archiveBtn.onclick = () => toggleCarArchive(car.id, !isArchived);

    const delBtn = document.createElement('button');
    delBtn.innerText = "🗑";
    delBtn.className = "icon-btn";
    delBtn.style.color = "#ff4444";
    delBtn.style.borderColor = "#ff4444";
    delBtn.onclick = () => deleteCar(car.id);

    btnGroup.appendChild(archiveBtn);
    btnGroup.appendChild(editBtn);
    btnGroup.appendChild(delBtn);
    
    div.appendChild(infoDiv);
    div.appendChild(btnGroup);
    container.appendChild(div);
}

// 4. MUOKKAUS JA TALLENNUS
window.toggleCarFields = () => {
    const type = document.getElementById('car-type').value;
    const fields = document.getElementById('car-specific-fields');
    if (type === 'bike') fields.style.display = 'none';
    else fields.style.display = 'block'; // Auto ja Moottoripyörä
};

function openEditCar(car) {
    if(addCarForm) addCarForm.style.display = 'block';
    if(gBtnAddCar) gBtnAddCar.style.display = 'none';
    
    document.getElementById('form-title').innerText = "Muokkaa ajoneuvoa";
    document.getElementById('car-id').value = car.id;
    document.getElementById('car-name').value = car.name;
    document.getElementById('car-type').value = car.type || 'car';
    document.getElementById('selected-car-icon').value = car.icon || "🚗";
    
    // Varmistetaan että MP on valittavissa
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
    typeSel.value = car.type || 'car'; // Aseta arvo uudelleen

    window.toggleCarFields();
    
    if (car.type !== 'bike') {
        document.getElementById('car-plate').value = car.plate || "";
        document.getElementById('car-fuel').value = car.fuel || "Bensiini";
        document.getElementById('car-tank').value = car.tank || "";
    }
    
    generateCarIcons(car.icon); 
}

// --- IKONIVALITSIN ---
function generateCarIcons(selectedIcon) {
    const grid = document.getElementById('car-icon-selector');
    if(!grid) return;
    grid.innerHTML = "";
    
    // Lisätty moottoripyörä-ikonit
    const icons = ["🚗","🚙","🏎️","🚕","🚓","🚌","🚐","🛻","🚚","🚜","🚲","🛵","🏍️","🛴"];
    
    icons.forEach(icon => {
        const div = document.createElement('div');
        div.innerText = icon;
        div.className = 'car-icon-item';
        if (icon === selectedIcon) div.classList.add('selected');
        
        div.onclick = () => {
            document.querySelectorAll('.car-icon-item').forEach(el => el.classList.remove('selected'));
            div.classList.add('selected');
            document.getElementById('selected-car-icon').value = icon;
        };
        grid.appendChild(div);
    });
}

// 5. NAPPIEN LOGIIKKA
function toggleCarArchive(id, shouldArchive) {
    if (!currentUser) return;
    const action = shouldArchive ? "arkistoida" : "palauttaa";
    if (confirm(`Haluatko varmasti ${action} tämän ajoneuvon?`)) {
        db.ref('users/' + currentUser.uid + '/cars/' + id).update({ isArchived: shouldArchive })
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
    if (confirm("VAROITUS: Tämä poistaa auton pysyvästi. Haluatko mieluummin arkistoida sen? \n\nOK = Poista pysyvästi\nCancel = Peruuta")) {
        db.ref('users/' + currentUser.uid + '/cars/' + id).remove();
    }
}

// --- 6. LOMAKKEEN TAPAHTUMAKUUNTELIJAT ---
const gBtnAddCar = document.getElementById('btn-add-car');
const gBtnCancelCar = document.getElementById('btn-cancel-car');
const gBtnSaveCar = document.getElementById('btn-save-car');

if(gBtnAddCar) {
    gBtnAddCar.addEventListener('click', () => {
        if(addCarForm) addCarForm.style.display = 'block';
        if(gBtnAddCar) gBtnAddCar.style.display = 'none';
        document.getElementById('form-title').innerText = "Lisää ajoneuvo";
        document.getElementById('car-id').value = "";
        document.getElementById('car-name').value = "";
        document.getElementById('car-plate').value = "";
        document.getElementById('car-tank').value = "";
        
        // Varmistetaan MP-optio lisäyksessäkin
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
        
        generateCarIcons("🚗");
        window.toggleCarFields();
    });
}

if(gBtnCancelCar) {
    gBtnCancelCar.addEventListener('click', () => {
        if(addCarForm) addCarForm.style.display = 'none';
        if(gBtnAddCar) gBtnAddCar.style.display = 'block';
    });
}

if(gBtnSaveCar) {
    gBtnSaveCar.addEventListener('click', () => {
        const name = document.getElementById('car-name').value;
        if (!name) { alert("Anna ajoneuvolle nimi!"); return; }
        
        const type = carTypeSelect.value;
        const id = document.getElementById('car-id').value;
        const icon = document.getElementById('selected-car-icon').value;
        
        let isArchived = false;
        if (id) {
            const existing = userCars.find(c => c.id === id);
            if(existing) isArchived = existing.isArchived || false;
        }

        const carData = {
            name: name,
            type: type,
            icon: icon,
            isArchived: isArchived,
            plate: (type !== 'bike') ? document.getElementById('car-plate').value : "",
            fuel: (type !== 'bike') ? document.getElementById('car-fuel').value : "",
            tank: (type !== 'bike') ? document.getElementById('car-tank').value : ""
        };
        
        if (id) {
            db.ref('users/' + currentUser.uid + '/cars/' + id).update(carData)
                .then(() => {
                    if(addCarForm) addCarForm.style.display = 'none';
                    if(gBtnAddCar) gBtnAddCar.style.display = 'block';
                    if(typeof showToast === 'function') showToast("Tiedot tallennettu! ✅");
                });
        } else {
            db.ref('users/' + currentUser.uid + '/cars').push().set(carData)
                .then(() => {
                    if(addCarForm) addCarForm.style.display = 'none';
                    if(gBtnAddCar) gBtnAddCar.style.display = 'block';
                    if(typeof showToast === 'function') showToast("Ajoneuvo lisätty! 🚗");
                });
        }
    });
}
