/**
 * components/layout/Navbar.jsx — MotionPulse dark theme
 *
 * Clean dark navbar with subtle border, professional status indicator,
 * and no bubbly pastel styling.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, Radio } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',          href: '#hero' },
  { label: 'Live Glove',    href: '#live-hand' },
  { label: 'Exercise Guide',href: '#exercises' },
  { label: 'How It Works',  href: '#how-it-works' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'backdrop-blur-md border-b'
          : 'bg-transparent'
      }`}
      style={scrolled ? { background: 'rgba(8,17,31,0.95)', borderBottomColor: 'rgba(42,63,88,0.6)' } : {}}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-electric-500/10 border border-electric-500/30 flex items-center justify-center">
              <Activity className="w-4 h-4 text-electric-400" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-700 text-sm text-white tracking-wide">MotionPulse</span>
              <span className="label-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#3B82F6' }}>REHAB GLOVE</span>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200"
                style={{ color: '#95B2CC' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#E8F2FF'; e.currentTarget.style.background = 'rgba(42,63,88,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#95B2CC'; e.currentTarget.style.background = 'transparent'; }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Status + mobile toggle */}
          <div className="flex items-center gap-3">
            {/* Demo status — technical style */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-400/30 rounded-lg">
              <span className="status-dot-active" style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px rgba(52,211,153,0.6)' }} />
              <Radio className="w-3 h-3 text-emerald-400" />
              <span className="label-mono text-emerald-400" style={{ fontSize: '0.65rem' }}>DEMO LIVE</span>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: '#7090B0' }}
              onMouseEnter={e => { e.currentTarget.style.color = '#E8F2FF'; e.currentTarget.style.background = 'rgba(42,63,88,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.color = '#7090B0'; e.currentTarget.style.background = 'transparent'; }}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden backdrop-blur-md border-t overflow-hidden"
            style={{ background: 'rgba(8,17,31,0.98)', borderTopColor: 'rgba(42,63,88,0.5)' }}
          >
            <div className="px-4 py-3 space-y-1">
              {NAV_LINKS.map(link => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left px-4 py-3 text-sm font-medium rounded-lg transition-colors"
                  style={{ color: '#95B2CC' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#E8F2FF'; e.currentTarget.style.background = 'rgba(42,63,88,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#95B2CC'; e.currentTarget.style.background = 'transparent'; }}
                >
                  {link.label}
                </button>
              ))}
              <div className="pt-2 pb-1 px-4">
                <div className="flex items-center gap-2">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#34D399', boxShadow: '0 0 6px rgba(52,211,153,0.6)' }} />
                  <span className="label-mono text-emerald-400" style={{ fontSize: '0.65rem' }}>DEMO MODE ACTIVE</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
