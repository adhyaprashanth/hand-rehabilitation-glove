/**
 * components/status/SystemStatus.jsx — Rehabilitation Portal
 *
 * Status grid for hardware and connection components.
 * Wi-Fi and Cloud Sync are explicitly shown as Standalone USB / Offline.
 */

import { motion } from 'framer-motion';
import { Wifi, Database, Cpu, Activity, Usb } from 'lucide-react';

export default function SystemStatus({ systemStatus = {} }) {
  const items = [
    {
      key: 'esp32Connected',
      label: 'ESP32 Glove',
      sublabel: 'USB HARDWARE',
      icon: Cpu,
      accent: '#3B82F6',
      active: Boolean(systemStatus.esp32Connected),
      statusText: systemStatus.esp32Connected ? 'ACTIVE' : 'READY TO CONNECT',
    },
    {
      key: 'sensorsActive',
      label: 'Flex Sensors',
      sublabel: '5 ANALOG INPUTS',
      icon: Activity,
      accent: '#22D3EE',
      active: Boolean(systemStatus.sensorsActive),
      statusText: systemStatus.sensorsActive ? 'CALIBRATED' : 'STANDBY',
    },
    {
      key: 'wifiConnected',
      label: 'Wi-Fi Network',
      sublabel: 'DIRECT USB LINK',
      icon: Wifi,
      accent: '#7090B0',
      active: false,
      statusText: 'STANDALONE USB',
    },
    {
      key: 'firebaseSynced',
      label: 'Cloud Sync',
      sublabel: 'LOCAL STORAGE',
      icon: Database,
      accent: '#7090B0',
      active: false,
      statusText: 'OFFLINE (LOCAL)',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map(({ key, label, sublabel, icon: Icon, accent, active, statusText }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          className="flex flex-col gap-3 p-4 rounded-xl border transition-all duration-300"
          style={{
            background: 'var(--bg-card)',
            borderColor: active ? accent + '40' : 'var(--border-subtle)',
            boxShadow: active ? `0 0 16px ${accent}12` : '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          {/* Icon */}
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
            style={{
              background: active ? accent + '18' : 'rgba(112,144,176,0.1)',
              border: `1px solid ${active ? accent + '40' : 'var(--border-subtle)'}`,
            }}
          >
            <Icon
              className="w-4 h-4"
              style={{ color: active ? accent : '#7090B0' }}
            />
          </div>

          {/* Info */}
          <div className="flex flex-col gap-0.5">
            <span
              className="font-medium text-sm"
              style={{ color: active ? 'var(--text-primary)' : 'var(--text-muted)' }}
            >
              {label}
            </span>
            <span
              className="label-mono"
              style={{ color: 'var(--text-faint)', fontSize: '0.58rem' }}
            >
              {sublabel}
            </span>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-1.5 mt-auto pt-1">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{
                background: active ? accent : '#4A6580',
                boxShadow: active ? `0 0 6px ${accent}` : 'none',
                animation: active ? 'pulseGlow 2s ease-in-out infinite' : 'none',
              }}
            />
            <span
              className="label-mono"
              style={{
                color: active ? accent : '#7090B0',
                fontSize: '0.6rem',
                letterSpacing: '0.08em',
              }}
            >
              {statusText}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
