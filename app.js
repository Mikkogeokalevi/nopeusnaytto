// 1. Firebase konfiguraatio
const firebaseConfig = {
  apiKey: "AIzaSyCZIupycr2puYrPK2KajAW7PcThW9Pjhb0",
  authDomain: "perhekalenteri-projekti.firebaseapp.com",
  databaseURL: "https://perhekalenteri-projekti-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "perhekalenteri-projekti",
  storageBucket: "perhekalenteri-projekti.appspot.com",
  messagingSenderId: "588536838615",
  appId: "1:588536838615:web:148de0581bbd46c42c7392"
};

// Alustetaan Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// 2. Kartan alustus (Leaflet)
// Asetetaan aluksi näkymään koko Suomi suurinpiirtein, kunnes GPS löytyy
const map = L.map('map').setView([64.0, 26.0], 5);

// Ladataan karttatiilet (Tumma teema CartoDB:ltä sopii sovellukseen)
L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
}).addTo(map);

// Luodaan markkeri nykyiselle sijainnille
let marker = L.marker([64.0, 26.0]).addTo(map);

// 3. Muuttujat
let watchId = null;
let currentSpeed = 0;
let isDriving = false;
let driveStartTime = null;

const speedEl = document.getElementById('speed');
const statusEl = document.getElementById('status');
const btnStart = document.getElementById('btn-start');
const btnStop = document.getElementById('btn-stop');

// 4. Toiminnot
btnStart.addEventListener('click', startDrive);
btnStop.addEventListener('click', stopDrive);

function startDrive() {
    isDriving = true;
    driveStartTime = new Date().toISOString();
    
    btnStart.style.display = 'none';
    btnStop.style.display = 'inline-block';
    statusEl.innerText = "Haetaan sijaintia ja tallennetaan...";

    // Aloitetaan GPS-seuranta
    if (navigator.geolocation) {
        watchId = navigator.geolocation.watchPosition(updatePosition, handleError, {
            enableHighAccuracy: true, // Käytä GPS:ää (tarkka)
            timeout: 5000,
            maximumAge: 0
        });
    } else {
        alert("selaimesi ei tue paikannusta.");
    }
}

function stopDrive() {
    isDriving = false;
    navigator.geolocation.clearWatch(watchId);
    
    btnStart.style.display = 'inline-block';
    btnStop.style.display = 'none';
    speedEl.innerText = "0";
    statusEl.innerText = "Ajo lopetettu ja tallennettu.";

    // Tässä kohtaa voisi tallentaa lopulliset tiedot Firebaseen
    saveToFirebase({
        type: 'end_drive',
        timestamp: new Date().toISOString()
    });
}

function updatePosition(position) {
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;
    // Nopeus tulee m/s. Jos se on null (paikallaan), käytetään 0.
    const speedMs = position.coords.speed || 0; 
    const speedKmh = Math.round(speedMs * 3.6); // Muunto km/h

    // Päivitetään UI
    speedEl.innerText = speedKmh;
    statusEl.innerText = `Sijainti: ${lat.toFixed(4)}, ${lng.toFixed(4)}`;

    // Päivitetään kartta
    const newLatLng = new L.LatLng(lat, lng);
    marker.setLatLng(newLatLng);
    map.setView(newLatLng, 16); // Zoomataan lähelle autoa

    // Tallennetaan dataa Firebaseen (esim. kerran minuutissa tai kun nopeus muuttuu merkittävästi - tässä yksinkertaistettu)
    if (isDriving) {
        // Huom: Jatkuva tallennus joka sekunti täyttää kannan nopeasti. 
        // Oikeassa sovelluksessa tallentaisimme harvemmin.
        // Nyt tallennamme vain lokaalisti näytölle.
    }
}

function handleError(error) {
    console.warn('ERROR(' + error.code + '): ' + error.message);
    statusEl.innerText = "Virhe paikannuksessa. Varmista GPS on päällä.";
}

function saveToFirebase(data) {
    // Esimerkki tallennuksesta
    const newDriveRef = db.ref('ajopaivakirja').push();
    newDriveRef.set(data);
}
