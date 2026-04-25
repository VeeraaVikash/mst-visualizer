import { useState, useEffect, useRef, useCallback, useMemo, useReducer } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon, Sun, Swords, GitGraph, Keyboard, Columns2, LayoutTemplate,
  ArrowLeft, MousePointer2, Link2, Shuffle, Trash2, Save, FolderOpen,
  Network, Waypoints, Play, Pause, SkipBack, SkipForward, RotateCcw,
  Gauge, Zap, SplitSquareHorizontal, BarChart2, ArrowLeftRight,
  CheckCircle, XCircle, ArrowRight, Circle, DollarSign, GitMerge,
  AlertCircle, AlertTriangle, Info, X, Terminal, Search, FileWarning, Ban, Unlink
} from "lucide-react";
import * as d3 from "d3";

/* ──────────────────────────────────────────────────────────────── */
/*  THEME SYSTEM                                                   */
/* ──────────────────────────────────────────────────────────────── */
const THEMES = {
  dark: {
    "--bg-base":"#0a0f1a","--bg-panel":"#0f1829","--bg-canvas":"#070d18",
    "--bg-elevated":"#172033","--border":"rgba(255,255,255,0.07)",
    "--text-primary":"#f1f5f9","--text-secondary":"#64748b","--text-muted":"#334155",
    "--accent-default":"#334155","--accent-active":"#f59e0b","--accent-accept":"#10b981",
    "--accent-reject":"#ef4444","--accent-candidate":"#3b82f6",
    "--dot-color":"rgba(255,255,255,0.04)"
  },
  light: {
    "--bg-base":"#f0f4f8","--bg-panel":"#ffffff","--bg-canvas":"#e8eef5",
    "--bg-elevated":"#f8fafc","--border":"rgba(0,0,0,0.09)",
    "--text-primary":"#0f172a","--text-secondary":"#475569","--text-muted":"#94a3b8",
    "--accent-default":"#94a3b8","--accent-active":"#d97706","--accent-accept":"#059669",
    "--accent-reject":"#dc2626","--accent-candidate":"#2563eb",
    "--dot-color":"rgba(0,0,0,0.06)"
  },
  crimson: {
    "--bg-base":"#0d0508","--bg-panel":"#130a0c","--bg-canvas":"#0a0306",
    "--bg-elevated":"#1f0e12","--border":"rgba(220,38,38,0.15)",
    "--text-primary":"#fef2f2","--text-secondary":"#9f1239","--text-muted":"#450a0a",
    "--accent-default":"#7f1d1d","--accent-active":"#f97316","--accent-accept":"#dc2626",
    "--accent-reject":"#6b21a8","--accent-candidate":"#fb923c",
    "--dot-color":"rgba(220,38,38,0.06)"
  }
};
const THEME_ORDER = ["dark","light","crimson"];
function applyTheme(t) {
  const vars = THEMES[t];
  const root = document.documentElement;
  root.setAttribute("data-theme", t);
  Object.entries(vars).forEach(([k,v]) => root.style.setProperty(k, v));
  try { localStorage.setItem("mst-theme", t); } catch {}
}
function getStoredTheme() {
  try { const s = localStorage.getItem("mst-theme"); if (s && THEMES[s]) return s; } catch {}
  return "dark";
}

/* ──────────────────────────────────────────────────────────────── */
/*  CSS INJECTION                                                  */
/* ──────────────────────────────────────────────────────────────── */
const GLOBAL_CSS = `
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap');
html { transition: background-color 400ms ease, color 400ms ease; }
body { font-family: 'Space Grotesk', sans-serif; }
* { box-sizing: border-box; }
::-webkit-scrollbar { width: 5px; }
::-webkit-scrollbar-track { background: var(--bg-panel); }
::-webkit-scrollbar-thumb { background: var(--accent-default); border-radius: 3px; }
.graph-canvas-bg {
  background-image: radial-gradient(circle, var(--dot-color) 1px, transparent 1px);
  background-size: 28px 28px;
}
.kbd-key {
  display: inline-flex; align-items: center; justify-content: center;
  min-width: 22px; padding: 2px 7px; font-family: 'JetBrains Mono', monospace;
  font-size: 11px; background: var(--bg-elevated); border: 1px solid var(--border);
  border-radius: 4px; box-shadow: 0 2px 0 var(--border); color: var(--text-secondary); line-height: 1.4;
}
@keyframes dash-flow { to { stroke-dashoffset: -20; } }
.edge-candidate { stroke-dasharray: 8 4; animation: dash-flow 0.8s linear infinite; }
input[type=range] { accent-color: var(--accent-active); }
`;

/* ──────────────────────────────────────────────────────────────── */
/*  UNION-FIND                                                     */
/* ──────────────────────────────────────────────────────────────── */
class UnionFind {
  constructor(nodes) { this.p = {}; this.r = {}; nodes.forEach(n => { this.p[n] = n; this.r[n] = 0; }); }
  find(x) { if (this.p[x] !== x) this.p[x] = this.find(this.p[x]); return this.p[x]; }
  union(a,b) {
    const ra = this.find(a), rb = this.find(b);
    if (ra === rb) return false;
    if (this.r[ra] < this.r[rb]) this.p[ra] = rb;
    else if (this.r[ra] > this.r[rb]) this.p[rb] = ra;
    else { this.p[rb] = ra; this.r[ra]++; }
    return true;
  }
  connected(a,b) { return this.find(a) === this.find(b); }
}

/* ──────────────────────────────────────────────────────────────── */
/*  ALGORITHMS                                                     */
/* ──────────────────────────────────────────────────────────────── */
function runKruskal(graph) {
  const steps = [];
  const ids = graph.nodes.map(n => n.id);
  const sorted = [...graph.edges].sort((a,b) => a.weight - b.weight);
  const uf = new UnionFind(ids);
  const mst = [], rej = [];
  let cost = 0;
  const target = ids.length - 1;

  steps.push({ type:"SORT_EDGES", explanation:`Sort all ${sorted.length} edges by weight ascending. Greedily pick lightest edge without creating a cycle.`,
    mstCost:0, edgesSelected:0, highlightedEdges:sorted.map(e=>e.id), mstEdges:[], rejectedEdges:[], candidateEdges:[], activeNodes:[] });

  for (const e of sorted) {
    if (mst.length >= target) break;
    steps.push({ type:"CONSIDER_EDGE", edgeId:e.id, explanation:`Considering ${e.source}-${e.target} (w=${e.weight}). Are they in the same component?`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[e.id], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[e.source,e.target] });
    if (uf.connected(e.source, e.target)) {
      rej.push(e.id);
      steps.push({ type:"REJECT_EDGE", edgeId:e.id, explanation:`Rejected! ${e.source} and ${e.target} already connected. Would create cycle.`,
        mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[] });
    } else {
      uf.union(e.source, e.target);
      mst.push(e.id); cost += e.weight;
      steps.push({ type:"ACCEPT_EDGE", edgeId:e.id, explanation:`Accepted! Different components. Cost: ${cost-e.weight} + ${e.weight} = ${cost}`,
        mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[e.source,e.target] });
    }
  }
  steps.push({ type:"COMPLETE", explanation:`Kruskal's complete! MST: ${mst.length} edges, total cost ${cost}.`,
    mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:ids });
  return steps;
}

function runPrim(graph, startId) {
  const steps = [];
  const ids = graph.nodes.map(n => n.id);
  const visited = new Set([startId]);
  const mst = [], rej = [];
  let cost = 0;

  steps.push({ type:"ADD_NODE", nodeId:startId, explanation:`Prim's: Start from node ${startId}. Grow tree by always picking cheapest crossing edge.`,
    mstCost:0, edgesSelected:0, highlightedEdges:[], mstEdges:[], rejectedEdges:[], candidateEdges:[], activeNodes:[startId] });

  while (visited.size < ids.length) {
    const cands = [];
    for (const e of graph.edges) {
      const sv = visited.has(e.source), tv = visited.has(e.target);
      if (sv && !tv) cands.push({ edge:e, newNode:e.target });
      else if (!sv && tv) cands.push({ edge:e, newNode:e.source });
    }
    if (!cands.length) break;

    const candIds = cands.map(c => c.edge.id);
    steps.push({ type:"HIGHLIGHT_CANDIDATES", explanation:`${cands.length} candidate edge(s) crossing the cut.`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:candIds, activeNodes:[...visited] });

    cands.sort((a,b) => a.edge.weight - b.edge.weight);
    const best = cands[0];
    steps.push({ type:"CONSIDER_EDGE", edgeId:best.edge.id, explanation:`Min-weight crossing edge: ${best.edge.source}-${best.edge.target} (w=${best.edge.weight}).`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[best.edge.id], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:candIds.filter(id=>id!==best.edge.id), activeNodes:[...visited] });

    visited.add(best.newNode);
    mst.push(best.edge.id); cost += best.edge.weight;
    steps.push({ type:"ACCEPT_EDGE", edgeId:best.edge.id, nodeId:best.newNode, explanation:`Accepted! ${best.edge.source}-${best.edge.target} (w=${best.edge.weight}). Node ${best.newNode} joined. Cost: ${cost}.`,
      mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[...visited] });
  }
  steps.push({ type:"COMPLETE", explanation:`Prim's complete! MST: ${mst.length} edges, total cost ${cost}.`,
    mstCost:cost, edgesSelected:mst.length, highlightedEdges:[], mstEdges:[...mst], rejectedEdges:[...rej], candidateEdges:[], activeNodes:[...visited] });
  return steps;
}

