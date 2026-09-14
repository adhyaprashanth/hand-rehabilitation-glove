/**
 * pages/Home/GraphSection.jsx — MotionPulse dark theme
 */

import SensorGraph from '../../components/sensors/SensorGraph';
import SectionTitle from '../../components/common/SectionTitle';

export default function GraphSection({ history }) {
  return (
    <section id="graph" className="py-24" style={{ background: '#08111F' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="LIVE SENSOR GRAPH"
          subtitle="Select any finger to view its bending percentage over time."
        />
        <SensorGraph history={history} />
      </div>
    </section>
  );
}
