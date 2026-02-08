import React from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { rcaData, typeColors, typeLabels } from '../data';

export default function NivoSankey({ activeNode, setActiveNode }) {
  // Transform rcaData into Nivo Sankey format
  const sankeyData = {
    nodes: rcaData.nodes.map((n) => ({
      id: `${n.label} (${n.value})`,
      nodeColor: typeColors[n.type].accent,
      originalId: n.id,
    })),
    links: rcaData.links.map((l) => {
      const sourceNode = rcaData.nodes.find((n) => n.id === l.source);
      const targetNode = rcaData.nodes.find((n) => n.id === l.target);
      return {
        source: `${sourceNode.label} (${sourceNode.value})`,
        target: `${targetNode.label} (${targetNode.value})`,
        value: 100 - parseInt(l.source) * 15, // decreasing flow to show attenuation
      };
    }),
  };

  return (
    <div style={{ height: 550, background: '#FAFBFC', borderRadius: '16px', padding: '16px' }}>
      <ResponsiveSankey
        data={sankeyData}
        margin={{ top: 20, right: 200, bottom: 20, left: 200 }}
        align="justify"
        colors={(node) => {
          const original = rcaData.nodes.find((n) => node.id.startsWith(n.label));
          return original ? typeColors[original.type].accent : '#94A3B8';
        }}
        nodeOpacity={1}
        nodeHoverOthersOpacity={0.35}
        nodeThickness={20}
        nodeSpacing={28}
        nodeBorderWidth={2}
        nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
        nodeBorderRadius={4}
        linkOpacity={0.25}
        linkHoverOpacity={0.6}
        linkHoverOthersOpacity={0.1}
        linkContract={2}
        linkBlendMode="normal"
        enableLinkGradient={true}
        labelPosition="outside"
        labelOrientation="horizontal"
        labelPadding={12}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1.2]] }}
        label={(node) => node.id}
        animate={true}
        motionConfig="gentle"
        onClick={(data) => {
          if (data.id) {
            const original = rcaData.nodes.find((n) => data.id.startsWith(n.label));
            if (original) {
              setActiveNode(activeNode === original.id ? null : original.id);
            }
          }
        }}
      />

      {/* Detail panel */}
      {activeNode && (
        <div style={{
          position: 'absolute',
          bottom: 20,
          left: '50%',
          transform: 'translateX(-50%)',
          background: '#FFFFFF',
          border: `2px solid ${typeColors[rcaData.nodes.find((n) => n.id === activeNode)?.type]?.accent || '#CBD5E1'}`,
          borderRadius: '12px',
          padding: '14px 20px',
          boxShadow: '0 8px 30px rgba(0,0,0,0.12)',
          fontFamily: "'DM Sans', sans-serif",
          maxWidth: 400,
          zIndex: 10,
        }}>
          <div style={{ fontSize: '12px', fontWeight: 700, color: '#0F172A' }}>
            {rcaData.nodes.find((n) => n.id === activeNode)?.label}
          </div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: 4 }}>
            {rcaData.nodes.find((n) => n.id === activeNode)?.detail}
          </div>
        </div>
      )}
    </div>
  );
}
