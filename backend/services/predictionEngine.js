const db = require('../database/db');
const explainabilityService = require('./explainabilityService');

/**
 * Intelligent Graph Traversal and Attack Path Prediction Engine
 * Computes multi-hop feasibility from untrusted entry points to internal assets.
 * Evaluates edge traversal probability, vulnerability CVSS, open port exposures,
 * and security controls attenuation.
 */
async function predictAttackPaths() {
  const assets = await db.getAssets();
  const connections = await db.getConnections();
  const vulns = await db.getAssetVulnerabilities();
  const controls = await db.getSecurityControls();
  const techniques = await db.getAttackTechniques();

  const assetMap = new Map(assets.map(a => [a.ASSET_ID, a]));
  const adjacency = new Map();

  // Build graph adjacency list
  connections.forEach(conn => {
    if (!adjacency.has(conn.SOURCE_ASSET_ID)) adjacency.set(conn.SOURCE_ASSET_ID, []);
    adjacency.get(conn.SOURCE_ASSET_ID).push({
      target: conn.TARGET_ASSET_ID,
      protocol: conn.PROTOCOL,
      port: conn.PORT,
      isEncrypted: conn.IS_ENCRYPTED === 'Y',
      status: conn.STATUS
    });
  });

  // Candidate entry points (external gateway, user workstations, cloud vpc)
  const entryPoints = ['internet', 'emp-pc', 'cloud-vpc'];
  // Primary critical targets (Crown Jewel Database, Admin Workstation)
  const targets = ['db-server', 'admin-pc'];

  const discoveredPaths = [];

  // DFS traversal to locate paths up to max 4 hops
  function findPaths(current, target, visited, currentPath) {
    if (currentPath.length > 4) return;
    if (current === target && currentPath.length > 1) {
      discoveredPaths.push([...currentPath]);
      return;
    }

    const neighbors = adjacency.get(current) || [];
    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.target)) {
        visited.add(neighbor.target);
        currentPath.push({
          from: current,
          to: neighbor.target,
          port: neighbor.port,
          protocol: neighbor.protocol
        });

        findPaths(neighbor.target, target, visited, currentPath);

        currentPath.pop();
        visited.delete(neighbor.target);
      }
    }
  }

  entryPoints.forEach(entry => {
    targets.forEach(target => {
      if (entry !== target) {
        const visited = new Set([entry]);
        findPaths(entry, target, visited, []);
      }
    });
  });

  // Score each discovered path
  const evaluatedPaths = [];
  let pathCounter = 1;

  for (const pathSteps of discoveredPaths) {
    const pathId = `PATH-0${pathCounter++}`;
    const entryAssetId = pathSteps[0].from;
    const targetAssetId = pathSteps[pathSteps.length - 1].to;

    let pathRiskAccumulator = 0;
    let pathConfidenceAccumulator = 100;
    const pathVulns = [];
    const pathTechniques = [];
    const enrichedSteps = [];
    let criticalAssetsCount = 0;

    for (let i = 0; i < pathSteps.length; i++) {
      const step = pathSteps[i];
      const fromAsset = assetMap.get(step.from);
      const toAsset = assetMap.get(step.to);

      if (toAsset && (toAsset.CRITICALITY === 'CRITICAL' || toAsset.CRITICALITY === 'HIGH')) {
        criticalAssetsCount++;
      }

      // Check unpatched vulnerabilities on target node of this step
      const stepVulns = vulns.filter(v => v.ASSET_ID === step.to && v.STATUS !== 'PATCHED');
      stepVulns.forEach(v => {
        if (!pathVulns.includes(v.VULN_ID)) pathVulns.push(v.VULN_ID);
      });

      // Match MITRE Technique
      let technique = techniques[0];
      if (i === 0 && entryAssetId === 'internet') {
        technique = techniques.find(t => t.TECHNIQUE_ID === 'T1190') || techniques[0];
      } else if (entryAssetId === 'emp-pc' && i === 0) {
        technique = techniques.find(t => t.TECHNIQUE_ID === 'T1566') || techniques[0];
      } else if (toAsset?.DEVICE_TYPE === 'Database Server') {
        technique = techniques.find(t => t.TECHNIQUE_ID === 'T1048') || techniques[1];
      } else if (toAsset?.DEVICE_TYPE === 'Workstation') {
        technique = techniques.find(t => t.TECHNIQUE_ID === 'T1003') || techniques[3];
      } else {
        technique = techniques.find(t => t.TECHNIQUE_ID === 'T1021') || techniques[1];
      }

      if (!pathTechniques.includes(technique.TECHNIQUE_ID)) {
        pathTechniques.push(technique.TECHNIQUE_ID);
      }

      // Calculate step-level risk
      const topCvss = stepVulns.length > 0 ? Math.max(...stepVulns.map(v => Number(v.CVSS_SCORE || 5.0))) : 4.0;
      let stepRisk = topCvss * 9.5;

      // Attenuate if security controls are active on intermediate hops
      const assetControls = controls.filter(c => c.APPLIED_TO_ASSET === step.to && c.STATUS === 'ACTIVE');
      if (assetControls.length > 0) {
        stepRisk *= 0.7;
        pathConfidenceAccumulator -= 8;
      }

      stepRisk = Math.min(99, Math.max(20, Math.round(stepRisk)));

      enrichedSteps.push({
        STEP_ORDER: i + 1,
        FROM_ASSET: step.from,
        TO_ASSET: step.to,
        TECHNIQUE_ID: technique.TECHNIQUE_ID,
        VULN_ID: stepVulns[0]?.VULN_ID || null,
        STEP_RISK: stepRisk,
        DESCRIPTION: `Traversal from ${fromAsset?.NAME || step.from} to ${toAsset?.NAME || step.to} via ${technique.NAME}.`
      });

      pathRiskAccumulator += stepRisk;
    }

    // Composite path risk calculation
    const baseRisk = pathRiskAccumulator / enrichedSteps.length;
    // Hop penalty (longer paths have higher chance of detection, slightly lower cumulative success)
    const hopFactor = Math.pow(0.96, enrichedSteps.length - 1);
    let finalPathRisk = Math.round(baseRisk * hopFactor * 10) / 10;

    // Check if key defenses are active (e.g. segmentation or patched web server)
    const webPatch = vulns.find(v => v.ASSET_ID === 'web-server' && v.VULN_ID === 'CVE-2024-21887' && v.STATUS === 'PATCHED');
    const segActive = controls.find(c => c.CONTROL_TYPE === 'Network Segmentation' && c.STATUS === 'ACTIVE');

    if (entryAssetId === 'internet' && webPatch) {
      finalPathRisk = Math.round(finalPathRisk * 0.5 * 10) / 10;
    }
    if (segActive && pathSteps.some(s => s.to === 'db-server' || s.from === 'web-server')) {
      finalPathRisk = Math.round(finalPathRisk * 0.65 * 10) / 10;
    }

    const confidenceScore = Math.max(60, Math.min(98, Math.round(pathConfidenceAccumulator)));

    // Derive priority
    let priority = 'LOW';
    if (finalPathRisk >= 85) priority = 'CRITICAL';
    else if (finalPathRisk >= 70) priority = 'HIGH';
    else if (finalPathRisk >= 50) priority = 'MEDIUM';

    // Status: BLOCKED if risk < 35 or key control blocks it, else ACTIVE
    const status = finalPathRisk < 40 ? 'BLOCKED' : 'ACTIVE';

    // Explainable AI explanation dynamically generated
    const explanation = explainabilityService.generateExplanation({
      entryAssetId,
      targetAssetId,
      steps: enrichedSteps,
      vulnIds: pathVulns,
      riskScore: finalPathRisk,
      criticalAssetsAffected: criticalAssetsCount
    });

    const pathName = `${assetMap.get(entryAssetId)?.NAME || entryAssetId} → ${assetMap.get(targetAssetId)?.NAME || targetAssetId} (${enrichedSteps.length} Hops)`;

    evaluatedPaths.push({
      PATH_ID: pathId,
      NAME: pathName,
      ENTRY_POINT: entryAssetId,
      TARGET_ASSET: targetAssetId,
      HOP_COUNT: enrichedSteps.length,
      RISK_SCORE: finalPathRisk,
      CONFIDENCE_SCORE: confidenceScore,
      VULNERABILITY_COUNT: pathVulns.length,
      CRITICAL_ASSETS_AFFECTED: criticalAssetsCount,
      MITRE_TECHNIQUES: pathTechniques,
      PRIORITY: priority,
      STATUS: status,
      EXPLANATION: explanation,
      STEPS: enrichedSteps
    });
  }

  // Sort paths from highest to lowest risk
  evaluatedPaths.sort((a, b) => b.RISK_SCORE - a.RISK_SCORE);

  await db.saveAttackPaths(evaluatedPaths);
  return evaluatedPaths;
}

module.exports = {
  predictAttackPaths
};
