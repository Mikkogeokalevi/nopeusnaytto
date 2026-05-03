# PROJECT_STATUS - Tilannekuva (living doc)

Päivitä tämä tiedosto jokaisen merkittävän muutoksen jälkeen.
Tarkoitus: uusi työskentelysessio pääsee 2-5 minuutissa kartalle.

Jos tarvitset koko sovelluksen virran yhdellä sivulla, lue `APP_FLOW_MAP.md`.

---

## 1) Nykytila (snapshot)

- **Projekti:** Mikkokalevin Ajopäiväkirja Pro
- **Nykyversio:** `v6.43`
- **Pääpaino juuri nyt:**
  - POI-varoitusten luotettavuus ajossa
  - Tiekohtaisen nopeusrajoituksen osumatarkkuus (OSM)
  - Dashboardin luettavuus ajon aikana (Pulse HUD / Velocity Stage + 5min trenditausta + mini-kartan mobiili/PWA-korjaukset + pikavaihto + live-ajoviiva)
  - Nopeusnäytön luotettavuus (GPS-nopeuden pudotussuodatus + speed-trendin 0-140 asteikko + A/B/C-luottamusindikaattori + cruise-stability)
  - Historiakartan luettavuus pitkillä reiteillä (POI-pisteet piiloon reittikatselussa)

---

## 2) Viimeisin muutos (latest shipped)

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
  - 3-kielinen ohjesisältö + changelog
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
4. Päivitä changelog/ohjeet (`help.js`, FI/EN/VI)
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
