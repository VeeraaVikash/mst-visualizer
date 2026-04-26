import type { Graph, GraphNode, GraphEdge } from '../types';
import * as d3 from 'd3';

export function generateNodeLabel(index: number): string {
  if (index < 26) return String.fromCharCode(65 + index);
  return String.fromCharCode(64 + Math.ceil((index + 1) / 26)) + String.fromCharCode(65 + (index % 26));
}

export function isGraphConnected(graph: Graph): boolean {
  if (graph.nodes.length === 0) return true;
  const adj: Record<string, string[]> = {};
  graph.nodes.forEach(n => (adj[n.id] = []));
  graph.edges.forEach(e => { adj[e.source]?.push(e.target); adj[e.target]?.push(e.source); });
  const vis = new Set([graph.nodes[0].id]);
  const q = [graph.nodes[0].id];
  while (q.length) { const c = q.shift()!; (adj[c] || []).forEach(n => { if (!vis.has(n)) { vis.add(n); q.push(n); } }); }
  return vis.size === graph.nodes.length;
}

export function edgeExists(edges: GraphEdge[], s: string, t: string): boolean {
  return edges.some(e => (e.source === s && e.target === t) || (e.source === t && e.target === s));
}

export function graphDensity(nodeCount: number, edgeCount: number): number {
  return nodeCount < 2 ? 0 : (2 * edgeCount) / (nodeCount * (nodeCount - 1));
}

export function generateRandomGraph(count: number, w: number, h: number): Graph {
  const nodes: GraphNode[] = Array.from({ length: count }, (_, i) => ({
    id: generateNodeLabel(i),
    x: w / 2 + (Math.random() - 0.5) * 100,
    y: h / 2 + (Math.random() - 0.5) * 100
  }));

  const edges: GraphEdge[] = [];
  let ec = 0;
  const shuf = [...nodes].sort(() => Math.random() - 0.5);
  for (let i = 1; i < shuf.length; i++) {
    edges.push({ id: `e${ec++}`, source: shuf[i-1].id, target: shuf[i].id, weight: Math.floor(Math.random() * 49) + 1 });
  }
  let added = 0, att = 0;
  while (added < Math.floor(count * 0.8) && att < 200) {
    att++;
    const a = Math.floor(Math.random() * count), b = Math.floor(Math.random() * count);
    if (a === b) continue;
    const s = nodes[a].id, t = nodes[b].id;
    if (!edgeExists(edges, s, t)) { edges.push({ id: `e${ec++}`, source: s, target: t, weight: Math.floor(Math.random() * 49) + 1 }); added++; }
  }

  const simNodes = nodes.map(n => ({ ...n }));
  const simEdges = edges.map(e => ({ source: e.source, target: e.target }));

  d3.forceSimulation(simNodes as any)
    .force('charge', d3.forceManyBody().strength(-1000))
    .force('center', d3.forceCenter(w / 2, h / 2))
    .force('link', d3.forceLink(simEdges).id((d: any) => d.id).distance(120))
    .force('collide', d3.forceCollide().radius(50))
    .stop()
    .tick(300);

  simNodes.forEach((n, i) => {
    nodes[i].x = Math.max(40, Math.min(w - 40, n.x!));
    nodes[i].y = Math.max(40, Math.min(h - 40, n.y!));
  });

  return { nodes, edges };
}