/* ──────────────────────────────────────────────────────────────── */
/*  GRAPH UTILITIES                                                */
/* ──────────────────────────────────────────────────────────────── */
function nodeLabel(i) {
  if (i < 26) return String.fromCharCode(65+i);
  return String.fromCharCode(65+Math.floor(i/26)-1) + String.fromCharCode(65+(i%26));
}

function generateRandom(count, w, h) {
  const cx = w/2, cy = h/2, r = Math.min(w,h)*0.35;
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const a = (2*Math.PI*i)/count - Math.PI/2;
    nodes.push({ id: nodeLabel(i), x: cx + r*Math.cos(a), y: cy + r*Math.sin(a) });
  }
  const edges = []; let ec = 0;
  // Spanning tree
  const shuf = [...nodes].sort(() => Math.random()-0.5);
  for (let i = 1; i < shuf.length; i++) {
    edges.push({ id:`e${ec++}`, source:shuf[i-1].id, target:shuf[i].id, weight:Math.floor(Math.random()*49)+1 });
  }
  // Extra edges
  let added = 0, att = 0;
  while (added < Math.floor(count*0.6) && att < 100) {
    att++;
    const a = Math.floor(Math.random()*count), b = Math.floor(Math.random()*count);
    if (a === b) continue;
    const s = nodes[a].id, t = nodes[b].id;
    if (edges.some(e => (e.source===s&&e.target===t)||(e.source===t&&e.target===s))) continue;
    edges.push({ id:`e${ec++}`, source:s, target:t, weight:Math.floor(Math.random()*49)+1 });
    added++;
  }
  return { nodes, edges };
}

function isConnected(graph) {
  if (graph.nodes.length === 0) return true;
  const adj = {};
  graph.nodes.forEach(n => adj[n.id] = []);
  graph.edges.forEach(e => { adj[e.source]?.push(e.target); adj[e.target]?.push(e.source); });
  const vis = new Set([graph.nodes[0].id]);
  const q = [graph.nodes[0].id];
  while (q.length) { const c = q.shift(); (adj[c]||[]).forEach(n => { if (!vis.has(n)) { vis.add(n); q.push(n); } }); }
  return vis.size === graph.nodes.length;
}

/* ──────────────────────────────────────────────────────────────── */
/*  HOOKS                                                          */
/* ──────────────────────────────────────────────────────────────── */
function useThemeHook() {
  const [theme, setTheme] = useState(getStoredTheme);
  useEffect(() => { applyTheme(theme); }, [theme]);
  const cycle = useCallback(() => setTheme(p => THEME_ORDER[(THEME_ORDER.indexOf(p)+1)%3]), []);
  return { theme, setTheme, cycle };
}

