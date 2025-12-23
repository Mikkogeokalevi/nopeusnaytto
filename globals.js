// =========================================================
// GLOBALS.JS - ASETUKSET, TILA JA VAKIOT (FIXED v6.6)
// =========================================================

// 1. KONFIGURAATIO JA VERSIO
const APP_CONFIG = {
    VERSION: "6.60",
    THEME_STORAGE_KEY: "app_theme",
    CAR_STORAGE_KEY: "selectedCarId"
};

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

// 3. TIETOKANTAPOLUT (TÄRKEÄ: NÄITÄ KÄYTETÄÄN KAIKKIALLA)
const DB_PATHS = {
    USERS: 'users/',
    DRIVELOG: 'ajopaivakirja/' 
};

// 4. SOVELLUKSEN TILA (GLOBAL STATE)

// Käyttäjä ja UI
var currentUser = null; 
var isViewingHistory = false; 

// GPS ja Seuranta
var watchId = null;
var isGPSActive = false;
var isRecording = false; 
var isPaused = false; 
var wakeLock = null;

// Osoitehaku
var lastAddressFetchTime = 0;
var currentAddress = "Odottaa sijaintia...";
var lastLatLng = null; 

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

// Reitit ja Karttaobjektit
var routePath = []; 
var realTimePolyline = null; 
var savedRouteLayers = []; 
var savedRouteLayer = null; 
var marker = null; 
var map = null; 

// Sää ja Ajotapa
var currentDriveWeather = ""; 
var aggressiveEvents = 0;
var lastMotionTime = 0;
var styleResetTimer = null; 

// Historia ja Data
var allHistoryData = []; 
var allRefuelings = [];

// Autotalli
var userCars = [];
var currentCarId = "all"; 
var currentCarType = "car"; 
var currentRefuelingCarId = null;

// Tilastograafit (Chart.js instanssit)
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
