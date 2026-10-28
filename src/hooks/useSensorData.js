/**
 * hooks/useSensorData.js
 *
 * ─── MAIN DATA HOOK ──────────────────────────────────────────────────────────
 *
 * Data entry point for ALL UI components.
 * Supports:
 *   1. Wi-Fi & Firebase Realtime Database (Live wireless telemetry from ESP32)
 *   2. Web Serial API (Direct USB connection to ESP32 at 115200 baud)
 *   3. Per-Finger Individual Calibration (Calibrate flat & bent one sensor at a time)
 *   4. Demo simulation mode (When hardware is not streaming)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSimulatedState, resetSimulator } from '../services/demoData/simulator';
import { subscribeToSensorData, isFirebaseConfigured } from '../services/firebase';
import { connectWebSerial, disconnectWebSerial, isWebSerialSupported } from '../services/serial/webSerial';
import { FINGERS } from '../constants/fingers';

const DEMO_UPDATE_INTERVAL_MS = 150;
const HISTORY_MAX_POINTS = 50;

const DEFAULT_CALIBRATION = {
  thumb:  { flat: 1000, bent: 500 },
  index:  { flat: 1000, bent: 500 },
  middle: { flat: 1000, bent: 500 },
  ring:   { flat: 1000, bent: 500 },
  little: { flat: 1000, bent: 500 },
};

function loadStoredCalibration() {
  try {
    const saved = localStorage.getItem('glove_sensor_calibration');
    if (saved) return JSON.parse(saved);
  } catch (e) {
    console.warn('Failed to load calibration:', e);
  }
  return DEFAULT_CALIBRATION;
}

function calculateBendPercent(raw, flat, bent) {
  if (flat === bent) return 0;
  let pct = 0;
  if (flat > bent) {
    // Voltage drops when bent (standard voltage divider)
    pct = ((flat - raw) / (flat - bent)) * 100;
  } else {
    // Voltage rises when bent
    pct = ((raw - flat) / (bent - flat)) * 100;
  }
  return Math.max(0, Math.min(100, Math.round(pct)));
}

export function useSensorData() {
  const [sensorState, setSensorState] = useState(() => getSimulatedState());
  const [isConnected, setIsConnected] = useState(true);
  const [isSerialConnected, setIsSerialConnected] = useState(false);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [connectionMode, setConnectionMode] = useState('wifi'); // 'wifi' | 'usb' | 'demo'
  const [packetCount, setPacketCount] = useState(0);

  // Per-finger calibration limits
  const [calibration, setCalibration] = useState(loadStoredCalibration);

  // Track which individual fingers have had flat & bent recorded
  const [calibratedStatus, setCalibratedStatus] = useState(() => {
    return Object.fromEntries(
      FINGERS.map(f => [f.id, { flat: false, bent: false }])
    );
  });

  const intervalRef = useRef(null);
  const historyRef = useRef(Object.fromEntries(FINGERS.map(f => [f.id, []])));
  const repStateRef = useRef({ repCount: 0, wasFlexed: false });
  const liveRawRef = useRef({ thumb: 1000, index: 1000, middle: 1000, ring: 1000, little: 1000 });
  const calibrationRef = useRef(calibration);
  calibrationRef.current = calibration;

  const resetSession = useCallback(() => {
    repStateRef.current = { repCount: 0, wasFlexed: false };
    resetSimulator();
    setSensorState(getSimulatedState());
  }, []);

  const saveCalibration = useCallback((newCal) => {
    setCalibration(newCal);
    calibrationRef.current = newCal;
    try {
      localStorage.setItem('glove_sensor_calibration', JSON.stringify(newCal));
    } catch (e) {
      console.warn('Failed to save calibration:', e);
    }
  }, []);

  // ── Per-Finger Individual Calibration ──────────────────────────────────────
  const calibrateFingerFlat = useCallback((fingerId) => {
    const raw = liveRawRef.current[fingerId] ?? 1000;
    const updated = {
      ...calibrationRef.current,
      [fingerId]: {
        ...(calibrationRef.current[fingerId] || { flat: 1000, bent: 500 }),
        flat: raw,
      },
    };
    saveCalibration(updated);
    setCalibratedStatus(s => ({
      ...s,
      [fingerId]: { ...s[fingerId], flat: true },
    }));
  }, [saveCalibration]);

  const calibrateFingerBent = useCallback((fingerId) => {
    const raw = liveRawRef.current[fingerId] ?? 500;
    const updated = {
      ...calibrationRef.current,
      [fingerId]: {
        ...(calibrationRef.current[fingerId] || { flat: 1000, bent: 500 }),
        bent: raw,
      },
    };
    saveCalibration(updated);
    setCalibratedStatus(s => ({
      ...s,
      [fingerId]: { ...s[fingerId], bent: true },
    }));
  }, [saveCalibration]);

  // ── Batch All-Finger Calibration ───────────────────────────────────────────
  const calibrateAllFlat = useCallback(() => {
    const updated = { ...calibrationRef.current };
    FINGERS.forEach(f => {
      const raw = liveRawRef.current[f.id] ?? 1000;
      updated[f.id] = { ...updated[f.id], flat: raw };
    });
    saveCalibration(updated);
    setCalibratedStatus(s => {
      const next = { ...s };
      FINGERS.forEach(f => { next[f.id] = { ...next[f.id], flat: true }; });
      return next;
    });
  }, [saveCalibration]);

  const calibrateAllBent = useCallback(() => {
    const updated = { ...calibrationRef.current };
    FINGERS.forEach(f => {
      const raw = liveRawRef.current[f.id] ?? 500;
      updated[f.id] = { ...updated[f.id], bent: raw };
    });
    saveCalibration(updated);
    setCalibratedStatus(s => {
      const next = { ...s };
      FINGERS.forEach(f => { next[f.id] = { ...next[f.id], bent: true }; });
      return next;
    });
  }, [saveCalibration]);

  const resetCalibration = useCallback(() => {
    saveCalibration(DEFAULT_CALIBRATION);
    setCalibratedStatus(
      Object.fromEntries(FINGERS.map(f => [f.id, { flat: false, bent: false }]))
    );
  }, [saveCalibration]);

  // ── Common Telemetry Processor (used by both Firebase Wi-Fi & USB Serial) ──
  const applySensorTelemetry = useCallback((source = 'wifi') => {
    const now = Date.now();
    const timeLabel = new Date(now).toLocaleTimeString('en', { hour12: false });
    const currentCal = calibrationRef.current;

    const fingers = FINGERS.map(f => {
      const rawVal = liveRawRef.current[f.id] ?? 1000;
      const cal = currentCal[f.id] || DEFAULT_CALIBRATION[f.id];
      const percent = calculateBendPercent(rawVal, cal.flat, cal.bent);
      const status = percent >= 60 ? 'Bending' : percent >= 20 ? 'Active' : 'Resting';

      // History buffer (safe immutable append)
      const prevHistory = Array.isArray(historyRef.current[f.id]) ? [...historyRef.current[f.id]] : [];
      historyRef.current[f.id] = [...prevHistory, { time: timeLabel, value: percent }].slice(-HISTORY_MAX_POINTS);

      return {
        ...f,
        percent,
        value: rawVal,
        status,
      };
    });

    // Detect movements
    const avgPercent = fingers.reduce((s, f) => s + f.percent, 0) / fingers.length;
    const thumbPct = fingers.find(f => f.id === 'thumb')?.percent || 0;
    const indexPct = fingers.find(f => f.id === 'index')?.percent || 0;
    const middlePct = fingers.find(f => f.id === 'middle')?.percent || 0;

    let movementName = 'Hand Extension';
    let movementEmoji = '🖐';
    let description = 'Fingers straight / relaxed';

    if (avgPercent >= 60) {
      movementName = 'Hand Flexion';
      movementEmoji = '✊';
      description = 'All fingers closed inward';
      repStateRef.current.wasFlexed = true;
    } else if (thumbPct >= 45 && indexPct >= 45 && middlePct < 30) {
      movementName = 'Pinch Movement';
      movementEmoji = '🤏';
      description = 'Thumb meets index finger';
    } else if (avgPercent <= 20) {
      movementName = 'Hand Extension';
      movementEmoji = '🖐';
      description = 'All fingers extended straight';
      if (repStateRef.current.wasFlexed) {
        repStateRef.current.repCount += 1;
        repStateRef.current.wasFlexed = false;
      }
    } else {
      movementName = 'Finger Flexion';
      movementEmoji = '🤙';
      description = 'Active finger movement';
    }

    setSensorState({
      fingers,
      movement: {
        name: movementName,
        emoji: movementEmoji,
        description,
        detected: true,
        confidence: 99,
        timestamp: now,
      },
      repCount: repStateRef.current.repCount,
      systemStatus: {
        esp32Connected: true,
        sensorsActive: true,
        wifiConnected: source === 'wifi',
        firebaseSynced: source === 'wifi',
      },
      history: Object.fromEntries(FINGERS.map(f => [f.id, [...(historyRef.current[f.id] || [])]])),
      isDemoMode: false,
    });
  }, []);

  // ── 1. Firebase Realtime Database Data Receiver (Wi-Fi) ───────────────────
  const handleFirebaseTelemetry = useCallback((data) => {
    if (!data) return;
    setPacketCount(c => c + 1);
    setIsFirebaseConnected(true);

    // Unpack nested or root structure (e.g. data.live, data.sensors, or data)
    const payload = data.live || data.sensors || data;

    FINGERS.forEach(f => {
      const entry = payload[f.id];
      if (entry !== undefined) {
        if (typeof entry === 'object' && entry !== null) {
          const raw = entry.raw ?? entry.val ?? entry.value ?? entry.pct;
          if (raw !== undefined) liveRawRef.current[f.id] = Number(raw);
        } else {
          liveRawRef.current[f.id] = Number(entry);
        }
      }
    });

    applySensorTelemetry('wifi');
  }, [applySensorTelemetry]);

  // ── 2. WebSerial Raw Stream Receiver (USB Serial) ─────────────────────────
  const handleRawSerialLine = useCallback((line) => {
    setPacketCount(c => c + 1);
    let parsedData = null;

    if (line.startsWith('{') && line.endsWith('}')) {
      try {
        parsedData = JSON.parse(line);
      } catch {
        // ignore malformed
      }
    }

    if (parsedData) {
      FINGERS.forEach(f => {
        if (parsedData[f.id] !== undefined) {
          if (typeof parsedData[f.id] === 'object') {
            const raw = parsedData[f.id].raw ?? parsedData[f.id].val;
            if (raw !== undefined) liveRawRef.current[f.id] = Number(raw);
          } else {
            liveRawRef.current[f.id] = Number(parsedData[f.id]);
          }
        }
      });
    } else {
      const thumbMatch  = line.match(/Thumb.*?Raw[:=]\s*(\d+)/i);
      const indexMatch  = line.match(/Index.*?Raw[:=]\s*(\d+)/i);
      const middleMatch = line.match(/Middle.*?Raw[:=]\s*(\d+)/i);
      const ringMatch   = line.match(/Ring.*?Raw[:=]\s*(\d+)/i);
      const littleMatch = line.match(/Little.*?Raw[:=]\s*(\d+)/i);

      if (thumbMatch)  liveRawRef.current.thumb  = parseInt(thumbMatch[1], 10);
      if (indexMatch)  liveRawRef.current.index  = parseInt(indexMatch[1], 10);
      if (middleMatch) liveRawRef.current.middle = parseInt(middleMatch[1], 10);
      if (ringMatch)   liveRawRef.current.ring   = parseInt(ringMatch[1], 10);
      if (littleMatch) liveRawRef.current.little = parseInt(littleMatch[1], 10);

      if (!thumbMatch && !indexMatch && !middleMatch && !ringMatch && !littleMatch) {
        const singleMatch = line.match(/Raw[:=]\s*(\d+)/i);
        if (singleMatch) {
          liveRawRef.current.thumb = parseInt(singleMatch[1], 10);
        }
      }
    }

    applySensorTelemetry('serial');
  }, [applySensorTelemetry]);

  // ── Connect / Disconnect Handlers ──────────────────────────────────────────
  const connectESP32 = useCallback(async () => {
    return await connectWebSerial(handleRawSerialLine, (connected) => {
      setIsSerialConnected(connected);
      if (connected) {
        setConnectionMode('usb');
      } else {
        setSensorState(getSimulatedState());
      }
    });
  }, [handleRawSerialLine]);

  const disconnectESP32 = useCallback(async () => {
    await disconnectWebSerial((connected) => {
      setIsSerialConnected(connected);
      setSensorState(getSimulatedState());
    });
  }, []);

  // ── Listen to Firebase Realtime Database ───────────────────────────────────
  useEffect(() => {
    let unsubscribe = null;
    try {
      unsubscribe = subscribeToSensorData(handleFirebaseTelemetry, (err) => {
        console.warn('[Firebase] Stream status:', err?.message || err);
      });
    } catch (e) {
      console.warn('[Firebase] Subscribe error:', e);
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [handleFirebaseTelemetry]);

  // ── Fallback Simulator (Active when no hardware packet received) ───────────
  useEffect(() => {
    if (!isSerialConnected && !isFirebaseConnected) {
      intervalRef.current = setInterval(() => {
        setSensorState(getSimulatedState());
      }, DEMO_UPDATE_INTERVAL_MS);

      return () => clearInterval(intervalRef.current);
    }
  }, [isSerialConnected, isFirebaseConnected]);

  return {
    ...sensorState,
    isConnected,
    isSerialConnected,
    isFirebaseConnected,
    isFirebaseConfigured: isFirebaseConfigured(),
    connectionMode,
    setConnectionMode,
    isWebSerialSupported: isWebSerialSupported(),
    packetCount,
    calibration,
    calibratedStatus,
    calibrateFingerFlat,
    calibrateFingerBent,
    calibrateAllFlat,
    calibrateAllBent,
    resetCalibration,
    connectESP32,
    disconnectESP32,
    resetSession,
  };
}
