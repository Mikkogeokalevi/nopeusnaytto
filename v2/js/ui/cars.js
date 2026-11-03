// V2 AJONEUVOT — lukee users/{uid}/cars (jaettu V1:n kanssa), valinta -> aktiivinen auto
(function() {
    const el = (id) => document.getElementById(id);
    window.v2ActiveCar = null;

    window.v2LoadCars = function() {
        if (!v2Perms.user) return;
        window.v2db.ref('users/' + v2Perms.user.uid + '/cars').once('value').then((snap) => {
            const sel = el('v2-car-select');
            if (!sel) return;
            const cars = snap.val() || {};
            const ids = Object.keys(cars);
            sel.innerHTML = '<option value="">Ei ajoneuvoa</option>' +
                ids.map((id) => {
                    const c = cars[id];
                    const label = (c.icon || '🚗') + ' ' + (c.name || 'Auto') + (c.plate ? ' [' + c.plate + ']' : '');
                    return '<option value="' + id + '">' + label + '</option>';
                }).join('');
            const saved = localStorage.getItem('v2ActiveCar');
            if (saved && cars[saved]) sel.value = saved;
            v2SetCar();
        }).catch(() => {});
    };

    window.v2SetCar = function() {
        const sel = el('v2-car-select');
        if (!sel) return;
        window.v2ActiveCar = sel.value || null;
        localStorage.setItem('v2ActiveCar', window.v2ActiveCar || '');
    };

    window.v2auth && window.v2auth.onAuthStateChanged((u) => { if (u) setTimeout(v2LoadCars, 500); });
})();
