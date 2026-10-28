/**
 * pages/Home/HeroSection.jsx — Patient & Rehabilitation POV
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Cpu, Zap, Activity, Target, Sliders } from 'lucide-react';

const scrollToExercises = () => {
  document.querySelector('#exercises')?.scrollIntoView({ behavior: 'smooth' });
};

const scrollToCalibration = () => {
  document.querySelector('#calibration')?.scrollIntoView({ behavior: 'smooth' });
};

/* ── Animated canvas background — motion trails ───────────────── */
function HeroCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    let w = canvas.offsetWidth;
    let h = canvas.offsetHeight;
    canvas.width = w;
    canvas.height = h;

    const trails = [
      { points: [], speed: 0.0008, color: 'rgba(59,130,246,', phase: 0 },
      { points: [], speed: 0.0006, color: 'rgba(34,211,238,', phase: 1.2 },
      { points: [], speed: 0.0009, color: 'rgba(251,113,133,', phase: 2.5 },
      { points: [], speed: 0.0007, color: 'rgba(52,211,153,',  phase: 3.8 },
      { points: [], speed: 0.001,  color: 'rgba(167,139,250,', phase: 5.1 },
    ];

    trails.forEach((t, ti) => {
      const baseY = h * 0.2 + ti * h * 0.15;
      for (let i = 0; i <= 100; i++) {
        const x = (i / 100) * w;
        const y = baseY + Math.sin(i * 0.12 + t.phase) * 60 + Math.cos(i * 0.07 + t.phase * 0.5) * 30;
        t.points.push({ x, y });
      }
    });

    let t = 0;

    const render = () => {
      ctx.clearRect(0, 0, w, h);

      trails.forEach((trail, ti) => {
        const progress = ((t * trail.speed + ti * 0.2) % 1);
        const len = trail.points.length;
        const start = Math.floor(progress * len);
        const windowSize = 25;

        for (let i = 0; i < windowSize - 1; i++) {
          const idx = (start + i) % len;
          const idxNext = (start + i + 1) % len;
          const alpha = (i / windowSize) * 0.35;

          ctx.beginPath();
          ctx.moveTo(trail.points[idx].x, trail.points[idx].y);
          ctx.lineTo(trail.points[idxNext].x, trail.points[idxNext].y);
          ctx.strokeStyle = trail.color + alpha + ')';
          ctx.lineWidth = 1.5;
          ctx.lineCap = 'round';
          ctx.stroke();
        }

        const headIdx = (start + windowSize - 1) % len;
        ctx.beginPath();
        ctx.arc(trail.points[headIdx].x, trail.points[headIdx].y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = trail.color + '0.8)';
        ctx.fill();
      });

      t++;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-50"
    />
  );
}

