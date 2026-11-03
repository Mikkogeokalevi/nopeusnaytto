// V2 OIKEUSJARJESTELMA — roolit, ominaisuusoikeudet, admin-tarkistus
// Polut Firebase RTDB:ssa (uudet, V1-data koskematon):
//   admins/{uid}          = true           (superadmin, vain konsolilla luotu)
//   userRoles/{uid}       = 'admin'|'user'|'tester' (oletus 'user')
//   featureFlags/{key}    = {enabled, roles[], userOverrides{uid:bool}}
//   auditLog/{pushId}     = {by, action, target, ts}
//   appConfig/registration = {open, requireApproval}

var v2Perms = {
    user: null,
    role: 'user',
    isSuperAdmin: false,
    flags: {},
    _ready: false,
    _listeners: []
};

// Kaynnistaa oikeustarkkailun kun kayttaja kirjautuu
function v2InitPerms(user) {
    v2Perms.user = user;
    const uid = user.uid;

    // Superadmin-tarkistus: admins/{uid} -polku (luotu vain konsolista, ei selaimesta)
    window.v2db.ref('admins/' + uid).on('value', (snap) => {
        v2Perms.isSuperAdmin = snap.val() === true;
        if (v2Perms.isSuperAdmin) v2Perms.role = 'superadmin';
        v2Perms._emit();
    });

    // Rooli: userRoles/{uid}
    window.v2db.ref('userRoles/' + uid).on('value', (snap) => {
        v2Perms.role = snap.val() || (v2Perms.isSuperAdmin ? 'superadmin' : 'user');
        v2Perms._emit();
    });

    // Ominaisuusliput
    window.v2db.ref('featureFlags').on('value', (snap) => {
        v2Perms.flags = snap.val() || {};
        v2Perms._emit();
    });
}

v2Perms.onChange = function(fn) { v2Perms._listeners.push(fn); };
v2Perms._emit = function() {
    v2Perms._ready = true;
    v2Perms._listeners.forEach((f) => f(v2Perms));
};

// Ominaisuustarkistus: superadmin saa aina, muuten featureFlags
window.v2Can = function(featureKey) {
    if (v2Perms.isSuperAdmin) return true;
    const f = v2Perms.flags[featureKey];
    if (!f) return true; // maarittelematon ominaisuus = sallittu
    if (f.enabled === false) return false;
    const uid = v2Perms.user && v2Perms.user.uid;
    if (uid && f.userOverrides && f.userOverrides[uid] !== undefined) return !!f.userOverrides[uid];
    if (Array.isArray(f.roles) && f.roles.length) return f.roles.indexOf(v2Perms.role) !== -1;
    return true;
};

// Audit-loki yllapitotoiminnoille
window.v2Audit = function(action, target, meta) {
    if (!v2Perms.user) return;
    window.v2db.ref('auditLog').push({
        by: v2Perms.user.uid, byEmail: v2Perms.user.email || '',
        action, target: target || '', meta: meta || null,
        ts: firebase.database.ServerValue.TIMESTAMP
    }).catch(() => {});
};
