import { useEffect } from 'react';

interface ShortcutHandlers {
  onPlayPause: () => void;
  onReset: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onToggleNodeMode: () => void;
  onToggleEdgeMode: () => void;
  onSwitchKruskal: () => void;
  onSwitchPrim: () => void;
  onToggleCompare: () => void;
  onCycleTheme: () => void;
  onRandomGraph: () => void;
  onShowHelp: () => void;
  onEscape: () => void;
}

export function useKeyboardShortcuts(handlers: ShortcutHandlers, enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') {
        if (e.key === 'Escape') {
          (target as HTMLInputElement).blur();
        }
        return;
      }

      switch (e.key) {
        case ' ':
          e.preventDefault();
          handlers.onPlayPause();
          break;
        case 'r':
        case 'R':
          handlers.onReset();
          break;
        case 'n':
        case 'N':
          handlers.onToggleNodeMode();
          break;
        case 'e':
        case 'E':
          handlers.onToggleEdgeMode();
          break;
        case 'k':
        case 'K':
          handlers.onSwitchKruskal();
          break;
        case 'p':
        case 'P':
          handlers.onSwitchPrim();
          break;
        case 'c':
        case 'C':
          handlers.onToggleCompare();
          break;
        case 'ArrowRight':
          e.preventDefault();
          handlers.onStepForward();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handlers.onStepBackward();
          break;
        case 'g':
        case 'G':
          handlers.onRandomGraph();
          break;
        case 't':
        case 'T':
          handlers.onCycleTheme();
          break;
        case '?':
        case '/':
          e.preventDefault();
          handlers.onShowHelp();
          break;
        case 'Escape':
          handlers.onEscape();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handlers, enabled]);
}
