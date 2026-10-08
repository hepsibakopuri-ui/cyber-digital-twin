import React, { useState, useEffect } from 'react';
import {
  History,
  ShieldCheck,
  Flame,
  ArrowRight,
  Database,
  Calendar,
  Layers,
  RotateCcw
} from 'lucide-react';
import { api } from '../services/api';

export default function SimulationHistoryPage({ onNavigate, onSelectPath }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.getSimulationHistory();
      if (res) setHistory(res);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Simulation & Defense Audit Log
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Immutable historical record of simulated attack scenarios and defensive mitigations recorded in Oracle Database
          </p>
        </div>

        <button
          onClick={fetchHistory}
          className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 text-xs font-semibold text-slate-200 transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
          Refresh Log
        </button>
      </div>

      {/* History Records Table / Cards */}
      <div className="space-y-3">
        {history.length > 0 ? (
          history.map((sim, idx) => (
            <div
              key={sim.SIMULATION_ID || idx}
              className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition-all hover:border-slate-700 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono-code text-xs font-bold text-cyan-400">
                    {sim.SIMULATION_ID}
                  </span>
                  <span className="font-bold text-white text-sm">{sim.SIMULATION_NAME}</span>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-400 font-mono-code">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3 text-cyan-400" />
                    {new Date(sim.SIMULATED_AT).toLocaleString()}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold border ${
                      sim.OUTCOME === 'ATTACK_BLOCKED' || sim.OUTCOME === 'BREACH_PREVENTED'
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {sim.OUTCOME}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Entry → Target</span>
                  <div className="font-mono-code text-slate-200 mt-0.5">
                    {sim.ENTRY_POINT} → {sim.TARGET_ASSET}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Defense Applied</span>
                  <div className="text-slate-200 font-medium mt-0.5 truncate">
                    {sim.DEFENSE_APPLIED || 'None'}
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Risk Delta</span>
                  <div className="font-mono-code mt-0.5">
                    <span className="text-rose-400">{sim.RISK_BEFORE}%</span>
                    <span className="text-slate-500 mx-1">→</span>
                    <span className="text-emerald-400 font-bold">{sim.RISK_AFTER}%</span>
                  </div>
                </div>

                <div>
                  <span className="text-slate-500 text-[10px] uppercase">Mitigation Efficacy</span>
                  <div className="font-mono-code text-cyan-400 font-bold mt-0.5">
                    {sim.RISK_REDUCTION_PCT > 0 ? `-${sim.RISK_REDUCTION_PCT}%` : '0%'}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-400">
            No simulation records found in database.
          </div>
        )}
      </div>
    </div>
  );
}
