const express = require('express');
const router = express.Router();
const mitigationService = require('../services/mitigationService');
const oracle = require('../config/oracle');

router.get('/rules', (req, res) => {
  res.json(oracle.getMitigationRules());
});

router.post('/', async (req, res) => {
  const { actionType, targetNodeId, attackType } = req.body;
  if (!actionType) {
    return res.status(400).json({ error: 'actionType is required' });
  }

  const result = await mitigationService.applyMitigation(actionType, targetNodeId, attackType);
  res.json(result);
});

module.exports = router;
