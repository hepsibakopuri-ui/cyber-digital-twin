import React, { useState } from 'react';
import {
  Shield, Server, HardDrive, Database, Monitor, Cpu, Radio,
  Lock, AlertOctagon, Wrench, ShieldAlert, CheckCircle, WifiOff,
  Maximize2, ZoomIn, ZoomOut, RefreshCw, Eye
} from 'lucide-react';

const NODE_TYPES = {
  FIREWALL: { label: 'Perimeter FW', icon: Shield, color: '#06b6d4' },
  WEB_SERVER: { label: 'DMZ Web', icon: Server, color: '#3b82f6' },
  GATEWAY: { label: 'API Gateway', icon: HardDrive, color: '#6366f1' },
  DOMAIN_CONTROLLER: { label: 'Domain Ctrl', icon: Lock, color: '#a855f7' },
  DATABASE: { label: 'Oracle DB', icon: Database, color: '#f59e0b' },
  WORKSTATION: { label: 'Workstation', icon: Monitor, color: '#10b981' },
  IOT_GATEWAY: { label: 'SCADA IoT', icon: Radio, color: '#ec4899' }
};

export default function DigitalTwinCanvas({
  nodes = [],
  links = [],
  onQuarantine,
  onPatch,
  activeTargetNodeId
}) {
  const [selectedNodeId, setSelectedNodeId] = useState('node-dmz-web');
  const [filterZone, setFilterZone] = useState('ALL');

  // Fallback default coordinates if not set
  const defaultCoords = {
    'node-firewall': { x: 110, y: 230 },
    'node-dmz-web': { x: 310, y: 130 },
    'node-api-gateway': { x: 310, y: 330 },
    'node-domain-ctrl': { x: 530, y: 130 },
    'node-oracle-db': { x: 530, y: 330 },
    'node-workstation-alpha': { x: 750, y: 150 },
    'node-iot-scada': { x: 750, y: 310 }
  };

  const activeNode = nodes.find(n => n.id === selectedNodeId) || nodes[0] || null;

  return (
    <div className="relative bg-[#0b101d] rounded-xl border border-cyber-border shadow-xl flex flex-col overflow-hidden">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between p-3.5 border-b border-cyber-border/60 gap-2 bg-[#0e1526]/80">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping"></div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Interactive Digital Twin Network Topology
          </h2>
          <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60 text-cyan-300">
            {nodes.length} Nodes Active
          </span>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-3 text-[11px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400"></span> Normal</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-amber-400"></span> Under Attack</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span> Compromised</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-slate-600"></span> Quarantined</span>
        </div>
      </div>

      {/* SVG Responsive Canvas Container */}
      <div className="relative w-full aspect-[2/1] min-h-[380px] sm:min-h-[420px] bg-[radial-gradient(#152036_1px,transparent_1px)] [background-size:20px_20px] flex items-center justify-center p-2">
        <svg
          viewBox="0 0 940 460"
          className="w-full h-full max-h-[460px] select-none"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Filters */}
            <filter id="cyberGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            <filter id="threatGlowRed" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>

            {/* Gradients */}
            <linearGradient id="linkGradActive" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
            </linearGradient>

            <linearGradient id="linkGradAttack" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#fb7185" stopOpacity="0.9" />
            </linearGradient>

            <radialGradient id="radarPing">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8"/>
              <stop offset="70%" stopColor="#f43f5e" stopOpacity="0.1"/>
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0"/>
            </radialGradient>
          </defs>

          {/* Network Zones Bounding Areas */}
          <g className="zones opacity-70">
            {/* Perimeter Zone */}
            <rect x="25" y="40" width="170" height="380" rx="12" fill="#0d192e" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <text x="110" y="65" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold" letterSpacing="1">PERIMETER ZONE</text>

            {/* DMZ Zone */}
            <rect x="215" y="40" width="190" height="380" rx="12" fill="#0d192e" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <text x="310" y="65" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold" letterSpacing="1">DMZ / PROXY</text>

            {/* Core & Data Zone */}
            <rect x="425" y="40" width="210" height="380" rx="12" fill="#0d192e" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <text x="530" y="65" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold" letterSpacing="1">CORE & DATA</text>

            {/* LAN & OT Zone */}
            <rect x="655" y="40" width="240" height="380" rx="12" fill="#0d192e" stroke="#1e293b" strokeWidth="1" strokeDasharray="4 4" />
            <text x="775" y="65" textAnchor="middle" fill="#64748b" fontSize="10" fontWeight="bold" letterSpacing="1">LAN & OT FIELD</text>
          </g>

          {/* Links (Edges) */}
          <g className="links">
            {links.map((link) => {
              const srcNode = nodes.find(n => n.id === link.source);
              const tgtNode = nodes.find(n => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              const srcX = defaultCoords[srcNode.id]?.x || srcNode.x;
              const srcY = defaultCoords[srcNode.id]?.y || srcNode.y;
              const tgtX = defaultCoords[tgtNode.id]?.x || tgtNode.x;
              const tgtY = defaultCoords[tgtNode.id]?.y || tgtNode.y;

              const isSevered = link.status === 'SEVERED' || srcNode.status === 'QUARANTINED' || tgtNode.status === 'QUARANTINED';
              const isUnderAttack = srcNode.status === 'COMPROMISED' || tgtNode.status === 'COMPROMISED';

              const midX = (srcX + tgtX) / 2;
              const midY = (srcY + tgtY) / 2;

              return (
                <g key={link.id}>
                  {/* Base Line */}
                  <line
                    x1={srcX}
                    y1={srcY}
                    x2={tgtX}
                    y2={tgtY}
                    stroke={isSevered ? '#475569' : isUnderAttack ? 'url(#linkGradAttack)' : 'url(#linkGradActive)'}
                    strokeWidth={isSevered ? 1.5 : isUnderAttack ? 3 : 2}
                    strokeDasharray={isSevered ? '5 5' : 'none'}
                    opacity={isSevered ? 0.35 : 0.8}
                  />

                  {/* Severed Label */}
                  {isSevered && (
                    <g transform={`translate(${midX}, ${midY})`}>
                      <rect x="-24" y="-8" width="48" height="16" rx="4" fill="#1e293b" stroke="#475569" strokeWidth="1" />
                      <text x="0" y="3" textAnchor="middle" fill="#94a3b8" fontSize="8" fontWeight="bold">SEVERED</text>
                    </g>
                  )}

                  {/* Flowing animated packet particle */}
                  {!isSevered && (
                    <circle r={isUnderAttack ? '4' : '3'} fill={isUnderAttack ? '#f43f5e' : '#38bdf8'} filter="url(#cyberGlow)">
                      <animateMotion
                        path={`M ${srcX} ${srcY} L ${tgtX} ${tgtY}`}
                        dur={isUnderAttack ? '1.1s' : '2.8s'}
                        repeatCount="indefinite"
                      />
                    </circle>
                  )}
                </g>
              );
            })}
          </g>

          {/* Interactive Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const coords = defaultCoords[node.id] || { x: node.x, y: node.y };
              const isSelected = selectedNodeId === node.id;
              const isTargeted = activeTargetNodeId === node.id;
              const isCompromised = node.status === 'COMPROMISED';
              const isUnderAttack = node.status === 'UNDER_ATTACK';
              const isQuarantined = node.status === 'QUARANTINED';

              const typeMeta = NODE_TYPES[node.type] || { label: node.type, color: '#06b6d4' };

              let ringStroke = '#06b6d4';
              let ringFill = '#0f172a';
              if (isCompromised) {
                ringStroke = '#f43f5e';
                ringFill = '#2a0a13';
              } else if (isUnderAttack) {
                ringStroke = '#f59e0b';
                ringFill = '#271905';
              } else if (isQuarantined) {
                ringStroke = '#64748b';
                ringFill = '#1e293b';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${coords.x}, ${coords.y})`}
                  onClick={() => setSelectedNodeId(node.id)}
                  className="cursor-pointer transition-transform hover:scale-105"
                >
                  {/* Radar Threat Ripple when Compromised or Under Attack */}
                  {(isCompromised || isUnderAttack) && (
                    <circle r="46" fill="url(#radarPing)" opacity="0.6">
                      <animate attributeName="r" values="35;55;35" dur="1.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.8;0.1;0.8" dur="1.8s" repeatCount="indefinite" />
                    </circle>
                  )}

                  {/* Outer selection / status ring */}
                  <circle
                    r="34"
                    fill={ringFill}
                    stroke={ringStroke}
                    strokeWidth={isSelected ? '3' : '2'}
                    filter={isCompromised ? 'url(#threatGlowRed)' : isSelected ? 'url(#cyberGlow)' : 'none'}
                  />

                  {/* Inner node circle with icon placeholder */}
                  <circle r="24" fill="#0b1220" stroke="#1e293b" strokeWidth="1.5" />

                  {/* Type abbreviation / icon badge */}
                  <text
                    y="-2"
                    textAnchor="middle"
                    fill={ringStroke}
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {node.type === 'FIREWALL' ? 'FW' :
                     node.type === 'WEB_SERVER' ? 'WEB' :
                     node.type === 'GATEWAY' ? 'GW' :
                     node.type === 'DOMAIN_CONTROLLER' ? 'DC' :
                     node.type === 'DATABASE' ? 'DB' :
                     node.type === 'WORKSTATION' ? 'WS' : 'IOT'}
                  </text>

                  {/* Node IP label */}
                  <text
                    y="10"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="7"
                    fontFamily="'JetBrains Mono', monospace"
                  >
                    {node.ip}
                  </text>

                  {/* Node Name pill beneath */}
                  <g transform="translate(0, 42)">
                    <rect
                      x="-45"
                      y="-8"
                      width="90"
                      height="16"
                      rx="4"
                      fill="#090d16"
                      stroke={isSelected ? '#06b6d4' : '#1e293b'}
                      strokeWidth="1"
                    />
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fill="#f1f5f9"
                      fontSize="8"
                      fontWeight="bold"
                    >
                      {node.name.replace(/(Perimeter|Public|Corporate|Finance)/g, '').trim().substring(0, 16)}
                    </text>
                  </g>

                  {/* Status Tag */}
                  <g transform="translate(0, -38)">
                    <rect
                      x="-30"
                      y="-7"
                      width="60"
                      height="14"
                      rx="3"
                      fill={
                        isCompromised ? '#4c0519' :
                        isUnderAttack ? '#451a03' :
                        isQuarantined ? '#1e293b' : '#042f2e'
                      }
                      stroke={ringStroke}
                      strokeWidth="1"
                    />
                    <text
                      y="3"
                      textAnchor="middle"
                      fill={
                        isCompromised ? '#fda4af' :
                        isUnderAttack ? '#fde68a' :
                        isQuarantined ? '#94a3b8' : '#6ee7b7'
                      }
                      fontSize="7"
                      fontWeight="bold"
                      letterSpacing="0.5"
                    >
                      {node.status}
                    </text>
                  </g>

                  {/* Target Crosshair if targeted */}
                  {isTargeted && (
                    <g transform="translate(24, -24)">
                      <circle r="7" fill="#dc2626" />
                      <text y="2.5" textAnchor="middle" fill="#ffffff" fontSize="7" fontWeight="bold">!</text>
                    </g>
                  )}
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Selected Node Control & Inspector Drawer */}
      {activeNode && (
        <div className="p-3.5 bg-[#090e1a] border-t border-cyber-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-cyber-border text-cyan-400">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-xs font-bold text-white tracking-wide">{activeNode.name}</h3>
                <span className="text-[10px] font-mono-code px-1.5 py-0.5 rounded bg-slate-800 text-cyan-300">
                  {activeNode.ip}
                </span>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                  activeNode.status === 'COMPROMISED' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                  activeNode.status === 'UNDER_ATTACK' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                  activeNode.status === 'QUARANTINED' ? 'bg-slate-800 text-slate-400' :
                  'bg-emerald-950 text-emerald-300 border border-emerald-800'
                }`}>
                  {activeNode.status}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                OS: <span className="text-slate-200">{activeNode.os}</span> | Zone: <span className="text-slate-200">{activeNode.zone}</span> | Vulnerability CVSS: <span className="text-rose-400 font-bold">{activeNode.vulnerabilityScore}</span>/10
              </p>
            </div>
          </div>

          {/* Node Action Buttons */}
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            {activeNode.status !== 'QUARANTINED' ? (
              <button
                onClick={() => onQuarantine(activeNode.id)}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/40 transition"
              >
                <WifiOff className="w-3.5 h-3.5" />
                <span>Quarantine</span>
              </button>
            ) : (
              <button
                onClick={() => onQuarantine(activeNode.id, 'RESTORE_NODE')}
                className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border border-cyan-500/40 transition"
              >
                <CheckCircle className="w-3.5 h-3.5" />
                <span>Restore Node</span>
              </button>
            )}

            <button
              onClick={() => onPatch(activeNode.id)}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 transition"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Patch CVE</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
