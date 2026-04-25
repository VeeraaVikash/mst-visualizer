import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, XCircle, Search, Zap, ArrowRight } from 'lucide-react';
import type { AlgorithmStep } from '../../types';

interface ExplanationBarProps {
  currentStep: AlgorithmStep | null;
  stepIndex: number;
}

const stepTypeIcon: Record<string, React.ReactNode> = {
  SORT_EDGES: <Zap size={14} style={{ color: 'var(--accent-active)' }} />,
  CONSIDER_EDGE: <Search size={14} style={{ color: 'var(--accent-active)' }} />,
  ACCEPT_EDGE: <CheckCircle size={14} style={{ color: 'var(--accent-accept)' }} />,
  REJECT_EDGE: <XCircle size={14} style={{ color: 'var(--accent-reject)' }} />,
  ADD_NODE: <ArrowRight size={14} style={{ color: 'var(--accent-candidate)' }} />,
  HIGHLIGHT_CANDIDATES: <Search size={14} style={{ color: 'var(--accent-candidate)' }} />,
  COMPLETE: <CheckCircle size={14} style={{ color: 'var(--accent-accept)' }} />,
};

const ExplanationBar: React.FC<ExplanationBarProps> = ({ currentStep, stepIndex }) => {
  return (
    <div
      className="shrink-0 px-4 py-3 flex items-start gap-3 overflow-hidden"
      style={{
        height: 80,
        background: 'var(--bg-panel)',
        borderTop: '1px solid var(--border)',
      }}
    >
      <Terminal size={16} style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 2 }} />
      <AnimatePresence mode="wait">
        {currentStep ? (
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
                Step {stepIndex + 1}
              </span>
              {stepTypeIcon[currentStep.type]}
              <span
                className="font-mono text-[10px] uppercase"
                style={{
                  color: currentStep.type === 'ACCEPT_EDGE' ? 'var(--accent-accept)'
                    : currentStep.type === 'REJECT_EDGE' ? 'var(--accent-reject)'
                    : 'var(--text-secondary)',
                }}
              >
                {currentStep.type.replace(/_/g, ' ')}
              </span>
            </div>
            <p className="font-mono text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              {currentStep.explanation}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex-1"
          >
            <p className="font-mono text-xs" style={{ color: 'var(--text-muted)' }}>
              Ready. Create a graph and run an algorithm to begin.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExplanationBar;
