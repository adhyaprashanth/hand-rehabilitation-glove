/**
 * App.jsx
 *
 * Root application component.
 *
 * ARCHITECTURE:
 *   - useSensorData() is the single data source for all sensor state.
 *   - Data flows DOWN from here to all sections as props.
 *   - No section directly calls the simulator or Firebase — only this component does.
 *   - This keeps the data layer completely separate from the UI layer.
 *
 * TO CONNECT FIREBASE LATER:
 *   1. Set USE_FIREBASE = true in hooks/useSensorData.js
 *   2. Implement subscribeToSensorData() in services/firebase/index.js
 *   3. Nothing else in the UI needs to change.
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
    resetSession,
  } = useSensorData();

  return (
    <div className="min-h-screen" style={{ background: '#08111F' }}>
      <Navbar />

      {/* Hero */}
      <HeroSection />

      {/* Live hand + movement + rep counter */}
      <LiveHandSection
        fingers={fingers}
        movement={movement}
        repCount={repCount}
        resetSession={resetSession}
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
      <CalibrationSection systemStatus={systemStatus} />

      <Footer />
    </div>
  );
}
