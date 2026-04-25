import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Keyboard, X } from 'lucide-react';

const SHORTCUTS = [
  ['N', 'Add node'], ['E', 'Connect edge'], ['D', 'Delete mode'], ['K', "Kruskal's"],
  ['P', "Prim's"], ['Space', 'Play/Pause'], ['R', 'Reset animation'], ['←→', 'Step back/fwd'],
  ['C', 'Race comparison'], ['G', 'Random graph'], ['T', 'Cycle themes'], ['Z', 'Fit view'],
  ['?', 'Help'], ['Esc', 'Close/cancel'],
];

interface Props { open: boolean; onClose: () => void; }

export default function KeyboardModal({ open, onClose }: Props) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}
            style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.6)' }} />
          <motion.div style={{ position: 'fixed', inset: 0, zIndex: 201, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
            <motion.div initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.94 }} transition={{ duration: 0.2 }}
              style={{ background: 'var(--bg-panel)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, maxWidth: 400, width: '90%', pointerEvents: 'auto', boxShadow: 'var(--shadow)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 18 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Keyboard size={16} style={{ color: 'var(--accent-active)' }} />
                  <span style={{ fontWeight: 700, fontSize: 16, color: 'var(--text-primary)' }}>Keyboard Shortcuts</span>
                </div>
                <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={16} /></button>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5 }}>
                {SHORTCUTS.map(([k, a]) => (
                  <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: 7, background: 'var(--bg-elevated)' }}>
                    <span className="kbd">{k}</span>
                    <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
