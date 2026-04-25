import { useState, useEffect, useCallback } from 'react';
import type { ThemeName } from '../types';

const THEMES: Record<ThemeName, Record<string, string>> = {
  dark: {
    '--bg-base':'#060b14','--bg-panel':'#0c1220','--bg-canvas':'#050a12',
    '--bg-elevated':'#111a2e','--border':'rgba(99,179,237,0.1)',
    '--text-primary':'#e2e8f0','--text-secondary':'#64748b','--text-muted':'#2d3748',
    '--accent-default':'#2d3748','--accent-active':'#f6ad55','--accent-accept':'#48bb78',
    '--accent-reject':'#fc8181','--accent-candidate':'#63b3ed',
    '--dot-color':'rgba(99,179,237,0.05)','--glow-accept':'rgba(72,187,120,0.25)',
    '--glow-active':'rgba(246,173,85,0.2)','--shadow':'0 4px 24px rgba(0,0,0,0.5)',
  },
  light: {
    '--bg-base':'#f0f4f8','--bg-panel':'#ffffff','--bg-canvas':'#e8eef5',
    '--bg-elevated':'#f8fafc','--border':'rgba(0,0,0,0.09)',
    '--text-primary':'#0f172a','--text-secondary':'#475569','--text-muted':'#94a3b8',
    '--accent-default':'#94a3b8','--accent-active':'#d97706','--accent-accept':'#059669',
    '--accent-reject':'#dc2626','--accent-candidate':'#2563eb',
    '--dot-color':'rgba(0,0,0,0.05)','--glow-accept':'rgba(5,150,105,0.15)',
    '--glow-active':'rgba(217,119,6,0.15)','--shadow':'0 4px 24px rgba(0,0,0,0.1)',
  },
  crimson: {
    '--bg-base':'#0d0508','--bg-panel':'#130a0c','--bg-canvas':'#0a0306',
    '--bg-elevated':'#1f0e12','--border':'rgba(220,38,38,0.15)',
    '--text-primary':'#fef2f2','--text-secondary':'#f87171','--text-muted':'#450a0a',
    '--accent-default':'#7f1d1d','--accent-active':'#f97316','--accent-accept':'#dc2626',
    '--accent-reject':'#7c3aed','--accent-candidate':'#fb923c',
    '--dot-color':'rgba(220,38,38,0.06)','--glow-accept':'rgba(220,38,38,0.3)',
    '--glow-active':'rgba(249,115,22,0.2)','--shadow':'0 4px 24px rgba(220,38,38,0.15)',
  },
};

const ORDER: ThemeName[] = ['dark', 'light', 'crimson'];

function applyTheme(t: ThemeName) {
  const vars = THEMES[t];
  Object.entries(vars).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
  document.documentElement.setAttribute('data-theme', t);
  try { localStorage.setItem('gf-theme', t); } catch {}
}

function storedTheme(): ThemeName {
  try {
    const s = localStorage.getItem('gf-theme');
    if (s && THEMES[s as ThemeName]) return s as ThemeName;
  } catch {}
  return 'dark';
}

export function useTheme() {
  const [theme, setThemeState] = useState<ThemeName>(storedTheme);
  useEffect(() => applyTheme(theme), [theme]);
  const setTheme = useCallback((t: ThemeName) => setThemeState(t), []);
  const cycleTheme = useCallback(() => setThemeState(p => ORDER[(ORDER.indexOf(p) + 1) % 3]), []);
  return { theme, setTheme, cycleTheme };
}
