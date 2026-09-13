/**
 * pages/Home/CalibrationSection.jsx
 *
 * Section 9 — Sensor Calibration.
 * Wraps CalibrationPanel + SystemStatus in a shared section.
 */

import CalibrationPanel from '../../components/status/CalibrationPanel';
import SystemStatus from '../../components/status/SystemStatus';
import SectionTitle from '../../components/common/SectionTitle';

/**
 * @param {{ systemStatus: import('../../types').SystemStatus }} props
 */
export default function CalibrationSection({ systemStatus }) {
  return (
    <section id="calibration" className="py-20 bg-gradient-to-br from-blue-50/40 to-purple-50/40">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-10">

        {/* Calibration */}
        <div>
          <SectionTitle
            emoji="⚙️"
            title="Glove Calibration"
            subtitle="Set the zero position for each sensor before starting a session."
          />
          <CalibrationPanel />
        </div>

        {/* System status */}
        <div>
          <SectionTitle
            emoji="🖥"
            title="System Status"
            subtitle="Live connection status of all system components."
          />
          <SystemStatus systemStatus={systemStatus} />
        </div>

      </div>
    </section>
  );
}
