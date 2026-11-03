// V2 ADMIN-PANEELI — kayttajat, roolit, ominaisuusliput, rekisterointi, audit-loki
// Nakyi vain superadmin/admin (UI-portti; säännöt estavat myos datan).

var v2FEATURES = [
    ['speedo', 'Nopeusmittari'], ['gps', 'GPS-paikannus'], ['map', 'Kartta'],
    ['history', 'Ajohistoria'], ['stats', 'Tilastot'], ['cars', 'Ajoneuvot'],
    ['limits', 'Nopeusrajoitukset'], ['nav', 'Navigaatio'], ['poi', 'Paikkamerkinnat']
];
var v2AdminData = { usersIndex: {}, userRoles: {} };

function v2IsAdmin() { return v2Perms.isSuperAdmin || v2Perms.role === 'admin'; }

// Tabin nakyvyys adminin mukaan + featureFlags -> tabit (v0.17)
v2Perms.onChange(function() {
    const tab = document.getElementById('v2-tab-admin');
    if (tab) tab.style.display = v2IsAdmin() ? '' : 'none';
    if (v2IsAdmin()) v2LoadAdmin();
    // Ominaisuuksien kayttooikeudet -> nakyvyys
    const gates = { 'v2-view-map': 'map', 'v2-view-hist': 'history' };
    document.querySelectorAll('.v2-tab').forEach((t) => {
        const f = gates[t.dataset.view];
        if (f) t.style.display = v2Can(f) ? '' : 'none';
    });
    // Tallennusnapin kielto jos gps/speedo estetty
    const rb = document.getElementById('v2-btn-rec');
    if (rb) { rb.disabled = !(v2Can('speedo') && v2Can('gps')); rb.style.opacity = rb.disabled ? '0.4' : '1'; }
    // Navigaationappi
    const nb = document.querySelector('#v2-view-map .v2-btn-primary');
    if (nb) { nb.disabled = !v2Can('nav'); nb.style.opacity = nb.disabled ? '0.4' : '1'; }
});

// ---- KIRJAUTUJAN INDEKSI (usersIndex) ----
window.v2WriteUserIndex = function(user) {
    if (!user) return;
    window.v2db.ref('usersIndex/' + user.uid).update({
        email: user.email || '',
        name: user.displayName || '',
        lastLogin: firebase.database.ServerValue.TIMESTAMP
    }).catch(() => {});
};

function v2LoadAdmin() {
    Promise.all([
        window.v2db.ref('usersIndex').once('value'),
        window.v2db.ref('userRoles').once('value'),
        window.v2db.ref('featureFlags').once('value'),
        window.v2db.ref('appConfig/registration').once('value'),
        window.v2db.ref('auditLog').orderByChild('ts').limitToLast(15).once('value')
    ]).then(([ui, ur, ff, reg, log]) => {
        v2AdminData.usersIndex = ui.val() || {};
        v2AdminData.userRoles = ur.val() || {};
        v2RenderUsers();
        v2RenderFeatures(ff.val() || {});
        v2RenderRegSettings(reg.val() || {});
        v2RenderAudit(log.val() || {});
        v2RenderOverview();
    }).catch((e) => {
        const box = document.getElementById('v2-admin-body');
        if (box) box.innerHTML = '<div class="v2-notice">Latausvirhe: ' + e.message + ' (tarkista usersIndex-saannot)</div>';
    });
}

function v2RenderOverview() {
    const el = document.getElementById('v2-admin-overview');
    if (!el) return;
    const n = Object.keys(v2AdminData.usersIndex).length;
    const admins = Object.values(v2AdminData.userRoles).filter((r) => r === 'admin').length + (v2Perms.isSuperAdmin ? 1 : 0);
    el.innerHTML = '<div class="v2-listrow"><div class="grow"><div class="t">' + n + ' kayttajaa</div><div class="s">' + admins + ' yllapitajaa · V2 ' + ' (rooli: ' + v2Perms.role + ')</div></div></div>';
}

