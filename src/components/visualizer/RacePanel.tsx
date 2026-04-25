import React, { useMemo } from 'react';
import { Play, Pause, RotateCcw, SkipBack, SkipForward, Trophy, Activity, Gauge } from 'lucide-react';
import { motion } from 'framer-motion';
import type { AlgorithmStep, Graph } from '../../types';
import { SCENARIOS } from '../../data/scenarios';
import MiniCanvas from './MiniCanvas';

interface Props {
  graph: Graph; kSteps: AlgorithmStep[]; pSteps: AlgorithmStep[];
  raceIdx: number; racePlaying: boolean;
  onTogglePlay: () => void; onReset: () => void;
  onStepFwd: () => void; onStepBack: () => void;
  speed: number; onSpeedChange: (v: number) => void; scenario: string;
}

const btnBase: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 7,
  border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', cursor: 'pointer',
};

export default function RacePanel({ graph, kSteps, pSteps, raceIdx, racePlaying, onTogglePlay, onReset, onStepFwd, onStepBack, speed, onSpeedChange, scenario }: Props) {
  const sc = SCENARIOS[scenario];
  const unit = sc?.unit ?? '';

  const kStep = raceIdx >= 0 && raceIdx < kSteps.length ? kSteps[raceIdx] : null;
  const pStep = raceIdx >= 0 && raceIdx < pSteps.length ? pSteps[raceIdx] : (pSteps.length > 0 ? pSteps[pSteps.length - 1] : null);
  const kDone = kStep?.type === 'COMPLETE' || (raceIdx >= kSteps.length - 1 && kSteps.length > 0);
  const pDone = pStep?.type === 'COMPLETE' || (raceIdx >= pSteps.length - 1 && pSteps.length > 0);
  const finalK = kSteps[kSteps.length - 1]?.mstCost ?? 0;
  const finalP = pSteps[pSteps.length - 1]?.mstCost ?? 0;
  const maxCost = Math.max(finalK, finalP, 1);
  const kEdges = kSteps.filter(s => s.type === 'ACCEPT_EDGE').length;
  const pEdges = pSteps.filter(s => s.type === 'ACCEPT_EDGE').length;

  const costHistory = useMemo(() => {
    if (!kSteps.length || !pSteps.length) return [];
    const len = Math.max(kSteps.length, pSteps.length);
    return Array.from({ length: len }, (_, i) => ({
      k: i < kSteps.length ? kSteps[i].mstCost : finalK,
      p: i < pSteps.length ? pSteps[i].mstCost : finalP,
    }));
  }, [kSteps, pSteps, finalK, finalP]);

  if (!kSteps.length || !pSteps.length) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 20, textAlign: 'center' }}>
        <Activity size={32} style={{ color: 'var(--text-muted)', opacity: 0.5 }} />
        <p style={{ fontSize: 13, color: 'var(--text-muted)', maxWidth: 200 }}>
          Build a connected graph and click <strong style={{ color: 'var(--accent-active)' }}>Race</strong> in the header to compare both algorithms live.
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Mini graphs */}
      <div style={{ display: 'flex', height: 155, borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ flex: 1, borderRight: '1px solid var(--border)' }}>
          <MiniCanvas graph={graph} step={kStep} isComplete={kDone} label="Kruskal's" color="var(--accent-accept)" />
        </div>
        <div style={{ flex: 1 }}>
          <MiniCanvas graph={graph} step={pStep} isComplete={pDone} label="Prim's" color="var(--accent-candidate)" />
        </div>
      </div>

      {/* Cost bars */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 8 }}>Live Cost Race</div>
        {[
          { label: "Kruskal's", cost: kStep?.mstCost ?? 0, final: finalK, done: kDone, color: 'var(--accent-accept)' },
          { label: "Prim's", cost: pStep?.mstCost ?? 0, final: finalP, done: pDone, color: 'var(--accent-candidate)' },
        ].map(({ label, cost, final, done, color }) => (
          <div key={label} style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color }}>{label}</span>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-primary)' }}>
                {cost}{unit && ` ${unit}`} {done && '✓'}
              </span>
            </div>
            <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
              <motion.div animate={{ width: `${Math.min(100, (cost / maxCost) * 100)}%` }} transition={{ duration: 0.3 }}
                style={{ height: '100%', borderRadius: 3, background: color, boxShadow: done ? `0 0 8px ${color}` : 'none' }} />
            </div>
          </div>
        ))}
      </div>

      {/* Stats comparison */}
      <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'grid', gap: 4 }}>
          {[
            { label: `Final cost${unit ? ` (${unit})` : ''}`, k: finalK, p: finalP },
            { label: 'Total steps', k: kSteps.length, p: pSteps.length },
            { label: 'Edges added', k: kEdges, p: pEdges },
          ].map(({ label, k, p }) => (
            <div key={label} style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', gap: 4, padding: '3px 0', borderBottom: '1px solid var(--border)' }}>
              <div style={{ textAlign: 'right', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: k <= p ? 'var(--accent-accept)' : 'var(--text-primary)', fontWeight: k < p ? 700 : 400 }}>{k}</div>
              <div style={{ textAlign: 'center', fontSize: 9, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>{label}</div>
              <div style={{ textAlign: 'left', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: p <= k ? 'var(--accent-candidate)' : 'var(--text-primary)', fontWeight: p < k ? 700 : 400 }}>{p}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Winner badge */}
      {kDone && pDone && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          style={{ margin: '8px 12px', padding: '8px 12px', borderRadius: 10, background: 'var(--bg-elevated)', border: '1px solid var(--border)', textAlign: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
            <Trophy size={13} style={{ color: 'var(--accent-active)' }} />
            <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-active)', fontWeight: 700 }}>
              {kSteps.length < pSteps.length ? "Kruskal's used fewer steps!" : pSteps.length < kSteps.length ? "Prim's used fewer steps!" : 'Same number of steps!'}
            </span>
          </div>
          <p style={{ fontSize: 10, color: 'var(--text-muted)' }}>Both always find the same optimal MST cost: {finalK}{unit && ` ${unit}`}</p>
        </motion.div>
      )}

      {/* Playback */}
      <div style={{ padding: '8px 12px', marginTop: 'auto', borderTop: '1px solid var(--border)', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 7 }}>
          <button onClick={onStepBack} style={{ ...btnBase, padding: 6 }}><SkipBack size={13} /></button>
          <button onClick={onTogglePlay} style={{ padding: '7px 16px', borderRadius: 9, border: 'none', background: 'var(--accent-active)', color: '#000', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5, fontWeight: 700, fontSize: 12 }}>
            {racePlaying ? <Pause size={14} /> : <Play size={14} />}{racePlaying ? 'Pause' : 'Play'}
          </button>
          <button onClick={onStepFwd} style={{ ...btnBase, padding: 6 }}><SkipForward size={13} /></button>
          <button onClick={onReset} style={{ ...btnBase, padding: 6 }} title="Reset race"><RotateCcw size={13} /></button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Gauge size={11} style={{ color: 'var(--text-muted)' }} />
          <input type="range" min={1} max={100} value={speed} onChange={e => onSpeedChange(Number(e.target.value))} style={{ flex: 1 }} />
          <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', flexShrink: 0 }}>
            {Math.max(raceIdx + 1, 0)}/{Math.max(kSteps.length, pSteps.length)}
          </span>
        </div>
      </div>
    </div>
  );
}
