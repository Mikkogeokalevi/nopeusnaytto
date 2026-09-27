// =========================================================
// APP.JS - SOVELLUKSEN KÄYNNISTYS (GLUE CODE)
// =========================================================

// Teema: auto (järjestelmä) -> manuaalinen valinta korvaa ja tallentuu
const btnTheme = document.getElementById('btn-theme');
const themeMediaQuery = window.matchMedia('(prefers-color-scheme: light)');

function applyTheme(mode) {
    document.body.classList.toggle('light-theme', mode === 'light');
    if (btnTheme) btnTheme.textContent = mode === 'light' ? '☾' : '☀';
}

const savedTheme = localStorage.getItem('appTheme');
applyTheme(savedTheme || (themeMediaQuery.matches ? 'light' : 'dark'));

if (themeMediaQuery.addEventListener) {
    themeMediaQuery.addEventListener('change', (e) => {
        if (!localStorage.getItem('appTheme')) applyTheme(e.matches ? 'light' : 'dark');
    });
}

if (btnTheme) {
    btnTheme.addEventListener('click', () => {
        const next = document.body.classList.contains('light-theme') ? 'dark' : 'light';
        applyTheme(next);
        localStorage.setItem('appTheme', next);
    });
}

// Rekisteröi Service Worker (TÄMÄ ON NYT KORJATTU JA AKTIVOITU)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swUrl = (typeof APP_VERSION !== 'undefined') ? (`./sw.js?v=${APP_VERSION}`) : './sw.js';
        navigator.serviceWorker.register(swUrl)
            .then(registration => {
                console.log('ServiceWorker rekisteröity onnistuneesti:', registration.scope);
                try { registration.update(); } catch (e) {}
            })
            .catch(err => {
                console.log('ServiceWorker rekisteröinti epäonnistui:', err);
            });
    });
}

// Tulostetaan versio konsoliin (Hakee APP_VERSION globals.js:stä)
const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : "Unknown";
console.log(`Mikkokalevin Ajopäiväkirja Pro v${ver} (Modular) käynnistetty.`);
