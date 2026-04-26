import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const NODES = [
  { id: 'A', x: 200, y: 50 },
  { id: 'B', x: 350, y: 120 },
  { id: 'C', x: 320, y: 280 },
  { id: 'D', x: 200, y: 350 },
  { id: 'E', x: 80,  y: 280 },
  { id: 'F', x: 50,  y: 120 },
  { id: 'G', x: 200, y: 190 }, // Center
];

const EDGES = [
  { source: 'A', target: 'B', weight: 4 },
  { source: 'B', target: 'C', weight: 8 },
  { source: 'C', target: 'D', weight: 7 },
  { source: 'D', target: 'E', weight: 9 },
  { source: 'E', target: 'F', weight: 10 },
  { source: 'F', target: 'A', weight: 2 },
  { source: 'A', target: 'G', weight: 1 },
  { source: 'B', target: 'G', weight: 5 },
  { source: 'C', target: 'G', weight: 6 },
  { source: 'D', target: 'G', weight: 11 },
  { source: 'E', target: 'G', weight: 3 },
  { source: 'F', target: 'G', weight: 12 },
];

// MST edges (ordered by weight: AG(1), FA(2), EG(3), AB(4), BG(5, skip), CG(6), CD(7)) -> AG, FA, EG, AB, CG, CD
const MST_EDGES = [
  { source: 'A', target: 'G' },
  { source: 'F', target: 'A' },
  { source: 'E', target: 'G' },
  { source: 'A', target: 'B' },
  { source: 'C', target: 'G' },
  { source: 'C', target: 'D' },
];

const CreativeGraphAnimation: React.FC = () => {
  const [step, setStep] = useState(-1);

  useEffect(() => {
    const totalSteps = MST_EDGES.length;
    let currentStep = -1;

    const interval = setInterval(() => {
      currentStep = (currentStep + 1) % (totalSteps + 2);
      setStep(currentStep);
    }, 1500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
      <svg viewBox="0 0 400 400" style={{ width: '100%', height: '100%', overflow: 'visible' }}>
        <defs>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Base Edges */}
        {EDGES.map((edge, i) => {
          const s = NODES.find((n) => n.id === edge.source)!;
          const t = NODES.find((n) => n.id === edge.target)!;
          const isMST = MST_EDGES.findIndex((m) => (m.source === edge.source && m.target === edge.target) || (m.source === edge.target && m.target === edge.source));
          const isActive = isMST !== -1 && step >= isMST;

          return (
            <g key={`edge-${i}`}>
              <line
                x1={s.x}
                y1={s.y}
                x2={t.x}
                y2={t.y}
                stroke="var(--accent-default)"
                strokeWidth={1.5}
                opacity={0.3}
              />
              <text
                x={(s.x + t.x) / 2}
                y={(s.y + t.y) / 2 - 5}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="10"
                fontFamily="JetBrains Mono"
              >
                {edge.weight}
              </text>
              {isMST !== -1 && (
                <motion.line
                  x1={s.x}
                  y1={s.y}
                  x2={t.x}
                  y2={t.y}
                  stroke="var(--accent-accept)"
                  strokeWidth={3}
                  filter="url(#glow)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{
                    pathLength: isActive ? 1 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.6, ease: 'easeInOut' }}
                />
              )}
            </g>
          );
        })}

        {/* Nodes */}
        {NODES.map((node, i) => {
          const isConnected = MST_EDGES.slice(0, step + 1).some(
            (e) => e.source === node.id || e.target === node.id
          );

          return (
            <g key={`node-${i}`} transform={`translate(${node.x},${node.y})`}>
              <motion.circle
                r={18}
                fill="var(--bg-panel)"
                stroke={isConnected ? "var(--accent-accept)" : "var(--accent-default)"}
                strokeWidth={2}
                filter={isConnected ? "url(#glow)" : "none"}
                initial={{ scale: 1 }}
                animate={{ scale: isConnected ? [1, 1.2, 1] : 1 }}
                transition={{ duration: 0.5 }}
              />
              <text
                textAnchor="middle"
                dominantBaseline="middle"
                fill="var(--text-primary)"
                fontSize="12"
                fontWeight="bold"
                fontFamily="Space Grotesk"
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default CreativeGraphAnimation;
