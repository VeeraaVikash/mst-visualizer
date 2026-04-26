import type { Graph, GraphNode, GraphEdge } from '../types';

import { LayoutManager } from '../services/LayoutManager';

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

/**
 * Shuffle an array in-place using Fisher-Yates algorithm.
 */
function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/**
 * Production-grade random graph generator.
 * 
 * Strategy:
 * 1) Create nodes with golden-angle spiral initial positions (much better than origin)
 * 2) Build a random spanning tree (guarantees connectivity, avoids hub-spoke)
 * 3) Add controlled random edges to reach target density
 * 4) Use adaptive weight ranges for variety
 * 5) Pass to force-directed layout with adaptive parameters
 */
export function generateRandomGraph(count: number, w: number, h: number): Graph {
  const cx = w / 2;
  const cy = h / 2;
  
  // Golden angle spiral for initial positions — spreads nodes evenly
  const goldenAngle = Math.PI * (3 - Math.sqrt(5));
  const maxRadius = Math.min(w, h) * 0.35;

  const nodes: GraphNode[] = Array.from({ length: count }, (_, i) => {
    const angle = i * goldenAngle;
    const radius = maxRadius * Math.sqrt((i + 1) / count); // square root for uniform density
    return {
      id: generateNodeLabel(i),
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  });

  const edges: GraphEdge[] = [];
  let ec = 0;

  // Helper to create an edge
  const makeEdge = (srcId: string, tgtId: string): GraphEdge => ({
    id: `e${ec++}`,
    source: srcId,
    target: tgtId,
    weight: Math.floor(Math.random() * 45) + 5, // weights 5-49
  });

  // --- Phase 1: Random Spanning Tree (guarantees connectivity) ---
  // Shuffle node indices, then connect each node to a random already-visited node
  const order = shuffle(Array.from({ length: count }, (_, i) => i));
  const visited = new Set<number>();
  visited.add(order[0]);

  for (let i = 1; i < order.length; i++) {
    const current = order[i];
    // Pick a random node from those already visited
    const visitedArr = Array.from(visited);
    const target = visitedArr[Math.floor(Math.random() * visitedArr.length)];
    edges.push(makeEdge(nodes[current].id, nodes[target].id));
    visited.add(current);
  }

  // --- Phase 2: Add additional random edges for interesting MST ---
  // Target: ~1.6x to 2.2x edges relative to V (clamped to max possible)
  const maxEdges = (count * (count - 1)) / 2;
  const targetMultiplier = 1.6 + Math.random() * 0.6; // 1.6 to 2.2
  const targetEdgeCount = Math.min(
    Math.floor(count * targetMultiplier),
    maxEdges
  );

  // Build edge set for O(1) lookup
  const edgeSet = new Set<string>();
  edges.forEach(e => {
    const [a, b] = [e.source, e.target].sort();
    edgeSet.add(`${a}-${b}`);
  });

  // Create a pool of all possible additional edges
  const possibleEdges: [number, number][] = [];
  for (let i = 0; i < count; i++) {
    for (let j = i + 1; j < count; j++) {
      const [a, b] = [nodes[i].id, nodes[j].id].sort();
      if (!edgeSet.has(`${a}-${b}`)) {
        possibleEdges.push([i, j]);
      }
    }
  }

  // Shuffle and pick from the pool
  shuffle(possibleEdges);

  const additionalNeeded = targetEdgeCount - edges.length;
  for (let k = 0; k < Math.min(additionalNeeded, possibleEdges.length); k++) {
    const [i, j] = possibleEdges[k];
    edges.push(makeEdge(nodes[i].id, nodes[j].id));
  }

  // --- Phase 3: Ensure weight diversity (avoid too many similar weights) ---
  // Re-assign weights with better distribution to make MST decisions interesting
  const usedWeights = new Set<number>();
  edges.forEach(e => {
    let w: number;
    let attempts = 0;
    do {
      // Use a mix of small, medium, and large weights for variety
      const r = Math.random();
      if (r < 0.3) w = Math.floor(Math.random() * 15) + 5;        // 5-19 (small)
      else if (r < 0.7) w = Math.floor(Math.random() * 20) + 15;   // 15-34 (medium)
      else w = Math.floor(Math.random() * 25) + 30;                 // 30-54 (large)
      attempts++;
    } while (usedWeights.has(w) && attempts < 20);
    usedWeights.add(w);
    e.weight = w;
  });

  return LayoutManager.applyLayout({ nodes, edges }, 'force', w, h);
}
