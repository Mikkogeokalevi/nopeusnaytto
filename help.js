const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color);">Käyttöopas</h2>
    
    <div class="help-section">
        <h3>📲 1. Asennus (Tärkeä!)</h3>
        <div class="help-step">
            Tämä on PWA-sovellus. Parhaan käyttökokemuksen saat, kun asennat sen puhelimeesi.
        </div>
        <div class="help-step">
            <strong>iPhone (iOS):</strong><br>
            Paina selaimen alalaidan "Jaa"-painiketta (neliö ja nuoli) -> Valitse "Lisää Koti-valikkoon" (Add to Home Screen).
        </div>
        <div class="help-step">
            <strong>Android (Chrome):</strong><br>
            Paina oikean yläkulman valikkoa (kolme pistettä) -> Valitse "Asenna sovellus" tai "Lisää aloitusnäyttöön".
        </div>
    </div>

    <div class="help-section">
        <h3>🚀 2. Aloitus</h3>
        <div class="help-step">
            <strong>Kirjautuminen:</strong>
            Sovellus vaatii Google-kirjautumisen. Tämä varmistaa, että ajosi tallentuvat vain sinun henkilökohtaiseen tietokantaasi.
        </div>
        <div class="help-step">
            <strong>GPS-lupa:</strong>
            Kun käynnistät mittariston, vastaa <strong>Salli</strong> (Allow), kun selain kysyy sijaintia.
        </div>
    </div>

    <div class="help-section">
        <h3>🏎️ 3. Mittaristo ja Tallennus</h3>
        <div class="help-step">
            <strong>Vapaa ajo:</strong> 
            Painamalla "Aktivoi Nopeusnäyttö" näet nopeuden ja sijainnin, mutta matka ei vielä tallennu muistiin.
        </div>
        <div class="help-step">
            <strong>🔴 Tallennus (REC):</strong><br>
            1. Paina vihreää <strong>ALOITA TALLENNUS</strong> -nappia.<br>
            2. Matkamittari nollautuu ja alkaa mitata.<br>
            3. Ajon lopuksi paina punaista <strong>LOPETA & TALLENNA</strong> -nappia.
        </div>
        <div class="help-step">
            <em>Huom: Sovellus suodattaa GPS-häiriöt (liikennevaloissa seisominen) pois matkakertymästä.</em>
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ 4. Kartta</h3>
        <div class="help-step">
            Pääset karttaan yläpalkin ikonista tai painamalla mittariston reunoja.
        </div>
        <div class="help-step">
            <strong>Älykäs Zoom:</strong> Kartta zoomaa lähelle kaupunkivauhdissa ja kauemmas moottoritiellä.
        </div>
        <div class="help-step">
            <strong>Paluu:</strong> Alareunassa on iso nappi, jolla pääset takaisin mittaristoon.
        </div>
    </div>

    <div class="help-section">
        <h3>📋 5. Historia</h3>
        <div class="help-step">
            Selaa vanhoja ajoja lehtiö-ikonista (📋).
        </div>
        <div class="help-step">
            <strong>Muokkaus:</strong> Kirjoita "Aihe"-kenttään esim. "Työmatka". Tieto tallentuu automaattisesti, kun lopetat kirjoittamisen.
        </div>
        <div class="help-step">
            <strong>Poisto:</strong> Roskakori-ikoni poistaa virheellisen ajon pysyvästi.
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ 6. Ongelmatilanteet</h3>
        <div class="help-step">
            <strong>Näyttö sammuu?</strong> Sovellus yrittää pitää näytön päällä (Wake Lock). Jos poistut sovelluksesta ja palaat, lukitus aktivoituu uudelleen.
        </div>
        <div class="help-step">
            <strong>GPS pätkii?</strong> Toimii huonosti sisätiloissa tai tunneleissa.
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px; padding-bottom: 20px;">
        Ajopäiväkirja Pro v2.2 - Ohjeet päivitetty
    </div>
`;

// Tämä sijoittaa yllä olevan tekstin HTML-sivulle
document.getElementById('help-view').innerHTML = helpContent;
