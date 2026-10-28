/*
 * ============================================================================
 * 🧤 Hand Rehabilitation Glove - ESP32 Firmware with Wi-Fi & Firebase
 * File: esp32_glove.ino
 * Stage 4: 5-Finger Sensors + Real-Time Wi-Fi & Firebase Realtime Database
 * ============================================================================
 * 
 * Hardware Connections (Labels printed on your ESP32 board):
 * ----------------------------------------------------------------------------
 *   Finger   | Board Label | Sensor Leg 1 | Junction to Resistor | Resistor to
 *   ---------+-------------+--------------+----------------------+-------------
 *   Thumb    | 34 (or D34) | ESP32 3.3V   | ESP32 Pin 34         | ESP32 GND
 *   Index    | 35 (or D35) | ESP32 3.3V   | ESP32 Pin 35         | ESP32 GND
 *   Middle   | 32 (or D32) | ESP32 3.3V   | ESP32 Pin 32         | ESP32 GND
 *   Ring     | 33 (or D33) | ESP32 3.3V   | ESP32 Pin 33         | ESP32 GND
 *   Little   | VP          | ESP32 3.3V   | ESP32 Pin VP (36)    | ESP32 GND
 * ----------------------------------------------------------------------------
 *
 * ARDUINO IDE SETUP INSTRUCTIONS:
 * 1. In Arduino IDE, go to: Sketch -> Include Library -> Manage Libraries...
 * 2. Search for: "Firebase ESP Client" (by Mobizt)
 * 3. Click "Install" (version 4.x or higher)
 * 4. Replace WIFI_SSID, WIFI_PASSWORD, API_KEY, and DATABASE_URL below.
 * ============================================================================
 */

#include <WiFi.h>
#include <Firebase_ESP_Client.h>

// Provide the token generation process info.
#include "addons/TokenHelper.h"
// Provide the RTDB payload printing info and other helper functions.
#include "addons/RTDBHelper.h"

// ========================== WI-FI CONFIGURATION =============================
// Enter your Wi-Fi name (SSID) and Password (e.g. your home router or phone hotspot)
#define WIFI_SSID       "YOUR_WIFI_NAME"
#define WIFI_PASSWORD   "YOUR_WIFI_PASSWORD"

// ========================== FIREBASE CONFIGURATION ==========================
// 1. In Firebase Console (console.firebase.google.com) -> Project Settings -> Web API Key
#define API_KEY         "YOUR_FIREBASE_WEB_API_KEY"

// 2. Realtime Database -> Data tab -> Copy URL (including https:// and trailing /)
// Example: "https://hand-rehab-glove-default-rtdb.firebaseio.com/"
#define DATABASE_URL    "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com/"

// ========================== BOARD PIN DEFINITIONS ==========================
#define PIN_THUMB   34   // Labeled '34' or 'D34'
#define PIN_INDEX   35   // Labeled '35' or 'D35'
#define PIN_MIDDLE  32   // Labeled '32' or 'D32'
#define PIN_RING    33   // Labeled '33' or 'D33'
#define PIN_LITTLE  36   // Labeled 'VP' on your board

// ========================== GLOVE CONFIGURATION ==========================
#define HAND_SIDE "RIGHT"
#define NUM_FINGERS 5
const int NUM_SAMPLES = 10;                     // Samples for ADC noise filtering
const unsigned long SEND_INTERVAL_MS = 150;     // ~7 updates per second

// Structure to store finger configuration and live telemetry
struct FingerSensor {
  const char* id;
  const char* name;
  const char* label;
  int pin;
  int rawFlat;
  int rawBent;
  int currentRaw;
  int bendPercent;
};

// 5-Finger Sensor Array
FingerSensor fingers[NUM_FINGERS] = {
  { "thumb",  "Thumb ", "34", PIN_THUMB,  1000, 500, 0, 0 },
  { "index",  "Index ", "35", PIN_INDEX,  1000, 500, 0, 0 },
  { "middle", "Middle", "32", PIN_MIDDLE, 1000, 500, 0, 0 },
  { "ring",   "Ring  ", "33", PIN_RING,   1000, 500, 0, 0 },
  { "little", "Little", "VP", PIN_LITTLE, 1000, 500, 0, 0 }
};

// Firebase Data Objects
FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;
unsigned long lastSendTime = 0;

/**
 * Reads ADC multiple times and returns the average to eliminate noise
 */
