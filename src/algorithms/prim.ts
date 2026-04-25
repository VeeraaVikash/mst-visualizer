import type { Graph, AlgorithmStep } from '../types';

export function runPrim(graph: Graph, startId: string, unit = ''): AlgorithmStep[] {
  const steps: AlgorithmStep[] = [];
  const ids = graph.nodes.map(n => n.id);
  const visited = new Set([startId]);
  const mst: string[] = [], rej: string[] = [];
  let cost = 0;
  const u = unit ? ` ${unit}` : '';

  steps.push({ type:'ADD_NODE', nodeId:startId,
    explanation:`Prim's: Starting from "${startId}". Grow the network by always connecting the cheapest reachable unvisited node.`,
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
      explanation:`${frontier.length} crossing edge(s) on the cut frontier. Scanning for minimum: ${frontier.slice(0,3).map(c=>`${c.edge.source}-${c.edge.target}(${c.edge.weight})`).join(', ')}${frontier.length>3?'...':''}`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:candIds, activeNodes:[...visited], costDelta:0 });

    frontier.sort((a, b) => a.edge.weight - b.edge.weight);
    const best = frontier[0];
    const prev = cost;

    steps.push({ type:'CONSIDER_EDGE', edgeId:best.edge.id,
      explanation:`Minimum crossing edge: ${best.edge.source}↔${best.edge.target} (${best.edge.weight}${u}). Cheapest way to expand the network.`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[best.edge.id], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:candIds.filter(id=>id!==best.edge.id), activeNodes:[...visited], costDelta:0 });

    visited.add(best.newNode); mst.push(best.edge.id); cost += best.edge.weight;
    steps.push({ type:'ACCEPT_EDGE', edgeId:best.edge.id, nodeId:best.newNode,
      explanation:`✓ "${best.newNode}" joins via ${best.edge.source}↔${best.edge.target} (+${best.edge.weight}${u}). Total: ${prev} → ${cost}${u}`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[...visited], costDelta:best.edge.weight });
  }

  const total = graph.edges.reduce((s, e) => s + e.weight, 0);
  steps.push({ type:'COMPLETE',
    explanation:`🏆 Prim's complete! ${mst.length} links, cost ${cost}${u}. Saves ${total - cost}${u} vs full mesh (${total}${u}).`,
    mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[...visited], costDelta:0 });
  return steps;
}
