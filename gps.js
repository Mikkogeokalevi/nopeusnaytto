// =========================================================
// GPS.JS - PAIKANNUS, MATKA JA TALLENNUS (v6.12 SEGMENTS + ADDRESSES)
// =========================================================

// --- 0. SILENT AUDIO HACK (BACKGROUND MODE) ---
// Tämä pitää selaimen prosessin hengissä vaikka näyttö sammuisi.
const silentAudio = new Audio("data:audio/mp3;base64,SUQzBAAAAAABAFRYWFgAAAASAAADbWFqb3JfYnJhbmQAbXA0MgBUWFhYAAAAEQAAA21pbm9yX3ZlcnNpb24AMABUWFhYAAAAHAAAA2NvbXBhdGlibGVfYnJhbmRzAGlzb21tcDQyAFRTU0UAAAAPAAADTGF2ZjU3LjU2LjEwMAAAAAAAAAAAAAAA//OEAAAAAAAAAAAAAAAAAAAAAAAASW5mbwAAAA8AAAAEAAABIWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFhYWFh//OEAAAAAAAAAAAAAAAAAAAAAAAAMExhdmM1Ny42NAAAAAAAAAAAAAAAAAHAAAAAAAAAAAAFccAAABAAAAAAAAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA//OEMAAAAB5AAAAAAAAAAAFccAAAAAAA");
silentAudio.loop = true;
silentAudio.volume = 0.01; // Hyvin hiljainen varmuuden vuoksi

// CRASH RECOVERY KEY
const RECOVERY_KEY = 'ajopro_crash_recovery_v1';

// OSOITEMUISTI (v6.10)
var startAddressSnapshot = ""; 

// OSIO-SEURANTA (v6.12 SUB-TRIPS)
var sessionStartTime = null;      // Tämän nimenomaisen pätkän aloitusaika
var sessionStartDistance = 0;     // Mittarilukema tämän pätkän alussa
var sessionPauseTime = 0;         // Tauot vain tämän pätkän aikana
var sessionStartAddress = "";     // Tämän pätkän lähtöosoite
var existingSessions = [];        // Lista aiemmista osamatkoista (jos continue)
var poiRearmLocks = {};           // { [poiId]: tsMs } estää heti-uudelleenhälytyksen

// GPS-signaalin pehmennys POI-logiikkaa varten
var lastGpsAccuracyM = 30;
var gpsFilterState = {
    speedKmh: null,
    headingDeg: null
};

var roadSpeedLimitState = {
    limitKmh: null,
    source: 'unknown', // exact | estimated | unknown
    roadName: '',
    roadType: '',
    roadWayId: null,
    lastKnownLimitKmh: null,
    lastKnownSource: 'unknown',
    lastKnownRoadName: '',
    lastKnownRoadType: '',
    lastKnownRoadWayId: null,
    lastKnownTs: 0,
    lastFetchTs: 0,
    lastFetchLat: null,
    lastFetchLng: null,
    inFlight: false
};

const ROAD_LIMIT_FETCH_INTERVAL_MS = 45000;
const ROAD_LIMIT_FETCH_MIN_MOVE_M = 120;
const ROAD_LIMIT_EXACT_HOLD_MS = 90000;
const ROAD_LIMIT_ESTIMATED_HOLD_MS = 45000;

function clamp01(v) {
    const n = Number(v);
    if (!isFinite(n)) return 0;
    return Math.max(0, Math.min(1, n));
}

function getAdaptiveSpeedAlpha(accM, speedKmh) {
    let a = 0.5;
    if (isFinite(accM)) {
        if (accM > 60) a = 0.22;
        else if (accM > 35) a = 0.3;
        else if (accM > 18) a = 0.4;
    }
    if (isFinite(speedKmh) && speedKmh < 8) a *= 0.82;
    return clamp01(a);
}

function smoothSpeedKmh(rawSpeedKmh, accM) {
    const speed = Math.max(0, Number(rawSpeedKmh) || 0);
    const prev = Number(gpsFilterState.speedKmh);
    if (!isFinite(prev)) {
        gpsFilterState.speedKmh = speed;
        return speed;
    }
    const alpha = getAdaptiveSpeedAlpha(accM, speed);
    const next = prev + alpha * (speed - prev);
    gpsFilterState.speedKmh = next;
    return next;
}

function smoothHeadingDeg(rawHeading, derivedHeading, speedKmh, accM) {
    const hRaw = (typeof rawHeading === 'number' && isFinite(rawHeading)) ? rawHeading : null;
    const hDerived = (typeof derivedHeading === 'number' && isFinite(derivedHeading)) ? derivedHeading : null;
    let source = hRaw;

    // Hitaassa vauhdissa tai heikossa tarkkuudessa hyödynnetään geometriasta laskettua suuntaa,
    // koska laiteheading voi olla epävakaa.
    const preferDerived = (isFinite(accM) && accM > 40) || (isFinite(speedKmh) && speedKmh < 18);
    if (preferDerived && hDerived !== null) source = hDerived;
    if (source === null && hDerived !== null) source = hDerived;
    if (source === null) return null;

    const prev = Number(gpsFilterState.headingDeg);
    if (!isFinite(prev)) {
        gpsFilterState.headingDeg = source;
        return source;
    }

    let alpha = 0.34;
    if (isFinite(accM) && accM > 60) alpha = 0.2;
    else if (isFinite(accM) && accM < 20) alpha = 0.45;
    if (isFinite(speedKmh) && speedKmh > 70) alpha = Math.min(0.58, alpha + 0.1);

    const diff = ((source - prev + 540) % 360) - 180;
    const next = (prev + alpha * diff + 360) % 360;
    gpsFilterState.headingDeg = next;
    return next;
}

function getPoiConfidenceScore(ctx) {
    const radiusM = Math.max(30, Number(ctx.radiusM) || 350);
    const distM = Math.max(0, Number(ctx.distM) || 0);
    const prevDistM = Number(ctx.prevDistM);
    const segMinDistM = Number(ctx.segMinDistM);
    const poiType = String(ctx.poiType || 'other');
    const accM = Number(ctx.accM);
    const speedKmh = Number(ctx.speedKmh);
    const headingDiffDeg = Number(ctx.headingDiffDeg);

    let score = 0;

    const proximity = clamp01(1 - (distM / radiusM));
    score += proximity * 0.5;

    if (isFinite(segMinDistM) && segMinDistM <= radiusM) score += 0.14;

    if (isFinite(prevDistM)) {
        if (distM <= prevDistM + 5) score += 0.14;
        else score -= 0.12;
    }

    if (poiType === 'speedcamera') {
        if (isFinite(headingDiffDeg)) {
            score += clamp01(1 - (headingDiffDeg / 120)) * 0.18;
        } else if (isFinite(speedKmh) && speedKmh >= 20) {
            score -= 0.06;
        }
    }

    if (isFinite(accM)) {
        if (accM > 80) score -= 0.16;
        else if (accM > 45) score -= 0.09;
    }

    return clamp01(score);
}

function getPoiSensitivityMode() {
    try {
        const raw = String(localStorage.getItem('poiSensitivityMode') || 'normal').trim().toLowerCase();
        if (raw === 'strict' || raw === 'sensitive' || raw === 'normal') return raw;
    } catch (e) {
        // ignore
    }
    return 'normal';
}

function getPoiSensitivityConfig() {
    const mode = getPoiSensitivityMode();
    if (mode === 'strict') {
        return {
            headingRejectDeg: 95,
            speedcameraConfidence: 0.38,
            otherConfidence: 0.29
        };
    }
    if (mode === 'sensitive') {
        return {
            headingRejectDeg: 125,
            speedcameraConfidence: 0.24,
            otherConfidence: 0.2
        };
    }
    return {
        headingRejectDeg: 110,
        speedcameraConfidence: 0.3,
        otherConfidence: 0.24
    };
}

function getPoiRearmDistanceM() {
    try {
        const raw = parseInt(localStorage.getItem('poiRearmDistanceM') || '400', 10);
        if (!isFinite(raw)) return 400;
        return Math.max(120, Math.min(2500, raw));
    } catch (e) {
        return 400;
    }
}

function setPoiRearmLock(poiId) {
    const id = String(poiId || '').trim();
    if (!id) return;
    poiRearmLocks[id] = Date.now();
}

function clearPoiRearmLock(poiId) {
    const id = String(poiId || '').trim();
    if (!id) return;
    delete poiRearmLocks[id];
}

function getPoiEffectiveRadiusM(poiType, baseRadiusM, speedKmh) {
    const base = Math.max(30, Number(baseRadiusM) || 350);
    const type = String(poiType || 'other').trim().toLowerCase();
    if (type !== 'speedcamera') return base;

    const spd = Math.max(0, Number(speedKmh) || 0);
    let factor = 1;
    if (spd <= 30) {
        factor = 0.88;
    } else if (spd <= 80) {
        factor = 0.88 + ((spd - 30) / 50) * 0.14; // 0.88 -> 1.02
    } else if (spd <= 130) {
        factor = 1.02 + ((spd - 80) / 50) * 0.34; // 1.02 -> 1.36
    } else {
        factor = 1.36;
    }

    return Math.max(30, Math.round(base * factor));
}

function resetRoadSpeedLimitState() {
    roadSpeedLimitState.limitKmh = null;
    roadSpeedLimitState.source = 'unknown';
    roadSpeedLimitState.roadName = '';
    roadSpeedLimitState.roadType = '';
    roadSpeedLimitState.roadWayId = null;
    roadSpeedLimitState.lastKnownLimitKmh = null;
    roadSpeedLimitState.lastKnownSource = 'unknown';
    roadSpeedLimitState.lastKnownRoadName = '';
    roadSpeedLimitState.lastKnownRoadType = '';
    roadSpeedLimitState.lastKnownRoadWayId = null;
    roadSpeedLimitState.lastKnownTs = 0;
    roadSpeedLimitState.lastFetchTs = 0;
    roadSpeedLimitState.lastFetchLat = null;
    roadSpeedLimitState.lastFetchLng = null;
    roadSpeedLimitState.inFlight = false;
}

