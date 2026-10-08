import React, { useState, useEffect } from 'react';
import {
  Clock,
  Database,
  RotateCcw,
  User,
  ShieldCheck,
  AlertOctagon,
  LogOut
} from 'lucide-react';

export default function TopBar({
  title,
  subtitle,
  oracleConnected = false,
  networkRisk = 82.5,
  onReset,
  user,
  onLogout
}) {
  const [timeStr, setTimeStr] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(
        now.toISOString().slice(0, 19).replace('T', ' ') + ' UTC'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="flex h-16 w-full items-center justify-between border-b border-slate-800 bg-slate-950/80 px-6 backdrop-blur-md z-20">
      {/* Page Title & Breadcrumb */}
      <div>
        <h1 className="text-base font-bold tracking-tight text-white">{title}</h1>
        {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
      </div>

      {/* Center / Right Control Strip */}
      <div className="flex items-center gap-3">
        {/* Live Clock Ticker */}
        <div className="hidden lg:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-400 font-mono-code">
          <Clock className="h-3.5 w-3.5 text-cyan-400" />
          <span>{timeStr}</span>
        </div>

        {/* Oracle DB Connection Pill */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs">
          <Database className="h-3.5 w-3.5 text-amber-400" />
          <span className="text-slate-300 font-medium">Oracle XE</span>
          <span className="flex items-center gap-1 text-[10px] font-mono-code text-emerald-400 font-bold">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            {oracleConnected ? 'LIVE XE' : 'SIMULATION'}
          </span>
        </div>

        {/* Network Risk Score Pill */}
        <div className="flex items-center gap-2 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs">
          <span className="text-slate-400">Peak Risk:</span>
          <span
            className={`font-mono-code font-bold ${
              networkRisk >= 75 ? 'text-rose-400' : networkRisk >= 50 ? 'text-amber-400' : 'text-emerald-400'
            }`}
          >
            {networkRisk}%
          </span>
        </div>

        {/* Reset State Button */}
        {onReset && (
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-1.5 text-xs text-slate-300 hover:border-slate-700 hover:bg-slate-800 hover:text-white transition-colors"
            title="Reset Digital Twin to Factory Baseline"
          >
            <RotateCcw className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Reset Twin</span>
          </button>
        )}

        {/* User Badge */}
        <div className="flex items-center gap-2 border-l border-slate-800 pl-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600/20 border border-cyan-500/30 text-cyan-400">
            <User className="h-4 w-4" />
          </div>
          <div className="hidden md:flex flex-col text-right">
            <span className="text-xs font-semibold text-white">{user?.fullName || 'SOC Lead Architect'}</span>
            <span className="text-[10px] font-mono-code text-cyan-400">{user?.role || 'SOC_ADMIN'}</span>
          </div>

          {onLogout && (
            <button
              onClick={onLogout}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition-colors ml-1"
              title="Sign Out"
            >
              <LogOut className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
