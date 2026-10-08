const AI_URL = process.env.AI_ENGINE_URL || 'http://localhost:5005';

class WekaClient {
  async checkHealth() {
    try {
      const resp = await fetch(`${AI_URL}/health`, { signal: AbortSignal.timeout(3000) });
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      return await resp.json();
    } catch (err) {
      return {
        status: 'DISCONNECTED',
        service: 'Weka Cybersecurity AI Engine',
        error: err.message,
        url: AI_URL
      };
    }
  }

  async predict(features) {
    try {
      const resp = await fetch(`${AI_URL}/predict`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(features),
        signal: AbortSignal.timeout(4000)
      });
      if (!resp.ok) throw new Error(`Prediction failed with HTTP ${resp.status}`);
      return await resp.json();
    } catch (err) {
      console.warn(`[WekaClient] AI service warning: ${err.message}. Generating rule-based estimate.`);
      // Lightweight fallback in the rare event AI engine is restarting
      return this.heuristicFallback(features);
    }
  }

  async predictAttackPath(compromisedNodeId, nodes, links, activeAttackType) {
    try {
      const resp = await fetch(`${AI_URL}/predict-attack-path`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          compromisedNodeId,
          nodes,
          links,
          activeAttackType
        }),
        signal: AbortSignal.timeout(4000)
      });
      if (!resp.ok) throw new Error(`Attack path prediction failed with HTTP ${resp.status}`);
      return await resp.json();
    } catch (err) {
      console.warn(`[WekaClient] Attack path prediction warning: ${err.message}`);
      return {
        compromisedNodeId,
        activeAttackType,
        predictedNextHops: []
      };
    }
  }

  async retrain() {
    try {
      const resp = await fetch(`${AI_URL}/retrain`, {
        method: 'POST',
        signal: AbortSignal.timeout(10000)
      });
      return await resp.json();
    } catch (err) {
      return { error: err.message };
    }
  }

  heuristicFallback(features) {
    let prediction = 'NORMAL';
    let confidence = 90.0;
    let riskScore = 15.0;

    if (features.serror_rate > 0.6 || features.count > 300) {
      prediction = 'DOS_SYN_FLOOD';
      confidence = 94.0;
      riskScore = 85.0;
    } else if (features.failed_logins >= 5) {
      prediction = 'BRUTE_FORCE';
      confidence = 96.0;
      riskScore = 80.0;
    } else if (features.rerror_rate > 0.7) {
      prediction = 'PORT_SCAN';
      confidence = 92.0;
      riskScore = 65.0;
    } else if (features.src_bytes > 5000000) {
      prediction = 'DATA_EXFILTRATION';
      confidence = 95.0;
      riskScore = 90.0;
    }

    const riskLevel = riskScore >= 80 ? 'CRITICAL' : riskScore >= 60 ? 'HIGH' : riskScore >= 35 ? 'MEDIUM' : 'LOW';

    return {
      prediction,
      confidence,
      risk_score: riskScore,
      risk_level: riskLevel,
      indicators: [`Heuristic evaluation: ${prediction}`],
      mitigation_recommendation: 'Evaluate node firewall rules and inspect active process tree.',
      timestamp: Date.now()
    };
  }
}

module.exports = new WekaClient();
