function isPeakCommute(timestamp) {
  const date = timestamp ? new Date(timestamp) : new Date();
  const hour = date.getHours();
  // Morning 08:00–11:00, Evening 17:00–20:00
  return (hour >= 8 && hour < 11) || (hour >= 17 && hour < 20);
}

function generateStructuredIntelligence(analysis) {
  const { zone_id, severity, anomalies, trend, rawData } = analysis;

  const hasTraffic = anomalies?.some((a) => a.metric === "traffic");
  const hasIncidents = anomalies?.some((a) => a.metric === "incidents");
  const hasRain = rawData?.weather?.rain_mm > 2;
  const isPeak = isPeakCommute(rawData?.timestamp);

  let summary = "";
  let compact = "";
  let outlook = "STABLE";
  const contributors = [];

  if (hasTraffic && hasRain && hasIncidents) {
    summary = `Zone ${zone_id} is showing multiple disruption signals. Elevated rainfall, heavy traffic and increased incident activity are occurring together, suggesting possible weather-related mobility disruption.`;
    compact = `Multiple disruption signals in Zone ${zone_id}. Rain and incidents may be contributing to congestion.`;
    contributors.push({ signal: "rainfall", relationship: "possible", message: "Wet-road conditions may be reducing mobility." });
    contributors.push({ signal: "incidents", relationship: "possible", message: "Incident activity may be contributing to local disruption." });
    outlook = "WORSENING";
  } else if (hasTraffic && hasRain) {
    summary = `Heavy traffic is developing in Zone ${zone_id} while rainfall is elevated. Wet-road conditions may be contributing to slower movement.`;
    compact = `Traffic is elevated in Zone ${zone_id} alongside rainfall. Wet roads may be contributing.`;
    contributors.push({ signal: "rainfall", relationship: "possible", message: "Rainfall coincides with elevated traffic." });
    outlook = trend === "rising" ? "WORSENING" : "WATCH";
  } else if (hasTraffic && hasIncidents) {
    summary = `Traffic congestion in Zone ${zone_id} has increased alongside a rise in reported incidents. Incident activity may be contributing to local disruption and slower movement.`;
    compact = `Traffic is elevated in Zone ${zone_id} alongside increased incident activity. Incidents may be contributing to localized congestion.`;
    contributors.push({ signal: "incidents", relationship: "possible", message: "Incident activity coincides with congestion." });
    outlook = trend === "rising" ? "WORSENING" : "WATCH";
  } else if (hasTraffic) {
    if (isPeak) {
      summary = `Zone ${zone_id} is experiencing elevated traffic during a typical commuting period. The pattern is consistent with peak-hour congestion, with no major weather or incident signal currently detected.`;
      compact = `Traffic is elevated in Zone ${zone_id}, consistent with typical peak-hour commuting patterns.`;
      contributors.push({ signal: "time", relationship: "likely", message: "Peak commuting period." });
      outlook = trend === "rising" ? "WATCH" : "STABLE";
    } else {
      summary = `Zone ${zone_id} is experiencing unusually elevated traffic without a strong rainfall or incident signal.`;
      compact = `Traffic is elevated in Zone ${zone_id}, but current rainfall and incident signals do not provide a clear contributing factor.`;
      outlook = trend === "falling" ? "IMPROVING" : "WATCH";
    }
  } else if (hasRain || hasIncidents) {
    const signals = [];
    if (hasRain) signals.push("rainfall");
    if (hasIncidents) signals.push("incident activity");
    summary = `${signals.join(" and ")} elevated in Zone ${zone_id}, but no major traffic congestion is currently observed.`;
    compact = `${signals.join(" and ")} elevated without significant mobility disruption.`;
    outlook = "WATCH";
  } else {
    summary = `Conditions in Zone ${zone_id} are currently stable. Traffic, rainfall and incident activity remain close to expected levels, with no significant disruption detected.`;
    compact = `Conditions in Zone ${zone_id} are stable with no significant disruption.`;
    outlook = "STABLE";
  }

  let trendMessage = "";
  if (trend === "rising") {
    trendMessage = `Traffic has increased across recent readings. If this trend continues, congestion may worsen over the next 15–30 minutes.`;
  } else if (trend === "falling") {
    trendMessage = `Traffic has eased across recent readings, suggesting conditions may be improving.`;
    if (outlook === "WORSENING") outlook = "WATCH";
    else if (outlook === "WATCH") outlook = "IMPROVING";
  } else {
    trendMessage = `Traffic has remained relatively stable across recent readings.`;
  }

  return {
    summary,
    compact,
    contributors,
    trend,
    trend_message: trendMessage,
    outlook
  };
}

// Keep original signature for backward compatibility, but we will migrate to structured output
function generateLLMStatement(analysis) {
  const intel = generateStructuredIntelligence(analysis);
  return intel.summary;
}

module.exports = {
  generateLLMStatement,
  generateStructuredIntelligence
};