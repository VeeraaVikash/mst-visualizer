import React, { useRef } from 'react';
import {
  MousePointer2, PlusCircle, Link2, Shuffle, Trash2, Save, FolderOpen,
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
    <div style={{ margin: '24px 0 10px 4px', fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
      {label}
    </div>
  );

  const ToolBtn = ({ icon: I, label, shortcut, active, danger, disabled, onClick }: any) => (
    <button onClick={onClick} disabled={disabled} title={shortcut ? `${label} [${shortcut}]` : label}
      style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 8, borderRadius: 8, padding: '8px 10px',
        fontSize: 12, width: '100%', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.4 : 1, transition: 'all 150ms',
        border: 'none',
        background: active ? (danger ? 'color-mix(in srgb, var(--accent-reject) 15%, transparent)' : 'var(--bg-elevated)') : 'transparent',
        color: active ? (danger ? 'var(--accent-reject)' : 'var(--text-primary)') : 'var(--text-secondary)' }}>
      <I size={14} style={{ flexShrink: 0 }} />
      <span style={{ fontWeight: active ? 600 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</span>
      {shortcut && <span style={{ position: 'absolute', right: 8, fontSize: 9, opacity: 0.4, fontFamily: "'JetBrains Mono', monospace" }}>{shortcut}</span>}
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
    <div style={{ width: 280, background: 'var(--bg-panel)', borderRight: '1px solid var(--border)', overflowY: 'auto', padding: '0 16px 24px', flexShrink: 0 }}>
      <div style={{ paddingTop: 16 }}>
        <SectionLabel label="Scenario" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 4, background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', borderRadius: 16, border: '1px solid var(--border)' }}>
          {Object.values(SCENARIOS).map(s => {
            const ScIcon = SCENARIO_ICONS[s.id] ?? Wifi;
            const isActive = scenario === s.id;
            return (
              <button key={s.id} onClick={() => props.onScenario(s.id)}
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, padding: '12px 4px', borderRadius: 12, cursor: 'pointer', transition: 'all 200ms',
                  border: isActive ? `1px solid color-mix(in srgb, ${s.color} 30%, transparent)` : '1px solid transparent',
                  background: isActive ? `color-mix(in srgb, ${s.color} 10%, var(--bg-panel))` : 'transparent',
                  color: isActive ? s.color : 'var(--text-secondary)',
                  boxShadow: isActive ? `0 4px 12px color-mix(in srgb, ${s.color} 10%, transparent)` : 'none' }}>
                <ScIcon size={18} />
                <span style={{ fontSize: 11, fontWeight: isActive ? 600 : 500 }}>{s.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
        {sc && <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.5, marginTop: 10, padding: '0 4px', textAlign: 'center' }}>{sc.tagline}</p>}

        <SectionLabel label="Canvas Tools" />
        <div style={{ background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', borderRadius: 16, border: '1px solid var(--border)', padding: 4, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <ToolBtn icon={MousePointer2} label="Select"    shortcut="Esc" active={canvasMode === 'select' && !deleteMode} onClick={() => props.onToggleMode('select')} />
            <ToolBtn icon={PlusCircle}   label="Add Node"   shortcut="N" active={canvasMode === 'addNode' && !deleteMode}    onClick={() => props.onToggleMode('addNode')} />
            <ToolBtn icon={Link2}        label="Connect"    shortcut="E" active={canvasMode === 'connectEdge' && !deleteMode} onClick={() => props.onToggleMode('connectEdge')} />
            <ToolBtn icon={Eraser}       label="Delete"     shortcut="D" active={deleteMode} danger onClick={props.onDeleteMode} />
            <ToolBtn icon={Shuffle}      label="Random"     shortcut="G" onClick={() => props.onRandom(nodeCount)} />
            <ToolBtn icon={Trash2}       label="Clear All"               onClick={props.onResetGraph} />
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 8px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <ToolBtn icon={Save}         label="Save JSON"               onClick={props.onSave} />
            <ToolBtn icon={FolderOpen}   label="Load JSON"               onClick={() => fileRef.current?.click()} />
          </div>
          <div style={{ height: 1, background: 'var(--border)', margin: '4px 8px' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 12px' }}>
            <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>Rand nodes:</span>
            <div style={{ display: 'flex', gap: 4 }}>
              {[5, 7, 10, 15].map(n => (
                <button key={n} onClick={() => props.onNodeCount(n)}
                  style={{ padding: '2px 6px', borderRadius: 4, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer',
                    border: 'none', transition: 'all 150ms',
                    background: nodeCount === n ? 'var(--text-primary)' : 'var(--bg-elevated)',
                    color: nodeCount === n ? 'var(--bg-base)' : 'var(--text-secondary)' }}>{n}</button>
              ))}
            </div>
          </div>
        </div>
        <input ref={fileRef} type="file" accept=".json" style={{ display: 'none' }} onChange={handleLoad} />
        
        <SectionLabel label="Algorithm" />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, padding: 4, background: 'color-mix(in srgb, var(--bg-elevated) 40%, transparent)', borderRadius: 14, border: '1px solid var(--border)', marginBottom: 16 }}>
          <button onClick={() => props.onSetAlgo('kruskal')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, cursor: 'pointer', transition: 'all 150ms', fontWeight: algoType === 'kruskal' ? 600 : 500, fontSize: 12,
              border: 'none',
              background: algoType === 'kruskal' ? 'var(--bg-panel)' : 'transparent',
              color: algoType === 'kruskal' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: algoType === 'kruskal' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }}>
            <Network size={14} style={{ color: algoType === 'kruskal' ? 'var(--accent-accept)' : 'inherit' }} /> Kruskal's
          </button>
          <button onClick={() => props.onSetAlgo('prim')}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, padding: '10px', borderRadius: 10, cursor: 'pointer', transition: 'all 150ms', fontWeight: algoType === 'prim' ? 600 : 500, fontSize: 12,
              border: 'none',
              background: algoType === 'prim' ? 'var(--bg-panel)' : 'transparent',
              color: algoType === 'prim' ? 'var(--text-primary)' : 'var(--text-secondary)',
              boxShadow: algoType === 'prim' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none' }}>
            <Waypoints size={14} style={{ color: algoType === 'prim' ? 'var(--accent-candidate)' : 'inherit' }} /> Prim's
          </button>
        </div>

        {algoType === 'prim' && graph.nodes.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, padding: '0 4px' }}>
            <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Start Node</span>
            <select value={startNode} onChange={e => props.onSetStart(e.target.value)}
              style={{ flex: 1, borderRadius: 8, padding: '6px 10px', fontSize: 12, fontWeight: 500, background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }}>
              {graph.nodes.map(n => <option key={n.id} value={n.id}>{n.id}</option>)}
            </select>
          </div>
        )}

        {/* Primary Run Button */}
        <button onClick={props.onRun} disabled={!isRunnable}
          style={{ width: '100%', padding: '14px 0', borderRadius: 12, border: 'none', fontWeight: 600, fontSize: 14,
            cursor: isRunnable ? 'pointer' : 'not-allowed', transition: 'all 200ms',
            background: isRunnable ? 'var(--text-primary)' : 'var(--bg-elevated)',
            color: isRunnable ? 'var(--bg-base)' : 'var(--text-muted)',
            boxShadow: isRunnable ? '0 8px 20px rgba(0,0,0,0.15)' : 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            <PlayCircle size={16} />
            Run {algoType === 'kruskal' ? "Kruskal's" : "Prim's"}
          </div>
          {notRunnableReason && <div style={{ fontSize: 11, opacity: 0.6, marginTop: 4, fontWeight: 400 }}>{notRunnableReason}</div>}
        </button>

        <SectionLabel label="Playback" />
        {steps.length > 0 && (
          <div style={{ marginBottom: 16, padding: '0 4px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
                {stepIdx >= 0 ? stepIdx + 1 : 0} / {steps.length}
              </span>
              <span style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600,
                color: steps[stepIdx]?.type === 'COMPLETE' ? 'var(--accent-accept)' : 'var(--accent-active)' }}>
                {steps[stepIdx]?.type?.replace(/_/g, ' ') ?? 'READY'}
              </span>
            </div>
            <div style={{ height: 4, borderRadius: 2, background: 'var(--bg-elevated)', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 2, transition: 'width 300ms ease-out', width: `${progress}%`,
                background: steps[stepIdx]?.type === 'COMPLETE' ? 'var(--accent-accept)' : 'var(--accent-active)' }} />
            </div>
          </div>
        )}
        
        {/* Unified Playback Bar */}
        <div style={{ display: 'flex', alignItems: 'center', background: 'var(--bg-elevated)', borderRadius: 12, padding: 4, border: '1px solid var(--border)', marginBottom: 16 }}>
          <button onClick={props.onStepBack}   style={{ ...btn, border: 'none', background: 'transparent', flex: 1, padding: 8 }} title="Step back [←]"><SkipBack size={16} /></button>
          <button onClick={props.onTogglePlay}
            style={{ padding: '8px', borderRadius: 8, border: 'none', background: 'var(--text-primary)', color: 'var(--bg-base)', cursor: 'pointer', flex: 1, display: 'flex', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
            {isPlaying ? <Pause size={16} /> : <Play size={16} style={{ marginLeft: 2 }} />}
          </button>
          <button onClick={props.onStepFwd}    style={{ ...btn, border: 'none', background: 'transparent', flex: 1, padding: 8 }} title="Step fwd [→]"><SkipForward size={16} /></button>
          <div style={{ width: 1, height: 20, background: 'var(--border)', margin: '0 4px' }} />
          <button onClick={props.onResetAnimation} style={{ ...btn, border: 'none', background: 'transparent', flex: 1, padding: 8 }} title="Reset [R]"><RotateCcw size={16} /></button>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 8px' }}>
          <Gauge size={14} style={{ color: 'var(--text-muted)' }} />
          <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)' }}>Slow</span>
          <input type="range" min={1} max={100} value={speed} onChange={e => props.onSpeedChange(Number(e.target.value))} style={{ flex: 1, accentColor: 'var(--text-primary)' }} />
          <span style={{ fontSize: 10, fontWeight: 500, color: 'var(--text-muted)' }}>Fast</span>
        </div>
      </div>
    </div>
  );
}
