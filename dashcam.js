// =========================================================
// DASHCAM (v7.10) - rengaspuskuri + GPS-leima + IndexedDB
// Kokonaisuus on feature-flagin 'dashcamEnabled' takana.
// =========================================================
(function() {
    'use strict';

    // ---------- Feature flag + asetukset ----------
    const FLAG = 'dashcamEnabled';
    const SET_KEY = 'dashcamSettings';

    window.isDashcamEnabled = function() {
        return localStorage.getItem(FLAG) === '1';
    };

    function getSettings() {
        const def = { clips: 5, clipSec: 60, res: '720p', audio: false };
        try {
            const s = JSON.parse(localStorage.getItem(SET_KEY) || '{}');
            return Object.assign(def, s);
        } catch (e) { return def; }
    }
    function saveSettings(s) { try { localStorage.setItem(SET_KEY, JSON.stringify(s)); } catch (e) {} }

    // ---------- Tila ----------
    const dc = {
        running: false,
        stream: null,
        video: null,
        canvas: null,
        ctx: null,
        drawRaf: null,
        recorder: null,
        chunks: [],
        ring: [],           // {id, ts, blob, durMs}
        clipIdx: 0,
        stopped: false
    };

    // ---------- IndexedDB ----------
    const DB_NAME = 'dashcam-db';
    const STORE = 'dashcam-kept';
    const RING_STORE = 'dashcam-ring';

    function idbOpen() {
        return new Promise((res, rej) => {
            const r = indexedDB.open(DB_NAME, 2);
            r.onupgradeneeded = () => {
                const db = r.result;
                if (!db.objectStoreNames.contains(STORE)) db.createObjectStore(STORE, { keyPath: 'id' });
                if (!db.objectStoreNames.contains(RING_STORE)) db.createObjectStore(RING_STORE, { keyPath: 'id' });
            };
            r.onsuccess = () => res(r.result);
            r.onerror = () => rej(r.error);
        });
    }
    async function idbPutIn(store, item) {
        const db = await idbOpen();
        return new Promise((res, rej) => {
            const tx = db.transaction(store, 'readwrite');
            tx.objectStore(store).put(item);
            tx.oncomplete = () => res();
            tx.onerror = () => rej(tx.error);
        });
    }
    async function idbAllIn(store) {
        const db = await idbOpen();
        return new Promise((res, rej) => {
            const tx = db.transaction(store, 'readonly');
            const r = tx.objectStore(store).getAll();
            r.onsuccess = () => res(r.result || []);
            r.onerror = () => rej(r.error);
        });
    }
    async function idbDelIn(store, id) {
        const db = await idbOpen();
        return new Promise((res, rej) => {
            const tx = db.transaction(store, 'readwrite');
            const r = tx.objectStore(store).delete(id);
            r.onsuccess = () => res();
            r.onerror = () => rej(r.error);
        });
    }
    const idbPut = (item) => idbPutIn(STORE, item);
    const idbAll = () => idbAllIn(STORE);
    const idbDel = (id) => idbDelIn(STORE, id);

    // ---------- Valinnat ----------
    function pickMime(audio) {
        const opts = audio
            ? ['video/mp4;codecs=avc1.42E01E,mp4a.40.2', 'video/mp4', 'video/webm;codecs=vp9,opus', 'video/webm']
            : ['video/mp4;codecs=avc1.42E01E', 'video/mp4', 'video/webm;codecs=vp9', 'video/webm'];
        for (const m of opts) {
            if (window.MediaRecorder && MediaRecorder.isTypeSupported(m)) return m;
        }
        return '';
    }
    function extForMime(m) { return m && m.indexOf('mp4') >= 0 ? 'mp4' : 'webm'; }

    // ---------- Canvas-overlay ----------
    function overlayText() {
        const spd = (document.getElementById('prem-speed')?.textContent
                  || document.getElementById('dash-speed')?.textContent
                  || '0.00').trim();
        const now = new Date();
        const pad = (n) => (n < 10 ? '0' : '' + n);
        const t = pad(now.getDate()) + '.' + pad(now.getMonth() + 1) + '.' + now.getFullYear()
                + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
        let loc = '';
        if (typeof lastLatLng !== 'undefined' && lastLatLng) {
            const la = Math.abs(lastLatLng.lat), lo = Math.abs(lastLatLng.lng);
            loc = ' ' + (lastLatLng.lat >= 0 ? 'N' : 'S') + ' ' + la.toFixed(5)
                + ' ' + (lastLatLng.lng >= 0 ? 'E' : 'W') + ' ' + lo.toFixed(5);
        }
        return { spd, line: t + loc };
    }

    function drawLoop() {
        if (!dc.video || !dc.ctx) return;
        const w = dc.canvas.width, h = dc.canvas.height;
        try {
            if (dc.video.readyState >= 2) {
                dc.ctx.drawImage(dc.video, 0, 0, w, h);
            } else {
                dc.ctx.fillStyle = '#000';
                dc.ctx.fillRect(0, 0, w, h);
            }
            const o = overlayText();
            const barH = Math.round(h * 0.09);
            dc.ctx.fillStyle = 'rgba(0,0,0,0.55)';
            dc.ctx.fillRect(0, h - barH, w, barH);
            dc.ctx.fillStyle = '#fff';
            dc.ctx.font = 'bold ' + Math.round(barH * 0.52) + 'px monospace';
            dc.ctx.textBaseline = 'middle';
            dc.ctx.fillText(o.spd + ' km/h', 14, h - barH / 2);
            dc.ctx.font = Math.round(barH * 0.40) + 'px monospace';
            dc.ctx.fillStyle = 'rgba(255,255,255,0.85)';
            dc.ctx.textAlign = 'right';
            dc.ctx.fillText(o.line, w - 14, h - barH / 2);
            dc.ctx.textAlign = 'left';
        } catch (e) {}
        dc.drawRaf = requestAnimationFrame(drawLoop);
    }

    // ---------- Clip-loop ----------
    async function startClip() {
        const s = getSettings();
        if (dc.stopped || !dc.stream) return;
        dc.chunks = [];
        const mime = pickMime(s.audio);
        try {
            dc.recorder = new MediaRecorder(dc.recStream, {
                mimeType: mime || undefined,
                videoBitsPerSecond: s.res === '1080p' ? 5000000 : 2500000
            });
        } catch (e) {
            try { dc.recorder = new MediaRecorder(dc.recStream); } catch (e2) { stopAll(); return; }
        }
        dc.recorder.ondataavailable = (ev) => { if (ev.data && ev.data.size) dc.chunks.push(ev.data); };
        dc.recorder.onstop = () => {
            const blob = new Blob(dc.chunks, { type: dc.recorder.mimeType || 'video/webm' });
            if (blob.size > 1000) {
                const clip = { id: 'r' + Date.now() + '_' + dc.clipIdx, ts: Date.now(), blob, durMs: s.clipSec * 1000 };
                dc.ring.push(clip);
                dc.clipIdx++;
                // Renkaan sailytys IndexedDB:ssa - klippi selviaa reloadin (v7.15)
                idbPutIn(RING_STORE, { id: clip.id, ts: clip.ts, durationMs: clip.durMs, mime: blob.type, blob }).catch(() => {});
                while (dc.ring.length > s.clips) {
                    const ev = dc.ring.shift();
                    idbDelIn(RING_STORE, ev.id).catch(() => {});
                }
            }
            // Suojaus odotti klipin paattymista (v7.11)
            if (dc._protectAfterStop) {
                const reason = dc._protectAfterStop;
                dc._protectAfterStop = null;
                saveRingItems(reason);
            }
            if (!dc.stopped) startClip();
        };
        try { dc.recorder.start(); } catch (e) { return; }
        dc._clipTimer = setTimeout(() => { try { dc.recorder.stop(); } catch (e) {} }, s.clipSec * 1000);
        // REC-nappiin klipin etenemisaika (v7.12)
        dc._clipStartTs = Date.now();
        if (dc._recTimer) clearInterval(dc._recTimer);
        dc._recTimer = setInterval(() => {
            const t = document.getElementById('btn-dashcam-toggle');
            if (t && dc.running) {
                const el = Math.min(Math.floor((Date.now() - dc._clipStartTs) / 1000), s.clipSec);
                t.innerHTML = '🔴 ' + el + 's/' + s.clipSec + 's';
            }
        }, 500);
    }

    // ---------- Start / Stop ----------
    async function dashcamStart() {
        if (dc.running) return true;
        if (!window.isDashcamEnabled()) { toast('Dashcam ei ole kaytossa - ota kayttoon asetuksissa'); return false; }
        const s = getSettings();
        try {
            const size = s.res === '1080p' ? { width: 1920, height: 1080 } : { width: 1280, height: 720 };
            dc.stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment', width: size.width, height: size.height },
                audio: !!s.audio
            });
        } catch (e) {
            toast('Kameraa ei saada kayttoon - tarkista lupa');
            return false;
        }
        dc.video = document.createElement('video');
        dc.video.muted = true;
        dc.video.playsInline = true;
        dc.video.srcObject = dc.stream;
        try { await dc.video.play(); } catch (e) {}

        dc.canvas = document.createElement('canvas');
        dc.canvas.width = s.res === '1080p' ? 1920 : 1280;
        dc.canvas.height = s.res === '1080p' ? 1080 : 720;
        dc.ctx = dc.canvas.getContext('2d');
        dc.recStream = dc.canvas.captureStream(30);
        if (s.audio) {
            try {
                const audioTracks = dc.stream.getAudioTracks();
                if (audioTracks.length) dc.recStream.addTrack(audioTracks[0]);
            } catch (e) {}
        }
        dc.stopped = false;
        dc.running = true;
        drawLoop();
        startClip();
        updateRecUI(true);
        toast('Dashcam: tallennus kaynnissa');
        return true;
    }

    function stopAll() {
        dc.stopped = true;
        if (dc._clipTimer) { clearTimeout(dc._clipTimer); dc._clipTimer = null; }
        if (dc._recTimer) { clearInterval(dc._recTimer); dc._recTimer = null; }
        if (dc.drawRaf) { cancelAnimationFrame(dc.drawRaf); dc.drawRaf = null; }
        // Menossa oleva klippi tulee pysayttaa ENNEN kameran sulkemista (v7.14)
        // jotta sen loppuosa ehtii renkaaseen (onstop-handleri puskee sen)
        const killStream = () => { if (dc.stream) { dc.stream.getTracks().forEach(t => t.stop()); dc.stream = null; } };
        if (dc.recorder && dc.recorder.state !== 'inactive') {
            try { dc.recorder.stop(); } catch (e) { killStream(); }
            setTimeout(killStream, 400); // anna onstop-tapahtuman puskea klippi renkaaseen
        } else {
            killStream();
        }
        dc.video = null;
        dc.recorder = null;
        dc.running = false;
    }

    window.dashcamStop = function() {
        stopAll();
        updateRecUI(false);
        toast('Dashcam: tallennus pysaytetty');
    };
    window.dashcamStart = dashcamStart;
    window.dashcamIsRunning = function() { return dc.running; };

    // ---------- Suojaus ----------
    async function saveRingItems(reason) {
        if (!dc.ring.length) { toast('Ei klippeja viela'); return; }
        const items = dc.ring.slice(-2); // viimeisin + sita edeltava
        let n = 0;
        for (const clip of items) {
            try {
                await idbPut({
                    id: clip.id,
                    ts: clip.ts,
                    durationMs: clip.durMs,
                    sizeBytes: clip.blob.size,
                    reason: reason || 'manual',
                    mime: clip.blob.type,
                    blob: clip.blob
                });
                n++;
            } catch (e) {}
        }
        toast(n ? 'Klippi' + (n > 1 ? 't' : '') + ' suojattu' + (reason === 'gspike' ? ' (G-piikki)' : '') : 'Suojaus epaonnistui');
        refreshClipCount();
    }

    // Suojaa yksittainen rengas-/idb-clip (v7.11)
    window.dashcamProtectClip = async function(id) {
        const clip = dc.ring.find(c => c.id === id);
        if (!clip) return;
        try {
            await idbPut({
                id: clip.id, ts: clip.ts, durationMs: clip.durMs,
                sizeBytes: clip.blob.size, reason: 'manual',
                mime: clip.blob.type, blob: clip.blob
            });
            toast('Klippi suojattu');
            refreshClipCount();
            window.dashcamOpenManager();
        } catch (e) { toast('Suojaus epaonnistui'); }
    };

    // Nappi: jos nauhoitus kaynnissa, lopeta klippi NYT ja suojaa; muuten suojaa renkaan viimeisimmat
    window.dashcamProtect = function(reason) {
        if (dc.recorder && dc.recorder.state === 'recording') {
            dc._protectAfterStop = reason || 'manual';
            try { dc.recorder.stop(); } catch (e) { saveRingItems(reason); }
            return;
        }
        saveRingItems(reason || 'manual');
    };

    // ---------- UI ----------
    function toast(msg) { if (typeof showToast === 'function') showToast(msg); }

    function updateRecUI(rec) {
        const t = document.getElementById('btn-dashcam-toggle');
        const p = document.getElementById('btn-dashcam-protect');
        if (t) {
            t.innerHTML = rec ? '🔴 REC' : '📹 DASHCAM';
            t.classList.toggle('red-btn', !!rec);
            t.classList.toggle('secondary-btn', !rec);
        }
        if (p) p.style.display = rec ? '' : 'none';
        document.body.classList.toggle('dashcam-rec', !!rec);
    }

    function refreshClipCount() {
        const el = document.getElementById('dashcam-count');
        if (!el) return;
        idbAll().then(list => { el.textContent = list.length ? '(' + list.length + ')' : ''; }).catch(() => {});
    }

    // ---------- Manageri ----------
    function fmtSize(b) { return (b / 1048576).toFixed(1) + ' MB'; }
    function fmtTs(ts) {
        const d = new Date(ts), p = (n) => (n < 10 ? '0' + n : '' + n);
        return p(d.getDate()) + '.' + p(d.getMonth() + 1) + '.' + d.getFullYear() + ' ' + p(d.getHours()) + ':' + p(d.getMinutes());
    }

    window.dashcamOpenManager = async function() {
        const modal = document.getElementById('dashcam-modal');
        const list = document.getElementById('dashcam-clips-list');
        if (!modal || !list) return;
        list.innerHTML = '<div class="loading">Ladataan...</div>';
        modal.style.display = 'flex';
        let clips = [];
        try { clips = await idbAll(); } catch (e) {}
        clips.sort((a, b) => b.ts - a.ts);
        list.innerHTML = '';

        // Rengaspuskurin klipit (RAM, ei suojattu) - voi toistaa + suojata (v7.11)
        const ringItems = dc.ring.slice().reverse();
        if (ringItems.length) {
            const rh = document.createElement('div');
            rh.style.cssText = 'font-size:12px; font-weight:700; color:var(--accent-color); margin:4px 0 8px;';
            rh.textContent = 'RENGASPUSKURI (' + ringItems.length + ' klippia, poistuu kun tila tayttyy)';
            list.appendChild(rh);
            ringItems.forEach((c) => {
                const url = URL.createObjectURL(c.blob);
                const row = document.createElement('div');
                row.style.cssText = 'margin-bottom:12px; border:1px solid rgba(255,255,255,0.14); border-radius:10px; padding:8px;';
                row.innerHTML =
                    '<video src="' + url + '" controls playsinline style="width:100%; border-radius:8px; background:#000; max-height:160px;"></video>' +
                    '<div style="display:flex; justify-content:space-between; align-items:center; margin-top:6px;">' +
                        '<span style="font-size:11px; color:var(--subtext-color);">' + fmtTs(c.ts) + ' · ' + fmtSize(c.blob.size) + '</span>' +
                        '<button class="action-btn yellow-btn" style="width:auto; font-size:12px; padding:6px 12px;">Suojaa</button>' +
                    '</div>';
                row.querySelector('button').addEventListener('click', () => window.dashcamProtectClip(c.id));
                list.appendChild(row);
            });
        }

        if (!clips.length && !ringItems.length) { list.innerHTML = '<div style="color:var(--subtext-color); padding:12px;">Ei klippeja - kaynnista nauhoitus</div>'; return; }
        if (!clips.length) return;

        const sh = document.createElement('div');
        sh.style.cssText = 'font-size:12px; font-weight:700; color:var(--accent-color); margin:14px 0 8px;';
        sh.textContent = 'SUOJATUT (' + clips.length + ')';
        list.appendChild(sh);
        clips.forEach((c) => {
            const url = URL.createObjectURL(c.blob);
            const row = document.createElement('div');
            row.style.cssText = 'margin-bottom:14px; border-bottom:1px solid rgba(255,255,255,0.08); padding-bottom:12px;';
            row.innerHTML =
                '<video src="' + url + '" controls playsinline style="width:100%; border-radius:8px; background:#000; max-height:200px;"></video>' +
                '<div style="font-size:11px; color:var(--subtext-color); margin:6px 0;">' +
                    fmtTs(c.ts) + ' · ' + Math.round(c.durationMs / 1000) + 's · ' + fmtSize(c.sizeBytes) +
                    (c.reason === 'gspike' ? ' · G-piikki' : '') +
                '</div>' +
                '<div style="display:flex; gap:8px;">' +
                    '<button class="action-btn blue-btn dc-dl" style="flex:1; font-size:12px; padding:8px;">Lataa</button>' +
                    '<button class="action-btn blue-btn dc-sh" style="flex:1; font-size:12px; padding:8px;">Jaa</button>' +
                    '<button class="action-btn red-btn dc-rm" style="flex:1; font-size:12px; padding:8px;">Poista</button>' +
                '</div>';
            row.querySelector('.dc-dl').addEventListener('click', () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'dashcam_' + fmtTs(c.ts).replace(/[:. ]/g, '-') + '.' + extForMime(c.mime || '');
                a.click();
            });
            row.querySelector('.dc-sh').addEventListener('click', async () => {
                try {
                    const f = new File([c.blob], 'dashcam_' + c.ts + '.' + extForMime(c.mime || ''), { type: c.mime || 'video/webm' });
                    if (navigator.canShare && navigator.canShare({ files: [f] })) {
                        await navigator.share({ files: [f] });
                    } else {
                        toast('Jakoa ei tueta - kayta Lataa');
                    }
                } catch (e) {}
            });
            row.querySelector('.dc-rm').addEventListener('click', async () => {
                await idbDel(c.id);
                row.remove();
                refreshClipCount();
                if (!list.children.length) list.innerHTML = '<div style="color:var(--subtext-color); padding:12px;">Ei suojattuja klippeja</div>';
            });
            list.appendChild(row);
        });
    };

    // ---------- Esikatselu (kameran suuntaus, v7.11) ----------
    let previewStream = null;
    window.dashcamOpenPreview = async function() {
        const modal = document.getElementById('dashcam-preview-modal');
        const vid = document.getElementById('dashcam-preview-video');
        if (!modal || !vid) return;
        try {
            previewStream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }, audio: false
            });
        } catch (e) { toast('Kameraa ei saada kayttoon'); return; }
        vid.srcObject = previewStream;
        try { await vid.play(); } catch (e) {}
        modal.style.display = 'flex';
    };
    window.dashcamClosePreview = function() {
        if (previewStream) { previewStream.getTracks().forEach(t => t.stop()); previewStream = null; }
        const vid = document.getElementById('dashcam-preview-video');
        if (vid) vid.srcObject = null;
        const modal = document.getElementById('dashcam-preview-modal');
        if (modal) modal.style.display = 'none';
    };

    // ---------- Init ----------
    function init() {
        const row = document.getElementById('dashcam-row');
        const toggle = document.getElementById('btn-dashcam-toggle');
        const protect = document.getElementById('btn-dashcam-protect');
        const clipsBtn = document.getElementById('btn-dashcam-clips');
        const close = document.getElementById('btn-dashcam-close');
        const prevBtn = document.getElementById('btn-dashcam-preview');
        const prevClose = document.getElementById('btn-dashcam-preview-close');
        const prevX = document.getElementById('btn-dashcam-preview-x');
        const prevStart = document.getElementById('btn-dashcam-preview-start');
        const enabledToggle = document.getElementById('toggle-dashcam-enabled');
        const sClipCount = document.getElementById('dashcam-set-clips');
        const sClipSec = document.getElementById('dashcam-set-clipsec');
        const sRes = document.getElementById('dashcam-set-res');
        const sAudio = document.getElementById('dashcam-set-audio');

        // Feature flag: nayta/piilota rivi
        const applyFlag = () => {
            const on = window.isDashcamEnabled();
            if (row) row.style.display = on ? 'flex' : 'none';
            document.body.classList.toggle('dashcam-on', on);
            if (enabledToggle) enabledToggle.checked = on;
            if (!on && dc.running) window.dashcamStop();
        };
        applyFlag();

        // Lataa edellisen istunnon rengasklipit IDB:sta (v7.15)
        idbAllIn(RING_STORE).then(items => {
            if (!items || !items.length) return;
            items.sort((a, b) => a.ts - b.ts);
            const s2 = getSettings();
            dc.ring = items.slice(-s2.clips).map(i => ({ id: i.id, ts: i.ts, blob: i.blob, durMs: i.durationMs }));
            // Poista ylimaaraiset vanhat
            const maxId = dc.ring.length ? dc.ring[0].ts : 0;
            items.forEach(i => { if (i.ts < maxId && !dc.ring.find(c => c.id === i.id)) idbDelIn(RING_STORE, i.id).catch(() => {}); });
        }).catch(() => {});

        if (enabledToggle) {
            enabledToggle.addEventListener('change', () => {
                localStorage.setItem(FLAG, enabledToggle.checked ? '1' : '0');
                applyFlag();
                toast(enabledToggle.checked ? 'Dashcam kaytossa' : 'Dashcam pois kaytosta');
            });
        }
        // Asetukset
        const s = getSettings();
        if (sClipCount) { sClipCount.value = s.clips; sClipCount.addEventListener('change', () => { s.clips = Math.max(2, Math.min(10, +sClipCount.value || 5)); saveSettings(s); }); }
        if (sClipSec) { sClipSec.value = s.clipSec; sClipSec.addEventListener('change', () => { s.clipSec = Math.max(15, Math.min(300, +sClipSec.value || 60)); saveSettings(s); }); }
        if (sRes) { sRes.value = s.res; sRes.addEventListener('change', () => { s.res = sRes.value === '1080p' ? '1080p' : '720p'; saveSettings(s); }); }
        if (sAudio) { sAudio.checked = !!s.audio; sAudio.addEventListener('change', () => { s.audio = !!sAudio.checked; saveSettings(s); }); }

        if (toggle) toggle.addEventListener('click', () => { if (dc.running) window.dashcamStop(); else dashcamStart(); });
        if (protect) protect.addEventListener('click', () => window.dashcamProtect('manual'));
        if (clipsBtn) clipsBtn.addEventListener('click', () => window.dashcamOpenManager());
        if (close) close.addEventListener('click', () => { document.getElementById('dashcam-modal').style.display = 'none'; });
        if (prevBtn) prevBtn.addEventListener('click', () => window.dashcamOpenPreview());
        if (prevClose) prevClose.addEventListener('click', () => window.dashcamClosePreview());
        if (prevX) prevX.addEventListener('click', () => window.dashcamClosePreview());
        if (prevStart) prevStart.addEventListener('click', () => { window.dashcamClosePreview(); dashcamStart(); });

        refreshClipCount();
    }

    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
    else init();
})();
