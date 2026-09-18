/**
 * components/sensors/SensorGraph.jsx — DEXTER dark theme
 *
 * Dark chart with subtle grid lines, electric accent on selected finger,
 * technical finger selector buttons. All data logic preserved.
 */

import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { motion } from 'framer-motion';
import { FINGERS, FINGER_CHART_COLOR } from '../../constants/fingers';

const DarkTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: '#152440',
      border: '1px solid #26354A',
      borderRadius: '0.5rem',
      padding: '0.5rem 0.75rem',
      boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
    }}>
      <p style={{ color: '#7090B0', fontSize: '0.7rem', fontFamily: 'monospace' }}>{label}</p>
      <p style={{ color: '#60A5FA', fontSize: '0.75rem', fontWeight: 600 }}>
        {payload[0]?.value}% bend
      </p>
    </div>
  );
};

export default function SensorGraph({ history = {} }) {
  const [selectedFinger, setSelectedFinger] = useState('thumb');

  const data       = history[selectedFinger] || [];
  const chartColor = FINGER_CHART_COLOR[selectedFinger] || '#3B82F6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="flex flex-col gap-5 p-6"
      style={{
        background: '#0F1E30',
        border: '1px solid #26354A',
        borderRadius: '1rem',
        boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
      }}
    >
      {/* Finger selector — compact technical tabs */}
      <div className="flex flex-wrap gap-1.5">
        {FINGERS.map(f => {
          const isSelected = f.id === selectedFinger;
          const color      = FINGER_CHART_COLOR[f.id];
          return (
            <button
              key={f.id}
              onClick={() => setSelectedFinger(f.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all duration-200"
              style={{
                background:   isSelected ? color + '18' : 'rgba(26,40,68,0.5)',
                border:       `1px solid ${isSelected ? color + '50' : '#2A3F58'}`,
                color:        isSelected ? color : '#7090B0',
                boxShadow:    isSelected ? `0 0 12px ${color}25` : 'none',
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: isSelected ? color : '#2A3F58' }} />
              <span className="label-mono" style={{ fontSize: '0.62rem', letterSpacing: '0.06em' }}>
                {f.name.toUpperCase()}
              </span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: -24 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1E3048"
              vertical={false}
            />
            <XAxis
              dataKey="time"
              tick={{ fontSize: 8, fill: '#7090B0', fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fontSize: 8, fill: '#7090B0', fontFamily: 'monospace' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={v => `${v}%`}
            />
            <Tooltip content={<DarkTooltip />} />
            <ReferenceLine
              y={50}
              stroke="#2A3F58"
              strokeDasharray="4 4"
              label={{ value: '50%', fill: '#7090B0', fontSize: 8, fontFamily: 'monospace' }}
            />
            <Line
              type="monotoneX"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              style={{ filter: `drop-shadow(0 0 4px ${chartColor}60)` }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-px rounded-full" style={{ background: chartColor }} />
        <span className="label-mono" style={{ color: '#7090B0', fontSize: '0.6rem' }}>
          {FINGERS.find(f => f.id === selectedFinger)?.name.toUpperCase()} SENSOR — BENDING % OVER TIME
        </span>
      </div>
    </motion.div>
  );
}
