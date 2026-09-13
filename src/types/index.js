/**
 * types/index.js
 *
 * Centralized JSDoc type definitions for all data structures used in the app.
 * These are used for documentation and IDE autocomplete — not runtime validation.
 *
 * When connecting real Firebase data, ensure the data arriving from Firebase
 * conforms to these shapes (transform in services/firebase/index.js if needed).
 */

/**
 * @typedef {Object} FingerData
 * @property {string} id          - Unique key: 'thumb'|'index'|'middle'|'ring'|'little'
 * @property {string} name        - Display name: 'Thumb', 'Index', etc.
 * @property {string} emoji       - Emoji icon for the finger
 * @property {number} value       - Raw sensor value (0–4095 from ESP32 ADC)
 * @property {number} percent     - Normalised bending percentage (0–100)
 * @property {'Resting'|'Bending'|'Extended'|'Active'} status - Current state
 * @property {string} color       - Tailwind bg color class for this finger
 * @property {string} gradientFrom - Gradient start color (hex)
 * @property {string} gradientTo   - Gradient end color (hex)
 */

/**
 * @typedef {Object} MovementData
 * @property {string} name        - Detected movement name e.g. 'Hand Flexion'
 * @property {string} emoji       - Emoji for the movement
 * @property {string} description - Short description
 * @property {boolean} detected   - Whether a movement is currently detected
 * @property {number} confidence  - Confidence percentage (0–100)
 * @property {number} timestamp   - Unix timestamp of detection
 */

/**
 * @typedef {Object} RepData
 * @property {number} count       - Total repetition count this session
 * @property {boolean} justIncremented - True for one cycle when a new rep is added
 * @property {string} lastMovement - Name of movement that triggered the rep
 */

/**
 * @typedef {Object} SystemStatus
 * @property {boolean} esp32Connected    - ESP32 microcontroller connection
 * @property {boolean} sensorsActive     - All flex sensors reporting
 * @property {boolean} wifiConnected     - Wi-Fi / network status
 * @property {boolean} firebaseSynced    - Firebase real-time DB sync status
 */

/**
 * @typedef {Object} SensorHistory
 * @property {string} fingerId   - Which finger this history belongs to
 * @property {Array<{time:string, value:number}>} data - Time-series array
 */

/**
 * @typedef {Object} Exercise
 * @property {string} id          - Unique exercise identifier
 * @property {string} name        - Display name
 * @property {string} emoji       - Emoji icon
 * @property {string} description - Short instruction text
 * @property {string} videoUrl    - YouTube embed URL (replace with real URLs)
 * @property {string} duration    - Suggested duration string e.g. '30 seconds'
 * @property {string[]} benefits  - List of benefits
 */

// This file is intentionally left as pure JSDoc — no runtime exports needed.
export {};
