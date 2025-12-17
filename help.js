const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 25px; border-bottom: 2px solid var(--accent-color); padding-bottom: 10px;">Käyttöopas & UKK</h2>
    
    <div class="help-section">
        <h3>🚀 1. Käyttöönotto ja Asennus</h3>
        <div class="help-step">
            <strong>Kirjautuminen ja Tietoturva:</strong>
            Sovellus käyttää Googlen suojattua kirjautumista. Tämä on välttämätöntä, jotta voimme luoda sinulle henkilökohtaisen, pilvipohjaisen tietokannan. Näin ajohistoriasi, autotallisi tiedot ja asetuksesi säilyvät tallessa, vaikka vaihtaisit puhelinta tai käyttäisit sovellusta tietokoneella.
        </div>
        <div class="help-step">
            <strong>Luvat (Tärkeää):</strong>
            Jotta sovellus toimii täydellä teholla, se tarvitsee seuraavat oikeudet:
            <ul>
                <li>📍 <strong>Sijainti (GPS):</strong> Ehdottoman välttämätön nopeuden, matkan ja reitin seurantaan. Salli "Tarkka sijainti".</li>
                <li>📱 <strong>Liikeanturit (Motion):</strong> Sovellus käyttää puhelimen kiihtyvyysantureita "Eco-mittarin" toimintaan (kiihtyvyyden ja jarrutuksen tunnistus). Etenkin iPhone-käyttäjien tulee erikseen sallia tämä kysyttäessä.</li>
            </ul>
        </div>
        <div class="help-step">
            <strong>Asennus (App-kokemus):</strong>
            Tämä on PWA-sovellus (Progressive Web App). Parhaan käyttökokemuksen saamiseksi suosittelemme lisäämään sen kotivalikkoon, jolloin osoitepalkit poistuvat ja sovellus toimii koko ruudulla:
            <br><em>iPhone (Safari):</em> Paina "Jaa"-painiketta (neliö ja nuoli) -> Valitse "Lisää Koti-valikkoon".
            <br><em>Android (Chrome):</em> Paina valikkoa (kolme pistettä) -> Valitse "Asenna sovellus" tai "Lisää aloitusnäyttöön".
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ 2. Autotalli ja Asetukset</h3>
        <div class="help-step">
            Ennen ensimmäistä ajoa suosittelemme käymään <strong>Asetukset</strong>-sivulla.
        </div>
        <div class="help-step">
            <strong>Ajoneuvon lisääminen:</strong>
            Voit lisätä rajattomasti ajoneuvoja. Valitse onko kyseessä <strong>🚗 Auto</strong> vai <strong>🚲 Polkupyörä</strong>.
            <ul>
                <li><em>Autot:</em> Voit tallentaa rekisterinumeron, käyttövoiman ja tankin koon.</li>
                <li><em>Polkupyörät:</em> Yksinkertaistettu näkymä ilman polttoainetietoja.</li>
            </ul>
            <strong>Vaikutus sovellukseen:</strong>
            Kun valitset ajoneuvon tyypiksi "Polkupyörä", sovellus muuttaa toimintaansa:
            <ul>
                <li>Kartta zoomaa automaattisesti lähemmäs (tarkempi näkymä poluilla).</li>
                <li>Eco-mittari kytkeytyy pois päältä (koska pyörän luonnollinen heiluminen aiheuttaisi vääriä hälytyksiä).</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 3. Mittaristo ja Live-seuranta</h3>
        <div class="help-step">
            <strong>Valitse ajoneuvo:</strong>
            Yläpalkin vasemmassa reunassa on valikko, josta valitset millä ajoneuvolla olet liikkeellä (esim. "Mazda" tai "Jopo"). Tämä valinta tallentuu muistiin.
        </div>
        <div class="help-step">
            <strong>Datanäyttö kertoo reaaliajassa:</strong>
            <ul>
                <li><strong>Nopeus:</strong> Nykyinen nopeus GPS:n mukaan.</li>
                <li><strong>Huippu:</strong> Kyseisen tallennuskerran suurin nopeus.</li>
                <li><strong>Suunta:</strong> Kompassisuunta (esim. NE 45°) liikkeessä ollessa.</li>
                <li><strong>Korkeus:</strong> Korkeus merenpinnasta (m).</li>
                <li><strong>Sää:</strong> Sovellus hakee automaattisesti paikallisen sään (Lämpötila + Ikoni) heti kun GPS-yhteys on muodostettu.</li>
            </ul>
        </div>
        <div class="help-step">
            <strong>🏎️ Eco-mittari (Vain autoille):</strong>
            Yläreunan värillinen palkki analysoi ajotapaasi kiihtyvyysanturin avulla:
            <br><span style="color:#00c853; font-weight:bold;">🟢 Taloudellinen:</span> Ajat tasaisesti ja ennakoivasti.
            <br><span style="color:#ff1744; font-weight:bold;">🔴 Kiihdytys/Jarrutus:</span> Voimakas jarrutus, kiihdytys tai raju kaarre muuttaa palkin punaiseksi ja antaa ilmoituksen. Tavoitteena on pitää palkki vihreänä.
        </div>
    </div>

    <div class="help-section">
        <h3>🔴 4. Ajon Tallennus ja Tauotus</h3>
        <div class="help-step">
            1. Paina vihreää <strong>🔴 ALOITA TALLENNUS</strong> -painiketta. Mittaristo nollautuu ja ajanotto alkaa.
        </div>
        
        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>⏸ TAUKO-toiminto:</strong><br>
            Käytä tätä, jos pysähdyt kauppaan, liikennevaloihin tai tankkaamaan.
            <ul>
                <li>Ajanotto ja matkan kertyminen pysähtyvät.</li>
                <li>Keskinopeus ei laske tauon aikana (se lasketaan vain aktiivisesta ajoajasta).</li>
                <li>G-voimien seuranta keskeytyy.</li>
            </ul>
            Jatka matkaa painamalla <strong>▶ JATKA</strong>.
        </div>

        <div class="help-step">
            <strong>Lopetus ja Tallennus:</strong>
            Kun olet perillä, paina <strong>⬛ LOPETA</strong>. Ruudulle aukeaa yhteenvetoikkuna.
            <ul>
                <li>Tarkista, että ajoneuvo on oikein (se näkyy ikkunassa).</li>
                <li>Kirjoita ajolle kuvaava aihe (esim. "Työmatka Hki-Tre").</li>
                <li>Paina "Tallenna".</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>📋 5. Historia, Suodatus ja Muokkaus</h3>
        <div class="help-step">
            Historia-sivu on ajopäiväkirjasi sydän. Se näyttää kaikki tallennetut ajot aikajärjestyksessä.
        </div>
        <div class="help-step">
            <strong>🔍 Tehokas Suodatus:</strong>
            Voit rajata näytettäviä ajoja kahdella tavalla yhtä aikaa:
            <ol>
                <li><strong>Ajoneuvo (Yläpalkki):</strong> Valitse näytetäänkö "Kaikki ajoneuvot", pelkkä "Mazda" vai pelkkä "Pyörä". Lista päivittyy heti.</li>
                <li><strong>Ajankohta (Listan yläpuolella):</strong> Valitse "Kaikki ajot", tietty vuosi, tietty kuukausi tai täysin mukautettu aikaväli (alku- ja loppupäivä).</li>
            </ol>
        </div>
        <div class="help-step">
            <strong>📊 Yhteenvetolaatikko:</strong>
            Heti suodattimien alla näet yhteenvedon valituista ajoista:
            <br><em>Yhteensä KM | Ajojen lukumäärä | Yhteenlaskettu ajoaika</em>
        </div>
        <div class="help-step">
            <strong>✏️ Tietojen Muokkaus (UUSI):</strong>
            Tapahtuiko virhe? Valitsitko väärän auton? Ei hätää.
            <br>Paina historiakortissa olevaa <strong>kynä-ikonia (✏️)</strong>.
            <br>Avautuvassa ikkunassa voit:
            <ul>
                <li>Vaihtaa ajon toiselle ajoneuvolle.</li>
                <li>Korjata ajon aihetta/kuvausta.</li>
            </ul>
            Tiedot päivittyvät pilveen välittömästi.
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ 6. Karttaominaisuudet</h3>
        <div class="help-step">
            Karttanäkymä seuraa sijaintiasi reaaliajassa.
        </div>
        <div class="help-step">
            <strong>Älykäs Zoom:</strong>
            <ul>
                <li><strong>Autolla:</strong> Kartta loitontaa maantienopeuksissa (näet pidemmälle) ja lähentää kaupungissa.</li>
                <li><strong>Polkupyörällä:</strong> Kartta käyttää oletuksena tiukempaa zoom-tasoa, jotta näet polut ja pikkutiet paremmin.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>❓ Vianmääritys</h3>
        <div class="help-step">
            <strong>Miksi näyttö sammuu?</strong>
            Sovellus pyrkii pitämään näytön päällä (Wake Lock). Jos puhelimesi on "Virransäästötilassa", käyttöjärjestelmä saattaa pakottaa näytön kiinni. Lataa puhelinta ajon aikana jos mahdollista.
        </div>
        <div class="help-step">
            <strong>Miksi autoa ei voi lisätä?</strong>
            Varmista, että olet kirjautunut sisään. Jos ongelma jatkuu, päivitä sivu.
        </div>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px; padding-bottom: 30px;">
        Ajopäiväkirja Pro v3.3 &copy; 2025
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
