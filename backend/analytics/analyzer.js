/**
 * Member 2 Analytics & Anomaly Engine
 * Analyzes normalized civic record and determines anomalies and disruptions
 */
function analyze(normalizedData) {
  const rain = normalizedData.weather?.rain_mm ?? 0;
  const traffic = normalizedData.traffic?.congestion_pct ?? 0;
  const incidents = normalizedData.incidents?.count ?? 0;

  // Anomaly rules
  const isRainEvent = rain > 20;
  const isTrafficAnomaly = traffic > 60;
  const isIncidentAnomaly = incidents > 5;

  const isAlert = isRainEvent && isTrafficAnomaly && isIncidentAnomaly;

  const evidence = [];
  if (isRainEvent) evidence.push(`Heavy rainfall detected (${rain}mm)`);
  if (isTrafficAnomaly) evidence.push(`Traffic congestion ${traffic}% above normal`);
  if (isIncidentAnomaly) evidence.push(`Incidents spike detected (${incidents} active complaints)`);

  return {
    zone_id: normalizedData.zone_id,
    alert: isAlert,
    severity: isAlert ? 'high' : 'low',
    anomalies: [
      { metric: 'traffic', current: traffic, baseline: 40 },
      { metric: 'incidents', current: incidents, baseline: 2 }
    ],
    correlation: {
      signals: ['rain', 'traffic', 'incidents'],
      message: isAlert ? 'Possible weather-related disruption' : 'Normal conditions'
    },
    evidence: evidence.length > 0 ? evidence : ['All metrics within baseline levels']
  };
}

module.exports = {
  analyze
};