function useToastHook() {
  const [toasts, setToasts] = useState([]);
  const ctr = useRef(0);
  const add = useCallback((msg, icon="info") => {
    const id = `t${ctr.current++}`;
    setToasts(p => [...p.slice(-2), { id, message:msg, icon }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  const remove = useCallback(id => setToasts(p => p.filter(t => t.id !== id)), []);
  return { toasts, add, remove };
}

/* ──────────────────────────────────────────────────────────────── */
/*  SMALL COMPONENTS                                               */
/* ──────────────────────────────────────────────────────────────── */
const V = (k,v) => ({ [k]: v }); // shorthand
const cv = (name) => `var(--${name})`;

function ThemeToggle({ theme, setTheme }) {
  const items = [
    { n:"dark", I:Moon, l:"Dark" }, { n:"light", I:Sun, l:"Light" }, { n:"crimson", I:Swords, l:"Crimson" }
  ];
  return (
    <div style={{ display:"flex", gap:3, padding:3, borderRadius:8, background:cv("bg-elevated") }}>
      {items.map(t => (
        <button key={t.n} title={t.l} onClick={() => setTheme(t.n)} style={{
          display:"flex", alignItems:"center", justifyContent:"center",
          width:30, height:28, borderRadius:6, border: theme===t.n ? `1px solid ${cv("accent-active")}` : "1px solid transparent",
          background: theme===t.n ? cv("bg-panel") : "transparent",
          color: theme===t.n ? cv("text-primary") : cv("text-muted"),
          cursor:"pointer", boxShadow: theme===t.n ? `0 0 8px ${cv("accent-active")}` : "none", transition:"all 200ms"
        }}><t.I size={14} /></button>
      ))}
    </div>
  );
}

function ToastContainer({ toasts, remove }) {
  const iconMap = { error:AlertCircle, warning:AlertTriangle, info:Info, success:CheckCircle };
  const colorMap = { error:cv("accent-reject"), warning:cv("accent-active"), info:cv("accent-candidate"), success:cv("accent-accept") };
  return (
    <div style={{ position:"fixed", bottom:16, right:16, zIndex:100, display:"flex", flexDirection:"column", gap:8 }}>
      <AnimatePresence mode="popLayout">
        {toasts.map(t => { const Ic = iconMap[t.icon]; return (
          <motion.div key={t.id} initial={{opacity:0,y:30,scale:0.95}} animate={{opacity:1,y:0,scale:1}} exit={{opacity:0,x:60,scale:0.9}}
            transition={{duration:0.25}} style={{
              display:"flex", alignItems:"center", gap:10, padding:"10px 14px", borderRadius:10,
              background:cv("bg-elevated"), border:`1px solid ${colorMap[t.icon]}`, color:cv("text-primary"),
              fontFamily:"'JetBrains Mono',monospace", fontSize:12, minWidth:260, boxShadow:"0 4px 20px rgba(0,0,0,0.3)"
            }}>
            <Ic size={15} style={{color:colorMap[t.icon], flexShrink:0}} />
            <span style={{flex:1}}>{t.message}</span>
            <button onClick={() => remove(t.id)} style={{background:"none",border:"none",color:cv("text-muted"),cursor:"pointer"}}><X size={13}/></button>
          </motion.div>
        );})}
      </AnimatePresence>
    </div>
  );
}

function KbdHelpModal({ open, onClose }) {
  const items = [
    ["N","Add node mode"],["E","Connect edge mode"],["K","Kruskal's"],["P","Prim's"],
    ["Space","Play / Pause"],["R","Reset animation"],["\u2190 \u2192","Step back / forward"],
    ["C","Compare mode"],["G","Random graph"],["T","Cycle themes"],["?","This help"],["Esc","Close / deselect"]
  ];
  return (
    <AnimatePresence>
      {open && (<>
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose}
          style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.6)"}} />
        <motion.div style={{position:"fixed",inset:0,zIndex:201,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
          <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}} transition={{duration:0.2}}
            style={{background:cv("bg-panel"),border:`1px solid ${cv("border")}`,borderRadius:14,padding:24,maxWidth:420,width:"90%",
              pointerEvents:"auto",boxShadow:"0 20px 60px rgba(0,0,0,0.4)"}}>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:20}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <Keyboard size={18} style={{color:cv("accent-active")}} />
                <span style={{fontWeight:700,fontSize:16,color:cv("text-primary")}}>Keyboard Shortcuts</span>
              </div>
              <button onClick={onClose} style={{background:"none",border:"none",color:cv("text-secondary"),cursor:"pointer"}}><X size={16}/></button>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {items.map(([k,a]) => (
                <div key={k} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"6px 10px",borderRadius:8,background:cv("bg-elevated")}}>
                  <span className="kbd-key">{k}</span>
                  <span style={{fontSize:13,color:cv("text-secondary")}}>{a}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </>)}
    </AnimatePresence>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  HERO GRAPH ANIMATION (Landing)                                 */
/* ──────────────────────────────────────────────────────────────── */
function HeroGraph() {
  const ref = useRef(null);
  useEffect(() => {
    const svg = d3.select(ref.current); svg.selectAll("*").remove();
    const N = [{id:"A",x:150,y:80},{id:"B",x:280,y:50},{id:"C",x:350,y:160},{id:"D",x:280,y:270},{id:"E",x:150,y:250},{id:"F",x:70,y:160},{id:"G",x:210,y:165}];
    const E = [{s:"A",t:"B",w:7},{s:"B",t:"C",w:8},{s:"C",t:"D",w:5},{s:"D",t:"E",w:9},{s:"E",t:"F",w:6},{s:"F",t:"A",w:4},{s:"A",t:"G",w:2},{s:"G",t:"C",w:3},{s:"G",t:"E",w:10}];
    const MST = [["A","G"],["G","C"],["F","A"],["C","D"],["E","F"],["D","E"]];
    const eg = svg.selectAll(".eg").data(E).join("g").attr("class","eg");
    eg.append("line").attr("x1",d=>N.find(n=>n.id===d.s).x).attr("y1",d=>N.find(n=>n.id===d.s).y)
      .attr("x2",d=>N.find(n=>n.id===d.t).x).attr("y2",d=>N.find(n=>n.id===d.t).y)
      .attr("stroke","var(--accent-default)").attr("stroke-width",1.5).attr("opacity",0.6);
    eg.append("text").attr("x",d=>(N.find(n=>n.id===d.s).x+N.find(n=>n.id===d.t).x)/2)
      .attr("y",d=>(N.find(n=>n.id===d.s).y+N.find(n=>n.id===d.t).y)/2-6)
      .attr("text-anchor","middle").attr("font-family","JetBrains Mono").attr("font-size",9).attr("fill","var(--text-muted)").text(d=>d.w);
    const ng = svg.selectAll(".ng").data(N).join("g").attr("class","ng").attr("transform",d=>`translate(${d.x},${d.y})`);
    ng.append("circle").attr("r",18).attr("fill","var(--bg-elevated)").attr("stroke","var(--accent-default)").attr("stroke-width",1.5).attr("opacity",0.8);
    ng.append("text").attr("text-anchor","middle").attr("dominant-baseline","middle").attr("font-family","JetBrains Mono").attr("font-size",11).attr("fill","var(--text-primary)").attr("opacity",0.8).text(d=>d.id);
    function animate() {
      eg.select("line").attr("stroke","var(--accent-default)").attr("stroke-width",1.5).attr("opacity",0.6).attr("filter","none");
      ng.select("circle").attr("stroke","var(--accent-default)").attr("opacity",0.8);
      MST.forEach(([s,t],i) => {
        setTimeout(() => {
          if (!ref.current) return;
          eg.filter(d=>(d.s===s&&d.t===t)||(d.s===t&&d.t===s)).select("line")
            .transition().duration(400).attr("stroke","var(--accent-accept)").attr("stroke-width",2.5).attr("opacity",1).attr("filter","drop-shadow(0 0 6px var(--accent-accept))");
          ng.filter(d=>d.id===s||d.id===t).select("circle").transition().duration(400).attr("stroke","var(--accent-accept)").attr("opacity",1);
        }, 800+i*1000);
      });
    }
    animate();
    const iv = setInterval(animate, 8000);
    return () => clearInterval(iv);
  }, []);
  return <svg ref={ref} viewBox="0 0 420 320" style={{width:"100%",height:"100%",opacity:0.85}} />;
}

/* ──────────────────────────────────────────────────────────────── */
/*  LANDING PAGE                                                   */
/* ──────────────────────────────────────────────────────────────── */
function LandingPage({ goApp, theme, setTheme }) {
  const features = [
    { I:GitGraph, t:"Interactive Graph Creation", d:"Click to add nodes, drag to reposition. Connect edges with custom weights." },
    { I:Zap, t:"Step-by-Step Animation", d:"Watch algorithms execute with play, pause, and manual step controls." },
    { I:SplitSquareHorizontal, t:"Side-by-Side Compare", d:"Run Kruskal's and Prim's simultaneously on the same graph." },
    { I:BarChart2, t:"Live Statistics", d:"Track MST cost, edges selected, and data structures in real time." },
    { I:Network, t:"Kruskal's Algorithm", d:"Global greedy approach using Union-Find for cycle detection." },
    { I:Waypoints, t:"Prim's Algorithm", d:"Local greedy approach growing the tree from a seed node." },
  ];
  const algos = [
    { I:Network, n:"Kruskal's Algorithm", c:"O(E log E)", items:["Greedy, global edge selection","Uses Union-Find (Disjoint Set)","Sort all edges, greedily pick if no cycle"], col:cv("accent-accept") },
    { I:Waypoints, n:"Prim's Algorithm", c:"O(E log V)", items:["Greedy, local vertex expansion","Uses Priority Queue (Min-Heap)","Grow tree from seed, pick cheapest crossing edge"], col:cv("accent-candidate") },
  ];
  const shortcuts = [["Space","Play / Pause"],["R","Reset"],["N","Add node"],["E","Connect edge"],["K","Kruskal's"],["P","Prim's"],["C","Compare"],["\u2190 \u2192","Step"]];

  return (
    <div style={{minHeight:"100vh",background:cv("bg-base")}}>
      {/* Nav */}
      <nav style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 24px",borderBottom:`1px solid ${cv("border")}`,background:cv("bg-panel")}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <GitGraph size={20} style={{color:cv("accent-accept")}} />
          <span style={{fontWeight:700,fontSize:16,color:cv("text-primary")}}>MST Visualizer</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button onClick={goApp} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 18px",borderRadius:10,border:"none",background:cv("accent-accept"),color:"#fff",fontWeight:600,fontSize:14,cursor:"pointer"}}>
            <GitGraph size={16}/> Open Visualizer
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{padding:"70px 24px 50px",maxWidth:1100,margin:"0 auto",display:"flex",gap:48,alignItems:"center",flexWrap:"wrap"}}>
        <motion.div style={{flex:1,minWidth:300}} initial={{opacity:0,x:-40}} animate={{opacity:1,x:0}} transition={{duration:0.7}}>
          <h1 style={{fontWeight:700,lineHeight:1.1,marginBottom:20,color:cv("text-primary"),fontSize:"clamp(36px,5vw,60px)"}}>
            Visualize Minimum <span style={{color:cv("accent-accept")}}>Spanning Trees</span>
          </h1>
          <p style={{fontSize:17,marginBottom:28,color:cv("text-secondary"),maxWidth:480,lineHeight:1.6}}>
            Step through Kruskal's and Prim's algorithms on interactive graphs. Built for engineers, by engineers.
          </p>
          <motion.button onClick={goApp} whileHover={{scale:1.03}} whileTap={{scale:0.98}}
            style={{display:"flex",alignItems:"center",gap:10,padding:"14px 32px",borderRadius:14,border:"none",
              background:cv("accent-accept"),color:"#fff",fontSize:17,fontWeight:600,cursor:"pointer",
              boxShadow:`0 0 24px color-mix(in srgb, ${cv("accent-accept")} 40%, transparent)`}}>
            <GitGraph size={20}/> Launch Visualizer
          </motion.button>
        </motion.div>
        <motion.div style={{flex:1,maxWidth:440,minWidth:280}} initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:0.7,delay:0.2}}>
          <div className="graph-canvas-bg" style={{borderRadius:16,padding:16,background:cv("bg-canvas"),border:`1px solid ${cv("border")}`,
            boxShadow:`0 0 40px color-mix(in srgb, ${cv("accent-accept")} 10%, transparent)`}}>
            <HeroGraph />
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section style={{padding:"50px 24px",maxWidth:1100,margin:"0 auto"}}>
        <motion.h2 initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{textAlign:"center",fontWeight:700,fontSize:24,marginBottom:36,color:cv("text-primary")}}>
          Everything You Need to Master MST
        </motion.h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:14}}>
          {features.map((f,i) => (
            <motion.div key={f.t} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.07}}
              whileHover={{y:-4}}
              style={{padding:22,borderRadius:14,background:cv("bg-panel"),border:`1px solid ${cv("border")}`,cursor:"default"}}>
              <div style={{width:38,height:38,borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",background:cv("bg-elevated"),marginBottom:14}}>
                <f.I size={18} style={{color:cv("accent-accept")}} />
              </div>
              <div style={{fontWeight:600,fontSize:15,marginBottom:6,color:cv("text-primary")}}>{f.t}</div>
              <div style={{fontSize:13,color:cv("text-secondary"),lineHeight:1.5}}>{f.d}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Algorithm cards */}
      <section style={{padding:"50px 24px",maxWidth:1100,margin:"0 auto"}}>
        <motion.h2 initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}}
          style={{textAlign:"center",fontWeight:700,fontSize:24,marginBottom:36,color:cv("text-primary")}}>
          Two Algorithms, One Goal
        </motion.h2>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:20}}>
          {algos.map((a,i) => (
            <motion.div key={a.n} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.15}}
              style={{padding:24,borderRadius:14,background:cv("bg-panel"),border:`1px solid ${a.col}`,
                boxShadow:`0 0 20px color-mix(in srgb, ${a.col} 10%, transparent)`}}>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
                <a.I size={22} style={{color:a.col}} />
                <span style={{fontWeight:700,fontSize:18,color:cv("text-primary")}}>{a.n}</span>
              </div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,padding:"4px 10px",borderRadius:6,display:"inline-block",marginBottom:16,background:cv("bg-elevated"),color:a.col}}>{a.c}</div>
              {a.items.map((t,j) => (
                <div key={j} style={{display:"flex",alignItems:"flex-start",gap:8,marginBottom:8}}>
                  <ArrowRight size={13} style={{color:a.col,marginTop:3,flexShrink:0}} />
                  <span style={{fontSize:13,color:cv("text-secondary")}}>{t}</span>
                </div>
              ))}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Keyboard shortcuts */}
      <section style={{padding:"50px 24px",maxWidth:800,margin:"0 auto"}}>
        <motion.div initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} style={{textAlign:"center",marginBottom:28}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:10,marginBottom:8}}>
            <Keyboard size={22} style={{color:cv("accent-active")}} />
            <span style={{fontWeight:700,fontSize:22,color:cv("text-primary")}}>Built for speed. Keyboard-first.</span>
          </div>
          <p style={{fontSize:13,color:cv("text-secondary")}}>Every action has a keyboard shortcut.</p>
        </motion.div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(180px,1fr))",gap:10}}>
          {shortcuts.map(([k,a],i) => (
            <motion.div key={k} initial={{opacity:0,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.04}}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 14px",borderRadius:10,background:cv("bg-panel"),border:`1px solid ${cv("border")}`}}>
              <span className="kbd-key">{k}</span>
              <span style={{fontSize:12,color:cv("text-secondary")}}>{a}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{padding:28,textAlign:"center",borderTop:`1px solid ${cv("border")}`,fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:cv("text-muted")}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8}}>
          <GitGraph size={14} style={{color:cv("accent-accept")}} />
          Built for CS students. Powered by React + D3.
        </div>
      </footer>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  GRAPH CANVAS (D3)                                              */
/* ──────────────────────────────────────────────────────────────── */
function GraphCanvasComp({ graph, step, mode, connectSrc, onCanvasClick, onNodeClick, onNodeDrag, isComplete }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;
    const svg = d3.select(svgRef.current);
    const rect = containerRef.current.getBoundingClientRect();
    const W = rect.width, H = rect.height;
    svg.attr("width",W).attr("height",H).attr("viewBox",`0 0 ${W} ${H}`);

    svg.on("click", function(event) {
      const tag = event.target.tagName;
      if (tag === "svg" || tag === "rect") {
        const [x,y] = d3.pointer(event, this);
        onCanvasClick(x,y);
      }
    });

    // EDGES
    const eg = svg.selectAll(".eg").data(graph.edges, d=>d.id).join(
      en => { const g = en.append("g").attr("class","eg"); g.append("line").attr("class","el"); g.append("rect").attr("class","eb"); g.append("text").attr("class","ew"); return g; },
      up => up, ex => ex.remove()
    );
    eg.each(function(d) {
      const g = d3.select(this);
      const s = graph.nodes.find(n=>n.id===d.source), t = graph.nodes.find(n=>n.id===d.target);
      if (!s||!t) return;
      let st = "default";
      if (step) {
        if (step.mstEdges.includes(d.id)) st = "accepted";
        else if (step.rejectedEdges.includes(d.id)) st = "rejected";
        else if (step.candidateEdges.includes(d.id)) st = "candidate";
        else if (step.highlightedEdges.includes(d.id)) st = "considering";
      }
      let stroke=cv("accent-default"),sw=2,flt="none",da="none";
      if (st==="considering") { stroke=cv("accent-active"); sw=3; flt=`drop-shadow(0 0 8px ${cv("accent-active")})`; }
      else if (st==="accepted") { stroke=cv("accent-accept"); sw=3; flt=`drop-shadow(0 0 ${isComplete?14:10}px ${cv("accent-accept")})`; }
      else if (st==="rejected") { stroke=cv("accent-reject"); sw=2; flt=`drop-shadow(0 0 4px ${cv("accent-reject")})`; }
      else if (st==="candidate") { stroke=cv("accent-candidate"); sw=2; da="8 4"; }

      const line = g.select(".el");
      line.transition().duration(300).attr("x1",s.x).attr("y1",s.y).attr("x2",t.x).attr("y2",t.y)
        .attr("stroke",stroke).attr("stroke-width",sw).attr("filter",flt).attr("stroke-dasharray",da);
      if (st==="candidate") line.classed("edge-candidate",true); else line.classed("edge-candidate",false);

      const mx=(s.x+t.x)/2, my=(s.y+t.y)/2, tw=String(d.weight).length*8+10;
      g.select(".eb").attr("x",mx-tw/2).attr("y",my-10).attr("width",tw).attr("height",18).attr("rx",4)
        .attr("fill",cv("bg-panel")).attr("stroke",cv("border")).attr("stroke-width",1);
      g.select(".ew").attr("x",mx).attr("y",my+3).attr("text-anchor","middle").attr("font-family","JetBrains Mono")
        .attr("font-size",11).attr("fill",st!=="default"?stroke:cv("text-secondary")).text(d.weight);
    });

    // NODES
    const ng = svg.selectAll(".ng").data(graph.nodes, d=>d.id).join(
      en => { const g = en.append("g").attr("class","ng").attr("cursor","pointer"); g.append("circle").attr("class","nc"); g.append("text").attr("class","nl"); return g; },
      up => up, ex => ex.remove()
    );
    ng.each(function(d) {
      const g = d3.select(this);
      const isActive = step?.activeNodes?.includes(d.id);
      const isSrc = connectSrc === d.id;
      let sc=cv("accent-default"),sw=2,flt="none";
      if (isSrc) { sc=cv("accent-active"); sw=3; flt=`drop-shadow(0 0 8px ${cv("accent-active")})`; }
      else if (isActive) { sc=cv("accent-accept"); sw=2.5; flt=`drop-shadow(0 0 6px ${cv("accent-accept")})`; }
      if (isComplete && isActive) flt=`drop-shadow(0 0 12px ${cv("accent-accept")})`;
      g.attr("transform",`translate(${d.x},${d.y})`);
      g.select(".nc").transition().duration(300).attr("r",28).attr("fill",cv("bg-elevated")).attr("stroke",sc).attr("stroke-width",sw).attr("filter",flt);
      g.select(".nl").attr("text-anchor","middle").attr("dominant-baseline","middle").attr("font-family","JetBrains Mono").attr("font-size",14).attr("font-weight",600).attr("fill",cv("text-primary")).text(d.id);
      g.on("click", ev => { ev.stopPropagation(); onNodeClick(d.id); });
    });

    // DRAG
    if (mode === "select") {
      ng.call(d3.drag().on("start",function(){ d3.select(this).raise(); })
        .on("drag",function(event,d){ const x=Math.max(30,Math.min(W-30,event.x)),y=Math.max(30,Math.min(H-30,event.y)); d3.select(this).attr("transform",`translate(${x},${y})`); onNodeDrag(d.id,x,y); }));
    } else { ng.on(".drag",null); }
  }, [graph, step, mode, connectSrc, onCanvasClick, onNodeClick, onNodeDrag, isComplete]);

  return (
    <div ref={containerRef} className="graph-canvas-bg" style={{width:"100%",height:"100%",position:"relative"}}>
      <svg ref={svgRef} style={{width:"100%",height:"100%"}}><rect width="100%" height="100%" fill="transparent"/></svg>
      {mode !== "select" && (
        <div style={{position:"absolute",top:10,left:"50%",transform:"translateX(-50%)",fontFamily:"'JetBrains Mono',monospace",fontSize:11,
          padding:"4px 12px",borderRadius:20,background:cv("bg-elevated"),border:`1px solid ${cv("accent-active")}`,color:cv("accent-active")}}>
          {mode==="addNode"?"Click canvas to add node":connectSrc?`Click target (from ${connectSrc})`:"Click source node"}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  COMPARE CANVAS                                                 */
/* ──────────────────────────────────────────────────────────────── */
function CompareCanvasComp({ graph, kStep, pStep, kDone, pDone }) {
  const svgRef = useRef(null);
  const containerRef = useRef(null);
  const render = useCallback(() => {
    if (!svgRef.current||!containerRef.current) return;
    const r = containerRef.current.getBoundingClientRect();
    const W=r.width, H=r.height;
    const svg = d3.select(svgRef.current); svg.attr("width",W).attr("height",H).attr("viewBox",`0 0 ${W} ${H}`); svg.selectAll("*").remove();
    const half = W/2;
    svg.append("line").attr("x1",half).attr("y1",0).attr("x2",half).attr("y2",H).attr("stroke","var(--border)").attr("stroke-width",1);
    function drawHalf(g, step, ox, done, label) {
      g.append("text").attr("x",ox+half/2).attr("y",22).attr("text-anchor","middle").attr("font-family","JetBrains Mono").attr("font-size",12).attr("font-weight",600).attr("fill","var(--text-secondary)").text(label);
      if (graph.nodes.length===0) return;
      const gcx=graph.nodes.reduce((s,n)=>s+n.x,0)/graph.nodes.length, gcy=graph.nodes.reduce((s,n)=>s+n.y,0)/graph.nodes.length;
      const sc=0.42, cx=ox+half/2, cy=H/2+10;
      const mx=x=>cx+(x-gcx)*sc, my=y=>cy+(y-gcy)*sc;
      for (const e of graph.edges) {
        const s=graph.nodes.find(n=>n.id===e.source),t=graph.nodes.find(n=>n.id===e.target); if(!s||!t) continue;
        let st="var(--accent-default)",sw=1.5,f="none";
        if(step){
          if(step.mstEdges.includes(e.id)){st="var(--accent-accept)";sw=2.5;f=`drop-shadow(0 0 ${done?10:6}px var(--accent-accept))`;}
          else if(step.rejectedEdges.includes(e.id)){st="var(--accent-reject)";sw=1.5;}
          else if(step.highlightedEdges.includes(e.id)){st="var(--accent-active)";sw=2;}
          else if(step.candidateEdges.includes(e.id)){st="var(--accent-candidate)";sw=1.5;}
        }
        g.append("line").attr("x1",mx(s.x)).attr("y1",my(s.y)).attr("x2",mx(t.x)).attr("y2",my(t.y)).attr("stroke",st).attr("stroke-width",sw).attr("filter",f);
        g.append("text").attr("x",(mx(s.x)+mx(t.x))/2).attr("y",(my(s.y)+my(t.y))/2-4).attr("text-anchor","middle").attr("font-family","JetBrains Mono").attr("font-size",8).attr("fill","var(--text-muted)").text(e.weight);
      }
      for (const n of graph.nodes) {
        const nx=mx(n.x),ny=my(n.y),act=step?.activeNodes?.includes(n.id);
        g.append("circle").attr("cx",nx).attr("cy",ny).attr("r",16).attr("fill","var(--bg-elevated)")
          .attr("stroke",act?"var(--accent-accept)":"var(--accent-default)").attr("stroke-width",act?2:1.5)
          .attr("filter",act&&done?"drop-shadow(0 0 8px var(--accent-accept))":"none");
        g.append("text").attr("x",nx).attr("y",ny).attr("text-anchor","middle").attr("dominant-baseline","middle").attr("font-family","JetBrains Mono").attr("font-size",10).attr("font-weight",600).attr("fill","var(--text-primary)").text(n.id);
      }
      if(step) g.append("text").attr("x",ox+half/2).attr("y",H-14).attr("text-anchor","middle").attr("font-family","JetBrains Mono").attr("font-size",11).attr("fill",done?"var(--accent-accept)":"var(--text-secondary)").text(`Cost: ${step.mstCost}`);
    }
    drawHalf(svg.append("g"), kStep, 0, kDone, "Kruskal's");
    drawHalf(svg.append("g"), pStep, half, pDone, "Prim's");
  }, [graph, kStep, pStep, kDone, pDone]);
  useEffect(() => render(), [render]);
  useEffect(() => { const o = new ResizeObserver(render); if(containerRef.current) o.observe(containerRef.current); return()=>o.disconnect(); }, [render]);
  return <div ref={containerRef} className="graph-canvas-bg" style={{width:"100%",height:"100%"}}><svg ref={svgRef} style={{width:"100%",height:"100%"}}/></div>;
}

/* ──────────────────────────────────────────────────────────────── */
/*  EXPLANATION BAR                                                */
/* ──────────────────────────────────────────────────────────────── */
function ExplanationBar({ step, idx }) {
  const icons = { SORT_EDGES:Zap, CONSIDER_EDGE:Search, ACCEPT_EDGE:CheckCircle, REJECT_EDGE:XCircle, ADD_NODE:ArrowRight, HIGHLIGHT_CANDIDATES:Search, COMPLETE:CheckCircle };
  return (
    <div style={{height:74,padding:"10px 16px",display:"flex",alignItems:"flex-start",gap:10,background:cv("bg-panel"),borderTop:`1px solid ${cv("border")}`,flexShrink:0,overflow:"hidden"}}>
      <Terminal size={15} style={{color:cv("text-muted"),flexShrink:0,marginTop:2}} />
      <AnimatePresence mode="wait">
        {step ? (
          <motion.div key={idx} initial={{opacity:0,y:14}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-14}} transition={{duration:0.2}} style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:4}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,textTransform:"uppercase",letterSpacing:"0.5px",color:cv("text-muted")}}>Step {idx+1}</span>
              {(() => { const Ic = icons[step.type]; return Ic ? <Ic size={13} style={{color:step.type==="ACCEPT_EDGE"?cv("accent-accept"):step.type==="REJECT_EDGE"?cv("accent-reject"):cv("text-secondary")}} /> : null; })()}
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,textTransform:"uppercase",
                color:step.type==="ACCEPT_EDGE"?cv("accent-accept"):step.type==="REJECT_EDGE"?cv("accent-reject"):cv("text-secondary")}}>
                {step.type.replace(/_/g," ")}
              </span>
            </div>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:cv("text-secondary"),lineHeight:1.5,margin:0}}>{step.explanation}</p>
          </motion.div>
        ) : (
          <motion.div key="idle" initial={{opacity:0}} animate={{opacity:1}} style={{flex:1}}>
            <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:cv("text-muted"),margin:0}}>Ready. Create a graph and run an algorithm to begin.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  VISUALIZER PAGE                                                */
