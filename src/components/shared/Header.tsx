import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GitGraph, Keyboard, ArrowLeft } from 'lucide-react';
import type { ThemeName, AlgorithmType } from '../../types';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: ThemeName;
  setSpecificTheme: (t: ThemeName) => void;
  algorithmType?: AlgorithmType;
  onShowHelp?: () => void;
  nodeCount?: number;
  edgeCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  setSpecificTheme,
  algorithmType,
  onShowHelp,
  nodeCount = 0,
  edgeCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isVisualizer = location.pathname === '/app';

  return (
    <header
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px', height: 48, flexShrink: 0, zIndex: 30,
        background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {isVisualizer && (
          <button onClick={() => navigate('/')} title="Back to Landing"
            style={{ display: 'flex', alignItems: 'center', padding: '4px 6px', borderRadius: 6, background: 'none', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <ArrowLeft size={14} />
          </button>
        )}
        <div onClick={() => navigate('/')} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent-accept), var(--accent-candidate))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitGraph size={14} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 15, color: 'var(--text-primary)', letterSpacing: '-0.3px', lineHeight: 1, display: 'flex', alignItems: 'center' }}>Route D. Optimal</span>
        </div>

        {isVisualizer && algorithmType && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '4px 8px', borderRadius: 6,
              background: algorithmType === 'kruskal' ? 'color-mix(in srgb, var(--accent-accept) 15%, transparent)' : 'var(--bg-elevated)',
              color: algorithmType === 'kruskal' ? 'var(--accent-accept)' : 'var(--text-muted)',
              border: `1px solid ${algorithmType === 'kruskal' ? 'var(--accent-accept)' : 'var(--border)'}`,
              fontWeight: 600,
            }}>
              Kruskal's
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1,
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, padding: '4px 8px', borderRadius: 6,
              background: algorithmType === 'prim' ? 'color-mix(in srgb, var(--accent-candidate) 15%, transparent)' : 'var(--bg-elevated)',
              color: algorithmType === 'prim' ? 'var(--accent-candidate)' : 'var(--text-muted)',
              border: `1px solid ${algorithmType === 'prim' ? 'var(--accent-candidate)' : 'var(--border)'}`,
              fontWeight: 600,
            }}>
              Prim's
            </span>
            {nodeCount > 0 && (
              <span style={{ display: 'flex', alignItems: 'center', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-muted)', lineHeight: 1 }}>
                V={nodeCount} E={edgeCount}
              </span>
            )}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <ThemeToggle theme={theme} setTheme={setSpecificTheme} />
        {isVisualizer && onShowHelp && (
          <button onClick={onShowHelp} title="Keyboard Shortcuts [?]"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <Keyboard size={14} />
          </button>
        )}
        {!isVisualizer && (
          <button onClick={() => navigate('/app')}
            style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', borderRadius: 10, border: 'none', background: 'var(--text-primary)', color: 'var(--bg-base)', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
            <GitGraph size={14} /> Launch App
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
