/**
 * pages/Home/HowItWorksSection.jsx — DEXTER dark theme
 */

import { motion } from 'framer-motion';
import DataFlow from '../../components/flow/DataFlow';
import SectionTitle from '../../components/common/SectionTitle';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-24" style={{ background: '#08111F' }}>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="HOW IT WORKS"
          subtitle="From finger movement to real-time feedback — five steps, millisecond latency."
        />

        <DataFlow />

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-xs mt-8 label-mono"
          style={{ color: '#7090B0' }}
        >
          ENTIRE PIPELINE RUNS IN REAL TIME — GLOVE TO SCREEN IN MILLISECONDS
        </motion.p>
      </div>
    </section>
  );
}
