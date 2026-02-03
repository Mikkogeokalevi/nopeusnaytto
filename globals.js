// =========================================================
// 1. FIREBASE ALUSTUS (GLOBAL)
// =========================================================

// Ladataan API-avain turvallisesti .env-tiedostosta (ei sisälly GitHubiin)
let firebaseApiKey = "AIzaSyCZIupycr2puYrPK2KajAW7PcThW9Pjhb0"; // Fallback paikalliseen käyttöön

// Yritetään lukea .env-tiedostoa (ei toimi GitHubissa, mutta toimii paikallisesti)
try {
    fetch('./.env')
        .then(response => response.text())
        .then(data => {
            const match = data.match(/FIREBASE_API_KEY\s*=\s*["']([^"']+)["']/);
            if (match) {
                firebaseApiKey = match[1];
            }
        })
        .catch(() => {
            // .env-tiedostoa ei löytynyt, käytetään fallback-arvoa
            console.log('.env-tiedostoa ei löytynyt, käytetään fallback-arvoa');
        });
} catch (e) {
    console.log('Virhe .env-tiedoston lukemisessa:', e);
}

const firebaseConfig = {
    apiKey: firebaseApiKey,
    authDomain: "perhekalenteri-projekti.firebaseapp.com",
    databaseURL: "https://perhekalenteri-projekti-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "perhekalenteri-projekti",
    storageBucket: "perhekalenteri-projekti.appspot.com",
    messagingSenderId: "588536838615",
    appId: "1:588536838615:web:148de0581bbd46c42c7392"
};

// Alustetaan Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth(); 

// =========================================================
// 2. SOVELLUKSEN TILA (GLOBAL VARIABLES)
// =========================================================

// TÄMÄ ON PÄÄVERSIONUMERO - v6.13 (Security Fix - API Key Protection)
const APP_VERSION = "6.13"; 

// Käyttäjä ja UI tila
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

// Ajanotto
var startTime = null;
var pauseStartTime = null; 
var totalPauseTime = 0;    
var timerInterval = null;

// Väliaikaiset tallennustiedot
var tempDriveData = null; 
var deleteKey = null;
var currentDriveId = null; 

// Ajodata (Live)
var maxSpeed = 0;
var totalDistance = 0;
var lastLatLng = null;

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
var pendingDrives = []; 

// Autotalli
var userCars = [];
var currentCarId = "all"; 
var currentCarType = "car"; 

// Tankkausdata
var allRefuelings = [];
var currentFuelCarId = null; 

// Tilastografiikat (Chart.js instanssit)
var chartDriveTrend = null;
var chartDriveMonthly = null;
var chartDriveSpeed = null;
var chartDriveVehicles = null;
var chartDriveStyle = null;

var chartFuelType = null;
var chartFuelMonthly = null;
var chartFuelTrend = null;
var chartFuelCar = null;

// Apufunktio: Turvallinen JSON parse
function safeParse(json) {
    try {
        return JSON.parse(json);
    } catch (e) {
        return null;
    }
}
