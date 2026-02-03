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
var speedometerCanvas = null;

// Graafien kontekstit
var speedGraphCtx = null;
var altitudeGraphCtx = null;
var gforceGraphCtx = null;
var speedometerCtx = null;

// Asetukset
var speedometerStyle = 'digital'; // digital, gauge, both
var showLiveGraphs = false;

// =========================================================
// 1. NOPEUSMITTARIN PIIRTO
// =========================================================

function drawSpeedometer(speed) {
    if (!speedometerCanvas || !speedometerCtx) return;
    
    const centerX = speedometerCanvas.width / 2;
    const centerY = speedometerCanvas.height / 2;
    const radius = 80;
    
    // Tyhjennä canvas
    speedometerCtx.clearRect(0, 0, speedometerCanvas.width, speedometerCanvas.height);
    
    // Piirrä ulkorengas
    speedometerCtx.beginPath();
    speedometerCtx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    speedometerCtx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--border-color');
    speedometerCtx.lineWidth = 4;
    speedometerCtx.stroke();
    
    // Piirrä asteikko (0-180 km/h)
    for (let i = 0; i <= 180; i += 20) {
        const angle = (i / 180) * Math.PI + Math.PI;
        const x1 = centerX + Math.cos(angle) * (radius - 10);
        const y1 = centerY + Math.sin(angle) * (radius - 10);
        const x2 = centerX + Math.cos(angle) * (radius - 20);
        const y2 = centerY + Math.sin(angle) * (radius - 20);
        
        speedometerCtx.beginPath();
        speedometerCtx.moveTo(x1, y1);
        speedometerCtx.lineTo(x2, y2);
        speedometerCtx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--subtext-color');
        speedometerCtx.lineWidth = 2;
        speedometerCtx.stroke();
    }
    
    // Piirrä värialueet
    const greenAngle = (80 / 180) * Math.PI + Math.PI;
    const yellowAngle = (120 / 180) * Math.PI + Math.PI;
    
    // Vihreä alue (0-80 km/h)
    speedometerCtx.beginPath();
    speedometerCtx.arc(centerX, centerY, radius - 5, Math.PI, greenAngle, false);
    speedometerCtx.strokeStyle = '#00e676';
    speedometerCtx.lineWidth = 6;
    speedometerCtx.stroke();
    
    // Keltainen alue (80-120 km/h)
    speedometerCtx.beginPath();
    speedometerCtx.arc(centerX, centerY, radius - 5, greenAngle, yellowAngle, false);
    speedometerCtx.strokeStyle = '#ff9800';
    speedometerCtx.lineWidth = 6;
    speedometerCtx.stroke();
    
    // Punainen alue (120-180 km/h)
    speedometerCtx.beginPath();
    speedometerCtx.arc(centerX, centerY, radius - 5, yellowAngle, 2 * Math.PI, false);
    speedometerCtx.strokeStyle = '#ff1744';
    speedometerCtx.lineWidth = 6;
    speedometerCtx.stroke();
    
    // Piirrä neula
    const needleAngle = (Math.min(speed, 180) / 180) * Math.PI + Math.PI;
    const needleLength = radius - 25;
    
    speedometerCtx.save();
    speedometerCtx.translate(centerX, centerY);
    speedometerCtx.rotate(needleAngle);
    
    speedometerCtx.beginPath();
    speedometerCtx.moveTo(-5, 0);
    speedometerCtx.lineTo(0, -needleLength);
    speedometerCtx.lineTo(5, 0);
    speedometerCtx.closePath();
    
    // Neulan väri nopeuden mukaan
    let needleColor = '#00e676';
    if (speed > 120) needleColor = '#ff1744';
    else if (speed > 80) needleColor = '#ff9800';
    
    speedometerCtx.fillStyle = needleColor;
    speedometerCtx.fill();
    
    speedometerCtx.restore();
    
    // Piirrä keskipiste
    speedometerCtx.beginPath();
    speedometerCtx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    speedometerCtx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-color');
    speedometerCtx.fill();
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
    if (speedElement) {
        speedElement.textContent = Math.round(speed);
        
        // Värin päivitys
        const container = document.querySelector('.speedometer-container');
        if (container) {
            container.classList.remove('speed-green', 'speed-yellow', 'speed-red');
            if (speed > 120) {
                container.classList.add('speed-red');
                // Tärinäefekti korkeilla nopeuksilla
                if (speed > 140) {
                    container.classList.add('speed-warning');
                }
            } else if (speed > 80) {
                container.classList.add('speed-yellow');
            } else {
                container.classList.add('speed-green');
            }
        }
    }
    
    drawSpeedometer(speed);
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
    speedometerStyle = style;
    
    const digitalContainer = document.getElementById('digital-speed-container');
    const gaugeContainer = document.getElementById('speedometer-container');
    const graphsContainer = document.getElementById('live-graphs-container');
    
    // Näytä/piilota elementit
    switch(style) {
        case 'digital':
            if (digitalContainer) digitalContainer.style.display = 'block';
            if (gaugeContainer) gaugeContainer.style.display = 'none';
            if (graphsContainer) graphsContainer.style.display = 'none';
            break;
        case 'gauge':
            if (digitalContainer) digitalContainer.style.display = 'none';
            if (gaugeContainer) gaugeContainer.style.display = 'block';
            if (graphsContainer) graphsContainer.style.display = 'none';
            break;
        case 'both':
            if (digitalContainer) digitalContainer.style.display = 'none';
            if (gaugeContainer) gaugeContainer.style.display = 'block';
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
    speedometerCanvas = document.getElementById('speedometer-canvas');
    speedGraphCanvas = document.getElementById('speed-graph');
    altitudeGraphCanvas = document.getElementById('altitude-graph');
    gforceGraphCanvas = document.getElementById('gforce-graph');
    
    // Hae kontekstit
    if (speedometerCanvas) speedometerCtx = speedometerCanvas.getContext('2d');
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
    
    // Aseta alkuarvot
    updateSpeedometerStyle(speedometerStyle);
    
    // Aseta tapahtumankuuntelijat
    const styleSelect = document.getElementById('speedometer-style');
    if (styleSelect) {
        styleSelect.addEventListener('change', (e) => {
            updateSpeedometerStyle(e.target.value);
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
