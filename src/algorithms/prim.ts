import type { Graph, AlgorithmStep } from '../types';

export function runPrim(graph: Graph, startNodeId: string): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const nodeIds = graph.nodes.map(n => n.id);

  const visited = new Set<string>();
  const mstEdges: string[] = [];
  const rejectedEdges: string[] = [];
  let mstCost = 0;

  visited.add(startNodeId);

  steps.push({
    type: 'ADD_NODE',
    nodeId: startNodeId,
    explanation: `Prim's Algorithm: Starting from node ${startNodeId}. This node is now in our MST. We will grow the tree by always picking the cheapest edge crossing the cut.`,
    mstCost: 0,
    edgesSelected: 0,
    highlightedEdges: [],
    mstEdges: [],
    rejectedEdges: [],
    candidateEdges: [],
    activeNodes: [startNodeId],
  });

  while (visited.size < nodeIds.length) {
    const candidateEdges: { edge: typeof graph.edges[0]; unvisitedNode: string }[] = [];

    for (const edge of graph.edges) {
      const srcVisited = visited.has(edge.source);
      const tgtVisited = visited.has(edge.target);

      if (srcVisited && !tgtVisited) {
        candidateEdges.push({ edge, unvisitedNode: edge.target });
      } else if (!srcVisited && tgtVisited) {
        candidateEdges.push({ edge, unvisitedNode: edge.source });
      }
    }

    if (candidateEdges.length === 0) break;

    const candidateIds = candidateEdges.map(c => c.edge.id);

    steps.push({
      type: 'HIGHLIGHT_CANDIDATES',
      explanation: `Found ${candidateEdges.length} candidate edge(s) crossing the cut (connecting visited to unvisited nodes). Evaluating to find the minimum weight edge.`,
      mstCost,
      edgesSelected: mstEdges.length,
      highlightedEdges: [],
      mstEdges: [...mstEdges],
      rejectedEdges: [...rejectedEdges],
      candidateEdges: candidateIds,
      activeNodes: [...visited],
    });

    candidateEdges.sort((a, b) => a.edge.weight - b.edge.weight);
    const best = candidateEdges[0];

    steps.push({
      type: 'CONSIDER_EDGE',
      edgeId: best.edge.id,
      explanation: `Considering edge ${best.edge.source} - ${best.edge.target} (weight: ${best.edge.weight}). This is the minimum weight edge crossing the cut.`,
      mstCost,
      edgesSelected: mstEdges.length,
      highlightedEdges: [best.edge.id],
      mstEdges: [...mstEdges],
      rejectedEdges: [...rejectedEdges],
      candidateEdges: candidateIds.filter(id => id !== best.edge.id),
      activeNodes: [...visited],
    });

    visited.add(best.unvisitedNode);
    mstEdges.push(best.edge.id);
    mstCost += best.edge.weight;

    steps.push({
      type: 'ACCEPT_EDGE',
      edgeId: best.edge.id,
      nodeId: best.unvisitedNode,
      explanation: `Accepted! Edge ${best.edge.source} - ${best.edge.target} (weight: ${best.edge.weight}) added to MST. Node ${best.unvisitedNode} is now visited. Total cost: ${mstCost}`,
      mstCost,
      edgesSelected: mstEdges.length,
      highlightedEdges: [],
      mstEdges: [...mstEdges],
      rejectedEdges: [...rejectedEdges],
      candidateEdges: [],
      activeNodes: [...visited],
    });
  }

  steps.push({
    type: 'COMPLETE',
    explanation: `Prim's Algorithm complete! MST has ${mstEdges.length} edges with total cost ${mstCost}. All ${visited.size} nodes are connected.`,
    mstCost,
    edgesSelected: mstEdges.length,
    highlightedEdges: [],
    mstEdges: [...mstEdges],
    rejectedEdges: [...rejectedEdges],
    candidateEdges: [],
    activeNodes: [...visited],
  });

  return steps;
}
