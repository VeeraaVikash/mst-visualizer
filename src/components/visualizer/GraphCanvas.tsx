import React, { useRef, useEffect, useCallback } from 'react';
import * as d3 from 'd3';
import type { Graph, AlgorithmStep, CanvasMode } from '../../types';

type GraphEdge = Graph['edges'][number];
type GraphNode = Graph['nodes'][number];

interface GraphCanvasProps {
  graph: Graph;
  currentStep: AlgorithmStep | null;
  canvasMode: CanvasMode;
  connectSource: string | null;
  onCanvasClick: (x: number, y: number) => void;
  onNodeClick: (id: string) => void;
  onNodeDrag: (id: string, x: number, y: number) => void;
  isComplete: boolean;
}

const GraphCanvas: React.FC<GraphCanvasProps> = ({
  graph,
  currentStep,
  canvasMode,
  connectSource,
  onCanvasClick,
  onNodeClick,
  onNodeDrag,
  isComplete,
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const getEdgeState = useCallback((edgeId: string) => {
    if (!currentStep) return 'default';
    if (currentStep.mstEdges.includes(edgeId)) return 'accepted';
    if (currentStep.rejectedEdges.includes(edgeId)) return 'rejected';
    if (currentStep.candidateEdges.includes(edgeId)) return 'candidate';
    if (currentStep.highlightedEdges.includes(edgeId)) return 'considering';
    return 'default';
  }, [currentStep]);

  const getNodeState = useCallback((nodeId: string) => {
    if (!currentStep) return 'default';
    if (currentStep.activeNodes.includes(nodeId)) return 'active';
    return 'default';
  }, [currentStep]);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const svg = d3.select(svgRef.current);
    const rect = containerRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    svg.attr('width', width).attr('height', height).attr('viewBox', `0 0 ${width} ${height}`);

    // Click handler on background
    svg.on('click', function (event: Event) {
      const target = event.target as SVGElement;
      if (target.tagName === 'svg' || target.classList.contains('canvas-bg')) {
        const [x, y] = d3.pointer(event as MouseEvent, this as SVGSVGElement);
        onCanvasClick(x, y);
      }
    });

    // Edges
    const edgeGroup = svg.selectAll<SVGGElement, GraphEdge>('.edge-group')
      .data(graph.edges, d => d.id)
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'edge-group');
          g.append('line').attr('class', 'edge-line');
          g.append('rect').attr('class', 'edge-badge-bg');
          g.append('text').attr('class', 'edge-weight');
          return g;
        },
        update => update,
        exit => exit.remove()
      );

    edgeGroup.each(function (d) {
      const g = d3.select(this);
      const src = graph.nodes.find(n => n.id === d.source);
      const tgt = graph.nodes.find(n => n.id === d.target);
      if (!src || !tgt) return;

      const state = getEdgeState(d.id);
      const mx = (src.x + tgt.x) / 2;
      const my = (src.y + tgt.y) / 2;

      let stroke = 'var(--accent-default)';
      let strokeWidth = 2;
      let filterVal = 'none';
      let dashArray = 'none';

      switch (state) {
        case 'considering':
          stroke = 'var(--accent-active)';
          strokeWidth = 3;
          filterVal = 'drop-shadow(0 0 8px var(--accent-active))';
          break;
        case 'accepted':
          stroke = 'var(--accent-accept)';
          strokeWidth = 3;
          filterVal = isComplete
            ? 'drop-shadow(0 0 14px var(--accent-accept))'
            : 'drop-shadow(0 0 10px var(--accent-accept))';
          break;
        case 'rejected':
          stroke = 'var(--accent-reject)';
          strokeWidth = 2;
          filterVal = 'drop-shadow(0 0 4px var(--accent-reject))';
          break;
        case 'candidate':
          stroke = 'var(--accent-candidate)';
          strokeWidth = 2;
          dashArray = '8 4';
          break;
      }

      g.select('.edge-line')
        .transition().duration(300)
        .attr('x1', src.x).attr('y1', src.y)
        .attr('x2', tgt.x).attr('y2', tgt.y)
        .attr('stroke', stroke)
        .attr('stroke-width', strokeWidth)
        .attr('filter', filterVal)
        .attr('stroke-dasharray', dashArray);

      if (state === 'candidate') {
        g.select('.edge-line').classed('edge-candidate', true);
      } else {
        g.select('.edge-line').classed('edge-candidate', false);
      }

      const textWidth = String(d.weight).length * 8 + 10;
      g.select('.edge-badge-bg')
        .attr('x', mx - textWidth / 2)
        .attr('y', my - 10)
        .attr('width', textWidth)
        .attr('height', 18)
        .attr('rx', 4)
        .attr('fill', 'var(--bg-panel)')
        .attr('stroke', 'var(--border)')
        .attr('stroke-width', 1);

      g.select('.edge-weight')
        .attr('x', mx)
        .attr('y', my + 3)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'JetBrains Mono')
        .attr('font-size', 11)
        .attr('fill', state !== 'default' ? stroke : 'var(--text-secondary)')
        .text(d.weight);
    });

    // Nodes
    const nodeGroup = svg.selectAll<SVGGElement, GraphNode>('.node-group')
      .data(graph.nodes, d => d.id)
      .join(
        enter => {
          const g = enter.append('g').attr('class', 'node-group').attr('cursor', 'pointer');
          g.append('circle').attr('class', 'node-circle');
          g.append('text').attr('class', 'node-label');
          return g;
        },
        update => update,
        exit => exit.remove()
      );

    nodeGroup.each(function (d) {
      const g = d3.select(this);
      const state = getNodeState(d.id);
      const isConnectSrc = connectSource === d.id;

      let strokeColor = 'var(--accent-default)';
      let strokeW = 2;
      let filterVal = 'none';

      if (isConnectSrc) {
        strokeColor = 'var(--accent-active)';
        strokeW = 3;
        filterVal = 'drop-shadow(0 0 8px var(--accent-active))';
      } else if (state === 'active') {
        strokeColor = 'var(--accent-accept)';
        strokeW = 2.5;
        filterVal = 'drop-shadow(0 0 6px var(--accent-accept))';
      }

      if (isComplete && currentStep?.activeNodes.includes(d.id)) {
        filterVal = 'drop-shadow(0 0 12px var(--accent-accept))';
      }

      g.attr('transform', `translate(${d.x},${d.y})`);

      g.select('.node-circle')
        .transition().duration(300)
        .attr('r', 28)
        .attr('fill', 'var(--bg-elevated)')
        .attr('stroke', strokeColor)
        .attr('stroke-width', strokeW)
        .attr('filter', filterVal);

      g.select('.node-label')
        .attr('text-anchor', 'middle')
        .attr('dominant-baseline', 'middle')
        .attr('font-family', 'JetBrains Mono')
        .attr('font-size', 14)
        .attr('font-weight', 600)
        .attr('fill', 'var(--text-primary)')
        .text(d.id);

      // Click handler
      g.on('click', (event: Event) => {
        (event as MouseEvent).stopPropagation();
        onNodeClick(d.id);
      });
    });

    // Drag behavior
    const drag = d3.drag<SVGGElement, GraphNode>()
      .on('start', function () {
        d3.select(this).raise();
      })
      .on('drag', function (event, d) {
        const x = Math.max(30, Math.min(width - 30, event.x));
        const y = Math.max(30, Math.min(height - 30, event.y));
        d3.select(this).attr('transform', `translate(${x},${y})`);
        onNodeDrag(d.id, x, y);
      });

    if (canvasMode === 'select') {
      nodeGroup.call(drag);
    } else {
      nodeGroup.on('.drag', null);
    }

  }, [graph, currentStep, canvasMode, connectSource, onCanvasClick, onNodeClick, onNodeDrag, getEdgeState, getNodeState, isComplete]);

  return (
    <div ref={containerRef} className="w-full h-full graph-canvas relative">
      <svg ref={svgRef} className="w-full h-full">
        <rect className="canvas-bg" width="100%" height="100%" fill="transparent" />
      </svg>
      {canvasMode !== 'select' && (
        <div
          className="absolute top-3 left-1/2 -translate-x-1/2 font-mono text-xs px-3 py-1 rounded-full"
          style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--accent-active)',
            color: 'var(--accent-active)',
          }}
        >
          {canvasMode === 'addNode' ? 'Click canvas to add node' : connectSource ? `Click target node (from ${connectSource})` : 'Click source node'}
        </div>
      )}
    </div>
  );
};

export default GraphCanvas;
