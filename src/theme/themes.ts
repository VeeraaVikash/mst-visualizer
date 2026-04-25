import type { ThemeName } from '../types';

export const THEME_ORDER: ThemeName[] = ['dark', 'light', 'crimson'];

export function getNextTheme(current: ThemeName): ThemeName {
  const idx = THEME_ORDER.indexOf(current);
  return THEME_ORDER[(idx + 1) % THEME_ORDER.length];
}

export function applyTheme(theme: ThemeName): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('mst-theme', theme);
}

export function getStoredTheme(): ThemeName {
  const stored = localStorage.getItem('mst-theme');
  if (stored === 'dark' || stored === 'light' || stored === 'crimson') {
    return stored;
  }
  return 'dark';
}
