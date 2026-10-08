const express = require('express');
const router = express.Router();
const riskController = require('../controllers/riskController');

router.get('/', riskController.getNetworkRisk);
router.get('/assets/:id', riskController.getAssetRisk);
router.post('/recalculate', riskController.recalculate);

module.exports = router;