function setRoadSpeedLimitState(limitKmh, source, roadName, roadType, roadWayId) {
    const limit = Number(limitKmh);
    const src = String(source || 'unknown').toLowerCase();
    const rn = String(roadName || '').trim();
    const rt = String(roadType || '').trim().toLowerCase();
    const rwid = (roadWayId === null || roadWayId === undefined) ? null : String(roadWayId);

    if (isFinite(limit) && limit > 0 && (src === 'exact' || src === 'estimated')) {
        roadSpeedLimitState.limitKmh = Math.round(limit);
        roadSpeedLimitState.source = src;
        roadSpeedLimitState.roadName = rn;
        roadSpeedLimitState.roadType = rt;
        roadSpeedLimitState.roadWayId = rwid;

        roadSpeedLimitState.lastKnownLimitKmh = Math.round(limit);
        roadSpeedLimitState.lastKnownSource = src;
        roadSpeedLimitState.lastKnownRoadName = rn;
        roadSpeedLimitState.lastKnownRoadType = rt;
        roadSpeedLimitState.lastKnownRoadWayId = rwid;
        roadSpeedLimitState.lastKnownTs = Date.now();
        return;
    }

    roadSpeedLimitState.limitKmh = null;
    roadSpeedLimitState.source = 'unknown';
    roadSpeedLimitState.roadName = rn;
    roadSpeedLimitState.roadType = rt;
    roadSpeedLimitState.roadWayId = rwid;
}

function getRoadSpeedLimitSnapshot() {
    const now = Date.now();
    const hasLive = isFinite(roadSpeedLimitState.limitKmh) && roadSpeedLimitState.limitKmh > 0
        && (roadSpeedLimitState.source === 'exact' || roadSpeedLimitState.source === 'estimated');

    if (!hasLive) {
        const lastLimit = Number(roadSpeedLimitState.lastKnownLimitKmh);
        const lastSrc = String(roadSpeedLimitState.lastKnownSource || 'unknown').toLowerCase();
        const holdMs = (lastSrc === 'exact') ? ROAD_LIMIT_EXACT_HOLD_MS : ROAD_LIMIT_ESTIMATED_HOLD_MS;
        const ageMs = now - Number(roadSpeedLimitState.lastKnownTs || 0);
        if (isFinite(lastLimit) && lastLimit > 0 && ageMs >= 0 && ageMs <= holdMs && (lastSrc === 'exact' || lastSrc === 'estimated')) {
            return {
                limitKmh: lastLimit,
                source: lastSrc,
                roadName: roadSpeedLimitState.lastKnownRoadName,
                roadType: roadSpeedLimitState.lastKnownRoadType,
                roadWayId: roadSpeedLimitState.lastKnownRoadWayId,
                fetchedAt: roadSpeedLimitState.lastKnownTs,
                stale: true
            };
        }
    }

    return {
        limitKmh: roadSpeedLimitState.limitKmh,
        source: roadSpeedLimitState.source,
        roadName: roadSpeedLimitState.roadName,
        roadType: roadSpeedLimitState.roadType,
        roadWayId: roadSpeedLimitState.roadWayId,
        fetchedAt: roadSpeedLimitState.lastFetchTs
    };
}

function parseMaxspeedToKmh(raw) {
    const txt = String(raw || '').trim().toLowerCase();
    if (!txt) return null;

    if (txt.includes(';')) {
        const first = txt.split(';')[0].trim();
        return parseMaxspeedToKmh(first);
    }

    if (txt === 'fi:urban') return 50;
    if (txt === 'fi:rural') return 80;
    if (txt === 'fi:motorway') return 120;

    const num = parseInt(txt, 10);
    if (!isFinite(num)) return null;

    if (txt.includes('mph')) return Math.round(num * 1.60934);
    return num;
}

function estimateSpeedLimitFromRoadType(roadType) {
    const t = String(roadType || '').trim().toLowerCase();
    if (!t) return null;
    if (t === 'motorway') return 120;
    if (t === 'trunk') return 100;
    if (t === 'primary') return 80;
    if (t === 'secondary') return 80;
    if (t === 'tertiary') return 70;
    if (t === 'residential') return 50;
    if (t === 'living_street') return 20;
    if (t === 'service') return 30;
    if (t === 'track') return 30;
    if (t === 'unclassified') return 70;
    if (t === 'road') return 60;
    return null;
}

function getRoadClassRank(roadType) {
    const t = String(roadType || '').trim().toLowerCase();
    if (t === 'motorway') return 7;
    if (t === 'trunk') return 6;
    if (t === 'primary') return 5;
    if (t === 'secondary') return 4;
    if (t === 'tertiary') return 3;
    if (t === 'unclassified') return 2;
    if (t === 'residential' || t === 'road') return 1;
    if (t === 'service' || t === 'track') return 0;
    return -1;
}

function getWayGeometryLatLng(way) {
    const geom = Array.isArray(way && way.geometry) ? way.geometry : [];
    const out = [];
    for (const p of geom) {
        const la = p && isFinite(p.lat) ? Number(p.lat) : null;
        const lo = p && (isFinite(p.lon) || isFinite(p.lng)) ? Number(isFinite(p.lon) ? p.lon : p.lng) : null;
        if (isFinite(la) && isFinite(lo)) out.push({ lat: la, lng: lo });
    }
    return out;
}

function isLikelyDriveableRoadType(roadType) {
    const t = String(roadType || '').trim().toLowerCase();
    if (!t) return false;
    return !(t === 'footway' || t === 'path' || t === 'cycleway' || t === 'pedestrian' || t === 'steps' || t === 'bridleway' || t === 'corridor' || t === 'platform' || t === 'construction' || t === 'proposed');
}

function getExpectedRoadClassBySpeed(speedKmh) {
    const spd = Math.max(0, Number(speedKmh) || 0);
    if (spd >= 95) return 5;     // primary+
    if (spd >= 75) return 4;     // secondary+
    if (spd >= 55) return 3;     // tertiary+
    if (spd >= 35) return 2;     // unclassified+
    return 1;                    // residential+
}

function getWayHeadingAtNearestSegment(way, lat, lng) {
    const pts = getWayGeometryLatLng(way);
    if (!Array.isArray(pts) || pts.length < 2) return { distM: Infinity, headingDeg: null };

    let bestDistM = Infinity;
    let bestHeading = null;
    for (let i = 0; i < pts.length - 1; i += 1) {
        const a = pts[i];
        const b = pts[i + 1];
        const d = pointToSegmentDistanceMeters(a.lat, a.lng, b.lat, b.lng, lat, lng);
        if (d < bestDistM) {
            bestDistM = d;
            bestHeading = calculateBearing(a.lat, a.lng, b.lat, b.lng);
        }
    }
    return { distM: bestDistM, headingDeg: bestHeading };
}

function getRoadCandidateScore(way, lat, lng, headingDeg, speedKmh) {
    const tags = way && way.tags ? way.tags : {};
    const roadType = String(tags.highway || '').trim().toLowerCase();
    if (!isLikelyDriveableRoadType(roadType)) return { score: Infinity, distM: Infinity, headingDeg: null, roadType };

    let distM = Infinity;
    let segHeadingDeg = null;

    const segInfo = getWayHeadingAtNearestSegment(way, lat, lng);
    if (isFinite(segInfo.distM)) {
        distM = segInfo.distM;
        segHeadingDeg = segInfo.headingDeg;
    } else {
        const cLat = way.center && isFinite(way.center.lat) ? Number(way.center.lat) : null;
        const cLng = way.center && isFinite(way.center.lon) ? Number(way.center.lon) : null;
        if (isFinite(cLat) && isFinite(cLng)) {
            distM = getDistanceFromLatLonInKm(lat, lng, cLat, cLng) * 1000;
        }
    }

    let score = distM;

    const rank = getRoadClassRank(roadType);
    const expectedRank = getExpectedRoadClassBySpeed(speedKmh);
    if (rank >= 0 && rank < expectedRank) {
        score += (expectedRank - rank) * 34;
    }

    const movingFast = Number(speedKmh) >= 70;
    if (movingFast && rank >= 0 && rank <= 1) {
        // Vältä rinnakkaisia hidaskatuja/huoltoteitä moottoritie- ja maantienopeuksissa.
        score += 95;
    }
    const headingOk = Number(speedKmh) >= 25 && isFinite(headingDeg) && isFinite(segHeadingDeg);
    if (headingOk) {
        const oneWayRaw = String(tags.oneway || '').trim().toLowerCase();
        let headingDiff = Math.min(
            angularDiffDeg(headingDeg, segHeadingDeg),
            angularDiffDeg(headingDeg, (segHeadingDeg + 180) % 360)
        );
        if (oneWayRaw === 'yes' || oneWayRaw === '1' || oneWayRaw === 'true') {
            headingDiff = angularDiffDeg(headingDeg, segHeadingDeg);
        } else if (oneWayRaw === '-1') {
            headingDiff = angularDiffDeg(headingDeg, (segHeadingDeg + 180) % 360);
        }
        score += headingDiff * 1.6;
        if (movingFast && headingDiff > 75) score += 140;
    }

    const currentWayId = (way && way.id !== undefined && way.id !== null) ? String(way.id) : null;
    if (currentWayId && roadSpeedLimitState.lastKnownRoadWayId && currentWayId === String(roadSpeedLimitState.lastKnownRoadWayId)) {
        score -= 22;
    }

    return { score, distM, headingDeg: segHeadingDeg, roadType };
}

function pickNearestRoadElement(elements, lat, lng, headingDeg, speedKmh) {
    if (!Array.isArray(elements) || elements.length === 0) return null;
    let best = null;
    let bestScore = Infinity;

    for (const el of elements) {
        if (!el || !el.tags || !el.tags.highway) continue;
        const scored = getRoadCandidateScore(el, lat, lng, headingDeg, speedKmh);
        if (!isFinite(scored.score)) continue;
        if (scored.score < bestScore) {
            bestScore = scored.score;
            best = el;
        }
    }
    return best;
}

