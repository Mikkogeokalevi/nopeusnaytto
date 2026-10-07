# AI_RULES - Nopeusnäyttöprojekti

## 📋 **PROJEKTIN YLEISKUVAUS**

**Projekti:** Mikkokalevin Ajopäiväkirja Pro
**Versio:** v6.56 (talvinopeusrajoitukset: Väylä WFS + OSM conditional)
**Kehittäjä:** Mikkogeokalevi
**AI-assistentti:** Cascade

---

## ⚡ **LUE ENSIN (NOPEA ORIENTOINTI)**

Jos aikaa on vähän, lue nämä tässä järjestyksessä:

1. `PROJECT_STATUS.md` (ajantasainen tilannekuva + viime muutokset)
2. `APP_FLOW_MAP.md` (1-sivun kokonaisflow: login -> GPS -> dashboard -> tallennus -> history/map)
3. `globals.js` (`APP_VERSION` + globaalit tilat)
4. `gps.js` (GPS-looppi, POI-logiikka, nopeusrajoituslogiikka)
5. `ui.js` (näkymät, dashboard-päivitys, toastit)
6. `sw.js` (PWA cache/päivitysstrategia)

Tavoite: uusi sessio pääsee nopeasti "kärryille" ilman koko koodikannan kahlausta.

**Sovelluksen tarkoitus:**
- GPS-pohjainen nopeusnäyttö ja ajopäiväkirja
- Reaaliaikainen nopeusmittari (Digitaalinen / Velocity Stage / Clean Digital / Digitaalinen + graafit)
- Ajoneuvokaluston hallinta
- Polttoainekulutusten seuranta
- Tilastot ja raportointi
- Paikkamerkinnät (POI) kartalle + lähestymisvaroitukset
- Ajon aikaiset markerit (muistiinpisteet reittiin)
- Suunniteltu mobiilikäyttöön (PWA)

---

## 🏗️ **TEKNINEN ARKKITEHTUURI**

### **Frontend:**
- **HTML5/CSS3/JavaScript** (modulaarinen rakenne)
- **PWA** (Progressive Web App)
- **Service Worker** (offline-toiminta)

### **Kirjastot:**
- **Leaflet.js** - kartat
- **Chart.js** - graafit ja tilastot
- **Firebase** - autentikointi ja tietokanta
- **Canvas API** - live-graafit

### **Tiedostorakenne:**
```
nopeusnaytto-main/
├── index.html           # Pääsivu (PWA)
├── manifest.json        # PWA-manifesti
├── sw.js               # Service Worker
├── style.css           # Tyylit
├── app.js              # Sovelluksen käynnistys
├── globals.js          # Globaalit muuttujat + Firebase
├── visuals.js          # UUSI v6.14: Animoitu nopeusmittari
├── ui.js               # Käyttöliittymälogiikka
├── auth.js             # Käyttäjäautentikointi
├── gps.js              # GPS-seuranta ja tallennus
├── map.js              # Karttatoiminnot
├── garage.js           # Ajoneuvotietokanta
├── history.js          # Ajohistoria ja raportit
├── help.js             # KATTAVAT OHJEET (FI/EN)
├── fuel.js             # Tankkaustiedot (legacy, ei ladattuna)
├── .env                # API-avaimet (EI GITHUBIIN)
├── .gitignore          # Git-säännöt
├── varmuuskopioi.bat   # Varmuuskopiointiskripti
└── vie_githubiin.bat   # GitHub-vientiskripti
```

