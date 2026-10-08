const digitalTwinEngine = require('./digitalTwinEngine');
const oracle = require('../config/oracle');
const telemetrySimulator = require('./telemetrySimulator');

class MitigationService {
  async applyMitigation(actionType, targetNodeId, attackType = 'GENERIC_THREAT') {
    let message = '';
    let success = true;

    switch (actionType) {
      case 'QUARANTINE_NODE': {
        const node = digitalTwinEngine.setNodeStatus(targetNodeId, 'QUARANTINED');
        if (node) {
          message = `Node ${node.name} (${node.ip}) has been strictly quarantined. Network links severed in the digital twin.`;
          // If this was the active attack target, stop attack
          if (telemetrySimulator.targetNodeId === targetNodeId) {
            telemetrySimulator.setScenario('BASELINE_NORMAL');
          }
        } else {
          success = false;
          message = `Node ${targetNodeId} not found.`;
        }
        break;
      }

      case 'RESTORE_NODE': {
        const node = digitalTwinEngine.setNodeStatus(targetNodeId, 'NORMAL');
        if (node) {
          message = `Node ${node.name} restored to NORMAL. Network links re-established in digital twin.`;
        }
        break;
      }

      case 'BLOCK_IP': {
        message = `Automated Perimeter Firewall rule injected: Source IP blocked and added to threat blacklist.`;
        telemetrySimulator.setScenario('BASELINE_NORMAL');
        break;
      }

      case 'RATE_LIMIT': {
        message = `SYN-Cookie validation and 100 req/s rate-limiting applied across Perimeter Firewall.`;
        if (telemetrySimulator.activeScenario === 'DOS_SYN_FLOOD') {
          telemetrySimulator.setScenario('BASELINE_NORMAL');
        }
        break;
      }

      case 'PATCH_VULNERABILITY': {
        const node = digitalTwinEngine.patchNodeVulnerability(targetNodeId, 3.5);
        if (node) {
          message = `Security patch deployed on ${node.name}. Vulnerability score reduced to ${node.vulnerabilityScore}.`;
        }
        break;
      }

      case 'RESET_TWIN': {
        digitalTwinEngine.resetAllNodes();
        telemetrySimulator.setScenario('BASELINE_NORMAL');
        message = `Digital Twin environment completely normalized. All nodes restored to healthy state.`;
        break;
      }

      default: {
        message = `Defensive measure ${actionType} triggered.`;
      }
    }

    // Persist mitigation rule to Oracle Database
    const rule = await oracle.recordMitigation({
      attackType,
      actionType,
      targetNode: targetNodeId
    });

    return {
      success,
      actionType,
      targetNodeId,
      message,
      rule,
      topology: digitalTwinEngine.getTopology()
    };
  }
}

module.exports = new MitigationService();
