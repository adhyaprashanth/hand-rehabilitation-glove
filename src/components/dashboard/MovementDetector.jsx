/**
 * components/dashboard/MovementDetector.jsx
 *
 * Displays the currently detected hand/finger movement.
 * Smoothly transitions between movements as they change.
 * Shows confidence level and a "Movement Recognised" badge.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Activity } from 'lucide-react';

/**
 * @param {{ movement: import('../../types').MovementData }} props
 */
export default function MovementDetector({ movement }) {
  const {
    name = 'Detecting...',
    emoji = '🤔',
    description = '',
    detected = false,
    confidence = 0,
  } = movement || {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-100 p-6 flex flex-col gap-4"
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-purple-100 opacity-30 -translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-purple-500" />
        <p className="text-sm font-semibold text-purple-600">Movement Detection</p>
      </div>

      {/* Movement display */}
      <div className="flex flex-col items-center gap-3 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 12, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center gap-2"
          >
            <span className="text-5xl">{emoji}</span>
            <h3 className="font-display font-700 text-xl text-gray-800">{name}</h3>
            {description && (
              <p className="text-sm text-gray-400 text-center">{description}</p>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Recognised badge */}
        <AnimatePresence>
          {detected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-green-100 border border-green-200 rounded-full"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
              <span className="text-xs font-semibold text-green-700">✓ Movement Recognised</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Confidence bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs text-gray-400">
          <span>Confidence</span>
          <span className="font-mono font-semibold text-purple-600">{confidence}%</span>
        </div>
        <div className="h-2 bg-purple-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-purple-400 to-blue-400"
            animate={{ width: `${confidence}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
