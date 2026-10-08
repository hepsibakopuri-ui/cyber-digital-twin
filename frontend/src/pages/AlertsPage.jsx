import React, { useState } from 'react';
import {
  Bell,
  AlertTriangle,
  ShieldAlert,
  CheckCircle2,
  Filter,
  Check,
  Calendar,
  Layers,
  ArrowRight
} from 'lucide-react';
import { api } from '../services/api';

export default function AlertsPage({ alerts = [], onRefresh, onNavigate }) {
  const [severityFilter, setSeverityFilter] = useState('ALL');
  const [resolvingId, setResolvingId] = useState(null);

  const filteredAlerts = alerts.filter(a => {
    if (severityFilter === 'ALL') return true;
    return a.SEVERITY === severityFilter;
  });

  const handleResolve = async (id) => {
    setResolvingId(id);
    try {
      await api.resolveAlert(id);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to resolve alert:', err);
    } finally {
      setResolvingId(null);
    }
  };

  const getSeverityBadge = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/40';
      case 'HIGH':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
      case 'MEDIUM':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-xl border border-slate-800 bg-slate-900/60 p-5 backdrop-blur-md">
        <div>
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-cyan-400" />
            <h2 className="text-base font-bold text-white uppercase tracking-wider">
              Security Operations Center (SOC) Alert Queue
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-time security telemetry alarms, critical trajectory alerts, and defense verification notices
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1 rounded-lg border border-slate-800 bg-slate-800/60 p-1 text-xs">
          {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'INFO'].map((sev) => (
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

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length > 0 ? (
          filteredAlerts.map((alert) => (
            <div
              key={alert.ALERT_ID}
              className="rounded-xl border border-slate-800/90 bg-slate-900/60 p-5 backdrop-blur-md transition-all hover:border-slate-700 space-y-2.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono-code text-xs font-bold text-cyan-400">
                      {alert.ALERT_ID}
                    </span>
                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold border font-mono-code ${getSeverityBadge(
                        alert.SEVERITY
                      )}`}
                    >
                      {alert.SEVERITY}
                    </span>
                    <span className="rounded bg-slate-800 px-2 py-0.5 text-[10px] text-slate-400 font-mono-code">
                      Type: {alert.ALERT_TYPE}
                    </span>
                    {alert.STATUS === 'RESOLVED' && (
                      <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-300 font-mono-code border border-emerald-500/30">
                        RESOLVED
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-white leading-tight">{alert.TITLE}</h3>
                </div>

                <div className="flex items-center gap-2 text-xs font-mono-code text-slate-500">
                  <Calendar className="h-3 w-3 text-cyan-400" />
                  {new Date(alert.CREATED_AT).toLocaleTimeString()}
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">{alert.MESSAGE}</p>

              <div className="flex items-center justify-between border-t border-slate-800 pt-2.5 text-xs">
                <span className="text-slate-400 font-mono-code text-[11px]">
                  Target Asset: <span className="text-cyan-300">{alert.AFFECTED_ASSET_ID}</span>
                </span>

                <div className="flex items-center gap-2">
                  {alert.STATUS !== 'RESOLVED' && (
                    <button
                      onClick={() => handleResolve(alert.ALERT_ID)}
                      disabled={resolvingId === alert.ALERT_ID}
                      className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 px-3 py-1 text-xs font-medium text-slate-200 transition-colors"
                    >
                      <Check className="h-3 w-3 text-emerald-400" />
                      Mark Resolved
                    </button>
                  )}

                  <button
                    onClick={() => onNavigate('digital-twin')}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
                  >
                    <Layers className="h-3.5 w-3.5" />
                    Inspect Asset
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-12 text-center text-xs text-slate-400">
            No alerts matching the selected severity level.
          </div>
        )}
      </div>
    </div>
  );
}
