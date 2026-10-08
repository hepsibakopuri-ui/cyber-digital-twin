const express = require('express');
const router = express.Router();
const wekaClient = require('../services/wekaClient');
const oracle = require('../config/oracle');

router.get('/recent', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(oracle.getRecentPredictions(limit));
});

router.get('/ai-status', async (req, res) => {
  const status = await wekaClient.checkHealth();
  res.json(status);
});

router.post('/manual', async (req, res) => {
  const features = req.body;
  const prediction = await wekaClient.predict(features);
  res.json(prediction);
});

router.post('/retrain', async (req, res) => {
  const result = await wekaClient.retrain();
  res.json(result);
});

module.exports = router;
