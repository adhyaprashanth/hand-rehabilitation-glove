/**
 * components/sensors/FingerCard.jsx
 *
 * Individual finger sensor card displaying:
 *   - Emoji & finger name
 *   - Bending percentage (animated)
 *   - Status label
 *   - Animated progress bar
 *   - Raw ADC value (small, for technical detail)
 */

import { motion } from 'framer-motion';
import {
  FINGER_CARD_BG,
  FINGER_TEXT_COLOR,
  FINGER_BAR_COLOR,
} from '../../constants/fingers';

/**
 * @param {{ finger: import('../../types').FingerData }} props
 */
export default function FingerCard({ finger }) {
  const {
    id = 'thumb',
    name = 'Finger',
    emoji = '👋',
    percent = 0,
    value = 0,
    status = 'Resting',
    color = 'blue',
  } = finger || {};

  const isBending = status === 'Bending';
  const isActive  = status === 'Active';

  const cardBg  = FINGER_CARD_BG[color]   || FINGER_CARD_BG.blue;
  const textCol = FINGER_TEXT_COLOR[color] || FINGER_TEXT_COLOR.blue;
  const barCol  = FINGER_BAR_COLOR[color]  || FINGER_BAR_COLOR.blue;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: '0 12px 32px -8px rgba(0,0,0,0.12)' }}
      transition={{ duration: 0.3 }}
      className={`relative overflow-hidden rounded-3xl border ${cardBg} p-5 flex flex-col gap-3 transition-shadow`}
    >
      {/* Subtle background circle */}
      <div
        className="absolute -top-6 -right-6 w-20 h-20 rounded-full opacity-20"
        style={{ background: `radial-gradient(circle, currentColor, transparent)` }}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{emoji}</span>
          <div>
            <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">Finger</p>
            <p className={`font-display font-600 text-sm ${textCol}`}>{name}</p>
          </div>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
          isBending
            ? 'bg-white/80 text-orange-600'
            : isActive
              ? 'bg-white/80 text-blue-600'
              : 'bg-white/80 text-gray-500'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${
            isBending ? 'bg-orange-400 animate-pulse' : isActive ? 'bg-blue-400 animate-pulse' : 'bg-gray-300'
          }`} />
          {status}
        </div>
      </div>

      {/* Big percentage */}
      <div className="flex items-end justify-between">
        <div>
          <motion.p
            key={percent}
            animate={{ scale: [1, 1.08, 1] }}
            transition={{ duration: 0.3 }}
            className={`font-display font-700 text-4xl ${textCol}`}
          >
            {percent}
            <span className="text-lg ml-0.5 opacity-70">%</span>
          </motion.p>
          <p className="text-xs text-gray-400 mt-0.5">Bending Level</p>
        </div>

        {/* Tiny ADC readout */}
        <div className="text-right">
          <p className="text-xs font-mono text-gray-300">{value}</p>
          <p className="text-[10px] text-gray-300">ADC val</p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2.5 bg-white/60 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${barCol}`}
          animate={{ width: `${percent}%` }}
          transition={{ type: 'spring', stiffness: 60, damping: 20 }}
        />
      </div>

      {/* Bottom scale labels */}
      <div className="flex justify-between text-[10px] text-gray-300 -mt-1">
        <span>0%</span>
        <span>50%</span>
        <span>100%</span>
      </div>
    </motion.div>
  );
}
