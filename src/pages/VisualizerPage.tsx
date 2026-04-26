import React, { useState, useCallback, useEffect, useRef } from 'react';
import { GitBranch, ArrowLeft, Keyboard, Activity, X, TrendingUp } from 'lucide-react';
import type { ThemeName, AlgorithmType, Graph, AlgorithmStep } from '../types';
import { useGraph } from '../hooks/useGraph';
import { useToast } from '../hooks/useToast';
import { runKruskal } from '../algorithms/kruskal';
import { runPrim } from '../algorithms/prim';
import { isGraphConnected } from '../utils/graphUtils';
import { SCENARIOS } from '../data/scenarios';
import ThemeToggle from '../components/shared/ThemeToggle';
import Toast from '../components/shared/Toast';
import GraphCanvas from '../components/visualizer/GraphCanvas';
import ControlPanel from '../components/visualizer/ControlPanel';
import HistoryPanel from '../components/visualizer/HistoryPanel';
import ExplanationBar from '../components/visualizer/ExplanationBar';
import KeyboardModal from '../components/visualizer/KeyboardModal';
import StatsPanel from '../components/visualizer/StatsPanel';

interface Props { goLanding: () => void; theme: ThemeName; setTheme: (t: ThemeName) => void; cycleTheme: () => void; initialScenario: string; }

