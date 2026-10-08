const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

router.post('/', simulationController.runWhatIfSimulation);
router.get('/', simulationController.getSimulationHistory);
router.get('/:id', simulationController.getSimulationById);

module.exports = router;
