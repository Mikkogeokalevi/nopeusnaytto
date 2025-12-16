const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 20px;">Käyttöohjeet</h2>
    
    <div class="help-section">
        <h3>🚀 Aloitus</h3>
        <div class="help-step">
            <strong>1. Kirjautuminen:</strong>
            Sovellus vaatii Google-kirjautumisen. Tämä varmistaa, että ajosi tallentuvat henkilökohtaiseen, suojattuun tietokantaan, eivätkä ne sekoitu muiden käyttäjien tietoihin.
        </div>
        <div class="help-step">
            <strong>2. GPS-lupa:</strong>
            Kun painat "Aktivoi Nopeusnäyttö", selain kysyy lupaa sijaintitietoihin. Vastaa <strong>Salli</strong> (Allow). Ilman tätä sovellus ei voi mitata nopeutta tai matkaa.
        </div>
        <div class="help-step">
            <strong>3. Asennus (PWA):</strong>
            Parhaan kokemuksen saat lisäämällä sivun kotivalikkoon.
            <br><em>iPhone (Safari):</em> Paina "Jaa" -kuvaketta ja valitse "Lisää Koti-valikkoon".
            <br><em>Android (Chrome):</em> Paina valikosta (kolme pistettä) "Asenna sovellus" tai "Lisää aloitusnäyttöön".
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ Mittaristo ja Vapaa-ajo</h3>
        <div class="help-step">
            Oletusnäkymä on digitaalinen mittaristo.
            <br><strong>Aktivoi Nopeusnäyttö:</strong> Tämä käynnistää GPS:n, mutta <em>ei vielä tallenna</em> ajoa pysyvästi. Voit käyttää tätä pelkkänä nopeusmittarina.
        </div>
        <div class="help-step">
            <strong>Näytettävät tiedot:</strong>
            <ul>
                <li>Nopeus (km/h)</li>
                <li>Huippunopeus (kyseisen session aikana)</li>
                <li>Korkeus merenpinnasta</li>
                <li>Tarkat koordinaatit (Geocaching-muoto)</li>
                <li>Keskinopeus (Ø Nopeus)</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🔴 Ajon Tallennus (REC)</h3>
        <div class="help-step">
            Kun haluat tallentaa ajopäiväkirjamerkinnän:
        </div>
        <div class="help-step">
            1. Paina vihreää <strong>🔴 ALOITA TALLENNUS</strong> -painiketta. Matkamittari nollautuu ja "REC"-tila alkaa.
        </div>
        
        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>2. ⏸ TAUKO (Valinnainen):</strong><br>
            Jos käyt kaupassa tai tankkaamassa, paina keltaista <strong>⏸ TAUKO</strong> -painiketta.
            <ul>
                <li>Matkan ja ajan mittaus pysähtyy.</li>
                <li>Keskinopeus ei putoa nollaan tauon aikana.</li>
                <li>GPS-sijainti näkyy yhä kartalla.</li>
            </ul>
            Kun jatkat matkaa, paina <strong>▶ JATKA</strong>.
        </div>

        <div class="help-step">
            3. Ajon päätteeksi paina punaista <strong>⬛ LOPETA</strong> -painiketta.
        </div>
        
        <div class="help-step">
            <strong>4. 💾 Tallenna ja Nimeä:</strong><br>
            Ruudulle aukeaa ikkuna, jossa näet yhteenvedon (km ja aika).
            <ul>
                <li>Kirjoita aihe (esim. "Työmatka").</li>
                <li>Paina <strong>✅ Tallenna</strong> viedäksesi tiedot historiaan.</li>
                <li>Paina <strong>❌ Hylkää</strong>, jos ajo oli virheellinen tai testi.</li>
            </ul>
        </div>
        
        <div class="help-step">
            <em>Huom: Sovellus suodattaa automaattisesti pienet GPS-häiriöt liikennevaloissa seistessä.</em>
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ Karttanäkymä</h3>
        <div class="help-step">
            Vaihda näkymää valikosta tai vasemman reunan "‹ KARTTA" -napista.
        </div>
        <div class="help-step">
            <strong>Automaattinen Zoom:</strong> Kartta zoomaa lähemmäs, kun ajat hiljaa (kaupunki) ja loittonee, kun ajat kovaa (maantie), jotta näet mutkat ajoissa.
        </div>
        <div class="help-step">
            <strong>Satelliitti:</strong> Voit vaihtaa karttapohjan satelliittikuvaan kartan oikean yläkulman kerrosvalikosta.
        </div>
    </div>

    <div class="help-section">
        <h3>📋 Historia ja Muokkaus</h3>
        <div class="help-step">
            Paina valikosta "Historia" nähdäksesi ajetut matkat.
        </div>
        <div class="help-step">
            <strong>Muokkaus:</strong> Voit muuttaa ajon aihetta myös jälkikäteen kirjoittamalla uuden tekstin kenttään.
        </div>
        <div class="help-step">
            <strong>Poistaminen:</strong> Voit poistaa virheelliset ajot roskakori-ikonista (🗑). Sovellus kysyy varmistuksen.
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ Asetukset ja Vianmääritys</h3>
        <div class="help-step">
            <strong>Teema:</strong> Vaihda vaalean ja tumman teeman välillä yläpalkin napista (☀/☾). Tumma teema on suositeltu yökäyttöön.
        </div>
        <div class="help-step">
            <strong>Näyttö ei sammu:</strong> Sovellus yrittää pitää näytön päällä ajon aikana (Wake Lock). Jos poistut sovelluksesta ja palaat, tämä pyritään aktivoimaan uudelleen.
        </div>
        <div class="help-step">
            <strong>Ongelmia GPS:n kanssa?</strong>
            Varmista, että puhelimen sijaintiasetukset ovat päällä ja selaimella on lupa käyttää niitä. Sisätiloissa tai tunneleissa signaali voi kadota.
        </div>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px; padding-bottom: 20px;">
        Ajopäiväkirja Pro v2.5
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
