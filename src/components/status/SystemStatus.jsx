/**
 * components/status/SystemStatus.jsx — DEXTER dark theme
 *
 * Dark status grid — technical dark panels with
 * icon + status dot + label.
 */

import { motion } from 'framer-motion';
import { Wifi, Database, Cpu, Activity } from 'lucide-react';

const STATUS_ITEMS = [
  {
    key: 'esp32Connected',
    label: 'ESP32',
    sublabel: 'MICROCONTROLLER',
    icon: Cpu,
    accent: '#3B82F6',
  },
  {
    key: 'sensorsActive',
    label: 'Flex Sensors',
    sublabel: '5 ACTIVE INPUTS',
    icon: Activity,
    accent: '#22D3EE',
  },
  {
    key: 'wifiConnected',
    label: 'Wi-Fi',
    sublabel: 'NETWORK LINK',
    icon: Wifi,
    accent: '#34D399',
  },
  {
    key: 'firebaseSynced',
    label: 'Firebase',
    sublabel: 'CLOUD SYNC',
    icon: Database,
    accent: '#FB7185',
  },
];

export default function SystemStatus({ systemStatus = {} }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STATUS_ITEMS.map(
        ({ key, label, sublabel, icon: Icon, accent }, i) => {
          const active = systemStatus[key] !== false;

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="flex flex-col gap-3 p-4"
              style={{
                background: '#0F1E30',
                border: `1px solid ${
                  active ? accent + '30' : '#2A3F58'
                }`,
                borderRadius: '0.875rem',
                boxShadow: active
                  ? `0 0 16px ${accent}12`
                  : '0 2px 8px rgba(0,0,0,0.3)',
                transition:
                  'border-color 0.4s, box-shadow 0.4s',
              }}
            >
              {/* Icon */}
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{
                  background: active
                    ? accent + '15'
                    : '#152440',

                  border: `1px solid ${
                    active ? accent + '30' : '#2A3F58'
                  }`,
                }}
              >
                <Icon
                  className="w-4 h-4"
                  style={{
                    color: active
                      ? accent
                      : '#7090B0',
                  }}
                />
              </div>

              {/* Info */}
              <div className="flex flex-col gap-0.5">

                {/* Main label */}
                <span
                  className="font-medium text-sm"
                  style={{
                    color: active
                      ? '#E8F2FF'
                      : '#95B2CC',
                  }}
                >
                  {label}
                </span>

                {/* Sublabel */}
                <span
                  className="label-mono"
                  style={{
                    color: active
                      ? '#95B2CC'
                      : '#7090B0',
                    fontSize: '0.58rem',
                  }}
                >
                  {sublabel}
                </span>

              </div>

              {/* Status row */}
              <div className="flex items-center gap-1.5">

                {/* Status dot */}
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    background: active
                      ? accent
                      : '#2A3F58',

                    boxShadow: active
                      ? `0 0 6px ${accent}`
                      : 'none',

                    animation: active
                      ? 'pulseGlow 2s ease-in-out infinite'
                      : 'none',
                  }}
                />

                {/* Status text */}
                <span
                  className="label-mono"
                  style={{
                    color: active
                      ? accent
                      : '#7090B0',

                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                  }}
                >
                  {active ? 'ACTIVE' : 'OFFLINE'}
                </span>

              </div>
            </motion.div>
          );
        }
      )}
    </div>
  );
}