/**
 * components/hand/HandVisualization.jsx — DEXTER dark theme
 *
 * Interactive SVG hand — dark navy palette, electric accents per finger,
 * sensor signal line pulses, sleek stroke-based design.
 * All bending/spring physics logic preserved exactly.
 */

import { motion } from 'framer-motion';
import { FINGER_SVG_COLORS } from '../../constants/fingers';

export default function HandVisualization({ fingers = [] }) {
  const fingerMap = {};
  fingers.forEach(f => { fingerMap[f.id] = f; });

  const getBend    = id => { const f = fingerMap[id]; return f ? (f.percent / 100) * 65 : 0; };
  const getActive  = id => { const f = fingerMap[id]; return f ? f.percent > 50 : false; };
  const getPercent = id => { const f = fingerMap[id]; return f ? f.percent : 0; };

  const fingerFill   = id => getActive(id) ? FINGER_SVG_COLORS[id].active    : FINGER_SVG_COLORS[id].rest;
  const fingerStroke = id => getActive(id) ? FINGER_SVG_COLORS[id].activeStroke : FINGER_SVG_COLORS[id].stroke;
  const fingerGlow   = id => getActive(id)
    ? `drop-shadow(0 0 10px ${FINGER_SVG_COLORS[id].glow})`
    : 'none';

  const FINGER_IDS = ['thumb', 'index', 'middle', 'ring', 'little'];

  return (
    <div className="flex flex-col items-center gap-5">

      {/* Hand SVG */}
      <div className="relative">
        {/* Background glow halo */}
        <div className="absolute inset-0 rounded-full blur-2xl pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.1) 0%, transparent 70%)' }} />

        <svg
          viewBox="0 0 220 320"
          className="w-52 h-68 relative z-10"
          style={{ overflow: 'visible', width: '13rem', height: '17rem' }}
        >
          {/* ── Palm ── */}
          <ellipse cx="115" cy="235" rx="70" ry="65"
            fill="#0C1828" stroke="#2A3F58" strokeWidth="1.5" />

          {/* ── Wrist ── */}
          <rect x="80" y="283" width="70" height="28" rx="10"
            fill="#0C1828" stroke="#2A3F58" strokeWidth="1.5" />

          {/* ── Thumb ── */}
          <motion.g
            style={{ transformOrigin: '58px 230px' }}
            animate={{ rotate: -(getBend('thumb') * 0.5) }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <motion.rect x="42" y="188" width="30" height="58" rx="8"
              fill={fingerFill('thumb')} stroke={fingerStroke('thumb')} strokeWidth="1.5"
              style={{ filter: fingerGlow('thumb') }} />
            <circle cx="57" cy="191" r="13"
              fill={fingerFill('thumb')} stroke={fingerStroke('thumb')} strokeWidth="1.5" />
          </motion.g>

          {/* ── Index ── */}
          <motion.g
            style={{ transformOrigin: '88px 198px' }}
            animate={{ rotate: getBend('index') * 0.4, translateY: getBend('index') * 0.5 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <motion.rect x="76" y="118" width="26" height="88" rx="8"
              fill={fingerFill('index')} stroke={fingerStroke('index')} strokeWidth="1.5"
              style={{ filter: fingerGlow('index') }} />
            <circle cx="89" cy="122" r="12"
              fill={fingerFill('index')} stroke={fingerStroke('index')} strokeWidth="1.5" />
          </motion.g>

          {/* ── Middle ── */}
          <motion.g
            style={{ transformOrigin: '115px 195px' }}
            animate={{ rotate: getBend('middle') * 0.3, translateY: getBend('middle') * 0.5 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <motion.rect x="103" y="105" width="26" height="98" rx="8"
              fill={fingerFill('middle')} stroke={fingerStroke('middle')} strokeWidth="1.5"
              style={{ filter: fingerGlow('middle') }} />
            <circle cx="116" cy="109" r="12"
              fill={fingerFill('middle')} stroke={fingerStroke('middle')} strokeWidth="1.5" />
          </motion.g>

          {/* ── Ring ── */}
          <motion.g
            style={{ transformOrigin: '142px 197px' }}
            animate={{ rotate: -(getBend('ring') * 0.35), translateY: getBend('ring') * 0.5 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <motion.rect x="130" y="112" width="26" height="92" rx="8"
              fill={fingerFill('ring')} stroke={fingerStroke('ring')} strokeWidth="1.5"
              style={{ filter: fingerGlow('ring') }} />
            <circle cx="143" cy="116" r="12"
              fill={fingerFill('ring')} stroke={fingerStroke('ring')} strokeWidth="1.5" />
          </motion.g>

          {/* ── Little ── */}
          <motion.g
            style={{ transformOrigin: '168px 200px' }}
            animate={{ rotate: -(getBend('little') * 0.5), translateY: getBend('little') * 0.45 }}
            transition={{ type: 'spring', stiffness: 80, damping: 18 }}
          >
            <motion.rect x="157" y="130" width="22" height="76" rx="7"
              fill={fingerFill('little')} stroke={fingerStroke('little')} strokeWidth="1.5"
              style={{ filter: fingerGlow('little') }} />
            <circle cx="168" cy="133" r="10"
              fill={fingerFill('little')} stroke={fingerStroke('little')} strokeWidth="1.5" />
          </motion.g>

          {/* Knuckle markers */}
          {[88, 116, 143, 168].map((cx, i) => (
            <circle key={i} cx={cx} cy={217} r="3" fill="#2A3F58" stroke="#7090B0" strokeWidth="1" />
          ))}

          {/* Signal pulses — flash when finger active */}
          {[
            { id: 'thumb',  cx: 57,  cy: 180 },
            { id: 'index',  cx: 89,  cy: 110 },
            { id: 'middle', cx: 116, cy: 98 },
            { id: 'ring',   cx: 143, cy: 105 },
            { id: 'little', cx: 168, cy: 123 },
          ].map(({ id, cx, cy }) => (
            getActive(id) && (
              <motion.circle key={id} cx={cx} cy={cy} r="4"
                fill="none"
                stroke={FINGER_SVG_COLORS[id].activeStroke}
                strokeWidth="1.5"
                initial={{ r: 4, opacity: 0.8 }}
                animate={{ r: [4, 12], opacity: [0.8, 0] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
              />
            )
          ))}
        </svg>

        {/* Active indicators row */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1.5">
          {FINGER_IDS.map(id => (
            <motion.div
              key={id}
              animate={{
                scale:   getActive(id) ? [1, 1.4, 1] : 1,
                opacity: getActive(id) ? 1 : 0.25,
              }}
              transition={{ duration: 0.5, repeat: getActive(id) ? Infinity : 0, repeatType: 'mirror' }}
              className="w-2 h-2 rounded-full"
              style={{ background: FINGER_SVG_COLORS[id].activeStroke }}
            />
          ))}
        </div>
      </div>

      {/* Sensor reading mini-bars */}
      <div className="flex gap-3">
        {FINGER_IDS.map(id => {
          const pc = getPercent(id);
          const color = FINGER_SVG_COLORS[id].activeStroke;
          return (
            <div key={id} className="flex flex-col items-center gap-1">
              <div className="w-8 h-1 rounded-full" style={{ background: '#152440' }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: getActive(id) ? color : '#2A3F58', width: `${pc}%` }}
                  animate={{ width: `${pc}%` }}
                  transition={{ type: 'spring', stiffness: 60 }}
                />
              </div>
              <span className="label-mono" style={{ fontSize: '0.6rem', color: getActive(id) ? color : '#7090B0' }}>
                {id.charAt(0).toUpperCase()}
              </span>
            </div>
          );
        })}
      </div>

      {/* Label */}
      <p className="label-mono text-center" style={{ color: '#7090B0', fontSize: '0.6rem', letterSpacing: '0.1em' }}>
        5 FLEX SENSORS · INDIVIDUAL FINGER MONITORING
      </p>
    </div>
  );
}
