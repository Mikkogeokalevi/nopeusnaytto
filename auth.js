// =========================================================
// AUTH.JS - KIRJAUTUMINEN JA KÄYTTÄJÄHALLINTA (Auto-Help)
// =========================================================

// Kuunnellaan kirjautumistilan muutoksia
auth.onAuthStateChanged((user) => {
    // Piilotetaan latausruutu viiveellä
    if (splashScreen) {
        setTimeout(() => { splashScreen.style.display = 'none'; }, 1000);
    }

    if (user) {
        // --- KÄYTTÄJÄ ON KIRJAUTUNUT ---
        currentUser = user; // Asetetaan globaali muuttuja
        
        loginView.style.display = 'none';
        appContainer.style.display = 'flex';
        
        // Päivitetään valikon tiedot
        if(menuUserName) menuUserName.innerText = user.displayName || user.email;
        if (menuUserAvatar) {
            menuUserAvatar.src = user.photoURL ? user.photoURL : "ajopaivakirja_logo.png";
        }

        // TÄRKEÄÄ: Ladataan tiedot heti kun kirjaudutaan sisään
        if(typeof loadCars === 'function') loadCars(); 
        if(typeof loadHistory === 'function') loadHistory(); 
        if(typeof generateCarIcons === 'function') generateCarIcons(); 
        
        // --- ENSIMMÄISEN KÄYNNISTYKSEN LOGIIKKA (UUSI) ---
        // Tarkistetaan, onko käyttäjä nähnyt ohjeet tässä versiossa
        const hasSeenIntro = localStorage.getItem('intro_seen_v6');
        
        if (!hasSeenIntro) {
            // Jos ei ole nähnyt -> Pakota ohjenäkymään
            setTimeout(() => {
                if(typeof switchView === 'function') switchView('help');
                if(typeof showToast === 'function') showToast("Tervetuloa! Lue tästä asennusohjeet. 📲");
            }, 500); // Pieni viive varmistaa että UI on valmis
            
            // Merkitään nähdyksi, ettei kiusata joka kerta
            localStorage.setItem('intro_seen_v6', 'true');
        } else {
            // Jos on nähnyt -> Varmistetaan että ollaan mittaristossa (oletus)
            // (UI.js hoitaa tämän yleensä, mutta varmistus ei haittaa)
        }
        // ----------------------------------------------------

        // Korjataan kartan koko jos se on "piilossa" latauksen aikana
        setTimeout(() => { if(typeof map !== 'undefined' && map) map.invalidateSize(); }, 500);

    } else {
        // --- KÄYTTÄJÄ EI OLE KIRJAUTUNUT ---
        currentUser = null;
        loginView.style.display = 'flex';
        appContainer.style.display = 'none';
        // Tyhjennetään tiedot
        userCars = [];
        allHistoryData = [];
    }
});

// LOGIN NAPIT
const btnLogin = document.getElementById('btn-login');
if (btnLogin) {
    btnLogin.addEventListener('click', () => {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch((error) => {
            alert("Virhe kirjautumisessa: " + error.message);
        });
    });
}

// SÄHKÖPOSTIKIRJAUTUMINEN
const btnEmailLogin = document.getElementById('btn-email-login');
const btnEmailRegister = document.getElementById('btn-email-register');

if (btnEmailLogin) {
    btnEmailLogin.addEventListener('click', () => {
        const email = document.getElementById('email-input').value;
        const pass = document.getElementById('password-input').value;
        if(!email || !pass) { 
            alert("Syötä sähköposti ja salasana."); 
            return; 
        }
        auth.signInWithEmailAndPassword(email, pass)
            .catch(e => alert("Virhe: " + e.message));
    });
}

if (btnEmailRegister) {
    btnEmailRegister.addEventListener('click', () => {
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
        if(confirm("Haluatko varmasti kirjautua ulos?")) {
            auth.signOut().then(() => location.reload());
        }
    });
}

const btnLoginHelp = document.getElementById('btn-login-help');
if(btnLoginHelp) {
    btnLoginHelp.addEventListener('click', () => {
        loginView.style.display = 'none';
        appContainer.style.display = 'flex';
        if(typeof switchView === 'function') switchView('help');
        
        const controls = document.querySelector('.controls-container');
        if(controls) controls.style.display = 'none';
        
        // Lisää takaisin-nappi dynaamisesti
        const backBtn = document.createElement('button');
        backBtn.innerText = "← Takaisin kirjautumiseen";
        backBtn.className = 'action-btn blue-btn';
        backBtn.style.marginTop = "20px";
        backBtn.onclick = () => location.reload();
        
        const helpView = document.getElementById('help-view');
        if (helpView && !helpView.querySelector('.back-to-login-btn')) {
            backBtn.classList.add('back-to-login-btn');
            helpView.insertBefore(backBtn, helpView.firstChild);
        }
    });
}
