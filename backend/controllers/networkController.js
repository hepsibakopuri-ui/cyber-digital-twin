const digitalTwinService = require('../services/digitalTwinService');

async function getTopology(req, res) {
  try {
    const topology = await digitalTwinService.getTopology();
    res.json({ success: true, data: topology });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getTopology
};