function shouldFetchRoadSpeedLimit(lat, lng, nowMs) {
    if (roadSpeedLimitState.inFlight) return false;
    if (!isFinite(lat) || !isFinite(lng)) return false;
    if (!roadSpeedLimitState.lastFetchTs) return true;

    const ageMs = nowMs - roadSpeedLimitState.lastFetchTs;
    if (ageMs >= ROAD_LIMIT_FETCH_INTERVAL_MS) return true;

    if (!isFinite(roadSpeedLimitState.lastFetchLat) || !isFinite(roadSpeedLimitState.lastFetchLng)) return true;

    const movedM = getDistanceFromLatLonInKm(
        roadSpeedLimitState.lastFetchLat,
        roadSpeedLimitState.lastFetchLng,
        lat,
        lng
    ) * 1000;

    if (movedM >= ROAD_LIMIT_FETCH_MIN_MOVE_M && ageMs >= 12000) return true;
    return false;
}

function requestRoadSpeedLimit(lat, lng, headingDeg, speedKmh) {
    const now = Date.now();
    if (!shouldFetchRoadSpeedLimit(lat, lng, now)) return;

    roadSpeedLimitState.inFlight = true;
    roadSpeedLimitState.lastFetchTs = now;
    roadSpeedLimitState.lastFetchLat = lat;
    roadSpeedLimitState.lastFetchLng = lng;

    const query = `[out:json][timeout:12];way(around:120,${lat},${lng})["highway"];out tags center geom 28;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

    fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error(`overpass ${res.status}`);
            return res.json();
        })
        .then((data) => {
            const best = pickNearestRoadElement(data && data.elements ? data.elements : [], lat, lng, headingDeg, speedKmh);
            if (!best || !best.tags) {
                setRoadSpeedLimitState(null, 'unknown', '', '', null);
                return;
            }

            const tags = best.tags || {};
            const roadType = String(tags.highway || '').trim().toLowerCase();
            const roadName = String(tags.name || tags.ref || '').trim();
            const roadWayId = (best.id === undefined || best.id === null) ? null : String(best.id);

            const rawMax = tags.maxspeed || tags['maxspeed:forward'] || tags['maxspeed:backward'] || '';
            const exact = parseMaxspeedToKmh(rawMax);
            if (isFinite(exact) && exact > 0) {
                setRoadSpeedLimitState(exact, 'exact', roadName, roadType, roadWayId);
                return;
            }

            const estimated = estimateSpeedLimitFromRoadType(roadType);
            if (isFinite(estimated) && estimated > 0) {
                setRoadSpeedLimitState(estimated, 'estimated', roadName, roadType, roadWayId);
                return;
            }

            setRoadSpeedLimitState(null, 'unknown', roadName, roadType, roadWayId);
        })
        .catch(() => {
            // Jos haku epäonnistuu, pidä vanha arvo jos sellainen on.
        })
        .finally(() => {
            roadSpeedLimitState.inFlight = false;
            if (typeof window.updateDashboardSpeedLimit === 'function') {
                window.updateDashboardSpeedLimit(getRoadSpeedLimitSnapshot());
            }
        });
}

window.ensurePoiAudioContext = function() {
    try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (!AudioCtx) return null;
        if (!window._poiAudioCtx) window._poiAudioCtx = new AudioCtx();
        if (window._poiAudioCtx && window._poiAudioCtx.state === 'suspended') {
            window._poiAudioCtx.resume().catch(() => {});
        }
        return window._poiAudioCtx;
    } catch (e) {
        return null;
    }
}

const POI_SOUND_PROFILE_DEFAULTS = {
    speedcamera: 'double_beep',
    danger: 'alarm_pulse',
    customer: 'soft_ping',
    reminder: 'single_chime',
    other: 'single_chime'
};

function getPoiBeepMasterGain() {
    try {
        const raw = parseFloat(localStorage.getItem('poiBeepMasterGain') || '0.45');
        if (!isFinite(raw)) return 0.45;
        return Math.max(0, Math.min(1, raw));
    } catch (e) {
        return 0.45;
    }
}

function normalizePoiSoundProfile(v) {
    const s = String(v || '').trim().toLowerCase();
    if (s === 'double_beep' || s === 'alarm_pulse' || s === 'single_chime' || s === 'soft_ping') return s;
    return '';
}

function getPoiSoundProfile(type, override = '') {
    const t = String(type || 'other').trim().toLowerCase();
    const fallback = POI_SOUND_PROFILE_DEFAULTS[t] || POI_SOUND_PROFILE_DEFAULTS.other;
    const forced = normalizePoiSoundProfile(override);
    if (forced) return forced;
    try {
        const key = `poiSoundProfile_${t}`;
        const saved = normalizePoiSoundProfile(localStorage.getItem(key) || '');
        if (saved) return saved;
    } catch (e) {
        // ignore
    }
    return fallback;
}

function schedulePoiTone(ctx, startAt, freq, peakGain, durationSec, waveType) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = waveType || 'sine';
    osc.frequency.setValueAtTime(freq, startAt);
    gain.gain.setValueAtTime(0.0001, startAt);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, peakGain), startAt + Math.min(0.03, durationSec * 0.25));
    gain.gain.exponentialRampToValueAtTime(0.0001, startAt + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(startAt);
    osc.stop(startAt + durationSec + 0.02);
}

window.playPoiAlertBeep = function(poiType = 'other', overrideProfile = '') {
    // 1 = päällä, 0 = pois
    const enabled = localStorage.getItem('poiBeepEnabled');
    if (enabled === '0') return;

    const ctx = window.ensurePoiAudioContext();
    if (!ctx) return;
    const type = String(poiType || 'other').trim().toLowerCase();
    const profile = getPoiSoundProfile(type, overrideProfile);
    const master = getPoiBeepMasterGain();
    if (master <= 0) return;

    const play = () => {
        try {
            if (!ctx || ctx.state !== 'running') return;
            const t0 = ctx.currentTime;
            if (profile === 'double_beep') {
                const g = 0.42 * master;
                schedulePoiTone(ctx, t0, 960, g, 0.16, 'square');
                schedulePoiTone(ctx, t0 + 0.22, 880, g * 0.92, 0.18, 'square');
                return;
            }

            if (profile === 'alarm_pulse') {
                const g = 0.36 * master;
                schedulePoiTone(ctx, t0, 720, g, 0.14, 'sawtooth');
                schedulePoiTone(ctx, t0 + 0.16, 780, g * 0.92, 0.14, 'sawtooth');
                schedulePoiTone(ctx, t0 + 0.32, 840, g * 0.84, 0.16, 'sawtooth');
                return;
            }

            if (profile === 'soft_ping') {
                schedulePoiTone(ctx, t0, 660, 0.20 * master, 0.22, 'sine');
                return;
            }

            // single_chime (default)
            schedulePoiTone(ctx, t0, 740, 0.26 * master, 0.2, 'triangle');
        } catch (e) {
            // ignore
        }
    };

    // Samsung/iOS PWA: audio voi jäädä "suspended" ellei sitä avata käyttäjän eleessä.
    if (ctx.state === 'running') {
        play();
        return;
    }
    try {
        ctx.resume().then(() => {
            play();
        }).catch(() => {});
    } catch (e) {
        // ignore
    }
}

// 1. KONTROLLIPAINIKKEET JA LOGIIKKA

// Aktivointinappi
const btnActivate = document.getElementById('btn-activate-gps');
if (btnActivate) {
    btnActivate.addEventListener('click', () => {
        if (!isGPSActive) {
            // Avataan POI-äänikonteksti varmasti käyttäjän eleestä (PWA/Samsung)
            if (typeof window.ensurePoiAudioContext === 'function') window.ensurePoiAudioContext();
            startGPS();
            
            // Käynnistetään taustaääni heti käyttäjän interaktiosta
            silentAudio.play().then(() => {
                console.log("Background audio started");
            }).catch(e => {
                console.warn("Background audio failed:", e);
            });

            btnActivate.style.display = 'none';
            
            if(document.getElementById('rec-controls')) {
                document.getElementById('rec-controls').style.display = 'flex';
            }
            if(activeRecBtns) activeRecBtns.style.display = 'none'; 
            
            // Varmistetaan että aloitusnapit näkyvät
            const startContainer = document.getElementById('start-buttons-container');
            if(startContainer) startContainer.style.display = 'flex';
            else if(btnStartRec) btnStartRec.style.display = 'inline-block';
            
            if(statusEl) statusEl.innerText = "GPS Päällä";
        }
    });
}

// NAPPI: JATKA VANHAA AJOA (VIE HISTORIAAN)
const btnGotoHistory = document.getElementById('btn-goto-history');
if (btnGotoHistory) {
    btnGotoHistory.addEventListener('click', () => {
        if(typeof switchView === 'function') {
            switchView('history');
            if(typeof showToast === 'function') showToast("Valitse jatkettava ajo listasta (⏯️) 📋");
        }
    });
}

// NAPPI: MERKKAA AJON AIKANA
const btnDriveMark = document.getElementById('btn-drive-mark');
if (btnDriveMark) {
    btnDriveMark.addEventListener('click', () => {
        if (!isRecording || isPaused) {
            if (typeof showToast === 'function') showToast('Merkkaus onnistuu vain tallennuksen aikana.');
            return;
        }
        if (!lastLatLng) {
            if (typeof showToast === 'function') showToast('Odotetaan GPS-sijaintia...');
            return;
        }

        const label = prompt('Merkinnän teksti (valinnainen)', '');
        if (label === null) return;
        const type = 'mark';

        const markerObj = {
            lat: lastLatLng.lat,
            lng: lastLatLng.lng,
            ts: Date.now(),
            type,
            label: (label || '').trim()
        };
        driveMarkers.push(markerObj);

        if (typeof showToast === 'function') {
            showToast('📌 Merkintä lisätty ajolle');
        }
    });
}

// ALOITA TALLENNUS (UUSI AJO)
if (btnStartRec) {
    btnStartRec.addEventListener('click', () => {
        // --- TARKISTUS: Estä aloitus jos autoa ei ole valittu ---
        if (currentCarId === 'all' || currentCarId === 'all_archived') {
            if(typeof showToast === 'function') {
                showToast("Valitse ajoneuvo ennen aloitusta! ⚠️");
            } else {
                alert("Valitse ajoneuvo ennen aloitusta!");
            }
            const carSelect = document.getElementById('car-select');
            if(carSelect) {
                carSelect.style.borderColor = 'red';
                setTimeout(() => carSelect.style.borderColor = '', 2000);
            }
            return;
        }
        // -------------------------------------------------------------

        startRecordingSession(); // Käynnistetään "puhtaalta pöydältä"
    });
}

// Apufunktio tallennuksen aloitukseen (käytetään myös continueDrivessa osittain)
function startRecordingSession(isContinue = false) {
    // Liikeanturien aktivointi
    activateMotionSensors();

    isRecording = true;
    isPaused = false;
    isViewingHistory = false;
    
    // Alustetaan nykyisen session muuttujat (SUB-TRIP)
    sessionStartTime = new Date();
    sessionPauseTime = 0;
    sessionStartAddress = currentAddress; // Otetaan talteen pätkän aloitusosoite
    
    // Varmistetaan että ääni soi
    if (silentAudio.paused) {
        silentAudio.play().catch(e => console.warn(e));
    }
    
    if(mapGpsToggle) {
        mapGpsToggle.innerText = "📡 ON";
        mapGpsToggle.classList.remove('inactive');
    }

    // Jos kyseessä on UUSI ajo (ei jatkettu), nollataan globaalit
    if (!isContinue) {
        startTime = new Date();
        totalPauseTime = 0;
        maxSpeed = 0;
        totalDistance = 0;
        routePath = [];
        driveMarkers = [];
        // OSOITEKORJAUS: Otetaan talteen tämän hetken osoite lähtöosoitteeksi (Pääajo)
        startAddressSnapshot = currentAddress;
        
        // Nollataan sessiotiedot
        existingSessions = [];
        sessionStartDistance = 0; 
        
        if(realTimePolyline) realTimePolyline.setLatLngs([]);
        if(typeof clearSavedRoute === 'function') clearSavedRoute();
        currentDriveWeather = "";
        aggressiveEvents = 0;
        currentDriveId = null; // Varmistetaan että ID on null (uusi ajo)
    } else {
        // Jos jatketaan, asetetaan session aloitusmatka nykyiseen kokonaismatkaan
        sessionStartDistance = totalDistance;
    }
    
    if(typeof updateDashboardUI === 'function') updateDashboardUI(0, maxSpeed, totalDistance, 0, 0, 0);
    
    // Päivitetty: Piilota statusbar myös kävelyssä
    if (currentCarType === 'bike' || currentCarType === 'walking') {
        if(liveStatusBar) liveStatusBar.style.opacity = '0';
    } else {
        if(liveStatusBar) liveStatusBar.style.opacity = '1'; 
        if(liveStyleEl) {
            liveStyleEl.innerText = "Taloudellinen";
            liveStyleEl.className = "style-badge style-green";
        }
    }
    
    // UI-tilojen päivitys
    const startContainer = document.getElementById('start-buttons-container');
    if (startContainer) startContainer.style.display = 'none';
    else if (btnStartRec) btnStartRec.style.display = 'none';

    if (activeRecBtns) activeRecBtns.style.display = 'flex';
    if (btnPause) btnPause.style.display = 'inline-block';
    if (btnResume) btnResume.style.display = 'none';
    
    if(statusEl) {
        statusEl.innerText = isContinue ? "🔴 JATKETAAN AJOA" : "🔴 TALLENNETAAN";
        statusEl.style.color = "#ff4444";
    }
    
    if(timerInterval) clearInterval(timerInterval);
    timerInterval = setInterval(updateTimer, 1000);
}

// UUSI FUNKTIO: JATKA AJOA HISTORIASTA
window.continueDrive = function(driveData) {
    try {
        console.log("Jatketaan ajoa:", driveData);
        
        // 1. Asetetaan ID, jotta tallennus tietää päivittää vanhaa
        currentDriveId = driveData.key;

        // 2. Palautetaan muuttujat vanhasta datasta
        startTime = new Date(driveData.startTime);
        
        // 3. Palautetaan alkuperäinen lähtöosoite (ettei se muutu nykyiseksi)
        startAddressSnapshot = driveData.startAddress || currentAddress;
        
        // SUB-TRIPS: Ladataan olemassa olevat sessiot
        existingSessions = driveData.sessions || [];

        // LASKETAAN TAUKOAIKA
        const oldEndTime = new Date(driveData.endTime);
        const now = new Date();
        const prevActiveDuration = driveData.durationMs || 0;
        const totalTimeSinceStart = now - startTime;
        totalPauseTime = totalTimeSinceStart - prevActiveDuration;

        // Muut muuttujat
        maxSpeed = parseFloat(driveData.maxSpeed) || 0;
        totalDistance = parseFloat(driveData.distanceKm) || 0;
        aggressiveEvents = 0; 
        currentDriveWeather = driveData.weather || "";

        // Palautetaan reitti
        routePath = driveData.route || [];
        driveMarkers = driveData.markers || [];
        if(realTimePolyline) {
            realTimePolyline.setLatLngs([]);
            if(routePath.length > 0) {
                const latLngs = routePath.map(p => [p.lat, p.lng]);
                realTimePolyline.setLatLngs(latLngs);
            }
        }
        
        if(typeof clearSavedRoute === 'function') clearSavedRoute();

        // Varmistetaan että GPS on päällä
        if (!isGPSActive) {
            startGPS();
            if(btnActivate) btnActivate.style.display = 'none';
            if(document.getElementById('rec-controls')) document.getElementById('rec-controls').style.display = 'flex';
        }

        startRecordingSession(true);
        
        if(typeof switchView === 'function') switchView('dashboard');
        if(typeof showToast === 'function') showToast(`Jatketaan ajoa! Matka: ${totalDistance.toFixed(1)} km.`);

    } catch (e) {
        console.error("Virhe ajon jatkamisessa:", e);
        alert("Virhe ajon jatkamisessa: " + e.message);
    }
};

// TAUKO
if (btnPause) {
    btnPause.addEventListener('click', () => {
        isPaused = true;
        pauseStartTime = new Date();
        clearInterval(timerInterval);
        btnPause.style.display = 'none';
        btnResume.style.display = 'inline-block';
        if(statusEl) {
            statusEl.innerText = "⏸ TAUKO";
            statusEl.style.color = "#fbc02d";
        }
        saveCrashData(); // Tallenna tila myös tauolla
    });
}

// JATKA (Tauolta)
if (btnResume) {
    btnResume.addEventListener('click', () => {
        isPaused = false;
        const now = new Date();
        const pauseDuration = (now - pauseStartTime);
        
        // Lisätään tauko globaaliin ja nykyiseen sessioon
        totalPauseTime += pauseDuration;
        sessionPauseTime += pauseDuration;

        btnResume.style.display = 'none';
        btnPause.style.display = 'inline-block';
        if(statusEl) {
            statusEl.innerText = currentDriveId ? "🔴 JATKETAAN AJOA" : "🔴 TALLENNETAAN";
            statusEl.style.color = "#ff4444";
        }
        timerInterval = setInterval(updateTimer, 1000);
    });
}

// LOPETA
if (btnStopRec) {
    btnStopRec.addEventListener('click', () => {
        if (!isRecording) return;
        clearInterval(timerInterval);
        window.removeEventListener('devicemotion', handleMotion);
        
        // Jos lopetetaan tauolta, lisätään tauko laskuriin
        if (isPaused && pauseStartTime) {
            const pauseLen = (new Date() - pauseStartTime);
            totalPauseTime += pauseLen;
            sessionPauseTime += pauseLen;
        }

        const endTime = new Date();
        
        // KOKONAISLASKENTA
        const activeDurationMs = (endTime - startTime) - totalPauseTime;
        const durationHours = activeDurationMs / (1000 * 60 * 60);
        let avgSpeed = durationHours > 0 ? (totalDistance / durationHours) : 0;

        // OSIOLASKENTA (New Segment)
        const segmentDist = totalDistance - sessionStartDistance;
        const segmentDurationMs = (endTime - sessionStartTime) - sessionPauseTime;
        
        // Luodaan uusi osio-objekti
        // Varmistetaan, ettei luoda "tyhjää" osiota
        if (segmentDurationMs > 1000 || segmentDist > 0.01) {
            const newSession = {
                startTime: sessionStartTime.toISOString(),
                endTime: endTime.toISOString(),
                dist: segmentDist.toFixed(2),
                durationMs: segmentDurationMs,
                startAddr: sessionStartAddress || "",   // LISÄTTY: Pätkän aloitus
                endAddr: currentAddress || ""           // LISÄTTY: Pätkän lopetus
            };
            existingSessions.push(newSession);
        }

        let styleLabel = "";
        if (currentCarType !== 'bike' && currentCarType !== 'walking') {
            styleLabel = "Tasainen";
            if (aggressiveEvents > 5) styleLabel = "Reipas";
            if (aggressiveEvents > 15) styleLabel = "Aggressiivinen";
        }

        let selectedCarName = "Muu ajoneuvo";
        let selectedCarIcon = "🚗";
        if (currentCarId !== 'all' && currentCarId !== 'all_archived') {
            const c = userCars.find(x => x.id === currentCarId);
            if(c) {
                selectedCarName = c.name;
                selectedCarIcon = c.icon || (c.type === 'bike' ? "🚲" : "🚗");
                if (c.type === 'walking' && (!c.icon || c.icon === '🚗')) selectedCarIcon = "🚶";
            }
        }

        tempDriveData = {
            type: 'end_drive',
            startTime: startTime.toISOString(),
            endTime: endTime.toISOString(),
            distanceKm: totalDistance.toFixed(2),
            maxSpeed: maxSpeed.toFixed(1),
            avgSpeed: avgSpeed.toFixed(1),
            durationMs: activeDurationMs,
            subject: "", 
            weather: currentDriveWeather,
            drivingStyle: styleLabel,
            carName: selectedCarName,
            carIcon: selectedCarIcon, 
            carId: currentCarId,
            carType: currentCarType,
            route: routePath,
            markers: driveMarkers,
            // OSOITTEET
            startAddress: startAddressSnapshot,
            endAddress: currentAddress,
            // SUB-TRIPS (LISÄTTY)
            sessions: existingSessions
        };

        const mins = Math.floor(activeDurationMs / 60000);
        if(modalDistEl) modalDistEl.innerText = totalDistance.toFixed(2) + " km";
        if(modalTimeEl) modalTimeEl.innerText = mins + " min";
        
        if(modalSubjectEl) modalSubjectEl.value = ""; 
        if(modalCarNameEl) modalCarNameEl.innerText = selectedCarName; 

        if(saveModal) saveModal.style.display = 'flex';
        if(liveStatusBar) liveStatusBar.style.opacity = '0';
    });
}

// MODAL NAPIT
if (btnModalSave) {
    btnModalSave.addEventListener('click', () => {
        if (tempDriveData) {
            tempDriveData.subject = modalSubjectEl ? modalSubjectEl.value : "";
            
            const typeRadios = document.getElementsByName('save-type');
            let selectedType = 'private';
            for (const radio of typeRadios) {
                if (radio.checked) {
                    selectedType = radio.value;
                    break;
                }
            }
            tempDriveData.driveType = selectedType;

            saveToFirebase(tempDriveData);
        }
        if(saveModal) saveModal.style.display = 'none';
        resetRecordingUI();
    });
}

if (btnModalCancel) {
    btnModalCancel.addEventListener('click', () => {
        if(typeof openConfirmModal === 'function') {
            openConfirmModal("Hylkää ajo?", "Haluatko varmasti hylätä tämän ajon? Tietoja ei tallenneta.", () => {
                if(saveModal) saveModal.style.display = 'none';
                resetRecordingUI();
            });
        } else {
            if(confirm("Haluatko varmasti hylätä tämän ajon?")) {
                if(saveModal) saveModal.style.display = 'none';
                resetRecordingUI();
            }
        }
    });
}

// 2. GPS LOGIIKKA

function startGPS() {
    isGPSActive = true;
    requestWakeLock();
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true, timeout: 5000, maximumAge: 0
        });
    }
}

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    const alt = position.coords.altitude || 0;
    const heading = position.coords.heading;
    const acc = position.coords.accuracy;
    if (typeof acc === 'number' && isFinite(acc) && acc > 0) lastGpsAccuracyM = acc;

    const speedMs = position.coords.speed || 0;
    let rawSpeedKmh = speedMs * 3.6;
    if (rawSpeedKmh < 1.0) rawSpeedKmh = 0;

    const prevLatLng = lastLatLng ? { lat: lastLatLng.lat, lng: lastLatLng.lng } : null;
    let derivedHeading = null;
    if (prevLatLng && (prevLatLng.lat !== lat || prevLatLng.lng !== lng)) {
        derivedHeading = calculateBearing(prevLatLng.lat, prevLatLng.lng, lat, lng);
    }
    let speedKmh = smoothSpeedKmh(rawSpeedKmh, lastGpsAccuracyM);
    if (speedKmh < 0.6) speedKmh = 0;
    const headingFiltered = smoothHeadingDeg(heading, derivedHeading, speedKmh, lastGpsAccuracyM);

    let currentAvg = 0;

    const now = Date.now();
    if (now - lastAddressFetchTime > 30000 && speedKmh > 2) {
        fetchAddress(lat, lng);
        lastAddressFetchTime = now;
    }

    requestRoadSpeedLimit(lat, lng, headingFiltered, speedKmh);

    if (currentDriveWeather === "") fetchWeather(lat, lng);

    if (isRecording && !isPaused) {
        if (speedKmh > maxSpeed) maxSpeed = speedKmh;
        if (lastLatLng) {
            const dist = getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng);
            if ((speedKmh > 3 || dist > 0.02) && dist < 50.0) totalDistance += dist;
        }
        
        if (speedKmh > 3 || (lastLatLng && getDistanceFromLatLonInKm(lastLatLng.lat, lastLatLng.lng, lat, lng) > 0.02)) {
            routePath.push({ lat: lat, lng: lng, spd: speedKmh });
            if(realTimePolyline) realTimePolyline.addLatLng([lat, lng]);
        }

        if (startTime) {
            const now = new Date();
            const activeTimeMs = (now - startTime) - totalPauseTime;
            const durationHrs = activeTimeMs / (1000 * 60 * 60);
            if (durationHrs > 0) currentAvg = totalDistance / durationHrs;
        }

        saveCrashData();

        // UUSI V6.14: Päivitä visuaaliset elementit
        if (typeof updateSpeedometer === 'function') {
            updateSpeedometer(speedKmh, alt);
        }
        
        if (typeof updateGraphs === 'function') {
            // G-voiman laskenta (jos anturit saatavilla)
            let gx = 0, gy = 0;
            if (window.motionData) {
                gx = window.motionData.x || 0;
                gy = window.motionData.y || 0;
            }
            updateGraphs(speedKmh, alt, Math.sqrt(gx * gx + gy * gy));
        }
        
        if (typeof updateGIndicator === 'function' && window.motionData) {
            updateGIndicator(window.motionData.x || 0, window.motionData.y || 0);
        }
    }
    
    if (!lastLatLng || speedKmh > 0 || isGPSActive) {
        lastLatLng = { lat, lng };
        const newLatLng = new L.LatLng(lat, lng);
        if(marker) marker.setLatLng(newLatLng);
        
        if (views.map && views.map.style.display !== 'none' && !isViewingHistory && map) {
            let targetZoom = 18; 
            if (currentCarType === 'bike' || currentCarType === 'walking') {
                if (speedKmh > 15) targetZoom = 17; else targetZoom = 19; 
            } else {
                if (speedKmh > 100) targetZoom = 14; 
                else if (speedKmh > 70) targetZoom = 16;
                else if (speedKmh > 40) targetZoom = 17;
                else targetZoom = 18;
            }
            if (map.getZoom() !== targetZoom) map.setView(newLatLng, targetZoom);
            else map.panTo(newLatLng);
        }
        if(mapSpeedEl) mapSpeedEl.innerText = speedKmh.toFixed(1);
        if(mapCoordsEl) mapCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
        if (typeof window.updateDashboardMiniMap === 'function') {
            window.updateDashboardMiniMap(lat, lng, `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`);
        }
    }

    if(typeof updateDashboardUI === 'function') {
        updateDashboardUI(speedKmh, maxSpeed, totalDistance, null, alt, currentAvg);
    }
    if (typeof window.updateDashboardSpeedLimit === 'function') {
        window.updateDashboardSpeedLimit(getRoadSpeedLimitSnapshot());
    }
    
    if(dashCoordsEl) dashCoordsEl.innerText = `${toGeocacheFormat(lat, true)} ${toGeocacheFormat(lng, false)}`;
    
    if (headingFiltered !== null && !isNaN(headingFiltered)) {
        if(dashHeadingEl) dashHeadingEl.innerText = `${Math.round(headingFiltered)}°`;
        if(compassArrowEl) compassArrowEl.style.transform = `rotate(${headingFiltered}deg)`;
    }

    if (isGPSActive && wakeLock === null) requestWakeLock();

    // =========================================================
    // POI VAROITUKSET (Lähestyessä)
    // =========================================================
    if (currentUser && Array.isArray(poiData) && poiData.length > 0) {
        try {
            checkPoiAlerts(lat, lng, headingFiltered, speedKmh, prevLatLng);
        } catch (e) {
            // Ei kaadeta GPS-loopia
        }
    }
}

function checkPoiAlerts(lat, lng, heading, speedKmh, prevLatLng) {
    const now = Date.now();

    // 1) Jos meillä on aktiivinen varoitus, pidetään se kunnes se ei enää kelpaa
    if (activePoiAlert && activePoiAlert.id) {
        const existing = poiData.find(p => p && p.id === activePoiAlert.id);
        const ok = existing && poiQualifies(existing, lat, lng, heading, speedKmh, prevLatLng);
        if (ok) {
            updateActivePoiToast(existing, lat, lng, now);
            return;
        } else {
            setPoiRearmLock(activePoiAlert.id);
            activePoiAlert = null;
            if (typeof hidePersistentToast === 'function') hidePersistentToast();
        }
    }

    // 2) Ei aktiivista tai se ei kelvannut -> etsitään paras osuma
    let best = null;
    let bestDistM = Infinity;

    for (const poi of poiData) {
        if (!poi || !poi.id) continue;

        const poiLat = (typeof poi.lat === 'number') ? poi.lat : parseFloat(poi.lat);
        const poiLng = (typeof poi.lng === 'number') ? poi.lng : parseFloat(poi.lng);
        if (!isFinite(poiLat) || !isFinite(poiLng)) continue;

        const rearmDistM = getPoiRearmDistanceM();
        const currDistM = getDistanceFromLatLonInKm(lat, lng, poiLat, poiLng) * 1000;
        if (poiRearmLocks[poi.id]) {
            if (currDistM < rearmDistM) {
                poiDebug(`POI ei kelpaa (re-arm ${Math.round(currDistM)}m < ${rearmDistM}m): ${getPoiLabel(poi)}`);
                continue;
            }
            clearPoiRearmLock(poi.id);
        }

        if (!poiQualifies(poi, lat, lng, heading, speedKmh, prevLatLng)) continue;

        const distM = currDistM;
        if (distM < bestDistM) {
            best = poi;
            bestDistM = distM;
        }
    }

    if (best) {
        clearPoiRearmLock(best.id);
        activePoiAlert = { id: best.id, startedAt: now, lastShownAt: 0, minDistM: null, lastDistM: null };
        updateActivePoiToast(best, lat, lng, now);
    } else {
        if (typeof hidePersistentToast === 'function') hidePersistentToast();
    }
}

function poiDebug(msg) {
    try {
        const enabled = String(localStorage.getItem('poiDebug') || '').toLowerCase();
        if (!(enabled === '1' || enabled === 'true' || enabled === 'on')) return;

        const text = String(msg || '');
        console.log('[POI]', text);

        if (typeof window.appendPoiDebugLog === 'function') {
            window.appendPoiDebugLog(text);
        }

        // Kevyt throttlaus toastille, mutta lokiin lisätään aina
        const last = parseInt(localStorage.getItem('poiDebugLast') || '0', 10) || 0;
        const now = Date.now();
        if (now - last < 2500) return;
        localStorage.setItem('poiDebugLast', String(now));
        if (typeof showToast === 'function') showToast(text);
    } catch (e) {
        // ignore
    }
}

function poiQualifies(poi, lat, lng, heading, speedKmh, prevLatLng) {
    const alertEnabled = (poi.alertEnabled === true || poi.alertEnabled === 1 || poi.alertEnabled === '1' || String(poi.alertEnabled).toLowerCase() === 'true');
    if (!alertEnabled) {
        poiDebug(`POI ei kelpaa (alertEnabled off): ${getPoiLabel(poi)}`);
        return false;
    }

    const poiType = String(poi.type || 'other').trim().toLowerCase();

    // Nopeuskamerat pois käytöstä kävely- ja pyörätilassa
    if (poiType === 'speedcamera' && (currentCarType === 'walking' || currentCarType === 'bike')) {
        poiDebug(`Nopeuskamera ei kelpaa (kulkutyyppi ${currentCarType})`);
        return false;
    }

    const poiLat = (typeof poi.lat === 'number') ? poi.lat : parseFloat(poi.lat);
    const poiLng = (typeof poi.lng === 'number') ? poi.lng : parseFloat(poi.lng);
    if (!isFinite(poiLat) || !isFinite(poiLng)) {
        poiDebug(`POI ei kelpaa (koordinaatit virhe): ${getPoiLabel(poi)}`);
        return false;
    }

    const baseRadiusM = Math.max(30, parseInt(poi.alertRadiusM || 350, 10));
    const radiusM = getPoiEffectiveRadiusM(poiType, baseRadiusM, speedKmh);
    const distM = getDistanceFromLatLonInKm(lat, lng, poiLat, poiLng) * 1000;
    let segMinDistM = Infinity;
    let prevDistM = Infinity;
    if (prevLatLng && typeof prevLatLng.lat === 'number' && typeof prevLatLng.lng === 'number') {
        prevDistM = getDistanceFromLatLonInKm(prevLatLng.lat, prevLatLng.lng, poiLat, poiLng) * 1000;
        segMinDistM = pointToSegmentDistanceMeters(prevLatLng.lat, prevLatLng.lng, lat, lng, poiLat, poiLng);
    }
    const bestDistM = Math.min(distM, prevDistM, segMinDistM);
    if (bestDistM > radiusM) {
        // Debuggaus: älä spämmää "säde"-hylkäystä kilometrien päästä, se on harhaanjohtavaa.
        // Näytetään vain jos ollaan kohtuullisen lähellä POI:ta.
        if (bestDistM <= Math.max(800, radiusM * 3)) {
            poiDebug(`POI ei kelpaa (säde): ${getPoiLabel(poi)} cur ${Math.round(distM)}m, prev ${isFinite(prevDistM)?Math.round(prevDistM):'-'}m, seg ${isFinite(segMinDistM)?Math.round(segMinDistM):'-'}m > ${radiusM}m`);
        }
        return false;
    }

    // Näytetään varoitus vain lähestyessä (ei kun etäännytään POI:sta).
    // Lisätään pieni hystereesi GPS-jitteriin.
    if (isFinite(prevDistM) && (typeof speedKmh === 'number') && speedKmh > 5) {
        if (distM > prevDistM + 8) {
            poiDebug(`POI ei kelpaa (loittoneminen): ${getPoiLabel(poi)} prev ${Math.round(prevDistM)}m -> cur ${Math.round(distM)}m`);
            return false;
        }
    }

    let headingDiff = null;

    // Nopeuskamera: suunnan mukaan, jos heading on saatavilla
    // HUOM: heading on monilla laitteilla epäluotettava hitaassa vauhdissa, joten käytetään suodatusta vain liikkeessä.
    const sensitivityCfg = getPoiSensitivityConfig();
    const useHeading = (typeof speedKmh === 'number' && speedKmh >= 20);
    if ((poiType === 'speedcamera') && useHeading && (heading !== null) && (!isNaN(heading))) {
        const bearingToPoi = calculateBearing(lat, lng, poiLat, poiLng);
        headingDiff = angularDiffDeg(heading, bearingToPoi);
        if (headingDiff > sensitivityCfg.headingRejectDeg) {
            poiDebug(`Nopeuskamera ei kelpaa (suunta): diff ${Math.round(headingDiff)}° > ${sensitivityCfg.headingRejectDeg}° (head ${Math.round(heading)}°)`);
            return false;
        }
    } else if (poiType === 'speedcamera' && !useHeading) {
        // Heading suodatus pois päältä hitaassa vauhdissa
        poiDebug(`Nopeuskamera: heading-suodatus OFF (spd ${Math.round(speedKmh || 0)} km/h)`);
    }

    const confidence = getPoiConfidenceScore({
        radiusM,
        distM,
        prevDistM,
        segMinDistM,
        poiType,
        speedKmh,
        accM: lastGpsAccuracyM,
        headingDiffDeg: headingDiff
    });
    const confidenceThreshold = (poiType === 'speedcamera') ? sensitivityCfg.speedcameraConfidence : sensitivityCfg.otherConfidence;
    const veryCloseBy = bestDistM <= Math.max(20, radiusM * 0.35);
    if (!veryCloseBy && confidence < confidenceThreshold) {
        poiDebug(`POI ei kelpaa (confidence ${confidence.toFixed(2)} < ${confidenceThreshold.toFixed(2)}): ${getPoiLabel(poi)} d=${Math.round(distM)}m acc=${Math.round(lastGpsAccuracyM || 0)}m`);
        return false;
    }

    return true;
}

window.runPoiRegressionTests = function() {
    const results = [];
    const originalPoiData = poiData;
    const originalActivePoiAlert = activePoiAlert;
    const originalPoiAlertState = poiAlertState;
    const originalCurrentUser = currentUser;
    const originalShowPersistentToast = window.showPersistentToast;
    const originalHidePersistentToast = window.hidePersistentToast;
    const originalPlayPoiAlertBeep = window.playPoiAlertBeep;

    const setResult = (name, ok, details) => {
        results.push({ name, ok: !!ok, details: String(details || '') });
    };

    try {
        currentUser = currentUser || { uid: '__poi_test__' };
        window.playPoiAlertBeep = () => {};

        let hideCount = 0;
        window.showPersistentToast = () => {};
        window.hidePersistentToast = () => { hideCount += 1; };

        const testPoi = {
            id: 'test-speedcam-1',
            type: 'speedcamera',
            name: 'Test cam',
            lat: 60.0,
            lng: 25.0,
            alertEnabled: true,
            alertRadiusM: 70,
            cooldownSec: 0,
            beepEnabled: false
        };
        poiData = [testPoi];

        // CASE 1: Harvat GPS-pisteet, mutta segmentti ohittaa POI:n säteen -> pitää hälyttää.
        activePoiAlert = null;
        poiAlertState = {};
        hideCount = 0;
        let prev = null;
        const sparseCrossing = [
            { lat: 60.0, lng: 24.9975, heading: 90, speedKmh: 55 },
            { lat: 60.0, lng: 25.0025, heading: 90, speedKmh: 58 }
        ];
        for (const pt of sparseCrossing) {
            checkPoiAlerts(pt.lat, pt.lng, pt.heading, pt.speedKmh, prev);
            prev = { lat: pt.lat, lng: pt.lng };
        }
        setResult('segment-crossing-triggers', !!(activePoiAlert && activePoiAlert.id === testPoi.id), `active=${activePoiAlert ? activePoiAlert.id : 'none'}`);

        // CASE 2: Hälytys poistuu kun liikutaan pois päin säteeltä.
        activePoiAlert = null;
        poiAlertState = {};
        hideCount = 0;
        prev = null;
        const approachThenAway = [
            { lat: 60.0, lng: 24.9995, heading: 90, speedKmh: 45 },
            { lat: 60.0, lng: 24.9999, heading: 90, speedKmh: 42 },
            { lat: 60.0, lng: 25.0007, heading: 90, speedKmh: 45 },
            { lat: 60.0, lng: 25.0017, heading: 90, speedKmh: 48 }
        ];
        for (const pt of approachThenAway) {
            checkPoiAlerts(pt.lat, pt.lng, pt.heading, pt.speedKmh, prev);
            prev = { lat: pt.lat, lng: pt.lng };
        }
        setResult('moving-away-hides-alert', hideCount > 0 || activePoiAlert === null, `hideCount=${hideCount}, active=${activePoiAlert ? activePoiAlert.id : 'none'}`);

        // CASE 3: Väärä suunta nopeasti -> nopeuskamera ei kelpaa.
        const wrongDir = poiQualifies(
            testPoi,
            60.0,
            24.9997,
            270,
            80,
            { lat: 60.0, lng: 24.9994 }
        );
        setResult('speedcamera-wrong-direction-rejected', wrongDir === false, `qualifies=${wrongDir}`);
    } catch (e) {
        setResult('runner-exception', false, e && e.message ? e.message : String(e));
    } finally {
        poiData = originalPoiData;
        activePoiAlert = originalActivePoiAlert;
        poiAlertState = originalPoiAlertState;
        currentUser = originalCurrentUser;
        window.showPersistentToast = originalShowPersistentToast;
        window.hidePersistentToast = originalHidePersistentToast;
        window.playPoiAlertBeep = originalPlayPoiAlertBeep;
    }

    const passed = results.filter(r => r.ok).length;
    const total = results.length;
    const summary = `POI regression: ${passed}/${total} passed`;
    if (typeof window.appendPoiDebugLog === 'function') {
        window.appendPoiDebugLog(summary);
        results.forEach(r => {
            window.appendPoiDebugLog(`${r.ok ? '✅' : '❌'} ${r.name} - ${r.details}`);
        });
    }
    console.log(summary, results);
    return { summary, results };
}

function getPoiLabel(poi) {
    const type = String(poi.type || 'other').trim().toLowerCase();
    if (poi.name && String(poi.name).trim()) return String(poi.name).trim();
    if (type === 'speedcamera') return 'Nopeuskamera';
    if (type === 'danger') return 'Vaara';
    if (type === 'customer') return 'Asiakas';
    if (type === 'reminder') return 'Muistutus';
    return 'POI';
}

function updateActivePoiToast(poi, lat, lng, now) {
    const poiType = String(poi.type || 'other').trim().toLowerCase();
    const speedKmhNow = Math.max(0, Number(gpsFilterState.speedKmh) || 0);
    const baseRadiusM = Math.max(30, parseInt(poi.alertRadiusM || 350, 10));
    const radiusM = getPoiEffectiveRadiusM(poiType, baseRadiusM, speedKmhNow);
    const cooldownSec = Math.max(0, parseInt(poi.cooldownSec || 180, 10));

    const poiLat = (typeof poi.lat === 'number') ? poi.lat : parseFloat(poi.lat);
    const poiLng = (typeof poi.lng === 'number') ? poi.lng : parseFloat(poi.lng);
    if (!isFinite(poiLat) || !isFinite(poiLng)) return;

    const distM = Math.max(0, getDistanceFromLatLonInKm(lat, lng, poiLat, poiLng) * 1000);

    // Jos poistuttiin säteeltä, piilotetaan heti (ei jää roikkumaan).
    if (distM > radiusM) {
        if (activePoiAlert && activePoiAlert.id) setPoiRearmLock(activePoiAlert.id);
        activePoiAlert = null;
        if (typeof hidePersistentToast === 'function') hidePersistentToast();
        return;
    }

    // Lähestyminen-only aktiiviselle hälytykselle: kun etäisyys alkaa kasvaa selvästi
    // lähimmän pisteen jälkeen, suljetaan toast heti.
    if (activePoiAlert) {
        const prevMin = (typeof activePoiAlert.minDistM === 'number') ? activePoiAlert.minDistM : null;
        const prevLast = (typeof activePoiAlert.lastDistM === 'number') ? activePoiAlert.lastDistM : null;
        if (prevMin === null || distM < prevMin) activePoiAlert.minDistM = distM;

        const minDist = (typeof activePoiAlert.minDistM === 'number') ? activePoiAlert.minDistM : distM;
        const movingAway = (prevLast !== null) && (distM > prevLast + 6) && (distM > minDist + 12);
        activePoiAlert.lastDistM = distM;

        if (movingAway) {
            if (activePoiAlert && activePoiAlert.id) setPoiRearmLock(activePoiAlert.id);
            activePoiAlert = null;
            if (typeof hidePersistentToast === 'function') hidePersistentToast();
            return;
        }
    }

    // HUOM: Speedcamera-spesifi "näytä vain kun matka pienenee" -heuristiikka poistettu toistaiseksi,
    // koska se voi estää hälytyksen kokonaan joillain laitteilla (GPS/heading jitter).
    // Nyt hälytys toimii kuten muut POI:t: näkyy säteen sisällä ja katoaa kun poistutaan säteeltä.

    // Päivitetään näyttö max ~1x/sek (säästää vähän)
    if (activePoiAlert && activePoiAlert.lastShownAt && (now - activePoiAlert.lastShownAt) < 800) {
        return;
    }
    if (activePoiAlert) activePoiAlert.lastShownAt = now;

    const label = getPoiLabel(poi);
    const meters = Math.round(distM);
    if (typeof showPersistentToast === 'function') {
        showPersistentToast(`📍 ${label}: ${meters} m`);
    } else if (typeof showToast === 'function') {
        showToast(`📍 ${label}: ${meters} m`);
    }

    // Värinä + "hälytys" vain cooldownin mukaan (ei joka päivitys)
    const lastTs = poiAlertState[poi.id] || 0;
    if (cooldownSec === 0 || !lastTs || (now - lastTs) >= cooldownSec * 1000) {
        poiAlertState[poi.id] = now;
        if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
        if (poi.beepEnabled !== false && typeof window.playPoiAlertBeep === 'function') window.playPoiAlertBeep(poiType, poi.soundProfile || '');
    }

    // Kun ollaan käytännössä perillä, voidaan piilottaa varoitus
    if (meters <= 0) {
        if (activePoiAlert && activePoiAlert.id) setPoiRearmLock(activePoiAlert.id);
        activePoiAlert = null;
        if (typeof hidePersistentToast === 'function') hidePersistentToast();
    }
}

// =========================================================
// KOORDINAATTIAPU: GEOKÄTKÖILY-MUOTO -> desimaaliasteet
// Esim: "N 60° 10.123 E 024° 56.789"
// =========================================================

window.parseGeocacheCoordinates = function(input) {
    if (!input || typeof input !== 'string') return null;
    const s = input.trim().replace(/\s+/g, ' ');

    // Yritetään erottaa N/S ja E/W -osat
    // Etsitään ensin N/S ja E/W kirjain
    const nsMatch = s.match(/([NS])\s*([0-9]{1,2})\s*[°º]?\s*([0-9]{1,2}(?:\.[0-9]+)?)\s*['’]?/i);
    const ewMatch = s.match(/([EW])\s*([0-9]{1,3})\s*[°º]?\s*([0-9]{1,2}(?:\.[0-9]+)?)\s*['’]?/i);

    if (!nsMatch || !ewMatch) return null;

    const ns = nsMatch[1].toUpperCase();
    const latDeg = parseInt(nsMatch[2], 10);
    const latMin = parseFloat(nsMatch[3]);

    const ew = ewMatch[1].toUpperCase();
    const lngDeg = parseInt(ewMatch[2], 10);
    const lngMin = parseFloat(ewMatch[3]);

    if (isNaN(latDeg) || isNaN(latMin) || isNaN(lngDeg) || isNaN(lngMin)) return null;
    if (latMin >= 60 || lngMin >= 60) return null;

    let lat = latDeg + (latMin / 60);
    let lng = lngDeg + (lngMin / 60);
    if (ns === 'S') lat = -lat;
    if (ew === 'W') lng = -lng;

    // Perusvalidointi
    if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;

    return { lat, lng };
}

function stopGPSAndRec() {
    isRecording = false;
    isPaused = false;
    clearInterval(timerInterval);
    isGPSActive = false;
    if(watchId) navigator.geolocation.clearWatch(watchId);
    window.removeEventListener('devicemotion', handleMotion);
    
    if(silentAudio) {
        silentAudio.pause();
        silentAudio.currentTime = 0;
    }
}

// APUFUNKTIO: Liikeanturien aktivointi
function activateMotionSensors() {
    if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(response => {
            if (response === 'granted') {
                window.addEventListener('devicemotion', handleMotion);
            }
        }).catch(console.error);
    } else {
        window.addEventListener('devicemotion', handleMotion);
    }
}

function handleMotion(event) {
    if (!isRecording || isPaused) return;
    
    const acc = event.acceleration; 
    const accG = event.accelerationIncludingGravity; 
    
    if (!acc) return;

    if(gBubbleEl && accG) {
        let x = -acc.x * 5; 
        let y = acc.z * 5; 

        const maxDist = 25;
        const dist = Math.sqrt(x*x + y*y);
        if (dist > maxDist) {
            x = (x / dist) * maxDist;
            y = (y / dist) * maxDist;
        }
        
        gBubbleEl.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    }

    if (currentCarType === 'bike' || currentCarType === 'walking') return;
    
    const now = Date.now();
    if (now - lastMotionTime < 500) return; 
    lastMotionTime = now;
    
    const magnitude = Math.sqrt(acc.x*acc.x + acc.y*acc.y + acc.z*acc.z);
    if (magnitude > 3.5) {
        aggressiveEvents++;
        if(liveStyleEl) {
            liveStyleEl.innerText = "Kiihdytys!";
            liveStyleEl.className = "style-badge style-red";
        }
        if(dashSpeedEl) dashSpeedEl.style.color = "#ff1744";
        
        if (styleResetTimer) clearTimeout(styleResetTimer);
        styleResetTimer = setTimeout(() => {
            if(liveStyleEl) {
                liveStyleEl.innerText = "Taloudellinen";
                liveStyleEl.className = "style-badge style-green";
            }
            if(dashSpeedEl) dashSpeedEl.style.color = "var(--speed-color)";
        }, 3000);
    }
}

function resetRecordingUI() {
    isRecording = false;
    isPaused = false;
    tempDriveData = null;
    routePath = [];
    driveMarkers = [];
    if(realTimePolyline) realTimePolyline.setLatLngs([]);
    currentDriveId = null; 
    
    clearCrashData(); 

    const startContainer = document.getElementById('start-buttons-container');
    if(startContainer) startContainer.style.display = 'flex';
    else if(btnStartRec) btnStartRec.style.display = 'inline-block';

    if(activeRecBtns) activeRecBtns.style.display = 'none';
    if(statusEl) {
        statusEl.innerText = "GPS Päällä";
        statusEl.style.color = "var(--subtext-color)";
    }
    if(typeof updateDashboardUI === 'function') updateDashboardUI(0, 0, 0, 0, 0, 0);
    resetRoadSpeedLimitState();
    if (typeof window.updateDashboardSpeedLimit === 'function') {
        window.updateDashboardSpeedLimit(null);
    }
    if(dashTimeEl) dashTimeEl.innerText = "00:00";
    if(liveStatusBar) liveStatusBar.style.opacity = '0'; 
    if(dashAddressEl) dashAddressEl.innerText = "Odottaa sijaintia...";
    
    // Nollataan sessiot
    existingSessions = [];
    sessionStartDistance = 0;
    sessionStartAddress = "";
    
    if(silentAudio) {
        silentAudio.pause();
        silentAudio.currentTime = 0;
    }
}

// 3. APUFUNKTIOT

function updateTimer() {
    if (!startTime) return;
    const now = new Date();
    const diff = now - startTime - totalPauseTime;
    
    const mins = Math.floor((diff % 3600000) / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    const hrs = Math.floor(diff / 3600000);
    if(dashTimeEl) dashTimeEl.innerText = (hrs>0?hrs+":":"") + (mins<10?"0":"")+mins + ":" + (secs<10?"0":"")+secs;
}

function fetchWeather(lat, lon) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code&wind_speed_unit=ms`;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            if (data.current) {
                const temp = Math.round(data.current.temperature_2m);
                const code = data.current.weather_code;
                let emoji = "☁️";
                if (code === 0) emoji = "☀️";
                else if (code <= 3) emoji = "⛅";
                else if (code <= 48) emoji = "🌫";
                else if (code <= 67) emoji = "🌧";
                else if (code <= 77) emoji = "❄️";
                else if (code <= 82) emoji = "🌧";
                else if (code <= 86) emoji = "❄️";
                else emoji = "⛈";
                
                currentDriveWeather = `${emoji} ${temp}°C`;
                if(dashWeatherEl) dashWeatherEl.innerText = currentDriveWeather;
            }
        })
        .catch(e => console.error(e));
}

