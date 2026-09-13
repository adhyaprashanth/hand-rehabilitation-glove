/**
 * services/demoData/simulator.js
 *
 * ─── CENTRAL DEMO SIMULATION ENGINE ─────────────────────────────────────────
 *
 * This is the ONLY place where simulated sensor data is generated.
 * All UI components consume data via the useSensorData hook — they never
 * call this module directly.
 *
 * When connecting to Firebase in the future:
 *   1. Do NOT touch this file.
 *   2. Edit services/firebase/index.js to return real data.
 *   3. Switch the data source in hooks/useSensorData.js.
 *
 * HOW THE SIMULATION WORKS:
 *   - Each finger has an independent sinusoidal oscillator with slightly
 *     different frequency, amplitude, and phase offset.
 *   - Movement patterns cycle through predefined states every ~4 seconds.
 *   - Reps are incremented each time a movement pattern completes a cycle.
 */

import { FINGERS } from '../../constants/fingers';

// ─── Movement pattern definitions ────────────────────────────────────────────
/**
 * Each pattern defines target bending percentages for all five fingers.
 * Order: [thumb, index, middle, ring, little]
 */
const MOVEMENT_PATTERNS = [
  {
    name: 'Hand Flexion',
    emoji: '✊',
    description: 'All fingers bending inward',
    targets: [85, 90, 88, 86, 84],
  },
  {
    name: 'Hand Extension',
    emoji: '🖐',
    description: 'All fingers straightened',
    targets: [10, 8, 12, 10, 9],
  },
  {
    name: 'Pinch Movement',
    emoji: '🤏',
    description: 'Thumb meets index finger',
    targets: [80, 75, 20, 15, 12],
  },
  {
    name: 'Finger Flexion',
    emoji: '🤙',
    description: 'Sequential finger curl',
    targets: [40, 85, 80, 75, 70],
  },
  {
    name: 'Finger Extension',
    emoji: '🖖',
    description: 'Fingers spread wide',
    targets: [15, 12, 10, 14, 16],
  },
];

// ─── Oscillator state ─────────────────────────────────────────────────────────

// Per-finger oscillator settings for smooth independent variation
const OSCILLATORS = {
  thumb:  { freq: 0.0012, amp: 18, phase: 0.0 },
  index:  { freq: 0.0014, amp: 16, phase: 1.2 },
  middle: { freq: 0.0011, amp: 20, phase: 2.4 },
  ring:   { freq: 0.0013, amp: 15, phase: 3.6 },
  little: { freq: 0.0015, amp: 17, phase: 4.8 },
};

// Duration each movement pattern is held (ms)
const PATTERN_HOLD_MS = 4500;
// Transition time between patterns (ms)
const PATTERN_TRANSITION_MS = 1500;

// ─── Simulator state (module-level, shared across all consumers) ──────────────
let _currentPatternIndex = 0;
let _patternStartTime = Date.now();
let _repCount = 0;
let _lastPatternForRep = -1;

// History buffer per finger (keeps last N data points for the live graph)
const HISTORY_MAX_POINTS = 50;
const _history = Object.fromEntries(FINGERS.map(f => [f.id, []]));

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Compute the current simulated sensor state.
 * Call this on every animation frame / interval tick.
 *
 * @returns {{ fingers: Object[], movement: Object, repCount: number, systemStatus: Object, history: Object }}
 */
export function getSimulatedState() {
  const now = Date.now();
  const elapsed = now - _patternStartTime;

  // Determine which pattern we're in and interpolation progress
  const totalCycleDuration = PATTERN_HOLD_MS + PATTERN_TRANSITION_MS;
  const cyclePos = elapsed % totalCycleDuration;
  const patternCycleCount = Math.floor(elapsed / totalCycleDuration);

  // Advance to next pattern when a full cycle completes
  const globalCycle = Math.floor(elapsed / totalCycleDuration);
  _currentPatternIndex = globalCycle % MOVEMENT_PATTERNS.length;

  // Count a rep every time we complete a Hand Flexion pattern
  if (_currentPatternIndex === 0 && _lastPatternForRep !== globalCycle) {
    _lastPatternForRep = globalCycle;
    if (globalCycle > 0) _repCount++;
  }

  const isTransitioning = cyclePos > PATTERN_HOLD_MS;
  const transitionProgress = isTransitioning
    ? (cyclePos - PATTERN_HOLD_MS) / PATTERN_TRANSITION_MS
    : 0;

  const currentPattern = MOVEMENT_PATTERNS[_currentPatternIndex];
  const nextPattern =
    MOVEMENT_PATTERNS[(_currentPatternIndex + 1) % MOVEMENT_PATTERNS.length];

  // Build finger data
  const fingers = FINGERS.map((fingerDef, i) => {
    const osc = OSCILLATORS[fingerDef.id];
    const noiseWave = Math.sin(now * osc.freq + osc.phase) * osc.amp * 0.3;

    // Interpolate between current and next pattern during transition
    const targetPercent = isTransitioning
      ? lerp(currentPattern.targets[i], nextPattern.targets[i], easeInOut(transitionProgress))
      : currentPattern.targets[i];

    // Add gentle oscillation on top of the target
    const rawPercent = clamp(targetPercent + noiseWave, 0, 100);
    const percent = Math.round(rawPercent);

    // Derive raw ADC value (ESP32 ADC: 0–4095)
    const value = Math.round((percent / 100) * 4095);

    const status = percent >= 60 ? 'Bending' : percent >= 20 ? 'Active' : 'Resting';

    return {
      ...fingerDef,
      percent,
      value,
      status,
    };
  });

  // Record history for each finger
  const timeLabel = new Date(now).toLocaleTimeString('en', { hour12: false });
  fingers.forEach(f => {
    _history[f.id].push({ time: timeLabel, value: f.percent });
    if (_history[f.id].length > HISTORY_MAX_POINTS) _history[f.id].shift();
  });

  // Build movement data
  const movementConfidence = isTransitioning
    ? Math.round((1 - transitionProgress) * 100)
    : 95 + Math.round(Math.random() * 5);

  const movement = {
    ...currentPattern,
    detected: !isTransitioning,
    confidence: movementConfidence,
    timestamp: now,
  };

  // System status (always green in demo mode)
  const systemStatus = {
    esp32Connected: true,
    sensorsActive: true,
    wifiConnected: true,
    firebaseSynced: true,
  };

  return {
    fingers,
    movement,
    repCount: _repCount,
    systemStatus,
    history: _history,
    isDemoMode: true,
  };
}

/** Reset the simulated session (rep counter, history, pattern index) */
export function resetSimulator() {
  _repCount = 0;
  _lastPatternForRep = -1;
  _patternStartTime = Date.now();
  _currentPatternIndex = 0;
  FINGERS.forEach(f => { _history[f.id] = []; });
}

// ─── Math helpers ─────────────────────────────────────────────────────────────
const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, min, max) => Math.min(Math.max(v, min), max);
const easeInOut = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
