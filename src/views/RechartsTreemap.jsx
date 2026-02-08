import React from 'react';
import { Treemap, ResponsiveContainer, Tooltip } from 'recharts';
import { rcaData, typeColors, typeLabels } from '../data';

// Transform into nested treemap data - nested structure reflects causality
const treemapData = [
  {
    name: rcaData.nodes[0].label,
    children: [
      {
        name: rcaData.nodes[1].label,
        children: [
          {
            name: rcaData.nodes[2].label,
            children: [
              {
                name: rcaData.nodes[3].label,
                children: [
                  {
                    name: rcaData.nodes[4].label,
                    children: [
                      {
                        name: rcaData.nodes[5].label,
                        size: 100,
                        value: rcaData.nodes[5].value,
                        type: rcaData.nodes[5].type,
                        detail: rcaData.nodes[5].detail,
                        level: 6,
                      },
                    ],
                    size: 150,
                    value: rcaData.nodes[4].value,
                    type: rcaData.nodes[4].type,
                    detail: rcaData.nodes[4].detail,
                    level: 5,
                  },
                ],
                size: 200,
                value: rcaData.nodes[3].value,
                type: rcaData.nodes[3].type,
                detail: rcaData.nodes[3].detail,
                level: 4,
              },
            ],
            size: 300,
            value: rcaData.nodes[2].value,
            type: rcaData.nodes[2].type,
            detail: rcaData.nodes[2].detail,
            level: 3,
          },
        ],
        size: 400,
        value: rcaData.nodes[1].value,
        type: rcaData.nodes[1].type,
        detail: rcaData.nodes[1].detail,
        level: 2,
      },
    ],
    size: 600,
    value: rcaData.nodes[0].value,
    type: rcaData.nodes[0].type,
    detail: rcaData.nodes[0].detail,
    level: 1,
  },
];

const CustomTreemapContent = (props) => {
  const { x, y, width, height, name, type, value, level, depth } = props;
  if (width < 40 || height < 30) return null;

  const colors = typeColors[type] || typeColors.kpi;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={6}
        fill={colors.bg}
        stroke={colors.accent}
        strokeWidth={depth === 0 ? 3 : 1.5}
        strokeOpacity={0.7}
      />
      {width > 60 && height > 40 && (
        <>
          <text
            x={x + 10}
            y={y + 18}
            fontSize={9}
            fontWeight={700}
            fill={colors.accent}
            fontFamily="'DM Sans', sans-serif"
            textAnchor="start"
          >
            N{level} · {typeLabels[type] || ''}
          </text>
          <text
            x={x + 10}
            y={y + 34}
            fontSize={12}
            fontWeight={700}
            fill="#0F172A"
            fontFamily="'DM Sans', sans-serif"
          >
            {name && name.length > Math.floor(width / 8) ? name.slice(0, Math.floor(width / 8)) + '…' : name}
          </text>
          {height > 55 && (
            <text
              x={x + 10}
              y={y + 54}
              fontSize={18}
              fontWeight={800}
              fill={colors.accent}
              fontFamily="'DM Mono', monospace"
            >
              {value}
            </text>
          )}
        </>
      )}
    </g>
  );
};

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  const item = payload[0].payload;
  const colors = typeColors[item.type] || typeColors.kpi;

  return (
    <div style={{
      background: '#FFF',
      border: `2px solid ${colors.accent}`,
      borderRadius: 10,
      padding: '12px 16px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
      fontFamily: "'DM Sans', sans-serif",
      maxWidth: 260,
    }}>
      <div style={{ fontSize: 9, fontWeight: 700, color: colors.accent, textTransform: 'uppercase', letterSpacing: 1.2 }}>
        Niveau {item.level} · {typeLabels[item.type]}
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#0F172A', margin: '4px 0' }}>{item.name}</div>
      <div style={{ fontSize: 20, fontWeight: 800, color: colors.accent, fontFamily: "'DM Mono', monospace" }}>{item.value}</div>
      <div style={{ fontSize: 11, color: '#64748B', marginTop: 6 }}>{item.detail}</div>
    </div>
  );
};

export default function RechartsTreemap({ activeNode, setActiveNode }) {
  return (
    <div style={{ height: 550, background: '#FAFBFC', borderRadius: '16px', padding: '16px' }}>
      <ResponsiveContainer width="100%" height="100%">
        <Treemap
          data={treemapData}
          dataKey="size"
          aspectRatio={4 / 3}
          stroke="#FFF"
          strokeWidth={2}
          content={<CustomTreemapContent />}
          animationDuration={500}
        >
          <Tooltip content={<CustomTooltip />} />
        </Treemap>
      </ResponsiveContainer>
    </div>
  );
}
