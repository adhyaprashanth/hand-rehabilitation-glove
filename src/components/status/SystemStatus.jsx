/**
 * components/status/SystemStatus.jsx
 *
 * Shows the real-time system status: ESP32, sensors, Wi-Fi, Firebase.
 * Statuses come from the central useSensorData hook.
 */

import { motion } from 'framer-motion';
import { Wifi, Database, Cpu, Activity } from 'lucide-react';

const STATUS_ITEMS = [
  { key: 'esp32Connected', label: 'ESP32',           icon: Cpu,      color: 'blue' },
  { key: 'sensorsActive',  label: 'Flex Sensors',    icon: Activity, color: 'purple' },
  { key: 'wifiConnected',  label: 'Wi-Fi',           icon: Wifi,     color: 'green' },
  { key: 'firebaseSynced', label: 'Firebase Synced', icon: Database, color: 'orange' },
];

const colorMap = {
  blue:   { dot: 'bg-blue-400',   text: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  purple: { dot: 'bg-purple-400', text: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  green:  { dot: 'bg-green-400',  text: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  orange: { dot: 'bg-orange-400', text: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
};

/**
 * @param {{ systemStatus: import('../../types').SystemStatus }} props
 */
export default function SystemStatus({ systemStatus = {} }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {STATUS_ITEMS.map(({ key, label, icon: Icon, color }, i) => {
        const active = systemStatus[key] !== false;
        const c = colorMap[color];
        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className={`flex flex-col items-center gap-2.5 p-4 rounded-2xl border ${
              active ? `${c.bg} ${c.border}` : 'bg-gray-50 border-gray-100'
            }`}
          >
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
              active ? c.bg : 'bg-gray-100'
            } border ${active ? c.border : 'border-gray-100'}`}>
              <Icon className={`w-5 h-5 ${active ? c.text : 'text-gray-300'}`} />
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${active ? `${c.dot} animate-pulse` : 'bg-gray-300'}`} />
              <span className={`text-xs font-semibold ${active ? c.text : 'text-gray-400'}`}>
                {active ? 'Active' : 'Offline'}
              </span>
            </div>

            <p className="text-xs text-gray-500 font-medium text-center">{label}</p>
          </motion.div>
        );
      })}
    </div>
  );
}
