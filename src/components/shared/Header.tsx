import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GitGraph, Keyboard, Columns2, LayoutTemplate, ArrowLeft } from 'lucide-react';
import type { ThemeName, AlgorithmType } from '../../types';
import ThemeToggle from './ThemeToggle';

interface HeaderProps {
  theme: ThemeName;
  setSpecificTheme: (t: ThemeName) => void;
  algorithmType?: AlgorithmType;
  compareMode?: boolean;
  onToggleCompare?: () => void;
  onShowHelp?: () => void;
  nodeCount?: number;
  edgeCount?: number;
}

const Header: React.FC<HeaderProps> = ({
  theme,
  setSpecificTheme,
  algorithmType,
  compareMode,
  onToggleCompare,
  onShowHelp,
  nodeCount = 0,
  edgeCount = 0,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isVisualizer = location.pathname === '/app';

  return (
    <header
      className="flex items-center justify-between px-4 py-2 z-30 shrink-0"
      style={{
        background: 'var(--bg-panel)',
        borderBottom: '1px solid var(--border)',
        height: 52,
      }}
    >
      <div className="flex items-center gap-3">
        {isVisualizer && (
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            title="Back to Landing"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}
        >
          <GitGraph size={20} style={{ color: 'var(--accent-accept)' }} />
          <span className="font-sans font-bold text-base" style={{ color: 'var(--text-primary)' }}>
            MST Visualizer
          </span>
        </div>

        {isVisualizer && algorithmType && (
          <div className="flex items-center gap-3 ml-4">
            <div className="flex items-center gap-2">
              <span
                className="font-mono text-xs px-2 py-0.5 rounded"
                style={{
                  background: 'var(--bg-elevated)',
                  color: algorithmType === 'kruskal' ? 'var(--accent-accept)' : 'var(--text-muted)',
                  border: algorithmType === 'kruskal' ? '1px solid var(--accent-accept)' : '1px solid var(--border)',
                }}
              >
                Kruskal O(E log E)
              </span>
              <span
                className="font-mono text-xs px-2 py-0.5 rounded"
                style={{
                  background: 'var(--bg-elevated)',
                  color: algorithmType === 'prim' ? 'var(--accent-accept)' : 'var(--text-muted)',
                  border: algorithmType === 'prim' ? '1px solid var(--accent-accept)' : '1px solid var(--border)',
                }}
              >
                Prim O(E log V)
              </span>
            </div>
            {nodeCount > 0 && (
              <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                V={nodeCount} E={edgeCount}
              </span>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        {isVisualizer && onToggleCompare && (
          <button
            onClick={onToggleCompare}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-mono transition-all"
            style={{
              background: compareMode ? 'var(--accent-active)' : 'var(--bg-elevated)',
              color: compareMode ? '#000' : 'var(--text-secondary)',
              border: '1px solid var(--border)',
            }}
            title="Toggle Compare Mode [C]"
          >
            {compareMode ? <Columns2 size={14} /> : <LayoutTemplate size={14} />}
            {compareMode ? 'Comparing' : 'Compare'}
          </button>
        )}

        <ThemeToggle theme={theme} setTheme={setSpecificTheme} />

        {isVisualizer && onShowHelp && (
          <button
            onClick={onShowHelp}
            className="rounded-md p-1.5 transition-colors"
            style={{
              color: 'var(--text-secondary)',
              background: 'var(--bg-elevated)',
              border: '1px solid var(--border)',
            }}
            title="Keyboard Shortcuts [?]"
          >
            <Keyboard size={16} />
          </button>
        )}

        {!isVisualizer && (
          <button
            onClick={() => navigate('/app')}
            className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-all"
            style={{
              background: 'var(--accent-accept)',
              color: '#fff',
            }}
          >
            <GitGraph size={16} />
            Open Visualizer
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