### **Nykyinen tilanne (v6.56):**
- Talvirajoitukset: Väyläviraston WFS (`tiestotiedot:talvi_ja_kesanopeusrajoitukset`) + OSM maxspeed:winter/conditional + moottoritie 120->100-varmistus; kausi-ikkuna 15.10-15.4, ohitus Asetukset -> Talvinopeusrajoitukset
- Ulkoasu: teemat siivottu - jäljellä Digitaalinen / Velocity Stage / Clean Digital / Digitaalinen + graafit (LCARS, Time Circuit, Pulse HUD ja neulamittari poistettu v6.53)
- Ikonit: yhtenäinen SVG-sprite (36 symbolia), ei emoji-ikoneja UI-chromessa; `window.uiIcon(id)` dynaamisille ikoneille
- Näytöt: `tabular-nums` kaikissa lukemissa; fonttiskaala 10/12/14/16/20/24/28/34 px
- Teema: automaattinen vaalea/tumma `prefers-color-scheme`:n mukaan + manuaalinen ☀/☾-ohitus
- Saavutettavuus: `prefers-reduced-motion` -tuki, aria-labelit ikoninapeissa
- Virhetilat: selkokieliset GPS-virheet + offline-banneri (navigator.onLine)
- POI-varoitukset: herkkyystilat + confidence + regressiotesti + re-arm
- Pyörätila: Velocity Stage auto-aktivointi + pyöräkohtainen trendi/stage-skaala (0–60) + mini-kartan pyöräzoom/väritys
- Pyörä/kävely: nopeusrajoituskortti piiloon + tiekohtainen rajoitushaku pois + nopeuskamerahälytykset estettynä
- Karttatasot: pyörätilassa oletuksena Maastokartta (CyclOSM-pohjainen pyöräilykartta poistettu)
- Firebase: selainkonfiguraatio alustetaan deterministisesti ilman myöhäistä `.env`-hakua
- Regressiotestit: debug-loki ajaa POI- ja GPS-nopeustestit; POI-testi käyttää eristettyä GPS-tarkkuutta ja testit palauttavat globaalin tilan
- Pyörätilan auto-vaihto maastokarttaan on transition-only (ei ylikirjoita käsin valittua tasoa)
- Nopeusmittari: fallback-liikenopeus + drop-guard + A/B/C-luottamusindikaattori + cruise-stability (50–90 km/h)
- Historiakartta: reittikatselussa POI-layer piilotetaan selkeyden vuoksi ja palautetaan poistuttaessa katselusta
- Nopeusrajoitus: OSM/Overpass + tie-ehdokkaan pisteytys (etäisyys/suunta/tieluokka) + vakautus + ylityshälytys Clean Digitaliin
- Ohjekielet: FI/EN (vietnam poistettu v6.53)

---

## 🔧 **TÄRKEÄT TOIMINTAPERIAATTEET**

### **Tietoturva:**
1. **API-avaimet** eivät saa olla julkisesti näkyvissä
2. **.env-tiedosto** on `.gitignore`-listassa
3. **Firebase API-avain** ladataan turvallisesti

### **Mobiilioptimointi:**
1. **100dvh** käytetään korkeuden sijaan
2. **GPU-kiihdytys** animaatioissa
3. **Akkuystävälliset** graafit (30fps)

### **Versionhallinta:**
1. **APP_VERSION** globals.js:ssä
2. **Versiohistoria** help.js:ssä (FI/EN)
3. **Service Worker** päivitetään jokaisella versiolla (CACHE_NAME + sw.js?v=APP_VERSION)
4. **PROJECT_STATUS.md** päivitetään jokaisen merkittävän muutoksen yhteydessä

---

## 📝 **TEHTYÄ TYÖTÄ (HISTORIA)**

### **v6.56 - Talvinopeusrajoitukset**
- ✅ Väyläviraston WFS-aineisto (avoinapi.vaylapilvi.fi, CORS-avoin, ilmainen) tiekohtaiseen talvirajoitukseen
- ✅ OSM maxspeed:winter / maxspeed:conditional -parsinta + moottoritie 120->100-varmistus
- ✅ Asetus Auto (15.10-15.4) / Talvi / Kesä; rajoituskortti näyttää "Talvirajoitus"-lähteen
- ✅ PWA-versionosto tehty v6.56

