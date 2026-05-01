# AI_RULES - Nopeusnäyttöprojekti

## 📋 **PROJEKTIN YLEISKUVAUS**

**Projekti:** Mikkokalevin Ajopäiväkirja Pro
**Versio:** v6.31 (Dashboard mini-kartan mobiilikorjaus)
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
- Reaaliaikainen nopeusmittari (digi/neula/graafit)
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
- **Canvas API** - neulanenmittari

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
├── help.js             # KATTAVAT OHJEET (3 kieltä)
├── fuel.js             # Tankkaustiedot
├── .env                # API-avaimet (EI GITHUBIIN)
├── .gitignore          # Git-säännöt
├── varmuuskopioi.bat   # Varmuuskopiointiskripti
└── vie_githubiin.bat   # GitHub-vientiskripti
```

### **Nykyinen tilanne (v6.31):**
- POI-varoitukset: herkkyystilat + confidence + regressiotesti + re-arm
- Dashboard: Pulse HUD + Velocity Stage + taustan 5min trendikäyrät + mini-kartan mobiilikorjaus
- Nopeusrajoitus: OSM/Overpass + tie-ehdokkaan pisteytys (etäisyys/suunta/tieluokka) + vakautus
- POI-toast: nostettu ylemmäs ettei peitä nopeuslukemaa

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
2. **Versiohistoria** help.js:ssä (3 kielellä)
3. **Service Worker** päivitetään jokaisella versiolla (CACHE_NAME + sw.js?v=APP_VERSION)
4. **PROJECT_STATUS.md** päivitetään jokaisen merkittävän muutoksen yhteydessä

---

## 📝 **TEHTYÄ TYÖTÄ (HISTORIA)**

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
2. **Lisää versiohistoria** help.js:ään (3 kielellä)
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

1. **Tee muutokset** koodiin
2. **Päivitä versio** (globals.js)
3. **Päivitä help.js** (versiohistoria)
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

## 🌐 **KIELITUKI (3 KIELTÄ)**

### **help.js-rakenne:**
```javascript
{
  title: { fi: "...", en: "...", vn: "..." },
  content: { fi: "...", en: "...", vn: "..." }
}
```

### **Kielikoodit:**
- **fi** - suomi
- **en** - englanti  
- **vn** - vietnam

### **ÄLÄ KOSKAAN:**
- **Lyhennä ohjeita**
- **Tiivistä sisältöä**
- **Jätä kieliä puuttumaan**

---

## 📊 **VERSIOHISTORIAN MUOTO**

### **help.js:**
```javascript
const VERSION_HISTORY = [
  {
    version: "6.14",
    date: "2026-02-03",
    title: {
      fi: "Animoitu nopeusmittari & Live-graafit",
      en: "Animated Speedometer & Live Graphs", 
      vn: "Đồng hồ tốc độ động & Đồ thị trực tiếp"
    },
    features: [
      { fi: "Neulanenmittari Canvas-pohjaisena", en: "Needle speedometer with Canvas", vn: "Đồng hồ tốc độ kim loại dựa trên Canvas" },
      // ... lisää ominaisuudet kaikilla kielillä
    ]
  }
  // ... vanhemmat versiot
];
```

---

## 🎯 **TULEN TÄRKEIN TEHTÄVÄ:**

- Pidä käyttökokemus luotettavana mobiilissa ja autokäytössä.
- Pidä dokumentaatio synkassa koodin kanssa (`AI_RULES.md` + `PROJECT_STATUS.md`).
- Pidä PWA-päivityspolku kunnossa jokaisessa julkaistavassa muutoksessa.

**MUISTA:** Tämä on suomalainen sovellus suomalaiselle käyttäjälle - laatu ja kattavuus ovat tärkeimpiä!
