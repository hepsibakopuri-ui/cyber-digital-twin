import React, { useState } from 'react';
import DigitalTwinCanvas from '../components/digitaltwin/DigitalTwinCanvas';
import { Network, Cpu, PlayCircle, ShieldCheck, RefreshCw } from 'lucide-react';

export default function DigitalTwinPage({
  topology,
  activeAttackPath,
  selectedAsset,
  onSelectAsset,
  onCloseAsset,
  onPatchVuln,
  onNavigate
}) {
  return (
    <div className="flex h-[calc(100vh-7.5rem)] flex-col space-y-4">
      {/* Studio Header Bar */}
      <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Network className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Virtual Enterprise Network Topology
            </h2>
            <p className="text-xs text-slate-400">
              Interactive Digital Twin with live packet flow simulations & vulnerability state propagation
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate('attack-prediction')}
            className="flex items-center gap-1.5 rounded-lg border border-purple-500/30 bg-purple-500/10 px-3 py-1.5 text-xs font-semibold text-purple-300 hover:bg-purple-500/20 transition-colors"
          >
            <Cpu className="h-3.5 w-3.5" />
            Predict Trajectories
          </button>

          <button
            onClick={() => onNavigate('what-if-simulator')}
            className="flex items-center gap-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 px-3 py-1.5 text-xs font-semibold text-white transition-colors"
          >
            <PlayCircle className="h-3.5 w-3.5" />
            What-If Simulator
          </button>
        </div>
      </div>

      {/* Main Graph Viewport */}
      <div className="flex-1 w-full relative">
        <DigitalTwinCanvas
          topology={topology}
          activeAttackPath={activeAttackPath}
          selectedAsset={selectedAsset}
          onNodeSelect={onSelectAsset}
          onCloseAsset={onCloseAsset}
          onPatchVuln={onPatchVuln}
        />
      </div>
    </div>
  );
}
