// =========================================================
// 1. FIREBASE ALUSTUS (GLOBAL)
// =========================================================

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
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.database();
const auth = firebase.auth(); 

// =========================================================
// 2. SOVELLUKSEN TILA (GLOBAL VARIABLES)
// =========================================================

// TÄMÄ ON PÄÄVERSIONUMERO - NYT v6.00 (MERIKARTTA & TUMMA TEEMA)
const APP_VERSION = "6.00"; 

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

// Autotalli
var userCars = [];
var currentCarId = "all"; 
var currentCarType = "car"; 

// Tankkausdata
var allRefuelings = [];
var currentRefuelingCarId = null;

// Tilastograafit
var chartInstanceMonthly = null;
var chartInstanceVehicles = null;
var chartInstanceStyle = null; 
var chartInstanceDriveTrend = null;
var chartInstanceDriveSpeed = null;

var chartInstanceFuelMonthly = null; 
var chartInstanceFuelTrend = null;   
var chartInstanceFuelCar = null;     
var chartInstanceFuelType = null;
