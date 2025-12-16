// Tässä muuttujassa on koko ohjesivun sisältö HTML-muodossa.
// Voit muokata tekstejä tässä vapaasti.

const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 20px;">Käyttöopas</h2>
    
    <div class="help-section">
        <h3>📲 1. Asennus ja Käyttöönotto</h3>
        <div class="help-step">
            Tämä on <strong>PWA-sovellus</strong> (Progressive Web App). Se on suunniteltu toimimaan kuin oikea sovellus, kun lisäät sen puhelimesi kotivalikkoon.
        </div>
        <div class="help-step">
            <strong>iPhone (iOS):</strong><br>
            1. Paina selaimen alalaidan "Jaa"-painiketta (neliö, josta nuoli ylös).<br>
            2. Selaa valikkoa alaspäin.<br>
            3. Valitse <strong>"Lisää Koti-valikkoon"</strong> (Add to Home Screen).
        </div>
        <div class="help-step">
            <strong>Android (Chrome):</strong><br>
            1. Paina selaimen oikean yläkulman valikkoa (kolme pistettä).<br>
            2. Valitse <strong>"Asenna sovellus"</strong> tai "Lisää aloitusnäyttöön".
        </div>
    </div>

    <div class="help-section">
        <h3>🚀 2. Aloitus</h3>
        <div class="help-step">
            <strong>Kirjautuminen:</strong>
            Sovellus vaatii Google-kirjautumisen. Tämä on tietoturvaominaisuus: se varmistaa, että ajosi tallentuvat henkilökohtaiseen, suojattuun tietokantaan. Vain sinä näet omat ajosi.
        </div>
        <div class="help-step">
            <strong>GPS-lupa:</strong>
            Kun käynnistät mittariston ensimmäistä kertaa, selain kysyy lupaa käyttää sijaintitietoja. Vastaa ehdottomasti <strong>Salli</strong> (Allow). Ilman tätä nopeusmittaus ei toimi.
        </div>
    </div>

    <div class="help-section">
        <h3>🏎️ 3. Mittaristo ja Ajaminen</h3>
        <div class="help-step">
            <strong>Vapaa ajo (Ei tallennusta):</strong> 
            Kun painat "Aktivoi Nopeusnäyttö", näet reaaliaikaisen nopeuden, huippunopeuden ja koordinaatit. Tässä tilassa matka ei tallennu historiaan.
        </div>
        <div class="help-step">
            <strong>🔴 Tallennus (REC):</strong><br>
            Kun haluat luoda virallisen merkinnän ajopäiväkirjaan:<br>
            1. Paina vihreää <strong>ALOITA TALLENNUS</strong> -painiketta.<br>
            2. Matkamittari nollautuu ja alkaa mitata matkaa.<br>
            3. Näytön alalaidassa lukee "🔴 REC".<br>
            4. Ajon lopuksi paina punaista <strong>LOPETA & TALLENNA</strong> -painiketta.
        </div>
        <div class="help-step">
            <strong>Älykäs mittaus:</strong> 
            Sovellus suodattaa GPS-häiriöt. Jos seisot liikennevaloissa ja GPS "hyppii" paikallaan, mittari ei kerrytä turhia metrejä.
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ 4. Kartta</h3>
        <div class="help-step">
            <strong>Avaaminen:</strong> 
            Pääset karttaan painamalla yläpalkin 🗺-ikonia TAI napauttamalla mittariston vasenta tai oikeaa reunaa ("< KARTTA >").
        </div>
        <div class="help-step">
            <strong>Älykäs Zoom:</strong> 
            Kartta elää vauhdin mukaan:<br>
            • Hidas vauhti (< 50 km/h) = Zoom lähellä (kaupunkiajo).<br>
            • Kova vauhti (> 90 km/h) = Zoom kaukana (moottoritie), jotta näet tulevat mutkat.
        </div>
        <div class="help-step">
            <strong>Paluu mittaristoon:</strong> 
            Kartan alareunassa on iso "🏎️ MITTARISTO" -nappi, josta pääset nopeasti takaisin nopeusnäyttöön.
        </div>
        <div class="help-step">
            <strong>Satelliittikuva:</strong> 
            Kartan oikeassa yläkulmassa on kerrosvalikko (pieni neliöpino), josta voit vaihtaa satelliittinäkymään.
        </div>
    </div>

    <div class="help-section">
        <h3>📋 5. Historia ja Muokkaus</h3>
        <div class="help-step">
            Paina yläpalkin lehtiö-ikonia (📋) nähdäksesi ajohistorian. Uusin ajo on listalla ylimpänä.
        </div>
        <div class="help-step">
            <strong>Aiheen lisääminen:</strong> 
            Jokaisessa historiakortissa on tekstikenttä "Aihe...". Kirjoita siihen esimerkiksi "Työmatka" tai "Mökkireissu". Tieto tallentuu automaattisesti heti, kun lopetat kirjoittamisen (klikkaat muualle tai painat enter).
        </div>
        <div class="help-step">
            <strong>Poistaminen:</strong> 
            Voit poistaa virheellisen tallennuksen painamalla roskakori-ikonia (🗑). Sovellus kysyy varmistuksen ennen poistoa.
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ 6. Ongelmatilanteet</h3>
        <div class="help-step">
            <strong>Näyttö sammuu ajon aikana?</strong><br>
            Sovellus yrittää pitää näytön päällä (Wake Lock -toiminto). Jos kuitenkin käytät puhelinta toisessa sovelluksessa (esim. luet sähköpostia) ja palaat, selain on saattanut katkaista lukituksen. Sovellus yrittää aktivoida sen uudelleen palatessasi, mutta varminta on pitää sovellus aktiivisena ruudulla ajon ajan.
        </div>
        <div class="help-step">
            <strong>GPS ei toimi tai pätkii?</strong><br>
            Varmista puhelimen asetuksista, että selaimella on lupa käyttää tarkkaa sijaintia. Sisätiloissa, tunneleissa tai korkeiden rakennusten keskellä GPS-signaali voi heiketä.
        </div>
    </div>
    
    <div style="text-align: center; margin-top: 40px; color: #888; font-size: 12px; padding-bottom: 20px;">
        Ajopäiväkirja Pro v2.3 &copy; 2024
    </div>
`;

// Tämä rivi etsii index.html-tiedostosta kohdan <div id="help-view"> ja
// syöttää yllä olevan tekstin sinne automaattisesti.
const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
