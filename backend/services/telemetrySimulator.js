const digitalTwinEngine = require('./digitalTwinEngine');
const wekaClient = require('./wekaClient');
const oracle = require('../config/oracle');
const mobileAlertService = require('./mobileAlertService');

class TelemetrySimulator {
  constructor() {
    this.activeScenario = 'BASELINE_NORMAL';
    this.scenarioTimer = null;
    this.simulationInterval = null;
    this.subscribers = new Set();
    this.attackProgress = 0;
    this.targetNodeId = null;
  }

  start(intervalMs = 1500) {
    if (this.simulationInterval) clearInterval(this.simulationInterval);

    this.simulationInterval = setInterval(async () => {
      try {
        await this.generateTelemetryTick();
      } catch (err) {
        console.error('[Simulator] Telemetry tick error:', err.message);
      }
    }, intervalMs);

    console.log('[Simulator] Real-time telemetry generator started.');
  }

  stop() {
    if (this.simulationInterval) clearInterval(this.simulationInterval);
    if (this.scenarioTimer) clearTimeout(this.scenarioTimer);
  }

  addSubscriber(ws) {
    this.subscribers.add(ws);
  }

  removeSubscriber(ws) {
    this.subscribers.delete(ws);
  }

  broadcast(message) {
    const data = JSON.stringify(message);
    this.subscribers.forEach(client => {
      if (client.readyState === 1) { // WebSocket.OPEN
        client.send(data);
      }
    });
  }

  setScenario(scenarioName, targetNodeId = null) {
    this.activeScenario = scenarioName;
    this.attackProgress = 0;
    this.targetNodeId = targetNodeId;

    if (scenarioName !== 'BASELINE_NORMAL') {
      console.log(`[Simulator] Attack scenario launched: ${scenarioName} targeting ${targetNodeId || 'auto'}`);

      // Auto revert to baseline after 45 seconds if no mitigation applied
      if (this.scenarioTimer) clearTimeout(this.scenarioTimer);
      this.scenarioTimer = setTimeout(() => {
        console.log(`[Simulator] Attack scenario completed/timeout: reverting to baseline.`);
        this.activeScenario = 'BASELINE_NORMAL';
        this.attackProgress = 0;
      }, 45000);
    }
  }

  async generateTelemetryTick() {
    const topology = digitalTwinEngine.getTopology();
    const packet = this.craftTelemetryPacket(topology);

    // Query Weka AI Engine for real-time attack prediction
    const prediction = await wekaClient.predict(packet);

    // Attach node information
    packet.prediction = prediction.prediction;
    packet.confidence = prediction.confidence;
    packet.risk_score = prediction.risk_score;
    packet.risk_level = prediction.risk_level;
    packet.probabilities = prediction.probabilities;
    packet.indicators = prediction.indicators;
    packet.mitigation_recommendation = prediction.mitigation_recommendation;

    // Update Digital Twin Node Status based on prediction
    if (packet.risk_level === 'CRITICAL' || packet.risk_level === 'HIGH') {
      const currentNode = digitalTwinEngine.getNode(packet.nodeId);
      if (currentNode && currentNode.status !== 'QUARANTINED') {
        const newStatus = packet.risk_score > 85 ? 'COMPROMISED' : 'UNDER_ATTACK';
        digitalTwinEngine.setNodeStatus(packet.nodeId, newStatus);

        // Record security incident in Oracle DB
        await oracle.recordIncident({
          nodeId: packet.nodeId,
          attackType: packet.prediction,
          severity: packet.risk_level,
          mitigation: packet.mitigation_recommendation
        });

        // Dispatch instant alert to Mobile
        await mobileAlertService.sendMobileAlert({
          attackType: packet.prediction,
          nodeName: currentNode.name,
          nodeId: currentNode.id,
          ip: currentNode.ip,
          severity: packet.risk_level,
          confidence: packet.confidence,
          riskScore: packet.risk_score,
          indicators: packet.indicators,
          mitigation: packet.mitigation_recommendation
        });
      }
    }

    // Persist to Oracle Database
    await oracle.recordTelemetry(packet);
    await oracle.recordPrediction(packet);

    // Compute updated attack path forecast if a node is compromised
    let attackPathForecast = [];
    const compromised = topology.nodes.find(n => n.status === 'COMPROMISED' || n.status === 'UNDER_ATTACK');
    if (compromised) {
      const pathResult = await wekaClient.predictAttackPath(
        compromised.id,
        topology.nodes,
        topology.links,
        packet.prediction
      );
      attackPathForecast = pathResult.predictedNextHops || [];
    }

    // Broadcast to WebSocket UI clients
    this.broadcast({
      type: 'TELEMETRY_STREAM',
      telemetry: packet,
      prediction,
      attackPathForecast,
      topology: digitalTwinEngine.getTopology(),
      activeScenario: this.activeScenario,
      timestamp: Date.now()
    });
  }

