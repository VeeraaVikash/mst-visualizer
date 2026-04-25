import React from 'react';
import { Moon, Sun, Swords } from 'lucide-react';
import type { ThemeName } from '../../types';

interface Props { theme: ThemeName; setTheme: (t: ThemeName) => void; }
const items = [{ n: 'dark' as ThemeName, I: Moon }, { n: 'light' as ThemeName, I: Sun }, { n: 'crimson' as ThemeName, I: Swords }];

export default function ThemeToggle({ theme, setTheme }: Props) {
  return (
    <div style={{ display: 'flex', gap: 2, padding: 3, borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
      {items.map(({ n, I }) => (
        <button key={n} onClick={() => setTheme(n)}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 28, height: 26, borderRadius: 6,
            border: theme === n ? '1px solid var(--accent-active)' : '1px solid transparent',
            background: theme === n ? 'var(--bg-panel)' : 'transparent',
            color: theme === n ? 'var(--text-primary)' : 'var(--text-muted)',
            boxShadow: theme === n ? '0 0 6px var(--glow-active)' : 'none', transition: 'all 200ms' }}>
          <I size={13} />
        </button>
      ))}
    </div>
  );
}