### **v6.55 - Ammattimainen viimeistely**
- ✅ Emoji-ikonit korvattu 36-symbolisella SVG-spritellä (valikko, navit, napit, otsikot, modaalit)
- ✅ `tabular-nums` kaikkiin numeronäyttöihin + fonttiskaala yhtenäistetty
- ✅ `prefers-reduced-motion`-tuki + aria-labelit ikoninapeille
- ✅ Offline-banneri + selkokieliset GPS-virheet
- ✅ Splash: latausindikaattori + pehmeä haalistus
- ✅ `manifest.json` viilattu (description, lang, categories)
- ✅ PWA-versionosto tehty v6.55

### **v6.54 - Ohjesivun korjaus**
- ✅ Karkurbacktick help.js:n changelog-tekstissä kaatoi tiedoston evaluoinnin -> tyhjä ohjenäkymä
- ✅ Korjattu FI+EN-osioista; `window.renderHelp` eksplisiittiseksi ui.js:ssä
- ✅ PWA-versionosto tehty v6.54

### **v6.53 - Teemasiivous + automaattinen teema + S24 Ultra**
- ✅ Poistettu Time Circuit, Pulse HUD, LCARS (`style-lcars.css`) ja neulamittari
- ✅ Automaattinen vaalea/tumma teema + manuaalinen ohitus
- ✅ Ylinopeushälytys Clean Digitaliin; nappivärit ja stats-grid yhtenäistetty
- ✅ S24 Ultra -optimointi (480px breakpoint, isommat lukemat)
- ✅ Vietnam poistettu ohjekielistä; POI-dev-työkalut details-osion taakse
- ✅ PWA-versionosto tehty v6.53

### **v6.52 - WakeLock-parannukset ja näytön pitämisen asetus**
- ✅ Lisätty asetus "Pidä näyttö päällä ajon aikana" (oletuksena päällä)
- ✅ WakeLock haetaan uudelleen 30 sekunnin välein, jos se on kadonnut
- ✅ WakeLockin release-tapahtuma nollaa muuttujan uudelleenhakua varten
- ✅ Dokumentoitu iPadOS split-view -rajoitus: vain aktiivinen sovellus pitää näytön päällä
- ✅ PWA-versionosto tehty v6.52

### **v6.51 - Yhdistetyn reitin pysyvä yhteenveto kartalla**
- ✅ Yhdistetyn reitin tietolaatikko (ajojen määrä, km, aika) näkyy nyt pysyvästi kartan oikeassa alakulmassa
- ✅ Laatikko suljetaan ruksista, ja se katoaa automaattisesti kun valitaan yksittäinen reitti tai palautetaan GPS-seuranta
- ✅ PWA-versionosto tehty v6.51

### **v6.50 - Päiväkohtainen ajanjako ja yhdistetty reitti**
- ✅ Pitkät ajot jaetaan automaattisesti päiväkohtaisiksi tallennusvaiheessa, kun ajo ylittää vuorokauden
- ✅ Reittipisteisiin lisätty aikaleima (`ts`) päiväjaon mahdollistamiseksi
- ✅ Historianäkymään lisätty ajojen monivalinta
- ✅ Usean valitun ajon reitit voidaan piirtää kartalle yhtenä yhdistettynä reitinä
- ✅ Valittujen ajojen yhteinen kilometrimäärä ja aika näytetään käyttäjälle
- ✅ PWA-versionosto tehty v6.50

### **v6.49 - LCARS-kokonäkymä**
- ✅ Lisätty täysin uusi LCARS-teema koko mittaristolle (Star Trek TNG -tyylinen hallintopaneeli)
- ✅ LCARS toimii valinnaisena kokonaisnäkymänä: oletusmittaristo säilyy ennallaan
- ✅ Uusi asetus: Dashboard-tyyli (Oletus / LCARS)
- ✅ LCARS näyttää nopeuden, matkan, ajan, korkeuden, keskinopeuden ja rajoituksen
- ✅ Tyylit eristetty omaan `style-lcars.css` -tiedostoon
- ✅ PWA-versionosto tehty v6.49

