import React from 'react';
import { Shield, Cpu, Database, RefreshCw, AlertTriangle, Activity, Smartphone } from 'lucide-react';

export default function Navbar({
  topology,
  aiStatus,
  oracleStatus,
  activeScenario,
  onReset,
  onOpenMobileModal
}) {
  const resilience = topology?.resilienceIndex ?? 100;
  const isAttackActive = activeScenario && activeScenario !== 'BASELINE_NORMAL';

  return (
    <header className="border-b border-cyber-border bg-[#0d1424]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo & Branding */}
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Shield className="w-6 h-6 animate-pulse" />
            </div>
            {isAttackActive && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
              </span>
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                CYBER-TWIN <span className="text-cyan-400 text-xs px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800/60">SOC AI</span>
              </h1>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              AI-Based Cybersecurity Digital Twin & Attack Prediction System
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div className="flex items-center space-x-3 text-xs">
          {/* Cyber Resilience Score */}
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
            <Activity className="w-4 h-4 text-cyan-400" />
            <span className="text-slate-400 hidden md:inline">Resilience:</span>
            <span className={`font-mono-code font-bold ${
              resilience >= 80 ? 'text-emerald-400' : resilience >= 50 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {resilience}%
            </span>
          </div>

          {/* Java Weka AI Status */}
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
            <Cpu className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400 hidden md:inline">Weka AI:</span>
            <span className="font-mono-code text-purple-300 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
              {aiStatus?.accuracy ? `${aiStatus.accuracy}% Acc` : 'Active'}
            </span>
          </div>

          {/* Oracle DB Status */}
          <div className="flex items-center space-x-2 bg-slate-900/80 px-3 py-1.5 rounded-md border border-slate-800">
            <Database className="w-4 h-4 text-amber-400" />
            <span className="text-slate-400 hidden md:inline">Oracle DB:</span>
            <span className={`font-mono-code font-semibold flex items-center gap-1 ${
              oracleStatus?.connected ? 'text-emerald-400' : 'text-amber-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${oracleStatus?.connected ? 'bg-emerald-400' : 'bg-amber-400'} inline-block`}></span>
              {oracleStatus?.connected ? 'XE 11g/19c' : 'Sync Cache'}
            </span>
          </div>

          {/* Mobile Alerts Modal Button */}
          <button
            onClick={onOpenMobileModal}
            title="Configure Mobile Alerts and QR Mobile View"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-700/60 font-semibold transition"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Mobile Alerts</span>
          </button>

          {/* Reset Digital Twin */}
          <button
            onClick={onReset}
            title="Reset Digital Twin to Normal Baseline"
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-md bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Twin</span>
          </button>
        </div>
      </div>

      {/* Active Attack Notification Banner */}
      {isAttackActive && (
        <div className="bg-rose-950/70 border-y border-rose-800/60 px-4 py-1.5 text-center text-xs text-rose-200 flex items-center justify-center space-x-2 animate-pulse">
          <AlertTriangle className="w-4 h-4 text-rose-400" />
          <span className="font-semibold">ATTACK CAMPAIGN IN PROGRESS:</span>
          <span className="font-mono-code bg-rose-900/80 px-2 py-0.5 rounded border border-rose-700 text-rose-100">
            {activeScenario}
          </span>
          <span className="text-rose-300">Weka AI evaluating intrusion signatures in real time.</span>
        </div>
      )}
    </header>
  );
}
