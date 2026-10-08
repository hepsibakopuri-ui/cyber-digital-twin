const express = require('express');
const router = express.Router();
const telemetrySimulator = require('../services/telemetrySimulator');

const SCENARIOS = [
  {
    id: 'DOS_SYN_FLOOD',
    name: 'DDoS SYN Flood Attack',
    category: 'Denial of Service',
    description: 'Saturates the target network service with half-open TCP SYN handshakes, inflating serror_rate and connection counts.',
    defaultTarget: 'node-dmz-web',
    mitigation: 'SYN Cookies, Rate Limiting at Perimeter Firewall'
  },
  {
    id: 'PORT_SCAN',
    name: 'Stealth Reconnaissance & Port Scan',
    category: 'Probing & Recon',
    description: 'Rapid systematic sweeps across sequential ports to identify exposed services, triggering high reject (REJ) error rates.',
    defaultTarget: 'node-api-gateway',
    mitigation: 'Blacklist source IP on edge firewall'
  },
  {
    id: 'BRUTE_FORCE',
    name: 'Credential Stuffing / SSH Brute Force',
    category: 'Unauthorized Access',
    description: 'Automated dictionary attack generating high volumes of failed login attempts on authentication endpoints.',
    defaultTarget: 'node-workstation-alpha',
    mitigation: 'Enforce MFA, lockout IP, and terminate unauthenticated sessions'
  },
  {
    id: 'LATERAL_MOVEMENT',
    name: 'Internal Lateral Movement (Pass-The-Hash)',
    category: 'Post-Exploitation',
    description: 'Adversary leverages stolen Kerberos tokens or SMB/RPC exploits to hop from user workstations toward Domain Controllers and Database.',
    defaultTarget: 'node-domain-ctrl',
    mitigation: 'VLAN Micro-segmentation, revoke domain tokens'
  },
  {
    id: 'DATA_EXFILTRATION',
    name: 'Covert Data Exfiltration',
    category: 'Data Theft',
    description: 'Large outbound payload transmission dumping sensitive database records to an untrusted external IP.',
    defaultTarget: 'node-oracle-db',
    mitigation: 'DLP egress block, sever external connection'
  },
  {
    id: 'RANSOMWARE_SPREAD',
    name: 'Enterprise Ransomware Propagation',
    category: 'Destructive Malware',
    description: 'Automated worm-like propagation sweeping SMB shares with anomalous file modification payloads.',
    defaultTarget: 'node-workstation-alpha',
    mitigation: 'Subnet isolation, freeze network shares, initiate twin snapshot recovery'
  }
];

router.get('/scenarios', (req, res) => {
  res.json({
    activeScenario: telemetrySimulator.activeScenario,
    targetNodeId: telemetrySimulator.targetNodeId,
    scenarios: SCENARIOS
  });
});

router.post('/start', (req, res) => {
  const { scenario, targetNodeId } = req.body;
  telemetrySimulator.setScenario(scenario, targetNodeId);
  res.json({
    message: `Scenario '${scenario}' started`,
    activeScenario: telemetrySimulator.activeScenario,
    targetNodeId: telemetrySimulator.targetNodeId
  });
});

router.post('/stop', (req, res) => {
  telemetrySimulator.setScenario('BASELINE_NORMAL');
  res.json({
    message: 'Attack simulation stopped. Reverted to BASELINE_NORMAL',
    activeScenario: 'BASELINE_NORMAL'
  });
});

module.exports = router;
