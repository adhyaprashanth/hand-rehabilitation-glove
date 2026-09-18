/**
 * components/dashboard/MovementDetector.jsx — DEXTER dark theme
 *
 * Dark card showing detected movement — clean, technical, no emojis as main UI.
 * Movement transitions preserved. Confidence bar uses electric blue → cyan gradient.
 */

import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Activity, Zap } from 'lucide-react';

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
      className="relative overflow-hidden flex flex-col gap-5 p-6"
      style={{
        background: '#0F1E30',
        border: '1px solid #26354A',
        borderRadius: '1rem',
        boxShadow: detected
          ? '0 0 24px rgba(59,130,246,0.15)'
          : '0 2px 12px rgba(0,0,0,0.4)',
        transition: 'box-shadow 0.5s',
      }}
    >
      {/* Top accent line — glows when detected */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{
          background: detected
            ? 'linear-gradient(90deg, #3B82F6, #22D3EE)'
            : '#2A3F58',
          opacity: detected ? 1 : 0.4,
          transition: 'all 0.5s',
        }} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4" style={{ color: '#3B82F6' }} />
          <span className="label-mono" style={{ color: '#60A5FA', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            MOVEMENT DETECTION
          </span>
        </div>
        <AnimatePresence>
          {detected && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
              style={{ background: 'rgba(52,211,153,0.12)', border: '1px solid rgba(52,211,153,0.3)' }}
            >
              <CheckCircle2 className="w-3 h-3" style={{ color: '#34D399' }} />
              <span className="label-mono" style={{ color: '#34D399', fontSize: '0.6rem' }}>RECOGNISED</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Movement name */}
      <div className="flex flex-col items-center gap-2 py-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={name}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            className="flex flex-col items-center gap-2"
          >
            {/* Emoji kept small as supplementary info, not the main visual */}
            {emoji && (
              <span className="text-3xl opacity-60">{emoji}</span>
            )}
            <h3
              className="font-display font-700 text-2xl text-center"
              style={{ color: detected ? '#E8F2FF' : '#95B2CC', transition: 'color 0.4s' }}
            >
              {name}
            </h3>
            {description && (
              <p className="text-xs text-center" style={{ color: '#7090B0' }}>{description}</p>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Confidence bar */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="label-mono" style={{ color: '#7090B0', fontSize: '0.6rem' }}>CONFIDENCE</span>
          <span className="font-mono text-xs font-semibold" style={{ color: '#60A5FA' }}>{confidence}%</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#152440' }}>
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
