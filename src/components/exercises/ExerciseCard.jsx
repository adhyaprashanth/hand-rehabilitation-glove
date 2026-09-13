/**
 * components/exercises/ExerciseCard.jsx
 *
 * A single exercise card with name, description, and a "Watch Demonstration" button.
 * All exercise data comes from config/exercises.js.
 */

import { motion } from 'framer-motion';
import { Play, Clock } from 'lucide-react';

/**
 * @param {{ exercise: import('../../types').Exercise, onWatch: function }} props
 */
export default function ExerciseCard({ exercise, onWatch }) {
  const {
    name = 'Exercise',
    emoji = '🤸',
    description = '',
    duration = '30s',
    repsTarget = 10,
    bgColor = 'bg-blue-50',
    borderColor = 'border-blue-200',
    iconBg = 'bg-blue-100',
    iconColor = 'text-blue-600',
    btnColor = 'bg-blue-500 hover:bg-blue-600',
  } = exercise || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6, boxShadow: '0 16px 40px -8px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3 }}
      className={`rounded-3xl border ${bgColor} ${borderColor} p-6 flex flex-col gap-4 transition-shadow`}
    >
      {/* Icon */}
      <div className={`w-14 h-14 rounded-2xl ${iconBg} flex items-center justify-center text-3xl shadow-sm`}>
        {emoji}
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className={`font-display font-700 text-lg ${iconColor} mb-1`}>{name}</h3>
        <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1">
          <span>🔢</span>
          <span>{repsTarget} reps target</span>
        </div>
      </div>

      {/* CTA button */}
      <button
        onClick={() => onWatch(exercise)}
        className={`flex items-center justify-center gap-2 w-full py-3 rounded-2xl text-white text-sm font-semibold transition-all duration-200 active:scale-95 ${btnColor} shadow-sm`}
      >
        <Play className="w-4 h-4 fill-white" />
        Watch Demonstration
      </button>
    </motion.div>
  );
}
