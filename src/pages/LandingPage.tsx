import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { GitBranch, Activity, History, Globe, TrendingUp, Zap, Package, Keyboard, Wifi, Bolt, MapPin, Server, ArrowRight } from 'lucide-react';
import type { ThemeName } from '../types';
import ThemeToggle from '../components/shared/ThemeToggle';
import ParticleBackground from '../components/landing/ParticleBackground';
import MouseClickAnimation from '../components/landing/MouseClickAnimation';
import SpotlightCard from '../components/landing/SpotlightCard';
import CreativeGraphAnimation from '../components/landing/CreativeGraphAnimation';

interface Props {
  goApp: (sc?: string) => void;
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
}

const FEATURES = [
  { I: Activity,  t: 'Real-Time Race',   d: "Visualize Kruskal's vs Prim's side-by-side with live metrics." },
  { I: History,   t: 'Step History',     d: 'Interactive decision log. Replay and jump to any point instantly.' },
  { I: Globe,     t: 'Real-World Maps',  d: 'Telecom, grids, roads. Pre-loaded with realistic weights.' },
  { I: TrendingUp,t: 'Cost Analytics',   d: 'Live savings calculator. Track your optimal efficiency.' },
  { I: Zap,       t: 'Keyboard-First',   d: 'Fully controllable without a mouse for maximum speed.' },
  { I: Package,   t: 'Save & Share',     d: 'Export graphs as JSON and share scenarios with your team.' },
];

