import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, AlertTriangle, Info, CheckCircle, X } from 'lucide-react';
import type { ToastMessage } from '../../types';

interface ToastProps {
  toasts: ToastMessage[];
  removeToast: (id: string) => void;
}

const iconMap = {
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
  success: CheckCircle,
};

const colorMap = {
  error: 'var(--accent-reject)',
  warning: 'var(--accent-active)',
  info: 'var(--accent-candidate)',
  success: 'var(--accent-accept)',
};

const Toast: React.FC<ToastProps> = ({ toasts, removeToast }) => {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const Icon = iconMap[toast.icon];
          return (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.9 }}
              transition={{ duration: 0.25 }}
              className="flex items-center gap-3 rounded-lg px-4 py-3 font-mono text-sm shadow-lg"
              style={{
                background: 'var(--bg-elevated)',
                border: `1px solid ${colorMap[toast.icon]}`,
                color: 'var(--text-primary)',
                minWidth: 280,
              }}
            >
              <Icon size={16} style={{ color: colorMap[toast.icon], flexShrink: 0 }} />
              <span className="flex-1">{toast.message}</span>
              <button
                onClick={() => removeToast(toast.id)}
                className="opacity-50 hover:opacity-100 transition-opacity"
                style={{ color: 'var(--text-secondary)' }}
              >
                <X size={14} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default Toast;
