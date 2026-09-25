
const express = require('express');
const router = express.Router();
const { getAllZones } = require('../services/cityPulseService');

router.get('/', (req, res) => {
  res.json(getAllZones());
});

module.exports = router;