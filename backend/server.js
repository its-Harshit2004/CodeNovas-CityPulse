

const express = require("express");
const cors = require("cors");

const { zones } = require("./data/zones");
const { sampleData } = require("./data/sampleData");
const { analyze } = require("./analytics/analyzer");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/zones
// Returns the list of all configured zones.
// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/zones", (req, res) => {
  const zoneList = zones.map((zone) => ({
    zone_id: zone.zone_id,
    name: zone.name,
    latitude: zone.latitude,
    longitude: zone.longitude
  }));

  res.json({
    zones: zoneList,
    timestamp: new Date().toISOString()
  });
});


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/pulse/:zoneId
// Returns full analytics result for a given zone.
//
// Pipeline:
// raw data
//    ↓
// baseline
//    ↓
// anomaly detection
//    ↓
// correlation detection
//    ↓
// LLM civic statement
//    ↓
// JSON response
// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/pulse/:zoneId", async (req, res) => {
  try {
    const { zoneId } = req.params;
    const zoneIdUpper = zoneId.toUpperCase();

    // Find zone configuration
    const zoneConfig = zones.find(
      (zone) => zone.zone_id === zoneIdUpper
    );

    if (!zoneConfig) {
      return res.status(404).json({
        error: `Zone '${zoneId}' not found`
      });
    }

    // Get synthetic/raw data for the zone
    const rawData = sampleData[zoneIdUpper];

    // Zone exists but has no data
    if (!rawData) {
      return res.json({
        zone_id: zoneIdUpper,
        name: zoneConfig.name,
        latitude: zoneConfig.latitude,
        longitude: zoneConfig.longitude,
        severity: "no_data",
        alert: false,
        anomalies: [],
        correlation: {
          signals: [],
          message: null
        },
        evidence: [],
        llm_statement: null,
        metrics: null,
        timestamp: new Date().toISOString()
      });
    }

    // Run analytics pipeline
    // analyze() is async because it now calls the LLM.
    const analysis = await analyze(rawData);

    res.json({
      zone_id: zoneIdUpper,
      name: zoneConfig.name,
      latitude: zoneConfig.latitude,
      longitude: zoneConfig.longitude,

      severity: analysis.severity,
      alert: analysis.alert,

      anomalies: analysis.anomalies,

      correlation: analysis.correlation,

      evidence: analysis.evidence,

      // LLM-generated civic explanation
      llm_statement: analysis.llm_statement,

      metrics: {
        traffic: rawData.traffic.congestion_pct,
        rain_mm: rawData.weather.rain_mm,
        incidents: rawData.incidents.count
      },

      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error("Error in /api/pulse/:zoneId:", error);

    res.status(500).json({
      error: "Failed to analyze zone",
      message: error.message
    });
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// GET /api/dashboard
// Returns summary of all zones and aggregate metrics.
//
// NOTE:
// analyze() is now async because it calls the LLM,
// so we MUST await each analysis.
// ─────────────────────────────────────────────────────────────────────────────

app.get("/api/dashboard", async (req, res) => {
  try {

    const results = await Promise.all(
      zones.map(async (zone) => {

        const rawData = sampleData[zone.zone_id];

        // Zone has no data
        if (!rawData) {
          return {
            zone_id: zone.zone_id,
            name: zone.name,
            latitude: zone.latitude,
            longitude: zone.longitude,
            severity: "no_data",
            alert: false
          };
        }

        // Run analytics
        const analysis = await analyze(rawData);

        return {
          zone_id: zone.zone_id,
          name: zone.name,
          latitude: zone.latitude,
          longitude: zone.longitude,
          severity: analysis.severity,
          alert: analysis.alert,

          // Include the LLM statement so the dashboard
          // can display it if needed.
          llm_statement: analysis.llm_statement
        };
      })
    );


    // ─────────────────────────────────────────────────────────────────────────
    // Aggregate metrics across all zones
    // ─────────────────────────────────────────────────────────────────────────

    let totalTraffic = 0;
    let totalRain = 0;
    let totalIncidents = 0;
    let activeAlerts = 0;
    let dataZones = 0;

    zones.forEach((zone) => {

      const rawData = sampleData[zone.zone_id];

      if (rawData) {
        totalTraffic += rawData.traffic.congestion_pct;
        totalRain += rawData.weather.rain_mm;
        totalIncidents += rawData.incidents.count;

        dataZones++;
      }
    });


    // Count active alerts
    results.forEach((zone) => {
      if (zone.alert) {
        activeAlerts++;
      }
    });


    // ─────────────────────────────────────────────────────────────────────────
    // Send response
    // ─────────────────────────────────────────────────────────────────────────

    res.json({
      zones: results,

      metrics: {
        avgTraffic:
          dataZones > 0
            ? Math.round(totalTraffic / dataZones)
            : 0,

        maxRain:
          Math.max(
            ...zones.map((zone) =>
              sampleData[zone.zone_id]
                ? sampleData[zone.zone_id].weather.rain_mm
                : 0
            )
          ),

        totalIncidents,

        activeAlerts
      },

      timestamp: new Date().toISOString()
    });

  } catch (error) {

    console.error("Error in /api/dashboard:", error);

    res.status(500).json({
      error: "Failed to generate dashboard data",
      message: error.message
    });
  }
});


// ─────────────────────────────────────────────────────────────────────────────
// START SERVER
// ─────────────────────────────────────────────────────────────────────────────

app.listen(PORT, () => {
  console.log(
    `CityPulse API server running on http://localhost:${PORT}`
  );

  console.log("  GET /api/zones");
  console.log("  GET /api/pulse/:zoneId");
  console.log("  GET /api/dashboard");
});