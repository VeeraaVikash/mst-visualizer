import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { GitGraph } from 'lucide-react';
import HeroGraphAnimation from './HeroGraphAnimation';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <section className="relative overflow-hidden py-20 px-6">
      <div className="max-w-6xl mx-auto flex items-center gap-12 flex-col lg:flex-row">
        <motion.div
          className="flex-1 z-10"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1
            className="font-sans font-bold leading-tight mb-6"
            style={{ color: 'var(--text-primary)', fontSize: 'clamp(36px, 5vw, 64px)' }}
          >
            Visualize Minimum{' '}
            <span style={{ color: 'var(--accent-accept)' }}>Spanning Trees</span>
          </h1>
          <p
            className="text-lg mb-8 max-w-lg leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            Step through Kruskal's and Prim's algorithms on interactive graphs.
            Built for engineers, by engineers.
          </p>
          <motion.button
            onClick={() => navigate('/app')}
            className="flex items-center gap-3 rounded-xl px-8 py-4 text-lg font-semibold transition-all"
            style={{
              background: 'var(--accent-accept)',
              color: '#fff',
              boxShadow: '0 0 20px color-mix(in srgb, var(--accent-accept) 40%, transparent)',
            }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <GitGraph size={22} />
            Launch Visualizer
          </motion.button>
        </motion.div>

        <motion.div
          className="flex-1 max-w-md"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div
            className="rounded-2xl p-4 graph-canvas"
            style={{
              background: 'var(--bg-canvas)',
              border: '1px solid var(--border)',
              boxShadow: '0 0 40px color-mix(in srgb, var(--accent-accept) 10%, transparent)',
            }}
          >
            <HeroGraphAnimation />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
