/**
 * components/dashboard/RepCounter.jsx — MotionPulse dark theme
 *
 * Large rep counter on dark surface. Bounce + "+1 REP" flash preserved.
 * Orange replaced with coral accent. Progress dots → clean bar segments.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Target } from 'lucide-react';

export default function RepCounter({ repCount = 0, onReset }) {
  const prevCount = useRef(repCount);
  const [showCelebration, setShowCelebration] = useState(false);
  const [bounceKey, setBounceKey] = useState(0);

  useEffect(() => {
    if (repCount > prevCount.current) {
      setBounceKey(k => k + 1);
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 1200);
      prevCount.current = repCount;
      return () => clearTimeout(timer);
    }
    prevCount.current = repCount;
  }, [repCount]);

  const dotCount = Math.max(repCount, 10);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden flex flex-col items-center gap-5 p-6"
      style={{
        background: '#0F1E30',
        border: '1px solid #26354A',
        borderRadius: '1rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Top coral accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{ background: 'linear-gradient(90deg, #FB7185, #F43F5E)', opacity: 0.7 }} />

      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4" style={{ color: '#FB7185' }} />
          <span className="label-mono" style={{ color: '#FB7185', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
            REPETITIONS
          </span>
        </div>
        <button
          onClick={onReset}
          title="Reset counter"
          className="p-1.5 rounded-md transition-colors"
          style={{ color: '#7090B0' }}
          onMouseEnter={e => e.currentTarget.style.color = '#FB7185'}
          onMouseLeave={e => e.currentTarget.style.color = '#7090B0'}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Big count */}
      <div className="relative flex flex-col items-center">
        <motion.div
          key={bounceKey}
          animate={bounceKey > 0 ? { scale: [1, 1.35, 0.92, 1.08, 1] } : {}}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        >
          <span
            className="font-display font-800 text-7xl"
            style={{ color: '#FB7185', lineHeight: 1 }}
          >
            {repCount}
          </span>
        </motion.div>
        <span className="label-mono mt-2" style={{ color: '#7090B0', fontSize: '0.6rem' }}>
          COMPLETED THIS SESSION
        </span>
      </div>

      {/* +1 Rep flash */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-20 flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-bold text-sm"
            style={{
              background: 'rgba(251,113,133,0.15)',
              border: '1px solid rgba(251,113,133,0.4)',
              color: '#FB7185',
              boxShadow: '0 0 16px rgba(251,113,133,0.3)',
            }}
          >
            +1 REP
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress segments */}
      <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
        {Array.from({ length: dotCount }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: i * 0.02, type: 'spring' }}
            className="w-3 h-1.5 rounded-full"
            style={{
              background: i < repCount ? '#FB7185' : '#152440',
              boxShadow: i < repCount ? '0 0 4px rgba(251,113,133,0.4)' : 'none',
              transition: 'background 0.3s, box-shadow 0.3s',
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
