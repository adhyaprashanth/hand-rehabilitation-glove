/**
 * components/hand/HandVisualization.jsx
 *
 * Interactive SVG hand illustration that visually responds to live sensor data.
 *
 * Each finger bends (rotates) proportionally to its sensor percentage value.
 * The bending is achieved via CSS transforms on SVG finger groups.
 *
 * HOW IT WORKS:
 *   - Finger bend angle is derived from the percent value (0–100 → 0°–70°).
 *   - Each finger has a transform-origin at its base joint.
 *   - Fingers are coloured and highlighted when actively bending (>50%).
 */

import { motion } from 'framer-motion';
import { FINGER_CHART_COLOR } from '../../constants/fingers';

/**
 * @param {{ fingers: import('../../types').FingerData[] }} props
 */
export default function HandVisualization({ fingers = [] }) {
  // Build a quick lookup map for this render
  const fingerMap = {};
  fingers.forEach(f => { fingerMap[f.id] = f; });

  const getBend = (id) => {
    const f = fingerMap[id];
    return f ? (f.percent / 100) * 65 : 0;
  };

  const getActive = (id) => {
    const f = fingerMap[id];
    return f ? f.percent > 50 : false;
  };

  const getPercent = (id) => {
    const f = fingerMap[id];
    return f ? f.percent : 0;
  };

  const COLORS = {
    thumb:  { fill: '#BFDBFE', active: '#60A5FA', glow: '#93C5FD' },
    index:  { fill: '#DDD6FE', active: '#A78BFA', glow: '#C4B5FD' },
    middle: { fill: '#BBF7D0', active: '#4ADE80', glow: '#86EFAC' },
    ring:   { fill: '#FED7AA', active: '#FB923C', glow: '#FDBA74' },
    little: { fill: '#FBCFE8', active: '#F472B6', glow: '#F9A8D4' },
  };

  const fingerColor = (id) => {
    const c = COLORS[id];
    return getActive(id) ? c.active : c.fill;
  };

  const fingerGlow = (id) => {
    const c = COLORS[id];
    return getActive(id) ? `drop-shadow(0 0 8px ${c.glow})` : 'none';
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Hand SVG */}
      <div className="relative">
        <svg
          viewBox="0 0 220 320"
          className="w-56 h-72 drop-shadow-xl"
          style={{ overflow: 'visible' }}
        >
          {/* ── Palm ─────────────────────────────────────────────────────── */}
          <ellipse cx="115" cy="235" rx="72" ry="68"
            fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />

          {/* ── Wrist ────────────────────────────────────────────────────── */}
          <rect x="78" y="283" width="74" height="30" rx="12"
            fill="#FEF3C7" stroke="#FDE68A" strokeWidth="1.5" />

          {/* ── Thumb ────────────────────────────────────────────────────── */}
          <motion.g
            style={{ transformOrigin: '58px 230px' }}
            animate={{ rotate: -(getBend('thumb') * 0.5) }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <motion.rect
              x="42" y="188" width="30" height="58" rx="15"
              fill={fingerColor('thumb')}
              stroke="#E5E7EB"
              strokeWidth="1.2"
              style={{ filter: fingerGlow('thumb') }}
            />
            <circle cx="57" cy="191" r="13"
              fill={fingerColor('thumb')} stroke="#E5E7EB" strokeWidth="1.2" />
          </motion.g>

          {/* ── Index ────────────────────────────────────────────────────── */}
          <motion.g
            style={{ transformOrigin: '88px 198px' }}
            animate={{ rotate: getBend('index') * 0.4, translateY: getBend('index') * 0.5 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <motion.rect
              x="76" y="118" width="26" height="88" rx="13"
              fill={fingerColor('index')}
              stroke="#E5E7EB"
              strokeWidth="1.2"
              style={{ filter: fingerGlow('index') }}
            />
            <circle cx="89" cy="122" r="12"
              fill={fingerColor('index')} stroke="#E5E7EB" strokeWidth="1.2" />
          </motion.g>

          {/* ── Middle ───────────────────────────────────────────────────── */}
          <motion.g
            style={{ transformOrigin: '115px 195px' }}
            animate={{ rotate: getBend('middle') * 0.3, translateY: getBend('middle') * 0.5 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <motion.rect
              x="103" y="105" width="26" height="98" rx="13"
              fill={fingerColor('middle')}
              stroke="#E5E7EB"
              strokeWidth="1.2"
              style={{ filter: fingerGlow('middle') }}
            />
            <circle cx="116" cy="109" r="12"
              fill={fingerColor('middle')} stroke="#E5E7EB" strokeWidth="1.2" />
          </motion.g>

          {/* ── Ring ─────────────────────────────────────────────────────── */}
          <motion.g
            style={{ transformOrigin: '142px 197px' }}
            animate={{ rotate: -(getBend('ring') * 0.35), translateY: getBend('ring') * 0.5 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <motion.rect
              x="130" y="112" width="26" height="92" rx="13"
              fill={fingerColor('ring')}
              stroke="#E5E7EB"
              strokeWidth="1.2"
              style={{ filter: fingerGlow('ring') }}
            />
            <circle cx="143" cy="116" r="12"
              fill={fingerColor('ring')} stroke="#E5E7EB" strokeWidth="1.2" />
          </motion.g>

          {/* ── Little ───────────────────────────────────────────────────── */}
          <motion.g
            style={{ transformOrigin: '168px 200px' }}
            animate={{ rotate: -(getBend('little') * 0.5), translateY: getBend('little') * 0.45 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <motion.rect
              x="157" y="130" width="22" height="76" rx="11"
              fill={fingerColor('little')}
              stroke="#E5E7EB"
              strokeWidth="1.2"
              style={{ filter: fingerGlow('little') }}
            />
            <circle cx="168" cy="133" r="10"
              fill={fingerColor('little')} stroke="#E5E7EB" strokeWidth="1.2" />
          </motion.g>

          {/* Knuckle dots */}
          {[88, 116, 143, 168].map((cx, i) => (
            <circle key={i} cx={cx} cy={217} r="3.5" fill="#FDE68A" stroke="#FCD34D" strokeWidth="1" />
          ))}
        </svg>

        {/* Active finger indicator dots */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
          {['thumb', 'index', 'middle', 'ring', 'little'].map(id => (
            <motion.div
              key={id}
              animate={{
                scale: getActive(id) ? [1, 1.3, 1] : 1,
                opacity: getActive(id) ? 1 : 0.35,
              }}
              transition={{ duration: 0.4, repeat: getActive(id) ? Infinity : 0, repeatType: 'mirror' }}
              className="w-2 h-2 rounded-full"
              style={{ background: COLORS[id].active }}
            />
          ))}
        </div>
      </div>

      {/* Percent labels below */}
      <div className="flex gap-3 flex-wrap justify-center">
        {['thumb', 'index', 'middle', 'ring', 'little'].map(id => {
          const pc = getPercent(id);
          const c = COLORS[id];
          return (
            <motion.div
              key={id}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center gap-0.5"
            >
              <div
                className="w-8 h-1.5 rounded-full overflow-hidden bg-gray-100"
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: getActive(id) ? c.active : c.fill, width: `${pc}%` }}
                  animate={{ width: `${pc}%` }}
                  transition={{ type: 'spring', stiffness: 60 }}
                />
              </div>
              <span className="text-[9px] text-gray-400 capitalize">{id.charAt(0)}</span>
            </motion.div>
          );
        })}
      </div>

      {/* Label */}
      <p className="text-xs text-gray-400 font-medium tracking-wide">
        5 Flex Sensors • Individual Finger Monitoring
      </p>
    </div>
  );
}
