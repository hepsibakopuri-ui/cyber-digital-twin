const express = require('express');
const router = express.Router();
const mitreController = require('../controllers/mitreController');

router.get('/', mitreController.getAttackTechniques);

module.exports = router;
