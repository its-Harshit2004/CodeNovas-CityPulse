/**
 * Sample civic data for each zone.
 * This simulates the data that would come from live data sources
 * (weather APIs, traffic sensors, civic complaint systems).
 *
 * Zone C intentionally demonstrates HIGH ALERT for hackathon demo purposes.
 */
const sampleData = {
  A: {
    zone_id: "A",
    traffic: { congestion_pct: 35 },
    weather: { rain_mm: 5 },
    incidents: { count: 2 }
  },
  B: {
    zone_id: "B",
    traffic: { congestion_pct: 55 },
    weather: { rain_mm: 25 },
    incidents: { count: 7 }
  },
  C: {
    zone_id: "C",
    traffic: { congestion_pct: 82 },
    weather: { rain_mm: 62 },
    incidents: { count: 18 }
  },
  D: {
    zone_id: "D",
    traffic: { congestion_pct: 28 },
    weather: { rain_mm: 2 },
    incidents: { count: 1 }
  },
  E: {
    zone_id: "E",
    traffic: { congestion_pct: 48 },
    weather: { rain_mm: 12 },
    incidents: { count: 5 }
  }
};

module.exports = { sampleData };
