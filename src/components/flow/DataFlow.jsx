/**
 * components/flow/DataFlow.jsx
 *
 * Visual "How It Works" flow diagram:
 *   Flex Sensors → ESP32 → Wi-Fi → Firebase → Live Dashboard
 *
 * Uses Framer Motion for animated entry and subtle flow indicator.
 */

import { motion } from 'framer-motion';

const FLOW_STEPS = [
  {
    emoji: '🧤',
    title: 'Flex Sensors ×5',
    description: 'Each finger wears a flex sensor that measures bending resistance.',
    color: 'from-blue-100 to-blue-50',
    border: 'border-blue-200',
    dot: 'bg-blue-400',
  },
  {
    emoji: '📟',
    title: 'ESP32',
    description: 'Reads all 5 ADC values and computes bending percentages.',
    color: 'from-purple-100 to-purple-50',
    border: 'border-purple-200',
    dot: 'bg-purple-400',
  },
  {
    emoji: '📶',
    title: 'Wi-Fi',
    description: 'ESP32 transmits data over Wi-Fi in real time.',
    color: 'from-green-100 to-green-50',
    border: 'border-green-200',
    dot: 'bg-green-400',
  },
  {
    emoji: '☁️',
    title: 'Firebase',
    description: 'Cloud database stores and streams live sensor readings.',
    color: 'from-orange-100 to-orange-50',
    border: 'border-orange-200',
    dot: 'bg-orange-400',
  },
  {
    emoji: '💻',
    title: 'Live Dashboard',
    description: 'This website reads Firebase and visualises every finger in real time.',
    color: 'from-pink-100 to-pink-50',
    border: 'border-pink-200',
    dot: 'bg-pink-400',
  },
];

export default function DataFlow() {
  return (
    <div className="flex flex-col items-center gap-0">
      {FLOW_STEPS.map((step, i) => (
        <motion.div
          key={step.title}
          initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.12, duration: 0.45 }}
          className="flex flex-col items-center w-full max-w-xs"
        >
          {/* Step card */}
          <div
            className={`w-full bg-gradient-to-br ${step.color} border ${step.border} rounded-3xl p-5 flex items-center gap-4 shadow-soft`}
          >
            {/* Number + emoji */}
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <span className="text-3xl">{step.emoji}</span>
              <span className={`w-2 h-2 rounded-full ${step.dot}`} />
            </div>

            {/* Text */}
            <div>
              <p className="font-display font-700 text-sm text-gray-800">{step.title}</p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">{step.description}</p>
            </div>
          </div>

          {/* Connecting arrow */}
          {i < FLOW_STEPS.length - 1 && (
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 + 0.1, duration: 0.3 }}
              style={{ transformOrigin: 'top' }}
              className="flex flex-col items-center gap-0.5 py-1.5"
            >
              <div className="w-0.5 h-5 bg-gradient-to-b from-purple-300 to-blue-300 rounded-full" />
              {/* Animated dot travelling down */}
              <motion.div
                className="w-2 h-2 rounded-full bg-purple-400"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut', delay: i * 0.25 }}
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
