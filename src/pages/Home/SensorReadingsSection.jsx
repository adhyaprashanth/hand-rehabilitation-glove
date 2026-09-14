/**
 * pages/Home/SensorReadingsSection.jsx — MotionPulse dark theme
 */

import { motion } from 'framer-motion';
import FingerCard from '../../components/sensors/FingerCard';
import SectionTitle from '../../components/common/SectionTitle';

export default function SensorReadingsSection({ fingers = [] }) {
  return (
    <section id="sensor-readings" className="py-24" style={{ background: '#0C1828' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="SENSOR READINGS"
          subtitle="Five independent flex sensors — each individually calibrated, each monitored at 150ms intervals."
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
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
            >
              <FingerCard finger={finger} />
            </motion.div>
          ))}
        </motion.div>

        {/* Status legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex items-center justify-center gap-6 flex-wrap"
        >
          {[
            { color: '#FB7185', label: 'BENDING  ≥ 60%' },
            { color: '#3B82F6', label: 'ACTIVE  20–60%' },
            { color: '#2A3F58', label: 'RESTING  < 20%' },
          ].map(({ color, label }) => (
            <div key={label} className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: color, boxShadow: color !== '#2A3F58' ? `0 0 6px ${color}` : 'none' }} />
              <span className="label-mono" style={{ color: '#7090B0', fontSize: '0.6rem', letterSpacing: '0.08em' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
