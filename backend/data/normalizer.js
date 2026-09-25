const fs = require("fs");
const path = require("path");

const fixturePath = path.join(__dirname, "fixtures", "citypulse.json");

function loadFixtureData() {
  const rawData = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));

  return rawData.zones.sort((a, b) => a.zone_id.localeCompare(b.zone_id));
}

function getAllNormalizedData() {
  return loadFixtureData();
}

function getNormalizedData(zoneId) {
  const zones = loadFixtureData();

  const zone = zones.find(
    (item) => item.zone_id.toUpperCase() === zoneId.toUpperCase()
  );

  return zone || null;
}

function saveNormalizedOutput() {
  const normalizedData = getAllNormalizedData();
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
