const db = require('../database/db');

// Multi-factor risk calculation parameters
const WEIGHTS = {
  vulnerability: 0.35,
  criticality: 0.25,
  exposure: 0.20,
  connectivity: 0.10,
  controlsAttenuation: 0.10
};

const CRITICALITY_MAP = {
  CRITICAL: 1.0,
  HIGH: 0.8,
  MEDIUM: 0.5,
  LOW: 0.2
};

function calculateAssetRisk(asset, vulns, connections, controls) {
  // 1. Vulnerability factor
  const unpatchedVulns = vulns.filter(v => v.ASSET_ID === asset.ASSET_ID && v.STATUS !== 'PATCHED');
  const maxCvss = unpatchedVulns.length > 0 ? Math.max(...unpatchedVulns.map(v => Number(v.CVSS_SCORE || 0))) : 0;
  const vulnScore = (maxCvss / 10.0) * 100;

  // 2. Criticality factor
  const critScore = (CRITICALITY_MAP[asset.CRITICALITY] || 0.5) * 100;

  // 3. Exposure factor (External/DMZ or public IP)
  let expScore = 20;
  if (asset.ZONE === 'EXTERNAL') expScore = 90;
  else if (asset.ZONE === 'DMZ') expScore = 80;
  else if (asset.ZONE === 'CLOUD_VPC') expScore = 65;
  else if (asset.ZONE === 'USER_LAN') expScore = 45;
  else if (asset.ZONE === 'PRIVILEGED_LAN') expScore = 30;
  else if (asset.ZONE === 'SECURE_DATA') expScore = 20;

  // 4. Connectivity factor (degrees in graph)
  const links = connections.filter(c => c.SOURCE_ASSET_ID === asset.ASSET_ID || c.TARGET_ASSET_ID === asset.ASSET_ID);
  const connScore = Math.min(links.length * 20, 100);

  // 5. Security Controls damping factor
  const activeControls = controls.filter(c => c.APPLIED_TO_ASSET === asset.ASSET_ID && c.STATUS === 'ACTIVE');
  const avgEffectiveness = activeControls.length > 0
    ? activeControls.reduce((sum, c) => sum + Number(c.EFFECTIVENESS_PCT || 50), 0) / activeControls.length
    : 0;

  // Base raw risk
  let rawRisk =
    vulnScore * WEIGHTS.vulnerability +
    critScore * WEIGHTS.criticality +
    expScore * WEIGHTS.exposure +
    connScore * WEIGHTS.connectivity;

  // Attenuate by active security controls
  const damping = (avgEffectiveness / 100) * (WEIGHTS.controlsAttenuation * 100);
  let finalRisk = Math.max(10, Math.min(99, rawRisk - damping));

  return Math.round(finalRisk * 10) / 10;
}

function deriveSecurityState(riskScore, unpatchedCount) {
  if (riskScore >= 85) return 'CRITICAL';
  if (riskScore >= 70) return 'HIGH_RISK';
  if (riskScore >= 50) return 'MEDIUM_RISK';
  if (riskScore >= 30) return 'LOW_RISK';
  return 'SECURE';
}

async function recalculateNetworkRisk() {
  const assets = await db.getAssets();
  const vulns = await db.getAssetVulnerabilities();
  const connections = await db.getConnections();
  const controls = await db.getSecurityControls();
  const paths = await db.getAttackPaths();

  let totalRisk = 0;
  let unpatchedCount = 0;

  for (const asset of assets) {
    const risk = calculateAssetRisk(asset, vulns, connections, controls);
    const assetVulns = vulns.filter(v => v.ASSET_ID === asset.ASSET_ID && v.STATUS !== 'PATCHED');
    unpatchedCount += assetVulns.length;
    const secState = deriveSecurityState(risk, assetVulns.length);

    await db.updateAssetSecurityState(asset.ASSET_ID, secState, risk);
    totalRisk += risk;
  }

  const avgNetworkRisk = Math.round((totalRisk / assets.length) * 10) / 10;

  // Highest path risk
  const activePaths = paths.filter(p => p.STATUS === 'ACTIVE');
  const topPathRisk = activePaths.length > 0 ? Math.max(...activePaths.map(p => Number(p.RISK_SCORE))) : 30;

  // Calculate Health Score Factors (0-100, where higher is healthier)
  const vulnHealth = Math.max(10, Math.round(100 - unpatchedCount * 12));
  const activeSeg = controls.find(c => c.CONTROL_TYPE === 'Network Segmentation' && c.STATUS === 'ACTIVE');
  const segmentationScore = activeSeg ? 85 : 45;
  const exposureScore = Math.max(20, Math.round(100 - avgNetworkRisk * 0.8));
  const pathRiskScore = Math.max(15, Math.round(100 - topPathRisk * 0.9));
  const controlsScore = Math.round(
    (controls.filter(c => c.STATUS === 'ACTIVE').length / Math.max(controls.length, 1)) * 100
  );

  // Overall Cybersecurity Health Score
  const healthScore = Math.round(
    vulnHealth * 0.25 +
    segmentationScore * 0.20 +
    exposureScore * 0.20 +
    pathRiskScore * 0.20 +
    controlsScore * 0.15
  );

  const updatedRiskAssessment = {
    OVERALL_SECURITY_SCORE: healthScore,
    NETWORK_RISK_SCORE: avgNetworkRisk,
    VULNERABILITY_HEALTH: vulnHealth,
    NETWORK_SEGMENTATION: segmentationScore,
    ASSET_EXPOSURE: exposureScore,
    ATTACK_PATH_RISK: topPathRisk,
    SECURITY_CONTROLS_SCORE: controlsScore
  };

  await db.updateRiskAssessment(updatedRiskAssessment);
  return updatedRiskAssessment;
}

module.exports = {
  calculateAssetRisk,
  deriveSecurityState,
  recalculateNetworkRisk,
  WEIGHTS
};
