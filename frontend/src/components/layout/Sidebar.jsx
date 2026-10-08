import React from 'react';
import {
  LayoutDashboard,
  Network,
  Cpu,
  Route,
  PlayCircle,
  Bug,
  Server,
  Shield,
  ShieldCheck,
  History,
  Bell,
  Settings,
  ChevronLeft,
  ChevronRight,
  Database,
  Radio
} from 'lucide-react';

export default function Sidebar({ activePage, onNavigate, collapsed, onToggleCollapse, alertsCount = 0, oracleConnected = false }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'digital-twin', label: 'Digital Twin', icon: Network, badge: 'Live' },
    { id: 'attack-prediction', label: 'Attack Prediction', icon: Cpu },
    { id: 'attack-paths', label: 'Attack Paths', icon: Route },
    { id: 'what-if-simulator', label: 'What-If Simulator', icon: PlayCircle },
    { id: 'vulnerabilities', label: 'Vulnerabilities', icon: Bug },
    { id: 'assets', label: 'Assets Inventory', icon: Server },
    { id: 'mitre-attack', label: 'MITRE ATT&CK', icon: Shield },
    { id: 'defense-recommendations', label: 'Defenses', icon: ShieldCheck, badge: 'AI' },
    { id: 'simulation-history', label: 'History Log', icon: History },
    { id: 'alerts', label: 'Alerts', icon: Bell, alertCount: alertsCount },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside
      className={`relative flex flex-col border-r border-slate-800 bg-slate-950 transition-all duration-300 z-30 ${
        collapsed ? 'w-16' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-800">
        {!collapsed && (
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20">
              <Network className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-extrabold tracking-tight text-white truncate">
                CYBER TWIN
              </span>
              <span className="text-[10px] font-mono-code text-cyan-400">
                PREDICTIVE SOC 2.4
              </span>
            </div>
          </div>
        )}

        {collapsed && (
          <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-600/30 text-cyan-400">
            <Network className="h-5 w-5" />
          </div>
        )}

        <button
          onClick={onToggleCollapse}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Items */}
      <div className="flex-1 space-y-1 overflow-y-auto px-2 py-3">
        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activePage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/15 text-cyan-300 shadow-sm border border-cyan-500/30'
                  : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <Icon
                className={`h-4 w-4 flex-shrink-0 transition-colors ${
                  isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              />

              {!collapsed && (
                <span className="flex-1 text-left truncate">{item.label}</span>
              )}

              {!collapsed && item.badge && (
                <span className="rounded bg-cyan-500/20 px-1.5 py-0.5 text-[9px] font-mono-code text-cyan-300 font-bold border border-cyan-500/30">
                  {item.badge}
                </span>
              )}

              {!collapsed && item.alertCount > 0 && (
                <span className="rounded-full bg-rose-500/20 px-2 py-0.5 text-[10px] font-mono-code text-rose-300 font-bold border border-rose-500/40">
                  {item.alertCount}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Footer Database Status */}
      <div className="border-t border-slate-800 p-3 bg-slate-900/40">
        {!collapsed ? (
          <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-2.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-300 font-medium">
                <Database className="h-3.5 w-3.5 text-amber-400" />
                Oracle Database
              </span>
              <span className="flex items-center gap-1 text-[10px] font-mono-code text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                {oracleConnected ? 'LIVE XE' : 'ACTIVE'}
              </span>
            </div>
            <div className="mt-1 text-[10px] text-slate-500 truncate font-mono-code">
              CYBER_TWIN@XE (14 Tables)
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Oracle Database Active">
            <Database className="h-4 w-4 text-amber-400" />
          </div>
        )}
      </div>
    </aside>
  );
}
