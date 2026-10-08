const db = require('../database/db');

async function getAlerts(req, res) {
  try {
    const filter = req.query.severity || 'ALL';
    const alerts = await db.getAlerts(filter);
    res.json({ success: true, count: alerts.length, data: alerts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

async function resolveAlert(req, res) {
  try {
    await db.resolveAlert(req.params.id);
    res.json({ success: true, message: `Alert ${req.params.id} marked as resolved.` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
}

module.exports = {
  getAlerts,
  resolveAlert
};
