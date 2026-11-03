// V2 KIRJAUTUMINEN — email + Google (Google vaatii Firebase-konsolin kayttoonoton)
(function() {
    const el = (id) => document.getElementById(id);
    const errEl = () => el('v2-login-error');

    function showErr(msg) { if (errEl()) errEl().textContent = msg || ''; }
    function mapErr(e) {
        const c = (e && e.code) || '';
        const map = {
            'auth/user-not-found': 'Kayttajaa ei loydy',
            'auth/wrong-password': 'Vaara salasana',
            'auth/email-already-in-use': 'Sahkoposti on jo kaytossa',
            'auth/weak-password': 'Salasana liian heikko (min 6 merkkia)',
            'auth/invalid-email': 'Virheellinen sahkoposti',
            'auth/popup-closed-by-user': 'Kirjautuminen peruttu',
            'auth/unauthorized-domain': 'Domain ei ole sallittu Firebase-konsolissa',
            'auth/operation-not-allowed': 'Kirjautumistapa ei ole kaytossa konsolissa'
        };
        return map[c] || (e && e.message) || 'Virhe';
    }

    window.v2LoginEmail = function() {
        const email = el('v2-email').value.trim(), pass = el('v2-pass').value;
        if (!email || !pass) { showErr('Tayta sahkoposti ja salasana'); return; }
        window.v2auth.signInWithEmailAndPassword(email, pass).catch((e) => showErr(mapErr(e)));
    };

    window.v2RegisterEmail = function() {
        const email = el('v2-email').value.trim(), pass = el('v2-pass').value;
        if (!email || !pass) { showErr('Tayta sahkoposti ja salasana'); return; }
        window.v2db.ref('appConfig/registration').once('value').then((s) => {
            const cfg = s.val() || {};
            if (cfg.open === false) { showErr('Rekisteroityminen suljettu'); return; }
            return window.v2auth.createUserWithEmailAndPassword(email, pass);
        }).then(() => {
            const u = window.v2auth.currentUser;
            if (u) {
                u.sendEmailVerification().catch(() => {});
                if (typeof v2WriteUserIndex === 'function') v2WriteUserIndex(u);
            }
        }).catch((e) => showErr(mapErr(e)));
    };

    window.v2LoginGoogle = function() {
        const provider = new firebase.auth.GoogleAuthProvider();
        window.v2auth.signInWithPopup(provider).catch((e) => showErr(mapErr(e)));
    };

    window.v2ResetPassword = function() {
        const email = el('v2-email').value.trim();
        if (!email) { showErr('Kirjoita sahkoposti ensin'); return; }
        window.v2auth.sendPasswordResetEmail(email)
            .then(() => { showErr(''); el('v2-login-ok').textContent = 'Palautuslinkki lahetetty'; })
            .catch((e) => showErr(mapErr(e)));
    };

    window.v2Logout = function() { window.v2auth.signOut(); };

    // Auth-tilan seuranta: nayta login tai app
    window.v2auth.onAuthStateChanged((user) => {
        const login = el('v2-login'), app = el('v2-app');
        if (user) {
            if (login) login.style.display = 'none';
            if (app) app.classList.add('active');
            if (typeof v2InitPerms === 'function') v2InitPerms(user);
            if (typeof v2WriteUserIndex === 'function') v2WriteUserIndex(user);
            const uidEl = el('v2-uid');
            if (uidEl) uidEl.textContent = user.uid;
            const nameEl = el('v2-user-name');
            if (nameEl) nameEl.textContent = user.displayName || user.email || 'Kayttaja';
        } else {
            if (app) app.classList.remove('active');
            if (login) login.style.display = 'flex';
        }
    });
})();
