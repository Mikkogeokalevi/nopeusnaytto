# PROJECT_STATUS - Tilannekuva (living doc)

Päivitä tämä tiedosto jokaisen merkittävän muutoksen jälkeen.
Tarkoitus: uusi työskentelysessio pääsee 2-5 minuutissa kartalle.

Jos tarvitset koko sovelluksen virran yhdellä sivulla, lue `APP_FLOW_MAP.md`.

---

## 1) Nykytila (snapshot)

- **Projekti:** Mikkokalevin Ajopäiväkirja Pro
- **Nykyversio:** `v6.56`
- **Pääpaino juuri nyt:**
  - Ammattimainen, siisti ulkoasu ajokäyttöön: Clean Digital päänäkymänä, SVG-ikonit, yhtenäinen typografia
  - POI-varoitusten luotettavuus ajossa
  - Tiekohtaisen nopeusrajoituksen osumatarkkuus (OSM + Väyläviraston talvirajoitusaineisto)
  - Nopeusnäytön luotettavuus (GPS-nopeuden pudotussuodatus + speed-trendin 0-140 asteikko + A/B/C-luottamusindikaattori + cruise-stability)
  - Saavutettavuus: prefers-reduced-motion, aria-labelit, selkokieliset virhetilat (GPS/offline)

---

## 2) Viimeisin muutos (latest shipped)

### v6.56 - Talvinopeusrajoitukset (Väylävirasto WFS + OSM conditional)

**Mitä muutettiin:**
1. `gps.js`: talvirajoituskerros rajoituskorttiin - `isWinterLimitSeason()` (auto-ikkuna 1.11-15.4, ohitus asetuksesta), `parseWinterMaxspeedFromTags()` (OSM maxspeed:winter + maxspeed:conditional kuukausialueet), `fetchWinterLimitVayla()` hakee `tiestotiedot:talvi_ja_kesanopeusrajoitukset`-featureja bbox:lla (EPSG:4326, JSON), lähin viivageometria pistematchauksella (<50 m), välimuisti localStorageen ruudukoitettuna (0.004° solu, 7 pv TTL).
2. `applyWinterSpeedLimitOverlay()` -prioriteetti: OSM winter-tag → Väylä WFS → moottoritie 120→100-arvio. Overlay lasketaan snapshotissa, joten asetuksen vaihto ja myöhässä palaava WFS-haku päivittävät näytön ilman uutta OSM-hakua.
3. `ui.js` `updateDashboardSpeedLimit`: lähteeksi "Talvirajoitus" / "Talvirajoitus (arvio)" kun overlay aktiivinen.
4. Asetukset → Talvinopeusrajoitukset: Auto / Talvi päällä / Kesä päällä (localStorage `winterSpeedLimitMode`).
5. `i-snowflake`-ikoni spriteen; talvirajoitus ei koske bike/walking-tiloja.
6. PWA- ja julkaisuversiot nostettiin v6.56:een.

**Tiedostot:**
- `gps.js` (talvirajoituslogiikka + WFS-haku + välimuisti)
- `ui.js` (rajoituskortin talviteksti + asetuksen kytkentä)
- `index.html` (asetusosio + snowflake-symbole)
- `help.js` (v6.56 changelog FI/EN)
- `globals.js`, `sw.js` (versioputki)

**Huomio:** `tiestotiedot:talvi_ja_kesanopeusrajoitukset` WFS-kerros sisältää vain osuudet joissa rajoitus todella laskee talveksi (`talven_ja_pimean_nopeusrajoitus`-kenttä). Digiroad-nimiavaruuden kerrokset ovat vanhentuneita (ylläpito siirtyi Fintrafficille 2026) - käytetään Tierekisteri/Velho-pohjaista tiestotiedot-nimiavaruutta.

---

### v6.55 - Ammattimainen viimeistely: SVG-ikonit, numerostabiilius, saavutettavuus

