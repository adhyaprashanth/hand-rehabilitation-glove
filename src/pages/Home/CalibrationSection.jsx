/**
 * pages/Home/CalibrationSection.jsx — DEXTER dark theme
 */

import CalibrationPanel from '../../components/status/CalibrationPanel';
import SystemStatus from '../../components/status/SystemStatus';
import SectionTitle from '../../components/common/SectionTitle';

export default function CalibrationSection({
  systemStatus,
  fingers,
  calibration,
  calibratedFlat,
  calibratedBent,
  onCalibrateFlat,
  onCalibrateBent,
  onResetCalibration,
  isSerialConnected,
}) {
  return (
    <section id="calibration" className="py-24" style={{ background: '#0C1828' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-14">

        {/* Calibration */}
        <div>
          <SectionTitle
            title="SENSOR CALIBRATION"
            subtitle="Record your hand's Flat (0%) and Bent (100%) limits to calibrate the glove in real-time."
          />
          <CalibrationPanel
            fingers={fingers}
            calibration={calibration}
            calibratedFlat={calibratedFlat}
            calibratedBent={calibratedBent}
            onCalibrateFlat={onCalibrateFlat}
            onCalibrateBent={onCalibrateBent}
            onResetCalibration={onResetCalibration}
            isSerialConnected={isSerialConnected}
          />
        </div>

        {/* System status */}
        <div>
          <SectionTitle
            title="SYSTEM STATUS"
            subtitle="Live connection status of all hardware and cloud components."
          />
          <SystemStatus systemStatus={systemStatus} />
        </div>

      </div>
    </section>
  );
}
