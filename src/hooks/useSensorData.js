/**
 * hooks/useSensorData.js
 *
 * ─── MAIN DATA HOOK ──────────────────────────────────────────────────────────
 *
 * Data entry point for ALL UI components.
 * Supports:
 *   1. Web Serial API (direct USB connection to ESP32 at 115200 baud)
 *   2. Demo simulation mode (when ESP32 is not connected)
 *   3. Firebase mode (optional future wireless mode)
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSimulatedState, resetSimulator } from '../services/demoData/simulator';
import { subscribeToSensorData } from '../services/firebase';
import { connectWebSerial, disconnectWebSerial, isWebSerialSupported } from '../services/serial/webSerial';
import { FINGERS } from '../constants/fingers';

const USE_FIREBASE = false;
const DEMO_UPDATE_INTERVAL_MS = 150;
const HISTORY_MAX_POINTS = 50;

export function useSensorData() {
  const [sensorState, setSensorState] = useState(() => getSimulatedState());
  const [isConnected, setIsConnected] = useState(true);
  const [isSerialConnected, setIsSerialConnected] = useState(false);
  const intervalRef = useRef(null);
  const historyRef = useRef(Object.fromEntries(FINGERS.map(f => [f.id, []])));
  const repStateRef = useRef({ repCount: 0, wasFlexed: false });

  const resetSession = useCallback(() => {
    repStateRef.current = { repCount: 0, wasFlexed: false };
    resetSimulator();
    setSensorState(getSimulatedState());
  }, []);

  // WebSerial data handler from ESP32
  const handleSerialData = useCallback((data) => {
    const now = Date.now();
    const timeLabel = new Date(now).toLocaleTimeString('en', { hour12: false });

    // Map ESP32 JSON to fingers array
    const fingers = FINGERS.map(f => {
      let percent = 0;
      let rawVal = 0;
      if (data && data[f.id] !== undefined) {
        if (typeof data[f.id] === 'object') {
          percent = data[f.id].pct ?? data[f.id].percent ?? 0;
          rawVal = data[f.id].raw ?? data[f.id].val ?? 0;
        } else {
          percent = Number(data[f.id]) || 0;
          rawVal = data.raw?.[f.id] ?? 0;
        }
      }
      percent = Math.max(0, Math.min(100, Math.round(percent)));
      const status = percent >= 60 ? 'Bending' : percent >= 20 ? 'Active' : 'Resting';

      // Record history for graph
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

    // Detect movement gesture
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
    const success = await connectWebSerial(handleSerialData, (connected) => {
      setIsSerialConnected(connected);
      if (!connected) {
        // Fall back to demo mode when disconnected
        setSensorState(getSimulatedState());
      }
    });
    return success;
  }, [handleSerialData]);

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
      // Demo simulation mode when not connected via USB serial
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
    connectESP32,
    disconnectESP32,
    resetSession,
  };
}
