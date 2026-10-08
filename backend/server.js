const http = require('http');
const express = require('express');
const cors = require('cors');
const { WebSocketServer } = require('ws');
require('dotenv').config();

const oracle = require('./config/oracle');
const db = require('./database/db');
const riskEngine = require('./services/riskEngine');
const predictionEngine = require('./services/predictionEngine');

// Route imports
const assetRoutes = require('./routes/assets');
const networkRoutes = require('./routes/network');
const vulnerabilityRoutes = require('./routes/vulnerabilities');
const attackPathRoutes = require('./routes/attackPaths');
const riskRoutes = require('./routes/risk');
const simulationRoutes = require('./routes/simulations');
const defenseRoutes = require('./routes/defense');
const alertRoutes = require('./routes/alerts');
const attackTechniqueRoutes = require('./routes/attackTechniques');
const authRoutes = require('./routes/auth');
const systemRoutes = require('./routes/system');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/assets', assetRoutes);
app.use('/api/network', networkRoutes);
app.use('/api/vulnerabilities', vulnerabilityRoutes);
app.use('/api/attack-paths', attackPathRoutes);
app.use('/api/risk', riskRoutes);
app.use('/api/simulations', simulationRoutes);
app.use('/api/defense', defenseRoutes);
app.use('/api/recommendations', (req, res) => {
  const defenseController = require('./controllers/defenseController');
  defenseController.getRecommendations(req, res);
});
app.use('/api/alerts', alertRoutes);
app.use('/api/attack-techniques', attackTechniqueRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/system', systemRoutes);

// Root System Status endpoint
app.get('/api/health', (req, res) => {
  const oracleStatus = oracle.getOracleStatus();
  res.json({
    status: 'HEALTHY',
    service: 'AI-Based Cybersecurity Digital Twin with Attack Prediction',
    version: '2.4.0-ENTERPRISE',
    timestamp: Date.now(),
    components: {
      oracleDatabase: oracleStatus,
      predictionEngine: { status: 'ONLINE', model: 'Intelligent Weighted Graph Traversal Engine' },
      riskEngine: { status: 'ONLINE', mode: 'Continuous Dynamic Evaluation' }
    }
  });
});

// Create HTTP and WebSocket Server
const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws/telemetry' });

const clients = new Set();
wss.on('connection', (ws) => {
  clients.add(ws);
  ws.send(JSON.stringify({ type: 'CONNECTED', message: 'Connected to SOC live telemetry stream.' }));

  ws.on('close', () => clients.delete(ws));
  ws.on('error', (err) => console.error('[WebSocket] Socket error:', err.message));
});

// Periodic simulated packet flow event to keep live telemetry active
setInterval(() => {
  if (clients.size > 0) {
    const event = {
      type: 'FLOW_HEARTBEAT',
      timestamp: new Date().toISOString(),
      activeNodes: 9,
      activeEdges: 12,
      latencyMs: Math.floor(Math.random() * 5) + 1
    };
    const payload = JSON.stringify(event);
    for (const client of clients) {
      if (client.readyState === 1) {
        client.send(payload);
      }
    }
  }
}, 4000);

// Server startup
async function start() {
  console.log('=================================================================');
  console.log('  AI-Based Cybersecurity Digital Twin with Attack Prediction     ');
  console.log('  Node.js & Express Enterprise SOC Backend                       ');
  console.log('=================================================================');

  // Attempt Oracle connection via SQL*Plus compatible Thick driver
  const oracleConnected = await oracle.initOracle();
  if (oracleConnected) {
    console.log('[Backend] Successfully bound to Oracle Database XE.');
  } else {
    console.log('[Backend] Operating in resilient relational demo mode with full seed data.');
  }

  // Pre-calculate baseline predictions & risk scores
  try {
    await predictionEngine.predictAttackPaths();
    await riskEngine.recalculateNetworkRisk();
    console.log('[Backend] Attack path prediction & dynamic risk engine initialized.');
  } catch (err) {
    console.error('[Backend] Engine init warning:', err.message);
  }

  server.listen(PORT, () => {
    console.log(`[Backend] Express REST API listening on http://localhost:${PORT}`);
    console.log(`[Backend] WebSocket telemetry endpoint ready on ws://localhost:${PORT}/ws/telemetry`);
  });
}

start();
