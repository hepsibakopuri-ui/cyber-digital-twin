// Digital Twin State Engine for Network Topology & Cyber Resilience
class DigitalTwinEngine {
  constructor() {
    this.nodes = [
      {
        id: 'node-firewall',
        name: 'Perimeter Firewall FW-01',
        ip: '10.0.0.1',
        type: 'FIREWALL',
        os: 'FortiOS 7.2',
        vulnerabilityScore: 2.1,
        status: 'NORMAL',
        zone: 'PERIMETER',
        x: 100,
        y: 220,
        openPorts: [80, 443]
      },
      {
        id: 'node-dmz-web',
        name: 'DMZ Public Web Server',
        ip: '10.0.1.10',
        type: 'WEB_SERVER',
        os: 'Ubuntu Linux 22.04 LTS',
        vulnerabilityScore: 6.8,
        status: 'NORMAL',
        zone: 'DMZ',
        x: 320,
        y: 120,
        openPorts: [80, 443, 8080]
      },
      {
        id: 'node-api-gateway',
        name: 'Core API Gateway',
        ip: '10.0.1.20',
        type: 'GATEWAY',
        os: 'Alpine Linux / Envoy',
        vulnerabilityScore: 4.3,
        status: 'NORMAL',
        zone: 'DMZ',
        x: 320,
        y: 320,
        openPorts: [8443, 5000]
      },
      {
        id: 'node-domain-ctrl',
        name: 'Active Directory DC-01',
        ip: '10.0.2.40',
        type: 'DOMAIN_CONTROLLER',
        os: 'Windows Server 2022',
        vulnerabilityScore: 5.2,
        status: 'NORMAL',
        zone: 'CORE_SERVICES',
        x: 560,
        y: 120,
        openPorts: [88, 389, 445, 3389]
      },
      {
        id: 'node-oracle-db',
        name: 'Oracle Enterprise Database',
        ip: '10.0.2.30',
        type: 'DATABASE',
        os: 'Oracle Linux 8 / Oracle XE',
        vulnerabilityScore: 3.5,
        status: 'NORMAL',
        zone: 'DATA_ZONE',
        x: 560,
        y: 320,
        openPorts: [1521, 5500]
      },
      {
        id: 'node-workstation-alpha',
        name: 'Finance Workstation Alpha',
        ip: '10.0.3.50',
        type: 'WORKSTATION',
        os: 'Windows 11 Enterprise',
        vulnerabilityScore: 7.4,
        status: 'NORMAL',
        zone: 'USER_LAN',
        x: 780,
        y: 160,
        openPorts: [135, 445, 3389]
      },
      {
        id: 'node-iot-scada',
        name: 'OT / SCADA Gateway',
        ip: '10.0.4.60',
        type: 'IOT_GATEWAY',
        os: 'Embedded Linux / Yocto',
        vulnerabilityScore: 8.1,
        status: 'NORMAL',
        zone: 'OT_FIELD',
        x: 780,
        y: 300,
        openPorts: [502, 1883]
      }
    ];

    this.links = [
      { id: 'l1', source: 'node-firewall', target: 'node-dmz-web', protocol: 'HTTPS/443', bandwidth: 10000, latency: 1, status: 'ACTIVE' },
      { id: 'l2', source: 'node-firewall', target: 'node-api-gateway', protocol: 'HTTPS/8443', bandwidth: 10000, latency: 1, status: 'ACTIVE' },
      { id: 'l3', source: 'node-dmz-web', target: 'node-api-gateway', protocol: 'HTTP/REST', bandwidth: 1000, latency: 2, status: 'ACTIVE' },
      { id: 'l4', source: 'node-api-gateway', target: 'node-oracle-db', protocol: 'SQL*Net/1521', bandwidth: 1000, latency: 2, status: 'ACTIVE' },
      { id: 'l5', source: 'node-domain-ctrl', target: 'node-oracle-db', protocol: 'Kerberos/LDAP', bandwidth: 1000, latency: 1, status: 'ACTIVE' },
      { id: 'l6', source: 'node-workstation-alpha', target: 'node-domain-ctrl', protocol: 'Kerberos/SMB', bandwidth: 1000, latency: 3, status: 'ACTIVE' },
      { id: 'l7', source: 'node-workstation-alpha', target: 'node-api-gateway', protocol: 'HTTPS/443', bandwidth: 1000, latency: 4, status: 'ACTIVE' },
      { id: 'l8', source: 'node-iot-scada', target: 'node-api-gateway', protocol: 'MQTT/TLS', bandwidth: 100, latency: 12, status: 'ACTIVE' }
    ];
  }

  getTopology() {
    return {
      nodes: this.nodes,
      links: this.links,
      resilienceIndex: this.calculateResilienceIndex(),
      totalNodes: this.nodes.length,
      compromisedCount: this.nodes.filter(n => n.status === 'COMPROMISED').length,
      underAttackCount: this.nodes.filter(n => n.status === 'UNDER_ATTACK').length,
      quarantinedCount: this.nodes.filter(n => n.status === 'QUARANTINED').length
    };
  }

  getNode(nodeId) {
    return this.nodes.find(n => n.id === nodeId);
  }

  setNodeStatus(nodeId, status) {
    const node = this.getNode(nodeId);
    if (node) {
      node.status = status;
      // If node is quarantined, sever its connected links
      if (status === 'QUARANTINED') {
        this.links.forEach(l => {
          if (l.source === nodeId || l.target === nodeId) {
            l.status = 'SEVERED';
          }
        });
      } else {
        // Restore links if unquarantined
        this.links.forEach(l => {
          if ((l.source === nodeId || l.target === nodeId) && l.status === 'SEVERED') {
            const otherId = l.source === nodeId ? l.target : l.source;
            const other = this.getNode(otherId);
            if (!other || other.status !== 'QUARANTINED') {
              l.status = 'ACTIVE';
            }
          }
        });
      }
      return node;
    }
    return null;
  }

  patchNodeVulnerability(nodeId, reduction = 3.0) {
    const node = this.getNode(nodeId);
    if (node) {
      node.vulnerabilityScore = Math.max(1.0, Math.round((node.vulnerabilityScore - reduction) * 10) / 10);
      if (node.status === 'COMPROMISED' || node.status === 'UNDER_ATTACK') {
        node.status = 'NORMAL';
      }
      return node;
    }
    return null;
  }

  resetAllNodes() {
    this.nodes.forEach(n => {
      n.status = 'NORMAL';
    });
    this.links.forEach(l => {
      l.status = 'ACTIVE';
    });
    return this.getTopology();
  }

  calculateResilienceIndex() {
    let score = 100.0;
    this.nodes.forEach(node => {
      if (node.status === 'COMPROMISED') {
        score -= (node.type === 'DATABASE' || node.type === 'DOMAIN_CONTROLLER') ? 35 : 18;
      } else if (node.status === 'UNDER_ATTACK') {
        score -= 10;
      } else if (node.status === 'SUSPICIOUS') {
        score -= 4;
      } else if (node.status === 'QUARANTINED') {
        score -= 3; // minimal resilience penalty for deliberate isolation
      }
    });
    return Math.max(5.0, Math.min(100.0, Math.round(score)));
  }
}

module.exports = new DigitalTwinEngine();
