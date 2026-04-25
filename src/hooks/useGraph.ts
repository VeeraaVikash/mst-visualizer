import { useState, useCallback, useRef } from 'react';
import type { Graph, GraphNode, GraphEdge, CanvasMode } from '../types';
import { generateNodeLabel, generateRandomGraph, edgeExists } from '../utils/graphUtils';

export function useGraph() {
  const [graph, setGraph] = useState<Graph>({ nodes: [], edges: [] });
  const [canvasMode, setCanvasMode] = useState<CanvasMode>('select');
  const [connectSource, setConnectSource] = useState<string | null>(null);
  const edgeCounter = useRef(0);

  const addNode = useCallback((x: number, y: number) => {
    setGraph(p => {
      const id = generateNodeLabel(p.nodes.length);
      const node: GraphNode = { id, x, y };
      return { ...p, nodes: [...p.nodes, node] };
    });
  }, []);

  const updateNodePosition = useCallback((id: string, x: number, y: number) => {
    setGraph(p => ({ ...p, nodes: p.nodes.map(n => n.id === id ? { ...n, x, y } : n) }));
  }, []);

  const addEdge = useCallback((source: string, target: string, weight: number): string | null => {
    if (source === target) return 'Cannot connect a node to itself';
    if (edgeExists(graph.edges, source, target)) return `Edge ${source}-${target} already exists`;
    if (!Number.isInteger(weight) || weight < 1 || weight > 9999) return 'Weight must be 1–9999';
    const id = `e${edgeCounter.current++}`;
    const edge: GraphEdge = { id, source, target, weight };
    setGraph(p => ({ ...p, edges: [...p.edges, edge] }));
    return null;
  }, [graph.edges]);

  const deleteNode = useCallback((id: string) => {
    setGraph(p => ({ nodes: p.nodes.filter(n => n.id !== id), edges: p.edges.filter(e => e.source !== id && e.target !== id) }));
  }, []);

  const deleteEdge = useCallback((id: string) => {
    setGraph(p => ({ ...p, edges: p.edges.filter(e => e.id !== id) }));
  }, []);

  const updateEdgeWeight = useCallback((id: string, weight: number) => {
    setGraph(p => ({ ...p, edges: p.edges.map(e => e.id === id ? { ...e, weight } : e) }));
  }, []);

  const resetGraph = useCallback(() => {
    setGraph({ nodes: [], edges: [] });
    setConnectSource(null);
    edgeCounter.current = 0;
  }, []);

  const loadGraph = useCallback((g: Graph) => {
    setGraph(g);
    edgeCounter.current = g.edges.length;
    setConnectSource(null);
  }, []);

  const randomGraph = useCallback((count: number, w: number, h: number) => {
    const g = generateRandomGraph(count, w, h);
    setGraph(g);
    edgeCounter.current = g.edges.length;
    setConnectSource(null);
  }, []);

  const toggleMode = useCallback((mode: CanvasMode) => {
    setCanvasMode(p => p === mode ? 'select' : mode);
    setConnectSource(null);
  }, []);

  return {
    graph, canvasMode, connectSource,
    setConnectSource, setCanvasMode, setGraph,
    addNode, updateNodePosition, addEdge, deleteNode, deleteEdge, updateEdgeWeight,
    resetGraph, loadGraph, randomGraph, toggleMode,
    setEdgeCounter: (n: number) => { edgeCounter.current = n; },
  };
}
