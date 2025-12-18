const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 30px; border-bottom: 2px solid var(--accent-color); padding-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Mikkokalevin Ajopäiväkirja Pro – Käyttöopas v4.9.1</h2>
    
    <div class="help-section">
        <h3>🚀 1. Käyttöönotto ja Tili</h3>
        <p>Tämä osio varmistaa, että saat sovelluksen toimimaan oikein heti alusta alkaen ja ymmärrät, miten tietojasi käsitellään.</p>
        
        <div class="help-step">
            <strong>Kirjautuminen (Kaksi tapaa):</strong>
            Sovellus vaatii kirjautumisen, jotta kaikki tietosi (ajot, tankkaukset, autot ja asetukset) pysyvät turvassa henkilökohtaisessa pilvitietokannassa. Näin tiedot siirtyvät mukanasi, vaikka vaihtaisit puhelinta tai käyttäisit sovellusta tietokoneella.
            <br><br>
            <strong>A) Google-tili (Suositeltu):</strong>
            <br>Nopein ja vaivattomin tapa. Klikkaa "Kirjaudu Googlella". Sovellus käyttää tiliäsi vain tunnistautumiseen, eikä lähetä sähköpostia.
            <br><br>
            <strong>B) Sähköposti ja Salasana:</strong>
            <br>Tämä on perinteinen vaihtoehto.
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
        <h3>⛽ 2. Tankkaus ja Kuluseuranta (Versio 4.9.1)</h3>
        <p>Sovellus sisältää nyt täysiverisen polttoainekirjanpidon, joka laskee kulutuksen ja kustannukset automaattisesti.</p>

        <div class="help-step">
            <strong>Miten lisään tankkauksen?</strong>
            <br>Sinulla on kaksi tapaa kirjata tankkaus:
            <br>1. <strong>Mittaristosta (Nopein):</strong> Paina kellonajan oikealla puolella olevaa violettia <strong>⛽-painiketta</strong>. Tämä avaa tankkausikkunan <em>sille autolle, joka on valittuna yläpalkin valikossa</em>.
            <br>2. <strong>Asetuksista:</strong> Mene Asetukset-sivulle, etsi haluamasi auto listasta ja paina sen kohdalla olevaa ⛽-ikonia.
        </div>

        <div class="help-step">
            <strong>Mitä tietoja syötän?</strong>
            <ul>
                <li><strong>Mittarilukema (km):</strong> Syötä auton matkamittarin lukema tankkaushetkellä. Tämä on kriittinen tieto kulutuksen laskemiseen.</li>
                <li><strong>Litrat (l) / kWh:</strong> Paljonko tankkasit tai latasit energiaa.</li>
                <li><strong>Hinta (€):</strong> Koko tankkauksen loppusumma euroina.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>Älykäs laskenta (Reaaliaikainen):</strong>
            Kun kirjoitat lukuja kenttiin, sovellus laskee heti:
            <ul>
                <li><strong>Litrahinnan (€/l):</strong> Näet heti, oliko polttoaine kallista vai halpaa.</li>
                <li><strong>Keskikulutuksen (l/100km):</strong> Sovellus etsii tietokannasta kyseisen auton <em>edellisen</em> tankkauksen kilometrit. Se laskee ajetun matkan (Nykyinen km - Edellinen km) ja jakaa tankatut litrat tällä matkalla.
                <br><em>Huom: Ensimmäisellä tankkauskerralla kulutusta ei voida laskea, koska vertailukohta puuttuu. Se alkaa toimia toisesta tankkauksesta alkaen.</em></li>
            </ul>
        </div>

        <div class="help-step">
            <strong>Muokkaus ja Poisto:</strong>
            Kirjoititko väärin? Ei hätää.
            <br>Mene <strong>Historia</strong>-sivulle -> Valitse välilehti <strong>[ ⛽ Tankkaukset ]</strong>.
            <br>Etsi virheellinen rivi ja paina <strong>kynä-ikonia (✏️)</strong> muokataksesi tai poistaaksesi merkinnän.
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ 3. Autotalli: Kaluston Hallinta</h3>
        <p>Jotta tilastot pysyvät järkevinä, on tärkeää erotella millä laitteella liikut. "Autotalli"-ominaisuus mahdollistaa useiden ajoneuvojen hallinnan.</p>
        
        <div class="help-step">
            <strong>Ajoneuvon Lisääminen ja Muokkaus:</strong>
            Mene valikosta kohtaan <strong>⚙️ Asetukset (Tallit)</strong>.
            <br>Painamalla <strong>"Muokkaa" (✏️)</strong> voit korjata tietoja tai vaihtaa <strong>auton ikonia</strong>.
            <br>Valittavana on laaja valikoima eri värisiä autoja ja muita kulkuneuvoja (esim. 🚗, 🚙, 🏎️, 🚌, 🏍️, 🚤). Valitsemasi ikoni päivittyy automaattisesti kaikkialle sovellukseen – myös vanhoihin historiatiedostoihin.
        </div>

        <div class="help-step">
            <strong>Tyyppi-valinta (Tärkeä!):</strong>
            Tärkein valinta on Tyyppi, sillä se muuttaa sovelluksen toimintalogiikkaa:
            <br><strong>🚗 Auto:</strong> Eco-mittari on PÄÄLLÄ. Kartta käyttää laajempaa zoomia (kaupunkiajo/maantie). Reitti värittyy punaiseksi 100km/h kohdalla.
            <br><strong>🚲 Pyörä:</strong> Eco-mittari on POIS (koska puhelin tärisee pyörän tangossa). Kartta on tarkassa lähikuvassa (Zoom 19). Reitti värittyy punaiseksi 30km/h kohdalla.
        </div>

        <div class="help-step">
            <strong>Ajoneuvon Valinta ennen ajoa:</strong>
            Sovelluksen yläpalkissa (logon vieressä) on alasvetovalikko.
            <br>👉 <strong>Muista aina valita oikea ajoneuvo ennen kuin painat "Aloita tallennus"!</strong>
            <br>Valinta tallentuu laitteen muistiin seuraavaa kertaa varten.
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 4. Mittaristo ja Ajaminen</h3>
        <p>Mittaristo on ajon aikainen komentokeskus, joka on suunniteltu luettavaksi yhdellä silmäyksellä.</p>

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
            Sekä yläreunan palkki että nopeusnumeron väri reagoivat ajotapaasi reaaliajassa:
            <ul>
                <li><span style="color:var(--speed-color); font-weight:bold;">🔵 Sininen / 🟢 Vihreä (Taloudellinen):</span> Ajat tasaisesti, ennakoivasti ja rauhallisesti. Tämä on tavoitetila.</li>
                <li><span style="color:#ff1744; font-weight:bold;">🔴 Punainen (Kiihdytys/Jarrutus):</span> Puhelimen anturi havaitsi voimakkaan G-voiman (yli 3.5 m/s²). Tämä voi johtua rajusta kiihdytyksestä, äkkijarrutuksesta tai tiukasta kaarteesta kovalla vauhdilla. Tällöin nopeuslukema välähtää punaisena.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🔴 5. Ajon Tallennusprosessi</h3>
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
                <li>Tarkista ajoneuvo (että se meni oikealle autolle).</li>
                <li>Kirjoita aihe (esim. "Työmatka", "Mökkireissu").</li>
                <li>Paina "Tallenna". <strong>Huom:</strong> Myös ajettu reitti tallentuu pilveen, sisältäen nopeustiedot väripiirtoa varten!</li>
            </ul>
        </div>
        
        <div class="help-step">
            <strong>⚠️ Tausta-ajo (WhatsApp / Muut sovellukset):</strong>
            Jos poistut sovelluksesta kesken ajon (esim. vastaamaan viestiin), useimmat puhelimet katkaisevat selaimen GPS-yhteyden virran säästämiseksi.
            <br><strong>Seuraukset:</strong> Matkaa ei kerry taustalla olon aikana ja reittiviivaan tulee "hyppy".
            <br><strong>Korjaus:</strong> Sovelluksessa on "älykäs paikkaus". Kun palaat sovellukseen, se huomaa hypyn ja vetää suoran viivan edellisestä pisteestä nykyiseen (max 50km hyppy).
            <br><em>Suositus: Pidä sovellus auki näytöllä aina kun mahdollista tarkimman tuloksen saamiseksi.</em>
        </div>
    </div>

    <div class="help-section">
        <h3>📋 6. Historia ja 🗺️ Reitin Katselu</h3>
        <p>Historia-sivu on arkistosi, joka on nyt jaettu kahteen selkeään osioon.</p>

        <div class="help-step">
            <strong>Välilehdet:</strong>
            Sovelluksessa on nyt kaksi välilehteä historian yläreunassa:
            <br>1. <strong>[ 🚗 Ajot ]:</strong> Listaa kaikki ajetut matkat, niiden pituudet ja kestot.
            <br>2. <strong>[ ⛽ Tankkaukset ]:</strong> Listaa kaikki tehdyt tankkaukset, hinnat ja litramäärät.
        </div>

        <div class="help-step">
            <strong>Suodatus:</strong>
            Voit etsiä tietoja kahdella ehdolla:
            <br>1. <strong>Ajoneuvo (Yläpalkki):</strong> Valitse auto nähdäksesi vain sen ajot/tankkaukset.
            <br>2. <strong>Aikaväli (Suodatin):</strong> Valitse "Vuosi", "Kuukausi" tai oma aikaväli (esim. 1.6. - 30.6.).
        </div>

        <div class="help-step">
            <strong>🗺️ Reitin katselu (Värillinen reitti):</strong>
            Historia-listassa ajon kohdalla on pieni <strong>karttaikoni (🗺️)</strong>.
            <br>Painamalla sitä siirryt karttanäkymään, jossa näet ajetun reitin. Reitti on väritetty nopeuden mukaan:
            <br>🔵 <strong>Sininen:</strong> Hidas ajo / Pysähdyksissä (alle 30km/h autoilla).
            <br>🟢 <strong>Vihreä:</strong> Normaali ajonopeus.
            <br>🔴 <strong>Punainen:</strong> Nopea ajo / Moottoritie (yli 100km/h autoilla, yli 30km/h pyörillä).
            <br><em>Huom: Kartalla voit painaa "📡 OFF" -nappia, jotta kartta ei keskitä sijaintiasi vaan antaa sinun tutkia reittiä rauhassa.</em>
        </div>
    </div>

    <div class="help-section">
        <h3>📊 7. Tilastot (Graafit)</h3>
        <p>Visuaalinen katsaus dataan. Tilastot-sivulla on nyt neljä erilaista kuvaajaa:</p>
        <div class="help-step">
            <ul>
                <li><strong>Kilometrit (Pylväät):</strong> Ajetut kilometrit kuukausitasolla (viimeiset 6kk). Auttaa näkemään kausivaihtelut.</li>
                <li><strong>Ajoneuvojakauma (Donitsi):</strong> Millä autolla ajetaan eniten? Näyttää kilometrien jakautumisen prosentteina.</li>
                <li><strong>⛽ Litrahinta (Viiva):</strong> Polttoaineen hinnan kehitys ajan myötä. Näet, milloin bensa oli halpaa ja milloin kallista.</li>
                <li><strong>💰 Tankkauskulut (Pylväät):</strong> Paljonko rahaa on palanut polttoaineeseen per kuukausi. Tämä auttaa budjetoinnissa.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ 8. Kartta ja Tasot</h3>
        <div class="help-step">
            <strong>Älykäs Zoom:</strong>
            Sovellus säätää kartan tarkkuutta automaattisesti nopeuden mukaan:
            <ul>
                <li><strong>Autolla:</strong> Kartta loitontaa maantienopeuksissa (Zoom 14-16) ja lähentää kaupungissa (Zoom 18).</li>
                <li><strong>Pyörällä:</strong> Kartta pysyy lähikuvassa (Zoom 19), jotta näet polut ja yksityiskohdat.</li>
            </ul>
        </div>
        <div class="help-step">
            <strong>Karttatasot (Layers):</strong>
            Oikean yläkulman kerros-ikonista voit valita pohjakartan:
            <ul>
                <li><strong>Peruskartta:</strong> Selkeä tiekartta (OpenStreetMap).</li>
                <li><strong>Satelliitti:</strong> Ilmakuva (Esri). Hyvä maastossa.</li>
                <li><strong>Maastokartta (UUSI):</strong> Näyttää korkeuskäyrät ja maastonmuodot (OpenTopoMap). Erinomainen retkeilyyn.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>❓ 9. Vianmääritys ja UKK (FAQ)</h3>
        
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
            <strong>K: Tankkaus ei tallennu? (Permission Denied)</strong>
            <br>V: Tämä johtuu vanhoista tietokannan säännöistä. Versiossa 4.9 säännöt on päivitettävä Firebase-konsolissa sallimaan "refuelings"-kansio.
            <br><em>Ratkaisu:</em> Jos olet käyttäjä, kirjaudu ulos ja takaisin sisään. Jos olet kehittäjä, päivitä säännöt.
        </div>

        <div class="help-step">
            <strong>K: Auto ei tallennu listalle asetuksissa?</strong>
            <br>V: Varmista, että olet kirjautunut sisään. Jos nettiyhteys pätkii, tietokantayhteys voi katketa.
            <br><em>Ratkaisu:</em> Päivitä sivu (vedä alas tai paina selaimen refresh) ja kokeile uudestaan.
        </div>
    </div>

    <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
        Mikkokalevin Ajopäiväkirja Pro v4.9.1 &copy; 2025<br>
        Täyden palvelun ajoseuranta ja kulukirjanpito.
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
