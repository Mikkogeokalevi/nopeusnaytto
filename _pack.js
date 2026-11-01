const fs=require('fs');
let s=fs.readFileSync('nav.js','utf8');

// 1) steps: speechKey + exit
s=s.replace(
`                    steps.push({
                        loc: st.maneuver.location, // [lon,lat]
                        instruction: navInstructionText(st.maneuver),
                        name: st.name || '',
                        distM: st.distance || 0,
                        type: st.maneuver.type || ''
                    });`,
`                    steps.push({
                        loc: st.maneuver.location, // [lon,lat]
                        instruction: navInstructionText(st.maneuver),
                        name: st.name || '',
                        distM: st.distance || 0,
                        type: st.maneuver.type || '',
                        speechKey: navSpeechKey(st.maneuver),
                        exit: st.maneuver.exit || 0
                    });`);

// 2) speak-paikat pakettitemplaatteihin
s=s.replace(`navSpeak('Navigaatio aloitettu. Matkaa ' + formatNavDist(r.distM) + '.');`,
            `navSpeak(navT('depart', { dist: formatNavDist(r.distM) }));`);
s=s.replace(`navSpeak('Lasketaan reitti uudelleen');`,
            `navSpeak(navT('reroute', {}));`);
s=s.split(`navSpeak('Saavuit perille');`).join(`navSpeak(navT('arrived', {}));`);
s=s.replace(`        navSpeak(instr);`,
            `        navSpeak(navStepSpeech(next));`);
s=s.replace(`        navSpeak('Sadan metrin päästä ' + instr.toLowerCase());`,
            `        navSpeak(navT('announce_mid', { instr: navStepSpeech(next).toLowerCase() }));`);
s=s.replace(`        navSpeak('Kolmensadan metrin päästä ' + instr.toLowerCase());`,
            `        navSpeak(navT('announce_far', { instr: navStepSpeech(next).toLowerCase() }));`);
s=s.replace('navSpeak(`Määränpää ${formatNavDist(d)} suunnassa ${navBearingWord(brg)}`);',
            `navSpeak(navT('direct_info', { dist: formatNavDist(d), dir: navBearingWord(brg) }));`);

