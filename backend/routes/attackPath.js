const express = require('express');
const router = express.Router();
const digitalTwinEngine = require('../services/digitalTwinEngine');
const wekaClient = require('../services/wekaClient');

router.get('/', async (req, res) => {
  const topology = digitalTwinEngine.getTopology();
  const compromised = topology.nodes.find(n => n.status === 'COMPROMISED' || n.status === 'UNDER_ATTACK') || topology.nodes[1]; // default to web server

  const pathResult = await wekaClient.predictAttackPath(
    compromised.id,
    topology.nodes,
    topology.links,
    'LATERAL_MOVEMENT'
  );

  res.json({
    currentNode: compromised,
    attackPathForecast: pathResult.predictedNextHops || []
  });
});

module.exports = router;
