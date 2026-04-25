import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Keyboard } from 'lucide-react';

interface KeyboardHelpModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const shortcuts = [
  { key: 'N', action: 'Add node mode' },
  { key: 'E', action: 'Connect edge mode' },
  { key: 'K', action: "Switch to Kruskal's" },
  { key: 'P', action: "Switch to Prim's" },
  { key: 'Space', action: 'Play / Pause' },
  { key: 'R', action: 'Reset animation' },
  { key: '\u2190 \u2192', action: 'Step backward / forward' },
  { key: 'C', action: 'Toggle compare mode' },
  { key: 'G', action: 'Generate random graph' },
  { key: 'T', action: 'Cycle themes' },
  { key: '?', action: 'Show this help' },
  { key: 'Esc', action: 'Close / deselect' },
];

const KeyboardHelpModal: React.FC<KeyboardHelpModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: 'rgba(0,0,0,0.6)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
          >
            <motion.div
              className="rounded-xl p-6 max-w-md w-full mx-4 pointer-events-auto"
              style={{
                background: 'var(--bg-panel)',
                border: '1px solid var(--border)',
                boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
              }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Keyboard size={20} style={{ color: 'var(--accent-active)' }} />
                  <h3 className="font-sans font-bold text-lg" style={{ color: 'var(--text-primary)' }}>
                    Keyboard Shortcuts
                  </h3>
                </div>
                <button
                  onClick={onClose}
                  className="rounded-md p-1 transition-colors"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  <X size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                {shortcuts.map(s => (
                  <div
                    key={s.key}
                    className="flex items-center justify-between rounded-lg px-3 py-2"
                    style={{ background: 'var(--bg-elevated)' }}
                  >
                    <span className="kbd-key">{s.key}</span>
                    <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{s.action}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default KeyboardHelpModal;
