import React from 'react';
import { motion } from 'framer-motion';
import type { Graph, AlgorithmStep } from '../../types';
import { graphDensity } from '../../utils/graphUtils';
import { SCENARIOS } from '../../data/scenarios';

interface Props {
  graph: Graph;
  steps: AlgorithmStep[];
  currentIdx: number;
  algoType: string;
  scenario: string;
  // Race mode: optional second algorithm stats
  raceSteps?: AlgorithmStep[];
  raceIdx?: number;
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 19, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: accent || 'var(--text-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

function AlgoSection({ label, color, steps, currentIdx, graph, unit }: {
  label: string; color: string; steps: AlgorithmStep[]; currentIdx: number; graph: Graph; unit: string;
}) {
  const step = currentIdx >= 0 && currentIdx < steps.length ? steps[currentIdx] : null;
  const n = graph.nodes.length;
  const totalW = graph.edges.reduce((s, e) => s + e.weight, 0);
  const mstCost = step?.mstCost ?? 0;
  const savings = totalW - mstCost;
  const pct = totalW > 0 ? Math.round((savings / totalW) * 100) : 0;

  return (
    <div>
      <div style={{ fontSize: 10, fontFamily: "'JetBrains Mono', monospace", color, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8, fontWeight: 700 }}>
        {label}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 12 }}>
        <StatCard label={`MST Cost${unit ? ` (${unit})` : ''}`} value={mstCost} sub={`of ${totalW} total`} accent={color} />
        <StatCard label={`Savings${unit ? ` (${unit})` : ''}`} value={savings} sub={`${pct}% reduction`} />
        <StatCard label="Edges Added" value={step?.edgesSelected ?? 0} sub={`of ${Math.max(n - 1, 0)} needed`} />
        <StatCard label="Nodes Covered" value={step?.activeNodes?.length ?? 0} sub={`of ${n} total`} />
      </div>
      {mstCost > 0 && (
        <div style={{ height: 6, borderRadius: 3, background: 'var(--bg-elevated)', marginBottom: 8, overflow: 'hidden' }}>
          <motion.div animate={{ width: `${Math.min(100, 100 - pct)}%` }} transition={{ duration: 0.5 }}
            style={{ height: '100%', borderRadius: 3, background: color }} />
        </div>
      )}
    </div>
  );
}

export default function StatsPanel({ graph, steps, currentIdx, algoType, scenario, raceSteps, raceIdx }: Props) {
  const sc = SCENARIOS[scenario];
  const unit = sc?.unit ?? '';
  const n = graph.nodes.length, e = graph.edges.length;
  const density = graphDensity(n, e);
  const weights = graph.edges.map(ed => ed.weight);
  const minW = weights.length ? Math.min(...weights) : 0;
  const maxW = weights.length ? Math.max(...weights) : 0;
  const avgW = weights.length ? Math.round(weights.reduce((a, b) => a + b, 0) / weights.length) : 0;
  const isRace = raceSteps && raceSteps.length > 0;

  return (
    <div style={{ padding: '10px', overflowY: 'auto', height: '100%' }}>
      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Graph Properties</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 12 }}>
        <StatCard label="Nodes" value={n} sub="vertices" />
        <StatCard label="Edges" value={e} sub="connections" />
        <StatCard label="Density" value={`${(density * 100).toFixed(1)}%`} sub="edge density" />
        <StatCard label="Avg Weight" value={avgW} sub={`min:${minW} max:${maxW}`} />
      </div>

      {isRace ? (
        <>
          <AlgoSection label="Kruskal's Algorithm" color="var(--accent-accept)" steps={steps} currentIdx={currentIdx} graph={graph} unit={unit} />
          <AlgoSection label="Prim's Algorithm" color="var(--accent-candidate)" steps={raceSteps!} currentIdx={raceIdx ?? currentIdx} graph={graph} unit={unit} />
        </>
      ) : (
        <AlgoSection
          label={`${algoType === 'kruskal' ? "Kruskal's" : "Prim's"} Progress`}
          color={algoType === 'kruskal' ? 'var(--accent-accept)' : 'var(--accent-candidate)'}
          steps={steps} currentIdx={currentIdx} graph={graph} unit={unit}
        />
      )}

      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Algorithm Analysis</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 12 }}>
        <StatCard label="Kruskal's" value="O(E log E)" sub="Time complexity" />
        <StatCard label="Prim's" value="O(E log V)" sub="Time complexity" />
        <StatCard label="Space" value="O(V + E)" sub="Memory used" />
        <StatCard label="Total Steps" value={isRace ? `${steps.length} / ${raceSteps!.length}` : steps.length} sub="Animation frames" />
      </div>

      {sc?.description && (
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
          {sc.description}
        </p>
      )}
      {!steps.length && !isRace && (
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 8 }}>
          Run an algorithm to see cost analysis and efficiency metrics.
        </p>
      )}
    </div>
  );
}
