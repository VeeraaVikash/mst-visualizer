import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, Search, Zap, ArrowRight, Info } from 'lucide-react';
import type { AlgorithmStep } from '../../types';

interface ExplanationBarProps {
  currentStep: AlgorithmStep | null;
  stepIndex: number;
}

const stepTypeIcon: Record<string, React.ReactNode> = {
  SORT_EDGES: <Zap size={22} style={{ color: 'var(--accent-active)' }} />,
  CONSIDER_EDGE: <Search size={22} style={{ color: 'var(--accent-active)' }} />,
  ACCEPT_EDGE: <CheckCircle size={22} style={{ color: 'var(--accent-accept)' }} />,
  REJECT_EDGE: <XCircle size={22} style={{ color: 'var(--accent-reject)' }} />,
  ADD_NODE: <ArrowRight size={22} style={{ color: 'var(--accent-candidate)' }} />,
  HIGHLIGHT_CANDIDATES: <Search size={22} style={{ color: 'var(--accent-candidate)' }} />,
  COMPLETE: <CheckCircle size={22} style={{ color: 'var(--accent-accept)' }} />,
};

const parseExplanation = (text: string) => {
  const parts = text.split(/(\*\*.*?\*\*|\{.*?\})/g);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i} style={{ color: 'var(--text-primary)', fontWeight: 700 }}>{part.slice(2, -2)}</strong>;
    }
    if (part.startsWith('{') && part.endsWith('}')) {
      return <span key={i} style={{ color: 'var(--accent-active)', fontWeight: 600, fontFamily: "'JetBrains Mono', monospace", fontSize: '0.95em' }}>{part.slice(1, -1)}</span>;
    }
    return <span key={i}>{part}</span>;
  });
};

const ExplanationBar: React.FC<ExplanationBarProps> = ({ currentStep, stepIndex }) => {
  return (
    <div style={{ position: 'absolute', bottom: 40, left: '50%', transform: 'translateX(-50%)', zIndex: 50, pointerEvents: 'none', width: '90%', maxWidth: 640 }}>
      <AnimatePresence mode="popLayout">
        {currentStep ? (
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.25, type: 'spring', damping: 22, stiffness: 350 }}
            style={{
              background: 'color-mix(in srgb, var(--bg-panel) 85%, transparent)',
              backdropFilter: 'blur(12px)',
              border: '1px solid var(--border)',
              borderRadius: 20,
              padding: '20px 28px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 0 0 1px color-mix(in srgb, var(--border) 50%, transparent)',
              display: 'flex',
              gap: 20,
              alignItems: 'center'
            }}
          >
            <div style={{ padding: 12, borderRadius: '50%', background: 'var(--bg-elevated)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }}>
               {stepTypeIcon[currentStep.type] || <Info size={22} style={{ color: 'var(--text-secondary)' }} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '1px', color: 'var(--text-muted)' }}>
                  STEP {stepIndex + 1}
                </span>
                <div style={{ height: 4, width: 4, borderRadius: '50%', background: 'var(--border)' }} />
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
                    color: currentStep.type === 'ACCEPT_EDGE' ? 'var(--accent-accept)' : currentStep.type === 'REJECT_EDGE' ? 'var(--accent-reject)' : 'var(--text-primary)',
                  }}
                >
                  {currentStep.type.replace(/_/g, ' ')}
                </span>
              </div>
              <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, fontWeight: 500 }}>
                {parseExplanation(currentStep.explanation)}
              </p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};

export default ExplanationBar;
