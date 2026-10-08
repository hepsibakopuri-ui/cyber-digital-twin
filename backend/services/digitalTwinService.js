const db = require('../database/db');

async function getTopology() {
  const assets = await db.getAssets();
  const connections = await db.getConnections();
  const vulnerabilities = await db.getAssetVulnerabilities();

  // Enhance nodes with vulnerability details & degree
  const nodes = assets.map(asset => {
    const nodeVulns = vulnerabilities.filter(v => v.ASSET_ID === asset.ASSET_ID);
    const connectedEdges = connections.filter(
      c => c.SOURCE_ASSET_ID === asset.ASSET_ID || c.TARGET_ASSET_ID === asset.ASSET_ID
    );

    return {
      id: asset.ASSET_ID,
      name: asset.NAME,
      deviceType: asset.DEVICE_TYPE,
      ipAddress: asset.IP_ADDRESS,
      operatingSystem: asset.OPERATING_SYSTEM,
      zone: asset.ZONE,
      criticality: asset.CRITICALITY,
      securityState: asset.SECURITY_STATE,
      openPorts: asset.OPEN_PORTS ? asset.OPEN_PORTS.split(',').map(p => p.trim()) : [],
      vulnerabilityCount: nodeVulns.length,
      vulnerabilities: nodeVulns,
      riskScore: Number(asset.RISK_SCORE || 0),
      connectedDevicesCount: connectedEdges.length,
      position: { x: Number(asset.POSITION_X || 100), y: Number(asset.POSITION_Y || 100) },
      lastUpdated: asset.LAST_UPDATED
    };
  });

  const edges = connections.map(conn => ({
    id: `edge-${conn.SOURCE_ASSET_ID}-${conn.TARGET_ASSET_ID}`,
    connectionId: conn.CONNECTION_ID,
    source: conn.SOURCE_ASSET_ID,
    target: conn.TARGET_ASSET_ID,
    protocol: conn.PROTOCOL,
    port: conn.PORT,
    bandwidthMbps: conn.BANDWIDTH_MBPS,
    isEncrypted: conn.IS_ENCRYPTED === 'Y',
    isExposed: conn.IS_EXPOSED === 'Y',
    status: conn.STATUS
  }));

  return { nodes, edges };
}

async function getAssetDetails(assetId) {
  const asset = await db.getAssetById(assetId);
  if (!asset) return null;

  const vulns = await db.getAssetVulnerabilities(assetId);
  const connections = await db.getConnections();
  const techniques = await db.getAttackTechniques();

  const connected = connections
    .filter(c => c.SOURCE_ASSET_ID === assetId || c.TARGET_ASSET_ID === assetId)
    .map(c => (c.SOURCE_ASSET_ID === assetId ? c.TARGET_ASSET_ID : c.SOURCE_ASSET_ID));

  // Determine potential techniques against this asset based on open ports & OS
  const relevantTechniques = techniques.filter(t => {
    if (asset.OPEN_PORTS?.includes('443') && t.TECHNIQUE_ID === 'T1190') return true;
    if (asset.OPEN_PORTS?.includes('3389') && t.TECHNIQUE_ID === 'T1021') return true;
    if (asset.OPEN_PORTS?.includes('22') && t.TECHNIQUE_ID === 'T1021') return true;
    if (asset.OPEN_PORTS?.includes('445') && t.TECHNIQUE_ID === 'T1003') return true;
    if (t.TECHNIQUE_ID === 'T1059') return true;
    return false;
  });

  return {
    ...asset,
    openPorts: asset.OPEN_PORTS ? asset.OPEN_PORTS.split(',').map(p => p.trim()) : [],
    vulnerabilities: vulns,
    connectedDevices: [...new Set(connected)],
    possibleAttackTechniques: relevantTechniques
  };
}

module.exports = {
  getTopology,
  getAssetDetails
};