/* ── Centerpiece: Interactive Hand Model ──────────────────────── */
function HeroHand() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="relative flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 rounded-full blur-3xl pointer-events-none opacity-40 bg-blue-500/20" />

      <motion.svg
        viewBox="0 0 230 310"
        className="w-64 h-80 relative z-10"
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      >
        <ellipse cx="115" cy="235" rx="70" ry="65"
          fill="#0C1828" stroke="#2A3F58" strokeWidth="1.5" />

        <rect x="80" y="283" width="70" height="28" rx="10"
          fill="#0C1828" stroke="#2A3F58" strokeWidth="1.5" />

        {/* Thumb */}
        <motion.g
          style={{ transformOrigin: '58px 230px' }}
          animate={{ rotate: [-20, -8, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <rect x="42" y="188" width="30" height="58" rx="8"
            fill="#0C1828" stroke="#3B82F6" strokeWidth="1.2" />
          <circle cx="57" cy="191" r="13" fill="#0C1828" stroke="#3B82F6" strokeWidth="1.2" />
        </motion.g>

        {/* Index */}
        <motion.g
          style={{ transformOrigin: '88px 198px' }}
          animate={{ rotate: [12, 3, 12], translateY: [6, 2, 6] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        >
          <rect x="76" y="118" width="26" height="88" rx="8"
            fill="#0C1828" stroke="#22D3EE" strokeWidth="1.2" />
          <circle cx="89" cy="122" r="12" fill="#0C1828" stroke="#22D3EE" strokeWidth="1.2" />
        </motion.g>

        {/* Middle */}
        <motion.g
          style={{ transformOrigin: '115px 195px' }}
          animate={{ rotate: [8, 2, 8], translateY: [4, 1, 4] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <rect x="103" y="105" width="26" height="98" rx="8"
            fill="#0C1828" stroke="#34D399" strokeWidth="1.2" />
          <circle cx="116" cy="109" r="12" fill="#0C1828" stroke="#34D399" strokeWidth="1.2" />
        </motion.g>

        {/* Ring */}
        <motion.g
          style={{ transformOrigin: '142px 197px' }}
          animate={{ rotate: [-10, -3, -10], translateY: [5, 1, 5] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          <rect x="130" y="112" width="26" height="92" rx="8"
            fill="#0C1828" stroke="#FB7185" strokeWidth="1.2" />
          <circle cx="143" cy="116" r="12" fill="#0C1828" stroke="#FB7185" strokeWidth="1.2" />
        </motion.g>

        {/* Little */}
        <motion.g
          style={{ transformOrigin: '168px 200px' }}
          animate={{ rotate: [-15, -5, -15], translateY: [7, 2, 7] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
        >
          <rect x="157" y="130" width="22" height="76" rx="7"
            fill="#0C1828" stroke="#A78BFA" strokeWidth="1.2" />
          <circle cx="168" cy="133" r="10" fill="#0C1828" stroke="#A78BFA" strokeWidth="1.2" />
        </motion.g>

        {/* Knuckle markers */}
        {[88, 116, 143, 168].map((cx, i) => (
          <circle key={i} cx={cx} cy={217} r="3" fill="#2A3F58" stroke="#7090B0" strokeWidth="1" />
        ))}
      </motion.svg>
    </motion.div>
  );
}

const FEATURE_TAGS = [
  { icon: Activity, label: '5-Finger ROM Tracking' },
  { icon: Target,   label: 'Guided Therapy Routines' },
  { icon: Zap,      label: 'USB Plug & Play' },
  { icon: Sliders,  label: 'Individual Calibration' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20 pb-16"
      style={{ background: 'var(--bg-primary)' }}
    >
      <HeroCanvas />
      <div className="absolute inset-0 bg-tech-grid opacity-60 pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — patient text */}
          <div className="flex flex-col gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2.5"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="label-mono text-emerald-500 font-semibold" style={{ fontSize: '0.68rem', letterSpacing: '0.12em' }}>
                PATIENT REHABILITATION PORTAL
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col gap-3"
            >
              <h1 className="font-display font-800 text-4xl sm:text-6xl leading-[1.1] tracking-tight text-slate-900 dark:text-white">
                Rebuild Hand Mobility.
                <br />
                <span className="text-blue-500">Restore</span> Independence.
              </h1>
              <p className="text-base text-slate-600 dark:text-slate-300 max-w-lg leading-relaxed">
                A smart physical therapy companion designed to guide your hand recovery. Track each finger's range of motion, practice guided routines, and measure your daily progress.
              </p>
            </motion.div>

            {/* Feature tags */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-2"
            >
              {FEATURE_TAGS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
                  style={{
                    background: 'var(--bg-card)',
                    borderColor: 'var(--border-subtle)',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <Icon className="w-3.5 h-3.5 text-blue-500" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center gap-3 pt-2 flex-wrap"
            >
              <button
                onClick={scrollToExercises}
                className="px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition-all duration-200 active:scale-95 flex items-center gap-2"
                style={{ background: '#3B82F6' }}
              >
                <span>Start Therapy Routines</span>
                <ChevronDown className="w-4 h-4" />
              </button>

              <button
                onClick={scrollToCalibration}
                className="px-5 py-3 rounded-xl text-sm font-semibold border transition-all duration-200 text-slate-700 dark:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                style={{
                  background: 'var(--bg-card)',
                  borderColor: 'var(--border-subtle)',
                }}
              >
                Calibrate Sensors
              </button>
            </motion.div>
          </div>

          {/* Right — Hand visualization */}
          <div className="flex justify-center">
            <HeroHand />
          </div>
        </div>
      </div>
    </section>
  );
}