function fetchAddress(lat, lon) {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
    fetch(url, { headers: { 'User-Agent': 'AjopaivakirjaPro/5.7' } })
        .then(res => res.json())
        .then(data => {
            if (data && data.address) {
                const road = data.address.road || "";
                const number = data.address.house_number || "";
                const city = data.address.city || data.address.town || data.address.village || "";
                if (road) {
                    currentAddress = `${road} ${number}, ${city}`;
                    if(dashAddressEl) dashAddressEl.innerText = currentAddress;
                }
            }
        })
        .catch(e => console.log("Osoitehaku ei onnistunut:", e));
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = (lat2-lat1)*(Math.PI/180);
  const dLon = (lon2-lon1)*(Math.PI/180);
  const a = Math.sin(dLat/2)*Math.sin(dLat/2) +
            Math.cos(lat1*(Math.PI/180))*Math.cos(lat2*(Math.PI/180)) *
            Math.sin(dLon/2)*Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c; 
}

function calculateBearing(lat1, lon1, lat2, lon2) {
    const toRad = (d) => d * (Math.PI / 180);
    const toDeg = (r) => r * (180 / Math.PI);
    const φ1 = toRad(lat1);
    const φ2 = toRad(lat2);
    const Δλ = toRad(lon2 - lon1);
    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    return (toDeg(θ) + 360) % 360;
}

