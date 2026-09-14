/**
 * config/exercises.js — MotionPulse dark theme edition
 *
 * Exercise definitions with dark theme color assignments.
 * All videoUrl placeholders preserved — edit these to add real YouTube links.
 */

export const EXERCISES = [
  {
    id:          'hand-flexion',
    name:        'Hand Flexion',
    description: 'Gently curl all fingers into a fist, then slowly open. Targets all flexor tendons.',
    duration:    '30s',
    repsTarget:  12,
    videoUrl:    'https://www.youtube.com/embed/dQw4w9WgXcQ', // TODO: Replace with real exercise video
    accent:      '#3B82F6',
    bgColor:     'rgba(59,130,246,0.06)',
    borderColor: 'rgba(59,130,246,0.2)',
    iconBg:      'rgba(59,130,246,0.12)',
    iconColor:   '#60A5FA',
    btnColor:    '#3B82F6',
    benefits:    ['Flexor tendon strength', 'Full range of motion', 'Grip coordination'],
  },
  {
    id:          'hand-extension',
    name:        'Hand Extension',
    description: 'Spread fingers wide and extend them fully backward. Targets extensor muscles.',
    duration:    '30s',
    repsTarget:  12,
    videoUrl:    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    accent:      '#22D3EE',
    bgColor:     'rgba(34,211,238,0.06)',
    borderColor: 'rgba(34,211,238,0.2)',
    iconBg:      'rgba(34,211,238,0.12)',
    iconColor:   '#22D3EE',
    btnColor:    '#06B6D4',
    benefits:    ['Extensor strength', 'Finger separation', 'Wrist stability'],
  },
  {
    id:          'pinch-movement',
    name:        'Pinch Movement',
    description: 'Bring thumb and index finger together in a precise pinch. Improves fine motor control.',
    duration:    '45s',
    repsTarget:  15,
    videoUrl:    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    accent:      '#34D399',
    bgColor:     'rgba(52,211,153,0.06)',
    borderColor: 'rgba(52,211,153,0.2)',
    iconBg:      'rgba(52,211,153,0.12)',
    iconColor:   '#34D399',
    btnColor:    '#10B981',
    benefits:    ['Pinch strength', 'Fine motor precision', 'Thumb opposition'],
  },
  {
    id:          'finger-flexion',
    name:        'Finger Flexion',
    description: 'Curl each finger independently, one at a time. Isolated tendon conditioning.',
    duration:    '60s',
    repsTarget:  10,
    videoUrl:    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    accent:      '#FB7185',
    bgColor:     'rgba(251,113,133,0.06)',
    borderColor: 'rgba(251,113,133,0.2)',
    iconBg:      'rgba(251,113,133,0.12)',
    iconColor:   '#FB7185',
    btnColor:    '#F43F5E',
    benefits:    ['Independent control', 'Isolated conditioning', 'Coordination'],
  },
  {
    id:          'finger-extension',
    name:        'Finger Extension',
    description: 'Straighten each finger fully against resistance. Strengthens dorsal muscles.',
    duration:    '45s',
    repsTarget:  10,
    videoUrl:    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    accent:      '#A78BFA',
    bgColor:     'rgba(167,139,250,0.06)',
    borderColor: 'rgba(167,139,250,0.2)',
    iconBg:      'rgba(167,139,250,0.12)',
    iconColor:   '#A78BFA',
    btnColor:    '#8B5CF6',
    benefits:    ['Extensor isolation', 'Dorsal strength', 'Finger independence'],
  },
];

export const EXERCISE_MAP = Object.fromEntries(EXERCISES.map(e => [e.id, e]));
