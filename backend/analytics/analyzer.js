const { getBaseline } = require("./baseline");
const { detectAnomalies } = require("./anomalyDetector");
const { detectCorrelation } = require("./correlationEngine");
const { generateStructuredIntelligence } = require("../llmStatement");

const zoneHistories = {};

async function analyze(data) {  const zoneId = data.zone_id;

  const baseline = getBaseline(zoneId);

  const anomalies = detectAnomalies(data, baseline);

  const correlation = detectCorrelation(anomalies);

  if (!zoneHistories[zoneId]) zoneHistories[zoneId] = [];
  zoneHistories[zoneId].push(data.traffic?.congestion_pct || 0);
  if (zoneHistories[zoneId].length > 4) zoneHistories[zoneId].shift();

  let trend = "stable";
  const hist = zoneHistories[zoneId];
  if (hist.length >= 2) {
    const diff = hist[hist.length - 1] - hist[hist.length - 2];
    if (diff > 2) trend = "rising";
    else if (diff < -2) trend = "falling";
  }

  const anomalyList = [];

  if (anomalies.trafficAnomaly) {
    anomalyList.push({
      metric: "traffic",
      current: data.traffic.congestion_pct,
      baseline: baseline.traffic
    });
  }

  if (anomalies.incidentAnomaly) {
    anomalyList.push({
      metric: "incidents",
      current: data.incidents.count,
      baseline: baseline.incidents
    });
  }

  const alert =
    anomalyList.length > 0 || correlation.detected;

  let severity = "normal";

  if (correlation.detected) {
    severity = "high";
  } else if (anomalyList.length > 0) {
    severity = "medium";
  }

  const evidence = [];

  if (anomalies.rainEvent) {
    evidence.push("Rain increased");
  }

  if (anomalies.trafficAnomaly) {
    if (baseline.traffic > 0) {
      const increase =
        ((data.traffic.congestion_pct - baseline.traffic) /
          baseline.traffic) *
        100;
      evidence.push(
        `Traffic is ${increase.toFixed(1)}% above baseline`
      );
    } else {
      evidence.push("Traffic elevated");
    }
  }

  if (anomalies.incidentAnomaly) {
    evidence.push("Incidents increased");
  }

  
      const analysis = {
    zone_id: zoneId,
    alert,
    severity,

    anomalies: anomalyList,

    correlation: {
      signals: correlation.signals,
      message: correlation.message
    },

    evidence
  };

  const intel = generateStructuredIntelligence({
    ...analysis,
    trend,
    rawData: data
  });

  return {
    ...analysis,
    llm_statement: intel.summary, // backwards compatibility
    intelligence: intel
  };
}

module.exports = { analyze };
