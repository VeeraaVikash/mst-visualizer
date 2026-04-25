import type { Graph, GraphNode, GraphEdge } from '../types';

export function generateNodeLabel(index: number): string {
  if (index < 26) return String.fromCharCode(65 + index);
  const first = String.fromCharCode(65 + Math.floor(index / 26) - 1);
  const second = String.fromCharCode(65 + (index % 26));
  return first + second;
}

export function circleLayout(count: number, cx: number, cy: number, radius: number): { x: number; y: number }[] {
  const positions: { x: number; y: number }[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    positions.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return positions;
}

export function generateRandomGraph(nodeCount: number, canvasW: number, canvasH: number): Graph {
  const cx = canvasW / 2;
  const cy = canvasH / 2;
  const radius = Math.min(canvasW, canvasH) * 0.35;
  const positions = circleLayout(nodeCount, cx, cy, radius);

  const nodes: GraphNode[] = positions.map((pos, i) => ({
    id: generateNodeLabel(i),
    x: pos.x,
    y: pos.y,
  }));

  const edges: GraphEdge[] = [];
  let edgeCounter = 0;

  // Create spanning tree first (ensures connectivity)
  const shuffled = [...nodes];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  for (let i = 1; i < shuffled.length; i++) {
    const w = Math.floor(Math.random() * 49) + 1;
    edges.push({
      id: `e${edgeCounter++}`,
      source: shuffled[i - 1].id,
      target: shuffled[i].id,
      weight: w,
    });
  }

  // Add extra edges
  const extraCount = Math.floor(nodeCount * 0.6);
  let attempts = 0;
  let added = 0;
  while (added < extraCount && attempts < 100) {
    attempts++;
    const i = Math.floor(Math.random() * nodeCount);
    const j = Math.floor(Math.random() * nodeCount);
    if (i === j) continue;
    const src = nodes[i].id;
    const tgt = nodes[j].id;
    const exists = edges.some(
      e => (e.source === src && e.target === tgt) || (e.source === tgt && e.target === src)
    );
    if (exists) continue;
    const w = Math.floor(Math.random() * 49) + 1;
    edges.push({
      id: `e${edgeCounter++}`,
      source: src,
      target: tgt,
      weight: w,
    });
    added++;
  }

  return { nodes, edges };
}

export function isGraphConnected(graph: Graph): boolean {
  if (graph.nodes.length === 0) return true;
  const adj = new Map<string, Set<string>>();
  for (const n of graph.nodes) adj.set(n.id, new Set());
  for (const e of graph.edges) {
    adj.get(e.source)?.add(e.target);
    adj.get(e.target)?.add(e.source);
  }

  const visited = new Set<string>();
  const queue = [graph.nodes[0].id];
  visited.add(graph.nodes[0].id);

  while (queue.length > 0) {
    const curr = queue.shift()!;
    const neighbors = adj.get(curr);
    if (neighbors) {
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          queue.push(n);
        }
      }
    }
  }

  return visited.size === graph.nodes.length;
}

export function edgeExists(edges: GraphEdge[], source: string, target: string): boolean {
  return edges.some(
    e => (e.source === source && e.target === target) || (e.source === target && e.target === source)
  );
}

export function getEdgeMidpoint(
  nodes: GraphNode[],
  edge: GraphEdge
): { x: number; y: number } {
  const src = nodes.find(n => n.id === edge.source);
  const tgt = nodes.find(n => n.id === edge.target);
  if (!src || !tgt) return { x: 0, y: 0 };
  return {
    x: (src.x + tgt.x) / 2,
    y: (src.y + tgt.y) / 2,
  };
}
