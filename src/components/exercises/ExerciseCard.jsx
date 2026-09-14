/**
 * components/exercises/ExerciseCard.jsx — MotionPulse dark theme
 *
 * Dark exercise card. Accent color, no pastel bg classes,
 * all exercise data now comes as hex values from config/exercises.js.
 */

import { motion } from 'framer-motion';
import { Play, Clock, Repeat } from 'lucide-react';

export default function ExerciseCard({ exercise, onWatch }) {
  const {
    name        = 'Exercise',
    description = '',
    duration    = '30s',
    repsTarget  = 10,
    accent      = '#3B82F6',
    bgColor     = 'rgba(59,130,246,0.06)',
    borderColor = 'rgba(59,130,246,0.2)',
    iconBg      = 'rgba(59,130,246,0.12)',
    iconColor   = '#60A5FA',
    btnColor    = '#3B82F6',
    benefits    = [],
  } = exercise || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5, boxShadow: `0 16px 40px rgba(0,0,0,0.5), 0 0 20px ${accent}18` }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 p-6"
      style={{
        background: bgColor,
        border: `1px solid ${borderColor}`,
        borderRadius: '1rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Icon circle */}
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: iconBg, border: `1px solid ${borderColor}` }}
      >
        <Play className="w-5 h-5" style={{ color: iconColor }} />
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="font-display font-700 text-base mb-1.5" style={{ color: '#E8F2FF' }}>{name}</h3>
        <p className="text-xs leading-relaxed" style={{ color: '#95B2CC' }}>{description}</p>
      </div>

      {/* Benefits */}
      {benefits.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {benefits.map(b => (
            <span
              key={b}
              className="px-2 py-0.5 rounded text-xs"
              style={{ background: accent + '12', color: accent, border: `1px solid ${accent}25` }}
            >
              {b}
            </span>
          ))}
        </div>
      )}

      {/* Meta */}
      <div className="flex items-center gap-4" style={{ color: '#7090B0' }}>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3" />
          <span className="label-mono" style={{ fontSize: '0.6rem' }}>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Repeat className="w-3 h-3" />
          <span className="label-mono" style={{ fontSize: '0.6rem' }}>{repsTarget} REPS TARGET</span>
        </div>
      </div>

      {/* CTA */}
      <button
        onClick={() => onWatch(exercise)}
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 active:scale-95"
        style={{
          background: btnColor,
          color: '#fff',
          border: `1px solid ${accent}40`,
          boxShadow: `0 0 16px ${accent}30`,
        }}
        onMouseEnter={e => e.currentTarget.style.boxShadow = `0 0 24px ${accent}50`}
        onMouseLeave={e => e.currentTarget.style.boxShadow = `0 0 16px ${accent}30`}
      >
        <Play className="w-3.5 h-3.5 fill-white" />
        Watch Demonstration
      </button>
    </motion.div>
  );
}