function angularDiffDeg(a, b) {
    const da = ((a - b) % 360 + 360) % 360;
    return da > 180 ? 360 - da : da;
}

function pointToSegmentDistanceMeters(lat1, lon1, lat2, lon2, plat, plon) {
    const R = 6371000;
    const toRad = (d) => d * (Math.PI / 180);
    const φm = toRad((lat1 + lat2 + plat) / 3);
    const x1 = toRad(lon1) * Math.cos(φm) * R;
    const y1 = toRad(lat1) * R;
    const x2 = toRad(lon2) * Math.cos(φm) * R;
    const y2 = toRad(lat2) * R;
    const xp = toRad(plon) * Math.cos(φm) * R;
    const yp = toRad(plat) * R;

    const dx = x2 - x1;
    const dy = y2 - y1;
    const len2 = dx * dx + dy * dy;
    if (!isFinite(len2) || len2 <= 0) {
        const ddx = xp - x1;
        const ddy = yp - y1;
        return Math.sqrt(ddx * ddx + ddy * ddy);
    }
    let t = ((xp - x1) * dx + (yp - y1) * dy) / len2;
    if (t < 0) t = 0;
    if (t > 1) t = 1;
    const xc = x1 + t * dx;
    const yc = y1 + t * dy;
    const ddx = xp - xc;
    const ddy = yp - yc;
    return Math.sqrt(ddx * ddx + ddy * ddy);
}

