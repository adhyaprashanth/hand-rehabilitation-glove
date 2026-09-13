/**
 * config/exercises.js
 *
 * ─── EXERCISE CONFIGURATION ─────────────────────────────────────────────────
 *
 * To add a new exercise:
 *   1. Add a new object to the EXERCISES array below.
 *   2. Set `videoUrl` to a YouTube embed URL (https://www.youtube.com/embed/<id>)
 *      or any <iframe>-compatible video URL.
 *
 * To change a video:
 *   Simply replace the `videoUrl` field — no component edits needed.
 *
 * @type {import('../types').Exercise[]}
 */
export const EXERCISES = [
  {
    id: 'hand-flexion',
    name: 'Hand Flexion',
    emoji: '✊',
    description: 'Slowly bend all fingers inward to form a gentle fist, then release.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // ← Replace with real video
    duration: '30 seconds',
    repsTarget: 10,
    benefits: ['Improves grip strength', 'Increases finger flexibility'],
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    iconBg: 'bg-blue-100',
    iconColor: 'text-blue-600',
    btnColor: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    id: 'hand-extension',
    name: 'Hand Extension',
    emoji: '🖐',
    description: 'Straighten and stretch all fingers outward as far as comfortable.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // ← Replace with real video
    duration: '30 seconds',
    repsTarget: 10,
    benefits: ['Reduces stiffness', 'Restores range of motion'],
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200',
    iconBg: 'bg-purple-100',
    iconColor: 'text-purple-600',
    btnColor: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    id: 'pinch-movement',
    name: 'Pinch Movement',
    emoji: '🤏',
    description: 'Bring your thumb tip to meet your index finger, forming a pinch.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // ← Replace with real video
    duration: '20 seconds',
    repsTarget: 15,
    benefits: ['Fine motor control', 'Pinch strength development'],
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-600',
    btnColor: 'bg-orange-500 hover:bg-orange-600',
  },
  {
    id: 'finger-flexion',
    name: 'Finger Flexion',
    emoji: '🤙',
    description: 'Curl individual fingers one at a time from index to little finger.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // ← Replace with real video
    duration: '45 seconds',
    repsTarget: 8,
    benefits: ['Independent finger control', 'Tendon gliding'],
    bgColor: 'bg-mint-50',
    borderColor: 'border-green-200',
    iconBg: 'bg-green-100',
    iconColor: 'text-green-600',
    btnColor: 'bg-green-500 hover:bg-green-600',
  },
  {
    id: 'finger-extension',
    name: 'Finger Extension',
    emoji: '🖖',
    description: 'Extend and spread all fingers wide, holding for 3–5 seconds.',
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // ← Replace with real video
    duration: '30 seconds',
    repsTarget: 10,
    benefits: ['Intrinsic muscle strengthening', 'Reduces contractures'],
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-200',
    iconBg: 'bg-pink-100',
    iconColor: 'text-pink-600',
    btnColor: 'bg-pink-500 hover:bg-pink-600',
  },
];

/** Map for O(1) lookup by exercise id */
export const EXERCISE_MAP = Object.fromEntries(EXERCISES.map(e => [e.id, e]));
