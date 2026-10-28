/**
 * components/status/CalibrationPanel.jsx — Rehabilitation Portal
 *
 * Real, interactive per-finger sensor calibration panel.
 * Calibrate each loose sensor one by one (Flat 0% and Bent 100%).
 */

import { motion } from 'framer-motion';
import { CheckCircle2, Sliders, RotateCcw, Sparkles } from 'lucide-react';
import { FINGERS } from '../../constants/fingers';
import { FINGER_CHART_COLOR } from '../../constants/fingers';

export default function CalibrationPanel({
  fingers = [],
  calibration = {},
  calibratedStatus = {},
  onCalibrateFingerFlat,
  onCalibrateFingerBent,
  onCalibrateAllFlat,
  onCalibrateAllBent,
  onResetCalibration,
  isSerialConnected = false,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-6 p-6 rounded-2xl border transition-all"
      style={{
        background: 'var(--bg-card)',
        borderColor: 'var(--border-subtle)',
        boxShadow: 'var(--shadow-card)',
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <Sliders className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <p className="font-display font-600 text-base" style={{ color: 'var(--text-primary)' }}>
              Individual Sensor ROM Calibration
            </p>
            <p className="label-mono text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>
              Calibrate each sensor individually to personalize your therapeutic range.
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onCalibrateAllFlat}
            className="px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-colors"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#3B82F6' }}
            title="Set flat for all connected sensors at once"
          >
            🖐 All Flat
          </button>
          <button
            onClick={onResetCalibration}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors"
            style={{ background: 'var(--bg-card-elevated)', borderColor: 'var(--border-subtle)', color: 'var(--text-secondary)' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="label-mono">RESET</span>
          </button>
        </div>
      </div>

      {/* Helpful Instructions */}
      <div
        className="p-3.5 rounded-xl text-xs flex items-center gap-2.5 border"
        style={{
          background: 'rgba(59,130,246,0.06)',
          borderColor: 'rgba(59,130,246,0.2)',
          color: 'var(--text-secondary)',
        }}
      >
        <Sparkles className="w-4 h-4 text-cyan-500 flex-shrink-0" />
        <span>
          <strong>How to calibrate:</strong> Hold a sensor straight and click <strong style={{ color: 'var(--text-primary)' }}>"Set Flat"</strong>. Then curl that sensor and click <strong style={{ color: 'var(--text-primary)' }}>"Set Bent"</strong>.
        </span>
      </div>

      {/* Individual Sensor Cards */}
      <div className="space-y-3">
        {FINGERS.map((finger) => {
          const liveData = fingers.find((f) => f.id === finger.id) || {};
          const liveRaw = liveData.value ?? 1000;
          const livePct = liveData.percent ?? 0;
          const cal = calibration[finger.id] || { flat: 1000, bent: 500 };
          const status = calibratedStatus[finger.id] || { flat: false, bent: false };
          const isDone = status.flat && status.bent;
          const accent = FINGER_CHART_COLOR[finger.id] || '#3B82F6';

          return (
            <div
              key={finger.id}
              className="p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 border transition-all"
              style={{
                background: isDone ? 'rgba(16,185,129,0.06)' : 'var(--bg-card-elevated)',
                borderColor: isDone ? 'rgba(52,211,153,0.4)' : 'var(--border-subtle)',
              }}
            >
              {/* Left: Finger info & Live Raw */}
              <div className="flex items-center gap-4 min-w-[200px]">
                <span
                  className="w-3 h-3 rounded-full flex-shrink-0"
                  style={{ background: accent, boxShadow: `0 0 8px ${accent}60` }}
                />
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>
                      {finger.name}
                    </span>
                    <span className="text-xs text-slate-400">Pin {finger.sensorPin}</span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="label-mono text-[11px] text-slate-400">LIVE ADC:</span>
                    <span className="font-mono text-sm font-bold text-blue-500 dark:text-cyan-300">
                      {liveRaw}
                    </span>
                  </div>
                </div>
              </div>

              {/* Middle: Calibration Thresholds */}
              <div className="flex items-center gap-6">
                <div className="text-left sm:text-right">
                  <div className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Flat: <span className="text-emerald-500 font-semibold">{cal.flat}</span> | Bent:{' '}
                    <span className="text-rose-500 font-semibold">{cal.bent}</span>
                  </div>
                  <div className="label-mono text-[10px] text-slate-400">CALIBRATED THRESHOLDS</div>
                </div>

                <div className="min-w-[70px] text-right">
                  <span
                    className="label-mono text-xs font-bold px-2 py-1 rounded"
                    style={{
                      background: livePct >= 65 ? 'rgba(251,113,133,0.15)' : livePct >= 25 ? 'rgba(56,189,248,0.15)' : 'rgba(148,163,184,0.15)',
                      color: livePct >= 65 ? '#E11D48' : livePct >= 25 ? '#0284C7' : '#64748B',
                    }}
                  >
                    {livePct >= 65 ? 'FULL FLEX' : livePct >= 25 ? 'ACTIVE' : 'EXTENDED'}
                  </span>
                </div>
              </div>

              {/* Right: Individual Buttons for Flat & Bent */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onCalibrateFingerFlat && onCalibrateFingerFlat(finger.id)}
                  className="flex-1 md:flex-initial px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: status.flat ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.12)',
                    border: `1px solid ${status.flat ? 'rgba(52,211,153,0.5)' : 'rgba(59,130,246,0.3)'}`,
                    color: status.flat ? '#10B981' : '#3B82F6',
                  }}
                  title={`Record straight sensor reading for ${finger.name}`}
                >
                  <span>🖐</span>
                  <span>Set Flat</span>
                  {status.flat && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => onCalibrateFingerBent && onCalibrateFingerBent(finger.id)}
                  className="flex-1 md:flex-initial px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: status.bent ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.12)',
                    border: `1px solid ${status.bent ? 'rgba(52,211,153,0.5)' : 'rgba(244,63,94,0.3)'}`,
                    color: status.bent ? '#10B981' : '#F43F5E',
                  }}
                  title={`Record bent sensor reading for ${finger.name}`}
                >
                  <span>✊</span>
                  <span>Set Bent</span>
                  {status.bent && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
