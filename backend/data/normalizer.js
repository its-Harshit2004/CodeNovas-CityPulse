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

async function getAllNormalizedData() {
  const fixtureData = loadFixtureData();
  
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

  return fixtureData.map(fixtureZone => {
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
      trafficRecord = { congestion_pct: fixtureZone.traffic?.congestion_pct ?? 0 };
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
    
    const incidentsRecord = getIncidentData(fixtureZone) || { count: fixtureZone.incidents?.count ?? 0 };
    
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
