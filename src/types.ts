export type ThemeName = 'dark' | 'light' | 'crimson';
export type AlgorithmType = 'kruskal' | 'prim';
export type CanvasMode = 'select' | 'addNode' | 'connectEdge';
export type RightTab = 'info' | 'history' | 'race' | 'stats';

export interface GraphNode { id: string; x: number; y: number; }
export interface GraphEdge { id: string; source: string; target: string; weight: number; }
export interface Graph { nodes: GraphNode[]; edges: GraphEdge[]; }

export type StepType = 'SORT_EDGES'|'CONSIDER_EDGE'|'ACCEPT_EDGE'|'REJECT_EDGE'|'ADD_NODE'|'HIGHLIGHT_CANDIDATES'|'COMPLETE';

export interface AlgorithmStep {
  type: StepType; edgeId?: string; nodeId?: string; explanation: string;
  mstCost: number; edgesSelected: number; highlightedEdges: string[];
  mstEdges: string[]; rejectedEdges: string[]; candidateEdges: string[];
  activeNodes: string[]; costDelta: number; ufState?: Record<string,string>;
}

export interface ToastMessage { id: string; message: string; icon: 'error'|'warning'|'info'|'success'; }
export interface SavedGraph { version: string; scenario?: string; nodes: GraphNode[]; edges: GraphEdge[]; }
export interface WeightPopup { source: string; target: string; x: number; y: number; }
