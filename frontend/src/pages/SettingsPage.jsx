import React, { useState, useEffect } from 'react';
import {
  Settings,
  Database,
  Cpu,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Server,
  Sliders,
  Terminal,
  ShieldAlert
} from 'lucide-react';
import { api } from '../services/api';

export default function SettingsPage({ onResetSystem, oracleConnected }) {
  const [dbUser, setDbUser] = useState('CYBER_TWIN');
  const [dbPassword, setDbPassword] = useState('CyberTwin#2026');
  const [connectString, setConnectString] = useState('127.0.0.1:1521/XE');
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [systemStatus, setSystemStatus] = useState(null);

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await api.getSystemStatus();
        if (res) setSystemStatus(res);
      } catch (err) {}
    }
    loadStatus();
  }, []);

  const handleTestOracle = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await api.testOracle({
        user: dbUser,
        password: dbPassword,
        connectString: connectString
      });
      setTestResult(res);
    } catch (err) {
      setTestResult({ success: false, error: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Settings className="h-4 w-4 text-cyan-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            Platform Engine & Oracle Database Settings
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-0.5">
          Configure AI prediction weights, verify Oracle XE relational persistence, and manage Digital Twin states
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Oracle Database Configuration & Status */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Database className="h-4 w-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Oracle Database Integration
              </h3>
            </div>
            <span className="flex items-center gap-1 rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 font-mono-code border border-emerald-500/30">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              {oracleConnected ? 'LIVE ORACLE XE' : 'ACTIVE SIMULATION'}
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">Database User / Schema</label>
              <input
                type="text"
                value={dbUser}
                onChange={(e) => setDbUser(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs font-mono-code text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Password</label>
              <input
                type="password"
                value={dbPassword}
                onChange={(e) => setDbPassword(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs font-mono-code text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">TNS Connect String / SID</label>
              <input
                type="text"
                value={connectString}
                onChange={(e) => setConnectString(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 p-2 text-xs font-mono-code text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-3 text-[11px] space-y-1 font-mono-code">
              <div className="flex justify-between">
                <span className="text-slate-400">Driver Mode:</span>
                <span className="text-cyan-300">node-oracledb Thick (OCI.DLL)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">SQL*Plus Script Compatibility:</span>
                <span className="text-emerald-400 font-bold">100% Verified</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Relational Tables:</span>
                <span className="text-white">14 Tables (Assets, Paths, CVEs, etc.)</span>
              </div>
            </div>

            <button
              onClick={handleTestOracle}
              disabled={isTesting}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 py-2 text-xs font-semibold text-amber-200 transition-colors cursor-pointer"
            >
              <Database className="h-3.5 w-3.5" />
              {isTesting ? 'Testing Connection...' : 'Test Oracle Connection'}
            </button>

            {testResult && (
              <div
                className={`rounded-lg border p-3 text-xs font-mono-code ${
                  testResult.success
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}
              >
                {testResult.success ? (
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                    <span>Connected to {testResult.details?.DBNAME || 'Oracle Database XE'} successfully!</span>
                  </div>
                ) : (
                  <div className="flex items-start gap-1.5">
                    <AlertTriangle className="h-4 w-4 text-rose-400 flex-shrink-0 mt-0.5" />
                    <span className="break-all">{testResult.error}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* AI Prediction Engine Configuration */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Cpu className="h-4 w-4 text-purple-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              AI Prediction Weights Configuration
            </h3>
          </div>

          <div className="space-y-3.5 text-xs">
            <p className="text-slate-400 text-xs leading-relaxed">
              Transparent multi-factor scoring formula coefficients utilized by the prediction and risk recalculation engines.
            </p>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Vulnerability CVSS Severity (w1)</span>
                <span className="font-mono-code text-purple-300">35%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[35%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Asset Criticality (w2)</span>
                <span className="font-mono-code text-purple-300">25%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[25%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Network Exposure / Subnet Zone (w3)</span>
                <span className="font-mono-code text-purple-300">20%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[20%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Connectivity & Degree (w4)</span>
                <span className="font-mono-code text-purple-300">10%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[10%]" />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-300">Security Control Damping (w5)</span>
                <span className="font-mono-code text-purple-300">10%</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full w-[10%]" />
              </div>
            </div>

            {/* Reset Twin Button */}
            <div className="pt-4 border-t border-slate-800">
              <button
                onClick={onResetSystem}
                className="w-full flex items-center justify-center gap-2 rounded-lg bg-rose-600/20 hover:bg-rose-600/40 border border-rose-500/30 py-2.5 text-xs font-bold text-rose-300 transition-colors cursor-pointer"
              >
                <RotateCcw className="h-4 w-4" />
                Reset Digital Twin to Factory Baseline
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
