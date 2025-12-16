const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 20px;">Käyttöohjeet</h2>
    
    <div class="help-section">
        <h3>🚀 Aloitus</h3>
        <div class="help-step">
            <strong>1. Kirjautuminen:</strong>
            Sovellus vaatii Google-kirjautumisen. Ajotietosi tallentuvat turvallisesti omaan pilvitietokantaasi.
        </div>
        <div class="help-step">
            <strong>2. Luvat (GPS ja Liike):</strong>
            <br><em>Sijainti:</em> Pakollinen nopeuden ja matkan mittaukseen.
            <br><em>Liikeanturit:</em> Salli nämä, jotta sovellus voi toimia "Eco-mittarina" ja analysoida ajotapaasi (kiihtyvyys/jarrutukset).
        </div>
        <div class="help-step">
            <strong>3. Asennus (PWA):</strong>
            Parhaan kokemuksen saat lisäämällä sivun kotivalikkoon.
            <br><em>iPhone (Safari):</em> Paina "Jaa" -> "Lisää Koti-valikkoon".
            <br><em>Android (Chrome):</em> Paina valikosta -> "Asenna sovellus".
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ Mittaristo ja Eco-näyttö</h3>
        <div class="help-step">
            Kun aloitat tallennuksen, mittaristo herää eloon:
        </div>
        <div class="help-step">
            <strong>🌡️ Sää:</strong> Sovellus hakee automaattisesti paikallisen sään (esim. 🌧 +3°C) ja näyttää sen yläreunassa.
        </div>
        <div class="help-step">
            <strong>🏎️ Ajotapa (Eco-mittari):</strong>
            Seuraa yläreunan värillistä palkkia:
            <br><span style="color:#00c853; font-weight:bold;">🟢 Taloudellinen:</span> Ajat tasaisesti ja nätisti.
            <br><span style="color:#ff1744; font-weight:bold;">🔴 Kiihdytys/Jarrutus:</span> Voimakkaat liikkeet muuttavat mittarin punaiseksi. Yritä pitää se vihreänä!
        </div>
    </div>

    <div class="help-section">
        <h3>🔴 Ajon Tallennus (REC)</h3>
        <div class="help-step">
            1. Paina <strong>🔴 ALOITA TALLENNUS</strong>. Matkamittari nollautuu.
        </div>
        
        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>2. ⏸ TAUKO (Valinnainen):</strong><br>
            Paina keltaista tauko-nappia kaupassa tai tankatessa.
            <ul>
                <li>Matka ja aika eivät kerry tauolla.</li>
                <li>Keskinopeus ei vääristy.</li>
            </ul>
            Jatka matkaa painamalla <strong>▶ JATKA</strong>.
        </div>

        <div class="help-step">
            3. Paina lopuksi <strong>⬛ LOPETA</strong>.
        </div>
        
        <div class="help-step">
            <strong>4. Tallenna ja Nimeä:</strong><br>
            Ruudulle aukeaa ikkuna, jossa voit nimetä ajon (esim. "Työmatka"). Paina ✅ Tallenna.
        </div>
    </div>

    <div class="help-section">
        <h3>📋 Historia ja Raportit</h3>
        <div class="help-step">
            Paina valikosta "Historia". Näet listan kaikista ajoista.
        </div>
        <div class="help-step">
            <strong>Suodatus ja Yhteenveto:</strong>
            Sivun yläreunan valikosta voit valita ajanjakson:
            <ul>
                <li><em>Kaikki ajot</em></li>
                <li><em>Vuosi (esim. 2025)</em></li>
                <li><em>Kuukausi (esim. Joulukuu 2025)</em></li>
                <li><em>Mukautettu aikaväli (valitse päivät)</em></li>
            </ul>
            Valinnan alla näkyy <strong>yhteenvetolaatikko</strong>, joka kertoo valitun jakson kilometrit, ajojen määrän ja kokonaisajan.
        </div>
        <div class="help-step">
            <strong>Merkinnät kortissa:</strong>
            Historiassa näet myös, millainen sää oli (🌡️) ja oliko ajotapa "Tasainen" vai "Reipas" (🏎️).
        </div>
        <div class="help-step">
            <strong>Muokkaus:</strong> Voit kirjoittaa aiheen ("Työmatka") jälkikäteen tai poistaa ajon roskakorista.
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ Karttanäkymä</h3>
        <div class="help-step">
            Kartta keskittää sijaintiisi ja zoomaa automaattisesti nopeutesi mukaan.
        </div>
        <div class="help-step">
            Oikean yläkulman kerros-ikonista voit vaihtaa satelliittikuvaan.
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ Vianmääritys</h3>
        <div class="help-step">
            <strong>Näyttö sammuu?</strong> Sovellus yrittää pitää näytön päällä (Wake Lock). Varmista, ettei puhelimen virransäästötila ole päällä.
        </div>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px; padding-bottom: 20px;">
        Ajopäiväkirja Pro v2.7
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
