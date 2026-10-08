/**
 * Explainable AI (XAI) Dynamic Explanation Engine
 * Synthesizes natural language causal justifications and decomposes risk drivers
 * for predicted attack trajectories.
 */

function generateExplanation(pathData) {
  const { entryAssetId, targetAssetId, steps, vulnIds, riskScore, criticalAssetsAffected } = pathData;

  const reasons = [];

  if (entryAssetId === 'internet') {
    reasons.push('The Perimeter Firewall routes untrusted public traffic directly into DMZ Web Server on port 443.');
    if (vulnIds.includes('CVE-2024-21887') || vulnIds.includes('CVE-2021-44228')) {
      reasons.push('Web Server hosts unpatched critical RCE vulnerabilities (CVE-2024-21887 / Log4j) enabling unauthenticated code execution.');
    }
  } else if (entryAssetId === 'emp-pc') {
    reasons.push('Employee PC in User LAN is susceptible to initial spearphishing compromises and holds cached credentials.');
  } else if (entryAssetId === 'cloud-vpc') {
    reasons.push('Cloud VPC has external microservice API exposure and cross-connect tunnels into the internal network.');
  }

  // Traversal & Segmentation
  if (steps && steps.length > 1) {
    const intermediate = steps.slice(0, -1).map(s => s.TO_ASSET).join(', ');
    reasons.push(`Intermediate hop(s) (${intermediate}) lack zero-trust microsegmentation, allowing pivot connections over trusted RPC/SSH ports.`);
  }

  // Target impact
  if (targetAssetId === 'db-server') {
    reasons.push('The target Oracle Database Server is categorized as a tier-1 Crown Jewel containing enterprise financial ledgers and sensitive PII.');
  } else if (targetAssetId === 'admin-pc') {
    reasons.push('The target Admin Workstation holds domain administrative rights capable of global enterprise infrastructure compromise.');
  }

  // Summary narrative
  let narrative = '';
  if (riskScore >= 80) {
    narrative = `The trajectory from ${entryAssetId} to ${targetAssetId} exhibits acute danger (${riskScore}% risk) because perimeter controls allow unauthenticated reaching of vulnerable exposed services. From there, downstream privilege escalation and unsegmented lateral channels afford adversaries an unimpeded route to compromise enterprise crown jewels.`;
  } else if (riskScore >= 60) {
    narrative = `This trajectory poses substantial risk (${riskScore}%). While certain intermediate hops encounter basic access controls, the presence of exploitable services and high asset criticality enables high-probability traversal.`;
  } else {
    narrative = `This trajectory presents mitigated or moderate risk (${riskScore}%). Active defense controls, patched endpoints, or segmentation boundaries effectively damp adversary propagation across the path.`;
  }

  return {
    narrative,
    factors: reasons,
    riskScore,
    criticalAssetsAffected,
    vulnerabilitiesIdentified: vulnIds
  };
}

module.exports = {
  generateExplanation
};
