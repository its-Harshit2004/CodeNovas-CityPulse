
let getNormalizedData = null;
let analyzeZoneData = null;

try {
  getNormalizedData = require('../data/normalizer').getNormalizedData;
} catch (e) {
  console.log('ℹ️ Member 1 (normalizer.js) not ready yet. Using mock data.');
}

try {
  analyzeZoneData = require('../analytics/analyzer').analyzeZoneData;
} catch (e) {
  console.log('ℹ️ Member 2 (analyzer.js) not ready yet. Using mock analytics.');
}


function getMockPulseData(zoneId) {
  const isAlertZone = zoneId.toUpperCase() === 'A';
  return {
    zone_id: zoneId.toUpperCase(),
    updated_at: new Date().toISOString(),
    metrics: {
      rain_mm: isAlertZone ? 35 : 5,
      traffic_pct: isAlertZone ? 85 : 42,
      incidents: isAlertZone ? 12 : 2
    },
    alert: {
      active: isAlertZone,
      severity: isAlertZone ? 'high' : 'low',
      message: isAlertZone ? 'Possible weather-related disruption' : 'Normal conditions'
    },
    evidence: isAlertZone ? [
      'Heavy rainfall detected (35mm)',
      'Traffic congestion 112% above baseline (85%)',
      'Incidents spike detected (12 active complaints)'
    ] : ['All metrics within baseline levels'],
    source_status: {
      weather: 'ok',
      traffic: 'ok',
      incidents: 'ok'
    }
  };
}

async function getZonePulse(zoneId) {
  if (!getNormalizedData || !analyzeZoneData) {
    return getMockPulseData(zoneId);
  }

  try {
    const rawData = await getNormalizedData(zoneId);
    const analysis = analyzeZoneData(rawData);

    return {
      zone_id: zoneId,
      updated_at: rawData.timestamp || new Date().toISOString(),
      metrics: {
        rain_mm: rawData.weather?.rain_mm ?? 0,
        traffic_pct: rawData.traffic?.congestion_pct ?? 0,
        incidents: rawData.incidents?.count ?? 0
      },
      alert: {
        active: analysis.alert || false,
        severity: analysis.severity || 'low',
        message: analysis.correlation?.message || 'Normal conditions'
      },
      evidence: analysis.evidence || [],
      source_status: {
        weather: rawData.weather ? 'ok' : 'degraded',
        traffic: rawData.traffic ? 'ok' : 'degraded',
        incidents: rawData.incidents ? 'ok' : 'degraded'
      }
    };
  } catch (err) {
    return getMockPulseData(zoneId);
  }
}

function getAllZones() {
  return [
    { id: 'A', name: 'Downtown / Zone A', status: 'alert' },
    { id: 'B', name: 'North District / Zone B', status: 'normal' },
    { id: 'C', name: 'West Industrial / Zone C', status: 'normal' }
  ];
}

module.exports = {
  getZonePulse,
  getAllZones
};