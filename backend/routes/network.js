const express = require('express');
const router = express.Router();
const networkController = require('../controllers/networkController');

router.get('/topology', networkController.getTopology);

module.exports = router;
