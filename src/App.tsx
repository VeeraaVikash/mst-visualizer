import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from './hooks/useTheme';
import LandingPage from './pages/LandingPage';
import VisualizerPage from './pages/VisualizerPage';

export default function App() {
  const { theme, setTheme, cycleTheme } = useTheme();

  return (
    <Routes>
      <Route path="/" element={<LandingPage theme={theme} setTheme={setTheme} />} />
      <Route path="/app" element={
        <VisualizerPage theme={theme} setTheme={setTheme} cycleTheme={cycleTheme} />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
