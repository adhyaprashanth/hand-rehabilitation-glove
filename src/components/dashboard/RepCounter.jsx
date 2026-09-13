/**
 * components/dashboard/RepCounter.jsx
 *
 * Large, visually attractive repetition counter.
 * Bounces and shows a "+1 Rep!" celebration when a new rep is counted.
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RotateCcw, Trophy } from 'lucide-react';

/**
 * @param {{ repCount: number, onReset: function }} props
 */
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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-peach-50 to-orange-50 border border-orange-100 p-6 flex flex-col items-center gap-4"
    >
      {/* Background decoration */}
      <div className="absolute bottom-0 right-0 w-36 h-36 rounded-full bg-orange-100 opacity-40 translate-y-1/2 translate-x-1/2" />

      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <Trophy className="w-4 h-4 text-orange-500" />
          <p className="text-sm font-semibold text-orange-600">Repetitions</p>
        </div>
        <button
          onClick={onReset}
          className="p-1.5 rounded-xl hover:bg-orange-100 text-orange-400 hover:text-orange-600 transition-colors"
          title="Reset counter"
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
          className="relative"
        >
          <span
            className="font-display font-800 text-7xl bg-gradient-to-br from-orange-400 to-peach-400 bg-clip-text text-transparent"
            style={{ background: 'linear-gradient(135deg, #FB923C, #FDBA74)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
          >
            {repCount}
          </span>
        </motion.div>
        <p className="text-xs text-gray-400 font-medium mt-1">completed reps this session</p>
      </div>

      {/* Celebration pop */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="absolute top-16 flex items-center gap-1.5 px-3 py-1.5 bg-orange-500 text-white rounded-full text-sm font-bold shadow-lg"
          >
            🎉 +1 Rep!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="flex gap-1.5 flex-wrap justify-center max-w-xs">
        {Array.from({ length: Math.max(repCount, 10) }, (_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0 }}
            animate={{ scale: i < repCount ? 1 : 0.7 }}
            transition={{ delay: i * 0.03, type: 'spring' }}
            className={`w-3 h-3 rounded-full ${
              i < repCount ? 'bg-orange-400' : 'bg-orange-100'
            }`}
          />
        ))}
      </div>
    </motion.div>
  );
}
