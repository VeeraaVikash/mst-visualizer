import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const NODES = [
  { id: 'A', x: 150, y: 80 },
  { id: 'B', x: 280, y: 50 },
  { id: 'C', x: 350, y: 160 },
  { id: 'D', x: 280, y: 270 },
  { id: 'E', x: 150, y: 250 },
  { id: 'F', x: 70, y: 160 },
  { id: 'G', x: 210, y: 165 },
];

const EDGES = [
  { source: 'A', target: 'B', weight: 7 },
  { source: 'B', target: 'C', weight: 8 },
  { source: 'C', target: 'D', weight: 5 },
  { source: 'D', target: 'E', weight: 9 },
  { source: 'E', target: 'F', weight: 6 },
  { source: 'F', target: 'A', weight: 4 },
  { source: 'A', target: 'G', weight: 2 },
  { source: 'G', target: 'C', weight: 3 },
  { source: 'G', target: 'E', weight: 10 },
];

// Pre-computed MST edges via Kruskal's (sorted: 2,3,4,5,6,9 — picks: AG(2), GC(3), FA(4), CD(5), EF(6))
const MST_EDGE_ORDER = [
  { source: 'A', target: 'G' },
  { source: 'G', target: 'C' },
  { source: 'F', target: 'A' },
  { source: 'C', target: 'D' },
  { source: 'E', target: 'F' },
  { source: 'D', target: 'E' },
];

const HeroGraphAnimation: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg.append('g');

    // Draw edges
    const edgeGroup = g.selectAll<SVGGElement, typeof EDGES[0]>('.edge')
      .data(EDGES)
      .join('g')
      .attr('class', 'edge');

    edgeGroup.append('line')
      .attr('x1', d => NODES.find(n => n.id === d.source)!.x)
      .attr('y1', d => NODES.find(n => n.id === d.source)!.y)
      .attr('x2', d => NODES.find(n => n.id === d.target)!.x)
      .attr('y2', d => NODES.find(n => n.id === d.target)!.y)
      .attr('stroke', 'var(--accent-default)')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.6);

    edgeGroup.append('text')
      .attr('x', d => {
        const s = NODES.find(n => n.id === d.source)!;
        const t = NODES.find(n => n.id === d.target)!;
        return (s.x + t.x) / 2;
      })
      .attr('y', d => {
        const s = NODES.find(n => n.id === d.source)!;
        const t = NODES.find(n => n.id === d.target)!;
        return (s.y + t.y) / 2 - 6;
      })
      .attr('text-anchor', 'middle')
      .attr('font-family', 'JetBrains Mono')
      .attr('font-size', 9)
      .attr('fill', 'var(--text-muted)')
      .text(d => d.weight);

    // Draw nodes
    const nodeGroup = g.selectAll<SVGGElement, typeof NODES[0]>('.node')
      .data(NODES)
      .join('g')
      .attr('class', 'node')
      .attr('transform', d => `translate(${d.x},${d.y})`);

    nodeGroup.append('circle')
      .attr('r', 18)
      .attr('fill', 'var(--bg-elevated)')
      .attr('stroke', 'var(--accent-default)')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.8);

    nodeGroup.append('text')
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-family', 'JetBrains Mono')
      .attr('font-size', 11)
      .attr('fill', 'var(--text-primary)')
      .attr('opacity', 0.8)
      .text(d => d.id);

    // Animate MST
    function animateMST() {
      // Reset all edges
      edgeGroup.select('line')
        .attr('stroke', 'var(--accent-default)')
        .attr('stroke-width', 1.5)
        .attr('opacity', 0.6)
        .attr('filter', 'none');

      nodeGroup.select('circle')
        .attr('stroke', 'var(--accent-default)')
        .attr('opacity', 0.8);

      MST_EDGE_ORDER.forEach((mstEdge, index) => {
        const delay = 800 + index * 1000;

        setTimeout(() => {
          if (!svgRef.current) return;

          edgeGroup.filter(d => 
            (d.source === mstEdge.source && d.target === mstEdge.target) ||
            (d.source === mstEdge.target && d.target === mstEdge.source)
          ).select('line')
            .transition()
            .duration(400)
            .attr('stroke', 'var(--accent-accept)')
            .attr('stroke-width', 2.5)
            .attr('opacity', 1)
            .attr('filter', 'drop-shadow(0 0 6px var(--accent-accept))');

          nodeGroup.filter(d => d.id === mstEdge.source || d.id === mstEdge.target)
            .select('circle')
            .transition()
            .duration(400)
            .attr('stroke', 'var(--accent-accept)')
            .attr('opacity', 1);
        }, delay);
      });
    }

    animateMST();
    const interval = setInterval(animateMST, 8000);

    return () => clearInterval(interval);
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 420 320"
      className="w-full h-full"
      style={{ opacity: 0.85 }}
    />
  );
};

export default HeroGraphAnimation;
