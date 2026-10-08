import React, { useState, useEffect } from 'react';
import { Shield, ExternalLink, Route, AlertTriangle, Layers } from 'lucide-react';
import { api } from '../services/api';

export default function MitreAttackPage({ onNavigate, onSelectPath }) {
  const [matrixData, setMatrixData] = useState({});
  const [techniquesList, setTechniquesList] = useState([]);
  const [selectedTechnique, setSelectedTechnique] = useState(null);

  useEffect(() => {
    async function loadMitre() {
      try {
        const res = await api.getAttackTechniques();
        if (res && res.matrix) {
          setMatrixData(res.matrix);
          setTechniquesList(res.data || []);
          if (res.data && res.data.length > 0) {
            setSelectedTechnique(res.data[0]);
          }
        }
      } catch (err) {
        console.error('Failed to load MITRE techniques:', err);
      }
    }
    loadMitre();
  }, []);

  const tactics = [
    'Initial Access',
    'Execution',
    'Persistence',
    'Privilege Escalation',
    'Credential Access',
    'Discovery',
    'Lateral Movement',
    'Collection',
    'Exfiltration'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-cyan-400" />
          <h2 className="text-base font-bold text-white uppercase tracking-wider">
            MITRE ATT&CK® Enterprise Defensive Matrix
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Standardized taxonomic classification of adversary tactics and techniques mapped against
          predicted multi-hop attack paths and digital twin vulnerabilities.
        </p>
      </div>

      {/* Enterprise Tactics Matrix Columns */}
      <div className="overflow-x-auto pb-2">
        <div className="grid grid-cols-9 gap-3 min-w-[1100px]">
          {tactics.map(tactic => {
            const techs = matrixData[tactic] || [];

            return (
              <div key={tactic} className="space-y-2">
                <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2 text-center">
                  <span className="text-[11px] font-bold text-slate-300 uppercase tracking-tight">
                    {tactic}
                  </span>
                  <div className="text-[9px] text-slate-500 font-mono-code">{techs.length} Techniques</div>
                </div>

                <div className="space-y-2">
                  {techs.map(tech => {
                    const isSelected = selectedTechnique?.TECHNIQUE_ID === tech.TECHNIQUE_ID;

                    return (
                      <div
                        key={tech.TECHNIQUE_ID}
                        onClick={() => setSelectedTechnique(tech)}
                        className={`cursor-pointer rounded-lg border p-2.5 text-xs transition-all ${
                          isSelected
                            ? 'border-cyan-500 bg-cyan-950/30 ring-1 ring-cyan-500'
                            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-800/50'
                        }`}
                      >
                        <div className="flex items-center justify-between font-mono-code text-[10px]">
                          <span className="font-bold text-cyan-400">{tech.TECHNIQUE_ID}</span>
                          {tech.predictedPathsCount > 0 && (
                            <span className="rounded bg-rose-500/20 px-1 text-rose-300 font-bold border border-rose-500/30">
                              {tech.predictedPathsCount} Paths
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-[11px] font-medium text-slate-200 leading-tight">
                          {tech.NAME}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Technique Inspector Panel */}
      {selectedTechnique && (
        <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-5 backdrop-blur-md space-y-4">
          <div className="flex items-start justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono-code text-sm font-bold text-cyan-400">
                  {selectedTechnique.TECHNIQUE_ID}
                </span>
                <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-300 font-mono-code">
                  Tactic: {selectedTechnique.TACTIC}
                </span>
              </div>
              <h3 className="mt-1 text-base font-bold text-white">{selectedTechnique.NAME}</h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase">Adversary Severity Weight</span>
              <div className="font-mono-code text-lg font-bold text-purple-400">
                {selectedTechnique.SEVERITY_WEIGHT}x
              </div>
            </div>
          </div>

          <p className="text-xs text-slate-300 leading-relaxed max-w-4xl">
            {selectedTechnique.DESCRIPTION}
          </p>

          {/* Mapped Paths */}
          {selectedTechnique.paths && selectedTechnique.paths.length > 0 ? (
            <div>
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
                Predicted Attack Trajectories Traversing This Technique:
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {selectedTechnique.paths.map((p, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 p-2.5 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <Route className="h-3.5 w-3.5 text-cyan-400 flex-shrink-0" />
                      <span className="font-bold text-white truncate">{p.name}</span>
                    </div>
                    <span className="font-mono-code text-rose-400 font-bold flex-shrink-0 ml-2">
                      {p.risk}% Risk
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No active predicted attack trajectories currently traverse this specific technique.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
