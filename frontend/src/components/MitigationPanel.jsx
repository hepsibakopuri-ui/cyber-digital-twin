import React from 'react';
import { Shield, WifiOff, Slash, RefreshCw, Wrench, CheckCircle2 } from 'lucide-react';

export default function MitigationPanel({
  onApplyMitigation,
  targetNodeId = 'node-dmz-web',
  activeAttackType = 'DOS_SYN_FLOOD',
  mitigationRules = []
}) {
  return (
    <div className="bg-[#0b101d] rounded-xl border border-cyber-border p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/60">
        <div className="flex items-center space-x-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Automated & Manual Mitigation Controls
          </h2>
        </div>
        <span className="text-[10px] font-mono-code text-slate-400">
          Digital Twin Containment
        </span>
      </div>

      {/* Mitigation Action Buttons */}
      <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <button
          onClick={() => onApplyMitigation('QUARANTINE_NODE', targetNodeId, activeAttackType)}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900 border border-cyber-border hover:border-rose-500/60 hover:bg-rose-950/20 text-slate-200 hover:text-rose-300 transition text-xs group"
        >
          <WifiOff className="w-5 h-5 mb-1 text-rose-400 group-hover:scale-110 transition" />
          <span className="font-bold text-center">Quarantine Node</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Sever Twin Links</span>
        </button>

        <button
          onClick={() => onApplyMitigation('BLOCK_IP', 'node-firewall', activeAttackType)}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900 border border-cyber-border hover:border-amber-500/60 hover:bg-amber-950/20 text-slate-200 hover:text-amber-300 transition text-xs group"
        >
          <Slash className="w-5 h-5 mb-1 text-amber-400 group-hover:scale-110 transition" />
          <span className="font-bold text-center">Firewall IP Block</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Drop Attacker IP</span>
        </button>

        <button
          onClick={() => onApplyMitigation('RATE_LIMIT', 'node-firewall', activeAttackType)}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900 border border-cyber-border hover:border-cyan-500/60 hover:bg-cyan-950/20 text-slate-200 hover:text-cyan-300 transition text-xs group"
        >
          <RefreshCw className="w-5 h-5 mb-1 text-cyan-400 group-hover:scale-110 transition" />
          <span className="font-bold text-center">SYN Rate Limit</span>
          <span className="text-[10px] text-slate-500 mt-0.5">SYN-Cookie Defense</span>
        </button>

        <button
          onClick={() => onApplyMitigation('PATCH_VULNERABILITY', targetNodeId, activeAttackType)}
          className="flex flex-col items-center justify-center p-3 rounded-lg bg-slate-900 border border-cyber-border hover:border-emerald-500/60 hover:bg-emerald-950/20 text-slate-200 hover:text-emerald-300 transition text-xs group"
        >
          <Wrench className="w-5 h-5 mb-1 text-emerald-400 group-hover:scale-110 transition" />
          <span className="font-bold text-center">Patch Node CVEs</span>
          <span className="text-[10px] text-slate-500 mt-0.5">Reduce Risk Score</span>
        </button>
      </div>

      {/* Active Mitigation Rules / History */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Active Defense Rules & Oracle DB Audit
        </h4>
        <div className="space-y-1.5 max-h-[140px] overflow-y-auto">
          {mitigationRules.length === 0 ? (
            <p className="text-xs text-slate-500">No active mitigation rules applied yet.</p>
          ) : (
            mitigationRules.slice(0, 5).map((rule, idx) => (
              <div
                key={rule.ruleId || idx}
                className="flex items-center justify-between p-2 rounded bg-slate-900/60 border border-slate-800 text-xs font-mono-code"
              >
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-slate-200 font-bold">{rule.actionType}</span>
                  <span className="text-slate-500">on {rule.targetNode}</span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {new Date(rule.createdAt || Date.now()).toLocaleTimeString()}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
