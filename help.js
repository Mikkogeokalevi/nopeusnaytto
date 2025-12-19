// =========================================================
// HELP.JS - KATTAVA KÄYTTÖOPAS JA UKK (v5.0)
// =========================================================

const helpContent = `
    <div style="text-align:center; margin-bottom: 30px;">
        <img src="ajopaivakirja_logo.png?v=5.0" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
        <h2 style="color:var(--accent-color); text-transform: uppercase; letter-spacing: 1px; margin:0;">Käyttöopas</h2>
        <p style="opacity:0.7; font-size:12px;">Versio 5.0 (Modular)</p>
    </div>
    
    <div class="help-section">
        <h3>🚀 1. Ensimmäinen käynnistys</h3>
        <p>Tervetuloa Mikkokalevin Ajopäiväkirja Pro -sovellukseen! Tämä sovellus on ammattimainen työkalu ajojen seurantaan, kaluston hallintaan ja kulutuksen optimointiin.</p>
        
        <div class="help-step">
            <strong>⚠️ TÄRKEÄÄ: Vaaditut luvat</strong>
            <br>Jotta sovellus toimii, sinun on annettava selaimelle kaksi lupaa, kun niitä kysytään:
            <ul>
                <li>📍 <strong>Sijainti (Location):</strong> Vastaa "Salli" (Allow). Valitse puhelimen asetuksista "Tarkka sijainti" (Precise Location), jotta nopeus ja matka ovat oikein.</li>
                <li>📱 <strong>Liikeanturit (Motion & Orientation):</strong> Vastaa "Salli". Tätä tarvitaan Eco-mittarin toimintaan (kiihtyvyyden tunnistus).</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>📲 Asennus (PWA) - Suositeltu!</strong>
            Tämä on verkkosovellus, joka toimii parhaiten, kun asennat sen kotivalikkoon. Tämä poistaa osoitepalkit ja parantaa GPS:n toimintaa taustalla.
            <br><br>
            <strong>iPhone (Safari):</strong>
            <br>1. Paina "Jaa"-painiketta (neliö, josta nuoli ylös).
            <br>2. Rullaa alas ja valitse "Lisää Koti-valikkoon" (Add to Home Screen).
            <br><br>
            <strong>Android (Chrome):</strong>
            <br>1. Paina valikkoa (kolme pistettä yläkulmassa).
            <br>2. Valitse "Asenna sovellus" tai "Lisää aloitusnäyttöön".
        </div>
    </div>

    <div class="help-section">
        <h3>🚗 2. Autotalli ja Ajoneuvot</h3>
        <p>Ennen kuin lähdet ajamaan, on tärkeää valita oikea kulkupeli. Sovellus käyttäytyy eri tavalla riippuen siitä, ajatko autolla vai pyörällä.</p>
        
        <div class="help-step">
            <strong>Mene valikosta kohtaan: ⚙️ Asetukset (Tallit)</strong>
            <br>Täällä voit lisätä rajattomasti ajoneuvoja.
            <br>Painamalla <strong>"Lisää ajoneuvo"</strong> tai muokkausnappia (✏️) voit määrittää:
            <ul>
                <li><strong>Nimi & Rekisterinumero:</strong> Esim. "Työauto", "Mazda", "Jopo".</li>
                <li><strong>Ikoni:</strong> Valitse kymmenistä vaihtoehdoista (🏎️, 🚜, 🛵, 🚚...). Tämä ikoni näkyy historiassa ja tilastoissa.</li>
                <li><strong>Tyyppi (KRIITTINEN VALINTA):</strong>
                    <ul>
                        <li><strong>🚗 Auto:</strong> Eco-mittari on päällä. Kartta loitontaa maantienopeuksissa. Reitti värittyy punaiseksi vasta 90 km/h jälkeen.</li>
                        <li><strong>🚲 Pyörä:</strong> Eco-mittari on POIS päältä (koska tanko tärisee). Kartta pysyy lähikuvassa (Zoom 19), jotta näet polut. Reitti menee punaiseksi jo 20 km/h vauhdissa.</li>
                    </ul>
                </li>
            </ul>
        </div>

        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>💡 Ennen ajoa:</strong>
            Muista valita oikea ajoneuvo yläpalkin alasvetovalikosta! Valinta tallentuu muistiin seuraavaa kertaa varten.
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 3. Ajon tallennus</h3>
        
        <div class="help-step">
            <strong>1. Aloitus:</strong>
            Paina vihreää <strong>🔴 ALOITA TALLENNUS</strong> -painiketta.
            <br>Ajanotto käynnistyy ja kartalle alkaa piirtyä sininen viiva.
            <br><em>Huom: Jos unohdit laittaa GPS:n päälle ("Aktivoi GPS"), sovellus muistuttaa siitä.</em>
        </div>
        
        <div class="help-step">
            <strong>2. Tauko (Keltainen nappi):</strong>
            Käytä tätä, kun pysähdyt kauppaan tai liikennevaloihin pitkäksi aikaa.
            <br><strong>Mitä tapahtuu tauolla?</strong>
            <ul>
                <li>GPS-jäljen piirto pysähtyy (ei tule "suttua" kartalle kun kävelet sisällä).</li>
                <li>Matkamittari ei kerry.</li>
                <li>Ajanotto pysähtyy (keskinopeus ei vääristy).</li>
            </ul>
            Jatka matkaa painamalla sinistä <strong>▶ JATKA</strong> -nappia.
        </div>

        <div class="help-step">
            <strong>3. Lopetus:</strong>
            Paina punaista <strong>⬛ LOPETA</strong> -nappia.
            <br>Täytä avautuvaan ikkunaan ajon aihe (esim. "Työmatka") ja paina Tallenna.
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ 4. Kartta ja Värit</h3>
        <p>Karttanäkymä on uudistettu versiossa 5.0. Se on nyt entistä älykkäämpi.</p>

        <div class="help-step">
            <strong>Reittiviivan värit (Nopeusdata):</strong>
            Karttaan piirtyvä viiva kertoo, kuinka kovaa ajoit missäkin kohdassa.
            <br><br>
            <strong>🚗 Autolla:</strong>
            <br><span style="color:#2979ff; font-weight:bold;">🔵 Sininen (0–20 km/h):</span> Ruuhka, liikennevalot, risteysalueet ja piha-ajo.
            <br><span style="color:#00e676; font-weight:bold;">🟢 Vihreä (20–60 km/h):</span> Normaali kaupunkiajo.
            <br><span style="color:#ffea00; font-weight:bold;">🟡 Keltainen (60–90 km/h):</span> Maantieajo.
            <br><span style="color:#ff1744; font-weight:bold;">🔴 Punainen (> 90 km/h):</span> Moottoritie tai ylinopeus.
            <br><br>
            <strong>🚲 Pyörällä:</strong>
            <br><span style="color:#2979ff; font-weight:bold;">🔵 Sininen (< 5 km/h):</span> Talutus tai pysähdys.
            <br><span style="color:#00e676; font-weight:bold;">🟢 Vihreä (5–20 km/h):</span> Normaali pyöräilyvauhti.
            <br><span style="color:#ff1744; font-weight:bold;">🔴 Punainen (> 20 km/h):</span> Kova vauhti tai alamäki.
        </div>

        <div class="help-step">
            <strong>Tasot (Layers):</strong>
            Oikean yläkulman kerrospainikkeesta voit vaihtaa kartan tyyppiä:
            <ul>
                <li><strong>Peruskartta:</strong> Selkeä tiekartta (OpenStreetMap).</li>
                <li><strong>Satelliitti:</strong> Ilmakuva (Esri). Hyvä maastossa.</li>
                <li><strong>Maastokartta:</strong> Korkeuskäyrät ja polut (OpenTopoMap). Erinomainen retkeilyyn.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>📊 5. Historia ja Tilastot</h3>
        
        <div class="help-step">
            <strong>📋 Historia-näkymä:</strong>
            Täällä näet kaikki ajetut matkat aikajärjestyksessä.
            <ul>
                <li><strong>Suodatus:</strong> Voit etsiä ajoja tietyn auton mukaan tai aikavälillä (esim. "Tammikuu 2025").</li>
                <li><strong>🗺️ Karttaikoni:</strong> Avaa kyseisen ajon reitin kartalle. Karttanäkymässä on nappi "📋 TAKAISIN", jolla pääset helposti takaisin listaan.</li>
                <li><strong>✏️ Muokkaus:</strong> Voit vaihtaa ajon otsikkoa tai siirtää sen toiselle autolle jälkikäteen.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>📊 Tilastot-näkymä:</strong>
            Sovellus laskee automaattisesti yhteenvedot:
            <ul>
                <li><strong>Pylväät:</strong> Ajetut kilometrit kuukausittain (viimeiset 6kk).</li>
                <li><strong>Donitsi:</strong> Millä autolla on ajettu eniten? Näet jakauman prosentteina.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>❓ UKK (Usein Kysytyt Kysymykset)</h3>
        
        <div class="help-step">
            <strong>K: Miksi näyttö sammuu ajon aikana?</strong>
            <br>V: Sovellus yrittää pitää näytön päällä (Wake Lock), mutta jos puhelimessa on "Virransäästötila" päällä, puhelin voi pakottaa näytön kiinni. Suosittelemme lataamaan puhelinta ajon aikana tai poistamaan virransäästön käytöstä.
        </div>

        <div class="help-step">
            <strong>K: GPS-jälkeen tuli suora viiva ("hyppy")?</strong>
            <br>V: Tämä tarkoittaa, että GPS-signaali katkesi hetkeksi. Syitä:
            <br>1. Käytit toista sovellusta (esim. WhatsApp) ja puhelin "jäädytti" ajopäiväkirjan taustalle säästääkseen akkua.
            <br>2. Ajoit tunneliin.
            <br><em>Ratkaisu: Pidä sovellus auki näytöllä aina kun mahdollista.</em>
        </div>

        <div class="help-step">
            <strong>K: Nopeus näyttää nollaa vaikka liikun?</strong>
            <br>V: Oletko sisätiloissa? GPS toimii vain ulkona, kun on suora näköyhteys taivaalle. Korkeat rakennukset voivat myös häiritä signaalia.
        </div>

        <div class="help-step">
            <strong>K: Toimiiko sovellus ilman nettiä?</strong>
            <br>V: Ajon tallennus toimii hetken ilman nettiä (välimuistissa), mutta kartat ja tallennus pilveen vaativat verkkoyhteyden. Tiedot synkronoidaan heti kun netti palaa.
        </div>

        <div class="help-step">
            <strong>K: Mihin tietoni tallentuvat?</strong>
            <br>V: Kaikki tiedot (reitit, autot, historia) tallennetaan Google Firebase -pilvitietokantaan. Ne ovat turvassa ja sidottu sinun käyttäjätunnukseesi. Kukaan muu ei näe niitä.
        </div>
    </div>

    <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
        Mikkokalevin Ajopäiväkirja Pro v5.0 &copy; 2025<br>
        Täyden palvelun ajoseuranta.
    </div>
`;

// Ladataan sisältö
const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