export default function VisualizerPage({ goLanding, theme, setTheme, cycleTheme, initialScenario }: Props) {
  const { graph, canvasMode, connectSource, setConnectSource, setCanvasMode, setGraph,
    addNode, updateNodePosition, addEdge, deleteNode, deleteEdge, updateEdgeWeight,
    resetGraph, loadGraph, randomGraph, toggleMode, setEdgeCounter } = useGraph();
  const { toasts, addToast, removeToast } = useToast();

  const [deleteMode, setDeleteMode] = useState(false);
  const [weightPopup, setWeightPopup] = useState<{ source: string; target: string; x: number; y: number } | null>(null);
  const [editEdge, setEditEdge] = useState<Graph['edges'][number] | null>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);
  const canvasContRef = useRef<HTMLDivElement>(null);

  // Algorithm state
  const [algoType, setAlgoType] = useState<AlgorithmType>('kruskal');
  const [startNode, setStartNode] = useState('');
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(50);
  const playRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Race state
  const [kSteps, setKSteps] = useState<AlgorithmStep[]>([]);
  const [pSteps, setPSteps] = useState<AlgorithmStep[]>([]);
  const [raceIdx, setRaceIdx] = useState(-1);
  const [racePlaying, setRacePlaying] = useState(false);
  const [raceHistory, setRaceHistory] = useState<'kruskal' | 'prim' | null>(null);
  const raceRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // UI state
  const [scenario, setScenario] = useState(initialScenario || 'telecom');
  const [showHelp, setShowHelp] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [nodeCount, setNodeCount] = useState(7);

  // Load scenario on change
  useEffect(() => {
    const sc = SCENARIOS[scenario];
    if (sc) {
      const g = { nodes: [...sc.graph.nodes], edges: [...sc.graph.edges] };
      loadGraph(g);
      setEdgeCounter(sc.graph.edges.length);
      resetAlgo();
      setDeleteMode(false);
      setCanvasMode('select');
    }
  }, [scenario]);

  // Sync startNode
  useEffect(() => {
    if (graph.nodes.length > 0 && (!startNode || !graph.nodes.find(n => n.id === startNode))) {
      setStartNode(graph.nodes[0].id);
    }
  }, [graph.nodes]);

  function resetAlgo() {
    setSteps([]); setStepIdx(-1); setPlaying(false);
    if (playRef.current) { clearInterval(playRef.current); playRef.current = null; }
  }

  // Graph ops that also reset algo
  const handleDeleteNode = (id: string) => { deleteNode(id); resetAlgo(); };
  const handleDeleteEdge = (id: string) => { deleteEdge(id); resetAlgo(); };
  const handleUpdateWeight = (id: string, w: number) => { updateEdgeWeight(id, w); resetAlgo(); };

  const doAddEdge = (src: string, tgt: string, w: number) => {
    const err = addEdge(src, tgt, w);
    if (err) addToast(err, 'error');
    return err;
  };

  // Run algorithm
  const runAlgo = useCallback(() => {
    if (graph.nodes.length < 2) { addToast('Need 2+ nodes', 'info'); return; }
    if (!graph.edges.length) { addToast('Need at least 1 edge', 'info'); return; }
    if (!isGraphConnected(graph)) { addToast('Graph must be connected for MST', 'warning'); return; }
    const unit = SCENARIOS[scenario]?.unit ?? '';
    const s = algoType === 'kruskal'
      ? runKruskal(graph, unit)
      : runPrim(graph, startNode || graph.nodes[0].id, unit);
    setSteps(s); setStepIdx(s.length - 1); setPlaying(false);
    if (playRef.current) { clearInterval(playRef.current); playRef.current = null; }
  }, [graph, algoType, startNode, scenario, addToast]);

  const stepFwd = useCallback(() => {
    setStepIdx(p => { const n = p + 1; if (n >= steps.length) { setPlaying(false); return p; } if (steps[n]?.type === 'COMPLETE') setPlaying(false); return n; });
  }, [steps]);

  const stepBack = useCallback(() => setStepIdx(p => Math.max(p - 1, -1)), []);

  const togglePlay = useCallback(() => {
    if (!steps.length) {
      if (graph.nodes.length < 2 || !graph.edges.length || !isGraphConnected(graph)) {
        runAlgo(); // Use runAlgo to show error toasts
        return;
      }
      const unit = SCENARIOS[scenario]?.unit ?? '';
      const s = algoType === 'kruskal' ? runKruskal(graph, unit) : runPrim(graph, startNode || graph.nodes[0].id, unit);
      setSteps(s); setStepIdx(0); setPlaying(true);
      return;
    }
    if (playing) { setPlaying(false); return; }
    if (stepIdx >= steps.length - 1) setStepIdx(0);
    setPlaying(true);
  }, [playing, steps, stepIdx, runAlgo, graph, algoType, startNode, scenario]);

  useEffect(() => {
    if (playing && steps.length > 0) {
      const delay = Math.max(400, 2500 - speed * 20);
      playRef.current = setInterval(() => {
        setStepIdx(p => {
          const n = p + 1;
          if (n >= steps.length) { setPlaying(false); if (playRef.current) clearInterval(playRef.current); return p; }
          if (steps[n]?.type === 'COMPLETE') { setPlaying(false); if (playRef.current) clearInterval(playRef.current); }
          return n;
        });
      }, delay);
    } else if (playRef.current) { clearInterval(playRef.current); playRef.current = null; }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [playing, speed, steps]);

  // Race
  const startRace = useCallback(() => {
    if (graph.nodes.length < 2 || !isGraphConnected(graph)) { addToast('Need connected graph for race', 'warning'); return; }
    const unit = SCENARIOS[scenario]?.unit ?? '';
    const ks = runKruskal(graph, unit);
    const ps = runPrim(graph, graph.nodes[0].id, unit);
    setKSteps(ks); setPSteps(ps); setRaceIdx(-1); setRacePlaying(true); setRaceHistory(null);
  }, [graph, scenario, addToast]);

  useEffect(() => {
    if (racePlaying && (kSteps.length > 0 || pSteps.length > 0)) {
      const maxL = Math.max(kSteps.length, pSteps.length);
      const delay = Math.max(400, 2500 - speed * 20);
      raceRef.current = setInterval(() => {
        setRaceIdx(p => { const n = p + 1; if (n >= maxL) { setRacePlaying(false); if (raceRef.current) clearInterval(raceRef.current); return p; } return n; });
      }, delay);
    } else if (raceRef.current) { clearInterval(raceRef.current); raceRef.current = null; }
    return () => { if (raceRef.current) clearInterval(raceRef.current); };
  }, [racePlaying, kSteps.length, pSteps.length, speed]);

  // Canvas events
  const handleBgClick = useCallback((x: number, y: number) => {
    if (canvasMode === 'addNode' && !deleteMode) addNode(x, y);
  }, [canvasMode, deleteMode, addNode]);

  const handleNodeClick = useCallback((id: string) => {
    if (deleteMode) { handleDeleteNode(id); return; }
    if (canvasMode === 'connectEdge') {
      if (!connectSource) { setConnectSource(id); }
      else {
        const s = graph.nodes.find(n => n.id === id), src = graph.nodes.find(n => n.id === connectSource);
        if (s && src) { setWeightPopup({ source: connectSource, target: id, x: (src.x + s.x) / 2, y: (src.y + s.y) / 2 }); setTimeout(() => weightInputRef.current?.focus(), 50); }
      }
    }
  }, [deleteMode, canvasMode, connectSource, graph.nodes, setConnectSource]);

  const handleEdgeAction = useCallback((edge: Graph['edges'][number], action: 'edit' | 'delete') => {
    if (action === 'delete') { handleDeleteEdge(edge.id); return; }
    setEditEdge(edge);
  }, []);

  const submitWeight = (val: string) => {
    if (!weightPopup) return;
    const w = parseInt(val, 10);
    doAddEdge(weightPopup.source, weightPopup.target, w);
    setWeightPopup(null); setConnectSource(null);
  };

  // Save graph
  const saveGraph = () => {
    const d = { version: '2.0', scenario, nodes: graph.nodes, edges: graph.edges };
    const blob = new Blob([JSON.stringify(d, null, 2)], { type: 'application/json' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `route-d-optimal-${scenario}.json`; a.click();
    addToast('Graph saved as JSON', 'success');
  };

  const handleRandom = (cnt: number) => {
    const el = canvasContRef.current;
    const w = el?.clientWidth ?? 700, h = el?.clientHeight ?? 450;
    randomGraph(cnt, w, h);
    resetAlgo(); setDeleteMode(false);
  };

  const handleScenario = (id: string) => { setScenario(id); };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT') { if (e.key === 'Escape') t.blur(); return; }
      switch (e.key) {
        case ' ': e.preventDefault(); togglePlay(); break;
        case 'r': case 'R': setStepIdx(-1); setPlaying(false); break;
        case 'n': case 'N': setDeleteMode(false); toggleMode('addNode'); break;
        case 'e': case 'E': setDeleteMode(false); toggleMode('connectEdge'); break;
        case 'd': case 'D': setDeleteMode(p => { if (!p) setCanvasMode('select'); return !p; }); break;
        case 'k': case 'K': setAlgoType('kruskal'); resetAlgo(); break;
        case 'p': case 'P': setAlgoType('prim'); resetAlgo(); break;
        case 'c': case 'C': startRace(); break;
        case 'ArrowRight': e.preventDefault(); stepFwd(); break;
        case 'ArrowLeft': e.preventDefault(); stepBack(); break;
        case 'g': case 'G': handleRandom(nodeCount); break;
        case 't': case 'T': cycleTheme(); break;
        case '?': case '/': e.preventDefault(); setShowHelp(p => !p); break;
        case 'Escape': setShowHelp(false); setCanvasMode('select'); setConnectSource(null); setWeightPopup(null); setEditEdge(null); setDeleteMode(false); break;
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [togglePlay, stepFwd, stepBack, startRace, cycleTheme, nodeCount, toggleMode]);

  const curStep = stepIdx >= 0 && stepIdx < steps.length ? steps[stepIdx] : null;

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'var(--bg-base)' }}>
      {/* HEADER */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 14px', height: 46, background: 'var(--bg-panel)', borderBottom: '1px solid var(--border)', flexShrink: 0, gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <button onClick={goLanding} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex' }}><ArrowLeft size={15} /></button>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }} onClick={goLanding}>
            <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, var(--accent-accept), var(--accent-candidate))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitBranch size={12} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 14, color: 'var(--text-primary)', letterSpacing: '-0.2px' }}>Route D. Optimal</span>
          </div>
          <div style={{ display: 'flex', gap: 6, marginLeft: 6 }}>
            {(['kruskal', 'prim'] as const).map(a => (
              <span key={a} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, padding: '2px 7px', borderRadius: 4, background: 'var(--bg-elevated)',
                border: `1px solid ${algoType === a ? (a === 'kruskal' ? 'var(--accent-accept)' : 'var(--accent-candidate)') : 'var(--border)'}`,
                color: algoType === a ? (a === 'kruskal' ? 'var(--accent-accept)' : 'var(--accent-candidate)') : 'var(--text-muted)' }}>
                {a === 'kruskal' ? 'Kruskal O(E log E)' : 'Prim O(E log V)'}
              </span>
            ))}
            {graph.nodes.length > 0 && <span style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-secondary)' }}>V={graph.nodes.length} E={graph.edges.length}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, flexShrink: 0 }}>
          <button onClick={() => setShowStats(true)}
            style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, padding: '5px 12px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", border: '1px solid var(--accent-candidate)', background: 'color-mix(in srgb, var(--accent-candidate) 12%, transparent)', color: 'var(--accent-candidate)', cursor: 'pointer' }}
            title="View Statistics">
            <TrendingUp size={12} /> Stats
          </button>
          <button onClick={() => { if (raceIdx !== -1 || racePlaying) { setRacePlaying(false); setRaceIdx(-1); setRaceHistory(null); } else startRace(); }}
            style={{ display: 'flex', alignItems: 'center', gap: 5, borderRadius: 8, padding: '5px 12px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", border: '1px solid var(--accent-active)', background: 'color-mix(in srgb, var(--accent-active) 12%, transparent)', color: 'var(--accent-active)', cursor: 'pointer' }}
            title="Race both algorithms [C]">
            <Activity size={12} /> {raceIdx !== -1 || racePlaying ? 'Stop Race' : 'Race [C]'}
          </button>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button onClick={() => setShowHelp(true)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 30, height: 30, borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', cursor: 'pointer' }} title="Shortcuts [?]">
            <Keyboard size={13} />
          </button>
        </div>
      </header>

      {/* BODY */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0 }}>
        <ControlPanel
          graph={graph} canvasMode={canvasMode} deleteMode={deleteMode} algoType={algoType}
          startNode={startNode} isPlaying={(racePlaying || raceIdx !== -1) ? racePlaying : playing} speed={speed} scenario={scenario}
          steps={(racePlaying || raceIdx !== -1) ? (kSteps.length > pSteps.length ? kSteps : pSteps) : steps}
          stepIdx={(racePlaying || raceIdx !== -1) ? raceIdx : stepIdx} nodeCount={nodeCount}
          onToggleMode={(m) => { setDeleteMode(false); toggleMode(m); }}
          onDeleteMode={() => setDeleteMode(p => { if (!p) setCanvasMode('select'); return !p; })}
          onRandom={handleRandom} onResetGraph={() => { resetGraph(); resetAlgo(); setDeleteMode(false); }}
          onSave={saveGraph}
          onLoad={(g) => { loadGraph(g); setEdgeCounter(g.edges.length); setDeleteMode(false); resetAlgo(); }}
          onSetAlgo={(t) => { setAlgoType(t); resetAlgo(); }}
          onSetStart={setStartNode} onRun={runAlgo}
          onTogglePlay={() => { if (racePlaying || raceIdx !== -1) setRacePlaying(p => !p); else togglePlay(); }}
          onStepFwd={() => { if (racePlaying || raceIdx !== -1) setRaceIdx(p => Math.min(p + 1, Math.max(kSteps.length, pSteps.length) - 1)); else stepFwd(); }}
          onStepBack={() => { if (racePlaying || raceIdx !== -1) setRaceIdx(p => Math.max(p - 1, -1)); else stepBack(); }}
          onResetAnimation={() => { if (racePlaying || raceIdx !== -1) { setRaceIdx(-1); setRacePlaying(false); setRaceHistory(null); } else { setStepIdx(-1); setPlaying(false); } }}
          onSpeedChange={setSpeed} onScenario={handleScenario}
          onNodeCount={setNodeCount} addToast={addToast}
        />

        {/* CANVAS */}
        <div ref={canvasContRef} style={{ flex: 1, position: 'relative', minWidth: 0, background: 'var(--bg-canvas)', display: 'flex', overflow: 'hidden' }}>
          {(racePlaying || raceIdx !== -1) ? (
            <div style={{ display: 'flex', width: '100%', height: '100%' }}>
              <div style={{ flex: 1, position: 'relative', borderRight: '1px solid var(--border)' }}>
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 30, display: 'flex', gap: 8 }}>
                  <div style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-panel)', border: '1px solid var(--border)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: 'var(--accent-accept)', boxShadow: 'var(--shadow)' }}>
                    Kruskal's Algorithm
                  </div>
                  <button onClick={() => setRaceHistory(p => p === 'kruskal' ? null : 'kruskal')} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-panel)', border: '1px solid var(--border)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', boxShadow: 'var(--shadow)' }}>
                    {raceHistory === 'kruskal' ? 'Close History' : 'History'}
                  </button>
                </div>
                
                {raceHistory === 'prim' && (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'color-mix(in srgb, var(--bg-canvas) 95%, transparent)', backdropFilter: 'blur(10px)', padding: '60px 20px 20px 20px' }}>
                    <HistoryPanel steps={pSteps} currentIdx={Math.min(raceIdx, pSteps.length - 1)} onJump={i => setRaceIdx(i)} algoType="prim" scenario={scenario} />
                  </div>
                )}
                
                <GraphCanvas graph={graph} step={raceIdx >= 0 ? kSteps[Math.min(raceIdx, kSteps.length - 1)] : null} canvasMode="select" deleteMode={false} connectSource={null} onBgClick={() => {}} onNodeClick={() => {}} onNodeDrag={() => {}} onEdgeAction={() => {}} isComplete={kSteps[Math.min(raceIdx, kSteps.length - 1)]?.type === 'COMPLETE'} />
                
                {raceIdx >= 0 && <ExplanationBar currentStep={kSteps[Math.min(raceIdx, kSteps.length - 1)]} stepIndex={Math.min(raceIdx, kSteps.length - 1)} />}
              </div>
              <div style={{ flex: 1, position: 'relative' }}>
                <div style={{ position: 'absolute', top: 12, left: 12, zIndex: 30, display: 'flex', gap: 8 }}>
                  <div style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-panel)', border: '1px solid var(--border)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, color: 'var(--accent-candidate)', boxShadow: 'var(--shadow)' }}>
                    Prim's Algorithm
                  </div>
                  <button onClick={() => setRaceHistory(p => p === 'prim' ? null : 'prim')} style={{ padding: '6px 12px', borderRadius: 8, background: 'var(--bg-panel)', border: '1px solid var(--border)', fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer', boxShadow: 'var(--shadow)' }}>
                    {raceHistory === 'prim' ? 'Close History' : 'History'}
                  </button>
                </div>

                {raceHistory === 'kruskal' && (
                  <div style={{ position: 'absolute', inset: 0, zIndex: 20, background: 'color-mix(in srgb, var(--bg-canvas) 95%, transparent)', backdropFilter: 'blur(10px)', padding: '60px 20px 20px 20px' }}>
                    <HistoryPanel steps={kSteps} currentIdx={Math.min(raceIdx, kSteps.length - 1)} onJump={i => setRaceIdx(i)} algoType="kruskal" scenario={scenario} />
                  </div>
                )}
                
                <GraphCanvas graph={graph} step={raceIdx >= 0 ? pSteps[Math.min(raceIdx, pSteps.length - 1)] : null} canvasMode="select" deleteMode={false} connectSource={null} onBgClick={() => {}} onNodeClick={() => {}} onNodeDrag={() => {}} onEdgeAction={() => {}} isComplete={pSteps[Math.min(raceIdx, pSteps.length - 1)]?.type === 'COMPLETE'} />
                
                {raceIdx >= 0 && <ExplanationBar currentStep={pSteps[Math.min(raceIdx, pSteps.length - 1)]} stepIndex={Math.min(raceIdx, pSteps.length - 1)} />}
              </div>
            </div>
          ) : (
            <GraphCanvas
              graph={graph} step={curStep} canvasMode={canvasMode} deleteMode={deleteMode}
              connectSource={connectSource} onBgClick={handleBgClick} onNodeClick={handleNodeClick}
              onNodeDrag={updateNodePosition} onEdgeAction={handleEdgeAction}
              isComplete={curStep?.type === 'COMPLETE'}
            />
          )}

          {/* Weight popup */}
          {weightPopup && !racePlaying && raceIdx === -1 && (
            <div style={{ position: 'absolute', zIndex: 30, left: weightPopup.x - 75, top: weightPopup.y - 24, display: 'flex', alignItems: 'center', gap: 7, padding: 9, borderRadius: 10, background: 'var(--bg-panel)', border: '1px solid var(--accent-active)', boxShadow: 'var(--shadow)' }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-secondary)' }}>{weightPopup.source}—{weightPopup.target}:</span>
              <input ref={weightInputRef} type="number" min={1} max={9999} defaultValue={10}
                style={{ width: 56, borderRadius: 5, padding: '3px 7px', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }}
                onKeyDown={e => { if (e.key === 'Enter') submitWeight((e.target as HTMLInputElement).value); if (e.key === 'Escape') { setWeightPopup(null); setConnectSource(null); } }}
                onBlur={e => { if (weightPopup) submitWeight(e.target.value); }} />
            </div>
          )}

          {/* Edge edit modal */}
          {editEdge && !racePlaying && raceIdx === -1 && (
            <div style={{ position: 'absolute', zIndex: 30, top: '50%', left: '50%', transform: 'translate(-50%, -50%)', padding: 18, borderRadius: 13, background: 'var(--bg-panel)', border: '1px solid var(--accent-active)', boxShadow: 'var(--shadow)', minWidth: 230 }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-primary)', marginBottom: 12, fontWeight: 600 }}>
                Edit: {editEdge.source} — {editEdge.target}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Weight:</span>
                <input id="edit-w" type="number" min={1} max={9999} defaultValue={editEdge.weight} autoFocus
                  style={{ flex: 1, borderRadius: 5, padding: '4px 8px', fontSize: 12, fontFamily: "'JetBrains Mono', monospace", background: 'var(--bg-elevated)', color: 'var(--text-primary)', border: '1px solid var(--border)', outline: 'none' }}
                  onKeyDown={e => {
                    if (e.key === 'Enter') { const w = parseInt((document.getElementById('edit-w') as HTMLInputElement)?.value ?? '', 10); if (w >= 1 && w <= 9999) { handleUpdateWeight(editEdge.id, w); addToast(`Weight updated to ${w}`, 'success'); } setEditEdge(null); }
                    if (e.key === 'Escape') setEditEdge(null);
                  }} />
              </div>
              <div style={{ display: 'flex', gap: 7 }}>
                <button onClick={() => {
                  const w = parseInt((document.getElementById('edit-w') as HTMLInputElement)?.value ?? '', 10);
                  if (w >= 1 && w <= 9999) { handleUpdateWeight(editEdge.id, w); addToast(`Weight → ${w}`, 'success'); } else addToast('Weight must be 1–9999', 'warning');
                  setEditEdge(null);
                }} style={{ flex: 1, padding: '7px 0', borderRadius: 7, border: 'none', background: 'var(--accent-accept)', color: '#fff', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Update</button>
                <button onClick={() => { handleDeleteEdge(editEdge.id); setEditEdge(null); addToast('Edge deleted', 'info'); }} style={{ flex: 1, padding: '7px 0', borderRadius: 7, border: '1px solid var(--accent-reject)', background: 'transparent', color: 'var(--accent-reject)', fontWeight: 600, fontSize: 12, cursor: 'pointer' }}>Delete</button>
                <button onClick={() => setEditEdge(null)} style={{ padding: '7px 10px', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 12, cursor: 'pointer' }}><X size={13} /></button>
              </div>
            </div>
          )}
          
          {!(racePlaying || raceIdx !== -1) && <ExplanationBar currentStep={curStep} stepIndex={stepIdx} />}
        </div>

        {/* RIGHT PANEL - Just History */}
        {!(racePlaying || raceIdx !== -1) && (
          <div style={{ width: 270, background: 'var(--bg-panel)', borderLeft: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0, overflow: 'hidden' }}>
            <HistoryPanel steps={steps} currentIdx={stepIdx} onJump={i => setStepIdx(i)} algoType={algoType} scenario={scenario} />
          </div>
        )}
      </div>

      {showStats && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
          <div style={{ width: 450, background: 'var(--bg-panel)', borderRadius: 16, border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.3)', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid var(--border)', background: 'var(--bg-elevated)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 700, color: 'var(--text-primary)' }}>
                <TrendingUp size={16} style={{ color: 'var(--accent-active)' }} /> Network Statistics
              </div>
              <button onClick={() => setShowStats(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}><X size={16} /></button>
            </div>
            <div style={{ padding: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
              <StatsPanel graph={graph} steps={steps} currentIdx={stepIdx} algoType={algoType} scenario={scenario} />
            </div>
          </div>
        </div>
      )}
      <Toast toasts={toasts} removeToast={removeToast} />
      <KeyboardModal open={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
}
