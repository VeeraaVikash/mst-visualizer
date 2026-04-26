import Graph from 'graphology';
import { circular } from 'graphology-layout';
import forceAtlas2 from 'graphology-layout-forceatlas2';
import noverlap from 'graphology-layout-noverlap';
import type { Graph as AppGraph, GraphNode, GraphEdge } from '../types';

export type LayoutType = 'force' | 'hierarchical' | 'geographic';

export class LayoutManager {
  static applyLayout(graph: AppGraph, type: LayoutType, width: number, height: number): AppGraph {
    if (graph.nodes.length === 0) return graph;

    const nodes = graph.nodes.map(n => ({ ...n }));
    const edges = graph.edges.map(e => ({ ...e }));

    // We rely on autoFit to scale the final view appropriately.
    // We use a moderately expanded coordinate space (1.3x) to give some breathing room,
    // combined with smart label offsetting in GraphCanvas for any remaining tight edges.
    const virtualWidth = Math.max(width * 1.3, 1200);
    const virtualHeight = Math.max(height * 1.3, 1000);
    const padding = 100;

    if (type === 'force') {
      this.runForceAtlas2Layout(nodes, edges, virtualWidth, virtualHeight, padding);
    } else if (type === 'hierarchical') {
      this.runHierarchicalLayout(nodes, edges, virtualWidth, virtualHeight, padding);
      this.runNoverlapPass(nodes, virtualWidth, virtualHeight, padding);
    } else if (type === 'geographic') {
      this.runGeographicLayout(nodes, virtualWidth, virtualHeight, padding);
      this.runNoverlapPass(nodes, virtualWidth, virtualHeight, padding);
    }

    return { nodes, edges: graph.edges };
  }

  /**
   * Shared noverlap pass: push apart any nodes that are too close.
   * Runs graphology-noverlap on already-positioned nodes, then re-fits to canvas.
   */
  private static runNoverlapPass(nodes: GraphNode[], width: number, height: number, padding: number) {
    const V = nodes.length;
    if (V < 2) return;

    const g = new Graph();
    nodes.forEach(n => {
      const baseR = 22;
      const extra = Math.max(0, n.id.length - 2) * 4;
      const r = Math.min(baseR + extra, 42);
      g.addNode(n.id, { x: n.x, y: n.y, size: r });
    });

    noverlap.assign(g, {
      maxIterations: 200,
      settings: {
        margin: Math.max(60, 180 / Math.sqrt(V)),
        ratio: 2,
        speed: 2,
        gridSize: Math.max(8, Math.ceil(Math.sqrt(V) * 2)),
      },
    });

    // Re-fit to canvas after noverlap may have pushed nodes outward
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    g.forEachNode((_key, attrs) => {
      if (attrs.x < minX) minX = attrs.x;
      if (attrs.x > maxX) maxX = attrs.x;
      if (attrs.y < minY) minY = attrs.y;
      if (attrs.y > maxY) maxY = attrs.y;
    });

    const cx = width / 2, cy = height / 2;
    const centerX = (minX + maxX) / 2, centerY = (minY + maxY) / 2;

    nodes.forEach(n => {
      const attrs = g.getNodeAttributes(n.id);
      n.x = cx + (attrs.x - centerX);
      n.y = cy + (attrs.y - centerY);
    });
  }

