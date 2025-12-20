// =========================================================
// HELP.JS - KATTAVA KÄYTTÖOPAS JA UKK (v5.7)
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
        <p>Mittaristo on sovelluksen sydän. Versiossa 5.7 se on älykkäämpi kuin koskaan.</p>
        
        <div class="help-step">
            <strong>📍 Live-osoite:</strong>
            Nopeuslukeman yläpuolella näkyy nykyinen katuosoite ja kaupunki. Se päivittyy automaattisesti n. 30 sekunnin välein, kun olet liikkeellä.
        </div>

        <div class="help-step">
            <strong>🎯 G-Voimamittari (Bubble):</strong>
            Oikeassa yläkulmassa oleva "tähtäin" kertoo ajotavastasi reaaliajassa.
            <ul>
                <li><strong>Pallo keskellä:</strong> Tasainen, taloudellinen ajo.</li>
                <li><strong>Pallo laidassa:</strong> Voimakas kiihdytys, jarrutus tai kaarre.</li>
                <li>Jos pallo osuu reunaan, ajotapa muuttuu "Aggressiiviseksi" ja nopeusluku muuttuu punaiseksi.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>🧭 Kompassi & Vaakatila:</strong>
            <ul>
                <li><strong>Suunta:</strong> Pyörivä nuoli näyttää ajosuunnan tai pohjoisen (laitteesta riippuen).</li>
                <li><strong>Vaakatila (Landscape):</strong> Käännä puhelin sivuttain autotelineessä! Mittaristo muokkautuu automaattisesti leveään näkymään, siirtäen nopeuden vasemmalle ja tilastot oikealle.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🚗 3. Autotalli ja Profiilit</h3>
        <p>Sovellus käyttäytyy eri tavalla riippuen valitusta ajoneuvosta.</p>
        
        <div class="help-step">
            <strong>Valitse tyyppi oikein:</strong>
            <ul>
                <li><strong>🚗 Auto:</strong> Kartta loitontaa näkymää maantienopeuksissa. G-voimamittari ja Eco-analyysi ovat päällä.</li>
                <li><strong>🚲 Pyörä:</strong> Kartta pysyy tiukassa lähikuvassa (Zoom 17-19). Eco-analyysi on pois päältä, jotta puhelimen tärinä tangossa ei vääristä tuloksia.</li>
            </ul>
        </div>
        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>💡 Vinkki:</strong> Muista valita oikea auto yläpalkista <em>ennen</em> ajon aloitusta!
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 4. Ajon tallennus</h3>
        <p>Oikeaoppinen tallennus takaa luotettavan datan.</p>
        
        <div class="help-step">
            <strong>Tauko (Pause):</strong>
            Paina aina ⏸ TAUKO, kun pysähdyt pidemmäksi aikaa (esim. kauppaan).
            <br><em>Miksi?</em> Jos et paina taukoa ja kävelet puhelin taskussa sisällä, GPS "hyppii" seinien läpi. Tämä kerryttää haamukilometrejä ja pilaa keskinopeuden.
        </div>

        <div class="help-step">
            <strong>Lopetus:</strong>
            Ajon päätteeksi voit nimetä ajon (esim. "Työmatka") ja sovellus tallentaa reitin, sään, ajotyylin ja kilometrit pilveen.
        </div>
    </div>

    <div class="help-section">
        <h3>⛽ 5. Tankkaukset</h3>
        <p>Pidä kirjaa polttoainekuluista ja kulutuksesta.</p>
        
        <div class="help-step">
            <strong>Lisääminen:</strong>
            Paina mittaristossa kellon vieressä olevaa <strong>⛽-nappia</strong>.
            Syötä mittarilukema, litrat ja eurot. Sovellus laskee litrahinnan automaattisesti.
        </div>
        
        <div class="help-step">
            <strong>Muokkaus:</strong>
            Voit muokata tankkauksia jälkikäteen Historia-sivun "Tankkaukset"-välilehdeltä. Voit korjata myös päivämäärän ja kellonajan, jos unohdit merkitä tankkauksen heti asemalla.
        </div>
    </div>

    <div class="help-section">
        <h3>📊 6. Tilastot ja Analyysi</h3>
        <p>Uudistettu Tilastot-näkymä on jaettu kahteen osaan:</p>

        <div class="help-step">
            <strong>🏎️ Ajotilastot:</strong>
            <ul>
                <li><strong>Kilometrikehitys:</strong> Viivakaavio näyttää ajomäärät kuukausittain jokaiselle autolle erikseen.</li>
                <li><strong>Nopeustrendi:</strong> Näet onko keskinopeutesi noussut tai laskenut eri kuukausina.</li>
                <li><strong>Ajotyyli:</strong> Ympyrädiagrammi näyttää, kuinka suuri osa ajoista on ollut taloudellista vs. aggressiivista.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>⛽ Tankkaustilastot:</strong>
            <ul>
                <li><strong>Jakauma:</strong> Paljonko olet tankannut Bensiiniä vs. Dieseliä.</li>
                <li><strong>Hintakehitys:</strong> Seuraa polttoaineen litrahinnan muutoksia aikajanalla. Bensiini (vihreä) ja Diesel (tumma) eroteltuna.</li>
                <li><strong>Kulut:</strong> Eurot per kuukausi ja per auto.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>❓ Ongelmatilanteet (UKK)</h3>
        
        <div class="help-step">
            <strong>K: G-pallo ei liiku?</strong>
            <br>V: Varmista, että olet sallinut "Liike ja suunta" (Motion & Orientation) luvat selaimen asetuksista. iOS-laitteilla tämä vaatii usein erillisen luvan asetuksista.
        </div>

        <div class="help-step">
            <strong>K: Kartalla näkyy suora viiva ("teleporttaus")?</strong>
            <br>V: GPS-signaali katkesi tai puhelimen virransäästö sammutti GPS:n näytön ollessa pimeänä. Pidä puhelin latauksessa ajon aikana jos mahdollista.
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
