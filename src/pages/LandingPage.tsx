import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { GitBranch, Activity, History, Globe, TrendingUp, Zap, Package, Keyboard, Wifi, Bolt, MapPin, Server, ArrowRight } from 'lucide-react';
import * as d3 from 'd3';
import type { ThemeName } from '../types';
import ThemeToggle from '../components/shared/ThemeToggle';

function AnimatedGraph() {
  const ref = useRef<SVGSVGElement>(null);
  useEffect(() => {
    const svg = d3.select(ref.current!);
    const N = [{ id: 'A', x: 160, y: 80 }, { id: 'B', x: 300, y: 55 }, { id: 'C', x: 70, y: 200 }, { id: 'D', x: 220, y: 200 }, { id: 'E', x: 340, y: 190 }, { id: 'F', x: 130, y: 330 }, { id: 'G', x: 280, y: 340 }];
    const E = [{ s: 'A', t: 'B', w: 4 }, { s: 'A', t: 'C', w: 8 }, { s: 'A', t: 'D', w: 7 }, { s: 'B', t: 'D', w: 9 }, { s: 'B', t: 'E', w: 10 }, { s: 'C', t: 'D', w: 2 }, { s: 'C', t: 'F', w: 1 }, { s: 'D', t: 'E', w: 5 }, { s: 'D', t: 'G', w: 6 }, { s: 'E', t: 'G', w: 11 }, { s: 'F', t: 'G', w: 3 }];
    const MST = [['C', 'F'], ['C', 'D'], ['A', 'B'], ['C', 'F'], ['D', 'G'], ['D', 'E'], ['A', 'D']].slice(0, 6);

    svg.selectAll('*').remove();
    const eg = svg.selectAll('.eg').data(E).join('g').attr('class', 'eg');
    eg.append('line').attr('x1', d => N.find(n => n.id === d.s)!.x).attr('y1', d => N.find(n => n.id === d.s)!.y)
      .attr('x2', d => N.find(n => n.id === d.t)!.x).attr('y2', d => N.find(n => n.id === d.t)!.y)
      .attr('stroke', 'var(--accent-default)').attr('stroke-width', 1.5).attr('opacity', 0.5);
    eg.append('text').attr('x', d => (N.find(n => n.id === d.s)!.x + N.find(n => n.id === d.t)!.x) / 2)
      .attr('y', d => (N.find(n => n.id === d.s)!.y + N.find(n => n.id === d.t)!.y) / 2 - 5)
      .attr('text-anchor', 'middle').attr('font-family', 'JetBrains Mono').attr('font-size', 8)
      .attr('fill', 'var(--text-muted)').text(d => d.w);
    const ng = svg.selectAll('.ng').data(N).join('g').attr('class', 'ng').attr('transform', d => `translate(${d.x},${d.y})`);
    ng.append('circle').attr('r', 18).attr('fill', 'var(--bg-elevated)').attr('stroke', 'var(--accent-default)').attr('stroke-width', 1.5).attr('opacity', 0.8);
    ng.append('text').attr('text-anchor', 'middle').attr('dominant-baseline', 'middle').attr('font-family', 'JetBrains Mono').attr('font-size', 9).attr('font-weight', 600).attr('fill', 'var(--text-primary)').text(d => d.id);

    function animate() {
      eg.select('line').attr('stroke', 'var(--accent-default)').attr('stroke-width', 1.5).attr('opacity', 0.5).attr('filter', 'none');
      ng.select('circle').attr('stroke', 'var(--accent-default)').attr('opacity', 0.8);
      MST.forEach(([s, t], i) => {
        setTimeout(() => {
          if (!ref.current) return;
          eg.filter(d => (d.s === s && d.t === t) || (d.s === t && d.t === s)).select('line')
            .transition().duration(400).attr('stroke', 'var(--accent-accept)').attr('stroke-width', 3).attr('opacity', 1).attr('filter', 'drop-shadow(0 0 8px var(--glow-accept))');
          ng.filter(d => d.id === s || d.id === t).select('circle').transition().duration(400).attr('stroke', 'var(--accent-accept)').attr('opacity', 1);
        }, 500 + i * 800);
      });
    }
    animate();
    const iv = setInterval(animate, 8000);
    return () => clearInterval(iv);
  }, []);
  return <svg ref={ref} viewBox="0 0 400 400" style={{ width: '100%', height: '100%' }} />;
}

interface Props { goApp: (sc?: string) => void; theme: ThemeName; setTheme: (t: ThemeName) => void; }

const FEATURES = [
  { I: Activity,  t: 'Real-Time Race',   d: "Watch Kruskal's vs Prim's run on the same graph, side-by-side, step-by-step with live cost tracking" },
  { I: History,   t: 'Step History',     d: 'Full decision log for every step — click any entry to jump back and replay from that point' },
  { I: Globe,     t: 'Real-World Scenarios', d: 'Telecom networks, power grids, road infrastructure, data centers — pre-loaded with realistic edge weights' },
  { I: TrendingUp,t: 'Cost Analytics',   d: 'Live savings calculator: see exactly how much your MST saves vs connecting every possible link' },
  { I: Zap,       t: 'Keyboard-First',   d: '14 shortcuts — play, step, switch algorithms, cycle themes, and reset without touching the mouse' },
  { I: Package,   t: 'Save & Load',      d: 'Export any graph as JSON, reload it anytime — share scenarios with teammates or pick up where you left off' },
];

