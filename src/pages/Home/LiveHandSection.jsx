/**
 * pages/Home/LiveHandSection.jsx — Patient & Rehabilitation POV
 */

import HandVisualization from '../../components/hand/HandVisualization';
import MovementDetector from '../../components/dashboard/MovementDetector';
import RepCounter from '../../components/dashboard/RepCounter';
import SectionTitle from '../../components/common/SectionTitle';
import { Usb, Radio, Sliders } from 'lucide-react';

export default function LiveHandSection({
  fingers,
  movement,
  repCount,
  resetSession,
  isSerialConnected = false,
  isWebSerialSupported = true,
  packetCount = 0,
  onConnectESP32,
  onDisconnectESP32,
}) {
  const scrollToCalibration = () => {
    const el = document.querySelector('#calibration');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="live-hand" className="py-20" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="LIVE MOBILITY MONITOR"
          subtitle="Real-time anatomical hand visualization mirroring your physical glove movements."
        />

        {/* Live Hardware Connection & Calibration Bar */}
        <div
          className="mb-8 p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4 border transition-all"
          style={{
            background: isSerialConnected
              ? 'rgba(16,185,129,0.08)'
              : 'rgba(59,130,246,0.06)',
            borderColor: isSerialConnected
              ? 'rgba(52,211,153,0.4)'
              : 'var(--border-subtle)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: isSerialConnected ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.12)',
                border: `1px solid ${isSerialConnected ? 'rgba(52,211,153,0.4)' : 'rgba(59,130,246,0.3)'}`,
              }}
            >
              <Usb className="w-5 h-5" style={{ color: isSerialConnected ? '#10B981' : '#3B82F6' }} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-display font-600 text-sm text-slate-900 dark:text-white">
                  {isSerialConnected ? 'ESP32 Glove Active' : 'Practice Simulation Mode'}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider"
                  style={{
                    background: isSerialConnected ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                    color: isSerialConnected ? '#10B981' : '#F59E0B',
                    border: `1px solid ${isSerialConnected ? 'rgba(52,211,153,0.4)' : 'rgba(245,158,11,0.4)'}`,
                  }}
                >
                  {isSerialConnected ? `${packetCount} pkts rx` : 'Simulated'}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {isSerialConnected
                  ? 'Glove connected! Move your fingers to see anatomical response and track exercise repetitions.'
                  : 'Plug your ESP32 into USB, close the Arduino Serial Monitor, and click Connect.'}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-wrap">
            <button
              onClick={scrollToCalibration}
              className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all border"
              style={{
                background: 'var(--bg-card-elevated)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
            >
              <Sliders className="w-3.5 h-3.5 text-blue-500" />
              <span>Calibrate Sensors</span>
            </button>

            {isWebSerialSupported && (
              <button
                onClick={isSerialConnected ? onDisconnectESP32 : onConnectESP32}
                className="w-full md:w-auto px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: isSerialConnected ? 'rgba(239,68,68,0.12)' : '#3B82F6',
                  border: isSerialConnected ? '1px solid rgba(239,68,68,0.4)' : '1px solid #2563EB',
                  color: isSerialConnected ? '#EF4444' : '#FFFFFF',
                  boxShadow: isSerialConnected ? 'none' : '0 4px 14px rgba(59,130,246,0.35)',
                }}
              >
                <Radio className="w-3.5 h-3.5" />
                {isSerialConnected ? 'Disconnect Glove' : 'Connect Glove (USB)'}
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Hand visualization panel */}
          <div
            className="lg:col-span-1 flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border"
            style={{
              background: 'var(--bg-card)',
              borderColor: 'var(--border-subtle)',
              boxShadow: 'var(--shadow-card)',
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