**Mitä muutettiin:**
1. Kaikki emoji-ikonit korvattu 36-symbolisella SVG-spritellä (`index.html`): valikko, alanavigaatio, yläpalkin napit, modaalit, toimintonapit, otsikot, kompassinuoli.
2. `window.uiIcon(id)`-apuri `ui.js`:ssä dynaamisille ikoneille; `window.setGpsToggleState(btn, on)` GPS-painikkeen tilanhallintaan (korvasi innerText-muutokset).
3. `font-variant-numeric: tabular-nums` kaikkiin numeronäyttöihin (nopeus, kello, koordinaatit, stat-arvot) - luvut eivät enää hyppi leveyden mukaan.
4. Fonttikoot normalisoitu skaalaan 10/12/14/16/20/24/28/34 px (CSS + inline-tyylit).
5. `@media (prefers-reduced-motion: reduce)` -lohko: animaatiot/siirtymät pois, Velocity Stagen efektit piiloon.
6. Offline-banneri (`#offline-banner`) näkyy kun `navigator.onLine` on false; kuuntelijat `app.js`:ssä.
7. GPS-virheet selkokielelle `handleError()`-funktiossa (permission denied / no signal / timeout).
8. Splash: latausspinneri + 450ms haalistus auth-ratkaisun jälkeen (`auth.js`).
9. `manifest.json`: description, lang=fi, dir, categories, yhtenäinen theme/background-väri.
10. aria-labelit ikoninapeille; side-tap-zone sai role/tabindex/title.
11. PWA- ja julkaisuversiot nostettiin v6.55:een.

**Tiedostot:**
- `index.html` (SVG-sprite + ikonikorvaukset + aria-labelit + offline-banneri + splash-spinneri)
- `style.css` (ikonityylit, tabular-nums, offline-banneri, splash-fade, reduced-motion, fonttinormalisointi)
- `ui.js` (uiIcon/setGpsToggleState-apurit + dynaamisten nappien ikonit)
- `app.js` (teemaikoni SVG:ksi + online/offline-kuuntelijat)
- `gps.js` (status-tekstien emojit pois + handleError-uudistus)
- `map.js` (GPS-toggle helperin kautta)
- `garage.js` (autolistan nappi-ikonit SVG:ksi)
- `history.js` (graafiotsikon ikoni)
- `auth.js` (splash-haalistus)
- `manifest.json`
- `globals.js`, `sw.js`, `help.js` (versio + changelog)

---

### v6.54 - Ohjesivun tyhjä näkymä korjattu

**Mitä muutettiin:**
1. Korjattu `help.js`:n changelog-teksteissä ollut karkurbacktick (`.env` tekstin seassa), joka kaatoi koko tiedoston evaluoinnin - `renderHelp` ei rekisteröitynyt ja ohjenäkymä jäi tyhjäksi. Sama vika FI- ja EN-osioissa.
2. `ui.js`:n ohjenapin kutsu eksplisiittiseksi `window.renderHelp('fi')`.
3. PWA- ja julkaisuversiot nostettiin v6.54:ään.

**Tiedostot:**
- `help.js`
- `ui.js`
- `globals.js`, `sw.js`, `index.html` (versioputki)

---

### v6.53 - Teemojen siivous, automaattinen teema, S24 Ultra -optimointi

**Mitä muutettiin:**
1. Poistettu kokonaan: Time Circuit, Pulse HUD, LCARS -teema (`style-lcars.css` poistettu) ja neulamittari. Jäljelle: Digitaalinen, Velocity Stage, Clean Digital, Digitaalinen + graafit.
2. Automaattinen tumma/vaalea teema `prefers-color-scheme`:n mukaan; ☀/☾-nappi manuaaliseksi ohitukseksi (tallentuu localStorageen).
3. Rajoituksen ylitys -hälytys Clean Digitaliin (rengas + numero punaisena) ja digitaaliseen näkymään.
4. Nappivärit yhtenäistetty `.secondary-btn`-luokkaan; stats-grid 3 sarakkeeseen >380px näytöillä.
5. S24 Ultra -optimointi: breakpoint 420px -> 480px, Clean Digital rengas/lukema suuremmaksi.
6. Vietnaminkielinen ohje poistettu; ohjekielet FI/EN.
7. POI-kehittäjätyökalut "Kehittäjätyökalut" `<details>`-osion taakse.
8. Kuollut CSS (route-background, weather-animation, pulse-jäänteet) poistettu.
9. PWA- ja julkaisuversiot nostettiin v6.53:aan.

**Tiedostot:**
- `index.html`, `style.css`, `visuals.js`, `ui.js`, `app.js`, `help.js`, `globals.js`, `sw.js`
- `style-lcars.css` (poistettu)

---

### v6.52 - WakeLock-parannukset ja näytön pitämisen asetus

