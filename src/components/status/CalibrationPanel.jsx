/**
 * components/status/CalibrationPanel.jsx — DEXTER dark theme
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
      className="flex flex-col gap-6 p-6"
      style={{
        background: '#0F1E30',
        border: '1px solid #26354A',
        borderRadius: '1rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <Sliders className="w-5 h-5" style={{ color: '#60A5FA' }} />
          </div>
          <div>
            <p className="font-medium text-base text-white">One-by-One Sensor Calibration</p>
            <p className="label-mono text-xs text-slate-400 mt-0.5">
              Calibrate each sensor individually without needing a glove.
            </p>
          </div>
        </div>

        {/* Global actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={onCalibrateAllFlat}
            className="px-3 py-1.5 rounded-lg text-xs font-medium"
            style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#93C5FD' }}
            title="Set flat for all connected sensors at once"
          >
            🖐 All Flat
          </button>
          <button
            onClick={onResetCalibration}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs"
            style={{ background: 'rgba(42,63,88,0.4)', color: '#95B2CC', border: '1px solid #2A3F58' }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="label-mono">RESET</span>
          </button>
        </div>
      </div>

      {/* Helpful Instructions */}
      <div
        className="p-3.5 rounded-lg text-xs flex items-center gap-2.5"
        style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)', color: '#94A3B8' }}
      >
        <Sparkles className="w-4 h-4 text-cyan-400 flex-shrink-0" />
        <span>
          Pick up a sensor: keep it straight and click <strong className="text-white">"Set Flat"</strong>. Then bend it with your fingers and click <strong className="text-white">"Set Bent"</strong>.
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
              className="p-4 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
              style={{
                background: isDone ? 'rgba(16,185,129,0.05)' : '#152440',
                border: `1px solid ${isDone ? 'rgba(52,211,153,0.3)' : '#2A3F58'}`,
                transition: 'all 0.2s',
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
                    <span className="text-base font-semibold text-white">{finger.name}</span>
                    <span className="text-xs text-slate-400">Pin {finger.sensorPin}</span>
                    {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="label-mono text-[11px] text-slate-400">LIVE ADC:</span>
                    <span className="font-mono text-sm font-bold text-cyan-300">{liveRaw}</span>
                  </div>
                </div>
              </div>

              {/* Middle: Calibration Thresholds & Live Calculated Bend % */}
              <div className="flex items-center gap-6">
                <div className="text-left sm:text-right">
                  <div className="font-mono text-xs text-slate-300">
                    Flat: <span className="text-emerald-400 font-semibold">{cal.flat}</span> | Bent:{' '}
                    <span className="text-rose-400 font-semibold">{cal.bent}</span>
                  </div>
                  <div className="label-mono text-[10px] text-slate-500">SAVED THRESHOLDS</div>
                </div>

                <div className="min-w-[70px] text-right">
                  <div
                    className="font-display font-700 text-2xl leading-none"
                    style={{
                      color: livePct >= 60 ? '#FB7185' : livePct >= 20 ? '#34D399' : '#95B2CC',
                    }}
                  >
                    {livePct}%
                  </div>
                  <div className="label-mono text-[10px] text-slate-500 mt-1">BEND %</div>
                </div>
              </div>

              {/* Right: Individual Buttons for Flat & Bent */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => onCalibrateFingerFlat && onCalibrateFingerFlat(finger.id)}
                  className="flex-1 md:flex-initial px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: status.flat ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.15)',
                    border: `1px solid ${status.flat ? 'rgba(52,211,153,0.5)' : 'rgba(59,130,246,0.4)'}`,
                    color: status.flat ? '#34D399' : '#93C5FD',
                  }}
                  title={`Record straight sensor reading for ${finger.name}`}
                >
                  <span>🖐</span>
                  <span>Set Flat</span>
                  {status.flat && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={() => onCalibrateFingerBent && onCalibrateFingerBent(finger.id)}
                  className="flex-1 md:flex-initial px-3 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: status.bent ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.15)',
                    border: `1px solid ${status.bent ? 'rgba(52,211,153,0.5)' : 'rgba(244,63,94,0.4)'}`,
                    color: status.bent ? '#34D399' : '#FDA4AF',
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
