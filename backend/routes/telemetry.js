const express = require('express');
const router = express.Router();
const oracle = require('../config/oracle');

router.get('/recent', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json(oracle.getRecentTelemetry(limit));
});

module.exports = router;
