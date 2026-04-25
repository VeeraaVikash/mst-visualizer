import React from 'react';
import { motion } from 'framer-motion';
import { Keyboard } from 'lucide-react';

const shortcuts = [
  { key: 'Space', action: 'Play / Pause' },
  { key: 'R', action: 'Reset animation' },
  { key: 'N', action: 'Add node mode' },
  { key: 'E', action: 'Connect edge mode' },
  { key: 'K', action: "Switch to Kruskal's" },
  { key: 'P', action: "Switch to Prim's" },
  { key: 'C', action: 'Toggle Compare mode' },
  { key: '\u2190 \u2192', action: 'Step backward / forward' },
];

const KeyboardPreview: React.FC = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-3 mb-3">
            <Keyboard size={24} style={{ color: 'var(--accent-active)' }} />
            <h2 className="font-sans font-bold text-2xl" style={{ color: 'var(--text-primary)' }}>
              Built for speed. Keyboard-first.
            </h2>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
            Every action has a keyboard shortcut. Keep your hands on the keys.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-3"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          {shortcuts.map((s, i) => (
            <motion.div
              key={s.key}
              className="flex items-center gap-3 rounded-lg px-4 py-3"
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border)',
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
            >
              <span className="kbd-key">{s.key}</span>
              <span className="text-xs" style={{ color: 'var(--text-secondary)' }}>{s.action}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default KeyboardPreview;
