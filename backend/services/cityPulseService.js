let getNormalizedData = null;
let analyzeZoneData = null;

try {
  getNormalizedData = require('../data/normalizer').getNormalizedData;
} catch (e) {
  console.log('ℹ️ Member 1 (normalizer.js) not ready yet. Using mock data.');
}

try {
  analyzeZoneData = require('../analytics/analyzer').analyze;
} catch (e) {
  console.log('ℹ️ Member 2 (analyzer.js) not ready yet. Using mock analytics.');
}

function getMockPulseData(zoneId) {
  const isAlertZone = zoneId.toUpperCase() === 'C'; // Changed to C because C is the alert zone in fixtures
  return {
    zone_id: zoneId.toUpperCase(),
    updated_at: new Date().toISOString(),
    metrics: {
      rain_mm: isAlertZone ? 62 : 5,
      traffic_pct: isAlertZone ? 82 : 42,
      incidents: isAlertZone ? 18 : 2
    },
    alert: {
      active: isAlertZone,
      severity: isAlertZone ? 'high' : 'low',
      message: isAlertZone ? 'Possible weather-related disruption' : 'Normal conditions'
    },
    evidence: isAlertZone ? [
      'Heavy rainfall detected (62mm)',
      'Traffic congestion 112% above baseline',
      'Incidents spike detected'
    ] : ['All metrics within baseline levels'],
    source_status: {
      weather: 'fixture',
      traffic: 'fixture',
      incidents: 'fixture'
    }
  };
}

async function getZonePulse(zoneId) {
  const allZones = getAllZones();
  if (!allZones.find(z => z.id.toUpperCase() === zoneId.toUpperCase())) {
    throw new Error('Zone not found');
  }

  if (!getNormalizedData || !analyzeZoneData) {
    return getMockPulseData(zoneId);
  }

  try {
    const rawData = await getNormalizedData(zoneId);
    if (!rawData) {
      throw new Error('Zone not found');
    }
    const analysis = await analyzeZoneData(rawData);

    return {
      zone_id: zoneId.toUpperCase(),
      name: allZones.find(z => z.id.toUpperCase() === zoneId.toUpperCase())?.name,
      updated_at: rawData.timestamp || new Date().toISOString(),
      metrics: {
        rain_mm: rawData.weather?.rain_mm ?? 0,
        traffic_pct: rawData.traffic?.congestion_pct ?? 0,
        incidents: rawData.incidents?.count ?? 0
      },
      alert: {
        active: analysis.alert || false,
        severity: analysis.severity || 'low',
        message: analysis.correlation?.message || 'Normal conditions',
        llm_statement: analysis.llm_statement
      },
      evidence: analysis.evidence || [],
      source_status: rawData.source_status || {
        weather: rawData.weather ? 'ok' : 'unavailable',
        traffic: rawData.traffic ? 'ok' : 'unavailable',
        incidents: rawData.incidents ? 'ok' : 'unavailable'
      },
      signal_status: {
        traffic: analysis.anomalies?.some(a => a.metric === 'traffic')
          ? (analysis.severity === 'high' ? 'red' : 'amber')
          : 'green',
        incidents: analysis.anomalies?.some(a => a.metric === 'incidents')
          ? (analysis.severity === 'high' ? 'red' : 'amber')
          : 'green',
        rainfall: rawData.weather?.rain_mm > 20
          ? (rawData.weather.rain_mm > 50 ? 'red' : 'amber')
          : 'green'
      }
    };
  } catch (err) {
    if (err.message === 'Zone not found') throw err;
    console.error("Error in getZonePulse:", err);
    return getMockPulseData(zoneId);
  }
}

function getAllZones() {
  return [
    { id: 'A', name: 'Zone A', status: 'normal' },
    { id: 'B', name: 'Zone B', status: 'normal' },
    { id: 'C', name: 'Zone C', status: 'alert' }
  ];
}

module.exports = {
  getZonePulse,
  getAllZones
};