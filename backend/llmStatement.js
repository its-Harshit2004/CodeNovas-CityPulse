function generateLLMStatement(analysis) {
  const {
    zone_id,
    severity,
    anomalies,
    correlation,
    evidence
  } = analysis;

  if (severity === "normal") {
    return `Zone ${zone_id} is currently operating within normal conditions.`;
  }

  const parts = [];

  if (anomalies?.length > 0) {
    const metrics = anomalies.map((item) => {
      if (item.metric === "traffic") {
        return "traffic is elevated above its baseline";
      }

      if (item.metric === "incidents") {
        return "incidents are elevated above their baseline";
      }

      return `${item.metric} conditions are abnormal`;
    });

    parts.push(metrics.join(" and "));
  }

  if (correlation?.detected && correlation.message) {
    parts.push(
      `The observed conditions may be associated with ${correlation.message.toLowerCase()}`
    );
  }

  if (parts.length === 0 && evidence?.length > 0) {
    return `Zone ${zone_id} is showing unusual civic conditions: ${evidence.join(", ")}.`;
  }

  return `Zone ${zone_id} is showing ${parts.join(". ")}.`;
}

module.exports = {
  generateLLMStatement
};