  /**
   * Production-grade layout using graphology + ForceAtlas2 + Noverlap.
   *
   * ForceAtlas2 (from Gephi) is the gold-standard force-directed algorithm:
   *  - Continuous layout with linear-linear repulsion model
   *  - Barnes-Hut optimization for O(n log n) performance
   *  - Produces more readable, evenly-spaced layouts than d3-force
   *
   * Noverlap removes any remaining node overlaps after FA2 converges.
   */
  private static runForceAtlas2Layout(
    nodes: GraphNode[],
    edges: GraphEdge[],
    width: number,
    height: number,
    padding: number
  ) {
    const V = nodes.length;
    const E = edges.length;

    // --- Build a graphology instance ---
    const g = new Graph();

    nodes.forEach(n => {
      g.addNode(n.id, { x: 0, y: 0, size: 1 });
    });

    edges.forEach(e => {
      // graphology doesn't allow duplicate edges, guard against it
      if (!g.hasEdge(e.source, e.target) && !g.hasEdge(e.target, e.source)) {
        g.addEdge(e.source, e.target, { weight: e.weight });
      }
    });

    // --- Initialize with circular layout (much better than random for FA2) ---
    circular.assign(g, { scale: Math.min(width, height) * 0.3 });

    // --- Run ForceAtlas2 ---
    // Adaptive settings based on graph size
    const iterations = Math.max(200, V * 20);
    const scalingRatio = Math.max(4, V * 0.8);
    const gravity = Math.max(0.3, 8 / V);

    forceAtlas2.assign(g, {
      iterations,
      settings: {
        gravity,
        scalingRatio,
        barnesHutOptimize: V > 10,
        barnesHutTheta: 0.5,
        strongGravityMode: false,
        slowDown: 1 + Math.log2(V),
        linLogMode: false, // linear model for undirected graphs
        outboundAttractionDistribution: false,
        adjustSizes: true,
        edgeWeightInfluence: 0, // ignore weight for layout (visual only)
      },
    });

    // --- Set node sizes based on label length (for noverlap awareness) ---
    g.forEachNode((key) => {
      const baseR = 22;
      const extra = Math.max(0, key.length - 2) * 4;
      const r = Math.min(baseR + extra, 42);
      g.setNodeAttribute(key, 'size', r);
    });

    // --- Run Noverlap to remove any remaining overlaps ---
    noverlap.assign(g, {
      maxIterations: 150,
      settings: {
        margin: Math.max(50, 150 / Math.sqrt(V)), // generous margin for clean spacing
        ratio: 1.5,
        speed: 2,
        gridSize: Math.max(8, Math.ceil(Math.sqrt(V) * 1.5)),
      },
    });

    // --- Extract positions and fit to canvas ---
    let minX = Infinity, maxX = -Infinity;
    let minY = Infinity, maxY = -Infinity;

    g.forEachNode((key, attrs) => {
      if (attrs.x < minX) minX = attrs.x;
      if (attrs.x > maxX) maxX = attrs.x;
      if (attrs.y < minY) minY = attrs.y;
      if (attrs.y > maxY) maxY = attrs.y;
    });

    const cx = width / 2;
    const cy = height / 2;
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;

    nodes.forEach(n => {
      const attrs = g.getNodeAttributes(n.id);
      n.x = cx + (attrs.x - centerX);
      n.y = cy + (attrs.y - centerY);
    });
  }

  private static runHierarchicalLayout(nodes: GraphNode[], edges: GraphEdge[], width: number, height: number, padding: number) {
    // Simple layered layout based on naming convention
    const levels: Record<string, number> = {};
    nodes.forEach(n => {
      if (n.id.includes('SPINE')) levels[n.id] = 0;
      else if (n.id.includes('LEAF')) levels[n.id] = 1;
      else if (n.id.includes('RACK') || n.id.includes('SERVER')) levels[n.id] = 2;
      else levels[n.id] = 1;
    });

    const levelGroups: Record<number, GraphNode[]> = {};
    nodes.forEach(n => {
      const l = levels[n.id] ?? 1;
      if (!levelGroups[l]) levelGroups[l] = [];
      levelGroups[l].push(n);
    });

    const activeLevels = Object.keys(levelGroups).map(Number).sort();
    const yStep = (height - 2 * padding) / Math.max(1, activeLevels.length - 1);

    activeLevels.forEach((l, lIdx) => {
      const group = levelGroups[l];
      const xStep = (width - 2 * padding) / Math.max(1, group.length - 1);

      group.forEach((n, i) => {
        const nodeIndex = nodes.findIndex(x => x.id === n.id);
        if (group.length === 1) {
          nodes[nodeIndex].x = width / 2;
        } else {
          nodes[nodeIndex].x = padding + i * xStep;
        }
        nodes[nodeIndex].y = padding + lIdx * yStep;
      });
    });
  }

  private static runGeographicLayout(nodes: GraphNode[], width: number, height: number, padding: number) {
    let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
    nodes.forEach(n => {
      if (n.x < minX) minX = n.x;
      if (n.x > maxX) maxX = n.x;
      if (n.y < minY) minY = n.y;
      if (n.y > maxY) maxY = n.y;
    });

    const rangeX = Math.max(1, maxX - minX);
    const rangeY = Math.max(1, maxY - minY);

    nodes.forEach(n => {
      const normX = (n.x - minX) / rangeX;
      const normY = (n.y - minY) / rangeY;

      nodes.find(x => x.id === n.id)!.x = padding + normX * (width - 2 * padding);
      nodes.find(x => x.id === n.id)!.y = padding + normY * (height - 2 * padding);
    });
  }
}
