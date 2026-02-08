import React from 'react';
import { rcaData, typeColors, typeLabels } from '../data';

export default function VerticalDrillDown({ activeNode, setActiveNode }) {
  return (
    <div style={{ padding: '24px 40px', maxWidth: 560, margin: '0 auto', background: '#FAFBFC', borderRadius: '16px' }}>
      {rcaData.nodes.map((node, i) => {
        const colors = typeColors[node.type];
        const isActive = activeNode === node.id;
        const isLast = i === rcaData.nodes.length - 1;
        return (
          <div key={node.id}>
            <div
              onClick={() => setActiveNode(isActive ? null : node.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '16px',
                padding: '18px 20px', marginLeft: i * 20, borderRadius: '14px',
                border: `2px solid ${isActive ? colors.accent : colors.border}55`,
                background: isActive ? colors.bg : '#FFFFFF',
                boxShadow: isActive ? `0 4px 20px ${colors.accent}22` : '0 1px 4px rgba(0,0,0,0.04)',
                cursor: 'pointer', transition: 'all 0.25s ease',
                transform: isActive ? 'scale(1.02)' : 'scale(1)',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <div style={{
                width: 44, height: 44, borderRadius: '50%',
                background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}BB)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#FFF', fontSize: '16px', fontWeight: 800,
                fontFamily: "'DM Mono', monospace", flexShrink: 0,
                boxShadow: `0 2px 8px ${colors.accent}44`,
              }}>
                {i + 1}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{
                  fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '1.5px', color: colors.accent, marginBottom: '3px',
                }}>
                  {typeLabels[node.type]}
                </div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: '#0F172A' }}>{node.label}</div>
                {isActive && (
                  <div style={{ fontSize: '12px', color: '#64748B', marginTop: '6px', lineHeight: 1.5 }}>
                    {node.detail}
                  </div>
                )}
              </div>
              <div style={{
                fontSize: '20px', fontWeight: 800, color: colors.accent,
                fontFamily: "'DM Mono', monospace", flexShrink: 0,
              }}>
                {node.value}
              </div>
            </div>
            {!isLast && (
              <div style={{ marginLeft: i * 20 + 40, height: 32, display: 'flex', alignItems: 'center' }}>
                <svg width="24" height="32" viewBox="0 0 24 32">
                  <line x1="12" y1="0" x2="12" y2="22" stroke={typeColors[rcaData.nodes[i + 1].type].accent} strokeWidth="2" strokeDasharray="4 3" />
                  <polygon points="6,22 18,22 12,32" fill={typeColors[rcaData.nodes[i + 1].type].accent} />
                </svg>
                <span style={{
                  fontSize: '9px', color: '#94A3B8', fontWeight: 700, marginLeft: '6px',
                  textTransform: 'uppercase', letterSpacing: '1px',
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
