/*
 * ============================================================================
 * 🧤 Hand Rehabilitation Glove - ESP32 Firmware
 * File: esp32_glove.ino
 * Stage 3: 5-Finger Sensors with Hardware Noise Filtering & Stability
 * ============================================================================
 */

// ========================== BOARD PIN DEFINITIONS ==========================
#define PIN_THUMB   34   // Labeled '34' or 'D34'
#define PIN_INDEX   35   // Labeled '35' or 'D35'
#define PIN_MIDDLE  32   // Labeled '32' or 'D32'
#define PIN_RING    33   // Labeled '33' or 'D33'
#define PIN_LITTLE  36   // Labeled 'VP' on your board

// ========================== GLOVE CONFIGURATION ==========================
#define HAND_SIDE "RIGHT"
#define NUM_FINGERS 5

// High sample count + small settling delay to eliminate ESP32 ADC noise/jitter
const int NUM_SAMPLES = 30;

// Exponential Moving Average filter smoothing factor (0.0 to 1.0)
// 0.25 gives very smooth, stable numbers while reacting quickly to physical bends
const float EMA_ALPHA = 0.25;

struct FingerSensor {
  const char* id;
  const char* name;
  const char* label;
  int pin;
  int rawFlat;
  int rawBent;
  float filteredRaw;   // Smoothed float ADC reading
  int currentRaw;      // Integer raw value
  int bendPercent;     // 0 - 100%
};

FingerSensor fingers[NUM_FINGERS] = {
  { "thumb",  "Thumb ", "34", PIN_THUMB,  1000, 500, 1000.0, 1000, 0 },
  { "index",  "Index ", "35", PIN_INDEX,  1000, 500, 1000.0, 1000, 0 },
  { "middle", "Middle", "32", PIN_MIDDLE, 1000, 500, 1000.0, 1000, 0 },
  { "ring",   "Ring  ", "33", PIN_RING,   1000, 500, 1000.0, 1000, 0 },
  { "little", "Little", "VP", PIN_LITTLE, 1000, 500, 1000.0, 1000, 0 }
};

/**
 * Reads ADC multiple times with settling delay to stabilize the internal capacitor
 */
int readAveragedADC(int pin) {
  // Dummy read to allow the ESP32 ADC mux/sampling capacitor to settle to this pin
  analogRead(pin);
  delayMicroseconds(50);

  long sum = 0;
  for (int i = 0; i < NUM_SAMPLES; i++) {
    sum += analogRead(pin);
    delayMicroseconds(200);
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

  // Pre-seed the filter with initial stable readings
  for (int i = 0; i < NUM_FINGERS; i++) {
    int initial = readAveragedADC(fingers[i].pin);
    fingers[i].filteredRaw = initial;
    fingers[i].currentRaw = initial;
  }

  Serial.println("{\"status\":\"ESP32 Hand Glove Initialized\"}");
}

void loop() {
  // 1. Read all 5 sensors with Exponential Moving Average (EMA) smoothing
  for (int i = 0; i < NUM_FINGERS; i++) {
    int sample = readAveragedADC(fingers[i].pin);

    // EMA Filter formula: Filtered = (alpha * current_sample) + ((1 - alpha) * previous_filtered)
    fingers[i].filteredRaw = (EMA_ALPHA * sample) + ((1.0 - EMA_ALPHA) * fingers[i].filteredRaw);
    fingers[i].currentRaw = (int)(fingers[i].filteredRaw + 0.5);

    // Calculate bend percentage using calibrated flat and bent limits
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

  delay(120); // ~8 stable updates per second
}
