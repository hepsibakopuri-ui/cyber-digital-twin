import React, { useState } from 'react';
import { Database, CheckCircle, AlertCircle, FileText, Clock, HardDrive } from 'lucide-react';

export default function OracleDataViewer({ oracleStatus, incidents = [], predictions = [] }) {
  const [activeTab, setActiveTab] = useState('incidents');

  return (
    <div className="bg-[#0b101d] rounded-xl border border-cyber-border p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-cyber-border/60 gap-2">
        <div className="flex items-center space-x-2">
          <Database className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Oracle Database XE Telemetry & Incident Audit
          </h2>
        </div>

        {/* Database Connection Pill */}
        <div className="flex items-center space-x-2 text-xs font-mono-code">
          <span className="text-slate-400">{oracleStatus?.connectString || '127.0.0.1:1521/XE'}</span>
          <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
            oracleStatus?.connected ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'
          }`}>
            {oracleStatus?.mode || 'RESILIENT_FALLBACK_CACHE'}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center space-x-2 mt-3 border-b border-slate-800 pb-2 text-xs">
        <button
          onClick={() => setActiveTab('incidents')}
          className={`px-3 py-1.5 rounded font-semibold transition ${
            activeTab === 'incidents' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Security Incidents ({incidents.length})
        </button>
        <button
          onClick={() => setActiveTab('predictions')}
          className={`px-3 py-1.5 rounded font-semibold transition ${
            activeTab === 'predictions' ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          Weka Predictions Audit ({predictions.length})
        </button>
      </div>

      {/* Tab Content */}
      <div className="mt-3 overflow-x-auto max-h-[220px] overflow-y-auto">
        {activeTab === 'incidents' ? (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900/90 sticky top-0">
              <tr>
                <th className="px-3 py-2">ID</th>
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">Target Node</th>
                <th className="px-3 py-2">Attack Type</th>
                <th className="px-3 py-2">Severity</th>
                <th className="px-3 py-2">Mitigation Action</th>
                <th className="px-3 py-2">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-code text-[11px]">
              {incidents.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-3 py-4 text-center text-slate-500">
                    No active security incidents logged in Oracle DB.
                  </td>
                </tr>
              ) : (
                incidents.map((inc, idx) => (
                  <tr key={inc.incidentId || idx} className="hover:bg-slate-900/50 transition">
                    <td className="px-3 py-1.5 text-slate-500">#{inc.incidentId ? String(inc.incidentId).slice(-4) : idx + 1}</td>
                    <td className="px-3 py-1.5 text-slate-400">
                      {new Date(inc.createdAt || Date.now()).toLocaleTimeString()}
                    </td>
                    <td className="px-3 py-1.5 text-cyan-300 font-bold">{inc.nodeId}</td>
                    <td className="px-3 py-1.5 text-rose-300 font-bold">{inc.attackType}</td>
                    <td className="px-3 py-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        inc.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' : 'bg-amber-950 text-amber-300'
                      }`}>
                        {inc.severity}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-slate-400 truncate max-w-[200px]" title={inc.mitigation}>
                      {inc.mitigation || 'Pending Containment'}
                    </td>
                    <td className="px-3 py-1.5">
                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                        {inc.status || 'OPEN'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="text-[10px] uppercase font-bold text-slate-500 bg-slate-900/90 sticky top-0">
              <tr>
                <th className="px-3 py-2">Timestamp</th>
                <th className="px-3 py-2">Node</th>
                <th className="px-3 py-2">Classification</th>
                <th className="px-3 py-2">Confidence</th>
                <th className="px-3 py-2">Risk Score</th>
                <th className="px-3 py-2">Risk Level</th>
                <th className="px-3 py-2">Key Indicators</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-code text-[11px]">
              {predictions.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-3 py-4 text-center text-slate-500">
                    No prediction records found.
                  </td>
                </tr>
              ) : (
                predictions.slice(0, 15).map((pred, idx) => (
                  <tr key={pred.id || idx} className="hover:bg-slate-900/50 transition">
                    <td className="px-3 py-1.5 text-slate-500">
                      {new Date(pred.timestamp || Date.now()).toLocaleTimeString()}
                    </td>
                    <td className="px-3 py-1.5 text-cyan-300">{pred.nodeId}</td>
                    <td className="px-3 py-1.5 font-bold text-slate-200">{pred.prediction}</td>
                    <td className="px-3 py-1.5 text-cyan-400 font-bold">{pred.confidence}%</td>
                    <td className="px-3 py-1.5 text-slate-300">{pred.risk_score}/100</td>
                    <td className="px-3 py-1.5">
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        pred.risk_level === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                        pred.risk_level === 'HIGH' ? 'bg-amber-950 text-amber-300' :
                        pred.risk_level === 'MEDIUM' ? 'bg-yellow-950 text-yellow-300' : 'bg-emerald-950 text-emerald-300'
                      }`}>
                        {pred.risk_level}
                      </span>
                    </td>
                    <td className="px-3 py-1.5 text-slate-400 truncate max-w-[240px]">
                      {Array.isArray(pred.indicators) ? pred.indicators.join(', ') : pred.indicators || 'Normal'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