function toGeocacheFormat(deg, isLat) {
    const d = Math.floor(Math.abs(deg));
    const m = (Math.abs(deg)-d)*60;
    return `${isLat?(deg>=0?"N":"S"):(deg>=0?"E":"W")} ${d}° ${m.toFixed(3)}`;
}

function getCardinalDirection(angle) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(angle / 45) % 8];
}

function handleError(e) { 
    if(statusEl) statusEl.innerText = "GPS Virhe: " + e.message; 
}

// TALLENNUSLOGIIKKA (PÄIVITETTY v6.05)
function saveToFirebase(data) {
    if (currentUser) {
        // Jos history.js on ladattu ja funktio löytyy, käytä sitä
        if (typeof window.saveDriveSafely === 'function') {
            window.saveDriveSafely(data, currentDriveId).then(() => {
                console.log("Safe save initiated (New or Update)");
            });
        } else {
            // Fallback vanhaan
            db.ref('ajopaivakirja/' + currentUser.uid).push().set(data)
                .then(() => { 
                    if(typeof showToast === 'function') {
                        showToast("Ajo tallennettu onnistuneesti! 🏁");
                    }
                })
                .catch((error) => { alert("VIRHE: " + error.message); });
        }
    } else {
        alert("Virhe: Et ole kirjautunut sisään!");
    }
}

