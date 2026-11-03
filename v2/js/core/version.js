// V2 VERSIOHALLINTA — nosta aina kun V2 muuttuu (majaali.minor.patch)
const V2_VERSION = "0.6.0";

const V2_CHANGELOG = [
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
