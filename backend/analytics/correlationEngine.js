function detectCorrelation(anomalies) {
  const {
    trafficAnomaly,
    incidentAnomaly,
    rainEvent
  } = anomalies;

  if (rainEvent && trafficAnomaly && incidentAnomaly) {
    return {
      detected: true,
      signals: ["rain", "traffic", "incidents"],
      message: "Possible weather-related disruption"
    };
  }

  return {
    detected: false,
    signals: [],
    message: null
  };
}

module.exports = { detectCorrelation };