/**
 * components/exercises/ExerciseCard.jsx — Rehabilitation Portal
 *
 * Interactive exercise card allowing patients to select and perform routines,
 * view live rep progress, and watch video demonstrations.
 */

import { motion } from 'framer-motion';
import { Play, Clock, Repeat, CheckCircle2, Target, Award } from 'lucide-react';

export default function ExerciseCard({
  exercise,
  isActive = false,
  currentReps = 0,
  onSelectExercise,
  onWatchVideo,
  onManualRep,
}) {
  const {
    id          = '',
    name        = 'Exercise',
    description = '',
    duration    = '30s',
    repsTarget  = 12,
    accent      = '#3B82F6',
    benefits    = [],
  } = exercise || {};

  const isCompleted = currentReps >= repsTarget;
  const progressPercent = Math.min(100, Math.round((currentReps / repsTarget) * 100));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden"
      style={{
        background: isActive
          ? 'var(--bg-card-elevated)'
          : 'var(--bg-card)',
        borderColor: isActive
          ? accent
          : 'var(--border-subtle)',
        boxShadow: isActive
          ? `0 0 24px ${accent}25, 0 4px 16px rgba(0,0,0,0.1)`
          : 'var(--shadow-card)',
      }}
    >
      {/* Top active indicator line */}
      {isActive && (
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ background: accent }}
        />
      )}

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{
            background: isActive ? accent + '20' : 'rgba(59,130,246,0.1)',
            border: `1px solid ${isActive ? accent + '50' : 'var(--border-subtle)'}`,
          }}
        >
          {isCompleted ? (
            <Award className="w-5 h-5 text-emerald-400" />
          ) : (
            <Target className="w-5 h-5" style={{ color: accent }} />
          )}
        </div>

        {/* Status chip */}
        {isActive ? (
          <div
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md"
            style={{
              background: isCompleted ? 'rgba(16,185,129,0.15)' : accent + '18',
              border: `1px solid ${isCompleted ? '#10B981' : accent + '50'}`,
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full animate-pulse"
              style={{ background: isCompleted ? '#10B981' : accent }}
            />
            <span
              className="label-mono font-semibold"
              style={{ color: isCompleted ? '#10B981' : accent, fontSize: '0.6rem' }}
            >
              {isCompleted ? 'COMPLETED' : 'ACTIVE ROUTINE'}
            </span>
          </div>
        ) : (
          <span className="label-mono text-slate-400" style={{ fontSize: '0.6rem' }}>
            ROUTINE
          </span>
        )}
      </div>

      {/* Title & Description */}
      <div>
        <h3 className="font-display font-700 text-base text-slate-900 dark:text-white mb-1">
          {name}
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Clinical Benefits */}
      {benefits.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {benefits.map(b => (
            <span
              key={b}
              className="px-2 py-0.5 rounded text-[11px] font-medium"
              style={{
                background: 'rgba(59,130,246,0.08)',
                color: accent,
                border: `1px solid ${accent}25`,
              }}
            >
              {b}
            </span>
          ))}
        </div>
      )}

      {/* Progress & Target Section */}
      <div
        className="p-3 rounded-xl flex flex-col gap-2 mt-auto"
        style={{
          background: 'rgba(15,23,42,0.04)',
          border: '1px solid var(--border-subtle)',
        }}
      >
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
            <Repeat className="w-3.5 h-3.5" />
            <span className="label-mono">REPS:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">
              {currentReps} / {repsTarget}
            </span>
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <Clock className="w-3 h-3" />
            <span className="label-mono">{duration}</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700/50">
          <motion.div
            className="h-full rounded-full"
            style={{
              background: isCompleted ? '#10B981' : accent,
            }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ type: 'spring', stiffness: 70, damping: 20 }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={() => onSelectExercise(id)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 active:scale-95"
          style={{
            background: isActive ? accent : 'rgba(59,130,246,0.1)',
            color: isActive ? '#FFFFFF' : accent,
            border: `1px solid ${isActive ? accent : accent + '30'}`,
            boxShadow: isActive ? `0 0 16px ${accent}40` : 'none',
          }}
        >
          {isActive ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Selected</span>
            </>
          ) : (
            <>
              <Target className="w-3.5 h-3.5" />
              <span>Start Routine</span>
            </>
          )}
        </button>

        <button
          onClick={() => onWatchVideo(exercise)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all duration-200 hover:bg-slate-800/10 active:scale-95"
          style={{
            background: 'transparent',
            color: 'var(--text-secondary)',
            border: '1px solid var(--border-subtle)',
          }}
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>Watch Demo</span>
        </button>
      </div>

      {/* Manual Test Increment (for easy loose sensor testing) */}
      {isActive && (
        <div className="flex justify-end pt-0.5">
          <button
            onClick={() => onManualRep(id)}
            className="text-[10px] text-slate-400 hover:text-cyan-400 underline decoration-dotted"
          >
            +1 Rep (Test Click)
          </button>
        </div>
      )}
    </motion.div>
  );
}
