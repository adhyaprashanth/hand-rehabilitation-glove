/**
 * services/firebase/index.js
 *
 * ─── FIREBASE REAL-TIME DATA INTEGRATION ────────────────────────────────────
 *
 * This is where real ESP32 → Firebase sensor data will be connected.
 *
 * TO CONNECT FIREBASE:
 *   1. Install Firebase: `npm install firebase`
 *   2. Create a Firebase project at https://console.firebase.google.com
 *   3. Enable Realtime Database (or Firestore)
 *   4. Copy your Firebase config from Project Settings → Your Apps
 *   5. Paste the config object into the `firebaseConfig` variable below
 *   6. Implement `subscribeToSensorData()` using `onValue()` from firebase/database
 *   7. In hooks/useSensorData.js — set `USE_FIREBASE = true`
 *
 * EXPECTED DATABASE STRUCTURE (ESP32 writes to this path):
 *
 *   /glove/
 *     sensors/
 *       thumb:  { value: 2048, percent: 50 }
 *       index:  { value: 3000, percent: 73 }
 *       middle: { value: 1500, percent: 37 }
 *       ring:   { value: 500,  percent: 12 }
 *       little: { value: 800,  percent: 20 }
 *     movement/
 *       name: "Hand Flexion"
 *       detected: true
 *       timestamp: 1234567890
 *     repCount: 12
 *     systemStatus/
 *       esp32Connected: true
 *       wifiConnected: true
 */

// ─── Firebase configuration ──────────────────────────────────────────────────
// TODO: Replace with your actual Firebase config from Firebase Console
const firebaseConfig = {
  apiKey:            'YOUR_API_KEY',
  authDomain:        'YOUR_PROJECT.firebaseapp.com',
  databaseURL:       'https://YOUR_PROJECT-default-rtdb.firebaseio.com',
  projectId:         'YOUR_PROJECT_ID',
  storageBucket:     'YOUR_PROJECT.appspot.com',
  messagingSenderId: 'YOUR_SENDER_ID',
  appId:             'YOUR_APP_ID',
};

// ─── Firebase subscription ───────────────────────────────────────────────────
/**
 * Subscribe to live sensor data from Firebase.
 *
 * @param {function(import('../../types').FingerData[]): void} onData
 *   Callback invoked with the latest sensor state whenever Firebase updates.
 * @returns {function} Unsubscribe function — call on component unmount.
 *
 * IMPLEMENTATION STEPS (when ready):
 *   1. Uncomment the Firebase imports below.
 *   2. Call `initializeApp(firebaseConfig)` once at app startup.
 *   3. Use `onValue(ref(db, '/glove'), snapshot => { ... })`.
 *   4. Transform the snapshot into the FingerData[] shape.
 *   5. Call `onData(transformedData)`.
 *   6. Return the unsubscribe function from onValue.
 */
export function subscribeToSensorData(onData) {
  // TODO: Implement when Firebase is connected
  //
  // import { initializeApp } from 'firebase/app';
  // import { getDatabase, ref, onValue } from 'firebase/database';
  //
  // const app = initializeApp(firebaseConfig);
  // const db  = getDatabase(app);
  //
  // const sensorRef = ref(db, '/glove');
  // const unsubscribe = onValue(sensorRef, (snapshot) => {
  //   const raw = snapshot.val();
  //   if (!raw) return;
  //   const transformed = transformFirebaseData(raw);
  //   onData(transformed);
  // });
  //
  // return unsubscribe;

  console.warn('[Firebase] subscribeToSensorData called but not yet implemented. Using Demo Mode.');
  return () => {}; // no-op unsubscribe
}

/**
 * Transform raw Firebase data into the app's FingerData[] shape.
 * Edit this function to match your actual Firebase data structure.
 *
 * @param {Object} raw - Raw data from Firebase snapshot.val()
 * @returns {{ fingers, movement, repCount, systemStatus }}
 */
function transformFirebaseData(raw) {
  // TODO: Implement transformation matching your Firebase structure
  return raw;
}
