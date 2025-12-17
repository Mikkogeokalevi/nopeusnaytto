const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 30px; border-bottom: 2px solid var(--accent-color); padding-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Ajopäiväkirja Pro – Täydellinen Käyttöopas v3.7</h2>
    
    <div class="help-section">
        <h3>🚀 1. Käyttöönotto ja Tili</h3>
        <p>Tervetuloa käyttämään Ajopäiväkirja Pro -sovellusta. Tämä osio varmistaa, että saat sovelluksen toimimaan oikein heti alusta alkaen.</p>
        
        <div class="help-step">
            <strong>Kirjautuminen (Kaksi tapaa):</strong>
            Sovellus vaatii kirjautumisen, jotta tietosi pysyvät turvassa pilvipalvelussa ja ovat käytettävissä kaikilla laitteillasi.
            <br><br>
            <strong>Vaihtoehto A: Google-tili (Suositeltu)</strong>
            <br>Nopein tapa. Klikkaa "Kirjaudu Googlella". Sovellus käyttää Google-tiliäsi vain tunnistautumiseen – emme pääse käsiksi sähköposteihisi tai muihin tietoihisi.
            <br><br>
            <strong>Vaihtoehto B: Sähköposti ja Salasana</strong>
            <br>Jos haluat luoda täysin erillisen tunnuksen tai käytät jo Perhekalenteri-sovellusta samalla sähköpostilla, voit käyttää tätä.
            <br><em>Uusi käyttäjä?</em> Syötä sähköposti ja haluamasi salasana, ja paina "Luo tunnus".
            <br><em>Vanha käyttäjä?</em> Syötä tunnukset ja paina "Kirjaudu".
        </div>

        <div class="help-step">
            <strong>Vaaditut Käyttöoikeudet (Luvat):</strong>
            Sovellus ei voi toimia ilman tiettyjä selaimen lupia. Kun selain kysyy näitä, vastaa "Salli".
            <ul>
                <li>📍 <strong>Sijainti (GPS):</strong> Tämä on sovelluksen sydän. Se tarvitaan nopeuden, matkan, reitin ja sään määrittämiseen. Varmista puhelimen asetuksista, että selaimella on oikeus käyttää "Tarkkaa sijaintia" (Precise Location).</li>
                <li>📱 <strong>Liikeanturit (Motion & Orientation):</strong> Sovellus käyttää puhelimen kiihtyvyysanturia (kiihtyvyysmittari) tunnistaakseen auton äkilliset liikkeet (jarrutus, kiihdytys, kaarreajo).
                <br><em>iPhone (iOS) huomio:</em> Apple vaatii, että käyttäjä antaa tälle erillisen luvan ponnahdusikkunassa. Jos kiellät tämän, "Eco-mittari" ei toimi, mutta muut ominaisuudet toimivat normaalisti.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>Asennus (PWA - Progressive Web App):</strong>
            Vaikka tämä toimii selaimessa, se on suunniteltu asennettavaksi puhelimeen "sovellukseksi". Tämä poistaa selaimen osoitepalkit, antaa enemmän ruututilaa ja parantaa GPS:n toimintavarmuutta taustalla.
            <br><br>
            <strong>iPhone / iPad (Safari):</strong>
            <br>1. Paina "Jaa"-painiketta (neliö, josta osoittaa nuoli ylöspäin).
            <br>2. Rullaa valikkoa alaspäin.
            <br>3. Valitse "Lisää Koti-valikkoon" (Add to Home Screen).
            <br><br>
            <strong>Android (Chrome):</strong>
            <br>1. Paina selaimen valikkopainiketta (kolme pistettä oikeassa yläkulmassa).
            <br>2. Valitse "Asenna sovellus" tai "Lisää aloitusnäyttöön".
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ 2. Autotalli: Ajoneuvojen Hallinta</h3>
        <p>Jotta ajopäiväkirja olisi hyödyllinen, on tärkeää erotella millä laitteella liikut. "Autotalli"-ominaisuus mahdollistaa useiden ajoneuvojen hallinnan.</p>
        
        <div class="help-step">
            <strong>Ajoneuvon Lisääminen:</strong>
            Mene valikosta kohtaan <strong>⚙️ Asetukset (Tallit)</strong> ja paina "Lisää ajoneuvo".
            <br>Tärkein valinta on <strong>Tyyppi</strong>, sillä se muuttaa koko sovelluksen toimintalogiikkaa:
            <br><br>
            <strong>🚗 Tyyppi: Auto</strong>
            <ul>
                <li><strong>Ominaisuudet:</strong> Eco-mittari on PÄÄLLÄ (analysoi ajotapaa). Kartta käyttää laajempaa zoomausta maantienopeuksissa.</li>
                <li><strong>Tiedot:</strong> Voit tallentaa rekisterinumeron, käyttövoiman (Bensa/Diesel/Sähkö/Hybridi) ja tankin koon.</li>
            </ul>
            <strong>🚲 Tyyppi: Polkupyörä</strong>
            <ul>
                <li><strong>Ominaisuudet:</strong> Eco-mittari on POIS PÄÄLTÄ. Tämä siksi, että pyöräillessä puhelin tärisee ja heiluu tangossa luonnostaan, mikä aiheuttaisi jatkuvia virheellisiä "Aggressiivinen ajo" -hälytyksiä.</li>
                <li><strong>Kartta:</strong> Käyttää huomattavasti tarkempaa zoomausta, jotta erotat metsäpolut ja pyörätiet.</li>
                <li><strong>Tiedot:</strong> Yksinkertaistettu lomake (vain nimi).</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>Ajoneuvon Valinta ennen ajoa:</strong>
            Sovelluksen yläpalkissa (logon vieressä) on alasvetovalikko.
            <br>👉 <strong>Muista aina valita oikea ajoneuvo ennen kuin painat "Aloita tallennus"!</strong>
            <br>Valinta tallentuu laitteen muistiin, joten jos ajat aina samalla autolla, sinun ei tarvitse koskea tähän.
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 3. Mittaristo ja Live-seuranta</h3>
        <p>Mittaristonäkymä on optimoitu selkeäksi ja häiriöttömäksi ajon ajaksi. Se näyttää vain olennaisen tiedon suurella fontilla.</p>

        <div class="help-step">
            <strong>Datanäyttöjen selitteet:</strong>
            <ul>
                <li><strong>Nopeus (km/h):</strong> Tämänhetkinen nopeus GPS-satelliittien mukaan. Huomaa, että auton oma mittari näyttää usein n. 3-5 km/h liikaa, kun taas GPS on tarkka.</li>
                <li><strong>Huippu (km/h):</strong> Tallennuksen aikana saavutettu korkein nopeus.</li>
                <li><strong>Matka (REC):</strong> Tämänhetkisen tallennuksen kerryttämä matka. Tämä ei etene, jos tallennus on "Tauko"-tilassa.</li>
                <li><strong>Suunta:</strong> Näyttää kompassisuunnan (esim. "NE 45°" = Koillinen) ja nuolen. Vaatii liikettä toimiakseen tarkasti.</li>
                <li><strong>Korkeus (m):</strong> Korkeus merenpinnasta. Tarkkuus riippuu puhelimen GPS-sirusta (yleensä +/- 10m).</li>
                <li><strong>Sää:</strong> Sovellus hakee automaattisesti sijaintisi perusteella lähimmän säähavaintoaseman tiedot (Lämpötila + Sääikoni). Sää päivittyy automaattisesti taustalla.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>🏎️ Eco-mittari (Toimii vain AUTO-tilassa):</strong>
            Yläreunan "Status Bar" sisältää värillisen palkin, joka on reaaliaikainen palaute ajotavastasi:
            <ul>
                <li><span style="color:#00c853; font-weight:bold;">🟢 Vihreä (Taloudellinen):</span> Ajat rauhallisesti, ennakoivasti ja tasaisesti. Tämä säästää polttoainetta ja renkaita.</li>
                <li><span style="color:#ff1744; font-weight:bold;">🔴 Punainen (Kiihdytys/Jarrutus):</span> Puhelimen anturi havaitsi voimakkaan G-voiman (yli 3.5 m/s²). Tämä voi johtua rajusta kiihdytyksestä, äkkijarrutuksesta tai tiukasta kaarteesta kovalla vauhdilla. Palkki välähtää punaisena ja palaa vihreäksi hetken kuluttua, jos ajo tasaantuu.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🔴 4. Ajon Tallennusprosessi</h3>
        <div class="help-step">
            <strong>1. Aloitus:</strong>
            Paina vihreää <strong>🔴 ALOITA TALLENNUS</strong> -painiketta.
            <br>-> Matkamittari nollautuu.
            <br>-> Ajanotto alkaa.
            <br>-> Keskinopeuden laskenta alkaa.
        </div>
        
        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>2. Tauko (Keltainen ⏸ TAUKO -nappi):</strong><br>
            Tätä on tärkeä käyttää oikein. Käytä tätä, kun pysähdyt kauppaan, lounaalle tai tankkaamaan, mutta haluat jatkaa samaa "ajoa" myöhemmin.
            <br><strong>Mitä tapahtuu tauolla?</strong>
            <ul>
                <li>GPS-sijainnin tallennus pysähtyy (ei piirrä suttua kartalle kaupassa kävellessä).</li>
                <li>Ajanotto pysähtyy (tauko ei vääristä ajoaikaa).</li>
                <li>Keskinopeuden laskenta "jäätyy" (keskinopeus ei romahda nollaan tauon aikana).</li>
            </ul>
            Kun olet valmis jatkamaan, paina sinistä <strong>▶ JATKA</strong> -nappia.
        </div>

        <div class="help-step">
            <strong>3. Lopetus ja Tallennus:</strong>
            Kun olet lopullisesti perillä, paina punaista <strong>⬛ LOPETA</strong> -nappia.
            <br>Ruudulle aukeaa yhteenvetoikkuna, jossa näet matkan ja ajan.
            <ul>
                <li><strong>Tarkista ajoneuvo:</strong> Ikkunassa lukee millä ajoneuvolla ajo tallennetaan.</li>
                <li><strong>Kirjoita aihe:</strong> Esim. "Työmatka", "Kauppareissu", "Pyörälenkki". Tämä auttaa löytämään ajon historiasta.</li>
                <li><strong>Tallenna:</strong> Paina vihreää nappia, ja tiedot siirtyvät pilveen.</li>
            </ul>
        </div>
        
        <div class="help-step">
            <strong>⚠️ Tärkeä huomio tausta-ajosta (WhatsApp / Muut sovellukset):</strong>
            Jos poistut Ajopäiväkirjasta kesken tallennuksen (esim. vastaamaan WhatsApp-viestiin), useimmat puhelimet katkaisevat selaimen GPS-yhteyden virran säästämiseksi.
            <br><strong>Seuraukset:</strong> Matkaa ei kerry taustalla olon aikana.
            <br><strong>Korjaus:</strong> Sovelluksessa on nyt "älykäs paikkaus". Kun palaat sovellukseen, se huomaa hypyn sijainnissa ja vetää suoran viivan edellisestä pisteestä nykyiseen (max 50km hyppy). Matka ei siis jää nollaan, mutta se on "linnuntie" siltä väliltä.
            <br><em>Suositus: Pidä sovellus auki näytöllä aina kun mahdollista tarkimman tuloksen saamiseksi.</em>
        </div>
    </div>

    <div class="help-section">
        <h3>📋 5. Historia, Raportointi ja Muokkaus</h3>
        <p>Historia-sivu ei ole vain lista, vaan työkalu ajojen analysointiin.</p>

        <div class="help-step">
            <strong>Suodatus (Filtteröinti):</strong>
            Voit etsiä tiettyjä ajoja yhdistelemällä kahta suodatinta:
            <br><strong>1. Ajoneuvo-suodatin (Yläpalkki):</strong>
            <br>Valitse "Kaikki ajoneuvot" nähdäksesi kaiken. Valitse "Mazda" nähdäksesi vain Mazdan ajot. Valitse "Polkupyörä" nähdäksesi vain lenkit.
            <br><strong>2. Aikaväli-suodatin (Listan yläpuolella):</strong>
            <ul>
                <li><em>Kaikki ajot:</em> Näyttää kaiken alusta asti.</li>
                <li><em>Vuosi (esim. 2025):</em> Näyttää koko vuoden yhteenvedon.</li>
                <li><em>Kuukausi (esim. Joulukuu):</em> Kätevä kuukausiraportointiin.</li>
                <li><em>Mukautettu aikaväli:</em> Valitse itse alkupäivä ja loppupäivä kalenterista.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>Yhteenvetolaatikko:</strong>
            Heti suodattimien alapuolella on laatikko, joka laskee luvut yhteen valitsemillasi ehdoilla:
            <br>Esim. Jos valitset "Mazda" ja "Joulukuu", näet paljonko ajoit juuri Mazdalla joulukuussa yhteensä (KM, KPL, AIKA).
        </div>

        <div class="help-step">
            <strong>✏️ Tietojen Muokkaus (Korjaus):</strong>
            Teitkö virheen? Valitsitko vahingossa väärän auton tai kirjoititko väärän aiheen?
            <br>1. Etsi kyseinen ajo historiasta.
            <br>2. Paina kortin oikeassa yläkulmassa olevaa <strong>kynä-ikonia (✏️)</strong>.
            <br>3. Avautuvassa ikkunassa voit vaihtaa ajoneuvon toiseksi tai korjata tekstin.
            <br>4. Tallenna, ja ajo siirtyy oikean auton tilastoihin välittömästi.
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ 6. Kartta ja Älykäs Zoom</h3>
        <p>Kartta on suunniteltu elämään tilanteen mukaan. Et tarvitse käsiä zoomailuun, sovellus tekee sen puolestasi.</p>
        
        <div class="help-step">
            <strong>🚗 Autolla ajettaessa:</strong>
            Kartta ymmärtää nopeutesi ja säätää näkymää:
            <ul>
                <li><strong>0 - 40 km/h:</strong> Zoom 18 (Lähikuva). Näet talot, pihatiet ja risteykset tarkasti. Hyvä kaupunkiajoon ja parkkipaikan etsintään.</li>
                <li><strong>40 - 70 km/h:</strong> Zoom 17. Hieman loitompi näkymä taajama-ajoon.</li>
                <li><strong>70 - 100 km/h:</strong> Zoom 16. Näet kauemmas eteenpäin maantiellä.</li>
                <li><strong>Yli 100 km/h:</strong> Zoom 14 (Yleiskuva). Näet moottoritiellä liittymät ja kaupungit kaukaa ennakoiden.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>🚲 Polkupyörällä ajettaessa:</strong>
            Pyöräillessä on tärkeää nähdä pienetkin polut.
            <ul>
                <li><strong>0 - 15 km/h:</strong> Zoom 19 (Erittäin tarkka). Näet metsäpolut ja kevyenliikenteenväylät yksityiskohtaisesti.</li>
                <li><strong>Yli 15 km/h:</strong> Zoom 17. Kun vauhti kasvaa (esim. alamäessä tai maantiellä), kartta loitontaa hieman, jotta näet mihin tie vie.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>❓ Vianmääritys ja UKK</h3>
        <div class="help-step">
            <strong>K: Näyttö sammuu itsestään ajon aikana?</strong>
            <br>V: Sovellus käyttää "Wake Lock" -tekniikkaa pitääkseen näytön päällä. Kuitenkin, jos puhelimesi akku on vähissä ja "Virransäästötila" on päällä, puhelin voi pakottaa näytön kiinni.
            <br><em>Ratkaisu:</em> Lataa puhelinta ajon aikana tai kytke virransäästö pois.
        </div>
        <div class="help-step">
            <strong>K: Nopeus näyttää nollaa tai hyppii?</strong>
            <br>V: Tämä johtuu huonosta GPS-signaalista. Oletko sisätiloissa, tunnelissa tai korkeiden rakennusten välissä?
            <br><em>Ratkaisu:</em> Siirry aukealle paikalle.
        </div>
        <div class="help-step">
            <strong>K: Autoa ei ilmesty listalle lisäyksen jälkeen?</strong>
            <br>V: Tämä voi johtua yhteysongelmasta tietokantaan.
            <br><em>Ratkaisu:</em> Päivitä sivu (vedä alas tai paina refresh) ja kokeile uudestaan. Varmista, että olet kirjautunut sisään.
        </div>
    </div>

    <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
        Ajopäiväkirja Pro v3.7 &copy; 2025<br>
        Kehitetty intohimolla autoilijoille ja pyöräilijöille.
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
