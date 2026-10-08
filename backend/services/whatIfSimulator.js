const db = require('../database/db');

async function runSimulation(params) {
  const {
    entryPoint = 'internet',
    targetAsset = 'db-server',
    vulnerabilityId = 'CVE-2024-21887',
    securityControlState = 'DEFAULT'
  } = params;

  const assets = await db.getAssets();
  const connections = await db.getConnections();
  const vulns = await db.getVulnerabilities();
  const controls = await db.getSecurityControls();
  const techniques = await db.getAttackTechniques();

  const assetMap = new Map(assets.map(a => [a.ASSET_ID, a]));

  // Determine path hops based on entryPoint and targetAsset
  let sequence = [];
  if (entryPoint === 'internet' && targetAsset === 'db-server') {
    sequence = ['internet', 'fw-ext', 'web-server', 'app-server', 'db-server'];
  } else if (entryPoint === 'emp-pc' && targetAsset === 'admin-pc') {
    sequence = ['emp-pc', 'admin-pc'];
  } else if (entryPoint === 'emp-pc' && targetAsset === 'db-server') {
    sequence = ['emp-pc', 'fw-int', 'app-server', 'db-server'];
  } else if (entryPoint === 'cloud-vpc' && targetAsset === 'db-server') {
    sequence = ['cloud-vpc', 'fw-int', 'app-server', 'db-server'];
  } else {
    // Default fallback sequence
    sequence = [entryPoint, 'app-server', targetAsset];
  }

  // Check if simulation is blocked by security control state
  const isWebPatched = securityControlState === 'PATCHED_WEB';
  const isSegEnabled = securityControlState === 'SEGMENTATION_ENABLED';

  const stages = [];
  let isBlocked = false;
  let blockedAt = null;
  let cumulativeRisk = 20;

  for (let i = 0; i < sequence.length - 1; i++) {
    const fromNode = sequence[i];
    const toNode = sequence[i + 1];
    const targetAssetObj = assetMap.get(toNode);

    let technique = techniques[0];
    let actionDesc = `Attacker probes and initiates connection toward ${targetAssetObj?.NAME || toNode}.`;
    let status = 'SUCCESS';

    if (i === 0 && fromNode === 'internet') {
      technique = techniques.find(t => t.TECHNIQUE_ID === 'T1190') || techniques[0];
      actionDesc = `Public IP probing and port enumeration on ${targetAssetObj?.NAME || toNode}.`;
      cumulativeRisk += 15;
    } else if (toNode === 'web-server') {
      technique = techniques.find(t => t.TECHNIQUE_ID === 'T1190') || techniques[0];
      if (isWebPatched) {
        status = 'BLOCKED';
        isBlocked = true;
        blockedAt = 'web-server';
        actionDesc = `Exploit payload intercepted: CVE-2024-21887 patch dropped hostile request on port 443.`;
        cumulativeRisk = Math.max(15, cumulativeRisk - 10);
      } else {
        actionDesc = `Exploitation of ${vulnerabilityId}: Injected command execution shell established on Web Server.`;
        cumulativeRisk += 35;
      }
    } else if (fromNode === 'web-server' && (toNode === 'app-server' || toNode === 'fw-int')) {
      technique = techniques.find(t => t.TECHNIQUE_ID === 'T1021') || techniques[1];
      if (isSegEnabled) {
        status = 'BLOCKED';
        isBlocked = true;
        blockedAt = 'fw-int';
        actionDesc = `Zero-trust microsegmentation dropped cross-subnet traversal packets from DMZ.`;
        cumulativeRisk = Math.max(25, cumulativeRisk - 15);
      } else {
        actionDesc = `Lateral movement over unsegmented internal interface into Tomcat Application Server.`;
        cumulativeRisk += 25;
      }
    } else if (toNode === 'admin-pc') {
      technique = techniques.find(t => t.TECHNIQUE_ID === 'T1003') || techniques[4];
      actionDesc = `LSASS memory dumping and Kerberos ticket harvest deployed against privileged Admin host.`;
      cumulativeRisk += 20;
    } else if (toNode === 'db-server') {
      technique = techniques.find(t => t.TECHNIQUE_ID === 'T1048') || techniques[5];
      actionDesc = `Arbitrary SQL queries injected; customer PII and database dump staging initiated.`;
      cumulativeRisk += 15;
    }

    stages.push({
      stepNumber: i + 1,
      fromAsset: fromNode,
      toAsset: toNode,
      fromAssetName: assetMap.get(fromNode)?.NAME || fromNode,
      toAssetName: targetAssetObj?.NAME || toNode,
      techniqueId: technique.TECHNIQUE_ID,
      techniqueName: technique.NAME,
      action: actionDesc,
      status: status, // 'SUCCESS' or 'BLOCKED'
      currentRisk: Math.min(98, cumulativeRisk),
      timeOffsetMs: i * 850
    });

    if (isBlocked) break;
  }

  const finalRisk = isBlocked ? Math.min(45, cumulativeRisk) : Math.min(95, cumulativeRisk);
  const outcome = isBlocked ? 'ATTACK_BLOCKED' : 'BREACH_SIMULATED';

  const criticalAssetsExposed = isBlocked
    ? []
    : sequence.filter(nodeId => {
        const a = assetMap.get(nodeId);
        return a && (a.CRITICALITY === 'CRITICAL' || a.CRITICALITY === 'HIGH');
      });

  // Record simulation in history
  await db.saveSimulation({
    SIMULATION_NAME: `What-If: ${entryPoint} → ${targetAsset}`,
    ENTRY_POINT: entryPoint,
    TARGET_ASSET: targetAsset,
    DEFENSE_APPLIED: isBlocked ? securityControlState : 'None (Simulated Attack)',
    RISK_BEFORE: 91.0,
    RISK_AFTER: finalRisk,
    RISK_REDUCTION_PCT: isBlocked ? 50.5 : 0.0,
    OUTCOME: outcome
  });

  return {
    entryPoint,
    targetAsset,
    stages,
    isBlocked,
    blockedAt,
    finalRisk,
    outcome,
    pathString: sequence.map(id => assetMap.get(id)?.NAME || id).join(' → '),
    criticalAssetsExposed: criticalAssetsExposed.map(id => assetMap.get(id)?.NAME || id)
  };
}

module.exports = {
  runSimulation
};
