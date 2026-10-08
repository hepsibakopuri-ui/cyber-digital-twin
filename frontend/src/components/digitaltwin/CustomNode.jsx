import React, { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import {
  Globe,
  Shield,
  Server,
  Laptop,
  Database,
  Cloud,
  Cpu,
  AlertTriangle,
  Lock
} from 'lucide-react';

function getDeviceIcon(type) {
  switch (type) {
    case 'External Gateway':
      return Globe;
    case 'Firewall':
      return Shield;
    case 'Web Server':
      return Server;
    case 'Application Server':
      return Cpu;
    case 'Database Server':
      return Database;
    case 'Workstation':
      return Laptop;
    case 'Cloud Instance':
      return Cloud;
    default:
      return Server;
  }
}

function CustomNode({ data, selected }) {
  const {
    id,
    name,
    deviceType,
    ipAddress,
    securityState = 'SECURE',
    riskScore = 0,
    vulnerabilityCount = 0,
    openPorts = [],
    mode = 'normal',
    isOnAttackPath = false
  } = data;

  const Icon = getDeviceIcon(deviceType);

  // Security state visual mapping
  let borderClass = 'border-slate-700/80';
  let badgeClass = 'bg-slate-800 text-slate-300 border-slate-700';
  let glowStyle = {};

  if (securityState === 'CRITICAL' || riskScore >= 85) {
    borderClass = 'border-rose-500/80 shadow-[0_0_15px_rgba(244,63,94,0.35)] animate-pulse';
    badgeClass = 'bg-rose-500/20 text-rose-300 border-rose-500/40';
  } else if (securityState === 'HIGH_RISK' || riskScore >= 70) {
    borderClass = 'border-amber-500/80 shadow-[0_0_12px_rgba(245,158,11,0.3)]';
    badgeClass = 'bg-amber-500/20 text-amber-300 border-amber-500/40';
  } else if (securityState === 'MEDIUM_RISK' || riskScore >= 50) {
    borderClass = 'border-yellow-500/60';
    badgeClass = 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
  } else if (securityState === 'LOW_RISK') {
    borderClass = 'border-cyan-500/60';
    badgeClass = 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
  } else {
    borderClass = 'border-emerald-500/60';
    badgeClass = 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
  }

  // Heatmap View Mode Overlays
  if (mode === 'risk') {
    if (riskScore >= 75) {
      borderClass = 'border-rose-500 shadow-[0_0_20px_rgba(244,63,94,0.6)]';
    } else if (riskScore >= 50) {
      borderClass = 'border-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.5)]';
    } else {
      borderClass = 'border-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]';
    }
  } else if (mode === 'attack-path') {
    if (isOnAttackPath) {
      borderClass = 'border-purple-400 shadow-[0_0_25px_rgba(168,85,247,0.7)] ring-2 ring-purple-500 animate-pulse';
    } else {
      borderClass = 'border-slate-800 opacity-60';
    }
  } else if (mode === 'vuln') {
    if (vulnerabilityCount > 0) {
      borderClass = 'border-rose-400 shadow-[0_0_18px_rgba(244,63,94,0.5)] ring-1 ring-rose-500';
    } else {
      borderClass = 'border-slate-800 opacity-70';
    }
  }

  return (
    <div
      className={`relative min-w-[170px] rounded-xl border bg-slate-900/90 p-3.5 backdrop-blur-md transition-all duration-200 ${borderClass} ${
        selected ? 'ring-2 ring-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.5)]' : ''
      }`}
    >
      <Handle type="target" position={Position.Left} className="!h-2.5 !w-2.5 !bg-cyan-500" />
      <Handle type="source" position={Position.Right} className="!h-2.5 !w-2.5 !bg-cyan-500" />
      <Handle type="target" position={Position.Top} id="top" className="!h-2.5 !w-2.5 !bg-cyan-500" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!h-2.5 !w-2.5 !bg-cyan-500" />

      {/* Header with icon & security state badge */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-800 border border-slate-700 text-cyan-400">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white truncate max-w-[100px]">{name}</div>
            <div className="text-[10px] text-slate-400">{deviceType}</div>
          </div>
        </div>

        {vulnerabilityCount > 0 && (
          <span className="flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[9px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 font-mono-code">
            <AlertTriangle className="h-2.5 w-2.5" />
            {vulnerabilityCount}
          </span>
        )}
      </div>

      {/* IP Address & Ports */}
      <div className="mt-2.5 flex items-center justify-between text-[10px] font-mono-code text-slate-400 border-t border-slate-800 pt-2">
        <span>{ipAddress}</span>
        <span className="text-slate-500">{openPorts.length} Ports</span>
      </div>

      {/* Risk Score Progress Bar */}
      <div className="mt-2 space-y-1">
        <div className="flex justify-between text-[9px] font-mono-code">
          <span className="text-slate-400">Risk Factor</span>
          <span className={riskScore >= 70 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
            {riskScore}%
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className={`h-full rounded-full ${
              riskScore >= 75 ? 'bg-rose-500' : riskScore >= 50 ? 'bg-amber-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${Math.max(5, Math.min(100, riskScore))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

export default memo(CustomNode);