document.addEventListener('visibilitychange', async () => {
    if (document.visibilityState === 'visible' && isGPSActive) requestWakeLock();
});

async function requestWakeLock() {
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {}
}

// =========================================================
// 4. CRASH RECOVERY LOGIIKKA (PÄIVITETTY v6.12 SESSION SUPPORT)
// =========================================================

function saveCrashData() {
    if (!isRecording) return;
    const crashData = {
        startTime: startTime ? startTime.toISOString() : null,
        totalPauseTime: totalPauseTime,
        maxSpeed: maxSpeed,
        totalDistance: totalDistance,
        routePath: routePath,
        driveMarkers: driveMarkers,
        aggressiveEvents: aggressiveEvents,
        currentCarId: currentCarId,
        currentCarType: currentCarType,
        isPaused: isPaused,
        pauseStartTime: (isPaused && pauseStartTime) ? pauseStartTime.toISOString() : null,
        driveDbId: currentDriveId,
        startAddress: startAddressSnapshot,
        // SESSION DATA
        sessionStartTime: sessionStartTime ? sessionStartTime.toISOString() : null,
        sessionStartDistance: sessionStartDistance,
        sessionPauseTime: sessionPauseTime,
        sessionStartAddress: sessionStartAddress, // LISÄTTY
        existingSessions: existingSessions
    };
    localStorage.setItem(RECOVERY_KEY, JSON.stringify(crashData));
}

