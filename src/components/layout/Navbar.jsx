/**
 * components/layout/Navbar.jsx — DEXTER dark theme
 *
 * Clean dark navbar with subtle border, professional status indicator,
 * and ESP32 USB hardware connect button.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, Radio, Usb, Plug } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',          href: '#hero' },
  { label: 'Live Glove',    href: '#live-hand' },
  { label: 'Sensor Cards',  href: '#sensor-readings' },
  { label: 'Live Graph',    href: '#graph' },
  { label: 'Exercise Guide',href: '#exercises' },
  { label: 'How It Works',  href: '#how-it-works' },
];

export default function Navbar({
  isSerialConnected = false,
  isWebSerialSupported = true,
  onConnectESP32,
  onDisconnectESP32,
}) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);

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

  const handleConnectToggle = async () => {
    if (isSerialConnected) {
      if (onDisconnectESP32) await onDisconnectESP32();
    } else {
      setConnecting(true);
      try {
        if (onConnectESP32) await onConnectESP32();
      } finally {
        setConnecting(false);
      }
    }
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
              <span className="font-display font-700 text-sm text-white tracking-wide">DEXTER</span>
              <span className="label-mono" style={{ fontSize: '0.6rem', letterSpacing: '0.1em', color: '#3B82F6' }}>REHAB GLOVE</span>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200"
                style={{ color: '#95B2CC' }}
                onMouseEnter={e => { e.currentTarget.style.color = '#E8F2FF'; e.currentTarget.style.background = 'rgba(42,63,88,0.4)'; }}
                onMouseLeave={e => { e.currentTarget.style.color = '#95B2CC'; e.currentTarget.style.background = 'transparent'; }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Status + Connect Button + mobile toggle */}
          <div className="flex items-center gap-3">

            {/* ESP32 Connect / Disconnect Button */}
            {isWebSerialSupported ? (
              <button
                onClick={handleConnectToggle}
                disabled={connecting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 shadow-sm"
                style={{
                  background: isSerialConnected
                    ? 'rgba(16,185,129,0.15)'
                    : 'rgba(59,130,246,0.15)',
                  border: isSerialConnected
                    ? '1px solid rgba(52,211,153,0.5)'
                    : '1px solid rgba(59,130,246,0.4)',
                  color: isSerialConnected ? '#34D399' : '#60A5FA',
                }}
                title={isSerialConnected ? 'Click to disconnect ESP32' : 'Connect ESP32 via USB Serial'}
              >
                {isSerialConnected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <Usb className="w-3.5 h-3.5" />
                    <span className="label-mono">ESP32 LIVE (USB)</span>
                  </>
                ) : (
                  <>
                    <Plug className="w-3.5 h-3.5" />
                    <span className="label-mono">{connecting ? 'CONNECTING...' : 'CONNECT ESP32'}</span>
                  </>
                )}
              </button>
            ) : null}

            {/* Mode Indicator badge */}
            <div
              className="hidden sm:flex items-center gap-2 px-2.5 py-1.5 rounded-lg border text-xs"
              style={{
                background: isSerialConnected ? 'rgba(16,185,129,0.08)' : 'rgba(245,158,11,0.08)',
                borderColor: isSerialConnected ? 'rgba(52,211,153,0.3)' : 'rgba(245,158,11,0.3)',
              }}
            >
              <Radio
                className="w-3 h-3"
                style={{ color: isSerialConnected ? '#34D399' : '#FBBF24' }}
              />
              <span
                className="label-mono"
                style={{
                  fontSize: '0.62rem',
                  color: isSerialConnected ? '#34D399' : '#FBBF24',
                }}
              >
                {isSerialConnected ? 'HARDWARE' : 'SIMULATION'}
              </span>
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
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map(link => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left px-3 py-2 text-sm rounded-lg"
                  style={{ color: '#95B2CC' }}
                >
                  {link.label}
                </button>
              ))}

              {isWebSerialSupported && (
                <button
                  onClick={handleConnectToggle}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold"
                  style={{
                    background: isSerialConnected ? 'rgba(16,185,129,0.2)' : 'rgba(59,130,246,0.2)',
                    color: isSerialConnected ? '#34D399' : '#60A5FA',
                    border: `1px solid ${isSerialConnected ? '#34D399' : '#3B82F6'}`,
                  }}
                >
                  <Usb className="w-4 h-4" />
                  {isSerialConnected ? 'DISCONNECT ESP32' : 'CONNECT ESP32 (USB)'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
