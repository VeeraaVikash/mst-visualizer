import React from 'react';
import { motion } from 'framer-motion';
import type { Graph, AlgorithmStep } from '../../types';
import { graphDensity } from '../../utils/graphUtils';
import { SCENARIOS } from '../../data/scenarios';

interface Props { graph: Graph; steps: AlgorithmStep[]; currentIdx: number; algoType: string; scenario: string; }

function StatCard({ label, value, sub }: { label: string; value: string | number; sub?: string }) {
  return (
    <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
      <div style={{ fontSize: 19, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: 10, color: 'var(--text-secondary)', marginTop: 1 }}>{sub}</div>}
    </div>
  );
}

export default function StatsPanel({ graph, steps, currentIdx, algoType, scenario }: Props) {
  const sc = SCENARIOS[scenario];
  const unit = sc?.unit ?? '';
  const step = currentIdx >= 0 && currentIdx < steps.length ? steps[currentIdx] : null;
  const n = graph.nodes.length, e = graph.edges.length;
  const density = graphDensity(n, e);
  const totalW = graph.edges.reduce((s, ed) => s + ed.weight, 0);
  const mstCost = step?.mstCost ?? 0;
  const savings = totalW - mstCost;
  const pct = totalW > 0 ? Math.round((savings / totalW) * 100) : 0;
  const weights = graph.edges.map(ed => ed.weight);
  const minW = weights.length ? Math.min(...weights) : 0;
  const maxW = weights.length ? Math.max(...weights) : 0;
  const avgW = weights.length ? Math.round(weights.reduce((a, b) => a + b, 0) / weights.length) : 0;

  return (
    <div style={{ padding: '10px', overflowY: 'auto', height: '100%' }}>
      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>Graph Properties</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 12 }}>
        <StatCard label="Nodes" value={n} sub="vertices" />
        <StatCard label="Edges" value={e} sub="connections" />
        <StatCard label="Density" value={`${(density * 100).toFixed(1)}%`} sub="edge density" />
        <StatCard label="Avg Weight" value={avgW} sub={`min:${minW} max:${maxW}`} />
      </div>

      <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>
        {algoType === 'kruskal' ? "Kruskal's" : "Prim's"} Progress
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 5, marginBottom: 12 }}>
        <StatCard label={`MST Cost${unit ? ` (${unit})` : ''}`} value={mstCost} sub={`of ${totalW} total`} />
        <StatCard label={`Savings${unit ? ` (${unit})` : ''}`} value={savings} sub={`${pct}% reduction`} />
        <StatCard label="Edges Added" value={step?.edgesSelected ?? 0} sub={`of ${Math.max(n - 1, 0)} needed`} />
        <StatCard label="Nodes Covered" value={step?.activeNodes?.length ?? 0} sub={`of ${n} total`} />
      </div>

      {mstCost > 0 && (
        <>
          <div style={{ fontSize: 9, fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 6 }}>Cost Efficiency</div>
          <div style={{ height: 7, borderRadius: 4, background: 'var(--bg-elevated)', marginBottom: 10, overflow: 'hidden' }}>
            <motion.div animate={{ width: `${Math.min(100, 100 - pct)}%` }} transition={{ duration: 0.5 }}
              style={{ height: '100%', borderRadius: 4, background: 'var(--accent-accept)' }} />
          </div>
          <p style={{ fontSize: 11, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 10 }}>
            The optimal network costs <strong style={{ color: 'var(--accent-accept)' }}>{mstCost}{unit && ` ${unit}`}</strong>, saving{' '}
            <strong>{savings}{unit && ` ${unit}`}</strong> ({pct}%) vs connecting every possible link ({totalW}{unit && ` ${unit}`}).
          </p>
          {sc?.description && (
            <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, fontStyle: 'italic', borderTop: '1px solid var(--border)', paddingTop: 8 }}>
              {sc.description}
            </p>
          )}
        </>
      )}
      {!steps.length && (
        <p style={{ fontSize: 11, color: 'var(--text-muted)', lineHeight: 1.6, marginTop: 8 }}>
          Run an algorithm to see cost analysis and efficiency metrics.
        </p>
      )}
    </div>
  );
}
