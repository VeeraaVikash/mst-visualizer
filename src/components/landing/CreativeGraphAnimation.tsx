import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getConstellationGraph } from '../../data/constellations';

const CreativeGraphAnimation: React.FC = () => {
  const [constellationIdx, setConstellationIdx] = useState(0);
  const [step, setStep] = useState(-1);

  const graph = useMemo(() => getConstellationGraph(constellationIdx), [constellationIdx]);

  useEffect(() => {
    const totalSteps = graph.mstEdges.length;
    let currentStep = -1;

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep > totalSteps + 2) {
        setConstellationIdx(c => (c + 1) % 5);
        currentStep = -1;
      }
      setStep(currentStep);
    }, 1200);

    return () => clearInterval(interval);
  }, [graph]);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'visible' }}>
      <AnimatePresence mode="wait">
        <motion.svg
          key={constellationIdx}
          viewBox="0 0 400 400"
          style={{ width: '100%', height: '100%', overflow: 'visible', position: 'absolute' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Base Edges */}
          {graph.edges.map((edge, i) => {
            const s = graph.nodes.find((n) => n.id === edge.source)!;
            const t = graph.nodes.find((n) => n.id === edge.target)!;
            const isMST = graph.mstEdges.findIndex((m) => (m.source === edge.source && m.target === edge.target) || (m.source === edge.target && m.target === edge.source));
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
          {graph.nodes.map((node, i) => {
            const isConnected = graph.mstEdges.slice(0, step + 1).some(
              (e) => e.source === node.id || e.target === node.id
            );

            return (
              <g key={`node-${i}`} transform={`translate(${node.x},${node.y})`}>
                <motion.circle
                  r={(node as any).radius}
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
                  fontSize={(node as any).fontSize}
                  fontWeight="bold"
                  fontFamily="'Space Grotesk', sans-serif"
                >
                  {node.id.substring(0, 4).toUpperCase()}
                </text>
              </g>
            );
          })}
          
          {/* Constellation Name Title */}
          <text
            x={200}
            y={380}
            textAnchor="middle"
            fill="var(--text-muted)"
            fontSize="14"
            fontWeight="600"
            fontFamily="'Space Grotesk', sans-serif"
            opacity={0.5}
            letterSpacing={4}
            style={{ textTransform: 'uppercase' }}
          >
            {graph.name}
          </text>
        </motion.svg>
      </AnimatePresence>
    </div>
  );
};

export default CreativeGraphAnimation;
