const express = require('express');
const router = express.Router();
const db = require('../database/db');
const oracle = require('../config/oracle');
const riskEngine = require('../services/riskEngine');
const predictionEngine = require('../services/predictionEngine');

router.post('/reset', async (req, res) => {
  try {
    db.resetToDefault();
    await predictionEngine.predictAttackPaths();
    await riskEngine.recalculateNetworkRisk();
    res.json({
      success: true,
      message: 'Digital Twin state reset to factory baseline successfully.'
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/oracle-test', async (req, res) => {
  try {
    const { user, password, connectString } = req.body;
    const testResult = await oracle.testConnection({
      user: user || process.env.ORACLE_USER || 'CYBER_TWIN',
      password: password || process.env.ORACLE_PASSWORD || 'CyberTwin#2026',
      connectString: connectString || process.env.ORACLE_CONNECT_STRING || '127.0.0.1:1521/XE'
    });
    res.json(testResult);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/status', (req, res) => {
  res.json({
    success: true,
    service: 'AI-Based Cybersecurity Digital Twin',
    version: '2.4.0-ENTERPRISE',
    timestamp: new Date().toISOString(),
    oracle: oracle.getOracleStatus()
  });
});

module.exports = router;
