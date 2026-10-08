const db = require('../database/db');
const digitalTwinService = require('../services/digitalTwinService');

async function getAllAssets(req, res) {
  try {
    const assets = await db.getAssets();
    res.json({ success: true, count: assets.length, data: assets });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getAssetById(req, res) {
  try {
    const asset = await digitalTwinService.getAssetDetails(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Asset not found' });
    }
    res.json({ success: true, data: asset });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function updateAsset(req, res) {
  try {
    const { securityState, riskScore } = req.body;
    await db.updateAssetSecurityState(req.params.id, securityState, riskScore);
    const updated = await digitalTwinService.getAssetDetails(req.params.id);
    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getAllAssets,
  getAssetById,
  updateAsset
};
