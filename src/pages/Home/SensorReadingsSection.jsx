/**
 * pages/Home/SensorReadingsSection.jsx — Rehabilitation Portal
 */

import { motion } from 'framer-motion';
import FingerCard from '../../components/sensors/FingerCard';
import SectionTitle from '../../components/common/SectionTitle';

export default function SensorReadingsSection({ fingers = [] }) {
  return (
    <section id="sensor-readings" className="py-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="FINGER MOBILITY STAGES"
          subtitle="Real-time range-of-motion analysis across each individual finger — from resting extension to full grip."
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

        {/* Clinical Range Legend */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-8 flex items-center justify-center gap-8 flex-wrap text-xs text-slate-400"
        >
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
            <span>FULL FLEXION (90° Grip)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <span>FUNCTIONAL RANGE (45° Mid-Motion)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400" />
            <span>RESTING EXTENSION (0° Straight)</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
