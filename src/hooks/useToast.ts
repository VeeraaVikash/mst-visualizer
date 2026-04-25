import { useState, useCallback, useRef } from 'react';
import type { ToastMessage } from '../types';

const MAX_TOASTS = 3;

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const counterRef = useRef(0);

  const addToast = useCallback((message: string, icon: ToastMessage['icon'] = 'info') => {
    const id = `toast-${counterRef.current++}`;
    const toast: ToastMessage = { id, message, icon };

    setToasts(prev => {
      const next = [...prev, toast];
      if (next.length > MAX_TOASTS) {
        return next.slice(next.length - MAX_TOASTS);
      }
      return next;
    });

    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  return { toasts, addToast, removeToast };
}
