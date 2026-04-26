import type { Graph, AlgorithmStep } from '../types';

export function runPrim(graph: Graph, startId: string, unit = ''): AlgorithmStep[] {
  const t0 = performance.now();
  const steps: AlgorithmStep[] = [];
  const ids = graph.nodes.map(n => n.id);
  const visited = new Set([startId]);
  const mst: string[] = [], rej: string[] = [];
  let cost = 0;
  const u = unit ? ` ${unit}` : '';

  steps.push({ type:'ADD_NODE', nodeId:startId,
    explanation:`**Prim's Algorithm** starts by seeding the network at node {${startId}}. We will continuously grow the network by attaching the cheapest reachable unvisited node.`,
    mstCost:0, edgesSelected:0, highlightedEdges:[], mstEdges:[], rejectedEdges:[], candidateEdges:[], activeNodes:[startId], costDelta:0 });

  while (visited.size < ids.length) {
    const frontier: Array<{edge: typeof graph.edges[0]; newNode: string}> = [];
    for (const e of graph.edges) {
      const sv = visited.has(e.source), tv = visited.has(e.target);
      if (sv && !tv) frontier.push({ edge: e, newNode: e.target });
      else if (!sv && tv) frontier.push({ edge: e, newNode: e.source });
    }
    if (!frontier.length) break;

    const candIds = frontier.map(c => c.edge.id);
    steps.push({ type:'HIGHLIGHT_CANDIDATES',
      explanation:`Scanning {${frontier.length}} crossing edge(s) on the cut frontier. These are the available links connecting our growing network to the unvisited nodes.`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:candIds, activeNodes:[...visited], costDelta:0 });

    frontier.sort((a, b) => a.edge.weight - b.edge.weight);
    const best = frontier[0];
    const prev = cost;

    steps.push({ type:'CONSIDER_EDGE', edgeId:best.edge.id,
      explanation:`The minimum crossing edge is {${best.edge.source}↔${best.edge.target}} (cost: {${best.edge.weight}${u}}). This provides the cheapest possible expansion of our network tree.`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[best.edge.id], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:candIds.filter(id=>id!==best.edge.id), activeNodes:[...visited], costDelta:0 });

    visited.add(best.newNode); mst.push(best.edge.id); cost += best.edge.weight;
    steps.push({ type:'ACCEPT_EDGE', edgeId:best.edge.id, nodeId:best.newNode,
      explanation:`**Accepted**. Node {${best.newNode}} joins the network via {${best.edge.source}↔${best.edge.target}}. The total network cost increases by {${best.edge.weight}${u}} to {${cost}${u}}.`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[...visited], costDelta:best.edge.weight });
  }

  const total = graph.edges.reduce((s, e) => s + e.weight, 0);
  const timeTakenMs = performance.now() - t0;
  steps.push({ type:'COMPLETE',
    explanation:`**Algorithm Complete!** Prim's successfully found the Minimum Spanning Tree. We secured {${mst.length}} links for a total minimum cost of {${cost}${u}}, saving {${total - cost}${u}} over a fully meshed network.`,
    mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[...visited], costDelta:0, timeTakenMs });
  return steps;
}
