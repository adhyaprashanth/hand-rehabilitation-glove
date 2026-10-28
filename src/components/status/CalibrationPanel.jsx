/**
 * components/status/CalibrationPanel.jsx — DEXTER dark theme
 *
 * Real, functional sensor calibration panel.
 * Records live Flat (0% bend) and Bent (100% bend) ADC thresholds from the ESP32.
 */

import { motion } from 'framer-motion';
import { CheckCircle2, Sliders, Hand, RotateCcw } from 'lucide-react';
import { FINGERS } from '../../constants/fingers';
import { FINGER_CHART_COLOR } from '../../constants/fingers';

export default function CalibrationPanel({
  fingers = [],
  calibration = {},
  calibratedFlat = false,
  calibratedBent = false,
  onCalibrateFlat,
  onCalibrateBent,
  onResetCalibration,
  isSerialConnected = false,
}) {
  const isFullyCalibrated = calibratedFlat && calibratedBent;

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <Sliders className="w-4 h-4" style={{ color: '#60A5FA' }} />
          </div>
          <div>
            <p className="font-medium text-sm text-white">Interactive Glove Calibration</p>
            <p className="label-mono" style={{ color: '#7090B0', fontSize: '0.6rem' }}>
              CALIBRATE PHYSICAL SENSORS FOR ACCURATE BEND %
            </p>
          </div>
        </div>

        <button
          onClick={onResetCalibration}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors"
          style={{ background: 'rgba(42,63,88,0.4)', color: '#95B2CC', border: '1px solid #2A3F58' }}
          title="Reset to default thresholds"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="label-mono">RESET</span>
        </button>
      </div>

      {/* 2-Step Calibration Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Step 1: Flat */}
        <button
          onClick={onCalibrateFlat}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200"
          style={{
            background: calibratedFlat
              ? 'rgba(16,185,129,0.15)'
              : 'rgba(59,130,246,0.1)',
            border: calibratedFlat
              ? '1px solid rgba(52,211,153,0.5)'
              : '1px solid rgba(59,130,246,0.3)',
            boxShadow: calibratedFlat ? '0 0 16px rgba(52,211,153,0.15)' : 'none',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">🖐</span>
            <span className="font-display font-600 text-sm text-white">
              Step 1: Set Flat (0%)
            </span>
            {calibratedFlat && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <span className="text-xs text-slate-400 text-center">
            Keep all fingers straight and relaxed, then click here.
          </span>
        </button>

        {/* Step 2: Bent */}
        <button
          onClick={onCalibrateBent}
          className="flex flex-col items-center justify-center gap-2 p-4 rounded-xl transition-all duration-200"
          style={{
            background: calibratedBent
              ? 'rgba(16,185,129,0.15)'
              : 'rgba(244,63,94,0.1)',
            border: calibratedBent
              ? '1px solid rgba(52,211,153,0.5)'
              : '1px solid rgba(244,63,94,0.3)',
            boxShadow: calibratedBent ? '0 0 16px rgba(52,211,153,0.15)' : 'none',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="text-xl">✊</span>
            <span className="font-display font-600 text-sm text-white">
              Step 2: Set Full Bend (100%)
            </span>
            {calibratedBent && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          </div>
          <span className="text-xs text-slate-400 text-center">
            Make a tight fist / curl fingers completely, then click here.
          </span>
        </button>
      </div>

      {/* Sensor rows with Live Raw ADC & Calibrated Targets */}
      <div className="space-y-2">
        {FINGERS.map((finger) => {
          const liveData = fingers.find((f) => f.id === finger.id) || {};
          const liveRaw = liveData.value ?? 1000;
          const livePct = liveData.percent ?? 0;
          const cal = calibration[finger.id] || { flat: 1000, bent: 500 };
          const accent = FINGER_CHART_COLOR[finger.id] || '#3B82F6';

          return (
            <div
              key={finger.id}
              className="flex items-center justify-between gap-4 p-3 rounded-lg"
              style={{
                background: '#152440',
                border: '1px solid #2A3F58',
              }}
            >
              <div className="flex items-center gap-3">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: accent }} />
                <div>
                  <p className="text-sm font-medium text-white">{finger.name}</p>
                  <p className="label-mono" style={{ fontSize: '0.6rem', color: '#7090B0' }}>
                    PIN {finger.sensorPin}
                  </p>
                </div>
              </div>

              {/* Readouts */}
              <div className="flex items-center gap-6 text-right">
                <div>
                  <div className="font-mono text-xs text-cyan-300 font-bold">{liveRaw}</div>
                  <div className="label-mono" style={{ fontSize: '0.55rem', color: '#7090B0' }}>
                    LIVE RAW
                  </div>
                </div>

                <div className="hidden sm:block">
                  <div className="font-mono text-xs text-slate-300">
                    {cal.flat} ➔ {cal.bent}
                  </div>
                  <div className="label-mono" style={{ fontSize: '0.55rem', color: '#7090B0' }}>
                    CAL (0% ➔ 100%)
                  </div>
                </div>

                <div className="min-w-[4rem]">
                  <div
                    className="font-display font-700 text-base"
                    style={{ color: livePct >= 60 ? '#FB7185' : livePct >= 20 ? '#34D399' : '#95B2CC' }}
                  >
                    {livePct}%
                  </div>
                  <div className="label-mono" style={{ fontSize: '0.55rem', color: '#7090B0' }}>
                    CALCULATED
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Success banner */}
      {isFullyCalibrated && (
        <div
          className="flex items-center justify-center gap-2 py-3 rounded-lg"
          style={{
            background: 'rgba(52,211,153,0.1)',
            border: '1px solid rgba(52,211,153,0.4)',
          }}
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="font-display font-600 text-xs text-emerald-300 tracking-wide">
            CALIBRATION ACTIVE — GLOVE MAPPED TO 0% - 100% RANGE
          </span>
        </div>
      )}
    </motion.div>
  );
}
