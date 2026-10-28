/**
 * pages/Home/LiveHandSection.jsx — DEXTER dark theme
 */

import HandVisualization from '../../components/hand/HandVisualization';
import MovementDetector from '../../components/dashboard/MovementDetector';
import RepCounter from '../../components/dashboard/RepCounter';
import SectionTitle from '../../components/common/SectionTitle';
import { Usb, Radio, CheckCircle2, RotateCcw } from 'lucide-react';

export default function LiveHandSection({
  fingers,
  movement,
  repCount,
  resetSession,
  isSerialConnected = false,
  isWebSerialSupported = true,
  packetCount = 0,
  calibratedFlat = false,
  calibratedBent = false,
  onCalibrateFlat,
  onCalibrateBent,
  onConnectESP32,
  onDisconnectESP32,
}) {
  return (
    <section id="live-hand" className="py-24" style={{ background: '#08111F' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="LIVE HAND ACTIVITY"
          subtitle="Real-time monitoring of individual finger movements — 150ms refresh rate."
        />

        {/* Live Hardware Connection & Quick Calibration Bar */}
        <div
          className="mb-8 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4"
          style={{
            background: isSerialConnected
              ? 'linear-gradient(90deg, rgba(16,185,129,0.12) 0%, rgba(15,30,48,0.9) 100%)'
              : 'linear-gradient(90deg, rgba(59,130,246,0.08) 0%, rgba(15,30,48,0.9) 100%)',
            border: isSerialConnected
              ? '1px solid rgba(52,211,153,0.35)'
              : '1px solid rgba(59,130,246,0.25)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: isSerialConnected ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                border: isSerialConnected ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(59,130,246,0.4)',
              }}
            >
              <Usb className="w-5 h-5" style={{ color: isSerialConnected ? '#34D399' : '#60A5FA' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-600 text-sm text-white">
                  {isSerialConnected ? 'ESP32 Glove Streaming' : 'Demo Simulation Mode'}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider"
                  style={{
                    background: isSerialConnected ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                    color: isSerialConnected ? '#34D399' : '#FBBF24',
                    border: `1px solid ${isSerialConnected ? 'rgba(52,211,153,0.4)' : 'rgba(245,158,11,0.4)'}`,
                  }}
                >
                  {isSerialConnected ? `${packetCount} pkts rx` : 'Simulated'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSerialConnected
                  ? 'Click "Set Flat" with straight fingers, then "Set Bent" making a fist to calibrate.'
                  : 'Plug your ESP32 into USB, close the Arduino Serial Monitor, and click Connect.'}
              </p>
            </div>
          </div>

          {/* Quick Calibration buttons + Connect/Disconnect */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            {isSerialConnected && (
              <>
                <button
                  onClick={onCalibrateFlat}
                  className="flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: calibratedFlat ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)',
                    border: `1px solid ${calibratedFlat ? 'rgba(52,211,153,0.5)' : 'rgba(59,130,246,0.4)'}`,
                    color: calibratedFlat ? '#34D399' : '#93C5FD',
                  }}
                  title="Record current ADC values as Flat (0% bend)"
                >
                  <span>🖐</span>
                  <span>Set Flat (0%)</span>
                  {calibratedFlat && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={onCalibrateBent}
                  className="flex-1 md:flex-initial px-3 py-1.5 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all"
                  style={{
                    background: calibratedBent ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)',
                    border: `1px solid ${calibratedBent ? 'rgba(52,211,153,0.5)' : 'rgba(244,63,94,0.4)'}`,
                    color: calibratedBent ? '#34D399' : '#FDA4AF',
                  }}
                  title="Record current ADC values as Bent (100% bend)"
                >
                  <span>✊</span>
                  <span>Set Bent (100%)</span>
                  {calibratedBent && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              </>
            )}

            {isWebSerialSupported && (
              <button
                onClick={isSerialConnected ? onDisconnectESP32 : onConnectESP32}
                className="w-full md:w-auto px-4 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: isSerialConnected ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.9)',
                  border: isSerialConnected ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(96,165,250,0.8)',
                  color: isSerialConnected ? '#FCA5A5' : '#FFFFFF',
                  boxShadow: isSerialConnected ? 'none' : '0 0 15px rgba(59,130,246,0.4)',
                }}
              >
                <Radio className="w-3.5 h-3.5" />
                {isSerialConnected ? 'Disconnect' : 'Connect ESP32 (USB)'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Hand visualization panel */}
          <div
            className="lg:col-span-1 flex flex-col items-center justify-center gap-4 p-8 rounded-xl"
            style={{
              background: '#0F1E30',
              border: '1px solid #26354A',
              boxShadow: '0 0 32px rgba(59,130,246,0.06)',
            }}
          >
            <HandVisualization fingers={fingers} />
          </div>

          {/* Right — movement detector + rep counter */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <MovementDetector movement={movement} />
            <RepCounter repCount={repCount} onReset={resetSession} />
          </div>
        </div>
      </div>
    </section>
  );
}
