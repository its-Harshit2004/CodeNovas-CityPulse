
const express = require('express');
const router = express.Router();
const { getZonePulse } = require('../services/cityPulseService');
router.get('/:zoneId', async (req, res) => {
  try {
    const data = await getZonePulse(req.params.zoneId);
    res.json(data);
  } catch (error) {
    if (error.message === 'Zone not found') {
      return res.status(404).json({ error: 'Zone not found' });
    }
    res.status(500).json({ error: 'Error fetching zone pulse data' });
  }
});

module.exports = router;