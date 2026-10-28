/**
 * pages/Home/ExercisesSection.jsx — Rehabilitation Portal
 *
 * Guided hand therapy routine selector and interactive exercise tracking.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, CheckCircle2, Play, RotateCcw, Award } from 'lucide-react';
import ExerciseCard from '../../components/exercises/ExerciseCard';
import ExerciseVideoModal from '../../components/exercises/ExerciseVideoModal';
import SectionTitle from '../../components/common/SectionTitle';
import { EXERCISES, EXERCISE_MAP } from '../../config/exercises';

export default function ExercisesSection({
  activeExerciseId = 'hand-flexion',
  onSelectExercise,
  exerciseReps = {},
  onManualRep,
  onResetReps,
}) {
  const [modalExercise, setModalExercise] = useState(null);

  const activeExercise = EXERCISE_MAP[activeExerciseId] || EXERCISES[0];
  const activeCount = exerciseReps[activeExerciseId] || 0;
  const isGoalReached = activeCount >= (activeExercise?.repsTarget || 10);

  return (
    <section id="exercises" className="py-20" style={{ background: 'var(--bg-secondary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="GUIDED THERAPY EXERCISES"
          subtitle="Select a physical therapy routine to practice. Perform the movement with your glove to record repetitions and track recovery."
        />

        {/* Active Exercise Focus Panel */}
        {activeExercise && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10 p-6 rounded-2xl border transition-all"
            style={{
              background: 'var(--bg-card)',
              borderColor: activeExercise.accent,
              boxShadow: `0 0 24px ${activeExercise.accent}20, 0 4px 16px rgba(0,0,0,0.1)`,
            }}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{
                    background: activeExercise.accent + '20',
                    border: `1px solid ${activeExercise.accent}60`,
                  }}
                >
                  <Target className="w-6 h-6" style={{ color: activeExercise.accent }} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="label-mono" style={{ color: activeExercise.accent }}>
                      CURRENT THERAPY GOAL
                    </span>
                    {isGoalReached && (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-400 font-semibold border border-emerald-500/40">
                        GOAL COMPLETED!
                      </span>
                    )}
                  </div>
                  <h3 className="font-display font-700 text-xl text-slate-900 dark:text-white mt-0.5">
                    {activeExercise.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
                    {activeExercise.description}
                  </p>
                </div>
              </div>

              {/* Progress Counters & Actions */}
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-right">
                  <div className="font-display font-800 text-3xl leading-none" style={{ color: activeExercise.accent }}>
                    {activeCount}{' '}
                    <span className="text-sm font-normal text-slate-400">/ {activeExercise.repsTarget}</span>
                  </div>
                  <div className="label-mono text-[10px] text-slate-400 mt-1">REPS COMPLETED</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setModalExercise(activeExercise)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white transition-all"
                    style={{
                      background: activeExercise.accent,
                      boxShadow: `0 0 16px ${activeExercise.accent}40`,
                    }}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Watch Demo</span>
                  </button>

                  <button
                    onClick={() => onResetReps && onResetReps(activeExerciseId)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white border"
                    style={{ background: 'var(--bg-card-elevated)', borderColor: 'var(--border-subtle)' }}
                    title="Reset reps for this routine"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Completion Banner */}
            <AnimatePresence>
              {isGoalReached && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mt-4 pt-4 border-t flex items-center justify-between gap-3 text-xs text-emerald-400"
                  style={{ borderColor: 'rgba(52,211,153,0.3)' }}
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span className="font-semibold">
                      Excellent work! You reached the target repetitions for this session.
                    </span>
                  </div>
                  <span className="label-mono text-emerald-300">STAGE COMPLETE</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXERCISES.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              isActive={exercise.id === activeExerciseId}
              currentReps={exerciseReps[exercise.id] || 0}
              onSelectExercise={onSelectExercise}
              onWatchVideo={setModalExercise}
              onManualRep={onManualRep}
            />
          ))}
        </div>
      </div>

      {/* Video Modal */}
      <ExerciseVideoModal
        exercise={modalExercise}
        onClose={() => setModalExercise(null)}
      />
    </section>
  );
}