### **v6.48 - Time Circuit -näkymä**
- ✅ Lisätty Back to the Future -tyylinen Time Circuit -nopeusmittari: kolme vaakasuuntaista LED-riviä
- ✅ Punainen, vihreä ja keltainen rivi näyttävät nopeuden, matkan, ajan, keskinopeuden, korkeuden ja rajoituksen
- ✅ Time Circuit on lisäasetuksena: aiemmat mittarit säilyvät ennallaan
- ✅ PWA-versionosto tehty v6.48

### **v6.47 - Velocity Stage teema + Clean Digital -näkymä**
- ✅ Velocity Stage käyttää nyt HUD-teemamuuttujia eikä kovakoodattuja värejä
- ✅ Velocity Stage toimii päivä-teemassa (light-theme): vaaleampi tausta ja parempi kontrasti
- ✅ Uusi Clean Digital -näkymä: minimalistinen pyöreä progress bar + suuri numero
- ✅ Clean Digital integroitu nopeusmittarin tyyli-valitsimeen

### **v6.46 - Ensimmäisen GPS-näytteen ja POI-regressiotestin korjaus**
- ✅ Korjattu `null`-alkutilan virheellinen muuntuminen nollaksi nopeussuodatuksessa
- ✅ Ensimmäinen validi GPS-nopeusnäyte tulee nyt mittariin heti
- ✅ POI-regressiotesti käyttää tunnettua tarkkuutta eikä riipu sisätilan GPS-signaalista
- ✅ PWA-versionosto tehty
- ✅ POI-nopeuskameran suunta-suodatus korjattu: harva GPS-segmentti, joka ylittää kameran, ei enää jätä varoitusta näyttämättä

### **v6.44 - Julkaisuputki + Firebase-alustus + GPS-regressiotestit**
- ✅ Yhtenäistetty PWA:n HTML-, CSS-, script-, APP_VERSION- ja Service Worker -versiot
- ✅ Poistettu Firebase-konfiguraation myöhäinen `.env`-haku ja sen aiheuttama alustus-race
- ✅ Lisätty GPS-nopeuden regressiotestit nykyiseen debug-testirunneriin
- ✅ Regressiotestit palauttavat globaalin GPS-tilan ajon jälkeen

