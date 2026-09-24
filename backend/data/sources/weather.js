const zones = require("../config/zones");

async function getWeatherData() {
    const zoneEntries = Object.entries(zones);

    const latitudes = zoneEntries
        .map(([_, zone]) => zone.latitude)
        .join(",");

    const longitudes = zoneEntries
        .map(([_, zone]) => zone.longitude)
        .join(",");

    const url =
        `https://api.open-meteo.com/v1/forecast` +
        `?latitude=${latitudes}` +
        `&longitude=${longitudes}` +
        `&current=rain` +
        `&timezone=UTC`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(
            `Weather API failed: ${response.status}`
        );
    }

    const data = await response.json();

    // Multiple locations return an array.
    const weatherResults = Array.isArray(data)
        ? data
        : [data];

    return weatherResults.map((item, index) => ({
        zone: zoneEntries[index][0],
        timestamp: item.current.time,
        rainfall: item.current.rain
    }));
}

module.exports = {
    getWeatherData
};