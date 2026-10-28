/**
 * services/firebase/index.js
 *
 * Firebase Realtime Database Integration for ESP32 Hand Glove.
 * Streams real-time sensor packets over Wi-Fi to the web rehabilitation portal.
 */

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase, ref, onValue, off, set } from 'firebase/database';

// ─── Firebase configuration ──────────────────────────────────────────────────
// Reads from environment variables (Vite prefix: VITE_FIREBASE_*)
// Falls back to direct config or demo defaults.
export const firebaseConfig = {
  apiKey:            import.meta.env?.VITE_FIREBASE_API_KEY            || 'AIzaSyDemoKeyForHandRehabGlove12345678',
  authDomain:        import.meta.env?.VITE_FIREBASE_AUTH_DOMAIN        || 'hand-rehab-glove.firebaseapp.com',
  databaseURL:       import.meta.env?.VITE_FIREBASE_DATABASE_URL       || 'https://hand-rehab-glove-default-rtdb.firebaseio.com',
  projectId:         import.meta.env?.VITE_FIREBASE_PROJECT_ID         || 'hand-rehab-glove',
  storageBucket:     import.meta.env?.VITE_FIREBASE_STORAGE_BUCKET     || 'hand-rehab-glove.appspot.com',
  messagingSenderId: import.meta.env?.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789012',
  appId:             import.meta.env?.VITE_FIREBASE_APP_ID             || '1:123456789012:web:abcdef123456',
};

/**
 * Returns true if real Firebase project credentials are provided
 */
export function isFirebaseConfigured() {
  const url = firebaseConfig.databaseURL;
  const key = firebaseConfig.apiKey;
  return Boolean(
    url &&
    key &&
    !url.includes('YOUR_PROJECT') &&
    !key.includes('YOUR_API_KEY')
  );
}

let appInstance = null;
let dbInstance = null;

export function getFirebaseDb() {
  if (!dbInstance) {
    appInstance = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    dbInstance = getDatabase(appInstance);
  }
  return dbInstance;
}

/**
 * Subscribe to live glove telemetry from Firebase Realtime Database.
 * Listens to `/glove` (or `/glove/live`).
 *
 * @param {function(Object): void} onData Callback with raw or structured telemetry packet
 * @param {function(Error): void} [onError] Optional error handler
 * @returns {function} Unsubscribe function
 */
export function subscribeToSensorData(onData, onError) {
  try {
    const db = getFirebaseDb();
    const gloveRef = ref(db, 'glove');

    const unsubscribe = onValue(
      gloveRef,
      (snapshot) => {
        const val = snapshot.val();
        if (val) {
          onData(val);
        }
      },
      (error) => {
        console.warn('[Firebase] Stream error:', error);
        if (onError) onError(error);
      }
    );

    return () => {
      off(gloveRef);
    };
  } catch (err) {
    console.warn('[Firebase] Failed to initialize subscription:', err);
    if (onError) onError(err);
    return () => {};
  }
}

/**
 * Convenience helper to publish or simulate test telemetry from the dashboard
 */
export async function pushTestSensorData(telemetry) {
  try {
    const db = getFirebaseDb();
    const liveRef = ref(db, 'glove/live');
    await set(liveRef, {
      ...telemetry,
      updatedAt: Date.now(),
    });
    return true;
  } catch (e) {
    console.error('[Firebase] Failed to push test telemetry:', e);
    return false;
  }
}