  craftTelemetryPacket(topology) {
    this.attackProgress = Math.min(100, this.attackProgress + 8);

    switch (this.activeScenario) {
      case 'DOS_SYN_FLOOD': {
        const target = this.targetNodeId || 'node-dmz-web';
        return {
          nodeId: target,
          protocol_type: 'tcp',
          service: 'http',
          flag: 'S0',
          duration: 0,
          src_bytes: 0,
          dst_bytes: 0,
          count: 350 + Math.floor(Math.random() * 250),
          serror_rate: 0.95 + (Math.random() * 0.05),
          rerror_rate: 0.0,
          failed_logins: 0,
          logged_in: 0,
          num_compromised: 0,
          same_srv_rate: 1.0,
          diff_srv_rate: 0.0,
          dst_host_count: 255,
          dst_host_srv_count: 8,
          packet_entropy: 1.1 + (Math.random() * 0.3)
        };
      }

      case 'PORT_SCAN': {
        const target = this.targetNodeId || 'node-api-gateway';
        return {
          nodeId: target,
          protocol_type: 'tcp',
          service: 'echo',
          flag: 'REJ',
          duration: 0,
          src_bytes: 0,
          dst_bytes: 0,
          count: 180 + Math.floor(Math.random() * 50),
          serror_rate: 0.0,
          rerror_rate: 0.94 + (Math.random() * 0.05),
          failed_logins: 0,
          logged_in: 0,
          num_compromised: 0,
          same_srv_rate: 0.04,
          diff_srv_rate: 0.96,
          dst_host_count: 255,
          dst_host_srv_count: 2,
          packet_entropy: 1.4 + (Math.random() * 0.4)
        };
      }

      case 'BRUTE_FORCE': {
        const target = this.targetNodeId || 'node-workstation-alpha';
        return {
          nodeId: target,
          protocol_type: 'tcp',
          service: 'ssh',
          flag: 'RSTR',
          duration: 1 + Math.floor(Math.random() * 2),
          src_bytes: 140 + Math.floor(Math.random() * 50),
          dst_bytes: 120 + Math.floor(Math.random() * 40),
          count: 40 + Math.floor(Math.random() * 30),
          serror_rate: 0.05,
          rerror_rate: 0.75 + (Math.random() * 0.2),
          failed_logins: 10 + Math.floor(Math.random() * 8),
          logged_in: 0,
          num_compromised: 0,
          same_srv_rate: 1.0,
          diff_srv_rate: 0.0,
          dst_host_count: 60,
          dst_host_srv_count: 60,
          packet_entropy: 4.0 + (Math.random() * 0.3)
        };
      }

      case 'LATERAL_MOVEMENT': {
        const target = this.targetNodeId || 'node-domain-ctrl';
        return {
          nodeId: target,
          protocol_type: 'tcp',
          service: 'smb',
          flag: 'SF',
          duration: 3 + Math.floor(Math.random() * 2),
          src_bytes: 3500 + Math.floor(Math.random() * 1000),
          dst_bytes: 26000 + Math.floor(Math.random() * 8000),
          count: 20 + Math.floor(Math.random() * 8),
          serror_rate: 0.0,
          rerror_rate: 0.0,
          failed_logins: 0,
          logged_in: 1,
          num_compromised: 3 + Math.floor(Math.random() * 3),
          same_srv_rate: 0.7,
          diff_srv_rate: 0.3,
          dst_host_count: 32,
          dst_host_srv_count: 22,
          packet_entropy: 5.8 + (Math.random() * 0.4)
        };
      }

      case 'DATA_EXFILTRATION': {
        const target = this.targetNodeId || 'node-oracle-db';
        return {
          nodeId: target,
          protocol_type: 'tcp',
          service: 'https',
          flag: 'SF',
          duration: 110 + Math.floor(Math.random() * 40),
          src_bytes: 11000000 + Math.floor(Math.random() * 4000000),
          dst_bytes: 1400 + Math.floor(Math.random() * 300),
          count: 2 + Math.floor(Math.random() * 3),
          serror_rate: 0.0,
          rerror_rate: 0.0,
          failed_logins: 0,
          logged_in: 1,
          num_compromised: 1,
          same_srv_rate: 1.0,
          diff_srv_rate: 0.0,
          dst_host_count: 4,
          dst_host_srv_count: 4,
          packet_entropy: 7.9 + (Math.random() * 0.3)
        };
      }

      case 'RANSOMWARE_SPREAD': {
        const target = this.targetNodeId || 'node-workstation-alpha';
        return {
          nodeId: target,
          protocol_type: 'tcp',
          service: 'smb',
          flag: 'SF',
          duration: 7 + Math.floor(Math.random() * 3),
          src_bytes: 65000 + Math.floor(Math.random() * 20000),
          dst_bytes: 220000 + Math.floor(Math.random() * 60000),
          count: 65 + Math.floor(Math.random() * 25),
          serror_rate: 0.07,
          rerror_rate: 0.12,
          failed_logins: 0,
          logged_in: 1,
          num_compromised: 10 + Math.floor(Math.random() * 5),
          same_srv_rate: 0.85,
          diff_srv_rate: 0.15,
          dst_host_count: 100,
          dst_host_srv_count: 70,
          packet_entropy: 9.1 + (Math.random() * 0.4)
        };
      }

      case 'BASELINE_NORMAL':
      default: {
        const randomNode = topology.nodes[Math.floor(Math.random() * topology.nodes.length)];
        const services = ['https', 'http', 'sql_oracle', 'dns', 'ssh'];
        const svc = services[Math.floor(Math.random() * services.length)];

        return {
          nodeId: randomNode.id,
          protocol_type: svc === 'dns' ? 'udp' : 'tcp',
          service: svc,
          flag: 'SF',
          duration: Math.floor(Math.random() * 2),
          src_bytes: 200 + Math.floor(Math.random() * 500),
          dst_bytes: 1200 + Math.floor(Math.random() * 4000),
          count: 2 + Math.floor(Math.random() * 8),
          serror_rate: 0.0,
          rerror_rate: 0.0,
          failed_logins: 0,
          logged_in: 1,
          num_compromised: 0,
          same_srv_rate: 1.0,
          diff_srv_rate: 0.0,
          dst_host_count: 10 + Math.floor(Math.random() * 30),
          dst_host_srv_count: 10 + Math.floor(Math.random() * 25),
          packet_entropy: 3.1 + (Math.random() * 0.8)
        };
      }
    }
  }
}

module.exports = new TelemetrySimulator();
