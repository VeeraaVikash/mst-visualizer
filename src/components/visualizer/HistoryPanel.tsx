import React, { useRef, useEffect } from 'react';
import { History, Zap, Search, CheckCircle, XCircle, Target, Activity, Trophy } from 'lucide-react';
import type { AlgorithmStep } from '../../types';
import { SCENARIOS } from '../../data/scenarios';

interface Props { steps: AlgorithmStep[]; currentIdx: number; onJump: (i: number) => void; algoType: string; scenario: string; }

const TYPE_CFG: Record<string, { I: React.ElementType; c: string; label: string }> = {
  SORT_EDGES:          { I: Zap,           c: 'var(--accent-active)',    label: 'Sort' },
  CONSIDER_EDGE:       { I: Search,        c: 'var(--accent-active)',    label: 'Eval' },
  ACCEPT_EDGE:         { I: CheckCircle,   c: 'var(--accent-accept)',   label: 'Add'  },
  REJECT_EDGE:         { I: XCircle,       c: 'var(--accent-reject)',   label: 'Skip' },
  ADD_NODE:            { I: Target,        c: 'var(--accent-candidate)', label: 'Seed' },
  HIGHLIGHT_CANDIDATES:{ I: Activity,      c: 'var(--accent-candidate)', label: 'Scan' },
  COMPLETE:            { I: Trophy,        c: 'var(--accent-active)',    label: 'Done' },
};

export default function HistoryPanel({ steps, currentIdx, onJump, algoType, scenario }: Props) {
  const sc = SCENARIOS[scenario];
  const unit = sc?.unit ?? '';
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current && currentIdx >= 0) {
      const el = listRef.current.children[currentIdx] as HTMLElement | undefined;
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  }, [currentIdx]);

  if (!steps.length) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 10, padding: 20, textAlign: 'center' }}>
        <History size={28} style={{ color: 'var(--text-muted)', opacity: 0.4 }} />
        <p style={{ fontSize: 12, color: 'var(--text-muted)', maxWidth: 180 }}>Run an algorithm to see the step-by-step decision log here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{ padding: '7px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6 }}>
        <History size={12} style={{ color: 'var(--accent-active)' }} />
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-primary)' }}>
          {algoType === 'kruskal' ? "Kruskal's" : "Prim's"} — {steps.length} steps
        </span>
      </div>
      <div ref={listRef} style={{ flex: 1, overflowY: 'auto', padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 8 }}>
        {steps.map((s, i) => {
          const cfg = TYPE_CFG[s.type] ?? TYPE_CFG.CONSIDER_EDGE;
          const isCur = i === currentIdx;
          const isPast = i < currentIdx;
          
          return (
            <div key={i} onClick={() => onJump(i)}
              style={{ 
                display: 'flex', flexDirection: 'column', gap: 6, padding: '10px 12px', 
                cursor: 'pointer', borderRadius: 8,
                background: isCur ? 'var(--bg-elevated)' : 'transparent',
                border: `1px solid ${isCur ? `color-mix(in srgb, ${cfg.c} 30%, transparent)` : 'var(--border)'}`,
                boxShadow: isCur ? `0 2px 12px color-mix(in srgb, ${cfg.c} 12%, transparent)` : 'none',
                opacity: isPast ? 0.8 : 1,
                transform: isCur ? 'translateY(-1px)' : 'none',
                transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 26, height: 26, borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  background: isCur ? `color-mix(in srgb, ${cfg.c} 15%, transparent)` : 'var(--bg-elevated)' }}>
                  <cfg.I size={13} style={{ color: isCur ? cfg.c : 'var(--text-muted)' }} />
                </div>
                
                <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
                    <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, color: isCur ? cfg.c : 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{cfg.label}</span>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 600 }}>
                      #{String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 12, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                      color: s.type === 'ACCEPT_EDGE' ? 'var(--accent-accept)' : 'var(--text-muted)' }}>
                      {s.type === 'ACCEPT_EDGE' ? `+${s.costDelta}${unit ? ' ' + unit : ''}` : `${s.mstCost}${unit ? ' ' + unit : ''}`}
                    </span>
                  </div>
                </div>
              </div>
              
              {(s.edgeId || s.nodeId) && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingLeft: 36, marginTop: 2 }}>
                  <div style={{ padding: '2px 6px', background: 'var(--bg-base)', borderRadius: 4, border: '1px solid var(--border)', display: 'inline-flex', alignItems: 'center' }}>
                    <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)' }}>
                      {s.edgeId ? s.edgeId.replace('e', 'Edge ') : `Node ${s.nodeId}`}
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