/* ──────────────────────────────────────────────────────────────── */
function VisualizerPage({ goLanding, theme, setTheme, cycleTheme }) {
  // Graph state
  const [graph, setGraph] = useState({ nodes:[], edges:[] });
  const [mode, setMode] = useState("select"); // select | addNode | connectEdge
  const [connectSrc, setConnectSrc] = useState(null);
  const edgeCtr = useRef(0);

  // Algorithm state
  const [algoType, setAlgoType] = useState("kruskal");
  const [startNode, setStartNode] = useState("A");
  const [steps, setSteps] = useState([]);
  const [stepIdx, setStepIdx] = useState(-1);
  const [playing, setPlaying] = useState(false);
  const [complete, setComplete] = useState(false);
  const [speed, setSpeed] = useState(50);
  const playRef = useRef(null);

  // Compare
  const [compareOn, setCompareOn] = useState(false);
  const [kSteps, setKSteps] = useState([]);
  const [pSteps, setPSteps] = useState([]);
  const [cIdx, setCIdx] = useState(-1);
  const [cPlaying, setCPlaying] = useState(false);
  const cRef = useRef(null);

  // UI
  const [showHelp, setShowHelp] = useState(false);
  const [weightPopup, setWeightPopup] = useState(null);
  const [nodeCount, setNodeCount] = useState(7);
  const fileRef = useRef(null);
  const canvasContRef = useRef(null);
  const weightInputRef = useRef(null);

  const toast = useToastHook();

  // Computed
  const curStep = stepIdx >= 0 && stepIdx < steps.length ? steps[stepIdx] : null;
  const targetMst = graph.nodes.length > 0 ? graph.nodes.length - 1 : 0;

  // Graph operations
  const addNode = useCallback((x,y) => {
    setGraph(p => {
      const id = nodeLabel(p.nodes.length);
      return { ...p, nodes:[...p.nodes, {id,x,y}] };
    });
  }, []);

  const updatePos = useCallback((id,x,y) => {
    setGraph(p => ({ ...p, nodes: p.nodes.map(n => n.id===id ? {...n,x,y} : n) }));
  }, []);

  const addEdge = useCallback((src, tgt, w) => {
    if (src === tgt) { toast.add("Cannot connect a node to itself","error"); return; }
    if (graph.edges.some(e => (e.source===src&&e.target===tgt)||(e.source===tgt&&e.target===src))) { toast.add(`Edge ${src}-${tgt} already exists`,"error"); return; }
    if (!Number.isInteger(w) || w < 1 || w > 999) { toast.add("Weight must be 1-999","warning"); return; }
    const id = `e${edgeCtr.current++}`;
    setGraph(p => ({ ...p, edges:[...p.edges, {id,source:src,target:tgt,weight:w}] }));
  }, [graph.edges, toast]);

  const resetGraph = useCallback(() => { setGraph({nodes:[],edges:[]}); setConnectSrc(null); edgeCtr.current=0; resetAlgo(); }, []);
  const resetAlgo = useCallback(() => { setSteps([]); setStepIdx(-1); setPlaying(false); setComplete(false); if(playRef.current) clearInterval(playRef.current); }, []);

  const doRandom = useCallback((cnt) => {
    const el = canvasContRef.current;
    const w = el?.clientWidth || 700, h = el?.clientHeight || 450;
    const g = generateRandom(cnt, w, h);
    setGraph(g); edgeCtr.current = g.edges.length; setConnectSrc(null); resetAlgo();
  }, [resetAlgo]);

  const initAlgo = useCallback(() => {
    if (graph.nodes.length < 2) { toast.add("Add at least 2 nodes","info"); return; }
    if (graph.edges.length < 1) { toast.add("Add at least 1 edge","info"); return; }
    if (!isConnected(graph)) { toast.add("Graph is disconnected","warning"); return; }
    const s = algoType === "kruskal" ? runKruskal(graph) : runPrim(graph, startNode || graph.nodes[0].id);
    setSteps(s); setStepIdx(-1); setPlaying(false); setComplete(false);
  }, [graph, algoType, startNode, toast]);

  // Playback
  const stepFwd = useCallback(() => {
    setStepIdx(p => {
      if (p + 1 >= steps.length) { setComplete(true); setPlaying(false); return p; }
      const n = p + 1;
      if (steps[n]?.type === "COMPLETE") { setComplete(true); setPlaying(false); }
      return n;
    });
  }, [steps]);

  const stepBack = useCallback(() => { setStepIdx(p => { if (p <= 0) return -1; setComplete(false); return p-1; }); }, []);

  const togglePlay = useCallback(() => {
    if (playing) { setPlaying(false); return; }
    if (steps.length === 0) { initAlgo(); return; }
    if (complete) { setStepIdx(-1); setComplete(false); }
    setPlaying(true);
  }, [playing, steps.length, complete, initAlgo]);

  useEffect(() => {
    if (playing && steps.length > 0) {
      const delay = Math.max(200, 2000 - speed * 18);
      playRef.current = setInterval(() => {
        setStepIdx(p => {
          const n = p+1;
          if (n >= steps.length) { setPlaying(false); setComplete(true); clearInterval(playRef.current); return p; }
          if (steps[n]?.type === "COMPLETE") { setPlaying(false); setComplete(true); clearInterval(playRef.current); }
          return n;
        });
      }, delay);
    } else if (playRef.current) { clearInterval(playRef.current); playRef.current = null; }
    return () => { if (playRef.current) clearInterval(playRef.current); };
  }, [playing, speed, steps]);

  // Compare mode
  const toggleCompare = useCallback(() => {
    setCompareOn(p => !p);
    setCPlaying(false); setCIdx(-1);
    if (cRef.current) clearInterval(cRef.current);
  }, []);

  const initCompare = useCallback(() => {
    if (graph.nodes.length < 2 || graph.edges.length < 1 || !isConnected(graph)) return;
    const ks = runKruskal(graph), ps = runPrim(graph, graph.nodes[0]?.id || "A");
    setKSteps(ks); setPSteps(ps); setCIdx(-1); setCPlaying(true);
  }, [graph]);

  useEffect(() => {
    if (compareOn && graph.nodes.length >= 2 && graph.edges.length >= 1 && isConnected(graph)) initCompare();
  }, [compareOn]);

  useEffect(() => {
    if (compareOn && cPlaying) {
      const maxL = Math.max(kSteps.length, pSteps.length);
      const delay = Math.max(200, 2000 - speed * 18);
      cRef.current = setInterval(() => {
        setCIdx(p => { const n=p+1; if(n>=maxL){setCPlaying(false);clearInterval(cRef.current);return p;} return n; });
      }, delay);
    } else if (cRef.current) { clearInterval(cRef.current); cRef.current = null; }
    return () => { if(cRef.current) clearInterval(cRef.current); };
  }, [compareOn, cPlaying, kSteps.length, pSteps.length, speed]);

  const kCurStep = cIdx>=0&&cIdx<kSteps.length?kSteps[cIdx]:null;
  const pCurStep = cIdx>=0&&cIdx<pSteps.length?pSteps[cIdx]:null;

  // Canvas click/node click
  const handleCanvasClick = useCallback((x,y) => { if(mode==="addNode") addNode(x,y); }, [mode,addNode]);
  const handleNodeClick = useCallback((id) => {
    if (mode === "connectEdge") {
      if (!connectSrc) { setConnectSrc(id); }
      else {
        const s = graph.nodes.find(n=>n.id===id), src = graph.nodes.find(n=>n.id===connectSrc);
        if (s&&src) {
          setWeightPopup({source:connectSrc,target:id,x:(src.x+s.x)/2,y:(src.y+s.y)/2});
          setTimeout(()=>weightInputRef.current?.focus(),50);
        }
      }
    }
  }, [mode, connectSrc, graph.nodes]);

  const submitWeight = useCallback((val) => {
    if (!weightPopup) return;
    const w = parseInt(val,10);
    if (isNaN(w)||w<1||w>999) { toast.add("Weight must be 1-999","warning"); }
    else addEdge(weightPopup.source,weightPopup.target,w);
    setWeightPopup(null); setConnectSrc(null);
  }, [weightPopup,addEdge,toast]);

  // Save/Load
  const saveGraph = useCallback(() => {
    const data = { version:"1.0", nodes:graph.nodes, edges:graph.edges };
    const blob = new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
    const a = document.createElement("a"); a.href=URL.createObjectURL(blob); a.download="mst-graph.json"; a.click();
    toast.add("Graph saved","success");
  }, [graph, toast]);

  const loadGraph = useCallback((e) => {
    const file = e.target.files?.[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const d = JSON.parse(ev.target.result);
        if (!d.nodes||!d.edges) throw new Error();
        setGraph({nodes:d.nodes,edges:d.edges}); edgeCtr.current = d.edges.length; setConnectSrc(null); resetAlgo();
        toast.add("Graph loaded","success");
      } catch { toast.add("Invalid graph file","error"); }
    };
    reader.readAsText(file); e.target.value="";
  }, [toast, resetAlgo]);

  // Toggle modes
  const toggleNodeMode = useCallback(() => { setMode(p=>p==="addNode"?"select":"addNode"); setConnectSrc(null); }, []);
  const toggleEdgeMode = useCallback(() => { setMode(p=>p==="connectEdge"?"select":"connectEdge"); setConnectSrc(null); }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e) => {
      const t = e.target;
      if (t.tagName==="INPUT"||t.tagName==="TEXTAREA"||t.tagName==="SELECT") { if(e.key==="Escape") t.blur(); return; }
      switch(e.key) {
        case " ": e.preventDefault(); togglePlay(); break;
        case "r": case "R": resetAlgo(); setStepIdx(-1); break;
        case "n": case "N": toggleNodeMode(); break;
        case "e": case "E": toggleEdgeMode(); break;
        case "k": case "K": setAlgoType("kruskal"); resetAlgo(); break;
        case "p": case "P": setAlgoType("prim"); resetAlgo(); break;
        case "c": case "C": toggleCompare(); break;
        case "ArrowRight": e.preventDefault(); if(compareOn){const mx=Math.max(kSteps.length,pSteps.length);setCIdx(p=>Math.min(p+1,mx-1));}else stepFwd(); break;
        case "ArrowLeft": e.preventDefault(); if(compareOn) setCIdx(p=>Math.max(p-1,-1)); else stepBack(); break;
        case "g": case "G": doRandom(nodeCount); break;
        case "t": case "T": cycleTheme(); break;
        case "?": case "/": e.preventDefault(); setShowHelp(p=>!p); break;
        case "Escape": setShowHelp(false); setMode("select"); setConnectSrc(null); setWeightPopup(null); break;
      }
    };
    window.addEventListener("keydown",handler);
    return () => window.removeEventListener("keydown",handler);
  }, [togglePlay, resetAlgo, toggleNodeMode, toggleEdgeMode, toggleCompare, stepFwd, stepBack, doRandom, cycleTheme, nodeCount, compareOn, kSteps.length, pSteps.length]);

  // Right panel - sorted edges
  const sortedEdges = algoType === "kruskal" ? [...graph.edges].sort((a,b)=>a.weight-b.weight) : graph.edges;

  // ToolButton
  const TB = ({icon:Ic,label,shortcut,active,onClick}) => (
    <button onClick={onClick} style={{position:"relative",display:"flex",alignItems:"center",gap:6,borderRadius:8,padding:"7px 10px",fontSize:11,
      fontFamily:"'JetBrains Mono',monospace",border:`1px solid ${active?cv("accent-active"):cv("border")}`,
      background:active?cv("accent-active"):cv("bg-elevated"),color:active?"#000":cv("text-secondary"),cursor:"pointer",width:"100%",transition:"all 150ms"}}>
      <Ic size={13}/>{label}
      {shortcut && <span style={{position:"absolute",bottom:2,right:4,fontSize:9,opacity:0.4,fontFamily:"'JetBrains Mono',monospace"}}>{shortcut}</span>}
    </button>
  );

  const SL = ({label}) => (
    <div style={{display:"flex",alignItems:"center",gap:6,margin:"14px 0 8px"}}>
      <div style={{height:1,flex:1,background:cv("border")}}/>
      <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,textTransform:"uppercase",letterSpacing:"0.8px",color:cv("text-muted")}}>{label}</span>
      <div style={{height:1,flex:1,background:cv("border")}}/>
    </div>
  );

  const progress = steps.length > 0 ? ((stepIdx+1)/steps.length)*100 : 0;
  const curEdge = curStep?.edgeId ? graph.edges.find(e=>e.id===curStep.edgeId) : null;

  return (
    <div style={{height:"100vh",display:"flex",flexDirection:"column",overflow:"hidden",background:cv("bg-base")}}>
      {/* HEADER */}
      <header style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 14px",height:48,background:cv("bg-panel"),borderBottom:`1px solid ${cv("border")}`,flexShrink:0}}>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <button onClick={goLanding} style={{background:"none",border:"none",color:cv("text-secondary"),cursor:"pointer",display:"flex"}}><ArrowLeft size={16}/></button>
          <div style={{display:"flex",alignItems:"center",gap:6,cursor:"pointer"}} onClick={goLanding}>
            <GitGraph size={18} style={{color:cv("accent-accept")}}/>
            <span style={{fontWeight:700,fontSize:14,color:cv("text-primary")}}>MST Visualizer</span>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:8,marginLeft:14}}>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,padding:"2px 8px",borderRadius:4,
              background:cv("bg-elevated"),border:`1px solid ${algoType==="kruskal"?cv("accent-accept"):cv("border")}`,
              color:algoType==="kruskal"?cv("accent-accept"):cv("text-muted")}}>Kruskal O(E log E)</span>
            <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,padding:"2px 8px",borderRadius:4,
              background:cv("bg-elevated"),border:`1px solid ${algoType==="prim"?cv("accent-accept"):cv("border")}`,
              color:algoType==="prim"?cv("accent-accept"):cv("text-muted")}}>Prim O(E log V)</span>
            {graph.nodes.length>0 && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,color:cv("text-secondary")}}>V={graph.nodes.length} E={graph.edges.length}</span>}
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <button onClick={toggleCompare} title="Compare [C]" style={{display:"flex",alignItems:"center",gap:5,borderRadius:8,padding:"5px 12px",fontSize:11,fontFamily:"'JetBrains Mono',monospace",
            border:`1px solid ${cv("border")}`,background:compareOn?cv("accent-active"):cv("bg-elevated"),color:compareOn?"#000":cv("text-secondary"),cursor:"pointer"}}>
            {compareOn?<Columns2 size={13}/>:<LayoutTemplate size={13}/>}{compareOn?"Comparing":"Compare"}
          </button>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <button onClick={()=>setShowHelp(true)} title="Shortcuts [?]" style={{display:"flex",alignItems:"center",justifyContent:"center",width:32,height:32,borderRadius:8,
            background:cv("bg-elevated"),border:`1px solid ${cv("border")}`,color:cv("text-secondary"),cursor:"pointer"}}><Keyboard size={14}/></button>
        </div>
      </header>

      {/* BODY */}
      <div style={{display:"flex",flex:1,minHeight:0}}>
        {/* LEFT PANEL */}
        <div style={{width:260,background:cv("bg-panel"),borderRight:`1px solid ${cv("border")}`,overflowY:"auto",padding:"0 10px 10px",flexShrink:0}}>
          <SL label="Canvas"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <TB icon={MousePointer2} label="Add Node" shortcut="N" active={mode==="addNode"} onClick={toggleNodeMode}/>
            <TB icon={Link2} label="Connect" shortcut="E" active={mode==="connectEdge"} onClick={toggleEdgeMode}/>
            <TB icon={Shuffle} label="Random" shortcut="G" onClick={()=>doRandom(nodeCount)}/>
            <TB icon={Trash2} label="Reset" onClick={resetGraph}/>
            <TB icon={Save} label="Save" onClick={saveGraph}/>
            <TB icon={FolderOpen} label="Load" onClick={()=>fileRef.current?.click()}/>
          </div>
          <input ref={fileRef} type="file" accept=".json" style={{display:"none"}} onChange={loadGraph}/>
          <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}>
            <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:cv("text-muted")}}>Nodes:</span>
            {[5,7,10].map(n => (
              <button key={n} onClick={()=>setNodeCount(n)} style={{padding:"2px 8px",borderRadius:4,fontSize:11,fontFamily:"'JetBrains Mono',monospace",cursor:"pointer",
                border:`1px solid ${nodeCount===n?cv("accent-active"):cv("border")}`,background:nodeCount===n?cv("accent-active"):cv("bg-elevated"),color:nodeCount===n?"#000":cv("text-secondary")}}>{n}</button>
            ))}
          </div>

          <SL label="Algorithm"/>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            <TB icon={Network} label="Kruskal's" shortcut="K" active={algoType==="kruskal"} onClick={()=>{setAlgoType("kruskal");resetAlgo();}}/>
            <TB icon={Waypoints} label="Prim's" shortcut="P" active={algoType==="prim"} onClick={()=>{setAlgoType("prim");resetAlgo();}}/>
          </div>
          {algoType==="prim"&&graph.nodes.length>0 && (
            <div style={{display:"flex",alignItems:"center",gap:6,marginTop:8}}>
              <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:cv("text-muted")}}>Start:</span>
              <select value={startNode} onChange={e=>setStartNode(e.target.value)} style={{borderRadius:4,padding:"3px 6px",fontSize:11,fontFamily:"'JetBrains Mono',monospace",
                background:cv("bg-elevated"),color:cv("text-primary"),border:`1px solid ${cv("border")}`,outline:"none"}}>
                {graph.nodes.map(n=><option key={n.id} value={n.id}>{n.id}</option>)}
              </select>
            </div>
          )}
          <button onClick={initAlgo} style={{width:"100%",marginTop:10,padding:"8px 0",borderRadius:8,border:"none",fontWeight:600,fontSize:13,cursor:"pointer",
            background:cv("accent-accept"),color:"#fff"}}>Run Algorithm</button>

          <SL label="Controls"/>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:6}}>
            <button onClick={stepBack} style={{borderRadius:8,padding:7,background:cv("bg-elevated"),border:`1px solid ${cv("border")}`,color:cv("text-secondary"),cursor:"pointer"}}><SkipBack size={15}/></button>
            <button onClick={togglePlay} style={{borderRadius:8,padding:10,background:cv("accent-active"),border:"none",color:"#000",cursor:"pointer",position:"relative"}}>
              {playing?<Pause size={16}/>:<Play size={16}/>}
              <span style={{position:"absolute",bottom:1,right:2,fontSize:7,opacity:0.4,fontFamily:"'JetBrains Mono',monospace"}}>Spc</span>
            </button>
            <button onClick={stepFwd} style={{borderRadius:8,padding:7,background:cv("bg-elevated"),border:`1px solid ${cv("border")}`,color:cv("text-secondary"),cursor:"pointer"}}><SkipForward size={15}/></button>
            <button onClick={()=>{resetAlgo();setStepIdx(-1);}} title="Reset [R]" style={{borderRadius:8,padding:7,background:cv("bg-elevated"),border:`1px solid ${cv("border")}`,color:cv("text-secondary"),cursor:"pointer"}}><RotateCcw size={15}/></button>
          </div>

          <SL label="Speed"/>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <Gauge size={13} style={{color:cv("text-muted")}}/>
            <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:cv("text-muted")}}>Slow</span>
            <input type="range" min={1} max={100} value={speed} onChange={e=>setSpeed(Number(e.target.value))} style={{flex:1}}/>
            <span style={{fontSize:9,fontFamily:"'JetBrains Mono',monospace",color:cv("text-muted")}}>Fast</span>
          </div>
        </div>

        {/* CENTER CANVAS */}
        <div ref={canvasContRef} style={{flex:1,position:"relative",minWidth:0,background:cv("bg-canvas")}}>
          {compareOn ? (
            <CompareCanvasComp graph={graph} kStep={kCurStep} pStep={pCurStep} kDone={kCurStep?.type==="COMPLETE"} pDone={pCurStep?.type==="COMPLETE"}/>
          ) : (
            <GraphCanvasComp graph={graph} step={curStep} mode={mode} connectSrc={connectSrc} onCanvasClick={handleCanvasClick} onNodeClick={handleNodeClick} onNodeDrag={updatePos} isComplete={complete}/>
          )}
          {/* Weight popup */}
          {weightPopup && (
            <div style={{position:"absolute",zIndex:20,left:weightPopup.x-60,top:weightPopup.y-20,display:"flex",alignItems:"center",gap:6,padding:8,borderRadius:10,
              background:cv("bg-panel"),border:`1px solid ${cv("accent-active")}`,boxShadow:"0 4px 16px rgba(0,0,0,0.3)"}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cv("text-secondary")}}>{weightPopup.source}-{weightPopup.target} w=</span>
              <input ref={weightInputRef} type="number" min={1} max={999} defaultValue={1}
                style={{width:50,borderRadius:4,padding:"3px 6px",fontSize:11,fontFamily:"'JetBrains Mono',monospace",background:cv("bg-elevated"),color:cv("text-primary"),border:`1px solid ${cv("border")}`,outline:"none"}}
                onKeyDown={e=>{if(e.key==="Enter")submitWeight(e.target.value);if(e.key==="Escape"){setWeightPopup(null);setConnectSrc(null);}}}
                onBlur={e=>submitWeight(e.target.value)}/>
            </div>
          )}
        </div>

        {/* RIGHT PANEL */}
        {!compareOn && (
          <div style={{width:280,background:cv("bg-panel"),borderLeft:`1px solid ${cv("border")}`,overflowY:"auto",padding:"0 10px 10px",flexShrink:0}}>
            <SL label="Status"/>
            <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:6}}>
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cv("text-secondary")}}>Step {stepIdx>=0?stepIdx+1:0} / {steps.length}</span>
            </div>
            <div style={{width:"100%",height:6,borderRadius:3,overflow:"hidden",background:cv("bg-elevated")}}>
              <div style={{height:"100%",borderRadius:3,transition:"all 300ms",width:`${progress}%`,background:curStep?.type==="COMPLETE"?cv("accent-accept"):cv("accent-active")}}/>
            </div>

            {curEdge && (<>
              <SL label="Current Edge"/>
              <div style={{borderRadius:8,padding:10,background:cv("bg-elevated"),border:`1px solid ${cv("border")}`}}>
                <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                  <ArrowLeftRight size={13} style={{color:cv("accent-active")}}/>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:600,color:cv("text-primary")}}>{curEdge.source} - {curEdge.target}</span>
                  <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,marginLeft:"auto",color:cv("text-secondary")}}>w={curEdge.weight}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:6}}>
                  {curStep.type==="ACCEPT_EDGE"?<><CheckCircle size={13} style={{color:cv("accent-accept")}}/><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cv("accent-accept")}}>ACCEPTED</span></>
                  :curStep.type==="REJECT_EDGE"?<><XCircle size={13} style={{color:cv("accent-reject")}}/><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cv("accent-reject")}}>REJECTED</span></>
                  :<><ArrowRight size={13} style={{color:cv("accent-active")}}/><span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cv("accent-active")}}>EVALUATING</span></>}
                </div>
              </div>
            </>)}

            <SL label="MST Progress"/>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <DollarSign size={13} style={{color:cv("accent-accept")}}/> <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cv("text-secondary")}}>Total Cost:</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:13,fontWeight:700,marginLeft:"auto",color:cv("text-primary")}}>{curStep?.mstCost??0}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <GitMerge size={13} style={{color:cv("accent-accept")}}/> <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cv("text-secondary")}}>Edges:</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,marginLeft:"auto",color:cv("text-primary")}}>{curStep?.edgesSelected??0} / {targetMst}</span>
              </div>
              <div style={{display:"flex",alignItems:"center",gap:6}}>
                <Network size={13} style={{color:cv("accent-accept")}}/> <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cv("text-secondary")}}>Nodes:</span>
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,marginLeft:"auto",color:cv("text-primary")}}>{curStep?.activeNodes?.length??0} / {graph.nodes.length}</span>
              </div>
            </div>

            <SL label="Edge List"/>
            <div style={{display:"flex",flexDirection:"column",gap:3,maxHeight:200,overflowY:"auto"}}>
              {sortedEdges.map(edge => {
                const isMst=curStep?.mstEdges?.includes(edge.id), isRej=curStep?.rejectedEdges?.includes(edge.id),
                  isCur=curStep?.highlightedEdges?.includes(edge.id), isCand=curStep?.candidateEdges?.includes(edge.id);
                let Ic=Circle, col=cv("text-muted");
                if(isMst){Ic=CheckCircle;col=cv("accent-accept");}else if(isRej){Ic=XCircle;col=cv("accent-reject");}
                else if(isCur){Ic=ArrowRight;col=cv("accent-active");}else if(isCand){Ic=ArrowRight;col=cv("accent-candidate");}
                return (
                  <div key={edge.id} style={{display:"flex",alignItems:"center",gap:6,borderRadius:4,padding:"3px 6px",fontFamily:"'JetBrains Mono',monospace",fontSize:11,
                    background:isCur?cv("bg-elevated"):"transparent",color:col}}>
                    <Ic size={11} style={{color:col,flexShrink:0}}/> <span>{edge.source}-{edge.target}</span> <span style={{marginLeft:"auto"}}>w={edge.weight}</span>
                  </div>
                );
              })}
              {sortedEdges.length===0 && <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:11,color:cv("text-muted")}}>No edges</span>}
            </div>
          </div>
        )}
      </div>

      {/* BOTTOM */}
      <ExplanationBar step={compareOn?(kCurStep||pCurStep):curStep} idx={compareOn?cIdx:stepIdx}/>

      <ToastContainer toasts={toast.toasts} remove={toast.remove}/>
      <KbdHelpModal open={showHelp} onClose={()=>setShowHelp(false)}/>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────── */
/*  APP ROOT                                                       */
/* ──────────────────────────────────────────────────────────────── */
export default function App() {
  const { theme, setTheme, cycle } = useThemeHook();
  const [page, setPage] = useState("landing");

  // Inject CSS once
  useEffect(() => {
    if (!document.getElementById("mst-global-css")) {
      const s = document.createElement("style");
      s.id = "mst-global-css";
      s.textContent = GLOBAL_CSS;
      document.head.appendChild(s);
    }
    applyTheme(theme);
  }, []);

  if (page === "landing") {
    return <LandingPage goApp={() => setPage("app")} theme={theme} setTheme={setTheme} />;
  }
  return <VisualizerPage goLanding={() => setPage("landing")} theme={theme} setTheme={setTheme} cycleTheme={cycle} />;
}
