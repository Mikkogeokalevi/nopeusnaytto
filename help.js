const helpContent = `
    <h2 style="text-align:center; color:var(--accent-color); margin-bottom: 25px; border-bottom: 2px solid var(--accent-color); padding-bottom: 10px;">Käyttöopas 3.0</h2>
    
    <div class="help-section">
        <h3>🚀 1. Käyttöönotto ja Yksityisyys</h3>
        <div class="help-step">
            <strong>Kirjautuminen:</strong>
            Sovellus vaatii Google-kirjautumisen. Tämä luo sinulle henkilökohtaisen, salatun tilan pilvipalveluun.
            <br><em>Miksi?</em> Jotta ajohistoriasi, autotallisi ja asetuksesi säilyvät, vaikka puhelin katoaisi tai vaihtuisit laitetta. Kukaan muu ei näe ajojasi.
        </div>
        <div class="help-step">
            <strong>Vaaditut Luvat:</strong>
            Jotta kaikki ominaisuudet toimivat, selaimesi kysyy lupia:
            <ul>
                <li>📍 <strong>Sijainti (GPS):</strong> Pakollinen. Valitse "Salli käytön aikana" ja varmista, että "Tarkka sijainti" on päällä. Ilman tätä nopeus ja matka eivät toimi.</li>
                <li>📱 <strong>Liikeanturit (Motion):</strong> Sovellus käyttää puhelimen kiihtyvyysanturia "Eco-mittarin" toimintaan (kiihtyvyyden ja jarrutuksen tunnistus).
                <br><em>iPhone-käyttäjät:</em> Tämä lupa on kuitattava erikseen kysyttäessä, muuten Eco-palkki ei toimi.</li>
            </ul>
        </div>
        <div class="help-step">
            <strong>Asennus (PWA):</strong>
            Tämä on verkkosovellus, joka toimii kuten natiivi sovellus. Lisää se kotivalikkoon saadaksesi koko näytön tilan ja paremman suorituskyvyn:
            <br><em>iPhone (Safari):</em> Paina "Jaa"-painiketta (neliö ja nuoli) -> Valitse listasta "Lisää Koti-valikkoon".
            <br><em>Android (Chrome):</em> Paina valikkoa (kolme pistettä) -> Valitse "Asenna sovellus" tai "Lisää aloitusnäyttöön".
        </div>
    </div>

    <div class="help-section">
        <h3>⚙️ 2. Autotalli ja Ajoneuvot</h3>
        <div class="help-step">
            Ennen ajoa, käy valikon kohdassa <strong>Asetukset (Tallit)</strong>. Täällä voit luoda profiilin jokaiselle kulkuneuvollesi.
        </div>
        <div class="help-step">
            <strong>Autot vs. Polkupyörät:</strong>
            Kun lisäät ajoneuvon, valitse sen tyyppi. Tämä vaikuttaa sovelluksen toimintaan:
            <ul>
                <li>🚗 <strong>Auto:</strong> Voit tallentaa rekisterinumeron ja polttoaineen. Ajon aikana "Eco-mittari" on päällä ja analysoi ajotapaasi. Kartta käyttää laajempaa zoomausta.</li>
                <li>🚲 <strong>Polkupyörä:</strong> Eco-mittari kytketään <strong>pois päältä</strong> (koska pyörän tangon tärinä aiheuttaisi jatkuvia vääriä "aggressiivinen ajo" -hälytyksiä). Kartta zoomaa automaattisesti lähemmäs, jotta näet polut tarkemmin.</li>
            </ul>
        </div>
        <div class="help-step">
            <strong>Ajoneuvon valinta:</strong>
            Etusivun yläpalkissa on valikko (esim. "Mazda"). Varmista ennen liikkeellelähtöä, että oikea ajoneuvo on valittuna. Valinta pysyy muistissa seuraavaan kertaan.
        </div>
    </div>

    <div class="help-section">
        <h3>⏱️ 3. Mittaristo ja Live-tiedot</h3>
        <div class="help-step">
            <strong>Datanäyttö:</strong>
            <ul>
                <li><strong>Nopeus:</strong> Reaaliaikainen GPS-nopeus.</li>
                <li><strong>Huippu:</strong> Kyseisen tallennuksen suurin nopeus.</li>
                <li><strong>Suunta:</strong> Kompassisuunta (esim. NE 45°) liikkeessä ollessa.</li>
                <li><strong>Korkeus:</strong> Korkeus merenpinnasta (m).</li>
                <li><strong>Sää:</strong> Sovellus hakee automaattisesti lähimmän sääaseman tiedot (Lämpötila + Ikoni) heti, kun GPS-yhteys on muodostettu.</li>
            </ul>
        </div>
        <div class="help-step">
            <strong>🏎️ Eco-mittari (Vain autoille):</strong>
            Yläreunassa näkyy värillinen palkki, joka reagoi ajotapaasi:
            <br><span style="color:#00c853; font-weight:bold;">🟢 Taloudellinen:</span> Palkki on vihreä, kun ajat tasaisesti.
            <br><span style="color:#ff1744; font-weight:bold;">🔴 Kiihdytys/Jarrutus:</span> Jos anturi havaitsee voimakkaan G-voiman (yli 3.5 m/s² kiihtyvyys, jarrutus tai raju kaarre), palkki välähtää punaisena ja tekstiksi tulee "Kiihdytys!".
            <br><em>Tavoite: Pidä palkki vihreänä koko matkan ajan.</em>
        </div>
    </div>

    <div class="help-section">
        <h3>🔴 4. Ajon Tallennus</h3>
        <div class="help-step">
            1. Paina <strong>🔴 ALOITA TALLENNUS</strong>. Matkamittari nollautuu ja ajanotto alkaa.
        </div>
        
        <div class="help-step" style="border-left-color: #fbc02d;">
            <strong>⏸ TAUKO-toiminto:</strong><br>
            Käytä tätä, jos pysähdyt kauppaan tai tankkaamaan.
            <ul>
                <li>Ajanotto ja matkan kertyminen pysähtyvät.</li>
                <li>Keskinopeuslaskuri "jäätyy" (tauko ei laske keskinopeutta).</li>
                <li>Eco-seuranta keskeytyy.</li>
            </ul>
            Jatka matkaa painamalla <strong>▶ JATKA</strong>.
        </div>

        <div class="help-step">
            <strong>Lopetus ja Tallennus:</strong>
            Kun olet perillä, paina <strong>⬛ LOPETA</strong>. Ruudulle aukeaa yhteenvetoikkuna.
            <ul>
                <li>Näet yhteenvedon matkasta.</li>
                <li>Kirjoita ajolle kuvaava aihe (esim. "Työmatka Hki-Tre").</li>
                <li>Tarkista, että ajoneuvo on oikein.</li>
                <li>Paina "Tallenna".</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>📋 5. Historia ja Muokkaus</h3>
        <div class="help-step">
            Historia-sivu on ajopäiväkirjasi arkisto.
        </div>
        <div class="help-step">
            <strong>🔍 Monipuolinen Suodatus:</strong>
            Voit rajata näkymää kahdella tasolla:
            <ol>
                <li><strong>Yläpalkin ajoneuvo:</strong> Jos valitset yläpalkista "Mazda", historia näyttää VAIN Mazdan ajot. Jos valitset "Kaikki ajoneuvot", näet koko historian.</li>
                <li><strong>Aikaväli:</strong> Listan yläpuolelta voit valita "Kaikki ajot", tietyn Vuoden, Kuukauden tai täysin itse valitun aikavälin (kalenteri).</li>
            </ol>
        </div>
        <div class="help-step">
            <strong>✏️ Tietojen Korjaus (Jälkikäteen):</strong>
            Valitsitko vahingossa väärän auton?
            <br>1. Etsi ajo historiasta.
            <br>2. Paina kortin yläkulmassa olevaa <strong>kynä-ikonia (✏️)</strong>.
            <br>3. Vaihda ajoneuvo oikeaksi avautuvasta listasta ja tallenna. Ajo siirtyy oikean auton tilastoihin.
        </div>
        <div class="help-step">
            <strong>Symbolit:</strong>
            <ul>
                <li>🌡️ = Ajon aikainen sää.</li>
                <li>🏎️ = Ajotapa-arvio (Tasainen/Reipas/Aggressiivinen).</li>
                <li>🚗/🚲 = Millä välineellä ajettu.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>🗺️ 6. Kartta</h3>
        <div class="help-step">
            Kartta keskittää sijaintiisi automaattisesti.
        </div>
        <div class="help-step">
            <strong>Älykäs Zoom:</strong>
            Sovellus säätää zoom-tasoa nopeutesi ja ajoneuvosi mukaan:
            <ul>
                <li><strong>Autolla (yli 100km/h):</strong> Kartta loitontaa, jotta näet kauemmas (Zoom 14).</li>
                <li><strong>Autolla (kaupunki):</strong> Perusnäkymä (Zoom 16).</li>
                <li><strong>Polkupyörällä:</strong> Kartta pysyy tiukasti lähikuvassa (Zoom 19), jotta erotat polut ja risteykset.</li>
            </ul>
        </div>
    </div>

    <div class="help-section">
        <h3>❓ Vianmääritys</h3>
        <div class="help-step">
            <strong>Näyttö sammuu ajon aikana?</strong>
            Sovellus käyttää "Wake Lock" -tekniikkaa pitääkseen näytön päällä. Jotkut puhelimet (esim. Samsung, Huawei) voivat silti sammuttaa näytön, jos "Virransäästötila" on päällä. Kytke virransäästö pois tai lataa puhelinta ajon aikana.
        </div>
        <div class="help-step">
            <strong>GPS pätkii / Nopeus on 0?</strong>
            Varmista, että olet ulkona. Sisätiloissa, tunneleissa tai korkeiden talojen välissä GPS-signaali voi katketa.
        </div>
    </div>

    <div style="text-align: center; margin-top: 40px; color: #666; font-size: 12px; padding-bottom: 30px;">
        Ajopäiväkirja Pro v3.4 &copy; 2025
    </div>
`;

const helpContainer = document.getElementById('help-view');
if (helpContainer) {
    helpContainer.innerHTML = helpContent;
}
