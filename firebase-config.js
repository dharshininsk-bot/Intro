/**
 * FIREBASE CONFIGURATION & REALTIME DATABASE SYNC
 */

// Replace the placeholder values with your Firebase Web App configuration credentials:
const firebaseConfig = {
    apiKey: "AIzaSyAd6io00LqEg1fvcB4RZEeJuNneZHu4Ank",
    authDomain: "intro-c9502.firebaseapp.com",
    projectId: "intro-c9502",
    storageBucket: "intro-c9502.firebasestorage.app",
    messagingSenderId: "405385167131",
    appId: "1:405385167131:web:176166255205f8577653be",
    measurementId: "G-QT4VD75RJP"
};

let db = null;
let isFirebaseActive = false;

try {
    if (typeof firebase !== 'undefined' && firebaseConfig.apiKey !== "YOUR_API_KEY") {
        firebase.initializeApp(firebaseConfig);
        db = firebase.database();
        isFirebaseActive = true;
        console.log("🔥 Firebase initialized successfully!");
    } else {
        console.warn("⚠️ Running in LocalStorage mode until Firebase keys are added.");
    }
} catch (err) {
    console.error("Firebase Init Error:", err);
}

/**
 * Listens for real-time tile updates from Firebase (or LocalStorage fallback)
 */
function listenToTileUpdates(onUpdateCallback) {
    if (isFirebaseActive && db) {
        db.ref('tiles').on('value', (snapshot) => {
            const data = snapshot.val() || {};
            onUpdateCallback(data);
        });
    } else {
        const localData = JSON.parse(localStorage.getItem('neon_magic_tiles')) || {};
        onUpdateCallback(localData);

        // Listen for tab syncs in LocalStorage
        window.addEventListener('storage', () => {
            const updated = JSON.parse(localStorage.getItem('neon_magic_tiles')) || {};
            onUpdateCallback(updated);
        });
    }
}

/**
 * Marks a specific tile as broken in Firebase Realtime Database
 */
function setTileBrokenInFirebase(tileIndex) {
    if (isFirebaseActive && db) {
        db.ref(`tiles/tile_${tileIndex}`).set({
            broken: true,
            completedAt: Date.now()
        });
    } else {
        const localData = JSON.parse(localStorage.getItem('neon_magic_tiles')) || {};
        localData[`tile_${tileIndex}`] = { broken: true, completedAt: Date.now() };
        localStorage.setItem('neon_magic_tiles', JSON.stringify(localData));

        // Trigger manual update callback for local tab
        if (typeof handleRealtimeUpdate === 'function') {
            handleRealtimeUpdate(localData);
        }
    }
}

/**
 * Reset all tiles in Firebase (Admin feature)
 */
function resetFirebaseTiles() {
    if (isFirebaseActive && db) {
        db.ref('tiles').remove();
    } else {
        localStorage.removeItem('neon_magic_tiles');
        if (typeof handleRealtimeUpdate === 'function') {
            handleRealtimeUpdate({});
        }
    }
}
