/**
 * components/sensors/FingerCard.jsx — MotionPulse dark theme
 *
 * Dark navy card with per-finger accent color, technical mono labels,
 * animated progress bar, ADC readout. All logic preserved.
 */

import { motion } from 'framer-motion';
import { FINGER_BAR_COLOR, FINGER_SVG_COLORS } from '../../constants/fingers';

export default function FingerCard({ finger }) {
  const {
    id = 'thumb',
    name = 'Finger',
    percent = 0,
    value = 0,
    status = 'Resting',
    color = 'blue',
  } = finger || {};

  const isBending = status === 'Bending';
  const isActive  = status === 'Active';
  const isLive    = isBending || isActive;

  const accentColor = FINGER_BAR_COLOR[color] || FINGER_BAR_COLOR.blue;
  const svgColors   = FINGER_SVG_COLORS[id]   || FINGER_SVG_COLORS.thumb;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4, boxShadow: `0 12px 32px rgba(0,0,0,0.5), 0 0 20px ${svgColors.glow}` }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden flex flex-col gap-4 p-5"
      style={{
        background: '#0F1E30',
        border: `1px solid ${isLive ? accentColor + '35' : '#2A3F58'}`,
        borderRadius: '1rem',
        boxShadow: isLive ? `0 0 20px ${svgColors.glow}` : '0 2px 12px rgba(0,0,0,0.4)',
        transition: 'border-color 0.4s, box-shadow 0.4s',
      }}
    >
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 rounded-t-xl"
        style={{ background: isLive ? accentColor : '#2A3F58', opacity: isLive ? 1 : 0.4, transition: 'background 0.4s' }} />

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="label-mono" style={{ color: '#7090B0', fontSize: '0.6rem', letterSpacing: '0.1em' }}>SENSOR</span>
          <span className="font-display font-600 text-sm text-white">{name}</span>
        </div>

        {/* Status chip */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{
            background: isLive ? accentColor + '15' : 'rgba(38,53,74,0.4)',
            border: `1px solid ${isLive ? accentColor + '40' : '#2A3F58'}`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full"
            style={{
              background: isLive ? accentColor : '#7090B0',
              boxShadow: isLive ? `0 0 6px ${accentColor}` : 'none',
              animation: isLive ? 'pulseGlow 2s ease-in-out infinite' : 'none',
            }} />
          <span className="label-mono" style={{
            color: isLive ? accentColor : '#7090B0',
            fontSize: '0.58rem',
            letterSpacing: '0.08em',
          }}>
            {status.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Big percentage + ADC */}
      <div className="flex items-end justify-between">
        <div>
          <motion.div
            key={percent}
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ duration: 0.3 }}
            className="flex items-baseline gap-1"
          >
            <span
              className="font-display font-700 text-4xl"
              style={{ color: isLive ? accentColor : '#08111F' }}
            >
              {percent}
            </span>
            <span className="text-base font-medium" style={{ color: '#7090B0' }}>%</span>
          </motion.div>
          <span className="label-mono" style={{ color: '#7090B0', fontSize: '0.6rem' }}>BEND LEVEL</span>
        </div>

        {/* ADC readout — technical */}
        <div className="text-right">
          <div className="font-mono text-xs" style={{ color: '#7090B0' }}>{value}</div>
          <div className="label-mono" style={{ color: '#2A3F58', fontSize: '0.55rem' }}>ADC RAW</div>
        </div>
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#152440' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: accentColor }}
            animate={{ width: `${percent}%` }}
            transition={{ type: 'spring', stiffness: 60, damping: 20 }}
          />
        </div>
        <div className="flex justify-between mt-1" style={{ color: '#2A3F58', fontSize: '0.55rem', fontFamily: 'monospace' }}>
          <span>0</span><span>50%</span><span>100</span>
        </div>
      </div>
    </motion.div>
  );
}
