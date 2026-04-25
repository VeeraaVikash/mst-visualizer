import React, { useRef } from 'react';
import {
  MousePointer2, Link2, Shuffle, Trash2, Save, FolderOpen,
  Network, Waypoints, Play, Pause, SkipBack, SkipForward,
  RotateCcw, Gauge, Eraser, PlayCircle, Wifi, Bolt, MapPin, Server,
} from 'lucide-react';
import type { Graph, CanvasMode, AlgorithmType } from '../../types';
import { isGraphConnected } from '../../utils/graphUtils';
import { SCENARIOS } from '../../data/scenarios';

interface Props {
  graph: Graph; canvasMode: CanvasMode; deleteMode: boolean;
  algoType: AlgorithmType; startNode: string; isPlaying: boolean;
  speed: number; scenario: string; steps: any[]; stepIdx: number;
  nodeCount: number;
  onToggleMode: (m: CanvasMode) => void; onDeleteMode: () => void;
  onRandom: (n: number) => void; onResetGraph: () => void;
  onSave: () => void; onLoad: (g: Graph) => void;
  onSetAlgo: (t: AlgorithmType) => void; onSetStart: (id: string) => void;
  onRun: () => void; onTogglePlay: () => void;
  onStepFwd: () => void; onStepBack: () => void;
  onResetAnimation: () => void; onSpeedChange: (v: number) => void;
  onScenario: (id: string) => void; onNodeCount: (n: number) => void;
  addToast: (msg: string, t: any) => void;
}

const SCENARIO_ICONS: Record<string, React.ElementType> = { telecom: Wifi, power: Bolt, roads: MapPin, datacenter: Server };

const btn: React.CSSProperties = {
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg-elevated)',
  color: 'var(--text-secondary)', cursor: 'pointer', transition: 'all 150ms',
};

