/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── MotionPulse Dark Palette ───────────────────────────────
        navy: {
          900: '#060D1A',   // Deepest background
          800: '#0B1220',   // Main background
          700: '#0F1A2E',   // Section alt bg
          600: '#121C2E',   // Card surface
          500: '#1A2844',   // Elevated card
          400: '#26354A',   // Border
          300: '#3A4F6A',   // Muted border / divider
          200: '#547090',   // Muted text dark
          100: '#8BA4C0',   // Muted text light
        },
        // Primary accent — electric blue
        electric: {
          600: '#1D4ED8',
          500: '#3B82F6',
          400: '#60A5FA',
          300: '#93C5FD',
          200: '#BFDBFE',
          glow: 'rgba(59,130,246,0.25)',
        },
        // Secondary accent — cyan
        cyan: {
          500: '#06B6D4',
          400: '#22D3EE',
          300: '#67E8F9',
          200: '#A5F3FC',
          glow: 'rgba(34,211,238,0.2)',
        },
        // Active movement — coral
        coral: {
          600: '#E11D48',
          500: '#F43F5E',
          400: '#FB7185',
          300: '#FDA4AF',
          glow: 'rgba(251,113,133,0.2)',
        },
        // Success / connected — emerald
        emerald: {
          500: '#10B981',
          400: '#34D399',
          300: '#6EE7B7',
          glow: 'rgba(52,211,153,0.2)',
        },
        // Text scale
        muted: '#8BA4C0',
      },
      fontFamily: {
        sans:    ['Inter',   'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono:    ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        'sm':  '0.375rem',
        'md':  '0.5rem',
        'lg':  '0.75rem',
        'xl':  '1rem',
        '2xl': '1.25rem',
        '3xl': '1.5rem',
      },
      boxShadow: {
        'card':          '0 1px 3px rgba(0,0,0,0.4), 0 4px 16px rgba(0,0,0,0.3)',
        'card-hover':    '0 4px 24px rgba(0,0,0,0.5)',
        'glow-blue':     '0 0 20px rgba(59,130,246,0.3), 0 0 60px rgba(59,130,246,0.1)',
        'glow-cyan':     '0 0 20px rgba(34,211,238,0.25)',
        'glow-coral':    '0 0 16px rgba(251,113,133,0.3)',
        'glow-emerald':  '0 0 16px rgba(52,211,153,0.25)',
        'inset-border':  'inset 0 0 0 1px rgba(38,53,74,0.8)',
      },
      animation: {
        'pulse-slow':     'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'signal-travel':  'signalTravel 2s ease-in-out infinite',
        'grid-pulse':     'gridPulse 4s ease-in-out infinite',
        'hand-breathe':   'handBreathe 4s ease-in-out infinite',
        'scan-line':      'scanLine 3s linear infinite',
        'float-subtle':   'floatSubtle 6s ease-in-out infinite',
      },
      keyframes: {
        signalTravel: {
          '0%':   { strokeDashoffset: '100' },
          '100%': { strokeDashoffset: '0' },
        },
        gridPulse: {
          '0%, 100%': { opacity: '0.03' },
          '50%':      { opacity: '0.06' },
        },
        handBreathe: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%':      { transform: 'scale(1.015)' },
        },
        scanLine: {
          '0%':   { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(100vh)' },
        },
        floatSubtle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        bounceOnce: {
          '0%':   { transform: 'scale(1)' },
          '30%':  { transform: 'scale(1.28)' },
          '60%':  { transform: 'scale(0.93)' },
          '80%':  { transform: 'scale(1.06)' },
          '100%': { transform: 'scale(1)' },
        },
      },
      backgroundImage: {
        'grid-pattern': `linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px),
                         linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)`,
      },
      backgroundSize: {
        'grid': '40px 40px',
      },
    },
  },
  plugins: [],
};
