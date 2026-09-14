/**
 * pages/Home/LiveHandSection.jsx — MotionPulse dark theme
 */

import HandVisualization from '../../components/hand/HandVisualization';
import MovementDetector from '../../components/dashboard/MovementDetector';
import RepCounter from '../../components/dashboard/RepCounter';
import SectionTitle from '../../components/common/SectionTitle';

export default function LiveHandSection({ fingers, movement, repCount, resetSession }) {
  return (
    <section id="live-hand" className="py-24" style={{ background: '#08111F' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="LIVE HAND ACTIVITY"
          subtitle="Real-time monitoring of individual finger movements — 150ms refresh rate."
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Hand visualization panel */}
          <div
            className="lg:col-span-1 flex flex-col items-center justify-center gap-4 p-8 rounded-xl"
            style={{
              background: '#0F1E30',
              border: '1px solid #26354A',
              boxShadow: '0 0 32px rgba(59,130,246,0.06)',
            }}
          >
            <HandVisualization fingers={fingers} />
          </div>

          {/* Right — movement detector + rep counter */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <MovementDetector movement={movement} />
            <RepCounter repCount={repCount} onReset={resetSession} />
          </div>
        </div>
      </div>
    </section>
  );
}
