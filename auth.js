// =========================================================
// AUTH.JS - KIRJAUTUMINEN JA KÄYTTÄJÄHALLINTA (v6.10 SECURITY FIX)
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
        
        // VARMISTUS: Poistetaan tietoturva-luokka jos se jäi päälle
        document.body.classList.remove('login-help-active');

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
        if(typeof loadPOIs === 'function') loadPOIs();
        if(typeof generateCarIcons === 'function') generateCarIcons(); 
        
        // --- ENSIMMÄISEN KÄYNNISTYKSEN LOGIIKKA (PÄIVITETTY v6.10) ---
        // Tarkistetaan, onko käyttäjä nähnyt ohjeet tässä versiossa
        // Avain vaihdettu, jotta kaikki näkevät ohjeen päivityksen jälkeen
        const hasSeenIntro = localStorage.getItem('intro_seen_v6_10');
        
        if (!hasSeenIntro) {
            // Jos ei ole nähnyt -> Pakota ohjenäkymään
            setTimeout(() => {
                if(typeof switchView === 'function') switchView('help');
                if(typeof showToast === 'function') showToast("Tervetuloa v6.10! Lue uudet ohjeet. 📲");
            }, 600); 
            
            // Merkitään nähdyksi
            localStorage.setItem('intro_seen_v6_10', 'true');
        } else {
            // Jos on nähnyt, varmistetaan dashboard (tai viimeinen tila)
            // (UI.js hoitaa oletuksena dashboardin)
        }
        // ----------------------------------------------------

        // Korjataan kartan koko jos se on "piilossa" latauksen aikana
        setTimeout(() => { if(typeof map !== 'undefined' && map) map.invalidateSize(); }, 500);

    } else {
        // --- KÄYTTÄJÄ EI OLE KIRJAUTUNUT ---
        currentUser = null;
        loginView.style.display = 'flex';
        appContainer.style.display = 'none';
        
        // Tyhjennetään tiedot muistista
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

// --- KIRJAUTUMISRUUDUN OHJEET (TURVAPÄIVITYS) ---
const btnLoginHelp = document.getElementById('btn-login-help');
if(btnLoginHelp) {
    btnLoginHelp.addEventListener('click', () => {
        loginView.style.display = 'none';
        
        // Näytetään container, mutta CSS (login-help-active) piilottaa valikot
        appContainer.style.display = 'flex';
        document.body.classList.add('login-help-active');

        if(typeof switchView === 'function') switchView('help');
        
        // Lisää takaisin-nappi dynaamisesti ohjesivulle
        const helpView = document.getElementById('help-view');
        
        // Poistetaan vanha nappi jos on
        const oldBtn = helpView.querySelector('.back-to-login-btn');
        if(oldBtn) oldBtn.remove();

        const backBtn = document.createElement('button');
        backBtn.innerText = "← Takaisin kirjautumiseen";
        backBtn.className = 'action-btn blue-btn back-to-login-btn'; 
        backBtn.onclick = () => {
            // Poista turvaluokka ja lataa sivu uudelleen (puhdas pöytä)
            document.body.classList.remove('login-help-active');
            location.reload();
        };
        
        if (helpView) {
            helpView.insertBefore(backBtn, helpView.firstChild);
        }
    });
}
