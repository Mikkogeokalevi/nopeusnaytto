// =========================================================
// 1. ASETUKSET JA VERSIO (GLOBAL)
// =========================================================

// TÄMÄ ON PÄÄVERSIONUMERO - Muuta tätä, niin se päivittyy kaikkialle
const APP_VERSION = "5.1"; 

const firebaseConfig = {
    apiKey: "AIzaSyCZIupycr2puYrPK2KajAW7PcThW9Pjhb0",
    authDomain: "perhekalenteri-projekti.firebaseapp.com",
    databaseURL: "https://perhekalenteri-projekti-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "perhekalenteri-projekti",
    storageBucket: "perhekalenteri-projekti.appspot.com",
    messagingSenderId: "588536838615",
    appId: "1:588536838615:web:148de0581bbd46c42c7392"
};

// Alustetaan Firebase heti, jotta 'db' ja 'auth' ovat käytössä kaikkialla
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth(); 

// =========================================================
// 2. SOVELLUKSEN TILA (GLOBAL VARIABLES)
// =========================================================

// Käyttäjä ja UI tila
var currentUser = null; 
var isViewingHistory = false; // Estää kartan keskityksen historiassa

// GPS ja Seuranta
var watchId = null;
var isGPSActive = false;
var isRecording = false; 
var isPaused = false; 
var wakeLock = null;

// Ajanotto
var startTime = null;
var pauseStartTime = null; 
var totalPauseTime = 0;    
var timerInterval = null;

// Väliaikaiset tallennustiedot
var tempDriveData = null; 
var deleteKey = null;

// Ajodata (Live)
var maxSpeed = 0;
var totalDistance = 0;
var lastLatLng = null;

// Reitit ja Karttaobjektit
var routePath = []; // {lat, lng, spd}
var realTimePolyline = null; // Live-viiva
var savedRouteLayers = []; // Historian viivat
var savedRouteLayer = null; // Vanha yhteensopivuus
var marker = null; // Oma sijainti pallo
var map = null; // Leaflet kartta-instanssi

// Sää ja Ajotapa
var currentDriveWeather = ""; 
var aggressiveEvents = 0;
var lastMotionTime = 0;
var styleResetTimer = null; 

// Historia ja Data
var allHistoryData = []; 

// Autotalli
var userCars = [];
var currentCarId = "all"; 
var currentCarType = "car"; 

// Tilastot (Chart.js instanssit)
var chartInstanceMonthly = null;
var chartInstanceVehicles = null;

// Tankkausdata
var allRefuelings = [];
var currentRefuelingCarId = null;
