import React from 'react';
import { Moon, Sun, Swords } from 'lucide-react';
import type { ThemeName } from '../../types';

interface ThemeToggleProps {
  theme: ThemeName;
  setSpecificTheme: (t: ThemeName) => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, setSpecificTheme }) => {
  const themes: { name: ThemeName; icon: React.ReactNode; label: string }[] = [
    { name: 'dark', icon: <Moon size={16} />, label: 'Dark theme' },
    { name: 'light', icon: <Sun size={16} />, label: 'Light theme' },
    { name: 'crimson', icon: <Swords size={16} />, label: 'Crimson theme' },
  ];

  return (
    <div className="flex items-center gap-1 rounded-lg p-1" style={{ background: 'var(--bg-elevated)' }}>
      {themes.map(t => (
        <button
          key={t.name}
          onClick={() => setSpecificTheme(t.name)}
          title={t.label}
          className="relative rounded-md px-2 py-1.5 transition-all duration-200"
          style={{
            color: theme === t.name ? 'var(--text-primary)' : 'var(--text-muted)',
            background: theme === t.name ? 'var(--bg-panel)' : 'transparent',
            boxShadow: theme === t.name ? '0 0 8px var(--accent-active)' : 'none',
            border: theme === t.name ? '1px solid var(--accent-active)' : '1px solid transparent',
          }}
        >
          {t.icon}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
