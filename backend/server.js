const express = require("express");
const cors = require("cors");

const zonesRouter = require("./routes/zones");
const pulseRouter = require("./routes/pulse");
const alertsRouter = require("./routes/alerts");

const { getAllZones } = require("./services/cityPulseService");
const { getZonePulse } = require("./services/cityPulseService");

const app = express();

app.use(cors());
app.use(express.json());

// Main route-based API
app.use("/api/zones", zonesRouter);
app.use("/api/pulse", pulseRouter);
app.use("/api/alerts", alertsRouter);

// State API
app.get("/api/state", async (req, res) => {
  try {
    const allZones = getAllZones();
    const zoneDataPromises = allZones.map(zone => getZonePulse(zone.id));
    const summaries = await Promise.all(zoneDataPromises);

    res.json({
      success: true,
      zones: summaries,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("State generation failed:", error);

    res.status(500).json({
      success: false,
      error: "Failed to fetch state data"
    });
  }
});
// Health check
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "CityPulse Backend Server Running!"
  });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`CityPulse Backend running on http://localhost:${PORT}`);
  console.log("  GET /api/health");
  console.log("  GET /api/zones");
  console.log("  GET /api/pulse");
  console.log("  GET /api/alerts");
  console.log("  GET /api/state");
});