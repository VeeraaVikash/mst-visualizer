import { useState, useEffect, useCallback } from 'react';
import type { ThemeName } from '../types';

const THEMES: Record<ThemeName, Record<string, string>> = {
  dark: {
    '--bg-base':'#030712','--bg-panel':'#111827','--bg-canvas':'#030712',
    '--bg-elevated':'#1F2937','--border':'rgba(255,255,255,0.08)',
    '--text-primary':'#F9FAFB','--text-secondary':'#9CA3AF','--text-muted':'#4B5563',
    '--accent-default':'#374151','--accent-active':'#F59E0B','--accent-accept':'#10B981',
    '--accent-reject':'#EF4444','--accent-candidate':'#3B82F6',
    '--dot-color':'rgba(255,255,255,0.05)','--glow-accept':'rgba(16,185,129,0.3)',
    '--glow-active':'rgba(245,158,11,0.3)','--shadow':'0 8px 32px rgba(0,0,0,0.4)',
  },
  light: {
    '--bg-base':'#F8FAFC','--bg-panel':'#FFFFFF','--bg-canvas':'#F1F5F9',
    '--bg-elevated':'#FFFFFF','--border':'rgba(15,23,42,0.08)',
    '--text-primary':'#0F172A','--text-secondary':'#475569','--text-muted':'#94A3B8',
    '--accent-default':'#CBD5E1','--accent-active':'#D97706','--accent-accept':'#059669',
    '--accent-reject':'#DC2626','--accent-candidate':'#4F46E5',
    '--dot-color':'rgba(15,23,42,0.06)','--glow-accept':'rgba(5,150,105,0.2)',
    '--glow-active':'rgba(217,119,6,0.2)','--shadow':'0 8px 24px rgba(15,23,42,0.04)',
  },
  crimson: {
    '--bg-base':'#0A0118','--bg-panel':'#170824','--bg-canvas':'#0A0118',
    '--bg-elevated':'#2A0E3D','--border':'rgba(244,63,94,0.15)',
    '--text-primary':'#FFF1F2','--text-secondary':'#FDA4AF','--text-muted':'#9F1239',
    '--accent-default':'#4C1D95','--accent-active':'#FDE047','--accent-accept':'#F43F5E',
    '--accent-reject':'#38BDF8','--accent-candidate':'#8B5CF6',
    '--dot-color':'rgba(244,63,94,0.08)','--glow-accept':'rgba(244,63,94,0.35)',
    '--glow-active':'rgba(253,224,71,0.3)','--shadow':'0 8px 32px rgba(244,63,94,0.12)',
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