### **v6.43 - Pyöräilykartta poistettu, maastokartta pyörätilan oletukseksi**
- ✅ Erillinen pyöräilykarttataso poistettu käytöstä luotettavuusongelmien vuoksi
- ✅ Pyörätilan ison kartan oletustasoksi asetettu Maastokartta
- ✅ Dashboardin mini-kartan pyörätilan oletustasoksi asetettu Maastokartta
- ✅ Isokartan tasovalitsin sisältää nyt vain Peruskartta/Satelliitti/Maastokartta
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.42 - Karttatason valinnan pysyvyys + pyöräilykartan fallback**
- ✅ Pyörätilan auto-vaihto pyöräilykarttaan muutettu transition-only -logiikkaan
- ✅ Käsin valittu Satelliitti/Maastokartta/Peruskartta ei enää palaudu pakolla pyörätilassa
- ✅ Pyöräilykartalle lisätty automaattinen varalähde, jos ensisijainen CyclOSM URL epäonnistuu
- ✅ Sama fallback lisätty myös dashboardin mini-kartan pyöräilytasoon
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.41 - Karttatasovalitsimen käytettävyyskorjaus**
- ✅ Isokartan tasovalitsin siirretty oikeasta yläkulmasta vasempaan yläkulmaan
- ✅ Tasovalitsimen klikkausvarmuutta parannettu (z-index + marginaalit)
- ✅ Satelliitti/Maastokartta/Peruskartta/Pyöräilykartta -vaihto toimii ilman GPS-napin päällekkäisyyttä
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.40 - Pyöräilykartan tiililatauksen korjaus**
- ✅ Vaihdettu CyclOSM tile-URL luotettavampaan endpointiin
- ✅ Sama korjaus tehty sekä pääkartan että mini-kartan pyöräilytasoon
- ✅ Auto-vaihto pyörätilaan säilyy ennallaan
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.39 - Pyöräilykarttataso + automaattinen kartanvaihto pyörätilassa**
- ✅ Lisätty pääkarttaan Pyöräilykartta (CyclOSM)
- ✅ Ajoneuvon vaihdossa pyörätilaan kartta vaihtuu automaattisesti pyöräilykarttaan
- ✅ Poistuttaessa pyörätilasta pääkartta palautuu aiemmin käytettyyn ei-pyörä-tasoon
- ✅ Dashboardin mini-kartan pohjakartta vaihtuu automaattisesti pyörä-/normaalitilan mukaan
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.38 - Pyörätila: Velocity Stage + mini-kartta + dashboard-siivous**
- ✅ Pyörän valinta aktivoi automaattisesti Velocity Stage -näkymän
- ✅ Velocity Stage/trendin skaalaus pyöräajoon (0–60 km/h)
- ✅ Mini-kartta pyörätilassa: lähempi zoom + pyörä-värinen marker/reitti
- ✅ Nopeusrajoituskortti piilotetaan pyörä-/kävelytilassa
- ✅ Tiekohtainen nopeusrajoitushaku ohitetaan pyörä-/kävelytilassa
- ✅ Nopeuskamerahälytykset pidetään estettyinä pyörätilassa
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.37 - Nopeuden luottamusindikaattori + cruise-stability mode**
- ✅ Lisätty mittaristoon A/B/C-luottamusindikaattori (GPS/DER/EST)
- ✅ Lisätty cruise-stability smoothing 50–90 km/h tasaiselle ajolle
- ✅ Lisätty vakionopeusalueen drop-guard äkillisiä virheputouksia vastaan
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.36 - Nopeustrendin skaala + GPS-nopeuden luotettavuusparannus**
- ✅ Speed-trendin kiinteä asteikko muutettu 0–140 km/h
- ✅ GPS-nopeudelle lisätty fallback, jos laitenopeus puuttuu/epäonnistuu
- ✅ Lisätty drop-guard äkillisiä epärealistisia nopeusputouksia vastaan
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.35 - Historiakartan POI-näkymän siivous**
- ✅ Historiasta avatussa reittikatselussa POI-pisteet piilotetaan automaattisesti
- ✅ POI-layer palautetaan automaattisesti, kun poistutaan historiakatselusta
- ✅ GPS ON/OFF -karttatoggle noudattaa samaa näkyvyyslogiikkaa
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.34 - Dashboard mini-karttaan live-ajoviiva**
- ✅ Lisätty mini-karttaan sama ajon aikainen live-viiva kuin isossa kartassa
- ✅ Mini-kartan viiva nollataan uuden ajon alussa
- ✅ Mini-kartan viiva palautetaan ajon jatkossa ja crash-palautuksessa tallennetusta reitistä
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.33 - Dashboardin mini-kartan/stats-ruutujen pikavaihtonappi**
- ✅ Lisätty dashboardiin nopea vaihtonappi sään vasemmalle puolelle
- ✅ Yhdellä napilla voi vaihtaa mini-kartan ja stats-ruutujen välillä ilman Asetukset-sivua
- ✅ Napin aktiivinen tila synkronoituu asetustogglen kanssa ja tallentuu localStorageen
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.32 - Dashboard mini-kartan tile-render-korjaus mobiili-PWA:ssa**
- ✅ Korjattu bugi, jossa mini-kartan karttalaatat saattoivat näkyä vain pienenä neliönä vasemmassa yläkulmassa
- ✅ Lisätty toistettu mini-kartan invalidateSize-ajastus näkymänvaihdoissa
- ✅ Lisätty resize/orientation/pageshow/visibilitychange-koukut mobiili-PWA-käyttöä varten
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.31 - Dashboard mini-kartan mobiilikorkeuden korjaus**
- ✅ Korjattu bugi, jossa mini-kartta saattoi puhelimessa litistyä ohuen viivan kokoiseksi
- ✅ Karttaikkunalle lisätty vakaat flex-säännöt (display:flex + flex-shrink:0)
- ✅ Mini-kartalle lisätty min-height + flex-basis -säännöt mobiilille
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.30 - Velocity Stage trendikäyrät (5 min)**
- ✅ Taustalle lisätty nopeuskäyrä viimeiseltä ~5 minuutin jaksolta
- ✅ Lisätty myös korkeuskäyrä kevyempänä taustaviivana
- ✅ Käyrät renderöidään nopeuslukeman taakse (ei numeron päälle)
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.29 - Dashboard mini-kartta (valinnainen)**
- ✅ Asetuksiin lisätty toggle: "Kartta stats-ruutujen tilalle"
- ✅ Dashboardiin lisätty mini-karttaikkuna 2x3 stat-ruudukon vaihtoehdoksi
- ✅ Valinnan persistointi localStorageen + dashboard-view resize-käsittely
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.28 - Velocity Stage + HUD-väriteemat**
- ✅ Lisätty kaksi HUD-väriteemaa (Cyber Blue / Sunset Gold)
- ✅ Lisätty täysin uusi Velocity Stage -nopeusnäkymä
- ✅ Asetuksiin lisätty uusi mittarityyppi "Velocity Stage"
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.27 - Pulse HUD nopeusnäkymä**
- ✅ Neulanenmittarin tilalle uusi näyttävä Pulse HUD -näkymä
- ✅ Reaktiivinen kaari + speed state -indikointi (READY/CRUISE/FAST/HYPER)
- ✅ Asetuksissa mittarityypin nimi päivitetty "Pulse HUD"
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.26 - Nopeusrajoituksen osumatarkkuus + POI-toast paikka**
- ✅ OSM-tievalintaan lisätty geometriapohjainen scoring (segmenttietäisyys + heading + tieluokka)
- ✅ Rinnakkaisten/hitaiden teiden väärävalintaa vähennetty nopeissa nopeuksissa
- ✅ POI persistent-toast siirretty ylemmäs, ettei peitä päänopeuslukemaa
- ✅ PWA versionosto tehty (APP_VERSION + SW cache + query-versionumerot)

