/*
 * ============================================================================
 * 🧤 Hand Rehabilitation Glove - ESP32 Firmware
 * File: esp32_glove.ino
 * Stage 3: 5-Finger Sensors with Real-Time Web Dashboard Integration
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
 */

// ========================== BOARD PIN DEFINITIONS ==========================
#define PIN_THUMB   34   // Labeled '34' or 'D34'
#define PIN_INDEX   35   // Labeled '35' or 'D35'
#define PIN_MIDDLE  32   // Labeled '32' or 'D32'
#define PIN_RING    33   // Labeled '33' or 'D33'
#define PIN_LITTLE  36   // Labeled 'VP' on your board

// ========================== GLOVE CONFIGURATION ==========================
#define HAND_SIDE "RIGHT"         // "RIGHT" or "LEFT" hand glove
#define NUM_FINGERS 5
const int NUM_SAMPLES = 10;       // Samples for ADC noise filtering

// Structure to store finger configuration and live telemetry
struct FingerSensor {
  const char* id;                 // e.g. "thumb", "index"
  const char* name;               // e.g. "Thumb"
  const char* label;              // Label printed on board: "34", "VP", etc.
  int pin;                        // ESP32 ADC pin number
  int rawFlat;                    // Raw ADC reading when straight (0% bend)
  int rawBent;                    // Raw ADC reading when bent 90° (100% bend)
  int currentRaw;                 // Live raw ADC
  int bendPercent;                // Live 0 - 100%
};

// 5-Finger Sensor Array
// Adjust rawFlat and rawBent per finger if needed (Default: Flat=1000, Bent=500)
FingerSensor fingers[NUM_FINGERS] = {
  { "thumb",  "Thumb ", "34", PIN_THUMB,  1000, 500, 0, 0 },
  { "index",  "Index ", "35", PIN_INDEX,  1000, 500, 0, 0 },
  { "middle", "Middle", "32", PIN_MIDDLE, 1000, 500, 0, 0 },
  { "ring",   "Ring  ", "33", PIN_RING,   1000, 500, 0, 0 },
  { "little", "Little", "VP", PIN_LITTLE, 1000, 500, 0, 0 }
};

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

  // Set attenuation for full 0 - 3.3V range
  analogSetAttenuation(ADC_11db);

  Serial.println("{\"status\":\"ESP32 Hand Glove Initialized\"}");
}

void loop() {
  // 1. Read all 5 sensors and calculate bend percentage
  for (int i = 0; i < NUM_FINGERS; i++) {
    fingers[i].currentRaw = readAveragedADC(fingers[i].pin);

    // Map raw value to 0-100% bend (1000 -> 0%, 500 -> 100%)
    int pct = map(fingers[i].currentRaw, fingers[i].rawFlat, fingers[i].rawBent, 0, 100);
    fingers[i].bendPercent = constrain(pct, 0, 100);
  }

  // 2. Stream single-line JSON directly to Serial for the Web Dashboard & Serial Monitor
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

  delay(150); // Refresh rate: ~7 updates per second (matches dashboard interval)
}
