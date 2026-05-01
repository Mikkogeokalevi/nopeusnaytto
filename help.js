// =========================================================
// HELP.JS - TRILINGUAL MASTER GUIDE (v6.33 DASHBOARD QUICK MAP TOGGLE)
// =========================================================

// --- KÄÄNNÖKSET / TRANSLATIONS / BẢN DỊCH ---
const helpData = {
    fi: {
        title: "Käyttöopas",
        version: "Versio",
        sections: [
            {
                title: "🚀 1. Uutta (v6.33, v6.32, v6.31, v6.30, v6.29, v6.28, v6.27, v6.23, v6.22, v6.21, v6.20, v6.19, v6.18, v6.17, v6.16, v6.14, v6.13 & v6.12)",
                content: `
                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🗺️ UUTTA v6.33: Nopea dashboard-vaihtonappi kartalle/stats-ruuduille:</strong>
                        <ul>
                            <li><strong>Sään vasemmalle puolelle lisätty pikapainike</strong>, jolla vaihdat mini-kartan ja stats-ruutujen välillä yhdellä napautuksella.</li>
                            <li><strong>Ei enää tarvetta mennä Asetukset-sivulle</strong> pelkkää näkymän vaihtoa varten.</li>
                            <li><strong>Nappi näyttää aktiivisen tilan</strong> (🗺️ = näytä mini-kartta, 📊 = näytä stats-ruudut).</li>
                        </ul>

                        <strong>🗺️ UUTTA v6.32: Dashboard mini-kartan renderöintikorjaus mobiili-PWA:han:</strong>
                        <ul>
                            <li><strong>Korjattu bugi</strong>, jossa karttalaatat saattoivat piirtyä vain pienenä neliönä vasempaan yläkulmaan.</li>
                            <li><strong>Mini-kartalle lisätty toistettu invalidateSize-resize-ajastus</strong> näkymänvaihdossa, orientaation vaihdossa ja appin palautuessa näkyviin.</li>
                            <li><strong>Korjaus kohdistettu erityisesti asennettuun mobiili-PWA-käyttöön</strong> (esim. Samsung Internet).</li>
                        </ul>

                        <strong>🗺️ UUTTA v6.31: Dashboard mini-kartan mobiilikorjaus:</strong>
                        <ul>
                            <li><strong>Korjattu bugi</strong>, jossa mini-kartta saattoi näkyä puhelimessa vain ohuena viivana.</li>
                            <li><strong>Karttaikkunalle asetettu vakaa korkeus</strong> (min-height + flex-basis), jotta näkymä ei litisty.</li>
                        </ul>

                        <strong>📈 UUTTA v6.30: 5 min trendikäyrä Velocity Stageen:</strong>
                        <ul>
                            <li><strong>Taustalle piirtyy nopeuskäyrä</strong> viimeisen noin 5 minuutin ajalta.</li>
                            <li><strong>Mukana myös korkeuskäyrä</strong> kevyempänä viivana.</li>
                            <li><strong>Käyrät ovat nopeuslukeman taustalla</strong>, eivät numeron päällä.</li>
                        </ul>

                        <strong>🗺️ UUTTA v6.29: Kartta stats-ruutujen tilalle:</strong>
                        <ul>
                            <li><strong>Asetuksiin lisätty valinta</strong> "Kartta stats-ruutujen tilalle".</li>
                            <li><strong>Dashboardissa 2x3-statistiikkaruudut</strong> voidaan korvata live mini-kartalla.</li>
                            <li><strong>Tila muistetaan</strong> (localStorage), joten valinta säilyy seuraavalla käynnistyskerralla.</li>
                        </ul>

                        <strong>🌈 UUTTA v6.28: HUD-väriteemat + Velocity Stage:</strong>
                        <ul>
                            <li><strong>Kaksi erillistä HUD-väriteemaa</strong> (Cyber Blue / Sunset Gold).</li>
                            <li><strong>Täysin uusi näkymä</strong> "Velocity Stage" tuo futuristisen nopeusnäkymän (track + lane + state).</li>
                            <li><strong>Nopeusmittarin tyyliin lisätty</strong> valinta "Velocity Stage".</li>
                        </ul>

                        <strong>✨ UUTTA v6.27: Pulse HUD -mittarinäkymä:</strong>
                        <ul>
                            <li><strong>Neulanenmittari korvattu</strong> näyttävällä Pulse HUD -nopeusnäkymällä.</li>
                            <li><strong>Reaktiivinen kaari + tilat</strong> (READY / CRUISE / FAST / HYPER) tekee nopeudesta selkeästi luettavan.</li>
                            <li><strong>Asetuksissa mittarityyppi</strong> näyttää nyt valinnan "Pulse HUD".</li>
                        </ul>

                        <strong>🛣️ UUTTA v6.23: Tien nopeusrajoitus näkyy mittaristossa:</strong>
                        <ul>
                            <li><strong>Tiekohtainen rajoitus</strong> haetaan OSM-datasta sijainnin perusteella.</li>
                            <li><strong>Yleisrajoitus-arvio</strong> näytetään eri värillä, jotta tiedät että arvo on arvio.</li>
                            <li>Jos dataa ei löydy, kortti näyttää <strong>Ei dataa</strong>.</li>
                        </ul>

                        <strong>🎯 UUTTA v6.22: POI herkkyys + re-arm + dynaaminen nopeuskamerasäde:</strong>
                        <ul>
                            <li><strong>POI herkkyys</strong> (Varma / Normaali / Herkkä) säätää suunta- ja confidence-kynnystä.</li>
                            <li><strong>Uudelleenhälytys vasta (m)</strong> estää saman POI:n turhat uusintahälytykset heti ohituksen jälkeen.</li>
                            <li><strong>Nopeuskamera</strong> käyttää nyt nopeusperusteista dynaamista sädettä.</li>
                        </ul>

                        <strong>🧭 UUTTA v6.21: adaptiivinen GPS-suodatus + POI regressiotesti:</strong>
                        <ul>
                            <li><strong>Nopeus ja suunta</strong> pehmennetään nyt GPS-tarkkuuden mukaan, mikä vähentää jitteriä.</li>
                            <li><strong>POI confidence</strong> arvioi osumaa etäisyyden, segmentin, suunnan ja tarkkuuden perusteella.</li>
                            <li><strong>Debug-lokiin</strong> lisättiin nappi "Aja regressiotesti", joka kirjaa testitulokset.</li>
                        </ul>

                        <strong>🔊 UUTTA v6.20: POI-kohtainen ääniprofiilin override:</strong>
                        <ul>
                            <li><strong>POI-modaalissa</strong> voit nyt valita yksittäiselle POI:lle oman äänen.</li>
                            <li>Jos override ei ole valittu, käytetään automaattisesti POI-tyypin ääntä.</li>
                        </ul>

                        <strong>🔊 UUTTA v6.19: POI-äänet voimakkaammiksi + tyyppikohtaiset profiilit:</strong>
                        <ul>
                            <li><strong>POI äänen voimakkuus</strong> on nyt säädettävissä Asetuksista (master volume).</li>
                            <li><strong>Ääniprofiili per POI-tyyppi:</strong> nopeuskamera, vaara, asiakas, muistutus ja muu.</li>
                            <li><strong>Testaa-napit</strong> toistavat valitun tyypin äänen heti, jotta säätö onnistuu nopeasti.</li>
                        </ul>

                        <strong>📍 UUTTA v6.17: Nopeuskameratiedostojen tuonti + POI-modaali + karttamuokkaus:</strong>
                        <ul>
                            <li><strong>⬆ Tuo nopeuskamerat (CSV/SVC)</strong> Asetuksista (lon,lat korjataan automaattisesti).</li>
                            <li><strong>🔎 Haku + suodatus + lähimmät</strong> POI-listaan (ei kasva loputtomaksi).</li>
                            <li><strong>🗺️ Kartalta muokkaa/poista</strong> POI suoraan klikkaamalla.</li>
                            <li><strong>🧾 Koordinaatit yhteen kenttään</strong> (geokätköilymuoto tai CSV-tyyli).</li>
                        </ul>

                        <strong>📍 UUTTA v6.16: Paikkamerkinnät (POI) + Varoitukset + Ajon markerit:</strong>
                        <p>Voit tallentaa kartalle pysyviä paikkamerkintöjä (esim. nopeuskamerat) ja saada lähestyessä varoituksen. Lisäksi voit merkitä ajon aikana reitille omia muistiinpisteitä (ajokohtaiset markerit).</p>
                        <ul>
                            <li><strong>📌 POI (pysyvä merkki)</strong> tallennetaan Firebaseen ja näkyy kartalla aina.</li>
                            <li><strong>📌 Ajon markeri</strong> tallennetaan vain siihen yhteen ajoon (Historia → kartta näyttää markerit).</li>
                            <li><strong>📣 Varoitus näyttää etäisyyden metreinä</strong> ja metrimäärä vähenee kohti nollaa ajon aikana.</li>
                            <li><strong>🧭 Nopeuskamera-varoitus suodatetaan suunnan mukaan</strong> jos puhelin antaa ajosuunnan (heading), jolloin "väärään suuntaan" olevat kamerat eivät yleensä hälytä.</li>
                        </ul>

                        <strong>1) Lisää POI (pysyvä kamera / vaara / muistutus):</strong>
                        <ol>
                            <li>Avaa <strong>Asetukset</strong>.</li>
                            <li>Siirry kohtaan <strong>📍 Paikkamerkinnät (POI)</strong>.</li>
                            <li>Valitse lisäystapa:
                                <ul>
                                    <li><strong>+ Lisää tähän sijaintiin</strong> (käyttää viimeisintä GPS-sijaintia)</li>
                                    <li><strong>+ Lisää koordinaateilla</strong> (voit syöttää geokätköily-muodon esim. <em>N 60° 10.123 E 024° 56.789</em>)</li>
                                    <li><strong>+ Lisää kartalta</strong> → avaa Kartta ja tee <strong>pitkä painallus</strong> kohtaan (tai tietokoneella hiiren oikea)</li>
                                </ul>
                            </li>
                            <li>Aseta tarvittaessa:
                                <ul>
                                    <li><strong>Varoitus päälle/pois</strong></li>
                                    <li><strong>Säde (m)</strong> (oletus 350m)</li>
                                    <li><strong>Cooldown (s)</strong> (estää jatkuvan värinän / hälytyksen samassa kohdassa)</li>
                                </ul>
                            </li>
                        </ol>

                        <strong>2) Miltä varoitus näyttää ajon aikana?</strong>
                        <ul>
                            <li>Kun olet POI:n säteen sisällä, ruudulle tulee varoitus muodossa <strong>"📍 Nopeuskamera: 312 m"</strong>.</li>
                            <li>Etäisyys päivittyy ja pienenee kun lähestyt. Kun poistut säteeltä tai etäisyys menee käytännössä nollaan, varoitus katoaa.</li>
                            <li>Jos samalla alueella on useita POI:ta, sovellus näyttää kerrallaan <strong>parhaan osuman</strong> (lähin ja suuntaan sopiva), ettei ilmoitus "pompi".</li>
                        </ul>

                        <strong>3) Ajon aikaiset markerit (muistiinpisteet reitille):</strong>
                        <ol>
                            <li>Aloita ajo normaalisti (<strong>🔴 ALOITA</strong>).</li>
                            <li>Paina ajon aikana <strong>📌 MERKKAA</strong> silloin kun haluat talteen pisteen reitille.</li>
                            <li>Voit kirjoittaa lyhyen tekstin (valinnainen).</li>
                            <li>Kun katsot ajoa myöhemmin: <strong>Historia → 🗺️</strong>, markerit näkyvät reitillä kartassa ja ovat klikattavia.</li>
                        </ol>
                    </div>

                    <div class="help-step" style="border-left: 4px solid #ff1744; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🎨 UUTTA v6.14: Animoitu Nopeusmittari & Live-Graafit:</strong>
                        <p>Täysin uusi visuaalinen kokemus ajon aikana!</p>
                        <ul>
                            <li><strong>🎯 Animoitu neulanenmittari</strong> - Perinteinen mittari modernilla Canvas-toteutuksella</li>
                            <li><strong>🎨 Värilliset varoitukset</strong> - Vihreä (0-80km/h), Keltainen (80-120km/h), Punainen (120km/h+)</li>
                            <li><strong>📊 Live-graafit</strong> - Nopeuskäyrä (30s), korkeusgraafi, G-voiman visualisointi</li>
                            <li><strong>⚙️ Asetuksista valittavissa</strong> - Digitaalinen / Neulanenmittari / Molemmat</li>
                            <li><strong>📱 Mobiilioptimoitu</strong> - Akkuystävälliset animaatiot ja GPU-kiihdytys</li>
                            <li><strong>🔴 Tärinäefekti</strong> - Varoitus yli 140km/h nopeuksilla</li>
                            <li><strong>🎯 Mini G-voiman mittari</strong> - Reaaliaikainen kiihtyvyyden näyttö</li>
                        </ul>
                        <p><strong>Käyttö:</strong> Asetuksista voit valita nopeusmittarin tyylin. "Molemmat"-tilassa näytetään neulanenmittari ja kaikki graafit samanaikaisesti!</p>
                    </div>

                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>📍 UUTTA v6.13: Älykkäät Osamatkat (Segments):</strong>
                        <p>Kun käytät "Jatka ajoa" -toimintoa (esim. työpäivän jälkeen), sovellus ei enää vain lisää kilometrejä mittariin, vaan luo uuden <strong>osamatkan</strong>.</p>
                        <p>Historiassa näet nyt pääkortin sisällä tarkan erittelyn:</p>
                        <ul style="font-size:13px; color:#aaa;">
                            <li>#1 07:30-08:00 (20km) 📍 Koti ➝ Työ</li>
                            <li>#2 16:00-16:30 (22km) 📍 Työ ➝ Kauppa</li>
                        </ul>
                        <p>Tämä auttaa hahmottamaan päivän rakenteen yhdellä silmäyksellä!</p>
                    </div>

                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>🛡️ Tietoturvapäivitys (v6.12):</strong>
                        <ul>
                            <li>Sovellus on nyt täysin lukittu kirjautumattomilta käyttäjiltä.</li>
                            <li>Kirjautumisruudun "Ohjeet"-nappi avaa vain ohjeet, eikä päästä valikoihin.</li>
                        </ul>
                        <strong>📊 Uusi Raportointi (Pro):</strong>
                        <ul>
                            <li><strong>"Luo Raportti"</strong> -nappi Historiassa.</li>
                            <li>Voit suodattaa ajot kuukauden, auton tai tyypin mukaan.</li>
                            <li>Automaattinen <strong>Kilometrikorvauslaskuri (€)</strong>.</li>
                        </ul>
                        <strong>📍 Tarkemmat osoitteet:</strong>
                        <ul>
                            <li>Sovellus nappaa tarkan lähtö- ja loppuosoitteen (esim. "Kotikatu 1") tallennushetkellä.</li>
                        </ul>
                    </div>`
            },
            {
                title: "📲 2. Asennus sovellukseksi (Tärkeä!)",
                content: `
                    <p>Jotta GPS toimii vakaasti taustalla ja osoitepalkit eivät vie tilaa, asenna sivu sovellukseksi:</p>
                    
                    <div class="help-step">
                        <strong>🍎 iPhone (Safari):</strong>
                        <ol>
                            <li>Paina alareunan <strong>Jaa-painiketta</strong> (Neliö, josta nuoli ylös <span style="font-size:16px">share</span>).</li>
                            <li>Selaa valikkoa alaspäin.</li>
                            <li>Valitse <strong>"Lisää Koti-valikkoon"</strong> (Add to Home Screen).</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Paina yläkulman kolmea pistettä (⋮).</li>
                            <li>Valitse <strong>"Asenna sovellus"</strong> tai <strong>"Lisää aloitusnäytölle"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "🏎️ 3. Mittaristo (Dashboard)",
                content: `
                    <p>Näkymä mukautuu automaattisesti puhelimen asennon mukaan.</p>
                    
                    <div class="help-step">
                        <strong>Toiminnot:</strong>
                        <ul>
                            <li><strong>🔴 ALOITA:</strong> Käynnistää uuden tallennuksen.</li>
                            <li><strong>⏯ JATKA:</strong> Oikopolku historiaan vanhan ajon jatkamiseksi.</li>
                            <li><strong>HUD:</strong> Kääntää näytön peilikuvaksi (yöajo).</li>
                            <li><strong>👁️ Silmä-ikoni:</strong> Yksinkertaistettu tila. Piilottaa kaiken paitsi nopeuslukeman.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🚶 Kävely-tilan mittaristo:</strong>
                        Kun valitset autotallista "Kävely", näet:
                        <ul>
                            <li><strong>Askeleet:</strong> Arvioitu matkan perusteella.</li>
                            <li><strong>Tahti:</strong> Nopeus muodossa <em>min/km</em>.</li>
                            <li><strong>Kalorit:</strong> Arvioitu kulutus.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎯 G-Voimamittari (Bubble):</strong>
                        Pieni "tähtäin" ruudulla (ei näy kävely-tilassa).
                        <ul>
                            <li><strong>Keskellä:</strong> Taloudellinen ajo (Eco).</li>
                            <li><strong>Reunalla (Punainen):</strong> Voimakas kiihdytys/jarrutus.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🚗 4. Autotalli ja Valinnat",
                content: `
                    <p>Hallitse kalustoa <strong>Asetukset</strong>-välilehdellä.</p>
                    
                    <div class="help-step">
                        <strong>Valinta ennen ajoa:</strong>
                        Yläpalkin valikosta valitaan käytettävä kulkuneuvo.
                        <br><span style="color:#ff4444; font-weight:bold;">HUOM:</span> Tallennusta ei voi aloittaa "Kaikki ajoneuvot" -tilassa.
                    </div>

                    <div class="help-step">
                        <strong>Ajoneuvotyypit:</strong>
                        <ul>
                            <li><strong>🚗 Auto:</strong> Kartta loitontaa maantienopeuksissa. Eco-analyysi on päällä.</li>
                            <li><strong>🏍️ Moottoripyörä:</strong> Kuin auto, mutta omalla ikonilla. Eco-analyysi päällä.</li>
                            <li><strong>🚲 Pyörä:</strong> Kartta pysyy aina lähikuvassa. Eco-analyysi on pois päältä.</li>
                            <li><strong>🚶 Kävely:</strong> Kartta pysyy lähellä, G-voimamittari pois päältä, ei tankkauksia.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎨 Ulkoasuasetukset:</strong>
                        Asetukset-sivulta voit:
                        <ul>
                            <li>Vaihtaa korostusvärin.</li>
                            <li>Kytkeä päälle "Tiivistetyn historian".</li>
                            <li>Ottaa käyttöön Yksinkertaistetun mittariston.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🗄️ Arkistointi:</strong>
                        Jos myyt auton, voit "Arkistoida" sen Asetukset-sivulta (🗄️-nappi).
                        <ul>
                            <li>Arkistoitu auto ei näy listassa oletuksena.</li>
                            <li>Saat historian näkyviin valitsemalla yläpalkista <em>"Kaikki (sis. arkistoidut)"</em>.</li>
                            <li>Palautus onnistuu painamalla ♻️-nappia.</li>
                        </ul>
                    </div>`
            },
            {
                title: "⏱️ 5. Ajon tallennus & Työajo",
                content: `
                    <div class="help-step">
                        <strong>🔇 Tausta-ajo (Silent Audio Hack):</strong>
                        Kun käynnistät GPS:n, sovellus alkaa toistaa "hiljaisuutta". Tämä huijaa puhelimen pitämään GPS:n päällä taskussa. Älä sulje selainta, vaan jätä se taustalle.
                    </div>

                    <div class="help-step">
                        <strong>💾 Tallennus ja Työajo:</strong>
                        Kun lopetat tallennuksen (STOP), avautuu ikkuna:
                        <ul>
                            <li><strong>Aihe:</strong> Kirjoita lyhyt kuvaus (esim. "Asiakaskäynti").</li>
                            <li><strong>Tyyppi:</strong> Valitse <strong>🏠 Oma ajo</strong> tai <strong>💼 Työajo</strong>.</li>
                        </ul>
                        Tämä valinta erottelee ajot raporteissa (verotusta/laskutusta varten).
                    </div>`
            },
            {
                title: "📝 6. Historia & Muokkaus",
                content: `
                    <div class="help-step">
                        <strong>⏯️ Jatka ajoa:</strong>
                        Voit jatkaa vanhaa ajoa (esim. kätköilypäivä tai usean päivän reissu):
                        <ol>
                            <li>Paina mittaristossa <strong>⏯ JATKA</strong> tai etsi ajo suoraan historiasta.</li>
                            <li>Paina vihreää ⏯️-nappia listassa.</li>
                            <li>Ajo jatkuu siitä mihin jäit. Välissä kulunut aika merkitään tauoksi.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📋 Listan käyttö:</strong>
                        Jos käytät tiivistettyä näkymää, <strong>klikkaa riviä</strong> avataksesi sen. Näet silloin tarkemmat tiedot.
                    </div>

                    <div class="help-step">
                        <strong>✏️ Muokkaus:</strong>
                        Paina kynä-ikonia (✏️) muokataksesi tietoja jälkikäteen.
                    </div>`
            },
            {
                title: "⛽ 7. Tankkaukset",
                content: `
                    <p>Paina mittaristossa <strong>⛽</strong>-nappia lisätäksesi tankkauksen.</p>
                    
                    <div class="help-step">
                        <strong>📉 Keskikulutus (l/100km):</strong>
                        <br>Sovellus laskee automaattisesti keskikulutuksen ja näyttää sen tankkauskortin alareunassa.
                        <ul>
                            <li><strong>Huom:</strong> Lukema vaatii vähintään kaksi peräkkäistä tankkausta samalle autolle.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🆘 8. Crash Recovery (Palautus)",
                content: `
                    <div class="help-step">
                        <strong>Jos sovellus kaatuu tai sammuu:</strong>
                        <br>Esimerkiksi puhelun aikana puhelin voi sammuttaa selaimen taustalta. Kun avaat sovelluksen uudelleen:
                        <ul>
                            <li>Sovellus kysyy: <em>"Ajo keskeytyi! Haluatko palauttaa tilanteen?"</em></li>
                            <li>Vastaa <strong>Kyllä</strong>.</li>
                            <li>Matka, reitti ja kello palautuvat siihen hetkeen mihin ne jäivät.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🕶️ 9. HUD-tila (Yönäkö)",
                content: `
                    <p>Uusi ominaisuus pimeäajoon! HUD (Head-Up Display) kääntää näytön peilikuvaksi ja lisää kontrastia, jolloin se heijastuu tuulilasiin oikein päin.</p>
                    
                    <div class="help-step">
                        <strong>Käyttö:</strong>
                        <ol>
                            <li>Paina yläpalkin <strong>HUD</strong>-nappia.</li>
                            <li>Aseta puhelin kojelaudalle näyttö ylöspäin (säädä kirkkaus täysille).</li>
                            <li>Näet nopeusmittarin heijastuksena tuulilasissa.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>Poistuminen:</strong>
                        Napauta mihin tahansa kohtaan ruutua palataksesi normaaliin tilaan.
                    </div>`
            },
            {
                title: "📡 10. Offline-tila (Ulkomaat)",
                content: `
                    <p>Voit käyttää sovellusta ilman nettiyhteyttä (esim. roaming estetty).</p>
                    
                    <div class="help-step">
                        <strong>⚠️ Tärkeä ensiasennus:</strong>
                        Jotta Offline-tila toimii varmasti, tee näin <strong>ennen matkaa</strong>:
                        <ol>
                            <li>Avaa sovellus puhelimella verkkoyhteyden ollessa päällä.</li>
                            <li><strong>Päivitä sivu</strong> kerran tai kaksi (vedä alas tai paina refresh).</li>
                            <li>Tämä pakottaa sovelluksen tallentamaan uusimman version muistiin.</li>
                            <li>Kokeile laittaa lentokonetila päälle ja avaa sovellus testiksi.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🗺️ Tärkeää kartoista:</strong>
                        <br>Sovellus <strong>EI lataa</strong> koko maan karttoja offline-tilaan.
                        <ul>
                            <li>Jos ajat alueella, jota et ole aiemmin selannut, kartta näkyy <strong>harmaana ruudukkona</strong>.</li>
                            <li><strong>Älä huoli!</strong> Reitti ja kilometrit tallentuvat silti oikein tyhjälle pohjalle.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>Tallennus ilman nettiä:</strong>
                        Kun tallennat ajon ilman verkkoa, se menee puhelimen välimuistiin.
                        <ul>
                            <li>Ajokortti historiassa saa keltaisen reunan: <em>"⚠️ Odottaa lähetystä"</em>.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>Synkronointi (Sync):</strong>
                        Kun pääset verkkoon (esim. WiFi):
                        <ol>
                            <li>Avaa <strong>Historia</strong>-välilehti.</li>
                            <li>Paina ylhäältä keltaista nappia: <strong>"📡 Lähetä odottavat ajot"</strong>.</li>
                            <li>Ajot siirtyvät pilveen ja muuttuvat pysyviksi.</li>
                        </ol>
                    </div>`
            },
            {
                title: "❓ 11. Ongelmatilanteet (UKK)",
                content: `
                    <div class="help-step">
                        <strong>K: GPS-viiva on suora ("teleporttaus")?</strong>
                        <br>V: Signaali katkesi tai virransäästö iski. Varmista, että "hiljainen ääni" saa soida taustalla.
                    </div>
                    <div class="help-step">
                        <strong>K: En löydä vanhaa autoani listalta?</strong>
                        <br>V: Se on arkistoitu. Valitse yläpalkista "Kaikki (sis. arkistoidut)".
                    </div>
                    <div class="help-step">
                        <strong>K: Miten saan tumman teeman pois?</strong>
                        <br>V: Paina yläpalkin aurinko/kuu -ikonia (☀/☾) tai muuta asetuksista.
                    </div>`
            },
            {
                title: "📊 12. Pro-Raportointi & Eurot",
                content: `
                    <p>Uusi työkalu veroilmoitusta ja laskutusta varten.</p>
                    
                    <div class="help-step">
                        <strong>💰 Kilometrikorvauksen asetus:</strong>
                        <ol>
                            <li>Mene raportointi-ikkunaan (Historia -> Luo Raportti).</li>
                            <li>Aseta hinta kohtaan <strong>"Hinta (€/km)"</strong> (oletus 0.57€).</li>
                            <li>Tieto tallentuu muistiin seuraavaa kertaa varten.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📄 Raportin luonti:</strong>
                        <ol>
                            <li>Avaa <strong>Historia</strong> ja paina <strong>"📄 Luo Raportti"</strong>.</li>
                            <li>Valitse <strong>Aikaväli:</strong> (esim. "Viime kuu").</li>
                            <li>Valitse <strong>Tyyppi:</strong> (esim. "Vain Työajot").</li>
                            <li>Näet heti yhteenvedon ja arvioidun rahasumman ruudulla.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📥 Lataus (Excel/CSV):</strong>
                        Paina "Lataa CSV" raportti-ikkunassa. Tiedosto sisältää sarakkeet:
                        <ul>
                            <li>Pvm, Auto, Matka, <strong>Korvaus (€)</strong>, Lähtöosoite, Loppuosoite, Selite.</li>
                        </ul>
                    </div>`
            }
        ]
    },
    en: {
        title: "User Guide",
        version: "Version",
        sections: [
            {
                title: "🚀 1. New (v6.33, v6.32, v6.31, v6.30, v6.29, v6.28, v6.27, v6.23, v6.22, v6.21, v6.20, v6.19, v6.18, v6.17, v6.16, v6.14, v6.13 & v6.12)",
                content: `
                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🗺️ NEW in v6.33: Quick dashboard toggle for mini-map/stats cards:</strong>
                        <ul>
                            <li><strong>A quick button was added to the left of weather</strong> so you can switch between mini-map and stats cards with one tap.</li>
                            <li><strong>No need to open Settings anymore</strong> just to change this dashboard mode.</li>
                            <li><strong>The button reflects current mode</strong> (🗺️ = show mini-map, 📊 = show stats cards).</li>
                        </ul>

                        <strong>🗺️ NEW in v6.32: Dashboard mini-map tile render fix for mobile PWA:</strong>
                        <ul>
                            <li><strong>Fixed a bug</strong> where map tiles could render only as a tiny square in the top-left corner.</li>
                            <li><strong>Added repeated invalidateSize resize scheduling</strong> for view switches, orientation changes and app resume events.</li>
                            <li><strong>This specifically improves installed mobile PWA behavior</strong> (for example Samsung Internet app mode).</li>
                        </ul>

                        <strong>🗺️ NEW in v6.31: Dashboard mini-map mobile fix:</strong>
                        <ul>
                            <li><strong>Fixed a bug</strong> where the mini-map could appear as a very thin strip on phones.</li>
                            <li><strong>The map window now has stable height rules</strong> (min-height + flex-basis) to prevent collapse.</li>
                        </ul>

                        <strong>📈 NEW in v6.30: 5-minute trend lines in Velocity Stage:</strong>
                        <ul>
                            <li><strong>A speed trend line</strong> is now drawn for the latest ~5 minutes.</li>
                            <li><strong>An altitude trend line</strong> is also included as a lighter layer.</li>
                            <li><strong>Both lines stay behind the speed readout</strong>, not over the number.</li>
                        </ul>

                        <strong>🗺️ NEW in v6.29: Map instead of stats cards:</strong>
                        <ul>
                            <li><strong>New settings option:</strong> "Map instead of stats cards".</li>
                            <li><strong>On dashboard, the 2x3 stats cards</strong> can now be replaced by a live mini-map window.</li>
                            <li><strong>The mode is remembered</strong> (localStorage), so your choice persists on next launch.</li>
                        </ul>

                        <strong>🌈 NEW in v6.28: HUD themes + Velocity Stage:</strong>
                        <ul>
                            <li><strong>Two dedicated HUD color themes</strong> (Cyber Blue / Sunset Gold).</li>
                            <li><strong>A completely new special view</strong> "Velocity Stage" adds a futuristic speed stage (track + lanes + state).</li>
                            <li><strong>Speedometer style settings</strong> now include "Velocity Stage".</li>
                        </ul>

                        <strong>✨ NEW in v6.27: Pulse HUD speed view:</strong>
                        <ul>
                            <li><strong>The old needle gauge was replaced</strong> with a premium Pulse HUD speed display.</li>
                            <li><strong>Reactive arc + speed states</strong> (READY / CRUISE / FAST / HYPER) improve readability while driving.</li>
                            <li><strong>Settings speedometer style</strong> now shows the option "Pulse HUD".</li>
                        </ul>

                        <strong>🛣️ NEW in v6.23: Road speed limit on dashboard:</strong>
                        <ul>
                            <li><strong>Road-specific speed limit</strong> is fetched from OSM data near your location.</li>
                            <li><strong>General estimate</strong> is shown in a different color so you can treat it with caution.</li>
                            <li>If no data is available, the card shows <strong>No data</strong>.</li>
                        </ul>

                        <strong>🎯 NEW in v6.22: POI sensitivity + re-arm + dynamic speedcamera radius:</strong>
                        <ul>
                            <li><strong>POI sensitivity</strong> (Strict / Normal / Sensitive) now adjusts heading and confidence thresholds.</li>
                            <li><strong>Re-alert distance (m)</strong> prevents immediate duplicate alerts for the same POI after passing it.</li>
                            <li><strong>Speed cameras</strong> now use a speed-based dynamic alert radius.</li>
                        </ul>

                        <strong>🧭 NEW in v6.21: adaptive GPS filter + POI regression test:</strong>
                        <ul>
                            <li><strong>Speed and heading</strong> are now smoothed based on GPS accuracy to reduce jitter.</li>
                            <li><strong>POI confidence</strong> now weighs distance, segment pass, heading and GPS accuracy.</li>
                            <li><strong>POI debug log</strong> now includes a "Run regression test" button that writes results.</li>
                        </ul>

                        <strong>🔊 NEW in v6.20: Per-POI sound profile override:</strong>
                        <ul>
                            <li><strong>POI modal</strong> now includes an optional sound profile just for that POI.</li>
                            <li>If no override is selected, the app uses the POI type sound profile automatically.</li>
                        </ul>

                        <strong>🔊 NEW in v6.19: Louder POI audio + per-type sound profiles:</strong>
                        <ul>
                            <li><strong>POI master volume</strong> is now adjustable in Settings.</li>
                            <li><strong>Per-type sound profiles</strong> are available for speed camera, danger, customer, reminder, and other POIs.</li>
                            <li><strong>Test buttons</strong> let you preview each POI type sound instantly.</li>
                        </ul>

                        <strong>📍 NEW in v6.17: Speed camera import + POI modal editor + map edit:</strong>
                        <ul>
                            <li><strong>⬆ Import speed cameras (CSV/SVC)</strong> from Settings (lon,lat is auto-fixed).</li>
                            <li><strong>🔎 Search + filter + nearby</strong> in the POI list (scales to large imports).</li>
                            <li><strong>🗺️ Edit/Delete on map</strong> by tapping a POI.</li>
                            <li><strong>🧾 Paste coordinates in one field</strong> (geocaching format or CSV style).</li>
                        </ul>

                        <strong>📍 NEW in v6.16: POIs + Alerts + Drive Markers:</strong>
                        <p>You can save permanent Points of Interest (POIs) on the map (for example speed cameras) and get a live distance warning when approaching. You can also add per-drive markers during a recording (notes along the route).</p>
                        <ul>
                            <li><strong>📌 POI (permanent)</strong> is saved to Firebase and is always visible on the map.</li>
                            <li><strong>📌 Drive marker</strong> is saved only inside that single drive (History → map shows them).</li>
                            <li><strong>📣 Alert shows meters remaining</strong> and the number decreases as you approach.</li>
                            <li><strong>🧭 Speed camera alerts use direction filtering</strong> when device heading is available, reducing alerts for the opposite direction.</li>
                        </ul>

                        <strong>1) Add a POI (speed camera / danger / reminder):</strong>
                        <ol>
                            <li>Open <strong>Settings</strong>.</li>
                            <li>Go to <strong>📍 Points of Interest (POI)</strong>.</li>
                            <li>Choose how to add:
                                <ul>
                                    <li><strong>+ Add at current location</strong> (uses latest GPS)</li>
                                    <li><strong>+ Add with coordinates</strong> (geocaching format supported, e.g. <em>N 60° 10.123 E 024° 56.789</em>)</li>
                                    <li><strong>+ Add from map</strong> → open Map and <strong>long-press</strong> the location (or right-click on desktop)</li>
                                </ul>
                            </li>
                            <li>Configure (optional):
                                <ul>
                                    <li><strong>Alert on/off</strong></li>
                                    <li><strong>Radius (m)</strong> (default 350m)</li>
                                    <li><strong>Cooldown (s)</strong> (prevents repeated vibration/alerts at the same spot)</li>
                                </ul>
                            </li>
                        </ol>

                        <strong>2) How does the alert work while driving?</strong>
                        <ul>
                            <li>When you are inside the radius, you will see something like <strong>"📍 Speed camera: 312 m"</strong>.</li>
                            <li>The distance updates and decreases as you approach. When you leave the radius or reach ~0 m, the alert disappears.</li>
                            <li>If multiple POIs are nearby, the app shows only the <strong>best match</strong> (nearest + direction-compatible) to avoid jumping between alerts.</li>
                        </ul>

                        <strong>3) Drive markers (notes along the recorded route):</strong>
                        <ol>
                            <li>Start recording as usual (<strong>🔴 START</strong>).</li>
                            <li>Tap <strong>📌 MARK</strong> whenever you want to save a point on the route.</li>
                            <li>Enter optional text.</li>
                            <li>Later: <strong>History → 🗺️</strong> to view the route and click markers on the map.</li>
                        </ol>
                    </div>

                    <div class="help-step" style="border-left: 4px solid #ff1744; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🎨 NEW in v6.14: Animated Speedometer & Live Graphs:</strong>
                        <p>Completely new visual experience during driving!</p>
                        <ul>
                            <li><strong>🎯 Animated Needle Speedometer</strong> - Traditional speedometer with modern Canvas implementation</li>
                            <li><strong>🎨 Color-coded Warnings</strong> - Green (0-80km/h), Yellow (80-120km/h), Red (120km/h+)</li>
                            <li><strong>📊 Live Graphs</strong> - Speed curve (30s), altitude graph, G-force visualization</li>
                            <li><strong>⚙️ Selectable in Settings</strong> - Digital / Needle / Both</li>
                            <li><strong>📱 Mobile Optimized</strong> - Battery-friendly animations and GPU acceleration</li>
                            <li><strong>🔴 Vibration Effect</strong> - Warning at speeds over 140km/h</li>
                            <li><strong>🎯 Mini G-force Gauge</strong> - Real-time acceleration display</li>
                        </ul>
                        <p><strong>Usage:</strong> In Settings, choose speedometer style. "Both" mode shows needle speedometer and all graphs!</p>
                    </div>

                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>📍 NEW in v6.13: Smart Segment Tracking:</strong>
                        <p>When you use "Continue Drive" (e.g., after a work day), the app now creates a distinct <strong>segment</strong> instead of just adding kilometers.</p>
                        <p>In History, you will see a breakdown inside the main card:</p>
                        <ul style="font-size:13px; color:#aaa;">
                            <li>#1 07:30-08:00 (20km) 📍 Home ➝ Work</li>
                            <li>#2 16:00-16:30 (22km) 📍 Work ➝ Shop</li>
                        </ul>
                    </div>

                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>🛡️ Security Update (v6.12):</strong>
                        <ul>
                            <li>App is now fully locked for non-logged-in users.</li>
                        </ul>
                        <strong>📊 New Reporting (Pro):</strong>
                        <ul>
                            <li><strong>"Create Report"</strong> button in History.</li>
                            <li>Filter by Month, Car, or Type.</li>
                            <li>Automatic <strong>Mileage Allowance (€)</strong> calculation.</li>
                        </ul>
                        <strong>📍 Precise Addresses:</strong>
                        <ul>
                            <li>Captures exact Start and End addresses (e.g. "Main Street 1") upon saving.</li>
                        </ul>
                    </div>`
            },
            {
                title: "📲 2. Install as App (Important!)",
                content: `
                    <p>To ensure GPS works in the background and to remove address bars, install as an App:</p>
                    
                    <div class="help-step">
                        <strong>🍎 iPhone (Safari):</strong>
                        <ol>
                            <li>Tap the <strong>Share button</strong> at the bottom (Square with arrow up <span style="font-size:16px">share</span>).</li>
                            <li>Scroll down.</li>
                            <li>Select <strong>"Add to Home Screen"</strong>.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Tap the three dots (⋮) in the top corner.</li>
                            <li>Select <strong>"Install App"</strong> or <strong>"Add to Home screen"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "🏎️ 3. Dashboard",
                content: `
                    <p>The view adapts automatically based on phone orientation.</p>
                    
                    <div class="help-step">
                        <strong>Features:</strong>
                        <ul>
                            <li><strong>🔴 START:</strong> Starts a new drive.</li>
                            <li><strong>⏯ CONTINUE:</strong> Shortcut to History to resume a previous drive.</li>
                            <li><strong>HUD:</strong> Mirrors screen for windshield reflection (Night mode).</li>
                            <li><strong>👁️ Eye Icon:</strong> Toggles Minimalist Mode (Speed only).</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🚶 Walking Mode Metrics:</strong>
                        When "Walking" is selected in Garage:
                        <ul>
                            <li><strong>Steps:</strong> Estimated based on distance.</li>
                            <li><strong>Pace:</strong> Shown as <em>min/km</em>.</li>
                            <li><strong>Calories:</strong> Estimated burn.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎯 G-Force Meter (Bubble):</strong>
                        Small "crosshair" on screen.
                        <ul>
                            <li><strong>Center:</strong> Economic driving (Eco).</li>
                            <li><strong>Edge (Red):</strong> Hard acceleration/braking -> "Aggressive" style.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🚗 4. Garage & Selection",
                content: `
                    <p>Drives are always recorded for a specific vehicle.</p>
                    
                    <div class="help-step">
                        <strong>Selection before driving:</strong>
                        Select the vehicle from the top bar dropdown.
                        <br><span style="color:#ff4444; font-weight:bold;">NOTE:</span> You cannot start recording in "All Vehicles" mode. Select a specific car.
                    </div>

                    <div class="help-step">
                        <strong>Vehicle Types:</strong>
                        <ul>
                            <li><strong>🚗 Car:</strong> Map zooms out at highway speeds. Eco-analysis is ON.</li>
                            <li><strong>🏍️ Motorcycle:</strong> Like a car, but with a specific icon. Eco-analysis ON.</li>
                            <li><strong>🚲 Bike:</strong> Map stays zoomed in. Eco-analysis is OFF.</li>
                            <li><strong>🚶 Walking:</strong> Map stays close, no G-force meter, no fuel.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎨 Appearance Settings:</strong>
                        From Settings page you can now:
                        <ul>
                            <li>Change the Accent Color.</li>
                            <li>Enable "Compact History" to see more rows at once.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🗄️ Archiving:</strong>
                        If you sell a car, you can "Archive" it in Settings (🗄️ button).
                        <ul>
                            <li>Archived cars are hidden from the list by default.</li>
                            <li>To see history, select <em>"All (inc. archived)"</em> from the top bar.</li>
                            <li>Restore by pressing the ♻️ button.</li>
                        </ul>
                    </div>`
            },
            {
                title: "⏱️ 5. Recording & Work Trips",
                content: `
                    <div class="help-step">
                        <strong>🔇 Background Drive (Silent Audio Hack):</strong>
                        When you start GPS, the app plays "silence". This tricks the phone to keep GPS active in your pocket. Do not close the browser tab.
                    </div>

                    <div class="help-step">
                        <strong>💾 Saving and Work Trips:</strong>
                        When you stop recording (STOP), a window opens:
                        <ul>
                            <li><strong>Subject:</strong> Write a short desc (e.g., "Client meeting").</li>
                            <li><strong>Type:</strong> Choose <strong>🏠 Private</strong> or <strong>💼 Work</strong>.</li>
                        </ul>
                        This selection separates drives in reports (for tax/billing).
                    </div>`
            },
            {
                title: "📝 6. History & Edit",
                content: `
                    <div class="help-step">
                        <strong>⏯️ Continue Drive:</strong>
                        To continue a previous trip (e.g., multi-stop):
                        <ol>
                            <li>Tap <strong>⏯ CONTINUE</strong> on dashboard (or go to History).</li>
                            <li>Find the drive and tap the green ⏯️ button.</li>
                            <li>Recording resumes. Time between drives is counted as pause.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📋 Using the List:</strong>
                        If using Compact Mode, <strong>tap a row</strong> to expand it and see full details (Weather, Avg Speed etc.). Tap again to close.
                    </div>

                    <div class="help-step">
                        <strong>✏️ Editing (Extended Edit):</strong>
                        Forgot to start? Tap the pencil icon (✏️) in the list.
                        You can later change: Date, Distance (km), Type, and Car.
                    </div>`
            },
            {
                title: "⛽ 7. Refueling",
                content: `
                    <p>Tap the <strong>⛽</strong> button on the dashboard to add a refueling.</p>
                    
                    <div class="help-step">
                        <strong>📉 Avg Consumption (l/100km):</strong>
                        <br>The app automatically calculates consumption based on mileage.
                        <ul>
                            <li><strong>Note:</strong> Requires at least two refuelings for the same car to calculate distance traveled.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🆘 8. Crash Recovery",
                content: `
                    <div class="help-step">
                        <strong>If the app stops unexpectedly:</strong>
                        <br>For example, if a phone call kills the browser process. When you reopen the app:
                        <ul>
                            <li>It will ask: <em>"Drive interrupted! Restore?"</em></li>
                            <li>Tap <strong>Yes</strong>.</li>
                            <li>Distance, route, and timers will be restored to where they left off.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🕶️ 9. HUD Mode (Night Vision)",
                content: `
                    <p>New feature for night driving! HUD (Head-Up Display) mirrors the screen and boosts contrast, reflecting it correctly on the windshield.</p>
                    
                    <div class="help-step">
                        <strong>How to use:</strong>
                        <ol>
                            <li>Tap the <strong>HUD</strong> button in the top bar.</li>
                            <li>Place phone on the dashboard, screen facing up (set brightness to max).</li>
                            <li>The speedometer will reflect on the windshield.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>Exit:</strong>
                        Tap anywhere on the screen to return to normal mode.
                    </div>`
            },
            {
                title: "📡 10. Offline Mode (Roaming)",
                content: `
                    <p>You can use the app without an internet connection.</p>
                    
                    <div class="help-step" style="border-left: 4px solid #ffd600; padding-left: 10px;">
                        <strong>⚠️ Important Setup:</strong>
                        To ensure Offline mode works, do this <strong>before your trip</strong>:
                        <ol>
                            <li>Open the app while you have internet.</li>
                            <li><strong>Refresh the page</strong> once or twice.</li>
                            <li>This forces the app to save the latest version to memory.</li>
                            <li>Test it by switching to Airplane mode.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🗺️ Note on Maps:</strong>
                        <br>The app <strong>does NOT download</strong> full country maps for offline use.
                        <ul>
                            <li>If you drive in a new area without internet, the map will show a <strong>gray grid</strong>.</li>
                            <li><strong>Don't worry!</strong> The route and distance are still recorded correctly on a blank background.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>Saving offline:</strong>
                        Drives are saved to phone memory first.
                        <ul>
                            <li>In History, the drive card gets a yellow border: <em>"⚠️ Pending Sync"</em>.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>Syncing:</strong>
                        When you are online (e.g., WiFi):
                        <ol>
                            <li>Go to <strong>History</strong>.</li>
                            <li>Tap the yellow button: <strong>"📡 Sync pending drives"</strong>.</li>
                            <li>Drives are uploaded to the cloud.</li>
                        </ol>
                    </div>`
            },
            {
                title: "❓ 11. FAQ & Troubleshooting",
                content: `
                    <div class="help-step">
                        <strong>Q: Straight line on map ("teleporting")?</strong>
                        <br>A: Signal lost or battery saver killed the app. Ensure "silent audio" is allowed to play.
                    </div>
                    <div class="help-step">
                        <strong>Q: Can't find my old car?</strong>
                        <br>A: It's archived. Select "All (inc. archived)" from top bar.
                    </div>
                    <div class="help-step">
                        <strong>Q: How to disable dark mode?</strong>
                        <br>A: Tap the sun/moon icon (☀/☾) in the top bar.
                    </div>`
            },
            {
                title: "📊 12. Pro-Reporting & Euro",
                content: `
                    <p>New tool for tax returns and invoicing.</p>
                    
                    <div class="help-step">
                        <strong>💰 Set Mileage Allowance:</strong>
                        <ol>
                            <li>Open the Report window (History -> Create Report).</li>
                            <li>Set price in <strong>"Price (€/km)"</strong> (default 0.57€).</li>
                            <li>This setting is saved for future use.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📄 Create Report:</strong>
                        <ol>
                            <li>Open <strong>History</strong> and tap <strong>"📄 Create Report"</strong>.</li>
                            <li>Select <strong>Period:</strong> (e.g., "Last Month").</li>
                            <li>Select <strong>Type:</strong> (e.g., "Work Trips Only").</li>
                            <li>You see an instant summary and estimated value on screen.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📥 Download (Excel/CSV):</strong>
                        Tap "Download CSV". File includes columns for:
                        <ul>
                            <li>Date, Car, Distance, <strong>Allowance (€)</strong>, Start Address, End Address, Description.</li>
                        </ul>
                    </div>`
            }
        ]
    },
    vi: {
        title: "Hướng Dẫn Sử Dụng",
        version: "Phiên bản",
        sections: [
            {
                title: "🚀 1. Mới trong v6.33, v6.32, v6.31, v6.30, v6.29, v6.28, v6.27, v6.23, v6.22, v6.21, v6.20, v6.19, v6.18, v6.17, v6.16, v6.14, v6.13 & 6.12",
                content: `
                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🗺️ MỚI v6.33: nút chuyển nhanh mini-map/ô thống kê trên dashboard:</strong>
                        <ul>
                            <li><strong>Thêm nút nhanh bên trái phần thời tiết</strong> để đổi giữa mini-map và ô thống kê chỉ bằng một chạm.</li>
                            <li><strong>Không cần vào trang Cài đặt nữa</strong> chỉ để đổi chế độ dashboard này.</li>
                            <li><strong>Nút hiển thị đúng trạng thái hiện tại</strong> (🗺️ = hiện mini-map, 📊 = hiện ô thống kê).</li>
                        </ul>

                        <strong>🗺️ MỚI v6.32: sửa lỗi render tile mini-map cho mobile PWA:</strong>
                        <ul>
                            <li><strong>Sửa lỗi</strong> tile bản đồ đôi khi chỉ hiện thành ô vuông nhỏ ở góc trên bên trái.</li>
                            <li><strong>Thêm lịch invalidateSize lặp lại</strong> khi đổi màn hình, xoay máy và khi app quay lại foreground.</li>
                            <li><strong>Tối ưu đặc biệt cho chế độ app đã cài trên mobile PWA</strong> (ví dụ Samsung Internet).</li>
                        </ul>

                        <strong>🗺️ MỚI v6.31: sửa mini-map trên mobile:</strong>
                        <ul>
                            <li><strong>Sửa lỗi</strong> mini-map trên điện thoại có lúc chỉ hiện thành một dải rất mỏng.</li>
                            <li><strong>Khóa chiều cao ổn định cho khung bản đồ</strong> (min-height + flex-basis) để tránh bị co.</li>
                        </ul>

                        <strong>📈 MỚI v6.30: đường xu hướng 5 phút trong Velocity Stage:</strong>
                        <ul>
                            <li><strong>Vẽ đường xu hướng tốc độ</strong> cho khoảng 5 phút gần nhất.</li>
                            <li><strong>Có thêm đường xu hướng độ cao</strong> mảnh hơn ở nền.</li>
                            <li><strong>Các đường nằm sau số tốc độ</strong>, không đè lên số.</li>
                        </ul>

                        <strong>🗺️ MỚI v6.29: thay ô thống kê bằng bản đồ:</strong>
                        <ul>
                            <li><strong>Thêm tùy chọn trong cài đặt:</strong> "Bản đồ thay cho ô thống kê".</li>
                            <li><strong>Trong dashboard, cụm 2x3 ô thống kê</strong> có thể thay bằng cửa sổ mini-map live.</li>
                            <li><strong>Chế độ được ghi nhớ</strong> (localStorage), mở lại app vẫn giữ lựa chọn.</li>
                        </ul>

                        <strong>🌈 MỚI v6.28: chủ đề HUD + Velocity Stage:</strong>
                        <ul>
                            <li><strong>Hai chủ đề màu HUD riêng</strong> (Cyber Blue / Sunset Gold).</li>
                            <li><strong>Giao diện hoàn toàn mới</strong> "Velocity Stage" mang phong cách tương lai (track + lane + state).</li>
                            <li><strong>Trong cài đặt kiểu đồng hồ</strong> đã có thêm "Velocity Stage".</li>
                        </ul>

                        <strong>✨ MỚI v6.27: giao diện tốc độ Pulse HUD:</strong>
                        <ul>
                            <li><strong>Đồng hồ kim cũ đã được thay</strong> bằng giao diện Pulse HUD nổi bật hơn.</li>
                            <li><strong>Cung phản hồi + trạng thái tốc độ</strong> (READY / CRUISE / FAST / HYPER) giúp dễ đọc khi lái xe.</li>
                            <li><strong>Trong cài đặt kiểu đồng hồ</strong> giờ có lựa chọn "Pulse HUD".</li>
                        </ul>

                        <strong>🛣️ MỚI v6.23: hiển thị giới hạn tốc độ trên dashboard:</strong>
                        <ul>
                            <li><strong>Giới hạn theo tuyến đường</strong> lấy từ dữ liệu OSM gần vị trí hiện tại.</li>
                            <li><strong>Ước lượng chung</strong> hiển thị màu khác để bạn biết đây là giá trị ước lượng.</li>
                            <li>Nếu không có dữ liệu, thẻ sẽ hiện <strong>Không có dữ liệu</strong>.</li>
                        </ul>

                        <strong>🎯 MỚI v6.22: độ nhạy POI + re-arm + bán kính camera động:</strong>
                        <ul>
                            <li><strong>Độ nhạy POI</strong> (Strict / Normal / Sensitive) chỉnh ngưỡng hướng và confidence.</li>
                            <li><strong>Khoảng cách cảnh báo lại (m)</strong> chặn cảnh báo lặp ngay sau khi vừa đi qua cùng POI.</li>
                            <li><strong>Camera tốc độ</strong> dùng bán kính cảnh báo động theo tốc độ.</li>
                        </ul>

                        <strong>🧭 MỚI v6.21: lọc GPS thích ứng + test hồi quy POI:</strong>
                        <ul>
                            <li><strong>Tốc độ và hướng</strong> được làm mượt theo độ chính xác GPS để giảm rung.</li>
                            <li><strong>POI confidence</strong> tính theo khoảng cách, cắt đoạn, hướng và độ chính xác GPS.</li>
                            <li><strong>POI debug log</strong> có nút "Aja regressiotesti" để ghi kết quả test.</li>
                        </ul>

                        <strong>🔊 MỚI v6.20: Override âm thanh cho từng POI:</strong>
                        <ul>
                            <li><strong>Trong POI modal</strong> bạn có thể chọn âm thanh riêng cho từng POI.</li>
                            <li>Nếu không chọn override, ứng dụng tự dùng âm thanh theo loại POI.</li>
                        </ul>

                        <strong>🔊 MỚI v6.19: Âm thanh POI to hơn + cấu hình theo từng loại:</strong>
                        <ul>
                            <li><strong>Âm lượng POI tổng</strong> có thể chỉnh trong Cài đặt.</li>
                            <li><strong>Hồ sơ âm thanh theo loại POI</strong> cho camera tốc độ, nguy hiểm, khách hàng, nhắc nhở và loại khác.</li>
                            <li><strong>Nút Test</strong> giúp nghe thử âm thanh từng loại ngay lập tức.</li>
                        </ul>

                        <strong>📍 MỚI v6.17: Nhập camera tốc độ + POI modal + chỉnh sửa trên bản đồ:</strong>
                        <ul>
                            <li><strong>⬆ Nhập camera tốc độ (CSV/SVC)</strong> trong Cài đặt (tự sửa lon,lat).</li>
                            <li><strong>🔎 Tìm kiếm + lọc + gần nhất</strong> trong danh sách POI.</li>
                            <li><strong>🗺️ Sửa/Xóa trên bản đồ</strong> khi bấm vào POI.</li>
                            <li><strong>🧾 Dán tọa độ 1 ô</strong> (dạng geocache hoặc CSV).</li>
                        </ul>

                        <strong>📍 MỚI v6.16: POI (Điểm đánh dấu) + Cảnh báo + Marker cho từng chuyến:</strong>
                        <p>Bạn có thể lưu các điểm POI cố định trên bản đồ (ví dụ: camera tốc độ) và nhận cảnh báo hiển thị khoảng cách (mét) giảm dần khi tiến gần. Ngoài ra, trong lúc ghi chuyến đi, bạn có thể tạo marker (ghi chú) cho riêng chuyến đó.</p>
                        <ul>
                            <li><strong>📌 POI (cố định)</strong> được lưu vào Firebase và luôn hiển thị trên bản đồ.</li>
                            <li><strong>📌 Marker chuyến đi</strong> chỉ nằm trong chuyến đó (Lịch sử → bản đồ sẽ hiển thị).</li>
                            <li><strong>📣 Cảnh báo hiển thị số mét còn lại</strong> và giảm dần khi bạn tiến gần.</li>
                            <li><strong>🧭 Camera tốc độ lọc theo hướng di chuyển</strong> nếu thiết bị cung cấp heading, giúp giảm cảnh báo "ngược chiều".</li>
                        </ul>

                        <strong>1) Thêm POI (camera / nguy hiểm / nhắc nhở):</strong>
                        <ol>
                            <li>Mở <strong>Cài đặt</strong>.</li>
                            <li>Vào mục <strong>📍 Paikkamerkinnät (POI)</strong>.</li>
                            <li>Chọn cách thêm:
                                <ul>
                                    <li><strong>+ Thêm tại vị trí hiện tại</strong> (dùng GPS gần nhất)</li>
                                    <li><strong>+ Thêm bằng tọa độ</strong> (hỗ trợ định dạng geocaching, ví dụ <em>N 60° 10.123 E 024° 56.789</em>)</li>
                                    <li><strong>+ Thêm từ bản đồ</strong> → mở Bản đồ và <strong>nhấn giữ</strong> vào vị trí (máy tính: nhấp chuột phải)</li>
                                </ul>
                            </li>
                            <li>Cài đặt (tùy chọn):
                                <ul>
                                    <li><strong>Bật/tắt cảnh báo</strong></li>
                                    <li><strong>Bán kính (m)</strong> (mặc định 350m)</li>
                                    <li><strong>Cooldown (giây)</strong> (tránh rung/cảnh báo liên tục tại cùng 1 điểm)</li>
                                </ul>
                            </li>
                        </ol>

                        <strong>2) Cảnh báo hiển thị như thế nào khi lái xe?</strong>
                        <ul>
                            <li>Khi bạn vào trong bán kính, sẽ thấy ví dụ: <strong>"📍 Camera tốc độ: 312 m"</strong>.</li>
                            <li>Khoảng cách cập nhật và giảm dần khi bạn tiến gần. Khi bạn ra khỏi bán kính hoặc đạt ~0 m, cảnh báo sẽ biến mất.</li>
                            <li>Nếu có nhiều POI gần nhau, ứng dụng chỉ hiển thị <strong>POI phù hợp nhất</strong> (gần nhất + đúng hướng) để tránh nhảy liên tục.</li>
                        </ul>

                        <strong>3) Marker cho chuyến đi (ghi chú trên lộ trình):</strong>
                        <ol>
                            <li>Bắt đầu ghi chuyến như bình thường (<strong>🔴 BẮT ĐẦU</strong>).</li>
                            <li>Trong lúc đi, nhấn <strong>📌 MERKKAA</strong> để lưu điểm trên lộ trình.</li>
                            <li>Nhập ghi chú (tùy chọn).</li>
                            <li>Xem lại: <strong>Lịch sử → 🗺️</strong> để xem route và click marker trên bản đồ.</li>
                        </ol>
                    </div>

                    <div class="help-step" style="border-left: 4px solid #ff1744; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🎨 MỚI v6.14: Đồng hồ tốc độ động & Đồ thị trực tiếp:</strong>
                        <p>Trải nghiệm hình ảnh hoàn toàn mới khi lái xe!</p>
                        <ul>
                            <li><strong>🎯 Đồng hồ tốc độ kim loại động</strong> - Đồng hồ truyền thống với hiện thực hiện Canvas hiện đại</li>
                            <li><strong>🎨 Cảnh báo màu sắc</strong> - Xanh (0-80km/h), Vàng (80-120km/h), Đỏ (120km/h+)</li>
                            <li><strong>📊 Đồ thị trực tiếp</strong> - Đường cong tốc độ (30s), đồ thị độ cao, hình ảnh G-lực</li>
                            <li><strong>⚙️ Có thể chọn trong Cài đặt</strong> - Kỹ thuật số / Kim loại / Cả hai</li>
                            <li><strong>📱 Tối ưu hóa di động</strong> - Hoạt ảnh thân thiện với pin và tăng tốc GPU</li>
                            <li><strong>🔴 Hiệu ứng rung</strong> - Cảnh báo ở tốc độ trên 140km/h</li>
                            <li><strong>🎯 Đồng hồ G-lực mini</strong> - Hiển thị gia tốc thời gian thực</li>
                        </ul>
                        <p><strong>Sử dụng:</strong> Trong Cài đặt, chọn kiểu đồng hồ tốc độ. Chế độ "Cả hai" hiển thị đồng hồ kim loại và tất cả đồ thị!</p>
                    </div>

                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>📍 MỚI v6.13: Theo dõi Chặng đường (Segments):</strong>
                        <p>Khi bạn nhấn "Tiếp tục lái" (Continue Drive), ứng dụng sẽ tạo một <strong>phân đoạn</strong> mới.</p>
                        <p>Trong Lịch sử, bạn sẽ thấy chi tiết từng chặng:</p>
                        <ul style="font-size:13px; color:#aaa;">
                            <li>#1 07:30-08:00 (20km) 📍 Nhà ➝ Công ty</li>
                            <li>#2 16:00-16:30 (22km) 📍 Công ty ➝ Cửa hàng</li>
                        </ul>
                    </div>

                    <div class="help-step" style="border-left: 4px solid var(--accent-color); padding-left: 10px; margin-bottom: 15px;">
                        <strong>🛡️ Cập nhật bảo mật (v6.12):</strong>
                        <ul>
                            <li>Ứng dụng hiện đã được khóa hoàn toàn đối với người dùng chưa đăng nhập.</li>
                        </ul>
                        <strong>📊 Báo cáo mới (Pro):</strong>
                        <ul>
                            <li>Nút <strong>"Tạo Báo Cáo"</strong> trong Lịch sử.</li>
                            <li>Lọc theo Tháng, Xe hoặc Loại.</li>
                            <li>Tự động tính <strong>Tiền xăng/công tác phí (€)</strong>.</li>
                        </ul>
                        <strong>📍 Địa chỉ chính xác:</strong>
                        <ul>
                            <li>Ghi lại địa chỉ Điểm đầu và Điểm cuối chính xác khi lưu.</li>
                        </ul>
                    </div>`
            },
            {
                title: "📲 2. Cài đặt App (Quan trọng!)",
                content: `
                    <p>Để GPS chạy ổn định và toàn màn hình, hãy cài đặt ứng dụng:</p>
                    
                    <div class="help-step">
                        <strong>🍎 iPhone (Safari):</strong>
                        <ol>
                            <li>Nhấn nút <strong>Chia sẻ</strong> (Hình vuông có mũi tên lên <span style="font-size:16px">share</span>).</li>
                            <li>Cuộn xuống dưới.</li>
                            <li>Chọn <strong>"Thêm vào MH chính"</strong> (Add to Home Screen).</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🤖 Android (Chrome):</strong>
                        <ol>
                            <li>Nhấn dấu ba chấm (⋮) ở góc trên.</li>
                            <li>Chọn <strong>"Cài đặt ứng dụng"</strong> hoặc <strong>"Thêm vào màn hình chính"</strong>.</li>
                        </ol>
                    </div>`
            },
            {
                title: "🏎️ 3. Bảng điều khiển (Dashboard)",
                content: `
                    <p>Giao diện tự động thay đổi theo hướng cầm điện thoại.</p>
                    
                    <div class="help-step">
                        <strong>📱 Chế độ Dọc (Portrait):</strong>
                        <ol>
                            <li><strong>🔴 BẮT ĐẦU:</strong> Chuyến mới.</li>
                            <li><strong>⏯ TIẾP TỤC:</strong> Nối tiếp chuyến cũ.</li>
                            <li><strong>HUD:</strong> Lật ngược màn hình (lái đêm).</li>
                            <li><strong>👁️ Mắt:</strong> Chế độ tối giản (Chỉ hiện tốc độ).</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>🚶 Chế độ Đi bộ:</strong>
                        Khi chọn "Đi bộ", bạn sẽ thấy:
                        <ul>
                            <li><strong>Số bước:</strong> Ước tính theo quãng đường.</li>
                            <li><strong>Tốc độ:</strong> Hiển thị <em>phút/km</em>.</li>
                            <li><strong>Calo:</strong> Ước tính năng lượng tiêu thụ.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎯 Đồng hồ lực G (Bubble):</strong>
                        "Tâm ngắm" nhỏ trên màn hình.
                        <ul>
                            <li><strong>Ở giữa:</strong> Lái xe tiết kiệm (Eco).</li>
                            <li><strong>Ở mép (Đỏ):</strong> Tăng tốc/phanh gấp -> Lái xe "Gắt" (Aggressive).</li>
                        </ul>
                    </div>`
            },
            {
                title: "🚗 4. Gara xe & Lựa chọn",
                content: `
                    <p>Dữ liệu chuyến đi luôn được lưu cho một xe cụ thể.</p>
                    
                    <div class="help-step">
                        <strong>Chọn xe trước khi lái:</strong>
                        Chọn xe từ menu thả xuống ở thanh trên cùng.
                        <br><span style="color:#ff4444; font-weight:bold;">LƯU Ý:</span> Không thể ghi hình ở chế độ "Tất cả xe". Hãy chọn một xe cụ thể.
                    </div>

                    <div class="help-step">
                        <strong>Loại xe:</strong>
                        <ul>
                            <li><strong>🚗 Ô tô (Car):</strong> Bản đồ thu nhỏ khi chạy nhanh. Phân tích Eco BẬT.</li>
                            <li><strong>🏍️ Xe máy (Motorcycle):</strong> Giống ô tô, có icon riêng. Phân tích Eco BẬT.</li>
                            <li><strong>🚲 Xe đạp (Bike):</strong> Bản đồ luôn phóng to. Phân tích Eco TẮT.</li>
                            <li><strong>🚶 Đi bộ (Walking):</strong> MỚI! Bản đồ phóng to, không đo lực G, không đổ xăng.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🎨 Cài đặt Giao diện:</strong>
                        Trong trang Cài đặt, bạn có thể:
                        <ul>
                            <li>Đổi màu chủ đạo.</li>
                            <li>Bật "Lịch sử thu gọn" để xem danh sách gọn hơn.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>🗄️ Lưu trữ (Archiving):</strong>
                        Nếu bán xe, bạn có thể "Lưu trữ" trong Cài đặt (nút 🗄️).
                        <ul>
                            <li>Xe đã lưu trữ sẽ bị ẩn khỏi danh sách.</li>
                            <li>Để xem lịch sử, chọn <em>"Tất cả (bao gồm đã lưu trữ)"</em> ở thanh trên cùng.</li>
                            <li>Khôi phục bằng cách nhấn nút ♻️.</li>
                        </ul>
                    </div>`
            },
            {
                title: "⏱️ 5. Ghi hình & Công tác",
                content: `
                    <div class="help-step">
                        <strong>🔇 Chạy nền (Silent Audio Hack):</strong>
                        Khi bật GPS, ứng dụng phát "âm thanh im lặng". Điều này đánh lừa điện thoại để giữ GPS hoạt động trong túi. Đừng đóng tab trình duyệt.
                    </div>

                    <div class="help-step">
                        <strong>💾 Lưu và Chuyến đi công tác:</strong>
                        Khi dừng ghi (STOP), cửa sổ hiện ra:
                        <ul>
                            <li><strong>Chủ đề:</strong> Ghi chú ngắn (ví dụ: "Gặp khách hàng").</li>
                            <li><strong>Loại:</strong> Chọn <strong>🏠 Cá nhân (Private)</strong> hoặc <strong>💼 Công việc (Work)</strong>.</li>
                        </ul>
                        Lựa chọn này giúp tách biệt báo cáo (để tính thuế/thanh toán).
                    </div>`
            },
            {
                title: "📝 6. Lịch sử & Chỉnh sửa",
                content: `
                    <div class="help-step">
                        <strong>⏯️ Tiếp tục lái:</strong>
                        Để nối tiếp chuyến đi trước:
                        <ol>
                            <li>Nhấn <strong>⏯ TIẾP TỤC</strong> ở màn hình chính.</li>
                            <li>Tìm chuyến đi và nhấn nút ⏯️ màu xanh.</li>
                            <li>Thời gian nghỉ sẽ được tính là tạm dừng.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📋 Lịch sử mở rộng:</strong>
                        Nếu đang dùng chế độ thu gọn, hãy <strong>chạm vào dòng</strong> chuyến đi để mở rộng và xem chi tiết. Chạm lại để đóng.
                    </div>

                    <div class="help-step">
                        <strong>✏️ Chỉnh sửa (Extended Edit):</strong>
                        Quên bật ứng dụng? Nhấn biểu tượng bút chì (✏️) trong danh sách.
                        Bạn có thể sửa lại: Ngày, Quãng đường (km), Loại chuyến và Xe.
                    </div>`
            },
            {
                title: "⛽ 7. Đổ xăng",
                content: `
                    <p>Nhấn nút <strong>⛽</strong> trên bảng điều khiển để thêm lần đổ xăng.</p>
                    
                    <div class="help-step">
                        <strong>📉 Tiêu thụ (l/100km):</strong>
                        <br>Ứng dụng tự động tính mức tiêu thụ.
                        <ul>
                            <li><strong>Lưu ý:</strong> Cần ít nhất 2 lần đổ xăng liên tiếp để tính.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🆘 8. Khôi phục sự cố (Crash Recovery)",
                content: `
                    <div class="help-step">
                        <strong>Nếu ứng dụng tắt đột ngột:</strong>
                        <br>Ví dụ khi có cuộc gọi đến. Khi mở lại:
                        <ul>
                            <li>Ứng dụng hỏi: <em>"Chuyến đi bị gián đoạn! Khôi phục?"</em></li>
                            <li>Chọn <strong>Có (Yes)</strong>.</li>
                            <li>Quãng đường và thời gian sẽ được khôi phục.</li>
                        </ul>
                    </div>`
            },
            {
                title: "🕶️ 9. Chế độ HUD (Ban đêm)",
                content: `
                    <p>Tính năng mới cho lái xe đêm! HUD (Head-Up Display) lật ngược màn hình và tăng độ tương phản để phản chiếu lên kính lái.</p>
                    
                    <div class="help-step">
                        <strong>Cách dùng:</strong>
                        <ol>
                            <li>Nhấn nút <strong>HUD</strong> ở thanh trên cùng.</li>
                            <li>Đặt điện thoại lên taplo, màn hình hướng lên (chỉnh độ sáng tối đa).</li>
                            <li>Đồng hồ tốc độ sẽ phản chiếu lên kính lái đúng chiều.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>Thoát:</strong>
                        Chạm vào bất kỳ đâu trên màn hình để trở lại bình thường.
                    </div>`
            },
            {
                title: "📡 10. Chế độ Offline (Không mạng)",
                content: `
                    <p>Lái xe khi không có internet.</p>
                    
                    <div class="help-step" style="border-left: 4px solid #ffd600; padding-left: 10px;">
                        <strong>⚠️ Cài đặt quan trọng:</strong>
                        Để đảm bảo chế độ Offline hoạt động, hãy làm điều này <strong>trước chuyến đi</strong>:
                        <ol>
                            <li>Mở ứng dụng khi có kết nối mạng.</li>
                            <li><strong>Tải lại trang (Refresh)</strong> một hoặc hai lần.</li>
                            <li>Điều này buộc ứng dụng lưu phiên bản mới nhất vào bộ nhớ.</li>
                            <li>Thử bật chế độ máy bay để kiểm tra.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>Lưu offline:</strong>
                        Dữ liệu được lưu vào bộ nhớ tạm.
                        <ul>
                            <li>Trong Lịch sử, thẻ chuyến đi sẽ có viền vàng: <em>"⚠️ Chờ đồng bộ"</em>.</li>
                        </ul>
                    </div>

                    <div class="help-step">
                        <strong>Đồng bộ (Sync):</strong>
                        Khi có mạng (WiFi):
                        <ol>
                            <li>Vào <strong>Lịch sử</strong>.</li>
                            <li>Nhấn nút vàng: <strong>"📡 Gửi dữ liệu chờ"</strong>.</li>
                            <li>Dữ liệu sẽ được lưu lên đám mây an toàn.</li>
                        </ol>
                    </div>`
            },
            {
                title: "❓ 11. FAQ (Câu hỏi thường gặp)",
                content: `
                    <div class="help-step">
                        <strong>H: Bản đồ hiện đường thẳng tắp ("Dịch chuyển tức thời")?</strong>
                        <br>Đ: Mất tín hiệu hoặc chế độ tiết kiệm pin đã tắt ứng dụng. Hãy đảm bảo "âm thanh im lặng" được phép phát.
                    </div>
                    <div class="help-step">
                        <strong>H: Không thấy xe cũ đâu?</strong>
                        <br>Đ: Xe đã bị lưu trữ. Chọn "Tất cả (bao gồm đã lưu trữ)" ở thanh trên.
                    </div>
                    <div class="help-step">
                        <strong>H: Tắt chế độ tối (Dark mode) thế nào?</strong>
                        <br>Đ: Nhấn biểu tượng mặt trời/trăng (☀/☾) ở thanh trên cùng.
                    </div>`
            },
            {
                title: "📊 12. Báo cáo Pro & Euro",
                content: `
                    <p>Công cụ mới cho kê khai thuế và lập hóa đơn.</p>
                    
                    <div class="help-step">
                        <strong>💰 Đặt giá cước (Mileage Allowance):</strong>
                        <ol>
                            <li>Mở cửa sổ Báo cáo (Lịch sử -> Tạo Báo Cáo).</li>
                            <li>Đặt giá tại ô <strong>"Giá (€/km)"</strong> (mặc định 0.57€).</li>
                            <li>Cài đặt này sẽ được lưu cho lần sau.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📄 Tạo báo cáo:</strong>
                        <ol>
                            <li>Mở <strong>Lịch sử</strong> và nhấn <strong>"📄 Tạo Báo Cáo"</strong>.</li>
                            <li>Chọn <strong>Thời gian:</strong> (ví dụ: "Tháng trước").</li>
                            <li>Chọn <strong>Loại:</strong> (ví dụ: "Chỉ công việc").</li>
                            <li>Bạn sẽ thấy tóm tắt và số tiền ước tính ngay trên màn hình.</li>
                        </ol>
                    </div>

                    <div class="help-step">
                        <strong>📥 Tải xuống (Excel/CSV):</strong>
                        Nhấn "Tải xuống CSV". File bao gồm các cột:
                        <ul>
                            <li>Ngày, Xe, Khoảng cách, <strong>Phụ cấp (€)</strong>, Điểm đi, Điểm đến, Ghi chú.</li>
                        </ul>
                    </div>`
            }
        ]
    }
};

// --- LOGIIKKA / LOGIC ---

window.renderHelp = function(lang) {
    const container = document.getElementById('help-view');
    if (!container) {
        console.warn("Help container not found!");
        return;
    }

    const data = helpData[lang] || helpData['fi'];
    const ver = (typeof APP_VERSION !== 'undefined') ? APP_VERSION : '6.13';

    // 1. Kielinapit
    const buttons = `
        <div style="display:flex; justify-content:center; gap:10px; margin-bottom:20px;">
            <button onclick="window.renderHelp('fi')" class="action-btn" style="width:auto; padding:5px 15px; background-color:${lang==='fi'?'var(--accent-color)':'#333'};">🇫🇮 Suomi</button>
            <button onclick="window.renderHelp('en')" class="action-btn" style="width:auto; padding:5px 15px; background-color:${lang==='en'?'var(--accent-color)':'#333'};">🇬🇧 English</button>
            <button onclick="window.renderHelp('vi')" class="action-btn" style="width:auto; padding:5px 15px; background-color:${lang==='vi'?'var(--accent-color)':'#333'};">🇻🇳 Tiếng Việt</button>
        </div>
    `;

    // 2. Otsikko
    let contentHtml = buttons + `
        <div style="text-align:center; margin-bottom: 30px;">
            <img src="ajopaivakirja_logo.png?v=6.05" style="width:80px; height:80px; border-radius:50%; border:2px solid var(--accent-color); margin-bottom:10px;">
            <h2 style="color:var(--accent-color); text-transform: uppercase; letter-spacing: 1px; margin:0;">${data.title}</h2>
            <p style="opacity:0.7; font-size:12px;">Mikkokalevin Ajo Pro v${ver}</p>
        </div>
    `;

    // 3. Osiot
    data.sections.forEach(section => {
        contentHtml += `
            <div class="help-section">
                <h3>${section.title}</h3>
                ${section.content}
            </div>
        `;
    });

    // 4. Footer
    contentHtml += `
        <div style="text-align: center; margin-top: 50px; color: #888; font-size: 11px; padding-bottom: 30px;">
            Designed for drivers & walkers.
        </div>
    `;

    container.innerHTML = contentHtml;
};

// SUORITETAAN HETI
window.renderHelp('fi');
