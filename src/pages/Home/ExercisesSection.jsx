/**
 * pages/Home/ExercisesSection.jsx — MotionPulse dark theme
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, Activity, CheckCircle2, Hash } from 'lucide-react';
import ExerciseCard from '../../components/exercises/ExerciseCard';
import ExerciseVideoModal from '../../components/exercises/ExerciseVideoModal';
import SectionTitle from '../../components/common/SectionTitle';
import { EXERCISES } from '../../config/exercises';

const FLOW_STEPS = [
  { icon: Eye,           label: 'Watch Exercise' },
  { icon: Activity,      label: 'Perform with Glove' },
  { icon: CheckCircle2,  label: 'Movement Detected' },
  { icon: Hash,          label: 'Rep Counted' },
];

export default function ExercisesSection() {
  const [activeExercise, setActiveExercise] = useState(null);

  return (
    <section id="exercises" className="py-24" style={{ background: '#0C1828' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="EXERCISE GUIDE"
          subtitle="Watch the movement, then perform it with the glove — see it detected in real time."
        />

        {/* Demo flow steps */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap items-center justify-center gap-2 mb-10"
        >
          {FLOW_STEPS.map(({ icon: Icon, label }, i) => (
            <div key={label} className="flex items-center gap-2">
              <div
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                style={{ background: 'rgba(26,40,68,0.8)', border: '1px solid #26354A' }}
              >
                <Icon className="w-3 h-3" style={{ color: '#60A5FA' }} />
                <span className="label-mono" style={{ color: '#95B2CC', fontSize: '0.6rem', letterSpacing: '0.06em' }}>{label.toUpperCase()}</span>
              </div>
              {i < FLOW_STEPS.length - 1 && (
                <span className="label-mono" style={{ color: '#2A3F58', fontSize: '0.7rem' }}>→</span>
              )}
            </div>
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

      <ExerciseVideoModal
        exercise={activeExercise}
        onClose={() => setActiveExercise(null)}
      />
    </section>
  );
}
