/**
 * pages/Home/HeroSection.jsx — DEXTER dark theme
 *
 * Hero with animated dark background (grid + motion trails + scan line),
 * large SVG hand as centerpiece, clean tech typography, and electric CTA.
 */

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, Cpu, Wifi, Database, Zap } from 'lucide-react';

const scrollToDemo = () => {
  document.querySelector('#live-hand')?.scrollIntoView({ behavior: 'smooth' });
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

    // Motion trail paths — represent finger movement arcs
    const trails = [
      { points: [], speed: 0.0008, color: 'rgba(59,130,246,', phase: 0 },
      { points: [], speed: 0.0006, color: 'rgba(34,211,238,', phase: 1.2 },
      { points: [], speed: 0.0009, color: 'rgba(251,113,133,', phase: 2.5 },
      { points: [], speed: 0.0007, color: 'rgba(52,211,153,',  phase: 3.8 },
      { points: [], speed: 0.001,  color: 'rgba(167,139,250,', phase: 5.1 },
    ];

    // Pre-generate smooth bezier-style path points for each trail
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

      // Draw each trail at different progress states
      trails.forEach((trail, ti) => {
        const progress = ((t * trail.speed + ti * 0.2) % 1);
        const len = trail.points.length;

        // Draw the fading portion of the trail
        const start = Math.floor(progress * len);
        const windowSize = 25; // visible portion of the trail

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

        // Leading dot (signal head)
        const headIdx = (start + windowSize - 1) % len;
        ctx.beginPath();
        ctx.arc(trail.points[headIdx].x, trail.points[headIdx].y, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = trail.color + '0.7)';
        ctx.fill();
      });

      t++;
      animId = requestAnimationFrame(render);
    };

    const onResize = () => {
      w = canvas.offsetWidth;
      h = canvas.offsetHeight;
      canvas.width = w;
      canvas.height = h;
    };
    window.addEventListener('resize', onResize);
    render();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

/* ── Sleek SVG hand visualization for hero ────────────────────── */
function HeroHand() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3, duration: 0.7, ease: 'easeOut' }}
      className="relative flex items-center justify-center"
    >
      {/* Glow behind hand */}
      <div
        className="absolute w-56 h-56 rounded-full blur-3xl"
        style={{ background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(34,211,238,0.08) 60%, transparent 100%)' }}
      />

      {/* Hand SVG */}
      <motion.svg
        viewBox="0 0 220 320"
        className="w-64 h-80 relative z-10"
        style={{ overflow: 'visible', filter: 'drop-shadow(0 0 20px rgba(59,130,246,0.2))' }}
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Sensor signal lines — one per finger */}
        {[
          { x: 57,  y: 188, color: '#3B82F6', delay: 0 },
          { x: 89,  y: 118, color: '#22D3EE', delay: 0.3 },
          { x: 116, y: 105, color: '#34D399', delay: 0.6 },
          { x: 143, y: 112, color: '#FB7185', delay: 0.9 },
          { x: 168, y: 130, color: '#A78BFA', delay: 1.2 },
        ].map((s, i) => (
          <motion.line
            key={i}
            x1={s.x} y1={s.y - 8}
            x2={s.x} y2={s.y - 32}
            stroke={s.color}
            strokeWidth="1"
            strokeDasharray="4 4"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.7, 0] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: s.delay, ease: 'easeInOut' }}
          />
        ))}

        {/* Palm */}
        <ellipse cx="115" cy="235" rx="70" ry="65"
          fill="#0C1828" stroke="#2A3F58" strokeWidth="1.5" />

        {/* Wrist */}
        <rect x="80" y="283" width="70" height="28" rx="10"
          fill="#0C1828" stroke="#2A3F58" strokeWidth="1.5" />

        {/* Thumb */}
        <motion.g
          style={{ transformOrigin: '58px 230px' }}
          animate={{ rotate: [-20, -8, -20] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0 }}
        >
          <rect x="42" y="188" width="30" height="58" rx="8"
            fill="#0C1828" stroke="#3B82F6" strokeWidth="1.2"
            style={{ filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.4))' }} />
          <circle cx="57" cy="191" r="13" fill="#0C1828" stroke="#3B82F6" strokeWidth="1.2" />
        </motion.g>

        {/* Index */}
        <motion.g
          style={{ transformOrigin: '88px 198px' }}
          animate={{ rotate: [12, 3, 12], translateY: [6, 2, 6] }}
          transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
        >
          <rect x="76" y="118" width="26" height="88" rx="8"
            fill="#0C1828" stroke="#22D3EE" strokeWidth="1.2"
            style={{ filter: 'drop-shadow(0 0 6px rgba(34,211,238,0.35))' }} />
          <circle cx="89" cy="122" r="12" fill="#0C1828" stroke="#22D3EE" strokeWidth="1.2" />
        </motion.g>

        {/* Middle */}
        <motion.g
          style={{ transformOrigin: '115px 195px' }}
          animate={{ rotate: [8, 2, 8], translateY: [4, 1, 4] }}
          transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
        >
          <rect x="103" y="105" width="26" height="98" rx="8"
            fill="#0C1828" stroke="#34D399" strokeWidth="1.2"
            style={{ filter: 'drop-shadow(0 0 6px rgba(52,211,153,0.35))' }} />
          <circle cx="116" cy="109" r="12" fill="#0C1828" stroke="#34D399" strokeWidth="1.2" />
        </motion.g>

        {/* Ring */}
        <motion.g
          style={{ transformOrigin: '142px 197px' }}
          animate={{ rotate: [-10, -3, -10], translateY: [5, 1, 5] }}
          transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
        >
          <rect x="130" y="112" width="26" height="92" rx="8"
            fill="#0C1828" stroke="#FB7185" strokeWidth="1.2"
            style={{ filter: 'drop-shadow(0 0 6px rgba(251,113,133,0.35))' }} />
          <circle cx="143" cy="116" r="12" fill="#0C1828" stroke="#FB7185" strokeWidth="1.2" />
        </motion.g>

        {/* Little */}
        <motion.g
          style={{ transformOrigin: '168px 200px' }}
          animate={{ rotate: [-15, -5, -15], translateY: [7, 2, 7] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.7 }}
        >
          <rect x="157" y="130" width="22" height="76" rx="7"
            fill="#0C1828" stroke="#A78BFA" strokeWidth="1.2"
            style={{ filter: 'drop-shadow(0 0 6px rgba(167,139,250,0.35))' }} />
          <circle cx="168" cy="133" r="10" fill="#0C1828" stroke="#A78BFA" strokeWidth="1.2" />
        </motion.g>

        {/* Knuckle markers */}
        {[88, 116, 143, 168].map((cx, i) => (
          <circle key={i} cx={cx} cy={217} r="3" fill="#2A3F58" stroke="#7090B0" strokeWidth="1" />
        ))}

        {/* Sensor node labels */}
        {[
          { x: 18,  y: 200, label: 'S1', color: '#3B82F6' },
          { x: 66,  y: 95,  label: 'S2', color: '#22D3EE' },
          { x: 104, y: 78,  label: 'S3', color: '#34D399' },
          { x: 155, y: 88,  label: 'S4', color: '#FB7185' },
          { x: 185, y: 108, label: 'S5', color: '#A78BFA' },
        ].map((s, i) => (
          <motion.g key={i}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          >
            <circle cx={s.x} cy={s.y} r="7" fill={s.color + '18'} stroke={s.color + '60'} strokeWidth="1" />
            <text x={s.x} y={s.y + 4} textAnchor="middle"
              style={{ fontSize: '6px', fontFamily: 'monospace', fill: s.color, fontWeight: 600 }}>
              {s.label}
            </text>
          </motion.g>
        ))}
      </motion.svg>

      {/* Finger activity mini-bars */}
      <div className="absolute -right-16 top-1/2 -translate-y-1/2 flex flex-col gap-2">
        {[
          { color: '#3B82F6', label: 'T', val: 72 },
          { color: '#22D3EE', label: 'I', val: 45 },
          { color: '#34D399', label: 'M', val: 88 },
          { color: '#FB7185', label: 'R', val: 30 },
          { color: '#A78BFA', label: 'L', val: 60 },
        ].map((f, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-1.5"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3 }}
          >
            <span style={{ fontSize: '8px', color: '#7090B0', fontFamily: 'monospace', width: 8 }}>{f.label}</span>
            <div className="w-10 h-1 rounded-full" style={{ background: '#152440' }}>
              <div className="h-full rounded-full" style={{ width: `${f.val}%`, background: f.color }} />
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ── Feature tags — technical style ──────────────────────────── */
const FEATURE_TAGS = [
  { icon: Cpu,      label: '5 Flex Sensors' },
  { icon: Zap,      label: 'ESP32 MCU' },
  { icon: Wifi,     label: 'Wi-Fi + Firebase' },
  { icon: null,     label: 'Movement Detection' },
  { icon: null,     label: 'Rep Counter' },
];

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16"
      style={{ background: 'linear-gradient(160deg, #060E1A 0%, #08111F 50%, #0A1525 100%)' }}
    >
      {/* Animated canvas trails */}
      <HeroCanvas />

      {/* Grid overlay */}
      <div className="absolute inset-0 bg-tech-grid bg-grid opacity-100 pointer-events-none" />

      {/* Scan line */}
      <div className="scan-line" />

      {/* Radial vignette */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 50%, transparent 40%, rgba(6,13,26,0.6) 100%)' }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

          {/* Left — text content */}
          <div className="flex flex-col gap-8">
            {/* Status badge */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="flex items-center gap-2.5"
            >
              <span style={{
                width: 7, height: 7, borderRadius: '50%',
                background: '#34D399',
                boxShadow: '0 0 8px rgba(52,211,153,0.7)',
                display: 'inline-block',
                animation: 'pulseGlow 2s ease-in-out infinite',
              }} />
              <span className="label-mono text-emerald-400" style={{ fontSize: '0.68rem', letterSpacing: '0.12em' }}>
                GLOVE CONNECTED · DEMO ACTIVE
              </span>
            </motion.div>

            {/* Main heading */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="flex flex-col gap-4"
            >
              <h1 className="font-display font-800 text-5xl sm:text-6xl leading-[1.1] tracking-tight" style={{ color: '#E8F2FF' }}>
                Move Better.
                <br />
                <span style={{ color: '#3B82F6' }}>Recover</span>{' '}
                Smarter.
              </h1>
              <p className="text-base max-w-md leading-relaxed" style={{ color: '#95B2CC' }}>
                A smart rehabilitation glove that monitors every finger movement individually — detecting exercises, counting reps, and streaming live sensor data in real time.
              </p>
            </motion.div>

            {/* Feature tags */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap gap-2"
            >
              {FEATURE_TAGS.map(({ icon: Icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium"
                  style={{
                    background: '#0F1E30',
                    borderColor: '#2A3F58',
                    color: '#95B2CC',
                  }}
                >
                  {Icon && <Icon className="w-3 h-3" style={{ color: '#60A5FA' }} />}
                  {label}
                </div>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.55 }}
              className="flex items-center gap-4"
            >
              <button onClick={scrollToDemo} className="btn-primary">
                View Live Demo
                <ChevronDown className="w-4 h-4" />
              </button>
              <span className="label-mono" style={{ color: '#7090B0', fontSize: '0.65rem' }}>
                5 sensors · real-time
              </span>
            </motion.div>
          </div>

          {/* Right — hand visualization */}
          <div className="flex justify-center">
            <HeroHand />
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
        style={{ background: 'linear-gradient(transparent, #0B1220)' }} />
    </section>
  );
}
