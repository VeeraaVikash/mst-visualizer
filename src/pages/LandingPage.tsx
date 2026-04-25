import React from 'react';
import { GitGraph } from 'lucide-react';
import type { ThemeName } from '../types';
import Header from '../components/shared/Header';
import HeroSection from '../components/landing/HeroSection';
import FeaturesGrid from '../components/landing/FeaturesGrid';
import AlgorithmCards from '../components/landing/AlgorithmCards';
import KeyboardPreview from '../components/landing/KeyboardPreview';

interface LandingPageProps {
  theme: ThemeName;
  setSpecificTheme: (t: ThemeName) => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ theme, setSpecificTheme }) => {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)' }}>
      <Header theme={theme} setSpecificTheme={setSpecificTheme} />
      <HeroSection />
      <FeaturesGrid />
      <AlgorithmCards />
      <KeyboardPreview />
      <footer
        className="py-8 text-center font-mono text-xs"
        style={{ color: 'var(--text-muted)', borderTop: '1px solid var(--border)' }}
      >
        <div className="flex items-center justify-center gap-2">
          <GitGraph size={14} style={{ color: 'var(--accent-accept)' }} />
          Built for CS students. Powered by React + D3.
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
