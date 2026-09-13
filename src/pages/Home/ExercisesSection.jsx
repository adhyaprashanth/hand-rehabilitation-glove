/**
 * pages/Home/ExercisesSection.jsx
 *
 * Section 7 — Exercise Demonstration.
 * Renders ExerciseCards with video modal integration.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import ExerciseCard from '../../components/exercises/ExerciseCard';
import ExerciseVideoModal from '../../components/exercises/ExerciseVideoModal';
import SectionTitle from '../../components/common/SectionTitle';
import { EXERCISES } from '../../config/exercises';

export default function ExercisesSection() {
  const [activeExercise, setActiveExercise] = useState(null);

  return (
    <section id="exercises" className="py-20 bg-gradient-to-br from-purple-50/50 to-peach-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          emoji="🎥"
          title="Try an Exercise"
          subtitle="Watch the movement and see how the glove detects it."
        />

        {/* Demo flow hint */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10 text-sm text-gray-500"
        >
          {['👁 Watch Exercise', '→', '🧤 Perform with Glove', '→', '✨ Movement Detected', '→', '🔢 Rep Counted'].map((step, i) => (
            <span
              key={i}
              className={step === '→' ? 'text-gray-300' : 'px-3 py-1 bg-white rounded-full border border-gray-100 shadow-soft text-xs font-medium'}
            >
              {step}
            </span>
          ))}
        </motion.div>

        {/* Exercise grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {EXERCISES.map((exercise, i) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <ExerciseCard exercise={exercise} onWatch={setActiveExercise} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Video modal */}
      <ExerciseVideoModal
        exercise={activeExercise}
        onClose={() => setActiveExercise(null)}
      />
    </section>
  );
}
