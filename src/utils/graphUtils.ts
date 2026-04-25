import type { Graph, GraphNode, GraphEdge } from '../types';

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
  const cx = w / 2, cy = h / 2, r = Math.min(w, h) * 0.36;
  const nodes: GraphNode[] = Array.from({ length: count }, (_, i) => {
    const a = (2 * Math.PI * i / count) - Math.PI / 2;
    return { id: generateNodeLabel(i), x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
  });
  const edges: GraphEdge[] = [];
  let ec = 0;
  const shuf = [...nodes].sort(() => Math.random() - 0.5);
  for (let i = 1; i < shuf.length; i++) {
    edges.push({ id: `e${ec++}`, source: shuf[i-1].id, target: shuf[i].id, weight: Math.floor(Math.random() * 49) + 1 });
  }
  let added = 0, att = 0;
  while (added < Math.floor(count * 0.65) && att < 150) {
    att++;
    const a = Math.floor(Math.random() * count), b = Math.floor(Math.random() * count);
    if (a === b) continue;
    const s = nodes[a].id, t = nodes[b].id;
    if (!edgeExists(edges, s, t)) { edges.push({ id: `e${ec++}`, source: s, target: t, weight: Math.floor(Math.random() * 49) + 1 }); added++; }
  }
  return { nodes, edges };
}
