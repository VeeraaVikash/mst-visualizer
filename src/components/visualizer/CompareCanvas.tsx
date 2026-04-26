import React, { useEffect, useRef, useCallback } from 'react';
import * as d3 from 'd3';
import type { Graph, AlgorithmStep } from '../../types';

interface CompareCanvasProps {
  graph: Graph;
  kruskalStep: AlgorithmStep | null;
  primStep: AlgorithmStep | null;
  kruskalComplete: boolean;
  primComplete: boolean;
}

type GSelection = d3.Selection<SVGGElement, unknown, null, undefined>;

function renderHalf(
  svg: GSelection,
  graph: Graph,
  step: AlgorithmStep | null,
  width: number,
  height: number,
  offsetX: number,
  isComplete: boolean,
  label: string,
) {
  svg.selectAll('*').remove();

  // Label
  svg.append('text')
    .attr('x', offsetX + width / 2)
    .attr('y', 20)
    .attr('text-anchor', 'middle')
    .attr('font-family', 'JetBrains Mono')
    .attr('font-size', 12)
    .attr('font-weight', 600)
    .attr('fill', 'var(--text-secondary)')
    .text(label);

  // Scale nodes to fit half
  const scale = 0.45;
  const cx = offsetX + width / 2;
  const cy = height / 2 + 10;

  const graphCx = graph.nodes.length > 0
    ? graph.nodes.reduce((s, n) => s + n.x, 0) / graph.nodes.length
    : 0;
  const graphCy = graph.nodes.length > 0
    ? graph.nodes.reduce((s, n) => s + n.y, 0) / graph.nodes.length
    : 0;

  const mapX = (x: number) => cx + (x - graphCx) * scale;
  const mapY = (y: number) => cy + (y - graphCy) * scale;

  // Edges
  for (const edge of graph.edges) {
    const src = graph.nodes.find(n => n.id === edge.source);
    const tgt = graph.nodes.find(n => n.id === edge.target);
    if (!src || !tgt) continue;

    let stroke = 'var(--accent-default)';
    let strokeWidth = 1.5;
    let filter = 'none';

    if (step) {
      if (step.mstEdges.includes(edge.id)) {
        stroke = 'var(--accent-accept)';
        strokeWidth = 2.5;
        filter = isComplete ? 'drop-shadow(0 0 10px var(--accent-accept))' : 'drop-shadow(0 0 6px var(--accent-accept))';
      } else if (step.rejectedEdges.includes(edge.id)) {
        stroke = 'var(--accent-reject)';
        strokeWidth = 1.5;
      } else if (step.highlightedEdges.includes(edge.id)) {
        stroke = 'var(--accent-active)';
        strokeWidth = 2;
      } else if (step.candidateEdges.includes(edge.id)) {
        stroke = 'var(--accent-candidate)';
        strokeWidth = 1.5;
      }
    }

    svg.append('line')
      .attr('x1', mapX(src.x)).attr('y1', mapY(src.y))
      .attr('x2', mapX(tgt.x)).attr('y2', mapY(tgt.y))
      .attr('stroke', stroke)
      .attr('stroke-width', strokeWidth)
      .attr('filter', filter);

    const mx = (mapX(src.x) + mapX(tgt.x)) / 2;
    const my = (mapY(src.y) + mapY(tgt.y)) / 2;

    svg.append('text')
      .attr('x', mx).attr('y', my - 4)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'JetBrains Mono')
      .attr('font-size', 8)
      .attr('fill', 'var(--text-muted)')
      .text(edge.weight);
  }

  for (const node of graph.nodes) {
    const nx = mapX(node.x);
    const ny = mapY(node.y);
    const isActive = step?.activeNodes.includes(node.id);
    const r = Math.min(16 + Math.max(0, node.id.length - 2) * 3, 28);
    const fs = node.id.length > 4 ? 7 : node.id.length > 2 ? 8 : 10;

    svg.append('circle')
      .attr('cx', nx).attr('cy', ny)
      .attr('r', r)
      .attr('fill', 'var(--bg-elevated)')
      .attr('stroke', isActive ? 'var(--accent-accept)' : 'var(--accent-default)')
      .attr('stroke-width', isActive ? 2 : 1.5)
      .attr('filter', isActive && isComplete ? 'drop-shadow(0 0 8px var(--accent-accept))' : 'none');

    svg.append('text')
      .attr('x', nx).attr('y', ny)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-family', "'JetBrains Mono', monospace")
      .attr('font-size', fs)
      .attr('font-weight', 600)
      .attr('fill', 'var(--text-primary)')
      .text(node.id);
  }

  // Cost
  if (step) {
    svg.append('text')
      .attr('x', offsetX + width / 2)
      .attr('y', height - 12)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'JetBrains Mono')
      .attr('font-size', 11)
      .attr('fill', isComplete ? 'var(--accent-accept)' : 'var(--text-secondary)')
      .text(`Cost: ${step.mstCost}`);
  }
}

const CompareCanvas: React.FC<CompareCanvasProps> = ({
  graph,
  kruskalStep,
  primStep,
  kruskalComplete,
  primComplete,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const render = useCallback(() => {
    if (!svgRef.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const svg = d3.select(svgRef.current);
    svg.attr('width', w).attr('height', h).attr('viewBox', `0 0 ${w} ${h}`);
    svg.selectAll('*').remove();

    const halfW = w / 2;

    // Divider
    svg.append('line')
      .attr('x1', halfW).attr('y1', 0)
      .attr('x2', halfW).attr('y2', h)
      .attr('stroke', 'var(--border)')
      .attr('stroke-width', 1);

    const leftG = svg.append('g') as unknown as GSelection;
    const rightG = svg.append('g') as unknown as GSelection;

    renderHalf(leftG, graph, kruskalStep, halfW, h, 0, kruskalComplete, "Kruskal's");
    renderHalf(rightG, graph, primStep, halfW, h, halfW, primComplete, "Prim's");
  }, [graph, kruskalStep, primStep, kruskalComplete, primComplete]);

  useEffect(() => {
    render();
  }, [render]);

  useEffect(() => {
    const observer = new ResizeObserver(() => render());
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [render]);

  return (
    <div ref={containerRef} className="w-full h-full graph-canvas">
      <svg ref={svgRef} className="w-full h-full" />
    </div>
  );
};

export default CompareCanvas;
