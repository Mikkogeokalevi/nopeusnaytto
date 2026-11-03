// V2 PUHEPAKETIT — sama users/{uid}/navSpeechPacks polku kuin V1 (paketit jaettu)
(function() {
    const V2_DEFAULT_TEXTS = {
        depart: 'Navigaatio aloitettu. Matkaa {dist}.',
        announce_far: 'Kolmensadan metrin paasta {instr}',
        announce_mid: 'Sadan metrin paasta {instr}',
        turn_left: 'Kaanny vasemmalle', turn_right: 'Kaanny oikealle',
        turn_slight_left: 'Kaanny loivasti vasemmalle', turn_slight_right: 'Kaanny loivasti oikealle',
        turn_sharp_left: 'Kaanny jyrkasti vasemmalle', turn_sharp_right: 'Kaanny jyrkasti oikealle',
        uturn: 'Kaanny ympari', continue: 'Jatka suoraan', fork: 'Pida oikeaa haarautumaa',
        on_ramp: 'Aja rampille', off_ramp: 'Poistu rampilta',
        roundabout: 'Liikenneympyrassa {exit}. poistuma',
        arrived: 'Saavuit perille', reroute: 'Reittia lasketaan uudelleen',
        direct_info: 'Maaranpaa {dist} suunnassa {dir}'
    };
    const V2_KEYS = Object.keys(V2_DEFAULT_TEXTS);
    window.v2SpeechPacks = { list: [], active: 'default' };

    function loadPacks() {
        if (!v2Perms.user) return;
        window.v2db.ref('users/' + v2Perms.user.uid + '/navSpeechPacks').once('value').then((s) => {
            const v = s.val() || {};
            window.v2SpeechPacks.list = Object.values(v.packs || v).filter((p) => p && p.id);
            const saved = localStorage.getItem('v2NavSpeech');
            if (saved) window.v2SpeechPacks.active = saved;
            renderSelect();
        }).catch(() => {});
    }
    v2Perms.onChange(loadPacks);

    function activePack() {
        return window.v2SpeechPacks.list.find((p) => p.id === window.v2SpeechPacks.active);
    }
    window.v2InstrText = function(key, vars) {
        const p = activePack();
        let t = (p && p.texts && p.texts[key]) || V2_DEFAULT_TEXTS[key] || key;
        (vars || {}).forEach(([k, v]) => { t = t.replace('{' + k + '}', v); });
        return t;
    };

    // OSRM maneuver -> avain
    window.v2SpeechKey = function(step) {
        const m = step.maneuver || {};
        const t = m.type, mod = m.modifier || '';
        if (t === 'arrive') return 'arrived';
        if (t === 'depart') return 'depart';
        if (t === 'roundabout' || t === 'rotary') return 'roundabout';
        if (t === 'fork') return 'fork';
        if (t === 'merge' || t === 'on ramp' || t === 'ramp') return 'on_ramp';
        if (t === 'off ramp') return 'off_ramp';
        if (mod.indexOf('uturn') !== -1) return 'uturn';
        if (mod.indexOf('slight left') !== -1) return 'turn_slight_left';
        if (mod.indexOf('slight right') !== -1) return 'turn_slight_right';
        if (mod.indexOf('sharp left') !== -1) return 'turn_sharp_left';
        if (mod.indexOf('sharp right') !== -1) return 'turn_sharp_right';
        if (mod.indexOf('left') !== -1) return 'turn_left';
        if (mod.indexOf('right') !== -1) return 'turn_right';
        return 'continue';
    };

    function renderSelect() {
        const box = document.getElementById('v2-pack-select');
        if (!box) return;
        box.innerHTML = '<div class="s">PUHEPAKETTI</div>' +
            '<select class="v2-input" style="width:100%;margin-top:6px;" id="v2-pack-sel">' +
            '<option value="default">Oletusohjeet</option>' +
            window.v2SpeechPacks.list.map((p) => '<option value="' + p.id + '" ' + (p.id === window.v2SpeechPacks.active ? 'selected' : '') + '>' + p.name + '</option>').join('') +
            '</select>' +
            '<div style="display:flex;gap:6px;margin-top:8px;">' +
            '<button class="v2-btn v2-btn-ghost" style="width:auto;padding:8px 12px;font-size:13px;" onclick="v2PackExport()">Vie</button>' +
            '<button class="v2-btn v2-btn-ghost" style="width:auto;padding:8px 12px;font-size:13px;" onclick="v2PackImportShow()">Liita</button>' +
            '<button class="v2-btn v2-btn-ghost" style="width:auto;padding:8px 12px;font-size:13px;" onclick="v2PackEdit()">Muokkaa</button>' +
            '</div>' +
            '<textarea id="v2-pack-paste" class="v2-input" rows="8" style="display:none;width:100%;margin-top:8px;font-family:monospace;font-size:11px;" placeholder="name=Paketti\navain=teksti\n..."></textarea>' +
            '<button id="v2-pack-paste-btn" class="v2-btn v2-btn-primary" style="display:none;width:auto;padding:8px 14px;margin-top:6px;font-size:13px;" onclick="v2PackImport()">Tuo</button>';
        const sel = document.getElementById('v2-pack-sel');
        if (sel) sel.addEventListener('change', function() {
            window.v2SpeechPacks.active = this.value;
            localStorage.setItem('v2NavSpeech', this.value);
        });
    }

    window.v2PackEdit = function() {
        const p = activePack();
        if (!p) { alert('Valitse ensin paketti (Oletus ei ole muokattavissa)'); return; }
        const t = V2_KEYS.map((k) => k + '=' + (p.texts[k] || V2_DEFAULT_TEXTS[k])).join('\n');
        const ta = document.getElementById('v2-pack-paste');
        ta.style.display = 'block'; ta.value = t;
        document.getElementById('v2-pack-paste-btn').style.display = 'block';
    };

    window.v2PackExport = function() {
        const p = activePack();
        const texts = p ? p.texts : V2_DEFAULT_TEXTS;
        const name = p ? p.name : 'Oletusohjeet';
        const txt = '# Puhepaketti: ' + name + '\nname=' + name + '\n' + V2_KEYS.map((k) => k + '=' + (texts[k] || V2_DEFAULT_TEXTS[k])).join('\n');
        const a = document.createElement('a');
        a.href = 'data:text/plain;charset=utf-8,' + encodeURIComponent(txt);
        a.download = 'puhepaketti.txt';
        a.click();
    };

    window.v2PackImportShow = function() {
        const ta = document.getElementById('v2-pack-paste');
        ta.style.display = ta.style.display === 'block' ? 'none' : 'block';
        document.getElementById('v2-pack-paste-btn').style.display = ta.style.display;
    };

    window.v2PackImport = function() {
        const raw = document.getElementById('v2-pack-paste').value;
        const texts = {}; let name = 'Tuotu paketti';
        raw.split(/\r?\n/).forEach((l) => {
            l = l.trim();
            if (!l || l.charAt(0) === '#') return;
            const eq = l.indexOf('=');
            if (eq === -1) return;
            const k = l.slice(0, eq).trim(), v = l.slice(eq + 1).trim();
            if (k === 'name') { name = v; return; }
            if (V2_DEFAULT_TEXTS.hasOwnProperty(k) && v) texts[k] = v;
        });
        const p = { id: 'pack_' + Date.now(), name, texts };
        window.v2SpeechPacks.list.push(p);
        savePackToFirebase(p);
        window.v2SpeechPacks.active = p.id;
        localStorage.setItem('v2NavSpeech', p.id);
        renderSelect();
        alert('Paketti "' + name + '" tuotu (' + Object.keys(texts).length + ' tekstia)');
    };

    function savePackToFirebase(p) {
        if (!v2Perms.user) return;
        window.v2db.ref('users/' + v2Perms.user.uid + '/navSpeechPacks/packs').once('value').then((s) => {
            const arr = s.val() || [];
            arr.push(p);
            window.v2db.ref('users/' + v2Perms.user.uid + '/navSpeechPacks/packs').set(arr).catch(() => {});
        }).catch(() => {});
    }

    window.v2auth && window.v2auth.onAuthStateChanged((u) => { if (u) setTimeout(loadPacks, 700); });
})();
