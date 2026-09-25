// backend/routes/alerts.js
const express = require('express');
const router = express.Router();
const { getZonePulse } = require('../services/cityPulseService');

// GET /api/alerts/:zoneId
router.get('/:zoneId', async (req, res) => {
  try {
    const data = await getZonePulse(req.params.zoneId);
    res.json({
      zone_id: data.zone_id,
      alert: data.alert,
      evidence: data.evidence,
      updated_at: data.updated_at
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching alerts' });
  }
});

module.exports = router;