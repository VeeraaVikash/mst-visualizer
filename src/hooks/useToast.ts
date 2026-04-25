import { useState, useCallback, useRef } from 'react';
import type { ToastMessage } from '../types';

export function useToast() {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const ctr = useRef(0);
  const addToast = useCallback((message: string, icon: ToastMessage['icon'] = 'info') => {
    const id = `t${ctr.current++}`;
    setToasts(p => [...p.slice(-2), { id, message, icon }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  const removeToast = useCallback((id: string) => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, addToast, removeToast };
}
