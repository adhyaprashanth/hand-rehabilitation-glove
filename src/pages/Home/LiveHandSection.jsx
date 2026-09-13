/**
 * pages/Home/LiveHandSection.jsx
 *
 * Section 2 — Live Hand Activity.
 * Shows the animated hand visualization alongside movement and rep data.
 */

import HandVisualization from '../../components/hand/HandVisualization';
import MovementDetector from '../../components/dashboard/MovementDetector';
import RepCounter from '../../components/dashboard/RepCounter';
import SectionTitle from '../../components/common/SectionTitle';

/**
 * @param {{ fingers, movement, repCount, resetSession }} props
 */
export default function LiveHandSection({ fingers, movement, repCount, resetSession }) {
  return (
    <section id="live-hand" className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          emoji="✋"
          title="Live Hand Activity"
          subtitle="Real-time monitoring of individual finger movements."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Hand visualization — center/left */}
          <div className="lg:col-span-1 flex flex-col items-center gap-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-8 border border-blue-100">
            <HandVisualization fingers={fingers} />
          </div>

          {/* Right panel — movement + rep counter */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <MovementDetector movement={movement} />
            <RepCounter repCount={repCount} onReset={resetSession} />
          </div>
        </div>
      </div>
    </section>
  );
}
