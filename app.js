// =========================================================
// APP.JS - SOVELLUKSEN KÄYNNISTYS (REFACTORED v6.1)
// =========================================================

// 1. TEEMAN HALLINTA
// Ladataan tallennettu teema heti käynnistyksessä
const savedTheme = localStorage.getItem(APP_CONFIG.THEME_STORAGE_KEY);
if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
}

const btnTheme = document.getElementById('btn-theme');
if (btnTheme) {
    btnTheme.addEventListener('click', () => {
        // Vaihda luokka
        document.body.classList.toggle('light-theme');
        
        // Tallenna uusi tila muistiin
        const isLight = document.body.classList.contains('light-theme');
        localStorage.setItem(APP_CONFIG.THEME_STORAGE_KEY, isLight ? 'light' : 'dark');
    });
}

// 2. SERVICE WORKER (PWA TUKI - VALINNAINEN)
// Jos haluat ottaa PWA:n (Offline-tilan) käyttöön myöhemmin, luo sw.js tiedosto juureen.
// Tällä hetkellä tämä pidetään passivisena.
if ('serviceWorker' in navigator) {
    // navigator.serviceWorker.register('./sw.js')
    // .then(() => console.log('Service Worker Registered'))
    // .catch((err) => console.log('SW Fail:', err));
}

// 3. KÄYNNISTYSLOKI
// Varmistetaan että APP_CONFIG on ladattu (globals.js)
if (typeof APP_CONFIG !== 'undefined') {
    console.log(`Ajopäiväkirja Pro v${APP_CONFIG.VERSION} käynnistetty.`);
} else {
    console.log("Ajopäiväkirja Pro käynnistetty (Config missing).");
}
