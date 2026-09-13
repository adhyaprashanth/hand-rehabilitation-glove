/**
 * components/status/CalibrationPanel.jsx
 *
 * Simulated sensor calibration panel.
 * When "Calibrate Glove" is clicked, each sensor calibrates one by one
 * with a progress animation, ending in a success state.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Settings2 } from 'lucide-react';
import { FINGERS } from '../../constants/fingers';

const CALIBRATION_DELAY_PER_FINGER = 700; // ms

export default function CalibrationPanel() {
  const [status, setStatus] = useState('idle'); // 'idle' | 'running' | 'done'
  const [calibratedCount, setCalibratedCount] = useState(0);

  const startCalibration = useCallback(() => {
    setStatus('running');
    setCalibratedCount(0);

    FINGERS.forEach((_, i) => {
      setTimeout(() => {
        setCalibratedCount(i + 1);
        if (i === FINGERS.length - 1) {
          setTimeout(() => setStatus('done'), 300);
        }
      }, CALIBRATION_DELAY_PER_FINGER * (i + 1));
    });
  }, []);

  const reset = () => {
    setStatus('idle');
    setCalibratedCount(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-white border border-gray-100 shadow-soft p-6 flex flex-col gap-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-2xl bg-purple-50 flex items-center justify-center">
            <Settings2 className="w-5 h-5 text-purple-500" />
          </div>
          <div>
            <p className="font-display font-600 text-sm text-gray-800">Glove Calibration</p>
            <p className="text-xs text-gray-400">Set sensor zero positions</p>
          </div>
        </div>

        {status === 'done' && (
          <button
            onClick={reset}
            className="text-xs text-gray-400 hover:text-purple-600 underline transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* Sensor list */}
      <div className="space-y-2.5">
        {FINGERS.map((finger, i) => {
          const isDone = calibratedCount > i;
          const isCurrent = status === 'running' && calibratedCount === i;

          return (
            <motion.div
              key={finger.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-3 rounded-2xl transition-colors ${
                isDone ? 'bg-green-50 border border-green-100' : 'bg-gray-50 border border-gray-100'
              }`}
            >
              {/* Status icon */}
              <div className="w-7 h-7 flex-shrink-0 flex items-center justify-center">
                {isDone ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                  </motion.div>
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-gray-200" />
                )}
              </div>

              {/* Finger info */}
              <span className="text-lg">{finger.emoji}</span>
              <div className="flex-1">
                <p className={`text-sm font-semibold ${isDone ? 'text-green-700' : 'text-gray-500'}`}>
                  {finger.name} Sensor
                </p>
                {isDone && (
                  <p className="text-xs text-green-500">Calibrated ✓</p>
                )}
                {isCurrent && (
                  <p className="text-xs text-purple-500 animate-pulse">Calibrating...</p>
                )}
                {!isDone && !isCurrent && (
                  <p className="text-xs text-gray-300">Waiting</p>
                )}
              </div>

              {/* Progress bar for current */}
              {isCurrent && (
                <div className="w-16 h-1.5 bg-purple-100 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-purple-400 rounded-full"
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: CALIBRATION_DELAY_PER_FINGER / 1000 * 0.85, ease: 'linear' }}
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Success state */}
      <AnimatePresence>
        {status === 'done' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-2xl"
          >
            <span className="text-xl">🎉</span>
            <span className="font-display font-700 text-green-700">Glove Ready!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calibrate button */}
      {status !== 'done' && (
        <button
          onClick={startCalibration}
          disabled={status === 'running'}
          className={`w-full py-3 rounded-2xl text-sm font-semibold transition-all duration-200 active:scale-95 ${
            status === 'running'
              ? 'bg-purple-200 text-purple-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:shadow-lg hover:scale-[1.02]'
          }`}
        >
          {status === 'running' ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Calibrating...
            </span>
          ) : (
            '⚙️ Calibrate Glove'
          )}
        </button>
      )}
    </motion.div>
  );
}
