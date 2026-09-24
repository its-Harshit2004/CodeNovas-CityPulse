const fs = require("fs");
const path = require("path");

const { getWeatherData } = require("./sources/weather");
const { getTrafficData } = require("./sources/traffic");
const { getIncidentData } = require("./sources/incidents");


// -----------------------------
// 1. Load raw fixture
// -----------------------------

const fixturePath = path.join(
    __dirname,
    "fixtures",
    "citypulse.json"
);

const rawData = JSON.parse(
    fs.readFileSync(fixturePath, "utf-8")
);


// -----------------------------
// 2. Get source data
// -----------------------------

const weatherData = getWeatherData(rawData);
const trafficData = getTrafficData(rawData);
const incidentData = getIncidentData(rawData);


// -----------------------------
// 3. Normalize weather
// -----------------------------

const weatherEvents = weatherData.map(item => ({
    source: "weather",
    event_type: "rain",
    timestamp: item.timestamp,
    zone_id: item.zone,
    value: item.rainfall,
    unit: "mm",
    metadata: {}
}));


// -----------------------------
// 4. Normalize traffic
// -----------------------------

const trafficEvents = trafficData.map(item => ({
    source: "traffic",
    event_type: "congestion",
    timestamp: item.timestamp,
    zone_id: item.zone,
    value: item.congestion,
    unit: "%",
    metadata: {}
}));


// -----------------------------
// 5. Normalize incidents
// -----------------------------

const incidentEvents = incidentData.map(item => ({
    source: "incident",
    event_type: "complaint",
    timestamp: item.timestamp,
    zone_id: item.zone,
    value: item.complaints,
    unit: "count",
    metadata: {}
}));


// -----------------------------
// 6. Combine everything
// -----------------------------

const normalizedEvents = [
    ...weatherEvents,
    ...trafficEvents,
    ...incidentEvents
];


// -----------------------------
// 7. Sort by timestamp
// -----------------------------

normalizedEvents.sort(
    (a, b) =>
        new Date(a.timestamp) - new Date(b.timestamp)
);


// -----------------------------
// 8. Display result
// -----------------------------

const outputPath = path.join(
    __dirname,
    "fixtures",
    "normalized-events.json"
);

fs.writeFileSync(
    outputPath,
    JSON.stringify(normalizedEvents, null, 2)
);

console.log(`Normalized data written to: ${outputPath}`);

module.exports = normalizedEvents;