**Mitä muutettiin:**
1. Lisätty asetus "Pidä näyttö päällä ajon aikana" (oletuksena päällä).
2. WakeLock haetaan nyt uudelleen 30 sekunnin välein, jos se on kadonnut.
3. WakeLockin release-tapahtuma nollaa muuttujan, jotta uudelleenhaku toimii.
4. Dokumentoitu iPadOS:n split-view-rajoitus: vain aktiivinen sovellus voi pitää näytön päällä.
5. PWA- ja julkaisuversiot nostettiin v6.52:een.

**Tiedostot:**
- `gps.js`
- `ui.js`
- `index.html`
- `globals.js`
- `sw.js`
- `help.js`

---

### v6.51 - Yhdistetyn reitin pysyvä yhteenveto kartalla

**Mitä muutettiin:**
1. Yhdistetyn reitin tiedot (ajojen määrä, kilometrit ja aika) näkyvät nyt pysyvässä laatikossa kartan oikeassa alakulmassa.
2. Laatikossa on ruksi, jolla käyttäjä voi sulkea yhteenvedon itse.
3. Yhteenveto katoaa automaattisesti, kun valitaan yksittäinen reitti tai palautetaan GPS-seuranta.
4. PWA- ja julkaisuversiot nostettiin v6.51:een.

**Tiedostot:**
- `index.html`
- `style.css`
- `map.js`
- `globals.js`
- `sw.js`
- `help.js`

---

### v6.50 - Päiväkohtainen ajanjako ja yhdistetty reitti

**Mitä muutettiin:**
1. Pitkät ajot jaetaan automaattisesti päiväkohtaisiksi tallennusvaiheessa, kun ajo ylittää vuorokauden.
2. Reittipisteisiin lisätty aikaleima (`ts`) päiväjaon mahdollistamiseksi.
3. Historianäkymään lisätty monivalinta: ajojen rastitus ja "Näytä valitut kartalla" -painike.
4. Usean valitun ajon reitit piirretään kartalle yhtenä yhdistettynä reitinä.
5. Valittujen ajojen yhteinen kilometrimäärä ja aika näytetään toast-viestissä ja monivalintapalkissa.
6. PWA- ja julkaisuversiot nostettiin v6.50:een.

**Tiedostot:**
- `gps.js`
- `history.js`
- `map.js`
- `index.html`
- `globals.js`
- `sw.js`
- `help.js`

---

### v6.49 - LCARS-kokonäkymä

**Mitä muutettiin:**
1. Lisätty täysin uusi LCARS-teema koko mittaristolle (Star Trek TNG -tyylinen hallintopaneeli).
2. LCARS ei muuta eikä poista oletusmittaristoa, vaan on valinnaisesti valittavissa oleva kokonaisnäkymä.
3. Uusi asetus: Asetukset → Dashboard-tyyli → Oletus / LCARS.
4. LCARS näyttää nopeuden, matkan, ajan, korkeuden, keskinopeuden ja rajoituksen värillisissä korteissa.
5. Tyylit on eristetty omaan `style-lcars.css` -tiedostoon, jotta olemassa olevat tyylit säilyvät koskemattomina.
6. PWA- ja julkaisuversiot nostettiin v6.49:ään.

**Tiedostot:**
- `index.html`
- `style-lcars.css` (uusi)
- `style.css`
- `visuals.js`
- `ui.js`
- `globals.js`
- `sw.js`
- `help.js`

---

### v6.48 - Time Circuit -näkymä

**Mitä muutettiin:**
1. Lisätty uusi Back to the Future -tyylinen Time Circuit -nopeusmittari: kolme vaakasuuntaista LED-riviä (punainen, vihreä, keltainen).
2. Time Circuit näyttää nopeuden, matkan, ajan, keskinopeuden, korkeuden, huippunopeuden ja rajoituksen.
3. Time Circuit on lisävaihtoehto: aiemmat mittarit (Digital, Pulse HUD, Velocity Stage, Clean Digital) säilyvät ennallaan.
4. PWA- ja julkaisuversiot nostettiin v6.48:een.

**Tiedostot:**
- `index.html`
- `style.css`
- `visuals.js`
- `ui.js`
- `globals.js`
- `sw.js`
- `help.js`

---

### v6.47 - Velocity Stage teema + Clean Digital -näkymä

