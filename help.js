// =========================================================
// HELP.JS - BILINGUAL MASTER GUIDE (v6.53 THEME CLEANUP)
// =========================================================

// --- KÄÄNNÖKSET / TRANSLATIONS ---
const helpData = {
    fi: {
        title: "Käyttöopas",
        version: "Versio",
        sections: [
            {
                title: "🚀 1. Uutta (v6.52, v6.51, v6.50, v6.49, v6.48, v6.47, v6.46, v6.44, v6.43, v6.42, v6.41, v6.40, v6.39, v6.38, v6.37, v6.36, v6.35, v6.34, v6.33, v6.32, v6.31, v6.30, v6.29, v6.28, v6.27, v6.23, v6.22, v6.21, v6.20, v6.19, v6.18, v6.17, v6.16, v6.14, v6.13 & v6.12)",
                content: `
                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🔆 UUTTA v6.52: Näytön pitäminen päällä -asetus:</strong>
                        <ul>
                            <li>Asetuksiin lisätty <strong>"Pidä näyttö päällä ajon aikana"</strong> -valinta (oletuksena päällä).</li>
                            <li>Sovellus hakee näytön pitämisen nyt myös <strong>30 sekunnin välein uudelleen</strong>, jos se on kadonnut.</li>
                            <li><strong>Huom iPadOS:ssä:</strong> split-view-tilassa vain aktiivinen sovellus voi pitää näytön päällä. Varmista lisäksi iPadin asetuksista: Näyttö ja kirkkaus → Automaattinen lukitus → <strong>Ei koskaan</strong>.</li>
                        </ul>
                        <strong>🗺️ UUTTA v6.51: Yhdistetyn reitin yhteenveto pysyy kartalla:</strong>
                        <ul>
                            <li>Kun useita ajoja näytetään yhdistettynä reitinä, tiedot (ajojen määrä, kilometrit ja aika) näkyvät nyt <strong>pysyvästi kartan oikeassa alakulmassa</strong>.</li>
                            <li>Voit sulkea yhteenvedon itse ruksista, tai se katoaa automaattisesti kun valitset yhden reitin tai palautat GPS-seurannan.</li>
                        </ul>
                        <strong>🗓️ UUTTA v6.50: Päiväkohtainen ajanjako ja yhdistetty reitti:</strong>
                        <ul>
                            <li><strong>Pitkät ajot jaetaan automaattisesti päiväkohtaisiksi</strong> tallennusvaiheessa, kun ajo ylittää vuorokauden (esim. monen päivän reissu).</li>
                            <li><strong>Historiassa voi valita useita ajoja</strong> rastittamalla ne ja painamalla <strong>"Näytä valitut kartalla"</strong>.</li>
                            <li>Valittujen ajojen reitit piirretään kartalle peräkkäin yhdeksi yhdistetyksi reitiksi.</li>
                            <li>Ruudulla näytetään valittujen ajojen yhteinen kilometrimäärä ja aika.</li>
                        </ul>
                        <strong>🎨 UUTTA v6.47: Velocity Stage teema + Clean Digital -näkymä:</strong>
                        <ul>
                            <li><strong>Velocity Stage käyttää nyt HUD-teemamuuttujia</strong>, joten värit vaihtuvat Cyber Blue/Sunset Gold -teemojen mukana.</li>
                            <li><strong>Velocity Stage toimii nyt myös päivä-teemassa</strong> (light-theme): vaaleampi tausta ja parempi kontrasti.</li>
                            <li><strong>Uusi Clean Digital -näkymä</strong>: minimalistinen pyöreä progress bar + suuri numero, toimii sekä päivällä että yöllä.</li>
                        </ul>
                        <strong>🛠️ UUTTA v6.46: ensimmäinen GPS-näyte ja POI-regressiotesti:</strong>
                        <ul>
                            <li><strong>Ensimmäinen validi GPS-nopeusnäyte näytetään nyt heti</strong> ilman virheellistä puolittumista.</li>
                            <li><strong>POI-regressiotesti eristää laitteen GPS-tarkkuuden</strong>, joten sisätilan huono signaali ei aiheuta testille väärää hylkäystä.</li>
                            <li><strong>POI-nopeuskameran suunta-suodatus huomioi nyt GPS-segmentin</strong>, joten harvat GPS-pisteet eivät ohita nopeuskameraa silloin, kun ajosuunta on oikea.</li>
                        </ul>
                        <strong>🧪 UUTTA v6.44: julkaisu- ja GPS-regressiotestit:</strong>
                        <ul>
                            <li><strong>PWA-versionumerot yhtenäistettiin</strong>, jotta HTML, scriptit ja Service Worker käyttävät samaa julkaisua.</li>
                            <li><strong>Firebase-alustus muutettiin deterministiseksi</strong>: selain ei enää yritä hakea `.env`-tiedostoa liian myöhään Firebase-alustuksen jälkeen.</li>
                            <li><strong>Debug-lokin regressiotestit</strong> ajavat nyt sekä POI- että GPS-nopeustestit ja palauttavat GPS:n globaalin tilan testin jälkeen.</li>
                        </ul>
                        <strong>🧭 UUTTA v6.43: pyörätilan oletuskartta maastokartaksi:</strong>
                        <ul>
                            <li><strong>Erillinen "Pyöräilykartta" poistettiin</strong>, koska se ei latautunut luotettavasti kaikilla laitteilla.</li>
                            <li><strong>Pyörätilassa ison kartan oletuspohja on nyt Maastokartta</strong>.</li>
                            <li><strong>Dashboardin mini-kartta käyttää pyörätilassa myös maastokarttaa</strong>.</li>
                        </ul>

                        <strong>🧩 UUTTA v6.42: karttatason valinnan pysyvyys + pyöräilykartan fallback:</strong>
                        <ul>
                            <li><strong>Pyörätilan auto-vaihto pyöräilykarttaan tehdään nyt vain siirtymähetkellä</strong>, joten voit vaihtaa käsin Satelliitti/Maastokartta/Peruskartta -tasoon ilman että valinta pakotetaan takaisin.</li>
                            <li><strong>Pyöräilykartalle lisättiin automaattinen varalähde</strong>: jos ensisijainen CyclOSM-URL ei lataa tiilejä, sovellus vaihtaa toiseen lähteeseen.</li>
                        </ul>

                        <strong>🧭 UUTTA v6.41: karttatasovalitsimen käytettävyyskorjaus:</strong>
                        <ul>
                            <li><strong>Isokartan tasovalitsin siirrettiin oikeasta yläkulmasta vasempaan yläkulmaan</strong>, jotta se ei jää GPS ON/OFF -napin alle.</li>
                            <li><strong>Karttatasovalitsimen klikattavuus nostettiin varmaksi</strong> (z-index + marginaalit), jotta Satelliitti/Maastokartta/Peruskartta/Pyöräilykartta vaihtuvat oikein.</li>
                        </ul>

                        <strong>🧩 UUTTA v6.40: pyöräilykartan latauskorjaus:</strong>
                        <ul>
                            <li><strong>Pyöräilykartan tiilipalvelun URL vaihdettiin luotettavampaan endpointiin</strong>, jotta karttataso latautuu myös niillä laitteilla joissa se jäi tyhjäksi.</li>
                            <li><strong>Korjaus tehtiin sekä pääkartan että dashboardin mini-kartan pyöräilytasoon</strong>.</li>
                        </ul>

                        <strong>🗺️ UUTTA v6.39: pyöräilykarttataso + automaattinen kartan vaihto pyörätilassa:</strong>
                        <ul>
                            <li><strong>Pääkarttaan lisätty uusi "Pyöräilykartta" (CyclOSM)</strong>, joka korostaa pyöräteitä ja pyöräilyyn sopivia reittejä (huom: erillinen pyöräilykartta poistettiin myöhemmin v6.43:ssa luotettavuussyistä).</li>
                            <li><strong>Kun valitset ajoneuvoksi pyörän, kartta vaihtuu automaattisesti pyöräilykarttaan</strong> sekä pääkartassa että dashboardin mini-kartassa.</li>
                            <li><strong>Kun poistut pyörätilasta, kartta palautuu aiempaan ei-pyörä-tasoon</strong> (esim. Peruskartta/Satelliitti/Maastokartta).</li>
                        </ul>

                        <strong>🚲 UUTTA v6.38: pyörätilan Velocity Stage + pyöräystävällinen mini-kartta:</strong>
                        <ul>
                            <li><strong>Pyörää valittaessa näkymä käyttää Velocity Stagea</strong> ja nopeustrendi skaalautuu pyöräajoon (0–60 km/h).</li>
                            <li><strong>Mini-kartta käyttää pyörätilassa lähempää zoomia ja pyöräteemaisia värejä</strong> paremman luettavuuden vuoksi.</li>
                            <li><strong>Nopeusrajoituskortti piilotetaan pyörä-/kävelytilassa</strong> ja turha tiekohtainen nopeusrajoitushaku ohitetaan.</li>
                            <li><strong>Nopeuskamerahälytykset pysyvät poissa pyörätilassa</strong>, jotta käyttöliittymä ei häiritse pyöräilyä.</li>
                        </ul>

                        <strong>🎯 UUTTA v6.37: nopeuden luottamusindikaattori + cruise-stability:</strong>
                        <ul>
                            <li><strong>Mittariston viereen lisättiin A/B/C-luottamusmerkki</strong> (GPS/DER/EST), joka kertoo kuinka luotettava nopeusnäyte on juuri nyt.</li>
                            <li><strong>Cruise-stability mode (50–90 km/h)</strong> vähentää pientä GPS-jitteriä tasaisessa ajossa.</li>
                            <li><strong>Äkillisiä virheputouksia suodatetaan aiempaa tarkemmin</strong> etenkin vakionopeusalueella.</li>
                        </ul>

                        <strong>📉 UUTTA v6.36: nopeustrendin skaala + luotettavampi GPS-nopeus:</strong>
                        <ul>
                            <li><strong>Speed-trendin asteikko muutettu 0–140 km/h</strong> selkeämpää tulkintaa varten.</li>
                            <li><strong>GPS-nopeuteen lisätty lisäsuojaus</strong> äkillisiä virheellisiä pudotuksia vastaan (heikko tarkkuus / puuttuva speed-arvo).</li>
                            <li><strong>Puuttuva laitenopeus korvataan tarvittaessa liikkeestä johdetulla nopeudella</strong>, jolloin mittari käyttäytyy tasaisemmin vakaassa ajossa.</li>
                        </ul>

                        <strong>🗺️ UUTTA v6.35: Historiakartan POI-pisteiden piilottaminen pitkille reiteille:</strong>
                        <ul>
                            <li><strong>Kun avaat reitin historiasta kartalle, POI-pisteet piilotetaan automaattisesti</strong>, jotta reitti näkyy selkeämmin.</li>
                            <li><strong>POI:t palautuvat takaisin</strong>, kun poistut historiakatselusta normaalitilaan.</li>
                        </ul>

                        <strong>🗺️ UUTTA v6.34: Dashboard mini-karttaan ajoviiva liikkeessä:</strong>
                        <ul>
                            <li><strong>Mini-karttaan piirtyy nyt sama live-ajoviiva</strong> kuin isossa karttanäkymässä, kun liikut.</li>
                            <li><strong>Ajoviiva nollautuu uuden ajon alussa</strong> ja palautuu oikein, kun jatkat tai palautat kesken jääneen ajon.</li>
                        </ul>

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
                            <li><strong> Värilliset varoitukset</strong> - Vihreä (0-80km/h), Keltainen (80-120km/h), Punainen (120km/h+ tai rajoituksen ylitys)</li>
                            <li><strong>📊 Live-graafit</strong> - Nopeuskäyrä (30s), korkeusgraafi, G-voiman visualisointi</li>
                            <li><strong>⚙️ Asetuksista valittavissa</strong> - Digitaalinen / Velocity Stage / Clean Digital / Digitaalinen + graafit</li>
                            <li><strong>📱 Mobiilioptimoitu</strong> - Akkuystävälliset animaatiot ja GPU-kiihdytys</li>
                            <li><strong>🎯 Mini G-voiman mittari</strong> - Reaaliaikainen kiihtyvyyden näyttö</li>
                        </ul>
                        <p><strong>Käyttö:</strong> Asetuksista voit valita nopeusmittarin tyylin. "Digitaalinen + graafit" -tilassa näytetään nopeusnumero ja kaikki graafit samanaikaisesti!</p>
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
                title: "🚀 1. New (v6.52, v6.51, v6.50, v6.49, v6.48, v6.47, v6.46, v6.44, v6.43, v6.42, v6.41, v6.40, v6.39, v6.38, v6.37, v6.36, v6.35, v6.34, v6.33, v6.32, v6.31, v6.30, v6.29, v6.28, v6.27, v6.23, v6.22, v6.21, v6.20, v6.19, v6.18, v6.17, v6.16, v6.14, v6.13 & v6.12)",
                content: `
                    <div class="help-step" style="border-left: 4px solid #00e676; padding-left: 10px; margin-bottom: 15px;">
                        <strong>🔆 NEW in v6.52: Keep screen on setting:</strong>
                        <ul>
                            <li>Added a <strong>"Keep screen on while driving"</strong> option in Settings (on by default).</li>
                            <li>The app now also re-requests the screen wake lock <strong>every 30 seconds</strong> if it has been lost.</li>
                            <li><strong>Note on iPadOS:</strong> in Split View only the active app can keep the screen on. Also check iPad Settings → Display & Brightness → Auto-Lock → <strong>Never</strong>.</li>
                        </ul>
                        <strong>🗺️ NEW in v6.51: Combined route summary stays on map:</strong>
                        <ul>
                            <li>When multiple drives are shown as a combined route, the summary (number of drives, kilometres and time) now stays <strong>permanently in the bottom-right corner of the map</strong>.</li>
                            <li>You can close the summary manually with the X, or it disappears automatically when you select a single route or resume GPS tracking.</li>
                        </ul>
                        <strong>🗓️ NEW in v6.50: Day split & combined route:</strong>
                        <ul>
                            <li><strong>Long drives are automatically split by day</strong> during saving when the drive crosses midnight (e.g. multi-day trips).</li>
                            <li><strong>In History you can select multiple drives</strong> by checking the boxes and tapping <strong>"Show selected on map"</strong>.</li>
                            <li>The selected drives are drawn on the map sequentially as one combined route.</li>
                            <li>The screen shows the combined distance and time of the selected drives.</li>
                        </ul>
                        <strong>🎨 NEW in v6.47: Velocity Stage theme fix + Clean Digital view:</strong>
                        <ul>
                            <li><strong>Velocity Stage now uses HUD theme variables</strong>, so colors change with Cyber Blue/Sunset Gold themes.</li>
                            <li><strong>Velocity Stage now works in light theme</strong>: lighter background and better contrast.</li>
                            <li><strong>New Clean Digital view</strong>: minimalist circular progress bar + large number, works in both day and night modes.</li>
                        </ul>
                        <strong>🛠️ NEW in v6.46: first GPS sample and POI regression fix:</strong>
                        <ul>
                            <li><strong>The first valid GPS speed sample is now shown immediately</strong> without incorrect halving.</li>
                            <li><strong>The POI regression test isolates device GPS accuracy</strong>, so a weak indoor signal does not cause a false test failure.</li>
                            <li><strong>POI speedcamera heading filter now considers the GPS segment</strong>, so sparse GPS points don't miss the camera when the segment crosses it.</li>
                        </ul>
                        <strong>🧪 NEW in v6.44: release and GPS regression tests:</strong>
                        <ul>
                            <li><strong>PWA version numbers are now aligned</strong> across HTML, scripts, and the Service Worker.</li>
                            <li><strong>Firebase initialization is deterministic</strong>; the browser no longer reads `.env` too late after Firebase initialization.</li>
                            <li><strong>The debug regression runner</strong> now runs both POI and GPS speed tests and restores GPS global state afterward.</li>
                        </ul>
                        <strong>🧭 NEW in v6.43: terrain as bike-mode default map:</strong>
                        <ul>
                            <li><strong>Separate "Pyöräilykartta" layer was removed</strong> because it was not loading reliably across devices.</li>
                            <li><strong>Main map now defaults to Terrain layer in bike mode</strong>.</li>
                            <li><strong>Dashboard mini-map also uses Terrain in bike mode</strong>.</li>
                        </ul>

                        <strong>🧩 NEW in v6.42: map layer selection persistence + cycling fallback:</strong>
                        <ul>
                            <li><strong>Bike auto-switch to cycling map now happens only on vehicle-type transition</strong>, so manual Street/Satellite/Terrain selection is no longer force-reset.</li>
                            <li><strong>Cycling map now has an automatic fallback source</strong>: if primary CyclOSM tiles fail, app switches to secondary URL.</li>
                        </ul>

                        <strong>🧭 NEW in v6.41: map layer selector usability fix:</strong>
                        <ul>
                            <li><strong>Main-map layer selector was moved from top-right to top-left</strong> so it no longer sits under the GPS ON/OFF button.</li>
                            <li><strong>Layer selector clickability was reinforced</strong> (z-index + spacing), so Street/Satellite/Terrain/Cycling switching works reliably.</li>
                        </ul>

                        <strong>🧩 NEW in v6.40: cycling map loading fix:</strong>
                        <ul>
                            <li><strong>Cycling-map tile URL was switched to a more reliable endpoint</strong> so the layer no longer appears blank on affected devices.</li>
                            <li><strong>Fix was applied to both main map and dashboard mini-map cycling layers</strong>.</li>
                        </ul>

                        <strong>🗺️ NEW in v6.39: cycling map layer + automatic bike-map switching:</strong>
                        <ul>
                            <li><strong>Added a new "Pyöräilykartta" (CyclOSM) layer on the main map</strong> to better highlight bike paths and cycle-friendly routing (note: the separate cycling layer was later removed in v6.43 for reliability).</li>
                            <li><strong>When bike is selected, map switches automatically to cycling layer</strong> on both main map and dashboard mini-map.</li>
                            <li><strong>When leaving bike mode, map restores previous non-bike layer</strong> (street/satellite/terrain).</li>
                        </ul>

                        <strong>🚲 NEW in v6.38: bike-mode Velocity Stage + bike-friendly mini-map:</strong>
                        <ul>
                            <li><strong>When bike is selected, dashboard now uses Velocity Stage</strong> and speed trend scales to biking range (0–60 km/h).</li>
                            <li><strong>Mini-map now uses closer zoom and bike-themed colors in bike mode</strong> for clearer route reading.</li>
                            <li><strong>Speed limit card is hidden in bike/walking mode</strong> and road speed-limit fetch is skipped for those modes.</li>
                            <li><strong>Speed camera alerts remain disabled in bike mode</strong> to avoid irrelevant driving warnings.</li>
                        </ul>

                        <strong>🎯 NEW in v6.37: speed confidence indicator + cruise stability:</strong>
                        <ul>
                            <li><strong>An A/B/C confidence badge was added next to speed readout</strong> (GPS/DER/EST source) to show current speed reliability.</li>
                            <li><strong>Cruise-stability mode (50–90 km/h)</strong> reduces minor GPS jitter during steady driving.</li>
                            <li><strong>Abrupt bogus drops are now filtered more aggressively</strong> in the cruise speed band.</li>
                        </ul>

                        <strong>📉 NEW in v6.36: speed trend scale + more reliable GPS speed:</strong>
                        <ul>
                            <li><strong>Speed trend scale changed to 0–140 km/h</strong> for clearer reading.</li>
                            <li><strong>Added extra guard against abrupt bogus speed drops</strong> during weak GPS accuracy / missing speed samples.</li>
                            <li><strong>When device-reported speed is missing, movement-derived speed is used as fallback</strong> to keep speed readout steadier in constant driving.</li>
                        </ul>

                        <strong>🗺️ NEW in v6.35: History map POI cleanup for long routes:</strong>
                        <ul>
                            <li><strong>When opening a route from History on the map, POI markers are now hidden automatically</strong> so the route remains readable.</li>
                            <li><strong>POIs are restored</strong> when leaving history route viewing back to normal map mode.</li>
                        </ul>

                        <strong>🗺️ NEW in v6.34: Live movement trail on dashboard mini-map:</strong>
                        <ul>
                            <li><strong>The dashboard mini-map now draws the same live route line</strong> as the main map while moving.</li>
                            <li><strong>The trail clears on a new drive</strong> and restores correctly when continuing/restoring a drive.</li>
                        </ul>

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
                            <li><strong> Color-coded Warnings</strong> - Green (0-80km/h), Yellow (80-120km/h), Red (120km/h+ or over speed limit)</li>
                            <li><strong>📊 Live Graphs</strong> - Speed curve (30s), altitude graph, G-force visualization</li>
                            <li><strong>⚙️ Selectable in Settings</strong> - Digital / Velocity Stage / Clean Digital / Digital + graphs</li>
                            <li><strong>📱 Mobile Optimized</strong> - Battery-friendly animations and GPU acceleration</li>
                            <li><strong>🎯 Mini G-force Gauge</strong> - Real-time acceleration display</li>
                        </ul>
                        <p><strong>Usage:</strong> In Settings, choose speedometer style. "Digital + graphs" mode shows the speed number and all graphs at once!</p>
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
