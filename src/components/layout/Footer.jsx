/**
 * components/layout/Footer.jsx
 */

import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';

export default function Footer({ isDemoMode }) {
  return (
    <footer className="bg-gray-50 border-t border-gray-100 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
            <span className="text-sm">🧤</span>
          </div>
          <div>
            <p className="font-display font-600 text-sm text-gray-700">Hand Rehabilitation Glove</p>
            <p className="text-xs text-gray-400">College Project · Smart Wearable Prototype</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-400">
          {isDemoMode && (
            <motion.div
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1.5"
            >
              <Zap className="w-3 h-3 text-purple-400" />
              <span className="text-purple-500 font-medium">Demo Mode Active</span>
            </motion.div>
          )}
          <span>5 Flex Sensors · ESP32 · Firebase</span>
        </div>
      </div>
    </footer>
  );
}
