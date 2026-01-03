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

// Rekisteröi Service Worker (TÄMÄ ON NYT KORJATTU JA AKTIVOITU)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(registration => {
                console.log('ServiceWorker rekisteröity onnistuneesti:', registration.scope);
            })
            .catch(err => {
                console.log('ServiceWorker rekisteröinti epäonnistui:', err);
            });
    });
}

// Tulostetaan versio konsoliin (Hakee APP_VERSION globals.js:stä)
const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : "Unknown";
console.log(`Mikkokalevin Ajopäiväkirja Pro v${ver} (Modular) käynnistetty.`);
