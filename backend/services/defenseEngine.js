const db = require('../database/db');
const riskEngine = require('./riskEngine');
const predictionEngine = require('./predictionEngine');

async function simulateDefense(defenseId, customParams = {}) {
  const recommendations = await db.getDefenseRecommendations();
  const currentRisk = await db.getRiskAssessment();
  const rec = recommendations.find(r => r.REC_ID === defenseId);

  const riskBefore = currentRisk.NETWORK_RISK_SCORE || 82.5;
  const topPathRiskBefore = currentRisk.ATTACK_PATH_RISK || 91.0;

  let actionTitle = rec ? rec.TITLE : (customParams.actionTitle || 'Simulated Security Control');
  let affectedAsset = rec ? rec.AFFECTED_ASSET_ID : (customParams.affectedAsset || 'web-server');
  let actionType = rec ? rec.ACTION_TYPE : (customParams.actionType || 'PATCH');

  // Apply simulated modifications to Digital Twin state
  const state = db.getState();

  if (actionType === 'PATCH' || defenseId === 'REC-01') {
    // Patch CVE-2024-21887 and Log4j on Web Server
    state.assetVulnerabilities.forEach(av => {
      if (av.ASSET_ID === 'web-server') {
        av.STATUS = 'PATCHED';
      }
    });
  } else if (actionType === 'SEGMENTATION' || defenseId === 'REC-02') {
    // Enable microsegmentation on Internal Firewall
    const segControl = state.securityControls.find(c => c.CONTROL_TYPE === 'Network Segmentation');
    if (segControl) {
      segControl.STATUS = 'ACTIVE';
      segControl.EFFECTIVENESS_PCT = 92.0;
    }
  } else if (actionType === 'PORT_RESTRICTION' || defenseId === 'REC-03') {
    // Close port 80 / restrict ports on external firewall
    const fw = state.assets.find(a => a.ASSET_ID === 'fw-ext');
    if (fw) {
      fw.OPEN_PORTS = '443';
    }
  } else if (actionType === 'MFA_ENFORCE' || defenseId === 'REC-04') {
    const mfa = state.securityControls.find(c => c.CONTROL_TYPE === 'MFA');
    if (mfa) {
      mfa.STATUS = 'ACTIVE';
      mfa.EFFECTIVENESS_PCT = 95.0;
    }
  } else if (actionType === 'ENHANCED_MONITORING' || defenseId === 'REC-05') {
    const edr = state.securityControls.find(c => c.CONTROL_TYPE === 'EDR');
    if (edr) edr.EFFECTIVENESS_PCT = 95.0;
  }

  if (rec) {
    await db.updateDefenseStatus(rec.REC_ID, 'APPLIED');
  }

  // 1. Recalculate attack paths with new state
  const updatedPaths = await predictionEngine.predictAttackPaths();

  // 2. Recalculate network risk & health scores
  const updatedRisk = await riskEngine.recalculateNetworkRisk();

  const riskAfter = updatedRisk.NETWORK_RISK_SCORE;
  const topPathRiskAfter = updatedRisk.ATTACK_PATH_RISK;

  // Calculate percentage reduction
  const riskReductionPct = Math.round(((topPathRiskBefore - topPathRiskAfter) / topPathRiskBefore) * 10000) / 100;

  // Save to simulation history
  const simRecord = await db.saveSimulation({
    SIMULATION_NAME: `Defense Simulation: ${actionTitle}`,
    ENTRY_POINT: 'internet',
    TARGET_ASSET: affectedAsset === 'web-server' ? 'db-server' : affectedAsset,
    DEFENSE_APPLIED: actionTitle,
    RISK_BEFORE: topPathRiskBefore,
    RISK_AFTER: topPathRiskAfter,
    RISK_REDUCTION_PCT: Math.max(0, riskReductionPct),
    OUTCOME: topPathRiskAfter < 50 ? 'ATTACK_BLOCKED' : 'PARTIAL_CONTAINMENT'
  });

  // Post alert to SOC queue
  await db.addAlert({
    TITLE: `Defense Deployed: ${actionTitle}`,
    SEVERITY: 'INFO',
    ALERT_TYPE: 'DEFENSE_APPLIED',
    AFFECTED_ASSET_ID: affectedAsset,
    MESSAGE: `Simulated defense reduced peak attack path risk from ${topPathRiskBefore}% to ${topPathRiskAfter}% (${riskReductionPct}% reduction).`
  });

  return {
    defenseId,
    actionTitle,
    affectedAsset,
    riskBefore: topPathRiskBefore,
    riskAfter: topPathRiskAfter,
    riskReductionPct: Math.max(0, riskReductionPct),
    networkRiskBefore: riskBefore,
    networkRiskAfter: riskAfter,
    healthScoreBefore: currentRisk.OVERALL_SECURITY_SCORE,
    healthScoreAfter: updatedRisk.OVERALL_SECURITY_SCORE,
    simulationId: simRecord.SIMULATION_ID,
    updatedPaths,
    updatedRisk
  };
}

module.exports = {
  simulateDefense
};
