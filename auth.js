// =========================================================
// AUTH.JS - KIRJAUTUMINEN JA KÄYTTÄJÄHALLINTA
// =========================================================

// Kuunnellaan kirjautumistilan muutoksia
auth.onAuthStateChanged((user) => {
    // Piilotetaan latausruutu viiveellä
    if (typeof splashScreen !== 'undefined' && splashScreen) {
        setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);
    }

    if (user) {
        // --- KÄYTTÄJÄ ON KIRJAUTUNUT ---
        currentUser = user; // Asetetaan globaali muuttuja
        
        if(typeof loginView !== 'undefined' && loginView) loginView.style.display = 'none';
        if(typeof appContainer !== 'undefined' && appContainer) appContainer.style.display = 'flex';
        
        // Päivitetään valikon tiedot
        if(typeof menuUserName !== 'undefined' && menuUserName) menuUserName.innerText = user.displayName || user.email;
        if (typeof menuUserAvatar !== 'undefined' && menuUserAvatar) {
            menuUserAvatar.src = user.photoURL ? user.photoURL : "ajopaivakirja_logo.png";
        }

        // TÄRKEÄ KORJAUS: Pakotetaan mittaristo näkyviin heti latauksessa
        if(typeof switchView === 'function') switchView('dashboard');

        // TÄRKEÄÄ: Ladataan tiedot heti kun kirjaudutaan sisään
        // Tarkistetaan onko funktiot ladattu ennen kutsua
        if(typeof loadCars === 'function') loadCars(); 
        if(typeof loadHistory === 'function') loadHistory(); 
        if(typeof generateCarIcons === 'function') generateCarIcons(); 
        
        // Ladataan tankkaukset (UI päivitys hoituu history.js kautta)
        // if(typeof loadRefuelings === 'function') loadRefuelings(); // Tämä on yhdistetty loadHistoryyn

        // Korjataan kartan koko jos se on piilossa lataushetkellä
        if (typeof views !== 'undefined' && views.map && views.map.style.display !== 'none' && typeof map !== 'undefined' && map) {
            setTimeout(() => map.invalidateSize(), 200);
        }
    } else {
        // --- KÄYTTÄJÄ EI OLE KIRJAUTUNUT ---
        currentUser = null;
        if (typeof appContainer !== 'undefined' && appContainer) appContainer.style.display = 'none';
        if (typeof loginView !== 'undefined' && loginView) loginView.style.display = 'flex';
    }
});

// Kirjautumispainikkeiden toiminnot
const btnLoginGoogle = document.getElementById('btn-login');
if(btnLoginGoogle) {
    btnLoginGoogle.addEventListener('click', () => {
        auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .catch(e => alert(e.message));
    });
}

const btnLoginEmail = document.getElementById('btn-email-login');
if(btnLoginEmail) {
    btnLoginEmail.addEventListener('click', () => {
        const email = document.getElementById('email-input').value;
        const pass = document.getElementById('password-input').value;
        if(!email || !pass) { 
            alert("Syötä sähköposti ja salasana."); 
            return; 
        }
        auth.signInWithEmailAndPassword(email, pass)
            .catch(e => alert("Virhe kirjautumisessa: " + e.message));
    });
}

const btnRegisterEmail = document.getElementById('btn-email-register');
if(btnRegisterEmail) {
    btnRegisterEmail.addEventListener('click', () => {
        const email = document.getElementById('email-input').value;
        const pass = document.getElementById('password-input').value;
        if(!email || !pass) { 
            alert("Syötä sähköposti ja salasana."); 
            return; 
        }
        auth.createUserWithEmailAndPassword(email, pass)
            .catch(e => alert("Virhe rekisteröinnissä: " + e.message));
    });
}

const btnLogout = document.getElementById('btn-logout');
if(btnLogout) {
    btnLogout.addEventListener('click', () => {
        if(typeof openConfirmModal === 'function') {
            openConfirmModal("Kirjaudu ulos", "Haluatko varmasti kirjautua ulos?", () => {
                auth.signOut().then(() => location.reload());
            });
        } else {
            if(confirm("Haluatko varmasti kirjautua ulos?")) {
                auth.signOut().then(() => location.reload());
            }
        }
    });
}

const btnLoginHelp = document.getElementById('btn-login-help');
if(btnLoginHelp) {
    btnLoginHelp.addEventListener('click', () => {
        if(loginView) loginView.style.display = 'none';
        if(appContainer) appContainer.style.display = 'flex';
        if(typeof switchView === 'function') switchView('help');
        
        const controls = document.querySelector('.controls-container');
        if(controls) controls.style.display = 'none';
        
        // Lisää takaisin-nappi dynaamisesti
        const helpView = document.getElementById('help-view');
        if (helpView) {
            // Poista vanha jos on
            const oldBtn = document.getElementById('temp-back-btn');
            if(oldBtn) oldBtn.remove();

            const backBtn = document.createElement('button');
            backBtn.id = 'temp-back-btn';
            backBtn.innerText = "← Takaisin kirjautumiseen";
            backBtn.className = 'action-btn blue-btn';
            backBtn.style.marginTop = "20px";
            backBtn.onclick = () => location.reload();
            
            helpView.prepend(backBtn);
        }
    });
}
