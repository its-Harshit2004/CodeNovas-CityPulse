const fs = require("fs");
const path = require("path");

// --------------------------------
// 1. Load fixture data
// --------------------------------

const fixturePath = path.join(
    __dirname,
    "fixtures",
    "citypulse.json"
);

const rawData = JSON.parse(
    fs.readFileSync(fixturePath, "utf-8")
);


// --------------------------------
// 2. Get zone data
// --------------------------------

const normalizedData = rawData.zones;


// --------------------------------
// 3. Sort by zone
// --------------------------------

normalizedData.sort((a, b) =>
    a.zone_id.localeCompare(b.zone_id)
);


// --------------------------------
// 4. Save normalized output
// --------------------------------

const outputPath = path.join(
    __dirname,
    "fixtures",
    "normalized-events.json"
);

fs.writeFileSync(
    outputPath,
    JSON.stringify(normalizedData, null, 2)
);


// --------------------------------
// 5. Display result
// --------------------------------

console.log("\n--------------------------------");
console.log("CITYPULSE NORMALIZED DATA");
console.log("--------------------------------\n");

console.log(
    JSON.stringify(normalizedData, null, 2)
);

console.log(
    `\nSaved to: ${outputPath}`
);