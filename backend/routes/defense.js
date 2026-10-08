const express = require('express');
const router = express.Router();
const defenseController = require('../controllers/defenseController');

router.post('/simulate', defenseController.simulateDefenseAction);
router.get('/recommendations', defenseController.getRecommendations);

module.exports = router;
