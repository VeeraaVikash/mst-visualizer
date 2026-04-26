import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import type { ToastMessage } from '../../types';

const ICON_MAP = { error: AlertCircle, warning: AlertTriangle, info: Info, success: CheckCircle };
const COLOR_MAP = { error: 'var(--accent-reject)', warning: 'var(--accent-active)', info: 'var(--accent-candidate)', success: 'var(--accent-accept)' };

interface Props { toasts: ToastMessage[]; removeToast: (id: string) => void; }

export default function Toast({ toasts, removeToast }: Props) {
  return (
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AnimatePresence mode="popLayout">
        {toasts.map(t => {
          const Ic = ICON_MAP[t.icon];
          const col = COLOR_MAP[t.icon];
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 60, scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 12,
                background: 'color-mix(in srgb, var(--bg-panel) 90%, transparent)', backdropFilter: 'blur(10px)',
                border: `1px solid ${col}`, color: 'var(--text-primary)',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, minWidth: 240, boxShadow: '0 10px 30px rgba(0,0,0,0.15), 0 0 0 1px color-mix(in srgb, var(--border) 50%, transparent)' }}>
              <Ic size={16} style={{ color: col, flexShrink: 0 }} />
              <span style={{ flex: 1, fontWeight: 500 }}>{t.message}</span>
              <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}><X size={14} /></button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
