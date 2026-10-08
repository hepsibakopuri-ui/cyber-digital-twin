import React from 'react';
import { ShieldCheck, AlertCircle, TrendingUp, Cpu, Info, ShieldAlert } from 'lucide-react';

export default function PredictionPanel({ prediction }) {
  if (!prediction) {
    return (
      <div className="bg-[#0b101d] rounded-xl border border-cyber-border p-5 text-center text-slate-400">
        <Cpu className="w-8 h-8 mx-auto mb-2 text-cyan-400 animate-spin" />
        <p className="text-xs">Awaiting telemetry inference from Java Weka AI Engine...</p>
      </div>
    );
  }

  const {
    prediction: attackClass = 'NORMAL',
    confidence = 99,
    risk_score: riskScore = 10,
    risk_level: riskLevel = 'LOW',
    probabilities = {},
    indicators = [],
    mitigation_recommendation: mitigation = ''
  } = prediction;

  const isCritical = riskLevel === 'CRITICAL';
  const isHigh = riskLevel === 'HIGH';
  const isMedium = riskLevel === 'MEDIUM';

  const badgeColor = isCritical
    ? 'bg-rose-950/80 border-rose-600 text-rose-300'
    : isHigh
    ? 'bg-amber-950/80 border-amber-600 text-amber-300'
    : isMedium
    ? 'bg-yellow-950/80 border-yellow-600 text-yellow-300'
    : 'bg-emerald-950/80 border-emerald-600 text-emerald-300';

  return (
    <div className="bg-[#0b101d] rounded-xl border border-cyber-border p-5 shadow-xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-cyber-border/60">
          <div className="flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Weka AI Threat Classification Engine
            </h2>
          </div>
          <span className="text-[10px] font-mono-code px-2 py-0.5 rounded bg-purple-950/60 border border-purple-800/60 text-purple-300">
            Random Forest (Weka 3.8)
          </span>
        </div>

        {/* Prediction Headline Card */}
        <div className={`mt-4 p-4 rounded-xl border ${badgeColor} transition-all duration-300`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              {attackClass === 'NORMAL' ? (
                <ShieldCheck className="w-6 h-6 text-emerald-400" />
              ) : (
                <ShieldAlert className="w-6 h-6 text-rose-400 animate-bounce" />
              )}
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Predicted Attack Class
                </span>
                <h3 className="text-lg font-bold font-mono-code leading-tight">
                  {attackClass}
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                Confidence
              </span>
              <p className="text-lg font-bold font-mono-code text-cyan-400">
                {confidence}%
              </p>
            </div>
          </div>

          {/* Risk Level & Risk Score Bar */}
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
            <span className="text-slate-400">Risk Assessment:</span>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                isCritical ? 'bg-rose-500 text-white' :
                isHigh ? 'bg-amber-500 text-black' :
                isMedium ? 'bg-yellow-500 text-black' : 'bg-emerald-600 text-white'
              }`}>
                {riskLevel}
              </span>
              <span className="font-mono-code font-bold text-slate-200">
                Score: {riskScore}/100
              </span>
            </div>
          </div>
        </div>

        {/* Probability Distribution */}
        <div className="mt-4">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Class Probability Distribution
          </h4>
          <div className="space-y-1.5">
            {Object.entries(probabilities).map(([cls, prob]) => (
              <div key={cls} className="text-xs">
                <div className="flex justify-between text-[11px] mb-0.5">
                  <span className={cls === attackClass ? 'font-bold text-cyan-300' : 'text-slate-400'}>
                    {cls}
                  </span>
                  <span className="font-mono-code text-slate-300">{prob}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      cls === attackClass ? 'bg-cyan-400' : 'bg-slate-600/40'
                    }`}
                    style={{ width: `${prob}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Threat Indicators */}
        {indicators.length > 0 && (
          <div className="mt-4">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-cyan-400" />
              Detected Anomaly Signatures
            </h4>
            <ul className="space-y-1">
              {indicators.map((ind, idx) => (
                <li key={idx} className="text-xs font-mono-code text-slate-300 bg-slate-900/60 px-2.5 py-1 rounded border border-slate-800 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 inline-block"></span>
                  {ind}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommended Mitigation */}
      {mitigation && (
        <div className="mt-4 p-3 rounded-lg bg-cyan-950/40 border border-cyan-800/50 text-xs">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 block mb-1">
            Recommended AI Mitigation Countermeasure
          </span>
          <p className="text-slate-300 leading-relaxed">
            {mitigation}
          </p>
        </div>
      )}
    </div>
  );
}
