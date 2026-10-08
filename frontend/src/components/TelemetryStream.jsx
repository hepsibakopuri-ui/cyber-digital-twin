import React from 'react';
import { Activity, Radio, ArrowDownUp, AlertCircle } from 'lucide-react';

export default function TelemetryStream({ telemetryLogs = [], latestTelemetry = null }) {
  return (
    <div className="bg-[#0b101d] rounded-xl border border-cyber-border p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/60">
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Real-Time Telemetry Stream & Feature Extraction
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-mono-code text-emerald-400 font-semibold">1.5s Tick</span>
        </div>
      </div>

      {/* Real-time Feature Metrics Snapshot Bar */}
      {latestTelemetry && (
        <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2 text-center text-xs font-mono-code">
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Protocol</span>
            <span className="text-cyan-400 font-bold uppercase">{latestTelemetry.protocol_type || 'tcp'} / {latestTelemetry.service || 'http'}</span>
          </div>
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Src Bytes</span>
            <span className="text-slate-200 font-bold">{latestTelemetry.src_bytes?.toLocaleString() || 0}</span>
          </div>
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Dst Bytes</span>
            <span className="text-slate-200 font-bold">{latestTelemetry.dst_bytes?.toLocaleString() || 0}</span>
          </div>
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Rate (2s)</span>
            <span className="text-slate-200 font-bold">{latestTelemetry.count || 0} conn</span>
          </div>
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">SYN Err Rate</span>
            <span className={`font-bold ${latestTelemetry.serror_rate > 0.4 ? 'text-rose-400' : 'text-slate-200'}`}>
              {(latestTelemetry.serror_rate * 100).toFixed(0)}%
            </span>
          </div>
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Failed Auth</span>
            <span className={`font-bold ${latestTelemetry.failed_logins > 2 ? 'text-amber-400' : 'text-slate-200'}`}>
              {latestTelemetry.failed_logins || 0}
            </span>
          </div>
          <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
            <span className="text-[10px] text-slate-500 block uppercase">Payload Entropy</span>
            <span className={`font-bold ${latestTelemetry.packet_entropy > 7 ? 'text-rose-400' : 'text-slate-200'}`}>
              {latestTelemetry.packet_entropy?.toFixed(2) || '3.20'}
            </span>
          </div>
        </div>
      )}

      {/* Telemetry Stream Log Table */}
      <div className="mt-3 overflow-x-auto max-h-[220px] overflow-y-auto">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900/90 sticky top-0">
            <tr>
              <th className="px-3 py-2">Time</th>
              <th className="px-3 py-2">Target Node</th>
              <th className="px-3 py-2">Protocol/Svc</th>
              <th className="px-3 py-2">Src / Dst Bytes</th>
              <th className="px-3 py-2">SYN Err</th>
              <th className="px-3 py-2">Auth Fail</th>
              <th className="px-3 py-2">Entropy</th>
              <th className="px-3 py-2">Weka AI Classification</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-mono-code text-[11px]">
            {telemetryLogs.slice(0, 15).map((log, idx) => (
              <tr key={log.id || idx} className="hover:bg-slate-900/50 transition">
                <td className="px-3 py-1.5 text-slate-500">
                  {new Date(log.timestamp || Date.now()).toLocaleTimeString()}
                </td>
                <td className="px-3 py-1.5 font-bold text-cyan-300">
                  {log.nodeId}
                </td>
                <td className="px-3 py-1.5">
                  {log.protocol_type?.toUpperCase()}/{log.service}
                </td>
                <td className="px-3 py-1.5 text-slate-400">
                  {log.src_bytes} / {log.dst_bytes}
                </td>
                <td className={`px-3 py-1.5 ${log.serror_rate > 0.5 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                  {((log.serror_rate || 0) * 100).toFixed(0)}%
                </td>
                <td className={`px-3 py-1.5 ${log.failed_logins > 2 ? 'text-amber-400 font-bold' : 'text-slate-400'}`}>
                  {log.failed_logins || 0}
                </td>
                <td className="px-3 py-1.5 text-slate-400">
                  {typeof log.packet_entropy === 'number' ? log.packet_entropy.toFixed(2) : '3.10'}
                </td>
                <td className="px-3 py-1.5">
                  <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                    log.prediction === 'NORMAL' ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/60' :
                    log.prediction === 'DOS_SYN_FLOOD' ? 'bg-rose-950/80 text-rose-300 border border-rose-800/60' :
                    log.prediction === 'BRUTE_FORCE' ? 'bg-orange-950/80 text-orange-300 border border-orange-800/60' :
                    'bg-amber-950/80 text-amber-300 border border-amber-800/60'
                  }`}>
                    {log.prediction || 'NORMAL'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
