import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import type { Graph, AlgorithmStep } from '../../types';

interface Props {
  graph: Graph; step: AlgorithmStep | null;
  isComplete: boolean; label: string; color: string;
}

export default function MiniCanvas({ graph, step, isComplete, label, color }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || !graph.nodes.length) return;
    const r = containerRef.current.getBoundingClientRect();
    const W = r.width, H = r.height;
    const svg = d3.select(svgRef.current);
    svg.attr('width', W).attr('height', H).selectAll('*').remove();

    const gcx = graph.nodes.reduce((s, n) => s + n.x, 0) / graph.nodes.length;
    const gcy = graph.nodes.reduce((s, n) => s + n.y, 0) / graph.nodes.length;
    const sc = Math.min(W, H) * 0.018;
    const mx = (x: number) => W / 2 + (x - gcx) * sc;
    const my = (y: number) => H / 2 + (y - gcy) * sc;

    for (const e of graph.edges) {
      const s = graph.nodes.find(n => n.id === e.source);
      const t = graph.nodes.find(n => n.id === e.target);
      if (!s || !t) continue;
      let stroke = 'var(--accent-default)', sw = 1, filter = 'none';
      if (step) {
        if (step.mstEdges.includes(e.id)) { stroke = color; sw = 2.5; filter = `drop-shadow(0 0 ${isComplete ? 10 : 5}px ${color})`; }
        else if (step.rejectedEdges.includes(e.id)) { stroke = 'var(--accent-reject)'; sw = 1; }
        else if (step.highlightedEdges.includes(e.id)) { stroke = 'var(--accent-active)'; sw = 2; }
        else if (step.candidateEdges.includes(e.id)) { stroke = 'var(--accent-candidate)'; sw = 1.5; }
      }
      svg.append('line').attr('x1', mx(s.x)).attr('y1', my(s.y)).attr('x2', mx(t.x)).attr('y2', my(t.y))
        .attr('stroke', stroke).attr('stroke-width', sw).attr('filter', filter);
    }
    for (const n of graph.nodes) {
      const nx = mx(n.x), ny = my(n.y);
      const act = step?.activeNodes?.includes(n.id) ?? false;
      svg.append('circle').attr('cx', nx).attr('cy', ny).attr('r', 11)
        .attr('fill', 'var(--bg-elevated)').attr('stroke', act ? color : 'var(--accent-default)')
        .attr('stroke-width', act ? 2 : 1.5)
        .attr('filter', act && isComplete ? `drop-shadow(0 0 8px ${color})` : 'none');
      svg.append('text').attr('x', nx).attr('y', ny).attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('font-family', 'JetBrains Mono').attr('font-size', n.id.length > 2 ? 6 : 8).attr('font-weight', 600)
        .attr('fill', 'var(--text-primary)').text(n.id);
    }

    svg.append('text').attr('x', W / 2).attr('y', 16).attr('text-anchor', 'middle')
      .attr('font-family', 'JetBrains Mono').attr('font-size', 11).attr('font-weight', 700).attr('fill', color).text(label);
    if (step) {
      svg.append('text').attr('x', W / 2).attr('y', H - 8).attr('text-anchor', 'middle')
        .attr('font-family', 'JetBrains Mono').attr('font-size', 10)
        .attr('fill', isComplete ? color : 'var(--text-secondary)').text(`Cost: ${step.mstCost}`);
    }
  }, [graph, step, isComplete, label, color]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <svg ref={svgRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
}