// 3) puhepakettimoottori loppuun
s+=`
// =========================================================
// PUHEPAKETIT v6.63 - navigaation puheohjeiden tekstipaketit
// Oletuspaketti on lukittu; omia paketteja voi luoda,
// muokata, poistaa, viedä ja tuoda tekstitiedostona.
// =========================================================

var NAV_SPEECH_DEFS = [
    ['depart', 'Navigaation alku', 'Navigaatio aloitettu. Matkaa {dist}.'],
    ['announce_far', 'Varoitus kaukaa (300 m)', 'Kolmensadan metrin päästä {instr}'],
    ['announce_mid', 'Varoitus läheltä (100 m)', 'Sadan metrin päästä {instr}'],
    ['turn_left', 'Käänny vasemmalle', 'Käänny vasemmalle'],
    ['turn_slight_left', 'Käänny loivasti vasemmalle', 'Käänny loivasti vasemmalle'],
    ['turn_sharp_left', 'Käänny jyrkästi vasemmalle', 'Käänny jyrkästi vasemmalle'],
    ['turn_right', 'Käänny oikealle', 'Käänny oikealle'],
    ['turn_slight_right', 'Käänny loivasti oikealle', 'Käänny loivasti oikealle'],
    ['turn_sharp_right', 'Käänny jyrkästi oikealle', 'Käänny jyrkästi oikealle'],
    ['uturn', 'U-käännös', 'Käänny ympäri'],
    ['continue', 'Jatka suoraan', 'Jatka suoraan'],
    ['fork', 'Pysy kaarteessa', 'Pysy kaarteessa'],
    ['on_ramp', 'Aja rampille', 'Aja rampille'],
    ['off_ramp', 'Poistu rampilta', 'Poistu rampilta'],
    ['roundabout', 'Liikenneympyrä', 'Aja liikenneympyrästä {exit}. poistuma'],
    ['arrived', 'Perillä', 'Saavuit perille'],
    ['reroute', 'Uudelleenreititys', 'Lasketaan reitti uudelleen'],
    ['direct_info', 'Suoran linjan opastus', 'Määränpää {dist} suunnassa {dir}']
];
const NAV_DEFAULT_TEXTS = {};
NAV_SPEECH_DEFS.forEach(([k, , def]) => { NAV_DEFAULT_TEXTS[k] = def; });

var navEditingPackId = null;

function navSpeechKey(maneuver) {
    const t = String(maneuver && maneuver.type || '').toLowerCase();
    const m = String(maneuver && maneuver.modifier || '').toLowerCase();
    if (t === 'arrive') return 'arrived';
    if (t === 'roundabout' || t === 'rotary') return 'roundabout';
    if (t === 'off ramp') return 'off_ramp';
    if (t === 'on ramp') return 'on_ramp';
    if (t === 'fork') return 'fork';
    if (m === 'uturn') return 'uturn';
    if (m.indexOf('left') !== -1) {
        if (m.indexOf('sharp') !== -1) return 'turn_sharp_left';
        if (m.indexOf('slight') !== -1) return 'turn_slight_left';
        return 'turn_left';
    }
    if (m.indexOf('right') !== -1) {
        if (m.indexOf('sharp') !== -1) return 'turn_sharp_right';
        if (m.indexOf('slight') !== -1) return 'turn_slight_right';
        return 'turn_right';
    }
    return 'continue';
}

function navLoadPacks() {
    try { return JSON.parse(localStorage.getItem('navSpeechPacks') || '[]'); }
    catch (e) { return []; }
}
function navSavePacks(packs) {
    localStorage.setItem('navSpeechPacks', JSON.stringify(packs));
}
function navActivePack() {
    const id = localStorage.getItem('navSpeechActive') || 'default';
    if (id === 'default') return { id: 'default', name: 'Oletusohjeet', texts: NAV_DEFAULT_TEXTS };
    const p = navLoadPacks().find((x) => x.id === id);
    return p || { id: 'default', name: 'Oletusohjeet', texts: NAV_DEFAULT_TEXTS };
}
function navActiveTexts() {
    const p = navActivePack();
    return (p.id === 'default') ? NAV_DEFAULT_TEXTS
        : Object.assign({}, NAV_DEFAULT_TEXTS, p.texts || {});
}
function navT(key, params) {
    let t = navActiveTexts()[key] || NAV_DEFAULT_TEXTS[key] || '';
    Object.keys(params || {}).forEach((k) => {
        t = t.split('{' + k + '}').join(String(params[k]));
    });
    return t;
}
function navStepSpeech(step) {
    if (!step) return '';
    const t = navT(step.speechKey, { exit: step.exit || 0 });
    return t || step.instruction || '';
}

// --- pakettien UI ---
function navRefreshPackSelect() {
    const sel = document.getElementById('nav-speech-pack-select');
    if (!sel) return;
    const active = localStorage.getItem('navSpeechActive') || 'default';
    sel.innerHTML = '';
    const d = document.createElement('option');
    d.value = 'default'; d.textContent = 'Oletusohjeet (lukittu)';
    sel.appendChild(d);
    navLoadPacks().forEach((p) => {
        const o = document.createElement('option');
        o.value = p.id; o.textContent = p.name;
        sel.appendChild(o);
    });
    sel.value = navLoadPacks().some((p) => p.id === active) ? active : 'default';
}

window.navPackEdit = function() {
    const active = navActivePack();
    if (active.id === 'default') {
        if (typeof showToast === 'function') showToast('Oletusta ei voi muokata - luo ensin oma paketti');
        return;
    }
    navEditingPackId = active.id;
    const nameEl = document.getElementById('nav-pack-name');
    const rows = document.getElementById('nav-pack-rows');
    if (!rows) return;
    if (nameEl) nameEl.value = active.name || '';
    rows.innerHTML = '';
    NAV_SPEECH_DEFS.forEach(([key, label]) => {
        const row = document.createElement('div');
        row.style.cssText = 'margin-bottom:8px;';
        row.innerHTML = '<label style="display:block;font-size:12px;opacity:0.75;margin-bottom:3px;">' + label +
            ' <code style="opacity:0.5;">' + key + '</code></label>' +
            '<input class="subject-input nav-pack-field" data-key="' + key + '" style="width:100%;" maxlength="120">';
        const inp = row.querySelector('input');
        inp.value = (active.texts && active.texts[key]) || NAV_DEFAULT_TEXTS[key] || '';
        rows.appendChild(row);
    });
    const m = document.getElementById('nav-pack-modal');
    if (m) m.style.display = 'flex';
};

window.navPackSaveEdit = function() {
    if (!navEditingPackId) return;
    const packs = navLoadPacks();
    const p = packs.find((x) => x.id === navEditingPackId);
    if (!p) return;
    const nameEl = document.getElementById('nav-pack-name');
    p.name = (nameEl && nameEl.value.trim()) || p.name;
    const texts = {};
    document.querySelectorAll('.nav-pack-field').forEach((inp) => {
        const v = inp.value.trim();
        const key = inp.dataset.key;
        if (v && v !== NAV_DEFAULT_TEXTS[key]) texts[key] = v;
    });
    p.texts = texts;
    navSavePacks(packs);
    navEditingPackId = n
