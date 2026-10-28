/**
 * App.jsx
 *
 * Root application component.
 *
 * ARCHITECTURE:
 *   - useSensorData() is the single data source for all sensor state.
 *   - Supports USB WebSerial connection directly to ESP32 hardware!
 *   - When connected via USB, real hardware streams live to all UI sections.
 *   - Supports in-app 2-step calibration (Set Flat, Set Bent).
 *   - When disconnected, seamlessly falls back to demo simulation.
 */

import Navbar from './components/layout/Navbar';
import HeroSection from './pages/Home/HeroSection';
import LiveHandSection from './pages/Home/LiveHandSection';
import SensorReadingsSection from './pages/Home/SensorReadingsSection';
import GraphSection from './pages/Home/GraphSection';
import ExercisesSection from './pages/Home/ExercisesSection';
import HowItWorksSection from './pages/Home/HowItWorksSection';
import CalibrationSection from './pages/Home/CalibrationSection';
import Footer from './components/layout/Footer';

import { useSensorData } from './hooks/useSensorData';

export default function App() {
  // ── Single data source for the entire app ────────────────────────────────
  const {
    fingers,
    movement,
    repCount,
    systemStatus,
    history,
    isDemoMode,
    isSerialConnected,
    isWebSerialSupported,
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
  } = useSensorData();

  return (
    <div className="min-h-screen" style={{ background: '#08111F' }}>
      <Navbar
        isSerialConnected={isSerialConnected}
        isWebSerialSupported={isWebSerialSupported}
        onConnectESP32={connectESP32}
        onDisconnectESP32={disconnectESP32}
      />

      {/* Hero */}
      <HeroSection />

      {/* Live hand + movement + rep counter */}
      <LiveHandSection
        fingers={fingers}
        movement={movement}
        repCount={repCount}
        resetSession={resetSession}
        isSerialConnected={isSerialConnected}
        isWebSerialSupported={isWebSerialSupported}
        packetCount={packetCount}
        calibratedFlat={calibratedFlat}
        calibratedBent={calibratedBent}
        onCalibrateFlat={calibrateFlat}
        onCalibrateBent={calibrateBent}
        onConnectESP32={connectESP32}
        onDisconnectESP32={disconnectESP32}
      />

      {/* Individual finger sensor cards */}
      <SensorReadingsSection fingers={fingers} />

      {/* Live activity graph */}
      <GraphSection history={history} />

      {/* Exercise demonstrations */}
      <ExercisesSection />

      {/* How it works flow */}
      <HowItWorksSection />

      {/* Calibration + system status */}
      <CalibrationSection
        systemStatus={systemStatus}
        fingers={fingers}
        calibration={calibration}
        calibratedFlat={calibratedFlat}
        calibratedBent={calibratedBent}
        onCalibrateFlat={calibrateFlat}
        onCalibrateBent={calibrateBent}
        onResetCalibration={resetCalibration}
        isSerialConnected={isSerialConnected}
      />

      <Footer />
    </div>
  );
}
