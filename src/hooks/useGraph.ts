import { useState, useCallback, useRef } from 'react';
import type { Graph, GraphNode, GraphEdge, CanvasMode } from '../types';
import { generateNodeLabel, generateRandomGraph, edgeExists } from '../utils/graphUtils';

export function useGraph() {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  const [canvasMode, setCanvasMode] = useState<CanvasMode>('select');
  const [connectSource, setConnectSource] = useState<string | null>(null);
  const edgeCounterRef = useRef(0);

  const addNode = useCallback((x: number, y: number) => {
    setGraph(prev => {
      const label = generateNodeLabel(prev.nodes.length);
      const node: GraphNode = { id: label, x, y };
      return { ...prev, nodes: [...prev.nodes, node] };
    });
  }, []);

  const updateNodePosition = useCallback((id: string, x: number, y: number) => {
    setGraph(prev => ({
      ...prev,
      nodes: prev.nodes.map(n => (n.id === id ? { ...n, x, y } : n)),
    }));
  }, []);

  const addEdge = useCallback((source: string, target: string, weight: number): string | null => {
    if (source === target) return 'Cannot connect a node to itself';
    if (edgeExists(graph.edges, source, target)) return `Edge ${source}-${target} already exists`;
    if (weight < 1 || weight > 999 || !Number.isInteger(weight)) return 'Weight must be 1-999';

    const id = `e${edgeCounterRef.current++}`;
    const edge: GraphEdge = { id, source, target, weight };
    setGraph(prev => ({ ...prev, edges: [...prev.edges, edge] }));
    return null;
  }, [graph.edges]);

  const resetGraph = useCallback(() => {
    setGraph({ nodes: [], edges: [] });
    setConnectSource(null);
    edgeCounterRef.current = 0;
  }, []);

  const loadGraph = useCallback((g: Graph) => {
    setGraph(g);
    edgeCounterRef.current = g.edges.length;
    setConnectSource(null);
  }, []);

  const randomGraph = useCallback((count: number, canvasW: number, canvasH: number) => {
    const g = generateRandomGraph(count, canvasW, canvasH);
    setGraph(g);
    edgeCounterRef.current = g.edges.length;
    setConnectSource(null);
  }, []);

  const toggleMode = useCallback((mode: CanvasMode) => {
    setCanvasMode(prev => (prev === mode ? 'select' : mode));
    setConnectSource(null);
  }, []);

  return {
    graph,
    canvasMode,
    connectSource,
    setConnectSource,
    addNode,
    updateNodePosition,
    addEdge,
    resetGraph,
    loadGraph,
    randomGraph,
    toggleMode,
    setCanvasMode,
  };
}
