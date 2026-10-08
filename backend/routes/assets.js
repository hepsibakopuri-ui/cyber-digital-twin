const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');

router.get('/', assetController.getAllAssets);
router.get('/:id', assetController.getAssetById);
router.post('/:id', assetController.updateAsset);

module.exports = router;
