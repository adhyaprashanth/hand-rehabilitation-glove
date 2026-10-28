/**
 * components/layout/Footer.jsx — Rehabilitation Portal
 */

import { Activity, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      className="border-t transition-colors duration-300"
      style={{
        background: 'var(--bg-primary)',
        borderColor: 'var(--border-subtle)',
      }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">

        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)' }}
          >
            <Activity className="w-4 h-4 text-blue-500" />
          </div>
          <div>
            <p className="font-display font-600 text-sm text-slate-900 dark:text-white">DEXTER</p>
            <p className="label-mono text-slate-500 dark:text-slate-400" style={{ fontSize: '0.58rem' }}>
              SMART HAND REHABILITATION COMPANION
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span className="label-mono text-emerald-500" style={{ fontSize: '0.62rem' }}>
              THERAPY COMPANION ACTIVE
            </span>
          </div>
          <span className="label-mono" style={{ fontSize: '0.6rem' }}>
            5 SENSORS · USB DIRECT
          </span>
        </div>
      </div>
    </footer>
  );
}
