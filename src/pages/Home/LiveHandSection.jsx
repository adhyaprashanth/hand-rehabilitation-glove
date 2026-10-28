/**
 * pages/Home/LiveHandSection.jsx — DEXTER dark theme
 */

import HandVisualization from '../../components/hand/HandVisualization';
import MovementDetector from '../../components/dashboard/MovementDetector';
import RepCounter from '../../components/dashboard/RepCounter';
import SectionTitle from '../../components/common/SectionTitle';
import { Usb, Radio, RefreshCw } from 'lucide-react';

export default function LiveHandSection({
  fingers,
  movement,
  repCount,
  resetSession,
  isSerialConnected = false,
  isWebSerialSupported = true,
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

        {/* Live Hardware Connection Bar */}
        <div
          className="mb-8 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4"
          style={{
            background: isSerialConnected
              ? 'linear-gradient(90deg, rgba(16,185,129,0.1) 0%, rgba(15,30,48,0.8) 100%)'
              : 'linear-gradient(90deg, rgba(59,130,246,0.08) 0%, rgba(15,30,48,0.8) 100%)',
            border: isSerialConnected
              ? '1px solid rgba(52,211,153,0.3)'
              : '1px solid rgba(59,130,246,0.25)',
          }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: isSerialConnected ? 'rgba(16,185,129,0.15)' : 'rgba(59,130,246,0.15)',
                border: isSerialConnected ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(59,130,246,0.4)',
              }}
            >
              <Usb className="w-5 h-5" style={{ color: isSerialConnected ? '#34D399' : '#60A5FA' }} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-600 text-sm text-white">
                  {isSerialConnected ? 'ESP32 Hardware Connected' : 'Demo Simulation Mode'}
                </span>
                <span
                  className="px-2 py-0.5 rounded text-[10px] font-mono uppercase tracking-wider"
                  style={{
                    background: isSerialConnected ? 'rgba(16,185,129,0.2)' : 'rgba(245,158,11,0.2)',
                    color: isSerialConnected ? '#34D399' : '#FBBF24',
                    border: `1px solid ${isSerialConnected ? 'rgba(52,211,153,0.4)' : 'rgba(245,158,11,0.4)'}`,
                  }}
                >
                  {isSerialConnected ? 'Live 115200 Baud' : 'Simulated'}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isSerialConnected
                  ? 'Streaming live flex sensor readings directly from your glove over USB.'
                  : 'Plug your ESP32 into USB, close the Arduino Serial Monitor, and click Connect.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {isWebSerialSupported && (
              <button
                onClick={isSerialConnected ? onDisconnectESP32 : onConnectESP32}
                className="w-full sm:w-auto px-4 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-all duration-200"
                style={{
                  background: isSerialConnected ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.9)',
                  border: isSerialConnected ? '1px solid rgba(239,68,68,0.4)' : '1px solid rgba(96,165,250,0.8)',
                  color: isSerialConnected ? '#FCA5A5' : '#FFFFFF',
                  boxShadow: isSerialConnected ? 'none' : '0 0 15px rgba(59,130,246,0.4)',
                }}
              >
                <Radio className="w-3.5 h-3.5" />
                {isSerialConnected ? 'Disconnect ESP32' : 'Connect ESP32 (USB)'}
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
