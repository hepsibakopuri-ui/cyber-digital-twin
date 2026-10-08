# AI-Based Cybersecurity Digital Twin with Attack Prediction
### Enterprise Security Operations Center (SOC) Simulation & Threat Forecasting Platform

[![Database: Oracle Database XE](https://img.shields.io/badge/Database-Oracle%2011g%2F19c%2F21c%20XE-red.svg)](https://www.oracle.com/database/)
[![SQL*Plus Compatible](https://img.shields.io/badge/SQL*Plus-Compatible-orange.svg)](https://www.oracle.com/)
[![Backend: Node.js / Express](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-green.svg)](https://nodejs.org/)
[![Frontend: React 18 + Vite](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-blue.svg)](https://vitejs.dev/)
[![Visualizations: React Flow](https://img.shields.io/badge/Graph-React%20Flow-purple.svg)](https://reactflow.dev/)
[![Classification: MITRE ATT&CK](https://img.shields.io/badge/Framework-MITRE%20ATT%26CK-red.svg)](https://attack.mitre.org/)

---

## 1. Project Overview

**AI-Based Cybersecurity Digital Twin with Attack Prediction** is an enterprise-grade cyber-defense platform designed for Security Operations Centers (SOCs), vulnerability management teams, and threat hunting units.

The system builds a real-time, interactive virtual model—a **Digital Twin**—of an enterprise hybrid IT network. It continuously evaluates network exposures and Common Vulnerabilities and Exposures (CVEs), predicts and ranks potential multi-hop attack trajectories, provides **Explainable AI (XAI)** causal justifications, formulates prescriptive defense remediations, and dynamically recalculates network risk upon defense deployment.

### Core Closed-Loop Workflow:
$$\text{Digital Twin} \longrightarrow \text{Predict} \longrightarrow \text{Explain} \longrightarrow \text{Recommend Defense} \longrightarrow \text{Simulate Defense} \longrightarrow \text{Recalculate Risk}$$

> [!NOTE]
> **Defensive Simulation Principle**: This platform is strictly a cybersecurity simulation, risk forecasting, and defensive decision-support system. It does **not** conduct actual network exploitation, unauthorized packet scanning, malware dissemination, or external destructive actions.

---

## 2. Architecture & Subsystems

```
┌────────────────────────────────────────────────────────────────────────┐
│               Enterprise SOC Dashboard (React 18 + Vite)               │
│  - React Flow Canvas: Dynamic nodes, animated edges, packet flows      │
│  - 4 Heatmap Modes: Normal, Risk Heatmap, Attack Path, Vulnerability   │
│  - Explainable AI (XAI) Causal Inspector & Risk Decomposition          │
│  - Interactive What-If Simulator with Stage-by-Stage Traversal         │
│  - Recharts: Cybersecurity Health Score Gauge & Risk Trend Telemetry   │
│  - MITRE ATT&CK Enterprise Matrix & SOC Alert Queue                    │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ REST API (:5000) & WebSocket (/ws)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     Node.js & Express.js Backend                       │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │ Controllers & Routes: Assets, Topology, Prediction, Defense,     │  │
│  │ Vulnerability, What-If, MITRE, History, Risk, Alerts, Auth       │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│  ┌──────────────────────────────────▼───────────────────────────────┐  │
│  │ Core Services:                                                   │  │
│  │  - DigitalTwinService: Graph topology & asset state management   │  │
│  │  - PredictionEngine: Multi-hop graph search & path ranking       │  │
│  │  - ExplainabilityService: Dynamic natural language reasoning     │  │
│  │  - DefenseEngine: Mitigation application & risk delta calc       │  │
│  │  - DynamicRiskEngine: Asset, path, network & health scoring      │  │
│  │  - WhatIfSimulator: Discrete-event attack simulation runner      │  │
│  │  - MitreAttackService: ATT&CK tactic & technique mapping         │  │
│  └──────────────────────────────────┬───────────────────────────────┘  │
│                                     │                                  │
│  ┌──────────────────────────────────▼───────────────────────────────┐  │
│  │ Oracle Database XE Integration (via SQL*Plus & node-oracledb)    │  │
│  │  - Live Oracle XE connection via OCI.DLL Thick client mode       │  │
│  │  - 14 Relational Tables: USERS, ASSETS, ASSET_CONNECTIONS,       │  │
│  │    VULNERABILITIES, ASSET_VULNERABILITIES, SECURITY_CONTROLS,    │  │
│  │    ATTACK_TECHNIQUES, ATTACK_PATHS, ATTACK_PATH_STEPS,           │  │
│  │    RISK_ASSESSMENTS, DEFENSE_RECOMMENDATIONS, SIMULATIONS,       │  │
│  │    SIMULATION_EVENTS, ALERTS                                     │  │
│  │  - Resilient In-Memory Relational Engine fallback if DB offline  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite 5
- **Styling**: Tailwind CSS (SOC Dark Theme, Glassmorphism, Neon Accents)
- **Animations**: Framer Motion
- **Topology Graph**: `@xyflow/react` (React Flow) with custom nodes & animated edges
- **Data Visualizations**: Recharts (Health gauge, Bar, Pie, Area trends)
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js v24
- **Framework**: Express.js
- **Architecture**: Service/Controller/Model modular pattern
- **Live Streams**: WebSocket (`ws`)
- **Environment**: Dotenv
- **Security**: CORS, parameter sanitization

### Database
- **Engine**: Oracle Database 11g / 12c / 19c / 21c XE
- **CLI Client**: Oracle SQL\*Plus (`sqlplus`)
- **Driver**: `node-oracledb` 6.10 with Oracle Thick Client (`oci.dll`) support
- **Relational Schema**: 14 tables with Primary Keys, Foreign Keys, Sequences, and Indexes
- **Resilience**: Dual-mode engine running live against Oracle XE or in-memory fallback

---

## 4. Folder Structure

```
cyber-digital-twin/
├── backend/
│   ├── config/
│   │   └── oracle.js             # Oracle Thick client & connection pool manager
│   ├── controllers/
│   │   ├── alertController.js    # SOC alerts resolution & filtering
│   │   ├── assetController.js    # Assets inspection & state mutation
│   │   ├── authController.js     # Demo user authentication
│   │   ├── defenseController.js  # Mitigation actions & simulation
│   │   ├── mitreController.js    # ATT&CK matrix retrieval
│   │   ├── networkController.js  # Topology graph generation
│   │   ├── predictionController.js # AI path ranking controller
│   │   ├── riskController.js     # Health score & risk breakdown
│   │   ├── simulationController.js # What-If attack execution & history
│   │   └── vulnerabilityController.js # CVE catalog & rapid patching
│   ├── database/
│   │   └── db.js                 # Dual-mode database repository adapter
│   ├── routes/                   # REST API route handlers
│   ├── services/
│   │   ├── defenseEngine.js      # Defense recommendation & risk delta calculator
│   │   ├── digitalTwinService.js # Digital twin graph & asset state builder
│   │   ├── explainabilityService.js # Explainable AI (XAI) causal justification engine
│   │   ├── predictionEngine.js   # AI attack path prediction & ranking algorithm
│   │   ├── riskEngine.js         # Multi-factor dynamic risk scoring engine
│   │   └── whatIfSimulator.js    # Step-by-step What-If traversal sandbox
│   ├── .env                      # Oracle credentials & server parameters
│   ├── package.json
│   └── server.js                 # Express server & WebSocket broadcaster
│
├── database/
│   ├── schema.sql                # Complete Oracle SQL*Plus DDL (14 tables, indexes, sequences)
│   ├── seed_data.sql             # Realistic enterprise seed data (nodes, links, CVEs, paths)
│   ├── init_user.sql             # SQL*Plus script to grant privileges as SYSDBA
│   └── setup_oracle.bat          # One-click SQL*Plus setup script
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── RiskGauge.jsx # Circular health score gauge with 5 factor bars
│   │   │   │   └── StatCard.jsx  # Animated cyber stat counter card
│   │   │   ├── digitaltwin/
│   │   │   │   ├── AssetDetailsPanel.jsx # Slide-out device inspection drawer
│   │   │   │   ├── CustomNode.jsx        # Glowing React Flow node component
│   │   │   │   └── DigitalTwinCanvas.jsx # Interactive canvas with 4 heatmap modes
│   │   │   └── layout/
│   │   │       ├── Sidebar.jsx   # 12-page navigation with active badges
│   │   │       └── TopBar.jsx    # UTC clock, Oracle DB badge, risk score pill
│   │   ├── pages/
│   │   │   ├── AlertsPage.jsx                # SOC alert center & severity filters
│   │   │   ├── AssetsPage.jsx                # Network inventory & zone filters
│   │   │   ├── AttackPathsPage.jsx           # Trajectory directory & hop cards
│   │   │   ├── AttackPredictionPage.jsx      # AI prediction & Explainable AI
│   │   │   ├── DashboardPage.jsx             # SOC overview & Recharts telemetry
│   │   │   ├── DefenseRecommendationsPage.jsx # Prescriptive actions & before/after delta
│   │   │   ├── DigitalTwinPage.jsx           # Full-screen topology studio
│   │   │   ├── LandingPage.jsx               # Cyber hero & console authentication
│   │   │   ├── MitreAttackPage.jsx           # ATT&CK Enterprise Matrix explorer
│   │   │   ├── SettingsPage.jsx              # AI weight tuning & Oracle diagnostics
│   │   │   ├── SimulationHistoryPage.jsx     # Audit log of past simulations
│   │   │   ├── VulnerabilitiesPage.jsx       # CVE catalog & one-click patch
│   │   │   └── WhatIfSimulatorPage.jsx       # Interactive What-If attack player
│   │   ├── services/
│   │   │   └── api.js            # Comprehensive REST API client
│   │   ├── App.jsx               # Main platform state & workflow orchestrator
│   │   ├── index.css             # Cyber theme utility styling & keyframes
│   │   └── main.jsx
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
│
├── README.md                     # Comprehensive technical documentation
├── run-system.bat                # Unified launcher for all services
├── start-backend.bat             # Individual backend launcher
└── start-frontend.bat            # Individual frontend launcher
```

---

## 5. Oracle Database Setup via SQL\*Plus (`sqlplus`)

The database architecture is designed natively for Oracle Database and SQL\*Plus execution.

### Prerequisites
- Oracle Database XE (11g, 19c, or 21c) installed and running on Windows.
- `sqlplus` available in system PATH (e.g. `C:\oraclexe\app\oracle\product\11.2.0\server\bin\sqlplus.exe`).

### Step 1: Initialize User & Schema
Open PowerShell or Command Prompt and run:
```cmd
cd C:\Users\hepsi\.gemini\antigravity\scratch\cyber-digital-twin\database
setup_oracle.bat
```
Alternatively, execute directly via SQL\*Plus:
```cmd
sqlplus "/ as sysdba" @database/init_user.sql
sqlplus CYBER_TWIN/"CyberTwin#2026"@localhost:1521/XE @database/schema.sql
sqlplus CYBER_TWIN/"CyberTwin#2026"@localhost:1521/XE @database/seed_data.sql
```

### Relational Schema Tables (14 Tables)
1. `USERS`: User credentials, authentication hashes, and roles.
2. `ASSETS`: Digital Twin nodes (IP, OS, Zone, Criticality, Risk Score, Status).
3. `ASSET_CONNECTIONS`: Directed network edges between assets, protocols, and ports.
4. `VULNERABILITIES`: CVE catalog with CVSS v3 ratings and remediations.
5. `ASSET_VULNERABILITIES`: Cross-reference linking assets to CVEs with exposed port tags.
6. `SECURITY_CONTROLS`: Firewalls, WAF, Microsegmentation, EDR, and MFA rules.
7. `ATTACK_TECHNIQUES`: MITRE ATT&CK technique IDs, tactics, and descriptions.
8. `ATTACK_PATHS`: Predicted multi-hop routes, risk scores, and XAI explanations.
9. `ATTACK_PATH_STEPS`: Granular step-by-step hops along each predicted trajectory.
10. `RISK_ASSESSMENTS`: Network-wide cybersecurity health scores and sub-factor scores.
11. `DEFENSE_RECOMMENDATIONS`: Prescriptive remediation actions and estimated risk deltas.
12. `SIMULATIONS`: What-If attack runs and before/after risk records.
13. `SIMULATION_EVENTS`: Granular step-by-step logs per simulation.
14. `ALERTS`: SOC alert queue with severity levels and resolution tracking.

---

## 6. Environment Variables (`backend/.env`)

```env
PORT=5000
AI_ENGINE_URL=http://localhost:5005

# Oracle Database Configuration (SQL*Plus & node-oracledb)
ORACLE_USER=CYBER_TWIN
ORACLE_PASSWORD="CyberTwin#2026"
ORACLE_CONNECT_STRING=127.0.0.1:1521/XE
ORACLE_CLIENT_DIR=C:\oraclexe\app\oracle\product\11.2.0\server\bin
```

---

## 7. Starting the Application

### Option A: Unified Launcher (Recommended)
Double-click:
```cmd
run-system.bat
```
This automatically verifies Oracle XE via SQL\*Plus, launches the Express backend on port `5000`, starts the React SOC dashboard on port `3000`, and opens your default browser at `http://localhost:3000`.

### Option B: Start Services Individually

**1. Backend**:
```cmd
cd backend
node server.js
```
*Listens on `http://localhost:5000` and WebSocket on `ws://localhost:5000/ws/telemetry`.*

**2. Frontend**:
```cmd
cd frontend
npm.cmd run dev
```
*Listens on `http://localhost:3000`.*

---

## 8. Demo Credentials

| Role | Email | Password |
| :--- | :--- | :--- |
| **SOC Lead Security Architect** | `admin@example.com` | `CyberTwin@2026` |
| **Tier-2 Threat Hunter** | `analyst@example.com` | `CyberTwin@2026` |

---

## 9. AI Prediction & Risk Algorithms

### Transparent AI-Inspired Attack Path Prediction Algorithm
The prediction service (`backend/services/predictionEngine.js`) performs graph traversal from untrusted ingress nodes (`internet`, `emp-pc`, `cloud-vpc`) toward critical targets (`db-server`, `admin-pc`).

For each candidate multi-hop path, it calculates:
1. **Edge Traversal Feasibility**: Evaluates open ports and network layer protocols.
2. **Vulnerability Factor**: Maximizes unpatched CVSS v3 ratings on hop nodes:
   $$V_{\text{hop}} = \frac{\text{CVSS}_{\max}}{10.0} \times 100$$
3. **Security Control Attenuation**: If an active countermeasure (e.g. WAF, EDR, Microsegmentation) is bound to an intermediate hop, step risk is attenuated by $(1 - \text{Effectiveness})$.
4. **Hop Penalty**: Longer trajectories incur detection attenuation:
   $$R_{\text{path}} = \left( \frac{\sum R_{\text{step}}}{N_{\text{hops}}} \right) \times (0.96)^{N_{\text{hops}} - 1}$$
5. **Path Ranking**: Paths are ranked from highest to lowest composite risk and categorized into `CRITICAL`, `HIGH`, `MEDIUM`, or `LOW`.

### Explainable AI (XAI) Causal Decomposition
Rather than providing a black-box percentage, the Explainability engine (`backend/services/explainabilityService.js`) generates dynamic natural language explanations detailing:
- The initial entry point vulnerability (e.g., exposed CVE-2024-21887 on port 443).
- Missing segmentation barriers allowing lateral RPC/SSH pivoting.
- Crown jewel asset classification and enterprise data impact.

### Cybersecurity Health Score Formula (0–100 Gauge)
The platform derives a holistic defensive health gauge:
$$\text{Health Score} = 0.25 \cdot H_{\text{vuln}} + 0.20 \cdot H_{\text{seg}} + 0.20 \cdot H_{\text{exp}} + 0.20 \cdot H_{\text{path}} + 0.15 \cdot H_{\text{ctrl}}$$

---

## 10. End-to-End Demonstration Walkthrough

Follow this sequence to demonstrate the complete closed loop:

1. **Open Dashboard**:
   - Inspect overall Cybersecurity Health Score gauge (78/100).
   - Review the 8 animated stat cards and Recharts visualizations.
   - Observe the live security telemetry feed.

2. **Open Digital Twin Studio**:
   - View the network topology: Internet $\rightarrow$ Perimeter Firewall $\rightarrow$ Web Server $\rightarrow$ Internal Firewall $\rightarrow$ Application Server $\rightarrow$ Oracle Database Server.
   - Click **Web Server (DMZ)**: inspect the slide-out **Asset Details Panel** showing open ports 80/443/8080, CVE-2024-21887, and risk score.
   - Toggle heatmap modes: *Risk Heatmap*, *Attack Path View*, *Vulnerability Density*.

3. **Open Attack Prediction**:
   - Click **"Predict Attack Paths"**.
   - Observe AI-ranked paths (e.g., PATH-01 at 91% risk).
   - Select PATH-01: review the **Explainable AI (XAI)** natural language reasoning.

4. **Execute Defense Simulation**:
   - In Defense Recommendations, click **"Simulate Defense"** on `REC-01` (*Patch Web Server Vulnerabilities*).
   - The Digital Twin updates node states.
   - The Risk Recalculation engine computes risk drop: **91% $\rightarrow$ 46% (49.45% reduction)**.
   - Animated comparison bar chart displays the before vs. after delta.
   - Previously high-risk attack paths are downgraded or blocked.

5. **Run What-If Attack Simulator**:
   - Select Entry Point: *Public Internet*, Target: *Database Server*, Control: *Baseline*.
   - Click **Execute Attack Simulation** and watch step-by-step traversal.
   - Switch Defense Posture to *Virtual Patch Deployed* and re-run: observe attack **blocked** at Web Server stage.

6. **Inspect Simulation History & Alerts**:
   - View the historical simulation audit records saved in Oracle Database.
   - Inspect and resolve SOC alerts in the Alert Queue.

---

## 11. REST API Endpoints Summary

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | System health, engine status, Oracle DB state |
| `GET` | `/api/network/topology` | Digital Twin nodes, connections, and security states |
| `GET` | `/api/assets` | Full enterprise asset inventory |
| `GET` | `/api/assets/:id` | Asset detail inspection with open ports & CVEs |
| `GET` | `/api/vulnerabilities` | CVE catalog with CVSS scores and patch statuses |
| `POST`| `/api/vulnerabilities/:id/patch` | Virtual patch application and risk recalculation |
| `GET` | `/api/attack-paths` | Ranked feasible attack trajectories |
| `POST`| `/api/attack-paths/predict` | Executes AI graph traversal prediction engine |
| `GET` | `/api/risk` | Holistic cybersecurity health score and factor breakdowns |
| `POST`| `/api/defense/simulate` | One-click defense simulation with before/after risk delta |
| `GET` | `/api/recommendations` | Prescriptive defense recommendations |
| `POST`| `/api/simulations` | Executes What-If attack simulation |
| `GET` | `/api/simulations` | Retrieves simulation history log from Oracle DB |
| `GET` | `/api/alerts` | Active SOC alert queue with severity filters |
| `POST`| `/api/alerts/:id/resolve` | Marks SOC alert as resolved |
| `GET` | `/api/attack-techniques` | MITRE ATT&CK enterprise matrix & mapped paths |
| `POST`| `/api/auth/login` | Demo SOC analyst authentication |
| `POST`| `/api/system/reset` | Resets Digital Twin state to factory baseline |
| `POST`| `/api/system/oracle-test` | Tests custom Oracle Database connection credentials |

---

## 12. Limitations & Future Enhancements

- **Limitations**:
  - The prediction engine currently evaluates simulated network models rather than connecting to live enterprise EDR/SIEM agents.
  - The Oracle database driver operates in Thick Client mode on Windows using Oracle 11g/19c client libraries.
- **Future Enhancements**:
  - Automated ingestion of real-time CVE feeds via NIST NVD API.
  - Deep Reinforcement Learning (DRL) agent for automated autonomous countermeasure selection.
  - Exporting topology and predicted attack paths in STIX 2.1 / TAXII format.

---

## 13. License

Enterprise Security Operations Research & Demonstration Prototype. Built for advanced defensive simulation and presentation.
