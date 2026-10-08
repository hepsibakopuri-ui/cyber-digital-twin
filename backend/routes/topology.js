const express = require('express');
const router = express.Router();
const digitalTwinEngine = require('../services/digitalTwinEngine');

router.get('/', (req, res) => {
  res.json(digitalTwinEngine.getTopology());
});

router.get('/node/:id', (req, res) => {
  const node = digitalTwinEngine.getNode(req.params.id);
  if (!node) return res.status(404).json({ error: 'Node not found' });
  res.json(node);
});

router.put('/node/:id/status', (req, res) => {
  const { status } = req.body;
  const node = digitalTwinEngine.setNodeStatus(req.params.id, status);
  if (!node) return res.status(404).json({ error: 'Node not found' });
  res.json({ message: 'Node status updated', node, topology: digitalTwinEngine.getTopology() });
});

router.post('/node/:id/patch', (req, res) => {
  const node = digitalTwinEngine.patchNodeVulnerability(req.params.id);
  if (!node) return res.status(404).json({ error: 'Node not found' });
  res.json({ message: 'Node patched', node, topology: digitalTwinEngine.getTopology() });
});

router.post('/reset', (req, res) => {
  const topology = digitalTwinEngine.resetAllNodes();
  res.json({ message: 'Digital Twin reset to normal', topology });
});

module.exports = router;
