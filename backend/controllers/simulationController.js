const db = require('../database/db');
const whatIfSimulator = require('../services/whatIfSimulator');

async function runWhatIfSimulation(req, res) {
  try {
    const { entryPoint, targetAsset, vulnerabilityId, securityControlState } = req.body;
    const result = await whatIfSimulator.runSimulation({
      entryPoint,
      targetAsset,
      vulnerabilityId,
      securityControlState
    });

    res.json({
      success: true,
      message: 'What-If attack simulation completed.',
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getSimulationHistory(req, res) {
  try {
    const history = await db.getSimulations();
    res.json({ success: true, count: history.length, data: history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getSimulationById(req, res) {
  try {
    const history = await db.getSimulations();
    const sim = history.find(s => s.SIMULATION_ID === req.params.id);
    if (!sim) {
      return res.status(404).json({ success: false, error: 'Simulation not found' });
    }
    res.json({ success: true, data: sim });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  runWhatIfSimulation,
  getSimulationHistory,
  getSimulationById
};
