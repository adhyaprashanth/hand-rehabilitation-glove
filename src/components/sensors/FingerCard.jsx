/**
 * components/sensors/FingerCard.jsx — Rehabilitation Portal
 *
 * Clinical Range-of-Motion (ROM) mobility card for each finger.
 * Focuses on therapeutic stages (Resting, Functional Range, Full Flexion)
 * rather than raw percentage numbers.
 */

import { motion } from 'framer-motion';
import { FINGER_BAR_COLOR, FINGER_SVG_COLORS } from '../../constants/fingers';
import { Activity, CheckCircle2 } from 'lucide-react';

export default function FingerCard({ finger }) {
  const {
    id = 'thumb',
    name = 'Finger',
    percent = 0,
    value = 0,
    color = 'blue',
  } = finger || {};

  // Therapeutic mobility stages based on calibrated range of motion
  let stageName = 'Resting Extension';
  let angleApprox = '0°';
  let stageDescription = 'Finger relaxed and straightened';
  let stageColor = '#94A3B8';

  if (percent >= 65) {
    stageName = 'Full Grip Flexion';
    angleApprox = '90°';
    stageDescription = 'Maximum curl achieved';
    stageColor = '#FB7185';
  } else if (percent >= 25) {
    stageName = 'Functional Range';
    angleApprox = '45°';
    stageDescription = 'Active mid-range flexion';
    stageColor = '#38BDF8';
  }

  const accentColor = FINGER_BAR_COLOR[color] || FINGER_BAR_COLOR.blue;
  const isFlexed = percent >= 25;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden flex flex-col gap-4 p-5 rounded-2xl border transition-all duration-300"
      style={{
        background: 'var(--bg-card)',
        borderColor: isFlexed ? accentColor + '40' : 'var(--border-subtle)',
        boxShadow: isFlexed ? `0 0 20px ${accentColor}18` : 'var(--shadow-card)',
      }}
    >
      {/* Top accent line */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: isFlexed ? accentColor : 'var(--border-subtle)',
          transition: 'background 0.4s',
        }}
      />

      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full flex-shrink-0"
            style={{ background: accentColor, boxShadow: `0 0 8px ${accentColor}60` }}
          />
          <div>
            <span className="label-mono text-slate-400" style={{ fontSize: '0.58rem' }}>
              FINGER SENSOR
            </span>
            <h4 className="font-display font-600 text-sm text-slate-900 dark:text-white">
              {name}
            </h4>
          </div>
        </div>

        {/* Mobility Stage Chip */}
        <div
          className="flex items-center gap-1.5 px-2 py-1 rounded-md"
          style={{
            background: isFlexed ? accentColor + '18' : 'rgba(148,163,184,0.1)',
            border: `1px solid ${isFlexed ? accentColor + '40' : 'var(--border-subtle)'}`,
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: isFlexed ? accentColor : '#94A3B8' }}
          />
          <span
            className="label-mono font-semibold"
            style={{
              color: isFlexed ? accentColor : '#94A3B8',
              fontSize: '0.58rem',
            }}
          >
            {angleApprox}
          </span>
        </div>
      </div>

      {/* Clinical Stage Display */}
      <div className="py-1">
        <div className="flex items-baseline justify-between">
          <span
            className="font-display font-700 text-lg leading-tight"
            style={{ color: isFlexed ? accentColor : 'var(--text-primary)' }}
          >
            {stageName}
          </span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          {stageDescription}
        </p>
      </div>

      {/* 3-Segment Clinical Range Gauge */}
      <div>
        <div className="grid grid-cols-3 gap-1.5 h-2 rounded-full overflow-hidden">
          {/* Segment 1: Resting */}
          <div
            className="rounded-l-full transition-colors duration-300"
            style={{
              background: percent < 25 ? accentColor : 'rgba(148,163,184,0.2)',
            }}
          />
          {/* Segment 2: Functional */}
          <div
            className="transition-colors duration-300"
            style={{
              background: percent >= 25 && percent < 65 ? accentColor : 'rgba(148,163,184,0.2)',
            }}
          />
          {/* Segment 3: Full Flexion */}
          <div
            className="rounded-r-full transition-colors duration-300"
            style={{
              background: percent >= 65 ? accentColor : 'rgba(148,163,184,0.2)',
            }}
          />
        </div>

        {/* Labels below segments */}
        <div className="flex justify-between mt-1.5 label-mono text-[9px] text-slate-400">
          <span>EXTEND</span>
          <span>FUNCTIONAL</span>
          <span>FULL FLEX</span>
        </div>
      </div>

      {/* Raw Signal Telemetry Footer */}
      <div
        className="flex items-center justify-between pt-2 border-t text-xs text-slate-400"
        style={{ borderColor: 'var(--border-subtle)' }}
      >
        <span className="label-mono text-[10px]">RAW ADC: {value}</span>
        <span className="label-mono text-[10px] text-emerald-500 flex items-center gap-1">
          <CheckCircle2 className="w-3 h-3" />
          CALIBRATED
        </span>
      </div>
    </motion.div>
  );
}
