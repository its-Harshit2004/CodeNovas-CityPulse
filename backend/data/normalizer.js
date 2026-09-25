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
    
    let trafficRecord = { congestion_pct: 0 };
    if (trafficData) {
      const td = trafficData.find(t => t.zone.toUpperCase() === zoneId);
      if (td) trafficRecord = { congestion_pct: td.congestion };
    }
    
    let weatherRecord = { rain_mm: 0 };
    if (weatherData) {
      const wd = weatherData.find(w => w.zone.toUpperCase() === zoneId);
      if (wd) weatherRecord = { rain_mm: wd.rainfall };
    }
    
    const incidentsRecord = getIncidentData(fixtureZone) || { count: 0 };
    
    return {
      zone_id: zoneId,
      timestamp: new Date().toISOString(),
      weather: weatherRecord,
      traffic: trafficRecord,
      incidents: incidentsRecord
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
