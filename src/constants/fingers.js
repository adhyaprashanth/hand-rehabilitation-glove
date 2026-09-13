/**
 * constants/fingers.js
 *
 * Master definition of all five fingers, their display properties,
 * and colour assignments. Edit this file to change finger names,
 * icons, or colour themes.
 *
 * NOTE: 'color' keys are Tailwind CSS colour names used for dynamic classes.
 *       'gradientFrom' / 'gradientTo' are plain hex values used in SVG/canvas.
 */

/** @type {import('../types').FingerData[]} — static shape, values filled by simulator */
export const FINGERS = [
  {
    id: 'thumb',
    name: 'Thumb',
    emoji: '👍',
    color: 'blue',
    gradientFrom: '#93C5FD',
    gradientTo: '#3B82F6',
    sensorPin: 34, // ESP32 ADC pin (documentation only)
  },
  {
    id: 'index',
    name: 'Index',
    emoji: '☝️',
    color: 'lavender',
    gradientFrom: '#C4B5FD',
    gradientTo: '#8B5CF6',
    sensorPin: 35,
  },
  {
    id: 'middle',
    name: 'Middle',
    emoji: '🖐',
    color: 'mint',
    gradientFrom: '#86EFAC',
    gradientTo: '#22C55E',
    sensorPin: 32,
  },
  {
    id: 'ring',
    name: 'Ring',
    emoji: '💍',
    color: 'peach',
    gradientFrom: '#FDBA74',
    gradientTo: '#F97316',
    sensorPin: 33,
  },
  {
    id: 'little',
    name: 'Little',
    emoji: '🌸',
    color: 'pink',
    gradientFrom: '#F9A8D4',
    gradientTo: '#EC4899',
    sensorPin: 25,
  },
];

/** Helper map for O(1) lookups by fingerId */
export const FINGER_MAP = Object.fromEntries(FINGERS.map(f => [f.id, f]));

/** Ordered list of finger IDs (thumb → little) */
export const FINGER_IDS = FINGERS.map(f => f.id);

/** Tailwind card background colours mapped per finger colour key */
export const FINGER_CARD_BG = {
  blue:     'bg-blue-50   border-blue-100',
  lavender: 'bg-purple-50 border-purple-100',
  mint:     'bg-green-50  border-green-100',
  peach:    'bg-orange-50 border-orange-100',
  pink:     'bg-pink-50   border-pink-100',
};

/** Tailwind text colours mapped per finger colour key */
export const FINGER_TEXT_COLOR = {
  blue:     'text-blue-500',
  lavender: 'text-purple-500',
  mint:     'text-green-500',
  peach:    'text-orange-500',
  pink:     'text-pink-500',
};

/** Tailwind progress bar fill colours mapped per finger colour key */
export const FINGER_BAR_COLOR = {
  blue:     'bg-blue-400',
  lavender: 'bg-purple-400',
  mint:     'bg-green-400',
  peach:    'bg-orange-400',
  pink:     'bg-pink-400',
};

/** Recharts stroke colours for the sensor graph */
export const FINGER_CHART_COLOR = {
  thumb:  '#60A5FA',
  index:  '#A78BFA',
  middle: '#4ADE80',
  ring:   '#FB923C',
  little: '#F472B6',
};
