import { useState, useCallback, useEffect } from 'react';
import type { ThemeName } from '../types';
import { getStoredTheme, applyTheme, getNextTheme } from '../theme/themes';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeName>(getStoredTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const cycleTheme = useCallback(() => {
    setTheme(prev => {
      const next = getNextTheme(prev);
      return next;
    });
  }, []);

  const setSpecificTheme = useCallback((t: ThemeName) => {
    setTheme(t);
  }, []);

  return { theme, cycleTheme, setSpecificTheme };
}
