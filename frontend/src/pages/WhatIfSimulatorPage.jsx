import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  PlayCircle,
  Pause,
  Play,
  RotateCcw,
  SkipForward,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Flame,
  CheckCircle2,
  XCircle,
  Cpu,
  Layers,
  Database
} from 'lucide-react';
import { api } from '../services/api';

export default function WhatIfSimulatorPage({ onNavigate, onSelectPath }) {
  const [entryPoint, setEntryPoint] = useState('internet');
  const [targetAsset, setTargetAsset] = useState('db-server');
  const [vulnerabilityId, setVulnerabilityId] = useState('CVE-2024-21887');
  const [securityControlState, setSecurityControlState] = useState('DEFAULT');

  const [simulationResult, setSimulationResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStageIndex, setActiveStageIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleRunSimulation = async () => {
    setIsRunning(true);
    setActiveStageIndex(-1);
    setIsPlaying(true);

    try {
      const res = await api.runWhatIfSimulation({
        entryPoint,
        targetAsset,
        vulnerabilityId,
        securityControlState
      });

      if (res && res.data) {
        setSimulationResult(res.data);
        setActiveStageIndex(0);
      }
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsRunning(false);
    }
  };

  // Step-by-step playback ticker
  useEffect(() => {
    let interval = null;
    if (isPlaying && simulationResult && simulationResult.stages) {
      interval = setInterval(() => {
        setActiveStageIndex(prev => {
          if (prev < simulationResult.stages.length - 1) {
            return prev + 1;
          } else {
            setIsPlaying(false);
            return prev;
          }
        });
      }, 1400);
    }
    return () => clearInterval(interval);
  }, [isPlaying, simulationResult]);

  const handleStepForward = () => {
    if (simulationResult && simulationResult.stages) {
      setActiveStageIndex(prev => Math.min(prev + 1, simulationResult.stages.length - 1));
    }
  };

  const handleReset = () => {
    setActiveStageIndex(-1);
    setIsPlaying(false);
    setSimulationResult(null);
  };

  const currentStage =
    simulationResult && activeStageIndex >= 0
      ? simulationResult.stages[activeStageIndex]
      : null;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <PlayCircle className="h-4 w-4 text-cyan-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            What-If Scenario Attack Simulator
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Hypothetical breach simulation sandbox. Select attack inception vectors, target enterprise assets,
          and defense control states to visualize step-by-step traversal mechanics and blast radius propagation.
        </p>
      </div>

      {/* Interactive Scenario Builder Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md">
        {/* 1. Entry Point */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            1. Ingress Entry Point
          </label>
          <select
            value={entryPoint}
            onChange={(e) => setEntryPoint(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="internet">Public Internet (Untrusted External)</option>
            <option value="emp-pc">Employee Workstation (Phished LAN)</option>
            <option value="cloud-vpc">Cloud VPC Gateway (Microservice API)</option>
          </select>
        </div>

        {/* 2. Target Crown Jewel */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            2. Target Asset (Crown Jewel)
          </label>
          <select
            value={targetAsset}
            onChange={(e) => setTargetAsset(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="db-server">Database Server (Oracle 11g/19c XE)</option>
            <option value="admin-pc">Admin Workstation (Privileged Core)</option>
          </select>
        </div>

        {/* 3. Exploited Vulnerability */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            3. Exploitation Vector
          </label>
          <select
            value={vulnerabilityId}
            onChange={(e) => setVulnerabilityId(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="CVE-2024-21887">CVE-2024-21887 (Web RCE / Port 443)</option>
            <option value="CVE-2021-44228">CVE-2021-44228 (Apache Log4j)</option>
            <option value="CVE-2024-38112">CVE-2024-38112 (User Phishing Shortcut)</option>
          </select>
        </div>

        {/* 4. Defensive Posture */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">
            4. Defense Posture
          </label>
          <select
            value={securityControlState}
            onChange={(e) => setSecurityControlState(e.target.value)}
            className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
          >
            <option value="DEFAULT">Baseline (Unmitigated Controls)</option>
            <option value="PATCHED_WEB">Virtual Patch Deployed (CVE Fixed)</option>
            <option value="SEGMENTATION_ENABLED">Microsegmentation Active (Internal FW)</option>
          </select>
        </div>
      </div>

      {/* Simulator Execution Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={handleRunSimulation}
            disabled={isRunning}
            className="flex items-center gap-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-4 py-2 text-xs font-bold text-white transition-colors cursor-pointer"
          >
            <Play className="h-4 w-4" />
            {simulationResult ? 'Re-Run Simulation' : 'Execute Attack Simulation'}
          </button>

          {simulationResult && (
            <>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors"
              >
                {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
                {isPlaying ? 'Pause Playback' : 'Play Traversal'}
              </button>

              <button
                onClick={handleStepForward}
                disabled={isPlaying || activeStageIndex >= (simulationResult?.stages?.length - 1)}
                className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 px-3 py-2 text-xs font-semibold text-slate-200 transition-colors"
              >
                <SkipForward className="h-3.5 w-3.5" />
                Step Forward
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-lg border border-slate-800 hover:bg-slate-800 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Reset
              </button>
            </>
          )}
        </div>

        {simulationResult && (
          <div className="flex items-center gap-2 text-xs font-mono-code">
            <span className="text-slate-400">Step:</span>
            <span className="font-bold text-cyan-400">
              {activeStageIndex >= 0 ? activeStageIndex + 1 : 0} of {simulationResult.stages.length}
            </span>
          </div>
        )}
      </div>

      {/* Simulation Stage Traversal Viewport */}
      {simulationResult && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Stage Progression Timeline (7 cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Adversary Traversal Stage Timeline
            </h3>

            <div className="space-y-3">
              {simulationResult.stages.map((stage, idx) => {
                const isCurrent = idx === activeStageIndex;
                const isPast = idx < activeStageIndex;
                const isFuture = idx > activeStageIndex;

                let border = 'border-slate-800 opacity-60';
                if (isCurrent) {
                  border = stage.status === 'BLOCKED'
                    ? 'border-emerald-500 bg-emerald-950/20 ring-2 ring-emerald-500'
                    : 'border-rose-500 bg-rose-950/20 ring-2 ring-rose-500';
                } else if (isPast) {
                  border = 'border-slate-700 bg-slate-900/80 opacity-90';
                }

                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: isFuture ? 0.4 : 1, x: 0 }}
                    className={`rounded-xl border p-4 transition-all ${border}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-cyan-400 font-mono-code border border-slate-700">
                          {stage.stepNumber}
                        </span>
                        <span className="font-bold text-white text-sm">
                          {stage.fromAssetName} → {stage.toAssetName}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="rounded bg-purple-500/20 px-2 py-0.5 text-[10px] font-bold text-purple-300 font-mono-code border border-purple-500/30">
                          {stage.techniqueId}
                        </span>
                        <span
                          className={`rounded px-2 py-0.5 text-[10px] font-bold font-mono-code ${
                            stage.status === 'BLOCKED'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          }`}
                        >
                          {stage.status}
                        </span>
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-300 leading-relaxed pl-8">
                      {stage.action}
                    </p>

                    <div className="mt-2.5 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] font-mono-code pl-8">
                      <span className="text-slate-400">Technique: {stage.techniqueName}</span>
                      <span className={stage.currentRisk >= 70 ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                        Stage Risk: {stage.currentRisk}%
                      </span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Simulation Outcome Summary Card (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 font-mono-code">
                  Analysis Report
                </span>
                <h3 className="text-base font-bold text-white">What-If Simulation Outcome</h3>
              </div>

              {/* Status Outcome Banner */}
              <div
                className={`flex items-center gap-3 rounded-xl border p-4 ${
                  simulationResult.outcome === 'ATTACK_BLOCKED'
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}
              >
                {simulationResult.outcome === 'ATTACK_BLOCKED' ? (
                  <ShieldCheck className="h-7 w-7 text-emerald-400" />
                ) : (
                  <Flame className="h-7 w-7 text-rose-400 animate-pulse" />
                )}
                <div>
                  <div className="font-bold text-sm">
                    {simulationResult.outcome === 'ATTACK_BLOCKED'
                      ? 'ATTACK DEFLECTED / BLOCKED'
                      : 'CROWN JEWEL BREACH SIMULATED'}
                  </div>
                  <div className="text-xs opacity-90 mt-0.5">
                    {simulationResult.isBlocked
                      ? `Threat vector contained at ${simulationResult.blockedAt}.`
                      : `Downstream crown jewel ${simulationResult.targetAsset} fully compromised.`}
                  </div>
                </div>
              </div>

              {/* Risk Delta Stat */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-3">
                  <span className="text-slate-400 text-[10px] uppercase">Final Risk</span>
                  <div
                    className={`mt-1 font-mono-code text-xl font-bold ${
                      simulationResult.finalRisk >= 70
                        ? 'text-rose-400'
                        : simulationResult.finalRisk >= 50
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}
                  >
                    {simulationResult.finalRisk}%
                  </div>
                </div>

                <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-3">
                  <span className="text-slate-400 text-[10px] uppercase">Path Length</span>
                  <div className="mt-1 font-mono-code text-xl font-bold text-white">
                    {simulationResult.stages.length} Hops
                  </div>
                </div>
              </div>

              {/* Traversal Route */}
              <div className="space-y-1 text-xs">
                <span className="text-slate-400 font-medium">Trajectory Path:</span>
                <p className="font-mono-code text-cyan-300 text-xs break-words">
                  {simulationResult.pathString}
                </p>
              </div>

              {/* Critical Assets Exposed */}
              <div className="space-y-1.5 text-xs">
                <span className="text-slate-400 font-medium">Critical Assets Exposed:</span>
                <div className="flex flex-wrap gap-1.5">
                  {simulationResult.criticalAssetsExposed && simulationResult.criticalAssetsExposed.length > 0 ? (
                    simulationResult.criticalAssetsExposed.map((assetName, idx) => (
                      <span
                        key={idx}
                        className="rounded border border-rose-500/30 bg-rose-500/20 px-2 py-0.5 font-bold text-rose-300 text-[11px]"
                      >
                        {assetName}
                      </span>
                    ))
                  ) : (
                    <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      No critical tier-1 crown jewels compromised
                    </span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-800 flex gap-2">
                <button
                  onClick={() => onNavigate('digital-twin')}
                  className="flex-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 py-2 text-xs font-semibold text-slate-200 transition-colors"
                >
                  View in Digital Twin
                </button>
                <button
                  onClick={() => onNavigate('defense-recommendations')}
                  className="flex-1 rounded-lg bg-cyan-600 hover:bg-cyan-500 py-2 text-xs font-semibold text-white transition-colors"
                >
                  Deploy Mitigations
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
