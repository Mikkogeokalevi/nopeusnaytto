// =========================================================
// AUTH.JS - KIRJAUTUMINEN JA KÄYTTÄJÄHALLINTA (REFACTORED v6.1)
// =========================================================

// Kuunnellaan Firebase-kirjautumistilan muutoksia
auth.onAuthStateChanged((user) => {
    // 1. Piilotetaan Splash Screen (Latausruutu)
    // Elementti on määritelty ui.js:ssä
    if (typeof splashScreen !== 'undefined' && splashScreen) {
        setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);
    }

    if (user) {
        // --- KÄYTTÄJÄ ON KIRJAUTUNUT ---
        currentUser = user; // Asetetaan globaali muuttuja (globals.js)
        
        // Vaihdetaan näkymä sovellukseen
        if(typeof loginView !== 'undefined' && loginView) loginView.style.display = 'none';
        if(typeof appContainer !== 'undefined' && appContainer) appContainer.style.display = 'flex';
        
        // Päivitetään valikon profiilitiedot
        if(typeof menuUserName !== 'undefined' && menuUserName) menuUserName.innerText = user.displayName || user.email;
        if(typeof menuUserAvatar !== 'undefined' && menuUserAvatar) {
            menuUserAvatar.src = user.photoURL ? user.photoURL : "ajopaivakirja_logo.png";
        }

        // --- DATAN LATAUS ---
        // Ladataan käyttäjän autot ja ajohistoria heti kirjautumisen jälkeen.
        // Huom: loadRefuelings on poistettu, koska loadHistory hoitaa nyt myös tankkaukset.
        if(typeof loadCars === 'function') loadCars(); 
        if(typeof loadHistory === 'function') loadHistory(); 

        // Korjataan kartan koko jos se on piilossa lataushetkellä (Leaflet fix)
        if (typeof map !== 'undefined' && map && views.map && views.map.style.display !== 'none') {
            setTimeout(() => map.invalidateSize(), 200);
        }
        
    } else {
        // --- KÄYTTÄJÄ EI OLE KIRJAUTUNUT ---
        currentUser = null;
        if(typeof appContainer !== 'undefined' && appContainer) appContainer.style.display = 'none';
        if(typeof loginView !== 'undefined' && loginView) loginView.style.display = 'flex';
    }
});

// --- 2. KIRJAUTUMISPAINIKKEET ---

const btnLoginGoogle = document.getElementById('btn-login');
if(btnLoginGoogle) {
    btnLoginGoogle.addEventListener('click', () => {
        auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
            .catch(e => alert("Virhe: " + e.message));
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
            .catch(e => alert("Kirjautumisvirhe: " + e.message));
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
            .catch(e => alert("Rekisteröintivirhe: " + e.message));
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

// Apunappi kirjautumisruudussa
const btnLoginHelp = document.getElementById('btn-login-help');
if(btnLoginHelp) {
    btnLoginHelp.addEventListener('click', () => {
        // Näytetään ohjenäkymä väliaikaisesti kirjautumisruudun päällä
        if(loginView) loginView.style.display = 'none';
        if(appContainer) appContainer.style.display = 'flex';
        
        if(typeof switchView === 'function') switchView('help');
        
        // Piilotetaan sovelluksen kontrollit ohjeiden ajaksi
        const controls = document.querySelector('.controls-container');
        if(controls) controls.style.display = 'none';
        
        // Lisätään "Takaisin" -nappi dynaamisesti ohjesivulle
        const helpView = document.getElementById('help-view');
        if (helpView) {
            // Poistetaan vanha nappi jos on
            const oldBtn = document.getElementById('temp-back-btn');
            if(oldBtn) oldBtn.remove();

            const backBtn = document.createElement('button');
            backBtn.id = 'temp-back-btn';
            backBtn.innerText = "← Takaisin kirjautumiseen";
            backBtn.className = 'action-btn blue-btn';
            backBtn.style.marginTop = "20px";
            backBtn.style.marginBottom = "20px";
            backBtn.onclick = () => location.reload(); // Yksinkertaisin tapa palata tilaan
            
            helpView.prepend(backBtn);
        }
    });
}
