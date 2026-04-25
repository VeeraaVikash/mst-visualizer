import React from 'react';
import {
  ArrowLeftRight, CheckCircle, XCircle, ArrowRight, Circle,
  DollarSign, GitMerge, Network,
} from 'lucide-react';
import type { Graph, AlgorithmStep, AlgorithmType } from '../../types';

interface RightPanelProps {
  graph: Graph;
  currentStep: AlgorithmStep | null;
  stepIndex: number;
  totalSteps: number;
  algorithmType: AlgorithmType;
}

const RightPanel: React.FC<RightPanelProps> = ({
  graph,
  currentStep,
  stepIndex,
  totalSteps,
  algorithmType,
}) => {
  const targetMstEdges = graph.nodes.length > 0 ? graph.nodes.length - 1 : 0;
  const progress = totalSteps > 0 ? ((stepIndex + 1) / totalSteps) * 100 : 0;

  const SectionLabel: React.FC<{ label: string }> = ({ label }) => (
    <div className="flex items-center gap-2 mb-2 mt-4">
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
      <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
        {label}
      </span>
      <div className="h-px flex-1" style={{ background: 'var(--border)' }} />
    </div>
  );

  const currentEdge = currentStep?.edgeId
    ? graph.edges.find(e => e.id === currentStep.edgeId)
    : null;

  // Build edge list with status
  const sortedEdges = algorithmType === 'kruskal'
    ? [...graph.edges].sort((a, b) => a.weight - b.weight)
    : graph.edges;

  return (
    <div
      className="h-full overflow-y-auto px-3 py-2 shrink-0"
      style={{
        width: 300,
        background: 'var(--bg-panel)',
        borderLeft: '1px solid var(--border)',
      }}
    >
      <SectionLabel label="Status" />
      <div className="flex items-center justify-between mb-2">
        <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>
          Step {stepIndex >= 0 ? stepIndex + 1 : 0} / {totalSteps}
        </span>
      </div>
      <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-elevated)' }}>
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            background: currentStep?.type === 'COMPLETE' ? 'var(--accent-accept)' : 'var(--accent-active)',
          }}
        />
      </div>

      {currentEdge && (
        <>
          <SectionLabel label="Current Edge" />
          <div
            className="rounded-lg p-3"
            style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center gap-2 mb-2">
              <ArrowLeftRight size={14} style={{ color: 'var(--accent-active)' }} />
              <span className="font-mono text-sm font-semibold" style={{ color: 'var(--text-primary)' }}>
                {currentEdge.source} - {currentEdge.target}
              </span>
              <span className="font-mono text-xs ml-auto" style={{ color: 'var(--text-secondary)' }}>
                w={currentEdge.weight}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {currentStep.type === 'ACCEPT_EDGE' ? (
                <>
                  <CheckCircle size={14} style={{ color: 'var(--accent-accept)' }} />
                  <span className="font-mono text-xs" style={{ color: 'var(--accent-accept)' }}>ACCEPTED</span>
                </>
              ) : currentStep.type === 'REJECT_EDGE' ? (
                <>
                  <XCircle size={14} style={{ color: 'var(--accent-reject)' }} />
                  <span className="font-mono text-xs" style={{ color: 'var(--accent-reject)' }}>REJECTED</span>
                </>
              ) : (
                <>
                  <ArrowRight size={14} style={{ color: 'var(--accent-active)' }} />
                  <span className="font-mono text-xs" style={{ color: 'var(--accent-active)' }}>EVALUATING</span>
                </>
              )}
            </div>
          </div>
        </>
      )}

      <SectionLabel label="MST Progress" />
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <DollarSign size={14} style={{ color: 'var(--accent-accept)' }} />
          <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>Total Cost:</span>
          <span className="font-mono text-sm font-bold ml-auto" style={{ color: 'var(--text-primary)' }}>
            {currentStep?.mstCost ?? 0}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <GitMerge size={14} style={{ color: 'var(--accent-accept)' }} />
          <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>Edges in MST:</span>
          <span className="font-mono text-sm ml-auto" style={{ color: 'var(--text-primary)' }}>
            {currentStep?.edgesSelected ?? 0} / {targetMstEdges}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Network size={14} style={{ color: 'var(--accent-accept)' }} />
          <span className="font-mono text-xs" style={{ color: 'var(--text-secondary)' }}>Nodes covered:</span>
          <span className="font-mono text-sm ml-auto" style={{ color: 'var(--text-primary)' }}>
            {currentStep?.activeNodes.length ?? 0} / {graph.nodes.length}
          </span>
        </div>
      </div>

      <SectionLabel label="Edge List" />
      <div className="space-y-1 max-h-48 overflow-y-auto">
        {sortedEdges.map(edge => {
          const isMst = currentStep?.mstEdges.includes(edge.id);
          const isRejected = currentStep?.rejectedEdges.includes(edge.id);
          const isCurrent = currentStep?.highlightedEdges.includes(edge.id);
          const isCandidate = currentStep?.candidateEdges.includes(edge.id);

          let Icon = Circle;
          let color = 'var(--text-muted)';

          if (isMst) { Icon = CheckCircle; color = 'var(--accent-accept)'; }
          else if (isRejected) { Icon = XCircle; color = 'var(--accent-reject)'; }
          else if (isCurrent) { Icon = ArrowRight; color = 'var(--accent-active)'; }
          else if (isCandidate) { Icon = ArrowRight; color = 'var(--accent-candidate)'; }

          return (
            <div
              key={edge.id}
              className="flex items-center gap-2 rounded px-2 py-1 font-mono text-xs"
              style={{
                background: isCurrent ? 'var(--bg-elevated)' : 'transparent',
                color,
              }}
            >
              <Icon size={12} style={{ color, flexShrink: 0 }} />
              <span>{edge.source}-{edge.target}</span>
              <span className="ml-auto">w={edge.weight}</span>
            </div>
          );
        })}
        {sortedEdges.length === 0 && (
          <span className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>No edges</span>
        )}
      </div>
    </div>
  );
};

export default RightPanel;
