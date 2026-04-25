import type { Graph, AlgorithmStep } from '../types';
import { UnionFind } from './unionFind';

export function runKruskal(graph: Graph, unit = ''): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const ids = graph.nodes.map(n => n.id);
  const sorted = [...graph.edges].sort((a, b) => a.weight - b.weight);
  const uf = new UnionFind(ids);
  const mst: string[] = [], rej: string[] = [];
  let cost = 0;
  const u = unit ? ` ${unit}` : '';

  steps.push({ type:'SORT_EDGES',
    explanation:`Sorting ${sorted.length} edges by weight. Greedy strategy: always pick the cheapest edge that doesn't create a loop. Lightest: ${sorted[0]?.source}-${sorted[0]?.target} (${sorted[0]?.weight}${u}).`,
    mstCost:0, edgesSelected:0, highlightedEdges:sorted.map(e=>e.id), mstEdges:[], rejectedEdges:[], candidateEdges:[], activeNodes:[], costDelta:0, ufState:uf.snapshot() });

  for (const e of sorted) {
    if (mst.length >= ids.length - 1) break;
    const prev = cost;
    steps.push({ type:'CONSIDER_EDGE', edgeId:e.id,
      explanation:`Evaluating ${e.source}↔${e.target} (cost: ${e.weight}${u}). Union-Find: are they already connected?`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[e.id], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[e.source,e.target], costDelta:0, ufState:uf.snapshot() });

    if (uf.connected(e.source, e.target)) {
      rej.push(e.id);
      steps.push({ type:'REJECT_EDGE', edgeId:e.id,
        explanation:`✗ Rejected. ${e.source} and ${e.target} share a component — this link would create a redundant loop.`,
        mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[], costDelta:0, ufState:uf.snapshot() });
    } else {
      uf.union(e.source, e.target); mst.push(e.id); cost += e.weight;
      steps.push({ type:'ACCEPT_EDGE', edgeId:e.id,
        explanation:`✓ Accepted. Different components merged. Network cost: ${prev} + ${e.weight} = ${cost}${u}`,
        mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[e.source,e.target], costDelta:e.weight, ufState:uf.snapshot() });
    }
  }

  const total = graph.edges.reduce((s, e) => s + e.weight, 0);
  steps.push({ type:'COMPLETE',
    explanation:`🏆 Kruskal's complete! ${mst.length} links, cost ${cost}${u}. Saves ${total - cost}${u} vs full mesh (${total}${u}).`,
    mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:ids, costDelta:0, ufState:uf.snapshot() });
  return steps;
}
