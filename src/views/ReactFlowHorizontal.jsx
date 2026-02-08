import React, { useCallback } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import '@xyflow/react/dist/style.css';
import { rcaData, typeColors, typeLabels } from '../data';

function RCANodeHorizontal({ data }) {
  const colors = typeColors[data.type];
  const isActive = data.isActive;

  return (
    <div
      style={{
        padding: '14px 18px',
        borderRadius: '12px',
        border: `2px solid ${isActive ? colors.accent : colors.border}`,
        background: isActive ? colors.bg : '#FFFFFF',
        boxShadow: isActive
          ? `0 0 0 3px ${colors.accent}33, 0 6px 20px rgba(0,0,0,0.12)`
          : '0 2px 10px rgba(0,0,0,0.06)',
        minWidth: 180,
        maxWidth: 220,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Handle type="target" position={Position.Left} style={{ background: colors.accent, width: 8, height: 8, border: 'none' }} />
      <div style={{ fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', color: colors.accent, marginBottom: '4px' }}>
        {typeLabels[data.type]} · N{data.level}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A', marginBottom: '4px', lineHeight: 1.2 }}>
        {data.label}
      </div>
      <div style={{ fontSize: '20px', fontWeight: 800, color: colors.accent, fontFamily: "'DM Mono', monospace" }}>
        {data.value}
      </div>
      {isActive && (
        <div style={{
          marginTop: '8px', paddingTop: '8px',
          borderTop: `1px solid ${colors.border}44`,
          fontSize: '11px', color: '#64748B', lineHeight: 1.4,
        }}>
          {data.detail}
        </div>
      )}
      <Handle type="source" position={Position.Right} style={{ background: colors.accent, width: 8, height: 8, border: 'none' }} />
    </div>
  );
}

const nodeTypes = { rcaNodeH: RCANodeHorizontal };

function getLayoutedElements(nodes, edges) {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: 'LR', nodesep: 40, ranksep: 80, marginx: 30, marginy: 30 });
  nodes.forEach((node) => g.setNode(node.id, { width: 220, height: 100 }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  dagre.layout(g);
  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return { ...node, position: { x: pos.x - 110, y: pos.y - 50 } };
  });
  return { nodes: layoutedNodes, edges };
}

export default function ReactFlowHorizontal({ activeNode, setActiveNode }) {
  const initialNodes = rcaData.nodes.map((n, i) => ({
    id: n.id,
    type: 'rcaNodeH',
    position: { x: 0, y: 0 },
    data: { ...n, level: i + 1, isActive: activeNode === n.id },
  }));

  const initialEdges = rcaData.links.map((l) => ({
    id: `e-${l.source}-${l.target}`,
    source: l.source,
    target: l.target,
    type: 'smoothstep',
    animated: true,
    style: { stroke: typeColors[rcaData.nodes[parseInt(l.target)].type].accent, strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: typeColors[rcaData.nodes[parseInt(l.target)].type].accent },
    label: 'cause',
    labelStyle: { fontSize: 9, fontWeight: 600, fill: '#94A3B8' },
    labelBgStyle: { fill: '#FFFFFF', fillOpacity: 0.9 },
    labelBgPadding: [5, 3],
    labelBgBorderRadius: 3,
  }));

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges);
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onNodeClick = useCallback((_, node) => {
    const newActiveId = activeNode === node.id ? null : node.id;
    setActiveNode(newActiveId);
    setNodes((nds) =>
      nds.map((n) => ({ ...n, data: { ...n.data, isActive: n.id === newActiveId } }))
    );
  }, [activeNode, setActiveNode, setNodes]);

  return (
    <div style={{ height: 500, background: '#FAFBFC', borderRadius: '16px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.25 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E2E8F0" gap={20} size={1} />
        <Controls position="bottom-right" />
      </ReactFlow>
    </div>
  );
}
