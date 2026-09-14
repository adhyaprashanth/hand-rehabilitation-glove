/**
 * components/flow/DataFlow.jsx — MotionPulse dark theme
 *
 * Dark vertical pipeline diagram. Each step uses a navy card with a
 * per-step accent color. Signal dots travel downward between nodes.
 * Emojis replaced with Lucide icons.
 */

import { motion } from 'framer-motion';
import { Hand, Cpu, Wifi, Cloud, Monitor } from 'lucide-react';

const FLOW_STEPS = [
  {
    Icon:        Hand,
    title:       'Flex Sensors ×5',
    description: 'Each finger wears a flex sensor that measures bending resistance.',
    accent:      '#22D3EE',
    index:       '01',
  },
  {
    Icon:        Cpu,
    title:       'ESP32 MCU',
    description: 'Reads all 5 ADC channels and computes bending percentages.',
    accent:      '#3B82F6',
    index:       '02',
  },
  {
    Icon:        Wifi,
    title:       'Wi-Fi Transmission',
    description: 'ESP32 streams processed data over Wi-Fi to the cloud in real time.',
    accent:      '#34D399',
    index:       '03',
  },
  {
    Icon:        Cloud,
    title:       'Firebase Database',
    description: 'Cloud database stores and pushes live sensor readings to subscribers.',
    accent:      '#A78BFA',
    index:       '04',
  },
  {
    Icon:        Monitor,
    title:       'Live Dashboard',
    description: 'This website reads Firebase and renders every finger movement live.',
    accent:      '#FB7185',
    index:       '05',
  },
];

export default function DataFlow() {
  return (
    <div className="flex flex-col items-center gap-0 w-full max-w-sm mx-auto">
      {FLOW_STEPS.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col items-center w-full"
        >
          {/* Step card */}
          <div
            className="w-full flex items-center gap-4 p-4 rounded-xl"
            style={{
              background: '#0F1E30',
              border: `1px solid ${step.accent}30`,
              boxShadow: `0 0 16px ${step.accent}08`,
            }}
          >
            {/* Step number */}
            <div className="flex-shrink-0 flex flex-col items-center gap-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ background: step.accent + '15', border: `1px solid ${step.accent}40` }}
              >
                <step.Icon className="w-4 h-4" style={{ color: step.accent }} />
              </div>
              <span className="label-mono" style={{ color: step.accent, fontSize: '0.55rem', opacity: 0.6 }}>
                {step.index}
              </span>
            </div>

            <div>
              <p className="font-display font-600 text-sm text-white mb-0.5">{step.title}</p>
              <p className="text-xs leading-snug" style={{ color: '#7090B0' }}>{step.description}</p>
            </div>
          </div>

          {/* Connector — animated signal dot */}
          {i < FLOW_STEPS.length - 1 && (
            <div className="flex flex-col items-center py-1 gap-0.5">
              <div className="w-px h-4" style={{ background: `linear-gradient(${step.accent}, ${FLOW_STEPS[i+1].accent})`, opacity: 0.3 }} />
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: step.accent, boxShadow: `0 0 6px ${step.accent}` }}
                animate={{ y: [0, 10, 0], opacity: [0.8, 1, 0.8] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.22 }}
              />
              <div className="w-px h-4" style={{ background: `linear-gradient(${step.accent}, ${FLOW_STEPS[i+1].accent})`, opacity: 0.3 }} />
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
