import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Cpu,
  Route,
  ShieldAlert,
  Flame,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  HelpCircle,
  Wrench,
  ShieldCheck,
  RefreshCw,
  Sparkles
} from 'lucide-react';

export default function AttackPredictionPage({
  attackPaths = [],
  onPredict,
  isPredicting = false,
  selectedPath,
  onSelectPath,
  onSimulateDefense,
  onNavigate
}) {
  const [activePathId, setActivePathId] = useState(
    selectedPath?.PATH_ID || (attackPaths.length > 0 ? attackPaths[0].PATH_ID : null)
  );

  const currentPath = attackPaths.find(p => p.PATH_ID === activePathId) || attackPaths[0];

  const handleSelect = (path) => {
    setActivePathId(path.PATH_ID);
    if (onSelectPath) onSelectPath(path);
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

  return (
    <div className="space-y-6">
      {/* Top Banner & Predict Trigger */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-purple-400 animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono-code">
              Intelligent Risk Inference Engine
            </span>
          </div>
          <h2 className="mt-1 text-lg font-bold text-white">AI-Based Attack Path Prediction & Ranking</h2>
          <p className="text-xs text-slate-400 max-w-2xl">
            Simulates adversary graph traversal from perimeter exposure to core enterprise crown jewels.
            Evaluates CVSS ratings, microsegmentation boundaries, and MITRE ATT&CK technique transition probabilities.
          </p>
        </div>

        <button
          onClick={onPredict}
          disabled={isPredicting}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 px-5 py-2.5 text-xs font-bold text-white shadow-lg shadow-purple-900/30 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isPredicting ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin text-white" />
              <span>Scanning Graph Feasibility...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 text-purple-200" />
              <span>Predict Attack Paths</span>
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Ranked Attack Paths List (7 cols) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="flex items-center justify-between pb-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Ranked Feasible Attack Trajectories ({attackPaths.length})
            </h3>
            <span className="text-xs text-slate-500">Ordered by Composite Risk</span>
          </div>

          <div className="space-y-3">
            {attackPaths.map((path) => {
              const isSelected = path.PATH_ID === activePathId;

              return (
                <motion.div
                  key={path.PATH_ID}
                  onClick={() => handleSelect(path)}
                  whileHover={{ scale: 1.005 }}
                  className={`cursor-pointer rounded-xl border p-4 transition-all duration-200 ${
                    isSelected
                      ? 'border-purple-500/80 bg-purple-950/20 shadow-lg shadow-purple-950/30 ring-1 ring-purple-500/50'
                      : 'border-slate-800/80 bg-slate-900/60 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-code text-xs font-bold text-cyan-400">
                          {path.PATH_ID}
                        </span>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-bold border font-mono-code ${getPriorityBadge(
                            path.PRIORITY
                          )}`}
                        >
                          {path.PRIORITY}
                        </span>
                        <span className="text-[10px] font-mono-code text-slate-400">
                          {path.HOP_COUNT} Hops
                        </span>
                        {path.STATUS === 'BLOCKED' && (
                          <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30 font-mono-code">
                            BLOCKED / MITIGATED
                          </span>
                        )}
                      </div>
                      <h4 className="text-sm font-bold text-white leading-snug">{path.NAME}</h4>
                    </div>

                    <div className="text-right">
                      <div className="flex items-baseline justify-end gap-1">
                        <span
                          className={`text-xl font-extrabold font-mono-code ${
                            path.RISK_SCORE >= 70
                              ? 'text-rose-400'
                              : path.RISK_SCORE >= 50
                              ? 'text-amber-400'
                              : 'text-emerald-400'
                          }`}
                        >
                          {path.RISK_SCORE}%
                        </span>
                        <span className="text-[10px] text-slate-400">Risk</span>
                      </div>
                      <span className="text-[10px] text-slate-500 font-mono-code">
                        {path.CONFIDENCE_SCORE}% Confidence
                      </span>
                    </div>
                  </div>

                  {/* Step Traversal Visual Bar */}
                  <div className="mt-3 flex items-center gap-2 border-t border-slate-800/80 pt-2.5 text-xs text-slate-300">
                    <span className="text-slate-400 font-mono-code text-[11px]">Entry:</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono-code text-[11px] text-cyan-300">
                      {path.ENTRY_POINT}
                    </span>
                    <ArrowRight className="h-3 w-3 text-slate-500" />
                    <span className="text-slate-400 font-mono-code text-[11px]">Target:</span>
                    <span className="rounded bg-slate-800 px-1.5 py-0.5 font-mono-code text-[11px] text-rose-300 font-semibold">
                      {path.TARGET_ASSET}
                    </span>

                    <span className="ml-auto text-[11px] text-slate-400">
                      {path.CRITICAL_ASSETS_AFFECTED} Crown Jewels Affected
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Explainable AI & Recommended Defense (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          {currentPath ? (
            <>
              {/* Explainable AI Box */}
              <div className="rounded-xl border border-slate-800/80 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
                  <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400">
                    <HelpCircle className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                      Explainable AI (XAI) Justification
                    </h3>
                    <p className="text-[10px] text-slate-400">
                      Causal Reasoning Engine for {currentPath.PATH_ID}
                    </p>
                  </div>
                </div>

                {/* Natural Language Narrative */}
                <div className="rounded-lg border border-purple-500/20 bg-purple-500/5 p-3 text-xs leading-relaxed text-slate-200">
                  <p className="font-medium text-purple-300 mb-1">Prediction Explanation:</p>
                  {typeof currentPath.EXPLANATION === 'object'
                    ? currentPath.EXPLANATION.narrative
                    : currentPath.EXPLANATION}
                </div>

                {/* Why this path is high risk Checklist */}
                <div>
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                    Why is this path ranked {currentPath.PRIORITY}?
                  </h4>
                  <ul className="space-y-2 text-xs">
                    {typeof currentPath.EXPLANATION === 'object' && currentPath.EXPLANATION.factors ? (
                      currentPath.EXPLANATION.factors.map((factor, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-slate-300">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>{factor}</span>
                        </li>
                      ))
                    ) : (
                      <>
                        <li className="flex items-start gap-2 text-slate-300">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                          <span>Public-facing Web Server has active unpatched CVE-2024-21887 on exposed port 443.</span>
                        </li>
                        <li className="flex items-start gap-2 text-slate-300">
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                          <span>Absence of microsegmentation between DMZ and Application tier allows unrestricted lateral RPC pivoting.</span>
                        </li>
                        <li className="flex items-start gap-2 text-slate-300">
                          <AlertTriangle className="h-3.5 w-3.5 text-rose-400 flex-shrink-0 mt-0.5" />
                          <span>Application Server holds active connection pool credentials into the Oracle Database Server.</span>
                        </li>
                        <li className="flex items-start gap-2 text-slate-300">
                          <AlertTriangle className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0 mt-0.5" />
                          <span>Target asset is classified as a tier-1 Crown Jewel with highest enterprise impact.</span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {/* Traversal Steps Breakdown */}
                {currentPath.STEPS && currentPath.STEPS.length > 0 && (
                  <div>
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                      Multi-Hop Traversal Stages
                    </h4>
                    <div className="space-y-1.5">
                      {currentPath.STEPS.map((step, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-700 font-mono-code text-[10px] text-white">
                              {step.STEP_ORDER || idx + 1}
                            </span>
                            <span className="font-mono-code text-cyan-300">{step.FROM_ASSET}</span>
                            <ArrowRight className="h-3 w-3 text-slate-500" />
                            <span className="font-mono-code text-rose-300">{step.TO_ASSET}</span>
                          </div>
                          <span className="rounded bg-purple-500/20 px-1.5 py-0.5 font-mono-code text-[10px] text-purple-300">
                            {step.TECHNIQUE_ID}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Recommended Defense Action Box */}
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-950/20 p-4 backdrop-blur-md space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-cyan-400" />
                    <span className="text-xs font-bold text-white uppercase tracking-wider">
                      Recommended Defense Remediation
                    </span>
                  </div>
                  <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 font-mono-code border border-emerald-500/30">
                    Est. -49.45% Risk
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Deploy virtual patch for CVE-2024-21887 and enforce strict Zero-Trust microsegmentation on Internal Firewall.
                </p>

                <div className="flex items-center gap-2 pt-1">
                  <button
                    onClick={() => {
                      if (onSimulateDefense) onSimulateDefense('REC-01');
                      onNavigate('defense-recommendations');
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-2 text-xs font-bold text-white transition-colors"
                  >
                    <Wrench className="h-3.5 w-3.5" />
                    Simulate Defense Now
                  </button>

                  <button
                    onClick={() => onNavigate('digital-twin')}
                    className="rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors"
                  >
                    Inspect in Twin
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-8 text-center text-xs text-slate-400">
              Select an attack path to view Explainable AI justification.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
