const fs = require("fs");
const path = require("path");
const { getTrafficData } = require("./sources/traffic");
const { getWeatherData } = require("./sources/weather");
const { getIncidentData } = require("./sources/incidents");

const fixturePath = path.join(__dirname, "fixtures", "citypulse.json");

function loadFixtureData() {
  const rawData = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));
  return rawData.zones.sort((a, b) => a.zone_id.localeCompare(b.zone_id));
}

const FIXTURE_SCENARIOS = [
  { A: { traffic: 82, incidents: 18 }, B: { traffic: 55, incidents: 7 }, C: { traffic: 30, incidents: 3 } },
  { A: { traffic: 72, incidents: 14 }, B: { traffic: 64, incidents: 9 }, C: { traffic: 34, incidents: 2 } },
  { A: { traffic: 61, incidents: 10 }, B: { traffic: 76, incidents: 12 }, C: { traffic: 43, incidents: 4 } },
  { A: { traffic: 87, incidents: 20 }, B: { traffic: 68, incidents: 8 }, C: { traffic: 32, incidents: 3 } }
];

function getCurrentFixtureScenario() {
  const scenarioIndex = Math.floor(Date.now() / 15000) % FIXTURE_SCENARIOS.length;
  return FIXTURE_SCENARIOS[scenarioIndex];
}

let cachedAllData = null;
let lastCacheTime = 0;

async function getAllNormalizedData() {
  const now = Date.now();
  if (cachedAllData && (now - lastCacheTime < 1000)) {
    return cachedAllData;
  }
  
  const fixtureData = loadFixtureData();
  const currentScenario = getCurrentFixtureScenario();
  
  let trafficData = null;
  let weatherData = null;
  
  try {
    trafficData = await getTrafficData();
  } catch (error) {
    console.warn("Traffic source unavailable:", error.message);
  }

  try {
    weatherData = await getWeatherData();
  } catch (error) {
    console.warn("Weather source unavailable:", error.message);
  }

  const result = fixtureData.map(fixtureZone => {
    const zoneId = fixtureZone.zone_id.toUpperCase();
    
    let trafficRecord = null;
    let trafficSource = "fixture";
    
    if (trafficData) {
      const td = trafficData.find(t => t.zone.toUpperCase() === zoneId);
      if (td && typeof td.congestion === 'number' && !isNaN(td.congestion)) {
        trafficRecord = { congestion_pct: td.congestion };
        trafficSource = "live";
      }
    }
    if (!trafficRecord) {
      const scenario = currentScenario[zoneId];
      trafficRecord = { congestion_pct: scenario ? scenario.traffic : (fixtureZone.traffic?.congestion_pct ?? 0) };
    }
    
    let weatherRecord = null;
    let weatherSource = "fixture";
    
    if (weatherData) {
      const wd = weatherData.find(w => w.zone.toUpperCase() === zoneId);
      if (wd && typeof wd.rainfall === 'number' && !isNaN(wd.rainfall)) {
        weatherRecord = { rain_mm: wd.rainfall };
        weatherSource = "live";
      }
    }
    if (!weatherRecord) {
      weatherRecord = { rain_mm: fixtureZone.weather?.rain_mm ?? 0 };
    }
    
    const scenario = currentScenario[zoneId];
    const incidentsRecord = { count: scenario ? scenario.incidents : (fixtureZone.incidents?.count ?? 0) };
    
    return {
      zone_id: zoneId,
      timestamp: new Date().toISOString(),
      weather: weatherRecord,
      traffic: trafficRecord,
      incidents: incidentsRecord,
      source_status: {
        weather: weatherSource,
        traffic: trafficSource,
        incidents: "fixture"
      }
    };
  });
  
  cachedAllData = result;
  lastCacheTime = Date.now();
  
  return result;
}

async function getNormalizedData(zoneId) {
  const allZones = await getAllNormalizedData();
  const zone = allZones.find(
    (item) => item.zone_id.toUpperCase() === zoneId.toUpperCase()
  );
  return zone || null;
}

async function saveNormalizedOutput() {
  const normalizedData = await getAllNormalizedData();
  const outputPath = path.join(
    __dirname,
    "fixtures",
    "normalized-events.json"
  );

  fs.writeFileSync(outputPath, JSON.stringify(normalizedData, null, 2));

  console.log("\n--------------------------------");
  console.log("CITYPULSE NORMALIZED DATA");
  console.log("--------------------------------\n");
  console.log(JSON.stringify(normalizedData, null, 2));
  console.log(`\nSaved to: ${outputPath}`);
}

if (require.main === module) {
  saveNormalizedOutput();
}

module.exports = {
  getNormalizedData,
  getAllNormalizedData,
  saveNormalizedOutput,
};
