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
            <br><em>Liikeanturit:</em> Sovellus saattaa kysyä lupaa käyttää puhelimen liikeantureita. Salli tämä, jos haluat että sovellus analysoi ajotapaasi (kiihtyvyys/jarrutukset).
        </div>
        <div class="help-step">
            <strong>3. Asennus (PWA):</strong>
            Parhaan kokemuksen saat lisäämällä sivun kotivalikkoon.
            <br><em>iPhone (Safari):</em> Paina "Jaa" -> "Lisää Koti-valikkoon".
            <br><em>Android (Chrome):</em> Paina valikosta -> "Asenna sovellus".
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ Mittaristo</h3>
        <div class="help-step">
            <strong>Aktivoi Nopeusnäyttö:</strong> Käynnistää GPS:n, mutta ei vielä tallenna. Voit käyttää tätä pelkkänä mittarina.
        </div>
        <div class="help-step">
            Näytöllä näkyy nopeus, huippunopeus, kuljettu matka (rec), korkeus ja tarkka kello.
        </div>
    </div>

    <div class="help-section">
        <h3>🔴 Ajon Tallennus (REC)</h3>
        <div class="help-step">
            1. Paina <strong>🔴 ALOITA TALLENNUS</strong>. Matkamittari nollautuu.
        </div>
        <div class="help-step">
            <strong>Automaattiset tiedot:</strong> Tallennuksen alkaessa sovellus hakee paikallisen <strong>sään</strong> (esim. 🌧 +3°C) ja alkaa seurata <strong>ajotapaa</strong> kiihtyvyysanturilla.
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
            Jokaisessa historiakortissa näkyy nyt myös ikonit säästä (🌡️) ja ajotavasta (🏎️ Tasainen/Reipas).
        </div>
        <div class="help-step">
            <strong>Muokkaus:</strong> Voit kirjoittaa aiheen ("Työmatka") jälkikäteen tai poistaa ajon roskakorista.
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ Karttanäkymä</h3>
        <div class="help-step">
            Kartta keskittää sijaintiisi ja zoomaa automaattisesti nopeutesi mukaan (kaupungissa lähelle, maantiellä kauas).
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
        <div class="help-step">
            <strong>GPS pätkii?</strong> Sisätiloissa ja tunneleissa signaali voi kadota. Sovellus suodattaa pienet "GPS-hyppelyt" liikennevaloissa.
        </div>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px; padding-bottom: 20px;">
        Ajopäiväkirja Pro v2.6
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
