/**
 * components/status/CalibrationPanel.jsx — DEXTER dark theme
 *
 * Dark calibration panel. Per-sensor rows with live progress.
 * All calibration logic preserved exactly.
 * Emoji removed from success state — replaced with technical "READY" indicator.
 */

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Loader2, Settings2, Sliders } from 'lucide-react';
import { FINGERS } from '../../constants/fingers';
import { FINGER_CHART_COLOR } from '../../constants/fingers';

const CALIBRATION_DELAY_PER_FINGER = 700;

export default function CalibrationPanel() {
  const [status, setStatus] = useState('idle');
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

  const reset = () => { setStatus('idle'); setCalibratedCount(0); };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-5 p-6"
      style={{
        background: '#0F1E30',
        border: '1px solid #26354A',
        borderRadius: '1rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <Sliders className="w-4 h-4" style={{ color: '#60A5FA' }} />
          </div>
          <div>
            <p className="font-medium text-sm text-white">Sensor Calibration</p>
            <p className="label-mono" style={{ color: '#7090B0', fontSize: '0.6rem' }}>SET ZERO POSITIONS</p>
          </div>
        </div>
        {status === 'done' && (
          <button onClick={reset}
            className="label-mono text-xs transition-colors"
            style={{ color: '#7090B0' }}
            onMouseEnter={e => e.currentTarget.style.color = '#60A5FA'}
            onMouseLeave={e => e.currentTarget.style.color = '#7090B0'}
          >
            RESET
          </button>
        )}
      </div>

      {/* Sensor rows */}
      <div className="space-y-2">
        {FINGERS.map((finger, i) => {
          const isDone    = calibratedCount > i;
          const isCurrent = status === 'running' && calibratedCount === i;
          const accent    = FINGER_CHART_COLOR[finger.id] || '#3B82F6';

          return (
            <motion.div
              key={finger.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center gap-3 p-3 rounded-lg"
              style={{
                background: isDone ? accent + '0A' : '#152440',
                border: `1px solid ${isDone ? accent + '30' : '#2A3F58'}`,
                transition: 'all 0.3s',
              }}
            >
              {/* Status icon */}
              <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center">
                {isDone ? (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <CheckCircle2 className="w-4 h-4" style={{ color: accent }} />
                  </motion.div>
                ) : isCurrent ? (
                  <Loader2 className="w-4 h-4 animate-spin" style={{ color: accent }} />
                ) : (
                  <div className="w-3.5 h-3.5 rounded-full border-2" style={{ borderColor: '#2A3F58' }} />
                )}
              </div>

              {/* Label */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium" style={{ color: isDone ? '#E8F2FF' : '#95B2CC' }}>
                  {finger.name} Sensor
                </p>
                <p className="label-mono" style={{ fontSize: '0.58rem', color: isDone ? accent : '#7090B0' }}>
                  {isDone ? 'CALIBRATED' : isCurrent ? 'CALIBRATING...' : 'WAITING'}
                </p>
              </div>

              {/* Live progress bar */}
              {isCurrent && (
                <div className="w-16 h-1 rounded-full overflow-hidden" style={{ background: '#152440' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: accent }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: CALIBRATION_DELAY_PER_FINGER / 1000 * 0.85, ease: 'linear' }}
                  />
                </div>
              )}

              {/* Done indicator */}
              {isDone && (
                <span className="label-mono" style={{ color: accent, fontSize: '0.58rem' }}>✓</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Success banner */}
      <AnimatePresence>
        {status === 'done' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center justify-center gap-3 py-3 rounded-lg"
            style={{
              background: 'rgba(52,211,153,0.1)',
              border: '1px solid rgba(52,211,153,0.3)',
              boxShadow: '0 0 16px rgba(52,211,153,0.1)',
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: '#34D399', boxShadow: '0 0 8px rgba(52,211,153,0.7)' }} />
            <span className="font-display font-700 text-sm" style={{ color: '#34D399' }}>
              GLOVE READY
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calibrate button */}
      {status !== 'done' && (
        <button
          onClick={startCalibration}
          disabled={status === 'running'}
          className="w-full py-3 rounded-lg text-sm font-semibold transition-all duration-200"
          style={{
            background: status === 'running'
              ? 'rgba(59,130,246,0.1)'
              : '#3B82F6',
            color: status === 'running' ? '#7090B0' : '#fff',
            border: '1px solid rgba(59,130,246,0.3)',
            cursor: status === 'running' ? 'not-allowed' : 'pointer',
            boxShadow: status === 'running' ? 'none' : '0 0 16px rgba(59,130,246,0.3)',
          }}
        >
          {status === 'running' ? (
            <span className="flex items-center justify-center gap-2">
              <Loader2 className="w-4 h-4 animate-spin" /> Calibrating...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <Settings2 className="w-4 h-4" /> Calibrate Glove
            </span>
          )}
        </button>
      )}
    </motion.div>
  );
}
