import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import VisualizerPage from './pages/VisualizerPage';
import { useTheme } from './hooks/useTheme';

const App: React.FC = () => {
  const { theme, cycleTheme, setSpecificTheme } = useTheme();

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage theme={theme} setSpecificTheme={setSpecificTheme} />} />
        <Route path="/app" element={<VisualizerPage theme={theme} setSpecificTheme={setSpecificTheme} cycleTheme={cycleTheme} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
