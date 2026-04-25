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
}

export default function GraphCanvas({ graph, step, canvasMode, deleteMode, connectSource, onBgClick, onNodeClick, onNodeDrag, onEdgeAction, isComplete }: Props) {
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
          grp.append('line').attr('class', 'gf-eline');
          grp.append('rect').attr('class', 'gf-ebg');
          grp.append('text').attr('class', 'gf-ewt');
          return grp;
        },
        update => update,
        exit => exit.remove()
      );

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

      const line = grp.select<SVGLineElement>('.gf-eline');
      line.transition().duration(280)
        .attr('x1', s.x).attr('y1', s.y).attr('x2', t.x).attr('y2', t.y)
        .attr('stroke', stroke).attr('stroke-width', sw)
        .attr('filter', flt).attr('stroke-dasharray', da);
      if (state === 'candidate') line.classed('edge-animated', true);
      else line.classed('edge-animated', false);

      const mx = (s.x + t.x) / 2, my = (s.y + t.y) / 2;
      const tw = String(d.weight).length * 7 + 12;
      grp.select('.gf-ebg')
        .attr('x', mx - tw / 2).attr('y', my - 10).attr('width', tw).attr('height', 18)
        .attr('rx', 4).attr('fill', 'var(--bg-panel)').attr('stroke', 'var(--border)').attr('stroke-width', 1)
        .style('cursor', deleteMode ? 'crosshair' : 'pointer');
      grp.select('.gf-ewt')
        .attr('x', mx).attr('y', my + 3).attr('text-anchor', 'middle')
        .attr('font-family', 'JetBrains Mono').attr('font-size', 10)
        .attr('fill', state !== 'default' ? stroke : 'var(--text-secondary)')
        .attr('pointer-events', 'none')
        .text(d.weight);

      // Edge click/dblclick
      grp.select('.gf-ebg')
        .on('click', (ev: Event) => {
          ev.stopPropagation();
          if (deleteMode) onEdgeAction(d, 'delete');
        })
        .on('dblclick', (ev: Event) => {
          ev.stopPropagation();
          if (!deleteMode) onEdgeAction(d, 'edit');
        });
    });

    // NODES
    const nodeGroups = g.selectAll<SVGGElement, GNode>('.gf-node')
      .data(graph.nodes, d => d.id)
      .join(
        enter => {
          const grp = enter.append('g').attr('class', 'gf-node');
          grp.append('circle').attr('class', 'gf-ncirc');
          grp.append('text').attr('class', 'gf-nlbl');
          return grp;
        },
        update => update,
        exit => exit.remove()
      );

    nodeGroups.each(function(d) {
      const grp = d3.select(this);
      const isActive = step?.activeNodes?.includes(d.id) ?? false;
      const isSrc = connectSource === d.id;

      let sc = 'var(--accent-default)', sw = 2, flt = 'none';
      if (deleteMode) { sc = 'var(--accent-reject)'; sw = 2; flt = 'drop-shadow(0 0 4px var(--accent-reject))'; }
      else if (isSrc) { sc = 'var(--accent-active)'; sw = 3; flt = 'drop-shadow(0 0 10px var(--glow-active))'; }
      else if (isActive) { sc = 'var(--accent-accept)'; sw = 2.5; flt = 'drop-shadow(0 0 8px var(--glow-accept))'; }
      if (isComplete && isActive) flt = 'drop-shadow(0 0 16px var(--glow-accept))';

      grp.attr('transform', `translate(${d.x},${d.y})`).style('cursor', deleteMode ? 'crosshair' : connectSource ? 'cell' : 'pointer');
      grp.select('.gf-ncirc').transition().duration(280)
        .attr('r', 26).attr('fill', 'var(--bg-elevated)')
        .attr('stroke', sc).attr('stroke-width', sw).attr('filter', flt);
      grp.select('.gf-nlbl')
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('font-family', 'JetBrains Mono').attr('font-size', d.id.length > 2 ? 9 : 12)
        .attr('font-weight', 600).attr('fill', 'var(--text-primary)').attr('pointer-events', 'none')
        .text(d.id);

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
  }, [graph, step, canvasMode, deleteMode, connectSource, isComplete, onNodeClick, onNodeDrag, onEdgeAction]);

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