const USE_CASES = [
  { I: Wifi,   t: 'Telecom',     d: 'Min-cost fiber to connect cities',      sc: 'telecom' },
  { I: Bolt,   t: 'Power Grid',  d: 'Reduce transmission infrastructure',    sc: 'power' },
  { I: MapPin, t: 'Road Network',d: 'Plan cost-efficient road construction',  sc: 'roads' },
  { I: Server, t: 'Data Centers',d: 'Optimize links and minimize latency',    sc: 'datacenter' },
];

export default function LandingPage({ goApp, theme, setTheme }: Props) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)' }}>
      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 28px', borderBottom: '1px solid var(--border)', background: 'var(--bg-panel)', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent-accept), var(--accent-candidate))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <GitBranch size={15} style={{ color: '#fff' }} />
          </div>
          <span style={{ fontWeight: 800, fontSize: 17, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Route D. Optimal</span>
          <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 4, background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", border: '1px solid var(--border)' }}>v2.0</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <ThemeToggle theme={theme} setTheme={setTheme} />
          <motion.button onClick={() => goApp()} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 18px', borderRadius: 10, border: 'none', background: 'linear-gradient(135deg, var(--accent-accept), var(--accent-candidate))', color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            <GitBranch size={14} /> Launch App
          </motion.button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 24px 40px', display: 'flex', gap: 40, alignItems: 'center', flexWrap: 'wrap' }}>
        <motion.div style={{ flex: 1, minWidth: 280 }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18, padding: '4px 12px', width: 'fit-content', borderRadius: 20, background: 'var(--bg-elevated)', border: '1px solid var(--border)' }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-accept)', animation: 'pulse-glow 1.5s ease-in-out infinite' }} />
            <span style={{ fontSize: 11, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace" }}>Minimum Spanning Tree · Network Optimizer</span>
          </div>
          <h1 style={{ fontWeight: 800, lineHeight: 1.05, marginBottom: 18, color: 'var(--text-primary)', fontSize: 'clamp(34px, 5vw, 56px)', letterSpacing: '-1px' }}>
            Forge the<br />
            <span style={{ background: 'linear-gradient(135deg, var(--accent-accept), var(--accent-candidate))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              perfect network.
            </span>
          </h1>
          <p style={{ fontSize: 16, marginBottom: 12, color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.65 }}>
            Designing cost-efficient communication networks requires selecting optimal connections while minimizing total cost. Route D. Optimal makes this <em>visual, interactive, and intuitive.</em>
          </p>
          <p style={{ fontSize: 14, marginBottom: 30, color: 'var(--text-muted)', maxWidth: 460, lineHeight: 1.6 }}>
            Step through Kruskal's and Prim's algorithms. Race them side-by-side. Load real-world scenarios. Understand every edge decision.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <motion.button onClick={() => goApp()} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '13px 26px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, var(--accent-accept), var(--accent-candidate))', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 0 32px color-mix(in srgb, var(--accent-accept) 30%, transparent)' }}>
              <GitBranch size={18} /> Launch Route D. Optimal
            </motion.button>
            <button onClick={() => goApp('telecom')}
              style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '13px 20px', borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              <Wifi size={15} /> Try Telecom Demo
            </button>
          </div>
        </motion.div>
        <motion.div style={{ flex: 1, maxWidth: 380, minWidth: 240 }} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.7, delay: 0.2 }}>
          <div className="dot-grid" style={{ borderRadius: 20, padding: 14, background: 'var(--bg-canvas)', border: '1px solid var(--border)', boxShadow: '0 0 60px color-mix(in srgb, var(--accent-accept) 12%, transparent)' }}>
            <AnimatedGraph />
          </div>
        </motion.div>
      </section>

      {/* Use cases */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 50px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
          {USE_CASES.map((u, i) => (
            <motion.div key={u.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              onClick={() => goApp(u.sc)} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px', borderRadius: 12, background: 'var(--bg-panel)', border: '1px solid var(--border)', cursor: 'pointer' }}>
              <u.I size={18} style={{ color: 'var(--accent-accept)', flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text-primary)' }}>{u.t}</div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>{u.d}</div>
              </div>
              <ArrowRight size={13} style={{ color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px 60px' }}>
        <motion.h2 initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', fontWeight: 800, fontSize: 28, marginBottom: 32, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
          More than visualization
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
          {FEATURES.map((f, i) => (
            <motion.div key={f.t} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }} whileHover={{ y: -3 }}
              style={{ padding: 20, borderRadius: 14, background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', marginBottom: 12, border: '1px solid var(--border)' }}>
                <f.I size={17} style={{ color: 'var(--accent-accept)' }} />
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 5, color: 'var(--text-primary)' }}>{f.t}</div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.d}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Shortcuts */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 60px' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, marginBottom: 6 }}>
            <Keyboard size={20} style={{ color: 'var(--accent-active)' }} />
            <h2 style={{ fontWeight: 800, fontSize: 22, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Keyboard-first design</h2>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Every action reachable without the mouse.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 6 }}>
          {[['N','Add node'],['E','Connect'],['D','Delete'],['K',"Kruskal's"],['P',"Prim's"],['Space','Play/Pause'],['C','Race'],['G','Random'],['T','Themes'],['Z','Fit view'],['?','Help'],['Esc','Cancel']].map(([k,a]) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 9, background: 'var(--bg-panel)', border: '1px solid var(--border)' }}>
              <span className="kbd">{k}</span>
              <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{a}</span>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ padding: 24, textAlign: 'center', borderTop: '1px solid var(--border)', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <GitBranch size={13} style={{ color: 'var(--accent-accept)' }} />
          Route D. Optimal v2.0 — Network Cost Optimizer · React + D3 + Framer Motion
        </div>
      </footer>
    </div>
  );
}