**Mitä muutettiin:**
1. Velocity Stage käyttää nyt HUD-teemamuuttujia (`--hud-primary`, `--hud-secondary` jne.) eikä kovakoodattuja värejä.
2. Velocity Stage toimii nyt myös päivä-teemassa (light-theme): vaaleampi tausta ja parempi kontrasti teksteille.
3. Uusi Clean Digital -näkymä: minimalistinen pyöreä progress bar + suuri numero, toimii sekä päivällä että yöllä.
4. Clean Digital integroitu nopeusmittarin tyyli-valitsimeen (Asetukset-näkymä).

**Tiedostot:**
- `style.css`
- `visuals.js`
- `index.html`
- `help.js`

---

### v6.46 - Ensimmäisen GPS-näytteen ja POI-regressiotestin korjaus

**Mitä muutettiin:**
1. Korjattiin tapaus, jossa `null`-alkutila muuttui `Number(null)`-muunnoksella nollaksi ja ensimmäinen validi nopeusnäyte puolittui.
2. POI-regressiotesti käyttää nyt omaa tunnettua GPS-tarkkuutta ja palauttaa alkuperäisen tilan testin jälkeen.
3. Julkaisu- ja PWA-versiot nostettiin versioon 6.46.
4. Korjattiin POI-nopeuskameran suunta-suodatus, jotta harvat GPS-pisteet eivät ohita kameraa silloin, kun GPS-segmentti ylittää kameran.

**Tiedostot:**
- `gps.js`
- `globals.js`
- `index.html`
- `sw.js`
- `help.js`

---

### v6.44 - Julkaisuputken yhtenäistäminen + Firebase-alustus + GPS-regressiotestit

**Mitä muutettiin:**
1. HTML:n, CSS:n, scriptien, `APP_VERSION`-arvon ja Service Worker -cachen julkaisunumero yhtenäistettiin versioon 6.44.
2. Firebase-konfiguraation myöhäinen `.env`-haku poistettiin, jotta Firebase alustuu deterministisesti ennen `auth.js`- ja muiden moduulien käyttöä.
3. Debug-lokin regressiotestinappi ajaa nyt sekä POI- että GPS-nopeustestit.
4. GPS-testit tarkistavat tasaisen nopeuden konvergoitumisen, heikon signaalin nopeuspudotuksen, ensimmäisen näytteen, johdetun nopeuden ja luottamusluokat. Testit palauttavat globaalin GPS-tilan ennalleen.

**Tiedostot:**
- `globals.js`
- `index.html`
- `sw.js`
- `gps.js`
- `ui.js`
- `help.js`

---

### v6.43 - Pyöräilykartta poistettu, maastokartta pyörätilan oletukseksi

**Mitä muutettiin:**
1. Erillinen `Pyöräilykartta` poistettiin käytöstä, koska se ei toiminut luotettavasti kaikilla laitteilla.
2. Pyörätilassa ison kartan oletuspohjakartta on nyt `Maastokartta`.
3. Dashboardin mini-kartta käyttää pyörätilassa myös `Maastokartta`-tasoa.
4. Isokartan valittavat tasot ovat nyt: `Peruskartta`, `Satelliitti`, `Maastokartta`.

**Tiedostot:**
- `map.js` (cycling-layer poisto + terrain default bike mode)
- `help.js` (v6.43 changelog FI/EN/VI)
- `globals.js`, `sw.js`, `index.html` (PWA version plumbing)

---

### v6.42 - Karttatason valinnan pysyvyys + pyöräilykartan fallback

**Mitä muutettiin:**
1. Pyörätilan auto-vaihto pyöräilykarttaan tehdään nyt vain ajoneuvotyypin vaihtumisen hetkellä, joten käyttäjän käsin valitsema Satelliitti/Maastokartta/Peruskartta ei enää palaudu pakolla.
2. Pyöräilykarttaan lisättiin automaattinen varalähde: jos ensisijainen CyclOSM-tilepalvelu ei lataa, kartta vaihtaa toiseen URL-lähteeseen.
3. Sama fallback-logiikka otettiin käyttöön myös dashboardin mini-kartan pyöräilytasolle.

**Tiedostot:**
- `map.js` (transition-only bike auto-switch + cycling tile fallback)
- `help.js` (v6.42 changelog FI/EN/VI)
- `globals.js`, `sw.js`, `index.html` (PWA version plumbing)

