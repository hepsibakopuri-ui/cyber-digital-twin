const express = require('express');
const router = express.Router();
const oracle = require('../config/oracle');

router.get('/status', (req, res) => {
  res.json(oracle.getOracleStatus());
});

router.get('/incidents', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(oracle.getRecentIncidents(limit));
});

module.exports = router;