function v2RenderUsers() {
    const box = document.getElementById('v2-admin-users');
    if (!box) return;
    const uids = Object.keys(v2AdminData.usersIndex);
    if (!uids.length) { box.innerHTML = '<div class="v2-muted">Ei kayttajia viela</div>'; return; }
    box.innerHTML = '';
    uids.forEach((uid) => {
        const u = v2AdminData.usersIndex[uid];
        const role = v2AdminData.userRoles[uid] || 'user';
        const isSelf = uid === v2Perms.user.uid;
        const row = document.createElement('div');
        row.className = 'v2-listrow';
        row.innerHTML =
            '<div class="grow"><div class="t">' + (u.name || u.email || uid.slice(0, 8)) + (isSelf ? ' (sina)' : '') + '</div>' +
            '<div class="s">' + (u.email || '') + ' · ' + uid.slice(0, 12) + '…</div></div>' +
            '<select class="v2-input" style="width:110px;padding:8px;" ' + (isSelf && v2Perms.isSuperAdmin ? 'disabled' : '') + '>' +
            ['user', 'tester', 'admin'].map((r) => '<option ' + (r === role ? 'selected' : '') + '>' + r + '</option>').join('') +
            '</select>';
        row.querySelector('select').addEventListener('change', function() {
            window.v2db.ref('userRoles/' + uid).set(this.value).then(() => {
                v2Audit('set_role', uid, { role: this.value });
                v2AdminData.userRoles[uid] = this.value;
            });
        });
        box.appendChild(row);
    });
}

function v2RenderFeatures(flags) {
    const box = document.getElementById('v2-admin-features');
    if (!box) return;
    box.innerHTML = '';
    v2FEATURES.forEach(([key, label]) => {
        const f = flags[key] || {};
        const enabled = f.enabled !== false;
        const roles = Array.isArray(f.roles) ? f.roles : ['user', 'tester', 'admin'];
        const row = document.createElement('div');
        row.className = 'v2-listrow';
        let html = '<div class="grow"><div class="t">' + label + '</div><div class="s">' + key + '</div></div>';
        html += '<label style="font-size:12px;margin-right:8px;"><input type="checkbox" ' + (enabled ? 'checked' : '') + ' data-k="' + key + '" class="v2-feat-enabled"> Kaytossa</label>';
        html += ['user', 'tester', 'admin'].map((r) =>
            '<label style="font-size:11px;margin-left:6px;"><input type="checkbox" ' + (roles.indexOf(r) !== -1 ? 'checked' : '') + ' data-k="' + key + '" data-r="' + r + '" class="v2-feat-role"> ' + r + '</label>'
        ).join('');
        row.innerHTML = html;
        row.querySelectorAll('input').forEach((inp) => inp.addEventListener('change', () => v2SaveFeature(key, box)));
        box.appendChild(row);
    });
}

function v2SaveFeature(key, box) {
    const en = box.querySelector('.v2-feat-enabled[data-k="' + key + '"]');
    const roles = [];
    box.querySelectorAll('.v2-feat-role[data-k="' + key + '"]:checked').forEach((c) => roles.push(c.dataset.r));
    window.v2db.ref('featureFlags/' + key).set({ enabled: en.checked, roles }).then(() => {
        v2Audit('set_feature', key, { enabled: en.checked, roles });
    });
}

function v2RenderRegSettings(cfg) {
    const box = document.getElementById('v2-admin-reg');
    if (!box) return;
    const open = cfg.open !== false;
    const appr = cfg.requireApproval === true;
    box.innerHTML =
        '<div class="v2-listrow"><div class="grow"><div class="t">Julkinen rekisteroityminen</div><div class="s">Uudet kayttajat voivat luoda tilin</div></div>' +
        '<input type="checkbox" id="v2-reg-open" ' + (open ? 'checked' : '') + '></div>' +
        '<div class="v2-listrow"><div class="grow"><div class="t">Hyvaksynta vaaditaan</div><div class="s">Uudet kayttajat odottavat adminin hyvaksyntaa</div></div>' +
        '<input type="checkbox" id="v2-reg-appr" ' + (appr ? 'checked' : '') + '></div>';
    ['v2-reg-open', 'v2-reg-appr'].forEach((id) => {
        const c = document.getElementById(id);
        if (c) c.addEventListener('change', () => {
            window.v2db.ref('appConfig/registration').set({
                open: document.getElementById('v2-reg-open').checked,
                requireApproval: document.getElementById('v2-reg-appr').checked
            }).then(() => v2Audit('set_registration', 'appConfig', {}));
        });
    });
}

function v2RenderAudit(log) {
    const box = document.getElementById('v2-admin-audit');
    if (!box) return;
    const items = Object.values(log).sort((a, b) => (b.ts || 0) - (a.ts || 0)).slice(0, 15);
    if (!items.length) { box.innerHTML = '<div class="v2-muted">Ei tapahtumia</div>'; return; }
    box.innerHTML = items.map((l) =>
        '<div class="v2-listrow"><div class="grow"><div class="t">' + (l.action || '?') + ' → ' + (l.target || '') + '</div>' +
        '<div class="s">' + (l.byEmail || l.by || '') + ' · ' + (l.ts ? new Date(l.ts).toLocaleString('fi-FI') : '') + '</div></div></div>'
    ).join('');
}
