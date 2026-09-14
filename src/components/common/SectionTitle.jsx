/**
 * components/common/SectionTitle.jsx — MotionPulse dark theme
 *
 * Clean section heading with a compact technical label badge,
 * no emoji pills or pastel backgrounds.
 */

import { motion } from 'framer-motion';

/**
 * @param {{ icon?: React.ComponentType, label: string, title: string, subtitle?: string, align?: 'left'|'center' }} props
 */
export default function SectionTitle({ icon: Icon, emoji, title, subtitle, align = 'center' }) {
  const alignClass  = align === 'left' ? 'text-left'    : 'text-center';
  const itemsClass  = align === 'left' ? 'items-start'  : 'items-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col ${itemsClass} gap-3 mb-10`}
    >
      {/* Label badge — technical style */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border"
        style={{ background: 'rgba(59,130,246,0.08)', borderColor: 'rgba(59,130,246,0.2)' }}>
        <span className="w-1.5 h-1.5 rounded-full bg-electric-400" style={{ background: '#60A5FA' }} />
        <span className="label-mono text-electric-400" style={{ color: '#60A5FA', fontSize: '0.65rem', letterSpacing: '0.1em' }}>
          {title}
        </span>
      </div>

      {subtitle && (
        <p className={`text-base max-w-lg leading-relaxed ${alignClass}`} style={{ color: '#95B2CC' }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
