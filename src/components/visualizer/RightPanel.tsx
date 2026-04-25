import React from 'react';
import { BarChart2, History, Activity, TrendingUp, CheckCircle, XCircle, Circle, Search, ArrowRight, ArrowLeftRight, DollarSign, GitMerge, Network } from 'lucide-react';
import type { AlgorithmStep, Graph } from '../../types';
import { SCENARIOS } from '../../data/scenarios';
import HistoryPanel from './HistoryPanel';
import RacePanel from './RacePanel';
import StatsPanel from './StatsPanel';

interface Props {
  activeTab: string; onTabChange: (t: string) => void;
  graph: Graph; steps: AlgorithmStep[]; currentIdx: number;
  algoType: string; scenario: string; currentStep: AlgorithmStep | null;
  kSteps: AlgorithmStep[]; pSteps: AlgorithmStep[];
  raceIdx: number; racePlaying: boolean;
  onRaceToggle: () => void; onRaceReset: () => void;
  onRaceStepFwd: () => void; onRaceStepBack: () => void;
  speed: number; onSpeedChange: (v: number) => void;
  onJumpHistory: (i: number) => void;
}

const TABS = [
  { id: 'info',    label: 'Info',    I: BarChart2  },
  { id: 'history', label: 'History', I: History    },
  { id: 'race',    label: 'Race',    I: Activity   },
  { id: 'stats',   label: 'Stats',   I: TrendingUp },
];

function InfoPanel({ graph, steps, currentIdx, algoType, currentStep, scenario }: Pick<Props, 'graph'|'steps'|'currentIdx'|'algoType'|'currentStep'|'scenario'>) {
  const sc = SCENARIOS[scenario];
  const unit = sc?.unit ?? '';
  const step = currentStep;
  const edge = step?.edgeId ? graph.edges.find(e => e.id === step.edgeId) : null;
  const n = graph.nodes.length;
  const progress = steps.length > 0 ? ((currentIdx + 1) / steps.length) * 100 : 0;

  return (
    <div style={{ padding: '10px 10px', overflowY: 'auto', height: '100%' }}>
      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Algorithm Progress</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)' }}>{currentIdx >= 0 ? currentIdx + 1 : 0} / {steps.length}</span>
        <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: step?.type === 'COMPLETE' ? 'var(--accent-accept)' : 'var(--text-muted)' }}>
          {step?.type?.replace(/_/g, ' ') ?? '—'}
        </span>
      </div>
      <div style={{ height: 5, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden', marginBottom: 12 }}>
        <div style={{ height: '100%', borderRadius: 3, transition: 'width 300ms', width: `${progress}%`,
          background: step?.type === 'COMPLETE' ? 'var(--accent-accept)' : 'var(--accent-active)' }} />
      </div>

      {edge && (
        <div style={{ padding: 10, borderRadius: 9, background: 'var(--bg-elevated)', border: '1px solid var(--border)', marginBottom: 10 }}>
          <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 6 }}>Current Edge</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 5 }}>
            <ArrowLeftRight size={13} style={{ color: 'var(--accent-active)' }} />
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{edge.source} ↔ {edge.target}</span>
            <span style={{ marginLeft: 'auto', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-secondary)' }}>{edge.weight}{unit && ` ${unit}`}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            {step?.type === 'ACCEPT_EDGE'
              ? <><CheckCircle size={13} style={{ color: 'var(--accent-accept)' }} /><span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-accept)' }}>ACCEPTED +{edge.weight}{unit && ` ${unit}`}</span></>
              : step?.type === 'REJECT_EDGE'
              ? <><XCircle size={13} style={{ color: 'var(--accent-reject)' }} /><span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-reject)' }}>REJECTED (cycle)</span></>
              : <><ArrowRight size={13} style={{ color: 'var(--accent-active)' }} /><span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--accent-active)' }}>EVALUATING</span></>}
          </div>
        </div>
      )}

      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Network Progress</div>
      {[
        { I: DollarSign,  label: `Cost${unit ? ` (${unit})` : ''}`, val: `${step?.mstCost ?? 0}` },
        { I: GitMerge,    label: 'Links added',   val: `${step?.edgesSelected ?? 0} / ${Math.max(n - 1, 0)}` },
        { I: Network,     label: 'Nodes in MST',  val: `${step?.activeNodes?.length ?? 0} / ${n}` },
      ].map(({ I, label, val }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 6 }}>
          <I size={13} style={{ color: 'var(--accent-accept)' }} />
          <span style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)' }}>{label}:</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, marginLeft: 'auto', fontWeight: 600, color: 'var(--text-primary)' }}>{val}</span>
        </div>
      ))}

      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', margin: '10px 0 6px' }}>All Edges (sorted)</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: 170, overflowY: 'auto' }}>
        {[...graph.edges].sort((a, b) => a.weight - b.weight).map(e => {
          const isMst = step?.mstEdges?.includes(e.id);
          const isRej = step?.rejectedEdges?.includes(e.id);
          const isCur = step?.highlightedEdges?.includes(e.id);
          const isCand = step?.candidateEdges?.includes(e.id);
          let Ic: React.ElementType = Circle, col = 'var(--text-muted)';
          if (isMst) { Ic = CheckCircle; col = 'var(--accent-accept)'; }
          else if (isRej) { Ic = XCircle; col = 'var(--accent-reject)'; }
          else if (isCur) { Ic = ArrowRight; col = 'var(--accent-active)'; }
          else if (isCand) { Ic = Search; col = 'var(--accent-candidate)'; }
          return (
            <div key={e.id} style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 4, padding: '2px 5px',
              background: isCur ? 'var(--bg-elevated)' : 'transparent',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: col }}>
              <Ic size={10} style={{ color: col, flexShrink: 0 }} />
              <span>{e.source}-{e.target}</span>
              <span style={{ marginLeft: 'auto' }}>{e.weight}{unit && ` ${unit}`}</span>
            </div>
          );
        })}
        {!graph.edges.length && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>No edges yet</span>}
      </div>
    </div>
  );
}

