/**
 * hooks/useSensorData.js
 *
 * ─── MAIN DATA HOOK ──────────────────────────────────────────────────────────
 *
 * This is the single data entry point for ALL UI components.
 * Components never import from simulator.js or firebase/ directly.
 *
 * TO SWITCH FROM DEMO TO FIREBASE:
 *   Set USE_FIREBASE = true below and implement subscribeToSensorData()
 *   in services/firebase/index.js.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { getSimulatedState, resetSimulator } from '../services/demoData/simulator';
import { subscribeToSensorData } from '../services/firebase';

// ─── Toggle this to switch data sources ──────────────────────────────────────
// When false: uses simulator.js (Demo Mode)
// When true:  uses services/firebase/index.js (real ESP32 data)
const USE_FIREBASE = false;

// Update interval for Demo Mode (ms) — lower = smoother but more renders
const DEMO_UPDATE_INTERVAL_MS = 150;

/**
 * @returns {{
 *   fingers:      import('../types').FingerData[],
 *   movement:     import('../types').MovementData,
 *   repCount:     number,
 *   systemStatus: import('../types').SystemStatus,
 *   history:      Object,
 *   isDemoMode:   boolean,
 *   isConnected:  boolean,
 *   resetSession: function,
 * }}
 */
export function useSensorData() {
  const [sensorState, setSensorState] = useState(() => getSimulatedState());
  const [isConnected, setIsConnected] = useState(true);
  const intervalRef = useRef(null);

  const resetSession = useCallback(() => {
    resetSimulator();
    setSensorState(getSimulatedState());
  }, []);

  useEffect(() => {
    if (USE_FIREBASE) {
      // ── Firebase mode ──────────────────────────────────────────────────────
      setIsConnected(false);
      const unsubscribe = subscribeToSensorData((data) => {
        setSensorState({ ...data, isDemoMode: false });
        setIsConnected(true);
      });
      return () => unsubscribe();
    } else {
      // ── Demo simulation mode ───────────────────────────────────────────────
      setIsConnected(true);
      intervalRef.current = setInterval(() => {
        setSensorState(getSimulatedState());
      }, DEMO_UPDATE_INTERVAL_MS);

      return () => clearInterval(intervalRef.current);
    }
  }, []);

  return {
    ...sensorState,
    isConnected,
    resetSession,
  };
}
