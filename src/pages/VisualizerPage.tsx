import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { ThemeName, Graph, SavedGraph } from '../types';
import { isGraphConnected } from '../utils/graphUtils';
import { runKruskal } from '../algorithms/kruskal';
import { runPrim } from '../algorithms/prim';
import type { AlgorithmStep } from '../types';
import Header from '../components/shared/Header';
import Toast from '../components/shared/Toast';
import LeftPanel from '../components/visualizer/LeftPanel';
import RightPanel from '../components/visualizer/RightPanel';
import GraphCanvas from '../components/visualizer/GraphCanvas';
import CompareCanvas from '../components/visualizer/CompareCanvas';
import ExplanationBar from '../components/visualizer/ExplanationBar';
import KeyboardHelpModal from '../components/visualizer/KeyboardHelpModal';
import { useGraph } from '../hooks/useGraph';
import { useAlgorithm } from '../hooks/useAlgorithm';
import { useToast } from '../hooks/useToast';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

interface VisualizerPageProps {
  theme: ThemeName;
  setSpecificTheme: (t: ThemeName) => void;
  cycleTheme: () => void;
}

const VisualizerPage: React.FC<VisualizerPageProps> = ({ theme, setSpecificTheme, cycleTheme }) => {
  const [compareMode, setCompareMode] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [weightInput, setWeightInput] = useState<{ source: string; target: string; x: number; y: number } | null>(null);
  const weightInputRef = useRef<HTMLInputElement>(null);

  // Compare mode state
  const [compareKruskalSteps, setCompareKruskalSteps] = useState<AlgorithmStep[]>([]);
  const [comparePrimSteps, setComparePrimSteps] = useState<AlgorithmStep[]>([]);
  const [compareStepIndex, setCompareStepIndex] = useState(-1);
  const [compareIsPlaying, setCompareIsPlaying] = useState(false);
  const compareIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { toasts, addToast, removeToast } = useToast();
  const {
    graph, canvasMode, connectSource, setConnectSource,
    addNode, updateNodePosition, addEdge, resetGraph,
    loadGraph, randomGraph, toggleMode, setCanvasMode,
  } = useGraph();

  const algo = useAlgorithm();

  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = useCallback((x: number, y: number) => {
    if (canvasMode === 'addNode') {
      addNode(x, y);
    }
  }, [canvasMode, addNode]);

  const handleNodeClick = useCallback((id: string) => {
    if (canvasMode === 'connectEdge') {
      if (!connectSource) {
        setConnectSource(id);
      } else {
        // Show weight input popup
        const node = graph.nodes.find(n => n.id === id);
        const srcNode = graph.nodes.find(n => n.id === connectSource);
        if (node && srcNode) {
          setWeightInput({
            source: connectSource,
            target: id,
            x: (srcNode.x + node.x) / 2,
            y: (srcNode.y + node.y) / 2,
          });
          setTimeout(() => weightInputRef.current?.focus(), 50);
        }
      }
    }
  }, [canvasMode, connectSource, setConnectSource, graph.nodes]);

  const handleWeightSubmit = useCallback((weight: string) => {
    if (!weightInput) return;
    const w = parseInt(weight, 10);
    if (isNaN(w) || w < 1 || w > 999) {
      addToast('Weight must be 1-999', 'warning');
      setWeightInput(null);
      setConnectSource(null);
      return;
    }
    const err = addEdge(weightInput.source, weightInput.target, w);
    if (err) {
      addToast(err, 'error');
    }
    setWeightInput(null);
    setConnectSource(null);
  }, [weightInput, addEdge, addToast, setConnectSource]);

  const handleInitAlgorithm = useCallback(() => {
    if (graph.nodes.length < 2) {
      addToast('Add at least 2 nodes', 'info');
      return;
    }
    if (graph.edges.length < 1) {
      addToast('Add at least 1 edge', 'info');
      return;
    }
    if (!isGraphConnected(graph)) {
      addToast('Graph is disconnected. MST requires a connected graph.', 'warning');
      return;
    }
    algo.initAlgorithm(graph);
  }, [graph, algo, addToast]);

  const handleSaveGraph = useCallback(() => {
    const data: SavedGraph = {
      version: '1.0',
      nodes: graph.nodes,
      edges: graph.edges,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mst-graph.json';
    a.click();
    URL.revokeObjectURL(url);
    addToast('Graph saved', 'success');
  }, [graph, addToast]);

  const handleRandomGraph = useCallback((count: number) => {
    const el = canvasRef.current;
    const w = el?.clientWidth ?? 800;
    const h = el?.clientHeight ?? 500;
    randomGraph(count, w, h);
    algo.resetAlgorithm();
  }, [randomGraph, algo]);

  const handleResetGraph = useCallback(() => {
    resetGraph();
    algo.resetAlgorithm();
  }, [resetGraph, algo]);

  // Compare mode logic
  const handleToggleCompare = useCallback(() => {
    setCompareMode(prev => !prev);
    if (compareIntervalRef.current) {
      clearInterval(compareIntervalRef.current);
      compareIntervalRef.current = null;
    }
    setCompareIsPlaying(false);
    setCompareStepIndex(-1);
  }, []);

  const initCompare = useCallback(() => {
    if (graph.nodes.length < 2 || graph.edges.length < 1) return;
    if (!isGraphConnected(graph)) {
      addToast('Graph must be connected for compare', 'warning');
      return;
    }
    const kSteps = runKruskal(graph);
    const pSteps = runPrim(graph, graph.nodes[0].id);
    setCompareKruskalSteps(kSteps);
    setComparePrimSteps(pSteps);
    setCompareStepIndex(-1);
    setCompareIsPlaying(true);
  }, [graph, addToast]);

  useEffect(() => {
    if (compareMode && compareIsPlaying) {
      const maxLen = Math.max(compareKruskalSteps.length, comparePrimSteps.length);
      const delay = Math.max(200, 2000 - algo.speed * 18);
      compareIntervalRef.current = setInterval(() => {
        setCompareStepIndex(prev => {
          const next = prev + 1;
          if (next >= maxLen) {
            setCompareIsPlaying(false);
            if (compareIntervalRef.current) clearInterval(compareIntervalRef.current);
            return prev;
          }
          return next;
        });
      }, delay);
    } else if (compareIntervalRef.current) {
      clearInterval(compareIntervalRef.current);
      compareIntervalRef.current = null;
    }
    return () => {
      if (compareIntervalRef.current) {
        clearInterval(compareIntervalRef.current);
        compareIntervalRef.current = null;
      }
    };
  }, [compareMode, compareIsPlaying, compareKruskalSteps.length, comparePrimSteps.length, algo.speed]);

  const kruskalCompareStep = compareStepIndex >= 0 && compareStepIndex < compareKruskalSteps.length
    ? compareKruskalSteps[compareStepIndex] : null;
  const primCompareStep = compareStepIndex >= 0 && compareStepIndex < comparePrimSteps.length
    ? comparePrimSteps[compareStepIndex] : null;

  // Keyboard shortcuts
  const shortcutHandlers = useMemo(() => ({
    onPlayPause: () => {
      if (compareMode) {
        if (compareKruskalSteps.length === 0) {
          initCompare();
        } else {
          setCompareIsPlaying(p => !p);
        }
      } else {
        if (algo.steps.length > 0) {
          algo.togglePlayPause();
        } else {
          handleInitAlgorithm();
        }
      }
    },
    onReset: () => {
      algo.resetAnimation();
      setCompareStepIndex(-1);
      setCompareIsPlaying(false);
    },
    onStepForward: () => {
      if (compareMode) {
        const maxLen = Math.max(compareKruskalSteps.length, comparePrimSteps.length);
        setCompareStepIndex(p => Math.min(p + 1, maxLen - 1));
      } else {
        algo.stepForward();
      }
    },
    onStepBackward: () => {
      if (compareMode) {
        setCompareStepIndex(p => Math.max(p - 1, -1));
      } else {
        algo.stepBackward();
      }
    },
    onToggleNodeMode: () => toggleMode('addNode'),
    onToggleEdgeMode: () => toggleMode('connectEdge'),
    onSwitchKruskal: () => { algo.setAlgorithmType('kruskal'); algo.resetAlgorithm(); },
    onSwitchPrim: () => { algo.setAlgorithmType('prim'); algo.resetAlgorithm(); },
    onToggleCompare: handleToggleCompare,
    onCycleTheme: cycleTheme,
    onRandomGraph: () => handleRandomGraph(7),
    onShowHelp: () => setShowHelp(p => !p),
    onEscape: () => {
      setShowHelp(false);
      setCanvasMode('select');
      setConnectSource(null);
      setWeightInput(null);
    },
  }), [algo, toggleMode, handleToggleCompare, cycleTheme, handleRandomGraph, setCanvasMode, setConnectSource, handleInitAlgorithm, compareMode, compareKruskalSteps.length, comparePrimSteps.length, initCompare]);

  useKeyboardShortcuts(shortcutHandlers, true);

  // Auto-init compare when toggling on
  useEffect(() => {
    if (compareMode && graph.nodes.length >= 2 && graph.edges.length >= 1 && isGraphConnected(graph)) {
      initCompare();
    }
  }, [compareMode]);

  // Determine explanation for compare mode
  const compareExplanation = compareMode
    ? (kruskalCompareStep || primCompareStep)
    : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: 'var(--bg-base)' }}>
      <Header
        theme={theme}
        setSpecificTheme={setSpecificTheme}
        algorithmType={algo.algorithmType}
        compareMode={compareMode}
        onToggleCompare={handleToggleCompare}
        onShowHelp={() => setShowHelp(true)}
        nodeCount={graph.nodes.length}
        edgeCount={graph.edges.length}
      />

      <div className="flex flex-1 min-h-0">
        <LeftPanel
          graph={graph}
          canvasMode={canvasMode}
          algorithmType={algo.algorithmType}
          startNode={algo.startNode}
          isPlaying={algo.isPlaying}
          speed={algo.speed}
          onToggleMode={toggleMode}
          onRandomGraph={handleRandomGraph}
          onResetGraph={handleResetGraph}
          onSaveGraph={handleSaveGraph}
          onLoadGraph={(g: Graph) => { loadGraph(g); algo.resetAlgorithm(); }}
          onSetAlgorithm={(t) => { algo.setAlgorithmType(t); algo.resetAlgorithm(); }}
          onSetStartNode={algo.setStartNode}
          onPlay={algo.play}
          onPause={algo.pause}
          onStepBack={algo.stepBackward}
          onStepForward={algo.stepForward}
          onReset={algo.resetAnimation}
          onSetSpeed={algo.setSpeed}
          onInitAlgorithm={handleInitAlgorithm}
          addToast={addToast}
        />

        <div className="flex-1 relative min-w-0" ref={canvasRef} style={{ background: 'var(--bg-canvas)' }}>
          {compareMode ? (
            <CompareCanvas
              graph={graph}
              kruskalStep={kruskalCompareStep}
              primStep={primCompareStep}
              kruskalComplete={kruskalCompareStep?.type === 'COMPLETE'}
              primComplete={primCompareStep?.type === 'COMPLETE'}
            />
          ) : (
            <GraphCanvas
              graph={graph}
              currentStep={algo.currentStepData}
              canvasMode={canvasMode}
              connectSource={connectSource}
              onCanvasClick={handleCanvasClick}
              onNodeClick={handleNodeClick}
              onNodeDrag={updateNodePosition}
              isComplete={algo.isComplete}
            />
          )}

          {/* Weight input popup */}
          {weightInput && (
            <div
              className="absolute z-20 flex items-center gap-2 rounded-lg p-2 shadow-lg"
              style={{
                left: weightInput.x - 60,
                top: weightInput.y - 20,
                background: 'var(--bg-panel)',
                border: '1px solid var(--accent-active)',
              }}
            >
              <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
                {weightInput.source}-{weightInput.target} w=
              </span>
              <input
                ref={weightInputRef}
                type="number"
                min={1}
                max={999}
                defaultValue={1}
                className="w-14 rounded px-2 py-1 text-xs font-mono outline-none"
                style={{
                  background: 'var(--bg-elevated)',
                  color: 'var(--text-primary)',
                  border: '1px solid var(--border)',
                }}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleWeightSubmit((e.target as HTMLInputElement).value);
                  } else if (e.key === 'Escape') {
                    setWeightInput(null);
                    setConnectSource(null);
                  }
                }}
                onBlur={e => handleWeightSubmit(e.target.value)}
              />
            </div>
          )}
        </div>

        {!compareMode && (
          <RightPanel
            graph={graph}
            currentStep={algo.currentStepData}
            stepIndex={algo.currentStep}
            totalSteps={algo.steps.length}
            algorithmType={algo.algorithmType}
          />
        )}
      </div>

      <ExplanationBar
        currentStep={compareMode ? compareExplanation : algo.currentStepData}
        stepIndex={compareMode ? compareStepIndex : algo.currentStep}
      />

      <Toast toasts={toasts} removeToast={removeToast} />
      <KeyboardHelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};

export default VisualizerPage;
