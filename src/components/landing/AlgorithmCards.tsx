import React from 'react';
import { motion } from 'framer-motion';
import { Network, Waypoints, ArrowRight } from 'lucide-react';

const AlgorithmCards: React.FC = () => {
  const cards = [
    {
      icon: Network,
      name: "Kruskal's Algorithm",
      complexity: 'O(E log E)',
      approach: 'Greedy, global edge selection',
      dataStructure: 'Uses Union-Find (Disjoint Set)',
      strategy: 'Sort all edges by weight, greedily pick if no cycle',
      color: 'var(--accent-accept)',
    },
    {
      icon: Waypoints,
      name: "Prim's Algorithm",
      complexity: 'O(E log V)',
      approach: 'Greedy, local vertex expansion',
      dataStructure: 'Uses Priority Queue (Min-Heap)',
      strategy: 'Grow tree from seed, always pick cheapest crossing edge',
      color: 'var(--accent-candidate)',
    },
  ];

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
          Two Algorithms, One Goal
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {cards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.name}
                className="rounded-xl p-6"
                style={{
                  background: 'var(--bg-panel)',
                  border: `1px solid ${card.color}`,
                  boxShadow: `0 0 20px color-mix(in srgb, ${card.color} 10%, transparent)`,
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="flex items-center gap-3 mb-5">
                  <Icon size={24} style={{ color: card.color }} />
                  <h3 className="font-sans font-bold text-xl" style={{ color: 'var(--text-primary)' }}>
                    {card.name}
                  </h3>
                </div>
                <div
                  className="font-mono text-sm px-3 py-1.5 rounded-md inline-block mb-5"
                  style={{ background: 'var(--bg-elevated)', color: card.color }}
                >
                  {card.complexity}
                </div>
                <div className="space-y-3">
                  {[card.approach, card.dataStructure, card.strategy].map((text, j) => (
                    <div key={j} className="flex items-start gap-2">
                      <ArrowRight size={14} style={{ color: card.color, marginTop: 3, flexShrink: 0 }} />
                      <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default AlgorithmCards;
