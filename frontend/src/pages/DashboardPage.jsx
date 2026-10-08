import React from 'react';
import { motion } from 'framer-motion';
import {
  Server,
  ShieldAlert,
  Bug,
  AlertTriangle,
  Route,
  Flame,
  Activity,
  CheckCircle2,
  Clock,
  Radio,
  ArrowRight,
  TrendingUp,
  Cpu
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import StatCard from '../components/common/StatCard';
import RiskGauge from '../components/common/RiskGauge';

export default function DashboardPage({
  riskAssessment = {},
  assets = [],
  vulnerabilities = [],
  attackPaths = [],
  alerts = [],
  onNavigate
}) {
  // Compute top stats
  const totalAssets = assets.length || 9;
  const criticalAssets = assets.filter(a => a.CRITICALITY === 'CRITICAL' || a.criticality === 'CRITICAL').length || 3;
  const totalVulns = vulnerabilities.length || 7;
  const criticalVulns = vulnerabilities.filter(v => v.SEVERITY === 'CRITICAL').length || 3;
  const totalPaths = attackPaths.length || 4;
  const highRiskPaths = attackPaths.filter(p => Number(p.RISK_SCORE) >= 70).length || 3;
  const overallRisk = riskAssessment.NETWORK_RISK_SCORE || 82.5;
  const healthScore = riskAssessment.OVERALL_SECURITY_SCORE || 78;

  // Recharts: Risk Distribution Data
  const riskDistributionData = [
    { name: 'Critical', value: riskAssessment.distribution?.CRITICAL || 2, color: '#f43f5e' },
    { name: 'High Risk', value: riskAssessment.distribution?.HIGH_RISK || 3, color: '#f59e0b' },
    { name: 'Medium Risk', value: riskAssessment.distribution?.MEDIUM_RISK || 2, color: '#eab308' },
    { name: 'Low / Secure', value: (riskAssessment.distribution?.LOW_RISK || 1) + (riskAssessment.distribution?.SECURE || 1), color: '#10b981' }
  ];

  // Recharts: Vulnerability Severity Data
  const vulnSeverityData = [
    { name: 'Critical', count: vulnerabilities.filter(v => v.SEVERITY === 'CRITICAL').length || 3, fill: '#f43f5e' },
    { name: 'High', count: vulnerabilities.filter(v => v.SEVERITY === 'HIGH').length || 3, fill: '#f59e0b' },
    { name: 'Medium', count: vulnerabilities.filter(v => v.SEVERITY === 'MEDIUM').length || 1, fill: '#38bdf8' },
    { name: 'Low', count: 0, fill: '#10b981' }
  ];

  // Recharts: Attack Techniques Frequency
  const techniqueData = [
    { name: 'T1190 (RCE)', paths: 3, fill: '#8b5cf6' },
    { name: 'T1021 (Lateral)', paths: 3, fill: '#06b6d4' },
    { name: 'T1003 (Creds)', paths: 2, fill: '#ec4899' },
    { name: 'T1048 (Exfil)', paths: 3, fill: '#f43f5e' },
    { name: 'T1566 (Phish)', paths: 1, fill: '#f59e0b' }
  ];

  // Recharts: Risk Trend Over Time
  const trendData = [
    { time: '08:00', risk: 89, health: 65 },
    { time: '10:00', risk: 91, health: 63 },
    { time: '12:00', risk: 91, health: 63 },
    { time: '14:00', risk: 85, health: 70 },
    { time: '16:00', risk: 82.5, health: 78 },
    { time: '18:00', risk: Math.round(overallRisk), health: Math.round(healthScore) }
  ];

  // Simulated Live Activity Stream
  const activities = [
    { id: 1, type: 'predict', title: 'AI Attack Path Predicted', desc: 'Identified 91% risk trajectory to Crown Jewel Database', time: '2m ago', color: 'text-purple-400' },
    { id: 2, type: 'vuln', title: 'CVE-2024-21887 Detected', desc: 'Critical RCE on DMZ Web Server port 443', time: '14m ago', color: 'text-rose-400' },
    { id: 3, type: 'mitigate', title: 'Defense Recommendation Formulated', desc: 'Zero-trust microsegmentation ready for simulation', time: '28m ago', color: 'text-cyan-400' },
    { id: 4, type: 'twin', title: 'Digital Twin Graph Synchronized', desc: '9 network devices and 12 telemetry links active in Oracle DB', time: '1h ago', color: 'text-emerald-400' }
  ];

  return (
    <div className="space-y-6">
      {/* Critical Alert Banner if top path is high risk */}
      {overallRisk >= 75 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs backdrop-blur-md"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-500/20 text-rose-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-rose-200">
                CRITICAL THREAT VECTOR DETECTED: Multi-Hop Database Path Active
              </span>
              <p className="text-slate-300 text-[11px] mt-0.5">
                AI Prediction engine flagged a 91% probability route from Public Internet to Database Server.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('attack-prediction')}
            className="flex items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-1.5 font-semibold text-white hover:bg-rose-500 transition-colors"
          >
            Inspect Attack Path
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </motion.div>
      )}

      {/* 8 Top Stat Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        <StatCard title="Total Assets" value={totalAssets} icon={Server} color="cyan" subtitle="Digital Twin Nodes" />
        <StatCard title="Critical Assets" value={criticalAssets} icon={ShieldAlert} color="rose" subtitle="Tier-1 Crown Jewels" />
        <StatCard title="Vulnerabilities" value={totalVulns} icon={Bug} color="amber" subtitle="Active CVEs" />
        <StatCard title="Critical CVEs" value={criticalVulns} icon={AlertTriangle} color="rose" subtitle="CVSS >= 9.0" />
        <StatCard title="Predicted Paths" value={totalPaths} icon={Route} color="purple" subtitle="Multi-Hop Feasible" />
        <StatCard title="High-Risk Paths" value={highRiskPaths} icon={Flame} color="rose" subtitle="Risk >= 70%" />
        <StatCard title="Network Risk" value={overallRisk} unit="%" icon={Activity} color="rose" subtitle="Composite Avg" />
        <StatCard title="Security Score" value={healthScore} unit="/100" icon={CheckCircle2} color="emerald" subtitle="Health Index" />
      </div>

      {/* Health Score Gauge & Risk Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <RiskGauge score={healthScore} breakdown={riskAssessment} />
        </div>

        <div className="lg:col-span-5 rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col justify-between">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              Risk Posture Distribution
            </h3>
            <p className="text-xs text-slate-400">Asset classification by calculated vulnerability weight</p>
          </div>

          <div className="h-44 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={45}
                  outerRadius={65}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs border-t border-slate-800/80 pt-3">
            {riskDistributionData.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-400">{d.name}:</span>
                <span className="font-mono-code font-bold text-white">{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts & Live Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Vulnerability Severity Chart */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="border-b border-slate-800 pb-3 mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              CVE Severity Breakdown
            </h3>
            <p className="text-xs text-slate-400">CVSS v3 classification across network assets</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={vulnSeverityData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="count" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Attack Techniques Frequency */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md">
          <div className="border-b border-slate-800 pb-3 mb-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
              MITRE ATT&CK Vectors
            </h3>
            <p className="text-xs text-slate-400">Most frequently predicted attack techniques</p>
          </div>
          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={techniqueData} layout="vertical">
                <XAxis type="number" stroke="#64748b" fontSize={10} tickLine={false} />
                <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} tickLine={false} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '11px' }}
                />
                <Bar dataKey="paths" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Live Security Feed */}
        <div className="lg:col-span-4 rounded-xl border border-slate-800/80 bg-slate-900/60 p-5 backdrop-blur-md flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-3">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">
                Live SOC Telemetry Stream
              </h3>
              <p className="text-xs text-slate-400">Real-time simulated telemetry events</p>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono-code">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              STREAMING
            </span>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto max-h-44 pr-1 text-xs">
            {activities.map(act => (
              <div key={act.id} className="flex items-start gap-2.5 rounded-lg border border-slate-800/50 bg-slate-800/20 p-2">
                <div className="mt-0.5">
                  <Radio className={`h-3.5 w-3.5 ${act.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-200 truncate">{act.title}</span>
                    <span className="text-[10px] font-mono-code text-slate-500">{act.time}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate">{act.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
