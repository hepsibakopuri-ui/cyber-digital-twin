const express = require('express');
const router = express.Router();
const predictionController = require('../controllers/predictionController');

router.get('/', predictionController.getAttackPaths);
router.post('/predict', predictionController.predictPaths);

module.exports = router;
