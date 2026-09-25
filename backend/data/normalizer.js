const fs = require("fs");
const path = require("path");

// --------------------------------
// Load fixture data
// --------------------------------

const fixturePath = path.join(__dirname, "fixtures", "citypulse.json");

function loadFixtureData() {
  const rawData = JSON.parse(fs.readFileSync(fixturePath, "utf-8"));

  return rawData.zones.sort((a, b) => a.zone_id.localeCompare(b.zone_id));
}

// --------------------------------
// Member 3 API functions
// --------------------------------

function getAllNormalizedData() {
  return loadFixtureData();
}

function getNormalizedData(zoneId) {
  const zones = loadFixtureData();

  const zone = zones.find(
    (z) => z.zone_id.toUpperCase() === zoneId.toUpperCase()
  );

  return zone || null;
}

// --------------------------------
// Save normalized output (for testing/demo)
// --------------------------------

function saveNormalizedOutput() {
  const normalizedData = getAllNormalizedData();

  const outputPath = path.join(
    __dirname,
    "fixtures",
    "normalized-events.json"
  );

  fs.writeFileSync(
    outputPath,
    JSON.stringify(normalizedData, null, 2)
  );

  console.log("\n--------------------------------");
  console.log("CITYPULSE NORMALIZED DATA");
  console.log("--------------------------------\n");

  console.log(JSON.stringify(normalizedData, null, 2));
  console.log(`\nSaved to: ${outputPath}`);
}

// Run only if executed directly
if (require.main === module) {
  saveNormalizedOutput();
}

// --------------------------------
// Exports
// --------------------------------

module.exports = {
  getNormalizedData,
  getAllNormalizedData,
  saveNormalizedOutput,
};