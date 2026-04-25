import type { Graph, AlgorithmStep } from '../types';
import { UnionFind } from './unionFind';

export function runKruskal(graph: Graph): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodeIds = graph.nodes.map(n => n.id);
  const sortedEdges = [...graph.edges].sort((a, b) => a.weight - b.weight);
  const uf = new UnionFind(nodeIds);

  const mstEdges: string[] = [];
  const rejectedEdges: string[] = [];
  let mstCost = 0;
  const targetEdges = nodeIds.length - 1;

  steps.push({
    type: 'SORT_EDGES',
    explanation: `Kruskal's Algorithm: Sort all ${sortedEdges.length} edges by weight in ascending order. We will greedily pick the lightest edge that doesn't form a cycle.`,
    mstCost: 0,
    edgesSelected: 0,
    highlightedEdges: sortedEdges.map(e => e.id),
    mstEdges: [],
    rejectedEdges: [],
    candidateEdges: [],
    activeNodes: [],
  });

  for (const edge of sortedEdges) {
    if (mstEdges.length >= targetEdges) break;

    steps.push({
      type: 'CONSIDER_EDGE',
      edgeId: edge.id,
      explanation: `Considering edge ${edge.source} - ${edge.target} (weight: ${edge.weight}). Checking Union-Find: Are ${edge.source} and ${edge.target} in the same component?`,
      mstCost,
      edgesSelected: mstEdges.length,
      highlightedEdges: [edge.id],
      mstEdges: [...mstEdges],
      rejectedEdges: [...rejectedEdges],
      candidateEdges: [],
      activeNodes: [edge.source, edge.target],
    });

    if (uf.connected(edge.source, edge.target)) {
      rejectedEdges.push(edge.id);
      steps.push({
        type: 'REJECT_EDGE',
        edgeId: edge.id,
        explanation: `Rejected! ${edge.source} and ${edge.target} are already in the same component. Adding this edge would create a cycle.`,
        mstCost,
        edgesSelected: mstEdges.length,
        highlightedEdges: [],
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        candidateEdges: [],
        activeNodes: [],
      });
    } else {
      uf.union(edge.source, edge.target);
      mstEdges.push(edge.id);
      mstCost += edge.weight;
      steps.push({
        type: 'ACCEPT_EDGE',
        edgeId: edge.id,
        explanation: `Accepted! ${edge.source} and ${edge.target} are in different components. Edge added to MST. Cost: ${mstCost - edge.weight} + ${edge.weight} = ${mstCost}`,
        mstCost,
        edgesSelected: mstEdges.length,
        highlightedEdges: [],
        mstEdges: [...mstEdges],
        rejectedEdges: [...rejectedEdges],
        candidateEdges: [],
        activeNodes: [edge.source, edge.target],
      });
    }
  }

  steps.push({
    type: 'COMPLETE',
    explanation: `Kruskal's Algorithm complete! MST has ${mstEdges.length} edges with total cost ${mstCost}. The minimum spanning tree connects all ${nodeIds.length} nodes.`,
    mstCost,
    edgesSelected: mstEdges.length,
    highlightedEdges: [],
    mstEdges: [...mstEdges],
    rejectedEdges: [...rejectedEdges],
    candidateEdges: [],
    activeNodes: nodeIds,
  });

  return steps;
}
