import type { Graph, AlgorithmStep } from '../types';
import { UnionFind } from './unionFind';

export function runKruskal(graph: Graph, unit = ''): AlgorithmStep[] {
  const t0 = performance.now();
  const steps: AlgorithmStep[] = [];
  const ids = graph.nodes.map(n => n.id);
  const sorted = [...graph.edges].sort((a, b) => a.weight - b.weight);
  const uf = new UnionFind(ids);
  const mst: string[] = [], rej: string[] = [];
  let cost = 0;
  const u = unit ? ` ${unit}` : '';

  steps.push({ type:'SORT_EDGES',
    explanation:`**Kruskal's Algorithm** begins by sorting all ${sorted.length} edges from lightest to heaviest. The **Greedy Strategy** ensures we always evaluate the cheapest available connection. Lightest: {${sorted[0]?.source}-${sorted[0]?.target}} ({${sorted[0]?.weight}${u}}).`,
    mstCost:0, edgesSelected:0, highlightedEdges:sorted.map(e=>e.id), mstEdges:[], rejectedEdges:[], candidateEdges:[], activeNodes:[], costDelta:0, ufState:uf.snapshot() });

  for (const e of sorted) {
    if (mst.length >= ids.length - 1) break;
    const prev = cost;
    steps.push({ type:'CONSIDER_EDGE', edgeId:e.id,
      explanation:`Evaluating candidate edge {${e.source}↔${e.target}} (cost: {${e.weight}${u}}). We check our **Union-Find** data structure to see if these nodes are already connected in the same network component.`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[e.id], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[e.source,e.target], costDelta:0, ufState:uf.snapshot() });

    if (uf.connected(e.source, e.target)) {
      rej.push(e.id);
      steps.push({ type:'REJECT_EDGE', edgeId:e.id,
        explanation:`**Rejected**. Nodes {${e.source}} and {${e.target}} already share a component. Adding this link would create a **redundant cycle**, which violates the definition of a tree.`,
        mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[], costDelta:0, ufState:uf.snapshot() });
    } else {
      uf.union(e.source, e.target); mst.push(e.id); cost += e.weight;
      steps.push({ type:'ACCEPT_EDGE', edgeId:e.id,
        explanation:`**Accepted**. This edge safely merges two separate components without forming a cycle. The network cost increases: {${prev}} + {${e.weight}} = {${cost}${u}}.`,
        mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[e.source,e.target], costDelta:e.weight, ufState:uf.snapshot() });
    }
  }

  const total = graph.edges.reduce((s, e) => s + e.weight, 0);
  const timeTakenMs = performance.now() - t0;
  steps.push({ type:'COMPLETE',
    explanation:`**Algorithm Complete!** Kruskal's successfully found the Minimum Spanning Tree. We secured {${mst.length}} links for a total minimum cost of {${cost}${u}}, saving {${total - cost}${u}} over a fully meshed network.`,
    mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:ids, costDelta:0, ufState:uf.snapshot(), timeTakenMs });
  return steps;
}
