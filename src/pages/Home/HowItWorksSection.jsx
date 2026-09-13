/**
 * pages/Home/HowItWorksSection.jsx
 *
 * Section 8 — How the Glove Works.
 * Shows the animated DataFlow pipeline diagram.
 */

import DataFlow from '../../components/flow/DataFlow';
import SectionTitle from '../../components/common/SectionTitle';
import { motion } from 'framer-motion';

export default function HowItWorksSection() {
  return (
    <section id="how-it-works" className="py-20 bg-white">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          emoji="🌸"
          title="How It Works"
          subtitle="From finger movement to real-time feedback — in 5 simple steps."
        />

        <DataFlow />

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
          className="text-center text-sm text-gray-400 mt-8"
        >
          The entire pipeline runs in real time — from the glove to this screen in milliseconds. ✨
        </motion.p>
      </div>
    </section>
  );
}
