import React, { useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import AssetDetailsPanel from './AssetDetailsPanel';
import { Layers, Flame, ShieldAlert, Bug, RefreshCw, ZoomIn, ZoomOut } from 'lucide-react';

const nodeTypes = {
  custom: CustomNode
};

export default function DigitalTwinCanvas({
  topology,
  activeAttackPath,
  onNodeSelect,
  selectedAsset,
  onCloseAsset,
  onPatchVuln
}) {
  const [viewMode, setViewMode] = useState('normal'); // 'normal', 'risk', 'attack-path', 'vuln'

  // Determine which node IDs are on the active attack path
  const attackPathNodeIds = useMemo(() => {
    if (!activeAttackPath) return new Set();
    const set = new Set();
    set.add(activeAttackPath.ENTRY_POINT);
    set.add(activeAttackPath.TARGET_ASSET);
    if (activeAttackPath.STEPS) {
      activeAttackPath.STEPS.forEach(s => {
        set.add(s.FROM_ASSET);
        set.add(s.TO_ASSET);
      });
    }
    return set;
  }, [activeAttackPath]);

  // Transform raw topology nodes into React Flow nodes
  const initialNodes = useMemo(() => {
    if (!topology || !topology.nodes) return [];
    return topology.nodes.map(node => ({
      id: node.id,
      type: 'custom',
      position: node.position || { x: 100, y: 100 },
      data: {
        ...node,
        mode: viewMode,
        isOnAttackPath: attackPathNodeIds.has(node.id)
      },
      selected: selectedAsset?.id === node.id || selectedAsset?.ASSET_ID === node.id
    }));
  }, [topology, viewMode, attackPathNodeIds, selectedAsset]);

  // Transform raw topology edges into React Flow edges with animations
  const initialEdges = useMemo(() => {
    if (!topology || !topology.edges) return [];
    return topology.edges.map(edge => {
      const isPathEdge =
        activeAttackPath &&
        activeAttackPath.STEPS &&
        activeAttackPath.STEPS.some(
          s => s.FROM_ASSET === edge.source && s.TO_ASSET === edge.target
        );

      let strokeColor = '#0284c7'; // cyan default
      let strokeWidth = 2;
      let animated = true;

      if (isPathEdge || viewMode === 'attack-path') {
        if (isPathEdge) {
          strokeColor = '#f43f5e'; // rose attack flow
          strokeWidth = 3.5;
        } else {
          strokeColor = '#334155'; // dimmed
          strokeWidth = 1;
          animated = false;
        }
      }

      return {
        id: edge.id,
        source: edge.source,
        target: edge.target,
        animated: animated,
        style: { stroke: strokeColor, strokeWidth },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          color: strokeColor,
          width: 14,
          height: 14
        }
      };
    });
  }, [topology, activeAttackPath, viewMode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Sync state whenever topology or viewMode changes
  React.useEffect(() => {
    setNodes(initialNodes);
  }, [initialNodes, setNodes]);

  React.useEffect(() => {
    setEdges(initialEdges);
  }, [initialEdges, setEdges]);

  const handleNodeClick = useCallback(
    (event, node) => {
      if (onNodeSelect) {
        onNodeSelect(node.data);
      }
    },
    [onNodeSelect]
  );

  return (
    <div className="relative h-full w-full overflow-hidden rounded-xl border border-slate-800 bg-slate-950/70 backdrop-blur-md">
      {/* Top Heatmap View Selector Toolbar */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 rounded-xl border border-slate-800/90 bg-slate-900/90 p-1.5 shadow-xl backdrop-blur-md">
        <button
          onClick={() => setViewMode('normal')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            viewMode === 'normal'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Layers className="h-3.5 w-3.5" />
          Topology
        </button>

        <button
          onClick={() => setViewMode('risk')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            viewMode === 'risk'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Flame className="h-3.5 w-3.5 text-amber-400" />
          Risk Heatmap
        </button>

        <button
          onClick={() => setViewMode('attack-path')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            viewMode === 'attack-path'
              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <ShieldAlert className="h-3.5 w-3.5 text-purple-400" />
          Attack Path View
        </button>

        <button
          onClick={() => setViewMode('vuln')}
          className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
            viewMode === 'vuln'
              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          <Bug className="h-3.5 w-3.5 text-rose-400" />
          Vulnerability Density
        </button>
      </div>

      {/* Mode Status Pill */}
      <div className="absolute top-4 right-4 z-10 hidden sm:flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 font-mono-code backdrop-blur-md">
        <span className="h-2 w-2 rounded-full bg-cyan-400 animate-ping" />
        Live Packet Flow Active
      </div>

      {/* Main React Flow Graph */}
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.4}
        maxZoom={1.6}
        className="cyber-twin-flow"
      >
        <Background color="#1e293b" gap={20} size={1} />
        <Controls
          className="!bg-slate-900 !border-slate-800 !shadow-xl"
          showInteractive={false}
        />
        <MiniMap
          nodeStrokeColor="#38bdf8"
          nodeColor="#0f172a"
          maskColor="rgba(15, 23, 42, 0.7)"
          className="!bg-slate-950 !border-slate-800 rounded-lg overflow-hidden"
        />
      </ReactFlow>

      {/* Slide-out Asset Details Panel */}
      <AssetDetailsPanel
        asset={selectedAsset}
        onClose={onCloseAsset}
        onPatchVuln={onPatchVuln}
      />
    </div>
  );
}
