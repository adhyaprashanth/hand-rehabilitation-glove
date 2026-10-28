/**
 * components/layout/Navbar.jsx — Rehabilitation Portal
 *
 * Clean patient portal navigation with Light/Dark theme toggle,
 * direct ESP32 hardware connect button, and streamlined patient links.
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Activity, Radio, Usb, Plug, Sun, Moon, Wifi } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',          href: '#hero' },
  { label: 'Live Hand',     href: '#live-hand' },
  { label: 'Exercises',     href: '#exercises' },
  { label: 'Mobility',      href: '#sensor-readings' },
  { label: 'Calibration',   href: '#calibration' },
];

export default function Navbar({
  isSerialConnected = false,
  isFirebaseConnected = false,
  isWebSerialSupported = true,
  onConnectESP32,
  onDisconnectESP32,
  theme = 'dark',
  onToggleTheme,
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
        scrolled ? 'backdrop-blur-md border-b' : 'bg-transparent'
      }`}
      style={
        scrolled
          ? {
              background: 'var(--bg-card)',
              borderBottomColor: 'var(--border-subtle)',
              opacity: 0.96,
            }
          : {}
      }
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: 'rgba(59,130,246,0.12)',
                border: '1px solid rgba(59,130,246,0.3)',
              }}
            >
              <Activity className="w-4 h-4 text-blue-500" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display font-700 text-sm tracking-wide" style={{ color: 'var(--text-primary)' }}>
                DEXTER
              </span>
              <span
                className="label-mono font-semibold"
                style={{ fontSize: '0.58rem', letterSpacing: '0.1em', color: '#3B82F6' }}
              >
                REHAB GLOVE
              </span>
            </div>
          </div>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(link => (
              <button
                key={link.href}
                onClick={() => handleNavClick(link.href)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 hover:text-blue-500 hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                style={{ color: 'var(--text-secondary)' }}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* Controls: Connect Button + Light Theme Toggle + Mobile Menu */}
          <div className="flex items-center gap-2.5">

            {/* Wi-Fi & Firebase Status Pill */}
            {isFirebaseConnected && (
              <div
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                style={{
                  background: 'rgba(52,211,153,0.15)',
                  border: '1px solid rgba(52,211,153,0.5)',
                  color: '#10B981',
                }}
                title="Receiving live stream over Wi-Fi & Firebase"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <Wifi className="w-3.5 h-3.5" />
                <span className="label-mono">WI-FI LIVE</span>
              </div>
            )}

            {/* ESP32 Connect / Disconnect Button */}
            {isWebSerialSupported && (
              <button
                onClick={handleConnectToggle}
                disabled={connecting}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
                style={{
                  background: isSerialConnected
                    ? 'rgba(16,185,129,0.15)'
                    : 'rgba(59,130,246,0.15)',
                  border: isSerialConnected
                    ? '1px solid rgba(52,211,153,0.5)'
                    : '1px solid rgba(59,130,246,0.4)',
                  color: isSerialConnected ? '#10B981' : '#3B82F6',
                }}
                title={isSerialConnected ? 'Click to disconnect ESP32' : 'Connect ESP32 via USB Serial'}
              >
                {isSerialConnected ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <Usb className="w-3.5 h-3.5" />
                    <span className="label-mono">GLOVE CONNECTED</span>
                  </>
                ) : (
                  <>
                    <Plug className="w-3.5 h-3.5" />
                    <span className="label-mono">{connecting ? 'CONNECTING...' : 'CONNECT GLOVE'}</span>
                  </>
                )}
              </button>
            )}

            {/* Light / Dark Theme Button */}
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg border transition-all duration-200 hover:scale-105 active:scale-95"
              style={{
                background: 'var(--bg-card-elevated)',
                borderColor: 'var(--border-subtle)',
                color: 'var(--text-primary)',
              }}
              title={theme === 'dark' ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-blue-600" />
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="md:hidden p-2 rounded-lg transition-colors"
              style={{ color: 'var(--text-primary)' }}
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
            style={{
              background: 'var(--bg-card)',
              borderTopColor: 'var(--border-subtle)',
            }}
          >
            <div className="px-4 py-4 space-y-2">
              {NAV_LINKS.map(link => (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left px-3 py-2 text-sm rounded-lg"
                  style={{ color: 'var(--text-primary)' }}
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
                    color: isSerialConnected ? '#10B981' : '#3B82F6',
                    border: `1px solid ${isSerialConnected ? '#10B981' : '#3B82F6'}`,
                  }}
                >
                  <Usb className="w-4 h-4" />
                  {isSerialConnected ? 'DISCONNECT GLOVE' : 'CONNECT REHAB GLOVE (USB)'}
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
