const db = require('../database/db');

async function getAttackTechniques(req, res) {
  try {
    const techniques = await db.getAttackTechniques();
    const paths = await db.getAttackPaths();
    const assets = await db.getAssets();

    // Group by MITRE Tactic
    const matrix = {
      'Initial Access': [],
      'Execution': [],
      'Persistence': [],
      'Privilege Escalation': [],
      'Credential Access': [],
      'Discovery': [],
      'Lateral Movement': [],
      'Collection': [],
      'Exfiltration': []
    };

    techniques.forEach(t => {
      const mappedPaths = paths.filter(p => p.MITRE_TECHNIQUES?.includes(t.TECHNIQUE_ID));
      const entry = {
        ...t,
        predictedPathsCount: mappedPaths.length,
        paths: mappedPaths.map(p => ({ id: p.PATH_ID, name: p.NAME, risk: p.RISK_SCORE }))
      };

      if (matrix[t.TACTIC]) {
        matrix[t.TACTIC].push(entry);
      } else {
        matrix['Initial Access'].push(entry);
      }
    });

    res.json({
      success: true,
      count: techniques.length,
      data: techniques,
      matrix
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getAttackTechniques
};
