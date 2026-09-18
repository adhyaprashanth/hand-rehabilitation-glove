/**
 * components/exercises/ExerciseVideoModal.jsx — DEXTER dark theme
 *
 * Local MP4 exercise video modal.
 * Videos loop continuously.
 * Escape key and body scroll lock behaviour preserved.
 */

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Activity } from 'lucide-react';

export default function ExerciseVideoModal({ exercise, onClose }) {
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handler);

    return () => {
      window.removeEventListener('keydown', handler);
    };
  }, [onClose]);

  useEffect(() => {
    if (exercise) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
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
            className="fixed inset-0 z-50"
            style={{
              background: 'rgba(6,13,26,0.88)',
            }}
          />

          {/* Modal */}
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.92,
              y: 32,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.92,
              y: 32,
            }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 24,
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            aria-modal="true"
            role="dialog"
          >
            <div
              className="relative w-full max-w-2xl overflow-hidden"
              style={{
                background: '#0F1E30',
                border: `1px solid ${
                  exercise.borderColor || '#2A3F58'
                }`,
                borderRadius: '1.25rem',
                boxShadow: `
                  0 24px 64px rgba(0,0,0,0.7),
                  0 0 32px ${
                    exercise.accent || '#3B82F6'
                  }18
                `,
              }}
            >

              {/* Header */}
              <div
                className="flex items-center justify-between px-6 pt-5 pb-4"
                style={{
                  borderBottom: '1px solid #1A2844',
                }}
              >
                <div className="flex items-center gap-3">

                  {/* Icon */}
                  <div
                    className="w-9 h-9 rounded-lg flex items-center justify-center"
                    style={{
                      background:
                        exercise.iconBg ||
                        'rgba(59,130,246,0.12)',
                      border: `1px solid ${
                        exercise.borderColor ||
                        '#2A3F58'
                      }`,
                    }}
                  >
                    <Activity
                      className="w-4 h-4"
                      style={{
                        color:
                          exercise.iconColor ||
                          '#60A5FA',
                      }}
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <h2 className="font-display font-700 text-base text-white">
                      {exercise.name}
                    </h2>

                    <p
                      className="label-mono"
                      style={{
                        color: '#7090B0',
                        fontSize: '0.6rem',
                      }}
                    >
                      {exercise.duration} ·{' '}
                      {exercise.repsTarget} REPS TARGET
                    </p>
                  </div>
                </div>

                {/* Close button */}
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    color: '#7090B0',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color =
                      '#7090B0';
                  }}
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* VIDEO */}
              <div
                className="relative mx-5 my-4 rounded-xl overflow-hidden"
                style={{ background: '#060E1A' }}
              >
                <video
                  key={exercise.videoUrl}
                  src={exercise.videoUrl}
                  controls
                  loop
                  muted
                  playsInline
                  autoPlay
                  className="w-full rounded-xl"
                  style={{ display: 'block', maxHeight: '360px', objectFit: 'contain' }}
                />
              </div>

              {/* Footer */}
              <div className="px-6 pb-5 flex flex-col gap-3">

                {/* Description */}
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    color: '#95B2CC',
                  }}
                >
                  {exercise.description}
                </p>

                {/* Benefits */}
                <div className="flex flex-wrap gap-1.5">
                  {(exercise.benefits || []).map((benefit) => (
                    <span
                      key={benefit}
                      className="px-2.5 py-1 rounded-md text-xs font-medium"
                      style={{
                        background:
                          (exercise.accent ||
                            '#3B82F6') + '12',
                        color:
                          exercise.accent ||
                          '#60A5FA',
                        border: `1px solid ${
                          exercise.accent ||
                          '#3B82F6'
                        }30`,
                      }}
                    >
                      ✓ {benefit}
                    </span>
                  ))}
                </div>

                {/* Hint */}
                <div
                  className="flex items-center gap-2 text-xs px-3 py-2 rounded-lg"
                  style={{
                    background:
                      'rgba(59,130,246,0.08)',
                    border:
                      '1px solid rgba(59,130,246,0.2)',
                    color: '#60A5FA',
                  }}
                >
                  <Activity className="w-3 h-3 flex-shrink-0" />

                  <span>
                    Watch this, then perform the
                    movement with the glove to see it
                    detected in real time.
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}