---

### v6.41 - Karttatasovalitsimen käytettävyyskorjaus

**Mitä muutettiin:**
1. Isokartan tasovalitsin siirrettiin vasempaan yläkulmaan, jotta se ei ole GPS ON/OFF -napin alla.
2. Leafletin tasovalitsimelle lisättiin varmempi klikattavuus (z-index + marginaalit), jolloin Satelliitti/Maastokartta/Peruskartta/Pyöräilykartta-vaihto toimii luotettavasti.
3. Karttatasojen vaihtologiikka säilyi ennallaan, mutta UI-konflikti poistui.

**Tiedostot:**
- `map.js` (layer control position -> `topleft`)
- `style.css` (leaflet layer control z-index + spacing)
- `help.js` (v6.41 changelog FI/EN/VI)
- `globals.js`, `sw.js`, `index.html` (PWA version plumbing)

---

### v6.40 - Pyöräilykartan tiililatauksen korjaus

**Mitä muutettiin:**
1. Pyöräilykartan tile-URL vaihdettiin luotettavampaan CyclOSM-endpointiin, joka toimii paremmin eri laitteilla.
2. Sama URL-korjaus tehtiin sekä pääkartan että dashboardin mini-kartan pyöräilytasoon.
3. Auto-vaihto pyörätilaan säilyy ennallaan, mutta karttataso ei enää jää tyhjäksi epäonnistuneen tile-endpointin vuoksi.

**Tiedostot:**
- `map.js` (CyclOSM URL fix: main map + mini map)
- `help.js` (v6.40 changelog FI/EN/VI)
- `globals.js`, `sw.js`, `index.html` (PWA version plumbing)

---

### v6.39 - Pyöräilykarttataso + automaattinen kartanvaihto pyörätilassa

**Mitä muutettiin:**
1. Pääkarttaan lisättiin uusi `Pyöräilykartta` (CyclOSM), joka näyttää pyörätiet/polut selkeämmin.
2. Ajoneuvoksi `pyörä` valittaessa kartta vaihtuu automaattisesti pyöräilykarttaan.
3. Kun poistutaan pyörätilasta, pääkartta palautuu aiemmin käytettyyn ei-pyörä-tasoon (peruskartta/satelliitti/maastokartta).
4. Dashboardin mini-kartta vaihtaa myös pohjakartan automaattisesti pyörä-/normaalitilan mukaan.

**Tiedostot:**
- `map.js` (CyclOSM layer + auto-switch logic + mini-map base switching)
- `garage.js` (ajoneuvon vaihdossa `updateMapLayerForVehicleType`)
- `help.js` (v6.39 changelog FI/EN/VI)
- `globals.js`, `sw.js`, `index.html` (PWA version plumbing)

---

### v6.38 - Pyörätila: Velocity Stage + mini-kartta + dashboard-siivous

**Mitä muutettiin:**
1. Pyörätilaan lisättiin Velocity Stage -skaalaus (stage 0–60 km/h, trendi 0–60 km/h), jotta nopeusviiva on pyöräajoon suhteutettu.
2. Dashboardin mini-kartta käyttää pyörätilassa lähempää zoomia sekä pyöräystävällisiä marker/trail-värejä.
3. Nopeusrajoituskortti piilotetaan pyörä-/kävelytilassa, eikä tiekohtaista rajoitushakua tehdä turhaan.
4. Nopeuskamerahälytykset pysyvät estettynä pyörätilassa (sekä karttanäkymässä että alert-qualifierissa).
5. Pyörävalinta pakottaa mittarityyliksi Velocity Stage (`cinema`) nopeamman käyttöönoton varmistamiseksi.

**Tiedostot:**
- `visuals.js` (pyörätilan stage/trend-skaala + status-tekstit)
- `map.js` (mini-kartan pyöräzoom + pyörä-väritys)
- `gps.js` (pyörätilan smoothing/drop-guard + nopeusrajoitushaun ohitus pyörä/kävely)
- `ui.js` (nopeusrajoituskortin piilotus pyörä/kävely)
- `garage.js` (pyörävalinta -> Velocity Stage auto-aktivointi)
- `help.js` (v6.38 changelog FI/EN/VI)
- `globals.js`, `sw.js`, `index.html` (PWA version plumbing)

---

### v6.37 - Nopeuden luottamusindikaattori + cruise-stability mode

