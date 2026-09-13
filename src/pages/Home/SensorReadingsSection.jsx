/**
 * pages/Home/SensorReadingsSection.jsx
 *
 * Section 3 — Live Sensor Readings.
 * Shows all five FingerCards in a responsive grid.
 */

import { motion } from 'framer-motion';
import FingerCard from '../../components/sensors/FingerCard';
import SectionTitle from '../../components/common/SectionTitle';

/**
 * @param {{ fingers: import('../../types').FingerData[] }} props
 */
export default function SensorReadingsSection({ fingers = [] }) {
  return (
    <section id="sensor-readings" className="py-20 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          emoji="📊"
          title="Live Sensor Readings"
          subtitle="Five independent flex sensors, each monitoring a different finger."
        />

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4"
        >
          {fingers.map((finger, i) => (
            <motion.div
              key={finger.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <FingerCard finger={finger} />
            </motion.div>
          ))}
        </motion.div>

        {/* Info strip */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-3 flex-wrap"
        >
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
            Bending ≥ 60%
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Active 20–60%
          </span>
          <span className="flex items-center gap-1.5 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-gray-300" />
            Resting &lt; 20%
          </span>
        </motion.div>
      </div>
    </section>
  );
}