export default function RightPanel(props: Props) {
  const { activeTab, onTabChange, kSteps, pSteps } = props;
  const hasRaceData = kSteps.length > 0 && pSteps.length > 0;

  return (
    <div style={{ width: 270, background: 'var(--bg-panel)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', flexShrink: 0 }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => onTabChange(t.id)}
            style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2, padding: '7px 2px',
              border: 'none', borderBottom: `2px solid ${activeTab === t.id ? 'var(--accent-active)' : 'transparent'}`,
              background: 'transparent', color: activeTab === t.id ? 'var(--accent-active)' : 'var(--text-muted)',
              cursor: 'pointer', fontSize: 9, fontFamily: "'JetBrains Mono', monospace", transition: 'all 150ms', position: 'relative' }}>
            <t.I size={13} />
            <span>{t.label}</span>
            {t.id === 'race' && hasRaceData && (
              <div style={{ position: 'absolute', top: 5, right: 8, width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-accept)' }} />
            )}
          </button>
        ))}
      </div>
      <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {activeTab === 'info'    && <InfoPanel {...props} />}
        {activeTab === 'history' && <HistoryPanel steps={props.steps} currentIdx={props.currentIdx} onJump={props.onJumpHistory} algoType={props.algoType} scenario={props.scenario} />}
        {activeTab === 'race'    && <RacePanel graph={props.graph} kSteps={props.kSteps} pSteps={props.pSteps} raceIdx={props.raceIdx} racePlaying={props.racePlaying} onTogglePlay={props.onRaceToggle} onReset={props.onRaceReset} onStepFwd={props.onRaceStepFwd} onStepBack={props.onRaceStepBack} speed={props.speed} onSpeedChange={props.onSpeedChange} scenario={props.scenario} />}
        {activeTab === 'stats'   && <StatsPanel graph={props.graph} steps={props.steps} currentIdx={props.currentIdx} algoType={props.algoType} scenario={props.scenario} />}
      </div>
    </div>
  );
}
