import React, { useState, useEffect, useCallback, useRef } from 'react';
import Sidebar from './components/layout/Sidebar';
import TopBar from './components/layout/TopBar';
import DashboardPage from './pages/DashboardPage';
import DigitalTwinPage from './pages/DigitalTwinPage';
import AttackPredictionPage from './pages/AttackPredictionPage';
import AttackPathsPage from './pages/AttackPathsPage';
import WhatIfSimulatorPage from './pages/WhatIfSimulatorPage';
import VulnerabilitiesPage from './pages/VulnerabilitiesPage';
import AssetsPage from './pages/AssetsPage';
import MitreAttackPage from './pages/MitreAttackPage';
import DefenseRecommendationsPage from './pages/DefenseRecommendationsPage';
import SimulationHistoryPage from './pages/SimulationHistoryPage';
import AlertsPage from './pages/AlertsPage';
import SettingsPage from './pages/SettingsPage';
import LandingPage from './pages/LandingPage';
import { api } from './services/api';

export default function App() {
  // Session & User State
  const [user, setUser] = useState(() => {
    const saved = sessionStorage.getItem('cyber_twin_user');
    return saved ? JSON.parse(saved) : {
      id: 1,
      username: 'admin',
      fullName: 'SOC Lead Security Architect',
      role: 'SOC_ADMIN',
      email: 'admin@example.com'
    };
  });

  const [activePage, setActivePage] = useState('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Digital Twin & System State
  const [topology, setTopology] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [attackPaths, setAttackPaths] = useState([]);
  const [selectedPath, setSelectedPath] = useState(null);
  const [vulnerabilities, setVulnerabilities] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [riskAssessment, setRiskAssessment] = useState({});
  const [alerts, setAlerts] = useState([]);
  const [oracleConnected, setOracleConnected] = useState(false);
  const [lastDefenseResult, setLastDefenseResult] = useState(null);
  const [isPredicting, setIsPredicting] = useState(false);

  const wsRef = useRef(null);

  // Load all initial enterprise platform data
  const loadPlatformData = useCallback(async () => {
    try {
      const [topo, paths, vulns, recs, risk, alrts, health] = await Promise.all([
        api.getTopology().catch(() => null),
        api.getAttackPaths().catch(() => []),
        api.getVulnerabilities().catch(() => ({ data: [] })),
        api.getRecommendations().catch(() => []),
        api.getRiskAssessment().catch(() => ({})),
        api.getAlerts().catch(() => []),
        api.getHealth().catch(() => null)
      ]);

      if (topo) setTopology(topo);
      if (paths) {
        setAttackPaths(paths);
        if (paths.length > 0 && !selectedPath) {
          setSelectedPath(paths[0]);
        }
      }
      if (vulns?.data) setVulnerabilities(vulns.data);
      if (recs) setRecommendations(recs);
      if (risk) setRiskAssessment(risk);
      if (alrts) setAlerts(alrts);
      if (health?.components?.oracleDatabase?.connected) {
        setOracleConnected(true);
      }
    } catch (err) {
      console.warn('Initial data load notice:', err);
    }
  }, [selectedPath]);

  useEffect(() => {
    loadPlatformData();
  }, [loadPlatformData]);

  // WebSocket Telemetry Heartbeat
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.hostname === 'localhost' ? 'localhost:5000' : window.location.host;
    const wsUrl = `${protocol}//${host}/ws/telemetry`;

    try {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log('[WebSocket] Connected to SOC telemetry stream.');
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(event.data);
          // Heartbeat or event received
        } catch (e) {}
      };

      ws.onerror = (e) => {
        console.warn('[WebSocket] Connection note:', e);
      };

      return () => {
        if (ws) ws.close();
      };
    } catch (err) {}
  }, []);

  // Action Handlers
  const handlePredictAttackPaths = async () => {
    setIsPredicting(true);
    try {
      const res = await api.predictAttackPaths();
      if (res && res.data) {
        setAttackPaths(res.data);
        if (res.data.length > 0) {
          setSelectedPath(res.data[0]);
        }
      }
      const updatedRisk = await api.getRiskAssessment();
      if (updatedRisk) setRiskAssessment(updatedRisk);
      const updatedTopo = await api.getTopology();
      if (updatedTopo) setTopology(updatedTopo);
    } catch (err) {
      console.error('Failed to predict attack paths:', err);
    } finally {
      setIsPredicting(false);
    }
  };

  const handleSimulateDefense = async (defenseId, customParams = {}) => {
    try {
      const res = await api.simulateDefense(defenseId, customParams);
      if (res && res.data) {
        setLastDefenseResult(res.data);
        if (res.data.updatedPaths) setAttackPaths(res.data.updatedPaths);
        if (res.data.updatedRisk) setRiskAssessment(res.data.updatedRisk);
      }
      const [updatedTopo, updatedRecs, updatedAlerts] = await Promise.all([
        api.getTopology(),
        api.getRecommendations(),
        api.getAlerts()
      ]);
      if (updatedTopo) setTopology(updatedTopo);
      if (updatedRecs) setRecommendations(updatedRecs);
      if (updatedAlerts) setAlerts(updatedAlerts);
    } catch (err) {
      console.error('Defense simulation failed:', err);
    }
  };

  const handlePatchVulnerability = async (vulnId, assetId) => {
    try {
      await api.patchVulnerability(vulnId, assetId);
      await loadPlatformData();
    } catch (err) {
      console.error('Patch failed:', err);
    }
  };

  const handleResetSystem = async () => {
    try {
      await api.resetSystem();
      setLastDefenseResult(null);
      await loadPlatformData();
    } catch (err) {
      console.error('Reset system failed:', err);
    }
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    sessionStorage.setItem('cyber_twin_user', JSON.stringify(userData));
    setActivePage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    sessionStorage.removeItem('cyber_twin_user');
  };

  if (!user) {
    return <LandingPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Page title mapping
  const pageTitles = {
    'dashboard': { title: 'Security Operations Center (SOC) Overview', subtitle: 'Live Defensive Health & Real-Time Threat Metrics' },
    'digital-twin': { title: 'Digital Twin Interactive Topology', subtitle: 'Virtual Infrastructure Model with Dynamic Security Overlay' },
    'attack-prediction': { title: 'AI-Based Attack Path Prediction & Ranking', subtitle: 'Multi-Hop Feasibility & Explainable AI Causal Analysis' },
    'attack-paths': { title: 'Attack Trajectory Directory', subtitle: 'Comprehensive Enterprise Exploitability Matrix' },
    'what-if-simulator': { title: 'What-If Scenario Attack Simulator', subtitle: 'Adversary Traversal Mechanics & Breach Sandbox' },
    'vulnerabilities': { title: 'Vulnerability Management (CVE Catalog)', subtitle: 'CVSS Score Decomposition & Rapid Patch Simulation' },
    'assets': { title: 'Enterprise Asset Inventory', subtitle: 'Network Devices, Endpoints, Subnet Zones & Open Ports' },
    'mitre-attack': { title: 'MITRE ATT&CK® Enterprise Matrix', subtitle: 'Standardized Adversary Tactics & Defensive Technique Correlation' },
    'defense-recommendations': { title: 'Automated Defense Recommendations', subtitle: 'Prescriptive Mitigation Actions & Instant Risk Recalculation' },
    'simulation-history': { title: 'Simulation & Defense Audit Log', subtitle: 'Historical Record of What-If Scenarios in Oracle Database' },
    'alerts': { title: 'Security Alert Queue', subtitle: 'Active Telemetry Alarms & Incident Severity Prioritization' },
    'settings': { title: 'Platform Engine & Oracle Database Settings', subtitle: 'AI Scoring Weights, Oracle XE Connection Diagnostics & Reset' }
  };

  const currentTitle = pageTitles[activePage] || { title: 'Security Operations Center', subtitle: '' };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-950 font-sans text-slate-100 selection:bg-cyan-500 selection:text-white">
      {/* Sidebar Navigation */}
      <Sidebar
        activePage={activePage}
        onNavigate={(page) => setActivePage(page)}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        alertsCount={alerts.filter(a => a.STATUS === 'ACTIVE').length}
        oracleConnected={oracleConnected}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          title={currentTitle.title}
          subtitle={currentTitle.subtitle}
          oracleConnected={oracleConnected}
          networkRisk={riskAssessment.ATTACK_PATH_RISK || 91.0}
          onReset={handleResetSystem}
          user={user}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto p-6 bg-slate-950/90">
          {activePage === 'dashboard' && (
            <DashboardPage
              riskAssessment={riskAssessment}
              assets={topology?.nodes || []}
              vulnerabilities={vulnerabilities}
              attackPaths={attackPaths}
              alerts={alerts}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'digital-twin' && (
            <DigitalTwinPage
              topology={topology}
              activeAttackPath={selectedPath}
              selectedAsset={selectedAsset}
              onSelectAsset={(asset) => setSelectedAsset(asset)}
              onCloseAsset={() => setSelectedAsset(null)}
              onPatchVuln={handlePatchVulnerability}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'attack-prediction' && (
            <AttackPredictionPage
              attackPaths={attackPaths}
              onPredict={handlePredictAttackPaths}
              isPredicting={isPredicting}
              selectedPath={selectedPath}
              onSelectPath={(path) => setSelectedPath(path)}
              onSimulateDefense={handleSimulateDefense}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'attack-paths' && (
            <AttackPathsPage
              attackPaths={attackPaths}
              onSelectPath={(path) => {
                setSelectedPath(path);
              }}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'what-if-simulator' && (
            <WhatIfSimulatorPage
              onNavigate={(page) => setActivePage(page)}
              onSelectPath={(path) => setSelectedPath(path)}
            />
          )}

          {activePage === 'vulnerabilities' && (
            <VulnerabilitiesPage
              vulnerabilities={vulnerabilities}
              onPatchVuln={handlePatchVulnerability}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'assets' && (
            <AssetsPage
              assets={topology?.nodes || []}
              onSelectAsset={(asset) => {
                setSelectedAsset(asset);
              }}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'mitre-attack' && (
            <MitreAttackPage
              onNavigate={(page) => setActivePage(page)}
              onSelectPath={(path) => setSelectedPath(path)}
            />
          )}

          {activePage === 'defense-recommendations' && (
            <DefenseRecommendationsPage
              recommendations={recommendations}
              onSimulateDefense={handleSimulateDefense}
              lastDefenseResult={lastDefenseResult}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'simulation-history' && (
            <SimulationHistoryPage
              onNavigate={(page) => setActivePage(page)}
              onSelectPath={(path) => setSelectedPath(path)}
            />
          )}

          {activePage === 'alerts' && (
            <AlertsPage
              alerts={alerts}
              onRefresh={loadPlatformData}
              onNavigate={(page) => setActivePage(page)}
            />
          )}

          {activePage === 'settings' && (
            <SettingsPage
              onResetSystem={handleResetSystem}
              oracleConnected={oracleConnected}
            />
          )}
        </main>
      </div>
    </div>
  );
}
