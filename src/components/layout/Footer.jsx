/**
 * components/layout/Footer.jsx — DEXTER dark theme
 */

import { motion } from 'framer-motion';
import { Activity, Radio } from 'lucide-react';

export default function Footer() {
  return (
    <footer style={{ background: '#08111F', borderTop: '1px solid #1A2844' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Activity className="w-4 h-4" style={{ color: '#3B82F6' }} />
          </div>
          <div>
            <p className="font-display font-600 text-sm text-white">DEXTER</p>
            <p className="label-mono" style={{ color: '#7090B0', fontSize: '0.58rem' }}>
              HAND REHABILITATION GLOVE · COLLEGE PROJECT
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <motion.div
            className="flex items-center gap-1.5"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          >
            <Radio className="w-3 h-3" style={{ color: '#34D399' }} />
            <span className="label-mono" style={{ color: '#34D399', fontSize: '0.6rem', letterSpacing: '0.08em' }}>
              DEMO MODE ACTIVE
            </span>
          </motion.div>
          <span className="label-mono" style={{ color: '#2A3F58', fontSize: '0.6rem' }}>
            5 SENSORS · ESP32 · FIREBASE
          </span>
        </div>
      </div>
    </footer>
  );
}
