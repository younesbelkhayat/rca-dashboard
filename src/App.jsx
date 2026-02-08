import React, { useState, useEffect, lazy, Suspense } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import { rcaData, typeColors, typeLabels } from './data';

// Views
import ReactFlowDagre from './views/ReactFlowDagre';
import ReactFlowHorizontal from './views/ReactFlowHorizontal';
import NivoSankey from './views/NivoSankey';
import RechartsTreemap from './views/RechartsTreemap';
import WaterfallCascade from './views/WaterfallCascade';
import VerticalDrillDown from './views/VerticalDrillDown';

// ─── VIZ OPTIONS (ordered by recommendation) ────────────────
const vizOptions = [
  {
    id: 'reactflow-dagre',
    name: '① React Flow + Dagre',
    tag: '★ RECOMMANDÉ',
    tagColor: '#F59E0B',
    desc: 'Flowchart interactif avec auto-layout, zoom/pan, minimap. Le plus professionnel pour un comex.',
    lib: '@xyflow/react + @dagrejs/dagre',
    needsProvider: true,
    Component: ReactFlowDagre,
  },
  {
    id: 'reactflow-horizontal',
    name: '② React Flow Horizontal',
    tag: 'EXCELLENT',
    tagColor: '#3B82F6',
    desc: 'Même puissance, layout gauche→droite. Lecture naturelle de la chaîne causale.',
    lib: '@xyflow/react + @dagrejs/dagre',
    needsProvider: true,
    Component: ReactFlowHorizontal,
  },
  {
    id: 'waterfall',
    name: '③ Cascade Waterfall',
    tag: 'CUSTOM · LÉGER',
    tagColor: '#10B981',
    desc: 'SVG pur, zéro dépendance. Cascade visuelle descendante, lecture très intuitive.',
    lib: 'Aucun (SVG custom)',
    needsProvider: false,
    Component: WaterfallCascade,
  },
  {
    id: 'nivo-sankey',
    name: '④ Nivo Sankey',
    tag: 'ANALYTIQUE',
    tagColor: '#8B5CF6',
    desc: 'Diagramme de flux Sankey. Montre l\'atténuation de l\'impact à travers la chaîne. Très data-driven.',
    lib: '@nivo/sankey',
    needsProvider: false,
    Component: NivoSankey,
  },
  {
    id: 'drilldown',
    name: '⑤ Drill-Down Vertical',
    tag: 'COMPACT',
    tagColor: '#06B6D4',
    desc: 'Plongée progressive avec indentation. Idéal format mobile ou section de dashboard.',
    lib: 'Aucun (CSS custom)',
    needsProvider: false,
    Component: VerticalDrillDown,
  },
  {
    id: 'recharts-treemap',
    name: '⑥ Recharts Treemap',
    tag: 'HIÉRARCHIQUE',
    tagColor: '#EC4899',
    desc: 'Treemap imbriqué : chaque cause est contenue dans son effet. Vue "big picture".',
    lib: 'recharts',
    needsProvider: false,
    Component: RechartsTreemap,
  },
];

