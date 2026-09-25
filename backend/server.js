const express = require("express");
const cors = require("cors");

const zonesRouter = require("./routes/zones");
const pulseRouter = require("./routes/pulse");
const alertsRouter = require("./routes/alerts");

const { zones } = require("./data/zones");
const { sampleData } = require("./data/sampleData");
const { analyze } = require("./analytics/analyzer");

const app = express();

app.use(cors());
app.use(express.json());

// Main route-based API
app.use("/api/zones", zonesRouter);
app.use("/api/pulse", pulseRouter);
app.use("/api/alerts", alertsRouter);

// Analytics API
app.get("/api/dashboard", (req, res) => {
  try {
    const summaries = zones.map((zone) => {
      const data = sampleData[zone.id] || sampleData[zone.zone_id];

      if (!data) {
        return {
          zone_id: zone.id || zone.zone_id,
          severity: "normal",
          alert: false,
          llm_statement: "No sample data available."
        };
      }

      return analyze(data);
    });

    res.json({
      success: true,
      zones: summaries,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Dashboard analysis failed:", error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze dashboard data"
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
  console.log("  GET /api/dashboard");
});