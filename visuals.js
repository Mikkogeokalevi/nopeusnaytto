// =========================================================
// VISUALS.JS - UUSI V6.14 - ANIMOITU NOPEUSMITTARI & GRAAFIT
// =========================================================

// Globaalit muuttujat graafeille
var speedGraphData = [];
var altitudeGraphData = [];
var gforceGraphData = [];
var maxDataPoints = 30; // 30 sekuntia dataa

// Graafien canvas-elementit
var speedGraphCanvas = null;
var altitudeGraphCanvas = null;
var gforceGraphCanvas = null;

// Graafien kontekstit
var speedGraphCtx = null;
var altitudeGraphCtx = null;
var gforceGraphCtx = null;

// Asetukset
var speedometerStyle = 'digital'; // digital, gauge, cinema, both
var speedHudTheme = 'cyber-blue'; // cyber-blue, sunset-gold
var showLiveGraphs = false;

function applyHudTheme(theme) {
    const body = document.body;
    if (!body) return;

    const normalized = theme === 'sunset-gold' ? 'sunset-gold' : 'cyber-blue';
    body.classList.remove('hud-theme-cyber-blue', 'hud-theme-sunset-gold');
    body.classList.add(`hud-theme-${normalized}`);
    speedHudTheme = normalized;

    localStorage.setItem('speedHudTheme', normalized);
}

// =========================================================
// 1. PULSE HUD - NOPEUSNÄYTTÖ
// =========================================================

function updatePulseHud(speed) {
    const arcFill = document.getElementById('speed-arc-fill');
    const speedState = document.getElementById('wow-speed-state');
    const barsWrap = document.getElementById('wow-bars');
    const bars = barsWrap ? barsWrap.querySelectorAll('.wow-bar') : [];
    const root = document.getElementById('speedometer-container');
    if (!arcFill || !speedState || !root) return;

    const s = Math.max(0, Number(speed) || 0);
    const ratio = Math.max(0, Math.min(1, s / 180));
    const fillDeg = -215 + (ratio * 250);
    arcFill.style.setProperty('--arc-end-deg', `${fillDeg}deg`);

    let state = 'CRUISE';
    if (s < 5) state = 'READY';
    else if (s >= 130) state = 'HYPER';
    else if (s >= 90) state = 'FAST';
    speedState.textContent = state;

    const activeBars = Math.round(ratio * bars.length);
    bars.forEach((bar, idx) => {
        if (idx < activeBars) bar.classList.add('active');
        else bar.classList.remove('active');
    });
}

function updateVelocityStage(speed) {
    const speedText = document.getElementById('dash-speed-cinema');
    const status = document.getElementById('velocity-status');
    const trackFill = document.getElementById('velocity-track-fill');
    const marker = document.getElementById('velocity-track-marker');
    const stage = document.getElementById('velocity-stage-container');
    const lanesWrap = document.getElementById('velocity-lanes');
    const lanes = lanesWrap ? lanesWrap.querySelectorAll('.velocity-lane') : [];
    if (!speedText || !status || !trackFill || !marker || !stage) return;

    const s = Math.max(0, Number(speed) || 0);
    const ratio = Math.max(0, Math.min(1, s / 180));
    const pct = Math.round(ratio * 100);

    speedText.textContent = s.toFixed(1);
    trackFill.style.width = `${pct}%`;
    marker.style.left = `${pct}%`;
    stage.style.setProperty('--stage-shift', `${Math.round(ratio * 32)}px`);

    let state = 'PAIKALLAAN';
    if (s >= 120) state = 'ERITTÄIN NOPEA';
    else if (s >= 80) state = 'MAANTIE';
    else if (s >= 30) state = 'TAAJAMA';
    status.textContent = state;

    const active = Math.round(ratio * lanes.length);
    lanes.forEach((lane, idx) => {
        if (idx < active) lane.classList.add('active');
        else lane.classList.remove('active');
    });
}

// =========================================================
// 2. GRAAFIEN PIIRTO
// =========================================================

