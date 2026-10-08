import React from 'react';
import { GitCommit, ArrowRight, AlertTriangle, Clock, Target } from 'lucide-react';

export default function AttackPathForecast({ forecast = [], currentNode = null }) {
  return (
    <div className="bg-[#0b101d] rounded-xl border border-cyber-border p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/60">
        <div className="flex items-center space-x-2">
          <Target className="w-4 h-4 text-rose-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Attack Path & Next-Victim Forecast
          </h2>
        </div>
        <span className="text-[10px] font-mono-code text-slate-400">
          Digital Twin Graph Traversal
        </span>
      </div>

      <div className="mt-3">
        {currentNode && (
          <div className="text-xs text-slate-400 mb-3 flex items-center gap-1.5 bg-slate-900/60 p-2 rounded border border-slate-800">
            <span>Breached Origin:</span>
            <span className="font-bold text-rose-400 font-mono-code">{currentNode.name}</span>
            <span className="text-slate-500">({currentNode.ip})</span>
          </div>
        )}

        {forecast.length === 0 ? (
          <div className="text-center py-6 text-slate-500 text-xs">
            <p>No active downstream breach paths detected.</p>
            <p className="text-[10px] text-slate-600 mt-1">Network segmentation is currently holding baseline.</p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {forecast.map((hop, idx) => (
              <div
                key={idx}
                className="p-3 rounded-lg bg-slate-900/80 border border-cyber-border hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-mono-code">
                      HOP #{idx + 1}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                    <span className="text-xs font-bold text-white font-mono-code">
                      {hop.targetNodeName}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${
                      hop.severity === 'CRITICAL' ? 'bg-rose-950 text-rose-300 border border-rose-800' :
                      hop.severity === 'HIGH' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-yellow-950 text-yellow-300'
                    }`}>
                      {hop.severity}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 mt-1 flex items-center gap-1">
                    <span className="text-slate-500">Vector:</span> {hop.likelyAttackVector}
                  </p>
                </div>

                <div className="flex items-center space-x-4 text-xs sm:text-right">
                  <div>
                    <span className="text-[10px] text-slate-500 block">Breach Probability</span>
                    <span className="font-mono-code font-bold text-rose-400 text-sm">
                      {hop.breachProbability}%
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Est. TTB
                    </span>
                    <span className="font-mono-code font-semibold text-slate-200">
                      ~{hop.estimatedMinutesToCompromise} min
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
