import React from 'react';
import { rcaData, typeColors, typeLabels } from '../data';

export default function WaterfallCascade({ activeNode, setActiveNode }) {
  return (
    <div style={{ padding: '32px 16px', overflowX: 'auto', background: '#FAFBFC', borderRadius: '16px' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 0, minWidth: '900px', position: 'relative' }}>
        {rcaData.nodes.map((node, i) => {
          const colors = typeColors[node.type];
          const isActive = activeNode === node.id;
          const depth = i;
          return (
            <div key={node.id} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              <div
                onClick={() => setActiveNode(isActive ? null : node.id)}
                style={{
                  width: 180,
                  marginTop: depth * 28,
                  padding: '16px',
                  borderRadius: '12px',
                  border: `2px solid ${isActive ? colors.accent : colors.border}`,
                  background: isActive ? colors.bg : '#FFFFFF',
                  boxShadow: isActive
                    ? `0 0 0 3px ${colors.accent}33, 0 8px 24px rgba(0,0,0,0.12)`
                    : '0 2px 8px rgba(0,0,0,0.06)',
                  cursor: 'pointer',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  position: 'relative',
                  zIndex: isActive ? 10 : 1,
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                <div style={{
                  fontSize: '10px', fontWeight: 700, textTransform: 'uppercase',
                  letterSpacing: '1.2px', color: colors.accent, marginBottom: '6px',
                }}>
                  {typeLabels[node.type]} · Niveau {i + 1}
                </div>
                <div style={{
                  fontSize: '14px', fontWeight: 700, color: '#0F172A',
                  marginBottom: '6px', lineHeight: 1.3,
                }}>
                  {node.label}
                </div>
                <div style={{
                  fontSize: '22px', fontWeight: 800, color: colors.accent,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {node.value}
                </div>
                {isActive && (
                  <div style={{
                    marginTop: '10px', paddingTop: '10px',
                    borderTop: `1px solid ${colors.border}44`,
                    fontSize: '12px', color: '#64748B', lineHeight: 1.5,
                  }}>
                    {node.detail}
                  </div>
                )}
              </div>
              {i < rcaData.nodes.length - 1 && (
                <div style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  marginTop: depth * 28 + 14, padding: '0 4px', flexShrink: 0,
                }}>
                  <svg width="48" height="24" viewBox="0 0 48 24">
                    <defs>
                      <linearGradient id={`arrowGrad${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={typeColors[rcaData.nodes[i].type].accent} />
                        <stop offset="100%" stopColor={typeColors[rcaData.nodes[i + 1].type].accent} />
                      </linearGradient>
                    </defs>
                    <line x1="0" y1="12" x2="36" y2="12" stroke={`url(#arrowGrad${i})`} strokeWidth="2.5" strokeDasharray="4 3" />
                    <polygon points="36,6 48,12 36,18" fill={typeColors[rcaData.nodes[i + 1].type].accent} />
                  </svg>
                  <div style={{
                    fontSize: '9px', color: '#94A3B8', fontWeight: 600,
                    marginTop: '2px', letterSpacing: '0.5px',
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
