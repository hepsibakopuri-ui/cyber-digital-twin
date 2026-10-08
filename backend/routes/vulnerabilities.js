const express = require('express');
const router = express.Router();
const vulnerabilityController = require('../controllers/vulnerabilityController');

router.get('/', vulnerabilityController.getAllVulnerabilities);
router.post('/:id/patch', vulnerabilityController.patchVulnerability);

module.exports = router;
