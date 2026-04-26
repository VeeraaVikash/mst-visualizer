import React, { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import { ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import type { Graph, AlgorithmStep, CanvasMode } from '../../types';

type GNode = Graph['nodes'][number];
type GEdge = Graph['edges'][number];

interface Props {
  graph: Graph; step: AlgorithmStep | null; canvasMode: CanvasMode;
  deleteMode: boolean; connectSource: string | null;
  onBgClick: (x: number, y: number) => void;
  onNodeClick: (id: string) => void;
  onNodeDrag: (id: string, x: number, y: number) => void;
  onEdgeAction: (edge: GEdge, action: 'edit' | 'delete') => void;
  isComplete: boolean;
  scenario?: string;
  autoFit?: boolean;
}

// --- Node radius calculation based on label length ---
function getNodeRadius(label: string): number {
  const base = 22;
  const extra = Math.max(0, label.length - 2) * 4;
  return Math.min(base + extra, 42);
}

// --- Scenario-specific accent color for node borders ---
function getScenarioAccent(scenario: string): string {
  switch (scenario) {
    case 'telecom': return 'rgba(72, 187, 120, 0.5)';
    case 'power': return 'rgba(246, 173, 85, 0.5)';
    case 'roads': return 'rgba(99, 179, 237, 0.5)';
    case 'datacenter': return 'rgba(252, 129, 129, 0.5)';
    default: return 'rgba(72, 187, 120, 0.5)';
  }
}

function getScenarioGlow(scenario: string): string {
  switch (scenario) {
    case 'telecom': return 'rgba(72, 187, 120, 0.15)';
    case 'power': return 'rgba(246, 173, 85, 0.15)';
    case 'roads': return 'rgba(99, 179, 237, 0.15)';
    case 'datacenter': return 'rgba(252, 129, 129, 0.15)';
    default: return 'rgba(72, 187, 120, 0.15)';
  }
}

export default function GraphCanvas({ graph, step, canvasMode, deleteMode, connectSource, onBgClick, onNodeClick, onNodeDrag, onEdgeAction, isComplete, scenario, autoFit }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mainGRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomBehavior = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const render = useCallback(() => {
    if (!svgRef.current || !mainGRef.current) return;
    const g = d3.select(mainGRef.current);
    const sc = scenario || 'telecom';
    const accentColor = getScenarioAccent(sc);
    const glowColor = getScenarioGlow(sc);

    // O(1) node lookup map
    const nodeMap = new Map(graph.nodes.map(n => [n.id, n]));

    // We need containers to enforce z-index
    // Bottom: Edge lines
    let edgeLinesG = g.select<SVGGElement>('.gf-edge-lines');
    if (edgeLinesG.empty()) edgeLinesG = g.append('g').attr('class', 'gf-edge-lines');
    
    // Middle: Edge labels (weights)
    let edgeLabelsG = g.select<SVGGElement>('.gf-edge-labels');
    if (edgeLabelsG.empty()) edgeLabelsG = g.append('g').attr('class', 'gf-edge-labels');
    
    // Top: Nodes
    let nodesG = g.select<SVGGElement>('.gf-nodes');
    if (nodesG.empty()) nodesG = g.append('g').attr('class', 'gf-nodes');

    // ============================================================
    // EDGES (Lines)
    // ============================================================
    const edgeGroups = edgeLinesG.selectAll<SVGGElement, GEdge>('.gf-edge')
      .data(graph.edges, d => d.id)
      .join(
        enter => {
          const grp = enter.append('g').attr('class', 'gf-edge');
          grp.append('path').attr('class', 'gf-eline').attr('fill', 'none');
          return grp;
        },
        update => update,
        exit => exit.remove()
      );

    // ============================================================
    // EDGE LABELS (Weights)
    // ============================================================
    const edgeLabelGroups = edgeLabelsG.selectAll<SVGGElement, GEdge>('.gf-edge-label-grp')
      .data(graph.edges, d => d.id)
      .join(
        enter => {
          const grp = enter.append('g').attr('class', 'gf-edge-label-grp');
          grp.append('rect').attr('class', 'gf-ebg');
          grp.append('text').attr('class', 'gf-ewt');
          return grp;
        },
        update => update,
        exit => exit.remove()
      );

    // Detect parallel edges
    const pairCount: Record<string, number> = {};
    const pairIndex: Record<string, number> = {};
    graph.edges.forEach(e => {
      const key = [e.source, e.target].sort().join('::');
      pairCount[key] = (pairCount[key] || 0) + 1;
    });
    const pairCursor: Record<string, number> = {};
    graph.edges.forEach(e => {
      const key = [e.source, e.target].sort().join('::');
      pairCursor[key] = (pairCursor[key] || 0);
      pairIndex[e.id] = pairCursor[key]++;
    });

    // Pre-compute step lookup sets for O(1) membership tests
    const mstEdgeSet = step ? new Set(step.mstEdges) : null;
    const rejectedEdgeSet = step ? new Set(step.rejectedEdges) : null;
    const candidateEdgeSet = step ? new Set(step.candidateEdges) : null;
    const highlightedEdgeSet = step ? new Set(step.highlightedEdges) : null;
    const activeNodeSet = step ? new Set(step.activeNodes) : null;

    edgeGroups.each(function(d) {
      const grp = d3.select(this);
      const s = nodeMap.get(d.source);
      const t = nodeMap.get(d.target);
      if (!s || !t) return;

      let state = 'default';
      if (step) {
        if (mstEdgeSet!.has(d.id)) state = 'accepted';
        else if (rejectedEdgeSet!.has(d.id)) state = 'rejected';
        else if (candidateEdgeSet!.has(d.id)) state = 'candidate';
        else if (highlightedEdgeSet!.has(d.id)) state = 'considering';
      }

      const stMap: Record<string, [string, number, string, string]> = {
        default: ['var(--accent-default)', 1.5, 'none', 'none'],
        considering: ['var(--accent-active)', 2.5, 'drop-shadow(0 0 6px var(--accent-active))', 'none'],
        accepted: ['var(--accent-accept)', 3, `drop-shadow(0 0 ${isComplete ? 14 : 8}px var(--glow-accept))`, 'none'],
        rejected: ['var(--accent-reject)', 1.5, 'drop-shadow(0 0 3px var(--accent-reject))', 'none'],
        candidate: ['var(--accent-candidate)', 1.5, 'none', '6 4'],
      };
      const [stroke, sw, flt, da] = stMap[state] ?? stMap.default;

      const path = grp.select<SVGPathElement>('.gf-eline');

      // Shorten edges so they don't enter node circles
      const sR = getNodeRadius(s.id);
      const tR = getNodeRadius(t.id);
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const sx = s.x + ux * sR;
      const sy = s.y + uy * sR;
      const tx = t.x - ux * tR;
      const ty = t.y - uy * tR;

      // Parallel edge curvature
      const pairKey = [d.source, d.target].sort().join('::');
      const count = pairCount[pairKey] || 1;
      const idx = pairIndex[d.id] || 0;

      let labelX: number, labelY: number;

      if (count > 1) {
        const offset = (idx - (count - 1) / 2) * 0.2;
        const midX = (sx + tx) / 2 - (ty - sy) * offset;
        const midY = (sy + ty) / 2 + (tx - sx) * offset;
        path.attr('d', `M${sx},${sy} Q${midX},${midY} ${tx},${ty}`);
        labelX = 0.25 * sx + 0.5 * midX + 0.25 * tx;
        labelY = 0.25 * sy + 0.5 * midY + 0.25 * ty;
      } else {
        path.attr('d', `M${sx},${sy} L${tx},${ty}`);
        labelX = (sx + tx) / 2;
        labelY = (sy + ty) / 2;
      }

      path.transition().duration(250)
        .attr('stroke', stroke).attr('stroke-width', sw)
        .attr('filter', flt).attr('stroke-dasharray', da)
        .attr('stroke-linecap', 'round');

      if (state === 'candidate' || state === 'accepted') path.classed('edge-animated', true);
      else path.classed('edge-animated', false);
    });

    // Process edge labels separately
    edgeLabelGroups.each(function(d) {
      const grp = d3.select(this);
      const s = nodeMap.get(d.source);
      const t = nodeMap.get(d.target);
      if (!s || !t) return;

      let state = 'default';
      if (step) {
        if (mstEdgeSet!.has(d.id)) state = 'accepted';
        else if (rejectedEdgeSet!.has(d.id)) state = 'rejected';
        else if (candidateEdgeSet!.has(d.id)) state = 'candidate';
        else if (highlightedEdgeSet!.has(d.id)) state = 'considering';
      }

      const stMap: Record<string, [string, number, string, string]> = {
        default: ['var(--accent-default)', 1.5, 'none', 'none'],
        considering: ['var(--accent-active)', 2.5, 'drop-shadow(0 0 6px var(--accent-active))', 'none'],
        accepted: ['var(--accent-accept)', 3, `drop-shadow(0 0 ${isComplete ? 14 : 8}px var(--glow-accept))`, 'none'],
        rejected: ['var(--accent-reject)', 1.5, 'drop-shadow(0 0 3px var(--accent-reject))', 'none'],
        candidate: ['var(--accent-candidate)', 1.5, 'none', '6 4'],
      };
      const [stroke] = stMap[state] ?? stMap.default;

      const sR = getNodeRadius(s.id);
      const tR = getNodeRadius(t.id);
      const dx = t.x - s.x;
      const dy = t.y - s.y;
      const dist = Math.sqrt(dx * dx + dy * dy) || 1;
      const ux = dx / dist;
      const uy = dy / dist;
      const sx = s.x + ux * sR;
      const sy = s.y + uy * sR;
      const tx = t.x - ux * tR;
      const ty = t.y - uy * tR;

      const pairKey = [d.source, d.target].sort().join('::');
      const count = pairCount[pairKey] || 1;
      const idx = pairIndex[d.id] || 0;

      let labelX: number, labelY: number;

      if (count > 1) {
        const offset = (idx - (count - 1) / 2) * 0.2;
        const midX = (sx + tx) / 2 - (ty - sy) * offset;
        const midY = (sy + ty) / 2 + (tx - sx) * offset;
        labelX = 0.25 * sx + 0.5 * midX + 0.25 * tx;
        labelY = 0.25 * sy + 0.5 * midY + 0.25 * ty;
      } else {
        labelX = (sx + tx) / 2;
        labelY = (sy + ty) / 2;
        
        // Smart offset for short edges so labels don't cover nodes
        const tw = String(d.weight).length * 7 + 12;
        const visibleLength = dist - sR - tR;
        if (visibleLength < tw + 10) {
          // Push perpendicularly off the line
          const pushAmount = 24;
          labelX += -uy * pushAmount;
          labelY += ux * pushAmount;
        }
      }

      // Weight badge
      const tw = String(d.weight).length * 7 + 12;
      grp.select('.gf-ebg')
        .attr('x', labelX - tw / 2).attr('y', labelY - 9).attr('width', tw).attr('height', 18)
        .attr('rx', 4).attr('fill', 'var(--bg-base)') // Use pure background to block edge
        .attr('stroke', 'var(--border)').attr('stroke-width', 0.5)
        .attr('opacity', 1)
        .style('cursor', deleteMode ? 'crosshair' : 'pointer');
      
      grp.select('.gf-ewt')
        .attr('x', labelX).attr('y', labelY + 4).attr('text-anchor', 'middle')
        .attr('font-family', "'JetBrains Mono', monospace").attr('font-size', 10).attr('font-weight', 600)
        .attr('fill', state !== 'default' ? stroke : 'var(--text-secondary)')
        .attr('pointer-events', 'none')
        .text(d.weight);

      grp.select('.gf-ebg')
        .on('click', (ev: Event) => { ev.stopPropagation(); if (deleteMode) onEdgeAction(d, 'delete'); })
        .on('dblclick', (ev: Event) => { ev.stopPropagation(); if (!deleteMode) onEdgeAction(d, 'edit'); });
    });

    // ============================================================
    // NODES — Pure SVG (circle + text), no foreignObject
    // ============================================================
    const nodeGroups = nodesG.selectAll<SVGGElement, GNode>('.gf-node')
      .data(graph.nodes, d => d.id)
      .join(
        enter => {
          const grp = enter.append('g').attr('class', 'gf-node').style('cursor', 'pointer');
          // Outer glow circle (for active/accepted state)
          grp.append('circle').attr('class', 'gf-nglow')
            .attr('r', 0).attr('fill', 'none')
            .attr('stroke', 'none').attr('stroke-width', 0)
            .style('pointer-events', 'none');
          // Main circle
          grp.append('circle').attr('class', 'gf-ncircle');
          // Label text
          grp.append('text').attr('class', 'gf-nlabel')
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .attr('font-family', "'JetBrains Mono', monospace")
            .attr('font-weight', 700)
            .attr('pointer-events', 'none');
          return grp;
        },
        update => update,
        exit => exit.remove()
      );

    nodeGroups.each(function(d) {
      const grp = d3.select(this);
      const isActive = activeNodeSet?.has(d.id) ?? false;
      const isSrc = connectSource === d.id;
      const r = getNodeRadius(d.id);
      const fontSize = d.id.length > 4 ? 9 : d.id.length > 2 ? 10 : 12;

      grp.attr('transform', `translate(${d.x},${d.y})`);

      // Determine node visual state
      let fillColor = 'var(--bg-elevated)';
      let strokeColor = accentColor;
      let strokeW = 1.5;
      let glowR = 0;
      let glowStroke = 'none';
      let glowOpacity = 0;

      if (deleteMode) {
        strokeColor = 'var(--accent-reject)';
        strokeW = 2;
        grp.style('cursor', 'crosshair');
      } else if (isSrc) {
        strokeColor = 'var(--accent-active)';
        strokeW = 2.5;
        glowR = r + 6;
        glowStroke = 'var(--accent-active)';
        glowOpacity = 0.4;
        grp.style('cursor', 'cell');
      } else if (isActive) {
        fillColor = glowColor;
        strokeColor = 'var(--accent-accept)';
        strokeW = 2.5;
        glowR = r + 8;
        glowStroke = 'var(--accent-accept)';
        glowOpacity = isComplete ? 0.6 : 0.3;
        grp.style('cursor', 'pointer');
      } else {
        grp.style('cursor', deleteMode ? 'crosshair' : connectSource ? 'cell' : 'pointer');
      }

      // Main circle
      grp.select('.gf-ncircle')
        .attr('r', r)
        .attr('fill', fillColor)
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeW);

      // Glow circle
      const glow = grp.select('.gf-nglow');
      glow
        .attr('r', glowR)
        .attr('stroke', glowStroke)
        .attr('stroke-width', glowR > 0 ? 1.5 : 0)
        .attr('opacity', glowOpacity)
        .attr('fill', 'none');

      // Pulse animation class
      if (isActive && !isComplete) {
        glow.classed('pulse', true);
      } else {
        glow.classed('pulse', false);
      }

      // Label
      grp.select('.gf-nlabel')
        .attr('font-size', fontSize)
        .attr('fill', 'var(--text-primary)')
        .text(d.id);

      // Click handler
      grp.on('click', (ev: Event) => { ev.stopPropagation(); onNodeClick(d.id); });
    });

    // Drag (select mode only)
    const drag = d3.drag<SVGGElement, GNode>()
      .on('start', function() { d3.select(this).raise(); })
      .on('drag', function(ev, d) {
        const el = containerRef.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const x = Math.max(30, Math.min(r.width - 30, ev.x));
        const y = Math.max(30, Math.min(r.height - 30, ev.y));
        d3.select(this).attr('transform', `translate(${x},${y})`);
        onNodeDrag(d.id, x, y);
      });

    if (canvasMode === 'select' && !deleteMode) {
      nodeGroups.call(drag);
    } else {
      nodeGroups.on('.drag', null);
    }
  }, [graph, step, canvasMode, deleteMode, connectSource, isComplete, scenario, onNodeClick, onNodeDrag, onEdgeAction]);

  // Setup zoom + bg click (once)
  useEffect(() => {
    if (!svgRef.current || !mainGRef.current) return;
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.25, 4])
      .on('zoom', ev => { d3.select(mainGRef.current!).attr('transform', ev.transform.toString()); });
    zoomBehavior.current = zoom;
    d3.select(svgRef.current).call(zoom);
    d3.select(svgRef.current).on('click', function(ev: Event) {
      const target = ev.target as SVGElement;
      if (target === svgRef.current || target.classList.contains('gf-bg')) {
        const [x, y] = d3.pointer(ev as MouseEvent, mainGRef.current!);
        onBgClick(x, y);
      }
    });
  }, [onBgClick]);

  // Resize observer
  useEffect(() => {
    const obs = new ResizeObserver(() => {
      if (!svgRef.current || !containerRef.current) return;
      const r = containerRef.current.getBoundingClientRect();
      d3.select(svgRef.current).attr('width', r.width).attr('height', r.height).attr('viewBox', `0 0 ${r.width} ${r.height}`);
    });
    if (containerRef.current) obs.observe(containerRef.current);
    return () => obs.disconnect();
  }, []);

  useEffect(() => { render(); }, [render]);

  const fitView = useCallback(() => {
    if (!zoomBehavior.current || !svgRef.current || !containerRef.current || !graph.nodes.length) return;
    const r = containerRef.current.getBoundingClientRect();
    const xs = graph.nodes.map(n => n.x), ys = graph.nodes.map(n => n.y);
    const maxR = Math.max(...graph.nodes.map(n => getNodeRadius(n.id)));
    const x0 = Math.min(...xs) - maxR - 40, x1 = Math.max(...xs) + maxR + 40;
    const y0 = Math.min(...ys) - maxR - 40, y1 = Math.max(...ys) + maxR + 40;
    const sc = Math.min(r.width / (x1 - x0), r.height / (y1 - y0), 2) * 0.85;
    const tx = r.width / 2 - sc * (x0 + x1) / 2, ty = r.height / 2 - sc * (y0 + y1) / 2;
    d3.select(svgRef.current).transition().duration(400)
      .call(zoomBehavior.current.transform, d3.zoomIdentity.translate(tx, ty).scale(sc));
  }, [graph.nodes]);

  // Auto-fit on mount or when graph changes (for race mode canvases)
  const hasFitted = useRef(false);
  useEffect(() => {
    if (autoFit && graph.nodes.length > 0 && zoomBehavior.current && svgRef.current && containerRef.current) {
      // Small delay to allow SVG dimensions to settle
      const timer = setTimeout(() => fitView(), hasFitted.current ? 50 : 200);
      hasFitted.current = true;
      return () => clearTimeout(timer);
    }
  }, [autoFit, graph.nodes, fitView]);

  const zoomBy = useCallback((factor: number) => {
    if (!zoomBehavior.current || !svgRef.current) return;
    d3.select(svgRef.current).transition().duration(300).call(zoomBehavior.current.scaleBy, factor);
  }, []);

  const modeLabel = deleteMode ? 'Click node or edge to delete' :
    canvasMode === 'addNode' ? 'Click canvas to add node' :
    canvasMode === 'connectEdge' ? (connectSource ? `From "${connectSource}" → click target` : 'Click source node') : '';

  return (
    <div ref={containerRef} className="dot-grid" style={{ width: '100%', height: '100%', position: 'relative' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }}>
        <defs>
          {/* Glow filter for accepted edges */}
          <filter id="glow-accept" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        <rect className="gf-bg" width="100%" height="100%" fill="transparent" />
        <g ref={mainGRef} />
      </svg>

      {modeLabel && (
        <div style={{ position: 'absolute', top: 10, left: '50%', transform: 'translateX(-50%)',
          fontFamily: "'JetBrains Mono', monospace", fontSize: 11, padding: '4px 14px', borderRadius: 20,
          background: 'var(--bg-elevated)', border: `1px solid ${deleteMode ? 'var(--accent-reject)' : 'var(--accent-active)'}`,
          color: deleteMode ? 'var(--accent-reject)' : 'var(--accent-active)', pointerEvents: 'none' }}>
          {modeLabel}
        </div>
      )}

      <div style={{ position: 'absolute', bottom: 12, right: 12, display: 'flex', gap: 5 }}>
        {([
          { I: ZoomIn, f: () => zoomBy(1.3), t: 'Zoom in' },
          { I: ZoomOut, f: () => zoomBy(0.77), t: 'Zoom out' },
          { I: Maximize2, f: fitView, t: 'Fit view [Z]' },
        ] as const).map(({ I, f, t }) => (
          <button key={t} title={t} onClick={f}
            style={{ width: 28, height: 28, borderRadius: 7, display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
            <I size={13} />
          </button>
        ))}
      </div>
    </div>
  );
}
