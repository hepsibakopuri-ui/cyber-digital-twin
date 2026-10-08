import React, { useState } from 'react';
import { Play, Square, Flame, Skull, ShieldCheck, Zap } from 'lucide-react';

export default function AttackSimulator({
  scenarios = [],
  activeScenario = 'BASELINE_NORMAL',
  nodes = [],
  onStartAttack,
  onStopAttack
}) {
  const [selectedScenario, setSelectedScenario] = useState('DOS_SYN_FLOOD');
  const [selectedTarget, setSelectedTarget] = useState('node-dmz-web');

  const isAttacking = activeScenario !== 'BASELINE_NORMAL';

  const handleLaunch = () => {
    onStartAttack(selectedScenario, selectedTarget);
  };

  return (
    <div className="bg-[#0b101d] rounded-xl border border-cyber-border p-5 shadow-xl">
      <div className="flex items-center justify-between pb-3 border-b border-cyber-border/60">
        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-rose-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-200">
            Attack Simulation & Threat Injection Studio
          </h2>
        </div>
        <span className={`text-[10px] font-mono-code px-2 py-0.5 rounded font-bold ${
          isAttacking ? 'bg-rose-950 text-rose-300 border border-rose-800 animate-pulse' : 'bg-slate-800 text-slate-400'
        }`}>
          {isAttacking ? `ACTIVE: ${activeScenario}` : 'STATE: IDLE / BASELINE'}
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Scenario Selection */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Select Attack Vector
          </label>
          <select
            disabled={isAttacking}
            value={selectedScenario}
            onChange={(e) => {
              setSelectedScenario(e.target.value);
              const found = scenarios.find(s => s.id === e.target.value);
              if (found?.defaultTarget) setSelectedTarget(found.defaultTarget);
            }}
            className="w-full bg-slate-900 border border-cyber-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          >
            {scenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>

          {/* Scenario description */}
          {selectedScenario && (
            <p className="text-[11px] text-slate-400 mt-2 leading-relaxed bg-slate-900/60 p-2.5 rounded border border-slate-800/80">
              {scenarios.find(s => s.id === selectedScenario)?.description}
            </p>
          )}
        </div>

        {/* Target Node Selection */}
        <div>
          <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Target Victim Node (Digital Twin)
          </label>
          <select
            disabled={isAttacking}
            value={selectedTarget}
            onChange={(e) => setSelectedTarget(e.target.value)}
            className="w-full bg-slate-900 border border-cyber-border rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 disabled:opacity-50"
          >
            {nodes.map((n) => (
              <option key={n.id} value={n.id}>
                {n.name} [{n.ip}] ({n.status})
              </option>
            ))}
          </select>

          {/* Launch / Abort Buttons */}
          <div className="mt-4 flex items-center space-x-3">
            {!isAttacking ? (
              <button
                onClick={handleLaunch}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white font-bold text-xs shadow-lg shadow-rose-900/40 transition"
              >
                <Zap className="w-4 h-4" />
                <span>Inject Attack Campaign</span>
              </button>
            ) : (
              <button
                onClick={onStopAttack}
                className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs transition"
              >
                <Square className="w-4 h-4 text-rose-400" />
                <span>Abort / Cease Attack</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
