const db = require('../database/db');
const defenseEngine = require('../services/defenseEngine');

async function getRecommendations(req, res) {
  try {
    const recs = await db.getDefenseRecommendations();
    res.json({ success: true, count: recs.length, data: recs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function simulateDefenseAction(req, res) {
  try {
    const { defenseId, actionTitle, affectedAsset, actionType } = req.body;
    const result = await defenseEngine.simulateDefense(defenseId, {
      actionTitle,
      affectedAsset,
      actionType
    });
    res.json({
      success: true,
      message: `Defense simulation executed successfully for ${result.actionTitle}.`,
      data: result
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getRecommendations,
  simulateDefenseAction
};