const USE_CASES = [
  { I: Wifi,   t: 'Telecom',     d: 'Min-cost fiber to connect cities',      sc: 'telecom' },
  { I: Bolt,   t: 'Power Grid',  d: 'Reduce transmission infrastructure',    sc: 'power' },
  { I: MapPin, t: 'Road Network',d: 'Plan cost-efficient road construction',  sc: 'roads' },
  { I: Server, t: 'Data Centers',d: 'Optimize links and minimize latency',    sc: 'datacenter' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

export default function LandingPage({ goApp, theme, setTheme }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: scrollRef });
  
  // Smooth parallax effect for background
  const bgY = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <div 
      ref={scrollRef} 
      style={{ 
        height: '100vh', 
        overflowY: 'auto', 
        overflowX: 'hidden', 
        background: 'var(--bg-base)',
        position: 'relative',
        scrollBehavior: 'smooth'
      }}
    >
      <ParticleBackground />
      <MouseClickAnimation />
      
      <motion.div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', y: bgY, zIndex: 0, pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-10%', width: '50vw', height: '50vw', background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-accept) 5%, transparent) 0%, transparent 60%)', borderRadius: '50%', filter: 'blur(80px)' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '-10%', width: '40vw', height: '40vw', background: 'radial-gradient(circle, color-mix(in srgb, var(--accent-candidate) 4%, transparent) 0%, transparent 60%)', borderRadius: '50%', filter: 'blur(80px)' }} />
      </motion.div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Nav */}
        <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid color-mix(in srgb, var(--border) 50%, transparent)', background: 'color-mix(in srgb, var(--bg-panel) 80%, transparent)', backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'linear-gradient(135deg, var(--accent-accept), var(--accent-candidate))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px color-mix(in srgb, var(--accent-accept) 30%, transparent)' }}>
              <GitBranch size={16} style={{ color: '#fff' }} />
            </div>
            <span style={{ fontWeight: 800, fontSize: 18, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Route D. Optimal</span>
            <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 6, background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace", border: '1px solid var(--border)' }}>v2.0</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <motion.button onClick={() => goApp()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 20px', borderRadius: 12, border: 'none', background: 'var(--text-primary)', color: 'var(--bg-base)', fontWeight: 700, fontSize: 14, cursor: 'pointer', transition: 'background 0.2s' }}>
              <GitBranch size={14} /> Launch App
            </motion.button>
          </div>
        </nav>

        {/* Hero */}
        <section style={{ maxWidth: 1200, margin: '0 auto', minHeight: 'calc(100vh - 80px)', display: 'flex', alignItems: 'center', padding: '40px 24px' }}>
          <div style={{ display: 'flex', gap: 60, alignItems: 'center', flexWrap: 'wrap', width: '100%' }}>
            <motion.div style={{ flex: 1, minWidth: 320 }} initial="hidden" animate="visible" variants={containerVariants}>
              <motion.div variants={itemVariants} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, padding: '6px 14px', width: 'fit-content', borderRadius: 24, background: 'color-mix(in srgb, var(--bg-elevated) 60%, transparent)', backdropFilter: 'blur(10px)', border: '1px solid color-mix(in srgb, var(--border) 50%, transparent)' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-accept)', animation: 'pulse-glow 2s ease-in-out infinite' }} />
                <span style={{ fontSize: 12, color: 'var(--text-secondary)', fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}>Minimum Spanning Tree Optimizer</span>
              </motion.div>
              
              <motion.h1 variants={itemVariants} style={{ fontWeight: 800, lineHeight: 1.1, marginBottom: 24, color: 'var(--text-primary)', fontSize: 'clamp(40px, 6vw, 68px)', letterSpacing: '-1.5px' }}>
                Design the <br />
                <span style={{ background: 'linear-gradient(135deg, var(--accent-accept), var(--accent-candidate))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'inline-block' }}>
                  optimal network.
                </span>
              </motion.h1>
              
              <motion.p variants={itemVariants} style={{ fontSize: 18, marginBottom: 40, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.6 }}>
                The most intuitive, interactive way to visualize and optimize network infrastructure using Minimum Spanning Tree algorithms.
              </motion.p>
              
              <motion.div variants={itemVariants} style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <motion.button onClick={() => goApp()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 32px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, var(--accent-accept), var(--accent-candidate))', color: '#fff', fontSize: 16, fontWeight: 700, cursor: 'pointer', boxShadow: '0 12px 30px -10px color-mix(in srgb, var(--accent-accept) 60%, transparent)' }}>
                  <GitBranch size={18} /> Start Visualizing
                </motion.button>
                <motion.button onClick={() => goApp('telecom')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '16px 28px', borderRadius: 14, border: '1px solid var(--border)', background: 'color-mix(in srgb, var(--bg-elevated) 50%, transparent)', backdropFilter: 'blur(10px)', color: 'var(--text-primary)', fontSize: 16, fontWeight: 600, cursor: 'pointer' }}>
                  <Wifi size={16} /> Try Demo
                </motion.button>
              </motion.div>
            </motion.div>

            <motion.div style={{ flex: 1, minWidth: 320, maxWidth: 500 }} initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }} animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }} transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}>
              <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: 30, background: 'color-mix(in srgb, var(--bg-panel) 40%, transparent)', backdropFilter: 'blur(20px)', border: '1px solid color-mix(in srgb, var(--border) 40%, transparent)', padding: 20, boxShadow: '0 20px 60px -15px color-mix(in srgb, var(--accent-accept) 15%, transparent)' }}>
                <CreativeGraphAnimation />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Use cases */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 24px 80px' }}>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={containerVariants}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}
          >
            {USE_CASES.map((u) => (
              <SpotlightCard key={u.t} className="cursor-pointer">
                <motion.div variants={itemVariants} onClick={() => goApp(u.sc)} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '18px 20px', cursor: 'pointer', height: '100%' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: 'color-mix(in srgb, var(--accent-accept) 15%, transparent)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <u.I size={20} style={{ color: 'var(--accent-accept)' }} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--text-primary)', marginBottom: 2 }}>{u.t}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{u.d}</div>
                  </div>
                  <ArrowRight size={16} style={{ color: 'var(--text-muted)', marginLeft: 'auto', flexShrink: 0 }} />
                </motion.div>
              </SpotlightCard>
            ))}
          </motion.div>
        </section>

        {/* Features */}
        <section style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px 100px' }}>
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            style={{ textAlign: 'center', fontWeight: 800, fontSize: 36, marginBottom: 48, color: 'var(--text-primary)', letterSpacing: '-1px' }}>
            Powerful capabilities.
          </motion.h2>
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }} variants={containerVariants}
            style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20 }}
          >
            {FEATURES.map((f) => (
              <SpotlightCard key={f.t}>
                <motion.div variants={itemVariants} style={{ padding: 28, height: '100%' }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-elevated)', marginBottom: 20, border: '1px solid var(--border)', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
                    <f.I size={20} style={{ color: 'var(--text-primary)' }} />
                  </div>
                  <div style={{ fontWeight: 800, fontSize: 18, marginBottom: 8, color: 'var(--text-primary)' }}>{f.t}</div>
                  <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{f.d}</div>
                </motion.div>
              </SpotlightCard>
            ))}
          </motion.div>
        </section>

        {/* Shortcuts */}
        <section style={{ maxWidth: 800, margin: '0 auto', padding: '0 24px 100px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
                <Keyboard size={24} style={{ color: 'var(--text-primary)' }} />
                <h2 style={{ fontWeight: 800, fontSize: 28, color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>Keyboard First</h2>
              </div>
              <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>Operate entirely without a mouse.</p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 10 }}>
              {[['N','Add node'],['E','Connect'],['D','Delete'],['K',"Kruskal's"],['P',"Prim's"],['Space','Play/Pause'],['C','Race'],['G','Random'],['T','Themes'],['Z','Fit view'],['?','Help'],['Esc','Cancel']].map(([k,a]) => (
                <SpotlightCard key={k} style={{ borderRadius: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px' }}>
                    <span className="kbd" style={{ fontSize: 11, padding: '4px 8px' }}>{k}</span>
                    <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 500 }}>{a}</span>
                  </div>
                </SpotlightCard>
              ))}
            </div>
          </motion.div>
        </section>

        <footer style={{ padding: '32px 24px', textAlign: 'center', borderTop: '1px solid color-mix(in srgb, var(--border) 50%, transparent)', fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <GitBranch size={12} style={{ color: 'var(--text-primary)' }} />
            </div>
            <span style={{ fontWeight: 500 }}>Route D. Optimal v2.0</span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>Network Cost Optimizer</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
