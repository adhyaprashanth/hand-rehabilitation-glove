/**
 * pages/Home/GraphSection.jsx
 *
 * Section 6 — Live Sensor Activity Graph.
 * Wraps the SensorGraph component in a section layout.
 */

import SensorGraph from '../../components/sensors/SensorGraph';
import SectionTitle from '../../components/common/SectionTitle';

/**
 * @param {{ history: Object }} props
 */
export default function GraphSection({ history }) {
  return (
    <section id="graph" className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          emoji="📈"
          title="Live Sensor Activity"
          subtitle="Select a finger to see how its bending changes over time."
        />
        <SensorGraph history={history} />
      </div>
    </section>
  );
}
