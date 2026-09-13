/**
 * components/sensors/SensorGraph.jsx
 *
 * Live sensor activity graph using Recharts.
 * Shows sensor readings over time for a selected finger.
 *
 * Features:
 *   - Finger selector (Thumb, Index, Middle, Ring, Little)
 *   - Smooth animated line chart
 *   - Live updating data from the central data layer
 */

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { FINGERS, FINGER_CHART_COLOR } from '../../constants/fingers';

const CUSTOM_TOOLTIP = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-soft border border-gray-100 text-xs">
      <p className="text-gray-400">{label}</p>
      <p className="font-semibold text-purple-600">{payload[0]?.value}% bending</p>
    </div>
  );
};

/**
 * @param {{ history: Object }} props
 * history is a map of fingerId → [{ time, value }]
 */
export default function SensorGraph({ history = {} }) {
  const [selectedFinger, setSelectedFinger] = useState('thumb');

  const data = history[selectedFinger] || [];
  const chartColor = FINGER_CHART_COLOR[selectedFinger] || '#93C5FD';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-3xl bg-white border border-gray-100 shadow-soft p-6 flex flex-col gap-5"
    >
      {/* Finger selector */}
      <div className="flex flex-wrap gap-2">
        {FINGERS.map(f => {
          const isSelected = f.id === selectedFinger;
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFinger(f.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
                isSelected
                  ? 'text-white shadow-md scale-105'
                  : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              }`}
              style={isSelected ? { background: chartColor } : {}}
            >
              <span>{f.emoji}</span>
              <span>{f.name}</span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 9, fill: '#D1D5DB' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 9, fill: '#D1D5DB' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<CUSTOM_TOOLTIP />} />
            <ReferenceLine y={50} stroke="#E5E7EB" strokeDasharray="3 3" />
            <Line
              type="monotoneX"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 text-xs text-gray-400">
        <div className="w-5 h-1 rounded-full" style={{ background: chartColor }} />
        <span>
          {FINGERS.find(f => f.id === selectedFinger)?.name} finger — bending % over time
        </span>
      </div>
    </motion.div>
  );
}
