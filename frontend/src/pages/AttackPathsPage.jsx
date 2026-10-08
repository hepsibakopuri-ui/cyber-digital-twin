import React, { useState } from 'react';
import {
  Route,
  ShieldAlert,
  ArrowRight,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Play,
  Layers
} from 'lucide-react';

export default function AttackPathsPage({ attackPaths = [], onSelectPath, onNavigate }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  const filteredPaths = attackPaths.filter(p => {
    const matchesSearch =
      p.NAME?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.PATH_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ENTRY_POINT?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.TARGET_ASSET?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesPriority =
      priorityFilter === 'ALL' || p.PRIORITY === priorityFilter;

    return matchesSearch && matchesPriority;
  });

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

  return (
    <div className="space-y-6">
      {/* Header & Filters */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Route className="h-4 w-4 text-purple-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Attack Trajectory Directory
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Full enterprise path matrix ranked by multi-hop exploitability and crown jewel impact
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search paths, assets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* Priority Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-800/60 p-1 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  priorityFilter === p
                    ? 'bg-purple-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Path Cards / Table */}
      <div className="space-y-3">
        {filteredPaths.length > 0 ? (
          filteredPaths.map((path) => (
            <div
              key={path.PATH_ID}
              className="rounded-xl border border-slate-800/90 bg-slate-900/70 p-5 backdrop-blur-md transition-all hover:border-slate-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono-code text-xs font-extrabold text-cyan-400">
                      {path.PATH_ID}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold border font-mono-code ${getPriorityBadge(
                        path.PRIORITY
                      )}`}
                    >
                      {path.PRIORITY}
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono-code">
                      {path.HOP_COUNT} Hops
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono-code">
                      {path.VULNERABILITY_COUNT || 1} CVEs
                    </span>
                    <span className="rounded bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 text-[10px] text-rose-300 font-mono-code">
                      {path.CRITICAL_ASSETS_AFFECTED} Crown Jewels
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{path.NAME}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                    {typeof path.EXPLANATION === 'object'
                      ? path.EXPLANATION?.narrative
                      : path.EXPLANATION}
                  </p>
                </div>

                <div className="flex items-center gap-6 border-t lg:border-t-0 border-slate-800 pt-3 lg:pt-0">
                  <div className="text-right">
                    <div className="text-2xl font-extrabold font-mono-code text-white">
                      <span
                        className={
                          path.RISK_SCORE >= 70
                            ? 'text-rose-400'
                            : path.RISK_SCORE >= 50
                            ? 'text-amber-400'
                            : 'text-emerald-400'
                        }
                      >
                        {path.RISK_SCORE}%
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-wider text-slate-500 font-medium">
                      Risk Score
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <button
                      onClick={() => {
                        if (onSelectPath) onSelectPath(path);
                        onNavigate('digital-twin');
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/30 px-3 py-1.5 text-xs font-semibold text-cyan-300 transition-colors"
                    >
                      <Layers className="h-3.5 w-3.5" />
                      View on Twin
                    </button>

                    <button
                      onClick={() => {
                        if (onSelectPath) onSelectPath(path);
                        onNavigate('what-if-simulator');
                      }}
                      className="flex items-center gap-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600/50 border border-purple-500/30 px-3 py-1.5 text-xs font-semibold text-purple-300 transition-colors"
                    >
                      <Play className="h-3.5 w-3.5" />
                      Simulate Attack
                    </button>
                  </div>
                </div>
              </div>

              {/* Hop Breakdown Strip */}
              {path.STEPS && path.STEPS.length > 0 && (
                <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-3 text-xs">
                  <span className="text-slate-500 text-[11px] font-medium mr-1">Hop Sequence:</span>
                  {path.STEPS.map((step, idx) => (
                    <React.Fragment key={idx}>
                      <div className="flex items-center gap-1.5 rounded-md border border-slate-800 bg-slate-800/50 px-2 py-1">
                        <span className="font-mono-code text-[10px] text-cyan-400">
                          {step.FROM_ASSET}
                        </span>
                        <ArrowRight className="h-2.5 w-2.5 text-slate-500" />
                        <span className="font-mono-code text-[10px] text-rose-300 font-bold">
                          {step.TO_ASSET}
                        </span>
                        <span className="rounded bg-slate-700 px-1 py-0.2 text-[9px] font-mono-code text-purple-300">
                          {step.TECHNIQUE_ID}
                        </span>
                      </div>
                      {idx < path.STEPS.length - 1 && (
                        <span className="text-slate-600">→</span>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-400">
            No attack trajectories match the filter criteria.
          </div>
        )}
      </div>
    </div>
  );
}
