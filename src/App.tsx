import React, { useState } from 'react';
import { useTheme } from './hooks/useTheme';
import LandingPage from './pages/LandingPage';
import VisualizerPage from './pages/VisualizerPage';

export default function App() {
  const { theme, setTheme, cycleTheme } = useTheme();
  const [page, setPage] = useState<'landing' | 'app'>('landing');
  const [initScenario, setInitScenario] = useState('telecom');

  const goApp = (sc?: string) => {
    if (sc) setInitScenario(sc);
    setPage('app');
  };

  if (page === 'landing') {
    return <LandingPage goApp={goApp} theme={theme} setTheme={setTheme} />;
  }
  return (
    <VisualizerPage
      goLanding={() => setPage('landing')}
      theme={theme}
      setTheme={setTheme}
      cycleTheme={cycleTheme}
      initialScenario={initScenario}
    />
  );
}
