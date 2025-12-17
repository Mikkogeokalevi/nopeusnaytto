const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 30px; border-bottom: 2px solid var(--accent-color); padding-bottom: 15px; text-transform: uppercase; letter-spacing: 1px;">Mikkokalevin Ajopäiväkirja Pro – Käyttöopas v3.8</h2>
    
    <div class="help-section">
        <h3>🚀 1. Käyttöönotto ja Tili</h3>
        <p>Tämä osio varmistaa, että saat sovelluksen toimimaan oikein heti alusta alkaen ja ymmärrät, miten tietojasi käsitellään.</p>
        
        <div class="help-step">
            <strong>Kirjautuminen (Kaksi tapaa):</strong>
            Sovellus vaatii kirjautumisen, jotta tietosi pysyvät turvassa pilvipalvelussa ja ovat käytettävissä kaikilla laitteillasi.
            <br><br>
            <strong>A) Google-tili (Suositeltu):</strong>
            <br>Nopein tapa. Klikkaa "Kirjaudu Googlella". Sovellus käyttää tiliäsi vain tunnistautumiseen.
            <br><br>
            <strong>B) Sähköposti ja Salasana:</strong>
            <br>Jos sinulla on jo Perhekalenteri-tunnukset tai haluat luoda erillisen tunnuksen:
            <br><em>Uusi käyttäjä?</em> Syötä sähköposti ja haluamasi salasana -> Paina "Luo tunnus".
            <br><em>Vanha käyttäjä?</em> Syötä tunnukset -> Paina "Kirjaudu".
        </div>

        <div class="help-step">
            <strong>Vaaditut Käyttöoikeudet (Luvat):</strong>
            Sovellus pyytää selaimelta lupia. Vastaa "Salli", muuten ominaisuudet eivät toimi.
            <ul>
                <li>📍 <strong>Sijainti (GPS):</strong> Ehdottoman välttämätön. Se laskee nopeuden, matkan ja piirtää reitin. Varmista puhelimen asetuksista, että "Tarkka sijainti" (Precise Location) on päällä.</li>
                <li>📱 <strong>Liikeanturit (Motion & Orientation):</strong> Käytetään "Eco-mittarin" toimintaan (kiihtyvyyden ja jarrutuksen tunnistus).
                <br><em>iPhone (iOS) huomio:</em> Apple vaatii tälle erillisen luvan ponnahdusikkunassa. Jos kiellät tämän, Eco-palkki ei toimi.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>Asennus (PWA - App-kokemus):</strong>
            Parhaan käyttökokemuksen saat lisäämällä sivun kotivalikkoon. Tämä poistaa osoitepalkit, antaa koko ruudun tilan ja parantaa GPS:n toimintavarmuutta.
            <br><em>iPhone (Safari):</em> Paina "Jaa" (neliö+nuoli) -> Valitse "Lisää Koti-valikkoon".
            <br><em>Android (Chrome):</em> Paina valikkoa (kolme pistettä) -> Valitse "Asenna sovellus" tai "Lisää aloitusnäyttöön".
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ 2. Autotalli: Ajoneuvojen Hallinta</h3>
        <p>Jotta tilastot pysyvät järkevinä, on tärkeää erotella millä laitteella liikut. "Autotalli"-ominaisuus mahdollistaa useiden ajoneuvojen hallinnan.</p>
        
        <div class="help-step">
            <strong>Ajoneuvon Lisääminen:</strong>
            Mene valikosta kohtaan <strong>⚙️ Asetukset (Tallit)</strong> ja paina "Lisää ajoneuvo".
            <br>Valitse <strong>Tyyppi</strong> huolella, sillä se muuttaa sovelluksen toimintalogiikkaa:
            <br><br>
            <strong>🚗 Tyyppi: Auto</strong>
            <ul>
                <li><strong>Ominaisuudet:</strong> Eco-mittari on PÄÄLLÄ (analysoi ajotapaa). Kartta käyttää laajempaa zoomausta maantienopeuksissa.</li>
                <li><strong>Tiedot:</strong> Voit tallentaa rekisterinumeron, käyttövoiman ja tankin koon.</li>
            </ul>
            <strong>🚲 Tyyppi: Polkupyörä</strong>
            <ul>
                <li><strong>Ominaisuudet:</strong> Eco-mittari on POIS PÄÄLTÄ. (Pyörän tangon tärinä aiheuttaisi vääriä "Aggressiivinen ajo" -hälytyksiä).</li>
                <li><strong>Kartta:</strong> Käyttää huomattavasti tarkempaa zoomausta (Zoom 19), jotta erotat metsäpolut.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>Ajoneuvon Valinta ennen ajoa:</strong>
            Sovelluksen yläpalkissa (logon vieressä) on alasvetovalikko.
            <br>👉 <strong>Muista aina valita oikea ajoneuvo ennen kuin painat "Aloita tallennus"!</strong>
            <br>Valinta tallentuu muistiin seuraavaa kertaa varten.
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 3. Mittaristo ja Visuaalinen Seuranta</h3>
        <p>Mittaristo on suunniteltu näyttäväksi ja selkeäksi.</p>

        <div class="help-step">
            <strong>Datanäyttöjen selitteet:</strong>
            <ul>
                <li><strong>Nopeus (km/h):</strong> Reaaliaikainen GPS-nopeus. (Auton oma mittari näyttää usein n. 3-5 km/h liikaa).</li>
                <li><strong>Huippu (km/h):</strong> Tallennuksen aikana saavutettu korkein nopeus.</li>
                <li><strong>Suunta:</strong> Kompassisuunta (esim. "NE" = Koillinen) ja asteet.</li>
                <li><strong>Korkeus (m):</strong> Korkeus merenpinnasta.</li>
                <li><strong>Sää:</strong> Sovellus hakee automaattisesti lähimmän säähavaintoaseman tiedot (Lämpötila + Ikoni).</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>💫 Nopeuskehä (Speed Ring):</strong>
            Numeron ympärillä oleva hehkuva rengas elää nopeuden mukaan. Se täyttyy kierroslukumittarin tavoin mitä kovempaa ajat.
        </div>

        <div class="help-step">
            <strong>🏎️ Eco-mittari (Vain autoille):</strong>
            Yläreunan värillinen palkki ja hehkuva rengas reagoivat ajotapaasi:
            <ul>
                <li><span style="color:#00c853; font-weight:bold;">🟢 Vihreä (Taloudellinen):</span> Ajat tasaisesti ja ennakoivasti.</li>
                <li><span style="color:#ff1744; font-weight:bold;">🔴 Punainen (Kiihdytys/Jarrutus):</span> Anturi havaitsi voimakkaan G-voiman (yli 3.5 m/s²). Tämä voi johtua rajusta kiihdytyksestä, äkkijarrutuksesta tai tiukasta kaarteesta. Tavoitteena on pitää mittari vihreänä.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🔴 4. Ajon Tallennusprosessi</h3>
        <div class="help-step">
            <strong>1. Aloitus:</strong>
            Paina vihreää <strong>🔴 ALOITA TALLENNUS</strong> -painiketta. Matkamittari nollautuu ja ajanotto alkaa.
        </div>
        
        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>2. Tauko (Keltainen ⏸ TAUKO -nappi):</strong><br>
            Käytä tätä, kun pysähdyt kauppaan tai tankkaamaan.
            <br><strong>Mitä tapahtuu tauolla?</strong>
            <ul>
                <li>GPS-sijainnin ja matkan tallennus pysähtyy.</li>
                <li>Ajanotto pysähtyy (tauko ei vääristä ajoaikaa).</li>
                <li>Keskinopeus ei romahda nollaan.</li>
            </ul>
            Jatka matkaa painamalla <strong>▶ JATKA</strong>.
        </div>

        <div class="help-step">
            <strong>3. Lopetus ja Tallennus:</strong>
            Kun olet perillä, paina <strong>⬛ LOPETA</strong>. Ruudulle aukeaa ikkuna.
            <ul>
                <li>Tarkista, että ajoneuvo on oikein.</li>
                <li>Kirjoita aihe (esim. "Työmatka").</li>
                <li>Paina "Tallenna".</li>
            </ul>
        </div>
        
        <div class="help-step">
            <strong>⚠️ Tausta-ajo (WhatsApp / Muut sovellukset):</strong>
            Jos poistut sovelluksesta kesken ajon, puhelin saattaa katkaista GPS-yhteyden virran säästämiseksi.
            <br><strong>Korjaus:</strong> Sovellus yrittää paikata katkokset vetämällä "linnuntien" edellisestä pisteestä nykyiseen (max 50km hyppy). Tarkin tulos saadaan pitämällä sovellus auki.
        </div>
    </div>

    <div class="help-section">
        <h3>📋 5. Historia, Raportointi ja Muokkaus</h3>
        <p>Historia-sivu on ajopäiväkirjasi arkisto ja analyysityökalu.</p>

        <div class="help-step">
            <strong>Suodatus (Filtteröinti):</strong>
            Voit rajata näkymää kahdella tasolla yhtä aikaa:
            <br><strong>1. Ajoneuvo (Yläpalkki):</strong> Valitse "Kaikki ajoneuvot", "Mazda" tai "Pyörä". Lista näyttää vain valitun ajoneuvon ajot.
            <br><strong>2. Aikaväli (Listan yläpuoli):</strong> Valitse "Kaikki ajot", "Vuosi 2025", "Tämä kuukausi" tai mukautettu päivämääräväli.
        </div>

        <div class="help-step">
            <strong>Yhteenvetolaatikko:</strong>
            Näet heti valitun suodatuksen kokonaissummat: Ajetut kilometrit, ajojen määrä ja kokonaisaika.
        </div>

        <div class="help-step">
            <strong>✏️ Tietojen Muokkaus (Jälkikäteen):</strong>
            Valitsitko vahingossa väärän auton?
            <br>1. Etsi ajo historiasta.
            <br>2. Paina kortin yläkulmassa olevaa <strong>kynä-ikonia (✏️)</strong>.
            <br>3. Vaihda ajoneuvo tai korjaa aihetta.
            <br>4. Tallenna. Ajo siirtyy oikean auton tilastoihin.
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ 6. Kartta ja Älykäs Zoom</h3>
        <p>Kartta elää tilanteen mukaan, jotta sinun ei tarvitse näpytellä sitä ajon aikana.</p>
        
        <div class="help-step">
            <strong>🚗 Autolla ajettaessa:</strong>
            <ul>
                <li><strong>0 - 40 km/h:</strong> Zoom 18 (Lähikuva). Näet talot ja risteykset.</li>
                <li><strong>40 - 70 km/h:</strong> Zoom 17. Hieman loitompi taajamanäkymä.</li>
                <li><strong>70 - 100 km/h:</strong> Zoom 16. Näet tiet kauemmas.</li>
                <li><strong>Yli 100 km/h:</strong> Zoom 14 (Yleiskuva). Näet moottoritiellä liittymät ajoissa.</li>
            </ul>
        </div>

        <div class="help-step">
            <strong>🚲 Polkupyörällä ajettaessa:</strong>
            <ul>
                <li><strong>0 - 15 km/h:</strong> Zoom 19 (Erittäin tarkka). Näet metsäpolut ja oikoreitit.</li>
                <li><strong>Yli 15 km/h:</strong> Zoom 17. Kun vauhti kasvaa, kartta loitontaa hieman, jotta näet mihin tie vie.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>❓ Vianmääritys</h3>
        <div class="help-step">
            <strong>K: Näyttö sammuu itsestään?</strong>
            <br>V: Sovellus käyttää "Wake Lock" -tekniikkaa. Jos puhelimen akku on vähissä ja "Virransäästötila" on päällä, puhelin voi silti pakottaa näytön kiinni. Kytke virransäästö pois tai lataa puhelinta.
        </div>
        <div class="help-step">
            <strong>K: Auto ei tallennu listalle?</strong>
            <br>V: Varmista, että olet kirjautunut sisään. Jos yhteys pätkii, päivitä sivu.
        </div>
    </div>

    <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
        Mikkokalevin Ajopäiväkirja Pro v3.8 &copy; 2025<br>
        Täyden palvelun ajoseuranta.
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