function clearCrashData() {
    localStorage.removeItem(RECOVERY_KEY);
}

function checkCrashRecovery() {
    const saved = localStorage.getItem(RECOVERY_KEY);
    if (!saved) return;
    
    const data = JSON.parse(saved);
    const savedTime = new Date(data.startTime);
    const now = new Date();
    const hoursDiff = Math.abs(now - savedTime) / 36e5;
    
    if (hoursDiff > 24) {
        console.log("Recovery data too old, clearing.");
        clearCrashData();
        return;
    }

    if (typeof openConfirmModal === 'function') {
        openConfirmModal(
            "⚠️ Ajo keskeytyi!",
            "Havaittiin odottamatta katkennut ajo. Haluatko palauttaa tilanteen ja jatkaa tallennusta?",
            () => restoreDrive(data) 
        );
        const btnNo = document.getElementById('btn-confirm-no');
        if(btnNo) {
            const clearHandler = () => { clearCrashData(); btnNo.removeEventListener('click', clearHandler); };
            btnNo.addEventListener('click', clearHandler);
        }
    }
}

function restoreDrive(data) {
    console.log("Restoring drive...", data);
    
    startTime = new Date(data.startTime);
    totalPauseTime = data.totalPauseTime || 0;
    maxSpeed = data.maxSpeed || 0;
    totalDistance = data.totalDistance || 0;
    routePath = data.routePath || [];
    driveMarkers = data.driveMarkers || [];
    aggressiveEvents = data.aggressiveEvents || 0;
    currentCarId = data.currentCarId || 'all';
    currentCarType = data.currentCarType || 'car';
    
    currentDriveId = data.driveDbId || null;
    startAddressSnapshot = data.startAddress || ""; 
    
    // PALAUTETAAN SESSION DATA
    if (data.sessionStartTime) sessionStartTime = new Date(data.sessionStartTime);
    else sessionStartTime = new Date(); // Fallback
    
    sessionStartDistance = data.sessionStartDistance || 0;
    sessionPauseTime = data.sessionPauseTime || 0;
    sessionStartAddress = data.sessionStartAddress || ""; // LISÄTTY
    existingSessions = data.existingSessions || [];
    
    const carSelect = document.getElementById('car-select');
    if (carSelect) carSelect.value = currentCarId;
    if (typeof updateCarTypeVariable === 'function') updateCarTypeVariable();
    
    startGPS(); 
    
    silentAudio.play().then(() => console.log("Audio restored")).catch(e => console.error("Audio restore fail", e));
    activateMotionSensors(); 

    isRecording = true;
    isViewingHistory = false;
    
    if(btnActivate) btnActivate.style.display = 'none';
    if(document.getElementById('rec-controls')) document.getElementById('rec-controls').style.display = 'flex';
    
    const startContainer = document.getElementById('start-buttons-container');
    if (startContainer) startContainer.style.display = 'none';
    
    if(activeRecBtns) activeRecBtns.style.display = 'flex';
    if(btnStartRec) btnStartRec.style.display = 'none';
    
    if (data.isPaused) {
        isPaused = true;
        pauseStartTime = data.pauseStartTime ? new Date(data.pauseStartTime) : new Date();
        if(btnPause) btnPause.style.display = 'none';
        if(btnResume) btnResume.style.display = 'inline-block';
        if(statusEl) { statusEl.innerText = "⏸ TAUKO (PALAUTETTU)"; statusEl.style.color = "#fbc02d"; }
    } else {
        isPaused = false;
        if(btnPause) btnPause.style.display = 'inline-block';
        if(btnResume) btnResume.style.display = 'none';
        const statusText = currentDriveId ? "🔴 JATKETAAN AJOA (PALAUTETTU)" : "🔴 TALLENNETAAN (PALAUTETTU)";
        if(statusEl) { statusEl.innerText = statusText; statusEl.style.color = "#ff4444"; }
        timerInterval = setInterval(updateTimer, 1000);
    }
    
    if(realTimePolyline && routePath.length > 0) {
        const latLngs = routePath.map(pt => [pt.lat, pt.lng]);
        realTimePolyline.setLatLngs(latLngs);
    }
    
    showToast("Ajo palautettu onnistuneesti! ♻️");
}

setTimeout(checkCrashRecovery, 1000);
