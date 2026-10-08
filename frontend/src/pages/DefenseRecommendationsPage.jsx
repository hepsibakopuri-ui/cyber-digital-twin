import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  Wrench,
  TrendingDown,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Layers,
  Sparkles,
  Cpu
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function DefenseRecommendationsPage({
  recommendations = [],
  onSimulateDefense,
  lastDefenseResult,
  onNavigate
}) {
  const [simulatingId, setSimulatingId] = useState(null);

  const handleSimulate = async (recId) => {
    setSimulatingId(recId);
    try {
      if (onSimulateDefense) {
        await onSimulateDefense(recId);
      }
    } finally {
      setSimulatingId(null);
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  // Chart data for before vs. after comparison
  const comparisonData = lastDefenseResult
    ? [
        { name: 'Before Defense', risk: lastDefenseResult.riskBefore || 91.0, fill: '#f43f5e' },
        { name: 'After Defense', risk: lastDefenseResult.riskAfter || 46.0, fill: '#10b981' }
      ]
    : [
        { name: 'Before Defense', risk: 91.0, fill: '#f43f5e' },
        { name: 'After Defense', risk: 46.0, fill: '#10b981' }
      ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Automated Defensive Mitigation & Risk Recalculation
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Prescriptive remediation engine. Execute simulated defensive actions on the Digital Twin to verify
          risk attenuation and observe attack path blocking before enterprise rollout.
        </p>
      </div>

      {/* Comparison Delta Display (Section 12 requirement) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Animated Before vs. After Risk Comparison Card */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800/80 bg-slate-900/80 p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 font-mono-code">
              Dynamic Recalculation Engine
            </span>
            <h3 className="text-base font-bold text-white">Before vs. After Mitigation Comparison</h3>
            <p className="text-xs text-slate-400">
              {lastDefenseResult
                ? `Active simulation for: ${lastDefenseResult.actionTitle}`
                : 'Showing baseline vs. patched simulation trial (REC-01)'}
            </p>
          </div>

          <div className="my-4 h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={11} tickLine={false} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="risk" radius={[6, 6, 0, 0]}>
                  {comparisonData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-3 gap-2 border-t border-slate-800 pt-3 text-center text-xs">
            <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-2">
              <span className="text-rose-300 text-[10px] uppercase font-mono-code">Risk Before</span>
              <div className="text-xl font-bold font-mono-code text-rose-400">
                {lastDefenseResult ? lastDefenseResult.riskBefore : 91}%
              </div>
            </div>

            <div className="rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2">
              <span className="text-emerald-300 text-[10px] uppercase font-mono-code">Risk After</span>
              <div className="text-xl font-bold font-mono-code text-emerald-400">
                {lastDefenseResult ? lastDefenseResult.riskAfter : 46}%
              </div>
            </div>

            <div className="rounded-lg bg-cyan-500/10 border border-cyan-500/20 p-2">
              <span className="text-cyan-300 text-[10px] uppercase font-mono-code">Risk Reduction</span>
              <div className="text-xl font-bold font-mono-code text-cyan-400">
                -{lastDefenseResult ? lastDefenseResult.riskReductionPct : 49.45}%
              </div>
            </div>
          </div>
        </div>

        {/* Defense Feedback Summary & Verification */}
        <div className="lg:col-span-6 rounded-xl border border-slate-800/80 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono-code">
              Remediation Verification
            </span>
            <h3 className="text-base font-bold text-white">Closed-Loop Twin Impact Analysis</h3>
          </div>

          <div className="space-y-3 text-xs leading-relaxed text-slate-300">
            <div className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-800/40 p-3">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Digital Twin State Updated</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Vulnerability state switched to PATCHED; perimeter exposure damping factor re-computed.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-800/40 p-3">
              <TrendingDown className="h-4 w-4 text-cyan-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Attack Trajectories Recalculated</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Primary 91% risk trajectory (PATH-01) attenuated and downgraded to moderate/blocked status.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5 rounded-lg border border-slate-800 bg-slate-800/40 p-3">
              <Cpu className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-white">Oracle DB Simulation Logged</span>
                <p className="text-slate-400 text-[11px] mt-0.5">
                  Simulation run and risk delta recorded into Oracle SIMULATIONS table with full audit trail.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800 flex gap-2">
            <button
              onClick={() => onNavigate('digital-twin')}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 py-2.5 text-xs font-semibold text-slate-200 transition-colors"
            >
              <Layers className="h-3.5 w-3.5" />
              Inspect Digital Twin Nodes
            </button>
            <button
              onClick={() => onNavigate('simulation-history')}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 py-2.5 text-xs font-semibold text-white transition-colors"
            >
              View Simulation History
            </button>
          </div>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
          Prioritized Defensive Recommendations ({recommendations.length})
        </h3>

        <div className="space-y-3">
          {recommendations.map(rec => (
            <div
              key={rec.REC_ID}
              className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 rounded-xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md transition-all hover:border-slate-700"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono-code text-xs font-bold text-cyan-400">
                    {rec.REC_ID}
                  </span>
                  <span
                    className={`rounded px-2 py-0.5 text-[10px] font-bold border font-mono-code ${getPriorityBadge(
                      rec.PRIORITY
                    )}`}
                  >
                    {rec.PRIORITY} PRIORITY
                  </span>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono-code">
                    Asset: {rec.AFFECTED_ASSET_ID}
                  </span>
                  <span className="rounded bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 font-mono-code">
                    Est. -{rec.ESTIMATED_RISK_REDUCTION}% Risk
                  </span>
                  {rec.STATUS === 'APPLIED' && (
                    <span className="rounded bg-cyan-500/20 px-2 py-0.5 text-[10px] font-bold text-cyan-300 border border-cyan-500/40 font-mono-code">
                      SIMULATION APPLIED
                    </span>
                  )}
                </div>

                <h4 className="text-sm font-bold text-white">{rec.TITLE}</h4>
                <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">{rec.REASON}</p>
              </div>

              <div className="flex items-center gap-3 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                <button
                  onClick={() => handleSimulate(rec.REC_ID)}
                  disabled={simulatingId === rec.REC_ID}
                  className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-cyan-950/40 disabled:opacity-50 transition-all cursor-pointer"
                >
                  <Wrench className="h-3.5 w-3.5" />
                  {simulatingId === rec.REC_ID ? 'Simulating Defense...' : 'Simulate Defense'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