### **v6.13 - Security Fix**
- ✅ API-avain siirretty .env-tiedostoon
- ✅ .gitignore lisätty
- ✅ Turvallinen avaimen lataus

### **v6.14 - Animated Speedometer & Live Graphs**
- ✅ Animoitu neulanenmittari (Canvas)
- ✅ Nopeusmittarin tyylin valinta (digi/neula/molemmat)
- ✅ Reaaliaikaiset graafit (nopeus/korkeus/G-voima)
- ✅ Värilliset varoitukset (vihreä/keltainen/punainen)
- ✅ Tärinäefekti ylinopeuksilla
- ✅ Mini G-voiman mittari
- ✅ visuals.js-moduuli luotu
- ✅ Integroitu GPS-päivityksiin

### **v6.16 - POI Alerts Countdown + Drive Markers**
- ✅ Pysyvät paikkamerkinnät (POI) Firebase Realtime Databaseen
- ✅ POI:t näkyvät aina kartassa
- ✅ Lähestymisvaroitus, joka näyttää <strong>vähenevän etäisyyden metreinä</strong>
- ✅ Nopeuskamera-POI:lle suuntasuodatus (heading → vähentää väärän suunnan hälyjä)
- ✅ Paras osuma -valinta (lähin + suuntaan sopiva), jotta varoitus ei pompi
- ✅ Ajon aikainen "📌 MERKKAA"-nappi → tallentaa markerit ajotietueeseen
- ✅ Markerit näkyvät historiakartan reittinäkymässä

