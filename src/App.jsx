/**
 * App.jsx — Patient Rehabilitation Portal
 *
 * Single-page patient companion for smart hand rehabilitation.
 * Supports Light/Dark theme, USB WebSerial ESP32 glove connection,
 * interactive therapy exercises, and individual sensor ROM calibration.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import Navbar from './components/layout/Navbar';
import HeroSection from './pages/Home/HeroSection';
import LiveHandSection from './pages/Home/LiveHandSection';
import SensorReadingsSection from './pages/Home/SensorReadingsSection';
import ExercisesSection from './pages/Home/ExercisesSection';
import CalibrationSection from './pages/Home/CalibrationSection';
import Footer from './components/layout/Footer';

import { useSensorData } from './hooks/useSensorData';

export default function App() {
  // ── Theme State (Light / Dark) ───────────────────────────────────────────
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem('dexter_theme') || 'dark';
    } catch {
      return 'dark';
    }
  });

  const toggleTheme = useCallback(() => {
    setTheme(t => {
      const next = t === 'dark' ? 'light' : 'dark';
      try {
        localStorage.setItem('dexter_theme', next);
      } catch (e) {
        console.warn('Failed to save theme:', e);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.body.classList.add('theme-light');
    } else {
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  // ── Sensor Data Hook ─────────────────────────────────────────────────────
  const {
    fingers,
    movement,
    repCount,
    systemStatus,
    isSerialConnected,
    isWebSerialSupported,
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
  } = useSensorData();

  // ── Exercise Therapy Session State ───────────────────────────────────────
  const [activeExerciseId, setActiveExerciseId] = useState('hand-flexion');
  const [exerciseReps, setExerciseReps] = useState({
    'hand-flexion': 0,
    'hand-extension': 0,
    'pinch-movement': 0,
    'finger-flexion': 0,
    'finger-extension': 0,
  });

  const prevRepCount = useRef(repCount);
  useEffect(() => {
    if (repCount > prevRepCount.current) {
      const diff = repCount - prevRepCount.current;
      setExerciseReps(r => ({
        ...r,
        [activeExerciseId]: (r[activeExerciseId] || 0) + diff,
      }));
    }
    prevRepCount.current = repCount;
  }, [repCount, activeExerciseId]);

  const handleManualRep = useCallback((exerciseId) => {
    setExerciseReps(r => ({
      ...r,
      [exerciseId]: (r[exerciseId] || 0) + 1,
    }));
  }, []);

  const handleResetReps = useCallback((exerciseId) => {
    setExerciseReps(r => ({
      ...r,
      [exerciseId]: 0,
    }));
  }, []);

  return (
    <div
      className="min-h-screen transition-colors duration-300"
      style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}
    >
      <Navbar
        isSerialConnected={isSerialConnected}
        isWebSerialSupported={isWebSerialSupported}
        onConnectESP32={connectESP32}
        onDisconnectESP32={disconnectESP32}
        theme={theme}
        onToggleTheme={toggleTheme}
      />

      {/* Hero: Patient POV */}
      <HeroSection />

      {/* Live Hand Model + Movement Detector + Rep Counter */}
      <LiveHandSection
        fingers={fingers}
        movement={movement}
        repCount={repCount}
        resetSession={resetSession}
        isSerialConnected={isSerialConnected}
        isWebSerialSupported={isWebSerialSupported}
        packetCount={packetCount}
        onConnectESP32={connectESP32}
        onDisconnectESP32={disconnectESP32}
      />

      {/* Active Guided Rehabilitation Exercises */}
      <ExercisesSection
        activeExerciseId={activeExerciseId}
        onSelectExercise={setActiveExerciseId}
        exerciseReps={exerciseReps}
        onManualRep={handleManualRep}
        onResetReps={handleResetReps}
      />

      {/* Individual Finger Range of Motion Stages */}
      <SensorReadingsSection fingers={fingers} />

      {/* Individual Sensor ROM Calibration (Flat 0% and Bent 100%) */}
      <CalibrationSection
        systemStatus={systemStatus}
        fingers={fingers}
        calibration={calibration}
        calibratedStatus={calibratedStatus}
        onCalibrateFingerFlat={calibrateFingerFlat}
        onCalibrateFingerBent={calibrateFingerBent}
        onCalibrateAllFlat={calibrateAllFlat}
        onCalibrateAllBent={calibrateAllBent}
        onResetCalibration={resetCalibration}
        isSerialConnected={isSerialConnected}
      />

      <Footer />
    </div>
  );
}
