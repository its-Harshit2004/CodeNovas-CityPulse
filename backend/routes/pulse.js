
const express = require('express');
const router = express.Router();
const { getZonePulse } = require('../services/cityPulseService');
router.get('/:zoneId', async (req, res) => {
  try {
    const data = await getZonePulse(req.params.zoneId);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching zone pulse data' });
  }
});

module.exports = router;