// =========================================================
// HELP.JS - KATTAVA KÄYTTÖOPAS JA UKK (v5.95 RAAMATTU)
// =========================================================

const helpContent = `
    <div style="text-align:center; margin-bottom: 30px;">
        <img src="ajopaivakirja_logo.png" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
        <h2 style="color:var(--accent-color); text-transform: uppercase; letter-spacing: 1px; margin:0;">Käyttöopas</h2>
        <p style="opacity:0.7; font-size:12px;">Mikkokalevin Ajopäiväkirja Pro v${typeof APP_VERSION !== 'undefined' ? APP_VERSION : '5.95'}</p>
    </div>
    
    <div class="help-section">
        <h3>🚀 1. Käyttöönotto ja Luvat</h3>
        <p>Tämä sovellus on suunniteltu toimimaan suoraan selaimessa, mutta se vaatii tietyt oikeudet toimiakseen "natiivin" sovelluksen tavoin.</p>
        
        <div class="help-step">
            <strong>⚠️ Vaaditut luvat:</strong>
            <ul>
                <li>📍 <strong>Sijainti (Location):</strong> "Salli aina" tai "Salli käytettäessä". Ilman tätä nopeus ja matka eivät päivity.</li>
                <li>📱 <strong>Liikeanturit (Motion):</strong> Safari (iOS) vaatii erillisen luvan kiihtyvyysantureille. Tämä mahdollistaa G-voimamittarin ja Eco-analyysin.</li>
                <li>🔊 <strong>Automaattinen toisto (Audio):</strong> Sovellus soittaa äänetöntä raitaa taustalla pitääkseen GPS:n hengissä näytön ollessa kiinni. Salli äänen toisto, jos selain kysyy.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>📲 Asennus (PWA):</strong>
            Jotta osoitepalkit eivät vie tilaa ja sovellus pysyy paremmin käynnissä:
            <ul>
                <li><strong>iPhone (Safari):</strong> Paina Jaa-nappia (neliö ja nuoli ylös) -> "Lisää Koti-valikkoon" (Add to Home Screen).</li>
                <li><strong>Android (Chrome):</strong> Paina kolmea pistettä -> "Asenna sovellus" tai "Lisää aloitusnäytölle".</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🏎️ 2. Mittaristo (Dashboard)</h3>
        <p>Näkymä mukautuu automaattisesti puhelimen asennon mukaan.</p>
        
        <div class="help-step">
            <strong>📱 Pystynäkymä (Portrait):</strong>
            Järjestys ylhäältä alas:
            <ol>
                <li><strong>Nopeus:</strong> Iso numero keskellä.</li>
                <li><strong>Tilastot:</strong> 6 ruudun ristikko (Huippu, Matka, Aika, Ø Nopeus, Suunta, Korkeus).</li>
                <li><strong>Osoite:</strong> Katuosoite ja koordinaatit näkyvät <em>tilastoruudukon alapuolella</em>, mutta kellon yläpuolella.</li>
                <li><strong>Aika & Sää:</strong> Alimpana kellonaika, päivämäärä ja sääikoni.</li>
            </ol>
        </div>

        <div class="help-step">
            <strong>🔄 Vaakanäkymä (Landscape):</strong>
            Kun käännät puhelimen sivuttain:
            <ul>
                <li><strong>Vasen reuna:</strong> Iso nopeuslukema.</li>
                <li><strong>Oikea reuna:</strong> Tilastoruudukko.</li>
                <li><strong>Oikea alanurkka:</strong> Osoite ja koordinaatit siirtyvät <em>tilastoruudukon alle</em>.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>🎯 G-Voimamittari (Bubble):</strong>
            Oikeassa yläkulmassa (pystynäytöllä) oleva "tähtäin".
            <ul>
                <li><strong>Keskellä:</strong> Taloudellinen ajo.</li>
                <li><strong>Reunalla:</strong> Voimakas kiihdytys/jarrutus -> "Aggressiivinen".</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🚗 3. Autotalli ja Valinnat</h3>
        <p>Sovellus tallentaa ajot aina tietylle ajoneuvolle.</p>
        
        <div class="help-step">
            <strong>Valinta ennen ajoa:</strong>
            Yläpalkin alasvetovalikosta valitaan käytettävä auto.
            <br><span style="color:#ff4444; font-weight:bold;">HUOM:</span> Tallennusta ei voi aloittaa, jos valintana on "Kaikki ajoneuvot". Valitse jokin auto listalta.
        </div>

        <div class="help-step">
            <strong>Ajoneuvotyypit:</strong>
            <ul>
                <li><strong>🚗 Auto:</strong> Kartta loitontaa maantienopeuksissa. Eco-analyysi on päällä.</li>
                <li><strong>🚲 Pyörä:</strong> Kartta pysyy aina lähikuvassa. Eco-analyysi on pois päältä.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>🗄️ Arkistointi (UUSI):</strong>
            Jos myyt auton tai palautat vuokra-auton, voit "Arkistoida" sen Asetukset-sivulta.
            <ul>
                <li>Arkistoitu auto ei näy tankkaus- tai aloituslistoissa (pysyy poissa tieltä).</li>
                <li>Saat sen historian näkyviin valitsemalla yläpalkista <em>"Kaikki (sis. arkistoidut)"</em>.</li>
                <li>Voit palauttaa auton käyttöön painamalla ♻️-nappia.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 4. Ajon tallennus & Työajo</h3>
        
        <div class="help-step">
            <strong>🔇 Tausta-ajo (Silent Audio Hack):</strong>
            Kun käynnistät GPS:n, sovellus alkaa toistaa "hiljaisuutta" taustalla. Tämä huijaa puhelimen pitämään GPS:n päällä taskussa.
        </div>

        <div class="help-step">
            <strong>💾 Tallennus ja Työajo (UUSI):</strong>
            Kun lopetat tallennuksen (STOP), avautuu ikkuna, jossa voit:
            <ul>
                <li>Kirjoittaa ajon aiheen (esim. "Kauppareissu").</li>
                <li>Valita onko kyseessä <strong>🏠 Oma ajo</strong> vai <strong>💼 Työajo</strong>.</li>
            </ul>
            Tämä valinta vaikuttaa siihen, miltä ajo näyttää listassa ja CSV-raportissa.
        </div>
    </div>

    <div class="help-section">
        <h3>📝 5. Historia & Muokkaus (UUSI)</h3>
        <p>Historia-sivu on saanut merkittäviä päivityksiä versiossa 5.95.</p>

        <div class="help-step">
            <strong>✏️ Muokkaus (Extended Edit):</strong>
            Jos unohdit käynnistää sovelluksen ajoissa tai GPS näytti väärin, voit nyt korjata tiedot jälkikäteen.
            <br>Paina kynä-ikonia (✏️) haluamasi ajon kohdalla. Voit muuttaa:
            <ul>
                <li>Päivämäärän ja kellonajan.</li>
                <li>Ajetun matkan (km).</li>
                <li>Ajon tyypin (Oma/Työ).</li>
                <li>Käytetyn ajoneuvon.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>➕ Manuaalinen lisäys:</strong>
            Unohditko koko sovelluksen? Paina historia-sivulla <strong>"+ Manuaalinen lisäys"</strong>.
            <br>Voit syöttää lähtöpaikan, määränpään ja kilometrit käsin.
        </div>

        <div class="help-step">
            <strong>📥 Raportointi (Excel/CSV):</strong>
            Paina <strong>"Lataa CSV"</strong> -nappia. Saat tiedoston, jonka voit avata Excelissä. Se sisältää eriteltynä: Pvm, Kello, Auto, Tyyppi (Työ/Oma), Matka, Kesto, Reitti ja Selite.
        </div>
    </div>

    <div class="help-section">
        <h3>⛽ 6. Tankkaukset</h3>
        
        <div class="help-step">
            <strong>Lisääminen:</strong>
            Paina mittaristossa <strong>⛽</strong>-nappia. Syötä päivä, litrat ja eurot.
        </div>
        
        <div class="help-step">
            <strong>Huom:</strong> Tankkausta ei voi lisätä polkupyörälle tai arkistoidulle autolle.
        </div>
    </div>

    <div class="help-section">
        <h3>📊 7. Tilastot</h3>
        <div class="help-step">
            <strong>📅 Aikavälin valinta:</strong>
            <ul>
                <li><strong>7 pv / 30 pv:</strong> Graafit näyttävät datan <strong>päiväkohtaisesti</strong>.</li>
                <li><strong>Vuosi / Kaikki:</strong> Graafit näyttävät datan <strong>kuukausitasolla</strong>.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>❓ Ongelmatilanteet (UKK)</h3>
        
        <div class="help-step">
            <strong>K: GPS-viiva on suora ("teleporttaus")?</strong>
            <br>V: Signaali katkesi tai virransäästö iski. Varmista, että äänet ovat päällä selaimessa (Silent Audio).
        </div>

        <div class="help-step">
            <strong>K: En löydä vanhaa autoani listalta?</strong>
            <br>V: Olet todennäköisesti arkistoinut sen. Valitse yläpalkista "Kaikki (sis. arkistoidut)".
        </div>
        
        <div class="help-step">
            <strong>K: Miten saan tumman teeman pois?</strong>
            <br>V: Paina yläpalkin aurinko/kuu -ikonia (☀/☾).
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