### **v6.17 - POI massatuonti + POI-modaali + karttamuokkaus**
- ✅ Nopeuskamerien massatuonti CSV/SVC-tiedostoista (lon,lat → lat,lng automaattisesti)
- ✅ Tuonnissa tiedostonimi lisätään POI:n nimeen (hakua varten): `FIFI40 - ...`
- ✅ Tuonnissa deduplikointi/upsert (uudelleentuonti ei tuplaa; pienet koordinaattimuutokset päivitetään)
- ✅ POI-lista skaalautuvaksi: haku + tyypin suodatus + "Näytä lisää" + "Lähimmät" (GPS)
- ✅ POI-muokkaus mobiiliystävällisellä modaalilla (kaikki kentät kerralla)
- ✅ Kartalta POI:n muokkaus/poisto suoraan popupista
- ✅ Koordinaattien syöttö yhdellä kentällä: geokätköilymuoto tai CSV-tyyli
- ✅ Nopeuskamerat pois käytöstä kävely- ja pyörätilassa (ei hälytyksiä, ei kartalla)
- ✅ POI-hälytykseen äänimerkki (POI-kohtainen `beepEnabled`)

---

## 🎯 **JATKO-KEHITYSTEHTÄVÄT**

### **Välittömät:**
1. **Testaa** nopeuskamera-POI hälytyksen luotettavuus eri laitteilla (heading/nopeus)
2. **Optimoi** massatuonnin suorituskyky tarvittaessa (suuret määrät)
3. **Testaa** PWA-päivitys mobiilissa (Service Worker)

### **Tulevaisuudessa:**
1. **Dynaaminen tausta** (reittiviiva, sääanimaatiot)
2. **Äänikomennot** (hands-free)
3. **Ryhmäajot** (monen käyttäjän)
4. **Waze-integraatio** (liikennetiedot)
5. **Kalenteri-integraatio**

---

## 🚨 **KRIITTISIÄ SÄÄNTÖJÄ**

### **ÄLÄ KOSKAAN:**
1. **Lisää API-avaimia** suoraan koodiin
2. **Poista .env-tiedostoa** .gitignore-listalta
3. **Unohda päivittää** versioita
4. **Tee muutoksia** ilman varmuuskopiota

### **AINAKIN:**
1. **Päivitä APP_VERSION** globals.js:ssä
2. **Lisää versiohistoria** help.js:ään (FI/EN)
3. **Päivitä sw.js** Service Worker
4. **Päivitä PROJECT_STATUS.md** ("viimeisin muutos" + nykytila)
5. **Testaa** mobiilissa
6. **Tee varmuuskopio** ennen julkaisua

---

## 📦 **FIREBASE DATAMALLI (UUSI v6.16)**

### **POI (Paikkamerkinnät):**
Polku: `poi/<uid>/<poiId>`

Kentät (suositus):
- `name` (string)
- `type` (string) esim. `speedcamera`, `danger`, `customer`, `reminder`, `other`
- `lat` (number)
- `lng` (number)
- `alertEnabled` (boolean)
- `alertRadiusM` (number)
- `cooldownSec` (number)
- `beepEnabled` (boolean)
- `createdAt` (number)
- `updatedAt` (number)

### **Ajon markerit (per ajo):**
Tallennetaan ajotietueeseen `ajopaivakirja/<uid>/<driveId>/markers`.

Marker-objekti:
- `lat` (number)
- `lng` (number)
- `ts` (number, ms)
- `type` (string, esim. `mark`)
- `label` (string, valinnainen)

---

## 🧠 **POI-VAROITUSLOGIIKKA (UUSI v6.16)**

### **Periaate:**
- Varoitus näytetään, kun käyttäjä on POI:n säteen sisällä.
- Näytetään kerrallaan vain <strong>yksi aktiivinen varoitus</strong> (`activePoiAlert`), joka päivittyy.
- Kun aktiivinen POI ei enää kelpaa (poistutaan säteeltä / suunta ei täsmää), etsitään uusi "paras".

### **Nopeuskamera ja suunta:**
- Jos `heading` on saatavilla, lasketaan bearing käyttäjältä POI:hin ja verrataan kulmaeroa.
- Jos kulmaero on suuri, hälytys ohitetaan (vähentää vastakkaisen suunnan kameroiden hälyjä).