**Mitä muutettiin:**
1. Dashboardin nopeusnäkymään lisättiin A/B/C-luottamusindikaattori (GPS/DER/EST), joka kertoo näytteen luotettavuuden.
2. Lisättiin cruise-stability mode 50–90 km/h alueelle vähentämään tasaisessa ajossa näkyvää jitteriä.
3. Vakionopeusalueelle lisättiin tarkempi drop-guard, joka torjuu virheellisiä äkkipudotuksia.
4. Muutos näkyy suoraan nopeusluvussa ja speed-trendissä vakaampana käyttäytymisenä.

**Tiedostot:**
- `index.html` (speed confidence badge mittariston viereen)
- `style.css` (A/B/C confidence badge -tyylit)
- `ui.js` (confidence badge updater)
- `gps.js` (cruise-stability smoothing + confidence grade -laskenta)
- `help.js` (v6.37 changelog FI/EN/VI)
- `globals.js`, `sw.js`, `index.html` (PWA version plumbing)

---

## 3) Mistä mikäkin löytyy (nopea kartta)

- `app.js`
  - käynnistys-glue + service worker rekisteröinti (`sw.js?v=APP_VERSION`)
- `globals.js`
  - Firebase init + globaalit tilamuuttujat + `APP_VERSION`
- `ui.js`
  - näkymänvaihto (`switchView`), dashboardin renderöinti, toastit, asetusten eventit
- `gps.js`
  - GPS-looppi (`updatePosition`), tallennuslogiikka, POI-varoitukset, nopeusrajoitushaku
- `map.js`
  - Leaflet-kartta, POI-layerit, historiaruutin reittinäyttö
- `history.js`
  - historia, raportointi, offline-jonotus/synkkaus
- `garage.js`
  - ajoneuvojen hallinta + valinnan vaikutus näkymiin
- `auth.js`
  - kirjautuminen, käyttäjätilan vaihdot, datan ensilataus
- `help.js`
  - FI/EN-ohjesisältö + changelog
- `sw.js`
  - offline-cache + päivitysstrategia

---

## 4) Kriittiset feature-flowt

### A) GPS -> Dashboard
1. `startGPS()` käynnistää watchPositionin.
2. `updatePosition()` suodattaa nopeuden/suunnan.
3. Dashboard päivittyy (`updateDashboardUI`, `updateDashboardSpeedLimit`).

### B) GPS -> POI-varoitus
1. `checkPoiAlerts()` valitsee aktiivisen osuman.
2. `poiQualifies()` käyttää säde/suunta/confidence/rearm-logiikkaa.
3. `updateActivePoiToast()` näyttää etäisyyden ja hallitsee poistumisen.

### C) GPS -> Nopeusrajoitus
1. `requestRoadSpeedLimit()` kysyy OSM Overpassin lähitiet.
2. Ehdokas pisteytetään geometrialla + headingillä + tieluokalla.
3. `updateDashboardSpeedLimit()` näyttää exact/estimated/unknown.

---

## 5) Julkaisumuistilista (pakollinen)

Jokaisessa shipattavassa muutoksessa:

1. Päivitä `APP_VERSION` (`globals.js`)
2. Päivitä `CACHE_NAME` (`sw.js`)
3. Päivitä script queryt `?v=...` (`index.html`)
4. Päivitä changelog/ohjeet (`help.js`, FI/EN)
5. Päivitä tämä tiedosto (`PROJECT_STATUS.md`)
6. Testaa mobiilissa (vähintään yksi PWA-asennus)

---

## 6) Huomioitavat riskit

- OSM-datan laatu vaihtelee alueittain (`maxspeed` voi puuttua tai olla vanha).
- Heading voi olla epävakaa hitaissa nopeuksissa.
- Rinnakkaiset tiet ja eritasot voivat silti joskus osua väärin; tarkkaile kenttätesteissä.

---

## 7) Päivitysrytmi (dokumentaatio)

Päivitä `PROJECT_STATUS.md` aina kun:
- tulee uusi pääversio
- käyttäjä huomauttaa käytösvirheestä ja se korjataan
- arkkitehtuuriin tulee uusi tärkeä osa (esim. uusi moduuli/feature-flow)

Päivitä `AI_RULES.md` vähintään 1) pääversiopäivityksissä ja 2) kun työnkulku muuttuu.
