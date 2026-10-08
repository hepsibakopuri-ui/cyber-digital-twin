import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Shield } from 'lucide-react';

export default function RiskGauge({ score = 78, breakdown = {} }) {
  // Score is 0-100 where 100 is best (Healthy)
  const normalizedScore = Math.max(0, Math.min(100, score));
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  let gaugeColor = '#10b981'; // Green
  let statusText = 'DEFENSIVE RESILIENCE: ROBUST';
  if (normalizedScore < 50) {
    gaugeColor = '#f43f5e'; // Red
    statusText = 'DEFENSIVE RESILIENCE: CRITICAL';
  } else if (normalizedScore < 75) {
    gaugeColor = '#f59e0b'; // Amber
    statusText = 'DEFENSIVE RESILIENCE: MODERATE';
  }

  const factors = [
    { label: 'Vulnerability Health', value: breakdown.VULNERABILITY_HEALTH || 68, color: 'bg-cyan-500' },
    { label: 'Network Segmentation', value: breakdown.NETWORK_SEGMENTATION || 62, color: 'bg-emerald-500' },
    { label: 'Asset Exposure', value: breakdown.ASSET_EXPOSURE || 74, color: 'bg-purple-500' },
    { label: 'Attack Path Risk Mitigation', value: Math.max(10, 100 - (breakdown.ATTACK_PATH_RISK || 91) * 0.9), color: 'bg-rose-500' },
    { label: 'Security Controls', value: breakdown.SECURITY_CONTROLS_SCORE || 75, color: 'bg-blue-500' }
  ];

  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
            Cybersecurity Health Score
          </h3>
          <p className="text-xs text-slate-400">Holistic Digital Twin Security Posture</p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-800/60 px-2.5 py-0.5 text-xs text-slate-300 font-mono-code">
          {normalizedScore >= 70 ? (
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
          ) : (
            <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
          )}
          {statusText}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-12 items-center gap-6">
        {/* Animated Gauge */}
        <div className="md:col-span-5 flex flex-col items-center justify-center">
          <div className="relative flex items-center justify-center">
            <svg className="h-36 w-36 -rotate-90 transform" viewBox="0 0 140 140">
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="stroke-slate-800"
                strokeWidth="10"
                fill="transparent"
              />
              <motion.circle
                cx="70"
                cy="70"
                r={radius}
                stroke={gaugeColor}
                strokeWidth="10"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-extrabold font-mono-code text-white">
                {Math.round(normalizedScore)}
              </span>
              <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400">
                / 100 Health
              </span>
            </div>
          </div>
        </div>

        {/* 5 Factors Breakdown */}
        <div className="md:col-span-7 space-y-3">
          {factors.map((factor, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300">{factor.label}</span>
                <span className="font-mono-code font-medium text-slate-400">
                  {Math.round(factor.value)}%
                </span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
                <motion.div
                  className={`h-full rounded-full ${factor.color}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.max(5, Math.min(100, factor.value))}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.1 }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
