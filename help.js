// =========================================================
// HELP.JS - KATTAVA KÄYTTÖOPAS JA UKK (v5.9)
// =========================================================

const helpContent = `
    <div style="text-align:center; margin-bottom: 30px;">
        <img src="ajopaivakirja_logo.png" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
        <h2 style="color:var(--accent-color); text-transform: uppercase; letter-spacing: 1px; margin:0;">Käyttöopas</h2>
        <p style="opacity:0.7; font-size:12px;">Mikkokalevin Ajopäiväkirja Pro</p>
    </div>
    
    <div class="help-section">
        <h3>🚀 1. Ensimmäinen käyttökerta</h3>
        <p>Tervetuloa käyttämään Ajopäiväkirja Pro -sovellusta. Tämä on ammattimainen työkalu ajojen seurantaan, kaluston hallintaan ja kulujen optimointiin.</p>
        
        <div class="help-step">
            <strong>⚠️ Tärkeät luvat</strong>
            <br>Jotta älykkäät ominaisuudet toimivat, salli selaimen pyytämät luvat:
            <ul>
                <li>📍 <strong>Sijainti (Location):</strong> Välttämätön nopeuden, matkan ja osoitteen määrittämiseen.</li>
                <li>📱 <strong>Liikeanturit (Motion):</strong> Välttämätön G-voimamittarille ja Eco-ajotavan analyysille.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>📲 Asennus (PWA)</strong>
            Parhaan kokemuksen saat lisäämällä sovelluksen kotivalikkoon (Add to Home Screen). Tällöin osoitepalkit poistuvat ja sovellus toimii koko ruudulla.
        </div>
    </div>

    <div class="help-section">
        <h3>🏎️ 2. Mittaristo (Dashboard)</h3>
        <p>Mittaristo on sovelluksen sydän. Versiossa 5.9 se on luotettavampi kuin koskaan.</p>
        
        <div class="help-step">
            <strong>📍 Live-osoite:</strong>
            Nopeuslukeman yläpuolella näkyy nykyinen katuosoite ja kaupunki. Se päivittyy automaattisesti n. 30 sekunnin välein.
        </div>

        <div class="help-step">
            <strong>🎯 G-Voimamittari (Bubble):</strong>
            Oikeassa yläkulmassa oleva "tähtäin" kertoo ajotavastasi reaaliajassa.
            <ul>
                <li><strong>Pallo keskellä:</strong> Tasainen, taloudellinen ajo.</li>
                <li><strong>Pallo laidassa:</strong> Voimakas kiihdytys, jarrutus tai kaarre.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🚗 3. Autotalli ja Profiilit</h3>
        <div class="help-step">
            <strong>Valitse tyyppi oikein:</strong>
            <ul>
                <li><strong>🚗 Auto:</strong> Kartta loitontaa maantienopeuksissa. G-voimamittari ja Eco-analyysi ovat päällä.</li>
                <li><strong>🚲 Pyörä:</strong> Kartta pysyy lähikuvassa. Eco-analyysi on pois päältä.</li>
            </ul>
        </div>
        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>💡 Tärkeää:</strong> Valitse oikea ajoneuvo yläpalkista <em>ennen</em> ajon aloitusta! Sovellus estää tallennuksen aloituksen, jos valittuna on "Kaikki ajoneuvot".
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 4. Ajon tallennus & Tausta-ajo</h3>
        <p>Sovellus käyttää edistynyttä tekniikkaa GPS:n ylläpitoon.</p>
        
        <div class="help-step">
            <strong>🔊 Tausta-ajo (Silent Audio):</strong>
            Kun GPS on päällä, sovellus toistaa taustalla äänetöntä audiota. Tämä huijaa puhelimen käyttöjärjestelmää pitämään sovelluksen käynnissä, vaikka näyttö sammuisi.
            <br><em>Huom: Saatat nähdä media-ilmoituksen puhelimessasi – tämä on normaalia.</em>
        </div>

        <div class="help-step">
            <strong>Tauko (Pause):</strong>
            Paina aina ⏸ TAUKO, kun pysähdyt pidemmäksi aikaa, jotta GPS ei "hypi" paikallaan ollessa ja vääristä matkaa.
        </div>
    </div>

    <div class="help-section">
        <h3>⛽ 5. Tankkaukset</h3>
        <div class="help-step">
            <strong>Lisääminen:</strong>
            Paina mittaristossa kellon vieressä olevaa <strong>⛽-nappia</strong>. Litrahinta lasketaan automaattisesti.
        </div>
        
        <div class="help-step">
            <strong>✏️ Muokkaus:</strong>
            Voit nyt muokata tankkauksia jälkikäteen! Mene Historia-sivulle, valitse "Tankkaukset"-välilehti ja paina kynä-ikonia. Voit vaihtaa autoa, hintaa, litroja tai korjata päivämäärän.
        </div>
    </div>

    <div class="help-section">
        <h3>📊 6. Tilastot ja Analyysi (UUSI)</h3>
        <p>Tilastot-näkymä on uudistettu versiossa 5.9.</p>

        <div class="help-step">
            <strong>📅 Aikavälin valinta:</strong>
            Sivun yläreunassa on uusi valikko, josta voit valita tarkastelujakson:
            <ul>
                <li><strong>7 pv / 30 pv:</strong> Graafit näyttävät datan <strong>päiväkohtaisesti</strong>. Näet tarkasti, minä päivinä ajoja on kertynyt.</li>
                <li><strong>Vuosi / Kaikki:</strong> Graafit näyttävät datan <strong>kuukausitasolla</strong>. Hyvä pitkän aikavälin seurantaan.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>🏎️ Ajotilastot:</strong>
            Sisältää kilometrikehityksen, keskinopeuden muutokset ja ajoneuvojakauman.
        </div>
    </div>

    <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
        Mikkokalevin Ajopäiväkirja Pro v${APP_VERSION}<br>
        Kehitetty intohimolla ajamista varten.
    </div>
`;

// Ladataan sisältö
const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
