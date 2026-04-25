import { useState, useCallback, useRef, useEffect } from 'react';
import type { Graph, AlgorithmStep, AlgorithmType } from '../types';
import { runKruskal } from '../algorithms/kruskal';
import { runPrim } from '../algorithms/prim';

export function useAlgorithm() {
  const [algorithmType, setAlgorithmType] = useState<AlgorithmType>('kruskal');
  const [startNode, setStartNode] = useState<string>('A');
  const [steps, setSteps] = useState<AlgorithmStep[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [speed, setSpeed] = useState(50);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const computeSteps = useCallback((graph: Graph, algo: AlgorithmType, start: string): AlgorithmStep[] => {
    if (graph.nodes.length < 2 || graph.edges.length < 1) return [];
    if (algo === 'kruskal') {
      return runKruskal(graph);
    } else {
      return runPrim(graph, start);
    }
  }, []);

  const initAlgorithm = useCallback((graph: Graph) => {
    const s = computeSteps(graph, algorithmType, startNode);
    setSteps(s);
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsComplete(false);
  }, [algorithmType, startNode, computeSteps]);

  const resetAlgorithm = useCallback(() => {
    setSteps([]);
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsComplete(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const stepForward = useCallback(() => {
    setCurrentStep(prev => {
      const next = prev + 1;
      if (next >= steps.length) {
        setIsComplete(true);
        setIsPlaying(false);
        return prev;
      }
      if (steps[next]?.type === 'COMPLETE') {
        setIsComplete(true);
        setIsPlaying(false);
      }
      return next;
    });
  }, [steps]);

  const stepBackward = useCallback(() => {
    setCurrentStep(prev => {
      if (prev <= 0) return -1;
      setIsComplete(false);
      return prev - 1;
    });
  }, []);

  const play = useCallback(() => {
    if (steps.length === 0) return;
    if (isComplete) {
      setCurrentStep(-1);
      setIsComplete(false);
    }
    setIsPlaying(true);
  }, [steps.length, isComplete]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const togglePlayPause = useCallback(() => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }, [isPlaying, play, pause]);

  const resetAnimation = useCallback(() => {
    setCurrentStep(-1);
    setIsPlaying(false);
    setIsComplete(false);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      const delay = Math.max(200, 2000 - speed * 18);
      intervalRef.current = setInterval(() => {
        setCurrentStep(prev => {
          const next = prev + 1;
          if (next >= steps.length) {
            setIsPlaying(false);
            setIsComplete(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
            return prev;
          }
          if (steps[next]?.type === 'COMPLETE') {
            setIsPlaying(false);
            setIsComplete(true);
            if (intervalRef.current) clearInterval(intervalRef.current);
          }
          return next;
        });
      }, delay);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isPlaying, speed, steps]);

  const currentStepData = currentStep >= 0 && currentStep < steps.length ? steps[currentStep] : null;

  return {
    algorithmType,
    setAlgorithmType,
    startNode,
    setStartNode,
    steps,
    currentStep,
    isPlaying,
    isComplete,
    speed,
    setSpeed,
    currentStepData,
    initAlgorithm,
    resetAlgorithm,
    stepForward,
    stepBackward,
    play,
    pause,
    togglePlayPause,
    resetAnimation,
  };
}
