const express = require("express");
const cors = require("cors");
const { zones } = require("./data/zones");
const { sampleData } = require("./data/sampleData");
const { analyze } = require("./analytics/analyzer");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ─── GET /api/zones ────────────────────────────────────────────────────────────
// Returns the list of all configured zones with their coordinates.
// The frontend uses this to know which zones to display on the map.
app.get("/api/zones", (req, res) => {
  const zoneList = zones.map((zone) => ({
    zone_id: zone.zone_id,
    name: zone.name,
    latitude: zone.latitude,
    longitude: zone.longitude
  }));

  res.json({ zones: zoneList, timestamp: new Date().toISOString() });
});

// ─── GET /api/pulse/:zoneId ────────────────────────────────────────────────────
// Returns full analytics result for a given zone.
// The backend analytics layer (baseline → anomalyDetector → correlationEngine)
// owns all severity/alert determination. The frontend only displays the result.
app.get("/api/pulse/:zoneId", (req, res) => {
  const { zoneId } = req.params;
  const zoneIdUpper = zoneId.toUpperCase();

  const zoneConfig = zones.find((z) => z.zone_id === zoneIdUpper);
  if (!zoneConfig) {
    return res.status(404).json({ error: `Zone '${zoneId}' not found` });
  }

  const rawData = sampleData[zoneIdUpper];
  if (!rawData) {
    // Zone exists but has no data
    return res.json({
      zone_id: zoneIdUpper,
      name: zoneConfig.name,
      latitude: zoneConfig.latitude,
      longitude: zoneConfig.longitude,
      severity: "no_data",
      alert: false,
      anomalies: [],
      correlation: { signals: [], message: null },
      evidence: [],
      metrics: null,
      timestamp: new Date().toISOString()
    });
  }

  // Run through the analytics pipeline
  const analysis = analyze(rawData);

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
    metrics: {
      traffic: rawData.traffic.congestion_pct,
      rain_mm: rawData.weather.rain_mm,
      incidents: rawData.incidents.count
    },
    timestamp: new Date().toISOString()
  });
});

// ─── GET /api/dashboard ────────────────────────────────────────────────────────
// Returns a summary of all zones + aggregate metrics for the metric cards.
app.get("/api/dashboard", (req, res) => {
  const results = zones.map((zone) => {
    const rawData = sampleData[zone.zone_id];
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

    const analysis = analyze(rawData);
    return {
      zone_id: zone.zone_id,
      name: zone.name,
      latitude: zone.latitude,
      longitude: zone.longitude,
      severity: analysis.severity,
      alert: analysis.alert
    };
  });

  // Aggregate metrics across all zones
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

  results.forEach((zone) => {
    if (zone.alert) activeAlerts++;
  });

  res.json({
    zones: results,
    metrics: {
      avgTraffic: dataZones > 0 ? Math.round(totalTraffic / dataZones) : 0,
      maxRain: Math.max(
        ...zones.map((z) =>
          sampleData[z.zone_id] ? sampleData[z.zone_id].weather.rain_mm : 0
        )
      ),
      totalIncidents,
      activeAlerts
    },
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`CityPulse API server running on http://localhost:${PORT}`);
  console.log(`  GET /api/zones`);
  console.log(`  GET /api/pulse/:zoneId`);
  console.log(`  GET /api/dashboard`);
});
