/**
 * components/common/SectionTitle.jsx
 *
 * Reusable section heading component with emoji, title, and subtitle.
 */

import { motion } from 'framer-motion';

/**
 * @param {{ emoji: string, title: string, subtitle?: string, align?: 'left'|'center' }} props
 */
export default function SectionTitle({ emoji, title, subtitle, align = 'center' }) {
  const alignClass = align === 'left' ? 'text-left' : 'text-center';
  const itemsClass = align === 'left' ? 'items-start' : 'items-center';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className={`flex flex-col ${itemsClass} gap-3 mb-10`}
    >
      <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-purple-50 border border-purple-100 rounded-full">
        <span className="text-xl">{emoji}</span>
        <span className="text-sm font-semibold text-purple-600">{title}</span>
      </div>
      {subtitle && (
        <p className={`text-gray-500 text-base max-w-md ${alignClass}`}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
