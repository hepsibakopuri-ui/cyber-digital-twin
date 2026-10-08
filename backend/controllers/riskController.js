const db = require('../database/db');
const riskEngine = require('../services/riskEngine');

async function getNetworkRisk(req, res) {
  try {
    const assessment = await db.getRiskAssessment();
    const assets = await db.getAssets();

    // Group assets by security state
    const distribution = {
      CRITICAL: assets.filter(a => a.SECURITY_STATE === 'CRITICAL').length,
      HIGH_RISK: assets.filter(a => a.SECURITY_STATE === 'HIGH_RISK').length,
      MEDIUM_RISK: assets.filter(a => a.SECURITY_STATE === 'MEDIUM_RISK').length,
      LOW_RISK: assets.filter(a => a.SECURITY_STATE === 'LOW_RISK').length,
      SECURE: assets.filter(a => a.SECURITY_STATE === 'SECURE').length
    };

    res.json({
      success: true,
      data: {
        ...assessment,
        distribution,
        weights: riskEngine.WEIGHTS
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function getAssetRisk(req, res) {
  try {
    const asset = await db.getAssetById(req.params.id);
    if (!asset) {
      return res.status(404).json({ success: false, error: 'Asset not found' });
    }
    const vulns = await db.getAssetVulnerabilities(req.params.id);
    const controls = await db.getSecurityControls();
    const assetControls = controls.filter(c => c.APPLIED_TO_ASSET === req.params.id);

    res.json({
      success: true,
      data: {
        assetId: asset.ASSET_ID,
        assetName: asset.NAME,
        riskScore: asset.RISK_SCORE,
        securityState: asset.SECURITY_STATE,
        vulnerabilities: vulns,
        controls: assetControls
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function recalculate(req, res) {
  try {
    const updated = await riskEngine.recalculateNetworkRisk();
    res.json({ success: true, message: 'Risk recalculated successfully.', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getNetworkRisk,
  getAssetRisk,
  recalculate
};
