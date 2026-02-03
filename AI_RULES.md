# AI_RULES - Nopeusnäyttöprojekti

## 📋 **PROJEKTIN YLEISKUVAUS**

**Projekti:** Mikkokalevin Ajopäiväkirja Pro
**Versio:** v6.14 (Animated Speedometer & Live Graphs)
**Kehittäjä:** Mikkogeokalevi
**AI-assistentti:** Cascade

**Sovelluksen tarkoitus:**
- GPS-pohjainen nopeusnäyttö ja ajopäiväkirja
- Reaaliaikainen nopeusmittari (digi/neula/graafit)
- Ajoneuvokaluston hallinta
- Polttoainekulutusten seuranta
- Tilastot ja raportointi
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
3. **Service Worker** päivitetään jokaisella versiolla

---

## 📝 **TEHTYÄ TYÖTÄ (HISTORIA)**

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

---

## 🎯 **JATKO-KEHITYSTEHTÄVÄT**

### **Välittömät:**
1. **Päivitä help.js** - lisää v6.14 versiohistoriaan
2. **Päivitä sw.js** - uusi versio Service Workeriin
3. **Testaa** uudet visuaaliset ominaisuudet

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
4. **Testaa** mobiilissa
5. **Tee varmuuskopio** ennen julkaisua

---

## 🔄 **TYÖNKULKU PÄIVITYKSISSÄ**

1. **Tee muutokset** koodiin
2. **Päivitä versio** (globals.js)
3. **Päivitä help.js** (versiohistoria)
4. **Päivitä sw.js** (uusi cache-versio)
5. **Testaa** toiminnallisuus
6. **Aja varmuuskopioi.bat**
7. **Aja vie_githubiin.bat**
8. **Testaa PWA-päivitys** mobiilissa

---

## 📱 **PWA-SPEFIFISET HUOMIOT**

### **Service Worker (sw.js):**
- **Cache-versio** päivitettävä jokaisella pääversiolla
- **Offline-toiminta** säilytettävä
- **Pakotettu päivitys** uusille versioille

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

**HETI TÄMÄN JÄLKEEN:**
1. **Päivitä help.js** - lisää v6.14 versiohistoriaan
2. **Päivitys sw.js** - uusi cache-versio
3. **Testaa** uudet ominaisuudet

**MUISTA:** Tämä on suomalainen sovellus suomalaiselle käyttäjälle - laatu ja kattavuus ovat tärkeimpiä!
