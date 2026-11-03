// V2 PUBE — speechSynthesis fi-FI + asetukset (localStorage)
(function() {
    let settings = { speech: true };
    try { settings = { ...settings, ...JSON.parse(localStorage.getItem('v2Settings') || '{}') }; } catch (e) {}
    window.v2Settings = settings;

    function saveSettings() { localStorage.setItem('v2Settings', JSON.stringify(settings)); }

    window.v2Speak = function(text) {
        if (!settings.speech || !('speechSynthesis' in window)) return;
        try {
            const u = new SpeechSynthesisUtterance(text);
            u.lang = 'fi-FI'; u.rate = 1.15; u.pitch = 1; u.volume = 1;
            speechSynthesis.cancel();
            setTimeout(() => speechSynthesis.speak(u), 90);
        } catch (e) {}
    };

    window.v2ToggleSun = function() {
        const on = document.body.classList.toggle('v2-sun');
        localStorage.setItem('v2Sun', on ? '1' : '');
    };
    if (localStorage.getItem('v2Sun')) document.body.classList.add('v2-sun');

    window.v2ToggleSpeech = function() {
        settings.speech = !settings.speech;
        saveSettings();
        const c = document.getElementById('v2-set-speech');
        if (c) c.checked = settings.speech;
        if (!settings.speech) speechSynthesis.cancel();
    };

    // Asetusrivi Tietoa-nakymaan
    window.v2RenderSettings = function() {
        const box = document.getElementById('v2-settings-list');
        if (!box) return;
        box.innerHTML =
            '<div class="v2-listrow"><div class="grow"><div class="t">Puheohjeet</div><div class="s">Navigaation suomenkielinen TTS</div></div>' +
            '<input type="checkbox" id="v2-set-speech" ' + (settings.speech ? 'checked' : '') + ' onchange="v2ToggleSpeech()"></div>' +
            '<button class="v2-btn v2-btn-ghost" style="width:auto;padding:8px 14px;margin-top:6px;" onclick="v2Speak(\'Testi: ajopaivakirja toimii\')">Kuuntele</button>';
    };

    document.querySelectorAll('.v2-tab').forEach((t) => {
        t.addEventListener('click', () => {
            if (t.dataset.view === 'v2-view-about') v2RenderSettings();
        });
    });
})();
