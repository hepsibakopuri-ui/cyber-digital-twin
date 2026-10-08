const db = require('../database/db');
const predictionEngine = require('../services/predictionEngine');

async function getAttackPaths(req, res) {
  try {
    const paths = await db.getAttackPaths();
    res.json({ success: true, count: paths.length, data: paths });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function predictPaths(req, res) {
  try {
    const paths = await predictionEngine.predictAttackPaths();
    res.json({
      success: true,
      message: 'AI attack path prediction engine completed successfully.',
      timestamp: new Date().toISOString(),
      count: paths.length,
      data: paths
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getAttackPaths,
  predictPaths
};
