/**
 * components/dashboard/MovementDetector.jsx — Rehabilitation Portal
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Activity } from 'lucide-react';

export default function MovementDetector({ movement }) {
  const {
    name        = 'Detecting...',
    emoji       = '',
    description = '',
    detected    = false,
    confidence  = 0,
  } = movement || {};

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden flex flex-col gap-4 p-6 rounded-2xl border transition-all duration-300"
      style={{
        background: 'var(--bg-card)',
        borderColor: detected ? '#3B82F6' : 'var(--border-subtle)',
        boxShadow: detected ? '0 0 24px rgba(59,130,246,0.15)' : 'var(--shadow-card)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: detected
            ? 'linear-gradient(90deg, #3B82F6, #22D3EE)'
            : 'var(--border-subtle)',
          transition: 'all 0.5s',
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blue-500" />
          <span className="label-mono text-blue-500 font-semibold" style={{ fontSize: '0.65rem' }}>
            MOTION RECOGNITION
          </span>
        </div>
        <AnimatePresence>
          {detected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
              style={{ background: 'rgba(16,185,129,0.12)', border: '1px solid rgba(16,185,129,0.3)' }}
            >
              <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              <span className="label-mono text-emerald-500 font-semibold" style={{ fontSize: '0.6rem' }}>
                DETECTED
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Movement name */}
      <div className="flex flex-col items-center gap-2 py-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center gap-1.5"
          >
            {emoji && <span className="text-3xl">{emoji}</span>}
            <h3 className="font-display font-700 text-2xl text-center" style={{ color: 'var(--text-primary)' }}>
              {name}
            </h3>
            {description && (
              <p className="text-xs text-center" style={{ color: 'var(--text-secondary)' }}>
                {description}
              </p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confidence bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-xs">
          <span className="label-mono text-slate-400" style={{ fontSize: '0.6rem' }}>FORM ACCURACY</span>
          <span className="font-mono text-xs font-semibold text-blue-500">{confidence}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700/50">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #3B82F6, #22D3EE)' }}
            animate={{ width: `${confidence}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          />
        </div>
      </div>
    </motion.div>
  );
}