---

## 🔄 **TYÖNKULKU PÄIVITYKSISSÄ**

Tämä paketti tehdään **aina kun APP_VERSION nousee** - ei vain "julkaisuissa":

1. **Tee muutokset** koodiin
2. **Päivitä versio** (globals.js `APP_VERSION` + index.html `?v=`-tunnisteet, title, splash)
3. **Päivitä help.js** (versiohistoria FI+EN + section-titlen versiolista)
4. **Päivitä sw.js** (uusi cache-versio / CACHE_NAME)
5. **Päivitä PROJECT_STATUS.md** (mitä muuttui, miksi, mihin tiedostoihin)
6. **Testaa** toiminnallisuus
7. **Aja varmuuskopioi.bat**
8. **Aja vie_githubiin.bat**
9. **Testaa PWA-päivitys** mobiilissa

### **Säännöllinen ylläpito (AI-ohjeiden päivitys):**
- Päivitä `AI_RULES.md` vähintään silloin, kun:
  - tulee uusi pääversio tai merkittävä ominaisuusmuutos
  - arkkitehtuuria tai työnkulkua muutetaan
  - huomataan, että ohjeistus ei enää vastaa koodia
- Pidä `PROJECT_STATUS.md` aina ensisijaisena "tilanne nyt" -dokumenttina.

---

## 📱 **PWA-SPEFIFISET HUOMIOT**

### **Service Worker (sw.js):**
- **Cache-versio** päivitettävä jokaisella pääversiolla
- **Offline-toiminta** säilytettävä
- **Pakotettu päivitys** uusille versioille
 - Rekisteröinti tehdään muodossa `sw.js?v=APP_VERSION` ja kutsutaan `registration.update()`

### **Manifest (manifest.json):**
- **Versiota** ei tarvitse päivittää jatkuvasti
- **Ikonit** pysyvät samoina

### **Mobiilitestaus:**
- **Safari** (iOS)
- **Chrome** (Android)
- **PWA-asennus** testattava

---

## 🌐 **KIELITUKI (2 KIELTÄ)**

### **help.js-rakenne:**
```javascript
helpData = {
  fi: { title: "Käyttöopas", sections: [{ title: "...", content: `...html...` }] },
  en: { title: "User Guide", sections: [...] }
}
```

### **Kielikoodit:**
- **fi** - suomi (oletus)
- **en** - englanti

### **ÄLÄ KOSKAAN:**
- **Lyhennä ohjeita**
- **Tiivistä sisältöä**
- **Jätä kieliä puuttumaan** (FI/EN aina molemmat)
- **Käytä karkurbacktickeja** help.js:n HTML-templateissa - rikkovat koko tiedoston evaluoinnin (v6.54-bugi)

---

## 📊 **VERSIOHISTORIAN MUOTO**

### **help.js:**
Changelog on `sections[0]` (`title: "🚀 1. Uutta/New (...)"`) - uusi versio lisätään
`<div class="help-step">`-lohkon alkuun HTML-muodossa:

```html
<strong>✨ UUTTA vX.YY: Otsikko:</strong>
<ul>
    <li><strong>Ominaisuus:</strong> kuvaus.</li>
</ul>
```

Muista päivittää myös section-titlen versiolista `(vX.YY, ...)`. Sama merkintä
EN-osioon (`NEW in vX.YY:`). **Älä käytä backtickeja HTML-sisällössä.**

---

## 🎯 **TULEN TÄRKEIN TEHTÄVÄ:**

- Pidä käyttökokemus luotettavana mobiilissa ja autokäytössä.
- Pidä dokumentaatio synkassa koodin kanssa (`AI_RULES.md` + `PROJECT_STATUS.md`).
- Pidä PWA-päivityspolku kunnossa jokaisessa julkaistavassa muutoksessa.

**MUISTA:** Tämä on suomalainen sovellus suomalaiselle käyttäjälle - laatu ja kattavuus ovat tärkeimpiä!
