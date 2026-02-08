import React, { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import dagre from '@dagrejs/dagre';
import '@xyflow/react/dist/style.css';
import { rcaData, typeColors, typeLabels } from '../data';

// ─── CUSTOM NODE ─────────────────────────────────────────────
function RCANode({ data }) {
  const colors = typeColors[data.type];
  const isActive = data.isActive;

  return (
    <div
      style={{
        padding: '16px 20px',
        borderRadius: '14px',
        border: `2px solid ${isActive ? colors.accent : colors.border}`,
        background: isActive ? colors.bg : '#FFFFFF',
        boxShadow: isActive
          ? `0 0 0 3px ${colors.accent}33, 0 8px 24px rgba(0,0,0,0.15)`
          : '0 2px 12px rgba(0,0,0,0.08)',
        minWidth: 200,
        maxWidth: 240,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: colors.accent, width: 8, height: 8, border: 'none' }} />

      <div style={{
        fontSize: '9px', fontWeight: 700, textTransform: 'uppercase',
        letterSpacing: '1.2px', color: colors.accent, marginBottom: '6px',
      }}>
        {typeLabels[data.type]} · Niveau {data.level}
      </div>

      <div style={{
        fontSize: '14px', fontWeight: 700, color: '#0F172A',
        marginBottom: '6px', lineHeight: 1.3,
      }}>
        {data.label}
      </div>

      <div style={{
        fontSize: '24px', fontWeight: 800, color: colors.accent,
        fontFamily: "'DM Mono', monospace",
      }}>
        {data.value}
      </div>

      {isActive && (
        <div style={{
          marginTop: '10px', paddingTop: '10px',
          borderTop: `1px solid ${colors.border}44`,
          fontSize: '12px', color: '#64748B', lineHeight: 1.5,
        }}>
          {data.detail}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} style={{ background: colors.accent, width: 8, height: 8, border: 'none' }} />
    </div>
  );
}

const nodeTypes = { rcaNode: RCANode };

// ─── DAGRE LAYOUT ────────────────────────────────────────────
function getLayoutedElements(nodes, edges, direction = 'TB') {
  const g = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: direction, nodesep: 60, ranksep: 100, marginx: 40, marginy: 40 });

  nodes.forEach((node) => g.setNode(node.id, { width: 240, height: 120 }));
  edges.forEach((edge) => g.setEdge(edge.source, edge.target));
  dagre.layout(g);

  const layoutedNodes = nodes.map((node) => {
    const pos = g.node(node.id);
    return { ...node, position: { x: pos.x - 120, y: pos.y - 60 } };
  });

  return { nodes: layoutedNodes, edges };
}

// ─── COMPONENT ───────────────────────────────────────────────
export default function ReactFlowDagre({ activeNode, setActiveNode }) {
  const initialNodes = rcaData.nodes.map((n, i) => ({
    id: n.id,
    type: 'rcaNode',
    position: { x: 0, y: 0 },
    data: { ...n, level: i + 1, isActive: activeNode === n.id },
  }));

  const initialEdges = rcaData.links.map((l, i) => ({
    id: `e-${l.source}-${l.target}`,
    source: l.source,
    target: l.target,
    type: 'smoothstep',
    animated: true,
    style: { stroke: typeColors[rcaData.nodes[parseInt(l.target)].type].accent, strokeWidth: 2.5 },
    markerEnd: { type: MarkerType.ArrowClosed, color: typeColors[rcaData.nodes[parseInt(l.target)].type].accent },
    label: 'causé par',
    labelStyle: { fontSize: 10, fontWeight: 600, fill: '#94A3B8', fontFamily: "'DM Sans', sans-serif" },
    labelBgStyle: { fill: '#FFFFFF', fillOpacity: 0.9 },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 4,
  }));

  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, initialEdges, 'TB');

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onNodeClick = useCallback((_, node) => {
    const newActiveId = activeNode === node.id ? null : node.id;
    setActiveNode(newActiveId);
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        data: { ...n.data, isActive: n.id === newActiveId },
      }))
    );
  }, [activeNode, setActiveNode, setNodes]);

  return (
    <div style={{ height: 600, background: '#FAFBFC', borderRadius: '16px' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        proOptions={{ hideAttribution: true }}
      >
        <Background color="#E2E8F0" gap={20} size={1} />
        <Controls position="bottom-right" />
        <MiniMap
          nodeColor={(n) => typeColors[n.data?.type]?.accent || '#94A3B8'}
          maskColor="rgba(0,0,0,0.08)"
          style={{ borderRadius: 8 }}
        />
      </ReactFlow>
    </div>
  );
}
