// =========================================================
// APP.JS - SOVELLUKSEN KÄYNNISTYS (GLUE CODE)
// =========================================================

// Teeman vaihto (Logiikka joka ei mahtunut muihin tai on globaali)
const btnTheme = document.getElementById('btn-theme');
if (btnTheme) {
    btnTheme.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
    });
}

// Rekisteröi Service Worker jos halutaan PWA-tuki (Valinnainen)
if ('serviceWorker' in navigator) {
    // navigator.serviceWorker.register('./sw.js')
    // .then(() => console.log('Service Worker Registered'));
}

// Tulostetaan versio konsoliin (Hakee APP_VERSION globals.js:stä)
const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : "Unknown";
console.log(`Mikkokalevin Ajopäiväkirja Pro v${ver} (Modular) käynnistetty.`);
