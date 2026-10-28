/**
 * hooks/useSensorData.js
 *
 * ─── MAIN DATA HOOK ──────────────────────────────────────────────────────────
 *
 * Data entry point for ALL UI components.
 * Supports:
 *   1. Web Serial API (direct USB connection to ESP32 at 115200 baud)
 *   2. Interactive in-app Calibration (records Flat and Bent ADC for each finger)
 *   3. Demo simulation mode (when ESP32 is not connected)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSimulatedState, resetSimulator } from '../services/demoData/simulator';
import { subscribeToSensorData } from '../services/firebase';
import { connectWebSerial, disconnectWebSerial, isWebSerialSupported } from '../services/serial/webSerial';
import { FINGERS } from '../constants/fingers';

const USE_FIREBASE = false;
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
  const [packetCount, setPacketCount] = useState(0);

  // Calibration state
  const [calibration, setCalibration] = useState(loadStoredCalibration);
  const [calibratedFlat, setCalibratedFlat] = useState(false);
  const [calibratedBent, setCalibratedBent] = useState(false);

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

  // Save calibration updates
  const saveCalibration = useCallback((newCal) => {
    setCalibration(newCal);
    calibrationRef.current = newCal;
    try {
      localStorage.setItem('glove_sensor_calibration', JSON.stringify(newCal));
    } catch (e) {
      console.warn('Failed to save calibration:', e);
    }
  }, []);

  // Record current raw values as FLAT position (0% bend)
  const calibrateFlat = useCallback(() => {
    const updated = { ...calibrationRef.current };
    FINGERS.forEach(f => {
      const raw = liveRawRef.current[f.id] ?? 1000;
      updated[f.id] = { ...updated[f.id], flat: raw };
    });
    saveCalibration(updated);
    setCalibratedFlat(true);
  }, [saveCalibration]);

  // Record current raw values as BENT position (100% bend)
  const calibrateBent = useCallback(() => {
    const updated = { ...calibrationRef.current };
    FINGERS.forEach(f => {
      const raw = liveRawRef.current[f.id] ?? 500;
      updated[f.id] = { ...updated[f.id], bent: raw };
    });
    saveCalibration(updated);
    setCalibratedBent(true);
  }, [saveCalibration]);

  const resetCalibration = useCallback(() => {
    saveCalibration(DEFAULT_CALIBRATION);
    setCalibratedFlat(false);
    setCalibratedBent(false);
  }, [saveCalibration]);

  // Parse incoming line from ESP32 (supports JSON, regex text, and single sensor)
  const handleRawSerialLine = useCallback((line) => {
    setPacketCount(c => c + 1);
    let parsedData = null;

    // Strategy 1: Parse JSON
    if (line.startsWith('{') && line.endsWith('}')) {
      try {
        parsedData = JSON.parse(line);
      } catch {
        // not pure JSON
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
      // Strategy 2: Parse text like "Thumb (Pin 34): Raw=985" or "Raw: 985"
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

      // Single sensor fallback: "Raw: 985"
      if (!thumbMatch && !indexMatch && !middleMatch && !ringMatch && !littleMatch) {
        const singleMatch = line.match(/Raw[:=]\s*(\d+)/i);
        if (singleMatch) {
          liveRawRef.current.thumb = parseInt(singleMatch[1], 10);
        }
      }
    }

    // Now compute fingers based on current live raw and calibrated limits
    const now = Date.now();
    const timeLabel = new Date(now).toLocaleTimeString('en', { hour12: false });
    const currentCal = calibrationRef.current;

    const fingers = FINGERS.map(f => {
      const rawVal = liveRawRef.current[f.id] ?? 1000;
      const cal = currentCal[f.id] || DEFAULT_CALIBRATION[f.id];
      const percent = calculateBendPercent(rawVal, cal.flat, cal.bent);
      const status = percent >= 60 ? 'Bending' : percent >= 20 ? 'Active' : 'Resting';

      // History buffer for charts
      if (!historyRef.current[f.id]) historyRef.current[f.id] = [];
      historyRef.current[f.id].push({ time: timeLabel, value: percent });
      if (historyRef.current[f.id].length > HISTORY_MAX_POINTS) {
        historyRef.current[f.id].shift();
      }

      return {
        ...f,
        percent,
        value: rawVal,
        status,
      };
    });

    // Detect hand movements
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
        wifiConnected: false,
        firebaseSynced: false,
      },
      history: { ...historyRef.current },
      isDemoMode: false,
    });
  }, []);

  const connectESP32 = useCallback(async () => {
    return await connectWebSerial(handleRawSerialLine, (connected) => {
      setIsSerialConnected(connected);
      if (!connected) {
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

  useEffect(() => {
    if (USE_FIREBASE) {
      setIsConnected(false);
      const unsubscribe = subscribeToSensorData((data) => {
        setSensorState({ ...data, isDemoMode: false });
        setIsConnected(true);
      });
      return () => unsubscribe();
    } else if (!isSerialConnected) {
      // Simulation mode
      setIsConnected(true);
      intervalRef.current = setInterval(() => {
        setSensorState(getSimulatedState());
      }, DEMO_UPDATE_INTERVAL_MS);

      return () => clearInterval(intervalRef.current);
    }
  }, [isSerialConnected]);

  return {
    ...sensorState,
    isConnected,
    isSerialConnected,
    isWebSerialSupported: isWebSerialSupported(),
    packetCount,
    calibration,
    calibratedFlat,
    calibratedBent,
    calibrateFlat,
    calibrateBent,
    resetCalibration,
    connectESP32,
    disconnectESP32,
    resetSession,
  };
}