export default function ControlPanel(props: Props) {
  const { graph, canvasMode, deleteMode, algoType, startNode, isPlaying, speed, scenario, steps, stepIdx, nodeCount } = props;
  const fileRef = useRef<HTMLInputElement>(null);
  const sc = SCENARIOS[scenario];
  const isRunnable = graph.nodes.length >= 2 && graph.edges.length >= 1 && isGraphConnected(graph);
  const progress = steps.length > 0 ? ((stepIdx + 1) / steps.length) * 100 : 0;

  const SectionLabel = ({ label }: { label: string }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '13px 0 7px' }}>
      <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)' }}>{label}</span>
      <div style={{ height: '1px', flex: 1, background: 'var(--border)' }} />
    </div>
  );

  const ToolBtn = ({ icon: I, label, shortcut, active, danger, disabled, onClick }: any) => (
    <button onClick={onClick} disabled={disabled} title={shortcut ? `${label} [${shortcut}]` : label}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, padding: '6px 8px',
        fontSize: 11, fontFamily: "'JetBrains Mono', monospace", width: '100%', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.5 : 1, transition: 'all 150ms',
        border: `1px solid ${danger && active ? 'var(--accent-reject)' : active ? 'var(--accent-active)' : 'var(--border)'}`,
        background: danger && active ? 'color-mix(in srgb, var(--accent-reject) 14%, transparent)' : active ? 'color-mix(in srgb, var(--accent-active) 14%, transparent)' : 'var(--bg-elevated)',
        color: danger && active ? 'var(--accent-reject)' : active ? 'var(--accent-active)' : disabled ? 'var(--text-muted)' : 'var(--text-secondary)' }}>
      <I size={12} />{label}
      {shortcut && <span style={{ position: 'absolute', bottom: 2, right: 4, fontSize: 8, opacity: 0.3, fontFamily: "'JetBrains Mono', monospace" }}>{shortcut}</span>}
    </button>
  );

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const d = JSON.parse(ev.target?.result as string);
        if (!d.nodes || !d.edges) throw new Error();
        props.onLoad({ nodes: d.nodes, edges: d.edges });
        props.addToast('Graph loaded', 'success');
      } catch { props.addToast('Invalid graph file', 'error'); }
    };
    reader.readAsText(f); e.target.value = '';
  };

  const notRunnableReason = !graph.nodes.length ? 'Add nodes' : graph.nodes.length < 2 ? 'Need 2+ nodes' : !graph.edges.length ? 'Add edges' : !isGraphConnected(graph) ? 'Graph disconnected' : '';

  return (
    <div style={{ width: 258, background: 'var(--bg-panel)', borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '8px 10px 20px', flexShrink: 0 }}>

      <SectionLabel label="Scenario" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: 5 }}>
        {Object.values(SCENARIOS).map(s => {
          const ScIcon = SCENARIO_ICONS[s.id] ?? Wifi;
          return (
            <button key={s.id} onClick={() => props.onScenario(s.id)}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, padding: '7px 4px', borderRadius: 8, cursor: 'pointer', transition: 'all 150ms',
                border: `1px solid ${scenario === s.id ? s.color : 'var(--border)'}`,
                background: scenario === s.id ? `color-mix(in srgb, ${s.color} 12%, transparent)` : 'var(--bg-elevated)',
                color: scenario === s.id ? s.color : 'var(--text-muted)' }}>
              <ScIcon size={14} />
              <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>{s.label.split(' ')[0]}</span>
            </button>
          );
        })}
      </div>
      {sc && <p style={{ fontSize: 10, color: 'var(--text-muted)', lineHeight: 1.4, marginBottom: 4, padding: '0 2px' }}>{sc.tagline}</p>}

      <SectionLabel label="Canvas" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4 }}>
        <ToolBtn icon={MousePointer2} label="Add Node"  shortcut="N" active={canvasMode === 'addNode' && !deleteMode}    onClick={() => props.onToggleMode('addNode')} />
        <ToolBtn icon={Link2}        label="Connect"    shortcut="E" active={canvasMode === 'connectEdge' && !deleteMode} onClick={() => props.onToggleMode('connectEdge')} />
        <ToolBtn icon={Eraser}       label="Delete"     shortcut="D" active={deleteMode} danger onClick={props.onDeleteMode} />
        <ToolBtn icon={Shuffle}      label="Random"     shortcut="G" onClick={() => props.onRandom(nodeCount)} />
        <ToolBtn icon={Trash2}       label="Clear All"               onClick={props.onResetGraph} />
        <ToolBtn icon={Save}         label="Save JSON"               onClick={props.onSave} />
        <ToolBtn icon={FolderOpen}   label="Load JSON"               onClick={() => fileRef.current?.click()} />
      </div>
      <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleLoad} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
        <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>Rand size:</span>
        {[5, 7, 10, 15].map(n => (
          <button key={n} onClick={() => props.onNodeCount(n)}
            style={{ padding: '2px 7px', borderRadius: 5, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer',
              border: `1px solid ${nodeCount === n ? 'var(--accent-active)' : 'var(--border)'}`,
              background: nodeCount === n ? 'var(--accent-active)' : 'var(--bg-elevated)',
              color: nodeCount === n ? '#000' : 'var(--text-secondary)' }}>{n}</button>
        ))}
      </div>

      <SectionLabel label="Algorithm" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 8 }}>
        <button onClick={() => props.onSetAlgo('kruskal')}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 10px', borderRadius: 9, cursor: 'pointer', transition: 'all 150ms', fontWeight: 600, fontSize: 12,
            border: `1px solid ${algoType === 'kruskal' ? 'var(--accent-accept)' : 'var(--border)'}`,
            background: algoType === 'kruskal' ? 'color-mix(in srgb, var(--accent-accept) 14%, transparent)' : 'var(--bg-elevated)',
            color: algoType === 'kruskal' ? 'var(--accent-accept)' : 'var(--text-secondary)' }}>
          <Network size={14} /> Kruskal's
          <span style={{ marginLeft: 'auto', fontSize: 8, opacity: 0.4, fontFamily: "'JetBrains Mono', monospace" }}>K</span>
        </button>
        <button onClick={() => props.onSetAlgo('prim')}
          style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '8px 10px', borderRadius: 9, cursor: 'pointer', transition: 'all 150ms', fontWeight: 600, fontSize: 12,
            border: `1px solid ${algoType === 'prim' ? 'var(--accent-candidate)' : 'var(--border)'}`,
            background: algoType === 'prim' ? 'color-mix(in srgb, var(--accent-candidate) 14%, transparent)' : 'var(--bg-elevated)',
            color: algoType === 'prim' ? 'var(--accent-candidate)' : 'var(--text-secondary)' }}>
          <Waypoints size={14} /> Prim's
          <span style={{ marginLeft: 'auto', fontSize: 8, opacity: 0.4, fontFamily: "'JetBrains Mono', monospace" }}>P</span>
        </button>
      </div>

      {algoType === 'prim' && graph.nodes.length > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Start:</span>
          <select value={startNode} onChange={e => props.onSetStart(e.target.value)}
            style={{ flex: 1, borderRadius: 6, padding: '4px 6px', fontSize: 11, background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--accent-candidate)', outline: 'none' }}>
            {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
          </select>
        </div>
      )}

      {/* THE RUN BUTTON — fixed */}
      <button onClick={props.onRun} disabled={!isRunnable}
        style={{ width: '100%', padding: '11px 0', borderRadius: 10, border: 'none', fontWeight: 700, fontSize: 13,
          cursor: isRunnable ? 'pointer' : 'not-allowed', transition: 'all 200ms', marginBottom: 2,
          background: isRunnable ? (algoType === 'kruskal' ? 'var(--accent-accept)' : 'var(--accent-candidate)') : 'var(--bg-elevated)',
          color: isRunnable ? '#fff' : 'var(--text-muted)',
          boxShadow: isRunnable ? `0 0 20px color-mix(in srgb, ${algoType === 'kruskal' ? 'var(--accent-accept)' : 'var(--accent-candidate)'} 30%, transparent)` : 'none' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7 }}>
          <PlayCircle size={16} />
          Run {algoType === 'kruskal' ? "Kruskal's" : "Prim's"}
        </div>
        {notRunnableReason && <div style={{ fontSize: 10, opacity: 0.6, marginTop: 2, fontWeight: 400 }}>{notRunnableReason}</div>}
      </button>

      <SectionLabel label="Playback" />
      {steps.length > 0 && (
        <div style={{ marginBottom: 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
              {stepIdx >= 0 ? stepIdx + 1 : 0} / {steps.length}
            </span>
            <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace",
              color: steps[stepIdx]?.type === 'COMPLETE' ? 'var(--accent-accept)' : 'var(--text-muted)' }}>
              {steps[stepIdx]?.type?.replace(/_/g, ' ') ?? 'READY'}
            </span>
          </div>
          <div style={{ height: 5, borderRadius: 3, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: 3, transition: 'width 300ms', width: `${progress}%`,
              background: steps[stepIdx]?.type === 'COMPLETE' ? 'var(--accent-accept)' : 'var(--accent-active)' }} />
          </div>
        </div>
      )}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, marginBottom: 7 }}>
        <button onClick={props.onStepBack}   style={{ ...btn, padding: 7 }} title="Step back [←]"><SkipBack size={14} /></button>
        <button onClick={props.onTogglePlay}
          style={{ padding: 10, borderRadius: 9, border: 'none', background: 'var(--accent-active)', color: '#000', cursor: 'pointer' }}>
          {isPlaying ? <Pause size={17} /> : <Play size={17} />}
        </button>
        <button onClick={props.onStepFwd}    style={{ ...btn, padding: 7 }} title="Step fwd [→]"><SkipForward size={14} /></button>
        <button onClick={props.onResetAnimation} style={{ ...btn, padding: 7 }} title="Reset [R]"><RotateCcw size={14} /></button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
        <Gauge size={11} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>Slow</span>
        <input type="range" min={1} max={100} value={speed} onChange={e => props.onSpeedChange(Number(e.target.value))} style={{ flex: 1 }} />
        <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>Fast</span>
      </div>
    </div>
  );
}
