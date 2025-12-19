// =========================================================
// GARAGE.JS - AJONEUVOJEN HALLINTA (AUTOTALLI)
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
        
        // Päivitä historia ja tilastot jos autojen tiedot (ikonit/nimet) muuttuvat
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

// 2. LOGIIKKA JA VALINNAT

function updateCarTypeVariable() {
    const c = userCars.find(x => x.id === currentCarId);
    if (c) {
        currentCarType = c.type || "car";
    } else {
        currentCarType = "car";
    }
}

function updateCarSelect() {
    if(!carSelectEl) return;
    
    carSelectEl.innerHTML = "";
    
    // "Kaikki" -valinta
    const allOpt = document.createElement('option'); 
    allOpt.value = 'all'; 
    allOpt.text = "Kaikki ajoneuvot"; 
    carSelectEl.appendChild(allOpt);
    
    // Käyttäjän autot
    userCars.forEach(car => {
        const opt = document.createElement('option'); 
        opt.value = car.id;
        const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
        opt.text = `${icon} ${car.name}`;
        if(car.id === currentCarId) opt.selected = true;
        carSelectEl.appendChild(opt);
    });
}

// Kuuntele valinnan muutosta
if(carSelectEl) {
    carSelectEl.addEventListener('change', () => {
        currentCarId = carSelectEl.value;
        localStorage.setItem('selectedCarId', currentCarId);
        updateCarTypeVariable();
        
        // Päivitä historialista suodatuksen mukaan
        if (views.history && views.history.style.display !== 'none' && typeof renderHistoryList === 'function') {
            renderHistoryList();
        }
    });
}

// 3. IKONIEN HALLINTA
const carIconsList = [
    "🚗", "🚙", "🛻", "🚌", "🏎️", "🚕", "🚓", "🚑", "🚒", "🚐", "🚚", "🚜", "🏍️", "🛵", "🚲", "🛴", 
    "🚘", "🚔", "🚖", "🚍", "🦽", "🦼", "🛹", "🛶", "🚤", "🛳️"
];

function generateCarIcons() {
    const grid = document.getElementById('car-icon-selector');
    if(!grid) return;
    
    grid.innerHTML = "";
    carIconsList.forEach(icon => {
        const div = document.createElement('div');
        div.className = 'car-icon-option';
        div.innerText = icon;
        div.onclick = () => selectIcon(div, icon);
        grid.appendChild(div);
    });
}

function selectIcon(element, icon) {
    document.querySelectorAll('.car-icon-option').forEach(el => el.classList.remove('selected-icon'));
    element.classList.add('selected-icon');
    const input = document.getElementById('selected-car-icon');
    if(input) input.value = icon;
}

// 4. CRUD TOIMINNOT (Create, Read, Update, Delete)

function renderCarList() {
    const list = document.getElementById('cars-list');
    if(!list) return;
    
    list.innerHTML = "";
    
    if (userCars.length === 0) {
        list.innerHTML = "<p>Ei ajoneuvoja. Lisää ensimmäinen!</p>";
        return;
    }
    
    userCars.forEach(car => {
        const icon = car.icon || (car.type === 'bike' ? "🚲" : "🚗");
        const div = document.createElement('div'); div.className = 'car-item';
        div.innerHTML = `<div><div class="car-title">${icon} ${car.name}</div><div class="car-details">${car.plate || ''} ${car.fuel || ''}</div></div>
        <div class="car-actions">
            <button class="edit-btn" onclick="window.editCar('${car.id}')">✏️</button>
            <button class="delete-btn" onclick="window.deleteCar('${car.id}')">🗑</button>
        </div>`;
        list.appendChild(div);
    });
}

// Globaalit funktiot (kutsutaan HTML onclick -atribuutista)
window.editCar = (id) => {
    const car = userCars.find(c => c.id === id);
    if(!car) return;
    
    // Täytä lomake
    document.getElementById('car-id').value = car.id;
    document.getElementById('car-name').value = car.name;
    document.getElementById('car-type').value = car.type;
    
    const icon = car.icon || "🚗";
    const iconInput = document.getElementById('selected-car-icon');
    if(iconInput) iconInput.value = icon;
    
    // Korosta valittu ikoni
    document.querySelectorAll('.car-icon-option').forEach(el => el.classList.remove('selected-icon'));
    const options = document.querySelectorAll('.car-icon-option');
    options.forEach(opt => {
        if(opt.innerText === icon) opt.classList.add('selected-icon');
    });

    toggleCarFields();
    
    if(car.type === 'car') {
        document.getElementById('car-plate').value = car.plate || '';
        document.getElementById('car-fuel').value = car.fuel || 'Bensiini';
        document.getElementById('car-tank').value = car.tank || '';
    }
    
    document.getElementById('form-title').innerText = "Muokkaa ajoneuvoa";
    if(addCarForm) addCarForm.style.display = 'block';
    if(btnAddCar) btnAddCar.style.display = 'none';
}

window.deleteCar = (id) => {
    if(confirm("Poista ajoneuvo?")) db.ref('users/' + currentUser.uid + '/cars/' + id).remove();
};

window.toggleCarFields = () => {
    if(!carTypeSelect || !carSpecificFields) return;
    if (carTypeSelect.value === 'bike') {
        carSpecificFields.style.display = 'none';
    } else {
        carSpecificFields.style.display = 'block';
    }
};

// Lomakkeen napit
if(btnAddCar) {
    btnAddCar.addEventListener('click', () => {
        document.getElementById('car-id').value = '';
        document.getElementById('car-name').value = '';
        document.getElementById('car-plate').value = '';
        document.getElementById('car-tank').value = '';
        document.getElementById('selected-car-icon').value = '🚗';
        document.getElementById('form-title').innerText = "Lisää ajoneuvo";
        
        document.querySelectorAll('.car-icon-option').forEach(el => el.classList.remove('selected-icon'));
        
        if(addCarForm) addCarForm.style.display = 'block';
        if(btnAddCar) btnAddCar.style.display = 'none';
        if(carTypeSelect) carTypeSelect.value = 'car';
        toggleCarFields();
    });
}

if(btnCancelCar) {
    btnCancelCar.addEventListener('click', () => {
        if(addCarForm) addCarForm.style.display = 'none';
        if(btnAddCar) btnAddCar.style.display = 'block';
    });
}

if(btnSaveCar) {
    btnSaveCar.addEventListener('click', () => {
        const name = document.getElementById('car-name').value;
        if (!name) { alert("Anna ajoneuvolle nimi!"); return; }
        
        const type = carTypeSelect.value;
        const id = document.getElementById('car-id').value;
        const icon = document.getElementById('selected-car-icon').value;
        
        const carData = {
            name: name,
            type: type,
            icon: icon,
            plate: (type === 'car') ? document.getElementById('car-plate').value : "",
            fuel: (type === 'car') ? document.getElementById('car-fuel').value : "",
            tank: (type === 'car') ? document.getElementById('car-tank').value : ""
        };
        
        if (id) {
            db.ref('users/' + currentUser.uid + '/cars/' + id).update(carData)
                .then(() => {
                    if(addCarForm) addCarForm.style.display = 'none';
                    if(btnAddCar) btnAddCar.style.display = 'block';
                });
        } else {
            db.ref('users/' + currentUser.uid + '/cars').push().set(carData)
                .then(() => {
                    if(addCarForm) addCarForm.style.display = 'none';
                    if(btnAddCar) btnAddCar.style.display = 'block';
                });
        }
    });
}
