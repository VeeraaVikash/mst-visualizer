import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import type { ToastMessage } from '../../types';

const ICON_MAP = { error: AlertCircle, warning: AlertTriangle, info: Info, success: CheckCircle };
const COLOR_MAP = { error: 'var(--accent-reject)', warning: 'var(--accent-active)', info: 'var(--accent-candidate)', success: 'var(--accent-accept)' };

interface Props { toasts: ToastMessage[]; removeToast: (id: string) => void; }

export default function Toast({ toasts, removeToast }: Props) {
  return (
    <div style={{ position: 'fixed', bottom: 80, right: 16, zIndex: 1000, display: 'flex', flexDirection: 'column', gap: 6 }}>
      <AnimatePresence mode="popLayout">
        {toasts.map(t => {
          const Ic = ICON_MAP[t.icon];
          const col = COLOR_MAP[t.icon];
          return (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 60 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 12px', borderRadius: 10,
                background: 'var(--bg-elevated)', border: `1px solid ${col}`, color: 'var(--text-primary)',
                fontFamily: "'JetBrains Mono', monospace", fontSize: 12, minWidth: 240, boxShadow: 'var(--shadow)' }}>
              <Ic size={14} style={{ color: col, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{t.message}</span>
              <button onClick={() => removeToast(t.id)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={12} /></button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
