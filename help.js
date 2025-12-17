const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 30px; border-bottom: 2px solid var(--accent-color); padding-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Mikkokalevin Ajopäiväkirja Pro – Käyttöopas v4.2</h2>
    
    <div class="help-section">
        <h3>🚀 1. Käyttöönotto ja Tili</h3>
        <p>Tämä osio varmistaa, että saat sovelluksen toimimaan oikein heti alusta alkaen ja ymmärrät, miten tietojasi käsitellään.</p>
        
        <div class="help-step">
            <strong>Kirjautuminen (Kaksi tapaa):</strong>
            Sovellus vaatii kirjautumisen, jotta tietosi pysyvät turvassa henkilökohtaisessa pilvitietokannassa. Näin ajohistoria, autotalli ja asetukset siirtyvät mukanasi, vaikka vaihtaisit puhelinta tai käyttäisit sovellusta tietokoneella.
            <br><br>
            <strong>A) Google-tili (Suositeltu):</strong>
            <br>Nopein ja helpoin tapa. Klikkaa "Kirjaudu Googlella". Sovellus käyttää tiliäsi vain tunnistautumiseen.
            <br><br>
            <strong>B) Sähköposti ja Salasana:</strong>
            <br>Tämä on kätevä vaihtoehto, jos haluat pitää ajopäiväkirjan erillään Google-tilistäsi tai käytät jo Perhekalenteri-sovellusta samoilla tunnuksilla.
            <br><em>Uusi käyttäjä?</em> Syötä sähköposti ja haluamasi salasana -> Paina "Luo tunnus".
            <br><em>Vanha käyttäjä?</em> Syötä tunnukset -> Paina "Kirjaudu".
        </div>

        <div class="help-step">
            <strong>Vaaditut Käyttöoikeudet (Luvat):</strong>
            Ensimmäisellä käynnistyksellä selain kysyy lupia. On kriittistä vastata näihin <strong>"Salli"</strong>, jotta sovellus toimii.
            <ul>
                <li>📍 <strong>Sijainti (GPS):</strong> Sovelluksen sydän. Ilman tätä nopeus, matka ja reitti eivät toimi. Varmista puhelimen asetuksista, että selaimella (Chrome/Safari) on oikeus käyttää "Tarkkaa sijaintia" (Precise Location).</li>
                <li>📱 <strong>Liikeanturit (Motion & Orientation):</strong> Tätä käytetään "Eco-mittarin" toimintaan (kiihtyvyyden ja jarrutuksen tunnistus).
                <br><em>iPhone (iOS) huomio:</em> Apple vaatii, että käyttäjä antaa tälle erillisen luvan ponnahdusikkunassa. Jos kiellät tämän, Eco-palkki ei toimi, mutta muut ominaisuudet toimivat normaalisti.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>Asennus (PWA - App-kokemus):</strong>
            Vaikka tämä on verkkosivu, se on suunniteltu toimimaan kuten "oikea" sovellus. Suosittelemme lisäämään sen kotivalikkoon. Tämä poistaa osoitepalkit, antaa koko ruudun tilan ja parantaa GPS:n toimintavarmuutta taustalla.
            <br><em>iPhone (Safari):</em> Paina "Jaa"-painiketta (neliö ja nuoli) -> Valitse listasta "Lisää Koti-valikkoon" (Add to Home Screen).
            <br><em>Android (Chrome):</em> Paina valikkoa (kolme pistettä) -> Valitse "Asenna sovellus" tai "Lisää aloitusnäyttöön".
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ 2. Autotalli: Ajoneuvojen Hallinta</h3>
        <p>Jotta tilastot pysyvät järkevinä, on tärkeää erotella millä laitteella liikut. "Autotalli"-ominaisuus mahdollistaa useiden ajoneuvojen hallinnan.</p>
        
        <div class="help-step">
            <strong>Ajoneuvon Lisääminen:</strong>
            Mene valikosta kohtaan <strong>⚙️ Asetukset (Tallit)</strong> ja paina "Lisää ajoneuvo".
            <br>Tärkein valinta on <strong>Tyyppi</strong>, sillä se muuttaa sovelluksen toimintalogiikkaa:
            <br><br>
            <strong>🚗 Tyyppi: Auto</strong>
            <ul>
                <li><strong>Ominaisuudet:</strong> Eco-mittari on PÄÄLLÄ (analysoi ajotapaa). Kartta käyttää laajempaa zoomausta maantienopeuksissa (Zoom 14-18).</li>
                <li><strong>Tiedot:</strong> Voit tallentaa rekisterinumeron, käyttövoiman (Bensa/Diesel/Sähkö/Hybridi) ja tankin koon.</li>
            </ul>
            <strong>🚲 Tyyppi: Polkupyörä</strong>
            <ul>
                <li><strong>Ominaisuudet:</strong> Eco-mittari on POIS PÄÄLTÄ. Tämä siksi, että pyöräillessä puhelin tärisee ja heiluu tangossa luonnostaan, mikä aiheuttaisi jatkuvia virheellisiä "Aggressiivinen ajo" -hälytyksiä.</li>
                <li><strong>Kartta:</strong> Käyttää huomattavasti tarkempaa zoomausta (Zoom 19), jotta erotat metsäpolut ja pyörätiet.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>Ajoneuvon Valinta ennen ajoa:</strong>
            Sovelluksen yläpalkissa (logon vieressä) on alasvetovalikko.
            <br>👉 <strong>Muista aina valita oikea ajoneuvo ennen kuin painat "Aloita tallennus"!</strong>
            <br>Valinta tallentuu laitteen muistiin seuraavaa kertaa varten.
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 3. Mittaristo ja Navigointi</h3>
        <p>Mittaristo on suunniteltu näyttäväksi ja selkeäksi, jotta tieto on luettavissa yhdellä silmäyksellä.</p>

        <div class="help-step">
            <strong>Datanäyttöjen selitteet:</strong>
            <ul>
                <li><strong>Nopeus (km/h):</strong> Tämänhetkinen nopeus GPS-satelliittien mukaan. Huomaa, että auton oma mittari näyttää usein n. 3-5 km/h liikaa, kun taas GPS on tarkka.</li>
                <li><strong>Huippu (km/h):</strong> Tallennuksen aikana saavutettu korkein nopeus.</li>
                <li><strong>Matka (REC):</strong> Tämänhetkisen tallennuksen kerryttämä matka. Tämä ei etene, jos tallennus on "Tauko"-tilassa.</li>
                <li><strong>Suunta:</strong> Näyttää kompassisuunnan (esim. "NE" = Koillinen) ja asteet. Vaatii liikettä toimiakseen tarkasti.</li>
                <li><strong>Korkeus (m):</strong> Korkeus merenpinnasta. Tarkkuus riippuu puhelimen GPS-sirusta (yleensä +/- 10m).</li>
                <li><strong>Sää:</strong> Sovellus hakee automaattisesti sijaintisi perusteella lähimmän säähavaintoaseman tiedot (Lämpötila + Sääikoni).</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>🏠 Koti-painike (Logo):</strong>
            Voit palata miltä tahansa sivulta (Historia, Kartta, Asetukset) takaisin mittaristoon painamalla vasemmassa yläkulmassa olevaa <strong>pyöreää logoa</strong>.
        </div>

        <div class="help-step">
            <strong>🏎️ Eco-mittari ja Värit (Vain autoille):</strong>
            Sekä yläreunan palkki että nopeusnumeron väri reagoivat ajotapaasi:
            <ul>
                <li><span style="color:var(--speed-color); font-weight:bold;">🔵 Sininen / 🟢 Vihreä (Taloudellinen):</span> Ajat tasaisesti, ennakoivasti ja rauhallisesti. Tämä on tavoitetila.</li>
                <li><span style="color:#ff1744; font-weight:bold;">🔴 Punainen (Kiihdytys/Jarrutus):</span> Puhelimen anturi havaitsi voimakkaan G-voiman (yli 3.5 m/s²). Tämä voi johtua rajusta kiihdytyksestä, äkkijarrutuksesta tai tiukasta kaarteesta kovalla vauhdilla. Tällöin nopeuslukema välähtää punaisena.</li>
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
            <br>-> Kartalle alkaa piirtyä sininen viiva.
        </div>
        
        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>2. Tauko (Keltainen ⏸ TAUKO -nappi):</strong><br>
            Tätä on tärkeä käyttää oikein. Käytä tätä, kun pysähdyt kauppaan, lounaalle tai tankkaamaan.
            <br><strong>Mitä tapahtuu tauolla?</strong>
            <ul>
                <li>GPS-sijainnin ja matkan tallennus pysähtyy (ei piirrä suttua kartalle kaupassa kävellessä).</li>
                <li>Ajanotto pysähtyy (tauko ei vääristä ajoaikaa).</li>
                <li>Keskinopeuden laskenta "jäätyy".</li>
            </ul>
            Kun olet valmis jatkamaan, paina sinistä <strong>▶ JATKA</strong> -nappia.
        </div>

        <div class="help-step">
            <strong>3. Lopetus ja Tallennus:</strong>
            Kun olet perillä, paina punaista <strong>⬛ LOPETA</strong> -nappia.
            <br>Ruudulle aukeaa yhteenvetoikkuna.
            <ul>
                <li>Tarkista ajoneuvo.</li>
                <li>Kirjoita aihe (esim. "Työmatka").</li>
                <li>Paina "Tallenna". <strong>Huom:</strong> Nyt myös ajettu reitti tallentuu pilveen!</li>
            </ul>
        </div>
        
        <div class="help-step">
            <strong>⚠️ Tausta-ajo (WhatsApp / Muut sovellukset):</strong>
            Jos poistut sovelluksesta kesken ajon (esim. vastaamaan viestiin), useimmat puhelimet katkaisevat selaimen GPS-yhteyden virran säästämiseksi.
            <br><strong>Seuraukset:</strong> Matkaa ei kerry taustalla olon aikana ja reittiviivaan tulee hyppy.
            <br><strong>Korjaus:</strong> Sovelluksessa on "älykäs paikkaus". Kun palaat sovellukseen, se huomaa hypyn ja vetää suoran viivan edellisestä pisteestä nykyiseen (max 50km hyppy).
            <br><em>Suositus: Pidä sovellus auki näytöllä aina kun mahdollista tarkimman tuloksen saamiseksi.</em>
        </div>
    </div>

    <div class="help-section">
        <h3>📋 5. Historia ja 🗺️ Reitin Katselu</h3>
        <p>Historia-sivu on ajopäiväkirjasi arkisto.</p>

        <div class="help-step">
            <strong>Suodatus:</strong>
            Voit etsiä ajoja kahdella ehdolla:
            <br>1. <strong>Ajoneuvo (Yläpalkki):</strong> Valitse auto nähdäksesi vain sen ajot.
            <br>2. <strong>Aikaväli:</strong> Valitse "Vuosi", "Kuukausi" tai oma aikaväli.
        </div>

        <div class="help-step">
            <strong>Yhteenvetolaatikko:</strong>
            Laskee yhteen valitun jakson kilometrit, ajokerrat ja ajan.
        </div>

        <div class="help-step">
            <strong>🗺️ Reitin katselu kartalla:</strong>
            Kun tallennat ajon tällä versiolla (4.1+), myös GPS-jälki tallentuu.
            <br>Historia-listassa näkyy tällöin pieni <strong>karttaikoni (🗺️)</strong>.
            <br>Painamalla sitä siirryt karttanäkymään, jossa kyseinen reitti piirretään <strong>oranssilla viivalla</strong>. Voit zoomata ja tarkastella missä ajoit.
            <br><em>Huom: Vanhoissa ajoissa (ennen v4.1) ei ole reittidataa, joten niissä ikonia ei näy.</em>
        </div>

        <div class="help-step">
            <strong>✏️ Muokkaus:</strong>
            Painamalla kynä-ikonia (✏️) voit jälkikäteen vaihtaa ajon toiselle autolle tai korjata otsikkoa.
        </div>
    </div>

    <div class="help-section">
        <h3>📊 6. Tilastot (UUSI)</h3>
        <p>Visuaalinen katsaus ajohistoriaan (löytyy valikosta "Tilastot").</p>
        <div class="help-step">
            Tämä sivu laskee automaattisesti yhteen kaiken tallennetun datasi:
            <ul>
                <li><strong>Pylväsdiagrammi:</strong> Näyttää ajetut kilometrit kuukausitasolla (viimeiset 6kk). Auttaa hahmottamaan ajomäärien kehitystä ja vuodenaikojen vaihtelua.</li>
                <li><strong>Piirakkakuvio (Donitsi):</strong> Näyttää miten kilometrit jakautuvat eri ajoneuvojen kesken. Näet heti, millä autolla tai pyörällä on ajettu eniten.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ 7. Kartta ja Tasot</h3>
        <div class="help-step">
            <strong>Älykäs Zoom:</strong>
            <ul>
                <li><strong>Autolla:</strong> Kartta loitontaa maantienopeuksissa (Zoom 14-16) ja lähentää kaupungissa (Zoom 18).</li>
                <li><strong>Pyörällä:</strong> Kartta pysyy lähikuvassa (Zoom 19), jotta näet polut. Jos vauhti nousee yli 15km/h, se loitontaa hieman.</li>
            </ul>
        </div>
        <div class="help-step">
            <strong>Karttatasot (Layers):</strong>
            Oikean yläkulman kerros-ikonista voit valita pohjakartan:
            <ul>
                <li><strong>Peruskartta:</strong> Selkeä tiekartta (OpenStreetMap).</li>
                <li><strong>Satelliitti:</strong> Ilmakuva (Esri).</li>
                <li><strong>Maastokartta (UUSI):</strong> Näyttää korkeuskäyrät ja maastonmuodot (OpenTopoMap). Erinomainen maastopyöräilyyn ja retkeilyyn.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>❓ 8. Vianmääritys ja UKK (FAQ)</h3>
        
        <div class="help-step">
            <strong>K: Näyttö sammuu itsestään ajon aikana?</strong>
            <br>V: Sovellus käyttää "Wake Lock" -tekniikkaa pitääkseen näytön päällä. Kuitenkin, jos puhelimesi akku on vähissä ja "Virransäästötila" on päällä, puhelin voi silti pakottaa näytön kiinni.
            <br><em>Ratkaisu:</em> Kytke virransäästö pois tai lataa puhelinta ajon aikana.
        </div>

        <div class="help-step">
            <strong>K: Reitti on vain suora viiva pisteestä A pisteeseen B?</strong>
            <br>V: Tämä tarkoittaa, että sovellus ei ole saanut GPS-tietoja matkan aikana. Todennäköisesti näyttö on ollut kiinni tai sovellus on ollut taustalla (esim. olet käyttänyt WhatsAppia) pitkään.
            <br><em>Ratkaisu:</em> Pidä sovellus auki näytöllä ajon aikana.
        </div>

        <div class="help-step">
            <strong>K: Nopeus näyttää nollaa tai hyppii holtittomasti?</strong>
            <br>V: Tämä johtuu heikosta GPS-signaalista. Oletko sisätiloissa, tunnelissa tai korkeiden rakennusten välissä?
            <br><em>Ratkaisu:</em> GPS toimii vain ulkona, kun on suora näköyhteys taivaalle.
        </div>

        <div class="help-step">
            <strong>K: Auto ei tallennu listalle asetuksissa?</strong>
            <br>V: Varmista, että olet kirjautunut sisään. Jos yhteys pätkii, tietokantayhteys voi katketa.
            <br><em>Ratkaisu:</em> Päivitä sivu (vedä alas tai paina selaimen refresh) ja kokeile uudestaan.
        </div>

        <div class="help-step">
            <strong>K: Miksi kartasta ei voi hakea osoitteita?</strong>
            <br>V: Tämä sovellus on ensisijaisesti "Tracker" (seuranta), ei "Navigaattori". Osoitehaku vaatisi maksullisia lisenssejä (kuten Google Maps API), jotka tekisivät sovelluksesta maksullisen.
        </div>

        <div class="help-step">
            <strong>K: Miksi Eco-mittari ei toimi pyörällä?</strong>
            <br>V: Polkupyörän ohjaustanko tärisee ja heiluu luonnostaan paljon enemmän kuin auto. Tämä aiheuttaisi jatkuvia virheellisiä hälytyksiä "aggressiivisesta ajosta", joten ominaisuus on kytketty pois päältä pyörä-moodissa.
        </div>
    </div>

    <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
        Mikkokalevin Ajopäiväkirja Pro v4.2 &copy; 2025<br>
        Täyden palvelun ajoseuranta.
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