function drawLineGraph(canvas, ctx, data, color, maxValue) {
    if (!canvas || !ctx) return;
    
    const width = canvas.width;
    const height = canvas.height;
    
    // Tyhjennä canvas
    ctx.clearRect(0, 0, width, height);
    
    if (data.length < 2) return;
    
    // Piirrä taustaviivat
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= 4; i++) {
        const y = (height / 4) * i;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
    
    // Piirrä käyrä
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    
    for (let i = 0; i < data.length; i++) {
        const x = (i / (maxDataPoints - 1)) * width;
        const y = height - (data[i] / maxValue) * height;
        
        if (i === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }
    
    ctx.stroke();
    
    // Piirrä viimeisin piste
    if (data.length > 0) {
        const lastX = ((data.length - 1) / (maxDataPoints - 1)) * width;
        const lastY = height - (data[data.length - 1] / maxValue) * height;
        
        ctx.beginPath();
        ctx.arc(lastX, lastY, 3, 0, 2 * Math.PI);
        ctx.fillStyle = color;
        ctx.fill();
    }
}

function drawSpeedGraph() {
    drawLineGraph(speedGraphCanvas, speedGraphCtx, speedGraphData, '#2979ff', 180);
}

function drawAltitudeGraph() {
    drawLineGraph(altitudeGraphCanvas, altitudeGraphCtx, altitudeGraphData, '#00e676', 200);
}

function drawGforceGraph() {
    drawLineGraph(gforceGraphCanvas, gforceGraphCtx, gforceGraphData, '#ff9800', 2);
}

// =========================================================
// 3. DATAN PÄIVITYS
// =========================================================

function updateSpeedometer(speed) {
    const speedElement = document.getElementById('dash-speed-gauge');
    const speedCinema = document.getElementById('dash-speed-cinema');
    if (speedCinema) speedCinema.textContent = (Math.max(0, Number(speed) || 0)).toFixed(1);

    if (speedElement) {
        speedElement.textContent = Math.round(speed);
        
        // Värin päivitys
        const container = document.getElementById('speedometer-container');
        if (container) {
            container.classList.remove('speed-green', 'speed-yellow', 'speed-red', 'speed-warning');

            // Neulan ja numeron väri nopeuden mukaan
            let color = '#00e676';
            if (speed > 120) color = '#ff1744';
            else if (speed > 80) color = '#ff9800';

            // Aseta väri suoraan numerolle (varmin tapa, ei riipu CSS-periytymisestä)
            speedElement.style.color = color;

            // Luokat edelleen käyttöön (tärinä jne.)
            if (speed > 120) {
                container.classList.add('speed-red');
                if (speed > 140) container.classList.add('speed-warning');
            } else if (speed > 80) {
                container.classList.add('speed-yellow');
            } else {
                container.classList.add('speed-green');
            }
        }
    }

    updatePulseHud(speed);
    updateVelocityStage(speed);
}

function updateGraphs(speed, altitude, gforce) {
    // Lisää data puskuriin
    speedGraphData.push(speed);
    altitudeGraphData.push(altitude);
    gforceGraphData.push(gforce);
    
    // Rajoita datan määrä
    if (speedGraphData.length > maxDataPoints) speedGraphData.shift();
    if (altitudeGraphData.length > maxDataPoints) altitudeGraphData.shift();
    if (gforceGraphData.length > maxDataPoints) gforceGraphData.shift();
    
    // Piirrä graafit
    drawSpeedGraph();
    drawAltitudeGraph();
    drawGforceGraph();
}

function updateGIndicator(gx, gy) {
    const indicator = document.getElementById('g-indicator');
    if (!indicator) return;
    
    const maxOffset = 20;
    const offsetX = Math.max(-maxOffset, Math.min(maxOffset, gx * maxOffset));
    const offsetY = Math.max(-maxOffset, Math.min(maxOffset, gy * maxOffset));
    
    indicator.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))`;
    
    // Värin päivitys voiman mukaan
    const totalG = Math.sqrt(gx * gx + gy * gy);
    if (totalG > 1.5) {
        indicator.style.background = '#ff1744';
        indicator.style.boxShadow = '0 0 15px #ff1744';
    } else if (totalG > 1.0) {
        indicator.style.background = '#ff9800';
        indicator.style.boxShadow = '0 0 10px #ff9800';
    } else {
        indicator.style.background = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
        indicator.style.boxShadow = '0 0 10px var(--accent-color)';
    }
}

// =========================================================
// 4. ASETUSTEN HALLINTA
// =========================================================

function updateSpeedometerStyle(style) {
    speedometerStyle = (style === 'cinema' || style === 'both' || style === 'gauge') ? style : 'digital';
    
    const digitalContainer = document.getElementById('digital-speed-container');
    const pulseHudContainer = document.getElementById('speedometer-container');
    const velocityStageContainer = document.getElementById('velocity-stage-container');
    const graphsContainer = document.getElementById('live-graphs-container');
    
    // Näytä/piilota elementit
    switch(speedometerStyle) {
        case 'digital':
            if (digitalContainer) digitalContainer.style.display = 'block';
            if (pulseHudContainer) pulseHudContainer.style.display = 'none';
            if (velocityStageContainer) velocityStageContainer.style.display = 'none';
            if (graphsContainer) graphsContainer.style.display = 'none';
            break;
        case 'gauge':
            if (digitalContainer) digitalContainer.style.display = 'none';
            if (pulseHudContainer) pulseHudContainer.style.display = 'block';
            if (velocityStageContainer) velocityStageContainer.style.display = 'none';
            if (graphsContainer) graphsContainer.style.display = 'none';
            break;
        case 'cinema':
            if (digitalContainer) digitalContainer.style.display = 'none';
            if (pulseHudContainer) pulseHudContainer.style.display = 'none';
            if (velocityStageContainer) velocityStageContainer.style.display = 'block';
            if (graphsContainer) graphsContainer.style.display = 'none';
            break;
        case 'both':
            if (digitalContainer) digitalContainer.style.display = 'none';
            if (pulseHudContainer) pulseHudContainer.style.display = 'block';
            if (velocityStageContainer) velocityStageContainer.style.display = 'none';
            if (graphsContainer) graphsContainer.style.display = 'block';
            break;
    }
    
    // Tallenna asetus
    localStorage.setItem('speedometerStyle', style);
}

// =========================================================
// 5. ALUSTUS
// =========================================================

function initVisuals() {
    // Hae canvas-elementit
    speedGraphCanvas = document.getElementById('speed-graph');
    altitudeGraphCanvas = document.getElementById('altitude-graph');
    gforceGraphCanvas = document.getElementById('gforce-graph');
    
    // Hae kontekstit
    if (speedGraphCanvas) speedGraphCtx = speedGraphCanvas.getContext('2d');
    if (altitudeGraphCanvas) altitudeGraphCtx = altitudeGraphCanvas.getContext('2d');
    if (gforceGraphCanvas) gforceGraphCtx = gforceGraphCanvas.getContext('2d');
    
    // Lataa asetukset
    const savedStyle = localStorage.getItem('speedometerStyle');
    if (savedStyle) {
        speedometerStyle = savedStyle;
        const styleSelect = document.getElementById('speedometer-style');
        if (styleSelect) {
            styleSelect.value = savedStyle;
        }
    }

    const savedHudTheme = localStorage.getItem('speedHudTheme');
    if (savedHudTheme) speedHudTheme = savedHudTheme;
    applyHudTheme(speedHudTheme);
    const hudThemeSelect = document.getElementById('speed-hud-theme');
    if (hudThemeSelect) hudThemeSelect.value = speedHudTheme;
    
    // Aseta alkuarvot
    updateSpeedometerStyle(speedometerStyle);

    // Varmista canvaksille järkevät mitat myös silloin kun näkymä oli aluksi piilossa
    // (piilossa olevissa elementeissä canvas voi jäädä "0x0" ja näyttää tyhjältä)
    if (speedGraphCanvas) {
        if (!speedGraphCanvas.width || speedGraphCanvas.width < 50) speedGraphCanvas.width = 150;
        if (!speedGraphCanvas.height || speedGraphCanvas.height < 30) speedGraphCanvas.height = 60;
    }
    if (altitudeGraphCanvas) {
        if (!altitudeGraphCanvas.width || altitudeGraphCanvas.width < 50) altitudeGraphCanvas.width = 150;
        if (!altitudeGraphCanvas.height || altitudeGraphCanvas.height < 30) altitudeGraphCanvas.height = 60;
    }
    if (gforceGraphCanvas) {
        if (!gforceGraphCanvas.width || gforceGraphCanvas.width < 50) gforceGraphCanvas.width = 150;
        if (!gforceGraphCanvas.height || gforceGraphCanvas.height < 30) gforceGraphCanvas.height = 60;
    }

    // Ensipiirto (ettei mittari/graafit näytä tyhjältä ennen ensimmäistä GPS-päivitystä)
    try {
        updatePulseHud(0);
        updateVelocityStage(0);
        drawSpeedGraph();
        drawAltitudeGraph();
        drawGforceGraph();
    } catch (e) {
        console.warn('Visuals init draw failed:', e);
    }
    
    // Aseta tapahtumankuuntelijat
    const styleSelect = document.getElementById('speedometer-style');
    if (styleSelect) {
        styleSelect.addEventListener('change', (e) => {
            updateSpeedometerStyle(e.target.value);
        });
    }

    if (hudThemeSelect) {
        hudThemeSelect.addEventListener('change', (e) => {
            applyHudTheme(e.target.value);
        });
    }
    
    console.log('Visuals v6.14 alustettu');
}

// =========================================================
// 6. EXPORT
// =========================================================

window.initVisuals = initVisuals;
window.updateSpeedometer = updateSpeedometer;
window.updateGraphs = updateGraphs;
window.updateGIndicator = updateGIndicator;
window.updateSpeedometerStyle = updateSpeedometerStyle;
window.applyHudTheme = applyHudTheme;
