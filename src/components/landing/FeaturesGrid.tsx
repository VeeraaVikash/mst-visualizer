import React from 'react';
import { motion } from 'framer-motion';
import { GitGraph, Zap, SplitSquareHorizontal, BarChart2, Network, Waypoints } from 'lucide-react';

const features = [
  {
    icon: GitGraph,
    title: 'Interactive Graph Creation',
    description: 'Click to add nodes, drag to reposition. Connect edges with custom weights.',
  },
  {
    icon: Zap,
    title: 'Step-by-Step Animation',
    description: 'Watch algorithms execute with play, pause, and manual step controls.',
  },
  {
    icon: SplitSquareHorizontal,
    title: 'Side-by-Side Compare',
    description: 'Run Kruskal\'s and Prim\'s simultaneously on the same graph.',
  },
  {
    icon: BarChart2,
    title: 'Live Statistics',
    description: 'Track MST cost, edges selected, and Union-Find state in real time.',
  },
  {
    icon: Network,
    title: 'Kruskal\'s Algorithm',
    description: 'Global greedy approach using Union-Find for cycle detection.',
  },
  {
    icon: Waypoints,
    title: 'Prim\'s Algorithm',
    description: 'Local greedy approach growing the tree from a seed node.',
  },
];

const FeaturesGrid: React.FC = () => {
  return (
    <section className="py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <motion.h2
          className="font-sans font-bold text-2xl mb-10 text-center"
          style={{ color: 'var(--text-primary)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Everything You Need to Master MST
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feat, i) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={feat.title}
                className="rounded-xl p-6 transition-colors"
                style={{
                  background: 'var(--bg-panel)',
                  border: '1px solid var(--border)',
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4 }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                  style={{ background: 'var(--bg-elevated)' }}
                >
                  <Icon size={20} style={{ color: 'var(--accent-accept)' }} />
                </div>
                <h3 className="font-sans font-semibold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
                  {feat.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  {feat.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
