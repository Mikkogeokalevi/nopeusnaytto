# Mikkokalevin Ajopäiväkirja V2

Rinnakkaisversio — V1 (`/index.html`) toimii muuttumattomana.

## Osoite
`https://mikkogeokalevi.github.io/nopeusnaytto/v2/index.html`

## Rakenne
- `index.html` — login + sovellusrunko (välilehdet)
- `css/app.css` — design system (grafiitti + sähkönsininen)
- `js/core/firebase.js` — Firebase-init (sama projekti kuin V1 → jaetut tiedot `users/{uid}`)
- `js/core/perms.js` — roolien + ominaisuuksien oikeusmoottori
- `js/core/auth.js` — email + Google -kirjautuminen
- `assets/` — logo (kopio V1:stä, muuttamaton)

## Firebase-polut (uudet)
- `admins/{uid}` — superadmin (vain konsolilla!)
- `userRoles/{uid}` — admin/user/tester
- `featureFlags/{key}` — {enabled, roles[], userOverrides}
- `auditLog/` — ylläpitotoimintojen loki
- `appConfig/registration` — {open, requireApproval}

## SUPERADMIN-bootstrap
1. Kirjaudu V2:een → kopioi UID profiilista
2. Firebase Console → Realtime Database → luo `admins/{uid}` = `true`
3. Sovellus näyttää ylläpito-näkymän automaattisesti

## Vaiheet
- [x] VAIHE 2: pohja + login + perms-runko
- [ ] VAIHE 3–4: mittaristo + näkymät uuteen UI:hun
- [ ] VAIHE 5: rekisteröinnin hallinta + roolit UI:ssa
- [ ] VAIHE 6: admin-paneeli
- [ ] VAIHE 7: GPS/mittaristo/historia/kartta yhdistettynä

## V1:hen ei kosketa
Kaikki V2-tiedostot ovat `v2/`-hakemistossa. Jaettu data: `users/{uid}/cars|history` (V1:n kanssa sama, ei migraatiota).
