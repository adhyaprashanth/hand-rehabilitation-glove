/**
 * pages/Home/HeroSection.jsx
 *
 * The first thing visitors see — animated hero with glove illustration,
 * connection status badge, and a CTA that scrolls to the live demo.
 */

import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const scrollToDemo = () => {
  document.querySelector('#live-hand')?.scrollIntoView({ behavior: 'smooth' });
};

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-gradient-hero overflow-hidden pt-16"
    >
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 rounded-full bg-blue-100 opacity-50 blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-purple-100 opacity-50 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full bg-peach-100 opacity-40 blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center gap-8">
        {/* Status badge */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.5 }}
          className="flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-green-200 rounded-full shadow-soft"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-sm font-semibold text-green-700">🟢 Glove Connected</span>
        </motion.div>

        {/* Floating glove illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 120, damping: 18 }}
          className="animate-float"
        >
          <div className="relative w-52 h-52 flex items-center justify-center">
            {/* Outer glow ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-200 to-purple-200 opacity-50 blur-xl" />
            {/* Card */}
            <div className="relative w-44 h-44 rounded-full bg-white/80 backdrop-blur-sm shadow-soft-lg flex items-center justify-center border border-purple-100">
              <span className="text-8xl select-none">🧤</span>
            </div>
            {/* Orbiting sensor dots */}
            {['#93C5FD', '#C4B5FD', '#86EFAC', '#FDBA74', '#F9A8D4'].map((color, i) => {
              const angle = (i / 5) * 360;
              const rad = (angle * Math.PI) / 180;
              const r = 90;
              const x = 110 + r * Math.cos(rad);
              const y = 110 + r * Math.sin(rad);
              return (
                <motion.div
                  key={i}
                  className="absolute w-5 h-5 rounded-full border-2 border-white shadow-md flex items-center justify-center"
                  style={{
                    left: x - 10,
                    top: y - 10,
                    background: color,
                  }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1.5 + i * 0.3, repeat: Infinity, delay: i * 0.25 }}
                >
                  <span className="text-[8px] font-bold text-white">{i + 1}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.5 }}
          className="flex flex-col gap-4"
        >
          <h1 className="font-display font-800 text-5xl sm:text-6xl md:text-7xl text-gray-800 leading-tight">
            Hand{' '}
            <span
              className="bg-clip-text text-transparent"
              style={{ backgroundImage: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
            >
              Rehabilitation
            </span>{' '}
            Glove
          </h1>
          <p className="text-lg sm:text-xl text-gray-400 max-w-xl mx-auto font-light">
            Smart finger movement monitoring made simple.
          </p>
        </motion.div>

        {/* Feature chips */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-wrap justify-center gap-2"
        >
          {[
            '5 Flex Sensors',
            'ESP32 + Wi-Fi',
            'Firebase Cloud',
            'Movement Detection',
            'Rep Counter',
          ].map(tag => (
            <span
              key={tag}
              className="px-3 py-1.5 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-full text-xs font-medium text-gray-600 shadow-soft"
            >
              {tag}
            </span>
          ))}
        </motion.div>

        {/* CTA button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
        >
          <button
            onClick={scrollToDemo}
            className="group flex items-center gap-2 px-8 py-4 rounded-2xl text-white font-semibold text-base shadow-soft-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
            style={{ background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)' }}
          >
            Explore Live Demo
            <ChevronDown className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 60 C360 0 1080 0 1440 60 V60 H0 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
