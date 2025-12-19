// =========================================================
// HELP.JS - KATTAVA KÄYTTÖOPAS JA UKK
// =========================================================

const helpContent = `
    <div style="text-align:center; margin-bottom: 30px;">
        <img src="ajopaivakirja_logo.png" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
        <h2 style="color:var(--accent-color); text-transform: uppercase; letter-spacing: 1px; margin:0;">Käyttöopas</h2>
        <p style="opacity:0.7; font-size:12px;">Mikkokalevin Ajopäiväkirja Pro</p>
    </div>
    
    <div class="help-section">
        <h3>🚀 1. Ensimmäinen käyttökerta</h3>
        <p>Tervetuloa käyttämään Ajopäiväkirja Pro -sovellusta. Tämä ei ole pelkkä matkamittari, vaan työkalu, joka analysoi ajotapaasi ja auttaa pitämään kirjaa kalustosta.</p>
        
        <div class="help-step">
            <strong>⚠️ Tärkeät luvat (Miksi näitä kysytään?)</strong>
            <br>Sovellus tarvitsee toimiakseen oikeudet, joita selain kysyy ensimmäisellä kerralla:
            <ul>
                <li>📍 <strong>Sijainti (Location):</strong> Vastaa "Salli". Varmista puhelimen asetuksista, että "Tarkka sijainti" on päällä. Ilman tätä nopeusnäyttö heittelee ja kilometrit kertyvät väärin.</li>
                <li>📱 <strong>Liikeanturit (Motion):</strong> Vastaa "Salli". Sovellus käyttää puhelimen kiihtyvyysanturia Eco-ajon mittaamiseen (tunnistaa äkkijarrutukset ja kiihdytykset).</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>📲 Asennusvinkki (PWA)</strong>
            Tämä on verkkosovellus, joka on suunniteltu toimimaan kuin natiivisovellus.
            <br><strong>Suositus:</strong> Lisää sovellus puhelimen kotivalikkoon selaimen asetuksista ("Lisää aloitusnäyttöön" tai "Add to Home Screen").
            <br><em>Hyöty: Osoitepalkit poistuvat, näyttötila kasvaa ja GPS toimii vakaammin taustalla.</em>
        </div>
    </div>

    <div class="help-section">
        <h3>🚗 2. Autotalli ja Ajoneuvot</h3>
        <p>Sovelluksen älykkäät ominaisuudet perustuvat siihen, millä välineellä liikut. Siksi on tärkeää määritellä ajoneuvot oikein.</p>
        
        <div class="help-step">
            <strong>Tallin hallinta (Asetukset):</strong>
            Voit luoda rajattomasti ajoneuvoja. Kun lisäät uutta ajoneuvoa, kiinnitä huomiota <strong>Tyyppi</strong>-valintaan:
            <ul>
                <li><strong>🚗 Auto-tila:</strong>
                    <ul>
                        <li>Kartta loitontaa näkymää automaattisesti, kun vauhti kasvaa (maantieajo).</li>
                        <li>Eco-mittari on päällä ja tarkkailee ajotapaa.</li>
                        <li>Reittiviiva muuttuu punaiseksi vasta moottoritienopeuksissa.</li>
                    </ul>
                </li>
                <li><strong>🚲 Pyörä-tila:</strong>
                    <ul>
                        <li>Kartta pysyy tiukassa lähikuvassa (Zoom 19), jotta näet polut ja kinttupolut tarkasti.</li>
                        <li>Eco-mittari kytkeytyy POIS päältä (koska pyörän tangon tärinä aiheuttaisi virheellisiä hälytyksiä).</li>
                        <li>Nopeusvärit on skaalattu pyöräilyvauhtiin.</li>
                    </ul>
                </li>
            </ul>
        </div>

        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>💡 Muista valinta:</strong>
            Ennen kuin painat "Aloita", tarkista yläpalkista, että oikea ajoneuvo on valittuna. Sovellus muistaa viimeksi käytetyn valinnan.
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 3. Ajon tallennus ja Tauot</h3>
        <p>Oikeaoppinen tallennus takaa, että tilastosi pysyvät luotettavina.</p>
        
        <div class="help-step">
            <strong>Miksi käyttää Tauko-nappia? (Keltainen)</strong>
            Kun pysähdyt vaikkapa kauppaan tai huoltoasemalle, paina aina "Tauko".
            <br>Jos et paina taukoa ja kävelet puhelin taskussa sisällä:
            <ol>
                <li>GPS alkaa hyppiä seinien sisällä ja piirtää kartalle "suttua".</li>
                <li>Tämä "haamumatka" kerryttää kilometrejä virheellisesti.</li>
                <li>Keskinopeutesi romahtaa, koska aika juoksee vaikka auto seisoo.</li>
            </ol>
            Kun jatkat matkaa, paina <strong>▶ JATKA</strong>.
        </div>

        <div class="help-step">
            <strong>Ajon lopetus:</strong>
            Kun painat <strong>⬛ LOPETA</strong>, sovellus pyytää nimeämään ajon (esim. "Työmatka" tai "Mökkireissu"). Tämä auttaa sinua löytämään ajon myöhemmin historiasta.
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ 4. Kartan värit ja logiikka</h3>
        <p>Kartalle piirtyvä viiva ei ole vain koriste, vaan se sisältää dataa nopeudestasi.</p>

        <div class="help-step">
            <strong>Mitä värit tarkoittavat?</strong>
            <br><span style="color:#2979ff; font-weight:bold;">🔵 Sininen:</span> Hidas ajo, ruuhka tai risteysalue.
            <br><span style="color:#00e676; font-weight:bold;">🟢 Vihreä:</span> Optimaalinen matkavauhti.
            <br><span style="color:#ffea00; font-weight:bold;">🟡 Keltainen:</span> Reipas maantieajo.
            <br><span style="color:#ff1744; font-weight:bold;">🔴 Punainen:</span> Kova vauhti (tai pyörällä alamäki/sprintti).
        </div>

        <div class="help-step">
            <strong>Karttatasot (Layers):</strong>
            Voit vaihtaa kartan tyyppiä lennosta oikean yläkulman napista:
            <ul>
                <li><strong>Peruskartta:</strong> Selkein navigointiin ja kaupunkiajoon.</li>
                <li><strong>Satelliitti:</strong> Hyvä maastoajossa tai jos haluat nähdä maamerkit.</li>
                <li><strong>Maastokartta:</strong> Näyttää korkeuskäyrät ja metsäpolut (erinomainen pyöräilyyn).</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>📊 5. Historia ja Tilastot</h3>
        <p>Kaikki ajetut matkat tallentuvat pysyvästi pilvipalveluun ja laitteesi välimuistiin.</p>
        
        <div class="help-step">
            <strong>📜 Ajoblogi (Historia):</strong>
            Täältä löydät kaikki menneet ajot aikajärjestyksessä.
            <ul>
                <li><strong>Tarkastelu:</strong> Klikkaamalla ajoa näet sen reitin kartalla, keston, matkan ja keskinopeuden.</li>
                <li><strong>Suodatus:</strong> Voit etsiä ajoja tietyn auton perusteella tai katsoa esimerkiksi vain viime kuun ajot.</li>
                <li><strong>Korjaus:</strong> Jos unohdit vaihtaa auton ennen ajoa, voit muokata ajoneuvoa tai ajon nimeä jälkikäteen kynä-ikonista.</li>
            </ul>
        </div>
        
        <div class="help-step">
            <strong>⛽ Tankkaukset:</strong>
            Historia-näkymässä on oma välilehti tankkauksille. Sieltä näet yhteenvedon polttoainekuluista ja tankatuista litroista.
        </div>

        <div class="help-step">
            <strong>📈 Yhteenveto:</strong>
            Tilastot-sivu näyttää visuaalisesti, kuinka paljon olet ajanut eri kuukausina ja millä autolla ajat eniten.
        </div>
    </div>

    <div class="help-section">
        <h3>❓ Ongelmatilanteet (UKK)</h3>
        
        <div class="help-step">
            <strong>K: Näyttö sammuu ja GPS-jälki katkeaa?</strong>
            <br>V: Nykypuhelimet ovat aggressiivisia säästämään akkua.
            <br>1. Pidä puhelin latauksessa ajon aikana jos mahdollista.
            <br>2. Jos puhelimessa on "Virransäästötila" päällä, se voi tappaa GPS:n kun näyttö sammuu. Ota virransäästö pois ajon ajaksi.
        </div>

        <div class="help-step">
            <strong>K: Kartalla näkyy suora viiva ("teleporttaus")?</strong>
            <br>V: GPS-signaali katkesi hetkeksi (esim. tunneli) tai käyttöjärjestelmä jäädytti selaimen taustalla. Sovellus yhdistää viimeisen tunnetun sijainnin ja uuden sijainnin suoralla viivalla.
        </div>

        <div class="help-step">
            <strong>K: Toimiiko sovellus ilman nettiä?</strong>
            <br>V: <strong>Kyllä.</strong> Voit lähteä ajamaan, vaikka nettiä ei olisi. Reitti tallentuu puhelimen muistiin. Kun puhelin saa taas verkkoyhteyden, tiedot varmuuskopioidaan automaattisesti pilveen. Huomaa, että karttapohjat eivät välttämättä lataudu ilman nettiä, mutta viiva piirtyy silti "tyhjälle" pohjalle ja näkyy oikein myöhemmin.
        </div>
    </div>

    <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
        Mikkokalevin Ajopäiväkirja Pro v${APP_VERSION}<br>
        Luotettava kumppani tiellä.
    </div>
`;

// Ladataan sisältö
const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
