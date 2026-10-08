const API_BASE = '/api';

async function fetchJson(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      ...options
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.error || `HTTP error! status: ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`[API] Error on ${endpoint}:`, error.message);
    throw error;
  }
}

export const api = {
  getHealth: () => fetchJson('/health'),
  getTopology: () => fetchJson('/network/topology').then(r => r.data),
  getAssets: () => fetchJson('/assets').then(r => r.data),
  getAssetById: (id) => fetchJson(`/assets/${id}`).then(r => r.data),
  getVulnerabilities: () => fetchJson('/vulnerabilities'),
  patchVulnerability: (id, assetId) => fetchJson(`/vulnerabilities/${id}/patch`, {
    method: 'POST',
    body: JSON.stringify({ assetId })
  }),
  getAttackPaths: () => fetchJson('/attack-paths').then(r => r.data),
  predictAttackPaths: () => fetchJson('/attack-paths/predict', { method: 'POST' }),
  getRiskAssessment: () => fetchJson('/risk').then(r => r.data),
  getAssetRisk: (id) => fetchJson(`/risk/assets/${id}`).then(r => r.data),
  getRecommendations: () => fetchJson('/recommendations').then(r => r.data),
  simulateDefense: (defenseId, params = {}) => fetchJson('/defense/simulate', {
    method: 'POST',
    body: JSON.stringify({ defenseId, ...params })
  }),
  runWhatIfSimulation: (params) => fetchJson('/simulations', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  getSimulationHistory: () => fetchJson('/simulations').then(r => r.data),
  getAlerts: (filter = 'ALL') => fetchJson(`/alerts?severity=${filter}`).then(r => r.data),
  resolveAlert: (id) => fetchJson(`/alerts/${id}/resolve`, { method: 'POST' }),
  getAttackTechniques: () => fetchJson('/attack-techniques'),
  login: (email, password) => fetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }),
  resetSystem: () => fetchJson('/system/reset', { method: 'POST' }),
  testOracle: (params) => fetchJson('/system/oracle-test', {
    method: 'POST',
    body: JSON.stringify(params)
  }),
  getSystemStatus: () => fetchJson('/system/status')
};
