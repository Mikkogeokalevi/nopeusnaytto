# PROJECT_STATUS - Tilannekuva (living doc)

Päivitä tämä tiedosto jokaisen merkittävän muutoksen jälkeen.
Tarkoitus: uusi työskentelysessio pääsee 2-5 minuutissa kartalle.

Jos tarvitset koko sovelluksen virran yhdellä sivulla, lue `APP_FLOW_MAP.md`.

---

## 1) Nykytila (snapshot)

- **Projekti:** Mikkokalevin Ajopäiväkirja Pro
- **Nykyversio:** `v6.35`
- **Pääpaino juuri nyt:**
  - POI-varoitusten luotettavuus ajossa
  - Tiekohtaisen nopeusrajoituksen osumatarkkuus (OSM)
  - Dashboardin luettavuus ajon aikana (Pulse HUD / Velocity Stage + 5min trenditausta + mini-kartan mobiili/PWA-korjaukset + pikavaihto + live-ajoviiva)
  - Historiakartan luettavuus pitkillä reiteillä (POI-pisteet piiloon reittikatselussa)

---

## 2) Viimeisin muutos (latest shipped)

### v6.35 - Historiakartan POI-näkymän siivous

**Mitä muutettiin:**
1. Kun reitti avataan historiasta kartalle, POI-layer piilotetaan automaattisesti.
2. Tämä vähentää POI-pisteiden hälyä erityisesti pitkissä reiteissä ja tekee ajoviivasta selkeämmän.
3. POI-layer palautetaan automaattisesti, kun poistutaan historiakatselusta takaisin normaaliin karttakäyttöön.
4. Kartan GPS ON/OFF -toggle noudattaa samaa näkyvyyslogiikkaa.

**Tiedostot:**
- `map.js` (history POI visibility helper + showRouteOnMap/toggle-kytkennät)
- `ui.js` (POI-layerin palautus kun poistutaan karttanäkymästä)
- `help.js` (v6.35 changelog FI/EN/VI)
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
