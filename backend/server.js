// backend/server.js
const express = require('express');
const cors = require('cors');

const zonesRouter = require('./routes/zones');
const pulseRouter = require('./routes/pulse');
const alertsRouter = require('./routes/alerts');

const app = express();
app.use(cors());
app.use(express.json());

// Mount Routers
app.use('/api/zones', zonesRouter);
app.use('/api/pulse', pulseRouter);
app.use('/api/alerts', alertsRouter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'CityPulse Backend Server Running!' });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`✅ CityPulse Backend running on http://localhost:${PORT}`);
});