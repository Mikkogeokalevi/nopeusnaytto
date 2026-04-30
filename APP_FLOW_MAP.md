# APP_FLOW_MAP - 1-sivun sovellusvirta

Tämä tiedosto kuvaa koko sovelluksen pääflow'n yhdellä sivulla:
**login -> GPS -> dashboard -> tallennus -> history/map**.

Käytä tätä jatkokehityksen runkona. 
Käytä `PROJECT_STATUS.md` tiedostoa "tilanne nyt" -päivityksiin.

---

## 0) Lähtöpiste: käynnistys

1. `index.html` lataa moduulit versionumeroilla (`?v=...`).
2. `globals.js` alustaa Firebase-yhteydet + globaalit tilat.
3. `app.js` rekisteröi service workerin (`sw.js?v=APP_VERSION`).

---

## 1) Login-flow

1. `auth.js` kuuntelee `auth.onAuthStateChanged`.
2. Kun käyttäjä kirjautuu sisään:
   - piilotetaan login-view
   - näytetään app-container
   - ladataan data: `loadCars()`, `loadHistory()`, `loadPOIs()`
3. Jos ei kirjautunut:
   - näytetään login-view
   - app piiloon

**Ydin:** ilman `currentUser`-tilaa tallennus/lataus Firebaseen ei etene.

---

## 2) GPS-flow (reaaliaikainen)

1. `startGPS()` käynnistää `watchPosition`-seurannan.
2. `updatePosition(position)` tekee per-sijaintipiste:
   - nopeus/suunta-suodatus
   - matka-, huippu- ja keskiarvolaskenta (jos recording)
   - osoitehaku + säähaku throttlettuna
   - nopeusrajoituksen haku (`requestRoadSpeedLimit`)
   - dashboardin päivitys
   - POI-varoituscheck (`checkPoiAlerts`)

**Ydin:** `updatePosition` on koko live-ajon "sydän".

---

## 3) Dashboard-flow

1. `ui.js/updateDashboardUI(...)` päivittää:
   - päänopeus
   - huippu / matka / aika / avg / suunta / korkeus
   - kävelytila (metric-vaihdot)
2. `ui.js/updateDashboardSpeedLimit(info)` päivittää rajoituskortin:
   - exact -> "Tiekohtainen"
   - estimated -> "Yleisrajoitus-arvio"
   - unknown -> "Ei dataa"
3. Toastit:
   - normaali toast: `showToast`
   - persistent POI-toast: `showPersistentToast` (ylemmäksi nostettu)

---

## 4) POI-varoitusflow

1. `checkPoiAlerts(...)`
   - pitää aktiivisen varoituksen hengissä, jos edelleen validi
   - muuten etsii parhaan uuden osuman
2. `poiQualifies(...)`
   - säde + segmenttietäisyys + lähestymissuunta + confidence
   - sensitivity mode + re-arm lock
3. `updateActivePoiToast(...)`
   - näyttää etäisyyden metreinä
   - piilottaa varoituksen poistuttaessa / loitottaessa
   - hoitaa cooldown-värinä + äänimerkin

---

## 5) Nopeusrajoitusflow (OSM)

1. `requestRoadSpeedLimit(lat,lng,heading,speed)` hakee Overpassista lähitiet.
2. Tie-ehdokkaat pisteytetään (gps.js):
   - lähimmän segmentin etäisyys
   - heading-yhteensopivuus
   - speed -> odotettu tieluokka
   - jatkuvuusbonus samalle way-id:lle
3. Tulos:
   - exact `maxspeed` tai estimated `highway`-tyypistä
   - fallback-vakautus pitää viimeisen validin arvon hetkellisesti

---

## 6) Tallennusflow (ajo)

1. Käyttäjä aloittaa ajon -> `isRecording=true`.
2. GPS-looppi kasvattaa routea + metriikoita.
3. Lopetus avaa tallennusmodaalin.
4. `saveToFirebase` / `saveDriveSafely`:
   - online -> pilveen
   - offline -> pending queue localStorageen

---

## 7) History/Map-flow

1. `history.js` renderöi ajolistat + suodattimet + raportit.
2. Reittinäkymä:
   - `showRouteOnMap(key)`
   - piirtää reitin segmentteinä kartalle
   - näyttää ajon markerit
3. `map.js` hallitsee kartan katselutilaa (GPS ON/OFF, history overlay).

---

## 8) Julkaisun minimimuistilista

Kun muutos shipataan:
1. `globals.js`: APP_VERSION
2. `sw.js`: CACHE_NAME
3. `index.html`: script `?v=`
4. `help.js`: changelog FI/EN/VI
5. `PROJECT_STATUS.md`: "viimeisin muutos"
6. Tämä tiedosto (`APP_FLOW_MAP.md`) jos flow muuttui
