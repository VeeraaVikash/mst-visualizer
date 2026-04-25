import React, { useState, useRef } from 'react';
import {
  MousePointer2, Link2, Shuffle, Trash2, Save, FolderOpen,
  Network, Waypoints, Play, Pause, SkipBack, SkipForward,
  RotateCcw, Gauge,
} from 'lucide-react';
import type { Graph, AlgorithmType, CanvasMode, SavedGraph } from '../../types';

interface LeftPanelProps {
  graph: Graph;
  canvasMode: CanvasMode;
  algorithmType: AlgorithmType;
  startNode: string;
  isPlaying: boolean;
  speed: number;
  onToggleMode: (mode: CanvasMode) => void;
  onRandomGraph: (count: number) => void;
  onResetGraph: () => void;
  onSaveGraph: () => void;
  onLoadGraph: (graph: Graph) => void;
  onSetAlgorithm: (type: AlgorithmType) => void;
  onSetStartNode: (node: string) => void;
  onPlay: () => void;
  onPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onSetSpeed: (speed: number) => void;
  onInitAlgorithm: () => void;
  addToast: (msg: string, icon: 'error' | 'warning' | 'info' | 'success') => void;
}

const LeftPanel: React.FC<LeftPanelProps> = ({
  graph,
  canvasMode,
  algorithmType,
  startNode,
  isPlaying,
  speed,
  onToggleMode,
  onRandomGraph,
  onResetGraph,
  onSaveGraph,
  onLoadGraph,
  onSetAlgorithm,
  onSetStartNode,
  onPlay,
  onPause,
  onStepBack,
  onStepForward,
  onReset,
  onSetSpeed,
  onInitAlgorithm,
  addToast,
}) => {
  const [nodeCount, setNodeCount] = useState(7);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLoad = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target?.result as string) as SavedGraph;
        if (!data.nodes || !data.edges || !Array.isArray(data.nodes) || !Array.isArray(data.edges)) {
          throw new Error('Invalid');
        }
        onLoadGraph({ nodes: data.nodes, edges: data.edges });
        addToast('Graph loaded successfully', 'success');
      } catch {
        addToast('Invalid graph file format', 'error');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
    <div className="flex items-center gap-2 mb-3 mt-5">
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
    </div>
  );

  const ToolButton: React.FC<{
    icon: React.ReactNode;
    label: string;
    shortcut?: string;
    active?: boolean;
    onClick: () => void;
  }> = ({ icon, label, shortcut, active, onClick }) => (
    <button
      onClick={onClick}
      className="relative flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-mono transition-all w-full"
      style={{
        background: active ? 'var(--accent-active)' : 'var(--bg-elevated)',
        color: active ? '#000' : 'var(--text-secondary)',
        border: `1px solid ${active ? 'var(--accent-active)' : 'var(--border)'}`,
      }}
    >
      {icon}
      {label}
      {shortcut && (
        <span
          className="absolute bottom-1 right-1 text-[10px] font-mono opacity-40"
          style={{ color: active ? '#000' : 'var(--text-muted)' }}
        >
          {shortcut}
        </span>
      )}
    </button>
  );

  return (
    <div
      className="h-full overflow-y-auto px-3 py-2 flex flex-col shrink-0"
      style={{
        width: 280,
        background: 'var(--bg-panel)',
        borderRight: '1px solid var(--border)',
      }}
    >
      <SectionLabel label="Canvas" />
      <div className="grid grid-cols-2 gap-2">
        <ToolButton
          icon={<MousePointer2 size={14} />}
          label="Add Node"
          shortcut="N"
          active={canvasMode === 'addNode'}
          onClick={() => onToggleMode('addNode')}
        />
        <ToolButton
          icon={<Link2 size={14} />}
          label="Connect"
          shortcut="E"
          active={canvasMode === 'connectEdge'}
          onClick={() => onToggleMode('connectEdge')}
        />
        <ToolButton
          icon={<Shuffle size={14} />}
          label="Random"
          shortcut="G"
          onClick={() => onRandomGraph(nodeCount)}
        />
        <ToolButton
          icon={<Trash2 size={14} />}
          label="Reset"
          onClick={onResetGraph}
        />
        <ToolButton
          icon={<Save size={14} />}
          label="Save"
          onClick={onSaveGraph}
        />
        <ToolButton
          icon={<FolderOpen size={14} />}
          label="Load"
          onClick={() => fileInputRef.current?.click()}
        />
      </div>
      <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleLoad} />

      {/* Node count for random */}
      <div className="flex items-center gap-2 mt-3">
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Nodes:</span>
        {[5, 7, 10].map(n => (
          <button
            key={n}
            onClick={() => setNodeCount(n)}
            className="px-2 py-0.5 rounded text-xs font-mono transition-all"
            style={{
              background: nodeCount === n ? 'var(--accent-active)' : 'var(--bg-elevated)',
              color: nodeCount === n ? '#000' : 'var(--text-secondary)',
              border: `1px solid ${nodeCount === n ? 'var(--accent-active)' : 'var(--border)'}`,
            }}
          >
            {n}
          </button>
        ))}
      </div>

      <SectionLabel label="Algorithm" />
      <div className="grid grid-cols-2 gap-2">
        <ToolButton
          icon={<Network size={14} />}
          label="Kruskal's"
          shortcut="K"
          active={algorithmType === 'kruskal'}
          onClick={() => onSetAlgorithm('kruskal')}
        />
        <ToolButton
          icon={<Waypoints size={14} />}
          label="Prim's"
          shortcut="P"
          active={algorithmType === 'prim'}
          onClick={() => onSetAlgorithm('prim')}
        />
      </div>

      {algorithmType === 'prim' && graph.nodes.length > 0 && (
        <div className="flex items-center gap-2 mt-3">
          <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Start:</span>
          <select
            value={startNode}
            onChange={e => onSetStartNode(e.target.value)}
            className="rounded px-2 py-1 text-xs font-mono outline-none"
            style={{
              background: 'var(--bg-elevated)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
            }}
          >
            {graph.nodes.map(n => (
              <option key={n.id} value={n.id}>{n.id}</option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={onInitAlgorithm}
        className="mt-3 w-full rounded-lg py-2 text-sm font-semibold transition-all"
        style={{
          background: 'var(--accent-accept)',
          color: '#fff',
        }}
      >
        Run Algorithm
      </button>

      <SectionLabel label="Controls" />
      <div className="flex items-center justify-center gap-2">
        <button
          onClick={onStepBack}
          className="rounded-lg p-2 transition-all"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          title="Step Back"
        >
          <SkipBack size={16} />
        </button>
        <button
          onClick={isPlaying ? onPause : onPlay}
          className="rounded-lg p-3 transition-all relative"
          style={{
            background: 'var(--accent-active)',
            color: '#000',
          }}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          <span className="absolute -bottom-0.5 -right-0.5 text-[8px] font-mono opacity-40">Spc</span>
        </button>
        <button
          onClick={onStepForward}
          className="rounded-lg p-2 transition-all"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          title="Step Forward"
        >
          <SkipForward size={16} />
        </button>
        <button
          onClick={onReset}
          className="rounded-lg p-2 transition-all"
          style={{ background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border)' }}
          title="Reset Animation [R]"
        >
          <RotateCcw size={16} />
        </button>
      </div>

      <SectionLabel label="Speed" />
      <div className="flex items-center gap-2">
        <Gauge size={14} style={{ color: 'var(--text-muted)' }} />
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Slow</span>
        <input
          type="range"
          min={1}
          max={100}
          value={speed}
          onChange={e => onSetSpeed(Number(e.target.value))}
          className="flex-1 accent-[var(--accent-active)]"
          style={{ accentColor: 'var(--accent-active)' }}
        />
        <span className="text-[10px] font-mono" style={{ color: 'var(--text-muted)' }}>Fast</span>
      </div>
    </div>
  );
};

export default LeftPanel;