int readAveragedADC(int pin) {
  long sum = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    sum += analogRead(pin);
    delayMicroseconds(150);
  }
  return (int)(sum / NUM_SAMPLES);
}

void setup() {
  Serial.begin(115200);
  delay(1000);

  // Set ADC 12-bit resolution (0 - 4095)
  analogReadResolution(12);
  analogSetAttenuation(ADC_11db);

  Serial.println("\n[INIT] ESP32 Hand Glove Initializing...");

  // 1. Connect to Wi-Fi
  WiFi.mode(WIFI_STA);
  WiFi.setAutoReconnect(true);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("[WiFi] Connecting to: ");
  Serial.println(WIFI_SSID);

  int wifiAttempts = 0;
  while (WiFi.status() != WL_CONNECTED && wifiAttempts < 20) {
    delay(500);
    Serial.print(".");
    wifiAttempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\n[WiFi] Connected successfully!");
    Serial.print("[WiFi] IP Address: ");
    Serial.println(WiFi.localIP());

    // 2. Initialize Firebase Client
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;

    // Sign up anonymously
    if (Firebase.signUp(&config, &auth, "", "")) {
      Serial.println("[Firebase] Anonymous Authentication Successful");
      signupOK = true;
    } else {
      Serial.printf("[Firebase] Sign-up failed: %s\n", config.signer.signupError.message.c_str());
    }

    config.token_status_callback = tokenStatusCallback;
    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
  } else {
    Serial.println("\n[WiFi] Could not connect. Continuing in USB Serial mode.");
  }
}

void loop() {
  // 1. Read all 5 sensors and calculate bend percentage
  for (int i = 0; i < NUM_FINGERS; i++) {
    fingers[i].currentRaw = readAveragedADC(fingers[i].pin);

    // Map raw value to 0-100% bend (1000 -> 0%, 500 -> 100%)
    int pct = map(fingers[i].currentRaw, fingers[i].rawFlat, fingers[i].rawBent, 0, 100);
    fingers[i].bendPercent = constrain(pct, 0, 100);
  }

  // 2. Dual Output A: Stream single-line JSON directly to USB Serial
  // (Allows monitoring in Arduino Serial Monitor or direct USB connection)
  Serial.print("{\"thumb\":{\"raw\":");
  Serial.print(fingers[0].currentRaw);
  Serial.print(",\"pct\":");
  Serial.print(fingers[0].bendPercent);

  Serial.print("},\"index\":{\"raw\":");
  Serial.print(fingers[1].currentRaw);
  Serial.print(",\"pct\":");
  Serial.print(fingers[1].bendPercent);

  Serial.print("},\"middle\":{\"raw\":");
  Serial.print(fingers[2].currentRaw);
  Serial.print(",\"pct\":");
  Serial.print(fingers[2].bendPercent);

  Serial.print("},\"ring\":{\"raw\":");
  Serial.print(fingers[3].currentRaw);
  Serial.print(",\"pct\":");
  Serial.print(fingers[3].bendPercent);

  Serial.print("},\"little\":{\"raw\":");
  Serial.print(fingers[4].currentRaw);
  Serial.print(",\"pct\":");
  Serial.print(fingers[4].bendPercent);
  Serial.println("}}");

  // 3. Dual Output B: Stream over Wi-Fi directly to Firebase Realtime Database
  if (WiFi.status() == WL_CONNECTED && Firebase.ready() && signupOK) {
    if (millis() - lastSendTime >= SEND_INTERVAL_MS) {
      lastSendTime = millis();

      FirebaseJson json;
      json.set("thumb/raw",  fingers[0].currentRaw);
      json.set("thumb/pct",  fingers[0].bendPercent);
      json.set("index/raw",  fingers[1].currentRaw);
      json.set("index/pct",  fingers[1].bendPercent);
      json.set("middle/raw", fingers[2].currentRaw);
      json.set("middle/pct", fingers[2].bendPercent);
      json.set("ring/raw",   fingers[3].currentRaw);
      json.set("ring/pct",   fingers[3].bendPercent);
      json.set("little/raw", fingers[4].currentRaw);
      json.set("little/pct", fingers[4].bendPercent);
      json.set("timestamp",  (int)millis());

      // Update /glove/live in Firebase Realtime Database
      if (!Firebase.RTDB.updateNode(&fbdo, "/glove/live", &json)) {
        Serial.printf("[Firebase] Update failed: %s\n", fbdo.errorReason().c_str());
      }
    }
  }

  delay(SEND_INTERVAL_MS);
}
