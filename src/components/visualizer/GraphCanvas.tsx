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
}

export default function GraphCanvas({ graph, step, canvasMode, deleteMode, connectSource, onBgClick, onNodeClick, onNodeDrag, onEdgeAction, isComplete, scenario }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mainGRef = useRef<SVGGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomBehavior = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);

  const render = useCallback(() => {
    if (!svgRef.current || !mainGRef.current) return;
    const g = d3.select(mainGRef.current);

    // EDGES
    const edgeGroups = g.selectAll<SVGGElement, GEdge>('.gf-edge')
      .data(graph.edges, d => d.id)
      .join(
        enter => {
          const grp = enter.append('g').attr('class', 'gf-edge');
          grp.append('path').attr('class', 'gf-eline').attr('fill', 'none');
          grp.append('rect').attr('class', 'gf-ebg');
          grp.append('text').attr('class', 'gf-ewt');
          return grp;
        },
        update => update,
        exit => exit.remove()
      );

    // Build a map to detect parallel edges (multiple edges between same node pair)
    const pairCount: Record<string, number> = {};
    const pairIndex: Record<string, number> = {};
    graph.edges.forEach(e => {
      const key = [e.source, e.target].sort().join('::');
      pairCount[key] = (pairCount[key] || 0) + 1;
    });
    // Assign index within each pair group
    const pairCursor: Record<string, number> = {};
    graph.edges.forEach(e => {
      const key = [e.source, e.target].sort().join('::');
      pairCursor[key] = (pairCursor[key] || 0);
      pairIndex[e.id] = pairCursor[key]++;
    });

    edgeGroups.each(function(d) {
      const grp = d3.select(this);
      const s = graph.nodes.find(n => n.id === d.source);
      const t = graph.nodes.find(n => n.id === d.target);
      if (!s || !t) return;

      let state = 'default';
      if (step) {
        if (step.mstEdges.includes(d.id)) state = 'accepted';
        else if (step.rejectedEdges.includes(d.id)) state = 'rejected';
        else if (step.candidateEdges.includes(d.id)) state = 'candidate';
        else if (step.highlightedEdges.includes(d.id)) state = 'considering';
      }

      const stMap: Record<string, [string, number, string, string]> = {
        default: ['var(--accent-default)', 2, 'none', 'none'],
        considering: ['var(--accent-active)', 3, 'drop-shadow(0 0 8px var(--accent-active))', 'none'],
        accepted: ['var(--accent-accept)', 3.5, `drop-shadow(0 0 ${isComplete ? 16 : 10}px var(--glow-accept))`, 'none'],
        rejected: ['var(--accent-reject)', 2, 'drop-shadow(0 0 4px var(--accent-reject))', 'none'],
        candidate: ['var(--accent-candidate)', 2, 'none', '8 4'],
      };
      const [stroke, sw, flt, da] = stMap[state] ?? stMap.default;

      const path = grp.select<SVGPathElement>('.gf-eline');

      // Determine if this edge needs curvature (only for parallel edges)
      const pairKey = [d.source, d.target].sort().join('::');
      const count = pairCount[pairKey] || 1;
      const idx = pairIndex[d.id] || 0;

      let labelX: number, labelY: number;

      if (count > 1) {
        // Parallel edges: offset each one with a curve
        const dx = t.x - s.x;
        const dy = t.y - s.y;
        const offset = (idx - (count - 1) / 2) * 0.2;
        const midX = (s.x + t.x) / 2 - dy * offset;
        const midY = (s.y + t.y) / 2 + dx * offset;
        path.attr('d', `M${s.x},${s.y} Q${midX},${midY} ${t.x},${t.y}`);
        labelX = 0.25 * s.x + 0.5 * midX + 0.25 * t.x;
        labelY = 0.25 * s.y + 0.5 * midY + 0.25 * t.y;
      } else {
        // Single edge: clean straight line
        path.attr('d', `M${s.x},${s.y} L${t.x},${t.y}`);
        labelX = (s.x + t.x) / 2;
        labelY = (s.y + t.y) / 2;
      }

      path.transition().duration(280)
        .attr('stroke', stroke).attr('stroke-width', sw)
        .attr('filter', flt).attr('stroke-dasharray', da);

      if (state === 'candidate' || state === 'accepted') path.classed('edge-animated', true);
      else path.classed('edge-animated', false);

      // Weight badge at edge midpoint
      const tw = String(d.weight).length * 7 + 12;

      grp.select('.gf-ebg')
        .attr('x', labelX - tw / 2).attr('y', labelY - 10).attr('width', tw).attr('height', 18)
        .attr('rx', 4).attr('fill', 'var(--bg-panel)').attr('stroke', 'var(--border)').attr('stroke-width', 1)
        .style('cursor', deleteMode ? 'crosshair' : 'pointer');
      grp.select('.gf-ewt')
        .attr('x', labelX).attr('y', labelY + 3).attr('text-anchor', 'middle')
        .attr('font-family', 'JetBrains Mono').attr('font-size', 10)
        .attr('fill', state !== 'default' ? stroke : 'var(--text-secondary)')
        .attr('pointer-events', 'none')
        .text(d.weight);

      grp.select('.gf-ebg')
        .on('click', (ev: Event) => { ev.stopPropagation(); if (deleteMode) onEdgeAction(d, 'delete'); })
        .on('dblclick', (ev: Event) => { ev.stopPropagation(); if (!deleteMode) onEdgeAction(d, 'edit'); });
    });

    // NODES
    const nodeGroups = g.selectAll<SVGGElement, GNode>('.gf-node')
      .data(graph.nodes, d => d.id)
      .join(
        enter => {
          const grp = enter.append('g').attr('class', 'gf-node');
          grp.append('foreignObject')
            .attr('class', 'gf-nfo')
            .attr('width', 100).attr('height', 100)
            .attr('x', -50).attr('y', -50)
            .style('overflow', 'visible')
            .style('pointer-events', 'none')
            .append('xhtml:div').attr('class', 'gf-ndiv')
            .style('width', '100%').style('height', '100%')
            .style('position', 'relative');
          return grp;
        },
        update => update,
        exit => exit.remove()
      );

    nodeGroups.each(function(d) {
      const grp = d3.select(this);
      const isActive = step?.activeNodes?.includes(d.id) ?? false;
      const isSrc = connectSource === d.id;

      let classes = `node-modern ${scenario || 'telecom'}`;
      if (deleteMode) classes += ' delete';
      else if (isSrc) classes += ' source';
      else if (isActive) classes += ' active';
      
      // Keep pulsing logic via css or simple style
      if (isActive && !isComplete) classes += ' pulse';

      grp.attr('transform', `translate(${d.x},${d.y})`);
      
      // Use foreignObject div for HTML styling
      const div = grp.select('.gf-ndiv');
      div.html(`
        <div class="${classes}">
          <span class="n-label">${d.id}</span>
        </div>
      `);

      // Add invisible hit circle for precise d3 dragging and clicking over the fo
      let hit = grp.select<SVGCircleElement>('.gf-nhit');
      if (hit.empty()) {
        hit = grp.append('circle').attr('class', 'gf-nhit').attr('r', 25).attr('fill', 'transparent')
          .style('cursor', 'pointer');
      }
      hit.style('cursor', deleteMode ? 'crosshair' : connectSource ? 'cell' : 'pointer')
        .on('click', (ev: Event) => { ev.stopPropagation(); onNodeClick(d.id); });
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
    const x0 = Math.min(...xs) - 60, x1 = Math.max(...xs) + 60;
    const y0 = Math.min(...ys) - 60, y1 = Math.max(...ys) + 60;
    const sc = Math.min(r.width / (x1 - x0), r.height / (y1 - y0), 2) * 0.85;
    const tx = r.width / 2 - sc * (x0 + x1) / 2, ty = r.height / 2 - sc * (y0 + y1) / 2;
    d3.select(svgRef.current).transition().duration(400)
      .call(zoomBehavior.current.transform, d3.zoomIdentity.translate(tx, ty).scale(sc));
  }, [graph.nodes]);

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
