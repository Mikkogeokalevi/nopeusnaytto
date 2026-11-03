// V2 VERSIOHALLINTA — nosta aina kun V2 muuttuu (majaali.minor.patch)
const V2_VERSION = "0.18.1";

const V2_CHANGELOG = [
    {
        v: "0.18.1", date: "2026-11-02",
        items: ["Admin-paneeli korjattu: luvut erikseen, virheet nakyvat (usersIndex-saanto puuttuu -> osittainen)"]
    },
    {
        v: "0.18.0", date: "2026-11-02",
        items: ["Aurinkotila: valkoinen korkean kontrastin nakyma paivavaloon","☀️-nappi ylapalkkiin, muistetaan laitekohtaisesti"]
    },
    {
        v: "0.17.0", date: "2026-11-02",
        items: ["FeatureFlags nyt oikeasti voimassa: admin piilottaa Kartta/Historia-tabin + nav- ja tallennusnapit", "Esto nakyi UI:ssa (napit harmaana, tabit piilossa)"]
    },
    {
        v: "0.16.0", date: "2026-11-02",
        items: ["Tilastoyhteenveto Historia-valilehteen: ajoja, yhteensa km, huippu, 7 vrk"]
    },
    {
        v: "0.15.2", date: "2026-11-02",
        items: ["Kartta: Carto->OSM tilet (Carto vaatii API-avaimen)", "Tumma ilme sailyi CSS-tumennusfilterilla"]
    },
    {
        v: "0.15.1", date: "2026-11-02",
        items: ["Kartta-korjaus: flex-korkeus v2-view-map:lle (kartta ei renderoitynyt)"]
    },
    {
        v: "0.15.0", date: "2026-11-02",
        items: ["PWA-korjaukset: manifest-ikonit (192+512+maskable), id/scope", "Kaikki resurssit ?v=-versionoitu - cache ei jaada jumiin", "SW updateViaCache:none"]
    },
    {
        v: "0.14.0", date: "2026-11-02",
        items: ["Offline-reittivalimuisti: onnistunut reitti tallentuu (15 maaranpaata, 7 vrk)", "OSRM/verkkokatko -> sama maaranpaa ohjataan valimuistin reitilla"]
    },
    {
        v: "0.13.0", date: "2026-11-02",
        items: ["Nav-palkki myos mittaristoon (ohje + ETA nakyy ajonaytolle)", "Sama ohje jaetaan kartta- ja mittaristonakymiin"]
    },
    {
        v: "0.12.0", date: "2026-11-02",
        items: ["Puhepaketit V2:een (sama navSpeechPacks-polku kuin V1)", "18 avainta, import/export/liita, muokkaus ja aktivointi", "OSRM-ohjetyyppi -> puheavain kartoitus"]
    },
    {
        v: "0.11.0", date: "2026-11-02",
        items: ["Nopeusvarjatty reittiviiva kartalla (vihrea->punainen)","Segmentit piirtyvat inkrementaalisesti"]
    },
    {
        v: "0.10.0", date: "2026-11-02",
        items: ["Puheohjeet: suomenkielinen TTS navigaatio-ohjeille","Asetukset Tietoa-nakymaan: puhe päälle/pois + kuuntelunappi"]
    },
    {
        v: "0.9.0", date: "2026-11-02",
        items: ["Navigaatio: Nominatim-haku + OSRM-reititys kartalla","Ohjepaneeli: ohje + jaljella oleva matka + saapumiskello","Punainen reittiviiva erikseen ajo-reitista"]
    },
    {
        v: "0.8.0", date: "2026-11-02",
        items: ["PWA: oma service worker (cache-first staattiset, network-first HTML)","Asennettavuus puhelimelle (manifest + icons)","Offline-toiminta ilman verkkoa (PWA-cache)"]
    },
    {
        v: "0.7.0", date: "2026-11-02",
        items: ["Ajoneuvovalitsin: lukee users/{uid}/cars (V1:n autot), valinta tallentuu","Tallennettu ajo linkittyy aktiiviseen autoon (carId)"]
    },
    {
        v: "0.6.0", date: "2026-11-02",
        items: ["Nopeusrajoitus: Overpass/OSM maxspeed (15 s throttle), punainen ylitys","Historia-lista: ajopaivakirja/{uid} viimeisimmat ajot"]
    },
    {
        v: "0.5.0", date: "2026-11-02",
        items: ["Kartta: Leaflet + tumma Carto-teema, seuranta + reittiviiva","Ajon tallennus ajopaivakirja/{uid}-polkuun (sama kuin V1)","Matka/huippu/keskiarvo/reitti tallentuu"]
    },
    {
        v: "0.4.0", date: "2026-11-02",
        items: ["V2-mittaristo: live GPS-nopeus premium-naytolle (toFixed 1, GPS A/B/C-merkki)","Sessioseuranta: huippu/matka/aika/keskinopeus + suunta + korkeus","ALOITA/LOPETA-tallennus lokaalisti (historia VAIHEESSA 7)","WakeLock + paivitystiheys jaetaan GPS-watchilla"]
    },
    {
        v: "0.3.1", date: "2026-11-02",
        items: ["Versionumero ylapalkkiin V2-merkin viereen"]
    },
    {
        v: "0.3.0", date: "2026-11-02",
        items: [
            "Admin-paneeli: kayttajalista, roolin vaihto (user/tester/admin)",
            "Ominaisuusliput: 9 ominaisuutta, kaytossa-toggle + roolioikeudet",
            "Rekisteroitymisen hallinta: julkinen/hyvaksynta-kytka",
            "Tapahtumaloki (auditLog): yllapitotoiminnot kirjataan",
            "usersIndex: kayttajien indeksi admin-listaa varten"
        ]
    },
    {
        v: "0.2.0", date: "2026-11-02",
        items: [
            "SUPERADMIN-bootstrap: ensimmainen admin otetaan sovelluksesta",
            "Firebase-saantoehdotus: admins/userRoles/featureFlags/auditLog/appConfig",
            "Ylapito-tabin porttaukset (vain adminit nakevat)"
        ]
    },
    {
        v: "0.1.0", date: "2026-11-02",
        items: [
            "V2-pohja v2/-hakemistossa (V1 koskematon)",
            "Premium-login: email + Google (OAuth-popup)",
            "Design system: grafiitti/hiili + sahkoansininen korostus",
            "Oikeusmoottori (perms.js): roolit + featureFlags + audit",
            "Firebase jaettuna V1:n kanssa: users/{uid} -tiedot yhteisia",
            "Salasanan palautus + email-verifiointi"
        ]
    }
];

function v2RenderChangelog(box) {
    if (!box) return;
    box.innerHTML = '';
    V2_CHANGELOG.forEach((e) => {
        const d = document.createElement('div');
        d.className = 'v2-listrow';
        d.style.flexDirection = 'column';
        d.style.alignItems = 'flex-start';
        let h = '<div class="t">v' + e.v + ' <span class="v2-muted" style="font-weight:400;">· ' + e.date + '</span></div>';
        h += '<ul style="margin:6px 0 0 16px;font-size:12px;color:var(--v2-text-1);line-height:1.6;">';
        e.items.forEach((i) => { h += '<li>' + i + '</li>'; });
        h += '</ul>';
        d.innerHTML = h;
        box.appendChild(d);
    });
}
