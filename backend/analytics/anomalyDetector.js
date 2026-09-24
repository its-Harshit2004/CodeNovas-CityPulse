function detectAnomalies(data, baseline) {
  const traffic = data.traffic.congestion_pct;
  const incidents = data.incidents.count;
  const rain = data.weather.rain_mm;

  const trafficAnomaly =
    baseline.traffic > 0 && traffic > baseline.traffic * 1.5;

  const incidentAnomaly =
    baseline.incidents > 0 && incidents > baseline.incidents * 2;

  const rainEvent = rain > 20;

  return {
    trafficAnomaly,
    incidentAnomaly,
    rainEvent
  };
}

module.exports = { detectAnomalies };