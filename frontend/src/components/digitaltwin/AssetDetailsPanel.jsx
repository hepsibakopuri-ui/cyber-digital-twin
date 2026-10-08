import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Shield,
  Server,
  AlertTriangle,
  Radio,
  Clock,
  Terminal,
  ExternalLink,
  Wrench,
  CheckCircle2
} from 'lucide-react';

export default function AssetDetailsPanel({ asset, onClose, onPatchVuln }) {
  if (!asset) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: 300 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 250 }}
        className="absolute right-4 top-4 bottom-4 w-96 z-20 flex flex-col rounded-xl border border-slate-700/80 bg-slate-900/95 p-5 shadow-2xl backdrop-blur-xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">
                Asset Inspection
              </span>
              <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-mono-code">
                {asset.ASSET_ID || asset.id}
              </span>
            </div>
            <h3 className="mt-1 text-base font-bold text-white">{asset.NAME || asset.name}</h3>
            <p className="text-xs text-slate-400">{asset.DEVICE_TYPE || asset.deviceType}</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-1 pt-3 text-xs">
          {/* Status & Risk Metric Grid */}
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-2.5">
              <span className="text-[10px] uppercase text-slate-400">Security State</span>
              <div className="mt-1 font-bold text-white flex items-center gap-1.5">
                <span
                  className={`h-2 w-2 rounded-full ${
                    (asset.SECURITY_STATE || asset.securityState) === 'CRITICAL'
                      ? 'bg-rose-500 animate-pulse'
                      : (asset.SECURITY_STATE || asset.securityState) === 'HIGH_RISK'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                />
                {asset.SECURITY_STATE || asset.securityState || 'SECURE'}
              </div>
            </div>

            <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-2.5">
              <span className="text-[10px] uppercase text-slate-400">Calculated Risk</span>
              <div className="mt-1 font-bold text-white font-mono-code text-sm">
                <span
                  className={
                    (asset.RISK_SCORE || asset.riskScore) >= 70
                      ? 'text-rose-400'
                      : (asset.RISK_SCORE || asset.riskScore) >= 50
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }
                >
                  {asset.RISK_SCORE || asset.riskScore}%
                </span>
              </div>
            </div>
          </div>

          {/* Network Parameters */}
          <div className="rounded-lg border border-slate-800 bg-slate-800/30 p-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">IP Address:</span>
              <span className="font-mono-code text-white font-medium">{asset.IP_ADDRESS || asset.ipAddress}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Zone Subnet:</span>
              <span className="font-mono-code text-cyan-300">{asset.ZONE || asset.zone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Asset Criticality:</span>
              <span className="font-semibold text-rose-300">{asset.CRITICALITY || asset.criticality}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Operating System:</span>
              <span className="text-slate-200 text-right truncate max-w-[180px]">
                {asset.OPERATING_SYSTEM || asset.operatingSystem}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-400">Last Telemetry Sync:</span>
              <span className="text-[10px] text-slate-400 flex items-center gap-1">
                <Clock className="h-3 w-3 text-cyan-400" />
                Just now
              </span>
            </div>
          </div>

          {/* Open Ports */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-semibold text-slate-200">Open Services & Ports</span>
              <span className="text-[10px] text-slate-400 font-mono-code">
                {asset.openPorts?.length || 0} active
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(asset.openPorts || []).length > 0 ? (
                asset.openPorts.map((port, i) => (
                  <span
                    key={i}
                    className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 font-mono-code text-[11px] text-cyan-300"
                  >
                    Port {port}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">No exposed management ports</span>
              )}
            </div>
          </div>

          {/* Vulnerabilities Section */}
          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="font-semibold text-slate-200 flex items-center gap-1">
                <AlertTriangle className="h-3.5 w-3.5 text-rose-400" />
                Vulnerabilities ({asset.vulnerabilities?.length || 0})
              </span>
              <span className="text-[10px] text-rose-400 uppercase font-mono-code">
                {asset.vulnerabilities?.some(v => v.STATUS === 'UNPATCHED') ? 'Unpatched Risks' : 'Secured'}
              </span>
            </div>

            <div className="space-y-2">
              {(asset.vulnerabilities || []).length > 0 ? (
                asset.vulnerabilities.map((v, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-slate-800 bg-slate-800/40 p-2.5 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono-code font-bold text-rose-300">{v.VULN_ID}</span>
                      <span className="rounded bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                        CVSS {v.CVSS_SCORE}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed">{v.NAME || v.DESCRIPTION}</p>
                    <div className="flex items-center justify-between pt-1 border-t border-slate-800 text-[10px]">
                      <span className="text-slate-400">Status: {v.STATUS}</span>
                      {v.STATUS !== 'PATCHED' && onPatchVuln && (
                        <button
                          onClick={() => onPatchVuln(v.VULN_ID, asset.ASSET_ID || asset.id)}
                          className="flex items-center gap-1 rounded bg-cyan-600/30 hover:bg-cyan-600/50 px-2 py-0.5 text-cyan-300 font-medium transition-colors"
                        >
                          <Wrench className="h-2.5 w-2.5" />
                          Patch Now
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-emerald-300">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Zero active CVE vulnerabilities recorded.</span>
                </div>
              )}
            </div>
          </div>

          {/* Connected Neighbor Devices */}
          <div>
            <span className="font-semibold text-slate-200 block mb-1.5">Connected Topology Neighbors</span>
            <div className="flex flex-wrap gap-1.5">
              {(asset.connectedDevices || []).map((devId, i) => (
                <span
                  key={i}
                  className="rounded border border-slate-700 bg-slate-800 px-2 py-0.5 text-[11px] text-slate-300 font-mono-code"
                >
                  {devId}
                </span>
              ))}
            </div>
          </div>

          {/* MITRE ATT&CK Vectors */}
          {(asset.possibleAttackTechniques || []).length > 0 && (
            <div>
              <span className="font-semibold text-slate-200 block mb-1.5">Possible ATT&CK Techniques</span>
              <div className="space-y-1">
                {asset.possibleAttackTechniques.slice(0, 3).map((t, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded bg-slate-800/40 px-2 py-1 border border-slate-800 text-[11px]"
                  >
                    <span className="font-mono-code text-purple-300">{t.TECHNIQUE_ID}</span>
                    <span className="text-slate-300 truncate max-w-[190px]">{t.NAME}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
