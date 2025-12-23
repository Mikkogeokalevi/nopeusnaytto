// =========================================================
// GLOBALS.JS - ASETUKSET, TILA JA VAKIOT (REFACTORED v6.1)
// =========================================================

// 1. KONFIGURAATIO JA VERSIO
const APP_CONFIG = {
    VERSION: "6.10", // Refactor-versio
    THEME_STORAGE_KEY: "app_theme", // Mihin teema tallennetaan localStoragessa
    CAR_STORAGE_KEY: "selectedCarId" // Mihin valittu auto tallennetaan
};

// Yhteensopivuus vanhan koodin kanssa (tulostusta varten)
const APP_VERSION = APP_CONFIG.VERSION;

// 2. FIREBASE ALUSTUS
const firebaseConfig = {
    apiKey: "AIzaSyCZIupycr2puYrPK2KajAW7PcThW9Pjhb0",
    authDomain: "perhekalenteri-projekti.firebaseapp.com",
    databaseURL: "https://perhekalenteri-projekti-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "perhekalenteri-projekti",
    storageBucket: "perhekalenteri-projekti.appspot.com",
    messagingSenderId: "588536838615",
    appId: "1:588536838615:web:148de0581bbd46c42c7392"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth(); 

// 3. TIETOKANTAPOLUT (KESKITETTY HALLINTA)
// Käytä näitä aina, älä kirjoita polkuja käsin ("users/" jne.) muihin tiedostoihin!
const DB_PATHS = {
    USERS: 'users/',
    DRIVELOG: 'ajopaivakirja/' 
    // Tulevaisuudessa helppo muuttaa esim. 'trips/' jos halutaan
};

// 4. SOVELLUKSEN TILA (GLOBAL STATE)

// Käyttäjä ja UI tila
var currentUser = null; 
var isViewingHistory = false; 

// GPS ja Seuranta
var watchId = null;
var isGPSActive = false;
var isRecording = false; 
var isPaused = false; 
var wakeLock = null;

// Osoitehaku ja Sijainti
var lastAddressFetchTime = 0;
var currentAddress = "Odottaa sijaintia...";
var lastLatLng = null; // { lat, lng }

// Ajanotto
var startTime = null;
var pauseStartTime = null; 
var totalPauseTime = 0;    
var timerInterval = null;

// Väliaikaiset tallennustiedot (ennen Firebaseen menoa)
var tempDriveData = null; 
var deleteKey = null;

// Ajodata (Live - päivittyy ajon aikana)
var maxSpeed = 0;
var totalDistance = 0;

// Reitit ja Karttaobjektit
var routePath = []; // Tallentaa koordinaatit ajon aikana
var realTimePolyline = null; // Piirtää viivaa kartalle livenä
var savedRouteLayers = []; // Historian reittiviivat
var savedRouteLayer = null; // Vanha yhteensopivuus
var marker = null; // Sijainti-marker
var map = null; // Leaflet-karttaolio

// Sää ja Ajotapa
var currentDriveWeather = ""; 
var aggressiveEvents = 0;
var lastMotionTime = 0;
var styleResetTimer = null; 

// Historia ja Data (Ladattu Firebasesta)
var allHistoryData = []; 
var allRefuelings = [];

// Autotalli (Ladattu Firebasesta)
var userCars = [];
var currentCarId = "all"; 
var currentCarType = "car"; 
var currentRefuelingCarId = null;

// Tilastograafit (Chart.js instanssit)
// Pidetään muistissa jotta ne voidaan tuhota ennen uuden luontia
var chartInstances = {
    monthly: null,
    vehicles: null,
    style: null,
    trend: null,
    speed: null,
    fuelMonthly: null,
    fuelTrend: null,
    fuelCar: null,
    fuelType: null
};
