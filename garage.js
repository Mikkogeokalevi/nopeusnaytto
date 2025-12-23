// =========================================================
// GARAGE.JS - AJONEUVOJEN HALLINTA JA ARKISTOINTI (v5.9 SMART MENU)
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

// 2. VALIKKOJEN PÄIVITYS (YLÄPALKKI - NYT ÄLYKÄS)
function updateCarSelect() {
    const select = document.getElementById('car-select');
    if (!select) return;
    
    // Otetaan talteen nykyinen valinta, mutta varmistetaan että se on validi
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
    optAllArchived.style.color = "#888"; 
    select.appendChild(optAllArchived);

    // Erotellaan autot
    const activeCars = userCars.filter(c => !c.isArchived);
    const archivedCars = userCars.filter(c => c.isArchived);

    // 3. Aktiiviset autot (Aina näkyvissä)
    if (activeCars.length > 0) {
        const groupActive = document.createElement('optgroup');
        groupActive.label = "Aktiiviset";
        activeCars.forEach(car => {
            const opt = document.createElement('option');
            opt.value = car.id;
            const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
            opt.text = `${icon} ${car.name}`;
            groupActive.appendChild(opt);
        });
        select.appendChild(groupActive);
    }

    // 4. Arkistoidut autot (ÄLYKÄS PIILOTUS)
    // Näytetään arkistoidut autot vain, jos:
    // A) Käyttäjä on valinnut "Kaikki (sis. arkistoidut)"
    // B) TAI Käyttäjällä on jo valittuna jokin arkistoitu auto (jotta se ei katoa alta)
    
    let showArchived = false;
    if (currentCarId === 'all_archived') {
        showArchived = true;
    } else {
        // Onko nykyinen auto arkistoitu?
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
            const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
            opt.text = `🗄️ ${icon} ${car.name}`;
            opt.style.color = "#888";
            groupArchived.appendChild(opt);
        });
        select.appendChild(groupArchived);
    }

    // Asetetaan valinta takaisin elementtiin
    // Jos targetValue ei enää löydy listalta (esim. vaihdettiin tilaa), fallback "all"
    // Mutta tässä logiikassa sen pitäisi löytyä, koska showArchived hoitaa sen.
    select.value = targetValue;
    
    // Varmistus: Jos select.value on tyhjä (selain ei löytänyt vastinetta), pakota 'all'
    if (!select.value) {
        select.value = 'all';
        currentCarId = 'all';
    }
    
    updateCarTypeVariable();
}

// Kuuntelija valinnan muutokselle
const carSelectElement = document.getElementById('car-select');
if (carSelectElement) {
    carSelectElement.addEventListener('change', (e) => {
        currentCarId = e.target.value;
        localStorage.setItem('selectedCarId', currentCarId);
        updateCarTypeVariable();
        
        // TÄRKEÄÄ: Päivitä lista heti valinnan jälkeen.
        // Tämä tekee sen "tempun": Jos valitset "Kaikki aktiiviset", arkistoidut katoavat listalta.
        // Jos valitset "Kaikki (sis. arkistoidut)", arkistoidut ilmestyvät listalle.
        updateCarSelect(); 
        
        // Päivitä näkymät
        if (typeof renderHistoryList === 'function') renderHistoryList();
        if (typeof renderStats === 'function') renderStats();
        
        // Tyhjennä reitti kartalta jos vaihdetaan autoa
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

    // Erotellaan autot
    const activeCars = userCars.filter(c => !c.isArchived);
    const archivedCars = userCars.filter(c => c.isArchived);

    // --- AKTIIVISET ---
    if (activeCars.length === 0 && archivedCars.length === 0) {
        list.innerHTML = "<div style='text-align:center; padding:20px; color:#888;'>Ei ajoneuvoja. Lisää ensimmäinen!</div>";
        return;
    }

    if (activeCars.length > 0) {
        activeCars.forEach(car => {
            renderCarCard(car, list, false);
        });
    }

    // --- ARKISTOIDUT (Asetuksissa näytetään aina kaikki, jotta niitä voi hallita) ---
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
    const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
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
    infoDiv.innerHTML = `<strong style="font-size:16px;">${icon} ${car.name}</strong><br>
                         <span style="font-size:12px; color:var(--subtext-color);">
                            ${car.plate || '-'} • ${car.fuel || '-'} • ${car.tank || 0}
                         </span>`;
    
    const btnGroup = document.createElement('div');
    btnGroup.style.display = 'flex';
    btnGroup.style.gap = '10px';

    // MUOKKAA
    const editBtn = document.createElement('button');
    editBtn.innerText = "✏️";
    editBtn.className = "icon-btn";
    editBtn.style.border = "1px solid var(--border-color)";
    editBtn.onclick = () => openEditCar(car);
    
    // ARKISTOI / PALAUTA
    const archiveBtn = document.createElement('button');
    archiveBtn.innerText = isArchived ? "♻️" : "🗄️"; // Palauta vs Arkistoi
    archiveBtn.title = isArchived ? "Palauta käyttöön" : "Arkistoi (piilota)";
    archiveBtn.className = "icon-btn";
    archiveBtn.style.border = "1px solid var(--border-color)";
    archiveBtn.onclick = () => toggleCarArchive(car.id, !isArchived);

    // POISTA (Vain jos haluaa oikeasti tuhota datan)
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
    else fields.style.display = 'block';
};

function openEditCar(car) {
    if(addCarForm) addCarForm.style.display = 'block';
    // Huom: gBtnAddCar viittaa alempana määriteltyyn muuttujaan
    if(gBtnAddCar) gBtnAddCar.style.display = 'none';
    
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
}

// --- IKONIVALITSIN ---
function generateCarIcons(selectedIcon) {
    const grid = document.getElementById('car-icon-selector');
    if(!grid) return;
    grid.innerHTML = "";
    
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
                // Jos nykyinen auto arkistoitiin, vaihda valinta "all":iin
                // Tämä triggeröi listan päivityksen ja piilottaa arkistoidut
                if (currentCarId === id && shouldArchive) {
                    currentCarId = 'all';
                    updateCarSelect();
                } else {
                    // Päivitä lista muutenkin, jotta status muuttuu
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

// --- 6. LOMAKKEEN TAPAHTUMAKUUNTELIJAT (FIX: NIMETTY UUDELLEEN) ---
// Nämä muuttujat nimetty g-alkuisiksi välttämään ristiriitaa ui.js:n kanssa
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
        generateCarIcons("🚗");
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
        
        // Säilytetään isArchived status jos muokataan olemassa olevaa
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
            plate: (type === 'car') ? document.getElementById('car-plate').value : "",
            fuel: (type === 'car') ? document.getElementById('car-fuel').value : "",
            tank: (type === 'car') ? document.getElementById('car-tank').value : ""
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
