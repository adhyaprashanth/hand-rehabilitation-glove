/**
 * constants/fingers.js — DEXTER dark theme edition
 *
 * Master definition of all five fingers with dark-theme color assignments.
 * All pastel colors replaced with the electric blue / cyan / coral palette.
 */

export const FINGERS = [
  {
    id: 'thumb',
    name: 'Thumb',
    emoji: '👍',
    color: 'blue',
    gradientFrom: '#3B82F6',
    gradientTo: '#22D3EE',
    sensorPin: 34,
  },
  {
    id: 'index',
    name: 'Index',
    emoji: '☝️',
    color: 'cyan',
    gradientFrom: '#22D3EE',
    gradientTo: '#06B6D4',
    sensorPin: 35,
  },
  {
    id: 'middle',
    name: 'Middle',
    emoji: '🖐',
    color: 'emerald',
    gradientFrom: '#34D399',
    gradientTo: '#10B981',
    sensorPin: 32,
  },
  {
    id: 'ring',
    name: 'Ring',
    emoji: '💍',
    color: 'coral',
    gradientFrom: '#FB7185',
    gradientTo: '#F43F5E',
    sensorPin: 33,
  },
  {
    id: 'little',
    name: 'Little',
    emoji: '🌸',
    color: 'violet',
    gradientFrom: '#A78BFA',
    gradientTo: '#8B5CF6',
    sensorPin: 25,
  },
];

export const FINGER_MAP = Object.fromEntries(FINGERS.map(f => [f.id, f]));
export const FINGER_IDS = FINGERS.map(f => f.id);

/** Card surface + border — all dark themed */
export const FINGER_CARD_BG = {
  blue:    'bg-navy-600 border-electric-500/20',
  cyan:    'bg-navy-600 border-cyan-400/20',
  emerald: 'bg-navy-600 border-emerald-400/20',
  coral:   'bg-navy-600 border-coral-400/20',
  violet:  'bg-navy-600 border-violet-400/20',
};

/** Accent text colors per finger */
export const FINGER_TEXT_COLOR = {
  blue:    'text-electric-400',
  cyan:    'text-cyan-400',
  emerald: 'text-emerald-400',
  coral:   'text-coral-400',
  violet:  'text-violet-400',
};

/** Progress bar fill colors per finger */
export const FINGER_BAR_COLOR = {
  blue:    '#3B82F6',
  cyan:    '#22D3EE',
  emerald: '#34D399',
  coral:   '#FB7185',
  violet:  '#A78BFA',
};

/** Recharts stroke + UI accent colors */
export const FINGER_CHART_COLOR = {
  thumb:  '#3B82F6',
  index:  '#22D3EE',
  middle: '#34D399',
  ring:   '#FB7185',
  little: '#A78BFA',
};

/** SVG finger colors for HandVisualization — dark palette */
export const FINGER_SVG_COLORS = {
  thumb:  { rest: '#152440', active: '#3B82F6', glow: 'rgba(59,130,246,0.6)',  stroke: '#2A3F58', activeStroke: '#60A5FA' },
  index:  { rest: '#152440', active: '#22D3EE', glow: 'rgba(34,211,238,0.6)',  stroke: '#2A3F58', activeStroke: '#67E8F9' },
  middle: { rest: '#152440', active: '#34D399', glow: 'rgba(52,211,153,0.6)',  stroke: '#2A3F58', activeStroke: '#6EE7B7' },
  ring:   { rest: '#152440', active: '#FB7185', glow: 'rgba(251,113,133,0.6)', stroke: '#2A3F58', activeStroke: '#FDA4AF' },
  little: { rest: '#152440', active: '#A78BFA', glow: 'rgba(167,139,250,0.6)', stroke: '#2A3F58', activeStroke: '#C4B5FD' },
};