// ─── MAIN APP ────────────────────────────────────────────────
export default function App() {
  const [selectedViz, setSelectedViz] = useState('reactflow-dagre');
  const [activeNode, setActiveNode] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 60);
    return () => clearTimeout(t);
  }, [selectedViz]);

  const current = vizOptions.find((v) => v.id === selectedViz);
  const VizComponent = current.Component;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(165deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)',
      fontFamily: "'DM Sans', sans-serif",
      color: '#E2E8F0',
    }}>
      <link
        href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;800&display=swap"
        rel="stylesheet"
      />

      {/* ─── HEADER ─── */}
      <div style={{ padding: '32px 40px 24px', borderBottom: '1px solid #334155' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '4px' }}>
          <h1 style={{
            fontSize: '28px', fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
            color: '#F8FAFC', margin: 0, letterSpacing: '-0.5px',
          }}>
            Root Cause Analysis
          </h1>
          <span style={{
            fontSize: '11px', fontWeight: 700, color: '#EF4444',
            background: '#EF444418', padding: '3px 10px',
            borderRadius: '20px', letterSpacing: '1px',
          }}>
            INTERACTIVE DEMO
          </span>
        </div>
        <p style={{ fontSize: '14px', color: '#94A3B8', margin: '8px 0 0', maxWidth: 700 }}>
          7 visualisations de chaîne causale — des packages React professionnels aux composants custom SVG.
          Cliquez sur chaque nœud pour explorer le détail. Comparez les approches.
        </p>
      </div>

      {/* ─── VIZ SELECTOR ─── */}
      <div style={{
        padding: '20px 40px',
        display: 'flex', gap: '8px', overflowX: 'auto',
        borderBottom: '1px solid #1E293B',
      }}>
        {vizOptions.map((v) => {
          const isSelected = selectedViz === v.id;
          return (
            <button
              key={v.id}
              onClick={() => { setSelectedViz(v.id); setActiveNode(null); }}
              style={{
                padding: '10px 16px', borderRadius: '10px',
                border: isSelected ? `2px solid ${v.tagColor}` : '1px solid #334155',
                background: isSelected ? `${v.tagColor}15` : '#1E293B',
                color: isSelected ? '#F1F5F9' : '#94A3B8',
                fontSize: '12px', fontWeight: 700, cursor: 'pointer',
                transition: 'all 0.2s ease', whiteSpace: 'nowrap',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {v.name}
            </button>
          );
        })}
      </div>

      {/* ─── INFO BAR ─── */}
      <div style={{ padding: '16px 40px 0', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: '#1E293B', border: '1px solid #334155',
          borderRadius: '8px', padding: '10px 16px',
        }}>
          <span style={{
            fontSize: '10px', fontWeight: 800, color: current.tagColor,
            textTransform: 'uppercase', letterSpacing: '1.5px',
          }}>
            {current.tag}
          </span>
          <span style={{ width: 1, height: 16, background: '#334155' }} />
          <span style={{ fontSize: '13px', color: '#CBD5E1' }}>{current.desc}</span>
        </div>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          background: '#0F172A', border: '1px solid #334155',
          borderRadius: '8px', padding: '8px 14px',
        }}>
          <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Package
          </span>
          <code style={{ fontSize: '11px', color: '#93C5FD', fontFamily: "'DM Mono', monospace" }}>
            {current.lib}
          </code>
        </div>
      </div>

      {/* ─── LEGEND ─── */}
      <div style={{ padding: '16px 40px', display: 'flex', gap: '20px' }}>
        {Object.entries(typeColors).map(([type, colors]) => (
          <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: colors.accent }} />
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 600 }}>{typeLabels[type]}</span>
          </div>
        ))}
      </div>

      {/* ─── VISUALIZATION AREA ─── */}
      <div style={{
        margin: '0 40px 40px',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        opacity: animateIn ? 1 : 0,
        transform: animateIn ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
      }}>
        {current.needsProvider ? (
          <ReactFlowProvider>
            <VizComponent activeNode={activeNode} setActiveNode={setActiveNode} />
          </ReactFlowProvider>
        ) : (
          <VizComponent activeNode={activeNode} setActiveNode={setActiveNode} />
        )}
      </div>

      {/* ─── COMPARISON TABLE ─── */}
      <div style={{ margin: '0 40px 40px' }}>
        <h2 style={{
          fontSize: '16px', fontWeight: 700, color: '#CBD5E1',
          fontFamily: "'DM Sans', sans-serif", marginBottom: '16px',
        }}>
          Comparatif des approches
        </h2>
        <div style={{
          background: '#1E293B', borderRadius: '12px', overflow: 'hidden',
          border: '1px solid #334155',
        }}>
          <table style={{
            width: '100%', borderCollapse: 'collapse',
            fontSize: '12px', fontFamily: "'DM Sans', sans-serif",
          }}>
            <thead>
              <tr style={{ background: '#0F172A' }}>
                {['Visualisation', 'Package', 'Interactivité', 'Impact comex', 'Complexité'].map((h) => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: 'left',
                    color: '#94A3B8', fontWeight: 700,
                    fontSize: '10px', textTransform: 'uppercase',
                    letterSpacing: '1.2px',
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['React Flow + Dagre (vertical)', '@xyflow/react', '★★★★★', '★★★★★', 'Moyenne'],
                ['React Flow (horizontal)', '@xyflow/react', '★★★★★', '★★★★☆', 'Moyenne'],
                ['Cascade Waterfall', 'Aucun', '★★★☆☆', '★★★★☆', 'Faible'],
                ['Nivo Sankey', '@nivo/sankey', '★★★★☆', '★★★☆☆', 'Faible'],
                ['Drill-Down Vertical', 'Aucun', '★★★☆☆', '★★★★☆', 'Faible'],
                ['Recharts Treemap', 'recharts', '★★★☆☆', '★★★☆☆', 'Faible'],
              ].map(([name, pkg, inter, impact, complexity], i) => (
                <tr key={i} style={{
                  borderTop: '1px solid #334155',
                  background: i === 0 ? '#F59E0B08' : 'transparent',
                }}>
                  <td style={{ padding: '12px 16px', color: '#F1F5F9', fontWeight: 600 }}>
                    {i === 0 && <span style={{ color: '#F59E0B', marginRight: 6 }}>★</span>}
                    {name}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <code style={{ color: '#93C5FD', fontFamily: "'DM Mono', monospace", fontSize: '11px' }}>{pkg}</code>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#FCD34D' }}>{inter}</td>
                  <td style={{ padding: '12px 16px', color: '#34D399' }}>{impact}</td>
                  <td style={{ padding: '12px 16px', color: '#94A3B8' }}>{complexity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div style={{ padding: '0 40px 32px', textAlign: 'center', fontSize: '11px', color: '#475569' }}>
        RCA Dashboard Demo · 6 visualisations · 3 packages + 3 custom · Données mockées
      </div>
    </div>
  );
}
