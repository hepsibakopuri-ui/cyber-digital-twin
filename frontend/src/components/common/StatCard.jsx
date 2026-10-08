import React from 'react';
import { motion } from 'framer-motion';

export default function StatCard({ title, value, unit, icon: Icon, change, changeType = 'neutral', subtitle, color = 'cyan' }) {
  const colorMap = {
    cyan: 'border-cyan-500/20 text-cyan-400 bg-cyan-500/10 shadow-cyan-950/20',
    rose: 'border-rose-500/30 text-rose-400 bg-rose-500/10 shadow-rose-950/20',
    amber: 'border-amber-500/30 text-amber-400 bg-amber-500/10 shadow-amber-950/20',
    emerald: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-emerald-950/20',
    purple: 'border-purple-500/30 text-purple-400 bg-purple-500/10 shadow-purple-950/20'
  };

  const changeColorMap = {
    positive: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    negative: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    neutral: 'text-slate-400 bg-slate-800/40 border-slate-700/40'
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="relative overflow-hidden rounded-xl border border-slate-800/80 bg-slate-900/60 p-4 backdrop-blur-md transition-all hover:border-slate-700 hover:shadow-lg"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-2xl font-bold tracking-tight text-white font-mono-code">{value}</span>
            {unit && <span className="text-xs text-slate-400">{unit}</span>}
          </div>
        </div>

        {Icon && (
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${colorMap[color] || colorMap.cyan}`}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between text-xs">
        {change !== undefined && (
          <span className={`inline-flex items-center rounded px-1.5 py-0.5 font-mono-code border ${changeColorMap[changeType]}`}>
            {change}
          </span>
        )}
        {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
      </div>
    </motion.div>
  );
}
