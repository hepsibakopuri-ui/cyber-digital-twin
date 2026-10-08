const express = require('express');
const os = require('os');
const router = express.Router();
const mobileAlertService = require('../services/mobileAlertService');

// Get current mobile alert configuration
router.get('/config', (req, res) => {
  res.json(mobileAlertService.getConfig());
});

// Update mobile alert settings
router.post('/config', (req, res) => {
  const updated = mobileAlertService.updateConfig(req.body);
  res.json({ message: 'Mobile alert configuration saved', config: updated });
});

// Send immediate test alert to mobile
router.post('/test', async (req, res) => {
  const result = await mobileAlertService.sendTestAlert();
  res.json({ message: 'Test mobile alert triggered', result });
});

// Discover local network IP for mobile browser connection
router.get('/network-info', (req, res) => {
  const interfaces = os.networkInterfaces();
  const addresses = [];

  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          interface: name,
          ip: iface.address,
          url: `http://${iface.address}:3000`
        });
      }
    }
  }

  res.json({
    localIp: addresses.length > 0 ? addresses[0].ip : 'localhost',
    mobileUrl: addresses.length > 0 ? addresses[0].url : 'http://localhost:3000',
    allInterfaces: addresses
  });
});

module.exports = router;
