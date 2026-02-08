import { useState, useEffect, useRef } from "react";

// ─── MOCK DATA ───────────────────────────────────────────────
const rcaData = {
  nodes: [
    { id: 0, label: "Marge nette", value: "-3.2 pts", delta: -3.2, type: "kpi", detail: "Marge nette passée de 12.1% à 8.9% sur Q1" },
    { id: 1, label: "Coût unitaire", value: "+18%", delta: 18, type: "kpi", detail: "Hausse du coût de production par unité" },
    { id: 2, label: "Coût matières premières", value: "+25%", delta: 25, type: "kpi", detail: "Augmentation prix d'achat MP" },
    { id: 3, label: "Volume fournisseur A", value: "-40%", delta: -40, type: "kpi", detail: "Réduction capacité fournisseur principal" },
    { id: 4, label: "Retard livraisons", value: "+12 jours", delta: 12, type: "operational", detail: "Délai moyen passé de 5 à 17 jours" },
    { id: 5, label: "Pénurie logistique", value: "Critique", delta: null, type: "qualitative", detail: "Congestion portuaire Asie du Sud-Est depuis Janvier" },
  ],
  links: [
    { source: 0, target: 1 },
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
    { source: 4, target: 5 },
  ],
};

const typeColors = {
  kpi: { bg: "#FEE2E2", border: "#EF4444", text: "#991B1B", accent: "#EF4444" },
  operational: { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E", accent: "#F59E0B" },
  qualitative: { bg: "#DBEAFE", border: "#3B82F6", text: "#1E3A8A", accent: "#3B82F6" },
};

const typeLabels = { kpi: "KPI", operational: "Opérationnel", qualitative: "Qualitatif" };

// ─── VIZUALIZATION 1: WATERFALL CASCADE (Recommended) ────────
function WaterfallCascade({ data, activeNode, setActiveNode }) {
  return (
    <div style={{ padding: "32px 16px", overflowX: "auto" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 0, minWidth: "900px", position: "relative" }}>
        {data.nodes.map((node, i) => {
          const colors = typeColors[node.type];
          const isActive = activeNode === node.id;
          const depth = i;
          return (
            <div key={node.id} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
              {/* Node */}
              <div
                onClick={() => setActiveNode(isActive ? null : node.id)}
                style={{
                  width: 180,
                  marginTop: depth * 28,
                  padding: "16px",
                  borderRadius: "12px",
                  border: `2px solid ${isActive ? colors.accent : colors.border}`,
                  background: isActive ? colors.bg : "#FFFFFF",
                  boxShadow: isActive
                    ? `0 0 0 3px ${colors.accent}33, 0 8px 24px rgba(0,0,0,0.12)`
                    : "0 2px 8px rgba(0,0,0,0.06)",
                  cursor: "pointer",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  position: "relative",
                  zIndex: isActive ? 10 : 1,
                  transform: isActive ? "scale(1.05)" : "scale(1)",
                }}
              >
                <div style={{
                  fontSize: "10px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1.2px",
                  color: colors.accent,
                  marginBottom: "6px",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {typeLabels[node.type]} · Niveau {i + 1}
                </div>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 700,
                  color: "#0F172A",
                  marginBottom: "6px",
                  lineHeight: 1.3,
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {node.label}
                </div>
                <div style={{
                  fontSize: "22px",
                  fontWeight: 800,
                  color: colors.accent,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {node.value}
                </div>
                {isActive && (
                  <div style={{
                    marginTop: "10px",
                    paddingTop: "10px",
                    borderTop: `1px solid ${colors.border}44`,
                    fontSize: "12px",
                    color: "#64748B",
                    lineHeight: 1.5,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {node.detail}
                  </div>
                )}
              </div>
              {/* Arrow */}
              {i < data.nodes.length - 1 && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  marginTop: depth * 28 + 14,
                  padding: "0 4px",
                  flexShrink: 0,
                }}>
                  <svg width="48" height="24" viewBox="0 0 48 24">
                    <defs>
                      <linearGradient id={`arrowGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={typeColors[data.nodes[i].type].accent} />
                        <stop offset="100%" stopColor={typeColors[data.nodes[i + 1].type].accent} />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="12" x2="36" y2="12" stroke={`url(#arrowGrad${i})`} strokeWidth="2.5" strokeDasharray="4 3" />
                    <polygon points="36,6 48,12 36,18" fill={typeColors[data.nodes[i + 1].type].accent} />
                  </svg>
                  <div style={{
                    fontSize: "9px",
                    color: "#94A3B8",
                    fontWeight: 600,
                    marginTop: "2px",
                    fontFamily: "'DM Sans', sans-serif",
                    letterSpacing: "0.5px",
                  }}>
                    CAUSE
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── VISUALIZATION 2: VERTICAL DRILL-DOWN ────────────────────
function VerticalDrillDown({ data, activeNode, setActiveNode }) {
  return (
    <div style={{ padding: "24px 40px", maxWidth: 520, margin: "0 auto" }}>
      {data.nodes.map((node, i) => {
        const colors = typeColors[node.type];
        const isActive = activeNode === node.id;
        const isLast = i === data.nodes.length - 1;
        return (
          <div key={node.id}>
            <div
              onClick={() => setActiveNode(isActive ? null : node.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "18px 20px",
                marginLeft: i * 20,
                borderRadius: "14px",
                border: `2px solid ${isActive ? colors.accent : colors.border}55`,
                background: isActive ? colors.bg : "#FAFBFC",
                boxShadow: isActive ? `0 4px 20px ${colors.accent}22` : "0 1px 4px rgba(0,0,0,0.04)",
                cursor: "pointer",
                transition: "all 0.25s ease",
                transform: isActive ? "scale(1.02)" : "scale(1)",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: "50%",
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}BB)`,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "#FFF", fontSize: "16px", fontWeight: 800,
                fontFamily: "'DM Mono', monospace", flexShrink: 0,
                boxShadow: `0 2px 8px ${colors.accent}44`,
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: "9px", fontWeight: 700, textTransform: "uppercase",
                  letterSpacing: "1.5px", color: colors.accent, marginBottom: "3px",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {typeLabels[node.type]}
                </div>
                <div style={{
                  fontSize: "15px", fontWeight: 700, color: "#0F172A",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  {node.label}
                </div>
                {isActive && (
                  <div style={{
                    fontSize: "12px", color: "#64748B", marginTop: "6px", lineHeight: 1.5,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {node.detail}
                  </div>
                )}
              </div>
              <div style={{
                fontSize: "20px", fontWeight: 800, color: colors.accent,
                fontFamily: "'DM Mono', monospace", flexShrink: 0,
              }}>
                {node.value}
              </div>
            </div>
            {!isLast && (
              <div style={{
                marginLeft: i * 20 + 40,
                height: 32,
                display: "flex",
                alignItems: "center",
              }}>
                <svg width="24" height="32" viewBox="0 0 24 32">
                  <line x1="12" y1="0" x2="12" y2="22" stroke={typeColors[data.nodes[i + 1].type].accent} strokeWidth="2" strokeDasharray="4 3" />
                  <polygon points="6,22 18,22 12,32" fill={typeColors[data.nodes[i + 1].type].accent} />
                </svg>
                <span style={{
                  fontSize: "9px", color: "#94A3B8", fontWeight: 700, marginLeft: "6px",
                  textTransform: "uppercase", letterSpacing: "1px",
                  fontFamily: "'DM Sans', sans-serif",
                }}>
                  causé par
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── VISUALIZATION 3: FISHBONE / ISHIKAWA HORIZONTAL ─────────
function FishboneHorizontal({ data, activeNode, setActiveNode }) {
  const nodeW = 170;
  const nodeH = 90;
  const gap = 50;
  const totalW = data.nodes.length * (nodeW + gap);

  return (
    <div style={{ padding: "40px 16px", overflowX: "auto" }}>
      <svg width={totalW} height={320} viewBox={`0 0 ${totalW} 320`} style={{ minWidth: totalW }}>
        {/* Main spine */}
        <line x1={20} y1={160} x2={totalW - 20} y2={160} stroke="#CBD5E1" strokeWidth="3" />
        <polygon points={`${totalW - 20},152 ${totalW},160 ${totalW - 20},168`} fill="#94A3B8" />

        {data.nodes.map((node, i) => {
          const colors = typeColors[node.type];
          const isActive = activeNode === node.id;
          const x = 40 + i * (nodeW + gap);
          const isTop = i % 2 === 0;
          const nodeY = isTop ? 30 : 210;
          const spineY = 160;

          return (
            <g key={node.id} onClick={() => setActiveNode(isActive ? null : node.id)} style={{ cursor: "pointer" }}>
              {/* Diagonal connector */}
              <line
                x1={x + nodeW / 2} y1={isTop ? nodeY + nodeH : nodeY}
                x2={x + nodeW / 2 + 15} y2={spineY}
                stroke={colors.accent} strokeWidth="2" strokeDasharray="5 3"
              />
              <circle cx={x + nodeW / 2 + 15} cy={spineY} r="5" fill={colors.accent} />

              {/* Node card */}
              <rect
                x={x} y={nodeY} width={nodeW} height={isActive ? nodeH + 30 : nodeH}
                rx="10" fill={isActive ? colors.bg : "#FFF"}
                stroke={colors.border} strokeWidth={isActive ? 2.5 : 1.5}
                style={{ transition: "all 0.2s ease", filter: isActive ? `drop-shadow(0 4px 12px ${colors.accent}33)` : "drop-shadow(0 1px 3px rgba(0,0,0,0.08))" }}
              />
              <text x={x + 12} y={nodeY + 20} fontSize="9" fontWeight="700" fill={colors.accent}
                fontFamily="'DM Sans', sans-serif" textAnchor="start" letterSpacing="1.2">
                {typeLabels[node.type].toUpperCase()} · N{i + 1}
              </text>
              <text x={x + 12} y={nodeY + 40} fontSize="13" fontWeight="700" fill="#0F172A"
                fontFamily="'DM Sans', sans-serif">
                {node.label.length > 20 ? node.label.slice(0, 20) + "…" : node.label}
              </text>
              <text x={x + 12} y={nodeY + 62} fontSize="20" fontWeight="800" fill={colors.accent}
                fontFamily="'DM Mono', monospace">
                {node.value}
              </text>
              {isActive && (
                <foreignObject x={x + 8} y={nodeY + nodeH} width={nodeW - 16} height={28}>
                  <div style={{
                    fontSize: "10px", color: "#64748B", lineHeight: 1.4,
                    fontFamily: "'DM Sans', sans-serif", padding: "2px 0",
                  }}>
                    {node.detail.slice(0, 60)}…
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}

        {/* Legend */}
        <text x={totalW / 2} y={300} fontSize="10" fill="#94A3B8" textAnchor="middle"
          fontFamily="'DM Sans', sans-serif" fontWeight="600" letterSpacing="2">
          CAUSE → → → EFFET
        </text>
      </svg>
    </div>
  );
}

// ─── VISUALIZATION 4: TREE / MIND MAP ────────────────────────
function TreeMindMap({ data, activeNode, setActiveNode }) {
  const centerX = 450;
  const centerY = 50;
  const levelGap = 100;
  const branchAngle = 0.35;

  const positions = data.nodes.map((_, i) => {
    const x = centerX + Math.sin(branchAngle * i) * (i * 60);
    const y = centerY + i * levelGap;
    return { x, y };
  });

  return (
    <div style={{ padding: "24px 16px", overflowX: "auto" }}>
      <svg width={900} height={data.nodes.length * levelGap + 80} viewBox={`0 0 900 ${data.nodes.length * levelGap + 80}`}>
        {/* Links */}
        {data.links.map((link, i) => {
          const s = positions[link.source];
          const t = positions[link.target];
          const colors = typeColors[data.nodes[link.target].type];
          const midY = (s.y + t.y) / 2;
          return (
            <g key={i}>
              <path
                d={`M ${s.x} ${s.y + 40} C ${s.x} ${midY}, ${t.x} ${midY}, ${t.x} ${t.y}`}
                fill="none" stroke={colors.accent} strokeWidth="2" strokeDasharray="6 4"
                opacity={0.6}
              />
              <polygon
                points={`${t.x - 5},${t.y - 4} ${t.x + 5},${t.y - 4} ${t.x},${t.y + 2}`}
                fill={colors.accent}
              />
            </g>
          );
        })}

        {/* Nodes */}
        {data.nodes.map((node, i) => {
          const pos = positions[i];
          const colors = typeColors[node.type];
          const isActive = activeNode === node.id;

          return (
            <g key={node.id} onClick={() => setActiveNode(isActive ? null : node.id)} style={{ cursor: "pointer" }}>
              <rect
                x={pos.x - 90} y={pos.y} width={180} height={isActive ? 80 : 65}
                rx="12" fill={isActive ? colors.bg : "#FFF"}
                stroke={colors.border} strokeWidth={isActive ? 2.5 : 1.5}
                style={{ filter: isActive ? `drop-shadow(0 6px 16px ${colors.accent}33)` : "drop-shadow(0 1px 4px rgba(0,0,0,0.06))" }}
              />
              <circle cx={pos.x - 70} cy={pos.y + 20} r="10" fill={colors.accent} />
              <text x={pos.x - 70} y={pos.y + 24} fontSize="10" fontWeight="800" fill="#FFF"
                textAnchor="middle" fontFamily="'DM Mono', monospace">
                {i + 1}
              </text>
              <text x={pos.x - 52} y={pos.y + 24} fontSize="12" fontWeight="700" fill="#0F172A"
                fontFamily="'DM Sans', sans-serif">
                {node.label.length > 16 ? node.label.slice(0, 16) + "…" : node.label}
              </text>
              <text x={pos.x - 52} y={pos.y + 48} fontSize="18" fontWeight="800" fill={colors.accent}
                fontFamily="'DM Mono', monospace">
                {node.value}
              </text>
              {isActive && (
                <foreignObject x={pos.x - 85} y={pos.y + 56} width={170} height={22}>
                  <div style={{
                    fontSize: "9px", color: "#64748B", lineHeight: 1.3,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {node.detail.slice(0, 55)}…
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── VISUALIZATION 5: SANKEY-LIKE FLOW ───────────────────────
function SankeyFlow({ data, activeNode, setActiveNode }) {
  const barH = 60;
  const gap = 50;
  const w = 800;
  const margin = 20;
  const barW = 140;

  return (
    <div style={{ padding: "24px 16px", overflowY: "auto" }}>
      <svg width={w} height={data.nodes.length * (barH + gap) + margin} viewBox={`0 0 ${w} ${data.nodes.length * (barH + gap) + margin}`}>
        {data.nodes.map((node, i) => {
          const colors = typeColors[node.type];
          const isActive = activeNode === node.id;
          const y = margin + i * (barH + gap);
          const x = (w - barW) / 2;
          const intensity = 1 - (i / (data.nodes.length - 1)) * 0.5;

          return (
            <g key={node.id}>
              {/* Flow band */}
              <rect x={x - 40} y={y} width={barW + 80} height={barH}
                rx="8" fill={`${colors.accent}11`}
              />
              {/* Intensity bar */}
              <rect x={x} y={y + 8} width={barW * intensity} height={barH - 16}
                rx="6"
                fill={`${colors.accent}${isActive ? "CC" : "88"}`}
                style={{ cursor: "pointer", transition: "all 0.2s ease" }}
                onClick={() => setActiveNode(isActive ? null : node.id)}
              />
              {/* Label left */}
              <text x={x - 48} y={y + barH / 2 + 4} fontSize="12" fontWeight="700"
                fill="#0F172A" textAnchor="end" fontFamily="'DM Sans', sans-serif">
                {node.label.length > 22 ? node.label.slice(0, 22) + "…" : node.label}
              </text>
              {/* Value right */}
              <text x={x + barW + 50} y={y + barH / 2 + 4} fontSize="18" fontWeight="800"
                fill={colors.accent} fontFamily="'DM Mono', monospace">
                {node.value}
              </text>
              {/* Level badge */}
              <circle cx={x + barW + 100} cy={y + barH / 2} r="12" fill={colors.accent} />
              <text x={x + barW + 100} y={y + barH / 2 + 4} fontSize="10" fontWeight="800"
                fill="#FFF" textAnchor="middle" fontFamily="'DM Mono', monospace">
                {i + 1}
              </text>

              {/* Connector */}
              {i < data.nodes.length - 1 && (
                <g>
                  <line x1={w / 2} y1={y + barH} x2={w / 2} y2={y + barH + gap - 6}
                    stroke="#CBD5E1" strokeWidth="2" strokeDasharray="4 3" />
                  <polygon
                    points={`${w / 2 - 5},${y + barH + gap - 10} ${w / 2 + 5},${y + barH + gap - 10} ${w / 2},${y + barH + gap}`}
                    fill={typeColors[data.nodes[i + 1].type].accent}
                  />
                </g>
              )}

              {/* Detail on active */}
              {isActive && (
                <foreignObject x={x - 40} y={y + barH + 2} width={barW + 80} height={24}>
                  <div style={{
                    fontSize: "10px", color: "#64748B", textAlign: "center",
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    {node.detail}
                  </div>
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────
const vizOptions = [
  {
    id: "waterfall",
    name: "① Cascade Waterfall",
    tag: "★ RECOMMANDÉ",
    desc: "Lecture gauche→droite avec descente visuelle. Idéal comex : lecture naturelle, hiérarchie visible, impact immédiat.",
    Component: WaterfallCascade,
  },
  {
    id: "drilldown",
    name: "② Drill-Down Vertical",
    tag: "EXCELLENT",
    desc: "Plongée progressive dans la cause racine. Indentation = profondeur. Très lisible sur écran vertical ou mobile.",
    Component: VerticalDrillDown,
  },
  {
    id: "fishbone",
    name: "③ Fishbone Ishikawa",
    tag: "CLASSIQUE",
    desc: "Diagramme d'Ishikawa adapté. Alternance haut/bas sur un axe central. Reconnu en industrie & qualité.",
    Component: FishboneHorizontal,
  },
  {
    id: "tree",
    name: "④ Arbre Causal",
    tag: "EXPLORATOIRE",
    desc: "Mind-map vertical avec courbes de Bézier. Bon quand les branches se multiplient à certains niveaux.",
    Component: TreeMindMap,
  },
  {
    id: "sankey",
    name: "⑤ Barre d'Intensité",
    tag: "ANALYTIQUE",
    desc: "Barres de magnitude décroissante. Met en avant l'atténuation de l'impact à travers la chaîne causale.",
    Component: SankeyFlow,
  },
];

export default function RCADashboard() {
  const [selectedViz, setSelectedViz] = useState("waterfall");
  const [activeNode, setActiveNode] = useState(null);
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setAnimateIn(false);
    const t = setTimeout(() => setAnimateIn(true), 50);
    return () => clearTimeout(t);
  }, [selectedViz]);

  const current = vizOptions.find((v) => v.id === selectedViz);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(165deg, #0F172A 0%, #1E293B 50%, #0F172A 100%)",
      fontFamily: "'DM Sans', sans-serif",
      color: "#E2E8F0",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=DM+Mono:wght@400;500&family=Playfair+Display:wght@700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{
        padding: "32px 40px 24px",
        borderBottom: "1px solid #334155",
      }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "4px" }}>
          <h1 style={{
            fontSize: "28px",
            fontWeight: 800,
            fontFamily: "'Playfair Display', serif",
            color: "#F8FAFC",
            margin: 0,
            letterSpacing: "-0.5px",
          }}>
            Root Cause Analysis
          </h1>
          <span style={{
            fontSize: "11px",
            fontWeight: 700,
            color: "#EF4444",
            background: "#EF444418",
            padding: "3px 10px",
            borderRadius: "20px",
            letterSpacing: "1px",
          }}>
            LIVE DEMO
          </span>
        </div>
        <p style={{
          fontSize: "14px",
          color: "#94A3B8",
          margin: "8px 0 0",
          maxWidth: 620,
        }}>
          Exploration interactive de la chaîne causale — de l'impact business à la cause racine.
          Cliquez sur un nœud pour voir le détail.
        </p>
      </div>

      {/* Viz Selector */}
      <div style={{
        padding: "20px 40px",
        display: "flex",
        gap: "10px",
        overflowX: "auto",
        borderBottom: "1px solid #1E293B",
      }}>
        {vizOptions.map((v) => {
          const isSelected = selectedViz === v.id;
          return (
            <button
              key={v.id}
              onClick={() => { setSelectedViz(v.id); setActiveNode(null); }}
              style={{
                padding: "10px 18px",
                borderRadius: "10px",
                border: isSelected ? "2px solid #3B82F6" : "1px solid #334155",
                background: isSelected ? "#3B82F622" : "#1E293B",
                color: isSelected ? "#93C5FD" : "#94A3B8",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.2s ease",
                whiteSpace: "nowrap",
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {v.name}
              {v.tag === "★ RECOMMANDÉ" && (
                <span style={{
                  marginLeft: "8px",
                  fontSize: "9px",
                  background: "#F59E0B22",
                  color: "#FCD34D",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontWeight: 800,
                }}>
                  {v.tag}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Description */}
      <div style={{ padding: "16px 40px 0" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          background: "#1E293B",
          border: "1px solid #334155",
          borderRadius: "8px",
          padding: "10px 16px",
        }}>
          <span style={{
            fontSize: "10px",
            fontWeight: 800,
            color: "#3B82F6",
            textTransform: "uppercase",
            letterSpacing: "1.5px",
          }}>
            {current.tag}
          </span>
          <span style={{ width: 1, height: 16, background: "#334155" }} />
          <span style={{ fontSize: "13px", color: "#CBD5E1" }}>
            {current.desc}
          </span>
        </div>
      </div>

      {/* Legend */}
      <div style={{
        padding: "16px 40px",
        display: "flex",
        gap: "20px",
      }}>
        {Object.entries(typeColors).map(([type, colors]) => (
          <div key={type} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: 10, height: 10, borderRadius: "50%",
              background: colors.accent,
            }} />
            <span style={{ fontSize: "11px", color: "#94A3B8", fontWeight: 600 }}>
              {typeLabels[type]}
            </span>
          </div>
        ))}
      </div>

      {/* Visualization Area */}
      <div style={{
        margin: "0 40px 40px",
        background: "#FFFFFF",
        borderRadius: "16px",
        minHeight: 400,
        overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
        opacity: animateIn ? 1 : 0,
        transform: animateIn ? "translateY(0)" : "translateY(12px)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
      }}>
        <current.Component data={rcaData} activeNode={activeNode} setActiveNode={setActiveNode} />
      </div>

      {/* Footer note */}
      <div style={{
        padding: "0 40px 32px",
        textAlign: "center",
        fontSize: "11px",
        color: "#475569",
      }}>
        Données mockées · Cliquez sur chaque nœud pour explorer les détails · 5 propositions de visualisation
      </div>
    </div>
  );
}