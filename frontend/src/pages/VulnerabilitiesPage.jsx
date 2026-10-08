import React, { useState } from 'react';
import {
  Bug,
  Search,
  Filter,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';

export default function VulnerabilitiesPage({
  vulnerabilities = [],
  onPatchVuln,
  onNavigate
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState('ALL');

  const filteredVulns = vulnerabilities.filter(v => {
    const matchesSearch =
      v.VULN_ID?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.NAME?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.DESCRIPTION?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSeverity =
      severityFilter === 'ALL' || v.SEVERITY === severityFilter;

    return matchesSearch && matchesSeverity;
  });

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-sky-500/20 text-sky-300 border-sky-500/30';
      default:
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Bug className="h-4 w-4 text-amber-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Vulnerability Management (CVE Catalog)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Simulated enterprise vulnerability database mapped to Digital Twin assets and exposed ports
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search CVEs, keywords..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="rounded-lg border border-slate-700 bg-slate-800/80 pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Severity Filter */}
          <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-800/60 p-1 text-xs">
            {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM'].map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev)}
                className={`rounded px-2.5 py-1 text-[11px] font-medium transition-colors ${
                  severityFilter === sev
                    ? 'bg-cyan-600 text-white font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Vulnerabilities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVulns.map((vuln) => (
          <div
            key={vuln.VULN_ID}
            className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md transition-all hover:border-slate-700"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-sm font-bold text-cyan-400">
                  {vuln.VULN_ID}
                </span>
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold border font-mono-code ${getSeverityBadge(
                    vuln.SEVERITY
                  )}`}
                >
                  CVSS {vuln.CVSS_SCORE} • {vuln.SEVERITY}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white leading-snug">{vuln.NAME}</h3>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                {vuln.DESCRIPTION}
              </p>
            </div>

            <div className="mt-4 border-t border-slate-800 pt-3 space-y-2.5">
              <div className="text-[11px] text-slate-300">
                <span className="text-slate-500 font-medium">Remediation: </span>
                {vuln.REMEDIATION}
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] font-mono-code text-slate-500">
                  Exploit: {vuln.EXPLOITABILITY}
                </span>

                <button
                  onClick={() => onPatchVuln && onPatchVuln(vuln.VULN_ID)}
                  className="flex items-center gap-1 rounded-lg bg-cyan-600/20 hover:bg-cyan-600/40 border border-cyan-500/30 px-3 py-1 text-xs font-semibold text-cyan-300 transition-colors"
                >
                  <Wrench className="h-3 w-3" />
                  Apply Patch
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
