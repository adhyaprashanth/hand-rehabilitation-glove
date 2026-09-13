/**
 * components/exercises/ExerciseVideoModal.jsx
 *
 * Clean, animated video modal for exercise demonstrations.
 * Opens when user clicks "Watch Demonstration" on an ExerciseCard.
 *
 * To change a video URL:
 *   Edit the `videoUrl` field in config/exercises.js — do not edit here.
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink } from 'lucide-react';

/**
 * @param {{ exercise: import('../../types').Exercise|null, onClose: function }} props
 */
export default function ExerciseVideoModal({ exercise, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Prevent body scroll while modal is open
  useEffect(() => {
    if (exercise) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [exercise]);

  return (
    <AnimatePresence>
      {exercise && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 modal-backdrop bg-black/40"
          />

          {/* Modal panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            transition={{ type: 'spring', stiffness: 260, damping: 24 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden">
              {/* Modal header */}
              <div className="flex items-center justify-between px-6 pt-6 pb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center text-xl ${exercise.iconBg || 'bg-blue-100'}`}>
                    {exercise.emoji}
                  </div>
                  <div>
                    <h2 className="font-display font-700 text-lg text-gray-800">
                      {exercise.name}
                    </h2>
                    <p className="text-sm text-gray-400">{exercise.duration}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Video embed */}
              <div className="relative mx-6 mb-2 rounded-2xl overflow-hidden bg-gray-100"
                style={{ aspectRatio: '16/9' }}>
                <iframe
                  src={exercise.videoUrl}
                  title={`${exercise.name} demonstration`}
                  className="absolute inset-0 w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>

              {/* Footer */}
              <div className="px-6 py-4 flex flex-col gap-3">
                <p className="text-sm text-gray-600">{exercise.description}</p>

                <div className="flex flex-wrap gap-2">
                  {(exercise.benefits || []).map(b => (
                    <span key={b} className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                      ✓ {b}
                    </span>
                  ))}
                </div>

                {/* Demo flow reminder */}
                <div className="flex items-center gap-2 text-xs text-purple-500 bg-purple-50 px-3 py-2 rounded-xl border border-purple-100 mt-1">
                  <span>🧤</span>
                  <span>Watch this, then perform the movement with the glove to see it detected!</span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
